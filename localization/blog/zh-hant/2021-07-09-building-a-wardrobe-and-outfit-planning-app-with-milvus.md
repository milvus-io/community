---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: System overview
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  Discover how Milvus, an open-source vector database, is used by Mozat to power
  a fashion app that offers personalized style recommendations and an image
  search system.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Building a Wardrobe and Outfit Planning App with Milvus</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
    <span>stylepedia-1.png</span>
  </span>
</p>
<p>Founded in 2003, <a href="http://www.mozat.com/home">Mozat</a> is a start-up headquartered in Singapore with offices in China and Saudi Arabia. The company specializes in building social media, communication, and lifestyle applications. <a href="https://stylepedia.com/">Stylepedia</a> is a wardrobe app built by Mozat that helps users discover new styles and connect with other people that are passionate about fashion. Its key features include the ability to curate a digital closet, personalized style recommendations, social media functionality, and an image search tool for finding similar items to something seen online or in real life.</p>
<p><a href="https://milvus.io">Milvus</a> is used to power the image search system within Stylepedia. The app deals with three image types: user images, product images, and fashion photographs. Each image can include one or more items, further complicating each query. To be useful, an image search system must be accurate, fast, and stable, features that lay a solid technical foundation for adding new functionality to the app such as outfit suggestions and fashion content recommendations.</p>
<h2 id="System-overview" class="common-anchor-header">System overview<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
    <span>stylepedia-system-process.png</span>
  </span>
</p>
<p>The image search system is divided into offline and online components.</p>
<p>Offline, images are vectorized and inserted into a vector database (Milvus). In the data workflow, relevant product images and fashion photographs are converted into 512-dimensional feature vectors using object detection and feature extraction models. The vector data is then indexed and added to the vector database.</p>
<p>Online, the image database is queried and similar images are returned to the user. Similar to the off-line component, a query image is processed by object detection and feature extraction models to obtain a feature vector. Using the feature vector, Milvus searches for TopK similar vectors and obtains their corresponding image IDs. Finally, after post-processing (filtering, sorting, etc.), a collection of images similar to the query image are returned.</p>
<h2 id="Implementation" class="common-anchor-header">Implementation<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>The implementation breaks down into four modules:</p>
<ol>
<li>Garment detection</li>
<li>Feature extraction</li>
<li>Vector similarity search</li>
<li>Post-processing</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">Garment detection</h3><p>In the garment detection module, <a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a>, a one-stage, anchor-based target detection framework, is used as the object detection model for its small size and real-time inference. It offers four model sizes (YOLOv5s/m/l/x), and each specific size has pros and cons. The larger models will perform better (higher precision) but require a lot more computing power and run slower. Because the objects in this case are relatively large items and easy to detect, the smallest model, YOLOv5s, suffices.</p>
<p>Clothing items in each image are recognized and cropped out to serve as the feature extraction model inputs used in subsequent processing. Simultaneously, the object detection model also predicts the garment classification according to predefined classes (tops, outerwear, trousers, skirts, dresses, and rompers).</p>
<h3 id="Feature-extraction" class="common-anchor-header">Feature extraction</h3><p>The key to similarity search is the feature extraction model. Cropped clothes images are embedded into 512-dimensional floating point vectors that represent their attributes in a machine readable numeric data format. The <a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">deep metric learning (DML)</a> methodology is adopted with <a href="https://arxiv.org/abs/1905.11946">EfficientNet</a> as the backbone model.</p>
<p>Metric learning aims to train a CNN-based nonlinear feature extraction module (or an encoder) to reduce the distance between the feature vectors corresponding to the same class of samples, and increase the distance between the feature vectors corresponding to different classes of samples. In this scenario, the same class of samples refers to the same piece of clothing.</p>
<p>EfficientNet takes into account both speed and precision when uniformly scaling network width, depth, and resolution. EfficientNet-B4 is used as the feature extraction network, and the output of the ultimate fully connected layer is the image features needed to conduct vector similarity search.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Vector similarity search</h3><p>Milvus is an open-source vector database that supports create, read, update, and delete (CRUD) operations as well as near real-time search on trillion-byte datasets. In Stylepedia, it is used for large-scale vector similarity search because it is highly elastic, stable, reliable, and lightening fast. Milvus extends the capabilities of widely used vector index libraries (Faiss, NMSLIB, Annoy, etc.), and provides a set of simple and intuitive APIs that allow users to select the ideal index type for a given scenario.</p>
<p>Given the scenario requirements and data scale, Stylepedia’s developers used the CPU-only distribution of Milvus paired with the HNSW index. Two indexed collections, one for products and the other for fashion photographs, are built to power different application functionalities. Each collection is further divided into six partitions based on the detection and classification results to narrow the search scope. Milvus performs search on tens of millions of vectors in milliseconds, providing optimal performance while keeping development costs low and minimizing resource consumption.</p>
<h3 id="Post-processing" class="common-anchor-header">Post-processing</h3><p>To improve the similarity between the image retrieval results and the query image, we use color filtering and key label (sleeve length, clothes length, collar style, etc.) filtering to filter out ineligible images. In addition, an image quality assessment algorithm is used to make sure that higher quality images are presented to users first.</p>
<h2 id="Application" class="common-anchor-header">Application<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">User uploads and image search</h3><p>Users can take pictures of their own clothes and upload them to their Stylepedia digital closet, then retrieve product images most similar to their uploads.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
    <span>stylepedia-search-results.png</span>
  </span>
</p>
<h3 id="Outfit-suggestions" class="common-anchor-header">Outfit suggestions</h3><p>By conducting similarity search on the Stylepedia database, users can find fashion photographs that contain a specific fashion item. These could be new garments someone is thinking about purchasing, or something from their own collection that could be worn or paired differently. Then, through the clustering of the items it is often paired with, outfit suggestions are generated. For example, a black biker jacket can go with a variety of items, such as a pair of black skinny jeans. Users can then browse relevant fashion photographs where this match occurs in the selected formula.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
    <span>stylepedia-jacket-outfit.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
    <span>stylepedia-jacket-snapshot.png</span>
  </span>
</p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">Fashion photograph recommendations</h3><p>Based on a user’s browsing history, likes, and the contents of their digital closet, the system calculates similarity and provides customized fashion photograph recommendations that may be of interest.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
    <span>stylepedia-user-wardrobe.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
    <span>stylepedia-streetsnap-rec.png</span>
  </span>
</p>
<p>By combining deep learning and computer vision methodologies, Mozat was able to build a fast, stable, and accurate image similarity search system using Milvus to power various features in the Stylepedia app.</p>
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
