---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: 整体架构
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: 新一代 QA 机器人来了
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>利用 NLP 和 Milvus 构建智能 QA 系统</custom-h1><p>Milvus 项目：github.com/milvus-io/milvus</p>
<p>问题解答系统通常用于自然语言处理领域。它用于回答自然语言形式的问题，应用范围十分广泛。典型的应用包括：智能语音交互、在线客户服务、知识获取、个性化情感聊天等。大多数问题解答系统可分为：生成式问题解答系统和检索式问题解答系统、单轮问题解答系统和多轮问题解答系统、开放式问题解答系统和特定问题解答系统。</p>
<p>本文主要讨论针对特定领域设计的问答系统，也就是通常所说的智能客服机器人。过去，构建客服机器人通常需要将领域知识转化为一系列规则和知识图谱。构建过程在很大程度上依赖于 "人 "的智慧。随着深度学习在自然语言处理（NLP）中的应用，机器阅读可以直接从文档中自动找到匹配问题的答案。深度学习语言模型将问题和文档转换为语义向量，从而找到匹配的答案。</p>
<p>本文利用谷歌开源的 BERT 模型和开源向量搜索引擎 Milvus，快速构建了一个基于语义理解的问答机器人。</p>
<h2 id="Overall-Architecture" class="common-anchor-header">整体架构<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>本文通过语义相似性匹配实现了一个问题解答系统。一般构建过程如下：</p>
<ol>
<li>获取大量带有特定领域答案的问题（标准问题集）。</li>
<li>使用 BERT 模型将这些问题转换成特征向量并存储到 Milvus 中。而 Milvus 会同时为每个特征向量分配一个向量 ID。</li>
<li>将这些具有代表性的问题 ID 及其对应的答案存储在 PostgreSQL 中。</li>
</ol>
<p>当用户提问时：</p>
<ol>
<li>BERT 模型会将其转换为特征向量。</li>
<li>Milvus 执行相似性搜索，检索与问题最相似的 ID。</li>
<li>PostgreSQL 返回相应的答案。</li>
</ol>
<p>系统架构图如下（蓝线代表导入过程，黄线代表查询过程）：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-system-architecture-milvus-bert-postgresql.png</span> </span></p>
<p>接下来，我们将逐步向您介绍如何构建在线问答系统。</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">构建问答系统的步骤<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>在开始之前，你需要安装 Milvus 和 PostgreSQL。具体安装步骤请参见 Milvus 官方网站。</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1.数据准备</h3><p>本文中的实验数据来自： https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>该数据集包含与保险业相关的问答数据对。本文从中提取了 20,000 对问答数据。通过这组问答数据集，您可以快速构建一个保险业客户服务机器人。</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2.生成特征向量</h3><p>本系统使用的是 BERT 预先训练好的模型。在开始服务之前，请从以下链接下载：https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip。</p>
<p>使用该模型将问题数据库转换为特征向量，以便日后进行相似性搜索。有关 BERT 服务的更多信息，请参阅 https://github.com/hanxiao/bert-as-service。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-code-block.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3.导入 Milvus 和 PostgreSQL</h3><p>将生成的特征向量规范化并导入到 Milvus，然后将 Milvus 返回的 ID 和相应的答案导入到 PostgreSQL。下图显示了 PostgreSQL 中的表结构：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-import-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4.获取答案</h3><p>用户输入一个问题，通过 BERT 生成特征向量后，就可以在 Milvus 库中找到最相似的问题。本文使用余弦距离来表示两个句子之间的相似度。因为所有向量都是归一化的，所以两个特征向量的余弦距离越接近 1，相似度就越高。</p>
<p>实际上，您的系统库中可能没有完全匹配的问题。那么，您可以将阈值设为 0.9。如果检索到的最大相似度距离小于该阈值，系统将提示不包含相关问题。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-retrieve-answers.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">系统演示<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>下图显示了系统的示例界面：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application.png</span> </span></p>
<p>在对话框中输入问题，您将收到相应的答案：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application-2.png</span> </span></p>
<h2 id="Summary" class="common-anchor-header">摘要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>阅读本文后，我们希望您能轻松建立自己的问答系统。</p>
<p>有了 BERT 模型，您不再需要事先对文本语料进行分类和整理。同时，得益于开源向量搜索引擎 Milvus 的高性能和高扩展性，您的问答系统可以支持多达数亿文本的语料库。</p>
<p>Milvus 已正式加入 Linux AI（LF AI）基金会进行孵化。欢迎您加入 Milvus 社区，与我们一起加速人工智能技术的应用！</p>
<p>=&gt; 点击此处试用我们的在线演示：https://www.milvus.io/scenarios</p>
