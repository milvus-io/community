---
id: dna-sequence-classification-based-on-milvus.md
title: Klasifikasi Urutan DNA berdasarkan Milvus
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: >-
  Gunakan Milvus, database vektor sumber terbuka, untuk mengenali keluarga gen
  dari sekuens DNA. Lebih sedikit ruang tetapi akurasi lebih tinggi.
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>Klasifikasi Urutan DNA berdasarkan Milvus</custom-h1><blockquote>
<p>Penulis: Mengjia Gu, seorang insinyur data di Zilliz, lulus dari McGill University dengan gelar Master di bidang Studi Informasi. Minatnya meliputi aplikasi AI dan pencarian kemiripan dengan basis data vektor. Sebagai anggota komunitas proyek sumber terbuka Milvus, ia telah menyediakan dan meningkatkan berbagai solusi, seperti sistem rekomendasi dan model klasifikasi sekuens DNA. Dia menikmati tantangan dan tidak pernah menyerah!</p>
</blockquote>
<custom-h1>Pengantar</custom-h1><p>Sekuens DNA adalah konsep yang populer dalam penelitian akademis dan aplikasi praktis, seperti penelusuran gen, identifikasi spesies, dan diagnosis penyakit. Ketika semua industri membutuhkan metode penelitian yang lebih cerdas dan efisien, kecerdasan buatan telah menarik banyak perhatian terutama dari bidang biologi dan medis. Semakin banyak ilmuwan dan peneliti yang berkontribusi pada pembelajaran mesin dan pembelajaran mendalam dalam bioinformatika. Untuk membuat hasil eksperimen lebih meyakinkan, salah satu opsi yang umum dilakukan adalah meningkatkan ukuran sampel. Kolaborasi dengan data besar dalam genomik juga membawa lebih banyak kemungkinan kasus penggunaan dalam kenyataan. Namun, penyelarasan sekuens tradisional memiliki keterbatasan, yang membuatnya <a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">tidak cocok untuk data yang besar</a>. Untuk mengurangi trade-off pada kenyataannya, vektorisasi adalah pilihan yang baik untuk kumpulan data sekuens DNA yang besar.</p>
<p>Basis data vektor sumber terbuka <a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> ramah untuk data yang sangat besar. Ia mampu menyimpan vektor sekuens asam nukleat dan melakukan pengambilan dengan efisiensi tinggi. Hal ini juga dapat membantu mengurangi biaya produksi atau penelitian. Sistem klasifikasi sekuens DNA berdasarkan Milvus hanya membutuhkan waktu milidetik untuk melakukan klasifikasi gen. Selain itu, sistem ini menunjukkan akurasi yang lebih tinggi daripada pengklasifikasi umum lainnya dalam pembelajaran mesin.</p>
<custom-h1>Pemrosesan Data</custom-h1><p>Gen yang mengkodekan informasi genetik terdiri dari sebagian kecil urutan DNA, yang terdiri dari 4 basa nukleotida [A, C, G, T]. Terdapat sekitar 30.000 gen dalam genom manusia, hampir 3 miliar pasangan basa DNA, dan setiap pasangan basa memiliki 2 basa yang sesuai. Untuk mendukung penggunaan yang beragam, sekuens DNA dapat diklasifikasikan ke dalam berbagai kategori. Untuk mengurangi biaya dan mempermudah penggunaan data sekuens DNA yang panjang, <a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">k-mer </a>diperkenalkan pada prapemrosesan data. Sementara itu, k-mer membuat data sekuens DNA menjadi lebih mirip dengan teks biasa. Selain itu, data yang divektorisasi dapat mempercepat penghitungan dalam analisis data atau pembelajaran mesin.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>Metode k-mer biasanya digunakan dalam prapemrosesan sekuens DNA. Metode ini mengekstrak bagian kecil dengan panjang k mulai dari setiap basa dari urutan asli, sehingga mengubah urutan panjang dengan panjang s menjadi (s-k+1) urutan pendek dengan panjang k. Menyesuaikan nilai k akan meningkatkan kinerja model. Daftar urutan pendek lebih mudah untuk pembacaan data, ekstraksi fitur, dan vektorisasi.</p>
<p><strong>Vektorisasi</strong></p>
<p>Sekuens DNA divektorisasi dalam bentuk teks. Sekuens yang ditransformasikan oleh k-mer menjadi daftar sekuens pendek, yang terlihat seperti daftar kata-kata dalam sebuah kalimat. Oleh karena itu, sebagian besar model pemrosesan bahasa alami seharusnya dapat digunakan untuk data sekuens DNA juga. Metodologi yang sama dapat diterapkan pada pelatihan model, ekstraksi fitur, dan penyandian. Karena setiap model memiliki kelebihan dan kekurangannya masing-masing, pemilihan model tergantung pada fitur data dan tujuan penelitian. Sebagai contoh, CountVectorizer, model bag-of-words, mengimplementasikan ekstraksi fitur melalui tokenisasi langsung. Model ini tidak menetapkan batasan panjang data, tetapi hasil yang dikembalikan kurang jelas dalam hal perbandingan kemiripan.</p>
<custom-h1>Demo Milvus</custom-h1><p>Milvus dapat dengan mudah mengelola data yang tidak terstruktur dan mengingat hasil yang paling mirip di antara triliunan vektor dalam penundaan rata-rata milidetik. Pencarian kemiripannya didasarkan pada algoritma pencarian Approximate Nearest Neighbor (ANN). Hal-hal penting ini menjadikan Milvus pilihan yang tepat untuk mengelola vektor sekuens DNA, sehingga mendorong pengembangan dan aplikasi bioinformatika.</p>
<p>Berikut ini adalah demo yang menunjukkan bagaimana membangun sistem klasifikasi sekuens DNA dengan Milvus. <a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">Dataset eksperimental </a>mencakup 3 organisme dan 7 keluarga gen. Semua data dikonversi menjadi daftar sekuens pendek dengan k-mers. Dengan model CountVectorizer yang telah dilatih sebelumnya, sistem kemudian mengkodekan data sekuens menjadi vektor. Diagram alir di bawah ini menggambarkan struktur sistem dan proses penyisipan dan pencarian.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Cobalah demo ini di <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">bootcamp Milvus</a>.</p>
<p>Dalam Milvus, sistem membuat koleksi dan menyisipkan vektor-vektor sekuens DNA yang sesuai ke dalam koleksi (atau partisi jika diaktifkan). Ketika menerima permintaan kueri, Milvus akan mengembalikan jarak antara vektor sekuens DNA masukan dan hasil yang paling mirip dalam database. Kelas urutan masukan dan kemiripan antara urutan DNA dapat ditentukan oleh jarak vektor dalam hasil.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Klasifikasi Urutan DNA</strong>Mencari urutan DNA yang paling mirip di Milvus dapat mengimplikasikan keluarga gen dari sampel yang tidak diketahui, sehingga dapat mempelajari kemungkinan fungsinya.<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> Jika sebuah urutan diklasifikasikan sebagai GPCR, maka kemungkinan besar urutan tersebut memiliki pengaruh dalam fungsi tubuh. </a>Dalam demo ini, Milvus telah berhasil memungkinkan sistem untuk mengidentifikasi keluarga gen dari sekuens DNA manusia yang dicari.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>Kemiripan Genetik</strong></p>
<p>Kesamaan urutan DNA rata-rata antara organisme menggambarkan seberapa dekat antara genom mereka. Demo ini mencari dalam data manusia untuk sekuens DNA yang paling mirip dengan simpanse dan anjing. Kemudian menghitung dan membandingkan jarak inner product rata-rata (0,97 untuk simpanse dan 0,70 untuk anjing), yang membuktikan bahwa simpanse memiliki lebih banyak kesamaan gen dengan manusia dibandingkan dengan anjing. Dengan data dan desain sistem yang lebih kompleks, Milvus mampu mendukung penelitian genetika bahkan pada tingkat yang lebih tinggi.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Kinerja</strong></p>
<p>Demo ini melatih model klasifikasi dengan 80% data sampel manusia (total 3629) dan menggunakan sisanya sebagai data uji. Demo ini membandingkan kinerja model klasifikasi urutan DNA yang menggunakan Milvus dengan model klasifikasi yang didukung oleh Mysql dan 5 pengklasifikasi pembelajaran mesin yang populer. Model yang didasarkan pada Milvus mengungguli rekan-rekannya dalam hal akurasi.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>Eksplorasi Lebih Lanjut</custom-h1><p>Dengan perkembangan teknologi big data, vektorisasi urutan DNA akan memainkan peran yang lebih penting dalam penelitian dan praktik genetik. Dikombinasikan dengan pengetahuan profesional di bidang bioinformatika, penelitian terkait dapat memperoleh manfaat lebih lanjut dari keterlibatan vektorisasi sekuens DNA. Oleh karena itu, Milvus dapat memberikan hasil yang lebih baik dalam praktiknya. Sesuai dengan skenario dan kebutuhan pengguna yang berbeda, pencarian kemiripan dan penghitungan jarak yang didukung oleh Milvus menunjukkan potensi yang besar dan banyak kemungkinan.</p>
<ul>
<li><strong>Mempelajari urutan yang tidak diketahui</strong>: <a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">Menurut beberapa peneliti, vektorisasi dapat memampatkan data urutan DNA.</a> Pada saat yang sama, dibutuhkan lebih sedikit usaha untuk mempelajari struktur, fungsi, dan evolusi urutan DNA yang tidak diketahui. Milvus dapat menyimpan dan mengambil sejumlah besar vektor urutan DNA tanpa kehilangan akurasi.</li>
<li><strong>Beradaptasi dengan perangkat</strong>: Dibatasi oleh algoritme tradisional penyelarasan sekuens, pencarian kemiripan hampir tidak bisa mendapatkan manfaat dari peningkatan perangkat<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">(</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">CPU/GPU</a>). Milvus, yang mendukung komputasi CPU biasa dan akselerasi GPU, menyelesaikan masalah ini dengan algoritme tetangga terdekat.</li>
<li><strong>Mendeteksi virus &amp; melacak asal-usulnya</strong>: Para <a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">ilmuwan telah membandingkan sekuens genom dan melaporkan bahwa virus COVID19 yang kemungkinan berasal dari kelelawar adalah SARS-COV</a>. Berdasarkan kesimpulan ini, para peneliti dapat memperluas ukuran sampel untuk mendapatkan lebih banyak bukti dan pola.</li>
<li><strong>Mendiagnosis penyakit</strong>: Secara klinis, dokter dapat membandingkan sekuens DNA antara pasien dan kelompok sehat untuk mengidentifikasi varian gen yang menyebabkan penyakit. Dimungkinkan untuk mengekstrak fitur dan menyandikan data ini menggunakan algoritma yang tepat. Milvus mampu mengembalikan jarak antara vektor, yang dapat dikaitkan dengan data penyakit. Selain membantu diagnosis penyakit, aplikasi ini juga dapat membantu menginspirasi studi tentang <a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">terapi yang ditargetkan</a>.</li>
</ul>
<custom-h1>Pelajari lebih lanjut tentang Milvus</custom-h1><p>Milvus adalah alat yang kuat yang mampu memberdayakan beragam kecerdasan buatan dan aplikasi pencarian kemiripan vektor. Untuk mempelajari lebih lanjut tentang proyek ini, lihat sumber-sumber berikut:</p>
<ul>
<li>Baca <a href="https://milvus.io/blog">blog</a> kami.</li>
<li>Berinteraksi dengan komunitas sumber terbuka kami di <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Gunakan atau kontribusikan database vektor paling populer di dunia di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Menguji dan menerapkan aplikasi AI dengan cepat menggunakan <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> baru kami.</li>
</ul>
