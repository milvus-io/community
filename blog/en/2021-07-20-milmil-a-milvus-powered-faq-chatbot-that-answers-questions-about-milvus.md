---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: MilMil A Milvus-powered FAQ Chatbot that Answers Questions About Milvus
author: milvus
date: 2021-07-20 07:21:43.897+00
desc: Using open-source vector search tools to build a question answering service.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
origin: zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---

# MilMil: A Milvus-powered FAQ Chatbot that Answers Questions About Milvus

open-source community recently created MilMil—a Milvus FAQ chatbot built by and for Milvus users. MilMil is available 24/7 at [Milvus.io](https://milvus.io/) to answer common questions about Milvus, the world's most advanced open-source vector database.

This question answering system not only helps solve common problems Milvus users encounter more quickly, but identifies new problems based on user submissions. MilMil's database includes questions users have asked since the project was first released under an open-source license in 2019. Questions are stored in two collections, one for Milvus 1.x and earlier and another for Milvus 2.0.

MilMil is currently only available in English.

## How does MilMil work?

MilMil relies on the _sentence-transformers/paraphrase-mpnet-base-v2_ model to obtain vector representations of the FAQ database, then Milvus is used for vector similarity retrieval to return semantically similar questions.

First, the FAQ data is converted into semantic vectors using BERT, a natural language processing (NLP) model. The embeddings are then inserted into Milvus and each one assigned a unique ID. Finally, the questions and answers are inserted into PostgreSQL, a relational database, together with their vector IDs.

When users submit a question, the system converts it into a feature vector using BERT. Next it searches Milvus for five vectors that are most similar to the query vector and retrieves their IDs. Finally, the questions and answers that correspond with the retrieved vector IDs are returned to the user.

![system-process.png](https://assets.zilliz.com/system_process_dca67a80a6.png)

###### _The blue line represents the data insertion process, and the black line represents the query process._

See the [question answering system](https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system) project in the Milvus bootcamp to explore the code used to build AI chatbots.

## Ask MilMil about Milvus

To chat with MilMil, navigate to any page on [Milvus.io](https://milvus.io/) and click the bird icon in the lower-right corner. Type your question into the text input box and hit send. MilMil will get back to you in milliseconds! Additionally, the dropdown list in the upper-left corner can be used to switch between technical documentation for different versions of Milvus.

![milvus-chatbot-icon.png](https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png)

###### _Click on the Milvus icon in the lower right corner to use Milvus FAQ Chatbot._

After submitting a question, the bot immediately returns three questions that are semantically similar to the query question. You can click "See answer" to browse potential answers to your question, or click "See more" to view more questions related to your search. If a suitable answer is unavailable, click "Put in your feedback here" to ask your question along with an email address. Help from the Milvus community will arrive shortly!

![chatbot_UI.png](https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png)

###### _MilMil's search results of "The way to install Milvus."_

Give MilMil a try and let us know what you think. All questions, comments, or any form of feedback are welcome.

## Don't be a stranger

- Find or contribute to Milvus on [GitHub](https://github.com/milvus-io/milvus/).
- Interact with the community via [Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ).
- Connect with us on [Twitter](https://twitter.com/milvusio).
