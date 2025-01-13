---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: 快速构建语义搜索
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: 了解更多有关使用语义机器学习方法在整个组织内提供更多相关搜索结果的信息。
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>快速构建语义搜索</custom-h1><p><a href="https://lucidworks.com/post/what-is-semantic-search/">语义搜索</a>是帮助客户或员工找到正确产品或信息的绝佳工具。它甚至可以显示难以索引的信息，以获得更好的结果。尽管如此，如果你的语义方法不能快速部署，它们也不会给你带来任何好处。客户或员工不会坐等系统慢慢回应他们的查询--而且在同一时间，可能还有成千上万的其他查询正在被收录。</p>
<p>如何让语义搜索变得更快？慢速语义搜索是行不通的。</p>
<p>幸运的是，这正是 Lucidworks 乐于解决的问题。我们最近测试了一个中等规模的 Collections（详情请继续阅读），其结果是，在超过 100 万个文档的 Collections 中实现了 1500 RPS（每秒请求数），平均响应时间约为 40 毫秒。这就是真正的速度。</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">实现语义搜索</h3><p>为了实现快如闪电的机器学习魔力，Lucidworks 使用语义向量搜索方法实现了语义搜索。其中有两个关键部分。</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">第一部分：机器学习模型</h4><p>首先，你需要一种将文本编码成数字向量的方法。文本可以是产品描述、用户搜索查询、问题，甚至是问题的答案。语义搜索模型经过训练后可以对文本进行编码，这样，与其他文本语义相似的文本就会被编码成在数值上彼此 "接近 "的向量。这一编码步骤需要快速完成，以支持每秒上千次或更多可能的客户搜索或用户查询。</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">第二部分：向量搜索引擎</h4><p>其次，您需要一种方法来快速找到与客户搜索或用户查询最匹配的内容。模型会将文本编码为数字向量。在此基础上，您需要将其与目录或问答列表中的所有数字向量进行比较，以找到最佳匹配--与查询向量 "最接近 "的向量。为此，您需要一个能以闪电般的速度有效处理所有这些信息的向量引擎。该引擎可能包含数百万个向量，而你真正想要的只是与查询匹配的二十来个最佳向量。当然，它还需要每秒处理上千个这样的查询。</p>
<p>为了应对这些挑战，我们在<a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">Fusion 5.3 版本</a>中添加了向量搜索引擎<a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a>。Milvus 是一款开源软件，而且速度很快。Milvus 使用 FAISS<a href="https://ai.facebook.com/tools/faiss/">（Facebook 人工智能相似性搜索</a>），这与 Facebook 在生产中用于自己的机器学习计划的技术相同。必要时，它可以在<a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a> 上运行得更快。当 Fusion 5.3（或更高版本）安装了机器学习组件时，Milvus 会作为该组件的一部分自动安装，因此您可以轻松开启所有这些功能。</p>
<p>创建特定 Collections 时指定的该 Collections 中向量的大小取决于生成这些向量的模型。例如，一个给定的 Collections 可以存储对产品目录中的所有产品描述进行编码（通过模型）后生成的向量。如果没有 Milvus 这样的向量搜索引擎，就无法在整个向量空间中进行相似性搜索。因此，相似性搜索只能局限于从向量空间中预先选择的候选向量（例如 500 个），性能较慢，搜索结果的质量也较低。Milvus 可以在多个向量 Collections 中存储数千亿个向量，以确保搜索速度和结果的相关性。</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">使用语义搜索</h3><p>既然我们已经了解了一点 Milvus 可能如此重要的原因，让我们回到语义搜索工作流程上来。语义搜索分为三个阶段。在第一阶段，加载和/或训练机器学习模型。之后，将数据索引到 Milvus 和 Solr 中。最后一个阶段是查询阶段，也就是进行实际搜索的阶段。下面我们将重点讨论最后两个阶段。</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">编入 Milvus 索引</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>如上图所示，查询阶段的开始与索引阶段类似，只是输入的是查询而不是文档。对于每个查询</p>
<ol>
<li>查询会被发送到<a href="https://lucidworks.com/products/smart-answers/">智能答案</a>索引管道。</li>
<li>然后将查询发送到 ML 模型。</li>
<li>ML 模型会返回一个数字向量（从查询中加密）。同样，模型的类型决定了向量的大小。</li>
<li>向量被发送到 Milvus，然后由 Milvus 确定指定的 Milvus Collections 中哪些向量与提供的向量最匹配。</li>
<li>Milvus 会返回与第四步确定的向量相对应的唯一 ID 和距离列表。</li>
<li>包含这些 ID 和距离的查询会被发送到 Solr。</li>
<li>然后，Solr 会返回与这些 ID 相关联的文档的有序列表。</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">规模测试</h3><p>为了证明我们的语义搜索流程能够按照我们的客户要求的效率运行，我们在谷歌云平台上使用 Gatling 脚本运行了规模测试，使用的是带有八个 ML 模型副本、八个查询服务副本和一个 Milvus 实例的 Fusion 集群。测试使用 Milvus FLAT 和 HNSW 索引进行。FLAT 索引的召回率为 100%，但效率较低--数据集较小时除外。HNSW（层次化小世界图）索引仍然具有高质量的结果，而且在较大数据集上的性能有所提高。</p>
<p>让我们来看看我们最近运行的一个示例中的一些数据：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">开始使用</h3><p><a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a>管道设计为易于使用。Lucidworks 具有<a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">预训练模型，这些模型易于部署</a>，通常具有良好的效果--不过，在预训练模型的同时训练您自己的模型，将获得最佳效果。现在就联系我们，了解如何在搜索工具中实施这些措施，以获得更有效、更令人愉悦的结果。</p>
<blockquote>
<p>本博客转贴自：https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
