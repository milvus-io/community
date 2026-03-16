---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: 双子座嵌入 2 会扼杀向量数据库中的多向量搜索吗？
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: 谷歌的双子座嵌入 2 将文本、图片、视频和音频映射到一个向量中。这会让多向量搜索过时吗？不会，原因就在这里。
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>谷歌发布了<a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">双子座嵌入 2（Gemini Embedding 2</a>）--首个多模态嵌入模型，可将文本、图像、视频、音频和文档映射到单一向量空间。</p>
<p>您只需调用一次 API，就能嵌入视频剪辑、产品照片和一段文字，而且它们都会出现在同一个语义邻域中。</p>
<p>在使用这样的模型之前，您必须将每种模式通过各自的专业模型运行，然后将每种输出存储在单独的向量列中。<a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a>等向量数据库中的多向量列正是为这种情况而建立的。</p>
<p>随着 Gemini Embedding 2 同时映射多种模式，一个问题出现了：Gemini Embedding 2 可以替代多少多向量列，它的不足又在哪里？本篇文章将介绍每种方法的适用范围以及它们如何协同工作。</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">与 CLIP/CLAP 相比，Gemini Embedding 2 有哪些不同之处？<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>嵌入模型将非结构化数据转换为密集向量，从而使语义相似的项目在向量空间中聚集在一起。Gemini Embedding 2 的与众不同之处在于，它可以跨模态原生实现这一功能，无需单独的模型和拼接管道。</p>
<p>在此之前，多模态嵌入意味着使用对比学习训练的双编码器模型：<a href="https://openai.com/index/clip/">CLIP</a>用于图像-文本，<a href="https://arxiv.org/abs/2211.06687">CLAP</a>用于音频-文本，每个模型正好处理两种模态。如果需要三种模式，则需要运行多个模型，并自行协调它们的嵌入空间。</p>
<p>例如，为带有封面艺术的播客编制索引意味着要运行 CLIP 来处理图像，CLAP 来处理音频，文本编码器来处理文本--三个模型，三个向量空间，以及自定义的融合逻辑，以使它们的得分在查询时具有可比性。</p>
<p>相比之下，根据<a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">谷歌的官方公告</a>，以下是 Gemini Embedding 2 支持的内容：</p>
<ul>
<li>每次请求最多支持 8,192 个<strong>文本</strong>标记</li>
<li>每次请求最多支持 6 张<strong>图片</strong>（PNG、JPEG）</li>
<li>最长 120 秒的<strong>视频</strong>（MP4、MOV）</li>
<li><strong>音频</strong>，最长 80 秒，无需 ASR 转录即可直接嵌入</li>
<li><strong>文档</strong>PDF 输入，最多 6 页</li>
</ul>
<p>在一次嵌入调用中同时<strong>混合输入</strong>图像和文本</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2 与 CLIP/CLAP 的对比 多模态嵌入的一个模型与多个模型的对比</h3><table>
<thead>
<tr><th></th><th><strong>双编码器（CLIP、CLAP）</strong></th><th><strong>双子嵌入 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>每个模型的模式</strong></td><td>2（例如，图像 + 文本）</td><td>5（文本、图像、视频、音频、PDF）</td></tr>
<tr><td><strong>添加新模式</strong></td><td>引入另一个模型并手动对齐空间</td><td>已包含--只需调用一次 API</td></tr>
<tr><td><strong>跨模态输入</strong></td><td>独立编码器，独立调用</td><td>交错输入（例如，在一个请求中输入图像和文本）</td></tr>
<tr><td><strong>架构</strong></td><td>独立的视觉和文本编码器通过对比损失进行对齐</td><td>从 Gemini 继承多模态理解的单一模型</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Gemini Embeddings 2 的优势：管道简化<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>以一个常见的场景为例：在短视频库上建立一个语义搜索引擎。每个片段都有视觉框架、语音和字幕文本--所有这些都描述相同的内容。</p>
<p><strong>在使用 Gemini Embedding 2 之前</strong>，您需要三个独立的嵌入模型（图像、音频和文本）、三个向量列以及一个检索管道，该管道可进行多向召回、结果融合和重复数据删除。这需要构建和维护大量的移动部件。</p>
<p><strong>现在</strong>，您可以将视频的帧数、音频和字幕输入到单个 API 调用中，然后获得一个能捕捉完整语义画面的统一向量。</p>
<p>自然，我们很容易得出多向量列已经死亡的结论。但这个结论混淆了 "多模态统一表示 "和 "多维向量检索"。它们解决的是不同的问题，了解两者的区别对于选择正确的方法至关重要。</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Milvus 中的多向量检索是什么？<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在<a href="http://milvus.io">Milvus</a> 中，多向量搜索指的是同时通过多个向量场搜索同一个项目，然后将这些结果与重排相结合。</p>
<p>其核心理念是：一个对象往往具有不止一种含义。一个产品有标题<em>和</em>描述。社交媒体帖子有标题<em>和</em>图片。每个角度都有不同的含义，因此每个角度都有自己的向量场。</p>
<p>Milvus 会独立搜索每个向量场，然后使用 Rerankers 合并候选集。在应用程序接口中，每个请求映射到不同的字段和搜索配置，hybrid_search() 会返回合并后的结果。</p>
<p>有两种常见模式依赖于此：</p>
<ul>
<li><strong>稀疏+密集向量搜索。</strong>您有一个产品目录，用户在目录中输入 "红色耐克 Air Max 10 码 "这样的查询。密集向量捕捉到了语义意图（"跑鞋、红色、耐克"），但却漏掉了准确的尺寸。通过<a href="https://milvus.io/docs/full-text-search.md">BM25</a>或<a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a>等模型生成的稀疏向量则能准确匹配关键词。您需要两者并行运行，然后重新排序--因为对于将自然语言与 SKU、文件名或错误代码等特定标识符混合在一起的查询，两者都不能单独返回良好的结果。</li>
<li><strong>多模态向量搜索。</strong> 用户上传了一张裙子的照片，并输入 "类似这样的裙子，但是蓝色的"。你可以同时搜索图像 Embeddings 列的视觉相似性和文本 Embedding 列的颜色约束。每一列都有自己的索引和模型--<a href="https://openai.com/index/clip/">CLIP</a>用于图像，文本编码器用于描述--结果会被合并。</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a>以并行<a href="https://milvus.io/docs/multi-vector-search.md">ANN 搜索的</a>方式运行这两种模式，并通过 RRFReranker 进行本地重排。Schema 定义、多索引配置和内置 BM25 都在一个系统中处理。</p>
<p>例如，在产品目录中，每个项目都包含文字说明和图片。您可以针对这些数据并行运行三种搜索：</p>
<ul>
<li><strong>语义文本搜索。</strong>使用<a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>、<a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> 或<a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a>embeddings API 等模型生成的密集向量查询文本描述。</li>
<li><strong>全文搜索。</strong>使用<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a>或<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a>或<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a> 等稀疏嵌入模型，利用稀疏向量查询文本描述。</li>
<li><strong>跨模态图像搜索。</strong>使用文本查询和<a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a> 等模型的密集向量对产品图片进行查询。</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">有了 Gemini Embedding 2，多向量搜索还重要吗？<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embeddings 2 可以在一次调用中处理更多模态，从而大大简化了管道。但统一的多模态嵌入与多向量检索并不是一回事。换句话说，是的，多向量检索仍然会很重要。</p>
<p>双子座嵌入 2 将文本、图像、视频、音频和文档映射到一个共享的向量空间。谷歌将<a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">其定位</a>为多模态语义搜索、文档检索和推荐--在这些场景中，所有模态都描述相同的内容，而高度的跨模态重叠使得单一向量成为可行。</p>
<p><a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a>多向量搜索解决的是一个不同的问题。它是一种通过<strong>多个向量场</strong>搜索同一对象的方法<strong>--</strong>例如，标题加描述，或文本加图像，然后在检索时将这些信号结合起来。换句话说，它是关于保存和查询同一项目的<strong>多个语义视图</strong>，而不仅仅是将所有内容压缩到一个表示中。</p>
<p>但现实世界的数据很少适合单一的 Embeddings。生物识别系统、Agents 工具检索和混合意图电子商务都依赖于生活在完全不同语义空间中的向量。这正是统一嵌入无法发挥作用的地方。</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">为什么只有一种嵌入方式是不够的？多向量检索实践</h3><p>双子座嵌入 2 处理的是所有模式都描述同一事物的情况。多向量检索可以处理其他所有情况--"其他所有情况 "包括大多数生产检索系统。</p>
<p><strong>生物识别。</strong>一个用户拥有脸部、声纹、指纹和虹膜向量。这些向量描述的是完全独立的生物特征，没有任何语义重叠。你不能把它们合并成一个向量--每个向量都需要自己的列、索引和相似度量。</p>
<p><strong>Agents 工具。</strong>像 OpenClaw 这样的编码助手，除了存储用于文件名、CLI 命令和配置参数精确匹配的稀疏 BM25 向量外，还存储用于对话历史（"上周的部署问题"）的密集语义向量。不同的检索目标、不同的向量类型、独立的搜索路径，然后重新排序。</p>
<p><strong>具有混合意图的电子商务。</strong>产品的宣传视频和细节图片作为统一的 Gemini Embeddings 嵌入效果很好。但是，当用户需要 "看起来像这样的裙子 "<em>和</em>"相同面料，M 码 "时，就需要视觉相似性列和结构化属性列，并使用独立索引和混合检索层。</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">何时使用双子座嵌入 2 与多向量列对比<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>使用场景</strong></th><th><strong>使用什么</strong></th><th><strong>为什么</strong></th></tr>
</thead>
<tbody>
<tr><td>所有模式都描述相同的内容（视频帧 + 音频 + 字幕）</td><td>双子座嵌入 2 统一向量</td><td>语义重叠度高，意味着一个向量就能捕捉全貌--无需融合</td></tr>
<tr><td>您需要关键词精度和语义召回率（BM25 + 密集）</td><td>使用 hybrid_search()进行多向量列搜索</td><td>稀疏向量和稠密向量服务于不同的检索目标，无法整合到一个嵌入中</td></tr>
<tr><td>跨模式搜索是主要用例（文本查询 → 图像结果）</td><td>双子座嵌入 2 统一向量</td><td>单一共享空间使跨模态相似性成为可能</td></tr>
<tr><td>向量生活在根本不同的语义空间中（生物识别、结构化属性）</td><td>具有每个字段索引的多向量列</td><td>每个向量场具有独立的相似性度量和索引类型</td></tr>
<tr><td>您希望管道简单<em>，</em>检索精细</td><td>两者兼得--统一的 Gemini 向量 + 同一 Collection 中的附加稀疏列或属性列</td><td>Gemini 处理多模式列；Milvus 处理其周围的混合检索层</td></tr>
</tbody>
</table>
<p>这两种方法并不相互排斥。您可以在统一的多模态列中使用双子座嵌入 2，同时在同一<a href="https://milvus.io/">Milvus</a>Collections 中的单独列中存储额外的稀疏或特定属性向量。</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">快速入门：设置双子座嵌入 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>下面是一个工作演示。您需要一个正在运行的<a href="https://milvus.io/docs/install-overview.md">Milvus 或 Zilliz Cloud 实例</a>和一个 GOOGLE_API_KEY。</p>
<h3 id="Setup" class="common-anchor-header">设置</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">完整示例</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>对于图像和音频嵌入，使用 embed_image() 和 embed_audio()的方法相同--向量位于相同的 Collections 和相同的向量空间，从而实现真正的跨模态搜索。</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 即将在 Milvus/Zilliz Cloud 中推出<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>正在通过其<a href="https://milvus.io/docs/embeddings.md">嵌入功能</a>与 Gemini Embeddings 2 进行深度集成。一旦上线，您将无需手动调用 Embeddings API。Milvus 将自动调用模型（支持 OpenAI、AWS Bedrock、Google Vertex AI 等），对插入的原始数据和搜索的查询进行向量化。</p>
<p>这意味着，在适合的地方，你可以从 Gemini 获得统一的多向量嵌入；在需要精细控制的地方，你可以获得 Milvus 的完整多向量工具包--稀疏密集混合搜索、多索引 Schema、重排。</p>
<p>想试试吗？从<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入门</a>开始，运行上面的演示，或者查看<a href="https://milvus.io/docs/hybrid_search_with_milvus.md">混合搜索指南</a>，了解使用 BGE-M3 的完整多向量设置。欢迎在<a href="https://milvus.io/discord">Discord</a>或<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Milvus 办公时间</a>提问。</p>
<h2 id="Keep-Reading" class="common-anchor-header">继续阅读<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Embeddings 功能介绍：Milvus 2.6如何简化向量化和语义搜索 - Milvus博客</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">多向量混合搜索</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Milvus Embeddings 功能文档</a></li>
</ul>
