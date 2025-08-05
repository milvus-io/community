---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: A implantação do Milvus no Kubernetes ficou mais fácil com o Milvus Operator
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  O Milvus Operator é uma ferramenta de gerenciamento nativa do Kubernetes que
  automatiza o ciclo de vida completo das implantações de banco de dados
  vetorial do Milvus.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_Just_Got_Easier_with_the_Milvus_Operator_1f6f48e55c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus Operator, Kubernetes, How to deploy Milvus on Kubernetes'
meta_title: |
  Deploy Milvus on K8s Just Got Easier with the Milvus Operator 
origin: >-
  https://milvus.io/blog/deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
---
<p>Configurar um cluster Milvus pronto para produção não deveria ser como desarmar uma bomba. No entanto, qualquer pessoa que tenha configurado manualmente as implantações do Kubernetes para bancos de dados vetoriais conhece o exercício: dezenas de arquivos YAML, gerenciamento de dependência intrincado e aquela sensação de afundamento quando algo quebra às 2 da manhã e você não tem certeza de qual dos 47 arquivos de configuração é o culpado.</p>
<p>A abordagem tradicional para implantar o Milvus envolve a orquestração de vários serviços - etcd para armazenamento de metadados, Pulsar para enfileiramento de mensagens, MinIO para armazenamento de objetos e os vários componentes do Milvus. Cada serviço requer uma configuração cuidadosa, uma sequência de inicialização adequada e manutenção contínua. Se isso for dimensionado para vários ambientes ou clusters, a complexidade operacional se tornará esmagadora.</p>
<p>É aqui que <a href="https://github.com/zilliztech/milvus-operator"><strong>o Milvus Operator</strong></a> muda fundamentalmente o jogo. Em vez de gerir a infraestrutura manualmente, o utilizador descreve o que pretende e o Operador trata do como.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">O que é o Milvus Operator?<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>O Milvus Operator</strong></a> é uma ferramenta de gerenciamento nativa do Kubernetes que automatiza o ciclo de vida completo das implantações de banco de dados de vetores Milvus. Construído no padrão Kubernetes Operator, ele encapsula anos de conhecimento operacional sobre a execução do Milvus na produção e codifica essa experiência em software que é executado ao lado do seu cluster.</p>
<p>Pense nisso como ter um administrador especialista em Milvus que nunca dorme, nunca comete erros de digitação e tem uma memória perfeita de cada detalhe de configuração. O Operator monitora continuamente a saúde do seu cluster, lida automaticamente com decisões de escalonamento, gerencia atualizações sem tempo de inatividade e se recupera de falhas mais rápido do que qualquer operador humano poderia.</p>
<p>Em seu núcleo, o Operador fornece quatro capacidades essenciais.</p>
<ul>
<li><p><strong>Implantação automatizada</strong>: Configure um cluster Milvus totalmente funcional com um único manifesto.</p></li>
<li><p><strong>Gerenciamento do ciclo de vida</strong>: Automatize atualizações, escalonamento horizontal e desmontagem de recursos em uma ordem definida e segura.</p></li>
<li><p><strong>Monitoramento integrado e verificações de integridade</strong>: Monitore continuamente o estado dos componentes do Milvus e suas dependências relacionadas, incluindo etcd, Pulsar e MinIO.</p></li>
<li><p><strong>Melhores práticas operacionais por padrão</strong>: Aplique padrões nativos do Kubernetes que garantem a confiabilidade sem exigir um conhecimento profundo da plataforma.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Entendendo o padrão de operador do Kubernetes</h3><p>Antes de explorarmos as vantagens do Milvus Operator, vamos primeiro entender a base sobre a qual ele é construído: o <strong>padrão Kubernetes Operator.</strong></p>
<p>O padrão Kubernetes Operator ajuda a gerenciar aplicativos complexos que precisam de mais do que os recursos básicos do Kubernetes. Um Operator tem três partes principais:</p>
<ul>
<li><p><strong>As Definições de Recursos Personalizados</strong> permitem que você descreva seu aplicativo usando arquivos de configuração no estilo do Kubernetes.</p></li>
<li><p><strong>Um Controlador</strong> observa essas configurações e faz as alterações necessárias no seu cluster.</p></li>
<li><p><strong>O State Management</strong> garante que o cluster corresponde ao que foi solicitado e corrige quaisquer diferenças.</p></li>
</ul>
<p>Isto significa que pode descrever a sua implementação Milvus de uma forma familiar, e o Operator trata de todo o trabalho detalhado de criação de pods, configuração de redes e gestão do ciclo de vida...</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">Como funciona o Milvus Operator<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus Operator segue um processo simples que torna a gestão da base de dados muito mais simples. Vamos analisar o modelo operacional principal do Milvus Operator:</p>
<ol>
<li><p><strong>Recurso Personalizado (CR):</strong> Os utilizadores definem uma implementação Milvus usando um CR (por exemplo, kind: <code translate="no">Milvus</code>). Este ficheiro inclui configurações como o modo de cluster, versão da imagem, requisitos de recursos e dependências.</p></li>
<li><p><strong>Lógica do Controlador:</strong> O controlador do Operador observa se há CRs novos ou atualizados. Assim que detecta uma mudança, ele orquestra a criação dos componentes necessários - serviços Milvus e dependências como etcd, Pulsar e MinIO.</p></li>
<li><p><strong>Gerenciamento automatizado do ciclo de vida:</strong> Quando ocorrem alterações - como atualizar a versão ou modificar o armazenamento - o Operator executa atualizações contínuas ou reconfigura componentes sem interromper o cluster.</p></li>
<li><p><strong>Auto-cura:</strong> O controlador verifica continuamente a saúde de cada componente. Se algo falhar, ele substitui automaticamente o pod ou restaura o estado do serviço para garantir o tempo de atividade.</p></li>
</ol>
<p>Esta abordagem é muito mais poderosa do que as implantações YAML ou Helm tradicionais porque fornece gerenciamento contínuo em vez de apenas a configuração inicial.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">Porquê usar o Milvus Operator em vez de Helm ou YAML?<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao implementar o Milvus, pode escolher entre ficheiros YAML manuais, gráficos Helm, ou o Milvus Operator. Cada um tem o seu lugar, mas o Operator oferece vantagens significativas para as operações em curso.</p>
<h3 id="Operation-Automation" class="common-anchor-header">Automatização da operação</h3><p>Os métodos tradicionais requerem trabalho manual para tarefas de rotina. Escalar significa atualizar vários ficheiros de configuração e coordenar as alterações. As actualizações necessitam de um planeamento cuidadoso para evitar interrupções de serviço. O Operator lida com estas tarefas automaticamente. Pode detetar quando o escalonamento é necessário e efetuar as alterações de forma segura. Os upgrades tornam-se simples actualizações de configuração que o Operator executa com sequenciação adequada e capacidades de reversão, se necessário.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">Melhor visibilidade do estado</h3><p>Os arquivos YAML dizem ao Kubernetes o que você quer, mas eles não mostram a saúde atual do seu sistema. O Helm ajuda na gestão da configuração, mas não monitoriza o estado da sua aplicação em tempo de execução. O Operator observa continuamente todo o seu cluster. Ele pode detetar problemas como problemas de recursos ou respostas lentas e tomar medidas antes que eles se tornem problemas sérios. Esta monitorização proactiva melhora significativamente a fiabilidade.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">Gestão mais fácil a longo prazo</h3><p>Gerir vários ambientes com ficheiros YAML significa manter muitos ficheiros de configuração sincronizados. Mesmo com modelos Helm, operações complexas ainda exigem uma coordenação manual significativa.</p>
<p>O Operator encapsula o conhecimento de gestão do Milvus no seu código. Isto significa que as equipas podem gerir clusters de forma eficaz sem se tornarem especialistas em cada componente. A interface operacional mantém-se consistente à medida que a sua infraestrutura se expande.</p>
<p>Utilizar o Operator significa escolher uma abordagem mais automatizada para a gestão do Milvus. Reduz o trabalho manual ao mesmo tempo que melhora a fiabilidade através da experiência incorporada - benefícios valiosos à medida que as bases de dados vectoriais se tornam mais críticas para as aplicações.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">A arquitetura do Milvus Operation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O diagrama descreve claramente a estrutura de implantação do Milvus Operator em um cluster Kubernetes:</p>
<ul>
<li><p>Esquerda (área azul): Componentes principais do Operator, incluindo o Controller e o Milvus-CRD.</p></li>
<li><p>Direita (Área Verde): Vários componentes do cluster Milvus, como o Proxy, o Coordinator e o Node.</p></li>
<li><p>Centro (Setas - "criar/gerir"): O fluxo de operações que mostra como o Operador gere o cluster Milvus.</p></li>
<li><p>Parte inferior (Área Laranja): Serviços dependentes, como etcd e MinIO/S3/MQ.</p></li>
</ul>
<p>Esta estrutura visual, com blocos de cores distintas e setas direcionais, clarifica eficazmente as interações e o fluxo de dados entre os diferentes componentes.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">Primeiros passos com o Milvus Operator<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Este passo a passo mostra como implantar o Milvus usando o Operator. Usaremos estas versões neste guia.</p>
<ul>
<li><p><strong>Sistema operacional</strong>: openEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) Pré-requisitos</h3><p>Seu cluster Kubernetes precisa de pelo menos uma StorageClass configurada. Você pode verificar o que está disponível:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>No nosso exemplo, temos duas opções:</p>
<ul>
<li><p><code translate="no">local</code> (padrão) - usa discos locais</p></li>
<li><p><code translate="no">nfs-sc</code>- usa armazenamento NFS (bom para testes, mas evite em produção)</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Instalando o Milvus Operator</h3><p>Você pode instalar o Operator com <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a> ou <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl</a>. Nós vamos usar o kubectl por ser mais simples.</p>
<p>Baixe o manifesto de implantação do Operator:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Substituir o endereço da imagem (opcional):</p>
<p><strong>Opcional: Utilizar um registo de imagens diferente</strong> Se não conseguir aceder ao DockerHub ou preferir o seu próprio registo:</p>
<p><em>Nota: O endereço do repositório de imagens fornecido aqui é para fins de teste. Substitua-o pelo seu endereço de repositório real, conforme necessário.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Instalar o Milvus Operator:</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Após a instalação, você deve ver uma saída semelhante a:</p>
<pre><code translate="no">namespace/milvus-operator created
serviceaccount/milvus-operator created
customresourcedefinition.apiextensions.k8s.io/milvusclusters.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvuses.milvus.io created
customresourcedefinition.apiextensions.k8s.io/milvusupgrades.milvus.io created
clusterrole.rbac.authorization.k8s.io/milvus-operator-manager-role created
clusterrolebinding.rbac.authorization.k8s.io/milvus-operator-manager-rolebinding created
role.rbac.authorization.k8s.io/milvus-operator-leader-election-role created
rolebinding.rbac.authorization.k8s.io/milvus-operator-leader-election-rolebinding created
service/milvus-operator-metrics-service created
service/milvus-operator-webhook-service created
deployment.apps/milvus-operator created
<button class="copy-code-btn"></button></code></pre>
<p>Verificar a implantação do Milvus Operator e os recursos do pod:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Implantando o Cluster do Milvus</h3><p>Depois que o pod do Milvus Operator estiver em execução, você poderá implantar o cluster do Milvus com as seguintes etapas.</p>
<p>Descarregue o manifesto de implantação do cluster do Milvus:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>A configuração padrão é mínima:</p>
<pre><code translate="no"><span class="hljs-comment"># This is a sample to deploy a milvus cluster in milvus-operator&#x27;s default configurations.</span>
apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-release
  labels:
    app: milvus
spec:
  mode: cluster
  dependencies: {}
  components: {}
  config: {}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Para uma implantação real, você vai querer personalizar:</strong></p>
<ul>
<li><p>Nome do cluster personalizado: <code translate="no">milvus-release-v25</code></p></li>
<li><p>Imagem personalizada: (para usar uma imagem online diferente ou uma imagem offline local) <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>Nome da classe de armazenamento personalizado: Em ambientes com várias classes de armazenamento, pode ser necessário especificar a StorageClass para componentes persistentes como MinIO e etcd. Neste exemplo, <code translate="no">nfs-sc</code> é usado.</p></li>
<li><p>Recursos personalizados: Definir limites de CPU e memória para os componentes do Milvus. Por predefinição, não são definidos limites, o que pode sobrecarregar os seus nós Kubernetes.</p></li>
<li><p>Exclusão automática de recursos relacionados: Por padrão, quando o cluster do Milvus é excluído, os recursos associados são mantidos.</p></li>
</ul>
<p>Para configuração de parâmetros adicionais, consulte:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Definição de recursos personalizados do Milvus</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">Valores do Pulsar</a></p></li>
</ul>
<p>O manifesto modificado é:</p>
<pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: milvus-release-v25
  labels:
    app: milvus
spec:
  mode: cluster
  config: {}
  components:
    image: registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
    resources:
      limits:
        cpu: 2
        memory: 8Gi
  dependencies:
    etcd:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          global:
            imageRegistry: registry.milvus-mirror.cn
            storageClass: nfs-sc
    storage:
      inCluster:
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          resources:
            limits:
              cpu: 2
              memory: 8Gi
          image:
            repository: registry.milvus-mirror.cn/milvusdb/minio
            tag: RELEASE.2023-03-20T20-16-18Z
          persistence:
            storageClass: nfs-sc
            accessMode: ReadWriteOnce
            size: 10Gi
    pulsar:
      inCluster:
        chartVersion: pulsar-v3
        deletionPolicy: Delete
        pvcDeletion: <span class="hljs-literal">true</span>
        values:
          existingStorageClassName: nfs-sc
          pulsar_metadata:
            image:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
          zookeeper:
            replicaCount: 3
            volumes:
              data:
                size: 5Gi
                storageClassName: nfs-sc
          bookkeeper:
            volumes:
              journal:
                size: 5Gi
                storageClassName: nfs-sc
              ledgers:
                size: 5Gi
                storageClassName: nfs-sc
          images:
            zookeeper:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            proxy:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            broker:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            bookie:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
            autorecovery:
              repository: registry.milvus-mirror.cn/apachepulsar/pulsar
              tag: 3.0.7
<button class="copy-code-btn"></button></code></pre>
<p>Implantar o cluster do Milvus:</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Verificando o status do cluster do Milvus</h4><p>O Milvus Operator primeiro configura as dependências de middleware para o Milvus - como etcd, Zookeeper, Pulsar e MinIO - antes de implantar os componentes do Milvus (por exemplo, proxy, coordenador e nós).</p>
<p>Exibir implantações:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                    READY   UP-TO-DATE   AVAILABLE   AGE
milvus-release-v25-milvus-datanode      1/1     1            1           52m
milvus-release-v25-milvus-indexnode     1/1     1            1           52m
milvus-release-v25-milvus-mixcoord      1/1     1            1           52m
milvus-release-v25-milvus-proxy         1/1     1            1           52m
milvus-release-v25-milvus-querynode-0   1/1     1            1           52m
milvus-release-v25-milvus-querynode-1   0/0     0            0           52m
milvus-release-v25-milvus-standalone    0/0     0            0           52m
<button class="copy-code-btn"></button></code></pre>
<p>Nota especial:</p>
<p>Você pode notar que o Operador Milvus cria uma implantação <code translate="no">standalone</code> e uma <code translate="no">querynode-1</code> com 0 réplicas.</p>
<p>Isso é intencional. Nós submetemos um problema ao repositório do Operador Milvus, a resposta oficial é:</p>
<ul>
<li><p>a. As implementações funcionam como esperado. A versão autónoma é mantida para permitir transições perfeitas de um cluster para uma implementação autónoma sem interrupção do serviço.</p></li>
<li><p>b. Ter ambos <code translate="no">querynode-0</code> e <code translate="no">querynode-1</code> é útil durante as actualizações contínuas. No final, apenas um deles estará ativo.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">Verificando se todos os pods estão funcionando corretamente</h4><p>Quando o cluster Milvus estiver pronto, verifique se todos os pods estão a funcionar como esperado:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                                    READY   STATUS      RESTARTS        AGE
milvus-release-v25-etcd<span class="hljs-number">-0</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-1</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-etcd<span class="hljs-number">-2</span>                               <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m15s
milvus-release-v25-milvus-datanode<span class="hljs-number">-65b</span>ff7b4d9<span class="hljs-number">-9</span>h2xv     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-indexnode<span class="hljs-number">-5b</span>5cbb4cdc-cxvwj    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-mixcoord<span class="hljs-number">-64488898b</span>5-r76rw     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-proxy<span class="hljs-number">-5</span>c7fbcb69-cqmq4         <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-milvus-querynode<span class="hljs-number">-0</span>-bc6f57d64-k2wnt   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">4</span>m35s
milvus-release-v25-minio<span class="hljs-number">-0</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-1</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-2</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-minio<span class="hljs-number">-3</span>                              <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m14s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie<span class="hljs-number">-2</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-bookie-<span class="hljs-keyword">init</span><span class="hljs-number">-5</span>zf2z             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-0</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-broker<span class="hljs-number">-1</span>                      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-proxy<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-pulsar-<span class="hljs-keyword">init</span>-twznd             <span class="hljs-number">0</span>/<span class="hljs-number">1</span>     Completed   <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-recovery<span class="hljs-number">-0</span>                    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">1</span> (<span class="hljs-number">6</span>m25s ago)   <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
milvus-release-v25-pulsar-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running     <span class="hljs-number">0</span>               <span class="hljs-number">7</span>m12s
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">Verificando a StorageClass</h4><p>Certifique-se de que sua StorageClass personalizada (<code translate="no">nfs-sc</code>) e as capacidades de armazenamento especificadas foram aplicadas corretamente:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pvc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-variable constant_">NAME</span>                                                                             <span class="hljs-variable constant_">STATUS</span>   <span class="hljs-variable constant_">VOLUME</span>                                     <span class="hljs-variable constant_">CAPACITY</span>   <span class="hljs-variable constant_">ACCESS</span> <span class="hljs-variable constant_">MODES</span>   <span class="hljs-variable constant_">STORAGECLASS</span>   <span class="hljs-variable constant_">AGE</span>
data-milvus-release-v25-etcd-<span class="hljs-number">0</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-3273f9ec-819f-<span class="hljs-number">4e84</span>-bdbe-3cd9df697a5f   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">1</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-01743e13-a989-4aea-8fd0-632ea8b13f98   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
data-milvus-release-v25-etcd-<span class="hljs-number">2</span>                                                   <span class="hljs-title class_">Bound</span>    pvc-594f1a63-efba-<span class="hljs-number">4993</span>-<span class="hljs-number">89e6</span>-3ee5e333073d   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">0</span>                                                <span class="hljs-title class_">Bound</span>    pvc-477d4e3b-69d7-4bbe-80f7-b747dc4c79f7   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">1</span>                                                <span class="hljs-title class_">Bound</span>    pvc-b12e46fa-8d29-48fb-9ac1-98f80d67b543   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">2</span>                                                <span class="hljs-title class_">Bound</span>    pvc-2e67893e-<span class="hljs-number">9611</span>-43dd-<span class="hljs-number">9550</span>-b3a7705699ae   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<span class="hljs-keyword">export</span>-milvus-release-v25-minio-<span class="hljs-number">3</span>                                                <span class="hljs-title class_">Bound</span>    pvc-572c4565-bc38-<span class="hljs-number">4215</span>-a13c-061d9199fdea   10Gi       <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-183eff99-7a87-406d-9f17-b0fb30c7c0b3   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-ebe32304-7d92-44d1-b6fb-4cbaf3207d25   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-journal-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-2ead9186-3d44-4faa-9ae7-784be7ecf6d2   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">0</span>      <span class="hljs-title class_">Bound</span>    pvc-ff1b632d-0a66-4c13-a3bb-2550f9307614   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">1</span>      <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">57159e85</span>-bb48-48a9-<span class="hljs-number">9706</span>-7a95af8da157   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-bookie-ledgers-milvus-release-v25-pulsar-bookie-<span class="hljs-number">2</span>      <span class="hljs-title class_">Bound</span>    pvc-eb235f29-afbd-4a40-9a7d-0340a9686053   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">0</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">40e02974</span>-3b7d-4f42-bfa7-3252b7615a36   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">1</span>   <span class="hljs-title class_">Bound</span>    pvc-<span class="hljs-number">75904229</span>-3bbf-458e-b0e3-3982e430621b   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
milvus-release-v25-pulsar-zookeeper-data-milvus-release-v25-pulsar-zookeeper-<span class="hljs-number">2</span>   <span class="hljs-title class_">Bound</span>    pvc-2e068b79-75ac-4aa9-<span class="hljs-number">9e90</span>-423ff399bad0   5Gi        <span class="hljs-variable constant_">RWO</span>            nfs-sc         36m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Verificando os limites de recursos do Milvus</h4><p>Por exemplo, para verificar se os limites de recursos para o componente <code translate="no">mixcoord</code> foram aplicados corretamente, execute:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">Verificando a imagem personalizada</h4><p>Confirme se a imagem personalizada correta está em uso:</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) Acessando seu cluster de fora</h3><p>Uma pergunta comum é: Como você pode acessar os serviços do Milvus de fora do seu cluster Kubernetes?</p>
<p>Por padrão, o serviço Milvus implantado pelo Operador é do tipo <code translate="no">ClusterIP</code>, o que significa que ele só é acessível dentro do cluster. Para o expor externamente, é necessário definir um método de acesso externo. Este guia opta pela abordagem mais simples: utilizar um NodePort.</p>
<p>Crie e edite o manifesto do serviço para acesso externo:</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Incluir o seguinte conteúdo:</p>
<pre><code translate="no">kind: Service
apiVersion: v1
metadata:
  name: milvus-release-v25-external-svc
  namespace: default
  labels:
    app: dmilvus-release-v25-external-svc
spec:
  ports:
    - name: milvus
      protocol: TCP
      port: 19530
      targetPort: 19530
      nodePort: 31530
    - name: milvus-web
      protocol: TCP
      port: 9091
      targetPort: 9091
      nodePort: 31531
  selector:
    app.kubernetes.io/component: proxy
    app.kubernetes.io/instance: milvus-release-v25
    app.kubernetes.io/name: milvus
  clusterIP:
  <span class="hljs-built_in">type</span>: NodePort
<button class="copy-code-btn"></button></code></pre>
<ol>
<li>Aplicar o manifesto do serviço externo:</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Verificar o estado do serviço externo:</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                                  TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)                                                       AGE
milvus-release-v25-external-svc       NodePort    <span class="hljs-number">10.233</span><span class="hljs-number">.8</span><span class="hljs-number">.166</span>    &lt;none&gt;        <span class="hljs-number">19530</span>:<span class="hljs-number">31530</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31531</span>/TCP                                43s
milvus-release-v25-etcd               ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.27</span><span class="hljs-number">.134</span>   &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-etcd-headless      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                                             16m
milvus-release-v25-milvus             ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.55</span><span class="hljs-number">.194</span>   &lt;none&gt;        <span class="hljs-number">19530</span>/TCP,<span class="hljs-number">9091</span>/TCP                                            13m
milvus-release-v25-minio              ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.1</span><span class="hljs-number">.56</span>     &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-minio-svc          ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">9000</span>/TCP                                                      16m
milvus-release-v25-pulsar-bookie      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">3181</span>/TCP,<span class="hljs-number">8000</span>/TCP                                             16m
milvus-release-v25-pulsar-broker      ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8080</span>/TCP,<span class="hljs-number">6650</span>/TCP                                             16m
milvus-release-v25-pulsar-proxy       ClusterIP   <span class="hljs-number">10.233</span><span class="hljs-number">.30</span><span class="hljs-number">.132</span>   &lt;none&gt;        <span class="hljs-number">80</span>/TCP,<span class="hljs-number">6650</span>/TCP                                               16m
milvus-release-v25-pulsar-recovery    ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP                                                      16m
milvus-release-v25-pulsar-zookeeper   ClusterIP   <span class="hljs-literal">None</span>            &lt;none&gt;        <span class="hljs-number">8000</span>/TCP,<span class="hljs-number">2888</span>/TCP,<span class="hljs-number">3888</span>/TCP,<span class="hljs-number">2181</span>/TCP                           16m
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Acessando a WebUI do Milvus</li>
</ol>
<p>O Milvus fornece uma GUI embutida - a Milvus WebUI - que aumenta a observabilidade com uma interface intuitiva. Use-a para monitorar as métricas dos componentes do Milvus e suas dependências, revisar informações detalhadas sobre bancos de dados e coleções, e inspecionar detalhes completos de configuração. Para obter detalhes adicionais, consulte a <a href="https://milvus.io/docs/milvus-webui.md">documentação oficial do Milvus WebUI</a>.</p>
<p>Após a implantação, abra o seguinte URL no seu navegador (substitua <code translate="no">&lt;any_k8s_node_IP&gt;</code> pelo endereço IP de qualquer nó Kubernetes):</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>Isto irá lançar a interface WebUI.</p>
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
    </button></h2><p>O <strong>Milvus Operator</strong> é mais do que uma ferramenta de implantação - é um investimento estratégico em excelência operacional para a infraestrutura de banco de dados de vetores. Ao automatizar tarefas de rotina e incorporar práticas recomendadas ao seu ambiente Kubernetes, ele libera as equipes para se concentrarem no que é mais importante: criar e melhorar aplicativos orientados por IA.</p>
<p>A adoção do gerenciamento baseado em operador exige algum esforço inicial, incluindo alterações nos fluxos de trabalho e nos processos da equipe. Mas para as organizações que operam em escala - ou que planeiam fazê-lo - os ganhos a longo prazo são significativos: maior fiabilidade, menores despesas operacionais e ciclos de implementação mais rápidos e consistentes.</p>
<p>À medida que a IA se torna essencial para as operações comerciais modernas, a necessidade de uma infraestrutura de banco de dados vetorial robusta e escalável só aumenta. O Milvus Operator apoia essa evolução, oferecendo uma abordagem madura e automatizada que se adapta à sua carga de trabalho e às suas necessidades específicas.</p>
<p>Se a sua equipa está a enfrentar uma complexidade operacional, a antecipar o crescimento ou simplesmente pretende reduzir a gestão manual da infraestrutura, a adoção antecipada do Milvus Operator pode ajudar a evitar futuras dívidas técnicas e a melhorar a resiliência geral do sistema.</p>
<p>O futuro da infraestrutura é inteligente, automatizado e fácil de desenvolver. <strong>O Milvus Operator traz esse futuro para a sua camada de banco de dados - hoje mesmo.</strong></p>
<hr>
