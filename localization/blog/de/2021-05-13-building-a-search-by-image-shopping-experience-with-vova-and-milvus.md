---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: Building a Search by Image Shopping Experience with VOVA and Milvus
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: >-
  Discover how Milvus, an open-source vector database, was used by e-commerce
  platform VOVA to power shopping by image.
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>Building a Search by Image Shopping Experience with VOVA and Milvus</custom-h1><p>Jump to:</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">Building a Search by Image Shopping Experience with VOVA and Milvus</a>
<ul>
<li><a href="#how-does-image-search-work">How does image search work?</a>
- <a href="#system-process-of-vovas-search-by-image-functionality"><em>System process of VOVA’s search by image functionality.</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">Target detection using the YOLO model</a>
- <a href="#yolo-network-architecture"><em>YOLO network architecture.</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">Image feature vector extraction with ResNet</a>
- <a href="#resnet-structure"><em>ResNet structure.</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">Vector similarity search powered by Milvus</a>
- <a href="#mishards-architecture-in-milvus"><em>Mishards architecture in Milvus.</em></a></li>
<li><a href="#vovas-shop-by-image-tool">VOVA’s shop by image tool</a>
- <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>Screenshots of VOVA’s search by image shopping tool.</em></a></li>
<li><a href="#reference">Reference</a></li>
</ul></li>
</ul>
<p>Online shopping surged in 2020, <a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">up 44%</a> in large part due to the coronavirus pandemic. As people sought to socially distance and avoid contact with strangers, no-contact delivery became an incredibly desirable option for many consumers. This popularity has also led to people buying a greater variety of goods online, including niche items that can be hard to describe using a traditional keyword search.</p>
<p>To help users overcome the limitations of keyword-based queries, companies can build image search engines that allow users to use images instead of words for search. Not only does this allow users to find items that are difficult to describe, but it also helps them shop for things they encounter in real life. This functionality helps build a unique user experience and offers general convenience that customers appreciate.</p>
<p>VOVA is an emerging e-commerce platform that focuses on affordability and offering a positive shopping experience to its users, with listings covering millions of products and support for 20 languages and 35 major currencies. To enhance the shopping experience for its users, the company used Milvus to build image search functionality into its e-commerce platform. The article explores how VOVA successfully built an image search engine with Milvus.</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">How does image search work?</h3><p>VOVA’s shop by image system searches the company’s inventory for product images that are similar to user uploads. The following chart shows the two stages of the system process, the data import stage (blue) and the query stage (orange):</p>
<ol>
<li>Use the YOLO model to detect targets from uploaded photos;</li>
<li>Use ResNet to extract feature vectors from the detected targets;</li>
<li>Use Milvus for vector similarity search.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
    <span>Vova-1.png</span>
  </span>
</p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">Target detection using the YOLO model</h3><p>VOVA’s mobile apps on Android and iOS currently support image search. The company uses a state-of-the-art, real-time object detection system called YOLO (You only look once) to detect objects in user uploaded images. The YOLO model is currently in its fifth iteration.</p>
<p>YOLO is a one-stage model, using only one convolutional neural network (CNN) to predict categories and positions of different targets. It is small, compact, and well suited for mobile use.</p>
<p>YOLO uses convolutional layers to extract features and fully-connected layers to obtain predicted values. Drawing inspiration from the GooLeNet model, YOLO’s CNN includes 24 convolutional layers and two fully-connected layers.</p>
<p>As the following illustration shows, a 448 × 448 input image is converted by a number of convolutional layers and pooling layers to a 7 × 7 × 1024-dimensional tensor (depicted in the third to last cube below), and then converted by two fully-connected layers to a 7 × 7 × 30-dimensional tensor output.</p>
<p>The predicted output of YOLO P is a two-dimensional tensor, whose shape is [batch,7 ×7 ×30]. Using slicing, P[:,0:7×7×20] is the category probability, P[:,7×7×20:7×7×(20+2)] is the confidence, and P[:,7×7×(20+2)]:] is the predicted result of the bounding box.</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;YOLO network architecture.)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">Image feature vector extraction with ResNet</h3><p>VOVA adopted the residual neural network (ResNet) model to extract feature vectors from an extensive product image library and user uploaded photos. ResNet is limited because as the depth of a learning network increases, the accuracy of the network decreases. The image below depicts ResNet running the VGG19 model (a variant of the VGG model) modified to include a residual unit through the short circuit mechanism. VGG was proposed in 2014 and includes just 14 layers, while ResNet came out a year later and can have up to 152.</p>
<p>The ResNet structure is easy to modify and scale. By changing the number of channels in the block and the number of stacked blocks, the width and depth of the network can be easily adjusted to obtain networks with different expressive capabilities. This effectively solves the network degeneration effect, where accuracy declines as the depth of learning increases. With sufficient training data, a model with improving expressive performance can be obtained while gradually deepening the network. Through model training, features are extracted for each picture and converted to 256-dimensional floating point vectors.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
    <span>vova-3.png</span>
  </span>
</p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Vector similarity search powered by Milvus</h3><p>VOVA’s product image database includes 30 million pictures and is growing rapidly. To quickly retrieve the most similar product images from this massive dataset, Milvus is used to conduct vector similarity search. Thanks to a number of optimizations, Milvus offers a fast and streamlined approach to managing vector data and building machine learning applications. Milvus offers integration with popular index libraries (e.g., Faiss, Annoy), supports multiple index types and distance metrics, has SDKs in multiple languages, and provides rich APIs for managing vector data.</p>
<p>Milvus can conduct similarity search on trillion-vector datasets in milliseconds, with a query time under 1.5 seconds when nq=1 and an average batch query time under 0.08 seconds. To build its image search engine, VOVA referred to the design of Mishards, Milvus’ sharding middleware solution (see the chart below for its system design), to implement a highly available server cluster. By leveraging the horizontal scalability of a Milvus cluster, the project requirement for high query performance on massive datasets was met.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
    <span>vova-4.png</span>
  </span>
</p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">VOVA’s shop by image tool</h3><p>The screenshots below show the VOVA search by image shopping tool on the company’s Android app.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
    <span>vova-5.png</span>
  </span>
</p>
<p>As more users search for products and upload photos, VOVA will continue to optimize the models that power the system. Additionally, the company will incorporate new Milvus functionality that can further enhance the online shopping experience of its users.</p>
<h3 id="Reference" class="common-anchor-header">Reference</h3><p><strong>YOLO:</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet:</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus:</strong></p>
<p>https://milvus.io/docs</p>
