---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >
  GLM-5 vs. MiniMax M2.5 vs. Gemini 3 Deep Think: Which Model Fits Your AI Agent
  Stack?
author: 'Lumina Wang, Julie Xia'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >
  Hands-on comparison of GLM-5, MiniMax M2.5, and Gemini 3 Deep Think for
  coding, reasoning, and AI agents. Includes a RAG tutorial with Milvus.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>In just over two days, three major models dropped back-to-back: GLM-5, MiniMax M2.5, and Gemini 3 Deep Think. All three headline the same capabilities: <strong>coding, deep reasoning, and agentic workflows.</strong> All three claim state-of-the-art results. If you squint at the spec sheets, you could almost play a matching game and eliminate identical talking points across all three.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The scarier thought? Your boss has probably already seen the announcements and is itching for you to build nine internal apps using the three models before the week is even over.</p>
<p>So what actually sets these models apart? How should you choose between them? And (as always) how do you wire them up with <a href="https://milvus.io/">Milvus</a> to ship an internal knowledge base? Bookmark this page. It’s got everything you need.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5, MiniMax M2.5, and Gemini 3 Deep Think at a Glance<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5 leads in complex system engineering and long-horizon agent tasks</h3><p>On February 12, Zhipu officially launched GLM-5, which excels in complex system engineering and long-running agent workflows.</p>
<p>The model has 355B-744B parameters (40B active), trained on 28.5T tokens. It integrates sparse attention mechanisms with an asynchronous reinforcement learning framework called Slime, enabling it to handle ultra-long contexts without quality loss while keeping deployment costs down.</p>
<p>GLM-5 led the open-source pack on key benchmarks, ranking #1 on SWE-bench Verified (77.8) and #1 on Terminal Bench 2.0 (56.2)—ahead of MiniMax 2.5 and Gemini 3 Deep Think. That said, its headline scores still trail top closed-source models such as Claude Opus 4.5 and GPT-5.2. In Vending Bench 2, a business-simulation evaluation, GLM-5 generated $4,432 in simulated annual profit, putting it roughly in the same range as closed-source systems.</p>
<p>GLM-5 also made significant upgrades to its system engineering and long-horizon agent capabilities. It can now convert text or raw materials directly into .docx, .pdf, and .xlsx files, and generate specific deliverables like product requirement documents, lesson plans, exams, spreadsheets, financial reports, flowcharts, and menus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">Gemini 3 Deep Think sets a new bar for scientific reasoning</h3><p>In the early hours of February 13, 2026, Google officially released Gemini 3 Deep Think, a major upgrade I’ll (tentatively) call the strongest research and reasoning model on the planet. After all, Gemini was the only model that passed the car wash test: “<em>I want to wash my car and the car wash is just 50 meters away. Should I start my car and drive there or just walk</em>?”</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Its core strength is top-tier reasoning and competition performance: it hit 3455 Elo on Codeforces, equivalent to the world’s eighth-best competitive programmer. It reached gold-medal standard on the written portions of the 2025 International Physics, Chemistry, and Math Olympiads. Cost efficiency is another breakthrough. ARC-AGI-1 runs at just $7.17 per task, a 280x to 420x reduction compared to OpenAI’s o3-preview from 14 months earlier. On the applied side, Deep Think’s biggest gains are in scientific research. Experts are already using it for peer review of professional mathematics papers and for optimizing complex crystal growth preparation workflows.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 competes on cost and speed for production workloads</h3><p>The same day, MiniMax released M2.5, positioning it as the cost- and efficiency-champion for production use cases.</p>
<p>As one of the fastest-iterating model families in the industry, M2.5 sets new SOTA results across coding, tool calling, search, and office productivity. Cost is its biggest selling point: the fast version runs at roughly 100 TPS, with input priced at <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.30</mn><mi>p</mi><mi>e</mi><mi>r</mi><mi>m</mi><mi>i</mi><mi>l</mi><mi>l</mi><mi>i</mi><mi>o</mi><mi>n</mi><mi>t</mi><mi>o</mi><mi>k</mi><mi>e</mi><mi>n</mi><mi>s</mi><mi>a</mi><mi>n</mi><mi>d</mi><mi>o</mi><mi>u</mi><mi>t</mi><mi>p</mi><mi>u</mi><mi>t</mi><mi>a</mi><mi>t</mi></mrow><annotation encoding="application/x-tex">0.30 per million tokens and output at</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">0.30</span><span class="mord mathnormal">p</span><span class="mord mathnormal" style="margin-right:0.02778em;">er</span><span class="mord mathnormal">mi</span><span class="mord mathnormal" style="margin-right:0.01968em;">ll</span><span class="mord mathnormal">i</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal">t</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord mathnormal">e</span><span class="mord mathnormal">n</span><span class="mord mathnormal">s</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord mathnormal">tp</span><span class="mord mathnormal">u</span><span class="mord mathnormal">t</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span></span></span></span>2.40 per million tokens. The 50 TPS version cuts output cost by another half. Speed improved 37% over the previous M2.1, and it completes SWE-bench Verified tasks in an average of 22.8 minutes, roughly matching Claude Opus 4.6. On the capability side, M2.5 supports full-stack development in over 10 languages, including Go, Rust, and Kotlin, covering everything from zero-to-one system design to full code review. For office workflows, its Office Skills feature integrates deeply with Word, PPT, and Excel. When combined with domain knowledge in finance and law, it can generate research reports and financial models that are ready for direct use.</p>
<p>That’s the high-level overview. Next, let’s look at how they actually perform in hands-on tests.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">Hands-On Comparisons<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">3D scene rendering: Gemini 3 Deep Think produces the most realistic results</h3><p>We took a prompt that users had already tested on Gemini 3 Deep Think and ran it through GLM-5 and MiniMax M2.5 for a direct comparison. The prompt: build a complete Three.js scene in a single HTML file that renders a fully 3D interior room indistinguishable from a classical oil painting in a museum.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gemini 3 Deep Think</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think</strong> delivered the strongest result. It accurately interpreted the prompt and generated a high-quality 3D scene. Lighting was the standout: shadow direction and falloff looked natural, clearly conveying the spatial relationship of natural light coming through a window. Fine details were impressive too, including the half-melted texture of candles and the material quality of red wax seals. Overall visual fidelity was high.</p>
<p><strong>GLM-5</strong> produced detailed object modeling and texture work, but its lighting system had noticeable issues. Table shadows rendered as hard, pure-black blocks without soft transitions. The wax seal appeared to float above the table surface, failing to handle the contact relationship between objects and the tabletop correctly. These artifacts point to room for improvement in global illumination and spatial reasoning.</p>
<p><strong>MiniMax M2.5</strong> couldn’t parse the complex scene description effectively. The output was just disordered particle motion, indicating significant limitations in both comprehension and generation when handling multi-layered semantic instructions with precise visual requirements.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">SVG generation: all three models handle it differently</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Prompt:</strong> Generate an SVG of a California brown pelican riding a bicycle. The bicycle must have spokes and a correctly shaped bicycle frame. The pelican must have its characteristic large pouch, and there should be a clear indication of feathers. The pelican must be clearly pedaling the bicycle. The image should show the full breeding plumage of the California brown pelican.</p>
<p><strong>Gemini 3 Deep Think</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
    <span>Gemini 3 Deep Think</span>
  </span>
</p>
<p><strong>GLM-5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
    <span>GLM-5</span>
  </span>
</p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
    <span>MiniMax M2.5</span>
  </span>
</p>
<p><strong>Gemini 3 Deep Think</strong> produced the most complete SVG overall. The pelican’s riding posture is accurate: its center of gravity sits naturally on the seat, and its feet rest on the pedals in a dynamic cycling pose. Feather texture is detailed and layered. The one weak spot is that the pelican’s signature throat pouch is drawn too large, which throws off the overall proportions slightly.</p>
<p><strong>GLM-5</strong> had noticeable posture issues. The feet are placed correctly on the pedals, but the overall sitting position drifts away from a natural riding posture, and the body-to-seat relationship looks off. That said, its detail work is solid: the throat pouch is proportioned well, and the feather texture quality is respectable.</p>
<p><strong>MiniMax M2.5</strong> went with a minimalist style and skipped background elements entirely. The pelican’s position on the bicycle is roughly correct, but the detail work falls short. The handlebars are the wrong shape, the feather texture is almost nonexistent, the neck is too thick, and there are stray white oval artifacts in the image that shouldn’t be there.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">How to Choose Between GLM-5, MiniMax M2.5 and Gemin 3 Deep Think<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Across all our tests, MiniMax M2.5 was the slowest to generate output, requiring the longest time for thinking and reasoning. GLM-5 performed consistently and was roughly on par with Gemini 3 Deep Think in speed.</p>
<p>Here’s a quick selection guide we put together:</p>
<table>
<thead>
<tr><th>Core Use Case</th><th>Recommended Model</th><th>Key Strengths</th></tr>
</thead>
<tbody>
<tr><td>Scientific research, advanced reasoning (physics, chemistry, math, complex algorithm design)</td><td>Gemini 3 Deep Think</td><td>Gold-medal performance in academic competitions. Top-tier scientific data verification. World-class competitive programming on Codeforces. Proven research applications, including identifying logical flaws in professional papers. (Currently limited to Google AI Ultra subscribers and select enterprise users; per-task cost is relatively high.)</td></tr>
<tr><td>Open-source deployment, enterprise intranet customization, full-stack development, office skills integration</td><td>Zhipu GLM-5</td><td>Top-ranked open-source model. Strong system-level engineering capabilities. Supports local deployment with manageable costs.</td></tr>
<tr><td>Cost-sensitive workloads, multi-language programming, cross-platform development (Web/Android/iOS/Windows), office compatibility</td><td>MiniMax M2.5</td><td>At 100 TPS: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.30</mn><mi>p</mi><mi>e</mi><mi>r</mi><mi>m</mi><mi>i</mi><mi>l</mi><mi>l</mi><mi>i</mi><mi>o</mi><mi>n</mi><mi>i</mi><mi>n</mi><mi>p</mi><mi>u</mi><mi>t</mi><mi>t</mi><mi>o</mi><mi>k</mi><mi>e</mi><mi>n</mi><mi>s</mi><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">0.30 per million input tokens,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">0.30</span><span class="mord mathnormal">p</span><span class="mord mathnormal" style="margin-right:0.02778em;">er</span><span class="mord mathnormal">mi</span><span class="mord mathnormal" style="margin-right:0.01968em;">ll</span><span class="mord mathnormal">i</span><span class="mord mathnormal">o</span><span class="mord mathnormal">nin</span><span class="mord mathnormal">p</span><span class="mord mathnormal">u</span><span class="mord mathnormal">tt</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord mathnormal">e</span><span class="mord mathnormal">n</span><span class="mord mathnormal">s</span><span class="mpunct">,</span></span></span></span>2.40 per million output tokens. SOTA across office, coding, and tool-calling benchmarks. Ranked first on the Multi-SWE-Bench. Strong generalization. Pass rates on Droid/OpenCode exceed Claude Opus 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">RAG Tutorial: Wire Up GLM-5 with Milvus for a Knowledge Base<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Both GLM-5 and MiniMax M2.5 are available through <a href="https://openrouter.ai/">OpenRouter</a>. Sign up and create an <code translate="no">OPENROUTER_API_KEY</code> to get started.</p>
<p>This tutorial uses Zhipu’s GLM-5 as the example LLM. To use MiniMax instead, just swap the model name to <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">Dependencies and environment setup</h3><p>Install or upgrade pymilvus, openai, requests, and tqdm to their latest versions:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>This tutorial uses GLM-5 as the LLM and OpenAI’s text-embedding-3-small as the embedding model.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">Data preparation</h3><p>We’ll use the FAQ pages from the Milvus 2.4.x documentation as our private knowledge base.</p>
<p>Download the zip file and extract the docs into a <code translate="no">milvus_docs</code> folder:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Load all the Markdown files from <code translate="no">milvus_docs/en/faq</code>. We split each file on <code translate="no">&quot;# &quot;</code> to roughly separate the content by major sections:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLM and embedding model setup</h3><p>We’ll use GLM-5 as the LLM and text-embedding-3-small as the embedding model:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Generate a test embedding and print its dimensions and first few elements:</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Load data into Milvus</h3><p><strong>Create a collection:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>A note on MilvusClient configuration:</p>
<ul>
<li><p>Setting the URI to a local file (e.g., <code translate="no">./milvus.db</code>) is the simplest option. It automatically uses Milvus Lite to store all data in that file.</p></li>
<li><p>For large-scale data, you can deploy a more performant Milvus server on Docker or Kubernetes. In that case, use the server URI (e.g., <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>To use Zilliz Cloud (the fully managed cloud version of Milvus), set the URI and token to the Public Endpoint and API key from your Zilliz Cloud console.</p></li>
</ul>
<p>Check whether the collection already exists, and drop it if so:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Create a new collection with the specified parameters. If you don’t provide field definitions, Milvus automatically creates a default <code translate="no">id</code> field as the primary key and a <code translate="no">vector</code> field for vector data. A reserved JSON field stores any fields and values not defined in the schema:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">Insert data</h3><p>Iterate through the text lines, generate embeddings, and insert the data into Milvus. The <code translate="no">text</code> field here isn’t defined in the schema. It’s automatically added as a dynamic field backed by Milvus’s reserved JSON field:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">Build the RAG pipeline</h3><p><strong>Retrieve relevant documents:</strong></p>
<p>Let’s ask a common question about Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Search the collection for the top 3 most relevant results:</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Results are sorted by distance, nearest first:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Generate a response with the LLM:</strong></p>
<p>Combine the retrieved documents into a context string:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Set up the system and user prompts. The user prompt is built from the documents retrieved from Milvus:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Call GLM-5 to generate the final answer:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 returns a well-structured answer:</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">Conclusion: Pick the Model, Then Build the Pipeline<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>All three models are strong, but they’re strong at different things. Gemini 3 Deep Think is the pick when reasoning depth matters more than cost. GLM-5 is the best open-source option for teams that need local deployment and system-level engineering. MiniMax M2.5 makes sense when you’re optimizing for throughput and budget across production workloads.</p>
<p>The model you choose is only half the equation. To turn any of these into a useful application, you need a retrieval layer that can scale with your data. That’s where Milvus fits in. The RAG tutorial above works with any OpenAI-compatible model, so swapping between GLM-5, MiniMax M2.5, or any future release takes a single line change.</p>
<p>If you’re designing local or on-prem AI agents and want to discuss storage architecture, session design, or safe rollback in more detail, feel free to join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack channel</a>.You can also book a 20-minute one-on-one through <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> for personalized guidance.</p>
<p>If you want to go deeper into building AI Agents, here are more resources to help you get started.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">How to Build Production-Ready Multi-Agent Systems with Agno and Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn">Choosing the Right Embedding Model for Your RAG Pipeline</a></p></li>
<li><p><a href="https://zilliz.com/learn">How to Build an AI Agent with Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">What Is OpenClaw? Complete Guide to the Open-Source AI Agent</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw Tutorial: Connect to Slack for Local AI Assistant</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Build Clawdbot-Style AI Agents with LangGraph &amp; Milvus</a></p></li>
</ul>
