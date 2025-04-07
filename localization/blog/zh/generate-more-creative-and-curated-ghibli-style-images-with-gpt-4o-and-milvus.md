---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: 利用 GPT-4o 和 Milvus 生成更具创意和策划的吉卜力风格图像
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: 使用 Milvus 将您的私人数据与 GPT-4o 连接起来，以获得更多经过策划的图像输出结果
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">有了 GPT-4o，每个人一夜之间都成了艺术家<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>不管你信不信，你刚才看到的图片是人工智能生成的，特别是由新发布的 GPT-4o 生成的！</em></p>
<p>当 OpenAI 于 3 月 26 日推出 GPT-4o 的原生图片生成功能时，没有人能够预料到随后会发生一场创意海啸。一夜之间，互联网上出现了大量人工智能生成的吉卜力风格肖像--名人、政客、宠物，甚至用户自己，只需几个简单的提示，就能变成迷人的吉卜力工作室人物。由于需求量太大，萨姆-奥特曼本人不得不 "恳求 "用户放慢速度，并在推特上说 OpenAI 的 "GPU 正在融化"。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-4o 生成的图像示例（图片来源：X@Jason Reid）</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">为什么 GPT-4o 能改变一切<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>对于创意产业来说，这代表着一种模式的转变。过去需要整个设计团队花费一整天时间完成的任务，现在只需几分钟就能完成。GPT-4o 与以往图像生成器的不同之处在于<strong>其出色的视觉一致性和直观的界面</strong>。它支持多轮对话，让你可以通过添加元素、调整比例、改变风格，甚至将 2D 转换为 3D 来完善图像--实际上就是把专业设计师装进了你的口袋。</p>
<p>GPT-4o 性能卓越背后的秘密是什么？它的自回归架构。扩散模型（如稳定扩散模型）在重建图像之前会将图像降解为噪声，而 GPT-4o 则不同，它是按顺序生成图像的，每次生成一个标记，并在整个过程中保持对上下文的感知。这一根本的架构差异解释了为什么 GPT-4o 能通过更直接、更自然的提示产生更连贯的结果。</p>
<p>但对于开发人员来说，有趣的地方就在这里：<strong>越来越多的迹象表明了一个重要趋势--人工智能模型本身正在成为产品。简而言之，大多数产品如果只是简单地将大型人工智能模型包裹在公共领域数据周围，就有可能被抛在后面。</strong></p>
<p>这些进步的真正力量来自于将通用的大型模型与<strong>私有的特定领域数据</strong>相结合。这种结合很可能是大多数公司在大型语言模型时代的最佳生存策略。随着基础模型的不断发展，持久的竞争优势将属于那些能够将其专有数据集与这些强大的人工智能系统有效整合的企业。</p>
<p>让我们来探讨如何使用开源高性能向量数据库 Milvus 将您的私有数据与 GPT-4o 连接起来。</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">使用 Milvus 将您的私有数据与 GPT-4o 连接起来，以获得更多经过策划的图像输出结果<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库是连接私有数据与人工智能模型的关键技术。它们的工作原理是将您的内容--无论是图像、文本还是音频--转换为数学表示（向量），从而捕捉其含义和特征。这样就可以根据相似性而不仅仅是关键词进行语义搜索。</p>
<p>Milvus 作为一个领先的开源向量数据库，特别适合与 GPT-4o 等生成式人工智能工具连接。下面是我如何利用它解决个人挑战的过程。</p>
<h3 id="Background" class="common-anchor-header">背景介绍</h3><p>有一天，我有了一个绝妙的想法--把我的狗可乐的所有恶作剧都改编成连环画。但是有一个问题：我怎样才能从数以万计的工作、旅行和美食探险照片中筛选出可乐的调皮时刻呢？</p>
<p>答案是什么？把我所有的照片导入 Milvus，然后进行图像搜索。</p>
<p>让我们一步一步来实现它。</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">依赖关系和环境</h4><p>首先，你需要用正确的软件包准备好你的环境：</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">准备数据</h4><p>在本指南中，我将使用我的照片库作为数据集，其中有大约 30,000 张照片。如果你手头没有任何数据集，可以从 Milvus 下载样本数据集并解压缩：</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">定义特征提取器</h4><p>我们将使用<code translate="no">timm</code> 库中的 ResNet-50 模式从图片中提取 Embeddings 向量。该模型已在数百万张图片上进行过训练，可以提取出代表视觉内容的有意义的特征。</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">创建 Milvus Collections</h4><p>接下来，我们将创建一个 Milvus Collections 来存储我们的图像嵌入。可以把它想象成一个专门用于向量相似性搜索的数据库：</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>MilvusClient 参数说明：</strong></p>
<ul>
<li><p><strong>本地设置：</strong>使用本地文件（如<code translate="no">./milvus.db</code> ）是最简单的入门方式--Milvus Lite 会处理你的所有数据。</p></li>
<li><p><strong>扩展：</strong>对于大型数据集，可使用 Docker 或 Kubernetes 设置一个健壮的 Milvus 服务器，并使用其 URI（如<code translate="no">http://localhost:19530</code> ）。</p></li>
<li><p><strong>云选项：</strong>如果你使用 Zilliz Cloud（Milvus 的完全托管服务），请调整 URI 和令牌，使其与公共端点和 API 密钥相匹配。</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">在 Milvus 中插入图像 Embeddings</h4><p>现在是分析每张图片并存储其向量表示的过程。根据数据集的大小，这一步可能需要一些时间，但这是一个一次性的过程：</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">进行图像搜索</h4><p>数据库建立后，我们就可以搜索类似的图片了。这就是神奇的地方--我们可以利用向量相似性找到视觉上相似的照片：</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>返回的图片如下所示：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">将向量搜索与 GPT-4o 结合起来：用 Milvus 返回的图片生成吉卜力风格的图片</h3><p>现在到了激动人心的部分：使用我们的图片搜索结果作为 GPT-4o 的输入，生成创意内容。在我的案例中，我想根据我拍摄的照片制作以我的狗可乐为主角的连环画。</p>
<p>工作流程简单但功能强大：</p>
<ol>
<li><p>使用向量搜索从我的 Collections 中找到可乐的相关图片</p></li>
<li><p>将这些图片输入 GPT-4o 并给出创意提示</p></li>
<li><p>根据视觉灵感生成独特的漫画</p></li>
</ol>
<p>以下是这种组合产生效果的一些示例：</p>
<p><strong>我使用的提示</strong></p>
<ul>
<li><p><em>"创作一幅四格、全彩、搞笑的连环画，描绘一只边境牧羊犬啃老鼠时被主人发现的尴尬瞬间。"<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"画一幅漫画，让这只狗穿上可爱的衣服。"<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"以这只狗为模型，创作一幅它在霍格沃茨魔法学校上学的漫画。"<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">我的图像生成经验中的几个快速提示：</h3><ol>
<li><p><strong>保持简单</strong>：与那些挑剔的扩散模型不同，GPT-4o 对简单明了的提示效果最好。我发现自己写的提示越来越短，效果也越来越好。</p></li>
<li><p><strong>英语效果最好</strong>：我试过用中文提示一些漫画，但效果并不好。最后，我用英文写了提示语，然后在需要时翻译完成的漫画。</p></li>
<li><p><strong>不利于视频生成</strong>：先别对索拉抱太大希望--人工智能生成的视频在动作流畅性和故事情节连贯性方面还有待提高。</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">下一步是什么？我的观点，欢迎讨论<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>在人工智能生成图像的引领下，快速浏览一下 OpenAI 在过去六个月中发布的主要产品，就会发现一个清晰的模式：无论是应用市场的 GPTs、报告生成的 DeepResearch、对话式图像创建的 GPT-4o 还是视频魔术的 Sora，大型人工智能模型正在从幕后走到聚光灯下。曾经的实验性技术如今正逐渐成熟，成为真正可用的产品。</p>
<p>随着 GPT-4o 和类似模型被广泛接受，大多数基于稳定扩散的工作流程和智能 Agents 正走向淘汰。然而，私人数据和人类洞察力的不可替代价值依然强大。例如，虽然人工智能不会完全取代创意机构，但将 Milvus 向量数据库与 GPT 模型整合在一起，机构就能从过去的成功案例中获得灵感，迅速产生新鲜的创意想法。电子商务平台可以根据购物趋势设计个性化服装，学术机构可以即时创建研究论文的视觉效果。</p>
<p>由人工智能模型驱动产品的时代已经到来，而挖掘数据金矿的竞赛才刚刚开始。对于开发者和企业来说，信息是明确的：将你的独特数据与这些强大的模型结合起来，否则就有可能被抛在后面。</p>
