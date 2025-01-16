---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: Siapkan Milvus di Google Colaboratory untuk Kemudahan Membangun Aplikasi ML
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Google Colab memudahkan pengembangan dan pengujian aplikasi machine learning.
  Pelajari cara menyiapkan Milvus di Colab untuk manajemen data vektor berskala
  masif yang lebih baik.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Siapkan Milvus di Google Colaboratory untuk Kemudahan Membangun Aplikasi ML</custom-h1><p>Kemajuan teknologi terus membuat kecerdasan buatan (AI) dan analitik berskala mesin menjadi lebih mudah diakses dan digunakan. <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">Proliferasi</a> perangkat lunak sumber terbuka, kumpulan data publik, dan alat gratis lainnya adalah kekuatan utama yang mendorong tren ini. Dengan menggabungkan dua sumber daya gratis, <a href="https://milvus.io/">Milvus</a> dan <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a> ("Colab"), siapa pun dapat membuat solusi AI dan analisis data yang kuat dan fleksibel. Artikel ini memberikan petunjuk untuk menyiapkan Milvus di Colab, serta melakukan operasi dasar menggunakan kit pengembangan perangkat lunak Python (SDK).</p>
<p><strong>Langsung ke:</strong></p>
<ul>
<li><a href="#what-is-milvus">Apa itu Milvus?</a></li>
<li><a href="#what-is-google-colaboratory">Apa itu Google Colaboratory?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Memulai Milvus di Google Colaboratory</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Menjalankan operasi dasar Milvus di Google Colab dengan Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus dan Google Colaboratory bekerja sama dengan baik</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Apa itu Milvus?</h3><p><a href="https://milvus.io/">Milvus</a> adalah mesin pencari kemiripan vektor sumber terbuka yang dapat diintegrasikan dengan pustaka indeks yang diadopsi secara luas, termasuk Faiss, NMSLIB, dan Annoy. Platform ini juga menyertakan seperangkat API intuitif yang komprehensif. Dengan memasangkan Milvus dengan model kecerdasan buatan (AI), berbagai macam aplikasi dapat dibangun termasuk:</p>
<ul>
<li>Mesin pencari gambar, video, audio, dan teks semantik.</li>
<li>Sistem rekomendasi dan chatbot.</li>
<li>Pengembangan obat baru, skrining genetik, dan aplikasi biomedis lainnya.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">Apa itu Google Colaboratory?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a> adalah produk dari tim Google Research yang memungkinkan siapa saja untuk menulis dan menjalankan kode python dari browser web. Colab dibangun dengan mempertimbangkan pembelajaran mesin dan aplikasi analisis data, menawarkan lingkungan notebook Jupyter gratis, disinkronkan dengan Google Drive, dan memberi pengguna akses ke sumber daya komputasi awan yang kuat (termasuk GPU). Platform ini mendukung banyak pustaka pembelajaran mesin yang populer dan dapat diintegrasikan dengan PyTorch, TensorFlow, Keras, dan OpenCV.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Memulai dengan Milvus di Google Colaboratory</h3><p>Meskipun Milvus merekomendasikan <a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">penggunaan Docker</a> untuk menginstal dan memulai layanan, lingkungan cloud Google Colab saat ini tidak mendukung instalasi Docker. Selain itu, tutorial ini bertujuan untuk semudah mungkin diakses - dan tidak semua orang menggunakan Docker. Instal dan mulai sistem dengan <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">mengompilasi kode sumber Milvus</a> untuk menghindari penggunaan Docker.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Unduh kode sumber Milvus dan buat buku catatan baru di Colab</h3><p>Google Colab dilengkapi dengan semua perangkat lunak pendukung untuk Milvus yang sudah terinstal, termasuk alat kompilasi yang diperlukan GCC, CMake, dan Git serta driver CUDA dan NVIDIA, sehingga menyederhanakan proses instalasi dan penyiapan Milvus. Untuk memulai, unduh kode sumber Milvus dan buat notebook baru di Google Colab:</p>
<ol>
<li>Unduh kode sumber Milvus: Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Unggah kode sumber Milvus ke <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> dan buat buku catatan baru.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mengatur Milvus di Google Colaboratory untuk Membuat Aplikasi ML dengan Mudah_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Kompilasi Milvus dari kode sumber</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Unduh kode sumber Milvus</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">Menginstal ketergantungan</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Bangun kode sumber Milvus</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Catatan: Jika versi GPU dikompilasi dengan benar, pemberitahuan "Sumber daya GPU diaktifkan!" akan muncul.</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Meluncurkan server Milvus</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">Tambahkan direktori lib/ ke LD_LIBRARY_PATH:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Mulai dan jalankan server Milvus di latar belakang:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Menampilkan status server Milvus:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Catatan: Jika server Milvus berhasil dijalankan, maka akan muncul perintah berikut ini:</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Mengatur Milvus di Google Colaboratory untuk Pembuatan Aplikasi ML yang Mudah_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Menjalankan operasi dasar Milvus di Google Colab dengan Python</h3><p>Setelah berhasil diluncurkan di Google Colab, Milvus dapat menyediakan berbagai antarmuka API untuk Python, Java, Go, Restful, dan C++. Di bawah ini adalah instruksi untuk menggunakan antarmuka Python untuk melakukan operasi dasar Milvus di Colab.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">Instal pymilvus:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">Hubungkan ke server:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">Membuat koleksi/partisi/indeks:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">Sisipkan dan siram:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">Memuat dan mencari:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">Mendapatkan informasi koleksi/indeks:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">Dapatkan vektor berdasarkan ID:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">Mendapatkan/menetapkan parameter:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">Menghapus indeks/vektor/partisi/koleksi:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus dan Google Colaboratory bekerja dengan sangat baik</h3><p>Google Colaboratory adalah layanan cloud gratis dan intuitif yang sangat menyederhanakan kompilasi Milvus dari kode sumber dan menjalankan operasi Python dasar. Kedua sumber daya ini tersedia bagi siapa saja untuk digunakan, membuat teknologi AI dan pembelajaran mesin lebih mudah diakses oleh semua orang. Untuk informasi lebih lanjut tentang Milvus, lihat sumber-sumber berikut:</p>
<ul>
<li>Untuk tutorial tambahan yang mencakup berbagai macam aplikasi, kunjungi <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</li>
<li>Untuk pengembang yang tertarik untuk memberikan kontribusi atau memanfaatkan sistem ini, temukan <a href="https://github.com/milvus-io/milvus">Milvus di GitHub</a>.</li>
<li>Untuk informasi lebih lanjut tentang perusahaan yang meluncurkan Milvus, kunjungi <a href="https://zilliz.com/">Zilliz.com</a>.</li>
</ul>
