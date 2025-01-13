---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: Pencarian berbasis kata kunci
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  Tokopedia menggunakan Milvus untuk membangun sistem pencarian 10x lebih cerdas
  yang telah meningkatkan pengalaman pengguna secara dramatis.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>Bagaimana kami menggunakan penelusuran semantik untuk membuat pencarian kami 10x lebih cerdas</custom-h1><p>Di Tokopedia, kami memahami bahwa nilai dalam korpus produk kami hanya akan terbuka jika pembeli dapat menemukan produk yang relevan bagi mereka, sehingga kami berusaha keras untuk meningkatkan relevansi hasil pencarian.</p>
<p>Untuk meningkatkan upaya tersebut, kami memperkenalkan fitur <strong>pencarian kemiripan</strong> di Tokopedia. Jika Anda membuka halaman hasil pencarian di perangkat seluler, Anda akan menemukan tombol "..." yang menampilkan menu yang memberikan Anda pilihan untuk mencari produk yang mirip dengan produk tersebut.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">Pencarian berbasis kata kunci<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Pencarian Tokopedia menggunakan <strong>Elasticsearch</strong> untuk pencarian dan pemeringkatan produk. Untuk setiap permintaan pencarian, pertama-tama kami melakukan query ke Elasticsearch, yang akan mengurutkan produk sesuai dengan permintaan pencarian. Elasticsearch menyimpan setiap kata sebagai urutan angka yang mewakili kode <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (atau UTF) untuk setiap huruf. Ini membangun <a href="https://en.wikipedia.org/wiki/Inverted_index">indeks terbalik</a> untuk mengetahui dengan cepat, dokumen mana yang mengandung kata-kata dari kueri pengguna, dan kemudian menemukan kecocokan terbaik di antara mereka menggunakan berbagai algoritma penilaian. Algoritme penilaian ini tidak terlalu memperhatikan apa arti dari kata-kata tersebut, tetapi lebih pada seberapa sering kata-kata tersebut muncul dalam dokumen, seberapa dekat kata-kata tersebut satu sama lain, dll. Representasi ASCII jelas mengandung informasi yang cukup untuk menyampaikan semantik (bagaimanapun juga kita, manusia, dapat memahaminya). Sayangnya, tidak ada algoritme yang baik bagi komputer untuk membandingkan kata-kata yang dikodekan dengan ASCII berdasarkan artinya.</p>
<h2 id="Vector-representation" class="common-anchor-header">Representasi vektor<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>Salah satu solusi untuk hal ini adalah dengan membuat representasi alternatif, yang tidak hanya memberitahu kita tentang huruf-huruf yang terkandung dalam kata tersebut, namun juga tentang maknanya. Sebagai contoh, kita dapat mengkodekan <em>kata lain yang sering digunakan bersama dengan kata</em> tersebut (diwakili oleh konteks yang mungkin). Kemudian kita akan mengasumsikan bahwa konteks yang serupa mewakili hal yang serupa, dan mencoba membandingkannya dengan menggunakan metode matematika. Kita bahkan dapat menemukan cara untuk mengkodekan seluruh kalimat berdasarkan maknanya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Bagaimana kami menggunakan pencarian semantik untuk membuat pencarian kami 10x lebih cerdas_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">Pilih mesin pencari kemiripan semantik<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang setelah kita memiliki vektor fitur, masalah yang tersisa adalah bagaimana cara mengambil vektor yang mirip dengan vektor target dari kumpulan vektor yang sangat besar. Dalam hal mesin pencari penyematan, kami mencoba POC pada beberapa mesin yang tersedia di Github, beberapa di antaranya adalah FAISS, Vearch, Milvus.</p>
<p>Kami lebih memilih Milvus daripada mesin lainnya berdasarkan hasil uji beban. Di satu sisi, kami telah menggunakan FAISS sebelumnya di tim lain dan karenanya kami ingin mencoba sesuatu yang baru. Dibandingkan dengan Milvus, FAISS lebih merupakan sebuah library yang mendasari, oleh karena itu kurang nyaman untuk digunakan. Setelah kami mempelajari lebih lanjut tentang Milvus, kami akhirnya memutuskan untuk mengadopsi Milvus karena dua fitur utamanya:</p>
<ul>
<li><p>Milvus sangat mudah digunakan. Yang perlu Anda lakukan hanyalah menarik citra Docker-nya dan memperbarui parameter berdasarkan skenario Anda sendiri.</p></li>
<li><p>Milvus mendukung lebih banyak indeks dan memiliki dokumentasi pendukung yang terperinci.</p></li>
</ul>
<p>Singkatnya, Milvus sangat ramah terhadap pengguna dan dokumentasinya cukup rinci. Jika Anda menemukan masalah apa pun, Anda biasanya dapat menemukan solusinya dalam dokumentasi; jika tidak, Anda selalu dapat memperoleh dukungan dari komunitas Milvus.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Layanan cluster Milvus<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah memutuskan untuk menggunakan Milvus sebagai mesin pencari vektor fitur, kami memutuskan untuk menggunakan Milvus untuk salah satu kasus penggunaan layanan Iklan kami di mana kami ingin mencocokkan kata kunci dengan <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">tingkat penayangan rendah</a> dengan kata kunci dengan tingkat penayangan tinggi. Kami mengonfigurasi node mandiri di lingkungan pengembangan (DEV) dan mulai menayangkan, node tersebut berjalan dengan baik selama beberapa hari, dan memberikan metrik CTR/CVR yang lebih baik. Jika node mandiri macet dalam produksi, seluruh layanan tidak akan tersedia. Oleh karena itu, kami perlu menggunakan layanan penelusuran yang sangat tersedia.</p>
<p>Milvus menyediakan Mishards, sebuah middleware cluster sharding, dan Milvus-Helm untuk konfigurasi. Di Tokopedia, kami menggunakan playbook Ansible untuk pengaturan infrastruktur sehingga kami membuat playbook untuk orkestrasi infrastruktur. Diagram di bawah ini dari dokumentasi Milvus menunjukkan cara kerja Mishards:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Bagaimana kami menggunakan pencarian semantik untuk membuat pencarian kami 10x lebih pintar_3.png</span> </span></p>
<p>Mishards mengalirkan permintaan dari hulu ke sub-modulnya yang membagi permintaan hulu, dan kemudian mengumpulkan dan mengembalikan hasil sub-layanan ke hulu. Arsitektur keseluruhan dari solusi cluster berbasis Mishards ditunjukkan di bawah ini: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_Bagaimana kami menggunakan pencarian semantik untuk membuat pencarian kami 10x lebih pintar_4.jpeg</span> </span></p>
<p>Dokumentasi resmi memberikan pengenalan yang jelas tentang Mishards. Anda dapat merujuk ke <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> jika Anda tertarik.</p>
<p>Dalam layanan kata kunci-ke-kata kunci kami, kami menggunakan satu node yang dapat ditulis, dua node yang hanya dapat dibaca, dan satu instance middleware Mishards di GCP, menggunakan Milvus ansible. Sejauh ini sudah stabil. Komponen besar yang memungkinkan untuk melakukan kueri secara efisien terhadap jutaan, miliaran, atau bahkan triliunan set data vektor yang diandalkan oleh mesin pencari kemiripan adalah <a href="https://milvus.io/docs/v0.10.5/index.md">pengindeksan</a>, sebuah proses pengorganisasian data yang secara drastis mempercepat pencarian data besar.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">Bagaimana pengindeksan vektor mempercepat pencarian kemiripan?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Mesin pencari kemiripan bekerja dengan membandingkan input ke database untuk menemukan objek yang paling mirip dengan input tersebut. Pengindeksan adalah proses pengorganisasian data secara efisien, dan ini memainkan peran utama dalam membuat pencarian kemiripan menjadi berguna dengan secara dramatis mempercepat kueri yang memakan waktu pada kumpulan data yang besar. Setelah kumpulan data vektor yang sangat besar diindeks, kueri dapat dialihkan ke cluster, atau subset data, yang kemungkinan besar berisi vektor yang mirip dengan kueri masukan. Dalam praktiknya, ini berarti tingkat akurasi tertentu dikorbankan untuk mempercepat kueri pada data vektor yang sangat besar.</p>
<p>Sebuah analogi dapat diambil dari sebuah kamus, di mana kata-kata diurutkan menurut abjad. Ketika mencari sebuah kata, Anda dapat dengan cepat menavigasi ke bagian yang hanya berisi kata-kata dengan huruf awal yang sama - secara drastis mempercepat pencarian definisi kata yang dimasukkan.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">Apa selanjutnya, Anda bertanya?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Bagaimana kami menggunakan pencarian semantik untuk membuat pencarian kami 10x lebih cerdas_5.jpeg</span> </span></p>
<p>Seperti yang ditunjukkan di atas, tidak ada solusi yang cocok untuk semua, kami selalu ingin meningkatkan kinerja model yang digunakan untuk mendapatkan sematan.</p>
<p>Selain itu, dari sudut pandang teknis, kami ingin menjalankan beberapa model pembelajaran pada saat yang sama dan membandingkan hasil dari berbagai eksperimen. Pantau terus laman ini untuk informasi lebih lanjut tentang eksperimen kami seperti pencarian gambar dan pencarian video.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">Referensi:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Dokumen Mishards：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>Artikel blog ini diposting ulang dari: https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>Baca <a href="https://zilliz.com/user-stories">cerita pengguna</a> lain untuk mempelajari lebih lanjut tentang membuat sesuatu dengan Milvus.</p>
