---
id: anthropic-managed-agents-memory-milvus.md
title: |
  How to Add Long-Term Memory to Anthropic's Managed Agents with Milvus
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >
  Anthropic's Managed Agents made agents reliable, but every session starts
  blank. Here's how to pair Milvus for semantic recall inside a session and
  shared memory across agents.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Anthropic’s <a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents</a> make agent infrastructure resilient. A 200-step task now survives a harness crash, a sandbox timeout, or a mid-flight infrastructure change without human intervention, and Anthropic reports p50 time-to-first-token dropped roughly 60% and p95 dropped over 90% after the decoupling.</p>
<p>What reliability doesn’t solve is memory. A 200-step code migration that hits a new dependency conflict on step 201 can’t efficiently look back at how it handled the last one. An agent running vulnerability scans for one customer has no idea that another agent already solved the same case an hour ago. Every session starts on a blank page, and parallel brains have no access to what the others have already worked out.</p>
<p>The fix is to pair the <a href="https://milvus.io/">Milvus vector database</a> with Anthropic’s Managed Agents: semantic recall within a session, and a shared <a href="https://milvus.io/docs/milvus_for_agents.md">vector memory layer</a> across sessions. The session contract stays untouched, the harness gets one new layer, and long-horizon agent tasks get qualitatively different capabilities.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">What Managed Agents Solved (and What They Didn’t)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Managed Agents solved reliability by decoupling the agent into three independent modules. What it didn’t solve is memory, either as semantic recall inside a single session or as shared experience across parallel sessions.</strong> Here’s what got decoupled, and where the memory gap sits inside that decoupled design.</p>
<table>
<thead>
<tr><th>Module</th><th>What it does</th></tr>
</thead>
<tbody>
<tr><td><strong>Session</strong></td><td>An append-only event log of everything that happened. Stored outside the harness.</td></tr>
<tr><td><strong>Harness</strong></td><td>The loop that calls Claude and routes Claude’s tool calls to the relevant infrastructure.</td></tr>
<tr><td><strong>Sandbox</strong></td><td>The isolated execution environment where Claude runs code and edits files.</td></tr>
</tbody>
</table>
<p>The reframe that makes this design work is stated explicitly in Anthropic’s post:</p>
<p><em>“The session is not Claude’s context window.”</em></p>
<p>The context window is ephemeral: bounded in tokens, reconstructed per model call, and discarded when the call returns. The session is durable, stored outside the harness, and represents the system of record for the entire task.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>When a harness crashes, the platform starts a fresh one with <code translate="no">wake(sessionId)</code>. The new harness reads the event log via <code translate="no">getSession(id)</code>, and the task picks up from the last recorded step, with no custom recovery logic to write and no session-level babysitting to operate.</p>
<p>What the Managed Agents post doesn’t address, and doesn’t claim to, is what the agent does when it needs to remember anything. Two gaps show up the moment you push real workloads through the architecture. One lives inside a single session; the other lives across sessions.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">Problem 1: Why Linear Session Logs Fail Past a Few Hundred Steps<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Linear session logs fail past a few hundred steps because sequential reads and semantic search are fundamentally different workloads, and the</strong> <code translate="no">**getEvents()**</code> <strong>API serves only the first one.</strong> Slicing by position or seeking to a timestamp is enough to answer “where did this session leave off.” It is not enough to answer the question an agent will predictably need on any long task: have we seen this kind of problem before, and what did we do about it?</p>
<p>Consider a code migration at step 200 that hits a new dependency conflict. The natural move is to look back. Did the agent run into something similar earlier in this same task? What approach was tried? Did it hold, or did it regress something else downstream?</p>
<p>With <code translate="no">getEvents()</code> there are two ways to answer that, and both are bad:</p>
<table>
<thead>
<tr><th>Option</th><th>Problem</th></tr>
</thead>
<tbody>
<tr><td>Scan every event sequentially</td><td>Slow at 200 steps. Untenable at 2,000.</td></tr>
<tr><td>Dump a large slice of the stream into the context window</td><td>Expensive on tokens, unreliable at scale, and crowds out the agent’s actual working memory for the current step.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The session is good for recovery and audit, but it was not built with an index that supports “have I seen this before.” Long-horizon tasks are where that question stops being optional.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">Solution 1: How to Add Semantic Memory to a Managed Agent’s Session<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Add a Milvus collection alongside the session log and dual-write from</strong> <code translate="no">**emitEvent**</code><strong>.</strong> The session contract stays untouched, and the harness gains semantic query over its own past.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic’s design leaves headroom for exactly this. Their post states that “any fetched events can also be transformed in the harness before being passed to Claude’s context window. These transformations can be whatever the harness encodes, including context organization… and context engineering.” Context engineering lives in the harness; the session only has to guarantee durability and queryability.</p>
<p>The pattern: every time <code translate="no">emitEvent</code> fires, the harness also computes a <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">vector embedding</a> for events worth indexing and inserts them into a Milvus collection.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>When the agent hits step 200 and needs to recall prior decisions, the query is a <a href="https://zilliz.com/glossary/vector-similarity-search">vector search</a> scoped to that session:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>Three production details matter before this ships:</p>
<ul>
<li><strong>Pick what to index.</strong> Not every event deserves an embedding. Tool-call intermediate states, retry logs, and repetitive status events pollute retrieval quality faster than they improve it. The <code translate="no">INDEXABLE_EVENT_TYPES</code> policy is task-dependent, not global.</li>
<li><strong>Define the consistency boundary.</strong> If the harness crashes between the session append and the Milvus insert, one layer is briefly ahead of the other. The window is small but real. Pick a reconciliation path (retry on restart, write-ahead log, or eventual reconciliation) rather than hoping.</li>
<li><strong>Control embedding spend.</strong> A 200-step session that calls an external embedding API synchronously on every step produces an invoice nobody planned for. Queue embeddings and send them asynchronously in batches.</li>
</ul>
<p>With those in place, recall takes milliseconds for the vector search plus under 100ms for the embedding call. The top-five most relevant past events land in context before the agent notices friction. The session keeps its original job as the durable log; the harness gains the ability to query its own past semantically rather than sequentially. That’s a modest change at the API surface and a structural change in what the agent can do on long-horizon tasks.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">Problem 2: Why Parallel Claude Agents Can’t Share Experience<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Parallel Claude agents can’t share experience because Managed Agents sessions are isolated by design. The same isolation that makes horizontal scaling clean also prevents every brain from learning from every other brain.</strong></p>
<p>In a decoupled harness, brains are stateless and independent. That isolation unlocks the latency wins Anthropic reports, and it also keeps every session running in the dark about every other session.</p>
<p>Agent A spends 40 minutes diagnosing a tricky SQL injection vector for one customer. An hour later, Agent B picks up the same case for a different customer and spends its own 40 minutes walking the same dead ends, running the same tool calls, and arriving at the same answer.</p>
<p>For a single user running the occasional agent, that is wasted compute. For a platform running dozens of concurrent <a href="https://zilliz.com/glossary/ai-agents">AI agents</a> across code review, vulnerability scans, and documentation generation for different customers every day, the cost compounds structurally.</p>
<p>If the experience every session produces evaporates the moment the session ends, the intelligence is disposable. A platform built this way scales linearly but doesn’t get better at anything over time, the way human engineers do.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">Solution 2: How to Build a Shared Agent Memory Pool with Milvus<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Build one vector collection that every harness reads from at startup and writes to at shutdown, partitioned by tenant so experience pools across sessions without leaking across customers.</strong></p>
<p>When a session ends, the key decisions, problems encountered, and approaches that worked are pushed into the shared Milvus collection. When a new brain initializes, the harness runs a semantic query as part of setup and injects the top-matching past experiences into the context window. Step one of the new agent inherits the lessons of every prior agent.</p>
<p>Two engineering decisions carry this from prototype to production.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Isolating Tenants with the Milvus Partition Key</h3><p><strong>Partition by</strong> <code translate="no">**tenant_id**</code><strong>, and Customer A’s agent experiences physically don’t live in the same partition as Customer B’s. That’s isolation at the data layer rather than a query convention.</strong></p>
<p>Brain A’s work on Company A’s codebase should never be retrievable by Company B’s agents. Milvus’s <a href="https://milvus.io/docs/use-partition-key.md">partition key</a> handles this on a single collection, with no second collection per tenant and no sharding logic in application code.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Customer A’s agent experiences never surface in Customer B’s queries, not because the query filter is written correctly (though it has to be), but because the data physically does not live in the same partition as Customer B’s. One collection to operate, logical isolation enforced at the query layer, physical isolation enforced at the partition layer.</p>
<p>See the <a href="https://milvus.io/docs/multi_tenancy.md">multi-tenancy strategies docs</a> for when partition key fits versus when separate collections or databases do, and the <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">multi-tenancy RAG patterns guide</a> for production deployment notes.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">Why Agent Memory Quality Needs Ongoing Work</h3><p><strong>Memory quality erodes over time: flawed workarounds that happened to succeed once get replayed and reinforced, and stale entries tied to deprecated dependencies keep misleading agents that inherit them. The defenses are operational programs, not database features.</strong></p>
<p>An agent stumbles on a flawed workaround that happens to succeed once. It gets written to the shared pool. The next agent retrieves it, replays it, and reinforces the bad pattern with a second “successful” usage record.</p>
<p>Stale entries follow a slower version of the same path. A fix pinned to a dependency version that was deprecated six months ago keeps getting retrieved, and keeps misleading agents that inherit it. The older and more heavily used the pool, the more of this accumulates.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Three operational programs defend against this:</p>
<ul>
<li><strong>Confidence score.</strong> Track how often a memory has been successfully applied in downstream sessions. Decay entries that fail in replay. Promote entries that succeed repeatedly.</li>
<li><strong>Time weighting.</strong> Prefer recent experiences. Retire entries past a known staleness threshold, often tied to major dependency version bumps.</li>
<li><strong>Human spot checks.</strong> Entries with high retrieval frequency are high-leverage. When one of them is wrong, it is wrong many times, which is where human review pays back fastest.</li>
</ul>
<p>Milvus alone doesn’t solve this, and neither does Mem0, Zep, or any other memory product. Enforcing one pool with many tenants and zero cross-tenant leakage is something you engineer once. Keeping that pool accurate, fresh, and useful is continuous operational work that no database ships pre-configured.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">Takeaways: What Milvus Adds to Anthropic’s Managed Agents<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus turns Managed Agents from a reliable-but-forgetful platform into one that compounds experience over time by adding semantic recall inside a session and shared memory across agents.</strong></p>
<p>Managed Agents answered the reliability question cleanly: both brains and hands are cattle, and any one can die without taking the task with it. That’s the infrastructure problem, and Anthropic solved it well.</p>
<p>What stayed open was growth. Human engineers compound over time; years of work turn into pattern recognition, and they don’t reason from first principles on every task. Today’s managed agents don’t, because every session starts on a blank page.</p>
<p>Wiring the session to Milvus for semantic recall inside a task and pooling experience across brains in a shared vector collection is what gives agents a past they can actually use. Plugging in Milvus is the infrastructure piece; pruning wrong memories, retiring stale ones, and enforcing tenant boundaries is the operational piece. Once both are in place, the shape of memory stops being a liability and starts being compounding capital.</p>
<h2 id="Get-Started" class="common-anchor-header">Get Started<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><strong>Try it locally:</strong> spin up an embedded Milvus instance with <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. No Docker, no cluster, just <code translate="no">pip install pymilvus</code>. Production workloads graduate to <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone or Distributed</a> when you need them.</li>
<li><strong>Read the design rationale:</strong> Anthropic’s <a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents engineering post</a> walks through the session, harness, and sandbox decoupling in depth.</li>
<li><strong>Got questions?</strong> Join the <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> community for agent memory design discussions, or book a <a href="https://milvus.io/office-hours">Milvus Office Hours</a> session to walk through your workload.</li>
<li><strong>Prefer managed?</strong> <a href="https://cloud.zilliz.com/signup">Sign up for Zilliz Cloud</a> (or <a href="https://cloud.zilliz.com/login">sign in</a>) for hosted Milvus with partition keys, scaling, and multi-tenancy built in. New accounts get free credits on a work email.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Frequently Asked Questions<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Q: What’s the difference between a session and a context window in Anthropic’s Managed Agents?</strong></p>
<p>The context window is the ephemeral set of tokens a single Claude call sees. It’s bounded and resets per model invocation. The session is the durable, append-only event log of everything that happened across the whole task, stored outside the harness. When a harness crashes, <code translate="no">wake(sessionId)</code> spawns a new harness that reads the session log and resumes. The session is the system of record; the context window is working memory. The session is not the context window.</p>
<p><strong>Q: How do I persist agent memory across Claude sessions?</strong></p>
<p>The session itself is already persistent; that’s what <code translate="no">getSession(id)</code> retrieves. What’s typically missing is queryable long-term memory. The pattern is to embed high-signal events (decisions, resolutions, strategies) into a vector database like Milvus during <code translate="no">emitEvent</code>, then query by semantic similarity at retrieval time. This gives you both the durable session log Anthropic provides and a semantic recall layer for looking back across hundreds of steps.</p>
<p><strong>Q: Can multiple Claude agents share memory?</strong></p>
<p>Not out of the box. Each Managed Agents session is isolated by design, which is what lets them scale horizontally. To share memory across agents, add a shared vector collection (for example in Milvus) that each harness reads from at startup and writes to at shutdown. Use Milvus’s partition key feature to isolate tenants so Customer A’s agent memories never leak into Customer B’s sessions.</p>
<p><strong>Q: What’s the best vector database for AI agent memory?</strong></p>
<p>The honest answer depends on scale and deployment shape. For prototypes and small workloads, a local embedded option like Milvus Lite runs in-process with no infrastructure. For production agents across many tenants, you want a database with mature multi-tenancy (partition keys, filtered search), hybrid search (vector + scalar + keyword), and millisecond-latency at millions of vectors. Milvus is purpose-built for vector workloads at that scale, which is why it appears in production agent memory systems built on LangChain, Google ADK, Deep Agents, and OpenAgents.</p>
