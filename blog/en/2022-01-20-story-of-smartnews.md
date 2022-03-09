---
id: 2022-01-20-story-of-smartnews.md
title: The Story of SmartNews - from a Milvus User to an Active Contributor
author: Milvus
date: 2022-01-20
desc: Learn about the story of SmartNews, both a Milvus user and contributor.
cover: assets.zilliz.com/Smart_News_from_a_Milvus_User_to_an_Active_Contributor_ca8415fad2.png
tag: Scenarios
---

This article is translated by [Angela Ni](https://www.linkedin.com/in/yiyun-n-2aa713163/).


Information is everywhere in our lives. Meta (formerly known as Facebook), Instagram, Twitter, and other social media platforms make information streams all the more ubiquitous. Therefore, engines dealing with such information streams have become a must-have in most system architecture. However, as a user of social media platforms and relevant apps, I bet you must have been bothered by duplicate articles, news, memes, and more. Exposure to duplicate content hampers the process of information retrieval and leads to bad user experience.


For a product dealing with information streams, it is a high priority for the developers to find a flexible data processor that can be integrated seamlessly into the system architecture to deduplicate identical news or advertisements.

[SmartNews](https://www.smartnews.com/en/), valued at [2 billion US dollars](https://techcrunch.com/2021/09/15/news-aggregator-smartnews-raises-230-million-valuing-its-business-at-2-billion/), is the most highly-valued news app company in the US. Noticeably, it used to be a user of Milvus, an open-source vector database, but later transformed into an active contributor to the Milvus project.

This article shares the story of SmartNews and tells why it decided to make contributions to the Milvus project.

## An overview of SmartNews

SmartNews, founded in 2012, is headquartered in Tokyo, Japan. The news app developed by SmartNews has always been [top-rated](https://www.businessinsider.com/guides/smartnews-free-news-app-2018-9) in the Japanese market. SmartNews is the [fastest growing](https://about.smartnews.com/en/2019/06/12/smartnews-builds-global-momentum-with-over-500-us-growth-new-executives-and-three-new-offices/) news app and also boasts [high user viscosity](https://about.smartnews.com/en/2018/07/21/smartnews-reaches-more-than-10-million-monthly-active-users-in-the-united-states-and-japan/) in the US market. According to the statistics from [APP Annie](https://www.appannie.com/en/), the monthly average session duration of SmartNews ranked first among all news apps by the end of July, 2021, greater than the accumulated session duration of AppleNews and Google News.

With the rapid growth of user base and viscosity, SmartNews has to face more challenges in terms of recommendation mechanism and AI algorithm. Such challenges include utilizing massive discrete features in large-scale machine learning (ML), accelerating unstructured data query with vector similarity search, and more.

At the beginning of 2021, the dynamic Ad algorithm team at SmartNews sent a request to AI infrastructure team that the functions of recalling and querying advertisements need to be optimized. After two months of research, AI infrastructure engineer Shu decided to use Milvus, an open-source vector database that supports multiple indexes and similarity metrics and online data updates. Milvus is trusted by more than a thousand organizations worldwide.

## Advertisement recommendation powered by vector similarity search

The open-source vector database Milvus is adopted in the SmartNews Ad system to match and recommend dynamic ads from a 10-milllion-scale dataset to its users. By doing so, SmartNews can create a mapping relationship between two previously unmatchable datasets - user data and advertisement data. In the second quarter of 2021, Shu managed to deploy Milvus 1.0 on Kubernetes. Learn more about how to [deploy Milvus](https://milvus.io/docs).

![img](https://assets.zilliz.com/image1_2a88ed162f.png "Milvus documentation.")

After the successful deployment of Milvus 1.0, the first project to use Milvus was the advertisement recall project initiated by the Ad team at SmartNews. During the initial stage, the advertisement dataset was on a million scale. Meanwhile, the P99 latency was strictly controlled within less than 10 milliseconds.

In June, 2021, Shu and his colleagues in the algorithm team applied Milvus to more business scenarios and attempted data aggregation and online data/index update in real time.

By now, Milvus, the open-source vector database has been used in various business scenarios at SmartNews, including ad recommendation.

## **From a user to an active contributor**

While integrating Milvus into the Smartnews product architecture, Shu and other developers came up with requests of functions such as hot reload, item TTL (time-to-live), item update/replace, and more. These are also functions desired by many users in the Milvus community. Therefore, Dennis Zhao, head of the AI infrastructure team at SmartNews decided to develop and contribute the hot reload function to the community. Dennis believed that "SmartNews team has been benefiting from the Milvus community, therefore, we are more than willing to contribute if we have something to share with the community."

Data reload supports code editing while running the code. With the help of data reload, developers no longer need to stop at a breakpoint or restart the application. Instead, they can edit the code directly and see the result in real time.

In late July, Yusup, engineer at SmartNews proposed an idea of using [collection alias](https://milvus.io/docs/v2.0.0/collection_alias.md?python#Collection-Alias) to achieve hot reload.

Creating collection alias refers to specifying alias names for a collection. A collection can have multiple aliases. However, an alias corresponds to a maximum of one collection. Simply draw an analogy between a collection and a locker. A locker, like a collection, has its own number and position, which will always remain unchanged. However, you can always put in and draw out different things from the locker. Similarly, the name of the collection is fixed but the data in the collection is dynamic. You can always insert or delete vectors in a collection, as data deletion is supported in the Milvus [pre-GA version](https://milvus.io/docs/v2.0.0/release_notes.md#v200-PreGA).

In the case of SmartNews advertisement business, nearly 100 million vectors are inserted or updated as new dynamic ad vectors are generated. There are several solutions to this:

- Solution 1: delete old data first and insert new ones.
- Solution 2: create a new collection for new data.
- Solution 3: use collection alias.

For solution 1, one of the most straightforward shortcoming is that it is extremely time-consuming, especially when the dataset to be updated is tremendous. It generally takes hours to update a dataset on a 100-million-scale.

As for solution 2, the problem is that the new collection is not immediately available for search. That is to say, a collection is not searchable during load. Plus, Milvus does not allow two collections to use the same collection name. Switching to a new collection would always require users to manually modify the client side code. That is to say, users have to revise the value of the parameter `collection_name` every time they need to switch between collections.

Solution 3 would be the silver bullet. You only need to insert the new data in a new collection and use collection alias. By doing so, you only need to swap the collection alias every time you need to switch the collection to conduct the search. You do not need extra efforts to revise the code. This solution saves you the troubles mentioned in the previous two solutions.

Yusup started from this request and helped the whole SmartNews team understand the Milvus architecture. After one and half months, the Milvus project received a PR about hot reload from Yusup. And later, this function is officially available along with the release of Milvus 2.0.0-RC7.

Currently, the AI infrastructure team is taking the lead to deploy Milvus 2.0 and migrate all data gradually from Milvus 1.0 to 2.0.

![img_collection alias](https://assets.zilliz.com/image2_96c064a627.png "Collection alis doc.")


Support for collection alias can greatly improve user experience, especially for those large Internet companies with great volumes of user requests. Chenglong Li, data engineer from the Milvus community, who helped build the bridge between Milvus and Smartnews, said, "The collection alias function arises from the real business request of SmartNews, a Milvus user. And SmartNews contributed the code to the Milvus community. This act of reciprocity is a great example of the open-source spirit: from the community and for the community. We hope to see more contributors like SmartNews and jointly build a more prosperous Milvus community."

"Currently, part of the ad business is adopting Milvus as the offline vector database. The official release of Mivus 2.0 is approaching, and we hope that we can use Milvus to build more reliable systems and provide real-time services for more business scenarios." said Dennis.

> Update: Milvus 2.0 is now general available! [Learn more](2022-1-25-annoucing-general-availability-of-milvus-2-0.md)
