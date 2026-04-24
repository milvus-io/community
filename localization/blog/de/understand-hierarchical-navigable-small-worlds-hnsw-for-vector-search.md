---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: |
  Understanding Hierarchical Navigable Small Worlds (HNSW) for Vector Search
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: >-
  HNSW (Hierarchical Navigable Small World) is an efficient algorithm for
  approximate nearest neighbor search using a layered graph structure.
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p>The key operation of <a href="https://milvus.io/blog/what-is-a-vector-database.md">vector databases</a> is <em>similarity search</em>, which involves finding the nearest neighbors in the database to a query vector, for example, by Euclidean distance. A naive method would calculate the distance from the query vector to every vector stored in the database and take the top-K closest. However, this clearly does not scale as the size of the database grows. In practice, a naive similarity search is practical only for databases with fewer than around 1 million vectors. How are we to scale our search to the 10s and 100s of millions, or even to the billions of vectors?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: Descending a hierarchy of vector search indices</em></p>
<p>Many algorithms and data structures have been developed to scale similarity search in high-dimensional vector spaces to sub-linear time complexity. In this article, we’ll explain and implement a popular and effective method called Hierarchical Navigable Small Worlds (HNSW), which is frequently the default choice for medium-sized vector datasets. It belongs to the family of search methods that construct a graph over the vectors, where vertices denote vectors and edges denote similarity between them. Search is performed by navigating the graph, in the simplest case, greedily traversing to the neighbor of the current node that is closest to the query and repeating until a local minimum is reached.</p>
<p>We will explain in more detail how the search graph is constructed, how the graph enables search, and at the end, link to an HNSW implementation, by yours truly, in simple Python.</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">Navigable Small Worlds<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: NSW graph created from 100 randomly located 2D points.</em></p>
<p>As mentioned, HNSW constructs a search graph offline before we can perform a query. The algorithm builds on top of prior work, a method called Navigable Small Worlds (NSW). We will explain NSW first and it will then be trivial to go from there to <em>Hierarchical</em> NSW. The illustration above is of a constructed search graph for NSW over 2-dimensional vectors. In all examples below, we restrict ourselves to 2-dimensional vectors so as to be able to visualize them.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Constructing the Graph<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>An NSW is a graph where the vertices represent vectors and the edges are constructed heuristically from the similarity between vectors so that most vectors are reachable from anywhere via a small number of hops. This is the so-called “small world” property that permits quick navigation. See the above figure.</p>
<p>The graph is initialized to be empty. We iterate through the vectors, adding each to the graph in turn. For each vector, starting at a random entry node, we greedily find the closest R nodes reachable from the entry point <em>in the graph so far constructed</em>. These R nodes are then connected to a new node representing the vector being inserted, optionally pruning any neighboring nodes that now have more than R neighbors. Repeating this process for all vectors will result in the NSW graph. See the above illustration visualizing the algorithm, and refer to the resources at the end of the article for a theoretical analysis of the properties of a graph constructed like this.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Searching the Graph<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>We have already seen the search algorithm from its use in graph construction. In this case, however, the query node is provided by the user, rather than being one for insertion into the graph. Starting from a random entry note, we greedily navigate to its neighbor closest to the query, maintaining a dynamic set of the closest vectors encountered so far. See the illustration above. Note that we can enhance search accuracy by initiating searches from multiple random entry points and aggregating the results, along with considering multiple neighbors at each step. However, these improvements come at the cost of increased latency.</p>
<custom-h1>Adding Hierarchy</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>So far, we have described the NSW algorithm and data structure that can help us scale up search in high-dimensional space. Nonetheless, the method suffers serious shortcomings, including failure in low dimensions, slow search convergence, and a tendency to be trapped in local minima.</p>
<p>The authors of HNSW fix these shortcomings with three modifications to NSW:</p>
<ul>
<li><p>Explicit selection of the entry nodes during construction and search;</p></li>
<li><p>Separation of edges by different scales; and,</p></li>
<li><p>Use of an advanced heuristic to select the neighbors.</p></li>
</ul>
<p>The first two are realized with a simple idea: building <em>a hierarchy of search graphs</em>. Instead of a single graph, as in NSW, HNSW constructs a hierarchy of graphs. Each graph, or layer, is individually searched in the same way as NSW. The top layer, which is searched first, contains very few nodes, and deeper layers progressively include more and more nodes, with the bottom layer including all nodes. This means that the top layers contain longer hops across the vector space, permitting a sort of course-to-fine search. See above for an illustration.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Constructing the Graph<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>The construction algorithm works as follows: we fix a number of layers, <em>L</em>, in advance. The value l=1 will correspond to the coarsest layer, where search begins, and l=L will correspond to the densest layer, where search finishes. We iterate through each vector to be inserted and sample an insertion layer following a truncated <a href="https://en.wikipedia.org/wiki/Geometric_distribution">geometric distribution</a> (either rejecting <em>l &gt; L</em> or setting <em>l’ =</em> min_(l, L)_). Say we sample <em>1 &lt; l &lt; L</em> for the current vector. We perform a greedy search on the top layer, L, until we reach its local minimum. Then, we follow an edge from the local minimum in the _L_th layer to the corresponding vector in the _(L-1)_th layer and use it as the entry point to greedily search the _(L-1)_th layer.</p>
<p>This process is repeated until we reach the _l_th layer. We then begin to create nodes for the vector to be inserted, connecting it to its closest neighbors found by greedy search in the _l_th layer so far constructed, navigating to the _(l-1)_th layer and repeating until we have inserted the vector into the _1_st layer. An animation above makes this clear</p>
<p>We can see that this hierarchical graph construction method uses a clever explicit selection of the insertion node for each vector. We search the layers above the insertion layer constructed so far, searching efficiently from course-to-fine distances. Relatedly, the method separates links by different scales in each layer: the top layer affords long-scale hops across the search space, with the scale diminishing down to the bottom layer. Both of these modifications help avoid being trapped in sub-optimal minima and hasten search convergence at the cost of additional memory.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Searching the Graph<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>The search procedure works much like the inner graph construction step. Starting from the top layer, we greedily navigate to the node or nodes closest to the query. Then we follow that node(s) down to the next layer and repeat the process. Our answer is obtained by the list of <em>R</em> closest neighbors in the bottom layer, as illustrated by the animation above this.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector databases like Milvus provide highly optimized and tuned implementations of HNSW, and it is often the best default search index for datasets that fit in memory.</p>
<p>We have sketched a high-level overview of how and why HNSW works, preferring visualizations and intuition over theory and mathematics. Consequently, we have omitted an exact description of the construction and search algorithms[<a href="https://arxiv.org/abs/1603.09320">Malkov and Yashushin, 2016</a>; Alg 1-3], analysis of search and construction complexity [<a href="https://arxiv.org/abs/1603.09320">Malkov and Yashushin, 2016</a>; §4.2], and less essential details like a heuristic for more effectively choosing neighbor nodes during construction [<a href="https://arxiv.org/abs/1603.09320">Malkov and Yashushin, 2016</a>; Alg 5]. Moreover, we have omitted discussion of the algorithm’s hyperparameters, their meaning and how they affect the latency/speed/memory trade-off [<a href="https://arxiv.org/abs/1603.09320">Malkov and Yashushin, 2016</a>; §4.1]. An understanding of this is important for using HNSW in practice.</p>
<p>The resources below contain further reading on these topics and a full Python pedagogical implementation (written by myself) for NSW and HNSW, including code to produce the animations in this article.</p>
<custom-h1>Resources</custom-h1><ul>
<li><p>GitHub: “<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Illustrated: A small implementation of Hierarchical Navigable Small Worlds (HNSW), a vector search algorithm, for learning purposes</a>”</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Milvus Documentation</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">Understanding Hierarchical Navigable Small Worlds (HNSW) - Zilliz Learn</a></p></li>
<li><p>HNSW paper: “<a href="https://arxiv.org/abs/1603.09320">Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs</a>”</p></li>
<li><p>NSW paper: “<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">Approximate nearest neighbor algorithm based on navigable small world graphs</a>”</p></li>
</ul>
