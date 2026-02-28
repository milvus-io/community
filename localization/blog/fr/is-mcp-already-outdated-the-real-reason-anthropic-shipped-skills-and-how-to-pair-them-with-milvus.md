---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >
  Is MCP Already Outdated? The Real Reason Anthropic Shipped Skills—and How to
  Pair Them with Milvus
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_162fd27dc1.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  Learn how Skills works to reduce token consumption, and how Skills and MCP
  work together with Milvus to enhance AI workflows.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>Over the past few weeks, a surprisingly heated argument has erupted across X and Hacker News: <em>Do we actually need MCP servers anymore?</em> Some developers claim MCP is over-engineered, token-hungry, and fundamentally misaligned with how agents should use tools. Others defend MCP as the reliable way to expose real-world capabilities to language models. Depending on which thread you read, MCP is either the future of tool use—or dead on arrival.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The frustration is understandable. MCP gives you robust access to external systems, but it also forces the model to load long schemas, verbose descriptions, and sprawling tool lists. That adds real cost. If you download a meeting transcript and later feed it into another tool, the model may reprocess the same text multiple times, inflating token usage for no obvious benefit. For teams operating at scale, this isn’t an inconvenience—it’s a bill.</p>
<p>But declaring MCP obsolete is premature. Anthropic—the same team that invented MCP—quietly introduced something new: <a href="https://claude.com/blog/skills"><strong>Skills</strong></a>. Skills are lightweight Markdown/YAML definitions that describe <em>how</em> and <em>when</em> a tool should be used. Instead of dumping full schemas into the context window, the model first reads compact metadata and uses that to plan. In practice, Skills dramatically reduce token overhead and give developers more control over tool orchestration.</p>
<p>So, does this mean Skills will replace MCP? Not quite. Skills streamline planning, but MCP still provides the actual capabilities: reading files, calling APIs, interacting with storage systems, or plugging into external infrastructure like <a href="https://milvus.io/"><strong>Milvus</strong></a>, an open-source vector database that underpins fast semantic retrieval at scale, making it a critical backend when your Skills need real data access.</p>
<p>This post breaks down what Skills do well, where MCP still matters, and how both fit into Anthropic’s evolving agent architecture. Then we’ll walk through how to build your own Skills that integrate cleanly with Milvus.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">What Are Anthropic Agent Skills and How Do They Work<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>A long-standing pain point of traditional AI agents is that instructions get washed out as the conversation grows.</p>
<p>Even with the most carefully crafted system prompts, the model’s behavior can gradually drift over the course of the conversation. After several turns, Claude begins to forget or lose focus on the original instructions.</p>
<p>The problem lies in the structure of the system prompt. It is a one-time, static injection that competes for space in the model’s context window, alongside conversation history, documents, and any other inputs. As the context window fills, the model’s attention to the system prompt becomes increasingly diluted, leading to a loss of consistency over time.</p>
<p>Skills were designed to address this issue. Skills are folders containing instructions, scripts, and resources. Rather than relying on a static system prompt, Skills break down expertise into modular, reusable, and persistent instruction bundles that Claude can discover and load dynamically when needed for a task.</p>
<p>When Claude begins a task, it first performs a lightweight scan of all available Skills by reading only their YAML metadata (just a few dozen tokens). This metadata provides just enough information for Claude to determine if a Skill is relevant to the current task. If so, Claude expands into the full set of instructions (usually under 5k tokens), and additional resources or scripts are loaded only if necessary.</p>
<p>This progressive disclosure allows Claude to initialize a Skill with just 30–50 tokens, significantly improving efficiency and reducing unnecessary context overhead.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">How Skills Compares to Prompts, Projects, MCP, and Subagents<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>Today’s model tooling landscape can feel crowded. Even within Claude’s agentic ecosystem alone, there are several distinct components: Skills, prompts, Projects, subagents, and MCP.</p>
<p>Now that we understand what Skills are and how they work through modular instruction bundles and dynamic loading, we need to know how Skills relate to other parts of the Claude ecosystem, especially MCP. Here is a summary:</p>
<h3 id="1-Skills" class="common-anchor-header">1. Skills</h3><p>Skills are folders that contain instructions, scripts, and resources. Claude discovers and loads them dynamically using progressive disclosure: first metadata, then full instructions, and finally any required files.</p>
<p><strong>Best for:</strong></p>
<ul>
<li><p>Organizational workflows (brand guidelines, compliance procedures)</p></li>
<li><p>Domain expertise (Excel formulas, data analysis)</p></li>
<li><p>Personal preferences (note-taking systems, coding patterns)</p></li>
<li><p>Professional tasks that need to be reused across conversations (OWASP-based code security reviews)</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. Prompts</h3><p>Prompts are the natural-language instructions you give Claude within a conversation. They are temporary and exist only in the current conversation.</p>
<p><strong>Best for:</strong></p>
<ul>
<li><p>One-off requests (summarizing an article, formatting a list)</p></li>
<li><p>Conversational refinement (adjusting tone, adding details)</p></li>
<li><p>Immediate context (analyzing specific data, interpreting content)</p></li>
<li><p>Ad-hoc instructions</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. Projects</h3><p>Projects are self-contained workspaces with their own chat histories and knowledge bases. Each project offers a 200K context window. When your project knowledge approaches context limits, Claude transitions seamlessly into RAG mode, allowing up to a 10x expansion in effective capacity.</p>
<p><strong>Best for:</strong></p>
<ul>
<li><p>Persistent context (e.g., all conversations related to a product launch)</p></li>
<li><p>Workspace organization (separate contexts for different initiatives)</p></li>
<li><p>Team collaboration (on Team and Enterprise plans)</p></li>
<li><p>Custom instructions (project-specific tone or perspective)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. Subagents</h3><p>Subagents are specialized AI assistants with their own context windows, custom system prompts, and specific tool permissions. They can work independently and return results to the main agent.</p>
<p><strong>Best for:</strong></p>
<ul>
<li><p>Task specialization (code review, test generation, security audits)</p></li>
<li><p>Context management (keep the main conversation focused)</p></li>
<li><p>Parallel processing (multiple subagents working on different aspects simultaneously)</p></li>
<li><p>Tool restriction (e.g., read-only access)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. MCP (Model Context Protocol)</h3><p>The Model Context Protocol (MCP) is an open standard that connects AI models to external tools and data sources.</p>
<p><strong>Best for:</strong></p>
<ul>
<li><p>Accessing external data (Google Drive, Slack, GitHub, databases)</p></li>
<li><p>Using business tools (CRM systems, project management platforms)</p></li>
<li><p>Connecting to development environments (Local files, IDEs, version control)</p></li>
<li><p>Integrating with custom systems (proprietary tools and data sources)</p></li>
</ul>
<p>Based on the above, we can see that Skills and MCP address different challenges and work together to complement each other.</p>
<table>
<thead>
<tr><th><strong>Dimension</strong></th><th><strong>MCP</strong></th><th><strong>Skills</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Core Value</strong></td><td>Connects to external systems (databases, APIs, SaaS platforms)</td><td>Defines behavior specifications (how to process and present data)</td></tr>
<tr><td><strong>Questions Answered</strong></td><td>“What can Claude access?”</td><td>“What should Claude do?”</td></tr>
<tr><td><strong>Implementation</strong></td><td>Client-server protocol + JSON Schema</td><td>Markdown file + YAML metadata</td></tr>
<tr><td><strong>Context Consumption</strong></td><td>Tens of thousands of tokens (multiple server accumulations)</td><td>30-50 tokens per operation</td></tr>
<tr><td><strong>Use Cases</strong></td><td>Querying large databases, calling GitHub APIs</td><td>Defining search strategies, applying filtering rules, output formatting</td></tr>
</tbody>
</table>
<p>Let’s take code search as an example.</p>
<ul>
<li><p><strong>MCP (e.g., claude-context):</strong> Provides the ability to access the Milvus vector database.</p></li>
<li><p><strong>Skills:</strong> Defines the workflow, such as prioritizing the most recently modified code, sorting results by relevance, and presenting the data in a Markdown table.</p></li>
</ul>
<p>MCP provides the capability, while Skills define the process. Together, they form a complementary pair.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">How to Build Custom Skills with Claude-Context and Milvus<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a> is an MCP plugin that adds semantic code search functionality to Claude Code, turning the entire codebase into Claude’s context.</p>
<h3 id="Prerequisite" class="common-anchor-header">Prerequisite</h3><p>System Requirements:</p>
<ul>
<li><p><strong>Node.js</strong>: Version &gt;= 20.0.0 and &lt; 24.0.0</p></li>
<li><p><strong>OpenAI API Key</strong> (for embedding models)</p></li>
<li><p><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> <strong>API Key</strong> (managed Milvus service)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">Step 1: Configure the MCP Service (claude-context)</h3><p>Run the following command in the terminal:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Check the Configuration:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The MCP setup is complete. Claude can now access the Milvus vector database.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">Step 2: Create the Skill</h3><p>Create the Skills directory:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>Create the SKILL.md file:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">Step 3: Restart Claude to Apply Skills</h3><p>Run the following command to restart Claude:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Note:</strong> After the configuration is complete, you can immediately use the Skills to query the Milvus codebase.</p>
<p>Below is an example of how it works.</p>
<p>Query: How does Milvus QueryCoord work?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>At its core, Skills act as a mechanism for encapsulating and transferring specialized knowledge. By using Skills, AI can inherit a team’s experience and follow industry best practices—whether that’s a checklist for code reviews or documentation standards. When this tacit knowledge is made explicit through Markdown files, the quality of AI-generated outputs can see a significant improvement.</p>
<p>Looking ahead, the ability to leverage Skills effectively could become a key differentiator in how teams and individuals use AI to their advantage.</p>
<p>As you explore the potential of AI in your organization, Milvus stands as a critical tool for managing and searching large-scale vector data. By pairing Milvus’ powerful vector database with AI tools like Skills, you can improve not only your workflows but also the depth and speed of your data-driven insights.</p>
<p>Have questions or want a deep dive on any feature? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> to chat with our engineers and other AI engineers in the community. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
