---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: >-
  Menguji dan Menerapkan Solusi Pencarian Vektor dengan Cepat dengan Milvus 2.0
  Bootcamp
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  Bangun, uji, dan sesuaikan solusi pencarian kemiripan vektor dengan Milvus,
  sebuah basis data vektor sumber terbuka.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Menguji dan Menerapkan Solusi Pencarian Vektor dengan Cepat dengan Bootcamp Milvus 2.0</custom-h1><p>Dengan dirilisnya Milvus 2.0, tim telah merombak <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> Milvus. Bootcamp yang baru dan lebih baik ini menawarkan panduan yang diperbarui dan contoh kode yang lebih mudah diikuti untuk berbagai kasus penggunaan dan penerapan. Selain itu, versi baru ini diperbarui untuk <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a>, versi baru dari database vektor tercanggih di dunia.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">Uji stres sistem Anda dengan tolok ukur dataset 1 juta dan 100 juta</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">Direktori benchmark</a> berisi 1 juta dan 100 juta tes benchmark vektor yang mengindikasikan bagaimana sistem Anda akan bereaksi terhadap dataset dengan ukuran berbeda.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">Jelajahi dan buat solusi pencarian kemiripan vektor yang populer</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">Direktori solusi</a> berisi kasus penggunaan pencarian kemiripan vektor yang paling populer. Setiap kasus penggunaan berisi solusi notebook dan solusi yang dapat diterapkan di docker. Kasus penggunaan meliputi:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">Pencarian kemiripan gambar</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">Pencarian kemiripan video</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Pencarian kemiripan audio</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">Sistem rekomendasi</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">Pencarian molekuler</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">Sistem penjawab pertanyaan</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">Menerapkan aplikasi yang dibangun sepenuhnya dengan cepat pada sistem apa pun</h3><p>Solusi penerapan cepat adalah solusi dockerized yang memungkinkan pengguna untuk menerapkan aplikasi yang dibangun sepenuhnya pada sistem apa pun. Solusi ini ideal untuk demo singkat, tetapi memerlukan pekerjaan tambahan untuk menyesuaikan dan memahami dibandingkan dengan notebook.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">Gunakan notebook khusus skenario untuk menggunakan aplikasi yang telah dikonfigurasi sebelumnya dengan mudah</h3><p>Notebook berisi contoh sederhana penerapan Milvus untuk menyelesaikan masalah dalam kasus penggunaan tertentu. Setiap contoh dapat dijalankan dari awal hingga akhir tanpa perlu mengelola file atau konfigurasi. Setiap buku catatan juga mudah diikuti dan dimodifikasi, menjadikannya file dasar yang ideal untuk proyek-proyek lain.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">Contoh buku catatan pencarian kemiripan gambar</h3><p>Pencarian kemiripan gambar adalah salah satu ide inti di balik banyak teknologi yang berbeda, termasuk mobil otonom yang mengenali objek. Contoh ini menjelaskan cara membuat program visi komputer dengan mudah menggunakan Milvus.</p>
<p>Buku catatan ini membahas tiga hal:</p>
<ul>
<li>Server Milvus</li>
<li>Server Redis (untuk penyimpanan metadata)</li>
<li>Model Resnet-18 yang telah dilatih sebelumnya.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">Langkah 1: Unduh paket-paket yang diperlukan</h4><p>Mulailah dengan mengunduh semua paket yang diperlukan untuk proyek ini. Buku catatan ini menyertakan tabel yang berisi daftar paket yang digunakan.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">Langkah 2: Pengaktifan server</h4><p>Setelah paket terinstal, mulai server dan pastikan keduanya berjalan dengan baik. Pastikan untuk mengikuti instruksi yang benar untuk memulai server <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a> dan <a href="https://hub.docker.com/_/redis">Redis</a>.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">Langkah 3: Mengunduh data proyek</h4><p>Secara default, notebook ini mengambil potongan data VOCImage untuk digunakan sebagai contoh, tetapi direktori apa pun yang berisi gambar dapat digunakan selama mengikuti struktur berkas yang dapat dilihat di bagian atas notebook.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">Langkah 4: Hubungkan ke server</h4><p>Pada contoh ini, server berjalan pada port default pada hos lokal.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">Langkah 5: Membuat koleksi</h4><p>Setelah menjalankan server, buatlah sebuah koleksi di Milvus untuk menyimpan semua vektor. Pada contoh ini, ukuran dimensi diatur ke 512, ukuran keluaran resnet-18, dan metrik kemiripan diatur ke jarak Euclidean (L2). Milvus mendukung berbagai <a href="https://milvus.io/docs/v2.0.x/metric.md">metrik kemiripan</a> yang berbeda.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">Langkah 6: Buatlah indeks untuk koleksi</h4><p>Setelah koleksi dibuat, buatlah indeks untuk koleksi tersebut. Dalam kasus ini, indeks IVF_SQ8 digunakan. Indeks ini membutuhkan parameter 'nlist', yang memberi tahu Milvus berapa banyak klaster yang harus dibuat dalam setiap datafile (segmen). <a href="https://milvus.io/docs/v2.0.x/index.md">Indeks</a> yang berbeda membutuhkan parameter yang berbeda.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">Langkah 7: Menyiapkan model dan pemuat data</h4><p>Setelah indeks IVF_SQ8 dibuat, siapkan jaringan saraf dan pemuat data. Python resnet-18 yang telah dilatih sebelumnya yang digunakan dalam contoh ini tanpa lapisan terakhirnya, yang memampatkan vektor untuk klasifikasi dan mungkin kehilangan informasi yang berharga.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>Dataset dan pemuat data perlu dimodifikasi agar dapat melakukan prapemrosesan dan pengumpulan gambar sekaligus menyediakan jalur file gambar. Hal ini dapat dilakukan dengan dataloader torchvision yang sedikit dimodifikasi. Untuk prapemrosesan, gambar harus dipotong dan dinormalisasi karena model resnet-18 dilatih pada ukuran dan rentang nilai tertentu.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">Langkah 8: Masukkan vektor ke dalam koleksi</h4><p>Dengan penyiapan koleksi, gambar dapat diproses dan dimuat ke dalam koleksi yang dibuat. Pertama, gambar diambil oleh dataloader dan dijalankan melalui model resnet-18. Penyematan vektor yang dihasilkan kemudian dimasukkan ke dalam Milvus, yang mengembalikan ID unik untuk setiap vektor. ID vektor dan jalur berkas gambar kemudian dimasukkan sebagai pasangan nilai-kunci ke dalam server Redis.</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">Langkah 9: Lakukan pencarian kesamaan vektor</h4><p>Setelah semua data dimasukkan ke dalam Milvus dan Redis, pencarian kemiripan vektor yang sebenarnya dapat dilakukan. Dalam contoh ini, tiga gambar yang dipilih secara acak diambil dari server Redis untuk dilakukan pencarian kemiripan vektor.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>Gambar-gambar ini pertama-tama melalui prapemrosesan yang sama dengan yang ditemukan di Langkah 7 dan kemudian didorong melalui model resnet-18.</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian penyematan vektor yang dihasilkan digunakan untuk melakukan pencarian. Pertama, tetapkan parameter pencarian, termasuk nama koleksi yang akan dicari, nprobe (jumlah cluster yang akan dicari), dan top_k (jumlah vektor yang dikembalikan). Dalam contoh ini, pencarian harus sangat cepat.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">Langkah 10: Hasil pencarian gambar</h4><p>ID vektor yang dikembalikan dari kueri digunakan untuk menemukan gambar yang sesuai. Matplotlib kemudian digunakan untuk menampilkan hasil pencarian gambar.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Pelajari cara menggunakan Milvus di lingkungan yang berbeda</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">Bagian penerapan</a> pada bootcamp baru berisi semua informasi untuk menggunakan Milvus di lingkungan dan pengaturan yang berbeda. Ini termasuk menerapkan Mishard, menggunakan Kubernetes dengan Milvus, penyeimbangan beban, dan banyak lagi. Setiap lingkungan memiliki panduan langkah demi langkah yang mendetail yang menjelaskan cara membuat Milvus bekerja di dalamnya.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">Jangan menjadi orang asing</h3><ul>
<li>Baca <a href="https://zilliz.com/blog">blog</a> kami.</li>
<li>Berinteraksi dengan komunitas sumber terbuka kami di <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Gunakan atau berkontribusi ke Milvus, basis data vektor paling populer di dunia, di <a href="https://github.com/milvus-io/milvus">Github</a>.</li>
</ul>
