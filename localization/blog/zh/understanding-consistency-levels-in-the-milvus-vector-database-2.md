---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: 了解 Milvus 向量数据库中的一致性水平 - 第二部分
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: Milvus向量数据库中可调整一致性水平背后的机制剖析。
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文作者<a href="https://github.com/longjiquan">龙继权</a>，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>译。</p>
</blockquote>
<p>在<a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">上</a>一篇关于一致性的<a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">博客</a>中，我们解释了什么是分布式向量数据库中一致性的内涵，介绍了 Milvus 向量数据库中支持的强一致性、有界滞后性、会话一致性和最终一致性四种一致性级别，并解释了每种一致性级别最适合的应用场景。</p>
<p>在本篇文章中，我们将继续研究 Milvus 向量数据库的用户能够灵活选择各种应用场景的理想一致性级别的机制。我们还将提供如何在 Milvus 向量数据库中调整一致性级别的基本教程。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">底层时间刻度机制</a></li>
<li><a href="#Guarantee-timestamp">保证时间戳</a></li>
<li><a href="#Consistency-levels">一致性级别</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">如何调整 Milvus 中的一致性级别？</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">底层时间刻度机制<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>在进行向量搜索或查询时，Milvus 使用时间刻度机制来确保不同级别的一致性。时间刻度是 Milvus 的水印，它就像 Milvus 中的时钟，标志着 Milvus 系统处于哪个时间点。每当有数据操作语言（DML）请求发送到 Milvus 向量数据库时，它就会给请求分配一个时间戳。如下图所示，例如，当有新数据插入信息队列时，Milvus 不仅会在这些插入的数据上标记时间戳，还会每隔一段时间插入时间刻度。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>时间刻度</span> </span></p>
<p>以上图中的<code translate="no">syncTs1</code> 为例。当查询节点等下游消费者看到<code translate="no">syncTs1</code> 时，消费者组件就会明白，所有早于<code translate="no">syncTs1</code> 插入的数据都已被消费。换句话说，时间戳值小于<code translate="no">syncTs1</code> 的数据插入请求将不再出现在消息队列中。</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">保证时间戳<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>如上一节所述，下游消费组件（如查询节点）会不断从消息队列中获取数据插入请求和时间刻度的消息。每消耗一个时间刻度，查询节点就会将这个消耗的时间刻度标记为可服务时间 -<code translate="no">ServiceTime</code> ，查询节点可看到<code translate="no">ServiceTime</code> 之前插入的所有数据。</p>
<p>除了<code translate="no">ServiceTime</code> 之外，Milvus 还采用了一种时间戳--保证时间戳（<code translate="no">GuaranteeTS</code> ），以满足不同用户对不同程度的一致性和可用性的需求。这意味着，Milvus 向量数据库的用户可以指定<code translate="no">GuaranteeTs</code> ，以便通知查询节点，在进行搜索或查询时，<code translate="no">GuaranteeTs</code> 之前的所有数据都应是可见的和涉及的。</p>
<p>当查询节点在 Milvus 向量数据库中执行搜索请求时，通常有两种情况。</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">情况 1：立即执行搜索请求</h3><p>如下图所示，如果<code translate="no">GuaranteeTs</code> 小于<code translate="no">ServiceTime</code> ，查询节点可以立即执行搜索请求。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>立即执行</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">方案 2：等待至 "ServiceTime &gt; GuaranteeTs"（服务时间 &gt; 保证时间</h3><p>如果<code translate="no">GuaranteeTs</code> 大于<code translate="no">ServiceTime</code> ，查询节点必须继续消耗消息队列中的时间刻度。在<code translate="no">ServiceTime</code> 大于<code translate="no">GuaranteeTs</code> 之前，查询请求无法执行。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>等待搜索</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">一致性级别<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>因此，可以在搜索请求中配置<code translate="no">GuaranteeTs</code> ，以实现您指定的一致性级别。<code translate="no">GuaranteeTs</code> 的值越大，<a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">一致性越强</a>，但搜索延迟也越高。而<code translate="no">GuaranteeTs</code> 的值越小，搜索延迟越短，但数据的可见性会受到影响。</p>
<p><code translate="no">GuaranteeTs</code> 在 Milvus 是一种混合时间戳格式。而用户对 Milvus 内部的<a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a>一无所知。因此，对用户来说，指定 的值是一项过于复杂的任务。为了省去用户的麻烦，提供最佳的用户体验，Milvus 只需要用户选择特定的一致性级别，Milvus 向量数据库就会自动为用户处理 值。也就是说，Milvus 用户只需从四种一致性级别中进行选择：, , , 和 。每个一致性级别都对应一定的 值。<code translate="no">GuaranteeTs</code> <code translate="no">GuaranteeTs</code> <code translate="no">Strong</code> <code translate="no">Bounded</code> <code translate="no">Session</code> <code translate="no">Eventually</code> <code translate="no">GuaranteeTs</code> </p>
<p>下图展示了 Milvus 向量数据库中四个一致性级别的<code translate="no">GuaranteeTs</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>保证</span> </span></p>
<p>Milvus 向量数据库支持四级一致性：</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code>：<code translate="no">GuaranteeTs</code> 设置为与最新系统时间戳相同的值，查询节点等待服务时间到达最新系统时间戳后再处理搜索或查询请求。</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code>：<code translate="no">GuaranteeTs</code> 设置为比最新系统时间戳小得多的值，以跳过一致性检查。查询节点会立即在现有数据视图上进行搜索。</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code>：<code translate="no">GuaranteeTs</code> 设置为相对小于最新系统时间戳的值，查询节点会在更新较少的数据视图上进行搜索。</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>:客户端使用最后一次写操作的时间戳作为<code translate="no">GuaranteeTs</code> ，这样每个客户端至少可以检索到自己插入的数据。</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">如何调整 Milvus 的一致性级别？<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 支持在<a href="https://milvus.io/docs/v2.1.x/create_collection.md">创建 Collections</a>或进行<a href="https://milvus.io/docs/v2.1.x/search.md">搜索</a>或<a href="https://milvus.io/docs/v2.1.x/query.md">查询</a>时调整一致性级别。</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">进行向量相似性搜索</h3><p>要按照所需的一致性级别进行向量相似性搜索，只需将参数<code translate="no">consistency_level</code> 的值设置为<code translate="no">Strong</code>,<code translate="no">Bounded</code>,<code translate="no">Session</code>, 或<code translate="no">Eventually</code> 即可。如果不设置参数<code translate="no">consistency_level</code> 的值，一致性级别默认为<code translate="no">Bounded</code> 。该示例使用<code translate="no">Strong</code> 一致性进行向量相似性搜索。</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">进行向量查询</h3><p>与进行向量相似性搜索类似，在进行向量查询时也可以指定参数<code translate="no">consistency_level</code> 的值。示例使用<code translate="no">Strong</code> 一致性进行了向量查询。</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.1 的正式发布，我们准备了一系列介绍新功能的博客。请阅读本系列博客中的更多内容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字符串数据增强相似性搜索应用程序的功能</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即时安装并用 Python 运行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">利用内存复制提高向量数据库的读取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">了解 Milvus 向量数据库的一致性水平</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">了解 Milvus 向量数据库的一致性水平（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus 向量数据库如何确保数据安全？</a></li>
</ul>
