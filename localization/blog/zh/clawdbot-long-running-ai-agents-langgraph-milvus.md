---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: 为什么 Clawdbot 会成为病毒--以及如何使用 LangGraph 和 Milvus 构建生产就绪的长期运行 Agents
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  Clawdbot 证明了人们需要会行动的人工智能。了解如何利用双 Agents 架构、Milvus 和 LangGraph 构建可投入生产的长期运行
  Agents。
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot（现更名为 OpenClaw）病毒式传播<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a> 现更名为 OpenClaw，上周在互联网上掀起了一场风暴。由彼得-斯坦伯格（Peter Steinberger）开发的这款开源人工智能助手在短短几天内就在<a href="https://github.com/openclaw/openclaw">GitHub</a>上获得了<a href="https://github.com/openclaw/openclaw">110,000+ 个星级</a>。用户发布的视频显示，它能自动为他们办理登机手续、管理电子邮件和控制智能家居设备。OpenAI 的创始工程师 Andrej Karpathy 对它大加赞赏。科技公司创始人兼投资人大卫-萨克斯（David Sacks）在推特上对它大加赞赏。人们称它为 "真实的 Jarvis"。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>然后是安全警告。</p>
<p>研究人员发现了数百个暴露的管理面板。机器人默认以 root 访问权限运行没有沙盒。提示注入漏洞会让攻击者劫持 Agents。安全噩梦</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot 病毒传播的原因<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot 的流行是有原因的。</strong>它可在本地或自己的服务器上运行。它可以连接到人们已经在使用的消息应用--WhatsApp、Slack、Telegram 和 iMessage。它能长期记忆上下文，而不是在每次回复后忘记所有内容。它能管理日历、汇总电子邮件，并自动执行跨应用程序的任务。</p>
<p>用户会感觉到它是一个不需要干预、始终在线的个人人工智能，而不仅仅是一个提示和响应工具。它的开源、自托管模型吸引了希望获得控制权和定制化服务的开发者。而且它易于与现有工作流程集成，便于分享和推荐。</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">构建长期运行 Agents 的两大挑战<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot 的流行证明，人们需要的是能</strong> <em>采取行动</em><strong>的人工智能，</strong><strong>而不仅仅是回答问题。</strong>但是，任何能长期运行并完成实际任务的 Agents--无论是 Clawdbot 还是你自己构建的--都必须解决两个技术难题：<strong>内存</strong>和<strong>验证</strong>。</p>
<p><strong>记忆问题有</strong>多种表现形式：</p>
<ul>
<li><p>代理会在任务中期耗尽上下文窗口，留下半成品</p></li>
<li><p>他们忽略了完整的任务列表，过早宣布 "完成"。</p></li>
<li><p>他们无法在会话之间移交上下文，因此每个新会话都要从头开始</p></li>
</ul>
<p>所有这些问题的根源都在于：Agent 没有持久内存。上下文窗口是有限的，跨会话检索也是有限的，而且 Agents 无法跟踪进度。</p>
<p><strong>验证问题</strong>则不同。即使在内存有效的情况下，Agent 仍会在快速单元测试后将任务标记为已完成，而不检查该功能是否真的能端到端运行。</p>
<p>Clawdbot 解决了这两个问题。Clawdbot 跨会话本地存储内存，并使用模块化 "技能 "来自动处理浏览器、文件和外部服务。这种方法行之有效。但它并不适合生产。对于企业级应用，你需要结构、可审计性和安全性，而 Clawdbot 并不能提供这些。</p>
<p>本文将介绍与生产就绪解决方案相同的问题。</p>
<p>在记忆方面，我们采用了基于<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic 研究的</a> <strong>双 Agents 架构</strong>：一个初始化代理将项目分解为可验证的功能，另一个编码代理以干净利落的交接方式逐一完成项目。为了实现跨会话语义调用，我们使用了<a href="https://milvus.io/">Milvus</a>，这是一个向量数据库，可让 Agents 通过意义而非关键字进行搜索。</p>
<p>在验证方面，我们使用<strong>浏览器自动化</strong>。Agents 不信任单元测试，而是以真实用户的方式测试功能。</p>
<p>我们将简要介绍这些概念，然后展示使用<a href="https://github.com/langchain-ai/langgraph">LangGraph</a>和 Milvus 实现的工作。</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">双 Agents 架构如何防止上下文耗尽<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>每个 LLM 都有一个上下文窗口：这是它一次能处理多少文本的限制。当 Agents 执行一项复杂任务时，这个窗口就会被代码、错误信息、对话历史和文档填满。一旦窗口填满，Agent 要么停止工作，要么开始遗忘之前的上下文。对于长期运行的任务来说，这是不可避免的。</p>
<p>考虑给 Agents 一个简单的提示："构建一个 claude.ai 的克隆"。该项目需要身份验证、聊天界面、对话历史、流式响应以及其他几十种功能。单个 Agents 会尝试同时解决所有问题。在实现聊天界面的中途，上下文窗口被填满。会话结束时，代码只写了一半，没有关于尝试内容的文档，也不知道哪些可行，哪些不可行。下一次会话继承的是一团糟。即使进行了上下文压缩，新的 Agents 也不得不猜测前一个会话在做什么，调试它没有编写的代码，并找出继续运行的位置。在取得任何新进展之前，都要浪费好几个小时。</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">双重代理解决方案</h3><p>Anthropic 的解决方案在他们的工程帖子<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"长期运行 Agents 的有效线束 "</a>中有所描述，即使用两种不同的提示模式：第一会话使用<strong>初始化提示</strong>，后续会话使用<strong>编码提示</strong>。</p>
<p>从技术上讲，这两种模式使用相同的底层代理、系统提示、工具和线束。唯一不同的是初始用户提示。但由于它们的作用不同，将它们视为两个独立的 Agents 是一个有用的心理模型。我们称之为双 Agents 架构。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>初始化器为渐进式进展设置环境。</strong>它接受一个模糊的请求，并做三件事：</p>
<ul>
<li><p><strong>将项目分解为具体的、可验证的功能。</strong>不是像 "制作一个聊天界面 "这样模糊的要求，而是具体的、可测试的步骤："用户点击新建聊天按钮→侧边栏出现新对话→聊天区显示欢迎状态"。Anthropic的claude.ai克隆示例有200多个这样的功能。</p></li>
<li><p><strong>创建进度跟踪文件。</strong>该文件记录了每个功能的完成状态，因此任何会话都能看到已完成和剩余的功能。</p></li>
<li><p><strong>编写设置脚本并进行初始 git 提交。</strong> <code translate="no">init.sh</code> 等脚本能让未来的会话快速启动开发环境。git 提交会建立一个干净的基线。</p></li>
</ul>
<p>初始化程序不仅仅是规划。它创建的基础架构能让未来的会话立即开始工作。</p>
<p><strong>编码代理</strong>处理每个后续会话。它</p>
<ul>
<li><p>读取进度文件和 git 日志，了解当前状态</p></li>
<li><p>运行基本的端到端测试，以确认应用程序仍在运行</p></li>
<li><p>选择一项功能</p></li>
<li><p>执行该功能，对其进行全面测试，提交到 git 并附上说明性信息，更新进度文件</p></li>
</ul>
<p>会话结束时，代码库处于可合并状态：无重大错误、代码有序、文档清晰。没有半成品，也没有神秘的工作内容。下一次会话将从这次会话结束的地方继续进行。</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">使用 JSON 进行特性跟踪，而不是 Markdown</h3><p><strong>有一个实施细节值得注意：功能列表应该是 JSON 格式，而不是 Markdown 格式。</strong></p>
<p>在编辑 JSON 时，人工智能模型往往会对特定字段进行外科手术式的修改。而在编辑 Markdown 时，它们往往会重写整个部分。由于功能列表超过 200 项，Markdown 编辑可能会意外破坏进度跟踪。</p>
<p>一个 JSON 条目是这样的</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>每个功能都有明确的验证步骤。<code translate="no">passes</code> 字段跟踪完成情况。还建议使用措辞强硬的说明，如 "删除或编辑测试是不可接受的，因为这可能导致功能缺失或错误"，以防止代理通过删除困难的功能来玩弄系统。</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Milvus 如何为代理提供跨会话语义记忆<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>双 Agents 架构解决了上下文枯竭问题，但并没有解决遗忘问题。</strong>即使会话之间的交接干净利落，Agents 也会丢失它所学到的知识。除非进度文件中出现 "JWT 刷新令牌 "和 "用户身份验证 "这两个准确的单词，否则它就记不起来了。随着项目的增长，在数以百计的 git 提交中搜索会变得很慢。关键字匹配会遗漏一些对人类来说显而易见的联系。</p>
<p><strong>这就是向量数据库的用武之地。</strong>向量数据库不是存储文本和搜索关键字，而是将文本转换为表示意义的数字。当你搜索 "用户身份验证 "时，它会找到关于 "JWT 刷新令牌 "和 "登录会话处理 "的条目。这并不是因为单词匹配，而是因为这些概念在语义上非常接近。Agents 可以询问 "我以前见过类似的东西吗？"并得到有用的答案。</p>
<p><strong>在实际操作中，这可以通过将进度记录和 git 提交作为向量嵌入数据库来实现。</strong>当编码会话开始时，Agent 会以当前任务查询数据库。数据库会以毫秒为单位返回相关历史记录：之前尝试过什么、什么成功了、什么失败了。Agents 并非从零开始。它从上下文开始。</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>非常适合这种用例。</strong>它是开源的，专为生产规模的向量搜索而设计，处理数十亿向量不费吹灰之力。对于小型项目或本地开发，<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>可以直接嵌入到 SQLite 等应用程序中。无需集群设置。当项目发展壮大时，你可以迁移到分布式 Milvus，而无需更改代码。对于生成 Embeddings，你可以使用像<a href="https://www.sbert.net/">SentenceTransformer</a>这样的外部模型进行精细控制，也可以参考这些<a href="https://milvus.io/docs/embeddings.md">内置的嵌入函数</a>进行更简单的设置。Milvus 还支持<a href="https://milvus.io/docs/hybridsearch.md">混合搜索</a>，将向量相似性与传统过滤相结合，因此你只需一次调用就能查询 "查找上周类似的身份验证问题"。</p>
<p><strong>这也解决了转移问题。</strong>向量数据库在任何一次会话之外都会持续存在，因此知识会随着时间的推移不断积累。会话 50 可以访问会话 1 到会话 49 中学习到的所有知识。该项目形成了机构记忆。</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">通过自动测试验证完成情况<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>即使有了双 Agents 架构和长期记忆，Agents 仍有可能过早宣布胜利。这就是验证问题。</strong></p>
<p>下面是一种常见的失败模式：一个编码会话完成了一个功能，运行了一个快速单元测试，看到它通过了，就把<code translate="no">&quot;passes&quot;: false</code> 转到<code translate="no">&quot;passes&quot;: true</code> 。但是，单元测试通过并不意味着该功能真的能运行。应用程序接口可能会返回正确的数据，而用户界面却因为 CSS bug 而无法显示任何内容。进度文件显示 "完成"，而用户却什么也看不到。</p>
<p><strong>解决方案是让 Agents 像真实用户一样进行测试。</strong>功能列表中的每个功能都有具体的验证步骤："用户点击新建聊天按钮 → 新对话出现在侧边栏 → 聊天区显示欢迎状态"。Agents 应按字面意思验证这些步骤。它不能只运行代码级测试，而是要使用 Puppeteer 等浏览器自动化工具来模拟实际使用情况。它会打开页面、点击按钮、填写表格，并检查屏幕上是否出现了正确的元素。只有当整个流程通过后，Agent 才会标记功能完成。</p>
<p><strong>这样就能发现单元测试遗漏的问题</strong>。聊天功能可能有完美的后台逻辑和正确的 API 响应。但如果前端没有呈现回复，用户就什么也看不到。浏览器自动化可以对结果进行截图，并验证屏幕上显示的内容是否与应该显示的内容一致。只有当该功能真正实现端到端工作时，<code translate="no">passes</code> 字段才会变成<code translate="no">true</code> 。</p>
<p><strong>不过，这也有局限性。</strong>Puppeteer 等工具无法自动执行某些浏览器原生功能。文件选择器和系统确认对话框就是常见的例子。<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic 指出</a>，依赖于浏览器原生警报模态的功能往往漏洞较多，因为代理无法通过 Puppeteer 看到它们。实际的解决方法是围绕这些限制进行设计。尽可能使用自定义 UI 组件而不是本地对话框，这样代理就能测试功能列表中的每个验证步骤。</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">组合在一起：会话状态的 LangGraph 和长期记忆的 Milvus<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>上述概念通过两个工具整合到一个工作系统中：用于会话状态的 LangGraph 和用于长期记忆的 Milvus。</strong>LangGraph 管理单个会话中正在发生的事情：正在处理哪个功能、完成了什么、下一步是什么。Milvus 可存储跨会话的可搜索历史记录：之前做了什么、遇到了什么问题、哪些解决方案有效。它们共同为 Agents 提供了短期和长期记忆。</p>
<p><strong>关于实现方法的说明：</strong>下面的代码是一个简化的演示。它在一个脚本中展示了核心模式，但并没有完全复制前面描述的会话分离。在生产设置中，每个编码会话都将是一个单独的调用，可能在不同的机器上或不同的时间进行。LangGraph 中的<code translate="no">MemorySaver</code> 和<code translate="no">thread_id</code> 通过在调用之间持久化状态来实现这一点。要清楚地看到恢复行为，可以运行一次脚本，然后停止，再以相同的<code translate="no">thread_id</code> 运行一次。第二次运行将从第一次中断的地方继续。</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">结论</h3><p>人工智能 Agents 无法完成长期运行的任务，是因为它们缺乏持久内存和适当的验证。Clawdbot 通过解决这些问题而走红，但它的方法并不适合生产。</p>
<p>本文介绍了三种可用于生产的解决方案：</p>
<ul>
<li><p><strong>双 Agents 架构：</strong>一个初始化器将项目分解为可验证的功能；一个编码 Agents 一次完成一个功能，交接干净利落。这样既能防止上下文耗尽，又能跟踪进度。</p></li>
<li><p><strong>用于语义记忆的向量数据库：</strong> <a href="https://milvus.io/">Milvus</a>将进度记录和 git 提交作为 Embeddings 储存起来，因此 Agents 可以通过意义而非关键字进行搜索。会话 50 会记住会话 1 所学到的内容。</p></li>
<li><p><strong>浏览器自动化实现真正的验证：</strong>单元测试验证代码是否运行。Puppeteer 通过测试用户在屏幕上看到的内容来检查功能是否真正运行。</p></li>
</ul>
<p>这些模式并不局限于软件开发。科学研究、金融模型、法律文件审查--任何跨越多个会话、需要可靠交接的任务都能从中受益。</p>
<p>核心原则</p>
<ul>
<li><p>使用初始化器将工作分解成可验证的小块</p></li>
<li><p>以结构化、机器可读的格式跟踪进度</p></li>
<li><p>将经验存储在向量数据库中，以便进行语义检索</p></li>
<li><p>通过实际测试而不仅仅是单元测试来验证完成情况</p></li>
<li><p>设计清晰的会话边界，以便安全地暂停和恢复工作</p></li>
</ul>
<p>工具已经存在。模式是经过验证的。剩下的就是应用它们了。</p>
<p><strong>准备好开始了吗？</strong></p>
<ul>
<li><p>探索<a href="https://milvus.io/">Milvus</a>和<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>，为您的 Agents 添加语义记忆</p></li>
<li><p>查看用于管理会话状态的 LangGraph</p></li>
<li><p>阅读<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic</a>关于长期运行的 Agents 线束<a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">的完整研究报告</a></p></li>
</ul>
<p><strong>有问题或想分享您的构建成果？</strong></p>
<ul>
<li><p>加入<a href="https://milvus.io/slack">Milvus Slack 社区</a>，与其他开发人员交流。</p></li>
<li><p>参加<a href="https://milvus.io/office-hours">Milvus 办公时间</a>，与团队进行现场问答</p></li>
</ul>
