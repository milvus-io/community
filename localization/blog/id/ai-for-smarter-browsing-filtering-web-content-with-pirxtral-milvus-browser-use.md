---
id: >-
  ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
title: >-
  AI untuk Penjelajahan yang Lebih Cerdas: Memfilter Konten Web dengan Pixtral,
  Milvus, dan Penggunaan Browser
author: Stephen Batifol
date: 2025-02-25T00:00:00.000Z
desc: >-
  Pelajari cara membuat asisten cerdas yang memfilter konten dengan
  menggabungkan Pixtral untuk analisis gambar, basis data vektor Milvus untuk
  penyimpanan, dan Penggunaan Browser untuk navigasi web.
cover: >-
  assets.zilliz.com/AI_for_Smarter_Browsing_Filtering_Web_Content_with_Pixtral_Milvus_and_Browser_Use_56d0154bbd.png
tag: Engineering
tags: >-
  Vector Database Milvus, AI Content Filtering, Pixtral Image Analysis, Browser
  Use Web Navigation, Intelligent Agent Development
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
---
<iframe width="100%" height="480" src="https://www.youtube.com/embed/4Xf4_Wfjk_Y" title="How to Build a Smart Social Media Agent with Milvus, Pixtral &amp; Browser Use" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>Sebagai Advokat Pengembang untuk Milvus, saya menghabiskan banyak waktu di Media Sosial, mendengarkan apa yang orang katakan tentang kami dan apakah saya bisa membantu juga. Ada sedikit benturan dunia ketika Anda mencari &quot;Milvus&quot;. Kata ini merupakan Vector DB dan genus burung, yang berarti bahwa pada satu saat saya sedang membahas tentang algoritma kemiripan vektor, di saat yang lain saya mengagumi foto-foto burung hitam yang terbang melintasi langit.</p>
<p>Meskipun kedua topik tersebut menarik, namun menggabungkan keduanya tidak terlalu membantu dalam kasus saya, bagaimana jika ada cara cerdas untuk menyelesaikan masalah ini tanpa saya harus memeriksa secara manual?</p>
<p>Mari kita buat sesuatu yang lebih cerdas - dengan menggabungkan pemahaman visual dengan kesadaran konteks, kita bisa membuat asisten yang mengetahui perbedaan antara pola migrasi layang-layang hitam dan artikel baru dari kita.</p>
<h2 id="The-tech-stack" class="common-anchor-header">Tumpukan teknologi<button data-href="#The-tech-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami menggabungkan tiga teknologi yang berbeda:</p>
<ul>
<li><strong>Penggunaan Peramban:</strong> Alat ini menavigasi berbagai situs web (misalnya, Twitter) untuk mengambil konten.</li>
<li><strong>Pixtral</strong>: Sebuah model bahasa visi yang menganalisis gambar dan konteks. Dalam contoh ini, alat ini membedakan antara diagram teknis tentang Vector DB kami dan foto burung yang menakjubkan.</li>
<li><strong>Milvus:</strong> DB Vektor berkinerja tinggi dan bersumber terbuka. Di sinilah kita akan menyimpan tulisan yang relevan untuk kueri nanti.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/the_tech_stack_ad695ccf9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Seeing-it-in-action" class="common-anchor-header">Melihatnya beraksi<button data-href="#Seeing-it-in-action" class="anchor-icon" translate="no">
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
    </button></h2><p>Mari kita lihat 2 postingan tersebut:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langchian_tweet_1_with_Milvus_f2bd988503.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Tweet_2_with_Bird_4b534efced.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk yang di sebelah kiri, Pixtral mengenali bahwa ini adalah tulisan tentang Milvus, Vector DB. Disebutkan beberapa detail implementasi, tetapi juga sebuah gambar yang menunjukkan diagram sistem, yang menunjukkan bahwa ini memang tentang Vector DB. Kita dapat melihat di bawah ini bahwa Pixtral juga memiliki pemikiran yang sama.</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: <span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
<span class="hljs-number">1.</span> Navigated to the post URL. <span class="hljs-number">2.</span> Extracted relevant post content. <span class="hljs-number">3.</span> Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB.
INFO     [src.agent.custom_agent] 📋 Future Plans:
<span class="hljs-number">1.</span> Summarize the findings <span class="hljs-keyword">and</span> confirm the relevance to Milvus. <span class="hljs-number">2.</span> Complete the task by providing a clear <span class="hljs-keyword">and</span> concise report.
INFO     [src.agent.custom_agent] 🤔 Thought: The task required analyzing the post content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB, ignoring <span class="hljs-built_in">any</span> content about birds <span class="hljs-keyword">or</span> photography. The extracted content <span class="hljs-keyword">is</span> entirely relevant to Milvus <span class="hljs-keyword">and</span> its applications <span class="hljs-keyword">in</span> vector search <span class="hljs-keyword">and</span> RAG systems. I will now summarize the findings <span class="hljs-keyword">and</span> complete the task.
INFO     [src.agent.custom_agent] 🎯 Summary: The post <span class="hljs-keyword">and</span> its replies are relevant to Milvus, the Vector DB, focusing on its use <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search. No content about birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post by LangChainAI discusses the &#x27;GraphRAG Agent,&#x27; which uses Neo4j and Milvus vector search to enhance RAG systems. Replies highlight the innovative use of Milvus for intelligent retrieval and vector search, with no mention of birds or photography. The content is entirely relevant to Milvus, the Vector DB.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies focus on the innovative use of Milvus <span class="hljs-keyword">for</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search alongside other technologies.
<span class="hljs-number">3.</span> No posts <span class="hljs-keyword">or</span> replies are related to birds <span class="hljs-keyword">or</span> photography.
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
<button class="copy-code-btn"></button></code></pre>
<p>Yang di sebelah kanan di sisi lain tidak, kita dapat melihat bahwa gambar ini, seindah apa pun itu, bukanlah tentang Vector DB. Kita bisa melihat seekor burung terbang di langit, oleh karena itu, Pixtral akan menganggap gambar ini tidak relevan.</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
Navigated to the post. Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB. No relevant information found.
INFO     [src.agent.custom_agent] 🤔 Thought: The content of the post <span class="hljs-keyword">and</span> comments only discusses birds <span class="hljs-keyword">and</span> photography. Since the task specifies ignoring such topics, there <span class="hljs-keyword">is</span> no relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. The task can now be concluded.
INFO     [src.agent.custom_agent] 🎯 Summary: The post does <span class="hljs-keyword">not</span> contain relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. I will conclude the task.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post and comments focus on birds and photography. No relevant information related to Milvus, the Vector DB, was found.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
<button class="copy-code-btn"></button></code></pre>
<p>Sekarang setelah kita menyaring postingan yang tidak kita inginkan, kita bisa menyimpan postingan yang relevan di Milvus. Memungkinkan untuk menanyakannya nanti menggunakan Pencarian Vektor atau Pencarian Teks Lengkap.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Browser_use_milvus_pixtral_39bf320a9f.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Storing-Data-in-Milvus" class="common-anchor-header">Menyimpan Data di Milvus<button data-href="#Storing-Data-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/enable-dynamic-field.md#Dynamic-Field">Dynamic Fields</a> adalah suatu keharusan dalam hal ini karena tidak selalu memungkinkan untuk menghormati skema yang diharapkan Milvus. Dengan Milvus, Anda cukup menggunakan <code translate="no">enable_dynamic_field=True</code> ketika membuat skema Anda, dan selesai. Berikut ini adalah cuplikan kode untuk menunjukkan prosesnya:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Create a Schema that handles Dynamic Fields</span>
schema = <span class="hljs-variable language_">self</span>.client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian kita mendefinisikan data yang ingin kita akses:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Prepare data with dynamic fields</span>
data = {
    <span class="hljs-string">&#x27;text&#x27;</span>: content_str,
    <span class="hljs-string">&#x27;vector&#x27;</span>: embedding,
    <span class="hljs-string">&#x27;url&#x27;</span>: url,
    <span class="hljs-string">&#x27;type&#x27;</span>: content_type,
    <span class="hljs-string">&#x27;metadata&#x27;</span>: json.dumps(metadata <span class="hljs-keyword">or</span> {})
}

<span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-variable language_">self</span>.client.insert(
    collection_name=<span class="hljs-variable language_">self</span>.collection_name,
    data=[data]
)
<button class="copy-code-btn"></button></code></pre>
<p>Penyiapan sederhana ini berarti Anda tidak perlu khawatir bahwa setiap field harus didefinisikan dengan sempurna di awal. Cukup siapkan skema untuk memungkinkan penambahan dinamis dan biarkan Milvus melakukan pekerjaan berat.</p>
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
    </button></h2><p>Dengan menggabungkan navigasi web Browser Use, pemahaman visual Pixtral, dan penyimpanan Milvus yang efisien, kami telah membangun asisten cerdas yang benar-benar memahami konteks. Sekarang saya menggunakannya untuk membedakan antara burung dan DB vektor, tetapi pendekatan yang sama dapat membantu masalah lain yang mungkin Anda hadapi.</p>
<p>Di sisi saya, saya ingin terus bekerja pada agen yang dapat membantu saya dalam pekerjaan sehari-hari untuk mengurangi beban kognitif saya 😌</p>
<h2 id="Wed-Love-to-Hear-What-You-Think" class="common-anchor-header">Kami Ingin Mendengar Pendapat Anda!<button data-href="#Wed-Love-to-Hear-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda menyukai artikel blog ini, mohon pertimbangkan:</p>
<ul>
<li>Memberi kami bintang di <a href="https://github.com/milvus-io/milvus">GitHub</a></li>
<li>💬 Bergabung dengan <a href="https://discord.gg/FG6hMJStWu">komunitas Milvus Discord</a> kami untuk berbagi pengalaman Anda atau jika Anda membutuhkan bantuan untuk membangun Agen</li>
<li>🔍 Menjelajahi <a href="https://github.com/milvus-io/bootcamp">repositori Bootcamp</a> kami untuk contoh-contoh aplikasi yang menggunakan Milvus</li>
</ul>
