---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - 基于 Milvus 的照片欺诈检测器
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: 以 Milvus 为向量搜索引擎的 Zhentu 检测系统是如何构建的？
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由 BestPay 高级算法工程师石岩和唐敏伟撰写，<a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a> 翻译。</p>
</blockquote>
<p>近年来，随着电子商务和在线交易在全球的普及，电子商务欺诈也随之兴起。欺诈者通过使用电脑生成的照片代替真实照片通过网络商务平台的身份验证，创建大量虚假账户，套取商家的优惠信息（如会员礼品、优惠券、代金券等），给消费者和商家都带来了无法挽回的损失。</p>
<p>面对大量数据，传统的风险控制方法已不再有效。为了解决这一问题，<a href="https://www.bestpay.com.cn">BestPay</a>基于深度学习（DL）和数字图像处理（DIP）技术，开发了一款照片欺诈检测器，即Zhentu（中文意思是检测图像）。Zhentu 适用于涉及图像识别的各种场景，其中一个重要的分支是识别假营业执照。如果用户提交的营业执照照片与平台照片库中已有的另一张照片非常相似，那么该用户很可能在某处盗用了该照片或伪造了营业执照以达到欺诈目的。</p>
<p>传统的图像相似度测量算法，如<a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a>和 ORB，速度慢且不准确，只适用于离线任务。而深度学习能够实时处理大规模图像数据，是匹配相似图像的终极方法。在BestPay研发团队和<a href="https://milvus.io/">Milvus社区</a>的共同努力下，作为Zhentu的一部分，图片欺诈检测系统被开发出来。它的功能是通过深度学习模型将海量图像数据转化为特征向量，并将其插入向量搜索引擎<a href="https://milvus.io/">Milvus</a>。借助 Milvus，该检测系统能够索引数万亿向量，并在数千万张图片中高效检索出相似的照片。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">振图概述</a></li>
<li><a href="#system-structure">系统结构</a></li>
<li><a href="#deployment"><strong>系统部署</strong></a></li>
<li><a href="#real-world-performance"><strong>实际性能</strong></a></li>
<li><a href="#reference"><strong>参考资料</strong></a></li>
<li><a href="#about-bestpay"><strong>关于 BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">Zhentu 概述<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu 是 BestPay 自主设计的多媒体视觉风险控制产品，深度集成了机器学习（ML）和神经网络图像识别技术。其内置算法可在用户身份验证过程中准确识别欺诈者，并在毫秒级响应。凭借行业领先的技术和创新的解决方案，征途已获得五项专利和两项软件著作权。目前，它已被多家银行和金融机构采用，帮助提前识别潜在风险。</p>
<h2 id="System-structure" class="common-anchor-header">系统结构<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>目前，BestPay 拥有超过 1000 万张营业执照照片，随着业务的发展，实际数量仍在成倍增长。为了从如此庞大的数据库中快速检索出相似照片，征途选择了 Milvus 作为特征向量相似度计算引擎。照片欺诈检测系统的总体结构如下图所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>该程序可分为四个步骤：</p>
<ol>
<li><p>图像预处理。预处理包括降噪、去噪和对比度增强，既能确保原始信息的完整性，又能去除图像信号中的无用信息。</p></li>
<li><p>特征向量提取。通过专门训练的深度学习模型来提取图像的特征向量。将图像转换成向量，以便进一步进行相似性搜索，这是一项常规操作。</p></li>
<li><p>归一化。对提取的特征向量进行归一化处理，有助于提高后续处理的效率。</p></li>
<li><p>使用 Milvus 进行向量搜索。将归一化特征向量插入 Milvus 数据库，进行向量相似性搜索。</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>部署</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>下面简要介绍一下 Zhentu 照片欺诈检测系统的部署情况。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 系统架构</span> </span></p>
<p>我们将<a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">Milvus 集群</a>部署<a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">在 Kubernetes 上</a>，以确保云服务的高可用性和实时同步。一般步骤如下：</p>
<ol>
<li><p>查看可用资源。运行<code translate="no">kubectl describe nodes</code> 命令，查看 Kubernetes 集群可分配给已创建案例的资源。</p></li>
<li><p>分配资源。运行命令<code translate="no">kubect`` -- apply xxx.yaml</code> ，使用 Helm 为 Milvus 群集组件分配内存和 CPU 资源。</p></li>
<li><p>应用新配置。运行命令<code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code> 。</p></li>
<li><p>将新配置应用到 Milvus 群集。这样部署的集群不仅可以根据不同的业务需求调整系统容量，还能更好地满足海量向量数据检索的高性能要求。</p></li>
</ol>
<p>您可以对<a href="https://milvus.io/docs/v2.0.x/configure-docker.md">Milvus 进行配置</a>，针对不同业务场景的不同数据类型优化搜索性能，如以下两个示例所示。</p>
<p>在<a href="https://milvus.io/docs/v2.0.x/build_index.md">构建向量索引</a>时，我们根据系统的实际场景对索引进行如下参数设置：</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a>先进行 IVF 索引聚类，再对向量的乘积进行量化。它具有高速磁盘查询和极低内存消耗的特点，可以满足 Zhentu 的实际应用需求。</p>
<p>此外，我们还设置了如下最优搜索参数：</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>由于向量在输入 Milvus 之前已经进行了归一化处理，因此选择内积（IP）来计算两个向量之间的距离。实验证明，使用 IP 比使用欧氏距离（L2）的召回率提高了约 15%。</p>
<p>上述例子表明，我们可以根据不同的业务场景和性能要求来测试和设置 Milvus 的参数。</p>
<p>此外，Milvus 不仅集成了不同的索引库，还支持不同的索引类型和相似度计算方法。Milvus 还提供多种语言的官方 SDK 和丰富的 API，用于插入、查询等，使我们的前端业务组可以使用 SDK 调用风险控制中心。</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>实际性能</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>到目前为止，照片欺诈检测系统一直在稳定运行，帮助企业识别潜在的欺诈者。2021 年，该系统全年共检测出 2 万多张假证。在查询速度方面，数千万向量中单个向量查询时间小于1秒，批量查询平均时间小于0.08秒。Milvus 的高性能搜索满足了企业对准确性和并发性的双重需求。</p>
<h2 id="Reference" class="common-anchor-header"><strong>参考文献</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. 使用定向快速旋转简约算法实现高性能特征提取方法[J].Int.J. Res. Eng.Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>关于百付宝</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>中国电信翼支付有限公司是中国电信的全资子公司。它操作支付和金融业务。BestPay致力于利用大数据、人工智能、云计算等前沿技术赋能业务创新，提供智能产品、风控解决方案等服务。截至 2016 年 1 月，这款名为 "BestPay "的应用已吸引超过 2 亿用户，成为紧随支付宝和微信支付之后的中国第三大支付平台操作符。</p>
