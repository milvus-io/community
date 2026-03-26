---
id: choose-embedding-model-rag-2026.md
title: 如何为 2026 年的 RAG 选择最佳的嵌入模型：10 个模型标杆
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
desc: 我们对 10 个嵌入模型进行了跨模态、跨语言、长文档和维度压缩任务的基准测试。看看哪个适合您的 RAG 管道。
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR：</strong>我们在公共基准所忽略的四种生产场景中测试了 10 种<a href="https://zilliz.com/ai-models">Embeddings 模型</a>：跨模态检索、跨语言检索、关键信息检索和维度压缩。没有一个模型能赢得一切。Gemini Embeddings 2 是最好的全能选手。开源 Qwen3-VL-2B 在跨模态任务上击败了闭源 API。如果需要压缩维度以节省存储空间，请选用 Voyage Multimodal 3.5 或 Jina Embeddings v4。</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">为什么选择嵌入模型仅有 MTEB 是不够的？<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>大多数<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>原型都是从 OpenAI 的文本嵌入-3-small 开始的。它价格便宜、易于集成，而且在英文文本检索中效果足够好。但生产型 RAG 很快就会淘汰它。您的管道会收集图片、PDF 和多语言文档，这时纯文本<a href="https://zilliz.com/ai-models">嵌入模型</a>就不够用了。</p>
<p><a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB 排行榜</a>告诉您还有更好的选择。问题出在哪里？MTEB 只测试单语言文本检索。它不包括跨模态检索（针对图像 Collections 的文本查询）、跨语言搜索（中文查询查找英文文档）、长文档准确性，也不包括为了节省<a href="https://zilliz.com/learn/what-is-a-vector-database">向量数据库</a>的存储空间而截断<a href="https://zilliz.com/glossary/dimension">嵌入维度</a>时会损失多少质量。</p>
<p>那么，您应该使用哪种嵌入模型呢？这取决于您的数据类型、语言、文档长度以及是否需要压缩维度。我们建立了一个名为<strong>CCKM</strong>的基准，并测试了 2025 年至 2026 年间发布的 10 个模型，测试的维度正是这些维度。</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">什么是 CCKM 基准？<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong>（跨模式、跨语言、关键信息、MRL）测试了标准基准所忽略的四种功能：</p>
<table>
<thead>
<tr><th>维度</th><th>测试内容</th><th>为何重要</th></tr>
</thead>
<tbody>
<tr><td><strong>跨模态检索</strong></td><td>当出现近乎相同的干扰项时，将文本描述与正确的图像相匹配</td><td><a href="https://zilliz.com/learn/multimodal-rag">多模态 RAG</a>管道需要在同一向量空间中进行文本和图像嵌入</td></tr>
<tr><td><strong>跨语言检索</strong></td><td>从中文查询中找到正确的英文文档，反之亦然</td><td>生产知识库通常使用多种语言</td></tr>
<tr><td><strong>关键信息检索</strong></td><td>查找埋藏在 4K-32K 字符文档中的特定事实（大海捞针）</td><td>RAG 系统经常处理合同和研究论文等长篇文档</td></tr>
<tr><td><strong>MRL 维度压缩</strong></td><td>衡量将 Embeddings 压缩到 256 维时，模型的质量损失有多大</td><td>更少的维度 = 更低的向量数据库存储成本，但质量代价是什么？</td></tr>
</tbody>
</table>
<p>MTEB 都不包括这些。MMEB 增加了多模态，但跳过了硬否定，因此模型得分很高，却无法证明它们能处理微妙的区别。CCKM 的设计涵盖了它们所忽略的内容。</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">我们测试了哪些嵌入模型？Gemini Embeddings 2、Jina Embeddings v4 等<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>我们测试了 10 个模型，包括 API 服务和开源选项，以及作为 2021 基准的 CLIP ViT-L-14。</p>
<table>
<thead>
<tr><th>模型</th><th>来源</th><th>参数</th><th>尺寸</th><th>模式</th><th>关键特征</th></tr>
</thead>
<tbody>
<tr><td>双子座 Embeddings 2</td><td>谷歌</td><td>未披露</td><td>3072</td><td>文本/图像/视频/音频/PDF</td><td>全模态，覆盖范围最广</td></tr>
<tr><td>Jina Embeddings v4</td><td>吉纳人工智能</td><td>3.8B</td><td>2048</td><td>文本/图像/PDF</td><td>MRL + LoRA 适配器</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>未披露</td><td>1024</td><td>文本/图像/视频</td><td>平衡不同任务</td></tr>
<tr><td>Qwen3-VL-Embeddings-2B</td><td>阿里巴巴 Qwen</td><td>2B</td><td>2048</td><td>文本/图像/视频</td><td>开源、轻量级多模态</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>文本/图像</td><td>现代化 CLIP 架构</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>未披露</td><td>固定式</td><td>文本</td><td>企业检索</td></tr>
<tr><td>OpenAI text-embedding-3-large</td><td>OpenAI</td><td>未披露</td><td>3072</td><td>文本</td><td>最广泛使用</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>文本</td><td>开源，100 多种语言</td></tr>
<tr><td>mxbai-embed-large</td><td>混合面包人工智能</td><td>335M</td><td>1024</td><td>文本</td><td>轻量级，以英语为主</td></tr>
<tr><td>nomic-embed-text</td><td>Nomic AI</td><td>137M</td><td>768</td><td>文本</td><td>超轻型</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>文本/图像</td><td>基线</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">跨模态检索：哪些模型可处理文本到图像的检索？<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您的 RAG 管道在处理文本的同时也处理图像，那么嵌入模型就需要将两种模式放在同一个<a href="https://zilliz.com/glossary/vector-embeddings">向量空间</a>中。想想电子商务图像搜索、混合图像-文本知识库或任何需要通过文本查询找到正确图像的系统。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我们从 COCO val2017 中提取了 200 对图像-文本。对于每张图片，GPT-4o-mini 都会生成详细的描述。然后，我们为每张图片编写了 3 个 "硬否定"--与正确描述仅相差一两个细节的描述。该模型必须在 200 张图片和 600 个干扰项中找到正确的匹配项。</p>
<p>数据集中的一个例子</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>棕色复古皮箱上贴有加利福尼亚和古巴等地的旅游贴纸，放置在金属行李架上，映衬着蔚蓝的天空--用作跨模态检索基准的测试图像</span> </span></p>
<blockquote>
<p><strong>正确描述：</strong>图片中的棕色复古皮箱贴有各种旅行贴纸，包括 "加利福尼亚州"、"古巴 "和 "纽约"，放置在金属行李架上，映衬着湛蓝的天空。</p>
<p><strong>硬否定：</strong>同样的句子，但 "加利福尼亚 "变成了 "佛罗里达"，"蓝天 "变成了 "阴天"。模型必须真正理解图像细节，才能将这些区分开来。</p>
</blockquote>
<p><strong>评分：</strong></p>
<ul>
<li>生成所有图片和所有文本的<a href="https://zilliz.com/glossary/vector-embeddings">Embeddings</a>（200 个正确描述 + 600 个硬否定）。</li>
<li><strong>文本到图像 (t2i)：</strong>每个描述搜索 200 张图片，找出最匹配的图片。如果最高结果是正确的，则得一分。</li>
<li><strong>图像到文本 (i2t)：</strong>每张图片搜索所有 800 个文本，找出最接近的匹配项。只有最高结果为正确描述，而非硬性否定，才能得分。</li>
<li><strong>最终得分：</strong>hard_avg_R@1 = (t2i 精确度 + i2t 精确度) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">结果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>横条形图显示跨模式检索排名：Qwen3-VL-2B 以 0.945 分遥遥领先，Gemini Embed 2 以 0.928 分紧随其后，Voyage MM-3.5 以 0.900 分遥遥领先，Jina CLIP v2 以 0.873 分遥遥领先，CLIP ViT-L-14 以 0.768 分遥遥领先。</span> </span></p>
<p>阿里巴巴 Qwen 团队的开源 2B 参数模型 Qwen3-VL-2B 排在第一位，领先于所有闭源 API。</p>
<p><strong>模态差距</strong>是造成差异的主要原因。Embeddings 模型将文本和图像映射到同一个向量空间，但在实际应用中，两种模态往往会聚集在不同的区域。模态差距衡量的是这两个聚类之间的 L2 距离。差距越小，跨模态检索越容易。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>大模态间隙（0.73，文本和图像 Embeddings 簇相距甚远）与小模态间隙（0.25，簇重叠）的可视化对比--间隙越小，跨模态匹配越容易</span> </span></p>
<table>
<thead>
<tr><th>模型</th><th>得分 (R@1)</th><th>模态差距</th><th>参数</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B（开源）</td></tr>
<tr><td>双子座嵌入 2</td><td>0.928</td><td>0.73</td><td>未知（已关闭）</td></tr>
<tr><td>Voyage 多模式 3.5</td><td>0.900</td><td>0.59</td><td>未知（已关闭）</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Qwen 的模态差距为 0.25，大约是 Gemini 的 0.73 的三分之一。在<a href="https://milvus.io/">Milvus</a> 这样的<a href="https://zilliz.com/learn/what-is-a-vector-database">向量数据库</a>中，小的模态差距意味着您可以在同一个<a href="https://milvus.io/docs/manage-collections.md">Collections</a>中存储文本和图像嵌入，并直接在两者之间进行<a href="https://milvus.io/docs/single-vector-search.md">搜索</a>。如果差距过大，跨模态<a href="https://zilliz.com/glossary/similarity-search">相似性搜索</a>的可靠性就会降低，因此可能需要重新排序来弥补。</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">跨语言检索：哪些模型能跨语言调整意义？<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>多语言知识库在生产中很常见。用户用中文提问，但答案却在英文文档中，或者相反。Embeddings 模型需要调整跨语言的含义，而不仅仅是一种语言内的含义。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我们建立了 166 个中英文平行句对，分为三个难度级别：</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>跨语言难度级别：简单级将我爱你等直译句子映射为我爱你；中等级将这道菜太咸了等意译句子映射为这道菜太咸了；困难级将画蛇添足等中文成语映射为锦上添花，并使用语义不同的硬否定句。</span> </span></p>
<p>每种语言还有 152 个硬否定分音符。</p>
<p><strong>评分：</strong></p>
<ul>
<li>生成所有中文文本（166 个正确 + 152 个干扰项）和所有英文文本（166 个正确 + 152 个干扰项）的 Embeddings。</li>
<li><strong>中文 → 英文：</strong>每个中文句子搜索 318 个英文文本，以查找其正确翻译。</li>
<li><strong>英语 → 中文：</strong>反之亦然。</li>
<li><strong>最终得分：</strong>hard_avg_R@1 = (zh→en 准确率 + en→zh 准确率) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">结果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>横条形图显示跨语言检索排名：双子座嵌入 2 以 0.997 分遥遥领先，Qwen3-VL-2B 以 0.988 分紧随其后，Jina v4 以 0.985 分遥遥领先，Voyage MM-3.5 以 0.982 分遥遥领先，mxbai 以 0.120 分垫底。</span> </span></p>
<p>Gemini Embeddings 2 得分为 0.997，是所有测试模型中最高的。在 "画蛇添足"→"锦上添花 "这样的词对中，需要跨语言的真正<a href="https://zilliz.com/glossary/semantic-search">语义</a>理解，而不是模式匹配。</p>
<table>
<thead>
<tr><th>模型</th><th>得分 (R@1)</th><th>简单</th><th>中</th><th>难（成语）</th></tr>
</thead>
<tbody>
<tr><td>双子座 Embeddings 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage 多模态 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-大型</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>前 7 个模型的总分都达到了 0.93，真正的差异出现在硬层（中文成语）上。nomic-embed-text 和 mxbai-embed-large，这两个以英语为重点的轻量级模型，在跨语言任务中的得分接近零。</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">关键信息检索：模型能在 32K 个令牌的文档中找到针吗？<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 系统经常处理冗长的文档--法律合同、研究论文、包含<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据的</a>内部报告。问题是，嵌入模型是否还能找到埋藏在周围数千字符文本中的一个特定事实。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我们将长度不等（4K 到 32K 字符）的维基百科文章作为 HayStack，并在不同的位置（开始、25%、50%、75% 和结束）插入一个编造的事实--针。该模型必须根据查询 Embeddings 来确定哪个版本的文档包含这根针。</p>
<p><strong>示例：针</strong></p>
<ul>
<li><strong>针：</strong>"子午线公司 2025 年第三季度的季度收入为 8.473 亿美元"。</li>
<li><strong>查询：</strong>"Meridian 公司的季度收入是多少？</li>
<li><strong>HayStack：</strong>维基百科上关于光合作用的 32000 字的文章，针就藏在里面。</li>
</ul>
<p><strong>评分：</strong></p>
<ul>
<li>为查询、带针的文档和不带针的文档生成 Embeddings。</li>
<li>如果查询结果与包含针的文档更为相似，则将其视为命中。</li>
<li>所有文档长度和针位置的平均准确率。</li>
<li><strong>最终指标：</strong>总体准确率（overall_accuracy）和下降率（degradation_rate）（从最短文档到最长文档的准确率下降幅度）。</li>
</ul>
<h3 id="Results" class="common-anchor-header">结果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>热图显示按文档长度分类的 HayStack 针刺准确率：双子座嵌入 2 在 32K 以下的所有长度中均获得 1.000 分；前 7 个模型在其上下文窗口内均获得完美得分；mxbai 和 nomic 在 4K+ 时急剧下降</span> </span></p>
<p>Gemini Embeddings 2 是唯一在 4K-32K 范围内进行测试的模型，它在每个长度上都获得了完美的分数。本次测试中没有其他模型的上下文窗口达到 32K。</p>
<table>
<thead>
<tr><th>模型</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>总体</th><th>降级</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embeddings 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-大型</td><td>1.000</td><td>1.000</td><td>1.000</td><td>—</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Embeddings v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>—</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>—</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Voyage 多式联运 3.5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>—</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>—</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>—</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>嵌入式文本 (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>—</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-"表示文档长度超过了模型的上下文窗口。</p>
<p>前 7 个模型的得分完全符合其上下文窗口。BGE-M3 在 8K 时开始下滑（0.920）。轻量级模型（mxbai 和 nomic）的得分在 4K 字符（大约 1000 个字符）时下降到 0.4-0.6。对于 mxbai 而言，这一下降部分反映了其 512 个字符的上下文窗口截断了大部分文档。</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">MRL 尺寸压缩：256 维的质量损失有多大？<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Matryoshka 表征学习（MRL）</strong>是一种训练技术，它能使向量的前 N 个维度本身具有意义。将一个 3072 维的向量截断为 256 维，它仍能保持大部分的语义质量。维数越少，<a href="https://zilliz.com/learn/what-is-a-vector-database">向量数据库</a>的存储和内存成本就越低--从 3072 维到 256 维，存储空间减少了 12 倍。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>显示 MRL 维度截断的插图：全质量为 3072 维，95% 为 1024 维，90% 为 512 维，85% 为 256 维--256 维可节省 12 倍的存储空间</span> </span></p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我们使用了 STS-B 基准中的 150 个句子对，每个句子都有人工标注的相似度得分（0-5）。我们为每个模型生成了全维度嵌入，然后截断为 1024、512 和 256 维。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>STS-B 数据示例显示了具有人类相似性得分的句对：A girl is styling her hair vs A girl is brushing her hair 得分 2.5；A group of men play soccer on the beach vs A group of boys are playing soccer on the beach 得分 3.6。</span> </span></p>
<p><strong>评分：</strong></p>
<ul>
<li>在每个维度上，计算每对句子嵌入之间的<a href="https://zilliz.com/glossary/cosine-similarity">余弦相似度</a>。</li>
<li>使用<strong>斯皮尔曼ρ</strong>（等级相关性）比较模型的相似性排名和人类排名。</li>
</ul>
<blockquote>
<p><strong>什么是 Spearman ρ？</strong>它衡量两个排名的一致程度。如果人类将 A 排列为最相似，B 排列为第二相似，C 排列为最不相似--并且模型的余弦相似度产生了相同的顺序 A &gt; B &gt; C--那么 ρ 接近 1.0。ρ 为 1.0 意味着完全一致。ρ 为 0 表示没有相关性。</p>
</blockquote>
<p><strong>最终指标：</strong>spearman_rho（越高越好）和 min_viable_dim（质量保持在全维度性能的 5%以内的最小维度）。</p>
<h3 id="Results" class="common-anchor-header">结果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>显示 MRL 全维度与 256 维度质量的点阵图：Voyage MM-3.5 以 +0.6% 的变化领先，Jina v4 +0.5%，而 Gemini Embed 2 则以 -0.6% 的变化垫底。</span> </span></p>
<p>如果您打算通过截断维数来降低<a href="https://milvus.io/">Milvus</a>或其他向量数据库的存储成本，那么这个结果就很重要。</p>
<table>
<thead>
<tr><th>模型</th><th>ρ （全维）</th><th>ρ（256 维）</th><th>衰减</th></tr>
</thead>
<tbody>
<tr><td>Voyage 多模态 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>文本嵌入 (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3 大</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>双子座 Embeddings 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage 和 Jina v4 遥遥领先，因为它们都明确将 MRL 作为训练目标。维度压缩与模型大小关系不大，重要的是模型是否经过训练。</p>
<p>关于 Gemini 分数的说明：MRL 排名反映的是模型在截断后的质量保持程度，而不是其全维度检索的好坏。Gemini 的全维度检索能力很强--跨语言和关键信息结果已经证明了这一点。它只是没有针对缩减进行优化。如果你不需要压缩维度，那么这个指标对你就不适用。</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">你应该使用哪种 Embeddings 模型？<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>没有一种模型能赢得一切。以下是完整的记分卡：</p>
<table>
<thead>
<tr><th>模型</th><th>参数</th><th>跨模式</th><th>跨语言</th><th>关键信息</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>双子座嵌入 2</td><td>未披露</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Voyage 多式联运 3.5</td><td>未披露</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Embeddings v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-大型</td><td>未披露</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>未披露</td><td>-</td><td>0.955</td><td>1.000</td><td>—</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-large</td><td>335M</td><td>—</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>嵌入式文本</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-"表示模型不支持该模式或能力。CLIP 是供参考的 2021 基准线。</p>
<p>以下是突出表现：</p>
<ul>
<li><strong>跨模式：</strong>Qwen3-VL-2B（0.945）第一，Gemini（0.928）第二，Voyage（0.900）第三。开源 2B 模型击败了所有闭源 API。决定性因素是模式差距，而不是参数数量。</li>
<li><strong>跨语言：</strong>Gemini（0.997）遥遥领先--它是唯一一个在习语级对齐上获得满分的模型。前 8 个模型的得分均为 0.93。纯英语的轻量级模型得分接近零。</li>
<li><strong>关键信息：</strong>API 和大型开源模型在 8K 以下得分完美。低于 335M 的模型在 4K 时开始下降。只有 Gemini 模型在处理 32K 时得分满分。</li>
<li><strong>MRL 尺寸压缩：</strong>Voyage（0.880）和 Jina v4（0.833）领先，在 256 维时损失不到 1%。Gemini (0.668) 排在最后--在全维度时性能很强，但未针对截断进行优化。</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">如何选择：决策流程图</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>Embeddings 模型选择流程图：开始 → 需要图像或视频？→ 是：需要自行托管？→ 是：Qwen3-VL-2B, No: Gemini Embeddings 2.无图像 → 需要节省存储空间？→是：Jina v4 或 Voyage，否：需要多语言？→是：Gemini Embeddings 2，否：OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">最佳多面手：双子座嵌入式 2</h3><p>综合来看，Gemini Embedding 2 是本次基准测试中综合实力最强的模型。</p>
<p><strong>优势</strong>在跨语言（0.997）和关键信息检索（1.000，所有长度均不超过 32K）方面排名第一。跨模态（0.928）排名第二。模式覆盖面最广--五种模式（文本、图像、视频、音频、PDF），而大多数模型只有三种模式。</p>
<p><strong>弱点</strong>在 MRL 压缩方面排名最后（ρ = 0.668）。在跨模态方面被开源的 Qwen3-VL-2B 所击败。</p>
<p>如果不需要维度压缩，Gemini 在跨语言 + 长文档检索的组合方面没有真正的竞争对手。但在跨模态精度或存储优化方面，专门的模型会做得更好。</p>
<h2 id="Limitations" class="common-anchor-header">局限性<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>我们并没有将所有值得考虑的模型都包括在内--英伟达的 NV-Embed-v2 和 Jina 的 v5-text 都在名单上，但没有进入这一轮。</li>
<li>我们的重点是文本和图像模型；视频、音频和 PDF 嵌入（尽管有些模型声称支持）并未包括在内。</li>
<li>代码检索和其他特定领域的情况不在范围之内。</li>
<li>样本量相对较小，因此模型之间的紧密排名差异可能属于统计噪声。</li>
</ul>
<p>本文的结果将在一年内过时。新模型不断推出，排行榜也会随着每一次发布而重新洗牌。更持久的投资是建立自己的评估管道--定义自己的数据类型、查询模式和文档长度，并在新模型发布时对其进行测试。像 MTEB、MMTEB 和 MMEB 这样的公共基准值得关注，但最终结果还是应该由您自己的数据来决定。</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">我们的基准代码在 GitHub 上是开源的</a>，您可以对其进行分叉，并根据自己的使用情况进行调整。</p>
<hr>
<p>一旦选定了嵌入模型，就需要找个地方大规模存储和搜索这些向量。<a href="https://milvus.io/">Milvus</a>是世界上应用最广泛的开源向量数据库，在<a href="https://github.com/milvus-io/milvus">GitHub 上有 43K+ 星级</a>用户，它支持 MRL 截断维度、混合多模态 Collections、结合密集和稀疏向量的混合搜索，并<a href="https://milvus.io/docs/architecture_overview.md">可从一台笔记本电脑扩展到数十亿</a>向量。</p>
<ul>
<li>请阅读<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入门指南</a>，或使用<code translate="no">pip install pymilvus</code> 进行安装。</li>
<li>加入<a href="https://milvusio.slack.com/">Milvus Slack</a>或<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>，咨询有关<a href="https://discord.com/invite/8uyFbECzPX">Embeddings</a>模型集成、向量索引策略或生产扩展的问题。</li>
<li><a href="https://milvus.io/office-hours">预约免费的 Milvus Office Hours 会议</a>，了解您的 RAG 架构--我们可以在模型选择、Collection Schema 设计和性能调优方面提供帮助。</li>
<li>如果您想跳过基础架构工作，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（托管 Milvus）提供免费层级，让您轻松上手。</li>
</ul>
<hr>
<p>工程师在为生产 RAG 选择嵌入模型时会遇到的几个问题：</p>
<p><strong>问：即使现在只有文本数据，我是否也应该使用多模态嵌入模型？</strong></p>
<p>这取决于您的路线图。如果您的流水线在未来 6-12 个月内可能会添加图片、PDF 或其他模型，那么从 Gemini Embeddings 2 或 Voyage Multimodal 3.5 这样的多模态模型开始，可以避免日后迁移的痛苦--您不需要重新嵌入整个数据集。如果您有信心在可预见的将来只使用文本，那么 OpenAI 3-large 或 Cohere Embed v4 等专注于文本的模型将为您带来更好的性价比。</p>
<p><strong>问：在向量数据库中，MRL 维度压缩究竟能节省多少存储空间？</strong></p>
<p>从 3072 维到 256 维，每个向量的存储空间减少了 12 倍。对于一个在 float32 下有 1 亿向量的<a href="https://milvus.io/">Milvus</a>Collections 来说，大约是 1.14 TB → 95 GB。关键在于，并不是所有模型都能很好地处理截断问题--Voyage Multimodal 3.5 和 Jina Embeddings v4 在 256 维时的质量损失不到 1%，而其他模型则会大幅下降。</p>
<p><strong>问：在跨模态搜索方面，Qwen3-VL-2B 真的比 Gemini Embeddings 2 更好吗？</strong></p>
<p>在我们的基准测试中，Qwen3-VL-2B 的得分是 0.945，而 Gemini 的得分是 0.928。主要原因是 Qwen 的模态差距更小（0.25 对 0.73），这意味着文本和图像<a href="https://zilliz.com/glossary/vector-embeddings">嵌入</a>在向量空间中的聚类更接近。也就是说，Gemini 涵盖五种模态，而 Qwen 只涵盖三种模态，所以如果你需要音频或 PDF 嵌入，Gemini 是唯一的选择。</p>
<p><strong>问：我能直接在 Milvus 中使用这些嵌入模型吗？</strong></p>
<p>可以。所有这些模型都能输出标准浮点向量，您可以将其<a href="https://milvus.io/docs/insert-update-delete.md">插入 Milvus</a>并使用<a href="https://zilliz.com/glossary/cosine-similarity">余弦相似度</a>、L2 距离或内积进行搜索。<a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>可与任何嵌入模型一起使用--使用模型的 SDK 生成向量，然后在 Milvus 中存储和搜索它们。对于 MRL 截断的向量，只需在<a href="https://milvus.io/docs/manage-collections.md">创建</a> Collections 时将其维度设置为目标维度（如 256）即可。</p>
