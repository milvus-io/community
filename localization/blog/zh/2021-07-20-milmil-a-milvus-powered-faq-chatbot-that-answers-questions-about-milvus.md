---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: MilMil 一个由 Milvus 支持的常见问题聊天机器人，可回答有关 Milvus 的问题
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: 使用开源向量搜索工具建立问题解答服务。
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil：由 Milvus 驱动的常见问题聊天机器人，回答有关 Milvus 的问题</custom-h1><p>最近，开源社区创建了 MilMil--一个由 Milvus 用户创建、为 Milvus 用户服务的 Milvus 常见问题解答聊天机器人。MilMil 可全天候访问 Mil<a href="https://milvus.io/">vus.io</a>，回答有关世界上最先进的开源向量数据库 Milvus 的常见问题。</p>
<p>这个问题解答系统不仅能帮助更快地解决 Milvus 用户遇到的常见问题，还能根据用户提交的问题发现新的问题。MilMil 的数据库包含了自 2019 年该项目首次以开源许可证发布以来用户提出的问题。问题存储在两个 Collections 中，一个用于 Milvus 1.x 及更早版本，另一个用于 Milvus 2.0。</p>
<p>MilMil 目前只有英语版本。</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">MilMil 是如何工作的？<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil 依靠<em>Sentence-transformers/paraphrase-mpnet-base-v2</em>模型获得常见问题数据库的向量表示，然后利用 Milvus 进行向量相似性检索，返回语义相似的问题。</p>
<p>首先，使用自然语言处理（NLP）模型 BERT 将常见问题数据转换为语义向量。然后将嵌入向量插入 Milvus，并为每个嵌入向量分配一个唯一的 ID。最后，问题和答案连同其向量 ID 一起插入关系数据库 PostgreSQL。</p>
<p>当用户提交问题时，系统会使用 BERT 将其转换为特征向量。接下来，系统会在 Milvus 中搜索与查询向量最相似的五个向量，并检索它们的 ID。最后，与检索到的向量 ID 相对应的问题和答案将返回给用户。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>系统进程.png</span> </span></p>
<p>请参阅 Milvus 训练营中的<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">问题解答系统</a>项目，探索用于构建人工智能聊天机器人的代码。</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">向 MilMil 了解 Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>要与 MilMil 聊天，请浏览<a href="https://milvus.io/">Milvus.io</a>上的任何页面并点击右下角的小鸟图标。在文本输入框中键入您的问题，然后点击发送。MilMil 会在几毫秒内回复您！此外，左上角的下拉列表可用于切换 Milvus 不同版本的技术文档。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>提交问题后，机器人会立即返回三个与查询问题语义相似的问题。您可以点击 "查看答案 "浏览问题的潜在答案，或点击 "查看更多 "查看与您的搜索相关的更多问题。如果没有合适的答案，请点击 "在此输入您的反馈"，提出您的问题并附上电子邮件地址。来自 Milvus 社区的帮助将很快到达！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>聊天机器人用户界面</span> </span></p>
<p>试试 MilMil，让我们知道你的想法。我们欢迎所有问题、意见或任何形式的反馈。</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">不要成为陌生人<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上查找或为 Milvus 投稿。</li>
<li>通过<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 与社区互动。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上与我们联系。</li>
</ul>
