---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: 在 Google Colaboratory 設定 Milvus，輕鬆建立 ML 應用程式
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: Google Colab 讓開發和測試機器學習應用程式變得輕而易舉。了解如何在 Colab 中設定 Milvus，以便更好地管理大規模向量資料。
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>在 Google Colaboratory 設定 Milvus，輕鬆建立 ML 應用程式</custom-h1><p>科技的進步讓人工智慧 (AI) 和機器規模分析變得更容易取得和使用。開放原始碼軟體、公共資料集和其他免費工具的<a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">激增</a>是推動這股趨勢的主要力量。透過搭配<a href="https://milvus.io/">Milvus</a>和<a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a>(簡稱「Colab」) 這兩種免費資源，任何人都可以建立強大、靈活的 AI 和資料分析解決方案。本文提供在 Colab 中設定 Milvus，以及使用 Python 軟體開發套件 (SDK) 執行基本操作的說明。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#what-is-milvus">什麼是 Milvus？</a></li>
<li><a href="#what-is-google-colaboratory">什麼是 Google Colaboratory？</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">在 Google Colaboratory 開始使用 Milvus</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">在 Google Colab 中使用 Python 執行 Milvus 的基本操作</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus 與 Google Colaboratory 完美結合</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvus 是什麼？</h3><p><a href="https://milvus.io/">Milvus</a>是一個開放原始碼的向量相似性搜尋引擎，可以整合廣泛採用的索引函式庫，包括 Faiss、NMSLIB 和 Annoy。該平台還包含一套完整的直覺式 API。透過 Milvus 與人工智慧 (AI) 模型的搭配，可以建立多樣化的應用程式，包括</p>
<ul>
<li>圖像、視訊、音訊和語意文字搜尋引擎。</li>
<li>推薦系統和聊天機器人。</li>
<li>新藥開發、基因篩選及其他生物醫學應用。</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">什麼是 Google Colaboratory？</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a>是 Google 研究團隊的產品，可讓任何人透過網頁瀏覽器撰寫並執行 python 程式碼。Colab 是針對機器學習和資料分析應用而打造，提供免費的 Jupyter 記事本環境、與 Google Drive 同步，並讓使用者存取強大的雲端運算資源 (包括 GPU)。該平台支援許多流行的機器學習函式庫，並可與 PyTorch、TensorFlow、Keras 和 OpenCV 整合。</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">在 Google Colaboratory 開始使用 Milvus</h3><p>雖然 Milvus 建議<a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">使用 Docker</a>安裝並啟動服務，但目前的 Google Colab 雲端環境並不支援 Docker 安裝。此外，本教學的目的是盡可能讓大家容易上手 - 並非每個人都會使用 Docker。透過<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">編譯 Milvus 的原始碼來</a>安裝和啟動系統，以避免使用 Docker。</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">下載 Milvus 的原始碼，並在 Colab 中建立新筆記本</h3><p>Google Colab 預先安裝了 Milvus 的所有支援軟體，包括所需的編譯工具 GCC、CMake 和 Git，以及驅動程式 CUDA 和 NVIDIA，簡化了 Milvus 的安裝和設定過程。首先，請下載 Milvus 的原始碼，並在 Google Colab 中建立新的筆記型電腦：</p>
<ol>
<li>下載 Milvus 原始碼：Milvus_tutorial.ipynb。</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>上傳 Milvus 原始碼到<a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a>並建立新的筆記型電腦。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">從原始碼編譯 Milvus</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">下載 Milvus 原始碼</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">安裝相依性</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">建立 Milvus 原始碼</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>注意：如果GPU版本編譯正確，會出現 "GPU resources ENABLED!</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">啟動 Milvus 伺服器</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">將 lib/ 目錄加入 LD_LIBRARY_PATH：</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">在背景啟動並執行 Milvus 伺服器：</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">顯示 Milvus 伺服器狀態：</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>注意: 如果成功啟動 Milvus 伺服器，會出現以下提示：</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">在 Google Colab 中使用 Python 執行 Milvus 的基本操作</h3><p>在 Google Colab 成功啟動後，Milvus 可以提供 Python、Java、Go、Restful 及 C++ 等多種 API 介面。以下是在 Colab 中使用 Python 介面執行 Milvus 基本操作的說明。</p>
<h4 id="Install-pymilvus" class="common-anchor-header">安裝 pymilvus：</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">連接到伺服器：</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">建立集合/分區/索引：</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">插入和刷新：</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">載入與搜尋</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">取得資料集/索引資訊</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">依 ID 取得向量：</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">取得/設定參數：</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">刪除索引/向量/分區/集合：</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus 與 Google Colaboratory 完美結合</h3><p>Google Colaboratory 是免費且直覺的雲端服務，可大幅簡化從原始碼編譯 Milvus 以及執行基本 Python 作業。這兩種資源任何人都可以使用，讓 AI 和機器學習技術更加普及。如需更多關於 Milvus 的資訊，請參閱下列資源：</p>
<ul>
<li>如需其他涵蓋各種應用的教學，請造訪<a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>。</li>
<li>對於有興趣貢獻或利用系統的開發人員，請<a href="https://github.com/milvus-io/milvus">在 GitHub 上</a>找到<a href="https://github.com/milvus-io/milvus">Milvus</a>。</li>
<li>如需有關推出 Milvus 的公司的更多資訊，請造訪<a href="https://zilliz.com/">Zilliz.com</a>。</li>
</ul>
