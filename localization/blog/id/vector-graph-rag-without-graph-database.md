---
id: vector-graph-rag-without-graph-database.md
title: Kami Membangun Graph RAG Tanpa Basis Data Graph
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  Open-source Vector Graph RAG menambahkan penalaran multi-hop ke RAG hanya
  dengan menggunakan Milvus. 87,8% Recall@5, 2 panggilan LLM per kueri, tidak
  perlu basis data grafik.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL; DR:</em></strong> <em>Apakah Anda benar-benar membutuhkan basis data grafik untuk Graph RAG? Tidak. Masukkan entitas-entitas, relasi-relasi, dan lintasan-lintasan ke dalam Milvus. Gunakan ekspansi subgraf sebagai ganti penjelajahan graf, dan satu LLM memberi peringkat ulang sebagai ganti dari putaran agen yang banyak. Itulah</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vector Graph RAG</em></strong></a> <em>, dan itulah yang kami bangun. Pendekatan ini mencapai 87,8% rata-rata Recall@5 pada tiga tolok ukur QA multi-hop dan mengalahkan HippoRAG 2 pada satu contoh Milvus.</em></p>
</blockquote>
<p>Pertanyaan multi-hop adalah tembok yang pada akhirnya akan ditabrak oleh sebagian besar pipeline RAG. Jawabannya ada di dalam corpus Anda, tetapi mencakup beberapa bagian yang dihubungkan oleh entitas yang tidak disebutkan dalam pertanyaan. Perbaikan yang umum dilakukan adalah dengan menambahkan basis data grafik, yang berarti menjalankan dua sistem, bukan hanya satu.</p>
<p>Kami terus mengalami kesulitan dan tidak ingin menjalankan dua database hanya untuk menanganinya. Jadi kami membangun dan membuat <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> yang bersumber terbuka, sebuah pustaka Python yang membawa penalaran multi-hop ke <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> hanya dengan menggunakan <a href="https://milvus.io/docs">Milvus</a>, basis data vektor sumber terbuka yang paling banyak digunakan. Library ini menyediakan kemampuan multi-hop yang sama dengan satu database, bukan dua.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">Mengapa Pertanyaan Multi-Hop Merusak RAG Standar<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertanyaan multi-hop melanggar RAG standar karena jawabannya bergantung pada hubungan entitas yang tidak dapat dilihat oleh pencarian vektor. Entitas penghubung yang menghubungkan pertanyaan dengan jawaban sering kali tidak ada di dalam pertanyaan itu sendiri.</p>
<p>Pertanyaan-pertanyaan sederhana bekerja dengan baik. Anda memotong dokumen, menyematkannya, mengambil kecocokan terdekat, dan mengumpankannya ke LLM. "Indeks apa yang didukung Milvus?" ada di satu bagian, dan pencarian vektor menemukannya.</p>
<p>Pertanyaan multi-lompatan tidak sesuai dengan pola tersebut. Ambil contoh pertanyaan seperti <em>"Efek samping apa yang harus saya waspadai dengan obat diabetes lini pertama?"</em> dalam basis pengetahuan medis.</p>
<p>Untuk menjawabnya dibutuhkan dua langkah penalaran. Pertama, sistem harus mengetahui bahwa metformin adalah obat lini pertama untuk diabetes. Setelah itu, sistem dapat mencari efek samping metformin: pemantauan fungsi ginjal, ketidaknyamanan pencernaan, kekurangan vitamin B12.</p>
<p>"Metformin" adalah entitas penghubung. Ia menghubungkan pertanyaan dengan jawabannya, tetapi pertanyaan tersebut tidak pernah menyebutkannya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Di situlah <a href="https://zilliz.com/learn/vector-similarity-search">pencarian kemiripan Vektor</a> berhenti. Vector mengambil bagian yang terlihat seperti pertanyaan, panduan pengobatan diabetes, dan daftar efek samping obat, tetapi tidak dapat mengikuti hubungan entitas yang menghubungkan bagian-bagian tersebut. Fakta-fakta seperti "metformin adalah obat lini pertama untuk diabetes" berada dalam hubungan-hubungan tersebut, bukan dalam teks dari satu bagian.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">Mengapa Basis Data Graf dan Agentic RAG Bukanlah Jawabannya<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>Cara standar untuk menyelesaikan RAG multi-lompatan adalah basis data grafik dan perulangan agen. Keduanya berhasil. Keduanya membutuhkan biaya yang lebih besar daripada yang ingin dibayar oleh kebanyakan tim untuk satu fitur.</p>
<p>Ambil rute basis data grafik terlebih dahulu. Anda mengekstrak tiga kali lipat dari dokumen Anda, menyimpannya dalam basis data grafik, dan melintasi tepi untuk menemukan koneksi multi-hop. Itu berarti menjalankan sistem kedua di samping <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> Anda, mempelajari Cypher atau Gremlin, dan menjaga penyimpanan grafik dan vektor tetap sinkron.</p>
<p>Perulangan agen berulang adalah pendekatan lainnya. LLM mengambil sebuah kumpulan, menalarnya, memutuskan apakah kumpulan tersebut memiliki konteks yang cukup, dan mengambil lagi jika tidak. <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> (Trivedi et al., 2023) melakukan 3-5 pemanggilan LLM per kueri. Agentic RAG dapat melebihi 10 karena agen memutuskan kapan harus berhenti. Biaya per kueri menjadi tidak dapat diprediksi, dan lonjakan latensi P99 setiap kali agen menjalankan putaran ekstra.</p>
<p>Keduanya tidak cocok untuk tim yang menginginkan penalaran multi-hop tanpa membangun ulang stack mereka. Jadi kami mencoba sesuatu yang lain.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">Apa itu Vector Graph RAG, Struktur Graf di Dalam Basis Data Vektor<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a> adalah pustaka Python sumber terbuka yang membawa penalaran multi-hop ke <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> hanya dengan menggunakan <a href="https://milvus.io/docs">Milvus</a>. Ini menyimpan struktur graf sebagai referensi ID di tiga koleksi Milvus. Penjelajahan menjadi sebuah rantai pencarian kunci utama di Milvus, bukannya kueri Cypher terhadap basis data graf. Satu Milvus melakukan kedua pekerjaan tersebut.</p>
<p>Ia bekerja karena relasi-relasi dalam sebuah graf pengetahuan hanyalah teks. Triple <em>(yang merupakan metformin, adalah obat lini pertama untuk diabetes tipe 2)</em> adalah sebuah sisi berarah dalam sebuah basis data graf. Ini juga merupakan sebuah kalimat: "Metformin adalah obat lini pertama untuk diabetes tipe 2." Anda bisa menyematkan kalimat tersebut sebagai sebuah vektor dan menyimpannya di <a href="https://milvus.io/docs">Milvus</a>, sama seperti teks-teks lainnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Menjawab kueri multi-hop berarti mengikuti koneksi dari apa yang disebutkan kueri (seperti "diabetes") ke apa yang tidak disebutkan (seperti "metformin"). Hal ini hanya dapat dilakukan jika penyimpanan menyimpan koneksi-koneksi tersebut: entitas mana yang terhubung dengan entitas lain melalui relasi yang mana. Teks biasa dapat dicari, tetapi tidak dapat diikuti.</p>
<p>Untuk menjaga koneksi tetap dapat diikuti di Milvus, kami memberikan setiap entitas dan setiap relasi sebuah ID unik, lalu menyimpannya di koleksi terpisah yang saling merujuk satu sama lain dengan ID. Total ada tiga koleksi: <strong>entitas</strong> (simpul), <strong>relasi</strong> (sisi), dan <strong>baris</strong> (teks sumber, yang dibutuhkan LLM untuk menghasilkan jawaban). Setiap baris memiliki penyematan vektor, sehingga kita dapat melakukan pencarian semantik pada salah satu dari ketiganya.</p>
<p><strong>Entitas</strong> menyimpan entitas-entitas yang diduplikasi. Masing-masing memiliki ID unik, sebuah penyematan <a href="https://zilliz.com/glossary/vector-embeddings">vektor</a> untuk <a href="https://zilliz.com/glossary/semantic-search">pencarian semantik</a>, dan sebuah daftar ID relasi yang diikutinya.</p>
<table>
<thead>
<tr><th>id</th><th>nama</th><th>penyematan</th><th>id_relasi</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>metformin</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>diabetes tipe 2</td><td>[0.34, ...]</td><td>[r01, r04]</td></tr>
<tr><td>e03</td><td>fungsi ginjal</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>Relasi</strong> menyimpan pengetahuan tiga kali lipat. Masing-masing mencatat ID entitas subjek dan objeknya, ID bagian asalnya, dan penyematan teks relasi lengkap.</p>
<table>
<thead>
<tr><th>id</th><th>subject_id</th><th>id_objek</th><th>teks</th><th>penyematan</th><th>id bagian</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>Metformin adalah obat lini pertama untuk diabetes tipe 2</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>Pasien yang menggunakan metformin harus dipantau fungsi ginjalnya</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>Bagian</strong> menyimpan potongan dokumen asli, dengan referensi ke entitas dan relasi yang diekstrak darinya.</p>
<p>Ketiga koleksi tersebut saling menunjuk satu sama lain melalui bidang ID: entitas membawa ID relasi mereka, relasi membawa ID entitas subjek dan objek serta bagian sumber, dan bagian membawa ID semua yang diekstrak darinya. Jaringan referensi ID tersebut adalah graf.</p>
<p>Penjelajahan hanyalah sebuah rantai pencarian ID. Anda mengambil entitas e01 untuk mendapatkan <code translate="no">relation_ids</code>, mengambil relasi r01 dan r02 dengan ID-ID tersebut, membaca <code translate="no">object_id</code> dari r01 untuk menemukan entitas e02, dan terus berjalan. Setiap lompatan adalah <a href="https://milvus.io/docs/get-and-scalar-query.md">kueri kunci utama</a> Milvus standar. Tidak perlu menggunakan Cypher.</p>
<p>Anda mungkin bertanya-tanya apakah perjalanan bolak-balik ekstra ke Milvus bertambah. Ternyata tidak. Perluasan subgraf membutuhkan 2-3 kueri berbasis ID dengan total 20-30ms. Pemanggilan LLM membutuhkan waktu 1-3 detik, yang membuat pencarian ID tidak terlihat di sebelahnya.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">Bagaimana Graf Vektor RAG Menjawab Kueri Multi-Lompatan<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Alur pengambilan mengambil kueri multi-hop ke jawaban yang beralasan dalam empat langkah: <strong>pengambilan seed → perluasan subgraf → perankingan ulang LLM → pembuatan jawaban</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kita akan membahas pertanyaan diabetes: <em>"Efek samping apa yang harus saya waspadai dengan obat diabetes lini pertama?"</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">Langkah 1: Pengambilan Biji (Seed Retrieval)</h3><p>LLM mengekstrak entitas-entitas kunci dari pertanyaan: "diabetes", "efek samping", "obat lini pertama". Pencarian vektor di Milvus menemukan entitas dan relasi yang paling relevan secara langsung.</p>
<p>Tetapi metformin tidak termasuk di antaranya. Pertanyaannya tidak menyebutkannya, jadi pencarian vektor tidak dapat menemukannya.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">Langkah 2: Perluasan Subgraf</h3><p>Di sinilah Vector Graph RAG berbeda dari RAG standar.</p>
<p>Sistem ini mengikuti referensi ID dari entitas-entitas seed satu langkah lebih maju. Sistem ini mendapatkan ID-ID entitas seed, menemukan semua relasi yang mengandung ID-ID tersebut, dan menarik ID-ID entitas baru ke dalam subgraf. Default: satu lompatan.</p>
<p><strong>Metformin, entitas penghubung, masuk ke dalam subgraf.</strong></p>
<p>"Diabetes" memiliki sebuah relasi: <em>"Metformin adalah obat lini pertama untuk diabetes tipe 2."</em> Mengikuti sisi itu akan membawa metformin masuk. Setelah metformin berada di dalam subgraf, relasinya sendiri ikut masuk: <em>"Pasien yang menggunakan metformin harus memonitor fungsi ginjalnya," "Metformin dapat menyebabkan ketidaknyamanan pencernaan," "Penggunaan metformin dalam jangka panjang dapat menyebabkan kekurangan vitamin B12."</em></p>
<p>Dua fakta yang berada di bagian yang terpisah sekarang terhubung melalui satu lompatan perluasan graf. Entitas jembatan yang tidak pernah disebutkan dalam pertanyaan tersebut sekarang dapat ditemukan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">Langkah 3: Peringkat Ulang LLM</h3><p>Perluasan menyisakan Anda dengan lusinan kandidat relasi. Sebagian besar adalah noise.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>Sistem mengirimkan kandidat-kandidat ini dan pertanyaan asli ke LLM: "Mana yang berhubungan dengan efek samping obat diabetes lini pertama?" Ini adalah satu panggilan tanpa iterasi.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>Relasi yang dipilih mencakup rantai penuh: diabetes → metformin → pemantauan ginjal / ketidaknyamanan pencernaan / kekurangan B12.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">Langkah 4: Pembuatan Jawaban</h3><p>Sistem mengambil bagian asli untuk relasi yang dipilih dan mengirimkannya ke LLM.</p>
<p>LLM menghasilkan dari teks bagian penuh, bukan dari triple yang dipangkas. Triple adalah ringkasan yang dikompresi. Mereka tidak memiliki konteks, peringatan, dan hal-hal spesifik yang dibutuhkan LLM untuk menghasilkan jawaban yang beralasan.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">Lihat Grafik Vektor RAG beraksi</h3><p>Kami juga membuat frontend interaktif yang memvisualisasikan setiap langkah. Klik melalui panel langkah-langkah di sebelah kiri dan grafik diperbarui secara real time: oranye untuk simpul-simpul awal, biru untuk simpul-simpul yang diperluas, hijau untuk relasi-relasi yang dipilih. Hal ini membuat aliran pencarian menjadi konkret, bukan abstrak.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">Mengapa Satu Perangkingan Mengalahkan Beberapa Iterasi<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>Pipeline kami membuat dua panggilan LLM per kueri: satu untuk perangkingan ulang, satu untuk generasi. Sistem iteratif seperti IRCoT dan Agentic RAG menjalankan 3 hingga 10+ panggilan karena mereka melakukan perulangan: ambil, alasan, ambil lagi. Kami melewatkan perulangan tersebut karena pencarian vektor dan perluasan subgraf mencakup kemiripan semantik dan koneksi struktural dalam satu kali proses, sehingga LLM memiliki kandidat yang cukup untuk diselesaikan dalam satu kali pemeringkatan.</p>
<table>
<thead>
<tr><th>Pendekatan</th><th>Panggilan LLM per kueri</th><th>Profil latensi</th><th>Biaya API relatif</th></tr>
</thead>
<tbody>
<tr><td>Grafik Vektor RAG</td><td>2 (memberi peringkat ulang + menghasilkan)</td><td>Tetap, dapat diprediksi</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>Variabel</td><td>~2-3x</td></tr>
<tr><td>RAG Agenik</td><td>5-10+</td><td>Tidak dapat diprediksi</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>Dalam produksi, itu berarti biaya API sekitar 60% lebih rendah, respons 2-3x lebih cepat, dan latensi yang dapat diprediksi. Tidak ada lonjakan yang mengejutkan ketika agen memutuskan untuk menjalankan putaran ekstra.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">Hasil Tolok Ukur<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG memiliki rata-rata 87,8% Recall@5 di tiga tolok ukur QA multi-hop standar, menyamai atau melampaui setiap metode yang kami uji, termasuk HippoRAG 2, hanya dengan panggilan Milvus dan 2 LLM.</p>
<p>Kami mengevaluasi MuSiQue (2-4 hop, yang paling sulit), HotpotQA (2 hop, yang paling banyak digunakan), dan 2WikiMultiHopQA (2 hop, penalaran lintas dokumen). Metriknya adalah Recall@5: apakah bagian pendukung yang benar muncul dalam 5 hasil teratas yang diambil.</p>
<p>Kami menggunakan tiga kali lipat yang sudah diekstraksi sebelumnya dari <a href="https://github.com/OSU-NLP-Group/HippoRAG">repositori HippoRAG</a> untuk perbandingan yang adil. Tidak ada ekstraksi ulang, tidak ada prapemrosesan khusus. Perbandingan ini mengisolasi algoritme pengambilan itu sendiri.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">RAG Grafik Vektor</a> vs RAG Standar (Naif)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG meningkatkan rata-rata Recall@5 dari 73,4% menjadi 87,8%, sebuah peningkatan sebesar 19,6 poin persentase.</p>
<ul>
<li>MuSiQue: peningkatan terbesar (+31,4 pp). Tolok ukur 3-4 hop, pertanyaan multi-hop tersulit, dan tempat di mana perluasan subgraf memiliki dampak terbesar.</li>
<li>2WikiMultiHopQA: peningkatan tajam (+27,7 poin). Penalaran lintas dokumen, titik manis lainnya untuk perluasan subgraf.</li>
<li>HotpotQA: peningkatan yang lebih kecil (+6.1 pp), tetapi RAG standar sudah mendapatkan skor 90.8% pada dataset ini. Batas atas rendah.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Grafik Vektor RAG</a> vs Metode State-of-the-Art (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG meraih skor rata-rata tertinggi pada 87,8% melawan HippoRAG 2, IRCoT, dan NV-Embed-v2.</p>
<p>Tolok ukur demi tolok ukur:</p>
<ul>
<li>HotpotQA: menyamai HippoRAG 2 (keduanya 96,3%)</li>
<li>2WikiMultiHopQA: memimpin dengan 3,7 poin (94,1% vs 90,4%)</li>
<li>MuSiQue (yang paling sulit): tertinggal 1,7 poin (73,0% vs 74,7%)</li>
</ul>
<p>Vector Graph RAG mencapai angka-angka ini dengan hanya 2 panggilan LLM per kueri, tanpa basis data grafik, dan tanpa ColBERTv2. Vector Graph RAG berjalan pada infrastruktur yang paling sederhana dalam perbandingan ini dan masih mendapatkan rata-rata tertinggi.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">Bagaimana <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> Dibandingkan dengan Pendekatan Graph RAG Lainnya<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>Pendekatan Graph RAG yang berbeda dioptimalkan untuk masalah yang berbeda. Vector Graph RAG dibuat untuk produksi multi-hop QA dengan biaya yang dapat diprediksi dan infrastruktur yang sederhana.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / Agentic RAG</th><th><strong>Vector Graph RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Infrastruktur</strong></td><td>Grafik DB + vektor DB</td><td>ColBERTv2 + grafik dalam memori</td><td>Vektor DB + agen multi-bulat</td><td><strong>Hanya Milvus</strong></td></tr>
<tr><td><strong>Panggilan LLM per kueri</strong></td><td>Bervariasi</td><td>Sedang</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>Terbaik untuk</strong></td><td>Peringkasan korpus global</td><td>Pencarian akademis berbutir halus</td><td>Eksplorasi terbuka yang kompleks</td><td><strong>QA multi-hop produksi</strong></td></tr>
<tr><td><strong>Kekhawatiran penskalaan</strong></td><td>Pengindeksan LLM yang mahal</td><td>Grafik penuh dalam memori</td><td>Latensi dan biaya yang tidak dapat diprediksi</td><td><strong>Timbangan dengan Milvus</strong></td></tr>
<tr><td><strong>Kompleksitas pengaturan</strong></td><td>Tinggi</td><td>Sedang-Tinggi</td><td>Sedang</td><td><strong>Rendah (pemasangan pip)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a> menggunakan pengelompokan komunitas hirarkis untuk menjawab pertanyaan rangkuman global seperti 'apa tema utama di seluruh korpus ini? Itu adalah masalah yang berbeda dari QA multi-hop.&quot;</p>
<p><a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (Gutierrez dkk., 2025) menggunakan pengambilan yang terinspirasi oleh kognitif dengan pencocokan tingkat token ColBERTv2. Memuat grafik penuh ke dalam memori membatasi skalabilitas.</p>
<p>Pendekatan berulang seperti kesederhanaan infrastruktur perdagangan <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> untuk biaya LLM dan latensi yang tidak dapat diprediksi.</p>
<p>Vector Graph RAG menargetkan produksi multi-hop QA: tim yang menginginkan biaya dan latensi yang dapat diprediksi tanpa menambahkan basis data grafik.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Kapan Menggunakan Vector Graph RAG dan Kasus Penggunaan Utama<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG dibangun untuk empat jenis beban kerja:</p>
<table>
<thead>
<tr><th>Skenario</th><th>Mengapa cocok</th></tr>
</thead>
<tbody>
<tr><td><strong>Dokumen padat pengetahuan</strong></td><td>Kode hukum dengan referensi silang, literatur biomedis dengan rantai obat-gen-penyakit, pengarsipan keuangan dengan tautan perusahaan-orang-kejadian, dokumen teknis dengan grafik ketergantungan API</td></tr>
<tr><td><strong>2-4 pertanyaan lompatan</strong></td><td>Pertanyaan satu lompatan dapat digunakan dengan baik dengan RAG standar. Lima atau lebih lompatan mungkin memerlukan metode berulang. Kisaran 2-4 lompatan adalah titik puncak perluasan subgraf.</td></tr>
<tr><td><strong>Penyebaran sederhana</strong></td><td>Satu basis data, satu <code translate="no">pip install</code>, tidak ada infrastruktur graf yang perlu dipelajari</td></tr>
<tr><td><strong>Sensitivitas biaya dan latensi</strong></td><td>Dua panggilan LLM per kueri, tetap dan dapat diprediksi. Pada ribuan kueri harian, perbedaannya akan bertambah.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">Memulai dengan Graf Vektor RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> tanpa argumen secara default ke <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Ini membuat file <code translate="no">.db</code> lokal, seperti SQLite. Tidak ada server yang harus dijalankan, tidak ada yang perlu dikonfigurasi.</p>
<p><code translate="no">add_texts()</code> LLM memanggil LLM untuk mengekstrak tripel dari teks Anda, membuat vektor, dan menyimpan semuanya di Milvus. <code translate="no">query()</code> menjalankan alur pengambilan empat langkah penuh: seed, expand, rerank, generate.</p>
<p>Untuk produksi, tukar satu parameter URI. Sisa kode lainnya tetap sama:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Untuk mengimpor PDF, halaman web, atau file Word:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Graph RAG tidak membutuhkan basis data graf. Vector Graph RAG menyimpan struktur graf sebagai referensi ID di tiga koleksi Milvus, yang mengubah penjelajahan graf menjadi pencarian kunci-primer dan menjaga setiap kueri multi-hop pada dua pemanggilan LLM yang tetap.</p>
<p>Sekilas:</p>
<ul>
<li>Pustaka Python sumber terbuka. Penalaran multi-hop pada Milvus saja.</li>
<li>Tiga koleksi yang ditautkan oleh ID. Entitas (node), relasi (edge), bagian (teks sumber). Perluasan subgraf mengikuti ID untuk menemukan entitas-entitas penghubung yang tidak disebutkan oleh kueri.</li>
<li>Dua panggilan LLM per kueri. Satu perangkingan ulang, satu generasi. Tidak ada iterasi.</li>
<li>87,8% rata-rata Recall@5 di MuSiQue, HotpotQA, dan 2WikiMultiHopQA, menyamai atau mengalahkan HippoRAG 2 pada dua dari tiga kueri.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">Cobalah:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a> untuk kodenya</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">Dokumen</a> untuk API lengkap dan contoh-contoh</li>
<li>Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">komunitas</a> <a href="https://slack.milvus.io/">Milvus</a> <a href="https://slack.milvus.io/">di Discord</a> untuk mengajukan pertanyaan dan berbagi umpan balik</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Jam Kerja Milvus</a> untuk membahas kasus penggunaan Anda</li>
<li><a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> menawarkan tingkat gratis dengan Milvus terkelola jika Anda lebih suka melewatkan penyiapan infrastruktur</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">PERTANYAAN UMUM<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">Dapatkah saya melakukan Graph RAG hanya dengan basis data vektor?</h3><p>Ya. Vector Graph RAG menyimpan struktur knowledge graph (entitas, relasi, dan koneksinya) di dalam tiga koleksi Milvus yang dihubungkan oleh referensi silang ID. Alih-alih menelusuri sisi-sisi dalam basis data graf, RAG merantai pencarian kunci utama di Milvus untuk memperluas subgraf di sekitar entitas-entitas awal. Hal ini mencapai 87,8% rata-rata Recall@5 pada tiga tolok ukur multi-hop standar tanpa infrastruktur basis data graf.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">Bagaimana Vector Graph RAG dibandingkan dengan Microsoft GraphRAG?</h3><p>Mereka memecahkan masalah yang berbeda. Microsoft GraphRAG menggunakan pengelompokan komunitas hirarkis untuk peringkasan korpus global ("Apa tema utama di seluruh dokumen ini?"). Vector Graph RAG berfokus pada jawaban pertanyaan multi-hop, di mana tujuannya adalah untuk menghubungkan fakta-fakta spesifik di seluruh bagian. Vector Graph RAG hanya membutuhkan Milvus dan dua panggilan LLM per kueri. Microsoft GraphRAG membutuhkan basis data grafik dan memiliki biaya pengindeksan yang lebih tinggi.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">Jenis pertanyaan apa yang diuntungkan dari multi-hop RAG?</h3><p>Multi-hop RAG membantu dengan pertanyaan yang jawabannya bergantung pada menghubungkan informasi yang tersebar di beberapa bagian, terutama ketika entitas kunci tidak pernah muncul dalam pertanyaan. Contohnya adalah "Apa efek samping yang dimiliki obat diabetes lini pertama?" (membutuhkan penemuan metformin sebagai jembatan), pencarian referensi silang dalam teks hukum atau peraturan, dan penelusuran rantai ketergantungan dalam dokumentasi teknis. RAG standar menangani pencarian fakta tunggal dengan baik. Multi-hop RAG menambah nilai ketika jalur penalaran terdiri dari dua sampai empat langkah.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">Apakah saya perlu mengekstrak graf pengetahuan secara manual?</h3><p>Tidak. <code translate="no">add_texts()</code> dan <code translate="no">add_documents()</code> secara otomatis memanggil LLM untuk mengekstrak entitas dan relasi, membuat vektor, dan menyimpannya di Milvus. Anda dapat mengimpor dokumen dari URL, PDF, dan file DOCX menggunakan <code translate="no">DocumentImporter</code> bawaan. Untuk pembandingan atau migrasi, pustaka ini mendukung impor triple yang sudah diekstrak dari kerangka kerja lain seperti HippoRAG.</p>
