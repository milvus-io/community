---
id: milvus-exceeds-40k-github-stars.md
title: >-
  7 Tahun, 2 Pembangunan Ulang Besar-besaran, 40K+ Bintang GitHub: Bangkitnya
  Milvus sebagai Basis Data Vektor Sumber Terbuka Terkemuka
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: >-
  Merayakan 7 Tahun Perjalanan Milvus Menjadi Database Vektor Sumber Terbuka
  Terkemuka di Dunia
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>Pada bulan Juni 2025, Milvus mencapai 35.000 bintang GitHub. Hanya dalam beberapa bulan, kami telah <a href="https://github.com/milvus-io/milvus">melewati angka 40.000. Ini</a>bukan hanya <a href="https://github.com/milvus-io/milvus">bukti</a>momentum, tetapi juga bukti komunitas global yang terus mendorong masa depan pencarian vektor dan multimoda.</p>
<p>Kami sangat berterima kasih. Kepada semua orang yang telah membintangi, bercabang, mengajukan masalah, berdebat tentang API, berbagi tolok ukur, atau membangun sesuatu yang luar biasa dengan Milvus: <strong>Terima kasih, dan Anda adalah alasan mengapa proyek ini bergerak secepat ini.</strong> Setiap bintang mewakili lebih dari sekadar tombol yang ditekan - ini mencerminkan seseorang yang memilih Milvus untuk mendukung pekerjaan mereka, seseorang yang percaya dengan apa yang kami bangun, seseorang yang memiliki visi yang sama dengan kami untuk infrastruktur AI yang terbuka, mudah diakses, dan berkinerja tinggi.</p>
<p>Jadi, saat kami merayakannya, kami juga melihat ke depan - ke fitur-fitur yang Anda minta, ke arsitektur yang sekarang dibutuhkan oleh AI, dan ke dunia di mana pemahaman multimodal dan semantik menjadi standar di setiap aplikasi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">Perjalanan: Dari Nol hingga 40.000+ Bintang<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika kami mulai membangun Milvus pada tahun 2017, istilah <em>basis data vektor</em> bahkan belum ada. Kami hanyalah sebuah tim kecil yang terdiri dari para insinyur yang yakin bahwa aplikasi AI akan segera membutuhkan jenis infrastruktur data baru - yang dibangun bukan untuk baris dan kolom, tetapi untuk data berdimensi tinggi, tidak terstruktur, dan multimodal. Basis data tradisional tidak dibuat untuk dunia tersebut, dan kami tahu bahwa seseorang harus membayangkan kembali seperti apa penyimpanan dan pengambilannya.</p>
<p>Masa-masa awal sangat jauh dari kata glamor. Membangun infrastruktur tingkat perusahaan berjalan lambat dan sulit - kami menghabiskan waktu berminggu-minggu <strong>untuk</strong> membuat profil jalur kode, menulis ulang komponen, dan mempertanyakan pilihan desain pada pukul 2 pagi. Namun kami berpegang pada misi yang sederhana: <strong>membuat pencarian vektor dapat diakses, dapat diskalakan, dan dapat diandalkan oleh setiap pengembang yang membangun aplikasi AI</strong>. Misi tersebut membawa kami melewati terobosan pertama dan melalui kemunduran yang tak terelakkan.</p>
<p>Dan di sepanjang jalan, beberapa titik balik mengubah segalanya:</p>
<ul>
<li><p><strong>2019:</strong> Kami membuka sumber terbuka Milvus 0.10. Ini berarti mengekspos semua sisi buruk kami - peretasan, TODO, bagian yang belum kami banggakan. Tetapi komunitas muncul. Para pengembang mengajukan masalah yang tidak pernah kami temukan, mengusulkan fitur yang tidak pernah kami bayangkan, dan menantang asumsi yang pada akhirnya membuat Milvus menjadi lebih kuat.</p></li>
<li><p><strong>2020-2021:</strong> Kami bergabung dengan <a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data Foundation</a>, meluncurkan Milvus 1.0, lulus dari LF AI &amp; Data, dan memenangkan tantangan pencarian vektor berskala miliaran <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN-bukti</a> awal bahwa arsitektur kami dapat menangani skala dunia nyata.</p></li>
<li><p><strong>2022:</strong> Pengguna perusahaan membutuhkan penskalaan asli Kubernetes, elastisitas, dan pemisahan nyata antara penyimpanan dan komputasi. Kami dihadapkan pada keputusan sulit: menambal sistem lama atau membangun ulang semuanya. Kami memilih jalan yang lebih sulit. <strong>Milvus 2.0 merupakan penemuan ulang dari awal</strong>, memperkenalkan arsitektur cloud-native yang sepenuhnya terpisah yang mengubah Milvus menjadi platform kelas produksi untuk beban kerja AI yang sangat penting.</p></li>
<li><p><strong>2024-2025:</strong> <a href="https://zilliz.com/">Zilliz</a> (tim di balik Milvus) dinobatkan <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">sebagai pemimpin oleh Forrester</a>, melonjak melewati 30.000 bintang, dan sekarang melampaui 40.000 bintang. Zilliz menjadi tulang punggung untuk pencarian multimodal, sistem RAG, alur kerja agen, dan pencarian berskala miliaran di berbagai industri-pendidikan, keuangan, produksi kreatif, penelitian ilmiah, dan banyak lagi.</p></li>
</ul>
<p>Pencapaian ini diperoleh bukan karena hype, tetapi karena para pengembang memilih Milvus untuk beban kerja produksi yang nyata dan mendorong kami untuk meningkatkan setiap langkahnya.</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025: Dua Rilis Besar, Peningkatan Performa Besar-besaran<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>Tahun 2025 adalah tahun di mana Milvus melangkah ke liga yang baru. Meskipun pencarian vektor unggul dalam pemahaman semantik, kenyataannya dalam produksi adalah sederhana: <strong>pengembang masih membutuhkan pencocokan kata kunci yang tepat</strong> untuk ID produk, nomor seri, frasa yang tepat, istilah hukum, dan banyak lagi. Tanpa pencarian teks lengkap asli, tim dipaksa untuk mempertahankan klaster Elasticsearch/OpenSearch atau menyatukan solusi khusus mereka sendiri - menggandakan biaya operasional dan fragmentasi.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.5</strong></a> <strong>mengubahnya.</strong> Milvus 2.5 memperkenalkan <strong>pencarian hibrida yang benar-benar asli</strong>, menggabungkan pencarian teks lengkap dan pencarian vektor ke dalam satu mesin. Untuk pertama kalinya, para pengembang dapat menjalankan kueri leksikal, kueri semantik, dan filter metadata secara bersamaan tanpa harus menyulap sistem tambahan atau menyinkronkan pipeline. Kami juga meningkatkan pemfilteran metadata, penguraian ekspresi, dan efisiensi eksekusi sehingga kueri hibrida terasa alami - dan cepat - di bawah beban produksi yang sebenarnya.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> <strong>mendorong momentum ini lebih jauh lagi</strong>, dengan menargetkan dua tantangan yang paling sering kami dengar dari para pengguna yang menjalankan dalam skala besar: <strong><em>biaya</em> dan <em>performa</em></strong>. Rilis ini menghadirkan peningkatan arsitektur yang mendalam - jalur kueri yang lebih mudah diprediksi, pengindeksan yang lebih cepat, penggunaan memori yang jauh lebih rendah, dan penyimpanan yang jauh lebih efisien. Banyak tim melaporkan keuntungan langsung tanpa mengubah satu baris pun kode aplikasi.</p>
<p>Berikut adalah beberapa hal penting dari Milvus 2.6:</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>Penyimpanan berjenjang</strong></a> yang memungkinkan tim menyeimbangkan biaya dan kinerja dengan lebih cerdas, memangkas biaya penyimpanan hingga 50%.</p></li>
<li><p><strong>Penghematan memori yang sangat besar</strong> melalui <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">kuantisasi RaBitQ 1-bit</a> - mengurangi penggunaan memori hingga 72% namun tetap memberikan kueri yang lebih cepat.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>Mesin teks lengkap yang didesain ulang</strong></a> dengan implementasi BM25 yang jauh lebih cepat - hingga 4 kali lebih cepat daripada Elasticsearch dalam tolok ukur kami.</p></li>
<li><p><strong>Indeks Jalur baru</strong> untuk <a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">metadata berstruktur JSON</a>, membuka penyaringan hingga 100× lebih cepat pada dokumen yang kompleks.</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>:</a> kompresi skala miliaran dengan pengurangan penyimpanan 3200× dan pemanggilan kembali yang kuat</p></li>
<li><p><a href="https://milvus.io/docs/geometry-operators.md"><strong>Pencarian</strong></a><strong>Semantik +</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>Geospasial</strong></a> <strong>dengan R-Tree:</strong> Menggabungkan <em>lokasi benda</em> dengan <em>artinya</em> untuk hasil yang lebih relevan</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA + Vamana</strong></a><strong>:</strong> Memangkas biaya penerapan dengan mode CAGRA hibrida yang dibangun di atas GPU tetapi melakukan kueri di CPU</p></li>
<li><p><strong>Alur kerja</strong><strong>"</strong><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>data masuk, data keluar</strong></a><strong>"</strong> yang menyederhanakan penyematan dan pengambilan data, terutama untuk pipeline multimodal.</p></li>
<li><p><strong>Dukungan hingga 100 ribu koleksi</strong> dalam satu cluster - sebuah langkah besar menuju multi-tenancy dalam skala besar.</p></li>
</ul>
<p>Untuk melihat lebih dalam tentang Milvus 2.6, lihat <a href="https://milvus.io/docs/release_notes.md">catatan rilis lengkapnya</a>.</p>
<p><a href="https://zilliz.com/event/milvus-2-6-deep-dive-faster-search-lower-cost-smarter-scaling?utm_source=milvusio&amp;utm_medium=milvus-40k-stars&amp;utm_campaign=milvus-26-webinar">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Webinar_Milvus_2_6_Webinar_5_4_Twitter_a4e8dbf7e4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Lebih dari Milvus: Alat Sumber Terbuka untuk Pengembang AI<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada tahun 2025, kami tidak hanya meningkatkan Milvus-kami membangun alat yang memperkuat seluruh ekosistem pengembang AI. Tujuan kami bukan untuk mengejar tren, tetapi untuk memberikan para pengembang alat yang terbuka, kuat, dan transparan yang selalu kami harapkan.</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher: Penelitian Tanpa Penguncian Cloud</h3><p>Deep Researcher dari OpenAI membuktikan apa yang dapat dilakukan oleh agen penalaran mendalam. Tapi itu tertutup, mahal, dan terkunci di balik API cloud. <a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher</strong></a> <strong>adalah jawaban kami</strong>. Ini adalah mesin riset mendalam bersumber terbuka lokal yang dirancang untuk siapa saja yang menginginkan investigasi terstruktur tanpa mengorbankan kontrol atau privasi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher berjalan sepenuhnya di mesin Anda, mengumpulkan informasi dari berbagai sumber, mensintesis wawasan, dan memberikan kutipan, langkah penalaran, dan penelusuran-fitur yang penting untuk penelitian yang sebenarnya, bukan hanya ringkasan di permukaan. Tidak ada kotak hitam. Tidak ada penguncian vendor. Hanya analisis yang transparan dan dapat direproduksi yang dapat dipercaya oleh para pengembang dan peneliti.</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">Konteks Claude: Asisten Pengkodean yang Benar-Benar Memahami Kode Anda</h3><p>Sebagian besar alat pengkodean AI masih berperilaku seperti pipa grep yang mewah-cepat, dangkal, pembakaran token, dan tidak menyadari struktur proyek yang sebenarnya. <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> mengubahnya. Dibangun sebagai plugin MCP, akhirnya memberikan asisten pengkodean apa yang selama ini mereka lewatkan: pemahaman semantik asli dari basis kode Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context membangun indeks semantik bertenaga vektor di seluruh proyek Anda, memungkinkan agen menemukan modul yang tepat, mengikuti hubungan di seluruh file, memahami maksud tingkat arsitektur, dan menjawab pertanyaan dengan relevansi daripada menebak-nebak. Ini mengurangi pemborosan token, meningkatkan presisi, dan yang paling penting-membiarkan asisten pengkodean berperilaku seolah-olah mereka benar-benar memahami perangkat lunak Anda daripada berpura-pura.</p>
<p>Kedua alat ini sepenuhnya bersifat open source. Karena infrastruktur AI seharusnya menjadi milik semua orang - dan karena masa depan AI tidak boleh terkunci di balik tembok kepemilikan.</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">Dipercaya oleh 10.000+ Tim dalam Produksi<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Saat ini, lebih dari 10.000 tim perusahaan menjalankan Milvus dalam proses produksi-dari perusahaan rintisan yang sedang berkembang pesat hingga beberapa perusahaan teknologi paling mapan di dunia dan perusahaan-perusahaan yang masuk dalam daftar Fortune 500. Tim di NVIDIA, Salesforce, eBay, Airbnb, IBM, AT&amp;T, LINE, Shopee, Roblox, Bosch, dan di dalam Microsoft mengandalkan Milvus untuk menggerakkan sistem AI yang beroperasi setiap menit setiap hari. Beban kerja mereka meliputi pencarian, rekomendasi, saluran agen, pengambilan multimodal, dan aplikasi lain yang mendorong infrastruktur vektor hingga batasnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/logos_eb0d3ad4af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Namun, yang paling penting bukanlah <em>siapa yang</em> menggunakan Milvus, melainkan <em>apa yang mereka bangun dengan</em> Milvus. Di berbagai industri, Milvus berada di balik sistem yang membentuk cara bisnis beroperasi, berinovasi, dan bersaing:</p>
<ul>
<li><p><strong>Kopilot AI dan asisten perusahaan</strong> yang meningkatkan dukungan pelanggan, alur kerja penjualan, dan pengambilan keputusan internal dengan akses instan ke miliaran embedding.</p></li>
<li><p><strong>Pencarian semantik dan visual dalam e-commerce, media, dan periklanan</strong>, mendorong konversi yang lebih tinggi, penemuan yang lebih baik, dan produksi kreatif yang lebih cepat.</p></li>
<li><p><strong>Platform intelijen hukum, keuangan, dan ilmiah</strong> di mana ketepatan, kemampuan audit, dan kepatuhan diterjemahkan ke dalam keuntungan operasional yang nyata.</p></li>
<li><p><strong>Deteksi penipuan dan mesin risiko</strong> di fintech dan perbankan yang bergantung pada pencocokan semantik yang cepat untuk mencegah kerugian secara real time.</p></li>
<li><p><strong>RAG berskala besar dan sistem agen</strong> yang memberikan perilaku AI yang sangat kontekstual dan sadar akan domain kepada tim.</p></li>
<li><p><strong>Lapisan pengetahuan perusahaan</strong> yang menyatukan teks, kode, gambar, dan metadata ke dalam satu jalinan semantik yang koheren.</p></li>
</ul>
<p>Dan ini bukanlah tolok ukur laboratorium-ini adalah beberapa penerapan produksi yang paling menuntut di dunia. Milvus secara rutin memberikannya:</p>
<ul>
<li><p>Pengambilan dalam waktu sub-50ms di miliaran vektor</p></li>
<li><p>Miliaran dokumen dan peristiwa yang dikelola dalam satu sistem</p></li>
<li><p>Alur kerja 5-10× lebih cepat daripada solusi alternatif</p></li>
<li><p>Arsitektur multi-penyewa yang mendukung ratusan ribu koleksi</p></li>
</ul>
<p>Tim memilih Milvus karena alasan sederhana: Milvus <strong>memberikan yang terbaik dalam hal yang penting-kecepatan, keandalan, efisiensi biaya, dan kemampuan untuk meningkatkan skala hingga miliaran tanpa mengobrak-abrik arsitektur mereka setiap beberapa bulan</strong>. Kepercayaan yang diberikan oleh tim-tim ini kepada kami adalah alasan kami terus memperkuat Milvus untuk dekade AI di masa depan.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">Saat Anda Membutuhkan Milvus Tanpa Operasi: Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus gratis, kuat, dan telah teruji dalam pertempuran. Namun, Milvus juga merupakan sistem terdistribusi-dan menjalankan sistem terdistribusi dengan baik adalah pekerjaan teknik yang sesungguhnya. Penyetelan indeks, manajemen memori, stabilitas cluster, penskalaan, pengamatan... tugas-tugas ini membutuhkan waktu dan keahlian yang tidak dimiliki oleh banyak tim. Para pengembang menginginkan kekuatan Milvus, hanya saja tanpa beban operasional yang pasti muncul saat mengelolanya dalam skala besar.</p>
<p>Kenyataan ini membawa kami pada kesimpulan sederhana: jika Milvus akan menjadi infrastruktur inti untuk aplikasi AI, kami perlu membuatnya mudah dioperasikan. Itulah mengapa kami membangun <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>, layanan Milvus yang dikelola sepenuhnya yang dibuat dan dikelola oleh tim yang sama di balik proyek sumber terbuka.</p>
<p>Zilliz Cloud memberikan para pengembang Milvus yang sudah mereka kenal dan percayai-tetapi tanpa penyediaan cluster, masalah kinerja pemadaman kebakaran, merencanakan peningkatan, atau mengkhawatirkan penyimpanan dan penyetelan komputasi. Dan karena mencakup pengoptimalan yang tidak mungkin dijalankan di lingkungan yang dikelola sendiri, Milvus menjadi lebih cepat dan lebih andal. <a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a>, mesin vektor kelas komersial kami yang mengoptimalkan sendiri, memberikan kinerja 10× lipat dari <strong>Milvus open-source</strong>.</p>
<p><strong>Yang Membedakan Zilliz Cloud</strong></p>
<ul>
<li><strong>Performa yang mengoptimalkan sendiri:</strong> AutoIndex secara otomatis menyetel HNSW, IVF, dan DiskANN, memberikan recall 96%+ tanpa konfigurasi manual.</li>
</ul>
<ul>
<li><p><strong>Elastis &amp; hemat biaya:</strong> Harga bayar sesuai pemakaian, autoscaling tanpa server, dan manajemen sumber daya cerdas sering kali mengurangi biaya hingga 50% atau lebih dibandingkan dengan penerapan yang dikelola sendiri.</p></li>
<li><p><strong>Keandalan tingkat perusahaan:</strong> SLA waktu aktif 99,95%, redundansi multi-AZ, SOC 2 Tipe II, ISO 27001, dan kepatuhan terhadap GDPR. Dukungan penuh untuk RBAC, BYOC, log audit, dan enkripsi.</p></li>
<li><p><strong>Penerapan cloud-agnostik:</strong> Dijalankan di AWS, Azure, GCP, Alibaba Cloud, atau Tencent Cloud-tanpa penguncian vendor, performa yang konsisten di mana saja.</p></li>
<li><p><strong>Kueri bahasa alami:</strong> Dukungan server MCP internal memungkinkan Anda melakukan kueri data secara percakapan alih-alih membuat panggilan API secara manual.</p></li>
<li><p><strong>Migrasi yang mudah</strong>: Pindah dari Milvus, Pinecone, Qdrant, Weaviate, Elasticsearch, atau PostgreSQL menggunakan alat migrasi bawaan - tidak perlu menulis ulang skema atau waktu henti.</p></li>
<li><p><strong>100% kompatibel dengan Milvus yang bersumber terbuka.</strong> Tidak ada garpu berpemilik. Tidak ada penguncian. Hanya Milvus, yang dibuat lebih mudah.</p></li>
</ul>
<p><strong>Milvus akan selalu menjadi sumber terbuka dan bebas digunakan.</strong> Namun, menjalankan dan mengoperasikannya dengan andal pada skala perusahaan membutuhkan keahlian dan sumber daya yang signifikan. <strong>Zilliz Cloud adalah jawaban kami untuk kesenjangan itu</strong>. Disebarkan di 29 wilayah dan lima cloud utama, Zilliz Cloud memberikan kinerja, keamanan, dan efisiensi biaya tingkat perusahaan sambil menjaga Anda tetap selaras dengan Milvus yang sudah Anda kenal.</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>Mulai uji coba gratis →</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">Selanjutnya: Danau Milvus<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagai tim yang memperkenalkan database vektor, kami telah melihat langsung bagaimana data perusahaan berubah. Apa yang dulunya muat dengan rapi ke dalam terabyte tabel terstruktur dengan cepat berubah menjadi petabyte - dan segera menjadi triliunan - objek multimodal. Teks, gambar, audio, video, aliran deret waktu, log multi-sensor... semua ini sekarang mendefinisikan kumpulan data yang diandalkan oleh sistem AI modern.</p>
<p>Basis data vektor dibuat khusus untuk data yang tidak terstruktur dan multimodal, tetapi tidak selalu merupakan pilihan yang paling ekonomis atau baik secara arsitektural-terutama jika sebagian besar datanya adalah data dingin. Korporasi pelatihan untuk model besar, log persepsi mengemudi secara otonom, dan kumpulan data robotika biasanya tidak memerlukan latensi tingkat milidetik atau konkurensi yang tinggi. Menjalankan volume data ini melalui basis data vektor waktu nyata menjadi mahal, berat secara operasional, dan terlalu rumit untuk pipeline yang tidak memerlukan tingkat kinerja tersebut.</p>
<p>Kenyataan tersebut membawa kami pada inisiatif besar berikutnya: <strong>Milvus Lake-sebuah</strong>danau multimodal berbasis semantik dan berbasis indeks yang dirancang untuk data berskala AI. Milvus Lake menyatukan sinyal semantik di setiap modalitas-vektor, metadata, label, deskripsi yang dihasilkan LLM, dan bidang terstruktur-dan mengorganisasikannya ke dalam <strong>Semantic Wide Table</strong> yang berlabuh di sekitar entitas bisnis yang nyata. Data yang sebelumnya berada dalam bentuk file mentah yang tersebar di penyimpanan objek, lakehouse, dan pipeline model menjadi lapisan semantik yang terpadu dan dapat ditanyakan. Korporasi multimodal yang sangat besar berubah menjadi aset yang dapat dikelola, diambil, dan dapat digunakan kembali dengan makna yang konsisten di seluruh perusahaan.</p>
<p>Di bawah tenda, Milvus Lake dibangun di atas arsitektur <strong>manifes + data + indeks</strong> yang bersih yang memperlakukan pengindeksan sebagai hal yang mendasar, bukan sebagai renungan. Hal ini membuka alur kerja "ambil dulu, proses kemudian" yang dioptimalkan untuk data dingin berskala triliunan-menawarkan latensi yang dapat diprediksi, biaya penyimpanan yang jauh lebih rendah, dan stabilitas operasional yang jauh lebih besar. Pendekatan penyimpanan berjenjang - NVMe / SSD untuk jalur panas dan penyimpanan objek untuk arsip dalam - dipasangkan dengan kompresi yang efisien dan indeks yang dimuat dengan malas mempertahankan ketepatan semantik sambil menjaga infrastruktur tetap terkendali.</p>
<p>Milvus Lake juga terhubung dengan mulus ke dalam ekosistem data modern, terintegrasi dengan Paimon, Iceberg, Hudi, Spark, Ray, dan mesin serta format data besar lainnya. Tim dapat menjalankan pemrosesan batch, pipeline nyaris seketika, pengambilan semantik, rekayasa fitur, dan persiapan data pelatihan di satu tempat-tanpa perlu memformat ulang alur kerja yang sudah ada. Baik Anda sedang membangun korporasi model fondasi, mengelola perpustakaan simulasi mengemudi otonom, melatih agen robotika, atau memberdayakan sistem pengambilan berskala besar, Milvus Lake menyediakan gudang semantik yang dapat diperluas dan hemat biaya untuk era AI.</p>
<p><strong>Milvus Lake sedang dalam pengembangan aktif.</strong> Tertarik dengan akses awal atau ingin mempelajari lebih lanjut?<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>Hubungi kami →</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">Dibangun oleh Komunitas, Untuk Komunitas<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Yang membuat Milvus istimewa bukan hanya teknologinya, tetapi juga orang-orang di belakangnya. Basis kontributor kami tersebar di seluruh dunia, menyatukan para ahli dari komputasi berkinerja tinggi, sistem terdistribusi, dan infrastruktur AI. Insinyur dan peneliti dari ARM, NVIDIA, AMD, Intel, Meta, IBM, Salesforce, Alibaba, Microsoft, dan masih banyak lagi yang menyumbangkan keahliannya untuk membentuk Milvus menjadi seperti sekarang ini.</p>
<p>Setiap pull request, setiap laporan bug, setiap pertanyaan yang dijawab di forum kami, setiap tutorial yang dibuat-kontribusi ini membuat Milvus menjadi lebih baik untuk semua orang.</p>
<p>Pencapaian ini adalah milik Anda semua:</p>
<ul>
<li><p><strong>Untuk para kontributor kami</strong>: Terima kasih atas kode, ide, dan waktu Anda. Anda membuat Milvus menjadi lebih baik setiap harinya.</p></li>
<li><p><strong>Kepada para pengguna kami</strong>: Terima kasih telah mempercayai Milvus dengan beban kerja produksi Anda dan berbagi pengalaman Anda, baik yang menyenangkan maupun yang menantang. Umpan balik Anda mendorong peta jalan kami.</p></li>
<li><p><strong>Kepada para pendukung komunitas kami</strong>: Terima kasih telah menjawab pertanyaan, menulis tutorial, membuat konten, dan membantu pengguna baru untuk memulai. Anda membuat komunitas kami ramah dan inklusif.</p></li>
<li><p><strong>Kepada mitra dan integrator kami</strong>: Terima kasih telah membangun bersama kami dan menjadikan Milvus sebagai warga kelas satu dalam ekosistem pengembangan AI.</p></li>
<li><p><strong>Kepada tim Zilliz</strong>: Terima kasih atas komitmen Anda yang tak tergoyahkan untuk proyek open-source dan kesuksesan pengguna kami.</p></li>
</ul>
<p>Milvus telah berkembang karena ribuan orang memutuskan untuk membangun sesuatu bersama - secara terbuka, murah hati, dan dengan keyakinan bahwa infrastruktur dasar AI harus dapat diakses oleh semua orang.</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">Bergabunglah dengan Kami dalam Perjalanan Ini<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Baik Anda sedang membangun aplikasi pencarian vektor pertama Anda atau mengembangkannya menjadi miliaran vektor, kami ingin Anda menjadi bagian dari komunitas Milvus.</p>
<p><strong>Memulai</strong>:</p>
<ul>
<li><p><strong>Bintangi kami di GitHub</strong>:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️ <strong>Coba Zilliz Cloud Gratis</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬 <strong>Bergabunglah dengan</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a> <strong>kami</strong> untuk terhubung dengan para pengembang di seluruh dunia</p></li>
<li><p>📚 <strong>Jelajahi dokumen kami</strong>: <a href="https://milvus.io/docs">Dokumentasi Milvus</a></p></li>
<li><p>💬 <strong>Pesan</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>sesi 20 menit</strong></a> untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda.</p></li>
</ul>
<p>Jalan ke depan sangat menarik. Ketika AI membentuk kembali industri dan membuka kemungkinan-kemungkinan baru, basis data vektor akan menjadi inti dari transformasi ini. Bersama-sama, kami membangun fondasi semantik yang diandalkan oleh aplikasi AI modern - dan kami baru saja memulai.</p>
<p>Ini untuk 40.000 bintang berikutnya, dan untuk membangun masa depan infrastruktur AI <strong>bersama-sama</strong>. 🎉</p>
