---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: GPT-oss 与 o4-mini：边缘就绪，性能相当--可靠而不惊人
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: OpenAI 通过开源两个推理模型：gpt-oss-120b 和 gpt-oss-20b，获得了 Apache 2.0 许可，从而抢占了聚光灯。
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
<p>人工智能领域一直热火朝天。短短几周内，Anthropic 发布了 Claude 4.1 Opus，DeepMind 的 Genie 3 世界模拟器震惊了所有人，而现在，OpenAI 通过开源两个推理模型抢走了聚光灯：<a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a>和<a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>，以 Apache 2.0 许可。</p>
<p>发布后，这些模型瞬间蹿升至Hugging Face上的热门榜首--理由很充分。这是自 2019 年以来，OpenAI 首次发布真正可以投入生产的开放重量级模型。这一举动并非偶然--在多年推动只访问 API 之后，OpenAI 显然是在回应 DeepSeek、Meta 的 LLaMA 和 Qwen 等开源领导者的压力，它们一直在基准测试和开发人员工作流程中占据主导地位。</p>
<p>在这篇文章中，我们将探讨 GPT-oss 的不同之处，它与 DeepSeek R1 和 Qwen 3 等领先开源模型的比较，以及开发人员应该关注的原因。我们还将通过使用 GPT-oss 和最流行的开源向量数据库 Milvus 来构建一个具有推理能力的 RAG 系统。</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">是什么让 GPT-oss 与众不同？<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss 不仅仅是一个降重工具。它在五个关键领域为开发人员提供了重要帮助：</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: 为边缘部署而构建</h3><p>GPT-oss 有两个具有战略意义的型号：</p>
<ul>
<li><p>GPT-OSS-120B：总容量为 117B，每个令牌的有效容量为 5.1B</p></li>
<li><p>GPT-OSS-20B：总容量 21B，每个令牌 3.6B 有效值</p></li>
</ul>
<p>使用专家混合（MoE）架构，推理过程中只有参数子集处于活动状态。这使得这两个模型的运行相对于它们的大小都很轻便：</p>
<ul>
<li><p>gpt-oss-120b 可在单个 80GB GPU（H100）上运行</p></li>
<li><p>gpt-oss-20b 只需 16GB VRAM，这意味着它可以在高端笔记本电脑或边缘设备上运行。</p></li>
</ul>
<p>根据 OpenAI 的测试，gpt-oss-20b 是推理速度最快的 OpenAI 模型--非常适合低延迟部署或离线推理 Agents。</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2：强大的基准性能</h3><p>根据 OpenAI 的评估：</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>在推理、工具使用和竞争编码（Codeforces、MMLU、TauBench）方面的表现与 o4-mini 接近平分秋色。</p></li>
<li><p><strong>gpt-oss-20b</strong>与 o3-mini 竞争，甚至在数学和医疗保健推理方面优于 o3-mini</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3：具有成本效益的培训</h3><p>OpenAI 声称其性能与 o3-mini 和 o4-mini 相当，但培训成本却大大降低：</p>
<ul>
<li><p><strong>GPT-OSS-120B</strong>：210 万 H100 小时 → ~1000 万美元</p></li>
<li><p><strong>GPT-OSS-20B</strong>：21 万 H100 小时 → ~1 百万美元</p></li>
</ul>
<p>与 GPT-4 等模型背后数亿美元的预算相比。GPT-oss 证明，高效的扩展和架构选择可以在不产生大量碳足迹的情况下提供具有竞争力的性能。</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4：真正的开源自由</h3><p>GPT-oss 使用 Apache 2.0 许可，这意味着</p>
<ul>
<li><p>允许商业使用</p></li>
<li><p>完全的修改和再发布权</p></li>
<li><p>无使用限制或版权条款</p></li>
</ul>
<p>这是真正的开放源代码，而非仅用于研究的版本。您可以针对特定领域的使用进行微调，在生产中进行完全控制部署，并围绕它构建商业产品。主要功能包括可配置的推理深度（低/中/高）、完整的思维链可见性以及支持结构化输出的本地工具调用。</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5：潜在的 GPT-5 预览版</h3><p>OpenAI 并未披露所有信息，但架构细节表明，这可能是<strong>GPT-5</strong> 的预览版：</p>
<ul>
<li><p>使用 MoE，每个输入有 4 个专家</p></li>
<li><p>交替使用密集注意力和局部稀疏注意力（GPT-3 模式）</p></li>
<li><p>具有更多的注意头</p></li>
<li><p>有趣的是，GPT-2 中的偏置单元卷土重来</p></li>
</ul>
<p>如果您正在关注下一步发展的信号，GPT-oss 可能是最明确的公开暗示。</p>
<h3 id="Core-Specifications" class="common-anchor-header">核心规格</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>模型</strong></td><td><strong>总参数</strong></td><td><strong>有效参数</strong></td><td><strong>专家</strong></td><td><strong>上下文长度</strong></td><td><strong>VRAM 要求</strong></td></tr>
<tr><td>GPT-OSS-120B</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>GPT-OSS-20B</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>两种模型都使用 o200k_harmony 标记符号生成器，支持 128,000 个标记符号的上下文长度（大约 96,000-100,000 个单词）。</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss 与其他推理模型的比较<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是 GPT-oss 与 OpenAI 内部模型和顶级开源竞争对手的对比情况：</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>模型</strong></td><td><strong>参数（活动）</strong></td><td><strong>内存</strong></td><td><strong>优势</strong></td></tr>
<tr><td><strong>GPT-OSS-120B</strong></td><td>117B （5.1B 激活）</td><td>80GB</td><td>单 GPU，开放式推理</td></tr>
<tr><td><strong>GPT-OSS-20B</strong></td><td>21B（3.6B 活动）</td><td>16GB</td><td>边缘部署，快速推理</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B 活动)</td><td>分布式</td><td>基准领先，性能可靠</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>专有</td><td>仅 API</td><td>推理能力强（已关闭）</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>专有</td><td>仅 API</td><td>轻量级推理（已关闭）</td></tr>
</tbody>
</table>
<p>基于各种基准模型，以下是我们的发现：</p>
<ul>
<li><p><strong>GPT-oss 与 OpenAI 自有模型的对比：GPT-oss</strong>-120b 在竞赛数学（AIME）、编码（Codeforces）和工具使用（TauBench）方面与 o4-mini 不相上下。20b 模型尽管小得多，但性能与 o3-mini 相似。</p></li>
<li><p><strong>GPT-oss 与 DeepSeek R1 的对比：</strong>DeepSeek R1 在纯粹性能方面占优势，但需要分布式基础设施。GPT-oss 的部署更简单，120b 模型无需分布式设置。</p></li>
</ul>
<p>总之，GPT-oss 是性能、开放访问和可部署性的最佳组合。DeepSeek R1在纯粹的性能方面胜出，但GPT-oss为大多数开发者实现了最佳平衡。</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">实际操作使用 GPT-oss + Milvus 构建系统<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我们已经了解了 GPT-oss 带来的好处，那么现在就是使用它的时候了。</p>
<p>在下面的章节中，我们将使用 gpt-oss-20b 和 Milvus 来构建一个具有推理能力的 RAG 系统，所有操作都在本地运行，无需 API 密钥。</p>
<h3 id="Environment-Setup" class="common-anchor-header">环境设置</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">数据集准备</h3><p>我们将使用 Milvus 文档作为知识库：</p>
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
<h3 id="Model-Setup" class="common-anchor-header">模型设置</h3><p>通过<a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a>访问 GPT-oss（或在本地运行）。<a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a>是一个平台，开发人员可以通过一个统一的 API 访问多个人工智能模型（如 GPT-4、Claude、Mistral）并在它们之间切换。它对于比较模型或构建与不同人工智能提供商协同工作的应用程序非常有用。现在，GPT-oss 系列已经可以在 OpenRouter 上使用了。</p>
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
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">设置 Milvus 向量数据库</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

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
<p>关于 MilvusClient 参数设置：</p>
<ul>
<li><p>将 URI 设置为本地文件（如<code translate="no">./milvus.db</code> ）是最方便的方法，因为它会自动使用 Milvus Lite 存储该文件中的所有数据。</p></li>
<li><p>对于大规模数据，可以在 Docker 或 Kubernetes 上设置功能更强大的 Milvus 服务器。在这种情况下，请使用服务器的 URI（如<code translate="no">http://localhost:19530</code> ）作为你的 URI。</p></li>
<li><p>如果要使用<a href="https://zilliz.com/cloud">Zilliz Cloud </a>（Milvus 的托管服务），请调整 URI 和令牌，它们与 Zilliz Cloud 中的公共端点和 API 密钥相对应。</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">向 Collections 添加文档</h3><p>现在，我们将为文本块创建 Embeddings 并将其添加到 Milvus：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>输出：</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">RAG 查询管道</h3><p>现在是激动人心的部分--让我们建立 RAG 系统来回答问题。</p>
<p>让我们指定一个关于 Milvus 的常见问题：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>在 Collections 中搜索这个问题，并检索语义匹配的前 3 个结果：</p>
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
<p>我们来看看这个问题的搜索结果：</p>
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
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">使用 GPT-oss 构建 RAG 响应</h3><p>将检索到的文档转换为字符串格式：</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>为大语言模型提供系统提示和用户提示：</p>
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
<p>使用最新的 gpt-oss 模型根据提示生成响应：</p>
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
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">关于 GPT-oss 的最终想法<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss 是 OpenAI 默默地承认开源已不再被忽视。它并没有把 DeepSeek R1 或 Qwen 3 或其他许多模型打得落花流水，但它确实带来了它们所没有的东西：OpenAI 的训练管道，应用于你可以实际检查并在本地运行的模型。</p>
<p><strong>性能如何？不错。不出众，但值得信赖。</strong>在消费级硬件上运行的 20B 模型，甚至是使用 LM Studio 的移动设备上运行的 20B 模型，对于开发人员来说都是非常重要的实际优势。与其说 "哇，这改变了一切"，还不如说 "这就是能用"。老实说，这很好。</p>
<p><strong>它的不足之处在于多语言支持。</strong>如果你使用的语言不是英语，你就会遇到奇怪的措辞、拼写问题和普遍的困惑。显然，该模型是以英语为第一视角进行训练的。如果全球覆盖很重要，你可能需要使用多语言数据集对其进行微调。</p>
<p>不过，最有趣的还是时机。OpenAI 在 X 上发布的预告--在 "LIVESTREAM "中加入了一个 "5"--让人感觉像是一个圈套。GPT-oss 可能不是重头戏，但它可能是 GPT-5 的预演。同样的成分，不同的规模。让我们拭目以待。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>真正的胜利在于有了更多高质量的选择。</strong>竞争推动创新，OpenAI 重新进入开源开发领域对每个人都有好处。请根据您的具体要求测试 GPT-oss，但选择时要考虑到您的使用案例，而不是品牌知名度。</p>
