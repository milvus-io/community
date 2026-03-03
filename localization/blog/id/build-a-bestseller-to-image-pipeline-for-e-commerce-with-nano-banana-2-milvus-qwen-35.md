---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: >-
  Bangun Pipeline Buku Terlaris ke Gambar untuk E-Commerce dengan Nano Banana 2
  + Milvus + Qwen 3.5
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  Tutorial langkah demi langkah: gunakan Nano Banana 2, pencarian hibrida
  Milvus, dan Qwen 3.5 untuk menghasilkan foto produk e-commerce dari flat-lay
  dengan 1/3 biaya.
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>Jika Anda membuat alat bantu AI untuk penjual e-commerce, Anda mungkin pernah mendengar permintaan ini ribuan kali: "Saya punya produk baru. Berikan saya gambar promosi yang terlihat seperti produk tersebut masuk dalam daftar buku terlaris. Tanpa fotografer, tanpa studio, dan buatlah dengan harga yang murah."</p>
<p>Itulah masalahnya dalam sebuah kalimat. Penjual memiliki foto-foto datar dan katalog buku terlaris yang sudah terjual. Mereka ingin menjembatani keduanya dengan AI, baik secara cepat maupun dalam skala besar.</p>
<p>Ketika Google merilis Nano Banana 2 (Gemini 3.1 Flash Image) pada tanggal 26 Februari 2026, kami mengujinya pada hari yang sama dan mengintegrasikannya ke dalam pipeline pengambilan berbasis Milvus yang sudah ada. Hasilnya: total biaya pembuatan gambar turun menjadi kira-kira sepertiga dari biaya yang dihabiskan sebelumnya, dan throughput meningkat dua kali lipat. Pemotongan harga per gambar (sekitar 50% lebih murah daripada Nano Banana Pro) menyumbang sebagian dari itu, tetapi penghematan yang lebih besar berasal dari menghilangkan siklus pengerjaan ulang sepenuhnya.</p>
<p>Artikel ini membahas apa yang dilakukan Nano Banana 2 untuk e-commerce, di mana ia masih gagal, dan kemudian berjalan melalui tutorial langsung untuk pipa penuh: Pencarian hibrida <strong>Milvus</strong> untuk menemukan buku terlaris yang mirip secara visual, <strong>Qwen</strong> 3.5 untuk analisis gaya, dan <strong>Nano Banana 2</strong> untuk generasi terakhir.</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Apa yang Baru dengan Nano Banana 2?<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>Nano Banana 2 (Gemini 3.1 Flash Image) diluncurkan pada tanggal 26 Februari 2026. Ini membawa sebagian besar kemampuan Nano Banana Pro ke arsitektur Flash, yang berarti generasi yang lebih cepat dengan harga yang lebih rendah. Berikut ini adalah peningkatan utama:</p>
<ul>
<li><strong>Kualitas tingkat pro pada kecepatan Flash.</strong> Nano Banana 2 menghadirkan pengetahuan, penalaran, dan ketepatan visual kelas dunia yang sebelumnya eksklusif untuk Pro, tetapi dengan latensi dan throughput Flash.</li>
<li><strong>Output 512px hingga 4K.</strong> Empat tingkatan resolusi (512px, 1K, 2K, 4K) dengan dukungan asli. Tingkatan 512px adalah hal yang baru dan unik untuk Nano Banana 2.</li>
<li><strong>14 rasio aspek.</strong> Menambahkan 4:1, 1:4, 8:1, dan 1:8 ke set yang sudah ada (1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9).</li>
<li><strong>Hingga 14 gambar referensi.</strong> Mempertahankan kemiripan karakter hingga 5 karakter dan ketepatan objek hingga 14 objek dalam satu alur kerja.</li>
<li><strong>Rendering teks yang lebih baik.</strong> Menghasilkan teks dalam gambar yang terbaca dan akurat dalam berbagai bahasa, dengan dukungan untuk terjemahan dan pelokalan dalam satu generasi.</li>
<li><strong>Landasan Pencarian Gambar.</strong> Mengambil data web real-time dan gambar dari Google Penelusuran untuk menghasilkan penggambaran yang lebih akurat dari subjek dunia nyata.</li>
<li><strong>~50% lebih murah per gambar.</strong> Pada resolusi 1K: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>067versusPro′s0</mi></mrow><annotation encoding="application/x-tex">.067 versus Pro's</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>.134.</li>
</ul>
<p><strong>Kasus Penggunaan yang Menyenangkan dari Nano Banano 2: Menghasilkan Panorama Sadar Lokasi Berdasarkan Cuplikan Layar Google Map Sederhana</strong></p>
<p>Dengan memberikan tangkapan layar Google Maps dan perintah gaya, model mengenali konteks geografis dan menghasilkan panorama yang mempertahankan hubungan spasial yang benar. Berguna untuk menghasilkan materi iklan yang ditargetkan berdasarkan wilayah (latar belakang kafe di Paris, pemandangan jalanan di Tokyo) tanpa menggunakan stok fotografi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk mengetahui fitur lengkapnya, lihat <a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">blog pengumuman Google</a> dan <a href="https://ai.google.dev/gemini-api/docs/image-generation">dokumentasi pengembang</a>.</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">Apa Arti Pembaruan Nano Banana Ini Bagi E-Commerce?<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>E-commerce adalah salah satu industri yang paling banyak menggunakan gambar. Daftar produk, iklan pasar, materi iklan sosial, kampanye spanduk, etalase yang dilokalkan: setiap saluran menuntut aliran aset visual yang konstan, masing-masing dengan spesifikasinya sendiri.</p>
<p>Persyaratan inti untuk pembuatan gambar AI dalam e-commerce bermuara pada:</p>
<ul>
<li><strong>Menjaga biaya tetap rendah</strong> - biaya per gambar harus sesuai dengan skala katalog.</li>
<li><strong>Cocokkan tampilan buku terlaris yang telah terbukti</strong> - gambar baru harus selaras dengan gaya visual dari daftar yang telah terkonversi.</li>
<li><strong>Hindari pelanggaran</strong> - tidak boleh meniru materi iklan pesaing atau menggunakan kembali aset yang dilindungi.</li>
</ul>
<p>Selain itu, penjual lintas batas membutuhkan:</p>
<ul>
<li><strong>Dukungan format multi-platform</strong> - rasio aspek dan spesifikasi yang berbeda untuk pasar, iklan, dan etalase.</li>
<li><strong>Rendering teks multibahasa</strong> - teks dalam gambar yang bersih dan akurat dalam berbagai bahasa.</li>
</ul>
<p>Nano Banana 2 hampir mencentang semua kotak. Bagian di bawah ini menguraikan apa arti setiap peningkatan dalam praktiknya: di mana peningkatan tersebut secara langsung memecahkan titik masalah e-commerce, di mana peningkatan tersebut gagal, dan seperti apa dampak biaya yang sebenarnya.</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">Memangkas Biaya Produksi Output Hingga 60</h3><p>Pada resolusi 1K, Nano Banana 2 berharga <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>067perimageversusPro′s0</mi></mrow><annotation encoding="application/x-tex">,067 per gambar dibandingkan Pro's</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span></span></span></span>0, <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mord mathnormal">067perimageversusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′s0</span></span></span></span>,134, yang merupakan pemotongan 50%. Tetapi, harga per gambar hanya separuh dari cerita. Apa yang biasanya membunuh anggaran pengguna adalah pengerjaan ulang. Setiap pasar memberlakukan spesifikasi gambarnya sendiri (1: 1 untuk Amazon, 3: 4 untuk etalase Shopify, ultrawide untuk iklan spanduk), dan memproduksi setiap varian berarti melewati generasi yang terpisah dengan mode kegagalannya sendiri.</p>
<p>Nano Banana 2 menggabungkan semua lintasan ekstra itu menjadi satu.</p>
<ul>
<li><p><strong>Empat tingkatan resolusi asli.</strong></p></li>
<li><p>512 piksel ($0,045)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>Tingkatan 512px adalah hal yang baru dan unik untuk Nano Banana 2. Pengguna sekarang dapat menghasilkan draf 512px berbiaya rendah untuk iterasi dan menghasilkan aset akhir pada 2K atau 4K tanpa langkah peningkatan yang terpisah.</p>
<ul>
<li><p>Total ada<strong>14 rasio aspek yang didukung.</strong> Berikut adalah beberapa contohnya:</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>Rasio ultra-lebar dan ultra-tinggi yang baru ini bergabung dengan rangkaian yang sudah ada. Satu sesi generasi dapat menghasilkan berbagai format seperti: <strong>Gambar utama Amazon</strong> (1:1), <strong>Pahlawan etalase</strong> (3:4) dan <strong>Iklan spanduk</strong> (ultra-lebar atau rasio lainnya).</p>
<p>Tidak ada pemotongan, tidak ada padding, tidak perlu meminta ulang untuk 4 rasio ini. Sisa 10 rasio aspek lainnya disertakan dalam set lengkap, membuat prosesnya lebih fleksibel di berbagai platform.</p>
<p>Penghematan ~50% per gambar saja sudah bisa mengurangi separuh tagihan. Dengan menghilangkan pengerjaan ulang di seluruh resolusi dan rasio aspek, maka total biaya yang dikeluarkan menjadi sekitar sepertiga dari biaya yang dihabiskan sebelumnya.</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">Mendukung Hingga 14 Gambar Referensi dengan Gaya Terlaris</h3><p>Dari semua pembaruan Nano Banana 2, pencampuran multi-referensi memiliki dampak terbesar pada pipeline Milvus kami. Nano Banana 2 menerima hingga 14 gambar referensi dalam satu permintaan, dengan tetap mempertahankan:</p>
<ul>
<li>Kemiripan karakter hingga <strong>5 karakter</strong></li>
<li>Kesesuaian objek hingga <strong>14 objek</strong></li>
</ul>
<p>Dalam praktiknya, kami mengambil beberapa gambar buku terlaris dari Milvus, meneruskannya sebagai referensi, dan gambar yang dihasilkan mewarisi komposisi adegan, pencahayaan, pose, dan penempatan prop. Tidak ada rekayasa cepat yang diperlukan untuk merekonstruksi pola-pola tersebut dengan tangan.</p>
<p>Model terdahulu hanya mendukung satu atau dua referensi, yang memaksa pengguna untuk memilih satu buku terlaris untuk ditiru. Dengan 14 slot referensi, kami dapat memadukan karakteristik dari beberapa daftar yang berkinerja terbaik dan membiarkan model mensintesis gaya komposit. Ini adalah kemampuan yang memungkinkan pipeline berbasis pengambilan dalam tutorial di bawah ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">Menghasilkan Visual Premium dan Siap Komersial Tanpa Biaya Produksi atau Logistik Tradisional</h3><p>Untuk menghasilkan gambar yang konsisten dan dapat diandalkan, hindari membuang semua kebutuhan Anda ke dalam satu prompt. Pendekatan yang lebih dapat diandalkan adalah bekerja secara bertahap: buat latar belakang terlebih dahulu, kemudian model secara terpisah, dan akhirnya menggabungkannya bersama-sama.</p>
<p>Kami menguji pembuatan latar belakang pada ketiga model Nano Banana dengan prompt yang sama: cakrawala kota Shanghai pada hari hujan dengan rasio ultrawide 4:1 yang dilihat melalui jendela, dengan Oriental Pearl Tower yang terlihat. Prompt ini menguji komposisi, detail arsitektur, dan fotorealisme dalam satu kali pemotretan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">Nano Banana Asli vs Nano Banana Pro vs Nano Banana 2</h4><ul>
<li><strong>Pisang Nano Asli.</strong> Tekstur hujan alami dengan distribusi tetesan air yang bisa dipercaya, tetapi detail bangunan terlalu diperhalus. Oriental Pearl Tower nyaris tidak dapat dikenali, dan resolusinya tidak memenuhi persyaratan produksi.</li>
<li><strong>Nano Banana Pro.</strong> Suasana sinematik: pencahayaan interior yang hangat berpadu dengan hujan yang dingin secara meyakinkan. Namun demikian, ini menghilangkan bingkai jendela sepenuhnya, meratakan kesan kedalaman gambar. Dapat digunakan sebagai gambar pendukung, bukan pahlawan.</li>
<li><strong>Nano Banana 2.</strong> Menyajikan pemandangan secara utuh. Bingkai jendela di latar depan menciptakan kedalaman. Menara Mutiara Oriental secara jelas terlihat detailnya. Kapal muncul di Sungai Huangpu. Pencahayaan berlapis membedakan kehangatan interior dari mendung di eksterior. Tekstur hujan dan noda air nyaris seperti fotografi, dan rasio ultrawide 4:1 mempertahankan perspektif yang benar dengan hanya sedikit distorsi di tepi jendela kiri.</li>
</ul>
<p>Untuk sebagian besar tugas pembuatan latar belakang dalam fotografi produk, kami menemukan bahwa output Nano Banana 2 dapat digunakan tanpa pasca-pemrosesan.</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">Merender Teks Dalam Gambar dengan Bersih di Berbagai Bahasa</h3><p>Label harga, spanduk promosi, dan teks multibahasa tidak dapat dihindari dalam gambar e-commerce, dan secara historis telah menjadi titik balik bagi generasi AI. Nano Banana 2 menanganinya dengan jauh lebih baik, mendukung rendering teks dalam gambar di berbagai bahasa dengan terjemahan dan pelokalan dalam satu generasi.</p>
<p><strong>Rendering teks standar.</strong> Dalam pengujian kami, keluaran teks bebas dari kesalahan di setiap format e-commerce yang kami coba: label harga, slogan pemasaran singkat, dan deskripsi produk dalam dua bahasa.</p>
<p><strong>Kelanjutan tulisan tangan.</strong> Karena e-commerce sering kali memerlukan elemen tulisan tangan seperti label harga dan kartu yang dipersonalisasi, kami menguji apakah model ini dapat mencocokkan gaya tulisan tangan yang sudah ada dan memperluasnya - khususnya, mencocokkan daftar tugas yang ditulis tangan dan menambahkan 5 item baru dengan gaya yang sama. Hasil dari tiga model:</p>
<ul>
<li><strong>Pisang Nano Asli.</strong> Nomor urut yang berulang, struktur yang disalahpahami.</li>
<li><strong>Nano Banana Pro.</strong> Tata letak yang benar, tetapi reproduksi gaya font yang buruk.</li>
<li><strong>Nano Banana 2.</strong> Tidak ada kesalahan. Berat goresan dan gaya bentuk huruf yang cocok cukup dekat sehingga tidak dapat dibedakan dari sumbernya.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Namun,</strong> dokumentasi Google sendiri mencatat bahwa Nano Banana 2 "masih kesulitan dengan ejaan yang akurat dan detail halus pada gambar." Hasil kami bersih di seluruh format yang kami uji, tetapi alur kerja produksi apa pun harus menyertakan langkah verifikasi teks sebelum diterbitkan.</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">Tutorial Langkah-demi-Langkah: Membuat Pipeline Buku Terlaris ke Gambar dengan Milvus, Qwen 3.5, dan Nano Banana 2<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">Sebelum kita mulai: Pengaturan Arsitektur dan Model</h3><p>Untuk menghindari keacakan dari pembuatan single-prompt, kami membagi prosesnya menjadi tiga tahap yang dapat dikontrol: mengambil apa yang sudah bekerja dengan pencarian hybrid <strong>Milvus</strong>, menganalisis mengapa ia bekerja dengan <strong>Qwen 3.5</strong>, kemudian menghasilkan gambar akhir dengan batasan-batasan yang sudah dibuat dengan <strong>Nano Banana 2</strong>.</p>
<p>Panduan singkat untuk setiap alat jika Anda belum pernah menggunakannya:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a> basis data vektor sumber terbuka yang paling banyak digunakan. Menyimpan katalog produk Anda sebagai vektor dan menjalankan pencarian hibrida (filter padat + jarang + skalar) untuk menemukan gambar terlaris yang paling mirip dengan produk baru.</li>
<li><strong>Qwen 3.5</strong>: LLM multimodal yang populer. Mengambil gambar buku terlaris yang diambil dan mengekstrak pola visual di belakangnya (tata letak pemandangan, pencahayaan, pose, suasana hati) ke dalam prompt gaya terstruktur.</li>
<li><strong>Nano Banana 2</strong>: model pembuatan gambar dari Google (Gemini 3.1 Flash Image). Mengambil tiga masukan: tata letak produk baru, referensi buku terlaris, dan style prompt Qwen 3.5. Menghasilkan foto promosi akhir.</li>
</ul>
<p>Logika di balik arsitektur ini dimulai dengan satu pengamatan: aset visual yang paling berharga dalam katalog e-commerce mana pun adalah perpustakaan gambar buku terlaris yang telah dikonversi. Pose, komposisi, dan pencahayaan pada foto-foto tersebut disempurnakan melalui belanja iklan yang nyata. Mengambil pola-pola tersebut secara langsung adalah urutan yang jauh lebih cepat daripada merekayasa baliknya melalui penulisan yang cepat, dan langkah pengambilan tersebut adalah apa yang ditangani oleh basis data vektor.</p>
<p>Berikut adalah alur lengkapnya. Kami memanggil setiap model melalui API OpenRouter, jadi tidak ada persyaratan GPU lokal dan tidak ada bobot model yang harus diunduh.</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>Kami mengandalkan tiga kemampuan Milvus untuk membuat tahap pengambilan bekerja:</p>
<ol>
<li><strong>Pencarian hibrida padat + jarang.</strong> Kami menjalankan penyematan gambar dan vektor TF-IDF teks sebagai kueri paralel, lalu menggabungkan dua set hasil dengan pemeringkatan ulang RRF (Reciprocal Rank Fusion).</li>
<li><strong>Pemfilteran bidang skalar.</strong> Kami memfilter berdasarkan bidang metadata seperti kategori dan jumlah_penjualan sebelum perbandingan vektor, sehingga hasil hanya mencakup produk yang relevan dan berkinerja tinggi.</li>
<li><strong>Skema multi-bidang.</strong> Kami menyimpan vektor padat, vektor jarang, dan metadata skalar dalam satu koleksi Milvus, yang membuat seluruh logika pengambilan dalam satu kueri, bukan tersebar di beberapa sistem.</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">Persiapan Data</h3><p><strong>Katalog produk historis</strong></p>
<p>Kami mulai dengan dua aset: gambar/folder foto produk yang sudah ada dan file products.csv yang berisi metadata.</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Data produk baru</strong></p>
<p>Untuk produk yang ingin kami buatkan gambar promosinya, kami menyiapkan struktur paralel: folder new_products/ dan new_products.csv.</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Langkah 1: Instal Ketergantungan</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">Langkah 2: Mengimpor Modul dan Konfigurasi</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Konfigurasikan semua model dan jalur:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fungsi utilitas</strong></p>
<p>Fungsi-fungsi pembantu ini menangani pengkodean gambar, panggilan API, dan penguraian respons:</p>
<ul>
<li>image_to_uri(): Mengonversi gambar PIL menjadi URI data base64 untuk transportasi API.</li>
<li>get_image_embeddings(): Menyandikan gambar secara batch menjadi vektor 2048 dimensi melalui OpenRouter Embedding API.</li>
<li>get_text_embedding (): Menyandikan teks ke dalam ruang vektor 2048 dimensi yang sama.</li>
<li>sparse_to_dict(): Mengonversi baris matriks scipy sparse ke dalam format {index: value} yang diharapkan Milvus untuk vektor jarang.</li>
<li>extract_images(): Mengekstrak gambar yang dihasilkan dari respons API Nano Banana 2.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">Langkah 3: Memuat Katalog Produk</h3><p>Baca products.csv dan muat gambar produk yang sesuai:</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>Contoh keluaran:<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">Langkah 4: Hasilkan Penyematan</h3><p>Pencarian hibrida memerlukan dua jenis vektor untuk setiap produk.</p>
<p><strong>4.1 Vektor padat: penyematan gambar</strong></p>
<p>Model nvidia/llama-nemotron-embed-vl-1b-v2 mengkodekan setiap gambar produk ke dalam vektor padat 2048 dimensi. Karena model ini mendukung input gambar dan teks dalam ruang vektor bersama, penyematan yang sama dapat digunakan untuk pengambilan gambar-ke-gambar dan teks-ke-gambar.</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.2 Vektor yang jarang: Penyematan teks TF-IDF</strong></p>
<p>Deskripsi teks produk dikodekan ke dalam vektor jarang menggunakan vektorizer TF-IDF scikit-learn. Vektor ini menangkap pencocokan tingkat kata kunci yang dapat dilewatkan oleh vektor padat.</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>Mengapa kedua jenis vektor tersebut?</strong> Vektor padat dan vektor jarang saling melengkapi satu sama lain. Vektor padat menangkap kemiripan visual: palet warna, siluet garmen, gaya keseluruhan. Vektor yang jarang menangkap semantik kata kunci: istilah seperti "floral", "midi", atau "sifon" yang menandakan atribut produk. Menggabungkan keduanya menghasilkan kualitas pencarian yang jauh lebih baik daripada salah satu pendekatan saja.</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">Langkah 5: Buat Koleksi Milvus dengan Skema Hibrida</h3><p>Langkah ini membuat koleksi Milvus tunggal yang menyimpan vektor padat, vektor jarang, dan bidang metadata skalar secara bersamaan. Skema terpadu ini memungkinkan pencarian hibrida dalam satu kueri.</p>
<table>
<thead>
<tr><th><strong>Bidang</strong></th><th><strong>Jenis</strong></th><th><strong>Tujuan</strong></th></tr>
</thead>
<tbody>
<tr><td>dense_vector</td><td>FLOAT_VECTOR (2048d)</td><td>Penyematan gambar, kemiripan COSINE</td></tr>
<tr><td>sparse_vector</td><td>VEKTOR JARANG_FLOAT</td><td>Vektor jarang TF-IDF, produk dalam</td></tr>
<tr><td>kategori</td><td>VARCHAR</td><td>Label kategori untuk pemfilteran</td></tr>
<tr><td>jumlah_penjualan</td><td>INT64</td><td>Volume penjualan historis untuk pemfilteran</td></tr>
<tr><td>warna, gaya, musim</td><td>VARCHAR</td><td>Label metadata tambahan</td></tr>
<tr><td>harga</td><td>FLOAT</td><td>Harga produk</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Masukkan data produk:</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">Langkah 6: Pencarian Hibrida untuk Menemukan Buku Terlaris yang Mirip</h3><p>Ini adalah langkah pengambilan inti. Untuk setiap produk baru, pipeline menjalankan tiga operasi secara bersamaan:</p>
<ol>
<li><strong>Pencarian padat</strong>: menemukan produk dengan penyematan gambar yang mirip secara visual.</li>
<li><strong>Pencarian jarang</strong>: menemukan produk dengan kata kunci teks yang cocok melalui TF-IDF.</li>
<li><strong>Pemfilteran skalar</strong>: membatasi hasil ke kategori dan produk yang sama dengan jumlah penjualan &gt; 1500.</li>
<li><strong>Pemeringkatan ulang RRF</strong>: menggabungkan daftar hasil yang padat dan jarang menggunakan Reciprocal Rank Fusion.</li>
</ol>
<p>Memuat produk baru:</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Mengkodekan produk baru:</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Menjalankan pencarian hibrida</strong></p>
<p>Panggilan API utama ada di sini:</p>
<ul>
<li>AnnSearchRequest membuat permintaan pencarian terpisah untuk bidang vektor padat dan jarang.</li>
<li>expr = filter_expr menerapkan pemfilteran skalar dalam setiap permintaan pencarian.</li>
<li>RRFRanker(k=60) menggabungkan dua daftar hasil peringkat menggunakan algoritme Reciprocal Rank Fusion.</li>
<li>hybrid_search mengeksekusi kedua permintaan dan mengembalikan hasil yang telah digabungkan dan diperingkat ulang.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran: 3 buku terlaris yang paling mirip, diurutkan berdasarkan skor gabungan.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">Langkah 7: Menganalisis Gaya Buku Terlaris dengan Qwen 3.5</h3><p>Kami memasukkan gambar buku terlaris yang diambil ke dalam Qwen 3.5 dan memintanya untuk mengekstrak DNA visual yang sama: komposisi adegan, pengaturan pencahayaan, pose model, dan suasana hati secara keseluruhan. Dari analisis tersebut, kami mendapatkan kembali prompt generasi tunggal yang siap untuk diserahkan ke Nano Banana 2.</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>Contoh keluaran:</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">Langkah 8: Hasilkan Gambar Promosi dengan Nano Banana 2</h3><p>Kami memberikan tiga masukan ke Nano Banana 2: foto flat-lay produk baru, gambar buku terlaris peringkat teratas, dan prompt gaya yang kami ekstrak pada langkah sebelumnya. Model ini mengomposisikannya menjadi foto promosi yang memasangkan garmen baru dengan gaya visual yang sudah terbukti.</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Parameter kunci untuk panggilan API Nano Banana 2:</p>
<ul>
<li>modalitas: [&quot;text&quot;, &quot;image&quot;]: menyatakan bahwa respons harus menyertakan gambar.</li>
<li>image_config.aspect_ratio: mengontrol rasio aspek keluaran (3:4 bekerja dengan baik untuk pemotretan potret/fashion).</li>
<li>image_config.image_size: mengatur resolusi. Nano Banana 2 mendukung 512px hingga 4K.</li>
</ul>
<p>Ekstrak gambar yang dihasilkan:</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">Langkah 9: Perbandingan Berdampingan</h3><p>Hasil foto menghasilkan goresan yang luas: pencahayaannya lembut dan merata, pose sang model terlihat wajar, dan suasana hati yang sesuai dengan referensi buku terlaris.</p>
<p>Yang kurang sempurna menurut kami yaitu, perpaduan pakaian. Cardigan terlihat ditempelkan pada model, bukan dikenakan, dan label garis leher berwarna putih terlihat jelas. Generasi sekali pakai kesulitan dengan integrasi pakaian ke tubuh yang halus seperti ini, jadi kami akan membahas solusinya dalam ringkasan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">Langkah 10: Pembuatan Batch untuk Semua Produk Baru</h3><p>Kami membungkus seluruh pipeline ke dalam satu fungsi dan menjalankannya di seluruh produk baru yang tersisa. Kode batch dihilangkan di sini untuk mempersingkat; hubungi kami jika Anda membutuhkan implementasi lengkap.</p>
<p>Ada dua hal yang menonjol dari hasil batch. Petunjuk gaya yang kami dapatkan dari <strong>Qwen 3.5</strong> menyesuaikan secara bermakna per produk: gaun musim panas dan rajutan musim dingin menerima deskripsi pemandangan yang benar-benar berbeda yang disesuaikan dengan musim, kasus penggunaan, dan aksesori. Gambar yang kami dapatkan dari <strong>Nano Banana 2</strong>, pada gilirannya, dapat bersaing dengan fotografi studio yang sesungguhnya dalam hal pencahayaan, tekstur, dan komposisi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Dalam artikel ini, kami membahas apa yang dibawa Nano Banana 2 ke pembuatan gambar e-commerce, membandingkannya dengan Nano Banana dan Pro asli di seluruh tugas produksi yang sesungguhnya, dan membahas cara membangun pipeline buku terlaris-ke-gambar dengan Milvus, Qwen 3.5, dan Nano Banana 2.</p>
<p>Pipeline ini memiliki empat keuntungan praktis:</p>
<ul>
<li><strong>Biaya terkendali, anggaran yang dapat diprediksi.</strong> Model penyematan (Llama Nemotron Embed VL 1B v2) tersedia gratis di OpenRouter. Nano Banana 2 berjalan dengan biaya sekitar setengah dari biaya per-gambar Pro, dan output multi-format asli menghilangkan siklus pengerjaan ulang yang biasanya menggandakan atau melipatgandakan tagihan efektif. Untuk tim e-commerce yang mengelola ribuan SKU per musim, prediktabilitas itu berarti skala produksi gambar dengan katalog alih-alih menghabiskan anggaran.</li>
<li><strong>Otomatisasi menyeluruh, waktu yang lebih cepat untuk membuat daftar.</strong> Alur dari foto produk flat-lay ke gambar promosi jadi berjalan tanpa intervensi manual. Produk baru dapat beralih dari foto gudang ke gambar daftar yang siap dipasarkan dalam hitungan menit, bukan hari, yang paling penting selama musim ramai saat perputaran katalog paling tinggi.</li>
<li><strong>Tidak memerlukan GPU lokal, hambatan masuk yang lebih rendah.</strong> Setiap model berjalan melalui API OpenRouter. Sebuah tim tanpa infrastruktur ML dan tidak ada staf teknik khusus dapat menjalankan pipeline ini dari laptop. Tidak ada yang perlu disiapkan, tidak ada yang perlu dipelihara, dan tidak ada investasi perangkat keras di muka.</li>
<li><strong>Ketepatan pengambilan yang lebih tinggi, konsistensi merek yang lebih kuat.</strong> Milvus menggabungkan pemfilteran padat, jarang, dan skalar dalam satu kueri, yang secara konsisten mengungguli pendekatan vektor tunggal untuk pencocokan produk. Dalam praktiknya, ini berarti gambar yang dihasilkan lebih andal mewarisi bahasa visual merek Anda yang sudah mapan: pencahayaan, komposisi, dan gaya yang telah terbukti berhasil membuat pelanggan beralih. Hasilnya terlihat seperti milik toko Anda, tidak seperti stok gambar AI yang umum.</li>
</ul>
<p>Ada juga keterbatasan yang perlu diketahui:</p>
<ul>
<li><strong>Pencampuran pakaian dengan tubuh.</strong> Pembuatan single-pass dapat membuat pakaian terlihat seperti digabungkan daripada dikenakan. Detail halus seperti aksesori kecil terkadang kabur. Solusi: buatlah secara bertahap (latar belakang terlebih dahulu, kemudian pose model, lalu komposit). Pendekatan multi-pass ini memberikan setiap langkah cakupan yang lebih sempit dan secara signifikan meningkatkan kualitas pemaduan.</li>
<li><strong>Ketepatan detail pada casing tepi.</strong> Aksesori, pola, dan tata letak yang padat teks bisa kehilangan ketajamannya. Solusi: tambahkan batasan eksplisit ke prompt pembuatan ("pakaian pas di badan, tidak ada label yang terbuka, tidak ada elemen tambahan, detail produk tajam"). Jika kualitas masih kurang pada produk tertentu, beralihlah ke Nano Banana Pro untuk hasil akhir.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka yang mendukung langkah pencarian hibrida, dan jika Anda ingin melihat-lihat atau mencoba menukar foto produk Anda sendiri, <a href="https://milvus.io/docs"></a> hanya membutuhkan waktu sekitar sepuluh menit. Kami memiliki komunitas yang cukup aktif di <a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a> dan Slack, dan kami ingin sekali melihat apa yang dibuat oleh orang-orang dengan ini. Dan jika Anda akhirnya menjalankan Nano Banana 2 pada produk vertikal yang berbeda atau katalog yang lebih besar, silakan bagikan hasilnya! Kami ingin sekali mendengarnya.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Teruslah membaca<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus: Mengubah Hype menjadi RAG Multimodal yang Siap untuk Perusahaan</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Apa itu OpenClaw? Panduan Lengkap untuk Agen AI Sumber Terbuka</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial OpenClaw: Menghubungkan ke Slack untuk Asisten AI Lokal</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Kami Mengekstrak Sistem Memori OpenClaw dan Membuatnya Bersumber Terbuka (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Memori Persisten untuk Kode Claude: memsearch ccplugin</a></li>
</ul>
