---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: >-
  Membuat dengan Milvus Mendeteksi Virus Android Secara Real Time untuk Trend
  Micro
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: >-
  Pelajari bagaimana Milvus digunakan untuk memitigasi ancaman terhadap data
  penting dan memperkuat keamanan siber dengan deteksi virus secara real-time.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Membuat dengan Milvus: Mendeteksi Virus Android secara Real Time untuk Trend Micro</custom-h1><p>Keamanan siber tetap menjadi ancaman yang terus berlanjut bagi individu dan bisnis, dengan masalah privasi data yang meningkat untuk <a href="https://www.getapp.com/resources/annual-data-security-report/">86% perusahaan</a> pada tahun 2020 dan hanya <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23% konsumen</a> yang percaya bahwa data pribadi mereka sangat aman. Seiring dengan semakin banyaknya malware yang ada di mana-mana dan semakin canggih, pendekatan proaktif untuk mendeteksi ancaman menjadi sangat penting. <a href="https://www.trendmicro.com/en_us/business.html">Trend Micro</a> adalah pemimpin global dalam keamanan cloud hybrid, pertahanan jaringan, keamanan usaha kecil, dan keamanan titik akhir. Untuk melindungi perangkat Android dari virus, perusahaan ini membangun Trend Micro Mobile Security-sebuah aplikasi seluler yang membandingkan APK (Paket Aplikasi Android) dari Google Play Store dengan database malware yang dikenal. Sistem pendeteksi virus bekerja sebagai berikut:</p>
<ul>
<li>APK eksternal (paket aplikasi Android) dari Google Play Store dirayapi.</li>
<li>Malware yang diketahui diubah menjadi vektor dan disimpan di <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a>.</li>
<li>APK baru juga diubah menjadi vektor, lalu dibandingkan dengan basis data malware menggunakan pencarian kemiripan.</li>
<li>Jika sebuah vektor APK mirip dengan vektor malware mana pun, aplikasi ini memberikan informasi terperinci kepada pengguna tentang virus dan tingkat ancamannya.</li>
</ul>
<p>Agar dapat bekerja, sistem harus melakukan pencarian kemiripan yang sangat efisien pada kumpulan data vektor yang sangat besar secara real time. Awalnya, Trend Micro menggunakan <a href="https://www.mysql.com/">MySQL</a>. Namun, seiring dengan perkembangan bisnisnya, begitu pula jumlah APK dengan kode jahat yang tersimpan di basis datanya. Tim algoritme perusahaan mulai mencari solusi pencarian kemiripan vektor alternatif setelah dengan cepat melampaui MySQL.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">Membandingkan solusi pencarian kemiripan vektor</h3><p>Ada sejumlah solusi pencarian kemiripan vektor yang tersedia, banyak di antaranya yang bersifat open source. Meskipun situasinya berbeda-beda dari satu proyek ke proyek lainnya, sebagian besar pengguna mendapatkan keuntungan dari memanfaatkan database vektor yang dibangun untuk pemrosesan dan analisis data yang tidak terstruktur daripada perpustakaan sederhana yang membutuhkan konfigurasi yang ekstensif. Di bawah ini kami membandingkan beberapa solusi pencarian kemiripan vektor yang populer dan menjelaskan mengapa Trend Micro memilih Milvus.</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a> adalah library yang dikembangkan oleh Facebook AI Research yang memungkinkan pencarian kemiripan yang efisien dan pengelompokan vektor yang padat. Algoritme yang ada di dalamnya dapat mencari vektor dengan berbagai ukuran dalam set. Faiss ditulis dalam bahasa C++ dengan pembungkus untuk Python/numpy, dan mendukung sejumlah indeks termasuk IndexFlatL2, IndexFlatIP, HNSW, dan IVF.</p>
<p>Meskipun Faiss adalah alat yang sangat berguna, ia memiliki keterbatasan. Ini hanya berfungsi sebagai pustaka algoritme dasar, bukan basis data untuk mengelola kumpulan data vektor. Selain itu, ia tidak menawarkan versi terdistribusi, layanan pemantauan, SDK, atau ketersediaan tinggi, yang merupakan fitur utama dari sebagian besar layanan berbasis cloud.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Plug-in berdasarkan Faiss &amp; pustaka pencarian ANN lainnya</h4><p>Ada beberapa plug-in yang dibangun di atas Faiss, NMSLIB, dan pustaka pencarian ANN lainnya yang dirancang untuk meningkatkan fungsionalitas dasar dari alat dasar yang mendukungnya. Elasticsearch (ES) adalah mesin pencari yang didasarkan pada pustaka Lucene dengan sejumlah plugin tersebut. Di bawah ini adalah diagram arsitektur plugin ES:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Dukungan bawaan untuk sistem terdistribusi adalah keuntungan utama dari solusi ES. Hal ini menghemat waktu pengembang dan uang perusahaan berkat kode yang tidak perlu ditulis. Plug-in ES secara teknis sudah maju dan lazim. Elasticsearch menyediakan QueryDSL (bahasa khusus domain), yang mendefinisikan kueri berdasarkan JSON dan mudah dipahami. Satu set lengkap layanan ES memungkinkan untuk melakukan pencarian vektor/teks dan memfilter data skalar secara bersamaan.</p>
<p>Amazon, Alibaba, dan Netease adalah beberapa perusahaan teknologi besar yang saat ini mengandalkan plug-in Elasticsearch untuk pencarian kesamaan vektor. Kelemahan utama dari solusi ini adalah konsumsi memori yang tinggi dan tidak ada dukungan untuk penyetelan kinerja. Sebaliknya, <a href="http://jd.com/">JD.com</a> telah mengembangkan solusi terdistribusi sendiri berdasarkan Faiss yang disebut <a href="https://github.com/vearch/vearch">Vearch</a>. Namun, Vearch masih dalam tahap inkubasi dan komunitas sumber terbukanya relatif tidak aktif.</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka yang dibuat oleh <a href="https://zilliz.com">Zilliz</a>. Ini sangat fleksibel, dapat diandalkan, dan sangat cepat. Dengan merangkum beberapa pustaka indeks yang diadopsi secara luas, seperti Faiss, NMSLIB, dan Annoy, Milvus menyediakan seperangkat API intuitif yang komprehensif, yang memungkinkan para pengembang untuk memilih jenis indeks yang ideal untuk skenario mereka. Milvus juga menyediakan solusi terdistribusi dan layanan pemantauan. Milvus memiliki komunitas sumber terbuka yang sangat aktif dan lebih dari 5,5 ribu bintang di <a href="https://github.com/milvus-io/milvus">Github</a>.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus terbaik dalam persaingan</h4><p>Kami mengumpulkan sejumlah hasil pengujian yang berbeda dari berbagai solusi pencarian kesamaan vektor yang disebutkan di atas. Seperti yang bisa kita lihat pada tabel perbandingan berikut, Milvus secara signifikan lebih cepat daripada kompetitor meskipun diuji pada set data 1 miliar vektor 128 dimensi.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Mesin</strong></th><th style="text-align:left"><strong>Kinerja (ms)</strong></th><th style="text-align:left"><strong>Ukuran Dataset (juta)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + Alibaba Cloud</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">Tidak baik</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>Perbandingan solusi pencarian kemiripan vektor.</em></h6><p>Setelah menimbang pro dan kontra dari setiap solusi, Trend Micro memilih Milvus untuk model pencarian vektornya. Dengan kinerja yang luar biasa pada kumpulan data berskala miliaran, jelaslah mengapa perusahaan memilih Milvus untuk layanan keamanan seluler yang membutuhkan pencarian kesamaan vektor secara real-time.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">Merancang sistem untuk deteksi virus secara real-time</h3><p>Trend Micro memiliki lebih dari 10 juta APK berbahaya yang tersimpan di basis data MySQL-nya, dengan 100 ribu APK baru yang ditambahkan setiap hari. Sistem ini bekerja dengan mengekstraksi dan menghitung nilai Thash dari berbagai komponen file APK, lalu menggunakan algoritme Sha256 untuk mengubahnya menjadi file biner dan menghasilkan nilai Sha256 256-bit yang membedakan APK tersebut dengan yang lain. Karena nilai Sha256 bervariasi pada file APK, satu APK dapat memiliki satu nilai Thash gabungan dan satu nilai Sha256 yang unik.</p>
<p>Nilai Sha256 hanya digunakan untuk membedakan APK, dan nilai Thash digunakan untuk pencarian kemiripan vektor. APK yang mirip mungkin memiliki nilai Thash yang sama tetapi nilai Sha256 yang berbeda.</p>
<p>Untuk mendeteksi APK dengan kode jahat, Trend Micro mengembangkan sistemnya sendiri untuk mengambil nilai Thash yang serupa dan nilai Sha256 yang sesuai. Trend Micro memilih Milvus untuk melakukan pencarian kemiripan vektor secara instan pada kumpulan data vektor besar yang dikonversi dari nilai Thash. Setelah pencarian kemiripan dijalankan, nilai Sha256 yang sesuai akan ditanyakan di MySQL. Lapisan caching Redis juga ditambahkan ke arsitektur untuk memetakan nilai Thash ke nilai Sha256, yang secara signifikan mengurangi waktu kueri.</p>
<p>Di bawah ini adalah diagram arsitektur sistem keamanan seluler Trend Micro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>Memilih metrik jarak yang tepat membantu meningkatkan klasifikasi vektor dan kinerja pengelompokan. Tabel berikut ini menunjukkan <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">metrik jarak</a> dan indeks yang sesuai yang bekerja dengan vektor biner.</p>
<table>
<thead>
<tr><th><strong>Metrik Jarak</strong></th><th><strong>Jenis Indeks</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard <br/> - Tanimoto <br/> - Hamming</td><td>- FLAT <br/> - IVF_FLAT</td></tr>
<tr><td>- Superstruktur <br/> - Substruktur</td><td>DATAR</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>Metrik jarak dan indeks untuk vektor biner.</em></h6><p><br/></p>
<p>Trend Micro mengubah nilai Thash menjadi vektor biner dan menyimpannya di Milvus. Untuk skenario ini, Trend Micro menggunakan jarak Hamming untuk membandingkan vektor.</p>
<p>Milvus akan segera mendukung ID vektor string, dan ID integer tidak perlu dipetakan ke nama yang sesuai dalam format string. Hal ini membuat lapisan caching Redis tidak diperlukan dan arsitektur sistem tidak terlalu besar.</p>
<p>Trend Micro mengadopsi solusi berbasis cloud dan menerapkan banyak tugas pada <a href="https://kubernetes.io/">Kubernetes</a>. Untuk mencapai ketersediaan yang tinggi, Trend Micro menggunakan <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards</a>, sebuah middleware sharding cluster Milvus yang dikembangkan dalam Python.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>Trend Micro memisahkan penyimpanan dan penghitungan jarak dengan menyimpan semua vektor di <a href="https://aws.amazon.com/efs/">EFS</a> (Elastic File System) yang disediakan oleh <a href="https://aws.amazon.com/">AWS</a>. Praktik ini merupakan tren yang populer di industri ini. Kubernetes digunakan untuk memulai beberapa node pembacaan, dan mengembangkan layanan LoadBalancer pada node pembacaan ini untuk memastikan ketersediaan yang tinggi.</p>
<p>Untuk menjaga konsistensi data, Mishards hanya mendukung satu simpul penulisan. Namun, versi terdistribusi Milvus dengan dukungan untuk beberapa node penulisan akan tersedia dalam beberapa bulan mendatang.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">Fungsi Pemantauan dan Peringatan</h3><p>Milvus kompatibel dengan sistem pemantauan yang dibangun di atas <a href="https://prometheus.io/">Prometheus</a>, dan menggunakan <a href="https://grafana.com/">Grafana</a>, sebuah platform sumber terbuka untuk analisis deret waktu, untuk memvisualisasikan berbagai metrik kinerja.</p>
<p>Prometheus memonitor dan menyimpan metrik berikut ini:</p>
<ul>
<li>Metrik kinerja Milvus termasuk kecepatan penyisipan, kecepatan kueri, dan waktu kerja Milvus.</li>
<li>Metrik kinerja sistem termasuk penggunaan CPU/GPU, lalu lintas jaringan, dan kecepatan akses disk.</li>
<li>Metrik penyimpanan perangkat keras termasuk ukuran data dan jumlah total file.</li>
</ul>
<p>Sistem pemantauan dan peringatan bekerja sebagai berikut:</p>
<ul>
<li>Klien Milvus mendorong data metrik yang disesuaikan ke Pushgateway.</li>
<li>Pushgateway memastikan data metrik yang berumur pendek dan singkat dikirim dengan aman ke Prometheus.</li>
<li>Prometheus terus menarik data dari Pushgateway.</li>
<li>Alertmanager mengatur ambang batas peringatan untuk metrik yang berbeda dan memunculkan alarm melalui email atau pesan.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">Kinerja Sistem</h3><p>Beberapa bulan telah berlalu sejak layanan ThashSearch yang dibangun di atas Milvus pertama kali diluncurkan. Grafik di bawah ini menunjukkan bahwa latensi kueri end-to-end kurang dari 95 milidetik.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>Penyisipan juga cepat. Dibutuhkan sekitar 10 detik untuk menyisipkan 3 juta vektor 192 dimensi. Dengan bantuan dari Milvus, kinerja sistem mampu memenuhi kriteria kinerja yang ditetapkan oleh Trend Micro.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Jangan menjadi orang asing</h3><ul>
<li>Temukan atau kontribusikan Milvus di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Terhubung dengan kami di <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
