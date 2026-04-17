---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: >-
  Ulasan GPT-5: Akurasi Naik, Harga Turun, Kode Kuat - Tetapi Buruk untuk
  Kreativitas
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: >-
  Bagi para pengembang, terutama mereka yang membangun agen dan pipeline RAG,
  rilis ini mungkin merupakan peningkatan yang paling berguna.
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>Setelah berbulan-bulan berspekulasi, OpenAI akhirnya meluncurkan</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>.</strong> Model ini bukanlah sambaran petir yang kreatif seperti GPT-4, tetapi bagi para pengembang, terutama mereka yang membangun agen dan jaringan pipa RAG, rilis ini mungkin merupakan peningkatan yang paling berguna.</p>
<p><strong>TL; DR untuk para pembangun:</strong> GPT-5 menyatukan arsitektur, meningkatkan I/O multimodal, memangkas tingkat kesalahan faktual, memperluas konteks hingga 400 ribu token, dan membuat penggunaan skala besar menjadi terjangkau. Namun, kreativitas dan bakat sastra telah mengalami kemunduran yang nyata.</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">Apa yang Baru di Balik Layar?<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>Inti terpadu</strong> - Menggabungkan seri digital GPT dengan model penalaran o-series, memberikan penalaran rantai panjang plus multimodal dalam satu arsitektur.</p></li>
<li><p><strong>Multimodal spektrum penuh</strong> - Input/output di seluruh teks, gambar, audio, dan video, semuanya dalam model yang sama.</p></li>
<li><p><strong>Peningkatan akurasi yang sangat besar</strong>:</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>: 44% lebih sedikit kesalahan faktual vs GPT-4o.</p></li>
<li><p><code translate="no">gpt-5-thinking</code>78% lebih sedikit kesalahan faktual vs. o3.</p></li>
</ul></li>
<li><p><strong>Peningkatan keterampilan domain</strong> - Lebih kuat dalam pembuatan kode, penalaran matematis, konsultasi kesehatan, dan penulisan terstruktur; halusinasi berkurang secara signifikan.</p></li>
</ul>
<p>Bersamaan dengan GPT-5, OpenAI juga merilis <strong>tiga varian tambahan</strong>, masing-masing dioptimalkan untuk kebutuhan yang berbeda:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>Model</strong></th><th><strong>Deskripsi</strong></th><th><strong>Masukan / $ per 1 juta token</strong></th><th><strong>Keluaran / $ per 1 juta token</strong></th><th><strong>Pembaruan Pengetahuan</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>Model utama, penalaran rantai panjang + multimodal penuh</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-chat</td><td>Setara dengan gpt-5, digunakan dalam percakapan ChatGPT</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60% lebih murah, mempertahankan ~90% kinerja pemrograman</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>Tepi / offline, konteks 32K, latensi &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 memecahkan rekor di 25 kategori tolok ukur - mulai dari perbaikan kode, penalaran multimodal, hingga tugas medis - dengan peningkatan akurasi yang konsisten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">Mengapa Pengembang Harus Peduli - Khususnya untuk RAG &amp; Agen<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengujian langsung kami menunjukkan bahwa rilis ini merupakan revolusi yang tenang untuk Retrieval-Augmented Generation dan alur kerja yang digerakkan oleh agen.</p>
<ol>
<li><p><strong>Pemotongan harga</strong> membuat eksperimen menjadi layak - Biaya input API: <strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1,25 per juta</mn><mo>token∗∗</mo></mrow><annotation encoding="application/x-tex">;</annotation><mrow><mi>biaya</mi><mi>output</mi><mo>:</mo><mo>∗∗1</mo></mrow><annotation encoding="application/x-tex">,25 per juta token**; biaya output: **</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1 <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.25 per juta</span><span class="mord mathnormal">token</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span> ∗</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">biaya</span><span class="mord mathnormal">keluaran</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>: <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗10</span></span></span></span></strong>.</p></li>
<li><p><strong>Jendela konteks 400k</strong> (vs. 128k di o3/4o) memungkinkan Anda untuk mempertahankan status di seluruh alur kerja agen multi-langkah yang kompleks tanpa memotong konteks.</p></li>
<li><p><strong>Lebih sedikit halusinasi &amp; penggunaan alat yang lebih baik</strong> - Mendukung pemanggilan alat berantai multi-langkah, menangani tugas-tugas non-standar yang kompleks, dan meningkatkan keandalan eksekusi.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">Bukan Tanpa Kekurangan<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>Terlepas dari kemajuan teknisnya, GPT-5 masih menunjukkan batasan yang jelas.</p>
<p>Pada saat peluncuran, presentasi utama OpenAI menampilkan slide yang secara aneh menghitung <em>52,8 &gt; 69,1 = 30,8</em>, dan dalam pengujian kami sendiri, model tersebut dengan percaya diri mengulangi penjelasan "efek Bernoulli" yang ada di buku teks-tetapi salah tentang daya angkat pesawat-mengingatkan kita bahwa model <strong>ini masih merupakan pembelajar pola, bukan ahli domain sejati</strong>.</p>
<p><strong>Sementara performa STEM semakin meningkat, kedalaman kreatifitas justru menurun.</strong> Banyak pengguna lama yang mencatat adanya penurunan bakat sastra: puisi terasa datar, percakapan filosofis kurang bernuansa, dan narasi panjang lebih mekanis. Pertukarannya jelas-akurasi faktual yang lebih tinggi dan penalaran yang lebih kuat dalam domain teknis, tetapi dengan mengorbankan nada eksploratif dan berseni yang pernah membuat GPT terasa hampir seperti manusia.</p>
<p>Dengan mengingat hal tersebut, mari kita lihat bagaimana kinerja GPT-5 dalam pengujian langsung kami.</p>
<h2 id="Coding-Tests" class="common-anchor-header">Tes Pengkodean<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Saya mulai dengan tugas sederhana: menulis skrip HTML yang memungkinkan pengguna mengunggah gambar dan memindahkannya dengan mouse. GPT-5 berhenti sejenak selama sekitar sembilan detik, kemudian menghasilkan kode kerja yang menangani interaksi dengan baik. Rasanya ini merupakan awal yang baik.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tugas kedua lebih sulit: mengimplementasikan deteksi tabrakan poligon-bola di dalam segi enam yang berputar, dengan kecepatan rotasi, elastisitas, dan jumlah bola yang dapat disesuaikan. GPT-5 menghasilkan versi pertama dalam waktu sekitar tiga belas detik. Kode tersebut menyertakan semua fitur yang diharapkan, tetapi masih ada bug dan tidak bisa dijalankan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Saya kemudian menggunakan opsi <strong>Perbaiki bug</strong> editor, dan GPT-5 memperbaiki kesalahan sehingga segi enam dapat ditampilkan. Namun, bola-bola tidak pernah muncul - logika pemijahan tidak ada atau salah, yang berarti fungsi inti dari program ini tidak ada meskipun penyiapannya sudah lengkap.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Singkatnya,</strong> GPT-5 dapat menghasilkan kode interaktif yang bersih dan terstruktur dengan baik serta dapat pulih dari kesalahan runtime yang sederhana. Namun dalam skenario yang kompleks, GPT-5 masih berisiko menghilangkan logika yang penting, sehingga tinjauan dan pengulangan oleh manusia diperlukan sebelum penerapan.</p>
<h2 id="Reasoning-Test" class="common-anchor-header">Uji Penalaran<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Saya mengajukan teka-teki logika multi-langkah yang melibatkan warna barang, harga, dan petunjuk posisi-sesuatu yang membutuhkan waktu beberapa menit bagi kebanyakan manusia untuk menyelesaikannya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Pertanyaan:</strong> <em>Apa barang berwarna biru dan berapa harganya?</em></p>
<p>GPT-5 memberikan jawaban yang benar hanya dalam waktu 9 detik, dengan penjelasan yang jelas dan masuk akal. Tes ini memperkuat kekuatan model ini dalam penalaran terstruktur dan deduksi yang cepat.</p>
<h2 id="Writing-Test" class="common-anchor-header">Tes Menulis<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Saya sering menggunakan ChatGPT untuk membantu membuat blog, postingan media sosial, dan konten tertulis lainnya, sehingga pembuatan teks adalah salah satu kemampuan yang paling saya pedulikan. Untuk tes ini, saya meminta GPT-5 untuk membuat posting LinkedIn berdasarkan blog tentang penganalisis multibahasa Milvus 2.6.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hasilnya tertata dengan baik dan mencakup semua poin penting dari blog aslinya, tetapi terasa terlalu formal dan mudah ditebak-lebih mirip siaran pers perusahaan daripada sesuatu yang dimaksudkan untuk menarik minat pada umpan sosial. Blog ini tidak memiliki kehangatan, ritme, dan kepribadian yang membuat sebuah postingan terasa manusiawi dan mengundang.</p>
<p>Sisi baiknya, ilustrasi yang menyertainya sangat bagus: jelas, sesuai merek, dan selaras dengan gaya teknologi Zilliz. Secara visual, ini sangat tepat; tulisannya hanya perlu sedikit lebih banyak energi kreatif untuk mencocokkannya.</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">Jendela Konteks yang Lebih Panjang = Kematian RAG dan VectorDB?<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami telah membahas topik ini tahun lalu ketika <a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google meluncurkan <strong>Gemini 1.5 Pro</strong></a> dengan jendela konteks yang sangat panjang, yaitu 10 juta kata. Pada saat itu, beberapa orang dengan cepat memprediksi akhir dari RAG - dan bahkan akhir dari database secara keseluruhan. Maju cepat ke hari ini: RAG tidak hanya masih hidup, tetapi juga berkembang pesat. Dalam praktiknya, RAG menjadi <em>lebih</em> mampu dan produktif, bersama dengan database vektor seperti <a href="https://milvus.io/"><strong>Milvus</strong></a> dan <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>.</p>
<p>Sekarang, dengan panjang konteks GPT-5 yang diperluas dan kemampuan pemanggilan alat yang lebih canggih, pertanyaannya muncul lagi: <em>Apakah kita masih membutuhkan basis data vektor untuk konsumsi konteks, atau bahkan agen khusus / jalur pipa RAG?</em></p>
<p><strong>Jawaban singkatnya: tentu saja ya. Kita masih membutuhkannya.</strong></p>
<p>Konteks yang lebih panjang memang berguna, tetapi itu bukan pengganti pengambilan terstruktur. Sistem multi-agen masih berada di jalur yang tepat untuk menjadi tren arsitektur jangka panjang - dan sistem ini sering kali membutuhkan konteks yang hampir tidak terbatas. Ditambah lagi, dalam hal mengelola data pribadi yang tidak terstruktur dengan aman, basis data vektor akan selalu menjadi penjaga gerbang terakhir.</p>
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
    </button></h2><p>Setelah menyaksikan acara peluncuran OpenAI dan melakukan uji coba langsung, GPT-5 terasa tidak terlalu seperti lompatan dramatis ke depan dan lebih seperti perpaduan yang disempurnakan dari kekuatan masa lalu dengan beberapa peningkatan yang ditempatkan dengan baik. Itu bukan hal yang buruk-ini merupakan tanda dari batasan arsitektur dan kualitas data yang mulai dihadapi oleh model-model besar.</p>
<p>Seperti kata pepatah, <em>kritik pedas datang dari ekspektasi yang tinggi</em>. Kekecewaan apa pun di sekitar GPT-5 sebagian besar berasal dari standar yang sangat tinggi yang ditetapkan OpenAI untuk dirinya sendiri. Dan akurasi yang benar-benar lebih baik, harga yang lebih rendah, dan dukungan multimodal yang terintegrasi masih merupakan kemenangan yang berharga. Untuk pengembang yang membangun agen dan jalur pipa RAG, ini mungkin merupakan peningkatan yang paling berguna sejauh ini.</p>
<p>Beberapa teman bercanda tentang membuat "peringatan online" untuk GPT-4o, mengklaim bahwa kepribadian teman obrolan mereka yang lama telah hilang selamanya. Saya tidak keberatan dengan perubahan ini-GPT-5 mungkin kurang hangat dan cerewet, tetapi gayanya yang lugas dan tanpa basa-basi terasa menyegarkan.</p>
<p><strong>Bagaimana dengan Anda?</strong> Bagikan pemikiran Anda dengan kami-bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> kami, atau bergabunglah dengan percakapan di <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> dan <a href="https://x.com/milvusio">X</a>.</p>
