---
id: claude-context-reduce-claude-code-token-usage.md
title: 克劳德语境：利用 Milvus 驱动的代码检索减少克劳德代码令牌使用量
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: 克劳德代码在 grep 上燃烧令牌？看看 Claude Context 如何使用 Milvus 支持的混合检索将令牌使用量减少 39.4%。
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>大的上下文窗口让人工智能编码 Agents 感觉无拘无束，直到他们开始阅读你的半个知识库来回答一个问题。对于许多 Claude Code 用户来说，昂贵的部分不仅仅是模型推理。它是一个检索循环：搜索一个关键词，读取一个文件，再次搜索，读取更多文件，不断为不相关的上下文付费。</p>
<p>Claude Context 是一个开源的代码检索 MCP 服务器，它为 Claude Code 和其他人工智能编码 Agents 提供了更好的查找相关代码的方法。它为你的资源库编制索引，将可搜索的代码块存储在<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>中，并使用<a href="https://zilliz.com/blog/hybrid-search-with-milvus">混合检索</a>，这样 Agents 就能拉入它实际需要的代码，而不是用 grep 结果淹没提示符。</p>
<p>在我们的基准测试中，Claude Context 平均减少了 39.4% 的令牌消耗，减少了 36.1% 的工具调用，同时保持了检索质量。这篇文章解释了为什么 grep 式检索会浪费上下文，Claude Context 在引擎盖下是如何工作的，以及在实际调试任务中它与基准工作流程的比较。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>Claude Context GitHub 存储库的趋势和超过 10,000 颗星的情况</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">为什么 grep 式代码检索会烧毁人工智能编码代理的标记<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>人工智能编码代理只有了解任务周围的代码库：函数调用路径、命名约定、相关测试、数据模型和历史实现模式，才能写出有用的代码。大的上下文窗口会有所帮助，但并不能解决检索问题。如果错误的文件进入上下文，模型仍会浪费令牌，并可能从不相干的代码中进行推理。</p>
<p>代码检索通常分为两大模式：</p>
<table>
<thead>
<tr><th>检索模式</th><th>如何工作</th><th>故障所在</th></tr>
</thead>
<tbody>
<tr><td>Grep 式检索</td><td>搜索字面字符串，然后读取匹配的文件或行范围。</td><td>会遗漏语义相关的代码，返回噪声匹配，而且经常需要重复搜索/读取循环。</td></tr>
<tr><td>RAG 式检索</td><td>预先索引代码，然后通过语义、词法或混合搜索检索相关的代码块。</td><td>需要分块、嵌入、索引和更新逻辑，大多数编码工具不想直接拥有这些功能。</td></tr>
</tbody>
</table>
<p>这与开发人员在<a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">RAG 应用程序</a>设计中看到的区别是一样的：字面匹配是有用的，但当意义很重要时，字面匹配很少足够。名为<code translate="no">compute_final_cost()</code> 的函数可能与有关<code translate="no">calculate_total_price()</code> 的查询相关，即使准确的词语并不匹配。这就是<a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">语义搜索的</a>帮助所在。</p>
<p>在一次调试运行中，克劳德代码在找到正确区域之前反复搜索和读取文件。几分钟后，它所读取的代码中只有一小部分是相关的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>克劳德代码 grep 式搜索在无关文件读取上花费时间</span> </span></p>
<p>这种模式很常见，以至于开发人员公开抱怨：Agent 可以很聪明，但上下文检索循环仍让人感觉昂贵且不精确。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>开发人员对克劳德代码上下文和标记使用的评论</span> </span></p>
<p>Grep 式检索会以三种可预测的方式失败：</p>
<ul>
<li><strong>信息过载：</strong>大型资源库会产生许多字面匹配，而大多数字面匹配对当前任务并无用处。</li>
<li><strong>语义盲区：</strong>grep 匹配的是字符串，而不是意图、行为或等效的实现模式。</li>
<li><strong>上下文丢失：</strong>行级匹配不会自动包含周围的类、依赖关系、测试或调用图。</li>
</ul>
<p>一个更好的代码检索层需要将关键字精度与语义理解相结合，然后返回足够完整的代码块，以便模型对代码进行推理。</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">什么是 Claude Context？<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context 是一个用于代码检索的开源<a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">模型上下文协议</a>服务器。它将人工智能编码工具与 Milvus 支持的代码索引连接起来，因此 Agents 可以按含义搜索代码库，而不是仅仅依赖字面文本搜索。</p>
<p>目标很简单：当 Agents 询问上下文时，返回最小的有用代码块集。Claude Context 通过解析代码库、生成 Embeddings、将代码块存储在<a href="https://zilliz.com/what-is-milvus">Milvus 向量数据库</a>中以及通过兼容 MCP 的工具公开检索来实现这一目标。</p>
<table>
<thead>
<tr><th>Grep 问题</th><th>Claude Context 方法</th></tr>
</thead>
<tbody>
<tr><td>太多不相关的匹配</td><td>通过向量相似性和关键词相关性对代码块进行排序。</td></tr>
<tr><td>没有语义理解</td><td>使用<a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">Embeddings 模型</a>，即使名称不同，也能匹配相关的实现。</td></tr>
<tr><td>周围上下文缺失</td><td>返回具有足够结构的完整代码块，以便模型对行为进行推理。</td></tr>
<tr><td>重复读取文件</td><td>首先搜索索引，然后只读取或编辑重要文件。</td></tr>
</tbody>
</table>
<p>由于 Claude Context 是通过 MCP 公开的，因此它可以与 Claude Code、Gemini CLI、Cursor 风格的 MCP 主机以及其他与 MCP 兼容的环境协同工作。同一个核心检索层可以支持多个 Agents 接口。</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Claude Context 的工作原理<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context 有两个主要层：可重用的核心模块和集成模块。核心层处理解析、分块、索引、搜索和增量同步。上层则通过 MCP 和编辑器集成来实现这些功能。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>Claude Context 架构显示了 MCP 集成、核心模块、Embeddings 提供商和向量数据库</span> </span></p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">MCP 如何将 Claude Context 与编码代理连接起来？</h3><p>MCP 提供了 LLM 主机与外部工具之间的接口。通过将 Claude Context 作为 MCP 服务器公开，检索层可以独立于任何一个集成开发环境或编码助手。Agents 调用搜索工具；Claude Context 处理代码索引并返回相关块。</p>
<p>如果您想了解更广泛的模式，<a href="https://milvus.io/docs/milvus_and_mcp.md">MCP + Milvus 指南</a>展示了 MCP 如何将人工智能工具连接到向量数据库操作。</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">为什么使用 Milvus 进行代码检索？</h3><p>代码检索需要快速的向量搜索、元数据过滤和足够的规模来处理大型资源库。Milvus 专为高性能向量搜索而设计，可支持密集向量、稀疏向量和 Rerankers 工作流。对于构建检索繁重的 Agents 系统的团队来说，<a href="https://milvus.io/docs/multi-vector-search.md">多向量混合搜索</a>文档和<a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">PyMilvus hybrid_search API</a>显示了生产系统中使用的相同底层检索模式。</p>
<p>Claude Context 可以使用 Zilliz Cloud 作为受管的 Milvus 后端，这样就避免了自己运行和扩展向量数据库。同样的架构也可适用于自我管理的 Milvus 部署。</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Claude Context 支持哪些嵌入提供商？</h3><p>Claude Context 支持多种嵌入选项：</p>
<table>
<thead>
<tr><th>提供商</th><th>最适合</th></tr>
</thead>
<tbody>
<tr><td>OpenAI 嵌入程序</td><td>具有广泛生态系统支持的通用托管嵌入式程序。</td></tr>
<tr><td>Voyage 人工智能嵌入式程序</td><td>面向代码的检索，尤其是在搜索质量非常重要的情况下。</td></tr>
<tr><td>Ollama</td><td>针对隐私敏感环境的本地嵌入工作流。</td></tr>
</tbody>
</table>
<p>有关 Milvus 的相关工作流程，请参阅<a href="https://milvus.io/docs/embeddings.md">Milvus 嵌入概述</a>、<a href="https://milvus.io/docs/embed-with-openai.md">OpenAI 嵌入集成</a>、<a href="https://milvus.io/docs/embed-with-voyage.md">Voyage 嵌入集成</a>以及<a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">使用 Milvus</a> 运行<a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Ollama 的</a>示例。</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">为什么核心库使用 TypeScript 编写？</h3><p>Claude Context 使用 TypeScript 编写，是因为许多编码代理集成、编辑器插件和 MCP 主机已经是 TypeScript 的重灾区。将检索核心保留在 TypeScript 中，可以更容易地与应用层工具集成，同时还能提供简洁的 API。</p>
<p>核心模块将向量数据库和 Embeddings 提供商抽象为一个可组合的<code translate="no">Context</code> 对象：</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Claude Context 如何对代码进行分块并保持索引的新鲜度<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>代码分块和增量更新决定了代码检索系统在实践中是否可用。如果代码块太小，模型就会失去上下文。如果代码块过大，检索系统就会产生噪音。如果索引太慢，开发人员就会停止使用。</p>
<p>Claude Context 通过基于 AST 的代码分块、后备文本分割器和基于 Merkle 树的变更检测来解决这个问题。</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">基于 AST 的代码分块如何保留上下文？</h3><p>AST 分块是主要策略。Claude Context 不会按照行数或字符数分割文件，而是围绕语义单元（如函数、类和方法）解析代码结构和分块。</p>
<p>这就为每个分块提供了三个有用的属性：</p>
<table>
<thead>
<tr><th>属性</th><th>为何重要</th></tr>
</thead>
<tbody>
<tr><td>语法完整性</td><td>函数和类不会在中间被分割。</td></tr>
<tr><td>逻辑一致性</td><td>相关的逻辑保持一致，因此检索到的数据块更易于模型使用。</td></tr>
<tr><td>多语言支持</td><td>不同的树形分隔器可以处理 JavaScript、Python、Java、Go 和其他语言。</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>基于 AST 的代码分块可保留完整的语法单元和分块结果</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">AST 解析失败时会发生什么？</h3><p>对于 AST 解析无法处理的语言或文件，Claude Context 会退回到 LangChain 的<code translate="no">RecursiveCharacterTextSplitter</code> 。它不如 AST 分块精确，但可以防止索引在不支持的输入上失效。</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Claude Context 如何避免对整个资源库重新建立索引？</h3><p>每次更改后都重新为整个版本库建立索引成本太高。Claude Context 使用 Merkle 树来准确检测变更内容。</p>
<p>梅克尔树为每个文件分配一个哈希值，从每个目录的子目录推导出每个目录的哈希值，然后将整个版本库的哈希值卷到一个根哈希值中。如果根散列没有变化，Claude Context 就可以跳过索引。如果根目录发生变化，它就会沿着树向下走，找到发生变化的文件，并只重新嵌入这些文件。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>梅克尔树变化检测比较未改变和已改变的文件哈希值</span> </span></p>
<p>同步分三个阶段运行：</p>
<table>
<thead>
<tr><th>阶段</th><th>发生什么</th><th>为何高效</th></tr>
</thead>
<tbody>
<tr><td>快速检查</td><td>将当前 Merkle 根与上次快照进行比较。</td><td>如果没有变化，则快速完成检查。</td></tr>
<tr><td>精确差异</td><td>走查树以识别添加、删除和修改的文件。</td><td>只有更改过的路径才会向前移动。</td></tr>
<tr><td>增量更新</td><td>重新计算已更改文件的 Embeddings 并更新 Milvus。</td><td>向量索引无需完全重建即可保持新鲜。</td></tr>
</tbody>
</table>
<p>本地同步状态存储在<code translate="no">~/.context/merkle/</code> 下，因此 Claude Context 可以在重启后恢复文件哈希表和序列化梅克尔树。</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">Claude 代码使用 Claude Context 时会发生什么？<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>在启动 Claude Code 之前，只需执行一个命令进行设置：</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>索引版本库后，Claude 代码需要代码库上下文时就可以调用 Claude Context。在同样的查找 bug 的场景中，Claude Context 找到了准确的文件和行号，并给出了完整的解释。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Claude Context 演示显示 Claude 代码找到了相关的错误位置</span> </span></p>
<p>该工具不仅限于查找错误。它还有助于重构、重复代码检测、问题解决、测试生成以及 Agents 需要准确版本库上下文的任何任务。</p>
<p>在我们的基准测试中，Claude Context 在同等召回率的情况下，令牌消耗减少了 39.4%，工具调用减少了 36.1%。这很重要，因为工具调用和不相关的文件读取往往是编码代理工作流的主要成本。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Claude Context 减少令牌使用和工具调用的基准图</span> </span></p>
<p>该项目在 GitHub 上的星级已超过 10,000 个，资源库中包含完整的基准详情和软件包链接。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>Claude Context 的 GitHub 星级历史显示了快速增长</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Claude Context 与 grep 在真实错误上的比较如何？<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>该基准比较了纯文本搜索与 Milvus 支持的代码检索在真实调试任务上的表现。两者的区别不仅仅在于标记数量的减少。Claude Context 改变了 Agents 的搜索路径：它更接近需要更改的实现。</p>
<table>
<thead>
<tr><th>案例</th><th>基准行为</th><th>克劳德上下文行为</th><th>减少标记</th></tr>
</thead>
<tbody>
<tr><td>Django<code translate="no">YearLookup</code> 错误</td><td>搜索了错误的相关符号并编辑了注册逻辑。</td><td>直接找到<code translate="no">YearLookup</code> 优化逻辑。</td><td>标记减少 93</td></tr>
<tr><td>Xarray<code translate="no">swap_dims()</code> bug</td><td>阅读了提及<code translate="no">swap_dims</code> 的零散文件。</td><td>更直接地找到了实现和相关测试。</td><td>标记减少 62</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">案例 1：Django YearLookup 错误</h3><p><strong>问题描述：</strong>在 Django 框架中，<code translate="no">YearLookup</code> 查询优化会破坏<code translate="no">__iso_year</code> 过滤。当使用<code translate="no">__iso_year</code> 过滤器时，<code translate="no">YearLookup</code> 类错误地应用了标准的 BETWEEN 优化 - 对日历年有效，但对 ISO 周数年无效。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>基线（grep）：</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>文本搜索侧重于<code translate="no">ExtractIsoYear</code> 注册，而不是<code translate="no">YearLookup</code> 中的优化逻辑。</p>
<p><strong>克劳德语境：</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>语义搜索将<code translate="no">YearLookup</code> 理解为核心概念，并直接进入正确的类。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Django YearLookup 基准表显示，使用 Claude Context 时，词块减少了 93</span> </span></p>
<p><strong>结果：</strong>托克减少 93%。</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">案例 2：Xarray swap_dims 错误</h3><p><strong>问题描述：</strong>Xarray 库的<code translate="no">.swap_dims()</code> 方法出乎意料地改变了原始对象，违反了对不变性的预期。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>基线（grep）：</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>基线花时间浏览目录和阅读附近的代码，然后才找到实际的实现路径。</p>
<p><strong>Claude Context：</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>语义搜索能更快地找到相关的<code translate="no">swap_dims()</code> 实现和相关上下文。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Xarray swap_dims 基准表显示，使用 Claude Context 后，标记数减少了 62</span> </span></p>
<p><strong>结果：</strong>标记减少 62%。</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">开始使用 Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>如果你想尝试本文章中的确切工具，请从<a href="https://github.com/zilliztech/claude-context">Claude Context GitHub 代码库</a>和<a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">Claude Context MCP 包</a>开始。该仓库包括设置说明、基准和核心 TypeScript 包。</p>
<p>如果你想了解或定制检索层，这些资源是下一步的有用资源：</p>
<ul>
<li>通过<a href="https://milvus.io/docs/quickstart.md">Milvus 快速入门</a>学习向量数据库基础知识。</li>
<li>如果想将 BM25 风格搜索与密集向量相结合，请探索<a href="https://milvus.io/docs/full-text-search.md">Milvus 全文</a>搜索和<a href="https://milvus.io/docs/full_text_search_with_milvus.md">LangChain 全文搜索教程</a>。</li>
<li>如果要比较基础架构选项，请查看<a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">开源向量搜索引擎</a>。</li>
<li>如果想直接在<a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Claude Code</a>工作流程内进行向量数据库操作，可以试试 Claude Code<a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">的 Zilliz Cloud Plugin</a>。</li>
</ul>
<p>如需 Milvus 或代码检索架构方面的帮助，请加入<a href="https://milvus.io/community/">Milvus 社区</a>或预约<a href="https://milvus.io/office-hours">Milvus Office Hours</a>，获得一对一指导。如果您想跳过基础架构设置，请<a href="https://cloud.zilliz.com/signup">注册 Zilliz Cloud</a>或<a href="https://cloud.zilliz.com/login">登录 Zilliz Cloud</a>并使用托管的 Milvus 作为后台。</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">常见问题<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">为什么 Claude Code 在某些编码任务中会使用很多令牌？</h3><p>当一项任务需要在大型资源库中重复搜索和文件读取循环时，克劳德代码会使用很多令牌。如果代理通过关键字搜索，读取无关文件，然后再次搜索，那么即使代码对任务无用，每读取一个文件都会增加令牌。</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">Claude Context 如何减少克劳德代码令牌的使用？</h3><p>Claude Context 通过在代理读取文件前搜索 Milvus 支持的代码索引来减少标记使用量。它通过混合搜索检索相关代码块，因此克劳德代码可以检查更少的文件，将更多的上下文窗口用于真正重要的代码。</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Claude Context 是否只适用于 Claude 代码？</h3><p>不是。Claude Context 是作为 MCP 服务器公开的，因此可以与任何支持 MCP 的编码工具配合使用。Claude Code 是本篇文章的主要示例，但同样的检索层也可以支持其他兼容 MCP 的集成开发环境和 Agents 工作流。</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">使用 Claude Context 需要 Zilliz Cloud 吗？</h3><p>Claude Context 可以使用 Zilliz Cloud 作为受管的 Milvus 后端，如果不想操作向量数据库基础设施，这是最简单的路径。同样的检索架构基于 Milvus 概念，因此团队也可以将其调整为自我管理的 Milvus 部署。</p>
