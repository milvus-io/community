---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: 宣布 Milvus 2.0 全面上市
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: 处理海量高维数据的简便方法
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>亲爱的 Milvus 社区成员和朋友们：</p>
<p>在第一个候选发布版（RC）发布六个月后的今天，我们非常高兴地宣布 Milvus 2.0 正式发布<a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">（GA）</a>并投入生产！这是一段漫长的旅程，我们感谢社区贡献者、用户和 LF AI &amp; Data 基金会等所有帮助我们实现这一目标的人。</p>
<p>如今，处理数十亿高维数据的能力对于人工智能系统来说是一件大事，这是有充分理由的：</p>
<ol>
<li>与传统的结构化数据相比，非结构化数据占据了主导地位。</li>
<li>数据的新鲜度从未像现在这样重要。数据科学家渴望及时的数据解决方案，而不是传统的 T+1 折中方案。</li>
<li>成本和性能变得更加重要，但目前的解决方案与实际应用案例之间仍存在很大差距。 因此，Milvus 2.0 应运而生。Milvus 是一种有助于大规模处理高维数据的数据库。它专为云计算设计，能够在任何地方运行。如果您一直在关注我们发布的 RC 版本，就会知道我们花了很大力气使 Milvus 更稳定、更易于部署和维护。</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA 现在提供以下功能<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>实体删除</strong></p>
<p>作为一个数据库，Milvus 现在支持<a href="https://milvus.io/docs/v2.0.x/delete_data.md">按主键删除实体</a>，以后还将支持按表达式删除实体。</p>
<p><strong>自动负载平衡</strong></p>
<p>Milvus 现在支持插件负载平衡策略，以平衡每个查询节点和数据节点的负载。由于对计算和存储进行了分解，平衡只需几分钟即可完成。</p>
<p><strong>移交</strong></p>
<p>一旦通过刷新封存了不断增长的数据段，移交任务就会用索引历史数据段替换不断增长的数据段，从而提高搜索性能。</p>
<p><strong>数据压缩</strong></p>
<p>数据压缩是一项后台任务，用于将小分段合并为大分段，并清理逻辑删除数据。</p>
<p><strong>支持 Embeddings 和本地数据存储</strong></p>
<p>在 Milvus Standalone 模式下，我们只需进行少量配置，就能移除 etcd/MinIO 依赖。本地数据存储还可用作本地缓存，以避免将所有数据载入主内存。</p>
<p><strong>多语言 SDK</strong></p>
<p>除<a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> 外，<a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>、<a href="https://github.com/milvus-io/milvus-sdk-java">Java</a>和<a href="https://github.com/milvus-io/milvus-sdk-go">Go</a>SDK 现在也可随时使用。</p>
<p><strong>Milvus K8s 操作符</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operator</a>提供了一个简便的解决方案，用于以可扩展和高可用的方式向目标<a href="https://kubernetes.io/">Kubernetes</a>集群部署和管理完整的 Milvus 服务栈，包括 Milvus 组件及其相关依赖项（如 etcd、Pulsar 和 MinIO）。</p>
<p><strong>帮助管理 Milvus 的工具</strong></p>
<p>我们要感谢<a href="https://zilliz.com/">Zilliz</a>提供的管理工具。我们现在有了<a href="https://milvus.io/docs/v2.0.x/attu.md">Attu</a> 和 Milvus<a href="https://milvus.io/docs/v2.0.x/cli_overview.md">_CLI</a>，前者允许我们通过直观的图形用户界面与 Milvus 交互，后者则是管理 Milvus 的命令行工具。</p>
<p>感谢所有 212 位贡献者，社区在过去 6 个月中完成了 6718 次提交，并关闭了大量稳定性和性能问题。在 2.0 GA 发布后，我们将很快发布稳定性和性能基准报告。</p>
<h2 id="Whats-next" class="common-anchor-header">下一步是什么？<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>功能</strong></p>
<p>字符串类型支持将是 Milvus 2.1 的下一个杀手级功能。我们还将引入生存时间（TTL）机制和基本的 ACL 管理，以更好地满足用户需求。</p>
<p><strong>可用性</strong></p>
<p>我们正在重构查询协调调度机制，以支持每个段的多内存副本。有了多个活动副本，Milvus 可以支持更快的故障切换和投机执行，从而将停机时间缩短到几秒之内。</p>
<p><strong>性能</strong></p>
<p>性能基准测试结果将很快在我们的网站上公布。预计在接下来的版本中，性能将有显著提高。我们的目标是将较小数据集下的搜索延迟减半，并将系统吞吐量提高一倍。</p>
<p><strong>易于使用</strong></p>
<p>Milvus 设计用于在任何地方运行。在接下来的几个小版本中，我们将在 MacOS（M1 和 X86）和 ARM 服务器上支持 Milvus。我们还将提供嵌入式 PyMilvus，因此您只需<code translate="no">pip install</code> Milvus，而无需复杂的环境设置。</p>
<p><strong>社区管理</strong></p>
<p>我们将完善会员规则，明确贡献者角色的要求和责任。导师计划也正在开发中；对云原生数据库、向量搜索和/或社区治理感兴趣的人，请随时联系我们。</p>
<p>我们对 Milvus GA 的最新发布感到非常兴奋！我们将一如既往地乐于听取您的反馈意见。如果您遇到任何问题，请随时通过<a href="https://github.com/milvus-io/milvus">GitHub</a>或<a href="http://milvusio.slack.com/">Slack</a> 联系我们。</p>
<p><br/></p>
<p>致以最诚挚的问候、</p>
<p>栾晓帆</p>
<p>Milvus 项目维护者</p>
<p><br/></p>
<blockquote>
<p><em>编辑：<a href="https://github.com/claireyuw">Claire Yu</a></em></p>
</blockquote>
