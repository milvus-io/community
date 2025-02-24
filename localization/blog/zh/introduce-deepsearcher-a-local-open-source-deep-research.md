---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: 介绍 DeepSearcher：本地开源深度研究
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: 与 OpenAI 的 "深度研究 "相比，这个例子在本地运行，只使用 Milvus 和 LangChain 等开源模型和工具。
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="deep researcher.gif" class="doc-image" id="deep-researcher.gif" />
   </span> <span class="img-wrapper"> <span>深度研究员.gif</span> </span></p>
<p>在上一篇文章<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>《我用开源构建了一个深度研究--你也可以！》</em></a>中<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>，</em></a>我们解释了研究 Agents 的一些基本原理，并构建了一个简单的原型，可以生成关于给定主题或问题的详细报告。这篇文章和相应的笔记本展示了<em>工具使用</em>、<em>查询分解</em>、<em>推理</em>和<em>反思</em>等基本概念。与 OpenAI 的深度研究相比，我们上一篇文章中的示例在本地运行，只使用了<a href="https://milvus.io/docs">Milvus</a>和 LangChain 等开源模型和工具。(我建议您在继续阅读之前先阅读<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">上述文章</a>）。</p>
<p>在接下来的几周里，人们对理解和复制 OpenAI 深度研究的兴趣激增。例如，请参阅<a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a>和<a href="https://huggingface.co/blog/open-deep-research">Hugging Face 的 Open DeepResearch</a>。这些工具虽然目标相同，但在架构和方法上各不相同：通过浏览网络或内部文档迭代研究某个主题或问题，并输出详细、翔实、结构合理的报告。重要的是，底层代理可以自动推理每个中间步骤应采取的行动。</p>
<p>在本篇文章中，我们将在上一篇文章的基础上介绍 Zilliz 的<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>开源项目。我们的 Agents 演示了更多概念：<em>查询路由、条件执行流</em>以及<em>作为工具的网络爬行</em>。它以 Python 库和命令行工具而非 Jupyter 笔记本的形式呈现，比我们之前的文章功能更全面。例如，它可以输入多个源文件，并能通过配置文件设置所使用的 Embeddings 模型和向量数据库。虽然 DeepSearcher 仍然相对简单，但它很好地展示了代理式 RAG，并向最先进的人工智能应用进一步迈进。</p>
<p>此外，我们还探讨了对更快、更高效推理服务的需求。推理模型利用 "推理扩展"（即额外计算）来提高输出，再加上一份报告可能需要数百或数千次 LLM 调用，推理带宽成为主要瓶颈。我们<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">在 SambaNova 的定制硬件上</a>使用<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">DeepSeek-R1 推理模型</a>，其每秒输出令牌的速度是最接近的竞争对手的两倍（见下图）。</p>
<p>SambaNova Cloud 还为其他开源模型提供推理即服务，包括 Llama 3.x、Qwen2.5 和 QwQ。推理服务在 SambaNova 的定制芯片（称为可重构数据流单元（RDU））上运行，该芯片专为生成式人工智能模型的高效推理而设计，可降低成本并提高推理速度。<a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">更多信息，请访问他们的网站。</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output speed- deepseek r1.png" class="doc-image" id="output-speed--deepseek-r1.png" />
   </span> <span class="img-wrapper"> <span>输出速度--deepseek r1.png</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">DeepSearcher 架构<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>的架构沿袭了我们之前的文章，将问题分解为四个步骤--<em>定义/提炼问题</em>、<em>研究</em>、<em>分析</em>、<em>综合</em>--不过这次有一些重叠。我们将逐一介绍<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>的改进之处。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="deepsearcher architecture.png" class="doc-image" id="deepsearcher-architecture.png" />
   </span> <span class="img-wrapper"> <span>DeepSearcher 架构.png</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">定义和提炼问题</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>在 DeepSearcher 的设计中，研究和提炼问题之间的界限非常模糊。用户的初始查询被分解为多个子查询，这与上一篇文章的做法非常相似。请参阅上文由查询 "辛普森一家随着时间的推移发生了哪些变化？"生成的初始子查询。不过，接下来的研究步骤将根据需要继续完善问题。</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">研究和分析</h3><p>将查询分解成子查询后，Agent 的研究部分就开始了。它大致分为四个步骤：<em>路由</em>、<em>搜索</em>、<em>反射和条件重复</em>。</p>
<h4 id="Routing" class="common-anchor-header">路由</h4><p>我们的数据库包含来自不同来源的多个表或 Collections。如果我们能将语义搜索限制在只与当前查询相关的来源上，效率会更高。查询路由器会提示 LLM 决定应从哪些 Collections 中检索信息。</p>
<p>下面是形成查询路由提示的方法：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>我们让 LLM 以 JSON 格式返回结构化输出，以便轻松地将其输出转换为下一步行动的决定。</p>
<h4 id="Search" class="common-anchor-header">搜索</h4><p>通过上一步选择了各种数据库 Collections 后，搜索步骤将使用<a href="https://milvus.io/docs">Milvus</a> 执行相似性搜索。与上一步的情况很像，源数据已经提前指定、分块、嵌入并存储在向量数据库中。对于 DeepSearcher，本地和在线数据源都必须手动指定。我们将在线搜索留给未来的工作。</p>
<h4 id="Reflection" class="common-anchor-header">反思</h4><p>与前一篇文章不同的是，DeepSearcher 展示了一种真正的代理反思形式，它将先前的输出作为上下文输入到一个提示中，以 "反思 "迄今为止提出的问题和检索到的相关块是否包含任何信息空白。这可以看作是一个分析步骤。</p>
<p>下面是创建提示的方法：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>我们再一次让 LLM 返回结构化输出，这次是可由 Python 解释的数据。</p>
<p>下面是在回答上述初始子查询后，通过反射 "发现 "新子查询的示例：</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">条件重复</h4><p>与上一篇文章不同，DeepSearcher 演示了条件执行流程。在反思到目前为止的问题和答案是否完整之后，如果还有其他问题要问，Agents 会重复上述步骤。重要的是，执行流程（while 循环）是 LLM 输出的函数，而不是硬编码。在这种情况下，只有二选一：<em>重复研究</em>或<em>生成报告</em>。在更复杂的 Agents 中，可能会有多个选择，如：<em>跟踪超链接</em>、<em>检索块、存储在内存中、反映</em>等。通过这种方式，Agents 会根据自己的判断继续完善问题，直到决定退出循环并生成报告。在我们的 "辛普森一家 "示例中，DeepSearcher 还进行了两轮额外的子查询来填补空白。</p>
<h3 id="Synthesize" class="common-anchor-header">合成</h3><p>最后，将完全分解的问题和检索到的数据块合成为带有单个提示的报告。下面是创建提示的代码：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>与我们的原型相比，这种方法的优势在于，它可以单独分析每个问题，并简单地将输出结果连接起来，从而生成一份所有部分都相互一致的报告，即不包含重复或相互矛盾的信息。一个更复杂的系统可以将两者的某些方面结合起来，使用条件执行流程来构建报告、总结、重写、反思和透视等，我们将把这些工作留待今后进行。</p>
<h2 id="Results" class="common-anchor-header">结果<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>下面是 "辛普森一家随着时间发生了哪些变化？"查询生成的报告样本，DeepSeek-R1 将维基百科上关于辛普森一家的页面作为源材料：</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">点击此处查看报告全文</a>，以及<a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">DeepSearcher 使用 GPT-4o mini 生成的报告</a>对比。</p>
<h2 id="Discussion" class="common-anchor-header">讨论<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>我们介绍了用于执行研究和撰写报告的 Agents<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>。我们的系统建立在前一篇文章的基础上，增加了条件执行流、查询路由和改进的界面等功能。我们从使用小型 4 位量化推理模型的本地推理，转为使用大规模 DeepSeek-R1 模型的在线推理服务，从质上改进了我们的输出报告。DeepSearcher 可与大多数推理服务协同工作，如 OpenAI、Gemini、DeepSeek 和 Grok 3（即将推出！）。</p>
<p>推理模型，尤其是在研究 Agents 中使用的推理模型，是推理的重中之重，而我们有幸能够使用 SambaNova 在其定制硬件上运行的 DeepSeek-R1 最快版本。在演示查询中，我们对SambaNova的DeepSeek-R1推理服务进行了65次调用，输入约2.5万个标记，输出2.2万个标记，花费0.3美元。鉴于该模型包含 6710 亿个参数，并且有 3/4 TB 之大，推理速度给我们留下了深刻印象。<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">点击此处了解更多详情！</a></p>
<p>我们将在今后的文章中继续迭代这项工作，研究更多的 Agents 概念和研究代理的设计空间。与此同时，我们邀请大家试用<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>，<a href="https://github.com/zilliztech/deep-searcher">在 GitHub 上为我们加星</a>，并分享您的反馈意见！</p>
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>Zilliz 的 DeepSearcher</strong></a></p></li>
<li><p>背景阅读：<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"我用开源构建了一个深度研究--你也可以！"</em></strong></a></p></li>
<li><p>"<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>SambaNova 以最高效率启动最快的 DeepSeek-R1 671B</strong></a></p></li>
<li><p>DeepSearcher：<a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">关于辛普森一家的 DeepSeek-R1 报告</a></p></li>
<li><p>DeepSearcher：<a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">关于《辛普森一家》的 GPT-4o 微型报告</a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus 开源向量数据库</a></p></li>
</ul>
