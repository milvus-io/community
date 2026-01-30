---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: 克劳德代码为何如此稳定？开发人员深入了解其本地存储设计
author: Bill chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: 深入了解克劳德代码的存储：JSONL 会话日志、项目隔离、分层配置和文件快照让人工智能辅助编码变得稳定且可恢复。
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>最近，克劳德代码无处不在。开发人员正在使用它来更快地发布功能、实现工作流程自动化，以及开发能在实际项目中发挥作用的 Agents 原型。更令人吃惊的是，许多非编码人员也加入其中--构建工具、连接任务，几乎无需任何设置就能获得有用的结果。人工智能编码工具能如此迅速地普及到如此多不同技能水平的人，实属罕见。</p>
<p>不过，真正突出的是它的<em>稳定性</em>。克劳德代码会记住在不同会话中发生的事情，在崩溃时也不会丢失进度，它的行为更像是一个本地开发工具，而不是聊天界面。这种可靠性来自于它处理本地存储的方式。</p>
<p>Claude Code 不会将你的编码会话视为临时聊天，而是读写真实文件，将项目状态存储在磁盘上，并记录代理工作的每一步。会话可以恢复、检查或回滚，无需猜测，而且每个项目都保持干净隔离，避免了许多 Agents 工具会遇到的交叉污染问题。</p>
<p>在这篇文章中，我们将仔细研究这种稳定性背后的存储架构，以及为什么它在让克劳德代码感觉日常开发实用性方面发挥了如此大的作用。</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">每个本地人工智能编码助手都会面临的挑战<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>在解释 Claude Code 如何处理存储问题之前，我们先来看看本地 AI 编码工具容易遇到的常见问题。当一个助手直接在你的文件系统上工作并长期保持状态时，这些问题就会自然而然地出现。</p>
<p><strong>1.项目数据在不同工作区之间混杂。</strong></p>
<p>大多数开发人员每天都会在多个版本库之间切换。如果助手将状态从一个项目带入另一个项目，就会变得更难理解其行为，也更容易做出错误的假设。每个项目都需要有自己干净、独立的状态和历史记录空间。</p>
<p><strong>2.崩溃会导致数据丢失。</strong></p>
<p>在编码过程中，助手会产生源源不断的有用数据--文件编辑、工具调用、中间步骤。如果不立即保存这些数据，系统崩溃或强制重启就会导致数据丢失。可靠的系统会在创建重要状态后立即将其写入磁盘，这样工作就不会意外丢失。</p>
<p><strong>3.Agents 实际做了什么并不总是很清楚。</strong></p>
<p>一个典型的会话涉及许多小操作。如果没有清晰、有序的操作记录，就很难追溯助手是如何实现特定输出的，或者找到出错的步骤。有了完整的历史记录，调试和审查工作就容易多了。</p>
<p><strong>4.撤销错误太费劲。</strong></p>
<p>有时，助手做出的更改并不完全奏效。如果没有回退这些更改的内置方法，最终只能在整个版本库中手动查找编辑内容。系统应该自动跟踪更改的内容，这样你就可以干净利落地撤销更改，而无需额外的工作。</p>
<p><strong>5.不同的项目需要不同的设置。</strong></p>
<p>本地环境各不相同。有些项目需要特定的权限、工具或目录规则；其他项目则需要自定义脚本或工作流程。助手需要尊重这些差异，允许按项目设置，同时保持核心行为一致。</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">克劳德代码背后的存储设计原则<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude 代码的存储设计围绕四个简单明了的理念展开。它们看似简单，却能共同解决人工智能助手直接在你的机器上跨多个项目工作时出现的实际问题。</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1.每个项目都有自己的存储空间。</h3><p>克劳德代码会将所有会话数据绑定到所属的项目目录。这意味着对话、编辑和日志都会保留在它们来自的项目中，不会泄漏到其他项目中。将存储空间分开可以让助手的行为更容易理解，也可以轻松检查或删除特定 repo 的数据。</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2.数据立即保存到磁盘。</h3><p>克劳德代码不会将交互数据保存在内存中，而是在数据创建后立即将其写入磁盘。每个事件--消息、工具调用或状态更新--都会被添加为新条目。如果程序意外崩溃或关闭，几乎所有内容都还在。这种方法既能保持会话的持久性，又不会增加太多复杂性。</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3.每个操作在历史中都有明确的位置。</h3><p>克劳德代码将每条信息和工具操作与之前的信息和工具操作联系起来，形成一个完整的序列。有了这种有序的历史记录，就可以回顾会话是如何展开的，并追溯导致特定结果的步骤。对于开发人员来说，有了这种跟踪记录，调试和理解 Agents 的行为就容易多了。</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4.代码编辑很容易回滚。</h3><p>在助手更新文件之前，克劳德代码会保存其先前状态的快照。如果发现更改是错误的，你可以还原之前的版本，而无需翻阅版本库或猜测更改了什么。这个简单的安全网让人工智能驱动的编辑风险大大降低。</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">克劳德代码本地存储布局<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>克劳德代码将所有本地数据存储在一个地方：你的主目录。这样可以保持系统的可预测性，并在需要时更容易检查、调试或清理。存储布局围绕两个主要部分展开：一个小型全局配置文件和一个较大的数据目录，所有项目级状态都存放在该目录中。</p>
<p><strong>两个核心组件</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>存储全局配置和快捷方式，包括项目映射、MCP 服务器设置和最近使用的提示。</p></li>
<li><p><code translate="no">~/.claude/</code>主数据目录，克劳德代码在此存储对话、项目会话、权限、插件、技能、历史和相关运行时数据。</p></li>
</ul>
<p>接下来，让我们仔细看看这两个核心组件。</p>
<p><strong>(1) 全局配置</strong>：<code translate="no">~/.claude.json</code></p>
<p>该文件的作用是索引而非数据存储。它记录了你参与过的项目、每个项目附带的工具以及你最近使用过的提示。对话数据本身并不存储在这里。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 主数据目录</strong>：<code translate="no">~/.claude/</code></p>
<p><code translate="no">~/.claude/</code> 目录是克劳德代码的大部分本地状态所在。它的结构反映了几个核心设计理念：项目隔离、即时持久性和错误后的安全恢复。</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>这种布局有意简单化：克劳德代码生成的所有内容都存放在一个目录下，按项目和会话组织。这样就不会有隐藏状态散落在系统中，而且在必要时也很容易检查或清理。</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">克劳德代码如何管理配置<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>克劳德代码的配置系统是围绕一个简单的理念设计的：在不同的机器上保持默认行为一致，但仍允许个人环境和项目定制自己需要的内容。为了做到这一点，克劳德代码采用了三层配置模型。当同一设置出现在多个地方时，更具体的配置层总是胜出。</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">三个配置层</h3><p>克劳德代码按以下顺序加载配置，从最低优先级到最高优先级：</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>你可以认为这是从全局默认值开始，然后应用特定于机器的调整，最后应用特定于项目的规则。</p>
<p>接下来，我们将详细介绍每个配置级别。</p>
<p><strong>(1) 全局配置</strong>：<code translate="no">~/.claude/settings.json</code></p>
<p>全局配置定义了克劳德代码在所有项目中的默认行为。在这里，你可以设置基线权限、启用插件和配置清理行为。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 本地配置</strong>：<code translate="no">~/.claude/settings.local.json</code></p>
<p>本地配置只针对一台机器。它不用于共享或在版本控制中检查。这使得它成为 API 密钥、本地工具或特定环境权限的好地方。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) 项目级配置</strong>：<code translate="no">project/.claude/settings.json</code></p>
<p>项目级配置只适用于单个项目，优先级最高。在这里，你可以定义在该版本库中工作时始终适用的规则。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>定义了配置层后，下一个问题就是<strong>Claude Code 如何在运行时实际解决配置和权限问题。</strong></p>
<p><strong>克劳德代码</strong>分三层应用配置：首先是全局默认值，然后是特定机器的覆盖，最后是特定项目的规则。当同一设置出现在多个地方时，最具体的配置优先。</p>
<p>权限遵循固定的评估顺序：</p>
<ol>
<li><p><strong>deny</strong>- 始终阻止</p></li>
<li><p><strong>询问</strong>- 需要确认</p></li>
<li><p><strong>允许</strong>- 自动运行</p></li>
<li><p><strong>默认</strong>- 仅在无规则匹配时应用</p></li>
</ol>
<p>这样既能保证系统的默认安全性，又能为项目和单个机器提供所需的灵活性。</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">会话存储：克劳德代码如何保存核心交互数据<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>在<strong>克劳德代码</strong>中，会话是数据的核心单位。会话记录了用户与人工智能之间的整个交互过程，包括对话本身、工具调用、文件更改和相关上下文。如何存储会话对系统的可靠性、可调试性和整体安全性有直接影响。</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">为每个项目单独保存会话数据</h3><p>会话定义完成后，下一个问题就是<strong>Claude Code</strong>如何存储会话，以保持数据的有序性和隔离性。</p>
<p><strong>克劳德代码</strong>按项目隔离会话数据。每个项目的会话都存储在由项目文件路径导出的目录下。</p>
<p>存储路径遵循这种模式：</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>要创建一个有效的目录名，特殊字符（如<code translate="no">/</code> 、空格和<code translate="no">~</code> ）将被替换为<code translate="no">-</code> 。</p>
<p>例如</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>这种方法可确保来自不同项目的会话数据不会混合，并可按项目进行管理或删除。</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">为何使用 JSONL 格式存储会话</h3><p><strong>克劳德代码</strong>使用 JSONL（JSON 行）而不是标准 JSON 来存储会话数据。</p>
<p>在传统的 JSON 文件中，所有信息都被捆绑在一个大型结构中，这意味着每当文件发生变化时，都必须读取和重写整个文件。相比之下，JSONL 将每条信息作为独立的一行存储在文件中。一行等于一条信息，没有外层包装。</p>
<table>
<thead>
<tr><th>优点</th><th>标准 JSON</th><th>JSONL （JSON 行）</th></tr>
</thead>
<tbody>
<tr><td>数据存储方式</td><td>一个大结构</td><td>每行一条信息</td></tr>
<tr><td>何时保存数据</td><td>通常在最后</td><td>立即，每条信息</td></tr>
<tr><td>崩溃影响</td><td>整个文件可能崩溃</td><td>只影响最后一行</td></tr>
<tr><td>写入新数据</td><td>重写整个文件</td><td>添加一行</td></tr>
<tr><td>内存使用</td><td>加载所有内容</td><td>逐行读取</td></tr>
</tbody>
</table>
<p>JSONL 在几个关键方面更胜一筹：</p>
<ul>
<li><p><strong>立即保存：</strong>每条信息生成后都会立即写入磁盘，而不是等待会话结束。</p></li>
<li><p><strong>抗崩溃：</strong>如果程序崩溃，可能只会丢失最后一条未完成的信息。在此之前写入的所有内容都不会丢失。</p></li>
<li><p><strong>快速追加：</strong>新信息会添加到文件末尾，无需读取或重写现有数据。</p></li>
<li><p><strong>内存使用率低：</strong>会话文件可以一行一行地读取，因此无需将整个文件加载到内存中。</p></li>
</ul>
<p>简化的 JSONL 会话文件如下所示：</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">会话信息类型</h3><p>会话文件记录了与克劳德代码交互过程中发生的一切。为了清晰地记录，会话文件针对不同类型的事件使用了不同的消息类型。</p>
<ul>
<li><p><strong>用户消息</strong>代表进入系统的新输入。这不仅包括用户输入的内容，还包括工具返回的结果，如 shell 命令的输出。从人工智能的角度来看，这两者都是它需要响应的输入。</p></li>
<li><p><strong>助手信息</strong>捕捉了克劳德的回应。这些信息包括人工智能的推理、生成的文本以及决定使用的任何工具。它们还记录了使用细节，如令牌计数，以提供交互的完整信息。</p></li>
<li><p><strong>文件历史快照</strong>是克劳德修改任何文件前创建的安全检查点。通过先保存原始文件状态，克劳德代码可以在出错时撤销更改。</p></li>
<li><p><strong>摘要</strong>提供了会话的简要概述，并与最终结果相关联。无需重放每个步骤，就能更容易地了解会话的内容。</p></li>
</ul>
<p>这些消息类型加在一起，不仅记录了对话，还记录了会话过程中发生的所有操作和效果。</p>
<p>为了更具体地说明这一点，我们来看看用户信息和助手信息的具体示例。</p>
<p><strong>(1) 用户信息示例：</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) 助手信息示例：</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">会话消息如何关联</h3><p>克劳德代码不会将会话消息存储为孤立的条目。相反，它会将它们连接起来，形成一个清晰的事件链。每条信息都包含一个唯一的标识符（<code translate="no">uuid</code> ）和一条对之前信息的引用（<code translate="no">parentUuid</code> ）。这样，我们不仅能看到发生了什么，还能知道发生的原因。</p>
<p>会话以用户消息开始，用户消息是会话链的起点。克劳德的每个回复都会指向引起回复的消息。工具调用及其输出以同样的方式添加，每一步都与前一步相关联。当会话结束时，最后一条信息会附加一个摘要。</p>
<p>由于每个步骤都相互关联，因此 Claude Code 可以重放完整的操作序列，并了解结果是如何产生的，从而使调试和分析变得更加容易。</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">利用文件快照让代码更改易于撤销<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>人工智能生成的编辑并不总是正确的，有时甚至会走向完全错误的方向。为了让这些修改能安全地进行实验，Claude 代码使用了一个简单的快照系统，让你无需翻阅差异或手动清理文件就能撤销编辑。</p>
<p>其原理很简单：<strong>在克劳德代码修改文件之前，它会保存一份原始内容的副本。</strong>如果编辑结果是错误的，系统可以立即恢复之前的版本。</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">什么是<em>文件历史快照</em>？</h3><p><em>文件历史快照</em>是在文件被修改前创建的检查点。它记录了<strong>克劳德</strong>即将编辑的每个文件的原始内容。这些快照是撤销和回滚操作的数据源。</p>
<p>当用户发送可能更改文件的信息时，<strong>克劳德代码</strong>会为该信息创建一个空快照。编辑前，系统会将每个目标文件的原始内容备份到快照中，然后将编辑内容直接应用到磁盘。如果用户触发<em>撤消</em>，<strong>克劳德代码</strong>会恢复已保存的内容并覆盖修改过的文件。</p>
<p>实际上，可撤销编辑的生命周期如下：</p>
<ol>
<li><p><strong>用户发送信息克劳德</strong>代码创建一个新的、空的<code translate="no">file-history-snapshot</code> 记录。</p></li>
<li><p><strong>克劳德准备修改文件</strong>系统确定哪些文件将被编辑，并将其原始内容备份到<code translate="no">trackedFileBackups</code> 。</p></li>
<li><p><strong>克劳德执行编辑编辑</strong>和写入操作，并将修改后的内容写入磁盘。</p></li>
<li><p><strong>用户触发撤消</strong>用户按<strong>Esc + Esc</strong> 键，表示应恢复更改。</p></li>
<li><p><strong>恢复原始内容Claude</strong>代码从<code translate="no">trackedFileBackups</code> 读取保存的内容，并覆盖当前文件，完成撤销。</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">为什么撤消有效？快照保存旧版本</h3><p>克劳德代码中的撤消之所以有效，是因为系统会在任何编辑发生之前保存<em>原始</em>文件内容。</p>
<p>克劳德代码没有试图在事后逆转修改，而是采用了一种更简单的方法：它会复制修改<em>前</em>的文件，并将该副本存储在<code translate="no">trackedFileBackups</code> 中。当用户触发撤销时，系统就会恢复这个保存的版本，并覆盖已编辑的文件。</p>
<p>下图逐步展示了这一流程：</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header"><em>文件历史快照的</em>内部结构</h3><p>快照本身以结构化记录的形式存储。它捕获有关用户信息、快照时间的元数据，最重要的是文件与其原始内容的映射。</p>
<p>下面的示例显示了克劳德编辑任何文件前创建的单个<code translate="no">file-history-snapshot</code> 记录。<code translate="no">trackedFileBackups</code> 中的每个条目都存储了文件<em>编辑前</em>的内容，这些内容随后可用于在撤消过程中还原文件。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">快照的存储位置和保存时间</h3><ul>
<li><p><strong>快照元数据的存储位置</strong>：快照记录与特定会话绑定，并以 JSONL 文件形式保存在<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code> 下。</p></li>
<li><p><strong>备份原始文件内容的位置</strong>：每个文件编辑前的内容按内容哈希值单独存储在<code translate="no">~/.claude/file-history/{content-hash}/</code> 下。</p></li>
<li><p><strong>快照默认保存多长时间</strong>：快照数据保留 30 天，与全局<code translate="no">cleanupPeriodDays</code> 设置一致。</p></li>
<li><p><strong>如何更改保留期限</strong>：保留天数可通过<code translate="no">~/.claude/settings.json</code> 中的<code translate="no">cleanupPeriodDays</code> 字段进行调整。</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">相关命令</h3><table>
<thead>
<tr><th>命令/操作</th><th>说明</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>撤销最近一轮文件编辑（最常用）</td></tr>
<tr><td>/rewind</td><td>恢复到先前指定的检查点（快照）</td></tr>
<tr><td>/diff</td><td>查看当前文件与快照备份之间的差异</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">其他重要目录<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - 插件管理</strong></p>
<p><code translate="no">plugins/</code> 目录存储赋予克劳德代码额外功能的附加组件。</p>
<p>该目录存储已安装的<em>插件</em>、插件的来源以及这些插件提供的额外技能。它还保存下载插件的本地副本，这样就不需要再次下载。</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - 储存和应用技能的地方</strong></p>
<p>在克劳德代码中，技能是一种小型、可重复使用的能力，可帮助克劳德执行特定任务，如处理 PDF、编辑文档或遵循编码工作流程。</p>
<p>并非所有技能都能随处使用。有些技能适用于全球，而其他技能则仅限于单个项目或由插件提供。克劳德代码将技能存储在不同的位置，以控制每种技能的使用范围。</p>
<p>下面的层次结构显示了技能如何按范围分层，从全球可用技能到特定项目和插件提供的技能。</p>
<table>
<thead>
<tr><th>级别</th><th>存储位置</th><th>说明</th></tr>
</thead>
<tbody>
<tr><td>用户</td><td>~/.claude/skills/</td><td>全球可用，所有项目均可访问</td></tr>
<tr><td>项目</td><td>project/.claude/skills/</td><td>仅对当前项目有效，针对特定项目进行定制</td></tr>
<tr><td>插件</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>与插件一起安装，取决于插件启用状态</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - 任务列表存储</strong></p>
<p><code translate="no">todos/</code> 目录存储 Claude 在对话过程中为跟踪工作而创建的任务列表，如要完成的步骤、进行中的项目和已完成的任务。</p>
<p>任务列表以 JSON 文件的形式保存在<code translate="no">~/.claude/todos/{session-id}-*.json</code> 下。每个文件名都包含会话 ID，用于将任务列表与特定对话联系起来。</p>
<p>这些文件的内容来自<code translate="no">TodoWrite</code> 工具，包括任务描述、当前状态、优先级和相关元数据等基本任务信息。</p>
<p><strong>(4) local/ - 本地运行时和工具</strong></p>
<p><code translate="no">local/</code> 目录包含 Claude Code 在机器上运行所需的核心文件。</p>
<p>其中包括<code translate="no">claude</code> 命令行可执行文件和包含其运行时依赖项的<code translate="no">node_modules/</code> 目录。通过将这些组件保持在本地，克劳德代码可以独立运行，而无需依赖外部服务或系统安装。</p>
<p><strong>（5）其他支持目录</strong></p>
<ul>
<li><p><strong>shell-snapshots/：</strong>存储 shell 会话状态快照（如当前目录和环境变量），实现 shell 操作符回滚。</p></li>
<li><p><strong>plans/：</strong>存储由计划模式生成的执行计划（例如，多步骤编程任务的分步分解）。</p></li>
<li><p><strong>statsig/：</strong>缓存功能标志配置（如是否启用新功能），以减少重复请求。</p></li>
<li><p><strong>telemetry/：</strong>存储匿名遥测数据（如功能使用频率），用于产品优化。</p></li>
<li><p><strong>debug/：</strong>存储调试日志（包括错误堆栈和执行跟踪），以帮助排除故障。</p></li>
</ul>
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
    </button></h2><p>在深入了解 Claude Code 如何在本地存储和管理所有内容后，我们可以清楚地看到：该工具之所以感觉稳定，是因为其基础非常扎实。没有什么花哨的东西，只是经过深思熟虑的工程设计。每个项目都有自己的空间，每个操作都会被记录下来，文件编辑会在任何更改之前被备份。这样的设计能让你专注于自己的工作。</p>
<p>我最喜欢的是，这里没有任何神秘的东西。克劳德代码》之所以运行良好，是因为基础工作都做得很好。如果你曾经尝试过创建一个接触真实文件的 Agents，你就会知道事情是多么容易分崩离析--状态混淆、崩溃抹杀进度、撤销变成猜测。Claude Code 采用简单、一致且不易损坏的存储模型，避免了所有这些问题。</p>
<p>对于构建本地或内部人工智能 Agents 的团队来说，尤其是在安全环境中，这种方法展示了强大的存储和持久性如何使人工智能工具在日常开发中变得可靠和实用。</p>
<p>如果您正在设计本地或 on-prem AI 代理，并希望更详细地讨论存储架构、会话设计或安全回滚，欢迎加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>预约 20 分钟的一对一服务，获得个性化指导。</p>
