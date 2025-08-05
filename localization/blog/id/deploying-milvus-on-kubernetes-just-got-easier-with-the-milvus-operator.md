---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: Menerapkan Milvus di Kubernetes Menjadi Lebih Mudah dengan Operator Milvus
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  Milvus Operator adalah alat manajemen asli Kubernetes yang mengotomatiskan
  siklus hidup lengkap penerapan basis data vektor Milvus.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_Just_Got_Easier_with_the_Milvus_Operator_1f6f48e55c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus Operator, Kubernetes, How to deploy Milvus on Kubernetes'
meta_title: |
  Deploy Milvus on K8s Just Got Easier with the Milvus Operator 
origin: >-
  https://milvus.io/blog/deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
---
<p>Menyiapkan cluster Milvus yang siap produksi seharusnya tidak terasa seperti menjinakkan bom. Namun, siapa pun yang pernah mengonfigurasi penerapan Kubernetes secara manual untuk basis data vektor pasti tahu masalahnya: lusinan berkas YAML, manajemen ketergantungan yang rumit, dan perasaan yang tidak menentu saat ada yang rusak pada pukul 2 dini hari dan Anda tidak tahu pasti yang mana di antara 47 berkas konfigurasi itu yang menjadi biang keladinya.</p>
<p>Pendekatan tradisional untuk menerapkan Milvus melibatkan pengaturan beberapa layanan - etcd untuk penyimpanan metadata, Pulsar untuk antrian pesan, MinIO untuk penyimpanan objek, dan berbagai komponen Milvus itu sendiri. Setiap layanan membutuhkan konfigurasi yang cermat, urutan startup yang tepat, dan pemeliharaan yang berkelanjutan. Skala ini di berbagai lingkungan atau cluster, dan kompleksitas operasional menjadi luar biasa.</p>
<p>Di sinilah <a href="https://github.com/zilliztech/milvus-operator"><strong>Milvus Operator</strong></a> secara fundamental mengubah permainan. Alih-alih mengelola infrastruktur secara manual, Anda mendeskripsikan apa yang Anda inginkan, dan Operator menangani caranya.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">Apa yang dimaksud dengan Milvus Operator?<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Milvus Operator</strong></a> adalah alat manajemen asli Kubernetes yang mengotomatiskan siklus hidup lengkap penerapan basis data vektor Milvus. Dibangun di atas pola Operator Kubernetes, alat ini merangkum pengetahuan operasional selama bertahun-tahun tentang menjalankan Milvus dalam produksi dan mengkodekan keahlian tersebut ke dalam perangkat lunak yang berjalan bersama cluster Anda.</p>
<p>Bayangkan saja Anda memiliki administrator Milvus ahli yang tidak pernah tidur, tidak pernah melakukan kesalahan ketik, dan memiliki ingatan yang sempurna untuk setiap detail konfigurasi. Operator terus memantau kesehatan cluster Anda, secara otomatis menangani keputusan penskalaan, mengelola peningkatan tanpa waktu henti, dan pulih dari kegagalan lebih cepat daripada yang dapat dilakukan oleh operator manusia.</p>
<p>Pada intinya, Operator menyediakan empat kemampuan penting.</p>
<ul>
<li><p><strong>Penerapan Otomatis</strong>: Menyiapkan cluster Milvus yang berfungsi penuh dengan satu manifes.</p></li>
<li><p><strong>Manajemen Siklus Hidup</strong>: Mengotomatiskan peningkatan, penskalaan horizontal, dan pembongkaran sumber daya dalam urutan yang ditentukan dan aman.</p></li>
<li><p><strong>Pemantauan dan Pemeriksaan Kesehatan Bawaan</strong>: Pantau status komponen Milvus dan ketergantungan terkaitnya secara terus-menerus, termasuk etcd, Pulsar, dan MinIO.</p></li>
<li><p><strong>Praktik Terbaik Operasional Secara Default</strong>: Menerapkan pola asli Kubernetes yang memastikan keandalan tanpa memerlukan pengetahuan platform yang mendalam.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Memahami Pola Operator Kubernetes</h3><p>Sebelum kita menjelajahi keunggulan Operator Milvus, mari kita pahami terlebih dahulu fondasi yang dibangun di atasnya: <strong>pola Operator Kubernetes</strong>.</p>
<p>Pola Operator Kubernetes membantu mengelola aplikasi kompleks yang membutuhkan lebih dari sekadar fitur dasar Kubernetes. Operator memiliki tiga bagian utama:</p>
<ul>
<li><p><strong>Definisi Sumber Daya Khusus</strong> memungkinkan Anda mendeskripsikan aplikasi Anda menggunakan berkas konfigurasi gaya Kubernetes.</p></li>
<li><p><strong>Controller</strong> mengawasi konfigurasi ini dan membuat perubahan yang diperlukan pada cluster Anda.</p></li>
<li><p><strong>Manajemen Status</strong> memastikan cluster Anda sesuai dengan apa yang Anda minta dan memperbaiki setiap perbedaan.</p></li>
</ul>
<p>Ini berarti Anda dapat mendeskripsikan penerapan Milvus Anda dengan cara yang sudah dikenal, dan Operator menangani semua pekerjaan mendetail dalam membuat pod, menyiapkan jaringan, dan mengelola siklus hidup...</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">Bagaimana Operator Milvus Bekerja<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator mengikuti proses yang sangat mudah yang membuat manajemen basis data menjadi lebih sederhana. Mari kita uraikan model operasional inti dari Milvus Operator:</p>
<ol>
<li><p><strong>Sumber Daya Khusus (CR):</strong> Pengguna mendefinisikan penerapan Milvus menggunakan CR (misalnya: <code translate="no">Milvus</code>). File ini mencakup konfigurasi seperti mode cluster, versi image, kebutuhan sumber daya, dan ketergantungan.</p></li>
<li><p><strong>Logika Pengontrol:</strong> Pengontrol Operator mengamati CR baru atau yang diperbarui. Setelah mendeteksi adanya perubahan, ia akan mengatur pembuatan komponen yang diperlukan - layanan Milvus dan ketergantungan seperti etcd, Pulsar, dan MinIO.</p></li>
<li><p><strong>Manajemen Siklus Hidup Otomatis:</strong> Ketika terjadi perubahan-seperti memperbarui versi atau memodifikasi penyimpanan-Operator melakukan pembaruan bergilir atau mengkonfigurasi ulang komponen tanpa mengganggu cluster.</p></li>
<li><p><strong>Penyembuhan Diri:</strong> Pengontrol secara terus menerus memeriksa kesehatan setiap komponen. Jika ada yang rusak, maka secara otomatis akan mengganti pod atau memulihkan status layanan untuk memastikan waktu kerja.</p></li>
</ol>
<p>Pendekatan ini jauh lebih kuat daripada penerapan YAML atau Helm tradisional karena menyediakan manajemen yang berkelanjutan, bukan hanya penyiapan awal.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">Mengapa Menggunakan Operator Milvus daripada Helm atau YAML?<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika menerapkan Milvus, Anda dapat memilih antara file YAML manual, bagan Helm, atau Operator Milvus. Masing-masing memiliki tempatnya sendiri, tetapi Operator menawarkan keuntungan yang signifikan untuk operasi yang sedang berjalan.</p>
<h3 id="Operation-Automation" class="common-anchor-header">Otomatisasi Operasi</h3><p>Metode tradisional memerlukan pekerjaan manual untuk tugas-tugas rutin. Penskalaan berarti memperbarui beberapa file konfigurasi dan mengoordinasikan perubahan. Peningkatan membutuhkan perencanaan yang cermat untuk menghindari gangguan layanan. Operator menangani tugas-tugas ini secara otomatis. Ini dapat mendeteksi kapan penskalaan diperlukan dan melakukan perubahan dengan aman. Peningkatan menjadi pembaruan konfigurasi sederhana yang dijalankan oleh Operator dengan pengurutan yang tepat dan kemampuan rollback jika diperlukan.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">Visibilitas Status yang Lebih Baik</h3><p>File YAML memberi tahu Kubernetes apa yang Anda inginkan, tetapi file tersebut tidak menunjukkan kesehatan sistem Anda saat ini. Helm membantu dengan manajemen konfigurasi tetapi tidak memantau status runtime aplikasi Anda. Operator terus menerus mengawasi seluruh cluster Anda. Ini dapat mendeteksi masalah seperti masalah sumber daya atau respons yang lambat dan mengambil tindakan sebelum menjadi masalah serius. Pemantauan proaktif ini secara signifikan meningkatkan keandalan.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">Manajemen Jangka Panjang yang Lebih Mudah</h3><p>Mengelola banyak lingkungan dengan file YAML berarti menjaga banyak file konfigurasi tetap tersinkronisasi. Bahkan dengan templat Helm, operasi yang kompleks masih memerlukan koordinasi manual yang signifikan.</p>
<p>Operator merangkum pengetahuan manajemen Milvus dalam kodenya. Ini berarti tim dapat mengelola cluster secara efektif tanpa harus menjadi ahli dalam setiap komponen. Antarmuka operasional tetap konsisten seiring dengan meningkatnya skala infrastruktur Anda.</p>
<p>Menggunakan Operator berarti memilih pendekatan yang lebih otomatis untuk manajemen Milvus. Ini mengurangi pekerjaan manual sekaligus meningkatkan keandalan melalui keahlian yang ada di dalamnya - manfaat yang sangat berharga karena database vektor menjadi lebih penting untuk aplikasi.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">Arsitektur Operasi Milvus</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Diagram ini dengan jelas menggambarkan struktur penyebaran Operator Milvus dalam cluster Kubernetes:</p>
<ul>
<li><p>Kiri (Area Biru): Komponen inti dari Operator, termasuk Controller dan Milvus-CRD.</p></li>
<li><p>Kanan (Area Hijau): Berbagai komponen klaster Milvus, seperti Proksi, Koordinator, dan Node.</p></li>
<li><p>Tengah (Panah - "membuat/mengelola"): Alur operasi yang menunjukkan bagaimana Operator mengelola cluster Milvus.</p></li>
<li><p>Bawah (Area Oranye): Layanan yang bergantung seperti etcd dan MinIO/S3/MQ.</p></li>
</ul>
<p>Struktur visual ini, dengan blok-blok berwarna yang berbeda dan panah-panah arah, secara efektif memperjelas interaksi dan aliran data di antara komponen-komponen yang berbeda.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">Memulai dengan Operator Milvus<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Panduan ini menunjukkan kepada Anda cara menggunakan Milvus menggunakan Operator. Kita akan menggunakan versi berikut dalam panduan ini.</p>
<ul>
<li><p><strong>Sistem Operasi</strong>: openEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) Prasyarat</h3><p>Klaster Kubernetes Anda memerlukan setidaknya satu StorageClass yang dikonfigurasi. Anda dapat memeriksa apa saja yang tersedia:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>Dalam contoh kita, kita memiliki dua opsi:</p>
<ul>
<li><p><code translate="no">local</code> (default) - menggunakan disk lokal</p></li>
<li><p><code translate="no">nfs-sc</code>- menggunakan penyimpanan NFS (baik untuk pengujian, tetapi hindari dalam produksi)</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Menginstalasi Milvus Operator</h3><p>Anda dapat menginstal Operator dengan <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a> atau <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl</a>. Kita akan menggunakan kubectl karena lebih sederhana.</p>
<p>Unduh manifes penyebaran Operator:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ganti alamat gambar (opsional):</p>
<p><strong>Opsional: Gunakan registri citra yang berbeda</strong> jika Anda tidak dapat mengakses DockerHub atau lebih memilih registri Anda sendiri:</p>
<p><em>Catatan: Alamat repositori citra yang disediakan di sini adalah untuk tujuan pengujian. Gantilah dengan alamat repositori Anda yang sebenarnya sesuai kebutuhan.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Instal Milvus Operator:</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Setelah instalasi, Anda akan melihat keluaran yang mirip dengan:</p>
<pre><code translate="no">namespace/milvus-operator created
serviceaccount/milvus-operator created
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvuses.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvusupgrades.milvus.io created
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding created
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role created
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding created
service/milvus-operator-metrics-service created
service/milvus-operator-webhook-service created
deployment.apps/milvus-operator created
<button class="copy-code-btn"></button></code></pre>
<p>Verifikasi penyebaran Milvus Operator dan sumber daya pod:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Menyebarkan Cluster Milvus</h3><p>Setelah pod Milvus Operator berjalan, Anda dapat men-deploy cluster Milvus dengan langkah-langkah berikut.</p>
<p>Unduh manifes penerapan klaster Milvus:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Konfigurasi default minimal:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster in milvus-operator&#x27;s default configurations.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Untuk penerapan yang sesungguhnya, Anda perlu menyesuaikannya:</strong></p>
<ul>
<li><p>Nama Klaster Kustom: <code translate="no">milvus-release-v25</code></p></li>
<li><p>Gambar Kustom: (untuk menggunakan gambar online yang berbeda atau gambar offline lokal) <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>Nama Kelas Penyimpanan Khusus: Dalam lingkungan dengan beberapa kelas penyimpanan, Anda mungkin perlu menentukan StorageClass untuk komponen persisten seperti MinIO dan etcd. Dalam contoh ini, <code translate="no">nfs-sc</code> digunakan.</p></li>
<li><p>Sumber Daya Khusus: Mengatur batas CPU dan memori untuk komponen Milvus. Secara default, tidak ada batasan yang ditetapkan, yang dapat membebani node Kubernetes Anda.</p></li>
<li><p>Penghapusan Otomatis Sumber Daya Terkait: Secara default, saat kluster Milvus dihapus, sumber daya terkait akan dipertahankan.</p></li>
</ul>
<p>Untuk konfigurasi parameter tambahan, lihat:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Definisi Sumber Daya Khusus Milvus</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">Nilai Pulsar</a></p></li>
</ul>
<p>Manifes yang dimodifikasi adalah:</p>
<pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: milvus-release-v25
  labels:
    app: milvus
spec:
  mode: cluster
  config: {}
  components:
    image: registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
    resources:
      limits:
        cpu: 2
        memory: 8Gi
  dependencies:
    etcd:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          global:
            imageRegistry: registry.milvus-mirror.cn
            storageClass: nfs-sc
    storage:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          resources:
            limits:
              cpu: 2
              memory: 8Gi
          image:
            repository: registry.milvus-mirror.cn/milvusdb/minio
            tag: RELEASE.2023-03-20T20-16-18Z
          persistence:
            storageClass: nfs-sc
            accessMode: ReadWriteOnce
            size: 10Gi
    pulsar:
      inCluster:
        chartVersion: pulsar-v3
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          existingStorageClassName: nfs-sc
          pulsar_metadata:
            image:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
          zookeeper:
            replicaCount: 3
            volumes:
              data:
                size: 5Gi
                storageClassName: nfs-sc
          bookkeeper:
            volumes:
              journal:
                size: 5Gi
                storageClassName: nfs-sc
              ledgers:
                size: 5Gi
                storageClassName: nfs-sc
          images:
            zookeeper:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            proxy:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            broker:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            bookie:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            autorecovery:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
<button class="copy-code-btn"></button></code></pre>
<p>Menyebarkan cluster Milvus:</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Memverifikasi Status Cluster Milvus</h4><p>Operator Milvus pertama-tama menyiapkan dependensi middleware untuk Milvus-seperti etcd, Zookeeper, Pulsar, dan MinIO-sebelum men-deploy komponen Milvus (mis., proxy, koordinator, dan node).</p>
<p>Lihat Penyebaran:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE
milvus-release-v25-milvus-datanode      1/1     1            1           52m
milvus-release-v25-milvus-indexnode     1/1     1            1           52m
milvus-release-v25-milvus-mixcoord      1/1     1            1           52m
milvus-release-v25-milvus-proxy         1/1     1            1           52m
milvus-release-v25-milvus-querynode-0   1/1     1            1           52m
milvus-release-v25-milvus-querynode-1   0/0     0            0           52m
milvus-release-v25-milvus-standalone    0/0     0            0           52m
<button class="copy-code-btn"></button></code></pre>
<p>Catatan Khusus:</p>
<p>Anda mungkin memperhatikan bahwa Operator Milvus membuat deployment <code translate="no">standalone</code> dan <code translate="no">querynode-1</code> dengan 0 replika.</p>
<p>Ini memang disengaja. Kami telah mengirimkan masalah ini ke repositori Milvus Operator, dan tanggapan resminya adalah:</p>
<ul>
<li><p>a. Deployment bekerja seperti yang diharapkan. Versi mandiri tetap dipertahankan untuk memungkinkan transisi yang mulus dari cluster ke penerapan mandiri tanpa gangguan layanan.</p></li>
<li><p>b. Memiliki <code translate="no">querynode-0</code> dan <code translate="no">querynode-1</code> berguna selama peningkatan bergulir. Pada akhirnya, hanya satu yang akan aktif.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">Memverifikasi Bahwa Semua Pod Berjalan dengan Benar</h4><p>Setelah cluster Milvus Anda siap, verifikasi bahwa semua pod berjalan seperti yang diharapkan:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                                    READY   STATUS      RESTARTS        AGE
milvus-release-v25-etcd<span class="hljs-number">-0</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-1</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-2</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-milvus-datanode<span class="hljs-number">-65b</span>ff7b4d9<span class="hljs-number">-9</span>h2xv     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-indexnode<span class="hljs-number">-5b</span>5cbb4cdc-cxvwj    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-mixcoord<span class="hljs-number">-64488898b</span>5-r76rw     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-proxy<span class="hljs-number">-5</span>c7fbcb69-cqmq4         <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-querynode<span class="hljs-number">-0</span>-bc6f57d64-k2wnt   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-minio<span class="hljs-number">-0</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-1</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-2</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-3</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-2</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie-<span class="hljs-keyword">init</span><span class="hljs-number">-5</span>zf2z             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-pulsar-<span class="hljs-keyword">init</span>-twznd             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-recovery<span class="hljs-number">-0</span>                    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">1</span> (<span class="hljs-number">6</span>m25s ago)   <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">Memverifikasi StorageClass</h4><p>Pastikan StorageClass kustom Anda (<code translate="no">nfs-sc</code>) dan kapasitas penyimpanan yang ditentukan telah diterapkan dengan benar:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pvc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-variable constant_">NAME</span>                                                                             <span class="hljs-variable constant_">STATUS</span>   <span class="hljs-variable constant_">VOLUME</span>                                     <span class="hljs-variable constant_">CAPACITY</span>   <span class="hljs-variable constant_">ACCESS</span> <span class="hljs-variable constant_">MODES</span>   <span class="hljs-variable constant_">STORAGECLASS</span>   <span class="hljs-variable constant_">AGE</span>
data-milvus-release-v25-etcd-<span class="hljs-number">0</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-3273f9ec-819f-<span class="hljs-number">4e84</span>-bdbe-3cd9df697a5f   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">1</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-01743e13-a989-4aea-8fd0-632ea8b13f98   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">2</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-594f1a63-efba-<span class="hljs-number">4993</span>-<span class="hljs-number">89e6</span>-3ee5e333073d   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">0</span>                                                <span class="hljs-title class_">Bound</span>    pvc-477d4e3b-69d7-4bbe-80f7-b747dc4c79f7   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">1</span>                                                <span class="hljs-title class_">Bound</span>    pvc-b12e46fa-8d29-48fb-9ac1-98f80d67b543   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">2</span>                                                <span class="hljs-title class_">Bound</span>    pvc-2e67893e-<span class="hljs-number">9611</span>-43dd-<span class="hljs-number">9550</span>-b3a7705699ae   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">3</span>                                                <span class="hljs-title class_">Bound</span>    pvc-572c4565-bc38-<span class="hljs-number">4215</span>-a13c-061d9199fdea   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-183eff99-7a87-406d-9f17-b0fb30c7c0b3   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-ebe32304-7d92-44d1-b6fb-4cbaf3207d25   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-2ead9186-3d44-4faa-9ae7-784be7ecf6d2   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-ff1b632d-0a66-4c13-a3bb-2550f9307614   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">57159e85</span>-bb48-48a9-<span class="hljs-number">9706</span>-7a95af8da157   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-eb235f29-afbd-4a40-9a7d-0340a9686053   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">0</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">40e02974</span>-3b7d-4f42-bfa7-3252b7615a36   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">1</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">75904229</span>-3bbf-458e-b0e3-3982e430621b   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">2</span>   <span class="hljs-title class_">Bound</span>    pvc-2e068b79-75ac-4aa9-<span class="hljs-number">9e90</span>-423ff399bad0   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Memverifikasi Batas Sumber Daya Milvus</h4><p>Sebagai contoh, untuk memverifikasi bahwa batas sumber daya untuk komponen <code translate="no">mixcoord</code> telah diterapkan dengan benar, jalankan:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">Memverifikasi Gambar Khusus</h4><p>Konfirmasikan bahwa citra kustom yang benar telah digunakan:</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) Mengakses Cluster Anda dari Luar</h3><p>Pertanyaan umum adalah: Bagaimana cara mengakses layanan Milvus dari luar klaster Kubernetes Anda?</p>
<p>Secara default, layanan Milvus yang digunakan oleh Operator adalah tipe <code translate="no">ClusterIP</code>, yang berarti hanya dapat diakses di dalam klaster. Untuk mengeksposnya secara eksternal, Anda harus mendefinisikan metode akses eksternal. Panduan ini memilih pendekatan yang paling sederhana: menggunakan NodePort.</p>
<p>Buat dan edit manifes layanan untuk akses eksternal:</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Sertakan konten berikut ini:</p>
<pre><code translate="no">kind: Service
apiVersion: v1
metadata:
  name: milvus-release-v25-external-svc
  namespace: default
  labels:
    app: dmilvus-release-v25-external-svc
spec:
  ports:
    - name: milvus
      protocol: TCP
      port: 19530
      targetPort: 19530
      nodePort: 31530
    - name: milvus-web
      protocol: TCP
      port: 9091
      targetPort: 9091
      nodePort: 31531
  selector:
    app.kubernetes.io/component: proxy
    app.kubernetes.io/instance: milvus-release-v25
    app.kubernetes.io/name: milvus
  clusterIP:
  <span class="hljs-built_in">type</span>: NodePort
<button class="copy-code-btn"></button></code></pre>
<ol>
<li>Menerapkan manifes layanan eksternal:</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Memeriksa status layanan eksternal:</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                       AGE
milvus-release-v25-external-svc       NodePort    <span class="hljs-number">10.233</span><span class="hljs-number">.8</span><span class="hljs-number">.166</span>    &lt;none&gt;        <span class="hljs-number">19530</span>:<span class="hljs-number">31530</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31531</span>/TCP                                43s
milvus-release-v25-etcd               ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.27</span><span class="hljs-number">.134</span>   &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-etcd-headless      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-milvus             ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.55</span><span class="hljs-number">.194</span>   &lt;none&gt;        <span class="hljs-number">19530</span>/TCP,<span class="hljs-number">9091</span>/TCP                                            13m
milvus-release-v25-minio              ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.1</span><span class="hljs-number">.56</span>     &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-minio-svc          ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-pulsar-bookie      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">3181</span>/TCP,<span class="hljs-number">8000</span>/TCP                                             16m
milvus-release-v25-pulsar-broker      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8080</span>/TCP,<span class="hljs-number">6650</span>/TCP                                             16m
milvus-release-v25-pulsar-proxy       ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.30</span><span class="hljs-number">.132</span>   &lt;none&gt;        <span class="hljs-number">80</span>/TCP,<span class="hljs-number">6650</span>/TCP                                               16m
milvus-release-v25-pulsar-recovery    ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP                                                      16m
milvus-release-v25-pulsar-zookeeper   ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP,<span class="hljs-number">2888</span>/TCP,<span class="hljs-number">3888</span>/TCP,<span class="hljs-number">2181</span>/TCP                           16m
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Mengakses Milvus WebUI</li>
</ol>
<p>Milvus menyediakan GUI bawaan - Milvus WebUI - yang meningkatkan kemampuan pengamatan dengan antarmuka yang intuitif. Gunakan untuk memantau metrik untuk komponen Milvus dan ketergantungannya, meninjau informasi rinci tentang basis data dan koleksi, dan memeriksa detail konfigurasi lengkap. Untuk detail tambahan, lihat <a href="https://milvus.io/docs/milvus-webui.md">dokumentasi resmi Milvus WebUI</a>.</p>
<p>Setelah penerapan, buka URL berikut ini pada peramban Anda (ganti <code translate="no">&lt;any_k8s_node_IP&gt;</code> dengan alamat IP node Kubernetes mana pun):</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>Ini akan meluncurkan antarmuka WebUI.</p>
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
    </button></h2><p><strong>Milvus Operator</strong> lebih dari sekadar alat penerapan-ini adalah investasi strategis dalam keunggulan operasional untuk infrastruktur basis data vektor. Dengan mengotomatiskan tugas-tugas rutin dan menanamkan praktik terbaik ke dalam lingkungan Kubernetes Anda, hal ini membebaskan tim untuk fokus pada hal yang paling penting: membangun dan meningkatkan aplikasi berbasis AI.</p>
<p>Mengadopsi manajemen berbasis Operator memang membutuhkan upaya di awal, termasuk perubahan pada alur kerja dan proses tim. Namun, bagi organisasi yang beroperasi dalam skala besar-atau berencana untuk melakukannya-keuntungan jangka panjangnya cukup signifikan: peningkatan keandalan, biaya operasional yang lebih rendah, dan siklus penerapan yang lebih cepat dan lebih konsisten.</p>
<p>Ketika AI menjadi inti dari operasi bisnis modern, kebutuhan akan infrastruktur basis data vektor yang kuat dan dapat diskalakan semakin meningkat. Milvus Operator mendukung evolusi tersebut dengan menawarkan pendekatan yang matang dan mengutamakan otomatisasi yang sesuai dengan beban kerja Anda dan beradaptasi dengan kebutuhan spesifik Anda.</p>
<p>Jika tim Anda menghadapi kompleksitas operasional, mengantisipasi pertumbuhan, atau hanya ingin mengurangi manajemen infrastruktur manual, mengadopsi Milvus Operator lebih awal dapat membantu menghindari utang teknis di masa depan dan meningkatkan ketahanan sistem secara keseluruhan.</p>
<p>Masa depan infrastruktur adalah cerdas, otomatis, dan ramah pengembang. <strong>Milvus Operator menghadirkan masa depan tersebut ke lapisan basis data Anda hari ini.</strong></p>
<hr>
