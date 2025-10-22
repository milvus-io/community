---
id: >-
  when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
title: >-
  Ketika Rekayasa Konteks Dilakukan dengan Benar, Halusinasi Dapat Menjadi
  Pemicu Kreativitas AI
author: James Luan
date: 2025-09-30T00:00:00.000Z
desc: >-
  Temukan mengapa halusinasi AI bukan sekadar kesalahan, melainkan percikan
  kreativitas-dan bagaimana rekayasa konteks mengubahnya menjadi hasil yang
  dapat diandalkan di dunia nyata.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_1_2025_10_42_15_AM_101639b3bf.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, AI Agents, Context Engineering'
meta_keywords: 'Milvus, vector database, AI Agents, Context Engineering'
meta_title: |
  If Context Engineering Done Right, Hallucinations Can Spark AI Creativity
origin: >-
  https://milvus.io/blog/when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
---
<p>Untuk waktu yang lama, banyak dari kita - termasuk saya - memperlakukan halusinasi LLM tidak lebih dari sekadar cacat. Seluruh rangkaian alat telah dibangun untuk menghilangkannya: sistem pengambilan, pagar pembatas, penyempurnaan, dan banyak lagi. Pengamanan ini masih sangat berharga. Namun, semakin saya mempelajari bagaimana model-model tersebut benar-benar menghasilkan respons - dan bagaimana sistem seperti <a href="https://milvus.io/"><strong>Milvus</strong></a> masuk ke dalam jaringan AI yang lebih luas - saya semakin tidak percaya bahwa halusinasi hanyalah sebuah kegagalan. Faktanya, mereka juga bisa menjadi percikan kreativitas AI.</p>
<p>Jika kita melihat kreativitas manusia, kita akan menemukan pola yang sama. Setiap terobosan bergantung pada lompatan imajinatif. Namun, lompatan tersebut tidak pernah muncul begitu saja. Penyair terlebih dahulu menguasai ritme dan meter sebelum mereka melanggar aturan. Para ilmuwan mengandalkan teori-teori yang sudah mapan sebelum menjelajah ke wilayah yang belum teruji. Kemajuan bergantung pada lompatan-lompatan ini, selama lompatan tersebut didasarkan pada pengetahuan dan pemahaman yang kuat.</p>
<p>LLM beroperasi dengan cara yang hampir sama. Apa yang disebut "halusinasi" atau "lompatan" - analogi, asosiasi, dan ekstrapolasi - muncul dari proses generatif yang sama yang memungkinkan model untuk membuat koneksi, memperluas pengetahuan, dan memunculkan ide-ide di luar apa yang telah dilatih secara eksplisit. Tidak semua lompatan berhasil, tetapi ketika berhasil, hasilnya bisa sangat menarik.</p>
<p>Itulah mengapa saya melihat <strong>Rekayasa Konteks</strong> sebagai langkah penting berikutnya. Daripada mencoba menghilangkan setiap halusinasi, kita harus fokus untuk <em>mengarahkannya</em>. Dengan merancang konteks yang tepat, kita dapat mencapai keseimbangan - menjaga agar model tetap cukup imajinatif untuk mengeksplorasi hal baru, sambil memastikan mereka tetap cukup berlabuh untuk dipercaya.</p>
<h2 id="What-is-Context-Engineering" class="common-anchor-header">Apa yang dimaksud dengan Rekayasa Konteks?<button data-href="#What-is-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Jadi, apa sebenarnya yang dimaksud dengan <em>rekayasa konteks</em>? Istilah ini mungkin masih baru, tetapi praktiknya telah berkembang selama bertahun-tahun. Teknik-teknik seperti RAG, prompting, pemanggilan fungsi, dan MCP merupakan upaya awal untuk memecahkan masalah yang sama: menyediakan model dengan lingkungan yang tepat untuk menghasilkan hasil yang berguna. Rekayasa konteks adalah tentang menyatukan pendekatan-pendekatan tersebut ke dalam kerangka kerja yang koheren.</p>
<h2 id="The-Three-Pillars-of-Context-Engineering" class="common-anchor-header">Tiga Pilar Rekayasa Konteks<button data-href="#The-Three-Pillars-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Rekayasa konteks yang efektif bertumpu pada tiga lapisan yang saling berhubungan:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_engineering_1_8f2b39c5e7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-The-Instructions-Layer--Defining-Direction" class="common-anchor-header">1. Lapisan Petunjuk - Menentukan Arah</h3><p>Lapisan ini mencakup petunjuk, contoh beberapa bidikan, dan demonstrasi. Ini adalah sistem navigasi model: bukan hanya "pergi ke utara" yang samar-samar, tetapi juga rute yang jelas dengan titik-titik arah. Instruksi yang terstruktur dengan baik menetapkan batasan, menentukan tujuan, dan mengurangi ambiguitas dalam perilaku model.</p>
<h3 id="2-The-Knowledge-Layer--Supplying-Ground-Truth" class="common-anchor-header">2. Lapisan Pengetahuan - Menyediakan Kebenaran Dasar</h3><p>Di sini kita menempatkan fakta, kode, dokumen, dan menyatakan bahwa model perlu bernalar secara efektif. Tanpa lapisan ini, sistem akan berimprovisasi dari memori yang tidak lengkap. Dengan lapisan ini, model dapat mendasarkan keluarannya pada data spesifik domain. Semakin akurat dan relevan pengetahuannya, semakin dapat diandalkan penalarannya.</p>
<h3 id="3-The-Tools-Layer--Enabling-Action-and-Feedback" class="common-anchor-header">3. Lapisan Alat - Mengaktifkan Tindakan dan Umpan Balik</h3><p>Lapisan ini mencakup API, pemanggilan fungsi, dan integrasi eksternal. Lapisan ini memungkinkan sistem untuk bergerak lebih dari sekadar penalaran menjadi eksekusi-mengambil data, melakukan perhitungan, atau memicu alur kerja. Yang tidak kalah penting, alat bantu ini memberikan umpan balik secara real-time yang dapat diulang kembali ke dalam penalaran model. Umpan balik itulah yang memungkinkan koreksi, adaptasi, dan peningkatan berkelanjutan. Dalam praktiknya, inilah yang mengubah LLM dari penanggap pasif menjadi partisipan aktif dalam suatu sistem.</p>
<p>Lapisan-lapisan ini tidak terpisah-mereka saling memperkuat satu sama lain. Instruksi menentukan tujuan, pengetahuan menyediakan informasi untuk bekerja, dan alat mengubah keputusan menjadi tindakan dan memasukkan hasil ke dalam lingkaran. Jika diatur dengan baik, mereka menciptakan lingkungan di mana model dapat menjadi kreatif dan dapat diandalkan.</p>
<h2 id="The-Long-Context-Challenges-When-More-Becomes-Less" class="common-anchor-header">Tantangan Konteks yang Panjang: Ketika Lebih Banyak Menjadi Lebih Sedikit<button data-href="#The-Long-Context-Challenges-When-More-Becomes-Less" class="anchor-icon" translate="no">
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
    </button></h2><p>Banyak model AI sekarang mengiklankan jendela jutaan token-cukup untuk ~75.000 baris kode atau dokumen 750.000 kata. Namun, konteks yang lebih banyak tidak secara otomatis memberikan hasil yang lebih baik. Dalam praktiknya, konteks yang sangat panjang memperkenalkan mode kegagalan yang berbeda yang dapat menurunkan penalaran dan keandalan.</p>
<h3 id="Context-Poisoning--When-Bad-Information-Spreads" class="common-anchor-header">Keracunan Konteks - Ketika Informasi Buruk Menyebar</h3><p>Ketika informasi yang salah memasuki konteks kerja-baik dalam tujuan, rangkuman, atau kondisi antara-itu dapat menggagalkan seluruh proses penalaran. <a href="https://arxiv.org/pdf/2507.06261">Laporan Gemini 2.5 dari DeepMind</a> memberikan contoh yang jelas. Seorang agen LLM yang bermain Pokémon salah membaca status permainan dan memutuskan misinya adalah untuk "menangkap legendaris yang tidak bisa ditangkap." Tujuan yang salah tersebut dicatat sebagai fakta, sehingga membuat agen tersebut membuat strategi yang rumit namun mustahil.</p>
<p>Seperti yang ditunjukkan dalam kutipan di bawah ini, konteks yang diracuni menjebak model dalam sebuah lingkaran-kesalahan yang berulang, mengabaikan akal sehat, dan memperkuat kesalahan yang sama hingga seluruh proses penalaran runtuh.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Excerpt_from_Gemini_2_5_Tech_Paper_e89adf9eed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 1: Kutipan dari <a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5 Tech Paper</a></p>
<h3 id="Context-Distraction--Lost-in-the-Details" class="common-anchor-header">Gangguan Konteks - Tersesat dalam Detail</h3><p>Ketika jendela konteks meluas, model dapat mulai membebani transkrip secara berlebihan dan kurang menggunakan apa yang mereka pelajari selama pelatihan. Gemini 2.5 Pro dari DeepMind, misalnya, mendukung jendela jutaan token tetapi <a href="https://arxiv.org/pdf/2507.06261">mulai melayang di sekitar ~100.000 token-mendaur ulang</a>tindakan sebelumnya alih-alih menghasilkan strategi baru. <a href="https://www.databricks.com/blog/long-context-rag-performance-llms">Penelitian Databricks</a> menunjukkan bahwa model yang lebih kecil, seperti Llama 3.1-405B, mencapai batas tersebut jauh lebih cepat, yaitu sekitar ~32.000 token. Ini adalah efek yang biasa terjadi pada manusia: terlalu banyak membaca latar belakang, dan Anda akan kehilangan alur cerita.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Excerpt_from_Gemini_2_5_Tech_Paper_56d775c59d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar 2: Kutipan dari <a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5 Tech Paper</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Long_context_performance_of_GPT_Claude_Llama_Mistral_and_DBRX_models_on_4_curated_RAG_datasets_Databricks_Docs_QA_Finance_Bench_Hot_Pot_QA_and_Natural_Questions_Source_Databricks_99086246b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 3: Performa konteks panjang model GPT, Claude, Llama, Mistral, dan DBRX pada 4 set data RAG yang telah dikurasi (Databricks DocsQA, FinanceBench, HotPotQA, dan Natural Questions) [Sumber:</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>]</em></p>
<h3 id="Context-Confusion--Too-Many-Tools-in-the-Kitchen" class="common-anchor-header">Kebingungan Konteks - Terlalu Banyak Alat di Dapur</h3><p>Menambahkan lebih banyak alat tidak selalu membantu. <a href="https://gorilla.cs.berkeley.edu/leaderboard.html">Berkeley Function-Calling Leaderboard</a> menunjukkan bahwa ketika konteks menampilkan menu alat yang ekstensif - sering kali dengan banyak pilihan yang tidak relevan - keandalan model menurun, dan alat dipanggil bahkan ketika tidak ada yang diperlukan. Salah satu contoh yang jelas: Llama 3.1-8B yang terkuantisasi gagal dengan 46 alat yang tersedia, tetapi berhasil ketika set dikurangi menjadi 19. Ini adalah paradoks pilihan untuk sistem AI - terlalu banyak pilihan, keputusan yang lebih buruk.</p>
<h3 id="Context-Clash--When-Information-Conflicts" class="common-anchor-header">Benturan Konteks - Ketika Informasi Bertentangan</h3><p>Interaksi multi-berputar menambahkan mode kegagalan yang berbeda: kesalahpahaman di awal bertambah seiring dengan bertambahnya cabang dialog. Dalam <a href="https://arxiv.org/pdf/2505.06120v1">percobaan Microsoft dan Salesforce</a>, baik LLM dengan bobot terbuka maupun tertutup berkinerja jauh lebih buruk dalam pengaturan multi-bergiliran dibandingkan dengan pengaturan giliran tunggal - penurunan rata-rata 39% di enam tugas generasi. Begitu asumsi yang salah memasuki kondisi percakapan, giliran berikutnya akan mewarisinya dan memperbesar kesalahan tersebut.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_LL_Ms_get_lost_in_multi_turn_conversations_in_experiments_21f194b02d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 4: LLM tersesat dalam percakapan multi-bergiliran dalam eksperimen</em></p>
<p>Efeknya muncul bahkan dalam model frontier. Ketika tugas benchmark didistribusikan secara bergiliran, skor kinerja model o3 OpenAI turun dari <strong>98,1</strong> menjadi <strong>64,1</strong>. Sebuah kesalahan pembacaan awal secara efektif "mengatur" model dunia; setiap jawaban dibangun di atasnya, mengubah kontradiksi kecil menjadi titik buta yang mengeras kecuali jika dikoreksi secara eksplisit.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_The_performance_scores_in_LLM_multi_turn_conversation_experiments_414d3a0b3f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Gambar 4: Skor kinerja dalam eksperimen percakapan multi-balikan LLM</em></p>
<h2 id="Six-Strategies-to-Tame-Long-Context" class="common-anchor-header">Enam Strategi untuk Menjinakkan Konteks yang Panjang<button data-href="#Six-Strategies-to-Tame-Long-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Jawaban untuk tantangan konteks panjang bukanlah dengan meninggalkan kemampuannya, melainkan dengan merekayasa dengan disiplin. Berikut adalah enam strategi yang telah kami lihat berhasil dalam praktiknya:</p>
<h3 id="Context-Isolation" class="common-anchor-header">Isolasi Konteks</h3><p>Pisahkan alur kerja yang kompleks menjadi agen-agen khusus dengan konteks yang terisolasi. Setiap agen berfokus pada domainnya sendiri tanpa campur tangan, sehingga mengurangi risiko penyebaran kesalahan. Hal ini tidak hanya meningkatkan akurasi tetapi juga memungkinkan eksekusi paralel, seperti halnya tim teknik yang terstruktur dengan baik.</p>
<h3 id="Context-Pruning" class="common-anchor-header">Pemangkasan Konteks</h3><p>Audit dan pangkas konteks secara teratur. Hapus detail yang berlebihan, informasi yang sudah basi, dan jejak yang tidak relevan. Anggap saja sebagai refactoring: bersihkan kode mati dan ketergantungan, hanya menyisakan yang penting. Pemangkasan yang efektif membutuhkan kriteria eksplisit tentang apa yang termasuk dan apa yang tidak.</p>
<h3 id="Context-Summarization" class="common-anchor-header">Peringkasan Konteks</h3><p>Sejarah yang panjang tidak perlu dibawa-bawa secara lengkap. Sebaliknya, ringkaslah menjadi rangkuman ringkas yang hanya menangkap apa yang penting untuk langkah selanjutnya. Rangkuman yang baik mempertahankan fakta, keputusan, dan kendala yang penting, sekaligus menghilangkan pengulangan dan detail yang tidak perlu. Ini seperti mengganti spesifikasi 200 halaman dengan ringkasan desain satu halaman yang masih memberikan semua yang Anda butuhkan untuk melangkah maju.</p>
<h3 id="Context-Offloading" class="common-anchor-header">Pembongkaran Konteks</h3><p>Tidak semua detail perlu menjadi bagian dari konteks langsung. Simpan data yang tidak penting dalam sistem eksternal-basis pengetahuan, penyimpanan dokumen, atau basis data vektor seperti Milvus-dan ambil data tersebut hanya jika diperlukan. Hal ini meringankan beban kognitif model sekaligus menjaga agar informasi latar belakang tetap dapat diakses.</p>
<h3 id="Strategic-RAG" class="common-anchor-header">RAG strategis</h3><p>Pengambilan informasi hanya akan kuat jika dilakukan secara selektif. Masukkan pengetahuan eksternal melalui penyaringan yang ketat dan kontrol kualitas, untuk memastikan model menggunakan input yang relevan dan akurat. Seperti halnya pipeline data lainnya: sampah masuk, sampah keluar-tetapi dengan pengambilan berkualitas tinggi, konteks menjadi aset, bukan liabilitas.</p>
<h3 id="Optimized-Tool-Loading" class="common-anchor-header">Pemuatan Alat yang Dioptimalkan</h3><p>Lebih banyak alat tidak berarti kinerja yang lebih baik. Studi menunjukkan keandalan menurun tajam setelah menggunakan ~30 alat yang tersedia. Muat hanya fungsi yang dibutuhkan oleh tugas yang diberikan, dan tutup akses ke fungsi lainnya. Toolbox yang ramping akan meningkatkan presisi dan mengurangi kebisingan yang dapat membebani pengambilan keputusan.</p>
<h2 id="The-Infrastructure-Challenge-of-Context-Engineering" class="common-anchor-header">Tantangan Infrastruktur dari Rekayasa Konteks<button data-href="#The-Infrastructure-Challenge-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>Rekayasa konteks hanya seefektif infrastruktur yang digunakannya. Dan perusahaan-perusahaan saat ini sedang menghadapi badai tantangan data yang sempurna:</p>
<h3 id="Scale-Explosion--From-Terabytes-to-Petabytes" class="common-anchor-header">Ledakan Skala - Dari Terabyte ke Petabyte</h3><p>Saat ini, pertumbuhan data telah mendefinisikan ulang garis dasar. Beban kerja yang dulunya muat dengan nyaman dalam satu basis data kini mencapai petabyte, menuntut penyimpanan dan komputasi terdistribusi. Perubahan skema yang dulunya hanya berupa pembaruan SQL satu baris dapat berubah menjadi upaya orkestrasi penuh di seluruh cluster, pipeline, dan layanan. Penskalaan bukan sekadar menambahkan perangkat keras-ini adalah tentang rekayasa untuk koordinasi, ketahanan, dan elastisitas pada skala di mana setiap asumsi akan diuji.</p>
<h3 id="Consumption-Revolution--Systems-That-Speak-AI" class="common-anchor-header">Revolusi Konsumsi - Sistem yang Berbicara dengan AI</h3><p>Agen AI tidak hanya meminta data; mereka menghasilkan, mengubah, dan mengonsumsinya secara terus menerus dengan kecepatan mesin. Infrastruktur yang dirancang hanya untuk aplikasi yang berhadapan dengan manusia tidak dapat mengimbanginya. Untuk mendukung agen, sistem harus menyediakan pengambilan data dengan latensi rendah, streaming pembaruan, dan beban kerja yang berat tanpa putus. Dengan kata lain, tumpukan infrastruktur harus dibangun untuk "berbicara dengan AI" sebagai beban kerja aslinya, bukan sebagai tambahan.</p>
<h3 id="Multimodal-Complexity--Many-Data-Types-One-System" class="common-anchor-header">Kompleksitas Multimodal - Banyak Jenis Data, Satu Sistem</h3><p>Beban kerja AI memadukan teks, gambar, audio, video, dan penyematan dimensi tinggi, masing-masing dengan metadata yang kaya. Mengelola heterogenitas ini adalah inti dari rekayasa konteks praktis. Tantangannya bukan hanya menyimpan objek yang beragam, tetapi juga mengindeksnya, mengambilnya secara efisien, dan menjaga konsistensi semantik di seluruh modalitas. Infrastruktur yang benar-benar siap untuk AI harus memperlakukan multimodalitas sebagai prinsip desain kelas satu, bukan fitur tambahan.</p>
<h2 id="Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="common-anchor-header">Milvus + Loon: Infrastruktur Data yang Dibangun Khusus untuk AI<button data-href="#Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>Tantangan skala, konsumsi, dan multimodalitas tidak dapat diselesaikan dengan teori saja - mereka menuntut infrastruktur yang dibangun khusus untuk AI. Itulah mengapa kami di <a href="https://zilliz.com/">Zilliz</a> merancang <strong>Milvus</strong> dan <strong>Loon</strong> untuk bekerja sama, mengatasi kedua sisi masalah: pengambilan data berkinerja tinggi pada saat proses dan pemrosesan data berskala besar di bagian hulu.</p>
<ul>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a>: basis data vektor sumber terbuka yang paling banyak diadopsi yang dioptimalkan untuk pengambilan dan penyimpanan vektor berkinerja tinggi.</p></li>
<li><p><strong>Loon</strong>: layanan data lake multimodal cloud-native kami yang akan datang, yang dirancang untuk memproses dan mengatur data multimodal berskala masif sebelum data tersebut masuk ke dalam basis data. Pantau terus perkembangannya.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/loon_milvus_min_76aaa39b4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Lightning-Fast-Vector-Search" class="common-anchor-header">Pencarian Vektor Secepat Kilat</h3><p><strong>Milvus</strong> dibangun dari bawah ke atas untuk beban kerja vektor. Sebagai lapisan penayangan, Milvus memberikan pengambilan sub-10ms di ratusan juta - atau bahkan miliaran - vektor, baik yang berasal dari teks, gambar, audio, atau video. Untuk aplikasi AI, kecepatan pengambilan bukanlah hal yang "bagus untuk dimiliki." Inilah yang menentukan apakah sebuah agen terasa responsif atau lamban, apakah hasil pencarian terasa relevan atau tidak. Performa di sini terlihat langsung dalam pengalaman pengguna akhir.</p>
<h3 id="Multimodal-Data-Lake-Service-at-Scale" class="common-anchor-header">Layanan Data Lake Multimodal dalam Skala Besar</h3><p><strong>Loon</strong> adalah layanan data lake multimodal kami yang akan datang, yang dirancang untuk pemrosesan offline berskala besar dan analisis data tidak terstruktur. Layanan ini melengkapi Milvus di sisi pipeline, menyiapkan data sebelum mencapai database. Kumpulan data multimodal di dunia nyata-mencakup teks, gambar, audio, dan video-sering kali berantakan, dengan duplikasi, noise, dan format yang tidak konsisten. Loon menangani pekerjaan berat ini dengan menggunakan kerangka kerja terdistribusi seperti Ray dan Daft, mengompresi, menduplikasi, dan mengelompokkan data sebelum mengalirkannya secara langsung ke Milvus. Hasilnya sederhana: tidak ada hambatan pementasan, tidak ada konversi format yang menyakitkan - hanya data yang bersih dan terstruktur yang dapat segera digunakan oleh model.</p>
<h3 id="Cloud-Native-Elasticity" class="common-anchor-header">Elastisitas Cloud-Native</h3><p>Kedua sistem ini dibangun secara cloud-native, dengan penyimpanan dan penskalaan komputasi secara independen. Ini berarti ketika beban kerja bertambah dari gigabyte menjadi petabyte, Anda dapat menyeimbangkan sumber daya antara penayangan waktu nyata dan pelatihan offline, daripada menyediakan sumber daya yang berlebihan untuk satu atau mengurangi yang lain.</p>
<h3 id="Future-Proof-Architecture" class="common-anchor-header">Arsitektur yang Tahan Masa Depan</h3><p>Yang terpenting, arsitektur ini dirancang untuk tumbuh bersama Anda. Rekayasa konteks masih terus berkembang. Saat ini, sebagian besar tim berfokus pada pencarian semantik dan pipeline RAG. Tetapi gelombang berikutnya akan menuntut lebih banyak lagi-mengintegrasikan berbagai jenis data, penalaran di dalamnya, dan memberdayakan alur kerja yang digerakkan oleh agen.</p>
<p>Dengan Milvus dan Loon, transisi tersebut tidak perlu merobohkan fondasi Anda. Stack yang sama yang mendukung kasus penggunaan hari ini dapat diperluas secara alami ke hari esok. Anda dapat menambahkan kemampuan baru tanpa harus memulai dari awal, yang berarti lebih sedikit risiko, biaya yang lebih rendah, dan jalur yang lebih lancar saat beban kerja AI menjadi lebih kompleks.</p>
<h2 id="Your-Next-Move" class="common-anchor-header">Langkah Anda Selanjutnya<button data-href="#Your-Next-Move" class="anchor-icon" translate="no">
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
    </button></h2><p>Rekayasa konteks bukan sekadar disiplin teknis-ini adalah cara kami membuka potensi kreatif AI sekaligus menjaganya agar tetap membumi dan dapat diandalkan. Jika Anda siap untuk mempraktikkan ide-ide ini, mulailah dari hal yang paling penting.</p>
<ul>
<li><p><a href="https://milvus.io/docs/overview.md"><strong>Bereksperimenlah dengan Milvus</strong></a> untuk melihat bagaimana basis data vektor dapat mengaitkan pencarian dalam penerapan di dunia nyata.</p></li>
<li><p><a href="https://www.linkedin.com/company/the-milvus-project/"><strong>Ikuti Milvus</strong></a> untuk mengetahui informasi terbaru tentang rilis Loon dan wawasan tentang mengelola data multimodal berskala besar.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Bergabunglah dengan komunitas Zilliz di Discord</strong></a> untuk berbagi strategi, membandingkan arsitektur, dan membantu membentuk praktik terbaik.</p></li>
</ul>
<p>Perusahaan yang menguasai rekayasa konteks hari ini akan membentuk lanskap AI di masa depan. Jangan biarkan infrastruktur menjadi penghalang-bangun fondasi yang layak untuk kreativitas AI Anda.</p>
