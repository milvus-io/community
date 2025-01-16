---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: >-
  Configuración de Milvus en Google Colaboratory para facilitar la creación de
  aplicaciones ML
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  Google Colab facilita el desarrollo y la prueba de aplicaciones de aprendizaje
  automático. Aprende a configurar Milvus en Colab para una mejor gestión de
  datos vectoriales a escala masiva.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Configure Milvus en Google Colaboratory para crear fácilmente aplicaciones ML</custom-h1><p>El progreso tecnológico hace que la inteligencia artificial (IA) y el análisis a escala de máquina sean cada vez más accesibles y fáciles de usar. La <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">proliferación</a> del software de código abierto, los conjuntos de datos públicos y otras herramientas gratuitas son las principales fuerzas que impulsan esta tendencia. Combinando dos recursos gratuitos, <a href="https://milvus.io/">Milvus</a> y <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">Google Colaboratory</a> ("Colab" para abreviar), cualquiera puede crear soluciones de IA y análisis de datos potentes y flexibles. Este artículo proporciona instrucciones para configurar Milvus en Colab, así como para realizar operaciones básicas utilizando el kit de desarrollo de software (SDK) de Python.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#what-is-milvus">¿Qué es Milvus?</a></li>
<li><a href="#what-is-google-colaboratory">¿Qué es Google Colaboratory?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Primeros pasos con Milvus en Google Colaboratory</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Ejecutar operaciones básicas de Milvus en Google Colab con Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">Milvus y Google Colaboratory funcionan perfectamente juntos</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">¿Qué es Milvus?</h3><p><a href="https://milvus.io/">Milvus</a> es un motor de búsqueda de similitud vectorial de código abierto que puede integrarse con bibliotecas de índices ampliamente adoptadas, incluyendo Faiss, NMSLIB y Annoy. La plataforma también incluye un amplio conjunto de API intuitivas. Al emparejar Milvus con modelos de inteligencia artificial (IA), se puede construir una amplia variedad de aplicaciones que incluyen:</p>
<ul>
<li>Motores de búsqueda de imágenes, vídeo, audio y texto semántico.</li>
<li>Sistemas de recomendación y chatbots.</li>
<li>Desarrollo de nuevos fármacos, cribado genético y otras aplicaciones biomédicas.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">¿Qué es Google Colaboratory?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colaboratory</a> es un producto del equipo de Google Research que permite a cualquier persona escribir y ejecutar código python desde un navegador web. Colab se creó pensando en aplicaciones de aprendizaje automático y análisis de datos, ofrece un entorno gratuito de cuadernos Jupyter, se sincroniza con Google Drive y permite a los usuarios acceder a potentes recursos de computación en la nube (incluidas las GPU). La plataforma es compatible con muchas bibliotecas populares de aprendizaje automático y puede integrarse con PyTorch, TensorFlow, Keras y OpenCV.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Primeros pasos con Milvus en Google Colaboratory</h3><p>Aunque Milvus recomienda <a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">el uso de Docker</a> para instalar e iniciar el servicio, el entorno actual de la nube de Google Colab no admite la instalación de Docker. Además, este tutorial pretende ser lo más accesible posible - y no todo el mundo utiliza Docker. Instale e inicie el sistema <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">compilando</a> el <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">código fuente de</a> Milvus para evitar el uso de Docker.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Descargar el código fuente de Milvus y crear un nuevo cuaderno en Colab</h3><p>Google Colab viene con todo el software de soporte para Milvus preinstalado, incluidas las herramientas de compilación necesarias GCC, CMake y Git y los controladores CUDA y NVIDIA, lo que simplifica el proceso de instalación y configuración de Milvus. Para empezar, descarga el código fuente de Milvus y crea un nuevo bloc de notas en Google Colab:</p>
<ol>
<li>Descarga el código fuente de Milvus: Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Sube el código fuente de Milvus a <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> y crea un nuevo bloc de notas.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Compilar Milvus a partir del código fuente</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Descargar el código fuente de Milvus</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">Instalar dependencias</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Compilar el código fuente de Milvus</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Nota: Si la versión GPU está correctamente compilada, aparecerá un aviso "GPU resources ENABLED!".</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Inicie el servidor Milvus</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">Añada el directorio lib/ a LD_LIBRARY_PATH:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Inicie y ejecute el servidor Milvus en segundo plano:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Mostrar el estado del servidor Milvus:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Nota: Si el servidor Milvus se inicia correctamente, aparece el siguiente aviso:</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Ejecutar operaciones básicas de Milvus en Google Colab con Python</h3><p>Después de iniciar con éxito en Google Colab, Milvus puede proporcionar una variedad de interfaces API para Python, Java, Go, Restful y C++. A continuación encontrará instrucciones para utilizar la interfaz Python para realizar operaciones básicas de Milvus en Colab.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">Instale pymilvus:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">Conéctese al servidor:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">Crear una colección/partición/índice:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">Insertar y vaciar:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">Cargar y buscar:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">Obtener información de colección/índice:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">Obtener vectores por ID:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">Obtener/establecer parámetros:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">Borrar índice/vectores/partición/colección:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">Milvus y Google Colaboratory se complementan a la perfección</h3><p>Google Colaboratory es un servicio en la nube gratuito e intuitivo que simplifica enormemente la compilación de Milvus a partir del código fuente y la ejecución de operaciones básicas en Python. Ambos recursos están disponibles para que cualquiera pueda utilizarlos, haciendo que la IA y la tecnología de aprendizaje automático sean más accesibles para todos. Para más información sobre Milvus, consulte los siguientes recursos:</p>
<ul>
<li>Para obtener tutoriales adicionales que cubren una amplia variedad de aplicaciones, visite <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</li>
<li>Los desarrolladores interesados en realizar contribuciones o aprovechar el sistema pueden encontrar <a href="https://github.com/milvus-io/milvus">Milvus en GitHub</a>.</li>
<li>Para más información sobre la empresa que lanzó Milvus, visite <a href="https://zilliz.com/">Zilliz.com</a>.</li>
</ul>
