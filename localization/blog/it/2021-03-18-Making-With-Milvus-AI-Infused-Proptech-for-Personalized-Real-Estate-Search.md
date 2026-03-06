---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: Making With Milvus AI-Infused Proptech for Personalized Real Estate Search
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: >-
  AI is transforming the real estate industry, discover how intelligent proptech
  accelerates the home search and purchase process.
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>Making With Milvus: AI-Infused Proptech for Personalized Real Estate Search</custom-h1><p>Artificial intelligence (AI) has <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">powerful applications</a> in real estate that are transforming the home search process. Tech savvy real estate professionals have been taking advantage of AI for years, recognizing its ability to help clients find the right home faster and simplify the process of purchasing property. The coronavirus pandemic has <a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">accelerated</a> interest, adoption, and investement in property technology (or proptech) worldwide, suggesting it will play an increasingly greater role in the real estate industry moving forward.</p>
<p>This article explores how <a href="https://bj.ke.com/">Beike</a> used vector similarity search to build a house hunting platform that provides personalized results and recommends listings in near real-time.</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">What is vector similarity search?</h3><p><a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">Vector similarity search</a> has applications spanning a wide variety of artificial intelligence, deep learning, and traditional vector calculation scenarios. The proliferation of AI technology is in part attributed to vector search and its ability to make sense of unstructured data, which includes things like images, video, audio, behavior data, documents, and much more.</p>
<p>Unstructured data makes up an estimated 80-90% of all data, and extracting insights from it is quickly becoming a requrement for businesses that want to remain competitive in an ever-changing world. Increasing demand for unstructured data analytics, rising compute power, and declining compute costs have made AI-enabled vector search more accessible than ever.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
    <span>beike-blog-img1.jpg</span>
  </span>
</p>
<p>Traditionally, unstructured data has been a challenge to process and analyze at scale because it doesn’t follow a predefined model or organizational structure. Neural networks (e.g., CNN, RNN, and BERT) make it possible to convert unstructured data into feature vectors, a numerical data format that can be easily interpreted by computers. Algorithms are then used to calculate similarity between vectors using metrics like cosine similarity or Euclidean distance.</p>
<p>Ultimately, vector similarity search is a broad term that desribes techniques for identifying similar things in massive datasets. Beike uses this technology to power an intelligent home search engine that automatically recommends listings based on individual user preferences, search history, and property criteria—accelerating the real estate search and purchase process. Milvus is an open-source vector database that connects information with algorithms, enabling Beike to develop and manage its AI real estate platform.</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">How does Milvus manage vector data?</h3><p>Milvus was built specifically for large-scale vector data management, and has applications spanning image and video search, chemical similarity analysis, personalized recommendation systems, conversational AI, and much more. Vector datasets stored in Milvus can be efficiently queried, with most implementations following this general process:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
    <span>beike-blog-img2.jpg</span>
  </span>
</p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">How does Beike use Milvus to make house hunting smarter?</h3><p>Commonly described as China’s answer to Zillow, Beike is an online platform that allows real estate agents to list properties for rent or sale. To help improve the home search experience for house hunters, and to help agents close deals faster, the company built an AI-powered search engine for its listing database. Beike’s real estate listing database was converted into feature vectors then fed into Milvus for indexing and storage. Milvus is then used to conduct similarity search based on an input listing, search criteria, user profile, or other criteria.</p>
<p>For example, when searching for more homes similar to a given listing, features such as floor plan, size, orientation, interior finishings, paint colors, and more are extracted. Since the original database of property listings listing data has been <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">indexed</a>, searches can be conducted in mere milliseconds. Beike’s final product had an average query time of 113 milliseconds on a dataset containing over 3 million vectors. However, Milvus is capable of maintaining efficient speeds on trillion-scale datasets—making light work of this relatively small real estate database. In general, the system follows the following process:</p>
<ol>
<li><p>Deep learning models (e.g., CNN, RNN, or BERT) convert unstructured data to feature vectors, which are then imported to Milvus.</p></li>
<li><p>Milvus stores and indexes the feature vectors.</p></li>
<li><p>Milvus returns similarity search results based on user queries.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
    <span>milvus-overview-diagram.png</span>
  </span>
</p>
<p><br/></p>
<p>Beike’s intelligent real estate search platform is powered by a recommendation algorithm that calculates vector similarity using cosine distance. The system finds similar homes based on favorite listings and search criteria. At a high level, it works as follows:</p>
<ol>
<li><p>Based on an input listing, characteristics such as floor plan, size, and orientation are used to extract 4 collections of feature vectors.</p></li>
<li><p>The extracted feature collections are used to perform similarity search in Milvus. Results of the query for each collection of vectors are a measure of similarity between the input listing and other similar listings.</p></li>
<li><p>The search results from each of the 4 vector collections are compared then used to recommend similar homes.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
    <span>beike-intelligent-house-platform-diagram.jpg</span>
  </span>
</p>
<p><br/></p>
<p>As the figure above shows, the system implements an A/B table switching mechanism for updating data. Milvus stores the data for the first T days in table A, on day T+1 it starts to store data in table B, on day 2T+1, it starts to rewrite table A, and so forth.</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">To learn more about making things with Milvus, check out the following resources:</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">Building an AI-Powered Writing Assistant for WPS Office</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Making with Milvus: AI-Powered News Recommendation Inside Xiaomi’s Mobile Browser</a></p></li>
</ul>
