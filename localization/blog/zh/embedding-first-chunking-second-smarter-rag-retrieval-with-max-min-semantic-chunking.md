---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: 先嵌入，后分块：利用最大-最小语义分块实现更智能的 RAG 检索
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  了解 Max-Min Semantic Chunking（最大最小语义分块）如何利用嵌入优先的方法提高 RAG
  准确性，从而创建更智能的分块、改善上下文质量并提供更好的检索性能。
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">检索增强生成（RAG）</a>已成为为人工智能应用提供上下文和记忆的默认方法--人工智能 Agents、客户支持助理、知识库和搜索系统都依赖于它。</p>
<p>在几乎所有 RAG 管道中，标准流程都是一样的：获取文档，将其分割成块，然后将这些块嵌入<a href="https://milvus.io/">Milvus</a> 这样的向量数据库中进行相似性检索。由于<strong>分块</strong>是在前期进行的，因此这些分块的质量直接影响到系统检索信息的效果和最终答案的准确性。</p>
<p>问题在于，传统的分块策略通常是在不理解语义的情况下分割文本。固定长度分块基于标记数进行切割，递归分块则使用表层结构，但这两种方法都忽略了文本的实际含义。因此，相关的观点往往会被分开，不相关的行文会被组合在一起，重要的上下文也会被割裂。</p>
<p><a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>最大最小语义分块</strong></a>法采用了不同的处理方法。它不是先进行分块，而是先嵌入文本，并利用语义相似性来决定边界的形成。通过先嵌入后切块，管道可以跟踪意义的自然变化，而不是依赖于任意的长度限制。</p>
<p>在上一篇博客中，我们讨论了像 Jina AI 的<a href="https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md"><strong>Late Chunking</strong></a> 这样的方法，它帮助普及了 "先嵌入 "的理念，并证明了它在实践中是可行的。<strong>Max-Min Semantic Chunking（最大最小语义分块</strong>法）基于相同的概念，采用了一条简单的规则，用于识别含义何时发生变化，以至于有必要创建一个新的分块。在本篇文章中，我们将介绍Max-Min是如何工作的，并探讨它在实际RAG工作负载中的优势和局限性。</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">典型 RAG 管道的工作原理<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>无论采用何种框架，大多数 RAG 管道都遵循相同的四阶段流水线。您自己可能也写过类似的版本：</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1.数据清理和分块</h3><p>流水线首先要清理原始文档：删除页眉、页脚、导航文本以及任何非真实内容。去除杂质后，文本会被分割成更小的片段。大多数团队使用固定大小的块--通常为 300-800 个标记--因为这样可以保持嵌入模型的可管理性。这样做的缺点是，分割是基于长度而不是意义，因此边界可以是任意的。</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2.嵌入和存储</h3><p>然后，使用类似 OpenAI 的嵌入模型或 BAAI 的编码器嵌入每个语块。 <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a>或 BAAI 编码器。生成的向量存储在向量数据库中，如<a href="https://milvus.io/">Milvus</a>或<a href="https://zilliz.com/cloud">Zilliz Cloud</a>。数据库会处理索引和相似性搜索，因此您可以快速将新查询与所有存储的数据块进行比较。</p>
<h3 id="3-Querying" class="common-anchor-header">3.查询</h3><p>当用户提出问题时，例如<em>"RAG 如何减少幻觉？</em>- 系统会嵌入查询并将其发送到数据库。数据库会返回向量最接近查询的前 K 个文本块。这些就是模型回答问题所依赖的文本片段。</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4.生成答案</h3><p>检索到的文本块与用户查询捆绑在一起，并输入 LLM。该模型以提供的上下文为基础生成答案。</p>
<p><strong>分块是整个流程的起点，但它的影响却非常大</strong>。如果分块符合文本的自然含义，那么检索结果就会准确一致。如果分块被切到了不合适的地方，即使有强大的 Embeddings 和快速的向量数据库，系统也很难找到正确的信息。</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">正确分块的挑战</h3><p>目前，大多数 RAG 系统都使用两种基本分块方法中的一种，这两种方法都有局限性。</p>
<p><strong>1.固定大小的分块</strong></p>
<p>这是最简单的方法：按照固定的标记或字符数分割文本。这种方法速度快、可预测，但完全不考虑语法、主题或过渡。句子可能被切成两半。有时甚至是单词。从这些分块中得到的 Embeddings 往往是嘈杂的，因为边界并不能反映文本的实际结构。</p>
<p><strong>2.递归字符分割</strong></p>
<p>这种方法比较聪明。它根据段落、换行或句子等线索对文本进行分层。如果某个部分过长，它就会递归地进一步分割。这种方法的输出一般比较连贯，但仍不一致。有些文档缺乏清晰的结构，或者章节长度不均匀，这都会影响检索的准确性。在某些情况下，这种方法仍然会产生超出模型上下文窗口的内容块。</p>
<p>这两种方法都面临着同样的取舍：精度与上下文。较小的信息块可以提高检索精度，但会丢失周围的上下文；较大的信息块可以保留意义，但有可能增加无关的噪音。如何在两者之间取得适当的平衡，是分块法在 RAG 系统设计中既重要又令人头疼的问题。</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="common-anchor-header">最大最小语义分块：先嵌入，后分块<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 年，S.R. Bhat 等人发表了《<a href="https://arxiv.org/abs/2505.21700"><em>重新思考长文档检索的分块大小》（</em></a>Rethinking<a href="https://arxiv.org/abs/2505.21700"><em>Chunk Size for Long-Document Retrieval）一文：多数据集分析</em></a>》一书。他们的主要发现之一是，对于 RAG 而言，并不存在单一的<strong>"最佳 "</strong>分块大小。小块（64-128 个词块）往往更适合事实性或查找式问题，而大块（512-1024 个词块）则有助于叙述性或高层次推理任务。换句话说，固定大小的分块总是一种折衷。</p>
<p>这就自然而然地提出了一个问题：我们是否可以根据意义而不是大小来分块，而不是选择一种长度并希望达到最佳效果？<a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>最大最小语义分块</strong></a>法正是我发现的一种尝试这样做的方法。</p>
<p>这个想法很简单：<strong>先嵌入，后分块</strong>。这种算法不是先分割文本，然后再嵌入掉出来的任何碎片，而是先嵌入<em>所有句子</em>。然后，它利用这些句子嵌入之间的语义关系来决定边界的位置。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>最大最小语义分块法中 "先嵌入，后分块 "工作流程示意图</span> </span></p>
<p>从概念上讲，该方法将分块处理视为嵌入空间中的受限聚类问题。您按顺序浏览文档，每次浏览一个句子。对于每个句子，算法都会将其嵌入与当前分块中的嵌入进行比较。如果新句子在语义上足够接近，它就会加入该语块。如果距离太远，算法就会启动一个新的语块。关键的限制条件是，语块必须遵循原始句子的顺序--不能重新排序，也不能进行全局聚类。</p>
<p>这样就产生了一组长度可变的语块，这些语块反映了文档含义的实际变化，而不是字符计数器碰巧归零的地方。</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">最大最小语义分块策略的工作原理<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunking（最大最小语义分块）通过比较句子在高维向量空间中的相互关系来确定分块边界。它不依赖于固定的长度，而是研究意义在整个文档中的变化。这一过程可分为六个步骤：</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1.嵌入所有句子并开始一个大块</h3><p>嵌入模型会将文档中的每个句子转换为向量嵌入。它按顺序处理句子。如果前<em>n-k 个</em>句子构成了当前的语块 C，那么接下来的句子（sₙ₋ₖ₊₁）需要进行评估：是加入 C，还是开始一个新的语块？</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2.测量当前数据块的一致性</h3><p>在语块 C 中，计算所有句子嵌入之间的最小成对余弦相似度。这个值反映了该语块中各句子之间的紧密程度。最小相似度越低，说明句子之间的关联度越低，表明该语块可能需要拆分。</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3.将新句子与语块进行比较</h3><p>接下来，计算新句子与 C 中已有句子之间的最大余弦相似度。</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4.决定是扩展语块还是开始一个新的语块</h3><p>这是核心规则：</p>
<ul>
<li><p>如果<strong>新句子</strong>与语块<strong>C</strong> <strong>的最大相似度</strong> <strong>大于或等于</strong>语块<strong>C 内部的最小相似度</strong>，→新句子适合并留在语块中。</p></li>
<li><p>否则，→ 开始一个新的语块。</p></li>
</ul>
<p>这样可以确保每个语块保持其内部语义的一致性。</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5.根据文档变化调整阈值</h3><p>为了优化数据块质量，可以动态调整数据块大小和相似性阈值等参数。这样，算法就能适应不同的文档结构和语义密度。</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6.处理前几个句子</h3><p>当一个语块只包含一个句子时，算法会使用一个固定的相似性阈值来处理第一次比较。如果句子 1 和句子 2 之间的相似度高于该阈值，它们就会形成一个语块。否则，它们会立即分开。</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">最大最小语义分块的优势和局限性<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>最大最小语义分块法通过使用意义而不是长度来改进 RAG 系统分割文本的方式，但它并不是万能的。下面我们就来实际看看它的优点和不足。</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">它的优点</h3><p>最大最小语义分块技术在三个重要方面改进了传统的分块技术：</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1.动态、意义驱动的分块边界</strong></h4><p>与固定大小或基于结构的方法不同，这种方法依靠语义相似性来指导分块。它将当前语块内的最小相似度（语块的内聚性）与新句子与该语块之间的最大相似度（语块的匹配程度）进行比较。如果后者更高，则该句子加入该语块；反之，则开始一个新的语块。</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2.简单实用的参数调整</strong></h4><p>该算法只依赖于三个核心超参数：</p>
<ul>
<li><p><strong>最大语块大小</strong></p></li>
<li><p>前两个句子之间的<strong>最小相似度</strong>，以及</p></li>
<li><p>添加新句子的<strong>相似度阈值</strong>。</p></li>
</ul>
<p>这些参数会根据上下文自动调整--更大的语块需要更严格的相似度阈值来保持一致性。</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3.低处理开销</strong></h4><p>由于 RAG 管道已经计算了句子嵌入，因此 Max-Min Semantic Chunking 不会增加繁重的计算量。它所需要的只是在扫描句子时进行一组余弦相似性检查。这使得它比许多需要额外模型或多级聚类的语义分块技术更便宜。</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">仍无法解决的问题</h3><p>最大最小语义分块技术改进了分块边界，但并没有解决文档分割的所有难题。由于该算法是按顺序处理句子的，而且只进行局部聚类，因此它仍然会遗漏较长或较复杂文档中的长距离关系。</p>
<p>一个常见问题是<strong>上下文割裂</strong>。当重要信息分散在文档的不同部分时，算法可能会将这些片段放入不同的块中。这样，每个片段就只能承载部分含义。</p>
<p>例如，在下图所示的 Milvus 2.4.13 发布说明中，一个块可能包含版本标识符，而另一个块则包含功能列表。像<em>"Milvus 2.4.13 中引入了哪些新功能？"</em>这样的查询就取决于这两个内容。如果这些细节被分割到不同的块中，Embeddings 模型可能无法将它们连接起来，从而导致检索功能减弱。</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>显示 Milvus 2.4.13 发布说明中上下文分割的示例，版本标识符和功能列表被分割在不同的块中</span> </span></li>
</ul>
<p>这种碎片化也会影响 LLM 生成阶段。如果版本引用在一个块中，而特征描述在另一个块中，那么模型接收到的上下文就不完整，无法清晰地推理出两者之间的关系。</p>
<p>为了缓解这些情况，系统通常会使用滑动窗口、重叠块边界或多路扫描等技术。这些方法可以重新引入部分缺失的上下文，减少碎片化，并帮助检索步骤保留相关信息。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>最大最小语义分块法并不是解决所有RAG问题的灵丹妙药，但它确实为我们提供了一种更理智的方法来考虑分块边界。它不是让标记限制来决定观点在哪里被切分，而是使用嵌入来检测意义在哪里发生了实际变化。对于许多现实世界中的文档--API、规范、日志、发布说明、故障排除指南--来说，仅这一点就能明显提高检索质量。</p>
<p>我喜欢这种方法的原因是，它能自然地融入现有的 RAG 流程。如果你已经嵌入了句子或段落，那么额外的成本基本上就是一些余弦相似性检查。你不需要额外的模型、复杂的聚类或重量级的预处理。当这种方法奏效时，它所产生的信息块会让人感觉更 "人性化"--更接近我们在阅读时对信息的心理分组方式。</p>
<p>但这种方法仍然存在盲点。它只能看到局部的意义，无法重新连接故意分散的信息。重叠窗口、多路扫描和其他保留上下文的技巧仍然是必要的，尤其是对于参考文献和解释相距甚远的文档。</p>
<p>尽管如此，最大最小语义分块技术还是让我们朝着正确的方向前进：从任意的文本切分转向真正尊重语义的检索管道。如果您正在探索如何提高 RAG 的可靠性，那么它值得一试。</p>
<p>有问题或想深入了解如何提高 RAG 性能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord</a>，与每天都在构建和调整真实检索系统的工程师们交流。</p>
