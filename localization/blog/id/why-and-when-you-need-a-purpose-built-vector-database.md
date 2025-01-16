---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: Mengapa dan Kapan Anda Membutuhkan Basis Data Vektor yang Dibangun Khusus?
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  Artikel ini memberikan gambaran umum tentang pencarian vektor dan fungsinya,
  membandingkan berbagai teknologi pencarian vektor, dan menjelaskan mengapa
  memilih basis data vektor yang dibangun khusus sangat penting.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Artikel ini awalnya diterbitkan di <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a> dan diposting ulang di sini dengan izin.</em></p>
<p>Meningkatnya popularitas <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> dan model bahasa besar (LLM) lainnya telah mendorong munculnya teknologi pencarian vektor, termasuk basis data vektor yang dibuat khusus seperti <a href="https://milvus.io/docs/overview.md">Milvus</a> dan <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, perpustakaan pencarian vektor seperti <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, dan plugin pencarian vektor yang diintegrasikan dengan basis data tradisional. Namun, memilih solusi terbaik untuk kebutuhan Anda bisa jadi merupakan hal yang menantang. Seperti memilih antara restoran kelas atas dan restoran cepat saji, memilih teknologi pencarian vektor yang tepat tergantung pada kebutuhan dan harapan Anda.</p>
<p>Dalam tulisan ini, saya akan memberikan gambaran umum tentang pencarian vektor dan fungsinya, membandingkan berbagai teknologi pencarian vektor, dan menjelaskan mengapa memilih database vektor yang dibuat khusus sangat penting.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">Apa itu pencarian vektor, dan bagaimana cara kerjanya?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/vector-similarity-search">Pencarian vektor</a>, juga dikenal sebagai pencarian kemiripan vektor, adalah teknik untuk mengambil k hasil teratas yang paling mirip atau secara semantik terkait dengan vektor kueri yang diberikan di antara kumpulan data vektor yang padat.</p>
<p>Sebelum melakukan pencarian kemiripan, kami memanfaatkan jaringan syaraf untuk mengubah <a href="https://zilliz.com/blog/introduction-to-unstructured-data">data yang tidak terstruktur</a>, seperti teks, gambar, video, dan audio, menjadi vektor numerik berdimensi tinggi yang disebut vektor penyisipan. Sebagai contoh, kita dapat menggunakan jaringan saraf convolutional ResNet-50 yang telah dilatih sebelumnya untuk mengubah gambar burung menjadi kumpulan embedding dengan 2.048 dimensi. Di sini, kami mencantumkan tiga elemen vektor pertama dan tiga elemen vektor terakhir: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Gambar burung oleh Patrice Bouchard</span> </span></p>
<p>Setelah menghasilkan vektor penyematan, mesin pencari vektor membandingkan jarak spasial antara vektor kueri masukan dengan vektor dalam penyimpanan vektor. Semakin dekat jaraknya dalam ruang, semakin mirip keduanya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>Menanamkan aritmatika</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">Teknologi pencarian vektor yang populer<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Beberapa teknologi pencarian vektor tersedia di pasaran, termasuk pustaka pembelajaran mesin seperti NumPy dari Python, pustaka pencarian vektor seperti FAISS, plugin pencarian vektor yang dibangun di atas basis data tradisional, dan basis data vektor khusus seperti Milvus dan Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">Pustaka pembelajaran mesin</h3><p>Menggunakan pustaka pembelajaran mesin adalah cara termudah untuk mengimplementasikan pencarian vektor. Sebagai contoh, kita bisa menggunakan NumPy dari Python untuk mengimplementasikan algoritma tetangga terdekat dalam waktu kurang dari 20 baris kode.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>Kita dapat menghasilkan 100 vektor dua dimensi dan menemukan tetangga terdekat dari vektor [0,5, 0,5].</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>Pustaka pembelajaran mesin, seperti NumPy dari Python, menawarkan fleksibilitas yang tinggi dengan biaya yang rendah. Namun, mereka memiliki beberapa keterbatasan. Misalnya, mereka hanya dapat menangani sejumlah kecil data dan tidak memastikan persistensi data.</p>
<p>Saya hanya merekomendasikan penggunaan NumPy atau pustaka pembelajaran mesin lainnya untuk pencarian vektor ketika:</p>
<ul>
<li>Anda membutuhkan pembuatan prototipe yang cepat.</li>
<li>Anda tidak peduli dengan persistensi data.</li>
<li>Ukuran data Anda di bawah satu juta, dan Anda tidak memerlukan pemfilteran skalar.</li>
<li>Anda tidak membutuhkan kinerja tinggi.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">Pustaka pencarian vektor</h3><p>Pustaka pencarian vektor dapat membantu Anda dengan cepat membangun prototipe sistem pencarian vektor berkinerja tinggi. FAISS adalah contohnya. Ini adalah sumber terbuka dan dikembangkan oleh Meta untuk pencarian kemiripan yang efisien dan pengelompokan vektor yang padat. FAISS dapat menangani koleksi vektor dengan berbagai ukuran, bahkan yang tidak dapat dimuat sepenuhnya ke dalam memori. Selain itu, FAISS menawarkan alat untuk evaluasi dan penyetelan parameter. Meskipun ditulis dalam bahasa C++, FAISS menyediakan antarmuka Python/NumPy.</p>
<p>Di bawah ini adalah kode untuk contoh pencarian vektor berdasarkan FAISS:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>Pustaka pencarian vektor seperti FAISS mudah digunakan dan cukup cepat untuk menangani lingkungan produksi skala kecil dengan jutaan vektor. Anda dapat meningkatkan kinerja kueri mereka dengan memanfaatkan kuantisasi dan GPU serta mengurangi dimensi data.</p>
<p>Namun, pustaka ini memiliki beberapa keterbatasan ketika digunakan dalam produksi. Misalnya, FAISS tidak mendukung penambahan dan penghapusan data secara real-time, panggilan jarak jauh, berbagai bahasa, pemfilteran skalar, skalabilitas, atau pemulihan bencana.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">Berbagai jenis basis data vektor</h3><p>Basis data vektor telah muncul untuk mengatasi keterbatasan pustaka di atas, memberikan solusi yang lebih komprehensif dan praktis untuk aplikasi produksi.</p>
<p>Empat jenis database vektor tersedia di medan perang:</p>
<ul>
<li>Database relasional atau kolom yang sudah ada yang menggabungkan plugin pencarian vektor. PG Vector adalah salah satu contohnya.</li>
<li>Mesin pencari indeks terbalik tradisional dengan dukungan untuk pengindeksan vektor yang padat. <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a> adalah salah satu contohnya.</li>
<li>Basis data vektor ringan yang dibangun di atas pustaka pencarian vektor. Chroma adalah sebuah contoh.</li>
<li><strong>Basis data vektor</strong> yang<strong>dibuat khusus.</strong> Jenis basis data ini dirancang khusus dan dioptimalkan untuk pencarian vektor dari bawah ke atas. Basis data vektor yang dibuat khusus biasanya menawarkan fitur yang lebih canggih, termasuk komputasi terdistribusi, pemulihan bencana, dan persistensi data. <a href="https://zilliz.com/what-is-milvus">Milvus</a> adalah contoh utamanya.</li>
</ul>
<p>Tidak semua basis data vektor dibuat sama. Setiap tumpukan memiliki keunggulan dan keterbatasan yang unik, sehingga kurang lebih cocok untuk aplikasi yang berbeda.</p>
<p>Saya lebih memilih database vektor khusus daripada solusi lain karena merupakan pilihan yang paling efisien dan nyaman, menawarkan banyak manfaat unik. Pada bagian berikut ini, saya akan menggunakan Milvus sebagai contoh untuk menjelaskan alasan preferensi saya.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">Manfaat utama dari basis data vektor yang dibuat khusus<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka, terdistribusi, dan dibuat khusus yang dapat menyimpan, mengindeks, mengelola, dan mengambil miliaran vektor penyisipan. Milvus juga merupakan salah satu basis data vektor yang paling populer untuk <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">pengambilan LLM</a> yang <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">ditingkatkan</a>. Sebagai contoh database vektor yang dibuat khusus, Milvus memiliki banyak keunggulan unik dibandingkan database vektor lainnya.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">Persistensi Data dan Penyimpanan Hemat Biaya</h3><p>Meskipun mencegah kehilangan data adalah persyaratan minimum untuk sebuah database, banyak database vektor dengan mesin tunggal dan ringan tidak memprioritaskan keandalan data. Sebaliknya, database vektor terdistribusi yang dibuat khusus seperti <a href="https://zilliz.com/what-is-milvus">Milvus</a> memprioritaskan ketahanan sistem, skalabilitas, dan persistensi data dengan memisahkan penyimpanan dan komputasi.</p>
<p>Selain itu, sebagian besar basis data vektor yang menggunakan indeks perkiraan tetangga terdekat (ANN) membutuhkan banyak memori untuk melakukan pencarian vektor, karena mereka memuat indeks ANN murni ke dalam memori. Namun, Milvus mendukung indeks disk, membuat penyimpanan lebih dari sepuluh kali lebih hemat biaya daripada indeks dalam memori.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">Performa Kueri yang Optimal</h3><p>Basis data vektor khusus memberikan kinerja kueri yang optimal dibandingkan dengan opsi pencarian vektor lainnya. Sebagai contoh, Milvus sepuluh kali lebih cepat dalam menangani kueri dibandingkan plugin pencarian vektor. Milvus menggunakan <a href="https://zilliz.com/glossary/anns">algoritma ANN</a> dan bukan algoritma pencarian brutal KNN untuk pencarian vektor yang lebih cepat. Selain itu, Milvus memecah indeksnya, mengurangi waktu yang dibutuhkan untuk membangun indeks seiring dengan meningkatnya volume data. Pendekatan ini memungkinkan Milvus untuk dengan mudah menangani miliaran vektor dengan penambahan dan penghapusan data secara real-time. Sebaliknya, add-on pencarian vektor lainnya hanya cocok untuk skenario dengan jumlah data kurang dari puluhan juta dan penambahan serta penghapusan data yang jarang terjadi.</p>
<p>Milvus juga mendukung akselerasi GPU. Pengujian internal menunjukkan bahwa pengindeksan vektor yang dipercepat dengan GPU dapat mencapai 10.000+ QPS saat mencari puluhan juta data, yang setidaknya sepuluh kali lebih cepat daripada pengindeksan CPU tradisional untuk kinerja kueri mesin tunggal.</p>
<h3 id="System-Reliability" class="common-anchor-header">Keandalan Sistem</h3><p>Banyak aplikasi menggunakan basis data vektor untuk kueri online yang membutuhkan latensi kueri rendah dan throughput tinggi. Aplikasi-aplikasi ini menuntut failover mesin tunggal pada tingkat menit, dan beberapa bahkan memerlukan pemulihan bencana lintas wilayah untuk skenario kritis. Strategi replikasi tradisional berdasarkan Raft/Paxos mengalami pemborosan sumber daya yang serius dan membutuhkan bantuan untuk memecah data, yang menyebabkan keandalan yang buruk. Sebaliknya, Milvus memiliki arsitektur terdistribusi yang memanfaatkan antrean pesan K8 untuk ketersediaan tinggi, mengurangi waktu pemulihan dan menghemat sumber daya.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">Operabilitas dan Pengamatan</h3><p>Untuk melayani pengguna perusahaan dengan lebih baik, basis data vektor harus menawarkan berbagai fitur tingkat perusahaan untuk operabilitas dan pengamatan yang lebih baik. Milvus mendukung berbagai metode penerapan, termasuk K8s Operator dan Helm chart, docker-compose, dan instalasi pip, sehingga dapat diakses oleh pengguna dengan kebutuhan yang berbeda. Milvus juga menyediakan sistem pemantauan dan alarm berdasarkan Grafana, Prometheus, dan Loki, yang meningkatkan kemampuan observabilitasnya. Dengan arsitektur cloud-native terdistribusi, Milvus merupakan database vektor pertama di industri yang mendukung isolasi multi-tenant, RBAC, pembatasan kuota, dan peningkatan bergulir. Semua pendekatan ini membuat pengelolaan dan pemantauan Milvus menjadi lebih sederhana.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Memulai dengan Milvus dalam 3 langkah sederhana dalam waktu 10 menit<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Membangun basis data vektor adalah tugas yang rumit, tetapi menggunakannya semudah menggunakan Numpy dan FAISS. Bahkan siswa yang tidak terbiasa dengan AI dapat mengimplementasikan pencarian vektor berdasarkan Milvus hanya dalam waktu sepuluh menit. Untuk merasakan layanan pencarian vektor yang sangat skalabel dan berkinerja tinggi, ikuti tiga langkah berikut:</p>
<ul>
<li>Menerapkan Milvus di server Anda dengan bantuan <a href="https://milvus.io/docs/install_standalone-docker.md">dokumen penerapan Milvus</a>.</li>
<li>Menerapkan pencarian vektor hanya dengan 50 baris kode dengan merujuk pada <a href="https://milvus.io/docs/example_code.md">dokumen Hello Milvus</a>.</li>
<li>Jelajahi <a href="https://github.com/towhee-io/examples/">contoh dokumen Towhee</a> untuk mendapatkan wawasan tentang <a href="https://zilliz.com/use-cases">kasus penggunaan database vektor</a> yang populer <a href="https://zilliz.com/use-cases">.</a></li>
</ul>
