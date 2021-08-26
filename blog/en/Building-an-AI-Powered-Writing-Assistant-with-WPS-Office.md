---
id: Building-an-AI-Powered-Writing-Assistant-with-WPS-Office.md
title: Building an AI-Powered Writing Assistant for WPS Office
author: Zilliz
date: 2021-01-27 03:35:40.105+00
desc: Learn how Kingsoft leveraged Milvus, an open-source similarity search engine, to build a recommendation engine for WPS Office’s AI-powered writing assistant.
banner: ../assets/blogCover.png
cover: ../assets/blogCover.png
tag: test1
origin: https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office
---
  
# Building an AI-Powered Writing Assistant for WPS Office
WPS Office is a productivity tool developed by Kingsoft with over 150M users worldwide. The company’s artificial intelligence (AI) department built a smart writing assistant from scratch using semantic matching algorithms such as intent recognition and text clustering. The tool exists both as a web application and [WeChat mini program](https://walkthechat.com/wechat-mini-programs-simple-introduction/) that helps users quickly create outlines, individual paragraphs, and entire documents by simply inputting a title and selecting up to five keywords.

The writing assistant’s recommendation engine uses Milvus, an open-source similarity search engine, to power its core vector processing module. Below we’ll explore the process for building WPS Offices’ smart writing assistant, including how features are extracted from unstructured data as well as the role Milvus plays in storing data and powering the tool’s recommendation engine.

Jump to:
- [Making sense of unstructured textual data](#making-sense-of-unstructured-textual-data)
- [Using the TFIDF model to maximize feature extraction](#using-the-tfidf-model-to-maximize-feature-extraction)
- [Extracting features with the bi-directional LSTM-CNNs-CRF deep learning model](#extracting-features-with-the-bi-directional-lstm-cnns-crf-deep-learning-model)
- [Creating sentence embeddings using Infersent](#creating-sentence-embeddings-using-infersent)
- [Storing and querying vectors with Milvus](#storing-and-querying-vectors-with-milvus)


### Making sense of unstructured textual data
Much like any modern problem worth solving, building the WPS writing assistant begins with messy data. Tens of millions of dense text documents from which meaningful features must be extracted, to be a bit more precise. To understand the complexity of this problem consider how two journalists from different news outlets might report on the same topic.

While both will adhere to the rules, principles, and processes that govern sentence structure, they will make different word choices, create sentences of varying length, and use their own article structures to tell similar (or perhaps dissimilar) stories. Unlike structured datasets with a fixed number of dimensions, bodies of text inherently lack structure because the syntax that governs them is so malleable. In order to find meaning, machine readable features must be extracted from an unstructured corpus of documents. But first, the data must be cleaned.

There are a variety of ways to clean textual data, none of which this article will cover in depth. Nonetheless, this is an important step that preempts processing the data, and can include removing tags, removing accented characters, expanding contractions, removing special characters, removing stopwords, and more. A detailed explanation of methods for pre-processing and cleaning text data can be found [here](https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41).


### Using the TFIDF model to maximize feature extraction

To begin making sense of unstructured textual data, the term frequency–inverse document frequency (TFIDF) model was applied to the corpus the WPS writing assistant pulls from. This model uses a combination of two metrics, term frequency and inverse document frequency, to give each word within a document a TFIDF value. Term frequency (TF) represents the raw count of a term in a document divided by the total number of terms in the document, while inverse document frequency (IDF) is the number of documents in a corpus divided by the number of documents in which a term appears.

The product of TF and IDF provides a measure of how frequent a term appears in a document multiplied by how unique the word is in the corpus. Ultimately, TFIDF values are a measure of how relevant a word is to a document within a collection of documents. Terms are sorted by TFIDF values, and those with low values (i.e. common words) can be given less weight when using deep learning to extract features from the corpus.


### Extracting features with the bi-directional LSTM-CNNs-CRF deep learning model

Using a combination of bi-directional long short-term memory (BLSTM), convolutional neural networks (CNN), and conditional random fields (CRF) both word- and character-level representations can be extracted from the corpus. The [BLSTM-CNNs-CRF model](https://arxiv.org/pdf/1603.01354.pdf) used to build the WPS Office writing assistant works as follows:

1. **CNN:** Character embeddings are used as inputs to the CNN, then semantically relevant word structures (i.e. the prefix or suffix) are extracted and encoded into character-level representation vectors.
2. **BLSTM:** Character-level vectors are concatenated with word embedding vectors then fed into the BLSTM network. Each sequence is presented forwards and backwards to two separate hidden states to capture past and future information.
3. **CRF:** The output vectors from the BLSTM are fed to the CRF layer to jointly decode the best label sequence.

The neural network is now capable of extracting and classifying named entities from unstructured text. This process is called [named entity recognition (NER)](https://en.wikipedia.org/wiki/Named-entity_recognition) and involves locating and classifying categories such as person names, institutions, geographic locations, and more. These entities play an important role in sorting and recalling data. From here key sentences, paragraphs, and summaries can be extracted from the corpus.


### Creating sentence embeddings using Infersent

[Infersent](https://github.com/facebookresearch/InferSent), a supervised sentence embeddings method designed by Facebook that embeds full sentences into vector space, is used to create vectors that will be fed into the Milvus database. Infersent was trained using the Stanford Natural Language Inference (SNLI) corpus, which contains 570k pairs of sentences that were written and labelled by humans. Additional information about how Infersent works can be found [here](https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001).


### Storing and querying vectors with Milvus

[Milvus](https://www.milvus.io/) is an open source similarity search engine that supports adding, deleting, updating, and near-real-time search of embeddings on a trillion bytes scale. To improve query performance, Milvus allows an index type to be specified for each vector field. The WPS Office smart assistant uses the IVF_FLAT index, the most basic Inverted File (IVF) index type where “flat” means vectors are stored without compression or quantization. Clustering is based on IndexFlat2, which uses exact search for L2 distance.

Although IVF_FLAT has a 100% query recall rate, its lack of compression results in comparatively slow query speeds. Milvus’ [partitioning function](https://www.milvus.io/docs/v0.10.2/storage_concept.md) is used to divide data into multiple parts of physical storage based on predefined rules, making queries faster and more accurate. When vectors are added to Milvus, tags specify which partition the data should be added to. Queries of the vector data use tags to specify which partition the query should be executed on. Data can be further broken down into segments within each partition to further improve speed.

The intelligent writing assistant also uses Kubernetes clusters, allowing application containers to run across multiple machines and environments, as well as MySQL for metadata management.

### AI isn’t replacing writers, it’s helping them write

Kingsoft’s writing assistant for WPS Office relies on Milvus to manage and query a database of more than 2 million documents. The system is highly flexible, capable of running near real-time search on trillion-scale datasets. Queries complete in 0.2 seconds on average, meaning entire documents can be generated almost instantaneously using just a title or a few keywords. Although AI isn’t replacing professional writers, technology that exists today is capable of augmenting the writing process in novel and interesting ways. The future is unknown, but at the very least writers can look forward to more productive, and for some less difficult, methods of “putting pen to paper.”


The following sources were used for this article:

- “[End-to-end Sequence Labeling via Bi-directional LSTM-CNNs-CRF](https://arxiv.org/pdf/1603.01354.pdf),” Xuezhe Ma and Eduard Hovy.
- “[Traditional Methods for Text Data](https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41),” Dipanjan (DJ) Sarkar.
- “[Text Features Extraction based on TF-IDF Associating Semantic](https://ieeexplore.ieee.org/document/8780663),” Qing Liu, Jing Wang, Dehai Zhang, Yun Yang, NaiYao Wang.
- “[Understanding Sentence Embeddings using Facebook’s Infersent](https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001),” Rehan Ahmad
- “[Supervised Learning of Universal Sentence Representations from Natural Language Inference Data](https://arxiv.org/pdf/1705.02364.pdf),” Alexis Conneau, Douwe Kiela, Holger Schwenk, LoÏc Barrault, Antoine Bordes.V1

Read other [user stories](https://zilliz.com/user-stories) to learn more about making things with Milvus.


  