---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: >-
  Apakah RAG Menjadi Ketinggalan Zaman Karena Agen yang Sudah Lama Beroperasi
  Seperti Claude Cowork Bermunculan?
author: Min Yin
date: 2026-1-27
desc: >-
  Analisis mendalam tentang memori jangka panjang Claude Cowork, memori agen
  yang dapat ditulis, pertukaran RAG, dan mengapa basis data vektor masih
  penting.
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">Claude Cowork</a> adalah fitur agen baru di aplikasi Claude Desktop. Dari sudut pandang pengembang, pada dasarnya fitur ini adalah sebuah task runner otomatis yang dibungkus dengan model: fitur ini dapat membaca, memodifikasi, dan menghasilkan file lokal, dan dapat merencanakan tugas multi-langkah tanpa Anda harus meminta secara manual untuk setiap langkah. Anggap saja ini sebagai perulangan yang sama di belakang Claude Code, tetapi diekspos ke desktop, bukan terminal.</p>
<p>Kemampuan utama Cowork adalah kemampuannya untuk berjalan dalam waktu yang lama tanpa kehilangan status. Ia tidak terkena batas waktu percakapan yang biasa atau pengaturan ulang konteks. Aplikasi ini dapat terus bekerja, melacak hasil antara, dan menggunakan kembali informasi sebelumnya di seluruh sesi. Hal ini memberikan kesan "memori jangka panjang", meskipun mekanisme yang mendasarinya lebih seperti status tugas yang persisten + pengalihan kontekstual. Bagaimanapun, pengalamannya berbeda dengan model obrolan tradisional, di mana semuanya diatur ulang kecuali Anda membangun lapisan memori Anda sendiri.</p>
<p>Hal ini memunculkan dua pertanyaan praktis bagi para pengembang:</p>
<ol>
<li><p><strong>Jika model ini sudah dapat mengingat informasi masa lalu, di mana RAG atau agentic RAG masih bisa digunakan? Apakah RAG akan diganti?</strong></p></li>
<li><p><strong>Jika kita menginginkan agen lokal bergaya Cowork, bagaimana cara kita mengimplementasikan memori jangka panjang sendiri?</strong></p></li>
</ol>
<p>Sisa artikel ini membahas pertanyaan-pertanyaan ini secara mendetail dan menjelaskan bagaimana database vektor cocok dengan lanskap "model memori" yang baru ini.</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork vs RAG: Apa Bedanya?<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Seperti yang saya sebutkan sebelumnya, Claude Cowork adalah mode agen di dalam Claude Desktop yang dapat membaca dan menulis file lokal, memecah tugas menjadi beberapa langkah yang lebih kecil, dan terus bekerja tanpa kehilangan status. Mode ini mempertahankan konteks kerjanya sendiri, sehingga tugas berjam-jam tidak diatur ulang seperti sesi obrolan biasa.</p>
<p><strong>RAG</strong> (Retrieval-Augmented Generation) memecahkan masalah yang berbeda: memberikan model akses ke pengetahuan eksternal. Anda mengindeks data Anda ke dalam basis data vektor, mengambil bagian yang relevan untuk setiap kueri, dan memasukkannya ke dalam model. Sistem ini banyak digunakan karena menyediakan aplikasi LLM dengan bentuk "memori jangka panjang" untuk dokumen, log, data produk, dan banyak lagi.</p>
<p>Jika kedua sistem ini membantu model untuk "mengingat", apa perbedaan sebenarnya?</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">Bagaimana Cowork Menangani Memori</h3><p>Memori Cowork bersifat baca-tulis. Agen memutuskan informasi mana dari tugas atau percakapan saat ini yang relevan, menyimpannya sebagai entri memori, dan mengambilnya nanti saat tugas berlangsung. Hal ini memungkinkan Cowork untuk menjaga kesinambungan di seluruh alur kerja yang sudah berjalan lama - terutama alur kerja yang menghasilkan status peralihan baru seiring berjalannya waktu.</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">Bagaimana RAG dan Agentic RAG Menangani Memori</h3><p>RAG standar adalah pengambilan berbasis kueri: pengguna menanyakan sesuatu, sistem mengambil dokumen yang relevan, dan model menggunakannya untuk menjawab. Korpus pengambilan tetap stabil dan berversi, dan pengembang mengontrol dengan tepat apa yang masuk ke dalamnya.</p>
<p>RAG agen modern memperluas pola ini. Model dapat memutuskan kapan harus mengambil informasi, apa yang harus diambil, dan bagaimana menggunakannya selama perencanaan atau pelaksanaan alur kerja. Sistem ini dapat menjalankan tugas-tugas yang panjang dan memanggil alat, mirip dengan Cowork. Tetapi bahkan dengan RAG agen, lapisan pengambilan tetap berorientasi pada pengetahuan daripada berorientasi pada keadaan. Agen mengambil fakta-fakta otoritatif; agen tidak menulis status tugas yang berkembang kembali ke dalam korpus.</p>
<p>Cara lain untuk melihatnya:</p>
<ul>
<li><p><strong>Memori rekan kerja digerakkan oleh tugas:</strong> agen menulis dan membaca statusnya sendiri yang berkembang.</p></li>
<li><p><strong>RAG digerakkan oleh pengetahuan:</strong> sistem mengambil informasi yang sudah ada yang harus diandalkan oleh model.</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">Rekayasa Balik Claude Cowork: Bagaimana Ia Membangun Memori Agen Jangka Panjang<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Cowork mendapat banyak sorotan karena menangani tugas-tugas multi-langkah tanpa terus-menerus melupakan apa yang sedang dilakukannya. Dari sudut pandang pengembang, saya bertanya-tanya <strong>bagaimana ia bisa mempertahankan status di sesi yang begitu lama?</strong> Anthropic belum mempublikasikan bagian dalamnya, tetapi berdasarkan eksperimen pengembang sebelumnya dengan modul memori Claude, kami dapat menyusun model mental yang layak.</p>
<p>Claude tampaknya mengandalkan pengaturan hibrida: <strong>lapisan memori jangka panjang yang persisten ditambah alat pengambilan sesuai permintaan</strong>. Alih-alih memasukkan seluruh percakapan ke dalam setiap permintaan, Claude secara selektif menarik konteks masa lalu hanya jika dianggap relevan. Hal ini memungkinkan model menjaga akurasi tetap tinggi tanpa meniup token setiap saat.</p>
<p>Jika Anda memecah struktur permintaan, secara kasar akan terlihat seperti ini:</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>Perilaku yang menarik bukanlah struktur itu sendiri - tetapi bagaimana model memutuskan apa yang harus diperbarui dan kapan harus menjalankan pengambilan.</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">Memori Pengguna: Lapisan Persisten</h3><p>Claude menyimpan memori jangka panjang yang diperbarui dari waktu ke waktu. Dan tidak seperti sistem memori ChatGPT yang lebih mudah diprediksi, Claude terasa lebih "hidup". Ia menyimpan memori dalam blok-blok XML dan memperbaruinya dengan dua cara:</p>
<ul>
<li><p><strong>Pembaruan implisit:</strong> Kadang-kadang model hanya memutuskan sesuatu sebagai preferensi atau fakta yang stabil dan secara diam-diam menuliskannya ke memori. Pembaruan ini tidak seketika; pembaruan ini muncul setelah beberapa kali, dan memori yang lebih lama dapat memudar jika percakapan terkait menghilang.</p></li>
<li><p><strong>Pembaruan eksplisit:</strong> Pengguna dapat secara langsung memodifikasi memori dengan alat <code translate="no">memory_user_edits</code> ("ingat X," "lupakan Y"). Penulisan ini bersifat langsung dan berperilaku seperti operasi CRUD.</p></li>
</ul>
<p>Claude menjalankan heuristik latar belakang untuk memutuskan apa yang perlu dipertahankan, dan tidak menunggu instruksi eksplisit.</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">Pengambilan Percakapan: Bagian Sesuai Permintaan</h3><p>Claude <em>tidak</em> menyimpan ringkasan bergulir seperti kebanyakan sistem LLM. Sebaliknya, ia memiliki sebuah kotak peralatan fungsi pengambilan yang dapat dipanggil kapan pun ia merasa kehilangan konteks. Panggilan pengambilan ini tidak terjadi setiap saat - model ini memicunya berdasarkan penilaian internalnya sendiri.</p>
<p>Yang paling menonjol adalah <code translate="no">conversation_search</code>. Ketika pengguna mengatakan sesuatu yang tidak jelas seperti "proyek itu dari bulan lalu," Claude sering kali menjalankan alat ini untuk menggali giliran yang relevan. Yang perlu dicatat adalah bahwa alat ini masih berfungsi ketika frasa tersebut ambigu atau dalam bahasa yang berbeda. Hal itu cukup jelas menyiratkan:</p>
<ul>
<li><p>Semacam pencocokan semantik (penyematan)</p></li>
<li><p>Mungkin dikombinasikan dengan normalisasi atau terjemahan ringan</p></li>
<li><p>Pencarian kata kunci yang berlapis-lapis untuk ketepatan</p></li>
</ul>
<p>Pada dasarnya, ini sangat mirip dengan sistem RAG mini yang dibundel di dalam perangkat model.</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">Bagaimana Perilaku Pengambilan Claude Berbeda Dari Buffer Riwayat Dasar</h3><p>Dari pengujian dan log, ada beberapa pola yang menonjol:</p>
<ul>
<li><p><strong>Pengambilan tidak dilakukan secara otomatis.</strong> Model memilih kapan harus memanggilnya. Jika ia merasa sudah memiliki konteks yang cukup, ia tidak akan repot-repot memanggilnya.</p></li>
<li><p><strong>Potongan</strong> <em>yang</em><strong>diambil mencakup</strong> <strong>pesan pengguna dan asisten</strong>. Ini berguna - ini menyimpan lebih banyak nuansa daripada ringkasan khusus pengguna.</p></li>
<li><p><strong>Penggunaan token tetap waras.</strong> Karena riwayat tidak disuntikkan setiap saat, sesi yang panjang tidak membengkak secara tak terduga.</p></li>
</ul>
<p>Secara keseluruhan, ini terasa seperti LLM yang ditambah dengan pengambilan, kecuali pengambilan terjadi sebagai bagian dari loop penalaran model itu sendiri.</p>
<p>Arsitektur ini pintar, tetapi tidak gratis:</p>
<ul>
<li><p>Retrieval menambahkan latensi dan lebih banyak "bagian yang bergerak" (pengindeksan, pemeringkatan, pemeringkatan ulang).</p></li>
<li><p>Model terkadang salah menilai apakah ia membutuhkan konteks, yang berarti Anda melihat "kelupaan LLM" yang klasik meskipun <em>datanya</em> tersedia.</p></li>
<li><p>Debugging menjadi lebih sulit karena perilaku model bergantung pada pemicu alat yang tidak terlihat, bukan hanya input yang diminta.</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">Claude Cowork vs Claude Codex dalam menangani memori jangka panjang</h3><p>Berbeda dengan pengaturan Claude yang berat pada pengambilan, ChatGPT menangani memori dengan cara yang jauh lebih terstruktur dan dapat diprediksi. Alih-alih melakukan pencarian semantik atau memperlakukan percakapan lama seperti penyimpanan vektor mini, ChatGPT menyuntikkan memori secara langsung ke dalam setiap sesi melalui komponen berlapis berikut ini:</p>
<ul>
<li><p>Memori pengguna</p></li>
<li><p>Metadata sesi</p></li>
<li><p>Pesan sesi saat ini</p></li>
</ul>
<p><strong>Memori Pengguna</strong></p>
<p>Memori Pengguna adalah lapisan penyimpanan jangka panjang utama - bagian yang bertahan di seluruh sesi dan dapat diedit oleh pengguna. Memori ini menyimpan hal-hal yang cukup standar: nama, latar belakang, proyek yang sedang berlangsung, preferensi pembelajaran, hal-hal semacam itu. Setiap percakapan baru akan disuntikkan blok ini di awal, sehingga model selalu dimulai dengan tampilan yang konsisten dari pengguna.</p>
<p>ChatGPT memperbarui lapisan ini dengan dua cara:</p>
<ul>
<li><p><strong>Pembaruan eksplisit:</strong> Pengguna dapat memberi tahu model untuk "ingat ini" atau "lupakan itu", dan memori akan segera berubah. Ini pada dasarnya adalah API CRUD yang diekspos oleh model melalui bahasa alami.</p></li>
<li><p><strong>Pembaruan implisit:</strong> Jika model menemukan informasi yang sesuai dengan aturan OpenAI untuk memori jangka panjang-seperti jabatan atau preferensi-dan pengguna belum menonaktifkan memori, model akan menambahkannya sendiri secara diam-diam.</p></li>
</ul>
<p>Dari sudut pandang pengembang, lapisan ini sederhana, deterministik, dan mudah dipahami. Tidak ada pencarian penyematan, tidak ada heuristik tentang apa yang harus diambil.</p>
<p><strong>Metadata Sesi</strong></p>
<p>Metadata Sesi berada di ujung spektrum yang berlawanan. Metadata ini berumur pendek, tidak persisten, dan hanya disuntikkan sekali pada awal sesi. Anggap saja sebagai variabel lingkungan untuk percakapan. Ini mencakup hal-hal seperti:</p>
<ul>
<li><p>perangkat apa yang Anda gunakan</p></li>
<li><p>status akun/langganan</p></li>
<li><p>pola penggunaan kasar (hari aktif, distribusi model, panjang percakapan rata-rata)</p></li>
</ul>
<p>Metadata ini membantu model membentuk respons untuk lingkungan saat ini-misalnya, menulis jawaban yang lebih pendek di ponsel-tanpa mengotori memori jangka panjang.</p>
<p><strong>Pesan Sesi Saat Ini</strong></p>
<p>Ini adalah riwayat jendela geser standar: semua pesan dalam percakapan saat ini hingga batas token tercapai. Ketika jendela menjadi terlalu besar, giliran yang lebih lama akan hilang secara otomatis.</p>
<p>Yang paling penting, penggusuran ini <strong>tidak</strong> menyentuh Memori Pengguna atau ringkasan lintas sesi. Hanya riwayat percakapan lokal yang menyusut.</p>
<p>Perbedaan terbesar dari Claude tampak pada bagaimana ChatGPT menangani percakapan "baru-baru ini tetapi tidak sekarang". Claude akan memanggil alat pencarian untuk mengambil konteks masa lalu jika dianggap relevan. ChatGPT tidak melakukan itu.</p>
<p>Sebaliknya, ChatGPT menyimpan <strong>ringkasan lintas sesi</strong> yang sangat ringan yang disuntikkan ke dalam setiap percakapan. Beberapa detail penting tentang lapisan ini:</p>
<ul>
<li><p>Ini <strong>hanya meringkas pesan pengguna</strong>, bukan pesan asisten.</p></li>
<li><p>Ia menyimpan sekumpulan item yang sangat kecil-kurang lebih 15 item-cukup untuk menangkap tema atau minat yang stabil.</p></li>
<li><p><strong>Lapisan</strong> ini tidak melakukan <strong>komputasi penyematan, tidak ada peringkat kemiripan, dan tidak ada pemanggilan pengambilan</strong>. Pada dasarnya ini adalah konteks yang sudah dikunyah sebelumnya, bukan pencarian dinamis.</p></li>
</ul>
<p>Dari perspektif teknik, pendekatan ini menukar fleksibilitas dengan prediktabilitas. Tidak ada kemungkinan kegagalan pengambilan yang aneh, dan latensi inferensi tetap stabil karena tidak ada yang diambil dengan cepat. Kelemahannya adalah ChatGPT tidak akan menarik pesan acak dari enam bulan yang lalu kecuali jika pesan tersebut berhasil masuk ke dalam lapisan ringkasan.</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">Tantangan untuk Membuat Memori Agen Dapat Ditulis<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika sebuah agen berpindah dari <strong>memori hanya-baca</strong> (RAG) ke <strong>memori yang</strong>dapat <strong>ditulis - di mana</strong>ia dapat mencatat tindakan, keputusan, dan preferensi pengguna - kerumitannya melonjak dengan cepat. Anda tidak lagi hanya mengambil dokumen; Anda mempertahankan keadaan yang terus berkembang yang menjadi dasar model.</p>
<p>Sistem memori yang dapat ditulis harus menyelesaikan tiga masalah nyata:</p>
<ol>
<li><p><strong>Apa yang harus diingat:</strong> Agen membutuhkan aturan untuk memutuskan peristiwa, preferensi, atau pengamatan mana yang layak disimpan. Tanpa ini, memori akan meledak dalam ukuran atau dipenuhi dengan noise.</p></li>
<li><p><strong>Bagaimana menyimpan dan menyusun memori:</strong> Tidak semua memori sama. Item terbaru, fakta jangka panjang, dan catatan sesaat, semuanya membutuhkan lapisan penyimpanan, kebijakan penyimpanan, dan strategi pengindeksan yang berbeda.</p></li>
<li><p><strong>Cara menulis cepat tanpa mengganggu pengambilan:</strong> Memori harus ditulis secara terus menerus, tetapi pembaruan yang sering dapat menurunkan kualitas indeks atau memperlambat kueri jika sistem tidak dirancang untuk sisipan dengan kecepatan tinggi.</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">Tantangan 1: Apa yang Perlu Diingat?</h3><p>Tidak semua yang dilakukan pengguna harus disimpan di memori jangka panjang. Jika seseorang membuat file sementara dan menghapusnya lima menit kemudian, merekamnya selamanya tidak akan membantu siapa pun. Ini adalah kesulitan utama: <strong>bagaimana sistem memutuskan apa yang sebenarnya penting?</strong></p>
<p><strong>(1) Cara umum untuk menilai kepentingan</strong></p>
<p>Tim biasanya mengandalkan campuran heuristik:</p>
<ul>
<li><p><strong>Berbasis waktu</strong>: tindakan terbaru lebih penting daripada tindakan lama</p></li>
<li><p><strong>Berbasis frekuensi</strong>: file atau tindakan yang diakses berulang kali lebih penting</p></li>
<li><p><strong>Berbasis jenis</strong>: beberapa objek secara inheren lebih penting (misalnya, file konfigurasi proyek vs. file cache)</p></li>
</ul>
<p><strong>(2) Ketika aturan bertentangan</strong></p>
<p>Sinyal-sinyal ini sering kali bertentangan. Sebuah file yang dibuat minggu lalu namun diedit secara besar-besaran hari ini-haruskah usia atau aktivitas yang menang? Tidak ada jawaban yang "benar", itulah sebabnya mengapa penilaian tingkat kepentingan cenderung menjadi berantakan dengan cepat.</p>
<p><strong>(3) Bagaimana database vektor membantu</strong></p>
<p>Basis data vektor memberi Anda mekanisme untuk menegakkan aturan kepentingan tanpa pembersihan manual:</p>
<ul>
<li><p><strong>TTL:</strong> Milvus dapat secara otomatis menghapus data setelah waktu yang ditentukan</p></li>
<li><p><strong>Peluruhan:</strong> vektor yang lebih tua dapat diturunkan bobotnya sehingga secara alami memudar dari pengambilan</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">Tantangan 2: Tingkatan Memori dalam Praktik</h3><p>Ketika agen berjalan lebih lama, memori akan menumpuk. Menyimpan segala sesuatu dalam penyimpanan cepat tidak berkelanjutan, sehingga sistem membutuhkan cara untuk membagi memori menjadi tingkatan <strong>panas</strong> (sering diakses) dan <strong>dingin</strong> (jarang diakses).</p>
<p><strong>(1) Memutuskan Kapan Memori Menjadi Dingin</strong></p>
<p>Dalam model ini, <em>memori panas</em> mengacu pada data yang disimpan dalam RAM untuk akses latensi rendah, sedangkan <em>memori dingin</em> mengacu pada data yang dipindahkan ke disk atau penyimpanan objek untuk mengurangi biaya.</p>
<p>Memutuskan kapan memori menjadi dingin dapat ditangani dengan berbagai cara. Beberapa sistem menggunakan model yang ringan untuk memperkirakan kepentingan semantik dari sebuah tindakan atau file berdasarkan makna dan penggunaan terakhirnya. Sistem lainnya mengandalkan logika sederhana berbasis aturan, seperti memindahkan memori yang tidak diakses selama 30 hari atau tidak muncul dalam hasil pencarian selama seminggu. Pengguna juga dapat secara eksplisit menandai file atau tindakan tertentu sebagai hal yang penting, sehingga memastikan file atau tindakan tersebut selalu dalam keadaan panas.</p>
<p><strong>(2) Tempat Penyimpanan Memori Panas dan Dingin</strong></p>
<p>Setelah diklasifikasikan, memori panas dan dingin disimpan secara berbeda. Memori panas tetap berada di RAM dan digunakan untuk konten yang sering diakses, seperti konteks tugas aktif atau tindakan pengguna terkini. Memori dingin dipindahkan ke disk atau sistem penyimpanan objek seperti S3, di mana aksesnya lebih lambat tetapi biaya penyimpanannya jauh lebih rendah. Pertukaran ini bekerja dengan baik karena memori dingin jarang dibutuhkan dan biasanya diakses hanya untuk referensi jangka panjang.</p>
<p><strong>(3) Bagaimana Basis Data Vektor Membantu</strong></p>
<p><strong>Milvus dan Zilliz Cloud</strong> mendukung pola ini dengan memungkinkan penyimpanan berjenjang panas-dingin sambil mempertahankan antarmuka kueri tunggal, sehingga vektor yang sering diakses tetap berada di memori dan data yang lebih lama berpindah ke penyimpanan yang lebih murah secara otomatis.</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">Tantangan 3: Seberapa Cepat Memori Harus Ditulis?</h3><p>Sistem RAG tradisional biasanya menulis data secara berkelompok. Indeks dibangun ulang secara offline - sering kali dalam semalam - dan baru dapat dicari kemudian. Pendekatan ini bekerja untuk basis pengetahuan statis, tetapi tidak cocok untuk memori agen.</p>
<p><strong>(1) Mengapa Memori Agen Membutuhkan Penulisan Waktu Nyata</strong></p>
<p>Memori agen harus menangkap tindakan pengguna saat terjadi. Jika sebuah tindakan tidak segera dicatat, giliran percakapan berikutnya mungkin tidak memiliki konteks yang penting. Karena alasan ini, sistem memori yang dapat ditulis membutuhkan penulisan secara real-time daripada pembaruan offline yang tertunda.</p>
<p><strong>(2) Ketegangan Antara Kecepatan Tulis dan Kualitas Pengambilan</strong></p>
<p>Memori waktu nyata menuntut latensi penulisan yang sangat rendah. Pada saat yang sama, pengambilan berkualitas tinggi bergantung pada indeks yang dibangun dengan baik, dan konstruksi indeks membutuhkan waktu. Membangun ulang indeks untuk setiap penulisan terlalu mahal, tetapi menunda pengindeksan berarti data yang baru ditulis untuk sementara waktu tidak dapat diambil. Pengorbanan ini berada di pusat desain memori yang dapat ditulis.</p>
<p><strong>(3) Bagaimana Basis Data Vektor Membantu</strong></p>
<p>Basis data vektor mengatasi masalah ini dengan memisahkan penulisan dari pengindeksan. Solusi yang umum adalah melakukan penulisan secara streaming dan melakukan pembuatan indeks secara bertahap. Menggunakan <strong>Milvus</strong> sebagai contoh, data baru pertama kali ditulis ke buffer dalam memori, sehingga sistem dapat menangani penulisan dengan frekuensi tinggi secara efisien. Bahkan sebelum indeks penuh dibuat, data yang disangga dapat ditanyakan dalam hitungan detik melalui penggabungan dinamis atau pencarian perkiraan.</p>
<p>Ketika buffer mencapai ambang batas yang telah ditentukan, sistem akan membangun indeks secara bertahap dan mempertahankannya. Hal ini meningkatkan kinerja pengambilan jangka panjang tanpa memblokir penulisan waktu nyata. Dengan memisahkan konsumsi yang cepat dari konstruksi indeks yang lebih lambat, Milvus mencapai keseimbangan praktis antara kecepatan tulis dan kualitas pencarian yang bekerja dengan baik untuk memori agen.</p>
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
    </button></h2><p>Cowork memberi kita gambaran sekilas tentang kelas agen baru - gigih, penuh perhatian, dan mampu membawa konteks dalam jangka waktu yang panjang. Namun, hal ini juga memperjelas hal lain: memori jangka panjang hanyalah separuh dari gambarannya. Untuk membangun agen siap produksi yang otonom dan dapat diandalkan, kita masih membutuhkan pengambilan terstruktur dari basis pengetahuan yang besar dan terus berkembang.</p>
<p>RAG menangani fakta-fakta dunia; memori yang dapat ditulis menangani keadaan internal agen. Dan basis data vektor berada di persimpangan, menyediakan pengindeksan, pencarian hibrida, dan penyimpanan terukur yang memungkinkan kedua lapisan untuk bekerja sama.</p>
<p>Seiring dengan semakin matangnya agen yang sudah berjalan lama, arsitektur mereka kemungkinan besar akan menyatu dalam desain hibrida ini. Cowork adalah sinyal kuat ke mana arahnya - bukan menuju dunia tanpa RAG, tetapi menuju agen dengan tumpukan memori yang lebih kaya yang didukung oleh basis data vektor di bawahnya.</p>
<p>Jika Anda ingin menjelajahi ide-ide ini atau mendapatkan bantuan dengan pengaturan Anda sendiri, <strong>bergabunglah dengan</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channel</a> <strong>kami</strong> untuk mengobrol dengan teknisi Milvus. Dan untuk panduan yang lebih praktis, Anda selalu dapat <strong>memesan</strong> <strong>sesi</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Jam Kerja Milvus</strong></a>.</p>
