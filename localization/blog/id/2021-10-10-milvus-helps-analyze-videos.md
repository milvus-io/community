---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: Deteksi objek
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: Pelajari bagaimana Milvus mendukung analisis AI konten video.
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>Membangun Sistem Analisis Video dengan Basis Data Vektor Milvus</custom-h1><p><em>Shiyu Chen, seorang insinyur data di Zilliz, lulus dari Universitas Xidian dengan gelar di bidang Ilmu Komputer. Sejak bergabung dengan Zilliz, dia telah mengeksplorasi solusi untuk Milvus di berbagai bidang, seperti analisis audio dan video, pencarian rumus molekul, dll., yang telah sangat memperkaya skenario aplikasi komunitas. Saat ini ia sedang mengeksplorasi solusi yang lebih menarik. Di waktu luangnya, dia menyukai olahraga dan membaca.</em></p>
<p>Ketika saya menonton film <em>Free Guy</em> akhir pekan lalu, saya merasa pernah melihat aktor yang memerankan Buddy, sang satpam, di suatu tempat sebelumnya, tetapi tidak dapat mengingat karya-karyanya. Kepala saya dipenuhi dengan pertanyaan, "siapa orang ini?" Saya yakin pernah melihat wajahnya dan berusaha keras untuk mengingat namanya. Kasus serupa adalah ketika saya melihat aktor utama dalam sebuah video sedang menikmati minuman yang sangat saya sukai, namun akhirnya saya gagal mengingat nama mereknya.</p>
<p>Jawabannya ada di ujung lidah saya, tetapi otak saya terasa buntu.</p>
<p>Fenomena ujung lidah (TOT) membuat saya gila ketika menonton film. Seandainya saja ada mesin pencari gambar terbalik untuk video yang memungkinkan saya menemukan video dan menganalisis konten video. Sebelumnya, saya membuat <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">mesin pencari gambar terbalik dengan menggunakan Milvus</a>. Mengingat analisis konten video mirip dengan analisis gambar, saya memutuskan untuk membangun mesin analisis konten video berdasarkan Milvus.</p>
<h2 id="Object-detection" class="common-anchor-header">Deteksi objek<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">Gambaran umum</h3><p>Sebelum dianalisis, objek dalam video harus dideteksi terlebih dahulu. Mendeteksi objek dalam video secara efektif dan akurat adalah tantangan utama dari tugas ini. Ini juga merupakan tugas penting untuk aplikasi seperti autopilot, perangkat yang dapat dikenakan, dan IoT.</p>
<p>Dikembangkan dari algoritme pemrosesan gambar tradisional ke jaringan saraf dalam (deep neural network/DNN), model utama saat ini untuk deteksi objek meliputi R-CNN, FRCNN, SSD, dan YOLO. Sistem analisis video pembelajaran mendalam berbasis Milvus yang diperkenalkan dalam topik ini dapat mendeteksi objek secara cerdas dan cepat.</p>
<h3 id="Implementation" class="common-anchor-header">Implementasi</h3><p>Untuk mendeteksi dan mengenali objek dalam video, pertama-tama sistem harus mengekstrak frame dari video dan mendeteksi objek dalam gambar frame menggunakan deteksi objek, kedua, mengekstrak vektor fitur dari objek yang terdeteksi, dan terakhir, menganalisis objek berdasarkan vektor fitur.</p>
<ul>
<li>Ekstraksi bingkai</li>
</ul>
<p>Analisis video diubah menjadi analisis gambar menggunakan ekstraksi frame. Saat ini, teknologi ekstraksi frame sudah sangat matang. Program seperti FFmpeg dan OpenCV mendukung ekstraksi frame pada interval tertentu. Artikel ini memperkenalkan cara mengekstrak frame dari video setiap detik menggunakan OpenCV.</p>
<ul>
<li>Deteksi objek</li>
</ul>
<p>Deteksi objek adalah tentang menemukan objek dalam frame yang diekstrak dan mengekstrak tangkapan layar objek sesuai dengan posisinya. Seperti yang ditunjukkan pada gambar berikut, sepeda, anjing, dan mobil terdeteksi. Topik ini memperkenalkan cara mendeteksi objek menggunakan YOLOv3, yang umumnya digunakan untuk deteksi objek.</p>
<ul>
<li>Ekstraksi fitur</li>
</ul>
<p>Ekstraksi fitur mengacu pada pengubahan data yang tidak terstruktur, yang sulit dikenali oleh mesin, menjadi vektor fitur. Sebagai contoh, gambar dapat dikonversi menjadi vektor fitur multi-dimensi menggunakan model pembelajaran mendalam. Saat ini, model AI pengenalan gambar yang paling populer termasuk VGG, GNN, dan ResNet. Topik ini memperkenalkan cara mengekstrak fitur dari objek yang terdeteksi menggunakan ResNet-50.</p>
<ul>
<li>Analisis vektor</li>
</ul>
<p>Vektor fitur yang diekstrak dibandingkan dengan vektor pustaka, dan informasi yang sesuai dengan vektor yang paling mirip dikembalikan. Untuk set data vektor fitur berskala besar, perhitungan merupakan tantangan besar. Topik ini memperkenalkan cara menganalisis vektor fitur menggunakan Milvus.</p>
<h2 id="Key-technologies" class="common-anchor-header">Teknologi utama<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>Open Source Computer Vision Library (OpenCV) adalah perpustakaan visi komputer lintas platform, yang menyediakan banyak algoritme universal untuk pemrosesan gambar dan visi komputer. OpenCV umumnya digunakan dalam bidang visi komputer.</p>
<p>Contoh berikut ini menunjukkan cara mengambil frame video pada interval tertentu dan menyimpannya sebagai gambar menggunakan OpenCV dengan Python.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3 (YOLOv3 [5]) adalah algoritma pendeteksian objek satu tahap yang diusulkan dalam beberapa tahun terakhir. Dibandingkan dengan algoritma pendeteksian objek tradisional dengan akurasi yang sama, YOLOv3 dua kali lebih cepat. YOLOv3 yang disebutkan dalam topik ini adalah versi yang disempurnakan dari PaddlePaddle [6]. YOLOv3 menggunakan beberapa metode optimasi dengan kecepatan inferensi yang lebih tinggi.</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet [7] adalah pemenang ILSVRC 2015 dalam klasifikasi gambar karena kesederhanaan dan kepraktisannya. Sebagai dasar dari banyak metode analisis gambar, ResNet terbukti menjadi model yang populer yang berspesialisasi dalam deteksi, segmentasi, dan pengenalan gambar.</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvus</a> adalah basis data vektor open-source yang berasal dari cloud yang dibangun untuk mengelola vektor penyisipan yang dihasilkan oleh model pembelajaran mesin dan jaringan saraf. Milvus banyak digunakan dalam skenario seperti visi komputer, pemrosesan bahasa alami, kimia komputasi, sistem pemberi rekomendasi yang dipersonalisasi, dan banyak lagi.</p>
<p>Prosedur berikut ini menjelaskan cara kerja Milvus.</p>
<ol>
<li>Data yang tidak terstruktur diubah menjadi vektor fitur dengan menggunakan model pembelajaran mendalam dan diimpor ke Milvus.</li>
<li>Milvus menyimpan dan mengindeks vektor fitur.</li>
<li>Milvus mengembalikan vektor yang paling mirip dengan vektor yang ditanyakan oleh pengguna.</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">Penerapan<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Sekarang Anda telah memiliki pemahaman tentang sistem analisis video berbasis Milvus. Sistem ini pada dasarnya terdiri dari dua bagian, seperti yang ditunjukkan pada gambar berikut.</p>
<ul>
<li><p>Panah merah menunjukkan proses impor data. Gunakan ResNet-50 untuk mengekstrak vektor fitur dari kumpulan data gambar dan mengimpor vektor fitur ke Milvus.</p></li>
<li><p>Panah hitam menunjukkan proses analisis video. Pertama, mengekstrak frame dari video dan menyimpan frame sebagai gambar. Kedua, mendeteksi dan mengekstrak objek dalam gambar menggunakan YOLOv3. Kemudian, gunakan ResNet-50 untuk mengekstrak vektor fitur dari gambar. Terakhir, Milvus mencari dan mengembalikan informasi objek dengan vektor fitur yang sesuai.</p></li>
</ul>
<p>Untuk informasi lebih lanjut, lihat <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcamp: Sistem Deteksi Objek Video</a>.</p>
<p><strong>Impor data</strong></p>
<p>Proses impor data sangat sederhana. Ubah data menjadi vektor 2.048 dimensi dan impor vektor tersebut ke dalam Milvus.</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Analisis video</strong></p>
<p>Seperti yang telah dijelaskan di atas, proses analisis video meliputi menangkap frame video, mendeteksi objek di setiap frame, mengekstrak vektor dari objek, menghitung kesamaan vektor dengan metrik jarak Euclidean (L2), dan mencari hasil menggunakan Milvus.</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Saat ini, lebih dari 80% data tidak terstruktur. Dengan perkembangan AI yang pesat, semakin banyak model deep learning yang dikembangkan untuk menganalisis data yang tidak terstruktur. Teknologi seperti deteksi objek dan pemrosesan gambar telah mencapai terobosan besar di dunia akademis dan industri. Dengan diberdayakan oleh teknologi ini, semakin banyak platform AI yang memenuhi persyaratan praktis.</p>
<p>Sistem analisis video yang dibahas dalam topik ini dibangun dengan Milvus, yang dapat dengan cepat menganalisis konten video.</p>
<p>Sebagai basis data vektor sumber terbuka, Milvus mendukung vektor fitur yang diekstraksi menggunakan berbagai model pembelajaran mendalam. Terintegrasi dengan pustaka seperti Faiss, NMSLIB, dan Annoy, Milvus menyediakan seperangkat API yang intuitif, yang mendukung pergantian jenis indeks sesuai dengan skenario. Selain itu, Milvus mendukung pemfilteran skalar, yang meningkatkan tingkat recall dan fleksibilitas pencarian. Milvus telah diaplikasikan pada berbagai bidang seperti pemrosesan gambar, visi komputer, pemrosesan bahasa alami, pengenalan suara, sistem pemberi rekomendasi, dan penemuan obat baru.</p>
<h2 id="References" class="common-anchor-header">Referensi<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo. "Pencocokan dan pengambilan merek dagang dalam basis data video olahraga." Prosiding lokakarya internasional Workshop on multimedia information retrieval, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases</p>
<p>[2] J. Kleban, X. Xie, W.-Y. Ma. "Penambangan piramida spasial untuk deteksi logo pada pemandangan alam." IEEE International Conference, 2008. https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia, C. Florea, L. Florea, R. Dogaru. "Pelokalan dan pengenalan logo pada gambar alami menggunakan graf kelas homograf." Machine Vision and Applications 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia, C. Florea, L. Florea. "Aglomerasi asift elips pada prototipe kelas untuk deteksi logo." BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
