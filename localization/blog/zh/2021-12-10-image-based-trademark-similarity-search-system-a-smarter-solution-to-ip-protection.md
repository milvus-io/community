---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: Milvus 在知识产权保护领域：利用 Milvus 建立商标相似性检索系统
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: 了解如何在知识产权保护行业中应用向量相似性搜索。
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>近年来，随着人们对知识产权侵权意识的不断增强，知识产权保护问题成为人们关注的焦点。最引人注目的是跨国科技巨头<a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">苹果公司</a>（Apple Inc.除了这些最臭名昭著的案件外，苹果公司还在 2009 年以商标侵权为由对澳大利亚连锁超市<a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">Woolworths Limited 的商标申请提出异议</a>。  苹果公司公司认为，澳大利亚品牌的徽标（一个风格化的 &quot;w&quot;）与他们自己的苹果徽标相似。因此，苹果公司对 Woolworths 申请销售带有该标志的一系列产品（包括电子设备）提出异议。故事的结局是伍尔沃斯修改了徽标，苹果撤回了反对意见。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>伍尔沃斯的徽标.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>苹果公司的徽标.png</span> </span></p>
<p>随着品牌文化意识的不断增强，公司正在密切关注任何可能损害其知识产权（IP）的威胁。知识产权侵权包括</p>
<ul>
<li>版权侵权</li>
<li>专利侵权</li>
<li>商标侵权</li>
<li>外观设计侵权</li>
<li>抢注</li>
</ul>
<p>上述苹果公司与伍尔沃斯公司之间的纠纷主要涉及商标侵权，准确地说，是两家公司的商标形象相似。为了避免成为另一个伍尔沃斯，无论是在商标申请之前，还是在商标申请审查期间，详尽的商标近似检索都是申请人的关键步骤。最常见的方法是在<a href="https://tmsearch.uspto.gov/search/search-information">美国专利商标局（USPTO）数据库</a>中进行检索，该数据库包含所有有效和无效的商标注册和申请。尽管用户界面并不迷人，但这一搜索过程也因其基于文本的性质而存在很大缺陷，因为它依赖文字和商标设计代码（设计特征的手工注释标签）来搜索图像。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>因此，本文意在展示如何利用开源向量数据库<a href="https://milvus.io">Milvus</a> 建立一个高效的基于图像的商标相似性搜索系统。</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">商标向量相似性搜索系统<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>要建立商标向量相似性搜索系统，需要经过以下步骤：</p>
<ol>
<li>准备一个庞大的商标数据集。系统可能会使用这样<a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">的</a>数据集）。</li>
<li>使用数据集和数据驱动模型或人工智能算法训练图像特征提取模型。</li>
<li>使用步骤 2 中训练好的模型或算法将徽标转换成向量。</li>
<li>在开源向量数据库 Milvus 中存储向量并进行向量相似性搜索。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>耐克.png</span> </span></p>
<p>在下面的章节中，让我们仔细了解一下构建商标向量相似性搜索系统的两个主要步骤：使用人工智能模型进行图像特征提取，以及使用 Milvus 进行向量相似性搜索。在我们的案例中，我们使用卷积神经网络（CNN）VGG16 提取图像特征并将其转换为嵌入向量。</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">使用 VGG16 提取图像特征</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a>是为大规模图像识别而设计的卷积神经网络。该模型在图像识别中速度快、精度高，可应用于各种尺寸的图像。以下是 VGG16 架构的两幅图示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>VGG16 模型，顾名思义，是一个有 16 层的 CNN。包括 VGG16 和 VGG19 在内的所有 VGG 模型都包含 5 个 VGG 块，每个 VGG 块中都有一个或多个卷积层。在每个块的末端，连接一个最大池化层，以减小输入图像的大小。每个卷积层内的核数相同，但每个 VGG 块内的核数加倍。因此，模型中的内核数量从第一个区块的 64 个增长到第四和第五个区块的 512 个。所有卷积核的<em>大小</em>都是<em>33，而池化核的大小都是 22</em>。这有利于保留输入图像的更多信息。</p>
<p>因此，在这种情况下，VGG16 是一种适合海量数据集图像识别的模型。你可以使用 Python、Tensorflow 和 Keras 在 VGG16 的基础上训练图像特征提取模型。</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">使用 Milvus 进行向量相似性搜索</h3><p>使用 VGG16 模型提取图像特征并将徽标图像转换为嵌入向量后，您需要从海量数据集中搜索相似向量。</p>
<p>Milvus 是一个云原生数据库，具有高扩展性和高弹性的特点。此外，作为一个数据库，它还能确保数据的一致性。对于这样一个商标相似性搜索系统来说，最新的商标注册等新数据会实时上传到系统中。而这些新上传的数据需要立即可供搜索。因此，本文采用了开源向量数据库 Milvus 来进行向量相似性搜索。</p>
<p>在插入徽标向量时，可以根据<a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">国际（尼斯）商品和服务分类（</a>一种用于注册商标的商品和服务分类系统）在 Milvus 中为不同类型的徽标向量创建 Collections。例如，您可以在 Milvus 中将一组服装品牌徽标向量插入名为 &quot;服装 &quot;的 Collections 中，并将另一组技术品牌徽标向量插入名为 &quot;技术 &quot;的不同 Collections 中。通过这样做，您可以大大提高向量相似性搜索的效率和速度。</p>
<p>Milvus 不仅支持向量相似性搜索的多种索引，还提供丰富的 API 和工具，为 DevOps 提供便利。下图是<a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">Milvus 架构</a>示意图。您可以通过阅读 Milvus 的<a href="https://milvus.io/docs/v2.0.x/overview.md">介绍</a>了解更多信息。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
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
<li><p>使用 Milvus 为其他应用场景构建更多向量相似性搜索系统：</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">基于 Milvus 的 DNA 序列分类</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">基于 Milvus 的音频检索</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">构建视频搜索系统的 4 个步骤</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">利用NLP和Milvus构建智能质量保证系统</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">加速新药发现</a></li>
</ul></li>
<li><p>参与我们的开源社区：</p>
<ul>
<li>在<a href="https://bit.ly/307b7jC">GitHub</a> 上查找 Milvus 或为其做出贡献。</li>
<li>通过<a href="https://bit.ly/3qiyTEk">论坛</a>与社区互动。</li>
<li>在<a href="https://bit.ly/3ob7kd8">Twitter</a> 上与我们联系。</li>
</ul></li>
</ul>
