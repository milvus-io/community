---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu - the Photo Fraud Detector Based on Milvus
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: >-
  How is Zhentu's detection system built with Milvus as its vector search
  engine?
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
    <span>cover image</span>
  </span>
</p>
<blockquote>
<p>This article is written by Yan Shi and Minwei Tang, senior algorithm engineers at BestPay, and translated by <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p>In recent years, as e-commerce and online transactions become commonplace throughout the world, e-commerce fraud also flourished. By using computer-generated photos instead of real ones to pass identity verification on online business platforms, fraudsters create massive fake accounts and cash in on businesses’ special offers (e.g. membership gifts, coupons, tokens), which brings irretrievable losses to both consumers and businesses.</p>
<p>Traditional risk control methods are no longer effective in the face of a substantial amount of data. To solve the problem, <a href="https://www.bestpay.com.cn">BestPay</a> created a photo fraud detector, namely Zhentu (meaning detecting images in Chinese), based on deep learning (DL) and digital image processing (DIP) technologies. Zhentu is applicable to various scenarios involving image recognition, with one important offshoot being the identification of fake business licenses. If the business license photo submitted by a user is very similar to another photo already existing in a platform’s photo library, it is likely that the user has stolen the photo somewhere or has forged a license for fraudulent purposes.</p>
<p>Traditional algorithms for measuring image similarity, such as <a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNR</a> and ORB, are slow and inaccurate, only applicable to offline tasks. Deep learning, on the other hand, is capable of processing large-scale image data in real-time and is the ultimate method for matching similar images. With the joint efforts of BestPay’s R&amp;D team and <a href="https://milvus.io/">the Milvus community</a>, a photo fraud detection system is developed as part of Zhentu. It functions by converting massive amounts of image data into feature vectors through deep learning models and inserting them into <a href="https://milvus.io/">Milvus</a>, a vector search engine. With Milvus, the detection system is able to index trillions of vectors and efficiently retrieve similar photos among tens of millions of images.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">An overview of Zhentu</a></li>
<li><a href="#system-structure">System structure</a></li>
<li><a href="#deployment"><strong>Deployment</strong></a></li>
<li><a href="#real-world-performance"><strong>Real-world performance</strong></a></li>
<li><a href="#reference"><strong>Reference</strong></a></li>
<li><a href="#about-bestpay"><strong>About BestPay</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">An overview of Zhentu<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentu is BestPay’s self-designed multimedia visual risk control product deeply integrated with machine learning (ML) and neural network image recognition technologies. Its built-in algorithm can accurately identify fraudsters during user authentication and respond at the millisecond level. With its industry-leading technology and innovative solution, Zhentu has won five patents and two software copyrights. It is now being used in a number of banks and financial institutions to help identify potential risks in advance.</p>
<h2 id="System-structure" class="common-anchor-header">System structure<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>BestPay currently has over 10 million business license photos, and the actual volume is still growing exponentially as the business grows. In order to quickly retrieve similar photos from such a large database, Zhentu has chosen Milvus as the feature vector similarity calculation engine. The general structure of the photo fraud detection system is shown in the diagram below.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
    <span>img</span>
  </span>
</p>
<p>The procedure can be divided into four steps:</p>
<ol>
<li><p>Image pre-processing. Pre-processing, including noise reduction, noise removal, and contrast enhancement, ensures both the integrity of the original information and the removal of useless information from the image signal.</p></li>
<li><p>Feature vector extraction. A specially trained deep learning model is used to extract the feature vectors of the image. Converting images into vectors for further similarity search is a routine operation.</p></li>
<li><p>Normalization. Normalizing the extracted feature vectors helps to improve the efficiency of the subsequent processing.</p></li>
<li><p>Vector search with Milvus. Inserting the normalized feature vectors into Milvus database for vector similarity search.</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>Deployment</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Here is a brief description of how Zhentu’s photo fraud detection system is deployed.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
    <span>Milvus system architecture</span>
  </span>
</p>
<p>We deployed our <a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">Milvus cluster on Kubernetes</a> to ensure high availability and real-time synchronization of cloud services. The general steps are as follows:</p>
<ol>
<li><p>View available resources. Run the command <code translate="no">kubectl describe nodes</code> to see the resources that the Kubernetes cluster can allocate to the created cases.</p></li>
<li><p>Allocate resources. Run the command <code translate="no">kubect`` -- apply xxx.yaml</code> to allocate memory and CPU resources for Milvus cluster components using Helm.</p></li>
<li><p>Apply the new configuration. Run the command <code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code>.</p></li>
<li><p>Apply the new configuration to the Milvus cluster. The cluster deployed in this way not only allows us to adjust system capacity according to different business needs, but also better meets the high-performance requirements for massive vector data retrieval.</p></li>
</ol>
<p>You can <a href="https://milvus.io/docs/v2.0.x/configure-docker.md">configure Milvus</a> to optimize search performance for different types of data from different business scenarios, as shown in the following two examples.</p>
<p>In <a href="https://milvus.io/docs/v2.0.x/build_index.md">building the vector index</a>, we parameterize the index according to the actual scenario of the system as follows:</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQ</a> performs IVF index clustering before quantizing the product of vectors. It features high-speed disk query and very low memory consumption, which meets the needs of the real-world application of Zhentu.</p>
<p>Besides, we set the optimal search parameters as follows:</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>As the vectors are already normalized before input into Milvus, the inner product (IP) is chosen to calculate the distance between two vectors. Experiments have proved that the recall rate is raised by about 15% using IP than using the Euclidean distance (L2).</p>
<p>The above examples show that we can test and set Milvus’ parameters according to different business scenarios and performance requirements.</p>
<p>In addition, Milvus not only integrates different index libraries, but also supports different index types and similarity calculation methods. Milvus also provides official SDKs in multiple languages and rich APIs for insertion, querying, etc., allowing our front-end business groups to use the SDKs to call on the risk control center.</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>Real-world performance</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>So far, the photo fraud detection system has been running steadily, helping businesses to identify potential fraudsters. In 2021, it detected over 20,000 fake licenses throughout the year. In terms of query speed, a single vector query among tens of millions of vectors takes less than 1 second, and the average time of batch query is less than 0.08 seconds. Milvus’ high-performance search meets businesses’ needs for both accuracy and concurrency.</p>
<h2 id="Reference" class="common-anchor-header"><strong>Reference</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. Implementation of High Performance Feature Extraction Method Using Oriented Fast and Rotated Brief Algorithm[J]. Int. J. Res. Eng. Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>About BestPay</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>China Telecom BestPay Co., Ltd is a wholly owned subsidiary of China Telecom. It operates the payment and finance businesses. BestPay is committed to using cutting-edge technologies such as big data, artificial intelligence and cloud computing to empower business innovation, providing intelligent products, risk control solutions and other services. Up to January 2016, the app called BestPay has attracted over 200 million users and become the third largest payment platform operator in China, closely following Alipay and WeChat Payment.</p>
