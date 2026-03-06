---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: |
  Smarter Retrieval for RAG: Late Chunking with Jina Embeddings v2 and Milvus
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  Boost RAG accuracy using Late Chunking and Milvus for efficient, context‑aware
  document embeddings and faster, smarter vector search.
cover: assets.zilliz.com/Milvus_Meets_Late_Chunking_eaff956df1.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>Building a robust RAG system usually starts with <strong>document</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>chunking</strong></a>—splitting large texts into manageable pieces for embedding and retrieval. Common strategies include:</p>
<ul>
<li><p><strong>Fixed‑size chunks</strong> (e.g., every 512 tokens)</p></li>
<li><p><strong>Variable‑size chunks</strong> (e.g., paragraph or sentence boundaries)</p></li>
<li><p><strong>Sliding windows</strong> (overlapping spans)</p></li>
<li><p><strong>Recursive chunking</strong> (hierarchical splits)</p></li>
<li><p><strong>Semantic chunking</strong> (grouping by topic)</p></li>
</ul>
<p>While these methods have their merits, they often fracture long‑range context. To address this challenge, Jina AI creates a Late Chunking approach: embed the entire document first, then carve out your chunks.</p>
<p>In this article, we’ll explore how Late Chunking works and demonstrate how combining it with <a href="https://milvus.io/">Milvus</a>—a high-performance open-source vector database built for similarity search—can dramatically improve your RAG pipelines. Whether you’re building enterprise knowledge bases, AI-driven customer support, or advanced search applications, this walkthrough will show you how to manage embeddings more effectively at scale.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">What Is Late Chunking?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Traditional chunking methods can break important connections when key information spans multiple chunks—resulting in poor retrieval performance.</p>
<p>Consider these release notes for Milvus 2.4.13, split into two chunks like below:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 1. Chunking Milvus 2.4.13 Release Note</em></p>
<p>If you query, “What are the new features in Milvus 2.4.13?”, a standard embedding model may fail to link “Milvus 2.4.13” (in Chunk 1) with its features (in Chunk 2). The result? Weaker vectors and lower retrieval accuracy.</p>
<p>Heuristic fixes—such as sliding windows, overlapping contexts, and repeated scans—provide partial relief but no guarantees.</p>
<p><strong>Traditional chunking</strong> follows this pipeline:</p>
<ol>
<li><p><strong>Pre‑chunk</strong> text (by sentences, paragraphs, or max token length).</p></li>
<li><p><strong>Embed</strong> each chunk separately.</p></li>
<li><p><strong>Aggregate</strong> token embeddings (e.g., via average pooling) into a single chunk vector.</p></li>
</ol>
<p><strong>Late Chunking</strong> flips the pipeline:</p>
<ol>
<li><p><strong>Embed first</strong>: Run a long‑context transformer over the full document, generating rich token embeddings that capture global context.</p></li>
<li><p><strong>Chunk later</strong>: Average‑pool contiguous spans of those token embeddings to form your final chunk vectors.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure 2. Naive Chunking vs. Late Chunking (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>Source</em></a><em>)</em></p>
<p>By preserving full‑document context in every chunk, Late Chunking yields:</p>
<ul>
<li><p><strong>Higher retrieval accuracy</strong>—each chunk is contextually aware.</p></li>
<li><p><strong>Fewer chunks</strong>—you send more focused text to your LLM, cutting costs and latency.</p></li>
</ul>
<p>Many long‑context models like jina-embeddings-v2-base-en can process up to 8,192 tokens—equivalent to about a 20-minute read (roughly 5,000 words)—making Late Chunking practical for most real‑world documents.</p>
<p>Now that we understand the “what” and “why” behind Late Chunking, let’s dive into the “how”. In the next section, we’ll guide you through a hands‑on implementation of the Late Chunking pipeline, benchmark its performance against traditional chunking, and validate its real‑world impact using Milvus. This practical walkthrough will bridge theory and practice, showing exactly how to integrate Late Chunking into your RAG workflows.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">Testing Late Chunking<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">Basic Implementation</h3><p>Below are the core functions for Late Chunking. We’ve added clear docstrings to guide you through each step. The function <code translate="no">sentence_chunker</code> splits the original document into paragraph‑based chunks, returning both the chunk contents and the chunk annotation information <code translate="no">span_annotations</code> (i.e., the start and end indices of each chunk).</p>
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
<p>The function <code translate="no">document_to_token_embeddings</code> uses the jinaai/jina-embeddings-v2-base-en model and its tokenizer to produce embeddings for the entire document.</p>
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
<p>The function <code translate="no">late_chunking</code> takes the document’s token embeddings and the original chunk annotation information <code translate="no">span_annotations</code>, and then produces the final chunk embeddings.</p>
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
<p>For example, chunking with jinaai/jina-embeddings-v2-base-en:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>Tip:</em> Wrapping your pipeline in functions makes it easy to swap in other long‑context models or chunking strategies.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">Comparison with Traditional Embedding Methods</h3><p>To further demonstrate the advantages of Late Chunking, we also compared it to traditional embedding approaches, using a set of sample documents and queries.</p>
<p>And let’s revisit our Milvus 2.4.13 release note example:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>We measure <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">cosine similarity</a> between the query embedding (“milvus 2.4.13”) and each chunk:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>Late Chunking consistently outperformed traditional chunking, yielding higher cosine similarities across every chunk. This confirms that embedding the full document first preserves global context more effectively.</p>
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
<p>We can see that embedding the full paragraph first ensures each chunk carries the “<code translate="no">Milvus 2.4.13</code>” context—boosting similarity scores and retrieval quality.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Testing Late Chunking in Milvus</strong></h3><p>Once chunk embeddings are generated, we can store them in Milvus and perform queries. The following code inserts chunk vectors into the collection.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Importing Embeddings into Milvus</strong></h4><pre><code translate="no">batch_data=[]
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
<h4 id="Querying-and-Validation" class="common-anchor-header">Querying and Validation</h4><p>To validate the accuracy of Milvus queries, we compare its retrieval results to brute-force cosine similarity scores calculated manually. If both methods return consistent top‑k results, we can be confident that Milvus’s search accuracy is reliable.</p>
<p>We compare Milvus’s native search with a brute‑force cosine similarity scan:</p>
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
<p>This confirms Milvus returns the same top‑k chunks as a manual cosine‑sim scan.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>So both methods yield the same top-3 chunks, confirming Milvus’s accuracy.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>In this article, we took a deep dive into the mechanics and benefits of Late Chunking. We began by identifying the shortcomings of traditional chunking approaches, particularly when handling long documents where preserving context is crucial. We introduced the concept of Late Chunking—embedding the entire document before slicing it into meaningful chunks—and showed how this preserves global context, leading to improved semantic similarity and retrieval accuracy.</p>
<p>We then walked through a hands-on implementation using Jina AI’s jina-embeddings-v2-base-en model and evaluated its performance compared to traditional methods. Finally, we demonstrated how to integrate the chunk embeddings into Milvus for scalable and accurate vector search.</p>
<p>Late Chunking offers a <strong>context‑first</strong> approach to embedding—perfect for long, complex documents where context matters most. By embedding the entire text upfront and slicing later, you gain:</p>
<ul>
<li><p>🔍 <strong>Sharper retrieval accuracy</strong></p></li>
<li><p>⚡ <strong>Lean, focused LLM prompts</strong></p></li>
<li><p>🛠️ <strong>Simple integration</strong> with any long‑context model</p></li>
</ul>
