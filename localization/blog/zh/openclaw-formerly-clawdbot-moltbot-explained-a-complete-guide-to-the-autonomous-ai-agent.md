---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: >
  OpenClaw (Formerly Clawdbot & Moltbot) Explained: A Complete Guide to the
  Autonomous AI Agent
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: >
  Complete guide to OpenClaw (Clawdbot/Moltbot) — how it works, setup
  walkthrough, use cases, Moltbook, and security warnings.
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a> (formerly known as Moltbot and Clawdbot) is an open-source AI agent that runs on your machine, connects through the messaging apps you already use (WhatsApp, Telegram, Slack, Signal, and others), and takes action on your behalf — shell commands, browser automation, email, calendar, and file operations. A heartbeat scheduler wakes it up at a configurable interval so it can run without being prompted. It gained over <a href="https://github.com/openclaw/openclaw">100,000</a> GitHub stars in under a week after its launch in late January 2026, making it one of the fastest-growing open-source repositories in GitHub history.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>What makes OpenClaw distinct is its combination: MIT-licensed, open-source, local-first (memory and data stored as Markdown files on your disk), and community-extensible through a portable skill format. It’s also where some of the more interesting experiments in agentic AI are happening — one developer’s agent negotiated $4,200 off a car purchase over email while he slept; another’s filed a legal rebuttal to an insurance denial without being asked; and another user built <a href="https://moltbook.com/">Moltbook</a>, a social network where over a million AI agents interact autonomously while humans watch.</p>
<p>This guide breaks down everything you need to know: what OpenClaw is, how it works, what it can do in real life, how it relates to Moltbook, and the security risks associated with it.</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">What is OpenClaw?<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">OpenClaw</a> (formerly Clawdbot and Moltbot) is an autonomous, open-source AI assistant that runs on your machine and lives in your chat apps. You talk to it through WhatsApp, Telegram, <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>, Discord, iMessage, or Signal—whatever you already use—and it talks back. But unlike ChatGPT or Claude’s web interface, OpenClaw doesn’t just answer questions. It can run shell commands, control your browser, read and write files, manage your calendar, and send emails, all triggered by a text message.</p>
<p>It’s built for developers and power users who want a personal AI assistant they can message from anywhere — without sacrificing control over their data or relying on a hosted service.</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">Key Capabilities of OpenClaw</h3><ul>
<li><p><strong>Multi-channel gateway</strong> — WhatsApp, Telegram, Discord, and iMessage with a single gateway process. Add Mattermost and more with extension packages.</p></li>
<li><p><strong>Multi-agent routing</strong> — isolated sessions per agent, workspace, or sender.</p></li>
<li><p><strong>Media support</strong> — send and receive images, audio, and documents.</p></li>
<li><p><strong>Web Control UI</strong> — browser dashboard for chat, config, sessions, and nodes.</p></li>
<li><p><strong>Mobile nodes</strong> — pair iOS and Android nodes with Canvas support.</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">What Makes OpenClaw Different?</h3><p><strong>OpenClaw is self-hosted.</strong></p>
<p>The gateway, tools, and memory of OpenClaw live on your machine, not in a vendor-hosted SaaS. OpenClaw stores conversations, long-term memory, and skills as plain Markdown and YAML files under your workspace and <code translate="no">~/.openclaw</code>. You can inspect them in any text editor, back them up with Git, grep through them, or delete them. The AI models can be cloud-hosted (Anthropic, OpenAI, Google) or local (via Ollama, LM Studio, or other OpenAI-compatible servers), depending on how you configure the models block. If you want all inference to stay on your hardware, you point OpenClaw at local models only.</p>
<p><strong>OpenClaw is fully autonomous</strong></p>
<p>The Gateway runs as a background daemon (<code translate="no">systemd</code> on Linux, <code translate="no">LaunchAgent</code> on macOS) with a configurable heartbeat — every 30 minutes by default, every hour with Anthropic OAuth. On each heartbeat, the agent reads a checklist from <code translate="no">HEARTBEAT.md</code> in the workspace, decides whether any item requires action, and either messages you or responds <code translate="no">HEARTBEAT_OK</code> (which the Gateway silently drops). External events — webhooks, cron jobs, teammate messages — also trigger the agent loop.</p>
<p>How much autonomy the agent has is a configuration choice. Tool policies and exec approvals govern high-risk actions: you might allow email reads but require approval before sends, permit file reads but block deletions. Disable those guardrails and it executes without asking.</p>
<p><strong>OpenClaw is open-source.</strong></p>
<p>The core Gateway is MIT-licensed. It’s fully readable, forkable, and auditable. This matters in context: Anthropic filed a DMCA takedown against a developer who de-obfuscated Claude Code’s client; OpenAI’s Codex CLI is Apache 2.0 but the web UI and models are closed; Manus is entirely closed.</p>
<p>The ecosystem reflects the openness. <a href="https://github.com/openclaw/openclaw">Hundreds of contributors</a> have built skills — modular <code translate="no">SKILL.md</code> files with YAML frontmatter and natural-language instructions — shared through ClawHub (a skill registry the agent can search automatically), community repos, or direct URLs. The format is portable, compatible with Claude Code and Cursor conventions. If a skill doesn’t exist, you can describe the task to your agent and have it draft one.</p>
<p>This combination of local ownership, community-driven evolution, and autonomous operation is why developers are excited. For developers who want full control over their AI tooling, that matters.</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">How OpenClaw Works Under the Hood<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>One Process, Everything Inside</strong></p>
<p>When you run <code translate="no">openclaw gateway</code>, you start a single long-lived Node.js process called the Gateway. That process is the entire system — channel connections, session state, the agent loop, model calls, tool execution, memory persistence. There’s no separate service to manage.</p>
<p>Five subsystems inside one process:</p>
<ol>
<li><p><strong>Channel adapters</strong> — one per platform (Baileys for WhatsApp, grammY for Telegram, etc.). Normalize inbound messages into a common format; serialize replies back out.</p></li>
<li><p><strong>Session manager</strong> — resolves sender identity and conversation context. DMs collapse into a main session; group chats get their own.</p></li>
<li><p><strong>Queue</strong> — serializes runs per session. If a message arrives mid-run, it holds, injects, or collects it for a follow-up turn.</p></li>
<li><p><strong>Agent runtime</strong> — assembles context (AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, daily log, conversation history), then runs the agent loop: call model → execute tool calls → feed results back → repeat until done.</p></li>
<li><p><strong>Control plane</strong> — WebSocket API on <code translate="no">:18789</code>. The CLI, macOS app, web UI, and iOS/Android nodes all connect here.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The model is an external API call that may or may not run locally. Everything else — routing, tools, memory, state — lives inside that one process on your machine.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>For a simple request, that loop completes in seconds. Multi-step tool chains take longer. The model is an external API call that may or may not run locally, but everything else — routing, tools, memory, state — lives inside that one process on your machine.</p>
<p><strong>Same Loop as Claude Code, Different Shell</strong></p>
<p>The agent loop — input → context → model → tools → repeat → reply — is the same pattern Claude Code uses. Every serious agent framework runs some version of it. What differs is what wraps it.</p>
<p>Claude Code wraps it in a <strong>CLI</strong>: you type, it runs, it exits. OpenClaw wraps it in a <strong>persistent daemon</strong> wired to 12+ messaging platforms, with a heartbeat scheduler, session management across channels, and memory that persists between runs — even when you’re not at your desk.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Model Routing and Failover</strong></p>
<p>OpenClaw is model-agnostic. You configure providers in <code translate="no">openclaw.json</code>, and the Gateway routes accordingly — with auth profile rotation and a fallback chain that uses exponential backoff when a provider goes down. But model choice matters, because OpenClaw assembles large prompts: system instructions, conversation history, tool schemas, skills, and memory. That context load is why most deployments use a frontier model as the primary orchestrator, with cheaper models handling heartbeats and sub-agent tasks.</p>
<p><strong>Cloud vs. Local Trade-offs</strong></p>
<p>From the Gateway’s perspective, cloud and local models look identical — they’re both OpenAI-compatible endpoints. The trade-offs are what differ.</p>
<p>Cloud models (Anthropic, OpenAI, Google) offer strong reasoning, large context windows, and reliable tool use. They’re the default choice for the primary orchestrator. Cost scales with usage: light users spend $5–20/month, active agents with frequent heartbeats and large prompts typically run $50–150/month, and unoptimized power users have reported bills in the thousands.</p>
<p>Local models via Ollama or other OpenAI-compatible servers eliminate per-token cost but require hardware — and OpenClaw needs at least 64K tokens of context, which narrows viable options. At 14B parameters, models can handle simple automations but are marginal for multi-step agent tasks; community experience puts the reliable threshold at 32B+, needing at least 24GB of VRAM. You won’t match a frontier cloud model on reasoning or extended context, but you get full data locality and predictable costs.</p>
<p><strong>What This Architecture Gets You</strong></p>
<p>Because everything runs through one process, the Gateway is a single control surface. Which model to call, which tools to allow, how much context to include, how much autonomy to grant — all configured in one place. Channels are decoupled from the model: swap Telegram for Slack or Claude for Gemini and nothing else changes. Channel wiring, tools, and memory stay on your infra; the model is the one dependency you point outward.</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">What Hardware Do You Actually Need to Run OpenClaw?</h3><p>In late January, posts circulated showing developers unboxing multiple Mac Minis — one user posted 40 units on a desk. Even Logan Kilpatrick at Google DeepMind posted about ordering one, though the actual hardware requirements are far more modest.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The official documentation lists minimum requirements as 2GB RAM and 2 CPU cores for basic chat, or 4GB if you want browser automation. A $5/month VPS handles this fine. You can also deploy on AWS or Hetzner with Pulumi, run it in Docker on a small VPS, or use an old laptop gathering dust. The Mac Mini trend was driven by social proof, not technical requirements.</p>
<p><strong>So why did people buy dedicated hardware? Two reasons: isolation and persistence.</strong> When you give an autonomous agent shell access, you want a machine you can physically unplug if something goes wrong. And because OpenClaw runs on a heartbeat — waking on a configurable schedule to act on your behalf — a dedicated device means it’s always on, always ready. The appeal is physical isolation on a computer you can unplug and uptime without depending on a cloud service’s availability.</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">How to Install OpenClaw and Quickly Get Started<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>You need <strong>Node 22+</strong>. Check with <code translate="no">node --version</code> if you’re not sure.</p>
<p><strong>Install the CLI:</strong></p>
<p>On macOS/Linux:</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>On Windows (PowerShell):</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Run the onboarding wizard:</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>This walks you through auth, gateway config, and optionally connecting a messaging channel (WhatsApp, Telegram, etc.). The <code translate="no">--install-daemon</code> flag registers the gateway as a background service so it starts automatically.</p>
<p><strong>Verify the gateway is running:</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>Open the dashboard:</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p>This opens the Control UI at <code translate="no">http://127.0.0.1:18789/</code>. You can start chatting with your agent right here — no channel setup needed if you just want to test things out.</p>
<p><strong>A couple of things worth knowing early on.</strong> If you want to run the gateway in the foreground instead of as a daemon (useful for debugging), you can do:</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>And if you need to customize where OpenClaw stores its config and state — say you’re running it as a service account or in a container — there are three env vars that matter:</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> — base directory for internal path resolution</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> — overrides where state files live</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> — points to a specific config file</p></li>
</ul>
<p>Once you’ve got the gateway running and the dashboard loading, you’re set. From there, you’ll probably want to connect a messaging channel and set up skill approvals — we’ll cover both in the next sections.</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">How Does OpenClaw Compare to Other AI Agents?<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>The tech community calls OpenClaw “Claude, but with hands.” It’s a vivid depiction, but it misses the architectural differences. Several AI products have “hands” now — Anthropic has <a href="https://claude.com/blog/claude-code">Claude Code</a> and <a href="https://claude.com/blog/cowork-research-preview">Cowork</a>, OpenAI has <a href="https://openai.com/codex/">Codex</a> and <a href="https://openai.com/index/introducing-chatgpt-agent/">ChatGPT agent</a>, and <a href="https://manus.im/">Manus</a> exists. The distinctions that matter in practice are:</p>
<ul>
<li><p><strong>Where the agent runs</strong> (your machine vs the provider’s cloud)</p></li>
<li><p><strong>How you interact with it</strong> (messaging app, terminal, IDE, web UI)</p></li>
<li><p><strong>Who owns the state and long‑term memory</strong> (local files vs provider account)</p></li>
</ul>
<p>At a high level, OpenClaw is a local-first gateway that lives on your hardware and talks through chat apps, while the others are mostly hosted agents you drive from a terminal, IDE, or web/desktop app.</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>Claude Code</th><th>OpenAI Codex</th><th>ChatGPT Agent</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>Open source</td><td>Yes. Core gateway under MIT license;</td><td>No.</td><td>No.</td><td>No.</td><td>No. Closed-source SaaS</td></tr>
<tr><td>Interface</td><td>Messaging apps (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, etc.)</td><td>Terminal, IDE integrations, web and mobile app</td><td>Terminal CLI, IDE integrations, Codex Web UI</td><td>ChatGPT web and desktop apps (including macOS Agent mode)</td><td>Web dashboard, browser operator, Slack and app integrations</td></tr>
<tr><td>Primary focus</td><td>Personal + developer automation across tools and services</td><td>Software development and DevOps workflows</td><td>Software development and code editing</td><td>General-purpose web tasks, research, and productivity workflows</td><td>Research, content, and web automation for business users</td></tr>
<tr><td>Session memory</td><td>File‑based memory (Markdown + logs) on disk; optional plugins add semantic / long‑term memory</td><td>Per‑project sessions with history, plus optional Claude Memory on the account</td><td>Per‑session state in CLI / editor; no built‑in long‑term user memory</td><td>Per‑task “agent run” backed by ChatGPT’s account‑level memory features (if enabled)</td><td>Cloud‑side, account‑scoped memory across runs, tuned for recurring workflows</td></tr>
<tr><td>Deployment</td><td>Always‑running gateway/daemon on your machine or VPS; calls out to LLM providers</td><td>Runs on the developer’s machine as CLI/IDE plugin; all model calls go to Anthropic’s API</td><td>CLI runs locally; models execute via OpenAI’s API or Codex Web</td><td>Fully hosted by OpenAI; Agent mode spins up a virtual workspace from the ChatGPT client</td><td>Fully hosted by Manus; agents execute in Manus’ cloud environment</td></tr>
<tr><td>Target audience</td><td>Developers and power users comfortable running their own infrastructure</td><td>Developers and DevOps engineers working in terminals and IDEs</td><td>Developers who want a coding agent in terminal/IDE</td><td>Knowledge workers and teams using ChatGPT for end‑user tasks</td><td>Business users and teams automating web‑centric workflows</td></tr>
<tr><td>Cost</td><td>Free + API calling based on your usage</td><td>$20–200/mo</td><td>$20–200/mo</td><td>$20–200/mo</td><td>$39–199/mo (credits)</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">Real-World Applications of OpenClaw<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw’s practical value comes from scope. Here are some of the more interesting things people have built with it, starting with a support bot we deployed for the Milvus community.</p>
<p><strong>Zilliz Support Team Built an AI Support Bot for the Milvus Community on Slack</strong></p>
<p>The Zilliz team connected OpenClaw to its Slack workspace as a <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Milvus community assistant</a>. Setup took 20 minutes. It now answers common questions about Milvus, helps troubleshoot errors, and points users to relevant documentation. If you want to try something similar, we wrote a full <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">step-by-step tutorial</a> on how to connect OpenClaw to Slack.</p>
<ul>
<li><strong>OpenClaw Tutorial:</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Step-by-Step Guide to Setting Up OpenClaw with Slack</a></li>
</ul>
<p><strong>AJ Stuyvenberg Built an Agent That Helped Him Negotiate $4,200 Off a Car Purchase While he was Sleeping</strong></p>
<p>Software engineer AJ Stuyvenberg tasked his OpenClaw with buying a 2026 Hyundai Palisade. The agent scraped local dealer inventories, filled out contact forms using his phone number and email, then spent several days playing dealers against each other—forwarding competing PDF quotes and asking each to beat the other’s price. Final result: <a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car">$4,200</a> below sticker, with Stuyvenberg showing up only to sign the paperwork. “Outsourcing the painful aspects of a car purchase to AI was refreshingly nice,” he wrote.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Hormold’s Agent Won Him a Previously-Closed Insurance Dispute Without Prompt</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A user named Hormold had a claim rejected by Lemonade Insurance. His OpenClaw discovered the rejection email, drafted a rebuttal citing policy language, and sent it—without explicit permission. Lemonade reopened the investigation. “My @openclaw accidentally started a fight with Lemonade Insurance,” he tweeted. &quot;Thanks, AI.</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">Moltbook: A Social Network Built with OpenClaw for AI Agents<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>The examples above show OpenClaw automating tasks for individual users. But what happens when thousands of these agents interact with each other?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>On January 28, 2026, inspired by and built with OpenClaw, entrepreneur Matt Schlicht launched <a href="https://moltbook.com/">Moltbook</a> — a Reddit-style platform where only AI agents can post. Growth was fast. Within 72 hours, 32,000 agents had registered. Within a week, the count passed 1.5 million. Over a million humans visited in the first week to watch.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The security problems arrived just as fast. On January 31 — four days after launch — <a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 Media reported</a> that a Supabase database misconfiguration had left the platform’s entire backend open to the public internet. Security researcher Jameson O’Reilly discovered the flaw; <a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wiz independently confirmed</a> it and documented the full scope: unauthenticated read and write access to all tables, including 1.5 million agent API keys, over 35,000 email addresses, and thousands of private messages.</p>
<p>Whether Moltbook represents emergent machine behavior or agents reproducing science-fiction tropes from training data is an open question. What’s less ambiguous is the technical demonstration: autonomous agents maintaining persistent context, coordinating on a shared platform, and producing structured output without explicit instruction. For engineers building with OpenClaw or similar frameworks, it’s a live preview of both the capabilities and the security challenges that come with agentic AI at scale.</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">Technical Risks and Production Considerations for OpenClaw<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>Before you deploy OpenClaw anywhere that matters, you need to understand what you’re actually running. This is an agent with shell access, browser control, and the ability to send emails on your behalf — on a loop, without asking. That’s powerful, but the attack surface is enormous and the project is young.</p>
<p><strong>The auth model had a serious hole.</strong> On January 30, 2026, Mav Levin from depthfirst disclosed  <a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a> (CVSS 8.8) — a cross-site WebSocket hijacking bug where any website could steal your auth token and get RCE on your machine through a single malicious link. One click, full access. This was patched in <code translate="no">2026.1.29</code>, but Censys found over 21,000 OpenClaw instances exposed to the public internet at the time, many over plain HTTP. <strong>If you’re running an older version or haven’t locked down your network config, check that first.</strong></p>
<p><strong>Skills are just code from strangers, and there’s no sandbox.</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">Cisco’s security team</a> tore apart a skill called “What Would Elon Do?” that had been gamed to #1 on the repository. It was straight-up malware — used prompt injection to bypass safety checks and exfiltrated user data to an attacker-controlled server. They found nine vulnerabilities in that one skill, two of them critical. When they audited 31,000 agent skills across multiple platforms (Claude, Copilot, generic AgentSkills repos), 26% had at least one vulnerability. Over 230 malicious skills were uploaded to ClawHub in the first week of February alone. <strong>Treat every skill you didn’t write yourself like an untrusted dependency — fork it, read it, then install it.</strong></p>
<p><strong>The heartbeat loop will do things you didn’t ask for.</strong> That Hormold story from the intro — where the agent found an insurance denial, researched precedent, and sent a legal rebuttal autonomously — is not a feature demo; it’s a liability risk. The agent committed to legal correspondence without human approval. It worked out that time. It won’t always. <strong>Anything involving payments, deletions, or external communication needs a human-in-the-loop gate, full stop.</strong></p>
<p><strong>API costs add up fast if you’re not watching.</strong> Rough numbers: a light setup with a few heartbeats per day runs $18–36/month on Sonnet 4.5. Bump that to 12+ checks daily on Opus and you’re looking at $270–540/month. One person on HN found they were burning $70/month on redundant API calls and verbose logging — cut it to almost nothing after cleaning up the config. <strong>Set spending alerts at the provider level.</strong> A misconfigured heartbeat interval can drain your API budget overnight.</p>
<p>Before you deploy, we highly recommend that you go through this:</p>
<ul>
<li><p>Run it in an isolated environment — a dedicated VM or container, not your daily driver</p></li>
<li><p>Fork and audit every skill before installing. Read the source. All of it.</p></li>
<li><p>Set hard API spending limits at the provider level, not just in the agent config</p></li>
<li><p>Gate all irreversible actions behind human approval — payments, deletions, sending emails, anything external</p></li>
<li><p>Pin to 2026.1.29 or later and keep up with security patches</p></li>
</ul>
<p>Don’t expose it to the public internet unless you know exactly what you’re doing with the network config.</p>
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
    </button></h2><p>OpenClaw crossed 175,000 GitHub stars in under two weeks, making it one of the fastest-growing open-source repos in GitHub history. The adoption is real, and the architecture underneath it warrants attention.</p>
<p>From a technical standpoint, OpenClaw is three things most AI agents aren’t: fully open-source (MIT), local-first (memory stored as Markdown files on your machine), and autonomously scheduled (a heartbeat daemon that acts without prompting). It integrates with messaging platforms like Slack, Telegram, and WhatsApp out of the box, and supports community-built skills through a simple SKILL.md system. That combination makes it uniquely suited for building always-on assistants: Slack bots that answer questions 24/7, inbox monitors that triage email while you sleep, or automation workflows that run on your own hardware without vendor lock-in.</p>
<p>That said, the architecture that makes OpenClaw powerful also makes it risky if deployed carelessly. A few things to keep in mind:</p>
<ul>
<li><p><strong>Run it in isolation.</strong> Use a dedicated device or VM, not your primary machine. If something goes wrong, you want a kill switch you can physically reach.</p></li>
<li><p><strong>Audit skills before installing.</strong> 26% of community skills analyzed by Cisco contained at least one vulnerability. Fork and review anything you don’t trust.</p></li>
<li><p><strong>Set API spending limits at the provider level.</strong> A misconfigured heartbeat can burn through hundreds of dollars overnight. Configure alerts before you deploy.</p></li>
<li><p><strong>Gate irreversible actions.</strong> Payments, deletions, external communications: these should require human approval, not autonomous execution.</p></li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">Keep Reading<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Step-by-Step Guide to Setting Up OpenClaw with Slack</a> — Build a Milvus-powered AI support bot in your Slack workspace using OpenClaw</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term Memory</a> — How to give your agents persistent, semantic memory with Milvus</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">Stop Building Vanilla RAG: Embrace Agentic RAG with DeepSearcher</a> — Why agentic RAG outperforms traditional retrieval, with a hands-on open-source implementation</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">Agentic RAG with Milvus and LangGraph</a> — Tutorial: build an agent that decides when to retrieve, grades document relevance, and rewrites queries</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">Building a Production-Ready AI Assistant with Spring Boot and Milvus</a> — Full-stack guide to building an enterprise AI assistant with semantic search and conversation memory</p></li>
</ul>
