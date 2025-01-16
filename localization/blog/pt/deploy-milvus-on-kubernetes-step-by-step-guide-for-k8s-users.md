---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: >-
  Implantação do Milvus no Kubernetes: Um guia passo-a-passo para utilizadores
  de Kubernetes
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  Este guia fornecerá uma explicação clara e passo a passo para configurar o
  Milvus no Kubernetes usando o Milvus Operator.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>O Milvus</strong></a> é um <a href="https://zilliz.com/learn/what-is-vector-database">banco de dados vetorial</a> de código aberto projetado para armazenar, indexar e pesquisar grandes quantidades de <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a> por meio de representações vetoriais, tornando-o perfeito para aplicativos orientados por IA, como pesquisa de similaridade, <a href="https://zilliz.com/glossary/semantic-search">pesquisa semântica</a>, geração aumentada de recuperação<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), mecanismos de recomendação e outras tarefas de aprendizado de máquina.</p>
<p>Mas o que torna o Milvus ainda mais poderoso é a sua integração perfeita com o Kubernetes. Se é um aficionado do Kubernetes, sabe que a plataforma é perfeita para orquestrar sistemas distribuídos e escaláveis. O Milvus tira o máximo partido das capacidades do Kubernetes, permitindo-lhe implementar, escalar e gerir facilmente clusters distribuídos do Milvus. Este guia fornecerá uma explicação clara e passo a passo para configurar o Milvus no Kubernetes usando o Milvus Operator.</p>
<h2 id="Prerequisites" class="common-anchor-header">Pré-requisitos<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de começarmos, certifique-se de ter os seguintes pré-requisitos em vigor:</p>
<ul>
<li><p>Um cluster do Kubernetes instalado e em execução. Se você estiver testando localmente, <code translate="no">minikube</code> é uma ótima escolha.</p></li>
<li><p><code translate="no">kubectl</code> O sistema operacional Kubernetes está instalado e configurado para interagir com seu cluster do Kubernetes.</p></li>
<li><p>Familiaridade com os conceitos básicos do Kubernetes, como pods, serviços e implantações.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">Etapa 1: Instalando o Minikube (para testes locais)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Se precisar de configurar um ambiente Kubernetes local, <code translate="no">minikube</code> é a ferramenta ideal para si. As instruções oficiais de instalação estão na <a href="https://minikube.sigs.k8s.io/docs/start/">página de introdução do minikube</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. Instalar o Minikube</h3><p>Visite a<a href="https://github.com/kubernetes/minikube/releases"> página de lançamentos do minikube</a> e descarregue a versão apropriada para o seu sistema operativo. Para macOS/Linux, pode utilizar o seguinte comando:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. Iniciar o Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. Interagir com o cluster</h3><p>Agora, pode interagir com os seus clusters com o kubectl dentro do minikube. Se não tiver instalado o kubectl, o minikube baixará a versão apropriada por padrão.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>Como alternativa, é possível criar um link simbólico para o binário do minikube chamado <code translate="no">kubectl</code> para facilitar o uso.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">Etapa 2: Configurando a StorageClass<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>No Kubernetes, uma <strong>StorageClass</strong> define os tipos de armazenamento disponíveis para suas cargas de trabalho, fornecendo flexibilidade no gerenciamento de diferentes configurações de armazenamento. Antes de continuar, você deve garantir que uma StorageClass padrão esteja disponível no seu cluster. Veja como verificar e configurar uma, se necessário.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. Verificar as StorageClasses instaladas</h3><p>Para ver as StorageClasses disponíveis no seu cluster Kubernetes, execute o seguinte comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>Isso exibirá a lista de classes de armazenamento instaladas no seu cluster. Se uma StorageClass padrão já estiver configurada, ela será marcada com <code translate="no">(default)</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. Configurar uma StorageClass padrão (se necessário)</h3><p>Se nenhuma StorageClass padrão estiver configurada, é possível criar uma definindo-a em um arquivo YAML. Use o exemplo a seguir para criar uma StorageClass padrão:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>Esta configuração YAML define um <code translate="no">StorageClass</code> chamado <code translate="no">default-storageclass</code> que usa o provisionador <code translate="no">minikube-hostpath</code>, normalmente usado em ambientes de desenvolvimento local.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. Aplicar a StorageClass</h3><p>Depois que o arquivo <code translate="no">default-storageclass.yaml</code> for criado, aplique-o ao seu cluster usando o seguinte comando:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Isso configurará a StorageClass padrão para seu cluster, garantindo que suas necessidades de armazenamento sejam gerenciadas adequadamente no futuro.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">Etapa 3: Instalando o Milvus usando o Milvus Operator<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus Operator simplifica a implantação do Milvus no Kubernetes, gerenciando a implantação, o dimensionamento e as atualizações. Antes de instalar o Milvus Operator, você precisará instalar o <strong>cert-manager</strong>, que fornece certificados para o servidor webhook usado pelo Milvus Operator.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. Instalar o cert-manager</h3><p>O Milvus Operator necessita de um <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a> para gerir os certificados para uma comunicação segura. Certifique-se de que instala <strong>o cert-manager versão 1.1.3</strong> ou posterior. Para o instalar, execute o seguinte comando:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Após a instalação, verifique se os pods do cert-manager estão a funcionar, executando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. Instalar o Operador Milvus</h3><p>Assim que o cert-manager estiver a funcionar, pode instalar o Milvus Operator. Execute o seguinte comando para o implementar utilizando <code translate="no">kubectl</code>:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Pode verificar se o pod do Milvus Operator está a funcionar utilizando o seguinte comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Implementar o Cluster Milvus</h3><p>Quando o pod do Operador Milvus estiver a funcionar, pode implementar um cluster Milvus com o operador. O comando a seguir implanta um cluster do Milvus com seus componentes e dependências em pods separados usando as configurações padrão:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para personalizar as definições do Milvus, terá de substituir o ficheiro YAML pelo seu próprio ficheiro YAML de configuração. Além de editar ou criar manualmente o ficheiro, pode utilizar a Milvus Sizing Tool para ajustar as configurações e, em seguida, transferir o ficheiro YAML correspondente.</p>
<p>Para personalizar as definições do Milvus, é necessário substituir o ficheiro YAML predefinido pela sua própria configuração. Pode editar ou criar manualmente este ficheiro, adaptando-o às suas necessidades específicas.</p>
<p>Em alternativa, pode utilizar a <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> para uma abordagem mais simplificada. Esta ferramenta permite-lhe ajustar várias definições, como a atribuição de recursos e as opções de armazenamento, e depois descarregar o ficheiro YAML correspondente com as configurações pretendidas. Isso garante que a implantação do Milvus seja otimizada para o seu caso de uso específico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Ferramenta de dimensionamento do Milvus</p>
<p>Pode demorar algum tempo a concluir a implementação. Pode verificar o estado do seu cluster Milvus através do comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando o cluster do Milvus estiver pronto, todos os pods no cluster do Milvus deverão estar em execução ou concluídos:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">Passo 4: Acessando seu cluster Milvus<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Assim que o seu cluster Milvus for implantado, você precisa acessá-lo encaminhando uma porta local para a porta de serviço do Milvus. Siga estas etapas para recuperar a porta de serviço e configurar o encaminhamento de porta.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. Obter a porta de serviço</strong></h4><p>Primeiro, identifique a porta de serviço usando o seguinte comando. Substitua <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> pelo nome do seu pod proxy Milvus, que normalmente começa com <code translate="no">my-release-milvus-proxy-</code>:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Este comando devolverá o número da porta que o seu serviço Milvus está a utilizar.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. Encaminhar a porta</strong></h4><p>Para aceder ao seu cluster Milvus localmente, reencaminhe uma porta local para a porta de serviço utilizando o seguinte comando. Substitua <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> pela porta local que deseja usar e <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> pela porta de serviço recuperada na etapa anterior:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Esse comando permite que o encaminhamento de porta escute em todos os endereços IP da máquina host. Se você só precisa que o serviço escute em <code translate="no">localhost</code>, você pode omitir a opção <code translate="no">--address 0.0.0.0</code>.</p>
<p>Uma vez configurado o encaminhamento de porta, pode aceder ao seu cluster Milvus através da porta local especificada para outras operações ou integrações.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">Passo 5: Ligar ao Milvus usando o Python SDK<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o seu cluster Milvus instalado e a funcionar, pode agora interagir com ele utilizando qualquer SDK Milvus. Neste exemplo, usaremos <a href="https://zilliz.com/blog/what-is-pymilvus">o PyMilvus</a>, o <strong>SDK Python</strong> do Milvus <strong>,</strong> para nos conectarmos ao cluster e realizar operações básicas.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. Instalar o PyMilvus</h3><p>Para interagir com o Milvus através de Python, é necessário instalar o pacote <code translate="no">pymilvus</code>:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Ligar ao Milvus</h3><p>Segue-se um exemplo de script Python que se liga ao seu cluster Milvus e demonstra como executar operações básicas, como a criação de uma coleção.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Connect to the Milvus server</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:&lt;YOUR_LOCAL_PORT&gt;&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Create a collection</span>
collection_name = <span class="hljs-string">&quot;example_collection&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name):
   client.drop_collection(collection_name)
client.create_collection(
   collection_name=collection_name,
   dimension=<span class="hljs-number">768</span>,  <span class="hljs-comment"># The vectors we will use in this demo has 768 dimensions</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Explanation" class="common-anchor-header">Explicação:</h4><ul>
<li><p>Ligar ao Milvus: O script liga-se ao servidor Milvus em execução em <code translate="no">localhost</code> utilizando a porta local que configurou no Passo 4.</p></li>
<li><p>Criar uma coleção: Verifica se já existe uma coleção com o nome <code translate="no">example_collection</code>, elimina-a em caso afirmativo e cria uma nova coleção com vectores de 768 dimensões.</p></li>
</ul>
<p>Este script estabelece uma conexão com o cluster Milvus e cria uma coleção, servindo como ponto de partida para operações mais complexas, como inserir vetores e realizar pesquisas de similaridade.</p>
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
    </button></h2><p>A implantação do Milvus em uma configuração distribuída no Kubernetes desbloqueia recursos poderosos para gerenciar dados vetoriais em grande escala, permitindo escalabilidade contínua e aplicativos orientados por IA de alto desempenho. Seguindo este guia, você aprendeu como configurar o Milvus usando o Milvus Operator, tornando o processo simplificado e eficiente.</p>
<p>À medida que você continua a explorar o Milvus, considere dimensionar seu cluster para atender às demandas crescentes ou implantá-lo em plataformas de nuvem, como Amazon EKS, Google Cloud ou Microsoft Azure. Para uma gestão e monitorização melhoradas, ferramentas como o <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a> e <a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> oferecem um suporte valioso para manter a saúde e o desempenho das suas implementações.</p>
<p>Agora você está pronto para aproveitar todo o potencial do Milvus no Kubernetes - feliz implantação! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">Recursos adicionais<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Documentação do Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Autónomo vs. Distribuído: Qual é o modo certo para si? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">Supercharging Vetor Search: Milvus em GPUs com NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">O que é RAG? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Centro de recursos de IA generativa | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Modelos de IA com melhor desempenho para seus aplicativos GenAI | Zilliz</a></p></li>
</ul>
