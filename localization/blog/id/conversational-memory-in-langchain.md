---
id: conversational-memory-in-langchain.md
title: Memori Percakapan di LangChain
author: Yujian Tang
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/Conversational_Memory_in_Lang_Chain_7c1b4b7ba9.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/conversational-memory-in-langchain.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_7c1b4b7ba9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain adalah kerangka kerja yang kuat untuk membangun aplikasi LLM. Namun, dengan kekuatan itu, ada sedikit kerumitan. LangChain menyediakan banyak cara untuk meminta LLM dan fitur-fitur penting seperti memori percakapan. Memori percakapan menawarkan konteks bagi LLM untuk mengingat obrolan Anda.</p>
<p>Dalam tulisan ini, kita akan melihat bagaimana cara menggunakan memori percakapan dengan LangChain dan Milvus. Untuk mengikutinya, Anda perlu <code translate="no">pip</code> menginstal empat pustaka dan kunci API OpenAI. Empat library yang Anda butuhkan dapat diinstal dengan menjalankan <code translate="no">pip install langchain milvus pymilvus python-dotenv</code>. Atau menjalankan blok pertama di <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">Notebook CoLab</a> untuk artikel ini.</p>
<p>Dalam tulisan ini, kita akan belajar tentang:</p>
<ul>
<li>Memori Percakapan dengan LangChain</li>
<li>Menyiapkan Konteks Percakapan</li>
<li>Meminta Memori Percakapan dengan LangChain</li>
<li>Rangkuman Memori Percakapan LangChain</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">Memori Percakapan dengan LangChain<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam kondisi default, Anda berinteraksi dengan LLM melalui satu perintah. Menambahkan memori untuk konteks, atau "memori percakapan" berarti Anda tidak perlu lagi mengirim semuanya melalui satu prompt. LangChain menawarkan kemampuan untuk menyimpan percakapan yang telah Anda lakukan dengan LLM untuk mengambil informasi tersebut di kemudian hari.</p>
<p>Untuk mengatur memori percakapan yang persisten dengan penyimpanan vektor, kita membutuhkan enam modul dari LangChain. Pertama, kita harus mendapatkan <code translate="no">OpenAIEmbeddings</code> dan <code translate="no">OpenAI</code> LLM. Kita juga membutuhkan <code translate="no">VectorStoreRetrieverMemory</code> dan versi LangChain dari <code translate="no">Milvus</code> untuk menggunakan backend penyimpanan vektor. Kemudian kita membutuhkan <code translate="no">ConversationChain</code> dan <code translate="no">PromptTemplate</code> untuk menyimpan percakapan kita dan menanyakannya.</p>
<p>Pustaka <code translate="no">os</code>, <code translate="no">dotenv</code>, dan <code translate="no">openai</code> terutama untuk tujuan operasional. Kita menggunakannya untuk memuat dan menggunakan kunci API OpenAI. Langkah penyiapan terakhir adalah menjalankan instance <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> lokal. Kita melakukan ini dengan menggunakan <code translate="no">default_server</code> dari paket Milvus Python.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">embeddings</span>.<span class="hljs-property">openai</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAIEmbeddings</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">llms</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">memory</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">VectorStoreRetrieverMemory</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">chains</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">ConversationChain</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">prompts</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">PromptTemplate</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">vectorstores</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Milvus</span>
embeddings = <span class="hljs-title class_">OpenAIEmbeddings</span>()


<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">import</span> openai
<span class="hljs-title function_">load_dotenv</span>()
openai.<span class="hljs-property">api_key</span> = os.<span class="hljs-title function_">getenv</span>(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)


<span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
default_server.<span class="hljs-title function_">start</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">Menyiapkan Konteks Percakapan<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah semua prasyarat disiapkan, kita dapat melanjutkan untuk membuat memori percakapan. Langkah pertama kita adalah membuat koneksi ke server Milvus menggunakan LangChain. Selanjutnya, kita menggunakan kamus kosong untuk membuat koleksi LangChain Milvus. Sebagai tambahan, kita memasukkan embedding yang kita buat di atas dan detail koneksi untuk server Milvus Lite.</p>
<p>Untuk menggunakan basis data vektor untuk memori percakapan, kita perlu menginstansikannya sebagai retriever. Kita hanya mengambil 1 hasil teratas untuk kasus ini, dengan pengaturan <code translate="no">k=1</code>. Langkah pengaturan memori percakapan terakhir adalah menggunakan objek <code translate="no">VectorStoreRetrieverMemory</code> sebagai memori percakapan kita melalui koneksi retriever dan basis data vektor yang baru saja kita siapkan.</p>
<p>Untuk menggunakan memori percakapan kita, memori ini harus memiliki beberapa konteks di dalamnya. Jadi, mari kita berikan beberapa konteks pada memori tersebut. Untuk contoh ini, kita memberikan lima informasi. Mari kita simpan camilan favorit saya (cokelat), olahraga (berenang), bir (Guinness), makanan penutup (kue keju), dan musisi (Taylor Swift). Setiap entri disimpan ke memori melalui fungsi <code translate="no">save_context</code>.</p>
<pre><code translate="no">vectordb = Milvus.from_documents(
   {},
   embeddings,
   connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;127.0.0.1&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: default_server.listen_port})
retriever = Milvus.as_retriever(vectordb, search_kwargs=<span class="hljs-built_in">dict</span>(k=<span class="hljs-number">1</span>))
memory = VectorStoreRetrieverMemory(retriever=retriever)
about_me = [
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite snack is chocolate&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Nice&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite sport is swimming&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Cool&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite beer is Guinness&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Great&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite dessert is cheesecake&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Good to know&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite musician is Taylor Swift&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Same&quot;</span>}
]
<span class="hljs-keyword">for</span> example <span class="hljs-keyword">in</span> about_me:
   memory.save_context({<span class="hljs-string">&quot;input&quot;</span>: example[<span class="hljs-string">&quot;input&quot;</span>]}, {<span class="hljs-string">&quot;output&quot;</span>: example[<span class="hljs-string">&quot;output&quot;</span>]})
<button class="copy-code-btn"></button></code></pre>
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">Meminta Memori Percakapan dengan LangChain<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Saatnya untuk melihat bagaimana kita dapat menggunakan memori percakapan kita. Mari kita mulai dengan menghubungkan ke OpenAI LLM melalui LangChain. Kita menggunakan suhu 0 untuk mengindikasikan bahwa kita tidak ingin LLM kita menjadi kreatif.</p>
<p>Selanjutnya, kita membuat sebuah template. Kita memberi tahu LLM bahwa ia terlibat dalam percakapan ramah dengan manusia dan menyisipkan dua variabel. Variabel <code translate="no">history</code> menyediakan konteks dari memori percakapan. Variabel <code translate="no">input</code> menyediakan input saat ini. Kita menggunakan objek <code translate="no">PromptTemplate</code> untuk memasukkan variabel-variabel ini.</p>
<p>Kita menggunakan objek <code translate="no">ConversationChain</code> untuk menggabungkan prompt, LLM, dan memori. Sekarang kita siap untuk memeriksa memori percakapan kita dengan memberikan beberapa prompt. Kita mulai dengan memberi tahu LLM bahwa nama kita adalah Gary, saingan utama dalam seri Pokemon (semua yang lain dalam memori percakapan adalah fakta tentang saya).</p>
<pre><code translate="no">llm = OpenAI(temperature=<span class="hljs-number">0</span>) <span class="hljs-comment"># Can be any valid LLM</span>
_DEFAULT_TEMPLATE = <span class="hljs-string">&quot;&quot;&quot;The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.


Relevant pieces of previous conversation:
{history}


(You do not need to use these pieces of information if not relevant)


Current conversation:
Human: {input}
AI:&quot;&quot;&quot;</span>
PROMPT = PromptTemplate(
   input_variables=[<span class="hljs-string">&quot;history&quot;</span>, <span class="hljs-string">&quot;input&quot;</span>], template=_DEFAULT_TEMPLATE
)
conversation_with_summary = ConversationChain(
   llm=llm,
   prompt=PROMPT,
   memory=memory,
   verbose=<span class="hljs-literal">True</span>
)
conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Hi, my name is Gary, what&#x27;s up?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Gambar di bawah ini menunjukkan seperti apa respon yang diharapkan dari LLM. Dalam contoh ini, LLM merespons dengan mengatakan bahwa namanya adalah "AI".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sekarang mari kita uji memori sejauh ini. Kita gunakan objek <code translate="no">ConversationChain</code> yang telah kita buat sebelumnya dan menanyakan musisi favorit saya.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Gambar di bawah ini menunjukkan respons yang diharapkan dari Rantai Percakapan. Karena kita menggunakan opsi verbose, maka ia juga menunjukkan kepada kita percakapan yang relevan. Kita dapat melihat bahwa ia mengembalikan bahwa artis favorit saya adalah Taylor Swift, seperti yang diharapkan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Selanjutnya, mari kita periksa makanan penutup favorit saya - kue keju.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ketika kita menanyakan makanan penutup favorit saya, kita dapat melihat bahwa Rantai Percakapan sekali lagi mengambil informasi yang benar dari Milvus. Ia menemukan bahwa makanan penutup favorit saya adalah cheesecake, seperti yang saya katakan sebelumnya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sekarang setelah kita mengonfirmasi bahwa kita dapat meminta informasi yang kita berikan sebelumnya, mari kita periksa satu hal lagi - informasi yang kita berikan di awal percakapan. Kami memulai percakapan kami dengan memberi tahu AI bahwa nama kami adalah Gary.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Pemeriksaan terakhir kami menunjukkan bahwa rantai percakapan menyimpan sedikit informasi tentang nama kita di memori percakapan penyimpanan vektor. Rantai percakapan tersebut mengembalikan bahwa nama kita adalah Gary.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">Ringkasan Memori Percakapan Rantai Bahasa<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam tutorial ini, kita telah belajar bagaimana menggunakan memori percakapan di LangChain. LangChain menawarkan akses ke backend penyimpanan vektor seperti Milvus untuk memori percakapan yang persisten. Kita dapat menggunakan memori percakapan dengan menyuntikkan riwayat ke dalam permintaan kita dan menyimpan konteks historis di objek <code translate="no">ConversationChain</code>.</p>
<p>Untuk contoh tutorial ini, kami memberikan Rantai Percakapan lima fakta tentang saya dan berpura-pura menjadi saingan utama di Pokemon, Gary. Kemudian, kami mem-ping Rantai Percakapan dengan pertanyaan tentang pengetahuan apriori yang kami simpan - musisi dan makanan penutup favorit saya. Ia menjawab kedua pertanyaan ini dengan benar dan memunculkan entri yang relevan. Terakhir, kami bertanya tentang nama kami seperti yang diberikan di awal percakapan, dan dengan benar menjawab bahwa nama kami adalah "Gary."</p>
