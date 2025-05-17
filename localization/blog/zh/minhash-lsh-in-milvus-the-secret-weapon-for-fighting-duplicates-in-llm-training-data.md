---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  Milvus 2.6 中的 MinHash LSH 为海量 LLM 训练数据集的重复数据处理提供了高效的解决方案，与传统方法相比，处理速度提高了 2
  倍，成本节省了 3-5 倍。
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>大型语言模型（LLMs）凭借其编写代码、创建内容和解决复杂问题的能力，改变了人工智能的格局。然而，这些功能强大的模型需要海量的高质量数据作为训练的基础。</p>
<p>挑战在于，原始训练数据往往包含大量冗余。这就好比教孩子时，一遍又一遍地重复同样的课程，却跳过了其他重要的主题。一家大型人工智能公司正是带着这样的问题找到了我们--他们正在建立一个雄心勃勃的新语言模型，但在对数百亿份文档进行重复性处理时却遇到了困难。传统的匹配方法无法扩展到如此大的容量，而专门的重复数据删除工具需要大量的计算资源，因此在经济上是不可行的。</p>
<p>为了解决这个问题，我们的解决方案是：MinHash LSH（位置敏感散列）索引，它将在 Milvus 2.6 中推出。本文将探讨 MinHash LSH 如何有效解决 LLM 训练中的重复数据删除问题。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">重复数据删除：为什么对 LLM 培训很重要<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>高质量、多样化的数据对于训练强大的 LLM 至关重要。当重复内容出现在训练数据中时，会产生几个重大问题：</p>
<ul>
<li><p><strong>浪费资源：</strong>冗余数据会增加训练时间、成本和能耗。</p></li>
<li><p><strong>降低性能：</strong>模型可能会过度拟合重复内容，从而限制了对新信息的泛化能力。</p></li>
<li><p><strong>记忆效应：</strong>重复内容会增加模型逐字记忆和复制特定文本的机会。这还可能导致隐私泄露或版权问题。</p></li>
<li><p><strong>误导评估：</strong>训练集和测试集之间的重复内容会意外夸大性能指标。</p></li>
</ul>
<p>查找和删除重复数据主要有三种方法：</p>
<ul>
<li><p><strong>精确匹配：</strong>通过哈希算法识别完全相同的重复数据。</p></li>
<li><p><strong>近似匹配：</strong>使用 MinHash LSH 和 Jaccard 相似度等算法查找接近重复的内容。</p></li>
<li><p><strong>语义匹配：</strong>使用向量嵌入识别含义相似的内容。</p></li>
</ul>
<p>由于预先训练的语料库达到 TB 甚至 PB 级，传统的精确匹配方法（如成对比较）在计算上不可行。通过使用嵌入模型生成向量，语义重复数据删除增加了大量开销。我们需要更多创新的近似方法，如<strong>MinHash LSH--</strong>既能平衡召回率和精度，又能控制成本，使大规模重复数据删除切实可行。</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH：高效检测海量数据集中的近似重复数据<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>要在海量训练数据中找到近似重复数据，我们需要一种既高效又准确的近似匹配算法。MinHash LSH（位置敏感散列）是实现这一目标的绝佳工具。让我们一步步分解这个看似复杂的术语。</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">第一步：用 MinHash 表示文档</h3><p>首先，我们需要一种测量文档相似性的方法。标准的方法是使用 Jaccard 相似性：</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mfrac><mrow><mi mathvariant="normal">=∣A∩B∣∣A∪B∣J</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">(A,B) = \frac{||A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span>B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span>=</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal" style="margin-right:0.05017em;">∪8</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.05017em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>该公式衡量文档 A 和文档 B 之间的重叠度--具体来说，即共享元素与唯一元素总数之比。数值越高，说明文档越相似。</p>
<p>然而，直接计算数十亿文档对的重叠度需要大量资源，而且耗时数年。MinHash 可以创建紧凑的 "指纹"（签名），既能保留相似性关系，又能更快地进行比较。</p>
<ol>
<li><strong>串联：</strong>将每个文档分成重叠的单词或字符序列（k-shingles）。例如，"我爱向量搜索 "这个句子在 k=3 时（按单词）会产生：{"我爱向量"，"爱向量搜索"}。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>最小</strong>哈希值<strong>：</strong>对每组字符串应用多个哈希函数，并记录每个函数的最小哈希值。这样就为每个文档生成了一个签名向量。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在计算相似性时，哈希值在两个文档的 MinHash 签名的相同位置对齐的概率（对应于这些签名的 Jaccard 距离）提供了它们原始切分集的 Jaccard 相似性的近似值。这样，我们就可以有效地估计文档的相似性，而无需直接比较较大的原始文本；相反，我们可以分析它们紧凑的 MinHash 签名。</p>
<p>MinHash 原理是使用哈希值最小的单词来代表整个文档，通过加入额外的哈希函数来提高准确性。轻微的单词变化很可能会被忽略，因为它们通常不会影响最小哈希值。相比之下，较大的变化往往会改变哈希值，也更容易被检测到。这种方法可以看作是对不同单词哈希值的最小集合。除 MinHash 外，还有其他方法（如 SimHash）可用于生成文档签名，但在此不做讨论。</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">步骤 2：通过 LSH 识别相似文档</h3><p>即使使用紧凑的 MinHash 签名，比较数百万或数十亿文档中的每一对仍然计算昂贵。这就是<strong>位置敏感散列（LSH）</strong>的用武之地。</p>
<p>LSH 的关键理念是使用<strong>有意造成碰撞的</strong>散列函数<strong>--相似的</strong>项目更有可能散列到同一个桶中，而不相似的项目则不会。这与旨在避免碰撞的传统散列正好相反。</p>
<p>对于 MinHash，一种流行的 LSH 策略是<strong>带状散列技术</strong>：</p>
<ol>
<li><p><strong>分带</strong>：将每个 MinHash 签名（长度为<em>N</em> 的向量）分成<em>b</em>个带，每个带有<em>r</em>行<em>（N = b × r</em>）。</p></li>
<li><p><strong>散列带：</strong>使用标准散列函数将每个带（<em>r</em>个值的子向量）散列到一个桶中。</p></li>
<li><p><strong>候选对：</strong>如果两个文档在<strong>任何</strong>条带中共享一个数据桶，它们就会被标记为潜在匹配。</p></li>
</ol>
<p>通过调整波段数（b）和每个波段的行数®，可以控制召回率、精确度和搜索效率之间的权衡。</p>
<p>关键在于：高度相似的文档在其 MinHash 签名中会有很多匹配的哈希值。当这些签名被分割成多个条带时，即使一个条带中的所有值都匹配，也足以将两个文档放入同一个邮筒中。文档的相似度越高，至少在一个频段中出现这种情况的概率就越高，这样 LSH 就能在不对所有签名进行穷举比较的情况下有效地找出候选配对。</p>
<p>简而言之，<strong>MinHash + LSH</strong>可以实现可扩展的近似重复数据删除：MinHash 将文档压缩成紧凑的签名，而 LSH 则通过分组可能匹配的内容来有效缩小搜索空间。这就像在人群中发现双胞胎一样：首先，对每个人进行快速特征快照（MinHash），将相似的人分组（LSH），然后仔细检查较小的组，找出真正的重复。</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">在 Milvus 2.6 中集成 MinHash LSH<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>将 MinHash LSH 集成到 Milvus 2.6 是出于现实世界的需要。如前所述，Milvus 的用户--一家领先的 LLM 公司--向我们提出了一项挑战：为 LLM 预训练高效地重复数据删除大量文本数据。</p>
<p>传统的重复数据删除管道通常依赖于与存储和检索系统分离的外部工具，需要在组件之间进行成本高昂的数据传输。这种支离破碎的工作流程增加了操作符，并妨碍了分布式计算资源的充分利用。</p>
<p>认识到 Milvus 在处理高吞吐量向量数据方面的优势，一个自然而然的想法出现了：<strong><em>如果将 MinHash LSH 原生内置到 Milvus 中，使近似重复数据删除成为一流的数据库功能，会怎么样呢？</em></strong></p>
<p>这种方法在 Milvus 中实现了从重复数据删除到语义检索的完整工作流程，在利用其可扩展性和统一 API 的同时简化了 MLOps。我们与合作伙伴一起，针对 Milvus 的云原生架构优化了 MinHash LSH，从而为大规模重复数据删除提供了快速、可扩展的解决方案。</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Milvus 2.6 的核心功能包括</h3><ul>
<li><p><strong>本地 MinHash LSH 索引：</strong>执行 LSH 的标准分带技术，并支持可选的 Jaccard 重新排序，以提高召回率。提供基于内存和基于 mmap 的实现，可灵活应对不同的工作负载。</p></li>
<li><p><strong>无缝 API 集成：</strong>用户可以使用 Milvus 的标准 SDK 和声明式 API 定义 MinHash 向量字段、构建<code translate="no">MINHASH_LSH</code> 索引、插入签名数据并执行近似相似性搜索。</p></li>
<li><p><strong>分布式和可扩展性：</strong>该功能基于 Milvus 的云原生架构构建，支持针对大型数据集和高通量处理的水平扩展。</p></li>
</ul>
<p>这种集成带来了令人印象深刻的结果。通过在完全托管的 Milvus<a href="https://zilliz.com/cloud">（Zilliz Cloud</a>）上运行 MinHash LSH，我们帮助该用户高效地重复复制了<strong>100 亿个文档</strong>。与他们之前基于 MapReduce 的方法相比，由于 Milvus 优化了索引和查询执行，新解决方案的<strong>处理速度提高了一倍多</strong>，<strong>成本节约了 3-5 倍</strong>。</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">实际操作：使用 Milvus 重复处理 LLM 数据集<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们卷起袖子，使用 Milvus 2.6 中的 MinHash LSH 来大规模执行近似重复数据删除。</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">前提条件生成 MinHash 签名</h3><p>Milvus 会处理<strong>预生成</strong>MinHash 签名的索引和搜索。您需要在预处理过程中使用<code translate="no">datasketch</code> 等工具或自定义实现来生成这些签名。典型步骤如下</p>
<ol>
<li><p>读取原始文档</p></li>
<li><p>对每个文档进行分块（标记化或分块</p></li>
<li><p>应用多个哈希函数生成 MinHash 签名（例如，大小为 128 的 uint64 数组）</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">步骤 1：在 Milvus 中创建 Schema</h3><p>我们需要创建一个 Milvus Collections 来存储 MinHash 签名及其对应的文档 ID。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>第 2 步：创建 MINHASH_LSH 索引和集合</strong></h3><p>这是核心步骤。我们需要指定 JACCARD 作为度量类型，并配置 LSH 相关参数。</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>关于参数调整的说明：MinHash LSH 的有效性在很大程度上取决于参数的选择。例如，在 MinHash 签名生成过程中使用的散列函数数量（即<code translate="no">MINHASH_DIM</code> ）会影响签名的精度和大小。在 LSH 阶段，条带数 (<code translate="no">num_bands</code>) 和每条带的行数共同决定了相似性阈值的灵敏度范围以及召回率和精度之间的平衡。用户需要根据自己的数据集特征和重复数据删除要求进行试验和微调。这通常是一个反复的过程。</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>第 3 步：插入 MinHash 签名</strong></h3><p>假设您有一批文档及其相应的 MinHash 签名。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">第 5 步：搜索近乎重复的内容</h3><p>使用文档的 MinHash 签名搜索 Collections 中的相似文档。</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">第 6 步：后处理和聚类</h3><p>返回的结果是<strong>候选近似重复</strong>文档。要形成完整的重复数据删除组，可以在候选对上应用<strong>联合查找</strong>等聚类技术。每个结果组代表一组重复文档；保留一个有代表性的文档，其余的归档或删除。</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>结论</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 中的 MinHash LSH 是人工智能数据处理的一次飞跃。它最初是用于重复数据删除的 LLM 解决方案，现在则为更广泛的使用案例打开了大门--网络内容清理、目录管理、剽窃检测等。</p>
<p>如果您有类似的使用案例，请在<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>上联系我们，报名参加<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">办公时间会议</a>。</p>
