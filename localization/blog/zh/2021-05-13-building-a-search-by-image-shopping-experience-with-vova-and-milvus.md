---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: 利用 VOVA 和 Milvus 打造图片搜索购物体验
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: 了解电子商务平台 VOVA 如何利用开源向量数据库 Milvus 实现按图购物。
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>使用 VOVA 和 Milvus 构建图片搜索购物体验</custom-h1><p>跳转到</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">利用VOVA和Milvus打造图片搜索购物体验</a><ul>
<li><a href="#system-process-of-vovas-search-by-image-functionality"><em>VOVA图像搜索功能的系统流程。</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">使用 YOLO 模型进行目标检测</a>-<a href="#yolo-network-architecture"><em>YOLO 网络架构。</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">使用 ResNet 提取图像特征向量</a>-<a href="#resnet-structure"><em>ResNet 结构。</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">由 Milvus 支持的向量相似性搜索</a>-<a href="#mishards-architecture-in-milvus"><em>Milvus 中的 Mishards 架构。</em></a></li>
<li><a href="#vovas-shop-by-image-tool">VOVA 的图像购物工具</a>-<a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>VOVA 图像购物工具的屏幕截图。</em></a></li>
<li><a href="#reference">参考资料</a></li>
</ul></li>
</ul>
<p>2020 年网上购物激增，<a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">增长了 44%</a>，这在很大程度上是由于冠状病毒的流行。由于人们希望拉近社交距离，避免与陌生人接触，无接触式送货成为许多消费者梦寐以求的选择。这种流行也导致人们在网上购买更多种类的商品，包括传统关键词搜索难以描述的小众商品。</p>
<p>为了帮助用户克服基于关键字查询的局限性，公司可以建立图像搜索引擎，允许用户使用图像而不是文字进行搜索。这不仅能让用户找到难以描述的物品，还能帮助他们选购现实生活中遇到的物品。这种功能有助于建立独特的用户体验，并提供顾客所喜爱的一般便利。</p>
<p>VOVA 是一个新兴的电子商务平台，重点关注用户的经济承受能力，并为其提供良好的购物体验，其列表涵盖数百万种产品，支持 20 种语言和 35 种主要货币。为了增强用户的购物体验，该公司使用 Milvus 在其电子商务平台中构建了图片搜索功能。本文探讨了 VOVA 如何利用 Milvus 成功构建图像搜索引擎。</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">图片搜索如何工作？</h3><p>VOVA 的图片商店系统在公司的库存中搜索与用户上传内容相似的产品图片。下图显示了系统流程的两个阶段，即数据导入阶段（蓝色）和查询阶段（橙色）：</p>
<ol>
<li>使用 YOLO 模型从上传的照片中检测目标；</li>
<li>使用 ResNet 从检测到的目标中提取特征向量；</li>
<li>使用 Milvus 进行向量相似性搜索。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">使用 YOLO 模型检测目标</h3><p>VOVA 的 Android 和 iOS 移动应用程序目前支持图像搜索。该公司使用最先进的实时目标检测系统 YOLO（只看一次）来检测用户上传图像中的目标。YOLO 模型目前已进入第五次迭代。</p>
<p>YOLO 是一个单级模型，只使用一个卷积神经网络（CNN）来预测不同目标的类别和位置。它体积小、结构紧凑，非常适合移动使用。</p>
<p>YOLO 使用卷积层提取特征，使用全连接层获得预测值。借鉴 GooLeNet 模型的灵感，YOLO 的 CNN 包括 24 个卷积层和两个全连接层。</p>
<p>如下图所示，一幅 448 × 448 的输入图像经若干卷积层和池化层转换为 7 × 7 × 1024 维的张量（如下图倒数第三个立方体所示），再经两个全连接层转换为 7 × 7 × 30 维的张量输出。</p>
<p>YOLO P 的预测输出是一个二维张量，其形状为[batch,7 ×7 ×30]。通过切分，P[:,0:7×7×20] 是类别概率，P[:,7×7×20:7×7×(20+2)] 是置信度，P[:,7×7×(20+2)]:]是边界框的预测结果。</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;YOLO 网络架构。)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">使用 ResNet 提取图像特征向量</h3><p>VOVA 采用残差神经网络（ResNet）模型从庞大的产品图像库和用户上传的照片中提取特征向量。ResNet 的局限性在于，随着学习网络深度的增加，网络的准确性也会降低。下图描述了 ResNet 运行 VGG19 模型（VGG 模型的变体）的情况，该模型经过修改，通过短路机制加入了一个残差单元。VGG 模型于 2014 年提出，仅包含 14 层，而 ResNet 在一年后问世，最多可包含 152 层。</p>
<p>ResNet 结构易于修改和扩展。通过改变块中通道的数量和堆叠块的数量，可以轻松调整网络的宽度和深度，从而获得不同表达能力的网络。这就有效地解决了网络退化效应，即随着学习深度的增加，准确率会下降。只要有足够的训练数据，就能在逐步加深网络的同时，获得表达性能不断提高的模型。通过模型训练，提取每张图片的特征并转换为 256 维浮点向量。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">由 Milvus 支持的向量相似性搜索</h3><p>VOVA 的产品图片数据库包含 3000 万张图片，而且还在快速增长。为了从这个庞大的数据集中快速检索出最相似的产品图片，Milvus 被用来进行向量相似性搜索。由于进行了大量优化，Milvus 为管理向量数据和构建机器学习应用提供了一种快速、精简的方法。Milvus 提供与流行索引库（如 Faiss、Annoy）的集成，支持多种索引类型和距离度量，拥有多种语言的 SDK，并为管理向量数据提供丰富的 API。</p>
<p>Milvus 可以在几毫秒内对万亿矢量数据集进行相似性搜索，当 nq=1 时，查询时间低于 1.5 秒，平均批量查询时间低于 0.08 秒。为了构建图像搜索引擎，VOVA 参考了 Milvus 的分片中间件解决方案 Mishards 的设计（其系统设计见下图），实现了高可用服务器集群。通过利用 Milvus 集群的横向可扩展性，满足了项目对海量数据集高查询性能的要求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">VOVA 的图片商店工具</h3><p>下面的截图显示了 VOVA 公司安卓应用程序上的图片购物搜索工具。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>随着搜索商品和上传照片的用户越来越多，VOVA 将继续优化为系统提供动力的模型。此外，公司还将加入新的 Milvus 功能，可以进一步提升用户的在线购物体验。</p>
<h3 id="Reference" class="common-anchor-header">参考资料</h3><p><strong>YOLO：</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet：</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus：</strong></p>
<p>https://milvus.io/docs</p>
