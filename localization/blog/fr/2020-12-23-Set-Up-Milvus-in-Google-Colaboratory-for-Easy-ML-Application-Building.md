---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: >-
  Configurer Milvus dans Google Colaboratory pour faciliter la construction
  d'applications ML
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Google Colab facilite le développement et le test d'applications
  d'apprentissage automatique. Découvrez comment configurer Milvus dans Colab
  pour une meilleure gestion des données vectorielles à grande échelle.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Configurer Milvus dans Google Colaboratory pour faciliter la création d'applications de ML</custom-h1><p>Les progrès technologiques rendent l'intelligence artificielle (IA) et l'analyse à l'échelle de la machine plus accessibles et plus faciles à utiliser. La <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">prolifération</a> des logiciels libres, des ensembles de données publiques et d'autres outils gratuits sont les principaux moteurs de cette tendance. En associant deux ressources gratuites, <a href="https://milvus.io/">Milvus</a> et <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a> ("Colab" en abrégé), tout le monde peut créer des solutions d'IA et d'analyse de données puissantes et flexibles. Cet article fournit des instructions pour configurer Milvus dans Colab, ainsi que pour effectuer des opérations de base à l'aide du kit de développement logiciel (SDK) Python.</p>
<p><strong>Aller à :</strong></p>
<ul>
<li><a href="#what-is-milvus">Qu'est-ce que Milvus ?</a></li>
<li><a href="#what-is-google-colaboratory">Qu'est-ce que Google Colaboratory ?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Premiers pas avec Milvus dans Google Colaboratory</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Exécuter des opérations Milvus de base dans Google Colab avec Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus et Google Colaboratory fonctionnent parfaitement ensemble</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Qu'est-ce que Milvus ?</h3><p><a href="https://milvus.io/">Milvus</a> est un moteur de recherche de similarité vectorielle open-source qui peut s'intégrer à des bibliothèques d'index largement adoptées, notamment Faiss, NMSLIB et Annoy. La plateforme comprend également un ensemble complet d'API intuitives. En associant Milvus à des modèles d'intelligence artificielle (IA), il est possible de créer une grande variété d'applications, notamment :</p>
<ul>
<li>Moteurs de recherche d'images, de vidéos, d'audio et de textes sémantiques.</li>
<li>Systèmes de recommandation et chatbots.</li>
<li>Le développement de nouveaux médicaments, le dépistage génétique et d'autres applications biomédicales.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">Qu'est-ce que Google Colaboratory ?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a> est un produit de l'équipe Google Research qui permet à quiconque d'écrire et d'exécuter du code Python à partir d'un navigateur web. Colab a été conçu pour les applications d'apprentissage automatique et d'analyse de données. Il offre un environnement de notes Jupyter gratuit, se synchronise avec Google Drive et permet aux utilisateurs d'accéder à de puissantes ressources informatiques en nuage (y compris des GPU). La plateforme prend en charge de nombreuses bibliothèques d'apprentissage automatique et peut être intégrée à PyTorch, TensorFlow, Keras et OpenCV.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Démarrer avec Milvus dans Google Colaboratory</h3><p>Bien que Milvus recommande d'<a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">utiliser Docker</a> pour installer et démarrer le service, l'environnement cloud actuel de Google Colab ne prend pas en charge l'installation de Docker. En outre, ce tutoriel vise à être aussi accessible que possible - et tout le monde n'utilise pas Docker. Installez et démarrez le système en <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">compilant le code source de Milvus</a> pour éviter d'utiliser Docker.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Télécharger le code source de Milvus et créer un nouveau carnet de notes dans Colab</h3><p>Google Colab est livré avec tous les logiciels de prise en charge de Milvus préinstallés, y compris les outils de compilation requis GCC, CMake et Git et les pilotes CUDA et NVIDIA, ce qui simplifie le processus d'installation et de configuration de Milvus. Pour commencer, téléchargez le code source de Milvus et créez un nouveau carnet de notes dans Google Colab :</p>
<ol>
<li>Télécharger le code source de Milvus : Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Téléchargez le code source de Milvus dans <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> et créez un nouveau carnet de notes.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png (en anglais)</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Compiler Milvus à partir du code source</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Télécharger le code source de Milvus</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">Installer les dépendances</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Construire le code source de Milvus</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Note : Si la version GPU est correctement compilée, un message "GPU resources ENABLED !" apparaît.</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Lancer le serveur Milvus</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">Ajouter le répertoire lib/ à LD_LIBRARY_PATH :</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Démarrer et exécuter le serveur Milvus en arrière-plan :</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Afficher l'état du serveur Milvus :</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Remarque : Si le serveur Milvus est lancé avec succès, l'invite suivante apparaît :</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png (Configurer Milvus dans Google Colaboratory pour faciliter la création d'applications ML)</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Exécuter des opérations Milvus de base dans Google Colab avec Python</h3><p>Après un lancement réussi dans Google Colab, Milvus peut fournir une variété d'interfaces API pour Python, Java, Go, Restful et C++. Vous trouverez ci-dessous des instructions pour utiliser l'interface Python afin d'effectuer des opérations Milvus de base dans Colab.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">Installez pymilvus :</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">Se connecter au serveur :</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">Créer une collection/partition/index :</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">Insérer et vider :</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">Charger et rechercher :</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">Obtenir des informations sur la collection/l'index :</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">Obtenir des vecteurs par ID :</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">Obtention/réglage des paramètres :</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">Supprimer l'index/les vecteurs/la partition/la collection :</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus et Google Colaboratory fonctionnent parfaitement ensemble</h3><p>Google Colaboratory est un service en nuage gratuit et intuitif qui simplifie grandement la compilation de Milvus à partir du code source et l'exécution d'opérations Python de base. Ces deux ressources sont à la disposition de tous, ce qui rend l'IA et les technologies d'apprentissage automatique plus accessibles à tous. Pour plus d'informations sur Milvus, consultez les ressources suivantes :</p>
<ul>
<li>Pour des tutoriels supplémentaires couvrant une grande variété d'applications, visitez <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</li>
<li>Pour les développeurs souhaitant apporter des contributions ou exploiter le système, consultez <a href="https://github.com/milvus-io/milvus">Milvus sur GitHub</a>.</li>
<li>Pour plus d'informations sur la société qui a lancé Milvus, visitez <a href="https://zilliz.com/">Zilliz.com</a>.</li>
</ul>
