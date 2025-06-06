---
id: how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
title: >-
  Cara Mengatur OpenTelemetri dengan Milvus untuk Penelusuran Permintaan
  End-to-End
author: Yi Gong
date: 2025-06-05T00:00:00.000Z
desc: >-
  Memantau kinerja basis data vektor Milvus dengan penelusuran OpenTelemetry.
  Tutorial lengkap dengan pengaturan Docker, klien Python, visualisasi Jaeger,
  dan kiat-kiat debugging.
cover: >-
  assets.zilliz.com/How_to_Set_Up_Open_Telemetry_with_Milvus_for_End_to_End_Request_Tracing_f1842af82a.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Milvus tracing, OpenTelemetry, Jaeger observability, gRPC monitoring, vector
  database
meta_title: How to Set Up OpenTelemetry with Milvus for End-to-End Request Tracing
origin: >-
  https://milvus.io/blog/how-to-set-up-opentelemetry-with-milvus-for-end-to-end-request-tracing.md
---
<h2 id="Introduction" class="common-anchor-header">Pendahuluan<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika membangun aplikasi yang didukung AI dengan <a href="https://milvus.io/blog/what-is-a-vector-database.md">database vektor</a>, memahami kinerja sistem menjadi sangat penting seiring dengan meningkatnya skala aplikasi Anda. Satu permintaan pencarian dapat memicu beberapa operasi internal-pengindeksan vektor, penghitungan kemiripan, dan pengambilan data-di berbagai komponen. Tanpa pengamatan yang tepat, mendiagnosis perlambatan atau kegagalan menjadi seperti menemukan jarum di tumpukan jerami.</p>
<p>Pelacakan<strong>terdistribusi</strong> memecahkan masalah ini dengan melacak permintaan saat mereka mengalir melalui sistem Anda, memberikan gambaran lengkap tentang apa yang terjadi di balik layar.</p>
<p><a href="https://github.com/open-telemetry"><strong>OpenTelemetry (OTEL)</strong></a> adalah kerangka kerja pengamatan sumber terbuka yang didukung oleh <a href="https://www.cncf.io/">Cloud Native Computing Foundation (CNCF</a> ) yang membantu Anda mengumpulkan jejak, metrik, dan log dari aplikasi Anda. OTEL bersifat netral terhadap vendor, diadopsi secara luas, dan bekerja secara mulus dengan alat pemantauan populer.</p>
<p>Dalam panduan ini, kami akan menunjukkan kepada Anda cara menambahkan penelusuran ujung ke ujung ke <a href="https://milvus.io/"><strong>Milvus</strong></a>, basis data vektor berkinerja tinggi yang dibuat untuk aplikasi AI. Anda akan belajar melacak segala sesuatu mulai dari permintaan klien hingga operasi basis data internal, sehingga pengoptimalan kinerja dan debugging menjadi lebih mudah.</p>
<p>Kami juga akan menggunakan <a href="https://github.com/jaegertracing/jaeger-ui"><strong>Jaeger</strong></a> untuk memvisualisasikan data pelacakan, memberi Anda wawasan yang kuat ke dalam operasi basis data vektor Anda.</p>
<h2 id="What-Well-Build" class="common-anchor-header">Apa yang Akan Kita Bangun<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada akhir tutorial ini, Anda akan memiliki pipeline penelusuran lengkap yang terdiri dari:</p>
<ol>
<li><p><strong>Basis data vektor Milvus</strong> dengan penelusuran OpenTelemetri yang diaktifkan</p></li>
<li><p><strong>Jaeger</strong> untuk visualisasi dan analisis jejak</p></li>
<li><p><strong>Klien Python</strong> yang secara otomatis melacak semua operasi Milvus</p></li>
<li><p><strong>Visibilitas ujung ke ujung</strong> dari permintaan klien ke operasi basis data</p></li>
</ol>
<p>Perkiraan waktu penyiapan: 15-20 menit</p>
<h2 id="Quick-Start-5-Minutes" class="common-anchor-header">Mulai Cepat (5 Menit)<button data-href="#Quick-Start-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Ingin melihatnya bekerja terlebih dahulu? Inilah jalur tercepatnya:</p>
<ol>
<li>Kloning repositori demo:</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/milvus-py-otel
<span class="hljs-built_in">cd</span> milvus-py-otel
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Mulai layanan:</li>
</ol>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li><p>Tunggu 30 detik, lalu periksa Jaeger UI di: <code translate="no">http://localhost:16686</code></p></li>
<li><p>Jalankan contoh Python:</p></li>
</ol>
<pre><code translate="no">pip install -r requirements.txt
python example.py
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Segarkan Jaeger dan cari jejak dari layanan <code translate="no">standalone</code> (Milvus) dan <code translate="no">milvus-client</code>.</li>
</ol>
<p>Jika Anda melihat jejak muncul, semuanya berfungsi! Sekarang mari kita pahami bagaimana semuanya bekerja bersama-sama.</p>
<h2 id="Environment-Setup" class="common-anchor-header">Pengaturan Lingkungan<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Inilah yang Anda perlukan:</p>
<ul>
<li><p><strong>Milvus 2.5.11</strong> (basis data vektor)</p></li>
<li><p><strong>Jaeger 1.46.0</strong> (visualisasi jejak)</p></li>
<li><p><strong>Python 3.7+</strong> (pengembangan klien)</p></li>
<li><p><strong>Docker dan Docker Compose</strong> (orkestrasi kontainer)</p></li>
</ul>
<p>Versi ini telah diuji bersama; namun, versi yang lebih baru juga akan bekerja dengan baik.</p>
<h2 id="Setting-Up-Milvus-and-Jaeger" class="common-anchor-header">Menyiapkan Milvus dan Jaeger<button data-href="#Setting-Up-Milvus-and-Jaeger" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita akan menggunakan Docker Compose untuk menjalankan kedua layanan dengan jaringan dan konfigurasi yang tepat.</p>
<h3 id="Docker-Compose-Configuration" class="common-anchor-header">Konfigurasi Docker Compose</h3><p>Buat berkas <code translate="no">docker-compose.yaml</code>:</p>
<pre><code translate="no">version: <span class="hljs-string">&#x27;3.7&#x27;</span>
Services:
<span class="hljs-comment"># Milvus - configured to send traces to Jaeger</span>
  milvus:
    image: milvusdb/milvus:v2.5.11
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    environment:
      - ETCD_USE_EMBED=<span class="hljs-literal">true</span>
      - ETCD_DATA_DIR=/var/lib/milvus/etcd
      - ETCD_CONFIG_PATH=/milvus/configs/embedEtcd.yaml
      - COMMON_STORAGETYPE=<span class="hljs-built_in">local</span>
    volumes:
      - ./embedEtcd.yaml:/milvus/configs/embedEtcd.yaml
      - ./milvus.yaml:/milvus/configs/milvus.yaml
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    security_opt:
      - seccomp:unconfined
    depends_on:
      - jaeger

<span class="hljs-comment"># Jaeger - starts first since Milvus depends on it</span>
  jaeger:
    image: jaegertracing/all-in-one:1.46.0
    ports:
      - <span class="hljs-string">&quot;16686:16686&quot;</span>  <span class="hljs-comment"># Jaeger UI</span>
      - <span class="hljs-string">&quot;4317:4317&quot;</span>    <span class="hljs-comment"># OTLP gRPC receiver</span>
      - <span class="hljs-string">&quot;4318:4318&quot;</span>    <span class="hljs-comment"># OTLP HTTP receiver</span>
      - <span class="hljs-string">&quot;5778:5778&quot;</span>    <span class="hljs-comment"># Jaeger agent configs</span>
      - <span class="hljs-string">&quot;9411:9411&quot;</span>    <span class="hljs-comment"># Zipkin compatible endpoint</span>
    environment:
      - COLLECTOR_OTLP_ENABLED=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Catatan:</strong> Contoh berkas konfigurasi <code translate="no">embedEtcd.yaml</code> dan <code translate="no">milvus.yaml</code> dapat ditemukan di: <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel.</a></p>
<h3 id="Milvus-Tracing-Configuration" class="common-anchor-header">Konfigurasi Penelusuran Milvus</h3><p>Buat <code translate="no">configs/milvus.yaml</code> dengan konfigurasi penelusuran:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry tracing configuration</span>
trace:
  exporter: otlp           <span class="hljs-comment"># Use OpenTelemetry Protocol</span>
  sampleFraction: 1.0      <span class="hljs-comment"># Trace 100% of requests (reduce for production)</span>
  otlp:
    endpoint: jaeger:4317  <span class="hljs-comment"># Jaeger&#x27;s OTLP gRPC endpoint</span>
    method: grpc          <span class="hljs-comment"># Use gRPC protocol</span>
    secure: <span class="hljs-literal">false</span>         <span class="hljs-comment"># No TLS (use true in production)</span>
    initTimeoutSeconds: 10
<button class="copy-code-btn"></button></code></pre>
<p>Konfigurasi dijelaskan:</p>
<ul>
<li><p><code translate="no">sampleFraction: 1.0</code> melacak setiap permintaan (berguna untuk pengembangan, tetapi gunakan 0.1 atau lebih rendah dalam produksi)</p></li>
<li><p><code translate="no">secure: false</code> menonaktifkan TLS (aktifkan dalam produksi)</p></li>
<li><p><code translate="no">endpoint: jaeger:4317</code> menggunakan nama layanan Docker untuk komunikasi internal</p></li>
</ul>
<h3 id="Starting-the-Services" class="common-anchor-header">Memulai Layanan</h3><pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h3 id="Verifying-Trace-Delivery-from-Milvus-to-Jaeger" class="common-anchor-header">Memverifikasi Pengiriman Jejak dari Milvus ke Jaeger</h3><p>Setelah layanan berjalan, Anda dapat memverifikasi apakah data jejak dipancarkan dari Milvus mandiri dan diterima oleh Jaeger.</p>
<ul>
<li><p>Buka browser Anda dan kunjungi Jaeger UI di: <code translate="no">http://localhost:16686/search</code></p></li>
<li><p>Pada panel <strong>Pencarian</strong> (kiri atas), pilih menu tarik-turun <strong>Layanan</strong> dan pilih <code translate="no">standalone</code>. Jika Anda melihat <code translate="no">standalone</code> dalam daftar layanan, itu berarti konfigurasi OpenTelemetri bawaan Milvus berfungsi dan telah berhasil mendorong data jejak ke Jaeger.</p></li>
<li><p>Klik <strong>Cari Jejak</strong> untuk menjelajahi rantai jejak yang dihasilkan oleh komponen internal Milvus (seperti interaksi gRPC antar modul).</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/find_traces_811bf9d8ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="If-Trace-Data-Is-Not-Showing" class="common-anchor-header">Jika Data Jejak Tidak Muncul:</h3><ul>
<li><p>Periksa kembali apakah blok <code translate="no">trace</code> di <code translate="no">milvus.yaml</code> telah dikonfigurasi dengan benar dan Jaeger berjalan tanpa masalah.</p></li>
<li><p>Periksa log kontainer Milvus untuk melihat apakah ada kesalahan yang terkait dengan inisialisasi Trace.</p></li>
<li><p>Tunggu beberapa detik dan segarkan UI Jaeger; pelaporan jejak mungkin mengalami penundaan singkat.</p></li>
</ul>
<h2 id="Python-Client-Setup-and-Dependencies" class="common-anchor-header">Pengaturan Klien Python dan Ketergantungan<button data-href="#Python-Client-Setup-and-Dependencies" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang mari kita siapkan klien Python untuk melacak semua operasi Milvus secara otomatis.</p>
<p>Pertama, buat file <code translate="no">requirements.txt</code>:</p>
<pre><code translate="no"><span class="hljs-comment"># OpenTelemetry core</span>
opentelemetry-api==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-sdk==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># OTLP exporters</span>
opentelemetry-exporter-otlp==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
opentelemetry-exporter-otlp-proto-grpc==<span class="hljs-number">1.33</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Automatic gRPC instrumentation</span>
opentelemetry-instrumentation-grpc==<span class="hljs-number">0.54</span>b1
<span class="hljs-comment"># Milvus client</span>
pymilvus==<span class="hljs-number">2.5</span><span class="hljs-number">.9</span>
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian instal dependensi melalui:</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p>Ini memastikan lingkungan Python Anda siap untuk melacak panggilan gRPC yang dibuat ke backend Milvus.</p>
<h2 id="Initializing-OpenTelemetry-in-Python" class="common-anchor-header">Menginisialisasi OpenTelemetry di Python<button data-href="#Initializing-OpenTelemetry-in-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang, mari kita mengonfigurasi penelusuran di dalam aplikasi Python Anda. Cuplikan ini menyiapkan OTEL dengan instrumentasi gRPC dan menyiapkan pelacak.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace
<span class="hljs-keyword">from</span> opentelemetry.sdk.resources <span class="hljs-keyword">import</span> Resource
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace <span class="hljs-keyword">import</span> TracerProvider
<span class="hljs-keyword">from</span> opentelemetry.sdk.trace.export <span class="hljs-keyword">import</span> BatchSpanProcessor
<span class="hljs-keyword">from</span> opentelemetry.exporter.otlp.proto.grpc.trace_exporter <span class="hljs-keyword">import</span> OTLPSpanExporter
<span class="hljs-keyword">from</span> opentelemetry.instrumentation.grpc <span class="hljs-keyword">import</span> GrpcInstrumentorClient

<span class="hljs-comment"># Set OTEL environment variables (you can also load them from external configs)</span>
os.environ[<span class="hljs-string">&#x27;OTEL_EXPORTER_OTLP_ENDPOINT&#x27;</span>] = <span class="hljs-string">&#x27;http://localhost:4317&#x27;</span>
os.environ[<span class="hljs-string">&#x27;OTEL_SERVICE_NAME&#x27;</span>] = <span class="hljs-string">&#x27;milvus-client&#x27;</span>

<span class="hljs-comment"># Define service metadata</span>
resource = Resource.create({
    <span class="hljs-string">&quot;service.name&quot;</span>: <span class="hljs-string">&quot;milvus-client&quot;</span>,
    <span class="hljs-string">&quot;application&quot;</span>: <span class="hljs-string">&quot;milvus-otel-test&quot;</span>
})

<span class="hljs-comment"># Initialize tracer and export processor</span>
trace.set_tracer_provider(
    TracerProvider(resource=resource)
)
otlp_exporter = OTLPSpanExporter()
span_processor = BatchSpanProcessor(otlp_exporter)
trace.get_tracer_provider().add_span_processor(span_processor)

<span class="hljs-comment"># Enable automatic instrumentation for gRPC clients</span>
grpc_client_instrumentor = GrpcInstrumentorClient()
grpc_client_instrumentor.instrument()

<span class="hljs-comment"># Acquire tracer</span>
tracer = trace.get_tracer(__name__)
<button class="copy-code-btn"></button></code></pre>
<p>Di sini, <code translate="no">GrpcInstrumentorClient()</code> terhubung ke tumpukan gRPC yang mendasarinya sehingga Anda tidak perlu memodifikasi kode klien secara manual untuk instrumentasi. <code translate="no">OTLPSpanExporter()</code> dikonfigurasikan untuk mengirim data pelacakan ke instance Jaeger lokal Anda.</p>
<h2 id="Complete-Milvus-Python-Example-with-Tracing" class="common-anchor-header">Contoh Milvus Python Lengkap dengan Pelacakan<button data-href="#Complete-Milvus-Python-Example-with-Tracing" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang mari kita buat contoh komprehensif yang mendemonstrasikan tracing dengan operasi Milvus yang realistis:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> opentelemetry <span class="hljs-keyword">import</span> trace

<span class="hljs-keyword">with</span> tracer.start_as_current_span(<span class="hljs-string">&quot;test_milvus_otel&quot;</span>):
    milvus_client = MilvusClient(
        uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    )
    collection_name = <span class="hljs-string">&quot;quick_setup&quot;</span>

    <span class="hljs-comment"># Drop collection if it exists</span>
    <span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
        milvus_client.drop_collection(collection_name)

    <span class="hljs-comment"># Create collection</span>
    milvus_client.create_collection(
        collection_name=collection_name,
        dimension=<span class="hljs-number">5</span>
    )

    <span class="hljs-comment"># Add additional operations here</span>
    
    milvus_client.close()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Viewing-Trace-Output" class="common-anchor-header">Melihat Keluaran Jejak<button data-href="#Viewing-Trace-Output" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah klien Python Anda mengirimkan data trace, kembalilah ke Jaeger: <a href="http://localhost:16686"><code translate="no">http://localhost:16686</code></a></p>
<p>Pilih layanan <code translate="no">milvus-client</code> untuk melihat rentang jejak yang sesuai dengan operasi Milvus klien Python Anda. Hal ini akan mempermudah untuk menganalisis kinerja dan melacak interaksi di seluruh batas sistem.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_client_22aab6ab9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Examples-in-Other-Languages" class="common-anchor-header">Contoh dalam Bahasa Lain<button data-href="#Examples-in-Other-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain Python, Anda dapat mengimplementasikan penelusuran Milvus dalam bahasa lain:</p>
<p>Bahasa <a href="https://github.com/topikachu/milvus-java-otel"><strong>Jawa</strong></a>: Gunakan Agen Java OpenTelemetry untuk instrumentasi tanpa kode <a href="https://github.com/topikachu/milvus-go-otel"><strong>👉Go</strong></a>: Memanfaatkan OpenTelemetry Go SDK untuk integrasi asli 👉Node<a href="https://github.com/topikachu/milvus-nodejs-otel"><strong>.js</strong></a>: Panggilan gRPC instrumen otomatis dengan JavaScript SDK</p>
<p>Setiap contoh mengikuti pola yang sama tetapi menggunakan pustaka OpenTelemetry yang spesifik untuk bahasa tertentu.</p>
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
    </button></h2><p>Anda telah berhasil mengimplementasikan penelusuran ujung ke ujung untuk operasi Milvus! Inilah yang telah Anda capai:</p>
<ul>
<li><p>✅ <strong>Infrastruktur</strong>: Menyiapkan Milvus dan Jaeger dengan jaringan yang tepat</p></li>
<li><p>✅ <strong>Penelusuran sisi server</strong>: Mengonfigurasi Milvus untuk mengekspor jejak secara otomatis</p></li>
<li><p>✅ <strong>Penelusuran sisi klien</strong>: Klien Python yang terinstrumentasi dengan OpenTelemetry</p></li>
<li><p>✅ <strong>Visualisasi</strong>: Menggunakan Jaeger untuk menganalisis kinerja sistem</p></li>
<li><p><strong>Kesiapan produksi</strong>: Mempelajari praktik terbaik konfigurasi</p></li>
</ul>
<p>Semua bekerja tanpa perubahan apa pun pada kode sumber Milvus SDK. Hanya dengan beberapa pengaturan konfigurasi dan pipeline penelusuran Anda langsung sederhana, efektif, dan siap untuk produksi.</p>
<p>Anda dapat melangkah lebih jauh dengan mengintegrasikan log dan metrik untuk membangun solusi pemantauan lengkap untuk penerapan basis data vektor asli AI Anda.</p>
<h2 id="Learn-More" class="common-anchor-header">Pelajari Lebih Lanjut<button data-href="#Learn-More" class="anchor-icon" translate="no">
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
<li><p>Dokumentasi Milvus: <a href="https://milvus.io/docs">https://milvus.io/docs</a></p></li>
<li><p>OpenTelemetry untuk Python: <a href="https://opentelemetry.io/docs/instrumentation/python/">https://opentelemetry.io/docs/instrumentation/python/</a></p></li>
<li><p>Dokumentasi Jaeger: <a href="https://www.jaegertracing.io/docs/">https://www.jaegertracing.io/docs/</a></p></li>
<li><p>Demo Integrasi Milvus OpenTelemetry (Python): <a href="https://github.com/topikachu/milvus-py-otel">https://github.com/topikachu/milvus-py-otel</a></p></li>
</ul>
