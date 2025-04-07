---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: >-
  Menghasilkan Gambar yang Lebih Kreatif dan Terkurasi ala Ghibli dengan GPT-4o
  dan Milvus
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: >-
  Menghubungkan Data Pribadi Anda dengan GPT-4o Menggunakan Milvus untuk Hasil
  Gambar yang Lebih Terkurasi
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">Semua Orang Menjadi Seniman dalam Semalam dengan GPT-4o<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Percaya atau tidak, gambar yang baru saja Anda lihat itu dihasilkan oleh AI-khususnya, oleh GPT-4o yang baru saja dirilis!</em></p>
<p>Ketika OpenAI meluncurkan fitur pembuatan gambar asli GPT-4o pada tanggal 26 Maret, tidak ada yang dapat memprediksi tsunami kreatif yang mengikutinya. Dalam semalam, internet meledak dengan potret gaya Ghibli yang dihasilkan oleh AI - selebriti, politisi, hewan peliharaan, dan bahkan pengguna sendiri diubah menjadi karakter Studio Ghibli yang menawan hanya dengan beberapa perintah sederhana. Permintaannya sangat luar biasa sehingga Sam Altman sendiri harus "memohon" kepada para pengguna untuk memperlambatnya, dengan men-tweet bahwa "GPU OpenAI meleleh."</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Contoh gambar yang dihasilkan GPT-4o (kredit X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">Mengapa GPT-4o Mengubah Segalanya<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk industri kreatif, ini merupakan perubahan paradigma. Tugas yang dulunya membutuhkan waktu seharian bagi seluruh tim desain, sekarang bisa diselesaikan hanya dalam hitungan menit. Apa yang membuat GPT-4o berbeda dari generator gambar sebelumnya adalah <strong>konsistensi visual yang luar biasa dan antarmuka yang intuitif</strong>. Ini mendukung percakapan multi-putaran yang memungkinkan Anda menyempurnakan gambar dengan menambahkan elemen, menyesuaikan proporsi, mengubah gaya, atau bahkan mengubah 2D menjadi 3D-pada dasarnya, menempatkan desainer profesional di saku Anda.</p>
<p>Rahasia di balik performa superior GPT-4o? Ini adalah arsitektur autoregresif. Tidak seperti model difusi (seperti Stable Diffusion) yang mendegradasi gambar menjadi noise sebelum merekonstruksinya, GPT-4o menghasilkan gambar secara berurutan-satu token dalam satu waktu-mempertahankan kesadaran kontekstual selama proses berlangsung. Perbedaan arsitektur yang mendasar ini menjelaskan mengapa GPT-4o menghasilkan hasil yang lebih koheren dengan petunjuk yang lebih lugas dan alami.</p>
<p>Namun, di sinilah hal yang menarik bagi para pengembang: <strong>Semakin banyak tanda yang menunjukkan tren utama - model AI itu sendiri menjadi produk. Sederhananya, sebagian besar produk yang hanya membungkus model AI besar di sekitar data domain publik berisiko tertinggal.</strong></p>
<p>Kekuatan sebenarnya dari kemajuan ini berasal dari penggabungan model besar untuk tujuan umum dengan <strong>data pribadi yang spesifik untuk domain tertentu</strong>. Kombinasi ini mungkin merupakan strategi bertahan hidup yang optimal bagi sebagian besar perusahaan di era model bahasa yang besar. Karena model dasar terus berkembang, keunggulan kompetitif yang langgeng akan menjadi milik mereka yang dapat secara efektif mengintegrasikan kumpulan data milik mereka dengan sistem AI yang kuat ini.</p>
<p>Mari kita jelajahi cara menghubungkan data pribadi Anda dengan GPT-4o menggunakan Milvus, database vektor sumber terbuka dan berkinerja tinggi.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Menghubungkan Data Pribadi Anda dengan GPT-4o Menggunakan Milvus untuk Hasil Gambar yang Lebih Terkurasi<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor adalah teknologi utama yang menjembatani data pribadi Anda dengan model AI. Database ini bekerja dengan mengubah konten Anda - baik gambar, teks, atau audio - menjadi representasi matematis (vektor) yang menangkap makna dan karakteristiknya. Hal ini memungkinkan pencarian semantik berdasarkan kemiripan, bukan hanya kata kunci.</p>
<p>Milvus, sebagai basis data vektor sumber terbuka terkemuka, sangat cocok untuk dihubungkan dengan alat AI generatif seperti GPT-4o. Berikut ini cara saya menggunakannya untuk memecahkan tantangan pribadi.</p>
<h3 id="Background" class="common-anchor-header">Latar Belakang</h3><p>Suatu hari, saya memiliki ide cemerlang-mengubah semua kenakalan anjing saya, Cola, menjadi sebuah komik strip. Namun ada satu kendala: Bagaimana saya bisa menyaring puluhan ribu foto dari tempat kerja, perjalanan, dan petualangan kuliner untuk menemukan momen-momen nakal Cola?</p>
<p>Jawabannya? Impor semua foto saya ke Milvus dan lakukan pencarian gambar.</p>
<p>Mari kita telusuri penerapannya langkah demi langkah.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">Ketergantungan dan Lingkungan</h4><p>Pertama, Anda perlu menyiapkan lingkungan Anda dengan paket yang tepat:</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">Menyiapkan Data</h4><p>Saya akan menggunakan perpustakaan foto saya, yang memiliki sekitar 30.000 foto, sebagai kumpulan data dalam panduan ini. Jika Anda tidak memiliki dataset apa pun, unduh dataset sampel dari Milvus dan buka ritsletingnya:</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">Tentukan Pengekstrak Fitur</h4><p>Kita akan menggunakan mode ResNet-50 dari pustaka <code translate="no">timm</code> untuk mengekstrak vektor penyematan dari gambar kita. Model ini telah dilatih pada jutaan gambar dan dapat mengekstrak fitur-fitur bermakna yang mewakili konten visual.</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Membuat Koleksi Milvus</h4><p>Selanjutnya, kita akan membuat koleksi Milvus untuk menyimpan penyematan gambar kita. Anggap saja ini sebagai basis data khusus yang secara eksplisit dirancang untuk pencarian kemiripan vektor:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>Catatan tentang Parameter MilvusClient:</strong></p>
<ul>
<li><p><strong>Pengaturan Lokal:</strong> Menggunakan berkas lokal (misalnya, <code translate="no">./milvus.db</code>) adalah cara termudah untuk memulai-Milvus Lite akan menangani semua data Anda.</p></li>
<li><p><strong>Peningkatan Skala:</strong> Untuk kumpulan data yang besar, siapkan server Milvus yang kuat menggunakan Docker atau Kubernetes dan gunakan URI-nya (misalnya, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p><strong>Opsi Cloud:</strong> Jika Anda menggunakan Zilliz Cloud (layanan yang dikelola sepenuhnya oleh Milvus), sesuaikan URI dan token Anda agar sesuai dengan titik akhir publik dan kunci API.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Memasukkan Penyematan Gambar ke dalam Milvus</h4><p>Sekarang sampai pada proses menganalisis setiap gambar dan menyimpan representasi vektornya. Langkah ini mungkin membutuhkan waktu, tergantung pada ukuran set data Anda, tetapi ini adalah proses satu kali:</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">Melakukan Pencarian Gambar</h4><p>Dengan database yang sudah terisi, sekarang kita bisa mencari gambar yang mirip. Di sinilah keajaiban terjadi-kita bisa menemukan foto yang mirip secara visual menggunakan kesamaan vektor:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Gambar yang dikembalikan ditampilkan seperti di bawah ini:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">Menggabungkan Pencarian Vektor dengan GPT-4o: Menghasilkan Gambar Bergaya Ghibli dengan Gambar yang Dikembalikan oleh Milvus</h3><p>Sekarang, tiba pada bagian yang menarik: menggunakan hasil pencarian gambar sebagai masukan bagi GPT-4o untuk menghasilkan konten kreatif. Dalam kasus saya, saya ingin membuat komik strip yang menampilkan anjing saya, Cola, berdasarkan foto yang saya ambil.</p>
<p>Alur kerjanya sederhana namun dahsyat:</p>
<ol>
<li><p>Gunakan pencarian vektor untuk menemukan gambar Cola yang relevan dari koleksi saya</p></li>
<li><p>Masukkan gambar-gambar ini ke GPT-4o dengan petunjuk kreatif</p></li>
<li><p>Menghasilkan komik yang unik berdasarkan inspirasi visual</p></li>
</ol>
<p>Berikut ini beberapa contoh yang bisa dihasilkan dari kombinasi ini:</p>
<p><strong>Petunjuk yang saya gunakan:</strong></p>
<ul>
<li><p><em>"Buatlah komik strip empat panel, penuh warna, dan lucu yang menampilkan seekor anjing Border Collie yang tertangkap basah sedang menggerogoti seekor tikus-dengan momen yang canggung saat pemiliknya mengetahuinya."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Buatlah komik yang menampilkan anjing ini mengenakan pakaian yang lucu."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Dengan menggunakan anjing ini sebagai model, buatlah komik strip tentang anjing ini yang sedang bersekolah di Sekolah Sihir dan Ilmu Sihir Hogwarts."<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">Beberapa Kiat Singkat dari Pengalaman Saya dalam Membuat Gambar:</h3><ol>
<li><p>Buatlah yang<strong>sederhana</strong>: Tidak seperti model difusi yang rewel, GPT-4o bekerja paling baik dengan perintah yang lugas. Saya mendapati diri saya menulis petunjuk yang semakin pendek dan singkat, dan mendapatkan hasil yang lebih baik.</p></li>
<li><p><strong>Bahasa Inggris adalah yang terbaik</strong>: Saya mencoba memberikan petunjuk dalam bahasa Mandarin untuk beberapa komik, tetapi hasilnya tidak terlalu bagus. Saya akhirnya menulis petunjuk dalam bahasa Inggris dan kemudian menerjemahkan komik yang sudah jadi bila diperlukan.</p></li>
<li><p><strong>Tidak bagus untuk Pembuatan Video</strong>: Jangan terlalu berharap banyak pada Sora, karena video yang dihasilkan oleh AI masih memiliki kekurangan dalam hal gerakan yang lancar dan alur cerita yang koheren.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">Apa Selanjutnya? Perspektif Saya dan Terbuka untuk Diskusi<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan gambar yang dihasilkan AI yang memimpin, melihat sekilas pada rilis utama OpenAI selama enam bulan terakhir menunjukkan pola yang jelas: apakah itu GPT untuk pasar aplikasi, DeepResearch untuk pembuatan laporan, GPT-4o untuk pembuatan gambar percakapan, atau Sora untuk keajaiban video - model AI besar melangkah dari balik tirai ke dalam sorotan. Apa yang dulunya merupakan teknologi eksperimental kini telah matang menjadi produk yang nyata dan dapat digunakan.</p>
<p>Saat GPT-4o dan model serupa diterima secara luas, sebagian besar alur kerja dan agen cerdas berdasarkan Stable Diffusion sedang menuju ke arah keusangan. Namun, nilai tak tergantikan dari data pribadi dan wawasan manusia tetap kuat. Sebagai contoh, meskipun AI tidak akan sepenuhnya menggantikan agensi kreatif, mengintegrasikan basis data vektor Milvus dengan model GPT memungkinkan agensi untuk dengan cepat menghasilkan ide-ide segar dan kreatif yang terinspirasi dari kesuksesan mereka di masa lalu. Platform e-commerce dapat mendesain pakaian yang dipersonalisasi berdasarkan tren belanja, dan institusi akademis dapat langsung membuat visual untuk makalah penelitian.</p>
<p>Era produk yang didukung oleh model AI telah tiba, dan perlombaan untuk menambang tambang emas data baru saja dimulai. Bagi para pengembang dan bisnis, pesannya jelas: gabungkan data unik Anda dengan model-model canggih ini atau Anda akan tertinggal.</p>
