---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: 对象检测
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: 了解 Milvus 如何对视频内容进行人工智能分析。
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>利用 Milvus 向量数据库构建视频分析系统</custom-h1><p><em>陈诗雨，Zilliz 数据工程师，毕业于西安电子科技大学计算机专业。加入Zilliz以来，她一直在探索Milvus在音视频分析、分子式检索等多个领域的解决方案，极大地丰富了社区的应用场景。目前，她正在探索更多有趣的解决方案。业余时间，她喜欢运动和阅读。</em></p>
<p>上周末看《<em>逍遥法外》</em>时，我觉得在哪里见过扮演保安巴迪的演员，但却想不起他的任何作品。我满脑子都是 "这家伙是谁？"我很确定我见过那张脸，却又极力想记起他的名字。类似的情况还有，有一次我看到视频中的男主角在喝一种我以前很喜欢的饮料，但我最终还是想不起品牌名称。</p>
<p>答案就在我的舌尖上，但我的大脑却感觉完全卡住了。</p>
<p>看电影时，舌尖（TOT）现象让我抓狂。要是有一个视频反向图像搜索引擎就好了，它能让我找到视频并分析视频内容。之前，<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">我用 Milvus</a> 构建了一个<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">反向图像搜索引擎</a>。考虑到视频内容分析与图像分析有某种相似之处，我决定在 Milvus 的基础上建立一个视频内容分析引擎。</p>
<h2 id="Object-detection" class="common-anchor-header">对象检测<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">概述</h3><p>在进行分析之前，首先要检测视频中的物体。有效、准确地检测视频中的物体是这项任务的主要挑战。这也是自动驾驶、可穿戴设备和物联网等应用的一项重要任务。</p>
<p>从传统的图像处理算法发展到深度神经网络（DNN），当今用于物体检测的主流模型包括 R-CNN、FRCNN、SSD 和 YOLO。本专题介绍的基于 milvus 的深度学习视频分析系统可以智能、快速地检测物体。</p>
<h3 id="Implementation" class="common-anchor-header">实施</h3><p>要检测和识别视频中的物体，系统首先要从视频中提取帧，并使用物体检测法检测帧图像中的物体；其次，从检测到的物体中提取特征向量；最后，根据特征向量对物体进行分析。</p>
<ul>
<li>帧提取</li>
</ul>
<p>视频分析通过帧提取转换为图像分析。目前，帧提取技术已经非常成熟。FFmpeg 和 OpenCV 等程序支持以指定间隔提取帧。本文将介绍如何使用 OpenCV 从视频中每秒提取帧。</p>
<ul>
<li>对象检测</li>
</ul>
<p>物体检测是指在提取的帧中查找物体，并根据物体的位置提取其截图。如下图所示，我们检测到了一辆自行车、一条狗和一辆汽车。本主题将介绍如何使用常用于物体检测的 YOLOv3 来检测物体。</p>
<ul>
<li>特征提取</li>
</ul>
<p>特征提取是指将机器难以识别的非结构化数据转换为特征向量。例如，可以利用深度学习模型将图像转换为多维特征向量。目前，最流行的图像识别人工智能模型包括 VGG、GNN 和 ResNet。本主题将介绍如何使用 ResNet-50 从检测到的物体中提取特征。</p>
<ul>
<li>向量分析</li>
</ul>
<p>将提取的特征向量与库向量进行比较，并返回最相似向量的对应信息。对于大规模特征向量数据集来说，计算是一个巨大的挑战。本专题介绍如何使用 Milvus 分析特征向量。</p>
<h2 id="Key-technologies" class="common-anchor-header">关键技术<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>开源计算机视觉库（OpenCV）是一个跨平台的计算机视觉库，它为图像处理和计算机视觉提供了许多通用算法。OpenCV 常用于计算机视觉领域。</p>
<p>下面的示例展示了如何使用 OpenCV 和 Python 以指定的时间间隔捕获视频帧并将其保存为图像。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3（YOLOv3 [5]）是近年来提出的一种单阶段物体检测算法。与精度相同的传统物体检测算法相比，YOLOv3 的速度快一倍。本主题中提到的 YOLOv3 是 PaddlePaddle [6] 的增强版。它采用多种优化方法，推理速度更快。</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet [7] 因其简单实用而成为 2015 年 ILSVRC 图像分类的冠军。作为许多图像分析方法的基础，ResNet 被证明是专门用于图像检测、分割和识别的流行模型。</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvus</a>是一个云原生的开源向量数据库，用于管理机器学习模型和神经网络生成的 Embeddings 向量。它广泛应用于计算机视觉、自然语言处理、计算化学、个性化推荐系统等场景。</p>
<p>以下程序介绍了 Milvus 的工作原理。</p>
<ol>
<li>通过使用深度学习模型将非结构化数据转换为特征向量，并导入 Milvus。</li>
<li>Milvus 对特征向量进行存储和索引。</li>
<li>Milvus 返回与用户查询向量最相似的向量。</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">部署<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>现在，您对基于 Milvus 的视频分析系统有了一定的了解。如下图所示，系统主要由两部分组成。</p>
<ul>
<li><p>红色箭头表示数据导入过程。使用 ResNet-50 从图像数据集中提取特征向量，并将特征向量导入 Milvus。</p></li>
<li><p>黑色箭头表示视频分析流程。首先，从视频中提取帧并将帧保存为图像。其次，使用 YOLOv3 检测和提取图像中的物体。然后，使用 ResNet-50 从图像中提取特征向量。最后，Milvus 通过相应的特征向量搜索并返回对象信息。</p></li>
</ul>
<p>更多信息，请参阅<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcamp：视频物体检测系统</a>。</p>
<p><strong>数据导入</strong></p>
<p>数据导入过程非常简单。将数据转换成 2,048 维向量，然后将向量导入 Milvus。</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>视频分析</strong></p>
<p>如上所述，视频分析过程包括捕捉视频帧、检测每帧中的物体、从物体中提取向量、用欧氏距离（L2）度量计算向量相似度，以及使用 Milvus 搜索结果。</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>目前，80% 以上的数据都是非结构化数据。随着人工智能的快速发展，越来越多的深度学习模型被开发出来用于分析非结构化数据。物体检测和图像处理等技术在学术界和工业界都取得了巨大突破。在这些技术的推动下，越来越多的人工智能平台满足了实际需求。</p>
<p>本专题所讨论的视频分析系统就是利用可以快速分析视频内容的 Milvus 构建的。</p>
<p>作为一个开源向量数据库，Milvus 支持使用各种深度学习模型提取特征向量。Milvus 与 Faiss、NMSLIB 和 Annoy 等库集成，提供了一套直观的 API，支持根据场景切换索引类型。此外，Milvus 还支持标量过滤，提高了召回率和搜索灵活性。Milvus 已应用于图像处理、计算机视觉、自然语言处理、语音识别、推荐系统和新药研发等多个领域。</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>[1] A. D. Bagdanov、L. Ballan、M. Bertini、A. Del Bimbo。"体育视频数据库中的商标匹配与检索"。多媒体信息检索国际研讨会论文集》，ACM，2007 年。https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases。</p>
<p>[2] J. Kleban, X. Xie, W.-Y.Ma."自然场景中标识检测的空间金字塔挖掘"。IEEE 国际会议，2008 年。https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia、C. Florea、L. Florea、R. Dogaru。"使用同构类图进行自然图像中的徽标定位和识别"。机器视觉与应用 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia、C. Florea、L. Florea."用于徽标检测的类原型中的椭圆漂移聚集"。BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
