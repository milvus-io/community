---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >-
  Tanpa Python, Tidak Ada Masalah: Inferensi Model dengan ONNX di Java, atau
  Bahasa Lainnya
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX (Open Neural Network Exchange) adalah ekosistem alat yang bersifat
  platform-agnostik untuk melakukan inferensi model jaringan saraf.
cover: assets.zilliz.com/No_Python_No_Problem_7fe97dad46.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  build AI apps with Python, ONNX (Open Neural Network Exchange), Model
  inference, vector databases, Milvus
meta_title: >
  No Python, No Problem: Model Inference with ONNX in Java, or Any Other
  Language
origin: >-
  https://milvus.io/blog/no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
---
<p>Tidak pernah semudah ini untuk membangun aplikasi AI Generatif. Ekosistem yang kaya akan alat, model AI, dan dataset memungkinkan para insinyur perangkat lunak yang tidak memiliki keahlian khusus untuk membuat chatbot, generator gambar, dan banyak lagi. Perkakas ini, sebagian besar, dibuat untuk Python dan dibangun di atas PyTorch. Tetapi bagaimana jika Anda tidak memiliki akses ke Python dalam produksi dan perlu menggunakan Java, Golang, Rust, C++, atau bahasa lain?</p>
<p>Kami akan membatasi diri pada inferensi model, termasuk model penyematan dan model fondasi; tugas-tugas lain, seperti pelatihan model dan penyempurnaan, biasanya tidak diselesaikan pada saat penerapan. Apa saja pilihan kita untuk inferensi model tanpa Python? Solusi yang paling jelas adalah dengan memanfaatkan layanan online dari penyedia seperti Anthropic atau Mistral. Mereka biasanya menyediakan SDK untuk bahasa selain Python, dan jika tidak, maka hanya memerlukan panggilan REST API sederhana. Tetapi bagaimana jika solusi kita harus sepenuhnya lokal karena, misalnya, masalah kepatuhan atau privasi?</p>
<p>Solusi lainnya adalah menjalankan server Python secara lokal. Masalah awalnya adalah tidak dapat menjalankan Python dalam produksi, sehingga mengesampingkan penggunaan server Python lokal. Solusi lokal terkait kemungkinan akan mengalami pembatasan hukum, berbasis keamanan, atau teknis yang serupa. <em>Kita membutuhkan solusi yang lengkap yang memungkinkan kita untuk memanggil model secara langsung dari Java atau bahasa non-Python lainnya.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 1: Sebuah Python bermetamorfosis menjadi kupu-kupu Onyx.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">Apa itu ONNX (Open Neural Network Exchange)?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (Open Neural Network Exchange) adalah sebuah ekosistem alat yang bersifat platform-agnostik untuk melakukan inferensi model jaringan syaraf. Awalnya dikembangkan oleh tim PyTorch di Meta (kemudian Facebook), dengan kontribusi lebih lanjut dari Microsoft, IBM, Huawei, Intel, AMD, Arm, dan Qualcomm. Saat ini, ONNX merupakan proyek sumber terbuka yang dimiliki oleh Linux Foundation untuk AI dan Data. ONNX adalah metode de facto untuk mendistribusikan model jaringan saraf tiruan platform-agnostik.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 2: Grafik komputasi ONNX (parsial) untuk transformator NN</em></p>
<p><strong>Kami biasanya menggunakan "ONNX" dalam arti yang lebih sempit untuk merujuk pada format file-nya.</strong> File model ONNX merepresentasikan grafik komputasi, sering kali menyertakan nilai bobot dari fungsi matematika, dan standar mendefinisikan operasi umum untuk jaringan saraf. Anda dapat menganggapnya mirip dengan grafik komputasi yang dibuat ketika Anda menggunakan autodiff dengan PyTorch. Dari perspektif lain, format file ONNX berfungsi sebagai <em>representasi perantara</em> (IR) untuk jaringan saraf, seperti halnya kompilasi kode asli, yang juga melibatkan langkah IR. Lihat ilustrasi di atas yang memvisualisasikan grafik komputasi ONNX.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 3: IR memungkinkan banyak kombinasi front-end dan back-end</em></p>
<p>Format file ONNX hanyalah salah satu bagian dari ekosistem ONNX, yang juga mencakup pustaka untuk memanipulasi grafik komputasi dan pustaka untuk memuat dan menjalankan file model ONNX. Pustaka ini menjangkau berbagai bahasa dan platform. Karena ONNX hanyalah sebuah IR (Intermediate Representation Language), pengoptimalan khusus untuk platform perangkat keras tertentu dapat diterapkan sebelum menjalankannya dengan kode asli. Lihat gambar di atas yang mengilustrasikan kombinasi front-end dan back-end.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">Alur Kerja ONNX<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk tujuan diskusi, kita akan menyelidiki pemanggilan model penyematan teks dari Java, misalnya, sebagai persiapan untuk memasukkan data ke basis data vektor sumber terbuka <a href="https://milvus.io/">Milvus</a>. Jadi, jika kita ingin memanggil model penyematan atau fondasi kita dari Java, apakah sesederhana menggunakan pustaka ONNX pada file model yang sesuai? Ya, tetapi kita perlu mendapatkan file untuk model dan tokenizer encoder (dan decoder untuk model fondasi). Kita dapat membuatnya sendiri menggunakan Python secara offline, yaitu sebelum produksi, yang akan kami jelaskan sekarang.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Mengekspor Model NN dari Python<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita buka model penyematan teks yang umum, <code translate="no">all-MiniLM-L6-v2</code>, dari Python menggunakan pustaka pengubah kalimat HuggingFace. Kita akan menggunakan pustaka HF secara tidak langsung melalui pustaka util .txtai karena kita membutuhkan pembungkus di sekitar pengubah kalimat yang juga mengekspor lapisan penyatuan dan normalisasi setelah fungsi pengubah. (Lapisan-lapisan ini mengambil penyematan token yang bergantung pada konteks, yaitu keluaran dari transformator, dan mengubahnya menjadi penyematan teks tunggal).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Kami menginstruksikan perpustakaan untuk mengekspor <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> dari hub model HuggingFace sebagai ONNX, menetapkan tugas sebagai penyematan teks dan mengaktifkan kuantisasi model. Memanggil <code translate="no">onnx_model()</code> akan mengunduh model dari hub model jika belum ada secara lokal, mengonversi tiga lapisan ke ONNX, dan menggabungkan grafik komputasi mereka.</p>
<p>Apakah kita sudah siap untuk melakukan inferensi di Java? Tidak secepat itu. Model ini memasukkan daftar token (atau daftar daftar untuk lebih dari satu sampel) yang sesuai dengan tokenisasi teks yang ingin kita sematkan. Oleh karena itu, kecuali kita dapat melakukan semua tokenisasi sebelum waktu produksi, kita perlu menjalankan tokenizer dari dalam Java.</p>
<p>Ada beberapa pilihan untuk ini. Salah satunya adalah dengan mengimplementasikan atau menemukan implementasi tokenizer untuk model yang dimaksud di Java atau bahasa lain, dan memanggilnya dari Java sebagai pustaka statis atau dinamis. Solusi yang lebih mudah adalah mengubah tokenizer menjadi file ONNX dan menggunakannya dari Java, seperti halnya kita menggunakan file ONNX model.</p>
<p>Akan tetapi, ONNX biasa tidak mengandung operasi yang diperlukan untuk mengimplementasikan grafik komputasi tokenizer. Untuk alasan ini, Microsoft menciptakan sebuah pustaka untuk menambah ONNX yang disebut ONNXRuntime-Extensions. Library ini mendefinisikan operasi yang berguna untuk semua jenis pra dan pasca-pemrosesan data, tidak hanya tokenizer teks.</p>
<p>Berikut ini adalah cara kami mengekspor tokenizer kami sebagai file ONNX:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>Kita telah membuang decoder dari tokenizer, karena menyematkan kalimat tidak memerlukannya. Sekarang, kita memiliki dua file: <code translate="no">tokenizer.onnx</code> untuk tokenisasi teks, dan <code translate="no">model.onnx</code> untuk menyematkan string token.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Inferensi Model di Java<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>Menjalankan model kita dari dalam Java sekarang menjadi sangat mudah. Berikut ini adalah beberapa baris kode penting dari contoh lengkapnya:</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Imports required for Java/ONNX integration</span>
<span class="hljs-keyword">import</span> ai.onnxruntime.*;
<span class="hljs-keyword">import</span> ai.onnxruntime.extensions.*;

…

<span class="hljs-comment">// Set up inference sessions for tokenizer and model</span>
<span class="hljs-type">var</span> <span class="hljs-variable">env</span> <span class="hljs-operator">=</span> OrtEnvironment.getEnvironment();

<span class="hljs-type">var</span> <span class="hljs-variable">sess_opt</span> <span class="hljs-operator">=</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">OrtSession</span>.SessionOptions();
sess_opt.registerCustomOpLibrary(OrtxPackage.getLibraryPath());

<span class="hljs-type">var</span> <span class="hljs-variable">tokenizer</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/tokenizer.onnx&quot;</span>, sess_opt);
<span class="hljs-type">var</span> <span class="hljs-variable">model</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/model.onnx&quot;</span>, sess_opt);

…

<span class="hljs-comment">// Perform inference and extract text embeddings into native Java</span>
<span class="hljs-type">var</span> <span class="hljs-variable">results</span> <span class="hljs-operator">=</span> session.run(inputs).get(<span class="hljs-string">&quot;embeddings&quot;</span>);
<span class="hljs-type">float</span>[][] embeddings = (<span class="hljs-type">float</span>[][]) results.get().getValue();
<button class="copy-code-btn"></button></code></pre>
<p>Contoh kerja yang lengkap dapat ditemukan di bagian sumber daya.</p>
<h2 id="Summary" class="common-anchor-header">Ringkasan<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita telah melihat dalam posting ini bagaimana mungkin untuk mengekspor model sumber terbuka dari hub model HuggingFace dan menggunakannya secara langsung dari bahasa selain Python. Namun, kami mencatat beberapa peringatan:</p>
<p>Pertama, pustaka ONNX dan ekstensi runtime memiliki tingkat dukungan fitur yang berbeda-beda. Mungkin tidak mungkin untuk menggunakan semua model di semua bahasa sampai pembaruan SDK di masa mendatang dirilis. Pustaka runtime ONNX untuk Python, C++, Java, dan JavaScript adalah yang paling komprehensif.</p>
<p>Kedua, hub HuggingFace berisi ONNX yang sudah diekspor sebelumnya, tetapi model-model ini tidak menyertakan lapisan penyatuan dan normalisasi akhir. Anda harus mengetahui cara kerja <code translate="no">sentence-transformers</code> jika Anda berniat menggunakan <code translate="no">torch.onnx</code> secara langsung.</p>
<p>Namun demikian, ONNX mendapat dukungan dari para pemimpin industri utama dan sedang dalam proses untuk menjadi sarana tanpa hambatan untuk AI Generatif lintas platform.</p>
<h2 id="Resources" class="common-anchor-header">Sumber daya<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Contoh kode onnx dalam Python dan Java</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
