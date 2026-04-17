---
id: molecular-structure-similarity-with-milvus.md
title: Pendahuluan
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: Cara menjalankan analisis kemiripan struktur molekul di Milvus
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>Mempercepat Penemuan Obat Baru</custom-h1><h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Penemuan obat, sebagai sumber inovasi obat, merupakan bagian penting dari penelitian dan pengembangan obat baru. Penemuan obat diimplementasikan dengan pemilihan dan konfirmasi target. Ketika fragmen atau senyawa utama ditemukan, senyawa serupa biasanya dicari di perpustakaan senyawa internal atau komersial untuk menemukan hubungan struktur-aktivitas (SAR), ketersediaan senyawa, sehingga mengevaluasi potensi senyawa utama untuk dioptimalkan menjadi senyawa kandidat.</p>
<p>Untuk menemukan senyawa yang tersedia di ruang fragmen dari pustaka senyawa berskala miliaran, sidik jari kimia biasanya diambil untuk pencarian substruktur dan pencarian kemiripan. Namun, solusi tradisional ini memakan waktu dan rentan terhadap kesalahan dalam hal sidik jari kimia berdimensi tinggi berskala miliaran. Beberapa senyawa potensial juga dapat hilang dalam proses tersebut. Artikel ini membahas penggunaan Milvus, sebuah mesin pencari kemiripan untuk vektor berskala masif, dengan RDKit untuk membangun sebuah sistem pencarian kemiripan struktur kimia berkinerja tinggi.</p>
<p>Dibandingkan dengan metode tradisional, Milvus memiliki kecepatan pencarian yang lebih cepat dan cakupan yang lebih luas. Dengan memproses sidik jari kimia, Milvus dapat melakukan pencarian substruktur, pencarian kemiripan, dan pencarian yang tepat dalam pustaka struktur kimia untuk menemukan obat yang berpotensi tersedia.</p>
<h2 id="System-overview" class="common-anchor-header">Gambaran umum sistem<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Sistem ini menggunakan RDKit untuk menghasilkan sidik jari kimia, dan Milvus untuk melakukan pencarian kemiripan struktur kimia. Kunjungi https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search untuk mempelajari lebih lanjut tentang sistem ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>gambaran-sistem-1.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. Menghasilkan sidik jari kimia<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Sidik jari kimia biasanya digunakan untuk pencarian substruktur dan pencarian kemiripan. Gambar berikut ini menunjukkan daftar berurutan yang diwakili oleh bit. Setiap digit mewakili unsur, pasangan atom, atau gugus fungsi. Struktur kimia adalah <code translate="no">C1C(=O)NCO1</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-mengidentifikasi-pola-molekul.png</span> </span></p>
<p>Kita dapat menggunakan RDKit untuk menghasilkan sidik jari Morgan, yang mendefinisikan radius dari atom tertentu dan menghitung jumlah struktur kimia dalam kisaran radius untuk menghasilkan sidik jari kimia. Tentukan nilai yang berbeda untuk jari-jari dan bit untuk mendapatkan sidik jari kimia dari struktur kimia yang berbeda. Struktur kimia direpresentasikan dalam format SMILES.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. Mencari struktur kimia<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita kemudian dapat mengimpor sidik jari Morgan ke dalam Milvus untuk membangun basis data struktur kimia. Dengan sidik jari kimia yang berbeda, Milvus dapat melakukan pencarian substruktur, pencarian kemiripan, dan pencarian yang tepat.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">Pencarian substruktur</h3><p>Memeriksa apakah suatu struktur kimia mengandung struktur kimia lain.</p>
<h3 id="Similarity-search" class="common-anchor-header">Pencarian kemiripan</h3><p>Mencari struktur kimia yang serupa. Jarak Tanimoto digunakan sebagai metrik secara default.</p>
<h3 id="Exact-search" class="common-anchor-header">Pencarian tepat</h3><p>Memeriksa apakah struktur kimia yang ditentukan ada. Jenis pencarian ini membutuhkan kecocokan yang tepat.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">Menghitung sidik jari kimia<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Jarak Tanimoto sering digunakan sebagai metrik untuk sidik jari kimia. Dalam Milvus, jarak Jaccard sesuai dengan jarak Tanimoto.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-menghitung-sidik-jari-kimia-tabel-1.png</span> </span></p>
<p>Berdasarkan parameter sebelumnya, komputasi sidik jari kimia dapat digambarkan sebagai:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-computing-chem-fingerprings-table-2.png</span> </span></p>
<p>Kita dapat melihatnya di <code translate="no">1- Jaccard = Tanimoto</code>. Di sini kita menggunakan Jaccard di Milvus untuk menghitung sidik jari kimia, yang sebenarnya konsisten dengan jarak Tanimoto.</p>
<h2 id="System-demo" class="common-anchor-header">Demo sistem<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk lebih mendemonstrasikan bagaimana sistem ini bekerja, kami telah membuat sebuah demo yang menggunakan Milvus untuk mencari lebih dari 90 juta sidik jari kimia. Data yang digunakan berasal dari ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF. Antarmuka awal terlihat sebagai berikut:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-sistem-demo-1.jpg</span> </span></p>
<p>Kita dapat mencari struktur kimia tertentu dalam sistem dan mengembalikan struktur kimia yang serupa:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-system-demo-2.gif</span> </span></p>
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
    </button></h2><p>Pencarian kemiripan sangat diperlukan dalam sejumlah bidang, seperti gambar dan video. Untuk penemuan obat, pencarian kemiripan dapat diterapkan pada basis data struktur kimia untuk menemukan senyawa yang berpotensi tersedia, yang kemudian dikonversi menjadi benih untuk sintesis praktis dan pengujian di tempat. Milvus, sebagai mesin pencari kemiripan sumber terbuka untuk vektor fitur berskala masif, dibangun dengan arsitektur komputasi heterogen untuk efisiensi biaya terbaik. Pencarian vektor berskala miliaran hanya membutuhkan waktu milidetik dengan sumber daya komputasi minimum. Dengan demikian, Milvus dapat membantu mengimplementasikan pencarian struktur kimia yang akurat dan cepat di bidang-bidang seperti biologi dan kimia.</p>
<p>Anda dapat mengakses demo dengan mengunjungi http://40.117.75.127:8002/, dan jangan lupa untuk mengunjungi GitHub kami di https://github.com/milvus-io/milvus untuk mempelajari lebih lanjut!</p>
