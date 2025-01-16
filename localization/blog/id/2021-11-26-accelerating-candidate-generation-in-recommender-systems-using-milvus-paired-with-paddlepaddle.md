---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: >-
  Mempercepat Pembangkitan Kandidat dalam Sistem Rekomendasi Menggunakan Milvus
  yang dipasangkan dengan PaddlePaddle
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: alur kerja minimal dari sistem pemberi rekomendasi
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>Jika Anda memiliki pengalaman dalam mengembangkan sistem rekomendasi, Anda mungkin pernah menjadi korban dari setidaknya salah satu hal berikut ini:</p>
<ul>
<li>Sistem sangat lambat saat mengembalikan hasil karena jumlah kumpulan data yang sangat banyak.</li>
<li>Data yang baru dimasukkan tidak dapat diproses secara real time untuk pencarian atau kueri.</li>
<li>Penerapan sistem pemberi rekomendasi adalah hal yang menakutkan.</li>
</ul>
<p>Artikel ini bertujuan untuk mengatasi masalah yang disebutkan di atas dan memberikan beberapa wawasan untuk Anda dengan memperkenalkan proyek sistem rekomendasi produk yang menggunakan Milvus, database vektor sumber terbuka, yang dipasangkan dengan PaddlePaddle, sebuah platform pembelajaran mendalam.</p>
<p>Artikel ini akan menjelaskan secara singkat alur kerja minimal dari sistem rekomendasi. Kemudian dilanjutkan dengan memperkenalkan komponen-komponen utama dan detail implementasi proyek ini.</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">Alur kerja dasar dari sebuah sistem pemberi rekomendasi<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum masuk lebih jauh ke dalam proyek itu sendiri, pertama-tama mari kita lihat alur kerja dasar dari sistem rekomendasi. Sistem rekomendasi dapat memberikan hasil yang dipersonalisasi sesuai dengan minat dan kebutuhan pengguna yang unik. Untuk membuat rekomendasi yang dipersonalisasi, sistem melewati dua tahap, yaitu pembuatan kandidat dan pemeringkatan.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Tahap pertama adalah pembuatan kandidat, yang mengembalikan data yang paling relevan atau serupa, seperti produk atau video yang sesuai dengan profil pengguna. Selama pembuatan kandidat, sistem membandingkan sifat pengguna dengan data yang tersimpan di database, dan mengambil data yang mirip. Kemudian selama pemeringkatan, sistem menilai dan menyusun ulang data yang diambil. Akhirnya, hasil yang berada di bagian atas daftar ditampilkan kepada pengguna.</p>
<p>Dalam kasus sistem rekomendasi produk kami, pertama-tama sistem membandingkan profil pengguna dengan karakteristik produk dalam inventaris untuk menyaring daftar produk yang sesuai dengan kebutuhan pengguna. Kemudian sistem menilai produk berdasarkan kemiripannya dengan profil pengguna, memberi peringkat, dan akhirnya mengembalikan 10 produk teratas kepada pengguna.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">Arsitektur sistem<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Sistem rekomendasi produk dalam proyek ini menggunakan tiga komponen: MIND, PaddleRec, dan Milvus.</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a>, kependekan dari &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall&quot;, adalah sebuah algoritma yang dikembangkan oleh Alibaba Group. Sebelum MIND diusulkan, sebagian besar model AI yang lazim untuk rekomendasi menggunakan vektor tunggal untuk mewakili beragam minat pengguna. Namun, satu vektor saja tidak cukup untuk merepresentasikan minat pengguna secara tepat. Oleh karena itu, algoritma MIND diusulkan untuk mengubah berbagai minat pengguna menjadi beberapa vektor.</p>
<p>Secara khusus, MIND mengadopsi <a href="https://arxiv.org/pdf/2005.09347">jaringan multi-minat</a> dengan perutean dinamis untuk memproses beberapa minat dari satu pengguna selama tahap pembuatan kandidat. Jaringan multi-minat adalah lapisan ekstraktor multi-minat yang dibangun di atas mekanisme perutean kapsul. Jaringan ini dapat digunakan untuk menggabungkan perilaku pengguna di masa lalu dengan berbagai minatnya, untuk memberikan profil pengguna yang akurat.</p>
<p>Diagram berikut menggambarkan struktur jaringan MIND.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>Untuk merepresentasikan sifat pengguna, MIND mengambil perilaku pengguna dan minat pengguna sebagai input, dan kemudian memasukkannya ke dalam lapisan embedding untuk menghasilkan vektor pengguna, termasuk vektor minat pengguna dan vektor perilaku pengguna. Kemudian vektor perilaku pengguna dimasukkan ke dalam lapisan ekstraktor multi-minat untuk menghasilkan kapsul minat pengguna. Setelah menggabungkan kapsul minat pengguna dengan penyematan perilaku pengguna dan menggunakan beberapa lapisan ReLU untuk mengubahnya, MIND mengeluarkan beberapa vektor representasi pengguna. Proyek ini telah menetapkan bahwa MIND pada akhirnya akan menghasilkan empat vektor representasi pengguna.</p>
<p>Di sisi lain, ciri-ciri produk melewati lapisan penyematan dan diubah menjadi vektor item yang jarang. Kemudian setiap vektor item melewati pooling layer untuk menjadi vektor padat.</p>
<p>Ketika semua data diubah menjadi vektor, sebuah lapisan perhatian ekstra yang sadar label diperkenalkan untuk memandu proses pelatihan.</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a> adalah pustaka model pencarian berskala besar untuk rekomendasi. Ini adalah bagian dari ekosistem Baidu <a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>. PaddleRec bertujuan untuk memberikan solusi terintegrasi kepada para pengembang untuk membangun sistem rekomendasi dengan cara yang mudah dan cepat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Seperti yang telah disebutkan di paragraf pembuka, para insinyur yang mengembangkan sistem rekomendasi sering kali harus menghadapi tantangan berupa kegunaan yang buruk dan penyebaran sistem yang rumit. Namun, PaddleRec dapat membantu para pengembang dalam beberapa aspek berikut:</p>
<ul>
<li><p>Kemudahan penggunaan: PaddleRec adalah pustaka sumber terbuka yang merangkum berbagai model populer di industri ini, termasuk model untuk pembuatan kandidat, pemeringkatan, pemeringkatan ulang, multitasking, dan banyak lagi. Dengan PaddleRec, Anda dapat langsung menguji keefektifan model dan meningkatkan efisiensinya melalui iterasi. PaddleRec menawarkan cara mudah untuk melatih model untuk sistem terdistribusi dengan kinerja yang sangat baik. Ini dioptimalkan untuk pemrosesan data skala besar dari vektor yang jarang. Anda dapat dengan mudah menskalakan PaddleRec secara horizontal dan mempercepat kecepatan komputasinya. Oleh karena itu, Anda dapat dengan cepat membangun lingkungan pelatihan di Kubernetes menggunakan PaddleRec.</p></li>
<li><p>Dukungan untuk penyebaran: PaddleRec menyediakan solusi penerapan online untuk model-modelnya. Model-modelnya segera siap digunakan setelah pelatihan, menampilkan fleksibilitas dan ketersediaan yang tinggi.</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> adalah basis data vektor yang menampilkan arsitektur cloud-native. Milvus bersumber terbuka di <a href="https://github.com/milvus-io">GitHub</a> dan dapat digunakan untuk menyimpan, mengindeks, dan mengelola vektor penyematan besar-besaran yang dihasilkan oleh jaringan syaraf tiruan dan model pembelajaran mesin (ML) lainnya. Milvus merangkum beberapa pustaka pencarian perkiraan tetangga terdekat (ANN) kelas satu termasuk Faiss, NMSLIB, dan Annoy. Anda juga dapat mengembangkan Milvus sesuai dengan kebutuhan Anda. Layanan Milvus sangat tersedia dan mendukung pemrosesan batch dan stream terpadu. Milvus berkomitmen untuk menyederhanakan proses pengelolaan data yang tidak terstruktur dan memberikan pengalaman pengguna yang konsisten dalam lingkungan penerapan yang berbeda. Milvus memiliki fitur-fitur berikut:</p>
<ul>
<li><p>Performa tinggi saat melakukan pencarian vektor pada kumpulan data yang sangat besar.</p></li>
<li><p>Komunitas yang mengutamakan pengembang yang menawarkan dukungan multi-bahasa dan toolchain.</p></li>
<li><p>Skalabilitas cloud dan keandalan yang tinggi bahkan saat terjadi gangguan.</p></li>
<li><p>Pencarian hibrida yang dicapai dengan memasangkan pemfilteran skalar dengan pencarian kemiripan vektor.</p></li>
</ul>
<p>Milvus digunakan untuk pencarian kemiripan vektor dan manajemen vektor dalam proyek ini karena dapat menyelesaikan masalah pembaruan data yang sering terjadi dengan tetap menjaga stabilitas sistem.</p>
<h2 id="System-implementation" class="common-anchor-header">Implementasi sistem<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk membangun sistem rekomendasi produk pada proyek ini, perlu dilakukan beberapa langkah berikut:</p>
<ol>
<li>Pengolahan data</li>
<li>Pelatihan model</li>
<li>Pengujian model</li>
<li>Menghasilkan kandidat item produk<ol>
<li>Penyimpanan data: vektor item diperoleh melalui model yang telah dilatih dan disimpan di Milvus.</li>
<li>Pencarian data: empat vektor pengguna yang dihasilkan oleh MIND dimasukkan ke dalam Milvus untuk pencarian kemiripan vektor.</li>
<li>Pemeringkatan data: masing-masing dari empat vektor memiliki <code translate="no">top_k</code> vektor item yang mirip, dan empat set vektor <code translate="no">top_k</code> diberi peringkat untuk menghasilkan daftar akhir <code translate="no">top_k</code> vektor yang paling mirip.</li>
</ol></li>
</ol>
<p>Kode sumber proyek ini dihosting di platform <a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">Baidu AI Studio</a>. Bagian berikut ini adalah penjelasan rinci tentang kode sumber untuk proyek ini.</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">Langkah 1. Pemrosesan data</h3><p>Dataset asli berasal dari dataset buku Amazon yang disediakan oleh <a href="https://github.com/THUDM/ComiRec">ComiRec</a>. Namun, proyek ini menggunakan data yang diunduh dan diproses oleh PaddleRec. Lihat <a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">dataset AmazonBook</a> di proyek PaddleRec untuk informasi lebih lanjut.</p>
<p>Dataset untuk pelatihan diharapkan muncul dalam format berikut, dengan setiap kolom mewakili:</p>
<ul>
<li><code translate="no">Uid</code>: Identitas pengguna.</li>
<li><code translate="no">item_id</code>: ID item produk yang telah diklik oleh pengguna.</li>
<li><code translate="no">Time</code>: Stempel waktu atau urutan klik.</li>
</ul>
<p>Dataset untuk pengujian diharapkan muncul dalam format berikut, dengan setiap kolom mewakili:</p>
<ul>
<li><p><code translate="no">Uid</code>: Identitas pengguna.</p></li>
<li><p><code translate="no">hist_item</code>: ID item produk dalam perilaku klik pengguna historis. Jika ada beberapa <code translate="no">hist_item</code>, maka akan diurutkan berdasarkan stempel waktu.</p></li>
<li><p><code translate="no">eval_item</code>: Urutan aktual saat pengguna mengklik produk.</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">Langkah 2. Pelatihan model</h3><p>Pelatihan model menggunakan data yang telah diproses pada langkah sebelumnya dan mengadopsi model pembuatan kandidat, MIND, yang dibangun di atas PaddleRec.</p>
<h4 id="1-Model-input" class="common-anchor-header">1. Langkah 3. <strong>Masukan</strong> <strong>model</strong> </h4><p>Di <code translate="no">dygraph_model.py</code>, jalankan kode berikut ini untuk memproses data dan mengubahnya menjadi input model. Proses ini mengurutkan item yang diklik oleh pengguna yang sama dalam data asli sesuai dengan cap waktu, dan menggabungkannya untuk membentuk sebuah urutan. Kemudian, pilih secara acak <code translate="no">item``_``id</code> dari urutan tersebut sebagai <code translate="no">target_item</code>, dan ekstrak 10 item sebelum <code translate="no">target_item</code> sebagai <code translate="no">hist_item</code> untuk input model. Jika urutan tidak cukup panjang, maka dapat ditetapkan sebagai 0. <code translate="no">seq_len</code> haruslah panjang sebenarnya dari urutan <code translate="no">hist_item</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>Lihat skrip <code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> untuk kode pembacaan dataset asli.</p>
<h4 id="2-Model-networking" class="common-anchor-header">2. <strong>Model jaringan</strong></h4><p>Kode berikut ini adalah ekstrak dari <code translate="no">net.py</code>. <code translate="no">class Mind_Capsual_Layer</code> mendefinisikan lapisan ekstraktor multi-bunga yang dibangun di atas mekanisme perutean kapsul bunga. Fungsi <code translate="no">label_aware_attention()</code> mengimplementasikan teknik perhatian sadar-label dalam algoritma MIND. Fungsi <code translate="no">forward()</code> dalam <code translate="no">class MindLayer</code> memodelkan karakteristik pengguna dan menghasilkan vektor bobot yang sesuai.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>Lihat skrip <code translate="no">/home/aistudio/recommend/model/mind/net.py</code> untuk struktur jaringan spesifik MIND.</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3. <strong>Pengoptimalan model</strong></h4><p>Proyek ini menggunakan <a href="https://arxiv.org/pdf/1412.6980">algoritma Adam</a> sebagai pengoptimal model.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>Selain itu, PaddleRec menulis hyperparameter di <code translate="no">config.yaml</code>, jadi Anda hanya perlu memodifikasi file ini untuk melihat perbandingan yang jelas antara keefektifan kedua model untuk meningkatkan efisiensi model. Ketika melatih model, efek model yang buruk dapat diakibatkan oleh model yang kurang pas atau terlalu pas. Oleh karena itu, Anda dapat memperbaikinya dengan memodifikasi jumlah putaran pelatihan. Dalam proyek ini, Anda hanya perlu mengubah parameter epochs di <code translate="no">config.yaml</code> untuk menemukan jumlah putaran pelatihan yang tepat. Selain itu, Anda juga dapat mengubah pengoptimal model, <code translate="no">optimizer.class</code>, atau <code translate="no">learning_rate</code> untuk debugging. Berikut ini menunjukkan bagian dari parameter di <code translate="no">config.yaml</code>.</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>Lihat skrip <code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> untuk implementasi yang lebih rinci.</p>
<h4 id="4-Model-training" class="common-anchor-header">4. <strong>Pelatihan model</strong></h4><p>Jalankan perintah berikut untuk memulai pelatihan model.</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Lihat <code translate="no">/home/aistudio/recommend/model/trainer.py</code> untuk proyek pelatihan model.</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">Langkah 3. Pengujian model</h3><p>Langkah ini menggunakan dataset pengujian untuk memverifikasi performa, seperti tingkat recall dari model yang telah dilatih.</p>
<p>Selama pengujian model, semua vektor item dimuat dari model, lalu diimpor ke Milvus, basis data vektor sumber terbuka. Baca dataset pengujian melalui skrip <code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code>. Muat model pada langkah sebelumnya, dan masukkan dataset pengujian ke dalam model untuk mendapatkan empat vektor minat pengguna. Cari 50 vektor item yang paling mirip dengan empat vektor minat di Milvus. Anda dapat merekomendasikan hasil yang dikembalikan kepada pengguna.</p>
<p>Jalankan perintah berikut untuk menguji model.</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>Selama pengujian model, sistem menyediakan beberapa indikator untuk mengevaluasi keefektifan model, seperti Recall@50, NDCG@50, dan HitRate@50. Artikel ini hanya memperkenalkan modifikasi satu parameter. Namun, dalam skenario aplikasi Anda sendiri, Anda perlu melatih lebih banyak epoch untuk mendapatkan efek model yang lebih baik.  Anda juga dapat meningkatkan efektivitas model dengan menggunakan pengoptimal yang berbeda, mengatur tingkat pembelajaran yang berbeda, dan meningkatkan jumlah putaran pengujian. Anda disarankan untuk menyimpan beberapa model dengan efek yang berbeda, dan kemudian memilih salah satu yang memiliki kinerja terbaik dan paling sesuai dengan aplikasi Anda.</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">Langkah 4. Membuat kandidat item produk</h3><p>Untuk membangun layanan pembuatan kandidat produk, proyek ini menggunakan model terlatih pada langkah sebelumnya, dipasangkan dengan Milvus. Selama pembuatan kandidat, FASTAPI digunakan untuk menyediakan antarmuka. Ketika layanan dimulai, Anda dapat langsung menjalankan perintah di terminal melalui <code translate="no">curl</code>.</p>
<p>Jalankan perintah berikut untuk menghasilkan kandidat awal.</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>Layanan ini menyediakan empat jenis antarmuka:</p>
<ul>
<li><strong>Memasukkan</strong>: Jalankan perintah berikut untuk membaca vektor item dari model Anda dan menyisipkannya ke dalam koleksi di Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Menghasilkan kandidat awal</strong>: Masukkan urutan produk yang diklik oleh pengguna, dan cari tahu produk berikutnya yang mungkin diklik oleh pengguna. Anda juga dapat membuat kandidat item produk dalam kelompok untuk beberapa pengguna sekaligus. <code translate="no">hist_item</code> pada perintah berikut adalah vektor dua dimensi, dan setiap baris mewakili urutan produk yang telah diklik oleh pengguna di masa lalu. Anda dapat menentukan panjang urutan. Hasil yang dikembalikan juga merupakan kumpulan vektor dua dimensi, setiap baris mewakili <code translate="no">item id</code>yang dikembalikan untuk pengguna.</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Menanyakan<strong>jumlah total</strong> <strong>item produk</strong>: Jalankan perintah berikut untuk mengembalikan jumlah total vektor item yang tersimpan dalam database Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Menghapus</strong>: Jalankan perintah berikut untuk menghapus semua data yang tersimpan dalam database Milvus.</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Jika Anda menjalankan layanan pembuatan kandidat di server lokal Anda, Anda juga dapat mengakses antarmuka di atas di <code translate="no">127.0.0.1:8000/docs</code>. Anda dapat bermain-main dengan mengklik empat antarmuka dan memasukkan nilai untuk parameter. Kemudian klik "Cobalah" untuk mendapatkan hasil rekomendasi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">Rekap<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Artikel ini terutama berfokus pada tahap pertama pembuatan kandidat dalam membangun sistem rekomendasi. Artikel ini juga memberikan solusi untuk mempercepat proses ini dengan menggabungkan Milvus dengan algoritma MIND dan PaddleRec dan oleh karena itu telah mengatasi masalah yang diajukan di paragraf pembuka.</p>
<p>Bagaimana jika sistem sangat lambat saat mengembalikan hasil karena jumlah dataset yang sangat banyak? Milvus, basis data vektor sumber terbuka, dirancang untuk pencarian kemiripan yang sangat cepat pada kumpulan data vektor yang padat yang berisi jutaan, miliaran, atau bahkan triliunan vektor.</p>
<p>Bagaimana jika data yang baru dimasukkan tidak dapat diproses secara real time untuk pencarian atau kueri? Anda dapat menggunakan Milvus karena mendukung pemrosesan batch dan stream terpadu dan memungkinkan Anda untuk mencari dan menanyakan data yang baru dimasukkan secara real time. Selain itu, model MIND mampu mengubah perilaku pengguna baru secara real-time dan memasukkan vektor pengguna ke dalam Milvus secara instan.</p>
<p>Bagaimana jika penerapan yang rumit terlalu mengintimidasi? PaddleRec, sebuah library yang kuat yang merupakan bagian dari ekosistem PaddlePaddle, dapat memberi Anda solusi terintegrasi untuk menerapkan sistem rekomendasi atau aplikasi lain dengan cara yang mudah dan cepat.</p>
<h2 id="About-the-author" class="common-anchor-header">Tentang penulis<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Yunmei Li, Zilliz Data Engineer, lulus dari Universitas Sains dan Teknologi Huazhong dengan gelar di bidang ilmu komputer. Sejak bergabung dengan Zilliz, ia telah bekerja mengeksplorasi solusi untuk proyek open source Milvus dan membantu pengguna untuk menerapkan Milvus dalam skenario dunia nyata. Fokus utamanya adalah pada NLP dan sistem rekomendasi, dan ia ingin lebih memperdalam fokusnya di dua bidang ini. Dia suka menghabiskan waktu sendirian dan membaca.</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Mencari lebih banyak sumber daya?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>Lebih banyak kasus pengguna dalam membangun sistem rekomendasi:<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">Membangun Sistem Rekomendasi Produk yang Dipersonalisasi dengan Vipshop dengan Milvus</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">Membangun Aplikasi Perencanaan Lemari Pakaian dan Pakaian dengan Milvus</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">Membangun Sistem Rekomendasi Berita Cerdas di Dalam Aplikasi Berita Sohu</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">Pemfilteran Kolaboratif Berbasis Item untuk Sistem Rekomendasi Musik</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">Membuat dengan Milvus: Rekomendasi Berita yang Didukung AI di Dalam Peramban Seluler Xiaomi</a></li>
</ul></li>
<li>Lebih banyak proyek Milvus yang berkolaborasi dengan komunitas lain:<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">Menggabungkan Model AI untuk Pencarian Gambar Menggunakan ONNX dan Milvus</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">Membangun Sistem Rekomendasi Berbasis Graf dengan Dataset Milvus, PinSage, DGL, dan Movielens</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">Membangun Cluster Milvus Berdasarkan JuiceFS</a></li>
</ul></li>
<li>Bergabunglah dengan komunitas sumber terbuka kami:<ul>
<li>Temukan atau berkontribusi ke Milvus di <a href="https://bit.ly/307b7jC">GitHub</a></li>
<li>Berinteraksi dengan komunitas melalui <a href="https://bit.ly/3qiyTEk">Forum</a></li>
<li>Terhubung dengan kami di <a href="https://bit.ly/3ob7kd8">Twitter</a></li>
</ul></li>
</ul>
