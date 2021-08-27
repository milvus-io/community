---
id: AI-applications-with-Milvus.md
title: How to Make 4 Popular AI Applications with Milvus
author: Zilliz
date: 2021-04-08 04:14:03.7+00
desc: Milvus accelerates machine learning application development and machine learning operations (MLOps). With Milvus, you can rapidly develop a minimum viable product (MVP) while keeping costs at lower limits.
banner: ../assets/blogCover.png
cover: ../assets/blogCover.png
tag: test1
origin: https://zilliz.com/blog/AI-applications-with-Milvus
---
  
# How to Make 4 Popular AI Applications with Milvus
![blog cover.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/blog_cover_4a9807b9e0.png)

[Milvus](https://milvus.io/) is an open-source vector database. It supports adding, deleting, updating, and near real-time search of massive vector datasets created by extracting feature vectors from unstructured data using AI models. With a comprehensive set of intuitive APIs, and support for multiple widely adopted index libraries (e.g., Faiss, NMSLIB, and Annoy), Milvus accelerates machine learning application development and machine learning operations (MLOps). With Milvus, you can rapidly develop a minimum viable product (MVP) while keeping costs at lower limits.

"What resources are available for developing an AI application with Milvus?” is commonly asked in the Milvus community. Zilliz, the [company](https://zilliz.com/) behind Milvus, developed a number of demos that leverage Milvus to conduct lightening-fast similarity search that powers intelligent applications. Source code of Milvus solutions can be found at [zilliz-bootcamp](https://github.com/zilliz-bootcamp). The following interactive scenarios demonstrate natural language processing (NLP), reverse image search, audio search, and computer vision.


Feel free to try out the solutions to gain some hands-on experience with specific scenarios! Share your own application scenarios via: 
- [Slack](https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ)
- [GitHub](https://github.com/milvus-io/milvus/discussions)

<br/>

**Jump to:**

- [Natural language processing (chatbots)](#natural-language-processing-chatbots)
- [Reverse image search](#reverse-image-search-systems)
- [Audio search](#audio-search-systems)
- [Video object detection (computer vision)](#video-object-detection-computer-vision)

<br/>

### Natural language processing (chatbots)
Milvus can be used to build chatbots that use natural language processing to simulate a live operator, answer questions, route users to relevant information, and reduce labor costs. To demonstrate this application scenario, Zilliz built an AI-powered chatbot that understands semantic language by combining Milvus with [BERT](https://en.wikipedia.org/wiki/BERT_(language_model)), a machine learning (ML) model developed for NLP pre-training.

👉Source code：[zilliz-bootcamp/intelligent_question_answering_v2](https://github.com/zilliz-bootcamp/intelligent_question_answering_v2)

![1.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/1_c301a9e4bd.png)
###### *AI-powered chatbot built with Milvus and BERT.*

#### How to use

1. Upload a dataset that includes question-answer pairs. Format questions and answers in two separate columns. Alternatively, a [sample dataset](https://zilliz.com/solutions/qa) is available for download.

2. After typing in your question, a list of similar questions will be retrieved from the uploaded dataset.

3. Reveal the answer by selecting the question most similar to your own.

👉Video：[[Demo] QA System Powered by Milvus](https://www.youtube.com/watch?v=ANgoyvgAxgU)

#### How it works

Questions are converted into feature vectors using Google’s BERT model, then Milvus is used to manage and query the dataset.

**Data processing:**

1. BERT is used to convert the uploaded question-answer pairs into 768-dimensional feature vectors. The vectors are then imported to Milvus and assigned individual IDs.
2. Question, and corresponding answer, vector IDs are stored in PostgreSQL.

**Searching for similar questions:**

1. BERT is used to extract feature vectors from a user's input question.
2. Milvus retrieves vector IDs for questions that are most similar to the input question.
3. The system looks up the corresponding answers in PostgreSQL.

<br/>

### Reverse image search systems
Reverse image search is transforming e-commerce through personalized product recommendations and similar product lookup tools that can boost sales. In this application scenario, Zilliz built a reverse image search system by combining Milvus with [VGG](https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517), an ML model that can extract image features.

👉Source code：[zilliz-bootcamp/image_search](https://github.com/zilliz-bootcamp/image_search)

![2.jpeg](https://zilliz-cms.s3.us-west-2.amazonaws.com/2_09000e2e2e.jpeg)
###### *Reverse image search system built with Milvus and VGG.*

#### How to use
1. Upload a zipped image dataset comprised of .jpg images only (other image file types are not accepted). Alternatively, a [sample dataset](https://zilliz.com/solutions/image-search) is available for download.
2. Upload an image to use as the search input for finding similar images.

👉Video: [[Demo] Image Search Powered by Milvus](https://www.youtube.com/watch?v=mTO8YdQObKY)

#### How it works
Images are converted into 512-dimensional feature vectors using the VGG model, then Milvus is used to manage and query the dataset.

**Data processing:**

1. The VGG model is used to convert the uploaded image dataset to feature vectors. The vectors are then imported to Milvus and assigned individual IDs.
2. Image feature vectors, and corresponding image file paths, are stored in CacheDB.

**Searching for similar images:**

1. VGG is used to convert a user’s uploaded image into feature vectors.
2. Vector IDs of images most similar to the input image are retrieved from Milvus.
3. The system looks up the corresponding image file paths in CacheDB.

<br/>

### Audio search systems
Speech, music, sound effects, and other types of audio search makes it possible to quickly query massive volumes of audio data and surface similar sounds. Applications include identifying similar sound effects, minimizing IP infringement, and more. To demonstrate this application scenario, Zilliz built a highly efficient audio similarity search system by combining Milvus with [PANNs](https://arxiv.org/abs/1912.10211)—a large-scale pretrained audio neural networks built for audio pattern recognition.

👉Source code：[zilliz-bootcamp/audio_search](https://github.com/zilliz-bootcamp/audio_search)
![3.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/3_419bac3dd2.png)
###### *Audio search system built with Milvus and PANNs.*

#### How to use
1. Upload a zipped audio dataset comprised of .wav files only (other audio file types are not accepted). Alternatively, a [sample dataset](https://zilliz.com/solutions/audio-search) is available for download.
2. Upload a .wav file to use as the search input for finding similar audio.

👉Video: [[Demo] Audio Search Powered by Milvus](https://www.youtube.com/watch?v=0eQHeqriCXw)
#### How it works
Audio is converted into feature vectors using PANNs, large-scale pre-trained audio neural networks built for audio pattern recognition. Then Milvus is used to manage and query the dataset.

**Data processing:**

1. PANNs converts audio from the uploaded dataset to feature vectors. The vectors are then imported to Milvus and assigned individual IDs.
2. Audio feature vector IDs and their corresponding .wav file paths are stored in PostgreSQL.

**Searching for similar audio:**

1. PANNs is used to convert a user’s uploaded audio file into feature vectors.
2. Vector IDs of audio most similar to the uploaded file are retrieved from Milvus by calculating inner product (IP) distance.
3. The system looks up the corresponding audio file paths in MySQL.

<br/>

### Video object detection (computer vision)
Video object detection has applications in computer vision, image retrieval, autonomous driving, and more. To demonstrate this application scenario, Zilliz built a video object detection system by combining Milvus with technologies and algorithms including [OpenCV](https://en.wikipedia.org/wiki/OpenCV), [YOLOv3](https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b), and [ResNet50](https://www.mathworks.com/help/deeplearning/ref/resnet50.html).

👉Source code: [zilliz-bootcamp/video_analysis](https://github.com/zilliz-bootcamp/video_analysis)

![4.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/4_54b4ceb2ad.png)
###### *Video object detection system with Milvus.*

#### How to use
1. Upload a zipped image dataset comprised of .jpg files only (other image file types are not accepted). Ensure that each image file is named by the object it depicts. Alternatively, a [sample dataset](https://zilliz.com/solutions/video-obj-analysis) is available for download. 
2. Upload a video to use for analysis.
3. Click the play button to view the uploaded video with object detection results shown in real time.

👉Video: [[Demo] Video Object Detection System Powered by Milvus](https://www.youtube.com/watch?v=m9rosLClByc)

#### How it works
Object images are converted into 2048-dimensional feature vectors using ResNet50. Then Milvus is used to manage and query the dataset.

**Data processing:**

1. ResNet50 converts object images to 2048-dimensional feature vectors. The vectors are then imported to Milvus and assigned individual IDs.
2. Audio feature vector IDs and their corresponding image file paths are stored in MySQL.

**Detecting objects in video:**

1. OpenCV is used to trim the video.
2. YOLOv3 is used to detect objects in the video.
3. ResNet50 converts detected object images into 2048-dimensional feature vectors.

Milvus searches for the most similar object images in the uploaded dataset. Corresponding object names and image file paths are retrieved from MySQL.



  