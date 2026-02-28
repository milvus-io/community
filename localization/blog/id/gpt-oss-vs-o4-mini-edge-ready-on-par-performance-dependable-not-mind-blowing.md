---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >
  GPT-oss vs o4-mini: Edge-Ready, On-Par Performance — Dependable, Not
  Mind-Blowing
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >
  OpenAI steals the spotlight by open-sourcing two reasoning models:
  gpt-oss-120b and gpt-oss-20b, permissively licensed under Apache 2.0.
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>The AI world has been running hot. In just a few weeks, Anthropic dropped Claude 4.1 Opus, DeepMind stunned everyone with Genie 3 world simulator—and now, OpenAI steals the spotlight by open-sourcing two reasoning models: <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> and <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>, permissively licensed under Apache 2.0.</p>
<p>After launch, these models instantly shot to the #1 trending spot on Hugging Face—and for good reason. This is the first time since 2019 that OpenAI has released open-weight models that are actually production-ready. The move isn’t accidental—after years of pushing API-only access, OpenAI is clearly responding to the pressure from open-source leaders like DeepSeek, Meta’s LLaMA, and Qwen, who’ve been dominating both benchmarks and developer workflows.</p>
<p>In this post, we’ll explore what makes GPT-oss different, how it compares to leading open models like DeepSeek R1 and Qwen 3, and why developers should care. We’ll also walk through building a reasoning-capable RAG system using GPT-oss and Milvus, the most popular open-source vector database.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">What Makes GPT-oss Special and Why You Should Care?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss isn’t just another weight drop. It delivers in five key areas that matter to developers:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: Built for Edge Deployment</h3><p>GPT-oss comes in two strategically sized variants:</p>
<ul>
<li><p>gpt-oss-120b: 117B total, 5.1B active per token</p></li>
<li><p>gpt-oss-20b: 21B total, 3.6B active per token</p></li>
</ul>
<p>Using Mixture-of-Experts (MoE) architecture, only a subset of parameters is active during inference. This makes both models lightweight to run relative to their size:</p>
<ul>
<li><p>gpt-oss-120b runs on a single 80GB GPU (H100)</p></li>
<li><p>gpt-oss-20b fits in just 16GB VRAM, meaning it runs on high-end laptops or edge devices</p></li>
</ul>
<p>According to OpenAI’s tests, gpt-oss-20b is the fastest OpenAI model for inference—ideal for low-latency deployments or offline reasoning agents.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: Strong Benchmark Performance</h3><p>According to OpenAI’s evaluations:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong> performs near-parity with o4-mini on reasoning, tool use, and competition coding (Codeforces, MMLU, TauBench)</p></li>
<li><p><strong>gpt-oss-20b</strong> competes with o3-mini, and even outperforms it in math and healthcare reasoning</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: Cost-Efficient Training</h3><p>OpenAI claims performance equivalent to o3-mini and o4-mini, but with dramatically lower training costs:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>: 2.1 million H100-hours → ~$10M</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210K H100-hours → ~$1M</p></li>
</ul>
<p>Compare that to the multi-hundred-million-dollar budgets behind models like GPT-4. GPT-oss proves that efficient scaling and architecture choices can deliver competitive performance without a massive carbon footprint.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: True Open-Source Freedom</h3><p>GPT-oss uses Apache 2.0 licensing, which means:</p>
<ul>
<li><p>Commercial use allowed</p></li>
<li><p>Full modification and redistribution rights</p></li>
<li><p>No usage restrictions or copyleft clauses</p></li>
</ul>
<p>This is really open source, not a research-only release. You can fine-tune for domain-specific use, deploy in production with full control, and build commercial products around it. Key features include configurable reasoning depth (low/medium/high), full chain-of-thought visibility, and native tool calling with structured output support.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: Potential GPT-5 Preview</h3><p>OpenAI hasn’t disclosed everything—but architecture details suggest this may preview the direction of <strong>GPT-5</strong>:</p>
<ul>
<li><p>Uses MoE with 4 experts per input</p></li>
<li><p>Follows alternating dense + local sparse attention (GPT-3 pattern)</p></li>
<li><p>Features more attention heads</p></li>
<li><p>Interestingly, bias units from GPT-2 have made a comeback</p></li>
</ul>
<p>If you’re watching for signals on what comes next, GPT-oss may be the clearest public hint yet.</p>
<h3 id="Core-Specifications" class="common-anchor-header">Core Specifications</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Model</strong></td><td><strong>Total Params</strong></td><td><strong>Active Params</strong></td><td><strong>Experts</strong></td><td><strong>Context Length</strong></td><td><strong>VRAM Req</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>Both models use the o200k_harmony tokenizer and support 128,000-token context length (roughly 96,000-100,000 words).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss vs. Other Reasoning Models<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Here’s how GPT-oss stacks up against OpenAI’s internal models and top open-source competitors:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Model</strong></td><td><strong>Parameters (Active)</strong></td><td><strong>Memory</strong></td><td><strong>Strengths</strong></td></tr>
<tr><td><strong>gpt-oss-120b</strong></td><td>117B (5.1B active)</td><td>80GB</td><td>Single-GPU, open reasoning</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3.6B active)</td><td>16GB</td><td>Edge deployment, fast inference</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B active)</td><td>Distributed</td><td>Benchmark leader, proven performance</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>Proprietary</td><td>API only</td><td>Strong reasoning (closed)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>Proprietary</td><td>API only</td><td>Lightweight reasoning (closed)</td></tr>
</tbody>
</table>
<p>Based on various benchmarking models, here is what we found:</p>
<ul>
<li><p><strong>GPT-oss vs. OpenAI’s Own Models:</strong> gpt-oss-120b matches o4-mini on competition math (AIME), coding (Codeforces), and tool use (TauBench). The 20b model performs similarly to o3-mini despite being much smaller.</p></li>
<li><p><strong>GPT-oss vs. DeepSeek R1:</strong> DeepSeek R1 dominates in pure performance but requires distributed infrastructure. GPT-oss offers simpler deployment—no distributed setup needed for the 120b model.</p></li>
</ul>
<p>In summary, GPT-oss offers the best combination of performance, open access, and deployability. DeepSeek R1 wins on pure performance, but GPT-oss strikes the optimal balance for most developers.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">Hands-on: Building with GPT-oss + Milvus<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Now that we’ve seen what GPT-oss brings to the table, it’s time to put it to use.</p>
<p>In the following sections, we’ll walk through a hands-on tutorial for building a reasoning-capable RAG system using gpt-oss-20b and Milvus, all running locally, no API key required.</p>
<h3 id="Environment-Setup" class="common-anchor-header">Environment Setup</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">Dataset Preparation</h3><p>We’ll use Milvus documentation as our knowledge base:</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">Model Setup</h3><p>Access GPT-oss through <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> (or run locally). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a> is a platform that lets developers access and switch between multiple AI models (like GPT-4, Claude, Mistral) through a single, unified API. It’s useful for comparing models or building apps that work with different AI providers. Now GPT-oss series have been available on OpenRouter now.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Set up Milvus vector database</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>About MilvusClient parameter settings:</p>
<ul>
<li><p>Setting the URI to a local file (e.g., <code translate="no">./milvus.db</code>) is the most convenient method as it automatically uses Milvus Lite to store all data in that file.</p></li>
<li><p>For large-scale data, you can set up a more powerful Milvus server on Docker or Kubernetes. In this case, use the server’s URI (e.g., <code translate="no">http://localhost:19530</code>) as your URI.</p></li>
<li><p>If you want to use <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(the managed service of Milvus), adjust the URI and token, which correspond to the Public Endpoint and API key in Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Adding Documents to the Collection</h3><p>Now we’ll create embeddings for our text chunks and add them to Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">RAG Query Pipeline</h3><p>Now for the exciting part - let’s set up our RAG system to answer questions.</p>
<p>Let’s specify a common question about Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Search for this question in the collection and retrieve the top 3 semantically matching results:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Let’s look at the search results for this query:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">Using the GPT-oss to Build a RAG Response</h3><p>Convert the retrieved documents to string format:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Provide system prompt and user prompt for the large language model:</p>
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
<p>Use the latest gpt-oss model to generate a response based on the prompt:</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">Final Thoughts on GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss is OpenAI’s quiet admission that open-source can’t be ignored anymore. It doesn’t blow DeepSeek R1 or Qwen 3 or many other models out of the water, but it does bring something they don’t: OpenAI’s training pipeline, applied to a model you can actually inspect and run locally.</p>
<p><strong>Performance? Solid. Not mind-blowing, but dependable.</strong> The 20B model running on consumer hardware—or even mobile with LM Studio—is the kind of practical advantage that actually matters to developers. It’s more “this just works” than “wow, this changes everything.” And honestly, that’s fine.</p>
<p><strong>Where it falls short is multilingual support.</strong> If you’re working in anything other than English, you’ll hit weird phrasing, spelling issues, and general confusion. The model was clearly trained with an English-first lens. If global coverage matters, you’re probably going to need to fine-tune it with a multilingual dataset.</p>
<p>What’s most interesting, though, is the timing. OpenAI’s teaser on X—with a “5” dropped into the word “LIVESTREAM”—feels like a setup. GPT-oss might not be the main act, but it could be a preview of what’s coming in GPT-5. Same ingredients, different scale. Let’s wait.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>The real win is having more high-quality choices.</strong> Competition drives innovation, and OpenAI re-entering open-source development benefits everyone. Test GPT-oss against your specific requirements, but choose based on what actually works for your use case, not brand recognition.</p>
