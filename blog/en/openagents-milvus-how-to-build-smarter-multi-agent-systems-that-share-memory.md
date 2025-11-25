---
id: openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >
 OpenAgents x Milvus: How to Build Smarter Multi-Agent Systems That Share Memory
author: Min Yin
date: 2025-11-24
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: Explore how OpenAgents enables distributed multi-agent collaboration, why Milvus is essential for adding scalable memory, and how to build a full system.
origin: https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---

Most developers start their agentic systems with a single agent and only later realize they’ve basically built a very expensive chatbot. For simple tasks, a ReAct-style agent works fine, but it quickly hits limits: it can’t run steps in parallel, it loses track of long reasoning chains, and it tends to fall apart once you add too many tools to the mix. Multi-agent setups promise to fix this, but they bring their own problems: coordination overhead, brittle handoffs, and a ballooning shared context that quietly erodes model quality.

[OpenAgents](https://github.com/OpenAgentsInc) is an open-source framework for building multi-agent systems in which AI agents work together, share resources, and tackle long-horizon projects within persistent communities. Instead of a single central orchestrator, OpenAgents lets agents collaborate in a more distributed way: they can discover each other, communicate, and coordinate around shared goals.

Paired with the [Milvus](https://milvus.io/) vector database, this pipeline gains a scalable, high-performance long-term memory layer. Milvus powers agent memory with fast semantic search, flexible indexing choices like HNSW and IVF, and clean isolation through partitioning, so agents can store, retrieve, and reuse knowledge without drowning in context or stepping on each other’s data.

In this post, we’ll walk through how OpenAgents enables distributed multi-agent collaboration, why Milvus is a critical foundation for scalable agent memory, and how to assemble such a system step by step.


## Challenges in Building Real-World Agent Systems

Many mainstream agent frameworks today—LangChain, AutoGen, CrewAI, and others—are built around a **task-centric** model. You spin up a set of agents, give them a job, maybe define a workflow, and let them run. This works well for narrow or short-lived use cases, but in real production environments, it exposes three structural limitations:

- **Knowledge remains siloed.** An agent’s experience is confined to its own deployment. A code-review agent in engineering doesn’t share what it learns with a product-team agent evaluating feasibility. Every team ends up rebuilding knowledge from scratch, which is both inefficient and brittle. 

- **Collaboration is rigid.** Even in multi-agent frameworks, cooperation usually depends on workflows defined in advance. When collaboration needs to shift, these static rules cannot adapt, making the entire system less flexible.

- **A lack of a persistent state.** Most agents follow a simple lifecycle: _start → execute → shut down._ They forget everything between runs—context, relationships, decisions made, and interaction history. Without a persistent state, agents cannot build long-term memory or evolve their behavior.

These structural issues come from treating agents as isolated task executors rather than participants in a broader collaborative network. 

The OpenAgents team believes that future agent systems need more than stronger reasoning—they need a mechanism that enables agents to discover one another, build relationships, share knowledge, and work together dynamically. And critically, this should not depend on a single central controller. The internet works because it’s distributed—no single node dictates everything, and the system becomes more robust and scalable as it grows. Multi-agent systems benefit from the same design principle. That’s why OpenAgents removes the idea of an all-powerful orchestrator and instead enables decentralized, network-driven cooperation.


## What’s OpenAgents? 

OpenAgents is an open-source framework for building AI agent networks that enables open collaboration, where AI agents work together, share resources, and tackle long-horizon projects. It provides the infrastructure for an internet of agents — where agents collaborate openly with millions of other agents in persistent, growing communities. At the technical level, the system is structured around three core components: **Agent Network, Network Mods, and Transports.**


### 1. Agent Network: A Shared Environment for Collaboration

An agent network is a shared environment where multiple agents can connect, communicate, and work together to solve complex tasks. Its core characteristics include:

- **Persistent operation:** Once created, the Network stays online independently of any single task or workflow.

- **Dynamic agent:** Agents can join at any time using a Network ID; no pre-registration required.

- **Multi-protocol support:** A unified abstraction layer supports communication over WebSocket, gRPC, HTTP, and libp2p.

- **Autonomous configuration:** Each Network maintains its own permissions, governance, and resources.

With just one line of code, you can spin up a Network, and any agent can join immediately through standard interfaces.


### 2. Network Mods: Pluggable Extensions for Collaboration

Mods provide a modular layer of collaboration features that stay decoupled from the core system. You can mix and match Mods based on your specific needs, enabling collaboration patterns tailored to each use case.


| **Mod**                 | **Purpose**                     | **Use cases**                                   |
| ----------------------- | ------------------------------- | ----------------------------------------------- |
| **Workspace Messaging** | Real-time message communication | Streaming responses, instant feedback           |
| **Forum**               | Asynchronous discussion         | Proposal reviews, multi-round deliberation      |
| **Wiki**                | Shared knowledge base           | Knowledge consolidation, document collaboration |
| **Social**              | Relationship graph              | Expert routing, trust networks                  |

All Mods operate on a unified event system, making it easy to extend the framework or introduce custom behaviors whenever required.


### 3. Transports: A Protocol-Agnostic Channel for Communication

Transports are the communication protocols that allow heterogeneous agents to connect and exchange messages within an OpenAgents network. OpenAgents supports multiple transport protocols that can run simultaneously inside the same network, including:

- **HTTP/REST** for broad, cross-language integration

- **WebSocket** for low-latency, bidirectional communication

- **gRPC** for high-performance RPC suited to large-scale clusters

- **libp2p** for decentralized, peer-to-peer networking

- **A2A**, an emerging protocol designed specifically for agent-to-agent communication

All transports operate through a unified event-based message format, enabling seamless translation between protocols. You don’t need to worry about which protocol a peer agent uses—the framework handles it automatically. Agents built in any language or framework can join an OpenAgents network without rewriting existing code.

## Integrating OpenAgents with Milvus for Long-Term Agentic Memory

OpenAgents solves the challenge of how agents **communicate, discover each other, and collaborate**—but collaboration alone isn’t enough. Agents generate insights, decisions, conversation history, tool results, and domain-specific knowledge. Without a persistent memory layer, all of that evaporates the moment an agent shuts down.

This is where **Milvus** becomes essential. Milvus provides the high-performance vector storage and semantic retrieval needed to turn agent interactions into durable, reusable memory. When integrated into the OpenAgents network, it offers three major advantages:


#### **1. Semantic Search**

Milvus delivers fast semantic search using indexing algorithms like HNSW and IVF_FLAT. Agents can retrieve the most relevant historical records based on meaning rather than keywords, enabling them to:

- recall prior decisions or plans,

- avoid repeating work,

- maintain long-horizon context across sessions.

This is the backbone of _agentic memory_: fast, relevant, contextual retrieval.


#### **2. Billion-Scale Horizontal Scalability**

Real agent networks generate massive amounts of data. Milvus is built to operate comfortably at this scale, offering:

- storage and search over billions of vectors,

- < 30 ms latency even under high-throughput Top-K retrieval,

- a fully distributed architecture that scales linearly as demand grows.

Whether you have a dozen agents or thousands working in parallel, Milvus keeps retrieval fast and consistent.


#### **3. Multi-Tenant Isolation**

Milvus provides granular multi-tenant isolation through **Partition Key**, a lightweight partitioning mechanism that segments memory inside a single collection. This allows:

- different teams, projects, or agent communities to maintain independent memory spaces,

- dramatically lower overhead compared to maintaining multiple collections,

- optional cross-partition retrieval when shared knowledge is needed.

This isolation is crucial for large multi-agent deployments where data boundaries must be respected without compromising retrieval speed.

OpenAgents connects to Milvus through **custom Mods** that call Milvus APIs directly. Agent messages, tool outputs, and interaction logs are automatically embedded into vectors and stored in Milvus. Developers can customize:

- the embedding model,

- storage schema and metadata,

- and retrieval strategies (e.g., hybrid search, partitioned search).

This gives each agent community a memory layer that is scalable, persistent, and optimized for semantic reasoning.

## How to Build a Multi-Agent Chatbot with OpenAgent and Milvus

To make things concrete, let’s walk through a demo: building a **developer-support community** where multiple specialist agents—Python experts, database experts, DevOps engineers, and more—collaborate to answer technical questions. Instead of relying on a single overworked generalist agent, each expert contributes domain-specific reasoning, and the system routes queries to the best-suited agent automatically.

This example demonstrates how to integrate **Milvus** into an OpenAgents deployment to provide long-term memory for technical Q&A. Agent conversations, past solutions, troubleshooting logs, and user queries are all converted into vector embeddings and stored in Milvus, giving the network the ability to:

- remember previous answers,

- reuse prior technical explanations,

- maintain consistency across sessions, and

- improve over time as more interactions accumulate.


### Prerequisite

- python3.11+

- conda

- Openai-key


### 1. Define Dependencies

Define the Python packages required for the project:

```
# Core framework
openagents>=0.6.11
# Vector database
pymilvus>=2.5.1
# Embedding model
sentence-transformers>=2.2.0
# LLM integration
openai>=1.0.0
# Environment config
python-dotenv>=1.0.0
```

### 2. Environment Variables

Here is the template for your environment configuration:

```
# LLM configuration (required)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
# Milvus configuration
MILVUS_URI=./multi_agent_memory.db
# Embedding model configuration
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
# Network configuration
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
```

### 3. Configure Your OpenAgents Network

Define the structure of your agent network and its communication settings:

```
# Network transport protocol (HTTP on port 8700)
# Multi-channel messaging system (general, coordination, expert channels)
# Agent role definitions (coordinator, python_expert, etc.)
# Milvus integration settings
network:
  name: "Multi-Agent Collaboration Demo"
  transports:
    - type: "http"
      config:
        port: 8700
        host: "localhost"
  mods:
    - name: "openagents.mods.workspace.messaging"
      config:
        channels:
          - name: "general"          # User question channel
          - name: "coordination"     # Coordinator channel
          - name: "python_channel"   # Python expert channel
          - name: "milvus_channel"   # Milvus expert channel
          - name: "devops_channel"   # DevOps expert channel
  agents:
    coordinator:
      type: "coordinator"
      description: "Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents"
      channels: ["general", "coordination"]
    python_expert:
      type: "expert"
      domain: "python"
```

### 4. Implement Multi-Agent Collaboration

The following shows core code snippets (not the full implementation).

```
# SharedMemory: Milvus’s SharedMemory system
# CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents
# PythonExpertAgent: Python Expert
# MilvusExpertAgent: Milvus Expert
# DevOpsExpertAgent: DevOps Expert
import os
import asyncio
import json
from typing import List, Dict
from dotenv import load_dotenv
from openagents.agents.worker_agent import WorkerAgent
from pymilvus import connections, Collection, FieldSchema, CollectionSchema, DataType
import openai
load_dotenv()
class SharedMemory:
    """SharedMemory in Milvus for all Agents"""
    def __init__(self):
        connections.connect(uri="./multi_agent_memory.db")
        self.setup_collections()
        self.openai_client = openai.OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            base_url=os.getenv("OPENAI_BASE_URL")
        )
    def setup_collections(self):
        """Create memory collections: expert knowledge, collaboration history, problem solutions"""
        collections = {
            "expert_knowledge": "expert knowledge",
            "collaboration_history": "collaboration history", 
            "problem_solutions": "problem solutions"
        }
        # Code to create vector collections...
    async def search_knowledge(self, query: str, collection_name: str):
        """Search for relevant knowledge"""
        # Vector search implementation...
    async def store_knowledge(self, agent_id: str, content: str, metadata: dict, collection_name: str):
        """Store knowledge"""
        # Store into the vector database...
class CoordinatorAgent(WorkerAgent):
    """Coordinator Agent - analyzes questions and coordinates other Agent"""
    def __init__(self):
        super().__init__(agent_id="coordinator")
        self.expert_agents = {
            "python": "python_expert",
            "milvus": "milvus_expert", 
            "devops": "devops_expert"
        }
    async def analyze_question(self, question: str) -> List[str]:
        """Determine which experts are needed for the question"""
        keywords = {
            "python": ["python", "django", "flask", "async"],
            "milvus": ["milvus", "vector", "index", "performance"],
            "devops": ["deployment", "docker", "kubernetes", "operations"]
        }
        # Keyword matching logic...
        return needed_experts
    async def coordinate_experts(self, question: str, needed_experts: List[str]):
        """Coordinate collaboration among expert Agent"""
        # 1. Notify experts to begin collaborating
        # 2. Dispatch tasks to each expert
        # 3. Collect expert responses
        # 4. Return expert opinions
    async def on_channel_post(self, context):
        """Main logic for handling user questions"""
        content = context.incoming_event.payload.get('content', {}).get('text', '')
        if content and not content.startswith('🎯'):
            # 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user
class PythonExpertAgent(WorkerAgent):
    """Python Expert Agent"""
    async def analyze_python_question(self, question: str) -> str:
        """Analyze Python-related questions and provide expert advice"""
        # 1. Search for relevant experience
        # 2. Use LLM to generate expert response
        # 3. Store result in collaboration history
        return answer
# Start all Agens
async def run_multi_agent_demo():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    # Connect to the OpenAgents network
    await coordinator.async_start(network_host="localhost", network_port=8700)
    # ... Start other Agent
    while True:
        await asyncio.sleep(1)
if __name__ == "__main__":
    asyncio.run(run_multi_agent_demo())
```

### 5. Create and Activate a Virtual Environment

```
conda create -n openagents
conda activate openagents
```

**Install Dependencies**

```
pip install -r requirements.txt
```

**Configure API Keys**

```
cp .env.example .env
```

**Start the OpenAgents Network**

```
openagents network start .
```

![](https://assets.zilliz.com/network_169812ab94.png)

**Start the Multi-Agent Service**

```
python multi_agent_demo.py
```

![](https://assets.zilliz.com/multiagent_service_1661d4b91b.png)

**Start OpenAgents Studio**

```
openagents studio -s
```

![](https://assets.zilliz.com/start_studio_4cd126fea2.png)

**Access Studio**

```
http://localhost:8050
```

![](https://assets.zilliz.com/access_studio1_a33709914b.png)

![](https://assets.zilliz.com/access_studio3_293604c79e.png)

![](https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png)

**Check the status of your agents and network:**

![](https://assets.zilliz.com/check_state_bba1a4fe16.png)

## Conclusion

OpenAgents provides the coordination layer that lets agents discover each other, communicate, and collaborate, while Milvus solves the equally critical problem of how knowledge is stored, shared, and reused. By delivering a high-performance vector memory layer, Milvus enables agents to build persistent context, recall past interactions, and accumulate expertise over time. Together, they push AI systems beyond the limits of isolated models and toward the deeper collaborative potential of a true multi-agent network. 

Of course, no multi-agent architecture is without trade-offs. Running agents in parallel can increase token consumption, errors may cascade across agents, and simultaneous decision-making can lead to occasional conflicts. These are active areas of research and ongoing improvement—but they don’t diminish the value of building systems that can coordinate, remember, and evolve.

🚀 Ready to give your agents long-term memory?

Explore [Milvus](https://milvus.io/) and try integrating it with your own workflow. 

Have questions or want a deep dive on any feature? Join our[ Discord channel](https://discord.com/invite/8uyFbECzPX) or file issues on[ GitHub](https://github.com/milvus-io/milvus). You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through[ Milvus Office Hours](https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md).