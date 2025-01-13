---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: 使用 Milvus 搭配 PaddlePaddle 加速推荐系统中候选对象的生成
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: 推荐系统的最低工作流程
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>如果你有开发推荐系统的经验，你很可能至少遇到过以下情况之一：</p>
<ul>
<li>由于数据集数量巨大，系统返回结果的速度极慢。</li>
<li>无法实时处理新插入的数据以进行搜索或查询。</li>
<li>推荐系统的部署令人望而生畏。</li>
</ul>
<p>本文旨在通过介绍一个产品推荐系统项目，使用开源向量数据库 Milvus 搭配深度学习平台 PaddlePaddle，解决上述问题，并为大家提供一些启示。</p>
<p>本文首先简要介绍了推荐系统的基本工作流程。然后介绍该项目的主要组件和实施细节。</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">推荐系统的基本工作流程<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入探讨项目本身之前，让我们先来看看推荐系统的基本工作流程。推荐系统可以根据用户独特的兴趣和需求返回个性化的结果。要实现这种个性化推荐，系统需要经历候选生成和排序两个阶段。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>第一阶段是候选生成，返回最相关或最相似的数据，如符合用户配置文件的产品或视频。在生成候选数据的过程中，系统会将用户特征与数据库中存储的数据进行比较，并检索出相似的数据。然后在排序过程中，系统对检索到的数据进行评分和重新排序。最后，列表顶部的结果会显示给用户。</p>
<p>以我们的产品推荐系统为例，它首先将用户资料与库存产品的特征进行比较，筛选出符合用户需求的产品列表。然后，系统根据产品与用户资料的相似度对产品进行评分、排序，最后将前 10 种产品返回给用户。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">系统架构<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>本项目中的产品推荐系统使用了三个组件：MIND、PaddleRec 和 Milvus。</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a> 是 &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall &quot;的缩写，是阿里巴巴集团开发的一种算法。在 MIND 提出之前，大多数盛行的人工智能推荐模型都使用单一向量来表示用户的各种兴趣。然而，单一向量远远不足以代表用户的确切兴趣。因此，MIND 算法被提出来将用户的多种兴趣转化为多个向量。</p>
<p>具体来说，MIND 算法在候选信息生成阶段采用动态路由的<a href="https://arxiv.org/pdf/2005.09347">多兴趣网络</a>来处理一个用户的多个兴趣。多兴趣网络是建立在胶囊路由机制上的一层多兴趣提取器。它可用于将用户的过往行为与其多种兴趣结合起来，从而提供准确的用户画像。</p>
<p>下图展示了 MIND 的网络结构。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>为了表现用户的特质，MIND 将用户行为和用户兴趣作为输入，然后送入嵌入层生成用户向量，包括用户兴趣向量和用户行为向量。然后将用户行为向量输入多兴趣提取层，生成用户兴趣胶囊。将用户兴趣胶囊与用户行为嵌入连接起来，并使用多个 ReLU 层进行转换后，MIND 输出多个用户表示向量。本项目规定 MIND 最终将输出四个用户表征向量。</p>
<p>另一方面，产品特质经过 Embeddings 层，被转换成稀疏的项目向量。然后，每个项目向量再经过池化层，成为密集向量。</p>
<p>当所有数据都转换成向量后，就会引入一个额外的标签感知注意力层来指导训练过程。</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a>是一个用于推荐的大规模搜索模型库。它是百度<a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>生态系统的一部分。PaddleRec 旨在为开发人员提供一个集成的解决方案，使他们能以简单、快速的方式构建一个推荐系统。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>正如开篇所述，开发推荐系统的工程师往往不得不面对系统可用性差、部署复杂等难题。然而，PaddleRec 可以在以下方面为开发人员提供帮助：</p>
<ul>
<li><p>易用性：PaddleRec 是一个开源库，它封装了业界各种流行的模型，包括候选者生成模型、排名模型、重排序模型、多任务模型等。利用 PaddleRec，您可以即时测试模型的有效性，并通过迭代提高其效率。PaddleRec 为你提供了一种为分布式系统训练模型的简便方法，而且性能卓越。它针对稀疏向量的大规模数据处理进行了优化。您可以轻松地横向扩展 PaddleRec，并加快其计算速度。因此，你可以使用 PaddleRec 在 Kubernetes 上快速构建训练环境。</p></li>
<li><p>支持部署：PaddleRec 为其模型提供在线部署解决方案。模型在培训后可立即投入使用，具有灵活性和高可用性的特点。</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a>是一款以云原生架构为特色的向量数据库。它在<a href="https://github.com/milvus-io">GitHub</a>上开源，可用于存储、索引和管理由深度神经网络和其他机器学习（ML）模型生成的海量嵌入向量。Milvus 封装了多个一流的近似近邻（ANN）搜索库，包括 Faiss、NMSLIB 和 Annoy。您还可以根据需要扩展 Milvus。Milvus 服务具有高可用性，支持统一的批处理和流处理。Milvus 致力于简化非结构化数据的管理流程，并在不同的部署环境中提供一致的用户体验。它具有以下特点：</p>
<ul>
<li><p>在海量数据集上进行向量搜索时具有高性能。</p></li>
<li><p>以开发者为先的社区，提供多语言支持和工具链。</p></li>
<li><p>云可扩展性和高可靠性，即使在中断情况下也是如此。</p></li>
<li><p>通过将标量过滤与向量相似性搜索配对实现混合搜索。</p></li>
</ul>
<p>在本项目中，Milvus 被用于向量相似性搜索和向量管理，因为它可以在保持系统稳定性的同时解决数据频繁更新的问题。</p>
<h2 id="System-implementation" class="common-anchor-header">系统实施<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>要在本项目中建立产品推荐系统，需要经过以下步骤：</p>
<ol>
<li>数据处理</li>
<li>模型训练</li>
<li>模型测试</li>
<li>生成候选产品项目<ol>
<li>数据存储：通过训练好的模型获得项目向量，并存储在 Milvus 中。</li>
<li>数据搜索：将 MIND 生成的四个用户向量输入 Milvus，进行向量相似性搜索。</li>
<li>数据排序：四个向量中的每个向量都有自己的<code translate="no">top_k</code> 相似物品向量，对四组<code translate="no">top_k</code> 向量进行排序，返回<code translate="no">top_k</code> 最相似向量的最终列表。</li>
</ol></li>
</ol>
<p>本项目的源代码托管在<a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">百度 AI Studio</a>平台上。下面将详细介绍本项目的源代码。</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">步骤 1.数据处理</h3><p>原始数据集来自<a href="https://github.com/THUDM/ComiRec">ComiRec</a> 提供的亚马逊图书数据集。不过，本项目使用的是从 PaddleRec 下载并由 PaddleRec 处理的数据。更多信息请参阅 PaddleRec 项目中的<a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">AmazonBook 数据集</a>。</p>
<p>用于训练的数据集预计将以下列格式出现，每列代表：</p>
<ul>
<li><code translate="no">Uid</code>:用户 ID。</li>
<li><code translate="no">item_id</code>:用户点击的产品项目 ID。</li>
<li><code translate="no">Time</code>:时间戳或点击顺序。</li>
</ul>
<p>测试数据集的格式如下，每一列代表：</p>
<ul>
<li><p><code translate="no">Uid</code>:用户 ID。</p></li>
<li><p><code translate="no">hist_item</code>:历史用户点击行为中产品项目的 ID。如果有多个<code translate="no">hist_item</code> ，则根据时间戳排序。</p></li>
<li><p><code translate="no">eval_item</code>:用户点击产品的实际顺序。</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">第 2 步：模型训练模型训练</h3><p>模型训练使用上一步处理过的数据，并采用基于 PaddleRec 建立的候选生成模型 MIND。</p>
<h4 id="1-Model-input" class="common-anchor-header">1.<strong>模型</strong> <strong>输入</strong></h4><p>在<code translate="no">dygraph_model.py</code> 中，运行以下代码来处理数据并将其转化为模型输入。该过程会根据时间戳对原始数据中同一用户点击的项目进行排序，并将它们组合成一个序列。然后，从序列中随机选取一个<code translate="no">item``_``id</code> 作为<code translate="no">target_item</code> ，并提取<code translate="no">target_item</code> 之前的 10 个条目作为<code translate="no">hist_item</code> 作为模型输入。如果序列不够长，可以设为 0。<code translate="no">seq_len</code> 应该是<code translate="no">hist_item</code> 序列的实际长度。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>读取原始数据集的代码请参考脚本<code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> 。</p>
<h4 id="2-Model-networking" class="common-anchor-header">2.<strong>模型联网</strong></h4><p>以下代码摘自<code translate="no">net.py</code> 。<code translate="no">class Mind_Capsual_Layer</code> 定义了建立在兴趣胶囊路由机制上的多兴趣提取层。函数<code translate="no">label_aware_attention()</code> 实现了 MIND 算法中的标签感知注意力技术。<code translate="no">class MindLayer</code> 中的函数<code translate="no">forward()</code> 对用户特征进行模型化，并生成相应的权重向量。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>MIND 的具体网络结构请参考脚本<code translate="no">/home/aistudio/recommend/model/mind/net.py</code> 。</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3.<strong>模型优化</strong></h4><p>本项目使用<a href="https://arxiv.org/pdf/1412.6980">Adam 算法</a>作为模型优化器。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>此外，PaddleRec 会在<code translate="no">config.yaml</code> 中写入超参数，因此只需修改该文件，就能清楚地看到两个模型的效果对比，从而提高模型效率。在训练模型时，模型效果不佳可能是由于模型欠拟合或过拟合造成的。因此可以通过修改训练轮数来改善。在本项目中，只需修改<code translate="no">config.yaml</code> 中的参数 epochs，就能找到完美的训练轮数。此外，您还可以更改模型优化器、<code translate="no">optimizer.class</code> 或<code translate="no">learning_rate</code> 进行调试。下面显示了<code translate="no">config.yaml</code> 中的部分参数。</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>具体实现请参考脚本<code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> 。</p>
<h4 id="4-Model-training" class="common-anchor-header">4.<strong>模型训练</strong></h4><p>运行以下命令开始模型训练。</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>模型训练项目请参考<code translate="no">/home/aistudio/recommend/model/trainer.py</code> 。</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">步骤 3.模型测试</h3><p>此步骤使用测试数据集来验证性能，如训练模型的召回率。</p>
<p>在模型测试过程中，所有项目向量都会从模型中加载，然后导入开源向量数据库 Milvus。通过脚本<code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code> 读取测试数据集。加载上一步中的模型，并将测试数据集输入模型，得到用户的四个兴趣向量。在 Milvus 中搜索与四个兴趣向量最相似的 50 个项目向量。您可以将返回的结果推荐给用户。</p>
<p>运行以下命令测试模型。</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>在模型测试过程中，系统会提供多个指标来评估模型的有效性，如 Recall@50、NDCG@50 和 HitRate@50。本文只介绍修改一个参数。不过，在您自己的应用场景中，您需要训练更多的 epoch 才能获得更好的模型效果。  您还可以通过使用不同的优化器、设置不同的学习率以及增加测试轮数来提高模型效果。建议保存多个不同效果的模型，然后选择性能最好、最适合自己应用的模型。</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">步骤 4.生成候选产品项目</h3><p>为了构建产品候选项生成服务，本项目使用了前面步骤中训练好的模型，并与 Milvus 配对。在候选项生成过程中，使用 FASTAPI 提供接口。服务启动后，您可以通过<code translate="no">curl</code> 直接在终端运行命令。</p>
<p>运行以下命令生成初步候选。</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>该服务提供四种类型的接口：</p>
<ul>
<li><strong>插入</strong>：运行以下命令从模型中读取项向量并插入到 Milvus 中的 Collections 中。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>生成初步候选</strong>产品：输入用户点击产品的顺序，找出用户可能点击的下一个产品。您也可以一次为多个用户分批生成产品项目候选。以下命令中的<code translate="no">hist_item</code> 是一个二维向量，每一行代表用户过去点击过的产品序列。您可以定义序列的长度。返回的结果也是一组二维向量，每一行代表返回的用户的<code translate="no">item id</code>s。</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>查询</strong> <strong>产品项目</strong><strong>总数</strong>运行以下命令可返回存储在 Milvus 数据库中的商品向量总数。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>删除</strong>：运行以下命令删除存储在 Milvus 数据库中的所有数据。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>如果在本地服务器上运行候选产品生成服务，也可以访问<code translate="no">127.0.0.1:8000/docs</code> 上的上述界面。你可以点击这四个界面并输入参数值来进行操作。然后点击 "Try it out（试试看）"，即可得到推荐结果。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">小结<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>本文主要关注建立推荐系统的第一阶段候选生成。它还提供了通过将 Milvus 与 MIND 算法和 PaddleRec 结合来加速这一过程的解决方案，因此已经解决了开篇提出的问题。</p>
<p>由于数据集数量巨大，系统返回结果的速度非常慢，怎么办？开源向量数据库 Milvus 专为在包含数百万、数十亿甚至数万亿向量的密集向量数据集上进行极快的相似性搜索而设计。</p>
<p>如果无法实时处理新插入的数据进行搜索或查询怎么办？您可以使用 Milvus，因为它支持统一的批处理和流处理，能让您实时搜索和查询新插入的数据。同时，MIND 模型能够实时转换新的用户行为，并将用户向量即时插入 Milvus。</p>
<p>如果复杂的部署太吓人怎么办？隶属于 PaddlePaddle 生态系统的强大库 PaddleRec 可以为您提供集成解决方案，让您轻松快速地部署推荐系统或其他应用程序。</p>
<h2 id="About-the-author" class="common-anchor-header">关于作者<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>李云梅，Zilliz 数据工程师，毕业于华中科技大学计算机科学专业。加入Zilliz后，她一直致力于为开源项目Milvus探索解决方案，并帮助用户将Milvus应用到实际场景中。她的主要研究方向是 NLP 和推荐系统，并希望在这两个领域进一步加深研究。她喜欢独处和阅读。</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">寻找更多资源？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>更多建立推荐系统的用户案例：<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">与 Milvus 一起利用唯品会构建个性化商品推荐系统</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">用 Milvus 构建衣橱和服装规划应用程序</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">在搜狐新闻应用程序中构建智能新闻推荐系统</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">基于项目协作过滤的音乐推荐系统</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">与 Milvus 一起制作：小米手机浏览器中的人工智能新闻推荐系统</a></li>
</ul></li>
<li>Milvus 与其他社区合作的更多项目：<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">使用 ONNX 和 Milvus 结合人工智能模型进行图像搜索</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">利用 Milvus、PinSage、DGL 和 Movielens 数据集构建基于图的推荐系统</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">基于 JuiceFS 构建 Milvus 集群</a></li>
</ul></li>
<li>参与我们的开源社区：<ul>
<li>在<a href="https://bit.ly/307b7jC">GitHub</a>上查找 Milvus 或为 Milvus 做出贡献</li>
<li>通过<a href="https://bit.ly/3qiyTEk">论坛</a>与社区互动</li>
<li>在<a href="https://bit.ly/3ob7kd8">Twitter</a>上与我们联系</li>
</ul></li>
</ul>
