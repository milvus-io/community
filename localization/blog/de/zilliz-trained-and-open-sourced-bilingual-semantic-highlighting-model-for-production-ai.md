---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: >-
  Wir haben ein zweisprachiges semantisches Hervorhebungsmodell für die
  RAG-Produktion und die KI-Suche trainiert und als Open-Source bereitgestellt
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  Tauchen Sie tief in die semantische Hervorhebung ein und erfahren Sie, wie das
  zweisprachige Modell von Zilliz aufgebaut ist und wie es in englischen und
  chinesischen Benchmarks für RAG-Systeme abschneidet.
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>Whether you’re building a product search, a RAG pipeline, or an AI agent, users ultimately need the same thing: a fast way to see why a result is relevant. <strong>Highlighting</strong> helps by marking the exact text that supports the match, so users don’t have to scan the entire document.</p>
<p>Most systems still rely on keyword-based highlighting. If a user searches for “iPhone performance,” the system highlights the exact tokens “iPhone” and “performance.” But this breaks down as soon as the text expresses the same idea using different wording. A description like “A15 Bionic chip, over one million in benchmarks, smooth with no lag” clearly addresses performance, yet nothing is highlighted because the keywords never appear.</p>
<p><strong>Semantic highlighting</strong> solves this problem. Instead of matching exact strings, it identifies text spans that are semantically aligned with the query. For RAG systems, AI search, and agents—where relevance depends on meaning rather than surface form—this yields more precise, more reliable explanations of why a document was retrieved.</p>
<p>However, existing semantic highlighting methods aren’t designed for production AI workloads. After evaluating all available solutions, we found that none delivered the precision, latency, multilingual coverage, or robustness required for RAG pipelines, agent systems, or large-scale web search. <strong>So we trained our own bilingual semantic highlighting model—and open-sourced it.</strong></p>
<ul>
<li><p>Our semantic highlighting model: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>Tell us what you think—join our <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>, follow us on <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>, or book a <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">20-minute Milvus Office Hours</a> session with us.</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">How Keyword-Based Highlighting Works — and Why It Fails in Modern AI Systems<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Traditional search systems implement highlighting through simple keyword matching</strong>. When results are returned, the engine locates the exact token positions that match the query and wraps them in markup (usually <code translate="no">&lt;em&gt;</code> tags), leaving the frontend to render the highlight. This works fine when the query terms appear verbatim in the text.</p>
<p>The problem is that this model assumes relevance is tied to exact keyword overlap. Once that assumption breaks, reliability drops fast. Any result that expresses the right idea with different wording ends up with no highlight at all, even if the retrieval step was correct.</p>
<p>This weakness becomes obvious in modern AI applications. In RAG pipelines and AI agent workflows, queries are more abstract, documents are longer, and relevant information may not reuse the same words. Keyword-based highlighting can no longer show developers—or end users—<em>where the answer actually is</em>, which makes the overall system feel less accurate even when retrieval is working as intended.</p>
<p>Suppose a user asks: <em>“How can I improve the execution efficiency of Python code?”</em> The system retrieves a technical document from a vector database. Traditional highlighting can only mark literal matches such as <em>“Python”</em>, <em>“code”</em>, <em>“execution”</em>, and <em>“efficiency”</em>.</p>
<p>However, the most useful parts of the document might be:</p>
<ul>
<li><p>Use NumPy vectorized operations instead of explicit loops</p></li>
<li><p>Avoid repeatedly creating objects inside loops</p></li>
</ul>
<p>These sentences directly answer the question, but they contain none of the query terms. As a result, traditional highlighting fails completely. The document may be relevant, but the user still has to scan it line by line to locate the actual answer.</p>
<p>The problem becomes even more pronounced with AI agents. An agent’s search query is often not the user’s original question, but a derived instruction produced through reasoning and task decomposition. For example, if a user asks, <em>“Can you analyze recent market trends?”</em>, the agent might generate a query like “Retrieve Q4 2024 consumer electronics sales data, year-over-year growth rates, changes in major competitors’ market share, and supply chain cost fluctuations”.</p>
<p>This query spans multiple dimensions and encodes complex intent. Traditional keyword-based highlighting, however, can only mechanically mark literal matches such as <em>“2024”</em>, <em>“sales data”</em>, or <em>“growth rate”</em>.</p>
<p>Meanwhile, the most valuable insights may look like:</p>
<ul>
<li><p>The iPhone 15 series drove a broader market recovery</p></li>
<li><p>Chip supply constraints pushed costs up by 15%</p></li>
</ul>
<p>These conclusions may not share a single keyword with the query, even though they are exactly what the agent is trying to extract. Agents need to quickly identify truly useful information from large volumes of retrieved content—and keyword-based highlighting offers no real help.</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">What Is Semantic Highlighting, and Pain Points in Today’s Solutions<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Semantic highlighting builds on the same idea behind semantic search: matching based on meaning rather than exact words</strong>. In semantic search, embedding models map text into vectors so a search system—typically backed by a vector database like <a href="https://milvus.io/">Milvus</a>—can retrieve passages that convey the same idea as the query, even if the wording is different. Semantic highlighting applies this principle at a finer granularity. Instead of marking literal keyword hits, it highlights the specific spans inside a document that are semantically relevant to the user’s intent.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This approach solves a core problem with traditional highlighting, which only works when the query terms appear verbatim. If a user searches for “iPhone performance,” keyword-based highlighting ignores phrases like “A15 Bionic chip,” “over one million in benchmarks,” or “smooth with no lag,” even though these lines clearly answer the question. Semantic highlighting captures these meaning-driven connections and surfaces the parts of the text users actually care about.</p>
<p>In theory, this is a straightforward semantic matching problem. Modern embedding models already encode similarity well, so the conceptual pieces are already in place. The challenge comes from real-world constraints: highlighting occurs on every query, often across many retrieved documents, making latency, throughput, and cross-domain robustness non-negotiable requirements. Large language models are simply too slow and too expensive to run in this high-frequency path.</p>
<p>That is why practical semantic highlighting requires a lightweight, specialized model—small enough to sit alongside search infrastructure and fast enough to return results in a few milliseconds. This is where most existing solutions break down. Heavy models deliver accuracy but cannot run at scale; lighter models are fast but lose precision or fail on multilingual or domain-specific data.</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">opensearch-semantic-highlighter</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Earlier this year, OpenSearch released a dedicated model for semantic highlighting: <a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>. While it is a meaningful attempt at the problem, it has two critical limitations.</p>
<ul>
<li><p><strong>Small context window:</strong> The model is based on a BERT architecture and supports a maximum of 512 tokens—roughly 300–400 Chinese characters or 400–500 English words. In real-world scenarios, product descriptions and technical documents often span thousands of words. Content beyond the first window is simply truncated, forcing the model to identify highlights based on only a small fraction of the document.</p></li>
<li><p><strong>Poor out-of-domain generalization:</strong> The model performs well only on data distributions similar to its training set. When applied to out-of-domain data—such as using a model trained on news articles to highlight e-commerce content or technical documentation—performance degrades sharply. In our experiments, the model achieves an F1 score of around 0.72 on in-domain data, but drops to approximately 0.46 on out-of-domain datasets. This level of instability is problematic in production. In addition, the model does not support Chinese.</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">Provence / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> is a model developed by <a href="https://zilliz.com/customers/naver">Naver</a> and was initially trained for <strong>context pruning</strong>—a task that is closely related to semantic highlighting.</p>
<p>Both tasks are built on the same underlying idea: using semantic matching to identify relevant content and filter out irrelevant parts. For this reason, Provence can be repurposed for semantic highlighting with relatively little adaptation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence is an English-only model and performs reasonably well in that setting. <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a> is its multilingual variant, supporting more than a dozen languages, including Chinese, Japanese, and Korean. At first glance, this makes XProvence appear to be a good candidate for bilingual or multilingual semantic highlighting scenarios.</p>
<p>In practice, however, both Provence and XProvence have several notable limitations:</p>
<ul>
<li><p><strong>Weaker English performance in the multilingual model:</strong> XProvence does not match Provence’s performance on English benchmarks. This is a common trade-off in multilingual models: capacity is shared across languages, often leading to weaker performance in high-resource languages such as English. This limitation matters in real-world systems where English remains a primary or dominant workload.</p></li>
<li><p><strong>Limited Chinese performance:</strong>  XProvence supports many languages. During multilingual training, data and model capacity are spread across languages, which limits how well the model can specialize in any single one. As a result, its Chinese performance is only marginally acceptable and often insufficient for high-precision highlighting use cases.</p></li>
<li><p><strong>Mismatch between pruning and highlighting objectives:</strong> Provence is optimized for context pruning, where the priority is recall—keeping as much potentially useful content as possible to avoid losing critical information. Semantic highlighting, by contrast, emphasizes precision: highlighting only the most relevant sentences, not large portions of the document. When Provence-style models are applied to highlighting, this mismatch often leads to overly broad or noisy highlights.</p></li>
<li><p><strong>Restrictive licensing:</strong> Both Provence and XProvence are released under the CC BY-NC 4.0 license, which does not permit commercial use. This restriction alone makes them unsuitable for many production deployments.</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">Open Provence</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provence</strong></a> is a community-driven project that reimplements the Provence training pipeline in an open and transparent way. It provides not only training scripts, but also data processing workflows, evaluation tools, and pretrained models at multiple scales.</p>
<p>A key advantage of Open Provence is its <strong>permissive MIT license</strong>. Unlike Provence and XProvence, it can be safely used in commercial environments without legal restrictions, which makes it attractive for production-oriented teams.</p>
<p>That said, Open Provence currently supports only <strong>English and Japanese</strong>, which makes it unsuitable for our bilingual use cases.</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">We Trained and Open-Sourced a Bilingual Semantic Highlighting Model<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>A semantic highlighting model designed for real-world workloads must deliver a few essential capabilities:</p>
<ul>
<li><p>Strong multilingual performance</p></li>
<li><p>A context window large enough to support long documents</p></li>
<li><p>Robust out-of-domain generalization</p></li>
<li><p>High precision in semantic highlighting tasks</p></li>
<li><p>A permissive, production-friendly license (MIT or Apache 2.0)</p></li>
</ul>
<p>After evaluating existing solutions, we found that none of the available models met the requirements needed for production use. So we decided to train our own semantic highlight model: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>To achieve all of these, we adopted a straightforward approach: use large language models to generate high-quality labeled data, then train a lightweight semantic highlighting model on top of it using open-source tooling. This lets us combine the reasoning strength of LLMs with the efficiency and low latency required in production systems.</p>
<p><strong>The most challenging part of this process is data construction</strong>. During annotation, we prompt an LLM (Qwen3 8B) to output not only the highlight spans but also the whole reasoning behind them. This additional reasoning signal produces more accurate, consistent supervision and significantly improves the quality of the resulting model.</p>
<p>At a high level, the annotation pipeline works as follows: <strong>LLM reasoning → highlight labels → filtering → final training sample.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>This design delivers three concrete benefits in practice:</p>
<ul>
<li><p><strong>Higher labeling quality</strong>: The model is prompted to <em>think first, then answer</em>. This intermediate reasoning step serves as a built-in self-check, reducing the likelihood of shallow or inconsistent labels.</p></li>
<li><p><strong>Improved observability and debuggability</strong>: Because each label is accompanied by a reasoning trace, errors become visible. This makes it easier to diagnose failure cases and quickly adjust prompts, rules, or data filters in the pipeline.</p></li>
<li><p><strong>Reusable data</strong>: Reasoning traces provide valuable context for future re-labeling. As requirements change, the same data can be revisited and refined without starting from scratch.</p></li>
</ul>
<p>Using this pipeline, we generated more than one million bilingual training samples, split roughly evenly between English and Chinese.</p>
<p>For model training, we started from BGE-M3 Reranker v2 (0.6B parameters, 8,192-token context window), adopted the Open Provence training framework, and trained for three epochs on 8× A100 GPUs, completing training in approximately five hours.</p>
<p>We will dive deeper into these technical choices—including why we rely on reasoning traces, how we selected the base model, and how the dataset was constructed—in a follow-up post.</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Benchmarking Zilliz’s Bilingual Semantic Highlighting Model<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>To assess real-world performance, we evaluated multiple semantic highlighting models across a diverse set of datasets. The benchmarks cover both in-domain and out-of-domain scenarios, in English and Chinese, to reflect the variety of content encountered in production systems.</p>
<h3 id="Datasets" class="common-anchor-header">Datasets</h3><p>We used the following datasets in our evaluation:</p>
<ul>
<li><p><strong>MultiSpanQA (English)</strong> – an in-domain multi-span question answering dataset</p></li>
<li><p><strong>WikiText-2 (English)</strong> – an out-of-domain Wikipedia corpus</p></li>
<li><p><strong>MultiSpanQA-ZH (Chinese)</strong> – a Chinese multi-span question answering dataset</p></li>
<li><p><strong>WikiText-2-ZH (Chinese)</strong> – an out-of-domain Chinese Wikipedia corpus</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Models Compared</h3><p>The models included in the comparison are:</p>
<ul>
<li><p><strong>Open Provence models</strong></p></li>
<li><p><strong>Provence / XProvence</strong> (released by Naver)</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong></p></li>
<li><p><strong>Zilliz’s bilingual semantic highlighting model</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">Results and Analysis</h3><p><strong>English Datasets:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Chinese Datasets:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Across the bilingual benchmarks, our model achieves <strong>state-of-the-art average F1 scores</strong>, outperforming all previously evaluated models and approaches. The gains are especially pronounced on the <strong>Chinese datasets</strong>, where our model significantly outperforms XProvence—the only other evaluated model with Chinese support.</p>
<p>More importantly, our model delivers balanced performance across both English and Chinese, a property that existing solutions struggle to achieve:</p>
<ul>
<li><p><strong>Open Provence</strong> supports English only</p></li>
<li><p><strong>XProvence</strong> sacrifices English performance compared to Provence</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong> lacks Chinese support and shows weak generalization</p></li>
</ul>
<p>As a result, our model avoids the common trade-offs between language coverage and performance, making it better suited for real-world bilingual deployments.</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">A Concrete Example in Practice</h3><p>Beyond benchmark scores, it is often more revealing to examine a concrete example. The following case shows how our model behaves in a real semantic highlighting scenario and why precision matters.</p>
<p><strong>Query:</strong> Who wrote the film <em>The Killing of a Sacred Deer</em>?</p>
<p><strong>Context (5 sentences):</strong></p>
<ol>
<li><p><em>The Killing of a Sacred Deer</em> is a 2017 psychological thriller film directed by Yorgos Lanthimos, with the screenplay written by Lanthimos and Efthymis Filippou.</p></li>
<li><p>The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy, Sunny Suljic, Alicia Silverstone, and Bill Camp.</p></li>
<li><p>The story is based on the ancient Greek play <em>Iphigenia in Aulis</em> by Euripides.</p></li>
<li><p>The film follows a cardiac surgeon who forms a secret friendship with a teenage boy connected to his past.</p></li>
<li><p>He introduces the boy to his family, after which mysterious illnesses begin to occur.</p></li>
</ol>
<p><strong>Correct highlight: Sentence 1</strong> is the correct answer, as it explicitly states that the screenplay was written by Yorgos Lanthimos and Efthymis Filippou.</p>
<p>This example contains a subtle trap. <strong>Sentence 3</strong> mentions Euripides, the author of the original Greek play on which the story is loosely based. However, the question asks who wrote the <em>film</em>, not the ancient source material. The correct answer is therefore the screenwriters of the movie, not the playwright from thousands of years ago.</p>
<p><strong>Results:</strong></p>
<p>The table below summarizes how different models performed on this example.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Model</strong></th><th style="text-align:center"><strong>Correct Answer Identified</strong></th><th style="text-align:center"><strong>Outcome</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Ours (Bilingual M3)</strong></td><td style="text-align:center">✓</td><td style="text-align:center">Selected sentence 1 (correct) and sentence 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Selected sentence 3 only, missed the correct answer</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Selected sentence 3 only, missed the correct answer</td></tr>
</tbody>
</table>
<p><strong>Sentence-Level Score Comparison</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Sentence</strong></th><th><strong>Ours (Bilingual M3)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Sentence 1 (film screenplay, <strong>correct</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">Sentence 3 (original play, distractor)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>Where XProvence falls short</strong></p>
<ul>
<li><p>XProvence is strongly attracted to the keywords <em>“Euripides”</em> and <em>“wrote”</em>, assigning sentence 3 an almost perfect score (0.947 and 0.802).</p></li>
<li><p>At the same time, it largely ignores the correct answer in sentence 1, assigning extremely low scores (0.133 and 0.081).</p></li>
<li><p>Even after lowering the decision threshold from 0.5 to 0.2, the model still fails to surface the correct answer.</p></li>
</ul>
<p>In other words, the model is primarily driven by surface-level keyword associations rather than the question’s actual intent.</p>
<p><strong>How our model behaves differently</strong></p>
<ul>
<li><p>Our model assigns a high score (0.915) to the correct answer in sentence 1, correctly identifying the <em>film’s screenwriters</em>.</p></li>
<li><p>It also assigns a moderate score (0.719) to sentence 3, since that sentence does mention a screenplay-related concept.</p></li>
<li><p>Crucially, the separation is clear and meaningful: <strong>0.915 vs. 0.719</strong>, a gap of nearly 0.2.</p></li>
</ul>
<p>This example highlights the core strength of our approach: moving beyond keyword-driven associations to correctly interpret user intent. Even when multiple “author” concepts appear, the model consistently highlights the one the question actually refers to.</p>
<p>We will share a more detailed evaluation report and additional case studies in a follow-up post.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Try It Out and Tell Us What You Think<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>We’ve open-sourced our bilingual semantic highlighting model on <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a>, with all model weights publicly available so you can start experimenting right away. We’d love to hear how it works for you—please share any feedback, issues, or improvement ideas as you try it out.</p>
<p>In parallel, we’re working on a production-ready inference service and integrating the model directly into <a href="https://milvus.io/">Milvus</a> as a native Semantic Highlighting API. This integration is already underway and will be available soon.</p>
<p>Semantic highlighting opens the door to a more intuitive RAG and agentic AI experience. When Milvus retrieves several long documents, the system can immediately surface the most relevant sentences, making it clear where the answer is. This doesn’t just improve the end-user experience—it also helps developers debug retrieval pipelines by showing exactly which parts of the context the system relies on.</p>
<p>We believe semantic highlighting will become a standard capability in next-generation search and RAG systems. If you have ideas, suggestions, or use cases for bilingual semantic highlighting, join our <a href="https://discord.com/invite/8uyFbECzPX">Discord channel</a> and share your thoughts. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
