---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: MLアプリケーションを簡単に構築するためにGoogle Colaboratoryでmilvusをセットアップする
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Google
  Colabは機械学習アプリケーションの開発とテストを容易にします。ColabでMilvusをセットアップして、大規模なベクターデータを管理する方法をご覧ください。
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Google ColaboratoryでMilvusをセットアップし、MLアプリケーションを簡単に構築する</custom-h1><p>技術の進歩は、人工知能（AI）とマシンスケール分析をより身近で使いやすいものにしている。オープンソースソフトウェア、公開データセット、その他の無料ツールの<a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">普及は</a>、このトレンドを推進する主な力となっている。<a href="https://milvus.io/">Milvusと</a> <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a>（略して "Colab"）の2つの無料リソースを組み合わせることで、誰でも強力で柔軟なAIとデータ分析ソリューションを作成することができます。この記事では、ColabでMilvusをセットアップする方法と、Pythonソフトウェア開発キット（SDK）を使って基本的な操作を行う方法を説明する。</p>
<p><strong>ジャンプする</strong></p>
<ul>
<li><a href="#what-is-milvus">Milvusとは？</a></li>
<li><a href="#what-is-google-colaboratory">Google Colaboratoryとは？</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Google ColaboratoryでMilvusを始める</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Google ColabでPythonを使ってMilvusの基本操作を実行する</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">MilvusとGoogle Colaboratoryの見事な連携</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Milvusとは？</h3><p><a href="https://milvus.io/">Milvusは</a>オープンソースのベクトル類似度検索エンジンで、Faiss、NMSLIB、Annoyなどの広く採用されているインデックスライブラリと統合することができます。このプラットフォームには、直感的なAPIの包括的なセットも含まれています。Milvusを人工知能（AI）モデルと組み合わせることで、以下のような多種多様なアプリケーションを構築することができます：</p>
<ul>
<li>画像、動画、音声、セマンティックテキスト検索エンジン</li>
<li>レコメンデーションシステムやチャットボット</li>
<li>新薬開発、遺伝子スクリーニング、その他の生物医学アプリケーション。</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">Google Colaboratoryとは？</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratoryは</a>Google Researchチームの製品で、誰でもウェブブラウザからPythonコードを書いて実行することができます。Colabは、機械学習とデータ解析アプリケーションを念頭に構築され、無料のJupyterノートブック環境を提供し、Googleドライブと同期し、ユーザーは強力なクラウドコンピューティングリソース（GPUを含む）にアクセスすることができます。このプラットフォームは、多くの一般的な機械学習ライブラリをサポートしており、PyTorch、TensorFlow、Keras、OpenCVと統合することができる。</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Google ColaboratoryでMilvusを使い始める</h3><p>Milvusはサービスのインストールと起動に<a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">Dockerを使用する</a>ことを推奨していますが、現在のGoogle Colabクラウド環境はDockerのインストールをサポートしていません。また、このチュートリアルは可能な限り利用しやすくすることを目的としており、誰もがDockerを利用できるわけではありません。Dockerを使わないように<a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Milvusのソースコードをコンパイルして</a>システムをインストール・起動します。</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Milvusのソースコードをダウンロードし、Colabで新しいノートブックを作成する。</h3><p>Google Colabには、必要なコンパイルツールGCC、CMake、Git、ドライバCUDA、NVIDIAなど、Milvusをサポートするすべてのソフトウェアがプリインストールされており、Milvusのインストールとセットアップのプロセスを簡素化している。まず、Milvusのソースコードをダウンロードし、Google Colabで新しいノートブックを作成する：</p>
<ol>
<li>Milvusのソースコードをダウンロードする：Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Milvusのソースコードを<a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colabに</a>アップロードし、新しいノートブックを作成する。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Milvusをソースコードからコンパイルする。</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Milvusのソースコードをダウンロードする。</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">依存関係のインストール</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Milvusソースコードのビルド</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>注意: GPU版が正しくコンパイルされている場合、"GPU resources ENABLED!"通知が表示されます。</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Milvusサーバーの起動</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">LD_LIBRARY_PATHにlib/ディレクトリを追加する：</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Milvusサーバーをバックグラウンドで起動、実行します：</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Milvusサーバのステータスを表示する：</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>注意: Milvusサーバが正常に起動されると、以下のプロンプトが表示されます：</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Google ColabでPythonを使ってMilvusの基本操作を実行する</h3><p>Google Colabでの起動に成功すると、MilvusはPython、Java、Go、Restful、C++の各種APIインターフェースを提供します。以下は、Pythonインターフェイスを使用してColabでMilvusの基本的な操作を行う手順です。</p>
<h4 id="Install-pymilvus" class="common-anchor-header">pymilvusをインストールする：</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">サーバに接続する：</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">コレクション/パーティション/インデックスを作成する：</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">挿入とフラッシュ</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">ロードと検索</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">コレクション/インデックス情報の取得</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">IDによるベクターの取得</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">パラメータの取得/設定</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">インデックス/ベクター/パーティション/コレクションの削除：</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">MilvusとGoogle Colaboratoryは見事に連動します。</h3><p>Google Colaboratoryは無料の直感的なクラウドサービスで、MilvusのソースコードからのコンパイルやPythonの基本操作を大幅に簡素化します。どちらのリソースも誰でも利用でき、AIや機械学習技術をより身近なものにします。Milvusの詳細については、以下のリソースをご覧ください：</p>
<ul>
<li>幅広いアプリケーションをカバーするその他のチュートリアルについては、<a href="https://github.com/milvus-io/bootcamp">Milvus Bootcampを</a>ご覧ください。</li>
<li>システムへの貢献や活用に興味のある開発者の方は、<a href="https://github.com/milvus-io/milvus">GitHubでMilvusを</a>ご覧ください。</li>
<li>Milvusを立ち上げた会社の詳細については、<a href="https://zilliz.com/">Zilliz.comを</a>ご覧ください。</li>
</ul>
