---
id: from-rag-to-agent-memory-how-ai-systems-learn-by-writing-not-just-reading
title: >
 From RAG to Agent Memory: How AI Systems Learn by Writing, Not Just Reading
author: Min Yin
date: 2026-01-28
cover: assets.zilliz.com/cover_cowork_febdab11be.png
tag: Engineering
recommend: false
publishToMedium: true
tags: Claude Cowork, Agent Memory, RAG, Milvus
meta_keywords: Claude Cowork, Agent Memory, RAG, Milvus
meta_title: >
 From RAG to Read-Write Memory: How Execution-Oriented AI Stores Context
desc: >
 Why modern AI agents need read-write memory, not just RAG, to act, store context, and handle real-world tasks.
origin: https://milvus.io/blog/from-rag-to-agent-memory-how-ai-systems-learn-by-writing-not-just-reading.md
---
# From RAG to Agent Memory: How AI Systems Learn by Writing, Not Just Reading

AI systems are starting to *do things*, not just talk. Anthropic’s desktop assistant **Claude Cowork** is a good example. If you ask it to organize last week’s meetings, it doesn’t just summarize text. It searches your local folders, finds the relevant files, generates a slide deck, and saves it to your desktop.

That detail matters. The interesting part is not the content it generates, but the fact that it **creates and modifies files**. Each interaction now changes system state. New documents appear. Existing files are edited. Directories are reorganized. These actions alter the user’s environment and produce fresh context. And that context immediately becomes part of the next interaction—questions like “Where did you save the PPT?” or “Add yesterday’s notes to the deck you made earlier.”

This is a structural shift. The AI is no longer only consuming information. It is continuously **producing new memory**.

## From Reading to Writing: A New Memory Paradigm

Classic RAG architectures are poorly suited for **this read-to-write shift**. Traditional RAG is built around a read-only loop: a query comes in, vectors are searched, static documents are retrieved, and an answer is generated. The knowledge base stays unchanged during execution. The model is assumed to work against a fixed corpus, acting as an intelligent lookup layer.

Execution-oriented agents like Cowork break that model. Every step generates new data. That data must be written immediately, queried with low latency, and evaluated for whether it should persist. This leads to a new systems-level question: **can today’s vector databases handle frequent, low-latency reads and writes at the same time?**

To answer that, we need to step back and examine how RAG architectures evolved in the first place.

## Three Generations of RAG Architecture

### Generation 1: Classic RAG—Always Retrieve

**Core model:** A fixed, read-only retrieval pipeline. Every query triggers vector search over a static knowledge base, followed by generation.

**Key limitation:** Retrieval is unconditional. Even trivial or common-sense questions incur search latency and compute cost.




### Generation 2: Agentic RAG—Decide to Retrieve

**Core model:** Retrieval becomes conditional. The model decides whether external knowledge is needed before searching.

**What changes:** Unnecessary searches are avoided, reducing cost and latency.

**Remaining constraint:** Memory is still read-only. Newly generated context—actions, intermediate results, task outcomes—is discarded after each turn.

### Generation 3: Agent Memory—Read + Write memory

**Core model:** Memory becomes an active, read–write workspace. Agent actions and their results are written back in real time and reused in later interactions.

**Why it matters:** State persists across turns and sessions. Agents can execute multi-step, long-running tasks with accumulated context.

**System impact:** Writable memory shifts requirements to the storage layer: high-frequency writes, low-latency retrieval, and intelligent retention must all be supported together.

  

## Three Core Challenges of Writable Memory

Once memory becomes writable, the problem changes fundamentally. The system is no longer just storing information. It must decide **what to remember**, **where to store it**, and **how fast new memory becomes usable**—all under real-time constraints. This introduces three hard problems.

### What Should an Agent Remember?

Not every action deserves long-term memory. A user might create a temporary file and delete it minutes later. Should that action be stored? Keeping everything quickly explodes storage cost. Dropping everything risks losing critical context.

This turns memory into a **ranking problem**, not a binary choice. Common signals include:

-   **Recency:** recent actions tend to matter more.
    
-   **Frequency:** files that are accessed or modified repeatedly are more important.
    
-   **Type:** structured artifacts such as project configs or meeting notes are usually more valuable than transient caches.
    

These signals often conflict. A document created last week but heavily edited today—should its importance decay with age or increase with activity? There is no universal rule. Importance must ultimately be defined at the application layer, using domain semantics.

Vector databases can assist but cannot decide. For example, **Milvus** supports **TTL (Time To Live)** to automatically expire data, and decay functions to lower retrieval weight for older memory. These are execution tools. The decision logic still belongs to the application.

  

### How Should Memory Be Tiered?

Once a memory is deemed worth keeping, the next question is **what resources should store it**.

As tasks grow longer and action history accumulates, keeping all memory in high-performance storage—such as RAM—becomes prohibitively expensive. Tiered storage is unavoidable. A common pattern is:

-   **Hot memory:** recent actions (for example, the last few days) kept in memory for fast access.
    
-   **Cold memory:** older history (for example, data from months ago) stored in object storage like S3 or OSS, loaded only when needed.
    

**Milvus** supports hot–cold data separation. Frequently accessed data stays in memory for low-latency retrieval, while infrequently accessed data is automatically migrated to disk or object storage.

The hard part is classification. Typical strategies include:

-   **Time-based:** data older than a threshold is marked cold.
    
-   **Access-based:** data not accessed for a period is downgraded.
    
-   **User-defined:** explicitly marked important data always stays hot.
    

In the end, memory tiering is just **importance judgment** in disguise.

Tiering forces a trade-off between latency and memory usage. Fetching cold data on demand adds delay, while aggressive preloading wastes memory. As a result, storage policy cannot be designed in isolation—it must be aligned with importance scoring.

  

### How Fast Must Writes Be?

Classic RAG writes are offline and batch-oriented. Documents are collected, indexed later, and become searchable hours or days after ingestion. Real-time visibility is not required.

Execution-oriented AI is different. Every user action—creating a file, moving a directory, editing a document—must be written immediately. If write latency is too high, the next interaction cannot reference the just-completed action. Questions like “Where did you save the PPT?” fail because the memory is not yet visible.

This places extreme pressure on real-time write paths. But fast writes and accurate retrieval are in tension:

-   Vector indexes take time to build.
    
-   Rebuilding an index on every write is too expensive.
    
-   Delaying indexing improves throughput but creates a “write-not-visible” window.
    

**Milvus** addresses this with **streaming ingestion and incremental indexing**. New data is written to in-memory buffers first. Index updates are triggered in batches based on size or time thresholds. This balances write throughput, query visibility, and system cost.

Even so, the challenge remains. When a single user can generate thousands of actions per day—and many users operate concurrently—write and query workloads compete for the same resources. Sustaining low latency under sustained write pressure is still a real systems problem.

  

## What This Means for Developers

As AI systems move from question answering to execution, two structural changes start to matter immediately. Both affect how you design and evaluate your system.

### Vector Database Selection Criteria Have Changed

In early RAG systems, memory behaved like a static knowledge base. A query came in, documents were retrieved, an answer was generated. The entire pipeline was read-only.

Execution-oriented AI changes that model. Memory becomes a **live workspace**:

-   Every tool call, file edit, or plan update writes new state.
    
-   The next decision depends on that freshly written data.
    
-   Reads and writes form a tight feedback loop.
    

As a result, choosing a vector database is no longer just about retrieval quality. Precision and recall still matter, but they are no longer sufficient. You now need to evaluate whether the system can handle:

-   **High write throughput with low latency**, to support frequent action logs and state updates.
    
-   **A clear consistency model**, so concurrent agents do not overwrite or corrupt shared memory.
    
-   **Tiered storage support**, keeping hot data in memory while persisting cold data to disk.
    

  

### AI Applications Now Require Core Backend Infrastructure

Early AI applications behaved like stateless functions. You passed in a prompt and got text back. No persistence. No recovery. No coordination.

Execution changes that. Long-running tasks—debugging code, deploying services, generating reports—turn AI into a **stateful service**. At that point, classic backend infrastructure becomes unavoidable:

-   **Undo and rollback** → operation logs
    
-   **Concurrent task execution** → job queues
    
-   **Cross-device or multi-user sync** → distributed, consistent storage
    

For developers, this means calling an LLM through an API is no longer enough. You must design persistence layers, manage state transitions, and plan for failure recovery—exactly the same concerns you already know from building backend systems.

  

## What Milvus Is Building Toward

**Milvus 2.6** introduces several capabilities designed to support writable, agent-style memory systems.

At the storage layer, **Milvus** adds **hot–cold data tiering**. Cold data can be automatically migrated to object storage such as S3 or OSS to reduce cost, while hot data remains in memory for fast retrieval. Migration policies are configurable at the application level, commonly based on time or access frequency.

On the write path, **Milvus** improves **streaming ingestion and incremental indexing**. This allows higher write rates without blocking queries, and makes newly written data searchable within seconds rather than minutes or hours.

**Milvus** also provides a **TTL (Time To Live) mechanism**. Data can expire automatically after a defined lifetime, which is especially useful for cleaning up transient or short-lived memory.

Taken together, these capabilities enable **Milvus** to serve as a foundation for writable, agent-style memory systems, while decisions such as importance scoring, tiering thresholds, and retention policies are shaped by the specific needs of each application.

## Conclusion

This brings us back to the original question: **can today’s vector databases support the high-frequency read–write demands of execution-oriented AI?**

The short answer is yes. At the system level, many of the required capabilities are already in place. The remaining challenge lies in how those capabilities are applied. Memory structure, retention strategies, and write–read coordination still require careful application-level design.

Tools like Cowork are early signals rather than finished answers. Today, it may look like a capable file manager with clear boundaries. But the direction it points to—AI systems that act, persist state, and accumulate context over time—will continue to raise the bar for memory systems.

There is still room for exploration and refinement in how these systems are built. Different workloads will emphasize different trade-offs. What is already clear, however, is that memory is no longer a supporting feature. For execution-oriented AI, it has become a core system component.