---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: |
  Getting Started with langgraph-up-react: A Practical LangGraph Template
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  introducing langgraph-up-react, a ready-to-use LangGraph + ReAct template for
  ReAct agents.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>AI agents are becoming a core pattern in applied AI. More projects are moving past single prompts and wiring models into decision-making loops. That’s exciting, but it also means managing state, coordinating tools, handling branches, and adding human handoffs—things that aren’t immediately obvious.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> is a strong choice for this layer. It is an AI framework that provides loops, conditionals, persistence, human-in-the-loop controls, and streaming—enough structure to turn an idea into a real multi-agent app. However, LangGraph has a steep learning curve. Its documentation moves quickly, the abstractions take time to get used to, and jumping from a simple demo to something that feels like a product can be frustrating.</p>
<p>Recently, I started using <a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a>—a ready-to-use LangGraph + ReAct template for ReAct agents. It trims setup, ships with sane defaults, and lets you focus on behavior instead of boilerplate. In this post, I’ll walk through how to get started with LangGraph using this template.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">Understanding ReAct Agents<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Before diving into the template itself, it’s worth looking at the kind of agent we’ll be building. One of the most common patterns today is the <strong>ReAct (Reason + Act)</strong> framework, first introduced in Google’s 2022 paper <em>“</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct: Synergizing Reasoning and Acting in Language Models.</em></a><em>”</em></p>
<p>The idea is straightforward: instead of treating reasoning and action as separate, ReAct combines them into a feedback loop that looks a lot like human problem solving. The agent <strong>reasons</strong> about the problem, <strong>acts</strong> by calling a tool or API, and then <strong>observes</strong> the result before deciding what to do next. This simple cycle—reason → act → observe—lets agents adapt dynamically instead of following a fixed script.</p>
<p>Here’s how the pieces fit together:</p>
<ul>
<li><p><strong>Reason</strong>: The model breaks problems into steps, plans strategies, and can even correct mistakes mid-way.</p></li>
<li><p><strong>Act</strong>: Based on its reasoning, the agent calls tools—whether that’s a search engine, a calculator, or your own custom API.</p></li>
<li><p><strong>Observe</strong>: The agent looks at the tool’s output, filters the results, and feeds that back into its next round of reasoning.</p></li>
</ul>
<p>This loop has quickly become the backbone of modern AI agents. You’ll see traces of it in ChatGPT plugins, RAG pipelines, intelligent assistants, and even robotics. In our case, it’s the foundation that the <code translate="no">langgraph-up-react</code> template builds on.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">Understanding LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Now that we’ve looked at the ReAct pattern, the next question is: how do you actually implement something like that in practice? Out of the box, most language models don’t handle multi-step reasoning very well. Each call is stateless: the model generates an answer and forgets everything as soon as it’s done. That makes it hard to carry intermediate results forward or adjust later steps based on earlier ones.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> closes this gap. Instead of treating every prompt as a one-off, it gives you a way to break complex tasks into steps, remember what happened at each point, and decide what to do next based on the current state. In other words, it turns an agent’s reasoning process into something structured and repeatable, rather than a chain of ad-hoc prompts.</p>
<p>You can think of it like a <strong>flowchart for AI reasoning</strong>:</p>
<ul>
<li><p><strong>Analyze</strong> the user query</p></li>
<li><p><strong>Select</strong> the right tool for the job</p></li>
<li><p><strong>Execute</strong> the task by calling the tool</p></li>
<li><p><strong>Process</strong> the results</p></li>
<li><p><strong>Check</strong> if the task is complete; if not, loop back and continue reasoning</p></li>
<li><p><strong>Output</strong> the final answer</p></li>
</ul>
<p>Along the way, LangGraph handles <strong>memory storage</strong> so results from earlier steps aren’t lost, and it integrates with an <strong>external tool library</strong> (APIs, databases, search, calculators, file systems, etc.).</p>
<p>That’s why it’s called <em>LangGraph</em>: <strong>Lang (Language) + Graph</strong>—a framework for organizing how language models think and act over time.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">Understanding langgraph-up-react<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph is powerful, but it comes with overhead. Setting up state management, designing nodes and edges, handling errors, and wiring in models and tools all take time. Debugging multi-step flows can also be painful—when something breaks, the issue might be in any node or transition. As projects grow, even small changes can ripple through the codebase and slow everything down.</p>
<p>This is where a mature template makes a huge difference. Instead of starting from scratch, a template gives you a proven structure, pre-built tools, and scripts that just work. You skip the boilerplate and focus directly on the agent logic.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a> is one such template. It’s designed to help you spin up a LangGraph ReAct agent quickly, with:</p>
<ul>
<li><p>🔧 <strong>Built-in tool ecosystem</strong>: adapters and utilities ready to use out of the box</p></li>
<li><p>⚡ <strong>Quick start</strong>: simple configuration and a working agent in minutes</p></li>
<li><p>🧪 <strong>Testing included</strong>: unit tests and integration tests for confidence as you extend</p></li>
<li><p>📦 <strong>Production-ready setup</strong>: architecture patterns and scripts that save time when deploying</p></li>
</ul>
<p>In short, it takes care of the boilerplate so you can focus on building agents that actually solve your business problems.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">Getting Started with the langgraph-up-react Template<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>Getting the template running is straightforward. Here’s the setup process step by step:</p>
<ol>
<li>Install environment dependencies</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Clone the project</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Install dependencies</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Configure environment</li>
</ol>
<p>Copy the example config and add your keys:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Edit .env and set at least one model provider plus your Tavily API key:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Start the project</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>Your dev server will now be up and ready for testing.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">What Can You Build with langgraph-up-react?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>So what can you actually do once the template is up and running? Here are two concrete examples that show how it can be applied in real projects.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">Enterprise Knowledge Base Q&amp;A (Agentic RAG)</h3><p>A common use case is an internal Q&amp;A assistant for company knowledge. Think product manuals, technical docs, FAQs—information that’s useful but scattered. With <code translate="no">langgraph-up-react</code>, you can create an agent that indexes these documents in a <a href="https://milvus.io/"><strong>Milvus</strong></a> vector database, retrieves the most relevant passages, and generates accurate answers grounded in context.</p>
<p>For deployment, Milvus offers flexible options: <strong>Lite</strong> for quick prototyping, <strong>Standalone</strong> for mid-sized production workloads, and <strong>Distributed</strong> for enterprise-scale systems. You’ll also want to tune index parameters (e.g., HNSW) to balance speed and accuracy, and set up monitoring for latency and recall to ensure the system remains reliable under load.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">Multi-Agent Collaboration</h3><p>Another powerful use case is multi-agent collaboration. Instead of one agent trying to do everything, you define several specialized agents that work together. In a software development workflow, for example, a Product Manager Agent breaks down requirements, an Architect Agent drafts the design, a Developer Agent writes code, and a Testing Agent validates the results.</p>
<p>This orchestration highlights LangGraph’s strengths—state management, branching, and coordination across agents. We’ll cover this setup in more detail in a later article, but the key point is that <code translate="no">langgraph-up-react</code> makes it practical to try these patterns without spending weeks on scaffolding.</p>
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
    </button></h2><p>Building reliable agents isn’t just about clever prompts—it’s about structuring reasoning, managing state, and wiring everything into a system you can actually maintain. LangGraph gives you the framework to do that, and <code translate="no">langgraph-up-react</code> lowers the barrier by handling the boilerplate so you can focus on agent behavior.</p>
<p>With this template, you can spin up projects like knowledge base Q&amp;A systems or multi-agent workflows without getting lost in setup. It’s a starting point that saves time, avoids common pitfalls, and makes experimenting with LangGraph far smoother.</p>
<p>In the next post, I’ll go deeper into a hands-on tutorial—showing step by step how to extend the template and build a working agent for a real use case using LangGraph, <code translate="no">langgraph-up-react</code>, and Milvus vector database. Stay tuned.</p>
