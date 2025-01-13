---
id: >-
  semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
title: 'Ricerca semantica e ricerca a tutto testo: Quale scegliere in Milvus 2.5?'
author: 'David Wang, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Semantic_Search_v_s_Full_Text_Search_5d93431c56.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: >-
  https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
---
<p>Milvus, leader nel settore dei database vettoriali ad alte prestazioni, è da tempo specializzata nella ricerca semantica utilizzando le incorporazioni vettoriali dei modelli di deep learning. Questa tecnologia alimenta applicazioni di intelligenza artificiale come Retrieval-Augmented Generation (RAG), motori di ricerca e sistemi di raccomandazione. Con la crescente popolarità della RAG e di altre applicazioni di ricerca testuale, la comunità ha riconosciuto i vantaggi della combinazione dei metodi tradizionali di corrispondenza del testo con la ricerca semantica, nota come ricerca ibrida. Questo approccio è particolarmente vantaggioso in scenari che si basano molto sulla corrispondenza delle parole chiave. Per rispondere a questa esigenza, Milvus 2.5 introduce la funzionalità di ricerca full-text (FTS) e la integra con le funzionalità di ricerca vettoriale rada e di ricerca ibrida già disponibili dalla versione 2.4, creando una potente sinergia.</p>
<p>La ricerca ibrida è un metodo che combina i risultati di più percorsi di ricerca. Gli utenti possono cercare in vari modi in diversi campi di dati, quindi unire e classificare i risultati per ottenere un risultato completo. Negli scenari RAG più diffusi oggi, un tipico approccio ibrido combina la ricerca semantica con la ricerca full-text. In particolare, si tratta di unire i risultati della ricerca semantica basata sull'incorporazione densa e della corrispondenza lessicale basata su BM25, utilizzando RRF (Reciprocal Rank Fusion) per migliorare la classificazione dei risultati.</p>
<p>In questo articolo lo dimostreremo utilizzando un set di dati fornito da Anthropic, che consiste in snippet di codice provenienti da nove repository di codice. Si tratta di un caso d'uso popolare di RAG: un bot di codifica assistito dall'intelligenza artificiale. Poiché i dati di codice contengono molte definizioni, parole chiave e altre informazioni, la ricerca basata sul testo può essere particolarmente efficace in questo contesto. Nel frattempo, i modelli di incorporazione densa addestrati su grandi insiemi di codici possono catturare informazioni semantiche di livello superiore. Il nostro obiettivo è osservare gli effetti della combinazione di questi due approcci attraverso la sperimentazione.</p>
<p>Analizzeremo casi specifici per sviluppare una comprensione più chiara della ricerca ibrida. Come base, utilizzeremo un modello avanzato di incorporazione densa (voyage-2) addestrato su un grande volume di dati di codice. Selezioneremo poi gli esempi in cui la ricerca ibrida supera sia i risultati della ricerca semantica sia quelli della ricerca full-text (top 5) per analizzare le caratteristiche di questi casi.</p>
<table>
<thead>
<tr><th style="text-align:center">Metodo</th><th style="text-align:center">Pass@5</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Ricerca full-text</td><td style="text-align:center">0.7318</td></tr>
<tr><td style="text-align:center">Ricerca semantica</td><td style="text-align:center">0.8096</td></tr>
<tr><td style="text-align:center">Ricerca ibrida</td><td style="text-align:center">0.8176</td></tr>
<tr><td style="text-align:center">Ricerca ibrida (aggiunta di stopword)</td><td style="text-align:center">0.8418</td></tr>
</tbody>
</table>
<p>Oltre ad analizzare la qualità caso per caso, abbiamo ampliato la nostra valutazione calcolando la metrica Pass@5 sull'intero set di dati. Questa metrica misura la percentuale di risultati rilevanti trovati nei primi 5 risultati di ogni query. I nostri risultati mostrano che, mentre i modelli di incorporazione avanzati stabiliscono una solida base, la loro integrazione con la ricerca full-text produce risultati ancora migliori. Ulteriori miglioramenti sono possibili esaminando i risultati di BM25 e perfezionando i parametri per scenari specifici, il che può portare a un significativo aumento delle prestazioni.</p>
<custom-h1>Discussione</custom-h1><p>Abbiamo esaminato i risultati specifici recuperati per tre diverse query di ricerca, confrontando la ricerca semantica e quella full-text con la ricerca ibrida. È possibile consultare <a href="https://github.com/wxywb/milvus_fts_exps">il codice completo in questo repo</a>.</p>
<h2 id="Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="common-anchor-header">Caso 1: La <strong>ricerca ibrida supera la ricerca semantica</strong><button data-href="#Case-1-Hybrid-Search-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Domanda:</strong> Come viene creato il file di log?</p>
<p>Questa query ha lo scopo di chiedere informazioni sulla creazione di un file di log e la risposta corretta dovrebbe essere uno snippet di codice Rust che crea un file di log. Nei risultati della ricerca semantica, abbiamo visto del codice che introduce il file di intestazione del log e il codice C++ per ottenere il logger. Tuttavia, la chiave è la variabile "logfile". Nel risultato della ricerca ibrida #hybrid 0, abbiamo trovato questo risultato rilevante, che proviene naturalmente dalla ricerca full-text, poiché la ricerca ibrida unisce i risultati della ricerca semantica e full-text.</p>
<p>Oltre a questo risultato, in #hybrid 2 possiamo trovare un codice mock di test non correlato, in particolare la frase ripetuta "stringa lunga per verificare come vengono gestite". Ciò richiede la comprensione dei principi alla base dell'algoritmo BM25 utilizzato nella ricerca full-text. La ricerca full-text mira a trovare le parole più infrequenti (poiché le parole comuni riducono la distintività del testo e ostacolano la discriminazione degli oggetti). Supponiamo di eseguire un'analisi statistica su un ampio corpus di testi naturali. In questo caso, è facile concludere che "come" è una parola molto comune e contribuisce poco al punteggio di rilevanza. Tuttavia, in questo caso, il set di dati è costituito da codice e non ci sono molte occorrenze della parola "come" nel codice, il che lo rende un termine di ricerca chiave in questo contesto.</p>
<p><strong>Verità di base:</strong> la risposta corretta è il codice Rust che crea un file di log.</p>
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
<h3 id="Semantic-Search-Results" class="common-anchor-header">Risultati della ricerca semantica</h3><pre><code translate="no" class="language-C++">##dense <span class="hljs-number">0</span> <span class="hljs-number">0.7745316028594971</span> 
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
<h3 id="Hybrid-Search-Results" class="common-anchor-header">Risultati della ricerca ibrida</h3><pre><code translate="no" class="language-C++">##hybrid <span class="hljs-number">0</span> <span class="hljs-number">0.016393441706895828</span> 
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
<h2 id="Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="common-anchor-header">Caso 2: la ricerca ibrida supera la ricerca full text<button data-href="#Case-2-Hybrid-Search-Outperforms-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Domanda:</strong> Come si inizializza il logger?</p>
<p>Questa query è abbastanza simile alla precedente e la risposta corretta è lo stesso frammento di codice, ma in questo caso la ricerca ibrida ha trovato la risposta (tramite la ricerca semantica), mentre la ricerca full-text no. La ragione di questa discrepanza risiede nella ponderazione statistica delle parole nel corpus, che non si allinea con la nostra comprensione intuitiva della domanda. Il modello non ha riconosciuto che la corrispondenza con la parola "come" non era così importante. La parola "logger" è apparsa più frequentemente nel codice rispetto a "come", il che ha fatto sì che "come" diventasse più significativa nella classifica della ricerca full-text.</p>
<p><strong>Verità terrena</strong></p>
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
<h3 id="Full-Text-Search-Results" class="common-anchor-header"><strong>Risultati della ricerca full-text</strong></h3><pre><code translate="no" class="language-C++">##sparse <span class="hljs-number">0</span> <span class="hljs-number">10.17311954498291</span> 
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
<h3 id="Hybrid-Search-Results" class="common-anchor-header"><strong>Risultati della ricerca ibrida</strong></h3><pre><code translate="no" class="language-C++">
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
<p>Dalle nostre osservazioni è emerso che nella ricerca vettoriale rada molti risultati di bassa qualità erano causati dalla corrispondenza di parole poco informative come "Come" e "Cosa". Esaminando i dati, ci siamo resi conto che queste parole causavano interferenze nei risultati. Un approccio per attenuare questo problema consiste nell'aggiungere queste parole a un elenco di stopword e ignorarle durante il processo di corrispondenza. Questo aiuterebbe a eliminare l'impatto negativo di queste parole comuni e a migliorare la qualità dei risultati della ricerca.</p>
<h2 id="Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="common-anchor-header">Caso 3: La <strong>ricerca ibrida (con l'aggiunta di stopword) supera la ricerca semantica</strong><button data-href="#Case-3-Hybrid-Search-with-Stopword-Addition-Outperforms-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver aggiunto le stopword per filtrare le parole a bassa informazione come "Come" e "Cosa", abbiamo analizzato un caso in cui la ricerca ibrida ottimizzata ha ottenuto risultati migliori rispetto alla ricerca semantica. Il miglioramento in questo caso è dovuto alla corrispondenza del termine "RegistryClient" nella query, che ci ha permesso di trovare risultati non richiamati dal solo modello di ricerca semantica.</p>
<p>Inoltre, abbiamo notato che la ricerca ibrida ha ridotto il numero di corrispondenze di bassa qualità nei risultati. In questo caso, il metodo di ricerca ibrido ha integrato con successo la ricerca semantica con la ricerca full-text, portando a risultati più rilevanti con una migliore accuratezza.</p>
<p><strong>Domanda:</strong> Come viene creata l'istanza di RegistryClient nei metodi di test?</p>
<p>La ricerca ibrida ha recuperato efficacemente la risposta relativa alla creazione dell'istanza "RegistryClient", che la ricerca semantica da sola non è riuscita a trovare. L'aggiunta di parole d'ordine ha permesso di evitare risultati irrilevanti da termini come "Come", ottenendo così una migliore qualità delle corrispondenze e un minor numero di risultati di bassa qualità.</p>
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
<h3 id="Semantic-Search-Results" class="common-anchor-header">Risultati della ricerca semantica</h3><pre><code translate="no" class="language-C++">
 

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
<h3 id="Hybrid-Search-Results" class="common-anchor-header">Risultati della ricerca ibrida</h3><pre><code translate="no" class="language-C++">
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
<h2 id="Conclusions" class="common-anchor-header">Conclusioni<button data-href="#Conclusions" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalla nostra analisi, possiamo trarre diverse conclusioni sulle prestazioni dei diversi metodi di reperimento. Nella maggior parte dei casi, il modello di ricerca semantica ci aiuta a ottenere buoni risultati, cogliendo l'intenzione generale della query, ma non è all'altezza quando la query contiene parole chiave specifiche che vogliamo trovare.</p>
<p>In questi casi, il modello di incorporazione non rappresenta esplicitamente l'intento. D'altra parte, la ricerca full-text può affrontare direttamente questo problema. Tuttavia, comporta anche il problema dei risultati irrilevanti nonostante le parole corrispondenti, il che può degradare la qualità complessiva dei risultati. Pertanto, è fondamentale identificare e gestire questi casi negativi analizzando risultati specifici e applicando strategie mirate per migliorare la qualità della ricerca. Una ricerca ibrida con strategie di classificazione come RRF o reranker ponderato è di solito una buona opzione di base.</p>
<p>Con il rilascio della funzionalità di ricerca full-text in Milvus 2.5, intendiamo fornire alla comunità soluzioni flessibili e diversificate per il recupero delle informazioni. Ciò consentirà agli utenti di esplorare varie combinazioni di metodi di ricerca e di rispondere alle richieste di ricerca sempre più complesse e varie nell'era della GenAI. Guardate l'esempio di codice su <a href="https://milvus.io/docs/full_text_search_with_milvus.md">come implementare la ricerca full-text e la ricerca ibrida con Milvus 2.5</a>.</p>
