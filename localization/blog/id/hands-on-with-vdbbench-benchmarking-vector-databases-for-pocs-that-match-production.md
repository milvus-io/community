---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >-
  Praktik Langsung dengan VDBBench: Membandingkan Basis Data Vektor untuk POC
  yang Sesuai dengan Produksi
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  Pelajari cara menguji basis data vektor dengan data produksi nyata menggunakan
  VDBBench. Panduan langkah demi langkah untuk POC dataset khusus yang
  memprediksi kinerja aktual.
cover: assets.zilliz.com/vdbbench_cover_min_2f86466839.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  VectorDBBench, POC, vector database, VDBBench, benchmarking vector database,
  how to choose a vector database
meta_title: |
  Tutorial | How to Evaluate VectorDBs that Match Production via VDBBench
origin: >-
  https://milvus.io/blog/hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
---
<p>Basis data vektor kini menjadi bagian inti dari infrastruktur AI, yang memberdayakan berbagai aplikasi yang didukung LLM untuk layanan pelanggan, pembuatan konten, pencarian, rekomendasi, dan banyak lagi.</p>
<p>Dengan banyaknya pilihan di pasar, mulai dari database vektor yang dibuat khusus seperti Milvus dan Zilliz Cloud hingga database tradisional dengan pencarian vektor sebagai tambahan, <strong>memilih yang tepat tidaklah sesederhana membaca bagan tolok ukur</strong>.</p>
<p>Sebagian besar tim menjalankan Proof of Concept (POC) sebelum berkomitmen, yang secara teori memang cerdas - tetapi dalam praktiknya, banyak tolok ukur vendor yang terlihat mengesankan di atas kertas runtuh dalam kondisi dunia nyata.</p>
<p>Salah satu alasan utamanya adalah sebagian besar klaim performa didasarkan pada dataset yang sudah ketinggalan zaman dari tahun 2006-2012 (SIFT, GloVe, LAION) yang berperilaku sangat berbeda dengan penyematan modern. Sebagai contoh, SIFT menggunakan vektor 128 dimensi, sedangkan model AI saat ini menghasilkan dimensi yang jauh lebih tinggi - 3.072 untuk OpenAI terbaru, 1.024 untuk Cohere - pergeseran besar yang berdampak pada kinerja, biaya, dan skalabilitas.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">Solusinya: Uji dengan Data Anda, Bukan Tolok Ukur Kaleng<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Solusi paling sederhana dan efektif: jalankan evaluasi POC Anda dengan vektor yang benar-benar dihasilkan oleh aplikasi Anda. Itu berarti menggunakan model penyematan Anda, kueri nyata Anda, dan distribusi data Anda yang sebenarnya.</p>
<p>Untuk itulah <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a> - alat pembanding database vektor sumber terbuka - dibuat. Alat ini mendukung evaluasi dan perbandingan basis data vektor apa pun, termasuk Milvus, Elasticsearch, pgvector, dan banyak lagi, serta mensimulasikan beban kerja produksi yang sebenarnya.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">Unduh VDBBench 1.0 →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> Lihat Papan Peringkat →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">Apa itu VDBBench</a></p>
<p>VDBbench memungkinkan Anda:</p>
<ul>
<li><p><strong>Menguji dengan data Anda sendiri</strong> dari model penyisipan Anda</p></li>
<li><p>Mensimulasikan <strong>penyisipan, kueri, dan konsumsi streaming secara bersamaan</strong></p></li>
<li><p>Mengukur <strong>latensi P95/P99, throughput berkelanjutan, dan akurasi pemanggilan</strong></p></li>
<li><p>Tolok ukur di berbagai basis data dalam kondisi yang sama</p></li>
<li><p>Memungkinkan <strong>pengujian dataset khusus</strong> sehingga hasilnya benar-benar sesuai dengan produksi</p></li>
</ul>
<p>Selanjutnya, kami akan memandu Anda tentang cara menjalankan POC tingkat produksi dengan VDBBench dan data asli Anda - sehingga Anda bisa membuat pilihan yang tepat dan tahan lama.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">Cara Mengevaluasi VectorDB dengan Dataset Kustom Anda dengan VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum memulai, pastikan Anda telah menginstal Python 3.11 atau lebih tinggi. Anda akan membutuhkan data vektor dalam format CSV atau NPY, sekitar 2-3 jam untuk penyiapan dan pengujian lengkap, dan pengetahuan Python tingkat menengah untuk pemecahan masalah jika diperlukan.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">Instalasi dan Konfigurasi</h3><p>Jika Anda mengevaluasi satu basis data, jalankan perintah ini:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>Jika Anda ingin membandingkan semua database yang didukung, jalankan perintah ini:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Untuk klien basis data tertentu (misalnya: Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>Periksa <a href="https://github.com/zilliztech/VectorDBBench">halaman GitHub</a> ini untuk mengetahui semua basis data yang didukung dan perintah instalasinya.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">Meluncurkan VDBBench</h3><p>Mulai <strong>VDBBench</strong> dengan:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran konsol yang diharapkan: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Antarmuka web akan tersedia secara lokal:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">Persiapan Data dan Konversi Format</h3><p>VDBBench membutuhkan file Parquet terstruktur dengan skema tertentu untuk memastikan pengujian yang konsisten di berbagai basis data dan set data.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nama File</strong></th><th style="text-align:center"><strong>Tujuan</strong></th><th style="text-align:center"><strong>Diperlukan</strong></th><th style="text-align:center"><strong>Contoh Konten</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">Koleksi vektor untuk penyisipan basis data</td><td style="text-align:center">✅</td><td style="text-align:center">ID vektor + data vektor (list[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">Koleksi vektor untuk kueri</td><td style="text-align:center">✅</td><td style="text-align:center">ID vektor + data vektor (list[float])</td></tr>
<tr><td style="text-align:center">tetangga.parket</td><td style="text-align:center">Kebenaran Dasar untuk vektor kueri (daftar ID tetangga terdekat yang sebenarnya)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [daftar ID serupa top_k]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">Label (metadata yang mendeskripsikan entitas selain vektor)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; label</td></tr>
</tbody>
</table>
<p>Spesifikasi File yang Diperlukan:</p>
<ul>
<li><p><strong>File Vektor Pelatihan (train.parquet)</strong> harus berisi kolom ID dengan bilangan bulat tambahan dan kolom vektor yang berisi array float32. Nama kolom dapat dikonfigurasi, tetapi kolom ID harus menggunakan tipe integer untuk pengindeksan yang tepat.</p></li>
<li><p><strong>File Vektor Uji (test.parquet)</strong> mengikuti struktur yang sama dengan data pelatihan. Nama kolom ID harus "id" sementara nama kolom vektor dapat disesuaikan agar sesuai dengan skema data Anda.</p></li>
<li><p><strong>File Kebenaran Dasar (neighbors.parquet</strong> ) berisi referensi tetangga terdekat untuk setiap kueri uji. File ini membutuhkan kolom ID yang sesuai dengan ID vektor uji dan kolom larik tetangga yang berisi ID tetangga terdekat yang benar dari set pelatihan.</p></li>
<li><p><strong>File Label Skalar (scalar_labels.parquet</strong> ) bersifat opsional dan berisi label metadata yang terkait dengan vektor pelatihan, berguna untuk pengujian pencarian yang disaring.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">Tantangan Format Data</h3><p>Sebagian besar data vektor produksi ada dalam format yang tidak secara langsung sesuai dengan persyaratan VDBBench. File CSV biasanya menyimpan penyematan sebagai representasi string dari array, file NPY berisi matriks numerik mentah tanpa metadata, dan ekspor basis data sering kali menggunakan JSON atau format terstruktur lainnya.</p>
<p>Mengonversi format-format ini secara manual melibatkan beberapa langkah rumit: mengurai representasi string menjadi larik numerik, menghitung tetangga terdekat dengan tepat menggunakan pustaka seperti FAISS, memisahkan set data dengan benar sambil mempertahankan konsistensi ID, dan memastikan semua tipe data cocok dengan spesifikasi Parket.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">Konversi Format Otomatis</h3><p>Untuk menyederhanakan proses konversi, kami telah mengembangkan skrip Python yang menangani konversi format, penghitungan kebenaran dasar, dan penataan data yang tepat secara otomatis.</p>
<p><strong>Format Masukan CSV:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>Format Masukan NPY:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">Implementasi Skrip Konversi</h3><p><strong>Instal dependensi yang diperlukan:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>Jalankan konversi:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>Referensi Parameter:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nama Parameter</strong></th><th style="text-align:center"><strong>Diperlukan</strong></th><th style="text-align:center"><strong>Tipe</strong></th><th style="text-align:center"><strong>Deskripsi</strong></th><th style="text-align:center"><strong>Nilai Default</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">Ya</td><td style="text-align:center">String</td><td style="text-align:center">Jalur data pelatihan, mendukung format CSV atau NPY. CSV harus berisi kolom emb, jika tidak ada kolom id akan dibuat secara otomatis</td><td style="text-align:center">Tidak ada</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">Ya</td><td style="text-align:center">String</td><td style="text-align:center">Jalur data kueri, mendukung format CSV atau NPY. Format sama dengan data pelatihan</td><td style="text-align:center">Tidak ada</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">Ya</td><td style="text-align:center">String</td><td style="text-align:center">Jalur direktori keluaran, menyimpan file parket yang dikonversi dan file indeks tetangga</td><td style="text-align:center">Tidak ada</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">Tidak ada</td><td style="text-align:center">String</td><td style="text-align:center">Jalur CSV label, harus berisi kolom label (diformat sebagai larik string), digunakan untuk menyimpan label</td><td style="text-align:center">Tidak ada</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">Tidak ada</td><td style="text-align:center">Integer</td><td style="text-align:center">Jumlah tetangga terdekat yang akan dikembalikan saat komputasi</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>Struktur Direktori Keluaran:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">Skrip Konversi Lengkap</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> argparse
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> faiss
<span class="hljs-keyword">from</span> ast <span class="hljs-keyword">import</span> literal_eval
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Optional</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_csv</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    df = pd.read_csv(path)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;emb&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;CSV file missing &#x27;emb&#x27; column: <span class="hljs-subst">{path}</span>&quot;</span>)
   df[<span class="hljs-string">&#x27;emb&#x27;</span>] = df[<span class="hljs-string">&#x27;emb&#x27;</span>].apply(literal_eval)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;id&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        df.insert(<span class="hljs-number">0</span>, <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(df)))
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_npy</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    arr = np.load(path)
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-built_in">range</span>(arr.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&#x27;emb&#x27;</span>: arr.tolist()
    })
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_vectors</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; pd.DataFrame:
    <span class="hljs-keyword">if</span> path.endswith(<span class="hljs-string">&#x27;.csv&#x27;</span>):
        <span class="hljs-keyword">return</span> load_csv(path)
    <span class="hljs-keyword">elif</span> path.endswith(<span class="hljs-string">&#x27;.npy&#x27;</span>):
        <span class="hljs-keyword">return</span> load_npy(path)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Unsupported file format: <span class="hljs-subst">{path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_ground_truth</span>(<span class="hljs-params">train_vectors: np.ndarray, test_vectors: np.ndarray, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    dim = train_vectors.shape[<span class="hljs-number">1</span>]
    index = faiss.IndexFlatL2(dim)
    index.add(train_vectors)
    _, indices = index.search(test_vectors, top_k)
    <span class="hljs-keyword">return</span> indices
<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_ground_truth</span>(<span class="hljs-params">df_path: <span class="hljs-built_in">str</span>, indices: np.ndarray</span>):
    df = pd.DataFrame({
        <span class="hljs-string">&quot;id&quot;</span>: np.arange(indices.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&quot;neighbors_id&quot;</span>: indices.tolist()
    })
    df.to_parquet(df_path, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Ground truth saved successfully: <span class="hljs-subst">{df_path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>(<span class="hljs-params">train_path: <span class="hljs-built_in">str</span>, test_path: <span class="hljs-built_in">str</span>, output_dir: <span class="hljs-built_in">str</span>,
         label_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
    <span class="hljs-comment"># Load training and query data</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading training data...&quot;</span>)
    train_df = load_vectors(train_path)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading query data...&quot;</span>)
    test_df = load_vectors(test_path)
    <span class="hljs-comment"># Extract vectors and convert to numpy</span>
    train_vectors = np.array(train_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    test_vectors = np.array(test_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    <span class="hljs-comment"># Save parquet files retaining all fields</span>
    train_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;train.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ train.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(train_df)}</span> records total&quot;</span>)
    test_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;test.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ test.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(test_df)}</span> records total&quot;</span>)
    <span class="hljs-comment"># Compute ground truth</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔍 Computing Ground Truth (nearest neighbors)...&quot;</span>)
    gt_indices = compute_ground_truth(train_vectors, test_vectors, top_k=top_k)
    save_ground_truth(os.path.join(output_dir, <span class="hljs-string">&#x27;neighbors.parquet&#x27;</span>), gt_indices)
    <span class="hljs-comment"># Load and save label file (if provided)</span>
    <span class="hljs-keyword">if</span> label_path:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading label file...&quot;</span>)
        label_df = pd.read_csv(label_path)
        <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;labels&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> label_df.columns:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Label file must contain &#x27;labels&#x27; column&quot;</span>)
        label_df[<span class="hljs-string">&#x27;labels&#x27;</span>] = label_df[<span class="hljs-string">&#x27;labels&#x27;</span>].apply(literal_eval)
        label_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;scalar_labels.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Label file saved as scalar_labels.parquet&quot;</span>)

<span class="hljs-keyword">if</span> 
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    parser = argparse.ArgumentParser(description=<span class="hljs-string">&quot;Convert CSV/NPY vectors to VectorDBBench data format (retaining all columns)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--train&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Training data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--test&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Query data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--out&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Output directory&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--labels&quot;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Label CSV path (optional)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--topk&quot;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span>, default=<span class="hljs-number">10</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Ground truth&quot;</span>)
    args = parser.parse_args()
    main(args.train, args.test, args.out, args.labels, args.topk)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Keluaran Proses Konversi:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Verifikasi File yang Dihasilkan:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">Konfigurasi Dataset Khusus</h3><p>Buka bagian Konfigurasi Dataset Khusus di antarmuka web:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Antarmuka konfigurasi menyediakan bidang untuk metadata dataset dan spesifikasi jalur file:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parameter Konfigurasi:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nama Parameter</strong></th><th style="text-align:center"><strong>Arti</strong></th><th style="text-align:center"><strong>Saran Konfigurasi</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Nama</td><td style="text-align:center">Nama dataset (pengenal unik)</td><td style="text-align:center">Nama apa saja, misalnya, <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">Jalur Folder</td><td style="text-align:center">Jalur direktori file dataset</td><td style="text-align:center">misalnya <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">redup</td><td style="text-align:center">Dimensi vektor</td><td style="text-align:center">Harus sesuai dengan file data, misalnya, 768</td></tr>
<tr><td style="text-align:center">ukuran</td><td style="text-align:center">Jumlah vektor (opsional)</td><td style="text-align:center">Dapat dikosongkan, sistem akan mendeteksi secara otomatis</td></tr>
<tr><td style="text-align:center">Jenis metrik</td><td style="text-align:center">Metode pengukuran kesamaan</td><td style="text-align:center">Umumnya menggunakan L2 (jarak Euclidean) atau IP (inner product)</td></tr>
<tr><td style="text-align:center">nama file pelatihan</td><td style="text-align:center">Nama file set pelatihan (tanpa ekstensi .parquet)</td><td style="text-align:center">Jika <code translate="no">train.parquet</code>, isi <code translate="no">train</code>. Beberapa file menggunakan pemisahan koma, mis, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">nama file uji coba</td><td style="text-align:center">Nama file set kueri (tanpa ekstensi .parquet)</td><td style="text-align:center">Jika <code translate="no">test.parquet</code>, isi <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">nama file kebenaran dasar</td><td style="text-align:center">Nama file Ground Truth (tanpa ekstensi .parquet)</td><td style="text-align:center">Jika <code translate="no">neighbors.parquet</code>, isi <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">nama id data latih</td><td style="text-align:center">Nama kolom ID data pelatihan</td><td style="text-align:center">Biasanya <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">nama emb train</td><td style="text-align:center">Nama kolom vektor data pelatihan</td><td style="text-align:center">Jika nama kolom yang dihasilkan skrip adalah <code translate="no">emb</code>, isi <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">nama emb uji</td><td style="text-align:center">Nama kolom vektor data uji</td><td style="text-align:center">Biasanya sama dengan nama train emb, mis, <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">nama emb kebenaran tanah</td><td style="text-align:center">Nama kolom tetangga terdekat di Ground Truth</td><td style="text-align:center">Jika nama kolom adalah <code translate="no">neighbors_id</code>, isi <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">nama file label skalar</td><td style="text-align:center">(Opsional) Nama file label (tanpa ekstensi .parket)</td><td style="text-align:center">Jika <code translate="no">scalar_labels.parquet</code> dibuat, isi <code translate="no">scalar_labels</code>, jika tidak, biarkan kosong</td></tr>
<tr><td style="text-align:center">persentase label</td><td style="text-align:center">(Opsional) Rasio filter label</td><td style="text-align:center">misalnya, <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, biarkan kosong jika tidak ada pemfilteran label yang diperlukan</td></tr>
<tr><td style="text-align:center">deskripsi</td><td style="text-align:center">Deskripsi set data</td><td style="text-align:center">Tidak dapat mencatat konteks bisnis atau metode pembuatan</td></tr>
</tbody>
</table>
<p>Simpan konfigurasi untuk melanjutkan penyiapan pengujian.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">Eksekusi Tes dan Konfigurasi Basis Data</h3><p>Mengakses antarmuka konfigurasi pengujian:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Pemilihan dan Konfigurasi Basis Data (Milvus sebagai Contoh):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Penetapan Dataset:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Uji Metadata dan Pelabelan:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Eksekusi Tes:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">Analisis Hasil dan Evaluasi Kinerja<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Antarmuka hasil menyediakan analisis performa yang komprehensif:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">Ringkasan Konfigurasi Pengujian</h3><p>Evaluasi menguji tingkat konkurensi 1, 5, dan 10 operasi bersamaan (dibatasi oleh sumber daya perangkat keras yang tersedia), dimensi vektor 768, ukuran set data 3.000 vektor pelatihan dan 3.000 kueri pengujian, dengan pemfilteran label skalar yang dinonaktifkan untuk uji coba ini.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">Pertimbangan Implementasi yang Penting</h3><ul>
<li><p><strong>Konsistensi Dimensi:</strong> Ketidaksesuaian dimensi vektor antara dataset pelatihan dan pengujian akan menyebabkan kegagalan pengujian secara langsung. Verifikasi keselarasan dimensi selama persiapan data untuk menghindari kesalahan runtime.</p></li>
<li><p><strong>Akurasi Kebenaran Dasar:</strong> Perhitungan kebenaran dasar yang salah akan membatalkan pengukuran tingkat recall. Skrip konversi yang disediakan menggunakan FAISS dengan jarak L2 untuk penghitungan tetangga terdekat yang tepat, memastikan hasil referensi yang akurat.</p></li>
<li><p><strong>Persyaratan Skala Dataset:</strong> Dataset kecil (di bawah 10.000 vektor) dapat menghasilkan pengukuran QPS yang tidak konsisten karena pembangkitan beban yang tidak memadai. Pertimbangkan untuk menskalakan ukuran dataset untuk pengujian throughput yang lebih andal.</p></li>
<li><p><strong>Alokasi Sumber Daya:</strong> Memori kontainer Docker dan batasan CPU dapat membatasi kinerja database secara artifisial selama pengujian. Pantau pemanfaatan sumber daya dan sesuaikan batas kontainer sesuai kebutuhan untuk pengukuran performa yang akurat.</p></li>
<li><p><strong>Pemantauan Kesalahan:</strong> <strong>VDBBench</strong> dapat mencatat kesalahan pada output konsol yang tidak muncul di antarmuka web. Pantau log terminal selama eksekusi pengujian untuk informasi diagnostik yang lengkap.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">Alat Tambahan: Pembuatan Data Uji<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk pengembangan dan skenario pengujian standar, Anda dapat membuat set data sintetis dengan karakteristik yang terkontrol:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_csv</span>(<span class="hljs-params">num_records: <span class="hljs-built_in">int</span>, dim: <span class="hljs-built_in">int</span>, filename: <span class="hljs-built_in">str</span></span>):
    ids = <span class="hljs-built_in">range</span>(num_records)
    vectors = np.random.rand(num_records, dim).<span class="hljs-built_in">round</span>(<span class="hljs-number">6</span>) 
    emb_str = [<span class="hljs-built_in">str</span>(<span class="hljs-built_in">list</span>(vec)) <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> vectors]
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: ids,
        <span class="hljs-string">&#x27;emb&#x27;</span>: emb_str
    })
    df.to_csv(filename, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generated file <span class="hljs-subst">{filename}</span>, <span class="hljs-subst">{num_records}</span> records total, vector dimension <span class="hljs-subst">{dim}</span>&quot;</span>)
<span class="hljs-keyword">if</span>
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    num_records = <span class="hljs-number">3000</span>  <span class="hljs-comment"># Number of records to generate</span>
    dim = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension</span>

    generate_csv(num_records, dim, <span class="hljs-string">&quot;train.csv&quot;</span>)
    generate_csv(num_records, dim, <span class="hljs-string">&quot;test.csv&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Utilitas ini menghasilkan dataset dengan dimensi dan jumlah rekaman tertentu untuk skenario pembuatan prototipe dan pengujian dasar.</p>
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
    </button></h2><p>Anda baru saja belajar cara membebaskan diri dari "teater benchmark" yang menyesatkan banyak keputusan database vektor. Dengan VDBBench dan dataset Anda sendiri, Anda dapat menghasilkan metrik QPS, latensi, dan recall tingkat produksi - tidak perlu lagi menebak-nebak dari data akademis yang sudah berusia puluhan tahun.</p>
<p>Berhentilah mengandalkan tolok ukur kalengan yang tidak ada hubungannya dengan beban kerja Anda yang sebenarnya. Hanya dalam hitungan jam-bukan minggu-Anda akan melihat dengan tepat bagaimana kinerja database dengan vektor, kueri, dan batasan <em>Anda</em>. Itu berarti Anda bisa membuat keputusan dengan percaya diri, menghindari penulisan ulang yang menyakitkan di kemudian hari, dan mengirimkan sistem yang benar-benar berfungsi dalam produksi.</p>
<ul>
<li><p>Coba VDBBench dengan beban kerja Anda: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>Melihat hasil pengujian database vektor utama: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">Papan Peringkat VDBBench</a></p></li>
</ul>
<p>Ada pertanyaan atau ingin membagikan hasil pengujian Anda? Bergabunglah dengan percakapan di<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> atau terhubung dengan komunitas kami di <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>Ini adalah tulisan pertama dari seri Panduan POC VectorDB kami-metode praktis dan teruji oleh pengembang untuk membangun infrastruktur AI yang berkinerja di bawah tekanan dunia nyata. Nantikan artikel selanjutnya!</em></p>
