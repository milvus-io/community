---
id: ai-in-.md
title: >-
  Mempercepat AI di Bidang Keuangan dengan Milvus, Basis Data Vektor Sumber
  Terbuka
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: >-
  Milvus dapat digunakan untuk membangun aplikasi AI untuk industri keuangan
  termasuk chatbot, sistem rekomendasi, dan banyak lagi.
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>Mempercepat AI di Bidang Keuangan dengan Milvus, Basis Data Vektor Sumber Terbuka</custom-h1><p>Bank dan lembaga keuangan lainnya telah lama menjadi pengadopsi awal perangkat lunak sumber terbuka untuk pemrosesan dan analisis data besar. Pada tahun 2010, Morgan Stanley <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">mulai menggunakan</a> kerangka kerja sumber terbuka Apache Hadoop sebagai bagian dari eksperimen kecil. Perusahaan ini kesulitan untuk berhasil menskalakan basis data tradisional ke volume data yang sangat besar yang ingin dimanfaatkan oleh para ilmuwannya, sehingga mereka memutuskan untuk mengeksplorasi solusi alternatif. Hadoop kini menjadi hal yang penting di Morgan Stanley, membantu dalam berbagai hal, mulai dari mengelola data CRM hingga analisis portofolio. Perangkat lunak database relasional sumber terbuka lainnya seperti MySQL, MongoDB, dan PostgreSQL telah menjadi alat yang sangat diperlukan untuk memahami data besar dalam industri keuangan.</p>
<p>Teknologi memberikan keunggulan kompetitif bagi industri jasa keuangan, dan kecerdasan buatan (AI) dengan cepat menjadi pendekatan standar untuk mengekstraksi wawasan berharga dari data besar dan menganalisis aktivitas secara real-time di sektor perbankan, manajemen aset, dan asuransi. Dengan menggunakan algoritme AI untuk mengubah data yang tidak terstruktur seperti gambar, audio, atau video menjadi vektor, format data numerik yang dapat dibaca oleh mesin, memungkinkan untuk melakukan pencarian kemiripan pada kumpulan data vektor dalam jumlah jutaan, miliaran, atau bahkan triliunan. Data vektor disimpan dalam ruang dimensi tinggi, dan vektor-vektor yang mirip ditemukan menggunakan pencarian kemiripan, yang membutuhkan infrastruktur khusus yang disebut basis data vektor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> adalah basis data vektor sumber terbuka yang dibuat khusus untuk mengelola data vektor, yang berarti para insinyur dan ilmuwan data dapat fokus membangun aplikasi AI atau melakukan analisis - alih-alih infrastruktur data yang mendasarinya. Platform ini dibangun berdasarkan alur kerja pengembangan aplikasi AI dan dioptimalkan untuk menyederhanakan operasi pembelajaran mesin (MLOps). Untuk informasi lebih lanjut tentang Milvus dan teknologi yang mendasarinya, lihat <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">blog</a> kami.</p>
<p>Aplikasi umum AI dalam industri jasa keuangan meliputi perdagangan algoritmik, komposisi dan optimasi portofolio, validasi model, backtesting, Robo-advising, asisten pelanggan virtual, analisis dampak pasar, kepatuhan terhadap peraturan, dan stress testing. Artikel ini membahas tiga area spesifik di mana data vektor dimanfaatkan sebagai salah satu aset paling berharga bagi perusahaan perbankan dan keuangan:</p>
<ol>
<li>Meningkatkan pengalaman pelanggan dengan chatbot perbankan</li>
<li>Meningkatkan penjualan layanan keuangan dan banyak lagi dengan sistem rekomendasi</li>
<li>Menganalisis laporan pendapatan dan data keuangan tidak terstruktur lainnya dengan penggalian teks semantik</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">Meningkatkan pengalaman pelanggan dengan chatbot perbankan</h3><p>Chatbot perbankan dapat meningkatkan pengalaman pelanggan dengan membantu konsumen memilih investasi, produk perbankan, dan polis asuransi. Layanan digital meningkat dengan cepat popularitasnya sebagian karena tren yang dipercepat oleh pandemi virus corona. Chatbot bekerja dengan menggunakan pemrosesan bahasa alami (NLP) untuk mengubah pertanyaan yang diajukan pengguna menjadi vektor semantik untuk mencari jawaban yang cocok. Chatbot perbankan modern menawarkan pengalaman alami yang dipersonalisasi bagi pengguna dan berbicara dengan nada percakapan. Milvus menyediakan struktur data yang cocok untuk membuat chatbot menggunakan pencarian kesamaan vektor secara real-time.</p>
<p>Pelajari lebih lanjut dalam demo kami yang mencakup pembuatan <a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">chatbot dengan Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">Meningkatkan penjualan layanan keuangan dan lebih banyak lagi dengan sistem rekomendasi:</h4><p>Sektor perbankan swasta menggunakan sistem pemberi rekomendasi untuk meningkatkan penjualan produk keuangan melalui rekomendasi yang dipersonalisasi berdasarkan profil pelanggan. Sistem rekomendasi juga dapat dimanfaatkan dalam riset keuangan, berita bisnis, pemilihan saham, dan sistem pendukung perdagangan. Berkat model pembelajaran yang mendalam, setiap pengguna dan item digambarkan sebagai vektor penyisipan. Basis data vektor menawarkan ruang penyematan di mana kemiripan antara pengguna dan item dapat dihitung.</p>
<p>Pelajari lebih lanjut dari <a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">demo</a> kami yang membahas sistem rekomendasi berbasis grafik dengan Milvus.</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">Menganalisis laporan pendapatan dan data keuangan tidak terstruktur lainnya dengan penambangan teks semantik:</h4><p>Teknik text mining memiliki dampak yang besar pada industri keuangan. Seiring dengan pertumbuhan data keuangan secara eksponensial, text mining telah muncul sebagai bidang penelitian yang penting dalam domain keuangan.</p>
<p>Model pembelajaran mendalam saat ini diterapkan untuk merepresentasikan laporan keuangan melalui vektor kata yang mampu menangkap berbagai aspek semantik. Database vektor seperti Milvus mampu menyimpan vektor kata semantik dalam jumlah besar dari jutaan laporan, lalu melakukan pencarian kesamaan dalam hitungan milidetik.</p>
<p>Pelajari lebih lanjut tentang cara <a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">menggunakan Haystack deepset dengan Milvus</a>.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Jangan menjadi orang asing</h3><ul>
<li>Temukan atau berkontribusi ke Milvus di <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Berinteraksi dengan komunitas melalui <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Terhubung dengan kami di <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
