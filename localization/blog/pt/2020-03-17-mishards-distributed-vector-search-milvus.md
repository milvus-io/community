---
id: mishards-distributed-vector-search-milvus.md
title: Visão geral da arquitetura distribuída
author: milvus
date: 2020-03-17T21:36:16.974Z
desc: Como aumentar a escala
cover: assets.zilliz.com/tim_j_ots0_EO_Yu_Gt_U_unsplash_14f939b344.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/mishards-distributed-vector-search-milvus'
---
<custom-h1>Mishards - Pesquisa Vetorial Distribuída em Milvus</custom-h1><p>O objetivo do Milvus é conseguir uma pesquisa e análise de semelhanças eficiente para vectores de grande escala. Uma instância autónoma do Milvus pode lidar facilmente com a pesquisa de vectores à escala de mil milhões. No entanto, para 10 mil milhões, 100 mil milhões ou mesmo conjuntos de dados maiores, é necessário um cluster Milvus. O cluster pode ser utilizado como uma instância autónoma para aplicações de nível superior e pode satisfazer as necessidades comerciais de baixa latência e elevada simultaneidade para dados em grande escala. Um cluster Milvus pode reenviar pedidos, separar a leitura da escrita, escalar horizontalmente e expandir-se dinamicamente, fornecendo assim uma instância Milvus que pode expandir-se sem limites. Mishards é uma solução distribuída para Milvus.</p>
<p>Este artigo apresentará brevemente os componentes da arquitetura do Mishards. Informações mais detalhadas serão introduzidas nos próximos artigos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_milvus_cluster_mishards_daf78a0a91.png" alt="1-milvus-cluster-mishards.png" class="doc-image" id="1-milvus-cluster-mishards.png" />
   </span> <span class="img-wrapper"> <span>1-milvus-cluster-mishards.png</span> </span></p>
<h2 id="Distributed-architecture-overview" class="common-anchor-header">Visão geral da arquitetura distribuída<button data-href="#Distributed-architecture-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_distributed_architecture_overview_f059fe8c90.png" alt="2-distributed-architecture-overview.png" class="doc-image" id="2-distributed-architecture-overview.png" />
   </span> <span class="img-wrapper"> <span>2-distributed-architecture-overview.png</span> </span></p>
<h2 id="Service-tracing" class="common-anchor-header">Rastreio de serviços<button data-href="#Service-tracing" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_service_tracing_milvus_38559f7fd7.png" alt="3-service-tracing-milvus.png" class="doc-image" id="3-service-tracing-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-service-tracing-milvus.png</span> </span></p>
<h2 id="Primary-service-components" class="common-anchor-header">Componentes de serviço primários<button data-href="#Primary-service-components" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Estrutura de descoberta de serviços, como ZooKeeper, etcd e Consul.</li>
<li>Balanceador de carga, como Nginx, HAProxy, Ingress Controller.</li>
<li>Nó Mishards: sem estado, escalável.</li>
<li>Nó Milvus só de escrita: nó único e não escalável. É necessário utilizar soluções de alta disponibilidade para este nó para evitar um ponto único de falha.</li>
<li>Nó Milvus só de leitura: Nó com estado e escalável.</li>
<li>Serviço de armazenamento partilhado: Todos os nós Milvus utilizam um serviço de armazenamento partilhado para partilhar dados, como o NAS ou o NFS.</li>
<li>Serviço de metadados: Todos os nós Milvus utilizam este serviço para partilhar metadados. Atualmente, apenas o MySQL é suportado. Este serviço requer uma solução de alta disponibilidade MySQL.</li>
</ul>
<h2 id="Scalable-components" class="common-anchor-header">Componentes escaláveis<button data-href="#Scalable-components" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Mishards</li>
<li>Nós Milvus só de leitura</li>
</ul>
<h2 id="Components-introduction" class="common-anchor-header">Introdução aos componentes<button data-href="#Components-introduction" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Nós Mishards</strong></p>
<p>O Mishards é responsável por dividir os pedidos a montante e encaminhar os subpedidos para os sub-serviços. Os resultados são resumidos para retornar ao upstream.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_mishards_nodes_3fbe7d255d.jpg" alt="4-mishards-nodes.jpg" class="doc-image" id="4-mishards-nodes.jpg" />
   </span> <span class="img-wrapper"> <span>4-mishards-nodes.jpg</span> </span></p>
<p>Como indicado no gráfico acima, depois de aceitar um pedido de pesquisa TopK, a Mishards começa por dividir o pedido em subpedidos e envia os subpedidos para o serviço a jusante. Quando todas as sub-respostas são recolhidas, as sub-respostas são fundidas e devolvidas ao serviço a montante.</p>
<p>Como o Mishards é um serviço sem estado, não guarda dados nem participa em cálculos complexos. Assim, os nós não têm grandes requisitos de configuração e o poder de computação é utilizado principalmente na fusão dos sub-resultados. Assim, é possível aumentar o número de nós Mishards para obter uma elevada concorrência.</p>
<h2 id="Milvus-nodes" class="common-anchor-header">Nós Milvus<button data-href="#Milvus-nodes" class="anchor-icon" translate="no">
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
    </button></h2><p>Os nós Milvus são responsáveis pelas operações principais relacionadas com CRUD, pelo que têm requisitos de configuração relativamente elevados. Em primeiro lugar, o tamanho da memória deve ser suficientemente grande para evitar demasiadas operações de IO do disco. Em segundo lugar, as configurações da CPU também podem afetar o desempenho. À medida que o tamanho do cluster aumenta, são necessários mais nós Milvus para aumentar o rendimento do sistema.</p>
<h3 id="Read-only-nodes-and-writable-nodes" class="common-anchor-header">Nós somente leitura e nós graváveis</h3><ul>
<li>As operações principais do Milvus são a inserção e a pesquisa de vectores. A pesquisa tem requisitos extremamente altos nas configurações de CPU e GPU, enquanto a inserção ou outras operações têm requisitos relativamente baixos. A separação entre o nó que executa a pesquisa e o nó que executa outras operações permite uma implementação mais económica.</li>
<li>Em termos de qualidade de serviço, quando um nó está a executar operações de pesquisa, o hardware relacionado está a funcionar em plena carga e não pode garantir a qualidade de serviço de outras operações. Por conseguinte, são utilizados dois tipos de nós. Os pedidos de pesquisa são processados por nós só de leitura e os outros pedidos são processados por nós com capacidade de escrita.</li>
</ul>
<h3 id="Only-one-writable-node-is-allowed" class="common-anchor-header">Só é permitido um nó gravável</h3><ul>
<li><p>Atualmente, o Milvus não suporta a partilha de dados para várias instâncias graváveis.</p></li>
<li><p>Durante a implementação, é necessário ter em conta um ponto único de falha dos nós graváveis. É necessário preparar soluções de alta disponibilidade para os nós graváveis.</p></li>
</ul>
<h3 id="Read-only-node-scalability" class="common-anchor-header">Escalabilidade de nós só de leitura</h3><p>Quando o tamanho dos dados é extremamente grande ou o requisito de latência é extremamente elevado, pode escalar horizontalmente os nós só de leitura como nós com estado. Suponha que haja 4 hosts e que cada um tenha a seguinte configuração: Núcleos de CPU: 16, GPU: 1, Memória: 64 GB. O gráfico a seguir mostra o cluster ao escalonar horizontalmente nós com estado. Tanto o poder de computação quanto a memória são escalonados linearmente. Os dados são divididos em 8 shards com cada nó processando solicitações de 2 shards.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_read_only_node_scalability_milvus_be3ee6e0a7.png" alt="5-read-only-node-scalability-milvus.png" class="doc-image" id="5-read-only-node-scalability-milvus.png" />
   </span> <span class="img-wrapper"> <span>5-read-only-node-scalability-milvus.png</span> </span></p>
<p>Quando o número de solicitações é grande para alguns shards, nós stateless read-only podem ser implantados para esses shards para aumentar a taxa de transferência. Tome os hosts acima como exemplo. Quando os hosts são combinados em um cluster sem servidor, o poder de computação aumenta linearmente. Como os dados a processar não aumentam, o poder de processamento para o mesmo fragmento de dados também aumenta linearmente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_read_only_node_scalability_milvus_2_2cb98b9aa8.png" alt="6-read-only-node-scalability-milvus-2.png" class="doc-image" id="6-read-only-node-scalability-milvus-2.png" />
   </span> <span class="img-wrapper"> <span>6-read-only-node-scalability-milvus-2.png</span> </span></p>
<h3 id="Metadata-service" class="common-anchor-header">Serviço de metadados</h3><p>Palavras-chave: MySQL</p>
<p>Para obter mais informações sobre os metadados do Milvus, consulte Como visualizar os metadados. Num sistema distribuído, os nós graváveis Milvus são os únicos produtores de metadados. Os nós Mishards, os nós graváveis Milvus e os nós somente leitura Milvus são todos consumidores de metadados. Atualmente, o Milvus apenas suporta MySQL e SQLite como backend de armazenamento de metadados. Num sistema distribuído, o serviço só pode ser implementado como MySQL altamente disponível.</p>
<h3 id="Service-discovery" class="common-anchor-header">Descoberta de serviços</h3><p>Palavras-chave: Apache Zookeeper, etcd, Consul, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_service_discovery_054a977c6e.png" alt="7-service-discovery.png" class="doc-image" id="7-service-discovery.png" />
   </span> <span class="img-wrapper"> <span>7-service-discovery.png</span> </span></p>
<p>A descoberta de serviços fornece informações sobre todos os nós do Milvus. Os nós Milvus registam as suas informações quando ficam online e terminam a sessão quando ficam offline. Os nós Milvus também podem detetar nós anormais verificando periodicamente o estado de saúde dos serviços.</p>
<p>A descoberta de serviços contém uma série de estruturas, incluindo etcd, Consul, ZooKeeper, etc. Mishards define as interfaces de descoberta de serviços e oferece possibilidades de escalonamento por plugins. Atualmente, o Mishards fornece dois tipos de plugins, que correspondem ao cluster Kubernetes e a configurações estáticas. O utilizador pode personalizar a sua própria descoberta de serviços seguindo a implementação destes plugins. As interfaces são temporárias e precisam de ser redesenhadas. Mais informações sobre como escrever seu próprio plug-in serão elaboradas nos próximos artigos.</p>
<h3 id="Load-balancing-and-service-sharding" class="common-anchor-header">Balanceamento de carga e fragmentação de serviços</h3><p>Palavras-chave: Nginx, HAProxy, Kubernetes</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_load_balancing_and_service_sharding_f91891c6c1.png" alt="7-load-balancing-and-service-sharding.png" class="doc-image" id="7-load-balancing-and-service-sharding.png" />
   </span> <span class="img-wrapper"> <span>7-load-balancing-and-service-sharding.png</span> </span></p>
<p>A descoberta de serviços e o balanceamento de carga são usados em conjunto. O balanceamento de carga pode ser configurado como polling, hashing ou hashing consistente.</p>
<p>O balanceador de carga é responsável por reenviar as solicitações do usuário para o nó da Mishards.</p>
<p>Cada nó Mishards adquire a informação de todos os nós Milvus a jusante através do centro de descoberta de serviços. Todos os metadados relacionados podem ser adquiridos pelo serviço de metadados. A Mishards implementa a fragmentação consumindo estes recursos. O Mishards define as interfaces relacionadas com as estratégias de encaminhamento e fornece extensões através de plugins. Atualmente, a Mishards fornece uma estratégia de hashing consistente baseada no nível de segmento mais baixo. Como é mostrado no gráfico, há 10 segmentos, s1 a s10. De acordo com a estratégia de hashing consistente baseada no segmento, a Mishards encaminha os pedidos relativos a s1, 24, s6 e s9 para o nó Milvus 1, s2, s3, s5 para o nó Milvus 2 e s7, s8, s10 para o nó Milvus 3.</p>
<p>Com base nas suas necessidades comerciais, pode personalizar o encaminhamento seguindo o plugin de encaminhamento de hashing consistente predefinido.</p>
<h3 id="Tracing" class="common-anchor-header">Rastreamento</h3><p>Palavras-chave: OpenTracing, Jaeger, Zipkin</p>
<p>Dada a complexidade de um sistema distribuído, os pedidos são enviados para várias invocações de serviços internos. Para ajudar a identificar problemas, precisamos rastrear a cadeia de invocação de serviços internos. À medida que a complexidade aumenta, os benefícios de um sistema de rastreamento disponível são auto-explicativos. Escolhemos o padrão OpenTracing do CNCF. O OpenTracing fornece APIs independentes de plataforma e de fornecedor para que os programadores possam implementar convenientemente um sistema de rastreio.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_tracing_demo_milvus_fd385f0aba.png" alt="8-tracing-demo-milvus.png" class="doc-image" id="8-tracing-demo-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-tracing-demo-milvus.png</span> </span></p>
<p>O gráfico anterior é um exemplo de rastreamento durante a invocação de pesquisa. A pesquisa invoca <code translate="no">get_routing</code>, <code translate="no">do_search</code> e <code translate="no">do_merge</code> consecutivamente. <code translate="no">do_search</code> também invoca <code translate="no">search_127.0.0.1</code>.</p>
<p>Todo o registo de rastreio forma a seguinte árvore:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_search_traceid_milvus_35040d75bc.png" alt="8-search-traceid-milvus.png" class="doc-image" id="8-search-traceid-milvus.png" />
   </span> <span class="img-wrapper"> <span>8-search-traceid-milvus.png</span> </span></p>
<p>O gráfico seguinte mostra exemplos de informações de pedido/resposta e etiquetas de cada nó:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/request_response_info_tags_node_milvus_e169a31cb1.png" alt="request-response-info-tags-node-milvus.png" class="doc-image" id="request-response-info-tags-node-milvus.png" />
   </span> <span class="img-wrapper"> <span>request-response-info-tags-node-milvus.png</span> </span></p>
<p>O OpenTracing foi integrado no Milvus. Mais informações serão abordadas nos próximos artigos.</p>
<h3 id="Monitoring-and-alerting" class="common-anchor-header">Monitorização e alertas</h3><p>Palavras-chave: Prometheus, Grafana</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_monitor_alert_milvus_3ae8910af6.jpg" alt="10-monitor-alert-milvus.jpg" class="doc-image" id="10-monitor-alert-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>10-monitor-alerta-milvus.jpg</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Resumo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Como middleware de serviço, o Mishards integra a descoberta de serviços, a solicitação de roteamento, a mesclagem de resultados e o rastreamento. A expansão baseada em plug-in também é fornecida. Atualmente, as soluções distribuídas baseadas no Mishards ainda têm os seguintes contratempos:</p>
<ul>
<li>O Mishards utiliza proxy como camada intermédia e tem custos de latência.</li>
<li>Os nós graváveis do Milvus são serviços de ponto único.</li>
<li>A implementação é complicada quando existem vários fragmentos e um único fragmento tem várias cópias.</li>
<li>Falta uma camada de cache, como o acesso a metadados.</li>
</ul>
<p>Iremos corrigir estes problemas conhecidos nas próximas versões para que os Mishards possam ser aplicados ao ambiente de produção de forma mais conveniente.</p>
