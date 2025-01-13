---
id: >-
  semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
title: >-
  Pencarian Semantik vs Pencarian Teks Lengkap: Mana yang Harus Saya Pilih di
  Milvus 2.5?
author: 'David Wang, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Semantic_Search_v_s_Full_Text_Search_5d93431c56.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
---
<p>Milvus, database vektor berkinerja tinggi yang terkemuka, telah lama mengkhususkan diri dalam pencarian semantik menggunakan penyematan vektor dari model pembelajaran mendalam. Teknologi ini mendukung aplikasi AI seperti Retrieval-Augmented Generation (RAG), mesin pencari, dan sistem rekomendasi. Dengan meningkatnya popularitas RAG dan aplikasi pencarian teks lainnya, komunitas telah mengakui keuntungan dari menggabungkan metode pencocokan teks tradisional dengan pencarian semantik, yang dikenal sebagai pencarian hibrida. Pendekatan ini sangat bermanfaat dalam skenario yang sangat bergantung pada pencocokan kata kunci. Untuk memenuhi kebutuhan ini, Milvus 2.5 memperkenalkan fungsionalitas pencarian teks lengkap (FTS) dan mengintegrasikannya dengan kemampuan pencarian vektor dan pencarian hibrida yang telah tersedia sejak versi 2.4, menciptakan sinergi yang kuat.</p>
<p>Pencarian hibrida adalah metode yang menggabungkan hasil dari beberapa jalur pencarian. Pengguna dapat mencari bidang data yang berbeda dengan berbagai cara, kemudian menggabungkan dan mengurutkan hasilnya untuk mendapatkan hasil yang komprehensif. Dalam skenario RAG yang populer saat ini, pendekatan hibrida yang umum digunakan menggabungkan pencarian semantik dengan pencarian teks lengkap. Secara khusus, hal ini melibatkan penggabungan hasil dari pencarian semantik berbasis sematan padat dan pencocokan leksikal berbasis BM25 menggunakan RRF (Reciprocal Rank Fusion) untuk meningkatkan pemeringkatan hasil.</p>
<p>Dalam artikel ini, kami akan mendemonstrasikan hal ini dengan menggunakan dataset yang disediakan oleh Anthropic, yang terdiri dari potongan kode dari sembilan repositori kode. Ini menyerupai kasus penggunaan RAG yang populer: bot pengkodean dengan bantuan AI. Karena data kode mengandung banyak definisi, kata kunci, dan informasi lainnya, pencarian berbasis teks bisa sangat efektif dalam konteks ini. Sementara itu, model embedding padat yang dilatih pada kumpulan data kode yang besar dapat menangkap informasi semantik tingkat tinggi. Tujuan kami adalah untuk mengamati efek dari penggabungan kedua pendekatan ini melalui eksperimen.</p>
<p>Kami akan menganalisis kasus-kasus tertentu untuk mengembangkan pemahaman yang lebih jelas tentang pencarian hybrid. Sebagai dasar, kami akan menggunakan model embedding padat tingkat lanjut (voyage-2) yang dilatih pada sejumlah besar data kode. Kami kemudian akan memilih contoh-contoh di mana pencarian hibrida mengungguli hasil pencarian semantik dan teks lengkap (5 besar) untuk menganalisis karakteristik di balik kasus-kasus ini.</p>
<table>
<thead>
<tr><th style="text-align:center">Metode</th><th style="text-align:center">Lulus @ 5</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Pencarian Teks Lengkap</td><td style="text-align:center">0.7318</td></tr>
<tr><td style="text-align:center">Pencarian Semantik</td><td style="text-align:center">0.8096</td></tr>
<tr><td style="text-align:center">Pencarian Hibrida</td><td style="text-align:center">0.8176</td></tr>
<tr><td style="text-align:center">Penelusuran Hibrida (tambahkan kata henti)</td><td style="text-align:center">0.8418</td></tr>
</tbody>
</table>
<p>Selain menganalisis kualitas berdasarkan kasus per kasus, kami memperluas evaluasi kami dengan menghitung metrik Pass@5 di seluruh dataset. Metrik ini mengukur proporsi hasil relevan yang ditemukan dalam 5 hasil teratas dari setiap kueri. Temuan kami menunjukkan bahwa meskipun model penyematan canggih membentuk dasar yang kuat, mengintegrasikannya dengan penelusuran teks lengkap memberikan hasil yang lebih baik. Peningkatan lebih lanjut dapat dilakukan dengan memeriksa hasil BM25 dan menyempurnakan parameter untuk skenario tertentu, yang dapat menghasilkan peningkatan kinerja yang signifikan.</p>
<custom-h1>Diskusi</custom-h1><p>Kami memeriksa hasil spesifik yang diambil untuk tiga kueri penelusuran yang berbeda, membandingkan penelusuran semantik dan teks lengkap dengan penelusuran hibrida. Anda juga dapat melihat <a href="https://github.com/wxywb/milvus_fts_exps">kode lengkapnya di repositori ini</a>.</p>
<h2 id="Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="common-anchor-header">Kasus 1: <strong>Pencarian Hibrida Mengungguli Pencarian Semantik</strong><button data-href="#Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Kueri:</strong> Bagaimana file log dibuat?</p>
<p>Kueri ini bertujuan untuk menanyakan tentang pembuatan berkas log, dan jawaban yang benar adalah potongan kode Rust yang membuat berkas log. Dalam hasil pencarian semantik, kami melihat beberapa kode yang memperkenalkan file header log dan kode C++ untuk mendapatkan pencatat. Namun, kuncinya di sini adalah variabel "logfile". Pada hasil pencarian hibrida #hybrid 0, kami menemukan hasil yang relevan ini, yang secara alami berasal dari pencarian teks lengkap karena pencarian hibrida menggabungkan hasil pencarian semantik dan teks lengkap.</p>
<p>Selain hasil ini, kita dapat menemukan kode uji coba yang tidak terkait di #hybrid 2, terutama frasa yang diulang-ulang, "string panjang untuk menguji bagaimana hal itu ditangani." Hal ini membutuhkan pemahaman prinsip-prinsip di balik algoritme BM25 yang digunakan dalam pencarian teks lengkap. Pencarian teks lengkap bertujuan untuk mencocokkan kata-kata yang lebih jarang digunakan (karena kata-kata yang umum mengurangi keunikan teks dan menghambat diskriminasi objek). Misalkan kita melakukan analisis statistik pada sebuah korpus teks alami yang besar. Dalam hal ini, mudah untuk menyimpulkan bahwa "bagaimana" adalah kata yang sangat umum dan hanya berkontribusi sedikit terhadap skor relevansi. Namun, dalam kasus ini, kumpulan data terdiri dari kode, dan tidak banyak kemunculan kata "bagaimana" dalam kode tersebut, sehingga menjadikannya istilah pencarian utama dalam konteks ini.</p>
<p><strong>Kebenaran Dasar:</strong> Jawaban yang benar adalah kode Rust yang membuat file log.</p>
<pre><code translate="no" class="language-C++">use {
    crate::args::LogArgs,
    anyhow::{anyhow, Result},
    simplelog::{Config, LevelFilter, WriteLogger},
    std::fs::File,
};

pub struct Logger;

impl Logger {
    pub fn <span class="hljs-title function_">init</span><span class="hljs-params">(args: &amp;impl LogArgs)</span> -&gt; Result&lt;()&gt; {
        let filter: LevelFilter = args.log_level().into();
        <span class="hljs-keyword">if</span> filter != LevelFilter::Off {
            <span class="hljs-type">let</span> <span class="hljs-variable">logfile</span> <span class="hljs-operator">=</span> File::create(args.log_file())
                .map_err(|e| anyhow!(<span class="hljs-string">&quot;Failed to open log file: {e:}&quot;</span>))?;
            WriteLogger::init(filter, Config::<span class="hljs-keyword">default</span>(), logfile)
                .map_err(|e| anyhow!(<span class="hljs-string">&quot;Failed to initalize logger: {e:}&quot;</span>))?;
        }
        Ok(())
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Semantic-Search-Results" class="common-anchor-header">Hasil Pencarian Semantik</h3><pre><code translate="no" class="language-C++">##dense <span class="hljs-number">0</span> <span class="hljs-number">0.7745316028594971</span> 
<span class="hljs-comment">/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the &quot;License&quot;); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */</span>
#include <span class="hljs-string">&quot;logunit.h&quot;</span>
#include &lt;log4cxx/logger.h&gt;
#include &lt;log4cxx/simplelayout.h&gt;
#include &lt;log4cxx/fileappender.h&gt;
#include &lt;log4cxx/helpers/absolutetimedateformat.h&gt;



 ##dense <span class="hljs-number">1</span> <span class="hljs-number">0.769859254360199</span> 
        void simple()
        {
                LayoutPtr layout = LayoutPtr(<span class="hljs-built_in">new</span> SimpleLayout());
                AppenderPtr appender = FileAppenderPtr(<span class="hljs-built_in">new</span> FileAppender(layout, LOG4CXX_STR(<span class="hljs-string">&quot;output/simple&quot;</span>), <span class="hljs-literal">false</span>));
                root-&gt;addAppender(appender);
                common();

                LOGUNIT_ASSERT(Compare::compare(LOG4CXX_FILE(<span class="hljs-string">&quot;output/simple&quot;</span>), LOG4CXX_FILE(<span class="hljs-string">&quot;witness/simple&quot;</span>)));
        }

        std::<span class="hljs-type">string</span> createMessage(<span class="hljs-type">int</span> i, Pool &amp; pool)
        {
                std::<span class="hljs-type">string</span> msg(<span class="hljs-string">&quot;Message &quot;</span>);
                msg.<span class="hljs-built_in">append</span>(pool.itoa(i));
                <span class="hljs-keyword">return</span> msg;
        }

        void common()
        {
                <span class="hljs-type">int</span> i = <span class="hljs-number">0</span>;

                <span class="hljs-comment">// In the lines below, the logger names are chosen as an aid in</span>
                <span class="hljs-comment">// remembering their level values. In general, the logger names</span>
                <span class="hljs-comment">// have no bearing to level values.</span>
                LoggerPtr ERRlogger = Logger::getLogger(LOG4CXX_TEST_STR(<span class="hljs-string">&quot;ERR&quot;</span>));
                ERRlogger-&gt;setLevel(Level::getError());



 ##dense <span class="hljs-number">2</span> <span class="hljs-number">0.7591114044189453</span> 
                log4cxx::spi::LoggingEventPtr logEvt = std::make_shared&lt;log4cxx::spi::LoggingEvent&gt;(LOG4CXX_STR(<span class="hljs-string">&quot;foo&quot;</span>),
                                                                                                                                                                                         Level::getInfo(),
                                                                                                                                                                                         LOG4CXX_STR(<span class="hljs-string">&quot;A Message&quot;</span>),
                                                                                                                                                                                         log4cxx::spi::LocationInfo::getLocationUnavailable());
                FMTLayout layout(LOG4CXX_STR(<span class="hljs-string">&quot;{d:%Y-%m-%d %H:%M:%S} {message}&quot;</span>));
                LogString output;
                log4cxx::helpers::Pool pool;
                layout.format( output, logEvt, pool);



 ##dense <span class="hljs-number">3</span> <span class="hljs-number">0.7562235593795776</span> 
#include <span class="hljs-string">&quot;util/compare.h&quot;</span>
#include <span class="hljs-string">&quot;util/transformer.h&quot;</span>
#include <span class="hljs-string">&quot;util/absolutedateandtimefilter.h&quot;</span>
#include <span class="hljs-string">&quot;util/iso8601filter.h&quot;</span>
#include <span class="hljs-string">&quot;util/absolutetimefilter.h&quot;</span>
#include <span class="hljs-string">&quot;util/relativetimefilter.h&quot;</span>
#include <span class="hljs-string">&quot;util/controlfilter.h&quot;</span>
#include <span class="hljs-string">&quot;util/threadfilter.h&quot;</span>
#include <span class="hljs-string">&quot;util/linenumberfilter.h&quot;</span>
#include <span class="hljs-string">&quot;util/filenamefilter.h&quot;</span>
#include <span class="hljs-string">&quot;vectorappender.h&quot;</span>
#include &lt;log4cxx/fmtlayout.h&gt;
#include &lt;log4cxx/propertyconfigurator.h&gt;
#include &lt;log4cxx/helpers/date.h&gt;
#include &lt;log4cxx/spi/loggingevent.h&gt;
#include &lt;iostream&gt;
#include &lt;iomanip&gt;

#define REGEX_STR(x) x
#define PAT0 REGEX_STR(<span class="hljs-string">&quot;\\[[0-9A-FXx]*]\\ (DEBUG|INFO|WARN|ERROR|FATAL) .* - Message [0-9]\\{1,2\\}&quot;</span>)
#define PAT1 ISO8601_PAT REGEX_STR(<span class="hljs-string">&quot; &quot;</span>) PAT0
#define PAT2 ABSOLUTE_DATE_AND_TIME_PAT REGEX_STR(<span class="hljs-string">&quot; &quot;</span>) PAT0
#define PAT3 ABSOLUTE_TIME_PAT REGEX_STR(<span class="hljs-string">&quot; &quot;</span>) PAT0
#define PAT4 RELATIVE_TIME_PAT REGEX_STR(<span class="hljs-string">&quot; &quot;</span>) PAT0
#define PAT5 REGEX_STR(<span class="hljs-string">&quot;\\[[0-9A-FXx]*]\\ (DEBUG|INFO|WARN|ERROR|FATAL) .* : Message [0-9]\\{1,2\\}&quot;</span>)


 ##dense <span class="hljs-number">4</span> <span class="hljs-number">0.7557586431503296</span> 
                std::<span class="hljs-type">string</span> msg(<span class="hljs-string">&quot;Message &quot;</span>);

                Pool pool;

                <span class="hljs-comment">// These should all log.----------------------------</span>
                LOG4CXX_FATAL(ERRlogger, createMessage(i, pool));
                i++; <span class="hljs-comment">//0</span>
                LOG4CXX_ERROR(ERRlogger, createMessage(i, pool));
                i++;

                LOG4CXX_FATAL(INF, createMessage(i, pool));
                i++; <span class="hljs-comment">// 2</span>
                LOG4CXX_ERROR(INF, createMessage(i, pool));
                i++;
                LOG4CXX_WARN(INF, createMessage(i, pool));
                i++;
                LOG4CXX_INFO(INF, createMessage(i, pool));
                i++;

                LOG4CXX_FATAL(INF_UNDEF, createMessage(i, pool));
                i++; <span class="hljs-comment">//6</span>
                LOG4CXX_ERROR(INF_UNDEF, createMessage(i, pool));
                i++;
                LOG4CXX_WARN(INF_UNDEF, createMessage(i, pool));
                i++;
                LOG4CXX_INFO(INF_UNDEF, createMessage(i, pool));
                i++;

                LOG4CXX_FATAL(INF_ERR, createMessage(i, pool));
                i++; <span class="hljs-comment">// 10</span>
                LOG4CXX_ERROR(INF_ERR, createMessage(i, pool));
                i++;

                LOG4CXX_FATAL(INF_ERR_UNDEF, createMessage(i, pool));
                i++;
                LOG4CXX_ERROR(INF_ERR_UNDEF, createMessage(i, pool));
                i++;


<button class="copy-code-btn"></button></code></pre>
<h3 id="Hybrid-Search-Results" class="common-anchor-header">Hasil Pencarian Hibrida</h3><pre><code translate="no" class="language-C++">##hybrid <span class="hljs-number">0</span> <span class="hljs-number">0.016393441706895828</span> 
use {
    crate::args::LogArgs,
    anyhow::{anyhow, Result},
    simplelog::{Config, LevelFilter, WriteLogger},
    std::fs::File,
};

pub <span class="hljs-keyword">struct</span> Logger;

impl Logger {
    pub fn init(args: &amp;impl LogArgs) -&gt; Result&lt;()&gt; {
        let filter: LevelFilter = args.log_level().into();
        <span class="hljs-keyword">if</span> filter != LevelFilter::Off {
            let logfile = File::create(args.log_file())
                .map_err(|e| anyhow!(<span class="hljs-string">&quot;Failed to open log file: {e:}&quot;</span>))?;
            WriteLogger::init(filter, Config::<span class="hljs-keyword">default</span>(), logfile)
                .map_err(|e| anyhow!(<span class="hljs-string">&quot;Failed to initalize logger: {e:}&quot;</span>))?;
        }
        Ok(())
    }
}

 
##hybrid <span class="hljs-number">1</span> <span class="hljs-number">0.016393441706895828</span> 
<span class="hljs-comment">/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the &quot;License&quot;); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */</span>
#include <span class="hljs-string">&quot;logunit.h&quot;</span>
#include &lt;log4cxx/logger.h&gt;
#include &lt;log4cxx/simplelayout.h&gt;
#include &lt;log4cxx/fileappender.h&gt;
#include &lt;log4cxx/helpers/absolutetimedateformat.h&gt;


 
##hybrid <span class="hljs-number">2</span> <span class="hljs-number">0.016129031777381897</span> 
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
    };
}


 
##hybrid <span class="hljs-number">3</span> <span class="hljs-number">0.016129031777381897</span> 
        void simple()
        {
                LayoutPtr layout = LayoutPtr(<span class="hljs-built_in">new</span> SimpleLayout());
                AppenderPtr appender = FileAppenderPtr(<span class="hljs-built_in">new</span> FileAppender(layout, LOG4CXX_STR(<span class="hljs-string">&quot;output/simple&quot;</span>), <span class="hljs-literal">false</span>));
                root-&gt;addAppender(appender);
                common();

                LOGUNIT_ASSERT(Compare::compare(LOG4CXX_FILE(<span class="hljs-string">&quot;output/simple&quot;</span>), LOG4CXX_FILE(<span class="hljs-string">&quot;witness/simple&quot;</span>)));
        }

        std::<span class="hljs-type">string</span> createMessage(<span class="hljs-type">int</span> i, Pool &amp; pool)
        {
                std::<span class="hljs-type">string</span> msg(<span class="hljs-string">&quot;Message &quot;</span>);
                msg.<span class="hljs-built_in">append</span>(pool.itoa(i));
                <span class="hljs-keyword">return</span> msg;
        }

        void common()
        {
                <span class="hljs-type">int</span> i = <span class="hljs-number">0</span>;

                <span class="hljs-comment">// In the lines below, the logger names are chosen as an aid in</span>
                <span class="hljs-comment">// remembering their level values. In general, the logger names</span>
                <span class="hljs-comment">// have no bearing to level values.</span>
                LoggerPtr ERRlogger = Logger::getLogger(LOG4CXX_TEST_STR(<span class="hljs-string">&quot;ERR&quot;</span>));
                ERRlogger-&gt;setLevel(Level::getError());


 
##hybrid <span class="hljs-number">4</span> <span class="hljs-number">0.01587301678955555</span> 
std::vector&lt;std::<span class="hljs-type">string</span>&gt; MakeStrings() {
    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;a&quot;</span>, <span class="hljs-string">&quot;ab&quot;</span>, <span class="hljs-string">&quot;abc&quot;</span>, <span class="hljs-string">&quot;abcd&quot;</span>,
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="common-anchor-header">Kasus 2: Pencarian Hibrida Mengungguli Pencarian Teks Lengkap<button data-href="#Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Pertanyaan:</strong> Bagaimana Anda menginisialisasi pencatat?</p>
<p>Kueri ini sangat mirip dengan kueri sebelumnya, dan jawaban yang benar juga merupakan cuplikan kode yang sama, tetapi dalam kasus ini, pencarian hibrida menemukan jawabannya (melalui pencarian semantik), sedangkan pencarian teks lengkap tidak. Alasan dari perbedaan ini terletak pada pembobotan statistik dari kata-kata di dalam korpus, yang tidak sesuai dengan pemahaman intuitif kita terhadap pertanyaan tersebut. Model gagal mengenali bahwa kecocokan untuk kata "bagaimana" tidak begitu penting di sini. Kata "logger" muncul lebih sering dalam kode daripada "how", yang menyebabkan kata "how" menjadi lebih penting dalam peringkat pencarian teks lengkap.</p>
<p><strong>Kebenaran Dasar</strong></p>
<pre><code translate="no" class="language-C++">use {
    crate::args::LogArgs,
    anyhow::{anyhow, Result},
    simplelog::{Config, LevelFilter, WriteLogger},
    std::fs::File,
};

pub struct Logger;

impl Logger {
    pub fn <span class="hljs-title function_">init</span><span class="hljs-params">(args: &amp;impl LogArgs)</span> -&gt; Result&lt;()&gt; {
        let filter: LevelFilter = args.log_level().into();
        <span class="hljs-keyword">if</span> filter != LevelFilter::Off {
            <span class="hljs-type">let</span> <span class="hljs-variable">logfile</span> <span class="hljs-operator">=</span> File::create(args.log_file())
                .map_err(|e| anyhow!(<span class="hljs-string">&quot;Failed to open log file: {e:}&quot;</span>))?;
            WriteLogger::init(filter, Config::<span class="hljs-keyword">default</span>(), logfile)
                .map_err(|e| anyhow!(<span class="hljs-string">&quot;Failed to initalize logger: {e:}&quot;</span>))?;
        }
        Ok(())
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Text-Search-Results" class="common-anchor-header"><strong>Hasil Pencarian Teks Lengkap</strong></h3><pre><code translate="no" class="language-C++">##sparse <span class="hljs-number">0</span> <span class="hljs-number">10.17311954498291</span> 
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
    };
}



 ##sparse <span class="hljs-number">1</span> <span class="hljs-number">9.775702476501465</span> 
std::vector&lt;std::<span class="hljs-type">string</span>&gt; MakeStrings() {
    <span class="hljs-keyword">return</span> {
        <span class="hljs-string">&quot;a&quot;</span>, <span class="hljs-string">&quot;ab&quot;</span>, <span class="hljs-string">&quot;abc&quot;</span>, <span class="hljs-string">&quot;abcd&quot;</span>,
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>


 ##sparse <span class="hljs-number">2</span> <span class="hljs-number">7.638711452484131</span> 
<span class="hljs-comment">//   union (&quot;x|y&quot;), grouping (&quot;(xy)&quot;), brackets (&quot;[xy]&quot;), and</span>
<span class="hljs-comment">//   repetition count (&quot;x{5,7}&quot;), among others.</span>
<span class="hljs-comment">//</span>
<span class="hljs-comment">//   Below is the syntax that we do support.  We chose it to be a</span>
<span class="hljs-comment">//   subset of both PCRE and POSIX extended regex, so it&#x27;s easy to</span>
<span class="hljs-comment">//   learn wherever you come from.  In the following: &#x27;A&#x27; denotes a</span>
<span class="hljs-comment">//   literal character, period (.), or a single \\ escape sequence;</span>
<span class="hljs-comment">//   &#x27;x&#x27; and &#x27;y&#x27; denote regular expressions; &#x27;m&#x27; and &#x27;n&#x27; are for</span>


 ##sparse <span class="hljs-number">3</span> <span class="hljs-number">7.1208391189575195</span> 
<span class="hljs-comment">/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the &quot;License&quot;); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */</span>
#include <span class="hljs-string">&quot;logunit.h&quot;</span>
#include &lt;log4cxx/logger.h&gt;
#include &lt;log4cxx/simplelayout.h&gt;
#include &lt;log4cxx/fileappender.h&gt;
#include &lt;log4cxx/helpers/absolutetimedateformat.h&gt;



 ##sparse <span class="hljs-number">4</span> <span class="hljs-number">7.066349029541016</span> 
<span class="hljs-comment">/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the &quot;License&quot;); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */</span>
#include &lt;log4cxx/filter/denyallfilter.h&gt;
#include &lt;log4cxx/logger.h&gt;
#include &lt;log4cxx/spi/filter.h&gt;
#include &lt;log4cxx/spi/loggingevent.h&gt;
#include <span class="hljs-string">&quot;../logunit.h&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Hybrid-Search-Results" class="common-anchor-header"><strong>Hasil Pencarian Hibrida</strong></h3><pre><code translate="no" class="language-C++">
 <span class="hljs-comment">##hybrid 0 0.016393441706895828 </span>
use {
    crate::args::LogArgs,
    anyhow::{anyhow, Result},
    simplelog::{Config, LevelFilter, WriteLogger},
    std::fs::File,
};

pub struct Logger;

impl Logger {
    pub fn init(args: &amp;impl LogArgs) -&gt; Result&lt;()&gt; {
        <span class="hljs-built_in">let</span> filter: LevelFilter = args.log_level().into();
        <span class="hljs-keyword">if</span> filter != LevelFilter::Off {
            <span class="hljs-built_in">let</span> logfile = File::create(args.log_file())
                .map_err(|e| anyhow!(<span class="hljs-string">&quot;Failed to open log file: {e:}&quot;</span>))?;
            WriteLogger::init(filter, Config::default(), logfile)
                .map_err(|e| anyhow!(<span class="hljs-string">&quot;Failed to initalize logger: {e:}&quot;</span>))?;
        }
        Ok(())
    }
}

 
<span class="hljs-comment">##hybrid 1 0.016393441706895828 </span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
    };
}


 
<span class="hljs-comment">##hybrid 2 0.016129031777381897 </span>
std::vector&lt;std::string&gt; <span class="hljs-function"><span class="hljs-title">MakeStrings</span></span>() {
    <span class="hljs-built_in">return</span> {
        <span class="hljs-string">&quot;a&quot;</span>, <span class="hljs-string">&quot;ab&quot;</span>, <span class="hljs-string">&quot;abc&quot;</span>, <span class="hljs-string">&quot;abcd&quot;</span>,
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>
        <span class="hljs-string">&quot;long string to test how those are handled. Here goes more text. &quot;</span>

 
<span class="hljs-comment">##hybrid 3 0.016129031777381897 </span>
                LoggerPtr INF = Logger::getLogger(LOG4CXX_TEST_STR(<span class="hljs-string">&quot;INF&quot;</span>));
                INF-&gt;setLevel(Level::getInfo());

                LoggerPtr INF_ERR = Logger::getLogger(LOG4CXX_TEST_STR(<span class="hljs-string">&quot;INF.ERR&quot;</span>));
                INF_ERR-&gt;setLevel(Level::getError());

                LoggerPtr DEB = Logger::getLogger(LOG4CXX_TEST_STR(<span class="hljs-string">&quot;DEB&quot;</span>));
                DEB-&gt;setLevel(Level::getDebug());

                // Note: categories with undefined level
                LoggerPtr INF_UNDEF = Logger::getLogger(LOG4CXX_TEST_STR(<span class="hljs-string">&quot;INF.UNDEF&quot;</span>));
                LoggerPtr INF_ERR_UNDEF = Logger::getLogger(LOG4CXX_TEST_STR(<span class="hljs-string">&quot;INF.ERR.UNDEF&quot;</span>));
                LoggerPtr UNDEF = Logger::getLogger(LOG4CXX_TEST_STR(<span class="hljs-string">&quot;UNDEF&quot;</span>));


 
<span class="hljs-comment">##hybrid 4 0.01587301678955555 </span>
//   union (<span class="hljs-string">&quot;x|y&quot;</span>), grouping (<span class="hljs-string">&quot;(xy)&quot;</span>), brackets (<span class="hljs-string">&quot;[xy]&quot;</span>), and
//   repetition count (<span class="hljs-string">&quot;x{5,7}&quot;</span>), among others.
//
//   Below is the syntax that we <span class="hljs-keyword">do</span> support.  We chose it to be a
//   subset of both PCRE and POSIX extended regex, so it<span class="hljs-string">&#x27;s easy to
//   learn wherever you come from.  In the following: &#x27;</span>A<span class="hljs-string">&#x27; denotes a
//   literal character, period (.), or a single \\ escape sequence;
//   &#x27;</span>x<span class="hljs-string">&#x27; and &#x27;</span>y<span class="hljs-string">&#x27; denote regular expressions; &#x27;</span>m<span class="hljs-string">&#x27; and &#x27;</span>n<span class="hljs-string">&#x27; are for
</span><button class="copy-code-btn"></button></code></pre>
<p>Dalam pengamatan kami, kami menemukan bahwa dalam pencarian vektor jarang, banyak hasil berkualitas rendah disebabkan oleh pencocokan kata-kata yang informasinya rendah seperti "Bagaimana" dan "Apa". Dengan memeriksa data, kami menyadari bahwa kata-kata ini menyebabkan gangguan pada hasil pencarian. Salah satu pendekatan untuk mengatasi masalah ini adalah dengan menambahkan kata-kata ini ke daftar stopword dan mengabaikannya selama proses pencocokan. Hal ini akan membantu menghilangkan dampak negatif dari kata-kata umum ini dan meningkatkan kualitas hasil pencarian.</p>
<h2 id="Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="common-anchor-header">Kasus 3: <strong>Pencarian Hibrida (dengan Penambahan Stopword) Mengungguli Pencarian Semantik</strong><button data-href="#Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Setelah menambahkan stopword untuk menyaring kata-kata dengan informasi rendah seperti "Bagaimana" dan "Apa", kami menganalisis kasus di mana pencarian hybrid yang disesuaikan dengan baik berkinerja lebih baik daripada pencarian semantik. Peningkatan dalam kasus ini disebabkan oleh pencocokan istilah "RegistryClient" dalam kueri, yang memungkinkan kami menemukan hasil yang tidak dapat ditemukan oleh model pencarian semantik saja.</p>
<p>Selain itu, kami melihat bahwa pencarian hybrid mengurangi jumlah kecocokan berkualitas rendah dalam hasil pencarian. Dalam kasus ini, metode pencarian hybrid berhasil mengintegrasikan pencarian semantik dengan pencarian teks lengkap, sehingga menghasilkan hasil yang lebih relevan dengan akurasi yang lebih baik.</p>
<p><strong>Pertanyaan:</strong> Bagaimana instance RegistryClient dibuat dalam metode pengujian?</p>
<p>Pencarian hibrida secara efektif mendapatkan jawaban yang terkait dengan pembuatan instance "RegistryClient", yang tidak dapat ditemukan oleh pencarian semantik saja. Menambahkan stopword membantu menghindari hasil yang tidak relevan dari istilah seperti "How", sehingga menghasilkan kecocokan yang berkualitas lebih baik dan lebih sedikit hasil berkualitas rendah.</p>
<pre><code translate="no" class="language-C++"><span class="hljs-comment">/** Integration tests for {<span class="hljs-doctag">@link</span> BlobPuller}. */</span>
<span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">BlobPullerIntegrationTest</span> {

  <span class="hljs-keyword">private</span> <span class="hljs-keyword">final</span> <span class="hljs-type">FailoverHttpClient</span> <span class="hljs-variable">httpClient</span> <span class="hljs-operator">=</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">FailoverHttpClient</span>(<span class="hljs-literal">true</span>, <span class="hljs-literal">false</span>, ignored -&gt; {});

  <span class="hljs-meta">@Test</span>
  <span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title function_">testPull</span><span class="hljs-params">()</span> <span class="hljs-keyword">throws</span> IOException, RegistryException {
    <span class="hljs-type">RegistryClient</span> <span class="hljs-variable">registryClient</span> <span class="hljs-operator">=</span>
        RegistryClient.factory(EventHandlers.NONE, <span class="hljs-string">&quot;gcr.io&quot;</span>, <span class="hljs-string">&quot;distroless/base&quot;</span>, httpClient)
            .newRegistryClient();
    <span class="hljs-type">V22ManifestTemplate</span> <span class="hljs-variable">manifestTemplate</span> <span class="hljs-operator">=</span>
        registryClient
            .pullManifest(
                ManifestPullerIntegrationTest.KNOWN_MANIFEST_V22_SHA, V22ManifestTemplate.class)
            .getManifest();

    <span class="hljs-type">DescriptorDigest</span> <span class="hljs-variable">realDigest</span> <span class="hljs-operator">=</span> manifestTemplate.getLayers().get(<span class="hljs-number">0</span>).getDigest();
<button class="copy-code-btn"></button></code></pre>
<h3 id="Semantic-Search-Results" class="common-anchor-header">Hasil Pencarian Semantik</h3><pre><code translate="no" class="language-C++">
 

<span class="hljs-meta">##dense 0 0.7411458492279053 </span>
    Mockito.doThrow(mockRegistryUnauthorizedException)
        .<span class="hljs-keyword">when</span>(mockJibContainerBuilder)
        .containerize(mockContainerizer);

    <span class="hljs-keyword">try</span> {
      testJibBuildRunner.runBuild();
      Assert.fail();

    } <span class="hljs-keyword">catch</span> (BuildStepsExecutionException ex) {
      Assert.assertEquals(
          TEST_HELPFUL_SUGGESTIONS.forHttpStatusCodeForbidden(<span class="hljs-string">&quot;someregistry/somerepository&quot;</span>),
          ex.getMessage());
    }
  }



 <span class="hljs-meta">##dense 1 0.7346029877662659 </span>
    verify(mockCredentialRetrieverFactory).known(knownCredential, <span class="hljs-string">&quot;credentialSource&quot;</span>);
    verify(mockCredentialRetrieverFactory).known(inferredCredential, <span class="hljs-string">&quot;inferredCredentialSource&quot;</span>);
    verify(mockCredentialRetrieverFactory)
        .dockerCredentialHelper(<span class="hljs-string">&quot;docker-credential-credentialHelperSuffix&quot;</span>);
  }



 <span class="hljs-meta">##dense 2 0.7285804748535156 </span>
    <span class="hljs-keyword">when</span>(mockCredentialRetrieverFactory.dockerCredentialHelper(anyString()))
        .thenReturn(mockDockerCredentialHelperCredentialRetriever);
    <span class="hljs-keyword">when</span>(mockCredentialRetrieverFactory.known(knownCredential, <span class="hljs-string">&quot;credentialSource&quot;</span>))
        .thenReturn(mockKnownCredentialRetriever);
    <span class="hljs-keyword">when</span>(mockCredentialRetrieverFactory.known(inferredCredential, <span class="hljs-string">&quot;inferredCredentialSource&quot;</span>))
        .thenReturn(mockInferredCredentialRetriever);
    <span class="hljs-keyword">when</span>(mockCredentialRetrieverFactory.wellKnownCredentialHelpers())
        .thenReturn(mockWellKnownCredentialHelpersCredentialRetriever);



 <span class="hljs-meta">##dense 3 0.7279614210128784 </span>
  @Test
  <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">testBuildImage_insecureRegistryException</span>()
      throws InterruptedException, IOException, CacheDirectoryCreationException, RegistryException,
          ExecutionException</span> {
    InsecureRegistryException mockInsecureRegistryException =
        Mockito.mock(InsecureRegistryException.<span class="hljs-keyword">class</span>);
    Mockito.doThrow(mockInsecureRegistryException)
        .<span class="hljs-keyword">when</span>(mockJibContainerBuilder)
        .containerize(mockContainerizer);

    <span class="hljs-keyword">try</span> {
      testJibBuildRunner.runBuild();
      Assert.fail();

    } <span class="hljs-keyword">catch</span> (BuildStepsExecutionException ex) {
      Assert.assertEquals(TEST_HELPFUL_SUGGESTIONS.forInsecureRegistry(), ex.getMessage());
    }
  }



 <span class="hljs-meta">##dense 4 0.724872350692749 </span>
  @Test
  <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">testBuildImage_registryCredentialsNotSentException</span>()
      throws InterruptedException, IOException, CacheDirectoryCreationException, RegistryException,
          ExecutionException</span> {
    Mockito.doThrow(mockRegistryCredentialsNotSentException)
        .<span class="hljs-keyword">when</span>(mockJibContainerBuilder)
        .containerize(mockContainerizer);

    <span class="hljs-keyword">try</span> {
      testJibBuildRunner.runBuild();
      Assert.fail();

    } <span class="hljs-keyword">catch</span> (BuildStepsExecutionException ex) {
      Assert.assertEquals(TEST_HELPFUL_SUGGESTIONS.forCredentialsNotSent(), ex.getMessage());
    }
  }
<button class="copy-code-btn"></button></code></pre>
<h3 id="Hybrid-Search-Results" class="common-anchor-header">Hasil Pencarian Hibrida</h3><pre><code translate="no" class="language-C++">
 <span class="hljs-meta">##hybrid 0 0.016393441706895828 </span>
<span class="hljs-comment">/** Integration tests for {@link BlobPuller}. */</span>
<span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title">BlobPullerIntegrationTest</span> {

  <span class="hljs-keyword">private</span> final FailoverHttpClient httpClient = <span class="hljs-keyword">new</span> FailoverHttpClient(<span class="hljs-literal">true</span>, <span class="hljs-literal">false</span>, ignored -&gt; {});

  @Test
  <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">testPull</span>() throws IOException, RegistryException</span> {
    RegistryClient registryClient =
        RegistryClient.factory(EventHandlers.NONE, <span class="hljs-string">&quot;gcr.io&quot;</span>, <span class="hljs-string">&quot;distroless/base&quot;</span>, httpClient)
            .newRegistryClient();
    V22ManifestTemplate manifestTemplate =
        registryClient
            .pullManifest(
                ManifestPullerIntegrationTest.KNOWN_MANIFEST_V22_SHA, V22ManifestTemplate.<span class="hljs-keyword">class</span>)
            .getManifest();

    DescriptorDigest realDigest = manifestTemplate.getLayers().<span class="hljs-keyword">get</span>(<span class="hljs-number">0</span>).getDigest();


 
<span class="hljs-meta">##hybrid 1 0.016393441706895828 </span>
    Mockito.doThrow(mockRegistryUnauthorizedException)
        .<span class="hljs-keyword">when</span>(mockJibContainerBuilder)
        .containerize(mockContainerizer);

    <span class="hljs-keyword">try</span> {
      testJibBuildRunner.runBuild();
      Assert.fail();

    } <span class="hljs-keyword">catch</span> (BuildStepsExecutionException ex) {
      Assert.assertEquals(
          TEST_HELPFUL_SUGGESTIONS.forHttpStatusCodeForbidden(<span class="hljs-string">&quot;someregistry/somerepository&quot;</span>),
          ex.getMessage());
    }
  }


 
<span class="hljs-meta">##hybrid 2 0.016129031777381897 </span>
    verify(mockCredentialRetrieverFactory).known(knownCredential, <span class="hljs-string">&quot;credentialSource&quot;</span>);
    verify(mockCredentialRetrieverFactory).known(inferredCredential, <span class="hljs-string">&quot;inferredCredentialSource&quot;</span>);
    verify(mockCredentialRetrieverFactory)
        .dockerCredentialHelper(<span class="hljs-string">&quot;docker-credential-credentialHelperSuffix&quot;</span>);
  }


 
<span class="hljs-meta">##hybrid 3 0.016129031777381897 </span>
  @Test
  <span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-keyword">void</span> <span class="hljs-title">testPull_unknownBlob</span>() throws IOException, DigestException</span> {
    DescriptorDigest nonexistentDigest =
        DescriptorDigest.fromHash(
            <span class="hljs-string">&quot;aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&quot;</span>);

    RegistryClient registryClient =
        RegistryClient.factory(EventHandlers.NONE, <span class="hljs-string">&quot;gcr.io&quot;</span>, <span class="hljs-string">&quot;distroless/base&quot;</span>, httpClient)
            .newRegistryClient();

    <span class="hljs-keyword">try</span> {
      registryClient
          .pullBlob(nonexistentDigest, ignored -&gt; {}, ignored -&gt; {})
          .writeTo(ByteStreams.nullOutputStream());
      Assert.fail(<span class="hljs-string">&quot;Trying to pull nonexistent blob should have errored&quot;</span>);

    } <span class="hljs-keyword">catch</span> (IOException ex) {
      <span class="hljs-keyword">if</span> (!(ex.getCause() instanceof RegistryErrorException)) {
        <span class="hljs-keyword">throw</span> ex;
      }
      MatcherAssert.assertThat(
          ex.getMessage(),
          CoreMatchers.containsString(
              <span class="hljs-string">&quot;pull BLOB for gcr.io/distroless/base with digest &quot;</span> + nonexistentDigest));
    }
  }
}

 
<span class="hljs-meta">##hybrid 4 0.01587301678955555 </span>
    <span class="hljs-keyword">when</span>(mockCredentialRetrieverFactory.dockerCredentialHelper(anyString()))
        .thenReturn(mockDockerCredentialHelperCredentialRetriever);
    <span class="hljs-keyword">when</span>(mockCredentialRetrieverFactory.known(knownCredential, <span class="hljs-string">&quot;credentialSource&quot;</span>))
        .thenReturn(mockKnownCredentialRetriever);
    <span class="hljs-keyword">when</span>(mockCredentialRetrieverFactory.known(inferredCredential, <span class="hljs-string">&quot;inferredCredentialSource&quot;</span>))
        .thenReturn(mockInferredCredentialRetriever);
    <span class="hljs-keyword">when</span>(mockCredentialRetrieverFactory.wellKnownCredentialHelpers())
        .thenReturn(mockWellKnownCredentialHelpersCredentialRetriever);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusions" class="common-anchor-header">Kesimpulan<button data-href="#Conclusions" class="anchor-icon" translate="no">
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
    </button></h2><p>Dari analisis kami, kami dapat menarik beberapa kesimpulan tentang kinerja metode pencarian yang berbeda. Untuk sebagian besar kasus, model pencarian semantik membantu kami mendapatkan hasil yang baik dengan memahami maksud keseluruhan dari kueri, tetapi model ini gagal ketika kueri berisi kata kunci spesifik yang ingin kami cocokkan.</p>
<p>Dalam kasus ini, model penyematan tidak secara eksplisit mewakili maksud ini. Di sisi lain, pencarian teks lengkap dapat mengatasi masalah ini secara langsung. Namun, hal ini juga membawa masalah hasil yang tidak relevan meskipun ada kata-kata yang cocok, yang dapat menurunkan kualitas hasil secara keseluruhan. Oleh karena itu, sangat penting untuk mengidentifikasi dan menangani kasus-kasus negatif ini dengan menganalisis hasil spesifik dan menerapkan strategi yang ditargetkan untuk meningkatkan kualitas pencarian. Pencarian hibrida dengan strategi pemeringkatan seperti RRF atau perangking berbobot biasanya merupakan opsi dasar yang baik.</p>
<p>Dengan dirilisnya fungsionalitas pencarian teks lengkap di Milvus 2.5, kami bertujuan untuk memberikan solusi pencarian informasi yang fleksibel dan beragam kepada komunitas. Hal ini akan memungkinkan pengguna untuk mengeksplorasi berbagai kombinasi metode pencarian dan memenuhi permintaan pencarian yang semakin kompleks dan beragam di era GenAI. Lihat contoh kode tentang <a href="https://milvus.io/docs/full_text_search_with_milvus.md">bagaimana mengimplementasikan pencarian teks lengkap dan pencarian hybrid dengan Milvus 2.5</a>.</p>
