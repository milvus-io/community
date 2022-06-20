---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus
title: Zhentu: the Photo Fraud Detector Based on Milvus
author: Yan Shi, Minwei Tang
date: 2022-06-20
desc: How is Zhentu's detection system built with Milvus as its vector search engine?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
---

> This article is written by Yan Shi and Minwei Tang, senior algorithm engineers at BestPay, and translated by [Rosie Zhang](https://www.linkedin.cn/incareer/in/rosie-zhang-694528149).

In recent years, as e-commerce and online transactions become commonplace throughout the world, e-commerce fraud also flourished. By using computer-generated photos instead of real ones to pass identity verification on online business platforms, fraudsters create massive fake accounts and cash in on businesses' special offers (e.g. membership gifts, coupons, tokens), which brings irretrievable losses to both consumers and businesses.

Traditional risk control methods are no longer effective in the face of a substantial amount of data. To solve the problem, [BestPay](https://www.bestpay.com.cn/global/oig/index.html) created a photo fraud detector, namely Zhentu (meaning detecting images in Chinese), based on deep learning (DL) and digital image processing (DIP) technologies. Zhentu is applicable to various scenarios involving image recognition, with one important offshoot being the identification of fake business licenses. If the business license photo submitted by a user is very similar to another photo already existing in a platform's photo library, it is likely that the user has stolen the photo somewhere or has forged a license for fraudulent purposes.

Traditional algorithms for measuring image similarity, such as [PSNR](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio) and ORB, are slow and inaccurate, only applicable to offline tasks. Deep learning, on the other hand, is capable of processing large-scale image data in real-time and is the ultimate method for matching similar images. With the joint efforts of BestPay’s R&D team and [the Milvus community](https://milvus.io/), a photo fraud detection system is developed as part of Zhentu. It functions by converting massive amounts of image data into feature vectors through deep learning models and inserting them into [Milvus](https://milvus.io/), a vector search engine. With Milvus, the detection system is able to index trillions of vectors and efficiently retrieve similar photos among tens of millions of images.

## An overview of Zhentu

Zhentu is BestPay’s self-designed multimedia visual risk control product deeply integrated with machine learning (ML) and neural network image recognition technologies. Its built-in algorithm can accurately identify fraudsters during user authentication and respond at the millisecond level. With its industry-leading technology and innovative solution, Zhentu has won five patents and two software copyrights. It is now being used in a number of banks and financial institutions to help identify potential risks in advance.

## System structure

BestPay currently has over 10 million business license photos, and the actual volume is still growing exponentially as the business grows. In order to quickly retrieve similar photos from such a large database, Zhentu has chosen Milvus as the feature vector similarity calculation engine. The general structure of the photo fraud detection system is shown in the diagram below.

![img](https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png "Structure of the photo fraud detection system")

The procedure can be divided into four steps:

1. Image pre-processing. Pre-processing, including noise reduction, noise removal, and contrast enhancement, ensures both the integrity of the original information and the removal of useless information from the image signal.

2. Feature vector extraction. A specially trained deep learning model is used to extract the feature vectors of the image. Converting images into vectors for further similarity search is a routine operation.

3. Normalization. Normalizing the extracted feature vectors helps to improve the efficiency of the subsequent processing.

4. Vector search with Milvus. Inserting the normalized feature vectors into Milvus database for vector similarity search.

## **Deployment**

Here is a brief description of how Zhentu's photo fraud detection system is deployed.

![Milvus system architecture](https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png)

We deployed our [Milvus cluster on Kubernetes](https://milvus.io/docs/v2.0.x/install_cluster-helm.md) to ensure high availability and real-time synchronization of cloud services. The general steps are as follows:

1. View available resources. Run the command `kubectl describe nodes` to see the resources that the Kubernetes cluster can allocate to the created cases.

2. Allocate resources. Run the command `kubect`` -- apply xxx.yaml` to allocate memory and CPU resources for Milvus cluster components using Helm.

3. Apply the new configuration. Run the command `helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml`.

4. Apply the new configuration to the Milvus cluster. The cluster deployed in this way not only allows us to adjust system capacity according to different business needs, but also better meets the high-performance requirements for massive vector data retrieval.

You can [configure Milvus](https://milvus.io/docs/v2.0.x/configure-docker.md) to optimize search performance for different types of data from different business scenarios, as shown in the following two examples.

In [building the vector index](https://milvus.io/docs/v2.0.x/build_index.md), we parameterize the index according to the actual scenario of the system as follows:

```Python
index = {"index_type": "IVF_PQ", "params": {"nlist": 2048}, "metric_type": "IP"}
```

[IVF_PQ](https://milvus.io/docs/v2.0.x/index.md#IVF_PQ) performs IVF index clustering before quantizing the product of vectors. It features high-speed disk query and very low memory consumption, which meets the needs of the real-world application of Zhentu.

Besides, we set the optimal search parameters as follows:

```Python
search_params = {"metric_type": "IP", "params": {"nprobe": 32}}
```

As the vectors are already normalized before input into Milvus, the inner product (IP) is chosen to calculate the distance between two vectors. Experiments have proved that the recall rate is raised by about 15% using IP than using the Euclidean distance (L2). 

The above examples show that we can test and set Milvus' parameters according to different business scenarios and performance requirements. 

In addition, Milvus not only integrates different index libraries, but also supports different index types and similarity calculation methods. Milvus also provides official SDKs in multiple languages and rich APIs for insertion, querying, etc., allowing our front-end business groups to use the SDKs to call on the risk control center.

## **Real-world performance**

So far, the photo fraud detection system has been running steadily, helping businesses to identify potential fraudsters. In 2021, it detected over 20,000 fake licenses throughout the year. In terms of query speed, a single vector query among tens of millions of vectors takes less than 1 second, and the average time of batch query is less than 0.08 seconds. Milvus' high-performance search meets businesses' needs for both accuracy and concurrency.

## **Reference**

Aglave P, Kolkure V S. Implementation of High Performance Feature Extraction Method Using Oriented Fast and Rotated Brief Algorithm[J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397. 

## **About BestPay**

China Telecom BestPay Co., Ltd is a wholly owned subsidiary of China Telecom. It operates the payment and finance businesses. BestPay is committed to using cutting-edge technologies such as big data, artificial intelligence and cloud computing to empower business innovation, providing intelligent products, risk control solutions and other services. Up to January 2016, the app called BestPay has attracted over 200 million users and become the third largest payment platform operator in China, closely following Alipay and WeChat Payment.