---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: >-
  Memperkenalkan DeepSearcher: Sebuah Penelitian Sumber Terbuka Lokal untuk
  Penelitian Mendalam
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  Berbeda dengan Deep Research milik OpenAI, contoh ini berjalan secara lokal,
  hanya menggunakan model dan alat sumber terbuka seperti Milvus dan LangChain.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="DeepSearcher" class="doc-image" id="deepsearcher" />
   </span> <span class="img-wrapper"> <span>DeepSearcher</span> </span></p>
<p>Pada artikel sebelumnya, <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"Saya Membangun Penelitian Mendalam dengan Open Source-dan Anda pun bisa!",</em></a> kami menjelaskan beberapa prinsip yang mendasari agen penelitian dan membuat prototipe sederhana yang menghasilkan laporan terperinci tentang topik atau pertanyaan tertentu. Artikel dan buku catatan yang sesuai menunjukkan konsep dasar <em>penggunaan alat</em>, <em>dekomposisi pertanyaan</em>, <em>penalaran</em>, dan <em>refleksi</em>. Contoh dalam artikel kami sebelumnya, berbeda dengan Deep Research milik OpenAI, berjalan secara lokal, hanya menggunakan model dan alat sumber terbuka seperti <a href="https://milvus.io/docs">Milvus</a> dan LangChain. (Saya menyarankan Anda untuk membaca <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">artikel di atas</a> sebelum melanjutkan).</p>
<p>Pada minggu-minggu berikutnya, terjadi ledakan minat untuk memahami dan mereproduksi Deep Research OpenAI. Lihat, misalnya, <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a> dan <a href="https://huggingface.co/blog/open-deep-research">Open DeepResearch milik Hugging Face.</a> Alat-alat ini berbeda dalam arsitektur dan metodologi meskipun memiliki tujuan yang sama: secara berulang-ulang meneliti topik atau pertanyaan dengan menjelajahi web atau dokumen internal dan menghasilkan laporan yang terperinci, terinformasi, dan terstruktur dengan baik. Yang penting, agen yang mendasari mengotomatiskan penalaran tentang tindakan apa yang harus diambil pada setiap langkah peralihan.</p>
<p>Dalam tulisan ini, kami mengembangkan tulisan kami sebelumnya dan menyajikan proyek sumber terbuka <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> dari Zilliz. Agen kami mendemonstrasikan konsep tambahan: <em>perutean kueri, aliran eksekusi bersyarat</em>, dan perayapan <em>web sebagai alat</em>. Alat ini disajikan sebagai pustaka Python dan alat baris perintah daripada buku catatan Jupyter dan memiliki fitur yang lebih lengkap daripada tulisan kami sebelumnya. Sebagai contoh, alat ini bisa memasukkan beberapa dokumen sumber dan bisa mengatur model penyematan dan basis data vektor yang digunakan melalui file konfigurasi. Meskipun masih relatif sederhana, DeepSearcher adalah contoh yang bagus dari RAG agentic dan merupakan langkah lebih lanjut menuju aplikasi AI yang canggih.</p>
<p>Selain itu, kami mengeksplorasi kebutuhan akan layanan inferensi yang lebih cepat dan lebih efisien. Model penalaran memanfaatkan "penskalaan inferensi", yaitu komputasi ekstra, untuk meningkatkan output mereka, dan dikombinasikan dengan fakta bahwa satu laporan mungkin memerlukan ratusan atau ribuan panggilan LLM menghasilkan bandwidth inferensi yang menjadi hambatan utama. Kami menggunakan <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">model penalaran DeepSeek-R1 pada perangkat keras yang dibuat khusus oleh SambaNova</a>, yang dua kali lebih cepat dalam menghasilkan token per detik dibandingkan pesaing terdekat (lihat gambar di bawah).</p>
<p>SambaNova Cloud juga menyediakan layanan inferensi-sebagai-layanan untuk model open-source lainnya termasuk Llama 3.x, Qwen2.5, dan QwQ. Layanan inferensi berjalan pada chip khusus SambaNova yang disebut unit aliran data yang dapat dikonfigurasi ulang (RDU), yang dirancang khusus untuk inferensi yang efisien pada model AI Generatif, menurunkan biaya dan meningkatkan kecepatan inferensi. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">Cari tahu lebih lanjut di situs web mereka.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output Speed- DeepSeek R1" class="doc-image" id="output-speed--deepseek-r1" />
   </span> <span class="img-wrapper"> <span>Kecepatan Keluaran- DeepSeek R1</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">Arsitektur DeepSearcher<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Arsitektur <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> mengikuti posting kami sebelumnya dengan memecah masalah menjadi empat langkah - <em>mendefinisikan / menyempurnakan pertanyaan</em>, <em>meneliti</em>, <em>menganalisis</em>, <em>mensintesis</em> - meskipun kali ini dengan beberapa tumpang tindih. Kami membahas setiap langkah, menyoroti peningkatan <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="DeepSearcher Architecture" class="doc-image" id="deepsearcher-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur DeepSearcher</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">Tentukan dan Sempurnakan Pertanyaan</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Dalam desain DeepSearcher, batasan antara meneliti dan menyaring pertanyaan menjadi kabur. Kueri pengguna awal diuraikan menjadi sub-kueri, sama seperti tulisan sebelumnya. Lihat di atas untuk sub-kueri awal yang dihasilkan dari kueri "Bagaimana The Simpsons berubah dari waktu ke waktu?". Namun, langkah penelitian berikut ini akan terus menyempurnakan pertanyaan sesuai kebutuhan.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">Meneliti dan Menganalisis</h3><p>Setelah memecah kueri menjadi sub-kueri, bagian penelitian agen dimulai. Secara garis besar, ada empat langkah: <em>perutean</em>, <em>pencarian</em>, <em>refleksi, dan pengulangan bersyarat</em>.</p>
<h4 id="Routing" class="common-anchor-header">Perutean</h4><p>Basis data kita berisi banyak tabel atau koleksi dari berbagai sumber. Akan lebih efisien jika kita dapat membatasi pencarian semantik kita hanya pada sumber-sumber yang relevan dengan kueri yang ada. Perute kueri meminta LLM untuk memutuskan dari koleksi mana informasi harus diambil.</p>
<p>Berikut ini adalah metode untuk membentuk permintaan perutean kueri:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>Kami membuat LLM mengembalikan keluaran terstruktur sebagai JSON agar dapat dengan mudah mengubah keluarannya menjadi keputusan tentang apa yang harus dilakukan selanjutnya.</p>
<h4 id="Search" class="common-anchor-header">Pencarian</h4><p>Setelah memilih berbagai koleksi basis data melalui langkah sebelumnya, langkah pencarian melakukan pencarian kemiripan dengan <a href="https://milvus.io/docs">Milvus</a>. Sama seperti langkah sebelumnya, sumber data telah ditentukan sebelumnya, dipotong-potong, disematkan, dan disimpan dalam basis data vektor. Untuk DeepSearcher, sumber data, baik lokal maupun online, harus ditentukan secara manual. Kami meninggalkan pencarian online untuk pekerjaan di masa depan.</p>
<h4 id="Reflection" class="common-anchor-header">Refleksi</h4><p>Tidak seperti tulisan sebelumnya, DeepSearcher menggambarkan bentuk refleksi agenik yang sebenarnya, dengan memasukkan output sebelumnya sebagai konteks ke dalam prompt yang "merefleksikan" apakah pertanyaan yang diajukan sejauh ini dan potongan-potongan yang diambil yang relevan mengandung kesenjangan informasi. Hal ini dapat dilihat sebagai langkah analisis.</p>
<p>Berikut ini adalah metode untuk membuat prompt:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>Sekali lagi, kita membuat LLM mengembalikan output terstruktur, kali ini sebagai data yang dapat diinterpretasikan dengan Python.</p>
<p>Berikut ini adalah contoh sub-kueri baru yang "ditemukan" oleh refleksi setelah menjawab sub-kueri awal di atas:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">Pengulangan Bersyarat</h4><p>Tidak seperti posting kami sebelumnya, DeepSearcher mengilustrasikan alur eksekusi bersyarat. Setelah merefleksikan apakah pertanyaan dan jawaban sejauh ini sudah lengkap, jika ada pertanyaan tambahan yang ingin ditanyakan, agen akan mengulangi langkah-langkah di atas. Yang penting, alur eksekusi (perulangan sementara) merupakan fungsi dari keluaran LLM dan bukan merupakan kode keras. Dalam hal ini hanya ada pilihan biner: <em>mengulangi penelitian</em> atau <em>menghasilkan laporan.</em> Pada agen yang lebih kompleks, mungkin ada beberapa pilihan seperti: <em>mengikuti hyperlink</em>, <em>mengambil potongan, menyimpan dalam memori, merefleksikan</em>, dll. Dengan cara ini, pertanyaan terus disempurnakan sesuai keinginan agen hingga memutuskan untuk keluar dari perulangan dan menghasilkan laporan. Dalam contoh Simpsons kami, DeepSearcher melakukan dua putaran lagi untuk mengisi kekosongan dengan sub-kueri tambahan.</p>
<h3 id="Synthesize" class="common-anchor-header">Mensintesis</h3><p>Akhirnya, pertanyaan yang telah terurai sepenuhnya dan potongan yang diambil disintesis menjadi laporan dengan satu prompt. Berikut ini adalah kode untuk membuat prompt:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>Pendekatan ini memiliki keunggulan dibandingkan prototipe kami, yang menganalisis setiap pertanyaan secara terpisah dan hanya menggabungkan hasilnya, untuk menghasilkan laporan di mana semua bagian konsisten satu sama lain, yaitu tidak mengandung informasi yang berulang atau bertentangan. Sistem yang lebih kompleks dapat menggabungkan aspek-aspek dari keduanya, menggunakan alur eksekusi bersyarat untuk menyusun laporan, meringkas, menulis ulang, merefleksikan dan melakukan pivot, dan seterusnya, yang akan kami tinggalkan untuk pekerjaan di masa depan.</p>
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
    </button></h2><p>Berikut ini adalah contoh dari laporan yang dihasilkan oleh kueri "Bagaimana The Simpsons berubah dari waktu ke waktu?" dengan DeepSeek-R1 yang menggunakan halaman Wikipedia tentang The Simpsons sebagai materi sumber:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>Temukan <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">laporan lengkapnya di sini</a>, dan <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">laporan yang dihasilkan oleh DeepSearcher dengan GPT-4o mini</a> untuk perbandingan.</p>
<h2 id="Discussion" class="common-anchor-header">Diskusi<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami mempresentasikan <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, sebuah agen untuk melakukan penelitian dan menulis laporan. Sistem kami dibangun berdasarkan ide pada artikel kami sebelumnya, dengan menambahkan fitur-fitur seperti aliran eksekusi bersyarat, perutean kueri, dan antarmuka yang lebih baik. Kami beralih dari inferensi lokal dengan model penalaran terkuantisasi 4-bit yang kecil ke layanan inferensi online untuk model DeepSeek-R1 yang sangat besar, yang secara kualitatif meningkatkan laporan keluaran kami. DeepSearcher bekerja dengan sebagian besar layanan inferensi seperti OpenAI, Gemini, DeepSeek dan Grok 3 (segera hadir!).</p>
<p>Model penalaran, terutama yang digunakan dalam agen penelitian, sangat berat dalam pengambilan kesimpulan, dan kami beruntung dapat menggunakan penawaran tercepat dari DeepSeek-R1 dari SambaNova yang berjalan pada perangkat keras khusus mereka. Untuk kueri demonstrasi kami, kami melakukan enam puluh lima panggilan ke layanan inferensi DeepSeek-R1 SambaNova, memasukkan sekitar 25 ribu token, menghasilkan 22 ribu token, dan menghabiskan biaya $ 0,30. Kami terkesan dengan kecepatan inferensi yang diberikan mengingat model ini berisi 671 miliar parameter dan berukuran 3/4 terabyte. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">Cari tahu detail selengkapnya di sini!</a></p>
<p>Kami akan terus mengulangi pekerjaan ini di tulisan-tulisan selanjutnya, memeriksa konsep-konsep agen tambahan dan ruang desain agen penelitian. Sementara itu, kami mengundang semua orang untuk mencoba <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, membintangi <a href="https://github.com/zilliztech/deep-searcher">kami di GitHub</a>, dan membagikan umpan balik Anda!</p>
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher milik Zilliz</strong></a></p></li>
<li><p>Bacaan latar belakang: <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"Saya Membangun Penelitian Mendalam dengan Open Source - dan Anda Juga Bisa!"</em></strong></a></p></li>
<li><p><em>"</em><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>SambaNova Meluncurkan DeepSeek-R1 671B Tercepat dengan Efisiensi Tertinggi</strong></a><em>"</em></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">Laporan DeepSeek-R1 tentang The Simpsons</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">Laporan mini GPT-4o tentang The Simpsons</a></p></li>
<li><p><a href="https://milvus.io/docs">Basis Data Vektor Sumber Terbuka Milvus</a></p></li>
</ul>
