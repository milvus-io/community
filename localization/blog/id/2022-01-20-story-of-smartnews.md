---
id: 2022-01-20-story-of-smartnews.md
title: Kisah SmartNews - dari Pengguna Milvus menjadi Kontributor Aktif
author: Milvus
date: 2022-01-20T00:00:00.000Z
desc: >-
  Pelajari tentang kisah SmartNews, baik sebagai pengguna maupun kontributor
  Milvus.
cover: assets.zilliz.com/Smartnews_user_to_contributor_f219e6e008.png
tag: Scenarios
---
<p>Artikel ini diterjemahkan oleh <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
<p>Informasi ada di mana-mana dalam kehidupan kita. Meta (sebelumnya dikenal sebagai Facebook), Instagram, Twitter, dan platform media sosial lainnya membuat aliran informasi menjadi semakin banyak. Oleh karena itu, mesin yang menangani aliran informasi seperti itu telah menjadi hal yang wajib ada di sebagian besar arsitektur sistem. Namun, sebagai pengguna platform media sosial dan aplikasi yang relevan, saya yakin Anda pasti pernah merasa terganggu dengan duplikasi artikel, berita, meme, dan lainnya. Paparan terhadap konten duplikat menghambat proses pencarian informasi dan menyebabkan pengalaman pengguna yang buruk.</p>
<p>Untuk produk yang berurusan dengan aliran informasi, merupakan prioritas tinggi bagi para pengembang untuk menemukan pemroses data yang fleksibel yang dapat diintegrasikan dengan mulus ke dalam arsitektur sistem untuk menduplikasi berita atau iklan yang sama.</p>
<p><a href="https://www.smartnews.com/en/">SmartNews</a>, yang bernilai <a href="https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/">2 miliar dolar AS</a>, adalah perusahaan aplikasi berita yang paling bernilai tinggi di AS. Secara nyata, perusahaan ini dulunya adalah pengguna Milvus, sebuah basis data vektor sumber terbuka, tetapi kemudian berubah menjadi kontributor aktif untuk proyek Milvus.</p>
<p>Artikel ini berbagi cerita tentang SmartNews dan menjelaskan mengapa mereka memutuskan untuk memberikan kontribusi pada proyek Milvus.</p>
<h2 id="An-overview-of-SmartNews" class="common-anchor-header">Gambaran umum tentang SmartNews<button data-href="#An-overview-of-SmartNews" class="anchor-icon" translate="no">
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
    </button></h2><p>SmartNews, yang didirikan pada tahun 2012, berkantor pusat di Tokyo, Jepang. Aplikasi berita yang dikembangkan oleh SmartNews selalu menduduki <a href="https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9">peringkat teratas</a> di pasar Jepang. SmartNews adalah aplikasi berita dengan <a href="https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/">pertumbuhan tercepat</a> dan juga memiliki <a href="https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/">viskositas pengguna yang tinggi</a> di pasar Amerika Serikat. Menurut statistik dari <a href="https://www.appannie.com/en/">APP Annie</a>, durasi sesi rata-rata bulanan SmartNews menduduki peringkat pertama di antara semua aplikasi berita pada akhir Juli 2021, lebih besar dari akumulasi durasi sesi AppleNews dan Google News.</p>
<p>Dengan pertumbuhan basis pengguna dan viskositas yang cepat, SmartNews harus menghadapi lebih banyak tantangan dalam hal mekanisme rekomendasi dan algoritme AI. Tantangan tersebut termasuk memanfaatkan fitur diskrit yang masif dalam machine learning (ML) berskala besar, mempercepat kueri data tak terstruktur dengan pencarian kemiripan vektor, dan masih banyak lagi.</p>
<p>Pada awal tahun 2021, tim algoritma iklan dinamis di SmartNews mengirimkan permintaan kepada tim infrastruktur AI bahwa fungsi penarikan dan kueri iklan perlu dioptimalkan. Setelah dua bulan penelitian, insinyur infrastruktur AI, Shu, memutuskan untuk menggunakan Milvus, database vektor sumber terbuka yang mendukung banyak indeks dan metrik kesamaan serta pembaruan data online. Milvus dipercaya oleh lebih dari seribu organisasi di seluruh dunia.</p>
<h2 id="Advertisement-recommendation-powered-by-vector-similarity-search" class="common-anchor-header">Rekomendasi iklan yang didukung oleh pencarian kemiripan vektor<button data-href="#Advertisement-recommendation-powered-by-vector-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Basis data vektor sumber terbuka Milvus diadopsi dalam sistem Iklan SmartNews untuk mencocokkan dan merekomendasikan iklan dinamis dari kumpulan data berskala 10 juta kepada para penggunanya. Dengan demikian, SmartNews dapat membuat hubungan pemetaan antara dua dataset yang sebelumnya tidak dapat dicocokkan - data pengguna dan data iklan. Pada kuartal kedua 2021, Shu berhasil menerapkan Milvus 1.0 di Kubernetes. Pelajari lebih lanjut tentang cara <a href="https://milvus.io/docs">menggunakan Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image1_2a88ed162f.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>Setelah penerapan Milvus 1.0 berhasil, proyek pertama yang menggunakan Milvus adalah proyek penarikan iklan yang diprakarsai oleh tim Iklan di SmartNews. Pada tahap awal, dataset iklan berada pada skala jutaan. Sementara itu, latensi P99 dikontrol secara ketat dalam waktu kurang dari 10 milidetik.</p>
<p>Pada bulan Juni 2021, Shu dan rekan-rekannya di tim algoritme menerapkan Milvus ke lebih banyak skenario bisnis dan mencoba agregasi data serta pembaruan data/indeks online secara real time.</p>
<p>Saat ini, Milvus, basis data vektor sumber terbuka telah digunakan dalam berbagai skenario bisnis di SmartNews, termasuk rekomendasi iklan.</p>
<h2 id="From-a-user-to-an-active-contributor" class="common-anchor-header"><strong>Dari pengguna menjadi kontributor aktif</strong><button data-href="#From-a-user-to-an-active-contributor" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika mengintegrasikan Milvus ke dalam arsitektur produk Smartnews, Shu dan pengembang lainnya mengajukan permintaan fungsi-fungsi seperti memuat ulang, TTL (time-to-live) item, pembaruan/penggantian item, dan banyak lagi. Fungsi-fungsi ini juga diinginkan oleh banyak pengguna di komunitas Milvus. Oleh karena itu, Dennis Zhao, kepala tim infrastruktur AI di SmartNews memutuskan untuk mengembangkan dan menyumbangkan fungsi hot reload ke komunitas. Dennis percaya bahwa "Tim SmartNews telah mendapatkan manfaat dari komunitas Milvus, oleh karena itu, kami lebih dari bersedia untuk berkontribusi jika kami memiliki sesuatu untuk dibagikan kepada komunitas."</p>
<p>Pemuatan ulang data mendukung pengeditan kode saat menjalankan kode. Dengan bantuan data reload, para pengembang tidak perlu lagi berhenti di breakpoint atau memulai ulang aplikasi. Sebaliknya, mereka dapat mengedit kode secara langsung dan melihat hasilnya secara real time.</p>
<p>Pada akhir Juli lalu, Yusup, engineer di SmartNews mengusulkan sebuah ide untuk menggunakan <a href="https://milvus.io/docs/v2.0.x/collection_alias.md#Collection-Alias">collection alias</a> untuk melakukan hot reload.</p>
<p>Membuat alias koleksi mengacu pada menentukan nama alias untuk sebuah koleksi. Sebuah koleksi dapat memiliki beberapa alias. Namun, sebuah alias berhubungan dengan maksimal satu koleksi. Secara sederhana, analogikan sebuah koleksi dengan sebuah loker. Loker, seperti halnya koleksi, memiliki nomor dan posisinya sendiri, yang tidak akan berubah. Namun demikian, Anda selalu dapat memasukkan dan mengeluarkan benda yang berbeda dari loker. Demikian pula, nama koleksi adalah tetap, tetapi data dalam koleksi bersifat dinamis. Anda selalu dapat menyisipkan atau menghapus vektor dalam koleksi, karena penghapusan data didukung dalam <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">versi</a> Milvus <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200-PreGA">pra-GA</a>.</p>
<p>Dalam kasus bisnis iklan SmartNews, hampir 100 juta vektor disisipkan atau diperbarui saat vektor iklan dinamis baru dihasilkan. Ada beberapa solusi untuk hal ini:</p>
<ul>
<li>Solusi 1: hapus data lama terlebih dahulu dan masukkan data baru.</li>
<li>Solusi 2: membuat koleksi baru untuk data baru.</li>
<li>Solusi 3: gunakan alias koleksi.</li>
</ul>
<p>Untuk solusi 1, salah satu kekurangan yang paling jelas adalah bahwa hal ini sangat memakan waktu, terutama ketika kumpulan data yang akan diperbarui sangat besar. Biasanya diperlukan waktu berjam-jam untuk memperbarui dataset dalam skala 100 juta.</p>
<p>Sedangkan untuk solusi 2, masalahnya adalah bahwa koleksi baru tidak segera tersedia untuk pencarian. Dengan kata lain, koleksi tidak dapat dicari saat dimuat. Ditambah lagi, Milvus tidak mengizinkan dua koleksi menggunakan nama koleksi yang sama. Beralih ke koleksi baru akan selalu mengharuskan pengguna untuk mengubah kode sisi klien secara manual. Dengan kata lain, pengguna harus merevisi nilai parameter <code translate="no">collection_name</code> setiap kali mereka perlu berpindah antar koleksi.</p>
<p>Solusi 3 adalah solusi terbaik. Anda hanya perlu memasukkan data baru ke dalam koleksi baru dan menggunakan alias koleksi. Dengan demikian, Anda hanya perlu menukar alias koleksi setiap kali Anda perlu berpindah koleksi untuk melakukan pencarian. Anda tidak perlu upaya ekstra untuk merevisi kode. Solusi ini menyelamatkan Anda dari masalah yang disebutkan dalam dua solusi sebelumnya.</p>
<p>Yusup memulai dari permintaan ini dan membantu seluruh tim SmartNews memahami arsitektur Milvus. Setelah satu setengah bulan, proyek Milvus menerima PR tentang hot reload dari Yusup. Dan kemudian, fungsi ini secara resmi tersedia bersamaan dengan rilis Milvus 2.0.0-RC7.</p>
<p>Saat ini, tim infrastruktur AI sedang memimpin untuk menerapkan Milvus 2.0 dan memigrasi semua data secara bertahap dari Milvus 1.0 ke 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image2_96c064a627.png" alt="img_collection alias" class="doc-image" id="img_collection-alias" />
   </span> <span class="img-wrapper"> <span>img_collection alias</span> </span></p>
<p>Dukungan untuk collection alias dapat sangat meningkatkan pengalaman pengguna, terutama bagi perusahaan-perusahaan Internet besar dengan volume permintaan pengguna yang besar. Chenglong Li, insinyur data dari komunitas Milvus, yang membantu membangun jembatan antara Milvus dan Smartnews, mengatakan, "Fungsi collection alias muncul dari permintaan bisnis nyata dari SmartNews, pengguna Milvus. Dan SmartNews menyumbangkan kodenya kepada komunitas Milvus. Tindakan timbal balik ini merupakan contoh yang bagus dari semangat open-source: dari komunitas dan untuk komunitas. Kami berharap dapat melihat lebih banyak lagi kontributor seperti SmartNews dan bersama-sama membangun komunitas Milvus yang lebih makmur."</p>
<p>"Saat ini, sebagian dari bisnis periklanan telah mengadopsi Milvus sebagai basis data vektor offline. Perilisan resmi Mivus 2.0 semakin dekat, dan kami berharap dapat menggunakan Milvus untuk membangun sistem yang lebih handal dan menyediakan layanan real-time untuk lebih banyak skenario bisnis." kata Dennis.</p>
<blockquote>
<p>Pembaruan: Milvus 2.0 kini telah tersedia untuk umum! <a href="/blog/id/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Pelajari lebih lanjut</a></p>
</blockquote>
