---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: |
  Stop Building Vanilla RAG: Embrace Agentic RAG with DeepSearcher
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">The Shift to AI-Powered Search with LLMs and Deep Research<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>The evolution of search technology has progressed dramatically over the decades—from keyword-based retrieval in the pre-2000s to personalized search experiences in the 2010s. We’re witnessing the emergence of AI-powered solutions capable of handling complex queries requiring in-depth, professional analysis.</p>
<p>OpenAI’s Deep Research exemplifies this shift, using reasoning capabilities to synthesize large amounts of information and generate multi-step research reports. For example, when asked about “What is Tesla’s reasonable market cap?” Deep Research can comprehensively analyze corporate finances, business growth trajectories, and market value estimations.</p>
<p>Deep Research implements an advanced form of the RAG (Retrieval-Augmented Generation) framework at its core. Traditional RAG enhances language model outputs by retrieving and incorporating relevant external information. OpenAI’s approach takes this further by implementing iterative retrieval and reasoning cycles. Instead of a single retrieval step, Deep Research dynamically generates multiple queries, evaluates intermediate results, and refines its search strategy—demonstrating how advanced or agentic RAG techniques can deliver high-quality, enterprise-level content that feels more like professional research than simple question-answering.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher: A Local Deep Research Bringing Agentic RAG to Everyone<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>Inspired by these advancements, developers worldwide have been creating their own implementations. Zilliz engineers built and open-sourced the <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> project, which can be considered a local and open-source Deep Research. This project has garnered over 4,900 GitHub stars in less than a month.</p>
<p>DeepSearcher redefines AI-powered enterprise search by combining the power of advanced reasoning models, sophisticated search features, and an integrated research assistant. Integrating local data via <a href="https://milvus.io/docs/overview.md">Milvus</a> (a high-performance and open-source vector database), DeepSearcher delivers faster, more relevant results while allowing users to swap core models for a customized experience easily.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1:</em> <em>DeepSearcher’s star history (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>Source</em></a><em>)</em></p>
<p>In this article, we’ll explore the evolution from traditional RAG to Agentic RAG, exploring what specifically makes these approaches different on a technical level. We’ll then discuss DeepSearcher’s implementation, showing how it leverages intelligent agent capabilities to enable dynamic, multi-turn reasoning—and why this matters for developers building enterprise-level search solutions.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">From Traditional RAG to Agentic RAG: The Power of Iterative Reasoning<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Agentic RAG enhances the traditional RAG framework by incorporating intelligent agent capabilities. DeepSearcher is a prime example of an agentic RAG framework. Through dynamic planning, multi-step reasoning, and autonomous decision-making, it establishes a closed-loop process that retrieves, processes, validates, and optimizes data to solve complex problems.</p>
<p>The growing popularity of Agentic RAG is driven by significant advancements in large language model (LLM) reasoning capabilities, particularly their improved ability to break down complex problems and maintain coherent chains of thought across multiple steps.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Comparison Dimension</strong></td><td><strong>Traditional RAG</strong></td><td><strong>Agentic RAG</strong></td></tr>
<tr><td>Core Approach</td><td>Passive and reactive</td><td>Proactive, agent-driven</td></tr>
<tr><td>Process Flow</td><td>Single-step retrieval and generation (one-time process)</td><td>Dynamic, multi-step retrieval and generation (iterative refinement)</td></tr>
<tr><td>Retrieval Strategy</td><td>Fixed keyword search, dependent on initial query</td><td>Adaptive retrieval (e.g., keyword refinement, data source switching)</td></tr>
<tr><td>Complex Query Handling</td><td>Direct generation; prone to errors with conflicting data</td><td>Task decomposition → targeted retrieval → answer synthesis</td></tr>
<tr><td>Interaction Capability</td><td>Relies entirely on user input; no autonomy</td><td>Proactive engagement (e.g., clarifying ambiguities, requesting details)</td></tr>
<tr><td>Error Correction &amp; Feedback</td><td>No self-correction; limited by initial results</td><td>Iterative validation → self-triggered re-retrieval for accuracy</td></tr>
<tr><td>Ideal Use Cases</td><td>Simple Q&amp;A, factual lookups</td><td>Complex reasoning, multi-stage problem-solving, open-ended tasks</td></tr>
<tr><td>Example</td><td>User asks: “What is quantum computing?” → System returns a textbook definition</td><td>User asks: “How can quantum computing optimize logistics?” → System retrieves quantum principles and logistics algorithms, then synthesizes actionable insights</td></tr>
</tbody>
</table>
<p>Unlike traditional RAG, which relies on a single, query-based retrieval, Agentic RAG breaks down a query into multiple sub-questions and iteratively refines its search until it reaches a satisfactory answer. This evolution offers three primary benefits:</p>
<ul>
<li><p><strong>Proactive Problem-Solving:</strong> The system transitions from passively reacting to actively solving problems.</p></li>
<li><p><strong>Dynamic, Multi-Turn Retrieval:</strong> Instead of performing a one-time search, the system continually adjusts its queries and self-corrects based on ongoing feedback.</p></li>
<li><p><strong>Broader Applicability:</strong> It extends beyond basic fact-checking to handle complex reasoning tasks and generate comprehensive reports.</p></li>
</ul>
<p>By leveraging these capabilities, Agentic RAG apps like DeepSearcher operate much like a human expert—delivering not only the final answer but also a complete, transparent breakdown of its reasoning process and execution details.</p>
<p>In the long term, Agentic RAG is set to overtake baseline RAG systems. Conventional approaches often struggle to address the underlying logic in user queries, which require iterative reasoning, reflection, and continuous optimization.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">What Does an Agentic RAG Architecture Look Like? DeepSearcher as an Example<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>Now that we’ve understood the power of agentic RAG systems, what does their architecture look like? Let’s take DeepSearcher as an example.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2: Two Modules Within DeepSearcher</em></p>
<p>DeepSearcher’s architecture consists of two primary modules:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. Data Ingestion Module</h3><p>This module connects various third-party proprietary data sources via a Milvus vector database. It is especially valuable for enterprise environments that rely on proprietary datasets. The module handles:</p>
<ul>
<li><p>Document parsing and chunking</p></li>
<li><p>Embedding generation</p></li>
<li><p>Vector storage and indexing</p></li>
<li><p>Metadata management for efficient retrieval</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. Online Reasoning and Query Module</h3><p>This component implements diverse agent strategies within the RAG framework to deliver precise, insightful responses. It operates on a dynamic, iterative loop—after each data retrieval, the system reflects on whether the accumulated information sufficiently answers the original query. If not, another iteration is triggered; if yes, the final report is generated.</p>
<p>This ongoing cycle of “follow-up” and “reflection” represents a fundamental improvement over other basic RAG approaches. While traditional RAG performs a one-shot retrieval and generation process, DeepSearcher’s iterative approach mirrors how human researchers work—asking initial questions, evaluating the information received, identifying gaps, and pursuing new lines of inquiry.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">How Effective is DeepSearcher, and What Use Cases is It Best Suited For?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>Once installed and configured, DeepSearcher indexes your local files through the Milvus vector database. When you submit a query, it performs a comprehensive, in-depth search of this indexed content. A key advantage for developers is that the system logs every step of its search and reasoning process, providing transparency into how it arrived at its conclusions—a critical feature for debugging and optimizing RAG systems.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 3: Accelerated Playback of DeepSearcher Iteration</em></p>
<p>This approach consumes more computational resources than traditional RAG but delivers better results for complex queries. Let’s discuss two specific use cases where DeepSearcher is best suited for.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. Overview-Type Queries</h3><p>Overview-type queries—such as generating reports, drafting documents, or summarizing trends—provide a brief topic but require an exhaustive, detailed output.</p>
<p>For example, when querying &quot;How has The Simpsons changed over time?&quot;, DeepSearcher first generates an initial set of sub-queries:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>It retrieves relevant information, and then iterates with feedback to refine its search, generating the next sub-queries:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Each iteration builds on the previous one, culminating in a comprehensive report that covers multiple facets of the subject, structured with sections like:</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(For brevity, only excerpts of the process and final report are shown)</em></p>
<p>The final report provides a thorough analysis with proper citations and structured organization.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. Complex Reasoning Queries</h3><p>Complex queries involve multiple layers of logic and interconnected entities.</p>
<p>Consider the query: “Which film has the director who is older, God’s Gift To Women or Aldri annet enn bråk?”</p>
<p>While this might seem simple to a human, simple RAG systems struggle with it because the answer isn’t stored directly in the knowledge base. DeepSearcher tackles this challenge by decomposing the query into smaller sub-questions:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>It first retrieves information on the directors of both films,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>then generates sub-queries:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>and then extracts their birth dates, and finally compares them to determine the correct answer:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>In contrast, a conventional RAG system might miss key details due to limited retrieval in a single pass, potentially resulting in <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">hallucinated</a> or inaccurate answers:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher stands out by performing deep, iterative searches on imported local data. It logs each step of its reasoning process and ultimately delivers a comprehensive and unified report. This makes it particularly effective for overview-type queries—such as generating detailed reports or summarizing trends—and for complex reasoning queries that require breaking down a question into smaller sub-questions and aggregating data through multiple feedback loops.</p>
<p>In the next section, we will compare DeepSearcher with other RAG systems, exploring how its iterative approach and flexible model integration stack up against traditional methods.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">Quantitative Comparison: DeepSearcher vs. Traditional RAG<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>In the DeepSearcher GitHub repository, we’ve made available code for quantitative testing. For this analysis, we used the popular 2WikiMultiHopQA dataset. (Note: We evaluated only the first 50 entries to manage API token consumption, but the overall trends remain clear.)</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">Recall Rate Comparison</h3><p>As shown in Figure 4, the recall rate improves significantly as the number of maximum iterations increases:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 4: Max Iterations vs. Recall</em></p>
<p>After a certain point, the marginal improvements taper off—hence, we typically set the default to 3 iterations, though this can be adjusted based on specific needs.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">Token Consumption Analysis</h3><p>We also measured the total token usage for 50 queries across different iteration counts:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 5: Max Iterations vs. Token Usage</em></p>
<p>The results show that token consumption increases linearly with more iterations. For example, with 4 iterations, DeepSearcher consumes roughly 0.3M tokens. Using a rough estimate based on OpenAI’s gpt-4o-mini pricing of <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.60</mn><mi mathvariant="normal">/</mi><mn>1</mn><mi>M</mi><mi>o</mi><mi>u</mi><mi>t</mi><mi>p</mi><mi>u</mi><mi>t</mi><mi>t</mi><mi>o</mi><mi>k</mi><mi>e</mi><mi>n</mi><mi>s</mi><mo separator="true">,</mo><mi>t</mi><mi>h</mi><mi>i</mi><mi>s</mi><mi>e</mi><mi>q</mi><mi>u</mi><mi>a</mi><mi>t</mi><mi>e</mi><mi>s</mi><mi>t</mi><mi>o</mi><mi>a</mi><mi>n</mi><mi>a</mi><mi>v</mi><mi>e</mi><mi>r</mi><mi>a</mi><mi>g</mi><mi>e</mi><mi>c</mi><mi>o</mi><mi>s</mi><mi>t</mi><mi>o</mi><mi>f</mi><mi>a</mi><mi>b</mi><mi>o</mi><mi>u</mi><mi>t</mi></mrow><annotation encoding="application/x-tex">0.60/1M output tokens, this equates to an average cost of about</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">0.60/1</span><span class="mord mathnormal" style="margin-right:0.10903em;">M</span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord mathnormal">tp</span><span class="mord mathnormal">u</span><span class="mord mathnormal">tt</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord mathnormal">e</span><span class="mord mathnormal">n</span><span class="mord mathnormal">s</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">t</span><span class="mord mathnormal">hi</span><span class="mord mathnormal">se</span><span class="mord mathnormal" style="margin-right:0.03588em;">q</span><span class="mord mathnormal">u</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">es</span><span class="mord mathnormal">t</span><span class="mord mathnormal">o</span><span class="mord mathnormal">ana</span><span class="mord mathnormal" style="margin-right:0.03588em;">v</span><span class="mord mathnormal" style="margin-right:0.02778em;">er</span><span class="mord mathnormal">a</span><span class="mord mathnormal" style="margin-right:0.03588em;">g</span><span class="mord mathnormal">ecos</span><span class="mord mathnormal">t</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal">ab</span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord mathnormal">t</span></span></span></span>0.0036 per query (or roughly $0.18 for 50 queries).</p>
<p>For more resource-intensive inference models, the costs would be several times higher due to both higher per-token pricing and larger token outputs.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">Model Performance Comparison</h3><p>A significant advantage of DeepSearcher is its flexibility in switching between different models. We tested various inference models and non-inference models (like gpt-4o-mini). Overall, inference models—especially Claude 3.7 Sonnet—tended to perform the best, although the differences weren’t dramatic.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 6: Average Recall by Model</em></p>
<p>Notably, some smaller non-inference models sometimes couldn’t complete the full agent query process because of their limited ability to follow instructions—a common challenge for many developers working with similar systems.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (Agentic RAG) vs. Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a> is also able to handle complex queries, particularly multi-hop queries. Then, what is the difference between DeepSearcher (Agentic RAG) and Graph RAG?</p>
<p>Graph RAG is designed to query documents based on explicit relational links, making it particularly strong in multi-hop queries. For instance, when processing a long novel, Graph RAG can precisely extract the intricate relationships between characters. However, this method requires substantial token usage during data import to map out these relationships, and its query mode tends to be rigid—typically effective only for single-relationship queries.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 7: Graph RAG vs. DeepSearcher</em></p>
<p>In contrast, Agentic RAG—as exemplified by DeepSearcher—takes a fundamentally different approach. It minimizes token consumption during data import and instead invests computational resources during query processing. This design choice creates important technical tradeoffs:</p>
<ol>
<li><p>Lower upfront costs: DeepSearcher requires less preprocessing of documents, making initial setup faster and less expensive</p></li>
<li><p>Dynamic query handling: The system can adjust its retrieval strategy on-the-fly based on intermediate findings</p></li>
<li><p>Higher per-query costs: Each query requires more computation than Graph RAG, but delivers more flexible results</p></li>
</ol>
<p>For developers, this distinction is crucial when designing systems with different usage patterns. Graph RAG may be more efficient for applications with predictable query patterns and high query volume, while DeepSearcher’s approach excels in scenarios requiring flexibility and handling unpredictable, complex queries.</p>
<p>Looking ahead, as the cost of LLMs drops and inference performance continues to improve, Agentic RAG systems like DeepSearcher are likely to become more prevalent. The computational cost disadvantage will diminish, while the flexibility advantage will remain.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher vs. Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>Unlike OpenAI’s Deep Research, DeepSearcher is specifically tailored for the deep retrieval and analysis of private data. By leveraging a vector database, DeepSearcher can ingest diverse data sources, integrate various data types, and store them uniformly in a vector-based knowledge repository. Its robust semantic search capabilities enable it to efficiently search through vast amounts of offline data.</p>
<p>Furthermore, DeepSearcher is completely open source. While Deep Research remains a leader in content generation quality, it comes with a monthly fee and operates as a closed-source product, meaning its internal processes are hidden from users. In contrast, DeepSearcher provides full transparency—users can examine the code, customize it to suit their needs, or even deploy it in their own production environments.</p>
<h2 id="Technical-Insights" class="common-anchor-header">Technical Insights<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>Throughout the development and subsequent iterations of DeepSearcher, we’ve gathered several important technical insights:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">Inference Models: Effective but Not Infallible</h3><p>Our experiments reveal that while inference models perform well as agents, they sometimes overanalyze straightforward instructions, leading to excessive token consumption and slower response times. This observation aligns with the approach of major AI providers like OpenAI, which no longer distinguish between inference and non-inference models. Instead, model services should automatically determine the necessity of inference based on specific requirements to conserve tokens.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">The Imminent Rise of Agentic RAG</h3><p>From a demand perspective, deep content generation is essential; technically, enhancing RAG effectiveness is also crucial. In the long run, cost is the primary barrier to the widespread adoption of Agentic RAG. However, with the emergence of cost-effective, high-quality LLMs like DeepSeek-R1 and the cost reductions driven by Moore’s Law, the expenses associated with inference services are expected to decrease.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">The Hidden Scaling Limit of Agentic RAG</h3><p>A critical finding from our research concerns the relationship between performance and computational resources. Initially, we hypothesized that simply increasing the number of iterations and token allocation would proportionally improve results for complex queries.</p>
<p>Our experiments revealed a more nuanced reality: while performance does improve with additional iterations, we observed clear diminishing returns. Specifically:</p>
<ul>
<li><p>Performance increased sharply from 1 to 3 iterations</p></li>
<li><p>Improvements from 3 to 5 iterations were modest</p></li>
<li><p>Beyond 5 iterations, gains were negligible despite significant increases in token consumption</p></li>
</ul>
<p>This finding has important implications for developers: simply throwing more computational resources at RAG systems isn’t the most efficient approach. The quality of the retrieval strategy, the decomposition logic, and the synthesis process often matter more than raw iteration count. This suggests that developers should focus on optimizing these components rather than just increasing token budgets.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">The Evolution Beyond Traditional RAG</h3><p>Traditional RAG offers valuable efficiency with its low-cost, single-retrieval approach, making it suitable for straightforward question-answering scenarios. Its limitations become apparent, however, when handling queries with complex implicit logic.</p>
<p>Consider a user query like “How to earn 100 million in a year.” A traditional RAG system might retrieve content about high-earning careers or investment strategies, but would struggle to:</p>
<ol>
<li><p>Identify unrealistic expectations in the query</p></li>
<li><p>Break down the problem into feasible sub-goals</p></li>
<li><p>Synthesize information from multiple domains (business, finance, entrepreneurship)</p></li>
<li><p>Present a structured, multi-path approach with realistic timelines</p></li>
</ol>
<p>This is where Agentic RAG systems like DeepSearcher show their strength. By decomposing complex queries and applying multi-step reasoning, they can provide nuanced, comprehensive responses that better address the user’s underlying information needs. As these systems become more efficient, we expect to see their adoption accelerate across enterprise applications.</p>
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
    </button></h2><p>DeepSearcher represents a significant evolution in RAG system design, offering developers a powerful framework for building more sophisticated search and research capabilities. Its key technical advantages include:</p>
<ol>
<li><p>Iterative reasoning: The ability to break down complex queries into logical sub-steps and progressively build toward comprehensive answers</p></li>
<li><p>Flexible architecture: Support for swapping underlying models and customizing the reasoning process to suit specific application needs</p></li>
<li><p>Vector database integration: Seamless connection to Milvus for efficient storage and retrieval of vector embeddings from private data sources</p></li>
<li><p>Transparent execution: Detailed logging of each reasoning step, enabling developers to debug and optimize system behavior</p></li>
</ol>
<p>Our performance testing confirms that DeepSearcher delivers superior results for complex queries compared to traditional RAG approaches, though with clear tradeoffs in computational efficiency. The optimal configuration (typically around 3 iterations) balances accuracy against resource consumption.</p>
<p>As LLM costs continue to decrease and reasoning capabilities improve, the Agentic RAG approach implemented in DeepSearcher will become increasingly practical for production applications. For developers working on enterprise search, research assistants, or knowledge management systems, DeepSearcher offers a powerful open-source foundation that can be customized to specific domain requirements.</p>
<p>We welcome contributions from the developer community and invite you to explore this new paradigm in RAG implementation by checking out our <a href="https://github.com/zilliztech/deep-searcher">GitHub repository</a>.</p>
