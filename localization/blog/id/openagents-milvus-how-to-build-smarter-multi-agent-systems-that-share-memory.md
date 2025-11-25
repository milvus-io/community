---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: >-
  OpenAgents x Milvus: Cara Membangun Sistem Multi-Agen yang Lebih Cerdas yang
  Berbagi Memori
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  Jelajahi bagaimana OpenAgents memungkinkan kolaborasi multi-agen
  terdistribusi, mengapa Milvus sangat penting untuk menambahkan memori yang
  dapat diskalakan, dan bagaimana cara membangun sistem yang lengkap.
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>Sebagian besar pengembang memulai sistem agen mereka dengan satu agen dan baru kemudian menyadari bahwa pada dasarnya mereka telah membangun chatbot yang sangat mahal. Untuk tugas-tugas sederhana, agen gaya ReAct bekerja dengan baik, tetapi dengan cepat mencapai batas: tidak dapat menjalankan langkah-langkah secara paralel, kehilangan jejak rantai penalaran yang panjang, dan cenderung berantakan setelah Anda menambahkan terlalu banyak alat ke dalam campuran. Pengaturan multi-agen menjanjikan untuk memperbaiki hal ini, tetapi mereka membawa masalah mereka sendiri: koordinasi di atas kepala, handoff yang rapuh, dan konteks bersama yang membengkak yang secara diam-diam mengikis kualitas model.</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgents</a> adalah kerangka kerja sumber terbuka untuk membangun sistem multi-agen di mana agen-agen AI bekerja bersama, berbagi sumber daya, dan menangani proyek-proyek jangka panjang dalam komunitas yang gigih. Alih-alih menggunakan satu orkestrator pusat, OpenAgents memungkinkan para agen berkolaborasi dengan cara yang lebih terdistribusi: mereka dapat menemukan satu sama lain, berkomunikasi, dan berkoordinasi untuk mencapai tujuan bersama.</p>
<p>Dipasangkan dengan basis data vektor <a href="https://milvus.io/">Milvus</a>, pipeline ini mendapatkan lapisan memori jangka panjang yang dapat diskalakan dan berkinerja tinggi. Milvus memperkuat memori agen dengan pencarian semantik yang cepat, pilihan pengindeksan yang fleksibel seperti HNSW dan IVF, dan isolasi yang bersih melalui partisi, sehingga agen dapat menyimpan, mengambil, dan menggunakan kembali pengetahuan tanpa tenggelam dalam konteks atau menginjak data satu sama lain.</p>
<p>Dalam tulisan ini, kita akan membahas bagaimana OpenAgents memungkinkan kolaborasi multi-agen terdistribusi, mengapa Milvus merupakan fondasi penting untuk memori agen yang dapat diskalakan, dan bagaimana cara merakit sistem seperti itu selangkah demi selangkah.</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">Tantangan dalam Membangun Sistem Agen Dunia Nyata<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Banyak kerangka kerja agen utama saat ini-LangChain, AutoGen, CrewAI, dan lainnya-dibangun di sekitar model yang <strong>berpusat pada tugas.</strong> Anda membentuk sekumpulan agen, memberi mereka pekerjaan, mungkin mendefinisikan alur kerja, dan membiarkannya berjalan. Ini bekerja dengan baik untuk kasus penggunaan yang sempit atau berumur pendek, tetapi dalam lingkungan produksi yang sebenarnya, ini memperlihatkan tiga batasan struktural:</p>
<ul>
<li><p><strong>Pengetahuan tetap terkotak-kotak.</strong> Pengalaman agen terbatas pada penerapannya sendiri. Agen peninjau kode di bidang teknik tidak membagikan apa yang dipelajarinya kepada agen tim produk yang mengevaluasi kelayakan. Setiap tim akhirnya membangun kembali pengetahuan dari awal, yang tidak efisien dan rapuh.</p></li>
<li><p><strong>Kolaborasi bersifat kaku.</strong> Bahkan dalam kerangka kerja multi-agen, kerja sama biasanya bergantung pada alur kerja yang telah ditentukan sebelumnya. Ketika kolaborasi perlu berubah, aturan statis ini tidak dapat beradaptasi, sehingga seluruh sistem menjadi kurang fleksibel.</p></li>
<li><p><strong>Kurangnya keadaan yang persisten.</strong> Sebagian besar agen mengikuti siklus hidup yang sederhana: <em>mulai → jalankan → matikan.</em> Mereka melupakan segala sesuatu di antara konteks yang dijalankan, hubungan, keputusan yang dibuat, dan riwayat interaksi. Tanpa state yang persisten, agen tidak dapat membangun memori jangka panjang atau mengembangkan perilakunya.</p></li>
</ul>
<p>Masalah struktural ini berasal dari memperlakukan agen sebagai pelaksana tugas yang terisolasi daripada peserta dalam jaringan kolaboratif yang lebih luas.</p>
<p>Tim OpenAgents percaya bahwa sistem agen masa depan membutuhkan lebih dari sekadar penalaran yang lebih kuat-mereka membutuhkan mekanisme yang memungkinkan para agen untuk menemukan satu sama lain, membangun hubungan, berbagi pengetahuan, dan bekerja sama secara dinamis. Dan yang terpenting, hal ini tidak boleh bergantung pada satu pengendali pusat. Internet bekerja karena terdistribusi-tidak ada satu simpul pun yang menentukan segalanya, dan sistem menjadi lebih kuat dan terukur seiring dengan pertumbuhannya. Sistem multi-agen mendapat manfaat dari prinsip desain yang sama. Itulah mengapa OpenAgents menghilangkan gagasan tentang orkestrator yang sangat kuat dan sebagai gantinya memungkinkan kerja sama yang terdesentralisasi dan digerakkan oleh jaringan.</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">Apa itu OpenAgents?<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents adalah kerangka kerja sumber terbuka untuk membangun jaringan agen AI yang memungkinkan kolaborasi terbuka, di mana agen-agen AI bekerja bersama, berbagi sumber daya, dan menangani proyek-proyek jangka panjang. OpenAgents menyediakan infrastruktur untuk internet agen - di mana agen berkolaborasi secara terbuka dengan jutaan agen lain dalam komunitas yang terus berkembang. Pada tingkat teknis, sistem ini terstruktur di sekitar tiga komponen inti: <strong>Jaringan Agen, Modifikasi Jaringan, dan Transportasi.</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1. Jaringan Agen: Lingkungan Bersama untuk Kolaborasi</h3><p>Jaringan agen adalah lingkungan bersama di mana beberapa agen dapat terhubung, berkomunikasi, dan bekerja sama untuk menyelesaikan tugas-tugas yang kompleks. Karakteristik intinya meliputi:</p>
<ul>
<li><p><strong>Operasi yang terus-menerus:</strong> Setelah dibuat, Jaringan tetap online secara independen dari satu tugas atau alur kerja.</p></li>
<li><p><strong>Agen dinamis:</strong> Agen dapat bergabung kapan saja dengan menggunakan ID Jaringan; tidak perlu melakukan pra-pendaftaran.</p></li>
<li><p><strong>Dukungan multi-protokol:</strong> Lapisan abstraksi terpadu mendukung komunikasi melalui WebSocket, gRPC, HTTP, dan libp2p.</p></li>
<li><p><strong>Konfigurasi otonom:</strong> Setiap Jaringan memiliki izin, tata kelola, dan sumber dayanya sendiri.</p></li>
</ul>
<p>Hanya dengan satu baris kode, Anda dapat menjalankan Jaringan, dan agen mana pun dapat segera bergabung melalui antarmuka standar.</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2. Mod Jaringan: Ekstensi yang Dapat Dicolokkan untuk Kolaborasi</h3><p>Mods menyediakan lapisan modular fitur kolaborasi yang tetap terpisah dari sistem inti. Anda dapat memadupadankan Mods berdasarkan kebutuhan spesifik Anda, memungkinkan pola kolaborasi yang disesuaikan dengan setiap kasus penggunaan.</p>
<table>
<thead>
<tr><th><strong>Mod</strong></th><th><strong>Tujuan</strong></th><th><strong>Kasus penggunaan</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Perpesanan Ruang Kerja</strong></td><td>Komunikasi pesan waktu nyata</td><td>Tanggapan streaming, umpan balik instan</td></tr>
<tr><td><strong>Forum</strong></td><td>Diskusi asinkron</td><td>Tinjauan proposal, musyawarah multi-ronde</td></tr>
<tr><td><strong>Wiki</strong></td><td>Basis pengetahuan bersama</td><td>Konsolidasi pengetahuan, kolaborasi dokumen</td></tr>
<tr><td><strong>Sosial</strong></td><td>Grafik hubungan</td><td>Perutean ahli, jaringan kepercayaan</td></tr>
</tbody>
</table>
<p>Semua Mods beroperasi pada sistem peristiwa terpadu, sehingga mudah untuk memperluas kerangka kerja atau memperkenalkan perilaku khusus kapan pun diperlukan.</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3. Transportasi: Saluran Protokol-Agnostik untuk Komunikasi</h3><p>Transports adalah protokol komunikasi yang memungkinkan agen-agen heterogen untuk terhubung dan bertukar pesan dalam jaringan OpenAgents. OpenAgents mendukung beberapa protokol transport yang dapat berjalan secara bersamaan di dalam jaringan yang sama, termasuk:</p>
<ul>
<li><p><strong>HTTP/REST</strong> untuk integrasi lintas bahasa yang luas</p></li>
<li><p><strong>WebSocket</strong> untuk komunikasi dua arah dengan latensi rendah</p></li>
<li><p><strong>gRPC</strong> untuk RPC berkinerja tinggi yang cocok untuk cluster berskala besar</p></li>
<li><p><strong>libp2p</strong> untuk jaringan peer-to-peer yang terdesentralisasi</p></li>
<li><p><strong>A2A</strong>, protokol baru yang dirancang khusus untuk komunikasi agen-ke-agen</p></li>
</ul>
<p>Semua transportasi beroperasi melalui format pesan berbasis peristiwa terpadu, sehingga memungkinkan penerjemahan yang mulus antar protokol. Anda tidak perlu khawatir tentang protokol mana yang digunakan oleh agen peer - kerangka kerja menanganinya secara otomatis. Agen yang dibangun dalam bahasa atau kerangka kerja apa pun dapat bergabung dengan jaringan OpenAgents tanpa menulis ulang kode yang ada.</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">Mengintegrasikan OpenAgents dengan Milvus untuk Memori Agen Jangka Panjang<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgents memecahkan tantangan tentang bagaimana agen <strong>berkomunikasi, menemukan satu sama lain, dan berkolaborasi - tetapi</strong>kolaborasi saja tidak cukup. Agen menghasilkan wawasan, keputusan, riwayat percakapan, hasil alat, dan pengetahuan spesifik domain. Tanpa lapisan memori yang persisten, semua itu akan menguap begitu agen dimatikan.</p>
<p>Di sinilah <strong>Milvus</strong> menjadi penting. Milvus menyediakan penyimpanan vektor berkinerja tinggi dan pengambilan semantik yang diperlukan untuk mengubah interaksi agen menjadi memori yang tahan lama dan dapat digunakan kembali. Ketika diintegrasikan ke dalam jaringan OpenAgents, Milvus menawarkan tiga keuntungan utama:</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1. Pencarian Semantik</strong></h4><p>Milvus memberikan pencarian semantik yang cepat menggunakan algoritma pengindeksan seperti HNSW dan IVF_FLAT. Agen dapat mengambil catatan historis yang paling relevan berdasarkan makna, bukan kata kunci, sehingga memungkinkan mereka untuk</p>
<ul>
<li><p>mengingat keputusan atau rencana sebelumnya,</p></li>
<li><p>menghindari pengulangan pekerjaan,</p></li>
<li><p>mempertahankan konteks cakrawala panjang di seluruh sesi.</p></li>
</ul>
<p>Ini adalah tulang punggung <em>memori agen</em>: pengambilan yang cepat, relevan, dan kontekstual.</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2. Skalabilitas Horizontal Berskala Miliaran</strong></h4><p>Jaringan agen nyata menghasilkan data dalam jumlah besar. Milvus dibangun untuk beroperasi dengan nyaman pada skala ini, menawarkan:</p>
<ul>
<li><p>penyimpanan dan pencarian lebih dari miliaran vektor,</p></li>
<li><p>Latensi &lt;30 ms bahkan dalam pengambilan Top-K dengan throughput tinggi,</p></li>
<li><p>arsitektur terdistribusi penuh yang berkembang secara linear seiring dengan meningkatnya permintaan.</p></li>
</ul>
<p>Apakah Anda memiliki selusin agen atau ribuan agen yang bekerja secara paralel, Milvus menjaga pengambilan dengan cepat dan konsisten.</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3. Isolasi Multi-Penyewa</strong></h4><p>Milvus menyediakan isolasi multi-tenant granular melalui <strong>Partition Key</strong>, mekanisme partisi ringan yang menyegmentasikan memori di dalam satu koleksi. Hal ini memungkinkan:</p>
<ul>
<li><p>tim, proyek, atau komunitas agen yang berbeda untuk mempertahankan ruang memori yang independen,</p></li>
<li><p>biaya overhead yang jauh lebih rendah dibandingkan dengan mempertahankan banyak koleksi,</p></li>
<li><p>pengambilan lintas partisi opsional ketika pengetahuan bersama diperlukan.</p></li>
</ul>
<p>Isolasi ini sangat penting untuk penyebaran multi-agen yang besar di mana batas-batas data harus dihormati tanpa mengorbankan kecepatan pengambilan.</p>
<p>OpenAgents terhubung ke Milvus melalui <strong>Mod khusus</strong> yang memanggil API Milvus secara langsung. Pesan agen, keluaran alat, dan log interaksi secara otomatis disematkan ke dalam vektor dan disimpan di Milvus. Pengembang dapat menyesuaikan:</p>
<ul>
<li><p>model penyematan,</p></li>
<li><p>skema penyimpanan dan metadata,</p></li>
<li><p>dan strategi pengambilan (misalnya, pencarian hibrida, pencarian terpartisi).</p></li>
</ul>
<p>Hal ini memberikan setiap komunitas agen sebuah lapisan memori yang dapat diskalakan, persisten, dan dioptimalkan untuk penalaran semantik.</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">Cara Membangun Chatbot Multi-Agen dengan OpenAgent dan Milvus<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk memperjelasnya, mari kita lihat sebuah demo: membangun <strong>komunitas dukungan pengembang</strong> di mana beberapa agen spesialis - pakar Python, pakar database, insinyur DevOps, dan banyak lagi - berkolaborasi untuk menjawab pertanyaan teknis. Alih-alih mengandalkan satu agen generalis yang terlalu banyak bekerja, setiap ahli menyumbangkan penalaran spesifik domain, dan sistem mengarahkan pertanyaan ke agen yang paling cocok secara otomatis.</p>
<p>Contoh ini menunjukkan cara mengintegrasikan <strong>Milvus</strong> ke dalam penerapan OpenAgents untuk menyediakan memori jangka panjang untuk tanya jawab teknis. Percakapan agen, solusi sebelumnya, log pemecahan masalah, dan pertanyaan pengguna semuanya dikonversi ke dalam penyematan vektor dan disimpan di Milvus, sehingga memberikan kemampuan kepada jaringan untuk</p>
<ul>
<li><p>mengingat jawaban sebelumnya,</p></li>
<li><p>menggunakan kembali penjelasan teknis sebelumnya,</p></li>
<li><p>menjaga konsistensi di seluruh sesi, dan</p></li>
<li><p>meningkat dari waktu ke waktu seiring dengan bertambahnya interaksi.</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">Prasyarat</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1. Mendefinisikan Ketergantungan</h3><p>Tentukan paket Python yang diperlukan untuk proyek:</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2. Variabel Lingkungan</h3><p>Berikut ini adalah templat untuk konfigurasi lingkungan Anda:</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3. Mengkonfigurasi Jaringan OpenAgents Anda</h3><p>Tentukan struktur jaringan agen Anda dan pengaturan komunikasinya:</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4. Menerapkan Kolaborasi Multi-Agen</h3><p>Berikut ini adalah cuplikan kode inti (bukan implementasi penuh).</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5. Membuat dan Mengaktifkan Lingkungan Virtual</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>Menginstal Ketergantungan</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>Mengonfigurasi Kunci API</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Memulai Jaringan OpenAgents</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Memulai Layanan Multi-Agen</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Memulai OpenAgents Studio</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Akses Studio</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Periksa status agen dan jaringan Anda:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>OpenAgents menyediakan lapisan koordinasi yang memungkinkan para agen menemukan satu sama lain, berkomunikasi, dan berkolaborasi, sementara Milvus memecahkan masalah yang sama pentingnya yaitu bagaimana pengetahuan disimpan, dibagikan, dan digunakan kembali. Dengan menghadirkan lapisan memori vektor berkinerja tinggi, Milvus memungkinkan agen untuk membangun konteks yang persisten, mengingat kembali interaksi masa lalu, dan mengakumulasi keahlian dari waktu ke waktu. Bersama-sama, mereka mendorong sistem AI melampaui batas-batas model yang terisolasi dan menuju potensi kolaboratif yang lebih dalam dari jaringan multi-agen yang sebenarnya.</p>
<p>Tentu saja, tidak ada arsitektur multi-agen yang tanpa trade-off. Menjalankan agen secara paralel dapat meningkatkan konsumsi token, kesalahan dapat mengalir di seluruh agen, dan pengambilan keputusan secara simultan dapat menyebabkan konflik sesekali. Ini adalah area penelitian aktif dan perbaikan yang sedang berlangsung - tetapi tidak mengurangi nilai membangun sistem yang dapat berkoordinasi, mengingat, dan berevolusi.</p>
<p>🚀 Siap memberikan memori jangka panjang kepada agen Anda?</p>
<p>Jelajahi <a href="https://milvus.io/">Milvus</a> dan coba integrasikan dengan alur kerja Anda.</p>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
