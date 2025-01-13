---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: >-
  Menerapkan Milvus di Kubernetes: Panduan Langkah-demi-Langkah untuk Pengguna
  Kubernetes
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  Panduan ini akan memberikan panduan langkah demi langkah yang jelas untuk
  menyiapkan Milvus di Kubernetes menggunakan Milvus Operator.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a> adalah <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a> sumber terbuka yang dirancang untuk menyimpan, mengindeks, dan mencari <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data tak terstruktur</a> dalam jumlah besar melalui representasi vektor, sehingga sempurna untuk aplikasi berbasis AI, seperti pencarian kemiripan, <a href="https://zilliz.com/glossary/semantic-search">pencarian semantik</a>, retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), mesin rekomendasi, dan tugas-tugas pembelajaran mesin lainnya.</p>
<p>Namun, yang membuat Milvus lebih hebat lagi adalah integrasinya yang mulus dengan Kubernetes. Jika Anda seorang penggemar Kubernetes, Anda pasti tahu bahwa platform ini sangat cocok untuk mengatur sistem terdistribusi yang dapat diskalakan. Milvus memanfaatkan sepenuhnya kemampuan Kubernetes, memungkinkan Anda untuk dengan mudah menerapkan, menskalakan, dan mengelola cluster Milvus yang terdistribusi. Panduan ini akan memberikan panduan langkah demi langkah yang jelas untuk menyiapkan Milvus di Kubernetes menggunakan Milvus Operator.</p>
<h2 id="Prerequisites" class="common-anchor-header">Prasyarat<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Sebelum memulai, pastikan Anda memiliki prasyarat berikut ini:</p>
<ul>
<li><p>Sebuah kluster Kubernetes yang aktif dan berjalan. Jika Anda menguji secara lokal, <code translate="no">minikube</code> adalah pilihan yang tepat.</p></li>
<li><p><code translate="no">kubectl</code> sudah terinstal dan terkonfigurasi untuk berinteraksi dengan klaster Kubernetes Anda.</p></li>
<li><p>Memahami konsep dasar Kubernetes seperti pod, layanan, dan penerapan.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">Langkah 1: Menginstalasi Minikube (Untuk Pengujian Lokal)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Jika Anda perlu menyiapkan lingkungan Kubernetes lokal, <code translate="no">minikube</code> adalah alat yang tepat untuk Anda. Instruksi instalasi resmi ada di <a href="https://minikube.sigs.k8s.io/docs/start/">halaman memulai minikube</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. Instal Minikube</h3><p>Kunjungi<a href="https://github.com/kubernetes/minikube/releases"> laman rilis minikube</a> dan unduh versi yang sesuai untuk sistem operasi Anda. Untuk macOS/Linux, Anda dapat menggunakan perintah berikut:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. Mulai Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. Berinteraksi dengan Cluster</h3><p>Sekarang, Anda dapat berinteraksi dengan cluster Anda dengan kubectl di dalam minikube. Jika Anda belum menginstal kubectl, minikube akan mengunduh versi yang sesuai secara default.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>Sebagai alternatif, Anda dapat membuat tautan simbolis ke biner minikube bernama <code translate="no">kubectl</code> untuk penggunaan yang lebih mudah.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">Langkah 2: Mengonfigurasi StorageClass<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>Di Kubernetes, <strong>StorageClass</strong> mendefinisikan jenis penyimpanan yang tersedia untuk beban kerja Anda, memberikan fleksibilitas dalam mengelola konfigurasi penyimpanan yang berbeda. Sebelum melanjutkan, Anda harus memastikan StorageClass default tersedia di cluster Anda. Berikut ini cara memeriksa dan mengonfigurasinya jika perlu.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. Memeriksa StorageClass yang Terinstal</h3><p>Untuk melihat StorageClasses yang tersedia di cluster Kubernetes Anda, jalankan perintah berikut:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>Ini akan menampilkan daftar kelas penyimpanan yang terinstal di cluster Anda. Jika StorageClass default telah dikonfigurasi, maka akan ditandai dengan <code translate="no">(default)</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. Mengonfigurasi StorageClass Default (jika perlu)</h3><p>Jika tidak ada StorageClass default yang ditetapkan, Anda dapat membuatnya dengan mendefinisikannya dalam file YAML. Gunakan contoh berikut untuk membuat StorageClass default:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>Konfigurasi YAML ini mendefinisikan <code translate="no">StorageClass</code> yang disebut <code translate="no">default-storageclass</code> yang menggunakan provisioner <code translate="no">minikube-hostpath</code>, yang biasa digunakan dalam lingkungan pengembangan lokal.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. Menerapkan StorageClass</h3><p>Setelah berkas <code translate="no">default-storageclass.yaml</code> dibuat, terapkan ke cluster Anda dengan menggunakan perintah berikut:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ini akan menyiapkan StorageClass default untuk cluster Anda, memastikan bahwa kebutuhan penyimpanan Anda dikelola dengan baik di masa mendatang.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">Langkah 3: Menginstalasi Milvus Menggunakan Operator Milvus<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator menyederhanakan penerapan Milvus di Kubernetes, mengelola penyebaran, penskalaan, dan pembaruan. Sebelum menginstal Milvus Operator, Anda harus menginstal <strong>cert-manager</strong>, yang menyediakan sertifikat untuk server webhook yang digunakan oleh Milvus Operator.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. Instal cert-manager</h3><p>Milvus Operator membutuhkan <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a> untuk mengelola sertifikat untuk komunikasi yang aman. Pastikan Anda menginstal <strong>cert-manager versi 1.1.3</strong> atau yang lebih baru. Untuk menginstalnya, jalankan perintah berikut:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Setelah instalasi, verifikasi bahwa pod cert-manager telah berjalan dengan menjalankannya:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. Menginstal Operator Milvus</h3><p>Setelah cert-manager aktif dan berjalan, Anda dapat menginstal Milvus Operator. Jalankan perintah berikut untuk menerapkannya menggunakan <code translate="no">kubectl</code>:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Anda dapat memeriksa apakah pod Milvus Operator sudah berjalan dengan menggunakan perintah berikut:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Menyebarkan Milvus Cluster</h3><p>Setelah pod Milvus Operator berjalan, Anda dapat men-deploy cluster Milvus dengan operator. Perintah berikut ini akan men-deploy cluster Milvus dengan komponen dan ketergantungannya dalam pod terpisah menggunakan konfigurasi default:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Untuk menyesuaikan pengaturan Milvus, Anda perlu mengganti berkas YAML dengan berkas YAML konfigurasi Anda sendiri. Selain mengedit atau membuat file secara manual, Anda dapat menggunakan Milvus Sizing Tool untuk menyesuaikan konfigurasi dan kemudian mengunduh file YAML yang sesuai.</p>
<p>Untuk menyesuaikan pengaturan Milvus, Anda harus mengganti file YAML default dengan konfigurasi Anda sendiri. Anda dapat mengedit atau membuat file ini secara manual, menyesuaikannya dengan kebutuhan spesifik Anda.</p>
<p>Atau, Anda dapat menggunakan <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> untuk pendekatan yang lebih ramping. Alat ini memungkinkan Anda untuk menyesuaikan berbagai pengaturan, seperti alokasi sumber daya dan opsi penyimpanan, dan kemudian mengunduh file YAML yang sesuai dengan konfigurasi yang Anda inginkan. Hal ini memastikan bahwa penerapan Milvus Anda dioptimalkan untuk kasus penggunaan spesifik Anda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Gambar: Alat ukuran Milvus</p>
<p>Mungkin diperlukan beberapa waktu untuk menyelesaikan penerapan. Anda dapat memeriksa status cluster Milvus Anda melalui perintah:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Setelah cluster Milvus Anda siap, semua pod dalam cluster Milvus seharusnya sudah berjalan atau selesai:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">Langkah 4: Mengakses Cluster Milvus Anda<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah cluster Milvus Anda diterapkan, Anda perlu mengaksesnya dengan meneruskan port lokal ke port layanan Milvus. Ikuti langkah-langkah berikut untuk mendapatkan port layanan dan mengatur penerusan port.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. Dapatkan Port Layanan</strong></h4><p>Pertama, identifikasi port layanan dengan menggunakan perintah berikut. Ganti <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> dengan nama pod proxy Milvus Anda, yang biasanya dimulai dengan <code translate="no">my-release-milvus-proxy-</code>:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Perintah ini akan mengembalikan nomor port yang digunakan oleh layanan Milvus Anda.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. Meneruskan Port</strong></h4><p>Untuk mengakses cluster Milvus Anda secara lokal, teruskan port lokal ke port layanan menggunakan perintah berikut. Ganti <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> dengan port lokal yang ingin Anda gunakan dan <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> dengan port layanan yang diambil pada langkah sebelumnya:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Perintah ini memungkinkan penerusan port untuk mendengarkan semua alamat IP mesin host. Jika Anda hanya membutuhkan layanan untuk mendengarkan di <code translate="no">localhost</code>, Anda dapat menghilangkan opsi <code translate="no">--address 0.0.0.0</code>.</p>
<p>Setelah penerusan porta disiapkan, Anda dapat mengakses klaster Milvus Anda melalui porta lokal yang ditentukan untuk operasi atau integrasi lebih lanjut.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">Langkah 5: Menghubungkan ke Milvus Menggunakan Python SDK<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah cluster Milvus Anda aktif dan berjalan, Anda sekarang dapat berinteraksi dengannya menggunakan SDK Milvus apa pun. Dalam contoh ini, kita akan menggunakan <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus</a>, <strong>SDK Python</strong> Milvus, untuk menyambung ke cluster dan melakukan operasi dasar.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. Instal PyMilvus</h3><p>Untuk berinteraksi dengan Milvus melalui Python, Anda perlu menginstal paket <code translate="no">pymilvus</code>:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Terhubung ke Milvus</h3><p>Berikut ini adalah contoh skrip Python yang menghubungkan ke cluster Milvus Anda dan menunjukkan bagaimana melakukan operasi dasar seperti membuat koleksi.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Connect to the Milvus server</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:&lt;YOUR_LOCAL_PORT&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Create a collection</span>
collection_name = <span class="hljs-string">&quot;example_collection&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name):
   client.drop_collection(collection_name)
client.create_collection(
   collection_name=collection_name,
   dimension=<span class="hljs-number">768</span>,  <span class="hljs-comment"># The vectors we will use in this demo has 768 dimensions</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Explanation" class="common-anchor-header">Penjelasan:</h4><ul>
<li><p>Sambungkan ke Milvus: Skrip ini menyambungkan ke server Milvus yang berjalan di <code translate="no">localhost</code> menggunakan porta lokal yang Anda siapkan di Langkah 4.</p></li>
<li><p>Membuat Koleksi: Skrip ini memeriksa apakah koleksi bernama <code translate="no">example_collection</code> sudah ada, menghapusnya jika sudah ada, dan kemudian membuat koleksi baru dengan vektor-vektor berdimensi 768.</p></li>
</ul>
<p>Skrip ini membuat koneksi ke klaster Milvus dan membuat koleksi, yang berfungsi sebagai titik awal untuk operasi yang lebih kompleks seperti menyisipkan vektor dan melakukan pencarian kemiripan.</p>
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
    </button></h2><p>Menerapkan Milvus dalam pengaturan terdistribusi di Kubernetes membuka kemampuan yang kuat untuk mengelola data vektor berskala besar, memungkinkan skalabilitas tanpa batas dan aplikasi berbasis AI berkinerja tinggi. Dengan mengikuti panduan ini, Anda telah mempelajari cara menyiapkan Milvus menggunakan Milvus Operator, sehingga prosesnya menjadi lebih ramping dan efisien.</p>
<p>Saat Anda terus menjelajahi Milvus, pertimbangkan untuk menskalakan cluster Anda untuk memenuhi permintaan yang terus meningkat atau menerapkannya di platform cloud seperti Amazon EKS, Google Cloud, atau Microsoft Azure. Untuk manajemen dan pemantauan yang lebih baik, alat bantu seperti <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a>, dan <a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> menawarkan dukungan yang berharga untuk menjaga kesehatan dan kinerja penerapan Anda.</p>
<p>Anda sekarang siap untuk memanfaatkan potensi penuh Milvus di Kubernetes-selamat menerapkan! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">Sumber Daya Lebih Lanjut<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Dokumentasi Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs Standalone vs Distributed: Mode Mana yang Tepat untuk Anda? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">Pencarian Vektor Supercharging: Milvus pada GPU dengan NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Apa itu RAG? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Pusat Sumber Daya AI Generatif | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Model AI Berkinerja Terbaik untuk Aplikasi GenAI Anda | Zilliz</a></p></li>
</ul>
