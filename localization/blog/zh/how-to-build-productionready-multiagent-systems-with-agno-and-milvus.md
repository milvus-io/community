---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >
  Learn how to build, deploy, and scale production-ready multi-agent systems
  using Agno, AgentOS, and Milvus for real-world workloads.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>If you’ve been building AI agents, you’ve probably hit this wall: your demo works great, but getting it into production is a whole different story.</p>
<p>We’ve covered agent memory management and reranking in earlier posts. Now let’s tackle the bigger challenge—building agents that actually hold up in production.</p>
<p>Here’s the reality: production environments are messy. A single agent rarely cuts it, which is why multi-agent systems are everywhere. But the frameworks available today tend to fall into two camps: lightweight ones that demo well but break under real load, or powerful ones that take forever to learn and build with.</p>
<p>I’ve been experimenting with <a href="https://github.com/agno-agi/agno">Agno</a> recently, and it seems to strike a reasonable middle ground—focused on production readiness without excessive complexity. The project has gained over 37,000 GitHub stars in a few months, suggesting other developers find it useful as well.</p>
<p>In this post, I’ll share what I learned while building a multi-agent system using Agno with <a href="https://milvus.io/">Milvus</a> as the memory layer. We’ll look at how Agno compares to alternatives such as LangGraph and walk through a complete implementation you can try yourself.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">What Is Agno?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> is a multi-agent framework built specifically for production use. It has two distinct layers:</p>
<ul>
<li><p><strong>Agno framework layer</strong>: Where you define your agent logic</p></li>
<li><p><strong>AgentOS runtime layer</strong>: Turns that logic into HTTP services you can actually deploy</p></li>
</ul>
<p>Think of it this way: the framework layer defines <em>what</em> your agents should do, while AgentOS handles <em>how</em> that work gets executed and served.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">The Framework Layer</h3><p>This is what you work with directly. It introduces three core concepts:</p>
<ul>
<li><p><strong>Agent</strong>: Handles a specific type of task</p></li>
<li><p><strong>Team</strong>: Coordinates multiple agents to solve complex problems</p></li>
<li><p><strong>Workflow</strong>: Defines execution order and structure</p></li>
</ul>
<p>One thing I appreciated: you don’t need to learn a new DSL or draw flowcharts. Agent behavior is defined using standard Python function calls. The framework handles LLM invocation, tool execution, and memory management.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">The AgentOS Runtime Layer</h3><p>AgentOS is designed for high request volumes through async execution, and its stateless architecture makes scaling straightforward.</p>
<p>Key features include:</p>
<ul>
<li><p>Built-in FastAPI integration for exposing agents as HTTP endpoints</p></li>
<li><p>Session management and streaming responses</p></li>
<li><p>Monitoring endpoints</p></li>
<li><p>Horizontal scaling support</p></li>
</ul>
<p>In practice, AgentOS handles most of the infrastructure work, which lets you focus on the agent logic itself.</p>
<p>A high-level view of Agno’s architecture is shown below.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno vs. LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>To understand where Agno fits, let’s compare it with LangGraph—one of the most widely used multi-agent frameworks.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a> uses a graph-based state machine. You model your entire agent workflow as a graph: steps are nodes, execution paths are edges. This works well when your process is fixed and strictly ordered. But for open-ended or conversational scenarios, it can feel restrictive. As interactions get more dynamic, maintaining a clean graph gets harder.</p>
<p><strong>Agno</strong> takes a different approach. Instead of being a pure orchestration layer, it’s an end-to-end system. Define your agent behavior, and AgentOS automatically exposes it as a production-ready HTTP service—with monitoring, scalability, and multi-turn conversation support built in. No separate API gateway, no custom session management, no extra operational tooling.</p>
<p>Here’s a quick comparison:</p>
<table>
<thead>
<tr><th>Dimension</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>Orchestration model</td><td>Explicit graph definition using nodes and edges</td><td>Declarative workflows defined in Python</td></tr>
<tr><td>State management</td><td>Custom state classes defined and managed by developers</td><td>Built-in memory system</td></tr>
<tr><td>Debugging &amp; observability</td><td>LangSmith (paid)</td><td>AgentOS UI (open source)</td></tr>
<tr><td>Runtime model</td><td>Integrated into an existing runtime</td><td>Standalone FastAPI-based service</td></tr>
<tr><td>Deployment complexity</td><td>Requires additional setup via LangServe</td><td>Works out of the box</td></tr>
</tbody>
</table>
<p>LangGraph gives you more flexibility and fine-grained control. Agno optimizes for faster time-to-production. The right choice depends on your project stage, existing infrastructure, and the level of customization you need. If you’re unsure, running a small proof of concept with both is probably the most reliable way to decide.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">Choosing Milvus for the Agent Memory Layer<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Once you’ve chosen a framework, the next decision is how to store memory and knowledge. We use Milvus for this. <a href="https://milvus.io/">Milvus</a> is the most popular open-source vector database built for AI workloads with more than <a href="https://github.com/milvus-io/milvus">42,000+ GitHub</a> stars.</p>
<p><strong>Agno has native Milvus support.</strong> The <code translate="no">agno.vectordb.milvus</code> module wraps production features like connection management, automatic retries, batch writes, and embedding generation. You don’t need to build connection pools or handle network failures yourself—a few lines of Python give you a working vector memory layer.</p>
<p><strong>Milvus scales with your needs.</strong> It supports three <a href="https://milvus.io/docs/install-overview.md">deployment modes:</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>: Lightweight, file-based—great for local development and testing</p></li>
<li><p><strong>Standalone</strong>: Single-server deployment for production workloads</p></li>
<li><p><strong>Distributed</strong>: Full cluster for high-scale scenarios</p></li>
</ul>
<p>You can start with Milvus Lite to validate your agent memory locally, then move to standalone or distributed as traffic grows—without changing your application code. This flexibility is especially useful when you’re iterating quickly in early stages but need a clear path to scale later.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">Step-by-Step: Building a Production-Ready Agno Agent with Milvus<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s build a production-ready agent from scratch.</p>
<p>We’ll start with a simple single-agent example to show the full workflow. Then we’ll expand it into a multi-agent system. AgentOS will automatically package everything as a callable HTTP service.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Deploying Milvus Standalone with Docker</h3><p><strong>(1) Download the Deployment Files</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Start the Milvus Service</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Core Implementation</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) Running the Agent</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. Connecting to the AgentOS Console</h3><p>https://os.agno.com/</p>
<p><strong>(1) Create an Account and Sign In</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Connect Your Agent to AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Configure the Exposed Port and Agent Name</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Add Documents and Index Them in Milvus</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) Test the Agent End to End</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In this setup, Milvus handles high-performance semantic retrieval. When the knowledge-base assistant receives a technical question, it invokes the <code translate="no">search_knowledge</code> tool to embed the query, retrieves the most relevant document chunks from Milvus, and uses those results as the basis for its response.</p>
<p>Milvus offers three deployment options, allowing you to choose an architecture that fits your operational requirements while keeping the application-level APIs consistent across all deployment modes.</p>
<p>The demo above shows the core retrieval and generation flow. To move this design into a production environment, however, several architectural aspects need to be discussed in more detail.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">How Retrieval Results Are Shared Across Agents<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno’s Team mode has a <code translate="no">share_member_interactions=True</code> option that allows later agents to inherit the full interaction history of earlier agents. In practice, this means that when the first agent retrieves information from Milvus, subsequent agents can reuse those results instead of running the same search again.</p>
<ul>
<li><p><strong>The upside:</strong> Retrieval costs are amortized across the team. One vector search supports multiple agents, reducing redundant queries.</p></li>
<li><p><strong>The downside:</strong> Retrieval quality gets amplified. If the initial search returns incomplete or inaccurate results, that error propagates to every agent that depends on it.</p></li>
</ul>
<p>This is why retrieval accuracy matters even more in multi-agent systems. A bad retrieval doesn’t just degrade one agent’s response—it affects the entire team.</p>
<p>Here’s an example Team setup:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">Why Agno and Milvus Are Layered Separately<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>In this architecture, <strong>Agno</strong> sits at the conversation and orchestration layer. It is responsible for managing dialogue flow, coordinating agents, and maintaining conversational state, with session history persisted in a relational database. The system’s actual domain knowledge—such as product documentation and technical reports—is handled separately and stored as vector embeddings in <strong>Milvus</strong>. This clear division keeps conversational logic and knowledge storage fully decoupled.</p>
<p>Why this matters operationally:</p>
<ul>
<li><p><strong>Independent scaling</strong>: As Agno demand grows, add more Agno instances. As query volume grows, expand Milvus by adding query nodes. Each layer scales in isolation.</p></li>
<li><p><strong>Different hardware needs</strong>: Agno is CPU- and memory-bound (LLM inference, workflow execution). Milvus is optimized for high-throughput vector retrieval (disk I/O, sometimes GPU acceleration). Separating them prevents resource contention.</p></li>
<li><p><strong>Cost optimization</strong>: You can tune and allocate resources for each layer independently.</p></li>
</ul>
<p>This layered approach gives you a more efficient, resilient, and production-ready architecture.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">What to Monitor When Using Agno with Milvus<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno has built-in evaluation capabilities, but adding Milvus expands what you should watch. Based on our experience, focus on three areas:</p>
<ul>
<li><p><strong>Retrieval quality</strong>: Are the documents Milvus returns actually relevant to the query, or just superficially similar at the vector level?</p></li>
<li><p><strong>Answer faithfulness</strong>: Is the final response grounded in the retrieved content, or is the LLM generating unsupported claims?</p></li>
<li><p><strong>End-to-end latency breakdown</strong>: Don’t just track total response time. Break it down by stage—embedding generation, vector search, context assembly, LLM inference—so you can identify where slowdowns occur.</p></li>
</ul>
<p><strong>A practical example:</strong> When your Milvus collection grows from 1 million to 10 million vectors, you might notice retrieval latency creeping up. That’s usually a signal to tune index parameters (like <code translate="no">nlist</code> and <code translate="no">nprobe</code>) or consider moving from standalone to a distributed deployment.</p>
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
    </button></h2><p>Building production-ready agent systems takes more than wiring together LLM calls and retrieval demos. You need clear architectural boundaries, infrastructure that scales independently, and observability to catch issues early.</p>
<p>In this post, I walked through how Agno and Milvus can work together: Agno for multi-agent orchestration, Milvus for scalable memory and semantic retrieval. By keeping these layers separate, you can move from prototype to production without rewriting core logic—and scale each component as needed.</p>
<p>If you’re experimenting with similar setups, I’d be curious to hear what’s working for you.</p>
<p><strong>Questions about Milvus?</strong> Join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack channel</a> or book a 20-minute <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> session.</p>
