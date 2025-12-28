---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Como atualizar com segurança do Milvus 2.5.x para o Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/Milvus_2_5_x_to_Milvus_2_6_x_cd2a5397fc.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  Explore o que há de novo no Milvus 2.6, incluindo mudanças na arquitetura e
  recursos principais, e saiba como fazer uma atualização contínua do Milvus
  2.5.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>O Milvus 2.6</strong></a> já está no ar há algum tempo e está a provar ser um sólido passo em frente para o projeto. O lançamento traz uma arquitetura refinada, um melhor desempenho em tempo real, um menor consumo de recursos e um comportamento de escalonamento mais inteligente em ambientes de produção. Muitas dessas melhorias foram moldadas diretamente pelo feedback dos usuários, e os primeiros usuários da versão 2.6.x já relataram uma busca visivelmente mais rápida e um desempenho mais previsível do sistema sob cargas de trabalho pesadas ou dinâmicas.</p>
<p>Para as equipas que utilizam o Milvus 2.5.x e estão a avaliar uma mudança para a versão 2.6.x, este guia é o seu ponto de partida. Ele detalha as diferenças de arquitetura, destaca os principais recursos introduzidos no Milvus 2.6 e fornece um caminho de atualização prático e passo a passo, projetado para minimizar a interrupção operacional.</p>
<p>Se as suas cargas de trabalho envolvem pipelines em tempo real, pesquisa multimodal ou híbrida, ou operações vectoriais em grande escala, este blogue irá ajudá-lo a avaliar se a versão 2.6 se alinha com as suas necessidades - e, se decidir avançar, atualizar com confiança, mantendo a integridade dos dados e a disponibilidade do serviço.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Mudanças na arquitetura do Milvus 2.5 para o Milvus 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mergulhar no fluxo de trabalho de atualização em si, vamos primeiro entender como a arquitetura do Milvus muda no Milvus 2.6.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Arquitetura do Milvus 2.5</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura do Milvus 2.5</span> </span></p>
<p>No Milvus 2.5, os fluxos de trabalho de streaming e batch estavam interligados em vários nós de trabalho:</p>
<ul>
<li><p><strong>O QueryNode</strong> tratava tanto as consultas históricas <em>como</em> as incrementais (streaming).</p></li>
<li><p><strong>O DataNode</strong> tratava tanto da descarga em tempo de ingestão <em>como</em> da compactação em segundo plano dos dados históricos.</p></li>
</ul>
<p>Essa mistura de lógica em lote e em tempo real dificultava o dimensionamento independente das cargas de trabalho em lote. Isso também significava que o estado do streaming estava disperso em vários componentes, introduzindo atrasos de sincronização, complicando a recuperação de falhas e aumentando a complexidade operacional.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Arquitetura do Milvus 2.6</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura do Milvus 2.6</span> </span></p>
<p>O Milvus 2.6 introduz um <strong>StreamingNode</strong> dedicado que lida com todas as responsabilidades de dados em tempo real: consumir a fila de mensagens, escrever segmentos incrementais, servir consultas incrementais e gerenciar a recuperação baseada em WAL. Com o streaming isolado, os demais componentes assumem papéis mais limpos e mais focados:</p>
<ul>
<li><p><strong>O QueryNode</strong> agora lida <em>apenas</em> com consultas em lote em segmentos históricos.</p></li>
<li><p><strong>O DataNode</strong> agora lida <em>apenas</em> com tarefas de dados históricos, como compactação e criação de índices.</p></li>
</ul>
<p>O StreamingNode absorve todas as tarefas relacionadas com o streaming que estavam divididas entre o DataNode, o QueryNode e até mesmo o Proxy no Milvus 2.5, trazendo clareza e reduzindo a partilha de estado entre funções.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x vs Milvus 2.6.x: Comparação componente a componente</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>O que mudou</strong></th></tr>
</thead>
<tbody>
<tr><td>Serviços do coordenador</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (ou MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">A gestão de metadados e o agendamento de tarefas são consolidados num único MixCoord, simplificando a lógica de coordenação e reduzindo a complexidade distribuída.</td></tr>
<tr><td>Camada de acesso</td><td style="text-align:center">Proxy</td><td style="text-align:center">Proxy</td><td style="text-align:center">Os pedidos de escrita são encaminhados apenas através do nó de streaming para ingestão de dados.</td></tr>
<tr><td>Nós de trabalho</td><td style="text-align:center">-</td><td style="text-align:center">Nó de fluxo contínuo</td><td style="text-align:center">Nó de processamento de fluxo contínuo dedicado responsável por toda a lógica incremental (segmentos crescentes), incluindo:- Ingestão de dados incrementais- Consulta de dados incrementais- Persistência de dados incrementais no armazenamento de objectos- Escritas baseadas em fluxo- Recuperação de falhas baseada em WAL</td></tr>
<tr><td></td><td style="text-align:center">Nó de consulta</td><td style="text-align:center">Nó de consulta</td><td style="text-align:center">Nó de processamento em lote que trata apenas de consultas sobre dados históricos.</td></tr>
<tr><td></td><td style="text-align:center">Nó de dados</td><td style="text-align:center">Nó de dados</td><td style="text-align:center">Nó de processamento em lote responsável apenas por dados históricos, incluindo compactação e construção de índices.</td></tr>
<tr><td></td><td style="text-align:center">Nó de índice</td><td style="text-align:center">-</td><td style="text-align:center">O Nó de Índice é fundido com o Nó de Dados, simplificando as definições de funções e a topologia de implementação.</td></tr>
</tbody>
</table>
<p>Em suma, o Milvus 2.6 traça uma linha clara entre as cargas de trabalho em fluxo e em lote, eliminando o emaranhado de componentes cruzados visto na versão 2.5 e criando uma arquitetura mais escalável e de fácil manutenção.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Destaques dos recursos do Milvus 2.6<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de entrar no fluxo de trabalho de atualização, aqui está uma rápida olhada no que o Milvus 2.6 traz para a mesa. <strong>Esta versão concentra-se em reduzir o custo da infraestrutura, melhorar o desempenho da pesquisa e facilitar o dimensionamento de cargas de trabalho de IA grandes e dinâmicas.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">Melhorias de custo e eficiência</h3><ul>
<li><p><strong>Quantização</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>para índices primários</strong> - Um novo método de quantização de 1 bit que comprime índices vetoriais para <strong>1/32</strong> de seu tamanho original. Combinado com o reranking SQ8, ele reduz o uso de memória para ~28%, aumenta o QPS em 4× e mantém ~95% de recuperação, reduzindo significativamente os custos de hardware.</p></li>
<li><p><strong>Pesquisa de texto completo</strong><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>otimizada pelo BM25</strong></a> - Pontuação nativa do BM25 alimentada por vetores de peso de termos esparsos. A pesquisa de palavras-chave é executada <strong>de 3 a 4 vezes mais rápida</strong> (até <strong>7 vezes</strong> em alguns conjuntos de dados) em comparação com o Elasticsearch, mantendo o tamanho do índice em cerca de um terço dos dados de texto originais.</p></li>
<li><p><strong>Indexação de caminhos JSON com fragmentação de JSON</strong> - A filtragem estruturada em JSON aninhado agora é dramaticamente mais rápida e muito mais previsível. Caminhos JSON pré-indexados reduzem a latência de filtragem de <strong>140 ms → 1,5 ms</strong> (P99: <strong>480 ms → 10 ms</strong>), tornando a pesquisa vetorial híbrida + filtragem de metadados significativamente mais ágil.</p></li>
<li><p><strong>Suporte de tipo de dados expandido</strong> - Adiciona tipos de vetor Int8, campos <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">de geometria</a> (POINT / LINESTRING / POLYGON) e matriz de estruturas. Estas extensões suportam cargas de trabalho geoespaciais, modelação de metadados mais rica e esquemas mais limpos.</p></li>
<li><p><strong>Upsert para actualizações parciais</strong> - Agora é possível inserir ou atualizar entidades utilizando uma única chamada de chave primária. As actualizações parciais modificam apenas os campos fornecidos, reduzindo a amplificação da escrita e simplificando os pipelines que actualizam frequentemente os metadados ou os embeddings.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">Melhorias na pesquisa e recuperação</h3><ul>
<li><p><strong>Processamento de texto e suporte multilíngue aprimorados:</strong> Os novos tokenizadores Lindera e ICU melhoram o tratamento de texto em japonês, coreano e <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">em vários idiomas</a>. O Jieba agora suporta dicionários personalizados. O site <code translate="no">run_analyzer</code> ajuda a depurar o comportamento da tokenização e os analisadores multilíngües garantem uma pesquisa consistente em vários idiomas.</p></li>
<li><p><strong>Correspondência de texto de alta precisão:</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">A correspondência de frases</a> impõe consultas de frases ordenadas com inclinação configurável. O novo índice <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> acelera as consultas de substring e <code translate="no">LIKE</code> em campos VARCHAR e caminhos JSON, permitindo a correspondência rápida de texto parcial e difusa.</p></li>
<li><p><strong>Reranking com reconhecimento de tempo e de metadados:</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">Os classificadores de decaimento</a> (exponencial, linear, gaussiano) ajustam as pontuações usando carimbos de data/hora; <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">os classificadores de impulso</a> aplicam regras orientadas por metadados para promover ou rebaixar resultados. Ambos ajudam a ajustar o comportamento de recuperação sem alterar os dados subjacentes.</p></li>
<li><p><strong>Integração simplificada de modelos e vetorização automática:</strong> As integrações incorporadas com OpenAI, Hugging Face e outros fornecedores de incorporação permitem que o Milvus vetorize automaticamente o texto durante as operações de inserção e consulta. Não há mais pipelines de incorporação manual para casos de uso comuns.</p></li>
<li><p><strong>Atualizações de esquema online para campos escalares:</strong> Adicione novos campos escalares a coleções existentes sem tempo de inatividade ou recargas, simplificando a evolução do esquema à medida que os requisitos de metadados aumentam.</p></li>
<li><p><strong>Deteção de quase duplicatas com MinHash:</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">O MinHash</a> + LSH permite a deteção eficiente de quase duplicados em grandes conjuntos de dados sem comparações exactas dispendiosas.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">Atualizações de arquitetura e escalabilidade</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>Armazenamento em camadas</strong></a> <strong>para gerenciamento de dados quentes e frios:</strong> Separa dados quentes e frios em SSD e armazenamento de objectos; suporta carregamento parcial e preguiçoso; elimina a necessidade de carregar totalmente as colecções localmente; reduz a utilização de recursos em até 50% e acelera os tempos de carregamento de grandes conjuntos de dados.</p></li>
<li><p><strong>Serviço de streaming em tempo real:</strong> Adiciona nós de streaming dedicados integrados com Kafka/Pulsar para ingestão contínua; permite indexação imediata e disponibilidade de consulta; melhora o rendimento de gravação e acelera a recuperação de falhas para cargas de trabalho em tempo real e em rápida mudança.</p></li>
<li><p><strong>Escalabilidade e estabilidade aprimoradas:</strong> O Milvus suporta agora mais de 100.000 colecções para grandes ambientes multi-tenant. As actualizações de infraestrutura - <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (WAL de disco zero), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (IOPS/memória reduzida) e o <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a> - melhoram a estabilidade do cluster e permitem um escalonamento previsível sob cargas de trabalho pesadas.</p></li>
</ul>
<p>Para obter uma lista completa dos recursos do Milvus 2.6, consulte <a href="https://milvus.io/docs/release_notes.md">as notas de versão do Milvus</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Como atualizar do Milvus 2.5.x para o Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>Para manter o sistema o mais disponível possível durante a atualização, os clusters do Milvus 2.5 devem ser atualizados para o Milvus 2.6 na seguinte ordem.</p>
<p><strong>1. Inicie o Streaming Node primeiro</strong></p>
<p>Inicie o Streaming Node com antecedência. O novo <strong>Delegator</strong> (o componente no Query Node responsável pelo tratamento de dados de streaming) deve ser movido para o Milvus 2.6 Streaming Node.</p>
<p><strong>2. Atualizar o MixCoord</strong></p>
<p>Actualize os componentes do coordenador para o <strong>MixCoord</strong>. Durante esta etapa, o MixCoord precisa de detetar as versões dos Worker Nodes para lidar com a compatibilidade entre versões no sistema distribuído.</p>
<p><strong>3. Atualizar o Query Node</strong></p>
<p>As actualizações do Query Node são normalmente mais demoradas. Durante esta fase, os nós de dados e os nós de índice do Milvus 2.5 podem continuar a lidar com operações como Flush e construção de índices, ajudando a reduzir a pressão do lado da consulta enquanto os nós de consulta estão a ser actualizados.</p>
<p><strong>4. Atualizar o nó de dados</strong></p>
<p>Uma vez que os nós de dados do Milvus 2.5 são colocados offline, as operações de Flush tornam-se indisponíveis, e os dados em Growing Segments podem continuar a acumular-se até que todos os nós sejam totalmente actualizados para o Milvus 2.6.</p>
<p><strong>5. Atualizar o Proxy</strong></p>
<p>Depois de atualizar um Proxy para Milvus 2.6, as operações de escrita nesse Proxy permanecerão indisponíveis até que todos os componentes do cluster sejam atualizados para 2.6.</p>
<p><strong>6. Remover o nó de índice</strong></p>
<p>Depois que todos os outros componentes forem atualizados, o nó de índice autônomo poderá ser removido com segurança.</p>
<p><strong>Observações:</strong></p>
<ul>
<li><p>Desde a conclusão da atualização do DataNode até à conclusão da atualização do Proxy, as operações de Flush não estão disponíveis.</p></li>
<li><p>A partir do momento em que o primeiro Proxy é atualizado até que todos os nós Proxy sejam actualizados, algumas operações de escrita ficam indisponíveis.</p></li>
<li><p><strong>Ao atualizar diretamente do Milvus 2.5.x para o 2.6.6, as operações DDL (Data Definition Language) não estão disponíveis durante o processo de atualização devido a alterações na estrutura DDL.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Como atualizar para o Milvus 2.6 com o Milvus Operator<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">O Milvus Operator</a> é um operador Kubernetes de código aberto que fornece uma maneira escalável e altamente disponível de implantar, gerenciar e atualizar toda a pilha de serviços Milvus em um cluster Kubernetes de destino. A pilha de serviços Milvus gerida pelo operador inclui:</p>
<ul>
<li><p>Componentes principais do Milvus</p></li>
<li><p>Dependências necessárias, como etcd, Pulsar e MinIO</p></li>
</ul>
<p>O Milvus Operator segue o padrão padrão do Kubernetes Operator. Ele introduz um recurso personalizado (CR) do Milvus que descreve o estado desejado de um cluster do Milvus, como sua versão, topologia e configuração.</p>
<p>Um controlador monitoriza continuamente o cluster e reconcilia o estado atual com o estado desejado definido no CR. Quando são feitas alterações - como a atualização da versão do Milvus - o operador aplica-as automaticamente de uma forma controlada e repetível, permitindo actualizações automatizadas e uma gestão contínua do ciclo de vida.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Exemplo de recurso personalizado (CR) do Milvus</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Atualizações contínuas do Milvus 2.5 para 2.6 com o Milvus Operator</h3><p>O Milvus Operator fornece suporte integrado para <strong>atualizações contínuas do Milvus 2.5 para o 2.6</strong> no modo de cluster, adaptando seu comportamento para levar em conta as mudanças arquitetônicas introduzidas no 2.6.</p>
<p><strong>1. Deteção do Cenário de Atualização</strong></p>
<p>Durante uma atualização, o Milvus Operator determina a versão alvo do Milvus a partir da especificação do cluster. Isso é feito por</p>
<ul>
<li><p>Inspecionando a tag de imagem definida em <code translate="no">spec.components.image</code>, ou</p></li>
<li><p>Lendo a versão explícita especificada em <code translate="no">spec.components.version</code></p></li>
</ul>
<p>O operador compara então esta versão pretendida com a versão atualmente em curso, que é registada em <code translate="no">status.currentImage</code> ou <code translate="no">status.currentVersion</code>. Se a versão atual for 2.5 e a versão pretendida for 2.6, o operador identifica a atualização como um cenário de atualização 2.5 → 2.6.</p>
<p><strong>2. Ordem de execução da atualização contínua</strong></p>
<p>Quando uma atualização 2.5 → 2.6 é detectada e o modo de atualização está definido para atualização contínua (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, que é o padrão), o Milvus Operator executa automaticamente a atualização numa ordem predefinida alinhada com a arquitetura do Milvus 2.6:</p>
<p>Iniciar o Nó de Fluxo → Atualizar o MixCoord → Atualizar o Nó de Consulta → Atualizar o Nó de Dados → Atualizar o Proxy → Remover o Nó de Índice</p>
<p><strong>3. Consolidação automática de coordenadores</strong></p>
<p>O Milvus 2.6 substitui vários componentes do coordenador por um único MixCoord. O Milvus Operator trata automaticamente desta transição arquitetural.</p>
<p>Quando <code translate="no">spec.components.mixCoord</code> é configurado, o operador abre o MixCoord e aguarda até que ele esteja pronto. Assim que o MixCoord estiver totalmente operacional, o operador desliga os componentes antigos do coordenador - RootCoord, QueryCoord e DataCoord - concluindo a migração sem necessidade de qualquer intervenção manual.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Etapas de atualização do Milvus 2.5 para o 2.6</h3><p>1. atualizar o Milvus Operator para a versão mais recente (neste guia, usamos <strong>a versão 1.3.3</strong>, que era a versão mais recente no momento da redação).</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2. fundir os componentes do coordenador</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. garantir que o cluster esteja executando o Milvus 2.5.16 ou posterior</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4. atualizar o Milvus para a versão 2.6</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">Como atualizar para o Milvus 2.6 com o Helm<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao implantar o Milvus usando o Helm, todos os recursos do Kubernetes <code translate="no">Deployment</code> são atualizados em paralelo, sem uma ordem de execução garantida. Como resultado, o Helm não fornece um controlo rigoroso sobre as sequências de atualização contínua entre componentes. Para ambientes de produção, o uso do Milvus Operator é, portanto, altamente recomendado.</p>
<p>O Milvus ainda pode ser atualizado da versão 2.5 para a 2.6 usando o Helm, seguindo as etapas abaixo.</p>
<p>Requisitos do sistema</p>
<ul>
<li><p><strong>Versão do Helm:</strong> ≥ 3.14.0</p></li>
<li><p><strong>Versão do Kubernetes:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1.Atualize o gráfico do Milvus Helm para a versão mais recente. Neste guia, usamos <strong>a versão 5.0.7 do gráfico</strong>, que era a mais recente no momento da redação.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2.se o cluster for implantado com vários componentes de coordenação, primeiro atualize o Milvus para a versão 2.5.16 ou posterior e habilite o MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3 - Atualize o Milvus para a versão 2.6</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">FAQ sobre atualização e operações do Milvus 2.6<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus Helm vs. Milvus Operator - qual deles devo usar?</h3><p>Para ambientes de produção, recomenda-se vivamente a utilização do Milvus Operator.</p>
<p>Consulte o guia oficial para obter detalhes: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">Q2: Como devo escolher um Message Queue (MQ)?</h3><p>O MQ recomendado depende do modo de implementação e dos requisitos operacionais:</p>
<p><strong>1. Modo autónomo:</strong> Para implantações sensíveis ao custo, o RocksMQ é recomendado.</p>
<p><strong>2. Modo de cluster</strong></p>
<ul>
<li><p><strong>O Pulsar</strong> oferece suporte a multilocação, permite que grandes clusters compartilhem a infraestrutura e oferece forte escalabilidade horizontal.</p></li>
<li><p><strong>O Kafka</strong> tem um ecossistema mais maduro, com ofertas de SaaS gerenciadas disponíveis na maioria das principais plataformas de nuvem.</p></li>
</ul>
<p><strong>3. Woodpecker (introduzido no Milvus 2.6):</strong> O Woodpecker elimina a necessidade de uma fila de mensagens externa, reduzindo o custo e a complexidade operacional.</p>
<ul>
<li><p>Atualmente, só é suportado o modo Woodpecker incorporado, que é leve e fácil de operar.</p></li>
<li><p>Para implantações autônomas do Milvus 2.6, o Woodpecker é recomendado.</p></li>
<li><p>Para implantações de cluster de produção, recomenda-se usar o próximo modo de cluster Woodpecker assim que ele estiver disponível.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">P3: A fila de mensagens pode ser trocada durante uma atualização?</h3><p>Não. A troca da fila de mensagens durante uma atualização não é atualmente suportada. Versões futuras introduzirão APIs de gerenciamento para oferecer suporte à alternância entre Pulsar, Kafka, Woodpecker e RocksMQ.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">Q4: As configurações de limitação de taxa precisam ser atualizadas para o Milvus 2.6?</h3><p>Não. As configurações de limitação de taxa existentes permanecem efetivas e também se aplicam ao novo nó de streaming. Não são necessárias alterações.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">Q5: Após a fusão do coordenador, as funções ou configurações de monitoramento são alteradas?</h3><ul>
<li><p>As funções de monitoramento permanecem inalteradas (<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>As opções de configuração existentes continuam a funcionar como antes.</p></li>
<li><p>Uma nova opção de configuração, <code translate="no">mixCoord.enableActiveStandby</code>, é introduzida e voltará para <code translate="no">rootcoord.enableActiveStandby</code> se não for explicitamente definida.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">Q6: Quais são as configurações de recursos recomendadas para o StreamingNode?</h3><ul>
<li><p>Para ingestão leve em tempo real ou cargas de trabalho ocasionais de gravação e consulta, uma configuração menor, como 2 núcleos de CPU e 8 GB de memória, é suficiente.</p></li>
<li><p>Para ingestão pesada em tempo real ou cargas de trabalho contínuas de gravação e consulta, recomenda-se alocar recursos comparáveis aos do Query Node.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">Q7: Como faço para atualizar uma implantação autônoma usando o Docker Compose?</h3><p>Para implantações autônomas baseadas no Docker Compose, basta atualizar a tag de imagem do Milvus em <code translate="no">docker-compose.yaml</code>.</p>
<p>Consulte o guia oficial para obter detalhes: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a></p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.6 marca uma grande melhoria tanto na arquitetura quanto nas operações. Ao separar o streaming e o processamento em lote com a introdução do StreamingNode, consolidando os coordenadores no MixCoord e simplificando as funções do trabalhador, o Milvus 2.6 fornece uma base mais estável, escalável e fácil de operar para cargas de trabalho vetoriais em grande escala.</p>
<p>Essas mudanças na arquitetura tornam as atualizações - especialmente do Milvus 2.5 - mais sensíveis à ordem. Uma atualização bem-sucedida depende do respeito às dependências dos componentes e às restrições de disponibilidade temporária. Para ambientes de produção, o Milvus Operator é a abordagem recomendada, uma vez que automatiza a sequência de actualizações e reduz o risco operacional, enquanto as actualizações baseadas no Helm são mais adequadas para casos de utilização não produtivos.</p>
<p>Com recursos de pesquisa aprimorados, tipos de dados mais ricos, armazenamento em camadas e opções aprimoradas de fila de mensagens, o Milvus 2.6 está bem posicionado para oferecer suporte a aplicativos modernos de IA que exigem ingestão em tempo real, alto desempenho de consulta e operações eficientes em escala.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou arquive problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Mais recursos sobre o Milvus 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/release_notes.md">Notas de lançamento do Milvus 2.6</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Gravação do webinar do Milvus 2.6: Pesquisa mais rápida, custo mais baixo e escalonamento mais inteligente</a></p></li>
<li><p>Blogs de recursos do Milvus 2.6</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Apresentando a função de incorporação: Como o Milvus 2.6 agiliza a vetorização e a busca semântica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding em Milvus: Filtragem JSON 88.9x mais rápida com flexibilidade</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando a verdadeira recuperação em nível de entidade: Novas capacidades de Array-of-Structs e MAX_SIM no Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">Pare de pagar por dados frios: 80% de redução de custos com o carregamento de dados quentes e frios sob demanda no armazenamento em camadas do Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Apresentando o AISAQ no Milvus: a pesquisa de vetores em escala de bilhões acaba de ficar 3.200 vezes mais barata na memória</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Otimização do NVIDIA CAGRA no Milvus: Uma abordagem híbrida GPU-CPU para uma indexação mais rápida e consultas mais baratas</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Apresentando o índice Milvus Ngram: Correspondência mais rápida de palavras-chave e consultas LIKE para cargas de trabalho de agentes</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Juntando Filtragem Geoespacial e Pesquisa Vetorial com Campos Geométricos e RTREE no Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pesquisa vetorial no mundo real: como filtrar eficazmente sem prejudicar a recordação</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compressão vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem - os bancos de dados vetoriais merecem um teste real</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um Woodpecker para o Milvus - eis o que aconteceu</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH no Milvus: a arma secreta para combater duplicatas nos dados de treinamento do LLM</a></p></li>
</ul></li>
</ul>
