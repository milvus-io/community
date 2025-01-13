---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: Настройка Milvus в Google Colaboratory для простого создания приложений ML
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Google Colab позволяет легко разрабатывать и тестировать приложения машинного
  обучения. Узнайте, как настроить Milvus в Colab для более эффективного
  управления векторными данными в огромных масштабах.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Настройка Milvus в Google Colaboratory для простого создания приложений ML</custom-h1><p>Технологический прогресс постоянно делает искусственный интеллект (ИИ) и машинную аналитику более доступными и простыми в использовании. <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">Распространение</a> программного обеспечения с открытым исходным кодом, публичных наборов данных и других бесплатных инструментов является основной движущей силой этой тенденции. Объединив два бесплатных ресурса, <a href="https://milvus.io/">Milvus</a> и <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a> ("Colab"), каждый может создавать мощные, гибкие решения для ИИ и анализа данных. В этой статье приведены инструкции по настройке Milvus в Colab, а также по выполнению основных операций с помощью набора средств разработки программного обеспечения (SDK) на языке Python.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#what-is-milvus">Что такое Milvus?</a></li>
<li><a href="#what-is-google-colaboratory">Что такое Google Colaboratory?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Начало работы с Milvus в Google Colaboratory</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Выполнение основных операций Milvus в Google Colab с помощью Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus и Google Colaboratory прекрасно работают вместе</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Что такое Milvus?</h3><p><a href="https://milvus.io/">Milvus</a> - это поисковая система векторного сходства с открытым исходным кодом, которая может интегрироваться с широко распространенными индексными библиотеками, включая Faiss, NMSLIB и Annoy. Платформа также включает в себя полный набор интуитивно понятных API. Сопряжение Milvus с моделями искусственного интеллекта (ИИ) позволяет создавать самые разнообразные приложения, включая:</p>
<ul>
<li>Поисковые системы по изображениям, видео, аудио и семантическому тексту.</li>
<li>Рекомендательные системы и чат-боты.</li>
<li>Разработка новых лекарств, генетический скрининг и другие биомедицинские приложения.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">Что такое Google Colaboratory?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a> - это продукт команды Google Research, который позволяет любому человеку писать и выполнять код на языке python через веб-браузер. Colab был создан с учетом задач машинного обучения и анализа данных, предлагает бесплатную среду Jupyter notebook, синхронизируется с Google Drive и предоставляет пользователям доступ к мощным облачным вычислительным ресурсам (включая GPU). Платформа поддерживает множество популярных библиотек машинного обучения и может быть интегрирована с PyTorch, TensorFlow, Keras и OpenCV.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Начало работы с Milvus в Google Colaboratory</h3><p>Хотя Milvus рекомендует <a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">использовать Docker</a> для установки и запуска сервиса, текущая облачная среда Google Colab не поддерживает установку Docker. Кроме того, это руководство стремится быть максимально доступным - не все используют Docker. Чтобы избежать использования Docker, установите и запустите систему, <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">скомпилировав исходный код Milvus</a>.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Загрузите исходный код Milvus и создайте новый блокнот в Colab</h3><p>Google Colab поставляется с предустановленным программным обеспечением для Milvus, включая необходимые инструменты компиляции GCC, CMake и Git, а также драйверы CUDA и NVIDIA, что упрощает процесс установки и настройки Milvus. Чтобы начать работу, загрузите исходный код Milvus и создайте новый блокнот в Google Colab:</p>
<ol>
<li>Загрузите исходный код Milvus: Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Загрузите исходный код Milvus в <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> и создайте новый блокнот.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Скомпилируйте Milvus из исходного кода</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Загрузите исходный код Milvus</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">Установите зависимости</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Соберите исходный код Milvus</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Примечание: Если GPU-версия скомпилирована правильно, появится уведомление "GPU-ресурсы ENABLED!".</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Запустите сервер Milvus</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">Добавьте каталог lib/ в LD_LIBRARY_PATH:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Запустите и запустите сервер Milvus в фоновом режиме:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Показать состояние сервера Milvus:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Примечание: Если сервер Milvus запущен успешно, появится следующее сообщение:</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Выполнение основных операций Milvus в Google Colab с помощью Python</h3><p>После успешного запуска в Google Colab Milvus может предоставлять различные API-интерфейсы для Python, Java, Go, Restful и C++. Ниже приведены инструкции по использованию интерфейса Python для выполнения основных операций Milvus в Colab.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">Установите pymilvus:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">Подключитесь к серверу:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">Создайте коллекцию/раздел/индекс:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">Вставить и промыть:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">Загрузка и поиск:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">Получить информацию о коллекции/индексе:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">Получить векторы по ID:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">Получить/установить параметры:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">Удалить индекс/векторы/раздел/коллекцию:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus и Google Colaboratory прекрасно работают вместе</h3><p>Google Colaboratory - это бесплатный и интуитивно понятный облачный сервис, который значительно упрощает компиляцию Milvus из исходного кода и выполнение основных операций на Python. Оба ресурса доступны для всех желающих, что делает технологии искусственного интеллекта и машинного обучения более доступными для каждого. Более подробную информацию о Milvus можно найти на следующих ресурсах:</p>
<ul>
<li>Дополнительные учебные пособия, охватывающие широкий спектр приложений, можно найти на сайте <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</li>
<li>Разработчики, заинтересованные во внесении вклада или использовании системы, могут найти <a href="https://github.com/milvus-io/milvus">Milvus на GitHub</a>.</li>
<li>Более подробную информацию о компании, создавшей Milvus, можно найти на сайте <a href="https://zilliz.com/">Zilliz.com</a>.</li>
</ul>
