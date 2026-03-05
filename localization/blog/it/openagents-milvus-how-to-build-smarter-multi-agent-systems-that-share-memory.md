---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >
  OpenAgents x Milvus: How to Build Smarter Multi-Agent Systems That Share
  Memory
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  Explore how OpenAgents enables distributed multi-agent collaboration, why
  Milvus is essential for adding scalable memory, and how to build a full
  system.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>Most developers start their agentic systems with a single agent and only later realize they’ve basically built a very expensive chatbot. For simple tasks, a ReAct-style agent works fine, but it quickly hits limits: it can’t run steps in parallel, it loses track of long reasoning chains, and it tends to fall apart once you add too many tools to the mix. Multi-agent setups promise to fix this, but they bring their own problems: coordination overhead, brittle handoffs, and a ballooning shared context that quietly erodes model quality.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a> is an open-source framework for building multi-agent systems in which AI agents work together, share resources, and tackle long-horizon projects within persistent communities. Instead of a single central orchestrator, OpenAgents lets agents collaborate in a more distributed way: they can discover each other, communicate, and coordinate around shared goals.</p>
<p>Paired with the <a href="https://milvus.io/">Milvus</a> vector database, this pipeline gains a scalable, high-performance long-term memory layer. Milvus powers agent memory with fast semantic search, flexible indexing choices like HNSW and IVF, and clean isolation through partitioning, so agents can store, retrieve, and reuse knowledge without drowning in context or stepping on each other’s data.</p>
<p>In this post, we’ll walk through how OpenAgents enables distributed multi-agent collaboration, why Milvus is a critical foundation for scalable agent memory, and how to assemble such a system step by step.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">Challenges in Building Real-World Agent Systems<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Many mainstream agent frameworks today—LangChain, AutoGen, CrewAI, and others—are built around a <strong>task-centric</strong> model. You spin up a set of agents, give them a job, maybe define a workflow, and let them run. This works well for narrow or short-lived use cases, but in real production environments, it exposes three structural limitations:</p>
<ul>
<li><p><strong>Knowledge remains siloed.</strong> An agent’s experience is confined to its own deployment. A code-review agent in engineering doesn’t share what it learns with a product-team agent evaluating feasibility. Every team ends up rebuilding knowledge from scratch, which is both inefficient and brittle.</p></li>
<li><p><strong>Collaboration is rigid.</strong> Even in multi-agent frameworks, cooperation usually depends on workflows defined in advance. When collaboration needs to shift, these static rules cannot adapt, making the entire system less flexible.</p></li>
<li><p><strong>A lack of a persistent state.</strong> Most agents follow a simple lifecycle: <em>start → execute → shut down.</em> They forget everything between runs—context, relationships, decisions made, and interaction history. Without a persistent state, agents cannot build long-term memory or evolve their behavior.</p></li>
</ul>
<p>These structural issues come from treating agents as isolated task executors rather than participants in a broader collaborative network.</p>
<p>The OpenAgents team believes that future agent systems need more than stronger reasoning—they need a mechanism that enables agents to discover one another, build relationships, share knowledge, and work together dynamically. And critically, this should not depend on a single central controller. The internet works because it’s distributed—no single node dictates everything, and the system becomes more robust and scalable as it grows. Multi-agent systems benefit from the same design principle. That’s why OpenAgents removes the idea of an all-powerful orchestrator and instead enables decentralized, network-driven cooperation.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">What’s OpenAgents?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents is an open-source framework for building AI agent networks that enables open collaboration, where AI agents work together, share resources, and tackle long-horizon projects. It provides the infrastructure for an internet of agents — where agents collaborate openly with millions of other agents in persistent, growing communities. At the technical level, the system is structured around three core components: <strong>Agent Network, Network Mods, and Transports.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. Agent Network: A Shared Environment for Collaboration</h3><p>An agent network is a shared environment where multiple agents can connect, communicate, and work together to solve complex tasks. Its core characteristics include:</p>
<ul>
<li><p><strong>Persistent operation:</strong> Once created, the Network stays online independently of any single task or workflow.</p></li>
<li><p><strong>Dynamic agent:</strong> Agents can join at any time using a Network ID; no pre-registration required.</p></li>
<li><p><strong>Multi-protocol support:</strong> A unified abstraction layer supports communication over WebSocket, gRPC, HTTP, and libp2p.</p></li>
<li><p><strong>Autonomous configuration:</strong> Each Network maintains its own permissions, governance, and resources.</p></li>
</ul>
<p>With just one line of code, you can spin up a Network, and any agent can join immediately through standard interfaces.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. Network Mods: Pluggable Extensions for Collaboration</h3><p>Mods provide a modular layer of collaboration features that stay decoupled from the core system. You can mix and match Mods based on your specific needs, enabling collaboration patterns tailored to each use case.</p>
<table>
<thead>
<tr><th><strong>Mod</strong></th><th><strong>Purpose</strong></th><th><strong>Use cases</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Workspace Messaging</strong></td><td>Real-time message communication</td><td>Streaming responses, instant feedback</td></tr>
<tr><td><strong>Forum</strong></td><td>Asynchronous discussion</td><td>Proposal reviews, multi-round deliberation</td></tr>
<tr><td><strong>Wiki</strong></td><td>Shared knowledge base</td><td>Knowledge consolidation, document collaboration</td></tr>
<tr><td><strong>Social</strong></td><td>Relationship graph</td><td>Expert routing, trust networks</td></tr>
</tbody>
</table>
<p>All Mods operate on a unified event system, making it easy to extend the framework or introduce custom behaviors whenever required.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. Transports: A Protocol-Agnostic Channel for Communication</h3><p>Transports are the communication protocols that allow heterogeneous agents to connect and exchange messages within an OpenAgents network. OpenAgents supports multiple transport protocols that can run simultaneously inside the same network, including:</p>
<ul>
<li><p><strong>HTTP/REST</strong> for broad, cross-language integration</p></li>
<li><p><strong>WebSocket</strong> for low-latency, bidirectional communication</p></li>
<li><p><strong>gRPC</strong> for high-performance RPC suited to large-scale clusters</p></li>
<li><p><strong>libp2p</strong> for decentralized, peer-to-peer networking</p></li>
<li><p><strong>A2A</strong>, an emerging protocol designed specifically for agent-to-agent communication</p></li>
</ul>
<p>All transports operate through a unified event-based message format, enabling seamless translation between protocols. You don’t need to worry about which protocol a peer agent uses—the framework handles it automatically. Agents built in any language or framework can join an OpenAgents network without rewriting existing code.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">Integrating OpenAgents with Milvus for Long-Term Agentic Memory<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents solves the challenge of how agents <strong>communicate, discover each other, and collaborate</strong>—but collaboration alone isn’t enough. Agents generate insights, decisions, conversation history, tool results, and domain-specific knowledge. Without a persistent memory layer, all of that evaporates the moment an agent shuts down.</p>
<p>This is where <strong>Milvus</strong> becomes essential. Milvus provides the high-performance vector storage and semantic retrieval needed to turn agent interactions into durable, reusable memory. When integrated into the OpenAgents network, it offers three major advantages:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. Semantic Search</strong></h4><p>Milvus delivers fast semantic search using indexing algorithms like HNSW and IVF_FLAT. Agents can retrieve the most relevant historical records based on meaning rather than keywords, enabling them to:</p>
<ul>
<li><p>recall prior decisions or plans,</p></li>
<li><p>avoid repeating work,</p></li>
<li><p>maintain long-horizon context across sessions.</p></li>
</ul>
<p>This is the backbone of <em>agentic memory</em>: fast, relevant, contextual retrieval.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. Billion-Scale Horizontal Scalability</strong></h4><p>Real agent networks generate massive amounts of data. Milvus is built to operate comfortably at this scale, offering:</p>
<ul>
<li><p>storage and search over billions of vectors,</p></li>
<li><p>&lt; 30 ms latency even under high-throughput Top-K retrieval,</p></li>
<li><p>a fully distributed architecture that scales linearly as demand grows.</p></li>
</ul>
<p>Whether you have a dozen agents or thousands working in parallel, Milvus keeps retrieval fast and consistent.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. Multi-Tenant Isolation</strong></h4><p>Milvus provides granular multi-tenant isolation through <strong>Partition Key</strong>, a lightweight partitioning mechanism that segments memory inside a single collection. This allows:</p>
<ul>
<li><p>different teams, projects, or agent communities to maintain independent memory spaces,</p></li>
<li><p>dramatically lower overhead compared to maintaining multiple collections,</p></li>
<li><p>optional cross-partition retrieval when shared knowledge is needed.</p></li>
</ul>
<p>This isolation is crucial for large multi-agent deployments where data boundaries must be respected without compromising retrieval speed.</p>
<p>OpenAgents connects to Milvus through <strong>custom Mods</strong> that call Milvus APIs directly. Agent messages, tool outputs, and interaction logs are automatically embedded into vectors and stored in Milvus. Developers can customize:</p>
<ul>
<li><p>the embedding model,</p></li>
<li><p>storage schema and metadata,</p></li>
<li><p>and retrieval strategies (e.g., hybrid search, partitioned search).</p></li>
</ul>
<p>This gives each agent community a memory layer that is scalable, persistent, and optimized for semantic reasoning.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">How to Build a Multi-Agent Chatbot with OpenAgent and Milvus<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>To make things concrete, let’s walk through a demo: building a <strong>developer-support community</strong> where multiple specialist agents—Python experts, database experts, DevOps engineers, and more—collaborate to answer technical questions. Instead of relying on a single overworked generalist agent, each expert contributes domain-specific reasoning, and the system routes queries to the best-suited agent automatically.</p>
<p>This example demonstrates how to integrate <strong>Milvus</strong> into an OpenAgents deployment to provide long-term memory for technical Q&amp;A. Agent conversations, past solutions, troubleshooting logs, and user queries are all converted into vector embeddings and stored in Milvus, giving the network the ability to:</p>
<ul>
<li><p>remember previous answers,</p></li>
<li><p>reuse prior technical explanations,</p></li>
<li><p>maintain consistency across sessions, and</p></li>
<li><p>improve over time as more interactions accumulate.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">Prerequisite</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. Define Dependencies</h3><p>Define the Python packages required for the project:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. Environment Variables</h3><p>Here is the template for your environment configuration:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. Configure Your OpenAgents Network</h3><p>Define the structure of your agent network and its communication settings:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. Implement Multi-Agent Collaboration</h3><p>The following shows core code snippets (not the full implementation).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. Create and Activate a Virtual Environment</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>Install Dependencies</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>Configure API Keys</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Start the OpenAgents Network</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Start the Multi-Agent Service</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Start OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Access Studio</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Check the status of your agents and network:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>OpenAgents provides the coordination layer that lets agents discover each other, communicate, and collaborate, while Milvus solves the equally critical problem of how knowledge is stored, shared, and reused. By delivering a high-performance vector memory layer, Milvus enables agents to build persistent context, recall past interactions, and accumulate expertise over time. Together, they push AI systems beyond the limits of isolated models and toward the deeper collaborative potential of a true multi-agent network.</p>
<p>Of course, no multi-agent architecture is without trade-offs. Running agents in parallel can increase token consumption, errors may cascade across agents, and simultaneous decision-making can lead to occasional conflicts. These are active areas of research and ongoing improvement—but they don’t diminish the value of building systems that can coordinate, remember, and evolve.</p>
<p>🚀 Ready to give your agents long-term memory?</p>
<p>Explore <a href="https://milvus.io/">Milvus</a> and try integrating it with your own workflow.</p>
<p>Have questions or want a deep dive on any feature? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
