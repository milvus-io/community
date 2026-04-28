---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: Background Introduction
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: How to build a deep learning powered recommender system
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>Building Personalized Recommender Systems with Milvus and PaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">Background Introduction<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>With the continuous development of network technology and the ever-expanding scale of e-commerce, the number and variety of goods grow rapidly and users need to spend a lot of time to find the goods they want to buy. This is information overload. In order to solve this problem, recommendation system came into being.</p>
<p>The recommendation system is a subset of the Information Filtering System, which can be used in a range of areas such as movies, music, e-commerce, and Feed stream recommendations. The recommendation system discovers the user’s personalized needs and interests by analyzing and mining user behaviors, and recommends information or products that may be of interest to the user. Unlike search engines, recommendation system do not require users to accurately describe their needs, but model their historical behavior to proactively provide information that meets user interests and needs.</p>
<p>In this article we use PaddlePaddle, a deep learning platform from Baidu, to build a model and combine Milvus, a vector similarity search engine, to build a personalized recommendation system that can quickly and accurately provide users with interesting information.</p>
<h2 id="Data-Preparation" class="common-anchor-header">Data Preparation<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>We take MovieLens Million Dataset (ml-1m) [1] as an example. The ml-1m dataset contains 1,000,000 reviews of 4,000 movies by 6,000 users, collected by the GroupLens Research lab. The original data includes feature data of the movie, user feature, and user rating of the movie, you can refer to ml-1m-README [2] .</p>
<p>ml-1m dataset includes 3 .dat articles: movies.dat、users.dat and ratings.dat.movies.dat includes movie’s features, see example below:</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>This means that the movie id is 1, and the title is 《Toy Story》, which is divided into three categories. These three categories are animation, children, and comedy.</p>
<p>users.dat includes user’s features, see example below:</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>This means that the user ID is 1, female, and younger than 18 years old. The occupation ID is 10.</p>
<p>ratings.dat includes the feature of movie rating, see example below:</p>
<p>UserID::MovieID::Rating::Timestamp
1::1193::5::978300760</p>
<p>That is, the user 1 evaluates the movie 1193 as 5 points.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">Fusion Recommendation Model<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>In the film personalized recommendation system we used the Fusion Recommendation Model [3] which PaddlePaddle has implemented. This model is created from its industrial practice.</p>
<p>First, take user features and movie features as input to the neural network, where:</p>
<ul>
<li>The user features incorporate four attribute information: user ID, gender, occupation, and age.</li>
<li>The movie feature incorporate three attribute information: movie ID, movie type ID, and movie name.</li>
</ul>
<p>For the user feature, map the user ID to a vector representation with a dimension size of 256, enter the fully connected layer, and do similar processing for the other three attributes. Then the feature representations of the four attributes are fully connected and added separately.</p>
<p>For movie features, the movie ID is processed in a manner similar to the user ID. The movie type ID is directly input into the fully connected layer in the form of a vector, and the movie name is represented by a fixed-length vector using a text convolutional neural network. The feature representations of the three attributes are then fully connected and added separately.</p>
<p>After obtaining the vector representation of the user and the movie, calculate the cosine similarity of them as the score of the personalized recommendation system. Finally, the square of the difference between the similarity score and the user’s true score is used as the loss function of the regression model.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
    <span>1-user-film-personalized-recommender-Milvus.jpg</span>
  </span>
</p>
<h2 id="System-Overview" class="common-anchor-header">System Overview<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Combined with PaddlePaddle’s fusion recommendation model, the movie feature vector generated by the model is stored in the Milvus vector similarity search engine, and the user feature is used as the target vector to be searched. Similarity search is performed in Milvus to obtain the query result as the recommended movies for the user.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
    <span>2-system-overview.jpg</span>
  </span>
</p>
<blockquote>
<p>The inner product (IP) method is provided in Milvus to calculate the vector distance. After normalizing the data, the inner product similarity is consistent with the cosine similarity result in the fusion recommendation model.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">Application of Personal Recommender System<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>There are three steps in building a personalized recommendation system with Milvus, details on how to operate please refer to Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">Step 1：Model Training</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>Running this command will generate a model recommender_system.inference.model in the directory, which can convert movie data and user data into feature vectors, and generate application data for Milvus to store and retrieve.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">Step 2：Data Preprocessing</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>Running this command will generate test data movies_data.txt in the directory to achieve pre-processing of movie data.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">Step 3：Implementing Personal Recommender System with Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>Running this command will implement personalized recommendations for specified users.</p>
<p>The main process is:</p>
<ul>
<li>Through the load_inference_model, the movie data is processed by the model to generate a movie feature vector.</li>
<li>Load the movie feature vector into Milvus via milvus.insert.</li>
<li>According to the user’s age / gender / occupation specified by the parameters, it is converted into a user feature vector, milvus.search_vectors is used for similarity retrieval, and the result with the highest similarity between the user and the movie is returned.</li>
</ul>
<p>Prediction of the top five movies that the user is interested in:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
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
    </button></h2><p>By inputing user information and movie information to the fusion recommendation model we can get matching scores, and then sort the scores of all movies based on the user to recommend movies that may be of interest to the user. <strong>This article combines Milvus and PaddlePaddle to build a personalized recommendation system. Milvus, a vector search engine, is used to store all movie feature data, and then similarity retrieval is performed on user features in Milvus.</strong> The search result is the movie ranking recommended by the system to the user.</p>
<p>Milvus [5] vector similarity search engine is compatible with various deep learning platforms, searching billions of vectors with only millisecond response. You can explore more possibilities of AI applications with Milvus with ease!</p>
<h2 id="Reference" class="common-anchor-header">Reference<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>Fusion Recommendation Model by PaddlePaddle: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
