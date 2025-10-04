---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: 从 Word2Vec 到 LLM2Vec：如何为 RAG 选择合适的嵌入模型
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: 本博客将向您介绍如何在实践中评估 Embeddings，以便您选择最适合自己的 RAG 系统。
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>大型语言模型功能强大，但也有一个众所周知的弱点：幻觉。<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">检索增强生成（RAG）</a>是解决这一问题的最有效方法之一。RAG 不完全依赖于模型的记忆，而是从外部来源检索相关知识并将其纳入提示，确保答案以真实数据为基础。</p>
<p>RAG 系统通常由三个主要部分组成：模型本身、用于存储和搜索信息的<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>（如<a href="https://milvus.io/">Milvus）</a>以及嵌入模型。嵌入模型是将人类语言转换为机器可读向量的工具。可以把它看作是自然语言和数据库之间的翻译器。翻译质量决定了检索上下文的相关性。做对了，用户就能看到准确、有用的答案。如果做错了，即使是最好的基础架构也会产生噪音、错误和计算浪费。</p>
<p>这就是了解 Embeddings 模型如此重要的原因。有许多模型可供选择，从 Word2Vec 等早期方法到 OpenAI 文本嵌入系列等基于 LLM 的现代模型。每种方法都有自己的优缺点。本指南将为您拨开迷雾，告诉您如何在实践中评估嵌入，从而为您的 RAG 系统选择最合适的嵌入。</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">嵌入式是什么，为什么重要？<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>在最简单的层面上，嵌入将人类语言转化为机器可以理解的数字。每个单词、句子或文档都被映射到一个高维向量空间中，向量之间的距离反映了它们之间的关系。具有相似含义的文本往往会聚集在一起，而不相关的内容往往会相距甚远。这就是语义搜索成为可能的原因--寻找意义，而不仅仅是匹配关键词。</p>
<p>嵌入模型的工作方式不尽相同。它们一般分为三类，每一类都有各自的优势和利弊：</p>
<ul>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>稀疏向量</strong></a>（如 BM25）侧重于关键词频率和文档长度。它们非常适合明确匹配，但对同义词和上下文视而不见--"AI "和 "artificial intelligence "看起来毫无关联。</p></li>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>高密度向量</strong></a>（如 BERT 生成的<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>向量</strong></a>）可以捕捉到更深层次的语义。即使没有共享关键词，它们也能看出 "苹果发布新手机 "与 "iPhone 产品发布 "之间的关联。缺点是计算成本较高，可解释性较差。</p></li>
<li><p><strong>混合模型</strong>（如 BGE-M3）将两者结合起来。它们可以同时生成稀疏、密集或多向量表示--既能保持关键词搜索的精确性，又能捕捉语义的细微差别。</p></li>
</ul>
<p>在实践中，如何选择取决于您的使用情况：稀疏向量代表速度和透明度，密集向量代表更丰富的含义，而混合向量则代表两全其美。</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">评估 Embeddings 模型的八个关键因素<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>#1 上下文窗口</strong></h3><p><a href="https://zilliz.com/glossary/context-window"><strong>上下文窗口</strong></a>决定了模型一次可以处理的文本数量。由于一个标记约等于 0.75 个单词，因此这个数字直接限制了模型在创建嵌入时能 "看到 "多长的段落。窗口大，模型就能捕捉到较长文档的整体含义；窗口小，就不得不将文本切成小块，有可能丢失有意义的上下文。</p>
<p>例如，OpenAI 的<a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>文本嵌入-ada-002</em></a>支持多达 8,192 个标记，足以涵盖整篇研究论文，包括摘要、方法和结论。相比之下，只有 512 个标记窗口的模型（如<em>m3e-base</em>）需要频繁截断，这会导致关键细节丢失。</p>
<p>启示：如果您的使用案例涉及长篇文档，如法律文件或学术论文，请选择具有 8K+ 标记窗口的模型。对于较短的文本，如客户支持聊天，2K 标记窗口可能就足够了。</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header"><strong>#2</strong>标记化单元</h3><p>在生成 Embeddings 之前，必须将文本分解成称为<strong>标记的</strong>小块。如何进行标记化会影响模型处理罕见词、专业术语和专业领域的能力。</p>
<ul>
<li><p><strong>子词标记化（BPE）：</strong>将单词分割成更小的部分（例如，"unhappiness" → "un" + "happiness"）。这是现代 LLMs（如 GPT 和 LLaMA）的默认设置，它能很好地处理词汇量不足的单词。</p></li>
<li><p><strong>WordPiece：</strong>BERT 使用的 BPE 的改进版，旨在更好地平衡词汇覆盖率和效率。</p></li>
<li><p><strong>词级标记化：</strong>只按整词分割。这种方法很简单，但在处理罕见或复杂的术语时很吃力，因此不适合技术领域。</p></li>
</ul>
<p>对于医学或法律等专业领域，基于子词的模型通常是最佳选择--它们可以正确处理<em>心肌梗塞</em>或<em>代位权</em>等术语。一些现代模型，如<strong>NV-Embed</strong>，通过添加潜在关注层等增强功能，进一步提高了标记化捕捉复杂、特定领域词汇的能力。</p>
<h3 id="3-Dimensionality" class="common-anchor-header">#3 维度</h3><p><a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>向量维度</strong></a>指的是嵌入向量的长度，它决定了模型能捕捉多少语义细节。维度越高（例如 1536 或更高），概念之间的区分就越精细，但代价是存储量增加、查询速度变慢以及计算要求提高。低维度（如 768）速度更快、成本更低，但有可能失去微妙的含义。</p>
<p>关键在于平衡。对于大多数通用应用来说，768-1,536 维度是效率和精度的最佳组合。对于精度要求较高的任务，如学术或科学搜索，超过 2000 维可能是值得的。另一方面，资源有限的系统（如边缘部署）可以有效地使用 512 维，前提是检索质量得到验证。在一些轻量级推荐或个性化系统中，甚至更小的维度也可能足够。</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">#4 词汇量大小</h3><p>一个模型的<strong>词汇量大小</strong>指的是其标记器能够识别的唯一标记的数量。这直接影响到模型处理不同语言和特定领域术语的能力。如果一个词或字符不在词汇表中，它就会被标记为<code translate="no">[UNK]</code> ，这可能会导致意义丢失。</p>
<p>不同的使用场景有不同的要求。多语种应用通常需要更大的词汇量--如<a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3</em></a> 的情况，词汇量在 50k 以上。对于特定领域的应用，专业术语的覆盖范围最为重要。例如，法律模型应支持<em>&quot;诉讼时效 &quot;</em>或<em>&quot;善意取得</em>&quot;等术语，而中文模型则必须考虑到成千上万的字符和独特的标点符号。如果没有足够的词汇覆盖范围，Embeddings 的准确性很快就会下降。</p>
<h3 id="-5-Training-Data" class="common-anchor-header"># 5 训练数据</h3><p><strong>训练数据</strong>定义了嵌入模型 "知道 "什么的界限。在广泛的通用数据上训练出来的模型--比如<em>文本嵌入-ada-002</em>，它混合使用了网页、书籍和维基百科--往往在各个领域都表现出色。但是，当你需要专业领域的精确度时，领域训练的模型往往会胜出。例如，<em>LegalBERT</em>和<em>BioBERT</em>在法律和生物医学文本上的表现就优于普通模型，尽管它们会损失一些泛化能力。</p>
<p>经验法则</p>
<ul>
<li><p><strong>一般场景</strong>→ 使用在广泛数据集上训练的模型，但要确保这些数据集涵盖目标语言。例如，中文应用需要在丰富的中文语料库上训练的模型。</p></li>
<li><p><strong>垂直领域</strong>→ 选择特定领域的模型，以获得最佳准确性。</p></li>
<li><p><strong>两全其美</strong>→ 较新的模型（如<strong>NV-Embed</strong>）使用通用数据和特定领域数据分两个阶段进行训练，在通用化<em>和</em>领域精确度方面都有可喜的进步。</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header"># 6 成本</h3><p>成本不仅仅是 API 的定价，还包括<strong>经济成本</strong>和<strong>计算成本</strong>。托管 API 模型，如 OpenAI 的模型，是基于使用量的：每次调用都要付费，但不用担心基础设施。因此，它们非常适合快速原型开发、试点项目或中小型工作负载。</p>
<p><em>BGE</em>或<em>Sentence-BERT</em> 等开源方案可免费使用，但需要自行管理基础设施，通常是 GPU 或 TPU 集群。它们更适合大规模生产，因为长期的节约和灵活性可以抵消一次性的设置和维护成本。</p>
<p>实用启示<strong>API 模型是快速迭代的理想选择</strong>，而<strong>开源模型</strong>一旦考虑到总拥有成本（TCO），<strong>往往能在大规模生产中胜出</strong>。选择正确的途径取决于您是需要快速上市还是需要长期控制。</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header"># 7 MTEB 分数</h3><p><a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>大规模文本嵌入基准（MTEB）</strong></a>是比较嵌入模型最广泛使用的标准。它评估各种任务的性能，包括语义搜索、分类、聚类和其他任务。得分越高，通常意味着模型在不同类型的任务中具有更强的通用性。</p>
<p>尽管如此，MTEB 并不是灵丹妙药。总体得分较高的模型在特定用例中可能仍然表现不佳。例如，一个主要针对英语进行训练的模型可能在 MTEB 基准测试中表现出色，但在处理专业医学文本或非英语数据时却举步维艰。稳妥的做法是将 MTEB 作为起点，然后在投入使用前用<strong>自己的数据集</strong>进行验证。</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header"># 8 特定领域</h3><p>有些模型是专为特定场景而设计的，它们在一般模型的不足之处大放异彩：</p>
<ul>
<li><p><strong>法律：</strong> <em>LegalBERT</em>可以区分细粒度的法律术语，如<em>辩护权</em>与<em>管辖权</em>。</p></li>
<li><p><strong>生物医学：</strong> <em>BioBERT</em>可准确处理<em>mRNA</em>或<em>靶向治疗</em>等专业术语。</p></li>
<li><p><strong>多语言：</strong> <em>BGE-M3</em>支持 100 多种语言，非常适合需要连接英语、中文和其他语言的全球应用。</p></li>
<li><p><strong>代码检索：</strong> <em>Qwen3-Embeddings</em>在<em>MTEB-Code</em> 上获得了最高分（81.0+），针对编程相关查询进行了优化。</p></li>
</ul>
<p>如果您的用例属于上述领域之一，经过领域优化的模型可以显著提高检索准确性。但对于更广泛的应用，请坚持使用通用模型，除非您的测试表明情况并非如此。</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">评估 Embeddings 的其他视角<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>除了这八个核心因素外，如果您想进行更深入的评估，还有一些其他角度值得考虑：</p>
<ul>
<li><p><strong>多语言对齐</strong>：对于多语言模型来说，仅仅支持多种语言是不够的。真正的考验是向量空间是否对齐。换句话说，语义相同的单词--比如英语中的 "cat "和西班牙语中的 "gato"--在向量空间中的映射是否接近？强对齐可确保跨语言检索的一致性。</p></li>
<li><p><strong>对抗测试</strong>：一个好的 Embeddings 模型应能在输入微小变化的情况下保持稳定。通过输入几乎完全相同的句子（例如，"猫坐在垫子上 "与 "猫坐在垫子上"），可以测试得到的向量是合理移动还是剧烈波动。大幅波动通常表明稳健性较弱。</p></li>
<li><p><strong>局部语义一致性</strong>指的是测试语义相似的单词是否紧密地聚集在局部邻域的现象。例如，给定 "银行 "这样一个词，模型应该将相关词（如 "河岸 "和 "金融机构"）适当分组，而将不相关的词保持一定距离。衡量 "侵入性 "或不相关词语进入这些邻域的频率有助于比较模型质量。</p></li>
</ul>
<p>日常工作并不总是需要这些视角，但在多语言、高精度或对抗性稳定性非常重要的生产系统中，这些视角有助于对嵌入进行压力测试。</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">常见的 Embeddings 模型：简史<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>嵌入模型的故事实际上就是机器如何随着时间的推移更深入地理解语言的故事。每一代模型都突破了前一代模型的极限--从静态的单词表示发展到今天能够捕捉细微语境的大型语言模型（LLM）嵌入。</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec：起点（2013 年）</h3><p><a href="https://zilliz.com/glossary/word2vec">谷歌的 Word2Vec</a>是使嵌入式广泛实用化的第一个突破。它基于语言学中的<em>分布假说</em>--即在相似语境中出现的词语往往具有相同的含义。通过分析海量文本，Word2Vec 将单词映射到一个向量空间中，在这个空间中，相关的词汇靠得很近。例如，"美洲狮 "和 "豹子 "由于有共同的栖息地和狩猎特征而聚集在一起。</p>
<p>Word2Vec 有两种版本：</p>
<ul>
<li><p><strong>CBOW（连续词袋）：</strong>根据上下文预测缺失的单词。</p></li>
<li><p><strong>Skip-Gram：</strong>反过来从目标词预测周围的词。</p></li>
</ul>
<p>这种简单但功能强大的方法允许进行优雅的类比，例如："Word2Vec"：</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>在当时，Word2Vec 具有革命性的意义。但它有两个明显的局限性。首先，它是<strong>静态的</strong>：每个单词只有一个向量，因此 "银行 "无论靠近 "钱 "还是 "河"，意思都是一样的。其次，它只适用于<strong>单词层面</strong>，句子和文件都不在其适用范围内。</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">BERT：变形革命（2018 年）</h3><p>如果说 Word2Vec 为我们提供了第一张意义地图，那么<a href="https://zilliz.com/learn/what-is-bert"><strong>BERT（来自变形器的双向编码器表示法）</strong></a>则为我们重新绘制了更详细的意义地图。BERT 由谷歌于 2018 年发布，通过将 Transformer 架构引入 embeddings，标志着<em>深度语义理解</em>时代的开始。与早期的 LSTM 不同，Transformers 可以同时双向检查序列中的所有单词，从而实现更丰富的语境。</p>
<p>BERT 的神奇之处在于两个巧妙的预训练任务：</p>
<ul>
<li><p><strong>遮蔽语言模型（MLM）：</strong>随机隐藏句子中的单词，迫使模型对其进行预测，教会它从上下文中推断含义。</p></li>
<li><p><strong>下一句预测 (NSP)：</strong>训练模型判断两个句子是否相继，帮助它学习句子之间的关系。</p></li>
</ul>
<p>在引擎盖下，BERT 的输入向量结合了三个元素：标记嵌入（单词本身）、句段嵌入（属于哪个句子）和位置嵌入（在序列中的位置）。这些元素的结合使 BERT 能够捕捉<strong>句子</strong>和<strong>文档</strong>级别的复杂语义关系。这一飞跃使 BERT 成为问题解答和语义搜索等任务的最先进技术。</p>
<p>当然，BERT 并不完美。它的早期版本仅限于<strong>512 个标记符窗口</strong>，这意味着长文档必须被切碎，有时还会失去意义。它的密集向量也缺乏可解释性--你可以看到两个文本匹配，但不一定能解释为什么匹配。后来的变体，如<strong>RoBERTa</strong>，在研究表明 NSP 任务并无多大益处后，放弃了 NSP 任务，但保留了强大的 MLM 训练。</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3：稀疏与密集的融合（2023 年）</h3><p>到 2023 年，该领域已经足够成熟，认识到没有一种单一的嵌入方法可以完成所有任务。<a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a>（BAAI 通用嵌入模型-M3）就是这样一种明确针对检索任务而设计的混合模型。它的关键创新之处在于，它不会只生成一种向量，而是同时生成密集向量、稀疏向量和多向量，将它们的优势结合在一起。</p>
<ul>
<li><p><strong>密集向量</strong>捕捉深层语义，处理同义词和转述（例如，"iPhone 发布"≈"苹果发布新手机"）。</p></li>
<li><p><strong>稀疏向量</strong>分配明确的术语权重。即使关键词没有出现，模型也能推断出相关性--例如，将 "iPhone 新产品 "与 "苹果公司 "和 "智能手机 "联系起来。</p></li>
<li><p><strong>多向量</strong>允许每个标记贡献自己的交互分值，从而进一步完善了密集嵌入，这对细粒度检索很有帮助。</p></li>
</ul>
<p>BGE-M3 的训练管道反映了这种复杂性：</p>
<ol>
<li><p>使用<em>RetroMAE</em>（屏蔽编码器+重构解码器）对海量无标记数据进行<strong>预训练</strong>，以建立一般语义理解。</p></li>
<li><p>在 1 亿个文本对上使用对比学习进行<strong>一般微调</strong>，以提高其检索性能。</p></li>
<li><p>通过指令调整和复杂负采样进行<strong>任务微调</strong>，以实现特定场景优化。</p></li>
</ol>
<p>结果令人印象深刻：BGE-M3 可处理多种粒度（从词级到文档级），提供强大的多语言性能（尤其是中文），在准确性和效率之间的平衡比大多数同类产品更好。在实践中，它代表着在构建嵌入模型方面向前迈出了一大步，这种模型既强大又实用于大规模检索。</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">作为嵌入模型的 LLMs（2023 年至今）</h3><p>多年来，人们普遍认为只用于解码器的大型语言模型（LLMs），如 GPT，并不适合嵌入。它们的因果关注--只关注之前的标记--被认为会限制对语义的深入理解。但最近的研究颠覆了这一假设。通过适当的调整，LLMs 可以生成与专门构建的模型相媲美，有时甚至超越它们的嵌入式模型。两个著名的例子是 LLM2Vec 和 NV-Embed。</p>
<p><strong>LLM2Vec</strong>对仅用于解码器的 LLM 进行了调整，并做出了三项关键改变：</p>
<ul>
<li><p><strong>双向注意转换</strong>：替换因果掩码，使每个标记都能注意到整个序列。</p></li>
<li><p><strong>屏蔽下一个标记预测 (MNTP)：</strong>鼓励双向理解的新训练目标。</p></li>
<li><p><strong>无监督对比学习：</strong>受 SimCSE 启发，在向量空间中将语义相似的句子拉近。</p></li>
</ul>
<p>同时，<strong>NV-Embed</strong> 采用了一种更精简的方法：</p>
<ul>
<li><p><strong>潜在关注层：</strong>添加可训练的 "潜在阵列"，以改进序列池。</p></li>
<li><p><strong>直接双向训练：</strong>只需移除因果掩码，并通过对比学习进行微调。</p></li>
<li><p><strong>均值池优化：</strong>使用各标记的加权平均值来避免 "最后标记偏差"。</p></li>
</ul>
<p>结果是，基于 LLM 的现代嵌入将<strong>深度语义理解</strong>与<strong>可扩展性</strong>结合起来。它们可以处理<strong>超长的上下文窗口（8K-32K 标记词）</strong>，因此特别适合研究、法律或企业搜索等文档繁重的任务。而且，由于它们重复使用相同的 LLM 骨干，因此即使在更受限制的环境中，它们有时也能提供高质量的 Embeddings。</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">结论：将理论转化为实践<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>在选择 Embeddings 模型时，理论只能帮你到这里。真正的考验在于它在<em>你的</em>系统中与<em>你的</em>数据配合使用时的表现如何。几个实际步骤就能让纸面上看起来不错的模型与在生产中实际运行的模型截然不同：</p>
<ul>
<li><p><strong>使用 MTEB 子集进行筛选。</strong>使用基准，尤其是检索任务，建立候选者的初步名单。</p></li>
<li><p><strong>使用真实业务数据进行测试。</strong>从自己的文档中创建评估集，在实际条件下测量召回率、精确度和延迟。</p></li>
<li><p><strong>检查数据库兼容性。</strong>稀疏向量需要反向索引支持，而高维密集向量则需要更多存储和计算。确保你的向量数据库能满足你的选择。</p></li>
<li><p><strong>巧妙处理长文档。</strong>利用滑动窗口等分割策略来提高效率，并将其与大型上下文窗口模型搭配使用，以保留意义。</p></li>
</ul>
<p>从 Word2Vec 的简单静态向量到具有 32K 上下文的 LLM 驱动型 Embeddings，我们看到机器在理解语言方面取得了巨大进步。但是，每个开发人员最终都会学到这样的教训：<em>得分最高的</em>模型并不总是<em>最</em>适合您的用例的模型。</p>
<p>说到底，用户并不关心 MTEB 排行榜或基准图表，他们只想快速找到正确的信息。选择兼顾准确性、成本和与系统兼容性的模型，您就能打造出不仅在理论上令人印象深刻，而且在现实世界中真正有效的产品。</p>
