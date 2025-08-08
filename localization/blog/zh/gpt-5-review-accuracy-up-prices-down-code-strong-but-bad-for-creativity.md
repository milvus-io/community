---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: GPT-5 评论：精度提高、价格下降、代码强大--但对创造力不利
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: 对于开发人员，尤其是那些构建 Agents 和 RAG 管道的开发人员来说，这一版本可能是迄今为止最有用的升级。
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>经过几个月的猜测，OpenAI 终于发布了</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>。</strong>该模型并不像 GPT-4 那样具有创造性的雷击，但对于开发者，尤其是那些构建 Agents 和 RAG 管道的开发者来说，这个版本可能会悄然成为迄今为止最有用的升级。</p>
<p><strong>对构建者而言，简而言之：</strong>GPT-5 统一了架构，增强了多模式 I/O，降低了事实错误率，将上下文扩展到 400k 标记，并使大规模使用变得经济实惠。然而，创造力和文学天赋却明显退步了。</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">引擎盖下有哪些新功能？<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>统一核心</strong>--合并 GPT 数字系列与 o 系列推理模型，在单一架构中提供长链推理和多模态。</p></li>
<li><p><strong>全谱多模态</strong>--在同一模型中，可输入/输出文本、图像、音频和视频。</p></li>
<li><p><strong>大幅提高准确性</strong>：</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>:与 GPT-4o 相比，事实错误减少 44%。</p></li>
<li><p><code translate="no">gpt-5-thinking</code>与 o3 相比，事实错误减少 78%。</p></li>
</ul></li>
<li><p><strong>领域技能提升</strong>- 在代码生成、数学推理、健康咨询和结构化写作方面更强；幻觉显著减少。</p></li>
</ul>
<p>除了 GPT-5，OpenAI 还发布了<strong>另外三个变体</strong>，每个<strong>变体</strong>都针对不同需求进行了优化：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>模型</strong></th><th><strong>描述</strong></th><th><strong>输入/每 100 万个 token 美元</strong></th><th><strong>输出/每 100 万个代币美元</strong></th><th><strong>知识更新</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>主模型，长链推理 + 全多模态</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5 聊天</td><td>等同于 gpt-5，用于 ChatGPT 对话</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>价格便宜 60%，保留 ~90% 的编程性能</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>边缘/离线，32K 上下文，延迟 &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 打破了从代码修复、多模态推理到医疗任务等 25 个基准类别的记录，准确率持续提高。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">开发人员应该关注的原因--尤其是 RAG 和 Agents<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>我们的实际测试表明，该版本对检索增强生成和 Agents 驱动的工作流程来说是一场静悄悄的革命。</p>
<ol>
<li><p><strong>降价</strong>使实验变得可行 - API 输入成本<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>：</mo><mn>每百万</mn></mrow><annotation encoding="application/x-tex">代币</annotation><mrow><mn>1.</mn><mo>25</mo><mn>∗</mn></mrow></semantics></math></span></span></strong>∗<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo separator="true">；</mo><mi>输出</mi><mi>成本</mi><mo>：</mo></mrow><annotation encoding="application/x-tex">每百万代币</annotation></semantics></math></span></span></strong>∗∗1<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.25**；输出成本</annotation><mrow><mo>：</mo></mrow><annotation encoding="application/x-tex">每百万代币∗</annotation></semantics></math></span></span></strong>∗<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>1</mo></mrow><annotation encoding="application/x-tex">.25**；输出成本</annotation><mrow><mo>：</mo></mrow><annotation encoding="application/x-tex">每百万代币∗</annotation></semantics></math></span></span></strong>∗1<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.25</annotation></semantics></math></span></span></strong>**<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">：**</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1<strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">25</span><span class="mord">permilliontokens</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span> ∗</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>:<strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span> ∗∗</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">10</span></span></span></span></strong>。</p></li>
<li><p><strong>400k 上下文窗口</strong>（与 o3/4o 中的 128k 相比）可让您在复杂的多步骤 Agents 工作流中保持状态，而无需中断上下文。</p></li>
<li><p><strong>更少的幻觉和更好的工具使用</strong>--支持多步骤链式工具调用，处理复杂的非标准任务，提高执行可靠性。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">并非没有缺陷<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>尽管在技术上取得了进步，但 GPT-5 仍有明显的局限性。</p>
<p>在发布会上，OpenAI 的主题演讲中有一张幻灯片诡异地计算出了<em>52.8 &gt; 69.1 = 30.8</em>，而在我们自己的测试中，该模型自信地重复了教科书上关于飞机升空的 "伯努利效应 "解释，但<strong>却是</strong>错误的--这提醒我们<strong>它仍然是一个模式学习者，而不是真正的领域专家。</strong></p>
<p><strong>虽然 STEM 的成绩有所提高，但创造力的深度却有所下滑。</strong>许多长期用户注意到文学天赋的下降：诗歌感觉平淡，哲学对话缺乏细微差别，长篇叙事更加机械。这样做的代价是显而易见的--在技术领域，事实准确性更高，推理能力更强，但却牺牲了艺术性和探索性，而这种艺术性和探索性曾让 GPT 给人一种近乎人性化的感觉。</p>
<p>有鉴于此，让我们来看看 GPT-5 在实际测试中的表现如何。</p>
<h2 id="Coding-Tests" class="common-anchor-header">编码测试<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>我从一个简单的任务开始：编写一个 HTML 脚本，允许用户上传图片并用鼠标移动图片。GPT-5 暂停了大约 9 秒钟，然后生成了能很好处理交互的工作代码。这感觉是一个良好的开端。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>第二项任务更难：在旋转六边形内实现多边形球碰撞检测，旋转速度、弹性和球数均可调整。GPT-5 在大约 13 秒内生成了第一个版本。代码包含了所有预期功能，但存在错误，无法运行。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>然后，我使用编辑器的 "<strong>修复</strong>错误 "选项，GPT-5 修正了错误，使六边形得以呈现。然而，小球却始终没有出现--生成逻辑缺失或不正确，这意味着尽管程序设置完整，但程序的核心功能却不存在。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>总之，</strong>GPT-5 可以生成简洁、结构良好的交互式代码，并能从简单的运行时错误中恢复。但在复杂情况下，它仍有可能遗漏重要逻辑，因此在部署前必须进行人工审核和反复修改。</p>
<h2 id="Reasoning-Test" class="common-anchor-header">推理测试<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>我提出了一个涉及商品颜色、价格和位置线索的多步骤逻辑谜题--大多数人需要几分钟才能解决。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>问题</strong> <em>蓝色物品是什么，它的价格是多少？</em></p>
<p>GPT-5 仅用 9 秒钟就给出了正确答案，并给出了逻辑清晰的解释。这项测试强化了模型在结构化推理和快速演绎方面的优势。</p>
<h2 id="Writing-Test" class="common-anchor-header">写作测试<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>我经常向 ChatGPT 寻求博客、社交媒体文章和其他书面内容方面的帮助，因此文本生成是我最关心的能力之一。在这次测试中，我要求 GPT-5 根据一篇关于 Milvus 2.6 多语言分析器的博客创建一篇 LinkedIn 帖子。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>输出结果条理清晰，抓住了原始博客的所有要点，但感觉过于正式和可预见--更像是企业新闻稿，而不是为了在社交媒体上引发兴趣。它缺乏温情、节奏和个性，而这正是一篇文章给人的感觉和吸引力所在。</p>
<p>但从另一方面看，随附的插图非常出色：清晰、符合品牌形象，与 Zilliz 的技术风格完美契合。从视觉上看，这篇文章非常到位；只是在文字上还需要更多的创意来配合。</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">更长的上下文窗口 = RAG 和 VectorDB 之死？<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>去年<a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">谷歌推出<strong>双子座 1.5 Pro</strong></a>时，我们曾讨论过这个话题，当时<a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">谷歌推出</a>了超长的 10M 标记上下文窗口。当时，一些人迅速预测 RAG 将走向终结，甚至是数据库的终结。时至今日：RAG 不仅依然存在，而且还在蓬勃发展。在实践中，它与<a href="https://milvus.io/"><strong>Milvus</strong></a>和<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> 等向量数据库一起，变得<em>更</em>有能力和生产力。</p>
<p>现在，随着 GPT-5 扩展了上下文长度和更先进的工具调用功能，问题又出现了：<em>我们是否仍然需要向量数据库来进行上下文摄取，甚至需要专用的 Agents/RAG 管道？</em></p>
<p><strong>简短的回答是：绝对需要。我们仍然需要它们。</strong></p>
<p>较长的上下文是有用的，但不能取代结构化检索。多 Agents 系统仍将是一个长期的架构趋势，而且这些系统通常需要几乎无限的上下文。此外，在安全管理私有、非结构化数据方面，向量数据库永远是最后的把关人。</p>
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
    </button></h2><p>在观看了 OpenAI 的发布会并进行了亲手测试之后，GPT-5 给人的感觉与其说是一次巨大的飞跃，不如说是过去优势的精炼融合，再加上一些恰到好处的升级。这并不是一件坏事--这是大型模型开始遭遇架构和数据质量限制的标志。</p>
<p>俗话说，<em>苛刻的批评来自过高的期望</em>。对 GPT-5 的失望主要来自于 OpenAI 为自己设定的高标准。实际上，更高的精度、更低的价格和集成的多模态支持仍然是非常有价值的优势。对于构建 Agents 和 RAG 管道的开发人员来说，这可能是迄今为止最有用的升级。</p>
<p>有些朋友开玩笑说要为 GPT-4o 做 "在线纪念"，声称他们以前的聊天伙伴的个性已经永远消失了。我并不介意这种改变--GPT-5 可能不那么热情健谈了，但它直接明了的风格让人感觉耳目一新。</p>
<p><strong>你呢？</strong>与我们分享您的想法--加入我们的<a href="https://discord.com/invite/8uyFbECzPX">Discord</a>，或加入<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>和<a href="https://x.com/milvusio">X</a> 上的对话。</p>
