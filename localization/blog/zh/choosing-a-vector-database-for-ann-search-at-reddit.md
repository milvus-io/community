---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: 在 Reddit 为 ANN 搜索选择向量数据库
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: 这篇文章介绍了 Reddit 团队选择最合适的向量数据库的过程，以及他们选择 Milvus 的原因。
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>这篇文章由 Reddit 的软件工程师 Chris Fournie 撰写，最初发表在</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a><em>上</em>，现经授权转载于此。</p>
<p>2024 年，Reddit 团队使用了多种解决方案来执行近似近邻（ANN）向量搜索。从谷歌的<a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">顶点人工智能向量搜索</a>，以及尝试使用<a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">Apache Solr 的 ANN 向量搜索</a>来处理一些较大的数据集，到 Facebook 的<a href="https://github.com/facebookresearch/faiss">FAISS 库来</a>处理较小的数据集（托管在垂直缩放的侧车上）。Reddit 越来越多的团队希望能有一个得到广泛支持的 ANN 向量搜索解决方案，该解决方案不仅具有成本效益，还能提供他们所需的搜索功能，并能扩展到 Reddit 规模的数据。为了满足这一需求，2025 年，我们为 Reddit 团队寻找理想的向量数据库。</p>
<p>本篇文章描述了我们根据 Reddit 目前的需求选择最佳向量数据库的过程。它并不描述总体上最好的向量数据库，也不描述所有情况下最基本的功能和非功能需求集。它描述的是 Reddit 及其工程文化在选择向量数据库时所重视和优先考虑的因素。这篇文章可以为你自己的需求 Collections 和评估提供灵感，但每个组织都有自己的文化、价值观和需求。</p>
<h2 id="Evaluation-process" class="common-anchor-header">评估过程<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>总的来说，选择步骤如下</p>
<p>1.收集团队的背景情况</p>
<p>2.定性评估解决方案</p>
<p>3.定量评估最优秀的竞争者</p>
<p>4.最终选择</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1.Collections from teams context</h3><p>向有意执行 ANN 向量搜索的团队收集三项背景信息：</p>
<ul>
<li><p>功能要求（例如，混合向量和词法搜索？范围搜索查询？通过非向量属性过滤？）</p></li>
<li><p>非功能性要求（例如，能否支持 1B 向量？ 能否达到 &lt;100ms P99 延迟？）</p></li>
<li><p>团队已经对向量数据库感兴趣</p></li>
</ul>
<p>对团队进行需求访谈并非易事。许多团队会用他们目前解决问题的方式来描述他们的需求，而你所面临的挑战就是了解并消除这种偏见。</p>
<p>例如，一个团队已经在使用 FAISS 进行 ANN 向量搜索，并表示新的解决方案必须在每次搜索调用中高效地返回 10K 个结果。经过进一步讨论，10K 个结果的原因是他们需要执行事后过滤，而 FAISS 并不提供在查询时过滤 ANN 结果的功能。他们的实际问题是需要过滤，因此任何能提供高效过滤的解决方案都足够了，返回 10K 个结果只是提高召回率所需的一种变通方法。他们的理想状态是在找到近邻之前对整个 Collections 进行预过滤。</p>
<p>询问团队已经在使用或感兴趣的向量数据库也很有价值。如果至少有一个团队对他们当前的解决方案持肯定意见，就说明向量数据库可能是一个有用的解决方案，可以在全公司共享。如果团队对某一解决方案只有负面看法，那么我们就不应该将其作为一个选项。接受团队感兴趣的解决方案也是一种确保团队感觉被纳入进程的方式，并帮助我们形成了一份主要竞争者的初步评估清单；在新的和现有的数据库中，有太多 ANN 向量搜索解决方案，不可能对所有解决方案进行详尽的测试。</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2.定性评估解决方案</h3><p>从团队感兴趣的解决方案列表开始，为了定性评估哪种 ANN 向量搜索解决方案最符合我们的需求，我们</p>
<ul>
<li><p>对每个解决方案进行研究，并根据其满足每个需求的程度与该需求的加权重要性进行评分</p></li>
<li><p>根据定性标准和讨论结果删除解决方案</p></li>
<li><p>挑选出前 N 个解决方案进行定量测试</p></li>
</ul>
<p>我们的 ANN 向量搜索解决方案起始列表包括</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>开放式搜索</p></li>
<li><p>Pgvector（已将 Postgres 用作 RDBMS）</p></li>
<li><p>Redis（已用作 KV 存储和缓存）</p></li>
<li><p>Cassandra（已用于非 ANN 搜索）</p></li>
<li><p>Solr（已用于词法搜索，并尝试过向量搜索）</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI（已用于 ANN 向量搜索）</p></li>
</ul>
<p>然后，我们将各团队提到的所有功能性和非功能性需求，加上一些代表我们的工程价值和目标的约束条件，在电子表格中列出，并权衡它们的重要性（从 1 到 3；如下表所示）。</p>
<p>对于我们要比较的每种解决方案，我们都要评估（从 0 到 3）每个系统满足该要求的程度（如下表所示）。这种评分方式有些主观，因此我们挑选了一个系统，并给出了评分示例和书面理由，让评审人员参考这些示例。我们还为每个分值的赋值提供了以下指导：在以下情况下赋值：</p>
<ul>
<li><p>0：无需求支持/需求支持证据</p></li>
<li><p>1：基本或不充分的需求支持</p></li>
<li><p>2：需求支持合理</p></li>
<li><p>3：超出可比解决方案的强大需求支持</p></li>
</ul>
<p>然后，我们用解决方案的需求分值与该需求重要性的乘积之和为每个解决方案创建了一个总分（例如，Qdrant 的重新排序/分数组合得分为 3，其重要性为 2，因此 3 x 2 = 6，对所有行重复此操作并相加）。最后，我们会得到一个总分，这个总分可作为对解决方案进行排序和讨论的基础，以及哪些需求最重要（注意，这个分数不是用来做出最终决定的，而是作为一种讨论工具）。</p>
<p><strong><em>编者注：</em></strong> <em>本评论基于 Milvus 2.4。我们后来推出了 Milvus 2.5、</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6</em></a><em>，Milvus 3.0 也即将推出，因此一些数据可能已经过时。即便如此，这种比较仍然具有很强的洞察力，而且非常有帮助。</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>类别</strong></td><td><strong>重要性</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>卡桑德拉</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>顶点人工智能</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>搜索类型</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">混合搜索</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>关键词搜索</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>近似 NN 搜索</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>范围搜索</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>重新排序/分数合并</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>索引方法</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>支持多种索引方法</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>量化</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>定位敏感散列（LSH）</td><td>1</td><td>0</td><td>0注：<a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 支持该功能。 </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>数据</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>浮点运算以外的向量类型</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>向量上的元数据属性（支持多属性、大记录量等）</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>元数据过滤选项（可对元数据进行过滤，具有前/后过滤功能）</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>元数据属性数据类型（健壮 Schema，例如 bool、int、string、json、数组）</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>元数据属性限制（范围查询，例如 10 &lt; x &lt; 15）</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>按属性分类的结果多样性（例如，在一个回复中，从每个子reddit 获得的结果不超过 N 个）</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>规模</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>数亿向量指数</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>十亿向量指数</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>支持向量至少 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>大于 2k 的支持向量</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 延迟 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 延迟 &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99.9% 可用性检索</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99.99% 可用性索引/存储</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>存储操作符</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>可在 AWS 托管</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>多地区</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>零停机升级</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>多云</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>应用程序接口/库</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>RESTful API</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>转到图书馆</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Java 库</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>蟒蛇</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>其他语言（C++、Ruby 等）</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>运行时操作符</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>普罗米修斯指标</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>DB 基本操作符</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>备用</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Kubernetes 操作符</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>结果分页</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>按 ID 进行嵌入式查找</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>返回带有候选 ID 和候选分数的 Embeddings</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>用户提供的 ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>能够在大规模批量背景下进行搜索</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>备份/快照：支持为整个数据库创建备份的功能</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>高效的大型索引支持（冷存储与热存储的区别）</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>支持/社区</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>供应商中立</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>强大的 api 支持</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>供应商支持</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>社区速度</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>生产用户群</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>社区感受</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Github Stars</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>配置</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>机密处理</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>来源</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>开放源代码</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>语言</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>发布</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>上游测试</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>文件的提供</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>成本效益</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>成本效益</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>性能</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>支持调整 CPU、内存和磁盘的资源利用率</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>多节点（pod）分片</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>有能力调整系统，在延迟和吞吐量之间取得平衡</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>用户自定义分区（写入）</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>多租户</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>分区</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>复制</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>冗余</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>自动故障切换</td><td>3</td><td>2</td><td>0 注：<a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 支持。 </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>负载平衡</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>图形处理器支持</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>卡桑德拉</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>顶点人工智能</strong></td></tr>
<tr><td><strong>解决方案总体得分</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>我们讨论了各种系统的总体得分和需求得分，并试图了解我们是否对需求的重要性进行了适当的加权，以及某些需求是否如此重要，以至于应将其视为核心约束条件。我们确定的其中一项要求是解决方案是否开源，因为我们希望解决方案能够让我们参与其中，为其做出贡献，并在我们的规模遇到小问题时迅速解决。贡献和使用开源软件是 Reddit 工程文化的重要组成部分。因此，我们排除了仅托管的解决方案（Vertex AI、Pinecone）。</p>
<p>在讨论过程中，我们发现其他几个关键要求对我们来说也非常重要：</p>
<ul>
<li><p>规模和可靠性：我们希望看到其他公司以 1 亿以上甚至 1B 的向量运行解决方案的证据</p></li>
<li><p>社区：我们希望解决方案拥有一个健康的社区，并在这个快速成熟的领域中保持强劲的发展势头</p></li>
<li><p>富有表现力的元数据类型和过滤功能，以支持我们的更多用例（按日期、布尔值等进行过滤）</p></li>
<li><p>支持多种索引类型（不仅仅是 HNSW 或 DiskANN），以更好地满足我们许多独特用例的性能要求</p></li>
</ul>
<p>经过讨论和对关键需求的打磨，我们选择（按顺序）进行定量测试：</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa 和</p></li>
<li><p>Weviate</p></li>
</ol>
<p>遗憾的是，这样的决定需要时间和资源，而任何组织都不可能无限制地投入时间和资源。考虑到我们的预算，我们决定测试 Qdrant 和 Milvus，并将测试 Vespa 和 Weviate 作为扩展目标。</p>
<p>Qdrant 与 Milvus 的对比也是对两种不同架构的有趣测试：</p>
<ul>
<li><p><strong>Qdrant：</strong>执行所有 ANN 向量数据库操作的同构节点类型</p></li>
<li><p><strong>Milvus：</strong> <a href="https://milvus.io/docs/architecture_overview.md">异构节点类型</a>（Milvus；一个用于查询，另一个用于索引，还有一个用于数据摄取、代理等。）</p></li>
</ul>
<p>哪一个易于设置（对其文档的测试）？哪一个易于运行（对其弹性功能和改进的测试）？哪一个最适合我们关心的使用案例和规模？在对解决方案进行量化比较时，我们试图回答这些问题。</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3.定量评估主要竞争者</h3><p>我们希望更好地了解每种解决方案的可扩展性，并在此过程中体验大规模设置、配置、维护和运行每种解决方案的感受。为此，我们收集了三个不同用例的文档和查询向量数据 Collections，在 Kubernetes 中用类似的资源设置了每个解决方案，将文档加载到每个解决方案中，并使用<a href="https://k6.io/">Grafana 的 K6</a>发送相同的查询负载，同时使用渐增到达率执行器为系统预热，然后达到目标吞吐量（例如 100 QPS）。</p>
<p>我们测试了吞吐量、每种解决方案的突破点、吞吐量与延迟之间的关系，以及它们在负载下失去节点时的反应（错误率、延迟影响等）。最令人感兴趣的是<strong>过滤对延迟的影响</strong>。我们还进行了简单的 "是"/"否 "测试，以验证文档中的功能是否与描述相符（例如，插入、删除、通过 ID 获取、用户管理等），并体验这些应用程序接口的人机工程学。</p>
<p><strong>测试在 Milvus v2.4 和 Qdrant v1.12 上进行。</strong>由于时间有限，我们没有详尽地调整或测试所有类型的索引设置；每个解决方案都使用了类似的设置，偏重于高ANN召回率，测试重点是HNSW索引的性能。每个解决方案的 CPU 和内存资源也相似。</p>
<p>在实验中，我们发现两种解决方案之间存在一些有趣的差异。在以下实验中，每个解决方案都有大约 340M Reddit 后向量，每个向量有 384 个维度，对于 HNSW，M=16，efConstruction=100。</p>
<p>在一次实验中，我们发现对于相同的查询吞吐量（100 QPS，同时没有摄取），添加过滤功能对 Milvus 的延迟影响要大于 Qdrant。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>过滤后的查询延迟</p>
<p>另外，我们发现在 Qdrant 上，摄取和查询负载之间的交互作用远大于 Milvus（如下图所示，在吞吐量不变的情况下）。这可能是由于它们的架构所致：Milvus 将其大部分的摄取流量分散在不同的节点类型上，而 Qdrant 则将摄取和查询流量分散在相同的节点上。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>摄取过程中的查询延迟（100 QPS</p>
<p>在测试按属性分类的结果多样性时（例如，在一个响应中从每个子论坛获得的结果不超过 N 个），我们发现在吞吐量相同的情况下，Milvus 的延迟比 Qdrant 更差（在 100 QPS 时）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>查询后延迟与结果多样性</p>
<p>我们还想看看当增加更多数据副本时（即复制因子 RF 从 1 增加到 2），每种解决方案的扩展效果如何。起初，在 RF=1 的情况下，Qdrant 比 Milvus 能以更高的吞吐量为我们提供令人满意的延迟（由于测试未无差错完成，因此未显示更高的 QPS）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant 在不同吞吐量下的 RF=1 延迟</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 在不同吞吐量下的延迟为 RF=1</p>
<p>然而，当增加复制因子时，Qdrant 的 p99 延迟有所改善，但 Milvus 能够维持比 Qdrant 更高的吞吐量，延迟也可以接受（由于延迟和错误较多，测试未完成，因此未显示 Qdrant 400 QPS）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 在不同吞吐量下的延迟为 RF=2</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant 在不同吞吐量下的 RF=2 延迟</p>
<p>由于时间限制，我们没有足够的时间在我们的数据集上比较 ANN 解决方案的召回率，但我们考虑了<a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a>提供的公开数据集上 ANN 解决方案的召回率测量结果。</p>
<h3 id="4-Final-selection" class="common-anchor-header">4.最终选择</h3><p><strong>从性能上看</strong>，在没有过多调整和仅使用 HNSW 的情况下，Qdrant 在许多测试中的原始延迟似乎比 Milvus 更好。不过，Milvus 看起来会随着复制的增加而扩展得更好，而且由于其多节点类型的架构，它在摄取和查询负载之间有更好的隔离性。</p>
<p><strong>操作方面，</strong>尽管 Milvus 的架构很复杂（多节点类型、依赖于像 Kafka 这样的外部先写日志和像 etcd 这样的元数据存储），但当这两种解决方案进入不良状态时，我们调试和修复 Milvus 比修复 Qdrant 更容易。Milvus 还能在增加 Collections 的复制因子时自动重新平衡，而在开源的 Qdrant 中，需要手动创建或丢弃分片才能增加复制因子（这是我们不得不自己构建或使用非开源版本的功能）。</p>
<p>与 Qdrant 相比，Milvus 是一种更 "Reddit 型 "的技术；它与我们技术栈的其他部分有更多相似之处。Milvus 是用我们偏爱的后端编程语言 Golang 编写的，因此对我们来说比用 Rust 编写的 Qdrant 更容易做出贡献。与 Qdrant 相比，Milvus 的开源项目速度非常快，而且它能满足我们更多的关键要求。</p>
<p>最终，两个解决方案都满足了我们的大部分要求，在某些情况下，Qdrant 在性能上更胜一筹，但我们认为我们可以进一步扩展 Milvus，运行起来也更得心应手，而且它比 Qdrant 更适合我们的组织。我们希望有更多的时间来测试 Vespa 和 Weaviate，但它们也可能因为组织匹配（Vespa 基于 Java）和架构（Weaviate 与 Qdrant 一样是单节点类型）而被淘汰。</p>
<h2 id="Key-takeaways" class="common-anchor-header">主要启示<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>对给出的需求提出质疑，努力消除现有解决方案的偏见。</p></li>
<li><p>为候选解决方案打分，并以此作为讨论基本需求的依据，而不是万能的依据</p></li>
<li><p>对解决方案进行量化评估，但在评估过程中要注意与解决方案合作的感受。</p></li>
<li><p>从维护、成本、可用性和性能的角度出发，选择最适合贵组织的解决方案，而不仅仅是因为某个解决方案性能最好。</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">鸣谢<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>本评估工作由 Ben Kochie、Charles Njoroge、Amit Kumar 和我共同完成。还要感谢其他为本工作做出贡献的人员，包括杨安妮、康拉德-雷切、萨布里娜-孔和安德鲁-约翰逊，他们为本工作提供了定性解决方案研究。</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">编者按<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>我们要衷心感谢 Reddit 工程团队--不仅因为他们选择 Milvus 来处理向量搜索工作负载，还因为他们花时间发布了如此详细、公正的评估报告。很少能看到真正的工程团队在比较数据库时有如此高的透明度，他们的文章对 Milvus 社区（以及其他社区）中试图了解日益增长的向量数据库情况的人很有帮助。</p>
<p>正如 Chris 在文章中提到的，没有一个 "最好的 "向量数据库。重要的是一个系统是否适合你的工作量、限制条件和操作符。Reddit 的比较很好地反映了这一现实。Milvus 并非在每个类别中都名列前茅，考虑到不同数据模型和性能目标之间的权衡，这完全在意料之中。</p>
<p>有一点值得澄清：Reddit 的评估使用的是<strong>Milvus 2.4</strong>，也就是当时的稳定版本。有些功能，比如 LSH 和几项索引优化，在 2.4 版中还不存在或不成熟，因此有些分数自然反映了旧版本的基线。从那时起，我们先后发布了 Milvus 2.5 和<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a>，它在性能、效率和灵活性方面都有了很大的不同。社区反响强烈，许多团队已经进行了升级。</p>
<p><strong>下面我们就来看看 Milvus 2.6 有哪些新功能：</strong></p>
<ul>
<li><p>采用 RaBitQ 1 位量化技术，<strong>内存使用率降低 72%</strong>，<strong>查询速度提高 4 倍</strong></p></li>
<li><p>采用智能分层存储，<strong>成本降低 50</strong></p></li>
<li><p>与 Elasticsearch 相比，<strong>BM25 全文搜索速度提高 4 倍</strong></p></li>
<li><p>利用新的路径索引，<strong>JSON 过滤速度提高 100 倍</strong></p></li>
<li><p>全新的零磁盘架构，以更低的成本实现更新鲜的搜索</p></li>
<li><p>更简单的 "数据输入、数据输出 "工作流，可嵌入管道</p></li>
<li><p>支持<strong>100K+ Collections</strong>以处理大型多租户环境</p></li>
</ul>
<p>如果您想了解详细内容，这里有一些不错的后续报道：</p>
<ul>
<li><p>博客：<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 简介：十亿规模的经济型向量搜索</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 发布说明： </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0：向量数据库的真实基准测试 - Milvus 博客</a></p></li>
</ul>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
