---
id: when-ai-agents-do-the-work-what-do-we-lose.md
title: |
  When AI Agents Do the Work, What Do We Lose?
author: Bill Chen
date: 2026-06-18T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jun_21_2026_10_34_48_PM_d223e44fc5.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'AI agents, agentic AI, AI coding agents, agent memory, LLM agents'
meta_title: |
  When AI Agents Do the Work, What Do We Lose?
desc: >
  AI agents are getting better at execution, memory, and standards. But if they
  remove the learning loop behind work, human judgment may stop improving.
origin: 'https://milvus.io/blog/when-ai-agents-do-the-work-what-do-we-lose.md'
---
<p>Agent products are getting very good at doing the work.</p>
<p>Claude Code can write and refactor large chunks of code. Cursor can help developers move through codebases faster. Devin and other task-oriented agents try to take over longer workflows. Outside of coding, agents draft emails, process documents, summarize data, update tickets, and automate repetitive tasks that used to require direct human effort.</p>
<p>Most of these products make the same promise: give the agent enough context, and it will handle more of the execution for you. That promise is useful, but it also creates a question agent products have not fully answered: <strong>when the agent does more of the work, what do we lose?</strong></p>
<p>The answer is not simply “manual effort.” The task may be completed, but the human may have skipped part of the process that used to build judgment: reading, tracing, debugging, comparing options, making mistakes, and learning why one solution is better than another.</p>
<p>This does not mean agents are bad for learning. It means agent products need to be designed with learning in mind. If they only optimize for output, they may remove the very experience that helps humans improve the standards agents depend on.</p>
<p>A useful way to think about this problem is to borrow the autonomy ladder from self-driving systems. The analogy is not perfect, but it helps separate different kinds of progress in agent products:</p>
<ul>
<li><strong>L1 agents execute tasks.</strong> The human gives instructions, and the agent carries them out.</li>
<li><strong>L2 agents remember.</strong> They learn across sessions by storing preferences, corrections, and project context.</li>
<li><strong>L3 agents apply standards.</strong> The human defines rules, constraints, and decision criteria instead of guiding every step.</li>
<li><strong>L4 agents improve the human.</strong> The agent does not just do the work. It helps the human preserve and deepen judgment.</li>
</ul>
<p>Most of the industry is still focused on the first three levels. That makes sense. Execution, memory, and standards are immediate product problems. But L4 is where the long-term risk appears. If humans stop improving, the standards guiding agents stop improving too.</p>
<h2 id="L1-Agents-execute" class="common-anchor-header">L1: Agents execute<button data-href="#L1-Agents-execute" class="anchor-icon" translate="no">
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
    </button></h2><p>AI application development has moved through several layers of abstraction:</p>
<ul>
<li>At first, developers called a model through an API: send text, get text back.</li>
<li>Then came <strong>prompt engineering</strong>, where the main skill was learning how to ask better questions.</li>
<li>After that came <strong>context engineering</strong>, where the task became giving the model enough examples, constraints, and background to behave usefully in a specific situation.</li>
<li>Then came <strong>harness engineering</strong>: connecting models to tools, workflows, files, databases, browsers, terminals, and production systems.</li>
<li><strong>Agent engineering</strong> builds on top of that. Instead of asking the model to answer one prompt, we ask it to plan steps, choose tools, inspect results, recover from errors, and complete multi-step tasks with less supervision.</li>
</ul>
<p>The technical surface keeps changing, but the basic relationship at L1 stays the same: <strong>the human defines the task, and the agent carries it out.</strong> Each interaction is still mostly self-contained. The task is done, the session ends, and the next task starts from scratch.</p>
<p>This level already works well enough to change behavior. Agents can handle more execution with less manual effort. As they become cheaper, faster, and more reliable, output rises while cost drops.</p>
<p>But easier execution creates a new bottleneck. Every parallel session still needs a human to explain the task, provide context, review the output, judge quality, and decide what to do next. The agent may be doing the work, but the human is still responsible for knowing whether the work is good.</p>
<p><strong>Execution becomes cheaper. Judgment becomes more important.</strong></p>
<h2 id="L2-Agents-remember" class="common-anchor-header">L2: Agents remember<button data-href="#L2-Agents-remember" class="anchor-icon" translate="no">
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
    </button></h2><p>L1 solves the task in front of it. L2 asks a different question: <strong>can the agent learn from this interaction so the next one goes better?</strong></p>
<p>A pure L1 agent is stateless. Once the session ends, the context disappears. The next task starts from scratch. L2 agents break that pattern by accumulating experience across sessions. They remember user preferences, project conventions, recurring feedback, previous decisions, and patterns in how the user works. <strong>The goal is to turn the experience generated through human-agent interaction into a reusable asset.</strong></p>
<p>This is also why agent memory should not be treated as a longer prompt or a folder of saved transcripts. Useful memory needs infrastructure: durable storage, semantic retrieval, deduplication, updates, and a way to separate stale context from still-useful knowledge. This is where our work at <a href="https://zilliz.com/">Zilliz</a> connects to the problem. <a href="https://milvus.io/">Milvus</a>, and its managed services Zilliz Cloud built around it, are often used as the retrieval layer for agent memory because they make past context searchable instead of merely archived.</p>
<p><strong>But L2 memory has a structural limit.</strong> Most of what agents learn at this stage comes from observable behavior: what the user said, changed, accepted, rejected, or corrected. An agent may remember that you rewrote a paragraph, rejected an implementation, or changed a function signature. It may not understand why.</p>
<p>Was the issue accuracy, tone, maintainability, security risk, performance, product positioning, or something else? Behavior is the visible surface of judgment. The reasoning underneath often remains hidden.</p>
<p>That makes L2 better at capturing explicit knowledge than tacit knowledge. It can remember rules you stated directly and store examples of past decisions. But examples do not automatically become principles. The agent may remember what happened without understanding the standard behind it.</p>
<p>That gap leads to L3.</p>
<h2 id="L3-Agents-apply-standards" class="common-anchor-header">L3: Agents apply standards<button data-href="#L3-Agents-apply-standards" class="anchor-icon" translate="no">
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
    </button></h2><p>Once L1 and L2 start working, the obvious next step is parallelism.</p>
<p>If one agent can complete a task, why not run ten? If an agent can learn from one session, why not open many sessions and let them all produce work at once? This is the “10x engineer” or “100x engineer” logic: use agents to multiply output.</p>
<p>In practice, parallelism creates its own cost. Every session still requires the human to switch context, understand the problem, review the work, give feedback, and decide whether the result is good enough. Past a certain point, more agents stop feeling like leverage and start feeling like overhead.</p>
<p>This is not just a workflow problem. It is a cognitive wall. Humans do not handle parallel tasks the way machines do. Task switching burns attention. Working memory is limited. Each switch increases the chance of missing details, applying the wrong standard, or approving work too quickly.</p>
<p><strong>A good product should not fight this limit. It should be designed around it.</strong></p>
<p>At L3, the input changes from “solve this specific problem in this specific way” to “here are the standards you should apply.” The human stops being the operator who guides every step and becomes the person who defines rules, constraints, preferences, quality bars, and decision criteria.</p>
<p>A user may still guide an agent through a specific task, but the value of that guidance should not die with the session. The interaction should leave behind a reusable standard, not just a transcript. Next time a similar task appears, the agent should apply the standard without asking the human to reconstruct the full context and remake the same judgment.</p>
<p>The industry is already moving in this direction. Many agent products let users define rules, instructions, memories, project conventions, and behavior preferences. The direction is right, but most implementations are still early. Rules are often static text: manually updated, fragmented, and only loosely connected to the reasoning behind a user’s decisions.</p>
<p>The stronger pattern is a continuously updated personal cognition model: a machine-readable representation of how a person judges, decides, and makes trade-offs. It should encode preferences, values, constraints, exceptions, standards, and decision style as context that agents can retrieve and apply.</p>
<p>Instead of merely storing past conversations, it should make the user’s thinking legible to machines.</p>
<p>The user’s job changes accordingly. Instead of explaining every task from scratch, the user maintains the model by refining standards, updating preferences, correcting assumptions, and making implicit judgment explicit. In a sense, the user is continuously tokenizing themselves: converting more of their thinking into a form agents can use.</p>
<p>When execution is cheap, the human does not need to decide every implementation detail before a task starts. The human needs to define what good looks like, what is unacceptable, and how trade-offs should be handled.</p>
<h2 id="L4-Agents-preserve-human-learning" class="common-anchor-header">L4: Agents preserve human learning<button data-href="#L4-Agents-preserve-human-learning" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>The first three levels focus on making agents serve humans better. L4 reverses the question: how can agents help humans get better?</strong></p>
<p>This is the part most agent products have not fully confronted. When agents do more of the work for us, what exactly disappears from the human side of the loop?</p>
<p>On the surface, we lose manual effort. That is the obvious benefit. But we may also lose three less visible things: situated memory of the work, practice in making trade-offs, and the pattern recognition that comes from repeated exposure to messy details.</p>
<p><strong>I have felt this directly in coding.</strong> When I wrote code myself, I remembered where each line lived and how the system worked because I had spent time reading, debugging, tracing, and fixing it by hand. That process did not just produce code. It trained my brain to recognize structure.</p>
<p>With Claude Code, the code still gets produced, often faster. But after a while, my memory of the system is not as deep. I may know what the system does, but I do not always remember how each part came together. The experience of building gets compressed, and some of the learning disappears with it.</p>
<p>That is not an argument against coding agents. It is an argument that agent products need to preserve the parts of work that build human judgment.</p>
<p>The same pattern appears outside coding. If an agent drafts every strategy memo, the human may lose practice structuring an argument. If an agent summarizes every paper, the human may lose the habit of noticing what the summary left out. If an agent handles every operational decision, the human may stop developing the intuition that comes from dealing with messy exceptions.</p>
<p>The work disappears. The output remains. But the learning loop may weaken.</p>
<p>That is the L4 problem.</p>
<h2 id="Human-judgment-is-the-ceiling" class="common-anchor-header">Human judgment is the ceiling<button data-href="#Human-judgment-is-the-ceiling" class="anchor-icon" translate="no">
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
    </button></h2><p>The loss matters because agents do not operate in a vacuum. An agent is a multiplier, not a replacement. The same tool produces very different results in the hands of an expert and a beginner. A senior engineer with an agent may become dramatically more effective. A beginner may simply produce more output without developing better judgment.</p>
<p>Agents amplify the user’s existing cognitive level.</p>
<p>That matters because L3 depends on humans defining the standards agents should follow. But the quality of those standards depends on the quality of human judgment. If the human stops improving, the standards eventually go stale. They become incomplete, shallow, or misaligned with the current reality of the work.</p>
<p>The system works best as a loop:</p>
<ul>
<li>Human judgment defines the standards.</li>
<li>Agents execute within those standards.</li>
<li>Execution results feed back into human learning.</li>
<li>Human learning improves the standards.</li>
</ul>
<p>If the loop works, both sides get better. The agent executes more effectively, and the human becomes better at defining what effective means. If the loop breaks, the system degrades. Human judgment stagnates. Standards become outdated. Agents keep optimizing, but they optimize inside a framework that is slowly falling behind.</p>
<p>This is why human judgment is the ceiling. Stronger agents do not remove the need for stronger humans. They make the quality of human judgment more important, because that judgment becomes the framework inside which the agent operates.</p>
<h2 id="Why-agents-cannot-solve-the-whole-problem-alone" class="common-anchor-header">Why agents cannot solve the whole problem alone<button data-href="#Why-agents-cannot-solve-the-whole-problem-alone" class="anchor-icon" translate="no">
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
    </button></h2><p>One response is obvious: agents will keep getting stronger, so perhaps they will eventually generate better knowledge, better rules, and better standards on their own.</p>
<p>There is truth in that. Agents are already strong at combining ideas, exploring solution spaces, and surfacing paths humans may not have considered. A model can produce sentences, designs, and solutions that never appeared in its training data. It can recombine patterns across domains and generate useful alternatives.</p>
<p>That is real value. But L4 is concerned with a different kind of creation. The question is not only who can find a better answer. It is who can ask a new question, rewrite the standard, or expand the problem space.</p>
<p>Agents are strong at generalizing, combining, and searching within an existing distribution. They can find better paths through known terrain, sometimes paths humans have not tried. But deciding whether the terrain itself should be redrawn is different.</p>
<p>That kind of decision often comes from human context: lived constraints, personal stakes, curiosity, dissatisfaction, and the cost of being wrong. A person can form a hypothesis that violates the current framework and test it against reality. More importantly, a person can have a reason to keep testing when the idea looks wrong, risky, or useless at first.</p>
<p>Non-Euclidean geometry is a useful example. The important step was not merely asking, “What if parallel lines intersect?” An agent could generate that sentence. The important step was treating the strange assumption as worth investigating, then following its consequences until it became a new theoretical space. That required persistence, stakes, and a reason to care about the outcome.</p>
<p>Margaret Boden’s creativity framework is useful here. She distinguishes between three kinds of creativity:</p>
<ul>
<li><strong>Combinational creativity:</strong> combining familiar ideas in new ways.</li>
<li><strong>Exploratory creativity:</strong> searching within an existing conceptual space.</li>
<li><strong>Transformational creativity:</strong> changing the rules of the conceptual space itself.</li>
</ul>
<p>Agents are already strong in the first two modes. They combine existing ideas and explore within existing conceptual spaces. The third mode is harder. Transformational creativity depends on more than faster search. It depends on why someone chooses to reject an old rule, accept the cost of failure, and keep testing an idea that does not yet fit.</p>
<p><strong>The more precise claim is this: agents are strongest at combining and exploring within existing spaces. New foundational knowledge, new problem spaces, and new value frameworks still depend heavily on humans.</strong></p>
<h2 id="Design-for-the-loop-not-just-the-output" class="common-anchor-header">Design for the loop, not just the output<button data-href="#Design-for-the-loop-not-just-the-output" class="anchor-icon" translate="no">
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
    </button></h2><p>Not every agent product needs to solve L4. Some products only need to help users get tasks done faster. That is fine. Others need memory, standards, and better workflow integration.</p>
<p>But at the ecosystem level, some products need to preserve the learning loop. If every agent product helps people do less of the work, and none helps people keep learning after they stop doing the work directly, human capacity weakens over time. The optimization space for agents stops expanding. The whole system remains bounded by today’s level of human judgment.</p>
<p>This is where product design matters. L4 is not just asking the agent to summarize what it did. A useful L4 product preserves the parts of work that build human judgment, even when the agent handles most of the execution.</p>
<p>A few product patterns matter here:</p>
<ul>
<li><strong>Preserve key judgment points.</strong> Some decisions should stay visible to the human, not because the agent cannot make them, but because those decisions train judgment. The product should identify which moments matter and keep them deliberate.</li>
<li><strong>Reconstruct the process, not just the result.</strong> A finished artifact is not enough. The system should surface key decision branches, trade-offs, alternative paths, and failed attempts. A user who only sees the output can approve or reject it. A user who sees the reasoning path can update their mental model.</li>
<li><strong>Support collaborative exploration.</strong> When the user is uncertain, the agent should not jump straight to an answer. It should help expand the problem space: what dimensions matter, what assumptions are missing, what information is still needed, and what costs each option carries.</li>
<li><strong>Challenge human assumptions.</strong> This does not mean pushing back for the sake of disagreement. It means recognizing gaps or tensions in the user’s thinking and asking targeted questions that make those tensions visible.</li>
</ul>
<p>The goal is not to force humans back into every manual step. That would defeat the purpose of agents. The goal is to preserve the parts of work that turn experience into judgment.</p>
<p>Agent products should not only optimize for output. They should optimize for the feedback loop: better human judgment, better standards, better agent execution, and better human learning from the results.</p>
<p><strong>When AI agents do the work, we should not lose the loop that made humans better at the work in the first place.</strong></p>
<h2 id="We’d-love-to-hear-your-thoughts" class="common-anchor-header">We’d love to hear your thoughts<button data-href="#We’d-love-to-hear-your-thoughts" class="anchor-icon" translate="no">
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
    </button></h2><p>If you are building agents, I would love to hear how you think about this: what parts of the work should agents fully take over, and what parts should remain visible because they help humans keep getting better?</p>
