---
id: milvus-cdc-standby-cluster-high-availability.md
title: >-
  Alta disponibilidade da base de dados Vetor: como criar um cluster Milvus
  Standby com CDC
author: Cal Huang
date: 2026-3-26
cover: assets.zilliz.com/download_2867bc5064.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  vector database high availability, Milvus CDC, standby cluster, disaster
  recovery, change data capture
meta_title: |
  Vector Database High Availability: Milvus CDC Standby Cluster Guide
desc: >-
  Saiba como criar uma base de dados vetorial de alta disponibilidade com o
  Milvus CDC. Guia passo-a-passo para replicação primária-em espera, failover e
  DR de produção.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>Todas as bases de dados de produção precisam de um plano para quando as coisas correm mal. As bases de dados relacionais têm tido envio WAL, replicação binlog e failover automatizado há décadas. Mas <a href="https://zilliz.com/learn/what-is-a-vector-database">as bases de dados vectoriais</a> - apesar de se tornarem infra-estruturas essenciais para aplicações de IA - ainda estão a recuperar o atraso nesta frente. A maioria oferece redundância em nível de nó, na melhor das hipóteses. Se um cluster completo cair, você está restaurando a partir de backups e reconstruindo <a href="https://zilliz.com/learn/vector-index">índices vetoriais</a> do zero - um processo que pode levar horas e custar milhares em computação, porque regenerar <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> por meio de seu pipeline de ML não é barato.</p>
<p><a href="https://milvus.io/">O Milvus</a> adota uma abordagem diferente. Ele oferece alta disponibilidade em camadas: réplicas em nível de nó para failover rápido dentro de um cluster, replicação baseada em CDC para proteção em nível de cluster e entre regiões, e backup para recuperação de rede de segurança. Esse modelo em camadas é uma prática padrão em bancos de dados tradicionais - o Milvus é o primeiro grande banco de dados vetorial a trazê-lo para cargas de trabalho vetoriais.</p>
<p>Este guia cobre duas coisas: as estratégias de alta disponibilidade disponíveis para bancos de dados vetoriais (para que você possa avaliar o que "pronto para produção" realmente significa) e um tutorial prático para configurar a replicação primária-em espera do Milvus CDC a partir do zero.</p>
<blockquote>
<p>Esta é a <strong>Parte 1</strong> de uma série:</p>
<ul>
<li><strong>Parte 1</strong> (este artigo): Configurando a replicação primária-em espera em novos clusters</li>
<li><strong>Parte 2</strong>: Adicionar o CDC a um cluster existente que já tem dados, utilizando <a href="https://milvus.io/docs/milvus_backup_overview.md">o Milvus Backup</a></li>
<li><strong>Parte 3</strong>: Gerenciando o failover - promovendo o standby quando o primário cai</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">Porque é que a Alta Disponibilidade é mais importante para as Bases de Dados Vectoriais?<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando uma base de dados SQL tradicional fica inoperacional, perde-se o acesso a registos estruturados - mas os dados em si podem normalmente ser reimportados a partir de fontes a montante. Quando uma base de dados vetorial falha, a recuperação é fundamentalmente mais difícil.</p>
<p>As bases de dados vectoriais armazenam <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> - representações numéricas densas geradas por modelos de ML. Reconstruí-las significa executar novamente todo o conjunto de dados através do pipeline de incorporação: carregar documentos em bruto, dividi-los, chamar um <a href="https://zilliz.com/ai-models">modelo de incorporação</a> e reindexar tudo. Para um conjunto de dados com centenas de milhões de vectores, isto pode demorar dias e custar milhares de dólares em computação GPU.</p>
<p>Entretanto, os sistemas que dependem da <a href="https://zilliz.com/learn/what-is-vector-search">pesquisa vetorial</a> estão frequentemente no caminho crítico:</p>
<ul>
<li><strong>Os pipelines<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a></strong> que alimentam os chatbots e a pesquisa orientados para o cliente - se a base de dados de vectores estiver em baixo, a recuperação pára e a IA devolve respostas genéricas ou alucinadas.</li>
<li><strong>Motores de recomendação</strong> que fornecem sugestões de produtos ou conteúdos em tempo real - tempo de inatividade significa perda de receitas.</li>
<li>Sistemas<strong>de deteção de fraudes e de monitorização de anomalias</strong> que dependem da <a href="https://zilliz.com/glossary/similarity-search">pesquisa de semelhanças</a> para assinalar actividades suspeitas - uma lacuna na cobertura cria uma janela de vulnerabilidade.</li>
<li><strong>Sistemas de agentes autónomos</strong> que utilizam armazéns vectoriais para recuperação de memória e de ferramentas - os agentes falham ou entram em loop sem a sua base de conhecimentos.</li>
</ul>
<p>Se estiver a avaliar as bases de dados de vectores para qualquer um destes casos de utilização, a alta disponibilidade não é uma caraterística agradável de ter para verificar mais tarde. Ela deve ser uma das primeiras coisas a serem observadas.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">Como é a HA de nível de produção para uma base de dados vetorial?<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Nem toda alta disponibilidade é igual. Um banco de dados vetorial que só lida com falhas de nós em um único cluster não é "altamente disponível" da maneira que um sistema de produção exige. A HA real precisa cobrir três camadas:</p>
<table>
<thead>
<tr><th>Camada</th><th>Contra o que ela protege</th><th>Como funciona</th><th>Tempo de recuperação</th><th>Perda de dados</th></tr>
</thead>
<tbody>
<tr><td><strong>Nível de nó</strong> (multi-replicação)</td><td>Uma falha de um único nó, falha de hardware, OOM kill, falha de AZ</td><td>Copia os mesmos <a href="https://milvus.io/docs/glossary.md">segmentos de dados</a> em vários nós; outros nós absorvem a carga</td><td>Instantâneo</td><td>Zero</td></tr>
<tr><td><strong>Nível de cluster</strong> (replicação CDC)</td><td>Todo o cluster vai abaixo - má implementação do K8s, eliminação do namespace, corrupção do armazenamento</td><td>Transmite todas as escritas para um cluster em espera através do <a href="https://milvus.io/docs/four_layers.md">registo de escrita à cabeça</a>; o cluster em espera está sempre segundos atrasado</td><td>Minutos</td><td>Segundos</td></tr>
<tr><td><strong>Rede de segurança</strong> (cópia de segurança periódica)</td><td>Corrupção catastrófica de dados, ransomware, erro humano que se propaga através da replicação</td><td>Tira instantâneos periódicos e armazena-os numa localização separada</td><td>Horas</td><td>Horas (desde o último backup)</td></tr>
</tbody>
</table>
<p>Estas camadas são complementares, não alternativas. Uma implantação de produção deve empilhá-las:</p>
<ol>
<li><strong><a href="https://milvus.io/docs/replica.md">Multi-replica</a></strong><strong>primeiro</strong> - lida com a falha mais comum (falhas de nó, falhas de AZ) com tempo de inatividade zero e perda de dados zero.</li>
<li><strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a> em seguida</strong> - protege contra falhas que a multi-replicação não consegue: interrupções em todo o cluster, erro humano catastrófico. O cluster em espera está num domínio de falha diferente.</li>
<li><strong><a href="https://milvus.io/docs/milvus_backup_overview.md">Backups periódicos</a> sempre</strong> - sua rede de segurança de último recurso. Nem mesmo o CDC o pode salvar se os dados corrompidos forem replicados para o standby antes de o apanhar.</li>
</ol>
<p>Ao avaliar as bases de dados vectoriais, pergunte: qual destas três camadas é efetivamente suportada pelo produto? Atualmente, a maioria das bases de dados vectoriais apenas oferece a primeira. O Milvus suporta as três, sendo o CDC uma funcionalidade incorporada - e não um complemento de terceiros.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">O que é o Milvus CDC e como funciona?<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Milvus CDC (Change Data Capture)</strong> é um recurso de replicação integrado que lê o <a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log (WAL)</a> do cluster primário e transmite cada entrada para um cluster standby separado. O standby repete as entradas e acaba com os mesmos dados, normalmente com segundos de atraso.</p>
<p>O padrão está bem estabelecido no mundo das bases de dados. O MySQL tem a replicação binlog. O PostgreSQL tem o envio WAL. O MongoDB tem replicação baseada em oplog. Essas são técnicas comprovadas que mantiveram bancos de dados relacionais e de documentos funcionando em produção por décadas. O Milvus traz a mesma abordagem para cargas de trabalho vetoriais - é o primeiro grande <a href="https://zilliz.com/learn/what-is-a-vector-database">banco de dados vetorial</a> a oferecer replicação baseada em WAL como um recurso integrado.</p>
<p>Três propriedades tornam o CDC uma boa opção para a recuperação de desastres:</p>
<ul>
<li><strong>Sincronização de baixa latência.</strong> O CDC transmite as operações à medida que elas acontecem, não em lotes programados. O standby permanece segundos atrás do primário em condições normais.</li>
<li><strong>Repetição ordenada.</strong> As operações chegam ao standby na mesma ordem em que foram gravadas. Os dados permanecem consistentes sem reconciliação.</li>
<li><strong>Recuperação de ponto de verificação.</strong> Se o processo CDC falhar ou a rede cair, ele é retomado de onde parou. Nenhum dado é ignorado ou duplicado.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">Como funciona a arquitetura do CDC?</h3><p>Uma implantação do CDC tem três componentes:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>Arquitetura CDC mostrando o cluster de origem com nós de streaming e nós CDC consumindo o WAL, replicando dados para a camada proxy do cluster de destino, que encaminha operações DDL/DCL/DML para nós de streaming e anexa ao WAL</span> </span></p>
<table>
<thead>
<tr><th>Componente</th><th>Função</th></tr>
</thead>
<tbody>
<tr><td><strong>Cluster primário</strong></td><td>A <a href="https://milvus.io/docs/architecture_overview.md">instância</a> de produção <a href="https://milvus.io/docs/architecture_overview.md">do Milvus</a>. Todas as leituras e escritas são efectuadas aqui. Todas as escritas são registadas no WAL.</td></tr>
<tr><td><strong>Nó CDC</strong></td><td>Um processo em segundo plano ao lado do primário. Lê as entradas do WAL e encaminha-as para o standby. Funciona independentemente do caminho de leitura/escrita - sem impacto no desempenho da consulta ou da inserção.</td></tr>
<tr><td><strong>Cluster em espera</strong></td><td>Uma instância separada do Milvus que repete as entradas WAL encaminhadas. Mantém os mesmos dados que o primário, com segundos de atraso. Pode servir consultas de leitura mas não aceita escritas.</td></tr>
</tbody>
</table>
<p>O fluxo: as escritas chegam ao primário → o Nó CDC copia-as para o standby → o standby repete-as. Nada mais fala com o caminho de escrita do standby. Se o primário cair, o standby já tem quase todos os dados e pode ser promovido.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">Tutorial: Configurando um cluster Milvus CDC Standby<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>O restante deste artigo é um passo a passo prático. No final, você terá dois clusters Milvus em execução com replicação em tempo real entre eles.</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><p>Antes de começar:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a> v2.6.6 ou posterior.</strong> O CDC requer esta versão. Recomendamos o patch mais recente da versão 2.6.x.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> v1.3.4 ou posterior.</strong> Este guia usa o Operator para gerenciamento de cluster no Kubernetes.</li>
<li><strong>Um cluster Kubernetes em execução</strong> com <code translate="no">kubectl</code> e <code translate="no">helm</code> configurados.</li>
<li><strong>Python com <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong> para a etapa de configuração de replicação.</li>
</ul>
<p>Duas limitações na versão atual:</p>
<table>
<thead>
<tr><th>Limitação</th><th>Detalhes</th></tr>
</thead>
<tbody>
<tr><td>Réplica única do CDC</td><td>Uma réplica do CDC por cluster. O CDC distribuído está planeado para uma versão futura.</td></tr>
<tr><td>Sem BulkInsert</td><td>O<a href="https://milvus.io/docs/import-data.md">BulkInsert</a> não é suportado enquanto o CDC estiver ativado. Também planeado para uma versão futura.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">Etapa 1: Atualizar o Milvus Operator</h3><p>Atualize o Milvus Operator para a versão 1.3.4 ou posterior:</p>
<pre><code translate="no">helm repo add zilliztech-milvus-operator https://zilliztech.github.io/milvus-operator/
<span class="hljs-comment"># &quot;zilliztech-milvus-operator&quot; has been added to your repositories</span>

helm repo update zilliztech-milvus-operator
<span class="hljs-comment"># Hang tight while we grab the latest from your chart repositories...</span>
<span class="hljs-comment"># ...Successfully got an update from the &quot;zilliztech-milvus-operator&quot; chart repository</span>
<span class="hljs-comment"># Update Complete. ⎈Happy Helming!⎈</span>

helm -n milvus-operator upgrade milvus-operator zilliztech-milvus-operator/milvus-operator
<span class="hljs-comment"># Release &quot;milvus-operator&quot; has been upgraded. Happy Helming!</span>
<span class="hljs-comment"># NAME: milvus-operator</span>
<span class="hljs-comment"># LAST DEPLOYED: Wed Dec  3 17:25:28 2025</span>
<span class="hljs-comment"># NAMESPACE: milvus-operator</span>
<span class="hljs-comment"># STATUS: deployed</span>
<span class="hljs-comment"># REVISION: 30</span>
<span class="hljs-comment"># TEST SUITE: None</span>
<span class="hljs-comment"># NOTES:</span>
<span class="hljs-comment"># Milvus Operator Is Starting, use `kubectl get -n milvus-operator deploy/milvus-operator` to check if its successfully installed</span>
<span class="hljs-comment"># Full Installation doc can be found in https://github.com/zilliztech/milvus-operator/blob/main/docs/installation/installation.md</span>
<span class="hljs-comment"># Quick start with `kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_minimum.yaml`</span>
<span class="hljs-comment"># More samples can be found in https://github.com/zilliztech/milvus-operator/tree/main/config/samples</span>
<span class="hljs-comment"># CRD Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/CRD</span>
<span class="hljs-comment"># Administration Documentation can be found in https://github.com/zilliztech/milvus-operator/tree/main/docs/administration</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verifique se o pod do operador está em execução:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">Passo 2: Implantar o cluster primário</h3><p>Crie um ficheiro YAML para o cluster primário (fonte). A secção <code translate="no">cdc</code> em <code translate="no">components</code> diz ao Operador para implementar um Nó CDC juntamente com o cluster:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: source-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
    cdc:
      replicas: <span class="hljs-number">1</span>  <span class="hljs-comment"># Currently, CDC only supports 1 replica</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>A configuração <code translate="no">msgStreamType: woodpecker</code> usa o <a href="https://milvus.io/docs/four_layers.md">Woodpecker WAL</a> integrado do Milvus em vez de uma fila de mensagens externa como Kafka ou Pulsar. O Woodpecker é um log de gravação antecipada nativo da nuvem introduzido no Milvus 2.6 que remove a necessidade de infraestrutura de mensagens externas.</p>
<p>Aplique a configuração:</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Aguarde até que todos os pods atinjam o status Em execução. Confirmar se o pod CDC está ativo:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">Etapa 3: implantar o cluster em espera</h3><p>O cluster em espera (destino) usa a mesma versão do Milvus, mas não inclui um componente CDC - ele só recebe dados replicados:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster with cdc.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: target-cluster
  namespace: milvus
  labels:
    app: milvus
spec:
  mode: cluster
  components:
    image: milvusdb/milvus:v2<span class="hljs-number">.6</span><span class="hljs-number">.6</span> <span class="hljs-comment"># Use version 2.6.6 or above, as CDC is available from 2.6.6 onwards</span>
  dependencies:
    msgStreamType: woodpecker
<button class="copy-code-btn"></button></code></pre>
<p>Aplicar:</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verifique se todos os pods estão em execução:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">Etapa 4: Configurar a relação de replicação</h3><p>Com os dois clusters em execução, configure a topologia de replicação usando Python com <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>.</p>
<p>Defina os detalhes da conexão do cluster e os nomes do canal físico (pchannel):</p>
<pre><code translate="no">source_cluster_addr = <span class="hljs-string">&quot;http://10.98.124.90:19530&quot;</span> <span class="hljs-comment"># example address — replace with your actual Milvus server address</span>
target_cluster_addr = <span class="hljs-string">&quot;http://10.109.234.172:19530&quot;</span>
source_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
target_cluster_token = <span class="hljs-string">&quot;root:Milvus&quot;</span>
source_cluster_id = <span class="hljs-string">&quot;source-cluster&quot;</span>
target_cluster_id = <span class="hljs-string">&quot;target-cluster&quot;</span>
pchannel_num = <span class="hljs-number">16</span>

source_cluster_pchannels = []
target_cluster_pchannels = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(pchannel_num):
    source_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{source_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
    target_cluster_pchannels.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{target_cluster_id}</span>-rootcoord-dml_<span class="hljs-subst">{i}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Crie a configuração de replicação:</p>
<pre><code translate="no">config = {
    <span class="hljs-string">&quot;clusters&quot;</span>: [
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: source_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: source_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: source_cluster_pchannels
        },
        {
            <span class="hljs-string">&quot;cluster_id&quot;</span>: target_cluster_id,
            <span class="hljs-string">&quot;connection_param&quot;</span>: {
                <span class="hljs-string">&quot;uri&quot;</span>: target_cluster_addr,
                <span class="hljs-string">&quot;token&quot;</span>: target_cluster_token
            },
            <span class="hljs-string">&quot;pchannels&quot;</span>: target_cluster_pchannels
        }
    ],
    <span class="hljs-string">&quot;cross_cluster_topology&quot;</span>: [
        {
            <span class="hljs-string">&quot;source_cluster_id&quot;</span>: source_cluster_id,
            <span class="hljs-string">&quot;target_cluster_id&quot;</span>: target_cluster_id
        }
    ]
}
<button class="copy-code-btn"></button></code></pre>
<p>Aplicar em ambos os clusters:</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Quando isso for bem-sucedido, as alterações incrementais no primário começarão a ser replicadas automaticamente para o standby.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">Etapa 5: verificar se a replicação funciona</h3><ol>
<li>Conecte-se ao primário e <a href="https://milvus.io/docs/manage-collections.md">crie uma coleção</a>, <a href="https://milvus.io/docs/insert-update-delete.md">insira alguns vetores</a> e <a href="https://milvus.io/docs/load-and-release.md">carregue-a</a></li>
<li>Execute uma pesquisa no primário para confirmar que os dados estão lá</li>
<li>Conecte-se ao standby e execute a mesma pesquisa</li>
<li>Se o standby apresentar os mesmos resultados, a replicação está a funcionar</li>
</ol>
<p>O <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a> abrange a criação, inserção e pesquisa de colecções, caso necessite de uma referência.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">Executando o CDC na produção<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>A configuração do CDC é a parte mais simples. Mantê-lo confiável ao longo do tempo requer atenção a algumas áreas operacionais.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">Monitorar o atraso da replicação</h3><p>O standby está sempre ligeiramente atrasado em relação ao primário - isso é inerente à replicação assíncrona. Sob carga normal, o atraso é de alguns segundos. Mas picos de escrita, congestionamento de rede ou pressão de recursos no standby podem fazer com que ele aumente.</p>
<p>Acompanhe o atraso como uma métrica e alerte sobre ele. Um atraso que cresce sem recuperação geralmente significa que o nó CDC não consegue acompanhar a taxa de transferência de gravação. Verifique primeiro a largura de banda da rede entre os clusters e, em seguida, considere se o standby precisa de mais recursos.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">Usar o standby para escalonamento de leitura</h3><p>O standby não é apenas um backup frio que fica ocioso até que ocorra um desastre. Aceita <a href="https://milvus.io/docs/single-vector-search.md">pedidos de pesquisa e consulta</a> enquanto a replicação está ativa - apenas as escritas são bloqueadas. Isso abre possibilidades de uso prático:</p>
<ul>
<li>Encaminhar cargas de trabalho de <a href="https://zilliz.com/glossary/similarity-search">pesquisa</a> ou análise <a href="https://zilliz.com/glossary/similarity-search">por semelhança</a> de lote para o standby</li>
<li>Dividir o tráfego de leitura durante as horas de pico para reduzir a pressão sobre o primário</li>
<li>Executar consultas dispendiosas (grandes top-K, pesquisas filtradas em grandes colecções) sem afetar a latência de escrita da produção</li>
</ul>
<p>Isso transforma sua infraestrutura de DR em um ativo de desempenho. O standby ganha seu sustento mesmo quando nada está quebrado.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">Dimensionar o standby corretamente</h3><p>O standby repete cada gravação do primário, portanto, precisa de recursos de computação e memória semelhantes. Se também estiver a encaminhar leituras para ele, tenha em conta essa carga adicional. Os requisitos de armazenamento são idênticos - ele mantém os mesmos dados.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">Teste o Failover antes de precisar dele</h3><p>Não espere por uma falha real para descobrir que o seu processo de ativação pós-falha não funciona. Execute simulações periódicas:</p>
<ol>
<li>Parar as gravações no primário</li>
<li>Aguardar que o standby recupere o atraso (atraso → 0)</li>
<li>Promover o standby</li>
<li>Verificar se as consultas retornam os resultados esperados</li>
<li>Reverter o processo</li>
</ol>
<p>Medir o tempo que cada passo demora e documentá-lo. O objetivo é tornar a ativação pós-falha um procedimento de rotina com um calendário conhecido - e não uma improvisação stressante às 3 da manhã. A Parte 3 desta série aborda o processo de failover em detalhes.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">Não quer gerir o CDC você mesmo? O Zilliz Cloud trata disso<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>Configurar e operar a replicação CDC do Milvus é poderoso, mas vem com uma sobrecarga operacional: você gerencia dois clusters, monitora a integridade da replicação, lida com runbooks de failover e mantém a infraestrutura em todas as regiões. Para as equipas que pretendem HA de nível de produção sem os encargos operacionais, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) fornece-o de imediato.</p>
<p><strong>O Global Cluster</strong> é o principal recurso do Zilliz Cloud. Permite-lhe executar uma implementação Milvus que abrange várias regiões - América do Norte, Europa, Ásia-Pacífico, entre outras - como um único cluster lógico. Nos bastidores, utiliza a mesma tecnologia de replicação CDC/WAL descrita neste artigo, mas totalmente gerida:</p>
<table>
<thead>
<tr><th>Capacidade</th><th>CDC autogerenciado (este artigo)</th><th>Cluster global do Zilliz Cloud</th></tr>
</thead>
<tbody>
<tr><td><strong>Replicação</strong></td><td>Você configura e monitora</td><td>Pipeline CDC automatizado e assíncrono</td></tr>
<tr><td><strong>Failover</strong></td><td>Manual de execução</td><td>Automatizado - sem alterações de código, sem actualizações de cadeias de ligação</td></tr>
<tr><td><strong>Auto-recuperação</strong></td><td>Você provisiona novamente o cluster com falha</td><td>Automático: detecta o estado obsoleto, reinicia e reconstrói como um novo secundário</td></tr>
<tr><td><strong>Entre regiões</strong></td><td>Implementa e gere ambos os clusters</td><td>Multi-região incorporada com acesso de leitura local</td></tr>
<tr><td><strong>RPO</strong></td><td>Segundos (depende da sua monitorização)</td><td>Segundos (não planeado) / Zero (comutação planeada)</td></tr>
<tr><td><strong>RTO</strong></td><td>Minutos (depende do seu livro de execução)</td><td>Minutos (automatizado)</td></tr>
</tbody>
</table>
<p>Para além do Global Cluster, o plano Business Critical inclui funcionalidades adicionais de DR:</p>
<ul>
<li><strong>Recuperação Point-in-Time (PITR)</strong> - reverter uma coleção para qualquer momento dentro da janela de retenção, útil para recuperar de eliminações acidentais ou corrupção de dados replicados para o standby.</li>
<li><strong>Backup entre regiões</strong> - replicação de backup automatizada e contínua para uma região de destino. A restauração para novos clusters leva minutos.</li>
<li><strong>SLA de 99,99% de tempo de atividade</strong> - apoiado por uma implementação multi-AZ com várias réplicas.</li>
</ul>
<p>Se estiver a executar a pesquisa vetorial na produção e a DR for um requisito, vale a pena avaliar o Zilliz Cloud juntamente com a abordagem Milvus autogerida. <a href="https://zilliz.com/contact-sales">Contacte a equipa Zilliz</a> para obter mais informações.</p>
<h2 id="Whats-Next" class="common-anchor-header">O que vem a seguir<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Este artigo cobriu o cenário de HA para bancos de dados vetoriais e percorreu a criação de um par primário-em espera do zero. A seguir:</p>
<ul>
<li><strong>Parte 2</strong>: Adicionando CDC a um cluster Milvus existente que já possui dados, usando <a href="https://milvus.io/docs/milvus_backup_overview.md">o Milvus Backup</a> para semear o standby antes de ativar a replicação</li>
<li><strong>Parte 3</strong>: Gerir o failover - promover o standby, redirecionar o tráfego e recuperar o primário original</li>
</ul>
<p>Fique atento.</p>
<hr>
<p>Se estiver a executar <a href="https://milvus.io/">o Milvus</a> em produção e a pensar na recuperação de desastres, gostaríamos de ajudar:</p>
<ul>
<li>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> para fazer perguntas, compartilhar sua arquitetura HA e aprender com outras equipes que executam o Milvus em escala.</li>
<li><a href="https://milvus.io/office-hours">Reserve uma sessão gratuita de 20 minutos do Milvus Office Hours</a> para percorrer a sua configuração de DR - quer se trate da configuração do CDC, do planeamento de failover ou da implementação em várias regiões.</li>
<li>Se preferir ignorar a configuração da infraestrutura e saltar diretamente para a HA pronta para produção, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) oferece alta disponibilidade entre regiões através da sua funcionalidade Global Cluster - sem necessidade de configuração manual do CDC.</li>
</ul>
<hr>
<p>Algumas perguntas que surgem quando as equipas começam a configurar a alta disponibilidade da base de dados de vectores:</p>
<p><strong>P: O CDC torna o cluster primário mais lento?</strong></p>
<p>Não. O nó CDC lê os registos WAL de forma assíncrona, independentemente do caminho de leitura/escrita. Ele não compete com consultas ou inserções por recursos no primário. Não verá uma diferença de desempenho com o CDC ativado.</p>
<p><strong>P: O CDC pode replicar dados que existiam antes de ser ativado?</strong></p>
<p>Não - o CDC só captura alterações a partir do momento em que é ativado. Para trazer os dados existentes para o standby, utilize <a href="https://milvus.io/docs/milvus_backup_overview.md">o Milvus Backup</a> para semear o standby primeiro e, em seguida, active o CDC para replicação contínua. A Parte 2 desta série aborda este fluxo de trabalho.</p>
<p><strong>P: Ainda preciso do CDC se já tiver a multi-replicação activada?</strong></p>
<p>Eles protegem contra diferentes modos de falha. <a href="https://milvus.io/docs/replica.md">A multi-replicação</a> mantém cópias dos mesmos <a href="https://milvus.io/docs/glossary.md">segmentos</a> em nós dentro de um cluster - ótimo para falhas de nós, inútil quando todo o cluster desaparece (má implantação, interrupção do AZ, exclusão de namespace). O CDC mantém um cluster separado em um domínio de falha diferente com dados quase em tempo real. Para qualquer coisa além de um ambiente de desenvolvimento, você quer ambos.</p>
<p><strong>P: Como o Milvus CDC se compara à replicação em outros bancos de dados vetoriais?</strong></p>
<p>Atualmente, a maioria das bases de dados vectoriais oferece redundância ao nível dos nós (equivalente a multi-replicação), mas não oferece replicação ao nível do cluster. O Milvus é atualmente a única grande base de dados vetorial com replicação CDC baseada em WAL incorporada - o mesmo padrão comprovado que as bases de dados relacionais como o PostgreSQL e o MySQL utilizam há décadas. Se o failover entre clusters ou entre regiões for um requisito, este é um diferenciador significativo a avaliar.</p>
