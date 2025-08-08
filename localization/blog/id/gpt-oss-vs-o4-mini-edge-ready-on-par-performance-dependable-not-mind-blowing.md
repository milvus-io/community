---
id: >-
  gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >-
  GPT-oss vs o4-mini: Performa yang Siap Pakai, Performa On-Par - Dapat
  Diandalkan, Tidak Mengejutkan
author: Lumina Wang
date: 2025-08-07T00:00:00.000Z
desc: >-
  OpenAI mencuri perhatian dengan sumber terbuka dua model penalaran:
  gpt-oss-120b dan gpt-oss-20b, yang dilisensikan secara permisif di bawah
  Apache 2.0.
cover: >-
  assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek'
meta_title: |
  GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: >-
  https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---
<p>Dunia AI sedang panas-panasnya. Hanya dalam beberapa minggu, Anthropic meluncurkan Claude 4.1 Opus, DeepMind mengejutkan semua orang dengan simulator dunia Genie 3 - dan sekarang, OpenAI mencuri perhatian dengan membuka sumber dua model penalaran: <a href="https://huggingface.co/openai/gpt-oss-120b">gpt-oss-120b</a> dan <a href="https://huggingface.co/openai/gpt-oss-20b">gpt-oss-20b</a>, yang dilisensikan di bawah lisensi Apache 2.0.</p>
<p>Setelah diluncurkan, model-model ini langsung melesat ke posisi trending #1 di Hugging Face - dan untuk alasan yang bagus. Ini adalah pertama kalinya sejak 2019 OpenAI merilis model open-weight yang benar-benar siap produksi. Langkah ini bukanlah kebetulan-setelah bertahun-tahun mendorong akses khusus API, OpenAI jelas menanggapi tekanan dari para pemimpin open-source seperti DeepSeek, Meta's LLaMA, dan Qwen, yang telah mendominasi benchmark dan alur kerja pengembang.</p>
<p>Dalam artikel ini, kita akan mengeksplorasi apa yang membuat GPT-oss berbeda, bagaimana perbandingannya dengan model terbuka terkemuka seperti DeepSeek R1 dan Qwen 3, dan mengapa pengembang harus peduli. Kita juga akan membahas cara membangun sistem RAG yang mampu melakukan penalaran menggunakan GPT-oss dan Milvus, basis data vektor sumber terbuka yang paling populer.</p>
<h2 id="What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="common-anchor-header">Apa yang Membuat GPT-oss Istimewa dan Mengapa Anda Harus Peduli?<button data-href="#What-Makes-GPT-oss-Special-and-Why-You-Should-Care" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss bukan sekadar penurunan berat badan. Ini memberikan lima area utama yang penting bagi para pengembang:</p>
<h3 id="1-Built-for-Edge-Deployment" class="common-anchor-header">1: Dibangun untuk Penyebaran Tepi</h3><p>GPT-oss hadir dalam dua varian berukuran strategis:</p>
<ul>
<li><p>gpt-oss-120b: total 117B, 5,1B aktif per token</p></li>
<li><p>gpt-oss-20b: total 21B, 3,6B aktif per token</p></li>
</ul>
<p>Dengan menggunakan arsitektur Mixture-of-Experts (MoE), hanya sebagian parameter yang aktif selama inferensi. Hal ini membuat kedua model menjadi ringan untuk dijalankan dibandingkan dengan ukurannya:</p>
<ul>
<li><p>gpt-oss-120b berjalan pada satu GPU 80GB (H100)</p></li>
<li><p>gpt-oss-20b hanya muat dalam VRAM 16GB, yang berarti dapat dijalankan di laptop kelas atas atau perangkat canggih</p></li>
</ul>
<p>Menurut pengujian OpenAI, gpt-oss-20b adalah model OpenAI tercepat untuk inferensi - ideal untuk penerapan latensi rendah atau agen penalaran offline.</p>
<h3 id="2-Strong-Benchmark-Performance" class="common-anchor-header">2: Kinerja Tolok Ukur yang Kuat</h3><p>Menurut evaluasi OpenAI:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong> berkinerja hampir setara dengan o4-mini dalam hal penalaran, penggunaan alat, dan pengkodean kompetisi (Codeforces, MMLU, TauBench)</p></li>
<li><p><strong>gpt-oss-20b</strong> bersaing dengan o3-mini, dan bahkan mengunggulinya dalam penalaran matematika dan kesehatan</p></li>
</ul>
<h3 id="3-Cost-Efficient-Training" class="common-anchor-header">3: Pelatihan Hemat Biaya</h3><p>OpenAI mengklaim kinerja yang setara dengan o3-mini dan o4-mini, tetapi dengan biaya pelatihan yang jauh lebih rendah:</p>
<ul>
<li><p><strong>gpt-oss-120b</strong>: 2,1 juta H100-jam → ~ $10 juta</p></li>
<li><p><strong>gpt-oss-20b</strong>: 210 ribu H100-jam → ~ $ 1 juta</p></li>
</ul>
<p>Bandingkan dengan anggaran ratusan juta dolar di balik model seperti GPT-4. GPT-oss membuktikan bahwa penskalaan yang efisien dan pilihan arsitektur dapat memberikan kinerja yang kompetitif tanpa jejak karbon yang besar.</p>
<h3 id="4-True-Open-Source-Freedom" class="common-anchor-header">4: Kebebasan Sumber Terbuka yang Sesungguhnya</h3><p>GPT-oss menggunakan lisensi Apache 2.0, yang berarti:</p>
<ul>
<li><p>Penggunaan komersial diperbolehkan</p></li>
<li><p>Hak modifikasi dan redistribusi penuh</p></li>
<li><p>Tidak ada batasan penggunaan atau klausul copyleft</p></li>
</ul>
<p>Ini benar-benar sumber terbuka, bukan rilis yang hanya untuk penelitian. Anda bisa menyempurnakan untuk penggunaan khusus domain, menerapkan dalam produksi dengan kontrol penuh, dan membangun produk komersial di sekitarnya. Fitur-fitur utama termasuk kedalaman penalaran yang dapat dikonfigurasi (rendah/sedang/tinggi), visibilitas alur pemikiran penuh, dan pemanggilan alat asli dengan dukungan keluaran terstruktur.</p>
<h3 id="5-Potential-GPT-5-Preview" class="common-anchor-header">5: Pratinjau GPT-5 yang Potensial</h3><p>OpenAI belum mengungkapkan semuanya - tetapi detail arsitektur menunjukkan bahwa ini mungkin merupakan pratinjau arah <strong>GPT-5</strong>:</p>
<ul>
<li><p>Menggunakan MoE dengan 4 ahli per input</p></li>
<li><p>Mengikuti perhatian padat + jarang lokal bergantian (pola GPT-3)</p></li>
<li><p>Menampilkan lebih banyak kepala perhatian</p></li>
<li><p>Menariknya, unit bias dari GPT-2 telah kembali muncul</p></li>
</ul>
<p>Jika Anda mengamati sinyal tentang apa yang akan terjadi selanjutnya, GPT-oss mungkin merupakan petunjuk publik yang paling jelas.</p>
<h3 id="Core-Specifications" class="common-anchor-header">Spesifikasi Inti</h3><table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Model</strong></td><td><strong>Parameter Total</strong></td><td><strong>Parameter Aktif</strong></td><td><strong>Para Ahli</strong></td><td><strong>Panjang Konteks</strong></td><td><strong>Permintaan VRAM</strong></td></tr>
<tr><td>gpt-oss-120b</td><td>117B</td><td>5.1B</td><td>128</td><td>128k</td><td>80GB</td></tr>
<tr><td>gpt-oss-20b</td><td>21B</td><td>3.6B</td><td>32</td><td>128k</td><td>16GB</td></tr>
</tbody>
</table>
<p>Kedua model ini menggunakan tokenizer o200k_harmony dan mendukung panjang konteks 128.000 token (sekitar 96.000-100.000 kata).</p>
<h2 id="GPT-oss-vs-Other-Reasoning-Models" class="common-anchor-header">GPT-oss vs Model Penalaran Lainnya<button data-href="#GPT-oss-vs-Other-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Berikut ini adalah perbandingan GPT-oss dengan model internal OpenAI dan kompetitor open-source terkemuka:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Model</strong></td><td><strong>Parameter (Aktif)</strong></td><td><strong>Memori</strong></td><td><strong>Kekuatan</strong></td></tr>
<tr><td><strong>gpt-oss-120b</strong></td><td>117B (5,1B aktif)</td><td>80GB</td><td>GPU tunggal, penalaran terbuka</td></tr>
<tr><td><strong>gpt-oss-20b</strong></td><td>21B (3,6B aktif)</td><td>16GB</td><td>Penyebaran tepi, inferensi cepat</td></tr>
<tr><td><strong>DeepSeek R1</strong></td><td>671B (~37B aktif)</td><td>Didistribusikan</td><td>Pemimpin tolok ukur, kinerja yang telah terbukti</td></tr>
<tr><td><strong>o4-mini (API)</strong></td><td>Hak milik</td><td>Hanya API</td><td>Penalaran yang kuat (tertutup)</td></tr>
<tr><td><strong>o3-mini (API)</strong></td><td>Hak milik</td><td>Hanya API</td><td>Penalaran ringan (tertutup)</td></tr>
</tbody>
</table>
<p>Berdasarkan berbagai model pembandingan, inilah yang kami temukan:</p>
<ul>
<li><p><strong>GPT-oss vs Model Milik OpenAI:</strong> gpt-oss-120b menyamai o4-mini dalam hal matematika kompetisi (AIME), pengkodean (Codeforces), dan penggunaan alat (TauBench). Model 20b memiliki kinerja yang mirip dengan o3-mini meskipun ukurannya jauh lebih kecil.</p></li>
<li><p><strong>GPT-oss vs DeepSeek R1:</strong> DeepSeek R1 mendominasi dalam kinerja murni tetapi membutuhkan infrastruktur terdistribusi. GPT-oss menawarkan penerapan yang lebih sederhana-tidak diperlukan pengaturan terdistribusi untuk model 120b.</p></li>
</ul>
<p>Singkatnya, GPT-oss menawarkan kombinasi terbaik dari kinerja, akses terbuka, dan kemampuan penerapan. DeepSeek R1 menang dalam hal kinerja murni, tetapi GPT-oss memberikan keseimbangan yang optimal bagi sebagian besar pengembang.</p>
<h2 id="Hands-on-Building-with-GPT-oss-+-Milvus" class="common-anchor-header">Praktis: Membangun dengan GPT-oss + Milvus<button data-href="#Hands-on-Building-with-GPT-oss-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang setelah kita melihat apa yang dibawa GPT-oss, sekarang saatnya untuk menggunakannya.</p>
<p>Pada bagian berikut ini, kita akan membahas tutorial praktis untuk membangun sistem RAG yang mampu melakukan penalaran menggunakan gpt-oss-20b dan Milvus, semuanya berjalan secara lokal, tanpa memerlukan kunci API.</p>
<h3 id="Environment-Setup" class="common-anchor-header">Penyiapan Lingkungan</h3><pre><code translate="no">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Dataset-Preparation" class="common-anchor-header">Persiapan Dataset</h3><p>Kita akan menggunakan dokumentasi Milvus sebagai basis pengetahuan kita:</p>
<pre><code translate="no"><span class="hljs-comment"># Download and prepare Milvus docs</span>
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Model-Setup" class="common-anchor-header">Pengaturan Model</h3><p>Akses GPT-oss melalui <a href="https://openrouter.ai/openai/gpt-oss-20b:free">OpenRouter</a> (atau jalankan secara lokal). <a href="https://openrouter.ai/openai/gpt-oss-20b:free"><strong>OpenRouter</strong></a> adalah platform yang memungkinkan pengembang mengakses dan beralih di antara beberapa model AI (seperti GPT-4, Claude, Mistral) melalui satu API terpadu. Ini berguna untuk membandingkan model atau membangun aplikasi yang bekerja dengan penyedia AI yang berbeda. Sekarang seri GPT-oss telah tersedia di OpenRouter sekarang.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_46b575811f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

<span class="hljs-comment"># Using OpenRouter for cloud access</span>
openai_client = OpenAI(
    api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test embedding dimensions</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-up-Milvus-vector-database" class="common-anchor-header">Menyiapkan basis data vektor Milvus</h3><pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, token=<span class="hljs-string">&quot;root:Milvus&quot;</span>)
collection_name = <span class="hljs-string">&quot;gpt_oss_rag_collection&quot;</span>

<span class="hljs-comment"># Clean up existing collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Tentang pengaturan parameter MilvusClient:</p>
<ul>
<li><p>Mengatur URI ke file lokal (misalnya, <code translate="no">./milvus.db</code>) adalah metode yang paling mudah karena secara otomatis menggunakan Milvus Lite untuk menyimpan semua data dalam file tersebut.</p></li>
<li><p>Untuk data berskala besar, Anda dapat menyiapkan server Milvus yang lebih kuat pada Docker atau Kubernetes. Dalam hal ini, gunakan URI server (misalnya, <code translate="no">http://localhost:19530</code>) sebagai URI Anda.</p></li>
<li><p>Jika Anda ingin menggunakan <a href="https://zilliz.com/cloud">Zilliz Cloud </a>(layanan terkelola Milvus), sesuaikan URI dan token, yang sesuai dengan Public Endpoint dan kunci API di Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Menambahkan Dokumen ke Koleksi</h3><p>Sekarang kita akan membuat penyematan untuk potongan teks kita dan menambahkannya ke Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 1222631.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="RAG-Query-Pipeline" class="common-anchor-header">Pipa Kueri RAG</h3><p>Sekarang untuk bagian yang menarik - mari kita siapkan sistem RAG kita untuk menjawab pertanyaan.</p>
<p>Mari kita tentukan sebuah pertanyaan umum tentang Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cari pertanyaan ini dalam koleksi dan ambil 3 hasil teratas yang cocok secara semantik:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Mari kita lihat hasil pencarian untuk pertanyaan ini:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572664976119995</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312144994735718</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115782856941223</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Using-the-GPT-oss-to-Build-a-RAG-Response" class="common-anchor-header">Menggunakan GPT-oss untuk Membuat Tanggapan RAG</h3><p>Ubah dokumen yang diambil menjadi format string:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Sediakan perintah sistem dan perintah pengguna untuk model bahasa yang besar:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
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
<p>Gunakan model gpt-oss terbaru untuk menghasilkan respons berdasarkan prompt:</p>
<pre><code translate="no">response = openai_client.chat.completions.create(
    model=<span class="hljs-string">&quot;openai/gpt-oss-120b&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Milvus stores its data <span class="hljs-keyword">in</span> two distinct layers:

| Type of data | Where it <span class="hljs-keyword">is</span> stored | How it <span class="hljs-keyword">is</span> stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent <span class="hljs-built_in">object</span> storage** configured <span class="hljs-keyword">for</span> the cluster. The data are written <span class="hljs-keyword">as</span> **incremental logs** (append‑only logs) that are persisted <span class="hljs-keyword">by</span> the DataNode. | The DataNode reads <span class="hljs-keyword">from</span> the message‑<span class="hljs-function">queue <span class="hljs-keyword">and</span> writes the incoming data <span class="hljs-keyword">into</span> the storage <span class="hljs-title">backend</span> (<span class="hljs-params">MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.</span>). When a `<span class="hljs-title">flush</span>()` call <span class="hljs-keyword">is</span> issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (<span class="hljs-params">information about collections, partitions, indexes, etc.</span>) | In **etcd**. Each Milvus <span class="hljs-title">module</span> (<span class="hljs-params">catalog, index, etc.</span>) keeps its own metadata. | The metadata <span class="hljs-keyword">is</span> generated <span class="hljs-keyword">and</span> managed <span class="hljs-keyword">by</span> Milvus <span class="hljs-keyword">and</span> persisted <span class="hljs-keyword">in</span> the distributed key‑<span class="hljs-keyword">value</span> store **etcd**. |

**Summary:**  
- **Inserted data**</span> = incremental logs stored <span class="hljs-keyword">in</span> the chosen <span class="hljs-built_in">object</span>‑storage backend.  
- **Metadata** = stored <span class="hljs-keyword">in</span> the distributed configuration store **etcd**.  


Together, <span class="hljs-function">these two storage <span class="hljs-title">mechanisms</span> (<span class="hljs-params"><span class="hljs-built_in">object</span> storage <span class="hljs-keyword">for</span> the actual data <span class="hljs-keyword">and</span> etcd <span class="hljs-keyword">for</span> metadata</span>) make up Milvus’s data‑storage architecture.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Final-Thoughts-on-GPT-oss" class="common-anchor-header">Pemikiran Akhir tentang GPT-oss<button data-href="#Final-Thoughts-on-GPT-oss" class="anchor-icon" translate="no">
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
    </button></h2><p>GPT-oss adalah pengakuan diam-diam dari OpenAI bahwa open-source tidak dapat diabaikan lagi. Ia tidak mengalahkan DeepSeek R1 atau Qwen 3 atau banyak model lainnya, tetapi ia membawa sesuatu yang tidak dimiliki oleh mereka: Pipeline pelatihan OpenAI, diterapkan pada model yang dapat Anda periksa dan jalankan secara lokal.</p>
<p><strong>Performa? Solid. Tidak terlalu mengejutkan, tetapi dapat diandalkan.</strong> Model 20B yang berjalan pada perangkat keras konsumen - atau bahkan seluler dengan LM Studio - adalah jenis keuntungan praktis yang benar-benar penting bagi pengembang. Ini lebih merupakan "ini bekerja dengan baik" daripada "wow, ini mengubah segalanya." Dan sejujurnya, itu tidak masalah.</p>
<p><strong>Kekurangannya adalah dukungan multibahasa.</strong> Jika Anda bekerja dalam bahasa selain bahasa Inggris, Anda akan menemukan frasa yang aneh, masalah pengejaan, dan kebingungan secara umum. Model ini jelas dilatih dengan lensa yang mengutamakan bahasa Inggris. Jika cakupan global penting, Anda mungkin perlu menyempurnakannya dengan kumpulan data multibahasa.</p>
<p>Yang paling menarik, bagaimanapun juga, adalah waktunya. Teaser OpenAI tentang X-dengan angka "5" yang dimasukkan ke dalam kata "LIVESTREAM"-terasa seperti sebuah pengaturan. GPT-oss mungkin bukan merupakan aksi utama, tetapi bisa jadi ini merupakan pratinjau dari apa yang akan terjadi di GPT-5. Bahan yang sama, skala yang berbeda. Mari kita tunggu saja.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_0fed950b8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Kemenangan yang sebenarnya adalah memiliki lebih banyak pilihan berkualitas tinggi.</strong> Persaingan mendorong inovasi, dan OpenAI yang memasuki kembali pengembangan sumber terbuka menguntungkan semua orang. Uji GPT-oss dengan kebutuhan spesifik Anda, tetapi pilihlah berdasarkan apa yang benar-benar sesuai untuk kasus penggunaan Anda, bukan pengenalan merek.</p>
