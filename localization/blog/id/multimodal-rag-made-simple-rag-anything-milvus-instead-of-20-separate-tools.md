---
id: multimodal-rag-made-simple-rag-anything-milvus-instead-of-20-separate-tools.md
title: >-
  RAG Multimodal Menjadi Sederhana: RAG-Apa Saja + Milvus, Bukan 20 Alat
  Terpisah
author: Min Yin
date: 2025-11-25T00:00:00.000Z
cover: assets.zilliz.com/rag_anything_cover_6b4e9bc6c0.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RAG-Anything, Multimodal RAG, Vector Database'
meta_title: RAG-Anything and Milvus for Multimodal RAG Systems
desc: >-
  Lihat bagaimana RAG-Anything dan Milvus memungkinkan RAG multimodal di seluruh
  teks, gambar, dan data terstruktur-dan apa yang akan terjadi selanjutnya untuk
  pencarian-Augmented AI.
origin: >-
  https://milvus.io/blog/multimodal-rag-made-simple-rag-anything-milvus-instead-of-20-separate-tools.md
---
<p>Membangun sistem RAG multimodal biasanya berarti menggabungkan selusin alat khusus-satu untuk OCR, satu untuk tabel, satu untuk rumus matematika, satu untuk penyematan, satu untuk pencarian, dan seterusnya. Pipeline RAG tradisional dirancang untuk teks, dan ketika dokumen mulai menyertakan gambar, tabel, persamaan, bagan, dan konten terstruktur lainnya, rantai alat dengan cepat menjadi berantakan dan tidak terkelola.</p>
<p><a href="https://github.com/HKUDS/RAG-Anything"><strong>RAG-Anything</strong></a>, yang dikembangkan oleh HKU, mengubahnya. Dibangun di atas LightRAG, RAG-Anything menyediakan platform All-in-One yang dapat mengurai beragam jenis konten secara paralel dan memetakannya ke dalam grafik pengetahuan terpadu. Tetapi menyatukan pipeline hanya setengah dari cerita. Untuk mengambil bukti di seluruh modalitas yang bervariasi ini, Anda masih membutuhkan pencarian vektor yang cepat dan terukur yang dapat menangani banyak jenis penyematan sekaligus. Di sinilah <a href="https://milvus.io/"><strong>Milvus</strong></a> hadir. Sebagai basis data vektor sumber terbuka dan berkinerja tinggi, Milvus menghilangkan kebutuhan akan beberapa solusi penyimpanan dan pencarian. Milvus mendukung pencarian ANN skala besar, pengambilan kata kunci vektor hibrida, pemfilteran metadata, dan manajemen penyematan yang fleksibel-semuanya di satu tempat.</p>
<p>Dalam tulisan ini, kami akan menguraikan bagaimana RAG-Anything dan Milvus bekerja sama untuk menggantikan toolchain multimodal yang terfragmentasi dengan tumpukan yang bersih dan terpadu - dan kami akan menunjukkan bagaimana Anda dapat membangun sistem tanya jawab RAG multimodal yang praktis hanya dengan beberapa langkah.</p>
<h2 id="What-Is-RAG-Anything-and-How-It-Works" class="common-anchor-header">Apa Itu RAG-Anything dan Cara Kerjanya<button data-href="#What-Is-RAG-Anything-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/HKUDS/RAG-Anything">RAG-Anything</a> adalah kerangka kerja RAG yang dirancang untuk mendobrak batasan sistem tradisional yang hanya berupa teks. Alih-alih bergantung pada beberapa alat khusus, RAG-Anything menawarkan satu lingkungan terpadu yang dapat mengurai, memproses, dan mengambil informasi di berbagai jenis konten.</p>
<p>Kerangka kerja ini mendukung dokumen yang berisi teks, diagram, tabel, dan ekspresi matematis, sehingga memungkinkan pengguna untuk melakukan kueri di semua modalitas melalui satu antarmuka yang kohesif. Hal ini membuatnya sangat berguna dalam bidang-bidang seperti penelitian akademis, pelaporan keuangan, dan manajemen pengetahuan perusahaan, di mana materi multimodal adalah hal yang umum.</p>
<p>Pada intinya, RAG-Anything dibangun di atas pipeline multimodal multitahap: penguraian dokumen → analisis konten → grafik pengetahuan → pengambilan cerdas. Arsitektur ini memungkinkan orkestrasi cerdas dan pemahaman lintas-modal, sehingga sistem dapat menangani beragam modalitas konten dengan lancar dalam satu alur kerja yang terintegrasi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_anything_framework_d3513593a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-1-+-3-+-N-Architecture" class="common-anchor-header">Arsitektur "1 + 3 + N"</h3><p>Pada tingkat teknik, kemampuan RAG-Anything diwujudkan melalui arsitektur "1 + 3 + N":</p>
<p><strong>Mesin Inti</strong></p>
<p>Inti dari RAG-Anything adalah mesin grafik pengetahuan yang terinspirasi oleh <a href="https://github.com/HKUDS/LightRAG">LightRAG</a>. Unit inti ini bertanggung jawab untuk ekstraksi entitas multimodal, pemetaan hubungan lintas modal, dan penyimpanan semantik vektor. Tidak seperti sistem RAG yang hanya menggunakan teks, mesin ini memahami entitas dari teks, objek visual di dalam gambar, dan struktur relasional yang tertanam di dalam tabel.</p>
<p><strong>3 Prosesor Modal</strong></p>
<p>RAG-Anything mengintegrasikan tiga prosesor modalitas khusus yang dirancang untuk pemahaman yang mendalam dan spesifik terhadap modalitas. Bersama-sama, mereka membentuk lapisan analisis multimodal sistem.</p>
<ul>
<li><p><strong>ImageModalProcessor</strong> menafsirkan konten visual dan makna kontekstualnya.</p></li>
<li><p><strong>TableModalProcessor</strong> mengurai struktur tabel dan menerjemahkan hubungan logis dan numerik dalam data.</p></li>
<li><p><strong>EquationModalProcessor</strong> memahami semantik di balik simbol dan rumus matematika.</p></li>
</ul>
<p><strong>Pengurai N</strong></p>
<p>Untuk mendukung beragam struktur dokumen dunia nyata, RAG-Anything menyediakan lapisan penguraian yang dapat diperluas yang dibangun di atas beberapa mesin ekstraksi. Saat ini, RAG-Anything mengintegrasikan MinerU dan Docling, yang secara otomatis memilih pengurai yang optimal berdasarkan jenis dokumen dan kompleksitas struktural.</p>
<p>Dibangun di atas arsitektur "1 + 3 + N", RAG-Anything meningkatkan pipeline RAG tradisional dengan mengubah cara penanganan jenis konten yang berbeda. Alih-alih memproses teks, gambar, dan tabel satu per satu, sistem memproses semuanya sekaligus.</p>
<pre><code translate="no"><span class="hljs-comment"># The core configuration demonstrates the parallel processing design</span>
config = RAGAnythingConfig(
    working_dir=<span class="hljs-string">&quot;./rag_storage&quot;</span>,
    parser=<span class="hljs-string">&quot;mineru&quot;</span>,
    parse_method=<span class="hljs-string">&quot;auto&quot;</span>,  <span class="hljs-comment"># Automatically selects the optimal parsing strategy</span>
    enable_image_processing=<span class="hljs-literal">True</span>,
    enable_table_processing=<span class="hljs-literal">True</span>, 
    enable_equation_processing=<span class="hljs-literal">True</span>,
    max_workers=<span class="hljs-number">8</span>  <span class="hljs-comment"># Supports multi-threaded parallel processing</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Desain ini sangat mempercepat penanganan dokumen teknis yang besar. Tes benchmark menunjukkan bahwa ketika sistem menggunakan lebih banyak inti CPU, sistem menjadi lebih cepat, yang secara tajam mengurangi waktu yang dibutuhkan untuk memproses setiap dokumen.</p>
<h3 id="Layered-Storage-and-Retrieval-Optimization" class="common-anchor-header">Penyimpanan Berlapis dan Optimalisasi Pengambilan</h3><p>Selain desain multimodalnya, RAG-Anything juga menggunakan pendekatan penyimpanan dan pengambilan berlapis untuk membuat hasil yang lebih akurat dan efisien.</p>
<ul>
<li><p><strong>Teks</strong> disimpan dalam basis data vektor tradisional.</p></li>
<li><p><strong>Gambar</strong> dikelola dalam penyimpanan fitur visual yang terpisah.</p></li>
<li><p><strong>Tabel</strong> disimpan dalam penyimpanan data terstruktur.</p></li>
<li><p><strong>Rumus matematika</strong> diubah menjadi vektor semantik.</p></li>
</ul>
<p>Dengan menyimpan setiap jenis konten dalam format yang sesuai, sistem dapat memilih metode pencarian terbaik untuk setiap modalitas daripada mengandalkan pencarian kesamaan umum. Hal ini menghasilkan hasil yang lebih cepat dan lebih dapat diandalkan di berbagai jenis konten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/layered_storage_c9441feff1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Milvus-Fits-into-RAG-Anything" class="common-anchor-header">Bagaimana Milvus Cocok dengan RAG-Anything<button data-href="#How-Milvus-Fits-into-RAG-Anything" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG-Anything menyediakan pencarian multimodal yang kuat, tetapi untuk melakukannya dengan baik diperlukan pencarian vektor yang cepat dan terukur di semua jenis penyematan. <a href="https://milvus.io/">Milvus</a> mengisi peran ini dengan sempurna.</p>
<p>Dengan arsitektur cloud-native dan pemisahan komputasi-penyimpanan, Milvus memberikan skalabilitas tinggi dan efisiensi biaya. Milvus mendukung pemisahan baca-tulis dan penyatuan stream-batch, sehingga sistem dapat menangani beban kerja dengan konkurensi tinggi sambil mempertahankan kinerja kueri waktu-nyata - data baru dapat dicari segera setelah dimasukkan.</p>
<p>Milvus juga memastikan keandalan tingkat perusahaan melalui desain terdistribusi dan toleran terhadap kesalahan, yang menjaga sistem tetap stabil meskipun ada node yang gagal. Hal ini membuatnya sangat cocok untuk penerapan RAG multimodal tingkat produksi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_ab54d5e798.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Build-a-Multimodal-QA-System-with-RAG-Anything-and-Milvus" class="common-anchor-header">Cara Membangun Sistem Tanya Jawab Multimodal dengan RAG-Anything dan Milvus<button data-href="#How-to-Build-a-Multimodal-QA-System-with-RAG-Anything-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Demo ini menunjukkan cara membangun sistem tanya jawab multimodal menggunakan kerangka kerja RAG-Anything, basis data vektor Milvus, dan model penyematan TongYi. (Contoh ini berfokus pada kode implementasi inti dan bukan merupakan penyiapan produksi penuh).</p>
<h3 id="Hands-on-Demo" class="common-anchor-header">Demo Langsung</h3><p><strong>Prasyarat: Persyaratan</strong></p>
<ul>
<li><p><strong>Python:</strong> 3.10 atau lebih tinggi</p></li>
<li><p><strong>Basis Data Vektor:</strong> Layanan Milvus (Milvus Lite)</p></li>
<li><p><strong>Layanan Cloud:</strong> Kunci API Alibaba Cloud (untuk LLM dan layanan penyematan)</p></li>
<li><p><strong>Model LLM:</strong> <code translate="no">qwen-vl-max</code> (model yang mendukung visi)</p></li>
</ul>
<p><strong>Model Penyematan</strong>: <code translate="no">tongyi-embedding-vision-plus</code></p>
<pre><code translate="no">- python -m venv .venv &amp;&amp; <span class="hljs-built_in">source</span> .venv/bin/activate  <span class="hljs-comment"># For Windows users:  .venvScriptsactivate</span>
- pip install -r requirements-min.txt
- <span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment">#add DASHSCOPE_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Jalankan contoh kerja minimal:</strong></p>
<pre><code translate="no">python minimal_[main.py](&lt;http:<span class="hljs-comment">//main.py&gt;)</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Keluaran yang diharapkan:</strong></p>
<p>Setelah skrip berhasil dijalankan, terminal akan ditampilkan:</p>
<ul>
<li><p>Hasil Tanya Jawab berbasis teks yang dihasilkan oleh LLM.</p></li>
<li><p>Deskripsi gambar yang diambil yang sesuai dengan kueri.</p></li>
</ul>
<h3 id="Project-Structure" class="common-anchor-header">Struktur Proyek</h3><pre><code translate="no">.
├─ requirements-min.txt
├─ .env.example
├─ [config.py](&lt;http:<span class="hljs-comment">//config.py&gt;)</span>
├─ milvus_[store.py](&lt;http:<span class="hljs-comment">//store.py&gt;)</span>
├─ [adapters.py](&lt;http:<span class="hljs-comment">//adapters.py&gt;)</span>
├─ minimal_[main.py](&lt;http:<span class="hljs-comment">//main.py&gt;)</span>
└─ sample
   ├─ docs
   │  └─ faq_milvus.txt
   └─ images
      └─ milvus_arch.png
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ketergantungan Proyek</strong></p>
<pre><code translate="no">raganything
lightrag
pymilvus[lite]&gt;=2.3.0
aiohttp&gt;=3.8.0
orjson&gt;=3.8.0
python-dotenv&gt;=1.0.0
Pillow&gt;=9.0.0
numpy&gt;=1.21.0,&lt;2.0.0
rich&gt;=12.0.0
<button class="copy-code-btn"></button></code></pre>
<p><strong>Variabel Lingkungan</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Alibaba Cloud DashScope</span>
DASHSCOPE_API_KEY=your_api_key_here
<span class="hljs-comment"># If the endpoint changes in future releases, please update it accordingly.</span>
ALIYUN_LLM_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
ALIYUN_VLM_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
ALIYUN_EMBED_URL=https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding
<span class="hljs-comment"># Model names (configure all models here for consistency)</span>
LLM_TEXT_MODEL=qwen-max
LLM_VLM_MODEL=qwen-vl-max
EMBED_MODEL=tongyi-embedding-vision-plus
<span class="hljs-comment"># Milvus Lite</span>
MILVUS_URI=milvus_lite.db
MILVUS_COLLECTION=rag_multimodal_collection
EMBED_DIM=1152
<button class="copy-code-btn"></button></code></pre>
<p><strong>Konfigurasi</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
load_dotenv()
DASHSCOPE_API_KEY = os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
LLM_TEXT_MODEL = os.getenv(<span class="hljs-string">&quot;LLM_TEXT_MODEL&quot;</span>, <span class="hljs-string">&quot;qwen-max&quot;</span>)
LLM_VLM_MODEL = os.getenv(<span class="hljs-string">&quot;LLM_VLM_MODEL&quot;</span>, <span class="hljs-string">&quot;qwen-vl-max&quot;</span>)
EMBED_MODEL = os.getenv(<span class="hljs-string">&quot;EMBED_MODEL&quot;</span>, <span class="hljs-string">&quot;tongyi-embedding-vision-plus&quot;</span>)
ALIYUN_LLM_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_LLM_URL&quot;</span>)
ALIYUN_VLM_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_VLM_URL&quot;</span>)
ALIYUN_EMBED_URL = os.getenv(<span class="hljs-string">&quot;ALIYUN_EMBED_URL&quot;</span>)
MILVUS_URI = os.getenv(<span class="hljs-string">&quot;MILVUS_URI&quot;</span>, <span class="hljs-string">&quot;milvus_lite.db&quot;</span>)
MILVUS_COLLECTION = os.getenv(<span class="hljs-string">&quot;MILVUS_COLLECTION&quot;</span>, <span class="hljs-string">&quot;rag_multimodal_collection&quot;</span>)
EMBED_DIM = <span class="hljs-built_in">int</span>(os.getenv(<span class="hljs-string">&quot;EMBED_DIM&quot;</span>, <span class="hljs-string">&quot;1152&quot;</span>))
<span class="hljs-comment"># Basic runtime parameters</span>
TIMEOUT = <span class="hljs-number">60</span>
MAX_RETRIES = <span class="hljs-number">2</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Pemanggilan Model</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> base64
<span class="hljs-keyword">import</span> aiohttp
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> (
    DASHSCOPE_API_KEY, LLM_TEXT_MODEL, LLM_VLM_MODEL, EMBED_MODEL,
    ALIYUN_LLM_URL, ALIYUN_VLM_URL, ALIYUN_EMBED_URL, EMBED_DIM, TIMEOUT
)
HEADERS = {
    <span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{DASHSCOPE_API_KEY}</span>&quot;</span>,
    <span class="hljs-string">&quot;Content-Type&quot;</span>: <span class="hljs-string">&quot;application/json&quot;</span>,
}
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AliyunLLMAdapter</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-variable language_">self</span>.text_url = ALIYUN_LLM_URL
        <span class="hljs-variable language_">self</span>.vlm_url = ALIYUN_VLM_URL
        <span class="hljs-variable language_">self</span>.text_model = LLM_TEXT_MODEL
        <span class="hljs-variable language_">self</span>.vlm_model = LLM_VLM_MODEL
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">self, prompt: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.text_model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: prompt}]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;max_tokens&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-string">&quot;temperature&quot;</span>: <span class="hljs-number">0.5</span>},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.text_url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>]
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_vlm_with_image</span>(<span class="hljs-params">self, prompt: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
            image_b64 = base64.b64encode([f.read](&lt;http://f.read&gt;)()).decode(<span class="hljs-string">&quot;utf-8&quot;</span>)
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.vlm_model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: [
                {<span class="hljs-string">&quot;text&quot;</span>: prompt},
                {<span class="hljs-string">&quot;image&quot;</span>: <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{image_b64}</span>&quot;</span>}
            ]}]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;max_tokens&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-string">&quot;temperature&quot;</span>: <span class="hljs-number">0.2</span>},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.vlm_url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>]
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AliyunEmbeddingAdapter</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-variable language_">self</span>.url = ALIYUN_EMBED_URL
        <span class="hljs-variable language_">self</span>.model = EMBED_MODEL
        <span class="hljs-variable language_">self</span>.dim = EMBED_DIM
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_text</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]:
        payload = {
            <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-variable language_">self</span>.model,
            <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;texts&quot;</span>: [text]},
            <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;text_type&quot;</span>: <span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;dimensions&quot;</span>: <span class="hljs-variable language_">self</span>.dim},
        }
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) <span class="hljs-keyword">as</span> s:
            <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> [s.post](&lt;http://s.post&gt;)(<span class="hljs-variable language_">self</span>.url, json=payload, headers=HEADERS) <span class="hljs-keyword">as</span> r:
                r.raise_for_status()
                data = <span class="hljs-keyword">await</span> r.json()
                <span class="hljs-keyword">return</span> data[<span class="hljs-string">&quot;output&quot;</span>][<span class="hljs-string">&quot;embeddings&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Integrasi Milvus Lite</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>, <span class="hljs-type">Optional</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, CollectionSchema, FieldSchema, DataType, utility
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> MILVUS_URI, MILVUS_COLLECTION, EMBED_DIM
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MilvusVectorStore</span>:
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, uri: <span class="hljs-built_in">str</span> = MILVUS_URI, collection_name: <span class="hljs-built_in">str</span> = MILVUS_COLLECTION, dim: <span class="hljs-built_in">int</span> = EMBED_DIM</span>):
        <span class="hljs-variable language_">self</span>.uri = uri
        <span class="hljs-variable language_">self</span>.collection_name = collection_name
        <span class="hljs-variable language_">self</span>.dim = dim
        <span class="hljs-variable language_">self</span>.collection: <span class="hljs-type">Optional</span>[Collection] = <span class="hljs-literal">None</span>
        <span class="hljs-variable language_">self</span>._connect_and_prepare()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_connect_and_prepare</span>(<span class="hljs-params">self</span>):
        connections.connect(<span class="hljs-string">&quot;default&quot;</span>, uri=<span class="hljs-variable language_">self</span>.uri)
        <span class="hljs-keyword">if</span> utility.has_collection(<span class="hljs-variable language_">self</span>.collection_name):
            <span class="hljs-variable language_">self</span>.collection = Collection(<span class="hljs-variable language_">self</span>.collection_name)
        <span class="hljs-keyword">else</span>:
            fields = [
                FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>, is_primary=<span class="hljs-literal">True</span>),
                FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-variable language_">self</span>.dim),
                FieldSchema(name=<span class="hljs-string">&quot;content&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>),
                FieldSchema(name=<span class="hljs-string">&quot;content_type&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">32</span>),
                FieldSchema(name=<span class="hljs-string">&quot;source&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>),
                FieldSchema(name=<span class="hljs-string">&quot;ts&quot;</span>, dtype=[DataType.INT](&lt;http://DataType.INT&gt;)<span class="hljs-number">64</span>),
            ]
            schema = CollectionSchema(fields, <span class="hljs-string">&quot;Minimal multimodal collection&quot;</span>)
            <span class="hljs-variable language_">self</span>.collection = Collection(<span class="hljs-variable language_">self</span>.collection_name, schema)
            <span class="hljs-variable language_">self</span>.collection.create_index(<span class="hljs-string">&quot;vector&quot;</span>, {
                <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
                <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
                <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>}
            })
        <span class="hljs-variable language_">self</span>.collection.load()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">upsert</span>(<span class="hljs-params">self, ids: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], vectors: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]], contents: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
               content_types: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], sources: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>) -&gt; <span class="hljs-literal">None</span>:
        data = [
            ids,
            vectors,
            contents,
            content_types,
            sources,
            [<span class="hljs-built_in">int</span>(time.time() * <span class="hljs-number">1000</span>)] * <span class="hljs-built_in">len</span>(ids)
        ]
        <span class="hljs-variable language_">self</span>.collection.upsert(data)
        <span class="hljs-variable language_">self</span>.collection.flush()
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query_vectors: <span class="hljs-type">List</span>[<span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]], top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, content_type: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span></span>):
        expr = <span class="hljs-string">f&#x27;content_type == &quot;<span class="hljs-subst">{content_type}</span>&quot;&#x27;</span> <span class="hljs-keyword">if</span> content_type <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>
        params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span>}}
        results = [<span class="hljs-variable language_">self</span>.collection.search](&lt;http://<span class="hljs-variable language_">self</span>.collection.search&gt;)(
            data=query_vectors,
            anns_field=<span class="hljs-string">&quot;vector&quot;</span>,
            param=params,
            limit=top_k,
            expr=expr,
            output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;content_type&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;ts&quot;</span>]
        )
        out = []
        <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
            out.append([{
                <span class="hljs-string">&quot;id&quot;</span>: h.entity.get(<span class="hljs-string">&quot;id&quot;</span>),
                <span class="hljs-string">&quot;content&quot;</span>: h.entity.get(<span class="hljs-string">&quot;content&quot;</span>),
                <span class="hljs-string">&quot;content_type&quot;</span>: h.entity.get(<span class="hljs-string">&quot;content_type&quot;</span>),
                <span class="hljs-string">&quot;source&quot;</span>: h.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
                <span class="hljs-string">&quot;score&quot;</span>: h.score
            } <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits])
        <span class="hljs-keyword">return</span> out
<button class="copy-code-btn"></button></code></pre>
<p><strong>Titik Masuk Utama</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Minimal Working Example:
- Insert a short text FAQ into LightRAG (text retrieval context)
- Insert an image description vector into Milvus (image retrieval context)
- Execute two example queries: one text QA and one image-based QA
&quot;&quot;&quot;</span>
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> uuid
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> rich <span class="hljs-keyword">import</span> <span class="hljs-built_in">print</span>
<span class="hljs-keyword">from</span> lightrag <span class="hljs-keyword">import</span> LightRAG, QueryParam
<span class="hljs-keyword">from</span> lightrag.utils <span class="hljs-keyword">import</span> EmbeddingFunc
<span class="hljs-keyword">from</span> adapters <span class="hljs-keyword">import</span> AliyunLLMAdapter, AliyunEmbeddingAdapter
<span class="hljs-keyword">from</span> milvus_store <span class="hljs-keyword">import</span> MilvusVectorStore
<span class="hljs-keyword">from</span> config <span class="hljs-keyword">import</span> EMBED_DIM
SAMPLE_DOC = Path(<span class="hljs-string">&quot;sample/docs/faq_milvus.txt&quot;</span>)
SAMPLE_IMG = Path(<span class="hljs-string">&quot;sample/images/milvus_arch.png&quot;</span>)
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-comment"># 1) Initialize core components</span>
    llm = AliyunLLMAdapter()
    emb = AliyunEmbeddingAdapter()
    store = MilvusVectorStore()
    <span class="hljs-comment"># 2) Initialize LightRAG (for text-only retrieval)</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">llm_complete</span>(<span class="hljs-params">prompt: <span class="hljs-built_in">str</span>, max_tokens: <span class="hljs-built_in">int</span> = <span class="hljs-number">1024</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> [llm.chat](&lt;http://llm.chat&gt;)(prompt)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_func</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-keyword">await</span> emb.embed_text(text)
    rag = LightRAG(
        working_dir=<span class="hljs-string">&quot;rag_workdir_min&quot;</span>,
        llm_model_func=llm_complete,
        embedding_func=EmbeddingFunc(
            embedding_dim=EMBED_DIM,
            max_token_size=<span class="hljs-number">8192</span>,
            func=embed_func
        ),
    )
    <span class="hljs-comment"># 3) Insert text data</span>
    <span class="hljs-keyword">if</span> SAMPLE_DOC.exists():
        text = SAMPLE_[DOC.read](&lt;http://DOC.read&gt;)_text(encoding=<span class="hljs-string">&quot;utf-8&quot;</span>)
        <span class="hljs-keyword">await</span> rag.ainsert(text)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[green]Inserted FAQ text into LightRAG[/green]&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[yellow] sample/docs/faq_milvus.txt not found[/yellow]&quot;</span>)
    <span class="hljs-comment"># 4) Insert image data (store description in Milvus)</span>
    <span class="hljs-keyword">if</span> SAMPLE_IMG.exists():
        <span class="hljs-comment"># Use the VLM to generate a description as its semantic content</span>
        desc = <span class="hljs-keyword">await</span> [llm.chat](&lt;http://llm.chat&gt;)_vlm_with_image(<span class="hljs-string">&quot;Please briefly describe the key components of the Milvus architecture shown in the image.&quot;</span>, <span class="hljs-built_in">str</span>(SAMPLE_IMG))
        vec = <span class="hljs-keyword">await</span> emb.embed_text(desc)  <span class="hljs-comment"># Use text embeddings to maintain a consistent vector dimension, simplifying reuse</span>
        store.upsert(
            ids=[<span class="hljs-built_in">str</span>(uuid.uuid4())],
            vectors=[vec],
            contents=[desc],
            content_types=[<span class="hljs-string">&quot;image&quot;</span>],
            sources=[<span class="hljs-built_in">str</span>(SAMPLE_IMG)]
        )
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[green]Inserted image description into Milvus（content_type=image）[/green]&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[yellow] sample/images/milvus_arch.png not found[/yellow]&quot;</span>)
    <span class="hljs-comment"># 5) Query: Text-based QA (from LightRAG)</span>
    q1 = <span class="hljs-string">&quot;Does Milvus support simultaneous insertion and search? Give a short answer.&quot;</span>
    ans1 = <span class="hljs-keyword">await</span> rag.aquery(q1, param=QueryParam(mode=<span class="hljs-string">&quot;hybrid&quot;</span>))
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[bold]Text QA[/bold]&quot;</span>)
    <span class="hljs-built_in">print</span>(ans1)
    <span class="hljs-comment"># 6) Query: Image-related QA (from Milvus)</span>
    q2 = <span class="hljs-string">&quot;What are the key components of the Milvus architecture?&quot;</span>
    q2_vec = <span class="hljs-keyword">await</span> emb.embed_text(q2)
    img_hits = [store.search](&lt;http://store.search&gt;)([q2_vec], top_k=<span class="hljs-number">3</span>, content_type=<span class="hljs-string">&quot;image&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\\n[bold]Image Retrieval (returns semantic image descriptions)[/bold]&quot;</span>)
    <span class="hljs-built_in">print</span>(img_hits[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> img_hits <span class="hljs-keyword">else</span> [])
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    [asyncio.run](&lt;http://asyncio.run&gt;)(main())
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang, Anda dapat menguji sistem RAG multimodal Anda dengan dataset Anda sendiri.</p>
<h2 id="The-Future-for-Multimodal-RAG" class="common-anchor-header">Masa Depan untuk RAG Multimodal<button data-href="#The-Future-for-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Seiring dengan semakin banyaknya data dunia nyata yang bergerak di luar teks biasa, sistem Retrieval-Augmented Generation (RAG) mulai berevolusi menuju multimodalitas yang sesungguhnya. Solusi seperti <strong>RAG-Anything</strong> telah menunjukkan bagaimana teks, gambar, tabel, formula, dan konten terstruktur lainnya dapat diproses dengan cara yang terpadu. Ke depannya, menurut saya ada tiga tren utama yang akan membentuk fase berikutnya dari RAG multimodal:</p>
<h3 id="Expanding-to-More-Modalities" class="common-anchor-header">Memperluas ke Lebih Banyak Modalitas</h3><p>Kerangka kerja yang ada saat ini-seperti RAG-Anything-sudah dapat menangani teks, gambar, tabel, dan ekspresi matematika. Perbatasan berikutnya adalah mendukung jenis konten yang lebih kaya lagi, termasuk <strong>video, audio, data sensor, dan model 3D</strong>, sehingga memungkinkan sistem RAG untuk memahami dan mengambil informasi dari spektrum penuh data modern.</p>
<h3 id="Real-Time-Data-Updates" class="common-anchor-header">Pembaruan Data Waktu Nyata</h3><p>Sebagian besar pipeline RAG saat ini mengandalkan sumber data yang relatif statis. Seiring perubahan informasi yang semakin cepat, sistem masa depan akan membutuhkan <strong>pembaruan dokumen secara real-time, konsumsi streaming, dan pengindeksan tambahan</strong>. Pergeseran ini akan membuat RAG lebih responsif, tepat waktu, dan dapat diandalkan dalam lingkungan yang dinamis.</p>
<h3 id="Moving-RAG-to-Edge-Devices" class="common-anchor-header">Memindahkan RAG ke Perangkat Edge</h3><p>Dengan alat vektor yang ringan seperti <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, RAG multimodal tidak lagi terbatas pada cloud. Menerapkan RAG pada <strong>perangkat edge dan sistem IoT</strong> memungkinkan pengambilan cerdas dilakukan lebih dekat dengan tempat data dihasilkan - meningkatkan latensi, privasi, dan efisiensi secara keseluruhan.</p>
<p>👉 Siap menjelajahi RAG multimodal?</p>
<p>Coba pasangkan pipeline multimodal Anda dengan <a href="https://milvus.io">Milvus</a> dan rasakan pengambilan yang cepat dan terukur di seluruh teks, gambar, dan banyak lagi.</p>
<p>Ada pertanyaan atau ingin mendalami fitur apa pun? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
