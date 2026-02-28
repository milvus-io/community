---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: MilMil A Milvus-powered FAQ Chatbot that Answers Questions About Milvus
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: Using open-source vector search tools to build a question answering service.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil: A Milvus-powered FAQ Chatbot that Answers Questions About Milvus</custom-h1><p>open-source community recently created MilMil—a Milvus FAQ chatbot built by and for Milvus users. MilMil is available 24/7 at <a href="https://milvus.io/">Milvus.io</a> to answer common questions about Milvus, the world’s most advanced open-source vector database.</p>
<p>This question answering system not only helps solve common problems Milvus users encounter more quickly, but identifies new problems based on user submissions. MilMil’s database includes questions users have asked since the project was first released under an open-source license in 2019. Questions are stored in two collections, one for Milvus 1.x and earlier and another for Milvus 2.0.</p>
<p>MilMil is currently only available in English.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">How does MilMil work?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil relies on the <em>sentence-transformers/paraphrase-mpnet-base-v2</em> model to obtain vector representations of the FAQ database, then Milvus is used for vector similarity retrieval to return semantically similar questions.</p>
<p>First, the FAQ data is converted into semantic vectors using BERT, a natural language processing (NLP) model. The embeddings are then inserted into Milvus and each one assigned a unique ID. Finally, the questions and answers are inserted into PostgreSQL, a relational database, together with their vector IDs.</p>
<p>When users submit a question, the system converts it into a feature vector using BERT. Next it searches Milvus for five vectors that are most similar to the query vector and retrieves their IDs. Finally, the questions and answers that correspond with the retrieved vector IDs are returned to the user.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
    <span>system-process.png</span>
  </span>
</p>
<p>See the <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">question answering system</a> project in the Milvus bootcamp to explore the code used to build AI chatbots.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">Ask MilMil about Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>To chat with MilMil, navigate to any page on <a href="https://milvus.io/">Milvus.io</a> and click the bird icon in the lower-right corner. Type your question into the text input box and hit send. MilMil will get back to you in milliseconds! Additionally, the dropdown list in the upper-left corner can be used to switch between technical documentation for different versions of Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
    <span>milvus-chatbot-icon.png</span>
  </span>
</p>
<p>After submitting a question, the bot immediately returns three questions that are semantically similar to the query question. You can click “See answer” to browse potential answers to your question, or click “See more” to view more questions related to your search. If a suitable answer is unavailable, click “Put in your feedback here” to ask your question along with an email address. Help from the Milvus community will arrive shortly!</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
    <span>chatbot_UI.png</span>
  </span>
</p>
<p>Give MilMil a try and let us know what you think. All questions, comments, or any form of feedback are welcome.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Don’t be a stranger<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Find or contribute to Milvus on <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interact with the community via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connect with us on <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
