---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: >-
  Menelan Kekacauan: MLOps di Balik Penanganan Data Tidak Terstruktur yang Andal
  dalam Skala Besar untuk RAG
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: >-
  Dengan teknologi seperti VectorFlow dan Milvus, tim dapat melakukan pengujian
  secara efisien di berbagai lingkungan sekaligus mematuhi persyaratan privasi
  dan keamanan.
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Data dihasilkan lebih cepat dari sebelumnya dalam berbagai bentuk yang bisa dibayangkan. Data ini adalah bahan bakar yang akan menggerakkan gelombang baru aplikasi kecerdasan buatan, tetapi mesin peningkatan produktivitas ini membutuhkan bantuan untuk menelan bahan bakar ini. Berbagai macam skenario dan kasus-kasus yang mengelilingi data yang tidak terstruktur membuatnya sulit untuk digunakan dalam sistem AI produksi.</p>
<p>Sebagai permulaan, ada banyak sekali sumber data. Data ekspor ini dalam berbagai format file, masing-masing dengan keanehannya. Misalnya, cara Anda memproses PDF sangat bervariasi, tergantung dari mana asalnya. Menelan PDF untuk kasus litigasi sekuritas kemungkinan besar akan berfokus pada data tekstual. Sebaliknya, spesifikasi desain sistem untuk insinyur roket akan penuh dengan diagram yang membutuhkan pemrosesan visual. Kurangnya skema yang jelas dalam data yang tidak terstruktur semakin menambah kerumitan. Bahkan ketika tantangan dalam memproses data telah diatasi, masalah dalam memasukkannya dalam skala besar tetap ada. Ukuran file dapat bervariasi secara signifikan, yang mengubah cara memprosesnya. Anda dapat dengan cepat memproses unggahan 1MB pada API melalui HTTP, tetapi membaca puluhan GB dari satu file membutuhkan streaming dan pekerja khusus.</p>
<p>Mengatasi tantangan rekayasa data tradisional ini adalah taruhannya untuk menghubungkan data mentah ke <a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM</a> melalui <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> seperti <a href="https://github.com/milvus-io/milvus">Milvus</a>. Namun, kasus penggunaan yang muncul seperti melakukan pencarian kemiripan semantik dengan bantuan basis data vektor memerlukan langkah-langkah pemrosesan baru seperti memotong data sumber, mengatur metadata untuk pencarian hibrida, memilih model penyematan vektor yang sesuai, dan menyetel parameter pencarian untuk menentukan data apa yang akan diumpankan ke LLM. Alur kerja ini sangat baru sehingga tidak ada praktik terbaik yang dapat diikuti oleh para pengembang. Sebaliknya, mereka harus bereksperimen untuk menemukan konfigurasi dan kasus penggunaan yang tepat untuk data mereka. Untuk mempercepat proses ini, menggunakan pipeline penyematan vektor untuk menangani pemasukan data ke dalam basis data vektor sangat berharga.</p>
<p>Pipeline penyisipan vektor seperti <a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a> akan menghubungkan data mentah Anda ke basis data vektor, termasuk pemotongan, orkestrasi metadata, penyematan, dan pengunggahan. VectorFlow memungkinkan tim teknik untuk fokus pada logika aplikasi inti, bereksperimen dengan berbagai parameter pengambilan yang dihasilkan dari model penyematan, strategi chunking, bidang metadata, dan aspek pencarian untuk melihat mana yang berkinerja terbaik.</p>
<p>Dalam pekerjaan kami membantu tim teknik memindahkan sistem <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">retrieval augmented generation (RAG</a> ) mereka dari prototipe ke produksi, kami telah mengamati pendekatan berikut ini agar berhasil dalam menguji berbagai parameter pipa pencarian RAG:</p>
<ol>
<li>Gunakan sekumpulan kecil data yang sudah Anda kenal untuk kecepatan iterasi, seperti beberapa PDF yang memiliki potongan-potongan yang relevan dengan kueri penelusuran.</li>
<li>Buatlah satu set standar pertanyaan dan jawaban tentang bagian data tersebut. Misalnya, setelah membaca PDF, tulislah daftar pertanyaan dan mintalah tim Anda untuk menyepakati jawabannya.</li>
<li>Buat sistem evaluasi otomatis yang memberi nilai pada hasil pencarian untuk setiap pertanyaan. Salah satu cara untuk melakukannya adalah dengan mengambil jawaban dari sistem RAG dan menjalankannya kembali melalui LLM dengan pertanyaan yang menanyakan apakah hasil RAG ini menjawab pertanyaan dengan jawaban yang benar. Jawabannya adalah "ya" atau "tidak". Sebagai contoh, jika Anda memiliki 25 pertanyaan pada dokumen Anda, dan sistem menjawab 20 pertanyaan dengan benar, Anda dapat menggunakan hal ini sebagai tolok ukur untuk membandingkannya dengan pendekatan lain.</li>
<li>Pastikan Anda menggunakan LLM yang berbeda untuk evaluasi dibandingkan dengan yang Anda gunakan untuk mengkodekan penyematan vektor yang disimpan di database. LLM evaluasi biasanya merupakan tipe decoder dari model seperti GPT-4. Satu hal yang perlu diingat adalah biaya evaluasi ini ketika dijalankan berulang kali. Model sumber terbuka seperti Llama2 70B atau Deci AI LLM 6B, yang dapat berjalan pada satu GPU yang lebih kecil, memiliki kinerja yang kurang lebih sama dengan biaya yang lebih murah.</li>
<li>Jalankan setiap tes beberapa kali dan rata-rata skornya untuk memperhalus stochasticity LLM.</li>
</ol>
<p>Dengan mempertahankan setiap opsi konstan kecuali satu, Anda dapat dengan cepat menentukan parameter mana yang paling cocok untuk kasus penggunaan Anda. Pipeline penyematan vektor seperti VectorFlow membuat hal ini menjadi sangat mudah terutama di sisi konsumsi, di mana Anda dapat dengan cepat mencoba berbagai strategi chunking, panjang chunk, tumpang tindih chunk, dan model penyematan sumber terbuka untuk melihat apa yang menghasilkan hasil terbaik. Hal ini sangat berguna terutama ketika kumpulan data Anda memiliki berbagai jenis file dan sumber data yang memerlukan logika khusus.</p>
<p>Setelah tim mengetahui apa yang cocok untuk kasus penggunaannya, pipeline penyematan vektor memungkinkan mereka untuk segera beralih ke produksi tanpa harus mendesain ulang sistem untuk mempertimbangkan hal-hal seperti keandalan dan pemantauan. Dengan teknologi seperti VectorFlow dan <a href="https://zilliz.com/what-is-milvus">Milvus</a>, yang bersifat open-source dan platform-agnostik, tim dapat melakukan pengujian secara efisien di berbagai lingkungan sambil mematuhi persyaratan privasi dan keamanan.</p>
