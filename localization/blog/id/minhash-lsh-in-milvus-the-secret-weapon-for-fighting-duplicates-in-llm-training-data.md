---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >-
  MinHash LSH di Milvus: Senjata Rahasia untuk Memerangi Duplikasi dalam Data
  Pelatihan LLM
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  MinHash LSH di Milvus 2.6 menawarkan solusi yang efisien untuk menduplikasi
  set data pelatihan LLM yang sangat besar, dengan pemrosesan 2x lebih cepat dan
  penghematan biaya 3- 5x lipat dibandingkan dengan metode tradisional.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>Model Bahasa Besar (LLM) telah mengubah lanskap AI dengan kemampuannya untuk menulis kode, membuat konten, dan memecahkan masalah yang kompleks. Namun, model-model canggih ini membutuhkan data berkualitas tinggi dalam jumlah yang sangat besar untuk memicu pelatihan mereka.</p>
<p>Tantangannya adalah data pelatihan mentah sering kali mengandung redundansi yang signifikan. Ini seperti mengajari seorang anak dengan mengulang pelajaran yang sama berulang-ulang sambil melewatkan topik penting lainnya. Sebuah perusahaan AI besar mendekati kami dengan masalah ini - mereka sedang membangun model bahasa baru yang ambisius, tetapi kesulitan dalam menduplikasi puluhan miliar dokumen. Metode pencocokan tradisional tidak dapat menskalakan volume ini, dan alat deduplikasi khusus membutuhkan sumber daya komputasi yang sangat besar, sehingga secara ekonomi tidak dapat dijalankan.</p>
<p>Untuk mengatasi masalah ini, solusi kami adalah: Pengindeksan MinHash LSH (Locality Sensitive Hashing), yang akan tersedia di Milvus 2.6. Pada artikel ini, kita akan mengeksplorasi bagaimana MinHash LSH secara efisien memecahkan masalah deduplikasi data untuk pelatihan LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">Deduplikasi Data: Mengapa Penting untuk Pelatihan LLM<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>Data yang berkualitas tinggi dan beragam sangat penting untuk melatih LLM yang kuat. Ketika konten duplikat muncul dalam data pelatihan, hal ini menimbulkan beberapa masalah yang signifikan:</p>
<ul>
<li><p><strong>Sumber daya yang terbuang:</strong> Data yang berlebihan akan meningkatkan waktu pelatihan, biaya, dan konsumsi energi.</p></li>
<li><p><strong>Penurunan Performa:</strong> Model dapat menyesuaikan diri secara berlebihan dengan konten yang diulang-ulang, sehingga membatasi kemampuannya untuk menggeneralisasi informasi baru.</p></li>
<li><p><strong>Efek Menghafal:</strong> Konten yang diduplikasi meningkatkan kemungkinan model menghafal dan mereproduksi teks tertentu secara kata demi kata. Hal ini juga berpotensi menyebabkan kebocoran privasi atau masalah hak cipta.</p></li>
<li><p><strong>Evaluasi yang Menyesatkan:</strong> Duplikasi antara set pelatihan dan pengujian dapat secara tidak sengaja meningkatkan metrik kinerja.</p></li>
</ul>
<p>Ada tiga pendekatan utama untuk menemukan dan menghapus duplikat:</p>
<ul>
<li><p><strong>Pencocokan Persis:</strong> Mengidentifikasi duplikat yang identik melalui hashing.</p></li>
<li><p><strong>Pencocokan Perkiraan:</strong> Menemukan duplikat yang hampir sama menggunakan algoritme seperti MinHash LSH dan kemiripan Jaccard.</p></li>
<li><p><strong>Pencocokan Semantik:</strong> Mengidentifikasi konten dengan makna yang sama menggunakan penyematan vektor.</p></li>
</ul>
<p>Dengan korpus pra-pelatihan yang mencapai terabyte atau bahkan petabyte, metode pencocokan eksak tradisional seperti perbandingan berpasangan tidak mungkin dilakukan secara komputasi. Deduplikasi semantik menambah biaya overhead yang signifikan dengan menggunakan model penyematan untuk menghasilkan vektor. Kita membutuhkan metode perkiraan yang lebih cerdas-seperti <strong>MinHash LSH-yang</strong>menyeimbangkan recall dan presisi sambil menjaga biaya tetap terkendali, membuat deduplikasi skala besar menjadi praktis.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: Mendeteksi Duplikat Dekat Secara Efisien dalam Kumpulan Data Besar<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk menemukan duplikat yang hampir sama dalam lautan data pelatihan, kita membutuhkan algoritme pencocokan yang efisien dan akurat. MinHash LSH (Locality Sensitive Hashing) adalah alat yang hebat untuk tujuan ini. Mari kita uraikan istilah yang tampaknya rumit ini selangkah demi selangkah.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">Langkah 1: Merepresentasikan Dokumen dengan MinHash</h3><p>Pertama, kita membutuhkan cara untuk mengukur kemiripan dokumen. Pendekatan standar menggunakan kemiripan Jaccard:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi></mrow><annotation encoding="application/x-tex">) =</annotation><mrow><mfrac><mrow><mi mathvariant="normal">∣A∩B∣∣A∪B∣J</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">(A,B) = \frac{|A\cap B|}{|A\cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>Rumus ini mengukur tumpang tindih antara dokumen A dan dokumen B - khususnya, rasio elemen yang digunakan bersama dengan total elemen unik. Nilai yang lebih tinggi berarti dokumen-dokumen tersebut lebih mirip.</p>
<p>Namun, menghitungnya secara langsung untuk miliaran pasangan dokumen membutuhkan sumber daya yang besar dan akan memakan waktu bertahun-tahun. MinHash menciptakan "sidik jari" (tanda tangan) ringkas yang mempertahankan hubungan kemiripan sambil membuat perbandingan lebih cepat.</p>
<ol>
<li><strong>Shingling:</strong> Memecah setiap dokumen menjadi urutan kata atau karakter yang tumpang tindih (k-shingles). Sebagai contoh, kalimat "Saya suka pencarian vektor" dengan k=3 (per kata) menghasilkan {"Saya suka vektor", "suka pencarian vektor"}</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong> Menerapkan beberapa fungsi hash ke setiap set shingles dan mencatat nilai hash minimum dari setiap fungsi. Hal ini menghasilkan vektor tanda tangan untuk setiap dokumen.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ketika menghitung kemiripan, probabilitas bahwa nilai hash sejajar pada posisi yang sama dalam tanda tangan MinHash dari dua dokumen (yang sesuai dengan jarak Jaccard dari tanda tangan ini) memberikan perkiraan yang mendekati kemiripan Jaccard dari set sirap asli mereka. Hal ini memungkinkan kita untuk secara efektif memperkirakan kemiripan dokumen tanpa perlu membandingkan teks asli yang lebih besar secara langsung; sebagai gantinya, kita dapat menganalisis tanda tangan MinHash yang ringkas.</p>
<p>Prinsip MinHash melibatkan penggunaan kata dengan nilai hash terkecil untuk mewakili seluruh dokumen, meningkatkan akurasi dengan memasukkan fungsi hash tambahan. Perubahan kecil pada kata cenderung diabaikan karena biasanya tidak mempengaruhi nilai hash minimum, sementara perubahan yang lebih besar cenderung mengubah nilai hash dan lebih mudah dideteksi. Metode ini dapat dilihat sebagai min-pooling nilai hash di berbagai kata. Selain MinHash, ada juga alternatif lain seperti SimHash yang tersedia untuk membuat tanda tangan dokumen, tetapi tidak akan dibahas di sini.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">Langkah 2: Mengidentifikasi Dokumen yang Mirip melalui LSH</h3><p>Bahkan dengan tanda tangan MinHash yang ringkas, membandingkan setiap pasangan di jutaan atau miliaran dokumen tetap mahal secara komputasi. Di situlah <strong>Locality Sensitive Hashing (LSH)</strong> masuk.</p>
<p>Ide utama dari LSH adalah menggunakan fungsi hash yang dengan <strong>sengaja menyebabkan tabrakan -</strong>item yang <strong>mirip</strong>lebih mungkin untuk di-hash ke dalam ember yang sama, sementara yang tidak mirip tidak. Ini adalah kebalikan dari hashing tradisional, yang bertujuan untuk menghindari tabrakan.</p>
<p>Untuk MinHash, strategi LSH yang populer adalah <strong>teknik banding</strong>:</p>
<ol>
<li><p><strong>Pengikatan</strong>: Membagi setiap tanda tangan MinHash (sebuah vektor dengan panjang <em>N</em>) ke dalam <em>b</em> pita, masing-masing dengan <em>r</em> baris<em>(N = b × r</em>).</p></li>
<li><p><strong>Meng-hash pita (Hashing Bands):</strong> Hash setiap pita (sub-vektor dari nilai <em>r</em> ) ke dalam sebuah bucket menggunakan fungsi hash standar.</p></li>
<li><p><strong>Pasangan Kandidat:</strong> Jika dua dokumen berbagi ember di pita <strong>mana pun</strong>, mereka ditandai sebagai pasangan potensial.</p></li>
</ol>
<p>Dengan menyesuaikan jumlah pita (b) dan jumlah baris per pita ®, Anda dapat mengontrol pertukaran antara recall, presisi, dan efisiensi pencarian.</p>
<p>Ide kuncinya adalah: dokumen yang sangat mirip akan memiliki banyak nilai hash yang cocok dalam tanda tangan MinHash mereka. Ketika tanda tangan ini dibagi menjadi beberapa band, bahkan satu band dengan semua nilai yang cocok sudah cukup untuk menempatkan dua dokumen di dalam ember yang sama. Semakin mirip dokumen-dokumen tersebut, semakin tinggi probabilitas bahwa hal ini terjadi pada setidaknya satu band, yang memungkinkan LSH untuk menampilkan pasangan kandidat secara efisien tanpa harus membandingkan semua tanda tangan.</p>
<p>Singkatnya, <strong>MinHash + LSH</strong> memungkinkan deduplikasi perkiraan yang dapat diskalakan: MinHash memampatkan dokumen menjadi tanda tangan yang ringkas, dan LSH secara efisien mempersempit ruang pencarian dengan mengelompokkan kecocokan yang mungkin terjadi. Ini seperti menemukan anak kembar di tengah kerumunan: pertama, ambil cuplikan fitur cepat dari semua orang (MinHash), kelompokkan kemiripannya (LSH), lalu periksa kelompok yang lebih kecil untuk mencari duplikat yang sebenarnya.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Mengintegrasikan MinHash LSH di Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Integrasi MinHash LSH ke dalam Milvus 2.6 didorong oleh kebutuhan di dunia nyata. Seperti yang telah disebutkan sebelumnya, seorang pengguna Milvus-salah satu perusahaan LLM terkemuka-mendekati kami dengan sebuah tantangan: mendeduplikasi data teks dalam jumlah yang sangat besar secara efisien untuk pra-pelatihan LLM.</p>
<p>Pipeline deduplikasi tradisional biasanya bergantung pada alat eksternal yang terpisah dari sistem penyimpanan dan pengambilan, sehingga membutuhkan transfer data yang mahal antar komponen. Alur kerja yang terfragmentasi ini meningkatkan biaya operasional dan mencegah pemanfaatan penuh sumber daya komputasi terdistribusi.</p>
<p>Menyadari kekuatan Milvus dalam menangani data vektor dengan throughput tinggi, sebuah ide alami muncul: <strong><em>Bagaimana jika MinHash LSH dibangun ke dalam Milvus secara native, menjadikan perkiraan deduplikasi sebagai fitur basis data kelas satu?</em></strong></p>
<p>Pendekatan ini memungkinkan alur kerja yang lengkap dari deduplikasi hingga pengambilan semantik di dalam Milvus, menyederhanakan MLOps sambil meningkatkan skalabilitas dan API terpadu. Bersama dengan mitra kami, kami mengoptimalkan MinHash LSH untuk arsitektur cloud-native Milvus, menghasilkan solusi yang cepat dan dapat diskalakan untuk deduplikasi skala besar.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Kemampuan inti dalam Milvus 2.6 meliputi:</h3><ul>
<li><p><strong>Pengindeksan LSH MinHash asli:</strong> Menerapkan teknik pengindeksan standar untuk LSH dan mendukung pemeringkatan ulang Jaccard opsional untuk meningkatkan daya ingat. Menyediakan implementasi berbasis in-memory dan mmap untuk fleksibilitas di berbagai beban kerja.</p></li>
<li><p><strong>Integrasi API yang mulus:</strong> Pengguna dapat mendefinisikan bidang vektor MinHash, membangun indeks <code translate="no">MINHASH_LSH</code>, memasukkan data tanda tangan, dan melakukan pencarian kemiripan menggunakan SDK standar Milvus dan API deklaratif.</p></li>
<li><p><strong>Terdistribusi dan Terukur:</strong> Dibangun di atas arsitektur cloud-native Milvus, fitur ini mendukung penskalaan horizontal untuk dataset besar dan pemrosesan throughput tinggi.</p></li>
</ul>
<p>Integrasi ini memberikan hasil yang mengesankan. Dengan menjalankan MinHash LSH pada Milvus yang dikelola sepenuhnya (Zilliz Cloud), kami membantu pengguna ini menggandakan <strong>10 miliar dokumen</strong> secara efisien. Dibandingkan dengan pendekatan berbasis MapReduce sebelumnya, solusi baru ini <strong>meningkatkan kecepatan pemrosesan lebih dari dua kali lipat</strong> dan mencapai <strong>penghematan biaya 3-5x</strong> lipat, berkat pengindeksan dan eksekusi kueri yang dioptimalkan oleh Milvus.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">Praktik Langsung: Mendeduplikasi Dataset LLM Menggunakan Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita menyingsingkan lengan baju kita dan menggunakan MinHash LSH di Milvus 2.6 untuk melakukan perkiraan deduplikasi dalam skala besar.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">Prasyarat: Membuat Tanda Tangan MinHash</h3><p>Milvus menangani pengindeksan dan pencarian tanda tangan MinHash yang <strong>sudah dibuat sebelumnya</strong>. Anda harus menghasilkannya selama prapemrosesan menggunakan alat seperti <code translate="no">datasketch</code> di Python atau implementasi khusus. Langkah-langkah umumnya adalah:</p>
<ol>
<li><p>Baca dokumen mentah</p></li>
<li><p>Pisahkan (tokenize atau chunk) setiap dokumen</p></li>
<li><p>Terapkan beberapa fungsi hash untuk menghasilkan tanda tangan MinHash (misalnya, larik uint64 dengan ukuran 128)</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">Langkah 1: Membuat Skema di Milvus</h3><p>Kita perlu membuat koleksi Milvus untuk menyimpan tanda tangan MinHash dan ID dokumen terkait.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>Langkah 2: Buat Indeks dan Koleksi MINHASH_LSH</strong></h3><p>Ini adalah langkah inti. Kita perlu menentukan JACCARD sebagai jenis metrik dan mengonfigurasi parameter terkait LSH.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Catatan tentang Penyetelan Parameter: Efektivitas MinHash LSH sangat bergantung pada pilihan parameter. Sebagai contoh, jumlah fungsi hash yang digunakan selama pembuatan tanda tangan MinHash (yaitu, <code translate="no">MINHASH_DIM</code>) mempengaruhi ketepatan dan ukuran tanda tangan. Pada fase LSH, jumlah band (<code translate="no">num_bands</code>) dan baris per band secara bersama-sama menentukan rentang sensitivitas ambang batas kemiripan dan keseimbangan antara recall dan presisi. Pengguna perlu bereksperimen dan menyempurnakan berdasarkan karakteristik dataset dan persyaratan deduplikasi mereka. Ini sering kali merupakan proses yang berulang.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>Langkah 3: Masukkan Tanda Tangan MinHash</strong></h3><p>Katakanlah Anda memiliki sekumpulan dokumen dan tanda tangan MinHash yang sesuai.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">Langkah 5: Cari Duplikat yang Hampir Sama</h3><p>Gunakan tanda tangan MinHash dokumen untuk mencari dokumen yang mirip dalam koleksi.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">Langkah 6: Pasca-Pemrosesan dan Pengelompokan</h3><p>Hasil yang dikembalikan adalah <strong>kandidat duplikat dekat</strong>. Untuk membentuk kelompok deduplikasi lengkap, Anda dapat menerapkan teknik pengelompokan seperti <strong>Union-Find</strong> pada pasangan kandidat. Setiap kelompok yang dihasilkan mewakili satu set duplikat; simpan satu dokumen yang representatif dan arsipkan atau hapus sisanya.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>Kesimpulan</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSH di Milvus 2.6 merupakan sebuah lompatan maju dalam pemrosesan data AI. Apa yang dimulai sebagai solusi untuk deduplikasi data LLM sekarang membuka pintu untuk kasus penggunaan yang lebih luas-pembersihan konten web, manajemen katalog, deteksi plagiarisme, dan banyak lagi.</p>
<p>Jika Anda memiliki kasus penggunaan yang serupa, silakan hubungi kami di Milvus Discord untuk mendaftar ke pertemuan Office Hour.</p>
