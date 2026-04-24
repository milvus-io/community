---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: The second-generation search-by-image system
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: >-
  A user case of leveraging Milvus to build an image similarity search system
  for real-world business.
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>The Journey to Optimizing Billion-scale Image Search (2/2)</custom-h1><p>This article is the second part of <strong>The Journey to Optimizing Billion-scale Image Search by UPYUN</strong>. If you miss the first one, click <a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">here</a>.</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">The second-generation search-by-image system<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>The second-generation search-by-image system technically chooses the CNN + Milvus solution. The system is based on feature vectors and provides better technical support.</p>
<h2 id="Feature-extraction" class="common-anchor-header">Feature extraction<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>In the field of computer vision, the use of artificial intelligence has become the mainstream. Similarly, the feature extraction of the second-generation search-by-image system uses convolutional neural network (CNN) as the underlying technology</p>
<p>The term CNN is difficult to understand. Here we focus on answering two questions:</p>
<ul>
<li>What can CNN do?</li>
<li>Why can I use CNN for an image search?</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
    <span>1-meme.jpg</span>
  </span>
</p>
<p>There are many competitions in the AI field and image classification is one of the most important. The job of image classification is to determine whether the content of the picture is about a cat, a dog, an apple, a pear, or other types of objects.</p>
<p>What can CNN do? It can extract features and recognize objects. It extracts features from multiple dimensions and measures how close the features of an image are to the features of cats or dogs. We can choose the closest ones as our identification result which indicates whether the content of a specific image is about a cat, a dog, or something else.</p>
<p>What is the connection between the object identification function of CNN and search by image? What we want is not the final identification result, but the feature vector extracted from multiple dimensions. The feature vectors of two images with similar content must be close.</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">Which CNN model should I use?</h3><p>The answer is VGG16. Why choose it? First, VGG16 has good generalization capability, that is, it is very versatile. Second, the feature vectors extracted by VGG16 have 512 dimensions. If there are very few dimensions, the accuracy may be affected. If there are too many dimensions, the cost of storing and calculating these feature vectors is relatively high.</p>
<p>Using CNN to extract image features is a mainstream solution. We can use VGG16 as the model and Keras + TensorFlow for technical implementation. Here is the official example of Keras:</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
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
</code></pre>
<p>The features extracted here are feature vectors.</p>
<h3 id="1-Normalization" class="common-anchor-header">1. Normalization</h3><p>To facilitate subsequent operations, we often normalize feature:</p>
<p>What is used subsequently is also the normalized <code translate="no">norm_feat</code>.</p>
<h3 id="2-Image-description" class="common-anchor-header">2. Image description</h3><p>The image is loaded using the <code translate="no">image.load_img</code> method of <code translate="no">keras.preprocessing</code>:</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>In fact, it is the TensorFlow method called by Keras. For details, see the TensorFlow documentation. The final image object is actually a PIL Image instance (the PIL used by TensorFlow).</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3. Bytes conversion</h3><p>In practical terms, image content is often transmitted through the network. Therefore, instead of loading images from path, we prefer converting bytes data directly into image objects, that is, PIL Images:</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>The above img is the same as the result obtained by the image.load_img method. There are two things to pay attention to:</p>
<ul>
<li>You must do RGB conversion.</li>
<li>You must resize (resize is the second parameter of the <code translate="no">load_img method</code>).</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4. Black border processing</h3><p>Images, such as screenshots, may occasionally have quite a few black borders. These black borders have no practical value and cause much interference. For this reason, removing black borders is also a common practice.</p>
<p>A black border is essentially a row or column of pixels where all pixels are (0, 0, 0) (RGB image). To remove the black border is to find these rows or columns and delete them. This is actually a 3-D matrix multiplication in NumPy.</p>
<p>An example of removing horizontal black borders:</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>This is pretty much what I want to talk about using CNN to extract image features and implement other image processing. Now let’s take a look at vector search engines.</p>
<h2 id="Vector-search-engine" class="common-anchor-header">Vector search engine<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>The problem of extracting feature vectors from images has been solved. Then the remaining problems are:</p>
<ul>
<li>How to store feature vectors?</li>
<li>How to calculate the similarity of feature vectors, that is, how to search?
The open-source vector search engine Milvus can solve these two problems. So far, it has been running well in our production environment.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
    <span>3-milvus-logo.png</span>
  </span>
</p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">Milvus, the vector search engine<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Extracting feature vectors from an image is far from enough. We also need to dynamically manage these feature vectors (addition, deletion, and update), calculate the similarity of the vectors, and return the vector data in the nearest neighbor range. The open-source vector search engine Milvus performs these tasks quite well.</p>
<p>The rest of this article will describe specific practices and points to be noted.</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1. Requirements for CPU</h3><p>To use Milvus, your CPU must support the avx2 instruction set. For Linux systems, use the following command to check which instruction sets your CPU supports:</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>Then you get something like:</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>What follows flags is the instruction sets your CPU supports. Of course, these are much more than I need. I just want to see if a specific instruction set, such as avx2, is supported. Just add a grep to filter it:</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>If no result is returned, it means that this specific instruction set is not supported. You need to change your machine then.</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2. Capacity planning</h3><p>Capacity planning is our first consideration when we design a system. How much data do we need to store? How much memory and disk space does the data require?</p>
<p>Let’s do some quick maths. Each dimension of a vector is float32. A float32 type takes up 4 Bytes. Then a vector of 512 dimensions requires 2 KB of storage. By the same token:</p>
<ul>
<li>One thousand 512-dimensional vectors require 2 MB of storage.</li>
<li>One million 512-dimensional vectors require 2 GB of storage.</li>
<li>10 million 512-dimensional vectors require 20 GB of storage.</li>
<li>100 million 512-dimensional vectors require 200 GB of storage.</li>
<li>One billion 512-dimensional vectors require 2 TB of storage.</li>
</ul>
<p>If we want to store all the data in the memory, then the system needs at least the corresponding memory capacity.</p>
<p>It is recommended that you use the official size calculation tool: Milvus sizing tool.</p>
<p>Actually our memory may not be that big. (It doesn’t really matter if you don’t have enough memory. Milvus automatically flushes data onto the disk.) In addition to the original vector data, we also need to consider the storage of other data such as logs.</p>
<h3 id="3-System-configuration" class="common-anchor-header">3. System configuration</h3><p>For more information about the system configuration, see the Milvus documentation:</p>
<ul>
<li>Milvus server configuration: https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4. Database design</h3><p><strong>Collection &amp; Partition</strong></p>
<ul>
<li>Collection is also known as table.</li>
<li>Partition refers to the partitions inside a collection.</li>
</ul>
<p>The underlying implementation of partition is actually the same with that of collection, except that a partition is under a collection. But with partitions, the organization of data becomes more flexible. We can also query a specific partition in a collection to achieve better query results.</p>
<p>How many collections and partitions can we have? The basic information on collection and partition is in Metadata. Milvus uses either SQLite (Milvus internal integration) or MySQL (requires external connection) for internal metadata management. If you use SQLite by default to manage Metadata, you will suffer severe performance loss when the numbers of collections and partitions are too large. Therefore, the total number of collections and partitions should not exceed 50,000 (Milvus 0.8.0 will limit this number to 4,096). If you need to set a larger number, it is recommended that you use MySQL via an external connection.</p>
<p>The data structure supported by Milvus’ collection and partition is very simple, that is, <code translate="no">ID + vector</code>. In other words, there are only two columns in the table: ID and vector data.</p>
<p><strong>Note:</strong></p>
<ul>
<li>ID should be integers.</li>
<li>We need to ensure that the ID is unique within a collection instead of within a partition.</li>
</ul>
<p><strong>Conditional filtering</strong></p>
<p>When we use traditional databases, we can specify field values as filtering conditions. Though Milvus does not filter exactly the same way, we can implement simple conditional filtering using collections and partitions. For example, we have a large amount of image data and the data belongs to specific users. Then we can divide the data into partitions by user. Therefore, using the user as the filter condition is actually specifying the partition.</p>
<p><strong>Structured data and vector mapping</strong></p>
<p>Milvus only supports the ID + vector data structure. But in business scenarios, what we need is structured data-bearing business meaning. In other words, we need to find structured data through vectors. Accordingly, we need to maintain the mapping relations between structured data and vectors through ID.</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>Selecting index</strong></p>
<p>You can refer to the following articles:</p>
<ul>
<li>Types of index: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>How to select index: https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5. Processing search results</h3><p>The search results of Milvus are a collection of ID + distance:</p>
<ul>
<li>ID: the ID in a collection.</li>
<li>Distance: a distance value of 0 ~ 1 indicates similarity level; the smaller the value, the more similar the two vectors.</li>
</ul>
<p><strong>Filtering data whose ID is -1</strong></p>
<p>When the number of collections is too small, the search results may contain data whose ID is -1. We need to filter it out by ourselves.</p>
<p><strong>Pagination</strong></p>
<p>The search for vectors is quite different. The query results are sorted in descending order of similarity, and the most similar (topK) of results are selected (topK is specified by the user at the time of query).</p>
<p>Milvus does not support pagination. We need to implement the pagination function by ourselves if we need it for business. For example, if we have ten results on each page and only want to display the third page, we need to specify that topK = 30 and only return the last ten results.</p>
<p><strong>Similarity threshold for business</strong></p>
<p>The distance between the vectors of two images is between 0 and 1. If we want to decide whether two images are similar in a specific business scenario, we need to specify a threshold within this range. The two images are similar if the distance is smaller than the threshold, or they are quite different from each other if the distance is larger than the threshold. You need to adjust the threshold to meet your own business needs.</p>
<blockquote>
<p>This article is written by rifewang, Milvus user and software engineer of UPYUN. If you like this article, welcome to come say hi @ https://github.com/rifewang.</p>
</blockquote>
