---
id: >-
  semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
title: 語義搜索 vs. 全文搜索：我要在 Milvus 2.5 中選擇哪一個？
author: 'David Wang, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Semantic_Search_v_s_Full_Text_Search_5d93431c56.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
---
<p>Milvus 是領先的高效能向量資料庫，長期專精於使用深度學習模型的向量嵌入進行語意搜尋。這項技術為人工智慧應用程式（例如：Retrieval-Augmented Generation (RAG)）、搜尋引擎和推薦系統提供動力。隨著 RAG 和其他文字搜尋應用的普及，社群已經意識到結合傳統文字匹配方法與語意搜尋 (稱為混合搜尋) 的優點。這種方法對於嚴重依賴關鍵字比對的情境特別有利。為了滿足這一需求，Milvus 2.5 引入了全文本搜尋 (FTS) 功能，並將其與自 2.4 版以來已有的稀疏向量搜尋和混合搜尋功能相整合，形成了強大的協同效應。</p>
<p>混合搜尋是一種結合多種搜尋路徑結果的方法。使用者可以用各種方式搜尋不同的資料欄位，然後將結果合併並排順，以獲得全面的結果。在當今流行的 RAG 應用情境中，典型的混合方法是結合語意搜尋與全文檢索。具體來說，這包括使用 RRF (Reciprocal Rank Fusion) 來合併基於密集嵌入的語意搜尋和基於 BM25 的詞彙比對結果，以提升結果排名。</p>
<p>在本文中，我們將使用 Anthropic 提供的資料集來說明這一點，該資料集包含來自 9 個程式碼儲存庫的程式碼片段。這類似 RAG 的流行使用案例：AI 輔助的編碼機器人。由於程式碼資料包含大量定義、關鍵字和其他資訊，因此在此情況下，以文字為基礎的搜尋會特別有效。同時，在大型程式碼資料集上訓練的密集嵌入模型可以捕捉更高層級的語意資訊。我們的目標是透過實驗觀察結合這兩種方法的效果。</p>
<p>我們會分析具體案例，以便對混合搜尋有更清楚的了解。作為基線，我們會使用在大量程式碼資料上訓練出來的先進密集嵌入模型 (voyage-2) 。然後，我們將選擇混合搜尋優於語意和全文搜尋結果（前五名）的實例，以分析這些實例背後的特徵。</p>
<table>
<thead>
<tr><th style="text-align:center">方法</th><th style="text-align:center">通過@5</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">全文檢索</td><td style="text-align:center">0.7318</td></tr>
<tr><td style="text-align:center">語意搜尋</td><td style="text-align:center">0.8096</td></tr>
<tr><td style="text-align:center">混合搜尋</td><td style="text-align:center">0.8176</td></tr>
<tr><td style="text-align:center">混合搜尋 (加入停止字)</td><td style="text-align:center">0.8418</td></tr>
</tbody>
</table>
<p>除了逐一分析品質之外，我們還擴大了評估範圍，計算整個資料集的 Pass@5 標準。這個指標衡量的是在每個查詢的前 5 個結果中找到的相關結果的比例。我們的研究結果顯示，雖然先進的嵌入模型建立了穩固的基線，但是將它們與全文檢索整合在一起會產生更好的結果。透過檢視 BM25 結果以及針對特定情境微調參數，可以進一步改善效能，進而大幅提升效能。</p>
<custom-h1>討論</custom-h1><p>我們檢驗了三種不同搜尋查詢的特定檢索結果，並將語意和全文搜尋與混合搜尋進行比較。您也可以查看<a href="https://github.com/wxywb/milvus_fts_exps">此 repo 中的完整程式碼</a>。</p>
<h2 id="Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="common-anchor-header">案例 1：<strong>混合搜尋優於語意搜尋</strong><button data-href="#Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>查詢：</strong>日誌檔案是如何建立的？</p>
<p>這個查詢的目的是詢問如何建立日誌檔案，而正確的答案應該是建立日誌檔案的 Rust 程式碼片段。在語意搜尋結果中，我們看到一些介紹日誌頭檔的程式碼，以及取得日誌記錄器的 C++ 程式碼。然而，這裡的關鍵在於 "logfile" 變數。在混合搜尋結果 #hybrid 0 中，我們找到了這個相關的結果，這自然是來自全文搜尋，因為混合搜尋合併了語意和全文搜尋結果。</p>
<p>除了這個結果之外，我們還可以在 #hybrid 2 中找到不相關的測試模擬程式碼，尤其是重複出現的短語 "long string to test how those are handled"。這需要瞭解全文檢索所使用的 BM25 演算法背後的原理。全文檢索的目的是匹配較不常見的字詞 (因為常見的字詞會降低文字的顯著性，並會妨礙物件的區別)。假設我們對大量的自然文字進行統計分析。在這種情況下，我們很容易得出「how」是一個很常見的字，對相關性得分的貢獻很小。然而，在這種情況下，資料集由程式碼組成，而程式碼中「how」一詞的出現次數並不多，因此在此情況下，「how」成為關鍵搜尋字詞。</p>
<p><strong>地面真實：</strong>正確答案是建立日誌檔案的 Rust 程式碼。</p>
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
<h3 id="Semantic-Search-Results" class="common-anchor-header">語意搜尋結果</h3><pre><code translate="no" class="language-C++">##dense <span class="hljs-number">0</span> <span class="hljs-number">0.7745316028594971</span> 
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
<h3 id="Hybrid-Search-Results" class="common-anchor-header">混合搜尋結果</h3><pre><code translate="no" class="language-C++">##hybrid <span class="hljs-number">0</span> <span class="hljs-number">0.016393441706895828</span> 
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
<h2 id="Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="common-anchor-header">案例 2：混合搜尋優於全文檢索<button data-href="#Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>查詢：</strong>如何初始化日誌記錄器？</p>
<p>這個查詢與前一個查詢相當類似，正確答案也是相同的程式碼片段，但在這個案例中，混合搜尋找到了答案（透過語義搜尋），而全文本搜尋則沒有。造成這種差異的原因在於字詞在語料庫中的統計權重，這與我們對問題的直覺理解並不一致。模型未能意識到 "how "這個詞的匹配在此並不那麼重要。與「如何」相比，「登錄器」一詞在代碼中出現的頻率更高，這導致「如何」在全文檢索排名中變得更重要。</p>
<p><strong>地面真實</strong></p>
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
<h3 id="Full-Text-Search-Results" class="common-anchor-header"><strong>全文檢索結果</strong></h3><pre><code translate="no" class="language-C++">##sparse <span class="hljs-number">0</span> <span class="hljs-number">10.17311954498291</span> 
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
<h3 id="Hybrid-Search-Results" class="common-anchor-header"><strong>混合搜尋結果</strong></h3><pre><code translate="no" class="language-C++">
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
<p>在觀察中，我們發現在稀疏向量搜尋中，許多低品質的結果是由於匹配了 "How「 和 」What" 等低資訊度的字詞所造成的。透過檢視資料，我們發現這些字詞造成了結果的干擾。緩解這個問題的一種方法是將這些字詞加入停止字詞列表，並在匹配過程中忽略它們。這將有助於消除這些常見字詞的負面影響，並改善搜尋結果的品質。</p>
<h2 id="Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="common-anchor-header">案例 3：<strong>混合搜索（添加停滯詞）優於語義搜索</strong><button data-href="#Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>在加入停止詞以濾除「How」和「What」等低資訊字詞之後，我們分析了一個微調混合式搜尋表現優於語意搜尋的案例。這個案例的改善是因為在查詢中匹配了「RegistryClient」這個詞彙，這讓我們找到了單靠語意搜尋模型無法召回的結果。</p>
<p>此外，我們注意到混合搜尋減少了結果中低品質匹配的數量。在這種情況下，混合搜尋方法成功地整合了語意搜尋與全文檢索，從而獲得更多相關的結果，並提高了精確度。</p>
<p><strong>查詢：</strong>在測試方法中，如何建立 RegistryClient 的實例？</p>
<p>混合搜尋有效地檢索出與建立「RegistryClient」實例相關的答案，而單獨使用語意搜尋則無法找到。添加停止詞有助於避免 "How "等詞的不相關結果，從而獲得更高質量的匹配結果，並減少低質量的結果。</p>
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
<h3 id="Semantic-Search-Results" class="common-anchor-header">語意搜尋結果</h3><pre><code translate="no" class="language-C++">
 

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
<h3 id="Hybrid-Search-Results" class="common-anchor-header">混合搜尋結果</h3><pre><code translate="no" class="language-C++">
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
<h2 id="Conclusions" class="common-anchor-header">結論<button data-href="#Conclusions" class="anchor-icon" translate="no">
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
    </button></h2><p>從我們的分析中，我們可以得出幾個關於不同檢索方法效能的結論。在大多數情況下，語義檢索模型可以掌握查詢的整體意圖，幫助我們獲得良好的結果，但是當查詢包含我們想要匹配的特定關鍵字時，語義檢索模型就會有所不足。</p>
<p>在這些情況下，嵌入模型無法明確表達這種意圖。另一方面，全文搜尋可以直接解決這個問題。不過，它也會帶來儘管有匹配字詞，但結果卻不相關的問題，這會降低整體結果的品質。因此，透過分析特定結果並應用有針對性的策略來改善搜尋品質，識別並處理這些負面情況是至關重要的。採用 RRF 或加權 reranker 等排序策略的混合搜尋通常是很好的基線選項。</p>
<p>隨著 Milvus 2.5 中全文檢索功能的推出，我們的目標是為社群提供靈活且多樣化的資訊檢索解決方案。這將允許使用者探索各種搜尋方法的組合，並解決 GenAI 時代日益複雜多變的搜尋需求。查看有關<a href="https://milvus.io/docs/full_text_search_with_milvus.md">如何使用 Milvus 2.5 實現全文檢索和混合檢索</a>的程式碼範例。</p>
