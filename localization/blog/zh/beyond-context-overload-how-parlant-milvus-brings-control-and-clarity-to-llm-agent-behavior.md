---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: 超越语境超载：Parlant × Milvus 如何为 LLM Agents 行为带来控制力和清晰度
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_466dc0fe21.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: 了解 Parlant × Milvus 如何利用排列模型和向量智能使 LLM 代理行为可控、可解释并可投入生产。
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>想象一下，你被要求完成一项涉及 200 个业务规则、50 个工具和 30 个演示的任务，而你只有一个小时的时间来完成。这根本不可能。然而，当我们把大型语言模型变成 "Agent"，并给它们加载过多指令时，我们往往期望它们能够做到这一点。</p>
<p>实际上，这种方法很快就会失败。传统的 Agents 框架（如 LangChain 或 LlamaIndex）会一次性将所有规则和工具注入模型的上下文中，从而导致规则冲突、上下文过载以及生产中不可预测的行为。</p>
<p>为了解决这个问题，一个名为<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a>的开源 Agents 框架最近在 GitHub 上受到了越来越多的关注。它引入了一种名为 "对齐模型"（Alignment Modeling）的新方法，以及监督机制和条件转换，使代理行为的可控性和可解释性大大提高。</p>
<p>如果与开源向量数据库<a href="https://milvus.io/"><strong>Milvus</strong></a> 搭配使用，Parlant 的功能将更加强大。Milvus 增加了语义智能，允许 Agents 实时动态检索最相关的规则和上下文，使其保持准确、高效，并为生产做好准备。</p>
<p>在这篇文章中，我们将探讨 Parlant 如何在暗中工作--以及如何将其与 Milvus 集成，实现生产级功能。</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">传统 Agents 框架为何分崩离析<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>传统的 Agents 框架喜欢大而全：数百条规则、数十种工具和少量演示--所有这些都塞进了一个拥挤不堪的提示中。这在演示或小型沙盒测试中可能看起来不错，但一旦将其推向生产，裂缝就会迅速显现。</p>
<ul>
<li><p><strong>冲突的规则带来混乱：</strong>当两个或两个以上的规则同时适用时，这些框架没有内置的方法来决定哪一个获胜。有时它会选择其中一个。有时会混合两种规则。有时，它还会做一些完全无法预测的事情。</p></li>
<li><p><strong>边缘案例暴露漏洞：</strong>你不可能预测用户可能说的每一句话。而当你的模型遇到训练数据之外的情况时，它就会默认为通用的、不置可否的答案。</p></li>
<li><p><strong>调试既痛苦又昂贵：</strong>当 Agents 出现异常时，几乎不可能确定是哪条规则导致了问题。由于所有问题都集中在一个巨大的系统提示符中，修复问题的唯一方法就是重写提示符，然后从头开始重新测试。</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">什么是 Parlant 及其工作原理<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant 是 LLM 代理的开源对齐引擎。通过以结构化、基于规则的方式为 Agents 的决策过程建模，您可以精确控制 Agents 在不同场景中的行为方式。</p>
<p>为了解决传统 Agents 框架中存在的问题，Parlant 引入了一种新的强大方法：<strong>对齐模型</strong>。其核心理念是将规则定义与规则执行分离开来，确保在任何给定时间内，只有最相关的规则才会被注入到 LLM 的上下文中。</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">细化指南：对齐模型的核心</h3><p>Parlant 对齐模型的核心是 "<strong>细化指南"（Granular Guidelines</strong>）概念。与其编写一个充满规则的巨型系统提示，不如定义小型、模块化的指导原则--每条指导原则都描述了代理应如何处理特定类型的情况。</p>
<p>每条准则由三部分组成：</p>
<ul>
<li><p><strong>条件</strong>--规则适用时间的自然语言描述。Parlant 将条件转换为语义向量，并将其与用户输入相匹配，以确定是否相关。</p></li>
<li><p><strong>操作</strong>--明确的指令，定义一旦条件满足，Agent 应如何做出反应。该操作只有在触发时才会注入 LLM 的上下文。</p></li>
<li><p><strong>工具</strong>- 与特定规则相关的任何外部函数或 API。只有当准则处于活动状态时，代理才会接触到这些工具，从而保持工具使用的可控性和上下文感知性。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>每次用户与 Agents 交互时，Parlant 都会运行一个轻量级匹配步骤，找出三到五个最相关的准则。只有这些规则才会注入到模型的上下文中，从而使提示简洁明了、重点突出，同时确保 Agents 始终遵循正确的规则。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">确保准确性和一致性的监督机制</h3><p>为了进一步保持准确性和一致性，Parlant 引入了一种<strong>监督机制</strong>，作为第二层质量控制。这一过程分为三个步骤：</p>
<p><strong>1.生成候选回复</strong>--Agent 根据匹配的准则和当前对话语境创建初始回复。</p>
<p><strong>2.检查合规性</strong>--将回复与活动指南进行比较，以验证是否正确遵循了每一条指令。</p>
<p><strong>3.修改或确认</strong>--如果发现任何问题，系统会纠正输出；如果一切正常，回复会被批准并发送给用户。</p>
<p>这种监督机制确保 Agents 不仅理解规则，而且在回复前切实遵守规则--既提高了可靠性，又增强了控制力。</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">控制和安全的条件转换</h3><p>在传统 Agents 框架中，所有可用工具都会随时暴露给 LLM。这种 "一切都摆在桌面上 "的方法往往会导致过载提示和意外的工具调用。Parlant 通过<strong>条件转换</strong>解决了这一问题。与状态机的工作原理类似，只有在满足特定条件时，才会触发操作或工具。每个工具都与相应的准则紧密相连，只有当该准则的条件被激活时，工具才会可用。</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>这种机制将工具调用转化为条件转换--只有当工具的触发条件得到满足时，工具才会从 "非活动 "状态转为 "活动 "状态。通过这种结构化的执行方式，Parlant 可以确保每项操作都是经过深思熟虑并根据具体情况进行的，从而在提高效率和系统安全性的同时防止误用。</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Milvus 如何为 Parlant 提供动力<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>当我们深入了解 Parlant 的指南匹配流程时，一个核心技术挑战变得清晰可见：系统如何在几毫秒内从数百甚至数千个选项中找出三到五个最相关的规则？这正是向量数据库的用武之地。语义检索使这成为可能。</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Milvus如何支持Parlant的指南匹配流程</h3><p>指南匹配是通过语义相似性实现的。每条准则的 "条件 "字段都会被转换为向量嵌入，从而捕捉其含义，而不仅仅是字面文本。当用户发送信息时，Parlant 会将该信息的语义与所有存储的指南嵌入进行比较，以找出最相关的指南。</p>
<p>以下是整个过程的具体步骤：</p>
<p><strong>1.对查询进行编码</strong>--将用户的信息和最近的对话历史转化为查询向量。</p>
<p><strong>2.搜索相似性</strong>--系统在指南向量存储区内执行相似性搜索，以找到最接近的匹配项。</p>
<p><strong>3.检索 Top-K 结果</strong>- 返回语义最相关的前三到五个指南。</p>
<p><strong>4.插入上下文</strong>--然后将这些匹配的指南动态插入 LLM 的上下文中，以便模型能够根据正确的规则行事。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>要实现这一工作流程，向量数据库必须具备三个关键能力：高性能近似近邻（ANN）搜索、灵活的元数据过滤和实时向量更新。开源云原生向量数据库<a href="https://milvus.io/"><strong>Milvus</strong></a> 在这三个方面都能提供生产级性能。</p>
<p>为了了解 Milvus 在实际场景中的工作原理，我们以一个金融服务 Agents 为例。</p>
<p>假设系统定义了 800 项业务指南，涵盖账户查询、资金转账和财富管理产品咨询等任务。在此设置中，Milvus 充当所有指南数据的存储和检索层。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>现在，当用户说 "我想向我母亲的账户转账 10 万元人民币 "时，运行时的流程是</p>
<p><strong>1.对查询进行重校</strong>--将用户输入转换为 768 维向量。</p>
<p><strong>2.混合检索</strong>- 在 Milvus 中运行向量相似性检索，并进行元数据过滤（如<code translate="no">business_domain=&quot;transfer&quot;</code> ）。</p>
<p><strong>3.结果排序</strong>- 根据相似性得分和<strong>优先级</strong>值对候选指南进行排序。</p>
<p><strong>4.上下文注入</strong>--将前 3 个匹配指南的<code translate="no">action_text</code> 注入 Parlant 代理的上下文。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在这种配置下，即使指南库扩展到 10 万个条目，Milvus 的 P99 延迟也能低于 15 毫秒。相比之下，使用传统关系数据库进行关键字匹配时，延迟时间通常超过 200 毫秒，匹配准确率也会大大降低。</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Milvus 如何实现长期记忆和个性化</h3><p>Milvus 所做的不仅仅是指南匹配。在代理需要长期记忆和个性化响应的场景中，Milvus 可以充当记忆层，以向量嵌入的形式存储和检索用户过去的互动，帮助代理记住之前讨论的内容。</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>当同一个用户再次访问时，Agent 可以从 Milvus 中检索出最相关的历史互动，并利用这些互动生成联系更紧密、类似人类的体验。例如，如果用户上周询问了投资基金的情况，Agent 就能回忆起当时的上下文，并主动做出回应："欢迎回来！您对我们上次讨论的基金还有问题吗？</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">如何优化 Milvus 驱动的 Agents 系统性能</h3><p>在生产环境中部署由 Milvus 支持的 Agents 系统时，性能调整变得至关重要。要实现低延迟和高吞吐量，需要注意几个关键参数：</p>
<p><strong>1.选择正确的索引类型</strong></p>
<p>选择合适的索引结构非常重要。例如，HNSW（Hierarchical Navigable Small World，分层导航小世界）是金融或医疗保健等高调用场景的理想选择，在这些场景中，准确性至关重要。IVF_FLAT 则更适合电子商务推荐等大规模应用，在这些应用中，可以接受稍低的召回率来换取更快的性能和更少的内存使用。</p>
<p><strong>2.分片策略</strong></p>
<p>当存储的指南条目数超过一百万时，建议使用<strong>分区（Partition</strong>）按业务领域或用例划分数据。分区可以减少每次查询的搜索空间，提高检索速度，并在数据集增长时保持稳定的延迟。</p>
<p><strong>3.缓存配置</strong></p>
<p>对于频繁访问的准则，如标准客户查询或高流量工作流，可以使用 Milvus 查询结果缓存。这允许系统重复使用以前的结果，将重复搜索的延迟时间缩短到 5 毫秒以下。</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">实践演示：如何使用 Parlant 和 Milvus Lite 构建智能问答系统<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Lite</a>是 Milvus 的轻量级版本，它是一个 Python 库，可以轻松嵌入到您的应用程序中。它非常适合在 Jupyter Notebooks 等环境中进行快速原型开发，或在计算资源有限的边缘设备和智能设备上运行。尽管 Milvus Lite 占用空间小，但它支持与 Milvus 其他部署相同的 API。这意味着您为 Milvus Lite 编写的客户端代码以后可以无缝连接到完整的 Milvus 或 Zilliz Cloud 实例--无需重构。</p>
<p>在本演示中，我们将把 Milvus Lite 与 Parlant 结合使用，演示如何构建一个智能问答系统，以最少的设置提供快速、上下文感知的答案。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件： 1.Parlant GitHub</h3><p>1.帕兰特 GitHub： https://github.com/emcie-co/parlant</p>
<p>2.Parlant 文档： https://parlant.io/docs</p>
<p>3.python3.10以上</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">第 1 步：安装依赖项</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">第 2 步：配置环境变量</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">第 3 步：执行核心代码</h3><ul>
<li>创建自定义 OpenAI 嵌入器</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>初始化知识库</li>
</ul>
<p>1.创建一个名为 kb_articles 的 Collections。</p>
<p>2.插入样本数据（如退款政策、换货政策、发货时间）。</p>
<p>3.建立一个 HNSW 索引，以加速检索。</p>
<ul>
<li>构建向量搜索工具</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>配置 Parlant Agents</li>
</ul>
<p><strong>指导原则 1：</strong>对于事实或政策相关问题，Agent 必须首先执行向量搜索。</p>
<p><strong>准则 2：</strong>找到证据后，Agent 必须使用结构化模板（摘要+要点+来源）进行回复。</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>编写完整代码</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">第 4 步：运行代码</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>访问 Playground：</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>现在，您已经使用 Parlant 和 Milvus 成功构建了一个智能问答系统。</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant 与 LangChain/LlamaIndex 的对比：它们的区别和协同工作方式<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>与<strong>LangChain</strong>或<strong>LlamaIndex</strong> 等现有 Agents 框架相比，Parlant 有何不同？</p>
<p>LangChain 和 LlamaIndex 是通用框架。它们提供广泛的组件和集成，是快速原型开发和研究实验的理想选择。但是，当需要在生产中部署时，开发人员往往需要自己构建额外的层，如规则管理、合规性检查和可靠性机制，以保持 Agents 的一致性和可信度。</p>
<p>Parlant 提供内置准则管理、自我批评机制和可解释性工具，帮助开发人员管理 Agents 的行为、响应和原因。这使得 Parlant 特别适用于金融、医疗保健和法律服务等准确性和责任性要求较高、面向客户的使用案例。</p>
<p>事实上，这些框架可以协同工作：</p>
<ul>
<li><p>使用 LangChain 构建复杂的数据处理管道或检索工作流。</p></li>
<li><p>使用 Parlant 管理最终交互层，确保输出遵循业务规则并保持可解释性。</p></li>
<li><p>使用 Milvus 作为向量数据库基础，在整个系统中提供实时语义搜索、记忆和知识检索。</p></li>
</ul>
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
    </button></h2><p>随着 LLM Agents 从实验走向生产，关键问题不再是它们能做什么，而是如何可靠、安全地完成任务。Parlant 为这种可靠性提供了结构和控制，而 Milvus 则提供了可扩展的向量基础架构，使一切都保持快速和上下文感知。</p>
<p>两者结合在一起，开发人员就能构建出不仅有能力，而且值得信赖、可解释并可投入生产的人工智能 Agents。</p>
<p>🚀<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> 在 GitHub 上</a>查看<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant</a>，并将其与<a href="https://milvus.io"> Milvus</a>集成，构建自己的智能、规则驱动的 Agents 系统。</p>
<p>有问题或想深入了解任何功能？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
