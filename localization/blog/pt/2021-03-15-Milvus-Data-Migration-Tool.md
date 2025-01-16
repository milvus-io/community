---
id: Milvus-Data-Migration-Tool.md
title: Apresentação da ferramenta de migração de dados Milvus
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  Saiba como utilizar a ferramenta de migração de dados Milvus para melhorar
  significativamente a eficiência da gestão de dados e reduzir os custos de
  DevOps.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Apresentação da ferramenta de migração de dados Milvus</custom-h1><p><em><strong>Nota importante</strong>: A ferramenta de migração de dados do Mivus foi descontinuada. Para a migração de dados de outras bases de dados para Milvus, recomendamos que utilize a ferramenta de migração Milvus, mais avançada.</em></p>
<p>Atualmente, a ferramenta de migração Milvus é compatível:</p>
<ul>
<li>Elasticsearch para Milvus 2.x</li>
<li>Faiss para Milvus 2.x</li>
<li>Milvus 1.x para Milvus 2.x</li>
<li>Milvus 2.3.x para Milvus 2.3.x ou superior</li>
</ul>
<p>Iremos suportar a migração de mais fontes de dados vectoriais, tais como Pinecone, Chroma e Qdrant. Fique atento.</p>
<p><strong>Para mais informações, consulte a <a href="https://milvus.io/docs/migrate_overview.md">documentação do Milvus-migration</a> ou o seu <a href="https://github.com/zilliztech/milvus-migration">repositório GitHub</a>.</strong></p>
<p>--------------------------------- <strong>A ferramenta de migração de dados do Mivus foi descontinuada</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">Visão geral</h3><p><a href="https://github.com/milvus-io/milvus-tools">O MilvusDM</a> (Milvus Data Migration) é uma ferramenta de código aberto concebida especificamente para importar e exportar ficheiros de dados com o Milvus. O MilvusDM pode melhorar significativamente a eficiência da gestão de dados e reduzir os custos de DevOps das seguintes formas:</p>
<ul>
<li><p><a href="#faiss-to-milvus">Faiss para Milvus</a>: Importar dados descompactados de Faiss para Milvus.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 para Mil</a>vus: Importar ficheiros HDF5 para Milvus.</p></li>
<li><p><a href="#milvus-to-milvus">Milvus para Milvus</a>: Migrar dados de um Milvus de origem para um Milvus de destino diferente.</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus para HDF5</a>: Guardar dados no Milvus como ficheiros HDF5.</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>blogue do milvusdm 1.png</span> </span></p>
<p>O MilvusDM está hospedado no <a href="https://github.com/milvus-io/milvus-tools">Github</a> e pode ser facilmente instalado executando a linha de comando <code translate="no">pip3 install pymilvusdm</code>. O MilvusDM permite-lhe migrar dados numa coleção ou partição específica. Nas secções seguintes, explicaremos como utilizar cada tipo de migração de dados.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss para Milvus</h3><h4 id="Steps" class="common-anchor-header">Etapas</h4><p>1 - Descarregar o <strong>ficheiro F2M.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Defina os seguintes parâmetros:</p>
<ul>
<li><p><code translate="no">data_path</code>: Caminho dos dados (vectores e seus IDs correspondentes) em Faiss.</p></li>
<li><p><code translate="no">dest_host</code>: Endereço do servidor Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Porta do servidor Milvus.</p></li>
<li><p><code translate="no">mode</code>: Os dados podem ser importados para o Milvus usando os seguintes modos:</p>
<ul>
<li><p>Skip: Ignorar dados se a coleção ou partição já existir.</p></li>
<li><p>Anexar: Anexar dados se a coleção ou partição já existir.</p></li>
<li><p>Sobrescrever: Eliminar os dados antes da inserção se a coleção ou partição já existir.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nome da coleção recetora para importação de dados.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nome da partição recetora para a importação de dados.</p></li>
<li><p><code translate="no">collection_parameter</code>: Informações específicas da coleção, tais como dimensão do vetor, tamanho do ficheiro de índice e métrica de distância.</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Executar <strong>F2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Código de amostra</h4><p>1 - Ler os ficheiros Faiss para obter os vectores e os respectivos IDs.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2 - Inserir os dados recuperados no Milvus:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5 para Milvus</h3><h4 id="Steps" class="common-anchor-header">Passos</h4><p>1 - Descarregar <strong>o ficheiro H2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. definir os seguintes parâmetros:</p>
<ul>
<li><p><code translate="no">data_path</code>: Caminho para os ficheiros HDF5.</p></li>
<li><p><code translate="no">data_dir</code>: Diretório que contém os ficheiros HDF5.</p></li>
<li><p><code translate="no">dest_host</code>: Endereço do servidor Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Porta do servidor Milvus.</p></li>
<li><p><code translate="no">mode</code>: Os dados podem ser importados para o Milvus usando os seguintes modos:</p>
<ul>
<li><p>Skip: Ignorar dados se a coleção ou partição já existir.</p></li>
<li><p>Anexar: Anexar dados se a coleção ou partição já existir.</p></li>
<li><p>Sobrescrever: Eliminar os dados antes da inserção se a coleção ou partição já existir.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Nome da coleção recetora para importação de dados.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Nome da partição recetora para a importação de dados.</p></li>
<li><p><code translate="no">collection_parameter</code>: Informações específicas da coleção, tais como dimensão do vetor, tamanho do ficheiro de índice e métrica de distância.</p></li>
</ul>
<blockquote>
<p>Defina <code translate="no">data_path</code> ou <code translate="no">data_dir</code>. <strong>Não</strong> defina ambos. Utilize <code translate="no">data_path</code> para especificar vários caminhos de ficheiros, ou <code translate="no">data_dir</code> para especificar o diretório que contém o ficheiro de dados.</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Execute <strong>H2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Código de amostra</h4><p>1 - Leia os arquivos HDF5 para recuperar os vetores e seus IDs correspondentes:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2 - Insira os dados recuperados no Milvus:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus para Milvus</h3><h4 id="Steps" class="common-anchor-header">Passos</h4><p>1.Descarregar <strong>o ficheiro M2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2. definir os seguintes parâmetros:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Caminho de trabalho do Milvus de origem.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Configurações do MySQL do Milvus de origem. Se o MySQL não for utilizado, definir o parâmetro mysql_parameter como ''.</p></li>
<li><p><code translate="no">source_collection</code>: Nomes da coleção e das suas partições no Milvus de origem.</p></li>
<li><p><code translate="no">dest_host</code>: Endereço do servidor Milvus.</p></li>
<li><p><code translate="no">dest_port</code>: Porta do servidor Milvus.</p></li>
<li><p><code translate="no">mode</code>: Os dados podem ser importados para o Milvus usando os seguintes modos:</p>
<ul>
<li><p>Skip: Ignorar dados se a coleção ou partição já existir.</p></li>
<li><p>Anexar: Anexar dados se a coleção ou partição já existir.</p></li>
<li><p>Sobrescrever: Se a coleção ou partição já existir, apagar os dados antes de os inserir.Apagar os dados antes de os inserir se a coleção ou partição já existir.</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. executar <strong>M2M.yaml.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Código de exemplo</h4><p>1 - De acordo com os metadados de uma coleção ou partição especificada, leia os ficheiros em <strong>milvus/db</strong> na sua unidade local para obter vectores e os seus IDs correspondentes a partir do Milvus de origem.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2 - Insira os dados recuperados no Milvus de destino.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">Milvus para HDF5</h3><h4 id="Steps" class="common-anchor-header">Passos</h4><p>1 - Descarregar <strong>o ficheiro M2H.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Definir os seguintes parâmetros:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Caminho de trabalho do Milvus de origem.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Configurações do MySQL do Source Milvus. Se o MySQL não for utilizado, definir o parâmetro mysql_parameter como ''.</p></li>
<li><p><code translate="no">source_collection</code>: Nomes da coleção e das suas partições no Milvus de origem.</p></li>
<li><p><code translate="no">data_dir</code>: Diretório para guardar os ficheiros HDF5 guardados.</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.Executar <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Código de exemplo</h4><p>1 - De acordo com os metadados de uma coleção ou partição especificada, leia os ficheiros em <strong>milvus/db</strong> na sua unidade local para obter vectores e os seus IDs correspondentes.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2) Guardar os dados obtidos como ficheiros HDF5.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">Estrutura do ficheiro MilvusDM</h3><p>O fluxograma abaixo mostra como o MilvusDM executa diferentes tarefas de acordo com o ficheiro YAML que recebe:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>Estrutura do ficheiro MilvusDM:</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>núcleo</p>
<ul>
<li><p><strong>milvus_client.py</strong>: Executa operações de cliente no Milvus.</p></li>
<li><p><strong>read_data.py</strong>: Lê os ficheiros de dados HDF5 no seu disco local. (Adicione o seu código aqui para suportar a leitura de ficheiros de dados noutros formatos).</p></li>
<li><p><strong>read_faiss_data.py</strong>: Lê os arquivos de dados em Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: Lê os ficheiros de dados em Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: Lê os metadados em Milvus.</p></li>
<li><p><strong>data_to_milvus.py</strong>: Cria colecções ou partições com base em parâmetros em ficheiros YAML e importa os vectores e os IDs dos vectores correspondentes para o Milvus.</p></li>
<li><p><strong>save_data.py</strong>: Salva os dados como arquivos HDF5.</p></li>
<li><p><strong>write_logs.py</strong>: Escreve os registos durante o tempo de execução.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Importa dados do Faiss para o Milvus.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: Importa dados em ficheiros HDF5 para o Milvus.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: Migra dados de um Milvus de origem para o Milvus de destino.</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>: Exporta dados no Milvus e guarda-os como ficheiros HDF5.</p></li>
<li><p><strong>main.py</strong>: Executa as tarefas correspondentes de acordo com o ficheiro YAML recebido.</p></li>
<li><p><strong>setting.py</strong>: Configurações relacionadas com a execução do código MilvusDM.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: Cria pacotes de ficheiros <strong>pymilvusdm</strong> e carrega-os para o PyPI (Python Package Index).</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">Recapitulação</h3><p>O MilvusDM lida principalmente com a migração de dados dentro e fora do Milvus, o que inclui Faiss para Milvus, HDF5 para Milvus, Milvus para Milvus e Milvus para HDF5.</p>
<p>As seguintes funcionalidades estão planeadas para as próximas versões:</p>
<ul>
<li><p>Importação de dados binários do Faiss para o Milvus.</p></li>
<li><p>Lista de bloqueios e lista de permissões para migração de dados entre o Milvus de origem e o Milvus de destino.</p></li>
<li><p>Fundir e importar dados de várias colecções ou partições no Milvus de origem para uma nova coleção no Milvus de destino.</p></li>
<li><p>Backup e recuperação dos dados do Milvus.</p></li>
</ul>
<p>O projeto MilvusDM é de código aberto no <a href="https://github.com/milvus-io/milvus-tools">Github</a>. Toda e qualquer contribuição para o projeto é bem-vinda. Dê-lhe uma estrela 🌟, e sinta-se à vontade para registar um <a href="https://github.com/milvus-io/milvus-tools/issues">problema</a> ou submeter o seu próprio código!</p>
