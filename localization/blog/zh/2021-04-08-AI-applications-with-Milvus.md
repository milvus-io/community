---
id: AI-applications-with-Milvus.md
title: 如何用 Milvus 制作 4 款受欢迎的人工智能应用程序
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: Milvus 可加速机器学习应用开发和机器学习操作（MLOps）。借助 Milvus，您可以快速开发最小可行产品（MVP），同时将成本控制在较低限度。
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>如何用 Milvus 制作 4 款热门 AI 应用程序</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>博客封面.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus</a>是一个开源向量数据库。它支持对使用人工智能模型从非结构化数据中提取特征向量创建的海量向量数据集进行添加、删除、更新和近实时搜索。Milvus 拥有一套全面直观的 API，并支持多个广泛采用的索引库（如 Faiss、NMSLIB 和 Annoy），可加快机器学习应用程序开发和机器学习操作（MLOps）。借助 Milvus，您可以快速开发出最小可行产品（MVP），同时将成本控制在较低限度。</p>
<p>&quot;使用 Milvus 开发人工智能应用有哪些资源？&quot;这是 Milvus 社区中常见的问题。Milvus背后的<a href="https://zilliz.com/">公司</a>Zilliz开发了许多演示，利用Milvus进行快如闪电的相似性搜索，为智能应用提供动力。Milvus 解决方案的源代码可在<a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a> 上找到。以下互动场景演示了自然语言处理（NLP）、反向图像搜索、音频搜索和计算机视觉。</p>
<p>欢迎试用这些解决方案，以获得特定场景的实践经验！通过以下方式分享您自己的应用场景</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">自然语言处理（聊天机器人）</a></li>
<li><a href="#reverse-image-search-systems">反向图像搜索</a></li>
<li><a href="#audio-search-systems">音频搜索</a></li>
<li><a href="#video-object-detection-computer-vision">视频对象检测（计算机视觉）</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">自然语言处理（聊天机器人）</h3><p>Milvus 可用于构建聊天机器人，利用自然语言处理来模拟现场操作符、回答问题、将用户引导至相关信息，并降低人工成本。为了演示这一应用场景，Zilliz 通过将 Milvus 与为 NLP 预训练而开发的机器学习 (ML) 模型<a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a> 相结合，构建了一个能理解语义语言的人工智能聊天机器人。</p>
<p>源代码：zilliz-bootcamp/intelligent_question_answering_v2</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">如何使用</h4><ol>
<li><p>上传包含问题和答案的数据集。将问题和答案格式化为两列。也可下载<a href="https://zilliz.com/solutions/qa">示例数据集</a>。</p></li>
<li><p>输入问题后，系统会从上传的数据集中检索出类似问题的列表。</p></li>
<li><p>选择与您的问题最相似的问题，揭示答案。</p></li>
</ol>
<p>视频：<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">[演示] Milvus 支持的 QA 系统</a></p>
<h4 id="How-it-works" class="common-anchor-header">工作原理</h4><p>使用 Google 的 BERT 模型将问题转换为特征向量，然后使用 Milvus 管理和查询数据集。</p>
<p><strong>数据处理：</strong></p>
<ol>
<li>使用 BERT 将上传的问题-答案对转换为 768 维特征向量。然后将向量导入 Milvus 并分配单独的 ID。</li>
<li>问题和相应答案的向量 ID 保存在 PostgreSQL 中。</li>
</ol>
<p><strong>搜索相似问题：</strong></p>
<ol>
<li>BERT 用于从用户输入的问题中提取特征向量。</li>
<li>Milvus 会检索与输入问题最相似的问题的向量 ID。</li>
<li>系统会在 PostgreSQL 中查找相应的答案。</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">反向图像搜索系统</h3><p>反向图像搜索正在通过个性化产品推荐和类似的产品查询工具改变电子商务，从而提高销售额。在这一应用场景中，Zilliz 通过将 Milvus 与可提取图像特征的 ML 模型<a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a> 相结合，构建了一个反向图像搜索系统。</p>
<p>源代码：zilliz-bootcamp/image_search</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">如何使用</h4><ol>
<li>上传仅由 .jpg 图像组成的压缩图像数据集（不接受其他图像文件类型）。也可下载<a href="https://zilliz.com/solutions/image-search">样本数据集</a>。</li>
<li>上传一张图片，作为查找相似图片的搜索输入。</li>
</ol>
<p>👉视频：<a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[演示] 由 Milvus 支持的图像搜索</a></p>
<h4 id="How-it-works" class="common-anchor-header">工作原理</h4><p>使用 VGG 模型将图像转换为 512 维特征向量，然后使用 Milvus 管理和查询数据集。</p>
<p><strong>数据处理：</strong></p>
<ol>
<li>使用 VGG 模型将上传的图像数据集转换为特征向量。然后将向量导入 Milvus 并分配单独的 ID。</li>
<li>图像特征向量和相应的图像文件路径存储在 CacheDB 中。</li>
</ol>
<p><strong>搜索相似图像：</strong></p>
<ol>
<li>VGG 用于将用户上传的图像转换成特征向量。</li>
<li>与输入图像最相似的图像向量 ID 会从 Milvus 中获取。</li>
<li>系统会在 CacheDB 中查找相应的图像文件路径。</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">音频搜索系统</h3><p>语音、音乐、音效和其他类型的音频搜索使得快速查询海量音频数据和浮现相似声音成为可能。其应用包括识别相似的声音效果、最大限度地减少知识产权侵权等。为了演示这种应用场景，Zilliz 将 Milvus 与<a href="https://arxiv.org/abs/1912.10211">PANNs（一种</a>为音频模式识别而构建的大规模预训练音频神经网络）相结合，构建了一个高效的音频相似性搜索系统。</p>
<p>源代码：zilliz-bootcamp/audio_search<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">如何使用</h4><ol>
<li>上传仅由 .wav 文件组成的压缩音频数据集（不接受其他音频文件类型）。也可下载<a href="https://zilliz.com/solutions/audio-search">样本数据集</a>。</li>
<li>上传一个 .wav 文件，作为查找相似音频的搜索输入。</li>
</ol>
<p>👉视频：<a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[演示] 由 Milvus 支持的音频搜索</a></p>
<h4 id="How-it-works" class="common-anchor-header">工作原理</h4><p>使用 PANNs（为音频模式识别而构建的大规模预训练音频神经网络）将音频转换为特征向量。然后使用 Milvus 管理和查询数据集。</p>
<p><strong>数据处理：</strong></p>
<ol>
<li>PANNs 将上传数据集中的音频转换为特征向量。然后将向量导入 Milvus 并分配单独的 ID。</li>
<li>音频特征向量 ID 及其对应的 .wav 文件路径存储在 PostgreSQL 中。</li>
</ol>
<p><strong>搜索相似音频</strong></p>
<ol>
<li>PANNs 用于将用户上传的音频文件转换为特征向量。</li>
<li>通过计算内积（IP）距离，从 Milvus 中检索出与上传文件最相似的音频的向量 ID。</li>
<li>系统会在 MySQL 中查找相应的音频文件路径。</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">视频对象检测（计算机视觉）</h3><p>视频对象检测可应用于计算机视觉、图像检索、自动驾驶等领域。为了展示这一应用场景，Zilliz 通过将 Milvus 与<a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>、<a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a> 和<a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a> 等技术和算法相结合，构建了一个视频对象检测系统。</p>
<p>源代码：<a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">如何使用</h4><ol>
<li>上传仅由 .jpg 文件组成的压缩图像数据集（不接受其他图像文件类型）。确保每个图像文件以其描述的对象命名。也可下载<a href="https://zilliz.com/solutions/video-obj-analysis">样本数据集</a>。</li>
<li>上传用于分析的视频。</li>
<li>单击播放按钮查看上传的视频，并实时显示对象检测结果。</li>
</ol>
<p>视频：<a href="https://www.youtube.com/watch?v=m9rosLClByc">[演示] Milvus 支持的视频物体检测系统</a></p>
<h4 id="How-it-works" class="common-anchor-header">工作原理</h4><p>使用 ResNet50 将物体图像转换为 2048 维特征向量。然后使用 Milvus 管理和查询数据集。</p>
<p><strong>数据处理：</strong></p>
<ol>
<li>ResNet50 将物体图像转换为 2048 维特征向量。然后将向量导入 Milvus 并分配单独的 ID。</li>
<li>音频特征向量 ID 及其对应的图像文件路径存储在 MySQL 中。</li>
</ol>
<p><strong>检测视频中的物体：</strong></p>
<ol>
<li>OpenCV 用于修剪视频。</li>
<li>YOLOv3 用于检测视频中的物体。</li>
<li>ResNet50 将检测到的物体图像转换成 2048 维特征向量。</li>
</ol>
<p>Milvus 在上传的数据集中搜索最相似的物体图像。从 MySQL 中检索相应的对象名称和图像文件路径。</p>
