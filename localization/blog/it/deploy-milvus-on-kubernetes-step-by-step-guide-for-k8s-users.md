---
id: deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
title: >-
  Distribuzione di Milvus su Kubernetes: Una guida passo-passo per gli utenti di
  Kubernetes
author: Gael Gu
date: 2024-09-26T00:00:00.000Z
desc: >-
  Questa guida fornisce un percorso chiaro e passo passo per la configurazione
  di Milvus su Kubernetes utilizzando Milvus Operator.
cover: >-
  assets.zilliz.com/Deploying_Milvus_on_Kubernetes_A_Step_by_Step_Guide_for_Kubernetes_Users_4193487867.png
tag: Engineering
tags: 'Vector Databases, Milvus, RAG, LLM, K8s Deployment'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deploy-milvus-on-kubernetes-step-by-step-guide-for-k8s-users.md
---
<p><a href="https://zilliz.com/what-is-milvus"><strong>Milvus</strong></a> è un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> open source progettato per archiviare, indicizzare e ricercare enormi quantità di <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dati non strutturati</a> attraverso rappresentazioni vettoriali, il che lo rende perfetto per le applicazioni orientate all'intelligenza artificiale, come la ricerca per similarità, la <a href="https://zilliz.com/glossary/semantic-search">ricerca semantica</a>, la retrieval augmented generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), i motori di raccomandazione e altre attività di apprendimento automatico.</p>
<p>Ma ciò che rende Milvus ancora più potente è la sua perfetta integrazione con Kubernetes. Se siete appassionati di Kubernetes, sapete che la piattaforma è perfetta per l'orchestrazione di sistemi scalabili e distribuiti. Milvus sfrutta appieno le capacità di Kubernetes, consentendo di distribuire, scalare e gestire facilmente cluster Milvus distribuiti. Questa guida fornisce una guida chiara e passo passo per configurare Milvus su Kubernetes utilizzando Milvus Operator.</p>
<h2 id="Prerequisites" class="common-anchor-header">Prerequisiti<button data-href="#Prerequisites" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di iniziare, assicuratevi di disporre dei seguenti prerequisiti:</p>
<ul>
<li><p>Un cluster Kubernetes attivo e funzionante. Se si tratta di test locali, <code translate="no">minikube</code> è un'ottima scelta.</p></li>
<li><p><code translate="no">kubectl</code> installato e configurato per interagire con il cluster Kubernetes.</p></li>
<li><p>familiarità con i concetti di base di Kubernetes, come pod, servizi e distribuzioni.</p></li>
</ul>
<h2 id="Step-1-Installing-Minikube-For-Local-Testing" class="common-anchor-header">Passo 1: Installazione di Minikube (per test locali)<button data-href="#Step-1-Installing-Minikube-For-Local-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Se avete bisogno di configurare un ambiente Kubernetes locale, <code translate="no">minikube</code> è lo strumento che fa per voi. Le istruzioni ufficiali per l'installazione si trovano nella <a href="https://minikube.sigs.k8s.io/docs/start/">pagina di avvio di minikube</a>.</p>
<h3 id="1-Install-Minikube" class="common-anchor-header">1. Installare Minikube</h3><p>Visitate la<a href="https://github.com/kubernetes/minikube/releases"> pagina</a> dei<a href="https://github.com/kubernetes/minikube/releases"> rilasci di minikube</a> e scaricate la versione appropriata per il vostro sistema operativo. Per macOS/Linux, si può usare il seguente comando:</p>
<pre><code translate="no">$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
$ <span class="hljs-built_in">sudo</span> install minikube-linux-amd64 /usr/local/bin/minikube &amp;&amp; <span class="hljs-built_in">rm</span> minikube-linux-amd64
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Start-Minikube" class="common-anchor-header">2. Avviare Minikube</h3><pre><code translate="no">$ minikube start
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Interact-with-Cluster" class="common-anchor-header">3. Interagire con il cluster</h3><p>Ora è possibile interagire con i cluster con kubectl all'interno di minikube. Se non avete installato kubectl, minikube scaricherà la versione appropriata per impostazione predefinita.</p>
<pre><code translate="no">$ minikube kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<p>In alternativa, si può creare un collegamento simbolico al binario di minikube, chiamato <code translate="no">kubectl</code>, per facilitarne l'uso.</p>
<pre><code translate="no">$ <span class="hljs-built_in">sudo</span> <span class="hljs-built_in">ln</span> -s $(<span class="hljs-built_in">which</span> minikube) /usr/local/bin/kubectl
$ kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-2-Configuring-the-StorageClass" class="common-anchor-header">Passo 2: Configurazione della StorageClass<button data-href="#Step-2-Configuring-the-StorageClass" class="anchor-icon" translate="no">
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
    </button></h2><p>In Kubernetes, una <strong>StorageClass</strong> definisce i tipi di storage disponibili per i carichi di lavoro, fornendo flessibilità nella gestione di diverse configurazioni di storage. Prima di procedere, è necessario assicurarsi che nel cluster sia disponibile una StorageClass predefinita. Ecco come verificare e, se necessario, configurare una StorageClass.</p>
<h3 id="1-Check-Installed-StorageClasses" class="common-anchor-header">1. Controllare le StorageClass installate</h3><p>Per vedere le StorageClass disponibili nel cluster Kubernetes, eseguire il seguente comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>Questo visualizzerà l'elenco delle classi di storage installate nel cluster. Se una StorageClass predefinita è già configurata, sarà contrassegnata da <code translate="no">(default)</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/storage_classes_installed_in_your_cluster_21d36d6ac8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Configure-a-Default-StorageClass-if-necessary" class="common-anchor-header">2. Configurare una StorageClass predefinita (se necessario)</h3><p>Se non è stata impostata una StorageClass predefinita, è possibile crearne una definendola in un file YAML. Utilizzare l'esempio seguente per creare una StorageClass predefinita:</p>
<pre><code translate="no"><span class="hljs-attr">apiVersion</span>: storage.<span class="hljs-property">k8s</span>.<span class="hljs-property">io</span>/v1
<span class="hljs-attr">kind</span>: <span class="hljs-title class_">StorageClass</span>
<span class="hljs-attr">metadata</span>:
 <span class="hljs-attr">name</span>: <span class="hljs-keyword">default</span>-storage<span class="hljs-keyword">class</span>
<span class="hljs-title class_">provisioner</span>: k8s.<span class="hljs-property">io</span>/minikube-hostpath
<button class="copy-code-btn"></button></code></pre>
<p>Questa configurazione YAML definisce un <code translate="no">StorageClass</code> chiamato <code translate="no">default-storageclass</code> che utilizza il provisioner <code translate="no">minikube-hostpath</code>, comunemente usato negli ambienti di sviluppo locali.</p>
<h3 id="3-Apply-the-StorageClass" class="common-anchor-header">3. Applicare la StorageClass</h3><p>Una volta creato il file <code translate="no">default-storageclass.yaml</code>, applicarlo al cluster con il seguente comando:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-keyword">default</span>-storageclass.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>In questo modo si imposterà la StorageClass predefinita per il cluster, assicurando che le esigenze di storage siano gestite correttamente in futuro.</p>
<h2 id="Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="common-anchor-header">Passo 3: Installazione di Milvus con l'Operatore Milvus<button data-href="#Step-3-Installing-Milvus-Using-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>L'Operatore Milvus semplifica la distribuzione di Milvus su Kubernetes, gestendo la distribuzione, il ridimensionamento e gli aggiornamenti. Prima di installare Milvus Operator, è necessario installare il <strong>cert-manager</strong>, che fornisce i certificati per il server webhook utilizzato da Milvus Operator.</p>
<h3 id="1-Install-cert-manager" class="common-anchor-header">1. Installare cert-manager</h3><p>Milvus Operator richiede un <a href="https://cert-manager.io/docs/installation/supported-releases/">cert-manager</a> per gestire i certificati per la comunicazione sicura. Assicurarsi di installare <strong>cert-manager versione 1.1.3</strong> o successiva. Per installarlo, eseguire il seguente comando:</p>
<pre><code translate="no">$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.5.3/cert-manager.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Dopo l'installazione, verificare che i pod cert-manager siano in esecuzione eseguendo:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n cert-manager
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/verify_that_the_cert_manager_pods_are_running_bb44c2b6d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Install-the-Milvus-Operator" class="common-anchor-header">2. Installare l'operatore Milvus</h3><p>Una volta che il cert-manager è attivo e funzionante, è possibile installare Milvus Operator. Eseguire il seguente comando per distribuirlo usando <code translate="no">kubectl</code>:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>È possibile verificare se il pod Milvus Operator è in esecuzione utilizzando il seguente comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_if_the_Milvus_Operator_pod_is_running_6e7ac41ebf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Deploy-Milvus-Cluster" class="common-anchor-header">3. Distribuire il cluster Milvus</h3><p>Una volta che il pod Milvus Operator è in esecuzione, è possibile distribuire un cluster Milvus con l'operatore. Il comando seguente distribuisce un cluster Milvus con i suoi componenti e le sue dipendenze in pod separati, utilizzando le configurazioni predefinite:</p>
<pre><code translate="no">$ kubectl apply -f <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deploy_Milvus_Cluster_8b5d5343af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per personalizzare le impostazioni di Milvus, è necessario sostituire il file YAML con il proprio file YAML di configurazione. Oltre a modificare o creare manualmente il file, è possibile utilizzare Milvus Sizing Tool per regolare le configurazioni e scaricare il file YAML corrispondente.</p>
<p>Per personalizzare le impostazioni di Milvus, è necessario sostituire il file YAML predefinito con la propria configurazione. È possibile modificare o creare manualmente questo file, adattandolo alle proprie esigenze specifiche.</p>
<p>In alternativa, è possibile utilizzare lo <a href="https://milvus.io/tools/sizing"><strong>strumento di dimensionamento di Milvus</strong></a> per un approccio più semplice. Questo strumento consente di regolare varie impostazioni, come l'allocazione delle risorse e le opzioni di archiviazione, per poi scaricare il file YAML corrispondente con le configurazioni desiderate. In questo modo si garantisce che la distribuzione di Milvus sia ottimizzata per il caso d'uso specifico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_sizing_tool_024693df9d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Strumento di dimensionamento di Milvus</p>
<p>La distribuzione potrebbe richiedere un po' di tempo per essere completata. È possibile controllare lo stato del cluster Milvus tramite il comando:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> milvus my-release
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_the_status_of_your_Milvus_cluster_bcbd85fd70.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una volta che il cluster Milvus è pronto, tutti i pod nel cluster Milvus dovrebbero essere in esecuzione o completati:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pods
<button class="copy-code-btn"></button></code></pre>
<h2 id="Step-4-Accessing-Your-Milvus-Cluster" class="common-anchor-header">Passo 4: Accesso al cluster Milvus<button data-href="#Step-4-Accessing-Your-Milvus-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta distribuito il cluster Milvus, è necessario accedervi inoltrando una porta locale alla porta di servizio di Milvus. Seguite questi passaggi per recuperare la porta di servizio e impostare l'inoltro della porta.</p>
<h4 id="1-Get-the-Service-Port" class="common-anchor-header"><strong>1. Recupero della porta di servizio</strong></h4><p>Innanzitutto, identificate la porta del servizio utilizzando il seguente comando. Sostituire <code translate="no">&lt;YOUR_MILVUS_PROXY_POD&gt;</code> con il nome del pod proxy Milvus, che di solito inizia con <code translate="no">my-release-milvus-proxy-</code>:</p>
<pre><code translate="no">$ kubectl <span class="hljs-keyword">get</span> pod &lt;YOUR_MILVUS_PROXY_POD&gt; --template =<span class="hljs-string">&#x27;{{(index (index .spec.containers 0).ports 0).containerPort}}{{&quot;\n&quot;}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Questo comando restituirà il numero di porta che il servizio Milvus sta utilizzando.</p>
<h4 id="2-Forward-the-Port" class="common-anchor-header"><strong>2. Inoltrare la porta</strong></h4><p>Per accedere al cluster Milvus localmente, inoltrare una porta locale alla porta del servizio usando il seguente comando. Sostituire <code translate="no">&lt;YOUR_LOCAL_PORT&gt;</code> con la porta locale che si desidera utilizzare e <code translate="no">&lt;YOUR_SERVICE_PORT&gt;</code> con la porta del servizio recuperata nel passaggio precedente:</p>
<pre><code translate="no">$ kubectl port-forward --address 0.0.0.0 service/my-release-milvus &lt;YOUR_LOCAL_PORT&gt;:&lt;YOUR_SERVICE_PORT&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Questo comando consente l'inoltro della porta in ascolto su tutti gli indirizzi IP della macchina host. Se si desidera che il servizio sia in ascolto solo su <code translate="no">localhost</code>, si può omettere l'opzione <code translate="no">--address 0.0.0.0</code>.</p>
<p>Una volta impostato il port-forwarding, è possibile accedere al cluster Milvus tramite la porta locale specificata per ulteriori operazioni o integrazioni.</p>
<h2 id="Step-5-Connecting-to-Milvus-Using-Python-SDK" class="common-anchor-header">Passo 5: Connessione a Milvus con l'SDK Python<button data-href="#Step-5-Connecting-to-Milvus-Using-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il vostro cluster Milvus attivo e funzionante, potete ora interagire con esso utilizzando qualsiasi SDK Milvus. In questo esempio, useremo <a href="https://zilliz.com/blog/what-is-pymilvus">PyMilvus</a>, l'<strong>SDK Python</strong> di Milvus <strong>,</strong> per connetterci al cluster ed eseguire le operazioni di base.</p>
<h3 id="1-Install-PyMilvus" class="common-anchor-header">1. Installare PyMilvus</h3><p>Per interagire con Milvus tramite Python, è necessario installare il pacchetto <code translate="no">pymilvus</code>:</p>
<pre><code translate="no">$ pip install pymilvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Connect-to-Milvus" class="common-anchor-header">2. Connettersi a Milvus</h3><p>Di seguito è riportato un esempio di script Python che si connette al cluster Milvus e dimostra come eseguire operazioni di base come la creazione di una collezione.</p>
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
<h4 id="Explanation" class="common-anchor-header">Spiegazione:</h4><ul>
<li><p>Connettersi a Milvus: Lo script si connette al server Milvus in esecuzione su <code translate="no">localhost</code> utilizzando la porta locale impostata al punto 4.</p></li>
<li><p>Creare una raccolta: Controlla se esiste già una raccolta denominata <code translate="no">example_collection</code>, in caso affermativo la elimina e crea una nuova raccolta con vettori di 768 dimensioni.</p></li>
</ul>
<p>Questo script stabilisce una connessione al cluster Milvus e crea una collezione, che serve come punto di partenza per operazioni più complesse come l'inserimento di vettori e l'esecuzione di ricerche di similarità.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>L'implementazione di Milvus in una configurazione distribuita su Kubernetes sblocca potenti funzionalità per la gestione di dati vettoriali su larga scala, consentendo una scalabilità senza soluzione di continuità e applicazioni AI ad alte prestazioni. Seguendo questa guida, avete imparato a configurare Milvus utilizzando Milvus Operator, rendendo il processo più semplice ed efficiente.</p>
<p>Continuando a esplorare Milvus, si può prendere in considerazione la possibilità di scalare il cluster per soddisfare le esigenze crescenti o di distribuirlo su piattaforme cloud come Amazon EKS, Google Cloud o Microsoft Azure. Per migliorare la gestione e il monitoraggio, strumenti come <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a>, <a href="https://milvus.io/docs/birdwatcher_overview.md"><strong>Birdwatcher</strong></a> e <a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> offrono un valido supporto per mantenere la salute e le prestazioni delle vostre implementazioni.</p>
<p>Ora siete pronti a sfruttare tutto il potenziale di Milvus su Kubernetes: buona distribuzione! 🚀</p>
<h2 id="Further-Resources" class="common-anchor-header">Altre risorse<button data-href="#Further-Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/overview.md">Documentazione Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distribuito: Quale modalità è giusta per voi? </a></p></li>
<li><p><a href="https://zilliz.com/blog/milvus-on-gpu-with-nvidia-rapids-cuvs">Potenziamento della ricerca vettoriale: Milvus su GPU con NVIDIA RAPIDS cuVS</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Che cos'è RAG? </a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Hub di risorse per l'IA generativa | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">I modelli AI più performanti per le vostre applicazioni GenAI | Zilliz</a></p></li>
</ul>
