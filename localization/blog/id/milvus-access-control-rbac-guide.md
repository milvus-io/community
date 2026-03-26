---
id: milvus-access-control-rbac-guide.md
title: 'Panduan Kontrol Akses Milvus: Cara Mengonfigurasi RBAC untuk Produksi'
author: Jack Li and Juan Xu
date: 2026-3-26
cover: assets.zilliz.com/cover_access_control_2_3e211dd48b.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus access control, Milvus RBAC, vector database security, Milvus privilege
  groups, Milvus production setup
meta_title: |
  Milvus Access Control: Configure RBAC for Production
desc: >-
  Panduan langkah demi langkah untuk menyiapkan Milvus RBAC dalam produksi -
  pengguna, peran, grup hak istimewa, akses tingkat koleksi, dan contoh sistem
  RAG yang lengkap.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>Berikut ini adalah cerita yang lebih umum daripada yang seharusnya: seorang insinyur QA menjalankan skrip pembersihan terhadap apa yang mereka pikir adalah lingkungan pementasan. Kecuali string koneksi yang mengarah ke produksi. Beberapa detik kemudian, koleksi vektor inti hilang - data fitur hilang, <a href="https://zilliz.com/glossary/similarity-search">pencarian kemiripan</a> mengembalikan hasil kosong, layanan menurun secara keseluruhan. Postmortem menemukan akar penyebab yang sama yang selalu terjadi: semua orang terhubung sebagai <code translate="no">root</code>, tidak ada batasan akses, dan tidak ada yang menghentikan akun uji coba untuk menjatuhkan data produksi.</p>
<p>Ini bukan kejadian sekali saja. Tim yang membangun <a href="https://milvus.io/">Milvus</a> - dan <a href="https://zilliz.com/learn/what-is-a-vector-database">basis data vektor</a> pada umumnya - cenderung berfokus pada <a href="https://zilliz.com/learn/vector-index">kinerja indeks</a>, throughput, dan skala data, sambil memperlakukan kontrol akses sebagai sesuatu yang harus ditangani nanti. Tetapi "nanti" biasanya datang dalam bentuk insiden. Ketika Milvus bergerak dari prototipe ke tulang punggung <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">jalur pipa RAG</a> produksi, mesin rekomendasi, dan <a href="https://zilliz.com/learn/what-is-vector-search">pencarian vektor</a> waktu nyata, pertanyaannya menjadi tak terhindarkan: siapa yang dapat mengakses cluster Milvus Anda, dan apa sebenarnya yang boleh mereka lakukan?</p>
<p>Milvus menyertakan sistem RBAC bawaan untuk menjawab pertanyaan tersebut. Panduan ini membahas apa itu RBAC, bagaimana Milvus mengimplementasikannya, dan bagaimana merancang model kontrol akses yang menjaga produksi tetap aman - lengkap dengan contoh kode dan panduan lengkap sistem RAG.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">Apa itu RBAC (Kontrol Akses Berbasis Peran)?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Role-Based Access Control (RBAC</strong> ) adalah model keamanan di mana izin tidak diberikan secara langsung kepada masing-masing pengguna. Sebaliknya, izin dikelompokkan ke dalam peran, dan pengguna diberi satu atau beberapa peran. Akses efektif pengguna adalah gabungan dari semua izin dari peran yang ditetapkan. RBAC adalah model kontrol akses standar dalam sistem basis data produksi - PostgreSQL, MySQL, MongoDB, dan sebagian besar layanan cloud menggunakannya.</p>
<p>RBAC memecahkan masalah penskalaan yang mendasar: ketika Anda memiliki lusinan pengguna dan layanan, mengelola izin per-pengguna menjadi tidak mudah. Dengan RBAC, Anda mendefinisikan peran sekali saja (misalnya, "hanya-baca pada koleksi X"), menetapkannya ke sepuluh layanan, dan memperbaruinya di satu tempat ketika persyaratan berubah.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Bagaimana Milvus Menerapkan RBAC?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC dibangun di atas empat konsep:</p>
<table>
<thead>
<tr><th>Konsep</th><th>Apa itu</th><th>Contoh</th></tr>
</thead>
<tbody>
<tr><td><strong>Sumber Daya</strong></td><td>Sesuatu yang sedang diakses</td><td><a href="https://milvus.io/docs/architecture_overview.md">Instance Milvus</a>, <a href="https://milvus.io/docs/manage-databases.md">basis data</a>, atau koleksi tertentu</td></tr>
<tr><td><strong>Hak Istimewa / Kelompok Hak Istimewa</strong></td><td>Tindakan yang sedang dilakukan</td><td><code translate="no">Search</code>, <code translate="no">Insert</code>, <code translate="no">DropCollection</code>, atau grup seperti <code translate="no">COLL_RO</code> (hanya-baca koleksi)</td></tr>
<tr><td><strong>Peran</strong></td><td>Sekumpulan hak istimewa yang diberi nama yang tercakup dalam sumber daya</td><td><code translate="no">role_read_only</code>dapat mencari dan menanyakan semua koleksi di dalam basis data <code translate="no">default</code> </td></tr>
<tr><td><strong>Pengguna</strong></td><td>Sebuah akun Milvus (manusia atau layanan)</td><td><code translate="no">rag_writer</code>akun layanan yang digunakan oleh pipa konsumsi</td></tr>
</tbody>
</table>
<p>Akses tidak pernah diberikan secara langsung kepada pengguna. Pengguna mendapatkan peran, peran berisi hak istimewa, dan hak istimewa dicakup dalam sumber daya. Ini adalah <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">model RBAC</a> yang sama dengan yang digunakan di sebagian besar sistem basis data produksi. Jika sepuluh pengguna berbagi peran yang sama, Anda memperbarui peran sekali dan perubahan itu berlaku untuk semuanya.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>Model RBAC Milvus yang menunjukkan bagaimana Pengguna ditugaskan ke Peran, dan Peran berisi Hak Istimewa dan Grup Hak Istimewa yang berlaku untuk Sumber Daya</span> </span></p>
<p>Ketika sebuah permintaan masuk ke Milvus, permintaan tersebut akan melalui tiga pemeriksaan:</p>
<ol>
<li><strong>Autentikasi</strong> - apakah ini pengguna yang valid dengan kredensial yang benar?</li>
<li><strong>Pemeriksaan peran</strong> - apakah pengguna ini memiliki setidaknya satu peran yang ditetapkan?</li>
<li><strong>Pemeriksaan hak istimewa</strong> - apakah salah satu peran pengguna memberikan tindakan yang diminta pada sumber daya yang diminta?</li>
</ol>
<p>Jika ada pemeriksaan yang gagal, permintaan ditolak.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Alur otentikasi dan otorisasi Milvus: Permintaan Klien melewati Autentikasi, Pemeriksaan Peran, dan Pemeriksaan Hak Istimewa - ditolak pada setiap langkah yang gagal, dieksekusi hanya jika semua lulus</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Cara Mengaktifkan Autentikasi di Milvus<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Secara default, Milvus berjalan dengan autentikasi yang dinonaktifkan - setiap koneksi memiliki akses penuh. Langkah pertama adalah mengaktifkannya.</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>Edit <code translate="no">milvus.yaml</code> dan setel <code translate="no">authorizationEnabled</code> ke <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Diagram Kemudi</h3><p>Edit <code translate="no">values.yaml</code> dan tambahkan pengaturan di bawah <code translate="no">extraConfigFiles</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Untuk penerapan <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> pada <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a>, konfigurasi yang sama masuk ke bagian <code translate="no">spec.config</code> pada Milvus CR.</p>
<p>Setelah autentikasi diaktifkan dan Milvus dimulai ulang, setiap koneksi harus memberikan kredensial. Milvus membuat pengguna default <code translate="no">root</code> dengan kata sandi <code translate="no">Milvus</code> - segera ubah ini.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect with the default root account</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)

<span class="hljs-comment"># Change the password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>,
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">Cara Mengonfigurasi Pengguna, Peran, dan Hak Istimewa<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>Dengan autentikasi diaktifkan, berikut adalah alur kerja penyiapan yang umum.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">Langkah 1: Membuat Pengguna</h3><p>Jangan biarkan layanan atau anggota tim menggunakan <code translate="no">root</code>. Buat akun khusus untuk setiap pengguna atau layanan.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">Langkah 2: Buat Peran</h3><p>Milvus memiliki peran <code translate="no">admin</code> bawaan, tetapi dalam praktiknya Anda akan membutuhkan peran khusus yang sesuai dengan pola akses Anda yang sebenarnya.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">Langkah 3: Membuat Grup Hak Istimewa</h3><p>Grup hak istimewa menggabungkan beberapa hak istimewa di bawah satu nama, membuatnya lebih mudah untuk mengelola akses dalam skala besar. Milvus menyediakan 9 grup hak istimewa bawaan:</p>
<table>
<thead>
<tr><th>Grup Bawaan</th><th>Cakupan</th><th>Apa yang Diizinkan</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Koleksi</td><td>Operasi hanya-baca (Query, Pencarian, dll.)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Koleksi</td><td>Operasi baca dan tulis</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Koleksi</td><td>Manajemen koleksi lengkap</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>Basis data</td><td>Operasi basis data hanya-baca</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>Basis data</td><td>Operasi basis data baca dan tulis</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>Basis data</td><td>Manajemen basis data lengkap</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>Cluster</td><td>Operasi cluster hanya-baca</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>Cluster</td><td>Operasi cluster baca dan tulis</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>Cluster</td><td>Manajemen cluster penuh</td></tr>
</tbody>
</table>
<p>Anda juga bisa membuat grup hak istimewa khusus jika grup bawaan tidak cocok:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">Langkah 4: Memberikan Hak Istimewa pada Peran</h3><p>Berikan hak istimewa individu atau grup hak istimewa ke peran, dengan cakupan sumber daya tertentu. Parameter <code translate="no">collection_name</code> dan <code translate="no">db_name</code> mengontrol cakupan - gunakan <code translate="no">*</code> untuk semua.</p>
<pre><code translate="no"><span class="hljs-comment"># Grant a single privilege</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a privilege group</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a cluster-level privilege (* means all resources)</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">Langkah 5: Menetapkan Peran ke Pengguna</h3><p>Seorang pengguna dapat memiliki beberapa peran. Izin efektif mereka adalah gabungan dari semua peran yang ditetapkan.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">Cara Mengaudit dan Mencabut Akses<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengetahui akses yang ada sama pentingnya dengan memberikannya. Izin yang sudah basi - dari mantan anggota tim, layanan yang sudah pensiun, atau sesi debugging satu kali - terakumulasi secara diam-diam dan memperluas permukaan serangan.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">Periksa Izin Saat Ini</h3><p>Melihat peran yang diberikan kepada pengguna:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Melihat hak istimewa yang diberikan peran:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">Mencabut Hak Istimewa dari Peran</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Remove a privilege group</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">Membatalkan Penetapan Peran dari Pengguna</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">Menghapus Pengguna atau Peran</h3><p>Hapus semua penetapan peran sebelum menghapus pengguna, dan cabut semua hak istimewa sebelum menghapus peran:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">Contoh: Cara Merancang RBAC untuk Sistem RAG Produksi<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Konsep abstrak akan lebih cepat dipahami dengan contoh konkret. Pertimbangkan sistem <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> yang dibangun di atas Milvus dengan tiga layanan berbeda:</p>
<table>
<thead>
<tr><th>Layanan</th><th>Tanggung Jawab</th><th>Akses yang Dibutuhkan</th></tr>
</thead>
<tbody>
<tr><td><strong>Admin platform</strong></td><td>Mengelola kluster Milvus - membuat koleksi, memantau kesehatan, menangani peningkatan</td><td>Admin cluster penuh</td></tr>
<tr><td><strong>Layanan konsumsi</strong></td><td>Menghasilkan <a href="https://zilliz.com/glossary/vector-embeddings">penyematan vektor</a> dari dokumen dan menuliskannya ke koleksi</td><td>Baca + tulis pada koleksi</td></tr>
<tr><td><strong>Layanan pencarian</strong></td><td>Menangani permintaan <a href="https://zilliz.com/learn/what-is-vector-search">pencarian vektor</a> dari pengguna akhir</td><td>Hanya-baca pada koleksi</td></tr>
</tbody>
</table>
<p>Berikut adalah pengaturan lengkap menggunakan <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with your updated root password</span>
)

<span class="hljs-comment"># 1. Create users</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)

<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)

<span class="hljs-comment"># 3. Grant access to roles</span>

<span class="hljs-comment"># Admin role: cluster-level admin access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)

<span class="hljs-comment"># Read-only role: collection-level read-only access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Read-write role: collection-level read and write access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># 4. Assign roles to users</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Setiap layanan mendapatkan akses yang dibutuhkan. Layanan pencarian tidak dapat menghapus data secara tidak sengaja. Layanan konsumsi tidak dapat mengubah pengaturan kluster. Dan jika kredensial layanan pencarian bocor, penyerang dapat membaca <a href="https://zilliz.com/glossary/vector-embeddings">vektor peny</a> ematan - tetapi tidak dapat menulis, menghapus, atau meningkat ke admin.</p>
<p>Untuk tim yang mengelola akses di beberapa penerapan Milvus, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus terkelola) menyediakan RBAC bawaan dengan konsol web untuk mengelola pengguna, peran, dan izin - tanpa perlu membuat skrip. Berguna jika Anda lebih suka mengelola akses melalui UI daripada memelihara skrip pengaturan di seluruh lingkungan.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">Praktik Terbaik Kontrol Akses untuk Produksi<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Langkah-langkah penyiapan di atas adalah mekanismenya. Berikut ini prinsip-prinsip desain yang menjaga kontrol akses tetap efektif dari waktu ke waktu.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">Kunci Akun Root</h3><p>Ubah kata sandi default <code translate="no">root</code> sebelum yang lainnya. Dalam produksi, akun root harus digunakan hanya untuk operasi darurat dan disimpan dalam manajer rahasia - tidak dikodekan dalam konfigurasi aplikasi atau dibagikan melalui Slack.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">Pisahkan Lingkungan Sepenuhnya</h3><p>Gunakan <a href="https://milvus.io/docs/architecture_overview.md">instance Milvus</a> yang berbeda untuk pengembangan, pementasan, dan produksi. Pemisahan lingkungan dengan RBAC saja sudah rapuh - satu string koneksi yang salah dikonfigurasi dan layanan dev menulis ke data produksi. Pemisahan fisik (cluster yang berbeda, kredensial yang berbeda) menghilangkan kelas insiden ini sepenuhnya.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">Menerapkan Hak Istimewa Paling Sedikit</h3><p>Berikan setiap pengguna dan layanan akses minimum yang diperlukan untuk melakukan tugasnya. Mulailah dengan mempersempit dan melebarkannya hanya jika ada kebutuhan khusus yang terdokumentasi. Dalam lingkungan pengembangan, Anda bisa lebih santai, tetapi akses produksi harus ketat dan ditinjau secara teratur.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">Bersihkan Akses yang Sudah Basi</h3><p>Ketika seseorang meninggalkan tim atau sebuah layanan dinonaktifkan, cabut peran mereka dan hapus akun mereka segera. Akun yang tidak digunakan dengan izin aktif adalah vektor paling umum untuk akses yang tidak sah - akun ini merupakan kredensial yang valid yang tidak dipantau oleh siapa pun.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">Batasi Hak Akses ke Koleksi Tertentu</h3><p>Hindari memberikan <code translate="no">collection_name='*'</code> kecuali jika peran tersebut benar-benar membutuhkan akses ke setiap koleksi. Dalam pengaturan multi-penyewa atau sistem dengan beberapa jalur data, cakup setiap peran hanya untuk <a href="https://milvus.io/docs/manage-collections.md">koleksi</a> yang dioperasikannya. Hal ini akan membatasi radius ledakan jika kredensial dibobol.</p>
<hr>
<p>Jika Anda menggunakan <a href="https://milvus.io/">Milvus</a> dalam produksi dan bekerja melalui kontrol akses, keamanan, atau desain multi-tenant, kami ingin membantu:</p>
<ul>
<li>Bergabunglah dengan <a href="https://slack.milvus.io/">komunitas Milvus Slack</a> untuk mendiskusikan praktik penerapan nyata dengan insinyur lain yang menjalankan Milvus dalam skala besar.</li>
<li><a href="https://milvus.io/office-hours">Pesan sesi Jam Kerja Milvus selama 20 menit gratis</a> untuk membahas desain RBAC Anda - baik itu struktur peran, pelingkupan tingkat koleksi, atau keamanan multi-lingkungan.</li>
<li>Jika Anda lebih suka melewatkan penyiapan infrastruktur dan mengelola kontrol akses melalui UI, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus terkelola) menyertakan RBAC bawaan dengan konsol web - ditambah <a href="https://zilliz.com/cloud-security">enkripsi</a>, isolasi jaringan, dan kepatuhan SOC 2 secara langsung.</li>
</ul>
<hr>
<p>Beberapa pertanyaan yang muncul saat tim mulai mengonfigurasi kontrol akses di Milvus:</p>
<p><strong>T: Dapatkah saya membatasi pengguna hanya pada koleksi tertentu, tidak semuanya?</strong></p>
<p>Ya. Ketika Anda memanggil <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>setel <code translate="no">collection_name</code> ke koleksi tertentu, bukan <code translate="no">*</code>. Peran pengguna hanya akan memiliki akses ke koleksi tersebut. Anda dapat memberikan hak peran yang sama pada beberapa koleksi dengan memanggil fungsi tersebut satu kali per koleksi.</p>
<p><strong>T: Apa perbedaan antara hak istimewa dan kelompok hak istimewa di Milvus?</strong></p>
<p>Hak istimewa adalah tindakan tunggal seperti <code translate="no">Search</code>, <code translate="no">Insert</code>, atau <code translate="no">DropCollection</code>. <a href="https://milvus.io/docs/privilege_group.md">Grup</a> hak istimewa menggabungkan beberapa hak istimewa di bawah satu nama - misalnya, <code translate="no">COLL_RO</code> mencakup semua operasi koleksi hanya-baca. Pemberian grup hak istimewa secara fungsional sama dengan pemberian setiap hak istimewa konstituennya secara individual, namun lebih mudah dikelola.</p>
<p><strong>T: Apakah mengaktifkan autentikasi mempengaruhi kinerja kueri Milvus?</strong></p>
<p>Biaya tambahan dapat diabaikan. Milvus memvalidasi kredensial dan memeriksa izin peran pada setiap permintaan, tetapi ini adalah pencarian dalam memori - ini menambahkan mikrodetik, bukan milidetik. Tidak ada dampak yang terukur pada latensi <a href="https://milvus.io/docs/single-vector-search.md">pencarian</a> atau <a href="https://milvus.io/docs/insert-update-delete.md">penyisipan</a>.</p>
<p><strong>T: Dapatkah saya menggunakan Milvus RBAC dalam pengaturan multi-penyewa?</strong></p>
<p>Ya. Buat peran terpisah per penyewa, cakup setiap hak istimewa peran untuk koleksi penyewa tersebut, dan tetapkan peran yang sesuai untuk setiap akun layanan penyewa. Ini memberi Anda isolasi tingkat koleksi tanpa memerlukan instance Milvus yang terpisah. Untuk multi-penyewaan berskala lebih besar, lihat <a href="https://milvus.io/docs/multi_tenancy.md">panduan multi-penyewaan Milvus</a>.</p>
