---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: RoboBrain 如何通过 Milvus 建立机器人的长期记忆
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: 机器人模块可以单独工作，但串联起来就会失灵。Senqi AI 的首席执行官解释了 RoboBrain 如何使用任务状态、反馈和 Milvus 内存。
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>这篇文章的作者是森启人工智能公司（Senqi AI）的首席执行官宋志，森启人工智能是一家为机器人构建任务执行基础设施的人工智能公司。RoboBrain 是 Senqi AI 的核心产品之一。</em></p>
<p>大多数机器人功能都能独立运行。导航模型可以规划路线。感知模型可以识别物体。语音模块可以接受指令。当这些功能必须作为一项连续任务运行时，生产故障就会出现。</p>
<p>对于机器人来说，"去检查那个区域，拍下任何异常情况并通知我 "这样的简单指令需要在任务开始前进行规划，在运行过程中进行调整，并在任务完成后产生有用的结果。每一次交接都可能出现中断：导航在障碍物后停滞，模糊的照片被当作最终照片，或者系统忘记了五分钟前处理过的异常情况。</p>
<p>这就是在物理世界中操作的<a href="https://zilliz.com/glossary/ai-agents">人工智能 Agents</a>所面临的核心挑战。与数字 Agents 不同，机器人执行任务时要面对连续的<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非结构化数据</a>：受阻的路径、不断变化的光线、电池限制、传感器噪声和操作符规则。</p>
<p>RoboBrain 是 Senqi AI 用于机器人任务执行的智能操作系统。它位于任务层，连接感知、规划、执行控制和数据反馈，从而使自然语言指令成为结构化、可恢复的机器人工作流程。</p>
<table>
<thead>
<tr><th>断点</th><th>生产中的故障</th><th>机器人大脑如何解决</th></tr>
</thead>
<tbody>
<tr><td>任务规划</td><td>模糊的指令使下游模块没有具体的执行领域。</td><td>任务对象化将意图转化为共享状态。</td></tr>
<tr><td>上下文路由</td><td>正确的信息已经存在，但却到达了错误的决策阶段。</td><td>分层内存可分别路由实时、短期和长期情境。</td></tr>
<tr><td>数据反馈</td><td>单次运行完成或失败，都不会改善下一次运行。</td><td>反馈回写可更新任务状态和长期内存。</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">机器人任务执行中的三个断点<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>软件任务通常可划分为输入、过程和结果。机器人任务运行的物理状态是不断变化的：路径受阻、光线变化、电池限制、传感器噪音和操作符规则。</p>
<p>这就是为什么任务循环需要的不仅仅是孤立的模型。它需要一种在规划、执行和反馈过程中保留上下文的方法。</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1.任务规划：模糊指令产生模糊执行</h3><p>像 "去看看 "这样的短语隐藏了很多决策。哪个区域？机器人应该拍摄什么？什么算不寻常？如果拍摄失败该怎么办？它应该将什么结果返回给操作符？</p>
<p>如果任务层无法将这些细节转化为具体字段（目标区域、检测对象、完成条件、失败策略和返回格式），那么任务从一开始就没有方向，并且永远无法恢复下游上下文。</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2.上下文路由：正确的数据到达错误的阶段</h3><p>机器人堆栈可能已经包含了正确的信息，但任务的执行取决于在正确的阶段检索这些信息。</p>
<p>启动阶段需要地图、区域定义和操作符。执行中期需要实时传感器状态。异常处理需要先前部署的类似案例。当这些来源混淆时，系统就会在错误的背景下做出正确的决策。</p>
<p>当路由选择失败时，启动系统会获取陈旧的经验而不是区域规则，异常处理系统无法获取所需的案例，而执行中期系统获取的是昨天的地图而不是实时读数。给别人一本字典并不能帮助他们写作文。数据必须在正确的阶段以正确的形式到达正确的决策点。</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3.数据反馈：单程执行无法提高效率</h3><p>如果没有回写，机器人在完成一次运行后，下一次运行就不会得到改进。已完成的操作仍需要质量检查：图像是否足够清晰，机器人是否应该重新拍摄？路径是否仍然清晰，还是应该绕道？电池电量是否超过临界值，还是应该终止任务？</p>
<p>单程系统没有这些调用机制。它会执行、停止，下次重复同样的失败。</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">机器人大脑如何关闭机器人任务循环<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrain 将环境理解、任务规划、执行控制和数据反馈连接成一个操作符。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>RoboBrain 核心中间件架构，展示了用户意图如何流经任务对象、由 Milvus 支持的阶段感知内存和策略引擎，然后到达所体现的能力。</span> </span></p>
<p>在本投稿文章所描述的架构中，这一循环是通过三种机制实现的：</p>
<ol>
<li><strong>任务对象化</strong>构建了入口点。</li>
<li><strong>分层内存</strong>将正确的信息传递到正确的阶段。</li>
<li><strong>反馈回路</strong>将结果写回，并决定下一步行动。</li>
</ol>
<p>它们只能作为一个整体发挥作用。如果只解决其中一个问题，而不解决其他问题，链条在下一个点仍然会断裂。</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1.任务对象化：将意图转化为共享状态</h3><p>在执行开始前，RoboBrain 会将每条指令转化为任务对象：任务类型、目标区域、检查对象、约束条件、预期输出、当前阶段和失败策略。</p>
<p>重点不只是解析语言。关键是让每个下游模块都能看到任务的相同状态。没有这种转换，任务就没有方向。</p>
<p>在巡逻示例中，任务对象填写了检查类型、指定区域、作为检查对象的异常项目、作为限制条件的电池 &gt;= 20%、作为预期输出的清晰异常照片和操作符警报，以及作为故障策略的返回基地。</p>
<p>阶段字段会随着运行的变化而更新。障碍物会使任务从导航转向绕行或请求帮助。图像模糊会使任务从检查转为重新拍摄。电池电量不足会使任务终止或返回基地。</p>
<p>下游模块不再接收孤立的指令。它们会收到当前任务阶段、其限制条件以及阶段发生变化的原因。</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2.分层内存：将上下文路由到正确的阶段</h3><p>RoboBrain 将任务相关信息分为三层，以便正确的数据到达正确的阶段。</p>
<p><strong>实时状态</strong>可保存姿势、电池、传感器读数和环境观察结果。它支持每个控制步骤的决策。</p>
<p><strong>短期上下文</strong>记录当前任务中发生的事件：机器人两分钟前避开的障碍物、重新拍摄的照片或第一次尝试未能打开的门。它能让系统不至于忘记刚刚发生了什么。</p>
<p><strong>长期语义记忆</strong>存储了场景知识、历史经验、例外情况和任务后的回写。由于表面反光，特定的停车区域可能需要在夜间调整摄像头角度。某种异常类型可能有误报的历史，应触发人工审核而不是自动报警。</p>
<p>这个长期层级通过<a href="https://milvus.io/">Milvus 向量数据库</a>运行<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性搜索</a>，因为检索正确的记忆意味着按意义匹配，而不是按 ID 或关键字匹配。场景描述和处理记录以<a href="https://zilliz.com/glossary/vector-embeddings">向量 Embeddings</a>的形式存储，并通过<a href="https://zilliz.com/glossary/anns">近似近邻搜索</a>进行检索，以找到最接近的语义匹配。</p>
<p>启动时从长期记忆中提取区域规则和过去的巡逻总结。执行中期依赖于实时状态和短期上下文。异常处理使用<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>来查找长期内存中的类似案例。</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3.反馈回路：将结果写回系统</h3><p>RoboBrain 在每一步之后都会将导航、感知和行动结果写回任务对象，更新阶段字段。系统读取这些观察结果并决定下一步行动：如果路径无法到达，则绕道而行；如果图像模糊，则重新拍摄；如果门打不开，则重试；如果电池电量不足，则终止。</p>
<p>执行变成了一个循环：执行、观察、调整、再执行。链条不断适应环境的变化，而不是一出现意外情况就中断。</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Milvus 如何为 RoboBrain 的长期机器人记忆提供动力<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>有些机器人记忆可以通过任务 ID、时间戳或会话元数据进行查询。长期操作经验通常不能。</p>
<p>有用的记录往往是与当前场景语义相似的情况，即使任务 ID、位置名称或措辞有所不同。这就成了<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>问题，而 Milvus 则适合长期记忆层。</p>
<p>该层存储的信息包括</p>
<ul>
<li>区域规则描述和点定位语义</li>
<li>异常类型定义和示例总结</li>
<li>历史处理记录和任务后审查结论</li>
<li>任务完成时撰写的巡逻总结</li>
<li>人为接管后的经验回写</li>
<li>类似情况下的故障原因和纠正策略</li>
</ul>
<p>这些都不是结构化字段自然键入的。所有这些都需要通过意义来调用。</p>
<p>一个具体的例子：机器人在夜间巡逻停车场入口。顶灯的眩光使异常检测变得不稳定。反光不断被标记为异常。</p>
<p>系统需要调用在夜间强光下有效的重拍策略、类似区域的摄像机角度修正以及将早期检测标记为误报的人工审核结论。精确匹配查询可以找到已知的任务 ID 或时间窗口。但它无法可靠地显示 "先前的眩光案例与此案例表现相似"，除非这种关系已被标记。</p>
<p>语义相似性是有效的检索模式。<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">相似度指标</a>可根据相关性对存储的记忆进行排序，<a href="https://milvus.io/docs/filtered-search.md">而元数据过滤</a>可根据区域、任务类型或时间窗口缩小搜索空间。在实践中，这往往成为<a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">混合搜索</a>：语义匹配针对意义，结构化过滤针对操作符。</p>
<p>就实现而言，过滤器层往往是语义记忆变成操作符的地方。<a href="https://milvus.io/docs/boolean.md">Milvus 过滤器表达式</a>定义了标量约束，而当系统需要通过元数据而不是相似性来查找记录时，<a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">Milvus 标量查询</a>支持精确查找。</p>
<p>这种检索模式类似于针对物理世界决策的<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">检索增强生成，</a>而不是文本生成。机器人不是通过检索文件来回答问题，而是通过检索先前的经验来选择下一个安全的行动。</p>
<p>Milvus 并非什么都能检索。任务 ID、时间戳和会话元数据保存在关系数据库中。原始运行时日志则保存在日志系统中。每个存储系统都会处理其所构建的查询模式。</p>
<table>
<thead>
<tr><th>数据类型</th><th>存放位置</th><th>查询方式</th></tr>
</thead>
<tbody>
<tr><td>任务 ID、时间戳、会话元数据</td><td>关系数据库</td><td>精确查找、连接</td></tr>
<tr><td>原始运行时日志和事件流</td><td>日志系统</td><td>全文搜索、时间范围过滤器</td></tr>
<tr><td>场景规则、处理案例、经验回写</td><td>Milvus</td><td>按含义进行向量相似性搜索</td></tr>
</tbody>
</table>
<p>随着任务的运行和场景的积累，长期记忆层为下游流程提供支持：用于模型微调的样本整理、更广泛的数据分析和跨部署知识转移。记忆复合成数据资产，为今后的每次部署提供更高的起点。</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">该架构在部署中的变化<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>任务对象化、分层内存和反馈回路将 RoboBrain 的任务回路转变成了一种部署模式：每项任务都能保留状态，每次异常都能检索先前的经验，每次运行都能改进下一次运行。</p>
<p>如果机器人在其他地方已经处理过类似的照明、障碍物、异常类型或操作符规则，那么它就不应该从头开始巡逻一栋新建筑。这样才能使机器人在不同场景中执行任务的可重复性更高，也更容易控制长期部署成本。</p>
<p>对于机器人团队来说，更深层次的教训是，内存不仅仅是一个存储层。它是执行控制的一部分。系统需要知道自己在做什么、刚刚发生了什么变化、以前发生过什么类似情况，以及下一次运行时应该写回哪些内容。</p>
<h2 id="Further-Reading" class="common-anchor-header">更多阅读<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您正在研究机器人记忆、任务执行或人工智能语义检索方面的类似问题，这些资源将是您下一步的有用资源：</p>
<ul>
<li>阅读<a href="https://milvus.io/docs">Milvus 文档</a>或试用<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入门</a>，了解向量搜索在实践中是如何工作的。</li>
<li>如果您正在规划生产存储层，请查看<a href="https://milvus.io/docs/architecture_overview.md">Milvus 架构概述</a>。</li>
<li>浏览<a href="https://zilliz.com/vector-database-use-cases">向量数据库用例</a>，了解生产系统中语义搜索的更多实例。</li>
<li>加入<a href="https://milvus.io/community">Milvus 社区</a>，提出问题并分享您正在构建的内容。</li>
<li>如果您想要托管 Milvus，而不是运行自己的基础设施，请了解有关<a href="https://zilliz.com/cloud">Zilliz Cloud 的</a>更多信息。</li>
</ul>
