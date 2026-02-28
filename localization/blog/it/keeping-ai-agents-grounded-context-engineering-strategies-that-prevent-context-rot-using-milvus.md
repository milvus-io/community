---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: >
  Keeping AI Agents Grounded: Context Engineering Strategies that Prevent
  Context Rot Using Milvus 
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  Learn why context rot happens in long-running LLM workflows and how context
  engineering, retrieval strategies, and Milvus vector search help keep AI
  agents accurate, focused, and reliable across complex multi-step tasks.
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>If you’ve worked with long-running LLM conversations, you’ve probably had this frustrating moment: halfway through a long thread, the model starts drifting. Answers get vague, reasoning weakens, and key details mysteriously vanish. But if you drop the exact same prompt into a new chat, suddenly the model behaves—focused, accurate, grounded.</p>
<p>This isn’t the model “getting tired” — it’s <strong>context rot</strong>. As a conversation grows, the model has to juggle more information, and its ability to prioritize slowly declines. <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Antropic studies</a> show that as context windows stretch from around 8K tokens to 128K, retrieval accuracy can drop by 15–30%. The model still has room, but it loses track of what matters. Bigger context windows help delay the problem, but they don’t eliminate it.</p>
<p>This is where <strong>context engineering</strong> comes in. Instead of handing the model everything at once, we shape what it sees: retrieving only the pieces that matter, compressing what no longer needs to be verbose, and keeping prompts and tools clean enough for the model to reason over. The goal is simple: make important information available at the right moment, and ignore the rest.</p>
<p>Retrieval plays a central role here, especially for long-running agents. Vector databases like <a href="https://milvus.io/"><strong>Milvus</strong></a> provide the foundation for efficiently pulling relevant knowledge back into context, letting the system stay grounded even as tasks grow in depth and complexity.</p>
<p>In this blog, we’ll look at how context rot happens, the strategies teams use to manage it, and the architectural patterns — from retrieval to prompt design — that keep AI agents sharp across long, multi-step workflows.</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">Why Context Rot Happens<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>People often assume that giving an AI model more context naturally leads to better answers. But that’s not actually true. Humans struggle with long inputs too: cognitive science suggests our working memory holds roughly <strong>7±2 chunks</strong> of information. Push beyond that, and we start to forget, blur, or misinterpret details.</p>
<p>LLMs show similar behavior—just at a much larger scale and with more dramatic failure modes.</p>
<p>The root issue comes from the <a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">Transformer architecture</a> itself. Every token must compare itself against every other token, forming pairwise attention across the entire sequence. That means computation grows <strong>O(n²)</strong> with context length. Expanding your prompt from 1K tokens to 100K doesn’t make the model “work harder”—it multiplies the number of token interactions by <strong>10,000×</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Then there’s the problem with the training data.</strong> Models see far more short sequences than long ones. So when you ask an LLM to operate across extremely large contexts, you’re pushing it into a regime it wasn’t heavily trained for. In practice, very long-context reasoning is often <strong>out of distribution</strong> for most models.</p>
<p>Despite these limits, long context is now unavoidable. Early LLM applications were mostly single-turn tasks—classification, summarization, or simple generation. Today, more than 70% of enterprise AI systems rely on agents that stay active across many rounds of interaction, often for hours, managing branching, multi-step workflows. Long-lived sessions have moved from exception to default.</p>
<p>Then the next question is: <strong>how do we keep the model’s attention sharp without overwhelming it?</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">Context Retrieval Approaches to Solving Context Rot<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Retrieval is one of the most effective levers we have to combat context rot, and in practice it tends to show up in complementary patterns that address context rot from different angles.</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1. Just-in-Time Retrieval: Reducing Unnecessary Context</h3><p>One major cause of context rot is <em>overloading</em> the model with information it doesn’t need yet. Claude Code—Anthropic’s coding assistant—solves this issue with <strong>Just-in-Time (JIT) retrieval</strong>, a strategy where the model fetches information only when it becomes relevant.</p>
<p>Instead of stuffing entire codebases or datasets into its context (which greatly increases the chance of drift and forgetting), Claude Code maintains a tiny index: file paths, commands, and documentation links. When the model needs a piece of information, it retrieves that specific item and inserts it into context <strong>at the moment it matters</strong>—not before.</p>
<p>For example, if you ask Claude Code to analyze a 10GB database, it never tries to load the whole thing. It works more like an engineer:</p>
<ol>
<li><p>Runs a SQL query to pull high-level summaries of the dataset.</p></li>
<li><p>Uses commands like <code translate="no">head</code> and <code translate="no">tail</code> to view sample data and understand its structure.</p></li>
<li><p>Retains only the most important information—such as key statistics or sample rows—within the context.</p></li>
</ol>
<p>By minimizing what’s kept in context, JIT retrieval prevents the buildup of irrelevant tokens that cause rot. The model stays focused because it only ever sees the information required for the current reasoning step.</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2. Pre-retrieval (Vector Search): Preventing Context Drift Before It Starts</h3><p>Sometimes the model can’t “ask” for information dynamically—customer support, Q&amp;A systems, and agent workflows often need the right knowledge available <em>before</em> generation begins. This is where <strong>pre-retrieval</strong> becomes critical.</p>
<p>Context rot often happens because the model is handed a large pile of raw text and expected to sort out what matters. Pre-retrieval flips that: a vector database (like <a href="https://milvus.io/">Milvus</a> and <a href="https://zilliz.com/cloud">Zilliz Cloud</a>) identifies the most relevant pieces <em>before</em> inference, ensuring only high-value context reaches the model.</p>
<p>In a typical RAG setup:</p>
<ul>
<li><p>Documents are embedded and stored in a vector database, such as Milvus.</p></li>
<li><p>At query time, the system retrieves a small set of highly relevant chunks through similarity searches.</p></li>
<li><p>Only those chunks go into the model’s context.</p></li>
</ul>
<p>This prevents rot in two ways:</p>
<ul>
<li><p><strong>Noise reduction:</strong> irrelevant or weakly related text never enters the context in the first place.</p></li>
<li><p><strong>Efficiency:</strong> models process far fewer tokens, reducing the chance of losing track of essential details.</p></li>
</ul>
<p>Milvus can search millions of documents in milliseconds, making this approach ideal for live systems where latency matters.</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3. Hybrid JIT and Vector Retrieval</h3><p>Vector search-based pre-retrieval addresses a significant part of context rot by ensuring the model starts with high-signal information rather than raw, oversized text. But Anthropic highlights two real challenges that teams often overlook:</p>
<ul>
<li><p><strong>Timeliness:</strong> If the knowledge base updates faster than the vector index is rebuilt, the model may rely on stale information.</p></li>
<li><p><strong>Accuracy:</strong> Before a task begins, it’s hard to predict precisely what the model will need—especially for multi-step or exploratory workflows.</p></li>
</ul>
<p>So in real world workloads, a hybrid appaorch is the optimal solution.</p>
<ul>
<li><p>Vector search for stable, high-confidence knowledge</p></li>
<li><p>Agent-driven JIT exploration for information that evolves or only becomes relevant mid-task</p></li>
</ul>
<p>By blending these two approaches, you get the speed and efficiency of vector retrieval for known information, and the flexibility for the model to discover and load new data whenever it becomes relevant.</p>
<p>Let’s look at how this works in a real system. Take a production documentation assistant, for example. Most teams eventually settle on a two-stage pipeline: Milvus-powered vector search + agent-based JIT retrieval.</p>
<p><strong>1. Milvus Powered Vector Search (Pre-retrieval)</strong></p>
<ul>
<li><p>Convert your documentation, API references, changelogs, and known issues into embeddings.</p></li>
<li><p>Store them in the Milvus Vector Database with metadata like product area, version, and update time.</p></li>
<li><p>When a user asks a question, run a semantic search to grab the top-K relevant segments.</p></li>
</ul>
<p>This resolves roughly 80% of routine queries in under 500 ms, giving the model a strong, context-rot-resistant starting point.</p>
<p><strong>2. Agent-Based Exploration</strong></p>
<p>When the initial retrieval isn’t sufficient—e.g., when the user asks for something highly specific or time-sensitive—the agent can call tools to fetch new information:</p>
<ul>
<li><p>Use <code translate="no">search_code</code> to locate specific functions or files in the codebase</p></li>
<li><p>Use <code translate="no">run_query</code> to pull real-time data from the database</p></li>
<li><p>Use <code translate="no">fetch_api</code> to obtain the latest system status</p></li>
</ul>
<p>These calls typically take <strong>3–5 seconds</strong>, but they ensure the model always works with fresh, accurate, and relevant data—even for questions the system couldn’t anticipate beforehand.</p>
<p>This hybrid structure ensures context remains timely, correct, and task-specific, dramatically reducing the risk of context rot in long-running agent workflows.</p>
<p>Milvus is especially effective in these hybrid scenarios because it supports:</p>
<ul>
<li><p><strong>Vector search + scalar filtering</strong>, combining semantic relevance with structured constraints</p></li>
<li><p><strong>Incremental updates</strong>, allowing embeddings to be refreshed without downtime</p></li>
</ul>
<p>This makes Milvus an ideal backbone for systems that need both semantic understanding and precise control over what gets retrieved.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>For example, you might run a query like:</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">How to Choose the Right Approach for Dealing With Context Rot<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>With vector-search pre-retrieval, Just-in-Time retrieval, and hybrid retrieval all available, the natural question is: <strong>which one should you use?</strong></p>
<p>Here is a simple but practical way to choose—based on how <em>stable</em> your knowledge is and how <em>predictable</em> the model’s information needs are.</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1. Vector Search → Best for Stable Domains</h3><p>If the domain changes slowly but demands precision—finance, legal work, compliance, medical documentation—then a Milvus-powered knowledge base with <strong>pre-retrieval</strong> is usually the right fit.</p>
<p>The information is well-defined, updates are infrequent, and most questions can be answered by retrieving semantically relevant documents upfront.</p>
<p><strong>Predictable tasks + stable knowledge → Pre-retrieval.</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2. Just-in-Time Retrieval → Best for Dynamic, Exploratory Workflows</h3><p>Fields like software engineering, debugging, analytics, and data science involve rapidly changing environments: new files, new data, new deployment states. The model can’t predict what it will need before the task starts.</p>
<p><strong>Unpredictable tasks + fast-changing knowledge → Just-in-Time retrieval.</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3. Hybrid Approach → When Both Conditions Are True</h3><p>Many real systems aren’t purely stable or purely dynamic. For example, developer documentation changes slowly, whereas the state of a production environment changes minute by minute. A hybrid approach lets you:</p>
<ul>
<li><p>Load known, stable knowledge using vector search (fast, low-latency)</p></li>
<li><p>Fetch dynamic information with agent tools on demand (accurate, up-to-date)</p></li>
</ul>
<p><strong>Mixed knowledge + mixed task structure → Hybrid retrieval approach.</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">What if the Context Window Still Isn’t Enough<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Context engineering helps reduce overload, but sometimes the problem is more fundamental: <strong>the task simply won’t fit</strong>, even with careful trimming.</p>
<p>Certain workflows—like migrating a large codebase, reviewing multi-repository architectures, or generating deep research reports—can exceed 200K+ context windows before the model reaches the end of the task. Even with vector search doing heavy lifting, some tasks require more persistent, structured memory.</p>
<p>Recently, Anthropic has offered three practical strategies.</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1. Compression: Preserve Signal, Drop Noise</h3><p>When the context window approaches its limit, the model can <strong>compress earlier interactions</strong> into concise summaries. Good compression keeps</p>
<ul>
<li><p>Key decisions</p></li>
<li><p>Constraints and requirements</p></li>
<li><p>Outstanding issues</p></li>
<li><p>Relevant samples or examples</p></li>
</ul>
<p>And removes:</p>
<ul>
<li><p>Verbose tool outputs</p></li>
<li><p>Irrelevant logs</p></li>
<li><p>Redundant steps</p></li>
</ul>
<p>The challenge is balance. Compress too aggressively, and the model loses critical information; compress too lightly, and you gain little space. Effective compression keeps the “why” and “what” while discarding the “how we got here.”</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2. Structured Note-Taking: Move Stable Information Outside Context</h3><p>Instead of keeping everything inside the model’s window, the system can store important facts in <strong>external memory</strong>—a separate database or a structured store that the agent can query as needed.</p>
<p>For example, Claude’s Pokémon-agent prototype stores durable facts like:</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>Meanwhile, transient details—battle logs, long tool outputs—stay outside the active context. This mirrors how humans use notebooks: we don’t keep every detail in our working memory; we store reference points externally and look them up when needed.</p>
<p>Structured note-taking prevents context rot caused by repeated, unnecessary details while giving the model a reliable source of truth.</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3. Sub-Agent Architecture: Divide and Conquer Large Tasks</h3><p>For complex tasks, a multi-agent architecture can be designed where a lead agent oversees the overall work, while several specialized sub-agents handle specific aspects of the task. These sub-agents dive deep into large amounts of data related to their sub-tasks but only return the concise, essential results. This approach is commonly used in scenarios like research reports or data analysis.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In practice, it’s best to start by using a single agent combined with compression to handle the task. External storage should only be introduced when there’s a need to retain memory across sessions. The multi-agent architecture should be reserved for tasks that genuinely require parallel processing of complex, specialized sub-tasks.</p>
<p>Each approach extends the system’s effective “working memory” without blowing the context window—and without triggering context rot.</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">Best Practices for Designing Context That Actually Works<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>After handling context overflow, there’s another equally important piece: how the context is built in the first place. Even with compression, external notes, and sub-agents, the system will struggle if the prompt and tools themselves aren’t designed to support long, complex reasoning.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic offers a helpful way to think about this—less as a single prompt-writing exercise, and more as constructing context across three layers.</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>System Prompts: Find the Goldilocks Zone</strong></h3><p>Most system prompts fail at the extremes. Too much detail—lists of rules, nested conditions, hard-coded exceptions—makes the prompt brittle and difficult to maintain. Too little structure leaves the model guessing what to do.</p>
<p>The best prompts sit in the middle: structured enough to guide behavior, flexible enough for the model to reason. In practice, this means giving the model a clear role, a general workflow, and light tool guidance—nothing more, nothing less.</p>
<p>For example:</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>This prompt sets direction without overwhelming the model or forcing it to juggle dynamic information that doesn’t belong here.</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">Tool Design: Less Is More</h3><p>Once the system prompt sets the high-level behavior, tools carry the actual operational logic. A surprisingly common failure mode in tool-augmented systems is simply having too many tools—or having tools whose purposes overlap.</p>
<p>A good rule of thumb:</p>
<ul>
<li><p><strong>One tool, one purpose</strong></p></li>
<li><p><strong>Explicit, unambiguous parameters</strong></p></li>
<li><p><strong>No overlapping responsibilities</strong></p></li>
</ul>
<p>If a human engineer would hesitate about which tool to use, the model will too. Clean tool design reduces ambiguity, lowers cognitive load, and prevents context from being cluttered with unnecessary tool attempts.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">Dynamic Information Should Be Retrieved, Not Hardcoded</h3><p>The final layer is the easiest to overlook. Dynamic or time-sensitive information—such as status values, recent updates, or user-specific state—should not appear in the system prompt at all. Baking it into the prompt guarantees it will become stale, bloated, or contradictory over long tasks.</p>
<p>Instead, this information should be fetched only when needed, either through retrieval or via agent tools. Keeping dynamic content out of the system prompt prevents context rot and keeps the model’s reasoning space clean.</p>
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
    </button></h2><p>As AI agents move into production environments across different industries, they’re taking on longer workflows and more complex tasks than ever before. In these settings, managing context becomes a practical necessity.</p>
<p><strong>However, a bigger context window doesn’t automatically produce better results</strong>; in many cases, it does the opposite. When a model is overloaded, fed stale information, or forced through massive prompts, accuracy quietly drifts. That slow, subtle decline is what we now call <strong>context rot</strong>.</p>
<p>Techniques like JIT retrieval, pre-retrieval, hybrid pipelines, and vector-database-powered semantic search all aim at the same goal: <strong>making sure the model sees the right information at the right moment — no more, no less — so it can stay grounded and produce reliable answers.</strong></p>
<p>As an open-source, high-performance vector database, <a href="https://milvus.io/"><strong>Milvus</strong></a> sits at the core of this workflow. It provides the infrastructure for storing knowledge efficiently and retrieving the most relevant pieces with low latency. Paired with JIT retrieval and other complementary strategies, Milvus helps AI agents remain accurate as their tasks become deeper and more dynamic.</p>
<p>But retrieval is only one piece of the puzzle. Good prompt design, a clean and minimal toolset, and sensible overflow strategies — whether compression, structured notes, or sub-agents — all work together to keep the model focused across long-running sessions. This is what real context engineering looks like: not clever hacks, but thoughtful architecture.</p>
<p>If you want AI agents that stay accurate over hours, days, or entire workflows, context deserves the same attention you’d give to any other core part of your stack.</p>
<p>Have questions or want a deep dive on any feature? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
