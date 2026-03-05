---
id: AI-applications-with-Milvus.md
title: How to Make 4 Popular AI Applications with Milvus
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvus accelerates machine learning application development and machine
  learning operations (MLOps). With Milvus, you can rapidly develop a minimum
  viable product (MVP) while keeping costs at lower limits.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>How to Make 4 Popular AI Applications with Milvus</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
    <span>blog cover.png</span>
  </span>
</p>
<p><a href="https://milvus.io/">Milvus</a> is an open-source vector database. It supports adding, deleting, updating, and near real-time search of massive vector datasets created by extracting feature vectors from unstructured data using AI models. With a comprehensive set of intuitive APIs, and support for multiple widely adopted index libraries (e.g., Faiss, NMSLIB, and Annoy), Milvus accelerates machine learning application development and machine learning operations (MLOps). With Milvus, you can rapidly develop a minimum viable product (MVP) while keeping costs at lower limits.</p>
<p>&quot;What resources are available for developing an AI application with Milvus?” is commonly asked in the Milvus community. Zilliz, the <a href="https://zilliz.com/">company</a> behind Milvus, developed a number of demos that leverage Milvus to conduct lightening-fast similarity search that powers intelligent applications. Source code of Milvus solutions can be found at <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a>. The following interactive scenarios demonstrate natural language processing (NLP), reverse image search, audio search, and computer vision.</p>
<p>Feel free to try out the solutions to gain some hands-on experience with specific scenarios! Share your own application scenarios via:</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">Natural language processing (chatbots)</a></li>
<li><a href="#reverse-image-search-systems">Reverse image search</a></li>
<li><a href="#audio-search-systems">Audio search</a></li>
<li><a href="#video-object-detection-computer-vision">Video object detection (computer vision)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">Natural language processing (chatbots)</h3><p>Milvus can be used to build chatbots that use natural language processing to simulate a live operator, answer questions, route users to relevant information, and reduce labor costs. To demonstrate this application scenario, Zilliz built an AI-powered chatbot that understands semantic language by combining Milvus with <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a>, a machine learning (ML) model developed for NLP pre-training.</p>
<p>👉Source code：<a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
    <span>1.png</span>
  </span>
</p>
<h4 id="How-to-use" class="common-anchor-header">How to use</h4><ol>
<li><p>Upload a dataset that includes question-answer pairs. Format questions and answers in two separate columns. Alternatively, a <a href="https://zilliz.com/solutions/qa">sample dataset</a> is available for download.</p></li>
<li><p>After typing in your question, a list of similar questions will be retrieved from the uploaded dataset.</p></li>
<li><p>Reveal the answer by selecting the question most similar to your own.</p></li>
</ol>
<p>👉Video：<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">[Demo] QA System Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">How it works</h4><p>Questions are converted into feature vectors using Google’s BERT model, then Milvus is used to manage and query the dataset.</p>
<p><strong>Data processing:</strong></p>
<ol>
<li>BERT is used to convert the uploaded question-answer pairs into 768-dimensional feature vectors. The vectors are then imported to Milvus and assigned individual IDs.</li>
<li>Question, and corresponding answer, vector IDs are stored in PostgreSQL.</li>
</ol>
<p><strong>Searching for similar questions:</strong></p>
<ol>
<li>BERT is used to extract feature vectors from a user’s input question.</li>
<li>Milvus retrieves vector IDs for questions that are most similar to the input question.</li>
<li>The system looks up the corresponding answers in PostgreSQL.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">Reverse image search systems</h3><p>Reverse image search is transforming e-commerce through personalized product recommendations and similar product lookup tools that can boost sales. In this application scenario, Zilliz built a reverse image search system by combining Milvus with <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a>, an ML model that can extract image features.</p>
<p>👉Source code：<a href="https://github.com/zilliz-bootcamp/image_search">zilliz-bootcamp/image_search</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
    <span>2.jpeg</span>
  </span>
</p>
<h4 id="How-to-use" class="common-anchor-header">How to use</h4><ol>
<li>Upload a zipped image dataset comprised of .jpg images only (other image file types are not accepted). Alternatively, a <a href="https://zilliz.com/solutions/image-search">sample dataset</a> is available for download.</li>
<li>Upload an image to use as the search input for finding similar images.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[Demo] Image Search Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">How it works</h4><p>Images are converted into 512-dimensional feature vectors using the VGG model, then Milvus is used to manage and query the dataset.</p>
<p><strong>Data processing:</strong></p>
<ol>
<li>The VGG model is used to convert the uploaded image dataset to feature vectors. The vectors are then imported to Milvus and assigned individual IDs.</li>
<li>Image feature vectors, and corresponding image file paths, are stored in CacheDB.</li>
</ol>
<p><strong>Searching for similar images:</strong></p>
<ol>
<li>VGG is used to convert a user’s uploaded image into feature vectors.</li>
<li>Vector IDs of images most similar to the input image are retrieved from Milvus.</li>
<li>The system looks up the corresponding image file paths in CacheDB.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">Audio search systems</h3><p>Speech, music, sound effects, and other types of audio search makes it possible to quickly query massive volumes of audio data and surface similar sounds. Applications include identifying similar sound effects, minimizing IP infringement, and more. To demonstrate this application scenario, Zilliz built a highly efficient audio similarity search system by combining Milvus with <a href="https://arxiv.org/abs/1912.10211">PANNs</a>—a large-scale pretrained audio neural networks built for audio pattern recognition.</p>
<p>👉Source code：<a href="https://github.com/zilliz-bootcamp/audio_search">zilliz-bootcamp/audio_search</a>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" />
    <span>3.png</span>
  </span>
</p>
<h4 id="How-to-use" class="common-anchor-header">How to use</h4><ol>
<li>Upload a zipped audio dataset comprised of .wav files only (other audio file types are not accepted). Alternatively, a <a href="https://zilliz.com/solutions/audio-search">sample dataset</a> is available for download.</li>
<li>Upload a .wav file to use as the search input for finding similar audio.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[Demo] Audio Search Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">How it works</h4><p>Audio is converted into feature vectors using PANNs, large-scale pre-trained audio neural networks built for audio pattern recognition. Then Milvus is used to manage and query the dataset.</p>
<p><strong>Data processing:</strong></p>
<ol>
<li>PANNs converts audio from the uploaded dataset to feature vectors. The vectors are then imported to Milvus and assigned individual IDs.</li>
<li>Audio feature vector IDs and their corresponding .wav file paths are stored in PostgreSQL.</li>
</ol>
<p><strong>Searching for similar audio:</strong></p>
<ol>
<li>PANNs is used to convert a user’s uploaded audio file into feature vectors.</li>
<li>Vector IDs of audio most similar to the uploaded file are retrieved from Milvus by calculating inner product (IP) distance.</li>
<li>The system looks up the corresponding audio file paths in MySQL.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">Video object detection (computer vision)</h3><p>Video object detection has applications in computer vision, image retrieval, autonomous driving, and more. To demonstrate this application scenario, Zilliz built a video object detection system by combining Milvus with technologies and algorithms including <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>, <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a>, and <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a>.</p>
<p>👉Source code: <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
    <span>4.png</span>
  </span>
</p>
<h4 id="How-to-use" class="common-anchor-header">How to use</h4><ol>
<li>Upload a zipped image dataset comprised of .jpg files only (other image file types are not accepted). Ensure that each image file is named by the object it depicts. Alternatively, a <a href="https://zilliz.com/solutions/video-obj-analysis">sample dataset</a> is available for download.</li>
<li>Upload a video to use for analysis.</li>
<li>Click the play button to view the uploaded video with object detection results shown in real time.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=m9rosLClByc">[Demo] Video Object Detection System Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">How it works</h4><p>Object images are converted into 2048-dimensional feature vectors using ResNet50. Then Milvus is used to manage and query the dataset.</p>
<p><strong>Data processing:</strong></p>
<ol>
<li>ResNet50 converts object images to 2048-dimensional feature vectors. The vectors are then imported to Milvus and assigned individual IDs.</li>
<li>Audio feature vector IDs and their corresponding image file paths are stored in MySQL.</li>
</ol>
<p><strong>Detecting objects in video:</strong></p>
<ol>
<li>OpenCV is used to trim the video.</li>
<li>YOLOv3 is used to detect objects in the video.</li>
<li>ResNet50 converts detected object images into 2048-dimensional feature vectors.</li>
</ol>
<p>Milvus searches for the most similar object images in the uploaded dataset. Corresponding object names and image file paths are retrieved from MySQL.</p>
