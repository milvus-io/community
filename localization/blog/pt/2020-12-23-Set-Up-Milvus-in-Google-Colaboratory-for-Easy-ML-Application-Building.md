---
id: Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md
title: >-
  Configurar o Milvus no Google Colaboratory para facilitar a criação de
  aplicações de ML
author: milvus
date: 2020-12-23T10:30:58.020Z
desc: >-
  O Google Colab facilita o desenvolvimento e o teste de aplicações de
  aprendizagem automática. Saiba como configurar o Milvus no Colab para uma
  melhor gestão de dados vectoriais em grande escala.
cover: assets.zilliz.com/3_cbea41e9a6.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building
---
<custom-h1>Configurar o Milvus no Google Colaboratory para facilitar a criação de aplicações de ML</custom-h1><p>O progresso tecnológico está constantemente a tornar a inteligência artificial (IA) e a análise à escala da máquina mais acessíveis e fáceis de utilizar. A <a href="https://techcrunch.com/2019/01/12/how-open-source-software-took-over-the-world/?guccounter=1&amp;guce_referrer=aHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS8&amp;guce_referrer_sig=AQAAAL_qokucWT-HjbiOznq2RlO5TG78V6UYf332FKnWl3_knuMo6t5HZvZkIHFL3fhYX0nLzM6V1lVVAK4G3BXZHENX3zCXXgggGt39L9HKde3BufW1-iM2oKm0NIav2fcqgxvfpvx_7EPGstI7c_n99stI9oJf9sdsRPTQ6Wnu7DYX">proliferação</a> de software de código aberto, conjuntos de dados públicos e outras ferramentas gratuitas são as principais forças que impulsionam esta tendência. Ao associar dois recursos gratuitos, <a href="https://milvus.io/">o Milvus</a> e <a href="https://colab.research.google.com/notebooks/intro.ipynb#scrollTo=5fCEDCU_qrC0">o Google Colaboratory</a> ("Colab"), qualquer pessoa pode criar soluções de IA e de análise de dados poderosas e flexíveis. Este artigo fornece instruções para configurar o Milvus no Colab, bem como para efetuar operações básicas utilizando o kit de desenvolvimento de software (SDK) Python.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#what-is-milvus">O que é o Milvus?</a></li>
<li><a href="#what-is-google-colaboratory">O que é o Google Colaboratory?</a></li>
<li><a href="#getting-started-with-milvus-in-google-colaboratory">Começar a utilizar o Milvus no Google Colaboratory</a></li>
<li><a href="#run-basic-milvus-operations-in-google-colab-with-python">Executar operações básicas do Milvus no Google Colab com Python</a></li>
<li><a href="#milvus-and-google-colaboratory-work-beautifully-together">O Milvus e o Google Colaboratory funcionam muito bem em conjunto</a></li>
</ul>
<h3 id="What-is-Milvus" class="common-anchor-header">O que é o Milvus?</h3><p><a href="https://milvus.io/">O Milvus</a> é um motor de pesquisa de semelhanças vectoriais de código aberto que pode ser integrado em bibliotecas de índices amplamente adoptadas, incluindo Faiss, NMSLIB e Annoy. A plataforma também inclui um conjunto abrangente de APIs intuitivas. Ao associar o Milvus a modelos de inteligência artificial (IA), pode ser criada uma grande variedade de aplicações, incluindo:</p>
<ul>
<li>Motores de pesquisa de imagem, vídeo, áudio e texto semântico.</li>
<li>Sistemas de recomendação e chatbots.</li>
<li>Desenvolvimento de novos medicamentos, rastreio genético e outras aplicações biomédicas.</li>
</ul>
<h3 id="What-is-Google-Colaboratory" class="common-anchor-header">O que é o Google Colaboratory?</h3><p><a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">O Google Colaboratory</a> é um produto da equipa de Investigação da Google que permite a qualquer pessoa escrever e executar código python a partir de um navegador da Web. O Colab foi criado a pensar em aplicações de aprendizagem automática e análise de dados, oferece um ambiente de bloco de notas Jupyter gratuito, sincroniza com o Google Drive e dá aos utilizadores acesso a poderosos recursos de computação na nuvem (incluindo GPUs). A plataforma suporta muitas bibliotecas populares de aprendizagem automática e pode ser integrada com PyTorch, TensorFlow, Keras e OpenCV.</p>
<h3 id="Getting-started-with-Milvus-in-Google-Colaboratory" class="common-anchor-header">Introdução ao Milvus no Google Colaboratory</h3><p>Embora o Milvus recomende <a href="https://milvus.io/docs/v0.10.4/milvus_docker-cpu.md">a utilização do Docker</a> para instalar e iniciar o serviço, o atual ambiente de nuvem do Google Colab não suporta a instalação do Docker. Além disso, este tutorial pretende ser o mais acessível possível e nem toda a gente utiliza o Docker. Instale e inicie o sistema compilando <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">o código-fonte do Milvus</a> para evitar a utilização do Docker.</p>
<h3 id="Download-Milvus’-source-code-and-create-a-new-notebook-in-Colab" class="common-anchor-header">Descarregar o código-fonte do Milvus e criar um novo bloco de notas no Colab</h3><p>O Google Colab vem com todo o software de suporte para o Milvus pré-instalado, incluindo as ferramentas de compilação necessárias GCC, CMake e Git e os controladores CUDA e NVIDIA, simplificando o processo de instalação e configuração do Milvus. Para começar, transfira o código-fonte do Milvus e crie um novo bloco de notas no Google Colab:</p>
<ol>
<li>Descarregar o código-fonte do Milvus: Milvus_tutorial.ipynb.</li>
</ol>
<p><code translate="no">Wget https://raw.githubusercontent.com/milvus-io/bootcamp/0.10.0/getting_started/basics/milvus_tutorial/Milvus_tutorial.ipynb</code></p>
<ol start="2">
<li>Carregue o código-fonte do Milvus para o <a href="https://colab.research.google.com/notebooks/intro.ipynb#recent=true">Google Colab</a> e crie um novo bloco de notas.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_2_27809b0ce2.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_2.png</span> </span></p>
<h3 id="Compile-Milvus-from-source-code" class="common-anchor-header">Compilar o Milvus a partir do código-fonte</h3><h4 id="Download-Milvus-source-code" class="common-anchor-header">Descarregar o código-fonte do Milvus</h4><p><code translate="no">git clone -b 0.10.3 https://github.com/milvus-io/milvus.git</code></p>
<h4 id="Install-dependencies" class="common-anchor-header">Instalar dependências</h4><p><code translate="no">% cd /content/milvus/core ./ubuntu_build_deps.sh./ubuntu_build_deps.sh</code></p>
<h4 id="Build-Milvus-source-code" class="common-anchor-header">Compilar o código-fonte do Milvus</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core
!<span class="hljs-built_in">ls</span>
!./build.sh -t Release
<span class="hljs-comment"># To build GPU version, add -g option, and switch the notebook settings with GPU</span>
<span class="hljs-comment">#((Edit -&gt; Notebook settings -&gt; select GPU))</span>
<span class="hljs-comment"># !./build.sh -t Release -g</span>
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Nota: Se a versão GPU estiver corretamente compilada, aparece um aviso "GPU resources ENABLED!</p>
</blockquote>
<h3 id="Launch-Milvus-server" class="common-anchor-header">Iniciar o servidor Milvus</h3><h4 id="Add-lib-directory-to-LDLIBRARYPATH" class="common-anchor-header">Adicionar o diretório lib/ ao LD_LIBRARY_PATH:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> /content/milvus/core/milvus
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
import os
os.environ[<span class="hljs-string">&#x27;LD_LIBRARY_PATH&#x27;</span>] +=<span class="hljs-string">&quot;:/content/milvus/core/milvus/lib&quot;</span>
! <span class="hljs-built_in">echo</span> <span class="hljs-variable">$LD_LIBRARY_PATH</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Start-and-run-Milvus-server-in-the-background" class="common-anchor-header">Iniciar e executar o servidor Milvus em segundo plano:</h4><pre><code translate="no">% <span class="hljs-built_in">cd</span> scripts
! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">nohup</span> ./start_server.sh &amp;
<button class="copy-code-btn"></button></code></pre>
<h4 id="Show-Milvus-server-status" class="common-anchor-header">Mostrar o estado do servidor Milvus:</h4><pre><code translate="no">! <span class="hljs-built_in">ls</span>
! <span class="hljs-built_in">cat</span> nohup.out
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Nota: Se o servidor Milvus for iniciado com sucesso, aparece o seguinte aviso:</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Set_Up_Milvus_in_Google_Colaboratory_for_Easy_ML_Application_Building_3_b15138cd59.png" alt="Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png" class="doc-image" id="blog_set-up-milvus-in-google-colaboratory-for-easy-ml-application-building_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Set Up Milvus in Google Colaboratory for Easy ML Application Building_3.png</span> </span></p>
<h3 id="Run-basic-Milvus-operations-in-Google-Colab-with-Python" class="common-anchor-header">Executar operações básicas do Milvus no Google Colab com Python</h3><p>Após o lançamento bem-sucedido no Google Colab, o Milvus pode fornecer uma variedade de interfaces de API para Python, Java, Go, Restful e C++. Seguem-se instruções para utilizar a interface Python para efetuar operações básicas do Milvus no Colab.</p>
<h4 id="Install-pymilvus" class="common-anchor-header">Instale o pymilvus:</h4><p><code translate="no">! pip install pymilvus==0.2.14</code></p>
<h4 id="Connect-to-the-server" class="common-anchor-header">Ligue-se ao servidor:</h4><pre><code translate="no"><span class="hljs-comment"># Connect to Milvus Server</span>
milvus = Milvus(_HOST, _PORT)


<span class="hljs-comment"># Return the status of the Milvus server.</span>
server_status = milvus.server_status(timeout=<span class="hljs-number">10</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-collectionpartitionindex" class="common-anchor-header">Criar uma coleção/partição/índice:</h4><pre><code translate="no"><span class="hljs-comment"># Information needed to create a collection</span>
param={<span class="hljs-string">&#x27;collection_name&#x27;</span>:collection_name, <span class="hljs-string">&#x27;dimension&#x27;</span>: _DIM, <span class="hljs-string">&#x27;index_file_size&#x27;</span>: _INDEX_FILE_SIZE, <span class="hljs-string">&#x27;metric_type&#x27;</span>: MetricType.L2}

<span class="hljs-comment"># Create a collection.</span>
milvus.create_collection(param, timeout=<span class="hljs-number">10</span>)

<span class="hljs-comment"># Create a partition for a collection.</span>
milvus.create_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=<span class="hljs-number">10</span>)
ivf_param = {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">16384</span>}

<span class="hljs-comment"># Create index for a collection.</span>
milvus.create_index(collection_name=collection_name, index_type=IndexType.IVF_FLAT, params=ivf_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-and-flush" class="common-anchor-header">Inserir e descarregar:</h4><pre><code translate="no"><span class="hljs-comment"># Insert vectors to a collection.</span>
milvus.insert(collection_name=collection_name, records=vectors, ids=ids)

<span class="hljs-comment"># Flush vector data in one collection or multiple collections to disk.</span>
milvus.flush(collection_name_array=[collection_name], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Load-and-search" class="common-anchor-header">Carregar e pesquisar:</h4><pre><code translate="no"><span class="hljs-comment"># Load a collection for caching.</span>
milvus.load_collection(collection_name=collection_name, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Search vectors in a collection.</span>
search_param = { <span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">16</span> }
milvus.search(collection_name=collection_name,query_records=[vectors[<span class="hljs-number">0</span>]],partition_tags=<span class="hljs-literal">None</span>,top_k=<span class="hljs-number">10</span>,params=search_param)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-collectionindex-information" class="common-anchor-header">Obter informações sobre a coleção/índice:</h4><pre><code translate="no"><span class="hljs-comment"># Return information of a collection.    milvus.get_collection_info(collection_name=collection_name, timeout=10)</span>

<span class="hljs-comment"># Show index information of a collection.    milvus.get_index_info(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Get-vectors-by-ID" class="common-anchor-header">Obter vectores por ID:</h4><pre><code translate="no"><span class="hljs-comment"># List the ids in segment</span>
<span class="hljs-comment"># you can get the segment_name list by get_collection_stats() function.</span>
milvus.list_id_in_segment(collection_name =collection_name, segment_name=<span class="hljs-string">&#x27;1600328539015368000&#x27;</span>, timeout=<span class="hljs-literal">None</span>)

<span class="hljs-comment"># Return raw vectors according to ids, and you can get the ids list by list_id_in_segment() function.</span>
milvus.get_entity_by_id(collection_name=collection_name, ids=[<span class="hljs-number">0</span>], timeout=<span class="hljs-literal">None</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Getset-parameters" class="common-anchor-header">Obter/definir parâmetros:</h4><pre><code translate="no"># Get Milvus configurations.    milvus.get_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>)

# Set Milvus configurations.    milvus.set_config(parent_key=<span class="hljs-string">&#x27;cache&#x27;</span>, child_key=<span class="hljs-string">&#x27;cache_size&#x27;</span>, value=<span class="hljs-string">&#x27;5G&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Delete-indexvectorspartitioncollection" class="common-anchor-header">Eliminar índice/vectores/partição/coleção:</h4><pre><code translate="no"><span class="hljs-comment"># Remove an index.    milvus.drop_index(collection_name=collection_name, timeout=None)</span>

<span class="hljs-comment"># Delete vectors in a collection by vector ID.</span>
<span class="hljs-comment"># id_array (list[int]) -- list of vector id    milvus.delete_entity_by_id(collection_name=collection_name, id_array=[0], timeout=None)</span>

<span class="hljs-comment"># Delete a partition in a collection.    milvus.drop_partition(collection_name=collection_name, partition_tag=partition_tag, timeout=None)</span>

<span class="hljs-comment"># Delete a collection by name.    milvus.drop_collection(collection_name=collection_name, timeout=10)</span>
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-and-Google-Colaboratory-work-beautifully-together" class="common-anchor-header">O Milvus e o Google Colaboratory funcionam muito bem em conjunto</h3><p>O Google Colaboratory é um serviço de nuvem gratuito e intuitivo que simplifica muito a compilação do Milvus a partir do código-fonte e a execução de operações básicas em Python. Ambos os recursos estão disponíveis para utilização por qualquer pessoa, tornando a tecnologia de IA e de aprendizagem automática mais acessível a todos. Para obter mais informações sobre o Milvus, consulte os seguintes recursos:</p>
<ul>
<li>Para tutoriais adicionais que abrangem uma grande variedade de aplicações, visite o <a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>.</li>
<li>Para os programadores interessados em fazer contribuições ou tirar partido do sistema, encontrar <a href="https://github.com/milvus-io/milvus">Milvus no GitHub</a>.</li>
<li>Para obter mais informações sobre a empresa que lançou o Milvus, visite <a href="https://zilliz.com/">Zilliz.com</a>.</li>
</ul>
