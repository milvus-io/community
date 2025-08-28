---
id: >-
  langextract-milvus-a-practical-guide-to-building-a-hybrid-document-processing-and-search-system.md
title: >-
  LangExtract + Milvus: Panduan Praktis untuk Membangun Sistem Pemrosesan dan
  Pencarian Dokumen Hibrida
author: 'Cheney Zhang, Lumina Wang'
date: 2025-08-28T00:00:00.000Z
desc: >-
  Pelajari cara menggabungkan LangExtract dan Milvus untuk pencarian kode
  hibrida-mencapai pemfilteran yang tepat dengan pengambilan semantik dalam satu
  pipa cerdas.
cover: assets.zilliz.com/Langextract_1c4d9835a4.png
tag: Tutorials
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'LangExtract, Milvus, hybrid search, code search, semantic retrieval'
meta_title: |
  Hybrid Code Search with LangExtract and Milvus
origin: >-
  https://milvus.io/blog/langextract-milvus-a-practical-guide-to-building-a-hybrid-document-processing-and-search-system.md
---
<p>Di <a href="https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md">blog sebelumnya</a>, kami membandingkan dua pendekatan populer untuk pencarian kode di banyak agen pengkodean:</p>
<ul>
<li><p><strong>RAG yang didukung pencarian vektor (pencarian semantik</strong> ) - digunakan oleh alat bantu seperti Cursor</p></li>
<li><p><strong>Pencarian kata kunci dengan</strong> <code translate="no">grep</code> <strong>(pencocokan string literal)</strong> - digunakan oleh Claude Code dan Gemini</p></li>
</ul>
<p>Postingan tersebut memicu banyak umpan balik. Beberapa pengembang berargumen untuk RAG, menunjukkan bahwa <code translate="no">grep</code> sering menyertakan kecocokan yang tidak relevan dan membengkakkan konteks. Yang lain membela pencarian kata kunci, mengatakan bahwa ketepatan adalah segalanya dan penyematan masih terlalu kabur untuk dipercaya.</p>
<p>Kedua belah pihak ada benarnya. Kenyataannya, tidak ada solusi yang sempurna dan cocok untuk semua.</p>
<ul>
<li><p>Hanya mengandalkan penyematan, dan Anda akan kehilangan aturan yang ketat atau pencocokan yang tepat.</p></li>
<li><p>Hanya mengandalkan kata kunci, dan Anda akan kehilangan pemahaman semantik tentang apa arti sebenarnya dari kode (atau teks).</p></li>
</ul>
<p>Tutorial ini mendemonstrasikan sebuah metode untuk <strong>menggabungkan kedua pendekatan tersebut secara cerdas</strong>. Kami akan menunjukkan kepada Anda cara menggunakan <a href="https://github.com/google/langextract">LangExtract-perpustakaan</a>Python yang menggunakan LLM untuk mengubah teks yang berantakan menjadi data terstruktur dengan atribusi sumber yang tepat-bersama-sama dengan <a href="https://milvus.io/">Milvus</a>, basis data vektor berkinerja tinggi yang bersifat open source, untuk membangun sistem pemrosesan dan pengambilan dokumen yang lebih cerdas dan berkualitas tinggi.</p>
<h3 id="Key-Technologies-We’ll-Use" class="common-anchor-header">Teknologi Utama yang Akan Kami Gunakan</h3><p>Sebelum kita mulai membangun sistem pemrosesan dan pencarian dokumen ini, mari kita lihat teknologi-teknologi utama yang akan kita gunakan dalam tutorial ini.</p>
<h3 id="What-is-LangExtract" class="common-anchor-header">Apa itu LangExtract?</h3><p><a href="https://github.com/langextract/langextract">LangExtract</a> adalah pustaka Python baru, bersumber terbuka dari Google, yang memanfaatkan LLM untuk mengubah teks yang berantakan dan tidak terstruktur menjadi data terstruktur dengan atribusi sumber. Ini sudah populer (13 ribu+ bintang GitHub) karena membuat tugas-tugas seperti ekstraksi informasi menjadi sangat sederhana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c04bdf275b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
Fitur-fitur utamanya meliputi:</p>
<ul>
<li><p>Ekstraksi terstruktur: Tentukan skema dan ekstrak nama, tanggal, lokasi, biaya, dan informasi lain yang relevan.</p></li>
<li><p>Penelusuran sumber: Setiap bidang yang diekstrak ditautkan kembali ke teks asli, sehingga mengurangi kemungkinan halusinasi.</p></li>
<li><p>Timbangan untuk dokumen yang panjang: Menangani jutaan karakter dengan chunking + multi-threading.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6a4b42a265.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangExtract sangat berguna dalam domain seperti hukum, kesehatan, dan forensik, di mana ketepatan sangat penting. Sebagai contoh, alih-alih mengambil blok teks raksasa dengan RAG, LangExtract dapat mengekstrak hanya tanggal, klausa, atau demografi pasien yang Anda pedulikan-sambil tetap mempertahankan konteks semantik.</p>
<h3 id="What’s-Milvus" class="common-anchor-header">Apa itu Milvus?</h3><p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka dengan lebih dari 36 ribu+bintang di Github dan telah diadopsi oleh lebih dari 10 ribu perusahaan di berbagai industri. Milvus banyak digunakan dalam sistem RAG, Agen AI, mesin rekomendasi, deteksi anomali, dan pencarian semantik, menjadikannya blok bangunan inti untuk aplikasi yang didukung oleh AI.</p>
<h2 id="Building-a-High-Quality-Document-Processing-System-with-LangExtract-+-Milvus" class="common-anchor-header">Membangun Sistem Pemrosesan Dokumen Berkualitas Tinggi dengan LangExtract + Milvus<button data-href="#Building-a-High-Quality-Document-Processing-System-with-LangExtract-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Panduan ini memandu Anda melalui proses penggabungan <a href="https://github.com/google/langextract">LangExtract</a> dan<a href="https://milvus.io/"> Milvus</a> untuk membangun sistem pemrosesan dan pengambilan dokumen yang cerdas.</p>
<ul>
<li><p>LangExtract menghasilkan metadata yang bersih dan terstruktur, dan kemudian menyimpan + mencarinya secara efisien dengan Milvus, memberikan kita yang terbaik dari kedua dunia: pemfilteran yang tepat ditambah pengambilan semantik.</p></li>
<li><p>Milvus akan bertindak sebagai tulang punggung pencarian, menyimpan embedding (untuk pencarian semantik) dan metadata terstruktur yang diekstrak oleh LangExtract, memungkinkan kita untuk menjalankan kueri hibrida yang tepat dan cerdas dalam skala besar.</p></li>
</ul>
<h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><p>Sebelum terjun ke dalam, pastikan Anda telah menginstal dependensi berikut ini:</p>
<pre><code translate="no">! pip install --upgrade pymilvus langextract google-genai requests tqdm pandas
<button class="copy-code-btn"></button></code></pre>
<p>Kita akan menggunakan Gemini sebagai LLM untuk contoh ini. Anda harus menyiapkan<a href="https://aistudio.google.com/app/apikey"> kunci API</a> Anda sebagai variabel lingkungan:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;AIza*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-LangExtract-+-Milvus-Pipeline" class="common-anchor-header"><strong>Menyiapkan Pipa LangExtract + Milvus</strong></h3><p>Mari kita mulai dengan mendefinisikan pipeline yang menggunakan LangExtract untuk ekstraksi informasi terstruktur dan Milvus sebagai penyimpan vektor.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> langextract <span class="hljs-keyword">as</span> lx
<span class="hljs-keyword">import</span> textwrap
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.<span class="hljs-property">genai</span>.<span class="hljs-property">types</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">EmbedContentConfig</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>
<span class="hljs-keyword">import</span> uuid
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configuration-and-Setup" class="common-anchor-header"><strong>Konfigurasi dan Penyiapan</strong></h3><p>Sekarang kita akan mengonfigurasi parameter global untuk integrasi kita. Kita akan menggunakan model penyematan Gemini untuk menghasilkan representasi vektor untuk dokumen kita.</p>
<pre><code translate="no">genai_client = genai.Client()
COLLECTION_NAME = <span class="hljs-string">&quot;document_extractions&quot;</span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;gemini-embedding-001&quot;</span>
EMBEDDING_DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># Default dimension for gemini-embedding-001</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Initializing-the-Milvus-Client" class="common-anchor-header"><strong>Menginisialisasi Klien Milvus</strong></h3><p>Mari kita inisialisasi klien Milvus kita. Untuk mempermudah, kita akan menggunakan berkas basis data lokal, meskipun pendekatan ini dapat dengan mudah diterapkan pada server Milvus.</p>
<pre><code translate="no">client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Tentang parameter <code translate="no">MilvusClient</code>:</strong></p>
<p>Mengatur <code translate="no">uri</code> sebagai berkas lokal (seperti <code translate="no">./milvus.db</code>) adalah metode yang paling mudah karena secara otomatis menggunakan<a href="https://milvus.io/docs/milvus_lite.md"> Milvus Lite</a> untuk menyimpan semua data dalam berkas ini.</p>
<p>Untuk data berskala besar, Anda dapat menyiapkan server Milvus yang lebih berkinerja pada<a href="https://milvus.io/docs/quickstart.md"> Docker atau Kubernetes</a>. Dalam pengaturan ini, gunakan uri server (seperti[ <code translate="no">http://localhost:19530](http://localhost:19530)</code>) sebagai gantinya.</p>
<p>Jika Anda lebih memilih<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> (layanan cloud yang dikelola sepenuhnya untuk Milvus), sesuaikan <code translate="no">uri</code> dan <code translate="no">token</code> untuk mencocokkan<a href="https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details"> Public Endpoint dan kunci API</a> dari Zilliz Cloud.</p>
<h3 id="Preparing-Sample-Data" class="common-anchor-header"><strong>Mempersiapkan Data Sampel</strong></h3><p>Untuk demo ini, kita akan menggunakan deskripsi film sebagai dokumen sampel. Ini menunjukkan bagaimana LangExtract dapat mengekstrak informasi terstruktur seperti genre, karakter, dan tema dari teks yang tidak terstruktur.</p>
<pre><code translate="no">sample_documents = [
    <span class="hljs-string">&quot;John McClane fights terrorists in a Los Angeles skyscraper during Christmas Eve. The action-packed thriller features intense gunfights and explosive scenes.&quot;</span>,
    <span class="hljs-string">&quot;A young wizard named Harry Potter discovers his magical abilities at Hogwarts School. The fantasy adventure includes magical creatures and epic battles.&quot;</span>,
    <span class="hljs-string">&quot;Tony Stark builds an advanced suit of armor to become Iron Man. The superhero movie showcases cutting-edge technology and spectacular action sequences.&quot;</span>,
    <span class="hljs-string">&quot;A group of friends get lost in a haunted forest where supernatural creatures lurk. The horror film creates a terrifying atmosphere with jump scares.&quot;</span>,
    <span class="hljs-string">&quot;Two detectives investigate a series of mysterious murders in New York City. The crime thriller features suspenseful plot twists and dramatic confrontations.&quot;</span>,
    <span class="hljs-string">&quot;A brilliant scientist creates artificial intelligence that becomes self-aware. The sci-fi thriller explores the dangers of advanced technology and human survival.&quot;</span>,
    <span class="hljs-string">&quot;A romantic comedy about two friends who fall in love during a cross-country road trip. The drama explores personal growth and relationship dynamics.&quot;</span>,
    <span class="hljs-string">&quot;An evil sorcerer threatens to destroy the magical kingdom. A brave hero must gather allies and master ancient magic to save the fantasy world.&quot;</span>,
    <span class="hljs-string">&quot;Space marines battle alien invaders on a distant planet. The action sci-fi movie features futuristic weapons and intense combat in space.&quot;</span>,
    <span class="hljs-string">&quot;A detective investigates supernatural crimes in Victorian London. The horror thriller combines period drama with paranormal investigation themes.&quot;</span>,
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== LangExtract + Milvus Integration Demo ===&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Preparing to process <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_documents)}</span> documents&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Milvus-Collection" class="common-anchor-header"><strong>Menyiapkan Koleksi Milvus</strong></h3><p>Sebelum kita dapat menyimpan data yang telah diekstrak, kita perlu membuat koleksi Milvus dengan skema yang sesuai. Koleksi ini akan menyimpan teks dokumen asli, sematan vektor, dan bidang metadata yang diekstrak.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Setting up Milvus collection...&quot;</span>)

<span class="hljs-comment"># Drop existing collection if it exists</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Create collection schema</span>
schema = client.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
    description=<span class="hljs-string">&quot;Document extraction results and vector storage&quot;</span>,
)

<span class="hljs-comment"># Add fields - simplified to 3 main metadata fields</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;document_text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">10000</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(collection_name=COLLECTION_NAME, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully&quot;</span>)

<span class="hljs-comment"># Create vector index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
client.create_index(collection_name=COLLECTION_NAME, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Vector index created successfully&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Defining-the-Extraction-Schema" class="common-anchor-header"><strong>Menentukan Skema Ekstraksi</strong></h3><p>LangExtract menggunakan petunjuk dan contoh untuk memandu LLM dalam mengekstraksi informasi terstruktur. Mari kita tentukan skema ekstraksi kita untuk deskripsi film, dengan menentukan secara tepat informasi apa yang akan diekstrak dan bagaimana mengkategorikannya.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Extracting tags from documents...&quot;</span>)

<span class="hljs-comment"># Define extraction prompt - for movie descriptions, specify attribute value ranges</span>
prompt = textwrap.dedent(
    <span class="hljs-string">&quot;&quot;</span><span class="hljs-string">&quot;\
    Extract movie genre, main characters, and key themes from movie descriptions.
    Use exact text for extractions. Do not paraphrase or overlap entities.
    
    For each extraction, provide attributes with values from these predefined sets:
    
    Genre attributes:
    - primary_genre: [&quot;</span>action<span class="hljs-string">&quot;, &quot;</span>comedy<span class="hljs-string">&quot;, &quot;</span>drama<span class="hljs-string">&quot;, &quot;</span>horror<span class="hljs-string">&quot;, &quot;</span>sci-fi<span class="hljs-string">&quot;, &quot;</span>fantasy<span class="hljs-string">&quot;, &quot;</span>thriller<span class="hljs-string">&quot;, &quot;</span>crime<span class="hljs-string">&quot;, &quot;</span>superhero<span class="hljs-string">&quot;]
    - secondary_genre: [&quot;</span>action<span class="hljs-string">&quot;, &quot;</span>comedy<span class="hljs-string">&quot;, &quot;</span>drama<span class="hljs-string">&quot;, &quot;</span>horror<span class="hljs-string">&quot;, &quot;</span>sci-fi<span class="hljs-string">&quot;, &quot;</span>fantasy<span class="hljs-string">&quot;, &quot;</span>thriller<span class="hljs-string">&quot;, &quot;</span>crime<span class="hljs-string">&quot;, &quot;</span>superhero<span class="hljs-string">&quot;]
    
    Character attributes:
    - role: [&quot;</span>protagonist<span class="hljs-string">&quot;, &quot;</span>antagonist<span class="hljs-string">&quot;, &quot;</span>supporting<span class="hljs-string">&quot;]
    - type: [&quot;</span>hero<span class="hljs-string">&quot;, &quot;</span>villain<span class="hljs-string">&quot;, &quot;</span>detective<span class="hljs-string">&quot;, &quot;</span>military<span class="hljs-string">&quot;, &quot;</span>wizard<span class="hljs-string">&quot;, &quot;</span>scientist<span class="hljs-string">&quot;, &quot;</span>friends<span class="hljs-string">&quot;, &quot;</span>investigator<span class="hljs-string">&quot;]
    
    Theme attributes:
    - theme_type: [&quot;</span>conflict<span class="hljs-string">&quot;, &quot;</span>investigation<span class="hljs-string">&quot;, &quot;</span>personal_growth<span class="hljs-string">&quot;, &quot;</span>technology<span class="hljs-string">&quot;, &quot;</span>magic<span class="hljs-string">&quot;, &quot;</span>survival<span class="hljs-string">&quot;, &quot;</span>romance<span class="hljs-string">&quot;]
    - setting: [&quot;</span>urban<span class="hljs-string">&quot;, &quot;</span>space<span class="hljs-string">&quot;, &quot;</span>fantasy_world<span class="hljs-string">&quot;, &quot;</span>school<span class="hljs-string">&quot;, &quot;</span>forest<span class="hljs-string">&quot;, &quot;</span>victorian<span class="hljs-string">&quot;, &quot;</span>america<span class="hljs-string">&quot;, &quot;</span>future<span class="hljs-string">&quot;]
    
    Focus on identifying key elements that would be useful for movie search and filtering.&quot;</span><span class="hljs-string">&quot;&quot;</span>
)

<button class="copy-code-btn"></button></code></pre>
<h3 id="Providing-Examples-to-Improve-Extraction-Quality" class="common-anchor-header"><strong>Memberikan Contoh untuk Meningkatkan Kualitas Ekstraksi</strong></h3><p>Untuk meningkatkan kualitas dan konsistensi ekstraksi, kami akan menyediakan contoh-contoh yang dibuat dengan hati-hati untuk LangExtract. Contoh-contoh ini menunjukkan format yang diharapkan dan membantu model memahami persyaratan ekstraksi spesifik kami.</p>
<pre><code translate="no"><span class="hljs-comment"># Provide examples to guide the model - n-shot examples for movie descriptions</span>
<span class="hljs-comment"># Unify attribute keys to ensure consistency in extraction results</span>
examples = [
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;A space marine battles alien creatures on a distant planet. The sci-fi action movie features futuristic weapons and intense combat scenes.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;sci-fi action&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;sci-fi&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;action&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;space marine&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;military&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;battles alien creatures&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;conflict&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;space&quot;</span>},
            ),
        ],
    ),
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;A detective investigates supernatural murders in Victorian London. The horror thriller film combines period drama with paranormal elements.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;horror thriller&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;horror&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;thriller&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;detective&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;detective&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;supernatural murders&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;investigation&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;victorian&quot;</span>},
            ),
        ],
    ),
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;Two friends embark on a road trip adventure across America. The comedy drama explores friendship and self-discovery through humorous situations.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;comedy drama&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;comedy&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;drama&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;two friends&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;friends&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;friendship and self-discovery&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;personal_growth&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;america&quot;</span>},
            ),
        ],
    ),
]

<span class="hljs-comment"># Extract from each document</span>
extraction_results = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> sample_documents:
    result = lx.extract(
        text_or_documents=doc,
        prompt_description=prompt,
        examples=examples,
        model_id=<span class="hljs-string">&quot;gemini-2.0-flash&quot;</span>,
    )
    extraction_results.append(result)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully extracted from document: <span class="hljs-subst">{doc[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Completed tag extraction, processed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(extraction_results)}</span> documents&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-title class_">Successfully</span> extracted <span class="hljs-keyword">from</span> <span class="hljs-attr">document</span>: <span class="hljs-title class_">John</span> <span class="hljs-title class_">McClane</span> fights terrorists <span class="hljs-keyword">in</span> a <span class="hljs-title class_">Los</span> <span class="hljs-title class_">Angeles</span>...
...
<span class="hljs-title class_">Completed</span> tag extraction, processed <span class="hljs-number">10</span> documents
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_7f539fec12.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Processing-and-Vectorizing-Results" class="common-anchor-header"><strong>Memproses dan Membuat Vektor Hasil</strong></h3><p>Sekarang kita perlu memproses hasil ekstraksi kita dan menghasilkan penyematan vektor untuk setiap dokumen. Kita juga akan meratakan atribut yang diekstrak ke dalam bidang yang terpisah agar mudah dicari di Milvus.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n3. Processing extraction results and generating vectors...&quot;</span>)

processed_data = []

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> extraction_results:
    <span class="hljs-comment"># Generate vectors for documents</span>
    embedding_response = genai_client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=[result.text],
        config=EmbedContentConfig(
            task_type=<span class="hljs-string">&quot;RETRIEVAL_DOCUMENT&quot;</span>,
            output_dimensionality=EMBEDDING_DIM,
        ),
    )
    embedding = embedding_response.embeddings[<span class="hljs-number">0</span>].values
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated vector: <span class="hljs-subst">{result.text[:<span class="hljs-number">30</span>]}</span>...&quot;</span>)

    <span class="hljs-comment"># Initialize data structure, flatten attributes into separate fields</span>
    data_entry = {
        <span class="hljs-string">&quot;id&quot;</span>: result.document_id <span class="hljs-keyword">or</span> <span class="hljs-built_in">str</span>(uuid.uuid4()),
        <span class="hljs-string">&quot;document_text&quot;</span>: result.text,
        <span class="hljs-string">&quot;embedding&quot;</span>: embedding,
        <span class="hljs-comment"># Initialize all possible fields with default values</span>
        <span class="hljs-string">&quot;genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;character_role&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;character_type&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;theme_setting&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
    }

    <span class="hljs-comment"># Process extraction results, flatten attributes</span>
    <span class="hljs-keyword">for</span> extraction <span class="hljs-keyword">in</span> result.extractions:
        <span class="hljs-keyword">if</span> extraction.extraction_class == <span class="hljs-string">&quot;genre&quot;</span>:
            <span class="hljs-comment"># Flatten genre attributes</span>
            data_entry[<span class="hljs-string">&quot;genre&quot;</span>] = extraction.extraction_text
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            data_entry[<span class="hljs-string">&quot;primary_genre&quot;</span>] = attrs.get(<span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
            data_entry[<span class="hljs-string">&quot;secondary_genre&quot;</span>] = attrs.get(<span class="hljs-string">&quot;secondary_genre&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

        <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;character&quot;</span>:
            <span class="hljs-comment"># Flatten character attributes (take first main character&#x27;s attributes)</span>
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            <span class="hljs-keyword">if</span> (
                data_entry[<span class="hljs-string">&quot;character_role&quot;</span>] == <span class="hljs-string">&quot;unknown&quot;</span>
            ):  <span class="hljs-comment"># Only take first character&#x27;s attributes</span>
                data_entry[<span class="hljs-string">&quot;character_role&quot;</span>] = attrs.get(<span class="hljs-string">&quot;role&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
                data_entry[<span class="hljs-string">&quot;character_type&quot;</span>] = attrs.get(<span class="hljs-string">&quot;type&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

        <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;theme&quot;</span>:
            <span class="hljs-comment"># Flatten theme attributes (take first main theme&#x27;s attributes)</span>
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            <span class="hljs-keyword">if</span> (
                data_entry[<span class="hljs-string">&quot;theme_type&quot;</span>] == <span class="hljs-string">&quot;unknown&quot;</span>
            ):  <span class="hljs-comment"># Only take first theme&#x27;s attributes</span>
                data_entry[<span class="hljs-string">&quot;theme_type&quot;</span>] = attrs.get(<span class="hljs-string">&quot;theme_type&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
                data_entry[<span class="hljs-string">&quot;theme_setting&quot;</span>] = attrs.get(<span class="hljs-string">&quot;setting&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

    processed_data.append(data_entry)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Completed data processing, ready to insert <span class="hljs-subst">{<span class="hljs-built_in">len</span>(processed_data)}</span> records&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">3. Processing extraction results and generating vectors...
Successfully generated vector: John McClane fights terrorists...
...
Completed data processing, ready to insert 10 records

<button class="copy-code-btn"></button></code></pre>
<h3 id="Inserting-Data-into-Milvus" class="common-anchor-header"><strong>Memasukkan Data ke dalam Milvus</strong></h3><p>Dengan data yang telah diproses, mari kita masukkan ke dalam koleksi Milvus. Hal ini memungkinkan kita untuk melakukan pencarian semantik dan pemfilteran metadata yang tepat.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n4. Inserting data into Milvus...&quot;</span>)

<span class="hljs-keyword">if</span> processed_data:
    res = client.insert(collection_name=COLLECTION_NAME, data=processed_data)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(processed_data)}</span> documents into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Insert result: <span class="hljs-subst">{res}</span>&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-number">4.</span> Inserting data <span class="hljs-keyword">into</span> Milvus...
Successfully inserted <span class="hljs-number">10</span> documents <span class="hljs-keyword">into</span> Milvus
Insert result: {<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-string">&#x27;doc_f8797155&#x27;</span>, <span class="hljs-string">&#x27;doc_78c7e586&#x27;</span>, <span class="hljs-string">&#x27;doc_fa3a3ab5&#x27;</span>, <span class="hljs-string">&#x27;doc_64981815&#x27;</span>, <span class="hljs-string">&#x27;doc_3ab18cb2&#x27;</span>, <span class="hljs-string">&#x27;doc_1ea42b18&#x27;</span>, <span class="hljs-string">&#x27;doc_f0779243&#x27;</span>, <span class="hljs-string">&#x27;doc_386590b7&#x27;</span>, <span class="hljs-string">&#x27;doc_3b3ae1ab&#x27;</span>, <span class="hljs-string">&#x27;doc_851089d6&#x27;</span>]}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Demonstrating-Metadata-Filtering" class="common-anchor-header"><strong>Mendemonstrasikan Pemfilteran Metadata</strong></h3><p>Salah satu keuntungan utama dari menggabungkan LangExtract dengan Milvus adalah kemampuan untuk melakukan pemfilteran yang tepat berdasarkan metadata yang diekstrak. Mari kita lihat hal ini beraksi dengan beberapa pencarian ekspresi filter.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Filter Expression Search Examples ===&quot;</span>)

<span class="hljs-comment"># Load collection into memory for querying</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Loading collection into memory...&quot;</span>)
client.load_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection loaded successfully&quot;</span>)

<span class="hljs-comment"># Search for thriller movies</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Searching for thriller movies:&quot;</span>)
results = client.query(
    collection_name=COLLECTION_NAME,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;secondary_genre == &quot;thriller&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>],
    limit=<span class="hljs-number">5</span>,
)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;genre&#x27;</span>]}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>-<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;secondary_genre&#x27;</span>)}</span>)&quot;</span>
    )

<span class="hljs-comment"># Search for movies with military characters</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Searching for movies with military characters:&quot;</span>)
results = client.query(
    collection_name=COLLECTION_NAME,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;character_type == &quot;military&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;character_role&quot;</span>, <span class="hljs-string">&quot;character_type&quot;</span>],
    limit=<span class="hljs-number">5</span>,
)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;genre&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;  Character: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;character_role&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;character_type&#x27;</span>)}</span>)&quot;</span>
    )
=== Filter Expression Search Examples ===
Loading collection into memory...
Collection loaded successfully

<span class="hljs-number">1.</span> Searching <span class="hljs-keyword">for</span> thriller movies:
- A brilliant scientist creates artificial intelligence that becomes <span class="hljs-variable language_">self</span>-aware. The sci-fi thriller e...
  Genre: sci-fi thriller (sci-fi-thriller)
- Two detectives investigate a series of mysterious murders <span class="hljs-keyword">in</span> New York City. The crime thriller featu...
  Genre: crime thriller (crime-thriller)
- A detective investigates supernatural crimes <span class="hljs-keyword">in</span> Victorian London. The horror thriller combines perio...
  Genre: horror thriller (horror-thriller)
- John McClane fights terrorists <span class="hljs-keyword">in</span> a Los Angeles skyscraper during Christmas Eve. The action-packed t...
  Genre: action-packed thriller (action-thriller)

<span class="hljs-number">2.</span> Searching <span class="hljs-keyword">for</span> movies <span class="hljs-keyword">with</span> military characters:
- Space marines battle alien invaders on a distant planet. The action sci-fi movie features futuristic...
  Genre: action sci-fi
  Character: protagonist (military)
<button class="copy-code-btn"></button></code></pre>
<p>Sempurna! Hasil pencarian kami secara akurat sesuai dengan kondisi filter "thriller" dan "karakter militer".</p>
<h3 id="Combining-Semantic-Search-with-Metadata-Filtering" class="common-anchor-header"><strong>Menggabungkan Pencarian Semantik dengan Pemfilteran Metadata</strong></h3><p>Di sinilah kekuatan sebenarnya dari integrasi ini bersinar: menggabungkan pencarian vektor semantik dengan pemfilteran metadata yang tepat. Hal ini memungkinkan kita untuk menemukan konten yang mirip secara semantik sambil menerapkan batasan tertentu berdasarkan atribut yang diekstrak.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Semantic Search Examples ===&quot;</span>)

<span class="hljs-comment"># 1. Search for action-related content + only thriller genre</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Searching for action-related content + only thriller genre:&quot;</span>)
query_text = <span class="hljs-string">&quot;action fight combat battle explosion&quot;</span>

query_embedding_response = genai_client.models.embed_content(
    model=EMBEDDING_MODEL,
    contents=[query_text],
    config=EmbedContentConfig(
        task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
        output_dimensionality=EMBEDDING_DIM,
    ),
)
query_embedding = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values

results = client.search(
    collection_name=COLLECTION_NAME,
    data=[query_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    limit=<span class="hljs-number">3</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;secondary_genre == &quot;thriller&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
)

<span class="hljs-keyword">if</span> results:
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- Similarity: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Text: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
        <span class="hljs-built_in">print</span>(
            <span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;genre&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>-<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;secondary_genre&#x27;</span>)}</span>)&quot;</span>
        )

<span class="hljs-comment"># 2. Search for magic-related content + fantasy genre + conflict theme</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Searching for magic-related content + fantasy genre + conflict theme:&quot;</span>)
query_text = <span class="hljs-string">&quot;magic wizard spell fantasy magical&quot;</span>

query_embedding_response = genai_client.models.embed_content(
    model=EMBEDDING_MODEL,
    contents=[query_text],
    config=EmbedContentConfig(
        task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
        output_dimensionality=EMBEDDING_DIM,
    ),
)
query_embedding = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values

results = client.search(
    collection_name=COLLECTION_NAME,
    data=[query_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    limit=<span class="hljs-number">3</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;primary_genre == &quot;fantasy&quot; and theme_type == &quot;conflict&quot;&#x27;</span>,
    output_fields=[
        <span class="hljs-string">&quot;document_text&quot;</span>,
        <span class="hljs-string">&quot;genre&quot;</span>,
        <span class="hljs-string">&quot;primary_genre&quot;</span>,
        <span class="hljs-string">&quot;theme_type&quot;</span>,
        <span class="hljs-string">&quot;theme_setting&quot;</span>,
    ],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
)

<span class="hljs-keyword">if</span> results:
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- Similarity: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Text: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;genre&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>)&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Theme: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;theme_type&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;theme_setting&#x27;</span>)}</span>)&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Demo Complete ===&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">=== Semantic Search Examples ===

<span class="hljs-number">1.</span> Searching <span class="hljs-keyword">for</span> action-related content + only thriller genre:
- Similarity: <span class="hljs-number">0.6947</span>
  Text: John McClane fights terrorists in a Los Angeles skyscraper during Christmas Eve. The action-packed t...
  Genre: action-packed <span class="hljs-title function_">thriller</span> <span class="hljs-params">(action-thriller)</span>
- Similarity: <span class="hljs-number">0.6128</span>
  Text: Two detectives investigate a series of mysterious murders in New York City. The crime thriller featu...
  Genre: crime <span class="hljs-title function_">thriller</span> <span class="hljs-params">(crime-thriller)</span>
- Similarity: <span class="hljs-number">0.5889</span>
  Text: A brilliant scientist creates artificial intelligence that becomes self-aware. The sci-fi thriller e...
  Genre: sci-fi <span class="hljs-title function_">thriller</span> <span class="hljs-params">(sci-fi-thriller)</span>

<span class="hljs-number">2.</span> Searching <span class="hljs-keyword">for</span> magic-related content + fantasy genre + conflict theme:
- Similarity: <span class="hljs-number">0.6986</span>
  Text: An evil sorcerer threatens to destroy the magical kingdom. A brave hero must gather allies and maste...
  Genre: fantasy (fantasy)
  Theme: conflict (fantasy_world)

=== Demo Complete ===
<button class="copy-code-btn"></button></code></pre>
<p>Seperti yang Anda lihat, hasil pencarian semantik kami menggunakan Milvus memenuhi syarat filter genre dan menunjukkan relevansi yang tinggi dengan konten teks kueri kami.</p>
<h2 id="What-Youve-Built-and-What-It-Means" class="common-anchor-header">Apa yang Telah Anda Bangun dan Apa Artinya<button data-href="#What-Youve-Built-and-What-It-Means" class="anchor-icon" translate="no">
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
    </button></h2><p>Anda sekarang memiliki sistem pemrosesan dokumen hibrida yang menggabungkan ekstraksi terstruktur dengan pencarian semantik-tidak perlu lagi memilih antara akurasi dan fleksibilitas. Pendekatan ini memaksimalkan nilai data yang tidak terstruktur sekaligus memastikan keandalannya, sehingga ideal untuk skenario berisiko tinggi di bidang keuangan, perawatan kesehatan, dan hukum.</p>
<p>Prinsip yang sama dapat diterapkan di seluruh industri: menggabungkan analisis gambar terstruktur dengan pencarian semantik untuk rekomendasi e-commerce yang lebih baik, atau menerapkannya pada konten video untuk meningkatkan penggalian data mengemudi secara otonom.</p>
<p>Untuk penerapan skala besar yang mengelola set data multimodal yang sangat besar, <strong>vektor data lake</strong> kami yang akan datang akan menawarkan penyimpanan dingin yang jauh lebih hemat biaya, dukungan tabel yang luas, dan pemrosesan ETL yang efisien-evolusi alamiah untuk sistem pencarian hibrida skala produksi. Pantau terus.</p>
<p>Ada pertanyaan atau ingin membagikan hasil penelitian Anda? Bergabunglah dalam percakapan di<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> atau terhubung dengan komunitas kami di <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
