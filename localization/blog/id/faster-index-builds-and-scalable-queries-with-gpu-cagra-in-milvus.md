---
id: faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
title: >-
  Mengoptimalkan NVIDIA CAGRA di Milvus: Pendekatan Hibrida GPU-CPU untuk
  Pengindeksan yang Lebih Cepat dan Kueri yang Lebih Murah
author: Marcelo Chen
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/CAGRA_cover_7b9675965f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, CAGRA, GPU, CPU, graph-based index'
meta_title: |
  Optimizing CAGRA in Milvus: A Hybrid GPU–CPU Approach
desc: >-
  Pelajari bagaimana GPU_CAGRA di Milvus 2.6 menggunakan GPU untuk konstruksi
  grafik yang cepat dan CPU untuk melayani kueri yang dapat diskalakan.
origin: >-
  https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md
---
<p>Ketika sistem AI beralih dari eksperimen ke infrastruktur produksi, basis data vektor tidak lagi berurusan dengan jutaan penyematan. <strong>Miliaran kini menjadi hal yang rutin, dan puluhan miliar menjadi hal yang semakin umum.</strong> Pada skala ini, pilihan algoritmik tidak hanya memengaruhi kinerja dan daya ingat, tetapi juga diterjemahkan secara langsung ke dalam biaya infrastruktur.</p>
<p>Hal ini mengarah pada pertanyaan inti untuk penerapan skala besar: <strong>bagaimana Anda memilih indeks yang tepat untuk menghasilkan recall dan latensi yang dapat diterima tanpa membiarkan penggunaan sumber daya komputasi menjadi tidak terkendali?</strong></p>
<p>Indeks berbasis grafik seperti <strong>NSW, HNSW, CAGRA, dan Vamana</strong> telah menjadi jawaban yang paling banyak digunakan. Dengan menavigasi grafik ketetanggaan yang telah dibuat sebelumnya, indeks-indeks ini memungkinkan pencarian tetangga terdekat yang cepat dalam skala miliaran, menghindari pemindaian secara kasar dan perbandingan setiap vektor terhadap kueri.</p>
<p>Namun, profil biaya dari pendekatan ini tidak merata. <strong>Mengajukan kueri pada sebuah graf relatif murah; membangunnya tidak.</strong> Membangun grafik berkualitas tinggi membutuhkan komputasi jarak berskala besar dan penyempurnaan berulang di seluruh dataset-beban kerja yang sulit ditangani oleh sumber daya CPU tradisional secara efisien seiring dengan bertambahnya data.</p>
<p>CAGRA dari NVIDIA mengatasi hambatan ini dengan menggunakan GPU untuk mempercepat pembuatan grafik melalui paralelisme masif. Meskipun hal ini secara signifikan mengurangi waktu pembuatan, namun mengandalkan GPU untuk konstruksi indeks dan penyajian kueri akan menimbulkan kendala biaya dan skalabilitas yang lebih tinggi di lingkungan produksi.</p>
<p>Untuk menyeimbangkan tradeoff ini, <a href="https://milvus.io/docs/release_notes.md#v261">Milvus 2.6.1</a> <strong>mengadopsi desain hibrida untuk</strong> <strong>indeks</strong> <a href="https://milvus.io/docs/gpu-cagra.md">GPU_CAGRA</a>: <strong>GPU hanya digunakan untuk konstruksi graf, sementara eksekusi kueri berjalan pada CPU.</strong> Hal ini mempertahankan keunggulan kualitas grafik yang dibuat oleh GPU sekaligus menjaga agar penyajian kueri tetap terukur dan hemat biaya-membuatnya sangat cocok untuk beban kerja dengan pembaruan data yang jarang, volume kueri yang besar, dan sensitivitas biaya yang ketat.</p>
<h2 id="What-Is-CAGRA-and-How-Does-It-Work" class="common-anchor-header">Apa Itu CAGRA dan Bagaimana Cara Kerjanya?<button data-href="#What-Is-CAGRA-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Indeks vektor berbasis grafik umumnya terbagi dalam dua kategori utama:</p>
<ul>
<li><p><strong>Konstruksi graf berulang</strong>, diwakili oleh <strong>CAGRA</strong> (sudah didukung di Milvus).</p></li>
<li><p><strong>Konstruksi graf berbasis sisipan</strong>, diwakili oleh <strong>Vamana</strong> (saat ini sedang dikembangkan di Milvus).</p></li>
</ul>
<p>Kedua pendekatan ini berbeda secara signifikan dalam tujuan desain dan fondasi teknisnya, sehingga masing-masing cocok untuk skala data dan pola beban kerja yang berbeda.</p>
<p><strong>NVIDIA CAGRA (CUDA ANN Graph-based)</strong> adalah algoritme asli GPU untuk pencarian tetangga terdekat (ANN), yang dirancang untuk membangun dan menanyakan grafik kedekatan skala besar secara efisien. Dengan memanfaatkan paralelisme GPU, CAGRA secara signifikan mempercepat konstruksi grafik dan memberikan kinerja kueri throughput tinggi dibandingkan dengan pendekatan berbasis CPU seperti HNSW.</p>
<p>CAGRA dibangun di atas algoritma <strong>NN-Descent (Nearest Neighbor Descent)</strong>, yang membangun graf k-nearest-neighbor (kNN) melalui penyempurnaan berulang. Dalam setiap iterasi, kandidat tetangga dievaluasi dan diperbarui, secara bertahap konvergen menuju hubungan ketetanggaan yang lebih berkualitas di seluruh kumpulan data.</p>
<p>Setelah setiap putaran penyempurnaan, CAGRA menerapkan teknik pemangkasan graf tambahan-seperti pemangkasan <strong>detour 2-hop-untuk</strong>menghapus sisi yang berlebihan sambil menjaga kualitas pencarian. Kombinasi dari perbaikan dan pemangkasan berulang ini menghasilkan <strong>graf yang ringkas namun terhubung dengan baik</strong> dan efisien untuk dilalui pada waktu kueri.</p>
<p>Melalui penyempurnaan dan pemangkasan yang berulang, CAGRA menghasilkan struktur graf yang mendukung <strong>pencarian tetangga terdekat dengan daya ingat yang tinggi dan latensi rendah dalam skala besar</strong>, sehingga sangat cocok untuk set data statis atau yang jarang diperbarui.</p>
<h3 id="Step-1-Building-the-Initial-Graph-with-NN-Descent" class="common-anchor-header">Langkah 1: Membangun Graf Awal dengan NN-Descent</h3><p>NN-Descent didasarkan pada pengamatan yang sederhana namun kuat: jika simpul <em>u</em> adalah tetangga <em>v</em>, dan simpul <em>w</em> adalah tetangga <em>u</em>, maka <em>w</em> kemungkinan besar adalah tetangga <em>v</em> juga. Sifat transitif ini memungkinkan algoritma untuk menemukan tetangga terdekat yang sebenarnya secara efisien, tanpa harus membandingkan setiap pasangan vektor.</p>
<p>CAGRA menggunakan NN-Descent sebagai algoritma konstruksi graf intinya. Prosesnya bekerja sebagai berikut:</p>
<p><strong>1. Inisialisasi acak:</strong> Setiap node dimulai dengan sekumpulan kecil tetangga yang dipilih secara acak, membentuk graf awal yang kasar.</p>
<p><strong>2. Perluasan tetangga:</strong> Dalam setiap iterasi, sebuah node mengumpulkan tetangganya saat ini dan tetangga mereka untuk membentuk daftar kandidat. Algoritma ini menghitung kemiripan antara simpul dan semua kandidat. Karena daftar kandidat setiap node bersifat independen, komputasi ini dapat ditugaskan ke blok thread GPU yang terpisah dan dieksekusi secara paralel dalam skala besar.</p>
<p><strong>3. Pembaruan daftar kandidat:</strong> Jika algoritme menemukan kandidat yang lebih dekat daripada tetangga node saat ini, algoritme akan menukar tetangga yang lebih jauh dan memperbarui daftar kNN node. Melalui beberapa iterasi, proses ini menghasilkan perkiraan grafik kNN yang jauh lebih berkualitas.</p>
<p><strong>4. Pemeriksaan konvergensi:</strong> Seiring dengan berjalannya iterasi, semakin sedikit pembaruan tetangga yang terjadi. Setelah jumlah koneksi yang diperbarui turun di bawah ambang batas yang ditetapkan, algoritme berhenti, yang mengindikasikan bahwa grafik telah stabil secara efektif.</p>
<p>Karena perluasan tetangga dan komputasi kemiripan untuk node yang berbeda sepenuhnya independen, CAGRA memetakan beban kerja NN-Descent setiap node ke blok thread GPU khusus. Desain ini memungkinkan paralelisme yang masif dan membuat konstruksi graf menjadi jauh lebih cepat daripada metode berbasis CPU tradisional.</p>
<h3 id="Step-2-Pruning-the-Graph-with-2-Hop-Detours" class="common-anchor-header">Langkah 2: Memangkas Graf dengan Jalan Pintas 2-Hop</h3><p>Setelah NN-Descent selesai, grafik yang dihasilkan akurat tetapi terlalu padat. NN-Descent dengan sengaja menyimpan kandidat tetangga ekstra, dan fase inisialisasi acak memperkenalkan banyak sisi yang lemah atau tidak relevan. Akibatnya, setiap simpul sering kali berakhir dengan derajat dua kali-atau bahkan beberapa kali-lebih tinggi dari derajat target.</p>
<p>Untuk menghasilkan graf yang ringkas dan efisien, CAGRA menerapkan pemangkasan jalan memutar 2 hop.</p>
<p>Idenya sederhana: jika simpul <em>A</em> dapat mencapai simpul <em>B</em> secara tidak langsung melalui tetangga bersama <em>C</em> (membentuk jalur A → C → B), dan jarak dari jalur tidak langsung ini sebanding dengan jarak langsung antara <em>A</em> dan <em>B</em>, maka sisi langsung A → B dianggap mubazir dan dapat dihapus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_hop_detours_d15eae8702.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Keuntungan utama dari strategi pemangkasan ini adalah bahwa pemeriksaan redundansi setiap sisi hanya bergantung pada informasi lokal-jarak antara dua titik akhir dan tetangga bersama mereka. Karena setiap edge dapat dievaluasi secara independen, langkah pemangkasan ini sangat dapat diparalelkan dan cocok secara alami dengan eksekusi batch GPU.</p>
<p>Hasilnya, CAGRA dapat memangkas graf secara efisien pada GPU, mengurangi overhead penyimpanan sebesar <strong>40-50%</strong> sekaligus menjaga akurasi pencarian dan meningkatkan kecepatan penelusuran selama eksekusi kueri.</p>
<h2 id="GPUCAGRA-in-Milvus-What’s-Different" class="common-anchor-header">GPU_CAGRA di Milvus: Apa yang Berbeda?<button data-href="#GPUCAGRA-in-Milvus-What’s-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Meskipun GPU menawarkan keunggulan performa yang besar untuk konstruksi graf, lingkungan produksi menghadapi tantangan praktis: Sumber daya GPU jauh lebih mahal dan terbatas daripada CPU. Jika pembuatan indeks dan eksekusi kueri hanya bergantung pada GPU, beberapa masalah operasional akan muncul dengan cepat:</p>
<ul>
<li><p><strong>Pemanfaatan sumber daya yang rendah:</strong> Lalu lintas kueri sering kali tidak teratur dan meledak-ledak, membuat GPU menganggur dalam waktu lama dan memboroskan kapasitas komputasi yang mahal.</p></li>
<li><p><strong>Biaya penerapan yang tinggi:</strong> Menugaskan GPU ke setiap instance yang melayani kueri akan meningkatkan biaya perangkat keras, meskipun sebagian besar kueri tidak sepenuhnya memanfaatkan kinerja GPU.</p></li>
<li><p><strong>Skalabilitas terbatas:</strong> Jumlah GPU yang tersedia secara langsung membatasi jumlah replika layanan yang dapat Anda jalankan, sehingga membatasi kemampuan Anda untuk menyesuaikan dengan permintaan.</p></li>
<li><p><strong>Mengurangi fleksibilitas:</strong> Ketika pembuatan indeks dan kueri bergantung pada GPU, sistem menjadi terikat pada ketersediaan GPU dan tidak dapat dengan mudah mengalihkan beban kerja ke CPU.</p></li>
</ul>
<p>Untuk mengatasi kendala ini, Milvus 2.6.1 memperkenalkan mode penerapan yang fleksibel untuk indeks GPU_CAGRA melalui parameter <code translate="no">adapt_for_cpu</code>. Mode ini memungkinkan alur kerja hybrid: CAGRA menggunakan GPU untuk membangun indeks grafik berkualitas tinggi, sementara eksekusi kueri berjalan di CPU-biasanya menggunakan HNSW sebagai algoritme pencarian.</p>
<p>Dalam pengaturan ini, GPU digunakan di tempat yang memberikan nilai paling tinggi - konstruksi indeks yang cepat dan akurasi tinggi - sementara CPU menangani beban kerja kueri berskala besar dengan cara yang jauh lebih hemat biaya dan dapat diskalakan.</p>
<p>Hasilnya, pendekatan hibrida ini sangat cocok untuk beban kerja di mana:</p>
<ul>
<li><p><strong>Pembaruan data jarang</strong> dilakukan, sehingga pembangunan ulang indeks jarang dilakukan</p></li>
<li><p><strong>Volume kueri tinggi</strong>, sehingga membutuhkan banyak replika yang tidak mahal</p></li>
<li><p><strong>Sensitivitas biaya tinggi</strong>, dan penggunaan GPU harus dikontrol dengan ketat</p></li>
</ul>
<h3 id="Understanding-adaptforcpu" class="common-anchor-header">Pemahaman <code translate="no">adapt_for_cpu</code></h3><p>Di Milvus, parameter <code translate="no">adapt_for_cpu</code> mengontrol bagaimana indeks CAGRA diserialisasikan ke disk selama pembuatan indeks dan bagaimana indeks tersebut diserialisasikan ke dalam memori pada waktu pemuatan. Dengan mengubah pengaturan ini pada saat membangun dan waktu pemuatan, Milvus dapat secara fleksibel beralih antara pembangunan indeks berbasis GPU dan eksekusi kueri berbasis CPU.</p>
<p>Kombinasi yang berbeda dari <code translate="no">adapt_for_cpu</code> pada saat build time dan load time menghasilkan empat mode eksekusi, masing-masing dirancang untuk skenario operasional tertentu.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Waktu Pembuatan (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Waktu Pemuatan (<code translate="no">adapt_for_cpu</code>)</strong></th><th style="text-align:center"><strong>Logika Eksekusi</strong></th><th style="text-align:center"><strong>Skenario yang Disarankan</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>benar</strong></td><td style="text-align:center"><strong>benar</strong></td><td style="text-align:center">Bangun dengan GPU_CAGRA → serialisasi sebagai HNSW → deserialisasi sebagai HNSW → kueri <strong>CPU</strong></td><td style="text-align:center">Beban kerja yang sensitif terhadap biaya; penyajian kueri skala besar</td></tr>
<tr><td style="text-align:center"><strong>benar</strong></td><td style="text-align:center"><strong>salah</strong></td><td style="text-align:center">Bangun dengan GPU_CAGRA → serialisasi sebagai HNSW → deserialisasi sebagai HNSW → kueri <strong>CPU</strong></td><td style="text-align:center">Kueri berikutnya kembali ke CPU ketika terjadi ketidakcocokan parameter</td></tr>
<tr><td style="text-align:center"><strong>false</strong></td><td style="text-align:center"><strong>benar</strong></td><td style="text-align:center">Bangun dengan GPU_CAGRA → serialisasi sebagai CAGRA → deserialisasi sebagai HNSW → kueri <strong>CPU</strong></td><td style="text-align:center">Menyimpan indeks CAGRA asli untuk penyimpanan sambil mengaktifkan pencarian CPU sementara</td></tr>
<tr><td style="text-align:center"><strong>false</strong></td><td style="text-align:center"><strong>salah</strong></td><td style="text-align:center">Bangun dengan GPU_CAGRA → serialisasi sebagai CAGRA → deserialisasi sebagai CAGRA → kueri <strong>GPU</strong></td><td style="text-align:center">Beban kerja yang sangat penting untuk kinerja di mana biaya menjadi nomor dua</td></tr>
</tbody>
</table>
<p><strong>Catatan:</strong> Mekanisme <code translate="no">adapt_for_cpu</code> hanya mendukung konversi satu arah. Indeks CAGRA dapat dikonversi menjadi HNSW karena struktur graf CAGRA mempertahankan semua hubungan tetangga yang dibutuhkan oleh HNSW. Namun, indeks HNSW tidak dapat dikonversi kembali ke CAGRA, karena tidak memiliki informasi struktural tambahan yang diperlukan untuk kueri berbasis GPU. Akibatnya, pengaturan waktu pembuatan harus dipilih dengan hati-hati, dengan pertimbangan untuk penyebaran jangka panjang dan persyaratan kueri.</p>
<h2 id="Putting-GPUCAGRA-to-the-Test" class="common-anchor-header">Menguji GPU_CAGRA<button data-href="#Putting-GPUCAGRA-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk mengevaluasi efektivitas model eksekusi hibrida-menggunakan GPU untuk konstruksi indeks dan CPU untuk eksekusi kueri-kami melakukan serangkaian eksperimen terkontrol di lingkungan yang terstandardisasi. Evaluasi ini berfokus pada tiga dimensi: <strong>performa pembuatan indeks</strong>, <strong>performa kueri</strong>, dan <strong>akurasi pemanggilan</strong>.</p>
<p><strong>Pengaturan Eksperimental</strong></p>
<p>Eksperimen dilakukan pada perangkat keras standar industri yang diadopsi secara luas untuk memastikan hasilnya tetap andal dan dapat diterapkan secara luas.</p>
<ul>
<li><p>CPU Prosesor MD EPYC 7R13 (16 cpu)</p></li>
<li><p>GPU NVIDIA L4</p></li>
</ul>
<h3 id="1-Index-Build-Performance" class="common-anchor-header">1. Kinerja Pembuatan Indeks</h3><p>Kami membandingkan CAGRA yang dibangun di atas GPU dengan HNSW yang dibangun di atas CPU, di bawah tingkat grafik target yang sama, yaitu 64.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp1_a177200ab2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Temuan Utama</strong></p>
<ul>
<li><p><strong>GPU CAGRA membangun indeks 12-15× lebih cepat daripada CPU HNSW.</strong> Pada Cohere1M dan Gist1M, CAGRA berbasis GPU secara signifikan mengungguli HNSW berbasis CPU, menyoroti efisiensi paralelisme GPU selama konstruksi grafik.</p></li>
<li><p><strong>Waktu pembuatan meningkat secara linier dengan iterasi NN-Descent.</strong> Seiring dengan meningkatnya jumlah iterasi, waktu pembuatan grafik juga meningkat secara linier, yang mencerminkan sifat penyempurnaan iteratif dari NN-Descent dan memberikan pertukaran yang dapat diprediksi antara biaya pembuatan dan kualitas grafik.</p></li>
</ul>
<h3 id="2-Query-performance" class="common-anchor-header">2. Performa kueri</h3><p>Dalam percobaan ini, grafik CAGRA dibangun sekali pada GPU dan kemudian di-query menggunakan dua jalur eksekusi yang berbeda:</p>
<ul>
<li><p><strong>Kueri CPU</strong>: indeks dideserialisasi ke dalam format HNSW dan dicari di CPU</p></li>
<li><p><strong>Permintaan GPU</strong>: pencarian dijalankan langsung pada grafik CAGRA menggunakan penjelajahan berbasis GPU</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp2_bd00e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Temuan Utama</strong></p>
<ul>
<li><p><strong>Throughput pencarian GPU adalah 5-6 kali lebih tinggi daripada pencarian CPU.</strong> Pada Cohere1M dan Gist1M, penjelajahan berbasis GPU menghasilkan QPS yang jauh lebih tinggi, menyoroti efisiensi navigasi grafik paralel pada GPU.</p></li>
<li><p><strong>Recall meningkat dengan iterasi NN-Descent, lalu mendatar.</strong> Seiring dengan bertambahnya jumlah iterasi build, recall meningkat baik untuk kueri CPU maupun GPU. Namun, di luar titik tertentu, iterasi tambahan menghasilkan peningkatan yang semakin berkurang, yang mengindikasikan bahwa kualitas graf sebagian besar telah konvergen.</p></li>
</ul>
<h3 id="3-Recall-accuracy" class="common-anchor-header">3. Akurasi pemanggilan kembali</h3><p>Dalam percobaan ini, CAGRA dan HNSW diquery di CPU untuk membandingkan recall di bawah kondisi query yang sama.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cp3_1a46a7bdda.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Temuan Utama</strong></p>
<p><strong>CAGRA mencapai recall yang lebih tinggi daripada HNSW pada kedua dataset</strong>, menunjukkan bahwa bahkan ketika indeks CAGRA dibangun di GPU dan dideserialisasi untuk pencarian CPU, kualitas grafik tetap terjaga dengan baik.</p>
<h2 id="What’s-Next-Scaling-Index-Construction-with-Vamana" class="common-anchor-header">Selanjutnya: Konstruksi Indeks Penskalaan dengan Vamana<button data-href="#What’s-Next-Scaling-Index-Construction-with-Vamana" class="anchor-icon" translate="no">
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
    </button></h2><p>Pendekatan hibrida GPU-CPU Milvus menawarkan solusi praktis dan hemat biaya untuk beban kerja pencarian vektor berskala besar saat ini. Dengan membangun grafik CAGRA berkualitas tinggi di GPU dan melayani kueri di CPU, ini menggabungkan konstruksi indeks yang cepat dengan eksekusi kueri yang dapat diskalakan dan terjangkau - sangat<strong>cocok untuk beban kerja dengan pembaruan yang jarang, volume kueri yang tinggi, dan kendala biaya yang ketat</strong>.</p>
<p>Pada skala yang lebih besar lagi-puluhan<strong>atau ratusan miliar vektor-konstruksi indeks</strong>itu sendiri menjadi hambatan. Ketika dataset lengkap tidak lagi muat dalam memori GPU, industri biasanya beralih ke metode <strong>konstruksi grafik berbasis sisipan</strong> seperti <strong>Vamana</strong>. Alih-alih membangun grafik sekaligus, Vamana memproses data secara bertahap, menyisipkan vektor baru secara bertahap sambil mempertahankan konektivitas global.</p>
<p>Jalur konstruksinya mengikuti tiga tahap utama:</p>
<p><strong>1. Pertumbuhan batch geometris</strong> - dimulai dengan batch kecil untuk membentuk grafik kerangka, kemudian meningkatkan ukuran batch untuk memaksimalkan paralelisme, dan akhirnya menggunakan batch besar untuk menyempurnakan detail.</p>
<p><strong>2. Penyisipan serakah</strong> - setiap simpul baru disisipkan dengan menavigasi dari titik masuk pusat, secara berulang-ulang menyempurnakan himpunan tetangganya.</p>
<p><strong>3. Pembaruan sisi ke belakang</strong> - menambahkan koneksi terbalik untuk menjaga simetri dan memastikan navigasi graf yang efisien.</p>
<p>Pemangkasan diintegrasikan secara langsung ke dalam proses konstruksi menggunakan kriteria α-RNG: jika sebuah kandidat tetangga <em>v</em> sudah dicakup oleh tetangga yang sudah ada <em>p′</em> (yaitu, <em>d(p′, v) &lt; α × d(p, v)</em>), maka <em>v</em> dipangkas. Parameter α memungkinkan kontrol yang tepat atas sparsitas dan akurasi. Akselerasi GPU dicapai melalui paralelisme in-batch dan penskalaan batch geometris, yang menyeimbangkan antara kualitas indeks dan throughput.</p>
<p>Bersama-sama, teknik-teknik ini memungkinkan tim untuk menangani pertumbuhan data yang cepat dan pembaruan indeks berskala besar tanpa mengalami keterbatasan memori GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/One_more_thing_b458360e25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tim Milvus secara aktif membangun dukungan Vamana, dengan target rilis pada paruh pertama tahun 2026. Pantau terus perkembangannya.</p>
<p>Ada pertanyaan atau ingin mendalami fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
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
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH di Milvus: Senjata Rahasia untuk Memerangi Duplikat dalam Data Pelatihan LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Membawa Kompresi Vektor ke Tingkat Ekstrim: Bagaimana Milvus Melayani Kueri 3× Lebih Banyak dengan RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Tolok Ukur Berbohong - DB Vektor Layak Mendapatkan Tes yang Sesungguhnya </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Kami Mengganti Kafka/Pulsar dengan Burung Pelatuk untuk Milvus</a></p></li>
</ul>
