---
id: openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: >
 OpenClaw (Formerly Clawdbot & Moltbot) Explained: A Complete Guide to the Autonomous AI Agent
author: Julie Xia, Fendy Feng
date: 2026-02-10
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial
meta_keywords: OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent
meta_title: >
 What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: >
 Complete guide to OpenClaw (Clawdbot/Moltbot) — how it works, setup walkthrough, use cases, Moltbook, and security warnings.
origin: https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md
---

[OpenClaw](https://openclaw.ai/) (formerly known as Moltbot and Clawdbot) is an open-source AI agent that runs on your machine, connects through the messaging apps you already use (WhatsApp, Telegram, Slack, Signal, and others), and takes action on your behalf — shell commands, browser automation, email, calendar, and file operations. A heartbeat scheduler wakes it up at a configurable interval so it can run without being prompted. It gained over [100,000](https://github.com/openclaw/openclaw) GitHub stars in under a week after its launch in late January 2026, making it one of the fastest-growing open-source repositories in GitHub history. 

![](https://assets.zilliz.com/OC_1_e9bc8881bc.png)

What makes OpenClaw distinct is its combination: MIT-licensed, open-source, local-first (memory and data stored as Markdown files on your disk), and community-extensible through a portable skill format. It's also where some of the more interesting experiments in agentic AI are happening — one developer's agent negotiated $4,200 off a car purchase over email while he slept; another's filed a legal rebuttal to an insurance denial without being asked; and another user built [Moltbook](https://moltbook.com/), a social network where over a million AI agents interact autonomously while humans watch.

This guide breaks down everything you need to know: what OpenClaw is, how it works, what it can do in real life, how it relates to Moltbook, and the security risks associated with it.

## What is OpenClaw?

[OpenClaw](https://openclawd.ai/) (formerly Clawdbot and Moltbot) is an autonomous, open-source AI assistant that runs on your machine and lives in your chat apps. You talk to it through WhatsApp, Telegram, [Slack](https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md), Discord, iMessage, or Signal—whatever you already use—and it talks back. But unlike ChatGPT or Claude's web interface, OpenClaw doesn't just answer questions. It can run shell commands, control your browser, read and write files, manage your calendar, and send emails, all triggered by a text message.

It's built for developers and power users who want a personal AI assistant they can message from anywhere — without sacrificing control over their data or relying on a hosted service.

### Key Capabilities of OpenClaw 

-   **Multi-channel gateway** — WhatsApp, Telegram, Discord, and iMessage with a single gateway process. Add Mattermost and more with extension packages.
    
-   **Multi-agent routing** — isolated sessions per agent, workspace, or sender.
    
-   **Media support** — send and receive images, audio, and documents.
    
-   **Web Control UI** — browser dashboard for chat, config, sessions, and nodes.
    
-   **Mobile nodes** — pair iOS and Android nodes with Canvas support.
    

### What Makes OpenClaw Different?

**OpenClaw is self-hosted.** 

The gateway, tools, and memory of OpenClaw live on your machine, not in a vendor-hosted SaaS. OpenClaw stores conversations, long-term memory, and skills as plain Markdown and YAML files under your workspace and `~/.openclaw`. You can inspect them in any text editor, back them up with Git, grep through them, or delete them. The AI models can be cloud-hosted (Anthropic, OpenAI, Google) or local (via Ollama, LM Studio, or other OpenAI-compatible servers), depending on how you configure the models block. If you want all inference to stay on your hardware, you point OpenClaw at local models only.

**OpenClaw is fully autonomous**

The Gateway runs as a background daemon (`systemd` on Linux, `LaunchAgent` on macOS) with a configurable heartbeat — every 30 minutes by default, every hour with Anthropic OAuth. On each heartbeat, the agent reads a checklist from `HEARTBEAT.md` in the workspace, decides whether any item requires action, and either messages you or responds `HEARTBEAT_OK` (which the Gateway silently drops). External events — webhooks, cron jobs, teammate messages — also trigger the agent loop.

How much autonomy the agent has is a configuration choice. Tool policies and exec approvals govern high-risk actions: you might allow email reads but require approval before sends, permit file reads but block deletions. Disable those guardrails and it executes without asking.

**OpenClaw is open-source.** 

The core Gateway is MIT-licensed. It’s fully readable, forkable, and auditable. This matters in context: Anthropic filed a DMCA takedown against a developer who de-obfuscated Claude Code's client; OpenAI's Codex CLI is Apache 2.0 but the web UI and models are closed; Manus is entirely closed.

The ecosystem reflects the openness. [Hundreds of contributors](https://github.com/openclaw/openclaw) have built skills — modular `SKILL.md` files with YAML frontmatter and natural-language instructions — shared through ClawHub (a skill registry the agent can search automatically), community repos, or direct URLs. The format is portable, compatible with Claude Code and Cursor conventions. If a skill doesn't exist, you can describe the task to your agent and have it draft one.

This combination of local ownership, community-driven evolution, and autonomous operation is why developers are excited. For developers who want full control over their AI tooling, that matters.

## How OpenClaw Works Under the Hood 

**One Process, Everything Inside**

When you run `openclaw gateway`, you start a single long-lived Node.js process called the Gateway. That process is the entire system — channel connections, session state, the agent loop, model calls, tool execution, memory persistence. There's no separate service to manage.

Five subsystems inside one process:

1.  **Channel adapters** — one per platform (Baileys for WhatsApp, grammY for Telegram, etc.). Normalize inbound messages into a common format; serialize replies back out.
    
2.  **Session manager** — resolves sender identity and conversation context. DMs collapse into a main session; group chats get their own.
    
3.  **Queue** — serializes runs per session. If a message arrives mid-run, it holds, injects, or collects it for a follow-up turn.
    
4.  **Agent runtime** — assembles context (AGENTS.md, SOUL.md, TOOLS.md, MEMORY.md, daily log, conversation history), then runs the agent loop: call model → execute tool calls → feed results back → repeat until done.
    
5.  **Control plane** — WebSocket API on `:18789`. The CLI, macOS app, web UI, and iOS/Android nodes all connect here.
    

![](https://assets.zilliz.com/OC_2_07a24c0492.png)

The model is an external API call that may or may not run locally. Everything else — routing, tools, memory, state — lives inside that one process on your machine.

![](https://assets.zilliz.com/OC_3_0206219c02.png)

For a simple request, that loop completes in seconds. Multi-step tool chains take longer. The model is an external API call that may or may not run locally, but everything else — routing, tools, memory, state — lives inside that one process on your machine.

**Same Loop as Claude Code, Different Shell**

The agent loop — input → context → model → tools → repeat → reply — is the same pattern Claude Code uses. Every serious agent framework runs some version of it. What differs is what wraps it.

Claude Code wraps it in a **CLI**: you type, it runs, it exits. OpenClaw wraps it in a **persistent daemon** wired to 12+ messaging platforms, with a heartbeat scheduler, session management across channels, and memory that persists between runs — even when you're not at your desk.

![](https://assets.zilliz.com/OC_4_9c481b1ce7.png)

**Model Routing and Failover**

OpenClaw is model-agnostic. You configure providers in `openclaw.json`, and the Gateway routes accordingly — with auth profile rotation and a fallback chain that uses exponential backoff when a provider goes down. But model choice matters, because OpenClaw assembles large prompts: system instructions, conversation history, tool schemas, skills, and memory. That context load is why most deployments use a frontier model as the primary orchestrator, with cheaper models handling heartbeats and sub-agent tasks.

**Cloud vs. Local Trade-offs**

From the Gateway's perspective, cloud and local models look identical — they're both OpenAI-compatible endpoints. The trade-offs are what differ.

Cloud models (Anthropic, OpenAI, Google) offer strong reasoning, large context windows, and reliable tool use. They're the default choice for the primary orchestrator. Cost scales with usage: light users spend \$5–20/month, active agents with frequent heartbeats and large prompts typically run \$50–150/month, and unoptimized power users have reported bills in the thousands.

Local models via Ollama or other OpenAI-compatible servers eliminate per-token cost but require hardware — and OpenClaw needs at least 64K tokens of context, which narrows viable options. At 14B parameters, models can handle simple automations but are marginal for multi-step agent tasks; community experience puts the reliable threshold at 32B+, needing at least 24GB of VRAM. You won't match a frontier cloud model on reasoning or extended context, but you get full data locality and predictable costs.

**What This Architecture Gets You**

Because everything runs through one process, the Gateway is a single control surface. Which model to call, which tools to allow, how much context to include, how much autonomy to grant — all configured in one place. Channels are decoupled from the model: swap Telegram for Slack or Claude for Gemini and nothing else changes. Channel wiring, tools, and memory stay on your infra; the model is the one dependency you point outward.

### What Hardware Do You Actually Need to Run OpenClaw?

In late January, posts circulated showing developers unboxing multiple Mac Minis — one user posted 40 units on a desk. Even Logan Kilpatrick at Google DeepMind posted about ordering one, though the actual hardware requirements are far more modest.

![](https://assets.zilliz.com/OC_5_896f6a05f6.png)

The official documentation lists minimum requirements as 2GB RAM and 2 CPU cores for basic chat, or 4GB if you want browser automation. A $5/month VPS handles this fine. You can also deploy on AWS or Hetzner with Pulumi, run it in Docker on a small VPS, or use an old laptop gathering dust. The Mac Mini trend was driven by social proof, not technical requirements.

**So why did people buy dedicated hardware? Two reasons: isolation and persistence.** When you give an autonomous agent shell access, you want a machine you can physically unplug if something goes wrong. And because OpenClaw runs on a heartbeat — waking on a configurable schedule to act on your behalf — a dedicated device means it's always on, always ready. The appeal is physical isolation on a computer you can unplug and uptime without depending on a cloud service's availability.

## How to Install OpenClaw and Quickly Get Started 

You need **Node 22+**. Check with `node --version` if you're not sure.

**Install the CLI:**

On macOS/Linux:

```
curl -fsSL https://openclaw.ai/install.sh | bash
```

On Windows (PowerShell):

```
iwr -useb https://openclaw.ai/install.ps1 | iex
```

**Run the onboarding wizard:**

```
openclaw onboard --install-daemon
```

This walks you through auth, gateway config, and optionally connecting a messaging channel (WhatsApp, Telegram, etc.). The `--install-daemon` flag registers the gateway as a background service so it starts automatically.

**Verify the gateway is running:**

```
openclaw gateway status
```

**Open the dashboard:**

```
openclaw dashboard
```

This opens the Control UI at `http://127.0.0.1:18789/`. You can start chatting with your agent right here — no channel setup needed if you just want to test things out.

**A couple of things worth knowing early on.** If you want to run the gateway in the foreground instead of as a daemon (useful for debugging), you can do:

```
openclaw gateway --port 18789
```

And if you need to customize where OpenClaw stores its config and state — say you're running it as a service account or in a container — there are three env vars that matter:

-   `OPENCLAW_HOME` — base directory for internal path resolution
    
-   `OPENCLAW_STATE_DIR` — overrides where state files live
    
-   `OPENCLAW_CONFIG_PATH` — points to a specific config file
    

Once you've got the gateway running and the dashboard loading, you're set. From there, you'll probably want to connect a messaging channel and set up skill approvals — we'll cover both in the next sections.

## How Does OpenClaw Compare to Other AI Agents?

The tech community calls OpenClaw "Claude, but with hands." It’s a vivid depiction, but it misses the architectural differences. Several AI products have "hands" now — Anthropic has [Claude Code](https://claude.com/blog/claude-code) and [Cowork](https://claude.com/blog/cowork-research-preview), OpenAI has [Codex](https://openai.com/codex/) and [ChatGPT agent](https://openai.com/index/introducing-chatgpt-agent/), and [Manus](https://manus.im/) exists. The distinctions that matter in practice are:

-   **Where the agent runs** (your machine vs the provider’s cloud)
    
-   **How you interact with it** (messaging app, terminal, IDE, web UI)
    
-   **Who owns the state and long‑term memory** (local files vs provider account)
    

At a high level, OpenClaw is a local-first gateway that lives on your hardware and talks through chat apps, while the others are mostly hosted agents you drive from a terminal, IDE, or web/desktop app.

|  | OpenClaw | Claude Code | OpenAI Codex | ChatGPT Agent | Manus |
| --- | --- | --- | --- | --- | --- |
| Open source | Yes. Core gateway under MIT license; | No. | No. | No. | No. Closed-source SaaS |
| Interface | Messaging apps (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, etc.) | Terminal, IDE integrations, web and mobile app | Terminal CLI, IDE integrations, Codex Web UI | ChatGPT web and desktop apps (including macOS Agent mode) | Web dashboard, browser operator, Slack and app integrations |
| Primary focus | Personal + developer automation across tools and services | Software development and DevOps workflows | Software development and code editing | General-purpose web tasks, research, and productivity workflows | Research, content, and web automation for business users |
| Session memory | File‑based memory (Markdown + logs) on disk; optional plugins add semantic / long‑term memory | Per‑project sessions with history, plus optional Claude Memory on the account | Per‑session state in CLI / editor; no built‑in long‑term user memory | Per‑task “agent run” backed by ChatGPT’s account‑level memory features (if enabled) | Cloud‑side, account‑scoped memory across runs, tuned for recurring workflows |
| Deployment | Always‑running gateway/daemon on your machine or VPS; calls out to LLM providers | Runs on the developer’s machine as CLI/IDE plugin; all model calls go to Anthropic’s API | CLI runs locally; models execute via OpenAI’s API or Codex Web | Fully hosted by OpenAI; Agent mode spins up a virtual workspace from the ChatGPT client | Fully hosted by Manus; agents execute in Manus’ cloud environment |
| Target audience | Developers and power users comfortable running their own infrastructure | Developers and DevOps engineers working in terminals and IDEs | Developers who want a coding agent in terminal/IDE | Knowledge workers and teams using ChatGPT for end‑user tasks | Business users and teams automating web‑centric workflows |
| Cost | Free + API calling based on your usage | $20–200/mo | $20–200/mo | $20–200/mo | $39–199/mo (credits) |

  
## Real-World Applications of OpenClaw

OpenClaw's practical value comes from scope. Here are some of the more interesting things people have built with it, starting with a support bot we deployed for the Milvus community.

**Zilliz Support Team Built an AI Support Bot for the Milvus Community on Slack**

The Zilliz team connected OpenClaw to its Slack workspace as a [Milvus community assistant](https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md). Setup took 20 minutes. It now answers common questions about Milvus, helps troubleshoot errors, and points users to relevant documentation. If you want to try something similar, we wrote a full [step-by-step tutorial](https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md) on how to connect OpenClaw to Slack.

-   **OpenClaw Tutorial:** [Step-by-Step Guide to Setting Up OpenClaw with Slack](https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md)
    

**AJ Stuyvenberg Built an Agent That Helped Him Negotiate $4,200 Off a Car Purchase While he was Sleeping**

Software engineer AJ Stuyvenberg tasked his OpenClaw with buying a 2026 Hyundai Palisade. The agent scraped local dealer inventories, filled out contact forms using his phone number and email, then spent several days playing dealers against each other—forwarding competing PDF quotes and asking each to beat the other's price. Final result: [$4,200](https://aaronstuyvenberg.com/posts/clawd-bought-a-car) below sticker, with Stuyvenberg showing up only to sign the paperwork. "Outsourcing the painful aspects of a car purchase to AI was refreshingly nice," he wrote.

![](https://assets.zilliz.com/OC_6_b147a5e824.png)

**Hormold’s Agent Won Him a Previously-Closed Insurance Dispute Without Prompt**

![](https://assets.zilliz.com/OC_6_5_b1a9f37495.png)

A user named Hormold had a claim rejected by Lemonade Insurance. His OpenClaw discovered the rejection email, drafted a rebuttal citing policy language, and sent it—without explicit permission. Lemonade reopened the investigation. "My @openclaw accidentally started a fight with Lemonade Insurance," he tweeted. "Thanks, AI.

## Moltbook: A Social Network Built with OpenClaw for AI Agents

The examples above show OpenClaw automating tasks for individual users. But what happens when thousands of these agents interact with each other? 

![](https://assets.zilliz.com/OC_7_2dd1b06c04.png)

On January 28, 2026, inspired by and built with OpenClaw, entrepreneur Matt Schlicht launched [Moltbook](https://moltbook.com/) — a Reddit-style platform where only AI agents can post. Growth was fast. Within 72 hours, 32,000 agents had registered. Within a week, the count passed 1.5 million. Over a million humans visited in the first week to watch.

![](https://assets.zilliz.com/OC_8_ce2b911259.png)

The security problems arrived just as fast. On January 31 — four days after launch — [404 Media reported](https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/) that a Supabase database misconfiguration had left the platform's entire backend open to the public internet. Security researcher Jameson O'Reilly discovered the flaw; [Wiz independently confirmed](https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys) it and documented the full scope: unauthenticated read and write access to all tables, including 1.5 million agent API keys, over 35,000 email addresses, and thousands of private messages. 

Whether Moltbook represents emergent machine behavior or agents reproducing science-fiction tropes from training data is an open question. What's less ambiguous is the technical demonstration: autonomous agents maintaining persistent context, coordinating on a shared platform, and producing structured output without explicit instruction. For engineers building with OpenClaw or similar frameworks, it's a live preview of both the capabilities and the security challenges that come with agentic AI at scale.

## Technical Risks and Production Considerations for OpenClaw

Before you deploy OpenClaw anywhere that matters, you need to understand what you're actually running. This is an agent with shell access, browser control, and the ability to send emails on your behalf — on a loop, without asking. That's powerful, but the attack surface is enormous and the project is young.

**The auth model had a serious hole.** On January 30, 2026, Mav Levin from depthfirst disclosed  [CVE-2026-25253](https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html) (CVSS 8.8) — a cross-site WebSocket hijacking bug where any website could steal your auth token and get RCE on your machine through a single malicious link. One click, full access. This was patched in `2026.1.29`, but Censys found over 21,000 OpenClaw instances exposed to the public internet at the time, many over plain HTTP. **If you're running an older version or haven't locked down your network config, check that first.**

**Skills are just code from strangers, and there's no sandbox.** [Cisco's security team](https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare) tore apart a skill called "What Would Elon Do?" that had been gamed to #1 on the repository. It was straight-up malware — used prompt injection to bypass safety checks and exfiltrated user data to an attacker-controlled server. They found nine vulnerabilities in that one skill, two of them critical. When they audited 31,000 agent skills across multiple platforms (Claude, Copilot, generic AgentSkills repos), 26% had at least one vulnerability. Over 230 malicious skills were uploaded to ClawHub in the first week of February alone. **Treat every skill you didn't write yourself like an untrusted dependency — fork it, read it, then install it.**

**The heartbeat loop will do things you didn't ask for.** That Hormold story from the intro — where the agent found an insurance denial, researched precedent, and sent a legal rebuttal autonomously — is not a feature demo; it's a liability risk. The agent committed to legal correspondence without human approval. It worked out that time. It won't always. **Anything involving payments, deletions, or external communication needs a human-in-the-loop gate, full stop.**

**API costs add up fast if you're not watching.** Rough numbers: a light setup with a few heartbeats per day runs $18–36/month on Sonnet 4.5. Bump that to 12+ checks daily on Opus and you're looking at $270–540/month. One person on HN found they were burning $70/month on redundant API calls and verbose logging — cut it to almost nothing after cleaning up the config. **Set spending alerts at the provider level.** A misconfigured heartbeat interval can drain your API budget overnight.

Before you deploy, we highly recommend that you go through this:

-   Run it in an isolated environment — a dedicated VM or container, not your daily driver
    
-   Fork and audit every skill before installing. Read the source. All of it.
    
-   Set hard API spending limits at the provider level, not just in the agent config
    
-   Gate all irreversible actions behind human approval — payments, deletions, sending emails, anything external
    
-   Pin to 2026.1.29 or later and keep up with security patches
    

Don't expose it to the public internet unless you know exactly what you're doing with the network config.

## Conclusion

OpenClaw crossed 175,000 GitHub stars in under two weeks, making it one of the fastest-growing open-source repos in GitHub history. The adoption is real, and the architecture underneath it warrants attention.

From a technical standpoint, OpenClaw is three things most AI agents aren't: fully open-source (MIT), local-first (memory stored as Markdown files on your machine), and autonomously scheduled (a heartbeat daemon that acts without prompting). It integrates with messaging platforms like Slack, Telegram, and WhatsApp out of the box, and supports community-built skills through a simple SKILL.md system. That combination makes it uniquely suited for building always-on assistants: Slack bots that answer questions 24/7, inbox monitors that triage email while you sleep, or automation workflows that run on your own hardware without vendor lock-in.

That said, the architecture that makes OpenClaw powerful also makes it risky if deployed carelessly. A few things to keep in mind:

-   **Run it in isolation.** Use a dedicated device or VM, not your primary machine. If something goes wrong, you want a kill switch you can physically reach.
    
-   **Audit skills before installing.** 26% of community skills analyzed by Cisco contained at least one vulnerability. Fork and review anything you don't trust.
    
-   **Set API spending limits at the provider level.** A misconfigured heartbeat can burn through hundreds of dollars overnight. Configure alerts before you deploy.
    
-   **Gate irreversible actions.** Payments, deletions, external communications: these should require human approval, not autonomous execution.
    

## Keep Reading 

-   [Step-by-Step Guide to Setting Up OpenClaw with Slack](https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md) — Build a Milvus-powered AI support bot in your Slack workspace using OpenClaw
    
-   [LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term Memory](https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md) — How to give your agents persistent, semantic memory with Milvus
    
-   [Stop Building Vanilla RAG: Embrace Agentic RAG with DeepSearcher](https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md) — Why agentic RAG outperforms traditional retrieval, with a hands-on open-source implementation
    
-   [Agentic RAG with Milvus and LangGraph](https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md) — Tutorial: build an agent that decides when to retrieve, grades document relevance, and rewrites queries
    
-   [Building a Production-Ready AI Assistant with Spring Boot and Milvus](https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md) — Full-stack guide to building an enterprise AI assistant with semantic search and conversation memory