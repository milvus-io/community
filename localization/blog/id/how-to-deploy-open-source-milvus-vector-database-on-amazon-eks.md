---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: Cara Menyebarkan Basis Data Vektor Milvus Sumber Terbuka di Amazon EKS
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Panduan langkah demi langkah dalam menerapkan database vektor Milvus di AWS
  menggunakan layanan terkelola seperti Amazon EKS, S3, MSK, dan ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>Artikel ini awalnya diterbitkan di <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>situs web AWS</em></a> dan diterjemahkan, disunting, dan diposting ulang di sini dengan izin.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">Gambaran Umum Penyematan Vektor dan Basis Data Vektor<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Kemunculan <a href="https://zilliz.com/learn/generative-ai">Generative AI (GenAI</a>), khususnya model bahasa besar<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>), telah secara signifikan meningkatkan minat terhadap <a href="https://zilliz.com/learn/what-is-vector-database">basis data vektor</a>, menjadikannya sebagai komponen penting dalam ekosistem GenAI. Hasilnya, database vektor diadopsi dalam berbagai <a href="https://milvus.io/use-cases">kasus penggunaan yang</a> semakin meningkat.</p>
<p><a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">Laporan IDC</a> memprediksi bahwa pada tahun 2025, lebih dari 80% data bisnis tidak akan terstruktur, yang ada dalam format seperti teks, gambar, audio, dan video. Memahami, memproses, menyimpan, dan melakukan kueri terhadap <a href="https://zilliz.com/learn/introduction-to-unstructured-data">data tak terstruktur</a> dalam jumlah besar ini dalam skala besar menghadirkan tantangan yang signifikan. Praktik umum dalam GenAI dan deep learning adalah mengubah data tak terstruktur menjadi embedding vektor, menyimpan, dan mengindeksnya dalam basis data vektor seperti <a href="https://milvus.io/intro">Milvus</a> atau <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus yang dikelola secara penuh) untuk pencarian kemiripan <a href="https://zilliz.com/learn/vector-similarity-search">vektor</a> atau kemiripan semantik.</p>
<p>Tapi apa sebenarnya yang <a href="https://zilliz.com/glossary/vector-embeddings">dimaksud</a> dengan <a href="https://zilliz.com/glossary/vector-embeddings">penyematan vektor</a>? Sederhananya, vektor adalah representasi numerik dari angka floating-point dalam ruang berdimensi tinggi. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">Jarak antara dua vektor</a> menunjukkan relevansinya: semakin dekat jaraknya, semakin relevan vektor tersebut satu sama lain, dan sebaliknya. Ini berarti bahwa vektor yang mirip berhubungan dengan data asli yang serupa, yang berbeda dengan kata kunci tradisional atau pencarian yang tepat.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>Cara melakukan pencarian kemiripan vektor</span> </span></p>
<p><em>Gambar 1: Cara melakukan pencarian kemiripan vektor</em></p>
<p>Kemampuan untuk menyimpan, mengindeks, dan mencari sematan vektor adalah fungsionalitas inti dari basis data vektor. Saat ini, basis data vektor utama terbagi dalam dua kategori. Kategori pertama memperluas produk database relasional yang sudah ada, seperti Amazon OpenSearch Service dengan plugin <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> dan Amazon RDS untuk <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> dengan ekstensi pgvector. Kategori kedua terdiri dari produk database vektor khusus, termasuk contoh-contoh terkenal seperti Milvus, Zilliz Cloud (Milvus yang dikelola sepenuhnya), <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a>, dan <a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a>.</p>
<p>Teknik penyematan dan basis data vektor memiliki aplikasi yang luas di berbagai <a href="https://zilliz.com/vector-database-use-cases">kasus penggunaan yang digerakkan oleh AI</a>, termasuk pencarian kemiripan gambar, deduplikasi dan analisis video, pemrosesan bahasa alami, sistem rekomendasi, iklan yang ditargetkan, pencarian yang dipersonalisasi, layanan pelanggan yang cerdas, dan deteksi penipuan.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a> adalah salah satu opsi sumber terbuka yang paling populer di antara banyak database vektor. Artikel ini memperkenalkan Milvus dan membahas praktik penerapan Milvus di AWS EKS.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Apa itu Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a> adalah basis data vektor sumber terbuka yang sangat fleksibel, andal, dan sangat cepat, serta berasal dari cloud. Milvus mendukung pencarian kemiripan vektor dan aplikasi AI serta berupaya membuat database vektor dapat diakses oleh setiap organisasi. Milvus dapat menyimpan, mengindeks, dan mengelola lebih dari satu miliar embedding vektor yang dihasilkan oleh jaringan syaraf tiruan dan model pembelajaran mesin (ML) lainnya.</p>
<p>Milvus dirilis di bawah <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">Lisensi Apache 2.0 sumber terbuka</a> pada bulan Oktober 2019. Saat ini Milvus merupakan proyek pascasarjana di bawah <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. Pada saat blog ini ditulis, Milvus telah mencapai lebih dari <a href="https://hub.docker.com/r/milvusdb/milvus">50 juta</a> unduhan <a href="https://hub.docker.com/r/milvusdb/milvus">pull Docker</a> dan digunakan oleh <a href="https://milvus.io/">banyak pelanggan</a>, seperti NVIDIA, AT&amp;T, IBM, eBay, Shopee, dan Walmart.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Fitur Utama Milvus</h3><p>Sebagai basis data vektor cloud-native, Milvus menawarkan fitur-fitur utama berikut ini:</p>
<ul>
<li><p>Performa tinggi dan pencarian milidetik pada kumpulan data vektor berskala miliaran.</p></li>
<li><p>Dukungan multi-bahasa dan rantai alat.</p></li>
<li><p>Skalabilitas horizontal dan keandalan yang tinggi bahkan saat terjadi gangguan.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">Pencarian hibrida</a>, dicapai dengan memasangkan pemfilteran skalar dengan pencarian kemiripan vektor.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Arsitektur Milvus</h3><p>Milvus mengikuti prinsip memisahkan aliran data dan aliran kontrol. Sistem ini terbagi menjadi empat tingkat, seperti yang ditunjukkan dalam diagram:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arsitektur Milvus</span> </span></p>
<p><em>Gambar 2 Arsitektur Milvus</em></p>
<ul>
<li><p><strong>Lapisan akses:</strong> Lapisan akses terdiri dari sekelompok proksi tanpa kewarganegaraan dan berfungsi sebagai lapisan depan sistem dan titik akhir bagi pengguna.</p></li>
<li><p><strong>Layanan koordinator:</strong> Layanan koordinator memberikan tugas kepada node pekerja.</p></li>
<li><p><strong>Node pekerja:</strong> Node pekerja adalah eksekutor bodoh yang mengikuti instruksi dari layanan koordinator dan menjalankan perintah DML/DDL yang dipicu oleh pengguna.</p></li>
<li><p><strong>Penyimpanan:</strong> Penyimpanan bertanggung jawab atas persistensi data. Ini terdiri dari penyimpanan meta, perantara log, dan penyimpanan objek.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Opsi Penerapan Milvus</h3><p>Milvus mendukung tiga mode berjalan: <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, Standalone, dan Terdistribusi</a>.</p>
<ul>
<li><p><strong>Milvus Lite</strong> adalah pustaka Python yang dapat diimpor ke dalam aplikasi lokal. Sebagai versi ringan dari Milvus, ini sangat ideal untuk pembuatan prototipe cepat di Notebook Jupyter atau berjalan di perangkat pintar dengan sumber daya terbatas.</p></li>
<li><p><strong>Milvus Standalone adalah</strong>penerapan server dengan satu mesin. Jika Anda memiliki beban kerja produksi tetapi memilih untuk tidak menggunakan Kubernetes, menjalankan Milvus Standalone di satu mesin dengan memori yang cukup adalah pilihan yang baik.</p></li>
<li><p><strong>Milvus Distributed</strong> dapat digunakan pada cluster Kubernetes. Ini mendukung dataset yang lebih besar, ketersediaan yang lebih tinggi, dan skalabilitas, dan lebih cocok untuk lingkungan produksi.</p></li>
</ul>
<p>Milvus dirancang sejak awal untuk mendukung Kubernetes, dan dapat dengan mudah digunakan di AWS. Kita dapat menggunakan Amazon Elastic Kubernetes Service (Amazon EKS) sebagai Kubernetes terkelola, Amazon S3 sebagai Object Storage, Amazon Managed Streaming untuk Apache Kafka (Amazon MSK) sebagai Message storage, dan Amazon Elastic Load Balancing (Amazon ELB) sebagai Load Balancer untuk membangun klaster database Milvus yang andal dan elastis.</p>
<p>Selanjutnya, kami akan memberikan panduan langkah demi langkah untuk menerapkan cluster Milvus menggunakan EKS dan layanan lainnya.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">Menerapkan Milvus di AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prasyarat</h3><p>Kita akan menggunakan AWS CLI untuk membuat cluster EKS dan menerapkan database Milvus. Prasyarat berikut ini diperlukan:</p>
<ul>
<li><p>Instance PC/Mac atau Amazon EC2 dengan<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> terinstal dan dikonfigurasi dengan izin yang sesuai. Alat AWS CLI terinstal secara default jika Anda menggunakan Amazon Linux 2 atau Amazon Linux 2023.</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Alat-alat EKS terinstal</a>, termasuk Helm, Kubectl, eksctl, dll.</p></li>
<li><p>Sebuah bucket Amazon S3.</p></li>
<li><p>Instance MSK Amazon.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">Pertimbangan saat membuat MSK</h3><ul>
<li>Versi stabil terbaru dari Milvus (v2.3.13) bergantung pada fitur <code translate="no">autoCreateTopics</code> milik Kafka. Jadi, ketika membuat MSK, kita perlu menggunakan konfigurasi khusus dan mengubah properti <code translate="no">auto.create.topics.enable</code> dari default <code translate="no">false</code> menjadi <code translate="no">true</code>. Selain itu, untuk meningkatkan throughput pesan dari MSK, disarankan agar nilai <code translate="no">message.max.bytes</code> dan <code translate="no">replica.fetch.max.bytes</code> ditingkatkan. Lihat <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">Konfigurasi MSK khusus</a> untuk detailnya.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus tidak mendukung autentikasi berbasis peran IAM MSK. Jadi, saat membuat MSK, aktifkan opsi <code translate="no">SASL/SCRAM authentication</code> di konfigurasi keamanan, dan konfigurasikan <code translate="no">username</code> dan <code translate="no">password</code> di AWS Secrets Manager. Lihat <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">Otentikasi kredensial masuk dengan AWS Secrets Manager</a> untuk detailnya.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>Gambar 3 Pengaturan keamanan mengaktifkan autentikasi SASL SCRAM.png</span> </span></p>
<p><em>Gambar 3: Pengaturan keamanan: aktifkan autentikasi SASL/SCRAM</em></p>
<ul>
<li>Kita perlu mengaktifkan akses ke grup keamanan MSK dari grup keamanan atau rentang alamat IP cluster EKS.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">Membuat sebuah klaster EKS</h3><p>Ada banyak cara untuk membuat cluster EKS, seperti melalui konsol, CloudFormation, eksctl, dll. Tulisan ini akan menunjukkan cara membuat cluster EKS menggunakan eksctl.</p>
<p><code translate="no">eksctl</code> adalah alat bantu baris perintah sederhana untuk membuat dan mengelola klaster Kubernetes di Amazon EKS. Alat ini menyediakan cara tercepat dan termudah untuk membuat klaster baru dengan node untuk Amazon EKS. Lihat <a href="https://eksctl.io/">situs web</a> eksctl untuk informasi lebih lanjut.</p>
<ol>
<li>Pertama, buat berkas <code translate="no">eks_cluster.yaml</code> dengan cuplikan kode berikut. Ganti <code translate="no">cluster-name</code> dengan nama cluster Anda, ganti <code translate="no">region-code</code> dengan wilayah AWS tempat Anda ingin membuat cluster dan ganti <code translate="no">private-subnet-idx</code> dengan subnet privat Anda. Catatan: File konfigurasi ini membuat cluster EKS di VPC yang sudah ada dengan menentukan subnet privat. Jika Anda ingin membuat VPC baru, hapus konfigurasi VPC dan subnet, lalu <code translate="no">eksctl</code> akan secara otomatis membuat VPC baru.</li>
</ol>
<pre><code translate="no">apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
 name: &lt;cluster-name&gt;
 region: &lt;region-code&gt;
 version: <span class="hljs-string">&quot;1.26&quot;</span>

iam:
 withOIDC: true

 serviceAccounts:
 - metadata:
     name: aws-load-balancer-controller
     namespace: kube-system
   wellKnownPolicies:
     awsLoadBalancerController: true
 - metadata:
     name: milvus-s3-access-sa
     <span class="hljs-comment"># if no namespace is set, &quot;default&quot; will be used;</span>
     <span class="hljs-comment"># the namespace will be created if it doesn&#x27;t exist already</span>
     namespace: milvus
     labels: {aws-usage: <span class="hljs-string">&quot;milvus&quot;</span>}
   attachPolicyARNs:
   - <span class="hljs-string">&quot;arn:aws:iam::aws:policy/AmazonS3FullAccess&quot;</span>

<span class="hljs-comment"># Use existed VPC to create EKS.</span>
<span class="hljs-comment"># If you don&#x27;t config vpc subnets, eksctl will automatically create a brand new VPC</span>
vpc:
 subnets:
   private:
     us-west-2a: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id1&gt; }
     us-west-2b: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id2&gt; }
     us-west-2c: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id3&gt; }

managedNodeGroups:
 - name: ng-<span class="hljs-number">1</span>-milvus
   labels: { role: milvus }
   instanceType: m6i<span class="hljs-number">.2</span>xlarge
   desiredCapacity: <span class="hljs-number">3</span>
   privateNetworking: true
  
addons:
- name: vpc-cni <span class="hljs-comment"># no version is specified so it deploys the default version</span>
 attachPolicyARNs:
   - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
- name: coredns
 version: latest <span class="hljs-comment"># auto discovers the latest available</span>
- name: kube-proxy
 version: latest
- name: aws-ebs-csi-driver
 wellKnownPolicies:      <span class="hljs-comment"># add IAM and service account</span>
   ebsCSIController: true
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Kemudian, jalankan perintah <code translate="no">eksctl</code> untuk membuat klaster EKS.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Perintah ini akan membuat sumber daya berikut:</p>
<ul>
<li><p>Sebuah klaster EKS dengan versi yang ditentukan.</p></li>
<li><p>Grup simpul terkelola dengan tiga instance EC2 berukuran m6i.2xlarge.</p></li>
<li><p><a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">Penyedia identitas IAM OIDC</a> dan ServiceAccount bernama <code translate="no">aws-load-balancer-controller</code>, yang akan kita gunakan nanti saat menginstal <strong>AWS Load Balancer Controller</strong>.</p></li>
<li><p>Ruang nama <code translate="no">milvus</code> dan ServiceAccount <code translate="no">milvus-s3-access-sa</code> di dalam ruang nama ini. Namespace ini nantinya akan digunakan saat mengonfigurasi S3 sebagai penyimpanan objek untuk Milvus.</p>
<p>Catatan: Untuk mempermudah, <code translate="no">milvus-s3-access-sa</code> di sini diberikan izin akses S3 secara penuh. Dalam penerapan produksi, disarankan untuk mengikuti prinsip hak akses paling sedikit dan hanya memberikan akses ke bucket S3 tertentu yang digunakan untuk Milvus.</p></li>
<li><p>Beberapa add-on, di mana <code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> adalah add-on inti yang diperlukan oleh EKS. <code translate="no">aws-ebs-csi-driver</code> adalah driver AWS EBS CSI yang memungkinkan cluster EKS mengelola siklus hidup volume Amazon EBS.</p></li>
</ul>
<p>Sekarang, kita hanya perlu menunggu pembuatan cluster selesai.</p>
<p>Tunggu hingga pembuatan cluster selesai. Selama proses pembuatan cluster, file <code translate="no">kubeconfig</code> akan secara otomatis dibuat atau diperbarui. Anda juga dapat memperbaruinya secara manual dengan menjalankan perintah berikut. Pastikan untuk mengganti <code translate="no">region-code</code> dengan wilayah AWS tempat cluster Anda dibuat, dan ganti <code translate="no">cluster-name</code> dengan nama cluster Anda.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Setelah cluster dibuat, Anda dapat melihat node dengan menjalankannya:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Buat <code translate="no">ebs-sc</code> StorageClass yang dikonfigurasi dengan GP3 sebagai jenis penyimpanan, dan atur sebagai StorageClass default. Milvus menggunakan etcd sebagai Meta Storage dan membutuhkan StorageClass ini untuk membuat dan mengelola PVC.</li>
</ol>
<pre><code translate="no">cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: ebs-sc
 annotations:
   storageclass.kubernetes.io/<span class="hljs-keyword">is</span>-default-<span class="hljs-keyword">class</span>: <span class="hljs-string">&quot;true&quot;</span>
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
 <span class="hljs-built_in">type</span>: gp3
EOF
<button class="copy-code-btn"></button></code></pre>
<p>Kemudian, atur <code translate="no">gp2</code> StorageClass asli ke non-default:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Instal Pengontrol Penyeimbang Beban AWS. Kita akan menggunakan pengontrol ini nanti untuk Layanan Milvus dan Attu Ingress, jadi mari kita instal terlebih dahulu.</li>
</ol>
<ul>
<li>Pertama, tambahkan repo <code translate="no">eks-charts</code> dan perbarui.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Selanjutnya, instal AWS Load Balancer Controller. Ganti <code translate="no">cluster-name</code> dengan nama cluster Anda. ServiceAccount bernama <code translate="no">aws-load-balancer-controller</code> sudah dibuat saat kita membuat cluster EKS di langkah sebelumnya.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Verifikasi apakah pengontrol telah berhasil diinstal.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Keluarannya akan terlihat seperti ini:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Menerapkan Cluster Milvus</h3><p>Milvus mendukung beberapa metode penerapan, seperti Operator dan Helm. Operator lebih sederhana, tetapi Helm lebih langsung dan fleksibel. Kita akan menggunakan Helm untuk menerapkan Milvus dalam contoh ini.</p>
<p>Ketika men-deploy Milvus dengan Helm, Anda dapat menyesuaikan konfigurasinya melalui berkas <code translate="no">values.yaml</code>. Klik <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a> untuk melihat semua opsi. Secara default, Milvus membuat minio dan pulsar dalam cluster sebagai Penyimpanan Objek dan Penyimpanan Pesan. Kita akan membuat beberapa perubahan konfigurasi untuk membuatnya lebih cocok untuk produksi.</p>
<ol>
<li>Pertama, tambahkan repo Milvus Helm dan perbarui.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Buat berkas <code translate="no">milvus_cluster.yaml</code> dengan potongan kode berikut. Potongan kode ini menyesuaikan konfigurasi Milvus, seperti mengonfigurasi Amazon S3 sebagai penyimpanan objek dan Amazon MSK sebagai antrean pesan. Kami akan memberikan penjelasan terperinci dan panduan konfigurasi nanti.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 1</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure S3 as the Object Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Service account</span>
<span class="hljs-comment"># - this service account are used by External S3 access</span>
serviceAccount:
  create: false
  name: milvus-s3-access-sa

<span class="hljs-comment"># Close in-cluster minio</span>
minio:
  enabled: false

<span class="hljs-comment"># External S3</span>
<span class="hljs-comment"># - these configs are only used when `externalS3.enabled` is true</span>
externalS3:
  enabled: true
  host: <span class="hljs-string">&quot;s3.&lt;region-code&gt;.amazonaws.com&quot;</span>
  port: <span class="hljs-string">&quot;443&quot;</span>
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;bucket-name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;&lt;root-path&gt;&quot;</span>
  useIAM: true
  cloudProvider: <span class="hljs-string">&quot;aws&quot;</span>
  iamEndpoint: <span class="hljs-string">&quot;&quot;</span>

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 2</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure MSK as the Message Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Close in-cluster pulsar</span>
pulsar:
  enabled: false

<span class="hljs-comment"># External kafka</span>
<span class="hljs-comment"># - these configs are only used when `externalKafka.enabled` is true</span>
externalKafka:
  enabled: true
  brokerList: <span class="hljs-string">&quot;&lt;broker-list&gt;&quot;</span>
  securityProtocol: SASL_SSL
  sasl:
    mechanisms: SCRAM-SHA-<span class="hljs-number">512</span>
    username: <span class="hljs-string">&quot;&lt;username&gt;&quot;</span>
    password: <span class="hljs-string">&quot;&lt;password&gt;&quot;</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 3</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Expose the Milvus service to be accessed from outside the cluster (LoadBalancer service).</span>
<span class="hljs-comment"># or access it from within the cluster (ClusterIP service). Set the service type and the port to serve it.</span>
<span class="hljs-comment">#####################################</span>
service:
  <span class="hljs-built_in">type</span>: LoadBalancer
  port: <span class="hljs-number">19530</span>
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-<span class="hljs-built_in">type</span>: external <span class="hljs-comment">#AWS Load Balancer Controller fulfills services that has this annotation</span>
    service.beta.kubernetes.io/aws-load-balancer-name : milvus-service <span class="hljs-comment">#User defined name given to AWS Network Load Balancer</span>
    service.beta.kubernetes.io/aws-load-balancer-scheme: internal <span class="hljs-comment"># internal or internet-facing, later allowing for public access via internet</span>
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 4</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Installing Attu the Milvus management GUI</span>
<span class="hljs-comment">#####################################</span>
attu:
  enabled: true
  name: attu
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.<span class="hljs-keyword">class</span>: alb <span class="hljs-comment"># Annotation: set ALB ingress type</span>
      alb.ingress.kubernetes.io/scheme: internet-facing <span class="hljs-comment">#Places the load balancer on public subnets</span>
      alb.ingress.kubernetes.io/target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
      alb.ingress.kubernetes.io/group.name: attu <span class="hljs-comment"># Groups multiple Ingress resources</span>
    hosts:
      -
      
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 5</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># HA deployment of Milvus Core Components</span>
<span class="hljs-comment">#####################################</span>
rootCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for root coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 2Gi
indexCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for index coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
queryCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for query coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
dataCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for data coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
proxy:
  replicas: <span class="hljs-number">2</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 6</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Milvus Resource Allocation</span>
<span class="hljs-comment">#####################################</span>
queryNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">2</span>
      memory: 8Gi
dataNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi
indexNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">4</span>
      memory: 8Gi
<button class="copy-code-btn"></button></code></pre>
<p>Kode ini berisi enam bagian. Ikuti petunjuk berikut ini untuk mengubah konfigurasi yang sesuai.</p>
<p><strong>Bagian 1</strong>: Mengonfigurasi S3 sebagai Penyimpanan Objek. ServiceAccount memberikan akses kepada Milvus ke S3 (dalam hal ini, <code translate="no">milvus-s3-access-sa</code>, yang dibuat saat kita membuat kluster EKS). Pastikan untuk mengganti <code translate="no">&lt;region-code&gt;</code> dengan wilayah AWS tempat cluster Anda berada. Ganti <code translate="no">&lt;bucket-name&gt;</code> dengan nama bucket S3 Anda dan <code translate="no">&lt;root-path&gt;</code> dengan awalan untuk bucket S3 (bidang ini dapat dikosongkan).</p>
<p><strong>Bagian 2</strong>: Mengonfigurasi MSK sebagai Penyimpanan Pesan. Ganti <code translate="no">&lt;broker-list&gt;</code> dengan alamat titik akhir yang sesuai dengan jenis autentikasi SASL/SCRAM MSK. Ganti <code translate="no">&lt;username&gt;</code> dan <code translate="no">&lt;password&gt;</code> dengan nama pengguna dan kata sandi akun MSK. Anda bisa mendapatkan <code translate="no">&lt;broker-list&gt;</code> dari informasi klien MSK, seperti yang ditunjukkan pada gambar di bawah ini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>Gambar 4 Konfigurasikan MSK sebagai Penyimpanan Pesan Milvus.png</span> </span></p>
<p><em>Gambar 4: Mengkonfigurasi MSK sebagai Penyimpanan Pesan Milvus</em></p>
<p><strong>Bagian 3:</strong> Mengekspos layanan Milvus dan mengaktifkan akses dari luar cluster. Endpoint Milvus menggunakan layanan tipe ClusterIP secara default, yang hanya dapat diakses di dalam cluster EKS. Jika diperlukan, Anda dapat mengubahnya menjadi tipe LoadBalancer untuk mengizinkan akses dari luar cluster EKS. Layanan tipe LoadBalancer menggunakan Amazon NLB sebagai penyeimbang beban. Menurut praktik terbaik keamanan, <code translate="no">aws-load-balancer-scheme</code> dikonfigurasikan sebagai mode internal secara default di sini, yang berarti hanya akses intranet ke Milvus yang diizinkan. Klik untuk <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">melihat instruksi konfigurasi NLB</a>.</p>
<p><strong>Bagian 4:</strong> Menginstal dan mengkonfigurasi <a href="https://github.com/zilliztech/attu">Attu</a>, sebuah alat administrasi Milvus yang bersifat open source. Attu memiliki GUI yang intuitif yang memungkinkan Anda berinteraksi dengan Milvus dengan mudah. Kita mengaktifkan Attu, mengonfigurasi akses masuk menggunakan AWS ALB, dan mengaturnya ke tipe <code translate="no">internet-facing</code> sehingga Attu dapat diakses melalui Internet. Klik <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">dokumen ini</a> untuk panduan konfigurasi ALB.</p>
<p><strong>Bagian 5:</strong> Mengaktifkan penerapan HA pada Komponen Inti Milvus. Milvus berisi beberapa komponen independen dan terpisah. Sebagai contoh, layanan koordinator bertindak sebagai lapisan kontrol, menangani koordinasi untuk komponen Root, Query, Data, dan Index. Proxy di lapisan akses berfungsi sebagai titik akhir akses database. Komponen-komponen ini secara default hanya memiliki 1 replika pod. Menerapkan beberapa replika komponen layanan ini sangat diperlukan untuk meningkatkan ketersediaan Milvus.</p>
<p><strong>Catatan:</strong> Penyebaran multi-replika komponen koordinator Root, Query, Data, dan Index membutuhkan opsi <code translate="no">activeStandby</code> yang diaktifkan.</p>
<p><strong>Bagian 6:</strong> Menyesuaikan alokasi sumber daya untuk komponen Milvus untuk memenuhi kebutuhan beban kerja Anda. Situs web Milvus juga menyediakan <a href="https://milvus.io/tools/sizing/">alat bantu ukuran</a> untuk menghasilkan saran konfigurasi berdasarkan volume data, dimensi vektor, jenis indeks, dll. Alat ini juga dapat menghasilkan file konfigurasi Helm hanya dengan satu klik. Konfigurasi berikut ini adalah saran yang diberikan oleh alat ini untuk 1 juta 1024 dimensi vektor dan jenis indeks HNSW.</p>
<ol>
<li>Gunakan Helm untuk membuat Milvus (digunakan dalam namespace <code translate="no">milvus</code>). Catatan: Anda dapat mengganti <code translate="no">&lt;demo&gt;</code> dengan nama kustom.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Jalankan perintah berikut untuk memeriksa status penyebaran.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Output berikut ini menunjukkan bahwa semua komponen Milvus dalam kondisi TERSEDIA, dan komponen koordinasi memiliki beberapa replika yang diaktifkan.</p>
<pre><code translate="no">NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
demo-milvus-attu         1/1     1            1           5m27s
demo-milvus-datacoord    2/2     2            2           5m27s
demo-milvus-datanode     1/1     1            1           5m27s
demo-milvus-indexcoord   2/2     2            2           5m27s
demo-milvus-indexnode    1/1     1            1           5m27s
demo-milvus-proxy        2/2     2            2           5m27s
demo-milvus-querycoord   2/2     2            2           5m27s
demo-milvus-querynode    1/1     1            1           5m27s
demo-milvus-rootcoord    2/2     2            2           5m27s
<button class="copy-code-btn"></button></code></pre>
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Mengakses dan Mengelola Milvus</h3><p>Sejauh ini, kita telah berhasil men-deploy database vektor Milvus. Sekarang, kita dapat mengakses Milvus melalui titik akhir. Milvus mengekspos titik akhir melalui layanan Kubernetes. Attu mengekspos titik akhir melalui Kubernetes Ingress.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Mengakses titik akhir Milvus</strong></h4><p>Jalankan perintah berikut untuk mendapatkan titik akhir layanan:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Anda dapat melihat beberapa layanan. Milvus mendukung dua port, port <code translate="no">19530</code> dan port <code translate="no">9091</code>:</p>
<ul>
<li>Port <code translate="no">19530</code> adalah untuk gRPC dan RESTful API. Port ini adalah port default ketika Anda terhubung ke server Milvus dengan SDK Milvus atau klien HTTP yang berbeda.</li>
<li>Port <code translate="no">9091</code> adalah port manajemen untuk pengumpulan metrik, profil pprof, dan probe kesehatan dalam Kubernetes.</li>
</ul>
<p>Layanan <code translate="no">demo-milvus</code> menyediakan titik akhir akses basis data, yang digunakan untuk membuat koneksi dari klien. Layanan ini menggunakan NLB sebagai penyeimbang beban layanan. Anda dapat memperoleh endpoint layanan dari kolom <code translate="no">EXTERNAL-IP</code>.</p>
<pre><code translate="no">NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP                                               PORT(S)                          AGE
demo-etcd                ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.103</span><span class="hljs-number">.138</span>   &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-etcd-headless       ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-milvus              LoadBalancer   <span class="hljs-number">172.20</span><span class="hljs-number">.219</span><span class="hljs-number">.33</span>    milvus-nlb-xxxx.elb.us-west-<span class="hljs-number">2.</span>amazonaws.com               <span class="hljs-number">19530</span>:<span class="hljs-number">31201</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31088</span>/TCP   62m
demo-milvus-datacoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.214</span><span class="hljs-number">.106</span>   &lt;none&gt;                                                    <span class="hljs-number">13333</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-datanode     ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-indexcoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.106</span><span class="hljs-number">.51</span>    &lt;none&gt;                                                    <span class="hljs-number">31000</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-indexnode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-querycoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.136</span><span class="hljs-number">.213</span>   &lt;none&gt;                                                    <span class="hljs-number">19531</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-querynode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-rootcoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.173</span><span class="hljs-number">.98</span>    &lt;none&gt;                                                    <span class="hljs-number">53100</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Mengelola Milvus menggunakan Attu</strong></h4><p>Seperti yang telah dijelaskan sebelumnya, kita telah menginstal Attu untuk mengelola Milvus. Jalankan perintah berikut untuk mendapatkan endpoint:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Anda dapat melihat Ingress bernama <code translate="no">demo-milvus-attu</code>, di mana kolom <code translate="no">ADDRESS</code> adalah URL akses.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Buka alamat Ingress di peramban dan lihat halaman berikut. Klik <strong>Hubungkan</strong> untuk masuk.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>Gambar 5 Masuk ke akun Attu Anda.png</span> </span></p>
<p><em>Gambar 5: Masuk ke akun Attu Anda</em></p>
<p>Setelah masuk, Anda dapat mengelola basis data Milvus melalui Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>Gambar 6 Antarmuka Attu.png</span> </span></p>
<p>Gambar 6: Antarmuka Attu</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Menguji basis data vektor Milvus<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Kita akan menggunakan <a href="https://milvus.io/docs/example_code.md">contoh kode</a> Milvus untuk menguji apakah database Milvus bekerja dengan baik. Pertama, unduh kode contoh <code translate="no">hello_milvus.py</code> menggunakan perintah berikut:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ubah host pada kode contoh ke titik akhir layanan Milvus.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Jalankan kode tersebut:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Jika sistem mengembalikan hasil berikut ini, maka ini mengindikasikan bahwa Milvus berjalan dengan normal.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
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
    </button></h2><p>Artikel ini memperkenalkan <a href="https://milvus.io/intro">Milvus</a>, salah satu database vektor open-source yang paling populer, dan memberikan panduan untuk menerapkan Milvus di AWS menggunakan layanan terkelola seperti Amazon EKS, S3, MSK, dan ELB untuk mencapai elastisitas dan keandalan yang lebih baik.</p>
<p>Sebagai komponen inti dari berbagai sistem GenAI, khususnya Retrieval Augmented Generation (RAG), Milvus mendukung dan berintegrasi dengan berbagai model dan kerangka kerja GenAI utama, termasuk Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex, dan LangChain. Mulailah perjalanan inovasi GenAI Anda dengan Milvus hari ini!</p>
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
    </button></h2><ul>
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Panduan Pengguna Amazon EKS</a></li>
<li><a href="https://milvus.io/">Situs Web Resmi Milvus</a></li>
<li><a href="https://github.com/milvus-io/milvus">Repositori GitHub Milvus</a></li>
<li><a href="https://eksctl.io/">Situs Web Resmi eksctl</a></li>
</ul>
