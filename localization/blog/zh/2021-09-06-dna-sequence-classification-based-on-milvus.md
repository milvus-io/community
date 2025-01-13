---
id: dna-sequence-classification-based-on-milvus.md
title: 基于 Milvus 的 DNA 序列分类
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: 使用开源向量数据库 Milvus 来识别 DNA 序列的基因家族。空间更小，但准确度更高。
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>基于 Milvus 的 DNA 序列分类</custom-h1><blockquote>
<p>作者：顾梦佳，Zilliz 数据工程师，毕业于麦吉尔大学，获信息学硕士学位。她的兴趣包括人工智能应用和向量数据库的相似性搜索。作为开源项目 Milvus 的社区成员，她提供并改进了多种解决方案，如推荐系统和 DNA 序列分类模型。她喜欢挑战，从不放弃！</p>
</blockquote>
<custom-h1>简介</custom-h1><p>DNA 序列在学术研究和实际应用中都是一个热门概念，如基因溯源、物种鉴定和疾病诊断。各行各业都在渴求更智能、更高效的研究方法，人工智能尤其在生物和医学领域备受关注。越来越多的科学家和研究人员正在为生物信息学中的机器学习和深度学习做出贡献。为了使实验结果更有说服力，一种常见的方法是增加样本量。与基因组学大数据的合作也为现实中的应用案例带来了更多可能性。然而，传统的序列比对有其局限性，<a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">不适合大数据</a>。为了减少现实中的取舍，向量化是 DNA 序列大数据集的一个不错选择。</p>
<p>开源向量数据库<a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a>对海量数据非常友好。它能够存储核酸序列的向量，并进行高效检索。它还有助于降低生产或研究成本。基于 Milvus 的 DNA 序列分类系统只需几毫秒就能完成基因分类。此外，它比机器学习中其他常见的分类器显示出更高的准确性。</p>
<custom-h1>数据处理</custom-h1><p>编码遗传信息的基因由一小段 DNA 序列组成，其中包括 4 个核苷酸碱基 [A、C、G、T]。人类基因组中约有 3 万个基因，近 30 亿个 DNA 碱基对，每个碱基对有 2 个对应碱基。为了支持不同的用途，DNA 序列可分为不同的类别。为了降低成本，使长 DNA 序列数据更易于使用，<a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">K-mer </a>被引入到数据预处理中。同时，它使 DNA 序列数据更接近于纯文本。此外，向量化数据还能加快数据分析或机器学习的计算速度。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>k-mer 方法常用于 DNA 序列预处理。它从原始序列的每个碱基开始提取长度为 k 的一小段，从而将长度为 s 的长序列转换为长度为 k 的 (s-k+1) 短序列。调整 k 值可以提高模型性能。短序列列表更易于数据读取、特征提取和向量化。</p>
<p><strong>向量化</strong></p>
<p>DNA 序列以文本的形式进行向量化。经过 k-mer 转换的序列会变成短序列列表，看起来就像句子中的单个单词列表。因此，大多数自然语言处理模型也应适用于 DNA 序列数据。类似的方法也可应用于模型训练、特征提取和编码。由于每个模型都有自己的优点和缺点，因此模型的选择取决于数据的特征和研究目的。例如，词袋模型 CountVectorizer 通过直接标记化实现特征提取。它对数据长度没有限制，但返回的结果在相似性比较方面不太明显。</p>
<custom-h1>Milvus 演示</custom-h1><p>Milvus 可以轻松管理非结构化数据，并在平均几毫秒的延迟内从数以万亿计的向量中调出最相似的结果。它的相似性搜索基于近似近邻（ANN）搜索算法。这些亮点使 Milvus 成为管理 DNA 序列向量的最佳选择，从而促进了生物信息学的发展和应用。</p>
<p>下面的演示展示了如何利用 Milvus 建立 DNA 序列分类系统。<a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">实验数据集 </a>包括 3 种生物和 7 个基因家族。所有数据都通过 k-mers 转换为短序列列表。然后，系统利用预先训练好的 CountVectorizer 模型，将序列数据编码成向量。下面的流程图描述了系统结构以及插入和搜索过程。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>在<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">Milvus 启动营中</a>试用这个演示。</p>
<p>在 Milvus 中，系统创建 Collections 并将 DNA 序列的相应向量插入 Collections（或启用分区）。收到查询请求后，Milvus 将返回输入 DNA 序列向量与数据库中最相似结果之间的距离。输入序列的类别和 DNA 序列之间的相似性可通过结果中的向量距离来确定。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>DNA 序列分类</strong>在 Milvus 中搜索最相似的 DNA 序列可以暗示未知样本的基因家族，从而了解其可能的功能。<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> 如果某个序列被归类为 GPCR，那么它很可能对人体功能有影响。 </a>在这个演示中，Milvus 成功地使系统识别了所搜索的人类 DNA 序列的基因家族。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>基因相似性</strong></p>
<p>生物体之间的平均 DNA 序列相似度说明了它们的基因组之间有多接近。该演示分别在人类数据中搜索与黑猩猩和狗最相似的 DNA 序列。然后计算并比较平均内积距离（黑猩猩为 0.97，狗为 0.70），证明黑猩猩与人类共享的相似基因多于狗。有了更复杂的数据和系统设计，Milvus 能够支持更高层次的基因研究。</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>性能</strong></p>
<p>演示用 80% 的人类样本数据（共 3629 个）训练分类模型，并将剩余数据作为测试数据。它比较了使用 Milvus 的 DNA 序列分类模型与使用 Mysql 和 5 种常用机器学习分类器的模型的性能。基于 Milvus 的模型在准确性上优于同类产品。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>进一步探索</custom-h1><p>随着大数据技术的发展，DNA序列的向量化将在基因研究和实践中发挥更加重要的作用。结合生物信息学的专业知识，相关研究可以进一步受益于 DNA 序列向量化的参与。因此，Milvus 可以在实践中呈现更好的效果。根据不同的场景和用户需求，Milvus 驱动的相似性搜索和距离计算显示出巨大的潜力和多种可能性。</p>
<ul>
<li><strong>研究未知序列</strong>：<a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">一些研究人员认为，向量化可以压缩 DNA 序列数据。</a>同时，研究未知 DNA 序列的结构、功能和进化所需的工作量也更少。Milvus 可以存储和检索大量的 DNA 序列向量，而不会失去准确性。</li>
<li><strong>适应设备</strong>：受限于传统的序列比对算法，相似性搜索几乎无法从设备<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">（</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">CPU</a><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">/GPU</a>）的改进中获益。Milvus 既支持普通 CPU 计算，也支持 GPU 加速，通过近似近邻算法解决了这一问题。</li>
<li><strong>检测病毒并追踪来源</strong>：<a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">科学家们比较了基因组序列，发现可能源自蝙蝠的 COVID19 病毒属于 SARS-COV</a>。根据这一结论，研究人员可以扩大样本量，以获得更多证据和模式。</li>
<li><strong>诊断疾病</strong>：在临床上，医生可以比较患者和健康人群的 DNA 序列，找出导致疾病的变异基因。可以通过适当的算法提取特征并对这些数据进行编码。Milvus 能够返回向量之间的距离，这些距离可以与疾病数据相关联。除了辅助疾病诊断，该应用还有助于启发<a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">靶向治疗</a>的研究。</li>
</ul>
<custom-h1>进一步了解 Milvus</custom-h1><p>Milvus 是一款强大的工具，能够为大量人工智能和向量相似性搜索应用提供动力。要了解有关该项目的更多信息，请查看以下资源：</p>
<ul>
<li>阅读我们的<a href="https://milvus.io/blog">博客</a>。</li>
<li>在<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a> 上与我们的开源社区互动。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用或贡献世界上最流行的向量数据库。</li>
<li>使用我们的新<a href="https://github.com/milvus-io/bootcamp">启动训练营</a>快速测试和部署人工智能应用。</li>
</ul>
