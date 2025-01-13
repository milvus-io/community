---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: 'Elasticsearch Sudah Mati, Hidup Pencarian Leksikal'
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>Sekarang, semua orang tahu bahwa pencarian hibrida telah meningkatkan kualitas pencarian <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (Retrieval-Augmented Generation). Meskipun pencarian sematan <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">padat</a> telah menunjukkan kemampuan yang mengesankan dalam menangkap hubungan semantik yang mendalam antara kueri dan dokumen, namun masih memiliki keterbatasan. Ini termasuk kurangnya penjelasan dan kinerja yang kurang optimal dengan kueri berekor panjang dan istilah yang langka.</p>
<p>Banyak aplikasi RAG mengalami kesulitan karena model yang telah dilatih sebelumnya sering kali tidak memiliki pengetahuan spesifik domain. Dalam beberapa skenario, pencocokan kata kunci BM25 yang sederhana dapat mengungguli model-model yang canggih ini. Di sinilah pencarian hibrida menjembatani kesenjangan tersebut, dengan menggabungkan pemahaman semantik pengambilan vektor yang padat dengan ketepatan pencocokan kata kunci.</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">Mengapa Pencarian Hibrida Rumit dalam Produksi<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Meskipun kerangka kerja seperti <a href="https://zilliz.com/learn/LangChain">LangChain</a> atau <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a> memudahkan pembuatan retriever hibrida yang sudah terbukti dengan mudah, penskalaan ke produksi dengan set data yang sangat besar merupakan tantangan. Arsitektur tradisional memerlukan basis data vektor dan mesin pencari yang terpisah, yang mengarah ke beberapa tantangan utama:</p>
<ul>
<li><p>Biaya pemeliharaan infrastruktur yang tinggi dan kompleksitas operasional</p></li>
<li><p>Redundansi data di beberapa sistem</p></li>
<li><p>Manajemen konsistensi data yang sulit</p></li>
<li><p>Keamanan yang kompleks dan kontrol akses di seluruh sistem</p></li>
</ul>
<p>Pasar membutuhkan solusi terpadu yang mendukung pencarian leksikal dan semantik sekaligus mengurangi kompleksitas dan biaya sistem.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Poin-poin Penting dari Elasticsearch<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch telah menjadi salah satu proyek pencarian sumber terbuka paling berpengaruh dalam satu dekade terakhir. Dibangun di atas Apache Lucene, Elasticsearch mendapatkan popularitas melalui kinerja tinggi, skalabilitas, dan arsitektur terdistribusi. Meskipun telah menambahkan pencarian ANN vektor pada versi 8.0, penerapan produksi menghadapi beberapa tantangan kritis:</p>
<p><strong>Biaya Pembaruan dan Pengindeksan yang Tinggi:</strong> Arsitektur Elasticsearch tidak sepenuhnya memisahkan operasi penulisan, pembuatan indeks, dan kueri. Hal ini menyebabkan overhead CPU dan I/O yang signifikan selama operasi penulisan, terutama dalam pembaruan massal. Perebutan sumber daya antara pengindeksan dan kueri berdampak pada kinerja, menciptakan hambatan besar untuk skenario pembaruan frekuensi tinggi.</p>
<p><strong>Kinerja Waktu Nyata yang Buruk:</strong> Sebagai mesin pencari "hampir real-time", Elasticsearch memperkenalkan latensi yang nyata dalam visibilitas data. Latensi ini menjadi sangat bermasalah untuk aplikasi AI, seperti sistem Agen, di mana interaksi frekuensi tinggi dan pengambilan keputusan yang dinamis membutuhkan akses data segera.</p>
<p><strong>Manajemen Pecahan yang Sulit:</strong> Meskipun Elasticsearch menggunakan sharding untuk arsitektur terdistribusi, manajemen shard menimbulkan tantangan yang signifikan. Kurangnya dukungan sharding dinamis menciptakan dilema: terlalu banyak shard dalam dataset kecil menyebabkan kinerja yang buruk, sementara terlalu sedikit shard dalam dataset besar membatasi skalabilitas dan menyebabkan distribusi data yang tidak merata.</p>
<p><strong>Arsitektur Non-Cloud-Native:</strong> Dikembangkan sebelum arsitektur cloud-native menjadi lazim, desain Elasticsearch menggabungkan penyimpanan dan komputasi secara ketat, sehingga membatasi integrasinya dengan infrastruktur modern seperti cloud publik dan Kubernetes. Penskalaan sumber daya membutuhkan peningkatan penyimpanan dan komputasi secara simultan, sehingga mengurangi fleksibilitas. Dalam skenario multi-replika, setiap pecahan harus membangun indeksnya secara independen, meningkatkan biaya komputasi dan mengurangi efisiensi sumber daya.</p>
<p><strong>Performa Pencarian Vektor yang Buruk:</strong> Meskipun Elasticsearch 8.0 memperkenalkan pencarian ANN vektor, kinerjanya secara signifikan tertinggal di belakang mesin vektor khusus seperti Milvus. Berdasarkan kernel Lucene, struktur indeksnya terbukti tidak efisien untuk data berdimensi tinggi, berjuang dengan persyaratan pencarian vektor skala besar. Performanya menjadi sangat tidak stabil dalam skenario kompleks yang melibatkan pemfilteran skalar dan multi-tenancy, sehingga sulit untuk mendukung kebutuhan bisnis yang tinggi atau beragam.</p>
<p><strong>Konsumsi Sumber Daya yang Berlebihan:</strong> Elasticsearch menempatkan tuntutan yang ekstrem pada memori dan CPU, terutama saat memproses data berskala besar. Ketergantungannya pada JVM memerlukan penyesuaian ukuran heap dan penyetelan pengumpulan sampah yang sering dilakukan, yang sangat berdampak pada efisiensi memori. Operasi pencarian vektor memerlukan komputasi yang dioptimalkan untuk SIMD yang intensif, yang mana lingkungan JVM jauh dari ideal.</p>
<p>Keterbatasan mendasar ini menjadi semakin bermasalah ketika organisasi meningkatkan skala infrastruktur AI mereka, membuat Elasticsearch sangat menantang untuk aplikasi AI modern yang membutuhkan kinerja dan keandalan tinggi.</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Memperkenalkan Sparse-BM25: Menata Ulang Pencarian Leksikal<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> memperkenalkan dukungan pencarian leksikal asli melalui Sparse-BM25, yang dibangun di atas kemampuan pencarian hibrida yang diperkenalkan pada versi 2.4. Pendekatan inovatif ini mencakup komponen-komponen utama berikut ini:</p>
<ul>
<li><p>Tokenisasi dan prapemrosesan tingkat lanjut melalui Tantivy</p></li>
<li><p>Kosakata terdistribusi dan manajemen frekuensi istilah</p></li>
<li><p>Pembangkitan vektor yang jarang menggunakan TF korpus dan kueri TF-IDF</p></li>
<li><p>Dukungan indeks terbalik dengan algoritme WAND (Block-Max WAND dan dukungan indeks grafik sedang dikembangkan)</p></li>
</ul>
<p>Dibandingkan dengan Elasticsearch, Milvus menawarkan keunggulan yang signifikan dalam fleksibilitas algoritme. Komputasi kemiripan berbasis jarak vektor memungkinkan pencocokan yang lebih canggih, termasuk mengimplementasikan TW-BERT (Term Weighting BERT) berdasarkan penelitian "End-to-End Query Term Weighting". Pendekatan ini telah menunjukkan kinerja yang unggul dalam pengujian in-domain dan out-domain.</p>
<p>Keuntungan penting lainnya adalah efisiensi biaya. Dengan memanfaatkan indeks terbalik dan kompresi embedding padat, Milvus mencapai peningkatan kinerja lima kali lipat dengan degradasi recall kurang dari 1%. Melalui pemangkasan tail-term dan kuantisasi vektor, penggunaan memori telah berkurang lebih dari 50%.</p>
<p>Optimalisasi kueri yang panjang menonjol sebagai kekuatan khusus. Ketika algoritme WAND tradisional kesulitan dengan kueri yang lebih panjang, Milvus unggul dengan menggabungkan penyematan yang jarang dengan indeks grafik, memberikan peningkatan kinerja sepuluh kali lipat dalam skenario pencarian vektor yang jarang berdimensi tinggi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus: Basis Data Vektor Terbaik untuk RAG<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus adalah pilihan utama untuk aplikasi RAG melalui serangkaian fiturnya yang komprehensif. Keunggulan utamanya meliputi:</p>
<ul>
<li><p>Dukungan metadata yang kaya dengan kemampuan skema dinamis dan opsi pemfilteran yang kuat</p></li>
<li><p>Multi-tenancy tingkat perusahaan dengan isolasi fleksibel melalui koleksi, partisi, dan kunci partisi</p></li>
<li><p>Dukungan indeks vektor disk pertama di industri dengan penyimpanan bertingkat dari memori ke S3</p></li>
<li><p>Skalabilitas cloud-native yang mendukung penskalaan tanpa batas dari 10M hingga 1B+ vektor</p></li>
<li><p>Kemampuan pencarian yang komprehensif, termasuk pengelompokan, rentang, dan pencarian hybrid</p></li>
<li><p>Integrasi ekosistem yang mendalam dengan LangChain, LlamaIndex, Dify, dan alat AI lainnya</p></li>
</ul>
<p>Kemampuan pencarian sistem yang beragam mencakup metodologi pengelompokan, rentang, dan pencarian hibrida. Integrasi yang mendalam dengan alat-alat seperti LangChain, LlamaIndex, dan Dify, serta dukungan untuk berbagai produk AI, menempatkan Milvus di pusat ekosistem infrastruktur AI modern.</p>
<h2 id="Looking-Forward" class="common-anchor-header">Melihat ke Depan<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Seiring dengan transisi AI dari POC ke produksi, Milvus terus berevolusi. Kami fokus untuk membuat pencarian vektor lebih mudah diakses dan hemat biaya sekaligus meningkatkan kualitas pencarian. Baik Anda adalah startup atau perusahaan, Milvus mengurangi hambatan teknis untuk pengembangan aplikasi AI.</p>
<p>Komitmen terhadap aksesibilitas dan inovasi ini telah membawa kami ke langkah besar lainnya. Meskipun solusi open-source kami terus menjadi fondasi bagi ribuan aplikasi di seluruh dunia, kami menyadari bahwa banyak organisasi membutuhkan solusi yang dikelola secara penuh yang menghilangkan biaya operasional.</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud: Solusi Terkelola<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami telah membangun <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, layanan basis data vektor terkelola penuh berdasarkan Milvus, selama tiga tahun terakhir. Melalui implementasi ulang protokol Milvus yang asli cloud, layanan ini menawarkan peningkatan kegunaan, efisiensi biaya, dan keamanan.</p>
<p>Berdasarkan pengalaman kami dalam mengelola cluster pencarian vektor terbesar di dunia dan mendukung ribuan pengembang aplikasi AI, Zilliz Cloud secara signifikan mengurangi biaya operasional dan biaya dibandingkan dengan solusi yang dihosting sendiri.</p>
<p>Siap merasakan masa depan pencarian vektor? Mulai uji coba gratis Anda hari ini dengan kredit hingga $200, tidak perlu kartu kredit.</p>
