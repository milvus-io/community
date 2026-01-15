---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: 对 ChatGPT 和克劳德记忆系统的思考：实现按需对话检索所需的条件
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: 探索 ChatGPT 和 Claude 如何以不同的方式设计内存，为什么按需对话检索很难，以及 Milvus 2.6 如何在生产规模上实现按需对话检索。
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>在高质量的人工智能 Agents 系统中，内存设计远比初见时复杂得多。其核心是必须回答三个基本问题：对话历史应该如何存储？何时检索过去的上下文？到底应该检索什么？</p>
<p>这些选择直接决定了 Agents 的响应延迟、资源使用以及最终的能力上限。</p>
<p>像 ChatGPT 和 Claude 这样的模型，我们用得越多，它们就越有 "记忆意识"。它们能记住偏好，适应长期目标，并在不同会话中保持连续性。从这个意义上说，它们已经具备了小型人工智能 Agents 的功能。然而，在表象之下，它们的记忆系统建立在截然不同的架构假设之上。</p>
<p>最近对<a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT</a>和<a href="https://manthanguptaa.in/posts/claude_memory/">克劳德的记忆机制</a>进行的逆向工程分析显示了一个明显的对比。<strong>ChatGPT</strong>依靠预先计算的上下文注入和分层缓存来提供轻量级、可预测的连续性。相比之下，<strong>Claude</strong>采用了 RAG 风格的按需检索和动态内存更新，以平衡内存深度和效率。</p>
<p>这两种方法不仅仅是设计上的偏好，它们是由基础架构能力决定的。<a href="https://milvus.io/docs/release_notes.md#v268"><strong>Milvus 2.6</strong></a>引入了按需会话内存所需的密集-稀疏混合检索、高效标量过滤和分层存储的组合，使得选择性检索足够快速和经济，可以部署在现实世界的系统中。</p>
<p>在这篇文章中，我们将介绍 ChatGPT 和 Claude 的内存系统究竟是如何工作的，它们在架构上产生分歧的原因，以及 Milvus 等系统的最新进展是如何使按需对话检索大规模实用化的。</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">ChatGPT 的记忆系统<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>ChatGPT 的 "记忆 "系统不是查询向量数据库，也不是在推理时动态检索过去的对话，而是通过组装一组固定的上下文组件，并将它们直接注入每个提示中。每个组件都提前准备好，并在提示中占据已知的位置。</p>
<p>这种设计保持了个性化和会话的连续性，同时使延迟、令牌使用和系统行为更具可预测性。换句话说，内存不是模型临时搜索的东西，而是系统每次生成响应时打包并交给模型的东西。</p>
<p>从高层来看，一个完整的 ChatGPT 提示由以下几层组成，顺序从最全局到最直接：</p>
<p>[0] 系统说明</p>
<p>[1] 开发人员说明</p>
<p>[2] 会话元数据（短暂数据）</p>
<p>[3] 用户记忆（长期事实）</p>
<p>[4] 最近对话摘要（过去的聊天记录、标题和片段）</p>
<p>[5] 当前会话消息（本次聊天）</p>
<p>[6] 您的最新信息</p>
<p>其中，[2]至[5]部分构成了系统的有效记忆，各自发挥着不同的作用。</p>
<h3 id="Session-Metadata" class="common-anchor-header">会话元数据</h3><p>会话元数据代表短暂、非持久的信息，在会话开始时注入一次，会话结束时丢弃。它的作用是帮助模型适应当前的使用环境，而不是长期个性化行为。</p>
<p>这一层捕捉有关用户周围环境和近期使用模式的信号。典型信号包括</p>
<ul>
<li><p><strong>设备信息</strong>--例如，用户使用的是手机还是台式机</p></li>
<li><p><strong>账户属性</strong>--如订阅层级（如 ChatGPT Go）、账户年龄和总体使用频率</p></li>
<li><p><strong>行为指标</strong>--包括过去 1 天、7 天和 30 天的活跃天数、平均对话长度和模型使用分布（例如，49% 的请求由 GPT-5 处理）</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">用户内存</h3><p>用户记忆是一个持久的、可编辑的记忆层，可实现跨对话的个性化。它存储相对稳定的信息，如用户的姓名、角色或职业目标、正在进行的项目、过去的成果和学习偏好，并注入到每次新对话中，以保持随着时间推移的连续性。</p>
<p>这种记忆可以通过两种方式进行更新：</p>
<ul>
<li><p><strong>显式更新</strong>是指用户通过 "记住这个 "或 "从记忆中删除这个 "等指令直接管理记忆。</p></li>
<li><p>当系统识别出符合 OpenAI 存储标准的信息（如已确认的姓名或职位）时，就会进行<strong>隐式更新</strong>，并根据用户的默认同意和内存设置自动保存。</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">最近对话摘要</h3><p>最近对话摘要是一个轻量级的跨会话上下文层，可保持连续性，而无需重播或检索完整的聊天历史记录。与传统的基于 RAG 的方法一样，该摘要不依赖于动态检索，而是预先计算并直接注入到每段新对话中。</p>
<p>该层只汇总用户信息，不包括助手回复。它有意限制了大小--通常约为 15 个条目--并且只保留有关最近兴趣的高级信号，而不是详细内容。由于它不依赖于 Embeddings 或相似性搜索，因此延迟和令牌消耗都很低。</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">当前会话消息</h3><p>当前会话消息包含正在进行的会话的完整消息历史记录，并提供了连贯、逐一回复所需的短期上下文。这一层包括用户输入和助手回复，但仅限于会话处于活动状态时。</p>
<p>由于该模型是在一个固定的令牌限制内操作的，因此该历史记录不能无限增长。当达到限制时，系统就会删除最早的信息，为较新的信息腾出空间。这种截断只影响当前会话：用户的长期记忆和最近的对话摘要保持不变。</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">克劳德的内存系统<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude 采用了一种不同的内存管理方法。克劳德没有像 ChatGPT 那样，在每个提示符中注入一大捆固定的内存组件，而是将持久用户内存与按需工具和选择性检索结合起来。只有当模型判断历史上下文相关时，才会对其进行检索，这样系统就能在上下文深度与计算成本之间进行权衡。</p>
<p>克劳德的提示上下文结构如下：</p>
<p>[0] 系统提示（静态指令）</p>
<p>[1] 用户记忆</p>
<p>[2] 对话历史</p>
<p>[3] 当前信息</p>
<p>Claude 和 ChatGPT 的主要区别在于<strong>如何检索对话历史</strong>以及<strong>如何更新和维护用户记忆</strong>。</p>
<h3 id="User-Memories" class="common-anchor-header">用户记忆</h3><p>在 Claude 中，用户记忆构成了一个长期上下文层，其目的与 ChatGPT 的用户记忆类似，但更强调后台驱动的自动更新。这些记忆以结构化格式存储（用 XML 样式的标签封装），旨在随着时间的推移逐渐发展，只需最少的用户干预。</p>
<p>Claude 支持两种更新路径：</p>
<ul>
<li><p><strong>隐式更新</strong>- 系统会定期分析对话内容，并在后台更新内存。这些更新不会实时应用，与已删除对话相关的内存会作为持续优化的一部分被逐步剪除。</p></li>
<li><p><strong>显式更新</strong>--用户可以通过专门的<code translate="no">memory_user_edits</code> 工具执行 "记住此内容 "或 "删除此内容 "等命令，直接管理内存。</p></li>
</ul>
<p>与 ChatGPT 相比，Claude 将完善、更新和修剪长期记忆的责任更多地交给了系统本身。这就减少了用户主动整理存储内容的需要。</p>
<h3 id="Conversation-History" class="common-anchor-header">对话历史</h3><p>在对话历史方面，Claude 并不依赖于每次提示都会注入的固定摘要。相反，只有当模型认为有必要时，它才会使用三种不同的机制检索过去的上下文。这就避免了将无关的历史向前推进，并使令牌的使用处于可控范围内。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>组件</strong></th><th style="text-align:center"><strong>目的</strong></th><th style="text-align:center"><strong>如何使用</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>滚动窗口（当前对话）</strong></td><td style="text-align:center">存储当前会话的完整消息历史记录（而非摘要），类似于 ChatGPT 的会话上下文。</td><td style="text-align:center">自动注入。令牌限制为 ~190K；一旦达到限制，旧消息将被删除</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>工具</strong></td><td style="text-align:center">按主题或关键词搜索过去的会话，返回会话链接、标题和用户/助手信息摘录</td><td style="text-align:center">当模型确定需要历史细节时触发。参数包括<code translate="no">query</code> （搜索条件）和<code translate="no">max_results</code> （1-10）</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>工具</strong></td><td style="text-align:center">检索指定时间范围内（例如 "过去 3 天"）的最近会话，结果格式与以下工具相同<code translate="no">conversation_search</code></td><td style="text-align:center">当最近的时间范围上下文相关时触发。参数包括<code translate="no">n</code> （结果数量）、<code translate="no">sort_order</code> 和时间范围。</td></tr>
</tbody>
</table>
<p>在这些组件中，<code translate="no">conversation_search</code> 尤其值得一提。它甚至可以为措辞松散或多语言查询提供相关结果，这表明它是在语义层面操作，而不是依赖简单的关键词匹配。这很可能涉及基于 Embeddings 的检索，或者是一种混合方法，首先将查询翻译或规范化为规范形式，然后应用关键词或混合检索。</p>
<p>总的来说，克劳德的按需检索方法有几个显著的优点：</p>
<ul>
<li><p><strong>检索不是自动的</strong>：工具调用是由模型自身的判断触发的。例如，当用户提到<em>"我们上次讨论过的项目 "时，</em>Claude 可能会决定调用<code translate="no">conversation_search</code> 来检索相关上下文。</p></li>
<li><p><strong>在需要时提供更丰富的上下文</strong>：检索结果可以包括<strong>助手的回复摘录</strong>，而 ChatGPT 的摘要只能捕捉用户信息。这使得 Claude 更适合需要更深入或更精确对话上下文的用例。</p></li>
<li><p><strong>默认情况下效率更高</strong>：由于除非需要，否则不会注入历史语境，因此系统可以避免携带大量无关的历史记录，从而减少不必要的令牌消耗。</p></li>
</ul>
<p>权衡利弊同样明显。按需检索会增加系统的复杂性：必须建立和维护索引，执行查询，对结果进行排序，有时还要重新排序。端到端延迟的可预测性也比预先计算、始终注入上下文的延迟要低。此外，模型还必须学会判断何时需要检索。如果判断失误，可能根本不会获取相关上下文。</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">克劳德式按需检索背后的制约因素<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>采用按需检索模型使向量数据库成为架构的关键部分。对话检索对存储和查询执行都提出了异常高的要求，系统必须同时满足四个限制条件。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1.低延迟容忍度</h3><p>在对话系统中，P99 延迟通常需要保持在 ~20 毫秒以下。超过 20 毫秒的延迟会立即被用户察觉。这就为低效率留下了很小的空间：向量搜索、元数据过滤和结果排序都必须仔细优化。任何一点出现瓶颈都会降低整个会话体验。</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2.混合搜索要求</h3><p>用户查询往往跨越多个维度。像<em>"过去一周关于 RAG 的讨论 "</em>这样的请求就结合了语义相关性和基于时间的过滤。如果数据库只支持向量搜索，那么它可能会返回 1000 个语义相似的结果，而应用层过滤只能将其减少到少数几个，从而浪费了大部分计算量。为了实用起见，数据库必须原生支持向量和标量组合查询。</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3.存储与计算分离</h3><p>对话历史记录表现出明显的冷热访问模式。最近的对话会被频繁查询，而较早的对话则很少被触及。如果所有向量都必须保留在内存中，那么存储数千万条会话将消耗数百 GB 的 RAM--这在规模上是不切实际的。为了保证可行性，系统必须支持存储-计算分离，将热数据保存在内存中，冷数据保存在对象存储中，并按需加载向量。</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4.多样的查询模式</h3><p>对话检索并不遵循单一的访问模式。有些查询是纯粹的语义查询（例如，<em>"我们讨论的性能优化"）</em>，其他查询是纯粹的时间查询（<em>"上周的所有对话"）</em>，还有很多查询结合了多个约束条件（<em>"过去三个月中提到 FastAPI 的 Python 相关讨论</em>"）。数据库查询规划器必须根据不同的查询类型调整执行策略，而不是依靠一刀切的强制搜索。</p>
<p>这四项挑战共同构成了会话检索的核心约束条件。任何试图实现克劳德式按需检索的系统都必须以协调的方式解决所有这些问题。</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">Milvus 2.6 为何能很好地用于对话检索<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.6</a>的设计选择与按需对话检索的核心要求密切相关。以下是关键功能的细分，以及它们如何与实际会话检索需求相匹配。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">密集向量和稀疏向量混合检索</h3><p>Milvus 2.6 本机支持在同一个 Collections 中存储密集向量和稀疏向量，并在查询时自动融合它们的结果。密集向量（例如由 BGE-M3 等模型生成的 768 维嵌入向量）捕捉语义相似性，而稀疏向量（通常由 BM25 生成）则保留精确的关键词信号。</p>
<p>对于<em>"上周有关 Rerankers 的讨论 "</em>这样的查询，Milvus 会并行执行语义检索和关键词检索，然后通过重新排序合并结果。与单独使用其中一种方法相比，这种混合策略在实际对话场景中的召回率要高得多。</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">存储-计算分离和查询优化</h3><p>Milvus 2.6 支持两种方式的分层存储：</p>
<ul>
<li><p>热数据在内存中，冷数据在对象存储中</p></li>
<li><p>索引在内存中，原始向量数据在对象存储中</p></li>
</ul>
<p>采用这种设计，大约只需 2 GB 内存和 8 GB 对象存储空间就能存储 100 万个对话条目。通过适当调整，即使启用存储-计算分离，P99 延迟也能保持在 20 毫秒以下。</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">JSON 粉碎和快速标量过滤</h3><p>Milvus 2.6 默认启用 JSON 粉碎功能，将嵌套的 JSON 字段扁平化为列式存储。根据官方基准测试，这可将标量过滤性能提高 3-5倍（实际提高因查询模式而异）。</p>
<p>对话检索通常需要通过用户 ID、会话 ID 或时间范围等元数据进行过滤。有了 JSON Shredding，像<em>"过去一周用户 A 的所有对话 "</em>这样的查询可以直接在列式索引上执行，而无需重复解析完整的 JSON blob。</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">开源控制和操作符灵活性</h3><p>作为一个开源系统，Milvus 提供了封闭式黑盒解决方案所不具备的架构和操作符控制能力。团队可以调整索引参数，应用数据分层策略，并定制分布式部署以匹配其工作负载。</p>
<p>这种灵活性降低了入门门槛：中小型团队无需依赖过高的基础设施预算，即可构建百万到千万级规模的对话检索系统。</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">为什么 ChatGPT 和 Claude 走不同的道路<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>从根本上说，ChatGPT 和 Claude 记忆系统的区别在于各自如何处理遗忘。ChatGPT 倾向于主动遗忘：一旦内存超过固定限制，旧的上下文就会被丢弃。这就以完整性换取了简单性和可预测的系统行为。克劳德倾向于延迟遗忘。从理论上讲，对话历史可以无限制地增长，并委托按需检索系统进行回忆。</p>
<p>那么，为什么这两个系统会选择不同的路径呢？有了上文所述的技术限制，答案就显而易见了：<strong>只有在底层基础设施能够支持的情况下，每种架构才是可行的</strong>。</p>
<p>如果在 2020 年尝试克劳德的方法，很可能是不切实际的。当时，向量数据库经常会产生数百毫秒的延迟，混合查询的支持也很差，而且随着数据的增长，资源使用量的扩展也令人望而却步。在这种情况下，按需检索会被认为是过度设计。</p>
<p>到 2025 年，情况已经发生了变化。在<strong>Milvus 2.6</strong>等系统的推动下，基础设施取得了进步，使存储与计算分离、查询优化、密集-稀疏混合检索和 JSON 切碎在生产中变得可行。这些进步降低了延迟、控制了成本，并使大规模选择性检索成为现实。因此，按需工具和基于检索的内存不仅变得可行，而且越来越有吸引力，尤其是作为 Agents 类型系统的基础。</p>
<p>归根结底，架构的选择取决于基础设施是否可行。</p>
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
    </button></h2><p>在现实世界的系统中，内存设计并不是预计算上下文和按需检索之间的二元选择。最有效的架构通常是混合型的，将两种方法结合在一起。</p>
<p>一种常见的模式是通过滑动上下文窗口注入最近的对话内容，将稳定的用户偏好存储为固定内存，并通过向量搜索按需检索较早的历史记录。随着产品的成熟，这种平衡可以逐渐改变--从主要采用预计算上下文到越来越多地采用检索驱动--而不需要进行破坏性的架构重置。</p>
<p>即使开始采用预计算方法，在设计时也必须考虑到迁移问题。内存的存储应有明确的标识符、时间戳、类别和来源参考。当检索变得可行时，可以为现有内存生成 Embeddings，并将其与相同的元数据一起添加到向量数据库中，从而以最小的干扰逐步引入检索逻辑。</p>
<p>对最新 Milvus 的任何功能有疑问或想深入了解？加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus">GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> 预订 20 分钟的一对一课程，以获得见解、指导和问题解答。</p>
