---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >-
  Penjelasan Milvus RBAC: Amankan Basis Data Vektor Anda dengan Kontrol Akses
  Berbasis Peran
author: Juan Xu
date: 2025-12-31T00:00:00.000Z
cover: assets.zilliz.com/RBAC_in_Milvus_Cover_1fe181b31d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RBAC, access control, vector database security'
meta_title: |
  Milvus RBAC Guide: How to Control Access to Your Vector Database
desc: >-
  Pelajari mengapa RBAC penting, cara kerja RBAC di Milvus, cara mengonfigurasi
  kontrol akses, dan bagaimana RBAC memungkinkan akses yang paling tidak
  memiliki hak istimewa, pemisahan peran yang jelas, dan operasi produksi yang
  aman.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>Ketika membangun sistem database, para insinyur menghabiskan sebagian besar waktu mereka untuk performa: jenis indeks, pemanggilan, latensi, throughput, dan penskalaan. Namun, ketika sebuah sistem sudah melampaui satu laptop pengembang, pertanyaan lain menjadi sama pentingnya: <strong>siapa yang bisa melakukan apa di dalam cluster Milvus Anda</strong>? Dengan kata lain-kontrol akses.</p>
<p>Di seluruh industri, banyak insiden operasional yang berasal dari kesalahan izin yang sederhana. Sebuah skrip berjalan di lingkungan yang salah. Akun layanan memiliki akses yang lebih luas dari yang dimaksudkan. Kredensial admin yang digunakan bersama berakhir di CI. Masalah-masalah ini biasanya muncul sebagai pertanyaan yang sangat praktis:</p>
<ul>
<li><p>Apakah pengembang diizinkan untuk menghapus koleksi produksi?</p></li>
<li><p>Mengapa akun uji coba dapat membaca data vektor produksi?</p></li>
<li><p>Mengapa beberapa layanan masuk dengan peran admin yang sama?</p></li>
<li><p>Dapatkah pekerjaan analitik memiliki akses hanya-baca tanpa hak tulis?</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> menjawab tantangan-tantangan ini dengan <a href="https://milvus.io/docs/rbac.md">kontrol akses berbasis peran (RBAC)</a>. Alih-alih memberikan hak superadmin kepada setiap pengguna atau mencoba menerapkan pembatasan dalam kode aplikasi, RBAC memungkinkan Anda menentukan izin yang tepat di lapisan database. Setiap pengguna atau layanan mendapatkan kemampuan yang dibutuhkannya-tidak lebih.</p>
<p>Tulisan ini menjelaskan cara kerja RBAC di Milvus, cara mengonfigurasinya, dan cara menerapkannya dengan aman di lingkungan produksi.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Mengapa Kontrol Akses Penting Saat Menggunakan Milvus<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika tim kecil, dan aplikasi AI mereka hanya melayani sejumlah pengguna, infrastruktur biasanya sederhana. Beberapa insinyur mengelola sistem; Milvus hanya digunakan untuk pengembangan atau pengujian; dan alur kerja operasional sangat mudah. Pada tahap awal ini, kontrol akses jarang terasa mendesak-karena risiko yang ada masih kecil dan setiap kesalahan bisa dengan mudah dibalik.</p>
<p>Ketika Milvus memasuki tahap produksi dan jumlah pengguna, layanan, dan operator bertambah, model penggunaan berubah dengan cepat. Skenario yang umum terjadi meliputi:</p>
<ul>
<li><p>Beberapa sistem bisnis yang berbagi instance Milvus yang sama</p></li>
<li><p>Beberapa tim mengakses koleksi vektor yang sama</p></li>
<li><p>Data pengujian, pementasan, dan produksi yang hidup berdampingan dalam satu cluster</p></li>
<li><p>Peran yang berbeda membutuhkan tingkat akses yang berbeda, mulai dari kueri hanya-baca hingga menulis dan kontrol operasional</p></li>
</ul>
<p>Tanpa batas akses yang terdefinisi dengan baik, pengaturan ini menciptakan risiko yang dapat diprediksi:</p>
<ul>
<li><p>Alur kerja pengujian mungkin secara tidak sengaja menghapus koleksi produksi</p></li>
<li><p>Pengembang mungkin secara tidak sengaja memodifikasi indeks yang digunakan oleh layanan live</p></li>
<li><p>Penggunaan akun <code translate="no">root</code> secara luas membuat tindakan tidak mungkin dilacak atau diaudit</p></li>
<li><p>Aplikasi yang disusupi dapat memperoleh akses tak terbatas ke semua data vektor</p></li>
</ul>
<p>Seiring dengan meningkatnya penggunaan, mengandalkan konvensi informal atau akun admin bersama tidak lagi dapat dipertahankan. Model akses yang konsisten dan dapat ditegakkan menjadi sangat penting - dan inilah yang disediakan oleh Milvus RBAC.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">Apa yang dimaksud dengan RBAC di Milvus<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC (Role-Based Access Control)</a> adalah model perizinan yang mengontrol akses berdasarkan <strong>peran</strong>, bukannya berdasarkan pengguna individual. Di Milvus, RBAC memungkinkan Anda menentukan dengan tepat operasi mana yang diizinkan untuk dilakukan oleh pengguna atau layanan - dan pada sumber daya tertentu. Ini menyediakan cara yang terstruktur dan terukur untuk mengelola keamanan seiring pertumbuhan sistem Anda dari satu pengembang menjadi lingkungan produksi yang lengkap.</p>
<p>Milvus RBAC dibangun di sekitar komponen inti berikut ini:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>Hak Istimewa Peran Pengguna</span> </span></p>
<ul>
<li><p><strong>Sumber daya</strong>: Entitas yang sedang diakses. Di Milvus, sumber daya mencakup <strong>instance</strong>, <strong>database</strong>, dan <strong>koleksi</strong>.</p></li>
<li><p><strong>Privilege</strong>: Operasi spesifik yang diizinkan pada sumber daya-misalnya, membuat koleksi, menyisipkan data, atau menghapus entitas.</p></li>
<li><p><strong>Privilege Group</strong>: Sekumpulan hak istimewa terkait yang sudah ditentukan sebelumnya, seperti "hanya-baca" atau "tulis".</p></li>
<li><p><strong>Peran</strong>: Kombinasi hak istimewa dan sumber daya yang digunakan. Peran menentukan operasi <em>apa yang</em> dapat dilakukan dan <em>di mana</em>.</p></li>
<li><p><strong>Pengguna</strong>: Sebuah identitas dalam Milvus. Setiap pengguna memiliki ID unik dan diberikan satu atau lebih peran.</p></li>
</ul>
<p>Komponen-komponen ini membentuk hierarki yang jelas:</p>
<ol>
<li><p><strong>Pengguna diberi peran</strong></p></li>
<li><p><strong>Peran menentukan hak istimewa</strong></p></li>
<li><p><strong>Hak istimewa berlaku untuk sumber daya tertentu</strong></p></li>
</ol>
<p>Prinsip desain utama dalam Milvus adalah bahwa hak <strong>akses tidak pernah diberikan secara langsung kepada pengguna</strong>. Semua akses melalui peran. Pengarahan ini menyederhanakan administrasi, mengurangi kesalahan konfigurasi, dan membuat perubahan izin dapat diprediksi.</p>
<p>Model ini berskala bersih dalam penerapan nyata. Ketika beberapa pengguna berbagi peran, memperbarui hak istimewa peran akan langsung memperbarui izin untuk semuanya-tanpa mengubah setiap pengguna satu per satu. Ini adalah satu titik kontrol yang selaras dengan cara infrastruktur modern mengelola akses.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">Cara Kerja RBAC di Milvus<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika klien mengirimkan permintaan ke Milvus, sistem akan mengevaluasinya melalui serangkaian langkah otorisasi. Setiap langkah harus dilalui sebelum operasi diizinkan untuk dilanjutkan:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Cara Kerja RBAC di Milvus</span> </span></p>
<ol>
<li><p><strong>Autentikasi permintaan:</strong> Milvus pertama-tama memverifikasi identitas pengguna. Jika autentikasi gagal, permintaan akan ditolak dengan kesalahan autentikasi.</p></li>
<li><p><strong>Periksa penetapan peran:</strong> Setelah autentikasi, Milvus memeriksa apakah pengguna memiliki setidaknya satu peran yang ditetapkan. Jika tidak ada peran yang ditemukan, permintaan akan ditolak dengan kesalahan izin ditolak.</p></li>
<li><p><strong>Verifikasi hak istimewa yang diperlukan:</strong> Milvus kemudian mengevaluasi apakah peran pengguna memberikan hak istimewa yang diperlukan pada sumber daya target. Jika pemeriksaan hak istimewa gagal, permintaan ditolak dengan kesalahan izin ditolak.</p></li>
<li><p><strong>Jalankan operasi:</strong> Jika semua pemeriksaan lolos, Milvus akan mengeksekusi operasi yang diminta dan mengembalikan hasilnya.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">Cara Mengonfigurasi Kontrol Akses melalui RBAC di Milvus<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. Prasyarat</h3><p>Sebelum aturan RBAC dapat dievaluasi dan ditegakkan, otentikasi pengguna harus diaktifkan sehingga setiap permintaan ke Milvus dapat dikaitkan dengan identitas pengguna tertentu.</p>
<p>Berikut adalah dua metode penerapan standar.</p>
<ul>
<li><strong>Menerapkan dengan Docker Compose</strong></li>
</ul>
<p>Jika Milvus diterapkan menggunakan Docker Compose, edit berkas konfigurasi <code translate="no">milvus.yaml</code> dan aktifkan otorisasi dengan mengatur <code translate="no">common.security.authorizationEnabled</code> ke <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Menerapkan dengan Helm Charts</strong></li>
</ul>
<p>Jika Milvus diterapkan menggunakan Helm Charts, edit berkas <code translate="no">values.yaml</code> dan tambahkan konfigurasi berikut di bawah <code translate="no">extraConfigFiles.user.yaml</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. Inisialisasi</h3><p>Secara default, Milvus membuat pengguna <code translate="no">root</code> bawaan ketika sistem dijalankan. Kata sandi default untuk pengguna ini adalah <code translate="no">Milvus</code>.</p>
<p>Sebagai langkah keamanan awal, gunakan user <code translate="no">root</code> untuk terhubung ke Milvus dan segera ubah kata sandi default. Sangat disarankan untuk menggunakan kata sandi yang rumit untuk mencegah akses yang tidak sah.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-comment"># Connect to Milvus using the default root user</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>, 
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)
<span class="hljs-comment"># Update the root password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>, 
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Core-Operations" class="common-anchor-header">3. Operasi Inti</h3><p><strong>Membuat Pengguna</strong></p>
<p>Untuk penggunaan sehari-hari, disarankan untuk membuat pengguna khusus daripada menggunakan akun <code translate="no">root</code>.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Membuat Peran</strong></p>
<p>Milvus menyediakan peran <code translate="no">admin</code> bawaan dengan hak administratif penuh. Namun, untuk sebagian besar skenario produksi, disarankan untuk membuat peran khusus untuk mencapai kontrol akses yang lebih baik.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Membuat Grup Hak Istimewa</strong></p>
<p>Grup hak istimewa adalah kumpulan beberapa hak istimewa. Untuk menyederhanakan manajemen izin, hak istimewa terkait dapat dikelompokkan dan diberikan bersama-sama.</p>
<p>Milvus menyertakan grup hak istimewa bawaan berikut ini:</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>Menggunakan grup hak istimewa bawaan ini dapat secara signifikan mengurangi kerumitan desain izin dan meningkatkan konsistensi di seluruh peran.</p>
<p>Anda dapat menggunakan grup hak istimewa bawaan secara langsung atau membuat grup hak istimewa khusus sesuai kebutuhan.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>Memberikan Hak Istimewa atau Grup Hak Istimewa ke Peran</strong></p>
<p>Setelah peran dibuat, hak istimewa atau grup hak istimewa dapat diberikan ke peran tersebut. Sumber daya target untuk hak istimewa ini dapat ditentukan pada tingkat yang berbeda, termasuk instance, database, atau Koleksi individual.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Memberikan Peran kepada Pengguna</strong></p>
<p>Setelah peran diberikan kepada pengguna, pengguna dapat mengakses sumber daya dan melakukan operasi yang ditentukan oleh peran tersebut. Satu pengguna dapat diberikan satu atau beberapa peran, tergantung pada cakupan akses yang diperlukan.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. Memeriksa dan Mencabut Akses</h3><p><strong>Memeriksa Peran yang Ditugaskan ke Pengguna</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Memeriksa Hak Istimewa yang Ditugaskan ke Peran</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Mencabut Hak Istimewa dari Peran</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Mencabut Peran dari Pengguna</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Menghapus Pengguna dan Peran</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Contoh: Desain Kontrol Akses untuk Sistem RAG yang Didukung Milvus<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Pertimbangkan sistem Retrieval-Augmented Generation (RAG) yang dibangun di atas Milvus.</p>
<p>Dalam sistem ini, komponen dan pengguna yang berbeda memiliki tanggung jawab yang terpisah dengan jelas, dan masing-masing membutuhkan tingkat akses yang berbeda.</p>
<table>
<thead>
<tr><th>Aktor</th><th>Tanggung Jawab</th><th>Akses yang Dibutuhkan</th></tr>
</thead>
<tbody>
<tr><td>Administrator Platform</td><td>Operasi dan konfigurasi sistem</td><td>Administrasi tingkat instansi</td></tr>
<tr><td>Layanan Konsumsi Vektor</td><td>Konsumsi dan pembaruan data vektor</td><td>Akses baca dan tulis</td></tr>
<tr><td>Layanan Pencarian</td><td>Pencarian dan pengambilan vektor</td><td>Akses hanya-baca</td></tr>
</tbody>
</table>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with the updated root password</span>
)
<span class="hljs-comment"># 1. Create a user (use a strong password)</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<span class="hljs-comment"># 3. Grant privileges to the role</span>
<span class="hljs-comment">## Using built-in Milvus privilege groups</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<span class="hljs-comment"># 4. Assign the role to the user</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">Kiat Cepat: Cara Mengoperasikan Kontrol Akses dengan Aman dalam Produksi<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Untuk memastikan kontrol akses tetap efektif dan dapat dikelola dalam sistem produksi yang sudah berjalan lama, ikuti panduan praktis berikut ini.</p>
<p><strong>1. Ubah</strong> <strong>kata sandi</strong><strong>default</strong> <code translate="no">root</code> <strong>dan batasi penggunaan</strong> <strong>akun</strong> <code translate="no">root</code> </p>
<p>Perbarui kata sandi default <code translate="no">root</code> segera setelah inisialisasi dan batasi penggunaannya hanya untuk tugas-tugas administratif. Hindari menggunakan atau berbagi akun root untuk operasi rutin. Sebaliknya, buatlah pengguna dan peran khusus untuk akses sehari-hari untuk mengurangi risiko dan meningkatkan akuntabilitas.</p>
<p><strong>2. Mengisolasi instance Milvus secara fisik di seluruh lingkungan</strong></p>
<p>Menerapkan instance Milvus yang terpisah untuk pengembangan, pementasan, dan produksi. Isolasi fisik memberikan batas keamanan yang lebih kuat daripada kontrol akses logis saja dan secara signifikan mengurangi risiko kesalahan lintas lingkungan.</p>
<p><strong>3. Ikuti prinsip hak istimewa yang paling sedikit</strong></p>
<p>Berikan hanya izin yang diperlukan untuk setiap peran:</p>
<ul>
<li><p><strong>Lingkungan pengembangan:</strong> izin bisa lebih longgar untuk mendukung iterasi dan pengujian</p></li>
<li><p><strong>Lingkungan produksi:</strong> izin harus dibatasi secara ketat pada apa yang diperlukan</p></li>
<li><p><strong>Audit rutin:</strong> tinjau izin yang ada secara berkala untuk memastikan bahwa izin tersebut masih diperlukan</p></li>
</ul>
<p><strong>4. Secara aktif mencabut izin ketika tidak lagi diperlukan</strong></p>
<p>Kontrol akses bukanlah pengaturan sekali jadi-ini membutuhkan pemeliharaan berkelanjutan. Cabut peran dan hak istimewa dengan segera ketika pengguna, layanan, atau tanggung jawab berubah. Hal ini mencegah izin yang tidak terpakai terakumulasi dari waktu ke waktu dan menjadi risiko keamanan yang tersembunyi.</p>
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
    </button></h2><p>Mengonfigurasi kontrol akses di Milvus tidaklah rumit, tetapi sangat penting untuk mengoperasikan sistem dengan aman dan andal dalam produksi. Dengan model RBAC yang dirancang dengan baik, Anda bisa:</p>
<ul>
<li><p><strong>Mengurangi risiko</strong> dengan mencegah operasi yang tidak disengaja atau merusak</p></li>
<li><p><strong>Meningkatkan keamanan</strong> dengan memberlakukan akses yang paling tidak memiliki hak istimewa ke data vektor</p></li>
<li><p><strong>Menstandarkan operasi</strong> melalui pemisahan tanggung jawab yang jelas</p></li>
<li><p>Melakukan penskalaan<strong>dengan percaya diri</strong>, meletakkan fondasi untuk penerapan multi-penyewa dan skala besar</p></li>
</ul>
<p>Kontrol akses bukanlah fitur opsional atau tugas sekali pakai. Ini adalah bagian mendasar untuk mengoperasikan Milvus dengan aman dalam jangka panjang.</p>
<p>👉 Mulailah membangun garis dasar keamanan yang solid dengan <a href="https://milvus.io/docs/rbac.md">RBAC</a> untuk penerapan Milvus Anda.</p>
<p>Ada pertanyaan atau ingin mendalami fitur Milvus terbaru? Bergabunglah dengan<a href="https://discord.com/invite/8uyFbECzPX"> saluran Discord</a> kami atau ajukan pertanyaan di<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Anda juga dapat memesan sesi tatap muka selama 20 menit untuk mendapatkan wawasan, panduan, dan jawaban atas pertanyaan Anda melalui<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
