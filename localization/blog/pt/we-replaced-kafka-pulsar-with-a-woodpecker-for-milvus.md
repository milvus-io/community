---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: Substituímos o Kafka/Pulsar por um pica-pau para Milvus - eis o que aconteceu
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  Criámos o Woodpecker, um sistema WAL nativo da nuvem, para substituir o Kafka
  e o Pulsar no Milvus, para reduzir a complexidade e o custo operacional.
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>TL;DR:</strong> Construímos o Woodpecker, um sistema de Write-Ahead Logging (WAL) nativo da nuvem, para substituir o Kafka e o Pulsar no Milvus 2.6. O resultado? Operações simplificadas, melhor desempenho e custos mais baixos para nosso banco de dados vetorial Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">O ponto de partida: Quando as filas de mensagens não servem mais<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>Nós adorávamos e usávamos o Kafka e o Pulsar. Eles funcionavam até não funcionarem mais. À medida que o Milvus, o principal banco de dados vetorial de código aberto, evoluiu, descobrimos que essas poderosas filas de mensagens não atendiam mais aos nossos requisitos de escalabilidade. Então, fizemos uma jogada ousada: reescrevemos o backbone de streaming no Milvus 2.6 e implementamos nosso próprio WAL - <strong>Woodpecker</strong>.</p>
<p>Deixe-me guiá-lo através de nossa jornada e explicar por que fizemos essa mudança, que pode parecer contra-intuitiva à primeira vista.</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">Nativo da nuvem desde o primeiro dia<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus tem sido um banco de dados vetorial nativo da nuvem desde o seu início. Aproveitamos o Kubernetes para escalonamento elástico e recuperação rápida de falhas, juntamente com soluções de armazenamento de objetos como Amazon S3 e MinIO para persistência de dados.</p>
<p>Essa abordagem que prioriza a nuvem oferece enormes vantagens, mas também apresenta alguns desafios:</p>
<ul>
<li><p>Os serviços de armazenamento de objectos na nuvem, como o S3, oferecem uma capacidade praticamente ilimitada de processamento e disponibilidade, mas com latências frequentemente superiores a 100 ms.</p></li>
<li><p>Os modelos de preços desses serviços (baseados em padrões e frequência de acesso) podem adicionar custos inesperados às operações de banco de dados em tempo real.</p></li>
<li><p>O equilíbrio entre as caraterísticas nativas da nuvem e as exigências da pesquisa vetorial em tempo real introduz desafios arquitectónicos significativos.</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">A arquitetura de log compartilhado: Nossa base<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Muitos sistemas de pesquisa vetorial se restringem ao processamento em lote porque a construção de um sistema de streaming em um ambiente nativo da nuvem apresenta desafios ainda maiores. Em contraste, o Milvus prioriza a atualização de dados em tempo real e implementa uma arquitetura de log compartilhada - pense nela como um disco rígido para um sistema de arquivos.</p>
<p>Esta arquitetura de registo partilhado fornece uma base crítica que separa os protocolos de consenso da funcionalidade principal da base de dados. Ao adotar esta abordagem, a Milvus elimina a necessidade de gerir diretamente protocolos de consenso complexos, permitindo-nos concentrarmo-nos em fornecer capacidades de pesquisa vetorial excepcionais.</p>
<p>Não estamos sozinhos neste padrão arquitetónico - bases de dados como a AWS Aurora, Azure Socrates e Neon utilizam um design semelhante. <strong>No entanto, continua a existir uma lacuna significativa no ecossistema de código aberto: apesar das claras vantagens desta abordagem, a comunidade carece de uma implementação de registo de escrita antecipada (WAL) distribuída de baixa latência, escalável e económica.</strong></p>
<p>As soluções existentes, como Bookie, provaram ser inadequadas para as nossas necessidades devido ao seu design de cliente pesado e à ausência de SDKs prontos para produção para Golang e C++. Essa lacuna tecnológica nos levou à nossa abordagem inicial com filas de mensagens.</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">Nossa solução inicial: Filas de mensagens como WAL<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Para preencher essa lacuna, nossa abordagem inicial utilizou filas de mensagens (Kafka/Pulsar) como nosso log de gravação antecipada (WAL). A arquitetura funcionava da seguinte forma:</p>
<ul>
<li><p>Todas as actualizações em tempo real que chegam fluem através da fila de mensagens.</p></li>
<li><p>Os escritores recebem confirmação imediata quando são aceites pela fila de mensagens.</p></li>
<li><p>O QueryNode e o DataNode processam esses dados de forma assíncrona, garantindo um alto rendimento de gravação e mantendo a atualização dos dados</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Visão geral da arquitetura do Milvus 2.0</p>
<p>Este sistema forneceu efetivamente uma confirmação imediata da escrita, permitindo simultaneamente o processamento assíncrono dos dados, o que foi crucial para manter o equilíbrio entre o débito e a frescura dos dados que os utilizadores do Milvus esperam.</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">Por que precisávamos de algo diferente para o WAL<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o Milvus 2.6, decidimos eliminar gradualmente as filas de mensagens externas em favor do Woodpecker, nossa implementação de WAL nativa da nuvem criada especificamente. Esta não foi uma decisão que tomamos de ânimo leve. Afinal, usamos com sucesso o Kafka e o Pulsar por anos.</p>
<p>O problema não era com essas tecnologias em si - ambas são excelentes sistemas com recursos poderosos. Em vez disso, o desafio veio da crescente complexidade e sobrecarga que esses sistemas externos introduziram à medida que a Milvus evoluiu. À medida que os nossos requisitos se tornavam mais especializados, o fosso entre o que as filas de mensagens de uso geral ofereciam e o que a nossa base de dados vetorial precisava continuava a aumentar.</p>
<p>Três factores específicos acabaram por determinar a nossa decisão de construir um substituto:</p>
<h3 id="Operational-Complexity" class="common-anchor-header">Complexidade operacional</h3><p>Dependências externas, como Kafka ou Pulsar, exigem máquinas dedicadas com vários nós e gerenciamento cuidadoso de recursos. Isso cria vários desafios:</p>
<ul>
<li>Aumento da complexidade operacional</li>
</ul>
<ul>
<li>Curvas de aprendizagem mais acentuadas para administradores de sistemas</li>
</ul>
<ul>
<li>Maiores riscos de erros de configuração e vulnerabilidades de segurança</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">Restrições de arquitetura</h3><p>As filas de mensagens como o Kafka têm limitações inerentes ao número de tópicos suportados. Desenvolvemos o VShard como uma solução alternativa para a partilha de tópicos entre componentes, mas esta solução - apesar de responder eficazmente às necessidades de escalonamento - introduziu uma complexidade arquitetónica significativa.</p>
<p>Essas dependências externas dificultaram a implementação de recursos críticos - como a coleta de lixo de log - e aumentaram o atrito de integração com outros módulos do sistema. Com o tempo, a incompatibilidade arquitetônica entre as filas de mensagens de uso geral e as demandas específicas de alto desempenho de um banco de dados vetorial tornou-se cada vez mais clara, levando-nos a reavaliar nossas escolhas de projeto.</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">Ineficiência de recursos</h3><p>Garantir alta disponibilidade com sistemas como Kafka e Pulsar normalmente exige</p>
<ul>
<li><p>Implantação distribuída em vários nós</p></li>
<li><p>Alocação substancial de recursos, mesmo para cargas de trabalho menores</p></li>
<li><p>Armazenamento de sinais efémeros (como o Timetick da Milvus), que não requerem retenção a longo prazo</p></li>
</ul>
<p>No entanto, estes sistemas não têm a flexibilidade necessária para contornar a persistência de tais sinais transitórios, o que leva a operações de E/S e utilização de armazenamento desnecessárias. Isso leva a uma sobrecarga desproporcional de recursos e a um aumento de custos - especialmente em ambientes de menor escala ou com recursos limitados.</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">Apresentando o Woodpecker - um mecanismo WAL de alto desempenho e nativo da nuvem<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>No Milvus 2.6, substituímos o Kafka/Pulsar pelo <strong>Woodpecker</strong>, um sistema WAL nativo da nuvem criado especificamente para esse fim. Projetado para armazenamento de objetos, o Woodpecker simplifica as operações enquanto aumenta o desempenho e a escalabilidade.</p>
<p>O Woodpecker foi criado desde o início para maximizar o potencial do armazenamento nativo da nuvem, com um objetivo focado: tornar-se a solução WAL de maior rendimento otimizada para ambientes de nuvem e, ao mesmo tempo, fornecer os principais recursos necessários para um log de gravação antecipada somente de anexos.</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">A arquitetura de disco zero do Woodpecker</h3><p>A principal inovação do Woodpecker é sua <strong>arquitetura Zero-Disk</strong>:</p>
<ul>
<li><p>Todos os dados de registo armazenados em armazenamento de objectos na nuvem (como o Amazon S3, o Google Cloud Storage ou o Alibaba OS)</p></li>
<li><p>Metadados geridos através de armazenamentos de valores chave distribuídos como o etcd</p></li>
<li><p>Sem dependências de disco local para operações principais</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura:  Visão geral da arquitetura do Woodpecker</p>
<p>Essa abordagem reduz drasticamente a sobrecarga operacional, maximizando a durabilidade e a eficiência da nuvem. Ao eliminar as dependências de disco local, o Woodpecker alinha-se perfeitamente com os princípios nativos da nuvem e reduz significativamente a carga operacional dos administradores de sistemas.</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">Benchmarks de desempenho: Excedendo as expectativas</h3><p>Executamos benchmarks abrangentes para avaliar o desempenho do Woodpecker em uma configuração de nó único, cliente único e fluxo de log único. Os resultados foram impressionantes quando comparados ao Kafka e ao Pulsar:</p>
<table>
<thead>
<tr><th><strong>Sistema</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Taxa de transferência</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latência</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Para contextualizar, medimos os limites teóricos de throughput de diferentes backends de armazenamento em nossa máquina de teste:</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 MB/s</p></li>
<li><p><strong>Sistema de ficheiros local</strong>: 600-750 MB/s</p></li>
<li><p><strong>Amazon S3 (instância única do EC2)</strong>: até 1,1 GB/s</p></li>
</ul>
<p>Notavelmente, o Woodpecker alcançou consistentemente 60-80% da taxa de transferência máxima possível para cada backend - um nível de eficiência excecional para middleware.</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">Principais percepções de desempenho</h4><ol>
<li><p><strong>Modo de sistema de arquivos local</strong>: O Woodpecker atingiu 450 MB/s - 3,5 vezes mais rápido que o Kafka e 4,2 vezes mais rápido que o Pulsar - com latência ultrabaixa de apenas 1,8 ms, tornando-o ideal para implantações de nó único de alto desempenho.</p></li>
<li><p><strong>Modo de armazenamento em nuvem (S3)</strong>: Ao gravar diretamente no S3, o Woodpecker atingiu 750 MB/s (cerca de 68% do limite teórico do S3), 5,8 vezes mais rápido que o Kafka e 7 vezes mais rápido que o Pulsar. Embora a latência seja maior (166 ms), essa configuração fornece uma taxa de transferência excecional para cargas de trabalho orientadas por lote.</p></li>
<li><p><strong>Modo de armazenamento de objetos (MinIO)</strong>: Mesmo com o MinIO, o Woodpecker atingiu 71 MB/s - cerca de 65% da capacidade do MinIO. Esse desempenho é comparável ao do Kafka e do Pulsar, mas com requisitos de recursos significativamente menores.</p></li>
</ol>
<p>O Woodpecker é particularmente otimizado para gravações simultâneas e de alto volume, em que manter a ordem é fundamental. E esses resultados refletem apenas os estágios iniciais de desenvolvimento - espera-se que as otimizações em andamento na fusão de E/S, buffer inteligente e pré-busca levem o desempenho ainda mais perto dos limites teóricos.</p>
<h3 id="Design-Goals" class="common-anchor-header">Objetivos do projeto</h3><p>O Woodpecker atende às demandas em evolução das cargas de trabalho de pesquisa vetorial em tempo real por meio destes requisitos técnicos fundamentais:</p>
<ul>
<li><p>Ingestão de dados de alta taxa de transferência com persistência durável em toda a zona de disponibilidade</p></li>
<li><p>Leituras de cauda de baixa latência para assinaturas em tempo real e leituras de recuperação de alta taxa de transferência para recuperação de falhas</p></li>
<li><p>Back-ends de armazenamento conectáveis, incluindo armazenamento de objetos na nuvem e sistemas de arquivos com suporte ao protocolo NFS</p></li>
<li><p>Opções de implementação flexíveis, suportando configurações autónomas leves e clusters de grande escala para implementações Milvus multi-tenant</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">Componentes da arquitetura</h3><p>Uma implantação padrão do Woodpecker inclui os seguintes componentes.</p>
<ul>
<li><p><strong>Cliente</strong> - camada de interface para emitir solicitações de leitura e gravação</p></li>
<li><p><strong>LogStore</strong> - Gerencia o buffer de gravação de alta velocidade, uploads assíncronos para o armazenamento e compactação de logs</p></li>
<li><p><strong>Backend de armazenamento</strong> - Suporta serviços de armazenamento escaláveis e de baixo custo, como S3, GCS e sistemas de ficheiros como EFS</p></li>
<li><p><strong>ETCD</strong> - Armazena metadados e coordena o estado do registo em nós distribuídos</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">Implantações flexíveis para atender às suas necessidades específicas</h3><p>O Woodpecker oferece dois modos de implantação para atender às suas necessidades específicas:</p>
<p><strong>Modo MemoryBuffer - Leve e livre de manutenção</strong></p>
<p>O modo MemoryBuffer oferece uma opção de implantação simples e leve, na qual o Woodpecker armazena temporariamente as gravações recebidas na memória e as libera periodicamente para um serviço de armazenamento de objetos na nuvem. Os metadados são gerenciados usando o etcd para garantir consistência e coordenação. Esse modo é mais adequado para cargas de trabalho pesadas em lote em implantações de menor escala ou ambientes de produção que priorizam a simplicidade sobre o desempenho, especialmente quando a baixa latência de gravação não é crítica.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: O modo memoryBuffer</em></p>
<p><strong>Modo QuorumBuffer - otimizado para implantações de baixa latência e alta durabilidade</strong></p>
<p>O modo QuorumBuffer foi projetado para cargas de trabalho de leitura/gravação sensíveis à latência e de alta frequência que requerem capacidade de resposta em tempo real e forte tolerância a falhas. Nesse modo, o Woodpecker funciona como um buffer de gravação de alta velocidade com três réplicas de gravações de quorum, garantindo forte consistência e alta disponibilidade.</p>
<p>Uma gravação é considerada bem-sucedida quando é replicada para pelo menos dois dos três nós, normalmente concluindo em milissegundos de um dígito, após o que os dados são descarregados de forma assíncrona no armazenamento de objetos na nuvem para durabilidade de longo prazo. Esta arquitetura minimiza o estado no nó, elimina a necessidade de grandes volumes de disco locais e evita reparações complexas de anti-entropia frequentemente necessárias em sistemas tradicionais baseados em quorum.</p>
<p>O resultado é uma camada WAL simplificada e robusta, ideal para ambientes de produção de missão crítica, onde consistência, disponibilidade e recuperação rápida são essenciais.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: O modo QuorumBuffer</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">StreamingService: Criado para fluxo de dados em tempo real<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Para além do Woodpecker, o Milvus 2.6 introduz o <strong>StreamingService - um</strong>componente especializado concebido para gestão de registos, ingestão de registos e subscrição de dados de streaming.</p>
<p>Para entender como nossa nova arquitetura funciona, é importante esclarecer a relação entre esses dois componentes:</p>
<ul>
<li><p><strong>O Woodpecker</strong> é a camada de armazenamento que lida com a persistência real dos logs de gravação antecipada, fornecendo durabilidade e confiabilidade</p></li>
<li><p><strong>StreamingService</strong> é a camada de serviço que gere as operações de registo e fornece capacidades de fluxo de dados em tempo real</p></li>
</ul>
<p>Juntos, eles formam um substituto completo para as filas de mensagens externas. O Woodpecker fornece a base de armazenamento durável, enquanto o StreamingService fornece a funcionalidade de alto nível com a qual os aplicativos interagem diretamente. Essa separação de preocupações permite que cada componente seja otimizado para sua função específica, enquanto trabalha perfeitamente em conjunto como um sistema integrado.</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Adicionando o serviço de streaming ao Milvus 2.6</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Serviço de streaming adicionado à arquitetura do Milvus 2.6</p>
<p>O Serviço de Streaming é composto por três componentes principais:</p>
<p><strong>Coordenador de Streaming</strong></p>
<ul>
<li><p>Descobre os nós de streaming disponíveis através da monitorização das sessões ETCD do Milvus</p></li>
<li><p>Gerencia o status dos WALs e coleta métricas de balanceamento de carga através do ManagerService</p></li>
</ul>
<p><strong>Cliente de streaming</strong></p>
<ul>
<li><p>Consulta o AssignmentService para determinar a distribuição do segmento WAL pelos nós de streaming</p></li>
<li><p>Efectua operações de leitura/escrita através do HandlerService no Streaming Node apropriado</p></li>
</ul>
<p><strong>Nó de fluxo contínuo</strong></p>
<ul>
<li><p>Trata das operações reais do WAL e fornece capacidades de publicação-assinatura para fluxo de dados em tempo real</p></li>
<li><p>Inclui o <strong>ManagerService</strong> para administração do WAL e relatórios de desempenho</p></li>
<li><p>Inclui o <strong>HandlerService</strong> que implementa mecanismos eficientes de publicação-subscrição para entradas WAL</p></li>
</ul>
<p>Esta arquitetura em camadas permite ao Milvus manter uma separação clara entre a funcionalidade de fluxo contínuo (subscrição, processamento em tempo real) e os mecanismos de armazenamento reais. O Woodpecker trata do "como" do armazenamento de registos, enquanto o StreamingService gere o "o quê" e o "quando" das operações de registo.</p>
<p>Como resultado, o Streaming Service melhora significativamente as capacidades em tempo real do Milvus ao introduzir o suporte nativo de subscrição, eliminando a necessidade de filas de mensagens externas. Reduz o consumo de memória ao consolidar caches anteriormente duplicados nos caminhos de consulta e de dados, diminui a latência para leituras fortemente consistentes ao remover atrasos de sincronização assíncronos e melhora a escalabilidade e a velocidade de recuperação em todo o sistema.</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">Conclusão - Streaming em uma arquitetura de disco zero<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Gerenciar o estado é difícil. Os sistemas com estado geralmente sacrificam a elasticidade e a escalabilidade. A resposta cada vez mais aceita no design nativo da nuvem é desacoplar o estado da computação - permitindo que cada um seja escalado independentemente.</p>
<p>Em vez de reinventar a roda, delegamos a complexidade do armazenamento durável e escalável às equipas de engenharia de classe mundial por trás de serviços como o AWS S3, o Google Cloud Storage e o MinIO. Entre eles, o S3 destaca-se pela sua capacidade virtualmente ilimitada, onze noves (99,999999999%) de durabilidade, 99,99% de disponibilidade e desempenho de leitura/escrita de elevado débito.</p>
<p>Mas mesmo as arquitecturas de "disco zero" têm compensações. Os armazenamentos de objectos ainda se debatem com uma elevada latência de escrita e ineficiências de ficheiros pequenos - limitações que continuam por resolver em muitas cargas de trabalho em tempo real.</p>
<p>Para bases de dados vectoriais - especialmente as que suportam RAG de missão crítica, agentes de IA e cargas de trabalho de pesquisa de baixa latência - o acesso em tempo real e as escritas rápidas não são negociáveis. É por isso que rearquitetamos o Milvus em torno do Woodpecker e do Streaming Service. Essa mudança simplifica o sistema geral (convenhamos, ninguém quer manter uma pilha Pulsar completa dentro de um banco de dados vetorial), garante dados mais frescos, melhora a relação custo-benefício e acelera a recuperação de falhas.</p>
<p>Acreditamos que o Woodpecker é mais do que apenas um componente do Milvus - ele pode servir como um bloco de construção fundamental para outros sistemas nativos da nuvem. À medida que a infraestrutura de nuvem evolui, inovações como o S3 Express podem nos aproximar ainda mais do ideal: durabilidade entre AZs com latência de gravação de um dígito de milissegundo.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Primeiros passos com o Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.6 já está disponível. Para além do Woodpecker, apresenta dezenas de novas funcionalidades e optimizações de desempenho, como o armazenamento em camadas, o método de quantização RabbitQ e a pesquisa de texto completo melhorada e a multitenancy, abordando diretamente os desafios mais prementes da pesquisa vetorial atual: escalar de forma eficiente e manter os custos sob controlo.</p>
<p>Pronto para explorar tudo o que o Milvus oferece? Mergulhe nas nossas<a href="https://milvus.io/docs/release_notes.md"> notas de versão</a>, navegue na<a href="https://milvus.io/docs"> documentação completa</a> ou consulte os nossos<a href="https://milvus.io/blog"> blogues de funcionalidades</a>.</p>
<p>Também é bem-vindo a juntar-se à nossa <a href="https://discord.com/invite/8uyFbECzPX">comunidade Discord</a> ou a registar um problema no<a href="https://github.com/milvus-io/milvus"> GitHub</a> - estamos aqui para o ajudar a tirar o máximo partido do Milvus 2.6.</p>
