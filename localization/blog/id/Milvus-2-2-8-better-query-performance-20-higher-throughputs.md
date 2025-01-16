---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: 'Milvus 2.2.8: Performa Kueri yang Lebih Baik, Throughput 20% Lebih Tinggi'
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>Milvus 2.2.8</span> </span></p>
<p>Kami dengan senang hati mengumumkan rilis terbaru Milvus 2.2.8. Rilis ini mencakup banyak peningkatan dan perbaikan bug dari versi sebelumnya, yang menghasilkan kinerja query yang lebih baik, penghematan sumber daya, dan hasil yang lebih tinggi. Mari kita lihat apa saja yang baru dalam rilis ini.</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">Mengurangi konsumsi memori puncak selama pemuatan koleksi<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk melakukan kueri, Milvus perlu memuat data dan indeks ke dalam memori. Namun, selama proses pemuatan, beberapa salinan memori dapat menyebabkan penggunaan memori puncak meningkat hingga tiga hingga empat kali lebih tinggi daripada saat runtime yang sebenarnya. Versi terbaru Milvus 2.2.8 secara efektif mengatasi masalah ini dan mengoptimalkan penggunaan memori.</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">Skenario kueri yang diperluas dengan plugin yang mendukung QueryNode<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>QueryNode sekarang mendukung plugin di Milvus 2.2.8 terbaru. Anda dapat dengan mudah menentukan jalur file plugin dengan konfigurasi <code translate="no">queryNode.soPath</code>. Kemudian, Milvus dapat memuat plugin pada saat runtime dan memperluas skenario kueri yang tersedia. Lihat <a href="https://pkg.go.dev/plugin">dokumentasi plugin Go</a>, jika Anda memerlukan panduan untuk mengembangkan plugin.</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">Performa kueri yang dioptimalkan dengan algoritme pemadatan yang disempurnakan<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Algoritme pemadatan menentukan kecepatan penggabungan segmen, yang secara langsung memengaruhi kinerja kueri. Dengan peningkatan terbaru pada algoritme pemadatan, efisiensi konvergensi telah meningkat secara dramatis, menghasilkan kueri yang lebih cepat.</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">Penghematan sumber daya dan kinerja kueri yang lebih baik dengan pecahan koleksi yang lebih sedikit<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus adalah sistem pemrosesan paralel masif (MPP), yang berarti bahwa jumlah pecahan koleksi berdampak pada efisiensi Milvus dalam penulisan dan kueri. Pada versi yang lebih lama, sebuah koleksi memiliki dua pecahan secara default, yang menghasilkan kinerja penulisan yang sangat baik tetapi mengorbankan kinerja penginputan dan biaya sumber daya. Dengan pembaruan Milvus 2.2.8 yang baru, pecahan koleksi default telah dikurangi menjadi satu, sehingga pengguna dapat menghemat lebih banyak sumber daya dan melakukan kueri yang lebih baik. Sebagian besar pengguna dalam komunitas memiliki kurang dari 10 juta volume data, dan satu pecahan sudah cukup untuk mencapai kinerja penulisan yang baik.</p>
<p><strong>Catatan</strong>: Peningkatan ini tidak memengaruhi koleksi yang dibuat sebelum rilis ini.</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">Peningkatan throughput sebesar 20% dengan algoritma pengelompokan kueri yang lebih baik<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus memiliki algoritma pengelompokan kueri yang efisien yang menggabungkan beberapa permintaan kueri dalam antrean menjadi satu untuk eksekusi yang lebih cepat, sehingga secara signifikan meningkatkan throughput. Dalam rilis terbaru, kami membuat peningkatan tambahan pada algoritma ini, meningkatkan throughput Milvus setidaknya 20%.</p>
<p>Selain peningkatan yang disebutkan di atas, Milvus 2.2.8 juga memperbaiki berbagai bug. Untuk lebih jelasnya, lihat <a href="https://milvus.io/docs/release_notes.md">Catatan Rilis Milvus</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Mari tetap berkomunikasi!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda memiliki pertanyaan atau masukan mengenai Milvus, jangan ragu untuk menghubungi kami melalui <a href="https://twitter.com/milvusio">Twitter</a> atau <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Anda juga dapat bergabung dengan <a href="https://milvus.io/slack/">saluran Slack</a> untuk mengobrol dengan teknisi kami dan seluruh komunitas secara langsung atau lihat <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">jam kerja</a> kami di hari <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Selasa</a>!</p>
