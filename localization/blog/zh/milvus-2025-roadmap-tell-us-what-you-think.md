---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: Milvus 2025 路线图 - 告诉我们您的想法
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: 2025 年，我们将推出 Milvus 2.6 和 Milvus 3.0 两个重要版本，以及其他许多技术功能。欢迎您与我们分享您的想法。
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>嗨，Milvus 的用户和贡献者们！</p>
<p>我们很高兴与您分享<a href="https://milvus.io/docs/roadmap.md"><strong>Milvus 2025 路线图</strong></a>。🚀 这个技术计划强调了我们正在构建的关键功能和改进，以使 Milvus 更加强大，满足您的向量搜索需求。</p>
<p>但这仅仅是个开始，我们需要您的见解！您的反馈有助于 Milvus 的发展，确保它能够应对现实世界的挑战。让我们了解您的想法，帮助我们在前进过程中完善路线图。</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">当前形势<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>在过去的一年里，我们看到许多用户利用 Milvus 创建了令人印象深刻的 RAG 和 Agents 应用程序，利用了我们的许多流行功能，如模型集成、全文搜索和混合搜索。你们的实施为了解真实世界的向量搜索需求提供了宝贵的见解。</p>
<p>随着人工智能技术的发展，你们的用例也变得越来越复杂--从基本的向量搜索到复杂的多模式应用，涵盖了智能 Agents、自主系统和嵌入式人工智能。在我们继续开发 Milvus 以满足您的需求的过程中，这些技术挑战为我们的路线图提供了参考。</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">2025 年发布两个重要版本：Milvus 2.6 和 Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 年，我们将推出两个主要版本：Milvus 2.6（CY25 中期）和 Milvus 3.0（2025 年底）。</p>
<p><strong>Milvus 2.6</strong>重点关注您一直要求的核心架构改进：</p>
<ul>
<li><p>更简单的部署，更少的依赖性（告别令人头疼的部署问题）</p></li>
<li><p>更快的数据摄取管道</p></li>
<li><p>更低的存储成本（我们了解您对生产成本的担忧）</p></li>
<li><p>更好地处理大规模数据操作（删除/修改）</p></li>
<li><p>更高效的标量和全文搜索</p></li>
<li><p>支持您正在使用的最新 Embeddings 模型</p></li>
</ul>
<p><strong>Milvus 3.0</strong>是我们更大的架构演进，引入了向量数据湖系统，可用于：</p>
<ul>
<li><p>无缝集成人工智能服务</p></li>
<li><p>更高级别的搜索功能</p></li>
<li><p>更强大的数据管理</p></li>
<li><p>更好地处理您正在处理的海量离线数据集</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">我们正在规划的技术功能--我们需要您的反馈<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是我们计划添加到 Milvus 的关键技术功能。</p>
<table>
<thead>
<tr><th><strong>关键功能区</strong></th><th><strong>技术特点</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>人工智能驱动的非结构化数据处理</strong></td><td>- 数据输入/输出：与主要模型服务原生集成，用于原始文本输入<br>- 原始数据处理：原始数据处理的文本/URL 参考支持<br>- 张量支持向量列表实现（用于 ColBERT/CoPali/视频场景）<br>- 扩展数据类型：日期时间、地图、基于需求的 GIS 支持<br>- 迭代搜索：通过用户反馈完善查询向量</td></tr>
<tr><td><strong>搜索质量和性能改进</strong></td><td>- 高级匹配：短语匹配和多重匹配功能<br>- 分析器升级：增强分析器，扩大标记符支持范围，提高可观察性<br>- JSON 优化：通过改进索引加快过滤速度<br>- 执行排序：基于标量字段的结果排序<br>- 高级 Reranker：基于模型的 Reranker 和自定义评分功能<br>- 迭代搜索通过用户反馈完善查询向量</td></tr>
<tr><td><strong>数据管理灵活性</strong></td><td>- Schema 更改：添加/删除字段、修改 varchar 长度<br>- 标量聚合：计数/区分/最小/最大操作符<br>- 支持 UDF：支持用户自定义函数<br>- 数据版本管理基于快照的回滚系统<br>- 数据集群通过配置进行同地定位<br>- 数据采样基于采样数据快速获取结果</td></tr>
<tr><td><strong>架构改进</strong></td><td>- 流节点简化增量数据摄取<br>- 混合协调器统一协调器架构<br>- 日志存储独立性：减少外部依赖性，如脉冲星<br>- PK 重复数据删除：全局主键重复数据删除</td></tr>
<tr><td><strong>成本效率和架构改进</strong></td><td>- 分层存储：冷热数据分离，降低存储成本<br>- 数据驱逐策略：用户可定义自己的数据驱逐策略<br>- 批量更新：支持字段特定值修改、ETL 等<br>- 大型 TopK：返回海量数据集<br>- VTS GA：连接不同的数据源<br>- 高级量化基于量化技术优化内存消耗和性能<br>- 资源弹性：动态扩展资源，以适应不同的写入负载、读取负载和后台任务负载</td></tr>
</tbody>
</table>
<p>在我们实施这一路线图的过程中，希望您能就以下方面提出意见和反馈：</p>
<ol>
<li><p><strong>功能优先级：</strong>路线图中哪些功能对您的工作影响最大？</p></li>
<li><p><strong>实施想法：</strong>您认为哪些具体方法可以很好地实现这些功能？</p></li>
<li><p><strong>用例一致性：</strong>这些计划中的功能如何与您当前和未来的用例保持一致？</p></li>
<li><p><strong>性能考虑因素：</strong>针对您的特定需求，我们应该关注哪些性能方面？</p></li>
</ol>
<p><strong>您的见解将帮助我们为每个人打造更好的 Milvus。欢迎在我们的<a href="https://github.com/milvus-io/milvus/discussions/40263"> Milvus 论坛</a>或<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>上分享您的想法。</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">欢迎为 Milvus 做出贡献<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>作为一个开源项目，Milvus 始终欢迎您的贡献：</p>
<ul>
<li><p><strong>分享反馈：</strong>通过我们的<a href="https://github.com/milvus-io/milvus/issues">GitHub 问题页面</a>报告问题或建议功能</p></li>
<li><p><strong>代码贡献：</strong>提交拉取请求（参见我们的<a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">贡献者指南）</a></p></li>
<li><p><strong>传播信息：</strong>分享您的 Milvus 经验，并<a href="https://github.com/milvus-io/milvus">成为我们 GitHub 仓库的明星。</a></p></li>
</ul>
<p>我们很高兴能与您一起构建 Milvus 的下一个篇章。您的代码、想法和反馈将推动这个项目向前发展！</p>
<p>- Milvus 团队</p>
