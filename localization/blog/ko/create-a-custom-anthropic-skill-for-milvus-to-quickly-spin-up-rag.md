---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >
  How Anthropic Skills Change Agent Tooling — and How to Build a Custom Skill
  for Milvus to Quickly Spin Up RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >
  Learn what Skills are and how to create a custom Skill in Claude Code that
  builds Milvus-backed RAG systems from natural-language instructions using a
  reusable workflow.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>Tool usage is a big part of making an agent work. The agent needs to choose the right tool, decide when to call it, and format the inputs correctly. On paper that sounds straightforward, but once you start building real systems, you find a lot of edge cases and failure modes.</p>
<p>Many teams use MCP-style tool definitions to organize this, but MCP has some rough edges. The model has to reason over all tools at once, and there isn’t much structure to guide its decisions. On top of that, every tool definition has to live in the context window. Some of these are large — the GitHub MCP is around 26k tokens — which eats context before the agent even starts doing real work.</p>
<p>Anthropic introduced <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>Skills</strong></a> to improve this situation. Skills are smaller, more focused, and easier to load on demand. Instead of dumping everything into context, you package domain logic, workflows, or scripts into compact units that the agent can pull in only when needed.</p>
<p>In this post, I’ll go over how Anthropic Skills work and then walk through building a simple Skill in Claude Code that turns natural language into a <a href="https://milvus.io/">Milvus</a>-backed knowledge base — a quick setup for RAG without extra wiring.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">What Are Anthropic Skills?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">Anthropic Skills</a> (or Agent Skills) are just folders that bundle the instructions, scripts, and reference files an agent needs to handle a specific task. Think of them as small, self-contained capability packs. A Skill might define how to generate a report, run an analysis, or follow a particular workflow or set of rules.</p>
<p>The key idea is that Skills are modular and can be loaded on demand. Instead of stuffing huge tool definitions into the context window, the agent pulls in only the Skill it needs. This keeps context usage low while giving the model clear guidance on what tools exist, when to call them, and how to execute each step.</p>
<p>The format is intentionally simple, and because of that, it’s already supported or easily adapted across a bunch of developer tools — Claude Code, Cursor, VS Code extensions, GitHub integrations, Codex-style setups, and so on.</p>
<p>A Skill follows a consistent folder structure:</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(Core File)</strong></p>
<p>This is the execution guide for the agent—the document that tells the agent exactly how the task should be carried out. It defines the Skill’s metadata (such as name, description, and trigger keywords), the execution flow, and default settings. In this file, you should clearly describe:</p>
<ul>
<li><p><strong>When the Skill should run:</strong> For example, trigger the Skill when the user input includes a phrase like “process CSV files with Python.”</p></li>
<li><p><strong>How the task should be performed:</strong> Lay out the execution steps in order, such as: interpret the user’s request → call preprocessing scripts from the <code translate="no">scripts/</code> directory → generate the required code → format the output using templates from <code translate="no">templates/</code>.</p></li>
<li><p><strong>Rules and constraints:</strong> Specify details such as coding conventions, output formats, and how errors should be handled.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(Execution Scripts)</strong></p>
<p>This directory contains prewritten scripts in languages such as Python, Shell, or Node.js. The agent can call these scripts directly, instead of generating the same code repeatedly at runtime. Typical examples include <code translate="no">create_collection.py</code> and <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(Document Templates)</strong></p>
<p>Reusable template files that the agent can use to generate customized content. Common examples include report templates or configuration templates.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(Reference Materials)</strong></p>
<p>Reference documents the agent can consult during execution, such as API documentation, technical specifications, or best-practice guides.</p>
<p>Overall, this structure mirrors how work is handed off to a new teammate: <code translate="no">SKILL.md</code> explains the job, <code translate="no">scripts/</code> provide ready-to-use tools, <code translate="no">templates/</code> define standard formats, and <code translate="no">resources/</code> supply background information. With all of this in place, the agent can execute the task reliably and with minimal guesswork.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Hands-on Tutorial: Creating a Custom Skill for a Milvus-Powered RAG System<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>In this section, we’ll walk through building a custom Skill that can set up a Milvus collection and assemble a full RAG pipeline from plain natural-language instructions. The goal is to skip all the usual setup work — no manual schema design, no index configuration, no boilerplate code. You tell the agent what you want, and the Skill handles the Milvus pieces for you.</p>
<h3 id="Design-Overview" class="common-anchor-header">Design Overview</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisites</h3><table>
<thead>
<tr><th>Component</th><th>Requirement</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>Models</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>Container</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>Model Configuration Platform</td><td>CC-Switch</td></tr>
<tr><td>Package Manager</td><td>npm</td></tr>
<tr><td>Development Language</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Step 1: Environment Setup</h3><p><strong>Install</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>Install CC-Switch</strong></p>
<p><strong>Note:</strong> CC-Switch is a model-switching tool that makes it easy to switch between different model APIs when running AI models locally.</p>
<p>Project repository: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>Select Claude and Add an API Key</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Check the Current Status</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Deploy and Start Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Configure the OpenAI API Key</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">Step 2: Create the Custom Skill for Milvus</h3><p><strong>Create the Directory Structure</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>Initialize</strong> <code translate="no">SKILL.md</code></p>
<p><strong>Note:</strong> SKILL.md serves as the agent’s execution guide. It defines what the Skill does and how it should be triggered.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>Write the Core Scripts</strong></p>
<table>
<thead>
<tr><th>Script Type</th><th>File Name</th><th>Purpose</th></tr>
</thead>
<tbody>
<tr><td>Environment check</td><td><code translate="no">check_env.py</code></td><td>Checks the Python version, required dependencies, and the Milvus connection</td></tr>
<tr><td>Intent parsing</td><td><code translate="no">intent_parser.py</code></td><td>Converts requests like “build a RAG database” into a structured intent such as <code translate="no">scene=rag</code></td></tr>
<tr><td>Collection creation</td><td><code translate="no">milvus_builder.py</code></td><td>The core builder that generates the collection schema and index configuration</td></tr>
<tr><td>Data ingestion</td><td><code translate="no">insert_milvus_data.py</code></td><td>Loads documents, chunks them, generates embeddings, and writes data into Milvus</td></tr>
<tr><td>Example 1</td><td><code translate="no">basic_text_search.py</code></td><td>Demonstrates how to create a document search system</td></tr>
<tr><td>Example 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>Demonstrates how to build a complete RAG knowledge base</td></tr>
</tbody>
</table>
<p>These scripts show how to turn a Milvus-focused Skill into something practical: a working document search system and an intelligent Q&amp;A (RAG) setup.</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">Step 3: Enable the Skill and Run a Test</h3><p><strong>Describe the Request in Natural Language</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>RAG System Created</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Insert Sample Data</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Run a Query</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>In this tutorial, we walked through building a Milvus-powered RAG system using a custom Skill. The goal wasn’t just to show another way to call Milvus—it was to show how Skills can turn what is normally a multi-step, configuration-heavy setup into something you can reuse and iterate on. Instead of manually defining schemas, tuning indexes, or stitching together workflow code, the Skill handles most of the boilerplate so you can focus on the parts of RAG that actually matter.</p>
<p>This is only the start. A full RAG pipeline has plenty of moving pieces: preprocessing, chunking, hybrid search settings, reranking, evaluation, and more. All of these can be packaged as separate Skills and composed depending on your use case. If your team has internal standards for vector dimensions, index params, prompt templates, or retrieval logic, Skills are a clean way to encode that knowledge and make it repeatable.</p>
<p>For new developers, this lowers the entry barrier—no need to learn every detail of Milvus before getting something running. For experienced teams, it cuts down on repeated setup and helps keep projects consistent across environments. Skills won’t replace thoughtful system design, but they remove a lot of unnecessary friction.</p>
<p>👉 The full implementation is available in the <a href="https://github.com/yinmin2020/open-milvus-skills">open-source repository</a>, and you can explore more community-built examples in the <a href="https://skillsmp.com/">Skill marketplace</a>.</p>
<h2 id="Stay-tuned" class="common-anchor-header">Stay tuned!<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>We’re also working on introducing official Milvus and Zilliz Cloud Skills that cover common RAG patterns and production best practices. If you have ideas or specific workflows you want supported, join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channel</a> and chat with our engineers. And if you want guidance for your own setup, you can always book a <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> session.</p>
