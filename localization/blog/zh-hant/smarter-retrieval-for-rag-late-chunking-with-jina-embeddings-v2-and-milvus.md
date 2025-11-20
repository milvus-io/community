---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: 為 RAG 提供更聰明的擷取功能：使用 Jina Embeddings v2 和 Milvus 的後期分塊功能
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: 使用 Late Chunking 和 Milvus 來提升 RAG 的準確度，以達到高效、上下文感知的文件嵌入，以及更快、更智慧的向量搜尋。
cover: assets.zilliz.com/Milvus_Meets_Late_Chunking_eaff956df1.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: false
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>建立強大的 RAG 系統通常從<strong>文件</strong> <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>分塊</strong></a>開始<a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>- 將</strong></a>大型文字<a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>分割</strong></a>成易於管理的片段，以便嵌入和檢索。常見的策略包括</p>
<ul>
<li><p><strong>固定大小的分塊</strong>(例如，每 512 個記事單位)</p></li>
<li><p><strong>可變大小的分塊</strong>(例如：段落或句子邊界)</p></li>
<li><p><strong>滑動視窗</strong>(重疊跨度)</p></li>
<li><p><strong>遞歸分塊</strong>（分層分割）</p></li>
<li><p><strong>語意分塊</strong>（依主題分類）</p></li>
</ul>
<p>雖然這些方法都有其優點，但它們往往會破壞長距離的上下文。為了解決這個難題，Jina AI 創造了一種 Late Chunking 方法：先嵌入整個文件，然後再分割出您的分塊。</p>
<p>在這篇文章中，我們將探討 Late Chunking 如何運作，並示範如何將它與<a href="https://milvus.io/">Milvus</a>結合<a href="https://milvus.io/">（Milvus 是</a>專為相似性搜尋建立的高效能開放原始碼向量資料庫），以大幅改善您的 RAG 管道。無論您是要建立企業知識庫、AI 驅動的客戶支援，或是進階的搜尋應用程式，這篇演練都會告訴您如何更有效地管理嵌入式規模。</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">什麼是後期分塊？<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>當關鍵資訊跨越多個分塊時，傳統的分塊方法可能會破壞重要的連結，導致擷取效能不佳。</p>
<p>請參考 Milvus 2.4.13 的發佈說明，如下圖所示分成兩大塊：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 1.Milvus 2.4.13 發行說明的分塊</em></p>
<p>如果您查詢「Milvus 2.4.13 有哪些新功能？」，標準的嵌入模型可能無法將「Milvus 2.4.13」（在 Chunk 1 中）與其功能（在 Chunk 2 中）連結起來。結果呢？較弱的向量和較低的檢索準確度。</p>
<p>啟發式的修復方法，例如滑動視窗、重疊上下文和重複掃描，可以提供部分緩解，但無法保證。</p>
<p><strong>傳統的分塊技術</strong>遵循此管道：</p>
<ol>
<li><p><strong>預先將</strong>文字<strong>分塊</strong>（依據句子、段落或最大符號長度）。</p></li>
<li><p>單獨<strong>嵌入</strong>每個分塊。</p></li>
<li><p><strong>將記號</strong>嵌入<strong>聚合</strong>(例如，透過平均<strong>匯集</strong>) 成為單一的分塊向量。</p></li>
</ol>
<p><strong>Late Chunking</strong>翻轉管道：</p>
<ol>
<li><p><strong>先嵌入</strong>：在整個文件上執行長上下文轉換器，產生豐富的標記嵌入，捕捉全局上下文。</p></li>
<li><p><strong>之後再分塊</strong>：平均池化這些標記嵌入的連續跨度，以形成最終的分塊向量。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 2.原始分塊與後期分塊 (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>原始</em></a><em>碼</em><em>)</em></p>
<p>通過在每個分塊中保留完整的文檔上下文，後期分塊技術可以產生以下效果：</p>
<ul>
<li><p><strong>更高的檢索準確度 - 每個</strong>分塊都能感知上下文。</p></li>
<li><p><strong>更少的分塊 - 您可以</strong>傳送更集中的文字到 LLM，減少成本與延遲。</p></li>
</ul>
<p>許多長上下文模型（例如 jina-embeddings-v2-base-en）最多可處理 8,192 個字元，相當於 20 分鐘的閱讀時間（大約 5,000 個字），因此 Late Chunking 適用於大多數的實際文件。</p>
<p>現在我們瞭解了 Late Chunking 背後的 「是什麼 」和 「為什麼」，讓我們深入瞭解 「怎麼做」。在下一節中，我們將引導您實踐 Late Chunking 管道，將其性能與傳統的分塊技術進行比較，並使用 Milvus 對其實際影響進行驗證。這個實務演練將銜接理論與實務，準確展示如何將後期分塊技術整合到您的 RAG 工作流程中。</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">測試後期分塊<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">基本實作</h3><p>以下是 Late Chunking 的核心功能。我們已加入清晰的說明文件，引導您完成每個步驟。函式<code translate="no">sentence_chunker</code> 會將原始文件分割成以段落為基礎的分塊，並傳回分塊內容和分塊註解資訊<code translate="no">span_annotations</code> (即每個分塊的開始和結束索引)。</p>
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
<p>函式<code translate="no">document_to_token_embeddings</code> 使用 jinaai/jina-embeddings-v2-base-en 模型及其 tokenizer 來產生整個文件的 embeddings。</p>
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
<p>函式<code translate="no">late_chunking</code> 接收文件的 token embeddings 和原始的 chunk 註解資訊<code translate="no">span_annotations</code> ，然後產生最後的 chunk embeddings。</p>
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
<p>例如，使用 jinaai/jina-embeddings-v2-base-en 進行分塊：</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>提示：</em>將您的管道包裝在函數中，可以輕鬆地換用其他長內容模型或分塊策略。</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">與傳統嵌入方法的比較</h3><p>為了進一步展示 Late Chunking 的優勢，我們也使用一組樣本文件和查詢，將它與傳統的嵌入方法進行比較。</p>
<p>再讓我們重溫 Milvus 2.4.13 發行紀錄的範例：</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>我們測量查詢嵌入（"milvus 2.4.13"）和每個分塊之間的<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">余弦相似度</a>：</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>Late Chunking 的表現持續優於傳統的 chunking，每個 chunk 的余弦相似度都較高。這證實了先嵌入完整文件能更有效地保留全局上下文。</p>
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
<p>我們可以看到，先嵌入完整的段落可以確保每個分塊都帶有 "<code translate="no">Milvus 2.4.13</code>" 上下文，進而提升相似度分數和檢索品質。</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>在 Milvus 測試後期分塊</strong></h3><p>一旦生成了分塊嵌入，我們就可以將其存入 Milvus 並進行查詢。下面的程式碼會將分塊向量插入到集合中。</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>將嵌入向量匯入 Milvus</strong></h4><pre><code translate="no">batch_data=[]
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
<h4 id="Querying-and-Validation" class="common-anchor-header">查詢與驗證</h4><p>為了驗證 Milvus 查詢的準確性，我們將其檢索結果與手動計算的粗略余弦相似度得分進行比較。如果兩種方法都傳回一致的 top-k 結果，我們就可以相信 Milvus 的搜尋準確度是可靠的。</p>
<p>我們比較 Milvus 的本機搜尋與粗暴的余弦相似性掃描：</p>
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
<p>這證實了 Milvus 與手動余弦相似度掃描會返回相同的 top-k 片段。</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>因此，兩種方法都會產生相同的前三大塊，證實了 Milvus 的準確性。</p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>在這篇文章中，我們深入探討了 Late Chunking 的機制和優點。我們首先識別了傳統分塊方法的缺點，尤其是在處理長文件時，保留上下文是非常重要的。我們介紹了後期分塊 (Late Chunking) 的概念 - 在將文檔分割成有意義的分塊之前先嵌入整個文檔，並展示了這如何保留全局上下文，從而提高語義相似性和檢索準確性。</p>
<p>接著，我們使用 Jina AI 的 jina-embeddings-v2-base-en 模型進行實作，並與傳統方法比較評估其效能。最後，我們展示了如何將 Chunk embeddings 整合到 Milvus 中，以進行可擴充且精確的向量搜尋。</p>
<p>Late Chunking 提供了一種<strong>上下文第一</strong>的嵌入方法，非常適合上下文最重要的複雜長篇文件。先嵌入整個文字，之後再進行分塊，您可以獲得以下好處</p>
<ul>
<li><p><strong>更精確的檢索準確度</strong></p></li>
<li><p><strong>精簡、集中的 LLM 提示</strong></p></li>
<li><p>🛠️ 可與任何長內容模型<strong>簡單整合</strong></p></li>
</ul>
