---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >-
  Membuka Kunci Pengambilan Tingkat Entitas yang Sebenarnya: Kemampuan
  Array-of-Structs dan MAX_SIM yang baru di Milvus
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/array_of_structs_cover_update_5c3d76ac94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  Pelajari bagaimana Array of Structs dan MAX_SIM di Milvus memungkinkan
  pencarian tingkat entitas yang sebenarnya untuk data multi-vektor,
  menghilangkan deduping dan meningkatkan akurasi pengambilan.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>Jika Anda telah membuat aplikasi AI di atas basis data vektor, Anda mungkin mengalami masalah yang sama: basis data mengambil penyematan potongan-potongan individu, tetapi aplikasi Anda peduli dengan <strong><em>entitas</em></strong>. Ketidaksesuaian ini membuat seluruh alur kerja pengambilan menjadi rumit.</p>
<p>Anda mungkin telah melihat hal ini berulang kali:</p>
<ul>
<li><p><strong>Basis pengetahuan RAG:</strong> Artikel dipotong-potong menjadi beberapa paragraf, sehingga mesin pencari mengembalikan potongan-potongan yang tersebar, bukan dokumen lengkap.</p></li>
<li><p><strong>Rekomendasi e-commerce:</strong> Sebuah produk memiliki beberapa penyematan gambar, dan sistem Anda mengembalikan lima sudut pandang dari item yang sama, bukan lima produk unik.</p></li>
<li><p><strong>Platform video:</strong> Video dipecah menjadi penyematan klip, tetapi hasil penelusuran menampilkan potongan-potongan video yang sama, bukan satu entri yang terkonsolidasi.</p></li>
<li><p><strong>Pengambilan gaya ColBERT / ColPali:</strong> Dokumen meluas menjadi ratusan penyematan token atau patch-level, dan hasil pencarian Anda kembali sebagai potongan-potongan kecil yang masih perlu digabungkan.</p></li>
</ul>
<p>Semua masalah ini berasal dari <em>kesenjangan arsitektur yang sama</em>: sebagian besar basis data vektor memperlakukan setiap penyematan sebagai baris yang terisolasi, sementara aplikasi nyata beroperasi pada entitas tingkat yang lebih tinggi - dokumen, produk, video, item, adegan. Akibatnya, tim teknik dipaksa untuk merekonstruksi entitas secara manual menggunakan logika deduplikasi, pengelompokan, bucketing, dan pemeringkatan ulang. Cara ini berhasil, tetapi rapuh, lambat, dan membebani lapisan aplikasi Anda dengan logika yang seharusnya tidak pernah ada di sana.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a> menutup celah ini dengan fitur baru: <a href="https://milvus.io/docs/array-of-structs.md"><strong>Array of Structs</strong></a> dengan tipe metrik <strong>MAX_SIM</strong>. Bersama-sama, keduanya memungkinkan semua penyematan untuk satu entitas disimpan dalam satu catatan dan memungkinkan Milvus untuk menilai dan mengembalikan entitas secara holistik. Tidak ada lagi set hasil yang diisi dengan duplikat. Tidak ada lagi post-processing yang rumit seperti pemeringkatan ulang dan penggabungan</p>
<p>Pada artikel ini, kita akan membahas cara kerja Array of Structs dan MAX_SIM-dan mendemonstrasikannya melalui dua contoh nyata: Pengambilan dokumen Wikipedia dan pencarian dokumen berbasis gambar ColPali.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">Apa yang dimaksud dengan Array of Structs?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam Milvus, sebuah bidang <strong>Array of Structs</strong> memungkinkan sebuah catatan tunggal untuk berisi <em>daftar</em> elemen Struct yang <em>terurut</em>, masing-masing mengikuti skema yang sudah ditentukan sebelumnya. Sebuah Struct dapat menampung beberapa vektor serta bidang skalar, string, atau jenis lain yang didukung. Dengan kata lain, struktur ini memungkinkan Anda menggabungkan semua bagian yang termasuk dalam satu entitas-penyematan paragraf, tampilan gambar, vektor token, metadata-langsung di dalam satu baris.</p>
<p>Berikut ini contoh entitas dari koleksi yang berisi bidang Array of Structs.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Pada contoh di atas, bidang <code translate="no">chunks</code> adalah bidang Array of Structs, dan setiap elemen Struct berisi bidangnya sendiri, yaitu <code translate="no">text</code>, <code translate="no">text_vector</code>, dan <code translate="no">chapter</code>.</p>
<p>Pendekatan ini memecahkan masalah pemodelan yang sudah lama ada dalam database vektor. Secara tradisional, setiap penyematan atau atribut harus menjadi barisnya sendiri, yang memaksa <strong>entitas multi-vektor (dokumen, produk, video)</strong> untuk dipecah menjadi puluhan, ratusan, atau bahkan ribuan record. Dengan Array of Structs, Milvus memungkinkan Anda menyimpan seluruh entitas multi-vektor dalam satu bidang, sehingga cocok untuk daftar paragraf, penyematan token, urutan klip, gambar multi-tampilan, atau skenario apa pun di mana satu item logis terdiri dari banyak vektor.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">Bagaimana Cara Kerja Larik Struktur dengan MAX_SIM?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>Di atas larik struktur struktur baru ini terdapat <strong>MAX_SIM</strong>, sebuah strategi penilaian baru yang membuat pengambilan semantik menjadi sadar akan entitas. Ketika sebuah kueri masuk, Milvus membandingkannya dengan <em>setiap</em> vektor di dalam setiap larik struktur dan mengambil <strong>kemiripan maksimum</strong> sebagai skor akhir entitas. Entitas tersebut kemudian diberi peringkat - dan dikembalikan - berdasarkan skor tunggal tersebut. Hal ini menghindari masalah vektor-database klasik dalam mengambil fragmen-fragmen yang tersebar dan mendorong beban pengelompokan, deduping, dan pemeringkatan ulang ke dalam lapisan aplikasi. Dengan MAX_SIM, pengambilan tingkat entitas menjadi built-in, konsisten, dan efisien.</p>
<p>Untuk memahami cara kerja MAX_SIM dalam praktiknya, mari kita lihat contoh konkretnya.</p>
<p><strong>Catatan:</strong> Semua vektor dalam contoh ini dihasilkan oleh model penyematan yang sama, dan kemiripan diukur dengan kemiripan kosinus dalam rentang [0,1].</p>
<p>Misalkan seorang pengguna mencari <strong>"Kursus Pemula Pembelajaran Mesin."</strong></p>
<p>Kueri tersebut di-token menjadi tiga <strong>token</strong>:</p>
<ul>
<li><p><em>Pembelajaran mesin</em></p></li>
<li><p><em>pemula</em></p></li>
<li><p><em>kursus</em></p></li>
</ul>
<p>Masing-masing token ini kemudian <strong>diubah menjadi vektor</strong> penyematan dengan model penyematan yang sama dengan yang digunakan untuk dokumen.</p>
<p>Sekarang, bayangkan basis data vektor berisi dua dokumen:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>Panduan Pengenalan Jaringan Syaraf Tiruan dengan Python</em></p></li>
<li><p><strong>doc_2:</strong> <em>Panduan Tingkat Lanjut untuk Membaca Makalah LLM</em></p></li>
</ul>
<p>Kedua dokumen tersebut telah dimasukkan ke dalam vektor dan disimpan di dalam Array of Structs.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>Langkah 1: Hitung MAX_SIM untuk doc_1</strong></h3><p>Untuk setiap vektor kueri, Milvus menghitung kemiripan kosinus terhadap setiap vektor dalam doc_1:</p>
<table>
<thead>
<tr><th></th><th>Pengantar</th><th>panduan</th><th>jaringan syaraf tiruan dalam</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>pembelajaran mesin</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>pemula</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>kursus</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>Untuk setiap vektor kueri, MAX_SIM memilih kemiripan <strong>tertinggi</strong> dari barisnya:</p>
<ul>
<li><p>pembelajaran mesin → jaringan syaraf tiruan dalam (0.9)</p></li>
<li><p>pemula → pengenalan (0.8)</p></li>
<li><p>kursus → panduan (0,7)</p></li>
</ul>
<p>Menjumlahkan kecocokan terbaik memberikan <strong>skor MAX_SIM sebesar 2,4</strong> kepada doc_1.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">Langkah 2: Menghitung MAX_SIM untuk doc_2</h3><p>Sekarang kita ulangi proses ini untuk doc_2:</p>
<table>
<thead>
<tr><th></th><th>lanjutan</th><th>panduan</th><th>LLM</th><th>kertas</th><th>membaca</th></tr>
</thead>
<tbody>
<tr><td>pembelajaran mesin</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>pemula</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>kursus saja.</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>Match (kecocokan) terbaik untuk doc_2 adalah:</p>
<ul>
<li><p>"pembelajaran mesin" → "LLM" (0.9)</p></li>
<li><p>"pemula" → "panduan" (0.6)</p></li>
<li><p>"kursus" → "panduan" (0.8)</p></li>
</ul>
<p>Menjumlahkan keduanya akan memberikan <strong>skor MAX_SIM</strong> doc_2 <strong>sebesar 2,3</strong>.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">Langkah 3: Bandingkan Skor</h3><p>Karena <strong>2.4 &gt; 2.3</strong>, <strong>doc_1 memiliki peringkat yang lebih tinggi daripada doc_2</strong>, yang secara intuitif masuk akal, karena doc_1 lebih dekat dengan panduan pembelajaran mesin.</p>
<p>Dari contoh ini, kita dapat menyoroti tiga karakteristik inti dari MAX_SIM:</p>
<ul>
<li><p><strong>Semantik terlebih dahulu, bukan berbasis kata kunci:</strong> MAX_SIM membandingkan sematan, bukan literal teks. Meskipun <em>"pembelajaran mesin"</em> dan <em>"jaringan syaraf tiruan"</em> tidak memiliki kata yang tumpang tindih, kemiripan semantiknya adalah 0,9. Hal ini membuat MAX_SIM kuat terhadap sinonim, parafrase, tumpang tindih konseptual, dan beban kerja yang kaya akan penyematan modern.</p></li>
<li><p><strong>Tidak sensitif terhadap panjang dan urutan:</strong> MAX_SIM tidak mengharuskan kueri dan dokumen memiliki jumlah vektor yang sama (misalnya, doc_1 memiliki 4 vektor sementara doc_2 memiliki 5 vektor, dan keduanya berfungsi dengan baik). MAX_SIM juga mengabaikan urutan vektor - "pemula" yang muncul lebih awal dalam kueri dan "pendahuluan" yang muncul kemudian dalam dokumen tidak berdampak pada skor.</p></li>
<li><p><strong>Setiap vektor kueri penting:</strong> MAX_SIM mengambil kecocokan terbaik untuk setiap vektor kueri dan menjumlahkan skor terbaik tersebut. Hal ini mencegah vektor yang tidak cocok untuk mempengaruhi hasil dan memastikan bahwa setiap token kueri yang penting berkontribusi pada skor akhir. Sebagai contoh, kecocokan berkualitas rendah untuk "pemula" di doc_2 secara langsung mengurangi skor keseluruhannya.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">Mengapa MAX_SIM + Larik Struktur Penting dalam Basis Data Vektor<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka dan berkinerja tinggi dan sekarang sepenuhnya mendukung MAX_SIM bersama dengan Array of Structs, yang memungkinkan pengambilan multi-vektor tingkat entitas secara asli:</p>
<ul>
<li><p><strong>Menyimpan entitas multi-vektor secara native:</strong> Array of Structs memungkinkan Anda untuk menyimpan kelompok vektor terkait dalam satu bidang tanpa memisahkannya ke dalam baris atau tabel tambahan yang terpisah.</p></li>
<li><p><strong>Komputasi pencocokan terbaik yang efisien:</strong> Dikombinasikan dengan indeks vektor seperti IVF dan HNSW, MAX_SIM dapat menghitung kecocokan terbaik tanpa memindai setiap vektor, sehingga menjaga kinerja tetap tinggi bahkan dengan dokumen yang besar.</p></li>
<li><p><strong>Dibuat khusus untuk beban kerja yang berat secara semantik:</strong> Pendekatan ini unggul dalam pencarian teks panjang, pencocokan semantik multi-segi, penyelarasan ringkasan dokumen, kueri multi-kata kunci, dan skenario AI lainnya yang membutuhkan penalaran semantik yang fleksibel dan berbutir halus.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">Kapan Menggunakan Array of Structs<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>Nilai <strong>Array of Structs</strong> menjadi jelas ketika Anda melihat apa yang dimungkinkannya. Pada intinya, fitur ini menyediakan tiga kemampuan dasar:</p>
<ul>
<li><p>Fitur<strong>ini menggabungkan data heterogen-vektor</strong>, skalar, string, metadata-ke dalam satu objek terstruktur.</p></li>
<li><p>Fitur<strong>ini menyelaraskan penyimpanan dengan entitas dunia nyata</strong>, sehingga setiap baris basis data dipetakan dengan jelas ke item aktual seperti artikel, produk, atau video.</p></li>
<li><p><strong>Ketika dikombinasikan dengan fungsi agregat seperti MAX_SIM</strong>, ini memungkinkan pengambilan multi-vektor tingkat entitas yang sebenarnya langsung dari basis data, menghilangkan deduplikasi, pengelompokan, atau pengurutan ulang di lapisan aplikasi.</p></li>
</ul>
<p>Karena sifat-sifat ini, Array of Structs sangat cocok setiap kali <em>entitas logis tunggal diwakili oleh beberapa vektor</em>. Contoh umum termasuk artikel yang dipecah menjadi beberapa paragraf, dokumen yang diuraikan menjadi penyematan token, atau produk yang diwakili oleh beberapa gambar. Jika hasil pencarian Anda mengalami duplikat hit, fragmen yang tersebar, atau entitas yang sama muncul beberapa kali di hasil teratas, Array of Structs menyelesaikan masalah ini pada lapisan penyimpanan dan pengambilan - bukan melalui penambalan setelah fakta dalam kode aplikasi.</p>
<p>Pola ini sangat kuat untuk sistem AI modern yang mengandalkan <strong>pengambilan multi-vektor</strong>, sebagai contoh:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a> merepresentasikan satu dokumen sebagai 100-500 penyematan token untuk pencocokan semantik berbutir halus di seluruh domain seperti teks hukum dan penelitian akademis.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong> mengubah </a>setiap halaman PDF menjadi 256-1024 tambalan gambar untuk pencarian lintas-modal di seluruh laporan keuangan, kontrak, faktur, dan dokumen pindaian lainnya.</p></li>
</ul>
<p>Sebuah array Structs memungkinkan Milvus menyimpan semua vektor ini di bawah satu entitas dan menghitung kemiripan agregat (mis., MAX_SIM) secara efisien dan native. Untuk memperjelas hal ini, berikut adalah dua contoh konkret.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">Contoh 1: Pencarian Produk E-commerce</h3><p>Sebelumnya, produk dengan banyak gambar disimpan dalam skema datar-satu gambar per baris. Sebuah produk dengan foto depan, samping, dan miring menghasilkan tiga baris. Hasil pencarian sering kali mengembalikan beberapa gambar dari produk yang sama, sehingga membutuhkan deduplikasi manual dan pemeringkatan ulang.</p>
<p>Dengan Array Struktur, setiap produk menjadi <strong>satu baris</strong>. Semua penyematan gambar dan metadata (angle, is_primary, dll.) berada di dalam bidang <code translate="no">images</code> sebagai array of structs. Milvus memahami bahwa mereka adalah bagian dari produk yang sama dan mengembalikan produk tersebut secara keseluruhan - bukan gambar individualnya.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">Contoh 2: Basis Pengetahuan atau Pencarian Wikipedia</h3><p>Sebelumnya, satu artikel Wikipedia dibagi menjadi <em>N</em> baris paragraf. Hasil pencarian mengembalikan paragraf yang tersebar, memaksa sistem untuk mengelompokkannya dan menebak artikel mana yang termasuk di dalamnya.</p>
<p>Dengan Array of Structs, seluruh artikel menjadi <strong>satu baris</strong>. Semua paragraf dan penyematannya dikelompokkan di bawah bidang paragraf, dan basis data mengembalikan artikel lengkap, bukan potongan-potongan yang terpecah-pecah.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">Tutorial Praktis: Pengambilan Tingkat Dokumen dengan Array of Structs<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. Pengambilan Dokumen Wikipedia</h3><p>Dalam tutorial ini, kita akan membahas cara menggunakan <strong>Array of Structs</strong> untuk mengubah data tingkat paragraf menjadi catatan dokumen lengkap - memungkinkan Milvus untuk melakukan <strong>pengambilan tingkat dokumen yang sebenarnya</strong> daripada mengembalikan fragmen-fragmen yang terisolasi.</p>
<p>Banyak pipeline basis pengetahuan menyimpan artikel Wikipedia sebagai potongan paragraf. Hal ini bekerja dengan baik untuk penyematan dan pengindeksan, tetapi ini merusak pengambilan: kueri pengguna biasanya mengembalikan paragraf yang terpencar-pencar, memaksa Anda untuk mengelompokkan dan merekonstruksi artikel secara manual. Dengan Array of Structs dan MAX_SIM, kita dapat mendesain ulang skema penyimpanan sehingga <strong>setiap artikel menjadi satu baris</strong>, dan Milvus dapat mengurutkan dan mengembalikan seluruh dokumen secara native.</p>
<p>Di langkah selanjutnya, kami akan menunjukkan caranya:</p>
<ol>
<li><p>Memuat dan melakukan praproses data paragraf Wikipedia</p></li>
<li><p>Mengelompokkan semua paragraf yang termasuk dalam artikel yang sama ke dalam Array of Structs</p></li>
<li><p>Masukkan dokumen terstruktur ini ke dalam Milvus</p></li>
<li><p>Jalankan kueri MAX_SIM untuk mengambil artikel lengkap - dengan bersih, tanpa deduping atau perangkingan ulang</p></li>
</ol>
<p>Pada akhir tutorial ini, Anda akan memiliki pipeline yang berfungsi di mana Milvus menangani pengambilan tingkat entitas secara langsung, persis seperti yang diharapkan pengguna.</p>
<p><strong>Model Data:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 1: Mengelompokkan dan Mengubah Data</strong></p>
<p>Untuk demo ini, kita menggunakan dataset <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Wikipedia Embeddings Sederhana</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 2: Membuat Koleksi Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 3: Memasukkan Data dan Membangun Indeks</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 4: Mencari Dokumen</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 5: Membandingkan Keluaran: Pengambilan Tradisional vs Array of Structs</strong></p>
<p>Dampak dari Array of Structs menjadi jelas ketika kita melihat apa yang sebenarnya dihasilkan oleh database:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Dimensi</strong></th><th style="text-align:center"><strong>Pendekatan Tradisional</strong></th><th style="text-align:center"><strong>Larik Struktur</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Keluaran Basis Data</strong></td><td style="text-align:center">Mengembalikan <strong>100 paragraf teratas</strong> (redundansi tinggi)</td><td style="text-align:center">Mengembalikan <em>10 dokumen lengkap teratas</em> - bersih dan akurat</td></tr>
<tr><td style="text-align:center"><strong>Logika Aplikasi</strong></td><td style="text-align:center">Membutuhkan <strong>pengelompokan, deduplikasi, dan pengurutan ulang</strong> (kompleks)</td><td style="text-align:center">Tidak perlu pemrosesan pasca - hasil tingkat entitas datang langsung dari Milvus</td></tr>
</tbody>
</table>
<p>Dalam contoh Wikipedia, kami hanya mendemonstrasikan kasus yang paling sederhana: menggabungkan vektor paragraf ke dalam representasi dokumen terpadu. Tetapi kekuatan sebenarnya dari Array of Structs adalah bahwa ia dapat digeneralisasi ke model data multi-vektor apa <strong>pun</strong> - baik jalur pengambilan klasik maupun arsitektur AI modern.</p>
<p><strong>Skenario Pengambilan Multi-Vektor Tradisional</strong></p>
<p>Banyak sistem pencarian dan rekomendasi yang sudah mapan secara alami beroperasi pada entitas dengan beberapa vektor terkait. Array of Structs memetakan kasus-kasus penggunaan ini dengan jelas:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Skenario</strong></th><th style="text-align:center"><strong>Model Data</strong></th><th style="text-align:center"><strong>Vektor per Entitas</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>Produk e-commerce</strong></td><td style="text-align:center">Satu produk → beberapa gambar</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬 <strong>Pencarian video</strong></td><td style="text-align:center">Satu video → beberapa klip</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖 <strong>Pengambilan kertas</strong></td><td style="text-align:center">Satu kertas → beberapa bagian</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>Beban Kerja Model AI (Kasus Penggunaan Multi-Vektor Utama)</strong></p>
<p>Array of Structs menjadi semakin penting dalam model AI modern yang secara sengaja menghasilkan kumpulan besar vektor per entitas untuk penalaran semantik berbutir halus.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Model</strong></th><th style="text-align:center"><strong>Model Data</strong></th><th style="text-align:center"><strong>Vektor per Entitas</strong></th><th style="text-align:center"><strong>Aplikasi</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">Satu dokumen → banyak penyematan token</td><td style="text-align:center">100-500</td><td style="text-align:center">Teks hukum, makalah akademis, pengambilan dokumen berbutir halus</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">Satu halaman PDF → banyak penyematan tambalan</td><td style="text-align:center">256-1024</td><td style="text-align:center">Laporan keuangan, kontrak, faktur, pencarian dokumen multimodal</td></tr>
</tbody>
</table>
<p>Model-model ini <em>membutuhkan</em> pola penyimpanan multi-vektor. Sebelum Array of Structs, pengembang harus membagi vektor menjadi beberapa baris dan secara manual menyatukan hasilnya. Dengan Milvus, entitas-entitas ini sekarang dapat disimpan dan diambil secara native, dengan MAX_SIM yang menangani penilaian tingkat dokumen secara otomatis.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. Pencarian Dokumen Berbasis Gambar ColPali</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a> adalah model yang kuat untuk pengambilan PDF lintas-modal. Alih-alih mengandalkan teks, ColPali memproses setiap halaman PDF sebagai gambar dan mengirisnya menjadi hingga 1024 tambalan visual, menghasilkan satu penyematan per tambalan. Dalam skema database tradisional, hal ini memerlukan penyimpanan satu halaman sebagai ratusan atau ribuan baris terpisah, sehingga database tidak dapat memahami bahwa baris-baris tersebut adalah bagian dari halaman yang sama. Akibatnya, pencarian tingkat entitas menjadi terpecah-pecah dan tidak praktis.</p>
<p>Array of Structs memecahkan masalah ini dengan menyimpan semua patch yang disematkan di <em>dalam satu bidang</em>, sehingga Milvus dapat memperlakukan halaman sebagai satu entitas multi-vektor yang kohesif.</p>
<p>Pencarian PDF tradisional sering kali bergantung pada <strong>OCR</strong>, yang mengubah gambar halaman menjadi teks. Ini berfungsi untuk teks biasa tetapi kehilangan bagan, tabel, tata letak, dan isyarat visual lainnya. ColPali menghindari keterbatasan ini dengan bekerja secara langsung pada gambar halaman, mempertahankan semua informasi visual dan tekstual. Pengorbanannya adalah skala: setiap halaman sekarang berisi ratusan vektor, yang membutuhkan basis data yang dapat menggabungkan banyak penyematan ke dalam satu entitas - persis seperti yang disediakan oleh Array of Structs + MAX_SIM.</p>
<p>Kasus penggunaan yang paling umum adalah <strong>Vision RAG</strong>, di mana setiap halaman PDF menjadi entitas multi-vektor. Skenario umum meliputi:</p>
<ul>
<li><p><strong>Laporan keuangan:</strong> mencari ribuan PDF untuk halaman yang berisi bagan atau tabel tertentu.</p></li>
<li><p><strong>Kontrak:</strong> mengambil klausul dari dokumen hukum yang dipindai atau difoto.</p></li>
<li><p><strong>Faktur:</strong> menemukan faktur berdasarkan vendor, jumlah, atau tata letak.</p></li>
<li><p><strong>Presentasi:</strong> menemukan slide yang berisi gambar atau diagram tertentu.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Model Data:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 1: Siapkan Data</strong>Anda dapat merujuk ke dokumen untuk mengetahui detail tentang bagaimana ColPali mengubah gambar atau teks menjadi representasi multi-vektor.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 2: Membuat Koleksi Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 3: Memasukkan Data dan Membangun Indeks</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Langkah 4: Pencarian Lintas Moda: Kueri Teks → Hasil Gambar</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Contoh Keluaran:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>Di sini, hasilnya langsung mengembalikan halaman PDF penuh. Kita tidak perlu khawatir tentang penyematan patch 1024 yang mendasarinya-Milvus menangani semua agregasi secara otomatis.</p>
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
    </button></h2><p>Sebagian besar basis data vektor menyimpan setiap fragmen sebagai catatan independen, yang berarti aplikasi harus mengumpulkan kembali fragmen-fragmen tersebut ketika mereka membutuhkan dokumen, produk, atau halaman lengkap. Array Structs mengubah hal itu. Dengan menggabungkan skalar, vektor, teks, dan bidang lain ke dalam satu objek terstruktur, memungkinkan satu baris basis data mewakili satu entitas lengkap dari ujung ke ujung.</p>
<p>Hasilnya sederhana namun sangat kuat: pekerjaan yang dulunya membutuhkan pengelompokan, deduping, dan pengurutan ulang yang rumit di lapisan aplikasi menjadi kemampuan basis data asli. Dan itulah arah masa depan database vektor - struktur yang lebih kaya, pengambilan yang lebih cerdas, dan pipeline yang lebih sederhana.</p>
<p>Untuk informasi lebih lanjut tentang Array of Structs dan MAX_SIM, lihat dokumentasi di bawah ini:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">Array of Structs | Dokumentasi Milvus</a></li>
</ul>
<p>Ada pertanyaan atau ingin mendalami fitur-fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
