---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: >-
  Gemini 3 Pro + Milvus: Membangun RAG yang Lebih Kuat Dengan Penalaran Tingkat
  Lanjut dan Kekuatan Multimodal
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Pelajari pembaruan inti di Gemini 3 Pro, lihat bagaimana kinerjanya pada tolok
  ukur utama, dan ikuti panduan untuk membangun pipeline RAG berkinerja tinggi
  dengan Milvus.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>Google Gemini 3 Pro mendarat dengan jenis rilis langka yang benar-benar mengubah ekspektasi pengembang - bukan hanya hype, tetapi kemampuan yang secara material memperluas apa yang dapat dilakukan antarmuka bahasa alami. Ini mengubah "mendeskripsikan aplikasi yang Anda inginkan" menjadi alur kerja yang dapat dieksekusi: perutean alat yang dinamis, perencanaan multi-langkah, orkestrasi API, dan pembuatan UX interaktif yang semuanya disatukan dengan mulus. Ini adalah model yang paling dekat dengan model mana pun yang membuat vibe coding terasa layak untuk produksi.</p>
<p>Dan angka-angkanya mendukung narasinya. Gemini 3 Pro membukukan hasil yang luar biasa di hampir semua tolok ukur utama:</p>
<ul>
<li><p><strong>Humanity's Last Exam:</strong> 37,5% tanpa alat, 45,8% dengan alat - pesaing terdekat berada di angka 26,5%.</p></li>
<li><p><strong>MathArena Apex:</strong> 23,4%, sementara sebagian besar model gagal menembus angka 2%.</p></li>
<li><p><strong>ScreenSpot-Pro:</strong> Akurasi 72,7%, hampir dua kali lipat dari yang terbaik berikutnya, yaitu 36,2%.</p></li>
<li><p><strong>Vending-Bench 2:</strong> Nilai bersih rata-rata sebesar <strong>$5.478,16</strong>, sekitar <strong>1,4 kali lipat</strong> di atas posisi kedua.</p></li>
</ul>
<p>Lihat tabel di bawah ini untuk hasil benchmark lainnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kombinasi penalaran yang mendalam, penggunaan alat yang kuat, dan kefasihan multimodal membuat Gemini 3 Pro cocok untuk generasi retrieval-augmented (RAG). Pasangkan dengan <a href="https://milvus.io/"><strong>Milvus</strong></a>, database vektor sumber terbuka berkinerja tinggi yang dibuat untuk pencarian semantik skala miliaran, dan Anda akan mendapatkan lapisan pengambilan yang mendasarkan respons, menskalakan dengan bersih, dan tetap dapat diandalkan dalam produksi, bahkan dalam beban kerja yang berat.</p>
<p>Dalam posting ini, kami akan menjelaskan apa yang baru di Gemini 3 Pro, mengapa Gemini 3 Pro meningkatkan alur kerja RAG, dan cara membangun pipeline RAG yang bersih dan efisien menggunakan Milvus sebagai tulang punggung pencarian Anda.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Peningkatan Utama di Gemini 3 Pro<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro memperkenalkan serangkaian peningkatan substansial yang membentuk kembali cara model menalar, membuat, menjalankan tugas, dan berinteraksi dengan pengguna. Peningkatan ini terbagi dalam empat area kemampuan utama:</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">Pemahaman dan Penalaran Multimodal</h3><p>Gemini 3 Pro menetapkan rekor baru di seluruh tolok ukur multimodal yang penting, termasuk ARC-AGI-2 untuk penalaran visual, MMMU-Pro untuk pemahaman lintas modal, dan Video-MMMU untuk pemahaman video dan akuisisi pengetahuan. Model ini juga memperkenalkan Deep Think, mode penalaran yang diperluas yang memungkinkan pemrosesan logis multi-langkah yang terstruktur. Hal ini menghasilkan akurasi yang jauh lebih tinggi pada masalah yang kompleks di mana model rantai pemikiran tradisional cenderung gagal.</p>
<h3 id="Code-Generation" class="common-anchor-header">Pembuatan Kode</h3><p>Model ini membawa pengkodean generatif ke tingkat yang baru. Gemini 3 Pro dapat menghasilkan SVG interaktif, aplikasi web lengkap, adegan 3D, dan bahkan game fungsional - termasuk lingkungan seperti Minecraft dan biliar berbasis browser - semuanya dari satu prompt bahasa alami. Manfaat pengembangan front-end terutama: model ini dapat membuat ulang desain UI yang sudah ada dengan ketepatan tinggi atau menerjemahkan tangkapan layar langsung ke dalam kode siap produksi, sehingga membuat UI berulang bekerja lebih cepat secara dramatis.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">Agen AI dan Penggunaan Alat</h3><p>Dengan izin pengguna, Gemini 3 Pro dapat mengakses data dari perangkat Google pengguna untuk melakukan tugas-tugas jangka panjang dan multi-langkah seperti merencanakan perjalanan atau memesan mobil sewaan. Kemampuan agen ini tercermin dalam kinerjanya yang kuat pada <strong>Vending-Bench 2</strong>, sebuah benchmark yang dirancang khusus untuk menguji penggunaan alat cakrawala panjang. Model ini juga mendukung alur kerja agen tingkat profesional, termasuk menjalankan perintah terminal dan berinteraksi dengan alat eksternal melalui API yang terdefinisi dengan baik.</p>
<h3 id="Generative-UI" class="common-anchor-header">UI Generatif</h3><p>Gemini 3 Pro bergerak melewati model satu pertanyaan-satu-jawaban konvensional dan memperkenalkan <strong>UI generatif</strong>, di mana model ini dapat membangun seluruh pengalaman interaktif secara dinamis. Alih-alih mengembalikan teks statis, model ini dapat menghasilkan antarmuka yang sepenuhnya disesuaikan - misalnya, perencana perjalanan yang kaya dan dapat disesuaikan - secara langsung sebagai respons terhadap instruksi pengguna. Hal ini menggeser LLM dari perespon pasif menjadi generator antarmuka aktif.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Menguji Gemini 3 Pro<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Di luar hasil benchmark, kami melakukan serangkaian pengujian langsung untuk memahami bagaimana Gemini 3 Pro berperilaku dalam alur kerja yang sesungguhnya. Hasilnya menyoroti bagaimana penalaran multimodal, kemampuan generatif, dan perencanaan jangka panjangnya diterjemahkan ke dalam nilai praktis bagi para pengembang.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">Pemahaman multimodal</h3><p>Gemini 3 Pro menunjukkan keserbagunaan yang mengesankan di seluruh teks, gambar, video, dan kode. Dalam pengujian kami, kami mengunggah video Zilliz langsung dari YouTube. Model ini memproses seluruh klip - termasuk narasi, transisi, dan teks di layar - dalam waktu kurang lebih <strong>40 detik</strong>, perputaran yang sangat cepat untuk konten multimodal berdurasi panjang.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Evaluasi internal Google menunjukkan perilaku yang serupa: Gemini 3 Pro menangani resep tulisan tangan dalam berbagai bahasa, menyalin dan menerjemahkannya, serta menyusunnya menjadi buku resep keluarga yang dapat dibagikan.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">Tugas Tanpa Jepretan</h3><p>Gemini 3 Pro dapat menghasilkan UI web yang sepenuhnya interaktif tanpa contoh atau perancah sebelumnya. Ketika diminta untuk membuat <strong>game web pesawat ruang angkasa 3D</strong> retro-futuristik yang dipoles, model ini menghasilkan pemandangan interaktif yang lengkap: kisi-kisi neon-ungu, kapal bergaya cyberpunk, efek partikel yang bercahaya, dan kontrol kamera yang halus - semuanya dalam satu respons tanpa jepretan.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">Perencanaan Tugas yang Kompleks</h3><p>Model ini juga menunjukkan perencanaan tugas jangka panjang yang lebih kuat daripada kebanyakan model lainnya. Dalam pengujian pengaturan kotak masuk kami, Gemini 3 Pro berperilaku seperti asisten administratif AI: mengkategorikan email yang berantakan ke dalam ember proyek, menyusun saran yang dapat ditindaklanjuti (balas, tindak lanjuti, arsipkan), dan menyajikan ringkasan yang bersih dan terstruktur. Dengan rencana model yang telah disusun, seluruh kotak masuk dapat dibersihkan dengan satu klik konfirmasi.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen width="100%" height="400"></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Cara Membangun Sistem RAG dengan Gemini 3 Pro dan Milvus<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Penalaran Gemini 3 Pro yang telah ditingkatkan, pemahaman multimodal, dan kemampuan penggunaan alat yang kuat menjadikannya fondasi yang sangat baik untuk sistem RAG berkinerja tinggi.</p>
<p>Ketika dipasangkan dengan <a href="https://milvus.io/"><strong>Milvus</strong></a>, basis data vektor sumber terbuka berkinerja tinggi yang dibuat untuk pencarian semantik berskala besar, Anda akan mendapatkan pembagian tanggung jawab yang jelas: Gemini 3 Pro menangani <strong>interpretasi, penalaran, dan pembangkitan</strong>, sementara Milvus menyediakan <strong>lapisan pengambilan</strong> yang <strong>cepat dan dapat diskalakan</strong> yang membuat respons tetap berpijak pada data perusahaan Anda. Pasangan ini sangat cocok untuk aplikasi tingkat produksi seperti basis pengetahuan internal, asisten dokumen, kopilot dukungan pelanggan, dan sistem pakar khusus domain.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><p>Sebelum membangun pipeline RAG Anda, pastikan pustaka Python inti ini telah diinstal atau ditingkatkan ke versi terbarunya:</p>
<ul>
<li><p><strong>pymilvus</strong> - Milvus Python SDK resmi</p></li>
<li><p><strong>google-generativeai</strong> - pustaka klien Gemini 3 Pro</p></li>
<li><p><strong>request</strong> - untuk menangani panggilan HTTP jika diperlukan</p></li>
<li><p><strong>tqdm</strong> - untuk bilah kemajuan selama konsumsi dataset</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Selanjutnya, masuk ke <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a> untuk mendapatkan kunci API Anda.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">Mempersiapkan Dataset</h3><p>Untuk tutorial ini, kita akan menggunakan bagian FAQ dari dokumentasi Milvus 2.4.x sebagai basis pengetahuan pribadi untuk sistem RAG kita.</p>
<p>Unduh arsip dokumentasi dan ekstrak ke dalam sebuah folder bernama <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Muat semua berkas penurunan harga dari jalur <code translate="no">milvus_docs/en/faq</code>. Untuk setiap dokumen, kami menerapkan pemisahan sederhana berdasarkan judul <code translate="no">#</code> untuk memisahkan secara kasar bagian utama dalam setiap file Markdown.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">LLM dan Penyiapan Model Penyematan</h3><p>Untuk tutorial ini, kita akan menggunakan <code translate="no">gemini-3-pro-preview</code> sebagai LLM dan <code translate="no">text-embedding-004</code> sebagai model penyematan.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Tanggapan model: Saya Gemini, sebuah model bahasa besar yang dibangun oleh Google.</p>
<p>Anda dapat melakukan pemeriksaan cepat dengan membuat embedding uji dan mencetak dimensinya bersama dengan beberapa nilai pertama:</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran vektor uji:</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Memuat Data ke dalam Milvus</h3><p><strong>Membuat Koleksi</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ketika membuat <code translate="no">MilvusClient</code>, Anda dapat memilih dari tiga opsi konfigurasi, tergantung pada skala dan lingkungan Anda:</p>
<ul>
<li><p><strong>Mode Lokal (Milvus Lite):</strong> Atur URI ke jalur file lokal (misalnya, <code translate="no">./milvus.db</code>). Ini adalah cara termudah untuk memulai - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> akan secara otomatis menyimpan semua data dalam file tersebut.</p></li>
<li><p><strong>Milvus yang dihosting sendiri (Docker atau Kubernetes):</strong> Untuk kumpulan data yang lebih besar atau beban kerja produksi, jalankan Milvus di Docker atau Kubernetes. Tetapkan URI ke titik akhir server Milvus Anda, seperti <code translate="no">http://localhost:19530</code>.</p></li>
<li><p><strong>Zilliz Cloud (layanan Milvus yang dikelola sepenuhnya):</strong> Jika Anda lebih memilih solusi terkelola, gunakan Zilliz Cloud. Atur URI ke Titik Akhir Publik Anda dan berikan kunci API Anda sebagai token autentikasi.</p></li>
</ul>
<p>Sebelum membuat koleksi baru, periksa terlebih dahulu apakah koleksi tersebut sudah ada. Jika sudah ada, hapus dan buat ulang untuk memastikan penyiapan yang bersih.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Buat koleksi baru dengan parameter yang ditentukan.</p>
<p>Jika tidak ada skema yang disediakan, Milvus secara otomatis membuat bidang ID default sebagai kunci utama dan bidang vektor untuk menyimpan penyematan. Milvus juga menyediakan bidang dinamis JSON yang dicadangkan, yang menangkap setiap bidang tambahan yang tidak didefinisikan dalam skema.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Menyisipkan Data</strong></p>
<p>Lakukan iterasi pada setiap entri teks, hasilkan vektor penyematannya, dan sisipkan data ke dalam Milvus. Pada contoh ini, kita menyertakan bidang tambahan bernama <code translate="no">text</code>. Karena field ini tidak didefinisikan sebelumnya di dalam skema, Milvus secara otomatis menyimpannya menggunakan field JSON dinamis di bawahnya - tidak perlu pengaturan tambahan.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Contoh keluaran:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">Membangun Alur Kerja RAG</h3><p><strong>Mengambil Data yang Relevan</strong></p>
<p>Untuk menguji pengambilan data, kami mengajukan pertanyaan umum tentang Milvus.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Telusuri koleksi untuk pertanyaan tersebut dan kembalikan 3 hasil teratas yang paling relevan.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Hasilnya dikembalikan dalam urutan kemiripan, dari yang paling mirip hingga yang paling tidak mirip.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Hasilkan Tanggapan RAG dengan LLM</strong></p>
<p>Setelah mengambil dokumen, ubahlah menjadi format string</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Berikan LLM dengan perintah sistem dan perintah pengguna, keduanya dibuat dari dokumen yang diambil dari Milvus.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Gunakan model <code translate="no">gemini-3-pro-preview</code> bersama dengan prompt ini untuk menghasilkan respons akhir.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Dari hasil keluarannya, Anda dapat melihat bahwa Gemini 3 Pro menghasilkan jawaban yang jelas dan terstruktur dengan baik berdasarkan informasi yang diambil.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Catatan</strong>: Gemini 3 Pro saat ini tidak tersedia untuk pengguna tingkat gratis. Klik <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">di sini</a> untuk informasi lebih lanjut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anda dapat mengaksesnya melalui <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">Satu Hal Lagi: Pengkodean Getaran dengan Google Antigravity<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Bersamaan dengan Gemini 3 Pro, Google memperkenalkan <a href="https://antigravity.google/"><strong>Google Antigravity</strong></a>, sebuah platform pengkodean video yang berinteraksi secara mandiri dengan editor, terminal, dan browser Anda. Tidak seperti alat bantuan AI sebelumnya yang menangani instruksi satu kali, Antigravity beroperasi pada tingkat yang berorientasi pada tugas - memungkinkan pengembang untuk menentukan <em>apa</em> yang ingin mereka buat sementara sistem mengatur <em>caranya</em>, mengatur alur kerja lengkap dari ujung ke ujung.</p>
<p>Alur kerja pengkodean AI tradisional biasanya menghasilkan potongan-potongan yang terisolasi yang masih harus ditinjau, diintegrasikan, di-debug, dan dijalankan secara manual oleh pengembang. Antigravitasi mengubah dinamika itu. Anda cukup mendeskripsikan tugas - misalnya, <em>"Buat game interaksi hewan peliharaan sederhana</em> " - dan sistem akan menguraikan permintaan, membuat kode, menjalankan perintah terminal, membuka browser untuk menguji hasilnya, dan mengulanginya hingga berhasil. Hal ini meningkatkan AI dari mesin pelengkapan otomatis yang pasif menjadi mitra teknik yang aktif - yang mempelajari preferensi Anda dan beradaptasi dengan gaya pengembangan pribadi Anda dari waktu ke waktu.</p>
<p>Ke depannya, ide tentang agen yang berkoordinasi langsung dengan database bukanlah hal yang mengada-ada. Dengan pemanggilan alat melalui MCP, AI pada akhirnya dapat membaca dari basis data Milvus, mengumpulkan basis pengetahuan, dan bahkan memelihara jalur pengambilannya sendiri secara mandiri. Dalam banyak hal, pergeseran ini bahkan lebih signifikan daripada peningkatan model itu sendiri: begitu AI dapat mengambil deskripsi tingkat produk dan mengubahnya menjadi urutan tugas yang dapat dieksekusi, upaya manusia secara alami bergeser ke arah mendefinisikan tujuan, kendala, dan seperti apa "kebenaran" itu - pemikiran tingkat yang lebih tinggi yang benar-benar mendorong pengembangan produk.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">Siap Membangun?<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda siap untuk mencobanya, ikuti tutorial langkah demi langkah kami dan buat sistem RAG dengan <strong>Gemini 3 Pro + Milvus</strong> hari ini.</p>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
