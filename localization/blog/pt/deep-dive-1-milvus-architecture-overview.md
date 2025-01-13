---
id: deep-dive-1-milvus-architecture-overview.md
title: >-
  Criação de uma base de dados de vectores para pesquisa de semelhanças
  escalável
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: >-
  O primeiro de uma série de blogues que analisa mais de perto o processo de
  pensamento e os princípios de conceção subjacentes à criação da base de dados
  vetorial de código aberto mais popular.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por Xiaofan Luan e transcrito por Angela Ni e Claire Yu.</p>
</blockquote>
<p>De acordo com <a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">as estatísticas</a>, cerca de 80%-90% dos dados mundiais não são estruturados. Alimentada pelo rápido crescimento da Internet, prevê-se uma explosão de dados não estruturados nos próximos anos. Consequentemente, as empresas precisam urgentemente de uma base de dados poderosa que as ajude a lidar melhor com esse tipo de dados e a compreendê-los. No entanto, desenvolver uma base de dados é sempre mais fácil de dizer do que de fazer. Este artigo tem como objetivo partilhar o processo de pensamento e os princípios de conceção da construção do Milvus, uma base de dados vetorial de código aberto e nativa da nuvem para pesquisa de semelhanças escalável. Este artigo também explica em pormenor a arquitetura do Milvus.</p>
<p>Saltar para:</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">Os dados não estruturados requerem uma pilha de software básica completa</a><ul>
<li><a href="#Vectors-and-scalars">Vectores e escalares</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">Do motor de pesquisa de vectores à base de dados de vectores</a></li>
<li><a href="#A-cloud-native-first-approach">Uma primeira abordagem nativa da nuvem</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Os princípios de conceção do Milvus 2.0</a><ul>
<li><a href="#Log-as-data">Registo como dados</a></li>
<li><a href="#Duality-of-table-and-log">Dualidade da tabela e do registo</a></li>
<li><a href="#Log-persistency">Persistência do registo</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">Criação de uma base de dados vetorial para pesquisa de semelhanças escalável</a><ul>
<li><a href="#Standalone-and-cluster">Autónomo e em cluster</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Um esqueleto básico da arquitetura Milvus</a></li>
<li><a href="#Data-Model">Modelo de dados</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Os dados não estruturados requerem uma pilha de software básica completa<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>À medida que a Internet cresceu e evoluiu, os dados não estruturados tornaram-se cada vez mais comuns, incluindo e-mails, documentos, dados de sensores IoT, fotos do Facebook, estruturas de proteínas e muito mais. Para que os computadores possam compreender e processar dados não estruturados, estes são convertidos em vectores utilizando <a href="https://zilliz.com/learn/embedding-generation">técnicas de incorporação</a>.</p>
<p>O Milvus armazena e indexa estes vectores e analisa a correlação entre dois vectores calculando a sua distância de semelhança. Se os dois vectores de incorporação forem muito semelhantes, isso significa que as fontes de dados originais também são semelhantes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>O fluxo de trabalho do processamento de dados não estruturados</span>. </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">Vectores e escalares</h3><p>Um escalar é uma quantidade que é descrita apenas por uma medida - magnitude. Um escalar pode ser representado como um número. Por exemplo, um carro está a viajar à velocidade de 80 km/h. Aqui, a velocidade (80km/h) é um escalar. Por outro lado, um vetor é uma quantidade que é descrita em pelo menos duas medidas - magnitude e direção. Se um carro está a viajar para oeste à velocidade de 80 km/h, a velocidade (80 km/h oeste) é um vetor. A imagem abaixo é um exemplo de escalares e vectores comuns.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>Escalares vs. Vectores</span> </span></p>
<p>Uma vez que a maioria dos dados importantes tem mais do que um atributo, podemos compreender melhor esses dados se os convertermos em vectores. Uma forma comum de manipularmos dados vectoriais é calcular a distância entre vectores utilizando <a href="https://milvus.io/docs/v2.0.x/metric.md">métricas</a> como a distância euclidiana, o produto interno, a distância de Tanimoto, a distância de Hamming, etc. Quanto mais próxima for a distância, mais semelhantes são os vectores. Para consultar eficientemente um conjunto de dados vectoriais maciço, podemos organizar os dados vectoriais criando índices sobre eles. Depois de o conjunto de dados ser indexado, as consultas podem ser encaminhadas para clusters, ou subconjuntos de dados, que têm maior probabilidade de conter vectores semelhantes a uma consulta de entrada.</p>
<p>Para saber mais sobre os índices, consulte <a href="https://milvus.io/docs/v2.0.x/index.md">Índice de vectores</a>.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">Do motor de pesquisa de vectores à base de dados de vectores</h3><p>Desde o início, o Milvus 2.0 foi concebido para servir não só como um motor de busca, mas, mais importante, como uma poderosa base de dados vetorial.</p>
<p>Uma forma de o ajudar a compreender a diferença é fazer uma analogia entre <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">o InnoDB</a> e <a href="https://www.mysql.com/">o MySQL</a>, ou <a href="https://lucene.apache.org/">o Lucene</a> e <a href="https://www.elastic.co/">o Elasticsearch</a>.</p>
<p>Tal como o MySQL e o Elasticsearch, o Milvus também foi construído com base em bibliotecas de código aberto, como a <a href="https://github.com/facebookresearch/faiss">Faiss</a>, a <a href="https://github.com/nmslib/hnswlib">HNSW</a> e <a href="https://github.com/spotify/annoy">a Annoy</a>, que se concentram em fornecer funcionalidades de pesquisa e garantir o desempenho da pesquisa. No entanto, seria injusto reduzir o Milvus a uma mera camada sobre o Faiss, uma vez que armazena, recupera e analisa vectores e, tal como qualquer outra base de dados, também fornece uma interface padrão para operações CRUD. Para além disso, o Milvus também possui caraterísticas que incluem</p>
<ul>
<li>Sharding e particionamento</li>
<li>Replicação</li>
<li>Recuperação de desastres</li>
<li>Equilíbrio de carga</li>
<li>Analisador ou optimizador de consultas</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>Base de dados vetorial</span> </span></p>
<p>Para uma compreensão mais abrangente do que é uma base de dados vetorial, leia o blogue <a href="https://zilliz.com/learn/what-is-vector-database">aqui</a>.</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">Uma primeira abordagem nativa da nuvem</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>Abordagem nativa da nuvem</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">Do nada partilhado, ao armazenamento partilhado e depois a algo partilhado</h4><p>As bases de dados tradicionais costumavam adotar uma arquitetura "nada partilhada", em que os nós dos sistemas distribuídos são independentes, mas ligados por uma rede. Nenhuma memória ou armazenamento é partilhado entre os nós. No entanto, <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">o Snowflake</a> revolucionou a indústria ao introduzir uma arquitetura de "armazenamento partilhado" em que a computação (processamento de consultas) é separada do armazenamento (armazenamento da base de dados). Com uma arquitetura de armazenamento partilhado, as bases de dados podem alcançar uma maior disponibilidade, escalabilidade e uma redução da duplicação de dados. Inspiradas pelo Snowflake, muitas empresas começaram a tirar partido da infraestrutura baseada na nuvem para a persistência de dados, utilizando simultaneamente o armazenamento local para o caching. Este tipo de arquitetura de base de dados é designado por "algo partilhado" e tornou-se a arquitetura dominante na maioria das aplicações actuais.</p>
<p>Para além da arquitetura "algo partilhado", o Milvus suporta o escalonamento flexível de cada componente, utilizando o Kubernetes para gerir o seu motor de execução e separando os serviços de leitura, escrita e outros serviços com microsserviços.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">Base de dados como um serviço (DBaaS)</h4><p>A base de dados como um serviço é uma tendência quente, uma vez que muitos utilizadores não se preocupam apenas com as funcionalidades regulares da base de dados, mas também anseiam por serviços mais variados. Isto significa que, para além das operações CRUD tradicionais, a nossa base de dados tem de enriquecer o tipo de serviços que pode fornecer, como a gestão de bases de dados, o transporte de dados, o carregamento, a visualização, etc.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">Sinergia com o ecossistema de código aberto mais alargado</h4><p>Outra tendência no desenvolvimento de bases de dados é aproveitar a sinergia entre a base de dados e outras infra-estruturas nativas da nuvem. No caso do Milvus, este baseia-se em alguns sistemas de código aberto. Por exemplo, o Milvus utiliza <a href="https://etcd.io/">o etcd</a> para armazenar metadados. Também adopta a fila de mensagens, um tipo de comunicação assíncrona serviço-a-serviço utilizada na arquitetura de microsserviços, que pode ajudar a exportar dados incrementais.</p>
<p>No futuro, esperamos construir o Milvus em cima de infraestruturas de IA como <a href="https://spark.apache.org/">Spark</a> ou <a href="https://www.tensorflow.org/">Tensorflow</a>, e integrar o Milvus com motores de streaming para que possamos suportar melhor o processamento unificado de stream e batch para satisfazer as várias necessidades dos utilizadores do Milvus.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Os princípios de conceção do Milvus 2.0<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>Como a nossa base de dados vetorial nativa da nuvem da próxima geração, o Milvus 2.0 é construído em torno dos três princípios seguintes.</p>
<h3 id="Log-as-data" class="common-anchor-header">Registo como dados</h3><p>Um registo numa base de dados regista em série todas as alterações feitas aos dados. Como mostra a figura abaixo, da esquerda para a direita estão os &quot;dados antigos&quot; e os &quot;dados novos&quot;. E os registos estão por ordem cronológica. O Milvus tem um mecanismo de temporização global que atribui um carimbo de data/hora globalmente único e auto-incremental.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>Registos</span> </span></p>
<p>No Milvus 2.0, o broker de logs serve como espinha dorsal do sistema: todas as operações de inserção e atualização de dados têm de passar pelo broker de logs, e os nós de trabalho executam operações CRUD subscrevendo e consumindo logs.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">Dualidade da tabela e do registo</h3><p>Tanto a tabela como o registo são dados, e são apenas duas formas diferentes. As tabelas são dados limitados, enquanto os registos não são limitados. Os registos podem ser convertidos em tabelas. No caso do Milvus, este agrega os registos utilizando uma janela de processamento do TimeTick. Com base na sequência de registos, vários registos são agregados num pequeno ficheiro denominado "log snapshot". Em seguida, esses instantâneos de log são combinados para formar um segmento, que pode ser usado individualmente para balanceamento de carga.</p>
<h3 id="Log-persistency" class="common-anchor-header">Persistência do registo</h3><p>A persistência dos registos é um dos problemas mais difíceis enfrentados por muitas bases de dados. O armazenamento de registos num sistema distribuído depende normalmente de algoritmos de replicação.</p>
<p>Ao contrário de bases de dados como <a href="https://aws.amazon.com/rds/aurora/">Aurora</a>, <a href="https://hbase.apache.org/">HBase</a>, <a href="https://www.cockroachlabs.com/">Cockroach DB</a> e <a href="https://en.pingcap.com/">TiDB</a>, o Milvus adopta uma abordagem inovadora e introduz um sistema de publicação/assinatura (pub/sub) para armazenamento e persistência de registos. Um sistema pub/sub é análogo à fila de mensagens no <a href="https://kafka.apache.org/">Kafka</a> ou no <a href="https://pulsar.apache.org/">Pulsar</a>. Todos os nós do sistema podem consumir os registos. Em Milvus, este tipo de sistema é designado por broker de registos. Graças ao corretor de registos, os registos são dissociados do servidor, garantindo que o Milvus não tem estado e está melhor posicionado para recuperar rapidamente de uma falha do sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>Corretor de registos</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">Construir uma base de dados vetorial para pesquisa de semelhanças escalável<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Construído com base em bibliotecas populares de pesquisa vetorial, incluindo Faiss, ANNOY, HNSW e outras, o Milvus foi concebido para a pesquisa de semelhanças em conjuntos de dados vectoriais densos que contêm milhões, milhares de milhões ou mesmo triliões de vectores.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">Autónomo e em cluster</h3><p>Milvus oferece duas formas de implementação - autónoma ou em cluster. No Milvus autónomo, uma vez que todos os nós são implementados em conjunto, podemos ver o Milvus como um único processo. Atualmente, o Milvus standalone depende do MinIO e do etcd para persistência de dados e armazenamento de metadados. Em versões futuras, esperamos eliminar essas duas dependências de terceiros para garantir a simplicidade do sistema Milvus. O cluster Milvus inclui oito componentes de microsserviço e três dependências de terceiros: MinIO, etcd, e Pulsar. A Pulsar serve como broker de logs e fornece serviços de pub/sub de logs.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>Autónomo e cluster</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Um esqueleto básico da arquitetura Milvus</h3><p>O Milvus separa o fluxo de dados do fluxo de controlo e está dividido em quatro camadas que são independentes em termos de escalabilidade e recuperação de desastres.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura Milvus</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">Camada de acesso</h4><p>A camada de acesso actua como a face do sistema, expondo o ponto final da ligação do cliente ao mundo exterior. É responsável pelo processamento das ligações dos clientes, pela verificação estática, pelas verificações dinâmicas básicas dos pedidos dos utilizadores, pelo encaminhamento dos pedidos e pela recolha e devolução dos resultados ao cliente. O proxy em si não tem estado e fornece endereços de acesso unificado e serviços para o mundo exterior através de componentes de balanceamento de carga (Nginx, Kubernetes Ingress, NodePort e LVS). O Milvus utiliza uma arquitetura de processamento paralelo massivo (MPP), em que os proxies devolvem resultados recolhidos a partir de nós de trabalho após agregação global e pós-processamento.</p>
<h4 id="Coordinator-service" class="common-anchor-header">Serviço de coordenação</h4><p>O serviço coordenador é o cérebro do sistema, responsável pela gestão dos nós da topologia do cluster, pelo equilíbrio de carga, pela geração de carimbos de data/hora, pela declaração de dados e pela gestão de dados. Para uma explicação detalhada da função de cada serviço coordenador, leia a <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">documentação técnica do Milvus</a>.</p>
<h4 id="Worker-nodes" class="common-anchor-header">Nós de trabalho</h4><p>O nó de trabalho, ou de execução, actua como os membros do sistema, executando as instruções emitidas pelo serviço coordenador e os comandos da linguagem de manipulação de dados (DML) iniciados pelo proxy. Um nó de trabalho no Milvus é semelhante a um nó de dados no <a href="https://hadoop.apache.org/">Hadoop</a>, ou a um servidor de região no HBase. Cada tipo de nó de trabalho corresponde a um serviço de coordenação. Para uma explicação detalhada da função de cada nó de trabalho, leia a <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">documentação técnica do Milvus</a>.</p>
<h4 id="Storage" class="common-anchor-header">Armazenamento</h4><p>O armazenamento é a pedra angular do Milvus, responsável pela persistência dos dados. A camada de armazenamento está dividida em três partes:</p>
<ul>
<li><strong>Meta store:</strong> Responsável por armazenar snapshots de meta-dados como o esquema da coleção, estado dos nós, checkpoints de consumo de mensagens, etc. O Milvus depende do etcd para estas funções e o Etcd também assume a responsabilidade pelo registo do serviço e pelas verificações de saúde.</li>
<li><strong>Corretor de registos:</strong> Um sistema pub/sub que suporta a reprodução e é responsável pela persistência de dados em fluxo contínuo, execução de consultas assíncronas fiáveis, notificações de eventos e devolução de resultados de consultas. Quando os nós estão a executar a recuperação de tempo de inatividade, o corretor de registos assegura a integridade dos dados incrementais através da reprodução do corretor de registos. O cluster Milvus utiliza o Pulsar como corretor de registos, enquanto o modo autónomo utiliza o RocksDB. Os serviços de armazenamento em fluxo contínuo, como o Kafka e o Pravega, também podem ser utilizados como corretores de registo.</li>
<li><strong>Armazenamento de objetos:</strong> Armazena ficheiros de instantâneos de registos, ficheiros de índices escalares/vectoriais e resultados de processamento de consultas intermédias. O Milvus suporta o <a href="https://aws.amazon.com/s3/">AWS S3</a> e <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">o Azure Blob</a>, bem como <a href="https://min.io/">o MinIO</a>, um serviço de armazenamento de objectos leve e de código aberto. Devido à elevada latência de acesso e à faturação por consulta dos serviços de armazenamento de objectos, o Milvus irá em breve suportar pools de cache baseados em memória/SSD e separação de dados quentes/frios para melhorar o desempenho e reduzir os custos.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">Modelo de dados</h3><p>O modelo de dados organiza os dados numa base de dados. Em Milvus, todos os dados são organizados por coleção, fragmento, partição, segmento e entidade.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>Modelo de dados 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">Coleção</h4><p>Uma coleção em Milvus pode ser comparada a uma tabela num sistema de armazenamento relacional. A coleção é a maior unidade de dados em Milvus.</p>
<h4 id="Shard" class="common-anchor-header">Fragmento</h4><p>Para tirar o máximo partido do poder de computação paralela dos clusters ao escrever dados, as colecções em Milvus devem distribuir as operações de escrita de dados por diferentes nós. Por defeito, uma única coleção contém dois shards. Dependendo do volume do conjunto de dados, é possível ter mais fragmentos numa coleção. Milvus usa um método de hashing de chave mestra para sharding.</p>
<h4 id="Partition" class="common-anchor-header">Partição</h4><p>Existem também várias partições num shard. Uma partição no Milvus refere-se a um conjunto de dados marcados com a mesma etiqueta numa coleção. Os métodos de partição comuns incluem a partição por data, sexo, idade do utilizador, entre outros. A criação de partições pode beneficiar o processo de consulta, uma vez que os dados podem ser filtrados por etiqueta de partição.</p>
<p>Em comparação, a fragmentação tem mais a ver com as capacidades de escalonamento ao escrever dados, enquanto o particionamento tem mais a ver com a melhoria do desempenho do sistema ao ler dados.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>Modelo de dados 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">Segmentos</h4><p>Dentro de cada partição, existem vários segmentos pequenos. Um segmento é a unidade mais pequena para a programação do sistema em Milvus. Existem dois tipos de segmentos, crescentes e selados. Os segmentos crescentes são subscritos pelos nós de consulta. O utilizador do Milvus continua a escrever dados em segmentos crescentes. Quando o tamanho de um segmento crescente atinge um limite superior (512 MB por defeito), o sistema não permite a escrita de dados extra neste segmento crescente, selando assim este segmento. Os índices são construídos em segmentos selados.</p>
<p>Para aceder aos dados em tempo real, o sistema lê os dados nos segmentos crescentes e nos segmentos selados.</p>
<h4 id="Entity" class="common-anchor-header">Entidade</h4><p>Cada segmento contém uma quantidade enorme de entidades. Uma entidade em Milvus é equivalente a uma linha numa base de dados tradicional. Cada entidade tem um campo de chave primária único, que também pode ser gerado automaticamente. As entidades devem também conter um carimbo de data/hora (ts), e um campo vetorial - o núcleo de Milvus.</p>
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
    </button></h2><p>Com o <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anúncio oficial da disponibilidade geral</a> do Milvus 2.0, orquestrámos esta série de blogues Milvus Deep Dive para fornecer uma interpretação aprofundada da arquitetura e do código fonte do Milvus. Os tópicos abordados nesta série de blogues incluem:</p>
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
