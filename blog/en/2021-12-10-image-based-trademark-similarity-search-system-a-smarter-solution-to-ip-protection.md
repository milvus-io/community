---
id: 2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: Milvus in IP Protection：Building a Trademark Similarity Search System with Milvus 
author: Zilliz
date: 2021-12-10
desc: Learn how to apply vector similarity search in the industry of IP protection.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---

In recent years, the issue of IP protection has come under the limelight as people's awareness of IP infringement is ever-increasing. Most notably, the multi-national technology giant Apple Inc. has been actively [filing lawsuits against various companies for IP infringement](https://en.wikipedia.org/wiki/Apple_Inc._litigation), including trademark, patent, and design infringement. Apart from those most notorious cases, Apple Inc. also [disputed a trademark application by Woolworths Limited](https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html), an Australian supermarket chain, on the grounds of trademark infringement in 2009.  Apple. Inc argued that the logo of the Australian brand, a stylized "w", resembles their own logo of an apple. Therefore, Apple Inc. took objection to the range of products, including electronic devices, that Woolworths applied to sell with the logo. The story ends with Woolworths amending its logo and Apple withdrawing its opposition.

![Logo of Woolworths.png](https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png "Logo of Woolworths.")


![Logo of Apple Inc.png](https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png "Logo of Apple Inc.")



With the ever-increasing awareness of brand culture, companies are keeping a closer eye on any threats that will harm their intellectual properties (IP) rights. IP infringement includes:

- Copyright infringement
- Patent infringement
- Trademark infringement
- Design infringement
- Cybersquatting

The aforementioned dispute between Apple and Woolworths is mainly over trademark infringement, precisely the similarity between the trademark images of the two entities. To refrain from becoming another Woolworths, an exhaustive trademark similarity search is a crucial step for applicants both prior to the filing as well as during the review of trademark applications. The most common resort is through a search on the [United States Patent and Trademark Office (USPTO) database](https://tmsearch.uspto.gov/search/search-information) that contains all of the active and inactive trademark registrations and applications. Despite the not so charming UI, this search process is also deeply flawed by its text-based nature as it relies on words and Trademark Design codes (which are hand annotated labels of design features) to search for images.

![8.png](https://assets.zilliz.com/image_8_b2fff6ca11.png "The text-based trademark search options offered by the Trademark Electronic Search System (TESS).")


This article thereby intends to showcase how to build an efficient image-based trademark similarity search system using [Milvus](https://milvus.io), an open-source vector database.

## A vector similarity search system for trademarks

To build a vector similarity search system for trademarks, you need to go through the following steps:

1. Prepare a massive dataset of logos. Likely, the system can use a dataset like [this](https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental),).
2. Train an image feature extraction model using the dataset and data-driven models or AI algorithms.
3. Convert logos into vectors using the trained model or algorithm in Step 2.
4. Store the vectors and conduct vector similarity searches in Milvus, the open-source vector database.

![Nike.png](https://assets.zilliz.com/trademark_system_e9700df555.png "A demo of the vector similarity search system for trademarks.")


In the following sections, let's take a closer look at the two major steps in building a vector similarity search system for trademarks: using AI models for image feature extraction, and using Milvus for vector similarity search. In our case, we used VGG16, a convolutional neural network (CNN), to extract image features and convert them into embedding vectors.

### Using VGG16 for image feature extraction

[VGG16](https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615) is a CNN designed for large-scale image recognition. The model is quick and accurate in image recognition and can be applied to images of all sizes. The following are two illustrations of the VGG16 architecture.

![9.png](https://assets.zilliz.com/vgg16_layers_9e621f62cc.png "VGG16 layers")

![10.png](https://assets.zilliz.com/vgg16_architecture_992614e882.png "VGG16 architecture")

The VGG16 model, as its name suggests, is a CNN with 16 layers. All VGG models, including VGG16 and VGG19, contain 5 VGG blocks, with one or more convolutional layers in each VGG block. And at the end of each block, a max pooling layer is connected to reduce the size of the input image. The number of kernels is equivalent within each convolutional layer but doubles in each VGG block. Therefore, the number of kernels in the model grows from 64 in the first block, to 512 in the fourth and fifth blocks. All the convolutional kernels are 3*3-sized while the pooling kernels are all 2*2-sized. This is conducive to preserving more information about the input image.

Therefore, VGG16 is a suitable model for image recognition of massive datasets in this case. You can use Python, Tensorflow, and Keras to train an image feature extraction model on the basis of VGG16.

### Using Milvus for vector similarity search

After using the VGG16 model to extract image features and convert logo images into embedding vectors, you need to search for similar vectors from a massive dataset. 

Milvus is a cloud-native database featuring high scalability and elasticity. Also, as a database, it can ensure data consistency. For a trademark similarity search system like this, new data like the latest trademark registrations are uploaded to the system in real time. And these newly uploaded data need to be available for search immediately. Therefore, this article adopts Milvus, the open-source vector database, to conduct vector similarity search.

When inserting the logo vectors, you can create collections in Milvus for different types of logo vectors according to the [International (Nice) Classification of Goods and Services](https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services), a system of classifying goods and services for registering trademarks. For example, you can insert a group of vectors of clothing brand logos into a collection named "clothing" in Milvus and insert another group of vectors of technological brand logos into a different collection named "technology". By doing so, you can greatly increase the efficiency and speed of your vector similarity search.

Milvus not only supports multiple indexes for vector similarity search, but also provides rich APIs and tools to facilitate DevOps. The following diagram is an illustration of the [Milvus architecture](https://milvus.io/docs/v2.0.x/architecture_overview.md). You can learn more about Milvus by reading its [introduction](https://milvus.io/docs/v2.0.x/overview.md).

![11.png](https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png "The Milvus architecture.")


## Looking for more resources?

- Build more vector similarity search systems for other application scenarios with Milvus:
  - [DNA Sequence Classification based on Milvus](https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md)
  - [Audio Retrieval Based on Milvus](https://milvus.io/blog/audio-retrieval-based-on-milvus.md)
  - [4 Steps to Building a Video Search System](https://milvus.io/blog/building-video-search-system-with-milvus.md)
  - [Building an Intelligent QA System with NLP and Milvus](https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md)
  - [Accelerating New Drug Discovery](https://milvus.io/blog/molecular-structure-similarity-with-milvus.md)

- Engage with our open-source community:
  - Find or contribute to Milvus on [GitHub](https://bit.ly/307b7jC).
  - Interact with the community via [Forum](https://bit.ly/3qiyTEk).
  - Connect with us on [Twitter](https://bit.ly/3ob7kd8).
