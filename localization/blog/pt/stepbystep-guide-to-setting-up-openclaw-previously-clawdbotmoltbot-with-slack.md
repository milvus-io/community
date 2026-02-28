---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: >
  Step-by-Step Guide to Setting Up OpenClaw (Previously Clawdbot/Moltbot) with
  Slack
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >
  Step-by-step guide to setting up OpenClaw with Slack. Run a self-hosted AI
  assistant on your Mac or Linux machine—no cloud required.
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>If you’ve been on tech Twitter, Hacker News, or Discord this week, you’ve seen it. A lobster emoji 🦞, screenshots of tasks being completed, and one bold claim: an AI that doesn’t just <em>talk</em>—it actually <em>does</em>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>It got weirder over the weekend. Entrepreneur Matt Schlicht launched <a href="https://moltbook.com">Moltbook</a>—a Reddit-style social network where only AI agents can post, and humans can only watch. Within days, over 1.5 million agents signed up. They formed communities, debated philosophy, complained about their human operators, and even founded their own religion called “Crustafarianism.” Yes, really.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Welcome to the OpenClaw craze.</p>
<p>The hype is so real that Cloudflare’s stock jumped 14% simply because developers use its infrastructure to run applications. Mac Mini sales reportedly spiked as people buy dedicated hardware for their new AI employee. And the GitHub repo? Over <a href="https://github.com/openclaw/openclaw">150,000 stars</a> in just a few weeks.</p>
<p>So naturally, we had to show you how to set up your own OpenClaw instance—and connect it to Slack so you can boss around your AI assistant from your favorite messaging app.</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">What Is OpenClaw?<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a> (formerly known as Clawdbot/Moltbot) is an open-source, autonomous AI agent that runs locally on user machines and performs real-world tasks via messaging apps such as WhatsApp, Telegram, and Discord. It automates digital workflows—such as managing emails, browsing the web, or scheduling meetings—by connecting to LLMs like Claude or ChatGPT.</p>
<p>In short, it’s like having a 24/7 digital assistant that can think, respond, and actually get stuff done.</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">Setting Up OpenClaw as a Slack-Based AI Assistant<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Imagine having a bot in your Slack workspace that can instantly answer questions about your product, help debug user issues, or point teammates to the right documentation—without anyone having to stop what they’re doing. For us, that could mean faster support for the Milvus community: a bot that answers common questions (“How do I create a collection?”), helps troubleshoot errors, or summarizes release notes on demand. For your team, it might be onboarding new engineers, handling internal FAQs, or automating repetitive DevOps tasks. The use cases are wide open.</p>
<p>In this tutorial, we’ll walk through the basics: installing OpenClaw on your machine and connecting it to Slack. Once that’s done, you’ll have a working AI assistant ready to customize for whatever you need.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisites</h3><ul>
<li><p>A Mac or Linux machine</p></li>
<li><p>An <a href="https://console.anthropic.com/">Anthropic API key</a> (or Claude Code CLI access)</p></li>
<li><p>A Slack workspace where you can install apps</p></li>
</ul>
<p>That’s it. Let’s get started.</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">Step 1: Install OpenClaw</h3><p>Run the installer:</p>
<p>curl -fsSL https://molt.bot/install.sh | bash

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>When prompted, select <strong>Yes</strong> to continue.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Then, choose <strong>QuickStart</strong> mode.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">Step 2: Choose Your LLM</h3><p>The installer will ask you to pick a model provider. We’re using Anthropic with the Claude Code CLI for authentication.</p>
<ol>
<li>Select <strong>Anthropic</strong> as the provider

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>Complete the verification in your browser when prompted.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>Choose <strong>anthropic/claude-opus-4-5-20251101</strong> as your default model

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">Step 3: Set Up Slack</h3><p>When asked to select a channel, choose <strong>Slack.</strong>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Proceed to name your bot. We called ours “Clawdbot_Milvus.”

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Now you’ll need to create a Slack app and grab two tokens. Here’s how:

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Create a Slack App</strong></p>
<p>Go to the <a href="https://api.slack.com/apps?new_app=1">Slack API website</a> and create a new app from scratch.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Give it a name and select the workspace you want to use.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 Set Bot Permissions</strong></p>
<p>In the sidebar, click <strong>OAuth &amp; Permissions</strong>. Scroll down to <strong>Bot Token Scopes</strong> and add the permissions your bot needs.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 Enable Socket Mode</strong></p>
<p>Click <strong>Socket Mode</strong> in the sidebar and toggle it on.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This will generate an <strong>App-Level Token</strong> (starts with <code translate="no">xapp-</code>). Copy it somewhere safe.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 Enable Event Subscriptions</strong></p>
<p>Go to <strong>Event Subscriptions</strong> and toggle it on.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Then choose which events your bot should subscribe to.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 Install the App</strong></p>
<p>Click <strong>Install App</strong> in the sidebar, then <strong>Request to Install</strong> (or install directly if you’re a workspace admin).

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Once approved, you’ll see your <strong>Bot User OAuth Token</strong> (starts with <code translate="no">xoxb-</code>). Copy this as well.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/oauth_tokens_2e75e66f89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">Step 4: Configure OpenClaw</h3><p>Back in the OpenClaw CLI:</p>
<ol>
<li><p>Enter your <strong>Bot User OAuth Token</strong> (<code translate="no">xoxb-...</code>)</p></li>
<li><p>Enter your <strong>App-Level Token</strong> (<code translate="no">xapp-...</code>)

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>Select which Slack channels the bot can access

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>Skip skills configuration for now—you can always add them later

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li>Select <strong>Restart</strong> to apply your changes</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">Step 5: Try It Out</h3><p>Head over to Slack and send your bot a message. If everything’s set up correctly, OpenClaw will respond and be ready to run tasks on your machine.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">Tips</h3><ol>
<li>Run <code translate="no">clawdbot dashboard</code> to manage settings through a web interface

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>If something goes wrong, check the logs for error details

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">A Word of Caution<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw is powerful—and that’s exactly why you should be careful. “Actually does things” means it can execute real commands on your machine. That’s the whole point, but it comes with risk.</p>
<p><strong>The good news:</strong></p>
<ul>
<li><p>It’s open source, so the code is auditable</p></li>
<li><p>It runs locally, so your data isn’t on someone else’s server</p></li>
<li><p>You control what permissions it has</p></li>
</ul>
<p><strong>The not-so-good news:</strong></p>
<ul>
<li><p>Prompt injection is a real risk—a malicious message could potentially trick the bot into running unintended commands</p></li>
<li><p>Scammers have already created fake OpenClaw repos and tokens, so be careful what you download</p></li>
</ul>
<p><strong>Our advice:</strong></p>
<ul>
<li><p>Don’t run this on your primary machine. Use a VM, a spare laptop, or a dedicated server.</p></li>
<li><p>Don’t grant more permissions than you need.</p></li>
<li><p>Don’t use this in production yet. It’s new. Treat it like the experiment it is.</p></li>
<li><p>Stick to official sources: <a href="https://x.com/openclaw">@openclaw</a> on X and <a href="https://github.com/openclaw">OpenClaw</a>.</p></li>
</ul>
<p>Once you give an LLM the ability to execute commands, there’s no such thing as 100% secure. That’s not an OpenClaw problem—that’s the nature of agentic AI. Just be smart about it.</p>
<h2 id="Whats-Next" class="common-anchor-header">What’s Next?<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Congratulations! You now have a local AI assistant running on your own infrastructure, accessible through Slack. Your data stays yours, and you’ve got a tireless helper ready to automate the repetitive stuff.</p>
<p>From here, you can:</p>
<ul>
<li><p>Install more <a href="https://docs.molt.bot/skills">Skills</a> to expand what OpenClaw can do</p></li>
<li><p>Set up scheduled tasks so it works proactively</p></li>
<li><p>Connect other messaging platforms like Telegram or Discord</p></li>
<li><p>Explore the <a href="https://milvus.io/">Milvus</a> ecosystem for AI search capabilities</p></li>
</ul>
<p><strong>Have questions or want to share what you’re building?</strong></p>
<ul>
<li><p>Join the <a href="https://milvus.io/slack">Milvus Slack community</a> to connect with other developers</p></li>
<li><p>Book our <a href="https://milvus.io/office-hours">Milvus Office Hours</a> for live Q&amp;A with the team</p></li>
</ul>
<p>Happy hacking! 🦞</p>
