---
id: multimodal-semantic-search-with-images-and-text.md
title: 利用图像和文本进行多模态语义搜索
author: Stefan Webb
date: 2025-02-3
desc: 了解如何使用多模态人工智能构建语义搜索应用程序，该应用程序不仅能理解基本的关键字匹配，还能理解文本与图像之间的关系。
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>作为人类，我们通过感官来解读世界。我们听到声音，看到图像、视频和文字，而且往往是层层叠加。我们通过这些多重模式以及它们之间的关系来理解世界。人工智能要想真正达到或超过人类的能力，就必须发展出这种同时通过多种视角理解世界的能力。</p>
<p>在这篇文章和随附的视频（即将发布）和笔记本中，我们将展示最近在能够同时处理文本和图像的模型方面取得的突破。我们将通过构建一个语义搜索应用程序来展示这一点，该应用程序不仅仅是简单的关键词匹配，它还能理解用户的需求与他们正在搜索的可视化内容之间的关系。</p>
<p>让这个项目特别令人兴奋的是，它完全由开源工具构建：Milvus 向量数据库、HuggingFace 的机器学习库和亚马逊客户评论数据集。想想看，仅仅在十年前，构建这样一个项目还需要大量的专有资源。如今，这些功能强大的组件都是免费提供的，任何有好奇心的人都可以用创新的方式将它们结合起来。</p>
<custom-h1>概述</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们的多模式搜索应用程序属于<em>检索和 Rerankers 类型。</em>如果您熟悉<em>检索增强生成</em>（RAG），那么它与之非常相似，只是最终输出的是由大型语言视觉模型（LLVM）重新排序的图像列表。用户的搜索查询包含文本和图像，目标是一组索引在向量数据库中的图像。该架构有三个步骤--<em>索引</em>、<em>检索</em>和<em>Rerankers</em>（类似于 "生成"）--我们将依次进行总结。</p>
<h2 id="Indexing" class="common-anchor-header">编制索引<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>我们的搜索应用程序必须有要搜索的内容。在我们的案例中，我们使用的是 "亚马逊评论 2023 "数据集的一个小子集，该数据集包含来自亚马逊所有类型产品的客户评论的文本和图片。可以想象，我们正在构建的语义搜索将成为电子商务网站的有益补充。我们使用了 900 张图片，舍弃了文本，但我们注意到，只要有合适的数据库和推理部署，这本笔记本就能扩展到生产规模。</p>
<p>我们管道中的第一个 "魔法 "是嵌入模型的选择。我们使用的是最近开发的一种名为<a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a>的多模态模型，该模型能够将文本和图像联合嵌入同一空间，也可以将其中任何一个单独嵌入同一空间，在该空间中，相近的点在语义上是相似的。最近还开发了其他此类模型，例如<a href="https://github.com/google-deepmind/magiclens">MagicLens</a>。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>上图说明：[狮子侧面的图像]加上文字 "此物的正面图 "的嵌入与不带文字的[狮子正面的图像]的嵌入很接近。文本加图像输入和纯图像输入（以及纯文本输入）都使用相同的模型。<em>这样，模型就能理解用户的意图，即查询文本与查询图片之间的关系。</em></p>
<p>我们嵌入了 900 张没有相应文本的产品图片，并使用<a href="https://milvus.io/docs">Milvus</a> 将嵌入的图片存储到向量数据库中。</p>
<h2 id="Retrieval" class="common-anchor-header">检索<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>数据库建立后，我们就可以为用户提供查询服务了。想象一下，一个用户带着这样的查询来了："有这个的手机壳 "加上[一张豹子的图片]。也就是说，他们在搜索带有豹纹图案的手机壳。</p>
<p>请注意，用户的查询文本说的是 "这个"，而不是 "豹皮"。我们的 Embeddings 模型必须能够将 "this "与它所指的内容联系起来，鉴于之前的迭代模型无法处理这种开放式指令，这是一项了不起的成就。<a href="https://arxiv.org/abs/2403.19651">MagicLens</a>的<a href="https://arxiv.org/abs/2403.19651">论文</a>给出了更多的例子。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们将查询文本和图片联合嵌入，并对向量数据库进行相似性搜索，返回前九个点击。结果如上图所示，同时显示的还有豹子的查询图像。从图中可以看出，点击率最高的结果并不是与查询最相关的结果。第七个结果似乎是最相关的--它是一个印有豹皮图案的手机套。</p>
<h2 id="Generation" class="common-anchor-header">生成<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>我们的搜索似乎失败了，因为最前面的结果不是最相关的。不过，我们可以通过 Rerankers 步骤来解决这个问题。您可能对检索项的重新排序并不陌生，这是许多 Rerankers 流程中的一个重要步骤。我们使用<a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a>作为重排模型。</p>
<p>我们首先要求 LLVM 生成查询图片的标题。LLVM 输出</p>
<p><em>"图片显示了一只豹子的脸部特写，重点是它的斑点皮毛和绿色眼睛"。</em></p>
<p>然后，我们输入这个标题、一张包含九个结果和查询图像的图片，并构建一个文本提示，要求模型对结果重新排序，以列表的形式给出答案，并提供选择最匹配结果的理由。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>输出结果如上图所示--最相关的项目现在是最匹配的--给出的理由是</p>
<p><em>"最合适的项目是以豹子为主题的项目，它符合用户关于类似主题手机壳的查询指令"。</em></p>
<p>我们的 LLVM 重排序器能够跨图像和文本进行理解，并提高搜索结果的相关性。<em>一个有趣的现象是，重新排序器只给出了八个结果，却丢掉了一个结果，这凸显了对护栏和结构化输出的需求。</em></p>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>在这篇文章以及随附的视频（即将发布）和<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">笔记本</a>中，我们构建了一个跨文本和图像的多模态语义搜索应用程序。嵌入模型能够将文本和图像联合或单独嵌入同一空间，基础模型能够输入文本和图像，同时生成文本作为响应。<em>重要的是，Embeddings 模型能够将用户的开放式指令意图与查询图像联系起来，并以这种方式指定用户希望结果如何与输入图像相关联。</em></p>
<p>这只是不久的将来的一个缩影。我们将看到多模态搜索、多模态理解和推理等在不同模态中的大量应用：图像、视频、音频、分子、社交网络、表格数据、时间序列，潜力无穷。</p>
<p>而这些系统的核心是一个向量数据库，它承载着系统的外部 "内存"。Milvus 就是一个很好的选择。它是开源的，功能齐全（请参阅<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">本文关于 Milvus 2.5 中全文搜索的内容</a>），并能以网络规模的流量和低于 100 毫秒的延迟高效地扩展到数十亿向量。如需了解更多信息，请访问<a href="https://milvus.io/docs">Milvus 文档</a>，加入我们的<a href="https://milvus.io/discord">Discord</a>社区，并希望在下一次<a href="https://lu.ma/unstructured-data-meetup">非结构化数据会议</a>上见到您。再见！</p>
<h2 id="Resources" class="common-anchor-header">资源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>笔记本：<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"使用亚马逊评论和 LLVM Rerankers 进行多模态搜索</a></p></li>
<li><p>Youtube AWS 开发人员视频（即将发布）</p></li>
<li><p><a href="https://milvus.io/docs">Milvus 文档</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">非结构化数据会议</a></p></li>
<li><p>Embeddings 模型：<a href="https://huggingface.co/BAAI/bge-visualized">可视化 BGE 模型卡</a></p></li>
<li><p>另一种嵌入模型：<a href="https://github.com/google-deepmind/magiclens">MagicLens 模型仓库</a></p></li>
<li><p>LLVM：<a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision 模型卡</a></p></li>
<li><p>论文<a href="https://arxiv.org/abs/2403.19651">"MagicLens：使用开放式指令的自监督图像检索</a></p></li>
<li><p>数据集：<a href="https://amazon-reviews-2023.github.io/">亚马逊评论 2023</a></p></li>
</ul>
