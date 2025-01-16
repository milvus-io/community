---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: >-
  Como implementar a base de dados vetorial Milvus de código aberto no Amazon
  EKS
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Um guia passo-a-passo sobre a implementação da base de dados de vectores
  Milvus no AWS utilizando serviços geridos como o Amazon EKS, S3, MSK e ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>Este post foi originalmente publicado no <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>site da AWS</em></a> e é traduzido, editado e republicado aqui com permissão.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">Uma visão geral dos embeddings vectoriais e das bases de dados vectoriais<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>A ascensão da <a href="https://zilliz.com/learn/generative-ai">IA generativa (GenAI)</a>, particularmente os modelos de linguagem grande<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs</a>), aumentou significativamente o interesse em <a href="https://zilliz.com/learn/what-is-vector-database">bancos de dados vetoriais</a>, estabelecendo-os como um componente essencial dentro do ecossistema GenAI. Como resultado, as bases de dados vectoriais estão a ser adoptadas em cada vez mais <a href="https://milvus.io/use-cases">casos de utilização</a>.</p>
<p>Um <a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">relatório da IDC</a> prevê que, até 2025, mais de 80% dos dados comerciais serão não estruturados, existindo em formatos como texto, imagens, áudio e vídeos. Compreender, processar, armazenar e consultar esta vasta quantidade de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a> à escala representa um desafio significativo. A prática comum na GenAI e na aprendizagem profunda consiste em transformar dados não estruturados em incorporações vectoriais, armazená-los e indexá-los numa base de dados vetorial como o <a href="https://milvus.io/intro">Milvus</a> ou o <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (o Milvus totalmente gerido) para pesquisas de semelhança <a href="https://zilliz.com/learn/vector-similarity-search">vetorial</a> ou de semelhança semântica.</p>
<p>Mas o que são exatamente os vetor <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a>? Em termos simples, são representações numéricas de números de vírgula flutuante num espaço de elevada dimensão. A <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">distância entre dois vectores</a> indica a sua relevância: quanto mais próximos estiverem, mais relevantes são um para o outro, e vice-versa. Isto significa que vectores semelhantes correspondem a dados originais semelhantes, o que difere das pesquisas tradicionais por palavra-chave ou exactas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>Como efetuar uma pesquisa de semelhança de vectores</span> </span></p>
<p><em>Figura 1: Como efetuar uma pesquisa de semelhança de vectores</em></p>
<p>A capacidade de armazenar, indexar e pesquisar incorporações vectoriais é a principal funcionalidade das bases de dados vectoriais. Atualmente, as principais bases de dados vectoriais dividem-se em duas categorias. A primeira categoria estende os produtos de bases de dados relacionais existentes, como o Amazon OpenSearch Service com o plug-in <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> e o Amazon RDS para <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> com a extensão pgvector. A segunda categoria inclui produtos especializados de bases de dados vectoriais, incluindo exemplos bem conhecidos como o Milvus, o Zilliz Cloud (o Milvus totalmente gerido), o <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, o <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, o <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a> e <a href="https://zilliz.com/blog/milvus-vs-chroma">o Chroma</a>.</p>
<p>As técnicas de incorporação e as bases de dados vectoriais têm amplas aplicações em vários <a href="https://zilliz.com/vector-database-use-cases">casos de utilização orientados para a IA</a>, incluindo pesquisa de semelhança de imagens, desduplicação e análise de vídeo, processamento de linguagem natural, sistemas de recomendação, publicidade direcionada, pesquisa personalizada, serviço de apoio ao cliente inteligente e deteção de fraudes.</p>
<p><a href="https://milvus.io/docs/quickstart.md">O Milvus</a> é uma das opções de código aberto mais populares entre os vários bancos de dados vetoriais. Esta postagem apresenta o Milvus e explora a prática de implantação do Milvus no AWS EKS.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">O que é o Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">O Milvus</a> é um banco de dados vetorial de código aberto, nativo da nuvem, altamente flexível, confiável e extremamente rápido. Potencia a pesquisa de semelhanças vectoriais e as aplicações de IA e esforça-se por tornar as bases de dados vectoriais acessíveis a todas as organizações. O Milvus pode armazenar, indexar e gerenciar mais de um bilhão de embeddings vetoriais gerados por redes neurais profundas e outros modelos de aprendizado de máquina (ML).</p>
<p>O Milvus foi lançado sob a <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">licença Apache 2.0 de código aberto</a> em outubro de 2019. Atualmente, é um projeto de pós-graduação da <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. No momento em que este blog foi escrito, o Milvus havia atingido mais de <a href="https://hub.docker.com/r/milvusdb/milvus">50 milhões de</a> downloads <a href="https://hub.docker.com/r/milvusdb/milvus">do Docker pull</a> e era usado por <a href="https://milvus.io/">muitos clientes</a>, como NVIDIA, AT&amp;T, IBM, eBay, Shopee e Walmart.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Principais recursos do Milvus</h3><p>Como um banco de dados vetorial nativo da nuvem, o Milvus possui os seguintes recursos principais:</p>
<ul>
<li><p>Alto desempenho e pesquisa em milissegundos em conjuntos de dados vetoriais em escala de bilhões.</p></li>
<li><p>Suporte multilíngue e conjunto de ferramentas.</p></li>
<li><p>Escalabilidade horizontal e elevada fiabilidade, mesmo em caso de interrupção.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">Pesquisa híbrida</a>, conseguida através do emparelhamento da filtragem escalar com a pesquisa de semelhanças vectoriais.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Arquitetura de Milvus</h3><p>Milvus segue o princípio da separação entre o fluxo de dados e o fluxo de controlo. O sistema divide-se em quatro níveis, como mostra o diagrama:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitetura de Milvus</span> </span></p>
<p><em>Figura 2 Arquitetura Milvus</em></p>
<ul>
<li><p><strong>Camada de acesso:</strong> A camada de acesso é composta por um grupo de proxies sem estado e serve como camada frontal do sistema e ponto final para os utilizadores.</p></li>
<li><p><strong>Serviço de coordenação:</strong> O serviço de coordenação atribui tarefas aos nós de trabalho.</p></li>
<li><p><strong>Nós de trabalho:</strong> Os nós de trabalho são executores burros que seguem as instruções do serviço coordenador e executam comandos DML/DDL activados pelo utilizador.</p></li>
<li><p><strong>Armazenamento:</strong> O armazenamento é responsável pela persistência dos dados. Inclui um meta-armazenamento, um corretor de registos e um armazenamento de objectos.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Opções de implantação do Milvus</h3><p>O Milvus suporta três modos de execução: <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, Standalone, e Distributed</a>.</p>
<ul>
<li><p><strong>Milvus Lite</strong> é uma biblioteca Python que pode ser importada para aplicações locais. Como uma versão leve do Milvus, é ideal para prototipagem rápida em Jupyter Notebooks ou execução em dispositivos inteligentes com recursos limitados.</p></li>
<li><p><strong>O Milvus Standalone é</strong>uma implantação de servidor de máquina única. Se tiver uma carga de trabalho de produção, mas preferir não usar Kubernetes, executar o Milvus Standalone numa única máquina com memória suficiente é uma boa opção.</p></li>
<li><p><strong>Milvus Distributed</strong> pode ser implantado em clusters Kubernetes. Ele suporta conjuntos de dados maiores, maior disponibilidade e escalabilidade, e é mais adequado para ambientes de produção.</p></li>
</ul>
<p>O Milvus foi projetado desde o início para oferecer suporte ao Kubernetes e pode ser facilmente implantado na AWS. Podemos usar o Amazon Elastic Kubernetes Service (Amazon EKS) como o Kubernetes gerido, o Amazon S3 como o armazenamento de objectos, o Amazon Managed Streaming for Apache Kafka (Amazon MSK) como o armazenamento de mensagens e o Amazon Elastic Load Balancing (Amazon ELB) como o Load Balancer para criar um cluster de base de dados Milvus fiável e elástico.</p>
<p>Em seguida, forneceremos orientações passo a passo sobre a implantação de um cluster do Milvus usando o EKS e outros serviços.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">Implantação do Milvus no AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><p>Usaremos o AWS CLI para criar um cluster do EKS e implantar um banco de dados do Milvus. Os seguintes pré-requisitos são necessários:</p>
<ul>
<li><p>Um PC/Mac ou uma instância do Amazon EC2 com o<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> instalado e configurado com as permissões apropriadas. As ferramentas da CLI do AWS são instaladas por padrão se você usar o Amazon Linux 2 ou o Amazon Linux 2023.</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Ferramentas EKS instaladas</a>, incluindo Helm, Kubectl, eksctl, etc.</p></li>
<li><p>Um bucket do Amazon S3.</p></li>
<li><p>Uma instância do Amazon MSK.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">Considerações ao criar o MSK</h3><ul>
<li>A última versão estável do Milvus (v2.3.13) depende da funcionalidade <code translate="no">autoCreateTopics</code> do Kafka. Assim, ao criar o MSK, é necessário utilizar uma configuração personalizada e alterar a propriedade <code translate="no">auto.create.topics.enable</code> da predefinição <code translate="no">false</code> para <code translate="no">true</code>. Além disso, para aumentar o débito de mensagens do MSK, recomenda-se que os valores de <code translate="no">message.max.bytes</code> e <code translate="no">replica.fetch.max.bytes</code> sejam aumentados. Consulte <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">Configurações personalizadas do MSK</a> para obter detalhes.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>O Milvus não é compatível com a autenticação baseada em função IAM do MSK. Portanto, ao criar o MSK, habilite a opção <code translate="no">SASL/SCRAM authentication</code> na configuração de segurança e configure <code translate="no">username</code> e <code translate="no">password</code> no AWS Secrets Manager. Consulte <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">Autenticação de credenciais de entrada com o AWS Secrets Manager</a> para obter detalhes.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>Figura 3 Configurações de segurança: habilitar a autenticação SASL SCRAM.png</span> </span></p>
<p><em>Figura 3: Definições de segurança: ativar a autenticação SASL/SCRAM</em></p>
<ul>
<li>Precisamos habilitar o acesso ao grupo de segurança MSK do grupo de segurança ou intervalo de endereços IP do cluster EKS.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">Criando um cluster EKS</h3><p>Há muitas maneiras de criar um cluster EKS, como através do console, CloudFormation, eksctl, etc. Este post mostrará como criar um cluster EKS usando eksctl.</p>
<p><code translate="no">eksctl</code> é uma ferramenta simples de linha de comando para criar e gerenciar clusters Kubernetes no Amazon EKS. Ele fornece a maneira mais rápida e fácil de criar um novo cluster com nós para o Amazon EKS. Consulte <a href="https://eksctl.io/">o site</a> do eksctl para obter mais informações.</p>
<ol>
<li>Primeiro, crie um arquivo <code translate="no">eks_cluster.yaml</code> com o seguinte trecho de código. Substitua <code translate="no">cluster-name</code> pelo nome do cluster, substitua <code translate="no">region-code</code> pela região da AWS onde deseja criar o cluster e substitua <code translate="no">private-subnet-idx</code> pelas sub-redes privadas. Observação: esse arquivo de configuração cria um cluster EKS em um VPC existente especificando sub-redes privadas. Se quiser criar uma nova VPC, remova a configuração de VPC e sub-redes e, em seguida, o <code translate="no">eksctl</code> criará automaticamente uma nova.</li>
</ol>
<pre><code translate="no">apiVersion: eksctl.io/v1alpha5
kind: ClusterConfig

metadata:
 name: &lt;cluster-name&gt;
 region: &lt;region-code&gt;
 version: <span class="hljs-string">&quot;1.26&quot;</span>

iam:
 withOIDC: true

 serviceAccounts:
 - metadata:
     name: aws-load-balancer-controller
     namespace: kube-system
   wellKnownPolicies:
     awsLoadBalancerController: true
 - metadata:
     name: milvus-s3-access-sa
     <span class="hljs-comment"># if no namespace is set, &quot;default&quot; will be used;</span>
     <span class="hljs-comment"># the namespace will be created if it doesn&#x27;t exist already</span>
     namespace: milvus
     labels: {aws-usage: <span class="hljs-string">&quot;milvus&quot;</span>}
   attachPolicyARNs:
   - <span class="hljs-string">&quot;arn:aws:iam::aws:policy/AmazonS3FullAccess&quot;</span>

<span class="hljs-comment"># Use existed VPC to create EKS.</span>
<span class="hljs-comment"># If you don&#x27;t config vpc subnets, eksctl will automatically create a brand new VPC</span>
vpc:
 subnets:
   private:
     us-west-2a: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id1&gt; }
     us-west-2b: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id2&gt; }
     us-west-2c: { <span class="hljs-built_in">id</span>: &lt;private-subnet-id3&gt; }

managedNodeGroups:
 - name: ng-<span class="hljs-number">1</span>-milvus
   labels: { role: milvus }
   instanceType: m6i<span class="hljs-number">.2</span>xlarge
   desiredCapacity: <span class="hljs-number">3</span>
   privateNetworking: true
  
addons:
- name: vpc-cni <span class="hljs-comment"># no version is specified so it deploys the default version</span>
 attachPolicyARNs:
   - arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy
- name: coredns
 version: latest <span class="hljs-comment"># auto discovers the latest available</span>
- name: kube-proxy
 version: latest
- name: aws-ebs-csi-driver
 wellKnownPolicies:      <span class="hljs-comment"># add IAM and service account</span>
   ebsCSIController: true
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Em seguida, execute o comando <code translate="no">eksctl</code> para criar o cluster EKS.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Esse comando criará os seguintes recursos:</p>
<ul>
<li><p>Um cluster EKS com a versão especificada.</p></li>
<li><p>Um grupo de nós gerenciados com três instâncias EC2 m6i.2xlarge.</p></li>
<li><p>Um <a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">provedor de identidade IAM OIDC</a> e uma ServiceAccount chamada <code translate="no">aws-load-balancer-controller</code>, que usaremos posteriormente ao instalar o <strong>AWS Load Balancer Control</strong>ler.</p></li>
<li><p>Um namespace <code translate="no">milvus</code> e uma ServiceAccount <code translate="no">milvus-s3-access-sa</code> dentro desse namespace. Este namespace será utilizado mais tarde quando configurarmos o S3 como o armazenamento de objectos para o Milvus.</p>
<p>Nota: Para simplificar, o <code translate="no">milvus-s3-access-sa</code> aqui recebe permissões de acesso completo ao S3. Em implantações de produção, é recomendável seguir o princípio do menor privilégio e conceder acesso apenas ao bucket S3 específico usado para o Milvus.</p></li>
<li><p>Vários complementos, onde <code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> são complementos principais exigidos pelo EKS. <code translate="no">aws-ebs-csi-driver</code> é o driver CSI do AWS EBS que permite que os clusters EKS gerenciem o ciclo de vida dos volumes do Amazon EBS.</p></li>
</ul>
<p>Agora, só precisamos de esperar que a criação do cluster seja concluída.</p>
<p>Aguardar a conclusão da criação do cluster. Durante o processo de criação do cluster, o arquivo <code translate="no">kubeconfig</code> será criado ou atualizado automaticamente. Você também pode atualizá-lo manualmente executando o seguinte comando. Certifique-se de substituir <code translate="no">region-code</code> pela região do AWS onde o cluster está sendo criado e substitua <code translate="no">cluster-name</code> pelo nome do cluster.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Depois que o cluster for criado, você poderá exibir os nós executando:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Crie um <code translate="no">ebs-sc</code> StorageClass configurado com GP3 como o tipo de armazenamento e defina-o como o StorageClass padrão. O Milvus usa o etcd como seu Meta Storage e precisa dessa StorageClass para criar e gerenciar PVCs.</li>
</ol>
<pre><code translate="no">cat &lt;&lt;EOF | kubectl apply -f -
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
 name: ebs-sc
 annotations:
   storageclass.kubernetes.io/<span class="hljs-keyword">is</span>-default-<span class="hljs-keyword">class</span>: <span class="hljs-string">&quot;true&quot;</span>
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
 <span class="hljs-built_in">type</span>: gp3
EOF
<button class="copy-code-btn"></button></code></pre>
<p>De seguida, defina a StorageClass original de <code translate="no">gp2</code> como não predefinida:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Instale o AWS Load Balancer Controller. Usaremos esse controlador mais tarde para o Serviço Milvus e o Attu Ingress, portanto, vamos instalá-lo com antecedência.</li>
</ol>
<ul>
<li>Primeiro, adicione o repositório <code translate="no">eks-charts</code> e atualize-o.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Em seguida, instale o AWS Load Balancer Controller. Substitua <code translate="no">cluster-name</code> pelo nome do seu cluster. A ServiceAccount chamada <code translate="no">aws-load-balancer-controller</code> já foi criada quando criamos o cluster EKS nas etapas anteriores.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Verifique se o controlador foi instalado com êxito.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>A saída deve ser semelhante:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Implantação de um cluster Milvus</h3><p>O Milvus suporta vários métodos de implantação, como o Operator e o Helm. O Operator é mais simples, mas o Helm é mais direto e flexível. Neste exemplo, usaremos o Helm para implantar o Milvus.</p>
<p>Ao implementar o Milvus com o Helm, pode personalizar a configuração através do ficheiro <code translate="no">values.yaml</code>. Clique em <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a> para ver todas as opções. Por padrão, o Milvus cria o minio e o pulsar no cluster como o armazenamento de objetos e o armazenamento de mensagens, respetivamente. Faremos algumas alterações de configuração para torná-lo mais adequado para produção.</p>
<ol>
<li>Primeiro, adicione o repositório Milvus Helm e atualize-o.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Crie um arquivo <code translate="no">milvus_cluster.yaml</code> com o seguinte trecho de código. Este trecho de código personaliza a configuração do Milvus, como a configuração do Amazon S3 como o armazenamento de objetos e o Amazon MSK como a fila de mensagens. Forneceremos explicações detalhadas e orientações de configuração mais tarde.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 1</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure S3 as the Object Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Service account</span>
<span class="hljs-comment"># - this service account are used by External S3 access</span>
serviceAccount:
  create: false
  name: milvus-s3-access-sa

<span class="hljs-comment"># Close in-cluster minio</span>
minio:
  enabled: false

<span class="hljs-comment"># External S3</span>
<span class="hljs-comment"># - these configs are only used when `externalS3.enabled` is true</span>
externalS3:
  enabled: true
  host: <span class="hljs-string">&quot;s3.&lt;region-code&gt;.amazonaws.com&quot;</span>
  port: <span class="hljs-string">&quot;443&quot;</span>
  useSSL: true
  bucketName: <span class="hljs-string">&quot;&lt;bucket-name&gt;&quot;</span>
  rootPath: <span class="hljs-string">&quot;&lt;root-path&gt;&quot;</span>
  useIAM: true
  cloudProvider: <span class="hljs-string">&quot;aws&quot;</span>
  iamEndpoint: <span class="hljs-string">&quot;&quot;</span>

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 2</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Configure MSK as the Message Storage</span>
<span class="hljs-comment">#####################################</span>

<span class="hljs-comment"># Close in-cluster pulsar</span>
pulsar:
  enabled: false

<span class="hljs-comment"># External kafka</span>
<span class="hljs-comment"># - these configs are only used when `externalKafka.enabled` is true</span>
externalKafka:
  enabled: true
  brokerList: <span class="hljs-string">&quot;&lt;broker-list&gt;&quot;</span>
  securityProtocol: SASL_SSL
  sasl:
    mechanisms: SCRAM-SHA-<span class="hljs-number">512</span>
    username: <span class="hljs-string">&quot;&lt;username&gt;&quot;</span>
    password: <span class="hljs-string">&quot;&lt;password&gt;&quot;</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 3</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Expose the Milvus service to be accessed from outside the cluster (LoadBalancer service).</span>
<span class="hljs-comment"># or access it from within the cluster (ClusterIP service). Set the service type and the port to serve it.</span>
<span class="hljs-comment">#####################################</span>
service:
  <span class="hljs-built_in">type</span>: LoadBalancer
  port: <span class="hljs-number">19530</span>
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-<span class="hljs-built_in">type</span>: external <span class="hljs-comment">#AWS Load Balancer Controller fulfills services that has this annotation</span>
    service.beta.kubernetes.io/aws-load-balancer-name : milvus-service <span class="hljs-comment">#User defined name given to AWS Network Load Balancer</span>
    service.beta.kubernetes.io/aws-load-balancer-scheme: internal <span class="hljs-comment"># internal or internet-facing, later allowing for public access via internet</span>
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
    
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 4</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Installing Attu the Milvus management GUI</span>
<span class="hljs-comment">#####################################</span>
attu:
  enabled: true
  name: attu
  ingress:
    enabled: true
    annotations:
      kubernetes.io/ingress.<span class="hljs-keyword">class</span>: alb <span class="hljs-comment"># Annotation: set ALB ingress type</span>
      alb.ingress.kubernetes.io/scheme: internet-facing <span class="hljs-comment">#Places the load balancer on public subnets</span>
      alb.ingress.kubernetes.io/target-<span class="hljs-built_in">type</span>: ip <span class="hljs-comment">#The Pod IPs should be used as the target IPs (rather than the node IPs)</span>
      alb.ingress.kubernetes.io/group.name: attu <span class="hljs-comment"># Groups multiple Ingress resources</span>
    hosts:
      -
      
<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 5</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># HA deployment of Milvus Core Components</span>
<span class="hljs-comment">#####################################</span>
rootCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for root coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 2Gi
indexCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for index coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
queryCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for query coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
dataCoordinator:
  replicas: <span class="hljs-number">2</span>
  activeStandby:
    enabled: true  <span class="hljs-comment"># Enable active-standby when you set multiple replicas for data coordinator</span>
  resources:
    limits:
      cpu: <span class="hljs-string">&quot;0.5&quot;</span>
      memory: <span class="hljs-number">0.5</span>Gi
proxy:
  replicas: <span class="hljs-number">2</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi

<span class="hljs-comment">#####################################</span>
<span class="hljs-comment"># Section 6</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># Milvus Resource Allocation</span>
<span class="hljs-comment">#####################################</span>
queryNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">2</span>
      memory: 8Gi
dataNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">1</span>
      memory: 4Gi
indexNode:
  replicas: <span class="hljs-number">1</span>
  resources:
    limits:
      cpu: <span class="hljs-number">4</span>
      memory: 8Gi
<button class="copy-code-btn"></button></code></pre>
<p>O código contém seis secções. Siga as instruções a seguir para alterar as configurações correspondentes.</p>
<p><strong>Secção 1</strong>: Configurar o S3 como armazenamento de objectos. O serviceAccount concede ao Milvus acesso ao S3 (neste caso, é <code translate="no">milvus-s3-access-sa</code>, que foi criado quando criámos o cluster EKS). Certifique-se de que substitui <code translate="no">&lt;region-code&gt;</code> pela região AWS onde o seu cluster está localizado. Substitua <code translate="no">&lt;bucket-name&gt;</code> pelo nome do seu bucket S3 e <code translate="no">&lt;root-path&gt;</code> pelo prefixo do bucket S3 (este campo pode ser deixado vazio).</p>
<p><strong>Secção 2</strong>: Configurar o MSK como armazenamento de mensagens. Substitua <code translate="no">&lt;broker-list&gt;</code> pelos endereços de ponto de extremidade correspondentes ao tipo de autenticação SASL/SCRAM do MSK. Substitua <code translate="no">&lt;username&gt;</code> e <code translate="no">&lt;password&gt;</code> pelo nome de utilizador e palavra-passe da conta MSK. Pode obter o endereço <code translate="no">&lt;broker-list&gt;</code> a partir das informações do cliente MSK, como mostra a imagem abaixo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>Figura 4: Configurar o MSK como armazenamento de mensagens do Milvus.png</span> </span></p>
<p><em>Figura 4: Configurar o MSK como armazenamento de mensagens do Milvus</em></p>
<p><strong>Secção 3:</strong> Expor o serviço Milvus e permitir o acesso a partir do exterior do cluster. O ponto de extremidade do Milvus usou o serviço do tipo ClusterIP por padrão, que só é acessível dentro do cluster EKS. Se necessário, é possível alterá-lo para o tipo LoadBalancer para permitir o acesso de fora do cluster EKS. O serviço do tipo LoadBalancer usa o Amazon NLB como balanceador de carga. De acordo com as práticas recomendadas de segurança, <code translate="no">aws-load-balancer-scheme</code> é configurado como modo interno por padrão aqui, o que significa que apenas o acesso à intranet para Milvus é permitido. Clique para <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">ver as instruções de configuração do NLB</a>.</p>
<p><strong>Secção 4:</strong> Instale e configure <a href="https://github.com/zilliztech/attu">o Attu</a>, uma ferramenta de administração do Milvus de código aberto. Ela tem uma GUI intuitiva que permite interagir facilmente com o Milvus. Ativamos o Attu, configuramos o ingresso usando o AWS ALB e o definimos como <code translate="no">internet-facing</code> type para que o Attu possa ser acessado pela Internet. Clique <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">neste documento</a> para obter o guia de configuração do ALB.</p>
<p><strong>Secção 5:</strong> Ativar a implementação HA dos componentes principais do Milvus. O Milvus contém vários componentes independentes e desacoplados. Por exemplo, o serviço coordenador actua como a camada de controlo, tratando da coordenação dos componentes Root, Query, Data e Index. O Proxy na camada de acesso serve como ponto final de acesso à base de dados. Estes componentes são predefinidos para apenas 1 réplica de pod. A implantação de várias réplicas desses componentes de serviço é especialmente necessária para melhorar a disponibilidade do Milvus.</p>
<p><strong>Nota:</strong> a implantação de várias réplicas dos componentes do coordenador Root, Query, Data e Index requer a opção <code translate="no">activeStandby</code> ativada.</p>
<p><strong>Secção 6:</strong> Ajustar a atribuição de recursos aos componentes do Milvus para satisfazer os requisitos das cargas de trabalho. O site do Milvus também fornece uma <a href="https://milvus.io/tools/sizing/">ferramenta de dimensionamento</a> para gerar sugestões de configuração com base no volume de dados, dimensões dos vectores, tipos de índices, etc. Também pode gerar um ficheiro de configuração Helm com apenas um clique. A configuração seguinte é a sugestão dada pela ferramenta para 1 milhão de vectores de 1024 dimensões e tipo de índice HNSW.</p>
<ol>
<li>Utilize o Helm para criar o Milvus (implementado no espaço de nomes <code translate="no">milvus</code>). Nota: Pode substituir <code translate="no">&lt;demo&gt;</code> por um nome personalizado.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Execute o seguinte comando para verificar o status da implantação.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>A saída a seguir mostra que os componentes do Milvus estão todos DISPONÍVEIS e que os componentes de coordenação têm várias réplicas ativadas.</p>
<pre><code translate="no">NAME                     READY   UP-TO-DATE   AVAILABLE   AGE
demo-milvus-attu         1/1     1            1           5m27s
demo-milvus-datacoord    2/2     2            2           5m27s
demo-milvus-datanode     1/1     1            1           5m27s
demo-milvus-indexcoord   2/2     2            2           5m27s
demo-milvus-indexnode    1/1     1            1           5m27s
demo-milvus-proxy        2/2     2            2           5m27s
demo-milvus-querycoord   2/2     2            2           5m27s
demo-milvus-querynode    1/1     1            1           5m27s
demo-milvus-rootcoord    2/2     2            2           5m27s
<button class="copy-code-btn"></button></code></pre>
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Acessando e gerenciando o Milvus</h3><p>Até agora, implantamos com sucesso o banco de dados de vetores do Milvus. Agora, podemos acessar o Milvus por meio de pontos de extremidade. Milvus expõe pontos finais através dos serviços Kubernetes. A Attu expõe pontos finais através do Kubernetes Ingress.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Aceder aos pontos finais do Milvus</strong></h4><p>Execute o seguinte comando para obter pontos finais de serviço:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Pode ver vários serviços. O Milvus suporta duas portas, a porta <code translate="no">19530</code> e a porta <code translate="no">9091</code>:</p>
<ul>
<li>A porta <code translate="no">19530</code> destina-se ao gRPC e à API RESTful. É a porta predefinida quando se liga a um servidor Milvus com diferentes SDKs Milvus ou clientes HTTP.</li>
<li>A porta <code translate="no">9091</code> é uma porta de gerenciamento para coleta de métricas, perfil de pprof e sondas de integridade no Kubernetes.</li>
</ul>
<p>O serviço <code translate="no">demo-milvus</code> fornece um ponto de extremidade de acesso à base de dados, que é utilizado para estabelecer uma ligação a partir de clientes. Ele usa o NLB como o balanceador de carga do serviço. Você pode obter o ponto de extremidade do serviço na coluna <code translate="no">EXTERNAL-IP</code>.</p>
<pre><code translate="no">NAME                     TYPE           CLUSTER-IP       EXTERNAL-IP                                               PORT(S)                          AGE
demo-etcd                ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.103</span><span class="hljs-number">.138</span>   &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-etcd-headless       ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">2379</span>/TCP,<span class="hljs-number">2380</span>/TCP                62m
demo-milvus              LoadBalancer   <span class="hljs-number">172.20</span><span class="hljs-number">.219</span><span class="hljs-number">.33</span>    milvus-nlb-xxxx.elb.us-west-<span class="hljs-number">2.</span>amazonaws.com               <span class="hljs-number">19530</span>:<span class="hljs-number">31201</span>/TCP,<span class="hljs-number">9091</span>:<span class="hljs-number">31088</span>/TCP   62m
demo-milvus-datacoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.214</span><span class="hljs-number">.106</span>   &lt;none&gt;                                                    <span class="hljs-number">13333</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-datanode     ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-indexcoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.106</span><span class="hljs-number">.51</span>    &lt;none&gt;                                                    <span class="hljs-number">31000</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-indexnode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-querycoord   ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.136</span><span class="hljs-number">.213</span>   &lt;none&gt;                                                    <span class="hljs-number">19531</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
demo-milvus-querynode    ClusterIP      <span class="hljs-literal">None</span>             &lt;none&gt;                                                    <span class="hljs-number">9091</span>/TCP                         62m
demo-milvus-rootcoord    ClusterIP      <span class="hljs-number">172.20</span><span class="hljs-number">.173</span><span class="hljs-number">.98</span>    &lt;none&gt;                                                    <span class="hljs-number">53100</span>/TCP,<span class="hljs-number">9091</span>/TCP               62m
<button class="copy-code-btn"></button></code></pre>
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Gerir o Milvus utilizando o Attu</strong></h4><p>Conforme descrito anteriormente, instalámos a Attu para gerir o Milvus. Execute o seguinte comando para obter o ponto de extremidade:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Pode ver um Ingress chamado <code translate="no">demo-milvus-attu</code>, em que a coluna <code translate="no">ADDRESS</code> é o URL de acesso.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Abra o endereço do Ingress num browser e veja a seguinte página. Clique em <strong>Connect (Ligar</strong> ) para iniciar sessão.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>Figura 5: Iniciar sessão na sua conta Attu.png</span> </span></p>
<p><em>Figura 5: Iniciar sessão na sua conta Attu</em></p>
<p>Depois de iniciar a sessão, pode gerir as bases de dados do Milvus através do Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>Figura 6 A interface da Attu.png</span> </span></p>
<p>Figura 6: A interface da Attu</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Testar a base de dados de vectores do Milvus<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos utilizar o <a href="https://milvus.io/docs/example_code.md">código de exemplo</a> do Milvus para testar se a base de dados do Milvus está a funcionar corretamente. Em primeiro lugar, descarregue o código de exemplo <code translate="no">hello_milvus.py</code> utilizando o seguinte comando:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modifique o anfitrião no código de exemplo para o ponto de extremidade do serviço Milvus.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Execute o código:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Se o sistema devolver o seguinte resultado, isso indica que o Milvus está a funcionar normalmente.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Este post apresenta <a href="https://milvus.io/intro">o Milvus</a>, um dos bancos de dados vetoriais de código aberto mais populares, e fornece um guia sobre a implantação do Milvus na AWS usando serviços gerenciados como Amazon EKS, S3, MSK e ELB para obter maior elasticidade e confiabilidade.</p>
<p>Como um componente central de vários sistemas GenAI, particularmente Retrieval Augmented Generation (RAG), o Milvus suporta e integra-se com uma variedade de modelos e estruturas GenAI mainstream, incluindo Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex e LangChain. Comece sua jornada de inovação GenAI com Milvus hoje mesmo!</p>
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Guia do utilizador do Amazon EKS</a></li>
<li><a href="https://milvus.io/">Site oficial do Milvus</a></li>
<li><a href="https://github.com/milvus-io/milvus">Repositório GitHub do Milvus</a></li>
<li><a href="https://eksctl.io/">Site oficial do eksctl</a></li>
</ul>
