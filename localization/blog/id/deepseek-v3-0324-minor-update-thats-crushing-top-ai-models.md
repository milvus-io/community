---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: 'DeepSeek V3-0324: "Pembaruan Kecil" yang Menghancurkan Model AI Terbaik'
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  DeepSeek v3-0324 dilatih dengan parameter yang lebih besar, memiliki jendela
  konteks yang lebih panjang, dan kemampuan Penalaran, Pengkodean, dan
  Matematika yang lebih baik.
cover: assets.zilliz.com/Deep_Seek_V3_0324_033f6ff001.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>DeepSeek diam-diam menjatuhkan sebuah kejutan tadi malam. Rilis terbaru mereka,<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324</a>, diremehkan dalam pengumuman resminya sebagai <strong>"peningkatan kecil"</strong> tanpa perubahan API. Namun pengujian ekstensif kami di <a href="https://zilliz.com/">Zilliz</a> telah mengungkapkan sesuatu yang lebih signifikan: pembaruan ini mewakili lompatan besar dalam kinerja, terutama dalam penalaran logika, pemrograman, dan pemecahan masalah matematika.</p>
<p>Apa yang kami lihat bukan hanya peningkatan tambahan - ini adalah perubahan mendasar yang menempatkan DeepSeek v3-0324 di antara tingkat elit model bahasa. Dan itu adalah sumber terbuka.</p>
<p><strong>Rilis ini layak mendapatkan perhatian langsung dari para pengembang dan perusahaan yang membangun aplikasi bertenaga AI.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">Apa yang Baru di DeepSeek v3-0324 dan Seberapa Baikkah Itu?<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324 memperkenalkan tiga peningkatan utama dari pendahulunya, <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v3</a>:</p>
<ul>
<li><p><strong>Model yang Lebih Besar, Kekuatan yang Lebih Besar:</strong> Jumlah parameter telah meningkat dari 671 miliar menjadi 685 miliar, sehingga memungkinkan model untuk menangani penalaran yang lebih kompleks dan menghasilkan respons yang lebih bernuansa.</p></li>
<li><p><strong>Jendela Konteks yang Lebih Besar:</strong> Dengan panjang konteks token 128K yang ditingkatkan, DeepSeek v3-0324 dapat menyimpan dan memproses lebih banyak informasi secara signifikan dalam satu kueri, menjadikannya ideal untuk percakapan bentuk panjang, analisis dokumen, dan aplikasi AI berbasis pencarian.</p></li>
<li><p><strong>Penalaran, Pengkodean, dan Matematika yang Ditingkatkan:</strong> Pembaruan ini membawa peningkatan yang nyata dalam logika, pemrograman, dan kemampuan matematika, menjadikannya pesaing yang kuat untuk pengkodean dengan bantuan AI, penelitian ilmiah, dan pemecahan masalah tingkat perusahaan.</p></li>
</ul>
<p>Tetapi angka-angka mentah tidak menceritakan keseluruhan cerita. Yang benar-benar mengesankan adalah bagaimana DeepSeek berhasil meningkatkan kapasitas penalaran dan efisiensi pembangkitan secara bersamaan-sesuatu yang biasanya melibatkan pengorbanan teknik.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">Saus Rahasia: Inovasi Arsitektur</h3><p>Di balik tenda, DeepSeek v3-0324 mempertahankan arsitektur <a href="https://arxiv.org/abs/2502.07864">Multi-head Latent Attention (MLA </a>) - sebuah mekanisme efisien yang memampatkan cache Key-Value (KV) menggunakan vektor laten untuk mengurangi penggunaan memori dan overhead komputasi selama inferensi. Selain itu, ini menggantikan <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">Feed-Forward Networks (FFN)</a> tradisional dengan lapisan Mixture of Experts<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE</a>), yang mengoptimalkan efisiensi komputasi dengan secara dinamis mengaktifkan pakar yang berkinerja terbaik untuk setiap token.</p>
<p>Namun, peningkatan yang paling menarik adalah <strong>prediksi multi-token (MTP</strong> ), yang memungkinkan setiap token untuk memprediksi beberapa token di masa depan secara bersamaan. Hal ini mengatasi hambatan yang signifikan dalam model autoregresif tradisional, meningkatkan akurasi dan kecepatan inferensi.</p>
<p>Bersama-sama, inovasi ini menciptakan model yang tidak hanya berskala dengan baik - tetapi juga berskala secara cerdas, membawa kemampuan AI tingkat profesional dalam jangkauan lebih banyak tim pengembangan.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">Membangun Sistem RAG dengan Milvus dan DeepSeek v3-0324 dalam 5 Menit<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Kemampuan penalaran DeepSeek v3-0324 yang kuat menjadikannya kandidat yang ideal untuk sistem Retrieval-Augmented Generation (RAG). Dalam tutorial ini, kami akan menunjukkan kepada Anda cara membuat pipeline RAG lengkap menggunakan DeepSeek v3-0324 dan basis data vektor <a href="https://zilliz.com/what-is-milvus">Milvus</a> hanya dalam waktu lima menit. Anda akan belajar cara mengambil dan mensintesis pengetahuan secara efisien dengan pengaturan yang minimal.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Menyiapkan Lingkungan Anda</h3><p>Pertama, mari kita instal dependensi yang diperlukan:</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>Catatan:</strong> Jika Anda menggunakan Google Colab, Anda harus memulai ulang runtime setelah menginstal paket-paket ini. Klik pada menu "Runtime" di bagian atas layar dan pilih "Restart session" dari menu tarik-turun.</p>
<p>Karena DeepSeek menyediakan API yang kompatibel dengan OpenAI, Anda akan memerlukan kunci API. Anda bisa mendapatkannya dengan mendaftar pada<a href="https://platform.deepseek.com/api_keys"> platform DeepSeek</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">Mempersiapkan Data Anda</h3><p>Untuk tutorial ini, kita akan menggunakan halaman FAQ dari <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Dokumentasi Milvus 2.4.x</a> sebagai sumber pengetahuan:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang, mari kita muat dan siapkan konten FAQ dari file markdown:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">Menyiapkan Bahasa dan Model Penyematan</h3><p>Kita akan menggunakan <a href="https://openrouter.ai/">OpenRouter</a> untuk mengakses DeepSeek v3-0324. OpenRouter menyediakan API terpadu untuk beberapa model AI, seperti DeepSeek dan Claude. Dengan membuat kunci API DeepSeek V3 gratis di OpenRouter, Anda dapat dengan mudah mencoba DeepSeek V3 0324.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Untuk penyematan teks, kita akan menggunakan <a href="https://milvus.io/docs/embeddings.md">model penyematan bawaan</a> Milvus yang ringan dan efektif:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Membuat Koleksi Milvus</h3><p>Sekarang mari kita siapkan basis data vektor kita menggunakan Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using Milvus Lite for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># See https://milvus.io/docs/consistency.md for details</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Tip Pro</strong>: Untuk skenario penerapan yang berbeda, Anda dapat menyesuaikan pengaturan Milvus Anda:</p>
<ul>
<li><p>Untuk pengembangan lokal: Gunakan <code translate="no">uri=&quot;./milvus.db&quot;</code> dengan <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a></p></li>
<li><p>Untuk kumpulan data yang lebih besar: Siapkan server Milvus melalui <a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a> dan gunakan <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>Untuk produksi: Gunakan<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> dengan titik akhir cloud dan kunci API Anda.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Memuat Data ke Milvus</h3><p>Mari kita ubah data teks kita menjadi embedding dan simpan di Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

<span class="hljs-comment"># Create embeddings for all text chunks</span>
data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-comment"># Create records with IDs, vectors, and text</span>
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

<span class="hljs-comment"># Insert data into Milvus</span>
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Creating embeddings:   0%|          | 0/72 [00:00&lt;?, ?it/s]huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To <span class="hljs-built_in">disable</span> this warning, you can either:
    - Avoid using `tokenizers` before the fork <span class="hljs-keyword">if</span> possible
    - Explicitly <span class="hljs-built_in">set</span> the environment variable TOKENIZERS_PARALLELISM=(<span class="hljs-literal">true</span> | <span class="hljs-literal">false</span>)
Creating embeddings: 100%|██████████| 72/72 [00:00&lt;00:00, 246522.36it/s]





{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">Membangun Pipeline RAG</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">Langkah 1: Mengambil Informasi yang Relevan</h4><p>Mari kita uji sistem RAG kita dengan sebuah pertanyaan umum:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Search for relevant information</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]),  <span class="hljs-comment"># Convert question to embedding</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)

<span class="hljs-comment"># Examine search results</span>
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
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
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">Langkah 2: Hasilkan Respons dengan DeepSeek</h4><p>Sekarang mari kita gunakan DeepSeek untuk menghasilkan respons berdasarkan informasi yang diambil:</p>
<pre><code translate="no"><span class="hljs-comment"># Combine retrieved text chunks</span>
context = <span class="hljs-string">&quot;\n&quot;</span>.join(
    [line_with_distance[<span class="hljs-number">0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)

<span class="hljs-comment"># Define prompts for the language model</span>
SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
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

<span class="hljs-comment"># Generate response with DeepSeek</span>
response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-chat&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)

<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: inserted data <span class="hljs-keyword">and</span> metadata.

<span class="hljs-number">1.</span> **Inserted Data**: This includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema. The inserted data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, such <span class="hljs-keyword">as</span> MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).

2. **Metadata**: Metadata <span class="hljs-keyword">is</span> generated within Milvus <span class="hljs-keyword">and</span> <span class="hljs-keyword">is</span> specific to each Milvus module. This metadata <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> etcd, a distributed key-<span class="hljs-keyword">value</span> store.

Additionally, <span class="hljs-keyword">when</span> data <span class="hljs-keyword">is</span> inserted, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue, <span class="hljs-keyword">and</span> Milvus returns success at <span class="hljs-keyword">this</span> stage. The data <span class="hljs-keyword">is</span> then written to persistent storage <span class="hljs-keyword">as</span> incremental logs <span class="hljs-keyword">by</span> the data node. If the `<span class="hljs-title">flush</span>()` function <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<p>Dan itu dia! Anda telah berhasil membangun pipeline RAG yang lengkap dengan DeepSeek v3-0324 dan Milvus. Sistem ini sekarang dapat menjawab pertanyaan berdasarkan dokumentasi Milvus dengan akurasi tinggi dan kesadaran kontekstual.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">Membandingkan DeepSeek-V3-0324: Versi Asli vs Versi yang Disempurnakan dengan RAG<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>Teori adalah satu hal, tetapi kinerja dunia nyata adalah yang terpenting. Kami menguji DeepSeek v3-0324 standar (dengan "Deep Thinking" dinonaktifkan) dan versi RAG-enhanced dengan prompt yang sama: <em>Tulis kode HTML untuk membuat situs web mewah tentang Milvus.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">Situs Web yang Dibangun dengan Kode Keluaran Model Standar</h3><p>Inilah tampilan situs webnya:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Meskipun menarik secara visual, kontennya sangat bergantung pada deskripsi umum dan melewatkan banyak fitur teknis inti Milvus.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">Situs Web Dibangun dengan Kode yang Dihasilkan oleh Versi RAG yang Disempurnakan</h3><p>Ketika kami mengintegrasikan Milvus sebagai basis pengetahuan, hasilnya sangat berbeda:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Situs web yang terakhir tidak hanya terlihat lebih baik - situs web ini menunjukkan pemahaman yang tulus tentang arsitektur, kasus penggunaan, dan keunggulan teknis Milvus.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">Dapatkah DeepSeek v3-0324 Menggantikan Model Penalaran Khusus?<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Penemuan kami yang paling mengejutkan datang ketika membandingkan DeepSeek v3-0324 dengan model penalaran khusus seperti Claude 3.7 Sonnet dan GPT-4 Turbo di seluruh tugas penalaran matematika, logika, dan kode.</p>
<p>Meskipun model penalaran khusus unggul dalam pemecahan masalah multi-langkah, model ini sering kali mengorbankan efisiensi. Tolok ukur kami menunjukkan bahwa model penalaran-berat sering kali menganalisis secara berlebihan permintaan sederhana, menghasilkan token 2-3x lebih banyak dari yang diperlukan dan secara signifikan meningkatkan latensi dan biaya API.</p>
<p>DeepSeek v3-0324 mengambil pendekatan yang berbeda. Ini menunjukkan konsistensi logis yang sebanding tetapi dengan keringkasan yang jauh lebih besar - sering kali menghasilkan solusi yang benar dengan token 40-60% lebih sedikit. Efisiensi ini tidak mengorbankan akurasi; dalam pengujian pembuatan kode kami, solusi DeepSeek menyamai atau melampaui fungsionalitas dari pesaing yang berfokus pada penalaran.</p>
<p>Bagi pengembang yang menyeimbangkan kinerja dengan batasan anggaran, keuntungan efisiensi ini diterjemahkan langsung ke biaya API yang lebih rendah dan waktu respons yang lebih cepat - faktor penting untuk aplikasi produksi di mana pengalaman pengguna bergantung pada kecepatan yang dirasakan.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">Masa Depan Model AI: Mengaburkan Perbedaan Penalaran<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>Performa DeepSeek v3-0324 menantang asumsi utama dalam industri AI: bahwa penalaran dan efisiensi merupakan pertukaran yang tidak dapat dihindari. Hal ini menunjukkan bahwa kita mungkin mendekati titik belok di mana perbedaan antara model penalaran dan non- penalaran mulai kabur.</p>
<p>Penyedia AI terkemuka pada akhirnya dapat menghilangkan perbedaan ini sepenuhnya, mengembangkan model yang secara dinamis menyesuaikan kedalaman penalaran mereka berdasarkan kompleksitas tugas. Penalaran adaptif semacam itu akan mengoptimalkan efisiensi komputasi dan kualitas respons, yang berpotensi merevolusi cara kita membangun dan menggunakan aplikasi AI.</p>
<p>Bagi pengembang yang membangun sistem RAG, evolusi ini menjanjikan solusi yang lebih hemat biaya yang memberikan kedalaman penalaran model premium tanpa biaya tambahan komputasi - memperluas apa yang mungkin dilakukan dengan AI sumber terbuka.</p>
