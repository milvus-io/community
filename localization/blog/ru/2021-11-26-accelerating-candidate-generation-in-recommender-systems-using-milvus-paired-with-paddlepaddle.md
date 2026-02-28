---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  Accelerating Candidate Generation in Recommender Systems Using Milvus paired
  with PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: the minimal workflow of a recommender system
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>If you have experience developing a recommender system, you are likely to have fallen victim to at least one of the following:</p>
<ul>
<li>The system is extremely slow when returning results due to the tremendous amount of datasets.</li>
<li>Newly inserted data cannot be processed in real time for search or query.</li>
<li>Deployment of the recommender system is daunting.</li>
</ul>
<p>This article aims to address the issues mentioned above and provide some insights for you by introducing a product recommender system project that uses Milvus, an open-source vector database, paired with PaddlePaddle, a deep learning platform.</p>
<p>This article sets out to briefly describe the minimal workflow of a recommender system. Then it moves on to introduce the main components and the implementation details of this project.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">The basic workflow of a recommender system<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Before going deep into the project itself, let’s first take a look at the basic workflow of a recommender system. A recommender system can return personalized results according to unique user interest and needs. To make such personalized recommendations, the system goes through two stages, candidate generation and ranking.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
    <span>2.png</span>
  </span>
</p>
<p>The first stage is candidate generation, which returns the most relevant or similar data, such as a product or a video that matches the user profile. During candidate generation, the system compares the user trait with the data stored in its database, and retrieves those similar ones. Then during ranking, the system scores and reorders the retrieved data. Finally, those results on the top of the list are shown to users.</p>
<p>In our case of a product recommender system, it first compares the user profile with the characteristics of the products in inventory to filter out a list of products catering to the user’s needs. Then the system scores the products based on their similarity to user profile, ranks them, and finally returns the top 10 products to the user.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
    <span>3.png</span>
  </span>
</p>
<h2 id="System-architecture" class="common-anchor-header">System architecture<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>The product recommender system in this project uses three components: MIND, PaddleRec, and Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a>, short for &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall&quot;, is an algorithm developed by Alibaba Group. Before MIND was proposed, most of the prevalent AI models for recommendation used a single vector to represent a user’s varied interests. However, a single vector is far from sufficient to represent the exact interests of a user. Therefore, MIND algorithm was proposed to turn a user’s multiple interests into several vectors.</p>
<p>Specifically, MIND adopts a <a href="https://arxiv.org/pdf/2005.09347">multi-interest network</a> with dynamic routing for processing multiple interests of one user during the candidate generation stage. The multi-interest network is a layer of multi-interest extractor built on capsule routing mechanism. It can be used to combine a user’s past behaviors with his or her multiple interests, to provide an accurate user profile.</p>
<p>The following diagram illustrates the network structure of MIND.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
    <span>4.png</span>
  </span>
</p>
<p>To represent the trait of users, MIND takes user behaviors and user interests as inputs, and then feeds them into the embedding layer to generate user vectors, including user interest vectors and user behavior vectors. Then user behavior vectors are fed into the multi-interest extractor layer to generate users interest capsules. After concatenating the user interest capsules with user behavior embeddings and using several ReLU layers to transform them, MIND outputs several user representation vectors. This project has defined that MIND will ultimately output four user representation vectors.</p>
<p>On the other hand, product traits go through the embedding layer and are converted into sparse item vectors. Then each item vector goes through a pooling layer to become a dense vector.</p>
<p>When all data are converted into vectors, an extra label-aware attention layer is introduced to guide the training process.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a> is a large-scale search model library for recommendation. It is part of the Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a> ecosystem. PaddleRec aims to provide developers with an integrated solution to build a recommendation system in an easy and rapid way.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
    <span>5.png</span>
  </span>
</p>
<p>As mentioned in the opening paragraph, engineers developing recommender systems often have to face the challenges of poor usability and complicated deployment of the system. However, PaddleRec can help developers in the following aspects:</p>
<ul>
<li><p>Ease of use: PaddleRec is an open-source library that encapsulates various popular models in the industry, including models for candidate generation, ranking, reranking, multitasking, and more. With PaddleRec, you can instantly test the effectiveness of the model and improve its efficiency through iteration. PaddleRec offers you an easy way to train models for distributed systems with excellent performance. It is optimized for large-scale data processing of sparse vectors. You can easily scale PaddleRec horizontally and accelerate its computing speed. Therefore, you can quickly build training environments on Kubernetes using PaddleRec.</p></li>
<li><p>Support for deployment: PaddleRec provides online deployment solutions for its models. The models are immediately ready for use after training, featuring flexibility and high availability.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> is a vector database featuring a cloud-native architecture. It is open sourced on <a href="https://github.com/milvus-io">GitHub</a> and can be used to store, index, and manage massive embedding vectors generated by deep neural networks and other machine learning (ML) models. Milvus encapsulates several first-class approximate nearest neighbor (ANN) search libraries including Faiss, NMSLIB, and Annoy. You can also scale out Milvus according to your need. The Milvus service is highly available and supports unified batch and stream processing. Milvus is committed to simplifying the process of managing unstructured data and providing a consistent user experience in different deployment environments. It has the following features:</p>
<ul>
<li><p>High performance when conducting vector search on massive datasets.</p></li>
<li><p>A developer-first community that offers multi-language support and toolchain.</p></li>
<li><p>Cloud scalability and high reliability even in the event of a disruption.</p></li>
<li><p>Hybrid search achieved by pairing scalar filtering with vector similarity search.</p></li>
</ul>
<p>Milvus is used for vector similarity search and vector management in this project because it can solve the problem of frequent data updates while maintaining system stability.</p>
<h2 id="System-implementation" class="common-anchor-header">System implementation<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>To build the product recommender system in this project, you need to go through the following steps:</p>
<ol>
<li>Data processing</li>
<li>Model training</li>
<li>Model testing</li>
<li>Generating product item candidates
<ol>
<li>Data storage: item vectors are obtained through the trained model and are stored in Milvus.</li>
<li>Data search: four user vectors generated by MIND are fed into Milvus for vector similarity search.</li>
<li>Data ranking: each of the four vectors has its own <code translate="no">top_k</code> similar item vectors, and four sets of <code translate="no">top_k</code> vectors are ranked to return a final list of <code translate="no">top_k</code> most similar vectors.</li>
</ol></li>
</ol>
<p>The source code of this project is hosted on the  <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a> platform. The following section is a detailed explanation of the source code for this project.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">Step 1. Data processing</h3><p>The original dataset comes from the Amazon book dataset provided by <a href="https://github.com/THUDM/ComiRec">ComiRec</a>. However, this project uses the data that is downloaded from and processed by PaddleRec. Refer to the <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">AmazonBook dataset</a> in the PaddleRec project for more information.</p>
<p>The dataset for training is expected to appear in the following format, with each column representing:</p>
<ul>
<li><code translate="no">Uid</code>: User ID.</li>
<li><code translate="no">item_id</code>: ID of the product item that has been clicked by the user.</li>
<li><code translate="no">Time</code>: The timestamp or order of click.</li>
</ul>
<p>The dataset for testing is expected to appear in the following format, with each column representing:</p>
<ul>
<li><p><code translate="no">Uid</code>: User ID.</p></li>
<li><p><code translate="no">hist_item</code>: ID of the product item in historical user click behavior. When there are multiple <code translate="no">hist_item</code>, they are sorted according to the timestamp.</p></li>
<li><p><code translate="no">eval_item</code>: The actual sequence in which the user clicks the products.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">Step 2. Model training</h3><p>Model training uses the processed data in the previous step and adopts the candidate generation model, MIND, built on PaddleRec.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. <strong>Model</strong> <strong>input</strong></h4><p>In <code translate="no">dygraph_model.py</code>, run the following code to process the data and turn them into model input. This process sorts the items clicked by the same user in the original data according to the timestamp, and combines them to form a sequence. Then, randomly select an <code translate="no">item``_``id</code> from the sequence as the <code translate="no">target_item</code>, and extract the 10 items before <code translate="no">target_item</code> as the <code translate="no">hist_item</code> for model input. If the sequence is not long enough, it can be set as 0. <code translate="no">seq_len</code> should be the actual length of the <code translate="no">hist_item</code> sequence.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>Refer to the script <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> for the code of reading the original dataset.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>Model networking</strong></h4><p>The following code is an extract of <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> defines the multi-interest extractor layer built on the interest capsule routing mechanism. The function <code translate="no">label_aware_attention()</code> implements the label-aware attention technique in the MIND algorithm. The <code translate="no">forward()</code> function in the <code translate="no">class MindLayer</code> models the user characteristics and generates corresponding weight vectors.</p>
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
<p>Refer to the script <code translate="no">/home/aistudio/recommend/model/mind/net.py</code> for the specific network structure of MIND.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>Model optimization</strong></h4><p>This project uses <a href="https://arxiv.org/pdf/1412.6980">Adam algorithm</a> as the model optimizer.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>In addition, PaddleRec writes hyperparameters in <code translate="no">config.yaml</code>, so you just need to modify this file to see a clear comparison between the effectiveness of the two models to improve model efficiency. When training the model, the poor model effect can result from model underfitting or overfitting. You can therefore improve it by modifying the number of rounds of training. In this project,  you only need to change the parameter epochs in <code translate="no">config.yaml</code> to find the perfect number of rounds of training. In addition, you can also change the model optimizer, <code translate="no">optimizer.class</code>,or <code translate="no">learning_rate</code> for debugging. The following shows part of the parameters in <code translate="no">config.yaml</code>.</p>
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
<p>Refer to the script <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> for detailed implementation.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>Model training</strong></h4><p>Run the following command to start model training.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Refer to <code translate="no">/home/aistudio/recommend/model/trainer.py</code> for the model training project.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">Step 3. Model testing</h3><p>This step uses test dataset to verify the performance, such as the recall rate of the trained model.</p>
<p>During model testing, all item vectors are loaded from the model, and then imported into Milvus, the open-source vector database. Read the test dataset through the script <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. Load the model in the previous step, and feed the test dataset into the model to obtain four interest vectors of the user. Search for the most similar 50 item vectors to the four interest vectors in Milvus. You can recommend the returned results to users.</p>
<p>Run the following command to test the model.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>During model testing, the system provides several indicators for evaluating model effectiveness, such as Recall@50, NDCG@50, and HitRate@50. This article only introduces modifying one parameter. However, in your own application scenario, you need to train more epochs for better model effect.  You can also improve model effectiveness by using different optimizers, setting different learning rates, and increasing the number of rounds of testing. It is recommended that you save several models with different effects, and then choose the one with the best performance and best fits your application.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">Step 4. Generating product item candidates</h3><p>To build the product candidate generation service, this project uses the trained model in the previous steps, paired with Milvus. During candidate generation, FASTAPI is used to provide the interface. When the service starts, you can directly run commands in the terminal via <code translate="no">curl</code>.</p>
<p>Run the following command to generate preliminary candidates.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>The service provides four types of interfaces:</p>
<ul>
<li><strong>Insert</strong> : Run the following command to read the item vectors from your model and insert them into a collection in Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Generate preliminary candidates</strong>: Input the sequence in which products are clicked by the user, and find out the next product that the user may click. You can also generate product item candidates in batches for several users at one go. <code translate="no">hist_item</code> in the following command is a two-dimensional vector, and each row represents a sequence of the products that the user has clicked in the past. You can define the length of the sequence. The returned results are also sets of two-dimensional vectors, each row representing the returned <code translate="no">item id</code>s for users.</li>
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
<li><strong>Query the total number of</strong> <strong>product items</strong>: Run the following command to return the total number of item vectors stored in the Milvus database.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Delete</strong>: Run the following command to delete all data stored in the Milvus database .</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>If you run the candidate generation service on your local server, you can also access the above interfaces at <code translate="no">127.0.0.1:8000/docs</code>. You can play around by clicking on the four interfaces and entering the value for the parameters. Then click “Try it out” to get the recommendation result.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
    <span>6.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
    <span>7.png</span>
  </span>
</p>
<h2 id="Recap" class="common-anchor-header">Recap<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>This article mainly focuses on the first stage of candidate generation in building a recommender system. It also provides a solution to accelerating this process by combining Milvus with the MIND algorithm and PaddleRec and therefore has addressed the issue proposed in the opening paragraph.</p>
<p>What if the system is extremely slow when returning results due to the tremendous amount of datasets? Milvus, the open-source vector database, is designed for blazing-fast similarity search on dense vector datasets containing millions, billions, or even trillions of vectors.</p>
<p>What if newly inserted data cannot be processed in real time for search or query? You can use Milvus as it supports unified batch and stream processing and enables you to search and query newly inserted data in real time. Also, the MIND model is capable of converting new user behavior in real-time and inserting the user vectors into Milvus instantaneously.</p>
<p>What if the complicated deployment is too intimidating? PaddleRec, a powerful library that belongs to the PaddlePaddle ecosystem, can provide you with an integrated solution to deploy your recommendation system or other applications in an easy and rapid way.</p>
<h2 id="About-the-author" class="common-anchor-header">About the author<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Zilliz Data Engineer, graduated from Huazhong University of Science and Technology with a degree in computer science. Since joining Zilliz, she has been working on exploring solutions for the open source project Milvus and helping users to apply Milvus in real-world scenarios. Her main focus is on NLP and recommendation systems, and she would like to further deepen her focus in these two areas. She likes to spend time alone and read.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Looking for more resources?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>More user cases of building a recommender system:
<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Building a Personalized Product Recommender System with Vipshop with Milvus</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Building a Wardrobe and Outfit Planning App with Milvus</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Building an Intelligent News Recommendation System Inside Sohu News App</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">Item-based Collaborative Filtering for Music Recommender System</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Making with Milvus: AI-Powered News Recommendation Inside Xiaomi’s Mobile Browser</a></li>
</ul></li>
<li>More Milvus projects in collaboration with other communities:
<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Combine AI Models for Image Search Using ONNX and Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Building a Graph-based recommendation system with Milvus, PinSage, DGL, and Movielens Datasets</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">Building a Milvus Cluster Based on JuiceFS</a></li>
</ul></li>
<li>Engage with our open-source community:
<ul>
<li>Find or contribute to Milvus on <a href="https://bit.ly/307b7jC">GitHub</a></li>
<li>Interact with the community via <a href="https://bit.ly/3qiyTEk">Forum</a></li>
<li>Connect with us on <a href="https://bit.ly/3ob7kd8">Twitter</a></li>
</ul></li>
</ul>
