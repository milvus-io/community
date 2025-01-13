---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Apa yang baru di Milvus 2.1 - Menuju kesederhanaan dan kecepatan
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  Milvus, basis data vektor sumber terbuka, kini memiliki peningkatan performa
  dan kegunaan yang telah lama dinanti-nantikan oleh para pengguna.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Apa yang baru di Milvus 2.1 - Menuju kesederhanaan dan kecepatan</span> </span></p>
<p>Kami sangat senang mengumumkan bahwa<a href="https://milvus.io/docs/v2.1.x/release_notes.md">rilis</a> Milvus 2.1 telah tersedia setelah enam bulan kerja keras dari semua kontributor komunitas Milvus. Iterasi utama dari database vektor yang populer ini menekankan pada <strong>performa</strong> dan <strong>kegunaan</strong>, dua kata kunci terpenting dari fokus kami. Kami menambahkan dukungan untuk string, antrean pesan Kafka, dan Milvus yang disematkan, serta sejumlah peningkatan dalam hal kinerja, skalabilitas, keamanan, dan observabilitas. Milvus 2.1 adalah pembaruan menarik yang akan menjembatani "mil terakhir" dari laptop insinyur algoritma ke layanan pencarian kemiripan vektor tingkat produksi.</p>
<custom-h1>Performa - Peningkatan lebih dari 3,2x lipat</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">Latensi tingkat 5ms<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus sudah mendukung pencarian perkiraan tetangga terdekat (ANN), sebuah lompatan besar dari metode KNN tradisional. Namun, masalah throughput dan latensi terus menjadi tantangan bagi pengguna yang harus berurusan dengan skenario pencarian data vektor berskala miliaran.</p>
<p>Dalam Milvus 2.1, ada protokol perutean baru yang tidak lagi bergantung pada antrean pesan di tautan pengambilan, yang secara signifikan mengurangi latensi pengambilan untuk set data kecil. Hasil pengujian kami menunjukkan bahwa Milvus sekarang menurunkan tingkat latensi hingga 5ms, yang memenuhi persyaratan tautan online yang penting seperti pencarian kemiripan dan rekomendasi.</p>
<h2 id="Concurrency-control" class="common-anchor-header">Kontrol konkurensi<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 menyempurnakan model konkurensinya dengan memperkenalkan model evaluasi biaya dan penjadwal konkurensi yang baru. Sekarang ini menyediakan kontrol konkurensi, yang memastikan bahwa tidak akan ada banyak permintaan bersamaan yang bersaing untuk mendapatkan sumber daya CPU dan cache, dan juga tidak akan ada CPU yang kurang dimanfaatkan karena tidak ada cukup permintaan. Lapisan penjadwal cerdas yang baru di Milvus 2.1 juga menggabungkan kueri small-nq yang memiliki parameter permintaan yang konsisten, sehingga menghasilkan peningkatan kinerja 3,2x lipat dalam skenario dengan small-nq dan konkurensi kueri yang tinggi.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">Replika dalam memori<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 menghadirkan replika in-memory yang meningkatkan skalabilitas dan ketersediaan untuk dataset kecil. Mirip dengan replika hanya-baca di database tradisional, replika dalam memori dapat diskalakan secara horizontal dengan menambahkan mesin ketika QPS baca tinggi. Dalam pengambilan vektor untuk dataset kecil, sistem rekomendasi sering kali perlu menyediakan QPS yang melebihi batas kinerja satu mesin. Sekarang dalam skenario ini, throughput sistem dapat ditingkatkan secara signifikan dengan memuat beberapa replika dalam memori. Di masa mendatang, kami juga akan memperkenalkan mekanisme pembacaan lindung nilai berdasarkan replika dalam memori, yang akan dengan cepat meminta salinan fungsional lainnya jika sistem perlu pulih dari kegagalan dan memanfaatkan sepenuhnya redundansi memori untuk meningkatkan ketersediaan sistem secara keseluruhan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>Replika dalam memori memungkinkan layanan kueri didasarkan pada salinan terpisah dari data yang sama.</span> </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">Pemuatan data yang lebih cepat<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Peningkatan kinerja terakhir berasal dari pemuatan data. Milvus 2.1 sekarang mengompres <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">log biner</a> dengan Zstandard (zstd), yang secara signifikan mengurangi ukuran data dalam penyimpanan objek dan pesan serta overhead jaringan selama pemuatan data. Selain itu, goroutine pools kini diperkenalkan sehingga Milvus dapat memuat segmen secara bersamaan dengan jejak memori yang terkendali dan meminimalkan waktu yang dibutuhkan untuk pulih dari kegagalan dan memuat data.</p>
<p>Hasil benchmark lengkap dari Milvus 2.1 akan segera dirilis di situs web kami. Nantikan terus.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">Dukungan indeks string dan skalar<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan versi 2.1, Milvus sekarang mendukung string panjang variabel (VARCHAR) sebagai tipe data skalar. VARCHAR dapat digunakan sebagai kunci utama yang dapat dikembalikan sebagai output, dan juga dapat bertindak sebagai filter atribut. <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">Pemfilteran atribut</a> adalah salah satu fungsi paling populer yang dibutuhkan oleh pengguna Milvus. Jika Anda sering menemukan diri Anda ingin &quot;menemukan produk yang paling mirip dengan pengguna dalam kisaran harga <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>&quot;, atau &quot;menemukan artikel yang memiliki kata kunci 'database vektor' dan terkait dengan topik cloud-native&quot;, Anda akan menyukai Milvus 2.1.</p>
<p>Milvus 2.1 juga mendukung indeks terbalik skalar untuk meningkatkan kecepatan penyaringan berdasarkan<a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a> yang<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">ringkas</a>sebagai struktur data. Semua data sekarang dapat dimuat ke dalam memori dengan jejak yang sangat rendah, yang memungkinkan perbandingan, penyaringan, dan pencocokan awalan pada string dengan lebih cepat. Hasil pengujian kami menunjukkan bahwa kebutuhan memori MARISA-tries hanya 10% dari kebutuhan memori kamus Python untuk memuat semua data ke dalam memori dan menyediakan kemampuan query.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 menggabungkan MARISA-Trie dengan indeks terbalik untuk meningkatkan kecepatan penyaringan secara signifikan</span> </span>.</p>
<p>Di masa depan, Milvus akan terus berfokus pada pengembangan yang berhubungan dengan kueri skalar, mendukung lebih banyak jenis indeks skalar dan operator kueri, dan menyediakan kemampuan kueri skalar berbasis disk, semuanya sebagai bagian dari upaya berkelanjutan untuk mengurangi biaya penyimpanan dan penggunaan data skalar.</p>
<custom-h1>Peningkatan kegunaan</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Dukungan Kafka<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Komunitas kami telah lama meminta dukungan untuk <a href="https://kafka.apache.org">Apache Kafka</a> sebagai <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">penyimpanan pesan</a> di Milvus. Milvus 2.1 sekarang menawarkan pilihan untuk menggunakan<a href="https://pulsar.apache.org">Pulsar</a> atau Kafka sebagai penyimpanan pesan berdasarkan konfigurasi pengguna, berkat desain abstraksi dan enkapsulasi Milvus dan Go Kafka SDK yang dikontribusikan oleh Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">SDK Java yang siap produksi<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan Milvus 2.1, <a href="https://github.com/milvus-io/milvus-sdk-java">Java SDK</a> kami sekarang telah resmi dirilis. Java SDK memiliki kemampuan yang sama persis dengan Python SDK, dengan kinerja konkurensi yang lebih baik. Pada langkah selanjutnya, kontributor komunitas kami akan secara bertahap meningkatkan dokumentasi dan kasus penggunaan untuk Java SDK, dan membantu mendorong Go dan RESTful SDK ke tahap siap produksi.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">Observabilitas dan pemeliharaan<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 menambahkan<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">metrik</a> pemantauan penting seperti jumlah penyisipan vektor, latensi/throughput pencarian, overhead memori node, dan overhead CPU. Selain itu, versi baru ini juga secara signifikan mengoptimalkan penyimpanan log dengan menyesuaikan level log dan mengurangi pencetakan log yang tidak berguna.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">Milvus Tertanam<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus telah sangat menyederhanakan penyebaran layanan pengambilan data vektor besar berskala besar, tetapi bagi para ilmuwan yang ingin memvalidasi algoritme dalam skala yang lebih kecil, Docker atau K8 masih terlalu rumit. Dengan diperkenalkannya <a href="https://github.com/milvus-io/embd-milvus">Milvus</a> tertanam, Anda sekarang dapat menginstal Milvus menggunakan pip, seperti halnya Pyrocksb dan Pysqlite. Embedded Milvus mendukung semua fungsi dari versi cluster dan versi mandiri, sehingga Anda dapat dengan mudah beralih dari laptop ke lingkungan produksi terdistribusi tanpa mengubah satu baris kode pun. Para insinyur algoritme akan mendapatkan pengalaman yang jauh lebih baik ketika membangun prototipe dengan Milvus.</p>
<custom-h1>Coba pencarian vektor yang belum pernah ada sebelumnya sekarang</custom-h1><p>Selain itu, Milvus 2.1 juga memiliki beberapa peningkatan besar dalam hal stabilitas dan skalabilitas, dan kami menantikan penggunaan dan umpan balik Anda.</p>
<h2 id="Whats-next" class="common-anchor-header">Apa yang berikutnya<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>Lihat <a href="https://milvus.io/docs/v2.1.x/release_notes.md">Catatan Rilis</a> terperinci untuk mengetahui semua perubahan di Milvus 2.1</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">Instal</a>Milvus 2.1 dan cobalah fitur-fitur barunya</li>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Slack</a> kami dan diskusikan fitur-fitur baru dengan ribuan pengguna Milvus di seluruh dunia</li>
<li>Ikuti kami di <a href="https://twitter.com/milvusio">Twitter</a> dan<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> untuk mendapatkan informasi terbaru ketika blog kami mengenai fitur-fitur baru yang spesifik telah dirilis</li>
</ul>
<blockquote>
<p>Diedit oleh <a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
