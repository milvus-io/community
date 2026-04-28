---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: Set Up Milvus in Google Colaboratory for Easy ML Application Building
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Google Colab makes developing and testing machine learning applications a
  breeze. Learn how to setup Milvus in Colab for better massive-scale vector
  data management.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Set Up Milvus in Google Colaboratory for Easy ML Application Building</custom-h1><p>Technological progress is perpetually making artificial intelligence (AI) and machine-scale analytics more accessible and easier to use. The <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">proliferation</a> of open-source software, public datasets, and other free tools are primary forces driving this trend. By pairing two free resources, <a href="https://milvus.io/">Milvus</a> and <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a> (“Colab” for short), anyone can create powerful, flexible AI and data analytics solutions. This article provides instructions for setting up Milvus in Colab, as well as performing basic operations using the Python software development kit (SDK).</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#what-is-milvus">What is Milvus?</a></li>
<li><a href="#what-is-google-colaboratory">What is Google Colaboratory?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Getting started with Milvus in Google Colaboratory</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Run basic Milvus operations in Google Colab with Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus and Google Colaboratory work beautifully together</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">What is Milvus?</h3><p><a href="https://milvus.io/">Milvus</a> is an open-source vector similarity search engine that can integrate with widely adopted index libraries, including Faiss, NMSLIB, and Annoy. The platform also includes a comprehensive set of intuitive APIs. By pairing Milvus with artificial intelligence (AI) models, a wide variety of applications can be built including:</p>
<ul>
<li>Image, video, audio, and semantic text search engines.</li>
<li>Recommendation systems and chatbots.</li>
<li>New drug development, genetic screening, and other biomedical applications.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">What is Google Colaboratory?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a> is a product from the Google Research team that allows anyone to write and run python code from a web browser. Colab was built with machine learning and data analysis applications in mind, offers a free Jupyter notebook environment, syncs with Google Drive, and gives users access to powerful cloud computing resources (including GPUs). The platform supports many popular machine learning libraries and can be integrated with PyTorch, TensorFlow, Keras, and OpenCV.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Getting started with Milvus in Google Colaboratory</h3><p>Although Milvus recommends <a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">using Docker</a> to install and start the service, the current Google Colab cloud environment does not support Docker installation. Additionally, this tutorial aims to be as accessible as possible — and not everyone uses Docker. Install and start the system by <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">compiling Milvus’ source code</a> to avoid using Docker.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Download Milvus’ source code and create a new notebook in Colab</h3><p>Google Colab comes with all supporting software for Milvus preinstalled, including required compilation tools GCC, CMake, and Git and drivers CUDA and NVIDIA, simplifying the installation and setup process for Milvus. To begin, download Milvus’ source code and create a new notebook in Google Colab:</p>
<ol>
<li>Download Milvus’ source code: Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Upload Milvus’ source code to <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> and create a new notebook.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
    <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span>
  </span>
</p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Compile Milvus from source code</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Download Milvus source code</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">Install dependencies</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Build Milvus source code</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Note: If the GPU version is correctly compiled, a “GPU resources ENABLED!” notice appears.</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Launch Milvus server</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">Add lib/ directory to LD_LIBRARY_PATH:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Start and run Milvus server in the background:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Show Milvus server status:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Note: If the Milvus server is launched successfully, the following prompt appears:</p>
</blockquote>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
    <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span>
  </span>
</p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Run basic Milvus operations in Google Colab with Python</h3><p>After successfully launching in Google Colab, Milvus can provide a variety of API interfaces for Python, Java, Go, Restful, and C++. Below are instructions for using the Python interface to perform basic Milvus operations in Colab.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">Install pymilvus:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">Connect to the server:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">Create a collection/partition/index:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">Insert and flush:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">Load and search:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">Get collection/index information:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">Get vectors by ID:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">Get/set parameters:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">Delete index/vectors/partition/collection:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus and Google Colaboratory work beautifully together</h3><p>Google Colaboratory is a free and intuitive cloud service that greatly simplifies compiling Milvus from source code and running basic Python operations. Both resources are available for anyone to use, making AI and machine learning technology more accessible to everyone. For more information about Milvus, check out the following resources:</p>
<ul>
<li>For additional tutorials covering a wide variety of applications, visit <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</li>
<li>For developers interested in making contributions or leveraging the system, find <a href="https://github.com/milvus-io/milvus">Milvus on GitHub</a>.</li>
<li>For more information about the company that launched Milvus, visit <a href="https://zilliz.com/">Zilliz.com</a>.</li>
</ul>
