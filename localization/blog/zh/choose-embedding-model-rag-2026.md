---
id: choose-embedding-model-rag-2026.md
title: |
  How to Choose the Best Embedding Model for RAG in 2026: 10 Models Benchmarked
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >
  We benchmarked 10 embedding models on cross-modal, cross-lingual,
  long-document, and dimension compression tasks. See which one fits your RAG
  pipeline.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR:</strong> We tested 10 <a href="https://zilliz.com/ai-models">embedding models</a> across four production scenarios that public benchmarks miss: cross-modal retrieval, cross-lingual retrieval, key information retrieval, and dimension compression. No single model wins everything. Gemini Embedding 2 is the best all-rounder. Open-source Qwen3-VL-2B beats closed-source APIs on cross-modal tasks. If you need to compress dimensions to save storage, go with Voyage Multimodal 3.5 or Jina Embeddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">Why MTEB Isn’t Enough for Choosing an Embedding Model<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Most <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> prototypes start with OpenAI’s text-embedding-3-small. It’s cheap, easy to integrate, and for English text retrieval it works well enough. But production RAG outgrows it fast. Your pipeline picks up images, PDFs, multilingual documents — and a text-only <a href="https://zilliz.com/ai-models">embedding model</a> stops being enough.</p>
<p>The <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB leaderboard</a> tells you there are better options. The problem? MTEB only tests single-language text retrieval. It doesn’t cover cross-modal retrieval (text queries against image collections), cross-lingual search (a Chinese query finding an English document), long-document accuracy, or how much quality you lose when you truncate <a href="https://zilliz.com/glossary/dimension">embedding dimensions</a> to save storage in your <a href="https://zilliz.com/learn/what-is-a-vector-database">vector database</a>.</p>
<p>So which embedding model should you use? It depends on your data types, your languages, your document lengths, and whether you need dimension compression. We built a benchmark called <strong>CCKM</strong> and tested 10 models released between 2025 and 2026 across exactly those dimensions.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">What Is the CCKM Benchmark?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong> (Cross-modal, Cross-lingual, Key information, MRL) tests four capabilities that standard benchmarks miss:</p>
<table>
<thead>
<tr><th>Dimension</th><th>What It Tests</th><th>Why It Matters</th></tr>
</thead>
<tbody>
<tr><td><strong>Cross-modal retrieval</strong></td><td>Match text descriptions to the correct image when near-identical distractors are present</td><td><a href="https://zilliz.com/learn/multimodal-rag">Multimodal RAG</a> pipelines need text and image embeddings in the same vector space</td></tr>
<tr><td><strong>Cross-lingual retrieval</strong></td><td>Find the correct English document from a Chinese query, and vice versa</td><td>Production knowledge bases are often multilingual</td></tr>
<tr><td><strong>Key information retrieval</strong></td><td>Locate a specific fact buried in a 4K–32K character document (needle-in-a-haystack)</td><td>RAG systems frequently process long documents like contracts and research papers</td></tr>
<tr><td><strong>MRL dimension compression</strong></td><td>Measure how much quality the model loses when you truncate embeddings to 256 dimensions</td><td>Fewer dimensions = lower storage cost in your vector database, but at what quality cost?</td></tr>
</tbody>
</table>
<p>MTEB covers none of these. MMEB adds multimodal but skips hard negatives, so models score high without proving they handle subtle distinctions. CCKM is designed to cover what they miss.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">Which Embedding Models Did We Test? Gemini Embedding 2, Jina Embeddings v4, and More<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>We tested 10 models covering both API services and open-source options, plus CLIP ViT-L-14 as a 2021 baseline.</p>
<table>
<thead>
<tr><th>Model</th><th>Source</th><th>Parameters</th><th>Dimensions</th><th>Modality</th><th>Key Trait</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>Google</td><td>Undisclosed</td><td>3072</td><td>Text / image / video / audio / PDF</td><td>All-modality, widest coverage</td></tr>
<tr><td>Jina Embeddings v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>Text / image / PDF</td><td>MRL + LoRA adapters</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>Undisclosed</td><td>1024</td><td>Text / image / video</td><td>Balanced across tasks</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>Alibaba Qwen</td><td>2B</td><td>2048</td><td>Text / image / video</td><td>Open-source, lightweight multimodal</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>Text / image</td><td>Modernized CLIP architecture</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>Undisclosed</td><td>Fixed</td><td>Text</td><td>Enterprise retrieval</td></tr>
<tr><td>OpenAI text-embedding-3-large</td><td>OpenAI</td><td>Undisclosed</td><td>3072</td><td>Text</td><td>Most widely used</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>Text</td><td>Open-source, 100+ languages</td></tr>
<tr><td>mxbai-embed-large</td><td>Mixedbread AI</td><td>335M</td><td>1024</td><td>Text</td><td>Lightweight, English-focused</td></tr>
<tr><td>nomic-embed-text</td><td>Nomic AI</td><td>137M</td><td>768</td><td>Text</td><td>Ultra-lightweight</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>Text / image</td><td>Baseline</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">Cross-Modal Retrieval: Which Models Handle Text-to-Image Search?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>If your RAG pipeline handles images alongside text, the embedding model needs to place both modalities in the same <a href="https://zilliz.com/glossary/vector-embeddings">vector space</a>. Think e-commerce image search, mixed image-text knowledge bases, or any system where a text query needs to find the right image.</p>
<h3 id="Method" class="common-anchor-header">Method</h3><p>We took 200 image-text pairs from COCO val2017. For each image, GPT-4o-mini generated a detailed description. Then we wrote 3 hard negatives per image — descriptions that differ from the correct one by just one or two details. The model has to find the right match in a pool of 200 images and 600 distractors.</p>
<p>An example from the dataset:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
    <span>Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark</span>
  </span>
</p>
<blockquote>
<p><strong>Correct description:</strong> “The image features vintage brown leather suitcases with various travel stickers including 'California’, 'Cuba’, and 'New York’, placed on a metal luggage rack against a clear blue sky.”</p>
<p><strong>Hard negative:</strong> Same sentence, but “California” becomes “Florida” and “blue sky” becomes “overcast sky.” The model has to actually understand the image details to tell these apart.</p>
</blockquote>
<p><strong>Scoring:</strong></p>
<ul>
<li>Generate <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> for all images and all text (200 correct descriptions + 600 hard negatives).</li>
<li><strong>Text-to-image (t2i):</strong> Each description searches 200 images for the closest match. Score a point if the top result is correct.</li>
<li><strong>Image-to-text (i2t):</strong> Each image searches all 800 texts for the closest match. Score a point only if the top result is the correct description, not a hard negative.</li>
<li><strong>Final score:</strong> hard_avg_R@1 = (t2i accuracy + i2t accuracy) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Results</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
    <span>Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768</span>
  </span>
</p>
<p>Qwen3-VL-2B, an open-source 2B parameter model from Alibaba’s Qwen team, came in first — ahead of every closed-source API.</p>
<p><strong>Modality gap</strong> explains most of the difference. Embedding models map text and images into the same vector space, but in practice the two modalities tend to cluster in different regions. The modality gap measures the L2 distance between those two clusters. Smaller gap = easier cross-modal retrieval.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
    <span>Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier</span>
  </span>
</p>
<table>
<thead>
<tr><th>Model</th><th>Score (R@1)</th><th>Modality Gap</th><th>Params</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (open-source)</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.928</td><td>0.73</td><td>Unknown (closed)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>Unknown (closed)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Qwen’s modality gap is 0.25 — roughly a third of Gemini’s 0.73. In a <a href="https://zilliz.com/learn/what-is-a-vector-database">vector database</a> like <a href="https://milvus.io/">Milvus</a>, a small modality gap means you can store text and image embeddings in the same <a href="https://milvus.io/docs/manage-collections.md">collection</a> and <a href="https://milvus.io/docs/single-vector-search.md">search</a> across both directly. A large gap can make cross-modal <a href="https://zilliz.com/glossary/similarity-search">similarity search</a> less reliable, and you may need a re-ranking step to compensate.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">Cross-Lingual Retrieval: Which Models Align Meaning Across Languages?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Multilingual knowledge bases are common in production. A user asks a question in Chinese, but the answer lives in an English document — or the other way around. The embedding model needs to align meaning across languages, not just within one.</p>
<h3 id="Method" class="common-anchor-header">Method</h3><p>We built 166 parallel sentence pairs in Chinese and English across three difficulty levels:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
    <span>Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives</span>
  </span>
</p>
<p>Each language also gets 152 hard negative distractors.</p>
<p><strong>Scoring:</strong></p>
<ul>
<li>Generate embeddings for all Chinese text (166 correct + 152 distractors) and all English text (166 correct + 152 distractors).</li>
<li><strong>Chinese → English:</strong> Each Chinese sentence searches 318 English texts for its correct translation.</li>
<li><strong>English → Chinese:</strong> Same in reverse.</li>
<li><strong>Final score:</strong> hard_avg_R@1 = (zh→en accuracy + en→zh accuracy) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Results</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
    <span>Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120</span>
  </span>
</p>
<p>Gemini Embedding 2 scored 0.997 — the highest of any model tested. It was the only model to score a perfect 1.000 on the Hard tier, where pairs like “画蛇添足” → “gilding the lily” require genuine <a href="https://zilliz.com/glossary/semantic-search">semantic</a> understanding across languages, not pattern matching.</p>
<table>
<thead>
<tr><th>Model</th><th>Score (R@1)</th><th>Easy</th><th>Medium</th><th>Hard (idioms)</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-large</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>The top 7 models all clear 0.93 on the overall score — the real differentiation happens on the Hard tier (Chinese idioms). nomic-embed-text and mxbai-embed-large, both English-focused lightweight models, score near zero on cross-lingual tasks.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">Key Information Retrieval: Can Models Find a Needle in a 32K-Token Document?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG systems often process lengthy documents — legal contracts, research papers, internal reports containing <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstructured data</a>. The question is whether an embedding model can still find one specific fact buried in thousands of characters of surrounding text.</p>
<h3 id="Method" class="common-anchor-header">Method</h3><p>We took Wikipedia articles of varying lengths (4K to 32K characters) as the haystack and inserted a single fabricated fact — the needle — at different positions: start, 25%, 50%, 75%, and end. The model has to determine, based on a query embedding, which version of the document contains the needle.</p>
<p><strong>Example:</strong></p>
<ul>
<li><strong>Needle:</strong> “The Meridian Corporation reported quarterly revenue of $847.3 million in Q3 2025.”</li>
<li><strong>Query:</strong> “What was Meridian Corporation’s quarterly revenue?”</li>
<li><strong>Haystack:</strong> A 32,000-character Wikipedia article about photosynthesis, with the needle hidden somewhere inside.</li>
</ul>
<p><strong>Scoring:</strong></p>
<ul>
<li>Generate embeddings for the query, the document with the needle, and the document without.</li>
<li>If the query is more similar to the document containing the needle, count it as a hit.</li>
<li>Average accuracy across all document lengths and needle positions.</li>
<li><strong>Final metrics:</strong> overall_accuracy and degradation_rate (how much accuracy drops from shortest to longest document).</li>
</ul>
<h3 id="Results" class="common-anchor-header">Results</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
    <span>Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+</span>
  </span>
</p>
<p>Gemini Embedding 2 is the only model tested across the full 4K–32K range, and it scored perfectly at every length. No other model in this test has a context window that reaches 32K.</p>
<table>
<thead>
<tr><th>Model</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>Overall</th><th>Degradation</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-large</td><td>1.000</td><td>1.000</td><td>1.000</td><td>—</td><td>—</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Embeddings v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>—</td><td>—</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>—</td><td>—</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>—</td><td>—</td><td>—</td><td>1.000</td><td>0%</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>1.000</td><td>1.000</td><td>—</td><td>—</td><td>—</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>—</td><td>—</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>—</td><td>—</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>—</td><td>—</td><td>0.660</td><td>58%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>—</td><td>—</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>“—” means the document length exceeds the model’s context window.</p>
<p>The top 7 models score perfectly within their context windows. BGE-M3 starts to slip at 8K (0.920). The lightweight models (mxbai and nomic) drop to 0.4–0.6 at just 4K characters — roughly 1,000 tokens. For mxbai, this drop partly reflects its 512-token context window truncating most of the document.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">MRL Dimension Compression: How Much Quality Do You Lose at 256 Dimensions?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Matryoshka Representation Learning (MRL)</strong> is a training technique that makes the first N dimensions of a vector meaningful on their own. Take a 3072-dimension vector, truncate it to 256, and it still holds most of its semantic quality. Fewer dimensions mean lower storage and memory costs in your <a href="https://zilliz.com/learn/what-is-a-vector-database">vector database</a> — going from 3072 to 256 dimensions is a 12x storage reduction.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
    <span>Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions</span>
  </span>
</p>
<h3 id="Method" class="common-anchor-header">Method</h3><p>We used 150 sentence pairs from the STS-B benchmark, each with a human-annotated similarity score (0–5). For each model, we generated embeddings at full dimensions, then truncated to 1024, 512, and 256.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
    <span>STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6</span>
  </span>
</p>
<p><strong>Scoring:</strong></p>
<ul>
<li>At each dimension level, compute the <a href="https://zilliz.com/glossary/cosine-similarity">cosine similarity</a> between each sentence pair’s embeddings.</li>
<li>Compare the model’s similarity ranking to the human ranking using <strong>Spearman’s ρ</strong> (rank correlation).</li>
</ul>
<blockquote>
<p><strong>What is Spearman’s ρ?</strong> It measures how well two rankings agree. If humans rank pair A as most similar, B second, C least — and the model’s cosine similarities produce the same order A &gt; B &gt; C — then ρ approaches 1.0. A ρ of 1.0 means perfect agreement. A ρ of 0 means no correlation.</p>
</blockquote>
<p><strong>Final metrics:</strong> spearman_rho (higher is better) and min_viable_dim (the smallest dimension where quality stays within 5% of full-dimension performance).</p>
<h3 id="Results" class="common-anchor-header">Results</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
    <span>Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom</span>
  </span>
</p>
<p>If you’re planning to reduce storage costs in <a href="https://milvus.io/">Milvus</a> or another vector database by truncating dimensions, this result matters.</p>
<table>
<thead>
<tr><th>Model</th><th>ρ (full dim)</th><th>ρ (256 dim)</th><th>Decay</th></tr>
</thead>
<tbody>
<tr><td>Voyage Multimodal 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-large</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage and Jina v4 lead because both were explicitly trained with MRL as an objective. Dimension compression has little to do with model size — whether the model was trained for it is what matters.</p>
<p>A note on Gemini’s score: the MRL ranking reflects how well a model preserves quality after truncation, not how good its full-dimension retrieval is. Gemini’s full-dimension retrieval is strong — the cross-lingual and key information results already proved that. It just wasn’t optimized for shrinking. If you don’t need dimension compression, this metric doesn’t apply to you.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">Which Embedding Model Should You Use?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>No single model wins everything. Here’s the full scorecard:</p>
<table>
<thead>
<tr><th>Model</th><th>Params</th><th>Cross-Modal</th><th>Cross-Lingual</th><th>Key Info</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>Undisclosed</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Undisclosed</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Embeddings v4</td><td>3.8B</td><td>—</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-large</td><td>Undisclosed</td><td>—</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>Undisclosed</td><td>—</td><td>0.955</td><td>1.000</td><td>—</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>—</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>—</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-large</td><td>335M</td><td>—</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>nomic-embed-text</td><td>137M</td><td>—</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>—</td><td>—</td></tr>
</tbody>
</table>
<p>“—” means the model doesn’t support that modality or capability. CLIP is a 2021 baseline for reference.</p>
<p>Here’s what stands out:</p>
<ul>
<li><strong>Cross-modal:</strong> Qwen3-VL-2B (0.945) first, Gemini (0.928) second, Voyage (0.900) third. An open-source 2B model beat every closed-source API. The deciding factor was modality gap, not parameter count.</li>
<li><strong>Cross-lingual:</strong> Gemini (0.997) leads — the only model to score perfectly on idiom-level alignment. The top 8 models all clear 0.93. English-only lightweight models score near zero.</li>
<li><strong>Key information:</strong> API and large open-source models score perfectly up to 8K. Models below 335M start degrading at 4K. Gemini is the only model that handles 32K with a perfect score.</li>
<li><strong>MRL dimension compression:</strong> Voyage (0.880) and Jina v4 (0.833) lead, losing less than 1% at 256 dimensions. Gemini (0.668) comes last — strong at full dimension, not optimized for truncation.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">How to Pick: A Decision Flowchart</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
    <span>Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large</span>
  </span>
</p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">The Best All-Rounder: Gemini Embedding 2</h3><p>On balance, Gemini Embedding 2 is the strongest overall model in this benchmark.</p>
<p><strong>Strengths:</strong> First in cross-lingual (0.997) and key information retrieval (1.000 across all lengths up to 32K). Second in cross-modal (0.928). Widest modality coverage — five modalities (text, image, video, audio, PDF) where most models top out at three.</p>
<p><strong>Weaknesses:</strong> Last in MRL compression (ρ = 0.668). Beaten on cross-modal by the open-source Qwen3-VL-2B.</p>
<p>If you don’t need dimension compression, Gemini has no real competitor on the combination of cross-lingual + long-document retrieval. But for cross-modal precision or storage optimization, specialized models do better.</p>
<h2 id="Limitations" class="common-anchor-header">Limitations<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>We didn’t include every model worth considering — NVIDIA’s NV-Embed-v2 and Jina’s v5-text were on the list but didn’t make this round.</li>
<li>We focused on text and image modalities; video, audio, and PDF embedding (despite some models claiming support) weren’t covered.</li>
<li>Code retrieval and other domain-specific scenarios were out of scope.</li>
<li>Sample sizes were relatively small, so tight ranking differences between models may fall within statistical noise.</li>
</ul>
<p>This article’s results will be outdated within a year. New models ship constantly, and the leaderboard reshuffles with every release. The more durable investment is building your own evaluation pipeline — define your data types, your query patterns, your document lengths, and run new models through your own tests when they drop. Public benchmarks like MTEB, MMTEB, and MMEB are worth monitoring, but the final call should always come from your own data.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">Our benchmark code is open-source on GitHub</a> — fork it and adapt it to your use case.</p>
<hr>
<p>Once you’ve picked your embedding model, you need somewhere to store and search those vectors at scale. <a href="https://milvus.io/">Milvus</a> is the world’s most widely adopted open-source vector database with <a href="https://github.com/milvus-io/milvus">43K+ GitHub stars</a> built for exactly this — it supports MRL-truncated dimensions, mixed multimodal collections, hybrid search combining dense and sparse vectors, and <a href="https://milvus.io/docs/architecture_overview.md">scales from a laptop to billions of vectors</a>.</p>
<ul>
<li>Get started with the <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart guide</a>, or install with <code translate="no">pip install pymilvus</code>.</li>
<li>Join the <a href="https://milvusio.slack.com/">Milvus Slack</a> or <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> to ask questions about embedding model integration, vector indexing strategies, or production scaling.</li>
<li><a href="https://milvus.io/office-hours">Book a free Milvus Office Hours session</a> to walk through your RAG architecture — we can help with model selection, collection schema design, and performance tuning.</li>
<li>If you’d rather skip the infrastructure work, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) offers a free tier to get started.</li>
</ul>
<hr>
<p>A few questions that come up when engineers are choosing an embedding model for production RAG:</p>
<p><strong>Q: Should I use a multimodal embedding model even if I only have text data right now?</strong></p>
<p>It depends on your roadmap. If your pipeline will likely add images, PDFs, or other modalities within the next 6–12 months, starting with a multimodal model like Gemini Embedding 2 or Voyage Multimodal 3.5 avoids a painful migration later — you won’t need to re-embed your entire dataset. If you’re confident it’s text-only for the foreseeable future, a text-focused model like OpenAI 3-large or Cohere Embed v4 will give you better price/performance.</p>
<p><strong>Q: How much storage does MRL dimension compression actually save in a vector database?</strong></p>
<p>Going from 3072 dimensions to 256 dimensions is a 12x reduction in storage per vector. For a <a href="https://milvus.io/">Milvus</a> collection with 100 million vectors at float32, that’s roughly 1.14 TB → 95 GB. The key is that not all models handle truncation well — Voyage Multimodal 3.5 and Jina Embeddings v4 lose less than 1% quality at 256 dimensions, while others degrade significantly.</p>
<p><strong>Q: Is Qwen3-VL-2B really better than Gemini Embedding 2 for cross-modal search?</strong></p>
<p>On our benchmark, yes — Qwen3-VL-2B scored 0.945 versus Gemini’s 0.928 on hard cross-modal retrieval with near-identical distractors. The main reason is Qwen’s much smaller modality gap (0.25 vs 0.73), which means text and image <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> cluster closer together in vector space. That said, Gemini covers five modalities while Qwen covers three, so if you need audio or PDF embedding, Gemini is the only option.</p>
<p><strong>Q: Can I use these embedding models with Milvus directly?</strong></p>
<p>Yes. All of these models output standard float vectors, which you can <a href="https://milvus.io/docs/insert-update-delete.md">insert into Milvus</a> and search with <a href="https://zilliz.com/glossary/cosine-similarity">cosine similarity</a>, L2 distance, or inner product. <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> works with any embedding model — generate your vectors with the model’s SDK, then store and search them in Milvus. For MRL-truncated vectors, just set the collection’s dimension to your target (e.g., 256) when <a href="https://milvus.io/docs/manage-collections.md">creating the collection</a>.</p>
