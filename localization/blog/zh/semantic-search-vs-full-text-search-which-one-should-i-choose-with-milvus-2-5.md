---
id: >-
  semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
title: 'Semantic Search vs. Full-Text Search: Which Do I Choose in Milvus 2.5?'
author: 'David Wang, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Semantic_Search_v_s_Full_Text_Search_5d93431c56.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
---
<p>Milvus, a leading high-performance vector database, has long specialized in semantic search using vector embeddings from deep learning models. This technology powers AI applications like Retrieval-Augmented Generation (RAG), search engines, and recommender systems. With the rising popularity of RAG and other text search applications, the community has recognized the advantages of combining traditional text-matching methods with semantic search, known as hybrid search. This approach is particularly beneficial in scenarios that heavily rely on keyword matching. To address this need, Milvus 2.5 introduces full-text search (FTS) functionality and integrates it with the sparse vector search and hybrid search capabilities already available since version 2.4, creating a powerful synergy.</p>
<p>Hybrid search is a method that combines results from multiple search paths. Users can search different data fields in various ways, then merge and rank the results to obtain a comprehensive outcome. In popular RAG scenarios today, a typical hybrid approach combines semantic search with full-text search. Specifically, this involves merging results from dense embedding-based semantic search and BM25-based lexical matching using RRF (Reciprocal Rank Fusion) to enhance result ranking.</p>
<p>In this article, we will demonstrate this using a dataset provided by Anthropic, which consists of code snippets from nine code repositories. This resembles a popular use case of RAG: an AI-assisted coding bot. Because code data contains a lot of definitions, keywords, and other information, text-based search can be particularly effective in this context. Meanwhile, dense embedding models trained on large code datasets can capture higher-level semantic information. Our goal is to observe the effects of combining these two approaches through experimentation.</p>
<p>We will analyze specific cases to develop a clearer understanding of hybrid search. As the baseline, we will use an advanced dense embedding model (voyage-2) trained on a large volume of code data. We will then select examples where hybrid search outperforms both semantic and full-text search results (top 5) to analyze the characteristics behind these cases.</p>
<table>
<thead>
<tr><th style="text-align:center">Method</th><th style="text-align:center">Pass@5</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Full-text Search</td><td style="text-align:center">0.7318</td></tr>
<tr><td style="text-align:center">Semantic Search</td><td style="text-align:center">0.8096</td></tr>
<tr><td style="text-align:center">Hybrid Search</td><td style="text-align:center">0.8176</td></tr>
<tr><td style="text-align:center">Hybrid Search (add stopword)</td><td style="text-align:center">0.8418</td></tr>
</tbody>
</table>
<p>In addition to analyzing the quality on a case-by-case basis, we broadened our evaluation by calculating the Pass@5 metric across the entire dataset. This metric measures the proportion of relevant results found in the top 5 results of each query. Our findings show that while advanced embedding models establish a solid baseline, integrating them with full-text search yields even better results. Further improvements are possible by examining BM25 results and fine-tuning parameters for specific scenarios, which can lead to significant performance gains.</p>
<custom-h1>Discussion</custom-h1><p>We examine the specific results retrieved for three different search queries, comparing semantic and full-text search to hybrid search. You can also check out <a href="https://github.com/wxywb/milvus_fts_exps">the full code in this repo</a>.</p>
<h2 id="Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="common-anchor-header">Case 1: <strong>Hybrid Search Outperforms Semantic Search</strong><button data-href="#Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Query:</strong> How is the log file created?</p>
<p>This query aims to inquire about creating a log file, and the correct answer should be a snippet of Rust code that creates a log file. In the semantic search results, we saw some code introducing the log header file and the C++ code for obtaining the logger. However, the key here is the “logfile” variable. In the hybrid search result #hybrid 0, we found this relevant result, which is naturally from the full-text search since hybrid search merges semantic and full-text search results.</p>
<p>In addition to this result, we can find unrelated test mock code in #hybrid 2, especially the repeated phrase, “long string to test how those are handled.” This requires understanding the principles behind the BM25 algorithm used in full-text search. Full-text search aims to match more infrequent words (since common words reduce the distinctiveness of the text and hinder object discrimination). Suppose we perform a statistical analysis on a large corpus of natural text. In that case, it is easy to conclude that “how” is a very common word and contributes very little to the relevance score. However, in this case, the dataset consists of code, and there aren’t many occurrences of the word “how” in the code, making it a key search term in this context.</p>
<p><strong>Ground Truth:</strong> The correct answer is the Rust code that creates a log file.</p>
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
<h3 id="Semantic-Search-Results" class="common-anchor-header">Semantic Search Results</h3><pre><code translate="no" class="language-C++">##dense <span class="hljs-number">0</span> <span class="hljs-number">0.7745316028594971</span> 
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
<h3 id="Hybrid-Search-Results" class="common-anchor-header">Hybrid Search Results</h3><pre><code translate="no" class="language-C++">##hybrid <span class="hljs-number">0</span> <span class="hljs-number">0.016393441706895828</span> 
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
<h2 id="Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="common-anchor-header">Case 2: Hybrid Search Outperforms Full-Text Search<button data-href="#Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Query:</strong> How do you initialize the logger?</p>
<p>This query is quite similar to the previous one, and the correct answer is also the same code snippet, but in this case, hybrid search found the answer (via semantic search), while full-text search did not. The reason for this discrepancy lies in the statistical weightings of words in the corpus, which do not align with our intuitive understanding of the question. The model failed to recognize that the match for the word “how” was not as important here. The word “logger” appeared more frequently in the code than “how,” which led to “how” becoming more significant in the full-text search ranking.</p>
<p><strong>GroundTruth</strong></p>
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
<h3 id="Full-Text-Search-Results" class="common-anchor-header"><strong>Full Text Search Results</strong></h3><pre><code translate="no" class="language-C++">##sparse <span class="hljs-number">0</span> <span class="hljs-number">10.17311954498291</span> 
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
<h3 id="Hybrid-Search-Results" class="common-anchor-header"><strong>Hybrid Search Results</strong></h3><pre><code translate="no" class="language-C++">
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
<p>In our observations, we found that in the sparse vector search, many low-quality results were caused by matching low-information words like “How” and “What.” By examining the data, we realized that these words caused interference in the results. One approach to mitigate this issue is to add these words to a stopword list and ignore them during the matching process. This would help eliminate the negative impact of these common words and improve the quality of the search results.</p>
<h2 id="Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="common-anchor-header">Case 3: <strong>Hybrid Search (with Stopword Addition) Outperforms Semantic Search</strong><button data-href="#Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>After adding the stopwords to filter out low-information words like “How” and “What,” we analyzed a case where a fine-tuned hybrid search performed better than a semantic search. The improvement in this case was due to matching the term “RegistryClient” in the query, which allowed us to find results not recalled by the semantic search model alone.</p>
<p>Furthermore, we noticed that hybrid search reduced the number of low-quality matches in the results. In this case, the hybrid search method successfully integrated the semantic search with the full-text search, leading to more relevant results with improved accuracy.</p>
<p><strong>Query:</strong> How is the RegistryClient instance created in the test methods?</p>
<p>The hybrid search effectively retrieved the answer related to creating the “RegistryClient” instance, which semantic search alone failed to find. Adding stopwords helped avoid irrelevant results from terms like “How,” leading to better-quality matches and fewer low-quality results.</p>
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
<h3 id="Semantic-Search-Results" class="common-anchor-header">Semantic Search Results</h3><pre><code translate="no" class="language-C++">
 

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
<h3 id="Hybrid-Search-Results" class="common-anchor-header">Hybrid Search Results</h3><pre><code translate="no" class="language-C++">
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
<h2 id="Conclusions" class="common-anchor-header">Conclusions<button data-href="#Conclusions" class="anchor-icon" translate="no">
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
    </button></h2><p>From our analysis, we can draw several conclusions about the performance of different retrieval methods. For most of the cases, the semantic search model helps us obtain good results by grasping the overall intention of the query, but it falls short when the query contains specific keywords we want to match.</p>
<p>In these cases, the embedding model doesn’t explicitly represent this intent. On the other hand, Full-text search can address this issue directly. However, it also brings the problem of irrelevant results despite matching words, which can degrade the overall result quality. Therefore, it’s crucial to identify and handle these negative cases by analyzing specific results and applying targeted strategies to improve search quality. A hybrid search with ranking strategies such as RRF or weighted reranker is usually a good baseline option.</p>
<p>With the release of the full-text search functionality in Milvus 2.5, we aim to provide the community with flexible and diverse information retrieval solutions. This will allow users to explore various combinations of search methods and address the increasingly complex and varied search demands in the GenAI era. Check out the code example on <a href="https://milvus.io/docs/full_text_search_with_milvus.md">how to implement full-text search and hybrid search with Milvus 2.5</a>.</p>
