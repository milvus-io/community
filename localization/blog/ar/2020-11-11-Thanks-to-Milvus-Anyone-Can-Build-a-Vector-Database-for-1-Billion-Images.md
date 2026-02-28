---
id: Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md
title: 'Thanks to Milvus, Anyone Can Build a Vector Database for 1+ Billion Images'
author: milvus
date: 2020-11-11T07:13:02.135Z
desc: >-
  AI and open-source software make it possible to build a reverse image search
  engine with just one server and 10 lines of code. Search 1+ billion images in
  real time and more with Milvus, an open-source vector data management
  platform.
cover: assets.zilliz.com/build_search_9299109ca7.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images
---
<custom-h1>Thanks to Milvus, Anyone Can Build a Vector Database for 1+ Billion Images</custom-h1><p>Rising compute power and declining compute costs have made machine-scale analytics and artificial intelligence (AI) more accessible than ever before. In practice, this means with just one server and 10 lines of code, it is possible to build a reverse image search engine capable of querying 1+ billion images in real time. This article explains how <a href="https://milvus.io/">Milvus</a>, an open-source vector data management platform, can be used to create powerful systems for unstructured data processing and analysis, as well as the underlying technology that makes this all possible.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#thanks-to-milvus-anyone-can-build-a-vector-database-for-1-billion-images">Thanks to Milvus, Anyone Can Build a Vector Database for 1+ Billion Images</a>
<ul>
<li><a href="#how-does-ai-enable-unstructured-data-analytics">How does AI enable unstructured data analytics?</a></li>
<li><a href="#neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors">Neural networks convert unstructured data into computer-friendly feature vectors</a> - <a href="#ai-algorithms-convert-unstructured-data-to-vectors"><em>AI algorithms convert unstructured data to vectors</em></a></li>
<li><a href="#what-are-vector-data-management-platforms">What are vector data management platforms?</a></li>
<li><a href="#what-are-limitations-of-existing-approaches-to-vector-data-management">What are limitations of existing approaches to vector data management?</a> - <a href="#an-overview-of-milvus-architecture"><em>An overview of Milvus’ architecture.</em></a></li>
<li><a href="#what-are-applications-for-vector-data-management-platforms-and-vector-similarity-search">What are applications for vector data management platforms and vector similarity search?</a></li>
<li><a href="#reverse-image-search">Reverse image search</a> - <a href="#googles-search-by-image-feature"><em>Google’s “search by image” feature.</em></a>
<ul>
<li><a href="#video-recommendation-systems">Video recommendation systems</a></li>
<li><a href="#natural-language-processing-nlp">Natural language processing (NLP)</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus">Learn more about Milvus</a></li>
</ul></li>
</ul>
<h3 id="How-does-AI-enable-unstructured-data-analytics" class="common-anchor-header">How does AI enable unstructured data analytics?</h3><p>An oft-cited statistic is that 80% of the world’s data is unstructured, but just 1% ever gets analyzed. Unstructured data, including images, video, audio, and natural language, doesn’t follow a predefined model or manner of organization. This makes processing and analyzing large unstructured datasets difficult. As the proliferation of smartphones and other connected devices pushes unstructured data production to new heights, businesses are increasingly aware of how important insights derived from this nebulous information can be.</p>
<p>For decades, computer scientists have developed indexing algorithms tailored for organizing, searching, and analyzing specific data types. For structured data, there is bitmap, hash tables, and B-tree, which are commonly used in relational databases developed by tech giants such as Oracle and IBM. For semi-structured data, inverted indexing algorithms are standard, and can be found in popular search engines like <a href="http://www.solrtutorial.com/basic-solr-concepts.html">Solr</a> and <a href="https://www.elastic.co/blog/found-elasticsearch-from-the-bottom-up#inverted-indexes-and-index-terms">ElasticSearch</a>. However, unstructured data indexing algorithms rely on compute-intensive artificial intelligence that has only become widely accessible in the past decade.</p>
<h3 id="Neural-networks-convert-unstructured-data-into-computer-friendly-feature-vectors" class="common-anchor-header">Neural networks convert unstructured data into computer-friendly feature vectors</h3><p>Using neural networks (e.g. <a href="https://en.wikipedia.org/wiki/Convolutional_neural_network">CNN</a>, <a href="https://en.wikipedia.org/wiki/Recurrent_neural_network">RNN</a>, and <a href="https://towardsdatascience.com/bert-explained-state-of-the-art-language-model-for-nlp-f8b21a9b6270">BERT</a>) unstructured data can be converted into feature vectors (a.k.a., embeddings), which are a string of integers or floats. This numerical data format is far more readily processed and analyzed by machines. Applications spanning reverse image search, video search, natural language processing (NLP) and more can be built by embedding unstructured data into feature vectors, then calculating similarity between vectors using measures like Euclidean distance or cosine similarity.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_2_db8c16aea4.jpeg" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_2.jpeg" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_2.jpeg" />
    <span>Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_2.jpeg</span>
  </span>
</p>
<p>Computing vector similarity is a relatively simple process that relies on established algorithms. However, unstructured datasets, even after being converted into feature vectors, are typically several orders of magnitude larger than traditional structured and semi-structured datasets. Vector similarity search is complicated by the sheer storage space and compute power required to efficiently and accurately query massive-scale unstructured data.
However, if some degree of accuracy can be sacrificed, there are various approximate nearest neighbor (ANN) search algorithms that can drastically improve query efficiency for massive datasets with high dimensionality. These ANN algorithms decrease storage requirements and computation load by clustering similar vectors together, resulting in faster vector search. Commonly used algorithms include tree-based, graph-based, and combined ANNs.</p>
<h3 id="What-are-vector-data-management-platforms" class="common-anchor-header">What are vector data management platforms?</h3><p>Vector data management platforms are purpose-built applications for storing, processing, and analyzing massive vector datasets. These tools are designed to easily interface with large amounts of data, and include functionality that streamlines vector data management. Unfortunately, few systems exist that are both flexible and powerful enough to solve modern big data challenges. Milvus, a vector data management platform initiated by <a href="https://zilliz.com/">Zilliz</a> and released under an open-source license in 2019, attempts to fill this void.</p>
<h3 id="What-are-limitations-of-existing-approaches-to-vector-data-management" class="common-anchor-header">What are limitations of existing approaches to vector data management?</h3><p>A common way to build an unstructured data analytics system is to pair algorithms like ANN with open-source implementation libraries such as Facebook AI Similarity Search (Faiss). Due to several limitations, these algorithm-library combinations are not equivalent to a full-fledged vector data management system like Milvus. Existing technology used for managing vector data faces the following problems:</p>
<ol>
<li><strong>Flexibility:</strong> By default, existing systems typically store all data in main memory, meaning they cannot be run across multiple machines and are poorly suited for handling massive datasets.</li>
<li><strong>Dynamic data handling:</strong> Data is often assumed to be static once fed into existing systems, complicating processing for dynamic data and making near real-time search impossible.</li>
<li><strong>Advanced query processing:</strong> Most tools do not support advanced query processing (e.g., attribute filtering and multi-vector queries), which is essential for building useful similarity search engines.</li>
<li><strong>Heterogeneous computing optimizations:</strong> Few platforms offer optimizations for heterogenous system architectures on both CPUs and GPUs (excluding Faiss), leading to efficiency losses.</li>
</ol>
<p>Milvus attempts to overcome all of these limitations. The system enhances flexibility by offering support for a variety of application interfaces (including SDKs in Python, Java, Go, C++ and RESTful APIs), multiple vector index types (e.g., quantization-based indexes and graph-based indexes), and advanced query processing. Milvus handles dynamic vector data using a log-structured merge-tree (LSM tree), keeping data insertions and deletions efficient and searches humming along in real time. Milvus also provides optimizations for heterogeneous computing architectures on modern CPUs and GPUs, allowing developers to adjust systems for specific scenarios, datasets, and application environments.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_3_380e31d32c.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_3.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_3.png" />
    <span>Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_3.png</span>
  </span>
</p>
<p>Using various ANN indexing techniques, Milvus is able to achieve a 99% top-5 recall rate. The system is also capable of loading 1+ million data entries per minute. This results in query time of less than one second when running a reverse image search on 1 billion images. As a cloud native application that can operate as a distributed system deployed across multiple nodes, Milvus can easily and reliably achieve similar performance on datasets that contain 10, or even 100, billion images. Additionally, the system is not limited to image data, with applications spanning computer vision, conversational AI, recommendation systems, new drug discovery, and more.</p>
<h3 id="What-are-applications-for-vector-data-management-platforms-and-vector-similarity-search" class="common-anchor-header">What are applications for vector data management platforms and vector similarity search?</h3><p>As outlined above, a capable vector data management platform like Milvus paired with approximate nearest neighbor algorithms enables similarity search on gigantic volumes of unstructured data. This technology can be used to develop applications that span a diverse array of fields. Below we briefly explain several common use cases for vector data management tools and vector similarity search.</p>
<h3 id="Reverse-image-search" class="common-anchor-header">Reverse image search</h3><p>Major search engines like Google already give users the option to search by image. Additionally, e-commerce platforms have realized the benefits this functionality offers online shoppers, with Amazon incorporating image search into its smartphone applications.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Thanks_to_AI_Anyone_Can_Build_a_Search_Engine_for_1_Billion_Images_4_7884aabcd8.png" alt="Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_4.png" class="doc-image" id="blog_thanks-to-ai,-anyone-can-build-a-search-engine-for-1+-billion-images_4.png" />
    <span>Blog_Thanks to AI, Anyone Can Build a Search Engine for 1+ Billion Images_4.png</span>
  </span>
</p>
<p>Open-source software like Milvus makes it possible for any business to create their own reverse image search system, lowering the barriers to entry for this increasingly in-demand feature. Developers can use pre-trained AI models to convert their own image datasets into vectors, and then leverage Milvus to enable searching for similar products by image.</p>
<h4 id="Video-recommendation-systems" class="common-anchor-header">Video recommendation systems</h4><p>Major online video platforms like YouTube, which receives <a href="https://www.tubefilter.com/2019/05/07/number-hours-video-uploaded-to-youtube-per-minute/">500 hours of user generated content each minute</a>, present unique demands when it comes to content recommendation. In order to make relevant, real-time recommendations that take into consideration new uploads, video recommendation systems must offer lightning-fast query time and efficient dynamic data handling. By converting key frames into vectors and then feeding the results into Milvus, billions of videos can be searched and recommended in near real time.</p>
<h4 id="Natural-language-processing-NLP" class="common-anchor-header">Natural language processing (NLP)</h4><p>Natural language processing is a branch of artificial intelligence that aims to build systems that can interpret human languages. After converting text data into vectors, Milvus can be used to quickly identify and remove duplicate text, power semantic search, or even <a href="https://medium.com/unstructured-data-service/how-artificial-intelligence-empowered-professional-writing-f433c7e5b561%22%20/">build an intelligent writing assistant</a>. An effective vector data management platform helps maximize the utility of any NLP system.</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">Learn more about Milvus</h3><p>If you would like to learn more about Milvus visit our <a href="https://milvus.io/">website</a>. Additionally, our <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> offers several tutorials, with instructions for setting up Milvus, benchmark testing, and building a variety of different applications. If you’re interested in vector data management, artificial intelligence, and big data challenges, please join our open-source community on <a href="https://github.com/milvus-io">GitHub</a> and chat with us on <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p>
<p>Want more information about building an image search system? Check out this case study:</p>
<ul>
<li><a href="https://medium.com/vector-database/the-journey-to-optimize-billion-scale-image-search-part-1-a270c519246d">The Journey to Optimizing Billion-scale Image Search (1/2)</a></li>
<li><a href="https://medium.com/unstructured-data-service/the-journey-to-optimizing-billion-scale-image-search-2-2-572a36d5d0d">The Journey to Optimizing Billion-scale Image Search (2/2)</a></li>
</ul>
