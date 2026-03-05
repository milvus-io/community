---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >
  Building AI Agents in 10 Minutes Using Natural Language with LangSmith Agent
  Builder + Milvus
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  Learn how to build memory-enabled AI agents in minutes using LangSmith Agent
  Builder and Milvus—no code, natural language, production-ready.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>As AI development accelerates, more teams are discovering that building an AI assistant doesn’t necessarily require a software engineering background. The people who need assistants the most—product teams, operations, support, researchers—often know exactly what the agent should do, but not how to implement it in code. Traditional “no-code” tools tried to bridge that gap with drag-and-drop canvases, yet they collapse the moment you need real agent behavior: multi-step reasoning, tool use, or persistent memory.</p>
<p>The newly released <a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builder</strong></a> takes a different approach. Instead of designing workflows, you describe the agent’s goals and available tools in plain language, and the runtime handles the decision-making. No flowcharts, no scripting—just clear intent.</p>
<p>But intent alone doesn’t produce an intelligent assistant. <strong>Memory</strong> does. This is where <a href="https://milvus.io/"><strong>Milvus</strong></a>, the widely adopted open-source vector database, provides the foundation. By storing documents and conversation history as embeddings, Milvus allows your agent to recall context, retrieve relevant information, and respond accurately at scale.</p>
<p>This guide walks through how to build a production-ready, memory-enabled AI assistant using <strong>LangSmith Agent Builder + Milvus</strong>, all without writing a single line of code.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">What is LangSmith Agent Builder and How It Works?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Just as its name reveals, <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builder</a> is a no-code tool from LangChain that lets you build, deploy, and manage AI agents using plain language. Instead of writing logic or designing visual flows, you explain what the agent should do, what tools it can use, and how it should behave. The system then handles the hard parts—generating prompts, selecting tools, wiring components together, and enabling memory.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Unlike traditional no-code or workflow tools, Agent Builder doesn’t have drag-and-drop canvas and no node library. You interact with it the same way you would with ChatGPT. Describe what you want to build, answer a few clarifying questions, and the Builder produces a fully functioning agent based on your intent.</p>
<p>Behind the scenes, that agent is constructed from four core building blocks.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>Prompt:</strong> The prompt is the agent’s brain, defining its goals, constraints, and decision logic. LangSmith Agent Builder uses meta-prompting to build this automatically: you describe what you want, it asks clarifying questions, and your answers are synthesized into a detailed, production-ready system prompt. Instead of hand-writing logic, you simply express intent.</li>
<li><strong>Tools:</strong> Tools let the agent take action—sending emails, posting to Slack, creating calendar events, searching data, or calling APIs. Agent Builder integrates these tools through the Model Context Protocol (MCP), which provides a secure, extensible way to expose capabilities. Users can rely on built-in integrations or add custom MCP servers, including Milvus <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">MCP server</a>s for vector search and long-term memory.</li>
<li><strong>Triggers:</strong> Triggers define when an agent runs. In addition to manual execution, you can attach agents to schedules or external events so they automatically respond to messages, emails, or webhook activity. When a trigger fires, Agent Builder starts a new execution thread and runs the agent’s logic, enabling continuous, event-driven behavior.</li>
<li><strong>Subagents:</strong> Subagents break complex tasks into smaller, specialized units. A primary agent can delegate work to subagents—each with its own prompt and toolset—so tasks like data retrieval, summarization, or formatting are handled by dedicated helpers. This avoids a single overloaded prompt and creates a more modular, scalable agent architecture.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">How Does an Agent Remember Your Preferences?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>What makes Agent Builder unique is how it treats <em>memory</em>. Instead of stuffing preferences into chat history, the agent can update its own behavior rules while running. If you say, “From now on, end every Slack message with a poem,” the agent doesn’t treat that as a one-off request—it stores it as a persistent preference that applies in future runs.</p>
<p>Under the hood, the agent keeps an internal memory file—essentially its evolving system prompt. Each time it starts, it reads this file to decide how to behave. When you give corrections or constraints, the agent edits the file by adding structured rules like “Always close the briefing with a short uplifting poem.” This approach is far more stable than relying on conversation history because the agent actively rewrites its operating instructions rather than burying your preferences inside a transcript.</p>
<p>This design comes from DeepAgents’ FilesystemMiddleware but is fully abstracted in Agent Builder. You never touch files directly: you express updates in natural language, and the system handles the edits behind the scenes. If you need more control, you can plug in a custom MCP server or drop to the DeepAgents layer for advanced memory customization.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">Hands-on Demo: Building a Milvus Assistant in 10 Minutes using Agent Builder<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Now that we’ve covered the design philosophy behind Agent Builder, let’s walk through the full build process with a hands-on example. Our goal is to create an intelligent assistant that can answer Milvus-related technical questions, search the official documentation, and remember user preferences over time.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">Step 1. Sign In to the LangChain Website</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">Step 2. Set Up Your Anthropic API Key</h3><p><strong>Note:</strong> Anthropic is supported by default. You can also use a custom model, as long as its type is included in the list officially supported by LangChain.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Add an API Key</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. Enter and Save the API Key</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">Step 3. Create a New Agent</h3><p><strong>Note:</strong> Click <strong>Learn More</strong> to view the usage documentation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Configure a Custom Model (Optional)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) Enter Parameters and Save</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">Step 4. Describe Your Requirements to Create the Agent</h3><p><strong>Note:</strong> Create the agent using a natural language description.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>The System Asks Follow-Up Questions to Refine Requirements</strong></li>
</ol>
<p>Question 1: Select the Milvus index types you want the agent to remember</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Question 2: Choose how the agent should handle technical questions

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Question 3: Specify whether the agent should focus on guidance for a specific Milvus version

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">Step 5. Review and Confirm the Generated Agent</h3><p><strong>Note:</strong> The system automatically generates the agent configuration.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Before creating the agent, you can review its metadata, tools, and prompts. Once everything looks correct, click <strong>Create</strong> to proceed.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">Step 6. Explore the Interface and Feature Areas</h3><p>After the agent is created, you’ll see three functional areas in the lower-left corner of the interface:</p>
<p><strong>(1) Triggers</strong></p>
<p>Triggers define when the agent should run, either in response to external events or on a schedule:</p>
<ul>
<li><strong>Slack:</strong> Activate the agent when a message arrives in a specific channel</li>
<li><strong>Gmail:</strong> Trigger the agent when a new email is received</li>
<li><strong>Cron:</strong> Run the agent on a scheduled interval</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Toolbox</strong></p>
<p>This is the set of tools the agent can call. In the example shown, the three tools are generated automatically during creation, and you can add more by clicking <strong>Add tool</strong>.

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>If your agent needs vector search capabilities—such as semantic search across large volumes of technical documentation—you can deploy Milvus’s MCP Server</strong> and add it here using the <strong>MCP</strong> button. Make sure the MCP server is running <strong>at a reachable network endpoint</strong>; otherwise, Agent Builder won’t be able to invoke it.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Sub-agents</strong></p>
<p>Create independent agent modules dedicated to specific subtasks, enabling a modular system design.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">Step 7. Test the Agent</h3><p>Click <strong>Test</strong> in the top-right corner to enter testing mode. Below is a sample of the test results.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Agent Builder vs. DeepAgents: Which One Should You Choose?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain offers multiple agent frameworks, and the right choice depends on how much control you need. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> is agent building tool. It is used to build autonomous, long-running AI agents that handle complex, multi-step tasks. Built on LangGraph, it supports advanced planning, file-based context management, and subagent orchestration—making it ideal for long-horizon or production-grade projects.</p>
<p>So how does that compare to <strong>Agent Builder</strong>, and when should you use each?</p>
<p><strong>Agent Builder</strong> focuses on simplicity and speed. It abstracts away most implementation details, letting you describe your agent in natural language, configure tools, and run it immediately. Memory, tool use, and human-in-the-loop workflows are handled for you. This makes Agent Builder perfect for rapid prototyping, internal tools, and early-stage validation where ease of use matters more than granular control.</p>
<p><strong>DeepAgents</strong>, by contrast, is designed for scenarios where you need full control over memory, execution, and infrastructure. You can customize middleware, integrate any Python tool, modify the storage backend (including persisting memory in <a href="https://milvus.io/blog">Milvus</a>), and explicitly manage the agent’s state graph. The trade-off is engineering effort—you write code, manage dependencies, and handle failure modes yourself—but you get a fully customizable agent stack.</p>
<p>Importantly, <strong>Agent Builder and DeepAgents are not separate ecosystems—they form a single continuum</strong>. Agent Builder is built on top of DeepAgents. That means you can start with a quick prototype in Agent Builder, then drop into DeepAgents when you need more flexibility, without rewriting everything from scratch. The reverse also works: patterns built in DeepAgents can be packaged as Agent Builder templates so non-technical users can reuse them.</p>
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
    </button></h2><p>Thanks to the development of AI, building AI agents no longer requires complex workflows or heavy engineering. With LangSmith Agent Builder, you can create stateful, long-running assistants using natural language alone. You focus on describing what the agent should do, while the system handles planning, tool execution, and ongoing memory updates.</p>
<p>Paired with <a href="https://milvus.io/blog">Milvus</a>, these agents gain reliable, persistent memory for semantic search, preference tracking, and long-term context across sessions. Whether you’re validating an idea or deploying a scalable system, LangSmith Agent Builder and Milvus provide a simple, flexible foundation for agents that don’t just respond—they remember and improve over time.</p>
<p>Have questions or want a deeper walkthrough? Join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack channel</a> or book a 20-minute <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> session for personalized guidance.</p>
