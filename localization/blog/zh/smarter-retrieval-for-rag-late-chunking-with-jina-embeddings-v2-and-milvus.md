---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: 更智能的 RAG 检索：使用 Jina Embeddings v2 和 Milvus 进行后期分块检索
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: 利用 Late Chunking 和 Milvus 提高 RAG 的准确性，从而实现高效的上下文感知文档嵌入以及更快、更智能的向量搜索。
cover: >-
  assets.zilliz.com/Milvus_Meets_Late_Chunking_Smarter_Retrieval_for_RAG_4f9640fffd.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: true
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>建立一个强大的 RAG 系统通常从<strong>文档</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>分块</strong></a>开始<a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>--将</strong></a>大文本<a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>分割</strong></a>成易于管理的片段，以便嵌入和检索。常见的策略包括</p>
<ul>
<li><p><strong>固定大小的分块</strong>（如每 512 个标记）</p></li>
<li><p><strong>可变大小的块</strong>（如段落或句子边界）</p></li>
<li><p><strong>滑动窗口</strong>（重叠跨度）</p></li>
<li><p><strong>递归分块</strong>（分层分割）</p></li>
<li><p><strong>语义分块</strong>（按主题分组）</p></li>
</ul>
<p>虽然这些方法各有优点，但它们往往会破坏远距离语境。为了应对这一挑战，Jina AI 创造了一种晚期分块方法：先嵌入整个文档，然后再分割出分块。</p>
<p>在本文中，我们将探讨晚期分块法的工作原理，并演示如何将其与<a href="https://milvus.io/">Milvus（</a>为相似性搜索而构建的高性能开源向量数据库）相结合，从而显著改善 RAG 管道。无论您是在构建企业知识库、人工智能驱动的客户支持，还是在构建高级搜索应用，本教程都将向您展示如何更有效地大规模管理嵌入式数据。</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">什么是后期分块？<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>当关键信息跨越多个分块时，传统的分块方法可能会破坏重要的联系，从而导致检索性能低下。</p>
<p>请看这些 Milvus 2.4.13 的发布说明，它们被分成了如下两块：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 1.Milvus 2.4.13 发布说明分块</em></p>
<p>如果查询 "Milvus 2.4.13 有哪些新功能？"，标准的 Embeddings 模型可能无法将 "Milvus 2.4.13"（位于 Chunk 1）与其功能（位于 Chunk 2）联系起来。结果是什么？向量较弱，检索准确率较低。</p>
<p>启发式的解决方法--如滑动窗口、重叠上下文和重复扫描--提供了部分缓解，但无法保证。</p>
<p><strong>传统的分块法</strong>遵循这一流程：</p>
<ol>
<li><p>对文本进行<strong>预分块</strong>（按句子、段落或最大标记长度）。</p></li>
<li><p>分别<strong>嵌入</strong>每个分块。</p></li>
<li><p><strong>将</strong>标记嵌入<strong>聚合</strong>（例如通过平均池化）为单一的分块向量。</p></li>
</ol>
<p><strong>后期分块</strong>翻转管道：</p>
<ol>
<li><p><strong>先嵌入</strong>：在整个文档上运行长语境转换器，生成能捕捉全局语境的丰富标记嵌入。</p></li>
<li><p><strong>后分块</strong>：平均池化这些标记嵌入的连续跨度，形成最终的分块向量。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>图 2.原始分块与后期分块（</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>资料来源）</em></a></p>
<p>通过在每个分块中保留完整的文档上下文，后期分块技术可以获得以下优势</p>
<ul>
<li><p><strong>更高的检索准确率--每个</strong>分块都能感知上下文。</p></li>
<li><p><strong>更少的分块--您可以</strong>向 LLM 发送更集中的文本，从而降低成本和延迟。</p></li>
</ul>
<p>许多长上下文模型（如 jina-embeddings-v2-base-en 模型）最多可处理 8,192 个标记--相当于大约 20 分钟的阅读量（约 5,000 个单词）--这使得晚分块技术适用于大多数实际文档。</p>
<p>既然我们已经了解了晚期分块背后的 "是什么 "和 "为什么"，那么让我们来深入探讨 "怎么做"。在接下来的章节中，我们将引导大家亲身实践晚期分块技术，将其性能与传统的分块技术进行比较，并使用 Milvus 验证其对现实世界的影响。这个实践演练将在理论和实践之间架起一座桥梁，准确展示如何将后期分块技术整合到 RAG 工作流程中。</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">测试后期分块<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">基本实现</h3><p>以下是后期分块的核心功能。我们添加了清晰的文档说明，指导你完成每个步骤。函数<code translate="no">sentence_chunker</code> 将原始文档分割成基于段落的分块，同时返回分块内容和分块注释信息<code translate="no">span_annotations</code> （即每个分块的开始和结束索引）。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">sentence_chunker</span>(<span class="hljs-params">document, batch_size=<span class="hljs-number">10000</span></span>):
    nlp = spacy.blank(<span class="hljs-string">&quot;en&quot;</span>)
    nlp.add_pipe(<span class="hljs-string">&quot;sentencizer&quot;</span>, config={<span class="hljs-string">&quot;punct_chars&quot;</span>: <span class="hljs-literal">None</span>})
    doc = nlp(document)

    docs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(document), batch_size):
        batch = document[i : i + batch_size]
        docs.append(nlp(batch))

    doc = Doc.from_docs(docs)

    span_annotations = []
    chunks = []
    <span class="hljs-keyword">for</span> i, sent <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc.sents):
        span_annotations.append((sent.start, sent.end))
        chunks.append(sent.text)

    <span class="hljs-keyword">return</span> chunks, span_annotations
<button class="copy-code-btn"></button></code></pre>
<p>函数<code translate="no">document_to_token_embeddings</code> 使用 jinaai/jina-embeddings-v2-base-en 模型及其标记符生成整个文档的 Embeddings。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">document_to_token_embeddings</span>(<span class="hljs-params">model, tokenizer, document, batch_size=<span class="hljs-number">4096</span></span>):
    tokenized_document = tokenizer(document, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
    tokens = tokenized_document.tokens()

    outputs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(tokens), batch_size):
        
        start = i
        end   = <span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(tokens))

        batch_inputs = {k: v[:, start:end] <span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> tokenized_document.items()}

        <span class="hljs-keyword">with</span> torch.no_grad():
            model_output = model(**batch_inputs)

        outputs.append(model_output.last_hidden_state)

    model_output = torch.cat(outputs, dim=<span class="hljs-number">1</span>)
    <span class="hljs-keyword">return</span> model_output
<button class="copy-code-btn"></button></code></pre>
<p>函数<code translate="no">late_chunking</code> 接收文档的标记嵌入和原始的分块注释信息<code translate="no">span_annotations</code> ，然后生成最终的分块嵌入。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking</span>(<span class="hljs-params">token_embeddings, span_annotation, max_length=<span class="hljs-literal">None</span></span>):
    outputs = []
    <span class="hljs-keyword">for</span> embeddings, annotations <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(token_embeddings, span_annotation):
        <span class="hljs-keyword">if</span> (
            max_length <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>
        ):
            annotations = [
                (start, <span class="hljs-built_in">min</span>(end, max_length - <span class="hljs-number">1</span>))
                <span class="hljs-keyword">for</span> (start, end) <span class="hljs-keyword">in</span> annotations
                <span class="hljs-keyword">if</span> start &lt; (max_length - <span class="hljs-number">1</span>)
            ]
        pooled_embeddings = []
        <span class="hljs-keyword">for</span> start, end <span class="hljs-keyword">in</span> annotations:
            <span class="hljs-keyword">if</span> (end - start) &gt;= <span class="hljs-number">1</span>:
                pooled_embeddings.append(
                    embeddings[start:end].<span class="hljs-built_in">sum</span>(dim=<span class="hljs-number">0</span>) / (end - start)
                )
                    
        pooled_embeddings = [
            embedding.detach().cpu().numpy() <span class="hljs-keyword">for</span> embedding <span class="hljs-keyword">in</span> pooled_embeddings
        ]
        outputs.append(pooled_embeddings)

    <span class="hljs-keyword">return</span> outputs
<button class="copy-code-btn"></button></code></pre>
<p>例如，使用 jinaai/jina-embeddings-v2-base-en 进行分块：</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>提示：</em>将管道封装在函数中，可以方便地更换其他长语境模型或分块策略。</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">与传统 Embeddings 方法的比较</h3><p>为了进一步证明晚期分块法的优势，我们还使用一组示例文档和查询，将其与传统嵌入方法进行了比较。</p>
<p>再让我们重温一下 Milvus 2.4.13 发布说明的例子：</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>我们测量了查询嵌入（"milvus 2.4.13"）和每个分块之间的<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">余弦相似度</a>：</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>后期分块法的性能始终优于传统分块法，每个分块的余弦相似度都更高。这证实了先嵌入完整文档能更有效地保留全局上下文。</p>
<pre><code translate="no"><span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.8785206</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Milvus 2.4.13 introduces dynamic replica load, allowing users to adjust the number of collection replicas without needing to release and reload the collection.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.8354263</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84828955</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;This version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.7222632</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.84942204</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;Additionally, significant improvements have been made to MMAP resource usage and import performance, enhancing overall system efficiency.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.6907381</span>

<span class="hljs-title function_">similarity_late_chunking</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">late_chunking</span>: <span class="hljs-number">0.85431844</span>
<span class="hljs-title function_">similarity_traditional</span>(<span class="hljs-string">&quot;milvus 2.4.13&quot;</span>, <span class="hljs-string">&quot;We highly recommend upgrading to this release for better performance and stability.&quot;</span>)
<span class="hljs-attr">traditional_chunking</span>: <span class="hljs-number">0.71859795</span>
<button class="copy-code-btn"></button></code></pre>
<p>我们可以看到，先嵌入完整的段落可以确保每个分块都带有"<code translate="no">Milvus 2.4.13</code>"上下文，从而提高相似度得分和检索质量。</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>在 Milvus 中测试晚期分块法</strong></h3><p>一旦生成了分块嵌入，我们就可以将其存储在 Milvus 中并执行查询。下面的代码会将分块向量插入 Collections 中。</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>将嵌入向量导入 Milvus</strong></h4><pre><code translate="no">batch_data=[]
<span class="hljs-keyword">for</span> i in <span class="hljs-keyword">range</span>(<span class="hljs-built_in">len</span>(chunks)):
    data = {
            <span class="hljs-string">&quot;content&quot;</span>: chunks[i],
            <span class="hljs-string">&quot;embedding&quot;</span>: chunk_embeddings[i].tolist(),
        }

    batch_data.<span class="hljs-built_in">append</span>(data)

res = client.insert(
    collection_name=collection,
    data=batch_data,
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Querying-and-Validation" class="common-anchor-header">查询和验证</h4><p>为了验证 Milvus 查询的准确性，我们将其检索结果与人工计算的蛮力余弦相似度得分进行比较。如果两种方法返回的前 k 结果一致，我们就可以确信 Milvus 的搜索准确性是可靠的。</p>
<p>我们将 Milvus 的本机搜索与蛮力余弦相似性扫描进行比较：</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_milvus</span>(<span class="hljs-params">query, top_k = <span class="hljs-number">3</span></span>):
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    res = client.search(
                collection_name=collection,
                data=[query_vector.tolist()],
                limit=top_k,
                output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>],
            )

    <span class="hljs-keyword">return</span> [item.get(<span class="hljs-string">&quot;entity&quot;</span>).get(<span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">for</span> items <span class="hljs-keyword">in</span> res <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> items]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">late_chunking_query_by_cosine_sim</span>(<span class="hljs-params">query, k = <span class="hljs-number">3</span></span>):
    cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))
    query_vector = model(**tokenizer(query, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)).last_hidden_state.mean(<span class="hljs-number">1</span>).detach().cpu().numpy().flatten()

    results = np.empty(<span class="hljs-built_in">len</span>(chunk_embeddings))
    <span class="hljs-keyword">for</span> i, (chunk, embedding) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(chunks, chunk_embeddings)):
        results[i] = cos_sim(query_vector, embedding)

    results_order = results.argsort()[::-<span class="hljs-number">1</span>]
    <span class="hljs-keyword">return</span> np.array(chunks)[results_order].tolist()[:k]
<button class="copy-code-btn"></button></code></pre>
<p>这证实了 Milvus 与人工余弦相似度扫描返回的前 k 块是一样的。</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>因此，两种方法都能得到相同的前 3 个数据块，这也证实了 Milvus 的准确性。</p>
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
    </button></h2><p>在本文中，我们深入探讨了后期分块的机制和优势。我们首先指出了传统分块方法的缺点，尤其是在处理长文档时，保留上下文至关重要。我们介绍了后期分块的概念--在将文档切成有意义的块之前嵌入整个文档--并展示了这种方法如何保留全局上下文，从而提高语义相似性和检索准确性。</p>
<p>然后，我们使用 Jina AI 的 jina-embeddings-v2-base-en 模型进行了实际操作，并评估了其与传统方法相比的性能。最后，我们演示了如何将分块嵌入整合到 Milvus 中，以实现可扩展的精确向量搜索。</p>
<p>后期分块嵌入提供了一种<strong>上下文优先的</strong>嵌入方法--非常适合上下文最为重要的长篇复杂文档。通过预先嵌入整个文本，然后再进行切分，您可以获得以下好处：</p>
<ul>
<li><p><strong>更高的检索准确性</strong></p></li>
<li><p><strong>精简、集中的 LLM 提示</strong></p></li>
<li><p>🛠️ 与任何长语境模型的<strong>简单集成</strong></p></li>
</ul>
