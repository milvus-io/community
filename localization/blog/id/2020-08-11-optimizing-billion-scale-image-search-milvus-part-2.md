---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: Sistem pencarian berdasarkan gambar generasi kedua
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: >-
  Kasus pengguna yang memanfaatkan Milvus untuk membangun sistem pencarian
  kemiripan gambar untuk bisnis di dunia nyata.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>Perjalanan Mengoptimalkan Pencarian Gambar Berskala Miliaran (2/2)</custom-h1><p>Artikel ini adalah bagian kedua dari <strong>Perjalanan Mengoptimalkan Pencarian Gambar Berskala Miliaran oleh UPYUN</strong>. Jika Anda melewatkan bagian pertama, klik <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">di sini</a>.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">Sistem pencarian berdasarkan gambar generasi kedua<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Sistem pencarian berdasarkan gambar generasi kedua secara teknis memilih solusi CNN + Milvus. Sistem ini didasarkan pada vektor fitur dan memberikan dukungan teknis yang lebih baik.</p>
<h2 id="Feature-extraction" class="common-anchor-header">Ekstraksi fitur<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>Di bidang visi komputer, penggunaan kecerdasan buatan telah menjadi arus utama. Demikian pula, ekstraksi fitur dari sistem pencarian berdasarkan gambar generasi kedua menggunakan jaringan saraf konvolusi (CNN) sebagai teknologi yang mendasarinya</p>
<p>Istilah CNN sulit untuk dipahami. Di sini kami fokus untuk menjawab dua pertanyaan:</p>
<ul>
<li>Apa yang dapat dilakukan CNN?</li>
<li>Mengapa saya dapat menggunakan CNN untuk pencarian gambar?</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>Ada banyak kompetisi di bidang AI dan klasifikasi gambar adalah salah satu yang paling penting. Tugas klasifikasi gambar adalah menentukan apakah konten gambar tersebut tentang kucing, anjing, apel, pir, atau jenis objek lainnya.</p>
<p>Apa yang bisa dilakukan CNN? CNN dapat mengekstrak fitur dan mengenali objek. Ia mengekstrak fitur dari berbagai dimensi dan mengukur seberapa dekat fitur gambar dengan fitur kucing atau anjing. Kita dapat memilih yang paling dekat sebagai hasil identifikasi kita yang menunjukkan apakah konten gambar tertentu adalah tentang kucing, anjing, atau yang lainnya.</p>
<p>Apa hubungan antara fungsi identifikasi objek CNN dan pencarian berdasarkan gambar? Yang kita inginkan bukanlah hasil identifikasi akhir, tetapi vektor fitur yang diekstrak dari beberapa dimensi. Vektor fitur dari dua gambar dengan konten yang sama harus dekat.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">Model CNN mana yang harus saya gunakan?</h3><p>Jawabannya adalah VGG16. Mengapa memilihnya? Pertama, VGG16 memiliki kemampuan generalisasi yang baik, yaitu sangat fleksibel. Kedua, vektor fitur yang diekstrak oleh VGG16 memiliki 512 dimensi. Jika hanya ada sedikit dimensi, keakuratannya bisa terpengaruh. Jika ada terlalu banyak dimensi, biaya penyimpanan dan penghitungan vektor fitur ini relatif tinggi.</p>
<p>Menggunakan CNN untuk mengekstrak fitur gambar adalah solusi utama. Kita dapat menggunakan VGG16 sebagai model dan Keras + TensorFlow untuk implementasi teknis. Berikut adalah contoh resmi dari Keras:</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>Fitur yang diekstrak di sini adalah vektor fitur.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. Normalisasi</h3><p>Untuk memudahkan operasi selanjutnya, kita sering melakukan normalisasi fitur:</p>
<p>Apa yang digunakan selanjutnya juga adalah <code translate="no">norm_feat</code> yang dinormalisasi.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. Deskripsi gambar</h3><p>Gambar dimuat menggunakan metode <code translate="no">image.load_img</code> dari <code translate="no">keras.preprocessing</code>:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>Sebenarnya, ini adalah metode TensorFlow yang dipanggil oleh Keras. Untuk detailnya, lihat dokumentasi TensorFlow. Objek gambar akhir sebenarnya adalah sebuah contoh gambar PIL (PIL yang digunakan oleh TensorFlow).</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. Konversi byte</h3><p>Secara praktis, konten gambar sering kali ditransmisikan melalui jaringan. Oleh karena itu, alih-alih memuat gambar dari path, kami lebih memilih untuk mengubah data byte langsung menjadi objek gambar, yaitu PIL Images:</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>Img di atas sama dengan hasil yang diperoleh dengan metode image.load_img. Ada dua hal yang perlu diperhatikan:</p>
<ul>
<li>Anda harus melakukan konversi RGB.</li>
<li>Anda harus mengubah ukuran (mengubah ukuran adalah parameter kedua dari <code translate="no">load_img method</code>).</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. Pemrosesan batas hitam</h3><p>Gambar, seperti tangkapan layar, kadang-kadang mungkin memiliki beberapa batas hitam. Batas hitam ini tidak memiliki nilai praktis dan menyebabkan banyak gangguan. Karena alasan ini, menghilangkan batas hitam juga merupakan praktik yang umum dilakukan.</p>
<p>Batas hitam pada dasarnya adalah baris atau kolom piksel di mana semua pikselnya adalah (0, 0, 0) (gambar RGB). Untuk menghilangkan batas hitam adalah menemukan baris atau kolom ini dan menghapusnya. Ini sebenarnya adalah perkalian matriks 3-D di NumPy.</p>
<p>Contoh menghapus batas hitam horizontal:</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>Ini adalah hal yang ingin saya bicarakan tentang penggunaan CNN untuk mengekstrak fitur gambar dan mengimplementasikan pemrosesan gambar lainnya. Sekarang mari kita lihat mesin pencari vektor.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">Mesin pencari vektor<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Masalah mengekstraksi vektor fitur dari gambar sudah terpecahkan. Kemudian masalah yang tersisa adalah:</p>
<ul>
<li>Bagaimana cara menyimpan vektor fitur?</li>
<li>Bagaimana cara menghitung kemiripan vektor fitur, yaitu, bagaimana cara mencari? Mesin pencari vektor sumber terbuka Milvus dapat menyelesaikan kedua masalah ini. Sejauh ini, Milvus telah berjalan dengan baik di lingkungan produksi kami.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">Milvus, mesin pencari vektor<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Mengekstrak vektor fitur dari sebuah gambar masih jauh dari cukup. Kita juga perlu mengelola vektor fitur ini secara dinamis (penambahan, penghapusan, dan pembaruan), menghitung kemiripan vektor, dan mengembalikan data vektor dalam rentang tetangga terdekat. Mesin pencari vektor sumber terbuka Milvus melakukan tugas-tugas ini dengan cukup baik.</p>
<p>Bagian selanjutnya dari artikel ini akan menjelaskan praktik-praktik spesifik dan hal-hal yang perlu diperhatikan.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. Persyaratan untuk CPU</h3><p>Untuk menggunakan Milvus, CPU Anda harus mendukung set instruksi avx2. Untuk sistem Linux, gunakan perintah berikut untuk memeriksa set instruksi mana yang didukung oleh CPU Anda:</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>Maka Anda akan mendapatkan sesuatu seperti:</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>Apa yang ditunjukkan oleh flag berikut adalah set instruksi yang didukung oleh CPU Anda. Tentu saja, ini lebih dari yang saya butuhkan. Saya hanya ingin melihat apakah set instruksi tertentu, seperti avx2, didukung. Cukup tambahkan grep untuk menyaringnya:</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>Jika tidak ada hasil yang dikembalikan, itu berarti set instruksi tertentu tidak didukung. Anda perlu mengganti mesin Anda.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. Perencanaan kapasitas</h3><p>Perencanaan kapasitas adalah pertimbangan pertama kita ketika kita mendesain sebuah sistem. Berapa banyak data yang perlu kita simpan? Berapa banyak memori dan ruang disk yang dibutuhkan oleh data tersebut?</p>
<p>Mari kita hitung dengan cepat. Setiap dimensi dari sebuah vektor adalah float32. Tipe float32 membutuhkan 4 Byte. Maka sebuah vektor dengan 512 dimensi membutuhkan 2 KB penyimpanan. Dengan cara yang sama:</p>
<ul>
<li>Seribu vektor 512 dimensi membutuhkan penyimpanan 2 MB.</li>
<li>Satu juta vektor 512 dimensi membutuhkan penyimpanan 2 GB.</li>
<li>10 juta vektor 512 dimensi membutuhkan penyimpanan 20 GB.</li>
<li>100 juta vektor 512 dimensi membutuhkan penyimpanan 200 GB.</li>
<li>Satu miliar vektor 512 dimensi membutuhkan penyimpanan 2 TB.</li>
</ul>
<p>Jika kita ingin menyimpan semua data dalam memori, maka sistem membutuhkan setidaknya kapasitas memori yang sesuai.</p>
<p>Anda disarankan untuk menggunakan alat penghitung ukuran resmi: Alat pengukur ukuran Milvus.</p>
<p>Sebenarnya memori kita mungkin tidak sebesar itu. (Tidak masalah jika Anda tidak memiliki cukup memori. Milvus secara otomatis memasukkan data ke dalam disk). Selain data vektor asli, kita juga perlu mempertimbangkan penyimpanan data lain seperti log.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. Konfigurasi sistem</h3><p>Untuk informasi lebih lanjut tentang konfigurasi sistem, lihat dokumentasi Milvus:</p>
<ul>
<li>Konfigurasi server Milvus: https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. Desain basis data</h3><p><strong>Koleksi &amp; Partisi</strong></p>
<ul>
<li>Koleksi juga dikenal sebagai tabel.</li>
<li>Partisi mengacu pada partisi-partisi di dalam koleksi.</li>
</ul>
<p>Implementasi yang mendasari partisi sebenarnya sama dengan koleksi, kecuali bahwa partisi berada di bawah koleksi. Tetapi dengan partisi, pengaturan data menjadi lebih fleksibel. Kita juga dapat melakukan query pada partisi tertentu di dalam koleksi untuk mendapatkan hasil query yang lebih baik.</p>
<p>Berapa banyak koleksi dan partisi yang dapat kita miliki? Informasi dasar mengenai koleksi dan partisi ada di Metadata. Milvus menggunakan SQLite (integrasi internal Milvus) atau MySQL (membutuhkan koneksi eksternal) untuk manajemen metadata internal. Jika Anda menggunakan SQLite secara default untuk mengelola Metadata, Anda akan mengalami penurunan kinerja yang parah ketika jumlah koleksi dan partisi terlalu besar. Oleh karena itu, jumlah total koleksi dan partisi tidak boleh melebihi 50.000 (Milvus 0.8.0 akan membatasi jumlah ini menjadi 4.096). Jika Anda ingin mengatur jumlah yang lebih besar, Anda disarankan untuk menggunakan MySQL melalui koneksi eksternal.</p>
<p>Struktur data yang didukung oleh koleksi dan partisi Milvus sangat sederhana, yaitu <code translate="no">ID + vector</code>. Dengan kata lain, hanya ada dua kolom dalam tabel: ID dan data vektor.</p>
<p><strong>Catatan:</strong></p>
<ul>
<li>ID harus berupa bilangan bulat.</li>
<li>Kita perlu memastikan bahwa ID adalah unik di dalam koleksi, bukan di dalam partisi.</li>
</ul>
<p><strong>Pemfilteran bersyarat</strong></p>
<p>Ketika kita menggunakan basis data tradisional, kita dapat menentukan nilai field sebagai kondisi penyaringan. Meskipun Milvus tidak melakukan penyaringan dengan cara yang persis sama, kita dapat mengimplementasikan penyaringan bersyarat sederhana dengan menggunakan koleksi dan partisi. Sebagai contoh, kita memiliki sejumlah besar data gambar dan data tersebut dimiliki oleh pengguna tertentu. Kemudian kita dapat membagi data ke dalam partisi berdasarkan pengguna. Oleh karena itu, menggunakan pengguna sebagai kondisi filter sebenarnya menentukan partisi.</p>
<p><strong>Data terstruktur dan pemetaan vektor</strong></p>
<p>Milvus hanya mendukung struktur data ID + vektor. Namun dalam skenario bisnis, yang kita butuhkan adalah data terstruktur yang mengandung makna bisnis. Dengan kata lain, kita perlu menemukan data terstruktur melalui vektor. Oleh karena itu, kita perlu mempertahankan hubungan pemetaan antara data terstruktur dan vektor melalui ID.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>Memilih indeks</strong></p>
<p>Anda dapat merujuk ke artikel berikut:</p>
<ul>
<li>Jenis-jenis indeks: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>Cara memilih indeks: https://medium.com/@milvusio/cara-memilih-indeks-di-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. Memproses hasil pencarian</h3><p>Hasil pencarian Milvus adalah kumpulan ID + jarak:</p>
<ul>
<li>ID: ID dalam sebuah koleksi.</li>
<li>Jarak: nilai jarak 0 ~ 1 menunjukkan tingkat kemiripan; semakin kecil nilainya, semakin mirip kedua vektor.</li>
</ul>
<p><strong>Memfilter data yang ID-nya -1</strong></p>
<p>Ketika jumlah koleksi terlalu sedikit, hasil pencarian mungkin berisi data yang ID-nya -1. Kita perlu menyaringnya sendiri.</p>
<p><strong>Penomoran halaman</strong></p>
<p>Pencarian untuk vektor sangat berbeda. Hasil kueri diurutkan berdasarkan urutan kemiripan, dan hasil yang paling mirip (topK) dipilih (topK ditentukan oleh pengguna pada saat kueri).</p>
<p>Milvus tidak mendukung pagination. Kita perlu mengimplementasikan fungsi pagination sendiri jika kita membutuhkannya untuk bisnis. Sebagai contoh, jika kita memiliki sepuluh hasil di setiap halaman dan hanya ingin menampilkan halaman ketiga, kita perlu menentukan bahwa topK = 30 dan hanya mengembalikan sepuluh hasil terakhir.</p>
<p><strong>Ambang batas kemiripan untuk bisnis</strong></p>
<p>Jarak antara vektor dua gambar adalah antara 0 dan 1. Jika kita ingin memutuskan apakah dua gambar mirip dalam skenario bisnis tertentu, kita perlu menentukan ambang batas dalam kisaran ini. Dua gambar serupa jika jaraknya lebih kecil dari ambang batas, atau sangat berbeda satu sama lain jika jaraknya lebih besar dari ambang batas. Anda perlu menyesuaikan ambang batas untuk memenuhi kebutuhan bisnis Anda.</p>
<blockquote>
<p>Artikel ini ditulis oleh rifewang, pengguna Milvus dan insinyur perangkat lunak UPYUN. Jika Anda menyukai artikel ini, selamat datang untuk menyapa di https://github.com/rifewang.</p>
</blockquote>
