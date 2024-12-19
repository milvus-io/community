---
id: semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
title: 'Semantic Search vs. Full-Text Search: Which Do I Choose in Milvus 2.5?'
author: David Wang, Jiang Chen
date: 2024-12-17
cover: assets.zilliz.com/Semantic_Search_v_s_Full_Text_Search_5d93431c56.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md
---


Milvus, a leading high-performance vector database, has long specialized in semantic search using vector embeddings from deep learning models. This technology powers AI applications like Retrieval-Augmented Generation (RAG), search engines, and recommender systems. With the rising popularity of RAG and other text search applications, the community has recognized the advantages of combining traditional text-matching methods with semantic search, known as hybrid search. This approach is particularly beneficial in scenarios that heavily rely on keyword matching. To address this need, Milvus 2.5 introduces full-text search (FTS) functionality and integrates it with the sparse vector search and hybrid search capabilities already available since version 2.4, creating a powerful synergy.

Hybrid search is a method that combines results from multiple search paths. Users can search different data fields in various ways, then merge and rank the results to obtain a comprehensive outcome. In popular RAG scenarios today, a typical hybrid approach combines semantic search with lexical search (also known as full-text search). Specifically, this involves merging results from dense embedding-based semantic search and BM25-based lexical matching using RRF (Reciprocal Rank Fusion) to enhance result ranking.

In this article, we will demonstrate this using a dataset provided by Anthropic, which consists of code snippets from nine code repositories. This resembles a popular use case of RAG: an AI-assisted coding bot. Because code data contains a lot of definitions, keywords, and other information, text-based search can be particularly effective in this context. Meanwhile, dense embedding models trained on large code datasets can capture higher-level semantic information. Our goal is to observe the effects of combining these two approaches through experimentation.

We will analyze specific cases to develop a clearer understanding of hybrid search. As the baseline, we will use an advanced dense embedding model (voyage-2) trained on a large volume of code data. We will then select examples where hybrid search outperforms both semantic and full-text search results (top 5) to analyze the characteristics behind these cases.

|            Method            | Pass@5 |
| :--------------------------: | :-----: |
|       Full-text Search       |  0.7318 |
|        Semantic Search       |  0.8096 |
|         Hybrid Search        |  0.8176 |
| Hybrid Search (add stopword) |  0.8418 |

In addition to analyzing the quality on a case-by-case basis, we broadened our evaluation by calculating the Pass@5 metric across the entire dataset. This metric measures the proportion of relevant results found in the top 5 results of each query. Our findings show that while advanced embedding models establish a solid baseline, integrating them with full-text search yields even better results. Further improvements are possible by examining BM25 results and fine-tuning parameters for specific scenarios, which can lead to significant performance gains.


# Discussion

We examine the specific results retrieved for three different search queries, comparing semantic and full-text search to hybrid search.


## Case 1: **Hybrid Search Outperforms Semantic Search**

**Question:** How is the log file created? This question aims to inquire about creating a log file, and the correct answer should be a snippet of Rust code that creates a log file. In the semantic search results, we saw some code introducing the log header file and the C++ code for obtaining the logger. However, the key here is the "logfile" variable. In the hybrid search result #hybrid 0, we found this relevant result, which is naturally from the full-text search since hybrid search merges semantic and full-text search results.

In addition to this result, we can find unrelated test mock code in #hybrid 2, especially the repeated phrase, "long string to test how those are handled." This requires understanding the principles behind the BM25 algorithm used in full-text search. Full-text search aims to match more infrequent words (since common words reduce the distinctiveness of the text and hinder object discrimination). Suppose we perform a statistical analysis on a large corpus of natural text. In that case, it is easy to conclude that "how" is a very common word and contributes very little to the relevance score. However, in this case, the dataset consists of code, and there aren't many occurrences of the word "how" in the code, making it a key search term in this context.

**Ground Truth:** The correct answer is the Rust code that creates a log file.

```C++
use {
    crate::args::LogArgs,
    anyhow::{anyhow, Result},
    simplelog::{Config, LevelFilter, WriteLogger},
    std::fs::File,
};

pub struct Logger;

impl Logger {
    pub fn init(args: &impl LogArgs) -> Result<()> {
        let filter: LevelFilter = args.log_level().into();
        if filter != LevelFilter::Off {
            let logfile = File::create(args.log_file())
                .map_err(|e| anyhow!("Failed to open log file: {e:}"))?;
            WriteLogger::init(filter, Config::default(), logfile)
                .map_err(|e| anyhow!("Failed to initalize logger: {e:}"))?;
        }
        Ok(())
    }
}
```


### Semantic Search Results

```C++
##dense 0 0.7745316028594971 
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#include "logunit.h"
#include <log4cxx/logger.h>
#include <log4cxx/simplelayout.h>
#include <log4cxx/fileappender.h>
#include <log4cxx/helpers/absolutetimedateformat.h>



 ##dense 1 0.769859254360199 
        void simple()
        {
                LayoutPtr layout = LayoutPtr(new SimpleLayout());
                AppenderPtr appender = FileAppenderPtr(new FileAppender(layout, LOG4CXX_STR("output/simple"), false));
                root->addAppender(appender);
                common();

                LOGUNIT_ASSERT(Compare::compare(LOG4CXX_FILE("output/simple"), LOG4CXX_FILE("witness/simple")));
        }

        std::string createMessage(int i, Pool & pool)
        {
                std::string msg("Message ");
                msg.append(pool.itoa(i));
                return msg;
        }

        void common()
        {
                int i = 0;

                // In the lines below, the logger names are chosen as an aid in
                // remembering their level values. In general, the logger names
                // have no bearing to level values.
                LoggerPtr ERRlogger = Logger::getLogger(LOG4CXX_TEST_STR("ERR"));
                ERRlogger->setLevel(Level::getError());



 ##dense 2 0.7591114044189453 
                log4cxx::spi::LoggingEventPtr logEvt = std::make_shared<log4cxx::spi::LoggingEvent>(LOG4CXX_STR("foo"),
                                                                                                                                                                                         Level::getInfo(),
                                                                                                                                                                                         LOG4CXX_STR("A Message"),
                                                                                                                                                                                         log4cxx::spi::LocationInfo::getLocationUnavailable());
                FMTLayout layout(LOG4CXX_STR("{d:%Y-%m-%d %H:%M:%S} {message}"));
                LogString output;
                log4cxx::helpers::Pool pool;
                layout.format( output, logEvt, pool);



 ##dense 3 0.7562235593795776 
#include "util/compare.h"
#include "util/transformer.h"
#include "util/absolutedateandtimefilter.h"
#include "util/iso8601filter.h"
#include "util/absolutetimefilter.h"
#include "util/relativetimefilter.h"
#include "util/controlfilter.h"
#include "util/threadfilter.h"
#include "util/linenumberfilter.h"
#include "util/filenamefilter.h"
#include "vectorappender.h"
#include <log4cxx/fmtlayout.h>
#include <log4cxx/propertyconfigurator.h>
#include <log4cxx/helpers/date.h>
#include <log4cxx/spi/loggingevent.h>
#include <iostream>
#include <iomanip>

#define REGEX_STR(x) x
#define PAT0 REGEX_STR("\\[[0-9A-FXx]*]\\ (DEBUG|INFO|WARN|ERROR|FATAL) .* - Message [0-9]\\{1,2\\}")
#define PAT1 ISO8601_PAT REGEX_STR(" ") PAT0
#define PAT2 ABSOLUTE_DATE_AND_TIME_PAT REGEX_STR(" ") PAT0
#define PAT3 ABSOLUTE_TIME_PAT REGEX_STR(" ") PAT0
#define PAT4 RELATIVE_TIME_PAT REGEX_STR(" ") PAT0
#define PAT5 REGEX_STR("\\[[0-9A-FXx]*]\\ (DEBUG|INFO|WARN|ERROR|FATAL) .* : Message [0-9]\\{1,2\\}")


 ##dense 4 0.7557586431503296 
                std::string msg("Message ");

                Pool pool;

                // These should all log.----------------------------
                LOG4CXX_FATAL(ERRlogger, createMessage(i, pool));
                i++; //0
                LOG4CXX_ERROR(ERRlogger, createMessage(i, pool));
                i++;

                LOG4CXX_FATAL(INF, createMessage(i, pool));
                i++; // 2
                LOG4CXX_ERROR(INF, createMessage(i, pool));
                i++;
                LOG4CXX_WARN(INF, createMessage(i, pool));
                i++;
                LOG4CXX_INFO(INF, createMessage(i, pool));
                i++;

                LOG4CXX_FATAL(INF_UNDEF, createMessage(i, pool));
                i++; //6
                LOG4CXX_ERROR(INF_UNDEF, createMessage(i, pool));
                i++;
                LOG4CXX_WARN(INF_UNDEF, createMessage(i, pool));
                i++;
                LOG4CXX_INFO(INF_UNDEF, createMessage(i, pool));
                i++;

                LOG4CXX_FATAL(INF_ERR, createMessage(i, pool));
                i++; // 10
                LOG4CXX_ERROR(INF_ERR, createMessage(i, pool));
                i++;

                LOG4CXX_FATAL(INF_ERR_UNDEF, createMessage(i, pool));
                i++;
                LOG4CXX_ERROR(INF_ERR_UNDEF, createMessage(i, pool));
                i++;


```


### Hybrid Search Results

```C++
##hybrid 0 0.016393441706895828 
use {
    crate::args::LogArgs,
    anyhow::{anyhow, Result},
    simplelog::{Config, LevelFilter, WriteLogger},
    std::fs::File,
};

pub struct Logger;

impl Logger {
    pub fn init(args: &impl LogArgs) -> Result<()> {
        let filter: LevelFilter = args.log_level().into();
        if filter != LevelFilter::Off {
            let logfile = File::create(args.log_file())
                .map_err(|e| anyhow!("Failed to open log file: {e:}"))?;
            WriteLogger::init(filter, Config::default(), logfile)
                .map_err(|e| anyhow!("Failed to initalize logger: {e:}"))?;
        }
        Ok(())
    }
}

 
##hybrid 1 0.016393441706895828 
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#include "logunit.h"
#include <log4cxx/logger.h>
#include <log4cxx/simplelayout.h>
#include <log4cxx/fileappender.h>
#include <log4cxx/helpers/absolutetimedateformat.h>


 
##hybrid 2 0.016129031777381897 
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
    };
}


 
##hybrid 3 0.016129031777381897 
        void simple()
        {
                LayoutPtr layout = LayoutPtr(new SimpleLayout());
                AppenderPtr appender = FileAppenderPtr(new FileAppender(layout, LOG4CXX_STR("output/simple"), false));
                root->addAppender(appender);
                common();

                LOGUNIT_ASSERT(Compare::compare(LOG4CXX_FILE("output/simple"), LOG4CXX_FILE("witness/simple")));
        }

        std::string createMessage(int i, Pool & pool)
        {
                std::string msg("Message ");
                msg.append(pool.itoa(i));
                return msg;
        }

        void common()
        {
                int i = 0;

                // In the lines below, the logger names are chosen as an aid in
                // remembering their level values. In general, the logger names
                // have no bearing to level values.
                LoggerPtr ERRlogger = Logger::getLogger(LOG4CXX_TEST_STR("ERR"));
                ERRlogger->setLevel(Level::getError());


 
##hybrid 4 0.01587301678955555 
std::vector<std::string> MakeStrings() {
    return {
        "a", "ab", "abc", "abcd",
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
```


## Case 2: Hybrid Search Outperforms Full-Text Search

**Question:** How do you initialize the logger? This question is quite similar to the previous one, and the correct answer is also the same code snippet, but in this case, hybrid search found the answer (via semantic search), while full-text search did not. The reason for this discrepancy lies in the statistical weightings of words in the corpus, which do not align with our intuitive understanding of the question. The model failed to recognize that the match for the word "how" was not as important here. The word "logger" appeared more frequently in the code than "how," which led to "how" becoming more significant in the full-text search ranking.

**GroundTruth**

```C++
use {
    crate::args::LogArgs,
    anyhow::{anyhow, Result},
    simplelog::{Config, LevelFilter, WriteLogger},
    std::fs::File,
};

pub struct Logger;

impl Logger {
    pub fn init(args: &impl LogArgs) -> Result<()> {
        let filter: LevelFilter = args.log_level().into();
        if filter != LevelFilter::Off {
            let logfile = File::create(args.log_file())
                .map_err(|e| anyhow!("Failed to open log file: {e:}"))?;
            WriteLogger::init(filter, Config::default(), logfile)
                .map_err(|e| anyhow!("Failed to initalize logger: {e:}"))?;
        }
        Ok(())
    }
}
```


### **Full Text Search Results**

```C++
##sparse 0 10.17311954498291 
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
    };
}



 ##sparse 1 9.775702476501465 
std::vector<std::string> MakeStrings() {
    return {
        "a", "ab", "abc", "abcd",
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "


 ##sparse 2 7.638711452484131 
//   union ("x|y"), grouping ("(xy)"), brackets ("[xy]"), and
//   repetition count ("x{5,7}"), among others.
//
//   Below is the syntax that we do support.  We chose it to be a
//   subset of both PCRE and POSIX extended regex, so it's easy to
//   learn wherever you come from.  In the following: 'A' denotes a
//   literal character, period (.), or a single \\ escape sequence;
//   'x' and 'y' denote regular expressions; 'm' and 'n' are for


 ##sparse 3 7.1208391189575195 
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#include "logunit.h"
#include <log4cxx/logger.h>
#include <log4cxx/simplelayout.h>
#include <log4cxx/fileappender.h>
#include <log4cxx/helpers/absolutetimedateformat.h>



 ##sparse 4 7.066349029541016 
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
#include <log4cxx/filter/denyallfilter.h>
#include <log4cxx/logger.h>
#include <log4cxx/spi/filter.h>
#include <log4cxx/spi/loggingevent.h>
#include "../logunit.h"
```


### **Hybrid Search Results**

```C++


 ##hybrid 0 0.016393441706895828 
use {
    crate::args::LogArgs,
    anyhow::{anyhow, Result},
    simplelog::{Config, LevelFilter, WriteLogger},
    std::fs::File,
};

pub struct Logger;

impl Logger {
    pub fn init(args: &impl LogArgs) -> Result<()> {
        let filter: LevelFilter = args.log_level().into();
        if filter != LevelFilter::Off {
            let logfile = File::create(args.log_file())
                .map_err(|e| anyhow!("Failed to open log file: {e:}"))?;
            WriteLogger::init(filter, Config::default(), logfile)
                .map_err(|e| anyhow!("Failed to initalize logger: {e:}"))?;
        }
        Ok(())
    }
}

 
##hybrid 1 0.016393441706895828 
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
    };
}


 
##hybrid 2 0.016129031777381897 
std::vector<std::string> MakeStrings() {
    return {
        "a", "ab", "abc", "abcd",
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "
        "long string to test how those are handled. Here goes more text. "

 
##hybrid 3 0.016129031777381897 
                LoggerPtr INF = Logger::getLogger(LOG4CXX_TEST_STR("INF"));
                INF->setLevel(Level::getInfo());

                LoggerPtr INF_ERR = Logger::getLogger(LOG4CXX_TEST_STR("INF.ERR"));
                INF_ERR->setLevel(Level::getError());

                LoggerPtr DEB = Logger::getLogger(LOG4CXX_TEST_STR("DEB"));
                DEB->setLevel(Level::getDebug());

                // Note: categories with undefined level
                LoggerPtr INF_UNDEF = Logger::getLogger(LOG4CXX_TEST_STR("INF.UNDEF"));
                LoggerPtr INF_ERR_UNDEF = Logger::getLogger(LOG4CXX_TEST_STR("INF.ERR.UNDEF"));
                LoggerPtr UNDEF = Logger::getLogger(LOG4CXX_TEST_STR("UNDEF"));


 
##hybrid 4 0.01587301678955555 
//   union ("x|y"), grouping ("(xy)"), brackets ("[xy]"), and
//   repetition count ("x{5,7}"), among others.
//
//   Below is the syntax that we do support.  We chose it to be a
//   subset of both PCRE and POSIX extended regex, so it's easy to
//   learn wherever you come from.  In the following: 'A' denotes a
//   literal character, period (.), or a single \\ escape sequence;
//   'x' and 'y' denote regular expressions; 'm' and 'n' are for
```

In our observations, we found that in the sparse vector search, many low-quality results were caused by matching low-information words like "How" and "What." By examining the data, we realized that these words caused interference in the results. One approach to mitigate this issue is to add these words to a stopword list and ignore them during the matching process. This would help eliminate the negative impact of these common words and improve the quality of the search results.


## Case 3: **Hybrid Search (with Stopword Addition) Outperforms Semantic Search**

After adding the stopwords to filter out low-information words like "How" and "What," we analyzed a case where a fine-tuned hybrid search performed better than a semantic search. The improvement in this case was due to matching the term "RegistryClient" in the query, which allowed us to find results not recalled by the semantic search model alone.

Furthermore, we noticed that hybrid search reduced the number of low-quality matches in the results. In this case, the hybrid search method successfully integrated the semantic search with the full-text search, leading to more relevant results with improved accuracy.

**Question:** How is the RegistryClient instance created in the test methods?

The hybrid search effectively retrieved the answer related to creating the "RegistryClient" instance, which semantic search alone failed to find. Adding stopwords helped avoid irrelevant results from terms like "How," leading to better-quality matches and fewer low-quality results.

```C++
/** Integration tests for {@link BlobPuller}. */
public class BlobPullerIntegrationTest {

  private final FailoverHttpClient httpClient = new FailoverHttpClient(true, false, ignored -> {});

  @Test
  public void testPull() throws IOException, RegistryException {
    RegistryClient registryClient =
        RegistryClient.factory(EventHandlers.NONE, "gcr.io", "distroless/base", httpClient)
            .newRegistryClient();
    V22ManifestTemplate manifestTemplate =
        registryClient
            .pullManifest(
                ManifestPullerIntegrationTest.KNOWN_MANIFEST_V22_SHA, V22ManifestTemplate.class)
            .getManifest();

    DescriptorDigest realDigest = manifestTemplate.getLayers().get(0).getDigest();
```


### Semantic Search Results

```C++

 

##dense 0 0.7411458492279053 
    Mockito.doThrow(mockRegistryUnauthorizedException)
        .when(mockJibContainerBuilder)
        .containerize(mockContainerizer);

    try {
      testJibBuildRunner.runBuild();
      Assert.fail();

    } catch (BuildStepsExecutionException ex) {
      Assert.assertEquals(
          TEST_HELPFUL_SUGGESTIONS.forHttpStatusCodeForbidden("someregistry/somerepository"),
          ex.getMessage());
    }
  }



 ##dense 1 0.7346029877662659 
    verify(mockCredentialRetrieverFactory).known(knownCredential, "credentialSource");
    verify(mockCredentialRetrieverFactory).known(inferredCredential, "inferredCredentialSource");
    verify(mockCredentialRetrieverFactory)
        .dockerCredentialHelper("docker-credential-credentialHelperSuffix");
  }



 ##dense 2 0.7285804748535156 
    when(mockCredentialRetrieverFactory.dockerCredentialHelper(anyString()))
        .thenReturn(mockDockerCredentialHelperCredentialRetriever);
    when(mockCredentialRetrieverFactory.known(knownCredential, "credentialSource"))
        .thenReturn(mockKnownCredentialRetriever);
    when(mockCredentialRetrieverFactory.known(inferredCredential, "inferredCredentialSource"))
        .thenReturn(mockInferredCredentialRetriever);
    when(mockCredentialRetrieverFactory.wellKnownCredentialHelpers())
        .thenReturn(mockWellKnownCredentialHelpersCredentialRetriever);



 ##dense 3 0.7279614210128784 
  @Test
  public void testBuildImage_insecureRegistryException()
      throws InterruptedException, IOException, CacheDirectoryCreationException, RegistryException,
          ExecutionException {
    InsecureRegistryException mockInsecureRegistryException =
        Mockito.mock(InsecureRegistryException.class);
    Mockito.doThrow(mockInsecureRegistryException)
        .when(mockJibContainerBuilder)
        .containerize(mockContainerizer);

    try {
      testJibBuildRunner.runBuild();
      Assert.fail();

    } catch (BuildStepsExecutionException ex) {
      Assert.assertEquals(TEST_HELPFUL_SUGGESTIONS.forInsecureRegistry(), ex.getMessage());
    }
  }



 ##dense 4 0.724872350692749 
  @Test
  public void testBuildImage_registryCredentialsNotSentException()
      throws InterruptedException, IOException, CacheDirectoryCreationException, RegistryException,
          ExecutionException {
    Mockito.doThrow(mockRegistryCredentialsNotSentException)
        .when(mockJibContainerBuilder)
        .containerize(mockContainerizer);

    try {
      testJibBuildRunner.runBuild();
      Assert.fail();

    } catch (BuildStepsExecutionException ex) {
      Assert.assertEquals(TEST_HELPFUL_SUGGESTIONS.forCredentialsNotSent(), ex.getMessage());
    }
  }
```


### Hybrid Search Results

```C++

 ##hybrid 0 0.016393441706895828 
/** Integration tests for {@link BlobPuller}. */
public class BlobPullerIntegrationTest {

  private final FailoverHttpClient httpClient = new FailoverHttpClient(true, false, ignored -> {});

  @Test
  public void testPull() throws IOException, RegistryException {
    RegistryClient registryClient =
        RegistryClient.factory(EventHandlers.NONE, "gcr.io", "distroless/base", httpClient)
            .newRegistryClient();
    V22ManifestTemplate manifestTemplate =
        registryClient
            .pullManifest(
                ManifestPullerIntegrationTest.KNOWN_MANIFEST_V22_SHA, V22ManifestTemplate.class)
            .getManifest();

    DescriptorDigest realDigest = manifestTemplate.getLayers().get(0).getDigest();


 
##hybrid 1 0.016393441706895828 
    Mockito.doThrow(mockRegistryUnauthorizedException)
        .when(mockJibContainerBuilder)
        .containerize(mockContainerizer);

    try {
      testJibBuildRunner.runBuild();
      Assert.fail();

    } catch (BuildStepsExecutionException ex) {
      Assert.assertEquals(
          TEST_HELPFUL_SUGGESTIONS.forHttpStatusCodeForbidden("someregistry/somerepository"),
          ex.getMessage());
    }
  }


 
##hybrid 2 0.016129031777381897 
    verify(mockCredentialRetrieverFactory).known(knownCredential, "credentialSource");
    verify(mockCredentialRetrieverFactory).known(inferredCredential, "inferredCredentialSource");
    verify(mockCredentialRetrieverFactory)
        .dockerCredentialHelper("docker-credential-credentialHelperSuffix");
  }


 
##hybrid 3 0.016129031777381897 
  @Test
  public void testPull_unknownBlob() throws IOException, DigestException {
    DescriptorDigest nonexistentDigest =
        DescriptorDigest.fromHash(
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    RegistryClient registryClient =
        RegistryClient.factory(EventHandlers.NONE, "gcr.io", "distroless/base", httpClient)
            .newRegistryClient();

    try {
      registryClient
          .pullBlob(nonexistentDigest, ignored -> {}, ignored -> {})
          .writeTo(ByteStreams.nullOutputStream());
      Assert.fail("Trying to pull nonexistent blob should have errored");

    } catch (IOException ex) {
      if (!(ex.getCause() instanceof RegistryErrorException)) {
        throw ex;
      }
      MatcherAssert.assertThat(
          ex.getMessage(),
          CoreMatchers.containsString(
              "pull BLOB for gcr.io/distroless/base with digest " + nonexistentDigest));
    }
  }
}

 
##hybrid 4 0.01587301678955555 
    when(mockCredentialRetrieverFactory.dockerCredentialHelper(anyString()))
        .thenReturn(mockDockerCredentialHelperCredentialRetriever);
    when(mockCredentialRetrieverFactory.known(knownCredential, "credentialSource"))
        .thenReturn(mockKnownCredentialRetriever);
    when(mockCredentialRetrieverFactory.known(inferredCredential, "inferredCredentialSource"))
        .thenReturn(mockInferredCredentialRetriever);
    when(mockCredentialRetrieverFactory.wellKnownCredentialHelpers())
        .thenReturn(mockWellKnownCredentialHelpersCredentialRetriever);
```


## Conclusions

From our analysis, we can draw several conclusions about the performance of different retrieval methods. For most of the cases, the semantic search model helps us obtain good results by grasping the overall intention of the query, but it falls short when the query contains specific keywords we want to match.

In these cases, the embedding model doesn't explicitly represent this intent. On the other hand, Full-text search can address this issue directly. However, it also brings the problem of irrelevant results despite matching words, which can degrade the overall result quality. Therefore, it’s crucial to identify and handle these negative cases by analyzing specific results and applying targeted strategies to improve search quality. A hybrid search with ranking strategies such as RRF or weighted reranker is usually a good baseline option.

With the release of the full-text search functionality in Milvus 2.5, we aim to provide the community with flexible and diverse information retrieval solutions. This will allow users to explore various combinations of search methods and address the increasingly complex and varied search demands in the GenAI era. Check out the code example on [how to implement full-text search and hybrid search with Milvus 2.5](https://milvus.io/docs/full_text_search_with_milvus.md).
