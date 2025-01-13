---
id: audio-retrieval-based-on-milvus.md
title: 處理技術
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: 使用 Milvus 進行音訊檢索，可以即時對聲音資料進行分類和分析。
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>基於 Milvus 的音訊檢索</custom-h1><p>聲音是一種資訊密集的資料類型。雖然在視訊內容的時代，音訊可能會讓人覺得過時，但對許多人而言，音訊仍是主要的資訊來源。儘管聽眾人數長期下降，2020 年仍有 83% 的 12 歲或以上美國人在特定週間收聽地面 (AM/FM) 廣播 (低於 2019 年的 89%)。相反地，線上音訊的聽眾在過去二十年來持續增加，根據同一份<a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">皮尤研究中心的研究</a>報告，62% 的美國人每週都會收聽某種形式的線上音訊。</p>
<p>作為一種波，聲音包含四個特性：頻率、振幅、波形和持續時間。在音樂術語中，這些被稱為音高、動態、音色和持續時間。聲音還能幫助人類和其他動物感知和理解我們的環境，為我們周圍環境中物體的位置和移動提供上下文線索。</p>
<p>作為一種資訊載體，音訊可分為三類：</p>
<ol>
<li><strong>語音：</strong>由文字和語法組成的溝通媒介。透過語音辨識演算法，語音可以轉換成文字。</li>
<li><strong>音樂：</strong>聲樂和/或器樂聲音結合在一起，產生由旋律、和聲、節奏和音色組成的作品。音樂可以用樂譜來表示。</li>
<li><strong>波形：</strong>將類比聲音數位化後所得到的數位音訊訊號。波形可以代表語音、音樂、自然或合成的聲音。</li>
</ol>
<p>音訊檢索可用於即時搜尋與監控線上媒體，以打擊侵犯智慧財產權的行為。它也在音訊資料的分類和統計分析上扮演重要的角色。</p>
<h2 id="Processing-Technologies" class="common-anchor-header">處理技術<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>語音、音樂和其他一般聲音各有其獨特的特性，需要不同的處理方法。一般而言，音訊會被分為包含語音的群組和不包含語音的群組：</p>
<ul>
<li>語音音訊由自動語音辨識處理。</li>
<li>非語音音訊，包括音樂音訊、音效和數位化語音訊號，則使用音訊檢索系統處理。</li>
</ul>
<p>本文主要介紹如何使用音訊檢索系統處理非語音音訊資料。本文不涵蓋語音辨識</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">音訊特徵萃取</h3><p>特徵萃取是音訊檢索系統中最重要的技術，因為它可以進行音訊相似性搜尋。提取音頻特徵的方法分為兩類：</p>
<ul>
<li>傳統的音頻特徵萃取模型，例如高斯混合模型 (GMM) 和隱藏馬可夫模型 (HMM)；</li>
<li>基於深度學習的音頻特徵萃取模型，如重複神經網路 (RNN)、長短期記憶 (LSTM) 網路、編碼-解碼框架、注意力機制等。</li>
</ul>
<p>基於深度學習的模型的錯誤率比傳統模型低一個數量級，因此逐漸成為音訊訊號處理領域的核心技術。</p>
<p>音訊資料通常以萃取的音訊特徵來表示。檢索過程搜尋和比較的是這些特徵和屬性，而不是音訊資料本身。因此，音頻相似性檢索的有效性很大程度上取決於特徵萃取的品質。</p>
<p>本文使用用<a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">於音頻模式識別的大規模預訓音頻神經網路 (PANNs)</a>來提取特徵向量，其平均準確度 (mAP) 為 0.439 (Hershey et al., 2017)。</p>
<p>在提取出音頻資料的特徵向量後，我們可以使用 Milvus 實現高性能的特徵向量分析。</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">向量相似性搜尋</h3><p><a href="https://milvus.io/">Milvus</a>是一個雲原生的開源向量資料庫，專為管理機器學習模型和神經網路產生的嵌入向量而建立。它廣泛應用於電腦視覺、自然語言處理、計算化學、個人化推薦系統等情境。</p>
<p>下圖描述了使用 Milvus 的一般相似性搜尋流程：<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>非結構化資料透過深度學習模型轉換為特徵向量，並插入 Milvus。</li>
<li>Milvus 會儲存這些特徵向量並建立索引。</li>
<li>Milvus 會根據要求搜尋並傳回與查詢向量最相似的向量。</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">系統概觀<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>音訊檢索系統主要由兩部分組成：插入（黑線）和搜尋（紅線）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>音訊檢索系統.png</span> </span></p>
<p>本專案使用的樣本資料集包含開放原始碼的遊戲音效，程式碼詳述於<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Milvus bootcamp</a>。</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">步驟 1：插入資料</h3><p>以下是使用預先訓練的 PANNs 推理模型產生音訊嵌入並插入 Milvus 的範例程式碼，Milvus 會為每個向量嵌入指定唯一的 ID。</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>然後，傳回的<strong>ids_milvus</strong>會與其他相關資訊 (例如<strong>wav_name</strong>)，一起儲存在 MySQL 資料庫中的音訊資料，以供後續處理之用。</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">步驟 2：音訊搜尋</h3><p>Milvus 會計算預先儲存的特徵向量與輸入特徵向量之間的內積距離，輸入特徵向量是使用 PANNs 推理模型從查詢的音訊資料中萃取出來，並傳回類似特徵向量的<strong>ids_milvus</strong>，這些特徵向量對應於所搜尋的音訊資料。</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">API 參考與示範<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>本音訊檢索系統是以開放原始碼建立。其主要功能為音訊資料的插入與刪除。在瀏覽器中輸入<strong>127.0.0.1:<port></strong>/docs，即可檢視所有 API。</p>
<h3 id="Demo" class="common-anchor-header">示範</h3><p>我們在線上提供了以 Milvus 為基礎的音訊檢索系統的<a href="https://zilliz.com/solutions">即時示範</a>，您可以使用自己的音訊資料進行試用。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>audio-search-demo.png</span> </span></p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>生活在大資料時代，人們發現生活中充斥著各式各樣的資訊。為了更好地理解這些資訊，傳統的文字檢索已經無法滿足需求。現今的資訊檢索技術急需檢索各種非結構化資料類型，例如視訊、影像和音訊。</p>
<p>電腦難以處理的非結構化資料，可以利用深度學習模型轉換成特徵向量。這些轉換後的資料可以輕鬆地由機器處理，讓我們能夠以前人無法做到的方式分析非結構化資料。Milvus 是一個開放原始碼的向量資料庫，可以有效率地處理人工智能模型所萃取的特徵向量，並提供各種常見的向量相似度計算。</p>
<h2 id="References" class="common-anchor-header">參考文獻<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. and Slaney, M., 2017, March.用於大規模音頻分類的 CNN 架構。In 2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pp.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">別做陌生人<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><p>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上尋找或貢獻 Milvus。</p></li>
<li><p>透過<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 與社群互動。</p></li>
<li><p>在<a href="https://twitter.com/milvusio">Twitter</a> 上與我們連線。</p></li>
</ul>
