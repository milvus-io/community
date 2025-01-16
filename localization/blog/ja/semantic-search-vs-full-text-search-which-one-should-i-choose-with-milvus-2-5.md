---
id: >-
  semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
title: セマンティック検索と全文検索：Milvus 2.5ではどちらを選ぶべきか？
author: 'David Wang, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Semantic_Search_v_s_Full_Text_Search_5d93431c56.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
---
<p>高性能ベクトルデータベースのリーディングカンパニーであるMilvusは、ディープラーニングモデルからのベクトル埋め込みを用いたセマンティック検索を長年専門としてきた。この技術は、RAG（Retrieval-Augmented Generation）、検索エンジン、レコメンダーシステムなどのAIアプリケーションに力を与えている。RAGやその他のテキスト検索アプリケーションの人気が高まるにつれ、コミュニティは従来のテキストマッチング手法とハイブリッド検索として知られるセマンティック検索を組み合わせることの利点を認識するようになった。このアプローチは、キーワードマッチングに大きく依存するシナリオにおいて特に有益である。このニーズに対応するため、Milvus 2.5では全文検索（FTS）機能を導入し、バージョン2.4からすでに利用可能なスパースベクトル検索およびハイブリッド検索機能と統合することで、強力な相乗効果を生み出している。</p>
<p>ハイブリッド検索は、複数の検索パスからの結果を組み合わせる手法である。ユーザーは、異なるデータフィールドを様々な方法で検索し、その結果をマージしてランク付けし、包括的な結果を得ることができる。今日一般的なRAGシナリオでは、典型的なハイブリッド・アプローチはセマンティック検索とフルテキスト検索を組み合わせている。具体的には、RRF（Reciprocal Rank Fusion）を使って、密な埋め込みベースの意味検索とBM25ベースの語彙マッチングの結果をマージし、結果のランキングを強化する。</p>
<p>この記事では、Anthropicが提供する、9つのコードリポジトリからのコードスニペットからなるデータセットを使って、これを実証する。これは、RAGの一般的なユースケースであるAI支援コーディングボットに似ている。コードデータには多くの定義、キーワード、その他の情報が含まれているため、このコンテキストではテキストベースの検索が特に効果的である。一方、大規模なコードデータセットで訓練された高密度埋め込みモデルは、より高度な意味情報を捉えることができる。我々の目標は、実験を通じてこれら2つのアプローチを組み合わせることの効果を観察することである。</p>
<p>具体的なケースを分析することで、ハイブリッド検索に対する理解を深める。ベースラインとして、大量のコードデータで訓練された高度な高密度埋め込みモデル（voyage-2）を使用する。そして、ハイブリッド検索がセマンティック検索とフルテキスト検索の両方の検索結果を上回る事例（トップ5）を選び、これらの事例の背後にある特徴を分析する。</p>
<table>
<thead>
<tr><th style="text-align:center">方法</th><th style="text-align:center">パス@5</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">全文検索</td><td style="text-align:center">0.7318</td></tr>
<tr><td style="text-align:center">セマンティック検索</td><td style="text-align:center">0.8096</td></tr>
<tr><td style="text-align:center">ハイブリッド検索</td><td style="text-align:center">0.8176</td></tr>
<tr><td style="text-align:center">ハイブリッド検索（ストップワード追加）</td><td style="text-align:center">0.8418</td></tr>
</tbody>
</table>
<p>ケースバイケースでの品質分析に加え、データセット全体でPass@5メトリックを計算することで評価を広げた。この指標は、各クエリの上位5つの結果で見つかった関連性の高い結果の割合を測定します。我々の調査結果は、高度な埋め込みモデルが強固なベースラインを確立する一方で、それらを全文検索と統合することで、さらに優れた結果が得られることを示している。BM25の結果を検証し、特定のシナリオのためにパラメータを微調整することで、さらなる改善が可能であり、これは大幅なパフォーマンス向上につながる可能性がある。</p>
<custom-h1>考察</custom-h1><p>セマンティック検索とフルテキスト検索をハイブリッド検索と比較しながら、3つの異なる検索クエリに対して取得された具体的な結果を検証した。<a href="https://github.com/wxywb/milvus_fts_exps">このレポで完全なコードを</a>チェックすることもできる。</p>
<h2 id="Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="common-anchor-header">ケース1：<strong>ハイブリッド検索がセマンティック検索を上回る</strong><button data-href="#Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>クエリ</strong>ログファイルはどのように作成されますか？</p>
<p>このクエリの目的はログファイルの作成について問い合わせることで、正しい答えはログファイルを作成するRustコードのスニペットであるべきです。セマンティック検索の結果には、ログヘッダーファイルと、ロガーを取得するためのC++コードを紹介するコードがありました。しかし、ここでのキーは "logfile "変数です。ハイブリッド検索結果#hybrid 0で、この関連する結果を見つけた。ハイブリッド検索はセマンティック検索結果とフルテキスト検索結果をマージするので、当然フルテキスト検索からの結果である。</p>
<p>この結果に加えて、#hybrid 2では関連性のないテストモックコードを見つけることができ、特に "long string to test how those are handled "というフレーズが繰り返されている。これには、全文検索で使われるBM25アルゴリズムの背後にある原理を理解する必要がある。全文検索は、より頻度の低い単語とのマッチングを目指します（一般的な単語はテキストの識別性を低下させ、オブジェクトの識別を妨げるため）。自然テキストの大規模なコーパスに対して統計分析を行うとする。その場合、"how "は非常に一般的な単語であり、関連性スコアにほとんど寄与しないと結論づけるのは簡単である。しかし、この場合、データセットはコードで構成されており、コードの中に「how」という単語はあまり出現しないため、この文脈では「how」が重要な検索キーワードとなる。</p>
<p><strong>グランド・トゥルース：</strong>正解は、ログファイルを作成するRustコードです。</p>
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
<h3 id="Semantic-Search-Results" class="common-anchor-header">セマンティック検索結果</h3><pre><code translate="no" class="language-C++">##dense <span class="hljs-number">0</span> <span class="hljs-number">0.7745316028594971</span> 
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
<h3 id="Hybrid-Search-Results" class="common-anchor-header">ハイブリッド検索結果</h3><pre><code translate="no" class="language-C++">##hybrid <span class="hljs-number">0</span> <span class="hljs-number">0.016393441706895828</span> 
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
<h2 id="Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="common-anchor-header">ケース2：ハイブリッド検索が全文検索を上回る<button data-href="#Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>クエリー</strong>ロガーを初期化する方法は？</p>
<p>このクエリは前のクエリとよく似ており、正解も同じコードスニペットだが、このケースではハイブリッド検索が（セマンティック検索によって）答えを見つけたのに対し、フルテキスト検索は見つけられなかった。この不一致の原因は、コーパス内の単語の統計的な重み付けにあり、これは質問に対する直感的な理解とは一致しません。このモデルは、「どのように」という単語の一致がここではそれほど重要ではないことを認識できなかった。logger "という単語は "how "よりも頻繁にコードに登場し、その結果、"how "が全文検索のランキングでより重要な意味を持つようになった。</p>
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
<h3 id="Full-Text-Search-Results" class="common-anchor-header"><strong>全文検索結果</strong></h3><pre><code translate="no" class="language-C++">##sparse <span class="hljs-number">0</span> <span class="hljs-number">10.17311954498291</span> 
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
<h3 id="Hybrid-Search-Results" class="common-anchor-header"><strong>ハイブリッド検索結果</strong></h3><pre><code translate="no" class="language-C++">
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
<p>スパース・ベクトル検索では、"How "や "What "のような情報量の少ない単語とのマッチングにより、低品質な検索結果が多く発生していることがわかった。データを調査することで、これらの単語が検索結果の干渉を引き起こしていることがわかった。この問題を軽減する1つのアプローチは、これらの単語をストップワードリストに追加し、マッチングプロセス中に無視することである。これにより、これらの一般的な単語の悪影響を排除し、検索結果の質を向上させることができる。</p>
<h2 id="Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="common-anchor-header">ケース3：<strong>ハイブリッド検索（ストップワード追加）はセマンティック検索を上回る</strong><button data-href="#Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>How "や "What "のような情報量の少ない単語をフィルタリングするためにストップワードを追加した後、微調整したハイブリッド検索がセマンティック検索よりも優れたパフォーマンスを示したケースを分析した。このケースの改善は、クエリ内の "RegistryClient "という用語をマッチングさせたことによるもので、セマンティック検索モデルだけでは想起されなかった結果を見つけることができた。</p>
<p>さらに、ハイブリッド検索によって、結果中の低品質なマッチの数が減少したことにも気づいた。この場合、ハイブリッド検索メソッドは、セマンティック検索とフルテキスト検索をうまく統合し、精度を向上させながら、より関連性の高い結果を導くことに成功した。</p>
<p><strong>クエリー</strong>テストメソッドにおいて、RegistryClient インスタンスはどのように作成されますか？</p>
<p>ハイブリッド検索は、セマンティック検索だけでは見つけられなかった "RegistryClient "インスタンスの作成に関する答えを効果的に検索しました。ストップワードを追加することで、"How "のような用語による無関係な結果を避けることができ、より質の高いマッチと質の低い結果の減少につながりました。</p>
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
<h3 id="Semantic-Search-Results" class="common-anchor-header">セマンティック検索結果</h3><pre><code translate="no" class="language-C++">
 

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
<h3 id="Hybrid-Search-Results" class="common-anchor-header">ハイブリッド検索結果</h3><pre><code translate="no" class="language-C++">
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
    </button></h2><p>今回の分析から、さまざまな検索手法のパフォーマンスについて、いくつかの結論を導き出すことができる。ほとんどの場合、セマンティック検索モデルはクエリの全体的な意図を把握することで良い結果を得るのに役立つが、クエリにマッチさせたい特定のキーワードが含まれている場合には不十分である。</p>
<p>このような場合、埋め込みモデルはこの意図を明示的に表現しない。一方、全文検索は、この問題に直接対処することができる。しかし、単語がマッチしているにもかかわらず、関連性のない結果が出てくるという問題もあり、結果全体の質が低下する可能性があります。したがって、特定の結果を分析し、検索品質を向上させるために的を絞った戦略を適用することによって、このようなネガティブなケースを特定し、対処することが極めて重要である。RRFや重み付きリランカーのようなランキング戦略とのハイブリッド検索は、通常、良い基本オプションである。</p>
<p>Milvus 2.5における全文検索機能のリリースにより、我々は柔軟で多様な情報検索ソリューションをコミュニティに提供することを目指している。これにより、ユーザーは様々な検索手法の組み合わせを検討し、GenAI時代においてますます複雑化し多様化する検索要求に対応することができるようになる。<a href="https://milvus.io/docs/full_text_search_with_milvus.md">Milvus 2.5で全文検索とハイブリッド検索を実装する</a>コード例をご覧ください。</p>
