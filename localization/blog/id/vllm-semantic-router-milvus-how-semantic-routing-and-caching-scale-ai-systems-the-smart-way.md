---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >-
  vLLM Semantic Router + Milvus: Bagaimana Perutean Semantik dan Caching
  Membangun Sistem AI yang Dapat Diskalakan dengan Cara Cerdas
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  Pelajari bagaimana vLLM, Milvus, dan perutean semantik mengoptimalkan
  inferensi model yang besar, mengurangi biaya komputasi, dan meningkatkan
  kinerja AI di seluruh penerapan yang dapat diskalakan.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>Sebagian besar aplikasi AI mengandalkan satu model untuk setiap permintaan. Tetapi pendekatan itu dengan cepat mengalami keterbatasan. Model yang besar sangat kuat namun mahal, bahkan ketika digunakan untuk kueri sederhana. Model yang lebih kecil lebih murah dan lebih cepat, namun tidak dapat menangani penalaran yang rumit. Ketika lalu lintas melonjak-katakanlah aplikasi AI Anda tiba-tiba menjadi viral dengan sepuluh juta pengguna dalam semalam-inefisiensi pengaturan satu model untuk semua ini menjadi sangat jelas. Latensi melonjak, tagihan GPU meledak, dan model yang berjalan dengan baik kemarin mulai terengah-engah.</p>
<p>Dan teman saya, <em>Anda</em>, insinyur di balik aplikasi ini, harus memperbaikinya-cepat.</p>
<p>Bayangkan jika Anda menggunakan beberapa model dengan ukuran yang berbeda-beda dan sistem Anda secara otomatis memilih model terbaik untuk setiap permintaan. Permintaan sederhana akan diarahkan ke model yang lebih kecil; permintaan yang rumit akan diarahkan ke model yang lebih besar. Itulah ide di balik <a href="https://github.com/vllm-project/semantic-router"><strong>vLLM Semantic Router-mekanisme</strong></a>perutean yang mengarahkan permintaan berdasarkan makna, bukan titik akhir. Mekanisme ini menganalisis konten semantik, kompleksitas, dan maksud dari setiap input untuk memilih model bahasa yang paling sesuai, memastikan setiap kueri ditangani oleh model yang paling siap untuk itu.</p>
<p>Untuk membuatnya lebih efisien, Semantic Router berpasangan dengan <a href="https://milvus.io/"><strong>Milvus</strong></a>, sebuah basis data vektor sumber terbuka yang berfungsi sebagai <strong>lapisan cache semantik</strong>. Sebelum menghitung ulang respons, router ini memeriksa apakah kueri yang secara semantik serupa telah diproses dan langsung mengambil hasil cache jika ditemukan. Hasilnya: respons yang lebih cepat, biaya yang lebih rendah, dan sistem pengambilan yang berskala secara cerdas dan tidak boros.</p>
<p>Dalam artikel ini, kita akan membahas lebih dalam tentang cara kerja <strong>vLLM Semantic Router</strong>, bagaimana <strong>Milvus</strong> mendukung lapisan caching-nya, dan bagaimana arsitektur ini dapat diterapkan dalam aplikasi AI dunia nyata.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">Apa yang dimaksud dengan Router Semantik?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada intinya, <strong>Semantic Router</strong> adalah sistem yang memutuskan <em>model mana</em> yang harus menangani permintaan yang diberikan berdasarkan makna, kompleksitas, dan maksudnya. Alih-alih merutekan semuanya ke satu model, router ini mendistribusikan permintaan secara cerdas di beberapa model untuk menyeimbangkan akurasi, latensi, dan biaya.</p>
<p>Secara arsitektur, ini dibangun di atas tiga lapisan utama: <strong>Perutean Semantik</strong>, <strong>Campuran Model (Mixture of Models/MoM)</strong>, dan <strong>Lapisan Cache</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">Lapisan Perutean Semantik</h3><p><strong>Lapisan perutean semantik</strong> adalah otak dari sistem. Lapisan ini menganalisis setiap masukan-apa yang diminta, seberapa kompleks, dan penalaran seperti apa yang dibutuhkan-untuk memilih model yang paling sesuai untuk pekerjaan tersebut. Misalnya, pencarian fakta sederhana dapat menggunakan model yang ringan, sementara kueri penalaran multi-langkah dialihkan ke model yang lebih besar. Perutean dinamis ini membuat sistem tetap responsif bahkan ketika lalu lintas dan keragaman kueri meningkat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">Lapisan Campuran Model (MoM)</h3><p>Lapisan kedua, <strong>Mixture of Models (MoM</strong>), mengintegrasikan beberapa model dengan ukuran dan kemampuan yang berbeda ke dalam satu sistem terpadu. Ini terinspirasi oleh arsitektur <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mixture of Experts</strong></a> <strong>(MoE)</strong>, tetapi alih-alih memilih "ahli" di dalam satu model besar, ia beroperasi di beberapa model independen. Desain ini mengurangi latensi, menurunkan biaya, dan menghindari terkunci pada satu penyedia model.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">Lapisan Cache: Di mana Milvus Membuat Perbedaan</h3><p>Terakhir, <strong>lapisan cache-yang didukung</strong>oleh <a href="https://milvus.io/">Milvus Vector Database-bertindak</a>sebagai memori sistem. Sebelum menjalankan kueri baru, lapisan ini memeriksa apakah permintaan yang secara semantik serupa telah diproses sebelumnya. Jika ya, ia akan mengambil hasil yang di-cache secara instan, menghemat waktu komputasi dan meningkatkan throughput.</p>
<p>Sistem caching tradisional mengandalkan penyimpanan nilai kunci dalam memori, mencocokkan permintaan dengan string atau templat yang tepat. Hal ini bekerja dengan baik ketika kueri berulang dan dapat diprediksi. Namun, pengguna sebenarnya jarang mengetikkan hal yang sama dua kali. Begitu frasa berubah - bahkan sedikit saja - cache gagal mengenalinya sebagai maksud yang sama. Seiring waktu, hit rate cache akan menurun, dan peningkatan performa akan hilang seiring dengan perubahan bahasa secara alami.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk mengatasinya, kita membutuhkan cache yang memahami <em>makna</em>, bukan hanya mencocokkan kata-kata. Di situlah <strong>pengambilan semantik</strong> masuk. Alih-alih membandingkan string, ia membandingkan embeddings-representasi vektor berdimensi tinggi yang menangkap kemiripan semantik. Namun, tantangannya adalah skala. Menjalankan pencarian brute-force di jutaan atau miliaran vektor pada satu mesin (dengan kompleksitas waktu O(N-d)) secara komputasi sangat mahal. Biaya memori meledak, skalabilitas horizontal runtuh, dan sistem kesulitan menangani lonjakan lalu lintas yang tiba-tiba atau kueri berekor panjang.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sebagai basis data vektor terdistribusi yang dibuat khusus untuk pencarian semantik berskala besar, <strong>Milvus</strong> menghadirkan skalabilitas horizontal dan toleransi kesalahan yang dibutuhkan oleh lapisan cache ini. Milvus menyimpan embedding secara efisien di seluruh node dan melakukan pencarian <a href="https://zilliz.com/blog/ANN-machine-learning">Approximate Nearest Neighbor</a>(ANN) dengan latensi minimal, bahkan dalam skala besar. Dengan ambang batas kemiripan dan strategi fallback yang tepat, Milvus memastikan kinerja yang stabil dan dapat diprediksi-mengubah lapisan cache menjadi memori semantik yang tangguh untuk seluruh sistem perutean Anda.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">Bagaimana Pengembang Menggunakan Semantic Router + Milvus dalam Produksi<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Kombinasi <strong>vLLM Semantic Router</strong> dan <strong>Milvus</strong> bersinar di lingkungan produksi dunia nyata di mana kecepatan, biaya, dan penggunaan ulang adalah hal yang penting.</p>
<p>Ada tiga skenario umum yang menonjol:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. Tanya Jawab Layanan Pelanggan</h3><p>Bot yang berhadapan dengan pelanggan menangani volume besar kueri berulang setiap hari-pengaturan ulang kata sandi, pembaruan akun, status pengiriman. Domain ini sensitif terhadap biaya dan latensi, sehingga ideal untuk perutean semantik. Router mengirimkan pertanyaan rutin ke model yang lebih kecil dan lebih cepat dan meningkatkan pertanyaan yang kompleks atau ambigu ke model yang lebih besar untuk penalaran yang lebih dalam. Sementara itu, Milvus menyimpan pasangan tanya jawab sebelumnya, jadi ketika pertanyaan serupa muncul, sistem dapat langsung menggunakan kembali jawaban sebelumnya alih-alih membuat ulang.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. Bantuan Kode</h3><p>Dalam alat pengembang atau asisten IDE, banyak pertanyaan yang tumpang tindih-bantuan sintaksis, pencarian API, petunjuk debugging kecil. Dengan menganalisis struktur semantik dari setiap prompt, router secara dinamis memilih ukuran model yang sesuai: ringan untuk tugas-tugas sederhana, lebih mampu untuk penalaran multi-langkah. Milvus meningkatkan daya tanggap lebih jauh dengan menyimpan masalah pengkodean serupa dan solusinya, mengubah interaksi pengguna sebelumnya menjadi basis pengetahuan yang dapat digunakan kembali.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. Basis Pengetahuan Perusahaan</h3><p>Pertanyaan perusahaan cenderung berulang dari waktu ke waktu-pencarian kebijakan, referensi kepatuhan, FAQ produk. Dengan Milvus sebagai lapisan cache semantik, pertanyaan yang sering diajukan dan jawabannya dapat disimpan dan diambil secara efisien. Hal ini meminimalkan komputasi yang berlebihan sekaligus menjaga agar respons tetap konsisten di seluruh departemen dan wilayah.</p>
<p>Di balik kap mesin, pipa <strong>Semantic Router + Milvus</strong> diimplementasikan dalam <strong>Go</strong> dan <strong>Rust</strong> untuk kinerja tinggi dan latensi rendah. Terintegrasi pada lapisan gateway, ia terus memantau metrik utama-seperti hit rate, latensi perutean, dan kinerja model-untuk menyempurnakan strategi perutean secara real time.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">Cara Menguji Caching Semantik dengan Cepat di Router Semantik<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum menerapkan semantic caching dalam skala besar, ada baiknya untuk memvalidasi bagaimana perilakunya dalam pengaturan yang terkendali. Pada bagian ini, kita akan membahas pengujian lokal cepat yang menunjukkan bagaimana Semantic Router menggunakan <strong>Milvus</strong> sebagai cache semantik. Anda akan melihat bagaimana kueri yang mirip langsung masuk ke cache sementara kueri baru atau berbeda memicu pembuatan model-membuktikan logika caching bekerja.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><ul>
<li>Lingkungan kontainer: Docker + Docker Compose</li>
<li>Basis Data Vektor: Layanan Milvus</li>
<li>LLM + Penyematan: Proyek diunduh secara lokal</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1. Menerapkan Basis Data Vektor Milvus</h3><p>Unduh file penyebaran</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Mulai layanan Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. Kloning proyek</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. Unduh model lokal</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. Modifikasi Konfigurasi</h3><p>Catatan: Ubah tipe semantic_cache menjadi milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Memodifikasi konfigurasi Milvus Catatan: Isi layanan Milvusmilvus yang baru saja digunakan</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. Memulai proyek</h3><p>Catatan: Direkomendasikan untuk memodifikasi beberapa dependensi Dockerfile ke sumber domestik</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. Permintaan Pengujian</h3><p>Catatan: Total dua permintaan (tidak ada cache dan cache hit) Permintaan pertama:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Permintaan kedua:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Pengujian ini mendemonstrasikan cache semantik Semantic Router yang sedang bekerja. Dengan memanfaatkan Milvus sebagai basis data vektor, secara efisien mencocokkan kueri yang secara semantik mirip, meningkatkan waktu respons ketika pengguna mengajukan pertanyaan yang sama atau mirip.</p>
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
    </button></h2><p>Seiring dengan bertambahnya beban kerja AI dan pengoptimalan biaya menjadi sangat penting, kombinasi vLLM Semantic Router dan <a href="https://milvus.io/">Milvus</a> menyediakan cara praktis untuk menskalakan secara cerdas. Dengan merutekan setiap kueri ke model yang tepat dan menyimpan hasil yang secara semantik mirip dengan basis data vektor terdistribusi, pengaturan ini memangkas overhead komputasi sekaligus menjaga respons tetap cepat dan konsisten di seluruh kasus penggunaan.</p>
<p>Singkatnya, Anda mendapatkan penskalaan yang lebih cerdas-kurang kekerasan, lebih banyak otak.</p>
<p>Jika Anda ingin menjelajahi hal ini lebih jauh, bergabunglah dengan percakapan di <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> kami atau buka masalah di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> sesi Milvus Office Hours</a> selama 20 menit untuk mendapatkan panduan, wawasan, dan pendalaman teknis dari tim di balik Milvus.</p>
