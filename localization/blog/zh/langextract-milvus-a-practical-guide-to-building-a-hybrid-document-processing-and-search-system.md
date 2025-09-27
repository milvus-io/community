---
id: >-
  langextract-milvus-a-practical-guide-to-building-a-hybrid-document-processing-and-search-system.md
title: LangExtract + Milvus：构建混合文档处理和搜索系统实用指南
author: 'Cheney Zhang, Lumina Wang'
date: 2025-08-28T00:00:00.000Z
desc: 了解如何结合 LangExtract 和 Milvus 进行混合代码搜索--在一个智能管道中实现精确过滤和语义检索。
cover: assets.zilliz.com/Langextract_1c4d9835a4.png
tag: Tutorials
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'LangExtract, Milvus, hybrid search, code search, semantic retrieval'
meta_title: |
  Hybrid Document Retrieval System with LangExtract + Milvus
origin: >-
  https://milvus.io/blog/langextract-milvus-a-practical-guide-to-building-a-hybrid-document-processing-and-search-system.md
---
<p>在<a href="https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md">上</a>一篇<a href="https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md">博客</a>中，我们比较了许多编码 Agents 中两种流行的代码搜索方法：</p>
<ul>
<li><p><strong>向量搜索驱动的 RAG（语义检索）</strong>--由 Cursor 等工具使用</p></li>
<li><p><strong>带有</strong> <code translate="no">grep</code> <strong> （字面字符串匹配）</strong><strong>的关键字搜索</strong>--由 Claude Code 和 Gemini 使用。</p></li>
</ul>
<p>这篇帖子引发了很多反馈。一些开发者支持 RAG，指出<code translate="no">grep</code> 经常包含不相关的匹配，并使上下文变得臃肿。其他一些人则为关键词搜索辩护，认为精确度就是一切，而 Embeddings 还太模糊，不可信。</p>
<p>双方都有道理。现实情况是，没有完美的、放之四海而皆准的解决方案。</p>
<ul>
<li><p>如果只依赖 Embeddings，就会错过严格的规则或精确匹配。</p></li>
<li><p>只依赖关键字，则会失去对代码（或文本）实际含义的语义理解。</p></li>
</ul>
<p>本教程演示了一种<strong>将两种方法智能结合的方法</strong>。我们将向您展示如何使用<a href="https://github.com/google/langextract">LangExtract（一个</a>使用 LLMs 将杂乱文本转化为具有精确来源归属的结构化数据的 Python 库）和<a href="https://milvus.io/">Milvus</a>（一个开源的高性能向量数据库）来构建一个更智能、更高质量的文档处理和检索系统。</p>
<h3 id="Key-Technologies-We’ll-Use" class="common-anchor-header">我们将使用的关键技术</h3><p>在开始构建这个文档处理和检索系统之前，让我们先来看看本教程中要用到的关键技术。</p>
<h3 id="What-is-LangExtract" class="common-anchor-header">什么是 LangExtract？</h3><p><a href="https://github.com/langextract/langextract">LangExtract</a>是一个新的 Python 库，由 Google 开源，利用 LLMs 将杂乱的非结构化文本转换为结构化数据，并注明来源。它已经很受欢迎（GitHub 星级超过 13K），因为它让信息提取等任务变得非常简单。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c04bdf275b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
主要功能包括</p>
<ul>
<li><p>结构化提取：定义 Schema 并提取姓名、日期、地点、费用和其他相关信息。</p></li>
<li><p>来源可追溯性：提取的每个字段都会链接到原始文本，从而降低出现幻觉的可能性。</p></li>
<li><p>可扩展至长文档：通过分块+多线程处理数百万字符。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6a4b42a265.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangExtract 在法律、医疗保健和取证等领域尤其有用，因为这些领域对精确度要求极高。例如，LangExtract 可以只提取您所关心的日期、条款或患者人口统计数据，同时还能保留语义上下文，而不是用 RAG 来检索大量文本。</p>
<h3 id="What’s-Milvus" class="common-anchor-header">Milvus 是什么？</h3><p><a href="https://milvus.io/">Milvus</a>是一个开源向量数据库，在 Github 上有超过 36K+stars 的用户，已被各行各业的 10K 多家企业采用。Milvus 广泛应用于 RAG 系统、人工智能 Agents、推荐引擎、异常检测和语义搜索，是人工智能驱动应用的核心构件。</p>
<h2 id="Building-a-High-Quality-Document-Processing-System-with-LangExtract-+-Milvus" class="common-anchor-header">使用 LangExtract + Milvus 构建高质量文档处理系统<button data-href="#Building-a-High-Quality-Document-Processing-System-with-LangExtract-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>本指南将引导您了解如何结合<a href="https://github.com/google/langextract">LangExtract</a>和<a href="https://milvus.io/"> Milvus</a>来构建智能文档处理和检索系统。</p>
<ul>
<li><p>LangExtract 生成简洁、结构化的元数据，然后通过 Milvus 有效地存储和搜索这些元数据，从而为我们提供两全其美的解决方案：精确过滤和语义检索。</p></li>
<li><p>Milvus 将作为检索骨干，同时存储嵌入（用于语义搜索）和 LangExtract 提取的结构化元数据，使我们能够大规模运行精确和智能的混合查询。</p></li>
</ul>
<h3 id="Prerequisites" class="common-anchor-header">先决条件</h3><p>在开始使用之前，请确保您已经安装了以下依赖项：</p>
<pre><code translate="no">! pip install --upgrade pymilvus langextract google-genai requests tqdm pandas
<button class="copy-code-btn"></button></code></pre>
<p>在本示例中，我们将使用 Gemini 作为 LLM。您需要将<a href="https://aistudio.google.com/app/apikey"> API 密钥</a>设置为环境变量：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;AIza*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-LangExtract-+-Milvus-Pipeline" class="common-anchor-header"><strong>设置 LangExtract + Milvus 管道</strong></h3><p>让我们从定义管道开始，使用 LangExtract 进行结构化信息提取，并使用 Milvus 作为向量存储。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> langextract <span class="hljs-keyword">as</span> lx
<span class="hljs-keyword">import</span> textwrap
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.<span class="hljs-property">genai</span>.<span class="hljs-property">types</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">EmbedContentConfig</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>
<span class="hljs-keyword">import</span> uuid
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configuration-and-Setup" class="common-anchor-header"><strong>配置和设置</strong></h3><p>现在，我们将配置集成的全局参数。我们将使用 Gemini 的 Embeddings 模型为文档生成向量表示。</p>
<pre><code translate="no">genai_client = genai.Client()
COLLECTION_NAME = <span class="hljs-string">&quot;document_extractions&quot;</span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;gemini-embedding-001&quot;</span>
EMBEDDING_DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># Default dimension for gemini-embedding-001</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Initializing-the-Milvus-Client" class="common-anchor-header"><strong>初始化 Milvus 客户端</strong></h3><p>让我们初始化 Milvus 客户端。为简单起见，我们将使用本地数据库文件，不过这种方法很容易扩展到完整的 Milvus 服务器部署。</p>
<pre><code translate="no">client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>关于<code translate="no">MilvusClient</code> 参数：</strong></p>
<p>将<code translate="no">uri</code> 设置为本地文件（如<code translate="no">./milvus.db</code> ）是最方便的方法，因为它会自动使用<a href="https://milvus.io/docs/milvus_lite.md"> Milvus Lite</a>将所有数据存储在此文件中。</p>
<p>对于大规模数据，可以在<a href="https://milvus.io/docs/quickstart.md"> Docker 或 Kubernetes</a> 上设置性能更强的 Milvus 服务器。在这种设置中，请使用服务器 uri（如[<code translate="no">http://localhost:19530](http://localhost:19530)</code> ）。</p>
<p>如果你更喜欢<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>（Milvus 的全托管云服务），请调整<code translate="no">uri</code> 和<code translate="no">token</code> ，以匹配你的<a href="https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details"> 公共端点和</a>Zilliz Cloud 的<a href="https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details"> API 密钥</a>。</p>
<h3 id="Preparing-Sample-Data" class="common-anchor-header"><strong>准备样本数据</strong></h3><p>在本演示中，我们将使用电影描述作为样本文档。这将展示 LangExtract 如何从非结构化文本中提取流派、角色和主题等结构化信息。</p>
<pre><code translate="no">sample_documents = [
    <span class="hljs-string">&quot;John McClane fights terrorists in a Los Angeles skyscraper during Christmas Eve. The action-packed thriller features intense gunfights and explosive scenes.&quot;</span>,
    <span class="hljs-string">&quot;A young wizard named Harry Potter discovers his magical abilities at Hogwarts School. The fantasy adventure includes magical creatures and epic battles.&quot;</span>,
    <span class="hljs-string">&quot;Tony Stark builds an advanced suit of armor to become Iron Man. The superhero movie showcases cutting-edge technology and spectacular action sequences.&quot;</span>,
    <span class="hljs-string">&quot;A group of friends get lost in a haunted forest where supernatural creatures lurk. The horror film creates a terrifying atmosphere with jump scares.&quot;</span>,
    <span class="hljs-string">&quot;Two detectives investigate a series of mysterious murders in New York City. The crime thriller features suspenseful plot twists and dramatic confrontations.&quot;</span>,
    <span class="hljs-string">&quot;A brilliant scientist creates artificial intelligence that becomes self-aware. The sci-fi thriller explores the dangers of advanced technology and human survival.&quot;</span>,
    <span class="hljs-string">&quot;A romantic comedy about two friends who fall in love during a cross-country road trip. The drama explores personal growth and relationship dynamics.&quot;</span>,
    <span class="hljs-string">&quot;An evil sorcerer threatens to destroy the magical kingdom. A brave hero must gather allies and master ancient magic to save the fantasy world.&quot;</span>,
    <span class="hljs-string">&quot;Space marines battle alien invaders on a distant planet. The action sci-fi movie features futuristic weapons and intense combat in space.&quot;</span>,
    <span class="hljs-string">&quot;A detective investigates supernatural crimes in Victorian London. The horror thriller combines period drama with paranormal investigation themes.&quot;</span>,
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== LangExtract + Milvus Integration Demo ===&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Preparing to process <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_documents)}</span> documents&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Milvus-Collection" class="common-anchor-header"><strong>设置 Milvus Collections</strong></h3><p>在存储提取的数据之前，我们需要创建一个具有相应 Schema 的 Milvus Collections。该 Collections 将存储原始文档文本、向量嵌入和提取的元数据字段。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Setting up Milvus collection...&quot;</span>)

<span class="hljs-comment"># Drop existing collection if it exists</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Create collection schema</span>
schema = client.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
    description=<span class="hljs-string">&quot;Document extraction results and vector storage&quot;</span>,
)

<span class="hljs-comment"># Add fields - simplified to 3 main metadata fields</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;document_text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">10000</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(collection_name=COLLECTION_NAME, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully&quot;</span>)

<span class="hljs-comment"># Create vector index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
client.create_index(collection_name=COLLECTION_NAME, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Vector index created successfully&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Defining-the-Extraction-Schema" class="common-anchor-header"><strong>定义提取模式 Schema</strong></h3><p>LangExtract 使用提示和示例来引导 LLM 提取结构化信息。让我们来定义电影描述的提取 Schema，明确指出要提取哪些信息以及如何对其进行分类。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Extracting tags from documents...&quot;</span>)

<span class="hljs-comment"># Define extraction prompt - for movie descriptions, specify attribute value ranges</span>
prompt = textwrap.dedent(
    <span class="hljs-string">&quot;&quot;</span><span class="hljs-string">&quot;\
    Extract movie genre, main characters, and key themes from movie descriptions.
    Use exact text for extractions. Do not paraphrase or overlap entities.
    
    For each extraction, provide attributes with values from these predefined sets:
    
    Genre attributes:
    - primary_genre: [&quot;</span>action<span class="hljs-string">&quot;, &quot;</span>comedy<span class="hljs-string">&quot;, &quot;</span>drama<span class="hljs-string">&quot;, &quot;</span>horror<span class="hljs-string">&quot;, &quot;</span>sci-fi<span class="hljs-string">&quot;, &quot;</span>fantasy<span class="hljs-string">&quot;, &quot;</span>thriller<span class="hljs-string">&quot;, &quot;</span>crime<span class="hljs-string">&quot;, &quot;</span>superhero<span class="hljs-string">&quot;]
    - secondary_genre: [&quot;</span>action<span class="hljs-string">&quot;, &quot;</span>comedy<span class="hljs-string">&quot;, &quot;</span>drama<span class="hljs-string">&quot;, &quot;</span>horror<span class="hljs-string">&quot;, &quot;</span>sci-fi<span class="hljs-string">&quot;, &quot;</span>fantasy<span class="hljs-string">&quot;, &quot;</span>thriller<span class="hljs-string">&quot;, &quot;</span>crime<span class="hljs-string">&quot;, &quot;</span>superhero<span class="hljs-string">&quot;]
    
    Character attributes:
    - role: [&quot;</span>protagonist<span class="hljs-string">&quot;, &quot;</span>antagonist<span class="hljs-string">&quot;, &quot;</span>supporting<span class="hljs-string">&quot;]
    - type: [&quot;</span>hero<span class="hljs-string">&quot;, &quot;</span>villain<span class="hljs-string">&quot;, &quot;</span>detective<span class="hljs-string">&quot;, &quot;</span>military<span class="hljs-string">&quot;, &quot;</span>wizard<span class="hljs-string">&quot;, &quot;</span>scientist<span class="hljs-string">&quot;, &quot;</span>friends<span class="hljs-string">&quot;, &quot;</span>investigator<span class="hljs-string">&quot;]
    
    Theme attributes:
    - theme_type: [&quot;</span>conflict<span class="hljs-string">&quot;, &quot;</span>investigation<span class="hljs-string">&quot;, &quot;</span>personal_growth<span class="hljs-string">&quot;, &quot;</span>technology<span class="hljs-string">&quot;, &quot;</span>magic<span class="hljs-string">&quot;, &quot;</span>survival<span class="hljs-string">&quot;, &quot;</span>romance<span class="hljs-string">&quot;]
    - setting: [&quot;</span>urban<span class="hljs-string">&quot;, &quot;</span>space<span class="hljs-string">&quot;, &quot;</span>fantasy_world<span class="hljs-string">&quot;, &quot;</span>school<span class="hljs-string">&quot;, &quot;</span>forest<span class="hljs-string">&quot;, &quot;</span>victorian<span class="hljs-string">&quot;, &quot;</span>america<span class="hljs-string">&quot;, &quot;</span>future<span class="hljs-string">&quot;]
    
    Focus on identifying key elements that would be useful for movie search and filtering.&quot;</span><span class="hljs-string">&quot;&quot;</span>
)

<button class="copy-code-btn"></button></code></pre>
<h3 id="Providing-Examples-to-Improve-Extraction-Quality" class="common-anchor-header"><strong>提供示例以提高提取质量</strong></h3><p>为了提高提取质量和一致性，我们将为 LangExtract 提供精心制作的示例。这些示例展示了预期的格式，并帮助模型理解我们特定的提取要求。</p>
<pre><code translate="no"><span class="hljs-comment"># Provide examples to guide the model - n-shot examples for movie descriptions</span>
<span class="hljs-comment"># Unify attribute keys to ensure consistency in extraction results</span>
examples = [
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;A space marine battles alien creatures on a distant planet. The sci-fi action movie features futuristic weapons and intense combat scenes.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;sci-fi action&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;sci-fi&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;action&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;space marine&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;military&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;battles alien creatures&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;conflict&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;space&quot;</span>},
            ),
        ],
    ),
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;A detective investigates supernatural murders in Victorian London. The horror thriller film combines period drama with paranormal elements.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;horror thriller&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;horror&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;thriller&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;detective&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;detective&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;supernatural murders&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;investigation&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;victorian&quot;</span>},
            ),
        ],
    ),
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;Two friends embark on a road trip adventure across America. The comedy drama explores friendship and self-discovery through humorous situations.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;comedy drama&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;comedy&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;drama&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;two friends&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;friends&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;friendship and self-discovery&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;personal_growth&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;america&quot;</span>},
            ),
        ],
    ),
]

<span class="hljs-comment"># Extract from each document</span>
extraction_results = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> sample_documents:
    result = lx.extract(
        text_or_documents=doc,
        prompt_description=prompt,
        examples=examples,
        model_id=<span class="hljs-string">&quot;gemini-2.0-flash&quot;</span>,
    )
    extraction_results.append(result)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully extracted from document: <span class="hljs-subst">{doc[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Completed tag extraction, processed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(extraction_results)}</span> documents&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-title class_">Successfully</span> extracted <span class="hljs-keyword">from</span> <span class="hljs-attr">document</span>: <span class="hljs-title class_">John</span> <span class="hljs-title class_">McClane</span> fights terrorists <span class="hljs-keyword">in</span> a <span class="hljs-title class_">Los</span> <span class="hljs-title class_">Angeles</span>...
...
<span class="hljs-title class_">Completed</span> tag extraction, processed <span class="hljs-number">10</span> documents
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_7f539fec12.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Processing-and-Vectorizing-Results" class="common-anchor-header"><strong>处理和向量化结果</strong></h3><p>现在，我们需要处理提取结果，并为每个文档生成向量嵌入。我们还将把提取的属性平铺到单独的字段中，以便在 Milvus 中轻松搜索。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n3. Processing extraction results and generating vectors...&quot;</span>)

processed_data = []

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> extraction_results:
    <span class="hljs-comment"># Generate vectors for documents</span>
    embedding_response = genai_client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=[result.text],
        config=EmbedContentConfig(
            task_type=<span class="hljs-string">&quot;RETRIEVAL_DOCUMENT&quot;</span>,
            output_dimensionality=EMBEDDING_DIM,
        ),
    )
    embedding = embedding_response.embeddings[<span class="hljs-number">0</span>].values
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated vector: <span class="hljs-subst">{result.text[:<span class="hljs-number">30</span>]}</span>...&quot;</span>)

    <span class="hljs-comment"># Initialize data structure, flatten attributes into separate fields</span>
    data_entry = {
        <span class="hljs-string">&quot;id&quot;</span>: result.document_id <span class="hljs-keyword">or</span> <span class="hljs-built_in">str</span>(uuid.uuid4()),
        <span class="hljs-string">&quot;document_text&quot;</span>: result.text,
        <span class="hljs-string">&quot;embedding&quot;</span>: embedding,
        <span class="hljs-comment"># Initialize all possible fields with default values</span>
        <span class="hljs-string">&quot;genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;character_role&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;character_type&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;theme_setting&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
    }

    <span class="hljs-comment"># Process extraction results, flatten attributes</span>
    <span class="hljs-keyword">for</span> extraction <span class="hljs-keyword">in</span> result.extractions:
        <span class="hljs-keyword">if</span> extraction.extraction_class == <span class="hljs-string">&quot;genre&quot;</span>:
            <span class="hljs-comment"># Flatten genre attributes</span>
            data_entry[<span class="hljs-string">&quot;genre&quot;</span>] = extraction.extraction_text
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            data_entry[<span class="hljs-string">&quot;primary_genre&quot;</span>] = attrs.get(<span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
            data_entry[<span class="hljs-string">&quot;secondary_genre&quot;</span>] = attrs.get(<span class="hljs-string">&quot;secondary_genre&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

        <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;character&quot;</span>:
            <span class="hljs-comment"># Flatten character attributes (take first main character&#x27;s attributes)</span>
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            <span class="hljs-keyword">if</span> (
                data_entry[<span class="hljs-string">&quot;character_role&quot;</span>] == <span class="hljs-string">&quot;unknown&quot;</span>
            ):  <span class="hljs-comment"># Only take first character&#x27;s attributes</span>
                data_entry[<span class="hljs-string">&quot;character_role&quot;</span>] = attrs.get(<span class="hljs-string">&quot;role&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
                data_entry[<span class="hljs-string">&quot;character_type&quot;</span>] = attrs.get(<span class="hljs-string">&quot;type&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

        <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;theme&quot;</span>:
            <span class="hljs-comment"># Flatten theme attributes (take first main theme&#x27;s attributes)</span>
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            <span class="hljs-keyword">if</span> (
                data_entry[<span class="hljs-string">&quot;theme_type&quot;</span>] == <span class="hljs-string">&quot;unknown&quot;</span>
            ):  <span class="hljs-comment"># Only take first theme&#x27;s attributes</span>
                data_entry[<span class="hljs-string">&quot;theme_type&quot;</span>] = attrs.get(<span class="hljs-string">&quot;theme_type&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
                data_entry[<span class="hljs-string">&quot;theme_setting&quot;</span>] = attrs.get(<span class="hljs-string">&quot;setting&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

    processed_data.append(data_entry)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Completed data processing, ready to insert <span class="hljs-subst">{<span class="hljs-built_in">len</span>(processed_data)}</span> records&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">3. Processing extraction results and generating vectors...
Successfully generated vector: John McClane fights terrorists...
...
Completed data processing, ready to insert 10 records

<button class="copy-code-btn"></button></code></pre>
<h3 id="Inserting-Data-into-Milvus" class="common-anchor-header"><strong>将数据插入 Milvus</strong></h3><p>处理好数据后，让我们将其插入 Milvus Collections。这样，我们就能进行语义搜索和精确的元数据过滤。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n4. Inserting data into Milvus...&quot;</span>)

<span class="hljs-keyword">if</span> processed_data:
    res = client.insert(collection_name=COLLECTION_NAME, data=processed_data)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(processed_data)}</span> documents into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Insert result: <span class="hljs-subst">{res}</span>&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-number">4.</span> Inserting data <span class="hljs-keyword">into</span> Milvus...
Successfully inserted <span class="hljs-number">10</span> documents <span class="hljs-keyword">into</span> Milvus
Insert result: {<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-string">&#x27;doc_f8797155&#x27;</span>, <span class="hljs-string">&#x27;doc_78c7e586&#x27;</span>, <span class="hljs-string">&#x27;doc_fa3a3ab5&#x27;</span>, <span class="hljs-string">&#x27;doc_64981815&#x27;</span>, <span class="hljs-string">&#x27;doc_3ab18cb2&#x27;</span>, <span class="hljs-string">&#x27;doc_1ea42b18&#x27;</span>, <span class="hljs-string">&#x27;doc_f0779243&#x27;</span>, <span class="hljs-string">&#x27;doc_386590b7&#x27;</span>, <span class="hljs-string">&#x27;doc_3b3ae1ab&#x27;</span>, <span class="hljs-string">&#x27;doc_851089d6&#x27;</span>]}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Demonstrating-Metadata-Filtering" class="common-anchor-header"><strong>元数据过滤演示</strong></h3><p>将 LangExtract 与 Milvus 结合使用的主要优势之一，就是能够根据提取的元数据执行精确过滤。让我们通过一些过滤表达式搜索来看看它的实际效果。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Filter Expression Search Examples ===&quot;</span>)

<span class="hljs-comment"># Load collection into memory for querying</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Loading collection into memory...&quot;</span>)
client.load_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection loaded successfully&quot;</span>)

<span class="hljs-comment"># Search for thriller movies</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Searching for thriller movies:&quot;</span>)
results = client.query(
    collection_name=COLLECTION_NAME,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;secondary_genre == &quot;thriller&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>],
    limit=<span class="hljs-number">5</span>,
)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;genre&#x27;</span>]}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>-<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;secondary_genre&#x27;</span>)}</span>)&quot;</span>
    )

<span class="hljs-comment"># Search for movies with military characters</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Searching for movies with military characters:&quot;</span>)
results = client.query(
    collection_name=COLLECTION_NAME,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;character_type == &quot;military&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;character_role&quot;</span>, <span class="hljs-string">&quot;character_type&quot;</span>],
    limit=<span class="hljs-number">5</span>,
)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;genre&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;  Character: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;character_role&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;character_type&#x27;</span>)}</span>)&quot;</span>
    )
=== Filter Expression Search Examples ===
Loading collection into memory...
Collection loaded successfully

<span class="hljs-number">1.</span> Searching <span class="hljs-keyword">for</span> thriller movies:
- A brilliant scientist creates artificial intelligence that becomes <span class="hljs-variable language_">self</span>-aware. The sci-fi thriller e...
  Genre: sci-fi thriller (sci-fi-thriller)
- Two detectives investigate a series of mysterious murders <span class="hljs-keyword">in</span> New York City. The crime thriller featu...
  Genre: crime thriller (crime-thriller)
- A detective investigates supernatural crimes <span class="hljs-keyword">in</span> Victorian London. The horror thriller combines perio...
  Genre: horror thriller (horror-thriller)
- John McClane fights terrorists <span class="hljs-keyword">in</span> a Los Angeles skyscraper during Christmas Eve. The action-packed t...
  Genre: action-packed thriller (action-thriller)

<span class="hljs-number">2.</span> Searching <span class="hljs-keyword">for</span> movies <span class="hljs-keyword">with</span> military characters:
- Space marines battle alien invaders on a distant planet. The action sci-fi movie features futuristic...
  Genre: action sci-fi
  Character: protagonist (military)
<button class="copy-code-btn"></button></code></pre>
<p>完美！我们的搜索结果准确地匹配了 "惊悚片 "和 "军事字符 "这两个过滤条件。</p>
<h3 id="Combining-Semantic-Search-with-Metadata-Filtering" class="common-anchor-header"><strong>将语义搜索与元数据过滤相结合</strong></h3><p>这就是这种集成的真正威力所在：将语义向量搜索与精确的元数据过滤相结合。这使我们能够找到语义相似的内容，同时根据提取的属性应用特定的限制条件。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Semantic Search Examples ===&quot;</span>)

<span class="hljs-comment"># 1. Search for action-related content + only thriller genre</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Searching for action-related content + only thriller genre:&quot;</span>)
query_text = <span class="hljs-string">&quot;action fight combat battle explosion&quot;</span>

query_embedding_response = genai_client.models.embed_content(
    model=EMBEDDING_MODEL,
    contents=[query_text],
    config=EmbedContentConfig(
        task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
        output_dimensionality=EMBEDDING_DIM,
    ),
)
query_embedding = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values

results = client.search(
    collection_name=COLLECTION_NAME,
    data=[query_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    limit=<span class="hljs-number">3</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;secondary_genre == &quot;thriller&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
)

<span class="hljs-keyword">if</span> results:
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- Similarity: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Text: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
        <span class="hljs-built_in">print</span>(
            <span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;genre&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>-<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;secondary_genre&#x27;</span>)}</span>)&quot;</span>
        )

<span class="hljs-comment"># 2. Search for magic-related content + fantasy genre + conflict theme</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Searching for magic-related content + fantasy genre + conflict theme:&quot;</span>)
query_text = <span class="hljs-string">&quot;magic wizard spell fantasy magical&quot;</span>

query_embedding_response = genai_client.models.embed_content(
    model=EMBEDDING_MODEL,
    contents=[query_text],
    config=EmbedContentConfig(
        task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
        output_dimensionality=EMBEDDING_DIM,
    ),
)
query_embedding = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values

results = client.search(
    collection_name=COLLECTION_NAME,
    data=[query_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    limit=<span class="hljs-number">3</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;primary_genre == &quot;fantasy&quot; and theme_type == &quot;conflict&quot;&#x27;</span>,
    output_fields=[
        <span class="hljs-string">&quot;document_text&quot;</span>,
        <span class="hljs-string">&quot;genre&quot;</span>,
        <span class="hljs-string">&quot;primary_genre&quot;</span>,
        <span class="hljs-string">&quot;theme_type&quot;</span>,
        <span class="hljs-string">&quot;theme_setting&quot;</span>,
    ],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
)

<span class="hljs-keyword">if</span> results:
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- Similarity: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Text: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;genre&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>)&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Theme: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;theme_type&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;theme_setting&#x27;</span>)}</span>)&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Demo Complete ===&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">=== Semantic Search Examples ===

<span class="hljs-number">1.</span> Searching <span class="hljs-keyword">for</span> action-related content + only thriller genre:
- Similarity: <span class="hljs-number">0.6947</span>
  Text: John McClane fights terrorists in a Los Angeles skyscraper during Christmas Eve. The action-packed t...
  Genre: action-packed <span class="hljs-title function_">thriller</span> <span class="hljs-params">(action-thriller)</span>
- Similarity: <span class="hljs-number">0.6128</span>
  Text: Two detectives investigate a series of mysterious murders in New York City. The crime thriller featu...
  Genre: crime <span class="hljs-title function_">thriller</span> <span class="hljs-params">(crime-thriller)</span>
- Similarity: <span class="hljs-number">0.5889</span>
  Text: A brilliant scientist creates artificial intelligence that becomes self-aware. The sci-fi thriller e...
  Genre: sci-fi <span class="hljs-title function_">thriller</span> <span class="hljs-params">(sci-fi-thriller)</span>

<span class="hljs-number">2.</span> Searching <span class="hljs-keyword">for</span> magic-related content + fantasy genre + conflict theme:
- Similarity: <span class="hljs-number">0.6986</span>
  Text: An evil sorcerer threatens to destroy the magical kingdom. A brave hero must gather allies and maste...
  Genre: fantasy (fantasy)
  Theme: conflict (fantasy_world)

=== Demo Complete ===
<button class="copy-code-btn"></button></code></pre>
<p>正如您所看到的，我们使用 Milvus 的语义搜索结果既符合流派过滤条件，又显示出与我们的查询文本内容高度相关。</p>
<h2 id="What-Youve-Built-and-What-It-Means" class="common-anchor-header">您构建的系统及其意义<button data-href="#What-Youve-Built-and-What-It-Means" class="anchor-icon" translate="no">
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
    </button></h2><p>您现在拥有了一个将结构化提取与语义搜索相结合的混合文档处理系统，不再需要在准确性和灵活性之间做出选择。这种方法可以最大限度地提高非结构化数据的价值，同时确保可靠性，非常适合金融、医疗保健和法律领域的高风险场景。</p>
<p>同样的原则也适用于各行各业：将结构化图像分析与语义搜索相结合，可获得更好的电子商务推荐，或将其应用于视频内容，以增强自动驾驶数据挖掘。</p>
<p>对于管理大规模多模态数据集的大规模部署，我们即将推出的<strong>向量数据湖将</strong>提供更具成本效益的冷存储、宽表支持和简化的 ETL 处理--这是生产规模混合搜索系统的自然演进。敬请期待。</p>
<p>有问题或想分享您的成果？加入<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>上的对话，或在<a href="https://discord.com/invite/FG6hMJStWu">Discord</a> 上与我们的社区联系。</p>
