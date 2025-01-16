---
id: Operationalize-AI-at-Scale-with-Software-MLOps-and-Milvus.md
title: 利用软件 2.0、MLOps 和 Milvus 实现人工智能的规模化运营
author: milvus
date: 2021-03-31T09:51:38.653Z
desc: 随着我们向软件 2.0 过渡，MLOps 正在取代 DevOps。了解什么是模型操作，以及开源向量数据库 Milvus 如何支持模型操作。
cover: assets.zilliz.com/milvus_5b2cdec665.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Operationalize-AI-at-Scale-with-Software-MLOps-and-Milvus
---
<custom-h1>利用软件 2.0、MLOps 和 Milvus 实现人工智能的规模化运营</custom-h1><p>构建机器学习 (ML) 应用程序是一个复杂而反复的过程。随着越来越多的公司意识到非结构化数据尚未开发的潜力，对<a href="https://milvus.io/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md">人工智能驱动的数据处理和分析的</a>需求将持续上升。如果没有有效的机器学习操作符（或 MLOps），大多数 ML 应用投资都将枯萎。研究发现，在企业计划部署的人工智能应用中，<a href="https://www.forbes.com/sites/cognitiveworld/2020/03/31/modelops-is-the-key-to-enterprise-ai/?sh=44c0f5066f5a">只有 5%</a>能够真正实现部署。许多企业都会产生 "模型债务"，即市场条件的变化以及未能适应这些变化，导致对模型的投资无法实现，这些投资一直得不到更新（或者更糟，根本就没有得到部署）。</p>
<p>本文介绍了人工智能模型生命周期管理的系统方法--MLOps，以及如何利用开源向量数据管理平台<a href="https://milvus.io/">Milvus</a>实现人工智能的规模化运营。</p>
<p><br/></p>
<h3 id="What-is-MLOps" class="common-anchor-header">什么是 MLOps？</h3><p>机器学习操作（MLOps），也称为模型操作（ModelOps）或 AI 模型操作符，是大规模构建、维护和部署 AI 应用程序的必要条件。由于公司希望将其开发的人工智能模型应用到数百种不同的场景中，因此在整个组织内对正在使用和开发中的模型进行操作至关重要。MLOps 涉及在机器学习模型的整个生命周期内对其进行监控，并管理从底层数据到依赖于特定模型的生产系统的有效性等一切事项。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_362a07d156.jpg" alt="01.jpg" class="doc-image" id="01.jpg" />
   </span> <span class="img-wrapper"> <span>01.jpg</span> </span></p>
<p>Gartner<a href="https://www.gartner.com/en/information-technology/glossary/modelops">将</a>ModelOps<a href="https://www.gartner.com/en/information-technology/glossary/modelops">定义</a>为对各种可操作的人工智能和决策模型进行治理和生命周期管理。MLOps 的核心功能可细分如下：</p>
<ul>
<li><p><strong>持续集成/持续交付（CI/CD）：</strong>CI/CD 是借鉴开发人员操作（DevOps）的一套最佳实践，是一种更频繁、更可靠地交付代码变更的方法。<a href="https://www.gartner.com/en/information-technology/glossary/continuous-integration-ci">持续集成</a>提倡小批量实施代码变更，同时通过严格的版本控制对其进行监控。<a href="https://www.gartner.com/smarterwithgartner/5-steps-to-master-continuous-delivery/">持续交付</a>可将应用程序自动交付到各种环境（如测试和开发环境）。</p></li>
<li><p><strong>模型开发环境（MDE）：</strong>模型开发环境是一个用于构建、审查、记录和检查模型的复杂过程，它有助于确保模型的迭代创建、边开发边记录、可信和可重现。有效的 MDE 可确保以受控方式对模型进行探索、研究和实验。</p></li>
<li><p><strong>冠军-挑战者测试：</strong>与市场营销人员使用的 A/B 测试方法类似，<a href="https://medium.com/decision-automation/what-is-champion-challenger-and-how-does-it-enable-choosing-the-right-decision-f57b8b653149">冠军挑战者测试</a>涉及试验不同的解决方案，以帮助决策过程，从而致力于采用单一方法。这种技术包括实时监控和测量性能，以确定哪种偏差效果最好。</p></li>
<li><p><strong>模型版本化：</strong>与任何复杂的系统一样，机器学习模型是由许多不同的人分步开发的，这就产生了围绕数据和 ML 模型版本的数据管理问题。模型版本管理有助于管理和控制 ML 开发的迭代过程，在这个过程中，数据、模型和代码可能会以不同的速度发展。</p></li>
<li><p><strong>模型存储和回滚：</strong>部署模型时，必须存储其相应的映像文件。回滚和恢复能力允许 MLOps 团队在需要时恢复到以前的模型版本。</p></li>
</ul>
<p>在生产应用中仅使用一个模型会带来许多困难的挑战。MLOps 是一种结构化、可重复的方法，它依靠工具、技术和最佳实践来克服机器学习模型生命周期中出现的技术或业务问题。成功的 MLOps 可以保持致力于构建、部署、监控、重新训练和管理人工智能模型及其在生产系统中的使用的团队的效率。</p>
<p><br/></p>
<h3 id="Why-is-MLOps-necessary" class="common-anchor-header">为什么需要 MLOps？</h3><p>正如上面的 ML 模型生命周期所描绘的那样，构建机器学习模型是一个迭代过程，涉及到纳入新数据、重新训练模型以及处理一般模型随时间推移而衰减的问题。这些都是传统的开发人员操作符或 DevOps 无法解决或提供解决方案的问题。MLOps 作为一种管理人工智能模型投资并确保模型生命周期富有成效的方式，已变得十分必要。由于机器学习模型将被各种不同的生产系统所利用，因此 MLOps 成为确保在不同环境和不同场景中满足要求不可或缺的一部分。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_403e7f2fe2.jpg" alt="02.jpg" class="doc-image" id="02.jpg" />
   </span> <span class="img-wrapper"> <span>02.jpg</span> </span></p>
<p><br/></p>
<p>上面的简单插图描述了在云环境中部署的机器学习模型，该模型将输入到一个应用程序中。在这个基本场景中，可能会出现一些问题，而 MLOps 可以帮助克服这些问题。由于生产应用依赖于特定的云环境，因此存在开发 ML 模型的数据科学家无法访问的延迟要求。对模型生命周期进行操作，将使对模型有深入了解的数据科学家或工程师有可能发现并排除特定生产环境中出现的问题。</p>
<p>机器学习模型不仅在不同于生产应用的环境中进行训练，而且还经常依赖于不同于生产应用中使用的数据的历史数据集。有了 MLOps，整个数据科学团队，从开发模型的人员到在应用层面工作的人员，都有了共享和请求信息与帮助的途径。数据和市场的变化速度使得所有关键利益相关者和贡献者之间必须尽可能减少摩擦，因为他们将依赖于特定的机器学习模型。</p>
<h3 id="Supporting-the-transition-to-Software-20" class="common-anchor-header">支持向软件 2.0 过渡</h3><p><a href="https://karpathy.medium.com/software-2-0-a64152b37c35">软件 2.0 的</a>理念是，随着人工智能在编写为软件应用程序提供动力的人工智能模型方面日益发挥核心作用，软件开发将经历模式转变。在软件 1.0 时代，开发工作涉及程序员使用特定的编程语言（如 Python、C++）编写明确的指令。软件 2.0 则抽象得多。虽然人们可以提供输入数据并设置参数，但由于神经网络的复杂性，人类很难理解神经网络--典型的神经网络包含数百万个影响结果的权重（有时甚至是数十亿或数万亿个权重）。</p>
<p>DevOps 是围绕软件 1.0 所建立的，依赖于程序员使用语言下达的特定指令，但从未考虑过为各种不同应用提供动力的机器学习模型的生命周期。MLOps 解决了管理软件开发过程的需求，使其与正在开发的软件一起发生变化。随着软件 2.0 成为基于计算机解决问题的新标准，拥有管理模型生命周期的正确工具和流程将决定新技术投资的成败。Milvus 是一个开源向量相似性搜索引擎，旨在支持向软件 2.0 过渡，并通过 MLOps 管理模型生命周期。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/03_c63c501995.jpg" alt="03.jpg" class="doc-image" id="03.jpg" />
   </span> <span class="img-wrapper"> <span>03.jpg</span> </span></p>
<p><br/></p>
<h3 id="Operationalizing-AI-at-scale-with-Milvus" class="common-anchor-header">利用 Milvus 大规模运营人工智能</h3><p>Milvus 是一个向量数据管理平台，专门用于存储、查询、更新和维护万亿规模的海量向量数据集。该平台支持向量相似性搜索，并能与广泛采用的索引库集成，包括 Faiss、NMSLIB 和 Annoy。通过将非结构化数据转换为向量的人工智能模型与 Milvus 配对，可以创建涵盖新药开发、生物识别分析、推荐系统等领域的应用。</p>
<p><a href="https://blog.milvus.io/vector-similarity-search-hides-in-plain-view-654f8152f8ab">向量相似性搜索</a>是非结构化数据数据处理和分析的首选解决方案，向量数据正迅速成为一种核心数据类型。像 Milvus 这样的综合数据管理系统在很多方面促进了人工智能的可操作性，包括</p>
<ul>
<li><p>为模型训练提供环境，确保在一个地方完成更多方面的开发，促进跨团队协作、模型治理等。</p></li>
<li><p>提供一套全面的 API，支持 Python、Java 和 Go 等流行框架，便于集成一套通用的 ML 模型。</p></li>
<li><p>与在浏览器中运行的 Jupyter 笔记本环境 Google Colaboratory 兼容，简化了从源代码编译 Milvus 和运行基本 Python 操作符的过程。</p></li>
<li><p>自动化机器学习（AutoML）功能使将机器学习应用于实际问题的相关任务自动化成为可能。AutoML 不仅能提高效率，还能让非专业人员利用机器学习模型和技术。</p></li>
</ul>
<p>无论您现在正在构建什么机器学习应用，或者您对未来的应用有什么计划，Milvus 都是一个灵活的数据管理平台，其创建时考虑到了软件 2.0 和 MLOps。要了解有关 Milvus 的更多信息或做出贡献，请在<a href="https://github.com/milvus-io">Github</a> 上查找该项目。要参与社区活动或提问，请加入我们的<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>频道。渴望了解更多内容？请查看以下资源：</p>
<ul>
<li><a href="https://milvus.io/blog/Milvus-Is-an-Open-Source-Scalable-Vector-Database.md">Milvus 是一个开源可扩展向量数据库</a></li>
<li><a href="https://milvus.io/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md">Milvus 专为大规模（万亿次）向量相似性搜索而设计</a></li>
<li><a href="https://milvus.io/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md">在 Google Colaboratory 中设置 Milvus，轻松构建 ML 应用程序</a></li>
</ul>
