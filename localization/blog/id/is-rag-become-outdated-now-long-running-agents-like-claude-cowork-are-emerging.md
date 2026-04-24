---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: >
  Is RAG Becoming Outdated Now That Long-Running Agents Like Claude Cowork Are
  Emerging?
author: Min Yin
date: 2026-1-27
desc: >-
  An in-depth analysis of Claude Cowork’s long-term memory, writable agent
  memory, RAG trade-offs, and why vector databases still matter.
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">Claude Cowork</a> is a new agent feature in the Claude Desktop app. From a developer’s point of view, it’s basically an automated task runner wrapped around the model: it can read, modify, and generate local files, and it can plan multi-step tasks without you having to manually prompt for each step. Think of it as the same loop behind Claude Code, but exposed to the desktop instead of the terminal.</p>
<p>Cowork’s key capability is its ability to run for extended periods without losing state. It doesn’t hit the usual conversation timeout or context reset. It can keep working, track intermediate results, and reuse previous information across sessions. That gives the impression of “long-term memory,” even though the underlying mechanics are more like persistent task state + contextual carryover. Either way, the experience is different from the traditional chat model, where everything resets unless you build your own memory layer.</p>
<p>This brings up two practical questions for developers:</p>
<ol>
<li><p><strong>If the model can already remember past information, where does RAG or agentic RAG still fit in? Will RAG be replaced?</strong></p></li>
<li><p><strong>If we want a local, Cowork-style agent, how do we implement long-term memory ourselves?</strong></p></li>
</ol>
<p>The rest of this article addresses these questions in detail and explains how vector databases fit into this new “model memory” landscape.</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork vs. RAG: What’s the Difference?<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>As I mentioned previously, Claude Cowork is an agent mode inside Claude Desktop that can read and write local files, break tasks into smaller steps, and keep working without losing state. It maintains its own working context, so multi-hour tasks don’t reset like a normal chat session.</p>
<p><strong>RAG</strong> (Retrieval-Augmented Generation) solves a different problem: giving a model access to external knowledge. You index your data into a vector database, retrieve relevant chunks for each query, and feed them into the model. It’s widely used because it provides LLM applications with a form of “long-term memory” for documents, logs, product data, and more.</p>
<p>If both systems help a model “remember,” what’s the actual difference?</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">How Cowork Handles Memory</h3><p>Cowork’s memory is read-write. The agent decides which information from the current task or conversation is relevant, stores it as memory entries, and retrieves it later as the task progresses. This allows Cowork to maintain continuity across long-running workflows — especially ones that produce new intermediate state as they progress.</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">How RAG and Agentic RAG Handle Memory</h3><p>Standard RAG is query-driven retrieval: the user asks something, the system fetches relevant documents, and the model uses them to answer. The retrieval corpus stays stable and versioned, and developers control exactly what enters it.</p>
<p>Modern agentic RAG extends this pattern. The model can decide when to retrieve information, what to retrieve, and how to use it during the planning or execution of a workflow. These systems can run long tasks and call tools, similar to Cowork. But even with agentic RAG, the retrieval layer remains knowledge-oriented rather than state-oriented. The agent retrieves authoritative facts; it doesn’t write its evolving task state back into the corpus.</p>
<p>Another way to look at it:</p>
<ul>
<li><p><strong>Cowork’s memory is task-driven:</strong> the agent writes and reads its own evolving state.</p></li>
<li><p><strong>RAG is knowledge-driven:</strong> the system retrieves established information that the model should rely on.</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">Reverse-Engineering Claude Cowork: How It Builds Long-Running Agent Memory<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Cowork gets a lot of hype because it handles multi-step tasks without constantly forgetting what it was doing. From a developer’s perspective, I am wondering <strong>how it keeps state across such long sessions?</strong> Anthropic hasn’t published the internals, but based on earlier dev experiments with Claude’s memory module, we can piece together a decent mental model.</p>
<p>Claude seems to rely on a hybrid setup: <strong>a persistent long-term memory layer plus on-demand retrieval tools.</strong> Instead of stuffing the full conversation into every request, Claude selectively pulls in past context only when it decides it’s relevant. This lets the model keep accuracy high without blowing through tokens every turn.</p>
<p>If you break down the request structure, it roughly looks like this:</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>The interesting behavior isn’t the structure itself — it’s how the model decides what to update and when to run retrieval.</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">User Memory: The Persistent Layer</h3><p>Claude keeps a long-term memory store that updates over time. And unlike ChatGPT’s more predictable memory system, Claude’s feels a bit more “alive.” It stores memories in XML-ish blocks and updates them in two ways:</p>
<ul>
<li><p><strong>Implicit updates:</strong> Sometimes the model just decides something is a stable preference or fact and quietly writes it to memory. These updates aren’t instantaneous; they show up after a few turns, and older memories can fade out if the related conversation disappears.</p></li>
<li><p><strong>Explicit updates:</strong> Users can directly modify memory with the <code translate="no">memory_user_edits</code> tool (“remember X,” “forget Y”). These writes are immediate and behave more like a CRUD operation.</p></li>
</ul>
<p>Claude is running background heuristics to decide what’s worth persisting, and it’s not waiting for explicit instructions.</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">Conversation Retrieval: The On-Demand Part</h3><p>Claude does <em>not</em> keep a rolling summary like many LLM systems. Instead, it has a toolbox of retrieval functions it can call whenever it thinks it’s missing context. These retrieval calls don’t happen every turn — the model triggers them based on its own internal judgment.</p>
<p>The standout is <code translate="no">conversation_search</code>. When the user says something vague like “that project from last month,” Claude often fires this tool to dig up relevant turns. What’s notable is that it still works when the phrasing is ambiguous or in a different language. That pretty clearly implies:</p>
<ul>
<li><p>Some kind of semantic matching (embeddings)</p></li>
<li><p>Probably combined with normalization or lightweight translation</p></li>
<li><p>Keyword search layered in for precision</p></li>
</ul>
<p>Basically, this looks a lot like a miniature RAG system bundled inside the model’s toolset.</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">How Claude’s Retrieval Behavior Differs From Basic History Buffers</h3><p>From testing and logs, a few patterns stand out:</p>
<ul>
<li><p><strong>Retrieval isn’t automatic.</strong> The model chooses when to call it. If it thinks it already has enough context, it won’t even bother.</p></li>
<li><p><strong>Retrieved chunks include</strong> <em>both</em> <strong>user and assistant messages.</strong> That’s useful — it keeps more nuance than user-only summaries.</p></li>
<li><p><strong>Token usage stays sane.</strong> Because history isn’t injected every turn, long sessions don’t balloon unpredictably.</p></li>
</ul>
<p>Overall, it feels like a retrieval-augmented LLM, except the retrieval happens as part of the model’s own reasoning loop.</p>
<p>This architecture is clever, but not free:</p>
<ul>
<li><p>Retrieval adds latency and more “moving parts” (indexing, ranking, re-ranking).</p></li>
<li><p>The model occasionally misjudges whether it needs context, which means you see the classic “LLM forgetfulness” even though the data <em>was</em> available.</p></li>
<li><p>Debugging becomes trickier because model behavior depends on invisible tool triggers, not just prompt input.</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">Claude Cowork vs Claude Codex in handling long-term memory</h3><p>In contrast to Claude’s retrieval-heavy setup, ChatGPT handles memory in a much more structured and predictable way. Instead of doing semantic lookups or treating old conversations like a mini vector store, ChatGPT injects memory directly into each session through the following layered components:</p>
<ul>
<li><p>User memory</p></li>
<li><p>Session metadata</p></li>
<li><p>Current session messages</p></li>
</ul>
<p><strong>User Memory</strong></p>
<p>User Memory is the main long-term storage layer—the part that persists across sessions and can be edited by the user. It stores pretty standard things: name, background, ongoing projects, learning preferences, that kind of stuff. Every new conversation gets this block injected at the start, so the model always starts with a consistent view of the user.</p>
<p>ChatGPT updates this layer in two ways:</p>
<ul>
<li><p><strong>Explicit updates:</strong> Users can tell the model to “remember this” or “forget that,” and the memory changes immediately. This is basically a CRUD API that the model exposes through natural language.</p></li>
<li><p><strong>Implicit updates:</strong> If the model spots information that fits OpenAI’s rules for long-term memory—like a job title or a preference—and the user hasn’t disabled memory, it will quietly add it on its own.</p></li>
</ul>
<p>From a developer angle, this layer is simple, deterministic, and easy to reason about. No embedding lookups, no heuristics about what to fetch.</p>
<p><strong>Session Metadata</strong></p>
<p>Session Metadata sits at the opposite end of the spectrum. It’s short-lived, non-persistent, and only injected once at the start of a session. Think of it as environment variables for the conversation. This includes things like:</p>
<ul>
<li><p>what device you’re on</p></li>
<li><p>account/subscription state</p></li>
<li><p>rough usage patterns (active days, model distribution, average conversation length)</p></li>
</ul>
<p>This metadata helps the model shape responses for the current environment—e.g., writing shorter answers on mobile—without polluting long-term memory.</p>
<p><strong>Current Session Messages</strong></p>
<p>This is the standard sliding-window history: all messages in the current conversation until the token limit is reached. When the window gets too large, older turns drop off automatically.</p>
<p>Crucially, this eviction <strong>does not</strong> touch User Memory or cross-session summaries. Only the local conversation history shrinks.</p>
<p>The biggest divergence from Claude appears in how ChatGPT handles “recent but not current” conversations. Claude will call a search tool to retrieve past context if it thinks it’s relevant. ChatGPT does not do that.</p>
<p>Instead, ChatGPT keeps a very lightweight <strong>cross-session summary</strong> that gets injected into every conversation. A few key details about this layer:</p>
<ul>
<li><p>It summarizes <strong>only user messages</strong>, not assistant messages.</p></li>
<li><p>It stores a very small set of items—roughly 15—just enough to capture stable themes or interests.</p></li>
<li><p>It does <strong>no embedding computation, no similarity ranking, and no retrieval calls</strong>. It’s basically pre-chewed context, not dynamic lookup.</p></li>
</ul>
<p>From an engineering perspective, this approach trades flexibility for predictability. There’s no chance of a weird retrieval failure, and inference latency stays stable because nothing is being fetched on the fly. The downside is that ChatGPT won’t pull in some random message from six months ago unless it made it into the summary layer.</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">Challenges to Making Agent Memory Writable<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>When an agent moves from <strong>read-only memory</strong> (typical RAG) to <strong>writable memory</strong>—where it can log user actions, decisions, and preferences—the complexity jumps quickly. You’re no longer just retrieving documents; you’re maintaining a growing state on which the model depends.</p>
<p>A writable memory system has to solve three real problems:</p>
<ol>
<li><p><strong>What to remember:</strong> The agent needs rules for deciding which events, preferences, or observations are worth keeping. Without this, memory either explodes in size or fills with noise.</p></li>
<li><p><strong>How to store and tier memory:</strong> Not all memory is equal. Recent items, long-term facts, and ephemeral notes all need different storage layers, retention policies, and indexing strategies.</p></li>
<li><p><strong>How to write fast without breaking retrieval:</strong> Memory must be written continuously, but frequent updates can degrade index quality or slow queries if the system isn’t designed for high-throughput inserts.</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">Challenge 1: What Is Worth Remembering?</h3><p>Not everything a user does should end up in long-term memory. If someone creates a temp file and deletes it five minutes later, recording that forever doesn’t help anyone. This is the core difficulty: <strong>how does the system decide what actually matters?</strong></p>
<p><strong>(1) Common ways to judge importance</strong></p>
<p>Teams usually rely on a mix of heuristics:</p>
<ul>
<li><p><strong>Time-based</strong>: recent actions matter more than old ones</p></li>
<li><p><strong>Frequency-based</strong>: files or actions accessed repeatedly are more important</p></li>
<li><p><strong>Type-based</strong>: some objects are inherently more important (for example, project config files vs. cache files)</p></li>
</ul>
<p><strong>(2) When rules conflict</strong></p>
<p>These signals often conflict. A file created last week but edited heavily today—should age or activity win? There’s no single “correct” answer, which is why importance scoring tends to get messy fast.</p>
<p><strong>(3) How vector databases help</strong></p>
<p>Vector databases give you mechanisms to enforce importance rules without manual cleanup:</p>
<ul>
<li><p><strong>TTL:</strong> Milvus can automatically remove data after a set time</p></li>
<li><p><strong>Decay:</strong> older vectors can be down-weighted so they naturally fade from retrieval</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">Challenge 2: Memory Tiering in Practice</h3><p>As agents run longer, memory piles up. Keeping everything in fast storage isn’t sustainable, so the system needs a way to split memory into <strong>hot</strong> (frequently accessed) and <strong>cold</strong> (rarely accessed) tiers.</p>
<p><strong>(1) Deciding When Memory Becomes Cold</strong></p>
<p>In this model, <em>hot memory</em> refers to data kept in RAM for low-latency access, while <em>cold memory</em> refers to data moved to disk or object storage to reduce cost.</p>
<p>Deciding when memory becomes cold can be handled in different ways. Some systems use lightweight models to estimate the semantic importance of an action or file based on its meaning and recent usage. Others rely on simple, rule-based logic, such as moving memory that has not been accessed for 30 days or has not appeared in retrieval results for a week. Users may also explicitly mark certain files or actions as important, ensuring they always remain hot.</p>
<p><strong>(2) Where Hot and Cold Memory Are Stored</strong></p>
<p>Once classified, hot and cold memories are stored differently. Hot memory stays in RAM and is used for frequently accessed content, such as active task context or recent user actions. Cold memory is moved to disk or object storage systems like S3, where access is slower but storage costs are much lower. This trade-off works well because cold memory is rarely needed and is typically accessed only for long-term reference.</p>
<p><strong>(3) How Vector Databases Help</strong></p>
<p><strong>Milvus and Zilliz Cloud</strong> support this pattern by enabling hot–cold tiered storage while maintaining a single query interface, so frequently accessed vectors stay in memory and older data moves to lower-cost storage automatically.</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">Challenge 3: How Fast Should Memory Be Written?</h3><p>Traditional RAG systems usually write data in batches. Indexes are rebuilt offline—often overnight—and only become searchable later. This approach works for static knowledge bases, but it does not fit agent memory.</p>
<p><strong>(1) Why Agent Memory Needs Real-Time Writes</strong></p>
<p>Agent memory must capture user actions as they happen. If an action is not recorded immediately, the next conversation turn may lack critical context. For this reason, writable memory systems require real-time writes rather than delayed, offline updates.</p>
<p><strong>(2) The Tension Between Write Speed and Retrieval Quality</strong></p>
<p>Real-time memory demands very low write latency. At the same time, high-quality retrieval depends on well-built indexes, and index construction takes time. Rebuilding an index for every write is too expensive, but delaying indexing means newly written data remains temporarily invisible to retrieval. This trade-off sits at the center of writable memory design.</p>
<p><strong>(3) How Vector Databases Help</strong></p>
<p>Vector databases address this problem by decoupling writing from indexing. A common solution is to stream writes and perform incremental index builds. Using <strong>Milvus</strong> as an example, new data is first written to an in-memory buffer, allowing the system to handle high-frequency writes efficiently. Even before a full index is built, buffered data can be queried within seconds through dynamic merging or approximate search.</p>
<p>When the buffer reaches a predefined threshold, the system builds indexes in batches and persists them. This improves long-term retrieval performance without blocking real-time writes. By separating fast ingestion from slower index construction, Milvus achieves a practical balance between write speed and search quality that works well for agent memory.</p>
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
    </button></h2><p>Cowork gives us a glimpse of a new class of agents—persistent, stateful, and able to carry context across long timelines. But it also makes something else clear: long-term memory is only half of the picture. To build production-ready agents that are both autonomous and reliable, we still need structured retrieval over large, evolving knowledge bases.</p>
<p>RAG handles the world’s facts; writable memory handles the agent’s internal state. And vector databases sit at the intersection, providing indexing, hybrid search, and scalable storage that enable both layers to work together.</p>
<p>As long-running agents continue to mature, their architectures will likely converge on this hybrid design. Cowork is a strong signal of where things are heading—not toward a world without RAG, but toward agents with richer memory stacks powered by vector databases underneath.</p>
<p>If you want to explore these ideas or get help with your own setup, <strong>join our</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channel</a> to chat with Milvus engineers. And for more hands-on guidance, you can always <strong>book a</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours</strong></a> <strong>session.</strong></p>
