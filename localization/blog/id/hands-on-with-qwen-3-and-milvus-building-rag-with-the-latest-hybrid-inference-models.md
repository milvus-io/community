---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: >-
  Praktik langsung dengan Qwen 3 dan Milvus: Membangun RAG dengan Model
  Inferensi Hibrida Terbaru
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Berbagi kemampuan utama model Qwen 3 dan memandu Anda melalui proses
  memasangkan Qwen 3 dengan Milvus untuk membangun sistem retrieval-augmented
  generation (RAG) lokal yang hemat biaya.
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sebagai pengembang yang selalu mencari alat bantu AI praktis, saya tidak dapat mengabaikan desas-desus seputar rilis terbaru Alibaba Cloud: rangkaian model<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3</a>, sebuah rangkaian delapan model inferensi hibrida yang kuat yang dirancang untuk mengubah keseimbangan antara kecerdasan dan efisiensi. Hanya dalam waktu 12 jam, proyek ini berhasil mengumpulkan <strong>lebih dari 17.000 bintang GitHub</strong> dan mencapai puncaknya dengan <strong>23.000 unduhan</strong> per jam di Hugging Face.</p>
<p>Jadi apa yang berbeda kali ini? Singkatnya, model Qwen 3 menggabungkan penalaran (respons yang lambat dan penuh pertimbangan) dan non-nalar (jawaban yang cepat dan efisien) dalam satu arsitektur tunggal, termasuk pilihan model yang beragam, pelatihan dan kinerja yang ditingkatkan, dan memberikan lebih banyak fitur yang siap untuk perusahaan.</p>
<p>Dalam tulisan ini, saya akan merangkum kemampuan utama model Qwen 3 yang harus Anda perhatikan dan memandu Anda melalui proses memasangkan Qwen 3 dengan Milvus untuk membangun sistem retrieval-augmented generation (RAG) yang hemat biaya-lengkap dengan kode praktis dan tips untuk mengoptimalkan kinerja versus latensi.</p>
<p>Mari kita selami.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">Apa yang Menarik dari Qwen 3?<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah menguji dan mempelajari Qwen 3, jelaslah bahwa ini bukan hanya tentang angka-angka yang lebih besar pada lembar spesifikasi. Ini tentang bagaimana pilihan desain model ini benar-benar membantu pengembang membangun aplikasi GenAI yang lebih baik - lebih cepat, lebih cerdas, dan dengan kontrol yang lebih besar. Inilah yang menonjol.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. Mode Berpikir Hibrida: Cerdas Saat Anda Membutuhkannya, Cepat Saat Anda Tidak Membutuhkannya</h3><p>Salah satu fitur paling inovatif di Qwen 3 adalah <strong>arsitektur inferensi hibridanya</strong>. Ini memberi Anda kontrol yang sangat baik atas seberapa banyak "pemikiran" yang dilakukan model berdasarkan tugas per tugas. Tidak semua tugas membutuhkan penalaran yang rumit.</p>
<ul>
<li><p>Untuk masalah kompleks yang membutuhkan analisis mendalam, Anda dapat memanfaatkan kekuatan penalaran penuh - meskipun lebih lambat.</p></li>
<li><p>Untuk pertanyaan sederhana sehari-hari, Anda dapat beralih ke mode yang lebih cepat dan lebih ringan.</p></li>
<li><p>Anda bahkan dapat mengatur <strong>"anggaran berpikir</strong> " - membatasi berapa banyak komputasi atau token yang dibakar dalam satu sesi.</p></li>
</ul>
<p>Ini juga bukan hanya fitur lab. Fitur ini secara langsung menangani trade-off yang dihadapi para pengembang setiap hari: memberikan respons berkualitas tinggi tanpa membebani biaya infrastruktur atau latensi pengguna.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. Jajaran Produk Serbaguna: Model MoE dan Model Padat untuk Kebutuhan yang Berbeda</h3><p>Qwen 3 menyediakan berbagai macam model yang dirancang untuk menyesuaikan dengan kebutuhan operasional yang berbeda:</p>
<ul>
<li><p><strong>Dua model MoE (Campuran Ahli)</strong>:</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 235 miliar total parameter, 22 miliar aktif per kueri</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 30 miliar total, 3 miliar aktif</p></li>
</ul></li>
<li><p><strong>Enam model Padat</strong>: mulai dari 0,6B yang lincah hingga parameter 32B yang besar</p></li>
</ul>
<p><em>Latar belakang teknologi yang cepat: Model padat (seperti GPT-3 atau BERT) selalu mengaktifkan semua parameter, membuatnya lebih berat tetapi terkadang lebih mudah diprediksi.</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>Model MoE</em></a> <em>hanya mengaktifkan sebagian kecil jaringan pada satu waktu, membuatnya jauh lebih efisien dalam skala besar</em>.</p>
<p>Dalam praktiknya, jajaran model serbaguna ini berarti Anda bisa:</p>
<ul>
<li><p>Menggunakan model padat untuk beban kerja yang ketat dan dapat diprediksi (seperti perangkat yang disematkan)</p></li>
<li><p>Menggunakan model MoE ketika Anda membutuhkan kemampuan kelas berat tanpa melelehkan tagihan cloud Anda</p></li>
</ul>
<p>Dengan rentang ini, Anda dapat menyesuaikan penerapan Anda - mulai dari pengaturan yang ringan dan siap pakai hingga penerapan skala cloud yang kuat - tanpa terkunci pada satu jenis model.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. Berfokus pada Efisiensi dan Penerapan di Dunia Nyata</h3><p>Alih-alih hanya berfokus pada ukuran model penskalaan, Qwen 3 berfokus pada efisiensi pelatihan dan kepraktisan penerapan:</p>
<ul>
<li><p><strong>Dilatih dengan 36 triliun token</strong> - dua kali lipat dari yang digunakan Qwen 2.5</p></li>
<li><p><strong>Diperluas hingga 235B parameter</strong> - tetapi dikelola dengan cerdas melalui teknik MoE, menyeimbangkan kemampuan dengan permintaan sumber daya.</p></li>
<li><p><strong>Dioptimalkan untuk penerapan</strong> - kuantisasi dinamis (turun dari FP4 ke INT8) memungkinkan Anda menjalankan model Qwen 3 terbesar sekalipun pada infrastruktur sederhana - misalnya, penerapan pada empat GPU H20.</p></li>
</ul>
<p>Tujuannya jelas: memberikan performa yang lebih kuat tanpa memerlukan investasi infrastruktur yang tidak proporsional.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. Dibangun untuk Integrasi Nyata: Dukungan MCP dan Kemampuan Multibahasa</h3><p>Qwen 3 dirancang dengan mempertimbangkan integrasi, bukan hanya performa model yang terisolasi:</p>
<ul>
<li><p><strong>Kompatibilitas MCP (Model Context Protocol)</strong> memungkinkan integrasi tanpa batas dengan database eksternal, API, dan alat, sehingga mengurangi biaya teknik untuk aplikasi yang kompleks.</p></li>
<li><p><strong>Qwen-Agent</strong> meningkatkan pemanggilan alat dan orkestrasi alur kerja, mendukung pembangunan sistem AI yang lebih dinamis dan dapat ditindaklanjuti.</p></li>
<li><p><strong>Dukungan multibahasa dalam 119 bahasa dan dialek</strong> menjadikan Qwen 3 pilihan yang kuat untuk aplikasi yang menargetkan pasar global dan multibahasa.</p></li>
</ul>
<p>Fitur-fitur ini secara kolektif memudahkan pengembang untuk membangun sistem tingkat produksi tanpa memerlukan rekayasa khusus yang ekstensif di sekitar model.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 Sekarang Didukung di DeepSearcher<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> adalah proyek sumber terbuka untuk pengambilan data mendalam dan pembuatan laporan, yang dirancang sebagai alternatif lokal pertama untuk OpenAI's Deep Research. Proyek ini membantu pengembang membangun sistem yang menampilkan informasi berkualitas tinggi dan sesuai konteks dari sumber data pribadi atau domain tertentu.</p>
<p>DeepSearcher kini mendukung arsitektur inferensi hibrida Qwen 3, yang memungkinkan pengembang untuk mengubah penalaran secara dinamis - menerapkan inferensi yang lebih dalam hanya jika itu menambah nilai, dan melewatkannya ketika kecepatan lebih penting.</p>
<p>Di baliknya, DeepSearcher terintegrasi dengan<a href="https://milvus.io"> Milvus</a>, database vektor berkinerja tinggi yang dikembangkan oleh para insinyur Zilliz, untuk menyediakan pencarian semantik yang cepat dan akurat melalui data lokal. Dikombinasikan dengan fleksibilitas model, hal ini memberikan kontrol yang lebih besar kepada pengembang atas perilaku sistem, biaya, dan pengalaman pengguna.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">Tutorial Praktis: Membangun Sistem RAG dengan Qwen 3 dan Milvus<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita terapkan model Qwen 3 ini dengan membangun sistem RAG menggunakan database vektor Milvus.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">Siapkan lingkungan.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>Catatan: Anda perlu mendapatkan API Key dari Alibaba Cloud.</p>
<h3 id="Data-Preparation" class="common-anchor-header">Persiapan Data</h3><p>Kita akan menggunakan halaman dokumentasi Milvus sebagai basis pengetahuan utama kita.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">Menyiapkan Model</h3><p>Kita akan menggunakan API yang kompatibel dengan OpenAI dari DashScope untuk mengakses Qwen 3:</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>Mari kita buat embedding uji coba dan cetak dimensi dan beberapa elemen pertamanya:</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Membuat Koleksi Milvus</h3><p>Mari kita siapkan basis data vektor Milvus kita:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Tentang pengaturan parameter MilvusClient:</p>
<ul>
<li><p>Mengatur URI ke berkas lokal (misalnya, <code translate="no">./milvus.db</code>) adalah metode yang paling mudah karena secara otomatis menggunakan Milvus Lite untuk menyimpan semua data dalam berkas tersebut.</p></li>
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
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">Membangun Sistem Kueri RAG</h3><p>Sekarang untuk bagian yang menarik - mari kita siapkan sistem RAG kita untuk menjawab pertanyaan.</p>
<p>Mari kita tentukan sebuah pertanyaan umum tentang Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Cari pertanyaan ini dalam koleksi dan ambil 3 hasil teratas yang cocok secara semantik:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Mari kita lihat hasil pencarian untuk pertanyaan ini:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no">[
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
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">Menggunakan LLM untuk Membangun Tanggapan RAG</h3><p>Ubah dokumen yang diambil ke format string:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Sediakan perintah sistem dan perintah pengguna untuk model bahasa yang besar:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>Gunakan model Qwen terbaru untuk menghasilkan respons berdasarkan prompt:</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>Keluaran:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">Membandingkan Mode Penalaran vs Mode Non-Penalaran: Tes Praktis<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Saya menjalankan tes yang membandingkan dua mode inferensi pada soal matematika:</p>
<p><strong>Soal:</strong> Orang A dan Orang B mulai berlari dari lokasi yang sama. A berangkat lebih dulu dan berlari selama 2 jam dengan kecepatan 5 km/jam. B menyusul dengan kecepatan 15 km/jam. Berapa lama waktu yang dibutuhkan B untuk menyusul?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Dengan mode penalaran diaktifkan:</strong></p>
<ul>
<li><p>Waktu pemrosesan: ~74,83 detik</p></li>
<li><p>Analisis mendalam, penguraian masalah, beberapa jalur solusi</p></li>
<li><p>Output penurunan harga berkualitas tinggi dengan rumus</p></li>
</ul>
<p>(Gambar di bawah ini adalah tangkapan layar dari visualisasi respons penurunan nilai model, untuk kenyamanan pembaca)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Mode Non-Penalaran:</strong></p>
<p>Di dalam kode, Anda hanya perlu mengatur <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>Hasil dari mode non-reasoning pada masalah ini:</p>
<ul>
<li>Waktu pemrosesan: ~74,83 detik</li>
<li>Analisis mendalam, penguraian masalah, beberapa jalur solusi</li>
<li>Output penurunan harga berkualitas tinggi dengan rumus</li>
</ul>
<p>(Gambar di bawah ini adalah tangkapan layar dari visualisasi respons penurunan nilai model, untuk kenyamanan pembaca)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Qwen 3 memperkenalkan arsitektur model yang fleksibel yang selaras dengan kebutuhan dunia nyata pengembangan GenAI. Dengan berbagai ukuran model (termasuk varian padat dan MoE), mode inferensi hibrida, integrasi MCP, dan dukungan multibahasa, ini memberi pengembang lebih banyak pilihan untuk menyesuaikan kinerja, latensi, dan biaya, tergantung pada kasus penggunaan.</p>
<p>Daripada menekankan pada skala saja, Qwen 3 berfokus pada kemampuan beradaptasi. Hal ini menjadikannya pilihan praktis untuk membangun pipeline RAG, <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">agen AI</a>, dan aplikasi produksi yang membutuhkan kemampuan penalaran dan operasi yang hemat biaya.</p>
<p>Ketika dipasangkan dengan infrastruktur seperti<a href="https://milvus.io"> Milvus</a> - basis data vektor sumber terbuka berkinerja tinggi - kemampuan Qwen 3 menjadi semakin berguna, memungkinkan pencarian semantik yang cepat dan integrasi yang lancar dengan sistem data lokal. Bersama-sama, keduanya menawarkan fondasi yang kuat untuk aplikasi GenAI yang cerdas dan responsif dalam skala besar.</p>
