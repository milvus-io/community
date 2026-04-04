---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: MCP 死了吗？我们从 MCP、CLI 和 Agents 技能中学到的建设经验
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: MCP 会吃掉上下文，在生产中会崩溃，而且不能重复使用 Agents 的 LLM。我们在构建过程中使用了这三种方案--以下是每种方案的适用情况。
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>当 Perplexity 的首席技术官丹尼斯-亚拉茨（Denis Yarats）在 ASK 2026 大会上表示公司内部正在取消 MCP 的优先级时，这引发了一个惯常的循环。YC 首席执行官加里-谭（Garry Tan）大加指责--MCP 占用了太多的上下文窗口，自动验证功能被破坏，他在 30 分钟内就创建了一个 CLI 替代程序。黑客新闻》强烈反对 MCP。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>一年前，这种程度的公开质疑并不常见。模型上下文协议（MCP）被定位为<a href="https://zilliz.com/glossary/ai-agents">人工智能 Agents</a>工具集成的最终标准。服务器数量每周翻一番。从那时起，这种模式就像我们熟悉的弧线：迅速炒作，广泛采用，然后生产幻灭。</p>
<p>业界正在迅速做出反应。Bytedance 的 Lark/Feishu 开源了他们的官方 CLI - 涵盖 11 个业务领域的 200 多条命令，内置 19 种 Agents 技能。谷歌发布了用于谷歌工作空间的 gws。CLI + Skills 模式正迅速成为企业代理工具的默认模式，而不是小众的替代方案。</p>
<p>在 Zilliz，我们发布了<a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>，让您可以直接从终端操作和管理<a href="https://milvus.io/intro">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（完全托管的 Milvus），而无需离开编码环境。在此基础上，我们构建了<a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills</a>和<a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills</a>，这样像 Claude Code 和 Codex 这样的人工智能编码 Agents 就可以通过自然语言管理您的<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>。</p>
<p>一年前，我们还为 Milvus 和 Zilliz Cloud 构建了 MCP 服务器。那次经历让我们清楚地了解到 MCP 在哪些方面存在缺陷，以及在哪些方面仍然适用。三个架构限制将我们推向了 CLI 和 Skills：上下文窗口臃肿、被动的工具设计以及无法重用 Agents 自身的 LLM。</p>
<p>在这篇文章中，我们将逐一分析这些问题，展示我们正在构建的替代方案，并为在 MCP、CLI 和 Agents Skills 之间做出选择提供一个实用框架。</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCP 占用了启动时 72% 的上下文窗口<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>标准的 MCP 设置会在 Agents 采取任何行动之前占用 72% 左右的可用上下文窗口。在 200K 标记模型上连接三个服务器（GitHub、Playwright 和集成开发环境集成），仅工具定义就占用了大约 143K 标记。Agents 还什么都没做。它已经满了四分之三。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>代价不仅仅是代币。上下文中无关的内容越多，模型对真正重要内容的关注就越弱。在上下文中加入 100 个工具 Schema 意味着 Agents 在每次决策时都要浏览所有的 Schema。研究人员记录了他们所谓的 "<em>上下文腐烂"（context rot</em>）--上下文超载导致推理质量下降。在实测测试中，随着工具数量的增加，工具选择的准确率从 43% 降至 14% 以下。矛盾的是，工具越多，工具的使用就越糟糕。</p>
<p>根本原因在于架构。MCP 在会话开始时会完整加载所有工具描述，而不管当前会话是否会使用这些工具。这是协议层面的设计选择，而不是错误，但每增加一种工具，成本就会增加。</p>
<p>Agents 技能采用的是另一种方法：<strong>渐进式披露</strong>。在会话开始时，Agent 只读取每个技能的元数据--名称、单行描述、触发条件。总共只有几十个标记。只有在 Agents 认为相关时，才会加载完整的技能内容。可以这样想：MCP 把所有工具都排在门口，让你自己选择；而 Skills 则是先给你一个索引，然后按需提供完整内容。</p>
<p>CLI 工具也有类似的优势。Agents 可运行 git --help 或 docker --help 按需发现功能，而无需预先加载每个参数定义。上下文成本随用随付，无需预付。</p>
<p>在小规模应用中，这种差异可以忽略不计。在生产规模上，这就是一个能正常工作的 Agents 与一个沉溺于自身工具定义的 Agents 之间的区别。</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">MCP 的被动架构限制了 Agents 的工作流程<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP 是一种工具调用协议：如何发现工具、调用工具并接收结果。设计简洁，用例简单。但这种简洁也是一种限制。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">无层次的扁平工具空间</h3><p>MCP 工具是一个扁平的函数签名。没有子命令，不知道会话生命周期，不知道 Agents 在多步骤工作流程中的位置。它等待被调用。这就是它的全部功能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>git commit、git push 和 git log 是完全不同的执行路径，共用一个界面。Agents 会运行--help，逐步探索可用的界面，并只扩展所需的内容--而不会将所有参数文档前置到上下文中。</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">技能编码工作流逻辑--MCP 不能</h3><p>Agents 技能是一个 Markdown 文件，其中包含标准操作符：首先要做什么、接下来要做什么、如何处理失败以及何时向用户展示某些内容。Agents 收到的不仅仅是一个工具，而是整个工作流程。技能会主动塑造 Agents 在对话中的行为方式--什么会触发他们，他们会提前准备什么，以及他们如何从错误中恢复。MCP 工具只能等待。</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP 无法访问 Agents 的 LLM</h3><p>这个限制实际上阻止了我们。</p>
<p>当我们构建<a href="https://github.com/zilliztech/claude-context">claude-context</a>时（这是一个 MCP 插件，可为 Claude Code 和其他人工智能编码代理添加<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>，让它们从整个代码库中获得深度上下文），我们希望从 Milvus 中检索相关的历史对话片段，并将其作为上下文浮现出来。<a href="https://zilliz.com/learn/vector-similarity-search">向量搜索</a>检索奏效了。问题是如何处理这些结果。</p>
<p>检索前 10 个结果，可能有 3 个是有用的。其他 7 个是噪音。如果将所有 10 个结果都交给外部 Agents，噪音就会干扰答案。在测试中，我们发现响应会被无关的历史记录干扰。我们需要在传递结果之前进行过滤。</p>
<p>我们尝试了几种方法。使用小型模型在 MCP 服务器内添加重排步骤：不够准确，相关性阈值需要根据使用情况进行调整。使用大型模型进行重排：技术上可行，但 MCP 服务器作为独立进程运行，无法访问外部 Agents 的 LLM。我们必须配置单独的 LLM 客户端，管理单独的 API 密钥，并处理单独的调用路径。</p>
<p>我们想要的很简单：让外部 Agents 的 LLM 直接参与过滤决策。检索前 10 条，让 Agents 自己判断哪些值得保留，然后只返回相关结果。无需第二个模型。无需额外的 API 密钥。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP 无法做到这一点。服务器和 Agents 之间的流程边界也是智能边界。服务器无法使用 Agents 的 LLM；Agent 无法控制服务器内部发生的事情。对于简单的 CRUD 工具来说，这很好。一旦工具需要做出判断，这种隔离就会成为真正的限制。</p>
<p>Agents 技能可以直接解决这个问题。检索技能可以调用向量搜索前 10 名，让 Agents 自己的 LLM 评估相关性，然后只返回通过的结果。无需额外的模型。Agents 自己完成过滤。</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">我们利用 CLI 和技能构建的系统<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>我们将 CLI + Skills 视为 Agents 与工具交互的方向，这不仅适用于记忆检索，还适用于整个堆栈。这种信念推动着我们正在构建的一切。</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch：基于技能的人工智能代理记忆层</h3><p>我们为克劳德代码和其他人工智能 Agents 构建了一个开源记忆层--<a href="https://github.com/zilliztech/memsearch">memsearch</a>。该技能在一个子代理内运行，分为三个阶段：Milvus 处理初始向量搜索，以进行广泛的发现；Agents 自己的 LLM 评估相关性，并为有希望的搜索结果扩展上下文；最后的下钻仅在需要时访问原始对话。噪音在每个阶段都会被剔除--中间检索垃圾永远不会到达主要上下文窗口。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>关键之处在于：Agent 的智能是工具执行的一部分。循环中的 LLM 已经完成了过滤工作--没有第二个模型，没有额外的 API 密钥，没有脆性阈值调整。这是一个特定用例--编码代理的对话上下文检索--但该架构适用于工具需要判断而不仅仅是执行的任何场景。</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">用于向量数据库操作的 Zilliz CLI、技能和插件</h3><p>Milvus 是世界上采用最广泛的开源向量数据库，<a href="https://github.com/milvus-io/milvus">在 GitHub 上</a>拥有<a href="https://github.com/milvus-io/milvus">43K+ 星级</a>。<a href="https://zilliz.com/cloud">Zilliz Cloud</a>是 Milvus 的全面托管服务，具有先进的企业级功能，速度比 Milvus 快得多。</p>
<p>上述分层架构同样驱动着我们的开发者工具：</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>是基础架构层。集群管理、<a href="https://milvus.io/docs/manage-collections.md">Collections 操作</a>、向量搜索、<a href="https://milvus.io/docs/rbac.md">RBAC</a>、备份、计费--您在 Zilliz Cloud 控制台中的一切操作，都可以在终端上完成。人类和 Agents 使用相同的命令。Zilliz CLI 也是 Milvus Skills 和 Zilliz Skills 的基础。</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skill</a>是开源 Milvus 的知识层。它通过<a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>Python 代码教授人工智能编码 Agents（Claude Code、Cursor、Codex、GitHub Copilot）操作任何 Milvus 部署（<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>、Standalone 或 Distributed）：连接、<a href="https://milvus.io/docs/schema-hands-on.md">Schema 设计</a>、CRUD、<a href="https://zilliz.com/learn/hybrid-search-with-milvus">混合搜索</a>、<a href="https://milvus.io/docs/full-text-search.md">全文搜索</a>、<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 管道</a>。</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a>对 Zilliz Cloud 也是如此，通过 Zilliz CLI 教 Agents 管理云基础设施。</li>
<li><a href="https://github.com/zilliztech/zilliz-plugin">Zilliz Plugin</a>是 Claude Code 的开发人员体验层--通过 /zilliz:quickstart 和 /zilliz:status 等斜线命令，将 CLI + Skill 包装成一种引导式体验。</li>
</ul>
<p>CLI 负责执行，Skills 编码知识和工作流程逻辑，Plugin 提供用户体验。循环中没有 MCP 服务器。</p>
<p>更多详情，请查看这些资源：</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">介绍 Zilliz CLI 和 Zilliz Cloud 的 Agents 技能</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud 刚刚在克劳德代码中登陆</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">人工智能提示 - Zilliz Cloud 开发人员中心</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI 参考 - Zilliz Cloud 开发人员中心</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz 技能 - Zilliz Cloud 开发人员中心</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">用于人工智能 Agents 的 Milvus - Milvus 文档</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">MCP 是否真的正在消亡？<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>包括我们 Zilliz 在内的许多开发人员和公司都在转向 CLI 和 Skills。但 MCP 真的会消亡吗？</p>
<p>简短的回答是：没有，但它的适用范围正在缩小。</p>
<p>MCP 已捐赠给 Linux 基金会。活跃服务器数量超过 10,000 台。SDK 每月下载量达 9700 万次。如此规模的生态系统不会因为一次会议的评论而消失。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hacker News 的一个主题--<em>"MCP 与 CLI 相比，什么时候才有意义？</em>- 引来的回复大多倾向于 CLI："CLI 工具就像精密仪器"、"CLI 也比 MCP 感觉更敏捷"。一些开发人员则持有更为平衡的观点：技能是帮助您更好地解决问题的详细配方；MCP 是帮助您解决问题的工具。两者都有自己的用武之地。</p>
<p>这很公平，但也提出了一个实际问题。如果配方本身可以指导 Agents 使用哪些工具以及如何使用，那么是否还需要单独的工具分配协议？</p>
<p>这取决于使用情况。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>通过 stdio 的 MCP</strong>（大多数开发人员在本地运行的版本）是问题累积的地方：进程间通信不稳定、环境隔离混乱、令牌开销大。在这种情况下，几乎所有用例都有更好的替代方案。</p>
<p><strong>而 HTTP 上的 MCP</strong>则不同。企业内部工具平台需要集中的权限管理、统一的 OAuth、标准化的遥测和日志记录。零散的 CLI 工具确实难以提供这些功能。在这种情况下，MCP 的集中式架构具有真正的价值。</p>
<p>Perplexity 实际上放弃的主要是 stdio 用例。丹尼斯-亚拉兹（Denis Yarats）指定的是 "内部"，并没有要求整个行业采用这一选择。这一细微差别在传播过程中丢失了--"Perplexity 放弃 MCP "的传播速度远远快于 "Perplexity 在内部工具集成中将 MCP 排除在 stdio 之外"。</p>
<p>MCP 的出现是因为它解决了一个实际问题：在它出现之前，每个人工智能应用程序都编写自己的工具调用逻辑，没有共享标准。MCP 在适当的时候提供了一个统一的接口，生态系统迅速建立起来。随后，生产经验让局限性浮出水面。这是基础架构工具的正常发展轨迹，而不是死刑判决。</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">何时使用 MCP、CLI 或技能<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th></th><th>通过 stdio 的 MCP（本地）</th><th>通过 HTTP 的 MCP（企业）</th></tr>
</thead>
<tbody>
<tr><td><strong>身份验证</strong></td><td>无</td><td>集中式 OAuth</td></tr>
<tr><td><strong>连接稳定性</strong></td><td>进程隔离问题</td><td>稳定的 HTTPS</td></tr>
<tr><td><strong>日志记录</strong></td><td>无标准机制</td><td>集中遥测</td></tr>
<tr><td><strong>访问控制</strong></td><td>无</td><td>基于角色的权限</td></tr>
<tr><td><strong>我们的看法</strong></td><td>用 CLI + 技能取代</td><td>保留企业工具</td></tr>
</tbody>
</table>
<p>对于选择<a href="https://zilliz.com/glossary/ai-agents">Agents 人工智能</a>工具栈的团队来说，以下是各层之间的关系：</p>
<table>
<thead>
<tr><th>层</th><th>作用</th><th>最适合</th><th>示例</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>操作符、基础设施管理</td><td>Agents 和人类都能运行的命令</td><td>git、docker、zilliz-cli</td></tr>
<tr><td><strong>技能</strong></td><td>Agents 工作流程逻辑、编码知识</td><td>需要 LLM 判断、多步骤 SOP 的任务</td><td>Milvus 技能、zilliz 技能、memsearch</td></tr>
<tr><td><strong>REST API</strong></td><td>外部集成</td><td>连接第三方服务</td><td>GitHub API、Slack API</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>企业工具平台</td><td>集中授权、审计日志</td><td>内部工具网关</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">开始使用<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>我们在本文中讨论的所有内容现在都已可用：</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>- 人工智能 Agents 基于技能的记忆层。将其放入克劳德代码或任何支持技能的 Agents 中。</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a>- 从终端管理 Milvus 和 Zilliz Cloud。安装它并探索 Agents 可以使用的子命令。</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a>和<a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Skill</strong></a>- 为您的人工智能编码代理提供原生的 Milvus 和 Zilliz Cloud 知识。</li>
</ul>
<p>有关于向量搜索、Agent 架构或使用 CLI 和 Skills 构建的问题？加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区</a>或<a href="https://milvus.io/office-hours">预约免费的 Office Hours 会议</a>，讨论您的使用案例。</p>
<p>准备好构建了吗？<a href="https://cloud.zilliz.com/signup">注册 Zilliz Cloud</a>- 使用工作电子邮件的新账户可获得 100 美元的免费点数。已有账户？<a href="https://cloud.zilliz.com/login">在此登录</a>。</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常见问题<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">人工智能 Agents 的 MCP 有什么问题？</h3><p>MCP 在生产中有三大架构限制。首先，它会在会话开始时将所有工具 Schema 加载到上下文窗口中--在一个 20 万个令牌的模型上连接三台 MCP 服务器，就能在 Agents 采取任何行动之前消耗掉 70% 以上的可用上下文。其次，MCP 工具是被动的：它们等待被调用，无法编码多步骤工作流、错误处理逻辑或标准操作符。第三，MCP 服务器作为独立进程运行，无法访问代理的 LLM，因此任何需要判断的工具（如过滤搜索结果的相关性）都需要配置一个独立的模型，并拥有自己的 API 密钥。这些问题在通过 stdio 传输的 MCP 中最为突出；而通过 HTTP 传输的 MCP 则可以缓解其中的一些问题。</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">MCP 和 Agents Skills 有什么区别？</h3><p>MCP 是一种工具调用协议，它定义了 Agents 如何发现和调用外部工具。Agents Skill 是一个 Markdown 文件，包含完整的标准操作程序--触发器、分步说明、错误处理和升级规则。关键的架构差异：技能在 Agents 流程内运行，因此可以利用 Agents 自身的 LLM 进行相关性过滤或结果重排等判断。MCP 工具在单独的流程中运行，无法访问 Agents 的智能。技能还使用渐进式披露--只在启动时加载轻量级元数据，并在需要时加载完整内容--与 MCP 的预加载 Schema 相比，保持最小的上下文窗口使用量。</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">什么情况下仍应使用 MCP 而不是 CLI 或 Skills？</h3><p>对于需要集中式 OAuth、基于角色的访问控制、标准化遥测以及跨多个内部工具的审计日志的企业工具平台来说，HTTP MCP 仍然很有意义。零散的 CLI 工具很难一致地满足这些企业要求。对于本地开发工作流（Agent 与您机器上的工具进行交互），CLI + Skills 通常比通过 stdio 的 MCP 提供更好的性能、更低的上下文开销和更灵活的工作流逻辑。</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">CLI 工具和 Agents 技能如何协同工作？</h3><p>CLI 提供执行层（实际命令），而技能提供知识层（何时运行哪些命令、以何种顺序运行以及如何处理故障）。例如，Zilliz CLI 可处理集群管理、 Collections CRUD 和向量搜索等基础设施操作。Milvus Skill 会向代理传授 Schema 设计、混合搜索和 RAG 管道的正确 pymilvus 模式。CLI 完成工作；Skill 了解工作流程。这种分层模式--CLI 负责执行，Skills 负责知识，插件负责用户体验--是我们在 Zilliz 构建所有开发人员工具的方式。</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs Skills vs CLI：什么时候应该分别使用？</h3><p>CLI工具（如git、docker或zilliz-cli）最适合用于操作任务--它们暴露了分层子命令，并可按需加载。Milvus-skill 等技能最适合代理工作流逻辑--它们承载操作程序、错误恢复，并能访问代理的 LLM。通过 HTTP 传输的 MCP 仍适合需要集中式 OAuth、权限和审计日志的企业工具平台。在大多数生产设置中，通过 stdio 的 MCP（本地版本）正在被 CLI + Skills 所取代。</p>
