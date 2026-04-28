---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: DeepSeek V4 vs GPT-5.5 vs Qwen3.6：您应该使用哪种模型？
author: Lumina Wang
date: 2026-4-28
cover: >-
  assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_1_98e0113041.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  在检索、调试和长语境测试中比较 DeepSeek V4、GPT-5.5 和 Qwen3.6，然后用 DeepSeek V4 建立 Milvus RAG
  管道。
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>新模型发布的速度比生产团队对其进行评估的速度还要快。DeepSeek V4、GPT-5.5 和 Qwen3.6-35B-A3B 在纸面上看起来都很强大，但对于人工智能应用开发人员来说，更难解决的问题是实际问题：对于检索繁重的系统、编码任务、长语境分析和<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 管道</a>，应该使用哪种模型？</p>
<p><strong>本文在实际测试中比较了三种模型：</strong>实时信息检索、并发调试调试和长上下文标记检索。然后，它展示了如何将 DeepSeek V4 连接到<a href="https://zilliz.com/learn/what-is-vector-database">Milvus 向量数据库</a>，从而使检索到的上下文来自可搜索的知识库，而不是仅靠模型的参数。</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">什么是DeepSeek V4、GPT-5.5和Qwen3.6-35B-A3B？<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4、GPT-5.5 和 Qwen3.6-35B-A3B 是针对模型堆栈不同部分的不同人工智能模型。</strong>DeepSeek V4 侧重于开放式长语境推理。GPT-5.5 侧重于前沿托管性能、编码、在线研究和重工具任务。Qwen3.6-35B-A3B 侧重于开放式多模式部署，主动参数占用空间更小。</p>
<p>比较之所以重要，是因为<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">生产型向量搜索</a>系统很少单独依赖模型。模型能力、上下文长度、部署控制、检索质量和服务成本都会影响最终的用户体验。</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4：用于长语境成本控制的开放式重量矢量模型</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>是DeepSeek于2026年4月24日发布的开放式重量MoE模型系列。</strong>官方版本列出了两个变体：DeepSeek V4-Pro 和 DeepSeek V4-Flash。V4-Pro 拥有 1.6T 总参数，每个令牌激活 49B 参数，而 V4-Flash 拥有 284B 总参数，每个令牌激活 13B 参数。两者都支持 100 万标记上下文窗口。</p>
<p><a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">DeepSeek V4-Pro 模型卡</a>还将该模型列为麻省理工学院授权，并通过 Hugging Face 和 ModelScope 提供。对于构建长上下文文档工作流的团队来说，与完全封闭的前沿应用程序接口相比，DeepSeek V4-Pro 的主要吸引力在于成本控制和部署灵活性。</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5：用于编码、研究和工具使用的托管前沿模型</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>是 OpenAI 于 2026 年 4 月 23 日发布的封闭前沿模型。</strong>OpenAI 将其定位为编码、在线研究、数据分析、文档工作、电子表格工作、软件操作以及基于工具的任务。官方模型文档列出了<code translate="no">gpt-5.5</code> ，API 上下文窗口为 1M-token，而 Codex 和 ChatGPT 的产品限制可能有所不同。</p>
<p>OpenAI 的编码基准测试结果非常出色：在 Terminal-Bench 2.0 上的得分率为 82.7%，在 Expert-SWE 上的得分率为 73.1%，在 SWE-Bench Pro 上的得分率为 58.6%。代价是价格：官方 API 定价中，GPT-5.5 为<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>每</mn></mrow><annotation encoding="application/x-tex">1M 输入令牌</annotation><mrow><mi>5</mi><mn>个</mn></mrow><annotation encoding="application/x-tex">，</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"></span></span></span></span>为每 1M 输入令牌 5 个<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">，</annotation></semantics></math></span></span>每 1M 输出令牌<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">30</span></span></span></span>个，然后才是特定产品或长上下文的定价细节。</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B：适用于本地和多模式工作负载的小型有源参数模型</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>是阿里巴巴 Qwen 团队推出的一款开放式重量级 MoE 模型。</strong>其模型卡列出了 35B 总参数、3B 激活参数、视觉编码器和 Apache-2.0 许可。它支持本地 262,144 个代币的上下文窗口，并可通过 YaRN 扩展到约 1,010,000 个代币。</p>
<p>这使得 Qwen3.6-35B-A3B 在本地部署、私人服务、图像文本输入或中文工作负载比管理前沿模型的便利性更重要时更具吸引力。</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6：模型规格比较</h3><table>
<thead>
<tr><th>模型</th><th>部署模型</th><th>公开参数信息</th><th>上下文窗口</th><th>最强拟合</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>开放重量的 MoE；提供 API</td><td>总计 1.6T / 49B 激活</td><td>100 万个令牌</td><td>长语境、成本敏感型工程部署</td></tr>
<tr><td>GPT-5.5</td><td>托管封闭模型</td><td>未披露</td><td>API 中有 100 万个代币</td><td>编码、实时研究、工具使用和最高综合能力</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>开放式重量级多模式 MoE</td><td>总计 35B / 活跃 3B</td><td>262K 本机； ~1M 带 YaRN</td><td>本地/私有部署、多模态输入和中文场景</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">我们如何测试 DeepSeek V4、GPT-5.5 和 Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>这些测试不能取代完整的基准套件。它们是反映开发人员常见问题的实用检查：模型能否检索当前信息、推理细微的代码错误，以及在冗长的文档中查找事实？</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">哪种模型能最好地处理实时信息检索？</h3><p>我们使用网络搜索向每个模型提出了三个时效性问题。指令很简单：只返回答案并包含源 URL。</p>
<table>
<thead>
<tr><th>问题</th><th>测试时的预期答案</th><th>来源</th></tr>
</thead>
<tbody>
<tr><td>通过 OpenAI API 使用<code translate="no">gpt-image-2</code> 生成 1024×1024 中等质量图像的成本是多少？</td><td><code translate="no">$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">OpenAI 图像生成定价</a></td></tr>
<tr><td>本周公告牌百大热门歌曲中排名第一的是哪首歌，演唱者是谁？</td><td><code translate="no">Choosin' Texas</code> 作者：Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">公告牌百强榜</a></td></tr>
<tr><td>目前谁在 2026 年 F1 车手积分榜上领先？</td><td>基米-安东内利</td><td><a href="https://www.formula1.com/en/results/2026/drivers">一级方程式车手排名</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>注：这些问题具有时效性。预期答案反映的是我们进行测试时的结果。</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>OpenAI 的图片定价页面使用 "medium "标签，而不是 0.053 美元 1024×1024 结果的 "standard "标签，因此此处对问题进行了规范化处理，以符合当前 API 的措辞。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">实时检索结果：GPT-5.5 优势最明显</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro 错误地回答了第一个问题。在这种设置下，它无法通过实时网络搜索回答第二和第三个问题。</p>
<p>第二个答案包含正确的公告牌 URL，但没有检索到当前排名第一的歌曲。第三个答案使用了错误的来源，因此我们将其计入错误答案。</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 在这次测试中的表现要好得多。它的答案简短、准确、有来源且快速。当一项任务依赖于当前的信息，而模型又有实时检索功能时，GPT-5.5 在这个设置中优势明显。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B 的结果与 DeepSeek V4-Pro 类似。在此设置中，它没有实时网络访问权限，因此无法完成实时检索任务。</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">哪种模型更擅长调试并发错误？<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>第二个测试使用了一个 Python 银行转账示例，其中包含三层并发问题。我们的任务不仅仅是找到明显的竞赛条件，还要解释为什么总余额会中断，并提供修正代码。</p>
<table>
<thead>
<tr><th>层</th><th>问题</th><th>出错原因</th></tr>
</thead>
<tbody>
<tr><td>基本问题</td><td>竞赛条件</td><td><code translate="no">if self.balance &gt;= amount</code> 和<code translate="no">self.balance -= amount</code> 不是原子性的。两个线程可以同时通过余额检查，然后都减去钱。</td></tr>
<tr><td>中级</td><td>死锁风险</td><td>当转账 A→B 先锁定 A，而转账 B→A 先锁定 B 时，天真的按账户锁定会导致死锁。这就是典型的 ABBA 死锁。</td></tr>
<tr><td>高级</td><td>锁定范围不正确</td><td>只保护<code translate="no">self.balance</code> 不能保护<code translate="no">target.balance</code> 。正确的解决方法必须以稳定的顺序锁定两个账户，通常是按账户 ID 锁定，或者使用并发度较低的全局锁。</td></tr>
</tbody>
</table>
<p>提示和代码如下所示：</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">代码调试结果：GPT-5.5 提供了最完整的答案</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro 的分析简明扼要，直接给出了有序锁解决方案，这是避免 ABBA 死锁的标准方法。它的答案展示了正确的修复方法，但没有花太多时间解释为什么基于锁的天真修复方法会引入新的故障模式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 在本次测试中表现最佳。它发现了核心问题，预见了死锁风险，解释了原始代码可能失败的原因，并提供了完整的修正实现。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B 准确地找出了错误，其示例执行顺序也很清晰。较弱的部分是修复方法：它选择了全局类级锁，使每个账户共享相同的锁。这对于小型模拟来说是可行的，但对于真正的银行系统来说，这是个糟糕的折衷方案，因为不相关的账户转账仍必须等待同一个锁。</p>
<p><strong>简而言之：</strong>GPT-5.5 不仅解决了当前的错误，还对开发人员可能引入的下一个错误提出了警告。DeepSeek V4-Pro 提供了最简洁的非 GPT 修复。Qwen3.6 发现了问题并生成了可行的代码，但没有指出可扩展性方面的缺陷。</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">哪种模型能最好地处理长文本检索？<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>在长文本测试中，我们使用了《<em>红楼梦</em>》全文，大约有 85 万个汉字。我们在 50 万字左右的位置插入了一个隐藏标记：</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>然后，我们将文件上传到每个模型，要求它同时找到标记内容及其位置。</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">长文本检索结果：GPT-5.5 最精确地找到了标记</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro 找到了隐藏的标记，但没有找到正确的字符位置。它还给出了错误的周边上下文。在这次测试中，它似乎从语义上找到了标记，但在对文档进行推理时却找不到确切的位置。</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 能正确找到标记内容、位置和周围上下文。它将位置报告为 500,002，甚至还区分了零索引和单索引计数。周围上下文也与插入标记时使用的文本相符。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B 能正确找到标记内容和周围上下文，但对位置的估计有误。</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">这些测试说明了什么？<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>这三个测试表明了一种实用的选择模式：<strong>GPT-5.5 是能力型选择，DeepSeek V4-Pro 是长语境性价比型选择，Qwen3.6-35B-A3B 是本地控制型选择。</strong></p>
<table>
<thead>
<tr><th>模型</th><th>最佳匹配</th><th>测试结果</th><th>主要注意事项</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>综合能力最强</td><td>在实时检索、并发调试和长上下文标记测试中获胜</td><td>成本较高；当准确性和工具使用证明其价格合理时，性能最强</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>长上下文、低成本部署</td><td>对并发错误提供了最强的非 GPT 修复，并找到了标记内容</td><td>实时网络任务需要外部检索工具；在本测试中，精确字符位置跟踪功能较弱</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>本地部署、开放权重、多模态输入、中文工作负载</td><td>在错误识别和长语境理解方面表现良好</td><td>修复质量的可扩展性较差；在此设置中无法进行实时网络访问</td></tr>
</tbody>
</table>
<p>当您需要最强的结果时，使用 GPT-5.5，成本是次要的。当您需要长上下文、较低的服务成本和便于 API 部署时，请使用 DeepSeek V4-Pro。当最需要开放权重、私有部署、多模式支持或服务栈控制时，使用 Qwen3.6-35B-A3B。</p>
<p>不过，对于检索繁重的应用来说，模型的选择只是成功的一半。当上下文由专门的<a href="https://zilliz.com/learn/generative-ai">语义搜索系统</a>进行检索、过滤和基础处理时，即使是强大的长上下文模型也会有更好的表现。</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">为什么 RAG 对长上下文模型仍然重要<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>长语境窗口不会消除检索需求。它改变了检索策略。</p>
<p>在 RAG 应用程序中，模型不应在每次请求时扫描每份文档。<a href="https://zilliz.com/learn/introduction-to-unstructured-data">向量数据库架构</a>可以存储 Embeddings，搜索语义相关的块，应用元数据过滤器，并向模型返回一个紧凑的上下文集。这就为模型提供了更好的输入，同时降低了成本和延迟。</p>
<p>Milvus 符合这一角色，因为它能在一个系统中处理<a href="https://milvus.io/docs/schema.md">Collections</a> 模式、向量索引、标量元数据和检索操作。您可以从本地使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> 开始，转到独立的<a href="https://milvus.io/docs/quickstart.md">Milvus</a> Standalone<a href="https://milvus.io/docs/quickstart.md">快速启动</a>，使用<a href="https://milvus.io/docs/install_standalone-docker.md">Docker 安装</a>或<a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose 部署</a>，并在工作负载增长时使用<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Kubernetes 部署</a>进一步扩展。</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">如何使用 Milvus 和 DeepSeek V4 构建 RAG 管道<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>下面的演练使用DeepSeek V4-Pro生成RAG，使用Milvus检索RAG。同样的结构适用于其他 LLMs：创建 Embeddings，将其存储在 Collections 中，搜索相关上下文，并将上下文传递到模型中。</p>
<p>如需更广泛的演示，请参阅<a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus RAG</a> 官方<a href="https://milvus.io/docs/build-rag-with-milvus.md">教程</a>。本示例保持了较小的管道，因此检索流程易于检查。</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">准备环境<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">安装依赖项</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>如果使用的是 Google Colab，安装依赖项后可能需要重启运行时。点击<strong>运行时</strong>菜单，然后选择<strong>重新启动会话</strong>。</p>
<p>DeepSeek V4-Pro 支持 OpenAI 风格的 API。登录 DeepSeek 官方网站，将<code translate="no">DEEPSEEK_API_KEY</code> 设置为环境变量。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">准备 Milvus 文档数据集</h3><p>我们使用<a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus 2.4.x 文档归档</a>中的常见问题页面作为私有知识源。这是一个用于小型 RAG 演示的简单启动数据集。</p>
<p>首先，下载 ZIP 文件并将文档解压缩到<code translate="no">milvus_docs</code> 文件夹中。</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>我们从<code translate="no">milvus_docs/en/faq</code> 文件夹中加载所有 Markdown 文件。对于每个文档，我们按<code translate="no">#</code> 对文件内容进行拆分，大致划分出主要的 Markdown 部分。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">设置 DeepSeek V4 和嵌入模型</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>接下来，选择嵌入模型。本例使用 PyMilvus 模型模块中的<code translate="no">DefaultEmbeddingFunction</code> 。有关<a href="https://milvus.io/docs/embeddings.md">嵌入函数</a>的更多信息，请参阅 Milvus 文档。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>生成一个测试向量，然后打印向量维数和前几个元素。返回的维度将在创建 Milvus Collections 时使用。</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">将数据载入 Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">创建 Milvus 集合</h3><p>Milvus Collections 可存储向量字段、标量字段和可选的动态元数据。下面的快速设置使用的是高级<code translate="no">MilvusClient</code> API；关于生产 Schema，请查看有关<a href="https://milvus.io/docs/manage-collections.md">集合管理</a>和<a href="https://milvus.io/docs/create-collection.md">创建 Collections</a> 的文档。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>关于<code translate="no">MilvusClient</code> 的几点说明：</p>
<ul>
<li>将<code translate="no">uri</code> 设置为本地文件（如<code translate="no">./milvus.db</code> ）是最简单的选择，因为它会自动使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>并将所有数据存储在该文件中。</li>
<li>如果数据集较大，可以在<a href="https://milvus.io/docs/quickstart.md">Docker 或 Kubernetes</a> 上设置性能更高的 Milvus 服务器。在这种设置中，使用服务器 URI（如<code translate="no">http://localhost:19530</code> ）作为<code translate="no">uri</code> 。</li>
<li>如果您想使用<a href="https://docs.zilliz.com/">Zilliz Cloud</a>（Milvus 的完全托管云服务），请将<code translate="no">uri</code> 和<code translate="no">token</code> 设置为 Zilliz Cloud 的<a href="https://docs.zilliz.com/docs/connect-to-cluster">公共端点和 API 密钥</a>。</li>
</ul>
<p>检查 Collections 是否已存在。如果存在，请将其删除。</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>使用指定参数创建新 Collections。如果我们没有指定字段信息，Milvus 会自动创建一个默认的<code translate="no">id</code> 字段作为主键，并创建一个向量字段来存储向量数据。保留的 JSON 字段存储 Schema 中未定义的标量数据。</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">IP</code> 度量指的是内积相似度。根据向量类型和工作量，Milvus 还支持其他度量类型和索引选择；请参阅<a href="https://milvus.io/docs/id/metric.md">度量类型</a>和<a href="https://milvus.io/docs/index_selection.md">索引选择</a>指南。<code translate="no">Strong</code> 设置是可用的<a href="https://milvus.io/docs/consistency.md">一致性级别</a>之一。</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">插入 Embeddings 文档</h3><p>遍历文本数据，创建嵌入，并将数据插入 Milvus。在此，我们添加一个名为<code translate="no">text</code> 的新字段。由于它没有在 Collections Schema 中明确定义，因此会自动添加到预留的动态 JSON 字段中。对于生产元数据，请查看<a href="https://milvus.io/docs/enable-dynamic-field.md">动态字段支持</a>和<a href="https://milvus.io/docs/json-field-overview.md">JSON 字段概述</a>。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>对于较大的数据集，同样的模式可通过显式 Schema 设计、<a href="https://milvus.io/docs/index-vector-fields.md">向量字段索引</a>、标量索引以及数据生命周期操作（如<a href="https://milvus.io/docs/insert-update-delete.md">插入、上载和删除）</a>进行扩展。</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">构建 RAG 检索流程<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">搜索 Milvus 的相关上下文</h3><p>让我们定义一个有关 Milvus 的常见问题。</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>在 Collections 中搜索该问题，并检索语义匹配度最高的三个问题。这是一个基本<a href="https://milvus.io/docs/single-vector-search.md">的单向量搜索</a>。在生产中，您可以将其与<a href="https://milvus.io/docs/filtered-search.md">过滤搜索</a>、<a href="https://milvus.io/docs/full-text-search.md">全文搜索</a>、<a href="https://milvus.io/docs/multi-vector-search.md">多向量混合搜索</a>和<a href="https://milvus.io/docs/reranking.md">Rerankers 策略</a>相结合，以提高相关性。</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>现在让我们看看查询的搜索结果。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">使用DeepSeek V4生成RAG答案</h3><p>将检索到的文档转换为字符串格式。</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>为 LLM 定义系统和用户提示。该提示由从 Milvus 检索到的文档组装而成。</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>使用 DeepSeek V4-Pro 提供的模型，根据提示生成回答。</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>至此，管道已经完成了核心的 RAG 循环：嵌入文档、在 Milvus 中存储向量、搜索相关上下文、使用 DeepSeek V4-Pro 生成答案。</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">生产前需要改进哪些方面？<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>演示使用了简单的分段和顶k检索。这足以展示其机制，但生产型 RAG 通常需要更多检索控制。</p>
<table>
<thead>
<tr><th>生产需要</th><th>需要考虑的 Milvus 功能</th><th>为何有帮助</th></tr>
</thead>
<tbody>
<tr><td>混合语义和关键词信号</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">与 Milvus 混合搜索</a></td><td>将密集向量检索与稀疏或全文信号相结合</td></tr>
<tr><td>合并来自多个检索器的结果</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Milvus 混合搜索检索器</a></td><td>让 LangChain 工作流程使用加权或 RRF 式排序</td></tr>
<tr><td>根据租户、时间戳或文档类型限制结果</td><td>元数据和标量过滤器</td><td>将检索范围保持在正确的数据片段上</td></tr>
<tr><td>从自我管理的 Milvus 迁移到托管服务</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">从 Milvus 迁移到 Zilliz</a></td><td>减少基础架构工作，同时保持 Milvus 兼容性</td></tr>
<tr><td>安全连接托管应用程序</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Zilliz Cloud API 密钥</a></td><td>为应用程序客户端提供基于令牌的访问控制</td></tr>
</tbody>
</table>
<p>最重要的生产习惯是将检索与生成分开评估。如果检索的上下文很弱，交换 LLM 往往会掩盖问题，而不是解决问题。</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">开始使用 Milvus 和 DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>如果你想重现本教程，请从<a href="https://milvus.io/docs">Milvus</a>官方<a href="https://milvus.io/docs">文档</a>和<a href="https://milvus.io/docs/build-rag-with-milvus.md">用 Milvus 构建 RAG 指南</a>开始。要进行托管设置，请使用集群端点和API密钥<a href="https://docs.zilliz.com/docs/connect-to-cluster">连接Zilliz Cloud</a>，而不要在本地运行Milvus。</p>
<p>如果你想获得分块、索引、过滤器或混合检索方面的帮助，请加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>或预约免费的<a href="https://milvus.io/office-hours">Milvus Office Hours 会议</a>。如果你想跳过基础架构设置，请使用<a href="https://cloud.zilliz.com/login">Zilliz Cloud登录</a>或创建一个<a href="https://cloud.zilliz.com/signup">Zilliz Cloud账户</a>来运行托管的Milvus。</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">开发人员提出的关于DeepSeek V4、Milvus和RAG的问题<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">DeepSeek V4适合RAG吗？</h3><p>DeepSeek V4-Pro非常适合RAG，当您需要长语境处理和比高级封闭模型更低的服务成本时。您仍然需要一个检索层（如Milvus）来选择相关块、应用元数据过滤器并保持提示重点。</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">RAG 管道应该使用 GPT-5.5 还是 DeepSeek V4？</h3><p>当答案质量、工具使用和实时研究比成本更重要时，使用 GPT-5.5。当长语境处理和成本控制更为重要时，尤其是当检索层已经提供了高质量的基础语境时，使用DeepSeek V4-Pro。</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">我能否在本地运行Qwen3.6-35B-A3B，进行私人RAG？</h3><p>可以，Qwen3.6-35B-A3B 是开放式的，旨在实现更可控的部署。当需要保护隐私、本地服务、多模态输入或中文性能时，Qwen3.6-35B-A3B 是一个不错的选择，但您仍需要验证硬件的延迟、内存和检索质量。</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">长语境模型是否使向量数据库成为多余？</h3><p>不。长语境模型可以读取更多文本，但它们仍能从检索中获益。向量数据库可以将输入缩小到相关的块，支持元数据过滤，降低令牌成本，并使应用程序在文档发生变化时更容易更新。</p>
