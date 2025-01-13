---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: 在 Google Colaboratory 中设置 Milvus，轻松构建 ML 应用程序
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: Google Colab 让开发和测试机器学习应用程序变得轻而易举。了解如何在 Colab 中设置 Milvus，以便更好地管理大规模向量数据。
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>在 Google Colaboratory 中设置 Milvus，轻松构建 ML 应用程序</custom-h1><p>技术的进步不断使人工智能（AI）和机器级分析变得更容易获得和使用。开源软件、公共数据集和其他免费工具的<a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">普及</a>是推动这一趋势的主要力量。通过将<a href="https://milvus.io/">Milvus</a>和<a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a>（简称 "Colab"）这两种免费资源配对使用，任何人都可以创建强大、灵活的人工智能和数据分析解决方案。本文将介绍如何在 Colab 中设置 Milvus，以及如何使用 Python 软件开发工具包（SDK）执行基本操作。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#what-is-milvus">Milvus 是什么？</a></li>
<li><a href="#what-is-google-colaboratory">什么是 Google Colaboratory？</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">在 Google Colaboratory 中开始使用 Milvus</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">使用 Python 在 Google Colab 中运行 Milvus 的基本操作符</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus 和 Google Colaboratory 完美配合</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvus 是什么？</h3><p><a href="https://milvus.io/">Milvus</a>是一个开源的向量相似性搜索引擎，可以与广泛采用的索引库（包括 Faiss、NMSLIB 和 Annoy）集成。该平台还包括一整套直观的应用程序接口。通过将 Milvus 与人工智能（AI）模型配对，可以构建包括以下在内的各种应用：</p>
<ul>
<li>图像、视频、音频和语义文本搜索引擎。</li>
<li>推荐系统和聊天机器人。</li>
<li>新药开发、基因筛选和其他生物医学应用。</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">什么是谷歌实验室？</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a>是谷歌研究团队的一款产品，允许任何人通过网络浏览器编写和运行 python 代码。Colab 以机器学习和数据分析应用为目标，提供免费的 Jupyter 笔记本环境，与 Google Drive 同步，并允许用户访问强大的云计算资源（包括 GPU）。该平台支持许多流行的机器学习库，并可与 PyTorch、TensorFlow、Keras 和 OpenCV 集成。</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">在 Google Colaboratory 中开始使用 Milvus</h3><p>尽管 Milvus 推荐<a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">使用 Docker</a>来安装和启动服务，但当前的 Google Colab 云环境并不支持 Docker 安装。此外，本教程旨在尽可能方便用户使用，而且并非所有人都使用 Docker。通过<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">编译 Milvus 的源代码</a>来安装和启动系统，以避免使用 Docker。</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">下载 Milvus 的源代码并在 Colab 中创建新笔记本</h3><p>Google Colab 预装了 Milvus 的所有支持软件，包括所需的编译工具 GCC、CMake 和 Git 以及 CUDA 和 NVIDIA 驱动程序，简化了 Milvus 的安装和设置过程。首先，下载 Milvus 的源代码并在 Google Colab 中创建一个新笔记本：</p>
<ol>
<li>下载 Milvus 源代码：Milvus_tutorial.ipynb。</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>将 Milvus 的源代码上传到<a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a>，并创建一个新笔记本。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">从源代码编译 Milvus</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">下载 Milvus 源代码</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">安装依赖项</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">构建 Milvus 源代码</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>注意：如果 GPU 版本编译正确，则会出现 "GPU 资源已启用！"的提示。</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">启动 Milvus 服务器</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">将 lib/ 目录添加到 LD_LIBRARY_PATH：</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">在后台启动并运行 Milvus 服务器：</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">显示 Milvus 服务器状态：</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>注意：如果成功启动 Milvus 服务器，会出现以下提示：</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">使用 Python 在 Google Colab 中运行 Milvus 的基本操作符</h3><p>在 Google Colab 中成功启动后，Milvus 可以为 Python、Java、Go、Restful 和 C++ 提供多种 API 接口。以下是使用 Python 界面在 Colab 中执行 Milvus 基本操作的说明。</p>
<h4 id="Install-pymilvus" class="common-anchor-header">安装 pymilvus：</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">连接服务器：</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">创建 Collections/分区/索引：</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">插入和刷新</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">加载和搜索</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">获取 Collections/index 信息：</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">通过 ID 获取向量</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">获取/设置参数</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">删除索引/向量/分区/ Collections：</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus 和 Google Colaboratory 完美合作</h3><p>Google Colaboratory 是一项免费且直观的云服务，它大大简化了从源代码编译 Milvus 和运行基本 Python 操作的过程。这两种资源可供任何人使用，使人工智能和机器学习技术更容易为每个人所掌握。有关 Milvus 的更多信息，请查看以下资源：</p>
<ul>
<li>有关涵盖各种应用的其他教程，请访问<a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>。</li>
<li>对于有兴趣做出贡献或利用该系统的开发人员，请<a href="https://github.com/milvus-io/milvus">在 GitHub 上</a>查找<a href="https://github.com/milvus-io/milvus">Milvus</a>。</li>
<li>有关推出 Milvus 的公司的更多信息，请访问<a href="https://zilliz.com/">Zilliz.com</a>。</li>
</ul>
