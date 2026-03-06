---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: Build Semantic Search at Speed
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: >-
  Learn more about using semantic machine learning methodologies to power more
  relevant search results across your organization.
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>Build Semantic Search at Speed</custom-h1><p><a href="https://lucidworks.com/post/what-is-semantic-search/">Semantic search</a> is a great tool to help your customers—or your employees—find the right products or information. It can even surface difficult-to-index information for better results. That said, if your semantic methodologies aren’t being deployed to work fast, they won’t do you any good. The customer or employee isn’t just going to sit around while the system takes its time responding to their query—and a thousand others are likely being ingested at the same time.</p>
<p>How can you make semantic search fast? Slow semantic search isn’t going to cut it.</p>
<p>Fortunately, this is the kind of problem Lucidworks loves to solve. We recently tested a modest-sized cluster—read on for more details—that resulted in 1500 RPS (requests per second) against a collection of over one million documents, with an average response time of roughly 40 milliseconds. Now that’s some serious speed.</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">Implementing Semantic Search</h3><p>To make lightning-fast, machine learning magic happen, Lucidworks has implemented semantic search using the semantic vector search approach. There are two critical parts.</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">Part One: The Machine Learning Model</h4><p>First, you need a way to encode text into a numerical vector. The text could be a product description, a user search query, a question, or even an answer to a question. A semantic search model is trained to encode text such that text that is semantically similar to other text is encoded into vectors that are numerically “close” to one another. This encoding step needs to be fast in order to support the thousand or more possible customer searches or user queries coming in every second.</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">Part Two: The Vector Search Engine</h4><p>Second, you need a way to quickly find the best matches to the customer search or user query. The model will have encoded that text into a numerical vector. From there, you need to compare that to all the numerical vectors in your catalog or lists of questions and answers to find those best matches—the vectors that are “closest” to the query vector. For that, you will need a vector engine that can handle all of that information effectively and at lightning speed. The engine could contain millions of vectors and you really just want the best twenty or so matches to your query. And of course, it needs to handle a thousand or so such queries every second.</p>
<p>To tackle these challenges, we added the vector search engine <a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a> in our <a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">Fusion 5.3 release</a>. Milvus is open-source software and it is fast. Milvus uses FAISS (<a href="https://ai.facebook.com/tools/faiss/">Facebook AI Similarity Search</a>), the same technology Facebook uses in production for its own machine learning initiatives. When needed, it can run even faster on <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a>. When Fusion 5.3 (or higher) is installed with the machine learning component, Milvus is automatically installed as part of that component so you can turn on all of these capabilities with ease.</p>
<p>The size of the vectors in a given collection, specified when the collection is created, depends on the model that produces those vectors. For example, a given collection could store the vectors created from encoding (via a model) all of the product descriptions in a product catalog. Without a vector search engine like Milvus, similarity searches would not be feasible across the entire vector space. So, similarity searches would have to be limited to pre-selected candidates from the vector space (for example, 500) and would have both slower performance and lower quality results. Milvus can store hundreds of billions of vectors across multiple collections of vectors to ensure that search is fast and results are relevant.</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">Using Semantic Search</h3><p>Let’s get back to the semantic search workflow, now that we’ve learned a little about why Milvus might be so important. Semantic search has three stages. During the first stage, the machine learning model is loaded and/or trained. Afterwards, data is indexed into Milvus and Solr. The final stage is the query stage, when the actual search occurs. We’ll focus on those last two stages below.</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Indexing into Milvus</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
    <span>Lucidworks-1.png</span>
  </span>
</p>
<p>As shown in the above diagram, the query stage begins similarly to the indexing stage, just with queries coming in instead of documents. For each query:</p>
<ol>
<li>The query is sent to the <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a> index pipeline.</li>
<li>The query is then sent to the ML model.</li>
<li>The ML model returns a numeric vector (encrypted from the query). Again, the type of model determines the size of the vector.</li>
<li>The vector is sent to Milvus, which then determines which vectors, in the specified Milvus collection, best match the provided vector.</li>
<li>Milvus returns a list of unique IDs and distances corresponding to the vectors determined in step four.</li>
<li>A query containing those IDs and distances is sent to Solr.</li>
<li>Solr then returns an ordered list of the documents associated with those IDs.</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">Scale Testing</h3><p>In order to prove that our semantic search flows are running at the efficiency we require for our customers, we run scale tests using Gatling scripts on the Google Cloud Platform using a Fusion cluster with eight replicas of the ML model, eight replicas of the query service, and a single instance of Milvus. Tests were run using the Milvus FLAT and HNSW indexes. The FLAT index has 100% recall, but is less efficient – except when the datasets are small. The HNSW (Hierarchical Small World Graph) index still has high quality results and it has improved performance on larger datasets.</p>
<p>Let’s jump into some numbers from a recent example we ran:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
    <span>Lucidworks-2.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
    <span>Lucidworks-3.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
    <span>Lucidworks-4.png</span>
  </span>
</p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">Getting Started</h3><p>The <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a> pipelines are designed to be easy-to-use. Lucidworks has <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">pre-trained models that are easy-to-deploy</a> and generally have good results—though training your own models, in tandem with pre-trained models, will offer the best results. Contact us today to learn how you can implement these initiatives into your search tools to power more effective and delightful results.</p>
<blockquote>
<p>This blog is reposted from: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
