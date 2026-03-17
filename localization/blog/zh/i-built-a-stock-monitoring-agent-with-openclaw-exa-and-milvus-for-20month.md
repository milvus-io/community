---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: 我用 OpenClaw、Exa 和 Milvus 创建了一个股票监控 Agents，每月只需 20 美元
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: 使用 OpenClaw、Exa 和 Milvus 构建人工智能股票监控代理的分步指南。晨间简报、交易记忆和警报，每月 20 美元。
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>我的业余爱好是交易美股，说得客气点就是赔钱。我的同事开玩笑说，我的策略是 "兴奋时高价买入，恐惧时低价卖出，每周重复"。</p>
<p>重复的部分是我的致命伤。每次我盯着市场，最终都会做一笔我没计划好的交易。石油价格飙升，我恐慌性抛售。某只科技股大涨 4%，我追涨。一周后，我看着自己的交易记录，<em>上个季度我不也是这么做的吗？</em></p>
<p>于是，我用 OpenClaw 建立了一个 Agents，代替我观察市场，阻止我犯同样的错误。它不会进行交易，也不会碰我的钱，因为那样会有太多的安全风险。相反，它节省了我观察市场的时间，让我不再犯同样的错误。</p>
<p>这个 Agents 由三部分组成，每月费用约 20 美元：</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>，用于自动运行这一切。</strong>OpenClaw 以 30 分钟心跳一次的频率运行代理，只有在真正重要的事情发生时才会呼叫我，这缓解了过去让我目不转睛盯着屏幕的 FOMO。以前，我越是关注价格，就越会做出冲动的反应。</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>提供准确、实时的搜索。</strong>Exa 按计划浏览和汇总精心挑选的信息来源，因此我每天早上都能得到一份简洁的简报。以前，我每天都要花一个小时在搜索引擎优化垃圾信息和猜测中寻找可靠的新闻，而这无法实现自动化，因为金融网站每天都要更新，以打击垃圾信息。</li>
<li><strong><a href="https://milvus.io/">Milvus</a></strong> <strong>用于个人历史和偏好。</strong>Milvus 存储了我的交易历史，在我做出决定之前，Agents 会对其进行搜索--如果我即将重复我后悔过的事情，它会告诉我。以前，回顾过去的交易非常乏味，我就没有回顾，所以同样的错误在不同的股票上不断发生。<a href="https://zilliz.com/cloud">Zilliz Cloud</a>是 Milvus 的全托管版本。如果您想获得省心的体验，Zilliz Cloud 是一个不错的选择<a href="https://cloud.zilliz.com/signup">（提供免费级别</a>）。</li>
</ul>
<p>下面是我的设置步骤。</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">第一步：使用 Exa 获取实时市场情报<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>在此之前，我曾尝试过浏览金融应用程序、编写刮板程序以及研究专业数据终端。我的经验是？应用程序将信号掩盖在噪音之下，搜索器经常出现故障，而专业 API 的价格又高得令人望而却步。Exa 是专为人工智能 Agents 打造的搜索 API，可以解决上述问题。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong>是一个网络搜索 API，可为人工智能 Agents 返回结构化的人工智能就绪数据。它由<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（Milvus 的全托管服务）提供支持。如果说 Perplexity 是人类使用的搜索引擎，那么 Exa 则是人工智能使用的搜索引擎。代理发送查询，Exa 会以 JSON 格式返回文章文本、关键句和摘要--结构化输出，代理可以直接解析并采取行动，无需刮擦。</p>
<p>Exa 还在引擎盖下使用语义搜索，因此代理可以使用自然语言进行查询。像 "英伟达 2026 年第四季度盈利强劲，但股价为何下跌 "这样的查询会返回路透社和彭博社的分析师分析，而不是一页 SEO 点击广告。</p>
<p>Exa 有一个免费层级--每月 1,000 次搜索，绰绰有余。安装 SDK 并交换自己的 API 密钥，即可开始使用：</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>下面是核心调用：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>内容参数在这里完成了大部分繁重的工作--文本提取整篇文章，高亮提取关键句子，摘要根据你提供的问题生成重点摘要。调用一次应用程序接口就能代替二十分钟的标签页跳转。</p>
<p>这种基本模式涵盖了很多内容，但我最终构建了四种变体，以处理我经常遇到的不同情况：</p>
<ul>
<li><strong>根据来源可信度过滤。</strong>对于盈利分析，我只需要路透社、彭博社或《华尔街日报》，而不是十二小时后改写报道的内容农场。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>寻找类似的分析。</strong>当我读到一篇好文章时，我希望能从更多角度了解同一主题，而无需手动搜索。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>深入搜索复杂问题。</strong>有些问题不是一篇文章就能回答的，比如中东紧张局势如何影响半导体供应链。深度搜索可综合多个来源，并返回结构化摘要。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>实时新闻监控。</strong>在市场交易时段，我需要将突发新闻过滤为当天的新闻。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>我使用这些模式编写了十几个模板，涵盖美联储政策、科技盈利、油价和宏观指标。它们每天早上自动运行，并将结果推送到我的手机上。以前需要花一个小时浏览的内容，现在只需要花五分钟边喝咖啡边阅读摘要。</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">第二步：在 Milvus 中存储交易历史，做出更明智的决策<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa 解决了我的信息问题。但我仍在重复同样的交易--在跌势中恐慌性抛售，但没过几天就恢复了；追逐势头，买入价格已经过高的股票。我凭情绪行事，一旦遇到类似情况就会后悔，忘记教训。</p>
<p>我需要一个个人知识库：一个可以存储我过去的交易、我的推理和我的失误的东西。这不是我必须手动复习的东西（我试过，但从未坚持下来），而是每当出现类似情况时，Agent 可以自行搜索的东西。如果我即将重蹈覆辙，我希望 Agents 能在我按下按钮之前告诉我。将 "当前情况 "与 "过去经验 "进行匹配是向量数据库可以解决的相似性搜索问题，因此我选择了一个向量数据库来存储我的数据。</p>
<p>我使用的是<a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>，它是 Milvus 的轻量级版本，可在本地运行。它没有服务器设置，非常适合原型设计和实验。我把数据分成了三个 Collections。嵌入维度为 1536，以匹配 OpenAI 的文本嵌入-3-小模型，可以直接使用：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>这三个 Collection 映射了三种类型的个人数据，每种数据都有不同的检索策略：</p>
<table>
<thead>
<tr><th><strong>类型</strong></th><th><strong>存储内容</strong></th><th><strong>Agents 如何使用</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>偏好</strong></td><td>偏好、风险承受能力、投资理念（"我倾向于长期持有科技股）</td><td>每次运行时加载到代理的上下文中</td></tr>
<tr><td><strong>决策与模式</strong></td><td>过去的具体交易、经验教训、市场观察</td><td>仅在出现相关情况时通过相似性搜索获取</td></tr>
<tr><td><strong>外部知识</strong></td><td>研究报告、美国证券交易委员会文件、公共数据</td><td>不存储在 Milvus - 可通过 Exa 搜索</td></tr>
</tbody>
</table>
<p>我建立了三个不同的 Collections，因为将这些内容混合到一个 Collections 中，要么意味着用不相关的交易历史臃肿每个提示，要么意味着当核心偏差与当前查询不够匹配时会丢失核心偏差。</p>
<p>一旦有了这些 Collections，我就需要一种自动填充它们的方法。我不想在每次与 Agents 对话后都复制粘贴信息，因此我创建了一个内存提取器，在每次聊天会话结束时运行。</p>
<p>提取器有两个功能：提取和重复。提取器要求 LLM 从对话中提取结构化的见解--决定、偏好、模式、经验教训--并将每一条都转到正确的 Collections 中。在存储任何内容之前，它会对照已有内容检查相似性。如果新见解与现有条目相似度超过 92%，就会被跳过。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>当我面临新的市场形势，有交易的冲动时，Agent 会运行一个召回功能。我描述正在发生的事情，它就会搜索所有三个 Collections 中的相关历史记录：</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>例如，3 月初中东紧张局势导致科技股下跌 3-4%，Agents 调用了三样东西：2024 年 10 月关于在地缘政治下跌期间不要恐慌性抛售的教训、我倾向于超配地缘政治风险的偏好说明，以及我记录的模式（地缘政治导致的科技股大跌通常会在一到三周内恢复）。</p>
<p>我的同事认为：如果你的训练数据是一个失败的记录，那么人工智能到底在学习什么？但这正是问题的关键所在--代理并不是在复制我的交易，而是在记住它们，以便说服我放弃下一次交易。</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">第三步：用 OpenClaw 技能教你的代理进行分析<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>此时，Agent 拥有可靠的信息<a href="https://exa.ai/">（Exa</a>）和个人记忆<a href="https://github.com/milvus-io/milvus-lite">（Milvus</a>）。但是，如果你把这两样东西都交给一个 LLM，然后说 "分析一下这个"，你会得到一个通用的、对冲一切的回复。它提到了每一个可能的角度，并以 "投资者应权衡风险 "作为结论。还不如什么都不说。</p>
<p>解决的办法是编写自己的分析框架，并将其作为明确的指令交给 Agents。你必须告诉它你关心哪些指标，你认为哪些情况是危险的，什么时候应该保守，什么时候应该激进。这些规则对每个投资者都不一样，因此您必须自己定义。</p>
<p>OpenClaw通过 "技能"（skills/目录下的markdown文件）来实现这一点。当 Agents 遇到相关情况时，它会加载匹配的 Skill，并遵循你的框架，而不是自由发挥。</p>
<p>下面是我写的一个用于在财报发布后评估股票的技能：</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>最后一行是最重要的："总是浮现我过去的错误。我有一种让恐惧凌驾于数据之上的倾向。如果我的 Milvus 历史记录显示我在下跌后后悔卖出，那就明确地说出来"。这就是我告诉 Agents 我到底错在哪里，让它知道什么时候该反击。如果你自己开发，这部分内容可以根据你的偏好进行定制。</p>
<p>我为情绪分析、宏观指标和行业轮动信号编写了类似的 Skills。我还编写了模拟我欣赏的投资者如何评估相同情况的 "技能"--巴菲特的价值框架、桥水的宏观方法。这些不是决策者，而是额外的视角。</p>
<p>警告：不要让 LLM 计算 RSI 或 MACD 等技术指标。他们会自信地幻化出数字。自己计算这些指标或调用专用 API，并将结果作为输入输入到 Skill 中。</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">第 4 步：使用 OpenClaw Heartbeat 启动 Agents<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>以上所有步骤都需要手动触发。如果每次需要更新时都要打开终端，那么在会议期间，你实际上又回到了在经纪应用程序上滚动的状态。</p>
<p>OpenClaw 的心跳机制解决了这个问题。网关每隔 30 分钟（可配置）ping 一次 Agents，Agent 会检查 HEARTBEAT.md 文件，以决定此时该做什么。这是一个基于时间规则的标记文件：</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">结果：减少屏幕时间，减少冲动交易<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是该系统每天实际产生的结果：</p>
<ul>
<li><strong>早晨简报（上午 7:00）。</strong>Agents 隔夜运行 Exa，从 Milvus 中提取我的仓位和相关历史记录，然后向我的手机推送一份个性化摘要--少于 500 字。一夜之间发生了什么，与我的持股有什么关系，以及一到三个行动项目。我一边刷牙一边阅读。</li>
<li><strong>日内提醒（东部时间上午 9:30 至下午 4:00）。</strong>每隔 30 分钟，Agent 会检查我的观察列表。如果有任何股票变动超过 3%，我就会收到通知，并说明相关情况：我为什么买入它，我的止损点在哪里，以及我以前是否遇到过类似情况。</li>
<li><strong>每周回顾（周末）。</strong>Agents 汇总了整周的情况--市场走势、与我早上的预期相比如何，以及值得记住的模式。我在周六花 30 分钟阅读。本周其余时间，我有意远离屏幕。</li>
</ul>
<p>最后一点是最大的改变。Agents 不仅节省了时间，还让我从观察市场中解放出来。如果不看价格，就无法恐慌性抛售。</p>
<p>在使用这套系统之前，我每周要花 10-15 个小时来收集信息、监控市场和审查交易，这些时间分散在开会、通勤和深夜浏览网页上。现在大约只需 2 个小时：每天早上 5 分钟的简报，加上周末 30 分钟的回顾。</p>
<p>信息质量也更好了。我阅读的是路透社和彭博社的摘要，而不是 Twitter 上的热门话题。每当我想采取行动时，Agents 就会提醒我过去的错误，这让我大大减少了冲动交易。我还不能证明这让我成为了一个更好的投资者，但它让我不再那么鲁莽。</p>
<p>总成本：OpenClaw 每月 10 美元，Exa 每月 10 美元，以及 Milvus Lite 运行所需的电费。</p>
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
    </button></h2><p>我一直在做同样冲动的交易，因为我的信息很糟糕，我很少回顾自己的历史，整天盯着市场让情况变得更糟。因此，我建立了一个人工智能 Agents，通过做三件事来解决这些问题：</p>
<ul>
<li>用<strong><a href="https://exa.ai/">Exa</a></strong><strong>收集可靠的市场新闻</strong>，取代一小时滚动浏览 SEO 垃圾邮件和付费网站的时间。</li>
<li>用<a href="http://milvus.io">Milvus</a><strong>记住我过去的交易</strong>，并在我即将重蹈覆辙时发出警告。</li>
<li>通过<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a><strong>自动运行</strong>，只有在真正重要的时候才会向我发送 pings。</li>
</ul>
<p>总成本：20 美元/月。Agents 不交易，也不碰我的钱。</p>
<p>最大的变化不是数据或警报。而是我不再关注市场了。上周三我完全忘了这回事，这在我多年的交易生涯中从未发生过。我有时还是会亏钱，但次数少了很多，而且我又开始享受周末了。我的同事们还没有更新这个笑话，但给它点时间吧。</p>
<p>Agents 也只花了两个周末就建立起来了。一年前，同样的设置意味着要从头开始编写调度程序、通知管道和内存管理。有了 OpenClaw，大部分时间都花在了明确自己的交易规则上，而不是编写基础架构。</p>
<p>一旦你为一个用例构建了它，架构就可以移植。把 Exa 搜索模板和 OpenClaw Skills 互换一下，你就拥有了一个可以监控研究论文、追踪竞争对手、观察监管变化或跟踪供应链中断的 Agents。</p>
<p>如果你想试试</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus快速入门</a></strong>--五分钟内本地运行一个向量数据库</li>
<li><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> <strong>文档</strong>--使用技能和心跳设置你的第一个Agent</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong>- 每月可免费搜索1,000次</li>
</ul>
<p>有问题，需要调试帮助，或者只是想炫耀一下自己的成果？加入<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus Slack</a>频道--这是获得社区和团队帮助的最快方式。如果您想一对一地讨论您的设置，请预约 20 分钟的<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">Milvus 办公时间。</a></p>
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw（前身为 Clawdbot 和 Moltbot）详解：自主人工智能代理完全指南</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">使用 Slack 设置 OpenClaw（原 Clawdbot/Moltbot）的分步指南</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">为什么 OpenClaw 等人工智能代理会烧光代币以及如何降低成本</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我们提取了 OpenClaw 的内存系统并将其开源（memsearch）</a></li>
</ul>
