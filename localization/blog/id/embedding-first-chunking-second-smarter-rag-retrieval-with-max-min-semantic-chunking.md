---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: >-
  Menanamkan Terlebih Dahulu, Lalu Memotong: Pengambilan RAG yang lebih cerdas
  dengan Max-Min Semantic Chunking
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  Pelajari bagaimana Max-Min Semantic Chunking meningkatkan akurasi RAG
  menggunakan pendekatan embedding-first yang menciptakan potongan yang lebih
  cerdas, meningkatkan kualitas konteks, dan memberikan kinerja pengambilan yang
  lebih baik.
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a> telah menjadi pendekatan standar untuk menyediakan konteks dan memori untuk aplikasi AI - agen AI, asisten dukungan pelanggan, basis pengetahuan, dan sistem pencarian semuanya mengandalkannya.</p>
<p>Di hampir setiap pipeline RAG, proses standarnya sama: mengambil dokumen, membaginya menjadi potongan-potongan, dan kemudian menyematkan potongan-potongan itu untuk pencarian kesamaan dalam database vektor seperti <a href="https://milvus.io/">Milvus</a>. Karena <strong>chunking</strong> terjadi di awal, kualitas potongan-potongan itu secara langsung memengaruhi seberapa baik sistem mengambil informasi dan seberapa akurat jawaban akhirnya.</p>
<p>Masalahnya adalah bahwa strategi chunking tradisional biasanya membagi teks tanpa pemahaman semantik. Chunking dengan panjang tetap memotong berdasarkan jumlah token, dan chunking rekursif menggunakan struktur tingkat permukaan, tetapi keduanya masih mengabaikan makna teks yang sebenarnya. Akibatnya, ide-ide yang terkait sering kali terpisah, baris yang tidak terkait dikelompokkan bersama, dan konteks yang penting terfragmentasi.</p>
<p>Dalam blog ini, saya ingin berbagi strategi chunking yang berbeda: <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max-Min Semantic Chunking</strong></a>. Alih-alih memotong terlebih dahulu, strategi ini menyematkan teks di awal dan menggunakan kesamaan semantik untuk memutuskan di mana batas-batas harus dibentuk. Dengan menyematkan sebelum memotong, pipeline dapat melacak pergeseran makna secara alami daripada mengandalkan batas panjang yang sewenang-wenang.</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">Cara Kerja Pipa RAG pada Umumnya<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagian besar pipeline RAG, apa pun kerangkanya, mengikuti jalur perakitan empat tahap yang sama. Anda mungkin telah menulis beberapa versi dari ini sendiri:</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1. Pembersihan dan Pemotongan Data</h3><p>Pipeline dimulai dengan membersihkan dokumen mentah: menghapus header, footer, teks navigasi, dan apa pun yang bukan merupakan konten asli. Setelah noise dihilangkan, teks akan dipecah menjadi bagian-bagian yang lebih kecil. Sebagian besar tim menggunakan potongan ukuran tetap - biasanya 300-800 token - karena ini membuat model penyematan tetap dapat dikelola. Kelemahannya adalah pemisahannya didasarkan pada panjang, bukan makna, sehingga batas-batasnya bisa berubah-ubah.</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2. Penyematan dan Penyimpanan</h3><p>Setiap potongan kemudian disematkan menggunakan model penyematan seperti OpenAI <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a> OpenAI atau encoder BAAI. Vektor yang dihasilkan disimpan dalam basis data vektor seperti <a href="https://milvus.io/">Milvus</a> atau <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. Basis data menangani pengindeksan dan pencarian kemiripan sehingga Anda dapat dengan cepat membandingkan kueri baru dengan semua potongan yang tersimpan.</p>
<h3 id="3-Querying" class="common-anchor-header">3. Pengajuan pertanyaan</h3><p>Ketika seorang pengguna mengajukan pertanyaan - misalnya, <em>"Bagaimana RAG mengurangi halusinasi?"</em> - sistem menyematkan kueri dan mengirimkannya ke database. Basis data mengembalikan potongan K teratas yang vektornya paling dekat dengan kueri. Ini adalah potongan-potongan teks yang akan diandalkan oleh model untuk menjawab pertanyaan.</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4. Pembuatan Jawaban</h3><p>Potongan-potongan yang diambil digabungkan bersama dengan kueri pengguna dan dimasukkan ke dalam LLM. Model menghasilkan jawaban dengan menggunakan konteks yang disediakan sebagai landasan.</p>
<p><strong>Chunking berada di awal dari keseluruhan pipeline ini, tetapi memiliki dampak yang sangat besar.</strong> Jika potongan-potongan tersebut selaras dengan makna alami teks, pencarian akan terasa akurat dan konsisten. Jika potongan-potongan tersebut dipotong di tempat yang tidak tepat, sistem akan lebih sulit menemukan informasi yang tepat, bahkan dengan penyematan yang kuat dan basis data vektor yang cepat.</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">Tantangan dalam Melakukan Pemotongan dengan Benar</h3><p>Sebagian besar sistem RAG saat ini menggunakan salah satu dari dua metode chunking dasar, yang keduanya memiliki keterbatasan.</p>
<p><strong>1. Pemotongan ukuran tetap</strong></p>
<p>Ini adalah pendekatan yang paling sederhana: membagi teks dengan token atau jumlah karakter yang tetap. Metode ini cepat dan dapat diprediksi, tetapi sama sekali tidak memperhatikan tata bahasa, topik, atau transisi. Kalimat dapat dipotong menjadi dua. Kadang-kadang bahkan kata-kata. Penyematan yang Anda dapatkan dari potongan-potongan ini cenderung berisik karena batas-batasnya tidak mencerminkan bagaimana teks sebenarnya terstruktur.</p>
<p><strong>2. Pemisahan karakter rekursif</strong></p>
<p>Metode ini sedikit lebih cerdas. Metode ini memisahkan teks secara hierarkis berdasarkan isyarat seperti paragraf, jeda baris, atau kalimat. Jika suatu bagian terlalu panjang, maka secara rekursif akan membaginya lebih lanjut. Hasilnya umumnya lebih koheren, tetapi masih tidak konsisten. Beberapa dokumen tidak memiliki struktur yang jelas atau memiliki panjang bagian yang tidak merata, yang merusak akurasi pengambilan. Dan dalam beberapa kasus, pendekatan ini masih menghasilkan potongan yang melebihi jendela konteks model.</p>
<p>Kedua metode ini menghadapi tradeoff yang sama: ketepatan vs konteks. Potongan yang lebih kecil meningkatkan akurasi pengambilan tetapi kehilangan konteks di sekitarnya; potongan yang lebih besar mempertahankan makna tetapi berisiko menambah noise yang tidak relevan. Mencapai keseimbangan yang tepat adalah hal yang membuat chunking menjadi hal yang mendasar-dan membuat frustrasi-dalam desain sistem RAG.</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="common-anchor-header">Pemenggalan Semantik Maks-Min: Sematkan Dulu, Pisahkan Kemudian<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada tahun 2025, SR Bhat dkk. menerbitkan <a href="https://arxiv.org/abs/2505.21700"><em>Memikirkan Kembali Ukuran Potongan untuk Pengambilan Dokumen Panjang: Sebuah Analisis Multi-Dataset</em></a>. Salah satu temuan utama mereka adalah bahwa tidak ada satu ukuran chunk <strong>"terbaik"</strong> untuk RAG. Potongan kecil (64-128 token) cenderung bekerja lebih baik untuk pertanyaan faktual atau gaya pencarian, sementara potongan yang lebih besar (512-1024 token) membantu dengan tugas-tugas naratif atau penalaran tingkat tinggi. Dengan kata lain, chunking dengan ukuran tetap selalu merupakan sebuah kompromi.</p>
<p>Hal ini menimbulkan pertanyaan yang wajar: alih-alih memilih satu ukuran panjang dan berharap yang terbaik, bisakah kita memenggal berdasarkan makna, bukan ukuran? <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Max-Min Semantic Chunking</strong></a> adalah salah satu pendekatan yang saya temukan yang mencoba melakukan hal tersebut.</p>
<p>Idenya sederhana: sematkan <strong>terlebih dahulu, potong kedua</strong>. Alih-alih memecah teks dan kemudian menyematkan bagian mana pun yang terpotong, algoritme ini menyematkan <em>semua kalimat</em> di depan. Algoritme ini kemudian menggunakan hubungan semantik antara penyematan kalimat-kalimat tersebut untuk menentukan di mana batas-batasnya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>Diagram yang menunjukkan alur kerja embed-first chunk-second di Max-Min Semantic Chunking</span> </span></p>
<p>Secara konseptual, metode ini memperlakukan chunking sebagai masalah pengelompokan terbatas dalam ruang penyematan. Anda menelusuri dokumen secara berurutan, satu kalimat pada satu waktu. Untuk setiap kalimat, algoritme membandingkan penyematannya dengan kalimat-kalimat yang ada di dalam potongan saat ini. Jika kalimat baru secara semantik cukup dekat, maka kalimat tersebut akan bergabung dengan potongan tersebut. Jika terlalu jauh, algoritme akan memulai potongan baru. Batasan utamanya adalah bahwa potongan harus mengikuti urutan kalimat asli - tidak ada pengurutan ulang, tidak ada pengelompokan global.</p>
<p>Hasilnya adalah sekumpulan potongan dengan panjang variabel yang mencerminkan di mana makna dokumen benar-benar berubah, bukan di mana penghitung karakter mencapai angka nol.</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">Cara Kerja Strategi Max-Min Semantic Chunking<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunking menentukan batas-batas potongan dengan membandingkan bagaimana kalimat-kalimat berhubungan satu sama lain dalam ruang vektor berdimensi tinggi. Alih-alih bergantung pada panjang yang tetap, proses ini melihat bagaimana makna bergeser di seluruh dokumen. Prosesnya dapat dibagi menjadi enam langkah:</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1. Sematkan semua kalimat dan mulai sebuah potongan</h3><p>Model penyematan mengubah setiap kalimat dalam dokumen menjadi penyematan vektor. Model ini memproses kalimat secara berurutan. Jika <em>n-k</em> kalimat pertama membentuk potongan C saat ini, kalimat berikut (sₙ₋ₖ₊₁) perlu dievaluasi: apakah kalimat tersebut harus bergabung dengan C, atau memulai potongan baru?</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2. Mengukur seberapa konsisten potongan saat ini</h3><p>Di dalam potongan C, hitung kemiripan kosinus berpasangan minimum di antara semua sematan kalimat. Nilai ini mencerminkan seberapa dekat hubungan antara kalimat-kalimat di dalam potongan tersebut. Kemiripan minimum yang lebih rendah menunjukkan bahwa kalimat-kalimat tersebut kurang berhubungan, yang menunjukkan bahwa potongan tersebut mungkin perlu dipecah.</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3. Bandingkan kalimat baru dengan potongan</h3><p>Selanjutnya, hitung kemiripan kosinus maksimum antara kalimat baru dan kalimat apa pun yang sudah ada di C. Ini mencerminkan seberapa baik kalimat baru selaras secara semantik dengan potongan yang ada.</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4. Tentukan apakah akan memperpanjang potongan atau memulai yang baru</h3><p>Ini adalah aturan intinya:</p>
<ul>
<li><p>Jika <strong>kemiripan maksimum kalimat baru</strong> dengan potongan <strong>C</strong> <strong>lebih besar atau sama dengan</strong> <strong>kemiripan minimum di dalam C</strong>, → Kalimat baru cocok dan tetap berada di dalam potongan tersebut.</p></li>
<li><p>Jika tidak, → memulai potongan baru.</p></li>
</ul>
<p>Hal ini memastikan bahwa setiap potongan mempertahankan konsistensi semantik internalnya.</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5. Menyesuaikan ambang batas saat dokumen berubah</h3><p>Untuk mengoptimalkan kualitas potongan, parameter seperti ukuran potongan dan ambang batas kemiripan dapat disesuaikan secara dinamis. Hal ini memungkinkan algoritme untuk beradaptasi dengan berbagai struktur dokumen dan kepadatan semantik.</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6. Menangani beberapa kalimat pertama</h3><p>Ketika sebuah potongan hanya berisi satu kalimat, algoritme menangani perbandingan pertama dengan menggunakan ambang batas kemiripan yang tetap. Jika kemiripan antara kalimat 1 dan kalimat 2 berada di atas ambang batas tersebut, maka keduanya akan membentuk sebuah potongan. Jika tidak, mereka akan segera berpisah.</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">Kekuatan dan Keterbatasan Max-Min Semantic Chunking<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunking meningkatkan cara sistem RAG membagi teks dengan menggunakan makna, bukan panjangnya, tetapi ini bukan solusi yang tepat. Berikut ini adalah pandangan praktis tentang apa yang dilakukannya dengan baik dan di mana kekurangannya.</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">Apa yang Dilakukannya dengan Baik</h3><p>Max-Min Semantic Chunking meningkatkan chunking tradisional dalam tiga cara penting:</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1. Batas-batas potongan yang dinamis dan digerakkan oleh makna</strong></h4><p>Tidak seperti pendekatan ukuran tetap atau berbasis struktur, metode ini mengandalkan kesamaan semantik untuk memandu chunking. Metode ini membandingkan kemiripan minimum dalam potongan saat ini (seberapa kohesifnya) dengan kemiripan maksimum antara kalimat baru dan potongan tersebut (seberapa cocok). Jika yang terakhir lebih tinggi, kalimat tersebut bergabung dengan potongan; jika tidak, potongan baru akan dimulai.</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2. Penyetelan parameter yang sederhana dan praktis</strong></h4><p>Algoritme ini hanya bergantung pada tiga hiperparameter inti:</p>
<ul>
<li><p><strong>ukuran potongan maksimum</strong>,</p></li>
<li><p><strong>kemiripan minimum</strong> antara dua kalimat pertama, dan</p></li>
<li><p><strong>ambang batas kemiripan</strong> untuk menambahkan kalimat baru.</p></li>
</ul>
<p>Parameter ini menyesuaikan secara otomatis dengan konteks-potongan yang lebih besar membutuhkan ambang batas kemiripan yang lebih ketat untuk mempertahankan koherensi.</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3. Biaya pemrosesan yang rendah</strong></h4><p>Karena pipeline RAG sudah menghitung penyematan kalimat, Max-Min Semantic Chunking tidak menambahkan komputasi yang berat. Yang dibutuhkan hanyalah satu set pemeriksaan kemiripan kosinus saat memindai kalimat. Hal ini membuatnya lebih murah daripada banyak teknik semantic chunking yang membutuhkan model tambahan atau pengelompokan multi-tahap.</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">Apa yang Masih Belum Bisa Dipecahkan</h3><p>Max-Min Semantic Chunking meningkatkan batas-batas potongan, tetapi tidak menghilangkan semua tantangan segmentasi dokumen. Karena algoritme ini memproses kalimat secara berurutan dan hanya mengelompokkan secara lokal, algoritme ini masih dapat melewatkan hubungan jarak jauh dalam dokumen yang lebih panjang atau lebih kompleks.</p>
<p>Salah satu masalah umum adalah <strong>fragmentasi konteks</strong>. Ketika informasi penting tersebar di berbagai bagian dokumen, algoritme dapat menempatkan bagian-bagian tersebut ke dalam potongan-potongan terpisah. Setiap potongan kemudian hanya membawa sebagian dari makna.</p>
<p>Sebagai contoh, dalam Catatan Rilis Milvus 2.4.13, seperti yang ditunjukkan di bawah ini, satu bagian mungkin berisi pengenal versi sementara bagian lainnya berisi daftar fitur. Pertanyaan seperti <em>"Fitur baru apa saja yang diperkenalkan pada Milvus 2.4.13?"</em> bergantung pada keduanya. Jika detail-detail tersebut dipecah menjadi beberapa bagian, model penyematan mungkin tidak dapat menghubungkannya, yang menyebabkan pengambilan yang lebih lemah.</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>Contoh yang menunjukkan fragmentasi konteks di Catatan Rilis Milvus 2.4.13 dengan pengenal versi dan daftar fitur dalam potongan terpisah</span> </span></li>
</ul>
<p>Fragmentasi ini juga mempengaruhi tahap pembuatan LLM. Jika referensi versi ada di satu bagian dan deskripsi fitur ada di bagian lain, model menerima konteks yang tidak lengkap dan tidak dapat menalar dengan jelas tentang hubungan di antara keduanya.</p>
<p>Untuk mengurangi kasus ini, sistem sering kali menggunakan teknik seperti jendela geser, batas chunk yang tumpang tindih, atau pemindaian multi-pass. Pendekatan-pendekatan ini memperkenalkan kembali beberapa konteks yang hilang, mengurangi fragmentasi, dan membantu langkah pengambilan mempertahankan informasi terkait.</p>
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
    </button></h2><p>Max-Min Semantic Chunking bukanlah solusi ajaib untuk setiap masalah RAG, tetapi memberikan kita cara yang lebih masuk akal untuk memikirkan batas-batas potongan. Alih-alih membiarkan batas token memutuskan di mana ide akan dipotong, Max-Min Semantic Chunking menggunakan penyematan untuk mendeteksi di mana makna sebenarnya bergeser. Untuk banyak dokumen dunia nyata - API, spesifikasi, log, catatan rilis, panduan pemecahan masalah - hal ini saja dapat mendorong kualitas pencarian menjadi lebih tinggi.</p>
<p>Yang saya sukai dari pendekatan ini adalah pendekatan ini cocok secara alami dengan pipeline RAG yang sudah ada. Jika Anda sudah menyematkan kalimat atau paragraf, biaya tambahan pada dasarnya adalah beberapa pemeriksaan kemiripan kosinus. Anda tidak memerlukan model tambahan, pengelompokan yang rumit, atau prapemrosesan kelas berat. Dan ketika berhasil, potongan-potongan yang dihasilkannya terasa lebih "manusiawi"-lebih dekat dengan cara kita mengelompokkan informasi secara mental saat membaca.</p>
<p>Tetapi metode ini masih memiliki titik buta. Metode ini hanya melihat makna secara lokal, dan tidak dapat menghubungkan kembali informasi yang sengaja dipisah-pisahkan. Jendela yang tumpang tindih, pemindaian multi-pass, dan trik mempertahankan konteks lainnya masih diperlukan, terutama untuk dokumen yang referensi dan penjelasannya saling berjauhan.</p>
<p>Namun, Max-Min Semantic Chunking menggerakkan kita ke arah yang benar: menjauh dari pemotongan teks yang sewenang-wenang dan menuju jalur pengambilan yang benar-benar menghormati semantik. Jika Anda sedang mengeksplorasi cara-cara untuk membuat RAG lebih dapat diandalkan, ada baiknya Anda bereksperimen.</p>
<p>Ada pertanyaan atau ingin menggali lebih dalam tentang peningkatan kinerja RAG? Bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> kami dan terhubung dengan para insinyur yang membangun dan menyetel sistem pengambilan yang sesungguhnya setiap hari.</p>
