---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: Gemini 3 Pro + Milvus：利用高级推理和多模态功能打造更强大的 RAG
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: 了解 Gemini 3 Pro 中的核心更新，查看它在关键基准测试中的表现，并按照指南使用 Milvus 构建高性能 RAG 流水线。
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>谷歌的 Gemini 3 Pro 发布了一个罕见的版本，它真正改变了开发者的期望--不仅仅是炒作，而是实质性地扩展了自然语言界面的功能。它将 "描述你想要的应用 "变成了一个可执行的工作流程：动态工具路由、多步骤规划、API 协调和交互式用户体验生成，所有这些都无缝地拼接在一起。这是目前最接近让振动编码感觉可行的模型。</p>
<p>数据也证明了这一点。双子座 3 Pro 在几乎所有主要基准测试中都取得了优异成绩：</p>
<ul>
<li><p><strong>Humanity's Last Exam：</strong>37.5% 不使用工具，45.8% 使用工具--最接近的竞争对手为 26.5%。</p></li>
<li><p><strong>MathArena Apex：</strong>23.4%，而大多数模型都未能突破 2%。</p></li>
<li><p><strong>ScreenSpot-Pro：</strong>准确率为 72.7%，几乎是次席 36.2% 的两倍。</p></li>
<li><p><strong>Vending-Bench 2：</strong>平均净值为<strong> 5478.16 美元</strong>，比第二名高出约<strong>1.4 倍</strong>。</p></li>
</ul>
<p>查看下表，了解更多基准结果。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>深度推理、强大的工具使用能力和多模态流畅性的完美结合，让 Gemini 3 Pro 成为检索增强型生成（RAG）的不二之选。将它与专为十亿规模语义搜索而构建的高性能开源向量数据库<a href="https://milvus.io/"><strong>Milvus</strong></a> 搭配使用，您就能获得一个响应可靠、扩展简洁、即使在繁重的工作负载下也能保持生产可靠性的检索层。</p>
<p>在这篇文章中，我们将介绍 Gemini 3 Pro 的新功能、它提升 RAG 工作流程的原因，以及如何使用 Milvus 作为检索骨干构建简洁、高效的 RAG 管道。</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">双子座 3 Pro 的主要升级<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro 引入了一系列重大升级，重塑了模型的推理、创建、任务执行以及与用户交互的方式。这些改进分为四大能力领域：</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">多模式理解和推理</h3><p>Gemini 3 Pro 在重要的多模态基准方面创造了新纪录，包括视觉推理的 ARC-AGI-2、跨模态理解的 MMMU-Pro 以及视频理解和知识获取的 Video-MMMU。该模型还引入了 "深度思考"（Deep Think）这一扩展推理模式，实现了结构化、多步骤逻辑处理。这使得传统的思维链模型往往无法解决的复杂问题的准确性大大提高。</p>
<h3 id="Code-Generation" class="common-anchor-header">代码生成</h3><p>该模型将代码生成提升到了一个新的水平。Gemini 3 Pro 可以生成交互式 SVG、完整的网络应用程序、三维场景，甚至功能性游戏（包括类似 Minecraft 的环境和基于浏览器的台球），所有这些都只需一个自然语言提示。前端开发尤其受益匪浅：该模型可以高保真地重新创建现有的用户界面设计，或将截图直接转化为生产就绪的代码，使用户界面的迭代工作大大加快。</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">人工智能代理和工具使用</h3><p>在用户许可的情况下，Gemini 3 Pro 可以从用户的谷歌设备中获取数据，执行远景、多步骤任务，如计划行程或预订租车。<strong>Gemini</strong> 3 Pro 在<strong>Vending-Bench 2</strong> 上的出色表现就体现了这种代理能力，<strong>Vending-Bench 2</strong> 是一项专门用于对远程工具使用进行压力测试的基准测试。该模型还支持专业级 Agents 工作流程，包括执行终端命令和通过定义明确的 API 与外部工具交互。</p>
<h3 id="Generative-UI" class="common-anchor-header">生成式用户界面</h3><p>Gemini 3 Pro摒弃了传统的一问一答模型，引入了<strong>生成式用户界面（Generative UI</strong>），该模型可以动态构建整个交互体验。它不再返回静态文本，而是根据用户指令直接生成完全定制的界面，例如，一个丰富的、可调整的旅行计划器。这将 LLM 从被动的响应者转变为主动的界面生成者。</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">测试双子座 3 Pro<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>除了基准测试结果，我们还进行了一系列实际操作测试，以了解 Gemini 3 Pro 在实际工作流程中的表现。测试结果凸显了 Gemini 3 Pro 的多模态推理、生成能力和长远规划如何为开发人员带来实际价值。</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">多模态理解</h3><p>Gemini 3 Pro 在文本、图像、视频和代码方面的多功能性令人印象深刻。在测试中，我们直接从 YouTube 上传了一段 Zilliz 视频。该模型处理整个片段（包括旁白、转场和屏幕文本）的时间大约为<strong>40 秒</strong>，这对于长篇多模态内容来说是异常快速的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>谷歌的内部评估也显示了类似的表现：Gemini 3 Pro 处理了多种语言的手写食谱，转录并翻译了每一份食谱，并将其编译成一本可共享的家庭食谱。</p>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">零镜头任务</h3><p>Gemini 3 Pro 可以生成完全交互式的网络用户界面，而无需事先提供示例或脚手架。当被要求创建一个精致的、复古未来主义的<strong>3D 飞船网页游戏</strong>时，该模型生成了一个完整的交互式场景：霓虹紫色网格、赛博朋克风格的飞船、发光粒子效果和流畅的相机控制--所有这一切都在一次零镜头响应中完成。</p>
<h3 id="Complex-Task-Planning" class="common-anchor-header">复杂的任务规划</h3><p>与许多同类产品相比，该模型还表现出更强的远距离任务规划能力。在我们的收件箱整理测试中，Gemini 3 Pro 的表现就像一位人工智能行政助理：将杂乱无章的电子邮件归类到项目桶中，起草可执行的建议（回复、跟进、存档），并提交一份简洁、有条理的摘要。有了模型的计划布局，只需点击确认，整个收件箱就能被清理干净。</p>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">如何使用 Gemini 3 Pro 和 Milvus 建立 RAG 系统<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro 的升级推理、多模态理解和强大的工具使用功能使其成为高性能 RAG 系统的绝佳基础。</p>
<p>如果与<a href="https://milvus.io/"><strong>Milvus</strong></a>（为大规模语义搜索而构建的高性能开源向量数据库）搭配使用，就能实现明确的职责分工：Gemini 3 Pro 负责<strong>解释、推理和生成</strong>，而 Milvus 则提供<strong>快速、可扩展的检索层</strong>，使响应与企业数据保持一致。这种搭配非常适合生产级应用，如内部知识库、文档助手、客户支持协理和特定领域的专家系统。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>在构建 RAG 管道之前，请确保已安装这些核心 Python 库或将其升级到最新版本：</p>
<ul>
<li><p><strong>pymilvus</strong>- Milvus 官方 Python SDK</p></li>
<li><p><strong>google-generativeai</strong>- 双子座 3 Pro 客户端库</p></li>
<li><p><strong>requests</strong>- 用于在需要时处理 HTTP 调用</p></li>
<li><p><strong>tqdm</strong>- 用于数据集摄取过程中的进度条</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>接下来，登录<a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a>获取 API 密钥。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">准备数据集</h3><p>在本教程中，我们将使用 Milvus 2.4.x 文档中的常见问题部分作为 RAG 系统的私有知识库。</p>
<p>下载文档压缩包并解压到名为<code translate="no">milvus_docs</code> 的文件夹中。</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>从<code translate="no">milvus_docs/en/faq</code> 路径加载所有 Markdown 文件。对于每个文档，我们根据<code translate="no">#</code> 标题进行简单拆分，以大致区分每个 Markdown 文件中的主要部分。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">LLM 和 Embeddings 模型设置</h3><p>在本教程中，我们将使用<code translate="no">gemini-3-pro-preview</code> 作为 LLM，使用<code translate="no">text-embedding-004</code> 作为嵌入模型。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>模型回复：我是 Gemini，一个由 Google 构建的大型语言模型。</p>
<p>您可以通过生成一个测试嵌入并打印其维度以及前几个值来进行快速检查：</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>测试向量输出：</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">将数据载入 Milvus</h3><p><strong>创建 Collections</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>创建<code translate="no">MilvusClient</code> 时，您可以根据规模和环境选择三种配置选项：</p>
<ul>
<li><p><strong>本地模式（Milvus Lite）：</strong>将 URI 设置为本地文件路径（如<code translate="no">./milvus.db</code> ）。这是最简单的入门方式--<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>会自动将所有数据存储到该文件中。</p></li>
<li><p><strong>自托管 Milvus（Docker 或 Kubernetes）：</strong>对于较大的数据集或生产工作负载，可在 Docker 或 Kubernetes 上运行 Milvus。将 URI 设置为你的 Milvus 服务器端点，如<code translate="no">http://localhost:19530</code> 。</p></li>
<li><p><strong>Zilliz Cloud（完全托管的 Milvus 服务）：</strong>如果您更喜欢托管解决方案，请使用 Zilliz Cloud。将 URI 设置为公共端点，并提供 API 密钥作为身份验证令牌。</p></li>
</ul>
<p>在创建新的 Collections 之前，首先要检查它是否已经存在。如果已经存在，请将其删除并重新创建，以确保设置无误。</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>使用指定参数创建新 Collections。</p>
<p>如果没有提供 Schema，Milvus 会自动生成一个默认 ID 字段作为主键，并生成一个向量字段用于存储 Embeddings。它还提供了一个保留的 JSON 动态字段，用于捕捉模式中未定义的任何其他字段。</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>插入数据</strong></p>
<p>遍历每个文本条目，生成其嵌入向量，并将数据插入 Milvus。 在本例中，我们包含了一个名为<code translate="no">text</code> 的额外字段。由于该字段未在 Schema 中预定义，因此 Milvus 会使用动态 JSON 字段自动存储该字段，无需额外设置。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>输出示例：</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">构建 RAG 工作流程</h3><p><strong>检索相关数据</strong></p>
<p>为了测试检索，我们提出一个有关 Milvus 的常见问题。</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>在 Collections 中搜索查询，并返回前 3 个最相关的结果。</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>结果按相似度从最近到最不相似的顺序返回。</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>使用 LLM 生成 RAG 响应</strong></p>
<p>检索文档后，将其转换为字符串格式</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>为 LLM 提供一个系统提示和一个用户提示，这两个提示都是根据从 Milvus 获取的文档构建的。</p>
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
<p>使用<code translate="no">gemini-3-pro-preview</code> 模型和这些提示生成最终回复。</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>从输出结果可以看出，Gemini 3 Pro 根据检索到的信息生成了清晰、结构良好的答案。</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>注意</strong>：Gemini 3 Pro 目前不适用于免费用户。点击<a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">此处</a>了解更多详情。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>您可以通过<a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a>访问它：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">还有一件事：使用 Google Antigravity 进行 Vibe 编码<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>除了 Gemini 3 Pro，Google 还推出了<a href="https://antigravity.google/"><strong>Google Antigravity</strong></a>，这是一个可与编辑器、终端和浏览器自主交互的视频编码平台。与处理一次性指令的早期人工智能辅助工具不同，Antigravity 在面向任务的层面上进行操作--允许开发人员指定他们想要构建<em>的内容</em>，而系统则管理<em>如何</em>构建，端到端协调整个工作流程。</p>
<p>传统的人工智能编码工作流程通常会生成孤立的片段，开发人员仍需对其进行审查、集成、调试和手动运行。反重力改变了这种动态。您只需描述一项任务，例如<em>"创建一个简单的宠物互动游戏</em>"，系统就会分解请求、生成代码、执行终端命令、打开浏览器测试结果，并反复运行直至成功。它将人工智能从一个被动的自动完成引擎提升为一个主动的工程合作伙伴--它可以学习你的偏好，并随着时间的推移适应你的个人开发风格。</p>
<p>展望未来，Agent 直接与数据库协调的想法并不遥远。通过MCP进行工具调用，人工智能最终可以从Milvus数据库中读取数据，组建知识库，甚至自主维护自己的检索管道。在许多方面，这种转变甚至比模型升级本身更有意义：一旦人工智能能够获取产品层面的描述，并将其转换为一系列可执行的任务，人类的努力就会自然而然地转向定义目标、约束条件以及 "正确性 "是什么样子--真正推动产品开发的高层次思维。</p>
<h2 id="Ready-to-Build" class="common-anchor-header">准备好构建了吗？<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您已经准备好尝试，请按照我们的教程逐步操作，今天就使用<strong>Gemini 3 Pro + Milvus</strong>构建一个 RAG 系统。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，获得见解、指导和问题解答。</p>
