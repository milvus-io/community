---
id: audio-retrieval-based-on-milvus.md
title: 处理技术
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: 利用 Milvus 进行音频检索，可以对声音数据进行实时分类和分析。
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>基于 Milvus 的音频检索</custom-h1><p>声音是一种信息密集的数据类型。虽然在视频内容时代，音频可能会让人感觉过时，但它仍然是许多人的主要信息来源。尽管听众人数长期下降，2020 年仍有 83% 的 12 岁及以上美国人在一周内收听地面（AM/FM）广播（低于 2019 年的 89%）。相反，在过去二十年里，在线音频的听众人数稳步上升，<a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">据皮尤研究中心</a>的同一项<a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">研究</a>显示，62%的美国人每周都会收听某种形式的在线音频。</p>
<p>作为一种波，声音有四个特性：频率、振幅、波形和持续时间。在音乐术语中，这些属性被称为音高、动态、音调和持续时间。声音还能帮助人类和其他动物感知和了解我们所处的环境，为周围环境中物体的位置和移动提供背景线索。</p>
<p>作为一种信息载体，音频可分为三类：</p>
<ol>
<li><strong>语音：</strong>由文字和语法组成的交流媒介。通过语音识别算法，可以将语音转换为文本。</li>
<li><strong>音乐：</strong>声乐和/或器乐声音的组合，由旋律、和声、节奏和音色组成。音乐可以用乐谱来表示。</li>
<li><strong>波形：</strong>将模拟声音数字化后得到的数字音频信号。波形可代表语音、音乐、自然或合成声音。</li>
</ol>
<p>音频检索可用于搜索和实时监控在线媒体，以打击侵犯知识产权的行为。它还在音频数据的分类和统计分析中发挥着重要作用。</p>
<h2 id="Processing-Technologies" class="common-anchor-header">处理技术<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>语音、音乐和其他一般声音各有特点，需要不同的处理方法。通常，音频被分为包含语音和不包含语音的两组：</p>
<ul>
<li>语音音频由自动语音识别技术处理。</li>
<li>非语音音频，包括音乐音频、音效和数字化语音信号，则使用音频检索系统进行处理。</li>
</ul>
<p>本文重点介绍如何使用音频检索系统处理非语音音频数据。本文不涉及语音识别</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">音频特征提取</h3><p>特征提取是音频检索系统中最重要的技术，因为它可以进行音频相似性搜索。音频特征提取方法分为两类：</p>
<ul>
<li>传统的音频特征提取模型，如高斯混合模型（GMM）和隐马尔可夫模型（HMM）；</li>
<li>基于深度学习的音频特征提取模型，如递归神经网络（RNN）、长短期记忆（LSTM）网络、编码-解码框架、注意力机制等。</li>
</ul>
<p>基于深度学习的模型的错误率比传统模型低一个数量级，因此正逐渐成为音频信号处理领域的核心技术。</p>
<p>音频数据通常由提取的音频特征表示。检索过程搜索和比较的是这些特征和属性，而不是音频数据本身。因此，音频相似性检索的有效性在很大程度上取决于特征提取的质量。</p>
<p>本文采用<a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">大规模预训练的音频模式识别音频神经网络（PANNs）</a>来提取特征向量，其平均准确率（mAP）为 0.439（Hershey et al.，2017）。</p>
<p>提取音频数据的特征向量后，我们可以使用 Milvus 实现高性能的特征向量分析。</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">向量相似性搜索</h3><p><a href="https://milvus.io/">Milvus</a>是一个云原生的开源向量数据库，专为管理机器学习模型和神经网络生成的 Embeddings 向量而构建。它广泛应用于计算机视觉、自然语言处理、计算化学、个性化推荐系统等场景。</p>
<p>下图描述了使用 Milvus 进行相似性搜索的一般流程：<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>深度学习模型将非结构化数据转换为特征向量，然后插入 Milvus。</li>
<li>Milvus 对这些特征向量进行存储和索引。</li>
<li>根据请求，Milvus 会搜索并返回与查询向量最相似的向量。</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">系统概述<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>音频检索系统主要由两部分组成：插入（黑线）和搜索（红线）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>音频检索系统.png</span> </span></p>
<p>本项目中使用的样本数据集包含开源游戏声音，代码详见<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Milvus bootcamp</a>。</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">步骤 1：插入数据</h3><p>以下是使用预训练的 PANNs 推理模型生成音频嵌入并将其插入 Milvus 的示例代码，Milvus 会为每个向量嵌入分配一个唯一的 ID。</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>然后将返回的<strong>ids_milvus</strong>与其他相关信息（如<strong>wav_name</strong>）一起存储到 MySQL 数据库中，以备后续处理。</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">步骤 2：音频搜索</h3><p>Milvus 利用 PANNs 推理模型计算预先存储的特征向量与从查询音频数据中提取的输入特征向量之间的内积距离，并返回相似特征向量的<strong>ids_milvus</strong>，这些特征向量与搜索到的音频数据相对应。</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">应用程序接口参考和演示<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">应用程序接口</h3><p>该音频检索系统采用开源代码构建。其主要功能是插入和删除音频数据。在浏览器中输入<strong>127.0.0.1:<port></strong>/docs，即可查看所有 API。</p>
<h3 id="Demo" class="common-anchor-header">演示</h3><p>我们在线提供基于 Milvus 的音频检索系统的<a href="https://zilliz.com/solutions">现场演示</a>，您可以使用自己的音频数据进行试用。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>音频搜索演示.png</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>生活在大数据时代，人们发现生活中充斥着各种各样的信息。要想更好地理解这些信息，传统的文本检索早已不能胜任。当今的信息检索技术迫切需要检索各种非结构化数据类型，如视频、图像和音频。</p>
<p>计算机难以处理的非结构化数据，可以利用深度学习模型转换成特征向量。这种转换后的数据可以很容易地被机器处理，使我们能够以前人无法做到的方式分析非结构化数据。Milvus 是一个开源向量数据库，可以高效处理人工智能模型提取的特征向量，并提供各种常见的向量相似性计算。</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. and Slaney, M., 2017, March.用于大规模音频分类的 CNN 架构。In 2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pp.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">不要成为陌生人<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><p>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上查找或为 Milvus 投稿。</p></li>
<li><p>通过<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 与社区互动。</p></li>
<li><p>在<a href="https://twitter.com/milvusio">Twitter</a> 上与我们联系。</p></li>
</ul>
