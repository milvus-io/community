---
id: deep-dive-6-oss-qa.md
title: 开放源码软件（OSS）质量保证 - Milvus 案例研究
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: 质量保证是确定产品或服务是否符合某些要求的过程。
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/zhuwenxing">Wenxing Zhu</a>撰写，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> 翻译。</p>
</blockquote>
<p>质量保证（QA）是确定产品或服务是否符合特定要求的系统过程。质量保证系统是研发过程中不可或缺的一部分，因为顾名思义，它能确保产品的质量。</p>
<p>本篇文章将介绍开发 Milvus 向量数据库时采用的质量保证框架，旨在为作出贡献的开发人员和用户参与这一过程提供指导。文章还将介绍 Milvus 的主要测试模块，以及可用于提高质量保证测试效率的方法和工具。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Milvus QA 系统简介</a></li>
<li><a href="#Test-modules-in-Milvus">Milvus 中的测试模块</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">提高质量保证效率的工具和方法</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Milvus QA 系统简介<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">系统架构</a>是进行质量保证测试的关键。质量保证工程师对系统越熟悉，就越有可能提出合理有效的测试计划。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 架构</span> </span></p>
<p>Milvus 2.0 采用<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">云原生、分布式、分层架构</a>，SDK 是 Milvus<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">数据</a>流动的<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">主要入口</a>。Milvus 用户使用 SDK 的频率非常高，因此非常需要对 SDK 进行功能测试。此外，对 SDK 的功能测试还有助于检测 Milvus 系统可能存在的内部问题。除功能测试外，还将对向量数据库进行其他类型的测试，包括单元测试、部署测试、可靠性测试、稳定性测试和性能测试。</p>
<p>云原生和分布式架构为质量保证测试带来了便利和挑战。与本地部署和运行的系统不同，在 Kubernetes 集群上部署和运行的 Milvus 实例可以确保软件测试在与软件开发相同的环境下进行。但缺点是，分布式架构的复杂性带来了更多的不确定性，会使系统的质量保证测试变得更加困难和艰苦。例如，Milvus 2.0 使用了不同组件的微服务，这导致<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">服务和节点</a>数量增加，系统出错的可能性也更大。因此，为了提高测试效率，需要制定更复杂、更全面的质量保证计划。</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">质量保证测试和问题管理</h3><p>Milvus 的质量保证包括进行测试和管理软件开发过程中出现的问题。</p>
<h4 id="QA-testings" class="common-anchor-header">质量保证测试</h4><p>Milvus 根据 Milvus 功能和用户需求，按优先顺序进行不同类型的质量保证测试，如下图所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>质量保证测试优先级</span> </span></p>
<p>Milvus 按以下优先顺序对以下方面进行质量保证测试：</p>
<ol>
<li><strong>功能</strong>：验证功能和特性是否按原设计运行。</li>
<li><strong>部署</strong>：检查用户是否可以使用不同方法（Docker Compose、Helm、APT 或 YUM 等）部署、重新安装和升级 Milvus Standalone 版本和 Milvus 集群。</li>
<li><strong>性能</strong>：  测试 Milvus 中数据插入、索引、向量搜索和查询的性能。</li>
<li><strong>稳定性</strong>：检查 Milvus 能否在正常工作负荷下稳定运行 5-10 天。</li>
<li><strong>可靠性</strong>：测试 Milvus 在发生某些系统错误时是否仍能发挥部分功能。</li>
<li><strong>配置</strong>：验证 Milvus 是否能在特定配置下正常运行。</li>
<li><strong>兼容性</strong>：测试 Milvus 是否与不同类型的硬件或软件兼容。</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">问题管理</h4><p>软件开发过程中可能会出现许多问题。模板化问题的作者可以是 QA 工程师本人，也可以是来自开源社区的 Milvus 用户。质量保证团队负责找出问题。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>问题管理工作流程</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus/issues">问题</a>创建后，首先要经过分流。在分流过程中，将对新问题进行检查，以确保提供足够的问题细节。如果问题得到确认，就会被开发人员接受，并尝试修复问题。开发完成后，问题作者需要验证问题是否已修复。如果是，问题将最终关闭。</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">何时需要 QA？</h3><p>一个常见的误解是，质量保证和开发是相互独立的。但事实上，要确保系统的质量，开发人员和质量保证工程师都需要付出努力。因此，质量保证需要参与整个生命周期。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>质量保证生命周期</span> </span></p>
<p>如上图所示，一个完整的软件研发生命周期包括三个阶段。</p>
<p>在初始阶段，开发人员发布设计文档，而质量保证工程师提出测试计划、定义发布标准并分配质量保证任务。开发人员和质量保证工程师需要熟悉设计文档和测试计划，这样两个团队才能共同理解发布的目标（功能、性能、稳定性、错误收敛等方面）。</p>
<p>在研发期间，开发和质量保证测试会经常互动，以开发和验证特性和功能，并修复开源<a href="https://slack.milvus.io/">社区</a>报告的错误和问题。</p>
<p>在最后阶段，如果符合发布标准，就会发布新版 Milvus 的 Docker 镜像。正式发布时需要发布一份发布说明，重点介绍新功能和已修复的错误，并附上发布标签。然后，质量保证团队也会发布关于此版本的测试报告。</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Milvus 中的测试模块<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 中有多个测试模块，本节将详细介绍每个模块。</p>
<h3 id="Unit-test" class="common-anchor-header">单元测试</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>单元测试</span> </span></p>
<p>单元测试有助于在早期阶段识别软件缺陷，并为代码重组提供验证标准。根据 Milvus 拉取请求（PR）验收标准，代码单元测试的<a href="https://app.codecov.io/gh/milvus-io/milvus/">覆盖率</a>应达到 80%。</p>
<h3 id="Function-test" class="common-anchor-header">功能测试</h3><p>Milvus 中的功能测试主要围绕<a href="https://github.com/milvus-io/pymilvus">PyMilvus</a>和 SDK 组织。功能测试的主要目的是验证接口是否能按设计运行。功能测试包括两个方面</p>
<ul>
<li>测试 SDK 在传递正确参数时是否能返回预期结果。</li>
<li>当传递错误参数时，测试 SDK 是否能处理错误并返回合理的错误信息。</li>
</ul>
<p>下图描述了当前基于主流<a href="https://pytest.org/">pytest</a>框架的函数测试框架。该框架为 PyMilvus 添加了一个封装，并通过自动测试界面增强了测试功能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>函数测试</span> </span></p>
<p>考虑到需要一种共享的测试方法，以及一些函数需要重复使用，我们采用了上述测试框架，而不是直接使用 PyMilvus 接口。框架中还包含一个 "检查 "模块，为预期值和实际值的验证带来了方便。</p>
<p><code translate="no">tests/python_client/testcases</code> 目录中包含了多达 2700 个功能测试用例，几乎涵盖了 PyMilvus 的所有接口。这些功能测试严格监督每个 PR 的质量。</p>
<h3 id="Deployment-test" class="common-anchor-header">部署测试</h3><p>Milvus 有两种模式：<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">单机</a>和<a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">集群</a>。而部署 Milvus 主要有两种方式：使用 Docker Compose 或 Helm。而在部署 Milvus 后，用户还可以重启或升级 Milvus 服务。部署测试主要分为两类：重启测试和升级测试。</p>
<p>重启测试指的是测试数据持久性的过程，即重启后数据是否仍然可用。升级测试是指测试数据兼容性的过程，以防止在 Milvus 中插入不兼容格式的数据。如下图所示，这两种类型的部署测试共享相同的工作流程。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>部署测试</span> </span></p>
<p>在重启测试中，两个部署使用相同的 docker 映像。但在升级测试中，第一次部署使用的是前一版本的 docker 镜像，而第二次部署使用的是后一版本的 docker 镜像。测试结果和数据保存在<code translate="no">Volumes</code> 文件或<a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">持久卷索赔</a>（PVC）中。</p>
<p>运行第一个测试时，会创建多个 Collection，并对每个 Collection 进行不同的操作。运行第二个测试时，主要是验证已创建的 Collections 是否仍可用于 CRUD 操作，以及是否可以进一步创建新的 Collections。</p>
<h3 id="Reliability-test" class="common-anchor-header">可靠性测试</h3><p>云原生分布式系统的可靠性测试通常采用混沌工程方法，其目的是将错误和系统故障消灭在萌芽状态。换句话说，在混沌工程测试中，我们会有目的地制造系统故障，以便在压力测试中发现问题，并在系统故障真正开始造成危害之前将其修复。在Milvus的混沌测试中，我们选择<a href="https://chaos-mesh.org/">Chaos Mesh</a>作为制造混沌的工具。有几种类型的故障需要创建：</p>
<ul>
<li><strong>Pod kill</strong>：模拟节点瘫痪的场景。</li>
<li><strong>节点故障</strong>：测试如果其中一个工作节点 pod 出现故障，整个系统是否仍能继续工作。</li>
<li><strong>内存压力</strong>：模拟工作节点大量消耗内存和 CPU 资源的情况。</li>
<li><strong>网络分区</strong>：由于 Milvus<a href="https://milvus.io/docs/v2.0.x/four_layers.md">将存储与计算分离开来</a>，系统在很大程度上依赖于各组件之间的通信。需要对不同 pod 之间的通信进行分区的场景进行模拟，以测试 Milvus 不同组件之间的相互依赖性。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>可靠性测试</span> </span></p>
<p>上图展示了 Milvus 中的可靠性测试框架，可以自动进行混乱测试。可靠性测试的工作流程如下：</p>
<ol>
<li>通过读取部署配置初始化 Milvus 集群。</li>
<li>集群准备就绪后，运行<code translate="no">test_e2e.py</code> 测试 Milvus 功能是否可用。</li>
<li>运行<code translate="no">hello_milvus.py</code> 测试数据持久性。创建名为 "hello_milvus "的 Collections，用于数据插入、刷新、索引构建、向量搜索和查询。测试期间不会释放或丢弃此 Collections。</li>
<li>创建一个监控对象，启动六个线程执行创建、插入、刷新、索引、搜索和查询操作。</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>作出第一个断言--所有操作均按预期成功执行。</li>
<li>使用 Chaos Mesh 解析定义故障的 yaml 文件，为 Milvus 引入系统故障。例如，故障可以是每五秒杀死一个查询节点。</li>
<li>在引入系统故障的同时做出第二个断言--判断系统故障期间Milvus操作符返回的结果是否与预期相符。</li>
<li>通过 Chaos Mesh 消除故障。</li>
<li>当 Milvus 服务恢复后（意味着所有 pod 都准备就绪），做出第三个断言--所有操作都按预期成功进行。</li>
<li>运行<code translate="no">test_e2e.py</code> 测试 Milvus 功能是否可用。混乱期间的一些操作可能会因为第三个断言而受阻。而即使在混乱消除后，一些操作也可能继续受阻，从而阻碍第三个断言如预期般成功。这一步旨在促进第三个断言，并作为检查 Milvus 服务是否已恢复的标准。</li>
<li>运行<code translate="no">hello_milvus.py</code> ，加载创建的 Collections，并对 Collections 进行 CRUP 操作。然后，检查系统故障前的数据在故障恢复后是否仍然可用。</li>
<li>收集日志。</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">稳定性和性能测试</h3><p>下图描述了稳定性和性能测试的目的、测试场景和指标。</p>
<table>
<thead>
<tr><th></th><th>稳定性测试</th><th>性能测试</th></tr>
</thead>
<tbody>
<tr><td>目的</td><td>- 确保 Milvus 能在正常工作负荷下平稳运行一段时间。 <br>- 确保 Milvus 服务启动时资源消耗稳定。</td><td>- 测试 Milvus 所有接口的性能。 <br>- 通过性能测试找到最佳配置。  <br>- 作为未来版本的基准。 <br>- 找到妨碍提高性能的瓶颈。</td></tr>
<tr><td>应用场景</td><td>- 离线读密集型场景，数据插入后几乎不更新，处理每种类型请求的百分比为：搜索请求 90%，插入请求 5%，其他 5%。 <br>- 在线写密集型场景：数据插入和搜索同时进行，每类请求的处理比例为：插入请求 50%，搜索请求 40%，其他 10%。</td><td>- 数据插入 <br>- 建立索引 <br>- 向量搜索</td></tr>
<tr><td>指标</td><td>- 内存使用量 <br>- CPU 消耗 <br>- IO 延迟 <br>- Milvus pod 的状态 <br>- Milvus 服务的响应时间 <br>等</td><td>- 数据插入时的数据吞吐量 <br>- 建立索引所需的时间 <br>- 向量搜索期间的响应时间 <br>- 每秒查询次数（QPS） <br>- 每秒请求次数  <br>- 调用率 <br>等等。</td></tr>
</tbody>
</table>
<p>稳定性测试和性能测试共享同一套工作流程：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>稳定性和性能测试</span> </span></p>
<ol>
<li>解析和更新配置，并定义指标。<code translate="no">server-configmap</code> 对应 Milvus 单机或集群的配置，而<code translate="no">client-configmap</code> 对应测试用例的配置。</li>
<li>配置服务器和客户端。</li>
<li>数据准备</li>
<li>请求服务器和客户端之间的交互。</li>
<li>报告和显示指标。</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">提高 QA 效率的工具和方法<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>从模块测试部分，我们可以看到大部分测试的流程其实几乎都是一样的，主要涉及修改 Milvus 服务器和客户端配置、传递 API 参数等。当有多种配置时，不同配置的组合越多样，这些实验和测试所能涵盖的测试场景就越多。因此，代码和程序的重复使用对于提高测试效率至关重要。</p>
<h3 id="SDK-test-framework" class="common-anchor-header">SDK 测试框架</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>SDK 测试框架</span> </span></p>
<p>为了加快测试过程，我们可以在原有的测试框架中添加一个<code translate="no">API_request</code> 封装器，并将其设置为类似于 API 网关的东西。这个 API 网关将负责收集所有的 API 请求，然后将它们传递给 Milvus，让其集体接收响应。之后，这些响应将被传回客户端。这样的设计使得捕获某些日志信息（如参数和返回结果）变得更加容易。此外，SDK 测试框架中的检查器组件可以验证和检查来自 Milvus 的结果。所有检查方法都可以在该检查器组件中定义。</p>
<p>有了 SDK 测试框架，一些关键的初始化过程就可以封装成一个函数。这样就可以省去一大段繁琐的代码。</p>
<p>值得注意的是，每个单独的测试用例都与其独特的 Collections 相关，以确保数据隔离。</p>
<p>在执行测试用例时，<code translate="no">pytest-xdist</code> （pytest 扩展）可用于并行执行所有单个测试用例，大大提高了效率。</p>
<h3 id="GitHub-action" class="common-anchor-header">GitHub 操作</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>GitHub 操作</span> </span></p>
<p>采用<a href="https://docs.github.com/en/actions">GitHub Action</a>提高 QA 效率还有以下特点：</p>
<ul>
<li>它是与 GitHub 深度集成的原生 CI/CD 工具。</li>
<li>自带统一配置的机器环境，预装 Docker、Docker Compose 等常用软件开发工具。</li>
<li>它支持多种操作系统和版本，包括 Ubuntu、MacOs、Windows-server 等。</li>
<li>它拥有一个提供丰富扩展和开箱即用功能的市场。</li>
<li>它的矩阵支持并发作业，可重复使用相同的测试流程以提高效率</li>
</ul>
<p>除了上述特点，采用 GitHub Action 的另一个原因是，部署测试和可靠性测试需要独立、隔离的环境。而 GitHub Action 是对小规模数据集进行日常检查的理想选择。</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">基准测试工具</h3><p>为了提高 QA 测试的效率，我们使用了许多工具。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>质量保证工具</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>：一套用于 Kubernetes 的开源工具，可通过调度任务来运行工作流和管理集群。它还能并行运行多个任务。</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Kubernetes 仪表盘</a>：基于网络的 Kubernetes 用户界面，用于可视化<code translate="no">server-configmap</code> 和<code translate="no">client-configmap</code> 。</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>：网络附加存储（NAS）是一种文件级计算机数据存储服务器，用于保存常见的 ANN 基准数据集。</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a>和<a href="https://www.mongodb.com/">MongoDB</a>：用于保存基准测试结果的数据库。</li>
<li><a href="https://grafana.com/">Grafana</a>开源分析和监控解决方案，用于监控服务器资源指标和客户端性能指标。</li>
<li><a href="https://redash.io/">Redash</a>：一种帮助可视化数据和创建基准测试图表的服务。</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">关于深入研究系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣布全面上市</a>，我们精心策划了这个 Milvus 深度剖析系列博客，对 Milvus 架构和源代码进行深入解读。本系列博客涉及的主题包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架构概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">应用程序接口和 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">数据处理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">数据管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">实时查询</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">标量执行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">质量保证系统</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量执行引擎</a></li>
</ul>
