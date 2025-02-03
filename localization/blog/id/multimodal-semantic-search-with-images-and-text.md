---
id: multimodal-semantic-search-with-images-and-text.md
title: Pencarian Semantik Multimodal dengan Gambar dan Teks
author: Stefan Webb
date: 2025-02-3
desc: >-
  Pelajari cara membuat aplikasi pencarian semantik menggunakan AI multimodal
  yang memahami hubungan teks-gambar, lebih dari sekadar pencocokan kata kunci.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sebagai manusia, kita menafsirkan dunia melalui indera kita. Kita mendengar suara, melihat gambar, video, dan teks, yang sering kali saling bertumpuk satu sama lain. Kita memahami dunia melalui berbagai modalitas ini dan hubungan di antara mereka. Agar kecerdasan buatan benar-benar menyamai atau melampaui kemampuan manusia, kecerdasan buatan harus mengembangkan kemampuan yang sama untuk memahami dunia melalui berbagai lensa secara bersamaan.</p>
<p>Dalam artikel ini dan video yang menyertainya (segera hadir) serta buku catatan, kami akan menunjukkan terobosan terbaru dalam model yang dapat memproses teks dan gambar secara bersamaan. Kami akan mendemonstrasikan hal ini dengan membangun aplikasi pencarian semantik yang lebih dari sekadar pencocokan kata kunci - aplikasi ini memahami hubungan antara apa yang diminta pengguna dan konten visual yang mereka cari.</p>
<p>Yang membuat proyek ini sangat menarik adalah bahwa proyek ini dibangun sepenuhnya dengan alat bantu sumber terbuka: basis data vektor Milvus, perpustakaan pembelajaran mesin HuggingFace, dan kumpulan data ulasan pelanggan Amazon. Sungguh luar biasa untuk berpikir bahwa hanya satu dekade yang lalu, membangun sesuatu seperti ini akan membutuhkan sumber daya eksklusif yang signifikan. Saat ini, komponen-komponen canggih ini tersedia secara gratis dan dapat dikombinasikan dengan cara yang inovatif oleh siapa saja yang memiliki rasa ingin tahu untuk bereksperimen.</p>
<custom-h1>Gambaran Umum</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Aplikasi pencarian multimodal kami adalah jenis <em>retrieve-and-rerank</em>. Jika Anda terbiasa dengan <em>retrieval-augmented-generation</em> (RAG), ini sangat mirip, hanya saja hasil akhirnya adalah daftar gambar yang diurutkan ulang oleh model visi-bahasa yang besar (LLVM). Permintaan pencarian pengguna berisi teks dan gambar, dan targetnya adalah sekumpulan gambar yang diindeks dalam database vektor. Arsitektur ini memiliki tiga langkah - <em>pengindeksan</em>, <em>pengambilan</em>, dan <em>pemeringkatan ulang</em> (mirip dengan "pembuatan") - yang kami rangkum secara bergantian.</p>
<h2 id="Indexing" class="common-anchor-header">Pengindeksan<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Aplikasi pencarian kita harus memiliki sesuatu untuk dicari. Dalam kasus kami, kami menggunakan sebagian kecil dari kumpulan data "Amazon Reviews 2023", yang berisi teks dan gambar dari ulasan pelanggan Amazon di semua jenis produk. Anda dapat membayangkan pencarian semantik seperti yang kami buat sebagai tambahan yang berguna untuk situs web e-niaga. Kami menggunakan 900 gambar dan membuang teks, meskipun kami mengamati bahwa notebook ini dapat ditingkatkan menjadi ukuran produksi dengan database dan penerapan inferensi yang tepat.</p>
<p>Bagian pertama dari "keajaiban" dalam pipeline kami adalah pilihan model penyematan. Kami menggunakan model multimodal yang baru-baru ini dikembangkan yang disebut <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a> yang dapat menyematkan teks dan gambar secara bersama-sama, atau secara terpisah, ke dalam ruang yang sama dengan model tunggal di mana titik-titik yang berdekatan memiliki kemiripan semantik. Model lain yang serupa telah dikembangkan baru-baru ini, misalnya <a href="https://github.com/google-deepmind/magiclens">MagicLens</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar di atas mengilustrasikan: penyematan untuk [gambar singa tampak samping] ditambah teks "tampak depan ini", mendekati penyematan untuk [gambar singa tampak depan] tanpa teks. Model yang sama digunakan untuk input teks plus gambar dan input gambar saja (serta input teks saja). <em>Dengan cara ini, model ini dapat memahami maksud pengguna tentang bagaimana teks kueri berhubungan dengan gambar kueri.</em></p>
<p>Kami menyematkan 900 gambar produk kami tanpa teks yang sesuai dan menyimpan penyematan tersebut dalam basis data vektor menggunakan <a href="https://milvus.io/docs">Milvus</a>.</p>
<h2 id="Retrieval" class="common-anchor-header">Pengambilan<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah basis data kita dibuat, kita dapat melayani permintaan pengguna. Bayangkan seorang pengguna datang dengan pertanyaan: "casing ponsel dengan ini" ditambah [gambar Macan Tutul]. Artinya, mereka mencari casing ponsel dengan cetakan kulit Macan Tutul.</p>
<p>Perhatikan bahwa teks kueri pengguna mengatakan "ini" dan bukannya "kulit Macan Tutul". Model penyematan kami harus dapat menghubungkan "ini" dengan apa yang dirujuknya, yang merupakan prestasi yang mengesankan, mengingat iterasi model sebelumnya tidak dapat menangani instruksi terbuka seperti itu. <a href="https://arxiv.org/abs/2403.19651">Makalah MagicLens</a> memberikan contoh lebih lanjut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kami menyematkan teks kueri dan gambar secara bersamaan dan melakukan pencarian kemiripan pada basis data vektor kami, menghasilkan sembilan hit teratas. Hasilnya ditunjukkan pada gambar di atas, bersama dengan gambar kueri macan tutul. Tampaknya hasil pencarian teratas bukanlah yang paling relevan dengan kueri. Hasil ketujuh tampaknya paling relevan - ini adalah sampul ponsel dengan cetakan kulit macan tutul.</p>
<h2 id="Generation" class="common-anchor-header">Generasi<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Tampaknya pencarian kami gagal karena hasil teratas bukanlah yang paling relevan. Namun, kita dapat memperbaikinya dengan langkah pemeringkatan ulang. Anda mungkin sudah tidak asing lagi dengan pemeringkatan ulang item yang diambil sebagai langkah penting dalam banyak pipeline RAG. Kami menggunakan <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a> sebagai model pemeringkatan ulang.</p>
<p>Pertama-tama, kami meminta LLVM untuk menghasilkan keterangan gambar kueri. Keluaran LLVM:</p>
<p><em>"Gambar ini menunjukkan wajah macan tutul dari dekat dengan fokus pada bulu tutul dan mata hijau."</em></p>
<p>Kami kemudian memasukkan keterangan ini, satu gambar dengan sembilan hasil dan gambar kueri, dan membuat perintah teks yang meminta model untuk mengurutkan ulang hasilnya, memberikan jawaban dalam bentuk daftar dan memberikan alasan untuk pilihan kecocokan teratas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Outputnya divisualisasikan pada gambar di atas - item yang paling relevan sekarang menjadi kecocokan teratas - dan alasan yang diberikan adalah:</p>
<p><em>"Item yang paling cocok adalah yang bertema macan tutul, yang sesuai dengan instruksi permintaan pengguna untuk casing ponsel dengan tema serupa."</em></p>
<p>Pemeringkatan ulang LLVM kami mampu melakukan pemahaman di seluruh gambar dan teks, dan meningkatkan relevansi hasil pencarian. <em>Salah satu artefak yang menarik adalah bahwa pemeringkatan ulang hanya memberikan delapan hasil dan telah membuang satu hasil, yang menyoroti perlunya pagar pembatas dan keluaran yang terstruktur.</em></p>
<h2 id="Summary" class="common-anchor-header">Ringkasan<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam tulisan ini dan video yang menyertainya (segera hadir) serta <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">buku catatan</a>, kami telah membuat sebuah aplikasi untuk pencarian semantik multimodal pada teks dan gambar. Model penyematan dapat menyematkan teks dan gambar secara bersama-sama atau secara terpisah ke dalam ruang yang sama, dan model fondasi dapat memasukkan teks dan gambar sambil menghasilkan teks sebagai tanggapan. <em>Yang penting, model penyematan mampu menghubungkan maksud pengguna dari instruksi terbuka ke gambar kueri dan dengan cara itu menentukan bagaimana pengguna ingin hasilnya berhubungan dengan gambar input.</em></p>
<p>Ini hanyalah gambaran dari apa yang akan datang dalam waktu dekat. Kita akan melihat banyak aplikasi pencarian multimodal, pemahaman dan penalaran multimodal, dan seterusnya di berbagai modalitas: gambar, video, audio, molekul, jejaring sosial, data tabular, deret waktu, potensinya tidak terbatas.</p>
<p>Dan inti dari sistem ini adalah basis data vektor yang menyimpan "memori" eksternal sistem. Milvus adalah pilihan yang sangat baik untuk tujuan ini. <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Milvus</a> adalah sumber terbuka, berfitur lengkap (lihat <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">artikel ini tentang pencarian teks lengkap di Milvus 2.5</a>) dan berskala efisien untuk miliaran vektor dengan lalu lintas skala web dan latensi sub-100ms. Cari tahu lebih lanjut di <a href="https://milvus.io/docs">dokumen Milvus</a>, bergabunglah dengan komunitas <a href="https://milvus.io/discord">Discord</a> kami, dan sampai jumpa di <a href="https://lu.ma/unstructured-data-meetup">pertemuan Data Tidak Terstruktur</a> berikutnya. Sampai jumpa!</p>
<h2 id="Resources" class="common-anchor-header">Sumber daya<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>Buku catatan: <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">"Pencarian Multimodal dengan Ulasan Amazon dan Pemeringkatan Ulang LLVM</a>"</p></li>
<li><p>Video Youtube AWS Developers (segera hadir)</p></li>
<li><p><a href="https://milvus.io/docs">Dokumentasi Milvus</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">Pertemuan Data Tidak Terstruktur</a></p></li>
<li><p>Model penyematan: <a href="https://huggingface.co/BAAI/bge-visualized">Kartu model BGE yang divisualisasikan</a></p></li>
<li><p>Alt. model penyematan: <a href="https://github.com/google-deepmind/magiclens">Repo model MagicLens</a></p></li>
<li><p>LLVM <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Kartu model Phi-3 Vision</a></p></li>
<li><p>Makalah "<a href="https://arxiv.org/abs/2403.19651">MagicLens: Pengambilan Gambar yang Diawasi Sendiri dengan Instruksi Terbuka</a>"</p></li>
<li><p>Dataset: <a href="https://amazon-reviews-2023.github.io/">Ulasan Amazon 2023</a></p></li>
</ul>
