---
id: building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
title: >-
  Dari Dokumen ke Dialog: Membangun Asisten AI yang Siap Produksi dengan Spring
  Boot dan Milvus
author: Gong Yi
date: 2025-06-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/From_Docs_to_Dialogue_Building_an_AI_Assistant_with_Spring_and_Milvus_b8a470549a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Spring Boot'
meta_title: |
  Building a Production-Ready AI Assistant with Spring Boot and Milvus
desc: >-
  Dengan menggabungkan Spring Boot, Milvus, dan Ollama, kami mengubah dokumen
  perusahaan yang statis menjadi percakapan yang dinamis dan sadar konteks ---
  dengan kemampuan pengamatan, memori, dan keamanan penuh.
origin: >-
  https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md
---
<p>Setiap perusahaan memiliki masalah yang sama: pengetahuan berharga yang terperangkap dalam PDF, dokumen Word, dan berbagi file yang tidak dapat ditemukan oleh siapa pun ketika mereka membutuhkannya. Tim dukungan menjawab pertanyaan yang sama berulang kali, sementara pengembang menghabiskan waktu berjam-jam mencari dokumentasi yang sudah ketinggalan zaman.</p>
<p><strong>Bagaimana jika dokumen Anda dapat menjawab pertanyaan secara langsung?</strong></p>
<p>Tutorial ini menunjukkan kepada Anda cara membuat asisten AI yang siap produksi:</p>
<ul>
<li><p>Mengubah dokumen statis Anda menjadi sistem Tanya Jawab yang cerdas</p></li>
<li><p>Mempertahankan konteks dan memori percakapan</p></li>
<li><p>Skala untuk menangani beban kerja perusahaan</p></li>
<li><p>Termasuk keamanan, pemantauan, dan pengamatan di luar kotak</p></li>
</ul>
<h2 id="What-Well-Build" class="common-anchor-header">Apa yang Akan Kita Bangun<button data-href="#What-Well-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Di akhir tutorial ini, Anda akan memiliki:</p>
<ul>
<li><p>Sebuah pipeline pemasukan dokumen yang memproses dokumen PDF dan Word</p></li>
<li><p>Sistem pencarian vektor yang diberdayakan oleh Milvus untuk pencarian semantik</p></li>
<li><p>API obrolan dengan kesadaran memori dan konteks</p></li>
<li><p>Keamanan dan pemantauan tingkat perusahaan</p></li>
<li><p>Contoh kerja lengkap yang dapat Anda terapkan</p></li>
</ul>
<h2 id="Key-Components-We’ll-Use" class="common-anchor-header">Komponen Utama yang Akan Kami Gunakan<button data-href="#Key-Components-We’ll-Use" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/spring-projects/spring-boot"><strong>Spring Boot</strong></a> adalah kerangka kerja Java yang banyak digunakan untuk membangun aplikasi backend dengan konfigurasi minimal. Framework ini menawarkan produktivitas pengembang yang kuat, integrasi tanpa batas dengan perkakas modern, dan dukungan bawaan untuk REST API, kemampuan pengamatan, dan keamanan.</p></li>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a> adalah basis data vektor sumber terbuka, berkinerja tinggi, dan asli cloud yang dirancang untuk pencarian semantik. Milvus memungkinkan Anda untuk menyimpan dan mencari sematan dengan latensi skala milidetik, bahkan di miliaran vektor.</p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation"><strong>RAG</strong></a> adalah arsitektur yang menggabungkan pengambilan dan pembuatan:<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation"><strong>RAG</strong></a> mengambil cuplikan pengetahuan yang relevan dari basis data vektor seperti Milvus, kemudian menggunakan model bahasa untuk membuat respons yang fasih dan kontekstual.</p></li>
<li><p><a href="https://ollama.com/"><strong>Ollama</strong></a>: Penyedia model AI lokal (kompatibel dengan OpenAI, sepenuhnya gratis)</p></li>
</ul>
<h2 id="Prerequisites" class="common-anchor-header">Prasyarat<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum memulai, pastikan Anda memiliki:</p>
<ul>
<li><p>Java 17+ sudah terinstal</p></li>
<li><p>Docker, Docker Compose</p></li>
<li><p>Git untuk mengkloning repositori contoh</p></li>
<li><p>Ollama terinstal dan berjalan secara lokal</p></li>
<li><p>Milvus (melalui Docker)</p></li>
<li><p>Spring Boot 3.5.0 + Spring AI 1.0.0</p></li>
<li><p>Mikrometer, Wadah uji</p></li>
</ul>
<h2 id="Environment-Setup" class="common-anchor-header">Penyiapan Lingkungan<button data-href="#Environment-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Kloning Repositori Contoh/: <a href="https://github.com/topikachu/spring-ai-rag">https://github.com/topikachu/spring-ai-rag</a></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/topikachu/spring-ai-rag
<span class="hljs-built_in">cd</span> spring-ai-rag
<button class="copy-code-btn"></button></code></pre>
<p>Verifikasi lingkungan Anda:</p>
<pre><code translate="no"><span class="hljs-comment"># Verify Docker is running correctly</span>
docker version
docker ps

<span class="hljs-comment"># Verify Java version</span>
java -version

<span class="hljs-comment"># Verify Ollama installation</span>
ollama --version
<button class="copy-code-btn"></button></code></pre>
<p>Unduh Ollama Models:</p>
<pre><code translate="no"><span class="hljs-comment"># Pull required models for this project</span>
ollama pull mistral          <span class="hljs-comment"># Chat model</span>
ollama pull nomic-embed-text <span class="hljs-comment"># Embedding model</span>

<span class="hljs-comment"># Verify models are available</span>
ollama <span class="hljs-built_in">list</span>
<button class="copy-code-btn"></button></code></pre>
<p>Konfigurasi Kunci (application.properties)</p>
<pre><code translate="no"><span class="hljs-comment"># Ollama Configuration (OpenAI-compatible API)</span>
spring.ai.openai.base-url=http://localhost:<span class="hljs-number">11434</span>
spring.ai.openai.chat.options.model=mistral
spring.ai.openai.embedding.options.model=nomic-embed-text
spring.ai.openai.embedding.options.dimensions=<span class="hljs-number">768</span>

<span class="hljs-comment"># Vector Store Configuration - dimensions must match embedding model</span>
spring.ai.vectorstore.milvus.embedding-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Document-ETL-Structuring-Unstructured-Text" class="common-anchor-header">ETL Dokumen: Menyusun Teks Tidak Terstruktur<button data-href="#Document-ETL-Structuring-Unstructured-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Bagian ini membahas inti dari sistem-mengubah file yang tidak terstruktur menjadi respons cerdas yang dapat dicari menggunakan penyematan vektor, pengindeksan Milvus, dan pipa RAG Spring AI.</p>
<p><strong>Ikhtisar Alur Kerja:</strong></p>
<ul>
<li><p>Gunakan <code translate="no">TikaDocReader</code> untuk membaca file PDF dan Word</p></li>
<li><p>Gunakan pemisahan berbasis token untuk memecah dokumen dengan tetap mempertahankan konteksnya</p></li>
<li><p>Hasilkan penyematan menggunakan model penyematan yang kompatibel dengan OpenAI</p></li>
<li><p>Menyimpan sematan di Milvus untuk pencarian semantik di kemudian hari</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow_7e9f990b18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Contoh Implementasi</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">Document</span>&gt; <span class="hljs-title function_">ingestionFlux</span>(<span class="hljs-params"></span>) {
  <span class="hljs-keyword">return</span> documentReader.<span class="hljs-title function_">getDocuments</span>()
          .<span class="hljs-title function_">flatMap</span>(<span class="hljs-variable language_">document</span> -&gt; {
            <span class="hljs-keyword">var</span> processChunks = <span class="hljs-title class_">Mono</span>.<span class="hljs-title function_">fromRunnable</span>(() -&gt; {
              <span class="hljs-keyword">var</span> chunks = textSplitter.<span class="hljs-title function_">apply</span>(<span class="hljs-title class_">List</span>.<span class="hljs-title function_">of</span>(<span class="hljs-variable language_">document</span>));
              vectorStore.<span class="hljs-title function_">write</span>(chunks); <span class="hljs-comment">// expensive operation</span>
            }).<span class="hljs-title function_">subscribeOn</span>(<span class="hljs-title class_">Schedulers</span>.<span class="hljs-title function_">boundedElastic</span>());

            <span class="hljs-keyword">return</span> <span class="hljs-title class_">Flux</span>.<span class="hljs-title function_">concat</span>(
                    <span class="hljs-title class_">Flux</span>.<span class="hljs-title function_">just</span>(<span class="hljs-variable language_">document</span>),
                    processChunks.<span class="hljs-title function_">then</span>(<span class="hljs-title class_">Mono</span>.<span class="hljs-title function_">empty</span>())
            );
          })
          .<span class="hljs-title function_">doOnComplete</span>(() -&gt; log.<span class="hljs-title function_">info</span>(<span class="hljs-string">&quot;RunIngestion() finished&quot;</span>))
          .<span class="hljs-title function_">doOnError</span>(e -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error during ingestion&quot;</span>, e));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="common-anchor-header">Penyimpanan Vektor: Pencarian Semantik Skala Milidetik dengan Milvus<button data-href="#Vector-Storage-Millisecond-Scale-Semantic-Search-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Contoh Konfigurasi:</p>
<pre><code translate="no">spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">initialize</span>-schema=<span class="hljs-literal">true</span>
spring.<span class="hljs-property">ai</span>.<span class="hljs-property">vectorstore</span>.<span class="hljs-property">milvus</span>.<span class="hljs-property">embedding</span>-dimension=<span class="hljs-number">768</span>
<button class="copy-code-btn"></button></code></pre>
<p>📌 C <strong>ontoh:</strong> Ketika pengguna bertanya &quot;Apakah Spring Boot mendukung pemrograman reaktif dengan WebFlux?&quot;, Milvus mengembalikan segmen dokumentasi terkait, dan model AI menghasilkan jawaban bahasa alami dengan detail implementasi yang spesifik.</p>
<h2 id="Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="common-anchor-header">Membangun Obrolan yang Mendukung RAG: Tanya Jawab Kontekstual dengan Integrasi Memori<button data-href="#Building-a-RAG-Enabled-Chat-Contextual-QA-with-Memory-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>Alur kerja inti:</p>
<ol>
<li><p>Pengguna mengajukan pertanyaan</p></li>
<li><p>Pencarian vektor mengambil potongan dokumen yang paling relevan</p></li>
<li><p>Sistem memuat konteks percakapan sebelumnya (melalui Redis)</p></li>
<li><p>Model AI menghasilkan respons yang mencakup konteks baru dan konteks historis</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_a_rag_chat_workflow_976dcd9aa2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Contoh Integrasi Pengambilan + Memori Obrolan:</p>
<pre><code translate="no">public <span class="hljs-title class_">ChatClient</span>.<span class="hljs-property">ChatClientRequestSpec</span> <span class="hljs-title function_">input</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
  <span class="hljs-keyword">return</span> chatClient.<span class="hljs-title function_">prompt</span>()
          .<span class="hljs-title function_">advisors</span>(
                  messageChatMemoryAdvisor,
                  retrievalAugmentationAdvisor
          )
          .<span class="hljs-title function_">advisors</span>(spec -&gt; spec.<span class="hljs-title function_">param</span>(<span class="hljs-variable constant_">CONVERSATION_ID</span>, conversationId))
          .<span class="hljs-title function_">user</span>(userInput);
}
<button class="copy-code-btn"></button></code></pre>
<p>Untuk pengalaman frontend yang lebih lancar, gunakan API aliran reaktif untuk mengembalikan konten <code translate="no">Flux</code> melalui peristiwa yang dikirim server (SSE) - ideal untuk efek "mengetik":</p>
<pre><code translate="no">public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">stream</span>(<span class="hljs-params"><span class="hljs-built_in">String</span> userInput, <span class="hljs-built_in">String</span> conversationId</span>) {
    <span class="hljs-keyword">return</span> <span class="hljs-title function_">input</span>(userInput, conversationId)
            .<span class="hljs-title function_">stream</span>().<span class="hljs-title function_">content</span>();
}
<button class="copy-code-btn"></button></code></pre>
<p>Pengontrol API REST:</p>
<pre><code translate="no">@<span class="hljs-title class_">PostMapping</span>(path = <span class="hljs-string">&quot;/chat&quot;</span>, produces = <span class="hljs-title class_">MediaType</span>.<span class="hljs-property">TEXT_EVENT_STREAM_VALUE</span>)
public <span class="hljs-title class_">Flux</span>&lt;<span class="hljs-title class_">String</span>&gt; <span class="hljs-title function_">chat</span>(<span class="hljs-params">@RequestBody ChatRequest chatRequest, @RequestParam() <span class="hljs-built_in">String</span> conversationId, Principal principal</span>) {
  <span class="hljs-keyword">var</span> conversationKey = <span class="hljs-title class_">String</span>.<span class="hljs-title function_">format</span>(<span class="hljs-string">&quot;%s:%s&quot;</span>, principal.<span class="hljs-title function_">getName</span>(), conversationId);
  <span class="hljs-keyword">return</span> chatService.<span class="hljs-title function_">stream</span>(chatRequest.<span class="hljs-property">userInput</span>, conversationKey)
          .<span class="hljs-title function_">doOnError</span>(exp -&gt; log.<span class="hljs-title function_">error</span>(<span class="hljs-string">&quot;Error in chat&quot;</span>, exp));
}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Enterprise-Grade-API-Security-and-System-Observability" class="common-anchor-header">Keamanan API Tingkat Perusahaan dan Keteramatan Sistem<button data-href="#Enterprise-Grade-API-Security-and-System-Observability" class="anchor-icon" translate="no">
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
    </button></h2><p>Bagian ini memastikan asisten AI Anda tidak hanya berfungsi, tetapi juga berjalan dengan aman, dapat dilacak, dan bekerja di bawah beban kerja dunia nyata.</p>
<h3 id="API-Security-Role-Based-Access-Control" class="common-anchor-header">Keamanan API: Kontrol Akses Berbasis Peran</h3><p><strong>Contoh: Mengamankan Titik Akhir Admin</strong></p>
<pre><code translate="no"><span class="hljs-meta">@Override</span>
<span class="hljs-keyword">protected</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">configure</span><span class="hljs-params">(HttpSecurity http)</span> <span class="hljs-keyword">throws</span> Exception {
    http
        .httpBasic()
        .and()
        .authorizeRequests(authz -&gt; authz
            .antMatchers(<span class="hljs-string">&quot;/api/v1/index&quot;</span>).hasRole(<span class="hljs-string">&quot;ADMIN&quot;</span>)
            .anyRequest().authenticated()
        );
}
<button class="copy-code-btn"></button></code></pre>
<p>💡 <strong>Tip Produksi:</strong> Untuk penerapan di dunia nyata, gunakan OAuth2 atau JWT untuk autentikasi yang dapat diskalakan.</p>
<h3 id="Observability-Full-Stack-Tracing-and-Metrics" class="common-anchor-header">Pengamatan: Pelacakan dan Metrik Tumpukan Penuh</h3><p><strong>Penelusuran:</strong> Kami akan menggunakan OpenTelemetry JavaAgent untuk melacak aliran permintaan penuh dari obrolan pengguna ke pencarian Milvus dan respons LLM - termasuk rentang gRPC:</p>
<pre><code translate="no">-javaagent:&lt;path/to/opentelemetry-javaagent.jar&gt; \
-Dotel.metrics.exporter=none \
-Dotel.logs.exporter=none
<button class="copy-code-btn"></button></code></pre>
<p><strong>Metrik:</strong> Micrometer secara otomatis menampilkan metrik yang ramah terhadap Prometheus:</p>
<ul>
<li>Waktu Respons Model</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP gen_ai_client_operation_seconds  </span>
<span class="hljs-comment"># TYPE gen_ai_client_operation_seconds summary</span>
gen_ai_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Waktu Pengambilan Vektor</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># HELP db_vector_client_operation_seconds</span>
<span class="hljs-comment"># TYPE db_vector_client_operation_seconds summary</span>
db_vector_client_operation_seconds_count{...} <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<p>Konfigurasi:</p>
<pre><code translate="no">management.endpoints.web.exposure.include=prometheus
<button class="copy-code-btn"></button></code></pre>
<p>💡 <strong>Catatan Teknis:</strong> Spring Boot 3.2 memperkenalkan permulaan OTEL, tetapi tidak mencakup gRPC (digunakan oleh Milvus). Untuk memastikan visibilitas ujung ke ujung, proyek ini menggunakan pendekatan JavaAgent.</p>
<h2 id="Running-the-Project-End-to-End-Execution" class="common-anchor-header">Menjalankan Proyek: Eksekusi dari ujung ke ujung<button data-href="#Running-the-Project-End-to-End-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Memulai Sistem Lengkap</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> OPENAI_API_KEY=dummy
<span class="hljs-built_in">export</span> SPRING_PROFILES_ACTIVE=ollama-openai
ollama pull mistral            <span class="hljs-comment"># Pull chat model</span>
ollama pull nomic-embed-text   <span class="hljs-comment"># Pull embedding model</span>

mvn clean <span class="hljs-built_in">test</span> package
docker compose up -d
java -javaagent:target/otel/opentelemetry-javaagent.jar -Dotel.metrics.exporter=none -Dotel.logs.exporter=none  -Dinput.directory=<span class="hljs-variable">$PWD</span>/src/test/resources/corpus  -jar target/rag-0.0.1-SNAPSHOT.jar

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/index&#x27;</span> \
--user <span class="hljs-string">&quot;admin:password&quot;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--data <span class="hljs-string">&#x27;{}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=flat&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;Does milvus support FLAT type index?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=flat&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;When shall I use this index type?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=hnsw&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;Does milvus support HNSW type index?&quot;
}&#x27;</span>

curl --location <span class="hljs-string">&#x27;localhost:8080/api/v1/chat?conversationId=hnsw&#x27;</span> \
--header <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
--user <span class="hljs-string">&quot;user:password&quot;</span> \
--data <span class="hljs-string">&#x27;{
    &quot;userInput&quot;: &quot;When shall I use this index type?&quot;
}&#x27;</span>

curl <span class="hljs-string">&quot;http://localhost:8080/actuator/prometheus&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Untuk melihat UI penelusuran, buka<a href="http://localhost:16686/"> http://localhost:16686/</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/To_view_tracing_UI_686e8f54b9.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Anda sekarang memiliki asisten AI yang siap produksi yang mengubah dokumen statis menjadi percakapan yang cerdas. Sistem ini mencakup:</p>
<p>✅ <strong>Pemrosesan Dokumen</strong>: Penyisipan dan vektorisasi otomatis ✅ <strong>Pencarian Semantik</strong>: Pencarian yang cepat dan akurat dengan Milvus ✅ <strong>Memori Percakapan</strong>: Pengalaman percakapan yang sesuai dengan konteks ✅ <strong>Keamanan Perusahaan</strong>: Otentikasi dan kontrol akses</p>
<p>✅ <strong>Pengamatan Penuh</strong>: Pemantauan, penelusuran, dan metrik</p>
<p>Dengan menggabungkan Spring Boot, Milvus, dan Ollama, kami mengubah dokumen perusahaan yang statis menjadi percakapan yang dinamis dan sadar konteks - dengan kemampuan pengamatan, memori, dan keamanan penuh di dalamnya.</p>
<p>Baik Anda membangun copilot internal, asisten khusus domain, atau bot dukungan yang berhadapan langsung dengan pelanggan, arsitektur ini dirancang untuk menskalakan beban kerja Anda dan membuat Anda tetap memegang kendali atas data Anda.</p>
<p>Penasaran dengan apa yang dapat dilakukan Milvus untuk tumpukan AI Anda? Jelajahi<a href="https://milvus.io"> proyek sumber terbuka Milvus</a>, coba<a href="https://zilliz.com"> Milvus terkelola (Zilliz Cloud)</a> untuk pengalaman yang tidak merepotkan, atau bergabunglah dengan <a href="https://discord.com/invite/8uyFbECzPX">saluran Discord</a> kami untuk mendapatkan lebih banyak panduan praktis seperti ini.</p>
