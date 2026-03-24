---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 'Memperbaiki Kesalahan Pengambilan RAG dengan CRAG, LangGraph, dan Milvus'
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  Kemiripan yang tinggi tetapi jawaban salah? Pelajari bagaimana CRAG
  menambahkan evaluasi dan koreksi pada pipeline RAG. Bangun sistem yang siap
  produksi dengan LangGraph + Milvus.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>Ketika aplikasi LLM mulai diproduksi, tim semakin membutuhkan model mereka untuk menjawab pertanyaan yang didasarkan pada data pribadi atau informasi real-time. <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-augmented generation</a> (RAG) - di mana model diambil dari basis pengetahuan eksternal pada waktu kueri - adalah pendekatan standar. Pendekatan ini mengurangi halusinasi dan menjaga jawaban tetap terkini.</p>
<p>Namun, inilah masalah yang muncul dengan cepat dalam praktiknya: <strong>sebuah dokumen dapat memiliki nilai kesamaan yang tinggi dan tetap saja salah dalam menjawab pertanyaan.</strong> Pipeline RAG tradisional menyamakan kemiripan dengan relevansi. Dalam produksi, asumsi itu rusak. Hasil yang berada di peringkat teratas mungkin saja sudah usang, hanya berhubungan secara garis besar, atau tidak memiliki detail yang dibutuhkan pengguna.</p>
<p>CRAG (Corrective Retrieval-Augmented Generation) mengatasi hal ini dengan menambahkan evaluasi dan koreksi antara pencarian dan pembuatan. Alih-alih mempercayai skor kemiripan secara membabi buta, sistem akan memeriksa apakah konten yang diambil benar-benar menjawab pertanyaan-dan memperbaiki situasi jika tidak.</p>
<p>Artikel ini akan menjelaskan cara membangun sistem CRAG yang siap produksi dengan menggunakan LangChain, LangGraph, dan <a href="https://milvus.io/intro">Milvus</a>.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">Tiga Masalah Pengambilan yang Tidak Dapat Dipecahkan oleh RAG Tradisional<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagian besar kegagalan RAG dalam produksi berakar pada salah satu dari tiga masalah:</p>
<p><strong>Ketidakcocokan pengambilan.</strong> Dokumen tersebut secara topik serupa tetapi tidak benar-benar menjawab pertanyaan. Tanyakan cara mengonfigurasi sertifikat HTTPS di Nginx, dan sistem mungkin akan memberikan panduan penyiapan Apache, panduan tahun 2019, atau penjelasan umum tentang cara kerja TLS. Secara semantik hampir sama, secara praktis tidak berguna.</p>
<p><strong>Konten basi.</strong> <a href="https://zilliz.com/learn/vector-similarity-search">Pencarian vektor</a> tidak memiliki konsep kemutakhiran. Kueri "praktik terbaik asinkronisasi Python" dan Anda akan mendapatkan campuran pola tahun 2018 dan pola tahun 2024, yang diberi peringkat murni berdasarkan jarak penyematan. Sistem tidak dapat membedakan mana yang sebenarnya dibutuhkan pengguna.</p>
<p><strong>Kontaminasi memori.</strong> Masalah yang satu ini bertambah seiring berjalannya waktu dan sering kali paling sulit untuk diperbaiki. Katakanlah sistem mengambil referensi API yang sudah ketinggalan zaman dan menghasilkan kode yang salah. Hasil yang buruk tersebut akan disimpan kembali ke dalam memori. Pada kueri serupa berikutnya, sistem akan mengambilnya lagi-memperkuat kesalahan tersebut. Informasi yang sudah basi dan yang baru secara bertahap bercampur, dan keandalan sistem terkikis di setiap siklus.</p>
<p>Ini bukan kasus yang jarang terjadi. Kasus-kasus ini muncul secara teratur setelah sistem RAG menangani lalu lintas yang sebenarnya. Itulah yang membuat pemeriksaan kualitas pengambilan menjadi sebuah kebutuhan, bukan keinginan.</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">Apa itu CRAG? Evaluasi Dulu, Lalu Hasilkan<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Corrective Retrieval-Augmented Generation (CRAG</strong> ) adalah metode yang menambahkan langkah evaluasi dan koreksi antara pengambilan dan pembangkitan dalam pipa RAG. Metode ini diperkenalkan dalam makalah <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a> (Yan et al., 2024). Tidak seperti RAG tradisional, yang membuat keputusan biner - menggunakan dokumen atau membuangnya - RAG menilai setiap hasil yang diambil untuk relevansi dan merutekannya melalui salah satu dari tiga jalur koreksi sebelum mencapai model bahasa.</p>
<p>RAG tradisional mengalami kesulitan ketika hasil pencarian berada di zona abu-abu: sebagian relevan, agak ketinggalan zaman, atau kehilangan bagian penting. Gerbang ya/tidak yang sederhana akan membuang sebagian informasi yang berguna atau membiarkan konten yang berisik masuk. CRAG membingkai ulang pipeline dari <strong>ambil → hasilkan</strong> menjadi <strong>ambil → evaluasi → perbaiki →</strong> hasilkan, memberikan sistem kesempatan untuk memperbaiki kualitas hasil sebelum pembuatan dimulai.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>Alur kerja empat langkah CRAG: Pengambilan → Evaluasi → Koreksi → Pembangkitan, yang menunjukkan bagaimana dokumen dinilai dan dirutekan</span> </span></p>
<p>Hasil pencarian diklasifikasikan ke dalam salah satu dari tiga kategori:</p>
<ul>
<li><strong>Benar:</strong> langsung menjawab pertanyaan; dapat digunakan setelah perbaikan ringan</li>
<li><strong>Ambigu:</strong> sebagian relevan; membutuhkan informasi tambahan</li>
<li><strong>Salah:</strong> tidak relevan; buang dan kembalikan ke sumber alternatif</li>
</ul>
<table>
<thead>
<tr><th>Keputusan</th><th>Keyakinan</th><th>Tindakan</th></tr>
</thead>
<tbody>
<tr><td>Benar</td><td>&gt; 0.9</td><td>Memperbaiki konten dokumen</td></tr>
<tr><td>Ambigu</td><td>0.5-0.9</td><td>Sempurnakan dokumen + lengkapi dengan pencarian web</td></tr>
<tr><td>Salah</td><td>&lt; 0.5</td><td>Buang hasil pencarian; kembali sepenuhnya ke pencarian web</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">Penyempurnaan Konten</h3><p>CRAG juga menangani masalah yang lebih halus dengan RAG standar: sebagian besar sistem memberikan seluruh dokumen yang diambil ke model. Hal ini membuang token dan melemahkan sinyal - model harus mengarungi paragraf yang tidak relevan untuk menemukan satu kalimat yang benar-benar penting. CRAG menyaring konten yang diambil terlebih dahulu, mengekstrak bagian yang relevan dan membuang sisanya.</p>
<p>Makalah asli menggunakan strip pengetahuan dan aturan heuristik untuk ini. Dalam praktiknya, pencocokan kata kunci dapat digunakan untuk banyak kasus penggunaan, dan sistem produksi dapat menambahkan ringkasan berbasis LLM atau ekstraksi terstruktur untuk kualitas yang lebih tinggi.</p>
<p>Proses penyempurnaan memiliki tiga bagian:</p>
<ul>
<li>Penguraian<strong>dokumen:</strong> mengekstrak bagian-bagian penting dari dokumen yang lebih panjang</li>
<li>Penulisan<strong>ulang kueri:</strong> mengubah kueri yang tidak jelas atau ambigu menjadi kueri yang lebih tepat sasaran</li>
<li><strong>Seleksi pengetahuan:</strong> menggandakan, memberi peringkat, dan hanya mempertahankan konten yang paling berguna</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>Proses penyempurnaan dokumen dalam tiga langkah: Dekomposisi Dokumen (2000 → 500 token), Penulisan Ulang Kueri (meningkatkan ketepatan pencarian), dan Seleksi Pengetahuan (menyaring, memberi peringkat, dan memangkas)</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">Evaluator</h3><p>Evaluator adalah inti dari CRAG. Evaluator tidak dimaksudkan untuk penalaran yang mendalam - ini adalah gerbang triase yang cepat. Diberikan sebuah kueri dan sekumpulan dokumen yang diambil, evaluator akan memutuskan apakah konten tersebut cukup baik untuk digunakan.</p>
<p>Makalah asli memilih model T5-Large yang telah disetel dengan baik daripada LLM tujuan umum. Alasannya: kecepatan dan ketepatan lebih penting daripada fleksibilitas untuk tugas khusus ini.</p>
<table>
<thead>
<tr><th>Atribut</th><th>T5-Besar yang disetel dengan baik</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>Latensi</td><td>10-20 ms</td><td>200 ms+</td></tr>
<tr><td>Akurasi</td><td>92% (percobaan di atas kertas)</td><td>TBD</td></tr>
<tr><td>Kesesuaian Tugas</td><td>Tinggi - tugas tunggal yang disetel dengan baik, presisi yang lebih tinggi</td><td>Sedang - tujuan umum, lebih fleksibel tetapi kurang terspesialisasi</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">Pengembalian Penelusuran Web</h3><p>Ketika pengambilan internal ditandai sebagai salah atau ambigu, CRAG dapat memicu pencarian web untuk menarik informasi yang lebih segar atau tambahan. Ini bertindak sebagai jaring pengaman untuk kueri yang sensitif terhadap waktu dan topik-topik di mana basis pengetahuan internal memiliki kesenjangan.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Mengapa Milvus Sangat Cocok untuk CRAG dalam Produksi<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Efektivitas CRAG bergantung pada apa yang ada di bawahnya. <a href="https://zilliz.com/learn/what-is-vector-database">Basis data vektor</a> perlu melakukan lebih dari sekadar pencarian kemiripan dasar-ia perlu mendukung isolasi multi-penyewa, pengambilan hibrida, dan fleksibilitas skema yang dituntut oleh sistem CRAG produksi.</p>
<p>Setelah mengevaluasi beberapa opsi, kami memilih <a href="https://zilliz.com/what-is-milvus">Milvus</a> karena tiga alasan.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">Isolasi Multi-Penyewa</h3><p>Dalam sistem berbasis agen, setiap pengguna atau sesi membutuhkan ruang memorinya sendiri. Pendekatan naif-satu koleksi per penyewa-menjadi sangat memusingkan secara operasional, terutama dalam skala besar.</p>
<p>Milvus menangani hal ini dengan <a href="https://milvus.io/docs/use-partition-key.md">Kunci Partisi</a>. Tetapkan <code translate="no">is_partition_key=True</code> pada bidang <code translate="no">agent_id</code>, dan Milvus merutekan kueri ke partisi yang tepat secara otomatis. Tidak ada koleksi yang melebar, tidak ada kode perutean manual.</p>
<p>Dalam tolok ukur kami dengan 10 juta vektor di 100 penyewa, Milvus dengan Pemadatan Clustering menghasilkan <strong>QPS 3-5x lebih tinggi</strong> dibandingkan dengan baseline yang tidak dioptimalkan.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">Pencarian Hibrida</h3><p>Pencarian vektor murni tidak cukup untuk SKU produk-konten yang sama persis seperti <code translate="no">SKU-2024-X5</code>, string versi, atau terminologi tertentu.</p>
<p>Milvus 2.5 mendukung <a href="https://milvus.io/docs/multi-vector-search.md">pencarian h</a> ibrida secara native: vektor padat untuk kemiripan semantik, vektor jarang untuk pencocokan kata kunci gaya BM25, dan pemfilteran metadata skalar-semuanya dalam satu kueri. Hasilnya digabungkan menggunakan Reciprocal Rank Fusion (RRF), sehingga Anda tidak perlu membangun dan menggabungkan pipeline pencarian yang terpisah.</p>
<p>Pada set data 1 juta vektor, latensi pengambilan Milvus Sparse-BM25 mencapai <strong>6 ms</strong>, dengan dampak yang dapat diabaikan pada kinerja CRAG end-to-end.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">Skema Fleksibel untuk Memori yang Terus Berkembang</h3><p>Seiring dengan berkembangnya pipeline CRAG, model data pun ikut berkembang. Kami perlu menambahkan bidang seperti <code translate="no">confidence</code>, <code translate="no">verified</code>, dan <code translate="no">source</code> saat melakukan iterasi pada logika evaluasi. Pada sebagian besar database, hal ini berarti skrip migrasi dan waktu henti.</p>
<p>Milvus mendukung bidang JSON dinamis, sehingga metadata dapat diperluas dengan cepat tanpa gangguan layanan.</p>
<p>Berikut ini adalah sebuah skema umum:</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus juga menyederhanakan penskalaan penerapan. Menawarkan <a href="https://milvus.io/docs/install-overview.md">mode Lite, Standalone, dan Distributed</a> yang kompatibel dengan kode - peralihan dari pengembangan lokal ke klaster produksi hanya membutuhkan perubahan string koneksi.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">Praktik Langsung: Membangun Sistem CRAG dengan Middleware LangGraph dan Milvus<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">Mengapa Pendekatan Middleware?</h3><p>Cara umum untuk membangun CRAG dengan LangGraph adalah dengan menyambungkan state graph dengan node dan edge yang mengendalikan setiap langkah. Cara ini berhasil, tetapi graf menjadi kusut seiring dengan bertambahnya kompleksitas, dan debugging menjadi sangat memusingkan.</p>
<p>Kami memilih <strong>pola Middleware</strong> di LangGraph 1.0. Pola ini mencegat permintaan sebelum pemanggilan model, sehingga pengambilan, evaluasi, dan koreksi ditangani di satu tempat yang kohesif. Dibandingkan dengan pendekatan state-graph:</p>
<ul>
<li><strong>Lebih sedikit kode:</strong> logika terpusat, tidak tersebar di seluruh node grafik</li>
<li><strong>Lebih mudah diikuti:</strong> aliran kontrol terbaca secara linier</li>
<li><strong>Lebih mudah di-debug:</strong> kegagalan mengarah ke satu lokasi, bukan ke penjelajahan grafik</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">Alur Kerja Inti</h3><p>Pipeline berjalan dalam empat langkah:</p>
<ol>
<li><strong>Pengambilan:</strong> mengambil 3 dokumen teratas yang relevan dari Milvus, dengan cakupan ke penyewa saat ini</li>
<li><strong>Evaluasi:</strong> menilai kualitas dokumen dengan model yang ringan</li>
<li><strong>Koreksi:</strong> menyempurnakan, melengkapi dengan pencarian web, atau kembali sepenuhnya - berdasarkan keputusan</li>
<li><strong>Injeksi:</strong> memberikan konteks yang telah diselesaikan ke model melalui perintah sistem yang dinamis</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">Pengaturan Lingkungan dan Persiapan Data</h3><p><strong>Variabel lingkungan</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Membuat koleksi Milvus</strong></p>
<p>Sebelum menjalankan kode, buatlah koleksi di Milvus dengan skema yang sesuai dengan logika pengambilan.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>Catatan Versi:</strong> Kode ini menggunakan fitur-fitur Middleware terbaru di LangGraph dan LangChain. API ini dapat berubah seiring dengan perkembangan kerangka kerja-periksa <a href="https://langchain-ai.github.io/langgraph/">dokumentasi LangGraph</a> untuk mengetahui penggunaan terbaru.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">Modul Utama</h3><p><strong>1. Desain evaluator tingkat produksi</strong></p>
<p>Metode <code translate="no">_evaluate_relevance()</code> pada kode di atas sengaja disederhanakan untuk pengujian cepat. Untuk produksi, Anda akan menginginkan output yang terstruktur dengan penilaian kepercayaan dan penjelasan:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Penyempurnaan dan pengembalian pengetahuan</strong></p>
<p>Tiga mekanisme bekerja sama untuk menjaga konteks model tetap berkualitas tinggi:</p>
<ul>
<li><strong>Penyempurnaan pengetahuan</strong> mengekstrak kalimat yang paling relevan dengan kueri dan menghilangkan noise.</li>
<li><strong>Pencarian fallback</strong> dipicu ketika pencarian lokal tidak mencukupi, menarik pengetahuan eksternal melalui Tavily.</li>
<li><strong>Penggabungan konteks</strong> menggabungkan memori internal dengan hasil eksternal ke dalam satu blok konteks yang diduplikasi sebelum mencapai model.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">Kiat untuk Menjalankan CRAG dalam Produksi<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Ada tiga area yang paling penting ketika Anda bergerak di luar pembuatan prototipe.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. Biaya: Pilih Evaluator yang Tepat</h3><p>Evaluator berjalan pada setiap kueri, menjadikannya pengungkit terbesar untuk latensi dan biaya.</p>
<ul>
<li><strong>Beban kerja dengan konkurensi tinggi:</strong> Model ringan yang disetel dengan baik seperti T5-Large menjaga latensi pada 10-20 ms dan biaya yang dapat diprediksi.</li>
<li><strong>Lalu lintas rendah atau pembuatan prototipe:</strong> Model yang di-host seperti <code translate="no">gpt-4o-mini</code> lebih cepat disiapkan dan membutuhkan lebih sedikit pekerjaan operasional, tetapi latensi dan biaya per panggilan menjadi lebih tinggi.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. Dapat diamati: Instrumen dari Hari Pertama</h3><p>Masalah produksi yang paling sulit adalah masalah yang tidak dapat Anda lihat hingga kualitas jawaban sudah menurun.</p>
<ul>
<li><strong>Pemantauan infrastruktur:</strong> Milvus terintegrasi dengan <a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a>. Mulailah dengan tiga metrik: <code translate="no">milvus_query_latency_seconds</code>, <code translate="no">milvus_search_qps</code>, dan <code translate="no">milvus_insert_throughput</code>.</li>
<li><strong>Pemantauan aplikasi:</strong> Lacak distribusi putusan CRAG, tingkat pemicu penelusuran web, dan distribusi skor kepercayaan. Tanpa sinyal-sinyal ini, Anda tidak dapat mengetahui apakah penurunan kualitas disebabkan oleh pengambilan yang buruk atau kesalahan penilaian evaluator.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. Pemeliharaan Jangka Panjang: Mencegah Kontaminasi Memori</h3><p>Semakin lama sebuah agen berjalan, semakin banyak data yang basi dan berkualitas rendah terakumulasi dalam memori. Siapkan pagar pembatas lebih awal:</p>
<ul>
<li><strong>Pra-penyaringan:</strong> Hanya memori permukaan dengan <code translate="no">confidence &gt; 0.7</code> sehingga konten berkualitas rendah diblokir sebelum mencapai evaluator.</li>
<li><strong>Peluruhan waktu:</strong> Secara bertahap mengurangi bobot memori yang lebih lama. Tiga puluh hari adalah default awal yang wajar, dapat disesuaikan per kasus penggunaan.</li>
<li><strong>Pembersihan terjadwal:</strong> Jalankan pekerjaan mingguan untuk membersihkan memori lama yang tidak diverifikasi dan kurang dipercaya. Hal ini mencegah lingkaran umpan balik di mana data yang sudah basi diambil, digunakan, dan disimpan kembali.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">Penutup - dan Beberapa Pertanyaan Umum<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAG mengatasi salah satu masalah yang paling sering muncul dalam RAG produksi: hasil pencarian yang terlihat relevan namun sebenarnya tidak. Dengan menyisipkan langkah evaluasi dan koreksi antara pengambilan dan pembuatan, CRAG menyaring hasil yang buruk, mengisi kesenjangan dengan pencarian eksternal, dan memberikan konteks yang lebih bersih kepada model untuk digunakan.</p>
<p>Membuat CRAG bekerja dengan andal dalam produksi membutuhkan lebih dari sekadar logika pengambilan yang baik. Dibutuhkan basis data vektor yang menangani isolasi multi-penyewa, pencarian hibrida, dan skema yang terus berkembang-di sinilah <a href="https://milvus.io/intro">Milvus</a> cocok. Di sisi aplikasi, memilih evaluator yang tepat, menginstruksikan pengamatan lebih awal, dan secara aktif mengelola kualitas memori adalah hal yang membedakan demo dengan sistem yang dapat Anda percayai.</p>
<p>Jika Anda sedang membangun RAG atau sistem agen dan mengalami masalah kualitas pengambilan, kami ingin membantu:</p>
<ul>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> untuk mengajukan pertanyaan, berbagi arsitektur Anda, dan belajar dari pengembang lain yang menangani masalah serupa.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Milvus Office Hours selama 20 menit</a> untuk membahas kasus penggunaan Anda bersama tim-apakah itu desain CRAG, pengambilan hibrida, atau penskalaan multi-penyewa.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur dan langsung membangun, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (dikelola Milvus) menawarkan tingkat gratis untuk memulai.</li>
</ul>
<hr>
<p>Beberapa pertanyaan yang sering muncul ketika tim mulai menerapkan CRAG:</p>
<p><strong>Apa perbedaan CRAG dengan hanya menambahkan reranker ke RAG?</strong></p>
<p>Perangking ulang menyusun ulang hasil berdasarkan relevansi namun tetap mengasumsikan dokumen yang diambil dapat digunakan. CRAG melangkah lebih jauh lagi - CRAG mengevaluasi apakah konten yang diambil benar-benar menjawab kueri, dan mengambil tindakan korektif jika tidak: menyempurnakan kecocokan parsial, melengkapi dengan penelusuran web, atau membuang hasil sepenuhnya. Ini adalah lingkaran kontrol kualitas, bukan hanya jenis yang lebih baik.</p>
<p><strong>Mengapa skor kemiripan yang tinggi terkadang menghasilkan dokumen yang salah?</strong></p>
<p>Menyematkan kemiripan mengukur kedekatan semantik dalam ruang vektor, tetapi itu tidak sama dengan menjawab pertanyaan. Sebuah dokumen tentang mengkonfigurasi HTTPS di Apache secara semantik dekat dengan pertanyaan tentang HTTPS di Nginx-tetapi tidak akan membantu. CRAG menangkap hal ini dengan mengevaluasi relevansi dengan kueri yang sebenarnya, bukan hanya jarak vektor.</p>
<p><strong>Apa yang harus saya cari dalam basis data vektor untuk CRAG?</strong></p>
<p>Tiga hal yang paling penting: pengambilan hibrida (sehingga Anda dapat menggabungkan pencarian semantik dengan pencocokan kata kunci untuk istilah yang tepat), isolasi multi-penyewa (sehingga setiap sesi pengguna atau agen memiliki ruang memorinya sendiri), dan skema yang fleksibel (sehingga Anda dapat menambahkan bidang seperti <code translate="no">confidence</code> atau <code translate="no">verified</code> tanpa waktu henti saat pipeline Anda berkembang).</p>
<p><strong>Apa yang terjadi jika tidak ada dokumen yang diambil yang relevan?</strong></p>
<p>CRAG tidak menyerah begitu saja. Ketika kepercayaan turun di bawah 0,5, ia akan kembali ke pencarian web. Ketika hasilnya ambigu (0,5-0,9), CRAG akan menggabungkan dokumen internal yang telah disempurnakan dengan hasil pencarian eksternal. Model ini selalu mendapatkan beberapa konteks untuk digunakan, bahkan ketika basis pengetahuan memiliki kesenjangan.</p>
