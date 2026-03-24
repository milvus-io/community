---
id: geo-content-pipeline-openclaw-milvus.md
title: 规模化的 GEO 内容：如何在不损害品牌的情况下获得人工智能搜索排名
author: 'Dean Luo, Lumina Wang'
date: 2026-3-24
cover: assets.zilliz.com/1774360780756_980bb85342.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG, GEO'
meta_keywords: >-
  generative engine optimization, AI search ranking, GEO content strategy, AI
  content at scale, SEO to GEO
meta_title: |
  GEO at Scale: Rank in AI Search Without AI Content Spam
desc: 随着人工智能答案取代点击，您的有机流量正在下降。了解如何大规模生成 GEO 内容，而不会产生幻觉和品牌损害。
origin: 'https://milvus.io/blog/geo-content-pipeline-openclaw-milvus.md'
---
<p>您的有机搜索流量正在下降，而这并不是因为您的搜索引擎优化变差了。<a href="https://sparktoro.com/blog/in-2024-half-of-google-searches-end-without-a-click-to-another-web-property/">根据 SparkToro 的数据，</a>现在约有 70% 的谷歌查询以零点击告终--用户从人工智能生成的摘要中获得答案，而不是点击进入你的页面。Perplexity、ChatGPT Search、谷歌人工智能概述--这些都不是未来的威胁。它们已经在吞噬你的流量。</p>
<p><strong>生成式引擎优化（GEO）</strong>是您反击的方式。传统搜索引擎优化针对排名算法（关键词、反向链接、页面速度）进行优化，而 GEO 则针对人工智能模型进行优化，这些模型通过从多个来源获取信息来撰写答案。目标是：调整内容结构，让人工智能搜索引擎在回答时引用<em>您的品牌</em>。</p>
<p>问题在于，GEO 所需的内容规模是大多数营销团队无法手动制作的。人工智能模型并不依赖单一来源，它们会综合数十个来源。要想持续显示，你需要覆盖数百个长尾查询，每个查询都针对用户可能向人工智能助手提出的特定问题。</p>
<p>显而易见的捷径--让 LLM 批量生成文章--会带来更严重的问题。让 GPT-4 制作 50 篇文章，你会得到 50 篇充满捏造的统计数据、重复的措辞和你的品牌从未提出过的主张的文章。这不是 GEO。这是<strong>人工智能垃圾内容，上面还印着你的品牌名称</strong>。</p>
<p>解决的办法是将每一次生成调用都建立在经过验证的源文件基础上--真实的产品规格、经过批准的品牌信息以及 LLM 借鉴而非编造的实际数据。本教程将介绍一个基于以下三个组件的生产流水线：</p>
<ul>
<li><strong><a href="https://github.com/nicepkg/openclaw">OpenClaw</a></strong>- 一个开源的人工智能 Agents 框架，用于协调工作流程并连接 Telegram、WhatsApp 和 Slack 等消息平台</li>
<li><strong><a href="https://milvus.io/intro">Milvus</a></strong>--处理知识存储、语义重复数据删除和 RAG 检索的<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a></li>
<li><strong>LLMs（GPT-4o、Claude、Gemini）</strong>--生成和评估引擎</li>
</ul>
<p>最后，您将拥有一个工作系统，它能将品牌文档摄入 Milvus 支持的知识库，将种子主题扩展为长尾查询，对其进行语义重复，并通过内置的质量评分批量生成文章。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_4_8ef2bfd688.png" alt="GEO strategy overview — four pillars: Semantic analysis, Content structuring, Brand authority, and Performance tracking" class="doc-image" id="geo-strategy-overview-—-four-pillars:-semantic-analysis,-content-structuring,-brand-authority,-and-performance-tracking" />
   <span>GEO 战略概述--四大支柱：语义分析、内容结构、品牌权威和性能跟踪</span> </span></p>
<blockquote>
<p><strong>注：</strong>这是一个为实际营销工作流程构建的工作系统，但代码只是一个起点。您需要根据自己的使用情况调整提示、评分阈值和知识库结构。</p>
</blockquote>
<h2 id="How-the-Pipeline-Solves-Volume-×-Quality" class="common-anchor-header">管道如何解决数量 × 质量问题<button data-href="#How-the-Pipeline-Solves-Volume-×-Quality" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>组件</th><th>作用</th></tr>
</thead>
<tbody>
<tr><td>OpenClaw</td><td>Agents 协调、消息集成（Lark、Telegram、WhatsApp）</td></tr>
<tr><td>Milvus</td><td>知识存储、语义重复数据删除、RAG 检索</td></tr>
<tr><td>LLMs （GPT-4o、Claude、Gemini）</td><td>查询扩展、文章生成、质量评分</td></tr>
<tr><td>嵌入模型</td><td>将文本转化为 Milvus 的向量（OpenAI，默认为 1536 维度）</td></tr>
</tbody>
</table>
<p>管道分两个阶段运行。<strong>第 0 阶段</strong>将源材料输入知识库。<strong>第1阶段</strong>从中生成文章。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_6_e03b129785.png" alt="How the OpenClaw GEO Pipeline works — Phase 0 (Ingest: fetch, chunk, embed, store) and Phase 1 (Generate: expand queries, dedup via Milvus, RAG retrieval, generate articles, score, and store)" class="doc-image" id="how-the-openclaw-geo-pipeline-works-—-phase-0-(ingest:-fetch,-chunk,-embed,-store)-and-phase-1-(generate:-expand-queries,-dedup-via-milvus,-rag-retrieval,-generate-articles,-score,-and-store)" />
   </span> <span class="img-wrapper"> <span>OpenClaw GEO管道如何运行--第0阶段（摄取：获取、分块、嵌入、存储）和第1阶段（生成：扩展查询、通过Milvus进行推导、RAG检索、生成文章、评分和存储）</span> </span></p>
<p>以下是第 1 阶段中发生的情况：</p>
<ol>
<li>用户通过 Lark、Telegram 或 WhatsApp 发送信息。OpenClaw 收到信息后会将其转发给 GEO 生成技能。</li>
<li>该技能使用 LLM（真实用户向人工智能搜索引擎提出的具体问题）将用户的主题扩展为长尾搜索查询。</li>
<li>每个查询都会被嵌入，并与 Milvus 进行语义重复检查。与现有内容过于相似（余弦相似度大于 0.85）的查询会被删除。</li>
<li>存活的查询会<strong>同时</strong>触发<strong>两个 Milvus Collections</strong> 中的 RAG 检索：知识库（品牌文档）和文章档案（以前生成的内容）。这种双重检索方式使输出内容始终以真实源材料为基础。</li>
<li>LLM 利用检索到的上下文生成每篇文章，然后根据 GEO 质量标准进行评分。</li>
<li>完成后的文章会写回 Milvus，为下一批内容充实演绎和 RAG 池。</li>
</ol>
<p>GEO 技能定义还包含优化规则：以直接回答为引导、使用结构化格式、明确引用来源并包含原创分析。人工智能搜索引擎会根据结构对内容进行解析，并优先处理无出处的声明，因此每条规则都与特定的检索行为相对应。</p>
<p>生成分批进行。第一轮交由客户审核。一旦方向得到确认，管道就会扩展到全面生产。</p>
<h2 id="Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="common-anchor-header">为什么知识层是 GEO 与人工智能垃圾邮件的区别？<button data-href="#Why-a-Knowledge-Layer-Is-the-Difference-Between-GEO-and-AI-Spam" class="anchor-icon" translate="no">
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
    </button></h2><p>知识层是该管道与 "只是提示 ChatGPT "的区别所在。如果没有知识层，LLM 的输出看起来光鲜亮丽，但却说不出任何可验证的内容--而人工智能搜索引擎越来越善于发现这一点。<a href="https://zilliz.com/what-is-milvus">Milvus</a> 是为这一管道提供动力的向量数据库，它在这里带来了几项重要的功能：</p>
<p><strong>语义重复数据删除可以捕捉关键词遗漏的内容。</strong>关键词匹配将 "Milvus 性能基准 "和 "Milvus 与其他向量数据库相比如何？"视为不相关的查询。<a href="https://zilliz.com/learn/vector-similarity-search">向量相似性</a>识别出它们问的是同一个问题，因此管道会跳过重复的问题，而不是浪费一次生成调用。</p>
<p><strong>双重 Collections RAG 将来源和输出分开。</strong> <code translate="no">geo_knowledge</code> 存储摄入的品牌文档。<code translate="no">geo_articles</code> 存储生成的内容。每个生成查询都会同时访问这两个集合--知识库会保持事实的准确性，而文章档案则会保持整个批次的基调一致。这两个 Collections 是独立维护的，因此更新源材料绝不会影响现有文章。</p>
<p><strong>随规模扩大而改进的反馈回路。</strong>每篇生成的文章都会立即写回 Milvus。下一批文章将拥有更大的重复数据池和更丰富的 RAG 上下文。随着时间的推移，质量会不断提高。</p>
<p><strong>零设置本地开发。</strong> <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>只需一行代码即可在本地运行，无需 Docker。对于生产，切换到 Milvus 集群或 Zilliz Cloud 只需更改一个 URI：</p>
<pre><code translate="no" class="language-python">MILVUS_URI = <span class="hljs-string">&quot;./geo_milvus.db&quot;</span>           <span class="hljs-comment"># Local dev (Milvus Lite, no Docker needed)</span>
MILVUS_URI = <span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>  <span class="hljs-comment"># Production (Zilliz Cloud)</span>
client = MilvusClient(uri=MILVUS_URI)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-by-Step-Tutorial" class="common-anchor-header">逐步教程<button data-href="#Step-by-Step-Tutorial" class="anchor-icon" translate="no">
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
    </button></h2><p>整个管道打包为 OpenClaw Skill - 一个包含<code translate="no">SKILL.MD</code> 指令文件和代码执行的目录。</p>
<pre><code translate="no">skills/geo-generator/
├── SKILL.md                    <span class="hljs-comment"># Skill definition (instructions + metadata)</span>
├── index.js                    <span class="hljs-comment"># OpenClaw tool registration, bridges to Python</span>
├── requirements.txt
└── src/
    ├── config.py               <span class="hljs-comment"># Configuration (Milvus/LLM connection)</span>
    ├── llm_client.py           <span class="hljs-comment"># LLM wrapper (embedding + chat)</span>
    ├── milvus_store.py         <span class="hljs-comment"># Milvus operations (article + knowledge collections)</span>
    ├── ingest.py               <span class="hljs-comment"># Knowledge ingestion (documents + web pages)</span>
    ├── expander.py             <span class="hljs-comment"># Step 1: LLM expands long-tail queries</span>
    ├── dedup.py                <span class="hljs-comment"># Step 2: Milvus semantic deduplication</span>
    ├── generator.py            <span class="hljs-comment"># Step 3: Article generation + GEO scoring</span>
    ├── main.py                 <span class="hljs-comment"># Main pipeline entry point</span>
    └── templates/
        └── geo_template.md     <span class="hljs-comment"># GEO article prompt template</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Define-the-OpenClaw-Skill" class="common-anchor-header">第1步：定义OpenClaw技能</h3><p><code translate="no">SKILL.md</code> 定义OpenClaw技能，告诉OpenClaw该技能能做什么以及如何调用它。它公开了两个工具：<code translate="no">geo_ingest</code> ，用于向知识库提供信息；<code translate="no">geo_generate</code> ，用于批量生成文章。它还包含GEO优化规则，这些规则决定了LLM生成的内容。</p>
<pre><code translate="no" class="language-markdown">---
name: geo-generator
description: Batch generate GEO-optimized articles <span class="hljs-keyword">using</span> Milvus vector database <span class="hljs-keyword">and</span> LLM, <span class="hljs-keyword">with</span> knowledge <span class="hljs-keyword">base</span> ingestion
version: <span class="hljs-number">1.1</span><span class="hljs-number">.0</span>
user-invocable: <span class="hljs-literal">true</span>
disable-model-invocation: <span class="hljs-literal">false</span>
command-dispatch: tool
command-tool: geo_generate
command-arg-mode: raw
metadata: {<span class="hljs-string">&quot;openclaw&quot;</span>:{<span class="hljs-string">&quot;emoji&quot;</span>:<span class="hljs-string">&quot;📝&quot;</span>,<span class="hljs-string">&quot;primaryEnv&quot;</span>:<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>,<span class="hljs-string">&quot;requires&quot;</span>:{<span class="hljs-string">&quot;bins&quot;</span>:[<span class="hljs-string">&quot;python3&quot;</span>],<span class="hljs-string">&quot;env&quot;</span>:[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>],<span class="hljs-string">&quot;os&quot;</span>:[<span class="hljs-string">&quot;darwin&quot;</span>,<span class="hljs-string">&quot;linux&quot;</span>]}}}
---
<span class="hljs-meta"># GEO Article Batch Generator</span>

<span class="hljs-meta">## What it does</span>

<span class="hljs-function">Batch generates <span class="hljs-title">GEO</span> (<span class="hljs-params">Generative Engine Optimization</span>) articles optimized <span class="hljs-keyword">for</span> AI search <span class="hljs-title">engines</span> (<span class="hljs-params">Perplexity, ChatGPT Search, Google AI Overview</span>). Uses Milvus <span class="hljs-keyword">for</span> semantic deduplication, knowledge retrieval, <span class="hljs-keyword">and</span> knowledge <span class="hljs-keyword">base</span> storage. LLM <span class="hljs-keyword">for</span> content generation.

## Tools

### geo_ingest — Feed the knowledge <span class="hljs-keyword">base</span>

Before generating articles, users can ingest authoritative source materials to improve accuracy:
- **Local files**: Markdown, TXT, PDF documents
- **Web URLs**: Fetches page content automatically

Examples:
- &quot;Ingest these Milvus docs <span class="hljs-keyword">into</span> the knowledge <span class="hljs-keyword">base</span>: https:<span class="hljs-comment">//milvus.io/docs/overview.md&quot;</span>
- &quot;Add these files to the GEO knowledge <span class="hljs-keyword">base</span>: /path/to/doc1.md /path/to/doc2.pdf&quot;

### geo_generate — Batch generate articles

When the user sends a message like &quot;Generate 20 GEO articles about Milvus vector database&quot;:
1. **Parse intent** — Extract: topic keyword, target count, optional language/tone
2. **Expand <span class="hljs-built_in">long</span>-tail questions** — Call LLM to generate N <span class="hljs-built_in">long</span>-tail search queries around the topic
3. **Deduplicate via Milvus** — Embed each query, search Milvus <span class="hljs-keyword">for</span> similar existing content, drop <span class="hljs-title">duplicates</span> (<span class="hljs-params">similarity &gt; <span class="hljs-number">0.85</span></span>)
4. **Batch generate** — For each surviving query, retrieve context <span class="hljs-keyword">from</span> BOTH knowledge <span class="hljs-keyword">base</span> <span class="hljs-keyword">and</span> previously generated articles, then call LLM <span class="hljs-keyword">with</span> GEO template
5. **Store &amp; export** — Write each article back <span class="hljs-keyword">into</span> <span class="hljs-title">Milvus</span> (<span class="hljs-params"><span class="hljs-keyword">for</span> future dedup</span>) <span class="hljs-keyword">and</span> save to output files
6. **Report progress** — Send progress updates <span class="hljs-keyword">and</span> final summary back to the chat

## Recommended workflow

1. First ingest authoritative documents/URLs about the topic
2. Then generate articles — the knowledge <span class="hljs-keyword">base</span> ensures factual accuracy

## GEO Optimization Rules

Every generated article MUST include:
- A direct, concise answer <span class="hljs-keyword">in</span> the first <span class="hljs-title">paragraph</span> (<span class="hljs-params">AI engines extract <span class="hljs-keyword">this</span></span>)
- At least 2 citations <span class="hljs-keyword">or</span> data points <span class="hljs-keyword">with</span> sources
- Structured <span class="hljs-title">headings</span> (<span class="hljs-params">H2/H3</span>), bullet lists, <span class="hljs-keyword">or</span> tables
- A unique perspective <span class="hljs-keyword">or</span> original analysis
- Schema-friendly <span class="hljs-title">metadata</span> (<span class="hljs-params">title, description, keywords</span>)

## Output format

For each article, <span class="hljs-keyword">return</span>:
- Title
- Meta description
- Full article <span class="hljs-title">body</span> (<span class="hljs-params">Markdown</span>)
- Target <span class="hljs-built_in">long</span>-tail query
- GEO <span class="hljs-title">score</span> (<span class="hljs-params"><span class="hljs-number">0</span><span class="hljs-number">-100</span>, self-evaluated</span>)

## Guardrails

- Never fabricate citations <span class="hljs-keyword">or</span> statistics — use data <span class="hljs-keyword">from</span> the knowledge <span class="hljs-keyword">base</span>
- If Milvus <span class="hljs-keyword">is</span> unreachable, report the error honestly
- Respect the user&#x27;s specified count — <span class="hljs-keyword">do</span> <span class="hljs-keyword">not</span> over-generate
- All progress updates should include current/total count
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Register-Tools-and-Bridge-to-Python" class="common-anchor-header">步骤 2：注册工具并连接到 Python</h3><p>OpenClaw在Node.js上运行，但GEO流水线使用的是Python语言。<code translate="no">index.js</code> 将两者连接起来--它将每个工具注册到OpenClaw，并委托相应的Python脚本执行。</p>
<pre><code translate="no" class="language-javascript">function _runPython(script, <span class="hljs-keyword">args</span>, config) {
  <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> Promise((resolve) =&gt; {
    <span class="hljs-keyword">const</span> child = execFile(<span class="hljs-string">&quot;python3&quot;</span>, [script, ...<span class="hljs-keyword">args</span>], {
      maxBuffer: <span class="hljs-number">10</span> * <span class="hljs-number">1024</span> * <span class="hljs-number">1024</span>,
      env: { ...process.env, ...config?.env },
    }, (error, stdout) =&gt; {
      <span class="hljs-comment">// Parse JSON result and return to chat</span>
    });
    child.stdout?.<span class="hljs-keyword">on</span>(<span class="hljs-string">&quot;data&quot;</span>, (chunk) =&gt; process.stdout.write(chunk));
  });
}

<span class="hljs-comment">// Tool 1: Ingest documents/URLs into knowledge base</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_ingest</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">const</span> <span class="hljs-keyword">args</span> = [];
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.files?.length) <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--files&quot;</span>, ...<span class="hljs-keyword">params</span>.files);
  <span class="hljs-keyword">if</span> (<span class="hljs-keyword">params</span>.urls?.length)  <span class="hljs-keyword">args</span>.push(<span class="hljs-string">&quot;--urls&quot;</span>, ...<span class="hljs-keyword">params</span>.urls);
  <span class="hljs-keyword">return</span> _runPython(INGEST_SCRIPT, <span class="hljs-keyword">args</span>, config);
}

<span class="hljs-comment">// Tool 2: Batch generate GEO articles</span>
<span class="hljs-function"><span class="hljs-keyword">async</span> function <span class="hljs-title">geo_generate</span>(<span class="hljs-params"><span class="hljs-keyword">params</span>, config</span>)</span> {
  <span class="hljs-keyword">return</span> _runPython(MAIN_SCRIPT, [
    <span class="hljs-string">&quot;--topic&quot;</span>, <span class="hljs-keyword">params</span>.topic,
    <span class="hljs-string">&quot;--count&quot;</span>, String(<span class="hljs-keyword">params</span>.count || <span class="hljs-number">20</span>),
    <span class="hljs-string">&quot;--output&quot;</span>, <span class="hljs-keyword">params</span>.output || DEFAULT_OUTPUT,
  ], config);
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Ingest-Source-Material" class="common-anchor-header">第3步：采集源材料</h3><p>在生成任何内容之前，你需要一个知识库。<code translate="no">ingest.py</code> 抓取网页或读取本地文档，将文本分块、嵌入并写入 Milvus 中的<code translate="no">geo_knowledge</code> Collections。这样才能使生成的内容基于真实信息，而不是 LLM 的幻觉。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_sources</span>(<span class="hljs-params">files=<span class="hljs-literal">None</span>, urls=<span class="hljs-literal">None</span></span>):
    llm = get_llm_client()
    milvus = get_milvus_client()
    ensure_knowledge_collection(milvus)

    <span class="hljs-keyword">for</span> url <span class="hljs-keyword">in</span> urls:
        text = extract_from_url(url)       <span class="hljs-comment"># Fetch and extract text</span>
        chunks = chunk_text(text)           <span class="hljs-comment"># Split into 800-char chunks with overlap</span>
        embeddings = get_embeddings_batch(llm, chunks)
        records = [
            {<span class="hljs-string">&quot;embedding&quot;</span>: emb, <span class="hljs-string">&quot;content&quot;</span>: chunk,
             <span class="hljs-string">&quot;source&quot;</span>: url, <span class="hljs-string">&quot;source_type&quot;</span>: <span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;chunk_index&quot;</span>: i}
            <span class="hljs-keyword">for</span> i, (chunk, emb) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, embeddings))
        ]
        insert_knowledge(milvus, records)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Expand-Long-Tail-Queries" class="common-anchor-header">第 4 步：扩展长尾查询</h3><p>给定 "Milvus 向量数据库 "这样一个主题，LLM 会生成一组具体、真实的搜索查询--真实用户在人工智能搜索引擎中输入的那种问题。提示涵盖不同的意图类型：信息、比较、如何操作、解决问题和常见问题。</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;\
You are an SEO/GEO keyword research expert. Generate long-tail search queries.
Requirements:
1. Each query = a specific question a real user might ask
2. Cover different intents: informational, comparison, how-to, problem-solving, FAQ
3. One query per line, no numbering
&quot;&quot;&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">expand_queries</span>(<span class="hljs-params">client, topic, count</span>):
    user_prompt = <span class="hljs-string">f&quot;Topic: <span class="hljs-subst">{topic}</span>\nPlease generate <span class="hljs-subst">{count}</span> long-tail search queries.&quot;</span>
    result = chat(client, SYSTEM_PROMPT, user_prompt)
    queries = [q.strip() <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> result.strip().splitlines() <span class="hljs-keyword">if</span> q.strip()]
    <span class="hljs-keyword">return</span> queries[:count]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Deduplicate-via-Milvus" class="common-anchor-header">第五步：通过 Milvus 进行重复搜索</h3><p>这就是<a href="https://zilliz.com/learn/vector-similarity-search">向量搜索</a>的优势所在。每个扩展查询都会嵌入<code translate="no">geo_knowledge</code> 和<code translate="no">geo_articles</code> Collections 并与之比较。如果余弦相似度超过 0.85，则说明该查询与系统中已有的内容在语义上重复，因此会被丢弃，从而防止管道生成五篇略有不同但都回答了相同问题的文章。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">deduplicate_queries</span>(<span class="hljs-params">llm_client, milvus_client, queries</span>):
    embeddings = get_embeddings_batch(llm_client, queries)
    unique = []
    <span class="hljs-keyword">for</span> query, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, embeddings):
        <span class="hljs-keyword">if</span> is_duplicate(milvus_client, emb, threshold=<span class="hljs-number">0.85</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [Dedup] Skipping duplicate: <span class="hljs-subst">{query}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        unique.append((query, emb))
    <span class="hljs-keyword">return</span> unique
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Generate-Articles-with-Dual-Source-RAG" class="common-anchor-header">步骤 6：使用双源 RAG 生成文章</h3><p>对于每个存活的查询，生成器都会从 Milvus 的两个 Collections 中检索上下文：从<code translate="no">geo_knowledge</code> 中检索权威的源材料，从<code translate="no">geo_articles</code> 中检索以前生成的文章。这种双重检索可保持内容的事实基础（知识库）和内部一致性（文章历史）。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_context</span>(<span class="hljs-params">client, embedding, top_k=<span class="hljs-number">3</span></span>):
    context_parts = []

    <span class="hljs-comment"># 1. Knowledge base (authoritative sources)</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_knowledge(client, embedding, top_k):
        source = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;source&quot;</span>]
        context_parts.append(<span class="hljs-string">f&quot;### Source Material (from: <span class="hljs-subst">{source}</span>):\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">800</span>]}</span>&quot;</span>)

    <span class="hljs-comment"># 2. Previously generated articles</span>
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> search_similar(client, embedding, top_k):
        context_parts.append(<span class="hljs-string">f&quot;### Related Article: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;title&#x27;</span>]}</span>\n<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">500</span>]}</span>&quot;</span>)

    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(context_parts)
<button class="copy-code-btn"></button></code></pre>
<p>这两个 Collections 使用相同的嵌入维度（1536），但存储不同的元数据，因为它们的作用不同：<code translate="no">geo_knowledge</code> 追踪每个块的来源（用于来源归属），而<code translate="no">geo_articles</code> 则存储原始查询和 GEO 分数（用于 dedup 匹配和质量过滤）。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_one</span>(<span class="hljs-params">llm_client, milvus_client, query, embedding</span>):
    context = get_context(milvus_client, embedding)  <span class="hljs-comment"># Dual-source RAG</span>
    template = _load_template()                       <span class="hljs-comment"># GEO template</span>
    user_prompt = template.replace(<span class="hljs-string">&quot;{query}&quot;</span>, query).replace(<span class="hljs-string">&quot;{context}&quot;</span>, context)

    raw = chat(llm_client, <span class="hljs-string">&quot;You are a senior GEO content writer...&quot;</span>, user_prompt)
    article = _parse_article(raw)
    article[<span class="hljs-string">&quot;geo_score&quot;</span>] = _score_article(llm_client, article[<span class="hljs-string">&quot;content&quot;</span>])  <span class="hljs-comment"># Self-evaluate</span>
    insert_article(milvus_client, article)  <span class="hljs-comment"># Write back for future dedup &amp; RAG</span>
    <span class="hljs-keyword">return</span> article
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Milvus-Data-Model" class="common-anchor-header">Milvus 数据模型</h3><p>下面是从头开始创建的每个 Collections 的外观：</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># geo_knowledge — Source material for RAG retrieval</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>)     <span class="hljs-comment"># URL or file path</span>
schema.add_field(<span class="hljs-string">&quot;source_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">32</span>)  <span class="hljs-comment"># &quot;file&quot; or &quot;url&quot;</span>

<span class="hljs-comment"># geo_articles — Generated articles for dedup + RAG</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
schema.add_field(<span class="hljs-string">&quot;query&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
schema.add_field(<span class="hljs-string">&quot;geo_score&quot;</span>, DataType.INT64)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Running-the-Pipeline" class="common-anchor-header">运行管道<button data-href="#Running-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>将<code translate="no">skills/geo-generator/</code> 目录放入 OpenClaw 技能文件夹，或将压缩文件发送给 Lark，让 OpenClaw 安装。你需要配置你的<code translate="no">OPENAI_API_KEY</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_3_da7d249862.png" alt="Screenshot showing the OpenClaw skill installation via Lark chat — uploading geo-generator.zip and the bot confirming successful installation with dependency list" class="doc-image" id="screenshot-showing-the-openclaw-skill-installation-via-lark-chat-—-uploading-geo-generator.zip-and-the-bot-confirming-successful-installation-with-dependency-list" />
   </span> <span class="img-wrapper"> <span>通过云雀聊天安装OpenClaw技能的截图--上传geo-generator.zip，机器人通过依赖列表确认安装成功</span> </span></p>
<p>然后，通过聊天信息与管道进行交互：</p>
<p><strong>例 1：</strong>将源 URL 输入知识库，然后生成文章。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_2_db83ddb4bd.png" alt="Chat screenshot showing the workflow: user ingests 3 Aristotle URLs (245 chunks added), then generates 3 GEO articles with an average score of 81.7/100" class="doc-image" id="chat-screenshot-showing-the-workflow:-user-ingests-3-aristotle-urls-(245-chunks-added),-then-generates-3-geo-articles-with-an-average-score-of-81.7/100" />
   </span> <span class="img-wrapper"> <span>显示工作流程的聊天截图：用户输入 3 个亚里士多德 URL（添加了 245 个块），然后生成 3 篇 GEO 文章，平均得分 81.7/100</span> </span></p>
<p><strong>例 2：</strong>上传一本书（《呼啸山庄》），然后生成 3 篇 GEO 文章并导出到云雀文档。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/geo_content_pipeline_openclaw_milvus_1_33657096fc.png" alt="Chat screenshot showing book ingestion (941 chunks from Wuthering Heights), then 3 generated articles exported to a Lark doc with an average GEO score of 77.3/100" class="doc-image" id="chat-screenshot-showing-book-ingestion-(941-chunks-from-wuthering-heights),-then-3-generated-articles-exported-to-a-lark-doc-with-an-average-geo-score-of-77.3/100" />
   </span> <span class="img-wrapper"> <span>聊天截图显示了书籍摄取（《呼啸山庄》中的 941 块内容），然后将生成的 3 篇文章导出到云雀文档，其 GEO 平均得分为 77.3/100</span> </span></p>
<h2 id="When-GEO-Content-Generation-Backfires" class="common-anchor-header">当 GEO 内容生成起反作用时<button data-href="#When-GEO-Content-Generation-Backfires" class="anchor-icon" translate="no">
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
    </button></h2><p>GEO 内容生成的效果取决于其背后的知识库。以下是几种弊大于利的情况：</p>
<p><strong>没有权威的原始资料。</strong>没有坚实的知识基础，LLM 只能依靠训练数据。输出结果充其量是通用的，最差也是幻觉。RAG步骤的全部意义在于将生成建立在经过验证的信息基础之上--跳过这一步，你就只是在进行额外步骤的提示工程。</p>
<p><strong>宣传不存在的东西。</strong>如果产品与描述不符，那就不是 GEO，而是错误信息。自我评分步骤会发现一些质量问题，但它无法验证知识库中不存在矛盾的说法。</p>
<p><strong>您的受众纯粹是人类。</strong>GEO 优化（结构化标题、第一段直接回答、引用密度）是为人工智能的可发现性而设计的。如果您纯粹是为人类读者撰写文章，就会感觉公式化。了解您的目标受众。</p>
<p><strong>关于删除阈值的说明。</strong>管道会丢弃余弦相似度超过 0.85 的查询。如果有太多近似重复的查询通过，请降低阈值。如果管道丢弃了看起来确实不同的查询，则应提高阈值。0.85 是一个合理的起点，但正确的值取决于你的主题有多狭窄。</p>
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
    </button></h2><p>GEO 就像十年前的搜索引擎优化--足够早，正确的基础架构能为你带来真正的优势。本教程建立了一个管道，可以生成人工智能搜索引擎实际引用的文章，以品牌自身的源材料为基础，而不是以法学硕士的幻觉为基础。该堆栈由<a href="https://github.com/nicepkg/openclaw">OpenClaw</a>负责协调，<a href="https://milvus.io/intro">Milvus</a>负责知识存储和<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>检索，LLMs 负责生成和评分。</p>
<p>完整的源代码可在<a href="https://github.com/nicepkg/openclaw">github.com/nicepkg/openclaw</a> 获取。</p>
<p>如果您正在构建 GEO 战略，并需要基础架构的支持，请加入 Milvus Slack 社区：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社区</a>，了解其他团队如何使用向量搜索内容、推断和 RAG。</li>
<li><a href="https://milvus.io/office-hours">预约 20 分钟的免费 Milvus Office Hours 会议</a>，与团队一起讨论您的使用案例。</li>
<li>如果您想跳过基础架构设置，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>（Milvus 托管）有一个免费层级--只需更改一个 URI，您就可以投入生产。</li>
</ul>
<hr>
<p>营销团队开始探索 GEO 时会遇到的几个问题：</p>
<p><strong>我的搜索引擎优化流量正在下降。</strong>GEO<strong>是否可以取代</strong>SEO<strong>？</strong>GEO 并没有取代 SEO，而是将其扩展到了一个新的渠道。传统的搜索引擎优化仍然是通过用户点击页面来获取流量。GEO 针对的是用户在不访问网站的情况下直接从人工智能（Perplexity、ChatGPT Search、Google AI Overview）获得答案的日益增长的查询份额。如果您在分析中看到零点击率攀升，这就是 GEO 旨在夺回的流量--不是通过点击，而是通过人工智能生成的答案中的品牌引用。</p>
<p><strong>GEO 内容与普通人工智能生成的内容有何不同？</strong>大多数人工智能生成的内容都是泛泛而谈--LLM 从训练数据中提取并生成听起来合理的内容，但并不基于品牌的实际事实、主张或数据。而 GEO 内容则以经过验证的源材料知识库为基础，采用 RAG（检索增强生成）技术。不同之处体现在产出上：具体的产品细节而不是模糊的概括，真实的数字而不是捏造的统计数字，以及数十篇文章中一致的品牌声音。</p>
<p><strong>我需要多少篇文章才能让 GEO 起作用？</strong>没有一个神奇的数字，但逻辑是简单明了的：人工智能模型从多个来源合成每个答案。您的优质内容覆盖的长尾查询越多，您的品牌出现的频率就越高。从围绕核心主题撰写 20-30 篇文章开始，衡量哪些文章被引用（检查您的人工智能提及率和推荐流量），然后再扩大规模。</p>
<p><strong>人工智能搜索引擎不会惩罚大量生成的内容吗？</strong>如果是低质量内容，它们会的。人工智能搜索引擎越来越善于检测无来源的声明、重复使用的措辞以及不增加原创价值的内容。这正是该管道包括一个知识库作为基础和一个自我评分步骤作为质量控制的原因。我们的目标不是生成更多内容，而是生成对人工智能模型真正有用的内容。</p>
