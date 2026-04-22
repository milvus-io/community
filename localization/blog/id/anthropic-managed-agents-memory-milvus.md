---
id: anthropic-managed-agents-memory-milvus.md
title: >-
  Cara Menambahkan Memori Jangka Panjang ke Agen Terkelola Anthropic dengan
  Milvus
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Agen Terkelola Anthropic membuat agen-agen dapat diandalkan, tetapi setiap
  sesi dimulai dengan kosong. Berikut ini cara memasangkan Milvus untuk
  penarikan semantik di dalam sesi dan berbagi memori di seluruh agen.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p><a href="https://www.anthropic.com/engineering/managed-agents">Agen Terkelola</a> Anthropic membuat infrastruktur agen menjadi tangguh. Tugas 200 langkah kini dapat bertahan dari kerusakan harness, batas waktu sandbox, atau perubahan infrastruktur di tengah penerbangan tanpa campur tangan manusia, dan Anthropic melaporkan p50 time-to-first-token turun sekitar 60% dan p95 turun lebih dari 90% setelah pemisahan.</p>
<p>Hal yang tidak dapat diatasi oleh keandalan adalah memori. Migrasi kode 200 langkah yang mencapai konflik ketergantungan baru pada langkah 201 tidak dapat secara efisien melihat kembali bagaimana ia menangani konflik terakhir. Agen yang menjalankan pemindaian kerentanan untuk satu pelanggan tidak tahu bahwa agen lain telah menyelesaikan kasus yang sama satu jam yang lalu. Setiap sesi dimulai dari halaman kosong, dan otak paralel tidak memiliki akses ke apa yang telah dikerjakan oleh yang lain.</p>
<p>Perbaikannya adalah memasangkan <a href="https://milvus.io/">basis data vektor Milvus</a> dengan Agen Terkelola Anthropic: penarikan kembali semantik dalam sebuah sesi, dan <a href="https://milvus.io/docs/milvus_for_agents.md">lapisan memori vektor</a> bersama di seluruh sesi. Kontrak sesi tetap tidak tersentuh, harness mendapatkan satu lapisan baru, dan tugas agen cakrawala panjang mendapatkan kemampuan yang berbeda secara kualitatif.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">Apa yang Diselesaikan oleh Agen Terkelola (dan Apa yang Tidak Diselesaikan)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Managed Agents memecahkan keandalan dengan memisahkan agen menjadi tiga modul independen. Yang tidak dipecahkannya adalah memori, baik sebagai penarikan semantik di dalam satu sesi atau sebagai pengalaman bersama di seluruh sesi paralel.</strong> Inilah yang dipisahkan, dan di mana letak celah memori di dalam desain yang dipisahkan itu.</p>
<table>
<thead>
<tr><th>Modul</th><th>Apa yang dilakukannya</th></tr>
</thead>
<tbody>
<tr><td><strong>Sesi</strong></td><td>Catatan peristiwa yang hanya ditambahkan dari semua yang terjadi. Disimpan di luar harness.</td></tr>
<tr><td><strong>Harness</strong></td><td>Lingkaran yang memanggil Claude dan merutekan panggilan alat Claude ke infrastruktur yang relevan.</td></tr>
<tr><td><strong>Sandbox</strong></td><td>Lingkungan eksekusi yang terisolasi di mana Claude menjalankan kode dan mengedit file.</td></tr>
</tbody>
</table>
<p>Pembingkaian yang membuat desain ini berhasil dinyatakan secara eksplisit dalam postingan Anthropic:</p>
<p><em>"Sesi bukanlah jendela konteks Claude."</em></p>
<p>Jendela konteks bersifat sementara: dibatasi dalam token, direkonstruksi per panggilan model, dan dibuang ketika panggilan kembali. Sesi ini tahan lama, disimpan di luar harness, dan mewakili sistem pencatatan untuk seluruh tugas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ketika sebuah harness macet, platform akan memulai yang baru dengan <code translate="no">wake(sessionId)</code>. Harness baru membaca log peristiwa melalui <code translate="no">getSession(id)</code>, dan tugas diambil dari langkah terakhir yang direkam, tanpa logika pemulihan khusus untuk ditulis dan tidak ada penitipan anak di tingkat sesi yang harus dioperasikan.</p>
<p>Apa yang tidak dibahas oleh posting Managed Agents, dan tidak diklaim, adalah apa yang dilakukan oleh agen ketika perlu mengingat apa pun. Dua celah muncul saat Anda mendorong beban kerja nyata melalui arsitektur. Yang satu berada di dalam satu sesi; yang lain berada di seluruh sesi.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">Masalah 1: Mengapa Log Sesi Linier Gagal Melewati Beberapa Ratus Langkah<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Log sesi linear gagal melewati beberapa ratus langkah karena pembacaan berurutan dan pencarian semantik pada dasarnya merupakan beban kerja yang berbeda, dan</strong> <strong>API</strong> <code translate="no">**getEvents()**</code> <strong>hanya melayani yang pertama.</strong> Mengiris berdasarkan posisi atau mencari stempel waktu sudah cukup untuk menjawab "di mana sesi ini berakhir." Hal ini tidak cukup untuk menjawab pertanyaan yang diperkirakan akan dibutuhkan oleh agen pada tugas yang panjang: apakah kita pernah melihat masalah seperti ini sebelumnya, dan apa yang kita lakukan untuk mengatasinya?</p>
<p>Pertimbangkan migrasi kode pada langkah 200 yang mengenai konflik ketergantungan baru. Langkah yang wajar adalah melihat ke belakang. Apakah agen pernah mengalami hal serupa sebelumnya dalam tugas yang sama? Pendekatan apa yang dicoba? Apakah berhasil, atau malah memundurkan sesuatu yang lain ke hilir?</p>
<p>Dengan <code translate="no">getEvents()</code> ada dua cara untuk menjawabnya, dan keduanya buruk:</p>
<table>
<thead>
<tr><th>Opsi</th><th>Masalah</th></tr>
</thead>
<tbody>
<tr><td>Memindai setiap peristiwa secara berurutan</td><td>Lambat pada 200 langkah. Tidak dapat dipertahankan pada 2.000 langkah.</td></tr>
<tr><td>Membuang sebagian besar aliran ke dalam jendela konteks</td><td>Mahal untuk token, tidak dapat diandalkan pada skala besar, dan menghabiskan memori kerja agen yang sebenarnya untuk langkah saat ini.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sesi ini bagus untuk pemulihan dan audit, tetapi tidak dibangun dengan indeks yang mendukung "apakah saya pernah melihat ini sebelumnya." Tugas cakrawala panjang adalah di mana pertanyaan tersebut tidak lagi menjadi opsional.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">Solusi 1: Cara Menambahkan Memori Semantik ke Sesi Agen Terkelola<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Tambahkan koleksi Milvus di samping log sesi dan dual-write dari</strong> <code translate="no">**emitEvent**</code>. Kontrak sesi tetap tidak tersentuh, dan harness mendapatkan kueri semantik dari masa lalunya.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Desain Anthropic menyisakan ruang untuk hal ini. Postingan mereka menyatakan bahwa "setiap peristiwa yang diambil juga dapat ditransformasikan dalam harness sebelum diteruskan ke jendela konteks Claude. Transformasi ini dapat berupa apa pun yang dikodekan oleh harness, termasuk organisasi konteks ... dan rekayasa konteks." Rekayasa konteks berada di dalam harness; sesi hanya perlu menjamin daya tahan dan kemampuan bertanya.</p>
<p>Polanya: setiap kali <code translate="no">emitEvent</code> ditembakkan, harness juga menghitung <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">penyematan vektor</a> untuk peristiwa yang layak diindeks dan memasukkannya ke dalam koleksi Milvus.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>Ketika agen mencapai langkah 200 dan perlu mengingat keputusan sebelumnya, kueri adalah <a href="https://zilliz.com/glossary/vector-similarity-search">pencarian vektor</a> yang dicakup dalam sesi itu:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>Tiga detail produksi penting sebelum kapal ini dikirim:</p>
<ul>
<li><strong>Pilih apa yang akan diindeks.</strong> Tidak semua peristiwa layak untuk disematkan. Status perantara yang dipanggil alat, log percobaan ulang, dan peristiwa status yang berulang-ulang mencemari kualitas pengambilan lebih cepat daripada memperbaikinya. Kebijakan <code translate="no">INDEXABLE_EVENT_TYPES</code> bergantung pada tugas, bukan global.</li>
<li><strong>Tentukan batas konsistensi.</strong> Jika harness mengalami crash di antara penambahan sesi dan sisipan Milvus, satu lapisan akan mendahului lapisan lainnya. Jendelanya kecil tapi nyata. Pilih jalur rekonsiliasi (coba lagi saat restart, log tulis-depan, atau rekonsiliasi akhir) daripada berharap.</li>
<li><strong>Kontrol pengeluaran penyematan.</strong> Sesi 200 langkah yang memanggil API penyematan eksternal secara sinkron pada setiap langkah menghasilkan faktur yang tidak direncanakan. Antrian penyematan dan kirimkan secara asinkron dalam beberapa kelompok.</li>
</ul>
<p>Dengan semua itu, pemanggilan kembali memerlukan waktu milidetik untuk pencarian vektor ditambah kurang dari 100ms untuk panggilan penyematan. Lima peristiwa masa lalu yang paling relevan mendarat dalam konteks sebelum agen melihat adanya gesekan. Sesi ini mempertahankan tugas aslinya sebagai log yang tahan lama; harness mendapatkan kemampuan untuk menanyakan masa lalunya sendiri secara semantik daripada secara berurutan. Itu adalah perubahan sederhana di permukaan API dan perubahan struktural dalam apa yang dapat dilakukan agen pada tugas jangka panjang.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">Masalah 2: Mengapa Agen Claude Paralel Tidak Dapat Berbagi Pengalaman<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Agen Claude Paralel tidak dapat berbagi pengalaman karena sesi Agen Terkelola diisolasi secara desain. Isolasi yang sama yang membuat penskalaan horizontal menjadi bersih juga mencegah setiap otak belajar dari setiap otak lainnya.</strong></p>
<p>Dalam decoupled harness, otak tidak memiliki status dan independen. Isolasi tersebut membuka latensi yang memenangkan laporan Anthropic, dan juga membuat setiap sesi berjalan dalam kegelapan tentang setiap sesi lainnya.</p>
<p>Agen A menghabiskan waktu 40 menit untuk mendiagnosis vektor injeksi SQL yang rumit untuk satu pelanggan. Satu jam kemudian, Agen B mengambil kasus yang sama untuk pelanggan yang berbeda dan menghabiskan 40 menitnya sendiri berjalan di jalan buntu yang sama, menjalankan panggilan alat yang sama, dan sampai pada jawaban yang sama.</p>
<p>Untuk satu pengguna yang menjalankan agen sesekali, itu adalah komputasi yang sia-sia. Untuk platform yang menjalankan lusinan <a href="https://zilliz.com/glossary/ai-agents">agen AI</a> secara bersamaan di seluruh tinjauan kode, pemindaian kerentanan, dan pembuatan dokumentasi untuk pelanggan yang berbeda setiap hari, biayanya bertambah secara struktural.</p>
<p>Jika pengalaman yang dihasilkan setiap sesi menguap begitu sesi berakhir, maka kecerdasan tersebut tidak berguna. Platform yang dibangun dengan cara ini berskala linier tetapi tidak menjadi lebih baik dalam hal apa pun dari waktu ke waktu, seperti yang dilakukan oleh insinyur manusia.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">Solusi 2: Cara Membangun Kumpulan Memori Agen Bersama dengan Milvus<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Buat satu koleksi vektor yang dibaca oleh setiap harness saat startup dan ditulis saat dimatikan, dipartisi oleh penyewa sehingga pengalaman pool di seluruh sesi tanpa bocor ke pelanggan.</strong></p>
<p>Ketika sebuah sesi berakhir, keputusan utama, masalah yang dihadapi, dan pendekatan yang berhasil akan dimasukkan ke dalam koleksi Milvus bersama. Ketika otak baru diinisialisasi, harness menjalankan kueri semantik sebagai bagian dari penyiapan dan menyuntikkan pengalaman masa lalu yang paling cocok ke dalam jendela konteks. Langkah pertama dari agen baru mewarisi pelajaran dari setiap agen sebelumnya.</p>
<p>Dua keputusan teknik membawa ini dari prototipe ke produksi.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Mengisolasi Penyewa dengan Kunci Partisi Milvus</h3><p><strong>Partisi oleh</strong> <code translate="no">**tenant_id**</code>,<strong> dan pengalaman agen Pelanggan A secara fisik tidak tinggal di partisi yang sama dengan Pelanggan B. Itu adalah isolasi pada lapisan data dan bukan konvensi kueri.</strong></p>
<p>Pekerjaan otak A pada basis kode Perusahaan A tidak boleh diambil oleh agen Perusahaan B. <a href="https://milvus.io/docs/use-partition-key.md">Kunci partisi</a> Milvus menangani hal ini pada satu koleksi, tanpa koleksi kedua per penyewa dan tidak ada logika pemecahan dalam kode aplikasi.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Pengalaman agen Pelanggan A tidak pernah muncul di kueri Pelanggan B, bukan karena filter kueri ditulis dengan benar (meskipun memang harus begitu), tetapi karena data secara fisik tidak berada di partisi yang sama dengan Pelanggan B. Satu koleksi untuk beroperasi, isolasi logis diberlakukan pada lapisan kueri, isolasi fisik diberlakukan pada lapisan partisi.</p>
<p>Lihat <a href="https://milvus.io/docs/multi_tenancy.md">dokumen strategi multi-tenancy</a> untuk mengetahui kapan kunci partisi cocok dibandingkan dengan koleksi atau basis data yang terpisah, dan <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">panduan pola RAG multi-tenancy</a> untuk catatan penerapan produksi.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">Mengapa Kualitas Memori Agen Perlu Dilakukan Secara Berkesinambungan</h3><p><strong>Kualitas memori terkikis seiring berjalannya waktu: solusi yang cacat yang pernah berhasil diulang dan diperkuat, dan entri basi yang terkait dengan dependensi yang sudah tidak digunakan akan terus menyesatkan agen yang mewarisinya. Pertahanan adalah program operasional, bukan fitur basis data.</strong></p>
<p>Agen tersandung pada solusi yang cacat yang kebetulan berhasil sekali. Solusi tersebut akan ditulis ke dalam kumpulan bersama. Agen berikutnya mengambilnya, memutar ulang, dan memperkuat pola yang buruk dengan catatan penggunaan kedua yang "berhasil".</p>
<p>Entri basi mengikuti versi yang lebih lambat dari jalur yang sama. Perbaikan yang disematkan pada versi ketergantungan yang sudah tidak digunakan lagi enam bulan yang lalu akan terus diambil, dan terus menyesatkan agen-agen yang mewarisinya. Semakin tua dan semakin banyak digunakan, semakin banyak yang terakumulasi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tiga program operasional bertahan melawan hal ini:</p>
<ul>
<li><strong>Skor kepercayaan.</strong> Melacak seberapa sering memori telah berhasil diterapkan dalam sesi hilir. Membusukkan entri yang gagal dalam pemutaran ulang. Mempromosikan entri yang berhasil berulang kali.</li>
<li><strong>Pembobotan waktu.</strong> Mengutamakan pengalaman terbaru. Menghentikan entri yang melewati ambang batas keusangan yang diketahui, sering kali terkait dengan lonjakan versi ketergantungan utama.</li>
<li><strong>Pemeriksaan oleh manusia.</strong> Entri dengan frekuensi pengambilan yang tinggi memiliki daya ungkit yang tinggi. Ketika salah satu dari mereka salah, maka akan salah berkali-kali, yang mana peninjauan manusia akan memberikan hasil paling cepat.</li>
</ul>
<p>Milvus saja tidak dapat menyelesaikan masalah ini, begitu juga dengan Mem0, Zep, atau produk memori lainnya. Menerapkan satu pool dengan banyak penyewa dan nol kebocoran antar penyewa adalah sesuatu yang Anda rekayasa sekali. Menjaga agar pool tersebut tetap akurat, segar, dan berguna merupakan pekerjaan operasional yang terus menerus yang tidak dapat dilakukan oleh database yang sudah dikonfigurasi sebelumnya.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">Kesimpulan: Apa yang Ditambahkan Milvus pada Agen Terkelola Anthropic<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus mengubah Managed Agents dari platform yang dapat diandalkan namun mudah dilupakan menjadi platform yang meningkatkan pengalaman dari waktu ke waktu dengan menambahkan semantic recall di dalam sebuah sesi dan memori bersama di seluruh agen.</strong></p>
<p>Managed Agents menjawab pertanyaan keandalan dengan jelas: otak dan tangan adalah hewan ternak, dan salah satu dari mereka dapat mati tanpa melakukan tugas. Itulah masalah infrastruktur, dan Anthropic menyelesaikannya dengan baik.</p>
<p>Yang tetap terbuka adalah pertumbuhan. Insinyur manusia bertambah seiring berjalannya waktu; kerja bertahun-tahun berubah menjadi pengenalan pola, dan mereka tidak bernalar berdasarkan prinsip-prinsip dasar pada setiap tugas. Agen yang dikelola saat ini tidak demikian, karena setiap sesi dimulai dari halaman kosong.</p>
<p>Menyambungkan sesi ke Milvus untuk mengingat semantik di dalam tugas dan menyatukan pengalaman di seluruh otak dalam koleksi vektor bersama adalah hal yang memberi agen masa lalu yang dapat mereka gunakan. Memasukkan Milvus adalah bagian infrastruktur; memangkas ingatan yang salah, menghapus ingatan yang sudah basi, dan menegakkan batas-batas penyewa adalah bagian operasionalnya. Setelah keduanya ada, bentuk memori tidak lagi menjadi beban dan mulai menjadi modal.</p>
<h2 id="Get-Started" class="common-anchor-header">Memulai<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li><strong>Cobalah secara lokal:</strong> jalankan instans Milvus tertanam dengan <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Tanpa Docker, tanpa cluster, hanya <code translate="no">pip install pymilvus</code>. Beban kerja produksi dapat dialihkan ke <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone atau Distributed</a> saat Anda membutuhkannya.</li>
<li><strong>Baca dasar pemikiran desainnya:</strong> <a href="https://www.anthropic.com/engineering/managed-agents">Pos rekayasa Managed Agents</a> Anthropic membahas sesi, harness, dan decoupling sandbox secara mendalam.</li>
<li><strong>Punya pertanyaan?</strong> Bergabunglah dengan komunitas <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> untuk diskusi desain memori agen, atau pesan sesi <a href="https://milvus.io/office-hours">Jam Kantor Milvus</a> untuk membahas beban kerja Anda.</li>
<li><strong>Lebih suka dikelola?</strong> <a href="https://cloud.zilliz.com/signup">Daftar ke Zilliz Cloud</a> (atau <a href="https://cloud.zilliz.com/login">masuk</a>) untuk Milvus yang di-host dengan kunci partisi, penskalaan, dan multi-tenancy. Akun baru mendapatkan kredit gratis untuk email kantor.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Pertanyaan yang Sering Diajukan<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>T: Apa perbedaan antara sesi dan jendela konteks di Agen Terkelola Anthropic?</strong></p>
<p>Jendela konteks adalah sekumpulan token sementara yang dilihat oleh satu panggilan Claude. Jendela ini dibatasi dan disetel ulang per pemanggilan model. Sesi adalah log peristiwa yang tahan lama dan hanya ditambahkan dari semua yang terjadi di seluruh tugas, disimpan di luar harness. Ketika sebuah harness macet, <code translate="no">wake(sessionId)</code> memunculkan harness baru yang membaca log sesi dan melanjutkan. Sesi adalah sistem pencatatan; jendela konteks adalah memori kerja. Sesi bukanlah jendela konteks.</p>
<p><strong>T: Bagaimana cara mempertahankan memori agen di seluruh sesi Claude?</strong></p>
<p>Sesi itu sendiri sudah persisten; itulah yang diambil oleh <code translate="no">getSession(id)</code>. Yang biasanya hilang adalah memori jangka panjang yang dapat ditanyakan. Polanya adalah menanamkan peristiwa bersinyal tinggi (keputusan, resolusi, strategi) ke dalam basis data vektor seperti Milvus selama <code translate="no">emitEvent</code>, kemudian melakukan kueri berdasarkan kemiripan semantik pada waktu pengambilan. Hal ini memberikan Anda log sesi yang tahan lama yang disediakan oleh Anthropic dan lapisan pemanggilan kembali semantik untuk melihat kembali ratusan langkah.</p>
<p><strong>T: Dapatkah beberapa agen Claude berbagi memori?</strong></p>
<p>Tidak bisa. Setiap sesi Managed Agents diisolasi secara desain, yang memungkinkan mereka menskalakan secara horizontal. Untuk berbagi memori di seluruh agen, tambahkan koleksi vektor bersama (misalnya di Milvus) yang dibaca oleh setiap harness saat startup dan ditulis saat dimatikan. Gunakan fitur kunci partisi Milvus untuk mengisolasi penyewa sehingga memori agen Pelanggan A tidak pernah bocor ke sesi Pelanggan B.</p>
<p><strong>T: Apa basis data vektor terbaik untuk memori agen AI?</strong></p>
<p>Jawaban yang jujur tergantung pada skala dan bentuk penerapan. Untuk prototipe dan beban kerja yang kecil, opsi tertanam lokal seperti Milvus Lite berjalan dalam proses tanpa infrastruktur. Untuk agen produksi di banyak penyewa, Anda menginginkan basis data dengan multi-tenancy yang matang (kunci partisi, pencarian terfilter), pencarian hybrid (vektor + skalar + kata kunci), dan latensi milidetik pada jutaan vektor. Milvus dibuat khusus untuk beban kerja vektor pada skala tersebut, itulah sebabnya mengapa Milvus muncul di sistem memori agen produksi yang dibangun di atas LangChain, Google ADK, Deep Agents, dan OpenAgents.</p>
