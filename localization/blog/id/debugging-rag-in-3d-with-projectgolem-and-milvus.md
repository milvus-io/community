---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: >-
  Bagaimana Jika Anda Dapat Mengetahui Mengapa RAG Gagal? Men-debug RAG dalam 3D
  dengan Project_Golem dan Milvus
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Pelajari bagaimana Project_Golem dan Milvus membuat sistem RAG dapat diamati
  dengan memvisualisasikan ruang vektor, men-debug kesalahan pengambilan, dan
  menskalakan pencarian vektor secara real-time.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>Ketika pencarian RAG tidak berhasil, Anda biasanya tahu bahwa itu rusak - dokumen yang relevan tidak muncul, atau dokumen yang tidak relevan muncul. Tetapi mencari tahu mengapa adalah cerita yang berbeda. Yang harus Anda kerjakan adalah skor kemiripan dan daftar hasil yang datar. Tidak ada cara untuk melihat bagaimana dokumen sebenarnya diposisikan dalam ruang vektor, bagaimana potongan-potongan berhubungan satu sama lain, atau di mana kueri Anda mendarat relatif terhadap konten yang seharusnya dicocokkan. Dalam praktiknya, ini berarti debugging RAG sebagian besar bersifat coba-coba: mengubah strategi chunking, menukar model penyematan, menyesuaikan top-k, dan berharap hasilnya membaik.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> adalah alat sumber terbuka yang membuat ruang vektor terlihat. Alat ini menggunakan UMAP untuk memproyeksikan embedding dimensi tinggi ke dalam 3D dan Three.js untuk merendernya secara interaktif di browser. Alih-alih menebak-nebak mengapa pengambilan gagal, Anda bisa melihat bagaimana potongan-potongan mengelompok secara semantik, di mana kueri Anda mendarat, dan dokumen mana yang diambil - semua dalam satu antarmuka visual.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ini luar biasa. Namun, Project_Golem yang asli dirancang untuk demo kecil, bukan sistem dunia nyata. Ini bergantung pada file datar, pencarian brute-force, dan pembangunan ulang set data penuh - yang berarti cepat rusak saat data Anda bertambah lebih dari beberapa ribu dokumen.</p>
<p>Untuk menjembatani kesenjangan itu, kami mengintegrasikan Project_Golem dengan <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (khususnya versi 2.6.8) sebagai tulang punggung vektornya. Milvus adalah basis data vektor berkinerja tinggi bersumber terbuka yang menangani pemasukan secara real-time, pengindeksan yang dapat diskalakan, dan pengambilan tingkat milidetik, sementara Project_Golem tetap fokus pada apa yang dilakukannya dengan sebaik-baiknya: membuat perilaku pengambilan vektor terlihat. Bersama-sama, mereka mengubah visualisasi 3D dari demo mainan menjadi alat debugging praktis untuk sistem RAG produksi.</p>
<p>Dalam tulisan ini, kita akan membahas Project_Golem dan menunjukkan bagaimana kami mengintegrasikannya dengan Milvus untuk membuat perilaku pencarian vektor dapat diamati, dapat diskalakan, dan siap untuk produksi.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">Apa itu Project_Golem?<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>Debugging RAG sulit dilakukan karena alasan yang sederhana: ruang vektor berdimensi tinggi, dan manusia tidak dapat melihatnya.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> adalah alat berbasis browser yang memungkinkan Anda melihat ruang vektor tempat sistem RAG Anda beroperasi. Alat ini mengambil embedding dimensi tinggi yang mendorong pengambilan - biasanya 768 atau 1536 dimensi - dan memproyeksikannya ke dalam adegan 3D interaktif yang dapat Anda jelajahi secara langsung.</p>
<p>Inilah cara kerjanya di balik layar:</p>
<ul>
<li>Pengurangan dimensi dengan UMAP. Project_Golem menggunakan UMAP untuk memampatkan vektor dimensi tinggi menjadi tiga dimensi dengan tetap mempertahankan jarak relatifnya. Potongan-potongan yang secara semantik mirip dalam ruang asli tetap berdekatan dalam proyeksi 3D; potongan yang tidak terkait akhirnya berjauhan.</li>
<li>Rendering 3D dengan Three.js. Setiap potongan dokumen muncul sebagai simpul dalam adegan 3D yang dirender di browser. Anda dapat memutar, memperbesar, dan menjelajahi ruang untuk melihat bagaimana dokumen Anda mengelompok - topik mana yang mengelompok dengan rapat, mana yang tumpang tindih, dan di mana batas-batasnya.</li>
<li>Penyorotan waktu kueri. Saat Anda menjalankan kueri, pengambilan masih terjadi di ruang dimensi tinggi asli menggunakan kemiripan kosinus. Namun, setelah hasilnya kembali, potongan yang diambil akan menyala dalam tampilan 3D. Anda dapat segera melihat di mana kueri Anda mendarat relatif terhadap hasil - dan sama pentingnya, relatif terhadap dokumen yang tidak diambil.</li>
</ul>
<p>Inilah yang membuat Project_Golem berguna untuk debugging. Daripada menatap daftar peringkat hasil dan menebak-nebak mengapa dokumen yang relevan terlewatkan, Anda dapat melihat apakah dokumen tersebut berada di klaster yang jauh (masalah penyematan), tumpang tindih dengan konten yang tidak relevan (masalah pemotongan), atau hampir tidak berada di luar ambang batas pengambilan (masalah konfigurasi). Tampilan 3D mengubah skor kemiripan abstrak menjadi hubungan spasial yang dapat Anda pikirkan.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Mengapa Project_Golem Tidak Siap Produksi<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golem dirancang sebagai prototipe visualisasi, dan berfungsi dengan baik untuk itu. Tetapi arsitekturnya membuat asumsi yang cepat rusak dalam skala besar - dengan cara yang penting jika Anda ingin menggunakannya untuk debugging RAG di dunia nyata.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">Setiap Pembaruan Membutuhkan Pembangunan Ulang Penuh</h3><p>Ini adalah batasan yang paling mendasar. Dalam desain aslinya, menambahkan dokumen baru memicu pembangunan ulang pipeline secara menyeluruh: penyematan dibuat ulang dan ditulis ke file .npy, UMAP dijalankan ulang di seluruh dataset, dan koordinat 3D diekspor ulang sebagai JSON.</p>
<p>Bahkan pada 100.000 dokumen, menjalankan UMAP inti tunggal membutuhkan waktu 5-10 menit. Pada skala jutaan dokumen, hal ini menjadi tidak praktis sama sekali. Anda tidak dapat menggunakan ini untuk kumpulan data yang terus berubah - umpan berita, dokumentasi, percakapan pengguna - karena setiap pembaruan berarti menunggu siklus pemrosesan ulang penuh.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">Pencarian Brute-Force Tidak Berskala</h3><p>Sisi pencarian memiliki batasnya sendiri. Implementasi aslinya menggunakan NumPy untuk pencarian kesamaan kosinus secara brute-force - kompleksitas waktu linier, tanpa pengindeksan. Pada kumpulan data jutaan dokumen, satu kueri bisa memakan waktu lebih dari satu detik. Itu tidak dapat digunakan untuk sistem interaktif atau online apa pun.</p>
<p>Tekanan memori menambah masalah. Setiap vektor float32 berukuran 768 dimensi membutuhkan sekitar 3 KB, sehingga kumpulan data jutaan vektor membutuhkan lebih dari 3 GB memori - semuanya dimuat ke dalam larik NumPy datar tanpa struktur indeks untuk mengefisienkan pencarian.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">Tanpa Pemfilteran Metadata, Tanpa Multi-Penyewaan</h3><p>Dalam sistem RAG yang sebenarnya, kemiripan vektor jarang sekali menjadi satu-satunya kriteria pencarian. Anda hampir selalu perlu memfilter berdasarkan metadata, seperti jenis dokumen, stempel waktu, izin pengguna, atau batasan tingkat aplikasi. Sistem RAG dukungan pelanggan, misalnya, perlu membatasi pencarian pada dokumen penyewa tertentu - bukan mencari di seluruh data semua orang.</p>
<p>Project_Golem tidak mendukung semua ini. Tidak ada indeks ANN (seperti HNSW atau IVF), tidak ada pemfilteran skalar, tidak ada isolasi penyewa, dan tidak ada pencarian hibrida. Ini adalah lapisan visualisasi tanpa mesin pengambilan produksi di bawahnya.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">Bagaimana Milvus Memberdayakan Lapisan Retrieval Project_Golem<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Bagian sebelumnya mengidentifikasi tiga kesenjangan: pembangunan ulang penuh pada setiap pembaruan, pencarian brute-force, dan tidak ada pengambilan yang sadar metadata. Ketiganya berasal dari akar masalah yang sama - Project_Golem tidak memiliki lapisan basis data. Pengambilan, penyimpanan, dan visualisasi terjalin dalam satu pipeline, sehingga mengubah bagian mana pun akan memaksa untuk membangun ulang semuanya.</p>
<p>Perbaikannya bukan untuk mengoptimalkan pipeline itu. Perbaikannya adalah dengan memisahkannya.</p>
<p>Dengan mengintegrasikan Milvus 2.6.8 sebagai tulang punggung vektor, pengambilan menjadi lapisan kelas produksi khusus yang beroperasi secara independen dari visualisasi. Milvus menangani penyimpanan vektor, pengindeksan, dan pencarian. Project_Golem berfokus pada rendering - mengkonsumsi ID dokumen dari Milvus dan menyorotnya dalam tampilan 3D.</p>
<p>Pemisahan ini menghasilkan dua aliran yang bersih dan independen:</p>
<p>Alur Pengambilan (Online, Tingkat Milidetik)</p>
<ul>
<li>Kueri Anda diubah menjadi vektor menggunakan penyematan OpenAI.</li>
<li>Vektor kueri dikirim ke koleksi Milvus.</li>
<li>Milvus AUTOINDEX memilih dan mengoptimalkan indeks yang sesuai.</li>
<li>Pencarian kemiripan kosinus secara real-time mengembalikan ID dokumen yang relevan.</li>
</ul>
<p>Alur Visualisasi (Offline, Skala Demo)</p>
<ul>
<li>UMAP menghasilkan koordinat 3D selama proses pemasukan data (n_tetangga = 30, min_dist = 0.1).</li>
<li>Koordinat tersebut disimpan dalam golem_cortex.json.</li>
<li>Frontend menyoroti node 3D yang sesuai menggunakan ID dokumen yang dikembalikan oleh Milvus.</li>
</ul>
<p>Poin penting: pengambilan tidak lagi menunggu visualisasi. Anda dapat memasukkan dokumen baru dan mencarinya dengan segera - tampilan 3D akan mengikuti jadwalnya sendiri.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">Apa yang Diubah oleh Streaming Node</h3><p>Pencernaan waktu nyata ini didukung oleh kemampuan baru di Milvus 2.6.8: <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">Streaming Node</a>. Pada versi sebelumnya, konsumsi waktu nyata membutuhkan antrean pesan eksternal seperti Kafka atau Pulsar. Streaming Nodes memindahkan koordinasi tersebut ke dalam Milvus itu sendiri - vektor-vektor baru dicerna secara terus menerus, indeks diperbarui secara bertahap, dan dokumen-dokumen yang baru ditambahkan dapat segera dicari tanpa pembangunan ulang dan tanpa ketergantungan eksternal.</p>
<p>Untuk Project_Golem, inilah yang membuat arsitekturnya praktis. Anda dapat terus menambahkan dokumen ke sistem RAG Anda - artikel baru, dokumen yang diperbarui, konten yang dibuat pengguna - dan pengambilan tetap berjalan tanpa memicu siklus UMAP → JSON → muat ulang yang mahal.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">Memperluas Visualisasi ke Skala Jutaan (Jalur Masa Depan)</h3><p>Dengan pengaturan yang didukung Milvus ini, Project_Golem saat ini mendukung demo interaktif sekitar 10.000 dokumen. Skala pengambilan jauh melampaui itu - Milvus menangani jutaan - tetapi pipeline visualisasi masih bergantung pada proses UMAP batch. Untuk menutup kesenjangan itu, arsitekturnya dapat diperluas dengan pipeline visualisasi tambahan:</p>
<ul>
<li><p>Pemicu pembaruan: Sistem mendengarkan peristiwa penyisipan pada koleksi Milvus. Setelah dokumen yang baru ditambahkan mencapai ambang batas yang ditentukan (misalnya, 1.000 item), pembaruan tambahan dipicu.</p></li>
<li><p>Proyeksi inkremental: Alih-alih menjalankan ulang UMAP di seluruh kumpulan data, vektor baru diproyeksikan ke dalam ruang 3D yang ada menggunakan metode transform () UMAP. Hal ini mempertahankan struktur global sekaligus mengurangi biaya komputasi secara dramatis.</p></li>
<li><p>Sinkronisasi frontend: Fragmen koordinat yang diperbarui dialirkan ke frontend melalui WebSocket, sehingga memungkinkan node baru muncul secara dinamis tanpa memuat ulang seluruh adegan.</p></li>
</ul>
<p>Selain skalabilitas, Milvus 2.6.8 memungkinkan pencarian hibrida dengan menggabungkan kemiripan vektor dengan pencarian teks lengkap dan pemfilteran skalar. Hal ini membuka pintu untuk interaksi 3D yang lebih kaya - seperti penyorotan kata kunci, pemfilteran kategori, dan pemotongan berbasis waktu - memberikan cara yang lebih ampuh bagi para pengembang untuk mengeksplorasi, men-debug, dan menalar perilaku RAG.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Cara Menerapkan dan Menjelajahi Project_Golem dengan Milvus<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golem yang telah ditingkatkan sekarang menjadi sumber terbuka di <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub</a>. Dengan menggunakan dokumentasi resmi Milvus sebagai dataset kami, kami berjalan melalui proses lengkap untuk memvisualisasikan pengambilan RAG dalam 3D. Penyiapannya menggunakan Docker dan Python dan mudah diikuti, bahkan jika Anda memulai dari awal.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>Kunci API OpenAI</li>
<li>Sebuah dataset (dokumentasi Milvus dalam format Markdown)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. Menyebarkan Milvus</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Implementasi Inti</h3><p>Integrasi Milvus (ingest.py)</p>
<p>Catatan: Implementasi ini mendukung hingga delapan kategori dokumen. Jika jumlah kategori melebihi batas ini, warna akan digunakan kembali secara round-robin.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>Visualisasi Frontend (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Unduh dataset dan letakkan di direktori yang ditentukan</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. Memulai proyek</h3><p>Mengonversi penyematan teks ke dalam ruang 3D</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[gambar]</p>
<p>Memulai Layanan Frontend</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. Visualisasi dan Interaksi</h3><p>Setelah frontend menerima hasil pencarian, kecerahan node diskalakan berdasarkan skor kemiripan kosinus, sementara warna node asli dipertahankan untuk mempertahankan cluster kategori yang jelas. Garis semi-transparan ditarik dari titik kueri ke setiap node yang cocok, dan kamera melakukan panning dan zoom dengan mulus untuk fokus pada cluster yang diaktifkan.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">Contoh 1: Pencocokan Dalam Domain</h4><p>Pertanyaan "Jenis indeks apa yang didukung oleh Milvus?"</p>
<p>Perilaku visualisasi:</p>
<ul>
<li><p>Dalam ruang 3D, sekitar 15 node di dalam klaster merah berlabel INDEXES menunjukkan peningkatan kecerahan yang nyata (sekitar 2-3×).</p></li>
<li><p>Node yang cocok termasuk potongan dari dokumen seperti index_types.md, hnsw_index.md, dan ivf_index.md.</p></li>
<li><p>Garis semi-transparan dirender dari vektor kueri ke setiap simpul yang cocok, dan kamera dengan mulus memfokuskan pada klaster merah.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">Contoh 2: Penolakan Kueri di Luar Domain</h4><p>Kueri "Berapa harga makanan KFC?"</p>
<p>Perilaku visualisasi:</p>
<ul>
<li><p>Semua node mempertahankan warna aslinya, dengan hanya sedikit perubahan ukuran (kurang dari 1,1×).</p></li>
<li><p>Node yang cocok tersebar di beberapa kelompok dengan warna yang berbeda, tidak menunjukkan konsentrasi semantik yang jelas.</p></li>
<li><p>Kamera tidak memicu tindakan fokus, karena ambang batas kemiripan (0,5) tidak terpenuhi.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Project_Golem yang dipasangkan dengan Milvus tidak akan menggantikan pipeline evaluasi RAG Anda yang sudah ada - tetapi menambahkan sesuatu yang tidak dimiliki oleh sebagian besar pipeline lainnya: kemampuan untuk melihat apa yang terjadi di dalam ruang vektor.</p>
<p>Dengan pengaturan ini, Anda dapat membedakan antara kegagalan pengambilan yang disebabkan oleh embedding yang buruk, kegagalan yang disebabkan oleh chunking yang buruk, dan kegagalan yang disebabkan oleh ambang batas yang terlalu ketat. Diagnosis semacam itu biasanya membutuhkan tebakan dan pengulangan. Sekarang Anda bisa melihatnya.</p>
<p>Integrasi saat ini mendukung debugging interaktif pada skala demo (~10.000 dokumen), dengan basis data vektor Milvus yang menangani pengambilan tingkat produksi di belakang layar. Jalan menuju visualisasi skala jutaan telah dipetakan tetapi belum dibangun - yang menjadikan ini saat yang tepat untuk terlibat.</p>
<p>Kunjungi <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> di GitHub, cobalah dengan dataset Anda sendiri, dan lihat seperti apa ruang vektor Anda.</p>
<p>Jika Anda memiliki pertanyaan atau ingin membagikan apa yang Anda temukan, bergabunglah dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channel</a> kami, atau pesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> untuk mendapatkan panduan langsung dalam penyiapan Anda.</p>
