---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: 我们获得 35K+ GitHub Stars 的旅程：从零开始创建 Milvus 的真实故事
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: 与我们一起庆祝向量数据库 Milvus 在 GitHub 上获得 35.5K颗星。了解我们的故事以及我们如何让开发人员更轻松地使用人工智能解决方案。
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>在过去的几年里，我们一直专注于一件事：为人工智能时代构建企业级向量数据库。最难的部分并不是建立<em>一个</em>数据库，而是建立一个可扩展、易于使用并能真正解决生产中实际问题的数据库。</p>
<p>今年六月，我们达到了一个新的里程碑：Milvus<a href="https://github.com/milvus-io/milvus">在 GitHub 上的星级数</a>达到<a href="https://github.com/milvus-io/milvus">35,000 个</a>（截至发稿时，星级数已超过 35.5K）。我们不会假装这只是一个数字，它对我们意义重大。</p>
<p>每一颗星都代表着一位开发者花时间查看了我们的构建，觉得它非常有用，于是将其加入书签，并在很多情况下决定使用它。你们中的一些人走得更远：提交问题、贡献代码、在我们的论坛上回答问题，以及在其他开发人员遇到困难时提供帮助。</p>
<p>我们希望花一点时间分享我们的故事--真实的故事，包括所有混乱的部分。</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">我们开始构建 Milvus 是因为其他方法都行不通<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>回到 2017 年，我们从一个简单的问题开始：随着人工智能应用开始兴起，非结构化数据呈爆炸式增长，如何高效地存储和搜索支持语义理解的向量嵌入？</p>
<p>传统数据库并非为此而生。它们针对行和列进行了优化，而不是高维向量。现有的技术和工具要么无法满足我们的需求，要么速度慢得令人痛苦。</p>
<p>我们尝试了所有可用的方法。使用 Elasticsearch 自行设计解决方案。在 MySQL 的基础上构建自定义索引。甚至还尝试了 FAISS，但它只是一个研究图书馆，而不是生产数据库基础设施。没有什么能为我们设想的企业人工智能工作负载提供完整的解决方案。</p>
<p><strong>于是，我们开始构建自己的数据库。</strong>这并不是因为我们认为这很容易--数据库是出了名的难搞，而是因为我们看到了人工智能的发展方向，并知道它需要专门构建的基础架构才能实现。</p>
<p>到 2018 年，我们深入开发了后来的<a href="https://milvus.io/">Milvus</a>。当时甚至还没有<strong>&quot;向量数据库</strong>&quot;这个词。我们本质上是在创造一种新的基础架构软件，这既令人兴奋，又令人恐惧。</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">开源 Milvus：在公众中构建<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>2019 年 11 月，我们决定开源 Milvus 0.10 版本。</p>
<p>开源意味着向全世界暴露自己的所有缺陷。每一个黑客攻击、每一个 TODO 注释、每一个你不完全确定的设计决策。但我们相信，如果向量数据库要成为人工智能的关键基础设施，就必须向所有人开放和开放。</p>
<p>反响非常热烈。开发人员不仅使用了 Milvus，还对它进行了改进。他们发现了我们遗漏的错误，提出了我们没有考虑到的功能，还提出了一些问题，让我们对自己的设计选择进行了更深入的思考。</p>
<p>2020 年，我们加入了<a href="https://lfaidata.foundation/">LF 人工智能与数据基金会</a>。这不仅仅是为了信誉，它还教会了我们如何维护一个可持续的开源项目。如何处理管理、向后兼容性，以及如何构建可持续数年而非数月的软件。</p>
<p>到 2021 年，我们发布了 Milvus 1.0，并<a href="https://lfaidata.foundation/projects/milvus/">从 LF AI &amp; Data Foundation 毕业</a>。同年，我们赢得了<a href="https://big-ann-benchmarks.com/neurips21.html">BigANN 全球</a>十亿规模向量搜索<a href="https://big-ann-benchmarks.com/neurips21.html">挑战赛</a>。这次胜利让我们感觉良好，但更重要的是，它证明了我们正在以正确的方式解决实际问题。</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">最艰难的决定重新开始<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>事情变得复杂了。到 2021 年，Milvus 1.0 在许多用例中都运行良好，但企业客户不断提出同样的要求：更好的云原生架构、更轻松的水平扩展、更简单的操作符。</p>
<p>我们必须做出选择：是修修补补继续前进，还是从头开始重建。我们选择了重建。</p>
<p>Milvus 2.0 本质上是一次彻底的重写。我们引入了具有动态可扩展性的完全解耦存储-计算架构。我们花了两年时间，这也是公司历史上压力最大的时期之一。我们放弃了成千上万人正在使用的工作系统，去构建一个未经验证的系统。</p>
<p><strong>但是，当我们在2022年发布Milvus 2.0时，它将Milvus从一个功能强大的向量数据库转变为可扩展至企业工作负载的生产就绪基础设施。</strong>同年，我们还完成了<a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">B+ 轮融资--不是</a>为了烧钱，而是为了加倍提高产品质量和对全球客户的支持。我们知道这条道路需要时间，但每一步都必须建立在坚实的基础之上。</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">人工智能让一切加速<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023 年是<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>（检索增强生成）之年。突然之间，语义搜索从一种有趣的人工智能技术变成了聊天机器人、文档问答系统和人工智能 Agents 的重要基础设施。</p>
<p>Milvus 的 GitHub 星级骤增。支持请求成倍增加。从未听说过向量数据库的开发人员突然提出了关于索引策略和查询优化的复杂问题。</p>
<p>这种增长令人兴奋，但也令人难以承受。我们意识到，我们需要扩展的不仅仅是我们的技术，还有我们的整个社区支持方法。我们聘请了更多的开发人员支持者，完全重写了我们的文档，并开始为刚接触向量数据库的开发人员创建教育内容。</p>
<p>我们还推出了<a href="https://zilliz.com/cloud">Zilliz Cloud--</a>Milvus 的完全托管版本。有人问我们为什么要将开源项目 "商业化"。诚实的回答是，维护企业级基础设施既昂贵又复杂。Zilliz Cloud 允许我们在保持核心项目完全开源的同时，维持并加速 Milvus 的开发。</p>
<p>然后到了 2024 年。<a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forrester 将我们评为</strong></a> <strong>向量数据库类别的</strong> <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>领导者</strong></a> <strong>。</strong>Milvus 在 GitHub 上的星级突破了 30,000 个。<strong>我们意识到：我们铺设了七年的道路终于变成了高速公路。</strong>随着越来越多的企业采用向量数据库作为关键基础设施，我们的业务增长迅速加快--这验证了我们建立的基础可以在技术上和商业上进行扩展。</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">Milvus 背后的团队：Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>有趣的是：很多人都知道 Milvus，却不知道 Zilliz。事实上，我们对此很满意。<a href="https://zilliz.com/"><strong>Zilliz</strong></a> <strong>是 Milvus 背后的团队，我们负责构建、维护和支持。</strong></p>
<p>我们最关心的是那些不显眼的东西，这些东西决定了很酷的演示与生产就绪的基础架构之间的区别：性能优化、安全补丁、对初学者有实际帮助的文档，以及对 GitHub 问题的周到响应。</p>
<p>我们在美国、欧洲和亚洲建立了全天候的全球支持团队，因为开发人员需要的是在他们的时区而不是我们的时区提供的帮助。我们拥有被称为<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">&quot;Milvus 大使</a>&quot;的社区贡献者，他们组织活动、回答论坛问题，而且经常比我们更好地解释概念。</p>
<p>我们也欢迎与 AWS、GCP 和其他云提供商集成--即使他们提供自己管理版本的 Milvus。更多的部署选项对用户有好处。我们注意到，当团队遇到复杂的技术挑战时，他们往往会直接联系我们，因为我们对系统有最深入的了解。</p>
<p>很多人认为开源只是一个 &quot;工具箱&quot;，但它实际上是一个 &quot;进化过程&quot;--是无数热爱并相信开源的人的集体努力。只有真正了解架构的人才能提供错误修复、性能瓶颈分析、数据系统整合和架构调整背后的 "原因"。</p>
<p><strong>因此，如果您正在使用开源 Milvus，或考虑将向量数据库作为人工智能系统的核心组件，我们鼓励您直接联系我们，以获得最专业、最及时的支持。</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">生产中的实际影响：来自用户的信任<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 的用例已经超出了我们最初的想象。我们正在为全球各行各业一些要求最苛刻的企业提供人工智能基础设施。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_66d3adfe97.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>zilliz 客户.png</span> </span></p>
<p><a href="https://zilliz.com/customers/bosch"><strong>博世</strong></a>，全球汽车技术领导者和自动驾驶领域的先驱，使用 Milvus 彻底改变了他们的数据分析，实现了数据收集成本降低 80%，每年节省 140 万美元，同时在毫秒级时间内搜索数十亿个驾驶场景，以寻找关键边缘案例。</p>
<p><a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a> 是增长最快的生产力人工智能公司之一，为数百万月活跃用户提供服务，该公司使用 Milvus 实现了数十亿条记录的检索延迟低于 20-50 毫秒，代理搜索速度提高了 5 倍。他们的首席技术官说："Milvus 作为中央存储库，为我们在数十亿条记录中进行信息检索提供了动力。"</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>一家全球金融技术领先企业</strong></a>是世界上最大的数字支付平台之一，处理着 200 多个国家和 25 种以上货币的数百亿笔交易，该企业选择 Milvus 的原因是其批量摄取速度比竞争对手快 5-10 倍，在 1 小时内完成了其他企业需要 8 小时以上才能完成的工作。</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a>是全美数千家律师事务所信赖的领先法律工作平台，管理着数百万法律文件中的30亿个向量，为律师节省了60-80%的文件分析时间，实现了法律案件管理的 "真正数据意识"。</p>
<p>我们还为<strong>英伟达、OpenAI、微软、Salesforce、沃尔玛</strong>以及几乎所有行业的其他许多公司提供支持。超过 10,000 家组织已将 Milvus 或 Zilliz Cloud 作为其向量数据库的首选。</p>
<p>这些不仅仅是技术上的成功故事，它们还是向量数据库如何悄然成为关键基础设施的范例，为人们日常使用的人工智能应用提供动力。</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">我们为什么要构建 Zilliz Cloud？企业级向量数据库即服务<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是开源的，可以免费使用。但是，要在企业级规模上很好地运行 Milvus，需要深厚的专业知识和大量资源。索引选择、内存管理、扩展策略、安全配置--这些都不是微不足道的决定。许多团队希望拥有 Milvus 的强大功能，但又不希望操作复杂，同时还需要企业支持、SLA 保证等。</p>
<p>这就是我们构建<a href="https://zilliz.com/cloud">Zilliz Cloud</a>的原因<a href="https://zilliz.com/cloud">--</a>Milvus 的完全托管版本，部署在全球 25 个地区和 5 个主要云（包括 AWS、GCP 和 Azure）上，专为要求性能、安全性和可靠性的企业级 AI 工作负载而设计。</p>
<p>以下是 Zilliz Cloud 的与众不同之处：</p>
<ul>
<li><p><strong>大规模、高性能：</strong>我们专有的由人工智能驱动的 AutoIndex 引擎可提供比开源 Milvus 快 3-5 倍的查询速度，并且无需调整索引。云原生架构支持数十亿向量和数万次并发查询，同时保持亚秒级响应时间。</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>内置安全性与合规性</strong></a><strong>：</strong>静态和传输中加密、细粒度 RBAC、全面审计日志、SAML/OAuth2.0 集成和<a href="https://zilliz.com/bring-your-own-cloud">BYOC</a>（自带云）部署。我们符合 GDPR、HIPAA 和其他企业实际需要的全球标准。</p></li>
<li><p><strong>优化成本效益：</strong>分层冷/热数据存储、响应实际工作负载的弹性扩展以及即用即付的定价方式，可将总拥有成本降低 50%，甚至更多。</p></li>
<li><p><strong>真正的云无关性，无供应商锁定：</strong>在 AWS、Azure、GCP、阿里云或腾讯云上部署，无需锁定供应商。无论您在哪里运行，我们都能确保全球一致性和可扩展性。</p></li>
</ul>
<p>这些功能听起来可能并不华丽，但它们解决了企业团队在大规模构建人工智能应用时面临的实际日常问题。最重要的是：引擎盖下仍然是 Milvus，因此不存在专有锁定或兼容性问题。</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">下一步：向量数据湖<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>我们创造了<a href="https://zilliz.com/learn/what-is-vector-database">&quot;向量数据库</a>&quot;这一术语，并率先构建了<a href="https://zilliz.com/learn/what-is-vector-database">&quot;向量数据库</a>&quot;，但我们不会止步于此。我们现在正在构建下一个发展阶段：<strong>向量数据湖。</strong></p>
<p><strong>我们要解决的问题是：并非每次向量搜索都需要毫秒级的延迟。</strong>许多企业都有偶尔查询的海量数据集，包括历史文档分析、批量相似性计算和长期趋势分析。对于这些用例，传统的实时向量数据库既过剩又昂贵。</p>
<p>向量数据湖采用存储-计算分离的架构，专门针对大规模、非频繁访问的向量进行了优化，同时使成本大大低于实时系统。</p>
<p><strong>核心功能包括</strong></p>
<ul>
<li><p><strong>统一数据栈：</strong>以一致的格式和高效的存储无缝连接在线和离线数据层，因此您可以在热层和冷层之间迁移数据，而无需重新格式化或进行复杂的迁移。</p></li>
<li><p><strong>兼容的计算生态系统：</strong>可与 Spark 和 Ray 等框架原生配合使用，支持从向量搜索到传统 ETL 和分析的所有功能。这意味着您现有的数据团队可以使用他们熟悉的工具处理向量数据。</p></li>
<li><p><strong>成本优化的架构：</strong>热数据保留在 SSD 或 NVMe 上，以便快速访问；冷数据自动转移到 S3 等对象存储上。智能索引和存储策略可在需要时保持快速 I/O，同时使存储成本可预测且经济实惠。</p></li>
</ul>
<p>这并不是要取代向量数据库，而是要为企业的每种工作负载提供合适的工具。为面向用户的应用提供实时搜索，为分析和历史处理提供经济高效的向量数据湖。</p>
<p>我们仍然相信摩尔定律和杰文斯悖论背后的逻辑：随着计算单位成本的下降，采用的规模也会扩大。这同样适用于向量基础设施。</p>
<p>通过日复一日地改进索引、存储结构、缓存和部署模型，我们希望让每个人都能更方便、更经济地使用人工智能基础架构，并帮助非结构化数据进入人工智能原生的未来。</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">衷心感谢大家<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>这 35K+颗星代表着我们由衷的自豪：开发者社区认为 Milvus 非常有用，值得推荐和贡献。</p>
<p>但我们还没有完成。Milvus 还有很多错误需要修复，性能需要改进，还有我们的社区一直要求的功能。我们的路线图是公开的，我们真诚地希望您能就优先考虑的功能提出意见。</p>
<p>数字本身并不重要，重要的是这些星星所代表的信任。请相信，我们将继续在开放中建设，继续倾听反馈，继续让 Milvus 变得更好。</p>
<ul>
<li><p><strong>致我们的贡献者：</strong>你们的 PR、错误报告和文档改进让 Milvus 日臻完善。非常感谢你们。</p></li>
<li><p><strong>致我们的用户：</strong>感谢你们对我们的信任，让我们能够承担你们的生产工作，感谢你们的反馈让我们保持诚实。</p></li>
<li><p><strong>致我们的社区：</strong>感谢你们回答问题、组织活动并帮助新人入门。</p></li>
</ul>
<p>如果您是向量数据库的新手，我们很乐意帮助您入门。如果您已经在使用 milvus 或 Zilliz Cloud，我们很乐意<a href="https://zilliz.com/share-your-story">听听您的经验</a>。如果您只是对我们正在构建的东西感到好奇，我们的社区频道始终是开放的。</p>
<p>让我们一起继续建设让人工智能应用成为可能的基础设施。</p>
<hr>
<p>在这里找到我们：<a href="https://github.com/milvus-io/milvus">GitHub 上的 Milvus</a>|<a href="https://zilliz.com/"> Zilliz Cloud</a>|<a href="https://discuss.milvus.io/"> Discord</a>|<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>|<a href="https://x.com/zilliz_universe">X</a>|<a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
