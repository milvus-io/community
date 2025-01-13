---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: 第二代逐图搜索系统
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: 利用 Milvus 为实际业务建立图像相似性搜索系统的用户案例。
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>亿级图像搜索优化之旅（2/2）</custom-h1><p>本文是<strong>UPYUN 所著《亿万级图像搜索优化之旅》的</strong>第二部分。如果您错过了第一部分，请点击<a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">这里</a>。</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">第二代逐图搜索系统<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>第二代逐图搜索系统在技术上选择了 CNN + Milvus 解决方案。该系统基于特征向量，并提供更好的技术支持。</p>
<h2 id="Feature-extraction" class="common-anchor-header">特征提取<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>在计算机视觉领域，人工智能的应用已成为主流。同样，第二代逐像搜索系统的特征提取也采用了卷积神经网络（CNN）作为底层技术。</p>
<p>CNN 一词很难理解。在此，我们重点回答两个问题：</p>
<ul>
<li>CNN 能做什么？</li>
<li>为什么可以使用 CNN 进行图像搜索？</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>人工智能领域有许多竞赛，图像分类是其中最重要的一项。图像分类的工作就是判断图片内容是关于猫、狗、苹果、梨还是其他类型的物体。</p>
<p>CNN 能做什么？它可以提取特征并识别物体。它从多个维度提取特征，并测量图片特征与猫或狗特征的接近程度。我们可以选择最接近的特征作为识别结果，这表明特定图像的内容是关于猫、狗还是其他东西。</p>
<p>CNN 的对象识别功能与图像搜索之间有什么联系？我们要的不是最终的识别结果，而是从多个维度提取的特征向量。两张内容相似的图像的特征向量必须接近。</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">应该使用哪种 CNN 模型呢？</h3><p>答案是 VGG16。为什么选择它？首先，VGG16 具有良好的泛化能力，即通用性很强。其次，VGG16 提取的特征向量有 512 维。如果维数很少，可能会影响准确性。如果维数太多，则存储和计算这些特征向量的成本相对较高。</p>
<p>使用 CNN 提取图像特征是一种主流的解决方案。我们可以使用 VGG16 作为模型，Keras + TensorFlow 作为技术实现。下面是 Keras 的官方示例：</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>这里提取的特征是特征向量。</p>
<h3 id="1-Normalization" class="common-anchor-header">1.归一化</h3><p>为了方便后续操作，我们经常会对特征进行归一化处理：</p>
<p>后续使用的也是归一化后的<code translate="no">norm_feat</code> 。</p>
<h3 id="2-Image-description" class="common-anchor-header">2.图像描述</h3><p>图像使用<code translate="no">keras.preprocessing</code> 的<code translate="no">image.load_img</code> 方法加载：</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>事实上，这是 Keras 调用的 TensorFlow 方法。详情请参阅 TensorFlow 文档。最终图像对象实际上是一个 PIL 图像实例（TensorFlow 使用的 PIL）。</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3.字节转换</h3><p>在实际应用中，图像内容通常通过网络传输。因此，与其从路径加载图像，我们更倾向于将字节数据直接转换为图像对象，即 PIL 图像：</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>上述 img 与 image.load_img 方法得到的结果相同。有两点需要注意：</p>
<ul>
<li>必须进行 RGB 转换。</li>
<li>必须调整大小（resize 是<code translate="no">load_img method</code> 的第二个参数）。</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4.黑边处理</h3><p>截图等图像偶尔会有一些黑色边框。这些黑边没有实用价值，而且会造成很大的干扰。因此，去除黑边也是一种常见的做法。</p>
<p>黑边框实质上是指所有像素都为（0，0，0）（RGB 图像）的一行或一列像素。去除黑色边框就是找到这些行或列并将其删除。这实际上是 NumPy 中的三维矩阵乘法。</p>
<p>删除水平黑边的示例：</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>这差不多就是我要讲的使用 CNN 提取图像特征和实现其他图像处理的内容。现在我们来看看向量搜索引擎。</p>
<h2 id="Vector-search-engine" class="common-anchor-header">向量搜索引擎<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>从图像中提取特征向量的问题已经解决。那么剩下的问题就是</p>
<ul>
<li>如何存储特征向量？</li>
<li>如何计算特征向量的相似度，也就是如何搜索？ 开源向量搜索引擎 Milvus 可以解决这两个问题。到目前为止，它在我们的生产环境中运行良好。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">向量搜索引擎 Milvus<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>从图像中提取特征向量远远不够。我们还需要动态管理这些特征向量（添加、删除和更新），计算向量的相似度，并返回最近邻范围内的向量数据。开源向量搜索引擎 Milvus 可以很好地完成这些任务。</p>
<p>本文接下来将介绍具体做法和注意事项。</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1.对 CPU 的要求</h3><p>要使用 Milvus，您的 CPU 必须支持 avx2 指令集。对于 Linux 系统，使用以下命令检查 CPU 支持哪些指令集：</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>然后会得到类似的结果：</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>下面的标志是你的 CPU 支持的指令集。当然，这些远远超出了我的需要。我只想看看是否支持特定的指令集，如 avx2。只需添加 grep 进行过滤即可：</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>如果没有返回结果，说明不支持该特定指令集。那你就得换台机器了。</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2.容量规划</h3><p>容量规划是我们设计系统时首先要考虑的问题。我们需要存储多少数据？数据需要多少内存和磁盘空间？</p>
<p>让我们快速计算一下。向量的每个维度都是 float32。一个 float32 类型占用 4 个字节。那么一个 512 维的向量需要 2 KB 的存储空间。同理：</p>
<ul>
<li>一千个 512 维向量需要 2 MB 的存储空间。</li>
<li>一百万个 512 维向量需要 2 GB 的存储空间。</li>
<li>1 千万个 512 维向量需要 20 GB 的存储空间。</li>
<li>1 亿个 512 维向量需要 200 GB 的存储空间。</li>
<li>10 亿个 512 维向量需要 2 TB 的存储空间。</li>
</ul>
<p>如果我们想在内存中存储所有数据，那么系统至少需要相应的内存容量。</p>
<p>建议使用官方的大小计算工具：Milvus 大小计算工具。</p>
<p>实际上，我们的内存可能没那么大（内存不够也没关系。Milvus 会自动将数据刷新到磁盘上）。除了原始的向量数据，我们还需要考虑日志等其他数据的存储。</p>
<h3 id="3-System-configuration" class="common-anchor-header">3.系统配置</h3><p>有关系统配置的更多信息，请参阅 Milvus 文档：</p>
<ul>
<li>Milvus 服务器配置：https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4.数据库设计</h3><p><strong>Collection 和分区</strong></p>
<ul>
<li>Collection 也称为表。</li>
<li>分区指的是集合内部的分区。</li>
</ul>
<p>分区的底层实现与 Collection 其实是一样的，只不过分区是在 Collection 的下面。但有了分区，数据的组织就变得更加灵活。我们还可以查询集合中的特定分区，以达到更好的查询效果。</p>
<p>我们可以有多少个 Collection 和分区？集合和分区的基本信息在元数据中。Milvus 使用 SQLite（Milvus 内部集成）或 MySQL（需要外部连接）进行内部元数据管理。如果默认使用 SQLite 管理 Metadata，当 Collection 和分区数量过多时，性能会受到严重影响。因此，Collection 和分区的总数不应超过 50,000 个（Milvus 0.8.0 会将这一数字限制在 4,096 个）。如果需要设置更大的数量，建议通过外部连接使用 MySQL。</p>
<p>Milvus 的 Collections 和 partition 所支持的数据结构非常简单，即<code translate="no">ID + vector</code> 。换句话说，表中只有两列：ID 和向量数据。</p>
<p><strong>注意</strong></p>
<ul>
<li>ID 应为整数。</li>
<li>我们需要确保 ID 在 Collections 中是唯一的，而不是在分区中。</li>
</ul>
<p><strong>条件筛选</strong></p>
<p>使用传统数据库时，我们可以指定字段值作为过滤条件。虽然 Milvus 的过滤方式不完全相同，但我们可以使用 Collections 和分区实现简单的条件过滤。例如，我们有大量图像数据，这些数据属于特定用户。那么，我们就可以按用户将数据分成若干分区。因此，使用用户作为过滤条件实际上就是指定分区。</p>
<p><strong>结构化数据和向量映射</strong></p>
<p>Milvus 只支持 ID + 向量数据结构。但在业务场景中，我们需要的是具有业务意义的结构化数据。换句话说，我们需要通过向量找到结构化数据。因此，我们需要通过 ID 维护结构化数据和向量之间的映射关系。</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>选择索引</strong></p>
<p>您可以参考以下文章：</p>
<ul>
<li>索引的类型：https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>如何选择索引：https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5.处理搜索结果</h3><p>Milvus 的搜索结果是 ID + 距离的 Collections：</p>
<ul>
<li>ID：Collection 中的 ID。</li>
<li>距离：距离值为 0 ~ 1 表示相似程度，值越小，两个向量越相似。</li>
</ul>
<p><strong>过滤 ID 为 -1 的数据</strong></p>
<p>当集合数量太少时，搜索结果中可能会包含 ID 为-1 的数据。我们需要自己将其过滤掉。</p>
<p><strong>分页</strong></p>
<p>向量的搜索则完全不同。查询结果按相似度降序排序，并选择最相似（topK）的结果（topK 由用户在查询时指定）。</p>
<p>Milvus 不支持分页。如果业务需要，我们需要自己实现分页功能。例如，如果每页有十个结果，但只想显示第三页，我们需要指定 topK = 30，并只返回最后十个结果。</p>
<p><strong>业务的相似性阈值</strong></p>
<p>两张图片的向量之间的距离介于 0 和 1 之间。如果我们想在特定的业务场景中判断两张图片是否相似，就需要在此范围内指定一个阈值。如果距离小于阈值，则两幅图像相似；如果距离大于阈值，则两幅图像差别很大。您需要根据自己的业务需求调整阈值。</p>
<blockquote>
<p>本文作者 rifewang 是 Milvus 用户，也是 UPYUN 的软件工程师。如果你喜欢这篇文章，欢迎来 @ https://github.com/rifewang 打招呼。</p>
</blockquote>
