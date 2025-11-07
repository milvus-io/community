---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: >-
  Melampaui Kelebihan Konteks: Bagaimana Parlant × Milvus Memberikan Kontrol dan
  Kejelasan pada Perilaku Agen LLM
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_d39ad6c8b0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Temukan bagaimana Parlant × Milvus menggunakan pemodelan penyelarasan dan
  kecerdasan vektor untuk membuat perilaku agen LLM dapat dikontrol, dapat
  dijelaskan, dan siap produksi.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>Bayangkan jika Anda diminta untuk menyelesaikan tugas yang melibatkan 200 aturan bisnis, 50 alat bantu, dan 30 demo, dan Anda hanya memiliki waktu satu jam untuk mengerjakannya. Hal itu sangat tidak mungkin. Namun kita sering mengharapkan model bahasa yang besar untuk melakukan hal tersebut ketika kita mengubahnya menjadi "agen" dan membebani mereka dengan instruksi.</p>
<p>Dalam praktiknya, pendekatan ini dengan cepat rusak. Kerangka kerja agen tradisional, seperti LangChain atau LlamaIndex, menyuntikkan semua aturan dan alat ke dalam konteks model sekaligus, yang mengarah pada konflik aturan, konteks yang berlebihan, dan perilaku yang tidak dapat diprediksi dalam produksi.</p>
<p>Untuk mengatasi masalah ini, sebuah kerangka kerja agen sumber terbuka yang disebut<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a> baru-baru ini mendapatkan daya tarik di GitHub. Parlant memperkenalkan pendekatan baru yang disebut Alignment Modeling, bersama dengan mekanisme pengawasan dan transisi bersyarat yang membuat perilaku agen jauh lebih terkendali dan dapat dijelaskan.</p>
<p>Ketika dipasangkan dengan <a href="https://milvus.io/"><strong>Milvus</strong></a>, sebuah basis data vektor sumber terbuka, Parlant menjadi lebih mumpuni. Milvus menambahkan kecerdasan semantik, yang memungkinkan agen secara dinamis mengambil aturan dan konteks yang paling relevan secara real time-menjaga agar tetap akurat, efisien, dan siap produksi.</p>
<p>Dalam artikel ini, kita akan mengeksplorasi bagaimana Parlant bekerja di balik layar-dan bagaimana mengintegrasikannya dengan Milvus memungkinkan tingkat produksi.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">Mengapa Kerangka Kerja Agen Tradisional Berantakan<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>Kerangka kerja agen tradisional suka menjadi besar: ratusan aturan, lusinan alat, dan beberapa demo-semuanya dijejalkan ke dalam satu prompt yang terlalu banyak. Ini mungkin terlihat bagus dalam demo atau uji coba kotak pasir kecil, tetapi begitu Anda mendorongnya ke dalam produksi, celah-celahnya mulai terlihat dengan cepat.</p>
<ul>
<li><p><strong>Aturan yang Bertentangan Membawa Kekacauan:</strong> Ketika dua atau lebih aturan berlaku pada saat yang sama, kerangka kerja ini tidak memiliki cara bawaan untuk memutuskan mana yang menang. Kadang-kadang memilih salah satu. Kadang-kadang memadukan keduanya. Kadang-kadang melakukan sesuatu yang sama sekali tidak dapat diprediksi.</p></li>
<li><p><strong>Kasus-kasus Tepi Mengekspos Kesenjangan:</strong> Anda tidak mungkin dapat memprediksi semua yang akan dikatakan oleh pengguna. Dan ketika model Anda menemukan sesuatu di luar data pelatihannya, model akan menggunakan jawaban yang umum dan tidak berkomitmen.</p></li>
<li><p><strong>Debugging itu Menyakitkan dan Mahal:</strong> Ketika sebuah agen berperilaku buruk, hampir tidak mungkin untuk menentukan aturan mana yang menyebabkan masalah. Karena semuanya berada di dalam satu prompt sistem raksasa, satu-satunya cara untuk memperbaikinya adalah menulis ulang prompt dan menguji ulang semuanya dari awal.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Apa itu Parlant dan Bagaimana Cara Kerjanya<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant adalah Mesin Penyelarasan sumber terbuka untuk agen LLM. Anda dapat secara tepat mengontrol bagaimana agen berperilaku di berbagai skenario dengan memodelkan proses pengambilan keputusan dengan cara yang terstruktur dan berbasis aturan.</p>
<p>Untuk mengatasi masalah yang ditemukan dalam kerangka kerja agen tradisional, Parlant memperkenalkan pendekatan baru yang kuat: <strong>Pemodelan Penyelarasan</strong>. Ide intinya adalah memisahkan definisi aturan dari eksekusi aturan, memastikan bahwa hanya aturan yang paling relevan yang dimasukkan ke dalam konteks LLM pada waktu tertentu.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">Pedoman Granular: Inti dari Pemodelan Penyelarasan</h3><p>Inti dari model penyelarasan Parlant adalah konsep <strong>Granular Guidelines</strong>. Alih-alih menulis satu perintah sistem raksasa yang penuh dengan aturan, Anda mendefinisikan pedoman kecil dan modular - masing-masing menjelaskan bagaimana agen harus menangani jenis situasi tertentu.</p>
<p>Setiap pedoman terdiri dari tiga bagian:</p>
<ul>
<li><p><strong>Kondisi</strong> - Deskripsi bahasa alami tentang kapan aturan harus diterapkan. Parlant mengubah kondisi ini menjadi vektor semantik dan mencocokkannya dengan input pengguna untuk mengetahui apakah kondisi tersebut relevan.</p></li>
<li><p><strong>Tindakan</strong> - Instruksi yang jelas yang mendefinisikan bagaimana agen harus merespons setelah kondisi terpenuhi. Tindakan ini disuntikkan ke dalam konteks LLM hanya ketika dipicu.</p></li>
<li><p><strong>Alat</strong> - Setiap fungsi eksternal atau API yang terkait dengan aturan tertentu. Ini diekspos ke agen hanya ketika pedoman aktif, menjaga penggunaan alat tetap terkendali dan sesuai konteks.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>Setiap kali pengguna berinteraksi dengan agen, Parlant menjalankan langkah pencocokan ringan untuk menemukan tiga hingga lima pedoman yang paling relevan. Hanya aturan-aturan tersebut yang dimasukkan ke dalam konteks model, menjaga agar petunjuk tetap ringkas dan terfokus sambil memastikan bahwa agen secara konsisten mengikuti aturan yang tepat.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">Mekanisme Pengawasan untuk Akurasi dan Konsistensi</h3><p>Untuk menjaga akurasi dan konsistensi lebih lanjut, Parlant memperkenalkan <strong>mekanisme pengawasan</strong> yang bertindak sebagai kontrol kualitas lapisan kedua. Prosesnya berlangsung dalam tiga langkah:</p>
<p><strong>1. Menghasilkan respons kandidat</strong> - Agen membuat balasan awal berdasarkan panduan yang sesuai dan konteks percakapan saat ini.</p>
<p><strong>2. Memeriksa kesesuaian</strong> - Tanggapan tersebut dibandingkan dengan panduan aktif untuk memverifikasi bahwa setiap instruksi telah diikuti dengan benar.</p>
<p><strong>3. Merevisi atau mengonfirmasi</strong> - Jika ada masalah yang ditemukan, sistem akan mengoreksi output; jika semuanya sesuai, balasan akan disetujui dan dikirim ke pengguna.</p>
<p>Mekanisme pengawasan ini memastikan bahwa agen tidak hanya memahami aturan tetapi juga benar-benar mematuhinya sebelum membalas-memperbaiki keandalan dan kontrol.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">Transisi Bersyarat untuk Kontrol dan Keamanan</h3><p>Dalam kerangka kerja agen tradisional, setiap alat yang tersedia diekspos ke LLM setiap saat. Pendekatan "semua yang ada di atas meja" ini sering kali menyebabkan permintaan yang berlebihan dan pemanggilan alat yang tidak diinginkan. Parlant memecahkan masalah ini melalui <strong>transisi bersyarat</strong>. Mirip dengan cara kerja state machine, sebuah aksi atau alat hanya dipicu ketika kondisi tertentu terpenuhi. Setiap alat terikat erat dengan pedoman yang sesuai, dan alat tersebut hanya akan tersedia ketika kondisi pedoman tersebut diaktifkan.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>Mekanisme ini mengubah pemanggilan alat menjadi transisi bersyarat-alat berpindah dari "tidak aktif" menjadi "aktif" hanya ketika kondisi pemicunya terpenuhi. Dengan menyusun eksekusi dengan cara ini, Parlant memastikan bahwa setiap tindakan terjadi dengan sengaja dan kontekstual, mencegah penyalahgunaan sekaligus meningkatkan efisiensi dan keamanan sistem.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Bagaimana Milvus Memberdayakan Parlant<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika kita melihat di balik proses pencocokan pedoman Parlant, satu tantangan teknis utama menjadi jelas: bagaimana sistem dapat menemukan tiga hingga lima aturan yang paling relevan dari ratusan - atau bahkan ribuan - pilihan hanya dalam beberapa milidetik? Di situlah letak peran database vektor. Pengambilan semantik adalah hal yang memungkinkan hal ini terjadi.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Bagaimana Milvus Mendukung Proses Pencocokan Pedoman Parlant</h3><p>Pencocokan pedoman bekerja melalui kesamaan semantik. Bidang Kondisi setiap pedoman diubah menjadi penyematan vektor, menangkap maknanya dan bukan hanya teks harfiahnya. Ketika pengguna mengirim pesan, Parlant membandingkan semantik pesan tersebut dengan semua penyematan pedoman yang tersimpan untuk menemukan yang paling relevan.</p>
<p>Berikut ini cara kerja prosesnya selangkah demi selangkah:</p>
<p><strong>1. Menyandikan kueri</strong> - Pesan pengguna dan riwayat percakapan terakhir diubah menjadi vektor kueri.</p>
<p><strong>2. Cari kemiripan</strong> - Sistem melakukan pencarian kemiripan di dalam penyimpanan vektor panduan untuk menemukan kecocokan terdekat.</p>
<p><strong>3.</strong> Mengambil<strong>hasil Top-K</strong> - Tiga hingga lima pedoman yang paling relevan secara semantik dikembalikan.</p>
<p><strong>4.</strong> Suntikkan<strong>ke dalam konteks</strong> - Pedoman yang cocok ini kemudian secara dinamis dimasukkan ke dalam konteks LLM sehingga model dapat bertindak sesuai dengan aturan yang benar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk memungkinkan alur kerja ini, basis data vektor harus memberikan tiga kemampuan penting: pencarian Approximate Nearest Neighbor (ANN) berkinerja tinggi, pemfilteran metadata yang fleksibel, dan pembaruan vektor secara real-time. <a href="https://milvus.io/"><strong>Milvus</strong></a>, basis data vektor open-source yang berasal dari cloud, memberikan kinerja tingkat produksi di ketiga area tersebut.</p>
<p>Untuk memahami cara kerja Milvus dalam skenario nyata, mari kita lihat agen layanan keuangan sebagai contoh.</p>
<p>Misalkan sistem mendefinisikan 800 panduan bisnis yang mencakup tugas-tugas seperti pertanyaan rekening, transfer dana, dan konsultasi produk manajemen kekayaan. Dalam pengaturan ini, Milvus bertindak sebagai lapisan penyimpanan dan pengambilan untuk semua data pedoman.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang, ketika pengguna mengatakan "Saya ingin mentransfer 100.000 RMB ke rekening ibu saya", alur runtime-nya adalah:</p>
<p><strong>1. Rektoratisasi kueri</strong> - Ubah masukan pengguna menjadi vektor 768 dimensi.</p>
<p><strong>2. Pengambilan hibrida</strong> - Menjalankan pencarian kemiripan vektor di Milvus dengan pemfilteran metadata (mis., <code translate="no">business_domain=&quot;transfer&quot;</code>).</p>
<p><strong>3. Pemeringkatan hasil</strong> - Memberi peringkat pada kandidat panduan berdasarkan nilai kemiripan yang dikombinasikan dengan nilai <strong>prioritasnya</strong>.</p>
<p><strong>4. Injeksi konteks</strong> - Suntikkan Top-3 pedoman yang cocok ' <code translate="no">action_text</code> ke dalam konteks agen Parlant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dalam konfigurasi ini, Milvus memberikan latensi P99 di bawah 15 ms, bahkan ketika pustaka panduan berskala hingga 100.000 entri. Sebagai perbandingan, menggunakan basis data relasional tradisional dengan pencocokan kata kunci biasanya menghasilkan latensi di atas 200 ms dan akurasi pencocokan yang jauh lebih rendah.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Bagaimana Milvus Memungkinkan Memori Jangka Panjang dan Personalisasi</h3><p>Milvus melakukan lebih dari sekadar pencocokan pedoman. Dalam skenario di mana agen membutuhkan memori jangka panjang dan respons yang dipersonalisasi, Milvus dapat berfungsi sebagai lapisan memori yang menyimpan dan mengambil interaksi pengguna di masa lalu sebagai penyematan vektor, membantu agen mengingat apa yang telah didiskusikan sebelumnya.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>Ketika pengguna yang sama kembali, agen dapat mengambil interaksi historis yang paling relevan dari Milvus dan menggunakannya untuk menghasilkan pengalaman yang lebih terhubung dan seperti manusia. Misalnya, jika pengguna bertanya tentang dana investasi minggu lalu, agen dapat mengingat konteks tersebut dan merespons secara proaktif: "Selamat datang kembali! Apakah Anda masih memiliki pertanyaan tentang reksa dana yang kita bahas terakhir kali?"</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">Cara Mengoptimalkan Kinerja untuk Sistem Agen yang Didukung Milvus</h3><p>Ketika menerapkan sistem agen yang didukung oleh Milvus di lingkungan produksi, penyetelan kinerja menjadi sangat penting. Untuk mencapai latensi rendah dan throughput tinggi, beberapa parameter kunci perlu diperhatikan:</p>
<p><strong>1. Memilih Jenis Indeks yang Tepat</strong></p>
<p>Penting untuk memilih struktur indeks yang sesuai. Sebagai contoh, HNSW (Hierarchical Navigable Small World) sangat ideal untuk skenario dengan tingkat penarikan tinggi seperti keuangan atau perawatan kesehatan, di mana akurasi sangat penting. IVF_FLAT bekerja lebih baik untuk aplikasi berskala besar seperti rekomendasi e-commerce, di mana recall yang sedikit lebih rendah dapat diterima dengan imbalan kinerja yang lebih cepat dan penggunaan memori yang lebih sedikit.</p>
<p><strong>2. Strategi Pemecahan</strong></p>
<p>Ketika jumlah pedoman yang disimpan melebihi satu juta entri, disarankan untuk menggunakan <strong>Partisi</strong> untuk membagi data berdasarkan domain bisnis atau kasus penggunaan. Partisi mengurangi ruang pencarian per kueri, meningkatkan kecepatan pengambilan dan menjaga latensi tetap stabil meskipun kumpulan data bertambah.</p>
<p><strong>3. Konfigurasi Cache</strong></p>
<p>Untuk panduan yang sering diakses seperti kueri pelanggan standar atau alur kerja dengan lalu lintas tinggi, Anda dapat menggunakan cache hasil kueri Milvus. Hal ini memungkinkan sistem untuk menggunakan kembali hasil sebelumnya, mengurangi latensi hingga di bawah 5 milidetik untuk pencarian berulang.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">Demo Langsung: Cara Membangun Sistem Tanya Jawab Cerdas dengan Parlant dan Milvus Lite<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Lite</a> adalah versi ringan dari Milvus - pustaka Python yang dapat dengan mudah disematkan ke dalam aplikasi Anda. Sangat ideal untuk membuat prototipe cepat di lingkungan seperti Notebook Jupyter atau untuk berjalan di perangkat edge dan perangkat pintar dengan sumber daya komputasi yang terbatas. Meskipun berukuran kecil, Milvus Lite mendukung API yang sama dengan penerapan Milvus lainnya. Ini berarti kode sisi klien yang Anda tulis untuk Milvus Lite dapat terhubung dengan mulus ke instance Milvus atau Zilliz Cloud yang lengkap nantinya - tidak perlu melakukan pemfaktoran ulang.</p>
<p>Dalam demo ini, kami akan menggunakan Milvus Lite bersama dengan Parlant untuk mendemonstrasikan cara membangun sistem Tanya Jawab cerdas yang memberikan jawaban yang cepat dan sesuai konteks dengan penyiapan yang minimal.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat: Persyaratan</h3><p>1. Parlant GitHub: https://github.com/emcie-co/parlant</p>
<p>2. Dokumentasi Parlant: https://parlant.io/docs</p>
<p>3.python3.10+</p>
<p>4.OpenAI_key</p>
<p>5. MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Langkah 1: Instal Ketergantungan</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">Langkah 2: Konfigurasi Variabel Lingkungan</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">Langkah 3: Menerapkan Kode Inti</h3><ul>
<li>Buat Embedder OpenAI khusus</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Inisialisasi basis pengetahuan</li>
</ul>
<p>1. Buat koleksi Milvus bernama kb_articles.</p>
<p>2. Masukkan data sampel (misalnya kebijakan pengembalian dana, kebijakan penukaran, waktu pengiriman).</p>
<p>3. Buat indeks HNSW untuk mempercepat pencarian.</p>
<ul>
<li>Membangun alat pencarian vektor</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Mengonfigurasi Agen Parlant</li>
</ul>
<p><strong>Panduan 1:</strong> Untuk pertanyaan yang bersifat faktual atau terkait kebijakan, agen harus terlebih dahulu melakukan pencarian vektor.</p>
<p><strong>Pedoman 2:</strong> Ketika bukti ditemukan, agen harus menjawab dengan menggunakan templat terstruktur (ringkasan + poin-poin penting + sumber).</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Tuliskan kode yang lengkap</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">Langkah 4: Jalankan Kode</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>Kunjungi Taman Bermain:</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Anda sekarang telah berhasil membangun sistem Tanya Jawab cerdas menggunakan Parlant dan Milvus.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant vs LangChain/LlamaIndex: Bagaimana Mereka Berbeda dan Bagaimana Mereka Bekerja Bersama<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>Dibandingkan dengan kerangka kerja agen yang sudah ada seperti <strong>LangChain</strong> atau <strong>LlamaIndex</strong>, apa perbedaan Parlant?</p>
<p>LangChain dan LlamaIndex adalah kerangka kerja tujuan umum. Mereka menyediakan berbagai macam komponen dan integrasi, sehingga ideal untuk pembuatan prototipe dan eksperimen penelitian yang cepat. Namun, ketika harus menerapkan dalam produksi, pengembang sering kali perlu membangun lapisan ekstra sendiri - seperti manajemen aturan, pemeriksaan kepatuhan, dan mekanisme keandalan - untuk menjaga agar agen tetap konsisten dan dapat dipercaya.</p>
<p>Parlant menawarkan Manajemen Pedoman bawaan, mekanisme kritik diri, dan alat penjelasan yang membantu pengembang mengelola bagaimana agen berperilaku, merespons, dan memberi alasan. Hal ini membuat Parlant sangat cocok untuk kasus penggunaan yang berisiko tinggi dan berhadapan langsung dengan pelanggan yang membutuhkan akurasi dan akuntabilitas, seperti keuangan, perawatan kesehatan, dan layanan hukum.</p>
<p>Bahkan, kerangka kerja ini dapat bekerja bersama:</p>
<ul>
<li><p>Gunakan LangChain untuk membangun jalur pemrosesan data yang kompleks atau alur kerja pengambilan data.</p></li>
<li><p>Gunakan Parlant untuk mengelola lapisan interaksi akhir, memastikan keluaran mengikuti aturan bisnis dan tetap dapat diinterpretasikan.</p></li>
<li><p>Gunakan Milvus sebagai fondasi basis data vektor untuk memberikan pencarian semantik, memori, dan pengambilan pengetahuan secara real-time di seluruh sistem.</p></li>
</ul>
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
    </button></h2><p>Ketika agen LLM beralih dari eksperimen ke produksi, pertanyaan kuncinya bukan lagi apa yang dapat mereka lakukan-tetapi seberapa andal dan aman mereka dapat melakukannya. Parlant menyediakan struktur dan kontrol untuk keandalan tersebut, sementara Milvus memberikan infrastruktur vektor yang dapat diskalakan yang membuat semuanya berjalan dengan cepat dan sesuai dengan konteks.</p>
<p>Bersama-sama, keduanya memungkinkan pengembang untuk membangun agen AI yang tidak hanya mampu, tetapi juga dapat dipercaya, dapat dijelaskan, dan siap produksi.</p>
<p>🚀 Lihat<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant di GitHub</a> dan integrasikan dengan<a href="https://milvus.io"> Milvus</a> untuk membangun sistem agen cerdas yang digerakkan oleh aturan Anda sendiri.</p>
<p>Punya pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
