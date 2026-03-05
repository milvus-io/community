---
id: graph-based-recommendation-system-with-milvus.md
title: How do recommendation systems work?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  Recommender systems can generate revenue, reduce costs, and offer a
  competitive advantage. Learn how to build one for free with open-source tools.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Building a Graph-based Recommendation System with Milvus, PinSage, DGL, and MovieLens Datasets</custom-h1><p>Recommendation systems are powered by algorithms that have <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">humble beginnings</a> helping humans sift through unwanted email. In 1990, the inventor Doug Terry used a collaborative filtering algorithm to sort desirable email from junk mail. By simply “liking” or “hating” an email, in collaboration with others doing the same thing to similar mail content, users could quickly train computers to determine what to push through to a user’s inbox—and what to sequester to the junk mail folder.</p>
<p>In a general sense, recommendation systems are algorithms that make relevant suggestions to users. Suggestions can be movies to watch, books to read, products to buy, or anything else depending on the scenario or industry. These algorithms are all around us, influencing the content we consume and the products we purchase from major tech companies such as Youtube, Amazon, Netflix and many more.</p>
<p>Well designed recommendation systems can be essential revenue generators, cost reducers, and competitive differentiators. Thanks to open-source technology and declining compute costs, customized recommendation systems have never been more accessible. This article explains how to use Milvus, an open-source vector database; PinSage, a graph convolutional neural network (GCN); deep graph library (DGL), a scalable python package for deep learning on graphs; and MovieLens datasets to build a graph-based recommendation system.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">How do recommendation systems work?</a></li>
<li><a href="#tools-for-building-a-recommender-system">Tools for building a recommender system</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Building a graph-based recommender system with Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">How do recommendation systems work?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>There are two common approaches to building recommendation systems: collaborative filtering and content-based filtering. Most developers make use of either or both methods and, though recommendation systems can vary in complexity and construction, they typically include three core elements:</p>
<ol>
<li><strong>User model:</strong> Recommender systems require modeling user characteristics, preferences, and needs. Many recommendation systems base their suggestion on implicit or explicit item-level input from users.</li>
<li><strong>Object model:</strong> Recommender systems also model items in order to make item recommendations based on user portraits.</li>
<li><strong>Recommendation algorithm:</strong> The core component of any recommendation system is the algorithm that powers its recommendations. Commonly used algorithms include collaborative filtering, implicit semantic modeling, graph-based modeling, combined recommendation, and more.</li>
</ol>
<p>At a high level, recommender systems that rely on collaborative filtering build a model from past user behavior (including behavior inputs from similar users) to predict what a user might be interested in. Systems that rely on content-based filtering use discrete, predefined tags based on item characteristics to recommend similar items.</p>
<p>An example of collaborative filtering would be a personalized radio station on Spotify that is based on a user’s listening history, interests, music library and more. The station plays music that the user hasn’t saved or otherwise expressed interest in, but that other users with similar taste often have. A content-based filtering example would be a radio station based on a specific song or artist that uses attributes of the input to recommend similar music.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">Tools for building a recommender system<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>In this example, building a graph-based recommendation system from scratch depends on the following tools:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage: A graph convolutional network</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a> is a random-walk graph convolutional network capable of learning embeddings for nodes in web-scale graphs containing billions of objects. The network was developed by <a href="https://www.pinterest.com/">Pinterest</a>, an online pinboard company, to offer thematic visual recommendations to its users.</p>
<p>Pinterest users can “pin” content that interests them to “boards,” which are collections of pinned content. With over <a href="https://business.pinterest.com/audience/">478 million</a> monthly active users (MAU) and over <a href="https://newsroom.pinterest.com/en/company">240 billion</a> objects saved, the company has an immense amount of user data that it must build new technology to keep up with.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
    <span>1.png</span>
  </span>
</p>
<p>PinSage uses pins-boards bipartite graphs to generate high-quality embeddings from pins that are used to recommend visually similar content to users. Unlike traditional GCN algorithms, which perform convolutions on the feature matrices and the full graph, PinSage samples the nearby nodes/Pins and performs more efficient local convolutions through dynamic construction of computational graphs.</p>
<p>Performing convolutions on the entire neighborhood of a node will result in a massive computational graph. To reduce resource requirements, traditional GCN algorithms update a node’s representation by aggregating information from its k-hop neighborhood. PinSage simulates random-walk to set frequently visited content as the key neighborhood and then constructs a convolution based on it.</p>
<p>Because there is often overlap in k-hop neighborhoods, local convolution on nodes results in repeated computation. To avoid this, in each aggregate step PinSage maps all nodes without repeated calculation, then links them to the corresponding upper-level nodes, and finally retrieves the embeddings of the upper-level nodes.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Deep Graph Library: A scalable python package for deep learning on graphs</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
    <span>dgl-framework-building-graph-based-recommender-milvus.png</span>
  </span>
</p>
<p><a href="https://www.dgl.ai/">Deep Graph Library (DGL)</a> is a Python package designed for building graph-based neural network models on top of existing deep learning frameworks (e.g., PyTorch, MXNet, Gluon, and more). DGL includes a user friendly backend interface, making it easy to implant in frameworks based on tensors and that support automatic generation. The PinSage algorithm mentioned above is optimized for use with DGL and PyTorch.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: An open-source vector database built for AI and similarity search</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
    <span>how-does-milvus-work.png</span>
  </span>
</p>
<p>Milvus is an open-source vector database built to power vector similarity search and artificial intelligence (AI) applications. At a high level, Using Milvus for similarity search works as follows:</p>
<ol>
<li>Deep learning models are used to convert unstructured data to feature vectors, which are imported into Milvus.</li>
<li>Milvus stores and indexes the feature vectors.</li>
<li>Upon request, Milvus searches and returns vectors most similar to an input vector.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Building a graph-based recommendation system with Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
    <span>beike-intelligent-house-platform-diagram.jpg</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
    <span>3-building-graph-based-recommender-system.png</span>
  </span>
</p>
<p>Building a graph-based recommendation system with Milvus involves the following steps:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">Step 1: Preprocess data</h3><p>Data preprocessing involves turning raw data into a more easily understandable format. This example uses the open data sets MovieLens[5] (m1–1m), which contain 1,000,000 ratings of 4,000 movies contributed by 6,000 users. This data was collected by GroupLens and includes movie descriptions, movie ratings, and user characteristics.</p>
<p>Note that the MovieLens datasets used in this example requires minimal data cleaning or organization. However, if you are using different datasets your mileage may vary.</p>
<p>To begin building a recommendation system, build a user-movie bipartite graph for classification purposes using historical user-movie data from the MovieLens dataset.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">Step 2: Train model with PinSage</h3><p>Embedding vectors of pins generated using the PinSage model are feature vectors of the acquired movie information. Create a PinSage model based on bipartite graph g and the customized movie feature vector dimensions (256-d by default). Then, train the model with PyTorch to obtain the h_item embeddings of 4,000 movies.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">Step 3: Load data</h3><p>Load the movie embeddings h_item generated by the PinSage model into Milvus, which will return the corresponding IDs. Import the IDs and the corresponding movie information into MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">Step 4: Conduct vector similarity search</h3><p>Get the corresponding embeddings in Milvus based on the movie IDs, then use Milvus to carry run similarity search with these embeddings. Next, identify the corresponding movie information in a MySQL database.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">Step 5: Get recommendations</h3><p>The system will now recommend movies most similar to user search queries. This is the general workflow for building a recommendation system. To quickly test and deploy recommender systems and other AI applications, try the Milvus <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus can power more than recommender systems<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is a powerful tool capable of powering a vast array of artificial intelligence and vector similarity search applications. To learn more about the project, check out the following resources:</p>
<ul>
<li>Read our <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interact with our open-source community on <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Use or contribute to the world’s most popular vector database on <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
</ul>
