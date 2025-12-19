---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: >-
  Berhenti Membayar untuk Data Dingin: Pengurangan Biaya 80% dengan Pemuatan
  Data Panas-Dingin Sesuai Permintaan di Penyimpanan Berjenjang Milvus
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  Pelajari bagaimana Penyimpanan Berjenjang di Milvus memungkinkan pemuatan
  sesuai permintaan untuk data panas dan dingin, memberikan pengurangan biaya
  hingga 80% dan waktu pemuatan yang lebih cepat dalam skala besar.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>Berapa banyak dari Anda yang masih membayar tagihan infrastruktur premium untuk data yang hampir tidak pernah disentuh oleh sistem Anda? Jujur saja - sebagian besar tim masih melakukannya.</strong></p>
<p>Jika Anda menjalankan pencarian vektor dalam produksi, Anda mungkin pernah melihat hal ini secara langsung. Anda menyediakan memori dan SSD dalam jumlah besar agar semuanya tetap "siap untuk kueri," meskipun hanya sebagian kecil dari kumpulan data Anda yang benar-benar aktif. Dan Anda tidak sendirian. Kami telah melihat banyak kasus serupa juga:</p>
<ul>
<li><p><strong>Platform SaaS multi-penyewa:</strong> Ratusan penyewa yang bergabung, tetapi hanya 10-15% yang aktif pada hari tertentu. Sisanya hanya diam saja tetapi masih menghabiskan sumber daya.</p></li>
<li><p><strong>Sistem rekomendasi e-commerce:</strong> Sejuta SKU, namun 8% produk teratas menghasilkan sebagian besar rekomendasi dan lalu lintas pencarian.</p></li>
<li><p><strong>Pencarian AI:</strong> Arsip penyematan yang sangat banyak, meskipun 90% dari kueri pengguna mengenai item dari minggu lalu.</p></li>
</ul>
<p>Ini adalah cerita yang sama di seluruh industri: <strong>kurang dari 10% data Anda sering ditanyakan, tetapi sering kali menghabiskan 80% penyimpanan dan memori Anda.</strong> Semua orang tahu bahwa ketidakseimbangan itu ada - tetapi sampai saat ini, belum ada cara arsitektural yang jelas untuk memperbaikinya.</p>
<p><strong>Hal itu berubah dengan</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>.</strong></p>
<p>Sebelum rilis ini, Milvus (seperti kebanyakan basis data vektor) bergantung pada <strong>model muatan penuh</strong>: jika data perlu dicari, data tersebut harus dimuat ke simpul-simpul lokal. Tidak masalah apakah data itu diakses seribu kali dalam satu menit atau seperempat menit sekali - <strong>semuanya harus tetap panas.</strong> Pilihan desain tersebut memastikan kinerja yang dapat diprediksi, tetapi juga berarti cluster yang terlalu besar dan membayar sumber daya yang tidak layak untuk data dingin.</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">Penyimpanan Berjenjang</a> <strong>adalah jawaban kami</strong>.</p>
<p>Milvus 2.6 memperkenalkan arsitektur penyimpanan berjenjang baru dengan <strong>pemuatan sesuai permintaan yang sebenarnya</strong>, sehingga sistem dapat membedakan antara data panas dan data dingin secara otomatis:</p>
<ul>
<li><p>Segmen panas tetap tersimpan di dalam cache dekat dengan komputasi</p></li>
<li><p>Segmen dingin disimpan dengan murah di penyimpanan objek jarak jauh</p></li>
<li><p>Data ditarik ke node lokal <strong>hanya ketika kueri benar-benar membutuhkannya</strong></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hal ini mengubah struktur biaya Anda dari "berapa banyak data yang Anda miliki" menjadi <strong>"berapa banyak data yang benar-benar Anda gunakan."</strong> Dan dalam penerapan produksi awal, pergeseran sederhana ini menghasilkan <strong>pengurangan biaya penyimpanan dan memori hingga 80%.</strong></p>
<p>Di bagian selanjutnya dari artikel ini, kami akan menjelaskan cara kerja Tiered Storage, membagikan hasil kinerja nyata, dan menunjukkan di mana perubahan ini memberikan dampak terbesar.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">Mengapa Pemuatan Penuh Rusak pada Skala Besar<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum masuk ke dalam solusi, ada baiknya kita melihat lebih dekat mengapa <strong>mode beban penuh</strong> yang digunakan di Milvus 2.5 dan rilis sebelumnya menjadi faktor pembatas saat beban kerja meningkat.</p>
<p>Pada Milvus 2.5 dan sebelumnya, ketika pengguna mengeluarkan permintaan <code translate="no">Collection.load()</code>, setiap QueryNode men-cache seluruh koleksi secara lokal, termasuk metadata, data lapangan, dan indeks. Komponen-komponen ini diunduh dari penyimpanan objek dan disimpan sepenuhnya dalam memori atau dipetakan dalam memori (mmap) ke disk lokal. Hanya setelah <em>semua</em> data ini tersedia secara lokal, koleksi ditandai sebagai dimuat dan siap untuk melayani kueri.</p>
<p>Dengan kata lain, koleksi tidak dapat di-query hingga seluruh dataset-panas atau dingin-tersedia di dalam node.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Catatan:</strong> Untuk jenis indeks yang menyematkan data vektor mentah, Milvus hanya memuat file indeks, bukan bidang vektor secara terpisah. Meskipun demikian, indeks harus dimuat secara penuh untuk melayani kueri, terlepas dari berapa banyak data yang sebenarnya diakses.</p>
<p>Untuk melihat mengapa hal ini menjadi masalah, pertimbangkan sebuah contoh konkret:</p>
<p>Misalkan Anda memiliki kumpulan data vektor berukuran sedang dengan:</p>
<ul>
<li><p><strong>100 juta vektor</strong></p></li>
<li><p><strong>768 dimensi</strong> (penyematan BERT)</p></li>
<li><p>presisi<strong>float32</strong> (4 byte per dimensi)</p></li>
<li><p><strong>Indeks HNSW</strong></p></li>
</ul>
<p>Dalam pengaturan ini, indeks HNSW saja-termasuk vektor mentah yang disematkan-menghabiskan sekitar 430 GB memori. Setelah menambahkan bidang skalar umum seperti ID pengguna, stempel waktu, atau label kategori, total penggunaan sumber daya lokal dengan mudah melebihi 500 GB.</p>
<p>Ini berarti bahwa meskipun 80% data jarang atau tidak pernah ditanyakan, sistem masih harus menyediakan dan menyimpan lebih dari 500 GB memori lokal atau disk hanya untuk menjaga koleksi tetap online.</p>
<p>Untuk beberapa beban kerja, perilaku ini dapat diterima:</p>
<ul>
<li><p>Jika hampir semua data sering diakses, memuat semuanya secara penuh akan menghasilkan latensi kueri serendah mungkin - dengan biaya tertinggi.</p></li>
<li><p>Jika data dapat dibagi menjadi subset panas dan hangat, pemetaan memori data hangat ke disk dapat mengurangi sebagian tekanan memori.</p></li>
</ul>
<p>Namun, dalam beban kerja di mana 80% atau lebih data berada di bagian ekor panjang, kelemahan pemuatan penuh muncul dengan cepat, baik dalam hal <strong>kinerja</strong> maupun <strong>biaya</strong>.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">Kemacetan kinerja</h3><p>Dalam praktiknya, pemuatan penuh memengaruhi lebih dari sekadar kinerja kueri dan sering kali memperlambat alur kerja operasional rutin:</p>
<ul>
<li><p><strong>Peningkatan bergulir yang lebih lama:</strong> Dalam cluster besar, peningkatan bergulir dapat memakan waktu berjam-jam atau bahkan sehari penuh, karena setiap node harus memuat ulang seluruh dataset sebelum tersedia kembali.</p></li>
<li><p><strong>Pemulihan yang lebih lambat setelah kegagalan:</strong> Ketika QueryNode dimulai ulang, QueryNode tidak dapat melayani lalu lintas hingga semua data dimuat ulang, yang secara signifikan memperpanjang waktu pemulihan dan memperbesar dampak kegagalan node.</p></li>
<li><p><strong>Iterasi dan eksperimen yang lebih lambat:</strong> Pemuatan penuh memperlambat alur kerja pengembangan, memaksa tim AI menunggu berjam-jam hingga data dimuat saat menguji set data atau konfigurasi indeks baru.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">Inefisiensi biaya</h3><p>Pemuatan penuh juga meningkatkan biaya infrastruktur. Misalnya, pada instance yang dioptimalkan untuk memori cloud utama, menyimpan 1 TB data secara lokal membutuhkan biaya sekitar<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mn>.000 per</mn><mo>tahun∗∗</mo><mo separator="true">,</mo></mrow><annotation encoding="application/x-tex">berdasarkan harga kons</annotation><mrow><mi>ervatif</mi></mrow><annotation encoding="application/x-tex">(</annotation><mrow><mi>AWSr6i</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70.000 per tahun**, berdasarkan harga konservatif (AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.02778em;">000</span><span class="mord">per tahun</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span> ∗</span></span></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">berdasarkan harga</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal" style="margin-right:0.03588em;">konservatif</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex"></annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">:</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74 / GB/bulan; GCP n4-highmem: ~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>.</mn><mi>68/GB/bulan</mi><mo separator="true">;</mo><mi>AzureE-series</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext> 5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.68/GB/bulan; Azure E-series: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">68/GB/bulan</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">seri</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.67 / GB/bulan).</span></span></span></p>
<p>Sekarang pertimbangkan pola akses yang lebih realistis, di mana 80% dari data tersebut adalah data dingin dan dapat disimpan di penyimpanan objek sebagai gantinya (dengan biaya sekitar $ 0,023 / GB / bulan):</p>
<ul>
<li><p>200 GB data panas × $5,68</p></li>
<li><p>800 GB data dingin × $0,023</p></li>
</ul>
<p>Biaya tahunan: (200 × 5,68 + 800 × 0,023) × 12≈ $14<strong>.000</strong></p>
<p>Itu adalah <strong>pengurangan 80%</strong> dalam total biaya penyimpanan, tanpa mengorbankan performa yang sebenarnya penting.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">Apa Itu Penyimpanan Berjenjang dan Bagaimana Cara Kerjanya?<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk menghilangkan trade-off, Milvus 2.6 memperkenalkan <strong>Penyimpanan Berjenjang</strong>, yang menyeimbangkan performa dan biaya dengan memperlakukan penyimpanan lokal sebagai cache, bukan sebagai wadah untuk seluruh dataset.</p>
<p>Dalam model ini, QueryNodes hanya memuat metadata ringan saat startup. Data lapangan dan indeks diambil sesuai permintaan dari penyimpanan objek jarak jauh ketika kueri membutuhkannya, dan di-cache secara lokal jika sering diakses. Data yang tidak aktif dapat digusur untuk mengosongkan ruang.</p>
<p>Hasilnya, data panas tetap berada di dekat lapisan komputasi untuk kueri latensi rendah, sementara data dingin tetap berada di penyimpanan objek hingga dibutuhkan. Hal ini mengurangi waktu muat, meningkatkan efisiensi sumber daya, dan memungkinkan QueryNodes untuk melakukan kueri terhadap set data yang jauh lebih besar daripada memori lokal atau kapasitas disk.</p>
<p>Dalam praktiknya, Penyimpanan Berjenjang bekerja sebagai berikut:</p>
<ul>
<li><p><strong>Menyimpan data yang penting secara lokal:</strong> Sekitar 20% data yang sering diakses tetap berada di node lokal, memastikan latensi rendah untuk 80% kueri yang paling penting.</p></li>
<li><p><strong>Memuat data dingin sesuai permintaan:</strong> Sisa 80% data yang jarang diakses diambil hanya jika diperlukan, sehingga membebaskan sebagian besar memori lokal dan sumber daya disk.</p></li>
<li><p><strong>Beradaptasi secara dinamis dengan penggusuran berbasis LRU:</strong> Milvus menggunakan strategi penggusuran LRU (Least Recently Used) untuk terus menyesuaikan data mana yang dianggap panas atau dingin. Data yang tidak aktif secara otomatis digusur untuk memberi ruang bagi data yang baru diakses.</p></li>
</ul>
<p>Dengan desain ini, Milvus tidak lagi dibatasi oleh kapasitas tetap dari memori lokal dan disk. Sebaliknya, sumber daya lokal berfungsi sebagai cache yang dikelola secara dinamis, di mana ruang terus menerus diambil kembali dari data yang tidak aktif dan dialokasikan kembali ke beban kerja yang aktif.</p>
<p>Di balik tenda, perilaku ini diaktifkan oleh tiga mekanisme teknis inti:</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. Beban Malas</h3><p>Pada inisialisasi, Milvus hanya memuat metadata tingkat segmen yang minimal, sehingga koleksi dapat langsung di-query segera setelah dijalankan. Data lapangan dan file indeks tetap berada di penyimpanan jarak jauh dan diambil sesuai permintaan selama eksekusi kueri, sehingga menjaga memori lokal dan penggunaan disk tetap rendah.</p>
<p><strong>Bagaimana pemuatan koleksi bekerja di Milvus 2.5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cara kerja pemuatan malas di Milvus 2.6 dan yang lebih baru</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Metadata yang dimuat selama inisialisasi terbagi dalam empat kategori utama:</p>
<ul>
<li><p><strong>Statistik segmen</strong> (Informasi dasar seperti jumlah baris, ukuran segmen, dan metadata skema)</p></li>
<li><p><strong>Stempel waktu</strong> (Digunakan untuk mendukung kueri penelusuran waktu)</p></li>
<li><p><strong>Menyisipkan dan menghapus catatan</strong> (Diperlukan untuk menjaga konsistensi data selama eksekusi kueri)</p></li>
<li><p><strong>Filter Bloom</strong> (Digunakan untuk pemfilteran awal yang cepat untuk menghilangkan segmen yang tidak relevan dengan cepat)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. Pemuatan Sebagian</h3><p>Sementara Lazy loading mengontrol <em>kapan</em> data dimuat, partial loading mengontrol <em>berapa banyak</em> data yang dimuat. Setelah kueri atau pencarian dimulai, QueryNode melakukan pemuatan parsial, hanya mengambil potongan data yang diperlukan atau file indeks dari penyimpanan objek.</p>
<p><strong>Indeks vektor: Pemuatan yang sadar penyewa</strong></p>
<p>Salah satu kemampuan yang paling berdampak yang diperkenalkan di Milvus 2.6+ adalah pemuatan indeks vektor yang sadar-penyewa, yang dirancang khusus untuk beban kerja multi-penyewa.</p>
<p>Ketika sebuah kueri mengakses data dari satu penyewa, Milvus hanya memuat bagian dari indeks vektor milik penyewa tersebut, dan melewatkan data indeks untuk semua penyewa lainnya. Hal ini membuat sumber daya lokal tetap terfokus pada penyewa yang aktif.</p>
<p>Desain ini memberikan beberapa manfaat:</p>
<ul>
<li><p>Indeks vektor untuk penyewa yang tidak aktif tidak menggunakan memori lokal atau disk</p></li>
<li><p>Data indeks untuk penyewa aktif tetap tersimpan di cache untuk akses latensi rendah</p></li>
<li><p>Kebijakan penggusuran LRU tingkat penyewa memastikan penggunaan cache yang adil di seluruh penyewa</p></li>
</ul>
<p><strong>Bidang skalar: Pemuatan parsial tingkat kolom</strong></p>
<p>Pemuatan parsial juga berlaku untuk <strong>bidang skalar</strong>, yang memungkinkan Milvus memuat hanya kolom yang secara eksplisit direferensikan oleh kueri.</p>
<p>Pertimbangkan sebuah koleksi dengan <strong>50 kolom skema</strong>, seperti <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">title</code>, <code translate="no">description</code>, <code translate="no">category</code>, <code translate="no">price</code>, <code translate="no">stock</code>, dan <code translate="no">tags</code>, dan Anda hanya perlu mengembalikan tiga kolom -<code translate="no">id</code>, <code translate="no">title</code>, dan <code translate="no">price</code>.</p>
<ul>
<li><p>Dalam <strong>Milvus 2.5</strong>, semua 50 bidang skalar dimuat terlepas dari persyaratan kueri.</p></li>
<li><p>Pada <strong>Milvus 2.6+</strong>, hanya tiga field yang diminta yang dimuat. Sisa 47 field yang lain tidak dimuat dan hanya diambil secara malas jika akan diakses kemudian.</p></li>
</ul>
<p>Penghematan sumber daya bisa sangat besar. Jika setiap bidang skalar menempati 20 GB:</p>
<ul>
<li><p>Memuat semua bidang membutuhkan <strong>1.000 GB</strong> (50 × 20 GB)</p></li>
<li><p>Memuat hanya tiga bidang yang diperlukan menggunakan <strong>60 GB</strong></p></li>
</ul>
<p>Ini merupakan <strong>pengurangan 94%</strong> dalam pemuatan data skalar, tanpa memengaruhi kebenaran kueri atau hasil.</p>
<p><strong>Catatan:</strong> Pemuatan parsial yang sadar penyewa untuk bidang skalar dan indeks vektor akan secara resmi diperkenalkan dalam rilis yang akan datang. Setelah tersedia, fitur ini akan semakin mengurangi latensi pemuatan dan meningkatkan performa kueri dingin dalam penerapan multi-penyewa yang besar.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. Penggusuran Cache Berbasis LRU</h3><p>Pemuatan malas dan pemuatan parsial secara signifikan mengurangi jumlah data yang dibawa ke dalam memori dan disk lokal. Namun, dalam sistem yang berjalan lama, cache masih akan bertambah seiring dengan diaksesnya data baru dari waktu ke waktu. Ketika kapasitas lokal tercapai, penggusuran cache berbasis LRU mulai berlaku.</p>
<p>Penggusuran LRU (Least Recently Used) mengikuti aturan sederhana: data yang belum pernah diakses akan digusur terlebih dahulu. Hal ini membebaskan ruang lokal untuk data yang baru diakses sambil menjaga data yang sering digunakan tetap berada di cache.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">Evaluasi Kinerja: Penyimpanan Berjenjang vs Pemuatan Penuh<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk mengevaluasi dampak dunia nyata dari <strong>Penyimpanan Berjenjang</strong>, kami menyiapkan lingkungan pengujian yang sangat mirip dengan beban kerja produksi. Kami membandingkan Milvus dengan dan tanpa Penyimpanan Bertingkat di lima dimensi: waktu muat, penggunaan sumber daya, performa kueri, kapasitas efektif, dan efisiensi biaya.</p>
<h3 id="Experimental-setup" class="common-anchor-header">Penyiapan eksperimental</h3><p><strong>Kumpulan data</strong></p>
<ul>
<li><p>100 juta vektor dengan 768 dimensi (penyematan BERT)</p></li>
<li><p>Ukuran indeks vektor: sekitar 430 GB</p></li>
<li><p>10 bidang skalar, termasuk ID, stempel waktu, dan kategori</p></li>
</ul>
<p><strong>Konfigurasi perangkat keras</strong></p>
<ul>
<li><p>1 QueryNode dengan 4 vCPU, memori 32 GB, dan SSD NVMe 1 TB</p></li>
<li><p>Jaringan 10 Gbps</p></li>
<li><p>Cluster penyimpanan objek MinIO sebagai backend penyimpanan jarak jauh</p></li>
</ul>
<p><strong>Pola akses</strong></p>
<p>Kueri mengikuti distribusi akses panas-dingin yang realistis:</p>
<ul>
<li><p>80% dari kueri menargetkan data dari 30 hari terakhir (≈20% dari total data)</p></li>
<li><p>15% data target dari 30-90 hari (≈30% dari total data)</p></li>
<li><p>5% data target yang lebih tua dari 90 hari (≈50% dari total data)</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">Hasil utama</h3><p><strong>1. Waktu muat 33× lebih cepat</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Tahap</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Penyimpanan Berjenjang)</strong></th><th style="text-align:center"><strong>Percepatan</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Pengunduhan data</td><td style="text-align:center">22 menit</td><td style="text-align:center">28 detik</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">Pemuatan indeks</td><td style="text-align:center">3 menit</td><td style="text-align:center">17 detik</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>Total</strong></td><td style="text-align:center"><strong>25 menit</strong></td><td style="text-align:center"><strong>45 detik</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>Pada Milvus 2.5, memuat koleksi membutuhkan waktu <strong>25 menit</strong>. Dengan Penyimpanan Berjenjang di Milvus 2.6+, beban kerja yang sama dapat diselesaikan hanya dalam waktu <strong>45 detik</strong>, yang menunjukkan peningkatan efisiensi beban secara bertahap.</p>
<p><strong>2. Pengurangan 80% dalam Penggunaan Sumber Daya Lokal</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Tahap</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Penyimpanan Berjenjang)</strong></th><th style="text-align:center"><strong>Pengurangan</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Setelah memuat</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">Setelah 1 jam</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">Setelah 24 jam</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">Kondisi stabil</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>Pada Milvus 2.5, penggunaan sumber daya lokal tetap konstan pada <strong>430 GB</strong>, terlepas dari beban kerja atau waktu proses. Sebaliknya, Milvus 2.6+ dimulai dengan hanya <strong>12 GB</strong> segera setelah pemuatan.</p>
<p>Saat kueri berjalan, data yang sering diakses di-cache secara lokal dan penggunaan sumber daya secara bertahap meningkat. Setelah kurang lebih 24 jam, sistem menjadi stabil pada <strong>85-95 GB</strong>, yang mencerminkan kumpulan data panas yang bekerja. Dalam jangka panjang, hal ini menghasilkan <strong> pengurangan ~ 80%</strong> dalam memori lokal dan penggunaan disk, tanpa mengorbankan ketersediaan kueri.</p>
<p><strong>3. Dampak mendekati nol pada kinerja data panas</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Jenis kueri</strong></th><th style="text-align:center"><strong>Milvus 2.5 Latensi P99</strong></th><th style="text-align:center"><strong>Latensi Milvus 2.6+ P99</strong></th><th style="text-align:center"><strong>Perubahan</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Kueri data panas</td><td style="text-align:center">15 ms</td><td style="text-align:center">16 ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">Kueri data hangat</td><td style="text-align:center">15 ms</td><td style="text-align:center">28 ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">Kueri data dingin (akses pertama)</td><td style="text-align:center">15 ms</td><td style="text-align:center">120 ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">Kueri data dingin (di-cache)</td><td style="text-align:center">15 ms</td><td style="text-align:center">18 ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>Untuk data panas, yang menyumbang sekitar 80% dari semua kueri, latensi P99 meningkat hanya 6,7%, sehingga hampir tidak ada dampak yang terlihat dalam produksi.</p>
<p>Kueri data dingin menunjukkan latensi yang lebih tinggi pada akses pertama karena pemuatan sesuai permintaan dari penyimpanan objek. Namun, setelah di-cache, latensinya hanya meningkat 20%. Mengingat frekuensi akses data dingin yang rendah, pertukaran ini umumnya dapat diterima untuk sebagian besar beban kerja di dunia nyata.</p>
<p><strong>4. 4.3× Kapasitas Efektif Lebih Besar</strong></p>
<p>Dengan anggaran perangkat keras yang sama-delapan server dengan memori masing-masing 64 GB (total 512 GB)-Milvus 2.5 dapat memuat paling banyak 512 GB data, setara dengan sekitar 136 juta vektor.</p>
<p>Dengan Penyimpanan Berjenjang yang diaktifkan di Milvus 2.6+, perangkat keras yang sama dapat mendukung data sebesar 2,2 TB, atau sekitar 590 juta vektor. Ini merupakan peningkatan 4,3 kali lipat dalam kapasitas efektif, memungkinkan set data yang jauh lebih besar untuk dilayani tanpa memperluas memori lokal.</p>
<p><strong>5. Pengurangan Biaya 80,1%</strong></p>
<p>Dengan menggunakan set data vektor 2 TB di lingkungan AWS sebagai contoh, dan dengan asumsi 20% dari data tersebut panas (400 GB), perbandingan biayanya adalah sebagai berikut:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Item</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Penyimpanan Berjenjang)</strong></th><th style="text-align:center"><strong>Penghematan</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Biaya bulanan</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">Biaya tahunan</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">Tingkat tabungan</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">Ringkasan Tolok Ukur</h3><p>Di semua pengujian, Tiered Storage memberikan peningkatan yang konsisten dan terukur:</p>
<ul>
<li><p><strong>Waktu muat 33× lebih cepat:</strong> Waktu pemuatan koleksi berkurang dari <strong>25 menit menjadi 45 detik</strong>.</p></li>
<li><p><strong>Penggunaan sumber daya lokal 80% lebih rendah:</strong> Dalam operasi kondisi stabil, penggunaan memori dan disk lokal turun sekitar <strong>80%</strong>.</p></li>
<li><p><strong>Dampak mendekati nol pada kinerja data panas:</strong> Latensi P99 untuk data panas meningkat <strong>kurang dari 10%</strong>, mempertahankan kinerja kueri dengan latensi rendah.</p></li>
<li><p><strong>Latensi terkendali untuk data dingin:</strong> Data dingin memiliki latensi yang lebih tinggi pada akses pertama, tetapi hal ini dapat diterima karena frekuensi akses yang rendah.</p></li>
<li><p><strong>Kapasitas efektif 4,3 kali lebih tinggi:</strong> Perangkat keras yang sama dapat melayani <strong>4-5 kali lebih banyak data</strong> tanpa memori tambahan.</p></li>
<li><p><strong>Pengurangan biaya lebih dari 80%:</strong> Biaya infrastruktur tahunan berkurang <strong>lebih dari 80%.</strong></p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">Kapan Menggunakan Penyimpanan Berjenjang di Milvus<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Berdasarkan hasil benchmark dan kasus produksi di dunia nyata, kami mengelompokkan kasus penggunaan Tiered Storage ke dalam tiga kategori untuk membantu Anda memutuskan apakah Tiered Storage cocok untuk beban kerja Anda.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">Kasus Penggunaan yang Paling Sesuai</h3><p><strong>1. Platform pencarian vektor multi-penyewa</strong></p>
<ul>
<li><p><strong>Karakteristik:</strong> Jumlah penyewa yang banyak dengan aktivitas yang sangat tidak merata; pencarian vektor adalah beban kerja inti.</p></li>
<li><p><strong>Pola akses:</strong> Kurang dari 20% penyewa menghasilkan lebih dari 80% kueri vektor.</p></li>
<li><p><strong>Manfaat yang diharapkan:</strong> Pengurangan biaya 70-80%; Ekspansi kapasitas 3-5 kali lipat.</p></li>
</ul>
<p><strong>2. Sistem rekomendasi e-commerce (beban kerja penelusuran vektor)</strong></p>
<ul>
<li><p><strong>Karakteristik:</strong> Popularitas yang kuat condong di antara produk teratas dan produk ekor panjang.</p></li>
<li><p><strong>Pola akses:</strong> 10% produk teratas menyumbang ~ 80% dari lalu lintas penelusuran vektor.</p></li>
<li><p><strong>Manfaat yang diharapkan:</strong> Tidak perlu kapasitas ekstra selama acara puncak; Pengurangan biaya 60-70%.</p></li>
</ul>
<p><strong>3. Kumpulan data berskala besar dengan pemisahan panas-dingin yang jelas (dominan vektor)</strong></p>
<ul>
<li><p><strong>Karakteristik:</strong> Dataset berskala TB atau lebih besar, dengan akses yang sangat bias terhadap data terbaru.</p></li>
<li><p><strong>Pola akses:</strong> Distribusi klasik 80/20: 20% data melayani 80% kueri</p></li>
<li><p><strong>Manfaat yang diharapkan:</strong> Pengurangan biaya sebesar 75-85</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">Kasus Penggunaan yang Sesuai</h3><p><strong>1. Beban kerja yang sensitif terhadap biaya</strong></p>
<ul>
<li><p><strong>Karakteristik</strong> Anggaran yang ketat dengan beberapa toleransi untuk pertukaran kinerja kecil.</p></li>
<li><p><strong>Pola akses:</strong> Permintaan vektor relatif terkonsentrasi.</p></li>
<li><p><strong>Manfaat yang diharapkan:</strong> Pengurangan biaya 50-70%; Data dingin dapat menimbulkan latensi ~500 ms pada akses pertama, yang harus dievaluasi terhadap persyaratan SLA.</p></li>
</ul>
<p><strong>2. Penyimpanan data historis dan pencarian arsip</strong></p>
<ul>
<li><p><strong>Karakteristik:</strong> Volume vektor historis yang besar dengan frekuensi kueri yang sangat rendah.</p></li>
<li><p><strong>Pola akses:</strong> Sekitar 90% dari kueri menargetkan data terbaru.</p></li>
<li><p><strong>Manfaat yang diharapkan:</strong> Mempertahankan set data historis lengkap; Menjaga biaya infrastruktur tetap dapat diprediksi dan dikendalikan</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">Kasus Penggunaan yang Tidak Sesuai</h3><p><strong>1. Beban kerja data panas yang seragam</strong></p>
<ul>
<li><p><strong>Karakteristik:</strong> Semua data diakses pada frekuensi yang sama, tanpa perbedaan panas-dingin yang jelas.</p></li>
<li><p><strong>Mengapa tidak cocok:</strong> Manfaat cache yang terbatas; Menambah kompleksitas sistem tanpa keuntungan yang berarti</p></li>
</ul>
<p><strong>2. Beban kerja dengan latensi sangat rendah</strong></p>
<ul>
<li><p><strong>Karakteristik:</strong> Sistem yang sangat sensitif terhadap latensi, seperti perdagangan finansial atau penawaran waktu nyata</p></li>
<li><p><strong>Mengapa tidak cocok:</strong> Variasi latensi yang kecil sekalipun tidak dapat diterima; Pemuatan penuh memberikan kinerja yang lebih dapat diprediksi</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">Mulai Cepat: Cobalah Penyimpanan Berjenjang di Milvus 2.6+<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Penyimpanan Berjenjang di Milvus 2.6 mengatasi ketidaksesuaian yang umum terjadi antara bagaimana data vektor disimpan dan bagaimana data tersebut diakses. Di sebagian besar sistem produksi, hanya sebagian kecil data yang sering dimintakan, namun model pemuatan tradisional memperlakukan semua data sama panasnya. Dengan beralih ke pemuatan sesuai permintaan dan mengelola memori lokal dan disk sebagai cache, Milvus menyelaraskan konsumsi sumber daya dengan perilaku kueri yang sebenarnya daripada asumsi kasus terburuk.</p>
<p>Pendekatan ini memungkinkan sistem untuk menskalakan ke set data yang lebih besar tanpa peningkatan sumber daya lokal secara proporsional, sambil menjaga kinerja hot-query sebagian besar tidak berubah. Data dingin tetap dapat diakses saat dibutuhkan, dengan latensi yang dapat diprediksi dan dibatasi, sehingga pertukaran menjadi eksplisit dan dapat dikontrol. Ketika pencarian vektor bergerak lebih dalam ke lingkungan produksi yang sensitif terhadap biaya, multi-penyewa, dan telah berjalan lama, Tiered Storage memberikan fondasi praktis untuk beroperasi secara efisien dalam skala besar.</p>
<p>Untuk informasi lebih lanjut tentang Penyimpanan Berjenjang, lihat dokumentasi di bawah ini:</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">Penyimpanan Berjenjang | Dokumentasi Milvus</a></li>
</ul>
<p>Ada pertanyaan atau ingin mendalami fitur-fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Pelajari Lebih Lanjut tentang Fitur Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Memperkenalkan Milvus 2.6: Pencarian Vektor yang Terjangkau dalam Skala Miliaran</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Memperkenalkan Fungsi Penyematan: Bagaimana Milvus 2.6 Menyederhanakan Vektorisasi dan Pencarian Semantik</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Penghancuran JSON di Milvus: Pemfilteran JSON 88,9x Lebih Cepat dengan Fleksibilitas</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Membuka Pengambilan Tingkat Entitas yang Sebenarnya: Kemampuan Array-of-Structs dan MAX_SIM Baru di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Menyatukan Pemfilteran Geospasial dan Pencarian Vektor dengan Bidang Geometri dan RTREE di Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Memperkenalkan AISAQ di Milvus: Pencarian Vektor Berskala Miliaran Baru Saja Menjadi 3.200× Lebih Murah dalam Memori</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Mengoptimalkan NVIDIA CAGRA di Milvus: Pendekatan Hibrida GPU-CPU untuk Pengindeksan yang Lebih Cepat dan Kueri yang Lebih Murah</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH di Milvus: Senjata Rahasia untuk Memerangi Duplikasi dalam Data Pelatihan LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Membawa Kompresi Vektor ke Tingkat Ekstrem: Bagaimana Milvus Melayani Kueri 3× Lebih Banyak dengan RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmark Bohong - DB Vektor Layak Mendapat Ujian Nyata </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Burung Pelatuk untuk Milvus</a></p></li>
</ul>
