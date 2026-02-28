---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong — But Bad for Creativity
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  for developers, especially those building agents and RAG pipelines, this
  release may quietly be the most useful upgrade yet.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>After months of speculation, OpenAI has finally shipped</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>.</strong> The model isn’t the creative lightning strike that GPT-4 was, but for developers, especially those building agents and RAG pipelines, this release may quietly be the most useful upgrade yet.</p>
<p><strong>TL;DR for builders:</strong> GPT-5 unifies architectures, supercharges multimodal I/O, slashes factual error rates, extends context to 400k tokens, and makes large-scale usage affordable. However, the creativity and literary flair have taken a noticeable step back.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">What’s New Under the Hood?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>Unified core</strong> — Merges GPT digital series with o-series reasoning models, delivering long-chain reasoning plus multimodal in a single architecture.</p></li>
<li><p><strong>Full-spectrum multimodal</strong> — Input/output across text, image, audio, and video, all within the same model.</p></li>
<li><p><strong>Massive accuracy gains</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44% fewer factual errors vs. GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>: 78% fewer factual errors vs. o3.</p></li>
</ul></li>
<li><p><strong>Domain skill boosts</strong> — Stronger in code generation, mathematical reasoning, health consultation, and structured writing; hallucinations reduced significantly.</p></li>
</ul>
<p>Alongside GPT-5, OpenAI also released <strong>three additional variants</strong>, each optimized for different needs:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>Model</strong></th><th><strong>Description</strong></th><th><strong>Input / $ per 1M tokens</strong></th><th><strong>Output / $ per 1M tokens</strong></th><th><strong>Knowledge Update</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>Main model, long-chain reasoning + full multimodal</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>Equivalent to gpt-5, used in ChatGPT conversations</td><td>—</td><td>—</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60% cheaper, retains ~90% of programming performance</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>Edge/offline, 32K context, latency &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 broke records across 25 benchmark categories — from code repair to multimodal reasoning to medical tasks — with consistent accuracy improvements.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">Why Developers Should Care — Especially for RAG &amp; Agents<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Our hands-on tests suggest this release is a quiet revolution for Retrieval-Augmented Generation and agent-driven workflows.</p>
<ol>
<li><p><strong>Price cuts</strong> make experimentation viable — API input cost: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1.25</mn><mi>p</mi><mi>e</mi><mi>r</mi><mi>m</mi><mi>i</mi><mi>l</mi><mi>l</mi><mi>i</mi><mi>o</mi><mi>n</mi><mi>t</mi><mi>o</mi><mi>k</mi><mi>e</mi><mi>n</mi><mi>s</mi><mo>∗</mo><mo>∗</mo><mo separator="true">;</mo><mi>o</mi><mi>u</mi><mi>t</mi><mi>p</mi><mi>u</mi><mi>t</mi><mi>c</mi><mi>o</mi><mi>s</mi><mi>t</mi><mo>:</mo><mo>∗</mo><mo>∗</mo></mrow><annotation encoding="application/x-tex">1.25 per million tokens**; output cost: **</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">1.25</span><span class="mord mathnormal">p</span><span class="mord mathnormal" style="margin-right:0.02778em;">er</span><span class="mord mathnormal">mi</span><span class="mord mathnormal" style="margin-right:0.01968em;">ll</span><span class="mord mathnormal">i</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal">t</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord mathnormal">e</span><span class="mord mathnormal">n</span><span class="mord mathnormal">s</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span><span class="mspace" style="margin-right:0.2222em;"></span></span><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span><span class="mord">∗</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord mathnormal">tp</span><span class="mord mathnormal">u</span><span class="mord mathnormal">t</span><span class="mord mathnormal">cos</span><span class="mord mathnormal">t</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">:</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗</span><span class="mord">∗</span></span></span></span>10</strong>.</p></li>
<li><p><strong>A 400k context window</strong> (vs. 128k in o3/4o) allows you to maintain state across complex multi-step agent workflows without context chopping.</p></li>
<li><p><strong>Fewer hallucinations &amp; better tool use</strong> — Supports multi-step chained tool calls, handles complex non-standard tasks, and improves execution reliability.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">Not Without Flaws<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>Despite its technical advances, GPT-5 still shows clear limits.</p>
<p>At launch, OpenAI’s keynote featured a slide that bizarrely calculated <em>52.8 &gt; 69.1 = 30.8</em>, and in our own tests, the model confidently repeated the textbook-but-wrong “Bernoulli effect” explanation for airplane lift—reminding us <strong>it’s still a pattern learner, not a true domain expert.</strong></p>
<p><strong>While STEM performance has sharpened, creative depth has slipped.</strong> Many long-time users note a decline in literary flair: poetry feels flatter, philosophical conversations less nuanced, and long-form narratives more mechanical. The trade-off is clear—higher factual accuracy and stronger reasoning in technical domains, but at the expense of the artful, exploratory tone that once made GPT feel almost human.</p>
<p>With that in mind, let’s see how GPT-5 actually performs in our hands-on tests.</p>
<h2 id="Coding-Tests" class="common-anchor-header">Coding Tests<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>I started with a simple task: write an HTML script that allows users to upload an image and move it with the mouse. GPT-5 paused for about nine seconds, then produced working code that handled the interaction well. It felt like a good start.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The second task was harder: implement polygon–ball collision detection inside a rotating hexagon, with adjustable rotation speed, elasticity, and ball count. GPT-5 generated the first version in around thirteen seconds. The code included all expected features, but it had bugs and wouldn’t run.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I then used the editor’s <strong>Fix bug</strong> option, and GPT-5 corrected the errors so the hexagon rendered. However, the balls never appeared — the spawn logic was missing or incorrect, meaning the core function of the program was absent despite the otherwise complete setup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>In summary,</strong> GPT-5 can produce clean, well-structured interactive code and recover from simple runtime errors. But in complex scenarios, it still risks omitting essential logic, so human review and iteration are necessary before deployment.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">Reasoning Test<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>I posed a multi-step logic puzzle involving item colors, prices, and positional clues—something that would take most humans several minutes to solve.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Question:</strong> <em>What is the blue item and what is its price?</em></p>
<p>GPT-5 delivered the correct answer in just 9 seconds, with a clear and logically sound explanation. This test reinforced the model’s strength in structured reasoning and rapid deduction.</p>
<h2 id="Writing-Test" class="common-anchor-header">Writing Test<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>I often turn to ChatGPT for help with blogs, social media posts, and other written content, so text generation is one of the capabilities I care about most. For this test, I asked GPT-5 to create a LinkedIn post based on a blog about Milvus 2.6’s multilingual analyzer.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The output was well-organized and hit all the key points from the original blog, but it felt too formal and predictable—more like a corporate press release than something meant to spark interest on a social feed. It lacked the warmth, rhythm, and personality that make a post feel human and inviting.</p>
<p>On the upside, the accompanying illustrations were excellent: clear, on-brand, and perfectly aligned with Zilliz’s tech style. Visually, it was spot-on; the writing just needs a bit more creative energy to match.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">Longer Context Window = Death of RAG and VectorDB?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>We tackled this topic last year when <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google launched <strong>Gemini 1.5 Pro</strong></a> with its ultra-long 10M-token context window. At the time, some people were quick to predict the end of RAG—and even the end of databases altogether. Fast-forward to today: not only is RAG still alive, it’s thriving. In practice, it’s become <em>more</em> capable and productive, along with vector databases like <a href="https://milvus.io/"><strong>Milvus</strong></a> and <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>.</p>
<p>Now, with GPT-5’s expanded context length and more advanced tool-calling capabilities, the question has popped up again: <em>Do we still need vector databases for context ingestion, or even dedicated agents/RAG pipelines?</em></p>
<p><strong>The short answer: absolutely yes. We still need them.</strong></p>
<p>Longer context is useful, but it’s not a replacement for structured retrieval. Multi-agent systems are still on track to be a long-term architectural trend—and these systems often need virtually unlimited context. Plus, when it comes to managing private, unstructured data securely, a vector database will always be the final gatekeeper.</p>
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
    </button></h2><p>After watching OpenAI’s launch event and running my own hands-on tests, GPT-5 feels less like a dramatic leap forward and more like a refined blend of past strengths with a few well-placed upgrades. That’s not a bad thing—it’s a sign of the architectural and data-quality limits large models are starting to encounter.</p>
<p>As the saying goes, <em>severe criticism comes from high expectations</em>. Any disappointment around GPT-5 mostly comes from the very high bar OpenAI set for itself. And really—better accuracy, lower prices, and integrated multimodal support are still valuable wins. For developers building agents and RAG pipelines, this may actually be the most useful upgrade so far.</p>
<p>Some friends have been joking about making “online memorials” for GPT-4o, claiming their old chat companion’s personality is gone forever. I don’t mind the change—GPT-5 might be less warm and chatty, but its direct, no-nonsense style feels refreshingly straightforward.</p>
<p><strong>What about you?</strong> Share your thoughts with us—join our <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>, or join the conversation on <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> and <a href="https://x.com/milvusio">X</a>.</p>
