---
id: milvus-boost-ranker-business-aware-vector-search.md
title: Cara Menggunakan Milvus Boost Ranker untuk Pencarian Vektor yang Sadar Bisnis
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  Pelajari bagaimana Milvus Boost Ranker memungkinkan Anda melapisi aturan
  bisnis di atas kemiripan vektor - tingkatkan dokumen resmi, turunkan konten
  yang sudah basi, tambahkan keragaman.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>Pencarian vektor mengurutkan hasil dengan menyematkan kemiripan - semakin dekat vektor, semakin tinggi hasilnya. Beberapa sistem menambahkan perangking berbasis model (BGE, Voyage, Cohere) untuk meningkatkan pemesanan. Namun, tidak ada satu pun pendekatan yang dapat memenuhi kebutuhan mendasar dalam produksi: <strong>konteks bisnis sama pentingnya dengan relevansi semantik, bahkan lebih.</strong></p>
<p>Sebuah situs e-commerce perlu memunculkan produk yang tersedia dari toko resmi terlebih dahulu. Sebuah platform konten ingin menyematkan pengumuman terbaru. Basis pengetahuan perusahaan membutuhkan dokumen otoritatif di bagian atas. Ketika peringkat hanya mengandalkan jarak vektor, aturan-aturan ini diabaikan. Hasilnya mungkin relevan, tetapi tidak tepat.</p>
<p><strong><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a></strong>, yang diperkenalkan pada <a href="https://milvus.io/intro">Milvus</a> 2.6, memecahkan masalah ini. Ini memungkinkan Anda menyesuaikan peringkat hasil pencarian menggunakan aturan metadata - tidak ada pembangunan ulang indeks, tidak ada perubahan model. Artikel ini membahas cara kerjanya, kapan menggunakannya, dan bagaimana mengimplementasikannya dengan kode.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">Apa itu Boost Ranker?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker adalah fitur perankingan ulang berbasis aturan yang ringan di Milvus 2.6.2</strong> yang menyesuaikan hasil <a href="https://zilliz.com/learn/vector-similarity-search">pencarian vektor</a> menggunakan bidang metadata skalar. Tidak seperti perangking berbasis model yang memanggil LLM eksternal atau layanan penyematan, Boost Ranker beroperasi sepenuhnya di dalam Milvus menggunakan aturan filter-dan-bobot yang sederhana. Tidak ada ketergantungan eksternal, overhead latensi minimal - cocok untuk penggunaan waktu nyata.</p>
<p>Anda mengonfigurasinya melalui <a href="https://milvus.io/docs/manage-functions.md">API Fungsi</a>. Setelah pencarian vektor mengembalikan sekumpulan kandidat, Boost Ranker menerapkan tiga operasi:</p>
<ol>
<li><strong>Filter:</strong> mengidentifikasi hasil yang sesuai dengan kondisi tertentu (misalnya, <code translate="no">is_official == true</code>)</li>
<li><strong>Boost:</strong> mengalikan skor mereka dengan bobot yang dikonfigurasi</li>
<li><strong>Kocok:</strong> secara opsional menambahkan faktor acak kecil (0-1) untuk memperkenalkan keragaman</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">Bagaimana Cara Kerjanya di Balik Layar</h3><p>Boost Ranker berjalan di dalam Milvus sebagai langkah pasca-pemrosesan:</p>
<ol>
<li><strong>Pencarian vektor</strong> - setiap segmen mengembalikan kandidat dengan ID, skor kemiripan, dan metadata.</li>
<li><strong>Menerapkan aturan</strong> - sistem menyaring catatan yang cocok dan menyesuaikan skor mereka menggunakan bobot yang dikonfigurasi dan <code translate="no">random_score</code> opsional.</li>
<li>Gabungkan<strong>dan urutkan</strong> - semua kandidat digabungkan dan diurutkan ulang berdasarkan skor yang diperbarui untuk menghasilkan hasil akhir Top-K.</li>
</ol>
<p>Karena Boost Ranker hanya beroperasi pada kandidat yang sudah diambil - bukan dataset lengkap - biaya komputasi tambahan dapat diabaikan.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">Kapan Anda Harus Menggunakan Boost Ranker?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">Meningkatkan Hasil Penting</h3><p>Kasus penggunaan yang paling umum: melapisi aturan bisnis sederhana di atas penelusuran semantik.</p>
<ul>
<li><strong>E-commerce:</strong> meningkatkan produk dari toko unggulan, penjual resmi, atau promosi berbayar. Dorong item dengan penjualan terbaru yang tinggi atau rasio klik-tayang yang lebih tinggi.</li>
<li><strong>Platform konten:</strong> memprioritaskan konten yang baru saja diterbitkan melalui bidang <code translate="no">publish_time</code>, atau meningkatkan postingan dari akun terverifikasi.</li>
<li><strong>Pencarian perusahaan:</strong> berikan prioritas yang lebih tinggi pada dokumen yang berisi <code translate="no">doctype == &quot;policy&quot;</code> atau <code translate="no">is_canonical == true</code>.</li>
</ul>
<p>Semua dapat dikonfigurasi dengan filter + bobot. Tidak ada perubahan model penyematan, tidak ada pembangunan ulang indeks.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">Menurunkan Peringkat Tanpa Menghapus</h3><p>Boost Ranker juga dapat menurunkan peringkat untuk hasil tertentu - alternatif yang lebih lembut daripada pemfilteran keras.</p>
<ul>
<li><strong>Produk dengan stok rendah:</strong> jika <code translate="no">stock &lt; 10</code>, kurangi sedikit bobotnya. Masih dapat ditemukan, tetapi tidak akan mendominasi posisi teratas.</li>
<li><strong>Konten sensitif:</strong> turunkan bobot konten yang ditandai alih-alih menghapusnya sepenuhnya. Membatasi eksposur tanpa sensor yang ketat.</li>
<li><strong>Dokumen basi:</strong> dokumen di mana <code translate="no">year &lt; 2020</code> mendapat peringkat lebih rendah sehingga konten yang lebih baru muncul lebih dulu.</li>
</ul>
<p>Pengguna masih dapat menemukan hasil yang diturunkan dengan menggulir atau mencari dengan lebih tepat, tetapi mereka tidak akan menyingkirkan konten yang lebih relevan.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">Menambahkan Keragaman dengan Keacakan Terkendali</h3><p>Ketika banyak hasil memiliki skor yang sama, Top-K dapat terlihat identik di seluruh kueri. Parameter <code translate="no">random_score</code> dari Boost Ranker memperkenalkan sedikit variasi:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: mengontrol keacakan secara keseluruhan untuk reproduktifitas</li>
<li><code translate="no">field</code>: biasanya kunci utama <code translate="no">id</code>, memastikan catatan yang sama mendapatkan nilai acak yang sama setiap kali</li>
</ul>
<p>Hal ini berguna untuk <strong>mendiversifikasi rekomendasi</strong> (mencegah item yang sama selalu muncul pertama kali) dan <strong>eksplorasi</strong> (menggabungkan bobot bisnis tetap dengan gangguan acak kecil).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Menggabungkan Boost Ranker dengan Pemeringkat Lain</h3><p>Boost Ranker diatur melalui API Fungsi dengan <code translate="no">params.reranker = &quot;boost&quot;</code>. Ada dua hal yang perlu diketahui tentang penggabungannya:</p>
<ul>
<li><strong>Batasan:</strong> dalam pencarian hybrid (multi-vektor), Boost Ranker tidak dapat menjadi perangking tingkat teratas. Tetapi dapat digunakan di dalam masing-masing <code translate="no">AnnSearchRequest</code> untuk menyesuaikan hasil sebelum digabungkan.</li>
<li><strong>Kombinasi umum:</strong><ul>
<li><strong>RRF + Boost:</strong> gunakan RRF untuk menggabungkan hasil multi-modal, lalu terapkan Boost untuk penyempurnaan berbasis metadata.</li>
<li>Pemeringkat<strong>model + Boost:</strong> gunakan pemeringkat berbasis model untuk kualitas semantik, lalu Boost untuk aturan bisnis.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">Cara Mengonfigurasi Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker dikonfigurasikan melalui API Fungsi. Untuk logika yang lebih kompleks, gabungkan dengan <code translate="no">FunctionScore</code> untuk menerapkan beberapa aturan secara bersamaan.</p>
<h3 id="Required-Fields" class="common-anchor-header">Bidang yang Diperlukan</h3><p>Saat membuat objek <code translate="no">Function</code>:</p>
<ul>
<li><code translate="no">name</code>: nama kustom apa pun</li>
<li><code translate="no">input_field_names</code>: harus berupa daftar kosong <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: disetel ke <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>: harus berupa <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">Parameter Kunci</h3><p><strong><code translate="no">params.weight</code> (wajib diisi)</strong></p>
<p>Pengali yang diterapkan pada skor catatan yang cocok. Cara Anda mengaturnya tergantung pada metrik:</p>
<table>
<thead>
<tr><th>Jenis Metrik</th><th>Untuk Meningkatkan Hasil</th><th>Untuk Menurunkan Hasil</th></tr>
</thead>
<tbody>
<tr><td>Lebih tinggi-lebih baik (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>Lebih rendah-lebih baik (L2/Euclidean)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (opsional)</strong></p>
<p>Kondisi yang memilih catatan mana yang akan disesuaikan nilainya:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>Hanya catatan yang cocok yang terpengaruh. Yang lainnya tetap mempertahankan skor aslinya.</p>
<p><strong><code translate="no">params.random_score</code> (opsional)</strong></p>
<p>Menambahkan nilai acak antara 0 dan 1 untuk keragaman. Lihat bagian keacakan di atas untuk detailnya.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">Aturan Tunggal vs. Aturan Berganda</h3><p><strong>Aturan tunggal</strong> - saat Anda memiliki satu batasan bisnis (misalnya, meningkatkan dokumen resmi), kirimkan pemeringkat secara langsung ke <code translate="no">search(..., ranker=ranker)</code>.</p>
<p><strong>Beberapa aturan</strong> - saat Anda memerlukan beberapa batasan (memprioritaskan item dalam stok + menurunkan produk berperingkat rendah + menambahkan keacakan), buat beberapa objek <code translate="no">Function</code> dan gabungkan dengan <code translate="no">FunctionScore</code>. Anda mengonfigurasi:</p>
<ul>
<li><code translate="no">boost_mode</code>: bagaimana setiap aturan digabungkan dengan skor asli (<code translate="no">multiply</code> atau <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>: bagaimana beberapa aturan digabungkan satu sama lain (<code translate="no">multiply</code> atau <code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">Praktik Langsung: Memprioritaskan Dokumen Resmi<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita lihat contoh konkret: membuat dokumen resmi mendapat peringkat lebih tinggi dalam sistem pencarian dokumen.</p>
<h3 id="Schema" class="common-anchor-header">Skema</h3><p>Sebuah koleksi bernama <code translate="no">milvus_collection</code> dengan bidang-bidang berikut ini:</p>
<table>
<thead>
<tr><th>Bidang</th><th>Jenis</th><th>Tujuan</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>Kunci utama</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>Teks dokumen</td></tr>
<tr><td><code translate="no">embedding</code></td><td>VEKTOR FLOAT (3072)</td><td>Vektor semantik</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>Asal: &quot;resmi&quot;, &quot;komunitas&quot;, atau &quot;tiket&quot;</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> jika <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>Bidang <code translate="no">source</code> dan <code translate="no">is_official</code> adalah metadata yang akan digunakan Boost Ranker untuk menyesuaikan peringkat.</p>
<h3 id="Setup-Code" class="common-anchor-header">Kode Pengaturan</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">Membandingkan Hasil: Dengan dan Tanpa Boost Ranker</h3><p>Pertama, jalankan pencarian dasar tanpa Boost Ranker. Kemudian tambahkan Boost Ranker dengan <code translate="no">filter: is_official == true</code> dan <code translate="no">weight: 1.2</code>, dan bandingkan.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">Hasil</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>Perubahan utama: dokumen <code translate="no">id=2</code> (resmi) melonjak dari peringkat ke-4 ke peringkat ke-2 karena skornya dikalikan 1,2. Postingan komunitas dan catatan tiket tidak dihapus - mereka hanya diberi peringkat lebih rendah. Itulah inti dari Boost Ranker: jadikan pencarian semantik sebagai fondasi, lalu tambahkan aturan bisnis di atasnya.</p>
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a> memberi Anda cara untuk menyuntikkan logika bisnis ke dalam hasil penelusuran vektor tanpa menyentuh sematan Anda atau membangun ulang indeks. Tingkatkan konten resmi, turunkan hasil yang sudah basi, tambahkan keragaman yang terkendali - semuanya melalui konfigurasi filter + bobot sederhana di <a href="https://milvus.io/docs/manage-functions.md">API Fungsi Milvus</a>.</p>
<p>Baik Anda sedang membangun pipeline RAG, sistem rekomendasi, atau penelusuran perusahaan, Boost Ranker membantu menjembatani kesenjangan antara apa yang secara semantik mirip dan apa yang benar-benar berguna bagi pengguna Anda.</p>
<p>Jika Anda bekerja pada peringkat pencarian dan ingin mendiskusikan kasus penggunaan Anda:</p>
<ul>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> untuk terhubung dengan pengembang lain yang membangun sistem pencarian dan pengambilan.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Jam Kantor Milvus gratis selama 20 menit</a> untuk membahas logika pemeringkatan Anda dengan tim.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (dikelola Milvus) memiliki tingkat gratis untuk memulai.</li>
</ul>
<hr>
<p>Beberapa pertanyaan yang muncul ketika tim mulai menggunakan Boost Ranker:</p>
<p><strong>Dapatkah Boost Ranker menggantikan perankingan berbasis model seperti Cohere atau BGE?</strong>Mereka memecahkan masalah yang berbeda. Reranker berbasis model memberi skor ulang hasil berdasarkan kualitas semantik - mereka pandai dalam memutuskan "dokumen mana yang benar-benar menjawab pertanyaan." Boost Ranker menyesuaikan skor dengan aturan bisnis - ia memutuskan "dokumen relevan mana yang harus muncul terlebih dahulu." Dalam praktiknya, Anda sering kali menginginkan keduanya: pemeringkat model untuk relevansi semantik, lalu Boost Ranker untuk logika bisnis di atasnya.</p>
<p><strong>Apakah Boost Ranker menambah latensi yang signifikan?</strong>Tidak.<strong>Boost R</strong>anker beroperasi pada kumpulan kandidat yang sudah diambil (biasanya Top-K dari pencarian vektor), bukan kumpulan data lengkap. Operasi yang dilakukan adalah filter-dan-kalikan sederhana, sehingga overhead dapat diabaikan dibandingkan dengan pencarian vektor itu sendiri.</p>
<p><strong>Bagaimana cara mengatur nilai bobot?</strong>Mulailah dengan penyesuaian kecil. Untuk kemiripan COSINE (lebih tinggi lebih baik), bobot 1,1-1,3 biasanya cukup untuk mengubah peringkat secara signifikan tanpa mengesampingkan relevansi semantik sepenuhnya. Uji dengan data aktual Anda - jika hasil yang ditingkatkan dengan kemiripan rendah mulai mendominasi, turunkan bobot.</p>
<p><strong>Dapatkah saya menggabungkan beberapa aturan Boost Ranker?</strong>Ya. Buat beberapa objek <code translate="no">Function</code> dan gabungkan menggunakan <code translate="no">FunctionScore</code>. Anda dapat mengontrol bagaimana aturan berinteraksi melalui <code translate="no">boost_mode</code> (bagaimana setiap aturan digabungkan dengan skor asli) dan <code translate="no">function_mode</code> (bagaimana aturan digabungkan satu sama lain) - keduanya mendukung <code translate="no">multiply</code> dan <code translate="no">add</code>.</p>
