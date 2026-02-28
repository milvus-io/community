---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: Overview
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: >-
  A case study with UPYUN. Learn about how Milvus stands out from traditional
  database solutions and helps to build an image similarity search system.
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>The Journey to Optimizing Billion-scale Image Search (1/2)</custom-h1><p>Yupoo Picture Manager serves tens of millions of users and manages tens of billions of pictures. As its user gallery is growing larger, Yupoo has an urgent business need for a solution that can quickly locate the image. In other words, when a user inputs an image, the system should find its original image and similar images in the gallery. The development of the search by image service provides an effective approach to this problem.</p>
<p>The search by image service has undergone two evolutions:</p>
<ol>
<li>Began the first technical investigation in early 2019 and launched the first-generation system in March and April 2019;</li>
<li>Began the investigation of the upgrade plan in early 2020 and started the overall upgrade to the second-generation system in April 2020.</li>
</ol>
<p>This article describes the technology selection and basic principles behind the two generations of search by image system based on my own experience on this project.</p>
<h2 id="Overview" class="common-anchor-header">Overview<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">What is an image?</h3><p>We must know what is an image before dealing with images.</p>
<p>The answer is that an image is a collection of pixels.</p>
<p>For example, the part in the red box on this image is virtually a series of pixels.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
    <span>1-what-is-an-image.png</span>
  </span>
</p>
<p>Suppose the part in the red box is an image, then each independent small square in the image is a pixel, the basic information unit. Then, the size of the image is 11 x 11 px.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
    <span>2-what-is-an-image.png</span>
  </span>
</p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">Mathematical representation of images</h3><p>Each image can be represented by a matrix. Each pixel in the image corresponds to an element in the matrix.</p>
<h3 id="Binary-images" class="common-anchor-header">Binary images</h3><p>The pixels of a binary image is either black or white, so each pixel can be represented by 0 or 1.
For example, the matrix representation of a 4 * 4 binary image is:</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">RGB images</h3><p>The three primary colors (red, green, and blue) can be mixed to produce any color. For RGB images, each pixel has the basic information of three RGB channels. Similarly, if each channel uses an 8-bit number (in 256 levels) to represent its gray scale, then the mathematical representation of a pixel is:</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>Taking a 4 * 4 RGB image as an example:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
    <span>3-4-x-4-rgb-image.png</span>
  </span>
</p>
<p>The essence of image processing is to process these pixel matrices.</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">The technical problem of search by image<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>If you are looking for the original image, that is, an image with exactly the same pixels, then you can directly compare their MD5 values. However, images uploaded to the Internet are often compressed or watermarked. Even a small change in an image can create a different MD5 result. As long as there is inconsistency in pixels, it is impossible to find the original image.</p>
<p>For a search-by-image system, we want to search for images with similar content. Then, we need to solve two basic problems:</p>
<ul>
<li>Represent or abstract an image as a data format that can be processed by a computer.</li>
<li>The data must be comparable for calculation.</li>
</ul>
<p>More specifically, we need the following features:</p>
<ul>
<li>Image feature extraction.</li>
<li>Feature calculation (similarity calculation).</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">The first-generation search-by-image system<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">Feature extraction — image abstraction</h3><p>The first-generation search-by-image system uses Perceptual hash or pHash algorithm for feature extraction. What are the basics of this algorithm?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
    <span>4-first-generation-image-search.png</span>
  </span>
</p>
<p>As shown in the figure above, the pHash algorithm performs a series of transformations on the image to get the hash value. During the transformation process, the algorithm continuously abstract images, thereby pushing the results of similar images closer to each other.</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">Feature calculation — similarity calculation</h3><p>How to calculate the similarity between the pHash values of two images? The answer is to use the Hamming distance. The smaller the Hamming distance, the more similar the images’ content.</p>
<p>What is Hamming distance? It is the number of different bits.</p>
<p>For example,</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>There are two different bits in the above two values, so the Hamming distance between them is 2.</p>
<p>Now we know the principle of similarity calculation. The next question is, how to calculate the Hamming distances of 100-million-scale data from 100-million-scale pictures? In short, how to search for similar images?</p>
<p>In the early stage of the project, I did not find a satisfactory tool (or a computing engine) that can quickly calculate the Hamming distance. So I changed my plan.</p>
<p>My idea is that if the Hamming distance of two pHash values is small, then I can cut the pHash values and the corresponding small parts are likely to be equal.</p>
<p>For example:</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>We divide the above two values into eight segments and the values of six segments are exactly the same. It can be inferred that their Hamming distance is close and thus these two images are similar.</p>
<p>After the transformation, you can find that the problem of calculating Hamming distance has become a problem of matching equivalence. If I divide each pHash value into eight segments, as long as there are more than five segments that have exactly the same values, then the two pHash values are similar.</p>
<p>Thus it is very simple to solve equivalence matching. We can use the classical filtering of a traditional database system.</p>
<p>Of course, I use the multi-term matching and specify the degree of matching using minimum_should_match in ElasticSearch (this article does not introduce the principle of ES, you can learn it by yourself).</p>
<p>Why do we choose ElasticSearch? First, it provides the above-mentioned search function. Second, the image manager project in itself is using ES to provide a full-text search function and it is very economical to use the existing resources.</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">Summary of the first-generation system<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>The first-generation search-by-image system chooses the pHash + ElasticSearch solution, which has the following features:</p>
<ul>
<li>The pHash algorithm is simple to use and can resist a certain degree of compression, watermark, and noise.</li>
<li>ElasticSearch uses the existing resources of the project without adding additional costs to the search.</li>
<li>But the limitation of this system is obvious: The pHash algorithm is an abstract representation of the entire image. Once we destroy the integrity of the image, such as adding a black border to the original image, it is almost impossible to judge the similarity between the original and the others.</li>
</ul>
<p>To break through such limitations, the second-generation image search system with a completely different underlying technology emerged.</p>
<p>This article is written by rifewang, Milvus user and software engineer of UPYUN. If you like this article, welcome to come say hi! https://github.com/rifewang</p>
