---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Model Mana yang Harus Anda Gunakan?'
author: Lumina Wang
date: 2026-4-28
cover: assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  Bandingkan DeepSeek V4, GPT-5.5, dan Qwen3.6 dalam pengambilan, debugging, dan
  pengujian konteks panjang, kemudian buat pipeline Milvus RAG dengan DeepSeek
  V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>Rilis model baru bergerak lebih cepat daripada yang dapat dievaluasi oleh tim produksi. DeepSeek V4, GPT-5.5, dan Qwen3.6-35B-A3B terlihat kuat di atas kertas, tetapi pertanyaan yang lebih sulit bagi pengembang aplikasi AI adalah pertanyaan praktis: model mana yang harus Anda gunakan untuk sistem yang berat dalam pencarian, tugas pengkodean, analisis konteks panjang, dan <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">jalur pipa RAG</a>?</p>
<p><strong>Artikel ini membandingkan tiga model dalam pengujian praktis:</strong> pengambilan informasi langsung, concurrency-bug debugging, dan pengambilan penanda konteks panjang. Kemudian, artikel ini menunjukkan cara menghubungkan DeepSeek V4 ke <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor Milvus</a>, sehingga konteks yang diambil berasal dari basis pengetahuan yang dapat dicari, bukan hanya dari parameter model.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">Apa itu DeepSeek V4, GPT-5.5, dan Qwen3.6-35B-A3B?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5, dan Qwen3.6-35B-A3B adalah model AI yang berbeda yang menargetkan bagian yang berbeda dari tumpukan model.</strong> DeepSeek V4 berfokus pada inferensi konteks panjang berbobot terbuka. GPT-5.5 berfokus pada kinerja yang dihosting di perbatasan, pengkodean, penelitian online, dan tugas-tugas yang membutuhkan banyak alat. Qwen3.6-35B-A3B berfokus pada penyebaran multimodal berbobot terbuka dengan jejak parameter aktif yang jauh lebih kecil.</p>
<p>Perbandingan ini penting karena sistem <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">pencarian vektor produksi</a> jarang bergantung pada model saja. Kemampuan model, panjang konteks, kontrol penerapan, kualitas pencarian, dan biaya penyajian semuanya memengaruhi pengalaman pengguna akhir.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: Model MoE dengan Bobot Terbuka untuk Kontrol Biaya Konteks Panjang</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>adalah keluarga model MoE berbobot terbuka yang dirilis oleh DeepSeek pada tanggal 24 April 2026</strong>. Rilis resmi mencantumkan dua varian: DeepSeek V4-Pro dan DeepSeek V4-Flash. V4-Pro memiliki total parameter 1,6T dengan 49B diaktifkan per token, sedangkan V4-Flash memiliki total parameter 284B dengan 13B diaktifkan per token. Keduanya mendukung jendela konteks 1M-token.</p>
<p><a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">Kartu model DeepSeek V4-Pro</a> juga mencantumkan model tersebut sebagai model berlisensi MIT dan tersedia melalui Hugging Face dan ModelScope. Untuk tim yang membangun alur kerja dokumen konteks panjang, daya tarik utamanya adalah kontrol biaya dan fleksibilitas penyebaran dibandingkan dengan API frontier yang sepenuhnya tertutup.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5: Model Frontier yang Di-host untuk Pengkodean, Penelitian, dan Penggunaan Alat</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>adalah model frontier tertutup yang dirilis oleh OpenAI pada tanggal 23 April 2026</strong>. OpenAI memposisikannya untuk pengkodean, penelitian online, analisis data, pekerjaan dokumen, pekerjaan spreadsheet, pengoperasian perangkat lunak, dan tugas-tugas berbasis alat. Daftar dokumen model resmi <code translate="no">gpt-5.5</code> dengan jendela konteks API 1M-token, sementara batas produk Codex dan ChatGPT mungkin berbeda.</p>
<p>OpenAI melaporkan hasil tolok ukur pengkodean yang kuat: 82,7% pada Terminal-Bench 2.0, 73,1% pada Expert-SWE, dan 58,6% pada SWE-Bench Pro. Pengorbanannya adalah harga: daftar harga API resmi mencantumkan GPT-5.5 dengan harga $5 per 1 juta token input dan $30 per 1 juta token output, sebelum rincian harga khusus produk atau konteks jangka panjang.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: Model Parameter Aktif yang Lebih Kecil untuk Beban Kerja Lokal dan Multimoda</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>adalah model MoE berbobot terbuka dari tim Qwen Alibaba.</strong> Kartu modelnya mencantumkan parameter total 35B, parameter yang diaktifkan 3B, encoder visi, dan lisensi Apache-2.0. Ini mendukung jendela konteks 262.144 token asli dan dapat diperluas hingga sekitar 1.010.000 token dengan penskalaan YaRN.</p>
<p>Hal ini membuat Qwen3.6-35B-A3B menarik ketika penerapan lokal, penyajian pribadi, input gambar-teks, atau beban kerja berbahasa Mandarin lebih penting daripada kenyamanan model perbatasan yang dikelola.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Spesifikasi Model Dibandingkan</h3><table>
<thead>
<tr><th>Model</th><th>Model penyebaran</th><th>Info parameter publik</th><th>Jendela konteks</th><th>Kecocokan terkuat</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>MoE dengan bobot terbuka; API tersedia</td><td>Total 1,6T / 49B aktif</td><td>1 juta token</td><td>Penerapan rekayasa yang peka terhadap biaya dan konteks jangka panjang</td></tr>
<tr><td>GPT-5.5</td><td>Model tertutup yang dihosting</td><td>Dirahasiakan</td><td>1 juta token dalam API</td><td>Pengkodean, penelitian langsung, penggunaan alat, dan kemampuan keseluruhan tertinggi</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>MoE multimodal berbobot terbuka</td><td>Total 35B / 3B aktif</td><td>262 ribu asli; ~ 1 juta dengan YaRN</td><td>Penyebaran lokal/pribadi, input multimodal, dan skenario berbahasa Mandarin</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">Cara Kami Menguji DeepSeek V4, GPT-5.5, dan Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengujian ini bukanlah pengganti dari rangkaian benchmark yang lengkap. Tes-tes ini merupakan pemeriksaan praktis yang mencerminkan pertanyaan umum pengembang: dapatkah model ini mengambil informasi terkini, mencari tahu tentang bug kode yang tidak kentara, dan menemukan fakta-fakta di dalam dokumen yang sangat panjang?</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">Model Mana yang Menangani Pengambilan Informasi Waktu Nyata dengan Paling Baik?</h3><p>Kami mengajukan tiga pertanyaan sensitif waktu kepada setiap model dengan menggunakan pencarian web jika tersedia. Instruksinya sederhana: kembalikan hanya jawabannya dan sertakan URL sumbernya.</p>
<table>
<thead>
<tr><th>Pertanyaan</th><th>Jawaban yang diharapkan pada waktu pengujian</th><th>Sumber</th></tr>
</thead>
<tbody>
<tr><td>Berapa biaya yang dibutuhkan untuk menghasilkan gambar berkualitas menengah 1024×1024 dengan <code translate="no">gpt-image-2</code> melalui API OpenAI?</td><td><code translate="no">\$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">Harga pembuatan gambar OpenAI</a></td></tr>
<tr><td>Lagu apa yang menduduki peringkat pertama di Billboard Hot 100 minggu ini, dan siapa artisnya?</td><td><code translate="no">Choosin' Texas</code> oleh Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">Tangga lagu Billboard Hot 100</a></td></tr>
<tr><td>Siapa yang saat ini memimpin klasemen pembalap F1 2026?</td><td>Kimi Antonelli</td><td><a href="https://www.formula1.com/en/results/2026/drivers">Klasemen pembalap Formula 1</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Catatan: Ini adalah pertanyaan yang sensitif terhadap waktu. Jawaban yang diharapkan mencerminkan hasil pada saat kami menjalankan tes.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Halaman harga gambar OpenAI menggunakan label "medium" dan bukan "standar" untuk hasil $0,053 1024×1024, sehingga pertanyaan dinormalisasi di sini agar sesuai dengan kata-kata API saat ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">Hasil Pengambilan Waktu Nyata: GPT-5.5 Memiliki Keunggulan Paling Jelas</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro menjawab pertanyaan pertama dengan salah. Alat ini tidak dapat menjawab pertanyaan kedua dan ketiga melalui pencarian web langsung dalam pengaturan ini.</p>
<p>Jawaban kedua menyertakan URL Billboard yang benar tetapi tidak mengambil lagu No. 1 saat ini. Jawaban ketiga menggunakan sumber yang salah, jadi kami menganggapnya salah.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 menangani tes ini dengan lebih baik. Jawabannya singkat, akurat, bersumber, dan cepat. Ketika sebuah tugas bergantung pada informasi terkini dan model memiliki pengambilan langsung yang tersedia, GPT-5.5 memiliki keunggulan yang jelas dalam pengaturan ini.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B memberikan hasil yang mirip dengan DeepSeek V4-Pro. Tidak memiliki akses web langsung dalam pengaturan ini, sehingga tidak dapat menyelesaikan tugas pengambilan secara real-time.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">Model Mana yang Lebih Baik dalam Melakukan Debug Bug Konkurensi?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Pengujian kedua menggunakan contoh transfer bank Python dengan tiga lapisan masalah konkurensi. Tugasnya bukan hanya untuk menemukan kondisi balapan yang jelas, tetapi juga untuk menjelaskan mengapa saldo total rusak dan memberikan kode yang diperbaiki.</p>
<table>
<thead>
<tr><th>Lapisan</th><th>Masalah</th><th>Apa yang salah</th></tr>
</thead>
<tbody>
<tr><td>Dasar</td><td>Kondisi balapan</td><td><code translate="no">if self.balance &gt;= amount</code> dan <code translate="no">self.balance -= amount</code> tidak bersifat atomik. Dua utas dapat melewati pemeriksaan saldo pada saat yang sama, kemudian keduanya mengurangi uang.</td></tr>
<tr><td>Sedang</td><td>Risiko kebuntuan</td><td>Penguncian per-akun yang naif dapat menemui jalan buntu ketika transfer A→B mengunci A terlebih dahulu, sementara transfer B→A mengunci B terlebih dahulu. Ini adalah kebuntuan ABBA klasik.</td></tr>
<tr><td>Tingkat lanjut</td><td>Cakupan kunci yang salah</td><td>Melindungi hanya <code translate="no">self.balance</code> tidak melindungi <code translate="no">target.balance</code>. Perbaikan yang benar harus mengunci kedua akun dalam urutan yang stabil, biasanya berdasarkan ID akun, atau menggunakan kunci global dengan konkurensi yang lebih rendah.</td></tr>
</tbody>
</table>
<p>Perintah dan kodenya seperti yang ditunjukkan di bawah ini:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">Hasil Debugging Kode: GPT-5.5 Memberikan Jawaban Paling Lengkap</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro memberikan analisis ringkas dan langsung menuju ke solusi ordered-lock, yang merupakan cara standar untuk menghindari kebuntuan ABBA. Jawabannya menunjukkan perbaikan yang tepat, tetapi tidak menghabiskan banyak waktu untuk menjelaskan mengapa perbaikan berbasis kunci yang naif dapat menimbulkan mode kegagalan baru.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 memiliki performa terbaik pada pengujian ini. GPT-5.5 menemukan masalah utama, mengantisipasi risiko deadlock, menjelaskan mengapa kode asli dapat gagal, dan menyediakan implementasi yang telah diperbaiki secara lengkap.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B mengidentifikasi bug secara akurat, dan urutan eksekusi contohnya jelas. Bagian yang lebih lemah adalah perbaikannya: ia memilih kunci tingkat kelas global, yang membuat setiap akun berbagi kunci yang sama. Hal ini bekerja dengan baik untuk simulasi kecil, tetapi ini merupakan pengorbanan yang buruk untuk sistem perbankan yang sebenarnya karena transfer akun yang tidak terkait masih harus menunggu pada kunci yang sama.</p>
<p><strong>Singkatnya:</strong> GPT-5.5 tidak hanya menyelesaikan bug yang ada saat ini, tetapi juga memperingatkan tentang bug berikutnya yang mungkin akan dibuat oleh pengembang. DeepSeek V4-Pro memberikan perbaikan non-GPT yang paling bersih. Qwen3.6 menemukan masalah dan menghasilkan kode yang berfungsi, tetapi tidak menyebut kompromi skalabilitas.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">Model Mana yang Menangani Pengambilan Konteks Panjang dengan Paling Baik?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk pengujian konteks panjang, kami menggunakan teks lengkap <em>Dream of the Red Chamber</em>, sekitar 850.000 karakter bahasa Mandarin. Kami menyisipkan penanda tersembunyi di sekitar posisi 500.000 karakter:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>Kemudian kami mengunggah file tersebut ke setiap model dan memintanya untuk menemukan konten penanda dan posisinya.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">Hasil Pengambilan Konteks Panjang: GPT-5.5 Menemukan Penanda dengan Sangat Tepat</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro menemukan penanda tersembunyi, tetapi tidak menemukan posisi karakter yang benar. Ia juga memberikan konteks sekitar yang salah. Dalam pengujian ini, tampaknya menemukan penanda secara semantik tetapi kehilangan jejak posisi yang tepat saat menalar dokumen.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 menemukan konten penanda, posisi, dan konteks di sekitarnya dengan benar. GPT-5.5 melaporkan posisi sebagai 500.002 dan bahkan membedakan antara penghitungan dengan indeks nol dan indeks satu. Konteks di sekitarnya juga cocok dengan teks yang digunakan saat menyisipkan penanda.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B menemukan konten penanda dan konteks di sekitarnya dengan benar, tetapi estimasi posisinya salah.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">Apa yang Dikatakan Tes-Tes Ini Tentang Pemilihan Model?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketiga pengujian tersebut menunjukkan pola pemilihan yang praktis: <strong>GPT-5.5 adalah pilihan kapabilitas, DeepSeek V4-Pro adalah pilihan performa biaya konteks panjang, dan Qwen3.6-35B-A3B adalah pilihan kontrol lokal.</strong></p>
<table>
<thead>
<tr><th>Model</th><th>Paling cocok</th><th>Apa yang terjadi dalam pengujian kami</th><th>Peringatan utama</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>Kemampuan keseluruhan terbaik</td><td>Memenangkan tes pengambilan langsung, debugging konkurensi, dan penanda konteks panjang</td><td>Biaya lebih tinggi; terkuat ketika akurasi dan penggunaan alat membenarkan harganya yang mahal</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>Penerapan konteks panjang dan berbiaya lebih rendah</td><td>Memberikan perbaikan non-GPT terkuat untuk bug konkurensi dan menemukan konten penanda</td><td>Membutuhkan alat pengambilan eksternal untuk tugas-tugas web langsung; pelacakan lokasi karakter yang tepat lebih lemah dalam pengujian ini</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Penerapan lokal, bobot terbuka, input multimodal, beban kerja berbahasa Mandarin</td><td>Melakukan dengan baik dalam identifikasi bug dan pemahaman konteks yang panjang</td><td>Kualitas perbaikan kurang terukur; akses web langsung tidak tersedia dalam pengaturan ini</td></tr>
</tbody>
</table>
<p>Gunakan GPT-5.5 ketika Anda membutuhkan hasil terkuat, dan biaya adalah nomor dua. Gunakan DeepSeek V4-Pro ketika Anda membutuhkan konteks yang panjang, biaya penyajian yang lebih rendah, dan penerapan yang ramah API. Gunakan Qwen3.6-35B-A3B ketika bobot terbuka, penerapan pribadi, dukungan multimodal, atau kontrol tumpukan servis sangat penting.</p>
<p>Namun, untuk aplikasi yang membutuhkan banyak pengambilan, pilihan model hanyalah separuh dari cerita. Bahkan model konteks panjang yang kuat berkinerja lebih baik ketika konteks diambil, disaring, dan dibumikan oleh <a href="https://zilliz.com/learn/generative-ai">sistem pencarian semantik</a> khusus.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">Mengapa RAG Masih Penting untuk Model Konteks Panjang<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Jendela konteks yang panjang tidak menghilangkan kebutuhan untuk pengambilan. Ini mengubah strategi pengambilan.</p>
<p>Dalam aplikasi RAG, model tidak harus memindai setiap dokumen pada setiap permintaan. <a href="https://zilliz.com/learn/introduction-to-unstructured-data">Arsitektur basis data vektor</a> menyimpan penyematan, mencari potongan yang relevan secara semantik, menerapkan filter metadata, dan mengembalikan kumpulan konteks yang ringkas ke model. Hal ini memberikan masukan yang lebih baik kepada model sekaligus mengurangi biaya dan latensi.</p>
<p>Milvus cocok dengan peran ini karena ia menangani <a href="https://milvus.io/docs/schema.md">skema koleksi</a>, pengindeksan vektor, metadata skalar, dan operasi pengambilan dalam satu sistem. Anda dapat memulai secara lokal dengan <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, beralih ke <a href="https://milvus.io/docs/quickstart.md">quickstart Milvus</a> mandiri, menerapkan dengan <a href="https://milvus.io/docs/install_standalone-docker.md">instalasi Docker</a> atau <a href="https://milvus.io/docs/install_standalone-docker-compose.md">penerapan Docker Compose</a>, dan menskalakan lebih lanjut dengan <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">penerapan Kubernetes</a> ketika beban kerja bertambah.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">Cara Membangun Pipeline RAG dengan Milvus dan DeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>Panduan berikut ini membangun pipeline RAG kecil menggunakan DeepSeek V4-Pro untuk pembuatan dan Milvus untuk pengambilan. Struktur yang sama berlaku untuk LLM lainnya: membuat embedding, menyimpannya dalam koleksi, mencari konteks yang relevan, dan meneruskan konteks tersebut ke dalam model.</p>
<p>Untuk panduan yang lebih luas, lihat <a href="https://milvus.io/docs/build-rag-with-milvus.md">tutorial</a> resmi <a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus RAG</a>. Contoh ini menjaga pipeline tetap kecil sehingga alur pengambilan mudah diperiksa.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">Mempersiapkan Lingkungan<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">Instal Ketergantungan</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Jika Anda menggunakan Google Colab, Anda mungkin perlu memulai ulang runtime setelah menginstal dependensi. Klik menu <strong>Runtime</strong>, lalu pilih <strong>Restart session</strong>.</p>
<p>DeepSeek V4-Pro mendukung API gaya OpenAI. Masuk ke situs web resmi DeepSeek dan tetapkan <code translate="no">DEEPSEEK_API_KEY</code> sebagai variabel lingkungan.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Mempersiapkan Dataset Dokumentasi Milvus</h3><p>Kami menggunakan halaman FAQ dari <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">arsip dokumentasi Milvus 2.4.x</a> sebagai sumber pengetahuan pribadi. Ini adalah dataset awal yang sederhana untuk sebuah demo RAG kecil.</p>
<p>Pertama, unduh file ZIP dan ekstrak dokumentasinya ke dalam folder <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Kami memuat semua file Markdown dari folder <code translate="no">milvus_docs/en/faq</code>. Untuk setiap dokumen, kami membagi konten file dengan <code translate="no">#</code>, yang secara kasar memisahkan bagian-bagian utama Markdown.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">Mengatur DeepSeek V4 dan Model Penyematan</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Selanjutnya, pilih model penyematan. Contoh ini menggunakan <code translate="no">DefaultEmbeddingFunction</code> dari modul model PyMilvus. Lihat dokumen Milvus untuk mengetahui lebih lanjut tentang <a href="https://milvus.io/docs/embeddings.md">fungsi-fungsi penyematan</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Buatlah vektor uji, lalu cetak dimensi vektor dan beberapa elemen pertama. Dimensi yang dihasilkan akan digunakan ketika membuat koleksi Milvus.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Memuat Data ke dalam Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Membuat Koleksi Milvus</h3><p>Koleksi Milvus menyimpan bidang vektor, bidang skalar, dan metadata dinamis opsional. Penyiapan cepat di bawah ini menggunakan API <code translate="no">MilvusClient</code> tingkat tinggi; untuk skema produksi, tinjau dokumen tentang <a href="https://milvus.io/docs/manage-collections.md">manajemen koleksi</a> dan <a href="https://milvus.io/docs/create-collection.md">membuat koleksi</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Beberapa catatan tentang <code translate="no">MilvusClient</code>:</p>
<ul>
<li>Mengatur <code translate="no">uri</code> ke berkas lokal, seperti <code translate="no">./milvus.db</code>, adalah pilihan termudah karena secara otomatis menggunakan <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> dan menyimpan semua data dalam berkas tersebut.</li>
<li>Jika Anda memiliki kumpulan data yang besar, Anda dapat menyiapkan server Milvus dengan performa yang lebih tinggi pada <a href="https://milvus.io/docs/quickstart.md">Docker atau Kubernetes</a>. Dalam penyiapan itu, gunakan URI server, seperti <code translate="no">http://localhost:19530</code>, sebagai <code translate="no">uri</code>.</li>
<li>Jika Anda ingin menggunakan <a href="https://docs.zilliz.com/">Zilliz Cloud</a>, layanan cloud yang dikelola sepenuhnya untuk Milvus, setel <code translate="no">uri</code> dan <code translate="no">token</code> ke <a href="https://docs.zilliz.com/docs/connect-to-cluster">titik akhir publik dan kunci API</a> dari Zilliz Cloud.</li>
</ul>
<p>Periksa apakah koleksi sudah ada. Jika sudah ada, hapuslah.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Buat koleksi baru dengan parameter yang ditentukan. Jika kita tidak menentukan informasi bidang, Milvus secara otomatis membuat bidang <code translate="no">id</code> default sebagai kunci utama dan bidang vektor untuk menyimpan data vektor. Bidang JSON yang dicadangkan menyimpan data skalar yang tidak didefinisikan dalam skema.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Metrik <code translate="no">IP</code> berarti kesamaan hasil kali dalam. Milvus juga mendukung jenis metrik lain dan pilihan indeks tergantung pada jenis vektor dan beban kerja; lihat panduan tentang <a href="https://milvus.io/docs/id/metric.md">jenis metrik</a> dan <a href="https://milvus.io/docs/index_selection.md">pemilihan indeks</a>. Pengaturan <code translate="no">Strong</code> adalah salah satu <a href="https://milvus.io/docs/consistency.md">tingkat konsistensi</a> yang tersedia.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">Menyisipkan Dokumen yang Disematkan</h3><p>Lakukan iterasi pada data teks, buat penyematan, dan masukkan data tersebut ke dalam Milvus. Di sini, kita menambahkan bidang baru bernama <code translate="no">text</code>. Karena tidak didefinisikan secara eksplisit dalam skema koleksi, maka secara otomatis ditambahkan ke bidang JSON dinamis yang telah disediakan. Untuk metadata produksi, tinjau <a href="https://milvus.io/docs/enable-dynamic-field.md">dukungan bidang dinamis</a> dan <a href="https://milvus.io/docs/json-field-overview.md">ikhtisar bidang JSON</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>Untuk kumpulan data yang lebih besar, pola yang sama dapat diperluas dengan desain skema eksplisit, <a href="https://milvus.io/docs/index-vector-fields.md">indeks bidang vektor</a>, indeks skalar, dan operasi siklus hidup data seperti <a href="https://milvus.io/docs/insert-update-delete.md">memasukkan, menambah, dan menghapus</a>.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">Membangun Alur Pengambilan RAG<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Cari Milvus untuk Konteks yang Relevan</h3><p>Mari kita tentukan pertanyaan umum tentang Milvus.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cari koleksi untuk pertanyaan tersebut dan ambil tiga kecocokan semantik teratas. Ini adalah <a href="https://milvus.io/docs/single-vector-search.md">pencarian vektor tunggal</a> dasar. Dalam produksi, Anda dapat menggabungkannya dengan <a href="https://milvus.io/docs/filtered-search.md">pencarian yang difilter</a>, <a href="https://milvus.io/docs/full-text-search.md">pencarian teks lengkap</a>, <a href="https://milvus.io/docs/multi-vector-search.md">pencarian hibrida multi-vektor</a>, dan <a href="https://milvus.io/docs/reranking.md">strategi pemeringkatan ulang</a> untuk meningkatkan relevansi.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang mari kita lihat hasil pencarian untuk kueri tersebut.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">Hasilkan Jawaban RAG dengan DeepSeek V4</h3><p>Ubah dokumen yang diambil ke dalam format string.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Tentukan sistem dan petunjuk pengguna untuk LLM. Perintah ini disusun dari dokumen yang diambil dari Milvus.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>Gunakan model yang disediakan oleh DeepSeek V4-Pro untuk menghasilkan respons berdasarkan prompt.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>Pada titik ini, pipeline telah menyelesaikan loop inti RAG: menyematkan dokumen, menyimpan vektor di Milvus, mencari konteks yang relevan, dan menghasilkan jawaban dengan DeepSeek V4-Pro.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">Apa yang Harus Anda Tingkatkan Sebelum Produksi?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Demo ini menggunakan pemisahan bagian sederhana dan pengambilan top-k. Itu sudah cukup untuk menunjukkan mekanismenya, tetapi RAG produksi biasanya membutuhkan lebih banyak kontrol pengambilan.</p>
<table>
<thead>
<tr><th>Kebutuhan produksi</th><th>Fitur Milvus yang perlu dipertimbangkan</th><th>Mengapa ini membantu</th></tr>
</thead>
<tbody>
<tr><td>Menggabungkan sinyal semantik dan kata kunci</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Pencarian hibrida dengan Milvus</a></td><td>Menggabungkan pencarian vektor padat dengan sinyal teks yang jarang atau lengkap</td></tr>
<tr><td>Menggabungkan hasil dari beberapa retriever</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Retriever pencarian hibrida Milvus</a></td><td>Memungkinkan alur kerja LangChain menggunakan pemeringkatan berbobot atau gaya RRF</td></tr>
<tr><td>Membatasi hasil berdasarkan penyewa, stempel waktu, atau jenis dokumen</td><td>Filter metadata dan skalar</td><td>Menjaga agar pengambilan tetap terfokus pada potongan data yang tepat</td></tr>
<tr><td>Beralih dari Milvus yang dikelola sendiri ke layanan terkelola</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Migrasi Milvus ke Zilliz</a></td><td>Mengurangi pekerjaan infrastruktur sekaligus menjaga kompatibilitas Milvus</td></tr>
<tr><td>Menghubungkan aplikasi yang dihosting dengan aman</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Kunci API Zilliz Cloud</a></td><td>Menyediakan kontrol akses berbasis token untuk klien aplikasi</td></tr>
</tbody>
</table>
<p>Kebiasaan produksi yang paling penting adalah mengevaluasi pengambilan secara terpisah dari pembuatan. Jika konteks yang diambil lemah, menukar LLM sering kali menyembunyikan masalah alih-alih menyelesaikannya.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Memulai dengan Milvus dan DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda ingin mereproduksi tutorial ini, mulailah dengan <a href="https://milvus.io/docs">dokumentasi</a> resmi <a href="https://milvus.io/docs">Milvus</a> dan <a href="https://milvus.io/docs/build-rag-with-milvus.md">panduan Build RAG dengan Milvus</a>. Untuk penyiapan terkelola, <a href="https://docs.zilliz.com/docs/connect-to-cluster">sambungkan ke Zilliz Cloud</a> dengan titik akhir cluster dan kunci API Anda alih-alih menjalankan Milvus secara lokal.</p>
<p>Jika Anda ingin bantuan untuk menyetel chunking, pengindeksan, filter, atau pengambilan hibrida, bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> atau pesan <a href="https://milvus.io/office-hours">sesi Milvus Office Hours</a> gratis. Jika Anda lebih suka melewatkan penyiapan infrastruktur, gunakan <a href="https://cloud.zilliz.com/login">login Zilliz Cloud</a> atau buat <a href="https://cloud.zilliz.com/signup">akun Zilliz Cloud</a> untuk menjalankan Milvus terkelola.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">Pertanyaan yang Diajukan Pengembang Tentang DeepSeek V4, Milvus, dan RAG<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">Apakah DeepSeek V4 bagus untuk RAG?</h3><p>DeepSeek V4-Pro sangat cocok untuk RAG ketika Anda membutuhkan pemrosesan konteks panjang dan biaya penyajian yang lebih rendah daripada model tertutup premium. Anda masih memerlukan lapisan pengambilan seperti Milvus untuk memilih potongan yang relevan, menerapkan filter metadata, dan menjaga agar prompt tetap fokus.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">Haruskah saya menggunakan GPT-5.5 atau DeepSeek V4 untuk pipeline RAG?</h3><p>Gunakan GPT-5.5 jika kualitas jawaban, penggunaan alat, dan penelitian langsung lebih penting daripada biaya. Gunakan DeepSeek V4-Pro ketika pemrosesan konteks panjang dan kontrol biaya lebih penting, terutama jika lapisan pengambilan Anda sudah memasok konteks dasar berkualitas tinggi.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">Dapatkah saya menjalankan Qwen3.6-35B-A3B secara lokal untuk RAG pribadi?</h3><p>Ya, Qwen3.6-35B-A3B memiliki bobot terbuka dan dirancang untuk penerapan yang lebih terkendali. Ini adalah kandidat yang baik ketika privasi, penyajian lokal, input multimodal, atau kinerja bahasa Mandarin penting, tetapi Anda masih perlu memvalidasi latensi, memori, dan kualitas pengambilan untuk perangkat keras Anda.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">Apakah model konteks panjang membuat database vektor tidak diperlukan?</h3><p>Tidak. Model konteks panjang dapat membaca lebih banyak teks, tetapi mereka masih mendapatkan manfaat dari pengambilan. Basis data vektor mempersempit input menjadi bagian yang relevan, mendukung pemfilteran metadata, mengurangi biaya token, dan membuat aplikasi lebih mudah diperbarui saat dokumen berubah.</p>
