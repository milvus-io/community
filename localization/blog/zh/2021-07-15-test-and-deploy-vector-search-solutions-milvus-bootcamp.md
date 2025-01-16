---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: 利用 Milvus 2.0 Bootcamp 快速测试和部署向量搜索解决方案
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: 利用开源向量数据库 Milvus，构建、测试和定制向量相似性搜索解决方案。
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>利用 Milvus 2.0 Bootcamp 快速测试和部署向量搜索解决方案</custom-h1><p>随着 Milvus 2.0 的发布，团队对 Milvus<a href="https://github.com/milvus-io/bootcamp">引导营</a>进行了改造。经过改进的新版 Bootcamp 为各种用例和部署提供了更新的指南和更易于理解的代码示例。此外，新版本还针对<a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0 进行了更新，Milvus 2.0</a> 是世界上最先进的向量数据库的重构版本。</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">根据 100 万和 1 亿数据集基准对系统进行压力测试</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">基准目录</a>包含 100 万和 1 亿向量基准测试，可显示系统对不同大小数据集的反应。</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">探索和构建流行的向量相似性搜索解决方案</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">解决方案目录</a>包含最常用的向量相似性搜索用例。每个用例都包含一个笔记本解决方案和一个 docker 可部署解决方案。使用案例包括</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">图像相似性搜索</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">视频相似性搜索</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">音频相似性搜索</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">推荐系统</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">分子搜索</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">问题解答系统</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">在任何系统上快速部署完全构建的应用程序</h3><p>快速部署解决方案是 docker 化的解决方案，允许用户在任何系统上部署完全构建的应用程序。这些解决方案是简短演示的理想选择，但与笔记本相比，需要额外的定制和理解工作。</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">使用特定场景笔记本轻松部署预配置应用程序</h3><p>笔记本包含一个部署 Milvus 的简单示例，以解决给定用例中的问题。每个示例都可以从头到尾运行，无需管理文件或配置。每个笔记本还易于遵循和修改，使它们成为其他项目的理想基础文件。</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">图像相似性搜索笔记本示例</h3><p>图像相似性搜索是许多不同技术（包括自动驾驶汽车识别物体）背后的核心理念之一。本示例介绍了如何使用 Milvus 轻松构建计算机视觉程序。</p>
<p>本笔记本围绕三个方面展开：</p>
<ul>
<li>Milvus 服务器</li>
<li>Redis 服务器（用于元数据存储）</li>
<li>预训练的 Resnet-18 模型。</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">第 1 步：下载所需软件包</h4><p>首先下载本项目所需的所有软件包。本笔记本中的表格列出了要使用的软件包。</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">第 2 步：启动服务器</h4><p>安装软件包后，启动服务器并确保两者运行正常。请务必按照正确的说明启动<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a>和<a href="https://hub.docker.com/_/redis">Redis</a>服务器。</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">第 3 步：下载项目数据</h4><p>默认情况下，本笔记本会提取 VOCImage 数据片段作为示例，但只要遵循笔记本顶部的文件结构，任何包含图像的目录都可以使用。</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">第 4 步：连接服务器</h4><p>在本例中，服务器运行在本地主机的默认端口上。</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">第 5 步：创建 Collections</h4><p>启动服务器后，在 Milvus 中创建一个用于存储所有向量的 Collection。在本例中，维度大小设置为 512，即 resnet-18 输出的大小，相似度指标设置为欧氏距离 (L2)。Milvus 支持多种不同的<a href="https://milvus.io/docs/v2.0.x/metric.md">相似度量</a>。</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">第 6 步：为 Collections 建立索引</h4><p>Collections 制作完成后，为其建立索引。本例中使用的是 IVF_SQ8 索引。该索引需要 "nlist "参数，该参数告诉 Milvus 在每个数据文件（段）中建立多少个聚类。不同的<a href="https://milvus.io/docs/v2.0.x/index.md">索引</a>需要不同的参数。</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">第 7 步：设置模型和数据加载器</h4><p>建立 IVF_SQ8 索引后，设置神经网络和数据加载器。本例中使用的预训练 pytorch resnet-18 没有最后一层，该层会压缩向量进行分类，可能会丢失有价值的信息。</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>需要对数据集和数据加载器进行修改，使其能够对图像进行预处理和批处理，同时提供图像的文件路径。这可以通过稍加修改的 torchvision 数据加载器来实现。在预处理方面，由于 resnet-18 模型是在特定尺寸和数值范围内训练的，因此需要对图像进行裁剪和归一化处理。</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">步骤 8：将向量插入 Collections</h4><p>收集设置完成后，就可以处理图像并将其加载到创建的 Collections 中。首先由数据加载器提取图像并通过 resnet-18 模型运行。然后将生成的向量 Embeddings 插入 Milvus，Milvus 会为每个向量返回一个唯一的 ID。然后将向量 ID 和图像文件路径作为键值对插入 Redis 服务器。</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">步骤 9：进行向量相似性搜索</h4><p>将所有数据插入 Milvus 和 Redis 后，就可以执行实际的向量相似性搜索了。在本例中，从 Redis 服务器中随机抽取三张图片进行向量相似性搜索。</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>这些图像首先经过与步骤 7 中发现的相同的预处理，然后通过 resnet-18 模型推送。</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>然后利用得到的向量 Embeddings 进行搜索。首先，设置搜索参数，包括要搜索的 Collections 名称、nprobe（要搜索的集群数量）和 top_k（返回向量的数量）。在本例中，搜索速度应该很快。</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">步骤 10：图像搜索结果</h4><p>查询返回的向量 ID 用于查找相应的图像。然后使用 Matplotlib 显示图像搜索结果。<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">了解如何在不同环境中部署 Milvus</h3><p>新启动训练营的<a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">部署部分</a>包含在不同环境和设置中使用 Milvus 的所有信息。它包括部署 Milvus、将 Kubernetes 与 Milvus 结合使用、负载平衡等。每个环境都有详细的步骤指南，解释如何让 Milvus 在其中工作。</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">不要成为陌生人</h3><ul>
<li>阅读我们的<a href="https://zilliz.com/blog">博客</a>。</li>
<li>在<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 上与我们的开源社区互动。</li>
<li>在<a href="https://github.com/milvus-io/milvus">Github</a> 上使用或贡献世界上最流行的向量数据库 Milvus。</li>
</ul>
