---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: The Journey to Optimizing Billion-scale Image Search (2/2)
author: Zilliz
date: 2021-04-08 22:20:27.855+00
desc: A case study with UPYUN
cover: zilliz-cms.s3.us-west-2.amazonaws.com/header_c73631b1e7.png
tag: test1
origin: zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2
---
  
# The Journey to Optimizing Billion-scale Image Search (2/2)
This article is the second part of **The Journey to Optimizing Billion-scale Image Search by UPYUN**. If you miss the first one, click [here](https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1).

## The second-generation search-by-image system

The second-generation search-by-image system technically chooses the CNN + Milvus solution. The system is based on feature vectors and provides better technical support.

## Feature extraction

In the field of computer vision, the use of artificial intelligence has become the mainstream. Similarly, the feature extraction of the second-generation search-by-image system uses convolutional neural network (CNN) as the underlying technology

The term CNN is difficult to understand. Here we focus on answering two questions:

- What can CNN do?
- Why can I use CNN for an image search?

![1-meme.jpg](https://zilliz-cms.s3.us-west-2.amazonaws.com/1_meme_649be6dfe8.jpg)
###### Photo by memegenerator.net

There are many competitions in the AI field and image classification is one of the most important. The job of image classification is to determine whether the content of the picture is about a cat, a dog, an apple, a pear, or other types of objects.

What can CNN do? It can extract features and recognize objects. It extracts features from multiple dimensions and measures how close the features of an image are to the features of cats or dogs. We can choose the closest ones as our identification result which indicates whether the content of a specific image is about a cat, a dog, or something else.

What is the connection between the object identification function of CNN and search by image? What we want is not the final identification result, but the feature vector extracted from multiple dimensions. The feature vectors of two images with similar content must be close.

### Which CNN model should I use?

The answer is VGG16. Why choose it? First, VGG16 has good generalization capability, that is, it is very versatile. Second, the feature vectors extracted by VGG16 have 512 dimensions. If there are very few dimensions, the accuracy may be affected. If there are too many dimensions, the cost of storing and calculating these feature vectors is relatively high.

Using CNN to extract image features is a mainstream solution. We can use VGG16 as the model and Keras + TensorFlow for technical implementation. Here is the official example of Keras:

    from keras.applications.vgg16 import VGG16
    from keras.preprocessing import image
    from keras.applications.vgg16 import preprocess_input
    import numpy as np
    model = VGG16(weights=’imagenet’, include_top=False)
    img_path = ‘elephant.jpg’
    img = image.load_img(img_path, target_size=(224, 224))
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    features = model.predict(x)

The features extracted here are feature vectors.

### 1. Normalization

To facilitate subsequent operations, we often normalize feature:

What is used subsequently is also the normalized <code>norm_feat</code>.

### 2. Image description

The image is loaded using the <code>image.load_img</code> method of <code>keras.preprocessing</code>:

    from keras.preprocessing import image
    img_path = 'elephant.jpg'
    img = image.load_img(img_path, target_size=(224, 224))

In fact, it is the TensorFlow method called by Keras. For details, see the TensorFlow documentation. The final image object is actually a PIL Image instance (the PIL used by TensorFlow).

### 3. Bytes conversion

In practical terms, image content is often transmitted through the network. Therefore, instead of loading images from path, we prefer converting bytes data directly into image objects, that is, PIL Images:

    import io
    from PIL import Image

    # img_bytes: 图片内容 bytes
    img = Image.open(io.BytesIO(img_bytes))
    img = img.convert('RGB')

    img = img.resize((224, 224), Image.NEAREST)

 The above img is the same as the result obtained by the image.load_img method. There are two things to pay attention to:

- You must do RGB conversion.
- You must resize (resize is the second parameter of the <code>load_img method</code>).

### 4. Black border processing

Images, such as screenshots, may occasionally have quite a few black borders. These black borders have no practical value and cause much interference. For this reason, removing black borders is also a common practice.

A black border is essentially a row or column of pixels where all pixels are (0, 0, 0) (RGB image). To remove the black border is to find these rows or columns and delete them. This is actually a 3-D matrix multiplication in NumPy.

An example of removing horizontal black borders:

    # -*- coding: utf-8 -*-
    import numpy as np
    from keras.preprocessing import image
    def RemoveBlackEdge(img):
    Args:
           img: PIL image instance
    Returns:
           PIL image instance
    """
       width = img.width
       img = image.img_to_array(img)
       img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
       img = image.array_to_img(img_without_black)
    return img

This is pretty much what I want to talk about using CNN to extract image features and implement other image processing. Now let’s take a look at vector search engines.

## Vector search engine

The problem of extracting feature vectors from images has been solved. Then the remaining problems are:
- How to store feature vectors?
- How to calculate the similarity of feature vectors, that is, how to search?
The open-source vector search engine Milvus can solve these two problems. So far, it has been running well in our production environment.

![3-milvus-logo.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/3_milvus_logo_3a7411f2c8.png)

## Milvus, the vector search engine

Extracting feature vectors from an image is far from enough. We also need to dynamically manage these feature vectors (addition, deletion, and update), calculate the similarity of the vectors, and return the vector data in the nearest neighbor range. The open-source vector search engine Milvus performs these tasks quite well.

The rest of this article will describe specific practices and points to be noted.

### 1. Requirements for CPU

To use Milvus, your CPU must support the avx2 instruction set. For Linux systems, use the following command to check which instruction sets your CPU supports:

<code>cat /proc/cpuinfo | grep flags</code?

Then you get something like:

    flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts

What follows flags is the instruction sets your CPU supports. Of course, these are much more than I need. I just want to see if a specific instruction set, such as avx2, is supported. Just add a grep to filter it:

    cat /proc/cpuinfo | grep flags | grep avx2

If no result is returned, it means that this specific instruction set is not supported. You need to change your machine then.

### 2. Capacity planning

Capacity planning is our first consideration when we design a system. How much data do we need to store? How much memory and disk space does the data require?

Let’s do some quick maths. Each dimension of a vector is float32. A float32 type takes up 4 Bytes. Then a vector of 512 dimensions requires 2 KB of storage. By the same token:

- One thousand 512-dimensional vectors require 2 MB of storage.
- One million 512-dimensional vectors require 2 GB of storage.
- 10 million 512-dimensional vectors require 20 GB of storage.
- 100 million 512-dimensional vectors require 200 GB of storage.
- One billion 512-dimensional vectors require 2 TB of storage.

If we want to store all the data in the memory, then the system needs at least the corresponding memory capacity.

It is recommended that you use the official size calculation tool: Milvus sizing tool.

Actually our memory may not be that big. (It doesn’t really matter if you don’t have enough memory. Milvus automatically flushes data onto the disk.) In addition to the original vector data, we also need to consider the storage of other data such as logs.

### 3. System configuration

For more information about the system configuration, see the Milvus documentation:
- Milvus server configuration: https://milvus.io/docs/v0.10.1/milvus_config.md

### 4. Database design
**Collection & Partition**

- Collection is also known as table.
- Partition refers to the partitions inside a collection.

The underlying implementation of partition is actually the same with that of collection, except that a partition is under a collection. But with partitions, the organization of data becomes more flexible. We can also query a specific partition in a collection to achieve better query results.

How many collections and partitions can we have? The basic information on collection and partition is in Metadata. Milvus uses either SQLite (Milvus internal integration) or MySQL (requires external connection) for internal metadata management. If you use SQLite by default to manage Metadata, you will suffer severe performance loss when the numbers of collections and partitions are too large. Therefore, the total number of collections and partitions should not exceed 50,000 (Milvus 0.8.0 will limit this number to 4,096). If you need to set a larger number, it is recommended that you use MySQL via an external connection.

The data structure supported by Milvus’ collection and partition is very simple, that is, <code>ID + vector</code>. In other words, there are only two columns in the table: ID and vector data.

**Note:**
- ID should be integers.
- We need to ensure that the ID is unique within a collection instead of within a partition.

**Conditional filtering**

When we use traditional databases, we can specify field values as filtering conditions. Though Milvus does not filter exactly the same way, we can implement simple conditional filtering using collections and partitions. For example, we have a large amount of image data and the data belongs to specific users. Then we can divide the data into partitions by user. Therefore, using the user as the filter condition is actually specifying the partition.

**Structured data and vector mapping**

Milvus only supports the ID + vector data structure. But in business scenarios, what we need is structured data-bearing business meaning. In other words, we need to find structured data through vectors. Accordingly, we need to maintain the mapping relations between structured data and vectors through ID.

    structured data ID <--> mapping table <--> Milvus ID

**Selecting index**

You can refer to the following articles:

- Types of index: https://www.milvus.io/docs/v0.10.1/index.md
- How to select index: https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212

### 5. Processing search results
 
The search results of Milvus are a collection of ID + distance:
- ID: the ID in a collection.
- Distance: a distance value of 0 ~ 1 indicates similarity level; the smaller the value, the more similar the two vectors.

**Filtering data whose ID is -1**

When the number of collections is too small, the search results may contain data whose ID is -1. We need to filter it out by ourselves.

**Pagination**

The search for vectors is quite different. The query results are sorted in descending order of similarity, and the most similar (topK) of results are selected (topK is specified by the user at the time of query).

Milvus does not support pagination. We need to implement the pagination function by ourselves if we need it for business. For example, if we have ten results on each page and only want to display the third page, we need to specify that topK = 30 and only return the last ten results.

**Similarity threshold for business**

The distance between the vectors of two images is between 0 and 1. If we want to decide whether two images are similar in a specific business scenario, we need to specify a threshold within this range. The two images are similar if the distance is smaller than the threshold, or they are quite different from each other if the distance is larger than the threshold. You need to adjust the threshold to meet your own business needs.

> This article is written by rifewang, Milvus user and software engineer of UPYUN. If you like this article, welcome to come say hi @ https://github.com/rifewang.















  