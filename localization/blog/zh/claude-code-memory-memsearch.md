---
id: claude-code-memory-memsearch.md
title: 我们阅读了克劳德代码的泄露源代码。它的内存是如何工作的
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  Claude Code 泄露的源代码显示，内存有 4 层，上限为 200 行，只能用 grep 搜索。下面是每一层的工作原理和 memsearch
  的修复方法。
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>克劳德代码》的源代码意外公开发布。2.1.88 版包含一个 59.8 MB 的源代码映射文件，本应从构建中删除。这个文件包含了完整的、可读的 TypeScript 代码库--512,000 行，现在镜像在 GitHub 上。</p>
<p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">内存系统</a>引起了我们的注意。克劳德代码是市场上最流行的人工智能编码 Agents，而内存是大多数用户在不了解其工作原理的情况下与之交互的部分。于是我们深入研究了一下。</p>
<p>简而言之：克劳德代码的内存比你想象的要基础得多。它的上限是 200 行笔记。它只能通过精确的关键字匹配来查找记忆--如果你问的是 "端口冲突"，而笔记上写的是 "docker-compose 映射"，那么你什么也得不到。而且，这些内容都没有留下克劳德代码。换一个 Agents，你就从零开始了。</p>
<p>下面是四个层</p>
<ul>
<li><strong>CLAUDE.md</strong>- 你自己编写的文件，其中包含了克劳德需要遵循的规则。手动、静态，受限于你事先写下的内容。</li>
<li><strong>自动记忆</strong>--克劳德在会话过程中会自己记笔记。非常有用，但索引上限为 200 行，且不能按含义搜索。</li>
<li><strong>自动梦境</strong>--一个后台清理程序，可在你闲置时整合杂乱的记忆。有助于处理数天前的杂乱记忆，但无法弥补数月前的记忆。</li>
<li><strong>KAIROS</strong>- 在泄露的代码中发现的未发布的始终在线守护进程模式。目前尚未公开。</li>
</ul>
<p>下面，我们将对每一层进行解包，然后介绍架构的缺陷所在，以及我们为弥补这些缺陷而构建的架构。</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">CLAUDE.md 如何工作？<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md 是一个 Markdown 文件，由你创建并放置在你的项目文件夹中。您可以在其中填入任何希望克劳德记住的内容：代码样式规则、项目结构、测试命令、部署步骤。克劳德会在每次会话开始时加载该文件。</p>
<p>有三个范围：项目级（在 repo 根目录下）、个人级（<code translate="no">~/.claude/CLAUDE.md</code> ）和组织级（企业配置）。较短的文件会得到更可靠的跟踪。</p>
<p>限制是显而易见的：CLAUDE.md 只能保存你事先写下的内容。调试决定、你在谈话中提到的偏好、你们一起发现的边缘情况，这些都不会被记录下来，除非你停下来手动添加。大多数人都不会这样做。</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">自动记忆功能如何工作？<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>自动记忆会捕捉工作中出现的内容。克劳德会决定哪些内容值得保留，并将其写入你机器上的记忆文件夹，分为四类：用户（角色和偏好）、反馈（你的修正）、项目（决策和上下文）和参考（内容所在位置）。</p>
<p>每个笔记都是一个单独的 Markdown 文件。入口是<code translate="no">MEMORY.md</code> - 一个索引，其中每一行都是一个简短的标签（150 个字符以下），指向一个详细的文件。克劳德会读取索引，然后在相关文件出现时提取特定文件。</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>每个会话都会加载 MEMORY.md 的前 200 行。除此之外的内容都是不可见的。</p>
<p>一个聪明的设计选择是：泄露的系统提示告诉克劳德将自己的内存视为一个提示，而不是事实。在根据记忆中的内容采取行动之前，它会先对照真实代码进行验证，这有助于减少幻觉--其他<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">人工智能 Agents 框架</a>也开始采用这种模式。</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">自动梦境如何巩固陈旧记忆？<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>自动记忆会捕捉笔记，但使用数周后，这些笔记就会过时。一条写着 "昨天部署错误 "的记录在一周后就变得毫无意义。一条记录说你使用 PostgreSQL，而更新的记录却说你迁移到了 MySQL。删除的文件仍有内存条目。索引中充满了矛盾和过时的引用。</p>
<p>Auto Dream 就是清理程序。它在后台运行，并且</p>
<ul>
<li>用准确的日期替换模糊的时间引用。"昨天的部署问题"→"2026-03-28 部署问题"。</li>
<li>解决矛盾。PostgreSQL 备注 + MySQL 备注 → 保留当前真相。</li>
<li>删除陈旧条目。删除已删除文件或已完成任务的注释。</li>
<li>将<code translate="no">MEMORY.md</code> 控制在 200 行以内。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>触发条件：</strong>距离上次清理超过 24 小时，并且至少积累了 5 个新会话。也可以输入 "dream "手动运行。该进程在后台子 Agents 中运行--就像真正的睡眠一样，它不会干扰你正在进行的工作。</p>
<p>Dream Agent 的系统提示以以下内容开头：<em>"您正在执行一个梦境--对您的记忆文件进行反思"</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">什么是 KAIROS？克劳德代码未发布的 "始终开启 "模式<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>前三层已经上线或推出。泄露的代码中还包含一些尚未发布的内容：KAIROS。</p>
<p>KAIROS 显然是以希腊语中 "正确时刻 "一词命名的，在源代码中出现了 150 多次。它将把克劳德代码从一个你主动使用的工具变成一个持续观察你的项目的后台助手。</p>
<p>根据泄露的代码，KAIROS</p>
<ul>
<li>记录全天的观察、决策和行动。</li>
<li>定时检查。每隔一段时间，它就会收到一个信号，然后决定：行动还是保持沉默。</li>
<li>不妨碍你。任何会阻碍你超过 15 秒的行动都会被推迟。</li>
<li>在内部运行梦境清理，并在后台进行完整的 "观察-思考-行动 "循环。</li>
<li>拥有普通克劳德代码所没有的独家工具：向你推送文件、发送通知、监控你的 GitHub 拉取请求。</li>
</ul>
<p>KAIROS 位于编译时功能标志之后。它不在任何公开版本中。把它想象成 Anthropic 在探索当<a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">Agents 内存</a>不再逐会话<a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">存储</a>，而是永远在线时会发生什么。</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">克劳德代码的内存架构有哪些缺陷？<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>克劳德代码的内存确实在工作。但是，随着项目的增长，有五个结构限制制约了它的处理能力。</p>
<table>
<thead>
<tr><th>限制</th><th>限制</th></tr>
</thead>
<tbody>
<tr><td><strong>200 行索引上限</strong></td><td><code translate="no">MEMORY.md</code> 保存 ~25 KB。一个项目运行数月，旧条目就会被新条目挤掉。"我们上周确定的 Redis 配置是什么？- 没了。</td></tr>
<tr><td><strong>仅 Grep 检索</strong></td><td>内存搜索使用字面<a href="https://milvus.io/docs/full-text-search.md">关键字匹配</a>。你记得 "部署时端口冲突"，但备注中却写着 "docker-compose 端口映射"。Grep 无法弥合这一差距。</td></tr>
<tr><td><strong>只有摘要，没有推理</strong></td><td>自动记忆功能保存的是高级笔记，而不是调试步骤或推理过程。这就失去了 "<em>如何"</em>。</td></tr>
<tr><td><strong>复杂性叠加，却不解决基础问题</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS。每一层的存在都是因为上一层不够。但再多的分层也改变不了下面的内容：一个工具、本地文件、逐个会话捕捉。</td></tr>
<tr><td><strong>内存被锁定在克劳德代码中</strong></td><td>切换到 OpenCode、Codex CLI 或其他 Agents，你将从零开始。没有输出，没有共享格式，没有可移植性。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这些都不是错误。它们是单一工具、本地文件架构的自然限制。每个月都会有新的 Agents 推出，工作流程也会发生变化，但你在项目中积累的知识不应该随之消失。这就是我们建立<a href="https://github.com/zilliztech/memsearch">memsearch</a> 的原因。</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">什么是 memsearch？任何人工智能编码代理的持久内存<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a>将内存从代理中提取出来，放入自己的层中。代理来来去去。内存保持不变。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">如何安装 memsearch</h3><p>克劳德代码用户从市场上安装：</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>完成。无需配置。</p>
<p>其他平台也同样简单。OpenClaw:<code translate="no">openclaw plugins install clawhub:memsearch</code> 。通过 uv 或 pip 安装 Python API：</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">memsearch 能捕获什么？</h3><p>一旦安装，memsearch 就会与 Agents 的生命周期挂钩。每次对话都会自动汇总和索引。当你提出一个需要历史记录的问题时，memsearch 会自动触发。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>记忆文件以 Markdown 的形式存储--每天一个文件：</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>你可以用任何文本编辑器打开、阅读和编辑记忆文件。如果要迁移，可以复制文件夹。如果你想进行版本控制，可以使用 git。</p>
<p>存储在<a href="https://milvus.io/docs/overview.md">Milvus</a>中的<a href="https://milvus.io/docs/index-explained.md">向量索引</a>是一个缓存层--如果它丢失了，你可以从 Markdown 文件中重建它。你的数据保存在文件中，而不是索引中。</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">memsearch如何查找记忆？语义搜索与Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>克劳德代码的记忆检索使用的是grep--字面关键词匹配。当你有几十个笔记时，这种方法很有效，但当你记不起确切的措辞时，这种方法就会在几个月后失效。</p>
<p>memsearch则使用<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">混合搜索</a>。即使措辞不同，<a href="https://zilliz.com/glossary/semantic-search">语义向量</a>也能找到与你的查询相关的内容，而 BM25 则匹配精确的关键词。<a href="https://milvus.io/docs/rrf-ranker.md">RRF（互惠排名融合）</a>将两个结果集合并在一起并进行排名。</p>
<p>如果您问 "上周我们是如何解决 Redis 超时问题的？- 语义搜索可以理解您的意图并找到它。如果你问 &quot;搜索<code translate="no">handleTimeout</code>&quot;，BM25 会准确找到函数名称。这两条路径覆盖了对方的盲点。</p>
<p>当召回触发时，子 Agents 会分三个阶段进行搜索，只有在需要时才会深入：</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1：语义搜索--简短预览</h3><p>子代理针对 Milvus 索引运行<code translate="no">memsearch search</code> ，并提取最相关的结果：</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>每个结果都会显示相关性得分、源文件和 200 个字符的预览。大多数查询到此为止。</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2:完整上下文--展开特定结果</h3><p>如果 L1 的预览还不够，子 Agents 会运行<code translate="no">memsearch expand a3f8c1</code> 来提取完整的条目：</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3：原始对话记录</h3><p>在极少数情况下，如果您需要查看确切的对话内容，子代理会调出原始交流内容：</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>该副本保留了所有内容：您的原话、 Agents 的准确回复以及每个工具呼叫。这三个阶段由浅入深--由子 Agents 决定深入的程度，然后将整理好的结果返回到您的主会话。</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">memsearch 如何跨人工智能编码代理共享内存？<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>这是 memsearch 与克劳德代码内存之间最根本的差距。</p>
<p>克劳德代码的内存被锁定在一个工具中。如果使用 OpenCode、OpenClaw 或 Codex CLI，你将从头开始。MEMORY.md 是本地的，与一个用户和一个代理绑定。</p>
<p>memsearch 支持四种编码代理：Claude Code、OpenClaw、OpenCode 和 Codex CLI。它们共享相同的 Markdown 内存格式和相同的<a href="https://milvus.io/docs/manage-collections.md">Milvus Collections</a>。从任何代理写入的记忆库都可以从其他代理中搜索到。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>两个真实场景</strong></p>
<p><strong>切换工具。</strong>你在 Claude Code 中花了一个下午的时间弄清部署管道，遇到了几个障碍。对话会被自动汇总并编入索引。第二天，您切换到 OpenCode，询问 "昨天的端口冲突是如何解决的？OpenCode 会搜索 memsearch，找到昨天克劳德代码的记忆，并给出正确答案。</p>
<p><strong>团队协作。</strong>将 Milvus 后端指向<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>，不同机器上的多个开发人员使用不同的 Agents 读写同一个项目内存。新团队成员加入后，无需翻阅数月的 Slack 和文档，Agent 就已经知道了。</p>
<h2 id="Developer-API" class="common-anchor-header">开发人员 API<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>如果你正在构建自己的<a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Agents 工具</a>，memsearch 提供了 CLI 和 Python API。</p>
<p><strong>CLI：</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>Python API：</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>在引擎盖下，Milvus 处理向量搜索。使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>在本地运行（零配置），通过<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>协作（提供免费层级），或使用 Docker 自主托管。<a href="https://milvus.io/docs/embeddings.md">Embeddings</a>默认使用 ONNX - 在 CPU 上运行，无需 GPU。可随时切换到 OpenAI 或 Ollama。</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">克劳德代码内存与 memsearch：全面比较<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
<tr><th>特点</th><th>克劳德代码内存</th><th>内存搜索</th></tr>
</thead>
<tbody>
<tr><td>保存的内容</td><td>克劳德认为重要的内容</td><td>自动总结的每次对话</td></tr>
<tr><td>存储限制</td><td>~200 行索引（~25 KB）</td><td>无限制（每日文件 + 向量索引）</td></tr>
<tr><td>查找旧记忆</td><td>Grep 关键字匹配</td><td>基于意义 + 关键字的混合搜索 (Milvus)</td></tr>
<tr><td>你能读取它们吗？</td><td>手动检查内存文件夹</td><td>打开任何 .md 文件</td></tr>
<tr><td>能否编辑？</td><td>手动编辑文件</td><td>相同 - 保存时自动重新索引</td></tr>
<tr><td>版本控制</td><td>并非为其设计</td><td>git 可直接使用</td></tr>
<tr><td>跨工具支持</td><td>仅限克劳德代码</td><td>4 个 Agents，共享内存</td></tr>
<tr><td>长期记忆</td><td>数周后衰减</td><td>持续数月</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">开始使用 memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>克劳德代码的记忆具有真正的优势--自我怀疑设计、梦境巩固概念以及 KAIROS 中的 15 秒阻断预算。人类正在认真思考这个问题。</p>
<p>不过，单工具内存也有上限。一旦你的工作流程跨越多个 Agents、多个人或超过几周的历史，你就需要独立存在的记忆。</p>
<ul>
<li>试试<a href="https://github.com/zilliztech/memsearch">memsearch</a>吧--开源，MIT 许可。只需两条命令即可在克劳德代码中安装。</li>
<li>阅读<a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">memsearch 的工作原理</a>或<a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude Code 插件指南</a>。</li>
<li>有问题？加入<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社区</a>，或<a href="https://milvus.io/office-hours">预约免费的 Office Hours 会议</a>，了解您的使用案例。</li>
</ul>
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">克劳德代码的内存系统是如何工作的？</h3><p>克劳德代码采用四层内存架构，全部存储为本地 Markdown 文件。CLAUDE.md 是您手动编写的静态规则文件。自动记忆可以让克劳德在会话过程中保存自己的笔记，分为四类：用户偏好、反馈、项目背景和参考指针。自动梦境会在后台整合陈旧的记忆。KAIROS 是在泄露的源代码中发现的一个未发布的始终在线守护进程。整个系统的索引上限为 200 行，只能通过精确的关键字匹配进行搜索，不能进行语义搜索或基于意义的调用。</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">人工智能编码代理能否在不同工具间共享内存？</h3><p>不能。Claude Code 的内存锁定在 Claude Code 中，没有导出格式或跨 Agents 协议。如果切换到 OpenCode、Codex CLI 或 OpenClaw，就得从头开始。Memsearch 通过将记忆存储为有日期的 Markdown 文件，并在<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>（Milvus）中编入索引，解决了这一问题。所有支持的四个 Agents 都读写同一个内存存储，因此当你切换工具时，上下文会自动转移。</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">代理内存的关键字搜索和语义搜索有什么区别？</h3><p>关键词搜索（grep）匹配的是精确的字符串--如果你的内存中显示的是 "docker-compose port mapping"，但你搜索的是 "port conflicts"（端口冲突），那么它什么也不会返回。语义搜索将文本转换为<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>，从而捕捉意义，因此即使措辞不同，相关概念也能匹配。membsearch 将这两种方法与混合搜索相结合，让你在一次查询中就能获得基于意义的召回率和精确的关键词精度。</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">克劳德代码源代码事件泄露了什么？</h3><p>克劳德代码 2.1.88 版附带了一个 59.8 MB 的源代码映射文件，该文件本应从生产构建中删除。该文件包含完整、可读的 TypeScript 代码库（约 51.2 万行），包括完整的内存系统实现、Auto Dream 整合过程以及对 KAIROS（一种未发布的始终在线 Agents 模式）的引用。在代码被删除之前，GitHub 迅速将其镜像了一遍。</p>
