---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: >-
  Refleksi tentang ChatGPT dan Sistem Memori Claude: Apa yang Dibutuhkan untuk
  Mengaktifkan Pengambilan Percakapan Sesuai Permintaan
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: >-
  Jelajahi bagaimana ChatGPT dan Claude mendesain memori secara berbeda, mengapa
  pengambilan percakapan berdasarkan permintaan sulit dilakukan, dan bagaimana
  Milvus 2.6 memungkinkannya pada skala produksi.
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>Pada sistem agen AI berkualitas tinggi, desain memori jauh lebih kompleks daripada yang terlihat pada awalnya. Pada intinya, sistem ini harus menjawab tiga pertanyaan mendasar: Bagaimana seharusnya riwayat percakapan disimpan? Kapan konteks masa lalu harus diambil? Dan apa, tepatnya, yang harus diambil?</p>
<p>Pilihan-pilihan ini secara langsung membentuk latensi respons agen, penggunaan sumber daya, dan-pada akhirnya-batas kemampuannya.</p>
<p>Model seperti ChatGPT dan Claude terasa semakin "sadar memori" semakin sering kita menggunakannya. Mereka mengingat preferensi, beradaptasi dengan tujuan jangka panjang, dan menjaga kontinuitas di seluruh sesi. Dalam hal ini, mereka sudah berfungsi sebagai agen AI mini. Namun di bawah permukaan, sistem memori mereka dibangun di atas asumsi arsitektur yang sangat berbeda.</p>
<p>Analisis rekayasa balik terbaru dari <a href="https://manthanguptaa.in/posts/claude_memory/">mekanisme memori</a> <a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT</a>dan <a href="https://manthanguptaa.in/posts/claude_memory/">Claude</a> menunjukkan perbedaan yang jelas. <strong>ChatGPT</strong> bergantung pada injeksi konteks yang telah dihitung sebelumnya dan cache berlapis untuk memberikan kontinuitas yang ringan dan dapat diprediksi. <strong>Claude,</strong> sebaliknya, mengadopsi gaya RAG, pengambilan sesuai permintaan dengan pembaruan memori dinamis untuk menyeimbangkan kedalaman dan efisiensi memori.</p>
<p>Kedua pendekatan ini bukan hanya preferensi desain - keduanya dibentuk oleh kemampuan infrastruktur. <a href="https://milvus.io/docs/release_notes.md#v268"><strong>Milvus 2.6</strong></a> memperkenalkan kombinasi pengambilan hibrida padat-jarang, pemfilteran skalar yang efisien, dan penyimpanan berjenjang yang dibutuhkan oleh memori percakapan sesuai permintaan, sehingga pengambilan selektif menjadi cepat dan cukup ekonomis untuk digunakan dalam sistem dunia nyata.</p>
<p>Dalam tulisan ini, kita akan membahas bagaimana sistem memori ChatGPT dan Claude bekerja, mengapa mereka berbeda secara arsitektur, dan bagaimana kemajuan terbaru dalam sistem seperti Milvus membuat pengambilan percakapan sesuai permintaan menjadi praktis dalam skala besar.</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">Sistem Memori ChatGPT<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Alih-alih meminta basis data vektor atau secara dinamis mengambil percakapan masa lalu pada waktu inferensi, ChatGPT membangun "memori" dengan merakit serangkaian komponen konteks yang tetap dan menyuntikkannya secara langsung ke dalam setiap prompt. Setiap komponen dipersiapkan sebelumnya dan menempati posisi yang diketahui dalam prompt.</p>
<p>Desain ini menjaga personalisasi dan kontinuitas percakapan tetap utuh sambil membuat latensi, penggunaan token, dan perilaku sistem lebih dapat diprediksi. Dengan kata lain, memori bukanlah sesuatu yang dicari oleh model dengan cepat - ini adalah sesuatu yang dikemas oleh sistem dan diberikan kepada model setiap kali model menghasilkan respons.</p>
<p>Pada tingkat tinggi, prompt ChatGPT yang lengkap terdiri dari lapisan-lapisan berikut ini, diurutkan dari yang paling global ke yang paling cepat:</p>
<p>[0] Petunjuk Sistem</p>
<p>[1] Petunjuk Pengembang</p>
<p>[2] Metadata Sesi (bersifat sementara)</p>
<p>[3] Memori Pengguna (fakta jangka panjang)</p>
<p>[4] Ringkasan Percakapan Terkini (obrolan sebelumnya, judul + cuplikan)</p>
<p>[5] Pesan Sesi Saat Ini (obrolan ini)</p>
<p>[6] Pesan terbaru Anda</p>
<p>Di antaranya, komponen [2] hingga [5] membentuk memori efektif sistem, masing-masing memiliki peran yang berbeda.</p>
<h3 id="Session-Metadata" class="common-anchor-header">Metadata Sesi</h3><p>Metadata sesi mewakili informasi yang berumur pendek dan tidak persisten yang disuntikkan sekali pada awal percakapan dan dibuang ketika sesi berakhir. Perannya adalah untuk membantu model beradaptasi dengan konteks penggunaan saat ini, bukan untuk mempersonalisasi perilaku dalam jangka panjang.</p>
<p>Lapisan ini menangkap sinyal tentang lingkungan sekitar pengguna dan pola penggunaan terkini. Sinyal-sinyal yang umum meliputi:</p>
<ul>
<li><p><strong>Informasi perangkat</strong> - misalnya, apakah pengguna menggunakan perangkat seluler atau desktop</p></li>
<li><p><strong>Atribut akun</strong> - seperti tingkat langganan (misalnya, ChatGPT Go), usia akun, dan frekuensi penggunaan secara keseluruhan</p></li>
<li><p><strong>Metrik perilaku</strong> - termasuk hari aktif selama 1, 7, dan 30 hari terakhir, panjang percakapan rata-rata, dan distribusi penggunaan model (misalnya, 49% permintaan yang ditangani oleh GPT-5)</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">Memori Pengguna</h3><p>Memori pengguna adalah lapisan memori yang persisten dan dapat diedit yang memungkinkan personalisasi di seluruh percakapan. Memori ini menyimpan informasi yang relatif stabil-seperti nama pengguna, peran atau tujuan karier, proyek yang sedang berjalan, hasil sebelumnya, dan preferensi pembelajaran-dan disuntikkan ke dalam setiap percakapan baru untuk menjaga kesinambungan dari waktu ke waktu.</p>
<p>Memori ini dapat diperbarui dengan dua cara:</p>
<ul>
<li><p><strong>Pembaruan eksplisit</strong> terjadi ketika pengguna secara langsung mengelola memori dengan instruksi seperti "ingat ini" atau "hapus ini dari memori."</p></li>
<li><p><strong>Pembaruan implisit</strong> terjadi ketika sistem mengidentifikasi informasi yang memenuhi kriteria penyimpanan OpenAI-seperti nama atau jabatan yang telah dikonfirmasi-dan menyimpannya secara otomatis, sesuai dengan persetujuan default pengguna dan pengaturan memori.</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">Ringkasan Percakapan Terakhir</h3><p>Ringkasan percakapan terbaru adalah lapisan konteks lintas sesi yang ringan yang menjaga kesinambungan tanpa memutar ulang atau mengambil riwayat obrolan lengkap. Alih-alih mengandalkan pengambilan dinamis, seperti pada pendekatan berbasis RAG tradisional, ringkasan ini dihitung sebelumnya dan disuntikkan langsung ke dalam setiap percakapan baru.</p>
<p>Lapisan ini hanya meringkas pesan pengguna, tidak termasuk balasan asisten. Ukurannya sengaja dibatasi-biasanya sekitar 15 entri-dan hanya menyimpan sinyal tingkat tinggi tentang minat terkini daripada konten yang mendetail. Karena tidak bergantung pada penyematan atau pencarian kemiripan, lapisan ini menjaga latensi dan konsumsi token tetap rendah.</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">Pesan Sesi Terkini</h3><p>Pesan sesi saat ini berisi riwayat pesan lengkap dari percakapan yang sedang berlangsung dan memberikan konteks jangka pendek yang diperlukan untuk tanggapan yang koheren dan bergantian. Lapisan ini mencakup input pengguna dan balasan asisten, tetapi hanya selama sesi tetap aktif.</p>
<p>Karena model ini beroperasi dalam batas token yang tetap, riwayat ini tidak dapat bertambah tanpa batas. Ketika batas tersebut tercapai, sistem akan menghapus pesan-pesan yang paling awal untuk memberi ruang bagi pesan-pesan yang lebih baru. Pemotongan ini hanya mempengaruhi sesi saat ini: memori pengguna jangka panjang dan ringkasan percakapan terbaru tetap utuh.</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">Sistem Memori Claude<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude mengambil pendekatan yang berbeda untuk manajemen memori. Daripada menyuntikkan kumpulan komponen memori yang besar dan tetap ke dalam setiap prompt - seperti yang dilakukan ChatGPT - Claude menggabungkan memori pengguna yang persisten dengan alat sesuai permintaan dan pengambilan selektif. Konteks historis diambil hanya ketika model menilainya relevan, sehingga memungkinkan sistem untuk menukar kedalaman kontekstual dengan biaya komputasi.</p>
<p>Konteks permintaan Claude terstruktur sebagai berikut:</p>
<p>[0] Perintah Sistem (instruksi statis)</p>
<p>[1] Kenangan Pengguna</p>
<p>[2] Riwayat Percakapan</p>
<p>[3] Pesan Saat Ini</p>
<p>Perbedaan utama antara Claude dan ChatGPT terletak pada <strong>bagaimana riwayat percakapan diambil</strong> dan <strong>bagaimana memori pengguna diperbarui dan dipelihara</strong>.</p>
<h3 id="User-Memories" class="common-anchor-header">Memori Pengguna</h3><p>Di Claude, memori pengguna membentuk lapisan konteks jangka panjang yang serupa dengan memori pengguna ChatGPT, tetapi dengan penekanan yang lebih kuat pada pembaruan otomatis yang digerakkan oleh latar belakang. Memori ini disimpan dalam format terstruktur (dibungkus dengan tag bergaya XML) dan dirancang untuk berkembang secara bertahap dari waktu ke waktu dengan campur tangan pengguna yang minimal.</p>
<p>Claude mendukung dua jalur pembaruan:</p>
<ul>
<li><p><strong>Pembaruan implisit</strong> - Sistem secara berkala menganalisis konten percakapan dan memperbarui memori di latar belakang. Pembaruan ini tidak diterapkan dalam waktu nyata, dan memori yang terkait dengan percakapan yang dihapus secara bertahap dipangkas sebagai bagian dari pengoptimalan yang sedang berlangsung.</p></li>
<li><p><strong>Pembaruan eksplisit</strong> - Pengguna dapat secara langsung mengelola memori melalui perintah seperti "ingat ini" atau "hapus ini", yang dijalankan melalui alat <code translate="no">memory_user_edits</code> khusus.</p></li>
</ul>
<p>Dibandingkan dengan ChatGPT, Claude menempatkan tanggung jawab yang lebih besar pada sistem itu sendiri untuk memperbaiki, memperbarui, dan memangkas memori jangka panjang. Hal ini mengurangi kebutuhan pengguna untuk secara aktif mengkurasi apa yang disimpan.</p>
<h3 id="Conversation-History" class="common-anchor-header">Riwayat Percakapan</h3><p>Untuk riwayat percakapan, Claude tidak bergantung pada ringkasan tetap yang disuntikkan ke dalam setiap permintaan. Sebaliknya, Claude mengambil konteks masa lalu hanya ketika model memutuskan bahwa hal itu diperlukan, menggunakan tiga mekanisme yang berbeda. Hal ini untuk menghindari membawa riwayat yang tidak relevan ke depan dan menjaga penggunaan token tetap terkendali.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Komponen</strong></th><th style="text-align:center"><strong>Tujuan</strong></th><th style="text-align:center"><strong>Bagaimana Ini Digunakan</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Jendela Bergulir (Percakapan Saat Ini)</strong></td><td style="text-align:center">Menyimpan riwayat pesan lengkap dari percakapan saat ini (bukan ringkasan), mirip dengan konteks sesi ChatGPT</td><td style="text-align:center">Disuntikkan secara otomatis. Batas token adalah ~190K; pesan lama akan dihapus setelah batas tercapai</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>alat</strong></td><td style="text-align:center">Mencari percakapan sebelumnya berdasarkan topik atau kata kunci, mengembalikan tautan percakapan, judul, dan kutipan pesan pengguna/asisten</td><td style="text-align:center">Dipicu ketika model menentukan bahwa detail historis diperlukan. Parameter termasuk <code translate="no">query</code> (istilah pencarian) dan <code translate="no">max_results</code> (1-10)</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>alat</strong></td><td style="text-align:center">Mengambil percakapan terbaru dalam rentang waktu tertentu (misalnya, "3 hari terakhir"), dengan hasil yang diformat sama seperti <code translate="no">conversation_search</code></td><td style="text-align:center">Dipicu ketika konteks terkini dalam cakupan waktu relevan. Parameter meliputi <code translate="no">n</code> (jumlah hasil), <code translate="no">sort_order</code>, dan rentang waktu</td></tr>
</tbody>
</table>
<p>Di antara komponen-komponen ini, <code translate="no">conversation_search</code> sangat penting. Ini dapat menampilkan hasil yang relevan bahkan untuk kueri yang diucapkan secara longgar atau multibahasa, yang menunjukkan bahwa ini beroperasi pada tingkat semantik daripada mengandalkan pencocokan kata kunci yang sederhana. Hal ini kemungkinan melibatkan pengambilan berbasis penyematan, atau pendekatan hibrida yang pertama-tama menerjemahkan atau menormalkan kueri ke dalam bentuk kanonik dan kemudian menerapkan kata kunci atau pengambilan hibrida.</p>
<p>Secara keseluruhan, pendekatan pencarian berdasarkan permintaan Claude memiliki beberapa kekuatan penting:</p>
<ul>
<li><p><strong>Pengambilan tidak dilakukan secara otomatis</strong>: Pemanggilan alat dipicu oleh penilaian model itu sendiri. Misalnya, ketika pengguna merujuk ke <em>"proyek yang kita bahas terakhir kali,"</em> Claude dapat memutuskan untuk memanggil <code translate="no">conversation_search</code> untuk mengambil konteks yang relevan.</p></li>
<li><p><strong>Konteks yang lebih kaya saat dibutuhkan</strong>: Hasil yang diperoleh dapat mencakup <strong>kutipan respons asisten</strong>, sedangkan ringkasan ChatGPT hanya menangkap pesan pengguna. Hal ini membuat Claude lebih cocok untuk kasus penggunaan yang membutuhkan konteks percakapan yang lebih dalam atau lebih tepat.</p></li>
<li><p><strong>Efisiensi yang lebih baik secara default</strong>: Karena konteks historis tidak disuntikkan kecuali jika diperlukan, sistem menghindari membawa sejumlah besar riwayat yang tidak relevan ke depan, mengurangi konsumsi token yang tidak perlu.</p></li>
</ul>
<p>Imbalannya juga sama jelasnya. Memperkenalkan pengambilan sesuai permintaan meningkatkan kompleksitas sistem: indeks harus dibangun dan dipelihara, kueri dieksekusi, hasil diberi peringkat, dan terkadang diberi peringkat ulang. Latensi ujung ke ujung juga menjadi kurang dapat diprediksi dibandingkan dengan konteks yang telah dihitung sebelumnya dan selalu diinjeksikan. Selain itu, model harus belajar untuk memutuskan kapan pengambilan diperlukan. Jika keputusan tersebut gagal, konteks yang relevan mungkin tidak akan pernah diambil sama sekali.</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">Kendala di Balik Pengambilan Sesuai Permintaan Gaya Claude<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengadopsi model pengambilan berdasarkan permintaan menjadikan basis data vektor sebagai bagian penting dari arsitektur. Pengambilan percakapan menempatkan tuntutan yang sangat tinggi pada penyimpanan dan eksekusi kueri, dan sistem harus memenuhi empat kendala pada saat yang bersamaan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1. Toleransi Latensi Rendah</h3><p>Dalam sistem percakapan, latensi P99 biasanya harus berada di bawah ~ 20 ms. Penundaan di luar itu akan segera terlihat oleh pengguna. Hal ini menyisakan sedikit ruang untuk ketidakefisienan: pencarian vektor, pemfilteran metadata, dan pemeringkatan hasil harus dioptimalkan dengan hati-hati. Kemacetan di titik mana pun dapat menurunkan seluruh pengalaman percakapan.</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2. Kebutuhan Pencarian Hibrida</h3><p>Permintaan pengguna sering kali menjangkau beberapa dimensi. Permintaan seperti <em>"diskusi tentang RAG dari minggu lalu"</em> menggabungkan relevansi semantik dengan pemfilteran berbasis waktu. Jika database hanya mendukung pencarian vektor, database dapat mengembalikan 1.000 hasil yang secara semantik mirip, hanya untuk pemfilteran lapisan aplikasi untuk menguranginya menjadi sedikit - membuang sebagian besar komputasi. Agar praktis, basis data harus mendukung kueri gabungan vektor dan skalar.</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3. Pemisahan Penyimpanan-Komputasi</h3><p>Riwayat percakapan menunjukkan pola akses panas-dingin yang jelas. Percakapan terbaru sering ditanyakan, sementara percakapan lama jarang disentuh. Jika semua vektor harus disimpan di memori, menyimpan puluhan juta percakapan akan menghabiskan ratusan gigabyte RAM - biaya yang tidak praktis dalam skala besar. Agar dapat digunakan, sistem harus mendukung pemisahan penyimpanan-komputasi, menyimpan data panas di memori dan data dingin di penyimpanan objek, dengan vektor yang dimuat sesuai permintaan.</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4. Pola Kueri yang Beragam</h3><p>Pengambilan percakapan tidak mengikuti pola akses tunggal. Beberapa kueri murni semantik (misalnya, <em>"pengoptimalan kinerja yang kita diskusikan")</em>, yang lain murni temporal (<em>"semua percakapan dari minggu lalu")</em>, dan banyak yang menggabungkan beberapa batasan (<em>"diskusi terkait Python yang menyebutkan FastAPI dalam tiga bulan terakhir")</em>. Perencana kueri basis data harus menyesuaikan strategi eksekusi dengan jenis kueri yang berbeda, daripada mengandalkan pencarian brute-force yang bersifat satu ukuran untuk semua.</p>
<p>Bersama-sama, keempat tantangan ini mendefinisikan kendala inti dari pencarian percakapan. Sistem apa pun yang ingin menerapkan pencarian berdasarkan permintaan gaya Claude harus mengatasi semuanya dengan cara yang terkoordinasi.</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">Mengapa Milvus 2.6 Bekerja dengan Baik untuk Pengambilan Percakapan<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Pilihan desain di <a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.6</a> selaras dengan persyaratan inti dari pengambilan percakapan sesuai permintaan. Di bawah ini adalah rincian dari kemampuan utama dan bagaimana kemampuan tersebut dipetakan ke dalam kebutuhan pencarian percakapan yang sebenarnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">Pengambilan Hibrida dengan Vektor Padat dan Jarang</h3><p>Milvus 2.6 secara native mendukung penyimpanan vektor padat dan vektor jarang dalam koleksi yang sama dan secara otomatis menggabungkan hasilnya pada waktu kueri. Vektor padat (misalnya, penyematan 768 dimensi yang dihasilkan oleh model seperti BGE-M3) menangkap kemiripan semantik, sementara vektor jarang (biasanya dihasilkan oleh BM25) mempertahankan sinyal kata kunci yang tepat.</p>
<p>Untuk kueri seperti <em>"diskusi tentang RAG dari minggu lalu,"</em> Milvus mengeksekusi pengambilan semantik dan pengambilan kata kunci secara paralel, kemudian menggabungkan hasilnya melalui pemeringkatan ulang. Dibandingkan dengan menggunakan salah satu pendekatan saja, strategi hibrida ini memberikan daya ingat yang jauh lebih tinggi dalam skenario percakapan nyata.</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">Pemisahan Penyimpanan-Komputasi dan Pengoptimalan Kueri</h3><p>Milvus 2.6 mendukung penyimpanan berjenjang dalam dua cara:</p>
<ul>
<li><p>Data panas dalam memori, data dingin dalam penyimpanan objek</p></li>
<li><p>Indeks dalam memori, data vektor mentah dalam penyimpanan objek</p></li>
</ul>
<p>Dengan desain ini, menyimpan satu juta entri percakapan dapat dicapai dengan sekitar 2 GB memori dan 8 GB penyimpanan objek. Dengan penyetelan yang tepat, latensi P99 dapat tetap berada di bawah 20 ms, bahkan dengan pemisahan penyimpanan-komputasi yang diaktifkan.</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">Penghancuran JSON dan Pemfilteran Skalar Cepat</h3><p>Milvus 2.6 mengaktifkan JSON Shredding secara default, meratakan bidang JSON yang bersarang menjadi penyimpanan kolumnar. Hal ini meningkatkan kinerja penyaringan skalar sebesar 3-5× menurut tolok ukur resmi (keuntungan aktual bervariasi menurut pola kueri).</p>
<p>Pengambilan percakapan sering kali membutuhkan pemfilteran berdasarkan metadata seperti ID pengguna, ID sesi, atau rentang waktu. Dengan JSON Shredding, kueri seperti <em>"semua percakapan dari pengguna A dalam seminggu terakhir"</em> dapat dieksekusi secara langsung pada indeks kolom, tanpa mengurai gumpalan JSON secara berulang-ulang.</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">Kontrol Sumber Terbuka dan Fleksibilitas Operasional</h3><p>Sebagai sistem sumber terbuka, Milvus menawarkan tingkat kontrol arsitektural dan operasional yang tidak dimiliki oleh solusi kotak hitam yang tertutup. Tim dapat mengatur parameter indeks, menerapkan strategi tiering data, dan menyesuaikan penerapan terdistribusi agar sesuai dengan beban kerja mereka.</p>
<p>Fleksibilitas ini menurunkan hambatan untuk masuk: tim kecil dan menengah dapat membangun sistem pengambilan percakapan berskala jutaan hingga puluhan juta tanpa bergantung pada anggaran infrastruktur yang besar.</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">Mengapa ChatGPT dan Claude Mengambil Jalur yang Berbeda<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada tingkat tinggi, perbedaan antara sistem memori ChatGPT dan Claude terletak pada bagaimana masing-masing menangani lupa. ChatGPT mendukung pelupaan proaktif: setelah memori melebihi batas yang ditetapkan, konteks yang lebih lama akan dibuang. Ini menukar kelengkapan dengan kesederhanaan dan perilaku sistem yang dapat diprediksi. Claude lebih menyukai pelupaan yang tertunda. Secara teori, riwayat percakapan dapat tumbuh tanpa batas, dengan penarikan kembali yang didelegasikan ke sistem pengambilan sesuai permintaan.</p>
<p>Jadi mengapa kedua sistem tersebut memilih jalur yang berbeda? Dengan kendala teknis yang dijelaskan di atas, jawabannya menjadi jelas: <strong>setiap arsitektur hanya dapat berjalan jika infrastruktur yang mendasarinya dapat mendukungnya.</strong></p>
<p>Jika pendekatan Claude dicoba pada tahun 2020, kemungkinan besar tidak praktis. Pada saat itu, basis data vektor sering kali mengalami latensi ratusan milidetik, kueri hibrida tidak didukung dengan baik, dan penggunaan sumber daya meningkat pesat seiring dengan bertambahnya data. Dalam kondisi seperti itu, pengambilan berdasarkan permintaan akan dianggap sebagai rekayasa yang berlebihan.</p>
<p>Pada tahun 2025, lanskap telah berubah. Kemajuan dalam infrastruktur - yang digerakkan oleh sistem seperti <strong>Milvus 2.6 - telah</strong>membuat pemisahan penyimpanan-komputasi, pengoptimalan kueri, pengambilan hibrida padat-jarang, dan penghancuran JSON menjadi layak untuk diproduksi. Kemajuan ini mengurangi latensi, mengendalikan biaya, dan membuat pengambilan selektif menjadi praktis dalam skala besar. Hasilnya, alat sesuai permintaan dan memori berbasis pengambilan tidak hanya menjadi layak, tetapi juga semakin menarik, terutama sebagai fondasi untuk sistem gaya agen.</p>
<p>Pada akhirnya, pilihan arsitektur mengikuti apa yang dimungkinkan oleh infrastruktur.</p>
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
    </button></h2><p>Dalam sistem dunia nyata, desain memori bukanlah pilihan biner antara konteks yang telah dikomputasi sebelumnya dan pengambilan sesuai permintaan. Arsitektur yang paling efektif biasanya bersifat hibrida, yang menggabungkan kedua pendekatan tersebut.</p>
<p>Pola yang umum adalah menyuntikkan percakapan terbaru melalui jendela konteks geser, menyimpan preferensi pengguna yang stabil sebagai memori tetap, dan mengambil riwayat yang lebih lama sesuai permintaan melalui pencarian vektor. Seiring dengan semakin matangnya sebuah produk, keseimbangan ini dapat bergeser secara bertahap-dari konteks yang terutama dihitung sebelumnya menjadi semakin digerakkan oleh pencarian-tanpa memerlukan pengaturan ulang arsitektur yang mengganggu.</p>
<p>Bahkan ketika memulai dengan pendekatan prakomputasi, penting untuk mendesain dengan mempertimbangkan migrasi. Memori harus disimpan dengan pengenal yang jelas, stempel waktu, kategori, dan referensi sumber. Ketika pengambilan dapat dilakukan, penyematan dapat dibuat untuk memori yang ada dan ditambahkan ke basis data vektor bersama dengan metadata yang sama, sehingga logika pengambilan dapat diperkenalkan secara bertahap dan dengan gangguan yang minimal.</p>
<p>Ada pertanyaan atau ingin mendalami fitur-fitur Milvus terbaru? Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami atau ajukan pertanyaan di <a href="https://github.com/milvus-io/milvus">GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
