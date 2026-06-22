---
id: when-ai-agents-do-the-work-what-do-we-lose.md
title: |
  Ketika Agen AI yang Melakukan Pekerjaan, Apa yang Kita Kehilangan?
author: Bill Chen
date: 2026-06-18T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jun_21_2026_10_34_48_PM_d223e44fc5.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'AI agents, agentic AI, AI coding agents, agent memory, LLM agents'
meta_title: |
  When AI Agents Do the Work, What Do We Lose?
desc: >
  Agen AI semakin mahir dalam hal pelaksanaan, daya ingat, dan standar. Namun,
  jika mereka menghilangkan siklus pembelajaran di balik pekerjaan tersebut,
  kemampuan penilaian manusia mungkin akan berhenti berkembang.
origin: 'https://milvus.io/blog/when-ai-agents-do-the-work-what-do-we-lose.md'
---
<p>Produk-produk agen kini semakin mahir dalam mengerjakan tugas-tugas tersebut.</p>
<p>Claude Code dapat menulis dan merestrukturisasi potongan kode yang besar. Cursor dapat membantu pengembang menavigasi basis kode dengan lebih cepat. Devin dan agen-agen berorientasi tugas lainnya berusaha mengambil alih alur kerja yang lebih panjang. Di luar pemrograman, agen-agen ini menyusun draf email, memproses dokumen, merangkum data, memperbarui tiket, dan mengotomatisasi tugas-tugas berulang yang sebelumnya memerlukan upaya manusia secara langsung.</p>
<p>Sebagian besar produk ini menjanjikan hal yang sama: berikan konteks yang cukup kepada agen, dan ia akan menangani lebih banyak eksekusi untuk Anda. Janji tersebut berguna, tetapi juga menimbulkan pertanyaan yang belum sepenuhnya dijawab oleh produk-produk agen: <strong>ketika agen melakukan lebih banyak pekerjaan, apa yang kita hilangkan?</strong></p>
<p>Jawabannya bukan sekadar “upaya manual.” Tugas mungkin telah diselesaikan, tetapi manusia mungkin telah melewatkan bagian dari proses yang dulu membangun penilaian: membaca, menelusuri, men-debug, membandingkan opsi, membuat kesalahan, dan belajar mengapa satu solusi lebih baik daripada yang lain.</p>
<p>Ini tidak berarti agen buruk untuk pembelajaran. Artinya, produk agen perlu dirancang dengan mempertimbangkan pembelajaran. Jika produk tersebut hanya dioptimalkan untuk hasil, mereka mungkin menghilangkan pengalaman yang justru membantu manusia meningkatkan standar yang menjadi dasar kerja agen.</p>
<p>Cara yang berguna untuk memikirkan masalah ini adalah dengan meminjam “tangga otonomi” dari sistem kendaraan otonom. Analogi ini tidak sempurna, tetapi membantu membedakan berbagai jenis kemajuan dalam produk agen:</p>
<ul>
<li><strong>Agen L1 menjalankan tugas.</strong> Manusia memberikan instruksi, dan agen melaksanakannya.</li>
<li><strong>Agen L2 memiliki kemampuan mengingat.</strong> Mereka belajar dari sesi ke sesi dengan menyimpan preferensi, koreksi, dan konteks proyek.</li>
<li><strong>Agen L3 menerapkan standar.</strong> Manusia mendefinisikan aturan, batasan, dan kriteria pengambilan keputusan, alih-alih memandu setiap langkah.</li>
<li><strong>Agen L4 meningkatkan kemampuan manusia.</strong> Agen tidak hanya sekadar melakukan pekerjaan. Ia membantu manusia mempertahankan dan memperdalam penilaiannya.</li>
</ul>
<p>Sebagian besar industri masih berfokus pada tiga tingkat pertama. Hal ini masuk akal. Eksekusi, memori, dan standar merupakan masalah produk yang mendesak. Namun, L4 adalah tempat munculnya risiko jangka panjang. Jika manusia berhenti berkembang, standar yang memandu agen juga akan berhenti berkembang.</p>
<h2 id="L1-Agents-execute" class="common-anchor-header">L1: Agen mengeksekusi<button data-href="#L1-Agents-execute" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengembangan aplikasi AI telah melewati beberapa lapisan abstraksi:</p>
<ul>
<li>Awalnya, pengembang memanggil model melalui API: mengirim teks, mendapatkan teks kembali.</li>
<li>Kemudian muncul <strong>rekayasa prompt</strong>, di mana keterampilan utamanya adalah belajar cara mengajukan pertanyaan yang lebih baik.</li>
<li>Setelah itu muncul <strong>rekayasa konteks</strong>, di mana tugasnya adalah memberikan model contoh, batasan, dan latar belakang yang cukup agar model dapat berperilaku secara berguna dalam situasi tertentu.</li>
<li>Kemudian muncul <strong>rekayasa harness</strong>: menghubungkan model ke alat, alur kerja, file, basis data, peramban, terminal, dan sistem produksi.</li>
<li><strong>Rekayasa agen</strong> dibangun di atas dasar tersebut. Alih-alih meminta model untuk menjawab satu prompt, kita memintanya untuk merencanakan langkah-langkah, memilih alat, memeriksa hasil, memulihkan diri dari kesalahan, dan menyelesaikan tugas multi-langkah dengan pengawasan yang lebih sedikit.</li>
</ul>
<p>Permukaan teknis terus berubah, tetapi hubungan dasar di L1 tetap sama: <strong>manusia mendefinisikan tugas, dan agen melaksanakannya.</strong> Setiap interaksi masih sebagian besar berdiri sendiri. Tugas selesai, sesi berakhir, dan tugas berikutnya dimulai dari awal.</p>
<p>Tingkat ini sudah cukup efektif untuk mengubah perilaku. Agen dapat menangani lebih banyak eksekusi dengan usaha manual yang lebih sedikit. Seiring agen menjadi lebih murah, lebih cepat, dan lebih andal, hasil meningkat sementara biaya menurun.</p>
<p>Namun, pelaksanaan yang lebih mudah menciptakan hambatan baru. Setiap sesi paralel masih membutuhkan manusia untuk menjelaskan tugas, memberikan konteks, meninjau hasil, menilai kualitas, dan memutuskan apa yang harus dilakukan selanjutnya. Agen mungkin yang melakukan pekerjaan, tetapi manusia tetap bertanggung jawab untuk mengetahui apakah pekerjaan tersebut baik.</p>
<p><strong>Eksekusi menjadi lebih murah. Penilaian menjadi lebih penting.</strong></p>
<h2 id="L2-Agents-remember" class="common-anchor-header">L2: Agen mengingat<button data-href="#L2-Agents-remember" class="anchor-icon" translate="no">
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
    </button></h2><p>L1 menyelesaikan tugas yang ada di depannya. L2 mengajukan pertanyaan yang berbeda: <strong>dapatkah agen belajar dari interaksi ini sehingga interaksi berikutnya berjalan lebih baik?</strong></p>
<p>Agen L1 murni bersifat stateless. Begitu sesi berakhir, konteksnya pun hilang. Tugas berikutnya dimulai dari awal. Agen L2 mematahkan pola tersebut dengan mengumpulkan pengalaman dari berbagai sesi. Mereka mengingat preferensi pengguna, konvensi proyek, umpan balik yang berulang, keputusan sebelumnya, dan pola kerja pengguna. <strong>Tujuannya adalah mengubah pengalaman yang dihasilkan melalui interaksi manusia-agen menjadi aset yang dapat digunakan kembali.</strong></p>
<p>Inilah juga alasan mengapa memori agen tidak boleh diperlakukan sebagai prompt yang lebih panjang atau sekadar folder berisi transkrip yang disimpan. Memori yang berguna membutuhkan infrastruktur: penyimpanan yang tahan lama, pencarian semantik, deduplikasi, pembaruan, serta cara untuk memisahkan konteks yang sudah usang dari pengetahuan yang masih berguna. Di sinilah pekerjaan kami di <a href="https://zilliz.com/">Zilliz</a> berkaitan dengan masalah ini. <a href="https://milvus.io/">Milvus</a>, beserta layanan terkelola Zilliz Cloud yang dibangun di atasnya, sering digunakan sebagai lapisan pencarian untuk memori agen karena keduanya memungkinkan konteks masa lalu dapat dicari, bukan sekadar diarsipkan.</p>
<p><strong>Namun, memori L2 memiliki batasan struktural.</strong> Sebagian besar hal yang dipelajari agen pada tahap ini berasal dari perilaku yang dapat diamati: apa yang dikatakan, diubah, diterima, ditolak, atau dikoreksi oleh pengguna. Seorang agen mungkin mengingat bahwa Anda menulis ulang sebuah paragraf, menolak suatu implementasi, atau mengubah tanda tangan fungsi. Namun, agen tersebut mungkin tidak memahami alasannya.</p>
<p>Apakah masalahnya terkait akurasi, nada, kemudahan pemeliharaan, risiko keamanan, kinerja, positioning produk, atau hal lain? Perilaku hanyalah permukaan yang terlihat dari penilaian. Alasan di baliknya sering kali tetap tersembunyi.</p>
<p>Hal itu membuat L2 lebih baik dalam menangkap pengetahuan eksplisit daripada pengetahuan tacit. Ia dapat mengingat aturan yang Anda nyatakan secara langsung dan menyimpan contoh keputusan masa lalu. Namun, contoh-contoh tersebut tidak secara otomatis menjadi prinsip. Agen mungkin mengingat apa yang terjadi tanpa memahami standar di baliknya.</p>
<p>Kesenjangan itulah yang mengarah ke L3.</p>
<h2 id="L3-Agents-apply-standards" class="common-anchor-header">L3: Agen menerapkan standar<button data-href="#L3-Agents-apply-standards" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah L1 dan L2 mulai beroperasi, langkah selanjutnya yang jelas adalah paralelisme.</p>
<p>Jika satu agen dapat menyelesaikan suatu tugas, mengapa tidak menjalankan sepuluh agen? Jika seorang agen dapat belajar dari satu sesi, mengapa tidak membuka banyak sesi dan membiarkan semuanya menghasilkan pekerjaan sekaligus? Inilah logika “insinyur 10x” atau “insinyur 100x”: gunakan agen untuk melipatgandakan hasil.</p>
<p>Dalam praktiknya, paralelisme menimbulkan biayanya sendiri. Setiap sesi tetap mengharuskan manusia untuk beralih konteks, memahami masalah, meninjau hasil kerja, memberikan umpan balik, dan memutuskan apakah hasilnya cukup baik. Setelah melewati titik tertentu, penambahan agen tidak lagi terasa sebagai pengungkit, melainkan sebagai beban tambahan.</p>
<p>Ini bukan sekadar masalah alur kerja. Ini adalah hambatan kognitif. Manusia tidak menangani tugas paralel seperti yang dilakukan mesin. Pergantian tugas menguras perhatian. Memori kerja terbatas. Setiap pergantian meningkatkan kemungkinan terlewatnya detail, penerapan standar yang salah, atau persetujuan pekerjaan yang terlalu cepat.</p>
<p><strong>Produk yang baik seharusnya tidak melawan batasan ini. Produk tersebut harus dirancang dengan mempertimbangkan batasan tersebut.</strong></p>
<p>Di L3, masukan berubah dari “selesaikan masalah spesifik ini dengan cara spesifik ini” menjadi “inilah standar yang harus Anda terapkan.” Manusia berhenti menjadi operator yang memandu setiap langkah dan menjadi orang yang mendefinisikan aturan, batasan, preferensi, ambang batas kualitas, dan kriteria keputusan.</p>
<p>Seorang pengguna mungkin masih membimbing agen melalui tugas tertentu, tetapi nilai dari bimbingan tersebut tidak boleh hilang begitu saja setelah sesi berakhir. Interaksi tersebut seharusnya meninggalkan standar yang dapat digunakan kembali, bukan sekadar transkrip. Saat tugas serupa muncul lagi, agen seharusnya menerapkan standar tersebut tanpa meminta manusia untuk merekonstruksi konteks lengkap dan membuat penilaian yang sama lagi.</p>
<p>Industri ini sudah bergerak ke arah ini. Banyak produk agen memungkinkan pengguna mendefinisikan aturan, instruksi, memori, konvensi proyek, dan preferensi perilaku. Arahnya benar, tetapi sebagian besar implementasinya masih dalam tahap awal. Aturan sering kali berupa teks statis: diperbarui secara manual, terfragmentasi, dan hanya terhubung secara longgar dengan alasan di balik keputusan pengguna.</p>
<p>Pola yang lebih kuat adalah model kognisi pribadi yang terus diperbarui: representasi yang dapat dibaca mesin tentang bagaimana seseorang menilai, memutuskan, dan membuat kompromi. Model ini harus mengkodekan preferensi, nilai, batasan, pengecualian, standar, dan gaya pengambilan keputusan sebagai konteks yang dapat diambil dan diterapkan oleh agen.</p>
<p>Alih-alih sekadar menyimpan percakapan masa lalu, model ini seharusnya membuat pemikiran pengguna dapat dipahami oleh mesin.</p>
<p>Tugas pengguna pun berubah seiring dengan itu. Alih-alih menjelaskan setiap tugas dari awal, pengguna memelihara model tersebut dengan menyempurnakan standar, memperbarui preferensi, mengoreksi asumsi, dan menjadikan penilaian implisit menjadi eksplisit. Dalam arti tertentu, pengguna terus-menerus “menokenisasi” dirinya sendiri: mengubah lebih banyak pemikirannya ke dalam bentuk yang dapat digunakan oleh agen.</p>
<p>Ketika eksekusi tidak memerlukan biaya besar, manusia tidak perlu memutuskan setiap detail implementasi sebelum suatu tugas dimulai. Manusia perlu mendefinisikan seperti apa hasil yang baik, apa yang tidak dapat diterima, dan bagaimana kompromi harus ditangani.</p>
<h2 id="L4-Agents-preserve-human-learning" class="common-anchor-header">L4: Agen melestarikan pembelajaran manusia<button data-href="#L4-Agents-preserve-human-learning" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Tiga tingkat pertama berfokus pada upaya agar agen dapat melayani manusia dengan lebih baik. L4 membalikkan pertanyaannya: bagaimana agen dapat membantu manusia menjadi lebih baik?</strong></p>
<p>Inilah bagian yang belum sepenuhnya dihadapi oleh sebagian besar produk agen. Ketika agen melakukan lebih banyak pekerjaan untuk kita, apa sebenarnya yang hilang dari sisi manusia dalam siklus tersebut?</p>
<p>Secara kasat mata, kita kehilangan upaya manual. Itulah manfaat yang jelas. Namun, kita mungkin juga kehilangan tiga hal yang kurang terlihat: ingatan kontekstual tentang pekerjaan, latihan dalam membuat kompromi, dan kemampuan mengenali pola yang muncul dari paparan berulang terhadap detail-detail rumit.</p>
<p><strong>Saya merasakannya secara langsung saat menulis kode.</strong> Ketika saya menulis kode sendiri, saya mengingat di mana setiap baris berada dan bagaimana sistem itu bekerja karena saya telah menghabiskan waktu untuk membaca, men-debug, menelusuri, dan memperbaikinya secara manual. Proses itu tidak hanya menghasilkan kode. Proses itu melatih otak saya untuk mengenali struktur.</p>
<p>Dengan Claude Code, kode tetap dihasilkan, seringkali lebih cepat. Namun setelah beberapa waktu, ingatan saya tentang sistem tersebut tidak sedalam sebelumnya. Saya mungkin tahu apa yang dilakukan sistem tersebut, tetapi saya tidak selalu mengingat bagaimana setiap bagiannya saling terhubung. Pengalaman membangun menjadi terkompresi, dan sebagian pembelajaran pun ikut menghilang bersamanya.</p>
<p>Itu bukanlah argumen yang menentang penggunaan agen pemrograman. Itu adalah argumen bahwa produk-produk agen perlu mempertahankan bagian-bagian pekerjaan yang membangun penilaian manusia.</p>
<p>Pola yang sama muncul di luar pemrograman. Jika agen menyusun setiap memo strategi, manusia mungkin kehilangan latihan dalam menyusun argumen. Jika agen merangkum setiap makalah, manusia mungkin kehilangan kebiasaan memperhatikan apa yang terlewatkan dalam ringkasan tersebut. Jika agen menangani setiap keputusan operasional, manusia mungkin berhenti mengembangkan intuisi yang berasal dari menangani pengecualian yang rumit.</p>
<p>Pekerjaannya menghilang. Hasilnya tetap ada. Namun, siklus pembelajaran mungkin melemah.</p>
<p>Itulah masalah L4.</p>
<h2 id="Human-judgment-is-the-ceiling" class="common-anchor-header">Penilaian manusia adalah batas atasnya<button data-href="#Human-judgment-is-the-ceiling" class="anchor-icon" translate="no">
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
    </button></h2><p>Kehilangan ini penting karena agen tidak beroperasi dalam ruang hampa. Agen adalah pengganda, bukan pengganti. Alat yang sama menghasilkan hasil yang sangat berbeda di tangan seorang ahli dan seorang pemula. Seorang insinyur senior yang menggunakan agen mungkin menjadi jauh lebih efektif. Seorang pemula mungkin hanya menghasilkan lebih banyak keluaran tanpa mengembangkan penilaian yang lebih baik.</p>
<p>Agen memperkuat tingkat kognitif pengguna yang sudah ada.</p>
<p>Hal ini penting karena L3 bergantung pada manusia yang menentukan standar yang harus diikuti agen. Namun, kualitas standar tersebut bergantung pada kualitas penilaian manusia. Jika manusia berhenti berkembang, standar tersebut pada akhirnya akan menjadi usang. Standar tersebut menjadi tidak lengkap, dangkal, atau tidak selaras dengan realitas pekerjaan saat ini.</p>
<p>Sistem ini bekerja paling baik sebagai siklus:</p>
<ul>
<li>Penilaian manusia menentukan standar-standar tersebut.</li>
<li>Agen melaksanakan tugas sesuai standar tersebut.</li>
<li>Hasil pelaksanaan tersebut menjadi masukan bagi pembelajaran manusia.</li>
<li>Pembelajaran manusia meningkatkan standar tersebut.</li>
</ul>
<p>Jika siklus ini berjalan lancar, kedua belah pihak akan menjadi lebih baik. Agen akan bekerja lebih efektif, dan manusia akan semakin mahir dalam mendefinisikan apa yang dimaksud dengan "efektif". Jika siklus ini terputus, sistem akan menurun kinerjanya. Penilaian manusia akan mandek. Standar menjadi usang. Agen terus melakukan optimasi, tetapi mereka melakukannya dalam kerangka kerja yang perlahan-lahan tertinggal.</p>
<p>Inilah mengapa penilaian manusia menjadi batas atasnya. Agen yang lebih kuat tidak menghilangkan kebutuhan akan manusia yang lebih kuat. Mereka justru membuat kualitas penilaian manusia menjadi lebih penting, karena penilaian itulah yang menjadi kerangka kerja di mana agen beroperasi.</p>
<h2 id="Why-agents-cannot-solve-the-whole-problem-alone" class="common-anchor-header">Mengapa agen tidak dapat menyelesaikan seluruh masalah sendirian<button data-href="#Why-agents-cannot-solve-the-whole-problem-alone" class="anchor-icon" translate="no">
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
    </button></h2><p>Satu jawaban sudah jelas: agen akan terus menjadi lebih kuat, sehingga mungkin pada akhirnya mereka akan menghasilkan pengetahuan, aturan, dan standar yang lebih baik secara mandiri.</p>
<p>Ada kebenaran di dalamnya. Agen-agen sudah mahir dalam menggabungkan ide, menjelajahi ruang solusi, dan mengungkap jalur yang mungkin belum pernah dipertimbangkan manusia. Sebuah model dapat menghasilkan kalimat, desain, dan solusi yang tidak pernah muncul dalam data latihannya. Model tersebut dapat menggabungkan kembali pola-pola lintas bidang dan menghasilkan alternatif yang berguna.</p>
<p>Itulah nilai sesungguhnya. Namun, L4 berfokus pada jenis penciptaan yang berbeda. Pertanyaannya bukan hanya siapa yang bisa menemukan jawaban yang lebih baik. Melainkan siapa yang bisa mengajukan pertanyaan baru, menulis ulang standar, atau memperluas ruang masalah.</p>
<p>Agen-agen unggul dalam menggeneralisasi, menggabungkan, dan mencari di dalam distribusi yang sudah ada. Mereka dapat menemukan jalur yang lebih baik melalui medan yang sudah dikenal, terkadang jalur yang belum pernah dicoba oleh manusia. Namun, memutuskan apakah medan itu sendiri perlu digambar ulang adalah hal yang berbeda.</p>
<p>Keputusan semacam itu sering kali berasal dari konteks manusia: batasan yang dialami, kepentingan pribadi, rasa ingin tahu, ketidakpuasan, dan konsekuensi jika salah. Seseorang dapat membentuk hipotesis yang melanggar kerangka kerja saat ini dan mengujinya terhadap kenyataan. Yang lebih penting, seseorang dapat memiliki alasan untuk terus menguji ketika ide tersebut tampak salah, berisiko, atau tidak berguna pada awalnya.</p>
<p>Geometri non-Euklides adalah contoh yang berguna. Langkah pentingnya bukan sekadar bertanya, “Bagaimana jika garis-garis sejajar berpotongan?” Seorang agen bisa saja menghasilkan kalimat itu. Langkah pentingnya adalah memperlakukan asumsi aneh tersebut sebagai sesuatu yang layak diselidiki, lalu menelusuri konsekuensinya hingga menjadi ruang teoretis baru. Hal itu membutuhkan ketekunan, kepentingan, dan alasan untuk peduli terhadap hasilnya.</p>
<p>Kerangka kerja kreativitas Margaret Boden berguna di sini. Ia membedakan tiga jenis kreativitas:</p>
<ul>
<li><strong>Kreativitas kombinatorial:</strong> menggabungkan ide-ide yang sudah dikenal dengan cara baru.</li>
<li><strong>Kreativitas eksploratif:</strong> mencari di dalam ruang konseptual yang sudah ada.</li>
<li><strong>Kreativitas transformasional:</strong> mengubah aturan ruang konseptual itu sendiri.</li>
</ul>
<p>Agen-agen sudah unggul dalam dua mode pertama. Mereka menggabungkan ide-ide yang sudah ada dan mengeksplorasi di dalam ruang konseptual yang sudah ada. Mode ketiga lebih sulit. Kreativitas transformasional bergantung pada lebih dari sekadar pencarian yang lebih cepat. Kreativitas ini bergantung pada alasan mengapa seseorang memilih untuk menolak aturan lama, menerima risiko kegagalan, dan terus menguji ide yang belum sesuai.</p>
<p><strong>Pernyataan yang lebih tepat adalah sebagai berikut: agen paling unggul dalam menggabungkan dan mengeksplorasi ruang yang sudah ada. Pengetahuan dasar baru, ruang masalah baru, dan kerangka nilai baru masih sangat bergantung pada manusia.</strong></p>
<h2 id="Design-for-the-loop-not-just-the-output" class="common-anchor-header">Desain untuk siklus, bukan hanya hasilnya<button data-href="#Design-for-the-loop-not-just-the-output" class="anchor-icon" translate="no">
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
    </button></h2><p>Tidak setiap produk agen perlu menyelesaikan L4. Beberapa produk hanya perlu membantu pengguna menyelesaikan tugas lebih cepat. Itu sudah cukup. Yang lain membutuhkan memori, standar, dan integrasi alur kerja yang lebih baik.</p>
<p>Namun, pada tingkat ekosistem, beberapa produk perlu mempertahankan siklus pembelajaran. Jika setiap produk agen membantu orang mengurangi beban kerja, dan tidak ada yang membantu orang terus belajar setelah mereka berhenti melakukan pekerjaan secara langsung, kapasitas manusia akan melemah seiring waktu. Ruang optimasi untuk agen berhenti berkembang. Seluruh sistem tetap dibatasi oleh tingkat penilaian manusia saat ini.</p>
<p>Di sinilah desain produk menjadi penting. L4 bukan sekadar meminta agen untuk merangkum apa yang telah dilakukannya. Produk L4 yang bermanfaat mempertahankan bagian-bagian pekerjaan yang membangun penilaian manusia, bahkan ketika agen menangani sebagian besar eksekusi.</p>
<p>Beberapa pola produk yang penting di sini:</p>
<ul>
<li><strong>Pertahankan titik-titik penilaian kunci.</strong> Beberapa keputusan harus tetap terlihat oleh manusia, bukan karena agen tidak dapat membuatnya, tetapi karena keputusan tersebut melatih penilaian. Produk harus mengidentifikasi momen-momen yang penting dan menjadikannya sebagai proses yang disengaja.</li>
<li><strong>Rekonstruksi proses, bukan hanya hasilnya. Hasil</strong> akhir saja tidak cukup. Sistem harus menampilkan cabang-cabang keputusan kunci, trade-off, jalur alternatif, dan upaya yang gagal. Pengguna yang hanya melihat output dapat menyetujui atau menolaknya. Pengguna yang melihat jalur penalaran dapat memperbarui model mentalnya.</li>
<li><strong>Dukung eksplorasi kolaboratif.</strong> Ketika pengguna merasa ragu, agen tidak boleh langsung melompat ke jawaban. Agen harus membantu memperluas ruang masalah: dimensi apa yang penting, asumsi apa yang hilang, informasi apa yang masih dibutuhkan, dan biaya apa yang ditanggung oleh setiap opsi.</li>
<li><strong>Tantang asumsi manusia.</strong> Ini bukan berarti menentang hanya demi perbedaan pendapat. Ini berarti mengenali celah atau ketegangan dalam pemikiran pengguna dan mengajukan pertanyaan yang tepat sasaran untuk mengungkap ketegangan tersebut.</li>
</ul>
<p>Tujuannya bukanlah memaksa manusia kembali ke setiap langkah manual. Hal itu justru akan mengalahkan tujuan keberadaan agen. Tujuannya adalah mempertahankan bagian-bagian pekerjaan yang mengubah pengalaman menjadi penilaian.</p>
<p>Produk agen tidak hanya harus dioptimalkan untuk hasil keluaran. Produk tersebut juga harus dioptimalkan untuk siklus umpan balik: penilaian manusia yang lebih baik, standar yang lebih baik, pelaksanaan agen yang lebih baik, dan pembelajaran manusia yang lebih baik dari hasilnya.</p>
<p><strong>Ketika agen AI melakukan pekerjaan, kita tidak boleh kehilangan siklus yang pada awalnya membuat manusia menjadi lebih baik dalam pekerjaan tersebut.</strong></p>
<h2 id="We’d-love-to-hear-your-thoughts" class="common-anchor-header">Kami sangat ingin mendengar pendapat Anda<button data-href="#We’d-love-to-hear-your-thoughts" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda sedang mengembangkan agen, saya ingin mendengar pandangan Anda mengenai hal ini: bagian mana dari pekerjaan yang seharusnya sepenuhnya diambil alih oleh agen, dan bagian mana yang seharusnya tetap terlihat karena membantu manusia terus berkembang?</p>
