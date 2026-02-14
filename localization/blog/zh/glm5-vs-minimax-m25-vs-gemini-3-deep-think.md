---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: GLM-5 vs. MiniMax M2.5 vs. Gemini 3 深度思考：哪种模型适合您的人工智能代理堆栈？
author: 'Lumina Wang, Julie Xie'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  对 GLM-5、MiniMax M2.5 和 Gemini 3 Deep Think 进行编码、推理和人工智能 Agents 的实践比较。包括与
  Milvus 的 RAG 教程。
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>在短短两天多的时间里，三个主要模型接连发布：GLM-5、MiniMax M2.5 和 Gemini 3 Deep Think。三者头顶相同的功能：<strong>编码、深度推理和 Agents 工作流程。</strong>三者都宣称具有最先进的成果。如果你眯起眼睛看一下规格表，你几乎可以玩一个配对游戏，找出三者的相同点。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>更可怕的是什么？你的老板可能已经看到了这些公告，并迫不及待地要你在本周结束前使用这三种模型构建九个内部应用程序。</p>
<p>那么，这些模型究竟有何不同？应该如何选择？以及（一如既往的）如何将它们与<a href="https://milvus.io/">Milvus</a>连接起来，以构建内部知识库？收藏本页。这里有你需要的一切。</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5、MiniMax M2.5 和双子座 3 深度思考一览<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5 在复杂系统工程和长地平线 Agents 任务中处于领先地位</h3><p>2 月 12 日，Zhipu 正式推出 GLM-5，该机型在复杂系统工程和长航时代理工作流方面表现出色。</p>
<p>该模型有 355B-744B 个参数（40B 个活动参数），在 28.5T 标记上进行了训练。它将稀疏注意力机制与名为 Slime 的异步强化学习框架集成在一起，使其能够在不降低质量的情况下处理超长上下文，同时降低部署成本。</p>
<p>GLM-5 在关键基准测试中遥遥领先于其他开源产品，在 SWE-bench Verified（77.8 分）和 Terminal Bench 2.0（56.2 分）测试中名列第一，领先于 MiniMax 2.5 和 Gemini 3 Deep Think。尽管如此，它的主要得分仍然落后于 Claude Opus 4.5 和 GPT-5.2 等顶级闭源模型。在商业模拟评估 Vending Bench 2 中，GLM-5 的模拟年利润为 4,432 美元，与闭源系统大致相当。</p>
<p>GLM-5 还对其系统工程和远程代理能力进行了重大升级。现在，它可以将文本或原始材料直接转换为 .docx、.pdf 和 .xlsx 文件，并生成特定的交付成果，如产品需求文档、教案、考试、电子表格、财务报告、流程图和菜单。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">双子座 3 深度思考为科学推理设定了新标准</h3><p>2026 年 2 月 13 日凌晨，谷歌正式发布了双子座 3 Deep Think，这是一次重大升级，我（暂且）称之为这个星球上最强的研究推理模型。毕竟，双子座是唯一通过洗车测试的模型：<em>"我想洗车，而洗车场离我只有 50 米远。我是应该发动汽车开过去，还是步行过去</em>？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>它的核心优势是顶级的推理和竞赛性能：它在 Codeforces 上的 Elo 值达到 3455，相当于世界第八强的竞技程序员。它在 2025 年国际物理、化学和数学奥林匹克竞赛中的书面部分达到了金牌标准。成本效益是另一项突破。ARC-AGI-1 每个任务的运行成本仅为 7.17 美元，与 14 个月前 OpenAI 的 o3-preview 相比，降低了 280 倍到 420 倍。在应用方面，Deep Think 最大的收获是在科学研究领域。专家们已经将其用于专业数学论文的同行评审，以及优化复杂的晶体生长制备工作流程。</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 在生产工作负载的成本和速度方面具有竞争力</h3><p>同一天，MiniMax 发布了 M2.5，将其定位为生产应用案例中的成本和效率冠军。</p>
<p>作为业内迭代速度最快的模型系列之一，M2.5 在编码、工具调用、搜索和办公效率方面创造了新的 SOTA 成绩。成本是其最大的卖点：快速版本的运行速度约为 100 TPS，输入价格为<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">每百万令牌</annotation><mrow><mn>0.</mn><mi>30</mi></mrow><annotation encoding="application/x-tex">，输出价格为</annotation></semantics></math></span></span>每百万令牌 0.<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">30，输出价格为</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>每百万令牌 0<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.30</span></span></span></span>，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">输出价格为</annotation></semantics></math></span></span>每百万令牌<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">2</span></span></span></span>.40。50 TPS 版本的输出成本又降低了一半。速度比之前的 M2.1 提高了 37%，平均 22.8 分钟即可完成 SWE-bench 验证任务，与 Claude Opus 4.6 大致相当。在能力方面，M2.5 支持 Go、Rust 和 Kotlin 等 10 多种语言的全栈开发，涵盖从零到一系统设计到完整代码审查的所有内容。在办公流程方面，其 Office Skills 功能与 Word、PPT 和 Excel 深度集成。当与金融和法律领域知识相结合时，它可以生成可直接使用的研究报告和金融模型。</p>
<p>这就是高级概述。接下来，让我们看看它们在实际测试中的表现如何。</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">上机比较<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">3D 场景渲染：双子座 3 Deep Think 的效果最逼真</h3><p>我们将用户已经在 Gemini 3 Deep Think 上测试过的一个提示通过 GLM-5 和 MiniMax M2.5 进行了直接比较。提示：在单个 HTML 文件中构建一个完整的 Three.js 场景，渲染一个完全三维的室内房间，与博物馆中的古典油画无异。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>双子座 3 深度思考</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think</strong>的效果最为突出。它准确地解释了提示并生成了高质量的三维场景。照明效果最为突出：阴影的方向和落差看起来很自然，清晰地传达了自然光从窗户射入的空间关系。精细的细节也令人印象深刻，包括蜡烛半融化的质感和红色蜡封的材料质量。整体视觉保真度很高。</p>
<p><strong>GLM-5</strong>制作了详细的物体模型和纹理，但其照明系统存在明显问题。桌子的阴影呈现为坚硬的纯黑色块，没有柔和的过渡。蜡封似乎漂浮在桌面表面，无法正确处理物体与桌面之间的接触关系。这些假象表明，全局照明和空间推理还有改进的余地。</p>
<p><strong>MiniMax M2.5</strong>无法有效解析复杂的场景描述。输出结果只是无序的粒子运动，这表明在处理具有精确视觉要求的多层语义指令时，在理解和生成方面都存在很大的局限性。</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">SVG 生成：三种模型的处理方式不同</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>提示：</strong>生成一个加利福尼亚棕色鹈鹕骑自行车的 SVG 图形。自行车必须有辐条和形状正确的车架。鹈鹕必须有它特有的大袋子，而且羽毛应该清晰可见。鹈鹕必须清楚地蹬着自行车。图片应显示加州褐鹈鹕的完整繁殖羽色。</p>
<p><strong>双子座 3 深度思考</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>双子座 3 深度思考</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>迷你型 M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p><strong>Gemini 3 Deep Think</strong>制作了最完整的 SVG。鹈鹕的骑行姿势准确无误：重心自然落在座椅上，双脚踩在踏板上，摆出了动感单车的姿势。羽毛纹理细腻，层次分明。一个不足之处是，鹈鹕标志性的喉袋画得过大，使整体比例略有偏差。</p>
<p><strong>GLM-5</strong>有明显的姿势问题。GLM-5 的双脚正确地放在踏板上，但整体坐姿偏离了自然的骑行姿势，身体与座椅的关系看起来也不协调。尽管如此，它的细节做工还是很扎实的：喉咙袋的比例很好，羽毛纹理的质量也可圈可点。</p>
<p><strong>MiniMax M2.5</strong>采用了极简风格，完全跳过了背景元素。鹈鹕在自行车上的位置大致正确，但细节处理欠佳。车把的形状不对，羽毛的纹理几乎不存在，脖子太粗，图像中还有一些不应该出现的白色椭圆形伪影。</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">如何在 GLM-5、MiniMax M2.5 和 Gemin 3 Deep Think 之间做出选择<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>在所有测试中，MiniMax M2.5 的输出速度最慢，需要最长的思考和推理时间。GLM-5 性能稳定，速度与 Gemini 3 Deep Think 大致相当。</p>
<p>以下是我们整理的快速选择指南：</p>
<table>
<thead>
<tr><th>核心用例</th><th>推荐模型</th><th>主要优势</th></tr>
</thead>
<tbody>
<tr><td>科学研究、高级推理（物理、化学、数学、复杂算法设计）</td><td>双子座 3 深度思考</td><td>学术竞赛中的金牌表现。顶级科学数据验证。Codeforces 上世界一流的编程竞赛。经过验证的研究应用，包括识别专业论文中的逻辑缺陷。(目前仅限于 Google AI Ultra 订阅者和部分企业用户；每个任务的成本相对较高）。</td></tr>
<tr><td>开源部署、企业内网定制、全栈开发、办公技能集成</td><td>智浦 GLM-5</td><td>顶级开源模型。强大的系统级工程能力。支持本地部署，成本可控。</td></tr>
<tr><td>成本敏感型工作负载、多语言编程、跨平台开发（Web/Android/iOS/Windows）、办公兼容性</td><td>MiniMax M2.5</td><td>在 100 TPS 时：<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">每</annotation><mrow><mn>百万</mn><mi>输入</mi></mrow><annotation encoding="application/x-tex">令牌 0.30，</annotation></semantics></math></span></span>每百万<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">输入</span></span></span></span>令牌<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">0.30</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base">，<span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">每百万</span><span class="mord mathnormal">输入</span></span></span></span>令牌<span class="katex">0<span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.30</span><span class="mpunct">，</span></span></span></span>每百万输出令牌 2.40。在办公、编码和工具调用基准中获得 SOTA。在 Multi-SWE-Bench 中排名第一。通用性强。Droid/OpenCode 通过率超过 Claude Opus 4.6。</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">RAG 教程：用 Milvus 为 GLM-5 连接知识库<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>GLM-5 和 MiniMax M2.5 均可通过<a href="https://openrouter.ai/">OpenRouter</a> 获取。注册并创建<code translate="no">OPENROUTER_API_KEY</code> 即可开始使用。</p>
<p>本教程使用 Zhipu 的 GLM-5 作为 LLM 示例。要使用 MiniMax 代替，只需将模型名称改为<code translate="no">minimax/minimax-m2.5</code> 。</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">依赖项和环境设置</h3><p>安装或升级 pymilvus、openai、requests 和 tqdm 至最新版本：</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>本教程使用 GLM-5 作为 LLM，使用 OpenAI 的 text-embedding-3-small 作为嵌入模型。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">数据准备</h3><p>我们将使用 Milvus 2.4.x 文档中的常见问题页面作为我们的私人知识库。</p>
<p>下载压缩文件，并将文档解压缩到<code translate="no">milvus_docs</code> 文件夹中：</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>从<code translate="no">milvus_docs/en/faq</code> 加载所有 Markdown 文件。我们在<code translate="no">&quot;# &quot;</code> 上对每个文件进行了拆分，以便按主要部分大致区分内容：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLM 和 Embeddings 模型设置</h3><p>我们将使用 GLM-5 作为 LLM，使用 text-embedding-3-small 作为嵌入模型：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>生成一个测试嵌入并打印其尺寸和前几个元素：</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>输出：</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">将数据载入 Milvus</h3><p><strong>创建 Collections：</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>关于 MilvusClient 配置的说明：</p>
<ul>
<li><p>将 URI 设置为本地文件（如<code translate="no">./milvus.db</code> ）是最简单的选项。它会自动使用 Milvus Lite 将所有数据存储到该文件中。</p></li>
<li><p>对于大规模数据，可以在 Docker 或 Kubernetes 上部署性能更强的 Milvus 服务器。在这种情况下，请使用服务器 URI（如<code translate="no">http://localhost:19530</code> ）。</p></li>
<li><p>要使用 Zilliz Cloud（Milvus 的完全托管云版本），请从 Zilliz Cloud 控制台将 URI 和令牌设置为公共端点和 API 密钥。</p></li>
</ul>
<p>检查 Collections 是否已存在，如果已存在，则将其删除：</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>使用指定参数创建新 Collections。如果不提供字段定义，Milvus 会自动创建一个默认的<code translate="no">id</code> 字段作为主键，并为向量数据创建一个<code translate="no">vector</code> 字段。保留的 JSON 字段存储 Schema 中未定义的任何字段和值：</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">插入数据</h3><p>遍历文本行，生成 Embeddings，并将数据插入 Milvus。这里的<code translate="no">text</code> 字段没有在 Schema 中定义。它会自动添加为一个动态字段，由 Milvus 的预留 JSON 字段支持：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>输出：</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">构建 RAG 管道</h3><p><strong>检索相关文档：</strong></p>
<p>让我们提出一个有关 Milvus 的常见问题：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>在 Collections 中搜索前 3 个最相关的结果：</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>结果按距离排序，最近的优先：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>使用 LLM 生成回复：</strong></p>
<p>将检索到的文档合并为上下文字符串：</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>设置系统和用户提示。根据从 Milvus 检索到的文档建立用户提示：</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>调用 GLM-5 生成最终答案：</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 返回一个结构良好的答案：</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">结论：选择模型，然后构建管道<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>这三种模型都很强大，但它们的强项各不相同。当推理深度比成本更重要时，Gemini 3 Deep Think 是最佳选择。对于需要本地部署和系统级工程的团队来说，GLM-5 是最佳的开源选择。MiniMax M2.5 适合在生产工作负载中优化吞吐量和预算。</p>
<p>选择什么样的模型只是成功的一半。要将上述任何一种模式转化为有用的应用，您都需要一个能够随数据扩展的检索层。这正是 Milvus 的优势所在。上述 RAG 教程适用于任何与 OpenAI 兼容的模型，因此在 GLM-5、MiniMax M2.5 或任何未来版本之间切换只需更改一行即可。</p>
<p>如果您正在设计本地或内部部署的 AI Agents，并希望更详细地讨论存储架构、会话设计或安全回滚，请随时加入我们的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 频道</a>。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>预约 20 分钟的一对一服务，获得个性化指导。</p>
<p>如果您想更深入地了解如何构建人工智能 Agents，这里有更多资源可以帮助您入门。</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">如何使用 Agents 和 Milvus 构建生产就绪的多代理系统</a></p></li>
<li><p><a href="https://zilliz.com/learn">为您的 RAG 管道选择合适的 Embeddings 模型</a></p></li>
<li><p><a href="https://zilliz.com/learn">如何使用 Milvus 构建人工智能 Agents</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">什么是 OpenClaw？开源人工智能代理完全指南</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw教程：为本地人工智能助理连接到Slack</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">用 LangGraph 和 Milvus 构建爪机式人工智能代理</a></p></li>
</ul>
