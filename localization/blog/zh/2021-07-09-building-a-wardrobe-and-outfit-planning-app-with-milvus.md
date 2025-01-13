---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: 系统概述
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: 了解 Mozat 如何利用开源向量数据库 Milvus 为一款时尚应用程序提供支持，该应用程序提供个性化的风格推荐和图片搜索系统。
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>使用 Milvus 构建衣橱和服装规划应用程序</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p><a href="http://www.mozat.com/home">Mozat</a>成立于 2003 年，总部位于新加坡，在中国和沙特阿拉伯设有办事处。该公司专门从事社交媒体、通讯和生活方式应用程序的开发。<a href="https://stylepedia.com/">Stylepedia</a>是 Mozat 开发的一款衣橱应用程序，可帮助用户发现新风格，并与其他热衷时尚的人建立联系。它的主要功能包括整理数字衣橱、个性化风格推荐、社交媒体功能，以及用于查找与网上或现实生活中所见类似物品的图片搜索工具。</p>
<p><a href="https://milvus.io">Milvus</a>用于支持 Stylepedia 中的图片搜索系统。该应用可处理三种类型的图片：用户图片、产品图片和时尚照片。每张图片可以包含一个或多个项目，从而使每次查询更加复杂。图像搜索系统必须准确、快速、稳定，这样才能发挥作用，为在应用程序中添加服装建议和时尚内容推荐等新功能奠定坚实的技术基础。</p>
<h2 id="System-overview" class="common-anchor-header">系统概述<button data-href="#System-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia 系统流程.png</span> </span></p>
<p>图片搜索系统分为离线和在线两部分。</p>
<p>离线时，图片被矢量化并插入矢量数据库（Milvus）。在数据工作流程中，相关的产品图片和时尚照片通过对象检测和特征提取模型转换成 512 维的特征向量。然后对向量数据进行索引并添加到向量数据库中。</p>
<p>在线查询图像数据库，并将类似图像返回给用户。与离线部分类似，查询图像通过对象检测和特征提取模型进行处理，以获得特征向量。利用特征向量，Milvus 搜索 TopK 相似向量并获得其对应的图像 ID。最后，经过后处理（过滤、排序等），返回与查询图像相似的图像 Collections。</p>
<h2 id="Implementation" class="common-anchor-header">实施<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>实现过程分为四个模块：</p>
<ol>
<li>服装检测</li>
<li>特征提取</li>
<li>向量相似性搜索</li>
<li>后处理</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">服装检测</h3><p>在服装检测模块中，使用了基于锚点的单阶段目标检测框架<a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a> 作为目标检测模型，因为它体积小，推理实时。它提供四种模型尺寸（YOLOv5s/m/l/x），每种具体尺寸各有利弊。较大的模型性能会更好（精度更高），但需要更多的计算能力，运行速度也更慢。由于本例中的物体都是相对较大的物品，而且容易检测，因此使用最小的模型 YOLOv5s 就足够了。</p>
<p>每张图像中的衣物都会被识别并裁剪出来，作为后续处理中使用的特征提取模型输入。同时，物体检测模型还根据预定义的类别（上衣、外衣、裤子、裙子、连衣裙和连衣裙）预测服装分类。</p>
<h3 id="Feature-extraction" class="common-anchor-header">特征提取</h3><p>相似性搜索的关键是特征提取模型。裁剪后的衣服图像被嵌入 512 维浮点向量，以机器可读的数字数据格式表示其属性。采用<a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">深度度量学习（DML）</a>方法，以<a href="https://arxiv.org/abs/1905.11946">EfficientNet</a>作为骨干模型。</p>
<p>公因子学习旨在训练基于 CNN 的非线性特征提取模块（或编码器），以减小同一类样本对应的特征向量之间的距离，增大不同类样本对应的特征向量之间的距离。在这种情况下，同一类样本指的是同一件衣服。</p>
<p>在均匀扩展网络宽度、深度和分辨率时，EfficientNet 同时考虑了速度和精度。EfficientNet-B4 被用作特征提取网络，最终全连接层的输出是进行向量相似性搜索所需的图像特征。</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">向量相似性搜索</h3><p>Milvus 是一个开源的向量数据库，支持创建、读取、更新和删除（CRUD）操作，以及对万亿字节数据集进行近乎实时的搜索。在 Stylepedia 中，它被用于大规模向量相似性搜索，因为它具有高弹性、高稳定性、高可靠性和快如闪电的特点。Milvus 扩展了广泛使用的向量索引库（Faiss、NMSLIB、Annoy 等）的功能，并提供了一套简单直观的应用程序接口，允许用户针对给定场景选择理想的索引类型。</p>
<p>考虑到场景要求和数据规模，Stylepedia 的开发人员使用了 Milvus Distributed 与 HNSW 索引搭配的仅 CPU 版本。建立了两个索引 Collections，一个用于产品，另一个用于时尚照片，以支持不同的应用功能。每个 Collections 根据检测和分类结果进一步分为六个分区，以缩小搜索范围。Milvus 能在几毫秒内对数千万向量进行搜索，在提供最佳性能的同时，还能保持较低的开发成本并最大限度地减少资源消耗。</p>
<h3 id="Post-processing" class="common-anchor-header">后处理</h3><p>为了提高图像检索结果与查询图像之间的相似度，我们使用颜色过滤和关键标签（袖长、衣长、领子样式等）过滤来筛选出不合格的图像。此外，我们还使用了一种图像质量评估算法，以确保首先向用户展示质量较高的图像。</p>
<h2 id="Application" class="common-anchor-header">应用<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">用户上传和图片搜索</h3><p>用户可以拍摄自己的服装照片并上传到 Stylepedia 电子衣橱，然后检索与他们上传的照片最相似的产品图片。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-search-results.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">服装建议</h3><p>通过在 Stylepedia 数据库中进行相似度搜索，用户可以找到包含特定时尚单品的时尚照片。这些单品可能是某人正在考虑购买的新服装，也可能是他自己的 Collections 中可以有不同穿法或搭配的单品。然后，通过对经常与之搭配的单品进行聚类，就能生成服装搭配建议。例如，一件黑色机车夹克可以搭配多种单品，如一条黑色紧身牛仔裤。然后，用户可以浏览在所选公式中出现这种搭配的相关时尚照片。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-outfit.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-snapshot.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">时尚照片推荐</h3><p>系统根据用户的浏览历史、喜好和数字衣橱内容计算相似度，并提供用户可能感兴趣的定制时尚照片推荐。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-user-wardrobe.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>通过结合深度学习和计算机视觉方法，Mozat 利用 Milvus 构建了一个快速、稳定、准确的图像相似性搜索系统，为 Stylepedia 应用程序中的各种功能提供动力。</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">不做陌生人<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上查找或贡献 Milvus。</li>
<li>通过<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 与社区互动。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上与我们联系。</li>
</ul>
