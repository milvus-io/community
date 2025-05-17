---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: Milvus 2.6 预览版：内存减少 72% 而不影响调用，速度比 Elasticsearch 快 4 倍
author: Ken Zhang
date: 2025-05-16T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: 独家抢先了解即将发布的 Milvus 2.6 中的创新技术，它们将重新定义向量数据库的性能和效率。
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>纵观本周，我们分享了 Milvus 一系列令人兴奋的创新，这些创新推动了向量数据库技术的发展：</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">现实世界中的向量搜索：如何高效过滤而不扼杀召回率 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus如何利用RaBitQ提供多3倍的查询服务</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准会说谎--向量数据库需要经受真正的考验 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们在 Milvus 中用啄木鸟取代了 Kafka/Pulsar </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器 </a></p></li>
</ul>
<p>Milvus 2.6 是我们 2025 年产品路线图中的一个重要里程碑，目前正在开发中，这些改进将如何改变人工智能驱动的搜索。即将发布的版本汇集了所有这些创新，并在三个关键方面做了更多改进：<strong>成本效益优化</strong>、<strong>高级搜索功能</strong>，以及将向量搜索推向 100 亿向量规模以上的<strong>新架构</strong>。</p>
<p>Milvus 2.6 将于今年 6 月发布，让我们深入了解其中的一些关键改进，首先可能是最直接的影响：内存使用量和成本的大幅降低，以及超快的性能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">降低成本：削减内存使用量，同时提升性能<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>依赖昂贵的内存是将向量搜索扩展到数十亿条记录的最大障碍之一。Milvus 2.6 将引入几项关键优化，在提高性能的同时大幅降低基础架构成本。</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">RaBitQ 1 位量化：内存消耗减少 72%，QPS 提高 4 倍，且无召回损失</h3><p>长期以来，内存消耗一直是大规模向量数据库的致命弱点。虽然向量量化并不新鲜，但现有的大多数方法都为了节省内存而牺牲了太多的搜索质量。Milvus 2.6 将在生产环境中引入<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> RaBitQ 1 位量化</a>，从而迎头解决这一难题。</p>
<p>我们的实现之所以与众不同，是因为我们正在构建可调整的 Refine 优化功能。通过实施具有 RaBitQ 量化和 SQ4/SQ6/SQ8 Refine 选项的主索引，我们在内存使用和搜索质量（约 95% 的召回率）之间实现了最佳平衡。</p>
<p>我们的初步基准测试结果很有希望：</p>
<table>
<thead>
<tr><th><strong>性能指标</strong></th><th><strong>传统 IVF_FLAT</strong></th><th><strong>仅 RaBitQ（1 位</strong></th><th><strong>RaBitQ (1 位) + SQ8 Refine</strong></th></tr>
</thead>
<tbody>
<tr><td>内存占用</td><td>100%（基线）</td><td>3%（减少 97）</td><td>28%（减少 72）</td></tr>
<tr><td>调用质量</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>查询吞吐量 (QPS)</td><td>236</td><td>648 （快 2.7 倍）</td><td>946（快 4 倍）</td></tr>
</tbody>
</table>
<p><em>表：VectorDBBench 评估，使用 768 维的 1M 向量，在 AWS m6id.2xlarge 上测试</em></p>
<p>这里真正的突破不仅仅是内存的减少，而是在不影响准确性的情况下，同时实现了 4 倍的吞吐量提升。这意味着，您可以减少 75% 的服务器来处理相同的工作负载，或在现有基础架构上处理多 4 倍的流量。</p>
<p>对于在<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> 上使用完全托管 Milvus 的企业用户，我们正在开发自动配置文件，它将根据您的特定工作负载特征和精度要求动态调整 RaBitQ 参数。</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">全文搜索速度比 Elasticsearch 快 400</h3><p>向量数据库中的<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">全文检索</a>功能已成为构建混合检索系统的关键。自从在<a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> 中引入 BM25 以来，我们收到了热烈的反馈--同时还收到了对更高性能的要求。</p>
<p>Milvus 2.6 将大幅提高 BM25 的性能。我们在 BEIR 数据集上进行的测试表明，在召回率相同的情况下，吞吐量比 Elasticsearch 高出 3-4 倍。在某些工作负载上，QPS 的提升高达 7 倍。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图Milvus 与 Elasticsearch 在 JSON 路径索引吞吐量上的对比：复杂过滤的延迟降低 99</p>
<p>现代人工智能应用很少单独依赖向量相似性，它们几乎总是将向量搜索与元数据过滤相结合。随着这些过滤条件变得越来越复杂（尤其是嵌套的 JSON 对象），查询性能会迅速下降。</p>
<p>Milvus 2.6 将引入针对嵌套 JSON 路径的定向索引机制，允许您在 JSON 字段内的特定路径（如 $meta.<code translate="no">user_info.location</code> ）上创建索引。Milvus 将直接从预建索引中查找值，而不是扫描整个对象。</p>
<p>在我们对 100 多万条记录进行的评估中，JSON 路径索引将过滤延迟从<strong>140 毫秒</strong>（P99：480 毫秒）减少到仅<strong>1.5</strong>毫秒（P99：10 毫秒）--减少了 99%，将以前不切实际的查询转变为即时响应。</p>
<p>该功能对以下方面尤为重要</p>
<ul>
<li><p>具有复杂用户属性过滤功能的推荐系统</p></li>
<li><p>通过各种标签过滤文档的 RAG 应用程序</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">下一代搜索：从基本向量相似性到生产级检索<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>对于现代人工智能应用而言，仅靠向量搜索是不够的。用户需要传统信息检索的精确性与向量嵌入的语义理解相结合。Milvus 2.6 将引入几项高级搜索功能来弥补这一差距。</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">利用多语言分析器进行更好的全文检索</h3><p>全文搜索高度依赖语言......Milvus 2.6 将引入一个支持多语言的全新文本分析管道：</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> 分析器/标记化配置可观察性的语法支持</p></li>
<li><p>用于日语和韩语等亚洲语言的 Lindera 标记符号化器</p></li>
<li><p>用于全面支持多语言的 ICU 标记符号生成器</p></li>
<li><p>用于定义特定语言标记化规则的细粒度语言配置</p></li>
<li><p>增强的 Jieba 支持自定义词典集成</p></li>
<li><p>扩展了过滤器选项，可进行更精确的文本处理</p></li>
</ul>
<p>对于全球应用而言，这意味着更好的多语言搜索，而无需专门的每种语言索引或复杂的变通方法。</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">短语匹配：捕捉词序中的语义细微差别</h3><p>词序传达了关键字搜索经常忽略的重要意义区别。试着比较一下 &quot;机器学习技术 &quot;和 &quot;学习机器技术&quot;--同样的词，意思却完全不同。</p>
<p>Milvus 2.6 将增加<strong>词组匹配</strong>功能，与全文搜索或精确字符串匹配相比，用户可以对词序和词距进行更多控制：</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">slop</code> 参数可灵活控制词的邻近度-0 需要精确的连续匹配，而更高的值则允许词组的细微变化。</p>
<p>这一功能对于以下情况尤为重要</p>
<ul>
<li><p>精确措辞具有法律意义的法律文件检索</p></li>
<li><p>术语顺序区分不同概念的技术内容检索</p></li>
<li><p>必须精确匹配特定技术短语的专利数据库</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">时间感知衰减功能：自动优先处理新鲜内容</h3><p>信息的价值往往会随着时间的推移而降低。新闻文章、产品发布和社交帖子的相关性都会随着时间的推移而降低，但传统的搜索算法却对所有内容一视同仁，无论其时间戳如何。</p>
<p>Milvus 2.6 将引入用于时间感知排名的<strong>衰减函数（Decay Functions</strong>），可根据文档年龄自动调整相关性得分。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>您可以配置</p>
<ul>
<li><p><strong>函数类型</strong>：指数（快速衰减）、高斯（逐渐衰减）或线性（持续衰减）</p></li>
<li><p><strong>衰减率</strong>：相关性随时间衰减的速度</p></li>
<li><p><strong>原点</strong>：测量时间差的参考时间戳</p></li>
</ul>
<p>这种对时间敏感的重新排序将确保最新的、与上下文相关的结果首先出现，这对新闻推荐系统、电子商务平台和社交媒体馈送至关重要。</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">数据输入，数据输出：从原始文本到向量搜索，一步到位</h3><p>向量数据库最大的开发痛点之一就是原始数据与向量嵌入之间的脱节。Milvus 2.6 将大幅简化这一工作流程，新的<strong>功能</strong>界面可将第三方嵌入模型直接集成到您的数据管道中。只需一次调用，即可简化向量搜索管道。</p>
<p>您将不再需要预先计算嵌入模型，而是可以</p>
<ol>
<li><p><strong>直接插入原始数据</strong>：向 Milvus 提交文本、图像或其他内容</p></li>
<li><p><strong>为向量化配置嵌入式提供商</strong>：Milvus 可以连接到嵌入模型服务，如 OpenAI、AWS Bedrock、Google Vertex AI 和 Hugging Face。</p></li>
<li><p><strong>使用自然语言查询</strong>：使用文本查询而非向量嵌入进行搜索</p></li>
</ol>
<p>这将创造一种简化的 "数据输入、数据输出 "体验，Milvus 在内部处理向量生成，使您的应用代码更加简洁明了。</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">架构演变：扩展到数千亿向量<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>一个好的数据库不仅要有强大的功能，还必须大规模地提供这些功能，并在生产中经过实战检验。</p>
<p>Milvus 2.6 将引入一项根本性的架构变革，实现经济高效地扩展到千亿向量。其亮点是全新的冷热分层存储架构，可根据访问模式智能管理数据放置，自动将热数据移至高性能内存/SSD，同时将冷数据放置在更经济的对象存储中。这种方法可以大幅降低成本，同时在最重要的地方保持查询性能。</p>
<p>此外，新的<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">流节点（Streaming Node</a>）将通过与 Kafka 和 Pulsar 等流平台以及新创建的<a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">啄木鸟（Woodpecker</a>）的直接集成，实现实时向量处理，使新数据可立即搜索，而不会出现批处理延迟。</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">敬请期待 Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 目前正在积极开发中，将于今年 6 月推出。我们很高兴能为您带来这些突破性的性能优化、先进的搜索功能和全新的架构，帮助您以更低的成本构建可扩展的人工智能应用。</p>
<p>同时，我们欢迎您就这些即将推出的功能提供反馈意见。什么最让您兴奋？哪些功能对您的应用影响最大？请加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上关注我们的进展。</p>
<p>想在 Milvus 2.6 发布时第一时间知道吗？在<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a>或<a href="https://twitter.com/milvusio"> X</a>上关注我们，获取最新更新。</p>
