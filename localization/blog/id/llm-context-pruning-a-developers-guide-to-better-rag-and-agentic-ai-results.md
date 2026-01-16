---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: >-
  Pemangkasan Konteks LLM: Panduan bagi Pengembang untuk Hasil RAG dan AI Agen
  yang Lebih Baik
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: >-
  Pelajari bagaimana pemangkasan konteks bekerja dalam sistem RAG dengan konteks
  yang panjang, mengapa hal ini penting, dan bagaimana model seperti Provence
  memungkinkan pemfilteran semantik dan berkinerja dalam praktiknya.
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>Jendela konteks di LLM menjadi sangat besar akhir-akhir ini. Beberapa model dapat mengambil satu juta token atau lebih dalam sekali jalan, dan setiap rilis baru tampaknya mendorong angka itu lebih tinggi. Ini menarik, tetapi jika Anda benar-benar telah membuat sesuatu yang menggunakan konteks yang panjang, Anda tahu bahwa ada kesenjangan antara apa yang <em>mungkin</em> dan apa yang <em>berguna</em>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hanya karena sebuah model <em>dapat</em> membaca seluruh buku dalam satu prompt, bukan berarti Anda harus memberikannya. Kebanyakan input yang panjang penuh dengan hal-hal yang tidak dibutuhkan oleh model. Begitu Anda mulai memasukkan ratusan ribu token ke dalam sebuah prompt, Anda biasanya akan mendapatkan respons yang lebih lambat, tagihan komputasi yang lebih tinggi, dan terkadang jawaban yang berkualitas lebih rendah karena model mencoba memperhatikan semuanya sekaligus.</p>
<p>Jadi, meskipun jendela konteks terus bertambah besar, pertanyaan yang sebenarnya adalah: <strong>apa yang harus kita masukkan ke sana?</strong> Di situlah <strong>Context Pruning</strong> berperan. Pada dasarnya ini adalah proses pemangkasan bagian dari konteks yang diambil atau dirakit yang tidak membantu model menjawab pertanyaan. Jika dilakukan dengan benar, proses ini akan membuat sistem Anda cepat, stabil, dan lebih mudah diprediksi.</p>
<p>Dalam artikel ini, kita akan membahas tentang mengapa konteks yang panjang sering berperilaku berbeda dari yang Anda harapkan, bagaimana pemangkasan membantu menjaga segala sesuatunya tetap terkendali, dan bagaimana alat pemangkasan seperti <strong>Provence</strong> dapat masuk ke dalam pipa RAG yang sebenarnya tanpa membuat penyiapan Anda menjadi lebih rumit.</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">Empat Mode Kegagalan Umum dalam Sistem Konteks Panjang<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Jendela konteks yang lebih besar tidak secara ajaib membuat model menjadi lebih pintar. Jika ada, setelah Anda mulai memasukkan banyak informasi ke dalam prompt, Anda membuka serangkaian cara baru yang dapat menyebabkan kesalahan. Berikut adalah empat masalah yang akan Anda lihat setiap saat ketika membangun sistem konteks panjang atau RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1. Benturan Konteks</h3><p>Context Clash terjadi ketika informasi yang terakumulasi di beberapa putaran menjadi saling bertentangan.</p>
<p>Sebagai contoh, seorang pengguna mungkin mengatakan "Saya suka apel" di awal percakapan dan kemudian menyatakan "Saya tidak suka buah." Ketika kedua pernyataan tersebut tetap berada dalam konteks, model tidak memiliki cara yang dapat diandalkan untuk menyelesaikan konflik, yang mengarah pada respons yang tidak konsisten atau ragu-ragu.</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2. Kebingungan Konteks</h3><p>Kebingungan Konteks muncul ketika konteks berisi sejumlah besar informasi yang tidak relevan atau terkait dengan lemah, sehingga menyulitkan model untuk memilih tindakan atau alat yang benar.</p>
<p>Masalah ini terutama terlihat pada sistem yang dilengkapi dengan alat bantu. Ketika konteks dipenuhi dengan detail yang tidak berhubungan, model dapat salah menafsirkan maksud pengguna dan memilih alat atau tindakan yang salah-bukan karena opsi yang benar tidak ada, tetapi karena sinyal terkubur di bawah noise.</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3. Gangguan Konteks</h3><p>Gangguan Konteks terjadi ketika informasi kontekstual yang berlebihan mendominasi perhatian model, sehingga mengurangi ketergantungannya pada pengetahuan yang sudah terlatih dan penalaran umum.</p>
<p>Alih-alih mengandalkan pola yang telah dipelajari secara luas, model akan lebih menitikberatkan pada detail-detail terbaru dalam konteks, bahkan ketika detail-detail tersebut tidak lengkap atau tidak dapat diandalkan. Hal ini dapat menyebabkan penalaran yang dangkal atau rapuh yang mencerminkan konteks terlalu dekat daripada menerapkan pemahaman tingkat yang lebih tinggi.</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4. Keracunan Konteks</h3><p>Keracunan konteks terjadi ketika informasi yang salah masuk ke dalam konteks dan berulang kali direferensikan serta diperkuat secara berulang-ulang.</p>
<p>Satu pernyataan salah yang diperkenalkan di awal percakapan dapat menjadi dasar untuk penalaran berikutnya. Ketika dialog berlanjut, model dibangun berdasarkan asumsi yang salah ini, menambah kesalahan dan semakin menjauh dari jawaban yang benar.</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">Apa Itu Pemangkasan Konteks dan Mengapa Itu Penting<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Begitu Anda mulai berurusan dengan konteks yang panjang, Anda akan segera menyadari bahwa Anda membutuhkan lebih dari satu trik untuk mengendalikannya. Dalam sistem yang sebenarnya, tim biasanya menggabungkan banyak taktik-RAG, pemuatan alat, peringkasan, mengkarantina pesan-pesan tertentu, menghapus riwayat lama, dan sebagainya. Semuanya membantu dengan cara yang berbeda. Tetapi <strong>Context Pruning</strong> adalah salah satu yang secara langsung memutuskan <em>apa yang sebenarnya diumpankan</em> ke model.</p>
<p>Context Pruning, secara sederhana, adalah proses secara otomatis menghapus informasi yang tidak relevan, bernilai rendah, atau informasi yang saling bertentangan sebelum masuk ke dalam jendela konteks model. Pada dasarnya, ini adalah filter yang hanya menyimpan bagian teks yang paling penting untuk tugas saat ini.</p>
<p>Strategi lain mungkin mengatur ulang konteks, memampatkannya, atau menyisihkan beberapa bagian untuk nanti. Pemangkasan lebih bersifat langsung: pemangkasan <strong>menjawab pertanyaan, "Haruskah bagian informasi ini masuk ke dalam prompt?"</strong></p>
<p>Itulah mengapa pemangkasan menjadi sangat penting dalam sistem RAG. Pencarian vektor sangat bagus, tetapi tidak sempurna. Ia sering kali menghasilkan banyak sekali kandidat - beberapa berguna, beberapa tidak berhubungan, beberapa sama sekali tidak relevan. Jika Anda membuang semuanya ke dalam prompt, Anda akan mengalami mode kegagalan yang telah kita bahas sebelumnya. Pemangkasan berada di antara pengambilan dan model, bertindak sebagai penjaga gerbang yang memutuskan potongan mana yang akan disimpan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ketika pemangkasan bekerja dengan baik, manfaatnya akan segera terlihat: konteks yang lebih bersih, jawaban yang lebih konsisten, penggunaan token yang lebih rendah, dan lebih sedikit efek samping yang aneh dari teks yang tidak relevan yang menyelinap masuk. Bahkan jika Anda tidak mengubah apa pun tentang pengaturan pengambilan Anda, menambahkan langkah pemangkasan yang solid dapat secara nyata meningkatkan kinerja sistem secara keseluruhan.</p>
<p>Dalam praktiknya, pemangkasan adalah salah satu pengoptimalan dengan leverage tertinggi dalam konteks panjang atau pipeline RAG - ide sederhana, dampak besar.</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">Provence: Model Pemangkasan Konteks yang Praktis<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika menjelajahi pendekatan untuk pemangkasan konteks, saya menemukan dua model sumber terbuka yang menarik yang dikembangkan di <strong>Naver Labs Eropa</strong>: <a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> dan varian multibahasanya, <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence adalah metode untuk melatih model pemangkasan konteks yang ringan untuk pembuatan hasil pencarian, dengan fokus khusus pada jawaban pertanyaan. Diberikan sebuah pertanyaan pengguna dan bagian yang diambil, metode ini mengidentifikasi dan menghapus kalimat yang tidak relevan, dan hanya menyimpan informasi yang berkontribusi pada jawaban akhir.</p>
<p>Dengan memangkas konten bernilai rendah sebelum dibuat, Provence mengurangi noise pada input model, memperpendek petunjuk, dan menurunkan latensi inferensi LLM. Provence juga plug-and-play, dapat bekerja dengan LLM atau sistem retrieval apa pun tanpa memerlukan integrasi yang ketat atau perubahan arsitektur.</p>
<p>Provence menawarkan beberapa fitur praktis untuk pipeline RAG di dunia nyata.</p>
<p><strong>1. Pemahaman Tingkat Dokumen</strong></p>
<p>Provence memahami dokumen secara keseluruhan, daripada menilai kalimat secara terpisah. Hal ini penting karena dokumen dunia nyata sering kali mengandung referensi seperti "itu," "ini," atau "metode di atas." Jika berdiri sendiri-sendiri, kalimat-kalimat ini dapat menjadi ambigu atau bahkan tidak berarti. Jika dilihat dalam konteks, relevansinya menjadi jelas. Dengan memodelkan dokumen secara holistik, Provence menghasilkan keputusan pemangkasan yang lebih akurat dan koheren.</p>
<p><strong>2. Pemilihan Kalimat Adaptif</strong></p>
<p>Provence secara otomatis menentukan berapa banyak kalimat yang harus disimpan dari dokumen yang diambil. Alih-alih bergantung pada aturan tetap seperti "pertahankan lima kalimat teratas", Provence beradaptasi dengan kueri dan konten.</p>
<p>Beberapa pertanyaan dapat dijawab dengan satu kalimat, sementara yang lain memerlukan beberapa pernyataan pendukung. Provence menangani variasi ini secara dinamis, menggunakan ambang batas relevansi yang bekerja dengan baik di seluruh domain dan dapat disesuaikan bila diperlukan - tanpa penyetelan manual dalam banyak kasus.</p>
<p><strong>3. Efisiensi Tinggi dengan Pemeringkatan Terintegrasi</strong></p>
<p>Provence dirancang untuk menjadi efisien. Ini adalah model yang ringkas dan ringan, sehingga jauh lebih cepat dan lebih murah untuk dijalankan daripada pendekatan pemangkasan berbasis LLM.</p>
<p>Lebih penting lagi, Provence dapat menggabungkan pemeringkatan ulang dan pemangkasan konteks ke dalam satu langkah. Karena pemeringkatan ulang sudah menjadi tahap standar dalam pipeline RAG modern, mengintegrasikan pemangkasan pada tahap ini membuat biaya tambahan pemangkasan konteks mendekati nol, sambil tetap meningkatkan kualitas konteks yang diteruskan ke model bahasa.</p>
<p><strong>4. Dukungan Multibahasa melalui XProvence</strong></p>
<p>Provence juga memiliki varian yang disebut XProvence, yang menggunakan arsitektur yang sama tetapi dilatih pada data multibahasa. Hal ini memungkinkannya untuk mengevaluasi kueri dan dokumen lintas bahasa - seperti bahasa Mandarin, Inggris, dan Korea - sehingga cocok untuk sistem RAG multibahasa dan lintas bahasa.</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">Bagaimana Provence Dilatih</h3><p>Provence menggunakan desain pelatihan yang bersih dan efektif berdasarkan arsitektur penyandi silang. Selama pelatihan, kueri dan setiap bagian yang diambil digabungkan menjadi satu masukan dan dikodekan bersama. Hal ini memungkinkan model untuk mengamati konteks penuh dari pertanyaan dan bagian sekaligus dan menalar secara langsung tentang relevansinya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pengkodean bersama ini memungkinkan Provence untuk belajar dari sinyal relevansi yang halus. Model ini disetel dengan baik pada <a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a> sebagai penyandi yang ringan dan dioptimalkan untuk melakukan dua tugas secara bersamaan:</p>
<ol>
<li><p><strong>Penilaian relevansi tingkat dokumen (skor peringkat):</strong> Model ini memprediksi skor relevansi untuk seluruh dokumen, yang mengindikasikan seberapa cocok dokumen tersebut dengan kueri. Sebagai contoh, skor 0,8 menunjukkan relevansi yang kuat.</p></li>
<li><p><strong>Pelabelan relevansi tingkat token (topeng biner):</strong> Secara paralel, model memberikan label biner untuk setiap token, menandai apakah token tersebut relevan (<code translate="no">1</code>) atau tidak relevan (<code translate="no">0</code>) dengan kueri.</p></li>
</ol>
<p>Hasilnya, model yang terlatih dapat menilai relevansi keseluruhan dokumen dan mengidentifikasi bagian mana yang harus disimpan atau dihapus.</p>
<p>Pada saat inferensi, Provence memprediksi label relevansi pada tingkat token. Prediksi ini kemudian digabungkan pada tingkat kalimat: sebuah kalimat dipertahankan jika mengandung lebih banyak token yang relevan daripada yang tidak relevan; jika tidak, kalimat tersebut akan dipangkas. Karena model dilatih dengan pengawasan tingkat kalimat, prediksi token dalam kalimat yang sama cenderung konsisten, membuat strategi agregasi ini dapat diandalkan dalam praktiknya. Perilaku pemangkasan juga dapat disetel dengan menyesuaikan ambang batas agregasi untuk mencapai pemangkasan yang lebih konservatif atau lebih agresif.</p>
<p>Yang terpenting, Provence menggunakan kembali langkah pemeringkatan ulang yang sudah ada di sebagian besar pipeline RAG. Ini berarti pemangkasan konteks dapat ditambahkan dengan sedikit atau tanpa biaya tambahan, membuat Provence sangat praktis untuk sistem RAG dunia nyata.</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">Mengevaluasi Kinerja Pemangkasan Konteks di Seluruh Model<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Sejauh ini, kita telah berfokus pada desain dan pelatihan Provence. Langkah selanjutnya adalah mengevaluasi bagaimana kinerjanya dalam praktik: seberapa baik pemangkasan konteks, bagaimana perbandingannya dengan pendekatan lain, dan bagaimana perilakunya dalam kondisi dunia nyata.</p>
<p>Untuk menjawab pertanyaan-pertanyaan tersebut, kami merancang serangkaian eksperimen kuantitatif untuk membandingkan kualitas pemangkasan konteks pada beberapa model dalam pengaturan evaluasi yang realistis.</p>
<p>Eksperimen ini berfokus pada dua tujuan utama:</p>
<ul>
<li><p><strong>Efektivitas pemangkasan:</strong> Kami mengukur seberapa akurat setiap model mempertahankan konten yang relevan sambil menghapus informasi yang tidak relevan, menggunakan metrik standar seperti Precision, Recall, dan skor F1.</p></li>
<li><p><strong>Generalisasi di luar domain:</strong> Kami mengevaluasi seberapa baik kinerja setiap model pada distribusi data yang berbeda dari data pelatihannya, menilai ketahanan dalam skenario di luar domain.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Model-model yang Dibandingkan</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch Semantic Highlighter</strong></a> (Model pemangkasan berdasarkan arsitektur BERT, yang dirancang khusus untuk tugas-tugas penyorotan semantik)</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">Dataset</h3><p>Kami menggunakan WikiText-2 sebagai dataset evaluasi. WikiText-2 berasal dari artikel Wikipedia dan berisi struktur dokumen yang beragam, di mana informasi yang relevan sering kali tersebar di berbagai kalimat dan hubungan semantiknya tidak sepele.</p>
<p>Yang penting, WikiText-2 berbeda secara substansial dari data yang biasanya digunakan untuk melatih model pemangkasan konteks, namun tetap menyerupai konten dunia nyata yang sarat dengan pengetahuan. Hal ini membuatnya cocok untuk evaluasi di luar domain, yang merupakan fokus utama eksperimen kami.</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">Pembuatan Kueri dan Anotasi</h3><p>Untuk membuat tugas pemangkasan di luar domain, kami secara otomatis menghasilkan pasangan pertanyaan-jawaban dari korpus WikiText-2 mentah menggunakan <strong>GPT-4o-mini</strong>. Setiap sampel evaluasi terdiri dari tiga komponen:</p>
<ul>
<li><p><strong>Pertanyaan:</strong> Pertanyaan bahasa alami yang dihasilkan dari dokumen.</p></li>
<li><p><strong>Konteks:</strong> Dokumen lengkap yang belum dimodifikasi.</p></li>
<li><p><strong>Ground Truth:</strong> Anotasi tingkat kalimat yang menunjukkan kalimat mana yang berisi jawaban (untuk dipertahankan) dan mana yang tidak relevan (untuk dipangkas).</p></li>
</ul>
<p>Pengaturan ini secara alami mendefinisikan tugas pemangkasan konteks: dengan adanya kueri dan dokumen lengkap, model harus mengidentifikasi kalimat-kalimat yang benar-benar penting. Kalimat yang mengandung jawaban diberi label relevan dan harus dipertahankan, sementara semua kalimat lainnya dianggap tidak relevan dan harus dipangkas. Formulasi ini memungkinkan kualitas pemangkasan diukur secara kuantitatif dengan menggunakan Precision, Recall, dan skor F1.</p>
<p>Yang terpenting, pertanyaan yang dihasilkan tidak muncul dalam data pelatihan model yang dievaluasi. Hasilnya, performa mencerminkan generalisasi yang sebenarnya, bukan hafalan. Secara keseluruhan, kami menghasilkan 300 sampel, yang mencakup pertanyaan berbasis fakta sederhana, tugas penalaran multi-hop, dan permintaan analitis yang lebih kompleks, untuk lebih mencerminkan pola penggunaan di dunia nyata.</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">Jalur Evaluasi</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pengoptimalan Hyperparameter: Untuk setiap model, kami melakukan pencarian grid pada ruang hyperparameter yang telah ditentukan sebelumnya dan memilih konfigurasi yang memaksimalkan skor F1.</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">Hasil dan Analisis</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hasilnya menunjukkan perbedaan kinerja yang jelas di ketiga model.</p>
<p><strong>Provence</strong> mencapai kinerja keseluruhan terkuat, dengan <strong>skor F1 66,76%.</strong> Presisi<strong>(69,53%</strong>) dan Recall<strong>(64,19%</strong>) seimbang, menunjukkan generalisasi di luar domain yang kuat. Konfigurasi optimal menggunakan ambang batas pemangkasan sebesar <strong>0.6</strong> dan <strong>α = 0.051</strong>, yang menunjukkan bahwa skor relevansi model telah dikalibrasi dengan baik dan perilaku pemangkasan bersifat intuitif dan mudah untuk disetel dalam praktiknya.</p>
<p><strong>XProvence</strong> mencapai <strong>skor F1 sebesar 58,97%</strong>, ditandai dengan <strong>recall yang tinggi (75,52%</strong> ) dan <strong>presisi yang lebih rendah (48,37%)</strong>. Hal ini mencerminkan strategi pemangkasan yang lebih konservatif yang memprioritaskan mempertahankan informasi yang berpotensi relevan daripada menghilangkan noise secara agresif. Perilaku seperti itu dapat diinginkan dalam domain di mana negatif palsu mahal - seperti aplikasi perawatan kesehatan atau hukum - tetapi juga meningkatkan positif palsu, yang menurunkan presisi. Terlepas dari pertukaran ini, kemampuan multibahasa XProvence menjadikannya pilihan yang kuat untuk pengaturan non-Inggris atau lintas bahasa.</p>
<p>Sebaliknya, <strong>OpenSearch Semantic Highlighter</strong> berkinerja jauh lebih buruk, dengan <strong>skor F1 46,37%</strong> (Presisi <strong>62,35%</strong>, Recall <strong>36,98%</strong>). Kesenjangan relatif terhadap Provence dan XProvence menunjukkan keterbatasan dalam kalibrasi skor dan generalisasi di luar domain, terutama dalam kondisi di luar domain.</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">Penyorotan Semantik: Cara Lain untuk Menemukan Apa yang Sebenarnya Penting dalam Teks<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah kita membahas tentang pemangkasan konteks, ada baiknya kita melihat bagian teka-teki yang terkait: <a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>penyorotan semantik</strong></a>. Secara teknis, kedua fitur ini melakukan pekerjaan yang hampir sama-mereka menilai potongan teks berdasarkan seberapa relevan mereka dengan kueri. Perbedaannya adalah bagaimana hasilnya digunakan dalam pipeline.</p>
<p>Kebanyakan orang mendengar "penyorotan" dan memikirkan penyorot kata kunci klasik yang Anda lihat di Elasticsearch atau Solr. Alat-alat ini pada dasarnya mencari kecocokan kata kunci secara harfiah dan membungkusnya dengan sesuatu seperti <code translate="no">&lt;em&gt;</code>. Alat-alat ini murah dan dapat diprediksi, tetapi hanya berfungsi ketika teks menggunakan kata-kata yang sama <em>persis</em> dengan kueri. Jika dokumen memparafrasekan, menggunakan sinonim, atau frasa ide secara berbeda, penyorot tradisional akan melewatkannya sama sekali.</p>
<p><strong>Penyorotan semantik mengambil rute yang berbeda.</strong> Alih-alih memeriksa kecocokan string yang tepat, ia menggunakan model untuk memperkirakan kesamaan semantik antara kueri dan rentang teks yang berbeda. Hal ini memungkinkannya menyoroti konten yang relevan bahkan ketika kata-katanya benar-benar berbeda. Untuk pipeline RAG, alur kerja agen, atau sistem pencarian AI apa pun di mana makna lebih penting daripada token, penyorotan semantik memberi Anda gambaran yang jauh lebih jelas tentang <em>mengapa</em> sebuah dokumen diambil.</p>
<p>Masalahnya adalah sebagian besar solusi penyorotan semantik yang ada tidak dibuat untuk beban kerja AI produksi. Kami menguji semua yang tersedia, dan tidak ada satu pun yang memberikan tingkat presisi, latensi, atau keandalan multibahasa yang kami perlukan untuk sistem RAG dan agen yang sebenarnya. Jadi, kami akhirnya melatih dan membuat model kami sendiri sebagai gantinya: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p>
<p>Pada tingkat tinggi, <strong>pemangkasan konteks dan penyorotan semantik menyelesaikan tugas inti yang sama</strong>: diberi kueri dan sepotong teks, cari tahu bagian mana yang benar-benar penting. Satu-satunya perbedaan adalah apa yang terjadi selanjutnya.</p>
<ul>
<li><p>Pemangkasan<strong>konteks</strong> membuang bagian yang tidak relevan sebelum dibuat.</p></li>
<li><p><strong>Penyorotan semantik</strong> mempertahankan teks lengkap tetapi secara visual menampilkan bagian yang penting.</p></li>
</ul>
<p>Karena operasi yang mendasarinya sangat mirip, model yang sama sering kali dapat mendukung kedua fitur tersebut. Hal ini mempermudah penggunaan ulang komponen di seluruh tumpukan dan membuat sistem RAG Anda lebih sederhana dan efisien secara keseluruhan.</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Penyorotan Semantik di Milvus dan Zilliz Cloud</h3><p>Penyorotan semantik kini didukung penuh di <a href="https://milvus.io">Milvus</a> dan <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> (layanan yang dikelola sepenuhnya oleh Milvus), dan telah terbukti bermanfaat bagi siapa pun yang bekerja dengan RAG atau pencarian berbasis AI. Fitur ini memecahkan masalah yang sangat sederhana namun menyakitkan: ketika pencarian vektor menghasilkan banyak sekali potongan, bagaimana Anda dengan cepat mengetahui <em>kalimat mana di dalam potongan-potongan itu yang benar-benar penting</em>?</p>
<p>Tanpa penyorotan, pengguna akan membaca seluruh dokumen hanya untuk memahami mengapa sesuatu diambil. Dengan penyorotan semantik, Milvus dan Zilliz Cloud secara otomatis menandai rentang tertentu yang secara semantik terkait dengan kueri Anda - meskipun kata-katanya berbeda. Tidak perlu lagi mencari kecocokan kata kunci atau menebak-nebak mengapa sebuah potongan muncul.</p>
<p>Hal ini membuat pencarian menjadi jauh lebih transparan. Alih-alih hanya mengembalikan "dokumen yang relevan", Milvus menunjukkan <em>di mana</em> relevansinya. Untuk pipeline RAG, hal ini sangat membantu karena Anda dapat langsung melihat apa yang seharusnya dilakukan oleh model, sehingga membuat debugging dan konstruksi yang cepat menjadi lebih mudah.</p>
<p>Kami membangun dukungan ini langsung ke dalam Milvus dan Zilliz Cloud, sehingga Anda tidak perlu memasang model eksternal atau menjalankan layanan lain hanya untuk mendapatkan atribusi yang dapat digunakan. Semuanya berjalan di dalam jalur pencarian: pencarian vektor → penilaian relevansi → rentang yang disorot. Ini bekerja di luar kotak pada skala besar dan mendukung beban kerja multibahasa dengan model <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a> kami.</p>
<h2 id="Looking-Ahead" class="common-anchor-header">Melihat ke Depan<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>Rekayasa konteks masih cukup baru, dan masih banyak yang harus dipelajari. Bahkan dengan pemangkasan dan penyorotan semantik yang bekerja dengan baik di dalam <a href="https://milvus.io">Milvus</a> dan <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>,</strong> kami masih belum sampai pada akhir cerita. Ada banyak area yang masih membutuhkan pekerjaan teknik yang nyata - membuat model pemangkasan lebih akurat tanpa memperlambat segalanya, menjadi lebih baik dalam menangani kueri yang aneh atau di luar domain, dan menyambungkan semua bagian bersama-sama sehingga pengambilan → peringkat ulang → pemangkasan → sorotan terasa seperti satu jalur pipa yang bersih alih-alih satu set peretasan yang direkatkan.</p>
<p>Karena jendela konteks terus berkembang, keputusan ini menjadi semakin penting. Manajemen konteks yang baik bukanlah "bonus yang bagus" lagi; manajemen konteks menjadi bagian inti untuk membuat sistem konteks panjang dan RAG berperilaku dengan baik.</p>
<p>Kami akan terus bereksperimen, melakukan benchmarking, dan mengirimkan bagian-bagian yang benar-benar membuat perbedaan bagi para pengembang. Tujuannya sangat jelas: mempermudah pembuatan sistem yang tidak rusak karena data yang berantakan, kueri yang tidak dapat diprediksi, atau beban kerja berskala besar.</p>
<p>Jika Anda ingin membicarakan semua ini - atau hanya butuh bantuan untuk men-debug sesuatu - Anda bisa masuk ke <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami atau memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<p>Kami selalu senang mengobrol dan bertukar catatan dengan para pembuat lainnya.</p>
