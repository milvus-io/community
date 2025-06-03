---
id: why-ai-databases-do-not-need-sql.md
title: 为什么人工智能数据库不需要 SQL？
author: James Luan
date: 2025-05-30T00:00:00.000Z
cover: assets.zilliz.com/why_ai_databases_don_t_need_SQL_2d12f615df.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, SQL, AI Agents, LLM'
meta_keywords: 'SQL, AI Databases, vector databases, AI Agents'
meta_title: |
  Why AI Databases Don't Need SQL
desc: 无论你喜欢与否，事实就是如此，在人工智能时代，SQL 注定要走向衰落。
origin: 'https://milvus.io/blog/why-ai-databases-do-not-need-sql.md'
---
<p>几十年来，<code translate="no">SELECT * FROM WHERE</code> 一直是数据库查询的黄金法则。无论是报表系统、财务分析还是用户行为查询，我们已经习惯于使用结构化语言来精确操作数据。即使是曾经宣称要进行 "反 SQL 革命 "的 NoSQL，最终也屈服于 SQL 的地位，推出了对 SQL 的支持。</p>
<p><em>但你有没有想过：我们已经花了 50 多年时间教计算机说人类语言，为什么还要强迫人类说 &quot;计算机 &quot;语言呢？</em></p>
<p><strong>无论你喜欢与否，事实就是这样：在人工智能时代，SQL 注定要走向衰落。</strong>它可能仍被用于传统系统，但对于现代人工智能应用来说，它正变得越来越无关紧要。人工智能革命不仅改变了我们构建软件的方式，还让 SQL 变得过时，而大多数开发人员正忙于优化他们的 JOIN，根本没有注意到这一点。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_ai_databases_don_t_need_SQL_2d12f615df.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Natural-Language-The-New-Interface-for-AI-Databases" class="common-anchor-header">自然语言：人工智能数据库的新界面<button data-href="#Natural-Language-The-New-Interface-for-AI-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>数据库交互的未来不是学习更好的 SQL，而是<strong>完全抛弃语法</strong>。</p>
<p>与其与复杂的 SQL 查询搏斗，不如简单地说</p>
<p><em>"帮我找到最近购买行为与我们上一季度的顶级客户最相似的用户"。</em></p>
<p>系统会理解你的意图并自动做出决定：</p>
<ul>
<li><p>是查询结构化表格，还是在用户 Embeddings 之间执行向量相似性搜索？</p></li>
<li><p>是否应该调用外部应用程序接口来丰富数据？</p></li>
<li><p>如何对结果进行排序和过滤？</p></li>
</ul>
<p>全部自动完成。无需语法。无需调试。无需在 Stack Overflow 上搜索 "如何使用多个 CTE 执行窗口函数"。你不再是数据库 &quot;程序员&quot;，而是在与智能数据系统对话。</p>
<p>这可不是科幻小说。根据 Gartner 的预测，到 2026 年，大多数企业将把自然语言作为主要查询界面，SQL 将从 "必备 "技能变成 "可选 "技能。</p>
<p>这种转变已经开始：</p>
<p><strong>✅ 零语法障碍：</strong>字段名称、表关系和查询优化成为系统的问题，而不是你的问题</p>
<p><strong>非结构化数据友好：</strong>图像、音频和文本成为一流的查询对象</p>
<p><strong>✅ 民主化访问：</strong>操作符、产品经理和分析师可以像高级工程师一样轻松地直接查询数据</p>
<h2 id="Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="common-anchor-header">自然语言只是表象，人工智能代理才是真正的大脑<button data-href="#Natural-Language-Is-Just-the-Surface-AI-Agents-Are-the-Real-Brain" class="anchor-icon" translate="no">
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
    </button></h2><p>自然语言查询只是冰山一角。真正的突破在于<a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">人工智能 Agents</a>能够像人类一样对数据进行推理。</p>
<p>理解人类语言是第一步。理解您的需求并高效执行，这才是神奇之处。</p>
<p>人工智能代理可以充当数据库的 "大脑"，处理数据：</p>
<ul>
<li><p><strong>🤔 理解意图：</strong>确定您实际需要哪些字段、数据库和索引</p></li>
<li><p><strong>⚙️ 策略选择：</strong>在结构化过滤、向量相似性或混合方法之间做出选择</p></li>
<li><p><strong>📦 能力协调：</strong>执行 API、触发服务、协调跨系统查询</p></li>
<li><p><strong>智能格式化：</strong>返回您可以立即理解并采取行动的结果</p></li>
</ul>
<p>下面是实际应用中的情况。在<a href="https://milvus.io/">Milvus 向量数据库</a>中<a href="https://milvus.io/">，</a>复杂的相似性搜索变得微不足道：</p>
<pre><code translate="no">results = collection.search(query_vector, top_k=<span class="hljs-number">10</span>, <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;is_active == true&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>一行。无连接。没有子查询。无需调整性能。</strong> <a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>处理的是语义相似性，而传统过滤器处理的是精确匹配。它更快、更简单，而且能真正理解你想要什么。</p>
<p>这种 "API 优先 "的方法很自然地与大型语言模型的<a href="https://zilliz.com/blog/function-calling-vs-mcp-vs-a2a-developers-guide-to-ai-agent-protocols">函数调用</a>功能集成在一起--执行更快、错误更少、集成更容易。</p>
<h2 id="Why-SQL-Falls-Apart-in-the-AI-Era" class="common-anchor-header">为什么 SQL 会在人工智能时代分崩离析？<button data-href="#Why-SQL-Falls-Apart-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>SQL 是为结构化世界而设计的。然而，人工智能驱动的未来将由非结构化数据、语义理解和智能检索主导--SQL 从来就不是为处理这些而设计的。</p>
<p>现代应用中充斥着大量非结构化数据，包括来自语言模型的文本 Embeddings、来自计算机视觉系统的图像向量、来自语音识别的音频指纹，以及结合了文本、图像和元数据的多模态表示。</p>
<p>这些数据并不能整齐地排列成行和列--它以向量嵌入的形式存在于高维语义空间中，而 SQL 完全不知道该如何处理这些数据。</p>
<h3 id="SQL-+-Vector-A-Beautiful-Idea-That-Executes-Poorly" class="common-anchor-header">SQL + 向量：执行不力的美丽构想</h3><p>传统数据库为了保持相关性，纷纷在 SQL 中加入向量功能。PostgreSQL 为向量相似性搜索添加了<code translate="no">&lt;-&gt;</code> 操作符：</p>
<pre><code translate="no">SELECT *
  FROM items
 ORDER BY embedding &lt;-&gt; query_vector
 LIMIT 10;
<button class="copy-code-btn"></button></code></pre>
<p>这看起来很聪明，但从根本上讲是有缺陷的。你是在通过 SQL 解析器、查询优化器和事务系统强制进行向量操作，而这些系统是为完全不同的数据模型设计的。</p>
<p>对性能的影响是巨大的：</p>
<p><strong>真实基准数据</strong>：在相同条件下，专门构建的 Milvus 与使用 pgvector 的 PostgreSQL 相比，查询延迟降低了 60%，吞吐量提高了 4.5 倍。</p>
<p>为什么性能这么差？传统数据库创建了不必要的复杂执行路径：</p>
<ul>
<li><p><strong>解析器开销</strong>：向量查询必须通过 SQL 语法验证</p></li>
<li><p><strong>优化器混乱</strong>：为关系连接而优化的查询规划器在进行相似性搜索时举步维艰</p></li>
<li><p><strong>存储效率低</strong>：以 BLOB 形式存储的向量需要不断编码/解码</p></li>
<li><p><strong>索引不匹配</strong>：B 树和 LSM 结构对于高维相似性搜索是完全错误的</p></li>
</ul>
<h3 id="Relational-vs-AIVector-Databases-Fundamentally-Different-Philosophies" class="common-anchor-header">关系数据库与人工智能/向量数据库：根本不同的理念</h3><p>不兼容性比性能更深层次。它们是完全不同的数据处理方法：</p>
<table>
<thead>
<tr><th><strong>方面</strong></th><th><strong>SQL/关系型数据库</strong></th><th><strong>向量/人工智能数据库</strong></th></tr>
</thead>
<tbody>
<tr><td>数据模型</td><td>行和列中的结构化字段（数字、字符串</td><td>非结构化数据的高维向量表示（文本、图像、音频）</td></tr>
<tr><td>查询逻辑</td><td>精确匹配+布尔操作符</td><td>相似性匹配 + 语义搜索</td></tr>
<tr><td>界面</td><td>SQL</td><td>自然语言 + Python API</td></tr>
<tr><td>理念</td><td>ACID 合规性、完美一致性</td><td>优化召回率、语义相关性、实时性能</td></tr>
<tr><td>索引策略</td><td>B+ 树、散列索引等</td><td>HNSW、IVF、乘积量化等。</td></tr>
<tr><td>主要使用案例</td><td>交易、报告、分析</td><td>语义搜索、多模式搜索、推荐、RAG 系统、人工智能代理</td></tr>
</tbody>
</table>
<p>试图让 SQL 适用于向量操作符，就像把螺丝刀当锤子用--从技术上讲并非不可能，但你用错了工具。</p>
<h2 id="Vector-Databases-Purpose-Built-for-AI" class="common-anchor-header">向量数据库：专为人工智能设计<button data-href="#Vector-Databases-Purpose-Built-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>和<a href="https://zilliz.com/">Zilliz Cloud</a>等矢量数据库并非 &quot;具有矢量功能的 SQL 数据库&quot;--它们是专为人工智能原生应用而设计的智能数据系统。</p>
<h3 id="1-Native-Multimodal-Support" class="common-anchor-header">1.原生多模态支持</h3><p>真正的人工智能应用不只是存储文本，它们还处理图像、音频、视频和复杂的嵌套文档。向量数据库可以处理多样化的数据类型和多向量结构，如<a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search">ColBERT</a>和<a href="https://zilliz.com/blog/colpali-milvus-redefine-document-retrieval-with-vision-language-models">ColPALI</a>，适应不同人工智能模型的丰富语义表示。</p>
<h3 id="2-Agent-Friendly-Architecture" class="common-anchor-header">2.Agent友好型架构</h3><p>大型语言模型擅长函数调用，而非 SQL 生成。向量数据库提供 Python- first API，可与 AI Agents 无缝集成，在一次函数调用内即可完成向量检索、过滤、Rerankers 和语义高亮等复杂操作，无需查询语言翻译层。</p>
<h3 id="3-Semantic-Intelligence-Built-In" class="common-anchor-header">3.内置语义智能</h3><p>向量数据库不仅能执行命令，还能<strong>理解意图。</strong>它们与人工智能 Agents 和其他人工智能应用合作，摆脱了字面关键词匹配的束缚，实现了真正的语义检索。它们不仅知道 "如何查询"，还知道 "你真正想找到什么"。</p>
<h3 id="4-Optimized-for-Relevance-Not-Just-Speed" class="common-anchor-header">4.优化相关性，而不仅仅是速度</h3><p>与大型语言模型一样，向量数据库在性能和召回率之间取得了平衡。通过元数据过滤、<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">混合向量和全文检索</a>以及重排算法，它们能不断提高结果质量和相关性，找到真正有价值的内容，而不仅仅是快速检索。</p>
<h2 id="The-Future-of-Databases-is-Conversational" class="common-anchor-header">数据库的未来是对话式的<button data-href="#The-Future-of-Databases-is-Conversational" class="anchor-icon" translate="no">
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
    </button></h2><p>向量数据库代表着我们对数据交互思考方式的根本转变。它们不会取代关系数据库，而是专为人工智能工作负载而设计，并解决人工智能优先世界中完全不同的问题。</p>
<p>正如大型语言模型并没有升级传统的规则引擎，而是完全重新定义了人机交互一样，向量数据库正在重新定义我们查找和处理信息的方式。</p>
<p>我们正在从 "写给机器阅读的语言 "过渡到 "理解人类意图的系统"。数据库正在从僵化的查询执行器演变为能够理解上下文并主动提供见解的智能数据代理。</p>
<p>如今，构建人工智能应用的开发人员不想编写 SQL，他们想描述他们需要什么，然后让智能系统找出如何获得它。</p>
<p>因此，下次当你需要在数据中查找某些东西时，不妨试试不同的方法。不要写查询，直接说出你要找的东西。你的数据库可能会出乎意料地理解你的意思。</p>
<p><em>如果不能呢？也许是时候升级你的数据库了，而不是你的 SQL 技能。</em></p>
