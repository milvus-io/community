---
id: deep-dive-5-real-time-query.md
title: Utilização da base de dados de vectores Milvus para consultas em tempo real
author: Xi Ge
date: 2022-04-11T00:00:00.000Z
desc: Saiba mais sobre o mecanismo subjacente à consulta em tempo real no Milvus.
cover: assets.zilliz.com/deep_dive_5_5e9175c7f7.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-5-real-time-query.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_dive_5_5e9175c7f7.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<blockquote>
<p>Este artigo foi escrito por <a href="https://github.com/xige-16">Xi Ge</a> e transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>No post anterior, falámos sobre a <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">inserção e persistência</a> de <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">dados</a> no Milvus. Neste artigo, vamos continuar a explicar como <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">os diferentes componentes</a> do Milvus interagem entre si para completar a consulta de dados em tempo real.</p>
<p><em>Alguns recursos úteis antes de começar estão listados abaixo. Recomendamos que os leia primeiro para compreender melhor o tópico deste artigo.</em></p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Mergulho profundo na arquitetura do Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">Modelo de dados do Milvus</a></li>
<li><a href="https://milvus.io/docs/v2.0.x/four_layers.md">O papel e a função de cada componente do Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Processamento de dados em Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Inserção e persistência de dados em Milvus</a></li>
</ul>
<h2 id="Load-data-to-query-node" class="common-anchor-header">Carregar dados para o nó de consulta<button data-href="#Load-data-to-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de uma consulta ser executada, os dados têm de ser carregados para os nós de consulta.</p>
<p>Existem dois tipos de dados que são carregados para o nó de consulta: dados de streaming do <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Log-broker">broker de registos</a> e dados históricos do <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Object-storage">armazenamento de objectos</a> (também designado por armazenamento persistente abaixo).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flowchart_b1c51dfdaa.png" alt="Flowchart" class="doc-image" id="flowchart" />
   </span> <span class="img-wrapper"> <span>Fluxograma</span> </span></p>
<p>A coordenação de dados é responsável pelo tratamento dos dados em fluxo contínuo que são continuamente introduzidos no Milvus. Quando um utilizador do Milvus chama <code translate="no">collection.load()</code> para carregar uma coleção, o coordenador de consulta consulta o coordenador de dados para saber quais os segmentos que foram persistidos no armazenamento e os seus pontos de controlo correspondentes. Um ponto de controlo é uma marca que indica que os segmentos persistidos antes do ponto de controlo são consumidos e que os segmentos após o ponto de controlo não o são.</p>
<p>Em seguida, a coordenada de consulta produz a estratégia de atribuição com base na informação da coordenada de dados: por segmento ou por canal. O alocador de segmentos é responsável pela alocação de segmentos no armazenamento persistente (dados em lote) para diferentes nós de consulta. Por exemplo, na imagem acima, o alocador de segmentos atribui os segmentos 1 e 3 (S1, S3) ao nó de consulta 1, e os segmentos 2 e 4 (S2, S4) ao nó de consulta 2. O alocador de canais atribui diferentes nós de consulta para assistir a múltiplos <a href="https://milvus.io/docs/v2.0.x/data_processing.md#Data-insertion">canais</a> de manipulação de dados (DMChannels) no corretor de registo. Por exemplo, na imagem acima, o alocador de canais atribui o nó de consulta 1 para observar o canal 1 (Ch1) e o nó de consulta 2 para observar o canal 2 (Ch2).</p>
<p>Com a estratégia de atribuição, cada nó de consulta carrega os dados do segmento e observa os canais em conformidade. No nó de consulta 1 da imagem, os dados históricos (dados de lote) são carregados através dos S1 e S3 atribuídos a partir do armazenamento persistente. Entretanto, o nó de consulta 1 carrega dados incrementais (dados em fluxo contínuo), subscrevendo o canal 1 no corretor de registos.</p>
<h2 id="Data-management-in-query-node" class="common-anchor-header">Gestão de dados no nó de consulta<button data-href="#Data-management-in-query-node" class="anchor-icon" translate="no">
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
    </button></h2><p>Um nó de consulta precisa de gerir os dados históricos e incrementais. Os dados históricos são armazenados em <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Sealed-segment">segmentos selados</a>, enquanto os dados incrementais são armazenados em <a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md#Growing-segment">segmentos crescentes</a>.</p>
<h3 id="Historical-data-management" class="common-anchor-header">Gestão de dados históricos</h3><p>Há principalmente duas considerações para a gestão de dados históricos: equilíbrio de carga e failover do nó de consulta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_balance_c77e22bb5c.png" alt="Load balance" class="doc-image" id="load-balance" />
   </span> <span class="img-wrapper"> <span>Equilíbrio de carga</span> </span></p>
<p>Por exemplo, como mostra a ilustração, ao nó de consulta 4 foram atribuídos mais segmentos selados do que aos restantes nós de consulta. Muito provavelmente, este facto fará com que o nó de consulta 4 seja o ponto de estrangulamento que torna mais lento todo o processo de consulta. Para resolver este problema, o sistema precisa de atribuir vários segmentos no nó de consulta 4 a outros nós de consulta. A isto chama-se equilíbrio de carga.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Query_node_failover_3278c0e307.png" alt="Query node failover" class="doc-image" id="query-node-failover" />
   </span> <span class="img-wrapper"> <span>Failover do nó de consulta</span> </span></p>
<p>Outra situação possível é ilustrada na imagem acima. Um dos nós, o nó de consulta 4, é subitamente desativado. Neste caso, a carga (segmentos atribuídos ao nó de consulta 4) tem de ser transferida para outros nós de consulta em funcionamento para garantir a exatidão dos resultados da consulta.</p>
<h3 id="Incremental-data-management" class="common-anchor-header">Gestão incremental dos dados</h3><p>O nó de consulta observa os DMChannels para receber dados incrementais. O fluxograma é introduzido neste processo. Em primeiro lugar, filtra todas as mensagens de inserção de dados. Isto é para garantir que apenas os dados de uma partição específica são carregados. Cada coleção no Milvus tem um canal correspondente, que é partilhado por todas as partições dessa coleção. Por conseguinte, é necessário um fluxograma para filtrar os dados inseridos se um utilizador do Milvus só precisar de carregar dados de uma determinada partição. Caso contrário, os dados de todas as partições da coleção serão carregados no nó de consulta.</p>
<p>Depois de serem filtrados, os dados incrementais são inseridos em segmentos crescentes e passados para os nós de tempo do servidor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/flow_graph_dc58651367.png" alt="Flowgraph" class="doc-image" id="flowgraph" />
   </span> <span class="img-wrapper"> <span>Fluxograma</span> </span></p>
<p>Durante a inserção de dados, é atribuído um carimbo de data/hora a cada mensagem de inserção. No DMChannel mostrado na imagem acima, os dados são inseridos por ordem, da esquerda para a direita. O carimbo de data/hora da primeira mensagem de inserção é 1; o da segunda, 2; e o da terceira, 6. A quarta mensagem marcada a vermelho não é uma mensagem de inserção, mas sim uma mensagem de marcação de tempo. Isto significa que os dados inseridos cujos carimbos de data/hora são inferiores a este carimbo de data/hora já se encontram no corretor de registo. Por outras palavras, os dados inseridos após esta mensagem de timetick devem todos ter carimbos de data/hora cujos valores são superiores a este timetick. Por exemplo, na imagem acima, quando o nó de consulta percebe que a marca de tempo atual é 5, isso significa que todas as mensagens de inserção cujo valor da marca de tempo é inferior a 5 são carregadas para o nó de consulta.</p>
<p>O nó de tempo do servidor fornece um valor <code translate="no">tsafe</code> atualizado sempre que recebe uma marca temporal do nó de inserção. <code translate="no">tsafe</code> significa tempo de segurança e todos os dados inseridos antes deste momento podem ser consultados. Por exemplo, se <code translate="no">tsafe</code> = 9, todos os dados inseridos com carimbos de data/hora inferiores a 9 podem ser consultados.</p>
<h2 id="Real-time-query-in-Milvus" class="common-anchor-header">Consulta em tempo real em Milvus<button data-href="#Real-time-query-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>A consulta em tempo real no Milvus é activada por mensagens de consulta. As mensagens de consulta são inseridas no corretor de registos por proxy. Em seguida, os nós de consulta obtêm as mensagens de consulta observando o canal de consulta no broker de registo.</p>
<h3 id="Query-message" class="common-anchor-header">Mensagem de consulta</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_message_4d57814f47.png" alt="Query message" class="doc-image" id="query-message" />
   </span> <span class="img-wrapper"> <span>Mensagem de consulta</span> </span></p>
<p>Uma mensagem de consulta inclui as seguintes informações cruciais sobre uma consulta:</p>
<ul>
<li><code translate="no">msgID</code>: ID da mensagem, o ID da mensagem de consulta atribuído pelo sistema.</li>
<li><code translate="no">collectionID</code>: O ID da coleção a consultar (se especificado pelo utilizador).</li>
<li><code translate="no">execPlan</code>: O plano de execução é utilizado principalmente para a filtragem de atributos numa consulta.</li>
<li><code translate="no">service_ts</code>: O carimbo de data/hora do serviço será atualizado juntamente com <code translate="no">tsafe</code> mencionado acima. O carimbo de data/hora do serviço indica em que ponto está o serviço. Todos os dados inseridos antes de <code translate="no">service_ts</code> estão disponíveis para consulta.</li>
<li><code translate="no">travel_ts</code>: O carimbo de data/hora da viagem especifica um intervalo de tempo no passado. E a consulta será efectuada sobre os dados existentes no período de tempo especificado por <code translate="no">travel_ts</code>.</li>
<li><code translate="no">guarantee_ts</code>: O carimbo de data/hora de garantia especifica um período de tempo após o qual a consulta tem de ser efectuada. A consulta só será efectuada quando <code translate="no">service_ts</code> &gt; <code translate="no">guarantee_ts</code>.</li>
</ul>
<h3 id="Real-time-query" class="common-anchor-header">Consulta em tempo real</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_process_7f676972d8.png" alt="Query process" class="doc-image" id="query-process" />
   </span> <span class="img-wrapper"> <span>Processo de consulta</span> </span></p>
<p>Quando é recebida uma mensagem de consulta, o Milvus começa por verificar se o tempo de serviço atual, <code translate="no">service_ts</code>, é superior ao carimbo de garantia, <code translate="no">guarantee_ts</code>, indicado na mensagem de consulta. Em caso afirmativo, a consulta é executada. A consulta é efectuada em paralelo com os dados históricos e os dados incrementais. Uma vez que pode haver uma sobreposição de dados entre dados de fluxo contínuo e dados em lote, é necessária uma ação denominada "redução local" para filtrar os resultados redundantes da consulta.</p>
<p>No entanto, se o tempo de serviço atual for inferior ao carimbo de data/hora de garantia numa mensagem de consulta recentemente inserida, a mensagem de consulta tornar-se-á uma mensagem não resolvida e aguardará para ser processada até que o tempo de serviço se torne superior ao carimbo de data/hora de garantia.</p>
<p>Os resultados da consulta são finalmente enviados para o canal de resultados. O proxy obtém os resultados da consulta a partir desse canal. Da mesma forma, o proxy também efectua uma "redução global" porque recebe resultados de vários nós de consulta e os resultados da consulta podem ser repetitivos.</p>
<p>Para garantir que o proxy recebeu todos os resultados da consulta antes de os devolver ao SDK, a mensagem de resultado mantém também um registo de informações, incluindo os segmentos selados pesquisados, os DMChannels pesquisados e os segmentos selados globais (todos os segmentos em todos os nós de consulta). O sistema só pode concluir que o proxy recebeu todos os resultados da consulta se ambas as condições seguintes forem satisfeitas:</p>
<ul>
<li>A união de todos os segmentos selados pesquisados registados em todas as mensagens de resultados é maior do que os segmentos selados globais,</li>
<li>Todos os DMChannels da coleção são consultados.</li>
</ul>
<p>Por fim, o proxy retorna os resultados finais após a "redução global" para o Milvus SDK.</p>
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
