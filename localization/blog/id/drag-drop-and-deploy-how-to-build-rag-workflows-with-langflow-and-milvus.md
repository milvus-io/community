---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: >-
  Seret, Jatuhkan, dan Terapkan: Cara Membangun Alur Kerja RAG dengan Langflow
  dan Milvus
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/langflow_milvus_cover_9f75a11f90.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Pelajari cara membuat alur kerja RAG visual menggunakan Langflow dan Milvus.
  Seret, letakkan, dan terapkan aplikasi AI yang sadar konteks dalam hitungan
  menit-tanpa perlu pengkodean.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>Membangun alur kerja AI sering kali terasa lebih sulit dari yang seharusnya. Antara menulis kode lem, men-debug panggilan API, dan mengelola pipeline data, prosesnya bisa menghabiskan waktu berjam-jam bahkan sebelum Anda melihat hasilnya. <a href="https://www.langflow.org/"><strong>Langflow</strong></a> dan <a href="https://milvus.io/"><strong>Milvus</strong></a> menyederhanakan hal ini secara dramatis - memberi Anda cara yang ringan kode untuk mendesain, menguji, dan menerapkan alur kerja retrieval-augmented generation (RAG) dalam hitungan menit, bukan hari.</p>
<p><strong>Langflow</strong> menawarkan antarmuka seret dan lepas yang bersih yang terasa lebih seperti membuat sketsa ide di papan tulis daripada pengkodean. Anda bisa secara visual menghubungkan model bahasa, sumber data, dan alat bantu eksternal untuk mendefinisikan logika alur kerja Anda - semua tanpa menyentuh satu baris kode boilerplate.</p>
<p>Dipasangkan dengan <strong>Milvus</strong>, basis data vektor sumber terbuka yang memberikan memori jangka panjang dan pemahaman kontekstual kepada LLM, keduanya membentuk lingkungan yang lengkap untuk RAG tingkat produksi. Milvus secara efisien menyimpan dan mengambil penyematan dari data perusahaan atau data spesifik domain Anda, sehingga memungkinkan LLM untuk menghasilkan jawaban yang membumi, akurat, dan sadar konteks.</p>
<p>Dalam panduan ini, kita akan membahas cara menggabungkan Langflow dan Milvus untuk membangun alur kerja RAG tingkat lanjut - semuanya melalui beberapa seret, lepaskan, dan klik.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">Apa itu Langflow?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum melihat demo RAG, mari kita pelajari apa itu Langflow dan apa yang bisa dilakukannya.</p>
<p>Langflow adalah kerangka kerja sumber terbuka berbasis Python yang memudahkan untuk membangun dan bereksperimen dengan aplikasi AI. Framework ini mendukung kemampuan AI utama seperti agen dan Model Context Protocol (MCP), sehingga memberikan fondasi yang fleksibel bagi para pengembang dan non-pengembang untuk menciptakan sistem cerdas.</p>
<p>Pada intinya, Langflow menyediakan editor visual. Anda dapat menarik, melepas, dan menghubungkan berbagai sumber daya untuk mendesain aplikasi lengkap yang menggabungkan model, alat, dan sumber data. Ketika Anda mengekspor sebuah alur kerja, Langflow secara otomatis membuat sebuah file bernama <code translate="no">FLOW_NAME.json</code> pada mesin lokal Anda. File ini mencatat semua node, edge, dan metadata yang menggambarkan alur Anda, sehingga Anda dapat mengontrol versi, berbagi, dan mereproduksi proyek dengan mudah di seluruh tim.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Di balik layar, mesin runtime berbasis Python mengeksekusi alur. Mesin ini mengatur LLM, alat, modul pengambilan, dan logika perutean - mengelola aliran data, status, dan penanganan kesalahan untuk memastikan eksekusi yang lancar dari awal hingga akhir.</p>
<p>Langflow juga menyertakan pustaka komponen yang kaya dengan adapter prebuilt untuk LLM dan database vektor yang populer - termasuk <a href="https://milvus.io/">Milvus</a>. Anda dapat mengembangkannya lebih jauh dengan membuat komponen Python khusus untuk kasus penggunaan khusus. Untuk pengujian dan pengoptimalan, Langflow menawarkan eksekusi langkah demi langkah, Playground untuk pengujian cepat, dan integrasi dengan LangSmith dan Langfuse untuk memantau, men-debug, dan memutar ulang alur kerja dari ujung ke ujung.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">Demo Langsung: Cara Membangun Alur Kerja RAG dengan Langflow dan Milvus<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Dibangun di atas arsitektur Langflow, Milvus dapat berfungsi sebagai basis data vektor yang mengelola penyematan dan mengambil data perusahaan pribadi atau pengetahuan khusus domain.</p>
<p>Dalam demo ini, kita akan menggunakan templat RAG Vector Store Langflow untuk mendemonstrasikan cara mengintegrasikan Milvus dan membangun indeks vektor dari data lokal, sehingga memungkinkan jawaban pertanyaan yang efisien dan disesuaikan dengan konteks.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat: Persyaratan</h3><p>1. Python 3.11 (atau Conda)</p>
<p>2.uv</p>
<p>3. Docker &amp; Docker Compose</p>
<p>4. Kunci OpenAI</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">Langkah 1. Menyebarkan Basis Data Vektor Milvus</h3><p>Unduh berkas penerapan.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Mulai layanan Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">Langkah 2. Membuat Lingkungan Virtual Python</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">Langkah 3. Instal Paket Terbaru</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">Langkah 4. Luncurkan Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Kunjungi Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">Langkah 5. Konfigurasikan Templat RAG</h3><p>Pilih templat Vector Store RAG di Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pilih Milvus sebagai basis data vektor default Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Di panel kiri, cari "Milvus" dan tambahkan ke flow Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Konfigurasikan detail koneksi Milvus. Biarkan opsi lain sebagai default untuk saat ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tambahkan kunci API OpenAI Anda ke node yang relevan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">Langkah 6. Siapkan Data Uji</h3><p>Catatan: Gunakan FAQ resmi untuk Milvus 2.6 sebagai data uji.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">Langkah 7. Pengujian Tahap Pertama</h3><p>Unggah dataset Anda dan masukkan ke dalam Milvus. Catatan: Langflow akan mengubah teks Anda menjadi representasi vektor. Anda harus mengunggah setidaknya dua dataset, atau proses penyematan akan gagal. Ini adalah bug yang diketahui dalam implementasi node Langflow saat ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Periksa status node Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">Langkah 8. Pengujian Tahap Kedua</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">Langkah 9. Jalankan Alur Kerja RAG secara penuh</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Membangun alur kerja AI tidak harus rumit. Langflow + Milvus membuatnya cepat, visual, dan ringan kode - cara sederhana untuk meningkatkan RAG tanpa upaya rekayasa yang berat.</p>
<p>Antarmuka seret dan lepas Langflow menjadikannya pilihan yang cocok untuk pengajaran, lokakarya, atau demo langsung, di mana Anda perlu mendemonstrasikan cara kerja sistem AI dengan cara yang jelas dan interaktif. Untuk tim yang ingin mengintegrasikan desain alur kerja intuitif dengan pengambilan vektor tingkat perusahaan, menggabungkan kesederhanaan Langflow dengan pencarian berkinerja tinggi dari Milvus akan memberikan fleksibilitas dan kekuatan.</p>
<p>👉 Mulailah membangun alur kerja RAG yang lebih cerdas dengan <a href="https://milvus.io/">Milvus</a> hari ini.</p>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
