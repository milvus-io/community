---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: 使用 Nano Banana 2 + Milvus + Qwen 3.5 为电子商务建立从畅销书到图片的管道
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: 分步教程：使用 Nano Banana 2、Milvus 混合搜索和 Qwen 3.5，以 1/3 的成本从平铺图生成电子商务产品图片。
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>如果你为电子商务卖家构建人工智能工具，你可能已经听过无数次这样的请求："我有一个新产品。给我一张看起来像畅销书的宣传图片。不需要摄影师，不需要工作室，而且要便宜。</p>
<p>这就是问题所在。卖家有平铺的照片，也有已经转化的畅销书目录。他们希望用人工智能在两者之间架起一座桥梁，既快又有规模。</p>
<p>当谷歌在 2026 年 2 月 26 日发布 Nano Banana 2（双子座 3.1 闪存图像）时，我们当天就对其进行了测试，并将其集成到我们现有的基于 Milvus 的检索管道中。结果是：图像生成总成本下降到以前的大约三分之一，吞吐量翻了一番。每个图像的降价（比 Nano Banana Pro 便宜约 50%）是其中的一部分原因，但更大的节省来自于完全消除了返工周期。</p>
<p>本文介绍了 Nano Banana 2 在电子商务方面的优势和不足，然后介绍了完整流水线的实践教程：<strong>Milvus</strong>混合搜索用于查找视觉相似的畅销书，<strong>Qwen</strong>3.5 用于风格分析，<strong>Nano Banana 2</strong>用于最终生成。</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Nano Banana 2 有哪些新功能？<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>Nano Banana 2（双子座 3.1 闪存图像）于 2026 年 2 月 26 日推出。它将 Nano Banana Pro 的大部分功能带到了闪存架构中，这意味着生成速度更快，价格更低。以下是主要升级：</p>
<ul>
<li><strong>闪存速度下的专业级质量。</strong>Nano Banana 2 可提供世界一流的知识、推理和视觉保真度，这在以前只有专业版才能实现，但却具有 Flash 的延迟和吞吐量。</li>
<li><strong>512px 至 4K 输出。</strong>原生支持四种分辨率（512px、1K、2K、4K）。512px 分辨率是 Nano Banana 2 独有的新功能。</li>
<li><strong>14 种宽高比。</strong>在现有比例（1:1、2:3、3:2、3:4、4:3、4:5、5:4、9:16、16:9、21:9）基础上增加了 4:1、1:4、8:1 和 1:8。</li>
<li><strong>多达 14 个参考图像。</strong>在一个工作流程中，最多可保持 5 个字符的相似性和 14 个对象的保真度。</li>
<li><strong>改进文字渲染。</strong>可生成多种语言的清晰、准确的图像内文本，并在一次生成中支持翻译和本地化。</li>
<li><strong>图像搜索基础。</strong>从实时网络数据和谷歌搜索中提取图像，生成更准确的真实世界主题描述。</li>
<li><strong>~每张图片的成本降低约 50%。</strong>分辨率为 1K：<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.067</mn><mi>versusPro</mi><mn>′s0</mn></mrow><annotation encoding="application/x-tex">.067，而 Pro'</annotation><mrow><mn>s</mn></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span><span class="mord">0.</span><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′</span><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">s0</span></span></span></span></span></span></span></span></span></span></span></span>.134。</li>
</ul>
<p><strong>Nano Banano 2 的有趣应用案例：根据简单的谷歌地图截图生成位置感知全景图</strong></p>
<p>给定一张谷歌地图截图和一个样式提示，该模型就能识别地理上下文，并生成一个保留正确空间关系的全景图。这对于制作以地区为目标的广告创意（巴黎咖啡馆背景、东京街景）非常有用，而无需寻找图片库。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>有关完整的功能集，请参阅<a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">谷歌的公告博客</a>和<a href="https://ai.google.dev/gemini-api/docs/image-generation">开发者文档</a>。</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">Nano Banana 更新对电子商务意味着什么？<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>电子商务是图像最密集的行业之一。产品列表、市场广告、社交创意、横幅广告、本地化店面：每个渠道都需要源源不断的视觉资产，每个资产都有自己的规格。</p>
<p>电子商务中人工智能图像生成的核心要求可归结为以下几点：</p>
<ul>
<li><strong>保持低成本</strong>--每张图片的成本必须在目录规模内有效。</li>
<li><strong>与已证实的畅销书外观相匹配</strong>--新图片应与已实现转化的列表的视觉风格保持一致。</li>
<li><strong>避免侵权</strong>--不得复制竞争对手的创意或重复使用受保护的资产。</li>
</ul>
<p>除此之外，跨境卖家还需要</p>
<ul>
<li><strong>多平台格式支持</strong>--为市场、广告和店面提供不同的长宽比和规格。</li>
<li><strong>多语言文本渲染</strong>--干净、准确的多语言图像内文本。</li>
</ul>
<p>Nano Banana 2 几乎满足了所有要求。下文将详细介绍每项升级的实际意义：直接解决电子商务痛点、不足之处以及实际成本影响。</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">减少高达 60% 的输出生成成本</h3><p>在 1K 分辨率下，Nano Banana 2<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">的每张图片</annotation></semantics></math></span></span>成本为<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0</mn></mrow><annotation encoding="application/x-tex">.067</annotation><mrow><mn>perimageversusPro</mn><mi>′</mi><mn>s0</mn></mrow></semantics></math></span></span>.<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">067</span></span></span></span>，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">而 Pro 的</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span><span class="mord">0.</span><span class="mord"><span class="mord mathnormal">067perimageversusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mord mathnormal">s0</span></span></span></span>.134，直接降低了 50%。不过，每张图片的价格只是问题的一半。曾经扼杀用户预算的是返工。每个市场都有自己的图片规格（亚马逊为 1:1，Shopify 店面为 3:4，横幅广告为超宽），而生产每种变体都意味着单独的生成过程，有自己的失败模式。</p>
<p>Nano Banana 2 将这些额外的生成过程合并为一个过程。</p>
<ul>
<li><p><strong>四种原始分辨率级别。</strong></p></li>
<li><p>512px (0.045 美元)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>512px 分辨率是 Nano Banana 2 独有的新功能。用户现在可以生成低成本的 512px 草稿进行迭代，并以 2K 或 4K 输出最终资产，而无需单独的升频步骤。</p>
<ul>
<li><p>总共<strong>支持 14 种宽高比</strong>。下面是一些示例：</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>这些新的超宽和超高比例加入了现有的比例。一代会话可生成各种格式，如<strong>亚马逊主图</strong>（1:1）、<strong>店面英雄</strong>（3:4）和<strong>横幅广告</strong>（超宽或其他比例。）</p>
<p>这 4 种比例无需裁剪、无需填充、无需重新提示。其余 10 种宽高比包含在全套中，使整个过程在不同平台上更加灵活。</p>
<p>单是每幅图像节省约 50%的费用，就只需支付一半的费用。由于消除了跨分辨率和宽高比的返工，总成本降低了约三分之一。</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">以畅销书风格支持多达 14 张参考图片</h3><p>在 Nano Banana 2 的所有更新中，多参考混合对我们的 Milvus 流程影响最大。Nano Banana 2 在单个请求中最多可接受 14 张参考图片，并保持</p>
<ul>
<li>多达<strong>5 个字符</strong>的字符相似性</li>
<li>多达<strong>14 个对象的对象</strong>保真度</li>
</ul>
<p>在实践中，我们从 Milvus 中检索了多张畅销图片，将它们作为参考传入，生成的图片继承了它们的场景构图、灯光、姿势和道具摆放。不需要任何提示工程来手工重建这些模式。</p>
<p>以前的模型只支持一到两个参考，这迫使用户只能选择单一的畅销书进行模仿。有了 14 个参考位置，我们就可以融合多个绩优榜单的特征，让模型合成一种综合风格。正是这种能力使得下面教程中基于检索的管道成为可能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">无需传统制作成本或物流，即可生成优质、商业化的可视图像</h3><p>为了生成一致、可靠的图像，应避免将所有需求都集中到一个提示中。更可靠的方法是分阶段进行：首先生成背景，然后分别生成模型，最后将它们合成在一起。</p>
<p>我们用相同的提示测试了所有三个 Nano Banana 模型的背景生成：透过窗户看到的 4:1 超宽雨天上海天际线，东方明珠塔清晰可见。这一提示对构图、架构细节和逼真度进行了一次压力测试。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">原始 Nano Banana vs. Nano Banana Pro vs. Nano Banana 2</h4><ul>
<li><strong>原始纳米香蕉。</strong>自然的雨水纹理，水滴分布真实可信，但建筑细节过度平滑。东方明珠塔几乎无法辨认，分辨率也达不到制作要求。</li>
<li><strong>Nano Banana Pro。</strong>电影氛围：温暖的室内灯光与冰冷的雨水相映成趣，令人信服。不过，它完全省略了窗框，使画面的层次感变得平淡。可作为辅助画面，而非主角。</li>
<li><strong>纳米香蕉 2。</strong>渲染了整个场景。前景的窗框产生了层次感。东方明珠塔细节清晰。黄浦江上出现了船只。分层照明将室内的温暖与室外的阴霾区分开来。雨水和水渍的纹理接近摄影效果，4:1 的超宽比例保持了正确的透视，只有左侧窗户边缘有轻微失真。</li>
</ul>
<p>对于产品摄影中的大多数背景生成任务，我们发现 Nano Banana 2 的输出无需后期处理即可使用。</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">跨语言清晰渲染图像内文字</h3><p>在电子商务图片中，价格标签、促销横幅和多语言文本是不可避免的，而它们历来是人工智能生成的突破点。Nano Banana 2 能更好地处理这些问题，支持多语言图像内文本渲染，并能在一次生成中完成翻译和本地化。</p>
<p><strong>标准文本渲染。</strong>在我们的测试中，我们尝试的每种电子商务格式的文本输出都没有错误：价格标签、简短的营销标语和双语产品说明。</p>
<p><strong>手写续写。</strong>由于电子商务通常需要价格标签和个性化卡片等手写元素，我们测试了模型是否可以匹配现有的手写风格并进行扩展--具体来说，匹配手写待办事项列表并以相同的风格添加 5 个新项目。三种模型的结果：</p>
<ul>
<li><strong>原始纳米香蕉。</strong>重复序列号，结构错误。</li>
<li><strong>Nano Banana Pro。</strong>布局正确，但字体风格再现不佳。</li>
<li><strong>Nano Banana 2。</strong>零错误。笔划粗细和字形风格与源字体非常接近，无法区分。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>不过，</strong>谷歌自己的文档指出，Nano Banana 2 "在准确拼写和图像细节方面仍有问题"。我们测试的所有格式的结果都很干净，但任何生产工作流程都应包括发布前的文本验证步骤。</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">分步教程：使用 Milvus、Qwen 3.5 和 Nano Banana 2 构建从畅销书到图片的流程<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">开始之前架构和模型设置</h3><p>为了避免单个提示生成的随机性，我们将整个过程分为三个可控阶段：用<strong>Milvus</strong>混合搜索检索已经生效的内容，用<strong>Qwen 3.5</strong> 分析其生效的原因，然后用<strong>Nano Banana 2</strong> 生成带有这些约束条件的最终图像。</p>
<p>如果你以前没有使用过这些工具，请快速了解一下它们：</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">：</a>最广泛采用的开源向量数据库。它将产品目录存储为向量，并运行混合搜索（密集+稀疏+标量过滤器）来查找与新产品最相似的畅销图片。</li>
<li><strong>Qwen 3.5</strong>：一种流行的多模态 LLM。利用检索到的畅销图片，提取其背后的视觉模式（场景布局、光线、姿势、情绪），并将其转化为结构化的风格提示。</li>
<li><strong>Nano Banana 2</strong>：来自谷歌的图像生成模型（Gemini 3.1 Flash Image）。接受三个输入：新产品平面布局、畅销书参考和 Qwen 3.5 的风格提示。输出最终的宣传照片。</li>
</ul>
<p>这一架构背后的逻辑始于一个观察：任何电子商务目录中最有价值的视觉资产就是已经转换过的畅销书图片库。这些照片中的姿势、构图和光线都是通过实际的广告支出提炼出来的。直接检索这些模式要比通过提示文字进行逆向工程快一个数量级，而这一检索步骤正是向量数据库所要处理的。</p>
<p>以下是整个流程。我们通过 OpenRouter API 调用每个模型，因此不需要本地 GPU，也不需要下载模型权重。</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>我们依靠 Milvus 的三种能力来实现检索阶段：</p>
<ol>
<li><strong>密集+稀疏混合搜索。</strong>我们将图像 Embeddings 和文本 TF-IDF 向量作为并行查询运行，然后用 RRF（Reciprocal Rank Fusion）重排合并两个结果集。</li>
<li><strong>标量字段过滤。</strong>在向量比较之前，我们会根据类别和销售额等元数据字段进行过滤，因此结果只包括相关的高绩效产品。</li>
<li><strong>多字段 Schema。</strong>我们将密集向量、稀疏向量和标量元数据存储在一个 Milvus Collections 中，这样就能将整个检索逻辑保存在一个查询中，而不是分散在多个系统中。</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">数据准备</h3><p><strong>历史产品目录</strong></p>
<p>我们从两个资产开始：一个是现有产品照片的图像/文件夹，另一个是包含元数据的 products.csv 文件。</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>新产品数据</strong></p>
<p>对于我们要生成促销图片的产品，我们要准备一个平行结构：new_products/ 文件夹和 new_products.csv。</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">第 1 步：安装依赖项</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">第 2 步：导入模块和配置</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>配置所有模型和路径：</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>实用功能</strong></p>
<p>这些辅助函数用于处理图像编码、API 调用和响应解析：</p>
<ul>
<li>image_to_uri()：将 PIL 图像转换为用于 API 传输的 base64 数据 URI。</li>
<li>get_image_embeddings()：通过 OpenRouter Embedding API 将图像批量编码为 2048 维向量。</li>
<li>get_text_embedding()：将文本编码到相同的 2048 维向量空间中。</li>
<li>sparse_too_dict()：将 scipy 稀疏矩阵行转换为 Milvus 期望的稀疏向量的 {index: value} 格式。</li>
<li>extract_images()（提取图像从 Nano Banana 2 API 响应中提取生成的图像。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">步骤 3：加载产品目录</h3><p>读取 products.csv 并加载相应的产品图片：</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>输出示例：<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">步骤 4：生成 Embeddings</h3><p>混合搜索需要为每个产品生成两种向量。</p>
<p><strong>4.1 密集向量：图像嵌入</strong></p>
<p>nvidia/llama-nemotron-embed-vl-1b-v2 模型将每个产品图像编码为 2048 维的密集向量。由于该模型支持共享向量空间中的图像和文本输入，因此相同的嵌入可用于图像到图像和文本到图像检索。</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>输出：</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.2 个稀疏向量：TF-IDF 文本嵌入</strong></p>
<p>使用 scikit-learn 的 TF-IDF 向量器将产品文本描述编码为稀疏向量。这些稀疏向量可以捕捉到密集向量可能忽略的关键字级匹配。</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>输出：</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>为什么同时使用两种向量类型？</strong>密集向量和稀疏向量互为补充。密集向量捕捉视觉相似性：色调、服装轮廓、整体风格。稀疏向量捕捉关键词语义："floral"、"midi "或 "雪纺 "等表示产品属性的术语。将这两种方法结合起来，检索质量明显优于单独使用其中一种方法。</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">步骤 5：使用混合 Schema 创建一个 Milvus Collections</h3><p>这一步创建一个单独的 Milvus Collections，将密集向量、稀疏向量和标量元数据字段存储在一起。这种统一的 Schema 可以在一次查询中实现混合搜索。</p>
<table>
<thead>
<tr><th><strong>字段</strong></th><th><strong>类型</strong></th><th><strong>目的</strong></th></tr>
</thead>
<tbody>
<tr><td>密集矢量</td><td>FLOAT_VECTOR (2048d)</td><td>图像嵌入、COSINE 相似性</td></tr>
<tr><td>稀疏向量</td><td>稀疏浮点型向量</td><td>TF-IDF 稀疏向量，内积</td></tr>
<tr><td>类别</td><td>VARCHAR</td><td>用于筛选的类别标签</td></tr>
<tr><td>销售额</td><td>INT64</td><td>用于筛选的历史销售量</td></tr>
<tr><td>颜色、款式、季节</td><td>VARCHAR</td><td>附加元数据标签</td></tr>
<tr><td>价格</td><td>浮动</td><td>产品价格</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>插入产品数据：</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>输出：</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">步骤 6：混合搜索以查找类似畅销书</h3><p>这是核心检索步骤。对于每个新产品，管道会同时运行三个操作符：</p>
<ol>
<li><strong>密集搜索</strong>：查找具有视觉相似图像 Embeddings 的产品。</li>
<li><strong>稀疏搜索</strong>：通过 TF-IDF 查找具有匹配文本关键词的产品。</li>
<li><strong>标量过滤</strong>：将结果限制为相同类别且 sales_count &gt; 1500 的产品。</li>
<li><strong>RRF 重新排序</strong>：使用互易等级融合（<strong>Reciprocal</strong> Rank Fusion）合并密集和稀疏结果列表。</li>
</ol>
<p>加载新产品：</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>输出：  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>对新产品进行编码：</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>输出</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>执行混合搜索</strong></p>
<p>这里的关键 API 调用</p>
<ul>
<li>AnnSearchRequest 为密集向量场和稀疏向量场分别创建搜索请求。</li>
<li>expr=filter_expr 在每个搜索请求中应用标量过滤。</li>
<li>RRFRanker(k=60) 使用互易排名融合算法融合两个排名结果列表。</li>
<li>hybrid_search 同时执行两个请求，并返回合并后重新排名的结果。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>输出：按融合得分排序的前 3 个最相似的畅销书。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">步骤 7：使用 Qwen 3.5 分析畅销书风格</h3><p>我们将检索到的畅销书图片输入 Qwen 3.5，并要求它提取它们共同的视觉 DNA：场景构图、灯光设置、模型姿势和整体氛围。通过分析，我们得到了一个单一的生成提示，并将其交给 Nano Banana 2。</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>输出示例：</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">步骤 8：使用 Nano Banana 2 生成宣传图片</h3><p>我们向 Nano Banana 2 传递三个输入：新产品的平铺照片、排名靠前的畅销书图片，以及我们在上一步中提取的风格提示。该模型将这些信息合成一张宣传照片，将新服装与成熟的视觉风格搭配起来。</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Nano Banana 2 API 调用的关键参数：</p>
<ul>
<li>模式[文本&quot;、&quot;图像&quot;]：声明响应应包括图像。</li>
<li>image_config.aspect_ratio：控制输出的宽高比（3:4 适用于人像/时尚照片）。</li>
<li>image_config.image_size：设置分辨率。Nano Banana 2 支持 512px 至 4K。</li>
</ul>
<p>提取生成的图像：</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>输出：  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">步骤 9：并排比较</h3><p>输出结果大致符合要求：光线柔和、均匀，模型的姿势看起来很自然，气氛也与畅销书的参考相吻合。</p>
<p>不足之处在于服装的融合。开衫看起来是贴在模型上的，而不是穿在身上的，领口的白色标签也渗了出来。单通道生成难以实现这种精细的服装与身体的融合，因此我们在总结中介绍了一些变通方法。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">步骤 10：批量生成所有新产品</h3><p>我们将整个流程打包成一个函数，并在其余新产品中运行。为简洁起见，这里省略了批处理代码；如果您需要完整的实现，请联系我们。</p>
<p>批处理结果中有两点非常突出。我们从<strong>Qwen 3.5</strong>中获得的风格提示会根据产品进行有意义的调整：夏季连衣裙和冬季针织衫会根据季节、使用案例和配饰获得真正不同的场景描述。而我们从<strong>Nano Banana 2</strong> 中获得的图片，在光线、质感和构图方面都能与真正的摄影棚摄影相媲美。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">总结<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>在本文中，我们介绍了 Nano Banana 2 为电子商务图像生成带来的好处，将其与原始 Nano Banana 和 Pro 在实际生产任务中进行了比较，并介绍了如何使用 milvus、Qwen 3.5 和 Nano Banana 2 构建畅销书到图像的流程。</p>
<p>这一流程具有四个实际优势：</p>
<ul>
<li><strong>成本可控，预算可预测。</strong>嵌入模型（Llama Nemotron Embed VL 1B v2）在 OpenRouter 上是免费的。Nano Banana 2 的单张图像成本约为 Pro 的一半，而且本机多格式输出消除了返工周期，而返工周期曾使有效账单增加两倍或三倍。对于每季管理数千个 SKU 的电子商务团队来说，这种可预测性意味着图像制作将与目录同步进行，而不是超出预算。</li>
<li><strong>端到端自动化，更快上市。</strong>从平铺产品照片到成品宣传图片的流程无需人工干预。新产品从仓库照片到上市图片只需几分钟，而不是几天，这在目录周转率最高的旺季最为重要。</li>
<li><strong>无需本地 GPU，降低了进入门槛。</strong>每个模型都通过 OpenRouter API 运行。一个没有 ML 基础设施、也没有专职工程技术人员的团队，只需一台笔记本电脑就能运行这一管道。无需配置，无需维护，也无需前期硬件投资。</li>
<li><strong>检索精度更高，品牌一致性更强。</strong>Milvus 在单个查询中结合了密集、稀疏和标量过滤，在产品匹配方面始终优于单向量方法。在实践中，这意味着生成的图像能更可靠地继承品牌既定的视觉语言：照明、构图和造型，这些都是现有畅销产品已经证明的转换方式。生成的图片看起来就像属于你的商店，而不是普通的人工智能图片库。</li>
</ul>
<p>此外，还有一些限制因素值得直言不讳：</p>
<ul>
<li><strong>服装与人体的混合。</strong>单通道生成可能会使服装看起来是合成的，而不是穿着的。小配饰等细节有时会模糊。解决方法：分阶段生成（先生成背景，再生成模型姿势，最后合成）。这种多通道方法可以缩小每个步骤的范围，并显著提高混合质量。</li>
<li><strong>边缘情况下的细节保真度。</strong>配件、图案和文字较多的布局可能会失去清晰度。解决方法：在生成提示中添加明确的限制条件（"服装与人体自然贴合，无外露标签，无多余元素，产品细节清晰"）。如果特定产品的质量仍然不佳，可改用 Nano Banana Pro 进行最终处理。</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a>是为混合搜索步骤提供动力的开源向量数据库，如果你想四处打探或尝试换入自己的产品照片，<a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs">快速入门</a>大约需要十分钟。我们在<a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a>和 Slack 上有一个非常活跃的社区，我们很乐意看到大家用它创建什么。如果你最终针对不同的垂直产品或更大的目录运行了 Nano Banana 2，请分享结果！我们很乐意听听。</p>
<h2 id="Keep-Reading" class="common-anchor-header">继续阅读<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus：将炒作转化为企业就绪的多模态 RAG</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">什么是 OpenClaw？开源人工智能代理完全指南</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 教程：连接到 Slack 以获得本地人工智能助手</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我们提取了OpenClaw的内存系统并将其开源（memsearch）</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">克劳德代码的持久内存：memsearch ccplugin</a></li>
</ul>
