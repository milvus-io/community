---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: Cara Membangun Sistem Multi-Agen yang Siap Produksi dengan Agno dan Milvus
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  Pelajari cara membangun, menerapkan, dan menskalakan sistem multi-agen yang
  siap produksi menggunakan Agno, AgentOS, dan Milvus untuk beban kerja di dunia
  nyata.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>Jika Anda telah membuat agen AI, Anda mungkin pernah mengalami hal ini: demo Anda bekerja dengan baik, tetapi membuatnya menjadi produksi adalah cerita yang sama sekali berbeda.</p>
<p>Kami telah membahas manajemen memori agen dan pemeringkatan ulang di postingan sebelumnya. Sekarang mari kita bahas tantangan yang lebih besar-membangun agen yang benar-benar bertahan dalam produksi.</p>
<p>Inilah kenyataannya: lingkungan produksi berantakan. Agen tunggal jarang sekali dapat menyelesaikannya, itulah sebabnya sistem multi-agen ada di mana-mana. Tetapi kerangka kerja yang tersedia saat ini cenderung terbagi menjadi dua kubu: kerangka kerja ringan yang dapat melakukan demo dengan baik tetapi rusak di bawah beban nyata, atau kerangka kerja kuat yang membutuhkan waktu lama untuk dipelajari dan dibangun.</p>
<p>Saya telah bereksperimen dengan <a href="https://github.com/agno-agi/agno">Agno</a> baru-baru ini, dan tampaknya <a href="https://github.com/agno-agi/agno">Agno</a> berada di tengah-tengah yang masuk akal - berfokus pada kesiapan produksi tanpa kerumitan yang berlebihan. Proyek ini telah mendapatkan lebih dari 37.000 bintang GitHub dalam beberapa bulan, menunjukkan bahwa pengembang lain juga akan merasakan manfaatnya.</p>
<p>Dalam tulisan ini, saya akan membagikan apa yang saya pelajari saat membangun sistem multi-agen menggunakan Agno dengan <a href="https://milvus.io/">Milvus</a> sebagai lapisan memori. Kita akan melihat bagaimana Agno dibandingkan dengan alternatif lain seperti LangGraph dan melihat implementasi lengkap yang dapat Anda coba sendiri.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">Apa itu Agno?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> adalah kerangka kerja multi-agen yang dibangun khusus untuk penggunaan produksi. Ini memiliki dua lapisan yang berbeda:</p>
<ul>
<li><p><strong>Lapisan kerangka kerja Agno</strong>: Tempat Anda mendefinisikan logika agen Anda</p></li>
<li><p><strong>Lapisan runtime AgentOS</strong>: Mengubah logika tersebut menjadi layanan HTTP yang dapat Anda gunakan</p></li>
</ul>
<p>Pikirkan seperti ini: lapisan kerangka kerja mendefinisikan <em>apa yang</em> harus dilakukan oleh agen Anda, sementara AgentOS menangani <em>bagaimana</em> pekerjaan itu dijalankan dan dilayani.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">Lapisan Kerangka Kerja</h3><p>Inilah yang Anda kerjakan secara langsung. Lapisan ini memperkenalkan tiga konsep inti:</p>
<ul>
<li><p><strong>Agen</strong>: Menangani jenis tugas tertentu</p></li>
<li><p><strong>Tim</strong>: Mengkoordinasikan beberapa agen untuk memecahkan masalah yang kompleks</p></li>
<li><p><strong>Alur kerja</strong>: Mendefinisikan urutan dan struktur eksekusi</p></li>
</ul>
<p>Satu hal yang saya hargai: Anda tidak perlu mempelajari DSL baru atau menggambar diagram alur. Perilaku agen didefinisikan menggunakan pemanggilan fungsi Python standar. Kerangka kerja ini menangani pemanggilan LLM, eksekusi alat, dan manajemen memori.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">Lapisan Runtime AgentOS</h3><p>AgentOS dirancang untuk volume permintaan yang tinggi melalui eksekusi asinkronisasi, dan arsitekturnya yang tanpa kewarganegaraan membuat penskalaan menjadi mudah.</p>
<p>Fitur utamanya meliputi:</p>
<ul>
<li><p>Integrasi FastAPI bawaan untuk mengekspos agen sebagai titik akhir HTTP</p></li>
<li><p>Manajemen sesi dan respons streaming</p></li>
<li><p>Memantau titik akhir</p></li>
<li><p>Dukungan penskalaan horizontal</p></li>
</ul>
<p>Dalam praktiknya, AgentOS menangani sebagian besar pekerjaan infrastruktur, yang memungkinkan Anda fokus pada logika agen itu sendiri.</p>
<p>Tampilan tingkat tinggi dari arsitektur Agno ditunjukkan di bawah ini.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno vs LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk memahami di mana posisi Agno, mari kita bandingkan dengan LangGraph-salah satu kerangka kerja multi-agen yang paling banyak digunakan.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a> menggunakan mesin state berbasis grafik. Anda memodelkan seluruh alur kerja agen Anda sebagai sebuah graf: langkah-langkah adalah simpul, jalur eksekusi adalah sisi. Ini bekerja dengan baik ketika proses Anda tetap dan terurut secara ketat. Tetapi untuk skenario yang bersifat terbuka atau percakapan, hal ini dapat terasa membatasi. Ketika interaksi menjadi lebih dinamis, mempertahankan graf yang bersih menjadi lebih sulit.</p>
<p><strong>Agno</strong> mengambil pendekatan yang berbeda. Alih-alih menjadi lapisan orkestrasi murni, ini adalah sistem ujung ke ujung. Tentukan perilaku agen Anda, dan AgentOS secara otomatis mengeksposnya sebagai layanan HTTP siap produksi - dengan pemantauan, skalabilitas, dan dukungan percakapan multi-putaran yang sudah ada di dalamnya. Tidak ada gateway API terpisah, tidak ada manajemen sesi khusus, tidak ada perkakas operasional tambahan.</p>
<p>Inilah perbandingan singkatnya:</p>
<table>
<thead>
<tr><th>Dimensi</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>Model orkestrasi</td><td>Definisi graf eksplisit menggunakan simpul dan sisi</td><td>Alur kerja deklaratif yang didefinisikan dalam Python</td></tr>
<tr><td>Manajemen status</td><td>Kelas state khusus yang didefinisikan dan dikelola oleh pengembang</td><td>Sistem memori bawaan</td></tr>
<tr><td>Debugging &amp; observabilitas</td><td>LangSmith (berbayar)</td><td>UI AgentOS (sumber terbuka)</td></tr>
<tr><td>Model runtime</td><td>Terintegrasi ke dalam runtime yang sudah ada</td><td>Layanan berbasis FastAPI mandiri</td></tr>
<tr><td>Kompleksitas penerapan</td><td>Membutuhkan pengaturan tambahan melalui LangServe</td><td>Bekerja di luar kotak</td></tr>
</tbody>
</table>
<p>LangGraph memberi Anda lebih banyak fleksibilitas dan kontrol yang halus. Agno mengoptimalkan untuk waktu produksi yang lebih cepat. Pilihan yang tepat tergantung pada tahap proyek Anda, infrastruktur yang ada, dan tingkat penyesuaian yang Anda butuhkan. Jika Anda tidak yakin, menjalankan bukti konsep kecil dengan keduanya mungkin merupakan cara yang paling dapat diandalkan untuk memutuskan.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">Memilih Milvus untuk Lapisan Memori Agen<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah Anda memilih kerangka kerja, keputusan selanjutnya adalah bagaimana menyimpan memori dan pengetahuan. Kami menggunakan Milvus untuk ini. <a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka paling populer yang dibuat untuk beban kerja AI dengan lebih dari <a href="https://github.com/milvus-io/milvus">42.000+</a> bintang <a href="https://github.com/milvus-io/milvus">GitHub</a>.</p>
<p><strong>Agno memiliki dukungan Milvus asli.</strong> Modul <code translate="no">agno.vectordb.milvus</code> membungkus fitur-fitur produksi seperti manajemen koneksi, percobaan ulang otomatis, penulisan batch, dan pembuatan embedding. Anda tidak perlu membangun kumpulan koneksi atau menangani kegagalan jaringan sendiri-beberapa baris Python memberi Anda lapisan memori vektor yang berfungsi.</p>
<p><strong>Milvus menyesuaikan dengan kebutuhan Anda.</strong> Ini mendukung tiga <a href="https://milvus.io/docs/install-overview.md">mode penyebaran</a>:</p>
<ul>
<li><p><strong>Milvus Lite</strong>: Ringan, berbasis file-sangat bagus untuk pengembangan dan pengujian lokal</p></li>
<li><p><strong>Standalone</strong>: Penerapan server tunggal untuk beban kerja produksi</p></li>
<li><p><strong>Terdistribusi</strong>: Cluster penuh untuk skenario skala tinggi</p></li>
</ul>
<p>Anda bisa memulai dengan Milvus Lite untuk memvalidasi memori agen Anda secara lokal, lalu beralih ke standalone atau terdistribusi seiring dengan meningkatnya lalu lintas-tanpa mengubah kode aplikasi Anda. Fleksibilitas ini sangat berguna ketika Anda melakukan iterasi dengan cepat pada tahap awal, tetapi membutuhkan jalur yang jelas untuk meningkatkan skala di kemudian hari.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">Langkah demi Langkah: Membangun Agen Agno Siap Produksi dengan Milvus<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita membangun agen siap produksi dari awal.</p>
<p>Kita akan mulai dengan contoh agen tunggal sederhana untuk menunjukkan alur kerja secara keseluruhan. Kemudian kita akan mengembangkannya menjadi sistem multi-agen. AgentOS akan secara otomatis mengemas semuanya sebagai layanan HTTP yang dapat dipanggil.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Menerapkan Milvus Standalone dengan Docker</h3><p><strong>(1) Unduh berkas penerapan</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Mulai Layanan Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Implementasi Inti</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) Menjalankan Agen</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. Menghubungkan ke Konsol AgentOS</h3><p>https://os.agno.com/</p>
<p><strong>(1) Membuat Akun dan Masuk</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Hubungkan Agen Anda ke AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Konfigurasikan Port yang Terbuka dan Nama Agen</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Menambahkan Dokumen dan Mengindeksnya di Milvus</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) Menguji Agen dari Ujung ke Ujung</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam penyiapan ini, Milvus menangani pengambilan semantik berkinerja tinggi. Ketika asisten basis pengetahuan menerima pertanyaan teknis, asisten akan menggunakan alat <code translate="no">search_knowledge</code> untuk menyematkan kueri, mengambil potongan dokumen yang paling relevan dari Milvus, dan menggunakan hasil tersebut sebagai dasar tanggapannya.</p>
<p>Milvus menawarkan tiga opsi penerapan, yang memungkinkan Anda untuk memilih arsitektur yang sesuai dengan kebutuhan operasional Anda sambil menjaga API tingkat aplikasi tetap konsisten di semua mode penerapan.</p>
<p>Demo di atas menunjukkan alur pengambilan dan pembuatan inti. Namun, untuk memindahkan desain ini ke dalam lingkungan produksi, beberapa aspek arsitektur perlu didiskusikan secara lebih rinci.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">Bagaimana Hasil Pengambilan Dibagikan ke Seluruh Agen<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Mode Tim Agno memiliki opsi <code translate="no">share_member_interactions=True</code> yang memungkinkan agen-agen yang datang kemudian untuk mewarisi riwayat interaksi penuh dari agen-agen sebelumnya. Dalam praktiknya, ini berarti bahwa ketika agen pertama mengambil informasi dari Milvus, agen berikutnya dapat menggunakan kembali hasil tersebut alih-alih menjalankan pencarian yang sama lagi.</p>
<ul>
<li><p><strong>Kebalikannya:</strong> Biaya pencarian diamortisasi di seluruh tim. Satu pencarian vektor mendukung banyak agen, mengurangi permintaan yang berlebihan.</p></li>
<li><p><strong>Kelemahannya:</strong> Kualitas pencarian akan meningkat. Jika pencarian awal menghasilkan hasil yang tidak lengkap atau tidak akurat, kesalahan tersebut akan menyebar ke setiap agen yang bergantung padanya.</p></li>
</ul>
<p>Inilah sebabnya mengapa akurasi pencarian menjadi lebih penting dalam sistem multi-agen. Pencarian yang buruk tidak hanya menurunkan respons satu agen, tetapi juga memengaruhi seluruh tim.</p>
<p>Berikut adalah contoh pengaturan Tim:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">Mengapa Agno dan Milvus Diletakkan Secara Terpisah<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam arsitektur ini, <strong>Agno</strong> berada di lapisan percakapan dan orkestrasi. Ia bertanggung jawab untuk mengelola aliran dialog, mengoordinasikan agen, dan mempertahankan status percakapan, dengan riwayat sesi yang disimpan dalam basis data relasional. Pengetahuan domain sistem yang sebenarnya-seperti dokumentasi produk dan laporan teknis-ditangani secara terpisah dan disimpan sebagai penyematan vektor di <strong>Milvus</strong>. Pembagian yang jelas ini membuat logika percakapan dan penyimpanan pengetahuan sepenuhnya terpisah.</p>
<p>Mengapa ini penting secara operasional:</p>
<ul>
<li><p><strong>Penskalaan independen</strong>: Seiring dengan meningkatnya permintaan Agno, tambahkan lebih banyak instance Agno. Seiring bertambahnya volume kueri, perluas Milvus dengan menambahkan node kueri. Setiap lapisan berskala secara terpisah.</p></li>
<li><p><strong>Kebutuhan perangkat keras yang berbeda</strong>: Agno terikat pada CPU dan memori (inferensi LLM, eksekusi alur kerja). Milvus dioptimalkan untuk pengambilan vektor dengan throughput tinggi (disk I/O, terkadang akselerasi GPU). Memisahkan keduanya mencegah perebutan sumber daya.</p></li>
<li><p><strong>Optimalisasi biaya</strong>: Anda dapat menyetel dan mengalokasikan sumber daya untuk setiap lapisan secara independen.</p></li>
</ul>
<p>Pendekatan berlapis ini memberi Anda arsitektur yang lebih efisien, tangguh, dan siap produksi.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">Apa yang Harus Dipantau Saat Menggunakan Agno dengan Milvus<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno memiliki kemampuan evaluasi bawaan, tetapi dengan menambahkan Milvus, Anda bisa memperluas apa yang harus Anda pantau. Berdasarkan pengalaman kami, fokuslah pada tiga area:</p>
<ul>
<li><p><strong>Kualitas pengambilan</strong>: Apakah dokumen yang dikembalikan Milvus benar-benar relevan dengan kueri, atau hanya mirip secara dangkal pada tingkat vektor?</p></li>
<li><p><strong>Kesesuaian jawaban</strong>: Apakah jawaban akhir didasarkan pada konten yang diambil, atau apakah LLM menghasilkan klaim yang tidak didukung?</p></li>
<li><p><strong>Perincian latensi ujung ke ujung</strong>: Jangan hanya melacak waktu respons total. Perinci berdasarkan tahap-pembuatan embedding, pencarian vektor, perakitan konteks, inferensi LLM-sehingga Anda dapat mengidentifikasi di mana perlambatan terjadi.</p></li>
</ul>
<p><strong>Contoh praktis:</strong> Ketika koleksi Milvus Anda bertambah dari 1 juta menjadi 10 juta vektor, Anda mungkin akan melihat latensi pengambilan yang meningkat. Itu biasanya merupakan sinyal untuk menyetel parameter indeks (seperti <code translate="no">nlist</code> dan <code translate="no">nprobe</code>) atau mempertimbangkan untuk berpindah dari penerapan mandiri ke penerapan terdistribusi.</p>
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
    </button></h2><p>Membangun sistem agen yang siap produksi membutuhkan lebih dari sekadar menyambungkan panggilan LLM dan demo pengambilan. Anda membutuhkan batasan arsitektur yang jelas, infrastruktur yang dapat berkembang secara mandiri, dan kemampuan pengamatan untuk menangkap masalah lebih awal.</p>
<p>Dalam artikel ini, saya menjelaskan bagaimana Agno dan Milvus dapat bekerja sama: Agno untuk orkestrasi multi-agen, Milvus untuk memori yang dapat diskalakan dan pengambilan semantik. Dengan memisahkan lapisan-lapisan ini, Anda dapat berpindah dari prototipe ke produksi tanpa menulis ulang logika inti-dan menskalakan setiap komponen sesuai kebutuhan.</p>
<p>Jika Anda bereksperimen dengan pengaturan serupa, saya ingin tahu apa yang berhasil untuk Anda.</p>
<p><strong>Ada pertanyaan tentang Milvus?</strong> Bergabunglah dengan <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">saluran Slack</a> kami atau pesan sesi <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Jam Kantor Milvus</a> selama 20 menit.</p>
