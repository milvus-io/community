---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: Overall Architecture
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: The Next-Gen QA Bot is here
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>Building an Intelligent QA System with NLP and Milvus</custom-h1><p>Milvus Project：github.com/milvus-io/milvus</p>
<p>The question answering system is commonly used in the field of natural language processing. It is used to answer questions in the form of natural language and has a wide range of applications. Typical applications include: intelligent voice interaction, online customer service, knowledge acquisition, personalized emotional chatting, and more. Most question answering systems can be classified as: generative and retrieval question answering systems, single-round question answering and multi-round question answering systems, open question answering systems, and specific question answering systems.</p>
<p>This article mainly deals with a QA system designed for a specific field, which is usually called an intelligent customer service robot. In the past, building a customer service robot usually required conversion of the domain knowledge into a series of rules and knowledge graphs. The construction process relies heavily on “human” intelligence. Once the scenes were changed, a lot of repetitive work would be required.
With the application of deep learning in natural language processing (NLP), machine reading can automatically find answers to matching questions directly from documents. The deep learning language model converts the questions and documents to semantic vectors to find the matching answer.</p>
<p>This article uses Google’s open source BERT model and Milvus, an open source vector search engine, to quickly build a Q&amp;A bot based on semantic understanding.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Overall Architecture<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>This article implements a question answering system through semantic similarity matching. The general construction process is as follows:</p>
<ol>
<li>Obtain a large number of questions with answers in a specific field ( a standard question set).</li>
<li>Use the BERT model to convert these questions into feature vectors and store them in Milvus. And Milvus will assign a vector ID to each feature vector at the same time.</li>
<li>Store these representative question IDs and their corresponding answers in PostgreSQL.</li>
</ol>
<p>When a user asks a question:</p>
<ol>
<li>The BERT model converts it to a feature vector.</li>
<li>Milvus performs a similarity search and retrieves the ID most similar to the question.</li>
<li>PostgreSQL returns the corresponding answer.</li>
</ol>
<p>The system architecture diagram is as follows (the blue lines represent the import process and the yellow lines represent the query process):</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
    <span>1-system-architecture-milvus-bert-postgresql.png</span>
  </span>
</p>
<p>Next, we will show you how to build an online Q&amp;A system step by step.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Steps to Build the Q&amp;A System<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Before you start, you need to install Milvus and PostgreSQL. For the specific installation steps, see the Milvus official website.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. Data preparation</h3><p>The experimental data in this article comes from: https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>The data set contains question and answer data pairs related to the insurance industry. In this article we extracts 20,000 question and answer pairs from it. Through this set of question and answer data sets, you can quickly build a customer service robot for the insurance industry.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. Generate feature vectors</h3><p>This system uses a model that BERT has pre-trained. Download it from the link below before starting a service: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>Use this model to convert the question database to feature vectors for future similarity search. For more information about the BERT service, see https://github.com/hanxiao/bert-as-service.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
    <span>2-code-block.png</span>
  </span>
</p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Import to Milvus and PostgreSQL</h3><p>Normalize and import the generated feature vectors import to Milvus, and then import the IDs returned by Milvus and the corresponding answers to PostgreSQL. The following shows the table structure in PostgreSQL:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
    <span>3-import-milvus-postgresql.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
    <span>4-import-milvus-postgresql.png</span>
  </span>
</p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. Retrieve Answers</h3><p>The user inputs a question, and after generating the feature vector through BERT, they can find the most similar question in the Milvus library. This article uses the cosine distance to represent the similarity between two sentences. Because all vectors are normalized, the closer the cosine distance of the two feature vectors to 1, the higher the similarity.</p>
<p>In practice, your system may not have perfectly matched questions in the library. Then, you can set a threshold of 0.9. If the greatest similarity distance retrieved is less than this threshold, the system will prompt that it does not include related questions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
    <span>4-retrieve-answers.png</span>
  </span>
</p>
<h2 id="System-Demonstration" class="common-anchor-header">System Demonstration<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>The following shows an example interface of the system:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
    <span>5-milvus-QA-system-application.png</span>
  </span>
</p>
<p>Enter your question in the dialog box and you will receive a corresponding answer:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
    <span>5-milvus-QA-system-application-2.png</span>
  </span>
</p>
<h2 id="Summary" class="common-anchor-header">Summary<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>After reading this article, we hope you find it easy to build your own Q&amp;A System.</p>
<p>With the BERT model, you no longer need to sort and organize the text corpora beforehand. At the same time, thanks to the high performance and high scalability of the open source vector search engine Milvus, your QA system can support a corpus of up to hundreds of millions of texts.</p>
<p>Milvus has officially joined the Linux AI (LF AI) Foundation for incubation. You are welcome to join the Milvus community and work with us to accelerate the application of AI technologies!</p>
<p>=&gt; Try our online demo here: https://www.milvus.io/scenarios</p>
