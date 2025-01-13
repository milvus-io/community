---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: 간편한 ML 애플리케이션 구축을 위해 Google 콜라보랩에서 Milvus 설정하기
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Google Colab을 사용하면 머신러닝 애플리케이션을 쉽게 개발하고 테스트할 수 있습니다. 더 나은 대규모 벡터 데이터 관리를 위해
  Colab에서 Milvus를 설정하는 방법을 알아보세요.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>간편한 머신러닝 애플리케이션 구축을 위해 Google 콜라보랩에서 Milvus 설정하기</custom-h1><p>기술의 발전으로 인공지능(AI)과 머신 러닝 분석에 대한 접근성과 사용 편의성이 지속적으로 향상되고 있습니다. 오픈 소스 소프트웨어, 공개 데이터 세트 및 기타 무료 도구의 <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">확산이</a> 이러한 추세를 이끄는 주요 요인입니다. 두 가지 무료 리소스인 <a href="https://milvus.io/">Milvus와</a> <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a> (줄여서 '콜랩')를 함께 사용하면 누구나 강력하고 유연한 AI 및 데이터 분석 솔루션을 만들 수 있습니다. 이 문서에서는 Colab에서 Milvus를 설정하는 방법과 Python 소프트웨어 개발 키트(SDK)를 사용하여 기본 작업을 수행하는 방법을 설명합니다.</p>
<p><strong>바로가기:</strong></p>
<ul>
<li><a href="#what-is-milvus">Milvus란 무엇인가요?</a></li>
<li><a href="#what-is-google-colaboratory">Google 콜라보랩이란 무엇인가요?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Google 콜라보랩에서 Milvus 시작하기</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Python으로 Google 콜라보랩에서 Milvus의 기본 작업 실행하기</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus와 Google 콜라보랩의 멋진 조합</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvus란 무엇인가요?</h3><p><a href="https://milvus.io/">Milvus는</a> 오픈 소스 벡터 유사도 검색 엔진으로, Faiss, NMSLIB, Annoy 등 널리 채택된 인덱스 라이브러리와 통합할 수 있습니다. 또한 이 플랫폼에는 포괄적인 직관적인 API 세트가 포함되어 있습니다. Milvus를 인공 지능(AI) 모델과 결합하면 다음과 같은 다양한 애플리케이션을 구축할 수 있습니다:</p>
<ul>
<li>이미지, 비디오, 오디오 및 시맨틱 텍스트 검색 엔진.</li>
<li>추천 시스템 및 챗봇.</li>
<li>신약 개발, 유전자 검사 및 기타 생물의학 애플리케이션.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">Google 콜라보랩이란 무엇인가요?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">구글 콜라보랩은</a> 누구나 웹 브라우저에서 파이썬 코드를 작성하고 실행할 수 있는 구글 리서치 팀의 제품입니다. 콜랩은 머신 러닝 및 데이터 분석 애플리케이션을 염두에 두고 개발되었으며, 무료 Jupyter 노트북 환경을 제공하고, Google 드라이브와 동기화되며, 사용자에게 강력한 클라우드 컴퓨팅 리소스(GPU 포함)에 대한 액세스를 제공합니다. 이 플랫폼은 많은 인기 있는 머신 러닝 라이브러리를 지원하며 PyTorch, TensorFlow, Keras 및 OpenCV와 통합할 수 있습니다.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Google 콜라보랩에서 Milvus 시작하기</h3><p>Milvus는 서비스 설치 및 시작 시 <a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">Docker를 사용할</a> 것을 권장하지만 현재 Google Colab 클라우드 환경은 Docker 설치를 지원하지 않습니다. 또한 이 튜토리얼은 가능한 한 접근성을 높이는 것을 목표로 하며 모든 사람이 Docker를 사용하는 것은 아닙니다. 밀버스의 <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">소스 코드를 컴파일하여</a> 시스템을 설치 및 시작하여 Docker를 사용하지 않도록 하세요.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Milvus의 소스 코드를 다운로드하고 Colab에서 새 노트북 만들기</h3><p>Google Colab에는 필수 컴파일 도구인 GCC, CMake, Git, 드라이버 CUDA 및 NVIDIA 등 Milvus를 위한 모든 지원 소프트웨어가 사전 설치되어 있어 Milvus의 설치 및 설정 프로세스를 간소화합니다. 시작하려면 Milvus의 소스 코드를 다운로드하고 Google Colab에서 새 노트북을 만드세요:</p>
<ol>
<li>Milvus의 소스 코드를 다운로드합니다: Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Milvus의 소스 코드를 <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab에</a> 업로드하고 새 노트북을 만듭니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>블로그_간편한 머신러닝 애플리케이션 구축을 위해 구글 콜라보랩에서 Milvus 설정하기_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">소스 코드에서 Milvus 컴파일하기</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Milvus 소스 코드 다운로드</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">종속성 설치</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Milvus 소스 코드 빌드</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>참고: GPU 버전이 올바르게 컴파일되면 "GPU 리소스 사용 가능!"이라는 알림이 표시됩니다.</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Milvus 서버 시작</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">LD_LIBRARY_PATH에 lib/ 디렉토리를 추가합니다:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Milvus 서버를 백그라운드에서 시작하고 실행합니다:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Milvus 서버 상태를 표시합니다:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>참고: Milvus 서버가 성공적으로 시작되면 다음과 같은 프롬프트가 나타납니다:</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>블로그_간편한 머신러닝 애플리케이션 구축을 위해 구글 콜라보랩에서 Milvus 설정하기_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Python으로 구글 콜라보랩에서 Milvus의 기본 작업 실행하기</h3><p>Google Colab에서 성공적으로 실행된 Milvus는 Python, Java, Go, Restful 및 C++를 위한 다양한 API 인터페이스를 제공할 수 있습니다. 다음은 Python 인터페이스를 사용하여 Colab에서 기본적인 Milvus 작업을 수행하는 방법입니다.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">파이밀버스를 설치합니다:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">서버에 연결합니다:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">컬렉션/파티션/인덱스를 생성합니다:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">삽입 및 플러시:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">로드 및 검색:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">컬렉션/색인 정보 가져오기:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">ID로 벡터 가져오기:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">매개변수 가져오기/설정하기:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">인덱스/벡터/파티션/컬렉션 삭제:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">밀버스와 구글 콜래보러토리와의 멋진 협업</h3><p>구글 콜라보랩은 무료의 직관적인 클라우드 서비스로, 소스 코드에서 Milvus를 컴파일하고 기본적인 Python 작업을 실행하는 것을 크게 간소화해 줍니다. 두 리소스 모두 누구나 사용할 수 있으므로 누구나 AI 및 머신러닝 기술에 더 쉽게 접근할 수 있습니다. Milvus에 대한 자세한 내용은 다음 리소스를 참조하세요:</p>
<ul>
<li>다양한 애플리케이션을 다루는 추가 튜토리얼을 보려면 <a href="https://github.com/milvus-io/bootcamp">Milvus 부트캠프를</a> 방문하세요.</li>
<li>기여를 하거나 시스템을 활용하는 데 관심이 있는 개발자는 <a href="https://github.com/milvus-io/milvus">GitHub에서 Milvus를</a> 찾아보세요.</li>
<li>Milvus를 출시한 회사에 대한 자세한 내용은 <a href="https://zilliz.com/">Zilliz.com을</a> 참조하세요.</li>
</ul>
