---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: >-
  Menjaga Agen AI Tetap Membumi: Strategi Rekayasa Konteks yang Mencegah
  Pembusukan Konteks Menggunakan Milvus
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  Pelajari mengapa pembusukan konteks terjadi dalam alur kerja LLM yang sudah
  berjalan lama dan bagaimana rekayasa konteks, strategi pengambilan, dan
  pencarian vektor Milvus membantu menjaga agen AI tetap akurat, fokus, dan
  dapat diandalkan di berbagai tugas multilangkah yang kompleks.
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>Jika Anda pernah bekerja dengan percakapan LLM yang sudah berjalan lama, Anda mungkin pernah mengalami saat-saat yang membuat frustasi: di tengah-tengah percakapan yang panjang, model mulai melenceng. Jawaban menjadi tidak jelas, penalaran melemah, dan detail-detail kunci menghilang secara misterius. Tetapi jika Anda memasukkan pertanyaan yang sama persis ke dalam obrolan baru, tiba-tiba model berperilaku fokus, akurat, dan beralasan.</p>
<p>Ini bukan karena model "lelah" - ini adalah pembusukan <strong>konteks</strong>. Seiring dengan berkembangnya percakapan, model harus menyulap lebih banyak informasi, dan kemampuannya untuk memprioritaskan secara perlahan-lahan menurun. <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Studi antropologi</a> menunjukkan bahwa ketika jendela konteks membentang dari sekitar 8 ribu token hingga 128 ribu, akurasi pengambilan dapat turun 15-30%. Model ini masih memiliki ruang, tetapi kehilangan jejak apa yang penting. Jendela konteks yang lebih besar membantu menunda masalah, tetapi tidak menghilangkannya.</p>
<p>Di sinilah <strong>rekayasa konteks</strong> masuk. Alih-alih memberikan semua hal kepada model sekaligus, kita membentuk apa yang dilihatnya: mengambil hanya bagian yang penting, memadatkan bagian yang tidak perlu bertele-tele, dan menjaga agar petunjuk dan alat bantu tetap bersih agar model dapat berpikir. Tujuannya sederhana: membuat informasi penting tersedia pada saat yang tepat, dan mengabaikan sisanya.</p>
<p>Pengambilan memainkan peran utama di sini, terutama untuk agen yang sudah berjalan lama. Basis data vektor seperti <a href="https://milvus.io/"><strong>Milvus</strong></a> menyediakan fondasi untuk menarik pengetahuan yang relevan secara efisien ke dalam konteks, sehingga sistem tetap membumi meskipun tugas-tugasnya semakin mendalam dan kompleks.</p>
<p>Dalam blog ini, kita akan melihat bagaimana pembusukan konteks terjadi, strategi yang digunakan tim untuk mengelolanya, dan pola arsitektur - mulai dari pengambilan hingga desain yang cepat - yang membuat agen AI tetap tajam dalam alur kerja yang panjang dan multi-langkah.</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">Mengapa Pembusukan Konteks Terjadi<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>Orang sering beranggapan bahwa memberikan lebih banyak konteks pada model AI secara alami akan menghasilkan jawaban yang lebih baik. Namun, hal tersebut tidak sepenuhnya benar. Manusia juga kesulitan dengan input yang panjang: ilmu kognitif menunjukkan bahwa memori kerja kita hanya mampu menyimpan sekitar <strong>7±2 potongan</strong> informasi. Dorong lebih dari itu, dan kita mulai melupakan, mengaburkan, atau salah menafsirkan detail.</p>
<p>LLM menunjukkan perilaku yang sama-hanya saja dalam skala yang jauh lebih besar dan dengan mode kegagalan yang lebih dramatis.</p>
<p>Akar masalahnya berasal dari <a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">arsitektur Transformer</a> itu sendiri. Setiap token harus membandingkan dirinya sendiri dengan setiap token lainnya, membentuk perhatian berpasangan di seluruh urutan. Itu berarti komputasi bertambah <strong>O(n²)</strong> dengan panjang konteks. Memperluas prompt Anda dari 1K token menjadi 100K tidak membuat model "bekerja lebih keras" - ini mengalikan jumlah interaksi token sebanyak <strong>10.000×</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Lalu ada masalah dengan data pelatihan.</strong> Model melihat lebih banyak urutan pendek daripada urutan panjang. Jadi, ketika Anda meminta LLM untuk beroperasi dalam konteks yang sangat besar, Anda mendorongnya ke dalam rezim yang tidak terlatih. Dalam praktiknya, penalaran dengan konteks yang sangat panjang sering kali <strong>tidak</strong> dapat dilakukan oleh sebagian besar model.</p>
<p>Terlepas dari batasan-batasan ini, konteks yang panjang sekarang tidak dapat dihindari. Aplikasi LLM awal sebagian besar merupakan tugas satu putaran-klasifikasi, ringkasan, atau generasi sederhana. Saat ini, lebih dari 70% sistem AI perusahaan bergantung pada agen yang tetap aktif di banyak putaran interaksi, sering kali selama berjam-jam, mengelola percabangan, alur kerja multi-langkah. Sesi yang berumur panjang telah beralih dari pengecualian menjadi default.</p>
<p>Lalu pertanyaan selanjutnya adalah: <strong>bagaimana kita menjaga perhatian model tetap tajam tanpa membuatnya kewalahan?</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">Pendekatan Pengambilan Konteks untuk Memecahkan Pembusukan Konteks<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Retrieval adalah salah satu pengungkit paling efektif yang kita miliki untuk memerangi pembusukan konteks, dan dalam praktiknya cenderung muncul dalam pola pelengkap yang menangani pembusukan konteks dari sudut yang berbeda.</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1. Pengambilan Tepat Pada Waktunya (Just-in-Time Retrieval): Mengurangi Konteks yang Tidak Perlu</h3><p>Salah satu penyebab utama pembusukan konteks adalah <em>membebani</em> model dengan informasi yang belum dibutuhkan. Claude Code - asisten pengkodean Anthropic - memecahkan masalah ini dengan <strong>pengambilan Just-in-Time (JIT)</strong>, sebuah strategi di mana model mengambil informasi hanya jika informasi tersebut relevan.</p>
<p>Alih-alih memasukkan seluruh basis kode atau kumpulan data ke dalam konteksnya (yang sangat meningkatkan kemungkinan melenceng dan lupa), Claude Code mempertahankan indeks kecil: jalur file, perintah, dan tautan dokumentasi. Ketika model membutuhkan sebuah informasi, model akan mengambil item spesifik tersebut dan memasukkannya ke dalam konteks <strong>pada saat dibutuhkan - bukan</strong>sebelumnya <strong>.</strong></p>
<p>Sebagai contoh, jika Anda meminta Claude Code untuk menganalisis basis data sebesar 10GB, ia tidak akan pernah mencoba memuat semuanya. Cara kerjanya lebih mirip seorang insinyur:</p>
<ol>
<li><p>Menjalankan kueri SQL untuk menarik ringkasan tingkat tinggi dari kumpulan data.</p></li>
<li><p>Menggunakan perintah seperti <code translate="no">head</code> dan <code translate="no">tail</code> untuk melihat contoh data dan memahami strukturnya.</p></li>
<li><p>Hanya menyimpan informasi yang paling penting-seperti statistik utama atau baris sampel-dalam konteksnya.</p></li>
</ol>
<p>Dengan meminimalkan apa yang disimpan dalam konteks, pengambilan JIT mencegah penumpukan token yang tidak relevan yang menyebabkan pembusukan. Model ini tetap fokus karena hanya melihat informasi yang diperlukan untuk langkah penalaran saat ini.</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2. Pra-pengambilan (Pencarian Vektor): Mencegah Penyimpangan Konteks Sebelum Dimulai</h3><p>Terkadang model tidak dapat "meminta" informasi secara dinamis - dukungan pelanggan, sistem tanya jawab, dan alur kerja agen sering kali membutuhkan pengetahuan yang tepat yang tersedia <em>sebelum</em> pembuatan dimulai. Di sinilah <strong>pra-pengambilan</strong> menjadi sangat penting.</p>
<p>Pembusukan konteks sering terjadi karena model diberikan setumpuk besar teks mentah dan diharapkan untuk memilah mana yang penting. Pra-pengambilan membalikkan hal tersebut: basis data vektor (seperti <a href="https://milvus.io/">Milvus</a> dan <a href="https://zilliz.com/cloud">Zilliz Cloud</a>) mengidentifikasi bagian yang paling relevan <em>sebelum</em> inferensi, memastikan hanya konteks bernilai tinggi yang mencapai model.</p>
<p>Dalam pengaturan RAG yang khas:</p>
<ul>
<li><p>Dokumen disematkan dan disimpan dalam basis data vektor, seperti Milvus.</p></li>
<li><p>Pada waktu kueri, sistem mengambil sekumpulan kecil potongan yang sangat relevan melalui pencarian kemiripan.</p></li>
<li><p>Hanya potongan-potongan tersebut yang masuk ke dalam konteks model.</p></li>
</ul>
<p>Hal ini mencegah pembusukan dalam dua cara:</p>
<ul>
<li><p><strong>Pengurangan noise:</strong> teks yang tidak relevan atau memiliki hubungan yang lemah tidak akan pernah masuk ke dalam konteks.</p></li>
<li><p><strong>Efisiensi:</strong> model memproses token yang jauh lebih sedikit, sehingga mengurangi kemungkinan kehilangan jejak detail penting.</p></li>
</ul>
<p>Milvus dapat mencari jutaan dokumen dalam milidetik, membuat pendekatan ini ideal untuk sistem langsung di mana latensi menjadi penting.</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3. JIT Hibrida dan Pengambilan Vektor</h3><p>Pra-pengambilan berbasis pencarian vektor mengatasi sebagian besar pembusukan konteks dengan memastikan model dimulai dengan informasi bersinyal tinggi daripada teks mentah yang sangat besar. Namun, Anthropic menyoroti dua tantangan nyata yang sering diabaikan oleh tim:</p>
<ul>
<li><p><strong>Ketepatan waktu:</strong> Jika basis pengetahuan diperbarui lebih cepat daripada indeks vektor yang dibangun kembali, model dapat mengandalkan informasi yang sudah usang.</p></li>
<li><p><strong>Akurasi:</strong> Sebelum tugas dimulai, sulit untuk memprediksi dengan tepat apa yang akan dibutuhkan oleh model-terutama untuk alur kerja yang terdiri dari beberapa langkah atau eksplorasi.</p></li>
</ul>
<p>Jadi, dalam beban kerja di dunia nyata, appaorch hibrida adalah solusi yang optimal.</p>
<ul>
<li><p>Pencarian vektor untuk pengetahuan yang stabil dan memiliki tingkat kepercayaan tinggi</p></li>
<li><p>Eksplorasi JIT berbasis agen untuk informasi yang berkembang atau hanya menjadi relevan di tengah-tengah tugas</p></li>
</ul>
<p>Dengan memadukan kedua pendekatan ini, Anda mendapatkan kecepatan dan efisiensi pencarian vektor untuk informasi yang sudah diketahui, dan fleksibilitas bagi model untuk menemukan dan memuat data baru kapan pun menjadi relevan.</p>
<p>Mari kita lihat bagaimana cara kerjanya dalam sistem nyata. Ambil contoh asisten dokumentasi produksi. Sebagian besar tim pada akhirnya memilih pipeline dua tahap: Pencarian vektor yang didukung Milvus + pengambilan JIT berbasis agen.</p>
<p><strong>1. Pencarian Vektor yang Didukung Milvus (Pra-pengambilan)</strong></p>
<ul>
<li><p>Ubah dokumentasi, referensi API, log perubahan, dan masalah yang diketahui menjadi embedding.</p></li>
<li><p>Simpan di Database Vektor Milvus dengan metadata seperti area produk, versi, dan waktu pembaruan.</p></li>
<li><p>Ketika pengguna mengajukan pertanyaan, jalankan pencarian semantik untuk mendapatkan segmen yang relevan dengan K teratas.</p></li>
</ul>
<p>Hal ini menyelesaikan sekitar 80% kueri rutin dalam waktu kurang dari 500 ms, sehingga memberikan model titik awal yang kuat dan tahan terhadap pembusukan konteks.</p>
<p><strong>2. Eksplorasi Berbasis Agen</strong></p>
<p>Ketika pencarian awal tidak cukup-misalnya, ketika pengguna meminta sesuatu yang sangat spesifik atau sensitif terhadap waktu-agen dapat memanggil alat untuk mengambil informasi baru:</p>
<ul>
<li><p>Gunakan <code translate="no">search_code</code> untuk menemukan fungsi atau file tertentu dalam basis kode</p></li>
<li><p>Gunakan <code translate="no">run_query</code> untuk mengambil data waktu nyata dari basis data</p></li>
<li><p>Gunakan <code translate="no">fetch_api</code> untuk mendapatkan status sistem terbaru</p></li>
</ul>
<p>Pemanggilan ini biasanya membutuhkan waktu <strong>3-5 detik</strong>, namun memastikan model selalu bekerja dengan data yang baru, akurat, dan relevan-bahkan untuk pertanyaan yang tidak dapat diantisipasi oleh sistem sebelumnya.</p>
<p>Struktur hibrida ini memastikan konteks tetap tepat waktu, benar, dan sesuai dengan tugas, sehingga secara dramatis mengurangi risiko pembusukan konteks dalam alur kerja agen yang sudah berjalan lama.</p>
<p>Milvus sangat efektif dalam skenario hibrida ini karena mendukung:</p>
<ul>
<li><p><strong>Pencarian vektor + pemfilteran skalar</strong>, menggabungkan relevansi semantik dengan batasan terstruktur</p></li>
<li><p><strong>Pembaruan inkremental</strong>, memungkinkan penyematan disegarkan tanpa waktu henti</p></li>
</ul>
<p>Hal ini membuat Milvus menjadi tulang punggung yang ideal untuk sistem yang membutuhkan pemahaman semantik dan kontrol yang tepat atas apa yang diambil.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sebagai contoh, Anda mungkin menjalankan kueri seperti:</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">Bagaimana Memilih Pendekatan yang Tepat untuk Menangani Pembusukan Konteks<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan tersedianya pra-pengambilan vektor, pengambilan tepat waktu, dan pengambilan hibrida, pertanyaan yang wajar adalah: yang <strong>mana yang harus Anda gunakan?</strong></p>
<p>Berikut ini adalah cara sederhana namun praktis untuk memilih-berdasarkan pada seberapa <em>stabil</em> pengetahuan Anda dan seberapa <em>dapat diprediksi</em> kebutuhan informasi model.</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1. Pencarian Vektor → Terbaik untuk Domain yang Stabil</h3><p>Jika domain berubah secara perlahan namun menuntut ketepatan-keuangan, pekerjaan hukum, kepatuhan, dokumentasi medis-maka basis pengetahuan yang didukung Milvus dengan <strong>pra-pengambilan</strong> biasanya sangat cocok.</p>
<p>Informasinya terdefinisi dengan baik, pembaruan jarang dilakukan, dan sebagian besar pertanyaan dapat dijawab dengan mengambil dokumen yang relevan secara semantik di awal.</p>
<p><strong>Tugas yang dapat diprediksi + pengetahuan yang stabil → Pra-pengambilan.</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2. Pengambilan Tepat Pada Waktunya → Terbaik untuk Alur Kerja yang Dinamis dan Eksploratif</h3><p>Bidang-bidang seperti rekayasa perangkat lunak, debugging, analitik, dan ilmu data melibatkan lingkungan yang berubah dengan cepat: file baru, data baru, status penerapan baru. Model tidak dapat memprediksi apa yang dibutuhkan sebelum tugas dimulai.</p>
<p><strong>Tugas yang tidak dapat diprediksi + pengetahuan yang berubah dengan cepat → pengambilan Tepat Pada Waktunya.</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3. Pendekatan Hibrida → Ketika Kedua Kondisi tersebut Benar</h3><p>Banyak sistem nyata yang tidak sepenuhnya stabil atau murni dinamis. Sebagai contoh, dokumentasi pengembang berubah secara perlahan, sedangkan kondisi lingkungan produksi berubah dari menit ke menit. Pendekatan hibrida memungkinkan Anda:</p>
<ul>
<li><p>Memuat pengetahuan yang sudah diketahui dan stabil menggunakan pencarian vektor (cepat, latensi rendah)</p></li>
<li><p>Mengambil informasi dinamis dengan alat bantu agen sesuai permintaan (akurat, terkini)</p></li>
</ul>
<p><strong>Pengetahuan campuran + struktur tugas campuran → Pendekatan pengambilan hibrida.</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">Bagaimana jika Jendela Konteks Masih Belum Cukup<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Rekayasa konteks membantu mengurangi kelebihan beban, namun terkadang masalahnya lebih mendasar: <strong>tugas tidak akan muat</strong>, bahkan dengan pemangkasan yang cermat.</p>
<p>Alur kerja tertentu-seperti memigrasi basis kode yang besar, meninjau arsitektur multi-repositori, atau membuat laporan penelitian yang mendalam-dapat melebihi 200K+ jendela konteks sebelum model mencapai akhir tugas. Bahkan dengan pencarian vektor yang melakukan pekerjaan berat, beberapa tugas membutuhkan memori yang lebih persisten dan terstruktur.</p>
<p>Baru-baru ini, Anthropic menawarkan tiga strategi praktis.</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1. Kompresi: Pertahankan Sinyal, Hilangkan Noise</h3><p>Ketika jendela konteks mendekati batasnya, model dapat <strong>memampatkan interaksi sebelumnya</strong> ke dalam rangkuman yang ringkas. Kompresi yang baik menjaga</p>
<ul>
<li><p>Keputusan-keputusan kunci</p></li>
<li><p>Kendala dan persyaratan</p></li>
<li><p>Masalah-masalah yang menonjol</p></li>
<li><p>Sampel atau contoh yang relevan</p></li>
</ul>
<p>Dan menghapus:</p>
<ul>
<li><p>Keluaran alat yang tidak jelas</p></li>
<li><p>Log yang tidak relevan</p></li>
<li><p>Langkah-langkah yang berlebihan</p></li>
</ul>
<p>Tantangannya adalah keseimbangan. Kompres terlalu agresif, dan model akan kehilangan informasi penting; kompres terlalu ringan, dan Anda hanya mendapatkan sedikit ruang. Kompresi yang efektif mempertahankan "mengapa" dan "apa" sambil membuang "bagaimana kita sampai di sini."</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2. Pencatatan Terstruktur: Pindahkan Informasi Stabil ke Luar Konteks</h3><p>Alih-alih menyimpan semua yang ada di dalam jendela model, sistem dapat menyimpan fakta-fakta penting di <strong>memori eksternal - sebuah</strong>basis data terpisah atau tempat penyimpanan terstruktur yang dapat ditanyakan oleh agen sesuai kebutuhan.</p>
<p>Sebagai contoh, prototipe agen Pokémon milik Claude menyimpan fakta-fakta yang tahan lama seperti:</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>Sementara itu, detail sementara-catatan pertempuran, keluaran alat yang panjang-tetap berada di luar konteks aktif. Hal ini mencerminkan bagaimana manusia menggunakan buku catatan: kita tidak menyimpan setiap detail di dalam memori kerja kita; kita menyimpan titik referensi secara eksternal dan mencarinya saat dibutuhkan.</p>
<p>Pencatatan terstruktur mencegah pembusukan konteks yang disebabkan oleh detail yang berulang-ulang dan tidak perlu sambil memberikan model sumber kebenaran yang dapat diandalkan.</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3. Arsitektur Sub-Agen: Membagi dan Menaklukkan Tugas Besar</h3><p>Untuk tugas-tugas yang kompleks, arsitektur multi-agen dapat dirancang di mana agen utama mengawasi keseluruhan pekerjaan, sementara beberapa sub-agen khusus menangani aspek-aspek spesifik dari tugas tersebut. Sub-agen ini menyelami sejumlah besar data yang terkait dengan sub-tugas mereka, namun hanya memberikan hasil yang ringkas dan penting. Pendekatan ini biasanya digunakan dalam skenario seperti laporan penelitian atau analisis data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam praktiknya, yang terbaik adalah memulai dengan menggunakan agen tunggal yang dikombinasikan dengan kompresi untuk menangani tugas tersebut. Penyimpanan eksternal hanya boleh digunakan ketika ada kebutuhan untuk mempertahankan memori di seluruh sesi. Arsitektur multi-agen harus disediakan untuk tugas-tugas yang benar-benar membutuhkan pemrosesan paralel dari sub-tugas yang kompleks dan terspesialisasi.</p>
<p>Setiap pendekatan memperluas "memori kerja" sistem yang efektif tanpa merusak jendela konteks - dan tanpa memicu pembusukan konteks.</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">Praktik Terbaik untuk Merancang Konteks yang Benar-Benar Berfungsi<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah menangani konteks yang melimpah, ada satu hal lagi yang sama pentingnya: bagaimana konteks dibangun sejak awal. Bahkan dengan kompresi, catatan eksternal, dan sub-agen, sistem akan mengalami kesulitan jika prompt dan alat itu sendiri tidak dirancang untuk mendukung penalaran yang panjang dan kompleks.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic menawarkan cara yang berguna untuk memikirkan hal ini-kurang sebagai latihan menulis prompt tunggal, dan lebih sebagai membangun konteks di tiga lapisan.</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>Petunjuk Sistem: Temukan Zona Goldilocks</strong></h3><p>Kebanyakan petunjuk sistem gagal pada titik ekstrem. Terlalu banyak detail-daftar aturan, kondisi bersarang, pengecualian yang dikodekan dengan keras-membuat prompt menjadi rapuh dan sulit untuk dipertahankan. Struktur yang terlalu sedikit membuat model menebak-nebak apa yang harus dilakukan.</p>
<p>Prompt terbaik berada di tengah-tengah: cukup terstruktur untuk memandu perilaku, cukup fleksibel untuk model bernalar. Dalam praktiknya, ini berarti memberikan model peran yang jelas, alur kerja umum, dan panduan alat yang ringan-tidak lebih, tidak kurang.</p>
<p>Sebagai contoh:</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>Perintah ini menentukan arah tanpa membebani model atau memaksanya untuk menyulap informasi dinamis yang tidak seharusnya ada di sini.</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">Desain Alat: Lebih Sedikit Lebih Baik</h3><p>Setelah perintah sistem menetapkan perilaku tingkat tinggi, alat membawa logika operasional yang sebenarnya. Modus kegagalan yang sangat umum terjadi pada sistem yang dilengkapi dengan alat bantu adalah memiliki terlalu banyak alat bantu - atau memiliki alat bantu yang tujuannya tumpang tindih.</p>
<p>Aturan praktis yang baik:</p>
<ul>
<li><p><strong>Satu alat, satu tujuan</strong></p></li>
<li><p><strong>Parameter yang eksplisit dan tidak ambigu</strong></p></li>
<li><p><strong>Tidak ada tanggung jawab yang tumpang tindih</strong></p></li>
</ul>
<p>Jika seorang insinyur manusia akan ragu-ragu tentang alat mana yang akan digunakan, model juga akan demikian. Desain alat yang bersih mengurangi ambiguitas, menurunkan beban kognitif, dan mencegah konteks menjadi berantakan dengan upaya alat yang tidak perlu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">Informasi Dinamis Harus Diambil, Bukan Dikodekan</h3><p>Lapisan terakhir adalah yang paling mudah diabaikan. Informasi dinamis atau sensitif terhadap waktu-seperti nilai status, pembaruan terkini, atau status khusus pengguna-tidak boleh muncul dalam prompt sistem sama sekali. Memasukkannya ke dalam prompt menjamin informasi tersebut akan menjadi basi, membengkak, atau kontradiktif dalam waktu yang lama.</p>
<p>Sebaliknya, informasi ini harus diambil hanya ketika dibutuhkan, baik melalui pengambilan atau melalui alat bantu agen. Menjaga konten dinamis dari prompt sistem mencegah pembusukan konteks dan menjaga ruang penalaran model tetap bersih.</p>
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
    </button></h2><p>Ketika agen AI bergerak ke lingkungan produksi di berbagai industri, mereka mengambil alur kerja yang lebih panjang dan tugas yang lebih kompleks daripada sebelumnya. Dalam kondisi seperti ini, mengelola konteks menjadi kebutuhan praktis.</p>
<p><strong>Namun, jendela konteks yang lebih besar tidak secara otomatis memberikan hasil yang lebih baik</strong>; dalam banyak kasus, yang terjadi justru sebaliknya. Ketika sebuah model kelebihan beban, diberi informasi yang sudah basi, atau dipaksa melalui permintaan yang sangat banyak, akurasi akan menurun secara perlahan. Penurunan yang lambat dan halus itulah yang sekarang kita sebut sebagai <strong>pembusukan konteks</strong>.</p>
<p>Teknik-teknik seperti JIT retrieval, pre-retrieval, hybrid pipelines, dan pencarian semantik bertenaga vektor-basis data, semuanya bertujuan untuk tujuan yang sama: <strong>memastikan model melihat informasi yang tepat di saat yang tepat - tidak lebih, tidak kurang - agar dapat tetap membumi dan menghasilkan jawaban yang dapat diandalkan</strong>.</p>
<p>Sebagai basis data vektor sumber terbuka dan berkinerja tinggi, <a href="https://milvus.io/"><strong>Milvus</strong></a> menjadi inti dari alur kerja ini. Milvus menyediakan infrastruktur untuk menyimpan pengetahuan secara efisien dan mengambil bagian yang paling relevan dengan latensi rendah. Dipasangkan dengan pengambilan JIT dan strategi pelengkap lainnya, Milvus membantu agen AI tetap akurat saat tugas mereka menjadi lebih dalam dan dinamis.</p>
<p>Namun, pengambilan hanyalah salah satu bagian dari teka-teki. Desain prompt yang baik, perangkat yang bersih dan minimal, serta strategi overflow yang masuk akal - baik kompresi, catatan terstruktur, atau sub-agen - semuanya bekerja sama untuk menjaga model tetap fokus di seluruh sesi yang berjalan lama. Seperti inilah rekayasa konteks yang sebenarnya: bukan peretasan yang cerdas, tetapi arsitektur yang cermat.</p>
<p>Jika Anda menginginkan agen AI yang tetap akurat selama berjam-jam, berhari-hari, atau seluruh alur kerja, konteks layak mendapatkan perhatian yang sama seperti yang Anda berikan pada bagian inti lain dari tumpukan Anda.</p>
<p>Punya pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan masalah di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
