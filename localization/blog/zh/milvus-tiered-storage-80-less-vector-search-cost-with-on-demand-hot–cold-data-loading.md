---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: 停止为冷数据付费：Milvus 分层存储中的按需冷热数据加载可降低 80% 的成本
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: 了解 Milvus 中的分层存储如何实现冷热数据的按需加载，从而实现高达 80% 的成本削减和更快的大规模加载时间。
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>有多少人还在为系统几乎不接触的数据支付高级基础设施费用？说实话，大多数团队都是这样。</strong></p>
<p>如果你在生产中运行向量搜索，你可能已经亲眼目睹了这种情况。你需要配置大量内存和固态硬盘，以便一切都能 "随时查询"，尽管实际上只有一小部分数据集处于活动状态。你并不孤单。我们也见过很多类似的情况：</p>
<ul>
<li><p><strong>多租户 SaaS 平台：</strong>数以百计的入驻租户，但每天只有 10-15% 的租户处于活跃状态。其余的租户处于闲置状态，但仍占用资源。</p></li>
<li><p><strong>电子商务推荐系统：</strong>一百万个 SKU，但前 8%的产品产生了大部分推荐和搜索流量。</p></li>
<li><p><strong>人工智能搜索：</strong>庞大的 Embeddings 档案，尽管 90% 的用户查询都是搜索过去一周的商品。</p></li>
</ul>
<p>各行各业的情况都一样：<strong>只有不到 10% 的数据被频繁查询，但却往往消耗了 80% 的存储空间和内存。</strong>每个人都知道这种不平衡的存在，但直到最近，还没有一种简洁的架构方法来解决这个问题。</p>
<p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 的</a><strong>发布改变了这一状况</strong><strong>。</strong></p>
<p>在此版本发布之前，Milvus（与大多数向量数据库一样）依赖于<strong>满载模型</strong>：如果需要搜索数据，就必须将其加载到本地节点上。不管数据是每分钟上千次还是每季度一次，<strong>都必须保持热状态。</strong>这种设计选择确保了可预测的性能，但同时也意味着集群规模过大，需要为冷数据支付根本不值得的资源费用。</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">分层存储</a> <strong>就是我们的答案。</strong></p>
<p>Milvus 2.6 引入了全新的分层存储架构，<strong>真正实现了按需加载</strong>，让系统自动区分热数据和冷数据：</p>
<ul>
<li><p>热数据段缓存在靠近计算的地方</p></li>
<li><p>冷数据段在远程对象存储中廉价运行</p></li>
<li><p><strong>只有在查询实际需要时，才</strong>将数据调入本地节点</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这就将成本结构从 "拥有多少数据 "转变为<strong>"实际使用多少数据"。</strong>在早期的生产部署中，这种简单的转变<strong>最多可降低 80% 的存储和内存成本</strong>。</p>
<p>在本篇文章的其余部分，我们将介绍分层存储的工作原理，分享实际的性能结果，并说明这一变化在哪些方面产生了最大的影响。</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">为什么全加载会在规模上崩溃<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入探讨解决方案之前，我们不妨仔细研究一下 Milvus 2.5 和早期版本中使用的<strong>满载模式</strong>为何会在工作负载扩展时成为限制因素。</p>
<p>在 Milvus 2.5 及更早版本中，当用户发出<code translate="no">Collection.load()</code> 请求时，每个 QueryNode 都会在本地缓存整个 Collections，包括元数据、字段数据和索引。这些组件从对象存储中下载并存储在内存中或内存映射（mmap）到本地磁盘中。只有当<em>所有</em>这些数据都在本地可用后，Collection 才会被标记为已加载并可为查询提供服务。</p>
<p>换句话说，在节点上出现完整数据集（热数据集或冷数据集）之前，该 Collections 是不可查询的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>注意：</strong>对于嵌入原始向量数据的索引类型，Milvus 只加载索引文件，而不单独加载向量字段。即便如此，无论实际访问了多少数据，都必须完全加载索引才能为查询提供服务。</p>
<p>要了解为什么会出现这种问题，请看一个具体的例子：</p>
<p>假设你有一个中等规模的向量数据集，其中有</p>
<ul>
<li><p><strong>1 亿向量</strong></p></li>
<li><p><strong>768 个维度</strong>（BERT Embeddings）</p></li>
<li><p><strong>float32</strong>精度（每个维度 4 字节）</p></li>
<li><p>一个<strong>HNSW 索引</strong></p></li>
</ul>
<p>在此设置中，仅 HNSW 索引（包括嵌入的原始向量）就占用了约 430 GB 的内存。在添加用户 ID、时间戳或类别标签等常用标量字段后，本地资源总使用量轻松超过 500 GB。</p>
<p>这意味着，即使 80% 的数据很少被查询或从未被查询过，系统仍必须提供并持有超过 500 GB 的本地内存或磁盘，才能保持 Collections 在线。</p>
<p>对于某些工作负载，这种行为是可以接受的：</p>
<ul>
<li><p>如果几乎所有的数据都被频繁访问，那么完全加载所有数据就能以最高的成本实现最低的查询延迟。</p></li>
<li><p>如果数据可以分为热子集和热子集，那么将热数据内存映射到磁盘可以部分减轻内存压力。</p></li>
</ul>
<p>但是，在 80% 或更多数据位于长尾数据的工作负载中，完全加载的缺点很快就会显现出来，包括<strong>性能</strong>和<strong>成本</strong>两方面。</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">性能瓶颈</h3><p>在实际操作中，全加载影响的不仅仅是查询性能，往往还会拖慢常规操作符的工作流程：</p>
<ul>
<li><p><strong>滚动升级时间更长：</strong>在大型集群中，滚动升级可能需要数小时甚至一整天的时间，因为每个节点都必须重新加载整个数据集，然后才能再次可用。</p></li>
<li><p><strong>故障后恢复较慢：</strong>查询节点重启后，在重新加载所有数据之前无法提供流量服务，这大大延长了恢复时间，并扩大了节点故障的影响。</p></li>
<li><p><strong>迭代和实验速度减慢：</strong>完全加载会减慢开发工作流程，迫使人工智能团队在测试新数据集或索引配置时等待数小时才能加载数据。</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">成本效率低下</h3><p>全加载还会推高基础设施成本。例如，在主流云内存优化实例上，本地存储 1 TB 数据的成本约为<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mo separator="true">,</mo><mo>000peryear∗∗</mo><mo separator="true">,</mo><mi>basedonconservativepricing</mi><mo stretchy="false">(</mo><mi>AWSr6i</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70,000</annotation><mrow><mn>per year</mn></mrow><annotation encoding="application/x-tex">**, based</annotation></semantics></math></span></span>on conservative<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">pricing (AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">000peryear</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span>∗<span class="base"><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">basedonconservativepricing</span><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74/GB/月；GCP n4-highmem：~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>.68 / GB /</mn><mi>月</mi><mo separator="true">；</mo><mi>AzureE</mi><mi>系列</mi><mo>：</mo></mrow></semantics></math></span></span><mtext> </mtext><annotation encoding="application/x-tex"></annotation>5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.68 / GB / 月；Azure E 系列：~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">68/GB/month</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">系列</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.67 / GB / month)。</span></span></span></p>
<p>现在考虑一种更现实的访问模式，其中 80% 的数据是冷数据，可以存储在对象存储中（大约 0.023 美元/GB/月）：</p>
<ul>
<li><p>200 GB 热数据 × 5.68 美元</p></li>
<li><p>800 GB 冷数据 × 0.023 美元</p></li>
</ul>
<p>年成本：（200×5.68+800×0.023）×12≈14<strong>,000</strong>美元</p>
<p>总存储成本<strong>降低了 80%</strong>，而性能却没有受到影响。</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">分层存储是什么，如何工作？<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>为了消除权衡，Milvus 2.6 引入了<strong>分层存储</strong>，它将本地存储视为缓存，而不是整个数据集的容器，从而平衡了性能和成本。</p>
<p>在这种模型中，查询节点在启动时只加载轻量级元数据。字段数据和索引会在查询需要时按需从远程对象存储中获取，如果需要频繁访问，则会在本地缓存。不活动的数据可以被驱逐，以释放空间。</p>
<p>因此，热数据留在靠近计算层的地方，以便进行低延迟查询，而冷数据则留在对象存储中，直到需要时再取出。这就缩短了加载时间，提高了资源效率，并允许查询节点查询远大于本地内存或磁盘容量的数据集。</p>
<p>在实际应用中，分层存储的工作原理如下：</p>
<ul>
<li><p><strong>将热门数据保留在本地：</strong>大约 20% 的频繁访问数据保留在本地节点上，确保最重要的 80% 查询的低延迟。</p></li>
<li><p><strong>按需加载冷数据：</strong>剩下的 80% 很少访问的数据只在需要时才获取，从而释放了大部分本地内存和磁盘资源。</p></li>
<li><p><strong>利用基于 LRU 的驱逐功能进行动态调整：</strong>Milvus 采用 LRU（最近最少使用）驱逐策略，不断调整哪些数据被视为热数据或冷数据。不活动的数据会被自动驱逐，为新访问的数据腾出空间。</p></li>
</ul>
<p>通过这种设计，Milvus 不再受限于本地内存和磁盘的固定容量。取而代之的是，本地资源作为动态管理的缓存，不断从非活动数据中回收空间，并重新分配给活动工作负载。</p>
<p>这种行为由三个核心技术机制实现：</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1.懒加载</h3><p>在初始化时，Milvus 只加载最小的分段级元数据，使 Collections 在启动后几乎立即就可以进行查询。字段数据和索引文件保留在远程存储中，在执行查询时按需获取，从而保持较低的本地内存和磁盘使用率。</p>
<p><strong>Collections 加载在 Milvus 2.5 中的工作原理</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>在 Milvus 2.6 及更高版本中，懒加载是如何工作的</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>初始化过程中加载的元数据主要分为四类：</p>
<ul>
<li><p><strong>段统计</strong>信息（基本信息，如行计数、段大小和 Schema 元数据）</p></li>
<li><p><strong>时间戳</strong>（用于支持时间旅行查询）</p></li>
<li><p><strong>插入和删除记录</strong>（在查询执行过程中需要保持数据一致性）</p></li>
<li><p><strong>Bloom 过滤器</strong>（用于快速预过滤，以快速消除不相关的数据段）</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2.部分加载</h3><p>懒加载控制数据加载的<em>时间</em>，而部分加载控制数据加载的<em>数量</em>。一旦开始查询或搜索，查询节点就会执行部分加载，只从对象存储中获取所需的数据块或索引文件。</p>
<p><strong>向量索引：租户感知加载</strong></p>
<p>Milvus 2.6+ 引入的最有影响力的功能之一是向量索引的租户感知加载，这是专门为多租户工作负载设计的。</p>
<p>当查询访问单个租户的数据时，Milvus 只加载向量索引中属于该租户的部分，而跳过所有其他租户的索引数据。这就使本地资源集中在活跃租户上。</p>
<p>这种设计有几个好处：</p>
<ul>
<li><p>不活动租户的向量索引不占用本地内存或磁盘</p></li>
<li><p>活动租户的索引数据保持缓存状态，以实现低延迟访问</p></li>
<li><p>租户级 LRU 驱逐策略可确保各租户公平使用缓存</p></li>
</ul>
<p><strong>标量字段列级部分加载</strong></p>
<p>部分加载也适用于<strong>标量字段</strong>，允许 Milvus 仅加载查询明确引用的列。</p>
<p>考虑一个有<strong>50 个 Schema 字段</strong>的 Collections，如<code translate="no">id</code>,<code translate="no">vector</code>,<code translate="no">title</code>,<code translate="no">description</code>,<code translate="no">category</code>,<code translate="no">price</code>,<code translate="no">stock</code>, 和<code translate="no">tags</code> ，您只需要返回三个字段--<code translate="no">id</code>,<code translate="no">title</code>, 和<code translate="no">price</code> 。</p>
<ul>
<li><p>在<strong>Milvus 2.5</strong> 中，无论查询要求如何，都会加载所有 50 个标量字段。</p></li>
<li><p>在<strong>Milvus 2.6+</strong> 中，只加载所要求的三个字段。其余 47 个字段保持未加载状态，只有在以后需要访问时才会懒散地获取。</p></li>
</ul>
<p>这样可以节省大量资源。如果每个标量字段占用 20 GB：</p>
<ul>
<li><p>加载所有字段需要<strong>1,000 GB</strong>（50 × 20 GB）</p></li>
<li><p>只加载三个所需字段需要<strong>60 GB</strong></p></li>
</ul>
<p>这意味着标量数据加载<strong>量减少了 94%</strong>，而不会影响查询的正确性或结果。</p>
<p><strong>注：</strong>针对标量字段和向量索引的租户感知部分加载将在即将发布的版本中正式推出。一旦推出，它将进一步减少负载延迟，提高大型多租户部署中的冷查询性能。</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3.基于 LRU 的缓存驱逐</h3><p>懒加载和部分加载大大减少了进入本地内存和磁盘的数据量。但是，在长期运行的系统中，缓存仍会随着新数据的访问而增长。当达到本地容量时，基于 LRU 的缓存驱逐就会生效。</p>
<p>LRU（最近最少使用）驱逐遵循一个简单的规则：首先驱逐最近未被访问的数据。这就为新访问的数据腾出了本地空间，同时将常用数据保留在缓存中。</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">性能评估：分层存储与满载<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>为了评估<strong>分层存储</strong>在现实世界中的影响，我们建立了一个与生产工作负载密切相关的测试环境。我们从加载时间、资源使用情况、查询性能、有效容量和成本效益五个方面，对 Milvus 分层存储和不分层存储进行了比较。</p>
<h3 id="Experimental-setup" class="common-anchor-header">实验设置</h3><p><strong>数据集</strong></p>
<ul>
<li><p>1 亿个向量，768 个维度（BERT 嵌入向量）</p></li>
<li><p>向量索引大小：约 430 GB</p></li>
<li><p>10 个标量字段，包括 ID、时间戳和类别</p></li>
</ul>
<p><strong>硬件配置</strong></p>
<ul>
<li><p>1 个 QueryNode，带 4 个 vCPU、32 GB 内存和 1 TB NVMe SSD</p></li>
<li><p>10 Gbps 网络</p></li>
<li><p>MinIO 对象存储集群作为远程存储后端</p></li>
</ul>
<p><strong>访问模式</strong></p>
<p>查询遵循现实的冷热访问分布：</p>
<ul>
<li><p>80% 的查询以最近 30 天的数据为目标（≈ 数据总量的 20）</p></li>
<li><p>15% 的查询针对 30-90 天内的数据（≈ 数据总量的 30）</p></li>
<li><p>5%的查询以超过 90 天的数据为目标（≈ 数据总量的 50）</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">主要结果</h3><p><strong>1.加载时间快 33 倍</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>阶段</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+（分层存储）</strong></th><th style="text-align:center"><strong>加速</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">数据下载</td><td style="text-align:center">22 分钟</td><td style="text-align:center">28 秒</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">索引加载</td><td style="text-align:center">3 分钟</td><td style="text-align:center">17 秒</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>总计</strong></td><td style="text-align:center"><strong>25 分钟</strong></td><td style="text-align:center"><strong>45 秒</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>在 Milvus 2.5 中，加载 Collections 需要<strong>25 分钟</strong>。在 Milvus 2.6+ 中使用分层存储后，同样的工作负载只需<strong>45 秒</strong>就能完成，这意味着负载效率有了质的飞跃。</p>
<p><strong>2.本地资源使用减少 80</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>阶段</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (分层存储)</strong></th><th style="text-align:center"><strong>减少</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">加载后</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">1 小时后</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">24 小时后</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">稳定状态</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>在 Milvus 2.5 中，无论工作负荷或运行时间如何，本地资源使用量始终保持在<strong>430 GB</strong>。相比之下，Milvus 2.6+ 在加载后立即开始使用的资源只有<strong>12 GB</strong>。</p>
<p>随着查询的运行，频繁访问的数据被本地缓存，资源使用量逐渐增加。大约 24 小时后，系统稳定在<strong>85-95 GB</strong>，反映了热数据的工作集。从长远来看，这使得本地内存和磁盘的使用量<strong>减少了约 80%</strong>，而查询的可用性却没有受到影响。</p>
<p><strong>3.对热数据性能的影响几乎为零</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>查询类型</strong></th><th style="text-align:center"><strong>Milvus 2.5 P99 延迟</strong></th><th style="text-align:center"><strong>Milvus 2.6+ P99 延迟</strong></th><th style="text-align:center"><strong>变化</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">热数据查询</td><td style="text-align:center">15 毫秒</td><td style="text-align:center">16 毫秒</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">热数据查询</td><td style="text-align:center">15 毫秒</td><td style="text-align:center">28 毫秒</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">冷数据查询（首次访问）</td><td style="text-align:center">15 毫秒</td><td style="text-align:center">120 毫秒</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">冷数据查询（缓存）</td><td style="text-align:center">15 毫秒</td><td style="text-align:center">18 毫秒</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>对于约占所有查询 80% 的热数据，P99 延迟只增加了 6.7%，对生产几乎没有影响。</p>
<p>冷数据查询由于按需从对象存储加载，首次访问时的延迟较高。不过，一旦缓存，其延迟仅增加 20%。鉴于冷数据的访问频率较低，对于大多数实际工作负载来说，这种权衡通常是可以接受的。</p>
<p><strong>4.4.3 倍的有效容量</strong></p>
<p>在相同的硬件预算下--8 台服务器，每台 64 GB 内存（总计 512 GB）--Milvus 2.5 最多可加载 512 GB 的数据，相当于约 1.36 亿个向量。</p>
<p>在 Milvus 2.6+ 中启用分层存储后，同样的硬件可以支持 2.2 TB 的数据，大约相当于 5.9 亿个向量。这意味着有效容量增加了 4.3 倍，从而可以在不扩展本地内存的情况下为更大的数据集提供服务。</p>
<p><strong>5.成本降低 80.1%</strong></p>
<p>以 AWS 环境中的 2 TB 向量数据集为例，假设 20% 的数据为热数据（400 GB），成本对比如下：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>项目</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+（分层存储）</strong></th><th style="text-align:center"><strong>节省</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">每月成本</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">年度费用</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">节余率</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">基准总结</h3><p>在所有测试中，分层存储都实现了一致且可衡量的改进：</p>
<ul>
<li><p><strong>加载时间快 33 倍：</strong>Collections 加载时间从<strong>25 分钟</strong>缩短<strong>到 45 秒</strong>。</p></li>
<li><p><strong>本地资源使用率降低 80%：</strong>在稳态操作符下，内存和本地磁盘使用率降低了约<strong>80%</strong>。</p></li>
<li><p><strong>对热数据性能的影响几乎为零：</strong>热数据的 P99 延迟增加<strong>不到 10%</strong>，从而保持了低延迟查询性能。</p></li>
<li><p><strong>控制冷数据的延迟：</strong>冷数据在首次访问时会产生较高的延迟，但鉴于其访问频率较低，这种延迟是可以接受的。</p></li>
<li><p><strong>有效容量提高 4.3 倍：</strong>同样的硬件在不增加内存的情况下，可提供<strong>多 4-5 倍的数据</strong>。</p></li>
<li><p><strong>成本降低 80% 以上：</strong>年度基础设施成本降低<strong>80% 以上</strong>。</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">何时在 Milvus 中使用分层存储<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>根据基准测试结果和实际生产案例，我们将分层存储使用案例分为三类，以帮助您决定是否适合您的工作负载。</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">最适合的使用案例</h3><p><strong>1.多租户向量搜索平台</strong></p>
<ul>
<li><p><strong>特点：</strong>租户数量多，活动极不均衡；向量搜索是核心工作负载。</p></li>
<li><p><strong>访问模式：</strong>不到 20% 的租户产生 80% 以上的向量查询。</p></li>
<li><p><strong>预期效益</strong>成本降低 70-80%；容量扩大 3-5倍。</p></li>
</ul>
<p><strong>2.电子商务推荐系统（向量搜索工作负载）</strong></p>
<ul>
<li><p><strong>特点</strong>顶级产品和长尾产品之间的流行度偏差很大。</p></li>
<li><p><strong>访问模式：</strong>前 10% 的产品占向量搜索流量的约 80%。</p></li>
<li><p><strong>预期效益</strong>高峰期无需额外容量；成本降低 60-70</p></li>
</ul>
<p><strong>3.冷热分明的大规模数据集（向量为主）</strong></p>
<ul>
<li><p><strong>特点</strong>TB 级或更大规模的数据集，访问严重偏向于最近的数据。</p></li>
<li><p><strong>访问模式：</strong>典型的 80/20 分布：20% 的数据为 80% 的查询服务</p></li>
<li><p><strong>预期效益</strong>成本降低 75-85</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">合适的使用案例</h3><p><strong>1.成本敏感型工作负载</strong></p>
<ul>
<li><p><strong>特点：</strong>预算紧张，但可承受轻微的性能折衷。</p></li>
<li><p><strong>访问模式：</strong>向量查询相对集中。</p></li>
<li><p><strong>预期效益</strong>成本降低 50-70%；首次访问冷数据可能会产生 ~500 毫秒的延迟，应根据 SLA 要求进行评估。</p></li>
</ul>
<p><strong>2.历史数据保留和存档搜索</strong></p>
<ul>
<li><p><strong>特点：</strong>大量历史向量，查询频率极低。</p></li>
<li><p><strong>访问模式：</strong>约 90% 的查询以近期数据为目标。</p></li>
<li><p><strong>预期效益</strong>保留完整的历史数据集；保持基础设施成本的可预测性和可控性</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">不适合的使用案例</h3><p><strong>1.统一热数据工作负载</strong></p>
<ul>
<li><p><strong>特征：</strong>所有数据的访问频率相似，没有明显的冷热之分。</p></li>
<li><p><strong>不适合的原因</strong>高速缓存效益有限；增加了系统复杂性，却没有显著收益</p></li>
</ul>
<p><strong>2.超低延迟工作负载</strong></p>
<ul>
<li><p><strong>特点</strong>对延迟极为敏感的系统，如金融交易或实时竞价</p></li>
<li><p><strong>为什么不适合？</strong>即使是微小的延迟变化也是不可接受的；满载可提供更可预测的性能</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">快速入门：在 Milvus 2.6+ 中尝试分层存储<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
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
    </button></h2><p>Milvus 2.6 中的分层存储解决了向量数据存储方式与实际访问方式之间常见的不匹配问题。在大多数生产系统中，只有一小部分数据会被频繁查询，而传统的加载模型却将所有数据视为同样热的数据。通过转向按需加载并将本地内存和磁盘作为缓存来管理，Milvus 使资源消耗与实际查询行为而不是最坏情况假设保持一致。</p>
<p>这种方法允许系统在不按比例增加本地资源的情况下扩展到更大的数据集，同时保持热查询性能基本不变。冷数据在需要时仍可访问，并具有可预测和有限制的延迟，从而使权衡变得清晰可控。随着向量搜索深入到成本敏感、多租户和长期运行的生产环境中，分层存储为大规模高效操作提供了实用的基础。</p>
<p>有关分层存储的更多信息，请查看下面的文档：</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">分层存储 | Milvus 文档</a></li>
</ul>
<p>有问题或想深入了解最新 Milvus 的任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">了解有关 Milvus 2.6 功能的更多信息<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介绍 Milvus 2.6：十亿规模的经济型向量搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介绍 Embeddings 功能：Milvus 2.6 如何简化向量化和语义搜索</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus中的JSON粉碎功能：快88.9倍的灵活JSON过滤功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解锁真正的实体级检索：Milvus 中新的结构阵列和 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6 将地理空间过滤和向量搜索与几何字段和 RTREE 结合在一起</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">介绍 Milvus 中的 AISAQ：十亿规模向量搜索的内存成本降低了 3,200 倍</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">在 Milvus 中优化英伟达™（NVIDIA®）CAGRA：GPU-CPU 混合方法实现更快的索引和更低的查询成本</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：打击 LLM 训练数据中重复数据的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">将向量压缩发挥到极致：Milvus 如何利用 RaBitQ 提供多 3 倍的查询服务</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基准会说谎--向量数据库需要真正的测试 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我们为 Milvus 用啄木鸟取代了 Kafka/Pulsar</a></p></li>
</ul>
