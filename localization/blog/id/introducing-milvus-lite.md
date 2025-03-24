---
id: introducing-milvus-lite.md
title: >-
  Memperkenalkan Milvus Lite: Mulai Membangun Aplikasi GenAI dalam Hitungan
  Detik
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Kami dengan senang hati memperkenalkan <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, database vektor ringan yang berjalan secara lokal di dalam aplikasi Python Anda. Berdasarkan basis data vektor <a href="https://milvus.io/intro">Milvus</a> sumber terbuka yang populer, Milvus Lite menggunakan kembali komponen inti untuk pengindeksan vektor dan penguraian kueri sambil menghilangkan elemen yang dirancang untuk skalabilitas tinggi dalam sistem terdistribusi. Desain ini membuat solusi yang ringkas dan efisien yang ideal untuk lingkungan dengan sumber daya komputasi yang terbatas, seperti laptop, Notebook Jupyter, dan perangkat seluler atau perangkat edge.</p>
<p>Milvus Lite terintegrasi dengan berbagai tumpukan pengembangan AI seperti LangChain dan LlamaIndex, memungkinkan penggunaannya sebagai penyimpan vektor dalam pipeline Retrieval Augmented Generation (RAG) tanpa perlu pengaturan server. Cukup jalankan <code translate="no">pip install pymilvus</code> (versi 2.4.3 atau lebih tinggi) untuk memasukkannya ke dalam aplikasi AI Anda sebagai pustaka Python.</p>
<p>Milvus Lite berbagi API Milvus, memastikan bahwa kode sisi klien Anda berfungsi untuk penerapan lokal berskala kecil dan server Milvus yang digunakan di Docker atau Kubernetes dengan miliaran vektor.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/5bMcZgPgPVxSuoi1M2vn1p?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Mengapa Kami Membangun Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Banyak aplikasi AI memerlukan pencarian kesamaan vektor untuk data yang tidak terstruktur, termasuk teks, gambar, suara, dan video, untuk aplikasi seperti chatbot dan asisten belanja. Basis data vektor dibuat untuk menyimpan dan mencari penyematan vektor dan merupakan bagian penting dari tumpukan pengembangan AI, terutama untuk kasus penggunaan AI generatif seperti <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG</a>).</p>
<p>Terlepas dari ketersediaan berbagai solusi pencarian vektor, opsi yang mudah dimulai yang juga berfungsi untuk penerapan produksi skala besar tidak ada. Sebagai pencipta Milvus, kami merancang Milvus Lite untuk membantu pengembang AI membangun aplikasi dengan lebih cepat sekaligus memastikan pengalaman yang konsisten di berbagai opsi penerapan, termasuk Milvus di Kubernetes, Docker, dan layanan cloud terkelola.</p>
<p>Milvus Lite adalah tambahan penting untuk rangkaian penawaran kami dalam ekosistem Milvus. Milvus Lite menyediakan alat serbaguna bagi para pengembang yang mendukung setiap tahap perjalanan pengembangan mereka. Dari pembuatan prototipe hingga lingkungan produksi dan dari komputasi edge hingga penerapan skala besar, Milvus sekarang menjadi satu-satunya database vektor yang mencakup kasus penggunaan dalam berbagai ukuran dan semua tahap pengembangan.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Cara Kerja Milvus Lite<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite mendukung semua operasi dasar yang tersedia di Milvus, seperti membuat koleksi dan menyisipkan, mencari, dan menghapus vektor. Ini akan segera mendukung fitur-fitur canggih seperti pencarian hibrida. Milvus Lite memuat data ke dalam memori untuk pencarian yang efisien dan menyimpannya sebagai file SQLite.</p>
<p>Milvus Lite disertakan dalam <a href="https://github.com/milvus-io/pymilvus">Python SDK dari Milvus</a> dan dapat digunakan dengan <code translate="no">pip install pymilvus</code>. Cuplikan kode berikut ini mendemonstrasikan bagaimana mengatur basis data vektor dengan Milvus Lite dengan menentukan nama file lokal dan kemudian membuat koleksi baru. Bagi mereka yang sudah terbiasa dengan API Milvus, satu-satunya perbedaan adalah bahwa <code translate="no">uri</code> merujuk pada nama file lokal dan bukannya titik akhir jaringan, misalnya, <code translate="no">&quot;milvus_demo.db&quot;</code> dan bukannya <code translate="no">&quot;http://localhost:19530&quot;</code> untuk server Milvus. Hal lainnya tetap sama. Milvus Lite juga mendukung penyimpanan teks mentah dan label lain sebagai metadata, menggunakan skema dinamis atau yang didefinisikan secara eksplisit, seperti yang ditunjukkan di bawah ini.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Untuk skalabilitas, aplikasi AI yang dikembangkan dengan Milvus Lite dapat dengan mudah bertransisi menggunakan Milvus yang digunakan di Docker atau Kubernetes hanya dengan menentukan <code translate="no">uri</code> dengan endpoint server.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">Integrasi dengan AI Development Stack<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Selain memperkenalkan Milvus Lite untuk mempermudah pencarian vektor, Milvus juga berintegrasi dengan banyak kerangka kerja dan penyedia tumpukan pengembangan AI, termasuk <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a>, dan <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>. Berkat peralatan dan layanan mereka yang luas, integrasi ini menyederhanakan pengembangan aplikasi AI dengan kemampuan pencarian vektor.</p>
<p>Dan ini baru permulaan - masih banyak lagi integrasi yang lebih menarik yang akan segera hadir! Pantau terus!</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">Sumber Daya dan Contoh Lainnya<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Jelajahi <a href="https://milvus.io/docs/quickstart.md">dokumentasi awal Milvus</a> untuk panduan terperinci dan contoh kode dalam menggunakan Milvus Lite untuk membangun aplikasi AI seperti Retrieval-Augmented Generation<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG)</a> dan <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">pencarian gambar</a>.</p>
<p>Milvus Lite adalah proyek sumber terbuka, dan kami menyambut kontribusi Anda. Lihat <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">Panduan Berkontribusi</a> untuk memulai. Anda juga dapat melaporkan bug atau meminta fitur dengan mengajukan masalah di repositori <a href="https://github.com/milvus-io/milvus-lite">GitHub Milvus Lite</a>.</p>
