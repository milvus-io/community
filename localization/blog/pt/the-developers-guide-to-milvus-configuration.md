---
id: the-developers-guide-to-milvus-configuration.md
title: O guia do programador para a configuração do Milvus
author: Jack Li
date: 2025-04-23T00:00:00.000Z
desc: >-
  Simplifique a configuração do Milvus com o nosso guia específico. Descubra os
  principais parâmetros a ajustar para obter um melhor desempenho nas suas
  aplicações de bases de dados vectoriais.
cover: assets.zilliz.com/The_Developer_s_Guide_to_Milvus_Configuration_1519241756.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, configurations, performance, scalability, stability'
meta_title: The Developer’s Guide to Milvus Configuration
origin: 'https://milvus.io/blog/the-developers-guide-to-milvus-configuration.md'
---
<h2 id="Introduction" class="common-anchor-header">Introdução<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Enquanto programador que trabalha com o Milvus, é provável que já se tenha deparado com o assustador ficheiro de configuração <code translate="no">milvus.yaml</code> com os seus mais de 500 parâmetros. Lidar com esta complexidade pode ser um desafio quando tudo o que se pretende é otimizar o desempenho da base de dados vetorial.</p>
<p>Boas notícias: não é necessário compreender todos os parâmetros. Este guia elimina o ruído e concentra-se nas configurações críticas que realmente afetam o desempenho, destacando exatamente quais valores devem ser ajustados para seu caso de uso específico.</p>
<p>Quer esteja a criar um sistema de recomendação que necessita de consultas extremamente rápidas ou a otimizar uma aplicação de pesquisa vetorial com restrições de custos, mostrar-lhe-ei exatamente quais os parâmetros a modificar com valores práticos e testados. No final deste guia, saberá como ajustar as configurações do Milvus para obter o máximo desempenho com base em cenários de implementação do mundo real.</p>
<h2 id="Configuration-Categories" class="common-anchor-header">Categorias de configuração<button data-href="#Configuration-Categories" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mergulharmos em parâmetros específicos, vamos analisar a estrutura do arquivo de configuração. Ao trabalhar com <code translate="no">milvus.yaml</code>, você estará lidando com três categorias de parâmetros:</p>
<ul>
<li><p><strong>Configurações de componentes de dependência</strong>: Serviços externos aos quais o Milvus se conecta (<code translate="no">etcd</code>, <code translate="no">minio</code>, <code translate="no">mq</code>) - críticos para a configuração do cluster e persistência de dados</p></li>
<li><p><strong>Configurações de componentes internos</strong>: A arquitetura interna do Milvus (<code translate="no">proxy</code>, <code translate="no">queryNode</code>, etc.) - fundamental para a afinação do desempenho</p></li>
<li><p><strong>Configurações funcionais</strong>: Segurança, registo e limites de recursos - importante para implementações de produção</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Configurations_f9a7e45dce.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Dependency-Component-Configurations" class="common-anchor-header">Configurações de componentes de dependência do Milvus<button data-href="#Milvus-Dependency-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos começar com os serviços externos dos quais o Milvus depende. Estas configurações são particularmente importantes quando se passa do desenvolvimento para a produção.</p>
<h3 id="etcd-Metadata-Store" class="common-anchor-header"><code translate="no">etcd</code>: Armazenamento de Metadados</h3><p>O Milvus depende do <code translate="no">etcd</code> para a persistência de metadados e coordenação de serviços. Os parâmetros seguintes são cruciais:</p>
<ul>
<li><p><code translate="no">Etcd.endpoints</code>: Especifica o endereço do cluster etcd. Por predefinição, o Milvus lança uma instância agrupada, mas em ambientes empresariais, é melhor ligar-se a um serviço gerido <code translate="no">etcd</code> para uma melhor disponibilidade e controlo operacional.</p></li>
<li><p><code translate="no">etcd.rootPath</code>: Define o prefixo da chave para armazenar dados relacionados com o Milvus no etcd. Se estiver a operar múltiplos clusters Milvus no mesmo backend etcd, a utilização de diferentes caminhos de raiz permite um isolamento limpo dos metadados.</p></li>
<li><p><code translate="no">etcd.auth</code>: Controla as credenciais de autenticação. Milvus não habilita o etcd auth por padrão, mas se sua instância gerenciada do etcd requer credenciais, você deve especificá-las aqui.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/etcd_in_milvusyaml_dc600c6974.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="minio-Object-Storage" class="common-anchor-header"><code translate="no">minio</code>: Armazenamento de Objetos</h3><p>Apesar do nome, esta secção governa todos os clientes de serviços de armazenamento de objectos compatíveis com S3. Ela oferece suporte a provedores como AWS S3, GCS e Aliyun OSS por meio da configuração <code translate="no">cloudProvider</code>.</p>
<p>Preste atenção a estas quatro configurações principais:</p>
<ul>
<li><p><code translate="no">minio.address / minio.port</code>: Use-as para especificar o ponto de extremidade do seu serviço de armazenamento de objetos.</p></li>
<li><p><code translate="no">minio.bucketName</code>: Atribua buckets separados (ou prefixos lógicos) para evitar colisões de dados ao executar vários clusters Milvus.</p></li>
<li><p><code translate="no">minio.rootPath</code>: Permite o namespacing intra-bucket para isolamento de dados.</p></li>
<li><p><code translate="no">minio.cloudProvider</code>: Identifica o backend OSS. Para obter uma lista completa de compatibilidade, consulte a <a href="https://milvus.io/docs/product_faq.md#Where-does-Milvus-store-data">documentação do Milvus</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minio_in_milvusyaml_faa11c9fcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="mq-Message-Queue" class="common-anchor-header"><code translate="no">mq</code>: Fila de mensagens</h3><p>O Milvus usa uma fila de mensagens para propagação interna de eventos - Pulsar (padrão) ou Kafka. Preste atenção aos três parâmetros a seguir.</p>
<ol>
<li><p><code translate="no">pulsar.address/pulsar.port</code>: Defina esses valores para usar um cluster Pulsar externo.</p></li>
<li><p><code translate="no">pulsar.tenant</code>: Define o nome do locatário. Quando vários clusters Milvus partilham uma instância Pulsar, isto assegura uma separação limpa dos canais.</p></li>
<li><p><code translate="no">msgChannel.chanNamePrefix.cluster</code>: Se preferir ignorar o modelo de locatário da Pulsar, ajuste o prefixo do canal para evitar colisões.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml1_2214739c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml2_a44ff64936.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus também suporta Kafka como a fila de mensagens. Para usar o Kafka, comente as configurações específicas do Pulsar e descomente o bloco de configuração do Kafka.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mq_in_milvusyaml3_d41f44f77a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-Internal-Component-Configurations" class="common-anchor-header">Configurações de Componentes Internos do Milvus<button data-href="#Milvus-Internal-Component-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="rootCoord-Metadata-+-Timestamps" class="common-anchor-header"><code translate="no">rootCoord</code>: Metadados + Carimbos de Tempo</h3><p>O nó <code translate="no">rootCoord</code> trata das alterações de metadados (DDL/DCL) e da gestão de carimbos de data/hora.</p>
<ol>
<li><p><code translate="no">rootCoord.maxPartitionNum</code>： Define o limite superior do número de partições por coleção. Embora o limite rígido seja 1024, esse parâmetro serve principalmente como uma proteção. Para sistemas com vários inquilinos, evite usar partições como limites de isolamento - em vez disso, implemente uma estratégia de chave de inquilino que seja dimensionada para milhões de inquilinos lógicos.</p></li>
<li><p><code translate="no">rootCoord.enableActiveStandby</code>：Ativa a alta disponibilidade através da ativação de um nó em espera. Isto é fundamental, uma vez que os nós coordenadores do Milvus não são escalados horizontalmente por defeito.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/root_Coord_in_milvusyaml_9c2417dbaf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="proxy-API-Gateway-+-Request-Router" class="common-anchor-header"><code translate="no">proxy</code>: Gateway API + Router de pedidos</h3><p>O <code translate="no">proxy</code> lida com pedidos virados para o cliente, validação de pedidos e agregação de resultados.</p>
<ul>
<li><p><code translate="no">proxy.maxFieldNum</code>: Limita o número de campos (escalar + vetor) por coleção. Mantenha-o abaixo de 64 para minimizar a complexidade do esquema e reduzir a sobrecarga de E/S.</p></li>
<li><p><code translate="no">proxy.maxVectorFieldNum</code>: Controla o número de campos vetoriais em uma coleção. Milvus suporta pesquisa multimodal, mas na prática, 10 campos vetoriais é um limite superior seguro.</p></li>
<li><p><code translate="no">proxy.maxShardNum</code>Define o número de shards de ingestão. Como regra geral:</p>
<ul>
<li><p>&lt; 200M registos → 1 shard</p></li>
<li><p>200-400M registos → 2 shards</p></li>
<li><p>Escalar linearmente além disso</p></li>
</ul></li>
<li><p><code translate="no">proxy.accesslog</code>: Quando ativado, isso registra informações detalhadas da solicitação (usuário, IP, ponto de extremidade, SDK). Útil para auditoria e depuração.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/proxy_in_milvusyaml_897b33c759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="queryNode-Query-Execution" class="common-anchor-header"><code translate="no">queryNode</code>: Execução de consulta</h3><p>Trata da execução da pesquisa vetorial e do carregamento de segmentos. Preste atenção ao seguinte parâmetro.</p>
<ul>
<li><code translate="no">queryNode.mmap</code>: Alterna a E/S mapeada na memória para carregar campos escalares e segmentos. A ativação de <code translate="no">mmap</code> ajuda a reduzir o espaço de memória, mas pode degradar a latência se a E/S do disco se tornar um gargalo.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="dataCoord-Segment-+-Index-Management" class="common-anchor-header"><code translate="no">dataCoord</code>: Gerenciamento de segmento + índice</h3><p>Este parâmetro controla a segmentação de dados, a indexação, a compactação e a recolha de lixo (GC). Os principais parâmetros de configuração incluem:</p>
<ol>
<li><p><code translate="no">dataCoord.segment.maxSize</code>: Especifica o tamanho máximo de um segmento de dados na memória. Segmentos maiores geralmente significam menos segmentos totais no sistema, o que pode melhorar o desempenho da consulta, reduzindo a indexação e a sobrecarga de pesquisa. Por exemplo, alguns usuários que executam instâncias do <code translate="no">queryNode</code> com 128 GB de RAM relataram que aumentar essa configuração de 1 GB para 8 GB levou a um desempenho de consulta cerca de 4 vezes mais rápido.</p></li>
<li><p><code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Semelhante ao anterior, este parâmetro controla especificamente o tamanho máximo dos <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">índices de disco</a> (índice diskann).</p></li>
<li><p><code translate="no">dataCoord.segment.sealProportion</code>: Determina quando um segmento crescente é selado (ou seja, finalizado e indexado). O segmento é selado quando atinge <code translate="no">maxSize * sealProportion</code>. Por predefinição, com <code translate="no">maxSize = 1024MB</code> e <code translate="no">sealProportion = 0.12</code>, um segmento será selado com cerca de 123MB.</p></li>
</ol>
<ul>
<li><p>Valores mais baixos (por exemplo, 0,12) acionam o selamento mais cedo, o que pode ajudar na criação mais rápida de índices - útil em cargas de trabalho com atualizações frequentes.</p></li>
<li><p>Valores mais altos (por exemplo, 0,3 a 0,5) atrasam o selamento, reduzindo a sobrecarga de indexação - mais adequado para cenários de ingestão offline ou em lote.</p></li>
</ul>
<ol start="4">
<li><p><code translate="no">dataCoord.segment.expansionRate</code>:  Define o fator de expansão permitido durante a compactação. Milvus calcula o tamanho máximo permitido do segmento durante a compactação como <code translate="no">maxSize * expansionRate</code>.</p></li>
<li><p><code translate="no">dataCoord.gc.dropTolerance</code>: Depois que um segmento é compactado ou uma coleção é descartada, o Milvus não exclui imediatamente os dados subjacentes. Em vez disso, ele marca os segmentos para exclusão e espera que o ciclo de coleta de lixo (GC) seja concluído. Este parâmetro controla a duração desse atraso.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml1_100d98a081.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_Coord_in_milvusyaml2_7fa8c5f2c0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Other-Functional-Configurations" class="common-anchor-header">Outras Configurações Funcionais<button data-href="#Other-Functional-Configurations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="log-Observability-and-Diagnostics" class="common-anchor-header"><code translate="no">log</code>: Observabilidade e Diagnóstico</h3><p>Logging robusto é uma pedra angular de qualquer sistema distribuído, e Milvus não é exceção. Uma configuração de log bem feita não só ajuda a depurar problemas quando eles surgem, mas também garante uma melhor visibilidade da saúde e comportamento do sistema ao longo do tempo.</p>
<p>Para implementações de produção, recomendamos a integração dos registos do Milvus com ferramentas de registo e monitorização centralizadas - como o <a href="https://milvus.io/docs/configure_grafana_loki.md#Deploy-Loki">Loki</a> - para simplificar a análise e os alertas. As principais configurações incluem:</p>
<ol>
<li><p><code translate="no">log.level</code>: Controla a verbosidade da saída do registo. Para ambientes de produção, mantenha o nível <code translate="no">info</code> para capturar detalhes essenciais de tempo de execução sem sobrecarregar o sistema. Durante o desenvolvimento ou a resolução de problemas, pode mudar para <code translate="no">debug</code> para obter informações mais detalhadas sobre as operações internas. ⚠️ Tenha cuidado com o nível <code translate="no">debug</code> na produção - ele gera um grande volume de registos, que podem consumir rapidamente espaço em disco e degradar o desempenho de E/S se não for verificado.</p></li>
<li><p><code translate="no">log.file</code>: Por padrão, o Milvus grava os logs na saída padrão (stdout), o que é adequado para ambientes em contêineres onde os logs são coletados por meio de sidecars ou agentes de nó. Para ativar o registro baseado em arquivo, é possível configurar:</p></li>
</ol>
<ul>
<li><p>Tamanho máximo do arquivo antes da rotação</p></li>
<li><p>Período de retenção do arquivo</p></li>
<li><p>Número de arquivos de log de backup a serem mantidos</p></li>
</ul>
<p>Isso é útil em ambientes bare-metal ou locais em que o envio de logs stdout não está disponível.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/log_in_milvusyaml_248ead1264.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="security-Authentication-and-Access-Control" class="common-anchor-header"><code translate="no">security</code>: Autenticação e controlo de acesso</h3><p>O Milvus suporta <a href="https://milvus.io/docs/authenticate.md?tab=docker">autenticação de utilizadores</a> e <a href="https://milvus.io/docs/rbac.md">controlo de acesso baseado em funções (RBAC)</a>, ambos configurados no módulo <code translate="no">common</code>. Estas definições são essenciais para proteger ambientes multi-tenant ou qualquer implementação exposta a clientes externos.</p>
<p>Os principais parâmetros incluem:</p>
<ol>
<li><p><code translate="no">common.security.authorizationEnabled</code>: Esta opção ativa ou desactiva a autenticação e o RBAC. Está desativado por predefinição, o que significa que todas as operações são permitidas sem verificações de identidade. Para impor um controlo de acesso seguro, defina este parâmetro para <code translate="no">true</code>.</p></li>
<li><p><code translate="no">common.security.defaultRootPassword</code>: Quando a autenticação está activada, esta definição define a palavra-passe inicial para o utilizador incorporado <code translate="no">root</code>.</p></li>
</ol>
<p>Certifique-se de que altera a palavra-passe predefinida imediatamente após ativar a autenticação para evitar vulnerabilidades de segurança em ambientes de produção.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/security_in_milvusyaml_a8d0187b5a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="quotaAndLimits-Rate-Limiting-and-Write-Control" class="common-anchor-header"><code translate="no">quotaAndLimits</code>: Limitação da taxa e controlo de escrita</h3><p>A secção <code translate="no">quotaAndLimits</code> em <code translate="no">milvus.yaml</code> desempenha um papel crítico no controlo da forma como os dados fluem através do sistema. Ela governa os limites de taxa para operações como inserções, exclusões, descargas e consultas - garantindo a estabilidade do cluster sob cargas de trabalho pesadas e evitando a degradação do desempenho devido à amplificação de gravação ou compactação excessiva.</p>
<p>Os principais parâmetros incluem:</p>
<p><code translate="no">quotaAndLimits.flushRate.collection</code>: Controla a frequência com que o Milvus faz flushes de dados de uma coleção.</p>
<ul>
<li><p><strong>Valor padrão</strong>: <code translate="no">0.1</code>, o que significa que o sistema permite uma descarga a cada 10 segundos.</p></li>
<li><p>A operação de flush sela um segmento crescente e o persiste da fila de mensagens para o armazenamento de objetos.</p></li>
<li><p>A descarga muito frequente pode gerar muitos segmentos selados pequenos, o que aumenta a sobrecarga de compactação e prejudica o desempenho da consulta.</p></li>
</ul>
<p>Melhores práticas: Na maioria dos casos, deixe o Milvus lidar com isso automaticamente. Um segmento em crescimento é selado quando atinge <code translate="no">maxSize * sealProportion</code>, e os segmentos selados são descarregados a cada 10 minutos. As descargas manuais só são recomendadas após inserções em massa quando você sabe que não há mais dados chegando.</p>
<p>Tenha também em mente: <strong>a visibilidade dos dados</strong> é determinada pelo <em>nível de consistência</em> da consulta, não pelo tempo de descarga - portanto, a descarga não torna os novos dados imediatamente consultáveis.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits1_be185e571f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><code translate="no">quotaAndLimits.upsertRate</code>/<code translate="no">quotaAndLimits.deleteRate</code>: Estes parâmetros definem a taxa máxima permitida para as operações de upsert e delete.</p>
<ul>
<li><p>O Milvus baseia-se numa arquitetura de armazenamento LSM-Tree, o que significa que as actualizações e eliminações frequentes desencadeiam a compactação. Isso pode consumir muitos recursos e reduzir a taxa de transferência geral se não for gerenciado com cuidado.</p></li>
<li><p>Recomenda-se limitar <code translate="no">upsertRate</code> e <code translate="no">deleteRate</code> a <strong>0,5 MB/s</strong> para evitar sobrecarregar o pipeline de compactação.</p></li>
</ul>
<p>Precisa de atualizar rapidamente um grande conjunto de dados? Use uma estratégia de alias de coleção:</p>
<ul>
<li><p>Insira novos dados em uma nova coleção.</p></li>
<li><p>Quando a atualização estiver concluída, reponha o alias para a nova coleção. Isso evita a penalidade de compactação das atualizações in-loco e permite a troca instantânea.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/quota_And_Limits2_32c8640190.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Real-World-Configuration-Examples" class="common-anchor-header">Exemplos de configuração do mundo real<button data-href="#Real-World-Configuration-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos percorrer dois cenários de implantação comuns para ilustrar como as definições de configuração do Milvus podem ser ajustadas para atender a diferentes objetivos operacionais.</p>
<h3 id="⚡-Example-1-High-Performance-Configuration" class="common-anchor-header">Exemplo 1: Configuração de alto desempenho</h3><p>Quando a latência da consulta é crítica para a missão - pense em mecanismos de recomendação, plataformas de pesquisa semântica ou pontuação de risco em tempo real - cada milissegundo conta. Nesses casos de uso, você normalmente se apoia em índices baseados em gráficos, como <strong>HNSW</strong> ou <strong>DISKANN</strong>, e otimiza o uso da memória e o comportamento do ciclo de vida do segmento.</p>
<p>Principais estratégias de ajuste:</p>
<ul>
<li><p>Aumente <code translate="no">dataCoord.segment.maxSize</code> e <code translate="no">dataCoord.segment.diskSegmentMaxSize</code>: Aumente esses valores para 4 GB ou até 8 GB, dependendo da RAM disponível. Segmentos maiores reduzem o número de construções de índice e melhoram o rendimento da consulta, minimizando o fanout do segmento. No entanto, segmentos maiores consomem mais memória no momento da consulta - portanto, certifique-se de que as instâncias <code translate="no">indexNode</code> e <code translate="no">queryNode</code> tenham espaço suficiente.</p></li>
<li><p>Reduzir <code translate="no">dataCoord.segment.sealProportion</code> e <code translate="no">dataCoord.segment.expansionRate</code>: Almeje um tamanho de segmento crescente em torno de 200 MB antes de selar. Isso mantém o uso da memória do segmento previsível e reduz a carga sobre o Delegator (o líder do queryNode que coordena a pesquisa distribuída).</p></li>
</ul>
<p>Regra de ouro: Prefira segmentos menores e maiores quando a memória for abundante e a latência for uma prioridade. Seja conservador com os limites de selagem se a atualização do índice for importante.</p>
<h3 id="💰-Example-2-Cost-Optimized-Configuration" class="common-anchor-header">Exemplo 2: Configuração com custo otimizado</h3><p>Se você estiver priorizando a eficiência de custo em relação ao desempenho bruto - comum em pipelines de treinamento de modelos, ferramentas internas de baixo QPS ou pesquisa de imagens de cauda longa - você pode trocar a recuperação ou a latência para reduzir significativamente as demandas de infraestrutura.</p>
<p>Estratégias recomendadas:</p>
<ul>
<li><p><strong>Utilizar a quantização de índices:</strong> Tipos de índice como <code translate="no">SCANN</code>, <code translate="no">IVF_SQ8</code>, ou <code translate="no">HNSW_PQ/PRQ/SQ</code> (introduzidos no Milvus 2.5) reduzem drasticamente o tamanho do índice e o espaço de memória. Eles são ideais para cargas de trabalho em que a precisão é menos crítica do que a escala ou o orçamento.</p></li>
<li><p><strong>Adotar uma estratégia de indexação apoiada em disco:</strong> Defina o tipo de índice como <code translate="no">DISKANN</code> para permitir a pesquisa puramente baseada em disco. <strong>Habilite</strong> <code translate="no">mmap</code> para descarregamento seletivo de memória.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/query_Node_in_milvusyaml_36e1bf378a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para uma poupança extrema de memória, active <code translate="no">mmap</code> para o seguinte: <code translate="no">vectorField</code>, <code translate="no">vectorIndex</code>, <code translate="no">scalarField</code>, e <code translate="no">scalarIndex</code>. Isso descarrega grandes blocos de dados para a memória virtual, reduzindo significativamente o uso de RAM residente.</p>
<p>⚠️ Advertência: Se a filtragem escalar for uma parte importante da sua carga de trabalho de consulta, considere desativar <code translate="no">mmap</code> para <code translate="no">vectorIndex</code> e <code translate="no">scalarIndex</code>. O mapeamento de memória pode degradar o desempenho da consulta escalar em ambientes com restrições de E/S.</p>
<h4 id="Disk-usage-tip" class="common-anchor-header">Sugestão de utilização do disco</h4><ul>
<li><p>Os índices HNSW criados com <code translate="no">mmap</code> podem expandir o tamanho total dos dados em até <strong>1,8×</strong>.</p></li>
<li><p>Um disco físico de 100 GB pode, de forma realista, acomodar apenas ~50 GB de dados efectivos quando se considera a sobrecarga do índice e o armazenamento em cache.</p></li>
<li><p>Providencie sempre armazenamento extra quando trabalhar com <code translate="no">mmap</code>, especialmente se também guardar em cache os vectores originais localmente.</p></li>
</ul>
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
    </button></h2><p>Ajustar o Milvus não é perseguir números perfeitos - é moldar o sistema em torno do comportamento real da sua carga de trabalho. As otimizações mais impactantes geralmente vêm do entendimento de como o Milvus lida com I/O, ciclo de vida do segmento e indexação sob pressão. Estes são os caminhos onde a má configuração prejudica mais - e onde o ajuste cuidadoso produz os maiores retornos.</p>
<p>Se você é novo no Milvus, os parâmetros de configuração que cobrimos cobrirão 80-90% das suas necessidades de desempenho e estabilidade. Comece por aí. Assim que tiver criado alguma intuição, aprofunde-se nas especificações completas do <code translate="no">milvus.yaml</code> e na documentação oficial - descobrirá controlos de pormenor que podem levar a sua implementação de funcional a excecional.</p>
<p>Com as configurações corretas, estará pronto para criar sistemas de pesquisa vetorial escaláveis e de elevado desempenho que se alinham com as suas prioridades operacionais - quer isso signifique um serviço de baixa latência, armazenamento rentável ou cargas de trabalho analíticas de elevado teste.</p>
