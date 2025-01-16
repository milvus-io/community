---
id: deep-dive-3-data-processing.md
title: Como são processados os dados numa base de dados vetorial?
author: Zhenshan Cao
date: 2022-03-28T00:00:00.000Z
desc: >-
  A Milvus fornece uma infraestrutura de gestão de dados essencial para as
  aplicações de IA de produção. Este artigo revela os meandros do processamento
  de dados no seu interior.
cover: assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-3-data-processing.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Is_Data_Processed_in_a_Vector_Database_9fb236bc01.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/czs007">Zhenshan Cao</a> e transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Nos dois posts anteriores desta série de blogues, já abordámos a <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">arquitetura do sistema</a> Milvus, a base de dados vetorial mais avançada do mundo, e o seu <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">Python SDK e API</a>.</p>
<p>Este post tem como principal objetivo ajudá-lo a compreender como os dados são processados no Milvus, aprofundando o sistema Milvus e examinando a interação entre os componentes de processamento de dados.</p>
<p><em>Alguns recursos úteis antes de começar estão listados abaixo. Recomendamos que os leia primeiro para compreender melhor o tópico deste post.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Aprofundar a arquitetura do Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Modelo de dados do Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">O papel e a função de cada componente do Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/data_processing.md">Processamento de dados em Milvus</a></li>
</ul>
<h2 id="MsgStream-interface" class="common-anchor-header">Interface MsgStream<button data-href="#MsgStream-interface" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><a href="https://github.com/milvus-io/milvus/blob/ca129d4308cc7221bb900b3722dea9b256e514f9/docs/developer_guides/chap04_message_stream.md">A interface MsgStream</a> é crucial para o processamento de dados em Milvus. Quando <code translate="no">Start()</code> é chamado, a corrotina em segundo plano escreve dados no <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Log-as-data">broker de registo</a> ou lê dados a partir daí. Quando <code translate="no">Close()</code> é chamado, a corrotina pára.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Msg_Stream_interface_66b70309a7.png" alt="MsgStream interface" class="doc-image" id="msgstream-interface" />
   </span> <span class="img-wrapper"> <span>Interface MsgStream</span> </span></p>
<p>O MsgStream pode servir como produtor e consumidor. A interface <code translate="no">AsProducer(channels []string)</code> define o MsgStream como um produtor, enquanto a <code translate="no">AsConsumer(channels []string, subNamestring)</code>o define como um consumidor. O parâmetro <code translate="no">channels</code> é partilhado em ambas as interfaces e é utilizado para definir os canais (físicos) em que os dados devem ser escritos ou lidos.</p>
<blockquote>
<p>O número de fragmentos de uma coleção pode ser especificado quando a coleção é criada. Cada fragmento corresponde a um <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">canal virtual (vchannel)</a>. Portanto, uma coleção pode ter vários vchannels. O Milvus atribui a cada vchannel do broker de log um <a href="https://milvus.io/docs/v2.0.x/glossary.md#PChannel">canal físico (pchannel)</a>.</p>
</blockquote>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Each_virtual_channel_shard_corresponds_to_a_physical_channel_7cd60e4ed1.png" alt="Each virtual channel/shard corresponds to a physical channel." class="doc-image" id="each-virtual-channel/shard-corresponds-to-a-physical-channel." />
   </span> <span class="img-wrapper"> <span>Cada canal virtual/shard corresponde a um canal físico</span>. </span></p>
<p><code translate="no">Produce()</code> A interface MsgStream é responsável pela escrita de dados nos pchannels do log broker. Os dados podem ser escritos de duas formas:</p>
<ul>
<li>Escrita única: as entidades são escritas em diferentes shards (vchannel) pelos valores de hash das chaves primárias. Em seguida, essas entidades fluem para os pchannels correspondentes no broker de registo.</li>
<li>Escrita de difusão: as entidades são escritas em todos os pchannels especificados pelo parâmetro <code translate="no">channels</code>.</li>
</ul>
<p><code translate="no">Consume()</code> é um tipo de API de bloqueio. Se não houver dados disponíveis no canal p especificado, a corrotina será bloqueada quando <code translate="no">Consume()</code> for chamado na interface MsgStream. Por outro lado, <code translate="no">Chan()</code> é uma API não bloqueante, o que significa que a corrotina lê e processa dados apenas se existirem dados no canal p especificado. Caso contrário, a corrotina pode processar outras tarefas e não será bloqueada quando não houver dados disponíveis.</p>
<p><code translate="no">Seek()</code> é um método de recuperação de falhas. Quando um novo nó é iniciado, o registo de consumo de dados pode ser obtido e o consumo de dados pode ser retomado a partir do ponto em que foi interrompido, chamando <code translate="no">Seek()</code>.</p>
<h2 id="Write-data" class="common-anchor-header">Escrita de dados<button data-href="#Write-data" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Os dados escritos em diferentes vchannels (fragmentos) podem ser mensagens de inserção ou de eliminação. Estes vchannels podem também ser designados por DmChannels (canais de manipulação de dados).</p>
<p>Colecções diferentes podem partilhar os mesmos pchannels no corretor de registo. Uma coleção pode ter vários shards e, por conseguinte, vários vchannels correspondentes. Consequentemente, as entidades da mesma coleção fluem para vários canais p correspondentes no corretor de registos. Como resultado, a vantagem da partilha de pchannels é um aumento do volume de produção possibilitado pela elevada concorrência do corretor de registos.</p>
<p>Quando uma coleção é criada, não só é especificado o número de fragmentos, como também é decidido o mapeamento entre vchannels e pchannels no broker de registo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Write_path_in_Milvus_00d93fb377.png" alt="Write path in Milvus" class="doc-image" id="write-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Caminho de escrita no Milvus</span> </span></p>
<p>Como se pode ver na ilustração acima, no percurso de escrita, os proxies escrevem dados no corretor de registos através da interface <code translate="no">AsProducer()</code> do MsgStream. Em seguida, os nós de dados consomem os dados e depois convertem e armazenam os dados consumidos no armazenamento de objectos. O caminho de armazenamento é um tipo de meta-informação que será registada no etcd pelos coordenadores de dados.</p>
<h3 id="Flowgraph" class="common-anchor-header">Diagrama de fluxo</h3><p>Uma vez que diferentes colecções podem partilhar os mesmos pchannels no corretor de registos, ao consumir dados, os nós de dados ou os nós de consulta têm de avaliar a que coleção pertencem os dados num pchannel. Para resolver este problema, introduzimos o flowgraph no Milvus. É principalmente responsável pela filtragem de dados num pchannel partilhado por IDs de coleção. Assim, podemos dizer que cada flowgraph lida com o fluxo de dados num shard (vchannel) correspondente numa coleção.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_write_path_1b201e1b71.png" alt="Flowgraph in write path" class="doc-image" id="flowgraph-in-write-path" />
   </span> <span class="img-wrapper"> <span>Fluxógrafo no caminho de escrita</span> </span></p>
<h3 id="MsgStream-creation" class="common-anchor-header">Criação de MsgStream</h3><p>Ao escrever dados, o objeto MsgStream é criado nos dois cenários seguintes:</p>
<ul>
<li>Quando o proxy recebe um pedido de inserção de dados, tenta primeiro obter o mapeamento entre vchannels e pchannels através do coordenador raiz (root coord). Em seguida, o proxy cria um objeto MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_1_bdd0f94d8b.png" alt="Scenario 1" class="doc-image" id="scenario-1" />
   </span> <span class="img-wrapper"> <span>Cenário 1</span> </span></p>
<ul>
<li>Quando o nó de dados é iniciado e lê as meta-informações dos canais no etcd, é criado o objeto MsgStream.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_write_path_Scenario_2_5b3f99a6d1.png" alt="Scenario 2" class="doc-image" id="scenario-2" />
   </span> <span class="img-wrapper"> <span>Cenário 2</span> </span></p>
<h2 id="Read-data" class="common-anchor-header">Ler dados<button data-href="#Read-data" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Read_path_in_Milvus_c2f0ae5109.png" alt="Read path in Milvus" class="doc-image" id="read-path-in-milvus" />
   </span> <span class="img-wrapper"> <span>Caminho de leitura em Milvus</span> </span></p>
<p>O fluxo de trabalho geral da leitura de dados é ilustrado na imagem acima. Os pedidos de consulta são transmitidos através do canal DqRequestChannel para os nós de consulta. Os nós de consulta executam as tarefas de consulta em paralelo. Os resultados da consulta dos nós de consulta passam pelo gRPC e o proxy agrega os resultados e devolve-os ao cliente.</p>
<p>Para analisar mais detalhadamente o processo de leitura de dados, podemos ver que o proxy escreve os pedidos de consulta no DqRequestChannel. Os nós de consulta consomem então a mensagem subscrevendo o DqRequestChannel. Cada mensagem no DqRequestChannel é difundida para que todos os nós de consulta subscritos possam receber a mensagem.</p>
<p>Quando os nós de consulta recebem pedidos de consulta, efectuam uma consulta local tanto dos dados em lote armazenados em segmentos selados como dos dados em fluxo contínuo que são inseridos dinamicamente no Milvus e armazenados em segmentos crescentes. Posteriormente, os nós de consulta precisam de agregar os resultados da consulta em <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">segmentos selados e</a> em <a href="https://milvus.io/docs/v2.0.x/glossary.md#Segment">crescimento</a>. Estes resultados agregados são transmitidos ao proxy através do gRPC.</p>
<p>O proxy recolhe todos os resultados de vários nós de consulta e, em seguida, agrega-os para obter os resultados finais. Em seguida, o proxy devolve os resultados finais da consulta ao cliente. Uma vez que cada pedido de consulta e os resultados de consulta correspondentes são identificados pelo mesmo requestID único, o proxy pode descobrir que resultados de consulta correspondem a que pedido de consulta.</p>
<h3 id="Flowgraph" class="common-anchor-header">Grafo de fluxo</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flowgraph_in_read_path_8a5faf2d58.png" alt="Flowgraph in read path" class="doc-image" id="flowgraph-in-read-path" />
   </span> <span class="img-wrapper"> <span>Diagrama de fluxo no caminho de leitura</span> </span></p>
<p>À semelhança do caminho de escrita, os fluxogramas também são introduzidos no caminho de leitura. O Milvus implementa a arquitetura Lambda unificada, que integra o processamento dos dados incrementais e históricos. Por conseguinte, os nós de consulta também precisam de obter dados de fluxo contínuo em tempo real. Do mesmo modo, os fluxogramas no percurso de leitura filtram e diferenciam os dados de diferentes colecções.</p>
<h3 id="MsgStream-creation" class="common-anchor-header">Criação de MsgStream</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Creating_Msg_Stream_object_in_read_path_7f059bde2f.png" alt="Creating MsgStream object in read path" class="doc-image" id="creating-msgstream-object-in-read-path" />
   </span> <span class="img-wrapper"> <span>Criação do objeto MsgStream no percurso de leitura</span> </span></p>
<p>Ao ler os dados, o objeto MsgStream é criado no cenário seguinte:</p>
<ul>
<li>No Milvus, os dados só podem ser lidos se forem carregados. Quando o proxy recebe um pedido de carregamento de dados, envia-o para o coordenador de consultas, que decide a forma de atribuir fragmentos a diferentes nós de consulta. A informação de atribuição (ou seja, os nomes dos vchannels e o mapeamento entre os vchannels e os pchannels correspondentes) é enviada aos nós de consulta através de uma chamada de método ou RPC (chamada de procedimento remoto). Subsequentemente, os nós de consulta criam os objectos MsgStream correspondentes para consumir os dados.</li>
</ul>
<h2 id="DDL-operations" class="common-anchor-header">Operações DDL<button data-href="#DDL-operations" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>DDL significa linguagem de definição de dados. As operações DDL em metadados podem ser categorizadas em pedidos de escrita e pedidos de leitura. No entanto, estes dois tipos de pedidos são tratados da mesma forma durante o processamento de metadados.</p>
<p>Os pedidos de leitura de metadados incluem:</p>
<ul>
<li>Esquema de coleção de consultas</li>
<li>Informações de indexação de consultas e muito mais</li>
</ul>
<p>Os pedidos de escrita incluem:</p>
<ul>
<li>Criar uma coleção</li>
<li>Eliminar uma coleção</li>
<li>Criar um índice</li>
<li>Eliminar um índice E mais</li>
</ul>
<p>Os pedidos DDL são enviados para o proxy a partir do cliente, e o proxy transmite esses pedidos pela ordem recebida ao coordenador raiz, que atribui um carimbo de data/hora a cada pedido DDL e efectua verificações dinâmicas dos pedidos. O proxy trata cada pedido de forma serial, ou seja, um pedido DDL de cada vez. O proxy não processará o pedido seguinte até concluir o processamento do pedido anterior e receber os resultados da coordenada de raiz.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/DDL_operations_02679a393c.png" alt="DDL operations." class="doc-image" id="ddl-operations." />
   </span> <span class="img-wrapper"> <span>Operações DDL</span>. </span></p>
<p>Conforme mostrado na ilustração acima, há <code translate="no">K</code> solicitações DDL na fila de tarefas da coordenada raiz. As solicitações DDL na fila de tarefas são organizadas na ordem em que são recebidas pelo coordenador raiz. Assim, <code translate="no">ddl1</code> é o primeiro enviado à coord raiz e <code translate="no">ddlK</code> é o último deste lote. O coordenador raiz processa os pedidos um a um na ordem temporal.</p>
<p>Num sistema distribuído, a comunicação entre os proxies e a coordenada de raiz é activada por gRPC. O coordenador raiz mantém um registo do valor máximo do carimbo de data/hora das tarefas executadas para garantir que todos os pedidos DDL são processados por ordem temporal.</p>
<p>Suponha que existam dois proxies independentes, proxy 1 e proxy 2. Ambos enviam pedidos DDL para a mesma coordenada raiz. No entanto, um problema é que os pedidos anteriores não são necessariamente enviados para a coordenada de raiz antes dos pedidos recebidos por outro proxy mais tarde. Por exemplo, na imagem acima, quando <code translate="no">DDL_K-1</code> é enviado para a coordenada de raiz a partir do proxy 1, <code translate="no">DDL_K</code> do proxy 2 já foi aceite e executado pela coordenada de raiz. Conforme registado pelo coordenador raiz, o valor máximo do carimbo de data/hora das tarefas executadas neste momento é <code translate="no">K</code>. Assim, para não interromper a ordem temporal, o pedido <code translate="no">DDL_K-1</code> será rejeitado pela fila de tarefas do coordenador de raiz. No entanto, se o proxy 2 enviar o pedido <code translate="no">DDL_K+5</code> para a coordenada raiz neste momento, o pedido será aceite na fila de tarefas e será executado mais tarde de acordo com o seu valor de carimbo de data/hora.</p>
<h2 id="Indexing" class="common-anchor-header">Indexação<button data-href="#Indexing" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><h3 id="Building-an-index" class="common-anchor-header">Construção de um índice</h3><p>Ao receber pedidos de construção de índices do cliente, o proxy começa por efetuar verificações estáticas nos pedidos e envia-os para a coordenada de raiz. Em seguida, a coord raiz persiste esses pedidos de construção de índice no meta-armazenamento (etcd) e envia os pedidos para o coordenador do índice (coord índice).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Building_an_index_e130a4e715.png" alt="Building an index." class="doc-image" id="building-an-index." />
   </span> <span class="img-wrapper"> <span>Construção de um índice</span>. </span></p>
<p>Como ilustrado acima, quando o coordenador de índice recebe pedidos de construção de índice do coordenador de raiz, primeiro persiste a tarefa no etcd para meta store. O estado inicial da tarefa de construção de índice é <code translate="no">Unissued</code>. O coordenador de índices mantém um registo da carga de tarefas de cada nó de índice e envia as tarefas de entrada para um nó de índice menos carregado. Após a conclusão da tarefa, o nó de índice escreve o estado da tarefa, <code translate="no">Finished</code> ou <code translate="no">Failed</code> no meta armazenamento, que é o etcd em Milvus. Em seguida, o coordenador do índice compreenderá se a tarefa de construção do índice foi bem sucedida ou falhou, consultando o etcd. Se a tarefa falhar devido a recursos limitados do sistema ou à desistência do nó de índice, o coordenador do índice irá reativar todo o processo e atribuir a mesma tarefa a outro nó de índice.</p>
<h3 id="Dropping-an-index" class="common-anchor-header">Eliminação de um índice</h3><p>Para além disso, o coordenador de índices também é responsável pelos pedidos de eliminação de índices.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dropping_an_index_afdab6a339.png" alt="Dropping an index." class="doc-image" id="dropping-an-index." />
   </span> <span class="img-wrapper"> <span>Eliminar um índice</span>. </span></p>
<p>Quando o coordenador da raiz recebe um pedido de eliminação de um índice do cliente, primeiro marca o índice como &quot;eliminado&quot; e devolve o resultado ao cliente enquanto notifica o coordenador do índice. Em seguida, o coordenador do índice filtra todas as tarefas de indexação com o endereço <code translate="no">IndexID</code> e as tarefas que correspondem à condição são eliminadas.</p>
<p>A corrotina em segundo plano do coordenador de índices eliminará gradualmente todas as tarefas de indexação marcadas como "eliminadas" do armazenamento de objectos (MinIO e S3). Este processo envolve a interface recycleIndexFiles. Quando todos os arquivos de índice correspondentes são excluídos, as meta informações das tarefas de indexação excluídas são removidas do meta armazenamento (etcd).</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Sobre a série Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Com o <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anúncio oficial da disponibilidade geral</a> do Milvus 2.0, orquestrámos esta série de blogues Milvus Deep Dive para fornecer uma interpretação aprofundada da arquitetura e do código-fonte do Milvus. Os tópicos abordados nesta série de blogues incluem:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visão geral da arquitetura do Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs e SDKs Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Processamento de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestão de dados</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consulta em tempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de execução escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de execução vetorial</a></li>
</ul>
