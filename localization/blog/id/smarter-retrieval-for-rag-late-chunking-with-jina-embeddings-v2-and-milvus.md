---
id: smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
title: >-
  Pengambilan yang Lebih Cerdas untuk RAG: Late Chunking dengan Penyematan Jina
  v2 dan Milvus
author: Wei Zang
date: 2025-10-11T00:00:00.000Z
desc: >-
  Tingkatkan akurasi RAG menggunakan Late Chunking dan Milvus untuk penyematan
  dokumen yang efisien dan sadar konteks serta pencarian vektor yang lebih cepat
  dan cerdas.
cover: >-
  assets.zilliz.com/Milvus_Meets_Late_Chunking_Smarter_Retrieval_for_RAG_4f9640fffd.png
tag: Tutorials
tags: 'Milvus, Vector Database, Open Source, Vector Embeddings'
recommend: true
meta_keywords: 'Late Chunking, RAG accuracy, vector database, Milvus, document embeddings'
canonicalUrl: >-
  https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md
---
<p>Membangun sistem RAG yang tangguh biasanya dimulai dengan <a href="https://zilliz.com/learn/guide-to-chunking-strategies-for-rag#Chunking"><strong>pemotongan dokumen-memecah</strong></a>teks besar menjadi bagian-bagian yang dapat dikelola untuk disematkan dan diambil. Strategi yang umum meliputi:</p>
<ul>
<li><p><strong>Potongan dengan ukuran tetap</strong> (misalnya, setiap 512 token)</p></li>
<li><p><strong>Potongan ukuran variabel</strong> (misalnya, batas paragraf atau kalimat)</p></li>
<li><p><strong>Jendela geser</strong> (rentang yang tumpang tindih)</p></li>
<li><p>Pemenggalan<strong>rekursif</strong> (pemisahan hirarkis)</p></li>
<li><p>Pemenggalan<strong>semantik</strong> (pengelompokan berdasarkan topik)</p></li>
</ul>
<p>Meskipun metode-metode ini memiliki kelebihan, metode-metode ini sering kali memecah konteks jangka panjang. Untuk mengatasi tantangan ini, Jina AI menciptakan pendekatan Late Chunking: menyematkan seluruh dokumen terlebih dahulu, lalu memotong-motongnya.</p>
<p>Dalam artikel ini, kita akan mengeksplorasi cara kerja Late Chunking dan mendemonstrasikan bagaimana menggabungkannya dengan <a href="https://milvus.io/">Milvus-basis</a>data vektor sumber terbuka berkinerja tinggi yang dibuat untuk pencarian kemiripan-dapat secara dramatis meningkatkan pipeline RAG Anda. Baik Anda sedang membangun basis pengetahuan perusahaan, dukungan pelanggan berbasis AI, atau aplikasi pencarian tingkat lanjut, panduan ini akan menunjukkan kepada Anda cara mengelola penyematan secara lebih efektif dalam skala besar.</p>
<h2 id="What-Is-Late-Chunking" class="common-anchor-header">Apa yang dimaksud dengan Late Chunking?<button data-href="#What-Is-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Metode chunking tradisional dapat memutus koneksi penting ketika informasi penting tersebar di beberapa chunking-mengakibatkan kinerja pencarian yang buruk.</p>
<p>Perhatikan catatan rilis untuk Milvus 2.4.13 ini, yang dibagi menjadi dua bagian seperti di bawah ini:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure1_Chunking_Milvus2_4_13_Release_Note_fe7fbdb833.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 1. Gambar 1. Catatan Rilis Milvus 2.4.13 yang terpotong-potong</em></p>
<p>Jika Anda bertanya, "Apa saja fitur-fitur baru di Milvus 2.4.13?", model penyematan standar mungkin gagal menghubungkan "Milvus 2.4.13" (di Chunk 1) dengan fitur-fiturnya (di Chunk 2). Hasilnya? Vektor yang lebih lemah dan akurasi pengambilan yang lebih rendah.</p>
<p>Perbaikan heuristik-seperti menggeser jendela, konteks yang tumpang tindih, dan pemindaian berulang-memberikan bantuan parsial tetapi tidak ada jaminan.</p>
<p><strong>Pemenggalan tradisional</strong> mengikuti alur ini:</p>
<ol>
<li><p><strong>Pra-pemenggalan</strong> teks (berdasarkan kalimat, paragraf, atau panjang token maksimum).</p></li>
<li><p><strong>Sematkan</strong> setiap potongan secara terpisah.</p></li>
<li><p><strong>Mengagregasi</strong> penyematan token (misalnya, melalui average pooling) ke dalam vektor chunk tunggal.</p></li>
</ol>
<p><strong>Late Chunking</strong> membalik pipeline:</p>
<ol>
<li><p><strong>Sematkan terlebih dahulu</strong>: Menjalankan transformator konteks panjang di atas dokumen lengkap, menghasilkan penyematan token yang kaya yang menangkap konteks global.</p></li>
<li><p><strong>Chunk kemudian</strong>: Rata-rata-rentang yang bersebelahan dari penyematan token tersebut untuk membentuk vektor potongan akhir Anda.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure2_Naive_Chunkingvs_Late_Chunking_a94d30b6ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 2. Naive Chunking vs Late Chunking (</em><a href="https://jina.ai/news/late-chunking-in-long-context-embedding-models/"><em>Sumber</em></a><em>)</em></p>
<p>Dengan mempertahankan konteks dokumen lengkap di setiap chunk, Late Chunking menghasilkan:</p>
<ul>
<li><p><strong>Akurasi pengambilan yang lebih tinggi - setiap</strong>potongan memiliki konteks.</p></li>
<li><p><strong>Lebih sedikit potongan - Anda</strong>mengirim teks yang lebih terfokus ke LLM Anda, sehingga mengurangi biaya dan latensi.</p></li>
</ul>
<p>Banyak model konteks panjang seperti jina-embeddings-v2-base-en dapat memproses hingga 8.192 token-setara dengan sekitar 20 menit membaca (sekitar 5.000 kata)-menjadikan Late Chunking praktis untuk sebagian besar dokumen di dunia nyata.</p>
<p>Sekarang setelah kita memahami "apa" dan "mengapa" di balik Late Chunking, mari kita bahas "bagaimana". Di bagian selanjutnya, kami akan memandu Anda melalui implementasi langsung dari pipeline Late Chunking, membandingkan kinerjanya dengan chunking tradisional, dan memvalidasi dampaknya di dunia nyata dengan menggunakan Milvus. Panduan praktis ini akan menjembatani teori dan praktik, menunjukkan dengan tepat cara mengintegrasikan Late Chunking ke dalam alur kerja RAG Anda.</p>
<h2 id="Testing-Late-Chunking" class="common-anchor-header">Menguji Late Chunking<button data-href="#Testing-Late-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Basic-Implementation" class="common-anchor-header">Implementasi Dasar</h3><p>Di bawah ini adalah fungsi-fungsi inti untuk Late Chunking. Kami telah menambahkan dokumen yang jelas untuk memandu Anda melalui setiap langkah. Fungsi <code translate="no">sentence_chunker</code> membagi dokumen asli menjadi potongan-potongan berbasis paragraf, mengembalikan konten potongan dan informasi anotasi potongan <code translate="no">span_annotations</code> (yaitu, indeks awal dan akhir setiap potongan).</p>
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
<p>Fungsi <code translate="no">document_to_token_embeddings</code> menggunakan model jinaai/jina-embeddings-v2-base-en dan tokenizer-nya untuk menghasilkan embeddings untuk seluruh dokumen.</p>
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
<p>Fungsi <code translate="no">late_chunking</code> mengambil sematan token dokumen dan informasi anotasi potongan asli <code translate="no">span_annotations</code>, dan kemudian menghasilkan sematan potongan akhir.</p>
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
<p>Misalnya, chunking dengan jinaai/jina-embeddings-v2-base-en:</p>
<pre><code translate="no">tokenizer = AutoTokenizer.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)
model     = AutoModel.from_pretrained(<span class="hljs-string">&#x27;jinaai/jina-embeddings-v2-base-en&#x27;</span>, trust_remote_code=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># First chunk the text as normal, to obtain the beginning and end points of the chunks.</span>
chunks, span_annotations = sentence_chunker(document)
<span class="hljs-comment"># Then embed the full document.</span>
token_embeddings = document_to_token_embeddings(model, tokenizer, document)
<span class="hljs-comment"># Then perform the late chunking</span>
chunk_embeddings = late_chunking(token_embeddings, [span_annotations])[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p><em>Tip:</em> Membungkus pipeline Anda dengan fungsi memudahkan untuk menukar model konteks panjang atau strategi chunking lainnya.</p>
<h3 id="Comparison-with-Traditional-Embedding-Methods" class="common-anchor-header">Perbandingan dengan Metode Penyematan Tradisional</h3><p>Untuk menunjukkan lebih jauh keunggulan Late Chunking, kami juga membandingkannya dengan pendekatan penyematan tradisional, dengan menggunakan sekumpulan contoh dokumen dan kueri.</p>
<p>Dan mari kita tinjau kembali contoh catatan rilis Milvus 2.4.13:</p>
<pre><code translate="no"><span class="hljs-title class_">Milvus</span> <span class="hljs-number">2.4</span><span class="hljs-number">.13</span> introduces dynamic replica load, allowing users to adjust the number <span class="hljs-keyword">of</span> collection replicas without needing to release and reload the collection. <span class="hljs-title class_">This</span> version also addresses several critical bugs related to bulk importing, expression parsing, load balancing, and failure recovery. <span class="hljs-title class_">Additionally</span>, significant improvements have been made to <span class="hljs-variable constant_">MMAP</span> resource usage and <span class="hljs-keyword">import</span> performance, enhancing overall system efficiency. <span class="hljs-title class_">We</span> highly recommend upgrading to <span class="hljs-variable language_">this</span> release <span class="hljs-keyword">for</span> better performance and stability.
<button class="copy-code-btn"></button></code></pre>
<p>Kami mengukur <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Cosine-Similarity">kemiripan kosinus</a> antara penyematan kueri ("milvus 2.4.13") dan setiap potongan:</p>
<pre><code translate="no">cos_sim = <span class="hljs-keyword">lambda</span> x, y: np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

milvus_embedding = model.encode(<span class="hljs-string">&#x27;milvus 2.4.13&#x27;</span>)

<span class="hljs-keyword">for</span> chunk, late_chunking_embedding, traditional_embedding <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(chunks, chunk_embeddings, embeddings_traditional_chunking):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_late_chunking(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;late_chunking: &#x27;</span>, cos_sim(milvus_embedding, late_chunking_embedding))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&#x27;similarity_traditional(&quot;milvus 2.4.13&quot;, &quot;<span class="hljs-subst">{chunk}</span>&quot;)&#x27;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&#x27;traditional_chunking: &#x27;</span>, cos_sim(milvus_embedding, traditional_embeddings))
<button class="copy-code-btn"></button></code></pre>
<p>Late Chunking secara konsisten mengungguli chunking tradisional, menghasilkan kemiripan kosinus yang lebih tinggi di setiap chunk. Hal ini menegaskan bahwa menyematkan dokumen lengkap terlebih dahulu dapat mempertahankan konteks global dengan lebih efektif.</p>
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
<p>Kita dapat melihat bahwa menyematkan paragraf lengkap terlebih dahulu memastikan setiap potongan membawa "<code translate="no">Milvus 2.4.13</code>" yang meningkatkan skor kemiripan konteks dan kualitas pencarian.</p>
<h3 id="Testing-Late-Chunking-in-Milvus" class="common-anchor-header"><strong>Menguji Pemotongan Akhir di Milvus</strong></h3><p>Setelah penyematan potongan dibuat, kita dapat menyimpannya di Milvus dan melakukan kueri. Kode berikut menyisipkan vektor potongan ke dalam koleksi.</p>
<h4 id="Importing-Embeddings-into-Milvus" class="common-anchor-header"><strong>Mengimpor embedding ke dalam Milvus</strong></h4><pre><code translate="no">batch_data=[]
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
<h4 id="Querying-and-Validation" class="common-anchor-header">Pengajuan Pertanyaan dan Validasi</h4><p>Untuk memvalidasi keakuratan kueri Milvus, kami membandingkan hasil pengambilannya dengan skor kesamaan kosinus brute-force yang dihitung secara manual. Jika kedua metode tersebut memberikan hasil top-k yang konsisten, kami yakin bahwa akurasi pencarian Milvus dapat diandalkan.</p>
<p>Kami membandingkan pencarian asli Milvus dengan pemindaian kemiripan kosinus secara brute-force:</p>
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
<p>Hal ini mengonfirmasi bahwa Milvus menghasilkan potongan top-k yang sama dengan pemindaian cosinus-sim manual.</p>
<pre><code translate="no">&gt; late_chunking_query_by_milvus(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types ([#36565](https://github.com/milvus-io/milvus/pull/36565))...
</span><button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; late_chunking_query_by_cosine_sim(<span class="hljs-string">&quot;What are new features in milvus 2.4.13&quot;</span>, 3)

[<span class="hljs-string">&#x27;\n\n### Features\n\n- Dynamic replica adjustment for loaded collections ([#36417](https://github.com/milvus-io/milvus/pull/36417))\n- Sparse vector MMAP in growing segment types (#36565)...
</span><button class="copy-code-btn"></button></code></pre>
<p>Jadi, kedua metode ini menghasilkan 3 potongan teratas yang sama, yang mengonfirmasi keakuratan Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">Kesimpulan<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam artikel ini, kami mendalami mekanisme dan manfaat Late Chunking. Kami mulai dengan mengidentifikasi kekurangan dari pendekatan chunking tradisional, terutama ketika menangani dokumen panjang yang sangat penting untuk menjaga konteks. Kami memperkenalkan konsep Late Chunking - menyematkan seluruh dokumen sebelum memotongnya menjadi potongan-potongan yang bermakna - dan menunjukkan bagaimana hal ini mempertahankan konteks global, yang mengarah pada peningkatan kesamaan semantik dan akurasi pencarian.</p>
<p>Kami kemudian melakukan implementasi langsung menggunakan model jina-embeddings-v2-base-en dari Jina AI dan mengevaluasi kinerjanya dibandingkan dengan metode tradisional. Terakhir, kami mendemonstrasikan cara mengintegrasikan chunk embeddings ke dalam Milvus untuk pencarian vektor yang terukur dan akurat.</p>
<p>Late Chunking menawarkan pendekatan yang <strong>mengutamakan konteks</strong> untuk penyematan-sempurna untuk dokumen yang panjang dan kompleks di mana konteks sangat penting. Dengan menyematkan seluruh teks di awal dan memotongnya nanti, Anda akan mendapatkan keuntungan:</p>
<ul>
<li><p><strong>🔍 Akurasi pengambilan yang lebih tajam</strong></p></li>
<li><p>⚡ <strong>Perintah LLM yang ramping dan terfokus</strong></p></li>
<li><p>🛠️ <strong>Integrasi sederhana</strong> dengan model konteks panjang apa pun</p></li>
</ul>
