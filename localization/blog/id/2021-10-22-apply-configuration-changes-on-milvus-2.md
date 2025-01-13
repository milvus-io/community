---
id: 2021-10-22-apply-configuration-changes-on-milvus-2.md
title: >-
  Berbagi Teknis:Menerapkan Perubahan Konfigurasi pada Milvus 2.0 menggunakan
  Docker Compose
author: Jingjing
date: 2021-10-22T00:00:00.000Z
desc: Pelajari caranya menerapkan perubahan konfigurasi pada Milvus 2.0
cover: assets.zilliz.com/Modify_configurations_f9162c5670.png
tag: Engineering
---
<custom-h1>Berbagi Teknis: Menerapkan Perubahan Konfigurasi pada Milvus 2.0 menggunakan Docker Compose</custom-h1><p><em>Jingjing Jia, Zilliz Data Engineer, lulus dari Xi'an Jiaotong University dengan gelar di bidang Ilmu Komputer. Setelah bergabung dengan Zilliz, dia terutama bekerja pada pra-pemrosesan data, penerapan model AI, penelitian teknologi terkait Milvus, dan membantu pengguna komunitas untuk mengimplementasikan skenario aplikasi. Ia sangat sabar, suka berkomunikasi dengan rekan-rekan komunitas, dan senang mendengarkan musik dan menonton anime.</em></p>
<p>Sebagai pengguna Milvus yang sering, saya sangat antusias dengan Milvus 2.0 RC yang baru saja dirilis. Menurut perkenalan di situs web resminya, Milvus 2.0 tampaknya mengungguli pendahulunya dengan selisih yang besar. Saya sangat ingin mencobanya sendiri.</p>
<p>Dan saya melakukannya.  Namun, ketika saya benar-benar mendapatkan Milvus 2.0, saya menyadari bahwa saya tidak dapat memodifikasi file konfigurasi di Milvus 2.0 semudah yang saya lakukan dengan Milvus 1.1.1. Saya tidak dapat mengubah berkas konfigurasi di dalam kontainer docker Milvus 2.0 yang dimulai dengan Docker Compose, dan bahkan perubahan paksa pun tidak akan berpengaruh. Belakangan, saya mengetahui bahwa Milvus 2.0 RC tidak dapat mendeteksi perubahan pada berkas konfigurasi setelah instalasi. Dan rilis stabil di masa mendatang akan memperbaiki masalah ini.</p>
<p>Setelah mencoba berbagai pendekatan, saya menemukan cara yang dapat diandalkan untuk menerapkan perubahan pada berkas konfigurasi untuk Milvus 2.0 standalone &amp; cluster, dan inilah caranya.</p>
<p>Perhatikan bahwa semua perubahan pada konfigurasi harus dilakukan sebelum memulai ulang Milvus menggunakan Docker Compose.</p>
<h2 id="Modify-configuration-file-in-Milvus-standalone" class="common-anchor-header">Memodifikasi berkas konfigurasi di Milvus standalone<button data-href="#Modify-configuration-file-in-Milvus-standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertama, Anda perlu <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">mengunduh</a> salinan berkas <strong>milvus.yaml</strong> ke perangkat lokal Anda.</p>
<p>Kemudian Anda dapat mengubah konfigurasi dalam berkas tersebut. Sebagai contoh, Anda dapat mengubah format log sebagai <code translate="no">.json</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_1_ee4a16a3ee.png" alt="1.1.png" class="doc-image" id="1.1.png" />
   </span> <span class="img-wrapper"> <span>1.1.png</span> </span></p>
<p>Setelah berkas <strong>milvus.yaml</strong> dimodifikasi, Anda juga perlu <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">mengunduh</a> dan memodifikasi berkas <strong>docker-compose.yaml</strong> untuk mandiri dengan memetakan jalur lokal ke milvus.yaml ke jalur kontainer docker yang sesuai dengan berkas konfigurasi <code translate="no">/milvus/configs/milvus.yaml</code> di bawah bagian <code translate="no">volumes</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_2_5e7c73708c.png" alt="1.2.png" class="doc-image" id="1.2.png" />
   </span> <span class="img-wrapper"> <span>1.2.png</span> </span></p>
<p>Terakhir, jalankan Milvus mandiri menggunakan <code translate="no">docker-compose up -d</code> dan periksa apakah modifikasi berhasil. Sebagai contoh, jalankan <code translate="no">docker logs</code> untuk memeriksa format log.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3_a0406df3ab.png" alt="1.3.png" class="doc-image" id="1.3.png" />
   </span> <span class="img-wrapper"> <span>1.3.png</span> </span></p>
<h2 id="Modify-configuration-file-in-Milvus-cluster" class="common-anchor-header">Memodifikasi berkas konfigurasi di cluster Milvus<button data-href="#Modify-configuration-file-in-Milvus-cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertama, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">unduh</a> dan modifikasi berkas <strong>milvus.yaml</strong> sesuai dengan kebutuhan Anda.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_4_758b182846.png" alt="1.4.png" class="doc-image" id="1.4.png" />
   </span> <span class="img-wrapper"> <span>1.4.png</span> </span></p>
<p>Kemudian, Anda perlu <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">mengunduh</a> dan memodifikasi berkas cluster <strong>docker-compose.yml</strong> dengan memetakan jalur lokal ke <strong>milvus.yaml</strong> ke jalur yang sesuai dengan berkas konfigurasi di semua komponen, yaitu root coord, data coord, data node, query coord, query node, index coord, index node, dan proxy.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_5_80e15811b8.png" alt="1.5.png" class="doc-image" id="1.5.png" />
   </span> <span class="img-wrapper"> <span>1.5.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6_b2f3e4e47f.png" alt="1.6.png" class="doc-image" id="1.6.png" />
   </span> <span class="img-wrapper"> <span>1.6.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_7_4d1eb5e1e5.png" alt="1.7.png" class="doc-image" id="1.7.png" /></span> <span class="img-wrapper">1 </span>. <span class="img-wrapper">7 <span>.png</span> </span></p>
<p>Terakhir, Anda dapat memulai klaster Milvus menggunakan <code translate="no">docker-compose up -d</code> dan memeriksa apakah modifikasi berhasil.</p>
<h2 id="Change-log-file-path-in-configuration-file" class="common-anchor-header">Mengubah jalur berkas log dalam berkas konfigurasi<button data-href="#Change-log-file-path-in-configuration-file" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertama, <a href="https://github.com/milvus-io/milvus/blob/master/configs/milvus.yaml">unduh</a> berkas <strong>milvus.yaml</strong>, dan ubah bagian <code translate="no">rootPath</code> sebagai direktori tempat Anda ingin menyimpan berkas log dalam kontainer Docker.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_8_e3bdc4843f.png" alt="1.8.png" class="doc-image" id="1.8.png" />
   </span> <span class="img-wrapper"> <span>1.8.png</span> </span></p>
<p>Setelah itu, unduh berkas <strong>docker-compose.yml</strong> yang sesuai untuk Milvus <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/standalone/docker-compose.yml">mandiri</a> atau <a href="https://github.com/milvus-io/milvus/blob/master/deployments/docker/cluster/docker-compose.yml">cluster</a>.</p>
<p>Untuk standalone, Anda perlu memetakan jalur lokal ke <strong>milvus.yaml</strong> ke jalur kontainer Docker yang sesuai ke berkas konfigurasi <code translate="no">/milvus/configs/milvus.yaml</code>, dan memetakan direktori berkas log lokal ke direktori kontainer Docker yang telah Anda buat sebelumnya.</p>
<p>Untuk cluster, Anda perlu memetakan kedua jalur tersebut di setiap komponen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_9_22d8929d92.png" alt="1.9.png" class="doc-image" id="1.9.png" />
   </span> <span class="img-wrapper"> <span>1.9.png</span> </span></p>
<p>Terakhir, jalankan Milvus standalone atau cluster menggunakan <code translate="no">docker-compose up -d</code> dan periksa file log untuk melihat apakah modifikasi berhasil.</p>
