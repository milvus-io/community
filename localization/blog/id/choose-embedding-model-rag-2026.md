---
id: choose-embedding-model-rag-2026.md
title: >-
  Cara Memilih Model Penyematan Terbaik untuk RAG pada tahun 2026: 10 Model yang
  Dibandingkan
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  Kami membandingkan 10 model penyematan pada tugas kompresi lintas-modal,
  lintas-bahasa, dokumen panjang, dan dimensi. Lihat mana yang sesuai dengan
  pipeline RAG Anda.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL; DR:</strong> Kami menguji 10 <a href="https://zilliz.com/ai-models">model penyematan</a> di empat skenario produksi yang terlewatkan oleh tolok ukur publik: pengambilan lintas-modal, pengambilan lintas-bahasa, pengambilan informasi utama, dan kompresi dimensi. Tidak ada satu model pun yang memenangkan segalanya. Gemini Embedding 2 adalah yang terbaik secara keseluruhan. Qwen3-VL-2B sumber terbuka mengalahkan API sumber tertutup pada tugas-tugas lintas modal. Jika Anda perlu mengompres dimensi untuk menghemat penyimpanan, gunakan Voyage Multimodal 3.5 atau Jina Embeddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">Mengapa MTEB Tidak Cukup untuk Memilih Model Penyematan<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebagian besar prototipe <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> dimulai dengan penyematan teks-3-kecil dari OpenAI. Ini murah, mudah diintegrasikan, dan untuk pengambilan teks bahasa Inggris, ini bekerja dengan cukup baik. Tetapi RAG produksi berkembang dengan cepat. Pipeline Anda mengambil gambar, PDF, dokumen multibahasa - dan <a href="https://zilliz.com/ai-models">model penyematan</a> teks saja tidak lagi cukup.</p>
<p><a href="https://huggingface.co/spaces/mteb/leaderboard">Papan peringkat MTEB</a> memberi tahu Anda bahwa ada pilihan yang lebih baik. Masalahnya? MTEB hanya menguji pengambilan teks satu bahasa. Ini tidak mencakup pengambilan lintas-modal (kueri teks terhadap koleksi gambar), pencarian lintas-bahasa (kueri bahasa Mandarin yang menemukan dokumen bahasa Inggris), akurasi dokumen panjang, atau seberapa banyak kualitas yang hilang ketika Anda memotong <a href="https://zilliz.com/glossary/dimension">dimensi penyematan</a> untuk menghemat penyimpanan di <a href="https://zilliz.com/learn/what-is-a-vector-database">basis data vektor</a> Anda.</p>
<p>Jadi, model penyematan mana yang harus Anda gunakan? Hal ini tergantung pada tipe data Anda, bahasa Anda, panjang dokumen Anda, dan apakah Anda memerlukan kompresi dimensi. Kami membuat tolok ukur yang disebut <strong>CCKM</strong> dan menguji 10 model yang dirilis antara tahun 2025 dan 2026 pada dimensi tersebut.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">Apa yang dimaksud dengan tolok ukur CCKM?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong> (Cross-modal, Cross-lingual, Informasi utama, MRL) menguji empat kemampuan yang tidak dimiliki oleh tolok ukur standar:</p>
<table>
<thead>
<tr><th>Dimensi</th><th>Apa yang Diuji</th><th>Mengapa Ini Penting</th></tr>
</thead>
<tbody>
<tr><td><strong>Pengambilan lintas-modal</strong></td><td>Mencocokkan deskripsi teks dengan gambar yang benar ketika terdapat distraktor yang hampir sama</td><td>Pipa<a href="https://zilliz.com/learn/multimodal-rag">RAG multimodal</a> membutuhkan penyematan teks dan gambar dalam ruang vektor yang sama</td></tr>
<tr><td><strong>Pengambilan lintas bahasa</strong></td><td>Menemukan dokumen bahasa Inggris yang benar dari kueri bahasa Mandarin, dan sebaliknya</td><td>Basis pengetahuan produksi sering kali multibahasa</td></tr>
<tr><td><strong>Pengambilan informasi utama</strong></td><td>Menemukan fakta spesifik yang terkubur dalam dokumen berkarakter 4K-32K (jarum di dalam tumpukan jerami)</td><td>Sistem RAG sering memproses dokumen panjang seperti kontrak dan makalah penelitian</td></tr>
<tr><td><strong>Kompresi dimensi MRL</strong></td><td>Mengukur seberapa besar kualitas model yang hilang ketika Anda memotong embedding menjadi 256 dimensi</td><td>Lebih sedikit dimensi = biaya penyimpanan yang lebih rendah dalam basis data vektor Anda, tetapi dengan biaya kualitas yang bagaimana?</td></tr>
</tbody>
</table>
<p>MTEB tidak mencakup semua ini. MMEB menambahkan multimodal tetapi melewatkan hard negatif, sehingga model mendapat nilai tinggi tanpa membuktikan bahwa model tersebut menangani perbedaan yang halus. CCKM dirancang untuk menutupi apa yang mereka lewatkan.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">Model Embedding Mana yang Kami Uji? Penyematan Gemini 2, Penyematan Jina v4, dan Lainnya<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>Kami menguji 10 model yang mencakup layanan API dan opsi sumber terbuka, ditambah CLIP ViT-L-14 sebagai baseline tahun 2021.</p>
<table>
<thead>
<tr><th>Model</th><th>Sumber</th><th>Parameter</th><th>Dimensi</th><th>Modalitas</th><th>Sifat Utama</th></tr>
</thead>
<tbody>
<tr><td>Penyematan Gemini 2</td><td>Google</td><td>Dirahasiakan</td><td>3072</td><td>Teks / gambar / video / audio / PDF</td><td>Semua modalitas, cakupan terluas</td></tr>
<tr><td>Jina Embeddings v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>Teks / gambar / PDF</td><td>Adaptor MRL + LoRA</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>Dirahasiakan</td><td>1024</td><td>Teks / gambar / video</td><td>Seimbang di seluruh tugas</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>Alibaba Qwen</td><td>2B</td><td>2048</td><td>Teks / gambar / video</td><td>Sumber terbuka, multimodal yang ringan</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>Teks / gambar</td><td>Arsitektur CLIP yang dimodernisasi</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>Dirahasiakan</td><td>Diperbaiki</td><td>Teks</td><td>Pengambilan perusahaan</td></tr>
<tr><td>Penyematan teks OpenAI-3-besar</td><td>OpenAI</td><td>Dirahasiakan</td><td>3072</td><td>Teks</td><td>Paling banyak digunakan</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>Teks</td><td>Sumber terbuka, 100+ bahasa</td></tr>
<tr><td>mxbai-menyematkan-besar</td><td>AI Roti Campur (Mixedbread)</td><td>335M</td><td>1024</td><td>Teks</td><td>Ringan, berfokus pada bahasa Inggris</td></tr>
<tr><td>teks yang disematkan nomic</td><td>Nomic AI</td><td>137M</td><td>768</td><td>Teks</td><td>Sangat ringan</td></tr>
<tr><td>Klip ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>Teks / gambar</td><td>Dasar</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">Pencarian Lintas-Modal: Model Mana yang Menangani Pencarian Teks-ke-Gambar?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika pipeline RAG Anda menangani gambar bersama teks, model penyematan harus menempatkan kedua modalitas dalam <a href="https://zilliz.com/glossary/vector-embeddings">ruang vektor</a> yang sama. Pikirkan pencarian gambar e-commerce, basis pengetahuan gambar-teks campuran, atau sistem apa pun yang membutuhkan kueri teks untuk menemukan gambar yang tepat.</p>
<h3 id="Method" class="common-anchor-header">Metode</h3><p>Kami mengambil 200 pasangan gambar-teks dari COCO val2017. Untuk setiap gambar, GPT-4o-mini menghasilkan deskripsi yang terperinci. Kemudian kami menulis 3 hard negatif per gambar - deskripsi yang berbeda dari yang benar hanya satu atau dua detail. Model harus menemukan kecocokan yang tepat dalam kumpulan 200 gambar dan 600 pengacau.</p>
<p>Contoh dari kumpulan data:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>Koper kulit cokelat antik dengan stiker perjalanan termasuk California dan Kuba, diletakkan di rak koper logam dengan latar belakang langit biru - digunakan sebagai gambar uji dalam tolok ukur pengambilan lintas-modal</span> </span></p>
<blockquote>
<p><strong>Deskripsi yang benar:</strong> "Gambar ini menampilkan koper kulit cokelat antik dengan berbagai stiker perjalanan, termasuk 'California', 'Kuba', dan 'New York', yang ditempatkan pada rak koper logam dengan latar belakang langit biru yang jernih."</p>
<p><strong>Negatif yang keras:</strong> Kalimat yang sama, tetapi "California" menjadi "Florida" dan "langit biru" menjadi "langit mendung." Sang model harus benar-benar memahami detail gambar untuk membedakannya.</p>
</blockquote>
<p><strong>Penilaian:</strong></p>
<ul>
<li>Hasilkan <a href="https://zilliz.com/glossary/vector-embeddings">penyematan</a> untuk semua gambar dan semua teks (200 deskripsi yang benar + 600 negatif).</li>
<li><strong>Teks-ke-gambar (t2i):</strong> Setiap deskripsi mencari 200 gambar untuk mencari kecocokan terdekat. Nilai satu poin jika hasil teratas benar.</li>
<li><strong>Gambar-ke-teks (i2t):</strong> Setiap gambar mencari semua 800 teks untuk kecocokan terdekat. Nilai satu poin hanya jika hasil teratas adalah deskripsi yang benar, bukan hard negatif.</li>
<li><strong>Nilai akhir:</strong> hard_avg_R@1 = (akurasi t2i + akurasi i2t) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Hasil</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>Diagram batang horizontal yang menunjukkan Peringkat Pencarian Lintas Moda: Qwen3-VL-2B memimpin dengan 0,945, diikuti oleh Gemini Embed 2 dengan 0,928, Voyage MM-3.5 dengan 0,900, Jina CLIP v2 dengan 0,873, dan CLIP ViT-L-14 dengan 0,768</span> </span></p>
<p>Qwen3-VL-2B, sebuah model parameter 2B sumber terbuka dari tim Qwen Alibaba, berada di urutan pertama - mengungguli semua API sumber tertutup.</p>
<p><strong>Kesenjangan modalitas</strong> menjelaskan sebagian besar perbedaannya. Model penyematan memetakan teks dan gambar ke dalam ruang vektor yang sama, tetapi dalam praktiknya, kedua modalitas tersebut cenderung mengelompok di wilayah yang berbeda. Kesenjangan modalitas mengukur jarak L2 antara kedua cluster tersebut. Kesenjangan yang lebih kecil = pengambilan lintas modalitas yang lebih mudah.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>Visualisasi yang membandingkan kesenjangan modalitas yang besar (0,73, klaster penyematan teks dan gambar yang berjauhan) versus kesenjangan modalitas yang kecil (0,25, klaster yang saling tumpang tindih) - kesenjangan yang lebih kecil membuat pencocokan lintas modalitas lebih mudah</span> </span></p>
<table>
<thead>
<tr><th>Model</th><th>Skor (R@1)</th><th>Kesenjangan Modalitas</th><th>Parameter</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (sumber terbuka)</td></tr>
<tr><td>Penyematan Gemini 2</td><td>0.928</td><td>0.73</td><td>Tidak diketahui (tertutup)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>Tidak diketahui (ditutup)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Kesenjangan modalitas Qwen adalah 0,25 - kira-kira sepertiga dari 0,73 milik Gemini. Dalam <a href="https://zilliz.com/learn/what-is-a-vector-database">basis data vektor</a> seperti <a href="https://milvus.io/">Milvus</a>, kesenjangan modalitas yang kecil berarti Anda dapat menyimpan penyematan teks dan gambar dalam <a href="https://milvus.io/docs/manage-collections.md">koleksi</a> yang sama dan <a href="https://milvus.io/docs/single-vector-search.md">mencari</a> di antara keduanya secara langsung. Kesenjangan yang besar dapat membuat <a href="https://zilliz.com/glossary/similarity-search">pencarian kemiripan</a> lintas modalitas menjadi kurang dapat diandalkan, dan Anda mungkin memerlukan langkah pemeringkatan ulang untuk mengimbanginya.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">Pencarian Lintas Bahasa: Model Mana yang Menyelaraskan Makna Lintas Bahasa?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis pengetahuan multibahasa adalah hal yang umum dalam produksi. Seorang pengguna mengajukan pertanyaan dalam bahasa Mandarin, tetapi jawabannya ada dalam dokumen bahasa Inggris - atau sebaliknya. Model penyematan perlu menyelaraskan makna di seluruh bahasa, tidak hanya di dalam satu bahasa.</p>
<h3 id="Method" class="common-anchor-header">Metode</h3><p>Kami membuat 166 pasangan kalimat paralel dalam bahasa Mandarin dan Inggris di tiga tingkat kesulitan:</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>Tingkat kesulitan lintas bahasa</span>: <span>Tingkat mudah memetakan terjemahan harfiah seperti 我爱你 menjadi Aku mencintaimu; Tingkat sedang memetakan kalimat yang diparafrasekan seperti 这道菜太咸了 menjadi Hidangan ini terlalu asin dengan kata negatif yang sulit; Tingkat sulit memetakan idiom bahasa Mandarin seperti 画蛇添足 menjadi menyepuh bunga bakung dengan kata negatif yang berbeda secara semantik</span> </span></p>
<p>Setiap bahasa juga mendapatkan 152 distraktor negatif keras.</p>
<p><strong>Penilaian:</strong></p>
<ul>
<li>Buatlah penyematan untuk semua teks bahasa Mandarin (166 benar + 152 pengecoh) dan semua teks bahasa Inggris (166 benar + 152 pengecoh).</li>
<li><strong>Bahasa Mandarin → Bahasa Inggris:</strong> Setiap kalimat bahasa Mandarin mencari 318 teks bahasa Inggris untuk mendapatkan terjemahan yang benar.</li>
<li><strong>Bahasa Inggris → Bahasa Mandarin:</strong> Hal yang sama berlaku sebaliknya.</li>
<li><strong>Nilai akhir:</strong> hard_avg_R@1 = (akurasi bahasa Mandarin → bahasa Inggris + akurasi bahasa Inggris → bahasa Mandarin) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Hasil</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>Diagram batang horizontal yang menunjukkan Peringkat Pengambilan Lintas Bahasa</span>: <span>Gemini Embed 2 memimpin dengan 0,997, diikuti oleh Qwen3-VL-2B dengan 0,988, Jina v4 dengan 0,985, Voyage MM-3.5 dengan 0,982, hingga mxbai dengan 0,120</span> </span></p>
<p>Gemini Embedding 2 mendapatkan nilai 0,997 - nilai tertinggi dari semua model yang diuji. Ini adalah satu-satunya model yang mendapat nilai sempurna 1.000 pada tingkat Hard, di mana pasangan seperti "画蛇添足" → "menyepuh bunga bakung" membutuhkan pemahaman <a href="https://zilliz.com/glossary/semantic-search">semantik</a> yang asli di seluruh bahasa, bukan pencocokan pola.</p>
<table>
<thead>
<tr><th>Model</th><th>Skor (R@1)</th><th>Mudah</th><th>Sedang</th><th>Sulit (idiom)</th></tr>
</thead>
<tbody>
<tr><td>Penyematan Gemini 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-besar</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-besar (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>7 model teratas semuanya memiliki skor 0,93 pada skor keseluruhan - perbedaan nyata terjadi pada tingkat Hard (idiom bahasa Mandarin). nomic-embed-text dan mxbai-embed-large, keduanya merupakan model ringan yang berfokus pada bahasa Inggris, memiliki skor mendekati nol pada tugas lintas bahasa.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">Pengambilan Informasi Utama: Dapatkah Model Menemukan Jarum dalam Dokumen 32K-Token?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>Sistem RAG sering kali memproses dokumen yang panjang - kontrak hukum, makalah penelitian, laporan internal yang berisi <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data yang tidak terstruktur</a>. Pertanyaannya adalah apakah model embedding masih dapat menemukan satu fakta spesifik yang terkubur dalam ribuan karakter teks di sekitarnya.</p>
<h3 id="Method" class="common-anchor-header">Metode</h3><p>Kami menggunakan artikel Wikipedia dengan panjang yang bervariasi (4K hingga 32K karakter) sebagai tumpukan jerami dan menyisipkan satu fakta yang dibuat - jarum - pada posisi yang berbeda: awal, 25%, 50%, 75%, dan akhir. Model ini harus menentukan, berdasarkan penyematan kueri, versi dokumen mana yang berisi jarum tersebut.</p>
<p><strong>Contoh:</strong></p>
<ul>
<li><strong>Jarum:</strong> "Perusahaan Meridian melaporkan pendapatan kuartalan sebesar $847,3 juta pada Q3 2025."</li>
<li><strong>Pertanyaan:</strong> "Berapa pendapatan kuartalan Meridian Corporation?"</li>
<li><strong>Tumpukan:</strong> Artikel Wikipedia sepanjang 32.000 karakter tentang fotosintesis, dengan jarum tersembunyi di suatu tempat di dalamnya.</li>
</ul>
<p><strong>Penilaian:</strong></p>
<ul>
<li>Hasilkan sematan untuk kueri, dokumen dengan jarum, dan dokumen tanpa jarum.</li>
<li>Jika kueri lebih mirip dengan dokumen yang mengandung jarum, hitung sebagai hit.</li>
<li>Akurasi rata-rata di semua panjang dokumen dan posisi jarum.</li>
<li><strong>Metrik akhir:</strong> overall_accuracy dan degradation_rate (seberapa besar penurunan akurasi dari dokumen terpendek ke dokumen terpanjang).</li>
</ul>
<h3 id="Results" class="common-anchor-header">Hasil</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>Peta panas yang menunjukkan akurasi Needle-in-a-Haystack berdasarkan panjang dokumen</span>: <span>Gemini Embed 2 mendapat skor 1.000 di semua panjang dokumen hingga 32K; 7 model teratas mendapat skor sempurna di dalam jendela konteksnya; mxbai dan nomic menurun tajam pada 4K+</span> </span></p>
<p>Gemini Embedding 2 adalah satu-satunya model yang diuji di seluruh rentang 4K-32K, dan model ini mendapatkan skor sempurna di setiap panjangnya. Tidak ada model lain dalam pengujian ini yang memiliki jendela konteks yang mencapai 32K.</p>
<table>
<thead>
<tr><th>Model</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>Secara keseluruhan</th><th>Degradasi</th></tr>
</thead>
<tbody>
<tr><td>Penyematan Gemini 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-besar</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Embeddings v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Pelayaran Multimoda 3.5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-menyematkan-besar (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-" berarti panjang dokumen melebihi jendela konteks model.</p>
<p>Tujuh model teratas memiliki nilai sempurna dalam jendela konteks mereka. BGE-M3 mulai tergelincir pada 8K (0,920). Model ringan (mxbai dan nomic) turun menjadi 0,4-0,6 hanya pada 4K karakter - sekitar 1.000 token. Untuk mxbai, penurunan ini sebagian mencerminkan jendela konteks 512 token yang memotong sebagian besar dokumen.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">Kompresi Dimensi MRL: Berapa Banyak Kualitas yang Hilang pada 256 Dimensi?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Matryoshka Representation Learning (MRL</strong> ) adalah teknik pelatihan yang membuat N dimensi pertama dari sebuah vektor menjadi lebih bermakna. Ambil vektor berdimensi 3072, potong menjadi 256, dan vektor tersebut masih memiliki sebagian besar kualitas semantiknya. Dimensi yang lebih sedikit berarti biaya penyimpanan dan memori yang lebih rendah dalam <a href="https://zilliz.com/learn/what-is-a-vector-database">basis data vektor</a> Anda - beralih dari 3072 ke 256 dimensi adalah pengurangan penyimpanan 12x lipat.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>Ilustrasi yang menunjukkan pemotongan dimensi MRL: 3072 dimensi dengan kualitas penuh, 1024 pada 95%, 512 pada 90%, 256 pada 85% - dengan penghematan penyimpanan 12x pada 256 dimensi</span> </span></p>
<h3 id="Method" class="common-anchor-header">Metode</h3><p>Kami menggunakan 150 pasangan kalimat dari tolok ukur STS-B, masing-masing dengan skor kemiripan yang dianotasi manusia (0-5). Untuk setiap model, kami menghasilkan embedding pada dimensi penuh, kemudian dipotong menjadi 1024, 512, dan 256.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>Contoh data STS-B yang menunjukkan pasangan kalimat dengan skor kemiripan manusia</span>: <span>Seorang gadis sedang menata rambutnya vs Seorang gadis sedang menyisir rambutnya memiliki skor 2.5; Sekelompok pria bermain sepak bola di pantai vs Sekelompok anak laki-laki bermain sepak bola di pantai memiliki skor 3.6</span> </span></p>
<p><strong>Pemberian skor:</strong></p>
<ul>
<li>Pada setiap tingkat dimensi, hitung <a href="https://zilliz.com/glossary/cosine-similarity">kemiripan kosinus</a> antara setiap pasangan kalimat yang disematkan.</li>
<li>Bandingkan peringkat kemiripan model dengan peringkat manusia menggunakan <strong>ρ</strong> (korelasi peringkat) <strong>Spearman.</strong> </li>
</ul>
<blockquote>
<p><strong>Apa yang dimaksud dengan ρ Spearman?</strong> Ini mengukur seberapa baik kesesuaian antara dua peringkat. Jika manusia memberi peringkat pasangan A sebagai yang paling mirip, B kedua, C paling tidak mirip - dan kemiripan kosinus model menghasilkan urutan yang sama A &gt; B &gt; C - maka ρ mendekati 1,0. Nilai ρ sebesar 1,0 berarti kesepakatan yang sempurna. Nilai ρ sebesar 0 berarti tidak ada korelasi.</p>
</blockquote>
<p><strong>Metrik akhir:</strong> spearman_rho (lebih tinggi lebih baik) dan min_viable_dim (dimensi terkecil di mana kualitas tetap berada dalam 5% dari kinerja dimensi penuh).</p>
<h3 id="Results" class="common-anchor-header">Hasil</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>Plot titik yang menunjukkan Dimensi Penuh MRL vs Kualitas 256 Dimensi: Voyage MM-3.5 memimpin dengan perubahan +0.6%, Jina v4 +0.5%, sedangkan Gemini Embed 2 menunjukkan -0.6% di bagian bawah</span> </span></p>
<p>Jika Anda berencana untuk mengurangi biaya penyimpanan di <a href="https://milvus.io/">Milvus</a> atau basis data vektor lain dengan memotong dimensi, hasil ini penting.</p>
<table>
<thead>
<tr><th>Model</th><th>ρ (redup penuh)</th><th>ρ (256 redup)</th><th>Peluruhan</th></tr>
</thead>
<tbody>
<tr><td>Pelayaran Multimodal 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-besar (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-besar</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>Penyematan Gemini 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage dan Jina v4 memimpin karena keduanya dilatih secara eksplisit dengan MRL sebagai tujuan. Kompresi dimensi tidak ada hubungannya dengan ukuran model - apakah model dilatih untuk itu adalah hal yang penting.</p>
<p>Catatan tentang skor Gemini: peringkat MRL mencerminkan seberapa baik sebuah model mempertahankan kualitas setelah pemotongan, bukan seberapa baik pengambilan dimensi penuhnya. Pengambilan dimensi penuh Gemini sangat kuat - hasil lintas bahasa dan informasi utama sudah membuktikannya. Hanya saja tidak dioptimalkan untuk pengecilan. Jika Anda tidak membutuhkan kompresi dimensi, metrik ini tidak berlaku untuk Anda.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">Model Penyematan Mana yang Harus Anda Gunakan?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>Tidak ada satu model pun yang memenangkan segalanya. Berikut adalah kartu penilaian lengkapnya:</p>
<table>
<thead>
<tr><th>Model</th><th>Parameter</th><th>Lintas-Modal</th><th>Lintas Bahasa</th><th>Informasi Utama</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>Penyematan Gemini 2</td><td>Dirahasiakan</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Pelayaran Multimoda 3.5</td><td>Tidak diungkapkan</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Embeddings v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-besar</td><td>Dirahasiakan</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>Dirahasiakan</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-menyematkan-besar</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>nomic-embed-text</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>Jepitkan ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-" berarti model tidak mendukung modalitas atau kemampuan tersebut. CLIP adalah garis dasar tahun 2021 sebagai referensi.</p>
<p>Inilah yang menonjol:</p>
<ul>
<li><strong>Modal silang:</strong> Qwen3-VL-2B (0,945) pertama, Gemini (0,928) kedua, Voyage (0,900) ketiga. Model 2B sumber terbuka mengalahkan semua API sumber tertutup. Faktor yang menentukan adalah kesenjangan modalitas, bukan jumlah parameter.</li>
<li><strong>Lintas bahasa:</strong> Gemini (0,997) memimpin - satu-satunya model yang mendapat nilai sempurna pada penyelarasan tingkat idiom. Delapan model teratas semuanya memiliki skor 0,93. Model ringan yang hanya berbahasa Inggris memiliki skor mendekati nol.</li>
<li><strong>Informasi kunci:</strong> API dan model sumber terbuka yang besar memiliki skor sempurna hingga 8K. Model di bawah 335M mulai menurun pada 4K. Gemini adalah satu-satunya model yang menangani 32K dengan skor sempurna.</li>
<li><strong>Kompresi dimensi MRL:</strong> Voyage (0,880) dan Jina v4 (0,833) memimpin, kehilangan kurang dari 1% pada 256 dimensi. Gemini (0,668) berada di urutan terakhir - kuat pada dimensi penuh, tidak dioptimalkan untuk pemotongan.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">Cara Memilih: Diagram Alir Keputusan</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>Menanamkan diagram alir pemilihan model</span>: <span>Mulai → Perlu gambar atau video? → Ya: Perlu menyelenggarakan sendiri? → Ya: Qwen3-VL-2B, Tidak: Gemini Embedding 2. Tidak ada gambar → Perlu menghemat penyimpanan? → Ya: Jina v4 atau Voyage, Tidak: Perlu multibahasa? → Ya: Gemini Embedding 2, Tidak: OpenAI 3-besar</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">Yang Terbaik dari yang Terbaik: Gemini Embedding 2</h3><p>Secara keseluruhan, Gemini Embedding 2 adalah model terkuat secara keseluruhan dalam tolok ukur ini.</p>
<p><strong>Kekuatan:</strong> Pertama dalam lintas bahasa (0,997) dan pengambilan informasi utama (1,000 di semua panjang hingga 32K). Kedua dalam lintas modalitas (0,928). Cakupan modalitas terluas - lima modalitas (teks, gambar, video, audio, PDF) di mana sebagian besar model hanya memiliki tiga modalitas.</p>
<p><strong>Kelemahan:</strong> Terakhir dalam kompresi MRL (ρ = 0,668). Dikalahkan dalam hal modalitas silang oleh Qwen3-VL-2B yang bersumber terbuka.</p>
<p>Jika Anda tidak membutuhkan kompresi dimensi, Gemini tidak memiliki pesaing yang nyata dalam kombinasi pengambilan lintas bahasa + dokumen panjang. Tetapi untuk ketepatan lintas-modal atau pengoptimalan penyimpanan, model khusus lebih baik.</p>
<h2 id="Limitations" class="common-anchor-header">Keterbatasan<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>Kami tidak menyertakan semua model yang layak dipertimbangkan - NVIDIA NV-Embed-v2 dan Jina v5-text ada dalam daftar, tetapi tidak masuk dalam putaran ini.</li>
<li>Kami berfokus pada modalitas teks dan gambar; penyematan video, audio, dan PDF (meskipun beberapa model mengklaim dukungannya) tidak tercakup.</li>
<li>Pengambilan kode dan skenario khusus domain lainnya tidak tercakup.</li>
<li>Ukuran sampel relatif kecil, sehingga perbedaan peringkat yang ketat di antara model-model tersebut mungkin termasuk dalam gangguan statistik.</li>
</ul>
<p>Hasil artikel ini akan ketinggalan zaman dalam waktu satu tahun. Model-model baru terus diluncurkan, dan papan peringkat selalu berubah di setiap rilis. Investasi yang lebih tahan lama adalah membangun jalur evaluasi Anda sendiri - tentukan tipe data Anda, pola kueri Anda, panjang dokumen Anda, dan jalankan model-model baru melalui pengujian Anda sendiri saat model-model tersebut turun. Benchmark publik seperti MTEB, MMTEB, dan MMEB layak untuk dipantau, tetapi keputusan akhir harus selalu berasal dari data Anda sendiri.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">Kode benchmark kami bersifat open-source di GitHub</a> - gabungkan dan sesuaikan dengan kasus penggunaan Anda.</p>
<hr>
<p>Setelah Anda memilih model penyematan, Anda memerlukan tempat untuk menyimpan dan mencari vektor-vektor tersebut dalam skala besar. <a href="https://milvus.io/">Milvus</a> adalah basis data vektor sumber terbuka yang paling banyak diadopsi di dunia dengan <a href="https://github.com/milvus-io/milvus">43 ribu lebih bintang GitHub</a> yang dibuat untuk hal ini - <a href="https://milvus.io/">Milvus</a> mendukung dimensi terpotong MRL, koleksi multimodal campuran, pencarian hibrida yang menggabungkan vektor padat dan jarang, dan <a href="https://milvus.io/docs/architecture_overview.md">skala dari laptop hingga miliaran vektor</a>.</p>
<ul>
<li>Mulailah dengan <a href="https://milvus.io/docs/quickstart.md">panduan Memulai Cepat Milvus</a>, atau instal dengan <code translate="no">pip install pymilvus</code>.</li>
<li>Bergabunglah dengan <a href="https://milvusio.slack.com/">Milvus Slack</a> atau <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> untuk mengajukan pertanyaan tentang integrasi model, strategi pengindeksan vektor, atau penskalaan produksi.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Jam Kerja Milvus gratis</a> untuk membahas arsitektur RAG Anda - kami dapat membantu pemilihan model, desain skema koleksi, dan penyetelan kinerja.</li>
<li>Jika Anda lebih suka melewatkan pekerjaan infrastruktur, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (dikelola Milvus) menawarkan tingkat gratis untuk memulai.</li>
</ul>
<hr>
<p>Beberapa pertanyaan yang muncul ketika para insinyur memilih model penyematan untuk RAG produksi:</p>
<p><strong>T: Haruskah saya menggunakan model penyematan multimodal meskipun saat ini saya hanya memiliki data teks?</strong></p>
<p>Itu tergantung pada peta jalan Anda. Jika pipeline Anda kemungkinan akan menambahkan gambar, PDF, atau modalitas lain dalam 6-12 bulan ke depan, memulai dengan model multimodal seperti Gemini Embedding 2 atau Voyage Multimodal 3.5 dapat menghindari migrasi yang menyakitkan di kemudian hari - Anda tidak perlu menyematkan ulang seluruh dataset Anda. Jika Anda yakin bahwa ini hanya teks saja di masa mendatang, model yang berfokus pada teks seperti OpenAI 3-large atau Cohere Embed v4 akan memberikan harga/kinerja yang lebih baik.</p>
<p><strong>T: Berapa banyak penyimpanan yang sebenarnya dihemat oleh kompresi dimensi MRL dalam basis data vektor?</strong></p>
<p>Beralih dari 3072 dimensi ke 256 dimensi adalah pengurangan 12x penyimpanan per vektor. Untuk koleksi <a href="https://milvus.io/">Milvus</a> dengan 100 juta vektor pada float32, itu kira-kira 1,14 TB → 95 GB. Kuncinya adalah tidak semua model menangani pemotongan dengan baik - Voyage Multimodal 3.5 dan Jina Embeddings v4 kehilangan kualitas kurang dari 1% pada 256 dimensi, sementara model lainnya mengalami penurunan kualitas yang signifikan.</p>
<p><strong>T: Apakah Qwen3-VL-2B benar-benar lebih baik daripada Gemini Embedding 2 untuk pencarian lintas-modal?</strong></p>
<p>Pada tolok ukur kami, ya - Qwen3-VL-2B mendapat nilai 0,945 berbanding 0,928 dari Gemini untuk pencarian lintas-modal yang sulit dengan pengacau yang hampir sama. Alasan utamanya adalah kesenjangan modalitas Qwen yang jauh lebih kecil (0,25 vs 0,73), yang berarti <a href="https://zilliz.com/glossary/vector-embeddings">penyematan</a> teks dan gambar mengelompok lebih dekat dalam ruang vektor. Meskipun demikian, Gemini mencakup lima modalitas sementara Qwen mencakup tiga modalitas, jadi jika Anda membutuhkan penyematan audio atau PDF, Gemini adalah satu-satunya pilihan.</p>
<p><strong>T: Dapatkah saya menggunakan model-model penyematan ini dengan Milvus secara langsung?</strong></p>
<p>Ya. Semua model ini menghasilkan vektor float standar, yang dapat Anda <a href="https://milvus.io/docs/insert-update-delete.md">masukkan ke dalam Milvus</a> dan mencari dengan <a href="https://zilliz.com/glossary/cosine-similarity">kemiripan kosinus</a>, jarak L2, atau inner product. <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> dapat digunakan dengan model penyisipan apa pun - buat vektor Anda dengan SDK model, lalu simpan dan cari di Milvus. Untuk vektor terpotong MRL, cukup atur dimensi koleksi ke target Anda (misalnya, 256) saat <a href="https://milvus.io/docs/manage-collections.md">membuat koleksi.</a></p>
