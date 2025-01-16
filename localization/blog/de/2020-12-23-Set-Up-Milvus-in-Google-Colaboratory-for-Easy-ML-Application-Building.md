---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: >-
  Einrichten von Milvus in Google Colaboratory zur einfachen Erstellung von
  ML-Anwendungen
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Mit Google Colab wird das Entwickeln und Testen von Anwendungen für
  maschinelles Lernen zum Kinderspiel. Erfahren Sie, wie Sie Milvus in Colab
  einrichten, um Vektordaten in großem Maßstab besser zu verwalten.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Einrichten von Milvus im Google Colaboratory zur einfachen Erstellung von ML-Anwendungen</custom-h1><p>Der technologische Fortschritt macht künstliche Intelligenz (KI) und maschinelle Analysen immer zugänglicher und einfacher zu nutzen. Die <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">Verbreitung</a> von Open-Source-Software, öffentlichen Datensätzen und anderen kostenlosen Tools sind die Hauptantriebskräfte dieses Trends. Durch die Kombination von zwei kostenlosen Ressourcen, <a href="https://milvus.io/">Milvus</a> und <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a> (kurz "Colab"), kann jeder leistungsstarke, flexible KI- und Datenanalyselösungen erstellen. Dieser Artikel enthält Anleitungen zur Einrichtung von Milvus in Colab sowie zur Durchführung grundlegender Operationen mit dem Python Software Development Kit (SDK).</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#what-is-milvus">Was ist Milvus?</a></li>
<li><a href="#what-is-google-colaboratory">Was ist Google Colaboratory?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Erste Schritte mit Milvus in Google Colaboratory</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Ausführen grundlegender Milvus-Vorgänge in Google Colab mit Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus und Google Colaboratory arbeiten hervorragend zusammen</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Was ist Milvus?</h3><p><a href="https://milvus.io/">Milvus</a> ist eine Open-Source-Suchmaschine für Vektorähnlichkeit, die mit weit verbreiteten Indexbibliotheken wie Faiss, NMSLIB und Annoy integriert werden kann. Die Plattform umfasst auch eine umfassende Reihe von intuitiven APIs. Durch die Verknüpfung von Milvus mit Modellen der künstlichen Intelligenz (KI) kann eine Vielzahl von Anwendungen erstellt werden, darunter:</p>
<ul>
<li>Bild-, Video-, Audio- und semantische Textsuchmaschinen.</li>
<li>Empfehlungssysteme und Chatbots.</li>
<li>Entwicklung neuer Medikamente, genetisches Screening und andere biomedizinische Anwendungen.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">Was ist Google Colaboratory?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a> ist ein Produkt des Google Research-Teams, das es jedem ermöglicht, Python-Code über einen Webbrowser zu schreiben und auszuführen. Colab wurde speziell für Anwendungen im Bereich des maschinellen Lernens und der Datenanalyse entwickelt, bietet eine kostenlose Jupyter-Notebook-Umgebung, synchronisiert sich mit Google Drive und bietet Nutzern Zugang zu leistungsstarken Cloud-Computing-Ressourcen (einschließlich GPUs). Die Plattform unterstützt viele beliebte Bibliotheken für maschinelles Lernen und kann mit PyTorch, TensorFlow, Keras und OpenCV integriert werden.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Erste Schritte mit Milvus im Google Colaboratory</h3><p>Obwohl Milvus die <a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">Verwendung von Docker</a> für die Installation und den Start des Dienstes empfiehlt, unterstützt die aktuelle Google Colab Cloud-Umgebung die Installation von Docker nicht. Außerdem soll dieses Tutorial so zugänglich wie möglich sein - und nicht jeder verwendet Docker. Installieren und starten Sie das System, indem Sie <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">den Quellcode von Milvus kompilieren</a>, um die Verwendung von Docker zu vermeiden.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Laden Sie den Quellcode von Milvus herunter und erstellen Sie ein neues Notizbuch in Colab</h3><p>Auf Google Colab ist die gesamte unterstützende Software für Milvus vorinstalliert, einschließlich der erforderlichen Kompilierungswerkzeuge GCC, CMake und Git sowie der CUDA- und NVIDIA-Treiber, was den Installations- und Einrichtungsprozess für Milvus vereinfacht. Um zu beginnen, laden Sie den Quellcode von Milvus herunter und erstellen Sie ein neues Notizbuch in Google Colab:</p>
<ol>
<li>Laden Sie den Quellcode von Milvus herunter: Milvus_Anleitung.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Laden Sie den Quellcode von Milvus in <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> hoch und erstellen Sie ein neues Notizbuch.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Kompilieren Sie Milvus aus dem Quellcode</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Milvus-Quellcode herunterladen</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">Abhängigkeiten installieren</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Milvus-Quellcode erstellen</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Hinweis: Wenn die GPU-Version korrekt kompiliert wurde, erscheint die Meldung "GPU resources ENABLED!</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Milvus-Server starten</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">Fügen Sie das Verzeichnis lib/ zum LD_LIBRARY_PATH hinzu:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Starten Sie den Milvus-Server und lassen Sie ihn im Hintergrund laufen:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Milvus-Server-Status anzeigen:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Hinweis: Wenn der Milvus-Server erfolgreich gestartet wurde, erscheint die folgende Aufforderung:</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Ausführen grundlegender Milvus-Operationen in Google Colab mit Python</h3><p>Nach dem erfolgreichen Start in Google Colab kann Milvus eine Vielzahl von API-Schnittstellen für Python, Java, Go, Restful und C++ bereitstellen. Im Folgenden finden Sie Anweisungen zur Verwendung der Python-Schnittstelle, um grundlegende Milvus-Operationen in Colab durchzuführen.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">Installieren Sie pymilvus:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">Verbinden Sie sich mit dem Server:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">Erstellen Sie eine Sammlung/Partition/Index:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">Einfügen und flushen:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">Laden und Suchen:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">Sammlungs-/Index-Informationen abrufen:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">Vektoren nach ID abrufen:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">Parameter abrufen/einstellen:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">Index/Vektoren/Partition/Sammlung löschen:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus und Google Colaboratory arbeiten hervorragend zusammen</h3><p>Google Colaboratory ist ein kostenloser und intuitiver Cloud-Service, der die Kompilierung von Milvus aus dem Quellcode und die Ausführung grundlegender Python-Operationen erheblich vereinfacht. Beide Ressourcen können von jedermann genutzt werden, wodurch KI und maschinelles Lernen für jedermann zugänglich werden. Weitere Informationen über Milvus finden Sie in den folgenden Ressourcen:</p>
<ul>
<li>Weitere Tutorials zu einer Vielzahl von Anwendungen finden Sie unter <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</li>
<li>Entwickler, die Beiträge leisten oder das System nutzen möchten, finden <a href="https://github.com/milvus-io/milvus">Milvus auf GitHub</a>.</li>
<li>Weitere Informationen über das Unternehmen, das Milvus ins Leben gerufen hat, finden Sie unter <a href="https://zilliz.com/">Zilliz.com</a>.</li>
</ul>
