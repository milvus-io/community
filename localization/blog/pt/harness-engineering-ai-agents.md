---
id: harness-engineering-ai-agents.md
title: |
  Harness Engineering: The Execution Layer AI Agents Actually Need
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >
  Harness Engineering builds the execution environment around autonomous AI
  agents. Learn what it is, how OpenAI used it, and why it requires hybrid
  search.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto built HashiCorp and co-created Terraform. In February 2026, he published a <a href="https://mitchellh.com/writing/my-ai-adoption-journey">blog post</a> describing a habit he’d developed while working with AI agents: every time an agent made a mistake, he engineered a permanent fix into the agent’s environment. He called it “engineering the harness.” Within weeks, <a href="https://openai.com/index/harness-engineering/">OpenAI</a> and <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic</a> published engineering articles expanding on the idea. The term <em>Harness Engineering</em> had arrived.</p>
<p>It resonated because it names a problem every engineer building <a href="https://zilliz.com/glossary/ai-agents">AI agents</a> has already hit. <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">Prompt engineering</a> gets you better single-turn outputs. Context engineering manages what the model sees. But neither addresses what happens when an agent runs autonomously for hours, making hundreds of decisions without supervision. That’s the gap Harness Engineering fills — and it almost always depends on hybrid search (hybrid full-text and semantic search) to work.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">What Is Harness Engineering?<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Harness Engineering is the discipline of designing the execution environment around an autonomous AI agent. It defines which tools the agent can call, where it gets information, how it validates its own decisions, and when it should stop.</p>
<p>To understand why it matters, consider three layers of AI agent development:</p>
<table>
<thead>
<tr><th>Layer</th><th>What It Optimizes</th><th>Scope</th><th>Example</th></tr>
</thead>
<tbody>
<tr><td><strong>Prompt Engineering</strong></td><td>What you say to the model</td><td>Single exchange</td><td>Few-shot examples, chain-of-thought prompts</td></tr>
<tr><td><strong>Context Engineering</strong></td><td>What the model can see</td><td><a href="https://zilliz.com/glossary/context-window">Context window</a></td><td>Document retrieval, history compression</td></tr>
<tr><td><strong>Harness Engineering</strong></td><td>The world the agent operates in</td><td>Multi-hour autonomous execution</td><td>Tools, validation logic, architectural constraints</td></tr>
</tbody>
</table>
<p><strong>Prompt Engineering</strong> optimizes the quality of a single exchange — phrasing, structure, examples. One conversation, one output.</p>
<p><strong>Context Engineering</strong> manages how much information the model can see at once — which documents to retrieve, how to compress history, what fits in the context window and what gets dropped.</p>
<p><strong>Harness Engineering</strong> builds the world the agent operates in. Tools, knowledge sources, validation logic, architectural constraints — everything that determines whether an agent can run reliably across hundreds of decisions without human supervision.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
    <span>Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment</span>
  </span>
</p>
<p>The first two layers shape the quality of a single turn. The third shapes whether an agent can operate for hours without you watching.</p>
<p>These aren’t competing approaches. They’re a progression. As agent capability grows, the same team moves through all three — often within a single project.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">How OpenAI Used Harness Engineering to Build a Million-Line Codebase and Lessons They Learnt<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI ran an internal experiment that puts Harness Engineering in concrete terms. They described it in their engineering blog post, <a href="https://openai.com/index/harness-engineering/">“Harness Engineering: Leveraging Codex in an Agent-First World”</a>. A three-person team started with an empty repository in late August 2025. For five months, they wrote no code themselves — every line was generated by Codex, OpenAI’s AI-powered coding agent. The result: one million lines of production code and 1,500 merged pull requests.</p>
<p>The interesting part isn’t the output. It’s the four problems they hit and the harness-layer solutions they built.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">Problem 1: No Shared Understanding of the Codebase</h3><p>What abstraction layer should the agent use? What are the naming conventions? Where did last week’s architecture discussion land? Without answers, the agent guessed — and guessed wrong — repeatedly.</p>
<p>The first instinct was a single <code translate="no">AGENTS.md</code> file containing every convention, rule, and historical decision. It failed for four reasons. Context is scarce, and a bloated instruction file crowded out the actual task. When everything is marked important, nothing is. Documentation rots — rules from week two become wrong by week eight. And a flat document can’t be mechanically verified.</p>
<p>The fix: shrink <code translate="no">AGENTS.md</code> to 100 lines. Not rules — a map. It points to a structured <code translate="no">docs/</code> directory containing design decisions, execution plans, product specs, and reference docs. Linters and CI verify that cross-links stay intact. The agent navigates to exactly what it needs.</p>
<p>The underlying principle: if something isn’t in context at runtime, it doesn’t exist for the agent.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">Problem 2: Human QA Couldn’t Keep Pace with Agent Output</h3><p>The team plugged Chrome DevTools Protocol into Codex. The agent could screenshot UI paths, observe runtime events, and query logs with LogQL and metrics with PromQL. They set a concrete threshold: a service had to start in under 800 milliseconds before a task was considered complete. Codex tasks ran for over six hours at a stretch — typically while engineers slept.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">Problem 3: Architectural Drift Without Constraints</h3><p>Without guardrails, the agent reproduced whatever patterns it found in the repo — including bad ones.</p>
<p>The fix: strict layered architecture with a single enforced dependency direction — Types → Config → Repo → Service → Runtime → UI. Custom linters enforced these rules mechanically, with error messages that included the fix instruction inline.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
    <span>Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions</span>
  </span>
</p>
<p>In a human team, this constraint usually arrives when a company scales to hundreds of engineers. For a coding agent, it’s a prerequisite from day one. The faster an agent moves without constraints, the worse the architectural drift.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">Problem 4: Silent Technical Debt</h3><p>The solution: encode the project’s core principles into the repository, then run background Codex tasks on a schedule to scan for deviations and submit refactoring PRs. Most merged automatically within a minute — small continuous payments rather than periodic reckoning.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">Why AI Agents Can’t Grade Their Own Work<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI’s experiment proved Harness Engineering works. But separate research exposed a failure mode inside it: agents are systematically bad at evaluating their own output.</p>
<p>The problem appears in two forms.</p>
<p><strong>Context anxiety.</strong> As the context window fills, agents begin wrapping up tasks prematurely — not because the work is done, but because they sense the window limit approaching. Cognition, the team behind the AI coding agent Devin, <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">documented this behavior</a> while rebuilding Devin for Claude Sonnet 4.5: the model became aware of its own context window and started taking shortcuts well before actually running out of room.</p>
<p>Their fix was pure harness engineering. They enabled the 1M-token context beta but capped actual usage at 200K tokens — tricking the model into believing it had ample runway. The anxiety vanished. No model change required; just a smarter environment.</p>
<p>The most common general mitigation is compaction: summarize history and let the same agent continue with compressed context. This preserves continuity but doesn’t eliminate the underlying behavior. An alternative is context reset: clear the window, spin up a fresh instance, and hand off state through a structured artifact. This removes the anxiety trigger entirely but demands a complete handoff document — gaps in the artifact mean gaps in the new agent’s understanding.</p>
<p><strong>Self-evaluation bias.</strong> When agents assess their own output, they score it high. Even on tasks with objective pass/fail criteria, the agent spots a problem, talks itself into believing it’s not serious, and approves work that should fail.</p>
<p>The fix borrows from GANs (Generative Adversarial Networks): separate the generator from the evaluator completely. In a GAN, two neural networks compete — one generates, one judges — and that adversarial tension forces quality up. The same dynamic applies to <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">multi-agent systems</a>.</p>
<p>Anthropic tested this with a three-agent harness — Planner, Generator, Evaluator — against a solo agent on the task of building a 2D retro game engine. They describe the full experiment in <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">“Harness Design for Long-Running Application Development”</a> (Anthropic, 2026). The Planner expands a short prompt into a full product spec, deliberately leaving implementation details unspecified — early over-specification cascades into downstream errors. The Generator implements features in sprints, but before writing code, it signs a sprint contract with the Evaluator: a shared definition of “done.” The Evaluator uses Playwright (Microsoft’s open-source browser automation framework) to click through the application like a real user, testing UI, API, and database behavior. If anything fails, the sprint fails.</p>
<p>The solo agent produced a game that technically launched, but entity-to-runtime connections were broken at the code level — discoverable only by reading the source. The three-agent harness produced a playable game with AI-assisted level generation, sprite animation, and sound effects.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
    <span>Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features</span>
  </span>
</p>
<p>The three-agent architecture cost roughly 20x more. The output crossed from unusable to usable. That’s the core trade Harness Engineering makes: structural overhead in exchange for reliability.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">The Retrieval Problem Inside Every Agent Harness<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>Both patterns — the structured <code translate="no">docs/</code> system and the Generator/Evaluator sprint cycle — share a silent dependency: the agent must find the right information from a live, evolving knowledge base when it needs it.</p>
<p>This is harder than it looks. Take a concrete example: the Generator is executing Sprint 3, implementing user authentication. Before writing code, it needs two kinds of information.</p>
<p>First, a <a href="https://zilliz.com/glossary/semantic-search">semantic search</a> query: <em>what are this product’s design principles around user sessions?</em> The relevant document might use “session management” or “access control” — not “user authentication.” Without semantic understanding, retrieval misses it.</p>
<p>Second, an exact-match query: <em>which documents reference the <code translate="no">validateToken</code> function?</em> A function name is an arbitrary string with no semantic meaning. <a href="https://zilliz.com/glossary/vector-embeddings">Embedding-based retrieval</a> can’t reliably find it. Only keyword matching works.</p>
<p>These two queries happen simultaneously. They can’t be separated into sequential steps.</p>
<p>Pure <a href="https://zilliz.com/learn/vector-similarity-search">vector search</a> fails on exact match. Traditional <a href="https://milvus.io/docs/embed-with-bm25.md">BM25</a> fails on semantic queries and can’t predict which vocabulary a document will use. Before Milvus 2.5, the only option was two parallel retrieval systems — a vector index and a <a href="https://milvus.io/docs/full-text-search.md">full-text index</a> — running concurrently at query time with custom result-fusion logic. For a live <code translate="no">docs/</code> repository with continuous updates, both indexes had to stay in sync: every document change triggered reindexing in two places, with the constant risk of inconsistency.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">How Milvus 2.6 Solves Agent Retrieval with a Single Hybrid Pipeline<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is an open-source <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> designed for AI workloads. Milvus 2.6’s Sparse-BM25 collapses the dual-pipeline retrieval problem into a single system.</p>
<p>At ingest, Milvus generates two representations simultaneously: a <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">dense embedding</a> for semantic retrieval and a <a href="https://milvus.io/docs/sparse_vector.md">TF-encoded sparse vector</a> for BM25 scoring. Global <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">IDF statistics</a> update automatically as documents are added or removed — no manual reindex triggers. At query time, a natural-language input generates both query vector types internally. <a href="https://milvus.io/docs/rrf-ranker.md">Reciprocal Rank Fusion (RRF)</a> merges the ranked results, and the caller receives a single unified result set.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
    <span>Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results</span>
  </span>
</p>
<p>One interface. One index to maintain.</p>
<p>On the <a href="https://zilliz.com/glossary/beir">BEIR benchmark</a> — a standard evaluation suite covering 18 heterogeneous retrieval datasets — Milvus achieves 3–4x higher throughput than Elasticsearch at equivalent recall, with up to 7x QPS improvement on specific workloads. For the sprint scenario, a single query finds both the session design principle (semantic path) and every document mentioning <code translate="no">validateToken</code> (exact path). The <code translate="no">docs/</code> repository updates continuously; BM25 IDF maintenance means a newly written document participates in the next query’s scoring without any batch rebuild.</p>
<p>This is the retrieval layer built for exactly this class of problem. When an agent harness needs to search a living knowledge base — code documentation, design decisions, sprint history — single-pipeline hybrid search isn’t a nice-to-have. It’s what makes the rest of the harness work.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">The Best Harness Components Are Designed to Be Deleted<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>Every component in a harness encodes an assumption about model limitations. Sprint decomposition was necessary when models lost coherence on long tasks. Context reset was necessary when models experienced anxiety near the window limit. Evaluator agents became necessary when self-evaluation bias was unmanageable.</p>
<p>These assumptions expire. Cognition’s context-window trick may become unnecessary as models develop genuine long-context stamina. As models continue to improve, other components will become unnecessary overhead that slows agents down without adding reliability.</p>
<p>Harness Engineering isn’t a fixed architecture. It’s a system recalibrated with every new model release. The first question after any major upgrade isn’t “what can I add?” It’s “what can I remove?”</p>
<p>The same logic applies to retrieval. As models handle longer contexts more reliably, chunking strategies and retrieval timing will shift. Information that needs careful fragmentation today may be ingestible as full pages tomorrow. The retrieval infrastructure adapts alongside the model.</p>
<p>Every component in a well-built harness is waiting to be made redundant by a smarter model. That’s not a problem. That’s the goal.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Get Started with Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>If you’re building agent infrastructure that needs hybrid retrieval — semantic and keyword search in one pipeline — here’s where to start:</p>
<ul>
<li>Read the <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6 release notes</strong></a> for full details on Sparse-BM25, automatic IDF maintenance, and performance benchmarks.</li>
<li>Join the <a href="https://milvus.io/community"><strong>Milvus community</strong></a> to ask questions and share what you’re building.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Book a free Milvus Office Hours session</strong></a> to walk through your use case with a vector database expert.</li>
<li>If you’d rather skip infrastructure setup, <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> (fully managed Milvus) offers a free tier to get started with $100 free credits upon registration with work email.</li>
<li>Star us on GitHub: <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> — 43k+ stars and growing.</li>
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">What is harness engineering and how is it different from prompt engineering?</h3><p>Prompt engineering optimizes what you say to a model in a single exchange — phrasing, structure, examples. Harness Engineering builds the execution environment around an autonomous AI agent: the tools it can call, the knowledge it can access, the validation logic that checks its work, and the constraints that prevent architectural drift. Prompt engineering shapes one conversation turn. Harness Engineering shapes whether an agent can operate reliably for hours across hundreds of decisions without human supervision.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">Why do AI agents need both vector search and BM25 at the same time?</h3><p>Agents must answer two fundamentally different retrieval queries simultaneously. Semantic queries — <em>what are our design principles around user sessions?</em> — require dense vector embeddings to match conceptually related content regardless of vocabulary. Exact-match queries — <em>which documents reference the <code translate="no">validateToken</code> function?</em> — require BM25 keyword scoring, because function names are arbitrary strings with no semantic meaning. A retrieval system that handles only one mode will systematically miss queries of the other type.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">How does Milvus Sparse-BM25 work for agent knowledge retrieval?</h3><p>At ingest, Milvus generates a dense embedding and a TF-encoded sparse vector for each document simultaneously. Global IDF statistics update in real time as the knowledge base changes — no manual reindexing required. At query time, both vector types are generated internally, Reciprocal Rank Fusion merges the ranked results, and the agent receives a single unified result set. The entire pipeline runs through one interface and one index — critical for continuously updated knowledge bases like a code documentation repository.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">When should I add an evaluator agent to my agent harness?</h3><p>Add a separate Evaluator when your Generator’s output quality cannot be verified by automated tests alone, or when self-evaluation bias has caused missed defects. The key principle: the Evaluator must be architecturally separate from the Generator — shared context reintroduces the same bias you’re trying to eliminate. The Evaluator should have access to runtime tools (browser automation, API calls, database queries) to test behavior, not just review code. Anthropic’s <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">research</a> found that this GAN-inspired separation moved output quality from “technically launches but broken” to “fully functional with features the solo agent never attempted.”</p>
