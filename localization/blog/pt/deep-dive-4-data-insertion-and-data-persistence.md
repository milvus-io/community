---
id: deep-dive-4-data-insertion-and-data-persistence.md
title: Inserção de dados e persistência de dados numa base de dados vetorial
author: Bingyi Sun
date: 2022-04-06T00:00:00.000Z
desc: >-
  Conheça o mecanismo subjacente à inserção e persistência de dados na base de
  dados vetorial Milvus.
cover: assets.zilliz.com/Deep_Dive_4_812021d715.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_4_812021d715.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/sunby">Bingyi Sun</a> e transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>No post anterior da série Deep Dive, apresentámos <a href="https://milvus.io/blog/deep-dive-3-data-processing.md">a forma como os dados são processados no Milvus</a>, a base de dados vetorial mais avançada do mundo. Neste artigo, continuaremos a examinar os componentes envolvidos na inserção de dados, ilustraremos o modelo de dados em pormenor e explicaremos como se consegue a persistência de dados no Milvus.</p>
<p>Saltar para:</p>
<ul>
<li><a href="#Milvus-architecture-recap">Recapitulação da arquitetura do Milvus</a></li>
<li><a href="#The-portal-of-data-insertion-requests">O portal de pedidos de inserção de dados</a></li>
<li><a href="#Data-coord-and-data-node">Coordenada de dados e nó de dados</a></li>
<li><a href="#Root-coord-and-Time-Tick">Coordenada de raiz e Time Tick</a></li>
<li><a href="#Data-organization-collection-partition-shard-channel-segment">Organização dos dados: coleção, partição, fragmento (canal), segmento</a></li>
<li><a href="#Data-allocation-when-and-how">Atribuição de dados: quando e como</a></li>
<li><a href="#Binlog-file-structure-and-data-persistence">Estrutura do ficheiro Binlog e persistência dos dados</a></li>
</ul>
<h2 id="Milvus-architecture-recap" class="common-anchor-header">Recapitulação da arquitetura Milvus<button data-href="#Milvus-architecture-recap" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_c7910cb89d.png" alt="Milvus architecture." class="doc-image" id="milvus-architecture." />
   </span> <span class="img-wrapper"> <span>Arquitetura do Milvus</span>. </span></p>
<p>O SDK envia pedidos de dados para o proxy, o portal, através do balanceador de carga. Em seguida, o proxy interage com o serviço de coordenação para escrever pedidos DDL (linguagem de definição de dados) e DML (linguagem de manipulação de dados) no armazenamento de mensagens.</p>
<p>Os nós de trabalho, incluindo o nó de consulta, o nó de dados e o nó de índice, consomem os pedidos do armazenamento de mensagens. Mais especificamente, o nó de consulta é responsável pela consulta de dados; o nó de dados é responsável pela inserção e persistência de dados; e o nó de índice trata principalmente da criação de índices e da aceleração de consultas.</p>
<p>A camada inferior é o armazenamento de objectos, que utiliza principalmente o MinIO, o S3 e o AzureBlob para armazenar registos, binlogs delta e ficheiros de índice.</p>
<h2 id="The-portal-of-data-insertion-requests" class="common-anchor-header">O portal de pedidos de inserção de dados<button data-href="#The-portal-of-data-insertion-requests" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Proxy_in_Milvus_aa6b724e0b.jpeg" alt="Proxy in Milvus." class="doc-image" id="proxy-in-milvus." />
   </span> <span class="img-wrapper"> <span>Proxy em Milvus</span>. </span></p>
<p>O proxy funciona como um portal de pedidos de inserção de dados.</p>
<ol>
<li>Inicialmente, o proxy aceita os pedidos de inserção de dados dos SDKs e atribui esses pedidos a vários baldes utilizando um algoritmo de hash.</li>
<li>Em seguida, o proxy solicita à coordenação de dados que atribua segmentos, a unidade mais pequena do Milvus para armazenamento de dados.</li>
<li>Depois, o proxy insere as informações dos segmentos solicitados no armazenamento de mensagens para que essas informações não se percam.</li>
</ol>
<h2 id="Data-coord-and-data-node" class="common-anchor-header">Coordenação de dados e nó de dados<button data-href="#Data-coord-and-data-node" class="anchor-icon" translate="no">
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
    </button></h2><p>A principal função da coordenação de dados é gerir a atribuição de canais e segmentos, enquanto a principal função do nó de dados é consumir e manter os dados inseridos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_coord_and_data_node_in_Milvus_8bcf010f9e.jpeg" alt="Data coord and data node in Milvus." class="doc-image" id="data-coord-and-data-node-in-milvus." />
   </span> <span class="img-wrapper"> <span>Coordenação de dados e nó de dados em Milvus</span>. </span></p>
<h3 id="Function" class="common-anchor-header">Função</h3><p>A coordenação de dados tem as seguintes funções</p>
<ul>
<li><p><strong>Alocar espaço de segmento</strong>O data coord aloca espaço em segmentos crescentes para o proxy para que o proxy possa usar espaço livre em segmentos para inserir dados.</p></li>
<li><p><strong>Registar a atribuição do segmento e o tempo de expiração do espaço atribuído no segmento</strong>O espaço dentro de cada segmento atribuído pela coord de dados não é permanente, portanto, a coord de dados também precisa de manter um registo do tempo de expiração de cada atribuição de segmento.</p></li>
<li><p><strong>Descarregar automaticamente os dados do segmento</strong>Se o segmento estiver cheio, a coordenação de dados desencadeia automaticamente a descarga de dados.</p></li>
<li><p><strong>Atribuir canais aos nós de dados</strong>Uma coleção pode ter vários <a href="https://milvus.io/docs/v2.0.x/glossary.md#VChannel">vchannels</a>. A coordenação de dados determina quais os vchannels que são consumidos pelos nós de dados.</p></li>
</ul>
<p>O nó de dados serve nos seguintes aspectos:</p>
<ul>
<li><p><strong>Consumir dados</strong>O nó de dados consome dados dos canais atribuídos pela coordenação de dados e cria uma sequência para os dados.</p></li>
<li><p><strong>Persistência de dados</strong>Armazena em cache os dados inseridos na memória e transfere-os automaticamente para o disco quando o volume de dados atinge um determinado limiar.</p></li>
</ul>
<h3 id="Workflow" class="common-anchor-header">Fluxo de trabalho</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/One_vchannel_can_only_be_assigned_to_one_data_node_14aa3bd718.png" alt="One vchannel can only be assigned to one data node." class="doc-image" id="one-vchannel-can-only-be-assigned-to-one-data-node." />
   </span> <span class="img-wrapper"> <span>Um vchannel só pode ser atribuído a um nó de dados</span>. </span></p>
<p>Como mostrado na imagem acima, a coleção tem quatro vchannels (V1, V2, V3 e V4) e há dois nós de dados. É muito provável que a coordenação de dados atribua um nó de dados para consumir dados de V1 e V2, e o outro nó de dados de V3 e V4. Um único vchannel não pode ser atribuído a múltiplos nós de dados e isso é para evitar a repetição do consumo de dados, que de outra forma causaria o mesmo lote de dados sendo inserido no mesmo segmento repetidamente.</p>
<h2 id="Root-coord-and-Time-Tick" class="common-anchor-header">Coordenada de raiz e Time Tick<button data-href="#Root-coord-and-Time-Tick" class="anchor-icon" translate="no">
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
    </button></h2><p>A coord de raiz gere o TSO (timestamp Oracle) e publica globalmente mensagens de time tick. Cada pedido de inserção de dados tem um carimbo de data/hora atribuído pela coordenada de raiz. O Time Tick é a pedra angular de Milvus que actua como um relógio em Milvus e significa em que ponto do tempo está o sistema Milvus.</p>
<p>Quando os dados são escritos em Milvus, cada pedido de inserção de dados tem um carimbo de tempo. Durante o consumo de dados, cada nó de dados temporais consome dados cujos carimbos temporais estão dentro de um determinado intervalo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_data_insertion_and_data_consumption_based_on_timestamp_e820f682f9.jpeg" alt="An example of data insertion and data consumption based on timestamp." class="doc-image" id="an-example-of-data-insertion-and-data-consumption-based-on-timestamp." />
   </span> <span class="img-wrapper"> <span>Um exemplo de inserção e consumo de dados com base num carimbo de data/hora</span>. </span></p>
<p>A imagem acima representa o processo de inserção de dados. Os valores dos carimbos de data/hora são representados pelos números 1,2,6,5,7,8. Os dados são escritos no sistema por dois proxies: p1 e p2. Durante o consumo de dados, se a hora atual do carimbo de tempo for 5, os nós de dados só podem ler os dados 1 e 2. Depois, durante a segunda leitura, se a hora atual do Time Tick for 9, os dados 6,7,8 podem ser lidos pelo nó de dados.</p>
<h2 id="Data-organization-collection-partition-shard-channel-segment" class="common-anchor-header">Organização de dados: coleção, partição, fragmento (canal), segmento<button data-href="#Data-organization-collection-partition-shard-channel-segment" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_organization_in_Milvus_75ad710752.jpeg" alt="Data organization in Milvus." class="doc-image" id="data-organization-in-milvus." />
   </span> <span class="img-wrapper"> <span>Organização de dados em Milvus</span>. </span></p>
<p>Leia este <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">artigo</a> primeiro para compreender o modelo de dados em Milvus e os conceitos de coleção, fragmento, partição e segmento.</p>
<p>Em resumo, a maior unidade de dados em Milvus é uma coleção que pode ser comparada a uma tabela numa base de dados relacional. Uma coleção pode ter vários fragmentos (cada um correspondendo a um canal) e várias partições dentro de cada fragmento. Como se pode ver na ilustração acima, os canais (shards) são as barras verticais, enquanto as partições são as barras horizontais. Em cada intersecção está o conceito de segmento, a menor unidade para alocação de dados. No Milvus, os índices são construídos sobre segmentos. Durante uma consulta, o sistema Milvus também equilibra as cargas de consulta em diferentes nós de consulta e este processo é realizado com base na unidade de segmentos. Os segmentos contêm vários <a href="https://milvus.io/docs/v2.0.x/glossary.md#Binlog">binlogs</a>, e quando os dados do segmento são consumidos, é gerado um ficheiro binlog.</p>
<h3 id="Segment" class="common-anchor-header">Segmento</h3><p>Existem três tipos de segmentos com diferentes estados em Milvus: segmento em crescimento, selado e descarregado.</p>
<h4 id="Growing-segment" class="common-anchor-header">Segmento em crescimento</h4><p>Um segmento crescente é um segmento recém-criado que pode ser alocado ao proxy para inserção de dados. O espaço interno de um segmento pode ser usado, alocado ou livre.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Three_status_in_a_growing_segment_bdae45e26f.png" alt="Three status in a growing segment" class="doc-image" id="three-status-in-a-growing-segment" />
   </span> <span class="img-wrapper"> <span>Três status em um segmento crescente</span> </span></p>
<ul>
<li>Usado: essa parte do espaço de um segmento crescente foi consumida pelo nó de dados.</li>
<li>Alocado: esta parte do espaço de um segmento crescente foi solicitada pelo proxy e alocada pela coordenada de dados. O espaço atribuído expirará após um determinado período de tempo.</li>
<li>Livre: esta parte do espaço de um segmento em crescimento não foi utilizada. O valor do espaço livre é igual ao espaço total do segmento subtraído pelo valor do espaço utilizado e atribuído. Assim, o espaço livre de um segmento aumenta à medida que o espaço atribuído expira.</li>
</ul>
<h4 id="Sealed-segment" class="common-anchor-header">Segmento fechado</h4><p>Um segmento selado é um segmento fechado que já não pode ser atribuído ao proxy para inserção de dados.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sealed_segment_in_Milvus_8def5567e1.jpeg" alt="Sealed segment in Milvus" class="doc-image" id="sealed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segmento selado em Milvus</span> </span></p>
<p>Um segmento em expansão é selado nas seguintes circunstâncias:</p>
<ul>
<li>Se o espaço utilizado num segmento crescente atingir 75% do espaço total, o segmento será selado.</li>
<li>Flush() é chamado manualmente por um utilizador Milvus para persistir todos os dados numa coleção.</li>
<li>Os segmentos em crescimento que não forem selados após um longo período de tempo serão selados, uma vez que demasiados segmentos em crescimento fazem com que os nós de dados consumam demasiada memória.</li>
</ul>
<h4 id="Flushed-segment" class="common-anchor-header">Segmento de descarga</h4><p>Um segmento flushed é um segmento que já foi gravado no disco. Flush refere-se ao armazenamento de dados do segmento no armazenamento de objetos para fins de persistência de dados. Um segmento só pode ser descarregado quando o espaço alocado em um segmento selado expira. Quando descarregado, o segmento selado se transforma em um segmento descarregado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Flushed_segment_in_Milvus_0c1f54d432.png" alt="Flushed segment in Milvus" class="doc-image" id="flushed-segment-in-milvus" />
   </span> <span class="img-wrapper"> <span>Segmento flushed em Milvus</span> </span></p>
<h3 id="Channel" class="common-anchor-header">Canal</h3><p>Um canal é alocado :</p>
<ul>
<li>Quando o nó de dados inicia ou desliga; ou</li>
<li>Quando o espaço do segmento alocado é solicitado pelo proxy.</li>
</ul>
<p>Existem então várias estratégias de atribuição de canais. Milvus suporta 2 dessas estratégias:</p>
<ol>
<li>Hashing consistente</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_hashing_in_Milvus_fb5e5d84ce.jpeg" alt="Consistency hashing in Milvus" class="doc-image" id="consistency-hashing-in-milvus" />
   </span> <span class="img-wrapper"> <span>Consistência de hashing em Milvus</span> </span></p>
<p>A estratégia padrão em Milvus. Esta estratégia aproveita a técnica de hashing para atribuir a cada canal uma posição no anel e, em seguida, procura na direção do relógio para encontrar o nó de dados mais próximo de um canal. Assim, na ilustração acima, o canal 1 é atribuído ao nó de dados 2, enquanto o canal 2 é atribuído ao nó de dados 3.</p>
<p>No entanto, um problema com esta estratégia é que o aumento ou diminuição do número de nós de dados (por exemplo, um novo nó de dados começa ou um nó de dados desliga-se subitamente) pode afetar o processo de atribuição de canais. Para resolver este problema, o data coord monitoriza o estado dos nós de dados através do etcd para que o data coord possa ser imediatamente notificado se houver alguma alteração no estado dos nós de dados. Em seguida, o coordenador de dados determina ainda a que nó de dados devem ser atribuídos os canais corretamente.</p>
<ol start="2">
<li>Balanceamento de carga</li>
</ol>
<p>A segunda estratégia consiste em atribuir canais da mesma coleção a diferentes nós de dados, garantindo que os canais são atribuídos de forma uniforme. O objetivo desta estratégia é conseguir o equilíbrio da carga.</p>
<h2 id="Data-allocation-when-and-how" class="common-anchor-header">Atribuição de dados: quando e como<button data-href="#Data-allocation-when-and-how" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/The_process_of_data_allocation_in_Milvus_0ba86b3ad1.jpeg" alt="The process of data allocation in Milvus" class="doc-image" id="the-process-of-data-allocation-in-milvus" />
   </span> <span class="img-wrapper"> <span>O processo de atribuição de dados em Milvus</span> </span></p>
<p>O processo de atribuição de dados parte do cliente. Começa por enviar pedidos de inserção de dados com um carimbo de data/hora <code translate="no">t1</code> para o proxy. Em seguida, o proxy envia um pedido de atribuição de segmentos à coordenação dos dados.</p>
<p>Ao receber o pedido de atribuição de segmento, o coordenador de dados verifica o estado do segmento e atribui o segmento. Se o espaço atual dos segmentos criados for suficiente para as novas linhas de dados inseridas, a coordenada de dados atribui esses segmentos criados. No entanto, se o espaço disponível nos segmentos actuais não for suficiente, a coordenada de dados atribui um novo segmento. A coordenada de dados pode devolver um ou mais segmentos a cada pedido. Entretanto, a coordenada de dados também guarda o segmento atribuído no meta servidor para persistência dos dados.</p>
<p>Subsequentemente, o coordenador de dados devolve a informação do segmento atribuído (incluindo o ID do segmento, o número de linhas, o tempo de expiração <code translate="no">t2</code>, etc.) ao proxy. O proxy envia essas informações do segmento atribuído para o armazenamento de mensagens, de modo a que essas informações sejam devidamente registadas. Note-se que o valor de <code translate="no">t1</code> deve ser inferior ao de <code translate="no">t2</code>. O valor por defeito de <code translate="no">t2</code> é de 2 000 milissegundos e pode ser alterado configurando o parâmetro <code translate="no">segment.assignmentExpiration</code> no ficheiro <code translate="no">data_coord.yaml</code>.</p>
<h2 id="Binlog-file-structure-and-data-persistence" class="common-anchor-header">Estrutura do ficheiro Binlog e persistência de dados<button data-href="#Binlog-file-structure-and-data-persistence" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_node_flush_86832f46d0.png" alt="Data node flush" class="doc-image" id="data-node-flush" />
   </span> <span class="img-wrapper"> <span>Descarga do nó de dados</span> </span></p>
<p>O nó de dados subscreve o armazenamento de mensagens porque os pedidos de inserção de dados são mantidos no armazenamento de mensagens e os nós de dados podem assim consumir mensagens de inserção. Os nós de dados começam por colocar os pedidos de inserção numa memória intermédia de inserção e, à medida que os pedidos se acumulam, são descarregados para o armazenamento de objectos após atingirem um determinado limiar.</p>
<h3 id="Binlog-file-structure" class="common-anchor-header">Estrutura do ficheiro Binlog</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_file_structure_ca2897a095.png" alt="Binlog file structure." class="doc-image" id="binlog-file-structure." />
   </span> <span class="img-wrapper"> <span>Estrutura do ficheiro binlog</span>. </span></p>
<p>A estrutura do ficheiro binlog no Milvus é semelhante à do MySQL. O binlog é utilizado para servir duas funções: recuperação de dados e construção de índices.</p>
<p>Um binlog contém muitos <a href="https://github.com/milvus-io/milvus/blob/master/docs/developer_guides/chap08_binlog.md#event-format">eventos</a>. Cada evento tem um cabeçalho e dados de evento.</p>
<p>Os metadados, incluindo a hora de criação do binlog, o ID do nó de escrita, a duração do evento e NextPosition (offset do próximo evento), etc., são escritos no cabeçalho do evento.</p>
<p>Os dados do evento podem ser divididos em duas partes: fixos e variáveis.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/File_structure_of_an_insert_event_829b1f628d.png" alt="File structure of an insert event." class="doc-image" id="file-structure-of-an-insert-event." />
   </span> <span class="img-wrapper"> <span>Estrutura de ficheiro de um evento de inserção</span>. </span></p>
<p>A parte fixa dos dados de um evento <code translate="no">INSERT_EVENT</code> contém <code translate="no">StartTimestamp</code>, <code translate="no">EndTimestamp</code>, e <code translate="no">reserved</code>.</p>
<p>A parte variável armazena, de facto, os dados inseridos. Os dados de inserção são sequenciados no formato de parquet e armazenados neste ficheiro.</p>
<h3 id="Data-persistence" class="common-anchor-header">Persistência de dados</h3><p>Se existirem várias colunas no esquema, o Milvus armazena os binlogs nas colunas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Binlog_data_persistence_0c028bf26a.png" alt="Binlog data persistence." class="doc-image" id="binlog-data-persistence." />
   </span> <span class="img-wrapper"> <span>Persistência dos dados do binlog</span>. </span></p>
<p>Tal como ilustrado na imagem acima, a primeira coluna é a chave primária binlog. A segunda é a coluna de carimbo de data/hora. As restantes são as colunas definidas no esquema. O caminho do ficheiro dos binlogs no MinIO também está indicado na imagem acima.</p>
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
    </button></h2><p>Com o <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anúncio oficial da disponibilidade geral</a> do Milvus 2.0, orquestrámos esta série de blogs Milvus Deep Dive para fornecer uma interpretação aprofundada da arquitetura e do código fonte do Milvus. Os tópicos abordados nesta série de blogues incluem:</p>
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
