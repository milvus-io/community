---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: Building a Wardrobe and Outfit Planning App with Milvus
author: Yu Fang
date: 2021-07-09 06:30:06.439+00
desc: Discover how Milvus, an open-source vector database, is used by Mozat to power a fashion app that offers personalized style recommendations and an image search system.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
origin: zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
  
# Building a Wardrobe and Outfit Planning App with Milvus
![stylepedia-1.png](https://assets.zilliz.com/stylepedia_1_5f239a8d48.png "Stylepedia.")

Founded in 2003, [Mozat](http://www.mozat.com/home) is a start-up headquartered in Singapore with offices in China and Saudi Arabia. The company specializes in building social media, communication, and lifestyle applications. [Stylepedia](https://stylepedia.com/) is a wardrobe app built by Mozat that helps users discover new styles and connect with other people that are passionate about fashion. Its key features include the ability to curate a digital closet, personalized style recommendations, social media functionality, and an image search tool for finding similar items to something seen online or in real life.

[Milvus](https://milvus.io) is used to power the image search system within Stylepedia. The app deals with three image types: user images, product images, and fashion photographs. Each image can include one or more items, further complicating each query. To be useful, an image search system must be accurate, fast, and stable, features that lay a solid technical foundation for adding new functionality to the app such as outfit suggestions and fashion content recommendations.

## System overview

![stylepedia-system-process.png](https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png "System process.")

The image search system is divided into offline and online components. 

Offline, images are vectorized and inserted into a vector database (Milvus). In the data workflow, relevant product images and fashion photographs are converted into 512-dimensional feature vectors using object detection and feature extraction models. The vector data is then indexed and added to the vector database.

Online, the image database is queried and similar images are returned to the user. Similar to the off-line component, a query image is processed by object detection and feature extraction models to obtain a feature vector. Using the feature vector, Milvus searches for TopK similar vectors and obtains their corresponding image IDs. Finally, after post-processing (filtering, sorting, etc.), a collection of images similar to the query image are returned.

## Implementation

The implementation breaks down into four modules:
1. Garment detection
2. Feature extraction
3. Vector similarity search
4. Post-processing

### Garment detection

In the garment detection module, [YOLOv5](https://pytorch.org/hub/ultralytics_yolov5/), a one-stage, anchor-based target detection framework, is used as the object detection model for its small size and real-time inference. It offers four model sizes (YOLOv5s/m/l/x), and each specific size has pros and cons. The larger models will perform better (higher precision) but require a lot more computing power and run slower. Because the objects in this case are relatively large items and easy to detect, the smallest model, YOLOv5s, suffices.

Clothing items in each image are recognized and cropped out to serve as the feature extraction model inputs used in subsequent processing. Simultaneously, the object detection model also predicts the garment classification according to predefined classes (tops, outerwear, trousers, skirts, dresses, and rompers).

### Feature extraction

The key to similarity search is the feature extraction model. Cropped clothes images are embedded into 512-dimensional floating point vectors that represent their attributes in a machine readable numeric data format. The [deep metric learning (DML)](https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning) methodology is adopted with [EfficientNet](https://arxiv.org/abs/1905.11946) as the backbone model.

Metric learning aims to train a CNN-based nonlinear feature extraction module (or an encoder) to reduce the distance between the feature vectors corresponding to the same class of samples, and increase the distance between the feature vectors corresponding to different classes of samples. In this scenario, the same class of samples refers to the same piece of clothing.

EfficientNet takes into account both speed and precision when uniformly scaling network width, depth, and resolution. EfficientNet-B4 is used as the feature extraction network, and the output of the ultimate fully connected layer is the image features needed to conduct vector similarity search.

### Vector similarity search

Milvus is an open-source vector database that supports create, read, update, and delete (CRUD) operations as well as near real-time search on trillion-byte datasets. In Stylepedia, it is used for large-scale vector similarity search because it is highly elastic, stable, reliable, and lightening fast. Milvus extends the capabilities of widely used vector index libraries (Faiss, NMSLIB, Annoy, etc.), and provides a set of simple and intuitive APIs that allow users to select the ideal index type for a given scenario.

Given the scenario requirements and data scale, Stylepedia's developers used the CPU-only distribution of Milvus paired with the HNSW index. Two indexed collections, one for products and the other for fashion photographs, are built to power different application functionalities. Each collection is further divided into six partitions based on the detection and classification results to narrow the search scope. Milvus performs search on tens of millions of vectors in milliseconds, providing optimal performance while keeping development costs low and minimizing resource consumption.

### Post-processing

To improve the similarity between the image retrieval results and the query image, we use color filtering and key label (sleeve length, clothes length, collar style, etc.) filtering to filter out ineligible images. In addition, an image quality assessment algorithm is used to make sure that higher quality images are presented to users first.

## Application

### User uploads and image search

Users can take pictures of their own clothes and upload them to their Stylepedia digital closet, then retrieve product images most similar to their uploads.

![stylepedia-search-results.png](https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png "Search results of a denim jacket image.")

### Outfit suggestions

By conducting similarity search on the Stylepedia database, users can find fashion photographs that contain a specific fashion item. These could be new garments someone is thinking about purchasing, or something from their own collection that could be worn or paired differently. Then, through the clustering of the items it is often paired with, outfit suggestions are generated. For example, a black biker jacket can go with a variety of items, such as a pair of black skinny jeans. Users can then browse relevant fashion photographs where this match occurs in the selected formula.

![stylepedia-jacket-outfit.png](https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png "Outfit ideas for a black biker jacket.")

![stylepedia-jacket-snapshot.png](https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png "A spread of snapshots featuring a black biker jacket + black skinny jeans match.")

### Fashion photograph recommendations

Based on a user's browsing history, likes, and the contents of their digital closet, the system calculates similarity and provides customized fashion photograph recommendations that may be of interest.

![stylepedia-user-wardrobe.png](https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png "Items in user's digital closet.")

![stylepedia-streetsnap-rec.png](https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png "Fashion photograph recommendations that match user preferences and tastes.")


By combining deep learning and computer vision methodologies, Mozat was able to build a fast, stable, and accurate image similarity search system using Milvus to power various features in the Stylepedia app.

## Don't be a stranger

- Find or contribute to Milvus on [GitHub](https://github.com/milvus-io/milvus/).
- Interact with the community via [Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ).
- Connect with us on [Twitter](https://twitter.com/milvusio).

  
