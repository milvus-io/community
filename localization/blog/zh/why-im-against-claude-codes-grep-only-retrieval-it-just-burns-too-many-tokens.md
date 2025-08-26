---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: 为什么我反对克劳德代码的纯 Grep 检索？它消耗了太多令牌
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: 了解基于向量的代码检索如何将克劳德代码令牌消耗量减少 40%。易于集成 MCP 的开源解决方案。立即试用 claude-context。
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>人工智能编码助手正在蓬勃发展。仅在过去两年中，Cursor、Claude Code、Gemini CLI 和 Qwen Code 等工具就从好奇者变成了数百万开发者的日常伙伴。但是，在这种迅速崛起的背后，是一场酝酿已久的争论：<strong>人工智能编码助手究竟应该如何搜索代码库的上下文？</strong></p>
<p>目前，有两种方法：</p>
<ul>
<li><p><strong>向量搜索驱动的 RAG</strong>（语义检索）。</p></li>
<li><p><strong>使用 grep 进行关键词搜索</strong>（字面字符串匹配）。</p></li>
</ul>
<p>Claude Code 和 Gemini 选择了后者。事实上，一位克劳德工程师在 Hacker News 上公开承认，克劳德代码根本不使用 RAG。相反，它只是逐行搜索你的 repo（他们称之为 "agentic search"）--没有语义，没有结构，只是原始的字符串匹配。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这一启示分裂了社区：</p>
<ul>
<li><p><strong>支持者</strong>为 grep 的简单性辩护。它快速、精确，最重要的是可预测。他们认为，对于编程来说，精确度就是一切，而如今的 Embeddings 仍然太模糊，不可信。</p></li>
<li><p><strong>批评者</strong>认为 grep 是一条死胡同。它让你淹没在不相关的匹配中，烧毁标记，阻碍你的工作流程。没有语义理解，就像让人工智能蒙着眼睛调试一样。</p></li>
</ul>
<p>双方都有道理。在构建并测试了我自己的解决方案后，我可以这样说：基于向量搜索的 RAG 方法改变了游戏规则。<strong>它不仅大大提高了搜索速度和准确性，还能减少 40% 甚至更多的标记使用量。(跳至 "克劳德语境 "部分了解我的方法）</strong></p>
<p>那么，为什么 grep 的局限性如此之大？向量搜索在实际应用中又如何能带来更好的结果呢？让我们来分析一下。</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">克劳德代码的只用 grep 搜索代码有什么问题？<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>我在调试一个棘手的问题时遇到了这个问题。克劳德代码在我的软件仓库中进行了 grep 查询，向我反馈了大量无关的文本。一分钟后，我仍然没有找到相关文件。五分钟后，我终于找到了正确的 10 行，但它们却被埋没在 500 行的噪音中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这不是边缘案例。浏览克劳德代码在 GitHub 上的问题，会发现很多沮丧的开发者都遇到了同样的问题：</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>问题2<a href="https://github.com/anthropics/claude-code/issues/4556"> ：https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>社区的挫败感归结为三个痛点：</p>
<ol>
<li><p><strong>令牌膨胀。</strong>每一次 grep dump 都会向 LLM 丢入大量无关代码，导致成本上升，并随着 repo 规模的扩大而急剧增加。</p></li>
<li><p><strong>时间税。</strong>当人工智能在你的代码库中玩二十个问题的游戏时，你只能在一旁苦苦等待，这样会扼杀专注力和流程。</p></li>
<li><p><strong>零语境。</strong>Grep 匹配的是字面字符串。它没有意义或关系，所以你实际上是在盲目搜索。</p></li>
</ol>
<p>这就是为什么这场辩论如此重要：Grep 不只是 "老派"，它还在积极阻碍人工智能辅助编程。</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">克劳德代码与光标：为什么后者拥有更好的代码上下文<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>在代码上下文方面，Cursor 做得更好。从一开始，Cursor 就专注于<strong>代码库索引</strong>：将你的 repo 分成有意义的块，将这些块嵌入向量，并在人工智能需要上下文时以语义方式检索它们。这就是将教科书式的检索增强生成（RAG）应用于代码，其结果不言而喻：更严密的上下文、更少的标记浪费和更快的检索速度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>相比之下，克劳德代码则加倍追求简洁。没有索引，没有 Embeddings，只有 grep。这意味着每次搜索都是字面字符串匹配，不需要理解结构或语义。这在理论上是很快的，但在实践中，开发人员往往要在一堆不相关的匹配中筛选，最后才能找到他们真正需要的那根针。</p>
<table>
<thead>
<tr><th></th><th><strong>克劳德代码</strong></th><th><strong>光标</strong></th></tr>
</thead>
<tbody>
<tr><td>搜索精度</td><td>只浮现完全匹配的代码，不会出现任何不同名称的代码。</td><td>即使关键字不完全匹配，也能找到语义相关的代码。</td></tr>
<tr><td>效率</td><td>Grep 会将大量代码转入模型，从而增加了令牌成本。</td><td>更小、信号更强的代码块可将令牌负载降低 30-40%。</td></tr>
<tr><td>可扩展性</td><td>每次都对 repo 进行重新 Grep，随着项目的增长，速度会减慢。</td><td>一次索引，然后大规模检索，滞后时间最短。</td></tr>
<tr><td>理念</td><td>保持最低限度--没有额外的基础设施。</td><td>索引一切，智能检索。</td></tr>
</tbody>
</table>
<p>那么，为什么克劳德（或双子座，或 Cline）没有效仿光标呢？部分原因在于技术，部分原因在于文化。<strong>向量检索并不简单--你需要解决分块、增量更新和大规模索引等问题。</strong>但更重要的是，克劳德代码是围绕极简主义构建的：没有服务器，没有索引，只有简洁的 CLI。Embeddings 和向量数据库不符合这一设计理念。</p>
<p>这种简洁性很有吸引力，但同时也限制了 Claude Code 的性能上限。Cursor 愿意在真正的索引基础架构上进行投资，这也是它如今感觉更强大的原因。</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context：为克劳德代码添加语义代码搜索的开源项目<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code 是一款强大的工具，但它的代码上下文功能很差。Cursor 通过代码库索引解决了这一问题，但 Cursor 是闭源的，锁定在订阅之后，对于个人或小型团队来说价格昂贵。</p>
<p>因此，我们开始构建自己的开源解决方案：<a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>。</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>是一个开源 MCP 插件，它为 Claude Code（以及其他任何会说 MCP 的人工智能编码代理）带来了<strong>语义代码搜索</strong>。它将向量数据库与 Embeddings 模型整合在一起，为 LLMs 提供来自整个代码库的<em>深度、有针对性的上下文</em>，而不是使用 grep 对您的 repo 进行粗暴搜索。其结果是：检索更清晰，令牌浪费更少，开发人员体验更好。</p>
<p>以下是我们的构建过程：</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">我们使用的技术</h3><p><strong>🔌 接口层：作为通用连接器的 MCP</strong></p>
<p>我们希望它在任何地方都能工作，而不仅仅是克劳德。MCP（模型上下文协议）就像 LLMs 的 USB 标准，可以让外部工具无缝插入。通过将 Claude Context 打包为 MCP 服务器，它不仅能与 Claude Code 配合使用，还能与 Gemini CLI、Qwen Code、Cline 甚至 Cursor 配合使用。</p>
<p><strong>🗄️ 向量数据库：Zilliz Cloud</strong></p>
<p>在骨干网方面，我们选择了<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（基于<a href="https://milvus.io/">Milvus</a> 构建的完全托管服务）。它具有高性能、云原生、弹性等特点，专为代码库索引等人工智能工作负载而设计。这意味着低延迟检索、近乎无限的规模和坚如磐石的可靠性。</p>
<p><strong>🧩 嵌入模型：设计灵活不同的</strong>团队有不同的需求，因此 Claude Context 开箱即支持多个嵌入提供商：</p>
<ul>
<li><p><strong>OpenAI Embeddings</strong>用于稳定性和广泛采用。</p></li>
<li><p><strong>Voyage 嵌入</strong>提供代码专用性能。</p></li>
<li><p><strong>Ollama</strong>用于隐私优先的本地部署。</p></li>
</ul>
<p>随着需求的发展，还可以加入其他模型。</p>
<p><strong>语言选择：TypeScript</strong></p>
<p>我们就 Python 与 TypeScript 进行了辩论。最终，TypeScript 胜出，这不仅是因为它具有应用级兼容性（VSCode 插件、Web 工具），还因为 Claude Code 和 Gemini CLI 本身就是基于 TypeScript 的。这使得整合无缝进行，并保持了生态系统的一致性。</p>
<h3 id="System-Architecture" class="common-anchor-header">系统架构</h3><p>Claude Context 采用简洁的分层设计：</p>
<ul>
<li><p><strong>核心模块</strong>处理繁重的工作：代码解析、分块、索引、检索和同步。</p></li>
<li><p><strong>用户界面</strong>处理集成--CP 服务器、VSCode 插件或其他适配器。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种分离使核心引擎可在不同环境中重复使用，同时让集成随着新的人工智能编码助手的出现而快速发展。</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">核心模块的实现</h3><p>核心模块是整个系统的基础。它们将向量数据库、Embeddings 模型和其他组件抽象为可组合的模块，从而创建一个 Context 对象，使不同的向量数据库和嵌入模型适用于不同的场景。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">解决关键技术挑战<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>构建 Claude Context 不仅仅是连接嵌入和向量数据库。真正的工作是解决那些决定大规模代码索引成败的棘手问题。以下是我们如何应对三大挑战的：</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">挑战 1：智能代码分块</h3><p>代码不能只按行或字符分割。这会产生杂乱无章、不完整的片段，并剥离使代码易于理解的逻辑。</p>
<p>我们采用<strong>两种互补策略</strong>来解决这个问题：</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">基于 AST 的分块（主要策略）</h4><p>这是一种默认方法，使用树形码解析器来理解代码的语法结构，并按照语义边界进行分割：函数、类、方法。这种方法可提供</p>
<ul>
<li><p><strong>语法完整性</strong>--没有切分的函数或破碎的声明。</p></li>
<li><p><strong>逻辑一致性</strong>--相关逻辑保持一致，以便更好地进行语义检索。</p></li>
<li><p><strong>多语言支持</strong>--通过树状分隔语法，可在 JS、Python、Java、Go 等<strong>语言</strong>中运行。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">LangChain 文本分割（后备策略）</h4><p>对于 AST 无法解析或解析失败的语言，LangChain 的<code translate="no">RecursiveCharacterTextSplitter</code> 可提供可靠的备份。</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>它没有 AST 那么 "智能"，但可靠性很高，确保开发人员不会陷入困境。这两种策略共同兼顾了语义丰富性和普遍适用性。</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">挑战 2：高效处理代码变更</h3><p>管理代码变更是代码索引系统面临的最大挑战之一。为微小的文件修改而重新索引整个项目是完全不切实际的。</p>
<p>为了解决这个问题，我们建立了基于梅克尔树的同步机制。</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">梅克尔树：变更检测的基础</h4><p>Merkle 树创建了一个分层的 "指纹 "系统，每个文件都有自己的哈希指纹，文件夹的指纹则基于其内容，最终形成整个代码库的唯一根节点指纹。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>当文件内容发生变化时，哈希指纹会逐层向上传递到根节点。这样，通过从根节点向下逐层比较哈希指纹，就能快速检测变化，从而快速识别和定位文件修改，而无需对整个项目重新索引。</p>
<p>系统采用简化的三阶段流程，每 5 分钟执行一次握手同步检查：</p>
<p><strong>第一阶段：快速检测</strong>计算整个代码库的 Merkle 根哈希值，并与上一个快照进行比较。相同的根哈希值意味着没有发生变化，系统会在几毫秒内跳过所有处理。</p>
<p><strong>第 2 阶段：精确对比</strong>在根哈希值不同时触发，执行详细的文件级分析，以准确识别哪些文件被添加、删除或修改。</p>
<p><strong>第 3 阶段：增量更新</strong>仅对已更改的文件重新计算向量，并相应更新向量数据库，从而最大限度地提高效率。</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">本地快照管理</h4><p>所有同步状态都会持续存在用户的<code translate="no">~/.context/merkle/</code> 目录中。每个代码库都有自己独立的快照文件，其中包含文件哈希表和序列化的 Merkle 树数据，确保即使在程序重启后也能准确恢复状态。</p>
<p>这种设计带来的好处显而易见：当不存在任何更改时，大多数检查都能在几毫秒内完成，只有真正修改过的文件才会触发重新处理（避免了大量的计算浪费），而且状态恢复能在不同的程序会话中完美运行。</p>
<p>从用户体验的角度来看，修改单个函数只会触发该文件的重新索引，而不会触发整个项目的重新索引，从而大大提高了开发效率。</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">挑战 3：设计 MCP 界面</h3><p>如果没有面向开发人员的简洁界面，再智能的索引引擎也毫无用处。MCP 是不二之选，但它也带来了独特的挑战：</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>工具设计：保持简单</strong></h4><p>MCP 模块是面向用户的界面，因此用户体验是重中之重。</p>
<p>工具设计首先要将标准的代码库索引和搜索操作抽象为两个核心工具：用于索引代码库的<code translate="no">index_codebase</code> 和用于搜索代码的<code translate="no">search_code</code> 。</p>
<p>这就提出了一个重要问题：还需要哪些工具？</p>
<p>工具数量需要谨慎平衡--太多的工具会造成认知开销，混淆 LLM 工具的选择，而太少的工具又可能遗漏基本功能。</p>
<p>从实际使用案例出发，有助于回答这个问题。</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">应对后台处理挑战</h4><p>大型代码库可能需要相当长的时间来编制索引。同步等待完成的天真方法会让用户不得不等待数分钟，这是根本无法接受的。异步后台处理变得至关重要，但 MCP 本身并不支持这种模式。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>我们的 MCP 服务器在 MCP 服务器中运行一个后台进程来处理索引，同时立即向用户返回启动信息，使他们能够继续工作。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>这就带来了一个新的挑战：用户如何跟踪索引进度？</p>
<p>查询索引进度或状态的专用工具可以很好地解决这个问题。后台索引过程会异步缓存进度信息，用户可以随时查看完成百分比、成功状态或失败情况。此外，手动索引清除工具还能处理用户需要重置不准确索引或重启索引进程的情况。</p>
<p><strong>最终工具设计：</strong></p>
<p><code translate="no">index_codebase</code> - 索引代码库 - 搜索代码 - 查询索引状态 - 清理索引<code translate="no">search_code</code><code translate="no">get_indexing_status</code><code translate="no">clear_index</code> </p>
<p>在简洁性和功能性之间取得完美平衡的四个工具。</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">环境变量管理</h4><p>尽管环境变量管理对用户体验有重大影响，但却经常被忽视。要求为每个 MCP 客户端单独配置 API 密钥会迫使用户在克劳德代码和 Gemini CLI 之间切换时多次配置凭据。</p>
<p>全局配置方法通过在用户的主目录中创建一个<code translate="no">~/.context/.env</code> 文件来消除这种麻烦：</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>这种方法的好处显而易见：</strong>用户只需配置一次，即可在所有 MCP 客户端中随处使用；所有配置都集中在一个位置，便于维护；敏感的 API 密钥不会分散在多个配置文件中。</p>
<p>我们还实现了三层优先级层次结构：进程环境变量具有最高优先级，全局配置文件具有中等优先级，默认值作为备用。</p>
<p>这种设计提供了极大的灵活性：开发人员可以使用环境变量进行临时测试覆盖，生产环境可以通过系统环境变量注入敏感配置以增强安全性，而用户只需配置一次，就能在 Claude Code、Gemini CLI 和其他工具中无缝运行。</p>
<p>至此，MCP 服务器的核心架构已经完成，从代码解析和向量存储到智能检索和配置管理，一应俱全。每个组件都经过精心设计和优化，以创建一个功能强大且用户友好的系统。</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">实际测试<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>那么，Claude Context 的实际性能如何呢？我对它进行了测试，测试场景与最初让我感到沮丧的查找错误的场景完全相同。</p>
<p>在启动 Claude Code 之前，只需执行一个命令即可完成安装：</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>代码库建立索引后，我向 Claude Code 提供了与之前相同的错误描述，该错误描述曾让 Claude Code 进行了<strong>长达五分钟的 grep 搜索</strong>。这次，通过<code translate="no">claude-context</code> MCP 调用，它<strong>立即精确定位了文件和行号</strong>，并对问题进行了解释。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这种差别并不细微，简直是天壤之别。</p>
<p>这不仅仅是错误查找。在集成了 Claude Context 后，Claude Code 始终能产生更高质量的结果：</p>
<ul>
<li><p><strong>问题解决</strong></p></li>
<li><p><strong>代码重构</strong></p></li>
<li><p><strong>重复代码检测</strong></p></li>
<li><p><strong>全面测试</strong></p></li>
</ul>
<p>性能提升还体现在数字上。在并行测试中</p>
<ul>
<li><p>令牌使用量下降了 40% 以上，而召回率却没有任何下降。</p></li>
<li><p>这直接降低了 API 成本，加快了响应速度。</p></li>
<li><p>另外，在预算相同的情况下，Claude Context 提供的检索准确度要高得多。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我们已将 Claude Context 在 GitHub 上开源，目前已获得 2.6K+颗星。感谢大家的支持和喜爱。</p>
<p>您可以亲自体验一下：</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm：<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>详细的基准和测试方法可在软件仓库中找到--我们希望得到您的反馈。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">展望未来<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>克劳德代码中的 grep 最初只是一个挫折，现在已经发展成为一个可靠的解决方案：<a href="https://github.com/zilliztech/claude-context"><strong>Claude Context 是一个</strong></a>开源的 MCP 插件，它为 Claude Code 和其他编码助手带来了语义、向量搜索功能。它传达的信息很简单：开发人员不必满足于低效的人工智能工具。有了 RAG 和向量检索，您可以更快地进行调试，将令牌成本降低 40%，最终获得真正理解您代码库的人工智能辅助工具。</p>
<p>这不仅限于 Claude Code。由于 Claude Context 基于开放标准构建，因此同样的方法可与 Gemini CLI、Qwen Code、Cursor、Cline 等无缝协作。您再也不会被供应商的简单性优先于性能的取舍所束缚。</p>
<p>我们希望您能成为未来的一部分：</p>
<ul>
<li><p><strong>试用</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a><strong>：</strong>它是开源的，完全免费</p></li>
<li><p><strong>参与开发</strong></p></li>
<li><p><strong>或</strong>使用 Claude Context<strong>构建您自己的解决方案</strong></p></li>
</ul>
<p>加入我们的<a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord 社区</strong></a>，分享您的反馈、提出问题或获得帮助。</p>
