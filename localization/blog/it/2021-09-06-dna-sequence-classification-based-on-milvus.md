---
id: dna-sequence-classification-based-on-milvus.md
title: DNA Sequence Classification based on Milvus
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: >-
  Use Milvus, an open-source vector database, to recognize gene families of DNA
  sequences. Less space but higher accuracy.
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>DNA Sequence Classification based on Milvus</custom-h1><blockquote>
<p>Author:
Mengjia Gu, a data engineer at Zilliz, graduated from McGill University with a Master degree in Information Studies. Her interests include AI applications and similarity search with vector databases. As a community member of open-source project Milvus, she has provided and improved various solutions, like recommendation system and DNA sequence classification model. She enjoys challenges and never gives up!</p>
</blockquote>
<custom-h1>Introduction</custom-h1><p>DNA sequence is a popular concept in both academic research and practical applications, such as gene traceability, species identification, and disease diagnosis. Whereas all industries starve for a more intelligent and efficient research method, artificial intelligence has attracted much attention especially from biological and medical domain. More and more scientists and researchers are contributing to machine learning and deep learning in bioinformatics. To make experimental results more convincing, one common option is increasing sample size. The collaboration with big data in genomics as well brings more possibilities of use case in reality. However, the traditional sequence alignment has limitations, which make it <a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">unsuitable for large data</a>. In order to make less trade-off in reality, vectorization is a good choice for a large dataset of DNA sequences.</p>
<p>The open source vector database <a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> is friendly for massive data. It is able to store vectors of nucleic acid sequences and perform high-efficiency retrieval. It can also help reduce the cost of production or research. The DNA sequence classification system based on Milvus only takes milliseconds to do gene classification. Moreover, it shows a higher accuracy than other common classifiers in machine learning.</p>
<custom-h1>Data Processing</custom-h1><p>A gene that encodes genetic information is made up of a small section of DNA sequences, which consists of 4 nucleotide bases [A, C, G, T]. There are about 30,000 genes in human genome, nearly 3 billion DNA base pairs, and each base pair has 2 corresponding bases. To support diverse uses, DNA sequences can be classified into various categories. In order to reduce the cost and make easier use of data of long DNA sequnces, <a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">k-mer </a>is introduced to data preprocessing. Meanwhile, it makes DNA sequence data more similar to plain text. Furthermore, vectorized data can speed up calculation in data analysis or machine learning.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
    <span>1.png</span>
  </span>
</p>
<p><strong>k-mer</strong></p>
<p>The k-mer method is commonly used in DNA sequence preprocessing. It extracts a small section of length k starting from each base of the original sequence, thereby converting a long sequence of length s to (s-k+1) short sequences of length k. Adjusting the value of k will improve the model performance. Lists of short sequences are easier for data reading, feature extraction, and vectorization.</p>
<p><strong>Vectorization</strong></p>
<p>DNA sequences are vectorized in the form of text. A sequence transformed by k-mer becomes a list of short sequences, which looks like a list of individual words in a sentence. Therefore, most natural language processing models should work for DNA sequence data as well. Similar methodologies can be applied to model training, feature extraction, and encoding. Since each model has its own advantages and drawbacks, the selection of models depends on the feature of data and the purpose of research. For example, CountVectorizer, a bag-of-words model, implements feature extraction through straightforward tokenization. It sets no limit on data length, but the result returned is less obvious in terms of similarity comparison.</p>
<custom-h1>Milvus Demo</custom-h1><p>Milvus can easily manage unstructured data and recall most similar results among trillions of vectors within an average delay of milliseconds. Its similarity search is based on Approximate Nearest Neighbor (ANN) search algorithm. These highlights make Milvus a great option to manage vectors of DNA sequences, hence promote the development and applications of bioinformatics.</p>
<p>Here is a demo showing how to build a DNA sequence classification system with Milvus. The <a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">experimental dataset </a>includes 3 organisms and 7 gene families. All data are converted to lists of short sequences by k-mers. With a pre-trained CountVectorizer model, the system then encodes sequence data into vectors. The flow chart below depicts the system structure and the processes of inserting and searching.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
    <span>1.png</span>
  </span>
</p>
<p>Try out this demo at <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">Milvus bootcamp</a>.</p>
<p>In Milvus, the system creates collection and inserts corresponding vectors of DNA sequences into the collection (or partition if enabled). When receiving a query request, Milvus will return distances between the vector of input DNA sequence and most similar results in database. The class of input sequence and similarity between DNA sequences can be determined by vector distances in results.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>DNA Sequence Classification</strong>
Searching for most similar DNA sequences in Milvus could imply the gene family of an unknown sample, thus learn about its possible functionality.<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> If a sequence is classified as GPCRs, then it probably has influence in body functions. </a>In this demo, Milvus has successfully enabled the system to identify the gene families of the human DNA sequences searched with.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
    <span>3.png</span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" />
    <span>4.png</span>
  </span>
</p>
<p><strong>Genetic Similarity</strong></p>
<p>Average DNA sequence similarity between organisms illustrates how close between their genomes. The demo searches in human data for most similar DNA sequences as that of chimpanzee and dog respectively. Then it calculates and compares average inner product distances (0.97 for chimpanzee and 0.70 for dog), which proves that chimpanzee shares more similar genes with human than dog shares. With more complex data and system design, Milvus is able to support genetic research even on a higher level.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Performance</strong></p>
<p>The demo trains the classification model with 80% human sample data (3629 in total) and uses the remaining as test data. It compares performance of the DNA sequence classification model which uses Milvus with the one powered by Mysql and 5 popular machine learning classifiers. The model based on Milvus outperforms its counterparts in accuracy.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
    <span>1.png</span>
  </span>
</p>
<custom-h1>Further Exploration</custom-h1><p>With the development of big data technology, vectorization of DNA sequence will play a more important role in genetic research and practice. Combined with professional knowledge in bioinformatics, related studies can further benefit from the involvement of DNA sequence vectorization. Therefore, Milvus can present better results in practice. According to different scenarios and user needs, Milvus-powered similarity search and distance calculation show great potential and many possibilities.</p>
<ul>
<li><strong>Study unknown sequences</strong>: <a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">According to some researchers, vectorization can compress DNA sequence data.</a> At the same time, it requires less effort to study structure, function, and evolution of unknown DNA sequences. Milvus can store and retrieve a huge number of DNA sequence vectors without losing accuracy.</li>
<li><strong>Adapt devices</strong>: Limited by traditional algorithms of sequence alignment, similarity search can barely benefit from device (<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">CPU</a>/<a href="https://mjeer.journals.ekb.eg/article_146090.html">GPU</a>) improvement. Milvus, which supports both regular CPU computation and GPU acceleration, resolves this problem with approximate nearest neighbor algorithm.</li>
<li><strong>Detect virus &amp; trace origins</strong>: <a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">Scientists have compared genome sequences and reported that COVID19 virus of probable bat origin belongs to SARS-COV</a>. Based on this conclusion, researchers can expand sample size for more evidence and patterns.</li>
<li><strong>Diagnose diseases</strong>: Clinically, doctors could compare DNA sequences between patients and healthy group to identify variant genes that cause diseases. It is possible to extract features and encode these data using proper algorithms. Milvus is able to return distances between vectors, which can be related to disease data. In addition to assisting diagnosis of disease, this application can also help to inspire the study of <a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">targeted therapy</a>.</li>
</ul>
<custom-h1>Learn more about Milvus</custom-h1><p>Milvus is a powerful tool capable of powering a vast array of artificial intelligence and vector similarity search applications. To learn more about the project, check out the following resources:</p>
<ul>
<li>Read our <a href="https://milvus.io/blog">blog</a>.</li>
<li>Interact with our open-source community on <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Use or contribute to the world’s most popular vector database on <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Quickly test and deploy AI applications with our new <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
