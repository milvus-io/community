---
id: graph-based-recommendation-system-with-milvus.md
title: Bagaimana cara kerja sistem rekomendasi?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  Sistem rekomendasi dapat menghasilkan pendapatan, mengurangi biaya, dan
  menawarkan keunggulan kompetitif. Pelajari cara membuatnya secara gratis
  dengan alat bantu sumber terbuka.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Membangun Sistem Rekomendasi Berbasis Graf dengan Dataset Milvus, PinSage, DGL, dan MovieLens</custom-h1><p>Sistem rekomendasi didukung oleh algoritme yang <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">pada awalnya</a> membantu manusia untuk menyaring email yang tidak diinginkan. Pada tahun 1990, penemu Doug Terry menggunakan algoritme penyaringan kolaboratif untuk menyortir email yang diinginkan dari email sampah. Dengan hanya "menyukai" atau "membenci" sebuah email, berkolaborasi dengan orang lain yang melakukan hal yang sama pada konten email yang serupa, pengguna dapat dengan cepat melatih komputer untuk menentukan apa yang harus didorong ke kotak masuk pengguna-dan apa yang harus diasingkan ke folder email sampah.</p>
<p>Dalam pengertian umum, sistem rekomendasi adalah algoritme yang memberikan saran yang relevan kepada pengguna. Saran dapat berupa film untuk ditonton, buku untuk dibaca, produk untuk dibeli, atau apa pun tergantung pada skenario atau industrinya. Algoritme ini ada di sekitar kita, mempengaruhi konten yang kita konsumsi dan produk yang kita beli dari perusahaan teknologi besar seperti Youtube, Amazon, Netflix, dan masih banyak lagi.</p>
<p>Sistem rekomendasi yang dirancang dengan baik dapat menjadi penghasil pendapatan yang penting, pengurang biaya, dan pembeda yang kompetitif. Berkat teknologi open-source dan biaya komputasi yang menurun, sistem rekomendasi yang disesuaikan tidak pernah semudah ini untuk diakses. Artikel ini menjelaskan cara menggunakan Milvus, sebuah database vektor sumber terbuka; PinSage, sebuah graph convolutional neural network (GCN); deep graph library (DGL), sebuah paket python yang dapat diskalakan untuk deep learning pada grafik; dan dataset MovieLens untuk membangun sebuah sistem rekomendasi berbasis grafik.</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">Bagaimana cara kerja sistem rekomendasi?</a></li>
<li><a href="#tools-for-building-a-recommender-system">Alat untuk membangun sistem rekomendasi</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Membangun sistem rekomendasi berbasis grafik dengan Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">Bagaimana cara kerja sistem rekomendasi?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Ada dua pendekatan umum untuk membangun sistem rekomendasi: pemfilteran kolaboratif dan pemfilteran berbasis konten. Sebagian besar pengembang menggunakan salah satu atau kedua metode tersebut dan, meskipun sistem rekomendasi dapat bervariasi dalam hal kompleksitas dan konstruksi, sistem ini biasanya mencakup tiga elemen inti:</p>
<ol>
<li><strong>Model pengguna:</strong> Sistem rekomendasi membutuhkan pemodelan karakteristik, preferensi, dan kebutuhan pengguna. Banyak sistem rekomendasi yang mendasarkan saran mereka pada masukan tingkat item implisit atau eksplisit dari pengguna.</li>
<li><strong>Model objek:</strong> Sistem rekomendasi juga memodelkan objek untuk membuat rekomendasi objek berdasarkan potret pengguna.</li>
<li><strong>Algoritma rekomendasi:</strong> Komponen inti dari setiap sistem rekomendasi adalah algoritme yang menggerakkan rekomendasinya. Algoritme yang umum digunakan termasuk penyaringan kolaboratif, pemodelan semantik implisit, pemodelan berbasis grafik, rekomendasi gabungan, dan banyak lagi.</li>
</ol>
<p>Pada tingkat tinggi, sistem rekomendasi yang mengandalkan penyaringan kolaboratif membangun model dari perilaku pengguna di masa lalu (termasuk input perilaku dari pengguna yang serupa) untuk memprediksi apa yang mungkin diminati pengguna. Sistem yang mengandalkan pemfilteran berbasis konten menggunakan tag terpisah yang sudah ditentukan sebelumnya berdasarkan karakteristik item untuk merekomendasikan item yang serupa.</p>
<p>Contoh pemfilteran kolaboratif adalah stasiun radio yang dipersonalisasi di Spotify yang didasarkan pada riwayat mendengarkan, minat, perpustakaan musik, dan banyak lagi. Stasiun radio ini memutar musik yang tidak disimpan atau diminati oleh pengguna, tetapi sering kali disukai oleh pengguna lain yang memiliki selera yang sama. Contoh pemfilteran berbasis konten adalah stasiun radio berdasarkan lagu atau artis tertentu yang menggunakan atribut input untuk merekomendasikan musik yang serupa.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">Alat untuk membangun sistem pemberi rekomendasi<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam contoh ini, membangun sistem rekomendasi berbasis grafik dari awal bergantung pada alat-alat berikut:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage: Sebuah jaringan konvolusi graf</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a> adalah jaringan konvolusi graf berjalan acak yang mampu mempelajari penyematan untuk simpul-simpul dalam graf berskala web yang berisi miliaran objek. Jaringan ini dikembangkan oleh <a href="https://www.pinterest.com/">Pinterest</a>, sebuah perusahaan pinboard online, untuk menawarkan rekomendasi visual tematik kepada para penggunanya.</p>
<p>Pengguna Pinterest dapat "menyematkan" konten yang menarik minat mereka ke "papan", yang merupakan kumpulan konten yang disematkan. Dengan lebih dari <a href="https://business.pinterest.com/audience/">478 juta</a> pengguna aktif bulanan (MAU) dan lebih dari <a href="https://newsroom.pinterest.com/en/company">240 miliar</a> objek yang disimpan, perusahaan ini memiliki jumlah data pengguna yang sangat besar sehingga mereka harus membangun teknologi baru untuk mengikutinya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSage menggunakan grafik bipartit pin-board untuk menghasilkan embedding berkualitas tinggi dari pin yang digunakan untuk merekomendasikan konten yang mirip secara visual kepada pengguna. Tidak seperti algoritma GCN tradisional, yang melakukan konvolusi pada matriks fitur dan grafik penuh, PinSage mengambil sampel dari node/Pin terdekat dan melakukan konvolusi lokal yang lebih efisien melalui konstruksi dinamis grafik komputasi.</p>
<p>Melakukan konvolusi pada seluruh lingkungan node akan menghasilkan grafik komputasi yang sangat besar. Untuk mengurangi kebutuhan sumber daya, algoritma GCN tradisional memperbarui representasi node dengan menggabungkan informasi dari lingkungan k-hop-nya. PinSage mensimulasikan random-walk untuk menetapkan konten yang sering dikunjungi sebagai lingkungan utama dan kemudian membangun konvolusi berdasarkan hal tersebut.</p>
<p>Karena sering terjadi tumpang tindih dalam lingkungan k-hop, konvolusi lokal pada node menghasilkan komputasi yang berulang. Untuk menghindari hal ini, pada setiap langkah agregat, PinSage memetakan semua node tanpa perhitungan berulang, kemudian menghubungkannya ke node tingkat atas yang sesuai, dan akhirnya mengambil embedding dari node tingkat atas.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Perpustakaan Graf Dalam: Paket python yang dapat diskalakan untuk pembelajaran mendalam pada graf</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-kerangka-pembangunan-kerangka-pembelajaran-berbasis-grafik-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library (DGL)</a> adalah paket Python yang dirancang untuk membangun model jaringan syaraf berbasis graf di atas kerangka kerja deep learning yang sudah ada (misalnya, PyTorch, MXNet, Gluon, dan banyak lagi). DGL mencakup antarmuka backend yang ramah pengguna, sehingga mudah untuk ditanamkan dalam kerangka kerja berdasarkan tensor dan yang mendukung pembuatan otomatis. Algoritma PinSage yang disebutkan di atas dioptimalkan untuk digunakan dengan DGL dan PyTorch.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: Basis data vektor sumber terbuka yang dibuat untuk AI dan pencarian kemiripan</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>bagaimana-cara-kerja-milvus.png</span> </span></p>
<p>Milvus adalah basis data vektor sumber terbuka yang dibuat untuk mendukung pencarian kemiripan vektor dan aplikasi kecerdasan buatan (AI). Pada tingkat tinggi, cara kerja Milvus untuk pencarian kemiripan adalah sebagai berikut:</p>
<ol>
<li>Model pembelajaran mendalam digunakan untuk mengubah data yang tidak terstruktur menjadi vektor fitur, yang diimpor ke Milvus.</li>
<li>Milvus menyimpan dan mengindeks vektor fitur.</li>
<li>Berdasarkan permintaan, Milvus mencari dan mengembalikan vektor yang paling mirip dengan vektor input.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Membangun sistem rekomendasi berbasis grafik dengan Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-membangun-sistem-rekomendasi-berbasis-grafik.png</span> </span></p>
<p>Membangun sistem rekomendasi berbasis grafik dengan Milvus melibatkan langkah-langkah berikut:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">Langkah 1: Mempersiapkan data</h3><p>Prapemrosesan data melibatkan pengubahan data mentah menjadi format yang lebih mudah dimengerti. Contoh ini menggunakan kumpulan data terbuka MovieLens[5] (m1-1m), yang berisi 1.000.000 peringkat dari 4.000 film yang dikontribusikan oleh 6.000 pengguna. Data ini dikumpulkan oleh GroupLens dan mencakup deskripsi film, peringkat film, dan karakteristik pengguna.</p>
<p>Perhatikan bahwa set data MovieLens yang digunakan dalam contoh ini memerlukan pembersihan atau pengaturan data minimal. Namun, jika Anda menggunakan set data yang berbeda, jarak tempuh Anda mungkin berbeda.</p>
<p>Untuk mulai membangun sistem rekomendasi, buatlah grafik bipartit pengguna-film untuk tujuan klasifikasi dengan menggunakan data historis pengguna-film dari set data MovieLens.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">Langkah 2: Latih model dengan PinSage</h3><p>Vektor penyisipan pin yang dihasilkan menggunakan model PinSage adalah vektor fitur dari informasi film yang diperoleh. Buat model PinSage berdasarkan graf bipartit g dan dimensi vektor fitur film yang disesuaikan (256-d secara default). Kemudian, latih model tersebut dengan PyTorch untuk mendapatkan h_item embeddings dari 4.000 film.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">Langkah 3: Memuat data</h3><p>Muatkan h_item embeddings film yang dihasilkan oleh model PinSage ke dalam Milvus, yang akan mengembalikan ID yang sesuai. Impor ID dan informasi film yang sesuai ke dalam MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">Langkah 4: Lakukan pencarian kesamaan vektor</h3><p>Dapatkan embedding yang sesuai di Milvus berdasarkan ID film, lalu gunakan Milvus untuk menjalankan pencarian kemiripan dengan embedding ini. Selanjutnya, identifikasi informasi film yang sesuai dalam database MySQL.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">Langkah 5: Dapatkan rekomendasi</h3><p>Sistem sekarang akan merekomendasikan film yang paling mirip dengan kueri penelusuran pengguna. Ini adalah alur kerja umum untuk membangun sistem rekomendasi. Untuk menguji dan menggunakan sistem rekomendasi dan aplikasi AI lainnya dengan cepat, cobalah <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> Milvus.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus dapat memberi daya lebih dari sekadar sistem rekomendasi<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus adalah alat canggih yang mampu mendukung beragam kecerdasan buatan dan aplikasi pencarian kemiripan vektor. Untuk mempelajari lebih lanjut tentang proyek ini, lihat sumber-sumber berikut:</p>
<ul>
<li>Baca <a href="https://zilliz.com/blog">blog</a> kami.</li>
<li>Berinteraksi dengan komunitas sumber terbuka kami di <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Gunakan atau kontribusikan ke basis data vektor paling populer di dunia di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
</ul>
