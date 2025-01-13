---
id: raft-or-not.md
title: >-
  Jangada ou não? A melhor solução para a consistência de dados em bancos de
  dados nativos da nuvem
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: >-
  Porque é que o algoritmo de replicação baseado no consenso não é a solução
  ideal para obter a consistência dos dados em bases de dados distribuídas?
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/xiaofan-luan">Xiaofan Luan</a> e transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>A replicação baseada em consenso é uma estratégia amplamente adotada em muitos bancos de dados distribuídos e nativos da nuvem. No entanto, ela tem algumas deficiências e definitivamente não é a solução ideal.</p>
<p>Este post tem como objetivo primeiro explicar os conceitos de replicação, consistência e consenso em um banco de dados distribuído e nativo da nuvem, em seguida, esclarecer por que algoritmos baseados em consenso como Paxos e Raft não são a bala de prata e, finalmente, propor uma <a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">solução para a replicação baseada em consenso</a>.</p>
<p><strong>Ir para:</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">Entendendo a replicação, a consistência e o consenso</a></li>
<li><a href="#Consensus-based-replication">Replicação baseada em consenso</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">Uma estratégia de replicação de log para banco de dados distribuído e nativo da nuvem</a></li>
<li><a href="#Summary">Resumo</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">Entendendo a replicação, a consistência e o consenso<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de nos aprofundarmos nos prós e contras do Paxos e do Raft, e propormos uma estratégia de replicação de logs mais adequada, precisamos primeiro desmistificar os conceitos de replicação, consistência e consenso.</p>
<p>Note-se que este artigo se concentra principalmente na sincronização de dados/logs incrementais. Por conseguinte, quando se fala de replicação de dados/log, refere-se apenas a replicação de dados incrementais e não de dados históricos.</p>
<h3 id="Replication" class="common-anchor-header">Replicação</h3><p>A replicação é o processo de fazer várias cópias de dados e armazená-las em diferentes discos, processos, máquinas, clusters, etc., com o objetivo de aumentar a fiabilidade dos dados e acelerar as consultas de dados. Uma vez que, na replicação, os dados são copiados e armazenados em vários locais, os dados são mais fiáveis face à recuperação de falhas de disco, falhas de máquinas físicas ou erros de cluster. Além disso, várias réplicas de dados podem aumentar o desempenho de uma base de dados distribuída, acelerando consideravelmente as consultas.</p>
<p>Existem vários modos de replicação, tais como a replicação síncrona/assíncrona, a replicação com consistência forte/eventual, a replicação líder-seguidor/replicação descentralizada. A escolha do modo de replicação tem um efeito na disponibilidade e na consistência do sistema. Por conseguinte, tal como proposto no famoso <a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">teorema CAP</a>, um arquiteto de sistemas tem de optar entre a consistência e a disponibilidade quando a partição da rede é inevitável.</p>
<h3 id="Consistency" class="common-anchor-header">Consistência</h3><p>Em suma, a consistência numa base de dados distribuída refere-se à propriedade que garante que cada nó ou réplica tem a mesma visão dos dados quando escreve ou lê dados num determinado momento. Para obter uma lista completa dos níveis de consistência, leia o documento <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">aqui</a>.</p>
<p>Para esclarecer, estamos a falar de consistência como no teorema CAP, e não ACID (atomicidade, consistência, isolamento, durabilidade). A consistência no teorema CAP refere-se ao facto de cada nó do sistema ter os mesmos dados, enquanto a consistência no ACID se refere a um único nó que aplica as mesmas regras em todas as potenciais submissões.</p>
<p>Em geral, as bases de dados OLTP (processamento de transacções em linha) exigem uma forte consistência ou linearização para garantir que</p>
<ul>
<li>Cada leitura pode aceder aos últimos dados inseridos.</li>
<li>Se um novo valor for devolvido após uma leitura, todas as leituras seguintes, independentemente de se tratar do mesmo cliente ou de clientes diferentes, devem devolver o novo valor.</li>
</ul>
<p>A essência da linearização é garantir a recência de múltiplas réplicas de dados - uma vez que um novo valor é escrito ou lido, todas as leituras subsequentes podem ver o novo valor até que o valor seja posteriormente substituído. Um sistema distribuído que ofereça linearização pode poupar aos utilizadores o trabalho de vigiar várias réplicas e pode garantir a atomicidade e a ordem de cada operação.</p>
<h3 id="Consensus" class="common-anchor-header">Consenso</h3><p>O conceito de consenso é introduzido nos sistemas distribuídos porque os utilizadores estão ansiosos por ver os sistemas distribuídos a funcionar da mesma forma que os sistemas autónomos.</p>
<p>Em termos simples, o consenso é um acordo geral sobre um valor. Por exemplo, o Estêvão e o Francisco queriam ir comer qualquer coisa. Steve sugeriu que comessem sandes. Frank concordou com a sugestão de Steve e ambos comeram sandes. Chegaram a um consenso. Mais especificamente, um valor (sanduíches) proposto por um deles é aceite por ambos, e ambos tomam medidas com base nesse valor. Do mesmo modo, o consenso num sistema distribuído significa que quando um processo propõe um valor, todos os restantes processos do sistema concordam e actuam com base nesse valor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>Consenso</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">Replicação baseada no consenso<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>Os primeiros algoritmos baseados em consenso foram propostos juntamente com a <a href="https://pmg.csail.mit.edu/papers/vr.pdf">replicação com carimbo de vista</a> em 1988. Em 1989, Leslie Lamport propôs <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">o Paxos</a>, um algoritmo baseado no consenso.</p>
<p>Nos últimos anos, assistimos à predominância de outro algoritmo baseado no consenso no sector - o <a href="https://raft.github.io/">Raft</a>. Foi adotado por muitas das principais bases de dados NewSQL, como CockroachDB, TiDB, OceanBase, etc.</p>
<p>É de notar que um sistema distribuído não suporta necessariamente a linearização, mesmo que adopte a replicação baseada no consenso. No entanto, a linearização é o pré-requisito para a construção de uma base de dados distribuída ACID.</p>
<p>Ao conceber um sistema de base de dados, deve ser tida em conta a ordem de confirmação dos registos e das máquinas de estado. Também é necessário um cuidado extra para manter o aluguer do líder do Paxos ou do Raft e evitar uma divisão do cérebro sob a partição da rede.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Máquina de estado de replicação Raft</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">Prós e contras</h3><p>De facto, o Raft, o ZAB e <a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">o protocolo de registo baseado em quorum</a> no Aurora são variações do Paxos. A replicação baseada em consenso tem as seguintes vantagens:</p>
<ol>
<li>Embora a replicação baseada no consenso se centre mais na consistência e na partição da rede no teorema CAP, proporciona uma disponibilidade relativamente melhor em comparação com a replicação tradicional líder-seguidor.</li>
<li>O Raft é um avanço que simplificou bastante os algoritmos baseados no consenso. Existem muitas bibliotecas Raft de código aberto no GitHub (por exemplo, <a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>).</li>
<li>O desempenho da replicação baseada no consenso pode satisfazer a maioria das aplicações e empresas. Com a cobertura de SSDs de alto desempenho e NICs (placa de interface de rede) de gigabytes, o fardo de sincronizar várias réplicas é aliviado, tornando os algoritmos Paxos e Raft os principais no sector.</li>
</ol>
<p>Uma ideia errada é que a replicação baseada em consenso é a solução ideal para obter consistência de dados numa base de dados distribuída. No entanto, esta não é a verdade. Os desafios em termos de disponibilidade, complexidade e desempenho enfrentados pelo algoritmo baseado em consenso impedem-no de ser a solução perfeita.</p>
<ol>
<li><p>Disponibilidade comprometida O algoritmo Paxos ou Raft optimizado tem uma forte dependência da réplica líder, que tem uma fraca capacidade de lutar contra a falha cinzenta. Na replicação baseada no consenso, uma nova eleição da réplica líder não terá lugar até que o nó líder não responda durante um longo período de tempo. Por conseguinte, a replicação baseada no consenso é incapaz de lidar com situações em que o nó líder é lento ou em que ocorre uma falha.</p></li>
<li><p>Elevada complexidade Embora já existam muitos algoritmos alargados baseados em Paxos e Raft, o aparecimento de <a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft</a> e <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel Raft</a> exige mais considerações e testes sobre a sincronização entre registos e máquinas de estado.</p></li>
<li><p>Desempenho comprometido Numa era nativa da nuvem, o armazenamento local é substituído por soluções de armazenamento partilhado como o EBS e o S3 para garantir a fiabilidade e a consistência dos dados. Como resultado, a replicação baseada em consenso já não é uma necessidade para sistemas distribuídos. Além disso, a replicação baseada em consenso traz consigo o problema da redundância de dados, uma vez que tanto a solução como o EBS têm várias réplicas.</p></li>
</ol>
<p>Para a replicação em vários centros de dados e várias nuvens, a procura de consistência compromete não só a disponibilidade, mas também <a href="https://en.wikipedia.org/wiki/PACELC_theorem">a latência</a>, resultando numa diminuição do desempenho. Por conseguinte, a linearização não é uma necessidade para a tolerância a desastres em vários centros de dados na maioria das aplicações.</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">Uma estratégia de replicação de registos para bases de dados distribuídas e nativas da nuvem<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>É inegável que os algoritmos baseados no consenso, como o Raft e o Paxos, continuam a ser os principais algoritmos adoptados por muitas bases de dados OLTP. No entanto, ao observar os exemplos do protocolo <a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a>, <a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a> e <a href="https://rockset.com/">Rockset</a>, podemos ver que a tendência está a mudar.</p>
<p>Existem dois princípios principais para uma solução que possa servir melhor uma base de dados distribuída e nativa da nuvem.</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1. Replicação como um serviço</h3><p>É necessário um microsserviço separado dedicado à sincronização de dados. O módulo de sincronização e o módulo de armazenamento não devem mais estar fortemente acoplados dentro do mesmo processo.</p>
<p>Por exemplo, o Socrates dissocia o armazenamento, o registo e a computação. Existe um serviço de registo dedicado (serviço XLog no centro da figura abaixo).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura do Socrates</span> </span></p>
<p>O serviço XLog é um serviço individual. A persistência dos dados é conseguida com a ajuda de um armazenamento de baixa latência. A zona de aterragem no Socrates é responsável por manter três réplicas a uma velocidade acelerada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>Serviço XLog do Socrates</span> </span></p>
<p>O nó líder distribui os registos para o corretor de registos de forma assíncrona e transfere os dados para a Xstore. A cache SSD local pode acelerar a leitura dos dados. Quando a descarga de dados é bem sucedida, os buffers na zona de aterragem podem ser limpos. Obviamente, todos os dados de registo são divididos em três camadas - zona de aterragem, SSD local e XStore.</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2. Princípio da boneca russa</h3><p>Uma forma de conceber um sistema é seguir o princípio da boneca russa: cada camada é completa e perfeitamente adequada ao que a camada faz, para que outras camadas possam ser construídas em cima ou à volta dela.</p>
<p>Ao conceber uma base de dados nativa da nuvem, temos de aproveitar inteligentemente outros serviços de terceiros para reduzir a complexidade da arquitetura do sistema.</p>
<p>Parece que não podemos contornar o Paxos para evitar falhas num único ponto. No entanto, ainda podemos simplificar muito a replicação de logs, entregando a eleição do líder para os serviços Raft ou Paxos baseados em <a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>, <a href="https://github.com/bloomreach/zk-replicator">Zk</a> e <a href="https://etcd.io/">etcd</a>.</p>
<p>Por exemplo, a arquitetura <a href="https://rockset.com/">Rockset</a> segue o princípio da boneca russa e utiliza Kafka/Kineses para registos distribuídos, S3 para armazenamento e cache SSD local para melhorar o desempenho das consultas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura Rockset</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">A abordagem do Milvus</h3><p>A consistência ajustável no Milvus é de facto semelhante às leituras seguidoras na replicação baseada no consenso. A funcionalidade de leitura de seguidores refere-se à utilização de réplicas de seguidores para efetuar tarefas de leitura de dados sob a premissa de uma forte consistência. O objetivo é aumentar o rendimento do cluster e reduzir a carga no líder. O mecanismo subjacente à função de leitura do seguidor consiste em inquirir o índice de confirmação do registo mais recente e fornecer o serviço de consulta até que todos os dados do índice de confirmação sejam aplicados às máquinas de estado.</p>
<p>No entanto, a conceção do Milvus não adoptou a estratégia de leitura seguidora. Por outras palavras, o Milvus não consulta o índice de confirmação sempre que recebe um pedido de consulta. Em vez disso, o Milvus adopta um mecanismo como a marca de água no <a href="https://flink.apache.org/">Flink</a>, que notifica o nó de consulta da localização do índice de confirmação num intervalo regular. A razão para este mecanismo é que os utilizadores do Milvus normalmente não exigem muito da consistência dos dados e podem aceitar um compromisso na visibilidade dos dados para melhorar o desempenho do sistema.</p>
<p>Além disso, o Milvus também adopta vários microsserviços e separa o armazenamento da computação. Na <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">arquitetura Milvus</a>, o S3, o MinIo e o Azure Blob são utilizados para armazenamento.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura Milvus</span> </span></p>
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
    </button></h2><p>Atualmente, um número crescente de bases de dados nativas da nuvem está a tornar a replicação de registos um serviço individual. Ao fazê-lo, o custo de adicionar réplicas só de leitura e replicação heterogénea pode ser reduzido. A utilização de vários microsserviços permite a rápida utilização de infra-estruturas maduras baseadas na nuvem, o que é impossível para as bases de dados tradicionais. Um serviço de registo individual pode confiar na replicação baseada no consenso, mas também pode seguir a estratégia da boneca russa para adotar vários protocolos de consistência em conjunto com o Paxos ou o Raft para alcançar a linearização.</p>
<h2 id="References" class="common-anchor-header">Referências<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Lamport L. Paxos tornado simples[J]. ACM SIGACT News (Coluna de Computação Distribuída) 32, 4 (Número inteiro 121, dezembro de 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. Em busca de um algoritmo de consenso compreensível[C]//2014 Conferência Técnica Anual da USENIX (Usenix ATC 14). 2014: 305-319.</li>
<li>Oki B M, Liskov B H. Replicação com carimbo de vista: A new primary copy method to support highly-available distributed systems[C]//Proceedings of the seventh annual ACM Symposium on Principles of distributed computing. 1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L, et al. PacificA: Replicação em sistemas de armazenamento distribuído baseados em registos[J]. 2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora: Sobre como evitar o consenso distribuído para i/os, commits e alterações de membros[C]//Proceedings of the 2018 International Conference on Management of Data. 2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al. Socrates: O novo servidor sql na nuvem[C]//Proceedings of the 2019 International Conference on Management of Data. 2019: 1743-1756.</li>
</ul>
