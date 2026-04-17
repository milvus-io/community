---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: Bagaimana Milvus Menyeimbangkan Beban Kueri di Seluruh Node?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: Milvus 2.0 mendukung keseimbangan beban otomatis di seluruh node kueri.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Gambar Sampul Binlog</span> </span></p>
<p>Oleh <a href="https://github.com/xige-16">Xi Ge</a>.</p>
<p>Dalam artikel blog sebelumnya, kami telah memperkenalkan fungsi Penghapusan, Bitset, dan Pemadatan di Milvus 2.0 secara berturut-turut. Sebagai penutup dari seri ini, kami ingin berbagi desain di balik Load Balance, sebuah fungsi penting dalam cluster terdistribusi Milvus.</p>
<h2 id="Implementation" class="common-anchor-header">Implementasi<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika jumlah dan ukuran segmen yang disangga di node kueri berbeda, kinerja pencarian di seluruh node kueri juga dapat bervariasi. Kasus terburuk dapat terjadi ketika beberapa node kueri kelelahan mencari data dalam jumlah besar, tetapi node kueri yang baru dibuat tetap menganggur karena tidak ada segmen yang didistribusikan kepada mereka, menyebabkan pemborosan sumber daya CPU yang sangat besar dan penurunan besar dalam kinerja pencarian.</p>
<p>Untuk menghindari keadaan seperti itu, koordinator kueri (query coord) diprogram untuk mendistribusikan segmen secara merata ke setiap node kueri sesuai dengan penggunaan RAM node. Oleh karena itu, sumber daya CPU dikonsumsi secara merata di seluruh node, sehingga secara signifikan meningkatkan kinerja pencarian.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">Memicu keseimbangan beban otomatis</h3><p>Menurut nilai default dari konfigurasi <code translate="no">queryCoord.balanceIntervalSeconds</code>, koordinat kueri memeriksa penggunaan RAM (dalam persentase) dari semua node kueri setiap 60 detik. Jika salah satu dari kondisi berikut ini terpenuhi, koordinat kueri mulai menyeimbangkan beban kueri di seluruh node kueri:</p>
<ol>
<li>Penggunaan RAM dari node kueri mana pun dalam klaster lebih besar dari <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (default: 90);</li>
<li>Atau nilai absolut dari perbedaan penggunaan RAM dari dua node kueri lebih besar dari <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (default: 30).</li>
</ol>
<p>Setelah segmen ditransfer dari node kueri sumber ke node kueri tujuan, segmen tersebut juga harus memenuhi kedua kondisi berikut:</p>
<ol>
<li>Penggunaan RAM node kueri tujuan tidak lebih besar dari <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (default: 90);</li>
<li>Nilai absolut dari perbedaan penggunaan RAM node kueri sumber dan tujuan setelah penyeimbangan beban lebih kecil daripada sebelum penyeimbangan beban.</li>
</ol>
<p>Dengan kondisi di atas terpenuhi, koordinat kueri melanjutkan untuk menyeimbangkan beban kueri di seluruh node.</p>
<h2 id="Load-balance" class="common-anchor-header">Keseimbangan beban<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>Ketika keseimbangan beban dipicu, koordinat kueri pertama-tama memuat segmen target ke node kueri tujuan. Kedua node kueri mengembalikan hasil pencarian dari segmen target pada setiap permintaan pencarian pada saat ini untuk menjamin kelengkapan hasil.</p>
<p>Setelah node kueri tujuan berhasil memuat segmen target, koordinat kueri menerbitkan <code translate="no">sealedSegmentChangeInfo</code> ke Saluran Kueri. Seperti yang ditunjukkan di bawah ini, <code translate="no">onlineNodeID</code> dan <code translate="no">onlineSegmentIDs</code> menunjukkan simpul kueri yang memuat segmen dan segmen yang dimuat masing-masing, dan <code translate="no">offlineNodeID</code> dan <code translate="no">offlineSegmentIDs</code> menunjukkan simpul kueri yang perlu melepaskan segmen dan segmen yang akan dilepaskan masing-masing.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p>Setelah menerima <code translate="no">sealedSegmentChangeInfo</code>, node kueri sumber kemudian melepaskan segmen target.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>Alur Kerja Keseimbangan Beban</span> </span></p>
<p>Seluruh proses berhasil ketika node kueri sumber melepaskan segmen target. Dengan menyelesaikannya, beban kueri diatur seimbang di seluruh node kueri, yang berarti penggunaan RAM semua node kueri tidak lebih besar dari <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code>, dan nilai absolut dari perbedaan penggunaan RAM node kueri sumber dan tujuan setelah penyeimbangan beban lebih kecil daripada sebelum penyeimbangan beban.</p>
<h2 id="Whats-next" class="common-anchor-header">Apa selanjutnya?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalam blog seri fitur baru 2.0, kami bertujuan untuk menjelaskan desain fitur-fitur baru. Baca lebih lanjut dalam seri blog ini!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Bagaimana Milvus Menghapus Data Streaming dalam Cluster Terdistribusi</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Bagaimana Cara Memadatkan Data di Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Bagaimana Milvus Menyeimbangkan Beban Kueri di Seluruh Node?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Bagaimana Bitset Mengaktifkan Keserbagunaan Pencarian Kesamaan Vektor</a></li>
</ul>
<p>Ini adalah bagian akhir dari seri blog fitur baru Milvus 2.0. Setelah seri ini, kami merencanakan seri baru Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>, yang memperkenalkan arsitektur dasar Milvus 2.0. Mohon untuk terus mengikuti perkembangannya.</p>
