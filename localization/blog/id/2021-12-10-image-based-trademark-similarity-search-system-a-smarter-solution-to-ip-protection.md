---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  Milvus dalam Perlindungan IP: Membangun Sistem Pencarian Kemiripan Merek
  Dagang dengan Milvus
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: >-
  Pelajari cara menerapkan pencarian kemiripan vektor dalam industri
  perlindungan IP.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>Dalam beberapa tahun terakhir, masalah perlindungan IP telah menjadi pusat perhatian karena kesadaran masyarakat akan pelanggaran IP semakin meningkat. Yang paling terkenal, raksasa teknologi multi-nasional Apple Inc. telah secara aktif <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">mengajukan tuntutan hukum terhadap berbagai perusahaan atas pelanggaran IP</a>, termasuk pelanggaran merek dagang, paten, dan desain. Terlepas dari kasus-kasus yang paling terkenal itu, Apple Inc. juga <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">mempermasalahkan aplikasi merek dagang oleh Woolworths Limited</a>, sebuah jaringan supermarket Australia, dengan alasan pelanggaran merek dagang pada tahun 2009.  Apple. Inc berargumen bahwa logo merek Australia, sebuah huruf &quot;w&quot; bergaya, menyerupai logo apel mereka sendiri. Oleh karena itu, Apple Inc. merasa keberatan dengan berbagai produk, termasuk perangkat elektronik, yang dijual oleh Woolworths dengan logo tersebut. Kisah ini berakhir dengan Woolworths mengubah logonya dan Apple menarik keberatannya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>Logo Woolworths.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>Logo Apple Inc.png</span> </span></p>
<p>Dengan semakin meningkatnya kesadaran akan budaya merek, perusahaan-perusahaan mengawasi dengan lebih cermat setiap ancaman yang akan membahayakan hak kekayaan intelektual (IP) mereka. Pelanggaran hak kekayaan intelektual meliputi:</p>
<ul>
<li>Pelanggaran hak cipta</li>
<li>Pelanggaran paten</li>
<li>Pelanggaran merek dagang</li>
<li>Pelanggaran desain</li>
<li>Cybersquatting</li>
</ul>
<p>Sengketa yang disebutkan di atas antara Apple dan Woolworths terutama mengenai pelanggaran merek dagang, tepatnya kemiripan antara gambar merek dagang kedua entitas tersebut. Untuk menahan diri agar tidak menjadi Woolworths yang lain, pencarian kesamaan merek dagang yang lengkap merupakan langkah penting bagi pelamar baik sebelum pengajuan maupun selama peninjauan aplikasi merek dagang. Pilihan yang paling umum adalah melalui pencarian di <a href="https://tmsearch.uspto.gov/search/search-information">database Kantor Paten dan Merek Dagang Amerika Serikat (USPTO</a> ) yang berisi semua pendaftaran dan aplikasi merek dagang yang aktif dan tidak aktif. Terlepas dari UI yang tidak begitu menarik, proses pencarian ini juga sangat cacat karena sifatnya yang berbasis teks karena mengandalkan kata-kata dan kode Desain Merek Dagang (yang merupakan label anotasi tangan dari fitur desain) untuk mencari gambar.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Artikel ini dengan demikian bermaksud untuk menunjukkan bagaimana membangun sistem pencarian kemiripan merek dagang berbasis gambar yang efisien menggunakan <a href="https://milvus.io">Milvus</a>, sebuah basis data vektor sumber terbuka.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">Sistem pencarian kemiripan vektor untuk merek dagang<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk membangun sistem pencarian kemiripan vektor untuk merek dagang, Anda perlu melakukan langkah-langkah berikut:</p>
<ol>
<li>Siapkan kumpulan data logo dalam jumlah besar. Kemungkinan, sistem dapat menggunakan kumpulan data seperti <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">ini</a>,).</li>
<li>Latih model ekstraksi fitur gambar menggunakan dataset dan model berbasis data atau algoritme AI.</li>
<li>Ubah logo menjadi vektor menggunakan model atau algoritme yang telah dilatih pada Langkah 2.</li>
<li>Simpan vektor dan lakukan pencarian kemiripan vektor di Milvus, basis data vektor sumber terbuka.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>Pada bagian berikut, mari kita lihat lebih dekat dua langkah utama dalam membangun sistem pencarian kemiripan vektor untuk merek dagang: menggunakan model AI untuk ekstraksi fitur gambar, dan menggunakan Milvus untuk pencarian kemiripan vektor. Dalam kasus kami, kami menggunakan VGG16, sebuah jaringan saraf konvolusi (CNN), untuk mengekstrak fitur gambar dan mengubahnya menjadi vektor penyematan.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">Menggunakan VGG16 untuk ekstraksi fitur gambar</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a> adalah CNN yang didesain untuk pengenalan gambar berskala besar. Model ini cepat dan akurat dalam pengenalan gambar dan dapat diterapkan pada gambar dari semua ukuran. Berikut ini adalah dua ilustrasi arsitektur VGG16.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>Model VGG16, seperti namanya, adalah CNN dengan 16 lapisan. Semua model VGG, termasuk VGG16 dan VGG19, berisi 5 blok VGG, dengan satu atau lebih lapisan konvolusi di setiap blok VGG. Dan pada akhir setiap blok, lapisan penyatuan maksimum dihubungkan untuk mengurangi ukuran gambar input. Jumlah kernel setara dalam setiap lapisan convolutional tetapi berlipat ganda dalam setiap blok VGG. Oleh karena itu, jumlah kernel dalam model bertambah dari 64 pada blok pertama, menjadi 512 pada blok keempat dan kelima. Semua kernel convolutional<em>berukuran 33 sedangkan kernel pooling berukuran 22.</em>Hal ini kondusif untuk mempertahankan lebih banyak informasi tentang gambar input.</p>
<p>Oleh karena itu, VGG16 adalah model yang cocok untuk pengenalan gambar dari kumpulan data yang sangat besar dalam kasus ini. Anda dapat menggunakan Python, Tensorflow, dan Keras untuk melatih model ekstraksi fitur gambar berdasarkan VGG16.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Menggunakan Milvus untuk pencarian kemiripan vektor</h3><p>Setelah menggunakan model VGG16 untuk mengekstrak fitur gambar dan mengonversi gambar logo menjadi vektor penyematan, Anda perlu mencari vektor yang mirip dari kumpulan data yang sangat besar.</p>
<p>Milvus adalah basis data asli cloud yang menampilkan skalabilitas dan elastisitas tinggi. Selain itu, sebagai basis data, Milvus dapat memastikan konsistensi data. Untuk sistem pencarian kemiripan merek dagang seperti ini, data baru seperti pendaftaran merek dagang terbaru diunggah ke sistem secara real time. Dan data yang baru diunggah ini harus segera tersedia untuk pencarian. Oleh karena itu, artikel ini mengadopsi Milvus, basis data vektor sumber terbuka, untuk melakukan pencarian kemiripan vektor.</p>
<p>Saat memasukkan vektor logo, anda bisa membuat koleksi di Milvus untuk berbagai jenis vektor logo sesuai dengan <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">Klasifikasi Barang dan Jasa Internasional (Nice)</a>, sebuah sistem pengklasifikasian barang dan jasa untuk mendaftarkan merek dagang. Misalnya, Anda dapat memasukkan sekelompok vektor logo merek pakaian ke dalam koleksi bernama &quot;pakaian&quot; di Milvus dan memasukkan sekelompok vektor logo merek teknologi ke dalam koleksi berbeda bernama &quot;teknologi&quot;. Dengan melakukan hal ini, Anda dapat meningkatkan efisiensi dan kecepatan pencarian kemiripan vektor Anda.</p>
<p>Milvus tidak hanya mendukung beberapa indeks untuk pencarian kemiripan vektor, tetapi juga menyediakan API dan alat yang kaya untuk memfasilitasi DevOps. Diagram berikut ini adalah ilustrasi dari <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">arsitektur Milvus</a>. Anda dapat mempelajari lebih lanjut tentang Milvus dengan membaca <a href="https://milvus.io/docs/v2.0.x/overview.md">pengantarnya</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Mencari lebih banyak sumber daya?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Bangun lebih banyak sistem pencarian kemiripan vektor untuk skenario aplikasi lain dengan Milvus:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Klasifikasi Urutan DNA berdasarkan Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Pengambilan Audio Berdasarkan Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 Langkah untuk Membangun Sistem Pencarian Video</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Membangun Sistem QA Cerdas dengan NLP dan Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Mempercepat Penemuan Obat Baru</a></li>
</ul></li>
<li><p>Bergabunglah dengan komunitas sumber terbuka kami:</p>
<ul>
<li>Temukan atau kontribusikan Milvus di <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Terhubung dengan kami di <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
