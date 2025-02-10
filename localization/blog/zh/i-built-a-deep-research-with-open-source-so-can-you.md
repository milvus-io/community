---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: 我用开源构建了一项深度研究，你也可以！
author: Stefan Webb
date: 2025-02-6
desc: 了解如何使用 Milvus、DeepSeek R1 和 LangChain 等开源工具创建深度研究式的 Agents。
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>实际上，这是一个最小范围的 Agents，它可以使用维基百科进行推理、计划、使用工具等进行研究。不过，几个小时的工作还是不错的......</p>
<p>除非你住在岩石下、洞穴里或偏远的山间修道院，否则你一定听说过 OpenAI 于 2025 年 2 月 2 日发布的<em>深度研究（Deep Research</em>）。这款新产品有望彻底改变我们回答需要综合大量不同信息的问题的方式。</p>
<p>您只需输入查询内容，选择 "深度研究 "选项，该平台就会自动搜索网络，对发现的内容进行推理，并将多种来源的信息综合成一份连贯、引用充分的报告。与标准聊天机器人相比，它的输出时间要长几个数量级，但结果却更详细、更翔实、更细致入微。</p>
<h2 id="How-does-it-work" class="common-anchor-header">它是如何工作的？<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>但是，这项技术是如何工作的，为什么 "深度研究 "比以前的尝试（如谷歌的 "<em>深度研究</em>"--收到商标争议警报）有明显进步？关于后者，我们将留待以后再谈。至于前者，毫无疑问，"深度研究 "的背后有许多 "秘诀"。我们可以从 OpenAI 的发布文章中了解到一些细节，以下是我的总结。</p>
<p><strong>深度研究利用了专门用于推理任务的基础模型的最新进展：</strong></p>
<ul>
<li><p>"......在即将推出的 OpenAI o3 推理模型上进行微调......"</p></li>
<li><p>"......利用推理来搜索、解释和分析海量文本......"</p></li>
</ul>
<p><strong>深度研究利用了具有规划、反思和记忆功能的复杂 Agents 工作流程：</strong></p>
<ul>
<li><p>"......学会规划和执行多步骤轨迹......"</p></li>
<li><p>"......回溯并对实时信息做出反应......"</p></li>
<li><p>"......根据需要对遇到的信息做出反应......"</p></li>
</ul>
<p><strong>深度研究 "是在专有数据上进行训练的，使用了多种类型的微调，这可能是其性能的一个关键组成部分：</strong></p>
<ul>
<li><p>"......使用端到端强化学习，对一系列领域的艰难浏览和推理任务进行训练......"</p></li>
<li><p>"...针对网页浏览和数据分析进行了优化..."</p></li>
</ul>
<p>代理工作流的具体设计是个秘密，不过，我们可以根据有关如何构建代理的成熟思路，自己构建一些东西。</p>
<p><strong>在我们开始之前，请注意一点</strong>：我们很容易被生成式人工智能的热潮所席卷，尤其是当一个看似进步了一步的新产品发布时。然而，正如 OpenAI 所承认的，深度研究与生成式人工智能技术一样存在局限性。我们应谨记批判性地思考输出结果，因为它可能包含虚假事实（"幻觉"）、不正确的格式和引文，而且根据随机种子的不同，质量也会有很大差异。</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">我可以自己制作吗？<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>当然可以！让我们使用开源工具，建立自己的 "深度研究"，在本地运行。我们只需具备生成式人工智能的基本知识、常识、几个空闲时间、GPU，以及开源的<a href="https://milvus.io/docs">Milvus</a>、<a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> 和<a href="https://python.langchain.com/docs/introduction/">LangChain</a>。</p>
<p>当然，我们不能指望复制 OpenAI 的性能，但我们的原型将在最小程度上展示其技术可能蕴含的一些关键理念，将推理模型的进步与代理工作流程的进步结合起来。重要的是，与 OpenAI 不同，我们将只使用开源工具，并能在本地部署我们的系统--开源无疑为我们提供了极大的灵活性！</p>
<p>我们将做一些简化假设，以缩小项目范围：</p>
<ul>
<li><p>我们将使用一种可在本地运行的开源推理模式，该模式经过提炼，然后<a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">量化</a>为 4 位。</p></li>
<li><p>我们不会自己对推理模型进行额外的微调。</p></li>
<li><p>我们的 Agents 拥有的唯一工具是下载和阅读维基百科页面并执行单独的 RAG 查询（我们无法访问整个网络）。</p></li>
<li><p>我们的 Agents 只处理文本数据，不处理图片、PDF 等。</p></li>
<li><p>我们的 Agents 不会回溯或考虑枢轴。</p></li>
<li><p>我们的 Agents 将（尚未）根据其输出控制其执行流程。</p></li>
<li><p>维基百科包含真相、全部真相以及除真相之外的一切真相。</p></li>
</ul>
<p>我们将使用<a href="https://milvus.io/docs">Milvus</a>作为向量数据库，使用<a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a>作为推理模型，使用<a href="https://python.langchain.com/docs/introduction/">LangChain</a>实现 RAG。让我们开始吧！</p>
<custom-h1>用于在线研究的最小 Agents</custom-h1><p>我们将使用人类如何进行研究的心智模型来设计 Agents 工作流程：</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">定义/确定问题</h3><p>研究始于定义问题。我们将问题视为用户的询问，不过，我们会使用我们的推理模型来确保问题的表达方式具体、清晰、重点突出。也就是说，我们的第一步是重写提示语，并提取任何子查询或子问题。我们有效利用基础模型的专业化进行推理，并采用简单的方法进行 JSON 结构化输出。</p>
<p>下面是一个推理跟踪示例，DeepSeek 对 "演员阵容随着时间的推移发生了哪些变化？</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">搜索</h3><p>接下来，我们对维基百科文章进行 "文献回顾"。现在，我们只阅读一篇文章，并将导航链接留待以后迭代。我们在原型开发过程中发现，如果每个链接都需要调用推理模型，那么链接探索就会变得非常昂贵。我们解析文章，并将其数据存储到我们的向量数据库 Milvus 中，就像记笔记一样。</p>
<p>下面的代码片段展示了我们如何使用 LangChain 集成将维基百科页面存储到 Milvus 中：</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">分析</h3><p>Agents 返回其问题，并根据文档中的相关信息进行回答。我们将把多步骤分析/反思工作流程留待今后的工作中使用，并对信息来源的可信度和偏见进行批判性思考。</p>
<p>下面是一个代码片段，说明如何使用 LangChain 构建 RAG 并分别回答我们的子问题。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">综合</h3><p>Agents 完成研究后，会创建一个结构化大纲，或者说是研究结果的骨架，以便在报告中进行总结。然后，它将完成每个部分，在其中填入部分标题和相应内容。我们将更复杂的工作流程留待以后的迭代中使用，包括反思、重新排序和改写。这部分的 Agents 涉及规划、工具使用和内存。</p>
<p>完整代码见<a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">随附的笔记本</a>，输出示例见<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">保存的报告文件</a>。</p>
<h2 id="Results" class="common-anchor-header">测试结果<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>我们的测试查询是<em>"《辛普森一家》随着时间的推移发生了哪些变化？"</em>，数据源是维基百科上关于 "辛普森一家 "的文章。以下是<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">生成报告的</a>一部分：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">摘要：我们的成果和下一步计划<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>在短短几个小时内，我们就设计出了一个基本的 Agents 工作流程，它可以进行推理、规划并从维基百科中检索信息，从而生成一份结构化的研究报告。虽然这个原型与 OpenAI 的深度研究相去甚远，但它展示了 Milvus、DeepSeek 和 LangChain 等开源工具在构建自主研究代理方面的强大功能。</p>
<p>当然，改进的空间还很大。未来的迭代可以</p>
<ul>
<li><p>从维基百科扩展到动态搜索多个来源</p></li>
<li><p>引入回溯和反思功能以完善响应</p></li>
<li><p>根据 Agents 自身的推理优化执行流程</p></li>
</ul>
<p>开放源码为我们提供了封闭源码所不具备的灵活性和控制力。无论是用于学术研究、内容合成还是人工智能辅助，构建我们自己的研究 Agents 都能为我们带来令人兴奋的可能性。敬请期待下一篇文章，我们将探讨如何添加实时网络检索、多步骤推理和条件执行流程！</p>
<h2 id="Resources" class="common-anchor-header">资源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>笔记本：<a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>"开源深度研究基线</em></a></p></li>
<li><p>报告<em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>《辛普森一家》作为一部剧集随时间的演变，涵盖了内容、幽默、角色发展、动画及其在社会中的作用等方面的变化</em></a><em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>。</em></a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus 向量数据库文档</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">经过提炼和量化的 DeepSeek R1 模型页面</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">深度研究常见问题 | OpenAI 帮助中心</a></p></li>
</ul>
