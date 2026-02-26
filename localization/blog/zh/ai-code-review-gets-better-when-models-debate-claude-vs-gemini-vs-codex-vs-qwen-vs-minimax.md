---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: 当模型辩论时，人工智能代码审查会变得更好：克劳德 vs 双子座 vs Codex vs Qwen vs MiniMax
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  我们对 Claude、Gemini、Codex、Qwen 和 MiniMax 进行了实际错误检测测试。最佳模型的检测率为
  53%。经过对抗辩论后，检测率跃升至 80%。
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>最近，我使用人工智能模型审查了一个拉取请求，结果却自相矛盾：Claude 标记了数据竞赛，而 Gemini 则说代码是干净的。这让我对其他人工智能模型的表现产生了好奇，于是我用结构化代码审查基准测试了 Claude、Gemini、Codex、Qwen 和 MiniMax 的最新旗舰模型。结果如何？表现最好的模型只捕获了 53% 的已知错误。</p>
<p>然而，我的好奇心并没有就此结束：如果这些人工智能模型一起工作会怎样？我尝试让它们互相辩论，经过五轮对抗性辩论后，错误检测率跃升至 80%。在辩论模式下，需要系统级理解的最难错误的检测率达到了 100%。</p>
<p>这篇文章介绍了实验设计、每个模型的结果，以及辩论机制对如何真正使用人工智能进行代码审查的启示。</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">以 Claude、Gemini、Codex、Qwen 和 MiniMax 为基准进行代码审查<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您一直在使用模型进行代码审查，您可能已经注意到它们不仅在准确性上存在差异，它们在阅读代码的方式上也存在差异。举个例子：</p>
<p>Claude 通常会从上到下查看调用链，并在 "无聊 "的路径（错误处理、重试、清理）上花费时间。真正的错误往往就藏在那里，所以我并不讨厌这种彻底性。</p>
<p>双子座倾向于从一个强有力的结论（"这很糟糕"/"看起来很好"）开始，然后从设计/结构的角度逆向证明其合理性。有时这很有用。有时，它读起来就像略读了一下，然后就下了定论。</p>
<p>Codex 比较安静。但当它标出一些东西时，往往是具体可操作的--少一些评论，多一些 "这行是错的，因为X"。</p>
<p>但这些都是印象，而不是测量结果。为了获得实际数字，我设定了一个基准。</p>
<h3 id="Setup" class="common-anchor-header">设置</h3><p><strong>测试了五款旗舰模型：</strong></p>
<ul>
<li><p>克劳德 Opus 4.6</p></li>
<li><p>双子座 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>工具（Magpie）</strong></p>
<p>我使用的是<a href="https://github.com/liliu-z/magpie">Magpie</a>，这是我创建的一款开源基准测试工具。它的工作就是完成通常需要手动完成的 "代码审查准备"：<em>在</em>审查 PR<em>之前</em>，将周围的上下文（调用链、相关模块和邻近的相关代码）引入模型。</p>
<p><strong>测试用例（存在已知错误的 Milvus PR）</strong></p>
<p>数据集由<a href="https://github.com/milvus-io/milvus">Milvus</a>（<a href="https://zilliz.com/">Zilliz</a> 创建并维护的开源向量数据库）中的 15 个拉动请求组成。这些 PR 作为基准非常有用，因为每个 PR 都是在生产中出现错误后才合并，然后需要进行还原或热修复。因此，每个案例都有一个已知的 Bug，我们可以根据它进行评分。</p>
<p><strong>错误难度级别</strong></p>
<p>不过，并不是所有的错误都同样难以发现，因此我将它们分为三个难度级别：</p>
<ul>
<li><p><strong>L1：</strong>仅从差异中就能发现（use-after-free、off-by-one）。</p></li>
<li><p><strong>L2（10 例）：</strong>需要了解周围的代码，才能发现接口语义变化或并发竞赛等问题。这些是日常代码审查中最常见的错误。</p></li>
<li><p><strong>L3（5 个案例）：</strong>需要系统级的理解，以发现跨模块状态不一致或升级兼容性问题。这些是对模型能否深入推理代码库的最难测试。</p></li>
</ul>
<p><em>注：每个模型都能捕捉到所有 L1 错误，因此我将它们排除在评分之外。</em></p>
<p><strong>两种评估模式</strong></p>
<p>每个模型都在两种模式下运行：</p>
<ul>
<li><p><strong>Raw：</strong>模型只看到 PR（diff + PR 内容中的任何内容）。</p></li>
<li><p><strong>R1：</strong> <em>在</em>模型审查<em>之前</em>，Magpie 会提取周围的上下文（相关文件/调用站点/相关代码）。这就模拟了一种工作流程，在这种流程中，你需要提前准备上下文，而不是让模型去猜测它需要什么。</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">结果（仅 L2 + L3）</h3><table>
<thead>
<tr><th>模式</th><th>克劳德</th><th>双子座</th><th>法典</th><th>迷你马克斯</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>生</td><td>53%（第一）</td><td>13%（最后一名）</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1（有喜鹊的上下文）</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>四点启示</p>
<p><strong>1.克劳德在原始审查中占主导地位。</strong>在没有任何上下文辅助的情况下，它的总体检测得分率为 53%，L3 错误得分率为 5/5。如果你使用的是单一模型，又不想花时间准备上下文，那么 Claude 是最佳选择。</p>
<p><strong>2.双子座需要上下文帮助。</strong>它的原始得分是 13%，是小组中最低的，但在 Magpie 提供了周边代码后，它的得分跃升至 33%。双子座不能很好地收集自己的上下文，但如果你预先做了这项工作，它的表现还是可圈可点的。</p>
<p><strong>3.Qwen 的上下文辅助性能最强。</strong>它在 R1 模式下的得分率为 40%，在 L2 错误中的得分率为 5/10，是该难度下的最高分。对于愿意准备上下文的日常例行审查，Qwen 是一个实用的选择。</p>
<p><strong>4.更多的上下文并不总是有帮助。</strong>它提升了 Gemini（13% → 33%）和 MiniMax（27% → 33%），但实际上却伤害了 Claude（53% → 47%）。Claude 本身就擅长组织上下文，因此额外的信息可能会带来噪音而不是清晰度。教训是：工作流程要与模型相匹配，而不是假定语境越多就越好。</p>
<p>这些结果与我的日常经验相符。克劳德排名第一并不令人惊讶。Gemini 的得分低于我的预期，这在事后看来是有道理的：我通常在多轮对话中使用 Gemini，在这种对话中，我需要对设计进行迭代，或共同解决一个问题，而它在这种互动环境中表现出色。这个基准是一个固定的单程流水线，而这恰恰是 Gemini 最薄弱的环节。稍后的辩论部分将显示，当你给双子座一个多轮、对抗的形式时，它的性能会明显提高。</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">让人工智能模型相互辩论<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>在单项基准测试中，每个模型都表现出了不同的优势和盲点。因此我想测试一下：如果模型之间互相审查工作而不仅仅是代码，会发生什么情况？</p>
<p>于是，我在同一基准之上添加了一个辩论层。所有五个模型都参加五轮比赛：</p>
<ul>
<li><p>在第一轮中，每个模型独立审查相同的 PR。</p></li>
<li><p>之后，我向所有参与者广播所有五个评论。</p></li>
<li><p>在第 2 轮中，每个模型根据其他四个模型的情况更新自己的立场。</p></li>
<li><p>重复进行，直到第五轮。</p></li>
</ul>
<p>到最后，每个模型不仅要对代码做出反应，还要对已经被批评和修改过多次的论点做出反应。</p>
<p>为了防止比赛变成 "LLMs 高声附和"，我强制执行了一条硬性规定：<strong>每个主张都必须指向具体的代码作为证据</strong>，而且模型不能只说 "说得好"--它必须解释为什么它改变了主意。</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">结果：最佳独辩与辩论模式</h3><table>
<thead>
<tr><th>模式</th><th>L2 (10 个案例)</th><th>L3（5 个案例）</th><th>检测总数</th></tr>
</thead>
<tbody>
<tr><td>最佳个人（原始克劳德）</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>辩论（所有五个模型）</td><td>7/10 （加倍）</td><td>5/5（全中）</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">突出表现</h3><p><strong>1.L2 检测率翻倍。</strong>常规、中等难度的错误从 3/10 跳至 7/10。这些都是实际代码库中出现频率最高的 bug，也正是单个模型失误率不一致的类别。辩论机制的最大贡献就是缩小了这些日常差距。</p>
<p><strong>2.L3 错误：零遗漏。</strong>在单个模型运行中，只有 Claude 抓住了全部五个 L3 系统级 bug。在辩论模式下，小组与这一结果不相上下，这意味着你不再需要押注于正确的模型来获得完整的 L3 覆盖。</p>
<p><strong>3.辩论填补了盲点，而不是提高了上限。</strong>对于最强的个人来说，系统级错误并不是难点。克劳德已经具备了这些能力。辩论机制的核心贡献在于弥补了克劳德在常规 L2 错误上的弱点，克劳德个人只抓住了 10 个中的 3 个，而辩论小组却抓住了 7 个。这就是 53% → 80% 跃升的由来。</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">辩论的实际效果</h3><p>上述数字表明辩论是有效的，但一个具体的例子可以说明它<em>为什么</em>有效。以下是五种模型如何处理<strong>PR #44474</strong> 的简要演练，该模型在搜索过程中引入了主键的懒加载。</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474：</strong></a>懒加载优化将搜索改为按需获取主键，而不是预先加载所有主键。</p>
<p><strong>第一轮</strong></p>
<p>双子座咄咄逼人：</p>
<p>"这份 PR 是一个由不良实践、潜在的未定义行为和伪装成'优化'的性能回归组成的雷区"。</p>
<p>Claude 和 Qwen 重点讨论了未定义的行为和性能问题，他们的关注点趋于一致：</p>
<p>"在没有适当同步的情况下，C++ 内存模型无法保证对同一向量不同索引的并发写入的安全性。"</p>
<p>三人都发现了实际问题，但都没有发现更深层次的错误。随后，几乎没有发言的 Codex 也指出了其他三家忽略的问题：<code translate="no">primary_keys_</code> 向量的大小会被调整，但实际上只有通过还原阶段的位置才会被填充。其他位置的值都为零。</p>
<p><strong>第二回合</strong></p>
<p>克劳德接过法典的发现，追踪下游的后果：</p>
<p>"我找到了：<code translate="no">SortEqualScoresByPks</code> 在<code translate="no">ReduceResultData</code> 之前运行。因此，当<code translate="no">SortEqualScoresByPks</code> 执行时，懒惰地获取的 PK 值为零。整个<code translate="no">primary_keys_</code> 向量充满了默认构建的 PkType 值"。</p>
<p>通俗地说，排序功能是在键值加载之前运行的，所以它排序的是零。克劳德公开承认了这次失误：</p>
<p>"codex-cli 发现了一个真正关键的正确性错误。我在第一轮中漏掉了这个问题。</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">哪种模型组合能发现最多的错误？<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>从 53% 跃升至 80%，是因为五个模型互相覆盖了对方的盲点。但并不是每个人都有能力为每一次代码审查设置并运行五个模型，进行五轮辩论。</p>
<p><strong>所以我测试了更简单的版本：如果你只能运行两个模型，哪一对能让你最接近多模型上限？</strong></p>
<p>我使用<strong>上下文辅助（R1）</strong>运行，并统计了每个模型在 15 个已知错误中发现了多少个：</p>
<ul>
<li><p><strong>克劳德：</strong>7/15 (47%)</p></li>
<li><p><strong>Qwen:</strong>6/15 (40%)</p></li>
<li><p><strong>双子座：</strong>5/15 (33%)</p></li>
<li><p><strong>迷你马克斯：</strong>5/15 (33%)</p></li>
<li><p><strong>法典</strong>4/15 (27%)</p></li>
</ul>
<p>因此，重要的不仅仅是每个模型发现了多少个 Bug，而是它漏掉了<em>哪些</em>Bug。在 Claude 错过的 8 个错误中，Gemini 发现了 3 个：一个并发竞赛条件、一个云存储 API 兼容性问题和一个缺失的权限检查。从另一个方向看，Gemini 错过了大多数数据结构和深层逻辑错误，而 Claude 几乎抓住了所有这些错误。它们的弱点几乎没有重叠，这正是它们成为强强组合的原因。</p>
<table>
<thead>
<tr><th>双模型配对</th><th>综合覆盖率</th></tr>
</thead>
<tbody>
<tr><td>克劳德 + 双子座</td><td>10/15</td></tr>
<tr><td>克劳德 + 奎文</td><td>9/15</td></tr>
<tr><td>克劳德+法典</td><td>8/15</td></tr>
<tr><td>Claude + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>所有五个模型加起来覆盖了 15 个中的 11 个，剩下 4 个每个模型都漏掉的 bug。</p>
<p><strong>Claude + Gemini</strong>作为两个模型组合，已经达到了五个模型上限的 91%。对于这个基准来说，这是最有效的组合。</p>
<p>尽管如此，克劳德+双子座并不是每种类型错误的最佳组合。当我把结果按错误类型细分时，就会发现一个更微妙的情况：</p>
<table>
<thead>
<tr><th>错误类型</th><th>总数</th><th>克劳德</th><th>双子座</th><th>法典</th><th>迷你马克斯</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>验证差距</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>数据结构生命周期</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>并发竞赛</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>兼容性</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>深层逻辑</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>总计</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>错误类型细分揭示了为什么没有一种配对是普遍最佳的。</p>
<ul>
<li><p>在数据结构生命周期错误方面，Claude 和 MiniMax 并列 3/4。</p></li>
<li><p>在验证漏洞方面，Claude 和 Qwen 并列 3/4。</p></li>
<li><p>在并发性和兼容性问题上，Claude 的得分均为零，而 Gemini 则填补了这些空白。</p></li>
<li><p>没有哪个模型能涵盖所有问题，但 Claude 涵盖的范围最广，最接近于通才。</p></li>
</ul>
<p>每个模型都漏掉了四个错误。一个涉及 ANTLR 语法规则优先级。一个是跨函数的读写锁语义不匹配。一个需要理解压缩类型之间的业务逻辑差异。还有一个是无声比较错误，其中一个变量使用的是兆字节，而另一个变量使用的是字节。</p>
<p>这四个错误的共同点是代码在语法上是正确的。错误源于开发人员头脑中的假设，而不是差异，甚至也不是周围的代码。这大概就是目前人工智能代码审查的极限所在。</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">发现漏洞后，哪种模型最擅长修复漏洞？<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>在代码审查中，发现错误是工作的一半。另一半是修复它们。因此，在几轮辩论之后，我增加了一项同行评价，以衡量每个模型的修复建议究竟有多大用处。</p>
<p>为了衡量这一点，我在辩论结束后增加了一轮同行评估。每个模型都开启了一个新的环节，并担任匿名评委，为其他模型的评论打分。五个模型被随机映射到评论者 A/B/C/D/E 中，因此没有评委知道哪个模型产生了哪个评论。每位评委从准确性、可操作性、深度和清晰度四个维度打分，分值从 1 到 10 不等。</p>
<table>
<thead>
<tr><th>模型</th><th>准确性</th><th>可操作性</th><th>深度</th><th>清晰度</th><th>整体</th></tr>
</thead>
<tbody>
<tr><td>曲文</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8.6（并列第一）</td></tr>
<tr><td>克劳德</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8.6 （并列第一）</td></tr>
<tr><td>法典</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>双子座</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>迷你型</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen 和 Claude 以明显优势并列第一。两者在所有四个维度上的得分都很高，而 Codex、Gemini 和 MiniMax 则低了整整一分或更多。值得注意的是，在配对分析中被证明是克劳德的重要错误查找伙伴的双子座，在审核质量方面却排名垫底。善于发现问题和善于解释如何解决问题显然是两种不同的技能。</p>
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
    </button></h2><p><strong>克劳德</strong>是最值得信赖的评审专家。它能处理整个调用链，遵循深层逻辑路径，并在不需要你灌输的情况下引入自己的上下文。在处理 L3 系统级错误方面，没有其他工具能与它相媲美。它有时会对数学过于自信，但当另一个模型证明它是错的时候，它就会承认错误，并指出自己的推理出错的地方。用它来处理核心代码和你不能错过的错误。</p>
<p><strong>双子座</strong>是热门。它对代码风格和工程标准有很强的意见，并能迅速从结构上解决问题。缺点是，它往往停留在表面，挖掘不够深入，这也是它在同行评价中得分较低的原因。双子座的真正优势在于它是一个挑战者：它的反击迫使其他模型反复检查自己的工作。双子座与克劳德（Claude）搭配，可以获得克劳德有时会忽略的结构性视角。</p>
<p><strong>Codex</strong>几乎不说一句话。但只要它说了，就很重要。它对真实错误的命中率很高，而且它善于捕捉别人都忽略的问题。在 PR #44474 的例子中，Codex 就是发现零值主键问题的模型，这个问题引发了整个链条。把它看作是补充审核员，它能捕捉到主要模型遗漏的问题。</p>
<p><strong>Qwen</strong>是五位审稿人中最全面的一位。它的审核质量与克劳德不相上下，尤其擅长将不同的观点汇集成可供实际操作的修复建议。在上下文辅助模式下，它的 L2 检测率也是最高的，这使它成为日常公关审查的可靠默认设置。唯一的弱点是：在长时间、多回合的辩论中，它有时会跟不上之前的语境，从而在后面的回合中给出不一致的答案。</p>
<p><strong>MiniMax</strong>在自行查找漏洞方面最弱。它最好用来充实多模型小组，而不是作为独立的审查员。</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">本实验的局限性<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>本实验有一些注意事项：</p>
<p><strong>样本量较小。</strong>只有 15 份 PR，全部来自同一个 Go/C++ 项目 (Milvus)。这些结果并不适用于所有语言或代码库。请将其视为方向性结果，而非决定性结果。</p>
<p><strong>模型本身具有随机性。</strong>同样的提示运行两次可能会产生不同的结果。本帖中的数字只是一个快照，而不是一个稳定的预期值。虽然大趋势（辩论优于个人，不同模型擅长不同的错误类型）是一致的，但对单个模型的排名也不能掉以轻心。</p>
<p><strong>发言顺序是固定的。</strong>辩论赛在所有回合中都使用相同的顺序，这可能会影响后面发言的模型的反应。今后的实验可以随机调整每轮的顺序，以控制这种情况。</p>
<h2 id="Try-it-yourself" class="common-anchor-header">亲自尝试<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>本实验的所有工具和数据均已开源：</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>喜鹊</strong></a>：一款开源工具，用于收集代码上下文（调用链、相关 PR、受影响模块），并为代码审查协调多模型对抗辩论。</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>：完整的评估管道、配置和脚本。</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>测试用例</strong></a>：所有 15 个带有已知错误注释的 PR。</p></li>
</ul>
<p>本实验中的 bug 全部来自<a href="https://github.com/milvus-io/milvus">Milvus</a> 中的真实拉取请求，<a href="https://github.com/milvus-io/milvus">Milvus</a> 是一个为人工智能应用而构建的开源向量数据库。我们在<a href="https://discord.com/invite/8uyFbECzPX">Discord</a>和<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a> 上有一个相当活跃的社区，我们希望有更多的人参与到代码的开发中来。如果你最终在自己的代码库中运行了这个基准，请分享结果！我真的很好奇不同语言和项目之间的趋势是否一致。</p>
<h2 id="Keep-Reading" class="common-anchor-header">继续阅读<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs. MiniMax M2.5 vs. Gemini 3 深度思考：哪种模型适合您的人工智能 Agents 堆栈？</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">使用轻量级 memsearch 插件为 Claude 代码添加持久内存</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我们提取了 OpenClaw 的内存系统并将其开源（memsearch）</a></p></li>
</ul>
