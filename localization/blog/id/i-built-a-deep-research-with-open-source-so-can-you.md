---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: Saya Membangun Penelitian Mendalam dengan Open Source-dan Anda Juga Bisa!
author: Stefan Webb
date: 2025-02-6
desc: >-
  Pelajari cara membuat agen bergaya Deep Research menggunakan alat sumber
  terbuka seperti Milvus, DeepSeek R1, dan LangChain.
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sebenarnya, agen dengan cakupan minimal yang dapat bernalar, merencanakan, menggunakan alat bantu, dll. untuk melakukan penelitian menggunakan Wikipedia. Tetap saja, lumayan untuk beberapa jam kerja...</p>
<p>Kecuali jika Anda tinggal di bawah batu, di dalam gua, atau di biara pegunungan terpencil, Anda pasti sudah mendengar tentang rilis <em>Deep Research</em> dari OpenAI pada tanggal 2 Februari 2025. Produk baru ini menjanjikan untuk merevolusi cara kita menjawab pertanyaan yang membutuhkan sintesis sejumlah besar informasi yang beragam.</p>
<p>Anda mengetikkan pertanyaan Anda, memilih opsi Deep Research, dan platform secara mandiri mencari di web, melakukan penalaran atas apa yang ditemukannya, dan mensintesis berbagai sumber menjadi laporan yang koheren dan dikutip secara lengkap. Dibutuhkan beberapa kali lipat lebih lama untuk menghasilkan outputnya dibandingkan dengan chatbot standar, tetapi hasilnya lebih detail, lebih terinformasi, dan lebih bernuansa.</p>
<h2 id="How-does-it-work" class="common-anchor-header">Bagaimana cara kerjanya?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Tapi bagaimana cara kerja teknologi ini, dan mengapa Deep Research merupakan peningkatan yang nyata dari upaya sebelumnya (seperti Google <em>Deep Research</em> - peringatan sengketa merek dagang yang masuk)? Kami akan membahas yang terakhir ini di artikel mendatang. Sedangkan untuk yang pertama, tidak diragukan lagi ada banyak "saus rahasia" yang mendasari Deep Research. Kita bisa mendapatkan beberapa detail dari postingan rilis OpenAI, yang saya rangkum.</p>
<p><strong>Deep Research mengeksploitasi kemajuan terbaru dalam model fondasi yang dikhususkan untuk tugas-tugas penalaran:</strong></p>
<ul>
<li><p>"... disempurnakan pada model penalaran OpenAI o3 yang akan datang..."</p></li>
<li><p>"... memanfaatkan penalaran untuk mencari, menafsirkan, dan menganalisis teks dalam jumlah yang sangat besar..."</p></li>
</ul>
<p><strong>Deep Research memanfaatkan alur kerja agen yang canggih dengan perencanaan, refleksi, dan memori:</strong></p>
<ul>
<li><p>"... belajar untuk merencanakan dan melaksanakan lintasan multi-langkah..."</p></li>
<li><p>"... mundur ke belakang dan bereaksi terhadap informasi waktu nyata..."</p></li>
<li><p>"... berputar sesuai kebutuhan sebagai reaksi terhadap informasi yang ditemui..."</p></li>
</ul>
<p><strong>Deep Research dilatih menggunakan data milik sendiri, dengan menggunakan beberapa jenis penyempurnaan, yang kemungkinan besar merupakan komponen kunci dalam kinerjanya:</strong></p>
<ul>
<li><p>"... dilatih menggunakan pembelajaran penguatan end-to-end pada tugas-tugas penelusuran dan penalaran yang sulit di berbagai domain..."</p></li>
<li><p>"... dioptimalkan untuk penjelajahan web dan analisis data..."</p></li>
</ul>
<p>Desain yang tepat dari alur kerja agen adalah sebuah rahasia, namun, kita dapat membangun sesuatu sendiri berdasarkan ide-ide yang sudah mapan tentang bagaimana menyusun agen.</p>
<p><strong>Satu catatan sebelum kita mulai</strong>: Sangat mudah untuk terhanyut oleh demam AI Generatif, terutama ketika sebuah produk baru yang tampaknya merupakan sebuah langkah perbaikan dirilis. Namun, Deep Research, seperti yang diakui oleh OpenAI, memiliki keterbatasan yang umum terjadi pada teknologi AI Generatif. Kita harus ingat untuk berpikir kritis tentang output yang mungkin berisi fakta-fakta yang salah ("halusinasi"), format dan kutipan yang salah, dan sangat bervariasi dalam kualitas berdasarkan benih acak.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">Dapatkah saya membuat sendiri?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Tentu saja bisa! Mari kita bangun "Penelitian Mendalam" kita sendiri, yang dijalankan secara lokal dan dengan alat bantu sumber terbuka. Kita hanya perlu berbekal pengetahuan dasar tentang Generative AI, akal sehat, beberapa jam luang, GPU, dan <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a>, dan <a href="https://python.langchain.com/docs/introduction/">LangChain</a>.</p>
<p>Tentu saja, kami tidak dapat meniru kinerja OpenAI, tetapi prototipe kami akan mendemonstrasikan secara minimal beberapa ide utama yang mungkin mendasari teknologi mereka, menggabungkan kemajuan dalam model penalaran dengan kemajuan dalam alur kerja agen. Yang terpenting, dan tidak seperti OpenAI, kami hanya akan menggunakan alat bantu sumber terbuka, dan dapat menggunakan sistem kami secara lokal - sumber terbuka tentu saja memberikan fleksibilitas yang tinggi!</p>
<p>Kita akan membuat beberapa asumsi penyederhanaan untuk mengurangi ruang lingkup proyek kita:</p>
<ul>
<li><p>Kita akan menggunakan mode penalaran sumber terbuka yang disaring kemudian <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">dikuantisasi</a> untuk 4-bit yang dapat dijalankan secara lokal.</p></li>
<li><p>Kami tidak akan melakukan penyempurnaan tambahan pada model penalaran kami sendiri.</p></li>
<li><p>Satu-satunya alat yang dimiliki oleh agen kami adalah kemampuan untuk mengunduh dan membaca halaman Wikipedia dan melakukan kueri RAG yang terpisah (kami tidak akan memiliki akses ke seluruh web).</p></li>
<li><p>Agen kami hanya akan memproses data teks, bukan gambar, PDF, dll.</p></li>
<li><p>Agen kami tidak akan mundur atau mempertimbangkan pivot.</p></li>
<li><p>Agen kami akan (belum) mengontrol alur eksekusinya berdasarkan keluarannya.</p></li>
<li><p>Wikipedia berisi kebenaran, seluruh kebenaran, dan tidak ada yang lain selain kebenaran.</p></li>
</ul>
<p>Kita akan menggunakan <a href="https://milvus.io/docs">Milvus</a> untuk basis data vektor kita, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> sebagai model penalaran kita, dan <a href="https://python.langchain.com/docs/introduction/">LangChain</a> untuk mengimplementasikan RAG. Mari kita mulai!</p>
<custom-h1>Agen Minimal untuk Riset Online</custom-h1><p>Kita akan menggunakan model mental kita tentang bagaimana manusia melakukan penelitian untuk merancang alur kerja agen:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">Mendefinisikan/Menentukan Pertanyaan</h3><p>Riset dimulai dengan mendefinisikan sebuah pertanyaan. Kami menganggap pertanyaan tersebut sebagai pertanyaan pengguna, namun, kami menggunakan model penalaran kami untuk memastikan pertanyaan tersebut diungkapkan dengan cara yang spesifik, jelas, dan terfokus. Artinya, langkah pertama kami adalah menulis ulang permintaan dan mengekstrak subkueri atau subpertanyaan. Kami memanfaatkan spesialisasi model dasar kami secara efektif untuk penalaran, dan metode sederhana untuk keluaran terstruktur JSON.</p>
<p>Berikut ini adalah contoh penelusuran penalaran saat DeepSeek menyempurnakan pertanyaan "Bagaimana pemeran berubah dari waktu ke waktu?":</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">Pencarian</h3><p>Selanjutnya, kami melakukan "tinjauan literatur" terhadap artikel-artikel Wikipedia. Untuk saat ini, kami membaca satu artikel dan meninggalkan tautan navigasi ke iterasi berikutnya. Kami menemukan selama pembuatan prototipe bahwa eksplorasi tautan dapat menjadi sangat mahal jika setiap tautan memerlukan panggilan ke model penalaran. Kami mengurai artikel, dan menyimpan datanya dalam basis data vektor kami, Milvus, mirip dengan membuat catatan.</p>
<p>Berikut ini adalah cuplikan kode yang menunjukkan bagaimana kami menyimpan halaman Wikipedia kami di Milvus menggunakan integrasi LangChain:</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">Menganalisis</h3><p>Agen kembali ke pertanyaan-pertanyaannya dan menjawabnya berdasarkan informasi yang relevan di dalam dokumen. Kami akan meninggalkan alur kerja analisis/refleksi multi-langkah untuk pekerjaan di masa depan, serta pemikiran kritis tentang kredibilitas dan bias sumber kami.</p>
<p>Berikut ini adalah cuplikan kode yang mengilustrasikan pembuatan RAG dengan LangChain dan menjawab sub-pertanyaan kita secara terpisah.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">Mensintesis</h3><p>Setelah agen melakukan penelitian, ia membuat garis besar terstruktur, atau lebih tepatnya, kerangka, dari temuannya untuk dirangkum dalam laporan. Kemudian melengkapi setiap bagian, mengisinya dengan judul bagian dan konten yang sesuai. Kami meninggalkan alur kerja yang lebih canggih dengan refleksi, penyusunan ulang, dan penulisan ulang untuk iterasi berikutnya. Bagian agen ini melibatkan perencanaan, penggunaan alat, dan memori.</p>
<p>Lihat <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">buku catatan yang menyertai</a> untuk kode lengkap dan <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">file laporan yang disimpan</a> sebagai contoh keluaran.</p>
<h2 id="Results" class="common-anchor-header">Hasil<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertanyaan kami untuk pengujian adalah <em>"Bagaimana The Simpsons berubah dari waktu ke waktu?"</em> dan sumber datanya adalah artikel Wikipedia untuk "The Simpsons". Berikut ini adalah salah satu bagian dari <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">laporan yang dihasilkan</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">Ringkasan: Apa yang telah kami buat dan apa yang selanjutnya<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Hanya dalam beberapa jam, kami telah merancang alur kerja agen dasar yang dapat menalar, merencanakan, dan mengambil informasi dari Wikipedia untuk menghasilkan laporan penelitian yang terstruktur. Meskipun prototipe ini masih jauh dari Deep Research milik OpenAI, prototipe ini menunjukkan kekuatan alat sumber terbuka seperti Milvus, DeepSeek, dan LangChain dalam membangun agen penelitian otonom.</p>
<p>Tentu saja, ada banyak ruang untuk perbaikan. Iterasi di masa depan bisa saja terjadi:</p>
<ul>
<li><p>Memperluas di luar Wikipedia untuk mencari berbagai sumber secara dinamis</p></li>
<li><p>Memperkenalkan pelacakan mundur dan refleksi untuk menyempurnakan tanggapan</p></li>
<li><p>Mengoptimalkan alur eksekusi berdasarkan penalaran agen itu sendiri</p></li>
</ul>
<p>Sumber terbuka memberi kita fleksibilitas dan kontrol yang tidak dimiliki oleh sumber tertutup. Baik untuk penelitian akademis, sintesis konten, atau bantuan bertenaga AI, membangun agen penelitian kita sendiri membuka berbagai kemungkinan yang menarik. Nantikan tulisan berikutnya di mana kita akan mengeksplorasi penambahan pengambilan web secara real-time, penalaran multi-langkah, dan alur eksekusi bersyarat!</p>
<h2 id="Resources" class="common-anchor-header">Sumber daya<button data-href="#Resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Buku catatan: <em>"</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>Garis Dasar untuk Penelitian Mendalam Sumber Terbuka</em></a><em>"</em></p></li>
<li><p>Laporan: <em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>Evolusi The Simpsons sebagai sebuah pertunjukan dari waktu ke waktu, meliputi perubahan konten, humor, pengembangan karakter, animasi, dan perannya dalam masyarakat.</em></a><em>"</em></p></li>
<li><p><a href="https://milvus.io/docs">Dokumentasi basis data vektor Milvus</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">Halaman model DeepSeek R1 yang telah disaring dan dikuantifikasi</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">Pertanyaan Umum Penelitian Mendalam | Pusat Bantuan OpenAI</a></p></li>
</ul>
