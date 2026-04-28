---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: |
  Is MCP Dead? What We Learned Building with MCP, CLI, and Agent Skills
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
desc: >
  MCP eats context, breaks in production, and can't reuse your agent's LLM. We
  built with all three — here's when each fits.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>When Perplexity’s CTO Denis Yarats said at ASK 2026 that the company was deprioritizing MCP internally, it set off the usual cycle. YC CEO Garry Tan piled on — MCP eats too much context window, auth is broken, he built a CLI replacement in 30 minutes. Hacker News ran strongly anti-MCP.</p>
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
<p>A year ago, this level of public skepticism would have been unusual. Model Context Protocol (MCP) was positioned as the definitive standard for <a href="https://zilliz.com/glossary/ai-agents">AI agent</a> tool integration. Server counts were doubling weekly. The pattern since then has followed a familiar arc: rapid hype, broad adoption, then production disillusionment.</p>
<p>The industry is responding fast. Bytedance’s Lark/Feishu open-sourced their official CLI — 200+ commands across 11 business domains with 19 built-in Agent Skills. Google shipped gws for Google Workspace. The CLI + Skills pattern is quickly becoming the default for enterprise agent tooling, not a niche alternative.</p>
<p>At Zilliz, we’ve released <a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>, which lets you operate and manage <a href="https://milvus.io/intro">Milvus</a> and <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (fully managed Milvus) directly from your terminal without leaving your coding environment. On top of that, we built <a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills</a> and <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a>s so that AI coding agents like Claude Code and Codex can manage your <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> through natural language.</p>
<p>We also built an MCP server for Milvus and Zilliz Cloud one year ago. That experience taught us exactly where MCP breaks down — and where it still fits. Three architectural limitations pushed us toward CLI and Skills: context window bloat, passive tool design, and the inability to reuse the agent’s own LLM.</p>
<p>In this post, we’ll walk through each problem, show what we’re building instead, and lay out a practical framework for choosing between MCP, CLI, and Agent Skills.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCP Eats 72% of Your Context Window at Startup<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>A standard MCP setup can consume around 72% of your available context window before the agent takes a single action. Connect three servers — GitHub, Playwright, and an IDE integration — on a 200K-token model, and tool definitions alone occupy roughly 143K tokens. The agent hasn’t done anything yet. It’s already three-quarters full.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The cost isn’t just tokens. The more unrelated content packed into context, the weaker the model’s focus on what actually matters. A hundred tool schemas sitting in context means the agent wades through all of them on every decision. Researchers have documented what they call <em>context rot</em> — degraded reasoning quality from context overload. In measured tests, tool selection accuracy dropped from 43% to below 14% as tool count increased. More tools, paradoxically, means worse tool use.</p>
<p>The root cause is architectural. MCP loads all tool descriptions in full at session start, regardless of whether the current conversation will ever use them. That’s a protocol-level design choice, not a bug — but the cost scales with every tool you add.</p>
<p>Agent skills take a different approach: <strong>progressive disclosure</strong>. At session start, an agent reads only each Skill’s metadata — name, one-line description, trigger condition. A few dozen tokens total. The full Skill content loads only when the agent determines it’s relevant. Think of it this way: MCP lines up every tool at the door and makes you choose; Skills gives you an index first, full content on demand.</p>
<p>CLI tools offer a similar advantage. An agent runs git --help or docker --help to discover capabilities on demand, without preloading every parameter definition. Context cost is pay-as-you-go, not upfront.</p>
<p>At a small scale, the difference is negligible. At production scale, it’s the difference between an agent that works and one that drowns in its own tool definitions.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">MCP’s Passive Architecture Limits Agent Workflows<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP is a tool-calling protocol: how to discover tools, call them, and receive results. Clean design for simple use cases. But that cleanness is also a constraint.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">Flat Tool Space with No Hierarchy</h3><p>An MCP tool is a flat function signature. No subcommands, no awareness of session lifecycle, no sense of where the agent is in a multi-step workflow. It waits to be called. That’s all it does.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A CLI works differently. git commit, git push, and git log are completely different execution paths sharing a single interface. An agent runs --help, explores the available surface incrementally, and expands only what it needs — without front-loading all the parameter documentation into context.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">Skills Encode Workflow Logic — MCP Can’t</h3><p>An Agent Skill is a Markdown file containing a standard operating procedure: what to do first, what to do next, how to handle failures, and when to surface something to the user. The agent receives not just a tool but an entire workflow. Skills actively shape how an agent behaves during a conversation — what triggers them, what they prepare in advance, and how they recover from errors. MCP tools can only wait.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP Can’t Access the Agent’s LLM</h3><p>This is the limitation that actually stopped us.</p>
<p>When we built <a href="https://github.com/zilliztech/claude-context">claude-context</a> — an MCP plugin that adds <a href="https://zilliz.com/glossary/semantic-search">semantic search</a> to Claude Code and other AI coding agents, giving them deep context from an entire codebase — we wanted to retrieve relevant historical conversation snippets from Milvus and surface them as context. The <a href="https://zilliz.com/learn/vector-similarity-search">vector search</a> retrieval worked. The problem was what to do with the results.</p>
<p>Retrieve the top 10 results, and maybe 3 are useful. The other 7 are noise. Hand all 10 to the outer agent, and the noise interferes with the answer. In testing, we saw responses get distracted by irrelevant historical records. We needed to filter before passing results up.</p>
<p>We tried several approaches. Adding a reranking step inside the MCP server using a small model: not accurate enough, and the relevance threshold needed per-use-case tuning. Using a large model for reranking: technically sound, but an MCP server runs as a separate process with no access to the outer agent’s LLM. We’d have to configure a separate LLM client, manage a separate API key, and handle a separate call path.</p>
<p>What we wanted was simple: let the outer agent’s LLM participate directly in the filtering decision. Retrieve the top 10, let the agent itself judge what’s worth keeping, and return only the relevant results. No second model. No extra API keys.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP can’t do this. The process boundary between server and agent is also an intelligence boundary. The server can’t use the agent’s LLM; the agent can’t govern what happens inside the server. Fine for simple CRUD tools. The moment a tool needs to make a judgment call, that isolation becomes a real constraint.</p>
<p>An Agent Skill solves this directly. A retrieval Skill can call vector search for the top 10, have the agent’s own LLM assess relevance, and return only what passes. No additional model. The agent does the filtering itself.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">What We Built Instead with CLI and Skills<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>We see CLI + Skills as the direction for agent-tool interaction — not just for memory retrieval, but across the stack. This conviction drives everything we’re building.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch: A Skills-Based Memory Layer for AI Agents</h3><p>We built <a href="https://github.com/zilliztech/memsearch">memsearch</a>, an open-source memory layer for Claude Code and other AI agents. The Skill runs inside a subagent with three stages: Milvus handles the initial vector search for broad discovery, the agent’s own LLM evaluates relevance and expands context for promising hits, and a final drill-down accesses original conversations only when needed. Noise gets discarded at each stage — intermediate retrieval junk never reaches the primary context window.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The key insight: the agent’s intelligence is part of the tool’s execution. The LLM already in the loop does the filtering — no second model, no extra API key, no brittle threshold tuning. This is a specific use case — conversation-context retrieval for coding agents — but the architecture generalizes to any scenario where a tool needs judgment, not just execution.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI, Skills, and Plugin for Vector Database Operations</h3><p>Milvus is the world’s most widely adopted open-source vector database with <a href="https://github.com/milvus-io/milvus">43K+ stars on GitHub</a>. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> is the fully managed service of Milvus with advanced enterprise features and is much faster than Milvus.</p>
<p>The same layered architecture mentioned above drives our developer tools:</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a> is the infrastructure layer. Cluster management, <a href="https://milvus.io/docs/manage-collections.md">collection operations</a>, vector search, <a href="https://milvus.io/docs/rbac.md">RBAC</a>, backups, billing — everything you’d do in the Zilliz Cloud console, available from the terminal. Humans and agents use the same commands. Zilliz CLI also serves as the foundation for Milvus Skills and Zilliz Skills.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skill</a> is the knowledge layer for open-source Milvus. It teaches AI coding agents (Claude Code, Cursor, Codex, GitHub Copilot) to operate any Milvus deployment — <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, Standalone, or Distributed — through <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a> Python code: connections, <a href="https://milvus.io/docs/schema-hands-on.md">schema design</a>, CRUD, <a href="https://zilliz.com/learn/hybrid-search-with-milvus">hybrid search</a>, <a href="https://milvus.io/docs/full-text-search.md">full-text search</a>, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG pipelines</a>.</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a> does the same for Zilliz Cloud, teaching agents to manage cloud infrastructure through Zilliz CLI.</li>
<li><a href="https://github.com/zilliztech/zilliz-plugin">Zilliz Plugin</a> is the developer experience layer for Claude Code — wraps CLI + Skill into a guided experience with slash commands like /zilliz:quickstart and /zilliz:status.</li>
</ul>
<p>CLI handles execution, Skills encode knowledge and workflow logic, Plugin delivers the UX. No MCP server in the loop.</p>
<p>For more details, check out these resources:</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">Introducing Zilliz CLI and Agent Skills for Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Just Landed in Claude Code</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">AI Prompts — Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI Reference — Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill — Zilliz Cloud Developer Hub</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus for AI Agents — Milvus Documentation</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">Is MCP Actually Dying?<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>A lot of developers and companies including us here at Zilliz are turning to CLI and Skills. But is MCP really dying?</p>
<p>The short answer: no — but its scope is narrowing to where it actually fits.</p>
<p>MCP has been donated to the Linux Foundation. Active servers number over 10,000. SDK monthly downloads sit at 97 million. An ecosystem that size doesn’t disappear because of a conference comment.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A Hacker News thread — <em>“When does MCP make sense vs CLI?”</em> — drew responses that mostly favored CLI: “CLI tools are like precision instruments,” “CLIs also feel snappier than MCPs.” Some developers hold a more balanced view: Skills are a detailed recipe that helps you solve a problem better; MCP is the tool that helps you solve the problem. Both have their place.</p>
<p>That’s fair — but it raises a practical question. If the recipe itself can direct the agent on which tools to use and how, is a separate tool-distribution protocol still necessary?</p>
<p>It depends on the use case.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>MCP over stdio</strong> — the version most developers run locally — is where the problems accumulate: unstable inter-process communication, messy environment isolation, high token overhead. In that context, better alternatives exist for almost every use case.</p>
<p><strong>MCP over HTTP</strong> is a different story. Enterprise internal tooling platforms need centralized permission management, unified OAuth, standardized telemetry and logging. Fragmented CLI tools genuinely struggle to provide these. MCP’s centralized architecture has real value in that context.</p>
<p>What Perplexity actually dropped was primarily the stdio use case. Denis Yarats specified “internally” and didn’t call for industry-wide adoption of that choice. That nuance got lost in transmission — “Perplexity abandons MCP” spreads considerably faster than “Perplexity deprioritizes MCP over stdio for internal tool integration.”</p>
<p>MCP emerged because it solved a real problem: before it, every AI application wrote its own tool-calling logic, with no shared standard. MCP provided a unified interface at the right moment, and the ecosystem built quickly. Production experience then surfaced the limitations. That’s a normal arc for infrastructure tooling — not a death sentence.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">When to Use MCP, CLI, or Skills<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
<tr><th></th><th>MCP over stdio (Local)</th><th>MCP over HTTP (Enterprise)</th></tr>
</thead>
<tbody>
<tr><td><strong>Authentication</strong></td><td>None</td><td>OAuth, centralized</td></tr>
<tr><td><strong>Connection stability</strong></td><td>Process isolation issues</td><td>Stable HTTPS</td></tr>
<tr><td><strong>Logging</strong></td><td>No standard mechanism</td><td>Centralized telemetry</td></tr>
<tr><td><strong>Access control</strong></td><td>None</td><td>Role-based permissions</td></tr>
<tr><td><strong>Our take</strong></td><td>Replace with CLI + Skills</td><td>Keep for enterprise tooling</td></tr>
</tbody>
</table>
<p>For teams choosing their <a href="https://zilliz.com/glossary/ai-agents">agentic AI</a> tooling stack, here’s how the layers fit:</p>
<table>
<thead>
<tr><th>Layer</th><th>What It Does</th><th>Best For</th><th>Examples</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>Operational tasks, infra management</td><td>Commands that agents and humans both run</td><td>git, docker, zilliz-cli</td></tr>
<tr><td><strong>Skills</strong></td><td>Agent workflow logic, encoded knowledge</td><td>Tasks needing LLM judgment, multi-step SOPs</td><td>milvus-skill, zilliz-skill, memsearch</td></tr>
<tr><td><strong>REST APIs</strong></td><td>External integrations</td><td>Connecting to third-party services</td><td>GitHub API, Slack API</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>Enterprise tool platforms</td><td>Centralized auth, audit logging</td><td>Internal tool gateways</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">Get Started<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Everything we’ve discussed in this article is available today:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> — the Skills-based memory layer for AI agents. Drop it into Claude Code or any agent that supports Skills.</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a> — manage Milvus and Zilliz Cloud from your terminal. Install it and explore the subcommands your agents can use.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a> and <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Skill</strong></a> — give your AI coding agent native Milvus and Zilliz Cloud knowledge.</li>
</ul>
<p>Have questions about vector search, agent architecture, or building with CLI and Skills? Join the <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a> or <a href="https://milvus.io/office-hours">book a free Office Hours session</a> to talk through your use case.</p>
<p>Ready to build? <a href="https://cloud.zilliz.com/signup">Sign up for Zilliz Cloud</a> — new accounts with a work email get $100 in free credits. Already have an account? <a href="https://cloud.zilliz.com/login">Sign in here</a>.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Frequently Asked Questions<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">What is wrong with MCP for AI agents?</h3><p>MCP has three main architectural limitations in production. First, it loads all tool schemas into the context window at session start — connecting just three MCP servers on a 200K-token model can consume over 70% of available context before the agent does anything. Second, MCP tools are passive: they wait to be called and can’t encode multi-step workflows, error-handling logic, or standard operating procedures. Third, MCP servers run as separate processes with no access to the agent’s LLM, so any tool that needs judgment (like filtering search results for relevance) requires configuring a separate model with its own API key. These problems are most acute with MCP over stdio; MCP over HTTP mitigates some of them.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">What is the difference between MCP and Agent Skills?</h3><p>MCP is a tool-calling protocol that defines how an agent discovers and invokes external tools. An Agent Skill is a Markdown file containing a full standard operating procedure — triggers, step-by-step instructions, error handling, and escalation rules. The key architectural difference: Skills run inside the agent’s process, so they can leverage the agent’s own LLM for judgment calls like relevance filtering or result reranking. MCP tools run in a separate process and can’t access the agent’s intelligence. Skills also use progressive disclosure — only lightweight metadata loads at startup, with full content loading on demand — keeping context window usage minimal compared to MCP’s upfront schema loading.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">When should I still use MCP instead of CLI or Skills?</h3><p>MCP over HTTP still makes sense for enterprise tooling platforms where you need centralized OAuth, role-based access control, standardized telemetry, and audit logging across many internal tools. Fragmented CLI tools struggle to provide these enterprise requirements consistently. For local development workflows — where agents interact with tools on your machine — CLI + Skills typically offers better performance, lower context overhead, and more flexible workflow logic than MCP over stdio.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">How do CLI tools and Agent Skills work together?</h3><p>CLI provides the execution layer (the actual commands), while Skills provide the knowledge layer (when to run which commands, in what order, and how to handle failures). For example, Zilliz CLI handles infrastructure operations like cluster management, collection CRUD, and vector search. Milvus Skill teaches the agent the right pymilvus patterns for schema design, hybrid search, and RAG pipelines. The CLI does the work; the Skill knows the workflow. This layered pattern — CLI for execution, Skills for knowledge, a plugin for UX — is how we’ve structured all of our developer tooling at Zilliz.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs Skills vs CLI: when should I use each?</h3><p>CLI tools like git, docker, or zilliz-cli are best for operational tasks — they expose hierarchical subcommands and load on demand. Skills like milvus-skill are best for agent workflow logic — they carry operating procedures, error recovery, and can access the agent’s LLM. MCP over HTTP still fits enterprise tool platforms needing centralized OAuth, permissions, and audit logging. MCP over stdio — the local version — is being replaced by CLI + Skills in most production setups.</p>
