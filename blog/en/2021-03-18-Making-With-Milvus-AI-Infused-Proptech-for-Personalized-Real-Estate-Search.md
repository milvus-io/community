---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: Making With Milvus AI-Infused Proptech for Personalized Real Estate Search
author: milvus
date: 2021-03-18 03:53:54.736+00
desc: AI is transforming the real estate industry, discover how intelligent proptech accelerates the home search and purchase process. 
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
  
# Making With Milvus: AI-Infused Proptech for Personalized Real Estate Search
Artificial intelligence (AI) has [powerful applications](https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b) in real estate that are transforming the home search process. Tech savvy real estate professionals have been taking advantage of AI for years, recognizing its ability to help clients find the right home faster and simplify the process of purchasing property. The coronavirus pandemic has [accelerated](https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html) interest, adoption, and investement in property technology (or proptech) worldwide, suggesting it will play an increasingly greater role in the real estate industry moving forward. 

This article explores how [Beike](https://bj.ke.com/) used vector similarity search to build a house hunting platform that provides personalized results and recommends listings in near real-time.

### What is vector similarity search?

[Vector similarity search](https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab) has applications spanning a wide variety of artificial intelligence, deep learning, and traditional vector calculation scenarios. The proliferation of AI technology is in part attributed to vector search and its ability to make sense of unstructured data, which includes things like images, video, audio, behavior data, documents, and much more.

Unstructured data makes up an estimated 80-90% of all data, and extracting insights from it is quickly becoming a requrement for businesses that want to remain competitive in an ever-changing world. Increasing demand for unstructured data analytics, rising compute power, and declining compute costs have made AI-enabled vector search more accessible than ever.

![beike-blog-img1.jpg](https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg "Understanding the difference between structured and unstructured data.")


Traditionally, unstructured data has been a challenge to process and analyze at scale because it doesn't follow a predefined model or organizational structure. Neural networks (e.g., CNN, RNN, and BERT) make it possible to convert unstructured data into feature vectors, a numerical data format that can be easily interpreted by computers. Algorithms are then used to calculate similarity between vectors using metrics like cosine similarity or Euclidean distance.

Ultimately, vector similarity search is a broad term that desribes techniques for identifying similar things in massive datasets. Beike uses this technology to power an intelligent home search engine that automatically recommends listings based on individual user preferences, search history, and property criteria—accelerating the real estate search and purchase process. Milvus is an open-source vector database that connects information with algorithms, enabling Beike to develop and manage its AI real estate platform.

<br/>

### How does Milvus manage vector data?

Milvus was built specifically for large-scale vector data management, and has applications spanning image and video search, chemical similarity analysis, personalized recommendation systems, conversational AI, and much more. Vector datasets stored in Milvus can be efficiently queried, with most implementations following this general process:

![beike-blog-img2.jpg](https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg "How does Milvus manage vector data?")

<br/>

### How does Beike use Milvus to make house hunting smarter?

Commonly described as China's answer to Zillow, Beike is an online platform that allows real estate agents to list properties for rent or sale. To help improve the home search experience for house hunters, and to help agents close deals faster, the company built an AI-powered search engine for its listing database. Beike’s real estate listing database was converted into feature vectors then fed into Milvus for indexing and storage. Milvus is then used to conduct similarity search based on an input listing, search criteria, user profile, or other criteria.

For example, when searching for more homes similar to a given listing, features such as floor plan, size, orientation, interior finishings, paint colors, and more are extracted. Since the original database of property listings listing data has been [indexed](https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212), searches can be conducted in mere milliseconds. Beike’s final product had an average query time of 113 milliseconds on a dataset containing over 3 million vectors. However, Milvus is capable of maintaining efficient speeds on trillion-scale datasets—making light work of this relatively small real estate database. In general, the system follows the following process:

1. Deep learning models (e.g., CNN, RNN, or BERT) convert unstructured data to feature vectors, which are then imported to Milvus.

2. Milvus stores and indexes the feature vectors.

3. Milvus returns similarity search results based on user queries. 

![milvus-overview-diagram.png](https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png "An overview of Milvus.")


<br/>

Beike’s intelligent real estate search platform is powered by a recommendation algorithm that calculates vector similarity using cosine distance. The system finds similar homes based on favorite listings and search criteria. At a high level, it works as follows:

1. Based on an input listing, characteristics such as floor plan, size, and orientation are used to extract 4 collections of feature vectors.

2. The extracted feature collections are used to perform similarity search in Milvus. Results of the query for each collection of vectors are a measure of similarity between the input listing and other similar listings. 

3. The search results from each of the 4 vector collections are compared then used to recommend similar homes. 

![beike-intelligent-house-platform-diagram.jpg](https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg "An overview of Beike’s intelligent house hunting platform.")


<br/>

As the figure above shows, the system implements an A/B table switching mechanism for updating data. Milvus stores the data for the first T days in table A, on day T+1 it starts to store data in table B, on day 2T+1, it starts to rewrite table A, and so forth. 

<br/>

### To learn more about making things with Milvus, check out the following resources:

- [Building an AI-Powered Writing Assistant for WPS Office](https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office)

- [Making with Milvus: AI-Powered News Recommendation Inside Xiaomi's Mobile Browser](https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser)
  