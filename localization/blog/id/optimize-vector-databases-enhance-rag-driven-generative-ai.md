---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: 'Mengoptimalkan Basis Data Vektor, Meningkatkan AI Generatif Berbasis RAG'
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  Dalam artikel ini, Anda akan mempelajari lebih lanjut tentang database vektor
  dan kerangka kerja pembandingannya, set data untuk menangani berbagai aspek,
  dan alat yang digunakan untuk analisis kinerja - semua yang Anda perlukan
  untuk mulai mengoptimalkan database vektor.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>Artikel ini awalnya dipublikasikan di <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">Medium Channel Intel</a> dan diposting ulang di sini dengan izin.</em></p>
<p><br></p>
<p>Dua metode untuk mengoptimalkan basis data vektor Anda saat menggunakan RAG</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Foto oleh <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a> di <a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>Oleh Cathy Zhang dan Dr: Lin Yang dan Changyan Liu</p>
<p>Model AI Generatif (GenAI), yang mengalami adopsi eksponensial dalam kehidupan kita sehari-hari, ditingkatkan dengan <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">retrieval-augmented generation (RAG)</a>, sebuah teknik yang digunakan untuk meningkatkan akurasi dan keandalan respons dengan mengambil fakta-fakta dari sumber eksternal. RAG membantu <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">model bahasa besar (LLM</a> ) biasa untuk memahami konteks dan mengurangi <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">halusinasi</a> dengan memanfaatkan basis data raksasa data tidak terstruktur yang disimpan sebagai vektor - presentasi matematika yang membantu menangkap konteks dan hubungan antar data.</p>
<p>RAG membantu mengambil lebih banyak informasi kontekstual dan dengan demikian menghasilkan respons yang lebih baik, tetapi basis data vektor yang mereka andalkan semakin besar untuk menyediakan konten yang kaya untuk dimanfaatkan. Seperti halnya LLM dengan triliunan parameter yang akan segera hadir, basis data vektor dengan miliaran vektor juga tidak ketinggalan. Sebagai insinyur pengoptimalan, kami ingin tahu apakah kami dapat membuat database vektor lebih berkinerja, memuat data lebih cepat, dan membuat indeks lebih cepat untuk memastikan kecepatan pengambilan bahkan saat data baru ditambahkan. Dengan melakukan hal tersebut, tidak hanya akan mengurangi waktu tunggu pengguna, tetapi juga membuat solusi AI berbasis RAG menjadi lebih berkelanjutan.</p>
<p>Dalam artikel ini, Anda akan mempelajari lebih lanjut tentang database vektor dan kerangka kerja pembandingannya, kumpulan data untuk menangani berbagai aspek, dan alat yang digunakan untuk analisis kinerja - semua yang Anda perlukan untuk mulai mengoptimalkan database vektor. Kami juga akan membagikan pencapaian pengoptimalan kami pada dua solusi database vektor yang populer untuk menginspirasi Anda dalam perjalanan pengoptimalan kinerja dan dampak keberlanjutan.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">Memahami Basis Data Vektor<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Tidak seperti basis data relasional atau non-relasional tradisional di mana data disimpan secara terstruktur, basis data vektor berisi representasi matematis dari masing-masing item data, yang disebut vektor, yang dibangun menggunakan fungsi penyematan atau transformasi. Vektor biasanya mewakili fitur atau makna semantik dan bisa pendek atau panjang. Basis data vektor melakukan pengambilan vektor dengan pencarian kemiripan menggunakan metrik jarak (di mana semakin dekat berarti hasilnya semakin mirip) seperti <a href="https://www.pinecone.io/learn/vector-similarity/">Euclidean, dot product, atau kemiripan kosinus</a>.</p>
<p>Untuk mempercepat proses pencarian, data vektor diorganisasikan menggunakan mekanisme pengindeksan. Contoh metode pengorganisasian ini antara lain adalah struktur datar, <a href="https://arxiv.org/abs/2002.09094">inverted file (IVF),</a> <a href="https://arxiv.org/abs/1603.09320">Hierarchical Navigable Small Worlds (HNSW</a> ), dan <a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">locality-sensitive hashing (LSH)</a>. Masing-masing metode ini berkontribusi pada efisiensi dan efektivitas pengambilan vektor yang serupa saat dibutuhkan.</p>
<p>Mari kita lihat bagaimana Anda menggunakan basis data vektor dalam sistem GenAI. Gambar 1 mengilustrasikan pemuatan data ke dalam basis data vektor dan menggunakannya dalam konteks aplikasi GenAI. Ketika Anda memasukkan prompt, prompt akan mengalami proses transformasi yang sama dengan yang digunakan untuk menghasilkan vektor dalam basis data. Prompt vektor yang telah ditransformasi ini kemudian digunakan untuk mengambil vektor yang serupa dari basis data vektor. Item yang diambil ini pada dasarnya berfungsi sebagai memori percakapan, memberikan riwayat kontekstual untuk prompt, mirip dengan cara kerja LLM. Fitur ini terbukti sangat bermanfaat dalam pemrosesan bahasa alami, visi komputer, sistem rekomendasi, dan domain lain yang membutuhkan pemahaman semantik dan pencocokan data. Prompt awal Anda kemudian "digabungkan" dengan elemen yang diambil, menyediakan konteks, dan membantu LLM dalam merumuskan respons berdasarkan konteks yang disediakan daripada hanya mengandalkan data pelatihan aslinya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 1. Arsitektur aplikasi RAG.</p>
<p>Vektor disimpan dan diindeks untuk pengambilan yang cepat. Basis data vektor terdiri dari dua jenis, yaitu basis data tradisional yang telah diperluas untuk menyimpan vektor dan basis data vektor yang dibuat khusus. Beberapa contoh basis data tradisional yang menyediakan dukungan vektor adalah <a href="https://redis.io/">Redis</a>, <a href="https://github.com/pgvector/pgvector">pgvector</a>, <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a>, dan <a href="https://opensearch.org/">OpenSearch</a>. Contoh basis data vektor yang dibuat khusus meliputi solusi eksklusif <a href="https://zilliz.com/">Zilliz</a> dan <a href="https://www.pinecone.io/">Pinecone</a>, dan proyek sumber terbuka <a href="https://milvus.io/">Milvus</a>, <a href="https://weaviate.io/">Weaviate</a>, <a href="https://qdrant.tech/">Qdrant</a>, <a href="https://github.com/facebookresearch/faiss">Faiss</a>, dan <a href="https://www.trychroma.com/">Chroma</a>. Anda dapat mempelajari lebih lanjut tentang basis data vektor di GitHub melalui <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>dan <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a>.</p>
<p>Kita akan melihat lebih dekat pada satu dari setiap kategori, Milvus dan Redis.</p>
<h2 id="Improving-Performance" class="common-anchor-header">Meningkatkan Kinerja<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum masuk ke dalam pengoptimalan, mari kita tinjau bagaimana database vektor dievaluasi, beberapa kerangka kerja evaluasi, dan alat analisis kinerja yang tersedia.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">Metrik Kinerja</h3><p>Mari kita lihat metrik utama yang dapat membantu Anda mengukur performa basis data vektor.</p>
<ul>
<li><strong>Load latency</strong> mengukur waktu yang diperlukan untuk memuat data ke dalam memori database vektor dan membangun indeks. Indeks adalah struktur data yang digunakan untuk mengatur dan mengambil data vektor secara efisien berdasarkan kemiripan atau jaraknya. Jenis-jenis <a href="https://milvus.io/docs/index.md#In-memory-Index">indeks dalam memori</a> termasuk <a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">indeks datar</a>, <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>, <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ, HNSW</a>, <a href="https://github.com/google-research/google-research/tree/master/scann">tetangga terdekat yang dapat</a> <a href="https://milvus.io/docs/disk_index.md">diskalakan</a> <a href="https://github.com/google-research/google-research/tree/master/scann">(ScaNN)</a>, dan <a href="https://milvus.io/docs/disk_index.md">DiskANN</a>.</li>
<li><strong>Recall</strong> adalah proporsi kecocokan yang benar, atau item yang relevan, yang ditemukan dalam hasil <a href="https://redis.io/docs/data-types/probabilistic/top-k/">Top K</a> yang diambil oleh algoritme pencarian. Nilai recall yang lebih tinggi menunjukkan pengambilan item yang relevan dengan lebih baik.</li>
<li><strong>Query per detik (QPS</strong> ) adalah kecepatan database vektor dalam memproses kueri yang masuk. Nilai QPS yang lebih tinggi menyiratkan kemampuan pemrosesan kueri yang lebih baik dan throughput sistem.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">Kerangka Kerja Pembandingan</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 2. Kerangka kerja pembandingan basis data vektor.</p>
<p>Pembandingan database vektor membutuhkan server database vektor dan klien. Dalam pengujian kinerja kami, kami menggunakan dua alat sumber terbuka yang populer.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> Dikembangkan dan bersumber terbuka oleh Zilliz, VectorDBBench membantu menguji database vektor yang berbeda dengan jenis indeks yang berbeda dan menyediakan antarmuka web yang nyaman.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>:</strong> Dikembangkan dan bersumber terbuka oleh Qdrant, vector-db-benchmark membantu menguji beberapa basis data vektor yang umum untuk jenis indeks <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>. Ia menjalankan pengujian melalui baris perintah dan menyediakan berkas <a href="https://docs.docker.com/compose/">Docker Compose</a> __ untuk menyederhanakan memulai komponen server.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 3. Contoh perintah vector-db-benchmark yang digunakan untuk menjalankan tes benchmark.</p>
<p>Namun, kerangka kerja benchmark hanyalah sebagian dari persamaan. Kita membutuhkan data yang melatih berbagai aspek dari solusi database vektor itu sendiri, seperti kemampuannya menangani volume data yang besar, berbagai ukuran vektor, dan kecepatan pengambilan data, mari kita lihat beberapa set data publik yang tersedia.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">Kumpulan Data Terbuka untuk Melatih Basis Data Vektor</h3><p>Dataset besar adalah kandidat yang baik untuk menguji latensi pemuatan dan alokasi sumber daya. Beberapa dataset memiliki data berdimensi tinggi dan bagus untuk menguji kecepatan kesamaan komputasi.</p>
<p>Dataset berkisar dari dimensi 25 hingga dimensi 2048. Dataset <a href="https://laion.ai/">LAION</a>, sebuah koleksi gambar terbuka, telah digunakan untuk melatih model deep-neural visual dan bahasa yang sangat besar seperti model generatif difusi yang stabil. Dataset OpenAI yang terdiri dari 5 juta vektor, masing-masing dengan dimensi 1536, dibuat oleh VectorDBBench dengan menjalankan OpenAI pada <a href="https://huggingface.co/datasets/allenai/c4">data mentah</a>. Mengingat setiap elemen vektor bertipe FLOAT, untuk menyimpan vektor saja, dibutuhkan sekitar 29 GB (5M * 1536 * 4) memori, ditambah dengan jumlah yang sama untuk menyimpan indeks dan metadata lainnya dengan total 58 GB memori untuk pengujian. Saat menggunakan alat vector-db-benchmark, pastikan penyimpanan disk yang memadai untuk menyimpan hasil.</p>
<p>Untuk menguji latensi pemuatan, kami membutuhkan koleksi vektor yang besar, yang ditawarkan oleh <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular</a>. Untuk menguji performa pembuatan indeks dan komputasi kesamaan, vektor berdimensi tinggi akan memberikan tekanan yang lebih besar. Untuk itu, kami memilih dataset 500 ribu vektor berdimensi 1536.</p>
<h3 id="Performance-Tools" class="common-anchor-header">Alat Bantu Performa</h3><p>Kita telah membahas cara-cara untuk menekan sistem untuk mengidentifikasi metrik yang diminati, tetapi mari kita periksa apa yang terjadi di tingkat yang lebih rendah: Seberapa sibuk unit komputasi, konsumsi memori, waktu tunggu untuk penguncian, dan banyak lagi? Semua ini memberikan petunjuk tentang perilaku basis data, khususnya berguna dalam mengidentifikasi area masalah.</p>
<p>Utilitas <a href="https://www.redhat.com/sysadmin/interpret-top-output">utama</a> Linux menyediakan informasi kinerja sistem. Namun, alat <a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a> di Linux menyediakan wawasan yang lebih dalam. Untuk mempelajari lebih lanjut, kami juga merekomendasikan untuk membaca <a href="https://www.brendangregg.com/perf.html">contoh-contoh perf Linux</a> dan <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">metode analisis mikroarsitektur top-down Intel</a>. Alat lainnya adalah <a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler</a>, yang berguna untuk mengoptimalkan tidak hanya aplikasi tetapi juga kinerja dan konfigurasi sistem untuk berbagai beban kerja yang mencakup HPC, cloud, IoT, media, penyimpanan, dan lainnya.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Pengoptimalan Basis Data Vektor Milvus<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita lihat beberapa contoh bagaimana kami mencoba meningkatkan kinerja database vektor Milvus.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">Mengurangi Overhead Pergerakan Memori dalam Penulisan Buffer Datanode</h3><p>Jalur penulisan Milvus memproksi penulisan data ke dalam log broker melalui <em>MsgStream</em>. Simpul data kemudian mengkonsumsi data, mengubah dan menyimpannya ke dalam segmen. Segmen akan menggabungkan data yang baru dimasukkan. Logika penggabungan mengalokasikan buffer baru untuk menampung/memindahkan data lama dan data baru yang akan disisipkan dan kemudian mengembalikan buffer baru sebagai data lama untuk penggabungan data berikutnya. Hal ini mengakibatkan data lama menjadi semakin besar, yang pada gilirannya membuat pergerakan data menjadi lebih lambat. Profil Perf menunjukkan overhead yang tinggi untuk logika ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 4. Penggabungan dan pemindahan data dalam basis data vektor menghasilkan overhead performa tinggi.</p>
<p>Kami mengubah logika <em>penggabungan buffer</em> untuk secara langsung menambahkan data baru yang akan disisipkan ke dalam data lama, menghindari pengalokasian buffer baru dan pemindahan data lama yang besar. Profil perf mengonfirmasi bahwa tidak ada overhead pada logika ini. Metrik kode mikro <em>metrik_CPU frekuensi operasi</em> dan <em>metrik_CPU utilisasi</em> menunjukkan peningkatan yang konsisten dengan sistem yang tidak perlu lagi menunggu perpindahan memori yang lama. Load latency meningkat lebih dari 60 persen. Peningkatan ini terekam pada <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 5. Dengan lebih sedikit penyalinan, kami melihat peningkatan kinerja lebih dari 50 persen dalam load latency.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">Pembuatan Indeks Terbalik dengan Pengurangan Overhead Alokasi Memori</h3><p>Mesin pencari Milvus, <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, menggunakan <a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">algoritma Elkan k-means</a> untuk melatih data klaster untuk membuat <a href="https://milvus.io/docs/v1.1.1/index.md">indeks inverted file (IVF)</a>. Setiap putaran pelatihan data menentukan jumlah iterasi. Semakin besar jumlah iterasi, semakin baik hasil pelatihannya. Namun, hal ini juga menyiratkan bahwa algoritma Elkan akan dipanggil lebih sering.</p>
<p>Algoritma Elkan menangani alokasi dan de-alokasi memori setiap kali dieksekusi. Secara khusus, algoritma ini mengalokasikan memori untuk menyimpan setengah dari ukuran data matriks simetris, tidak termasuk elemen diagonal. Di Knowhere, dimensi matriks simetris yang digunakan oleh algoritma Elkan diatur ke 1024, menghasilkan ukuran memori sekitar 2 MB. Ini berarti untuk setiap putaran pelatihan, Elkan berulang kali mengalokasikan dan mendealokasi memori 2 MB.</p>
<p>Data profil perf mengindikasikan aktivitas alokasi memori yang besar. Bahkan, hal ini memicu alokasi <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">virtual memory area (VMA</a>), alokasi halaman fisik, pengaturan peta halaman, dan pembaruan statistik cgroup memori di kernel. Pola aktivitas alokasi/dealokasi memori yang besar ini, dalam beberapa situasi, juga dapat memperburuk fragmentasi memori. Ini adalah pajak yang signifikan.</p>
<p>Struktur <em>IndexFlatElkan</em> secara khusus didesain dan dibangun untuk mendukung algoritma Elkan. Setiap proses pelatihan data akan memiliki instance <em>IndexFlatElkan</em> yang diinisialisasi. Untuk mengurangi dampak kinerja yang dihasilkan dari alokasi dan de-alokasi memori yang sering terjadi pada algoritma Elkan, kami melakukan refactoring pada logika kode, memindahkan manajemen memori di luar fungsi algoritma Elkan ke dalam proses konstruksi <em>IndexFlatElkan</em>. Hal ini memungkinkan alokasi memori terjadi hanya sekali selama fase inisialisasi sambil melayani semua panggilan fungsi algoritme Elkan berikutnya dari proses pelatihan data saat ini dan membantu meningkatkan latensi pemuatan sekitar 3 persen. Temukan <a href="https://github.com/zilliztech/knowhere/pull/280">patch Knowhere di sini</a>.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">Akselerasi Pencarian Vektor Redis melalui Prefetch Perangkat Lunak<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>Redis, penyimpan data nilai-kunci dalam memori tradisional yang populer, baru-baru ini mulai mendukung pencarian vektor. Untuk melampaui penyimpanan nilai-kunci pada umumnya, Redis menawarkan modul ekstensibilitas; modul <a href="https://github.com/RediSearch/RediSearch">RediSearch</a> memfasilitasi penyimpanan dan pencarian vektor secara langsung di dalam Redis.</p>
<p>Untuk pencarian kemiripan vektor, Redis mendukung dua algoritme, yaitu brute force dan HNSW. Algoritme HNSW secara khusus dibuat untuk menemukan perkiraan tetangga terdekat secara efisien dalam ruang dimensi tinggi. Algoritme ini menggunakan antrean prioritas bernama <em>candidate_set</em> untuk mengelola semua kandidat vektor untuk komputasi jarak.</p>
<p>Setiap kandidat vektor mencakup metadata yang substansial selain data vektor. Akibatnya, ketika memuat kandidat dari memori, hal ini dapat menyebabkan kesalahan cache data, yang menyebabkan penundaan pemrosesan. Pengoptimalan kami memperkenalkan pengambilan awal perangkat lunak untuk memuat kandidat berikutnya secara proaktif sambil memproses kandidat yang sekarang. Peningkatan ini telah menghasilkan peningkatan throughput sebesar 2 hingga 3 persen untuk pencarian kemiripan vektor dalam satu kali penyiapan Redis. Patch ini sedang dalam proses untuk di-upstream.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">Perubahan Perilaku Default GCC untuk Mencegah Penalti Kode Perakitan Campuran<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk mendorong performa maksimum, bagian kode yang sering digunakan sering kali ditulis secara manual dalam perakitan. Namun, ketika segmen kode yang berbeda ditulis oleh orang yang berbeda atau pada titik waktu yang berbeda, instruksi yang digunakan mungkin berasal dari set instruksi perakitan yang tidak kompatibel seperti <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512</a> ) dan <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a>. Jika tidak dikompilasi dengan benar, kode campuran akan menghasilkan penalti kinerja. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">Pelajari lebih lanjut tentang pencampuran instruksi Intel AVX dan SSE di sini</a>.</p>
<p>Anda dapat dengan mudah menentukan apakah Anda menggunakan kode perakitan mode campuran dan belum mengompilasi kode dengan <em>VZEROUPPER</em>, sehingga menimbulkan penalti kinerja. Hal ini dapat diamati melalui perintah perf seperti <em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;beban kerja&gt;.</em> Jika OS Anda tidak memiliki dukungan untuk event tersebut, gunakan <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>.</p>
<p>Kompiler Clang secara default menyisipkan <em>VZEROUPPER</em>, untuk menghindari penalti mode campuran. Tetapi kompiler GCC hanya memasukkan <em>VZEROUPPER</em> ketika flag kompiler -O2 atau -O3 ditentukan. Kami menghubungi tim GCC dan menjelaskan masalah ini dan mereka sekarang, secara default, menangani kode perakitan mode campuran dengan benar.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">Mulai Mengoptimalkan Basis Data Vektor Anda<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor memainkan peran integral dalam GenAI, dan basis data vektor terus berkembang untuk menghasilkan respons yang lebih berkualitas. Sehubungan dengan pengoptimalan, aplikasi AI tidak berbeda dengan aplikasi perangkat lunak lain yang mengungkapkan rahasianya ketika seseorang menggunakan alat analisis kinerja standar bersama dengan kerangka kerja tolok ukur dan input stres.</p>
<p>Dengan menggunakan alat bantu ini, kami menemukan jebakan kinerja yang berkaitan dengan alokasi memori yang tidak perlu, kegagalan untuk mengambil instruksi, dan menggunakan opsi kompiler yang salah. Berdasarkan temuan kami, kami meningkatkan peningkatan pada Milvus, Knowhere, Redis, dan kompiler GCC untuk membantu membuat AI menjadi lebih berkinerja dan berkelanjutan. Basis data vektor adalah kelas aplikasi penting yang layak untuk upaya pengoptimalan Anda. Kami harap artikel ini dapat membantu Anda untuk memulai.</p>
