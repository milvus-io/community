---
id: milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
title: >-
  Milvus + RustFS + Pengkodean Getaran: Membangun Chatbot RAG yang Ringan dari
  Awal
author: Jinghe Ma
date: 2026-3-10
cover: assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_7_f25795481e.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, RustFS, RAG chatbot,  vector database, S3-compatible object storage'
meta_keywords: 'Milvus, RustFS, RAG chatbot,  vector database, S3-compatible object storage'
meta_title: |
  Milvus + RustFS: Build a Lightweight RAG Chatbot
desc: >-
  Membangun chatbot RAG yang ringan dengan Milvus, RustFS, FastAPI, dan Next.js
  menggunakan dokumen RustFS sebagai basis pengetahuan.
origin: >-
  https://milvus.io/blog/milvus-rustfs-vibe-coding-build-a-lightweight-rag-chatbot-from-scratch.md
---
<p><em>Blog ini dikontribusikan oleh Jinghe Ma, kontributor komunitas Milvus</em> <em>, dan dipublikasikan di sini dengan izin</em>.</p>
<p>Saya menginginkan chatbot yang dapat menjawab pertanyaan dari dokumentasi saya sendiri, dan saya menginginkan kontrol penuh atas stack di belakangnya - dari penyimpanan objek hingga antarmuka obrolan. Hal ini mendorong saya untuk membuat chatbot RAG yang ringan dengan <a href="https://milvus.io/">Milvus</a> dan <a href="https://rustfs.com/">RustFS</a> sebagai intinya.</p>
<p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka yang paling banyak diadopsi untuk membangun aplikasi RAG. Milvus memisahkan komputasi dari penyimpanan, menyimpan data panas di memori atau di SSD untuk pencarian cepat sambil mengandalkan penyimpanan objek di bawahnya untuk manajemen data yang dapat diskalakan dan hemat biaya. Karena bekerja dengan penyimpanan yang kompatibel dengan S3, maka sangat cocok untuk proyek ini.</p>
<p>Untuk lapisan penyimpanan, saya memilih <a href="https://rustfs.com/">RustFS</a>, sebuah sistem penyimpanan objek yang kompatibel dengan S3 yang ditulis dalam bahasa Rust. Sistem ini dapat digunakan melalui binary, Docker, atau Helm chart. Meskipun masih dalam versi alfa dan tidak direkomendasikan untuk beban kerja produksi, namun cukup stabil untuk pembangunan ini.</p>
<p>Setelah infrastrukturnya siap, saya membutuhkan basis pengetahuan untuk melakukan kueri. Dokumentasi RustFS-sekitar 80 berkas Markdown-adalah titik awal yang tepat. Saya memotong-motong dokumen tersebut, membuat embedding, menyimpannya di Milvus, dan meng-coding sisanya: <a href="https://fastapi.tiangolo.com/">FastAPI</a> untuk backend dan <a href="https://nextjs.org/">Next.js</a> untuk antarmuka obrolan.</p>
<p>Dalam tulisan ini, saya akan membahas sistem secara lengkap dari ujung ke ujung. Kode tersedia di https://github.com/majinghe/chatbot. Ini adalah prototipe yang berfungsi daripada sistem yang siap produksi, tetapi tujuannya adalah untuk menyediakan build yang jelas dan dapat diperluas yang dapat Anda sesuaikan untuk penggunaan Anda sendiri. Setiap bagian di bawah ini berjalan melalui satu lapisan, dari infrastruktur ke frontend.</p>
<h2 id="Installing-Milvus-and-RustFS-with-Docker-Compose" class="common-anchor-header">Menginstal Milvus dan RustFS dengan Docker Compose<button data-href="#Installing-Milvus-and-RustFS-with-Docker-Compose" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita mulai dengan menginstal <a href="https://milvus.io/">Milvus</a> dan <a href="https://rustfs.com/">RustFS</a>.</p>
<p>Milvus dapat bekerja dengan penyimpanan objek apa pun yang kompatibel dengan S3, meskipun MinIO adalah backend default dalam pengaturan standar. Karena MinIO tidak lagi menerima kontribusi komunitas, kita akan menggantinya dengan RustFS dalam contoh ini.</p>
<p>Untuk melakukan perubahan tersebut, perbarui konfigurasi penyimpanan objek di configs/milvus.yaml di dalam repositori Milvus. Bagian yang relevan terlihat seperti ini:</p>
<pre><code translate="no"><span class="hljs-attr">minio</span>:
  <span class="hljs-attr">address</span>: <span class="hljs-attr">localhost</span>:<span class="hljs-number">9000</span>
  <span class="hljs-attr">port</span>: <span class="hljs-number">9000</span>
  <span class="hljs-attr">accessKeyID</span>: rustfsadmin
  <span class="hljs-attr">secretAccessKey</span>: rustfsadmin
  <span class="hljs-attr">useSSL</span>: <span class="hljs-literal">false</span>
  <span class="hljs-attr">bucketName</span>: <span class="hljs-string">&quot;rustfs-bucket&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ada dua cara untuk menerapkan perubahan ini:</p>
<ul>
<li><strong>Memasang berkas konfigurasi lokal.</strong> Salin configs/milvus.yaml secara lokal, perbarui bidang MinIO untuk mengarahkan ke RustFS, lalu pasang ke dalam kontainer melalui volume Docker.</li>
<li><strong>Tambal saat startup dengan</strong> <strong>yq****.</strong> Modifikasi perintah kontainer untuk menjalankan yq terhadap /milvus/configs/milvus.yaml sebelum proses Milvus dimulai.</li>
</ul>
<p>Build ini menggunakan pendekatan pertama. Layanan Milvus di docker-compose.yml mendapatkan satu entri volume ekstra:</p>
<pre><code translate="no">- <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Docker-Compose-Setup" class="common-anchor-header">Pengaturan Docker Compose</h3><p>Docker-compose.yml lengkap menjalankan empat layanan.</p>
<p><strong>etcd</strong> - Milvus bergantung pada etcd untuk penyimpanan metadata:</p>
<pre><code translate="no">etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.18
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/etcd:/etcd
    <span class="hljs-built_in">command</span>: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;etcdctl&quot;</span>, <span class="hljs-string">&quot;endpoint&quot;</span>, <span class="hljs-string">&quot;health&quot;</span>]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
<button class="copy-code-btn"></button></code></pre>
<p><strong>Attu</strong> - UI visual untuk Milvus, dikembangkan dan bersumber terbuka oleh Zilliz (catatan: versi setelah 2.6 adalah sumber tertutup):</p>
<pre><code translate="no">  attu:
    container_name: milvus-attu
    image: zilliz/attu:v2.6
    environment:
      - MILVUS_URL=milvus-standalone:19530
    ports:
      - <span class="hljs-string">&quot;8000:3000&quot;</span>
    restart: unless-stopped
<button class="copy-code-btn"></button></code></pre>
<p><strong>RustFS</strong> - backend penyimpanan objek:</p>
<pre><code translate="no">rustfs:
    container_name: milvus-rustfs
    image: rustfs/rustfs:1.0.0-alpha.58
    environment:
      - RUSTFS_VOLUMES=/data/rustfs0,/data/rustfs1,/data/rustfs2,/data/rustfs3
      - RUSTFS_ADDRESS=0.0.0.0:9000
      - RUSTFS_CONSOLE_ADDRESS=0.0.0.0:9001
      - RUSTFS_CONSOLE_ENABLE=<span class="hljs-literal">true</span>
      - RUSTFS_EXTERNAL_ADDRESS=:9000  <span class="hljs-comment"># Same as internal since no port mapping</span>
      - RUSTFS_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_CONSOLE_CORS_ALLOWED_ORIGINS=*
      - RUSTFS_ACCESS_KEY=rustfsadmin
      - RUSTFS_SECRET_KEY=rustfsadmin
    ports:
      - <span class="hljs-string">&quot;9000:9000&quot;</span># S3 API port
      - <span class="hljs-string">&quot;9001:9001&quot;</span># Console port
    volumes:
      - rustfs_data_0:/data/rustfs0
      - rustfs_data_1:/data/rustfs1
      - rustfs_data_2:/data/rustfs2
      - rustfs_data_3:/data/rustfs3
      - logs_data:/app/logs
    restart: unless-stopped
    healthcheck:
      <span class="hljs-built_in">test</span>:
        [
          <span class="hljs-string">&quot;CMD&quot;</span>,
          <span class="hljs-string">&quot;sh&quot;</span>, <span class="hljs-string">&quot;-c&quot;</span>,
          <span class="hljs-string">&quot;curl -f http://localhost:9000/health &amp;&amp; curl -f http://localhost:9001/health&quot;</span>
        ]
      interval: 30s
      <span class="hljs-built_in">timeout</span>: 10s
      retries: 3
      start_period: 40s
<button class="copy-code-btn"></button></code></pre>
<p><strong>Milvus</strong> - berjalan dalam mode mandiri:</p>
<pre><code translate="no">  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.6.0
    <span class="hljs-built_in">command</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;run&quot;</span>, <span class="hljs-string">&quot;standalone&quot;</span>]
    security_opt:
    - seccomp:unconfined
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: rustfs:9000
      MQ_TYPE: woodpecker
    volumes:
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus:/var/lib/milvus
      - <span class="hljs-variable">${DOCKER_VOLUME_DIRECTORY:-.}</span>/volumes/milvus/milvus.yaml:/milvus/configs/milvus.yaml:ro
    healthcheck:
      <span class="hljs-built_in">test</span>: [<span class="hljs-string">&quot;CMD&quot;</span>, <span class="hljs-string">&quot;curl&quot;</span>, <span class="hljs-string">&quot;-f&quot;</span>, <span class="hljs-string">&quot;http://localhost:9091/healthz&quot;</span>]
      interval: 30s
      start_period: 90s
      <span class="hljs-built_in">timeout</span>: 20s
      retries: 3
    ports:
      - <span class="hljs-string">&quot;19530:19530&quot;</span>
      - <span class="hljs-string">&quot;9091:9091&quot;</span>
    depends_on:
      - <span class="hljs-string">&quot;etcd&quot;</span>
      - <span class="hljs-string">&quot;rustfs&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Starting-Everything" class="common-anchor-header">Memulai Semuanya</h3><p>Setelah konfigurasi sudah siap, jalankan keempat layanan tersebut:</p>
<pre><code translate="no">docker compose -f docker-compose.yml up -d
<button class="copy-code-btn"></button></code></pre>
<p>Anda dapat memverifikasi bahwa semuanya telah berjalan:</p>
<pre><code translate="no">docker ps
CONTAINER ID   IMAGE                                             COMMAND                  CREATED          STATUS                      PORTS                                                                                      NAMES
4404b5cc6f7e   milvusdb/milvus:v2.6.0                            <span class="hljs-string">&quot;/tini -- milvus run…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     0.0.0.0:9091-&gt;9091/tcp, :::9091-&gt;9091/tcp, 0.0.0.0:19530-&gt;19530/tcp, :::19530-&gt;19530/tcp   milvus-standalone
40ddc8ed08bb   zilliz/attu:v2.6                                  <span class="hljs-string">&quot;docker-entrypoint.s…&quot;</span>   53 minutes ago   Up 53 minutes               0.0.0.0:8000-&gt;3000/tcp, :::8000-&gt;3000/tcp                                                  milvus-attu
3d2c8d80a8ce   quay.io/coreos/etcd:v3.5.18                       <span class="hljs-string">&quot;etcd -advertise-cli…&quot;</span>   53 minutes ago   Up 53 minutes (healthy)     2379-2380/tcp                                                                              milvus-etcd
d760f6690ea7   rustfs/rustfs:1.0.0-alpha.58                      <span class="hljs-string">&quot;/entrypoint.sh rust…&quot;</span>   53 minutes ago   Up 53 minutes (unhealthy)   0.0.0.0:9000-9001-&gt;9000-9001/tcp, :::9000-9001-&gt;9000-9001/tcp                              milvus-rustfs
<button class="copy-code-btn"></button></code></pre>
<p>Dengan keempat kontainer aktif, layanan Anda tersedia di:</p>
<ul>
<li><strong>Milvus:</strong> <ip>:19530</li>
<li><strong>RustFS:</strong> <ip>:9000</li>
<li><strong>Attu:</strong> <ip>:8000</li>
</ul>
<h2 id="Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="common-anchor-header">Memvektor Dokumen RustFS dan Menyimpan Penyisipan di Milvus<button data-href="#Vectorizing-the-RustFS-Docs-and-Storing-Embeddings-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah Milvus dan RustFS berjalan, langkah selanjutnya adalah membangun basis pengetahuan. Materi sumbernya adalah dokumentasi RustFS berbahasa Mandarin: 80 berkas Markdown yang akan Anda potong, sematkan, dan simpan di Milvus.</p>
<h3 id="Reading-and-Chunking-the-Docs" class="common-anchor-header">Membaca dan Memotong Dokumen</h3><p>Skrip ini secara rekursif membaca setiap berkas .md di dalam folder dokumen, lalu membagi setiap konten berkas menjadi beberapa bagian per baris:</p>
<pre><code translate="no"><span class="hljs-comment"># 3. Read Markdown files</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">folder</span>):
    files = glob.glob(os.path.join(folder, <span class="hljs-string">&quot;**&quot;</span>, <span class="hljs-string">&quot;*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
    docs = []
    <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> files:
        <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(f, <span class="hljs-string">&quot;r&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> fp:
            docs.append(fp.read())
    <span class="hljs-keyword">return</span> docs

<span class="hljs-comment"># 4. Split documents (simple paragraph-based splitting)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_into_chunks</span>(<span class="hljs-params">text, max_len=<span class="hljs-number">500</span></span>):
    chunks, current = [], []
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>):
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(<span class="hljs-string">&quot; &quot;</span>.join(current)) + <span class="hljs-built_in">len</span>(line) &lt; max_len:
            current.append(line)
        <span class="hljs-keyword">else</span>:
            chunks.append(<span class="hljs-string">&quot; &quot;</span>.join(current))
            current = [line]
    <span class="hljs-keyword">if</span> current:
        chunks.append(<span class="hljs-string">&quot; &quot;</span>.join(current))
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<p>Strategi pemotongan ini sengaja dibuat sederhana. Jika Anda menginginkan kontrol yang lebih ketat - memisahkan header, mempertahankan blok kode, atau potongan yang tumpang tindih untuk pengambilan yang lebih baik - di sinilah tempatnya.</p>
<h3 id="Embedding-the-Chunks" class="common-anchor-header">Menyematkan Potongan Kode</h3><p>Setelah potongan-potongan kode siap, Anda menyematkannya menggunakan model penyematan teks-3-besar dari OpenAI, yang menghasilkan vektor 3072 dimensi:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts</span>):
    response = client.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-large&quot;</span>,
        <span class="hljs-built_in">input</span>=texts
    )
    <span class="hljs-keyword">return</span> [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> response.data]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Storing-Embeddings-in-Milvus" class="common-anchor-header">Menyimpan Penyematan di Milvus</h3><p>Milvus mengatur data ke dalam koleksi, yang masing-masing didefinisikan oleh skema. Di sini, setiap record menyimpan potongan teks mentah bersama dengan vektor penyisipannya:</p>
<pre><code translate="no"><span class="hljs-comment"># Connect to Milvus</span>
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;ip&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;content&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">3072</span>),
]
schema = CollectionSchema(fields, description=<span class="hljs-string">&quot;Markdown docs collection&quot;</span>)

<span class="hljs-comment"># Create the collection</span>
<span class="hljs-keyword">if</span> utility.has_collection(<span class="hljs-string">&quot;docs_collection&quot;</span>):
    utility.drop_collection(<span class="hljs-string">&quot;docs_collection&quot;</span>)

collection = Collection(name=<span class="hljs-string">&quot;docs_collection&quot;</span>, schema=schema)

<span class="hljs-comment"># Insert data</span>
collection.insert([all_chunks, embeddings])
collection.flush()
<button class="copy-code-btn"></button></code></pre>
<p>Setelah penyisipan selesai, Anda dapat memverifikasi koleksi di Attu di <ip>:8000 - Anda akan melihat docs_collection terdaftar di bawah Collections.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_2_a787e96076.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anda juga dapat memeriksa RustFS di <ip>:9000 untuk mengonfirmasi data yang mendasari mendarat di penyimpanan objek.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_6_0e6d8c9471.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="common-anchor-header">Membangun RAG Pipeline dengan Milvus dan GPT-5 OpenAI<button data-href="#Building-a-RAG-Pipeline-with-Milvus-and-OpenAI’s-GPT-5" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan embedding yang tersimpan di Milvus, Anda memiliki semua yang Anda butuhkan untuk membangun pipeline RAG. Alurnya adalah: sematkan kueri pengguna, ambil potongan yang paling mirip secara semantik dari Milvus, susun prompt, dan panggil GPT-5. Pembuatan di sini menggunakan GPT-5 dari OpenAI, tetapi model berkemampuan obrolan apa pun dapat digunakan di sini - lapisan pengambilan adalah yang terpenting, dan Milvus menanganinya terlepas dari LLM mana yang menghasilkan jawaban akhir.</p>
<pre><code translate="no"><span class="hljs-comment"># 1. Embed the query</span>
query_embedding = embed_texts(query)

<span class="hljs-comment"># 2. Retrieve similar documents from Milvus</span>
    search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}}
    results = collection.search(
        data=[query_embedding],
        anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
        param=search_params,
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )

docs = [hit.entity.get(<span class="hljs-string">&quot;text&quot;</span>) <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]

<span class="hljs-comment"># 3. Assemble the RAG prompt</span>
prompt = <span class="hljs-string">f&quot;You are a RustFS expert. Answer the question based on the following documents:\n\n<span class="hljs-subst">{docs}</span>\n\nUser question: <span class="hljs-subst">{query}</span>&quot;</span>

<span class="hljs-comment"># 4. Call the LLM</span>
    response = client.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-5&quot;</span>, <span class="hljs-comment"># swap to any OpenAI model, or replace this call with another LLM provider</span>
        messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: prompt}],
        <span class="hljs-comment"># max_tokens=16384,</span>
        <span class="hljs-comment"># temperature=1.0,</span>
        <span class="hljs-comment"># top_p=1.0,</span>
    )

    answer = response.choices[<span class="hljs-number">0</span>].message.content

    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;answer&quot;</span>: answer, <span class="hljs-string">&quot;sources&quot;</span>: docs}
<button class="copy-code-btn"></button></code></pre>
<p>Untuk mengujinya, jalankan sebuah kueri:</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>Hasil kueri:  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_5_2cd609c90c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_3_18f4476b7a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Membungkus Semuanya dalam Chatbot FastAPI + Next.js</p>
<p>Pipeline RAG berfungsi, tetapi menjalankan skrip Python setiap kali Anda ingin mengajukan pertanyaan mengalahkan tujuannya. Jadi saya meminta saran dari AI untuk membuat stack. Jawabannya: <strong>FastAPI</strong> untuk backend - kode RAG sudah berupa Python, jadi membungkusnya dengan endpoint FastAPI adalah pilihan yang tepat - dan <strong>Next.js</strong> untuk frontend. FastAPI mengekspos logika RAG sebagai titik akhir HTTP; Next.js memanggilnya dan merender respons di jendela obrolan.</p>
<h3 id="FastAPI-Backend" class="common-anchor-header">Backend FastAPI</h3><p>FastAPI membungkus logika RAG dalam satu titik akhir POST. Klien mana pun sekarang dapat menanyakan basis pengetahuan Anda dengan permintaan JSON:</p>
<pre><code translate="no">app = FastAPI()

<span class="hljs-meta">@app.post(<span class="hljs-params"><span class="hljs-string">&quot;/chat&quot;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat</span>(<span class="hljs-params">req: ChatRequest</span>):
    query = req.query

......
<button class="copy-code-btn"></button></code></pre>
<p>Mulai server dengan:</p>
<pre><code translate="no">uvicorn main:app --reload --host <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> --port <span class="hljs-number">9999</span>
INFO:     Will watch <span class="hljs-keyword">for</span> changes <span class="hljs-keyword">in</span> these directories: [<span class="hljs-string">&#x27;/home/xiaomage/milvus/chatbot/.venv&#x27;</span>]
INFO:     Uvicorn running <span class="hljs-keyword">on</span> http:<span class="hljs-comment">//0.0.0.0:9999 (Press CTRL+C to quit)</span>
INFO:     Started reloader process [<span class="hljs-number">2071374</span>] <span class="hljs-keyword">using</span> WatchFiles
INFO:     Started server process [<span class="hljs-number">2071376</span>]
INFO:     Waiting <span class="hljs-keyword">for</span> application startup.
INFO:     Application startup complete.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Nextjs-Frontend" class="common-anchor-header">Frontend Next.js</h3><p>Frontend mengirimkan kueri pengguna ke titik akhir FastAPI dan merender respons. Logika pengambilan inti:</p>
<p>javascript</p>
<pre><code translate="no">   <span class="hljs-keyword">try</span> {
      <span class="hljs-keyword">const</span> res = <span class="hljs-keyword">await</span> <span class="hljs-title function_">fetch</span>(<span class="hljs-string">&#x27;http://localhost:9999/chat&#x27;</span>, {
        <span class="hljs-attr">method</span>: <span class="hljs-string">&#x27;POST&#x27;</span>,
        <span class="hljs-attr">headers</span>: { <span class="hljs-string">&#x27;Content-Type&#x27;</span>: <span class="hljs-string">&#x27;application/json&#x27;</span> },
        <span class="hljs-attr">body</span>: <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>({ <span class="hljs-attr">query</span>: input }),
      });

      <span class="hljs-keyword">const</span> data = <span class="hljs-keyword">await</span> res.<span class="hljs-title function_">json</span>();
      <span class="hljs-keyword">const</span> <span class="hljs-attr">botMessage</span>: <span class="hljs-title class_">Message</span> = { <span class="hljs-attr">role</span>: <span class="hljs-string">&#x27;bot&#x27;</span>, <span class="hljs-attr">content</span>: data.<span class="hljs-property">answer</span> || <span class="hljs-string">&#x27;No response&#x27;</span> };
      <span class="hljs-title function_">setMessages</span>(<span class="hljs-function"><span class="hljs-params">prev</span> =&gt;</span> [...prev, userMessage, botMessage]);
    } <span class="hljs-keyword">catch</span> (error) {
      <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">error</span>(error);
      <span class="hljs-keyword">const</span> <span class="hljs-attr">botMessage</span>: <span class="hljs-title class_">Message</span> = { <span class="hljs-attr">role</span>: <span class="hljs-string">&#x27;bot&#x27;</span>, <span class="hljs-attr">content</span>: <span class="hljs-string">&#x27;Error connecting to server.&#x27;</span> };
      <span class="hljs-title function_">setMessages</span>(<span class="hljs-function"><span class="hljs-params">prev</span> =&gt;</span> [...prev, botMessage]);
    } <span class="hljs-keyword">finally</span> {
      <span class="hljs-title function_">setLoading</span>(<span class="hljs-literal">false</span>);
    }
<button class="copy-code-btn"></button></code></pre>
<p>Mulai frontend dengan:</p>
<pre><code translate="no">pnpm run dev -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

&gt; rag-chatbot@<span class="hljs-number">0.1</span><span class="hljs-number">.0</span> dev /home/xiaomage/milvus/chatbot-web/rag-chatbot
&gt; next dev --turbopack -H <span class="hljs-number">0.0</span><span class="hljs-number">.0</span><span class="hljs-number">.0</span> -p <span class="hljs-number">3000</span>

   ▲ <span class="hljs-title class_">Next</span>.<span class="hljs-property">js</span> <span class="hljs-number">15.5</span><span class="hljs-number">.3</span> (<span class="hljs-title class_">Turbopack</span>)
   - <span class="hljs-title class_">Local</span>:        <span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
   - <span class="hljs-title class_">Network</span>:      <span class="hljs-attr">http</span>:<span class="hljs-comment">//0.0.0.0:3000</span>

 ✓ <span class="hljs-title class_">Starting</span>...
 ✓ <span class="hljs-title class_">Ready</span> <span class="hljs-keyword">in</span> 1288ms
<button class="copy-code-btn"></button></code></pre>
<p>Buka <code translate="no">http://&lt;ip&gt;:3000/chat</code> di peramban Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_1_0832811fc8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
Ketik sebuah pertanyaan:</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> <span class="hljs-keyword">do</span> I install <span class="hljs-title class_">RustFS</span> <span class="hljs-keyword">in</span> <span class="hljs-title class_">Docker</span>?
<button class="copy-code-btn"></button></code></pre>
<p>Tanggapan antarmuka obrolan ::</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Milvus_Rust_FS_Vibe_Coding_Chatbot_4_91d679ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dan chatbot pun selesai dibuat.</p>
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
    </button></h2><p>Apa yang dimulai dari rasa ingin tahu tentang backend penyimpanan Milvus berubah menjadi chatbot RAG yang berfungsi penuh - dan jalur dari satu ke yang lain lebih pendek dari yang diharapkan. Berikut ini adalah apa yang tercakup dalam pembangunannya, dari ujung ke ujung:</p>
<ul>
<li><strong><a href="http://milvus.io">Milvus</a></strong> <strong>+</strong> <strong><a href="https://rustfs.com/">RustFS</a></strong> <strong>dengan Docker Compose.</strong> Milvus berjalan dalam mode mandiri dengan RustFS sebagai backend penyimpanan objeknya, menggantikan MinIO default. Total empat layanan: etcd, Milvus, RustFS, dan Attu.</li>
<li><strong>Vektorisasi basis pengetahuan.</strong> Dokumentasi RustFS - 80 berkas Markdown - dipotong-potong, disematkan dengan penyematan teks-3-besar, dan disimpan dalam Milvus sebagai 466 vektor.</li>
<li><strong>Pipa RAG.</strong> Pada waktu kueri, pertanyaan pengguna disematkan dengan cara yang sama, Milvus mengambil tiga potongan yang paling mirip secara semantik, dan GPT-5 menghasilkan jawaban yang didasarkan pada dokumen-dokumen tersebut.</li>
<li><strong>UI chatbot.</strong> FastAPI membungkus pipeline dalam satu titik akhir POST; Next.js menempatkan jendela obrolan di depannya. Tidak perlu lagi masuk ke terminal untuk mengajukan pertanyaan.</li>
</ul>
<p>Beberapa hal yang bisa saya ambil dari proses ini:</p>
<ul>
<li><strong><a href="https://milvus.io/docs">Dokumentasi Milvus</a></strong> <strong>sangat bagus.</strong> Terutama bagian penyebaran - jelas, lengkap, dan mudah diikuti.</li>
<li><strong><a href="https://rustfs.com/">RustFS</a></strong> <strong>sangat menyenangkan untuk digunakan sebagai backend penyimpanan objek.</strong> Menerapkannya ke MinIO membutuhkan lebih sedikit usaha daripada yang diharapkan.</li>
<li><strong>Pengkodean Vibe berjalan cepat, sampai ruang lingkup mengambil alih.</strong> Satu hal terus mengarah ke hal lain - Milvus ke RAG ke chatbot ke "mungkin saya harus melakukan Dockerize semuanya." Kebutuhan tidak menyatu dengan sendirinya.</li>
<li><strong>Debugging mengajarkan lebih dari sekadar membaca.</strong> Setiap kegagalan dalam build ini membuat bagian selanjutnya lebih cepat daripada dokumentasi mana pun.</li>
</ul>
<p>Semua kode dari build ini ada di <a href="https://github.com/majinghe/chatbot"></a> github<a href="https://github.com/majinghe/chatbot">.com/majinghe/chatbot</a>. Jika Anda ingin mencoba <a href="http://milvus.io">Milvus</a> sendiri, <a href="https://milvus.io/docs/quickstart.md">quickstart</a> adalah tempat yang baik untuk memulai. Jika Anda ingin membicarakan apa yang sedang Anda bangun atau menemukan sesuatu yang tidak terduga, datang dan temui kami di <a href="https://milvus.io/slack">Milvus Slack</a>. Jika Anda lebih suka melakukan percakapan khusus, Anda juga dapat <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">memesan slot pada jam kerja</a>.</p>
