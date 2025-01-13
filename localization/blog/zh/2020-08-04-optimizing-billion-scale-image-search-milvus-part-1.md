---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: 概述
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: UPYUN 案例研究。了解 Milvus 如何从传统数据库解决方案中脱颖而出，帮助建立图像相似性搜索系统。
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>亿级图片搜索优化之旅 (1/2)</custom-h1><p>优朋普乐图片管理器为数千万用户提供服务，管理着数百亿张图片。随着用户图库的不断扩大，优步迫切需要一个能够快速定位图片的解决方案。换句话说，当用户输入一张图片时，系统应能在图库中找到其原图和类似图片。图像搜索服务的开发为解决这一问题提供了有效的方法。</p>
<p>图像搜索服务经历了两次演变：</p>
<ol>
<li>2019 年初开始第一次技术调研，2019 年 3 月和 4 月推出第一代系统；</li>
<li>2020 年初开始升级方案调研，2020 年 4 月开始全面升级为第二代系统。</li>
</ol>
<p>本文将结合笔者在该项目中的亲身经历，介绍两代图像检索系统的技术选择和基本原理。</p>
<h2 id="Overview" class="common-anchor-header">概述<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">什么是图像？</h3><p>在处理图像之前，我们必须知道什么是图像。</p>
<p>答案是：图像是像素的 Collections。</p>
<p>例如，本图中红框内的部分实际上就是一系列像素。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-what-is-an-image.png</span> </span></p>
<p>假设红框中的部分是一幅图像，那么图像中每个独立的小方块就是一个像素，也就是基本的信息单位。那么，图像的大小就是 11 x 11 px。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-what-is-an-image.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">图像的数学表示</h3><p>每幅图像都可以用矩阵表示。图像中的每个像素对应矩阵中的一个元素。</p>
<h3 id="Binary-images" class="common-anchor-header">二值图像</h3><p>二值图像的像素要么是黑的，要么是白的，因此每个像素可以用 0 或 1 表示。 例如，4*4 的二值图像的矩阵表示法为：</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">RGB 图像</h3><p>三原色（红、绿、蓝）可以混合产生任何颜色。对于 RGB 图像，每个像素都有三个 RGB 通道的基本信息。同样，如果每个通道使用一个 8 位数（256 级）来表示其灰度，那么像素的数学表示方法就是</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>以 4 * 4 RGB 图像为例：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>图像处理的本质就是处理这些像素矩阵。</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">图像搜索的技术问题<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>如果要查找原始图像，即像素完全相同的图像，那么可以直接比较它们的 MD5 值。但是，上传到互联网上的图像通常都经过压缩或添加了水印。即使是图像中的一个微小变化，也会产生不同的 MD5 结果。只要像素不一致，就不可能找到原始图像。</p>
<p>对于逐图搜索系统，我们希望搜索内容相似的图像。那么，我们需要解决两个基本问题：</p>
<ul>
<li>将图像表示或抽象为可由计算机处理的数据格式。</li>
<li>数据必须具有可比性，以便计算。</li>
</ul>
<p>更具体地说，我们需要以下特征：</p>
<ul>
<li>图像特征提取。</li>
<li>特征计算（相似性计算）。</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">第一代图像搜索系统<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">特征提取--图像抽象</h3><p>第一代逐图搜索系统使用感知哈希算法或 pHash 算法进行特征提取。这种算法的基本原理是什么？</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-first-generation-image-search.png</span> </span></p>
<p>如上图所示，pHash 算法对图像进行一系列变换，以获得哈希值。在变换过程中，算法会不断抽象图像，从而将相似图像的结果相互推近。</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">特征计算--相似度计算</h3><p>如何计算两幅图像的 pHash 值之间的相似度？答案是使用汉明距离。汉明距离越小，图像内容越相似。</p>
<p>什么是汉明距离？就是不同比特的数量。</p>
<p>举个例子、</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>上述两个值中有两个不同的比特，因此它们之间的汉明距离为 2。</p>
<p>现在我们知道了相似性计算的原理。接下来的问题是，如何从 1 亿张图片中计算出 1 亿比例数据的汉明距离？简而言之，如何搜索相似图片？</p>
<p>在项目初期，我没有找到一个令人满意的工具（或计算引擎）来快速计算汉明距离。于是我改变了计划。</p>
<p>我的想法是，如果两个 pHash 值的 Hamming 距离很小，那么我就可以剪切 pHash 值，相应的小部分很可能是相等的。</p>
<p>举个例子：</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>我们将上述两个值分成八段，其中六段的值完全相同。由此可以推断，它们的 Hamming 距离很近，因此这两幅图像是相似的。</p>
<p>经过转换后，可以发现计算 Hamming 距离的问题变成了匹配等价性的问题。如果我把每个 pHash 值分成八段，只要有五段以上的值完全相同，那么这两个 pHash 值就是相似的。</p>
<p>因此，解决等价匹配问题非常简单。我们可以使用传统数据库系统的经典过滤方法。</p>
<p>当然，我使用的是多词匹配，并在 ElasticSearch 中使用 minimum_should_match 指定匹配度（本文不介绍 ES 的原理，大家可以自学）。</p>
<p>为什么选择 ElasticSearch？首先，它提供了上述搜索功能。其次，图像管理器项目本身就在使用 ES 提供全文检索功能，使用现有资源非常经济。</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">第一代系统概述<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>第一代逐图搜索系统选择了 pHash + ElasticSearch 解决方案，该方案具有以下特点：</p>
<ul>
<li>pHash 算法简单易用，可以抵抗一定程度的压缩、水印和噪声。</li>
<li>ElasticSearch 使用项目的现有资源，不会增加搜索的额外成本。</li>
<li>但这一系统的局限性显而易见：pHash 算法是整个图像的抽象表示。一旦我们破坏了图像的完整性，比如在原图上添加黑色边框，就几乎无法判断原图与其他图像之间的相似性。</li>
</ul>
<p>为了突破这些限制，采用完全不同底层技术的第二代图像搜索系统应运而生。</p>
<p>本文作者 rifewang 是 Milvus 用户，也是 UPYUN 的软件工程师。如果你喜欢这篇文章，欢迎来打招呼！https://github.com/rifewang。</p>
