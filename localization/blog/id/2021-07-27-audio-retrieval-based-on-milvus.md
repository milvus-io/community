---
id: audio-retrieval-based-on-milvus.md
title: Processing Technologies
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  Audio retrieval with Milvus makes it possible to classify and analyze sound
  data in real time.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>Audio Retrieval Based on Milvus</custom-h1><p>Sound is an information dense data type. Although it may feel antiquated in the era of video content, audio remains a primary information source for many people. Despite long-term decline in listeners, 83% of Americans ages 12 or older listened to terrestrial (AM/FM) radio in a given week in 2020 (down from 89% in 2019). Conversely, online audio has seen a steady rise in listeners over the past two decades, with 62% of Americans reportedly listening to some form of it on a weekly basis according to the same <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">Pew Research Center study</a>.</p>
<p>As a wave, sound includes four properties: frequency, amplitude, wave form, and duration. In musical terminology, these are called pitch, dynamic, tone, and duration. Sounds also help humans and other animals perceive and understand our environment, providing context clues for the location and movement of objects in our surroundings.</p>
<p>As an information carrier, audio can be classified into three categories:</p>
<ol>
<li><strong>Speech:</strong> A communication medium composed of words and grammar. With speech recognition algorithms, speech can be converted to text.</li>
<li><strong>Music:</strong> Vocal and/or instrumental sounds combined to produce a composition comprised of melody, harmony, rhythm, and timbre. Music can be represented by a score.</li>
<li><strong>Waveform:</strong> A digital audio signal obtained by digitizing analog sounds. Waveforms can represent speech, music, and natural or synthesized sounds.</li>
</ol>
<p>Audio retrieval can be used to search and monitor online media in real-time to crack down on infringement of intellectual property rights. It also assumes an important role in the classification and statistical analysis of audio data.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">Processing Technologies<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Speech, music, and other generic sounds each have unique characteristics and demand different processing methods. Typically, audio is separated into groups that contain speech and groups that do not:</p>
<ul>
<li>Speech audio is processed by automatic speech recognition.</li>
<li>Non-speech audio, including musical audio, sound effects, and digitized speech signals, are processed using audio retrieval systems.</li>
</ul>
<p>This article focuses on how to use an audio retrieval system to process non-speech audio data. Speech recognition is not covered in this article</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">Audio feature extraction</h3><p>Feature extraction is the most important technology in audio retrieval systems as it enables audio similarity search. Methods for extracting audio features are divided into two categories:</p>
<ul>
<li>Traditional audio feature extraction models such as Gaussian mixture models (GMMs) and hidden Markov models (HMMs);</li>
<li>Deep learning-based audio feature extraction models such as recurrent neural networks (RNNs), long short-term memory (LSTM) networks, encoding-decoding frameworks, attention mechanisms, etc.</li>
</ul>
<p>Deep learning-based models have an error rate that is an order of magnitude lower than traditional models, and therefore are gaining momentum as core technology in the field of audio signal processing.</p>
<p>Audio data is usually represented by the extracted audio features. The retrieval process searches and compares these features and attributes rather than the audio data itself. Therefore, the effectiveness of audio similarity retrieval largely depends on the feature extraction quality.</p>
<p>In this article, <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">large-scale pre-trained audio neural networks for audio pattern recognition (PANNs)</a> are used to extract feature vectors for its mean average accuracy (mAP) of 0.439 (Hershey et al., 2017).</p>
<p>After extracting the feature vectors of the audio data, we can implement high-performance feature vector analysis using Milvus.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Vector similarity search</h3><p><a href="https://milvus.io/">Milvus</a> is a cloud-native, open-source vector database built to manage embedding vectors generated by machine learning models and neural networks. It is widely used in scenarios such as computer vision, natural language processing, computational chemistry, personalized recommender systems, and more.</p>
<p>The following diagram depicts the general similarity search process using Milvus:
  

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
    <span>how-does-milvus-work.png</span>
  </span>
</p>
<ol>
<li>Unstructured data are converted to feature vectors by deep learning models and inserted into Milvus.</li>
<li>Milvus stores and indexes these feature vectors.</li>
<li>Upon request, Milvus searches and returns vectors most similar to the query vector.</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">System overview<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>The audio retrieval system mainly consists of two parts: insert (black line) and search(red line).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
    <span>audio-retrieval-system.png</span>
  </span>
</p>
<p>The sample dataset used in this project contains open-source game sounds, and the code is detailed in the <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Milvus bootcamp</a>.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">Step 1: Insert data</h3><p>Below is the example code for generating audio embeddings with the pre-trained PANNs-inference model and inserting them into Milvus, which assigns a unique ID to each vector embedding.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>Then the returned <strong>ids_milvus</strong> are stored along with other relevant information (e.g. <strong>wav_name</strong>) for the audio data held in a MySQL database for subsequent processing.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">Step 2: Audio search</h3><p>Milvus calculates the inner product distance between the pre-stored feature vectors and the input feature vectors, extracted from the query audio data using the PANNs-inference model, and returns the <strong>ids_milvus</strong> of similar feature vectors, which correspond to the audio data searched.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">API reference and demo<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>This audio retrieval system is built with open-source code. Its main features are audio data insertion and deletion. All APIs can be viewed by typing <strong>127.0.0.1:<port>/docs</strong> in the browser.</p>
<h3 id="Demo" class="common-anchor-header">Demo</h3><p>We host a <a href="https://zilliz.com/solutions">live demo</a> of the Milvus-based audio retrieval system online that you can try out with your own audio data.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
    <span>audio-search-demo.png</span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Living in the era of big data, people find their lives abound with all sorts of information. To make better sense of it, traditional text retrieval no long cuts it. Today’s information retrieval technology is in urgent need of the retrieval of various unstructured data types, such as videos, images, and audio.</p>
<p>Unstructured data, which is difficult for computers to process, can be converted into feature vectors using deep learning models. This converted data can easily be processed by machines, enabling us to analyze unstructured data in ways our predecessors were never able to. Milvus, an open-source vector database, can efficiently process the feature vectors extracted by AI models and provides a variety of common vector similarity calculations.</p>
<h2 id="References" class="common-anchor-header">References<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. and Slaney, M., 2017, March. CNN architectures for large-scale audio classification. In 2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pp. 131-135, 2017</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Don’t be a stranger<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><p>Find or contribute to Milvus on <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</p></li>
<li><p>Interact with the community via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>Connect with us on <a href="https://twitter.com/milvusio">Twitter</a>.</p></li>
</ul>
