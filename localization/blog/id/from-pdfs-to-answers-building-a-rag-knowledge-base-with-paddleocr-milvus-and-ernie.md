---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: >-
  Dari PDF ke Jawaban: Membangun Basis Pengetahuan RAG dengan PaddleOCR, Milvus,
  dan ERNIE
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: >-
  Pelajari cara membangun basis pengetahuan RAG dengan akurasi tinggi
  menggunakan Milvus, pencarian hibrida, pemeringkatan ulang, dan Tanya Jawab
  multimodal untuk kecerdasan dokumen.
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>Model bahasa yang besar jauh lebih mampu dibandingkan pada tahun 2023, tetapi model ini masih berhalusinasi dengan percaya diri dan sering kali menggunakan informasi yang sudah ketinggalan zaman. RAG (Retrieval-Augmented Generation) mengatasi kedua masalah tersebut dengan mengambil konteks yang relevan dari basis data vektor seperti <a href="https://milvus.io/">Milvus</a> sebelum model menghasilkan respons. Konteks tambahan tersebut mendasarkan jawaban pada sumber yang nyata dan membuatnya lebih terkini.</p>
<p>Salah satu kasus penggunaan RAG yang paling umum adalah basis pengetahuan perusahaan. Seorang pengguna mengunggah PDF, file Word, atau dokumen internal lainnya, mengajukan pertanyaan dalam bahasa alami, dan menerima jawaban berdasarkan bahan-bahan tersebut, bukan hanya pada prapelatihan model.</p>
<p>Tetapi menggunakan LLM yang sama dan basis data vektor yang sama tidak menjamin hasil yang sama. Dua tim dapat membangun di atas fondasi yang sama dan tetap menghasilkan kualitas sistem yang sangat berbeda. Perbedaannya biasanya berasal dari segala sesuatu di bagian hulu: <strong>bagaimana dokumen diuraikan, dipotong-potong, dan disematkan; bagaimana data diindeks; bagaimana hasil pencarian diurutkan; dan bagaimana jawaban akhir dikumpulkan</strong>.</p>
<p>Dalam artikel ini, kita akan menggunakan <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> sebagai contoh dan menjelaskan bagaimana membangun basis pengetahuan berbasis RAG dengan <a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>, <a href="https://milvus.io/">Milvus</a>, dan ERNIE-4.5-Turbo.</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Arsitektur Sistem Paddle-ERNIE-RAG<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Arsitektur Paddle-ERNIE-RAG terdiri dari empat lapisan inti:</p>
<ul>
<li><strong>Lapisan ekstraksi data.</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3</a>, pipa pengurai dokumen di PaddleOCR, membaca PDF dan gambar dengan OCR yang sadar tata letak. Ini mempertahankan struktur dokumen - judul, tabel, urutan membaca - dan menghasilkan Markdown yang bersih, dibagi menjadi potongan-potongan yang tumpang tindih.</li>
<li><strong>Lapisan penyimpanan vektor.</strong> Setiap potongan disematkan ke dalam vektor 384 dimensi dan disimpan di <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> bersama dengan metadata (nama file, nomor halaman, ID potongan). Indeks terbalik paralel mendukung pencarian kata kunci.</li>
<li><strong>Lapisan pengambilan dan penjawaban.</strong> Setiap kueri dijalankan terhadap indeks vektor dan indeks kata kunci. Hasilnya digabungkan melalui RRF (Reciprocal Rank Fusion), diurutkan ulang, dan diteruskan ke model <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE</a> untuk menghasilkan jawaban.</li>
<li><strong>Lapisan aplikasi.</strong> Antarmuka <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/">Gradio</a> memungkinkan Anda mengunggah dokumen, mengajukan pertanyaan, dan melihat jawaban dengan kutipan sumber dan skor kepercayaan.  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>Bagian di bawah ini akan menjelaskan setiap tahap secara berurutan, dimulai dari bagaimana dokumen mentah menjadi teks yang dapat dicari.</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">Cara Membuat Pipeline RAG Langkah demi Langkah<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">Langkah 1: Mengurai Dokumen dengan PP-StructureV3</h3><p>Dokumen mentah adalah tempat sebagian besar masalah akurasi dimulai. Makalah penelitian dan laporan teknis menggabungkan tata letak dua kolom, rumus, tabel, dan gambar. Mengekstrak teks dengan pustaka dasar seperti PyPDF2 biasanya mengacaukan output: paragraf muncul tidak berurutan, tabel runtuh, dan rumus menghilang.</p>
<p>Untuk menghindari masalah ini, proyek ini membuat kelas OnlinePDFParser di backend.py. Kelas ini memanggil API online PP-StructureV3 untuk melakukan penguraian tata letak. Alih-alih mengekstrak teks mentah, API ini mengidentifikasi struktur dokumen, lalu mengubahnya menjadi format Markdown.</p>
<p>Metode ini memiliki tiga manfaat yang jelas:</p>
<ul>
<li><strong>Keluaran Markdown yang bersih</strong></li>
</ul>
<p>Output diformat sebagai Markdown dengan judul dan paragraf yang tepat. Hal ini membuat konten lebih mudah dipahami oleh model.</p>
<ul>
<li><strong>Ekstraksi gambar terpisah</strong></li>
</ul>
<p>Sistem mengekstrak dan menyimpan gambar selama penguraian. Hal ini mencegah hilangnya informasi visual yang penting.</p>
<ul>
<li><strong>Penanganan konteks yang lebih baik</strong></li>
</ul>
<p>Teks dibagi menggunakan jendela geser dengan tumpang tindih. Hal ini untuk menghindari pemotongan kalimat atau rumus di tengah, yang membantu menjaga makna tetap jelas dan meningkatkan akurasi pencarian.</p>
<p><strong>Alur Penguraian Dasar</strong></p>
<p>Di backend.py, penguraian mengikuti tiga langkah sederhana:</p>
<ol>
<li>Kirim berkas PDF ke API PP-StructureV3.</li>
<li>Baca layoutParsingHasil yang dikembalikan.</li>
<li>Ekstrak teks Penurunan Harga yang telah dibersihkan dan semua gambar.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">Langkah 2: Pisahkan Teks dengan Jendela Geser Tumpang Tindih</h3><p>Setelah penguraian, teks Diskon harus dibagi menjadi beberapa bagian yang lebih kecil (potongan) untuk pencarian. Jika teks dipotong dengan panjang yang tetap, kalimat atau rumus dapat terpecah menjadi dua.</p>
<p>Untuk mencegah hal ini, sistem menggunakan pemotongan jendela geser dengan tumpang tindih. Setiap potongan berbagi bagian ekor dengan bagian berikutnya, sehingga konten yang berbatasan muncul di kedua jendela. Hal ini menjaga makna tetap utuh di tepi potongan dan meningkatkan daya ingat pengambilan.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">Langkah 3: Menyimpan Vektor dan Metadata di Milvus</h3><p>Dengan potongan yang bersih, langkah selanjutnya adalah menyimpannya dengan cara yang mendukung pengambilan yang cepat dan akurat.</p>
<p><strong>Penyimpanan Vektor dan Metadata</strong></p>
<p>Milvus memberlakukan aturan yang ketat untuk nama koleksi - hanya huruf, angka, dan garis bawah ASCII. Jika nama basis pengetahuan mengandung karakter non-ASCII, backend akan meng-encode dengan awalan kb_ sebelum membuat koleksi dan menerjemahkannya untuk ditampilkan. Sebuah detail kecil, tetapi dapat mencegah kesalahan samar.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>Selain penamaan, setiap potongan melewati dua langkah sebelum disisipkan: membuat penyematan dan melampirkan metadata.</p>
<ul>
<li><strong>Apa yang disimpan:</strong></li>
</ul>
<p>Setiap potongan diubah menjadi vektor padat 384 dimensi. Pada saat yang sama, skema Milvus menyimpan bidang tambahan seperti nama file, nomor halaman, dan ID chunk.</p>
<ul>
<li><strong>Mengapa ini penting:</strong></li>
</ul>
<p>Hal ini memungkinkan untuk melacak jawaban kembali ke halaman yang sama persis dengan halaman asalnya. Hal ini juga mempersiapkan sistem untuk kasus penggunaan Tanya Jawab multimodal di masa depan.</p>
<ul>
<li><strong>Optimalisasi kinerja:</strong></li>
</ul>
<p>Dalam vector_store.py, metode insert_documents menggunakan penyematan batch. Hal ini mengurangi jumlah permintaan jaringan dan membuat prosesnya lebih efisien.</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">Langkah 4: Mengambil dengan Pencarian Hibrida dan Fusi RRF</h3><p>Metode pencarian tunggal jarang sekali cukup. Pencarian vektor menemukan konten yang secara semantik mirip tetapi dapat melewatkan istilah yang tepat; pencarian kata kunci menemukan istilah tertentu tetapi melewatkan parafrase. Menjalankan keduanya secara paralel dan menggabungkan hasilnya akan menghasilkan hasil yang lebih baik daripada salah satunya.</p>
<p>Ketika bahasa kueri berbeda dengan bahasa dokumen, sistem pertama-tama menerjemahkan kueri menggunakan LLM sehingga kedua jalur pencarian dapat beroperasi dalam bahasa dokumen. Kemudian dua pencarian berjalan secara paralel:</p>
<ul>
<li><strong>Pencarian vektor (padat):</strong> Menemukan konten dengan makna yang sama, bahkan lintas bahasa, tetapi mungkin memunculkan bagian terkait yang tidak secara langsung menjawab pertanyaan.</li>
<li><strong>Pencarian kata kunci (jarang):</strong> Menemukan kecocokan yang tepat untuk istilah teknis, angka, atau variabel rumus - jenis token yang sering kali disematkan oleh penyematan vektor.</li>
</ul>
<p>Sistem menggabungkan kedua daftar hasil menggunakan RRF (Reciprocal Rank Fusion). Setiap kandidat menerima skor berdasarkan peringkatnya di setiap daftar, sehingga bagian yang muncul di dekat bagian atas <em>kedua</em> daftar memiliki skor tertinggi. Pencarian vektor memberikan kontribusi cakupan semantik; pencarian kata kunci memberikan kontribusi ketepatan istilah.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">Langkah 5: Beri Peringkat Ulang Hasil Sebelum Pembuatan Jawaban</h3><p>Hasil yang dikembalikan oleh langkah pencarian tidak semuanya relevan. Jadi sebelum menghasilkan jawaban akhir, langkah perankingan ulang akan memberi skor ulang.</p>
<p>Dalam reranker_v2.py, metode penilaian gabungan mengevaluasi setiap potongan, yang dinilai dari lima aspek:</p>
<ul>
<li><strong>Pencocokan fuzzy</strong></li>
</ul>
<p>Dengan menggunakan fuzzywuzzy, kami memeriksa seberapa mirip kata-kata dari potongan dengan kueri. Hal ini mengukur tumpang tindih teks secara langsung.</p>
<ul>
<li><strong>Cakupan kata kunci</strong></li>
</ul>
<p>Kami memeriksa berapa banyak kata penting dari kueri yang muncul dalam potongan. Semakin banyak kecocokan kata kunci berarti skor yang lebih tinggi.</p>
<ul>
<li><strong>Kesamaan semantik</strong></li>
</ul>
<p>Kami menggunakan kembali skor kemiripan vektor yang dikembalikan oleh Milvus. Ini mencerminkan seberapa dekat maknanya.</p>
<ul>
<li><strong>Panjang dan peringkat asli</strong></li>
</ul>
<p>Potongan yang sangat pendek dihukum karena sering kali tidak memiliki konteks. Potongan yang memiliki peringkat lebih tinggi pada hasil asli Milvus mendapatkan bonus kecil.</p>
<ul>
<li><strong>Deteksi entitas bernama</strong></li>
</ul>
<p>Sistem mendeteksi istilah yang menggunakan huruf besar seperti "Milvus" atau "RAG" sebagai kata benda yang tepat, dan mengidentifikasi istilah teknis multi-kata sebagai frasa kunci.</p>
<p>Setiap faktor memiliki bobot dalam skor akhir (ditunjukkan pada gambar di bawah).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sistem ini tidak memerlukan data pelatihan, dan kontribusi setiap faktor dapat terlihat. Jika suatu bagian memiliki peringkat yang tinggi atau rendah secara tidak terduga, skor menjelaskan alasannya. Pemeringkat kotak hitam sepenuhnya tidak menawarkan hal itu.</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">Langkah 6: Tambahkan Tanya Jawab Multimodal untuk Bagan dan Diagram</h3><p>Makalah penelitian sering kali berisi bagan dan diagram penting yang membawa informasi yang tidak ada dalam teks. Pipeline RAG yang hanya berupa teks akan kehilangan sinyal-sinyal tersebut.  Untuk menangani hal ini, kami menambahkan fitur Tanya Jawab berbasis gambar sederhana dengan tiga bagian:</p>
<p><strong>1. Menambahkan lebih banyak konteks ke prompt</strong></p>
<p>Ketika mengirim gambar ke model, sistem juga mendapatkan teks OCR dari halaman yang sama.<br>
Prompt mencakup: gambar, teks halaman, dan pertanyaan pengguna.<br>
Hal ini membantu model memahami konteks lengkap dan mengurangi kesalahan saat membaca gambar.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Dukungan Vision API</strong></p>
<p>Klien (ernie_client.py) mendukung format visi OpenAI. Gambar dikonversi ke Base64 dan dikirim dalam format image_url, yang memungkinkan model memproses gambar dan teks secara bersamaan.</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Rencana mundur</strong></p>
<p>Jika API gambar gagal (misalnya, karena masalah jaringan atau batasan model), sistem akan beralih kembali ke RAG berbasis teks normal.<br>
Sistem ini menggunakan teks OCR untuk menjawab pertanyaan, sehingga sistem tetap bekerja tanpa gangguan.</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">Fitur UI Utama dan Implementasi untuk Pipeline<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">Cara Menangani Pembatasan dan Perlindungan Tarif API</h3><p>Ketika memanggil LLM atau menyematkan API, sistem terkadang dapat menerima kesalahan <strong>429 Terlalu Banyak Permintaan</strong>. Hal ini biasanya terjadi ketika terlalu banyak permintaan yang dikirim dalam waktu singkat.</p>
<p>Untuk menangani hal ini, proyek menambahkan mekanisme perlambatan adaptif di ernie_client.py. Jika terjadi kesalahan batas kecepatan, sistem akan secara otomatis mengurangi kecepatan permintaan dan mencoba kembali alih-alih berhenti.</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Hal ini membantu menjaga sistem tetap stabil, terutama ketika memproses dan menyematkan dokumen dalam jumlah besar.</p>
<h3 id="Custom-Styling" class="common-anchor-header">Penataan Khusus</h3><p>Frontend menggunakan Gradio (main.py). Kami menambahkan CSS khusus (modern_css) untuk membuat antarmuka yang lebih bersih dan lebih mudah digunakan.</p>
<ul>
<li><strong>Kotak masukan</strong></li>
</ul>
<p>Diubah dari gaya abu-abu default menjadi desain bulat berwarna putih. Terlihat lebih sederhana dan lebih modern.</p>
<ul>
<li><strong>Tombol kirim</strong></li>
</ul>
<p>Menambahkan warna gradien dan efek hover sehingga lebih menonjol.</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">Perenderan Rumus LaTeX</h3><p>Banyak dokumen penelitian yang berisi rumus matematika, sehingga rendering yang benar adalah penting. Kami menambahkan dukungan LaTeX penuh untuk rumus sebaris dan blok.</p>
<ul>
<li><strong>Di mana hal ini berlaku</strong>Konfigurasi ini bekerja di jendela obrolan (Chatbot) dan area ringkasan (Penurunan harga).</li>
<li><strong>Hasil praktis</strong>Baik rumus yang muncul di jawaban model atau di ringkasan dokumen, rumus tersebut dirender dengan benar di halaman.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">Kemampuan menjelaskan: Skor Relevansi dan Keyakinan</h3><p>Untuk menghindari pengalaman "kotak hitam", sistem menunjukkan dua indikator sederhana:</p>
<ul>
<li><p><strong>Relevansi</strong></p></li>
<li><p>Ditampilkan di bawah setiap jawaban di bagian "Referensi".</p></li>
<li><p>Menampilkan skor pemeringkat untuk setiap bagian yang dikutip.</p></li>
<li><p>Membantu pengguna melihat mengapa halaman atau bagian tertentu digunakan.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>Keyakinan</strong></p></li>
<li><p>Ditampilkan di panel "Rincian Analisis".</p></li>
<li><p>Berdasarkan skor bagian teratas (diskalakan hingga 100%).</p></li>
<li><p>Menunjukkan seberapa yakin sistem terhadap jawaban.</p></li>
<li><p>Jika di bawah 60%, jawabannya mungkin kurang dapat diandalkan.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Antarmuka ditampilkan di bawah ini. Di antarmuka, setiap jawaban menunjukkan nomor halaman sumber dan skor relevansinya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Akurasi RAG bergantung pada rekayasa antara LLM dan basis data vektor. Artikel ini membahas pembuatan <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> dengan <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> yang mencakup setiap tahap rekayasa tersebut:</p>
<ul>
<li><strong>Penguraian dokumen.</strong> PP-StructureV3 (melalui <a href="https://github.com/PaddlePaddle/PaddleOCR"></a><a href="https://github.com/PaddlePaddle/PaddleOCR">PaddleOCR</a>) mengonversi PDF menjadi Markdown yang bersih dengan OCR yang memperhatikan tata letak, mempertahankan judul, tabel, dan gambar yang hilang dari ekstraktor dasar.</li>
<li><strong>Pemotongan.</strong> Pemisahan jendela geser dengan tumpang tindih menjaga konteks tetap utuh pada batas-batas potongan, mencegah fragmen-fragmen yang rusak yang mengganggu pengambilan kembali.</li>
<li><strong>Menyimpan Vektor dalam Milvus.</strong> Menyimpan vektor dengan cara yang mendukung pengambilan yang cepat dan akurat.</li>
<li><strong>Pencarian hibrida.</strong> Menjalankan pencarian vektor dan pencarian kata kunci secara paralel, lalu menggabungkan hasilnya dengan RRF (Reciprocal Rank Fusion), menangkap kecocokan semantik dan istilah yang tepat yang tidak dapat ditemukan oleh salah satu metode.</li>
<li><strong>Pemeringkatan ulang.</strong> Perangking ulang berbasis aturan yang transparan memberi nilai pada setiap bagian berdasarkan kecocokan fuzzy, cakupan kata kunci, kemiripan semantik, panjang, dan deteksi kata benda yang tepat - tidak perlu data pelatihan, dan setiap nilai dapat di-debug.</li>
<li><strong>Tanya Jawab Multimodal.</strong> Memasangkan gambar dengan teks halaman OCR dalam prompt memberikan model visi konteks yang cukup untuk menjawab pertanyaan tentang bagan dan diagram, dengan fallback hanya teks jika API gambar gagal.</li>
</ul>
<p>Jika Anda sedang membangun sistem RAG untuk Tanya Jawab dokumen dan menginginkan akurasi yang lebih baik, kami ingin mendengar bagaimana Anda mendekatinya.</p>
<p>Ada pertanyaan tentang <a href="https://milvus.io/">Milvus</a>, pencarian hibrida, atau desain basis pengetahuan? Bergabunglah dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">saluran Slack</a> kami atau pesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kerja Milvus</a> selama 20 menit untuk mendiskusikan kasus penggunaan Anda.</p>
