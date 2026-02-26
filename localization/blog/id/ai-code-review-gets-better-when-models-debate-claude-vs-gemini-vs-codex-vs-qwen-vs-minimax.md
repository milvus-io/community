---
id: >-
  ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md
title: >-
  Ulasan Kode AI Menjadi Lebih Baik Ketika Model Berdebat: Claude vs Gemini vs
  Codex vs Qwen vs MiniMax
author: Li Liu
date: 2026-02-26T00:00:00.000Z
cover: >-
  assets.zilliz.com/Code_Review_Benchmark_Cover_Fixed_Icons_2048x1143_11zon_1_04796f1364.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI Code Review, Qwen, Claude, Gemini, Codex'
meta_keywords: >-
  AI code review, LLM code review benchmark, Claude vs Gemini vs Codex, AI code
  review benchmark, multi-model AI debate
meta_title: |
  Claude vs Gemini vs Codex vs Qwen vs MiniMax Code Review
desc: >-
  Kami menguji Claude, Gemini, Codex, Qwen, dan MiniMax pada pendeteksian bug
  yang sebenarnya. Model terbaik mencapai 53%. Setelah perdebatan sengit,
  pendeteksiannya melonjak hingga 80%.
origin: 'https://milvus.io/blog/ai-code-review-benchmark-multi-model-debate.md'
---
<p>Baru-baru ini saya menggunakan model AI untuk meninjau sebuah pull request, dan hasilnya bertentangan: Claude menandai adanya perlombaan data, sementara Gemini mengatakan bahwa kodenya bersih. Hal ini membuat saya penasaran tentang bagaimana model AI lainnya akan berperilaku, jadi saya menjalankan model unggulan terbaru dari Claude, Gemini, Codex, Qwen, dan MiniMax melalui tolok ukur tinjauan kode terstruktur. Hasilnya? Model dengan performa terbaik hanya menangkap 53% bug yang diketahui.</p>
<p>Namun, keingintahuan saya tidak berhenti sampai di situ: bagaimana jika model-model AI ini bekerja sama? Saya bereksperimen dengan membuat mereka saling berdebat, dan setelah lima putaran perdebatan yang saling berlawanan, deteksi bug melonjak menjadi 80%. Bug yang paling sulit, yang membutuhkan pemahaman tingkat sistem, mencapai deteksi 100% dalam mode debat.</p>
<p>Artikel ini membahas desain eksperimen, hasil per model, dan apa yang diungkapkan oleh mekanisme debat tentang bagaimana sebenarnya menggunakan AI untuk peninjauan kode.</p>
<h2 id="Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="common-anchor-header">Membandingkan Claude, Gemini, Codex, Qwen, dan MiniMax untuk peninjauan kode<button data-href="#Benchmarking-Claude-Gemini-Codex-Qwen-and-MiniMax-for-code-review" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda telah menggunakan model untuk peninjauan kode, Anda mungkin memperhatikan bahwa model-model tersebut tidak hanya berbeda dalam hal akurasi, tetapi juga berbeda dalam hal cara mereka membaca kode. Sebagai contoh:</p>
<p>Claude biasanya berjalan di rantai pemanggilan dari atas ke bawah dan akan menghabiskan waktu di jalur yang "membosankan" (penanganan kesalahan, percobaan ulang, pembersihan). Di situlah sering kali bug yang sebenarnya bersembunyi, jadi saya tidak membenci ketelitiannya.</p>
<p>Gemini cenderung memulai dengan keputusan yang kuat ("ini buruk"/"terlihat baik-baik saja") dan kemudian bekerja mundur untuk membenarkannya dari sudut pandang desain/struktur. Terkadang hal itu berguna. Kadang-kadang itu terbaca seperti membaca sekilas dan kemudian melakukan pengambilan gambar.</p>
<p>Codex lebih tenang. Tetapi ketika menandai sesuatu, sering kali konkret dan dapat ditindaklanjuti - lebih sedikit komentar, lebih banyak "baris ini salah karena X."</p>
<p>Namun, ini adalah kesan, bukan pengukuran. Untuk mendapatkan angka yang sebenarnya, saya membuat tolok ukur.</p>
<h3 id="Setup" class="common-anchor-header">Pengaturan</h3><p><strong>Lima model unggulan diuji:</strong></p>
<ul>
<li><p>Claude Opus 4.6</p></li>
<li><p>Gemini 3 Pro</p></li>
<li><p>GPT-5.2-Codex</p></li>
<li><p>Qwen-3.5-Plus</p></li>
<li><p>MiniMax-M2.5</p></li>
</ul>
<p><strong>Perkakas (Magpie)</strong></p>
<p>Saya menggunakan <a href="https://github.com/liliu-z/magpie">Magpie</a>, sebuah alat benchmarking sumber terbuka yang saya buat sendiri. Tugasnya adalah melakukan "persiapan tinjauan kode" yang biasanya Anda lakukan secara manual: menarik konteks di sekitarnya (rantai pemanggilan, modul terkait, dan kode yang berdekatan yang relevan) dan memasukkannya ke model <em>sebelum</em> meninjau PR.</p>
<p><strong>Kasus uji (PR Milvus dengan bug yang diketahui)</strong></p>
<p>Dataset ini terdiri dari 15 pull request dari <a href="https://github.com/milvus-io/milvus">Milvus</a> (database vektor sumber terbuka yang dibuat dan dikelola oleh <a href="https://zilliz.com/">Zilliz</a>). PR ini berguna sebagai tolok ukur karena masing-masing digabungkan, hanya untuk kemudian memerlukan pengembalian atau perbaikan setelah bug muncul dalam produksi. Jadi, setiap kasus memiliki bug yang diketahui yang dapat kami nilai.</p>
<p><strong>Tingkat kesulitan bug</strong></p>
<p>Tidak semua bug ini sama sulitnya untuk ditemukan, jadi saya mengkategorikannya ke dalam tiga tingkat kesulitan:</p>
<ul>
<li><p><strong>L1:</strong> Terlihat dari diff saja (use-after-free, off-by-one).</p></li>
<li><p><strong>L2 (10 kasus):</strong> Membutuhkan pemahaman kode di sekitarnya untuk menemukan hal-hal seperti perubahan semantik antarmuka atau perlombaan konkurensi. Ini merupakan bug yang paling umum ditemukan dalam peninjauan kode harian.</p></li>
<li><p><strong>L3 (5 kasus):</strong> Membutuhkan pemahaman tingkat sistem untuk menangkap masalah seperti inkonsistensi status lintas modul atau masalah kompatibilitas peningkatan. Ini adalah tes tersulit untuk mengetahui seberapa dalam sebuah model dapat memahami basis kode.</p></li>
</ul>
<p><em>Catatan: Setiap model menangkap semua bug L1, jadi saya tidak memasukkannya dalam penilaian.</em></p>
<p><strong>Dua mode evaluasi</strong></p>
<p>Setiap model dijalankan dalam dua mode:</p>
<ul>
<li><p><strong>Raw:</strong> model hanya melihat PR (diff + apa pun yang ada di konten PR).</p></li>
<li><p><strong>R1:</strong> Magpie menarik konteks di sekitarnya (file yang relevan / situs panggilan / kode terkait) <em>sebelum</em> model meninjau. Ini mensimulasikan alur kerja di mana Anda menyiapkan konteks di depan alih-alih meminta model untuk menebak apa yang dibutuhkannya.</p></li>
</ul>
<h3 id="Results-L2-+-L3-only" class="common-anchor-header">Hasil (hanya L2 + L3)</h3><table>
<thead>
<tr><th>Mode</th><th>Claude</th><th>Gemini</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Mentah</td><td>53% (pertama)</td><td>13% (terakhir)</td><td>33%</td><td>27%</td><td>33%</td></tr>
<tr><td>R1 (dengan konteks oleh Magpie)</td><td>47% ⬇️</td><td>33%⬆️</td><td>27%</td><td>33%</td><td>40%⬆️</td></tr>
</tbody>
</table>
<p>Empat hal yang dapat diambil:</p>
<p><strong>1. Claude mendominasi tinjauan mentah.</strong> Dia mendapatkan skor 53% deteksi keseluruhan dan 5/5 sempurna untuk bug L3, tanpa bantuan konteks apa pun. Jika Anda menggunakan satu model dan tidak ingin menghabiskan waktu untuk menyiapkan konteks, Claude adalah pilihan terbaik.</p>
<p><strong>2. Gemini membutuhkan konteks yang diberikan kepadanya.</strong> Skor mentahnya sebesar 13% adalah yang terendah dalam grup, tetapi dengan Magpie yang menyediakan kode di sekitarnya, skornya melonjak menjadi 33%. Gemini tidak mengumpulkan konteksnya sendiri dengan baik, tetapi kinerjanya cukup baik ketika Anda melakukan pekerjaan itu di awal.</p>
<p><strong>3. Qwen adalah pemain dengan bantuan konteks terkuat.</strong> Ia mendapat skor 40% dalam mode R1, dengan 5/10 pada bug L2, yang merupakan skor tertinggi pada tingkat kesulitan itu. Untuk tinjauan harian rutin yang mengharuskan Anda menyiapkan konteks, Qwen adalah pilihan yang praktis.</p>
<p><strong>4. Lebih banyak konteks tidak selalu membantu.</strong> Hal ini mengangkat Gemini (13% → 33%) dan MiniMax (27% → 33%), namun sebenarnya merugikan Claude (53% → 47%). Claude sudah unggul dalam mengatur konteksnya sendiri, sehingga informasi tambahan kemungkinan besar akan menimbulkan kebisingan daripada kejelasan. Pelajarannya: sesuaikan alur kerja dengan model, daripada mengasumsikan lebih banyak konteks lebih baik secara universal.</p>
<p>Hasil ini selaras dengan pengalaman saya sehari-hari. Claude yang berada di posisi teratas tidaklah mengejutkan. Skor Gemini yang lebih rendah dari yang saya harapkan masuk akal jika dipikir-pikir: Saya biasanya menggunakan Gemini dalam percakapan multi-berputar di mana saya mengulangi desain atau mengejar masalah bersama-sama, dan Gemini bekerja dengan baik dalam pengaturan interaktif tersebut. Tolok ukur ini adalah pipa tetap, jalur tunggal, yang merupakan format di mana Gemini paling lemah. Bagian debat nanti akan menunjukkan bahwa ketika Anda memberikan Gemini format multi-ronde, format permusuhan, kinerjanya akan meningkat secara nyata.</p>
<h2 id="Let-AI-Models-Debate-with-Each-Other" class="common-anchor-header">Biarkan Model AI Berdebat Satu Sama Lain<button data-href="#Let-AI-Models-Debate-with-Each-Other" class="anchor-icon" translate="no">
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
    </button></h2><p>Setiap model menunjukkan kekuatan dan titik buta yang berbeda dalam tolok ukur individu. Jadi saya ingin menguji: apa yang terjadi jika model-model tersebut saling meninjau hasil kerja satu sama lain, bukan hanya kodenya saja?</p>
<p>Jadi saya menambahkan lapisan debat di atas benchmark yang sama. Kelima model berpartisipasi dalam lima ronde:</p>
<ul>
<li><p>Di Babak 1, setiap model mengulas PR yang sama secara independen.</p></li>
<li><p>Setelah itu, saya menyiarkan kelima ulasan tersebut kepada semua peserta.</p></li>
<li><p>Di Babak 2, setiap model memperbarui posisinya berdasarkan empat model lainnya.</p></li>
<li><p>Ulangi hingga Ronde 5.</p></li>
</ul>
<p>Pada akhirnya, setiap model tidak hanya bereaksi terhadap kode - tetapi juga bereaksi terhadap argumen yang telah dikritik dan direvisi beberapa kali.</p>
<p>Untuk menjaga agar hal ini tidak berubah menjadi "LLM yang setuju dengan keras," saya memberlakukan satu aturan yang keras: <strong>setiap klaim harus menunjukkan kode tertentu sebagai bukti</strong>, dan model tidak bisa hanya mengatakan "poin yang bagus" - model harus menjelaskan mengapa ia berubah pikiran.</p>
<h3 id="Results-Best-Solo-vs-Debate-Mode" class="common-anchor-header">Hasilnya: Mode Debat Tunggal vs Debat Terbaik</h3><table>
<thead>
<tr><th>Mode</th><th>L2 (10 kasus)</th><th>L3 (5 kasus)</th><th>Total deteksi</th></tr>
</thead>
<tbody>
<tr><td>Individu terbaik (Claude Mentah)</td><td>3/10</td><td>5/5</td><td>53%</td></tr>
<tr><td>Debat (kelima model)</td><td>7/10 (dua kali lipat)</td><td>5/5 (semua tertangkap)</td><td>80%</td></tr>
</tbody>
</table>
<h3 id="What-stands-out" class="common-anchor-header">Apa yang menonjol</h3><p><strong>1. Deteksi L2 meningkat dua kali lipat.</strong> 2. Bug rutin dengan tingkat kesulitan menengah melonjak dari 3/10 menjadi 7/10. Ini adalah bug yang paling sering muncul di basis kode yang sebenarnya, dan ini adalah kategori di mana masing-masing model meleset secara tidak konsisten. Kontribusi terbesar dari mekanisme debat adalah menutup kesenjangan sehari-hari ini.</p>
<p><strong>2. Bug L3: tidak ada yang meleset.</strong> Dalam uji coba model tunggal, hanya Claude yang berhasil menemukan kelima bug tingkat sistem L3. Dalam mode debat, grup mencocokkan hasil tersebut, yang berarti Anda tidak perlu lagi bertaruh pada model yang tepat untuk mendapatkan cakupan L3 penuh.</p>
<p><strong>3. Debat mengisi titik-titik buta daripada menaikkan plafon.</strong> Bug tingkat sistem bukanlah bagian yang sulit bagi individu terkuat. Claude sudah memilikinya. Kontribusi inti dari mekanisme debat adalah menambal kelemahan Claude pada bug L2 rutin, di mana Claude secara individu hanya menangkap 3 dari 10 bug, tetapi kelompok debat menangkap 7 bug. Dari situlah lompatan 53% → 80% berasal.</p>
<h3 id="What-debate-actually-looks-like-in-practice" class="common-anchor-header">Seperti apa debat sebenarnya dalam praktiknya</h3><p>Angka-angka di atas menunjukkan bahwa debat berhasil, tetapi contoh konkret menunjukkan <em>mengapa</em> debat berhasil. Berikut ini adalah panduan ringkas tentang bagaimana kelima model menangani <strong>PR #44474</strong>, yang memperkenalkan pemuatan kunci utama yang malas selama pencarian.</p>
<p><a href="https://github.com/milvus-io/milvus/pull/44474"><strong>PR #44474:</strong></a> Pengoptimalan pemuatan malas yang mengubah pencarian untuk mengambil kunci utama sesuai permintaan alih-alih memuat semuanya di awal.</p>
<p><strong>Ronde 1</strong></p>
<p>Gemini membuka dengan agresif:</p>
<p>"PR ini adalah ladang ranjau praktik buruk, potensi perilaku yang tidak terdefinisi, dan kemunduran kinerja yang disamarkan sebagai 'pengoptimalan'."</p>
<p>Claude dan Qwen berfokus pada perilaku dan kinerja yang tidak terdefinisi, menyatu dalam keprihatinan yang sama:</p>
<p>"Model memori C++ tidak menjamin keamanan untuk penulisan secara bersamaan ke indeks yang berbeda dari vektor yang sama tanpa sinkronisasi yang tepat."</p>
<p>Ketiganya menemukan masalah yang nyata, tetapi tidak ada yang menemukan bug yang lebih dalam. Kemudian Codex, yang hampir tidak pernah berbicara, menandai sesuatu yang terlewatkan oleh yang lain: vektor <code translate="no">primary_keys_</code> diubah ukurannya, tetapi hanya posisi yang melewati fase pengurangan yang benar-benar terisi. Setiap posisi lainnya dibiarkan bernilai nol.</p>
<p><strong>Babak 2</strong></p>
<p>Claude mengambil temuan Codex dan menelusuri konsekuensi hilirnya:</p>
<p>"Saya menemukannya: <code translate="no">SortEqualScoresByPks</code> dijalankan sebelum <code translate="no">ReduceResultData</code>. Jadi, ketika <code translate="no">SortEqualScoresByPks</code> dieksekusi, nol PK telah diambil dengan malas. Seluruh vektor <code translate="no">primary_keys_</code> penuh dengan nilai PkType yang dibuat secara default."</p>
<p>Secara sederhana, fungsi sortir berjalan sebelum kunci-kunci dimuat, jadi fungsi ini mengurutkan angka nol. Claude mengakui kesalahan tersebut secara terbuka:</p>
<p>"codex-cli mengidentifikasi bug kebenaran kritis yang asli. Saya melewatkan hal ini pada putaran pertama saya."</p>
<h2 id="Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="common-anchor-header">Kombinasi Model Mana yang Dapat Menemukan Bug Terbanyak?<button data-href="#Which-Combination-of-Models-Can-Find-the-Most-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Lonjakan dari 53% menjadi 80% terjadi karena lima model saling menutupi titik buta satu sama lain. Tetapi tidak semua orang mampu menyiapkan dan menjalankan lima model melalui lima putaran perdebatan untuk setiap tinjauan kode.</p>
<p><strong>Jadi saya menguji versi yang lebih sederhana: jika Anda hanya bisa menjalankan dua model, pasangan mana yang paling mendekati plafon multi-model?</strong></p>
<p>Saya menggunakan <strong>context-assisted (R1)</strong> dan menghitung berapa banyak dari 15 bug yang ditemukan di setiap model:</p>
<ul>
<li><p><strong>Claude:</strong> 7/15 (47%)</p></li>
<li><p><strong>Qwen:</strong> 6/15 (40%)</p></li>
<li><p><strong>Gemini:</strong> 5/15 (33%)</p></li>
<li><p><strong>MiniMax:</strong> 5/15 (33%)</p></li>
<li><p><strong>Codex:</strong> 4/15 (27%)</p></li>
</ul>
<p>Yang penting, kemudian, bukan hanya berapa banyak bug yang ditemukan oleh masing-masing model, tetapi bug <em>mana yang</em> terlewatkan. Dari 8 bug yang terlewatkan oleh Claude, Gemini menemukan 3 bug: kondisi perlombaan konkurensi, masalah kompatibilitas API penyimpanan awan, dan pemeriksaan izin yang hilang. Di sisi lain, Gemini melewatkan sebagian besar struktur data dan bug logika yang dalam, dan Claude menangkap hampir semuanya. Kelemahan mereka hampir tidak tumpang tindih, dan itulah yang membuat mereka menjadi pasangan yang kuat.</p>
<table>
<thead>
<tr><th>Pasangan dua model</th><th>Cakupan gabungan</th></tr>
</thead>
<tbody>
<tr><td>Claude + Gemini</td><td>10/15</td></tr>
<tr><td>Claude + Qwen</td><td>9/15</td></tr>
<tr><td>Claude + Codex</td><td>8/15</td></tr>
<tr><td>Claude + MiniMax</td><td>8/15</td></tr>
</tbody>
</table>
<p>Kelima model tersebut bersama-sama mencakup 11 dari 15, menyisakan 4 bug yang terlewatkan oleh setiap model.</p>
<p><strong>Claude + Gemini,</strong> sebagai pasangan dua model, sudah mencapai 91% dari plafon lima model tersebut. Untuk tolok ukur ini, ini adalah kombinasi yang paling efisien.</p>
<p>Meskipun demikian, Claude + Gemini bukanlah pasangan terbaik untuk semua jenis bug. Ketika saya mengelompokkan hasilnya berdasarkan kategori bug, gambaran yang lebih jelas muncul:</p>
<table>
<thead>
<tr><th>Jenis bug</th><th>Total</th><th>Claude</th><th>Gemini</th><th>Codex</th><th>MiniMax</th><th>Qwen</th></tr>
</thead>
<tbody>
<tr><td>Kesenjangan validasi</td><td>4</td><td>3</td><td>2</td><td>1</td><td>1</td><td>3</td></tr>
<tr><td>Siklus hidup struktur data</td><td>4</td><td>3</td><td>1</td><td>1</td><td>3</td><td>1</td></tr>
<tr><td>Perlombaan konkurensi</td><td>2</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>Kompatibilitas</td><td>2</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>Logika yang dalam</td><td>3</td><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>Total</td><td>15</td><td>7</td><td>5</td><td>4</td><td>5</td><td>6</td></tr>
</tbody>
</table>
<p>Perincian jenis bug mengungkapkan mengapa tidak ada satu pun pasangan yang terbaik secara universal.</p>
<ul>
<li><p>Untuk bug siklus hidup struktur data, Claude dan MiniMax berada di posisi 3/4.</p></li>
<li><p>Untuk kesenjangan validasi, Claude dan Qwen berada di posisi 3/4.</p></li>
<li><p>Untuk masalah konkurensi dan kompatibilitas, Claude mendapat nilai nol untuk keduanya, dan Gemini adalah yang mengisi kesenjangan tersebut.</p></li>
<li><p>Tidak ada model yang mencakup semuanya, tetapi Claude mencakup jangkauan terluas dan paling mendekati sebagai generalis.</p></li>
</ul>
<p>Empat bug terlewatkan oleh setiap model. Satu melibatkan prioritas aturan tata bahasa ANTLR. Salah satunya adalah ketidakcocokan semantik kunci baca/tulis di seluruh fungsi. Satu lagi membutuhkan pemahaman tentang perbedaan logika bisnis antara tipe pemadatan. Dan satu lagi adalah kesalahan perbandingan diam di mana satu variabel menggunakan megabyte dan variabel lainnya menggunakan byte.</p>
<p>Kesamaan dari keempat kesalahan ini adalah bahwa kode tersebut secara sintaksis sudah benar. Bug ada dalam asumsi yang dibawa oleh pengembang di kepala mereka, bukan di diff, dan bahkan tidak ada di kode di sekitarnya. Di sinilah kira-kira di mana tinjauan kode AI mencapai puncaknya saat ini.</p>
<h2 id="After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="common-anchor-header">Setelah Menemukan Bug, Model Mana yang Paling Baik untuk Memperbaikinya?<button data-href="#After-Finding-Bugs-Which-Model-is-the-Best-at-Fixing-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam peninjauan kode, menemukan bug adalah setengah dari pekerjaan. Setengah lainnya adalah memperbaikinya. Jadi setelah putaran debat, saya menambahkan evaluasi rekan sejawat untuk mengukur seberapa berguna saran perbaikan dari masing-masing model.</p>
<p>Untuk mengukur hal ini, saya menambahkan babak evaluasi rekan sejawat setelah debat. Setiap model membuka sesi baru dan bertindak sebagai juri anonim, menilai ulasan model lainnya. Kelima model dipetakan secara acak ke Peninjau A/B/C/D/E, sehingga tidak ada juri yang tahu model mana yang menghasilkan ulasan yang mana. Setiap juri memberi nilai pada empat dimensi, dengan nilai 1 hingga 10: akurasi, kemampuan untuk ditindaklanjuti, kedalaman, dan kejelasan.</p>
<table>
<thead>
<tr><th>Model</th><th>Akurasi</th><th>Dapat ditindaklanjuti</th><th>Kedalaman</th><th>Kejelasan</th><th>Secara keseluruhan</th></tr>
</thead>
<tbody>
<tr><td>Qwen</td><td>8.6</td><td>8.6</td><td>8.5</td><td>8.7</td><td>8,6 (berada di urutan pertama)</td></tr>
<tr><td>Claude</td><td>8.4</td><td>8.2</td><td>8.8</td><td>8.8</td><td>8,6 (berada di urutan pertama)</td></tr>
<tr><td>Codex</td><td>7.7</td><td>7.6</td><td>7.1</td><td>7.8</td><td>7.5</td></tr>
<tr><td>Gemini</td><td>7.4</td><td>7.2</td><td>6.7</td><td>7.6</td><td>7.2</td></tr>
<tr><td>MiniMax</td><td>7.1</td><td>6.7</td><td>6.9</td><td>7.4</td><td>7.0</td></tr>
</tbody>
</table>
<p>Qwen dan Claude berada di posisi pertama dengan selisih yang jelas. Keduanya secara konsisten mendapat nilai tinggi di keempat dimensi, sementara Codex, Gemini, dan MiniMax mengelompok satu poin penuh atau lebih di bawahnya. Khususnya, Gemini, yang terbukti berharga sebagai mitra pencari bug untuk Claude dalam analisis pasangan, berada di peringkat paling bawah untuk kualitas ulasan. Pandai menemukan masalah dan pandai menjelaskan cara memperbaikinya jelas merupakan keterampilan yang berbeda.</p>
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
    </button></h2><p><strong>Claude</strong> adalah orang yang Anda percayai dengan ulasan yang paling sulit. Ia bekerja melalui seluruh rantai panggilan, mengikuti jalur logika yang dalam, dan menarik konteksnya sendiri tanpa Anda perlu menyuapinya. Pada bug tingkat sistem L3, tidak ada yang bisa menandinginya. Kadang-kadang ia terlalu percaya diri dengan matematika, tetapi ketika model lain membuktikan bahwa ia salah, ia akan memilikinya dan menelusuri di mana penalarannya rusak. Gunakan untuk kode inti dan bug yang tidak boleh Anda lewatkan.</p>
<p><strong>Gemini</strong> datang dengan penuh semangat. Gemini memiliki pendapat yang kuat tentang gaya kode dan standar teknik, dan cepat dalam membingkai masalah secara struktural. Kelemahannya adalah bahwa ia sering berada di permukaan dan tidak menggali cukup dalam, itulah sebabnya ia mendapat nilai rendah dalam evaluasi rekan sejawat. Di mana Gemini benar-benar mendapatkan tempatnya adalah sebagai penantang: penolakannya memaksa model lain untuk memeriksa ulang pekerjaan mereka. Pasangkan dengan Claude untuk perspektif struktural yang terkadang dilewati oleh Claude.</p>
<p><strong>Codex</strong> hampir tidak mengucapkan sepatah kata pun. Tetapi ketika dia bicara, dia sangat berarti. Tingkat keberhasilan pencariannya terhadap bug yang sebenarnya tinggi, dan ia memiliki kemampuan untuk menangkap satu hal yang dilewatkan oleh orang lain. Dalam contoh PR #44474, Codex adalah model yang menemukan masalah kunci primer bernilai nol yang memulai seluruh rantai. Anggap saja sebagai peninjau tambahan yang menangkap apa yang terlewatkan oleh model utama Anda.</p>
<p><strong>Qwen</strong> adalah yang paling lengkap di antara kelimanya. Kualitas ulasannya menyamai Claude, dan sangat bagus dalam menyatukan perspektif yang berbeda ke dalam saran perbaikan yang dapat Anda lakukan. Aplikasi ini juga memiliki tingkat deteksi L2 tertinggi dalam mode bantuan konteks, yang menjadikannya standar yang solid untuk ulasan PR sehari-hari. Satu kelemahannya: dalam debat yang panjang dan multi-ronde, terkadang kehilangan jejak konteks sebelumnya dan mulai memberikan jawaban yang tidak konsisten di ronde selanjutnya.</p>
<p><strong>MiniMax</strong> adalah yang paling lemah dalam menemukan bug dengan sendirinya. Paling baik digunakan untuk mengisi grup multi-model daripada sebagai pengulas mandiri.</p>
<h2 id="Limitations-of-This-Experiment" class="common-anchor-header">Keterbatasan Eksperimen Ini<button data-href="#Limitations-of-This-Experiment" class="anchor-icon" translate="no">
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
    </button></h2><p>Beberapa peringatan untuk menjaga agar eksperimen ini tetap dalam perspektif:</p>
<p><strong>Ukuran sampelnya kecil.</strong> Hanya ada 15 PR, semuanya dari proyek Go/C++ yang sama (Milvus). Hasil ini tidak dapat digeneralisasi untuk semua bahasa atau basis kode. Perlakukan mereka sebagai arahan, bukan definitif.</p>
<p><strong>Model pada dasarnya bersifat acak.</strong> Menjalankan perintah yang sama dua kali dapat menghasilkan hasil yang berbeda. Angka-angka dalam posting ini adalah satu snapshot, bukan nilai yang diharapkan stabil. Peringkat model individu harus dianggap enteng, meskipun tren yang lebih luas (debat mengungguli individu, model yang berbeda unggul pada jenis bug yang berbeda) konsisten.</p>
<p><strong>Urutan berbicara sudah ditetapkan.</strong> Debat menggunakan urutan yang sama di semua ronde, yang mungkin telah mempengaruhi bagaimana model yang berbicara kemudian merespons. Eksperimen di masa depan dapat mengacak urutan per ronde untuk mengontrol hal ini.</p>
<h2 id="Try-it-yourself" class="common-anchor-header">Cobalah sendiri<button data-href="#Try-it-yourself" class="anchor-icon" translate="no">
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
    </button></h2><p>Semua alat dan data dari eksperimen ini adalah sumber terbuka:</p>
<ul>
<li><p><a href="https://github.com/liliu-z/magpie"><strong>Magpie</strong></a>: Alat sumber terbuka yang mengumpulkan konteks kode (rantai panggilan, PR terkait, modul yang terpengaruh) dan mengatur perdebatan multi-model yang berlawanan untuk peninjauan kode.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena"><strong>AI-CodeReview-Arena</strong></a>: Pipeline evaluasi, konfigurasi, dan skrip lengkap.</p></li>
<li><p><a href="https://github.com/liliu-z/ai-code-review-arena/blob/main/prs/manifest.yaml"><strong>Kasus pengujian</strong></a>: Semua 15 PR dengan anotasi bug yang diketahui.</p></li>
</ul>
<p>Semua bug dalam percobaan ini berasal dari pull request yang nyata di <a href="https://github.com/milvus-io/milvus">Milvus</a>, sebuah database vektor sumber terbuka yang dibangun untuk aplikasi AI. Kami memiliki komunitas yang cukup aktif di <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> dan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack</a>, dan kami ingin lebih banyak orang yang mengutak-atik kodenya. Dan jika Anda akhirnya menjalankan benchmark ini pada basis kode Anda sendiri, silakan bagikan hasilnya! Saya sangat ingin tahu apakah tren ini berlaku di berbagai bahasa dan proyek.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Teruskan Membaca<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md">GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think: Model Mana yang Cocok untuk Tumpukan Agen AI Anda?</a></p></li>
<li><p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Menambahkan Memori Persisten ke Kode Claude dengan Plugin memsearch yang Ringan</a></p></li>
<li><p><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Kami Mengekstrak Sistem Memori OpenClaw dan Sumber Terbuka (memsearch)</a></p></li>
</ul>
