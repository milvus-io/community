---
id: hands-on-rag-with-qwen3-embedding-and-reranking-models-using-milvus.md
title: Hands-on RAG with Qwen3 Embedding and Reranking Models using Milvus
author: Lumina
date: 2025-6-30
desc: >-
  A tutorial to build an RAG system with the newly-released Qwen3 embedding and
  reranking models.
cover: assets.zilliz.com/Chat_GPT_Image_Jun_30_2025_07_41_03_PM_e049bf71fb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, RAG, Embedding'
meta_title: Hands-on RAG with Qwen3 Embedding and Reranking Models using Milvus
origin: >-
  https://milvus.io/blog/hands-on-rag-with-qwen3-embedding-and-reranking-models-using-milvus.md
---
<p>If you’ve been keeping an eye on the embedding model space, you’ve probably noticed Alibaba just dropped their <a href="https://qwenlm.github.io/blog/qwen3-embedding/">Qwen3 Embedding series</a>. They released both embedding and reranking models in three sizes each (0.6B, 4B, 8B), all built on the Qwen3 foundation models and designed specifically for retrieval tasks.</p>
<p>The Qwen3 series has a few features I found interesting:</p>
<ul>
<li><p><strong>Multilingual embeddings</strong> - they claim a unified semantic space across 100+ languages</p></li>
<li><p><strong>Instruction prompting</strong> - you can pass custom instructions to modify embedding behavior</p></li>
<li><p><strong>Variable dimensions</strong> - supports different embedding sizes via Matryoshka Representation Learning</p></li>
<li><p><strong>32K context length</strong> - can process longer input sequences</p></li>
<li><p><strong>Standard dual/cross-encoder setup</strong> - embedding model uses dual-encoder, reranker uses cross-encoder</p></li>
</ul>
<p>Looking at the benchmarks, Qwen3-Embedding-8B achieved a score of 70.58 on the MTEB multilingual leaderboard, surpassing BGE, E5, and even Google Gemini. The Qwen3-Reranker-8B hit 69.02 on multilingual ranking tasks. These aren’t just “pretty good among open-source models” - they’re comprehensively matching or even surpassing mainstream commercial APIs. In RAG retrieval, cross-language search, and code search systems, especially in Chinese contexts, these models already have production-ready capabilities.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdZCKoPqf8mpxwQ_s-gGbdHYvw_HhWn6Ib62v8C_VEZF8AOSnY1yLEEv1ztkINpmwgHAVC5kZw6rWplfx5OkISf_gL4VvoqlXxSfs8s_qd8mdBuA0HBhP9kEdipXy0QVuPmEyOJRg?key=nqzZfIwgkzdlEZQ2MYSMGQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdNppvBpn_5M9d6WDb0-pCjgTobVc9eFw_m6m6Vg73wJtB9OvcPFw5089FUui_N2-LbJVjJPe1c8_EnYY4F3Ryw0021kvmJ0jU0Q06qG2ZX2D1vywIyd5aKqO_cx-77U_spMVr8cQ?key=nqzZfIwgkzdlEZQ2MYSMGQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>As someone who’s likely dealt with the usual suspects (OpenAI’s embeddings, BGE, E5), you might be wondering if these are worth your time. Spoiler: they are.</p>
<h2 id="What-Were-Building" class="common-anchor-header">What We’re Building<button data-href="#What-Were-Building" class="anchor-icon" translate="no">
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
    </button></h2><p>This tutorial walks through building a complete RAG system using Qwen3-Embedding-0.6B and Qwen3-Reranker-0.6B with Milvus. We’ll implement a two-stage retrieval pipeline:</p>
<ol>
<li><p><strong>Dense retrieval</strong> with Qwen3 embeddings for fast candidate selection</p></li>
<li><p><strong>Reranking</strong> with Qwen3 cross-encoder for precision refinement</p></li>
<li><p><strong>Generation</strong> with OpenAI’s GPT-4 for final responses</p></li>
</ol>
<p>By the end, you’ll have a working system that handles multilingual queries, uses instruction prompting for domain tuning, and balances speed with accuracy through intelligent reranking.</p>
<h2 id="Environment-Setup" class="common-anchor-header">Environment Setup<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s start with the dependencies. Note the minimum version requirements - they’re important for compatibility:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm sentence-transformers transformers
<button class="copy-code-btn"></button></code></pre>
<p><em>Requires transformers&gt;=4.51.0 and sentence-transformers&gt;=2.7.0</em></p>
<p>For this tutorial, we’ll use OpenAI as our generation model. Set up your API key:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Data-Preparation" class="common-anchor-header"><strong>Data Preparation</strong><button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>We’ll use Milvus documentation as our knowledge base - it’s a good mix of technical content that tests both retrieval and generation quality.</p>
<p>Download and extract the documentation:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Load and chunk the markdown files. We’re using a simple header-based splitting strategy here - for production systems, consider more sophisticated chunking approaches:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Model-Setup" class="common-anchor-header"><strong>Model Setup</strong><button data-href="#Model-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Now let’s initialize our models. We’re using the lightweight 0.6B versions, which offer a good balance of performance and resource requirements:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoModel, AutoTokenizer, AutoModelForCausalLM

<span class="hljs-comment"># Initialize OpenAI client for LLM generation</span>
openai_client = OpenAI()

<span class="hljs-comment"># Load Qwen3-Embedding-0.6B model for text embeddings</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&quot;Qwen/Qwen3-Embedding-0.6B&quot;</span>)

<span class="hljs-comment"># Load Qwen3-Reranker-0.6B model for reranking</span>
reranker_tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&quot;Qwen/Qwen3-Reranker-0.6B&quot;</span>, padding_side=<span class="hljs-string">&#x27;left&#x27;</span>)
reranker_model = AutoModelForCausalLM.from_pretrained(<span class="hljs-string">&quot;Qwen/Qwen3-Reranker-0.6B&quot;</span>).<span class="hljs-built_in">eval</span>()

<span class="hljs-comment"># Reranker configuration</span>
token_false_id = reranker_tokenizer.convert_tokens_to_ids(<span class="hljs-string">&quot;no&quot;</span>)
token_true_id = reranker_tokenizer.convert_tokens_to_ids(<span class="hljs-string">&quot;yes&quot;</span>)
max_reranker_length = <span class="hljs-number">8192</span>

prefix = <span class="hljs-string">&quot;&lt;|im_start|&gt;system\nJudge whether the Document meets the requirements based on the Query and the Instruct provided. Note that the answer can only be \&quot;yes\&quot; or \&quot;no\&quot;.&lt;|im_end|&gt;\n&lt;|im_start|&gt;user\n&quot;</span>
suffix = <span class="hljs-string">&quot;&lt;|im_end|&gt;\n&lt;|im_start|&gt;assistant\n&lt;think&gt;\n\n&lt;/think&gt;\n\n&quot;</span>
prefix_tokens = reranker_tokenizer.encode(prefix, add_special_tokens=<span class="hljs-literal">False</span>)
suffix_tokens = reranker_tokenizer.encode(suffix, add_special_tokens=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p>The expected output:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdaUrXQrAs2W8-rGT9njJHEKnQ8YwREmULO6xYJnpPy7bwsmZImDRt_3EMwJuVM3k3zI7pbNvY1fDsqMKYq-rrNArx_gxOA4ZTi0g1tkRIlUqJfx1z2nZ60ATPW0L5t6I_XLTVf?key=nqzZfIwgkzdlEZQ2MYSMGQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Embedding-Function" class="common-anchor-header">Embedding Function<button data-href="#Embedding-Function" class="anchor-icon" translate="no">
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
    </button></h2><p>The key insight with Qwen3 embeddings is the ability to use different prompts for queries versus documents. This seemingly small detail can significantly improve retrieval performance:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">emb_text</span>(<span class="hljs-params">text, is_query=<span class="hljs-literal">False</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;
    Generate text embeddings using Qwen3-Embedding-0.6B model.
    
    Args:
        text: Input text to embed
        is_query: Whether this is a query (True) or document (False)
    
    Returns:
        List of embedding values
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> is_query:
        <span class="hljs-comment"># For queries, use the &quot;query&quot; prompt for better retrieval performance</span>
        embeddings = embedding_model.encode([text], prompt_name=<span class="hljs-string">&quot;query&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># For documents, use default encoding</span>
        embeddings = embedding_model.encode([text])
    
    <span class="hljs-keyword">return</span> embeddings[<span class="hljs-number">0</span>].tolist()
<button class="copy-code-btn"></button></code></pre>
<p>Let’s test the embedding function and check the output dimensions:</p>
<pre><code translate="no">test_embedding = emb_text(<span class="hljs-string">&quot;This is a test&quot;</span>)
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Expected output:</p>
<pre><code translate="no">Embedding dimension: 1024
First 10 values: [-0.009923271834850311, -0.030248118564486504, -0.011494234204292297, ...]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Reranking-Implementation" class="common-anchor-header">Reranking Implementation<button data-href="#Reranking-Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>The reranker uses a cross-encoder architecture to evaluate query-document pairs. This is more computationally expensive than the dual-encoder embedding model, but provides much more nuanced relevance scoring.</p>
<p>Here’s the complete reranking pipeline:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">format_instruction</span>(<span class="hljs-params">instruction, query, doc</span>):
    <span class="hljs-string">&quot;&quot;&quot;Format instruction for reranker input&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> instruction <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
        instruction = <span class="hljs-string">&#x27;Given a web search query, retrieve relevant passages that answer the query&#x27;</span>
    output = <span class="hljs-string">&quot;&lt;Instruct&gt;: {instruction}\n&lt;Query&gt;: {query}\n&lt;Document&gt;: {doc}&quot;</span>.<span class="hljs-built_in">format</span>(
        instruction=instruction, query=query, doc=doc
    )
    <span class="hljs-keyword">return</span> output

<span class="hljs-keyword">def</span> <span class="hljs-title function_">process_inputs</span>(<span class="hljs-params">pairs</span>):
    <span class="hljs-string">&quot;&quot;&quot;Process inputs for reranker&quot;&quot;&quot;</span>
    inputs = reranker_tokenizer(
        pairs, padding=<span class="hljs-literal">False</span>, truncation=<span class="hljs-string">&#x27;longest_first&#x27;</span>,
        return_attention_mask=<span class="hljs-literal">False</span>, max_length=max_reranker_length - <span class="hljs-built_in">len</span>(prefix_tokens) - <span class="hljs-built_in">len</span>(suffix_tokens)
    )
    <span class="hljs-keyword">for</span> i, ele <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(inputs[<span class="hljs-string">&#x27;input_ids&#x27;</span>]):
        inputs[<span class="hljs-string">&#x27;input_ids&#x27;</span>][i] = prefix_tokens + ele + suffix_tokens
    inputs = reranker_tokenizer.pad(inputs, padding=<span class="hljs-literal">True</span>, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>, max_length=max_reranker_length)
    <span class="hljs-keyword">for</span> key <span class="hljs-keyword">in</span> inputs:
        inputs[key] = inputs[key].to(reranker_model.device)
    <span class="hljs-keyword">return</span> inputs

<span class="hljs-meta">@torch.no_grad()</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_logits</span>(<span class="hljs-params">inputs, **kwargs</span>):
    <span class="hljs-string">&quot;&quot;&quot;Compute relevance scores using reranker&quot;&quot;&quot;</span>
    batch_scores = reranker_model(**inputs).logits[:, -<span class="hljs-number">1</span>, :]
    true_vector = batch_scores[:, token_true_id]
    false_vector = batch_scores[:, token_false_id]
    batch_scores = torch.stack([false_vector, true_vector], dim=<span class="hljs-number">1</span>)
    batch_scores = torch.nn.functional.log_softmax(batch_scores, dim=<span class="hljs-number">1</span>)
    scores = batch_scores[:, <span class="hljs-number">1</span>].exp().tolist()
    <span class="hljs-keyword">return</span> scores

<span class="hljs-keyword">def</span> <span class="hljs-title function_">rerank_documents</span>(<span class="hljs-params">query, documents, task_instruction=<span class="hljs-literal">None</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;
    Rerank documents based on query relevance using Qwen3-Reranker
    
    Args:
        query: Search query
        documents: List of documents to rerank
        task_instruction: Task instruction for reranking
    
    Returns:
        List of (document, score) tuples sorted by relevance score
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> task_instruction <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
        task_instruction = <span class="hljs-string">&#x27;Given a web search query, retrieve relevant passages that answer the query&#x27;</span>
    
    <span class="hljs-comment"># Format inputs for reranker</span>
    pairs = [format_instruction(task_instruction, query, doc) <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    
    <span class="hljs-comment"># Process inputs and compute scores</span>
    inputs = process_inputs(pairs)
    scores = compute_logits(inputs)
    
    <span class="hljs-comment"># Combine documents with scores and sort by score (descending)</span>
    doc_scores = <span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(documents, scores))
    doc_scores.sort(key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-number">1</span>], reverse=<span class="hljs-literal">True</span>)
    
    <span class="hljs-keyword">return</span> doc_scores
<button class="copy-code-btn"></button></code></pre>
<h2 id="Setting-Up-Milvus-Vector-Database" class="common-anchor-header">Setting Up Milvus Vector Database<button data-href="#Setting-Up-Milvus-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Now let’s set up our vector database. We’re using Milvus Lite for simplicity, but the same code works with full Milvus deployments:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Deployment Options:</strong></p>
<ul>
<li><p><strong>Local file</strong> (like <code translate="no">./milvus.db</code>): Uses Milvus Lite, perfect for development</p></li>
<li><p><strong>Docker/Kubernetes</strong>: Use server URI like <code translate="no">http://localhost:19530</code> for production</p></li>
<li><p><strong>Zilliz Cloud</strong>: Use cloud endpoint and API key for managed service</p></li>
</ul>
<p>Clean up any existing collection and create a new one:</p>
<pre><code translate="no"><span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection with our embedding dimensions</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,  <span class="hljs-comment"># 1024 for Qwen3-Embedding-0.6B</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product for similarity</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Ensure data consistency</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Loading-Data-into-Milvus" class="common-anchor-header">Loading Data into Milvus<button data-href="#Loading-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Now let’s process our documents and insert them into the vector database:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: emb_text(line), <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Expected output:</p>
<pre><code translate="no">Creating embeddings: 100%|████████████| 72/72 [00:08&lt;00:00, 8.68it/s]
Inserted 72 documents
<button class="copy-code-btn"></button></code></pre>
<h2 id="Enhancing-RAG-with-Reranking-Technology" class="common-anchor-header">Enhancing RAG with Reranking Technology<button data-href="#Enhancing-RAG-with-Reranking-Technology" class="anchor-icon" translate="no">
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
    </button></h2><p>Now comes the exciting part - putting it all together into a complete retrieval-augmented generation system.</p>
<h3 id="Step-1-Query-and-Initial-Retrieval" class="common-anchor-header"><strong>Step 1: Query and Initial Retrieval</strong></h3><p>Let’s test with a common question about Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Perform initial dense retrieval to get top candidates</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[emb_text(question, is_query=<span class="hljs-literal">True</span>)],  <span class="hljs-comment"># Use query prompt</span>
    limit=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Get top 10 candidates for reranking</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the actual text content</span>
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(search_res[<span class="hljs-number">0</span>])}</span> initial candidates&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Reranking-for-Precision" class="common-anchor-header"><strong>Step 2: Reranking for Precision</strong></h3><p>Extract candidate documents and apply reranking:</p>
<pre><code translate="no"><span class="hljs-comment"># Extract candidate documents</span>
candidate_docs = [res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>] <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]]

<span class="hljs-comment"># Rerank using Qwen3-Reranker</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Reranking documents...&quot;</span>)
reranked_docs = rerank_documents(question, candidate_docs)

<span class="hljs-comment"># Select top 3 after reranking</span>
top_reranked_docs = reranked_docs[:<span class="hljs-number">3</span>]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Selected top <span class="hljs-subst">{<span class="hljs-built_in">len</span>(top_reranked_docs)}</span> documents after reranking&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Compare-Results" class="common-anchor-header"><strong>Step 3: Compare Results</strong></h3><p>Let’s examine how reranking changes the results:</p>
<pre><code translate="no"><span class="hljs-function">Reranked <span class="hljs-title">results</span> (<span class="hljs-params">top <span class="hljs-number">3</span></span>):
[
    [
        &quot; Where does Milvus store data?\n\nMilvus deals <span class="hljs-keyword">with</span> two types of data, inserted data <span class="hljs-keyword">and</span> metadata. \n\nInserted data, including vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema, are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including [MinIO](<span class="hljs-params">https://min.io/</span>), [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>), [Google Cloud Storage](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>) (<span class="hljs-params">GCS</span>), [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>), [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>), <span class="hljs-keyword">and</span> [Tencent Cloud Object Storage](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>) (<span class="hljs-params">COS</span>).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored <span class="hljs-keyword">in</span> etcd.\n\n###&quot;,
        0.9997891783714294
    ],
    [
        &quot;How does Milvus flush data?\n\nMilvus returns success <span class="hljs-keyword">when</span> inserted data are loaded to the message queue. However, the data are <span class="hljs-keyword">not</span> yet flushed to the disk. Then Milvus&#x27; data node writes the data <span class="hljs-keyword">in</span> the message queue to persistent storage <span class="hljs-keyword">as</span> incremental logs. If `<span class="hljs-title">flush</span>()` <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.\n\n###&quot;,
        0.9989748001098633
    ],
    [
        &quot;Does the query perform <span class="hljs-keyword">in</span> memory? What are incremental data <span class="hljs-keyword">and</span> historical data?\n\nYes. When a query request comes, Milvus searches both incremental data <span class="hljs-keyword">and</span> historical data <span class="hljs-keyword">by</span> loading them <span class="hljs-keyword">into</span> memory. Incremental data are <span class="hljs-keyword">in</span> the growing segments, which are buffered <span class="hljs-keyword">in</span> memory before they reach the threshold to be persisted <span class="hljs-keyword">in</span> storage engine, <span class="hljs-keyword">while</span> historical data are <span class="hljs-keyword">from</span> the <span class="hljs-keyword">sealed</span> segments that are stored <span class="hljs-keyword">in</span> the <span class="hljs-built_in">object</span> storage. Incremental data <span class="hljs-keyword">and</span> historical data together constitute the whole dataset to search.\n\n###&quot;,
        0.9984032511711121
    ]
]</span>

================================================================================
Original embedding-<span class="hljs-function">based <span class="hljs-title">results</span> (<span class="hljs-params">top <span class="hljs-number">3</span></span>):
[
    [
        &quot; Where does Milvus store data?\n\nMilvus deals <span class="hljs-keyword">with</span> two types of data, inserted data <span class="hljs-keyword">and</span> metadata. \n\nInserted data, including vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema, are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including [MinIO](<span class="hljs-params">https://min.io/</span>), [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>), [Google Cloud Storage](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>) (<span class="hljs-params">GCS</span>), [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>), [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>), <span class="hljs-keyword">and</span> [Tencent Cloud Object Storage](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>) (<span class="hljs-params">COS</span>).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored <span class="hljs-keyword">in</span> etcd.\n\n###&quot;,
        0.8306853175163269
    ],
    [
        &quot;How does Milvus flush data?\n\nMilvus returns success <span class="hljs-keyword">when</span> inserted data are loaded to the message queue. However, the data are <span class="hljs-keyword">not</span> yet flushed to the disk. Then Milvus&#x27; data node writes the data <span class="hljs-keyword">in</span> the message queue to persistent storage <span class="hljs-keyword">as</span> incremental logs. If `<span class="hljs-title">flush</span>()` <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.\n\n###&quot;,
        0.7302717566490173
    ],
    [
        &quot;How does Milvus handle vector data types <span class="hljs-keyword">and</span> precision?\n\nMilvus supports Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 vector types.\n\n- Binary vectors: Store binary data <span class="hljs-keyword">as</span> sequences of 0s <span class="hljs-keyword">and</span> 1s, used <span class="hljs-keyword">in</span> image processing <span class="hljs-keyword">and</span> information retrieval.\n- Float32 vectors: Default storage <span class="hljs-keyword">with</span> a precision of about 7 <span class="hljs-built_in">decimal</span> digits. Even Float64 values are stored <span class="hljs-keyword">with</span> Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 <span class="hljs-keyword">and</span> BFloat16 vectors: Offer reduced precision <span class="hljs-keyword">and</span> memory usage. Float16 <span class="hljs-keyword">is</span> suitable <span class="hljs-keyword">for</span> applications <span class="hljs-keyword">with</span> limited bandwidth <span class="hljs-keyword">and</span> storage, <span class="hljs-keyword">while</span> BFloat16 balances range <span class="hljs-keyword">and</span> efficiency, commonly used <span class="hljs-keyword">in</span> deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;,
        0.7003671526908875
    ]
]
</span><button class="copy-code-btn"></button></code></pre>
<p>The reranking typically shows much higher discriminative scores (closer to 1.0 for relevant documents) compared to embedding similarity scores.</p>
<h3 id="Step-4-Generate-Final-Response" class="common-anchor-header"><strong>Step 4: Generate Final Response</strong></h3><p>Now let’s use the retrieved context to generate a comprehensive answer:</p>
<p>First: Convert the retrieved documents to string format.</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Provide system prompt and user prompt for the large language model. This prompt is generated from documents retrieved from Milvus.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>Use GPT-4o to generate a response based on the prompts.</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>Expected output:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main forms: inserted data <span class="hljs-keyword">and</span> metadata. 
Inserted data, which includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific 
schema, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports 
multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including MinIO, AWS S3, 
Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent 
Cloud Object Storage. Metadata <span class="hljs-keyword">for</span> Milvus <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">by</span> its various modules 
<span class="hljs-keyword">and</span> stored <span class="hljs-keyword">in</span> etcd.
<button class="copy-code-btn"></button></code></pre>
<h2 id="Wrapping-Up" class="common-anchor-header"><strong>Wrapping Up</strong><button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>This tutorial demonstrated a complete RAG implementation using Qwen3’s embedding and reranking models. The key takeaways:</p>
<ol>
<li><p><strong>Two-stage retrieval</strong> (dense + reranking) consistently improves accuracy over embedding-only approaches</p></li>
<li><p><strong>Instruction prompting</strong> allows domain-specific tuning without retraining</p></li>
<li><p><strong>Multilingual capabilities</strong> work naturally without additional complexity</p></li>
<li><p><strong>Local deployment</strong> is feasible with the 0.6B models</p></li>
</ol>
<p>The Qwen3 series offers solid performance in a lightweight, open-source package. While not revolutionary, they provide incremental improvements and useful features like instruction prompting that can make a real difference in production systems.</p>
<p>Test these models against your specific data and use cases - what works best always depends on your content, query patterns, and performance requirements.</p>
