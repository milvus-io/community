---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: >-
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think: Model Mana yang Cocok dengan
  Tumpukan Agen AI Anda?
author: 'Lumina Wang, Julie Xia'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  Perbandingan langsung GLM-5, MiniMax M2.5, dan Gemini 3 Deep Think untuk
  pengkodean, penalaran, dan agen AI. Termasuk tutorial RAG dengan Milvus.
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>Hanya dalam waktu dua hari, tiga model utama diluncurkan secara berurutan: GLM-5, MiniMax M2.5, dan Gemini 3 Deep Think. Ketiganya memiliki kemampuan yang sama: <strong>pengkodean, penalaran yang mendalam, dan alur kerja agen.</strong> Ketiganya mengklaim hasil yang canggih. Jika Anda menyipitkan mata pada lembar spesifikasi, Anda hampir dapat memainkan permainan mencocokkan dan menghilangkan poin-poin yang sama pada ketiganya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Pikiran yang lebih menakutkan? Atasan Anda mungkin sudah melihat pengumumannya dan ingin sekali Anda membuat sembilan aplikasi internal menggunakan ketiga model tersebut sebelum minggu ini berakhir.</p>
<p>Jadi, apa yang sebenarnya membedakan model-model ini? Bagaimana Anda harus memilih di antara mereka? Dan (seperti biasa) bagaimana Anda menghubungkannya dengan <a href="https://milvus.io/">Milvus</a> untuk mengirimkan basis pengetahuan internal? Tandai halaman ini. Di sana ada semua yang Anda butuhkan.</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">Sekilas tentang GLM-5, MiniMax M2.5, dan Gemini 3 Deep Think<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5 memimpin dalam rekayasa sistem yang kompleks dan tugas agen cakrawala panjang</h3><p>Pada tanggal 12 Februari, Zhipu secara resmi meluncurkan GLM-5, yang unggul dalam rekayasa sistem yang kompleks dan alur kerja agen jangka panjang.</p>
<p>Model ini memiliki parameter 355B-744B (40B aktif), dilatih dengan token 28,5T. Model ini mengintegrasikan mekanisme perhatian yang jarang dengan kerangka kerja pembelajaran penguatan asinkron yang disebut Slime, yang memungkinkannya menangani konteks yang sangat panjang tanpa kehilangan kualitas sekaligus menekan biaya penerapan.</p>
<p>GLM-5 memimpin paket open-source pada tolok ukur utama, menempati peringkat #1 di SWE-bench Verified (77,8) dan #1 di Terminal Bench 2.0 (56,2) - di depan MiniMax 2.5 dan Gemini 3 Deep Think. Meskipun begitu, skor utamanya masih berada di bawah model-model sumber tertutup teratas seperti Claude Opus 4.5 dan GPT-5.2. Dalam Vending Bench 2, sebuah evaluasi simulasi bisnis, GLM-5 menghasilkan $ 4.432 dalam simulasi laba tahunan, menempatkannya secara kasar dalam kisaran yang sama dengan sistem sumber tertutup.</p>
<p>GLM-5 juga melakukan peningkatan yang signifikan pada rekayasa sistem dan kemampuan agen jangka panjangnya. Sekarang dapat mengonversi teks atau bahan mentah secara langsung menjadi file .docx, .pdf, dan .xlsx, dan menghasilkan hasil tertentu seperti dokumen persyaratan produk, rencana pelajaran, ujian, spreadsheet, laporan keuangan, diagram alir, dan menu.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">Gemini 3 Deep Think menetapkan standar baru untuk penalaran ilmiah</h3><p>Pada dini hari tanggal 13 Februari 2026, Google secara resmi merilis Gemini 3 Deep Think, sebuah peningkatan besar yang saya sebut sebagai model penelitian dan penalaran terkuat di planet ini. Bagaimanapun, Gemini adalah satu-satunya model yang lulus uji coba pencucian mobil: "<em>Saya ingin mencuci mobil dan tempat pencucian mobil hanya berjarak 50 meter. Haruskah saya menyalakan mobil saya dan berkendara ke sana atau berjalan kaki saja</em>?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kekuatan utamanya adalah penalaran tingkat atas dan kinerja kompetisi: ia mencapai 3455 Elo di Codeforces, setara dengan programmer kompetitif terbaik kedelapan di dunia. Ia mencapai standar medali emas pada bagian tertulis Olimpiade Fisika, Kimia, dan Matematika Internasional 2025. Efisiensi biaya adalah terobosan lainnya. ARC-AGI-1 berjalan hanya dengan $7,17 per tugas, pengurangan 280x hingga 420x dibandingkan dengan o3-preview OpenAI dari 14 bulan sebelumnya. Di sisi terapan, keuntungan terbesar Deep Think adalah dalam penelitian ilmiah. Para ahli sudah menggunakannya untuk tinjauan sejawat makalah matematika profesional dan untuk mengoptimalkan alur kerja persiapan pertumbuhan kristal yang kompleks.</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 bersaing dalam hal biaya dan kecepatan untuk beban kerja produksi</h3><p>Pada hari yang sama, MiniMax merilis M2.5, memposisikannya sebagai juara dalam hal biaya dan efisiensi untuk kasus-kasus produksi.</p>
<p>Sebagai salah satu keluarga model yang paling cepat beriterasi di industri ini, M2.5 menetapkan hasil SOTA baru di seluruh pengkodean, pemanggilan alat, pencarian, dan produktivitas kantor. Biaya adalah nilai jual terbesarnya: versi cepat berjalan pada sekitar 100 TPS, dengan harga input <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,30 juta</mn><mi>token</mi><mn>dan output 0,</mn></mrow><annotation encoding="application/x-tex">30 per juta token dan output di</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">30</span><span class="mord">juta token dan output 2</span></span></span></span>,40 per juta token. Versi 50 TPS memangkas biaya produksi hingga setengahnya. Kecepatan meningkat 37% dari M2.1 sebelumnya, dan menyelesaikan tugas SWE-bench Verified dalam rata-rata 22,8 menit, secara kasar menyamai Claude Opus 4.6. Di sisi kapabilitas, M2.5 mendukung pengembangan full-stack dalam lebih dari 10 bahasa, termasuk Go, Rust, dan Kotlin, yang mencakup segala hal mulai dari desain sistem nol-ke-satu hingga tinjauan kode lengkap. Untuk alur kerja kantor, fitur Office Skills-nya terintegrasi secara mendalam dengan Word, PPT, dan Excel. Ketika dikombinasikan dengan pengetahuan domain di bidang keuangan dan hukum, ini dapat menghasilkan laporan penelitian dan model keuangan yang siap untuk digunakan secara langsung.</p>
<p>Itulah gambaran umum tingkat tinggi. Selanjutnya, mari kita lihat bagaimana kinerjanya dalam pengujian langsung.</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">Perbandingan Langsung<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">Rendering pemandangan 3D: Gemini 3 Deep Think menghasilkan hasil yang paling realistis</h3><p>Kami mengambil perintah yang telah diuji oleh pengguna pada Gemini 3 Deep Think dan menjalankannya melalui GLM-5 dan MiniMax M2.5 untuk perbandingan langsung. Perintahnya: buatlah adegan Three.js yang lengkap dalam satu file HTML yang membuat ruangan interior 3D sepenuhnya yang tidak dapat dibedakan dari lukisan cat minyak klasik di museum.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gemini 3 Deep Think</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think</strong> memberikan hasil yang paling baik. Kamera ini secara akurat menafsirkan perintah dan menghasilkan pemandangan 3D berkualitas tinggi. Pencahayaan sangat menonjol: arah bayangan dan kejatuhannya terlihat alami, secara jelas menyampaikan hubungan spasial cahaya alami yang masuk melalui jendela. Detail yang halus juga mengesankan, termasuk tekstur lilin yang setengah meleleh dan kualitas material segel lilin merah. Secara keseluruhan, ketepatan visual sangat tinggi.</p>
<p><strong>GLM-5</strong> menghasilkan pemodelan objek dan tekstur yang mendetail, tetapi sistem pencahayaannya memiliki masalah yang kentara. Bayangan meja ditampilkan sebagai blok hitam murni yang keras tanpa transisi yang lembut. Segel lilin tampak mengambang di atas permukaan meja, gagal menangani hubungan kontak antara objek dan permukaan meja dengan benar. Artefak ini menunjukkan ruang untuk perbaikan dalam pencahayaan global dan penalaran spasial.</p>
<p><strong>MiniMax M2.5</strong> tidak dapat menguraikan deskripsi pemandangan yang kompleks secara efektif. Outputnya hanya berupa gerakan partikel yang tidak teratur, yang mengindikasikan keterbatasan yang signifikan dalam pemahaman dan pembangkitan ketika menangani instruksi semantik berlapis-lapis dengan persyaratan visual yang tepat.</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">Pembuatan SVG: ketiga model menanganinya secara berbeda</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Prompt:</strong> Buatlah SVG burung pelikan coklat California yang sedang mengendarai sepeda. Sepeda harus memiliki jari-jari dan rangka sepeda yang berbentuk benar. Burung pelikan harus memiliki ciri khas kantongnya yang besar, dan harus ada indikasi bulu yang jelas. Burung pelikan harus mengayuh sepeda dengan jelas. Gambar harus menunjukkan seluruh bulu pelikan coklat California.</p>
<p><strong>Gemini 3 Berpikir Dalam</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>Gemini 3 Berpikir Dalam</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p><strong>Gemini 3 Deep Think</strong> menghasilkan SVG yang paling lengkap secara keseluruhan. Postur berkendara burung pelikan ini sangat akurat: pusat gravitasinya berada secara alami di atas jok, dan kakinya bertumpu pada pedal dalam pose bersepeda yang dinamis. Tekstur bulu sangat detail dan berlapis-lapis. Satu titik lemahnya adalah kantong tenggorokan khas burung pelikan digambar terlalu besar, yang sedikit mengganggu proporsi keseluruhan.</p>
<p><strong>GLM-5</strong> memiliki masalah postur tubuh yang nyata. Kaki ditempatkan dengan benar pada pedal, tetapi posisi duduknya secara keseluruhan menjauh dari postur berkendara yang alami, dan hubungan tubuh-ke-kursi terlihat tidak pas. Meskipun demikian, detailnya sangat bagus: kantong tenggorokannya proporsional, dan kualitas tekstur bulunya cukup baik.</p>
<p><strong>MiniMax M2.5</strong> tampil dengan gaya minimalis dan meniadakan elemen latar belakang sama sekali. Posisi burung pelikan pada sepeda secara kasar sudah tepat, tetapi detailnya kurang bagus. Setang sepeda memiliki bentuk yang salah, tekstur bulu hampir tidak ada, leher sepeda terlalu tebal, dan ada artefak oval putih yang tersesat pada gambar yang seharusnya tidak ada di sana.</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">Cara Memilih Antara GLM-5, MiniMax M2.5 dan Gemin 3 Deep Think<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Dari semua pengujian kami, MiniMax M2.5 adalah yang paling lambat dalam menghasilkan output, membutuhkan waktu yang paling lama untuk berpikir dan bernalar. GLM-5 tampil secara konsisten dan kira-kira setara dengan Gemini 3 Deep Think dalam hal kecepatan.</p>
<p>Berikut adalah panduan pemilihan cepat yang kami susun:</p>
<table>
<thead>
<tr><th>Kasus Penggunaan Inti</th><th>Model yang Direkomendasikan</th><th>Kekuatan Utama</th></tr>
</thead>
<tbody>
<tr><td>Penelitian ilmiah, penalaran tingkat lanjut (fisika, kimia, matematika, desain algoritme yang rumit)</td><td>Gemini 3 Deep Think</td><td>Peraih medali emas dalam kompetisi akademik. Verifikasi data ilmiah tingkat atas. Pemrograman kompetitif kelas dunia di Codeforces. Aplikasi penelitian yang telah terbukti, termasuk mengidentifikasi kelemahan logis dalam makalah profesional. (Saat ini terbatas pada pelanggan Google AI Ultra dan pengguna perusahaan tertentu; biaya per tugas relatif tinggi).</td></tr>
<tr><td>Penerapan sumber terbuka, kustomisasi intranet perusahaan, pengembangan full-stack, integrasi keterampilan kantor</td><td>Zhipu GLM-5</td><td>Model sumber terbuka peringkat teratas. Kemampuan rekayasa tingkat sistem yang kuat. Mendukung penyebaran lokal dengan biaya yang dapat dikelola.</td></tr>
<tr><td>Beban kerja yang sensitif terhadap biaya, pemrograman multi-bahasa, pengembangan lintas platform (Web / Android / iOS / Windows), kompatibilitas kantor</td><td>MiniMax M2.5</td><td>Pada 100 TPS: <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>30</mi><mn>juta token input</mn></mrow><annotation encoding="application/x-tex">, 0,30 per juta token input,</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">30</span><span class="mord">juta token input</span><span class="mpunct">,</span></span></span></span>2,40 per juta token output. SOTA di seluruh tolok ukur kantor, pengkodean, dan pemanggilan alat. Peringkat pertama di Multi-SWE-Bench. Generalisasi yang kuat. Tingkat kelulusan di Droid/OpenCode melebihi Claude Opus 4.6.</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">Tutorial RAG: Menghubungkan GLM-5 dengan Milvus untuk Basis Pengetahuan<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Baik GLM-5 dan MiniMax M2.5 tersedia melalui <a href="https://openrouter.ai/">OpenRouter</a>. Daftar dan buat <code translate="no">OPENROUTER_API_KEY</code> untuk memulai.</p>
<p>Tutorial ini menggunakan GLM-5 dari Zhipu sebagai contoh LLM. Untuk menggunakan MiniMax, cukup ganti nama modelnya menjadi <code translate="no">minimax/minimax-m2.5</code>.</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">Ketergantungan dan pengaturan lingkungan</h3><p>Instal atau tingkatkan pymilvus, openai, request, dan tqdm ke versi terbarunya:</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>Tutorial ini menggunakan GLM-5 sebagai LLM dan text-embedding-3-small dari OpenAI sebagai model penyematan.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">Persiapan data</h3><p>Kita akan menggunakan halaman FAQ dari dokumentasi Milvus 2.4.x sebagai basis pengetahuan pribadi kita.</p>
<p>Unduh berkas zip dan ekstrak dokumen-dokumen tersebut ke dalam folder <code translate="no">milvus_docs</code>:</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Muat semua berkas Markdown dari <code translate="no">milvus_docs/en/faq</code>. Kami membagi setiap berkas di <code translate="no">&quot;# &quot;</code> untuk memisahkan konten secara kasar berdasarkan bagian-bagian utama:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLM dan penyiapan model penyematan</h3><p>Kita akan menggunakan GLM-5 sebagai LLM dan text-embedding-3-kecil sebagai model penyematan:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Buatlah sebuah embedding uji coba dan cetak dimensi dan beberapa elemen pertamanya:</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Memuat data ke dalam Milvus</h3><p><strong>Buat sebuah koleksi:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Catatan tentang konfigurasi MilvusClient:</p>
<ul>
<li><p>Mengatur URI ke file lokal (misalnya, <code translate="no">./milvus.db</code>) adalah opsi yang paling sederhana. Secara otomatis Milvus Lite akan menggunakan file tersebut untuk menyimpan semua data dalam file tersebut.</p></li>
<li><p>Untuk data berskala besar, Anda dapat menggunakan server Milvus yang lebih berkinerja pada Docker atau Kubernetes. Dalam hal ini, gunakan URI server (misalnya, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p>Untuk menggunakan Zilliz Cloud (versi cloud yang dikelola sepenuhnya dari Milvus), atur URI dan token ke Public Endpoint dan kunci API dari konsol Zilliz Cloud Anda.</p></li>
</ul>
<p>Periksa apakah koleksi sudah ada, dan hapus jika sudah ada:</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Buat koleksi baru dengan parameter yang ditentukan. Jika Anda tidak memberikan definisi bidang, Milvus secara otomatis membuat bidang <code translate="no">id</code> default sebagai kunci utama dan bidang <code translate="no">vector</code> untuk data vektor. Bidang JSON yang dicadangkan menyimpan bidang dan nilai apa pun yang tidak didefinisikan dalam skema:</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">Menyisipkan data</h3><p>Lakukan perulangan melalui baris teks, buat penyematan, dan sisipkan data ke dalam Milvus. Bidang <code translate="no">text</code> di sini tidak didefinisikan dalam skema. Bidang ini secara otomatis ditambahkan sebagai bidang dinamis yang didukung oleh bidang JSON yang telah disediakan oleh Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">Membangun pipeline RAG</h3><p><strong>Mengambil dokumen yang relevan:</strong></p>
<p>Mari ajukan pertanyaan umum tentang Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cari koleksi untuk 3 hasil paling relevan:</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Hasil diurutkan berdasarkan jarak, yang terdekat terlebih dahulu:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Hasilkan tanggapan dengan LLM:</strong></p>
<p>Gabungkan dokumen yang diambil ke dalam string konteks:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Mengatur sistem dan perintah pengguna. Perintah pengguna dibuat dari dokumen yang diambil dari Milvus:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Panggil GLM-5 untuk menghasilkan jawaban akhir:</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 mengembalikan jawaban yang terstruktur dengan baik:</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">Kesimpulan: Pilih Model, Lalu Bangun Pipeline<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketiga model tersebut kuat, tetapi mereka kuat dalam hal yang berbeda. Gemini 3 Deep Think adalah pilihan yang tepat ketika kedalaman penalaran lebih penting daripada biaya. GLM-5 adalah opsi sumber terbuka terbaik untuk tim yang membutuhkan penerapan lokal dan rekayasa tingkat sistem. MiniMax M2.5 masuk akal ketika Anda mengoptimalkan keluaran dan anggaran di seluruh beban kerja produksi.</p>
<p>Model yang Anda pilih hanyalah setengah dari persamaan. Untuk mengubah semua ini menjadi aplikasi yang berguna, Anda memerlukan lapisan pengambilan yang dapat menyesuaikan dengan data Anda. Di situlah Milvus cocok. Tutorial RAG di atas dapat digunakan dengan model yang kompatibel dengan OpenAI, jadi untuk menukar antara GLM-5, MiniMax M2.5, atau rilis yang akan datang hanya membutuhkan satu perubahan baris.</p>
<p>Jika Anda sedang merancang agen AI lokal atau on-prem dan ingin mendiskusikan arsitektur penyimpanan, desain sesi, atau rollback yang aman secara lebih mendetail, jangan ragu untuk bergabung dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">saluran Slack</a> kami, Anda juga dapat memesan sesi one-on-one selama 20 menit melalui <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> untuk panduan yang dipersonalisasi.</p>
<p>Jika Anda ingin mempelajari lebih dalam tentang cara membuat Agen AI, berikut ini adalah beberapa sumber daya yang dapat membantu Anda memulai.</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Cara Membangun Sistem Multi-Agen yang Siap Produksi dengan Agno dan Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn">Memilih Model Penyematan yang Tepat untuk Pipeline RAG Anda</a></p></li>
<li><p><a href="https://zilliz.com/learn">Cara Membangun Agen AI dengan Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Apa itu OpenClaw? Panduan Lengkap untuk Agen AI Sumber Terbuka</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial OpenClaw: Menghubungkan ke Slack untuk Asisten AI Lokal</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Membuat Agen AI Bergaya Clawdbot dengan LangGraph &amp; Milvus</a></p></li>
</ul>
