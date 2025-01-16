---
id: how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
title: Come distribuire il database vettoriale open source Milvus su Amazon EKS
author: AWS
date: 2024-08-09T00:00:00.000Z
desc: >-
  Una guida passo-passo sull'implementazione del database vettoriale Milvus su
  AWS utilizzando servizi gestiti come Amazon EKS, S3, MSK e ELB.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: 'Milvus, Vector Database, Amazon EKS, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-deploy-open-source-milvus-vector-database-on-amazon-eks.md
---
<p><em>Questo post è stato pubblicato originariamente sul <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>sito web</em></a> di <a href="https://aws.amazon.com/cn/blogs/china/build-open-source-vector-database-milvus-based-on-amazon-eks/"><em>AWS</em></a> ed è stato tradotto, modificato e ripubblicato qui con l'autorizzazione.</em></p>
<h2 id="An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="common-anchor-header">Una panoramica sugli embeddings vettoriali e i database vettoriali<button data-href="#An-Overview-of-Vector-Embeddings-and-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ascesa dell'<a href="https://zilliz.com/learn/generative-ai">IA generativa (GenAI)</a>, in particolare dei modelli linguistici di grandi dimensioni<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>), ha aumentato in modo significativo l'interesse per i <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriali</a>, rendendoli una componente essenziale dell'ecosistema GenAI. Di conseguenza, i database vettoriali vengono adottati in un numero crescente di <a href="https://milvus.io/use-cases">casi d'uso</a>.</p>
<p>Un <a href="https://venturebeat.com/data-infrastructure/report-80-of-global-datasphere-will-be-unstructured-by-2025/">rapporto IDC</a> prevede che entro il 2025 oltre l'80% dei dati aziendali sarà non strutturato, in formati quali testo, immagini, audio e video. La comprensione, l'elaborazione, l'archiviazione e l'interrogazione di questa vasta quantità di <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dati non strutturati</a> su scala rappresentano una sfida significativa. La pratica comune nella GenAI e nel deep learning è quella di trasformare i dati non strutturati in embeddings vettoriali, memorizzarli e indicizzarli in un database vettoriale come <a href="https://milvus.io/intro">Milvus</a> o <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (il Milvus completamente gestito) per ricerche di <a href="https://zilliz.com/learn/vector-similarity-search">similarità vettoriale</a> o di similarità semantica.</p>
<p>Ma cosa sono esattamente gli <a href="https://zilliz.com/glossary/vector-embeddings">embeddings vettoriali</a>? In poche parole, sono rappresentazioni numeriche di numeri in virgola mobile in uno spazio ad alta densità. La <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">distanza tra due vettori</a> indica la loro rilevanza: più sono vicini, più sono rilevanti l'uno per l'altro, e viceversa. Ciò significa che vettori simili corrispondono a dati originali simili, a differenza delle tradizionali ricerche per parole chiave o esatte.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_2_How_to_perform_a_vector_search_f38e8533a2.png" alt="How to perform a vector similarity search" class="doc-image" id="how-to-perform-a-vector-similarity-search" />
   </span> <span class="img-wrapper"> <span>Come eseguire una ricerca di similarità vettoriale</span> </span></p>
<p><em>Figura 1: Come eseguire una ricerca per similarità vettoriale</em></p>
<p>La capacità di memorizzare, indicizzare e cercare le incorporazioni vettoriali è la funzionalità principale dei database vettoriali. Attualmente, i principali database vettoriali si dividono in due categorie. La prima categoria estende i prodotti di database relazionali esistenti, come Amazon OpenSearch Service con il plugin <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">KNN</a> e Amazon RDS per <a href="https://zilliz.com/comparison/milvus-vs-pgvector">PostgreSQL</a> con l'estensione pgvector. La seconda categoria comprende prodotti specializzati in database vettoriali, tra cui esempi ben noti come Milvus, Zilliz Cloud (il Milvus completamente gestito), <a href="https://zilliz.com/comparison/pinecone-vs-zilliz-vs-milvus">Pinecone</a>, <a href="https://zilliz.com/comparison/milvus-vs-weaviate">Weaviate</a>, <a href="https://zilliz.com/comparison/milvus-vs-qdrant">Qdrant</a> e <a href="https://zilliz.com/blog/milvus-vs-chroma">Chroma</a>.</p>
<p>Le tecniche di embedding e i database vettoriali trovano ampie applicazioni in diversi <a href="https://zilliz.com/vector-database-use-cases">casi d'uso guidati dall'intelligenza artificiale</a>, tra cui la ricerca per similarità di immagini, la deduplicazione e l'analisi dei video, l'elaborazione del linguaggio naturale, i sistemi di raccomandazione, la pubblicità mirata, la ricerca personalizzata, il servizio clienti intelligente e il rilevamento delle frodi.</p>
<p><a href="https://milvus.io/docs/quickstart.md">Milvus</a> è una delle opzioni open-source più popolari tra i numerosi database vettoriali. Questo post presenta Milvus ed esplora la pratica di implementazione di Milvus su AWS EKS.</p>
<h2 id="What-is-Milvus" class="common-anchor-header">Che cos'è Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/intro">Milvus</a> è un database vettoriale open-source cloud-native altamente flessibile, affidabile e velocissimo. È in grado di alimentare la ricerca di similarità vettoriale e le applicazioni di intelligenza artificiale e si sforza di rendere i database vettoriali accessibili a tutte le organizzazioni. Milvus è in grado di memorizzare, indicizzare e gestire oltre un miliardo di incorporazioni vettoriali generate da reti neurali profonde e altri modelli di apprendimento automatico (ML).</p>
<p>Milvus è stato rilasciato sotto la <a href="https://github.com/milvus-io/milvus/blob/master/LICENSE">licenza open-source Apache 2.0</a> nell'ottobre 2019. Attualmente è un progetto di laurea della <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. Al momento della stesura di questo blog, Milvus ha raggiunto più di <a href="https://hub.docker.com/r/milvusdb/milvus">50 milioni di</a> download <a href="https://hub.docker.com/r/milvusdb/milvus">di Docker pull</a> ed è utilizzato da <a href="https://milvus.io/">molti clienti</a>, come NVIDIA, AT&amp;T, IBM, eBay, Shopee e Walmart.</p>
<h3 id="Milvus-Key-Features" class="common-anchor-header">Caratteristiche principali di Milvus</h3><p>Come database vettoriale cloud-native, Milvus vanta le seguenti caratteristiche principali:</p>
<ul>
<li><p>Prestazioni elevate e ricerca al millisecondo su set di dati vettoriali di dimensioni miliardarie.</p></li>
<li><p>Supporto multilingue e toolchain.</p></li>
<li><p>Scalabilità orizzontale ed elevata affidabilità anche in caso di interruzioni.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus">Ricerca ibrida</a>, ottenuta accoppiando il filtraggio scalare con la ricerca di similarità vettoriale.</p></li>
</ul>
<h3 id="Milvus-Architecture" class="common-anchor-header">Architettura di Milvus</h3><p>Milvus segue il principio della separazione tra flusso di dati e flusso di controllo. Il sistema è suddiviso in quattro livelli, come mostrato nel diagramma:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_Overview_fd10aeffb8.png" alt="Milvus Architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura Milvus</span> </span></p>
<p><em>Figura 2 Architettura Milvus</em></p>
<ul>
<li><p><strong>Livello di accesso:</strong> Il livello di accesso è composto da un gruppo di proxy stateless e funge da livello frontale del sistema e da endpoint per gli utenti.</p></li>
<li><p><strong>Servizio di coordinamento:</strong> Il servizio di coordinamento assegna i compiti ai nodi lavoratori.</p></li>
<li><p><strong>Nodi worker:</strong> I nodi worker sono esecutori muti che seguono le istruzioni del servizio coordinatore ed eseguono i comandi DML/DDL attivati dall'utente.</p></li>
<li><p><strong>Storage:</strong> Lo storage è responsabile della persistenza dei dati. Comprende un meta-archivio, un log broker e un object storage.</p></li>
</ul>
<h3 id="Milvus-Deployment-Options" class="common-anchor-header">Opzioni di distribuzione di Milvus</h3><p>Milvus supporta tre modalità di funzionamento: <a href="https://milvus.io/docs/install-overview.md">Milvus Lite, Standalone e Distribuito</a>.</p>
<ul>
<li><p><strong>Milvus Lite</strong> è una libreria Python che può essere importata nelle applicazioni locali. Essendo una versione leggera di Milvus, è ideale per la prototipazione rapida in Jupyter Notebook o per l'esecuzione su dispositivi intelligenti con risorse limitate.</p></li>
<li><p><strong>Milvus Standalone è</strong>una versione server a macchina singola. Se avete un carico di lavoro di produzione ma preferite non usare Kubernetes, l'esecuzione di Milvus Standalone su una singola macchina con memoria sufficiente è una buona opzione.</p></li>
<li><p><strong>Milvus Distributed</strong> può essere distribuito su cluster Kubernetes. Supporta set di dati più grandi, maggiore disponibilità e scalabilità ed è più adatto agli ambienti di produzione.</p></li>
</ul>
<p>Milvus è stato progettato fin dall'inizio per supportare Kubernetes e può essere facilmente distribuito su AWS. Possiamo usare Amazon Elastic Kubernetes Service (Amazon EKS) come Kubernetes gestito, Amazon S3 come Object Storage, Amazon Managed Streaming for Apache Kafka (Amazon MSK) come Message storage e Amazon Elastic Load Balancing (Amazon ELB) come Load Balancer per costruire un cluster di database Milvus affidabile ed elastico.</p>
<p>In seguito, forniremo una guida passo-passo per l'implementazione di un cluster Milvus utilizzando EKS e altri servizi.</p>
<h2 id="Deploying-Milvus-on-AWS-EKS" class="common-anchor-header">Distribuzione di Milvus su AWS EKS<button data-href="#Deploying-Milvus-on-AWS-EKS" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><p>Utilizzeremo AWS CLI per creare un cluster EKS e distribuire un database Milvus. Sono necessari i seguenti prerequisiti:</p>
<ul>
<li><p>Un PC/Mac o un'istanza Amazon EC2 con<a href="https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"> AWS CLI</a> installato e configurato con le autorizzazioni appropriate. Gli strumenti AWS CLI sono installati per impostazione predefinita se si utilizza Amazon Linux 2 o Amazon Linux 2023.</p></li>
<li><p><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Strumenti EKS installati</a>, tra cui Helm, Kubectl, eksctl, ecc.</p></li>
<li><p>Un bucket Amazon S3.</p></li>
<li><p>Un'istanza Amazon MSK.</p></li>
</ul>
<h3 id="Considerations-when-creating-MSK" class="common-anchor-header">Considerazioni sulla creazione di MSK</h3><ul>
<li>L'ultima versione stabile di Milvus (v2.3.13) dipende dalla funzione <code translate="no">autoCreateTopics</code> di Kafka. Pertanto, quando si crea MSK, è necessario utilizzare una configurazione personalizzata e modificare la proprietà <code translate="no">auto.create.topics.enable</code> dal valore predefinito <code translate="no">false</code> a <code translate="no">true</code>. Inoltre, per aumentare il throughput dei messaggi di MSK, si raccomanda di aumentare i valori di <code translate="no">message.max.bytes</code> e <code translate="no">replica.fetch.max.bytes</code>. Per maggiori dettagli, vedere <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-configuration-properties.html">Configurazioni MSK personalizzate</a>.</li>
</ul>
<pre><code translate="no">auto.create.topics.enable=true
message.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">10485880</span>
replica.fetch.<span class="hljs-built_in">max</span>.<span class="hljs-built_in">bytes</span>=<span class="hljs-number">20971760</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Milvus non supporta l'autenticazione basata sui ruoli IAM di MSK. Pertanto, quando si crea MSK, abilitare l'opzione <code translate="no">SASL/SCRAM authentication</code> nella configurazione della sicurezza e configurare <code translate="no">username</code> e <code translate="no">password</code> in AWS Secrets Manager. Per i dettagli, vedere <a href="https://docs.aws.amazon.com/msk/latest/developerguide/msk-password.html">Autenticazione delle credenziali di accesso con AWS Secrets Manager</a>.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_3_Security_settings_enable_SASL_SCRAM_authentication_9cf7cdde00.png" alt="Figure 3 Security settings enable SASL SCRAM authentication.png" class="doc-image" id="figure-3-security-settings-enable-sasl-scram-authentication.png" />
   </span> <span class="img-wrapper"> <span>Figura 3 Impostazioni di sicurezza: abilitare l'autenticazione SASL SCRAM.png</span> </span></p>
<p><em>Figura 3: Impostazioni di sicurezza: abilitare l'autenticazione SASL/SCRAM</em></p>
<ul>
<li>È necessario abilitare l'accesso al gruppo di sicurezza MSK dal gruppo di sicurezza o dall'intervallo di indirizzi IP del cluster EKS.</li>
</ul>
<h3 id="Creating-an-EKS-Cluster" class="common-anchor-header">Creare un cluster EKS</h3><p>Ci sono molti modi per creare un cluster EKS, ad esempio tramite la console, CloudFormation, eksctl, ecc. Questo post mostra come creare un cluster EKS utilizzando eksctl.</p>
<p><code translate="no">eksctl</code> è un semplice strumento da riga di comando per creare e gestire cluster Kubernetes su Amazon EKS. Offre il modo più semplice e veloce per creare un nuovo cluster con nodi per Amazon EKS. Per ulteriori informazioni, consultare il <a href="https://eksctl.io/">sito web</a> di eksctl.</p>
<ol>
<li>Per prima cosa, creare un file <code translate="no">eks_cluster.yaml</code> con il seguente frammento di codice. Sostituire <code translate="no">cluster-name</code> con il nome del cluster, <code translate="no">region-code</code> con la regione AWS in cui si desidera creare il cluster e <code translate="no">private-subnet-idx</code> con le sottoreti private. Nota: Questo file di configurazione crea un cluster EKS in una VPC esistente specificando le sottoreti private. Se si desidera creare una nuova VPC, rimuovere la configurazione della VPC e delle sottoreti e <code translate="no">eksctl</code> ne creerà automaticamente una nuova.</li>
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
<li>Quindi, eseguire il comando <code translate="no">eksctl</code> per creare il cluster EKS.</li>
</ol>
<pre><code translate="no">eksctl create cluster -f eks_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Questo comando creerà le seguenti risorse:</p>
<ul>
<li><p>Un cluster EKS con la versione specificata.</p></li>
<li><p>Un gruppo di nodi gestiti con tre istanze EC2 m6i.2xlarge.</p></li>
<li><p>Un <a href="https://docs.aws.amazon.com/en_us/eks/latest/userguide/enable-iam-roles-for-service-accounts.html">provider di identità IAM OIDC</a> e un ServiceAccount chiamato <code translate="no">aws-load-balancer-controller</code>, che verrà utilizzato in seguito per l'installazione di <strong>AWS Load Balancer Controller</strong>.</p></li>
<li><p>Uno spazio dei nomi <code translate="no">milvus</code> e un ServiceAccount <code translate="no">milvus-s3-access-sa</code> all'interno di questo spazio dei nomi. Questo spazio dei nomi sarà usato in seguito per configurare S3 come archivio di oggetti per Milvus.</p>
<p>Nota: per semplicità, al sito <code translate="no">milvus-s3-access-sa</code> vengono concessi tutti i permessi di accesso a S3. Nelle distribuzioni di produzione, si raccomanda di seguire il principio del minimo privilegio e di concedere l'accesso solo allo specifico bucket S3 usato per Milvus.</p></li>
<li><p>Più componenti aggiuntivi, dove <code translate="no">vpc-cni</code>, <code translate="no">coredns</code>, <code translate="no">kube-proxy</code> sono componenti aggiuntivi fondamentali richiesti da EKS. <code translate="no">aws-ebs-csi-driver</code> è il driver CSI di AWS EBS che consente ai cluster EKS di gestire il ciclo di vita dei volumi Amazon EBS.</p></li>
</ul>
<p>Ora dobbiamo solo attendere il completamento della creazione del cluster.</p>
<p>Attendere il completamento della creazione del cluster. Durante il processo di creazione del cluster, il file <code translate="no">kubeconfig</code> verrà creato o aggiornato automaticamente. È anche possibile aggiornarlo manualmente eseguendo il seguente comando. Assicurarsi di sostituire <code translate="no">region-code</code> con la regione AWS in cui si sta creando il cluster e di sostituire <code translate="no">cluster-name</code> con il nome del cluster.</p>
<pre><code translate="no">aws eks update-kubeconfig --region &lt;region-code&gt; --name &lt;cluster-name&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Una volta creato il cluster, è possibile visualizzare i nodi eseguendo:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> nodes -A -o wide
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Creare una StorageClass <code translate="no">ebs-sc</code> configurata con GP3 come tipo di storage e impostarla come StorageClass predefinita. Milvus usa etcd come Meta Storage e ha bisogno di questa StorageClass per creare e gestire i PVC.</li>
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
<p>Quindi, impostare la StorageClass originale <code translate="no">gp2</code> come non predefinita:</p>
<pre><code translate="no">kubectl patch storage<span class="hljs-keyword">class</span> <span class="hljs-title class_">gp2</span> -p <span class="hljs-string">&#x27;{&quot;metadata&quot;: {&quot;annotations&quot;:{&quot;storageclass.kubernetes.io/is-default-class&quot;:&quot;false&quot;}}}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Installare il controller AWS Load Balancer. Questo controller verrà utilizzato in seguito per il servizio Milvus e Attu Ingress, quindi installiamolo prima.</li>
</ol>
<ul>
<li>Per prima cosa, aggiungere il repo <code translate="no">eks-charts</code> e aggiornarlo.</li>
</ul>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> eks https:<span class="hljs-comment">//aws.github.io/eks-charts</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Quindi, installare il controllore AWS Load Balancer. Sostituire <code translate="no">cluster-name</code> con il nome del cluster. Il ServiceAccount <code translate="no">aws-load-balancer-controller</code> è già stato creato quando abbiamo creato il cluster EKS nei passi precedenti.</li>
</ul>
<pre><code translate="no">helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
 -n kube-system \
 --<span class="hljs-built_in">set</span> clusterName=&lt;cluster-name&gt; \
 --<span class="hljs-built_in">set</span> serviceAccount.create=<span class="hljs-literal">false</span> \
 --<span class="hljs-built_in">set</span> serviceAccount.name=aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Verificare se il controller è stato installato correttamente.</li>
</ul>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n kube-system aws-load-balancer-controller
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>L'output dovrebbe apparire come segue:</li>
</ul>
<pre><code translate="no">NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
aws-load-balancer-controller   2/2     2            2           12m
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-a-Milvus-Cluster" class="common-anchor-header">Distribuzione di un cluster Milvus</h3><p>Milvus supporta diversi metodi di distribuzione, come Operator e Helm. Operator è più semplice, ma Helm è più diretto e flessibile. In questo esempio useremo Helm per distribuire Milvus.</p>
<p>Quando si distribuisce Milvus con Helm, è possibile personalizzare la configurazione tramite il file <code translate="no">values.yaml</code>. Fare clic su <a href="https://raw.githubusercontent.com/milvus-io/milvus-helm/master/charts/milvus/values.yaml">values.yaml</a> per visualizzare tutte le opzioni. Per impostazione predefinita, Milvus crea minio e pulsar all'interno del cluster, rispettivamente come Object Storage e Message Storage. Verranno apportate alcune modifiche alla configurazione per renderla più adatta alla produzione.</p>
<ol>
<li>Per prima cosa, aggiungere il repo Milvus Helm e aggiornarlo.</li>
</ol>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> milvus https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm/</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Creare un file <code translate="no">milvus_cluster.yaml</code> con il seguente frammento di codice. Questo frammento di codice personalizza la configurazione di Milvus, ad esempio configurando Amazon S3 come archivio di oggetti e Amazon MSK come coda di messaggi. In seguito verranno fornite spiegazioni dettagliate e indicazioni sulla configurazione.</li>
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
<p>Il codice contiene sei sezioni. Seguire le istruzioni seguenti per modificare le configurazioni corrispondenti.</p>
<p><strong>Sezione 1</strong>: Configurare S3 come archivio oggetti. Il serviceAccount concede a Milvus l'accesso a S3 (in questo caso, è <code translate="no">milvus-s3-access-sa</code>, creato quando abbiamo creato il cluster EKS). Assicurarsi di sostituire <code translate="no">&lt;region-code&gt;</code> con la regione AWS in cui si trova il cluster. Sostituire <code translate="no">&lt;bucket-name&gt;</code> con il nome del bucket S3 e <code translate="no">&lt;root-path&gt;</code> con il prefisso del bucket S3 (questo campo può essere lasciato vuoto).</p>
<p><strong>Sezione 2</strong>: Configurare MSK come Message Storage. Sostituire <code translate="no">&lt;broker-list&gt;</code> con gli indirizzi degli endpoint corrispondenti al tipo di autenticazione SASL/SCRAM di MSK. Sostituire <code translate="no">&lt;username&gt;</code> e <code translate="no">&lt;password&gt;</code> con il nome utente e la password dell'account MSK. È possibile ottenere <code translate="no">&lt;broker-list&gt;</code> dalle informazioni del client MSK, come mostrato nell'immagine seguente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_4_Configure_MSK_as_the_Message_Storage_of_Milvus_a9e602e0b9.png" alt="Figure 4 Configure MSK as the Message Storage of Milvus.png" class="doc-image" id="figure-4-configure-msk-as-the-message-storage-of-milvus.png" />
   </span> <span class="img-wrapper"> <span>Figura 4 Configurazione di MSK come archivio messaggi di Milvus.png</span> </span></p>
<p><em>Figura 4: Configurare MSK come archivio messaggi di Milvus</em></p>
<p><strong>Sezione 3:</strong> Esporre il servizio Milvus e abilitare l'accesso dall'esterno del cluster. Per impostazione predefinita, l'endpoint Milvus utilizza un servizio di tipo ClusterIP, accessibile solo all'interno del cluster EKS. Se necessario, è possibile cambiarlo in tipo LoadBalancer per consentire l'accesso dall'esterno del cluster EKS. Il servizio di tipo LoadBalancer utilizza Amazon NLB come bilanciatore di carico. Secondo le migliori pratiche di sicurezza, <code translate="no">aws-load-balancer-scheme</code> è configurato come modalità interna per impostazione predefinita, il che significa che è consentito solo l'accesso intranet a Milvus. Fare clic per <a href="https://docs.aws.amazon.com/eks/latest/userguide/network-load-balancing.html">visualizzare le istruzioni di configurazione di NLB</a>.</p>
<p><strong>Sezione 4:</strong> Installare e configurare <a href="https://github.com/zilliztech/attu">Attu</a>, uno strumento di amministrazione open-source di Milvus. Ha un'interfaccia grafica intuitiva che consente di interagire facilmente con Milvus. Abilitiamo Attu, configuriamo l'ingresso utilizzando AWS ALB e lo impostiamo sul tipo <code translate="no">internet-facing</code> in modo che Attu sia accessibile via Internet. Fare clic su <a href="https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html">questo documento</a> per la guida alla configurazione di ALB.</p>
<p><strong>Sezione 5:</strong> Abilitare la distribuzione HA dei componenti principali di Milvus. Milvus contiene diversi componenti indipendenti e disaccoppiati. Ad esempio, il servizio coordinatore agisce come livello di controllo, gestendo il coordinamento dei componenti Root, Query, Data e Index. Il Proxy nel livello di accesso serve come endpoint di accesso al database. Per impostazione predefinita, questi componenti hanno una sola replica del pod. La distribuzione di più repliche di questi componenti del servizio è particolarmente necessaria per migliorare la disponibilità di Milvus.</p>
<p><strong>Nota:</strong> la distribuzione multi-replica dei componenti Root, Query, Data e Index coordinator richiede l'abilitazione dell'opzione <code translate="no">activeStandby</code>.</p>
<p><strong>Sezione 6:</strong> Regolare l'allocazione delle risorse per i componenti di Milvus per soddisfare i requisiti dei carichi di lavoro. Il sito web di Milvus fornisce anche uno <a href="https://milvus.io/tools/sizing/">strumento di dimensionamento</a> per generare suggerimenti di configurazione in base al volume dei dati, alle dimensioni dei vettori, ai tipi di indici, ecc. Può anche generare un file di configurazione Helm con un solo clic. La configurazione seguente è il suggerimento fornito dallo strumento per 1 milione di vettori di 1024 dimensioni e tipo di indice HNSW.</p>
<ol>
<li>Utilizzare Helm per creare Milvus (distribuito nello spazio dei nomi <code translate="no">milvus</code>). Nota: è possibile sostituire <code translate="no">&lt;demo&gt;</code> con un nome personalizzato.</li>
</ol>
<pre><code translate="no">helm install &lt;demo&gt; milvus/milvus -n milvus -f milvus_cluster.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Eseguire il seguente comando per verificare lo stato di distribuzione.</li>
</ol>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>L'output seguente mostra che i componenti di Milvus sono tutti AVAILABLE e che i componenti di coordinamento hanno repliche multiple abilitate.</p>
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
<h3 id="Accessing-and-Managing-Milvus" class="common-anchor-header">Accesso e gestione di Milvus</h3><p>Finora abbiamo distribuito con successo il database dei vettori di Milvus. Ora possiamo accedere a Milvus attraverso gli endpoint. Milvus espone gli endpoint tramite i servizi Kubernetes. Attu espone gli endpoint tramite Kubernetes Ingress.</p>
<h4 id="Accessing-Milvus-endpoints" class="common-anchor-header"><strong>Accesso agli endpoint di Milvus</strong></h4><p>Eseguire il seguente comando per ottenere gli endpoint dei servizi:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> svc -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>È possibile visualizzare diversi servizi. Milvus supporta due porte, la porta <code translate="no">19530</code> e la porta <code translate="no">9091</code>:</p>
<ul>
<li>La porta <code translate="no">19530</code> è per gRPC e API RESTful. È la porta predefinita quando ci si connette a un server Milvus con diversi SDK Milvus o client HTTP.</li>
<li>La porta <code translate="no">9091</code> è una porta di gestione per la raccolta di metriche, la profilazione pprof e le sonde di salute in Kubernetes.</li>
</ul>
<p>Il servizio <code translate="no">demo-milvus</code> fornisce un endpoint di accesso al database, utilizzato per stabilire una connessione dai client. Utilizza NLB come bilanciatore di carico del servizio. È possibile ottenere l'endpoint del servizio dalla colonna <code translate="no">EXTERNAL-IP</code>.</p>
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
<h4 id="Managing-Milvus-using-Attu" class="common-anchor-header"><strong>Gestione di Milvus con Attu</strong></h4><p>Come descritto in precedenza, abbiamo installato Attu per gestire Milvus. Eseguire il seguente comando per ottenere l'endpoint:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> ingress -n milvus
<button class="copy-code-btn"></button></code></pre>
<p>Si può vedere un Ingress chiamato <code translate="no">demo-milvus-attu</code>, dove la colonna <code translate="no">ADDRESS</code> è l'URL di accesso.</p>
<pre><code translate="no">NAME            CLASS   HOSTS   ADDRESS                                     PORTS   AGE
demo-milvus-attu   &lt;none&gt;   *       k8s-attu-xxxx.us-west-2.elb.amazonaws.com   80      27s
<button class="copy-code-btn"></button></code></pre>
<p>Aprire l'indirizzo Ingress in un browser e vedere la seguente pagina. Fare clic su <strong>Connetti</strong> per accedere.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_5_Log_in_to_your_Attu_account_bde25a6da5.png" alt="Figure 5 Log in to your Attu account.png" class="doc-image" id="figure-5-log-in-to-your-attu-account.png" />
   </span> <span class="img-wrapper"> <span>Figura 5 Accesso all'account Attu.png</span> </span></p>
<p><em>Figura 5: Accesso all'account Attu</em></p>
<p>Dopo aver effettuato il login, è possibile gestire i database Milvus attraverso Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_6_The_Attu_interface_3e818e6833.png" alt="Figure 6 The Attu interface.png" class="doc-image" id="figure-6-the-attu-interface.png" />
   </span> <span class="img-wrapper"> <span>Figura 6 L'interfaccia di Attu.png</span> </span></p>
<p>Figura 6: L'interfaccia di Attu</p>
<h2 id="Testing-the-Milvus-vector-database" class="common-anchor-header">Test del database vettoriale Milvus<button data-href="#Testing-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Utilizzeremo il <a href="https://milvus.io/docs/example_code.md">codice di esempio di</a> Milvus per verificare se il database Milvus funziona correttamente. Per prima cosa, scaricare il codice di esempio <code translate="no">hello_milvus.py</code> utilizzando il seguente comando:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/pymilvus/master/examples/hello_milvus.py</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modificare l'host nel codice di esempio con l'endpoint del servizio Milvus.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(fmt.<span class="hljs-built_in">format</span>(<span class="hljs-string">&quot;start connecting to Milvus&quot;</span>))
connections.connect(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;milvus-nlb-xxx.elb.us-west-2.amazonaws.com&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Eseguire il codice:</p>
<pre><code translate="no">python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>Se il sistema restituisce il seguente risultato, significa che Milvus funziona normalmente.</p>
<pre><code translate="no">=== start connecting to <span class="hljs-title class_">Milvus</span>     ===
<span class="hljs-title class_">Does</span> collection hello_milvus exist <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-title class_">False</span>
=== <span class="hljs-title class_">Create</span> collection <span class="hljs-string">`hello_milvus`</span> ===
=== <span class="hljs-title class_">Start</span> inserting entities       ===
<span class="hljs-title class_">Number</span> <span class="hljs-keyword">of</span> entities <span class="hljs-keyword">in</span> <span class="hljs-title class_">Milvus</span>: <span class="hljs-number">3000</span>
=== <span class="hljs-title class_">Start</span> <span class="hljs-title class_">Creating</span> index <span class="hljs-variable constant_">IVF_FLAT</span>  ===
=== <span class="hljs-title class_">Start</span> loading                  ===
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Questo post presenta <a href="https://milvus.io/intro">Milvus</a>, uno dei database vettoriali open-source più diffusi, e fornisce una guida all'implementazione di Milvus su AWS utilizzando servizi gestiti come Amazon EKS, S3, MSK e ELB per ottenere maggiore elasticità e affidabilità.</p>
<p>Come componente centrale di vari sistemi GenAI, in particolare della Retrieval Augmented Generation (RAG), Milvus supporta e si integra con una varietà di modelli e framework GenAI mainstream, tra cui Amazon Sagemaker, PyTorch, HuggingFace, LlamaIndex e LangChain. Iniziate oggi stesso il vostro viaggio nell'innovazione GenAI con Milvus!</p>
<h2 id="References" class="common-anchor-header">Riferimenti<button data-href="#References" class="anchor-icon" translate="no">
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
<li><a href="https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html">Guida all'uso di Amazon EKS</a></li>
<li><a href="https://milvus.io/">Sito web ufficiale di Milvus</a></li>
<li><a href="https://github.com/milvus-io/milvus">Repository GitHub di Milvus</a></li>
<li><a href="https://eksctl.io/">Sito web ufficiale di eksctl</a></li>
</ul>
