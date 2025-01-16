---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: >-
  Configurare Milvus in Google Colaboratory per semplificare la creazione di
  applicazioni ML
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Google Colab consente di sviluppare e testare applicazioni di apprendimento
  automatico in modo semplice. Scoprite come configurare Milvus in Colab per una
  migliore gestione dei dati vettoriali su larga scala.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Impostare Milvus in Google Colaboratory per semplificare la creazione di applicazioni ML</custom-h1><p>Il progresso tecnologico rende l'intelligenza artificiale (AI) e l'analisi su scala industriale sempre più accessibili e facili da usare. La <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">proliferazione</a> del software open-source, dei set di dati pubblici e di altri strumenti gratuiti sono le forze principali che guidano questa tendenza. Abbinando due risorse gratuite, <a href="https://milvus.io/">Milvus</a> e <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a> ("Colab" in breve), chiunque può creare soluzioni di AI e di analisi dei dati potenti e flessibili. Questo articolo fornisce le istruzioni per configurare Milvus in Colab e per eseguire le operazioni di base utilizzando il kit di sviluppo software (SDK) Python.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#what-is-milvus">Cos'è Milvus?</a></li>
<li><a href="#what-is-google-colaboratory">Cos'è il Google Colaboratory?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Come iniziare con Milvus in Google Colaboratory</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Eseguire le operazioni di base di Milvus in Google Colab con Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus e Google Colaboratory funzionano a meraviglia insieme</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">Che cos'è Milvus?</h3><p><a href="https://milvus.io/">Milvus</a> è un motore di ricerca di similarità vettoriale open-source che può integrarsi con le librerie di indici ampiamente adottate, tra cui Faiss, NMSLIB e Annoy. La piattaforma comprende anche una serie completa di API intuitive. Abbinando Milvus a modelli di intelligenza artificiale (AI), è possibile realizzare un'ampia gamma di applicazioni, tra cui:</p>
<ul>
<li>Motori di ricerca per immagini, video, audio e testi semantici.</li>
<li>Sistemi di raccomandazione e chatbot.</li>
<li>Sviluppo di nuovi farmaci, screening genetico e altre applicazioni biomediche.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">Cos'è il Google Colaboratory?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a> è un prodotto del team di Google Research che consente a chiunque di scrivere ed eseguire codice python da un browser web. Colab è stato costruito pensando alle applicazioni di apprendimento automatico e di analisi dei dati, offre un ambiente di notebook Jupyter gratuito, si sincronizza con Google Drive e consente agli utenti di accedere a potenti risorse di cloud computing (comprese le GPU). La piattaforma supporta molte librerie di apprendimento automatico e può essere integrata con PyTorch, TensorFlow, Keras e OpenCV.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Come iniziare con Milvus in Google Colaboratory</h3><p>Sebbene Milvus raccomandi l'<a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">uso di Docker</a> per installare e avviare il servizio, l'attuale ambiente cloud di Google Colab non supporta l'installazione di Docker. Inoltre, questo tutorial vuole essere il più accessibile possibile e non tutti utilizzano Docker. Installare e avviare il sistema <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">compilando il codice sorgente di Milvus</a> per evitare di usare Docker.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Scaricare il codice sorgente di Milvus e creare un nuovo notebook in Colab</h3><p>Google Colab viene fornito con tutto il software di supporto per Milvus preinstallato, compresi gli strumenti di compilazione GCC, CMake e Git e i driver CUDA e NVIDIA, semplificando il processo di installazione e configurazione di Milvus. Per iniziare, scaricare il codice sorgente di Milvus e creare un nuovo blocco note in Google Colab:</p>
<ol>
<li>Scaricare il codice sorgente di Milvus: Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Caricare il codice sorgente di Milvus in <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> e creare un nuovo blocco note.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Compilare Milvus dal codice sorgente</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Scaricare il codice sorgente di Milvus</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">Installare le dipendenze</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Costruire il codice sorgente di Milvus</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Nota: se la versione GPU è stata compilata correttamente, viene visualizzato l'avviso "Risorse GPU ABILITATE!</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Avviare il server Milvus</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">Aggiungere la directory lib/ a LD_LIBRARY_PATH:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Avviare ed eseguire il server Milvus in background:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Mostra lo stato del server Milvus:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Nota: se il server Milvus viene avviato con successo, appare il seguente prompt:</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Eseguire le operazioni di base di Milvus in Google Colab con Python</h3><p>Una volta avviato con successo in Google Colab, Milvus può fornire una serie di interfacce API per Python, Java, Go, Restful e C++. Di seguito sono riportate le istruzioni per utilizzare l'interfaccia Python per eseguire le operazioni di base di Milvus in Colab.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">Installare pymilvus:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">Connettersi al server:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">Creare una collezione/partizione/indice:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">Inserire e scaricare:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">Caricare e cercare:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">Ottenere informazioni sulla raccolta/indice:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">Ottenere vettori per ID:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">Ottenere/impostare parametri:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">Cancellare indice/vettori/partizione/raccolta:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus e Google Colaboratory lavorano insieme in modo eccellente</h3><p>Google Colaboratory è un servizio cloud gratuito e intuitivo che semplifica notevolmente la compilazione di Milvus dal codice sorgente e l'esecuzione di operazioni Python di base. Entrambe le risorse sono disponibili per l'uso da parte di chiunque, rendendo la tecnologia dell'intelligenza artificiale e dell'apprendimento automatico più accessibile a tutti. Per ulteriori informazioni su Milvus, consultate le seguenti risorse:</p>
<ul>
<li>Per ulteriori esercitazioni che coprono un'ampia gamma di applicazioni, visitare <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</li>
<li>Per gli sviluppatori interessati a fornire contributi o a sfruttare il sistema, trovate <a href="https://github.com/milvus-io/milvus">Milvus su GitHub</a>.</li>
<li>Per maggiori informazioni sull'azienda che ha lanciato Milvus, visitate <a href="https://zilliz.com/">Zilliz.com</a>.</li>
</ul>
