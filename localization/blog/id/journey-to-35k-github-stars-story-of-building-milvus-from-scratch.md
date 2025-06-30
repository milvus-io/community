---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: >-
  Perjalanan Kami Menuju 35K+ Bintang GitHub: Kisah Nyata Membangun Milvus dari
  Awal
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  Bergabunglah bersama kami untuk merayakan Milvus, basis data vektor yang telah
  mencapai 35,5 juta bintang di GitHub. Temukan kisah kami dan bagaimana kami
  membuat solusi AI menjadi lebih mudah bagi para pengembang.
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>Selama beberapa tahun terakhir, kami telah berfokus pada satu hal: membangun basis data vektor yang siap pakai untuk era AI. Bagian tersulitnya bukanlah membangun basis data <em>,</em> melainkan membangun basis data yang dapat diskalakan, mudah digunakan, dan benar-benar memecahkan masalah nyata dalam produksi.</p>
<p>Pada bulan Juni ini, kami mencapai tonggak sejarah baru: Milvus mencapai <a href="https://github.com/milvus-io/milvus">35.000 bintang di GitHub</a> (sekarang memiliki 35,5 juta+ bintang pada saat artikel ini ditulis). Kami tidak akan berpura-pura bahwa ini hanyalah angka-angka biasa - ini sangat berarti bagi kami.</p>
<p>Setiap bintang mewakili seorang pengembang yang meluangkan waktu untuk melihat apa yang telah kami buat, merasa cukup berguna untuk menandai, dan dalam banyak kasus, memutuskan untuk menggunakannya. Beberapa dari Anda telah melangkah lebih jauh: mengajukan masalah, menyumbangkan kode, menjawab pertanyaan di forum kami, dan membantu pengembang lain ketika mereka mengalami kesulitan.</p>
<p>Kami ingin meluangkan waktu sejenak untuk berbagi cerita kami - yang sebenarnya, dengan semua bagian yang berantakan.</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">Kami Mulai Membangun Milvus Karena Tidak Ada Cara Lain yang Berhasil<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada tahun 2017, kami memulai dengan sebuah pertanyaan sederhana: Ketika aplikasi AI mulai bermunculan dan data tidak terstruktur meledak, bagaimana cara Anda menyimpan dan mencari sematan vektor yang mendukung pemahaman semantik secara efisien?</p>
<p>Basis data tradisional tidak dibuat untuk hal ini. Mereka dioptimalkan untuk baris dan kolom, bukan vektor berdimensi tinggi. Teknologi dan alat yang ada tidak memungkinkan atau sangat lambat untuk apa yang kami butuhkan.</p>
<p>Kami mencoba semua yang tersedia. Meretas solusi bersama dengan Elasticsearch. Membangun indeks khusus di atas MySQL. Bahkan bereksperimen dengan FAISS, tetapi dirancang sebagai perpustakaan penelitian, bukan infrastruktur basis data produksi. Tidak ada yang memberikan solusi lengkap yang kami bayangkan untuk beban kerja AI perusahaan.</p>
<p><strong>Jadi kami mulai membangunnya sendiri.</strong> Bukan karena kami pikir ini akan mudah - database terkenal sulit untuk dikerjakan dengan benar - tetapi karena kami dapat melihat ke mana arah AI dan tahu bahwa AI membutuhkan infrastruktur yang dibangun khusus untuk mencapainya.</p>
<p>Pada tahun 2018, kami mengembangkan apa yang akan menjadi <a href="https://milvus.io/">Milvus</a>. Istilah &quot;<strong>basis data vektor</strong>&quot; bahkan belum ada. Pada dasarnya kami sedang menciptakan kategori baru perangkat lunak infrastruktur, yang sangat menarik sekaligus menakutkan.</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Sumber Terbuka Milvus: Membangun secara Publik<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada bulan November 2019, kami memutuskan untuk membuat Milvus versi 0.10 secara terbuka.</p>
<p>Open-sourcing berarti mengekspos semua kekurangan Anda kepada dunia. Setiap peretasan, setiap komentar TODO, setiap keputusan desain yang tidak sepenuhnya Anda yakini. Namun kami percaya bahwa jika database vektor akan menjadi infrastruktur penting untuk AI, maka database tersebut harus terbuka dan dapat diakses oleh semua orang.</p>
<p>Tanggapannya sangat luar biasa. Para pengembang tidak hanya menggunakan Milvus-mereka memperbaikinya. Mereka menemukan bug yang kami lewatkan, menyarankan fitur yang tidak kami pertimbangkan, dan mengajukan pertanyaan yang membuat kami berpikir lebih keras tentang pilihan desain kami.</p>
<p>Pada tahun 2020, kami bergabung dengan <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. Ini bukan hanya untuk kredibilitas-ini mengajarkan kami cara mempertahankan proyek sumber terbuka yang berkelanjutan. Bagaimana menangani tata kelola, kompatibilitas ke belakang, dan membangun perangkat lunak yang bertahan selama bertahun-tahun, bukan hanya beberapa bulan.</p>
<p>Pada tahun 2021, kami merilis Milvus 1.0 dan <a href="https://lfaidata.foundation/projects/milvus/">lulus dari LF AI &amp; Data Foundation</a>. Pada tahun yang sama, kami memenangkan <a href="https://big-ann-benchmarks.com/neurips21.html">tantangan global BigANN</a> untuk pencarian vektor berskala miliaran. Kemenangan itu terasa menyenangkan, tetapi yang lebih penting, kemenangan itu memvalidasi bahwa kami memecahkan masalah nyata dengan cara yang benar.</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">Keputusan Tersulit: Memulai dari Awal<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>Di sinilah segalanya menjadi rumit. Pada tahun 2021, Milvus 1.0 bekerja dengan baik untuk banyak kasus penggunaan, tetapi pelanggan perusahaan terus meminta hal yang sama: arsitektur cloud-native yang lebih baik, penskalaan horizontal yang lebih mudah, dan lebih banyak kesederhanaan operasional.</p>
<p>Kami punya pilihan: menambal jalan ke depan atau membangun ulang dari awal. Kami memilih untuk membangun kembali.</p>
<p>Milvus 2.0 pada dasarnya adalah penulisan ulang yang lengkap. Kami memperkenalkan arsitektur komputasi-penyimpanan yang sepenuhnya terpisah dengan skalabilitas dinamis. Proses ini memakan waktu dua tahun dan sejujurnya merupakan salah satu periode paling menegangkan dalam sejarah perusahaan kami. Kami membuang sistem kerja yang digunakan ribuan orang untuk membangun sesuatu yang belum terbukti.</p>
<p><strong>Namun, ketika kami merilis Milvus 2.0 pada tahun 2022, kami mengubah Milvus dari basis data vektor yang kuat menjadi infrastruktur siap produksi yang dapat disesuaikan dengan beban kerja perusahaan.</strong> Pada tahun yang sama, kami juga menyelesaikan <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">putaran pendanaan Seri B+-bukan</a>untuk menghambur-hamburkan uang, tetapi untuk menggandakan kualitas produk dan dukungan bagi pelanggan global. Kami tahu bahwa perjalanan ini akan memakan waktu, tetapi setiap langkah harus dibangun di atas fondasi yang kuat.</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">Ketika Semuanya Dipercepat dengan AI<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>Tahun 2023 adalah tahun <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (retrieval-augmented generation). Tiba-tiba, pencarian semantik berubah dari teknik AI yang menarik menjadi infrastruktur penting untuk chatbot, sistem tanya jawab dokumen, dan agen AI.</p>
<p>Bintang GitHub dari Milvus melonjak. Permintaan dukungan berlipat ganda. Para pengembang yang belum pernah mendengar tentang database vektor tiba-tiba mengajukan pertanyaan-pertanyaan rumit tentang strategi pengindeksan dan pengoptimalan kueri.</p>
<p>Pertumbuhan ini sangat menyenangkan tetapi juga membuat kami kewalahan. Kami menyadari bahwa kami tidak hanya perlu meningkatkan teknologi kami, tetapi juga seluruh pendekatan kami terhadap dukungan komunitas. Kami merekrut lebih banyak pendukung pengembang, menulis ulang dokumentasi kami secara menyeluruh, dan mulai membuat konten edukasi untuk pengembang yang baru mengenal database vektor.</p>
<p>Kami juga meluncurkan <a href="https://zilliz.com/cloud">Zilliz Cloud -</a>versi Milvus yang dikelola sepenuhnya <a href="https://zilliz.com/cloud">oleh kami</a>. Beberapa orang bertanya mengapa kami "mengkomersialkan" proyek sumber terbuka kami. Jawaban yang paling tepat adalah karena memelihara infrastruktur tingkat perusahaan itu mahal dan kompleks. Zilliz Cloud memungkinkan kami untuk mempertahankan dan mempercepat pengembangan Milvus sambil tetap menjaga proyek inti tetap open source.</p>
<p>Lalu tibalah tahun 2024. <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forrester menobatkan kami sebagai pemimpin</strong></a> <strong>dalam kategori database vektor</strong>. Milvus melewati 30.000 bintang GitHub. <strong>Dan kami menyadari: jalan yang telah kami rintis selama tujuh tahun akhirnya menjadi jalan raya.</strong> Seiring dengan semakin banyaknya perusahaan yang mengadopsi basis data vektor sebagai infrastruktur penting, pertumbuhan bisnis kami melaju dengan cepat-memvalidasi bahwa fondasi yang telah kami bangun dapat berkembang baik secara teknis maupun komersial.</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">Tim di Balik Milvus: Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>Ada satu hal yang menarik: banyak orang yang mengenal Milvus, tetapi tidak mengenal Zilliz. Kami tidak mempermasalahkan hal itu. <a href="https://zilliz.com/"><strong>Zilliz</strong></a> <strong>adalah tim di balik Milvus-kami membangunnya, memeliharanya, dan mendukungnya</strong>.</p>
<p>Yang paling kami pedulikan adalah hal-hal yang tidak glamor yang membuat perbedaan antara demo yang keren dan infrastruktur yang siap produksi: pengoptimalan kinerja, patch keamanan, dokumentasi yang benar-benar membantu pemula, dan menanggapi masalah GitHub dengan bijaksana.</p>
<p>Kami telah membangun tim dukungan global 24/7 di seluruh Amerika Serikat, Eropa, dan Asia, karena para pengembang membutuhkan bantuan di zona waktu mereka, bukan zona waktu kami. Kami memiliki kontributor komunitas yang kami sebut &quot;<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Milvus Ambassador</a>&quot; yang menyelenggarakan acara, menjawab pertanyaan forum, dan sering kali menjelaskan konsep dengan lebih baik daripada kami.</p>
<p>Kami juga menyambut baik integrasi dengan AWS, GCP, dan penyedia cloud lainnya-bahkan ketika mereka menawarkan versi terkelola Milvus mereka sendiri. Lebih banyak opsi penerapan bagus untuk pengguna. Meskipun kami telah memperhatikan bahwa ketika tim menghadapi tantangan teknis yang rumit, mereka sering kali menghubungi kami secara langsung karena kami memahami sistem di tingkat terdalam.</p>
<p>Banyak orang mengira bahwa open source hanyalah sebuah &quot;kotak peralatan&quot;, namun sebenarnya ini adalah sebuah &quot;proses evolusi&quot; - sebuah upaya kolektif dari banyak orang yang mencintai dan mempercayainya. Hanya mereka yang benar-benar memahami arsitektur yang dapat memberikan "alasan" di balik perbaikan bug, analisis hambatan kinerja, integrasi sistem data, dan penyesuaian arsitektur.</p>
<p><strong>Jadi, jika Anda menggunakan Milvus sumber terbuka, atau mempertimbangkan database vektor sebagai komponen inti dari sistem AI Anda, kami mendorong Anda untuk menghubungi kami secara langsung untuk mendapatkan dukungan yang paling profesional dan tepat waktu.</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">Dampak Nyata dalam Produksi: Kepercayaan dari Pengguna<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Kasus penggunaan Milvus telah berkembang melampaui apa yang kami bayangkan sebelumnya. Kami memberdayakan infrastruktur AI untuk beberapa perusahaan paling menuntut di dunia di setiap industri.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_66d3adfe97.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>pelanggan zilliz.png</span> </span></p>
<p><a href="https://zilliz.com/customers/bosch"><strong>Bosch</strong></a>, pemimpin teknologi otomotif global dan pelopor dalam pengemudian otonom, merevolusi analisis data mereka dengan Milvus yang berhasil mengurangi 80% biaya pengumpulan data dan penghematan tahunan sebesar $1,4 juta saat mencari miliaran skenario mengemudi dalam hitungan milidetik untuk kasus-kasus yang sangat penting.</p>
<p><a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a>, salah satu perusahaan AI dengan pertumbuhan produktivitas tercepat yang melayani jutaan pengguna aktif bulanan, menggunakan Milvus untuk mencapai latensi pengambilan sub-20-50ms di miliaran catatan dan 5 kali lebih cepat dalam pencarian agen. CTO mereka mengatakan, "Milvus berfungsi sebagai repositori pusat dan mendukung pencarian informasi kami di antara miliaran catatan."</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>Pemimpin fintech global</strong></a>, salah satu platform pembayaran digital terbesar di dunia yang memproses puluhan miliar transaksi di lebih dari 200 negara dan 25 mata uang, memilih Milvus karena proses pencarian yang 5-10 kali lebih cepat daripada pesaing, menyelesaikan pekerjaan dalam waktu kurang dari 1 jam, padahal pesaing lain membutuhkan waktu lebih dari 8 jam.</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a>, platform kerja hukum terkemuka yang dipercaya oleh ribuan firma hukum di seluruh Amerika Serikat, mengelola 3 miliar vektor di jutaan dokumen hukum, menghemat 60-80% waktu pengacara dalam analisis dokumen dan mencapai "kesadaran data yang sebenarnya" untuk manajemen kasus hukum.</p>
<p>Kami juga mendukung <strong>NVIDIA, OpenAI, Microsoft, Salesforce, Walmart</strong>, dan banyak <strong>perusahaan</strong> lainnya di hampir semua industri. Lebih dari 10.000 organisasi telah menjadikan Milvus atau Zilliz Cloud sebagai basis data vektor pilihan mereka.</p>
<p>Ini bukan hanya kisah sukses teknis - ini adalah contoh bagaimana database vektor secara diam-diam menjadi infrastruktur penting yang mendukung aplikasi AI yang digunakan orang setiap hari.</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">Mengapa Kami Membangun Zilliz Cloud: Basis Data Vektor Kelas Perusahaan sebagai Layanan<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus bersifat open-source dan gratis untuk digunakan. Tetapi menjalankan Milvus dengan baik pada skala perusahaan membutuhkan keahlian yang mendalam dan sumber daya yang signifikan. Pemilihan indeks, manajemen memori, strategi penskalaan, konfigurasi keamanan-ini bukanlah keputusan yang sepele. Banyak tim yang menginginkan kekuatan Milvus tanpa kerumitan operasional dan dengan dukungan perusahaan, jaminan SLA, dll.</p>
<p>Itulah mengapa kami membangun <a href="https://zilliz.com/cloud">Zilliz Cloud-versi</a>Milvus yang sepenuhnya terkelola yang digunakan di 25 wilayah global dan 5 cloud utama, termasuk AWS, GCP, dan Azure, yang dirancang khusus untuk beban kerja AI berskala perusahaan yang menuntut kinerja, keamanan, dan keandalan.</p>
<p>Inilah yang membuat Zilliz Cloud berbeda:</p>
<ul>
<li><p><strong>Skala Masif dengan Performa Tinggi:</strong> Mesin AutoIndex bertenaga AI milik kami memberikan kecepatan kueri 3-5 kali lebih cepat daripada Milvus open-source, tanpa perlu penyesuaian indeks. Arsitektur cloud-native mendukung miliaran vektor dan puluhan ribu kueri bersamaan dengan tetap mempertahankan waktu respons kurang dari satu detik.</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>Keamanan &amp; Kepatuhan Bawaan</strong></a><strong>:</strong> Enkripsi saat istirahat dan dalam perjalanan, RBAC berbutir halus, pencatatan audit yang komprehensif, integrasi SAML/OAuth2.0, dan penerapan <a href="https://zilliz.com/bring-your-own-cloud">BYOC</a> (bawa cloud Anda sendiri). Kami mematuhi GDPR, HIPAA, dan standar global lainnya yang benar-benar dibutuhkan oleh perusahaan.</p></li>
<li><p><strong>Dioptimalkan untuk Efisiensi Biaya:</strong> Penyimpanan data panas/dingin berjenjang, penskalaan elastis yang merespons beban kerja nyata, dan harga bayar sesuai penggunaan dapat mengurangi total biaya kepemilikan hingga 50% atau lebih dibandingkan dengan penerapan yang dikelola sendiri.</p></li>
<li><p><strong>Benar-benar Cloud-Agnostik tanpa penguncian vendor:</strong> Menerapkan di AWS, Azure, GCP, Alibaba Cloud, atau Tencent Cloud tanpa vendor lock-in. Kami memastikan konsistensi dan skalabilitas global di mana pun Anda menjalankannya.</p></li>
</ul>
<p>Kemampuan ini mungkin tidak terdengar mencolok, tetapi kemampuan ini memecahkan masalah nyata sehari-hari yang dihadapi tim perusahaan saat membangun aplikasi AI dalam skala besar. Dan yang paling penting: ini masih tetap Milvus di baliknya, jadi tidak ada masalah penguncian kepemilikan atau kompatibilitas.</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">Apa yang Berikutnya: Danau Data Vektor<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami menciptakan istilah &quot;<a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a>&quot; dan menjadi yang pertama membangunnya, namun kami tidak berhenti sampai di situ. Kami sekarang sedang membangun evolusi berikutnya: <strong>Vector Data Lake.</strong></p>
<p><strong>Inilah masalah yang sedang kami selesaikan: tidak semua pencarian vektor membutuhkan latensi milidetik.</strong> Banyak perusahaan memiliki kumpulan data besar yang sesekali ditanyakan, termasuk analisis dokumen historis, penghitungan kesamaan batch, dan analisis tren jangka panjang. Untuk kasus-kasus penggunaan ini, basis data vektor real-time tradisional sangat berlebihan dan mahal.</p>
<p>Vector Data Lake menggunakan arsitektur penyimpanan-komputasi yang terpisah yang secara khusus dioptimalkan untuk vektor berskala besar dan jarang diakses, namun dengan biaya yang jauh lebih rendah daripada sistem real-time.</p>
<p><strong>Kemampuan intinya meliputi:</strong></p>
<ul>
<li><p><strong>Tumpukan Data Terpadu:</strong> Menghubungkan lapisan data online dan offline secara mulus dengan format yang konsisten dan penyimpanan yang efisien, sehingga Anda dapat memindahkan data antara tingkatan panas dan dingin tanpa memformat ulang atau migrasi yang rumit.</p></li>
<li><p><strong>Ekosistem Komputasi yang Kompatibel:</strong> Bekerja secara native dengan kerangka kerja seperti Spark dan Ray, mendukung segala hal mulai dari pencarian vektor hingga ETL dan analitik tradisional. Ini berarti tim data Anda yang sudah ada dapat bekerja dengan data vektor menggunakan alat yang sudah mereka kenal.</p></li>
<li><p><strong>Arsitektur yang Dioptimalkan Biaya:</strong> Data panas tetap berada di SSD atau NVMe untuk akses cepat; data dingin secara otomatis berpindah ke penyimpanan objek seperti S3. Strategi pengindeksan dan penyimpanan yang cerdas menjaga I/O tetap cepat saat Anda membutuhkannya sekaligus membuat biaya penyimpanan dapat diprediksi dan terjangkau.</p></li>
</ul>
<p>Ini bukan tentang mengganti database vektor - ini tentang memberikan alat yang tepat bagi perusahaan untuk setiap beban kerja. Pencarian real-time untuk aplikasi yang berhadapan langsung dengan pengguna, danau data vektor yang hemat biaya untuk analisis dan pemrosesan historis.</p>
<p>Kami masih percaya pada logika di balik Hukum Moore dan Paradoks Jevons: seiring dengan turunnya biaya unit komputasi, adopsi pun meningkat. Hal yang sama berlaku untuk infrastruktur vektor.</p>
<p>Dengan meningkatkan indeks, struktur penyimpanan, caching, dan model penerapan - hari demi hari - kami berharap dapat membuat infrastruktur AI lebih mudah diakses dan terjangkau oleh semua orang, serta membantu menghadirkan data yang tidak terstruktur ke dalam masa depan AI.</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">Terima kasih banyak untuk Anda semua!<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>35 ribu lebih bintang tersebut mewakili sesuatu yang sangat kami banggakan: sebuah komunitas pengembang yang menganggap Milvus cukup berguna untuk direkomendasikan dan berkontribusi.</p>
<p>Tetapi kami belum selesai. Milvus masih memiliki bug yang harus diperbaiki, peningkatan performa yang harus dilakukan, dan fitur-fitur yang diminta oleh komunitas kami. Peta jalan kami bersifat publik, dan kami benar-benar menginginkan masukan Anda tentang apa yang harus diprioritaskan.</p>
<p>Angka itu sendiri bukanlah hal yang penting-ini adalah kepercayaan yang diwakili oleh bintang-bintang tersebut. Kepercayaan bahwa kami akan terus membangun secara terbuka, terus mendengarkan masukan, dan terus menjadikan Milvus lebih baik.</p>
<ul>
<li><p><strong>Untuk para kontributor kami:</strong> PR, laporan bug, dan perbaikan dokumentasi Anda membuat Milvus menjadi lebih baik setiap harinya. Terima kasih banyak.</p></li>
<li><p><strong>Kepada</strong> para<strong>pengguna kami:</strong> terima kasih telah mempercayai kami dengan beban kerja produksi Anda dan atas umpan balik yang membuat kami tetap jujur.</p></li>
<li><p><strong>Kepada komunitas kami:</strong> terima kasih telah menjawab pertanyaan, menyelenggarakan acara, dan membantu para pengguna baru untuk memulai.</p></li>
</ul>
<p>Jika Anda baru mengenal basis data vektor, kami ingin membantu Anda memulai. Jika Anda sudah menggunakan Milvus atau Zilliz Cloud, kami ingin <a href="https://zilliz.com/share-your-story">mendengar pengalaman Anda</a>. Dan jika Anda hanya ingin tahu tentang apa yang kami bangun, saluran komunitas kami selalu terbuka.</p>
<p>Mari kita terus membangun infrastruktur yang memungkinkan aplikasi AI - bersama-sama.</p>
<hr>
<p>Temukan kami di sini: <a href="https://github.com/milvus-io/milvus">Milvus di GitHub</a> |<a href="https://zilliz.com/"> Zilliz Cloud</a> |<a href="https://discuss.milvus.io/"> Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
