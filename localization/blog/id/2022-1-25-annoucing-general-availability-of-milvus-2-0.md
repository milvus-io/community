---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Mengumumkan Ketersediaan Umum Milvus 2.0
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: Cara mudah untuk menangani data dimensi tinggi yang sangat besar
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Anggota dan Teman-teman Komunitas Milvus yang terhormat:</p>
<p>Hari ini, enam bulan setelah Release Candidate (RC) pertama dipublikasikan, kami dengan senang hati mengumumkan bahwa Milvus 2.0 telah <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">tersedia secara umum (GA)</a> dan siap untuk diproduksi! Ini merupakan perjalanan yang panjang, dan kami berterima kasih kepada semua orang - kontributor komunitas, pengguna, dan LF AI &amp; Data Foundation - yang telah membantu kami mewujudkannya.</p>
<p>Kemampuan untuk menangani miliaran data berdimensi tinggi merupakan hal yang sangat penting bagi sistem AI saat ini, dan untuk alasan yang bagus:</p>
<ol>
<li>Data tidak terstruktur menempati volume yang dominan dibandingkan dengan data terstruktur tradisional.</li>
<li>Kesegaran data tidak pernah menjadi lebih penting. Ilmuwan data sangat menginginkan solusi data yang tepat waktu daripada kompromi T+1 tradisional.</li>
<li>Biaya dan kinerja menjadi semakin penting, namun masih ada kesenjangan besar antara solusi yang ada saat ini dengan kasus penggunaan di dunia nyata, oleh karena itu, Milvus 2.0. Milvus adalah database yang membantu menangani data berdimensi tinggi dalam skala besar. Ini dirancang untuk cloud dengan kemampuan untuk berjalan di mana saja. Jika Anda telah mengikuti rilis RC kami, Anda tahu bahwa kami telah menghabiskan banyak upaya untuk membuat Milvus lebih stabil dan lebih mudah digunakan dan dipelihara.</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA sekarang menawarkan<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Penghapusan entitas</strong></p>
<p>Sebagai sebuah database, Milvus sekarang mendukung <a href="https://milvus.io/docs/v2.0.x/delete_data.md">penghapusan entitas berdasarkan primary key</a> dan akan mendukung penghapusan entitas berdasarkan ekspresi nantinya.</p>
<p><strong>Keseimbangan beban otomatis</strong></p>
<p>Milvus sekarang mendukung kebijakan keseimbangan beban plugin untuk menyeimbangkan beban setiap node kueri dan node data. Berkat pemilahan komputasi dan penyimpanan, keseimbangan akan dilakukan hanya dalam beberapa menit.</p>
<p><strong>Serah terima</strong></p>
<p>Setelah segmen yang berkembang disegel melalui flush, tugas handoff menggantikan segmen yang berkembang dengan segmen historis yang diindeks untuk meningkatkan kinerja pencarian.</p>
<p><strong>Pemadatan data</strong></p>
<p>Pemadatan data adalah tugas latar belakang untuk menggabungkan segmen kecil menjadi segmen besar dan membersihkan data yang dihapus secara logis.</p>
<p><strong>Mendukung penyimpanan data etcd tertanam dan penyimpanan data lokal</strong></p>
<p>Dalam mode mandiri Milvus, kita dapat menghapus ketergantungan etcd/MinIO hanya dengan beberapa konfigurasi. Penyimpanan data lokal juga dapat digunakan sebagai cache lokal untuk menghindari pemuatan semua data ke dalam memori utama.</p>
<p><strong>SDK multi bahasa</strong></p>
<p>Selain <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">Java</a> dan <a href="https://github.com/milvus-io/milvus-sdk-go">Go</a> SDK sekarang siap digunakan.</p>
<p><strong>Milvus K8s Operator</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operator</a> menyediakan solusi yang mudah untuk menerapkan dan mengelola tumpukan layanan Milvus secara penuh, termasuk komponen Milvus dan dependensi yang relevan (misalnya etcd, Pulsar, dan MinIO), ke cluster <a href="https://kubernetes.io/">Kubernetes</a> target dengan cara yang dapat diskalakan dan sangat tersedia.</p>
<p><strong>Alat yang membantu mengelola Milvus</strong></p>
<p>Kami berterima kasih kepada <a href="https://zilliz.com/">Zilliz</a> atas kontribusi alat manajemen yang luar biasa. Kami sekarang memiliki <a href="https://milvus.io/docs/v2.0.x/attu.md">Attu</a>, yang memungkinkan kami untuk berinteraksi dengan Milvus melalui GUI yang intuitif, dan <a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI</a>, sebuah alat baris perintah untuk mengelola Milvus.</p>
<p>Terima kasih kepada semua kontributor 212, komunitas telah menyelesaikan 6718 komit selama 6 bulan terakhir, dan banyak sekali masalah stabilitas dan kinerja yang telah ditutup. Kami akan membuka laporan tolok ukur stabilitas dan kinerja segera setelah rilis 2.0 GA.</p>
<h2 id="Whats-next" class="common-anchor-header">Apa yang selanjutnya?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Fungsionalitas</strong></p>
<p>Dukungan tipe string akan menjadi fitur pembunuh berikutnya untuk Milvus 2.1. Kami juga akan menghadirkan mekanisme time to live (TTL) dan manajemen ACL dasar untuk memenuhi kebutuhan pengguna dengan lebih baik.</p>
<p><strong>Ketersediaan</strong></p>
<p>Kami sedang mengerjakan refactoring mekanisme penjadwalan query coord untuk mendukung replika multi memori untuk setiap segmen. Dengan beberapa replika aktif, Milvus dapat mendukung failover yang lebih cepat dan eksekusi spekulatif untuk mempersingkat waktu henti menjadi beberapa detik.</p>
<p><strong>Kinerja</strong></p>
<p>Hasil benchmark kinerja akan segera ditawarkan di situs web kami. Rilis berikutnya diantisipasi untuk melihat peningkatan kinerja yang mengesankan. Target kami adalah mengurangi separuh latensi pencarian di bawah kumpulan data yang lebih kecil dan menggandakan throughput sistem.</p>
<p><strong>Kemudahan penggunaan</strong></p>
<p>Milvus dirancang untuk berjalan di mana saja. Kami akan mendukung Milvus di MacOS (M1 dan X86) dan di server ARM dalam beberapa rilis kecil berikutnya. Kami juga akan menawarkan PyMilvus yang tertanam sehingga Anda dapat dengan mudah <code translate="no">pip install</code> Milvus tanpa pengaturan lingkungan yang rumit.</p>
<p><strong>Tata kelola komunitas</strong></p>
<p>Kami akan menyempurnakan aturan keanggotaan dan memperjelas persyaratan dan tanggung jawab peran kontributor. Program bimbingan juga sedang dikembangkan; bagi siapa saja yang tertarik dengan basis data cloud-native, pencarian vektor, dan/atau tata kelola komunitas, jangan ragu untuk menghubungi kami.</p>
<p>Kami sangat senang dengan rilis Milvus GA terbaru! Seperti biasa, kami senang mendengar masukan dari Anda. Jika Anda menemukan masalah, jangan ragu untuk menghubungi kami di <a href="https://github.com/milvus-io/milvus">GitHub</a> atau melalui <a href="http://milvusio.slack.com/">Slack</a>.</p>
<p><br/></p>
<p>Salam hangat,</p>
<p>Xiaofan Luan</p>
<p>Pengelola Proyek Milvus</p>
<p><br/></p>
<blockquote>
<p><em>Diedit oleh <a href="https://github.com/claireyuw">Claire Yu</a>.</em></p>
</blockquote>
