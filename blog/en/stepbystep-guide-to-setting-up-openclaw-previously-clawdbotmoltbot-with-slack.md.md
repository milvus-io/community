---
id: stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: >
 Step-by-Step Guide to Setting Up OpenClaw (Previously Clawdbot/Moltbot) with Slack
author: Min Yin, Lumina Wang
date: 2026-02-04
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: OpenClaw, Clawdbot, Moltbot, Slack, Tutorial
meta_keywords: OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent
meta_title: >
 OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >
 Step-by-step guide to setting up OpenClaw with Slack. Run a self-hosted AI assistant on your Mac or Linux machine—no cloud required.
origin: https://milvus.io/blog/openclaw-slack-setup-guide.md
---

If you've been on tech Twitter, Hacker News, or Discord this week, you've seen it. A lobster emoji 🦞, screenshots of tasks being completed, and one bold claim: an AI that doesn't just *talk*—it actually *does*.

![](https://assets.zilliz.com/ST_1_567975a33f.png)

It got weirder over the weekend. Entrepreneur Matt Schlicht launched [Moltbook](https://moltbook.com)—a Reddit-style social network where only AI agents can post, and humans can only watch. Within days, over 1.5 million agents signed up. They formed communities, debated philosophy, complained about their human operators, and even founded their own religion called "Crustafarianism." Yes, really.
![](https://assets.zilliz.com/ST_2_b570b3e59b.png)

Welcome to the OpenClaw craze.

The hype is so real that Cloudflare's stock jumped 14% simply because developers use its infrastructure to run applications. Mac Mini sales reportedly spiked as people buy dedicated hardware for their new AI employee. And the GitHub repo? Over [150,000 stars](https://github.com/openclaw/openclaw) in just a few weeks.

So naturally, we had to show you how to set up your own OpenClaw instance—and connect it to Slack so you can boss around your AI assistant from your favorite messaging app.

## What Is OpenClaw?

[OpenClaw](https://openclaw.ai/) (formerly known as Clawdbot/Moltbot) is an open-source, autonomous AI agent that runs locally on user machines and performs real-world tasks via messaging apps such as WhatsApp, Telegram, and Discord. It automates digital workflows—such as managing emails, browsing the web, or scheduling meetings—by connecting to LLMs like Claude or ChatGPT. 

In short, it's like having a 24/7 digital assistant that can think, respond, and actually get stuff done.


## Setting Up OpenClaw as a Slack-Based AI Assistant

Imagine having a bot in your Slack workspace that can instantly answer questions about your product, help debug user issues, or point teammates to the right documentation—without anyone having to stop what they're doing. For us, that could mean faster support for the Milvus community: a bot that answers common questions ("How do I create a collection?"), helps troubleshoot errors, or summarizes release notes on demand. For your team, it might be onboarding new engineers, handling internal FAQs, or automating repetitive DevOps tasks. The use cases are wide open.

In this tutorial, we'll walk through the basics: installing OpenClaw on your machine and connecting it to Slack. Once that's done, you'll have a working AI assistant ready to customize for whatever you need.

### Prerequisites

-   A Mac or Linux machine
    
-   An [Anthropic API key](https://console.anthropic.com/) (or Claude Code CLI access)
    
-   A Slack workspace where you can install apps
    

That's it. Let's get started.

### Step 1: Install OpenClaw

Run the installer:

curl -fsSL https://molt.bot/install.sh | bash
![](https://assets.zilliz.com/ST_3_fc80684811.png)

  
When prompted, select **Yes** to continue.
![](Ihttps://assets.zilliz.com/ST_4_8004e87516.png)

  
Then, choose **QuickStart** mode.
![](https://assets.zilliz.com/ST_5_b5803c1d89.png)

  
### Step 2: Choose Your LLM

The installer will ask you to pick a model provider. We're using Anthropic with the Claude Code CLI for authentication.

1.  Select **Anthropic** as the provider
![](Ihttps://assets.zilliz.com/ST_6_a593124f6c.png)


2.  Complete the verification in your browser when prompted.
![](https://assets.zilliz.com/ST_7_410c1a39d3.png)


3.  Choose **anthropic/claude-opus-4-5-20251101** as your default model
![](https://assets.zilliz.com/ST_8_0c22bf5a16.png)

  
### Step 3: Set Up Slack

When asked to select a channel, choose **Slack.**
![](https://assets.zilliz.com/ST_9_cd4dfa5053.png)

  
Proceed to name your bot. We called ours "Clawdbot_Milvus."
![](https://assets.zilliz.com/ST_10_89c79ccd0d.png)

  
Now you'll need to create a Slack app and grab two tokens. Here's how:
![](https://assets.zilliz.com/ST_11_50df3aec5d.png)

**3.1 Create a Slack App**

Go to the [Slack API website](https://api.slack.com/apps?new_app=1) and create a new app from scratch.
![](Ihttps://assets.zilliz.com/ST_12_21987505d5.png)

  
Give it a name and select the workspace you want to use.
![](https://assets.zilliz.com/ST_13_7fce24b5c7.png)

**3.2 Set Bot Permissions**

In the sidebar, click **OAuth & Permissions**. Scroll down to **Bot Token Scopes** and add the permissions your bot needs.
![](https://assets.zilliz.com/ST_14_b08d66b55a.png)


**3.3 Enable Socket Mode**

Click **Socket Mode** in the sidebar and toggle it on.
![](https://assets.zilliz.com/ST_15_11545f95f8.png)


This will generate an **App-Level Token** (starts with `xapp-`). Copy it somewhere safe.
![](https://assets.zilliz.com/ST_16_c446eefd7d.png)


**3.4 Enable Event Subscriptions**

Go to **Event Subscriptions** and toggle it on.
![](https://assets.zilliz.com/ST_17_98387d6226.png)


Then choose which events your bot should subscribe to.
![](https://assets.zilliz.com/ST_18_b2a16d7786.png)

  
**3.5 Install the App**

Click **Install App** in the sidebar, then **Request to Install** (or install directly if you're a workspace admin).
![](Ihttps://assets.zilliz.com/ST_19_a5e76d0d33.png)

  
Once approved, you'll see your **Bot User OAuth Token** (starts with `xoxb-`). Copy this as well.
![](https://assets.zilliz.com/ST_20_a4a6878dbf.png)


### Step 4: Configure OpenClaw

Back in the OpenClaw CLI:

1.  Enter your **Bot User OAuth Token** (`xoxb-...`)
    
2.  Enter your **App-Level Token** (`xapp-...`)
![](https://assets.zilliz.com/ST_21_bd1629fb6a.png)


3.  Select which Slack channels the bot can access
![](https://assets.zilliz.com/ST_22_a1b682fa84.png)


4.  Skip skills configuration for now—you can always add them later
![](https://assets.zilliz.com/ST_23_cc4855ecfd.png)


5.  Select **Restart** to apply your changes
    

### Step 5: Try It Out

Head over to Slack and send your bot a message. If everything's set up correctly, OpenClaw will respond and be ready to run tasks on your machine.
![](https://assets.zilliz.com/ST_24_2864a88ce9.png)


### Tips

1.  Run `clawdbot dashboard` to manage settings through a web interface
![](https://assets.zilliz.com/ST_25_67b337b1d9.png)


2.  If something goes wrong, check the logs for error details
![](https://assets.zilliz.com/ST_26_a62b5669ee.png)


## A Word of Caution

OpenClaw is powerful—and that's exactly why you should be careful. "Actually does things" means it can execute real commands on your machine. That's the whole point, but it comes with risk.

**The good news:**

-   It's open source, so the code is auditable
    
-   It runs locally, so your data isn't on someone else's server
    
-   You control what permissions it has
    

**The not-so-good news:**

-   Prompt injection is a real risk—a malicious message could potentially trick the bot into running unintended commands
    
-   Scammers have already created fake OpenClaw repos and tokens, so be careful what you download
    

**Our advice:**

-   Don't run this on your primary machine. Use a VM, a spare laptop, or a dedicated server.
    
-   Don't grant more permissions than you need.
    
-   Don't use this in production yet. It's new. Treat it like the experiment it is.
    
-   Stick to official sources: [@openclaw](https://x.com/openclaw) on X and [OpenClaw](https://github.com/openclaw). 
    

Once you give an LLM the ability to execute commands, there's no such thing as 100% secure. That's not an OpenClaw problem—that's the nature of agentic AI. Just be smart about it.

## What's Next?

Congratulations! You now have a local AI assistant running on your own infrastructure, accessible through Slack. Your data stays yours, and you've got a tireless helper ready to automate the repetitive stuff.

From here, you can:

-   Install more [Skills](https://docs.molt.bot/skills) to expand what OpenClaw can do
    
-   Set up scheduled tasks so it works proactively
    
-   Connect other messaging platforms like Telegram or Discord
    
-   Explore the [Milvus](https://milvus.io/) ecosystem for AI search capabilities
    

**Have questions or want to share what you're building?**

-   Join the [Milvus Slack community](https://milvus.io/slack) to connect with other developers
    
-   Book our [Milvus Office Hours](https://milvus.io/office-hours) for live Q&A with the team
    

Happy hacking! 🦞