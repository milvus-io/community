---
id: why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
title: 为什么您的 Vibe 编码会生成过时的代码以及如何使用 Milvus MCP 修复它
author: Cheney Zhang
date: 2025-06-13T00:00:00.000Z
cover: assets.zilliz.com/milvus_mcp_b1dab2a00c.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, LLM'
meta_keywords: 'Vibe coding, mcp, Milvus, model context protocol'
meta_title: |
  Why Your Vibe Coding Generates Outdated Code and How to Fix It with Milvus MCP
desc: Vibe Coding 中的幻觉问题是生产力的杀手。Milvus MCP 展示了专门的 MCP 服务器如何通过实时访问当前文档来解决这一问题。
origin: >-
  https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
---
<h2 id="The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="common-anchor-header">破坏 Vibe Coding 流程的一件事<button data-href="#The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Coding 正处于风口浪尖。Cursor 和 Windsurf 等工具正在重新定义我们编写软件的方式，让开发工作变得轻松直观。询问一个函数，就能得到一个代码片段。需要快速调用 API？在你输入之前，它就已经生成了。</p>
<p><strong>然而，有一个问题却破坏了这种氛围：人工智能助手生成的代码往往是过时的，在生产中会出现问题。</strong>这是因为为这些工具提供动力的 LLMs 通常依赖于过时的训练数据。即使是最聪明的人工智能副驾驶员，也会建议使用落后一年或三年的代码。最终，你可能会使用不再有效的语法、过时的 API 调用，或者是当今框架不鼓励的做法。</p>
<p>请看这个例子：我让 Cursor 生成 Milvus 连接代码，结果生成了这个：</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>这在以前可以完美运行，但当前的 pymilvus SDK 建议在所有连接和操作中使用<code translate="no">MilvusClient</code> 。旧方法已不再被视为最佳实践，但人工智能助手仍在继续建议使用旧方法，因为他们的训练数据往往已经过时数月或数年。</p>
<p>更糟糕的是，当我请求使用 OpenAI API 代码时，Cursor 使用<code translate="no">gpt-3.5-turbo</code>生成了一个片段--这个模型现在已被 OpenAI 标为<em>Legacy</em>，价格是其后继者的三倍，但效果却很差。代码还依赖于<code translate="no">openai.ChatCompletion</code> ，这是一个在 2024 年 3 月就已废弃的 API。</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_pricing_6bfa92d83b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这不仅仅是代码崩溃的问题，更是<strong>流程崩溃的</strong>问题。Vibe Coding 的整个承诺就是开发过程应该流畅、直观。但当你的人工智能助手生成废弃的 API 和过时的模式时，这种感觉就会消失。你又回到了 Stack Overflow，回到了文档搜索，回到了以前的做事方式。</p>
<p>尽管 Vibe Coding 工具取得了长足进步，但开发人员仍然要花费大量时间，在生成的代码和生产就绪的解决方案之间架起 "最后一英里 "的桥梁。氛围是有了，但准确性却没有。</p>
<p><strong>直到现在。</strong></p>
<h2 id="Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="common-anchor-header">Milvus MCP：随时更新文档的活力编码<button data-href="#Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="anchor-icon" translate="no">
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
    </button></h2><p>那么，是否有办法将 Cursor 等工具的强大代码生成功能<em>与</em>最新文档相结合，从而在集成开发环境中直接生成准确的代码呢？</p>
<p>当然有。通过将模型上下文协议（MCP）与检索增强生成（RAG）相结合，我们创建了一个名为<strong>Milvus MCP</strong> 的增强型解决方案。它可以帮助使用 Milvus SDK 的开发人员自动访问最新文档，使他们的集成开发环境生成正确的代码。这项服务即将推出，我们将在这里先睹为快，了解其背后的架构。</p>
<h3 id="How-It-Works" class="common-anchor-header">工作原理</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/The_Architecture_Behind_MCP_c9093162b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>上图显示了一个混合系统，它结合了 MCP（模型上下文协议）和 RAG（检索-增强生成）架构，帮助开发人员生成准确的代码。</p>
<p>在左侧，在 Cursor 或 Windsurf 等人工智能集成开发环境中工作的开发人员通过聊天界面进行交互，从而触发 MCP 工具调用。这些请求会被发送到右侧的 MCP 服务器，该服务器托管着用于代码生成和重构等日常编码任务的专用工具。</p>
<p>RAG 组件在 MCP 服务器端操作，其中的 Milvus 文档已经过预处理，并作为向量存储在 Milvus 数据库中。当工具收到查询时，它会执行语义搜索，检索最相关的文档片段和代码示例。然后，这些上下文信息会被发送回客户端，由 LLM 利用这些信息生成准确的最新代码建议。</p>
<h3 id="MCP-transport-mechanism" class="common-anchor-header">MCP 传输机制</h3><p>MCP 支持两种传输机制：<code translate="no">stdio</code> 和<code translate="no">SSE</code> ：</p>
<ul>
<li><p>标准输入/输出（stdio）：<code translate="no">stdio</code> 传输机制允许通过标准输入/输出流进行通信。它对本地工具或命令行集成特别有用。</p></li>
<li><p>服务器发送事件（SSE）：SSE 支持服务器到客户端的流，使用 HTTP POST 请求进行客户端到服务器的通信。</p></li>
</ul>
<p>由于<code translate="no">stdio</code> 依赖于本地基础设施，用户必须自行管理文件摄取。在我们的案例中，<strong>SSE 更适合--</strong>服务器会自动处理所有文档的处理和更新。例如，文档可以每天重新索引。用户只需将此 JSON 配置添加到他们的 MCP 设置中：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus-code-generate-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;http://&lt;SERVER_ADDRESS&gt;:23333/milvus-code-helper/sse&quot;</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>一旦配置就绪，您的集成开发环境（如 Cursor 或 Windsurf）就可以开始与服务器端工具通信--自动检索最新的 Milvus 文档，以便更智能地生成最新代码。</p>
<h2 id="Milvus-MCP-in-Action" class="common-anchor-header">运行中的 Milvus MCP<button data-href="#Milvus-MCP-in-Action" class="anchor-icon" translate="no">
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
    </button></h2><p>为了展示该系统在实践中是如何工作的，我们在 Milvus MCP 服务器上创建了三个即用型工具，您可以直接从您的集成开发环境访问这些工具。每个工具都能解决开发人员在使用 Milvus 时面临的常见问题：</p>
<ul>
<li><p><strong>pymilvus 代码生成器</strong>：当你需要使用 pymilvus SDK 执行创建 Collections、插入数据或运行搜索等常见 Milvus 操作时，为你编写 Python 代码。</p></li>
<li><p><strong>orm 客户端代码转换器</strong>：用更简单、更新的 MilvusClient 语法替换过时的 ORM（对象关系映射）模式，从而使您现有的 Python 代码现代化。</p></li>
<li><p><strong>语言翻译器</strong>：在编程语言之间转换您的 Milvus SDK 代码。例如，如果您有 Python SDK 代码，但需要使用 TypeScript SDK，该工具就能为您翻译。</p></li>
</ul>
<p>现在，让我们看看它们是如何工作的。</p>
<h3 id="pymilvus-code-generator" class="common-anchor-header">pymilvus 代码生成器</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504910?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="pymilvus-code-generator"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>在这个演示中，我要求 Cursor 使用<code translate="no">pymilvus</code> 生成全文搜索代码。Cursor 成功调用了正确的 MCP 工具，并输出了符合规范的代码。大多数<code translate="no">pymilvus</code> 用例都能与该工具无缝配合。</p>
<p>下面是使用和不使用该工具的并排比较。</p>
<p><strong>使用 MCP MCP：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/With_Milvus_MCP_f72ad4cfb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ 带有 Milvus MCP 的 Cursor 使用最新的<code translate="no">MilvusClient</code> 接口创建 Collections。</p>
<p><strong>无 MCP：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Without_Milvus_MCP_3336d956a4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ 不带 Milvus MCP 服务器的 Cursor 使用过时的 ORM 语法-不再建议使用。</p>
<h3 id="orm-client-code-convertor" class="common-anchor-header">ORM 客户端代码转换器</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504859?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="orm-client-code-convertor"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>在本例中，用户突出显示了一些 ORM 风格的代码并请求转换。该工具使用<code translate="no">MilvusClient</code> 实例正确重写了连接和 Schema 逻辑。用户只需点击一下即可接受所有更改。</p>
<h3 id="language-translator" class="common-anchor-header"><strong>语言翻译器</strong></h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504885?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="tool3 ts-1"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>在这里，用户选择<code translate="no">.py</code> 文件并要求进行 TypeScript 翻译。该工具会调用正确的 MCP 端点，检索最新的 TypeScript SDK 文档，并输出具有相同业务逻辑的等效<code translate="no">.ts</code> 文件。这非常适合跨语言迁移。</p>
<h2 id="Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="common-anchor-header">Milvus MCP 与 Context7、DeepWiki 和其他工具的比较<button data-href="#Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="anchor-icon" translate="no">
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
    </button></h2><p>我们在 Vibe Coding 中讨论过 "最后一英里 "的幻觉问题。除了我们的 Milvus MCP，许多其他工具也以解决这一问题为目标，如 Context7 和 DeepWiki。这些工具通常由 MCP 或 RAG 提供支持，可帮助将最新文档和代码示例注入模型的上下文窗口。</p>
<h3 id="Context7" class="common-anchor-header">上下文 7</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Context7_fc32b53a0e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图Context7 的 Milvus 页面可让用户搜索和自定义文档片段<a href="https://context7.com/milvus-io/milvus">（https://context7.com/milvus-io/milvus）</a></p>
<p>Context7 为 LLMs 和人工智能代码编辑器提供最新的、针对特定版本的文档和代码示例。它所解决的核心问题是，LLMs 依赖于您所使用的库的过时或通用信息，为您提供过时的、基于一年前的训练数据的代码示例。</p>
<p>Context7 MCP 可直接从源代码中提取最新的、特定版本的文档和代码示例，并将其直接放入您的提示中。它支持 GitHub 仓库导入和<code translate="no">llms.txt</code> 文件，包括<code translate="no">.md</code>,<code translate="no">.mdx</code>,<code translate="no">.txt</code>,<code translate="no">.rst</code> 和<code translate="no">.ipynb</code> 等格式（不支持<code translate="no">.py</code> 文件）。</p>
<p>用户既可以手动从网站上复制内容，也可以使用 Context7 的 MCP 集成进行自动检索。</p>
<h3 id="DeepWiki" class="common-anchor-header"><strong>深度维基</strong></h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Wiki_bebe01aa6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>图DeepWiki 提供自动生成的 Milvus 摘要，包括逻辑和架构<a href="https://deepwiki.com/milvus-io/milvus">(https://deepwiki.com/milvus-io/milvus)</a></p>
<p>DeepWiki 可自动解析开源 GitHub 项目，以创建可读的技术文档、图表和流程图。它包括一个聊天界面，用于自然语言问答。不过，它优先处理代码文件，而不是文档，因此可能会忽略文档的关键见解。目前还没有集成 MCP。</p>
<h3 id="Cursor-Agent-Mode" class="common-anchor-header">光标代理模式</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cursor_Agent_Mode_fba8ef66af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cursor 的代理模式可以进行网络搜索、MCP 调用和插件切换。虽然功能强大，但有时不连贯。您可以使用<code translate="no">@</code> 手动插入文档，但这需要您先找到并附加内容。</p>
<h3 id="llmstxt" class="common-anchor-header">LLMS.txt</h3><p><code translate="no">llms.txt</code> 不是一个工具，它是一个拟议的标准，为 LLMs 提供结构化的网站内容。通常，它以 Markdown 的形式放在网站的根目录中，并组织标题、文档树、教程、API 链接等内容。</p>
<p>它本身并不是一个工具，但可以与支持它的工具很好地搭配使用。</p>
<h3 id="Side-by-Side-Feature-Comparison-Milvus-MCP-vs-Context7-vs-DeepWiki-vs-Cursor-Agent-Mode-vs-llmstxt" class="common-anchor-header">并排功能比较：Milvus MCP vs. Context7 vs. DeepWiki vs. 光标代理模式 vs llms.txt</h3><table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>功能</strong></td><td style="text-align:center"><strong>Context7</strong></td><td style="text-align:center"><strong>深度维基</strong></td><td style="text-align:center"><strong>光标代理模式</strong></td><td style="text-align:center"><strong>llms.txt</strong></td><td style="text-align:center"><strong>Milvus MCP</strong></td></tr>
<tr><td style="text-align:center"><strong>文档处理</strong></td><td style="text-align:center">仅文档，无代码</td><td style="text-align:center">注重代码，可能会遗漏文档</td><td style="text-align:center">用户选择</td><td style="text-align:center">结构化 Markdown</td><td style="text-align:center">仅限 Milvus 官方文档</td></tr>
<tr><td style="text-align:center"><strong>上下文检索</strong></td><td style="text-align:center">自动注入</td><td style="text-align:center">手动复制/粘贴</td><td style="text-align:center">混合使用，准确性较低</td><td style="text-align:center">结构化预标记</td><td style="text-align:center">自动从向量存储检索</td></tr>
<tr><td style="text-align:center"><strong>自定义导入</strong></td><td style="text-align:center">✅ GitHub，llms.txt</td><td style="text-align:center">✅ GitHub（包括私人网站）</td><td style="text-align:center">仅手动选择</td><td style="text-align:center">✅ 手动编写</td><td style="text-align:center">服务器维护</td></tr>
<tr><td style="text-align:center"><strong>人工努力</strong></td><td style="text-align:center">部分（MCP 与手动）</td><td style="text-align:center">手动复制</td><td style="text-align:center">半手动</td><td style="text-align:center">仅限管理员</td><td style="text-align:center">无需用户操作</td></tr>
<tr><td style="text-align:center"><strong>MCP 集成</strong></td><td style="text-align:center">✅ 是</td><td style="text-align:center">否</td><td style="text-align:center">是（需要设置）</td><td style="text-align:center">不是工具</td><td style="text-align:center">需要</td></tr>
<tr><td style="text-align:center"><strong>优势</strong></td><td style="text-align:center">实时更新、集成开发环境就绪</td><td style="text-align:center">可视化图表、QA 支持</td><td style="text-align:center">自定义工作流程</td><td style="text-align:center">用于人工智能的结构化数据</td><td style="text-align:center">由 Milvus/Zilliz 维护</td></tr>
<tr><td style="text-align:center"><strong>局限性</strong></td><td style="text-align:center">不支持代码文件</td><td style="text-align:center">跳过文档</td><td style="text-align:center">依赖网络准确性</td><td style="text-align:center">需要其他工具</td><td style="text-align:center">只专注于 Milvus</td></tr>
</tbody>
</table>
<p>Milvus MCP 是专为 Milvus 数据库开发而构建的。它能自动获取最新的官方文档，并与您的编码环境无缝协作。如果您正在使用 Milvus，这是您的最佳选择。</p>
<p>其他工具，如 Context7、DeepWiki 和 Cursor Agent Mode，可与许多不同的技术配合使用，但它们对于 Milvus 专属工作的专业性和准确性都不尽如人意。</p>
<p>请根据自己的需要进行选择。好消息是，这些工具能很好地协同工作--你可以同时使用几种工具，为项目的不同部分获得最佳效果。</p>
<h2 id="Milvus-MCP-is-Coming-Soon" class="common-anchor-header">Milvus MCP 即将推出！<button data-href="#Milvus-MCP-is-Coming-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Coding 中的幻觉问题不仅仅是一个小麻烦，它还是生产力的杀手，迫使开发人员回到手动验证工作流程中。Milvus MCP 展示了专门的 MCP 服务器如何通过提供对当前文档的实时访问来解决这一问题。</p>
<p>对于 Milvus 开发人员来说，这意味着不再需要调试过时的<code translate="no">connections.connect()</code> 调用或与过时的 ORM 模式搏斗。这三个工具--Pymilvus-code-generator、orm-client-code-convertor 和 language-translator 可以自动处理最常见的痛点。</p>
<p>准备好试用了吗？该服务即将推出早期测试版本。敬请期待。</p>
