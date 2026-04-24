---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  Milvus in IP Protection：Building a Trademark Similarity Search System with
  Milvus
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: Learn how to apply vector similarity search in the industry of IP protection.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>In recent years, the issue of IP protection has come under the limelight as people’s awareness of IP infringement is ever-increasing. Most notably, the multi-national technology giant Apple Inc. has been actively <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">filing lawsuits against various companies for IP infringement</a>, including trademark, patent, and design infringement. Apart from those most notorious cases, Apple Inc. also <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">disputed a trademark application by Woolworths Limited</a>, an Australian supermarket chain, on the grounds of trademark infringement in 2009.  Apple. Inc argued that the logo of the Australian brand, a stylized &quot;w&quot;, resembles their own logo of an apple. Therefore, Apple Inc. took objection to the range of products, including electronic devices, that Woolworths applied to sell with the logo. The story ends with Woolworths amending its logo and Apple withdrawing its opposition.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
    <span>Logo of Woolworths.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
    <span>Logo of Apple Inc.png</span>
  </span>
</p>
<p>With the ever-increasing awareness of brand culture, companies are keeping a closer eye on any threats that will harm their intellectual properties (IP) rights. IP infringement includes:</p>
<ul>
<li>Copyright infringement</li>
<li>Patent infringement</li>
<li>Trademark infringement</li>
<li>Design infringement</li>
<li>Cybersquatting</li>
</ul>
<p>The aforementioned dispute between Apple and Woolworths is mainly over trademark infringement, precisely the similarity between the trademark images of the two entities. To refrain from becoming another Woolworths, an exhaustive trademark similarity search is a crucial step for applicants both prior to the filing as well as during the review of trademark applications. The most common resort is through a search on the <a href="https://tmsearch.uspto.gov/search/search-information">United States Patent and Trademark Office (USPTO) database</a> that contains all of the active and inactive trademark registrations and applications. Despite the not so charming UI, this search process is also deeply flawed by its text-based nature as it relies on words and Trademark Design codes (which are hand annotated labels of design features) to search for images.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
    <span>8.png</span>
  </span>
</p>
<p>This article thereby intends to showcase how to build an efficient image-based trademark similarity search system using <a href="https://milvus.io">Milvus</a>, an open-source vector database.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">A vector similarity search system for trademarks<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>To build a vector similarity search system for trademarks, you need to go through the following steps:</p>
<ol>
<li>Prepare a massive dataset of logos. Likely, the system can use a dataset like <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">this</a>,).</li>
<li>Train an image feature extraction model using the dataset and data-driven models or AI algorithms.</li>
<li>Convert logos into vectors using the trained model or algorithm in Step 2.</li>
<li>Store the vectors and conduct vector similarity searches in Milvus, the open-source vector database.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
    <span>Nike.png</span>
  </span>
</p>
<p>In the following sections, let’s take a closer look at the two major steps in building a vector similarity search system for trademarks: using AI models for image feature extraction, and using Milvus for vector similarity search. In our case, we used VGG16, a convolutional neural network (CNN), to extract image features and convert them into embedding vectors.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">Using VGG16 for image feature extraction</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a> is a CNN designed for large-scale image recognition. The model is quick and accurate in image recognition and can be applied to images of all sizes. The following are two illustrations of the VGG16 architecture.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
    <span>9.png</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
    <span>10.png</span>
  </span>
</p>
<p>The VGG16 model, as its name suggests, is a CNN with 16 layers. All VGG models, including VGG16 and VGG19, contain 5 VGG blocks, with one or more convolutional layers in each VGG block. And at the end of each block, a max pooling layer is connected to reduce the size of the input image. The number of kernels is equivalent within each convolutional layer but doubles in each VGG block. Therefore, the number of kernels in the model grows from 64 in the first block, to 512 in the fourth and fifth blocks. All the convolutional kernels are 3<em>3-sized while the pooling kernels are all 2</em>2-sized. This is conducive to preserving more information about the input image.</p>
<p>Therefore, VGG16 is a suitable model for image recognition of massive datasets in this case. You can use Python, Tensorflow, and Keras to train an image feature extraction model on the basis of VGG16.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Using Milvus for vector similarity search</h3><p>After using the VGG16 model to extract image features and convert logo images into embedding vectors, you need to search for similar vectors from a massive dataset.</p>
<p>Milvus is a cloud-native database featuring high scalability and elasticity. Also, as a database, it can ensure data consistency. For a trademark similarity search system like this, new data like the latest trademark registrations are uploaded to the system in real time. And these newly uploaded data need to be available for search immediately. Therefore, this article adopts Milvus, the open-source vector database, to conduct vector similarity search.</p>
<p>When inserting the logo vectors, you can create collections in Milvus for different types of logo vectors according to the <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">International (Nice) Classification of Goods and Services</a>, a system of classifying goods and services for registering trademarks. For example, you can insert a group of vectors of clothing brand logos into a collection named “clothing” in Milvus and insert another group of vectors of technological brand logos into a different collection named &quot;technology&quot;. By doing so, you can greatly increase the efficiency and speed of your vector similarity search.</p>
<p>Milvus not only supports multiple indexes for vector similarity search, but also provides rich APIs and tools to facilitate DevOps. The following diagram is an illustration of the <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">Milvus architecture</a>. You can learn more about Milvus by reading its <a href="https://milvus.io/docs/v2.0.x/overview.md">introduction</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
    <span>11.png</span>
  </span>
</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Looking for more resources?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Build more vector similarity search systems for other application scenarios with Milvus:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">DNA Sequence Classification based on Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Audio Retrieval Based on Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 Steps to Building a Video Search System</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Building an Intelligent QA System with NLP and Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Accelerating New Drug Discovery</a></li>
</ul></li>
<li><p>Engage with our open-source community:</p>
<ul>
<li>Find or contribute to Milvus on <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interact with the community via <a href="https://bit.ly/3qiyTEk">Forum</a>.</li>
<li>Connect with us on <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
