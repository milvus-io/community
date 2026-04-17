---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: >-
  Wawancara dengan Penulis RaBitQ: Sengketa TurboQuant dan Mengapa Aksi Jual
  Penyimpanan adalah Alarm Palsu
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >-
  Penulis RaBitQ menanggapi makalah TurboQuant dari Google: ketidakseimbangan
  benchmark, teori yang salah, dan mengapa aksi jual penyimpanan merupakan alarm
  palsu.
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>Makalah <a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a> dari Google mengklaim <strong>kompresi 6x, kecepatan 8x, dan kehilangan akurasi mendekati nol</strong> untuk representasi vektor. Setelah dirilis, stok memori dan penyimpanan turun tajam, dan gerai-gerai teknologi besar dengan cepat menjadikannya berita utama.</p>
<p>Reaksi pasar hanyalah permulaan. Para peneliti segera mulai bertanya apakah klaim makalah tersebut dilebih-lebihkan dan apakah makalah tersebut memperlakukan karya sebelumnya - terutama <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> - secara adil. Perselisihan ini mendorong <strong>kuantisasi vektor</strong> kembali menjadi sorotan, sebagian karena ide dasar yang sama sekarang menjadi penting di dua bagian penting dari tumpukan AI: <a href="https://zilliz.com/learn/vector-similarity-search">sistem pencarian vektor</a> dan kompresi KV-cache untuk model besar.</p>
<p>Untuk memahami perdebatan teknis dan apa artinya bagi sistem produksi, kami berbicara dengan <strong>Cheng Long</strong>, Associate Professor di NTU Singapura dan kepala VectorDB@NTU; <strong>Jianyang Gao</strong>, penulis pertama RaBitQ; dan <strong>Li Liu</strong>, Direktur Teknik di Zilliz. Percakapan tersebut mencakup kuantisasi vektor itu sendiri, pertanyaan-pertanyaan yang diajukan seputar TurboQuant, dan mengapa hal ini penting bagi sistem seperti <a href="https://milvus.io/">Milvus</a>, <a href="https://zilliz.com/learn/what-is-vector-database">database vektor</a> sumber terbuka yang paling populer, dan pengambilan vektor berskala besar.</p>
<p><strong><em>Bacaan terkait:</em></strong> <em>Jika Anda menginginkan sisi teknik daripada wawancara, lihat artikel pendamping kami tentang</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>bagaimana kuantisasi vektor memengaruhi biaya infrastruktur AI</em></a><em>.</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">Mengapa kuantisasi vektor tiba-tiba menjadi topik yang besar?<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Sebelum kita masuk ke dalam kontroversi, bisakah Anda memulai dengan menjelaskan apa itu kuantisasi vektor dan mengapa hal ini menjadi sangat penting dalam AI?</strong></p>
<p><strong>Cheng Long:</strong> Kuantisasi vektor adalah teknik untuk <strong>kompresi data</strong> dan <strong>representasi perkiraan</strong>. Awalnya berasal dari pemrosesan sinyal, yang digunakan untuk kompresi gambar dan audio. Dalam sistem AI modern, perannya telah berubah karena vektor telah menjadi salah satu unit dasar komputasi.</p>
<p>Saat ini, pentingnya vektor terlihat jelas dalam dua hal.</p>
<p>Salah satunya adalah <strong>pencarian waktu nyata pada koleksi dengan miliaran atau bahkan puluhan miliar vektor</strong>. Dalam sistem pencarian semantik, tugas intinya adalah pencarian kemiripan pada vektor berdimensi tinggi. Tetapi vektor mentah berukuran besar, dan komputasi floating-point mahal. Dalam skala besar, hal ini menyulitkan untuk memberikan latensi tingkat milidetik. Kuantisasi vektor membantu dengan mengompresi vektor ke dalam representasi bit rendah dan mempercepat komputasi jarak. Itulah mengapa hal ini penting untuk beban kerja praktis seperti <a href="https://milvus.io/docs/single-vector-search.md">pencarian vektor tunggal</a>, <a href="https://milvus.io/docs/multi-vector-search.md">pencarian multi-vektor</a>, dan desain indeks dalam <a href="https://milvus.io/docs/index-explained.md">arsitektur pencarian Milvus</a>.</p>
<p>Yang lainnya adalah <strong>kompresi cache KV</strong> untuk model yang besar. Cache KV mengurangi komputasi yang berlebihan selama pembangkitan, tetapi biaya memori bertambah dengan cepat seiring dengan bertambah panjangnya konteks. Jadi masalahnya adalah bagaimana mengompresi vektor-vektor tersebut tanpa terlalu banyak merusak kualitas output. Pada intinya, itu juga merupakan masalah kuantisasi vektor.</p>
<p><strong>Zilliz: Jika kuantisasi vektor menjadi lebih banyak digunakan - dan jika hasil TurboQuant dapat bertahan - apakah itu berarti permintaan penyimpanan akan menurun drastis?</strong></p>
<p><strong>Jianyang Gao:</strong> Di bawah model yang sama dan beban kerja yang sama, kompresi dapat mengurangi permintaan penyimpanan. Namun, hal tersebut tidak membenarkan kesimpulan yang lebih luas yang diambil oleh banyak orang.</p>
<p>Ketika TurboQuant berbicara tentang <strong>kompresi 6x</strong> dan <strong>kecepatan 8x</strong>, mereka membandingkannya dengan standar dasar <strong>16-bit/32-bit</strong>. Hal ini tidak sama dengan membandingkan dengan metode lain dalam kategori yang sama. Jadi, efek yang sebenarnya masih perlu dievaluasi dengan lebih hati-hati.</p>
<p><strong>Zilliz: Lalu dari perspektif itu, jika reaksi pasar benar-benar tentang teknologi itu sendiri, bukankah seharusnya terjadi lebih awal, ketika ide-ide serupa sudah muncul?</strong></p>
<p><strong>Cheng Long:</strong> Dari sudut pandang teknis, Anda dapat mengatakan bahwa wilayah teoritis yang serupa telah dicapai sebelumnya. Tetapi pasar tidak bergerak selaras dengan penelitian. Biasanya ada jeda antara hasil akademis, adopsi teknik, dan interpretasi finansial.</p>
<p>Dan dalam jangka waktu yang lebih panjang, efeknya bahkan mungkin tidak linier. Kompresi dapat memungkinkan untuk menjalankan model besar pada perangkat yang lebih kecil, yang dapat menciptakan permintaan baru dan bukan hanya menguranginya. Hubungan antara teknologi dan pasar lebih rumit daripada ekstrapolasi garis lurus.</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">Bagaimana RaBitQ muncul, dan apa kontribusinya?<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Bagaimana Anda pertama kali mendapatkan ide untuk RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> Kami mulai dari celah yang kami lihat dalam database vektor. Metode tradisional seperti <a href="https://milvus.io/docs/ivf-pq.md">Kuantisasi Produk</a> bekerja dengan baik secara empiris, tetapi hanya memberikan sedikit jaminan secara teoritis.</p>
<p>Pada saat itu, saya sedang mempelajari probabilitas dimensi tinggi di NTU Singapura, dan hal ini membuat saya bertanya apakah kami dapat membangun sebuah metode yang tidak hanya praktis, tetapi juga memiliki jaminan teoritis yang jelas. Itulah titik awal dari RaBitQ.</p>
<p><strong>Zilliz: Apa yang Anda lihat sebagai orisinalitas utama RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> Ide utamanya adalah menggunakan rotasi acak, alias transformasi Johnson-Lindenstrauss, untuk membuat distribusi koordinat vektor menjadi lebih seragam dan lebih dapat diprediksi.</p>
<p>Setelah Anda memilikinya, Anda dapat memperoleh estimator kuantisasi yang optimal di atasnya. Kami kemudian memberikan bukti yang ketat bahwa estimator tersebut mencapai batas bawah teoritis.</p>
<p>Penelitian sebelumnya juga telah mencoba memperkenalkan rotasi acak. Namun dari sudut pandang kami, metode-metode tersebut tidak mencapai efek yang kami cari karena masalah-masalah praktis dalam desain algoritma.</p>
<p><strong>Zilliz: Dari perspektif teknik, apa yang paling menonjol dari RaBitQ bagi Anda?</strong></p>
<p><strong>Li Liu:</strong> Kami telah bekerja dengan banyak algoritma kuantisasi, mulai dari <a href="https://milvus.io/docs/ivf-sq8.md">metode kuantisasi skalar</a> hingga PQ dan varian lainnya. Yang paling menonjol dari RaBitQ adalah bagaimana ia mengubah cara orang mendekati masalah.</p>
<p>Sebelumnya, sebagian besar bidang ini masih cukup empiris. Anda dapat mengatakan bahwa sebuah metode tampaknya berhasil, tetapi lebih sulit untuk menjelaskan dengan jelas mengapa. RaBitQ mendekati masalah dengan cara yang lebih matematis. Metodenya terasa elegan dan, dalam arti tertentu, sederhana. Cara berpikir seperti itu mempengaruhi banyak pekerjaan selanjutnya.</p>
<p><strong>Zilliz: Sederhananya, berapa banyak yang bisa dihemat dari segi memori dan biaya?</strong></p>
<p><strong>Li Liu:</strong> Pada tingkat ingatan yang sama, berpindah dari kompresi 4-bit ke kompresi 2-bit mengurangi penggunaan memori hingga setengahnya.</p>
<p>Dan ini bukan hanya tentang kompresi. Kinerjanya lebih baik dibandingkan dengan pendekatan sebelumnya, dan hal ini penting dalam lingkungan produksi di mana tim peduli dengan efisiensi memori dan kualitas pengambilan. Itulah mengapa hal ini penting untuk sistem yang perlu menyeimbangkan <a href="https://milvus.io/docs/dense-vector.md">penyimpanan vektor yang padat</a>, throughput, dan pengambilan.</p>
<p><strong>Zilliz: Di luar Milvus, di mana Anda melihat RaBitQ digunakan saat ini?</strong></p>
<p><strong>Cheng Long:</strong> Pertama, saya ingin berterima kasih kepada tim Milvus, karena mereka termasuk yang paling awal mengadopsi RaBitQ. Kami juga melakukan banyak diskusi dan penelitian kolaboratif selama ini.</p>
<p>RaBitQ juga telah diadopsi di beberapa sistem lain termasuk Meta's FAISS, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene, dan turbopuffer. Yang menonjol dari sisi Milvus adalah bahwa tim ini mengirimkan <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> sebagai opsi indeks nyata di <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, di samping pekerjaan yang lebih luas dalam <a href="https://milvus.io/docs/manage-collections.md">manajemen koleksi</a>, <a href="https://milvus.io/docs/ivf-flat.md">pengindeksan berbasis IVF</a>, dan <a href="https://milvus.io/docs/hnsw.md">pengindeksan berbasis HNSW</a>.</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">Bagaimana seharusnya kita mengevaluasi TurboQuant?<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Dalam tanggapan publik Anda, Anda mengatakan bahwa TurboQuant memiliki beberapa masalah serius. Menurut Anda, apa saja masalah utamanya?</strong></p>
<p><strong>Jianyang Gao:</strong> Kami melihat tiga masalah utama.</p>
<p>Salah satunya adalah cara makalah tersebut menggambarkan pekerjaan sebelumnya dan membahas tumpang tindih. Makalah TurboQuant salah mengartikan metodologi RaBitQ, mengabaikan bagian yang paling mirip, seperti Transformasi Johnson-Lindenstrauss. Hal lainnya adalah cara makalah tersebut mengkarakterisasi hasil teoritis. Makalah ini menggambarkan RaBitQ sebagai suboptimal tanpa memberikan penjelasan atau bukti apapun, padahal RaBitQ adalah optimal. Yang ketiga adalah keadilan dari perbandingan eksperimental. Mereka menggunakan CPU single-core untuk mengevaluasi RaBitQ, sementara menggunakan GPU A100 untuk mengevaluasi TurboQuant.</p>
<p><strong>Zilliz: Mari kita bahas masalah benchmark terlebih dahulu. Menurut Anda, mengapa perbandingan tersebut tidak adil?</strong></p>
<p><strong>Jianyang Gao:</strong> Klaim benchmark hanya berarti jika pengaturannya sebanding. Jika satu sistem diuji di bawah lingkungan perangkat keras atau perangkat lunak yang sangat berbeda, maka hasilnya mungkin lebih mencerminkan pengaturannya daripada algoritmanya sendiri.</p>
<p>Dalam pandangan kami, perbedaan dalam pilihan prosesor, bahasa implementasi, dan tingkat optimasi dapat membuat perbedaan besar. Itulah mengapa metodologi benchmark perlu ditafsirkan dengan sangat hati-hati, terutama oleh tim yang membangun sistem pengambilan produksi.</p>
<p><strong>Cheng Long:</strong> Makalah ini juga membuat beberapa klaim lain yang tidak benar.</p>
<p>Sebagai contoh, makalah tersebut mengatakan bahwa <strong>RaBitQ tidak dapat di-vektorisasi</strong>. Tetapi RaBitQ telah memiliki kode sumber terbuka dengan komputasi vektor berbasis SIMD ketika makalah 2024 diterbitkan. Jadi dari sudut pandang kami, pernyataan tersebut secara faktual tidak benar.</p>
<p>Perlu juga disebutkan bahwa kami mulai bekerja sama dengan NVIDIA tahun lalu dan menyelesaikan implementasi GPU RaBitQ. Kode terkait sedang ditinjau untuk dimasukkan ke dalam perpustakaan cuVS NVIDIA.</p>
<p><strong>Zilliz: Milvus mengevaluasi TurboQuant pada paruh kedua tahun 2025 tetapi tidak mengadopsinya. Apa yang tim Anda lihat dalam pengujian?</strong></p>
<p><strong>Li Liu:</strong> Ini memang mengandung satu ide yang berguna. Dalam pandangan kami, ini membuat optimasi kecil dalam bagaimana kisi kuantisasi dialokasikan. Tetapi langkah yang paling penting dalam metode ini - menggunakan rotasi acak untuk kuantisasi - pertama kali diperkenalkan oleh RaBitQ.</p>
<p>Dan dalam hal estimasi yang tidak bias, pendekatan RaBitQ lebih bersih dan turunan teoritisnya lebih kuat.</p>
<p>Namun demikian, karena ini adalah hasil dari Google, kami mengujinya pada tahun 2025. Di lab kami, di bawah lingkungan CPU standar, TurboQuant tidak mengungguli versi RaBitQ internal kami dalam sebagian besar kasus yang kami evaluasi. Jadi, ketika pasar bereaksi begitu kuat, kami benar-benar terkejut.</p>
<p><strong>Zilliz: Bagi pembaca yang belum melihat lebih dekat pada kedua makalah tersebut, bisakah Anda menjelaskan di mana RaBitQ dan TurboQuant saling tumpang tindih dalam bahasa yang sederhana?</strong></p>
<p><strong>Li Liu:</strong> Pada tingkat yang tinggi, kedua metode ini dimulai dengan <strong>rotasi acak</strong>. Secara matematis, ini berarti mengalikan vektor dengan matriks ortogonal acak. Anda bisa menganggapnya sebagai mengubah sudut pandang Anda dalam ruang dimensi tinggi. Metode ini tidak mengubah posisi relatif dari titik data, tetapi mendistribusikan informasi di seluruh dimensi secara lebih merata.</p>
<p>Setelah itu adalah <strong>kuantisasi</strong>. Anda membagi ruang bernilai riil kontinu menjadi <strong>sel grid 2^k</strong>, di mana <strong>k</strong> adalah jumlah bit kuantisasi, dan kemudian memetakan setiap elemen vektor ke titik grid terdekat. TurboQuant membuat penyesuaian kecil di sini dengan mengalokasikan grid sesuai dengan distribusi data, bukan mendistribusikannya secara merata.</p>
<p>Langkah terakhir adalah <strong>estimasi kesalahan</strong>, dan di sinilah kontribusi utama RaBitQ. Metode tradisional menghitung langsung dari nilai yang dikuantisasi, yang membuat kesalahan lebih sulit dikendalikan. RaBitQ memperkirakan kesalahan kuantisasi dengan lebih tepat, dan dari situlah optimalitas matematisnya berasal. Solusi TurboQuant lebih rumit, dan dalam pengaturan kami, pertukarannya tidak terlihat menarik.</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">Mengapa atribusi begitu sulit untuk diselesaikan dalam praktiknya?<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> Setelah Anda mempublikasikan pernyataan publik Anda, bagaimana tanggapan Google dan ICLR?</p>
<p><strong>Cheng Long:</strong> ICLR tidak mengambil tindakan. Kami mengirim email kepada mereka selama periode peninjauan pada bulan September tahun lalu, namun tidak menerima tanggapan. Kami menulis lagi pada bulan Maret tahun ini dan diberitahu untuk mengirim komentar di OpenReview, tapi setelah itu tidak ada tindakan apapun.</p>
<p>Sedangkan untuk Google, salah satu rekan penulis menjawab beberapa hari yang lalu. Balasan tersebut mengatakan bahwa mereka akan merevisi versi arXiv untuk memperbaiki deskripsi yang tidak akurat tentang optimalitas RaBitQ.</p>
<p><strong>Zilliz:</strong> Sebelumnya, diskusi ini berkisar pada kesalahan akademis. Sekarang ini juga terdengar seperti sebuah pertanyaan tentang ketidakseimbangan dan siapa yang bisa membentuk cerita. Mengapa begitu sulit untuk mempertahankan karya Anda?</p>
<p><strong>Cheng Long:</strong> Salah satu masalahnya adalah skala. Konferensi AI sekarang sangat besar sehingga satu siklus dapat menghasilkan puluhan ribu makalah. Penyelenggara tidak memiliki kapasitas untuk menangani setiap perselisihan semacam ini.</p>
<p>Masalah lainnya adalah ketidakseimbangan. Perusahaan-perusahaan besar memiliki suara publik yang lebih kuat. Peneliti independen atau tim yang lebih kecil tidak memiliki kekuatan komunikasi yang sama.</p>
<p><strong>Jianyang Gao:</strong> Untuk individu, biayanya sangat tinggi. Profesor Long dan saya hampir tidak bisa bekerja secara normal dalam beberapa minggu terakhir.</p>
<p>Prosesnya sendiri juga membuat frustrasi. Kami ditolak mentah-mentah saat kami menghubungi para penulis, dan kami tidak menerima tanggapan dari penyelenggara konferensi. Dalam praktiknya, banyak peneliti melihat situasi seperti ini dan memutuskan untuk melepaskannya. Namun, itu juga yang menyebabkan banyak kontribusi orisinil menghilang dari narasi publik.</p>
<p><strong>Zilliz:</strong> Sepertinya ini bukan pertama kalinya tim Anda mengalami masalah seperti ini.</p>
<p><strong>Cheng Long:</strong> Tidak, ini bukan yang pertama.</p>
<p>Kami telah melihat kasus-kasus sebelumnya di mana perusahaan mengambil RaBitQ, melakukan beberapa modifikasi teknik, memberikan nama baru, dan kemudian mendeskripsikannya hanya sebagai sesuatu yang terinspirasi oleh RaBitQ.</p>
<p>Itulah mengapa saya menghargai cara beberapa tim industri menangani hal ini, termasuk Milvus. Ketika mereka menggunakan RaBitQ, mereka mendeskripsikannya secara objektif. Dan ketika mereka menambahkan optimasi di luar versi aslinya, mereka menjelaskannya dengan jelas sebagai kontribusi teknik mereka sendiri. Hal ini memberikan penghargaan yang tepat pada karya asli sekaligus menunjukkan kekuatan teknis perusahaan.</p>
<p><strong>Zilliz:</strong> Ketika perusahaan besar membangun berdasarkan karya akademis, apakah mereka biasanya memberikan pembagian keuangan atau alokasi keuntungan?</p>
<p><strong>Jianyang Gao:</strong> Dalam banyak kasus, tidak.</p>
<p>Meskipun demikian, perusahaan besar masih memiliki insentif yang kuat untuk menampilkan kemajuan teknis sebagai sesuatu yang mereka ciptakan sendiri daripada sesuatu yang mereka adopsi dari orang lain. Semua orang ingin pelanggan dan investor melihat karya paling canggih sebagai hasil inovasi tim mereka sendiri.</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">Apa yang akan terjadi selanjutnya untuk kuantisasi vektor?<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> Arah penelitian apa yang sedang Anda kerjakan sekarang?</p>
<p><strong>Cheng Long:</strong> Sebagian besar pekerjaan kami akan tetap fokus pada pengambilan vektor.</p>
<p>Salah satu arahnya adalah menggabungkan RaBitQ dengan indeks pengambilan vektor yang berbeda, seperti IVF dan HNSW, sehingga sistem dapat mendukung data berskala lebih besar dengan latensi yang lebih rendah, konkurensi yang lebih tinggi, dan biaya yang lebih rendah. Saya juga memperhatikan kompresi cache KV.</p>
<p><strong>Jianyang Gao:</strong> Cache KV dalam model besar dan pengambilan vektor memiliki banyak sifat yang sama, baik secara matematis maupun di tingkat sistem, karena keduanya berurusan dengan vektor berdimensi tinggi.</p>
<p>Ke depannya, saya ingin berpikir lebih banyak tentang bagaimana menerapkan alat matematika, termasuk ide-ide dari probabilitas dimensi tinggi, untuk mempercepat inferensi dan pelatihan.</p>
<p><strong>Zilliz:</strong> Di manakah batas tertinggi untuk kuantisasi vektor sebagai sebuah bidang? Berapa banyak ruang yang tersisa untuk perbaikan?</p>
<p><strong>Cheng Long:</strong> Dari sudut pandang teoritis, batas tertinggi sebagian besar sudah terlihat. RaBitQ sudah optimal secara asimtotik.</p>
<p>Tetapi masih ada banyak ruang di sisi teknik. Anda masih harus berurusan dengan karakteristik perangkat keras, distribusi data, batasan latensi, dan banyak faktor praktis lainnya. Itulah mengapa sistem produksi masih membutuhkan pekerjaan yang cermat di bidang-bidang seperti <a href="https://milvus.io/docs/architecture_overview.md">arsitektur basis data vektor terdistribusi</a>, <a href="https://milvus.io/docs/sparse_vector.md">dukungan vektor</a> yang <a href="https://milvus.io/docs/sparse_vector.md">jarang</a>, <a href="https://milvus.io/docs/reranking.md">jalur pemeringkatan ulang</a>, dan pemilihan metrik dalam <a href="https://milvus.io/docs/metric.md">metrik jarak Milvus</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Teruslah Membaca<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda ingin menggali lebih dalam ke sisi teknik RaBitQ dan bagaimana ia cocok dengan Milvus, ini adalah sumber daya yang paling relevan:</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">Dokumentasi IVF_RABITQ</a> - detail konfigurasi dan panduan penyetelan.</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">Pendalaman integrasi RaBitQ</a> - bagaimana Milvus mengubah RaBitQ menjadi indeks produksi.</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">Bagaimana kuantisasi vektor memengaruhi biaya infrastruktur AI</a> - analisis kami yang lebih luas tentang diskusi TurboQuant-RaBitQ.</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Pos rilis Milvus 2.6</a> - di mana IVF_RABITQ dikirimkan sebagai opsi indeks Milvus yang sebenarnya.</li>
<li><a href="https://milvus.io/docs/index-explained.md">Penjelasan indeks Milvus</a> - bagaimana IVF_RABITQ cocok dengan pilihan indeks lainnya.</li>
<li>Pengindeksan<a href="https://milvus.io/docs/ivf-flat.md">IVF_FLAT</a> dan <a href="https://milvus.io/docs/hnsw.md">pengindeksan HNSW</a> - garis dasar yang berguna jika Anda membandingkan pertukaran indeks.</li>
<li><a href="https://milvus.io/docs/schema.md">Desain skema di Milvus</a> dan <a href="https://milvus.io/docs/filtered-search.md">pencarian terfilter</a> - berguna jika Anda mengevaluasi RaBitQ di aplikasi nyata dan bukan secara terpisah.</li>
<li><a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a> dan <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">desain sistem RAG</a> - berguna jika Anda ingin mencobanya dalam pipeline pengambilan.</li>
</ul>
<p>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> atau <a href="https://milvus.io/office-hours">pesan Jam Kerja Milvus</a> jika Anda ingin membicarakan beban kerja Anda.</p>
<p>Jika Anda lebih suka melewatkan penyiapan infrastruktur, Anda bisa <a href="https://cloud.zilliz.com/signup">mendaftar ke Zilliz Cloud</a> (Milvus yang dikelola sepenuhnya).</p>
