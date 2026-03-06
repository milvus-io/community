---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: >
  How We Built a Semantic Highlighting Model for RAG Context Pruning and Token
  Saving
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  Learn how Zilliz built a semantic highlighting model for RAG noise filtering,
  context pruning, and token saving using encoder-only architectures, LLM
  reasoning, and large-scale bilingual training data.
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">The Problem: RAG Noise and Token Waste<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Vector search</strong> is a solid foundation for RAG systems—enterprise assistants, AI agents, customer support bots, and more. It reliably finds the documents that matter. But retrieval alone doesn’t solve the context problem. Even well-tuned indexes return chunks that are broadly relevant, while only a small fraction of the sentences inside those chunks actually answer the query.</p>
<p>In production systems, this gap shows up immediately. A single query may pull in dozens of documents, each thousands of tokens long. Only a handful of sentences contain the actual signal; the rest is context that bloats token usage, slows inference, and often distracts the LLM. The problem becomes even more obvious in agent workflows, where the queries themselves are the output of multi-step reasoning and only match small parts of the retrieved text.</p>
<p>This creates a clear need for a model that can <em><strong>identify and highlight</strong></em> <em>the useful sentences and ignore the rest</em>—essentially, sentence-level relevance filtering, or what many teams refer to as <a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>context pruning</strong></a>. The goal is simple: keep the parts that matter and drop the noise before it ever reaches the LLM.</p>
<p>Traditional keyword-based highlighting can’t solve this problem. For example, if a user asks, “How do I improve Python code execution efficiency?”, a keyword highlighter will pick out “Python” and “efficiency,” but miss the sentence that actually answers the question—“Use NumPy vectorized operations instead of loops”—because it shares no keywords with the query. What we need instead is semantic understanding, not string matching.</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">A Semantic Highlighting Model for RAG Noise Filtering and Context Pruning<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>To make this easy for RAG builders, we trained and open-sourced a <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>Semantic Highlighting model</strong></a> that identifies and highlights the sentences in retrieved documents that are more semantically aligned with the query. The model currently delivers the state-of-the-art performance on both English and Chinese and is designed to slot directly into existing RAG pipelines.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Model Details</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>License:</strong> MIT (commercial-friendly)</p></li>
<li><p><strong>Architecture:</strong> 0.6B encoder-only model based on BGE-M3 Reranker v2</p></li>
<li><p><strong>Context Window:</strong> 8192 tokens</p></li>
<li><p><strong>Supported Languages:</strong> English and Chinese</p></li>
</ul>
<p>Semantic Highlighting provides the relevance signals needed to select only the useful parts of long retrieved documents. In practice, this model enables:</p>
<ul>
<li><p><strong>Improved interpretability</strong>, showing which parts of a document actually matter</p></li>
<li><p><strong>70–80% reduction in token cost</strong> by sending only highlighted sentences to the LLM</p></li>
<li><p><strong>Better answer quality</strong>, since the model sees less irrelevant context</p></li>
<li><p><strong>Easier debugging</strong>, because engineers can inspect sentence-level matches directly</p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">Evaluation Results: Achieving SOTA Performance</h3><p>We evaluated our Semantic Highlighting model across multiple datasets spanning both English and Chinese, in both in-domain and out-of-domain conditions.</p>
<p>The benchmark suites include:</p>
<ul>
<li><p><strong>English multi-span QA:</strong> multispanqa</p></li>
<li><p><strong>English out-of-domain Wikipedia:</strong> wikitext2</p></li>
<li><p><strong>Chinese multi-span QA:</strong> multispanqa_zh</p></li>
<li><p><strong>Chinese out-of-domain Wikipedia:</strong> wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Evaluated models include:</p>
<ul>
<li><p>Open Provence series</p></li>
<li><p>Naver’s Provence/XProvence series</p></li>
<li><p>OpenSearch’s semantic-highlighter</p></li>
<li><p>Our trained bilingual model: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>Across all four datasets, our model achieves the top ranking. More importantly, it is the <em>only</em> model that performs consistently well on both English and Chinese. Competing models either focus exclusively on English or show clear performance drops on Chinese text.</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">How We Built This Semantic Highlighting Model<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Training a model for this task isn’t the hard part; training a <em>good</em> model that handles the earlier problems and delivers near-SOTA performance is where the real work happens. Our approach focused on two things:</p>
<ul>
<li><p><strong>Model architecture:</strong> use an encoder-only design for fast inference.</p></li>
<li><p><strong>Training data:</strong> generate high-quality relevance labels using reasoning-capable LLMs and scale data generation with local inference frameworks.</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">Model Architecture</h3><p>We built the model as a lightweight <strong>encoder-only</strong> network that treats context pruning as a <strong>token-level relevance scoring task</strong>. This design is inspired by <a href="https://arxiv.org/html/2501.16214v1">Provence</a>, a context-pruning approach introduced by Naver at ICLR 2025, which reframes pruning from “choose the right chunk” to “score every token.” That framing aligns naturally with semantic highlighting, where fine-grained signals are essential.</p>
<p>Encoder-only models aren’t the newest architecture, but they remain extremely practical here: they’re fast, easy to scale, and can produce relevance scores for all token positions in parallel. For a production RAG system, that speed advantage matters far more than using a larger decoder model.</p>
<p>Once we compute token-level relevance scores, we aggregate them into <strong>sentence-level</strong> scores. This step turns noisy token signals into a stable, interpretable relevance metric. Sentences above a configurable threshold are highlighted; everything else is filtered out. This produces a simple and reliable mechanism for selecting the sentences that actually matter to the query.</p>
<h3 id="Inference-Process" class="common-anchor-header">Inference Process</h3><p>At runtime, our semantic highlighting model follows a simple pipeline:</p>
<ol>
<li><p><strong>Input—</strong> The process starts with a user query. Retrieved documents are treated as candidate context for relevance evaluation.</p></li>
<li><p><strong>Model Processing—</strong> The query and context are concatenated into a single sequence: [BOS] + Query + Context</p></li>
<li><p><strong>Token Scoring—</strong> Each token in the context is assigned a relevance score between 0 and 1, reflecting how strongly it is related to the query.</p></li>
<li><p><strong>Sentence Aggregation—</strong> Token scores are aggregated at the sentence level, typically by averaging, to produce a relevance score for each sentence.</p></li>
<li><p><strong>Threshold Filtering—</strong> Sentences with scores above a configurable threshold are highlighted and retained, while low-scoring sentences are filtered out before being passed to the downstream LLM.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">Base Model: BGE-M3 Reranker v2</h3><p>We selected BGE-M3 Reranker v2 as our base model for several reasons:</p>
<ol>
<li><p>It employs an Encoder architecture suitable for token and sentence scoring</p></li>
<li><p>Supports multiple languages with optimization for both English and Chinese</p></li>
<li><p>Provides an 8192-token context window appropriate for longer RAG documents</p></li>
<li><p>Maintains 0.6B parameters—strong enough without being computationally heavy</p></li>
<li><p>Ensures sufficient world knowledge in the base model</p></li>
<li><p>Trained for reranking, which closely aligns with relevance judgment tasks</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">Training Data: LLM Annotation with Reasoning<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Once we finalized the model architecture, the next challenge was building a dataset that would actually train a reliable model. We started by looking at how Open Provence handles this. Their approach uses public QA datasets and a small LLM to label which sentences are relevant. It scales well and is easy to automate, which made it a good baseline for us.</p>
<p>But we quickly ran into the same issue they describe: if you ask an LLM to output sentence-level labels directly, the results aren’t always stable. Some labels are correct, others are questionable, and it’s hard to clean things up afterward. Fully manual annotation wasn’t an option either—we needed far more data than we could ever label by hand.</p>
<p>To improve stability without sacrificing scalability, we made one change: the LLM must provide a short reasoning snippet for every label it outputs. Each training example includes the query, the document, the sentence spans, and a brief explanation of why a sentence is relevant or irrelevant. This small adjustment made the annotations much more consistent and gave us something concrete to reference when validating or debugging the dataset.</p>
<p>Including the reasoning turned out to be surprisingly valuable:</p>
<ul>
<li><p><strong>Higher annotation quality:</strong> Writing out the reasoning works as a self-check, which reduces random or inconsistent labels.</p></li>
<li><p><strong>Better observability:</strong> We can see <em>why</em> a sentence was selected instead of treating the label as a black box.</p></li>
<li><p><strong>Easier debugging:</strong> When something looks wrong, the reasoning makes it easy to spot whether the issue is the prompt, the domain, or the annotation logic.</p></li>
<li><p><strong>Reusable data:</strong> Even if we switch to a different labeling model in the future, the reasoning traces remain useful for re-labeling or auditing.</p></li>
</ul>
<p>The annotation workflow looks like this:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8B for Annotation</h3><p>For annotation, we chose Qwen3 8B because it natively supports a “thinking mode” via outputs, making it much easier to extract consistent reasoning traces. Smaller models didn’t give us stable labels, and larger models were slower and unnecessarily expensive for this kind of pipeline. Qwen3 8B hit the right balance between quality, speed, and cost.</p>
<p>We ran all annotations using a <strong>local vLLM service</strong> instead of cloud APIs. This gave us high throughput, predictable performance, and much lower cost—essentially trading GPU time for API token fees, which is the better deal when generating millions of samples.</p>
<h3 id="Dataset-Scale" class="common-anchor-header">Dataset Scale</h3><p>In total, we built <strong>over 5 million bilingual training samples</strong>, split roughly evenly between English and Chinese.</p>
<ul>
<li><p><strong>English sources:</strong> MS MARCO, Natural Questions, GooAQ</p></li>
<li><p><strong>Chinese sources:</strong> DuReader, Chinese Wikipedia, mmarco_chinese</p></li>
</ul>
<p>Part of the dataset comes from re-annotating existing data used by projects like Open Provence. The rest was generated from raw corpora by first creating query–context pairs and then labeling them with our reasoning-based pipeline.</p>
<p>All annotated training data is also available on HuggingFace for community development and training reference: <a href="https://huggingface.co/zilliz/datasets">Zilliz Datasets</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">Training Method</h3><p>Once the model architecture and dataset were ready, we trained the model on <strong>8× A100 GPUs</strong> for three epochs, which took roughly <strong>9 hours</strong> end-to-end.</p>
<p><strong>Note:</strong> The training only targeted the <strong>Pruning Head</strong>, which is responsible for the semantic highlighting task. We did not train the <strong>Rerank Head</strong>, since focusing solely on the pruning objective yielded better results for sentence-level relevance scoring.</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">Real-World Case Study<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>Benchmarks only tell part of the story, so here’s a real example that shows how the model behaves on a common edge case: when the retrieved text contains both the correct answer and a very tempting distractor.</p>
<p><strong>Query:</strong> <em>Who wrote The Killing of a Sacred Deer?</em></p>
<p><strong>Context (5 sentences):</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>Correct answer: Sentence 1 (explicitly states “screenplay by Lanthimos and Efthymis Filippou”)</p>
<p>This example has a trap: Sentence 3 mentions that “Euripides” wrote the original play. But the question asks “who wrote the film The Killing of a Sacred Deer,” and the answer should be the film’s screenwriters, not the Greek playwright from thousands of years ago.</p>
<h3 id="Model-results" class="common-anchor-header">Model results</h3><table>
<thead>
<tr><th>Model</th><th>Finds correct answer?</th><th>Prediction</th></tr>
</thead>
<tbody>
<tr><td>Our Model</td><td>✓</td><td>Selected sentences 1 (correct) and 3</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>Only selected sentence 3, missed correct answer</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>Only selected sentence 3, missed correct answer</td></tr>
</tbody>
</table>
<p><strong>Key Sentence Score Comparison:</strong></p>
<table>
<thead>
<tr><th>Sentence</th><th>Our Model</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>Sentence 1 (film screenplay, correct answer)</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>Sentence 3 (original play, distractor)</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>XProvence models:</p>
<ul>
<li><p>Strongly attracted to “Euripides” and “play,” giving sentence 3 near-perfect scores (0.947 and 0.802)</p></li>
<li><p>Completely ignores the actual answer (sentence 1), giving extremely low scores (0.133 and 0.081)</p></li>
<li><p>Even when lowering the threshold from 0.5 to 0.2, it still can’t find the correct answer</p></li>
</ul>
<p>Our model:</p>
<ul>
<li><p>Correctly gives sentence 1 the highest score (0.915)</p></li>
<li><p>Still assigns sentence 3 some relevance (0.719) because it’s related to the background</p></li>
<li><p>Clearly separates the two with a ~0.2 margin</p></li>
</ul>
<p>This example shows the model’s core strength: understanding <strong>query intent</strong> rather than just matching surface-level keywords. In this context, “Who wrote <em>The Killing of a Sacred Deer</em>” refers to the film, not the ancient Greek play. Our model picks up on that, while others get distracted by strong lexical cues.</p>
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
    </button></h2><p>Our <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> model is now fully open-sourced under the MIT license and ready for production use. You can plug it into your RAG pipeline, fine-tune it for your own domain, or build new tools on top of it. We also welcome contributions and feedback from the community.</p>
<ul>
<li><p><strong>Download from HuggingFace</strong>: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>All annotated training data</strong>: <a href="https://huggingface.co/zilliz/datasets">https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Semantic Highlighting Available in Milvus and Zilliz Cloud</h3><p>Semantic highlighting is also built directly into <a href="https://milvus.io/">Milvus</a> and <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (the fully managed Milvus), giving users a clear view of <em>why</em> each document was retrieved. Instead of scanning entire chunks, you immediately see the specific sentences that relate to your query — even when the wording doesn’t match exactly. This makes retrieval easier to understand and much faster to debug. For RAG pipelines, it also clarifies what the downstream LLM is expected to focus on, which helps with prompt design and quality checks.</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>Try Semantic Highlighting in a fully managed Zilliz Cloud for free</strong></a></p>
<p>We’d love to hear how it works for you—bug reports, improvement ideas, or anything you discover while integrating it into your workflow.</p>
<p>If you want to talk through anything in more detail, feel free to join our <a href="https://discord.com/invite/8uyFbECzPX">Discord channel</a> or book a 20-minute <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> session. We’re always happy to chat with other builders and swap notes.</p>
<h2 id="Acknowledgements" class="common-anchor-header">Acknowledgements<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>This work builds on a lot of great ideas and open-source contributions, and we want to highlight the projects that made this model possible.</p>
<ul>
<li><p><strong>Provence</strong> introduced a clean and practical framing for context pruning using lightweight encoder models.</p></li>
<li><p><strong>Open Provence</strong> provided a solid, well-engineered codebase—training pipelines, data processing, and model heads—under a permissive license. It gave us a strong starting point for experimentation.</p></li>
</ul>
<p>On top of that foundation, we added several contributions of our own:</p>
<ul>
<li><p>Using <strong>LLM reasoning</strong> to generate higher-quality relevance labels</p></li>
<li><p>Creating <strong>nearly 5 million</strong> bilingual training samples aligned with real RAG workloads</p></li>
<li><p>Choosing a base model better suited for long-context relevance scoring (<strong>BGE-M3 Reranker v2</strong>)</p></li>
<li><p>Training only the <strong>Pruning Head</strong> to specialize the model for semantic highlighting</p></li>
</ul>
<p>We’re grateful to the Provence and Open Provence teams for publishing their work openly. Their contributions significantly accelerated our development and made this project possible.</p>
