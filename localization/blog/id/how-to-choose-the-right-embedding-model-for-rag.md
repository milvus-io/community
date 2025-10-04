---
id: how-to-choose-the-right-embedding-model-for-rag.md
title: >-
  Dari Word2Vec hingga LLM2Vec: Cara Memilih Model Penyematan yang Tepat untuk
  RAG
author: Rachel Liu
date: 2025-10-03T00:00:00.000Z
desc: >-
  Blog ini akan memandu Anda tentang cara mengevaluasi penyematan dalam
  praktiknya, sehingga Anda dapat memilih yang paling sesuai untuk sistem RAG
  Anda.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_3_2025_05_07_11_PM_36b1ba77eb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, embedding models'
meta_keywords: 'Milvus, AI Agent, embedding model vector database'
meta_title: |
  How to Choose the Right Embedding Model for RAG
origin: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model-for-rag.md'
---
<p>Model bahasa yang besar memang kuat, tetapi memiliki kelemahan yang terkenal: halusinasi. <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-Augmented Generation (RAG)</a> adalah salah satu cara yang paling efektif untuk mengatasi masalah ini. Alih-alih hanya mengandalkan memori model, RAG mengambil pengetahuan yang relevan dari sumber eksternal dan memasukkannya ke dalam prompt, memastikan jawaban didasarkan pada data nyata.</p>
<p>Sistem RAG biasanya terdiri dari tiga komponen utama: LLM itu sendiri, <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> seperti <a href="https://milvus.io/">Milvus</a> untuk menyimpan dan mencari informasi, dan model penyematan. Model penyematan adalah yang mengubah bahasa manusia menjadi vektor yang dapat dibaca oleh mesin. Anggap saja sebagai penerjemah antara bahasa alami dan database. Kualitas penerjemah ini menentukan relevansi konteks yang diambil. Lakukan dengan benar, dan pengguna akan mendapatkan jawaban yang akurat dan bermanfaat. Jika salah, maka infrastruktur terbaik sekalipun akan menghasilkan noise, kesalahan, dan komputasi yang sia-sia.</p>
<p>Itulah mengapa memahami model penyematan sangat penting. Ada banyak pilihan, mulai dari metode awal seperti Word2Vec hingga model berbasis LLM modern seperti keluarga penyematan teks OpenAI. Masing-masing memiliki kekurangan dan kelebihannya sendiri. Panduan ini akan mengurai kekacauan dan menunjukkan kepada Anda cara mengevaluasi embedding dalam praktiknya, sehingga Anda dapat memilih yang paling cocok untuk sistem RAG Anda.</p>
<h2 id="What-Are-Embeddings-and-Why-Do-They-Matter" class="common-anchor-header">Apa Itu Embeddings dan Mengapa Itu Penting?<button data-href="#What-Are-Embeddings-and-Why-Do-They-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Pada tingkat yang paling sederhana, embedding mengubah bahasa manusia menjadi angka yang dapat dimengerti oleh mesin. Setiap kata, kalimat, atau dokumen dipetakan ke dalam ruang vektor berdimensi tinggi, di mana jarak antara vektor menangkap hubungan di antara mereka. Teks dengan makna yang sama cenderung mengelompok bersama, sementara konten yang tidak terkait cenderung menjauh. Inilah yang memungkinkan pencarian semantik menemukan makna, bukan hanya mencocokkan kata kunci.</p>
<p>Model penyematan tidak semuanya bekerja dengan cara yang sama. Mereka umumnya terbagi ke dalam tiga kategori, masing-masing dengan kelebihan dan kekurangan:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Vektor jarang</strong></a> (seperti BM25) fokus pada frekuensi kata kunci dan panjang dokumen. Vektor ini sangat bagus untuk pencocokan eksplisit, tetapi buta terhadap sinonim dan konteks - "AI" dan "kecerdasan buatan" akan terlihat tidak berhubungan.</p></li>
<li><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>Vektor</strong></a> yang<a href="https://zilliz.com/learn/sparse-and-dense-embeddings"><strong>padat</strong></a> (seperti yang dihasilkan oleh BERT) menangkap semantik yang lebih dalam. Mereka dapat melihat bahwa "Apple merilis ponsel baru" berhubungan dengan "peluncuran produk iPhone", bahkan tanpa kata kunci yang sama. Kelemahannya adalah biaya komputasi yang lebih tinggi dan kemampuan penafsiran yang lebih rendah.</p></li>
<li><p><strong>Model hibrida</strong> (seperti BGE-M3) menggabungkan keduanya. Model ini dapat menghasilkan representasi yang jarang, padat, atau multi-vektor secara bersamaan-mempertahankan ketepatan pencarian kata kunci sekaligus menangkap nuansa semantik.</p></li>
</ul>
<p>Dalam praktiknya, pilihannya tergantung pada kasus penggunaan Anda: vektor jarang untuk kecepatan dan transparansi, padat untuk makna yang lebih kaya, dan hibrida ketika Anda menginginkan yang terbaik dari kedua dunia.</p>
<h2 id="Eight-Key-Factors-for-Evaluating-Embedding-Models" class="common-anchor-header">Delapan Faktor Utama untuk Mengevaluasi Model Penyematan<button data-href="#Eight-Key-Factors-for-Evaluating-Embedding-Models" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Context-Window" class="common-anchor-header"><strong>Jendela Konteks #1</strong></h3><p><a href="https://zilliz.com/glossary/context-window"><strong>Jendela konteks</strong></a> menentukan jumlah teks yang dapat diproses oleh sebuah model sekaligus. Karena satu token kira-kira 0,75 kata, angka ini secara langsung membatasi berapa lama bagian yang dapat "dilihat" oleh model saat membuat embedding. Jendela yang besar memungkinkan model untuk menangkap seluruh makna dokumen yang lebih panjang; jendela yang kecil memaksa Anda untuk memotong teks menjadi bagian-bagian yang lebih kecil, sehingga berisiko kehilangan konteks yang berarti.</p>
<p>Sebagai contoh, <a href="https://zilliz.com/ai-models/text-embedding-ada-002"><em>penyematan teks OpenAI-ada-002</em></a> mendukung hingga 8.192 token - cukup untuk mencakup seluruh makalah penelitian, termasuk abstrak, metode, dan kesimpulan. Sebaliknya, model dengan hanya 512 jendela token (seperti <em>m3e-base</em>) memerlukan pemotongan yang sering, yang dapat mengakibatkan hilangnya detail utama.</p>
<p>Kesimpulannya: jika kasus penggunaan Anda melibatkan dokumen yang panjang, seperti pengajuan hukum atau makalah akademis, pilihlah model dengan jendela token 8K+. Untuk teks yang lebih pendek, seperti obrolan dukungan pelanggan, jendela token 2K mungkin cukup.</p>
<h3 id="2-Tokenization-Unit" class="common-anchor-header">Unit Tokenisasi<strong># 2</strong> </h3><p>Sebelum penyematan dibuat, teks harus dipecah menjadi potongan-potongan kecil yang disebut <strong>token</strong>. Bagaimana tokenisasi ini terjadi memengaruhi seberapa baik model menangani kata-kata langka, istilah profesional, dan domain khusus.</p>
<ul>
<li><p><strong>Tokenisasi subkata (BPE):</strong> Memecah kata menjadi bagian yang lebih kecil (misalnya, "ketidakbahagiaan" → "un" + "kebahagiaan"). Ini adalah standar dalam LLM modern seperti GPT dan LLaMA, dan berfungsi dengan baik untuk kata-kata yang tidak ada di dalam kosa kata.</p></li>
<li><p><strong>Potongan Kata:</strong> Penyempurnaan BPE yang digunakan oleh BERT, yang dirancang untuk menyeimbangkan cakupan kosakata dengan efisiensi.</p></li>
<li><p><strong>Tokenisasi tingkat kata:</strong> Pemisahan hanya berdasarkan seluruh kata. Ini sederhana tetapi kesulitan dengan terminologi yang langka atau kompleks, sehingga tidak cocok untuk bidang teknis.</p></li>
</ul>
<p>Untuk domain khusus seperti kedokteran atau hukum, model berbasis subkata umumnya adalah yang terbaik-mereka dapat menangani istilah seperti <em>infark miokard</em> atau <em>subrogasi</em> dengan benar. Beberapa model modern, seperti <strong>NV-Embed</strong>, melangkah lebih jauh dengan menambahkan perangkat tambahan seperti lapisan perhatian laten, yang meningkatkan cara tokenisasi menangkap kosakata yang kompleks dan spesifik untuk domain tertentu.</p>
<h3 id="3-Dimensionality" class="common-anchor-header">Dimensi #3</h3><p><a href="https://zilliz.com/glossary/dimensionality-reduction"><strong>Dimensi vektor</strong></a> mengacu pada panjang vektor penyematan, yang menentukan seberapa banyak detail semantik yang dapat ditangkap oleh sebuah model. Dimensi yang lebih tinggi (misalnya, 1.536 atau lebih) memungkinkan perbedaan yang lebih baik antar konsep, tetapi harus dibayar dengan peningkatan penyimpanan, kueri yang lebih lambat, dan persyaratan komputasi yang lebih tinggi. Dimensi yang lebih rendah (seperti 768) lebih cepat dan lebih murah, tetapi berisiko kehilangan makna yang halus.</p>
<p>Kuncinya adalah keseimbangan. Untuk sebagian besar aplikasi tujuan umum, dimensi 768-1.536 memberikan perpaduan yang tepat antara efisiensi dan akurasi. Untuk tugas-tugas yang menuntut presisi tinggi-seperti pencarian akademis atau ilmiah-melampaui 2.000 dimensi dapat bermanfaat. Di sisi lain, sistem dengan sumber daya terbatas (seperti penerapan edge) dapat menggunakan 512 dimensi secara efektif, asalkan kualitas pencarian divalidasi. Pada beberapa sistem rekomendasi atau personalisasi yang ringan, dimensi yang lebih kecil pun mungkin sudah cukup.</p>
<h3 id="4-Vocabulary-Size" class="common-anchor-header">Ukuran Kosakata #4</h3><p><strong>Ukuran kosakata</strong> model mengacu pada jumlah token unik yang dapat dikenali oleh tokenizer. Hal ini secara langsung berdampak pada kemampuannya untuk menangani bahasa yang berbeda dan terminologi khusus domain. Jika sebuah kata atau karakter tidak ada dalam kosakata, kata atau karakter tersebut akan ditandai sebagai <code translate="no">[UNK]</code>, yang dapat menyebabkan hilangnya makna.</p>
<p>Persyaratannya berbeda-beda untuk setiap kasus penggunaan. Skenario multibahasa umumnya membutuhkan kosakata yang lebih besar - sekitar 50 ribu+ token, seperti dalam kasus <a href="https://zilliz.com/ai-models/bge-m3"><em>BGE-M3</em></a>. Untuk aplikasi khusus domain, cakupan istilah khusus adalah yang paling penting. Sebagai contoh, model hukum harus mendukung istilah-istilah seperti <em>&quot;undang-undang pembatasan&quot;</em> atau <em>&quot;akuisisi yang bonafid</em>&quot;, sementara model bahasa Mandarin harus memperhitungkan ribuan karakter dan tanda baca yang unik. Tanpa cakupan kosakata yang memadai, akurasi penyematan akan cepat rusak.</p>
<h3 id="-5-Training-Data" class="common-anchor-header">Data Pelatihan # 5</h3><p><strong>Data pelatihan</strong> mendefinisikan batas-batas dari apa yang "diketahui" oleh model penyematan. Model yang dilatih pada data yang luas dan bertujuan umum-seperti <em>penyematan teks-ada-002</em>, yang menggunakan campuran halaman web, buku, dan Wikipedia-cenderung berkinerja baik di berbagai domain. Namun, ketika Anda membutuhkan ketepatan di bidang khusus, model yang terlatih dengan domain sering kali menang. Sebagai contoh, <em>LegalBERT</em> dan <em>BioBERT</em> mengungguli model umum pada teks hukum dan biomedis, meskipun mereka kehilangan beberapa kemampuan generalisasi.</p>
<p>Aturan praktisnya:</p>
<ul>
<li><p><strong>Skenario umum</strong> → gunakan model yang dilatih pada kumpulan data yang luas, tetapi pastikan model tersebut mencakup bahasa target Anda. Sebagai contoh, aplikasi bahasa Mandarin membutuhkan model yang dilatih pada korpora bahasa Mandarin yang kaya.</p></li>
<li><p><strong>Domain vertikal</strong> → pilih model khusus domain untuk akurasi terbaik.</p></li>
<li><p><strong>Terbaik dari kedua dunia</strong> → model yang lebih baru seperti <strong>NV-Embed</strong>, yang dilatih dalam dua tahap dengan data umum dan data khusus domain, menunjukkan keuntungan yang menjanjikan dalam generalisasi <em>dan</em> ketepatan domain.</p></li>
</ul>
<h3 id="-6-Cost" class="common-anchor-header">Biaya #6</h3><p>Biaya bukan hanya tentang harga API, tetapi juga <strong>biaya ekonomi</strong> dan <strong>biaya komputasi</strong>. Model API yang di-host, seperti yang ada di OpenAI, berbasis penggunaan: Anda membayar per panggilan, tetapi tidak perlu khawatir tentang infrastruktur. Hal ini menjadikannya sempurna untuk pembuatan prototipe cepat, proyek percontohan, atau beban kerja skala kecil hingga menengah.</p>
<p>Opsi sumber terbuka, seperti <em>BGE</em> atau <em>Sentence-BERT</em>, bebas digunakan tetapi membutuhkan infrastruktur yang dikelola sendiri, biasanya cluster GPU atau TPU. Opsi ini lebih cocok untuk produksi skala besar, di mana penghematan jangka panjang dan fleksibilitas mengimbangi biaya penyiapan dan pemeliharaan satu kali.</p>
<p>Kesimpulan praktisnya: <strong>Model API ideal untuk iterasi cepat</strong>, sedangkan <strong>model open-source sering kali menang dalam produksi skala besar</strong> setelah Anda memperhitungkan total biaya kepemilikan (TCO). Memilih jalur yang tepat tergantung pada apakah Anda membutuhkan kecepatan ke pasar atau kontrol jangka panjang.</p>
<h3 id="-7-MTEB-Score" class="common-anchor-header">Skor MTEB # 7</h3><p><a href="https://zilliz.com/glossary/massive-text-embedding-benchmark-(mteb)"><strong>Massive Text Embedding Benchmark (MTEB</strong></a> ) adalah standar yang paling banyak digunakan untuk membandingkan model penyematan. Standar ini mengevaluasi kinerja di berbagai tugas, termasuk pencarian semantik, klasifikasi, pengelompokan, dan lainnya. Skor yang lebih tinggi umumnya berarti model tersebut memiliki kemampuan generalisasi yang lebih kuat di berbagai jenis tugas.</p>
<p>Meskipun demikian, MTEB bukanlah peluru perak. Sebuah model yang memiliki skor tinggi secara keseluruhan mungkin masih berkinerja buruk dalam kasus penggunaan spesifik Anda. Sebagai contoh, sebuah model yang dilatih terutama pada bahasa Inggris mungkin berkinerja baik pada tolok ukur MTEB tetapi kesulitan dengan teks medis khusus atau data non-Inggris. Pendekatan yang aman adalah dengan menggunakan MTEB sebagai titik awal dan kemudian memvalidasinya dengan <strong>dataset Anda sendiri</strong> sebelum berkomitmen.</p>
<h3 id="-8-Domain-Specificity" class="common-anchor-header">Kekhususan Domain # 8</h3><p>Beberapa model dibuat khusus untuk skenario tertentu, dan model tersebut bersinar di mana model umum gagal:</p>
<ul>
<li><p><strong>Legal:</strong> <em>LegalBERT</em> dapat membedakan istilah hukum yang halus, seperti <em>pertahanan</em> versus <em>yurisdiksi</em>.</p></li>
<li><p><strong>Biomedis:</strong> <em>BioBERT</em> secara akurat menangani frasa teknis seperti <em>mRNA</em> atau <em>terapi yang ditargetkan</em>.</p></li>
<li><p><strong>Multibahasa:</strong> <em>BGE-M3</em> mendukung lebih dari 100 bahasa, sehingga sangat cocok untuk aplikasi global yang membutuhkan jembatan antara bahasa Inggris, Mandarin, dan bahasa lainnya.</p></li>
<li><p><strong>Pengambilan kode:</strong> <em>Qwen3-Embedding</em> mencapai skor tingkat atas (81,0+) pada <em>MTEB-Code</em>, yang dioptimalkan untuk kueri terkait pemrograman.</p></li>
</ul>
<p>Jika kasus penggunaan Anda termasuk dalam salah satu domain ini, model yang dioptimalkan untuk domain dapat secara signifikan meningkatkan akurasi pengambilan. Namun untuk aplikasi yang lebih luas, tetap gunakan model tujuan umum kecuali jika pengujian Anda menunjukkan sebaliknya.</p>
<h2 id="Additional-Perspectives-for-Evaluating-Embeddings" class="common-anchor-header">Perspektif Tambahan untuk Mengevaluasi Penyematan<button data-href="#Additional-Perspectives-for-Evaluating-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Di luar delapan faktor inti, ada beberapa sudut pandang lain yang perlu dipertimbangkan jika Anda menginginkan evaluasi yang lebih mendalam:</p>
<ul>
<li><p><strong>Penyelarasan multibahasa</strong>: Untuk model multibahasa, tidak cukup hanya dengan mendukung banyak bahasa. Tes yang sebenarnya adalah apakah ruang vektor sudah selaras. Dengan kata lain, apakah kata-kata yang identik secara semantik - misalnya "cat" dalam bahasa Inggris dan "gato" dalam bahasa Spanyol - dipetakan berdekatan dalam ruang vektor? Penjajaran yang kuat memastikan pengambilan lintas bahasa yang konsisten.</p></li>
<li><p><strong>Pengujian lawan</strong>: Model penyematan yang baik harus stabil di bawah perubahan input yang kecil. Dengan memasukkan kalimat yang hampir sama (misalnya, "Kucing itu duduk di atas tikar" vs "Kucing itu duduk di atas tikar"), Anda dapat menguji apakah vektor yang dihasilkan bergeser secara wajar atau berfluktuasi secara liar. Perubahan yang besar sering kali menunjukkan kekokohan yang lemah.</p></li>
<li><p><strong>Koherensi semantik lokal</strong> mengacu pada fenomena pengujian apakah kata-kata yang mirip secara semantik mengelompok dengan erat di lingkungan lokal. Sebagai contoh, diberikan sebuah kata seperti "bank", model harus mengelompokkan istilah-istilah yang terkait (seperti "tepi sungai" dan "lembaga keuangan") dengan tepat sambil menjaga jarak dengan istilah-istilah yang tidak terkait. Mengukur seberapa sering kata-kata yang "mengganggu" atau tidak relevan masuk ke dalam lingkungan ini dapat membantu membandingkan kualitas model.</p></li>
</ul>
<p>Perspektif ini tidak selalu diperlukan untuk pekerjaan sehari-hari, tetapi perspektif ini sangat membantu untuk menguji stres penyematan dalam sistem produksi di mana multibahasa, presisi tinggi, atau stabilitas permusuhan sangat penting.</p>
<h2 id="Common-Embedding-Models-A-Brief-History" class="common-anchor-header">Model Penyematan Umum: Sejarah Singkat<button data-href="#Common-Embedding-Models-A-Brief-History" class="anchor-icon" translate="no">
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
    </button></h2><p>Kisah tentang model embedding sebenarnya adalah kisah tentang bagaimana mesin belajar memahami bahasa secara lebih mendalam dari waktu ke waktu. Setiap generasi telah melampaui batas-batas generasi sebelumnya - bergerak dari representasi kata statis ke penyematan model bahasa besar (LLM) saat ini yang dapat menangkap konteks bernuansa.</p>
<h3 id="Word2Vec-The-Starting-Point-2013" class="common-anchor-header">Word2Vec: Titik Awal (2013)</h3><p><a href="https://zilliz.com/glossary/word2vec">Word2Vec dari Google</a> merupakan terobosan pertama yang membuat penyematan menjadi sangat praktis. Hal ini didasarkan pada <em>hipotesis distribusi</em> dalam linguistik-gagasan bahwa kata-kata yang muncul dalam konteks yang sama sering kali memiliki makna yang sama. Dengan menganalisis teks dalam jumlah besar, Word2Vec memetakan kata-kata ke dalam ruang vektor di mana istilah-istilah yang terkait saling berdekatan. Sebagai contoh, "puma" dan "macan tutul" mengelompok di dekatnya karena habitat dan sifat berburu yang sama.</p>
<p>Word2Vec hadir dalam dua versi:</p>
<ul>
<li><p><strong>CBOW (Continuous Bag of Words):</strong> memprediksi kata yang hilang dari konteks sekitarnya.</p></li>
<li><p><strong>Skip-Gram:</strong> melakukan prediksi sebaliknya, yaitu memprediksi kata-kata di sekitarnya dari kata target.</p></li>
</ul>
<p>Pendekatan yang sederhana namun kuat ini memungkinkan analogi yang elegan seperti:</p>
<pre><code translate="no">king - man + woman = queen
<button class="copy-code-btn"></button></code></pre>
<p>Pada masanya, Word2Vec sangat revolusioner. Namun, ia memiliki dua keterbatasan yang signifikan. Pertama, pendekatan ini bersifat <strong>statis</strong>: setiap kata hanya memiliki satu vektor, sehingga "bank" memiliki arti yang sama, baik ketika kata tersebut berada di dekat kata "uang" atau "sungai". Kedua, ia hanya bekerja pada <strong>tingkat kata</strong>, meninggalkan kalimat dan dokumen di luar jangkauannya.</p>
<h3 id="BERT-The-Transformer-Revolution-2018" class="common-anchor-header">BERT: Revolusi Transformer (2018)</h3><p>Jika Word2Vec memberi kita peta makna yang pertama, <a href="https://zilliz.com/learn/what-is-bert"><strong>BERT (Bidirectional Encoder Representations dari Transformers)</strong></a> menggambar ulang dengan detail yang jauh lebih besar. Dirilis oleh Google pada tahun 2018, BERT menandai dimulainya era <em>pemahaman semantik yang mendalam</em> dengan memperkenalkan arsitektur Transformer ke dalam penyematan. Tidak seperti LSTM sebelumnya, Transformer dapat memeriksa semua kata dalam urutan secara bersamaan dan di kedua arah, memungkinkan konteks yang jauh lebih kaya.</p>
<p>Keajaiban BERT berasal dari dua tugas pra-pelatihan yang cerdas:</p>
<ul>
<li><p><strong>Pemodelan Bahasa Terselubung (MLM):</strong> Menyembunyikan kata-kata dalam kalimat secara acak dan memaksa model untuk memprediksinya, mengajarkannya untuk menyimpulkan makna dari konteks.</p></li>
<li><p><strong>Prediksi Kalimat Berikutnya (NSP):</strong> Melatih model untuk memutuskan apakah dua kalimat mengikuti satu sama lain, membantunya mempelajari hubungan antar kalimat.</p></li>
</ul>
<p>Di bawah tenda, vektor input BERT menggabungkan tiga elemen: penyematan token (kata itu sendiri), penyematan segmen (bagian dari kalimat mana), dan penyematan posisi (di mana kata itu berada dalam urutan). Bersama-sama, hal ini memberikan BERT kemampuan untuk menangkap hubungan semantik yang kompleks pada tingkat <strong>kalimat</strong> dan <strong>dokumen</strong>. Lompatan ini membuat BERT menjadi canggih untuk tugas-tugas seperti menjawab pertanyaan dan pencarian semantik.</p>
<p>Tentu saja, BERT tidak sempurna. Versi awalnya terbatas pada <strong>jendela 512 token</strong>, yang berarti dokumen yang panjang harus dipotong-potong dan terkadang kehilangan maknanya. Vektornya yang padat juga kurang bisa ditafsirkan - Anda bisa melihat dua teks yang cocok, tetapi tidak selalu bisa menjelaskan alasannya. Varian yang lebih baru, seperti <strong>RoBERTa</strong>, meninggalkan tugas NSP setelah penelitian menunjukkan bahwa tugas ini hanya memberikan sedikit manfaat, namun tetap mempertahankan pelatihan MLM yang kuat.</p>
<h3 id="BGE-M3-Fusing-Sparse-and-Dense-2023" class="common-anchor-header">BGE-M3: Memadukan Jarang dan Padat (2023)</h3><p>Pada tahun 2023, bidang ini sudah cukup matang untuk menyadari bahwa tidak ada satu metode penyematan yang dapat menyelesaikan semuanya. Masukkan <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a> (BAAI General Embedding-M3), model hibrida yang secara eksplisit dirancang untuk tugas-tugas pengambilan. Inovasi utamanya adalah tidak hanya menghasilkan satu jenis vektor saja, tetapi juga menghasilkan vektor padat, vektor jarang, dan multi-vektor sekaligus, menggabungkan kekuatan mereka.</p>
<ul>
<li><p><strong>Vektor padat</strong> menangkap semantik yang dalam, menangani sinonim dan parafrase (misalnya, "peluncuran iPhone", ≈ "Apple merilis ponsel baru").</p></li>
<li><p><strong>Vektor jarang</strong> memberikan bobot istilah secara eksplisit. Meskipun kata kunci tidak muncul, model dapat menyimpulkan relevansi-misalnya, menghubungkan "produk baru iPhone" dengan "Apple Inc." dan "smartphone."</p></li>
<li><p><strong>Multi-vektor</strong> menyempurnakan penyematan padat lebih lanjut dengan memungkinkan setiap token untuk menyumbangkan skor interaksinya sendiri, yang sangat membantu untuk pengambilan berbutir halus.</p></li>
</ul>
<p>Jalur pelatihan BGE-M3 mencerminkan kecanggihan ini:</p>
<ol>
<li><p><strong>Pra-pelatihan</strong> pada data besar yang tidak berlabel dengan <em>RetroMAE</em> (masked encoder + reconstruction decoder) untuk membangun pemahaman semantik secara umum.</p></li>
<li><p>Penyempurnaan<strong>umum</strong> menggunakan pembelajaran kontras pada 100 juta pasangan teks, mempertajam kinerja pengambilannya.</p></li>
<li><p>Penyempurnaan<strong>tugas</strong> dengan penyetelan instruksi dan pengambilan sampel negatif yang kompleks untuk pengoptimalan skenario tertentu.</p></li>
</ol>
<p>Hasilnya sangat mengesankan: BGE-M3 menangani berbagai perincian (dari tingkat kata hingga tingkat dokumen), memberikan kinerja multibahasa yang kuat - terutama dalam bahasa Mandarin - dan menyeimbangkan akurasi dengan efisiensi yang lebih baik daripada sebagian besar pesaingnya. Dalam praktiknya, hal ini merupakan langkah maju yang besar dalam membangun model penyematan yang kuat dan praktis untuk pengambilan berskala besar.</p>
<h3 id="LLMs-as-Embedding-Models-2023–Present" class="common-anchor-header">LLM sebagai Model Penyematan (2023-Sekarang)</h3><p>Selama bertahun-tahun, kebijaksanaan yang berlaku adalah bahwa model bahasa besar yang hanya decoder (LLM), seperti GPT, tidak cocok untuk penyematan. Perhatian kausal mereka-yang hanya melihat token sebelumnya-diperkirakan membatasi pemahaman semantik yang mendalam. Tetapi penelitian terbaru telah membalikkan asumsi tersebut. Dengan penyesuaian yang tepat, LLM dapat menghasilkan penyematan yang menyaingi, dan terkadang melampaui, model yang dibuat khusus. Dua contoh penting adalah LLM2Vec dan NV-Embed.</p>
<p><strong>LLM2Vec</strong> mengadaptasi LLM khusus decoder dengan tiga perubahan utama:</p>
<ul>
<li><p><strong>Konversi perhatian dua arah</strong>: mengganti masker kausal sehingga setiap token dapat memperhatikan urutan penuh.</p></li>
<li><p><strong>Prediksi token berikutnya yang disamarkan (MNTP):</strong> tujuan pelatihan baru yang mendorong pemahaman dua arah.</p></li>
<li><p><strong>Pembelajaran kontras tanpa pengawasan:</strong> terinspirasi oleh SimCSE,<strong>pembelajaran</strong> ini mendekatkan kalimat-kalimat yang secara semantik mirip dalam ruang vektor.</p></li>
</ul>
<p>Sementara itu,<strong>NV-Embed</strong> mengambil pendekatan yang lebih ramping:</p>
<ul>
<li><p><strong>Lapisan perhatian laten:</strong> menambahkan "susunan laten" yang dapat dilatih untuk meningkatkan penyatuan urutan.</p></li>
<li><p><strong>Pelatihan dua arah langsung:</strong> cukup hapus masker kausal dan sempurnakan dengan pembelajaran kontras.</p></li>
<li><p><strong>Optimasi pengumpulan</strong> rata-rata<strong>:</strong> menggunakan rata-rata tertimbang di seluruh token untuk menghindari "bias token terakhir".</p></li>
</ul>
<p>Hasilnya adalah penyematan berbasis LLM modern menggabungkan <strong>pemahaman semantik yang mendalam</strong> dengan <strong>skalabilitas</strong>. Mereka dapat menangani <strong>jendela konteks yang sangat panjang (8K-32K token)</strong>, menjadikannya sangat kuat untuk tugas-tugas yang berat dalam penelitian, hukum, atau pencarian perusahaan. Dan karena mereka menggunakan kembali tulang punggung LLM yang sama, mereka terkadang dapat memberikan embedding berkualitas tinggi bahkan di lingkungan yang lebih terbatas.</p>
<h2 id="Conclusion-Turning-Theory-into-Practice" class="common-anchor-header">Kesimpulan: Mengubah Teori Menjadi Praktik<button data-href="#Conclusion-Turning-Theory-into-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam hal memilih model penyematan, teori hanya membawa Anda sejauh ini. Pengujian yang sebenarnya adalah seberapa baik kinerjanya dalam sistem <em>Anda</em> dengan data <em>Anda.</em> Beberapa langkah praktis dapat membuat perbedaan antara model yang terlihat bagus di atas kertas dan model yang benar-benar berfungsi dalam produksi:</p>
<ul>
<li><p><strong>Menyaring dengan subset MTEB.</strong> Gunakan tolok ukur, terutama tugas pengambilan, untuk membangun daftar pendek awal kandidat.</p></li>
<li><p><strong>Menguji dengan data bisnis yang sebenarnya.</strong> Buat set evaluasi dari dokumen Anda sendiri untuk mengukur recall, presisi, dan latensi dalam kondisi dunia nyata.</p></li>
<li><p><strong>Memeriksa kompatibilitas basis data.</strong> Vektor yang jarang membutuhkan dukungan indeks terbalik, sementara vektor padat berdimensi tinggi membutuhkan lebih banyak penyimpanan dan komputasi. Pastikan basis data vektor Anda dapat mengakomodasi pilihan Anda.</p></li>
<li><p><strong>Tangani dokumen panjang dengan cerdas.</strong> Memanfaatkan strategi segmentasi, seperti jendela geser, untuk efisiensi, dan memasangkannya dengan model jendela konteks yang besar untuk mempertahankan makna.</p></li>
</ul>
<p>Dari vektor statis sederhana Word2Vec hingga penyematan bertenaga LLM dengan konteks 32 ribu, kami telah melihat langkah besar dalam cara mesin memahami bahasa. Namun, inilah pelajaran yang akhirnya dipelajari oleh setiap pengembang: model dengan <em>nilai tertinggi</em> tidak selalu merupakan model <em>terbaik</em> untuk kasus penggunaan Anda.</p>
<p>Pada akhirnya, pengguna tidak peduli dengan papan peringkat MTEB atau grafik tolok ukur-mereka hanya ingin menemukan informasi yang tepat, dengan cepat. Pilihlah model yang menyeimbangkan akurasi, biaya, dan kompatibilitas dengan sistem Anda, dan Anda akan membuat sesuatu yang tidak hanya mengesankan secara teori, tetapi benar-benar berfungsi di dunia nyata.</p>
