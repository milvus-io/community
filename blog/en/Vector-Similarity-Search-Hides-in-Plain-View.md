---
id: Vector-Similarity-Search-Hides-in-Plain-View.md
title: Vector Similarity Search Hides in Plain View
author: Zilliz
date: 2021-05-12 03:40:20.821+00
desc: Discover what vector similarity search is, its various applications, and the public resources making artificial intelligence more accessible than ever.

cover: ../assets/pc-blog.jpg
tag: Community
origin: zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View
---

# Vector Similarity Search Hides in Plain View

[Artificial intelligence (AI)](https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#a291) has the potential to change the way even the most obscure things are done. For example, every year (before COVID, anyway) over 73,000 people congregate to compete in the Hong Kong Marathon. In order to properly sense and record finishing times for all race participants, organizers distribute 73,000 RFID chip timers to attach to each runner. Chip timing is a complex undertaking with obvious downsides. Materials (chips and electronic reading devices) must be purchased or rented from timing companies, and a registration area must be staffed for runners to collect chips on race day. Additionally, if sensors are installed only at the start and finish lines, it’s possible for unscrupulous runners to cut the course.

![blog-1.jpeg](https://zilliz-cms.s3.us-west-2.amazonaws.com/blog_1_e55c133e05.jpeg)

###### Timing marathon runners is a logistical challenge few think about.

Now imagine a [video AI](https://cloud.google.com/video-intelligence) application capable of automatically identifying individual runners from footage captured at the finish line using a single photo. Rather than attach timing chips to each participant, runners simply upload a photo of themselves via an app after they cross the finish line. Instantly, a personalized highlight reel, race stats, and other relevant information is provided. Cameras installed at various points throughout the race can capture additional footage of participants and ensure each runner traverses the entire course. Which solution seems easier and more cost-effective to implement?

Although the Hong Kong Marathon doesn’t leverage machine learning to replace timing chips (yet), this example illustrates the potential AI has to drastically alter everything around us. For race timing, it reduces tens of thousands of chips to a few cameras paired with machine learning algorithms. But video AI is just one of many applications for vector similarity search, a process that uses artificial intelligence to analyze massive, trillion-scale unstructured datasets. This article provides an overview of vector search technology including what it is, how it can be used, as well as the open-source software and resources making it more accessible than ever before.

**Jump to:**

- [What is vector similarity search?](#what-is-vector-similarity-search)

- [What are some applications of vector similarity search?](#what-are-some-applications-of-vector-similarity-search)

- [Open-source vector similarity search software and resources.](#open-source-vector-similarity-search-software-and-resources)

### What is vector similarity search?

Video data is incredibly detailed and increasingly common, so logically it seems like it would be a great unsupervised learning signal for building video AI. In reality, this is not the case. Processing and analyzing video data, especially in large volumes, remains a [challenge for artificial intelligence](https://arxiv.org/pdf/1905.11954.pdf). Recent progress in this field, like much of the progress made in unstructured data analytics, is owed in large part to vector similarity search.

The problem with video, like all unstructured data, is that it doesn’t follow a predefined model or organizational structure, making it difficult to process and analyze at scale. Unstructured data includes things like images, audio, social media behavior, and documents, collectively accounting for an estimated 80-90%+ of all data. Companies are increasingly aware of the business-critical insights buried in massive, enigmatic unstructured datasets, driving demand for AI applications that can tap into this unrealized potential.

Using [neural networks](https://en.wikipedia.org/wiki/Neural_network) such as CNN, RNN, and BERT, unstructured data can be converted into feature vectors (aka embeddings), a machine-readable numerical data format. Algorithms are then used to calculate the similarity between vectors using measures like cosine similarity or Euclidean distance. Vector embedding and similarity search make it possible to analyze and build machine learning applications using previously indiscernible datasets.

Vector similarity is calculated using established algorithms however, unstructured datasets are typically massive. This means efficient and accurate search requires vast storage and compute power. To [accelerate similarity search](https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212#7a9a) and reduce resource requirements, approximate nearest neighbor (ANN) search algorithms are used. By clustering similar vectors together, ANN algorithms make it possible to send queries to the clusters of vectors most likely to contain similar vectors, rather than searching the entire dataset. Although this approach is faster, it sacrifices some degree of accuracy. Leveraging ANN algorithms allows vector search to comb through billions of deep learning model insights in millisecond.

### What are some applications of vector similarity search?

Vector similarity search has applications spanning a wide variety of artificial intelligence, deep learning, and traditional vector calculation scenarios. The following provides a high-level overview of various vector similarity search applications:

**E-commerce:** Vector similarity search has broad applicability in e-commerce, including reverse image search engines that allow shoppers to search for products using an image captured on their smartphone or found online. Additionally, personalized recommendations based on user behavior, interests, purchase history, and more can be served by specialized recommender systems that rely on vector search.

**Physical & Cyber Security:** Video AI is just one of many applications for vector similarity search in the security field. Other scenarios include facial recognition, behavior tracing, identity authentication, intelligent access control, and more. Additionally, vector similarity search plays an important role in thwarting increasingly common and [sophisticated cyberattacks](https://www.wsj.com/articles/hack-suggests-new-scope-sophistication-for-cyberattacks-11608251360). For example, [code similarity search](https://medium.com/gsi-technology/application-of-ai-to-cybersecurity-part-3-19659bdb3422) can be used to identify security risks by comparing a piece of software to a database of known vulnerabilities or malware.

**Recommendation Engines:** Recommendation engines are systems that use machine learning and data analysis to suggest products, services, content, and information to users. User behavior, the behavior of similar users, and other data is processed using deep learning methods to generate recommendations. With enough data, algorithms can be trained to understand relationships between entities and invent ways to represent them autonomously. Recommendation systems have broad applicability and are something people already interact with every day, including content recommendations on Netflix, shopping recommendations on Amazon, and news feeds on Facebook.

**Chatbots:** Traditionally, chatbots are built using a regular knowledge graph that requires a large training dataset. However, chatbots built using deep learning models don’t need to preprocess data—instead, a map between frequent questions and answers is created. Using a pre-trained natural language processing (NLP) model, feature vectors can be extracted from the questions and then stored and queried using a [vector data management platform](https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#92e0).

**Image or Video Search:** Deep learning networks have been used to recognize visual patterns since the late 1970s, and modern technology trends have made image and video search more powerful and accessible than ever before.

**Chemical Similarity Search:** Chemical similarity is key to predicting the properties of chemical compounds and finding chemicals with specific attributes, making it indispensable to the development of new drugs. Fingerprints represented by feature vectors are created for each molecule, and then the distances between vectors are used to measure similarity. Using AI for new drug discovery is gaining momentum in the tech industry, with ByteDance (TikTok’s Chinese parent company) starting to [hire talent in the field](https://techcrunch.com/2020/12/23/bytedance-ai-drug/).

### Open-source vector similarity search software and resources.

Moore’s law, cloud computing, and declining resource costs are macro trends that have made artificial intelligence more accessible than ever. Thanks to open-source software and other publicly available resources, building AI/ML applications isn’t just for big tech companies. Below we provide a brief overview of Milvus, an open-source vector data management platform, and also highlight some publicly available datasets that help put AI within everyone’s reach.

#### Milvus, an open-source vector data management platform

[Milvus](https://milvus.io/) is an open-source vector data management platform built specifically for massive-scale vector data. Powered by Facebook AI Similarity Search (Faiss), Non-Metric Space Library (NMSLIB), and Annoy, Milvus brings a variety of powerful tools together under a single platform while extending their standalone functionality. The system was purpose built for storing, processing, and analyzing large vector datasets, and can be used to build all the AI applications (and more) mentioned above.

More information about Milvus can be found on its [website](https://milvus.io/). Tutorials, instructions for setting up Milvus, benchmark testing, and information on building a variety of different applications is available in the [Milvus bootcamp](https://github.com/milvus-io/bootcamp). Developers interested in making contributions to the project can join Milvus' open-source community on [GitHub](https://github.com/milvus-io).

#### Public datasets for artificial intelligence and machine learning

It is no secret that technology giants like Google and Facebook have a data advantage over the little guys, with some pundits even advocating for a “[progressive data-sharing mandate](https://www.technologyreview.com/2019/06/06/135067/making-big-tech-companies-share-data-could-do-more-good-than-breaking-them-up/)” that would force companies that exceed a certain size to share some anonymized data with smaller rivals. Fortunately, there are thousands of publicly available datasets that can be used for AL/ML projects:

- **The People’s Speech Dataset:** This [dataset from ML Commons](https://mlcommons.org/en/peoples-speech/) offers the largest speech dataset in the world, with over 87,000 hours of transcribed speech in 59 different languages.

- **UC Irvine Machine Learning Repository:** The University of California at Irvine maintains [hundreds of public datasets](https://archive.ics.uci.edu/ml/index.php) in an effort to help the machine learning community.

- **Data.gov:** The U.S. government offers [hundreds of thousands of open datasets](https://www.data.gov/) that span education, climate, COVID-19, and more.

- **Eurostat:** The European Union’s statistical office provides [open datasets](https://ec.europa.eu/eurostat/data/database) spanning a variety of industries from economy and finance to population and social conditions.

- **Harvard Dataverse:** [The Harvard Dataverse Repository](https://dataverse.harvard.edu/) is a free data repository open to researchers across disciplines. Many datasets are public, while others come with more restricted terms of use.

Although this list is by no means exhaustive, it is a good starting point for discovering the surprisingly wide variety of open datasets. For more information on public datasets as well as choosing the right data for your next ML or data science project, check out this [Medium post](https://altexsoft.medium.com/best-public-datasets-for-machine-learning-and-data-science-sources-and-advice-on-the-choice-636a0e754052).

## To learn more about vector similarity search, check out the following resources:

- [Thanks to Milvus, Anyone Can Build a Search Engine for 1+ Billion Images](https://zilliz.com/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images)
- [Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search](https://zilliz.com/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search)
- [Accelerating Similarity Search on Really Big Data with Vector Indexing](https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing)
