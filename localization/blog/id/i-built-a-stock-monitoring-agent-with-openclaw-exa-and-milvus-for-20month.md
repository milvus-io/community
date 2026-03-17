---
id: i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
title: >-
  Saya Membangun Agen Pemantau Saham dengan OpenClaw, Exa, dan Milvus seharga
  $20/Bulan
author: Cheney Zhang
date: 2026-3-13
cover: assets.zilliz.com/blog_Open_Claw_3_510bc283aa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_keywords: 'AI agent, stock monitoring agent, Milvus, vector database, OpenClaw'
meta_title: |
  OpenClaw Tutorial: AI Stock Agent with Exa and Milvus
desc: >-
  Panduan langkah demi langkah untuk membangun agen pemantau saham AI
  menggunakan OpenClaw, Exa, dan Milvus. Briefing pagi, memori perdagangan, dan
  peringatan seharga $20/bulan.
origin: >-
  https://milvus.io/blog/i-built-a-stock-monitoring-agent-with-openclaw-exa-and-milvus-for-20month.md
---
<p>Saya memperdagangkan saham AS sebagai sampingan, yang merupakan cara yang sopan untuk mengatakan bahwa saya kehilangan uang sebagai hobi. Rekan kerja saya bercanda bahwa strategi saya adalah "beli saat senang, jual saat takut, ulangi setiap minggu."</p>
<p>Bagian pengulangan itulah yang membunuh saya. Setiap kali saya menatap pasar, saya akhirnya membuat trade yang tidak saya rencanakan. Harga minyak melonjak, saya panik menjual. Satu saham teknologi naik 4%, saya mengejarnya. Seminggu kemudian, saya melihat riwayat perdagangan saya, bukankah <em>saya melakukan hal yang sama pada kuartal terakhir?</em></p>
<p>Jadi saya membuat agen dengan OpenClaw yang mengawasi pasar, bukan saya, dan menghentikan saya melakukan kesalahan yang sama. Agen ini tidak memperdagangkan atau menyentuh uang saya, karena itu akan menjadi risiko keamanan yang terlalu besar. Sebaliknya, ini menghemat waktu yang saya habiskan untuk mengamati pasar, dan mencegah saya melakukan kesalahan yang sama.</p>
<p>Agen ini terdiri dari tiga bagian, dan biayanya sekitar $20/bulan:</p>
<ul>
<li><strong><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a></strong> <strong>untuk menjalankan semuanya secara autopilot</strong>. OpenClaw menjalankan agen dengan detak jantung 30 menit dan hanya memberi saya ping ketika ada sesuatu yang benar-benar penting, yang mengurangi FOMO yang biasanya membuat saya terpaku pada layar. Sebelumnya, semakin sering saya mengamati harga, semakin saya bereaksi secara impulsif.</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>untuk pencarian yang akurat dan real-time</strong>. Exa menelusuri dan meringkas sumber informasi yang dipilih sesuai jadwal, jadi saya mendapatkan pengarahan yang jelas setiap pagi. Sebelumnya, saya menghabiskan waktu satu jam sehari untuk memilah-milah spam SEO dan spekulasi untuk menemukan berita yang bisa dipercaya - dan itu tidak bisa diotomatisasi karena situs keuangan diperbarui setiap hari untuk melawan pengikis.</li>
<li><strong><a href="https://milvus.io/">Milvus</a></strong> <strong>untuk riwayat dan preferensi pribadi</strong>. Milvus menyimpan riwayat perdagangan saya, dan agen mencarinya sebelum saya mengambil keputusan - jika saya akan mengulangi sesuatu yang saya sesali, Milvus akan memberi tahu saya. Sebelumnya, meninjau perdagangan sebelumnya cukup membosankan sehingga saya tidak melakukannya, sehingga kesalahan yang sama terus terjadi dengan ticker yang berbeda. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> adalah versi Milvus yang dikelola sepenuhnya. Jika Anda ingin pengalaman yang bebas repot, Zilliz Cloud adalah pilihan yang bagus<a href="https://cloud.zilliz.com/signup">(tersedia versi gratis</a>).</li>
</ul>
<p>Inilah cara saya mengaturnya, langkah demi langkah.</p>
<h2 id="Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="common-anchor-header">Langkah 1: Dapatkan Intelijen Pasar Waktu Nyata dengan Exa<button data-href="#Step-1-Get-Real-Time-Market-Intelligence-with-Exa" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelumnya, saya telah mencoba menjelajahi aplikasi keuangan, menulis scraper, dan mencari terminal data profesional. Pengalaman saya? Aplikasi mengubur sinyal di bawah kebisingan, scraper terus-menerus rusak, dan API profesional sangat mahal. Exa adalah API pencarian yang dibuat untuk agen AI yang memecahkan masalah di atas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_1_d15ac4d2e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong><a href="https://exa.ai/">Exa</a></strong> adalah API pencarian web yang mengembalikan data terstruktur dan siap pakai untuk agen AI. API ini diberdayakan oleh <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (layanan yang dikelola sepenuhnya oleh Milvus). Jika Perplexity adalah mesin pencari yang digunakan oleh manusia, Exa digunakan oleh AI. Agen mengirimkan kueri, dan Exa mengembalikan teks artikel, kalimat kunci, dan ringkasan sebagai JSON - output terstruktur yang dapat diurai dan ditindaklanjuti oleh agen secara langsung, tanpa perlu mengikis.</p>
<p>Exa juga menggunakan pencarian semantik di balik kap mesin, sehingga agen dapat melakukan kueri dalam bahasa alami. Kueri seperti "Mengapa saham NVIDIA turun meskipun pendapatan Q4 2026 yang kuat" mengembalikan rincian analis dari Reuters dan Bloomberg, bukan halaman clickbait SEO.</p>
<p>Exa memiliki tingkat gratis - 1.000 pencarian per bulan, yang lebih dari cukup untuk memulai. Untuk mengikutinya, instal SDK dan tukar kunci API Anda sendiri:</p>
<pre><code translate="no">pip install exa-py
<button class="copy-code-btn"></button></code></pre>
<p>Inilah panggilan intinya:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> exa_py <span class="hljs-keyword">import</span> Exa

exa = Exa(api_key=<span class="hljs-string">&quot;your-api-key&quot;</span>)

<span class="hljs-comment"># Semantic search — describe what you want in plain language</span>
result = exa.search(
    <span class="hljs-string">&quot;Why did NVIDIA stock drop despite strong Q4 2026 earnings&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;neural&quot;</span>,          <span class="hljs-comment"># semantic search, not keyword</span>
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-25&quot;</span>,   <span class="hljs-comment"># only search for latest information</span>
    contents={
        <span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">3000</span>},       <span class="hljs-comment"># get full article text</span>
        <span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">3</span>},     <span class="hljs-comment"># key sentences</span>
        <span class="hljs-string">&quot;summary&quot;</span>: {<span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;What caused the stock drop?&quot;</span>}  <span class="hljs-comment"># AI summary</span>
    }
)

<span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> result.results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[<span class="hljs-subst">{r.published_date}</span>] <span class="hljs-subst">{r.title}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Summary: <span class="hljs-subst">{r.summary}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  URL: <span class="hljs-subst">{r.url}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Parameter konten melakukan sebagian besar pekerjaan berat di sini - teks menarik artikel lengkap, sorotan mengekstrak kalimat-kalimat kunci, dan ringkasan menghasilkan ringkasan terfokus berdasarkan pertanyaan yang Anda berikan. Satu panggilan API menggantikan dua puluh menit berpindah-pindah tab.</p>
<p>Pola dasar tersebut mencakup banyak hal, tetapi saya akhirnya membuat empat variasi untuk menangani berbagai situasi yang sering saya temui:</p>
<ul>
<li><strong>Memfilter berdasarkan kredibilitas sumber.</strong> Untuk analisis pendapatan, saya hanya ingin Reuters, Bloomberg, atau Wall Street Journal - bukan ladang konten yang menulis ulang laporan mereka dua belas jam kemudian.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Only financial reports from trusted sources</span>
earnings = exa.search(
    <span class="hljs-string">&quot;NVIDIA Q4 2026 earnings analysis&quot;</span>,
    category=<span class="hljs-string">&quot;financial report&quot;</span>,
    num_results=<span class="hljs-number">5</span>,
    include_domains=[<span class="hljs-string">&quot;reuters.com&quot;</span>, <span class="hljs-string">&quot;bloomberg.com&quot;</span>, <span class="hljs-string">&quot;wsj.com&quot;</span>],
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: <span class="hljs-literal">True</span>}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Menemukan analisis yang serupa.</strong> Ketika saya membaca satu artikel yang bagus, saya ingin lebih banyak perspektif tentang topik yang sama tanpa mencarinya secara manual.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># &quot;Show me more analysis like this one&quot;</span>
similar = exa.find_similar(
    url=<span class="hljs-string">&quot;https://fortune.com/2026/02/25/nvidia-nvda-earnings-q4-results&quot;</span>,
    num_results=<span class="hljs-number">10</span>,
    start_published_date=<span class="hljs-string">&quot;2026-02-20&quot;</span>,
    contents={<span class="hljs-string">&quot;text&quot;</span>: {<span class="hljs-string">&quot;max_characters&quot;</span>: <span class="hljs-number">2000</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Pencarian mendalam untuk pertanyaan-pertanyaan yang kompleks.</strong> Beberapa pertanyaan tidak dapat dijawab oleh satu artikel - seperti bagaimana ketegangan Timur Tengah memengaruhi rantai pasokan semikonduktor. Pencarian mendalam mensintesis berbagai sumber dan menghasilkan ringkasan yang terstruktur.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Complex question — needs multi-source synthesis</span>
deep_result = exa.search(
    <span class="hljs-string">&quot;How will Middle East tensions affect global tech supply chain and semiconductor stocks&quot;</span>,
    <span class="hljs-built_in">type</span>=<span class="hljs-string">&quot;deep&quot;</span>,
    num_results=<span class="hljs-number">8</span>,
    contents={
        <span class="hljs-string">&quot;summary&quot;</span>: {
            <span class="hljs-string">&quot;query&quot;</span>: <span class="hljs-string">&quot;Extract: 1) supply chain risk 2) stock impact 3) timeline&quot;</span>
        }
    }
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Pemantauan berita waktu nyata.</strong> Selama jam pasar, saya membutuhkan berita terbaru yang disaring hanya untuk hari ini.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Breaking news only — today&#x27; iss date 2026-03-05</span>
breaking = exa.search(
    <span class="hljs-string">&quot;US stock market breaking news today&quot;</span>,
    category=<span class="hljs-string">&quot;news&quot;</span>,
    num_results=<span class="hljs-number">20</span>,
    start_published_date=<span class="hljs-string">&quot;2026-03-05&quot;</span>,
    contents={<span class="hljs-string">&quot;highlights&quot;</span>: {<span class="hljs-string">&quot;num_sentences&quot;</span>: <span class="hljs-number">2</span>}}
)
<button class="copy-code-btn"></button></code></pre>
<p>Saya menulis sekitar selusin templat menggunakan pola-pola ini, yang mencakup kebijakan Fed, pendapatan teknologi, harga minyak, dan indikator makro. Pola-pola ini berjalan secara otomatis setiap pagi dan mengirimkan hasilnya ke ponsel saya. Apa yang biasanya membutuhkan waktu satu jam untuk menjelajah, kini hanya membutuhkan waktu lima menit untuk membaca ringkasan sambil minum kopi.</p>
<h2 id="Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="common-anchor-header">Langkah 2: Simpan Riwayat Perdagangan di Milvus untuk Keputusan yang Lebih Cerdas<button data-href="#Step-2-Store-Trading-History-in-Milvus-for-Smarter-Decisions" class="anchor-icon" translate="no">
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
    </button></h2><p>Exa memperbaiki masalah informasi saya. Namun, saya masih mengulangi trading yang sama - panic-selling saat harga turun yang pulih dalam beberapa hari, dan mengejar momentum pada saham-saham yang sudah terlalu mahal. Saya bertindak berdasarkan emosi, menyesalinya, dan melupakan pelajaran pada saat situasi yang sama terjadi.</p>
<p>Saya membutuhkan basis pengetahuan pribadi: sesuatu yang dapat menyimpan perdagangan saya di masa lalu, alasan saya, dan kesalahan saya. Bukan sesuatu yang harus saya ulas secara manual (saya pernah mencobanya dan tidak pernah berhasil), tetapi sesuatu yang dapat dicari sendiri oleh agen setiap kali situasi serupa muncul. Jika saya akan mengulangi kesalahan, saya ingin agen memberi tahu saya sebelum saya menekan tombol. Mencocokkan "situasi saat ini" dengan "pengalaman masa lalu" adalah masalah pencarian kemiripan yang diselesaikan oleh basis data vektor, jadi saya memilihnya untuk menyimpan data saya.</p>
<p>Saya menggunakan <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, versi ringan dari Milvus yang berjalan secara lokal. Milvus Lite tidak memiliki server, dan sangat cocok untuk membuat prototipe dan bereksperimen. Saya membagi data saya menjadi tiga koleksi. Dimensi penyematannya adalah 1536 agar sesuai dengan model penyematan teks-3-kecil dari OpenAI, yang bisa digunakan secara langsung:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

milvus = MilvusClient(<span class="hljs-string">&quot;./my_investment_brain.db&quot;</span>)
llm = OpenAI()

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-keyword">return</span> llm.embeddings.create(
        <span class="hljs-built_in">input</span>=text, model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    ).data[<span class="hljs-number">0</span>].embedding

<span class="hljs-comment"># Collection 1: past decisions and lessons</span>
<span class="hljs-comment"># Every trade I make, I write a short review afterward</span>
milvus.create_collection(
    <span class="hljs-string">&quot;decisions&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 2: my preferences and biases</span>
<span class="hljs-comment"># Things like &quot;I tend to hold tech stocks too long&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;preferences&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)

<span class="hljs-comment"># Collection 3: market patterns I&#x27;ve observed</span>
<span class="hljs-comment"># &quot;When VIX &gt; 30 and Fed is dovish, buy the dip usually works&quot;</span>
milvus.create_collection(
    <span class="hljs-string">&quot;patterns&quot;</span>,
    dimension=<span class="hljs-number">1536</span>,
    auto_id=<span class="hljs-literal">True</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Ketiga koleksi tersebut memetakan tiga jenis data pribadi, masing-masing dengan strategi pengambilan yang berbeda:</p>
<table>
<thead>
<tr><th><strong>Jenis</strong></th><th><strong>Apa yang disimpan</strong></th><th><strong>Bagaimana agen menggunakannya</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Preferensi</strong></td><td>Bias, toleransi risiko, filosofi investasi ("Saya cenderung memegang saham teknologi terlalu lama")</td><td>Dimuat ke dalam konteks agen di setiap proses</td></tr>
<tr><td><strong>Keputusan &amp; Pola</strong></td><td>Perdagangan spesifik di masa lalu, pelajaran yang dipetik, pengamatan pasar</td><td>Diambil melalui pencarian kemiripan hanya ketika situasi yang relevan muncul</td></tr>
<tr><td><strong>Pengetahuan eksternal</strong></td><td>Laporan penelitian, pengajuan SEC, data publik</td><td>Tidak disimpan di Milvus - dapat dicari melalui Exa</td></tr>
</tbody>
</table>
<p>Saya membuat tiga koleksi yang berbeda karena menggabungkannya ke dalam satu koleksi akan membuat setiap permintaan dengan riwayat perdagangan yang tidak relevan menjadi membengkak, atau kehilangan bias inti jika tidak cocok dengan kueri yang ada.</p>
<p>Setelah koleksi-koleksi tersebut ada, saya membutuhkan cara untuk mengisinya secara otomatis. Saya tidak ingin menyalin-tempel informasi setelah setiap percakapan dengan agen, jadi saya membuat ekstraktor memori yang berjalan di akhir setiap sesi obrolan.</p>
<p>Pengekstrak melakukan dua hal: mengekstrak dan menduplikasi. Pengekstrak meminta LLM untuk mengambil wawasan terstruktur dari percakapan - keputusan, preferensi, pola, pelajaran - dan merutekan setiap informasi tersebut ke koleksi yang tepat. Sebelum menyimpan sesuatu, LLM akan memeriksa kemiripannya dengan apa yang sudah ada di sana. Jika sebuah wawasan baru memiliki kemiripan lebih dari 92% dengan entri yang sudah ada, maka wawasan tersebut akan dilewatkan.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_and_store_memories</span>(<span class="hljs-params">conversation: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]</span>) -&gt; <span class="hljs-built_in">int</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    After each chat session, extract personal insights
    and store them in Milvus automatically.
    &quot;&quot;&quot;</span>
    <span class="hljs-comment"># Ask LLM to extract structured memories from conversation</span>
    extraction_prompt = <span class="hljs-string">&quot;&quot;&quot;
    Analyze this conversation and extract any personal investment insights.
    Look for:
    1. DECISIONS: specific buy/sell actions and reasoning
    2. PREFERENCES: risk tolerance, sector biases, holding patterns
    3. PATTERNS: market observations, correlations the user noticed
    4. LESSONS: things the user learned or mistakes they reflected on

    Return a JSON array. Each item has:
    - &quot;type&quot;: one of &quot;decision&quot;, &quot;preference&quot;, &quot;pattern&quot;, &quot;lesson&quot;
    - &quot;content&quot;: the insight in 2-3 sentences
    - &quot;confidence&quot;: how explicitly the user stated this (high/medium/low)

    Only extract what the user clearly expressed. Do not infer or guess.
    If nothing relevant, return an empty array.
    &quot;&quot;&quot;</span>

    response = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: extraction_prompt},
            *conversation
        ],
        response_format={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;json_object&quot;</span>}
    )

    memories = json.loads(response.choices[<span class="hljs-number">0</span>].message.content)
    stored = <span class="hljs-number">0</span>

    <span class="hljs-keyword">for</span> mem <span class="hljs-keyword">in</span> memories.get(<span class="hljs-string">&quot;items&quot;</span>, []):
        <span class="hljs-keyword">if</span> mem[<span class="hljs-string">&quot;confidence&quot;</span>] == <span class="hljs-string">&quot;low&quot;</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># skip uncertain inferences</span>

        collection = {
            <span class="hljs-string">&quot;decision&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;lesson&quot;</span>: <span class="hljs-string">&quot;decisions&quot;</span>,
            <span class="hljs-string">&quot;preference&quot;</span>: <span class="hljs-string">&quot;preferences&quot;</span>,
            <span class="hljs-string">&quot;pattern&quot;</span>: <span class="hljs-string">&quot;patterns&quot;</span>
        }.get(mem[<span class="hljs-string">&quot;type&quot;</span>], <span class="hljs-string">&quot;decisions&quot;</span>)

        <span class="hljs-comment"># Check for duplicates — don&#x27;t store the same insight twice</span>
        existing = milvus.search(
            collection,
            data=[embed(mem[<span class="hljs-string">&quot;content&quot;</span>])],
            limit=<span class="hljs-number">1</span>,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )

        <span class="hljs-keyword">if</span> existing[<span class="hljs-number">0</span>] <span class="hljs-keyword">and</span> existing[<span class="hljs-number">0</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;distance&quot;</span>] &gt; <span class="hljs-number">0.92</span>:
            <span class="hljs-keyword">continue</span>    <span class="hljs-comment"># too similar to existing memory, skip</span>

        milvus.insert(collection, [{
            <span class="hljs-string">&quot;vector&quot;</span>: embed(mem[<span class="hljs-string">&quot;content&quot;</span>]),
            <span class="hljs-string">&quot;text&quot;</span>: mem[<span class="hljs-string">&quot;content&quot;</span>],
            <span class="hljs-string">&quot;type&quot;</span>: mem[<span class="hljs-string">&quot;type&quot;</span>],
            <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;chat_extraction&quot;</span>,
            <span class="hljs-string">&quot;date&quot;</span>: <span class="hljs-string">&quot;2026-03-05&quot;</span>
        }])
        stored += <span class="hljs-number">1</span>

    <span class="hljs-keyword">return</span> stored
<button class="copy-code-btn"></button></code></pre>
<p>Saat saya menghadapi situasi pasar baru dan dorongan untuk trading muncul, agen menjalankan fungsi recall. Saya menjelaskan apa yang terjadi, dan ia akan mencari ketiga koleksi untuk mendapatkan riwayat yang relevan:</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_my_experience</span>(<span class="hljs-params">situation: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;
    Given a current market situation, retrieve my relevant
    past experiences, preferences, and observed patterns.
    &quot;&quot;&quot;</span>
    query_vec = embed(situation)

    <span class="hljs-comment"># Search all three collections in parallel</span>
    past_decisions = milvus.search(
        <span class="hljs-string">&quot;decisions&quot;</span>, data=[query_vec], limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;date&quot;</span>, <span class="hljs-string">&quot;tag&quot;</span>]
    )
    my_preferences = milvus.search(
        <span class="hljs-string">&quot;preferences&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>]
    )
    my_patterns = milvus.search(
        <span class="hljs-string">&quot;patterns&quot;</span>, data=[query_vec], limit=<span class="hljs-number">2</span>,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
    )

    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;past_decisions&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> past_decisions[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;preferences&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_preferences[<span class="hljs-number">0</span>]],
        <span class="hljs-string">&quot;patterns&quot;</span>: [h[<span class="hljs-string">&quot;entity&quot;</span>] <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> my_patterns[<span class="hljs-number">0</span>]]
    }

<span class="hljs-comment"># When Agent analyzes current tech selloff:</span>
context = recall_my_experience(
    <span class="hljs-string">&quot;tech stocks dropping 3-4% due to Middle East tensions, March 2026&quot;</span>
)

<span class="hljs-comment"># context now contains:</span>
<span class="hljs-comment"># - My 2024-10 lesson about not panic-selling during ME crisis</span>
<span class="hljs-comment"># - My preference: &quot;I tend to overweight geopolitical risk&quot;</span>
<span class="hljs-comment"># - My pattern: &quot;tech selloffs from geopolitics recover in 1-3 weeks&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Misalnya, ketika saham teknologi turun 3-4% karena ketegangan Timur Tengah pada awal Maret, agen menarik tiga hal: pelajaran dari Oktober 2024 tentang tidak melakukan panic-selling saat terjadi penurunan geopolitik, catatan preferensi bahwa saya cenderung kelebihan risiko geopolitik, dan pola yang saya catat (aksi jual teknologi yang didorong oleh geopolitik biasanya pulih dalam satu hingga tiga minggu).</p>
<p>Rekan kerja saya berpendapat: jika data pelatihan Anda adalah catatan yang merugi, apa sebenarnya yang dipelajari oleh AI? Namun, itulah intinya - agen tidak meniru perdagangan saya, melainkan menghafalnya sehingga dapat mencegah saya melakukan perdagangan berikutnya.</p>
<h2 id="Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="common-anchor-header">Langkah 3: Ajari Agen Anda untuk Menganalisis dengan Keterampilan OpenClaw<button data-href="#Step-3-Teach-Your-Agent-to-Analyze-with-OpenClaw-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada titik ini, agen memiliki informasi yang dapat diandalkan<a href="https://exa.ai/">(Exa</a>) dan memori pribadi<a href="https://github.com/milvus-io/milvus-lite">(Milvus</a>). Tetapi jika Anda memberikan keduanya kepada LLM dan mengatakan "analisislah ini," Anda akan mendapatkan respons yang umum dan bersifat lindung nilai. Ia menyebutkan setiap sudut pandang yang mungkin dan diakhiri dengan "investor harus mempertimbangkan risikonya." Mungkin juga tidak mengatakan apa-apa.</p>
<p>Cara mengatasinya adalah dengan menulis kerangka kerja analitis Anda sendiri dan memberikannya kepada agen sebagai instruksi eksplisit. Anda harus memberi tahu indikator mana yang Anda pedulikan, situasi mana yang Anda anggap berbahaya, dan kapan harus bersikap konservatif versus agresif. Aturan-aturan ini berbeda untuk setiap investor, jadi Anda harus menentukannya sendiri.</p>
<p>OpenClaw melakukan hal ini melalui Skills - menandai file dalam direktori skills/. Ketika agen menemukan situasi yang relevan, agen akan memuat Keterampilan yang cocok dan mengikuti kerangka kerja Anda, bukannya berputar-putar.</p>
<p>Ini salah satu yang saya tulis untuk mengevaluasi saham setelah laporan pendapatan:</p>
<pre><code translate="no">---
name: post-earnings-eval
description: &gt;
  Evaluate whether to buy, hold, or sell after an earnings report.
  Trigger when discussing any stock&#x27;s post-earnings price action,
  or when a watchlist stock reports earnings.
---

## Post-Earnings Evaluation Framework

When analyzing a stock after earnings release:

### Step 1: Get the facts
Use Exa to search for:
- Actual vs expected: revenue, EPS, forward guidance
- Analyst reactions from top-tier sources
- Options market implied move vs actual move

### Step 2: Check my history
Use Milvus recall to find:
- Have I traded this stock after earnings before?
- What did I get right or wrong last time?
- Do I have a known bias about this sector?

### Step 3: Apply my rules
- If revenue beat &gt; 5% AND guidance raised → lean BUY
- If stock drops &gt; 5% on a beat → likely sentiment/macro driven
  - Check: is the drop about THIS company or the whole market?
  - Check my history: did I overreact to similar drops before?
- If P/E &gt; 2x sector average after beat → caution, priced for perfection

### Step 4: Output format
Signal: BUY / HOLD / SELL / WAIT
Confidence: High / Medium / Low
Reasoning: 3 bullets max
Past mistake reminder: what I got wrong in similar situations

IMPORTANT: Always surface my past mistakes. I have a tendency to
let fear override data. If my Milvus history shows I regretted
selling after a dip, say so explicitly.
<button class="copy-code-btn"></button></code></pre>
<p>Baris terakhir adalah yang paling penting: "Selalu munculkan kesalahan masa lalu saya. Saya memiliki kecenderungan untuk membiarkan rasa takut mengesampingkan data. Jika sejarah Milvus saya menunjukkan bahwa saya menyesal menjual setelah penurunan, katakan dengan jelas." Itu adalah cara saya memberi tahu agen di mana letak kesalahan saya, sehingga agen tahu kapan harus mundur. Jika Anda membuat sendiri, ini adalah bagian yang Anda sesuaikan berdasarkan bias Anda.</p>
<p>Saya menulis Keterampilan serupa untuk analisis sentimen, indikator makro, dan sinyal rotasi sektor. Saya juga menulis Keterampilan yang mensimulasikan bagaimana investor yang saya kagumi akan mengevaluasi situasi yang sama - kerangka kerja nilai Buffett, pendekatan makro Bridgewater. Ini bukan pengambil keputusan; ini adalah perspektif tambahan.</p>
<p>Peringatan: jangan biarkan LLM menghitung indikator teknis seperti RSI atau MACD. Mereka berhalusinasi angka dengan penuh percaya diri. Hitung sendiri atau hubungi API khusus, dan masukkan hasilnya ke dalam Skill sebagai input.</p>
<h2 id="Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="common-anchor-header">Langkah 4: Mulai Agen Anda dengan Detak Jantung OpenClaw<button data-href="#Step-4-Start-Your-Agent-with-OpenClaw-Heartbeat" class="anchor-icon" translate="no">
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
    </button></h2><p>Semua hal di atas masih mengharuskan Anda untuk memicunya secara manual. Jika Anda harus membuka terminal setiap kali Anda menginginkan pembaruan, Anda praktis kembali ke aplikasi broker Anda selama rapat lagi.</p>
<p>Mekanisme Heartbeat OpenClaw memperbaiki hal ini. Sebuah gateway mengirim ping ke agen setiap 30 menit (dapat dikonfigurasi), dan agen memeriksa file HEARTBEAT.md untuk memutuskan apa yang harus dilakukan pada saat itu. Ini adalah file markdown dengan aturan berbasis waktu:</p>
<pre><code translate="no"><span class="hljs-meta"># HEARTBEAT.md — runs every 30 minutes automatically</span>

<span class="hljs-meta">## Morning brief (6:30-7:30 AM only)</span>
- Use Exa to search overnight US market news, Asian markets, oil prices
- Search Milvus <span class="hljs-keyword">for</span> my current positions <span class="hljs-keyword">and</span> relevant past experiences
- <span class="hljs-function">Generate a personalized morning <span class="hljs-title">brief</span> (<span class="hljs-params">under <span class="hljs-number">500</span> words</span>)
- Flag anything related to my past mistakes <span class="hljs-keyword">or</span> current holdings
- End <span class="hljs-keyword">with</span> 1-3 action items
- Send the brief to my phone

## Price <span class="hljs-title">alerts</span> (<span class="hljs-params">during US market hours <span class="hljs-number">9</span>:<span class="hljs-number">30</span> AM - <span class="hljs-number">4</span>:<span class="hljs-number">00</span> PM ET</span>)
- Check price changes <span class="hljs-keyword">for</span>: NVDA, TSM, MSFT, AAPL, GOOGL
- If any stock moved more than 3% since last check:
  - Search Milvus <span class="hljs-keyword">for</span>: why I hold <span class="hljs-keyword">this</span> stock, my exit criteria
  - Generate alert <span class="hljs-keyword">with</span> context <span class="hljs-keyword">and</span> recommendation
  - Send alert to my phone

## End of day <span class="hljs-title">summary</span> (<span class="hljs-params">after <span class="hljs-number">4</span>:<span class="hljs-number">30</span> PM ET <span class="hljs-keyword">on</span> weekdays</span>)
- Summarize today&#x27;s market action <span class="hljs-keyword">for</span> my watchlist
- Compare actual moves <span class="hljs-keyword">with</span> my morning expectations
- Note any <span class="hljs-keyword">new</span> patterns worth remembering
</span><button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Open_Claw_2_b2c5262371.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="common-anchor-header">Hasil: Lebih Sedikit Waktu Layar, Lebih Sedikit Perdagangan Impulsif<button data-href="#Results-Less-Screen-Time-Fewer-Impulsive-Trades" class="anchor-icon" translate="no">
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
    </button></h2><p>Inilah yang sebenarnya dihasilkan oleh sistem setiap hari:</p>
<ul>
<li><strong>Pengarahan singkat di pagi hari (pukul 07:00).</strong> Agen menjalankan Exa semalaman, menarik posisi saya dan riwayat yang relevan dari Milvus, dan mengirimkan ringkasan yang dipersonalisasi ke ponsel saya - kurang dari 500 kata. Apa yang terjadi dalam semalam, bagaimana hal itu berkaitan dengan posisi saya, dan satu hingga tiga item tindakan. Saya membacanya sambil menyikat gigi.</li>
<li><strong>Peringatan intraday (pukul 09.30-16.00 WIB).</strong> Setiap 30 menit, agen memeriksa daftar pantauan saya. Jika ada saham yang bergerak lebih dari 3%, saya mendapat notifikasi dengan konteks: mengapa saya membelinya, di mana stop-loss saya, dan apakah saya pernah mengalami situasi serupa sebelumnya.</li>
<li><strong>Ulasan mingguan (akhir pekan).</strong> Agen mengumpulkan pergerakan pasar selama seminggu penuh, bagaimana pergerakan tersebut dibandingkan dengan ekspektasi saya di pagi hari, dan pola-pola yang perlu diingat. Saya menghabiskan 30 menit untuk membacanya pada hari Sabtu. Sisa minggu ini, saya sengaja menjauh dari layar.</li>
</ul>
<p>Poin terakhir itu adalah perubahan terbesar. Agen tidak hanya menghemat waktu, tetapi juga membebaskan saya dari menonton pasar. Anda tidak bisa panik menjual jika Anda tidak melihat harga.</p>
<p>Sebelum sistem ini, saya menghabiskan 10-15 jam seminggu untuk mengumpulkan informasi, memantau pasar, dan meninjau perdagangan, yang tersebar di berbagai pertemuan, waktu perjalanan, dan bergulir hingga larut malam. Sekarang hanya sekitar dua jam: lima menit untuk pengarahan singkat di pagi hari setiap hari, ditambah 30 menit untuk tinjauan akhir pekan.</p>
<p>Kualitas informasinya juga lebih baik. Saya membaca ringkasan dari Reuters dan Bloomberg, bukannya apa pun yang menjadi viral di Twitter. Dan dengan agen yang mengingatkan kesalahan saya di masa lalu setiap kali saya tergoda untuk bertindak, saya telah mengurangi perdagangan impulsif saya secara signifikan. Saya belum bisa membuktikan bahwa hal ini membuat saya menjadi investor yang lebih baik, namun hal ini membuat saya tidak terlalu gegabah.</p>
<p>Total biaya: $10/bulan untuk OpenClaw, $10/bulan untuk Exa, dan sedikit biaya listrik agar Milvus Lite tetap berjalan.</p>
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
    </button></h2><p>Saya terus melakukan perdagangan impulsif yang sama karena informasi saya buruk, saya jarang meninjau riwayat saya sendiri, dan menatap pasar sepanjang hari membuatnya lebih buruk. Jadi saya membangun agen AI yang memecahkan masalah tersebut dengan melakukan tiga hal:</p>
<ul>
<li><strong>Mengumpulkan berita pasar yang dapat diandalkan</strong> dengan <strong><a href="https://exa.ai/">Exa</a></strong>, menggantikan satu jam untuk menelusuri spam SEO dan situs berbayar.</li>
<li><strong>Mengingat perdagangan saya sebelumnya</strong> dengan <a href="http://milvus.io">Milvus</a> dan memperingatkan saya ketika saya akan mengulangi kesalahan yang sudah saya sesali.</li>
<li><strong>Berjalan secara autopilot</strong> dengan <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> dan hanya mengirim pesan kepada saya jika ada sesuatu yang penting.</li>
</ul>
<p>Total biaya: $20/bulan. Agen tidak memperdagangkan atau menyentuh uang saya.</p>
<p>Perubahan terbesar bukanlah data atau peringatannya. Saya berhenti mengamati pasar. Saya lupa sama sekali pada hari Rabu lalu, yang tidak pernah terjadi selama bertahun-tahun trading. Saya masih kehilangan uang kadang-kadang, tetapi jauh lebih jarang, dan saya benar-benar menikmati akhir pekan saya lagi. Rekan kerja saya belum memperbarui lelucon itu, tapi beri waktu.</p>
<p>Agen juga hanya membutuhkan waktu dua akhir pekan untuk membangunnya. Setahun yang lalu, penyiapan yang sama berarti menulis penjadwal, jalur notifikasi, dan manajemen memori dari awal. Dengan OpenClaw, sebagian besar waktu tersebut digunakan untuk mengklarifikasi aturan trading saya sendiri, bukan untuk menulis infrastruktur.</p>
<p>Dan setelah Anda membangunnya untuk satu kasus penggunaan, arsitekturnya portabel. Tukar templat pencarian Exa dan Keterampilan OpenClaw, dan Anda memiliki agen yang memantau makalah penelitian, melacak pesaing, mengamati perubahan peraturan, atau mengikuti gangguan rantai pasokan.</p>
<p>Jika Anda ingin mencobanya:</p>
<ul>
<li><strong><a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a></strong> - menjalankan basis data vektor secara lokal dalam waktu kurang dari lima menit</li>
<li><strong>Dokumen</strong><strong><a href="https://docs.openclaw.ai/">OpenClaw</a></strong> - siapkan agen pertama Anda dengan Keterampilan dan Detak Jantung</li>
<li><strong><a href="https://exa.ai/">Exa</a></strong> <strong>API</strong> - 1.000 pencarian gratis per bulan untuk memulai</li>
</ul>
<p>Punya pertanyaan, ingin bantuan debugging, atau hanya ingin memamerkan apa yang telah Anda buat? Bergabunglah dengan saluran <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus Slack</a> - ini adalah cara tercepat untuk mendapatkan bantuan dari komunitas dan tim. Dan jika Anda lebih suka membicarakan pengaturan Anda secara empat mata, pesanlah <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.156cb1e50b398e3753dedcd15f8758f6.1769685782884.1773222362027.1773227913204.54&amp;__hssc=175614333.2.1773227913204&amp;__hsfp=1c9f7a3cc56fa6c486704004556598ad&amp;uuid=be611eac-2f37-4c1d-9494-71ae4e097f89">jam kantor Milvus</a> selama 20 menit.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Teruslah Membaca<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Penjelasan OpenClaw (Sebelumnya Clawdbot &amp; Moltbot): Panduan Lengkap untuk Agen AI Otonom</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Panduan Langkah-demi-Langkah untuk Menyiapkan OpenClaw (Sebelumnya Clawdbot/Moltbot) dengan Slack</a></li>
<li><a href="https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md">Mengapa Agen AI seperti OpenClaw Membakar Token dan Cara Memangkas Biaya</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Kami Mengekstrak Sistem Memori OpenClaw dan Membuka Sumbernya (memsearch)</a></li>
</ul>
