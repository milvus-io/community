---
id: deploying-milvus-on-kubernetes-just-got-easier-with-the-milvus-operator.md
title: >-
  La distribuzione di Milvus su Kubernetes è appena diventata più semplice con
  Milvus Operator
author: Min Yin
date: 2025-08-04T00:00:00.000Z
desc: >-
  Milvus Operator è uno strumento di gestione nativo di Kubernetes che
  automatizza il ciclo di vita completo delle distribuzioni di database
  vettoriali Milvus.
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
<p>Configurare un cluster Milvus pronto per la produzione non dovrebbe sembrare di disinnescare una bomba. Chiunque abbia configurato manualmente Kubernetes per i database vettoriali conosce la procedura: decine di file YAML, una gestione intricata delle dipendenze e quella sensazione di sconforto quando qualcosa si rompe alle 2 del mattino e non si sa quale dei 47 file di configurazione sia il colpevole.</p>
<p>L'approccio tradizionale alla distribuzione di Milvus prevede l'orchestrazione di più servizi: Etcd per l'archiviazione dei metadati, Pulsar per l'accodamento dei messaggi, MinIO per l'archiviazione degli oggetti e i vari componenti di Milvus. Ogni servizio richiede un'attenta configurazione, una corretta sequenza di avvio e una manutenzione continua. Se poi si estende il tutto a più ambienti o cluster, la complessità operativa diventa schiacciante.</p>
<p>È qui che <a href="https://github.com/zilliztech/milvus-operator"><strong>Milvus Operator</strong></a> cambia radicalmente le carte in tavola. Invece di gestire manualmente l'infrastruttura, si descrive ciò che si vuole e l'Operatore si occupa del come.</p>
<h2 id="What-is-the-Milvus-Operator" class="common-anchor-header">Che cos'è Milvus Operator?<button data-href="#What-is-the-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install_cluster-milvusoperator.md"><strong>Milvus Operator</strong></a> è uno strumento di gestione nativo di Kubernetes che automatizza l'intero ciclo di vita delle distribuzioni di database vettoriali Milvus. Costruito sul modello di Kubernetes Operator, racchiude anni di conoscenze operative sull'esecuzione di Milvus in produzione e codifica tale esperienza in un software che viene eseguito insieme al vostro cluster.</p>
<p>È come avere un amministratore esperto di Milvus che non dorme mai, non fa mai errori di battitura e ha una memoria perfetta di ogni dettaglio di configurazione. L'Operatore monitora continuamente la salute del cluster, gestisce automaticamente le decisioni di scaling, gestisce gli aggiornamenti senza tempi di inattività e si riprende dai guasti più velocemente di quanto potrebbe fare un operatore umano.</p>
<p>Nel suo nucleo, l'Operatore offre quattro funzionalità essenziali.</p>
<ul>
<li><p><strong>Distribuzione automatizzata</strong>: Configurazione di un cluster Milvus completamente funzionale con un unico manifesto.</p></li>
<li><p><strong>Gestione del ciclo di vita</strong>: Automatizza gli aggiornamenti, il ridimensionamento orizzontale e lo smantellamento delle risorse in un ordine definito e sicuro.</p></li>
<li><p><strong>Monitoraggio e controlli di salute integrati</strong>: Monitoraggio continuo dello stato dei componenti Milvus e delle loro dipendenze, tra cui etcd, Pulsar e MinIO.</p></li>
<li><p><strong>Migliori pratiche operative per impostazione predefinita</strong>: Applicare modelli nativi di Kubernetes che garantiscono l'affidabilità senza richiedere una conoscenza approfondita della piattaforma.</p></li>
</ul>
<h3 id="Understanding-the-Kubernetes-Operator-Pattern" class="common-anchor-header">Comprendere lo schema dell'operatore Kubernetes</h3><p>Prima di esplorare i vantaggi di Milvus Operator, dobbiamo capire le basi su cui è costruito: il <strong>pattern Kubernetes Operator.</strong></p>
<p>Il pattern Kubernetes Operator aiuta a gestire applicazioni complesse che hanno bisogno di più delle funzionalità di base di Kubernetes. Un Operatore ha tre parti principali:</p>
<ul>
<li><p>Le<strong>definizioni di risorse personalizzate</strong> consentono di descrivere l'applicazione utilizzando file di configurazione in stile Kubernetes.</p></li>
<li><p><strong>Un Controller</strong> controlla queste configurazioni e apporta le modifiche necessarie al cluster.</p></li>
<li><p><strong>La gestione dello stato</strong> assicura che il cluster corrisponda a quanto richiesto dall'utente e corregge eventuali differenze.</p></li>
</ul>
<p>In questo modo è possibile descrivere la distribuzione di Milvus in modo familiare, mentre l'Operatore gestisce tutto il lavoro dettagliato di creazione dei pod, impostazione della rete e gestione del ciclo di vita...</p>
<h2 id="How-the-Milvus-Operator-Works" class="common-anchor-header">Come funziona Milvus Operator<button data-href="#How-the-Milvus-Operator-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Operator segue un processo lineare che rende la gestione del database molto più semplice. Vediamo il modello operativo principale di Milvus Operator:</p>
<ol>
<li><p><strong>Risorsa personalizzata (CR):</strong> Gli utenti definiscono una distribuzione Milvus utilizzando un CR (ad esempio, kind: <code translate="no">Milvus</code>). Questo file include configurazioni come la modalità cluster, la versione dell'immagine, i requisiti delle risorse e le dipendenze.</p></li>
<li><p><strong>Logica del controllore:</strong> Il controllore dell'Operatore osserva i CR nuovi o aggiornati. Una volta rilevata una modifica, orchestra la creazione dei componenti necessari: servizi Milvus e dipendenze come etcd, Pulsar e MinIO.</p></li>
<li><p><strong>Gestione automatizzata del ciclo di vita:</strong> Quando si verificano cambiamenti, come l'aggiornamento della versione o la modifica dello storage, l'Operatore esegue aggiornamenti rolling o riconfigura i componenti senza interrompere il cluster.</p></li>
<li><p><strong>Autoguarigione:</strong> Il controller controlla continuamente lo stato di salute di ogni componente. Se qualcosa si blocca, sostituisce automaticamente il pod o ripristina lo stato del servizio per garantire l'operatività.</p></li>
</ol>
<p>Questo approccio è molto più potente delle tradizionali distribuzioni YAML o Helm, perché fornisce una gestione continua invece della sola configurazione iniziale.</p>
<h2 id="Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="common-anchor-header">Perché usare Milvus Operator invece di Helm o YAML?<button data-href="#Why-Use-Milvus-Operator-Instead-of-Helm-or-YAML" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si distribuisce Milvus, si può scegliere tra file YAML manuali, grafici Helm o Milvus Operator. Ognuno ha il suo posto, ma l'Operatore offre vantaggi significativi per le operazioni in corso.</p>
<h3 id="Operation-Automation" class="common-anchor-header">Automazione delle operazioni</h3><p>I metodi tradizionali richiedono un lavoro manuale per le operazioni di routine. Scalare significa aggiornare diversi file di configurazione e coordinare le modifiche. Gli aggiornamenti richiedono un'attenta pianificazione per evitare interruzioni del servizio. L'Operatore gestisce queste attività in modo automatico. È in grado di rilevare quando è necessario il ridimensionamento e di eseguire le modifiche in modo sicuro. Gli upgrade diventano semplici aggiornamenti della configurazione che l'Operatore esegue con una sequenza adeguata e con funzionalità di rollback, se necessario.</p>
<h3 id="Better-State-Visibility" class="common-anchor-header">Migliore visibilità dello stato</h3><p>I file YAML dicono a Kubernetes ciò che si vuole, ma non mostrano lo stato attuale del sistema. Helm aiuta nella gestione della configurazione, ma non monitora lo stato di runtime dell'applicazione. Operator controlla continuamente l'intero cluster. È in grado di rilevare problemi come problemi di risorse o risposte lente e di intervenire prima che diventino problemi seri. Questo monitoraggio proattivo migliora notevolmente l'affidabilità.</p>
<h3 id="Easier-Long-term-Management" class="common-anchor-header">Gestione a lungo termine più semplice</h3><p>Gestire più ambienti con file YAML significa mantenere sincronizzati molti file di configurazione. Anche con i modelli Helm, le operazioni complesse richiedono un notevole coordinamento manuale.</p>
<p>Operator incapsula le conoscenze di gestione di Milvus nel suo codice. Ciò significa che i team possono gestire efficacemente i cluster senza diventare esperti di ogni componente. L'interfaccia operativa rimane coerente con la scalabilità dell'infrastruttura.</p>
<p>Utilizzare l'Operatore significa scegliere un approccio più automatizzato alla gestione di Milvus. Riduce il lavoro manuale e migliora l'affidabilità grazie all'esperienza incorporata, vantaggi apprezzabili man mano che i database vettoriali diventano sempre più critici per le applicazioni.</p>
<h3 id="The-Architecture-of-Milvus-Operation" class="common-anchor-header">L'architettura di Milvus Operation</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_operator_deployment_architecture_3ff8570480.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il diagramma illustra chiaramente la struttura di distribuzione di Milvus Operator all'interno di un cluster Kubernetes:</p>
<ul>
<li><p>A sinistra (area blu): Componenti principali di Milvus Operator, tra cui il Controller e il Milvus-CRD.</p></li>
<li><p>A destra (area verde): Vari componenti del cluster Milvus, come Proxy, Coordinator e Node.</p></li>
<li><p>Centro (frecce - "creare/gestire"): Il flusso di operazioni che mostra come l'Operatore gestisce il cluster Milvus.</p></li>
<li><p>In basso (area arancione): Servizi dipendenti come etcd e MinIO/S3/MQ.</p></li>
</ul>
<p>Questa struttura visiva, con blocchi colorati distinti e frecce direzionali, chiarisce efficacemente le interazioni e il flusso di dati tra i diversi componenti.</p>
<h2 id="Getting-Started-with-Milvus-Operator" class="common-anchor-header">Come iniziare con Milvus Operator<button data-href="#Getting-Started-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p>Questa guida mostra come distribuire Milvus utilizzando l'Operatore. In questa guida utilizzeremo queste versioni.</p>
<ul>
<li><p><strong>Sistema operativo</strong>: openEuler 22.03 LTS SP3 x86_64</p></li>
<li><p><strong>Kubernetes</strong>: v1.28.8</p></li>
<li><p><strong>Milvus</strong>: v2.5.4</p></li>
</ul>
<h3 id="1-Prerequisites" class="common-anchor-header">(1) Prerequisiti</h3><p>Il cluster Kubernetes necessita di almeno una StorageClass configurata. È possibile verificare quali sono disponibili:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> sc
<button class="copy-code-btn"></button></code></pre>
<p>Nel nostro esempio, abbiamo due opzioni:</p>
<ul>
<li><p><code translate="no">local</code> (predefinita) - utilizza i dischi locali</p></li>
<li><p><code translate="no">nfs-sc</code>- utilizza lo storage NFS (va bene per i test, ma da evitare in produzione).</p></li>
</ul>
<pre><code translate="no">RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
<span class="hljs-built_in">local</span> (default)   openebs.io/local      Delete    WaitForFirstConsumer   <span class="hljs-literal">false</span>    284d
nfs-sc            k8s-sigs.io/nfs-...   Delete    Immediate              <span class="hljs-literal">false</span>    230d
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Installing-Milvus-Operator" class="common-anchor-header">(2) Installazione dell'Operatore Milvus</h3><p>È possibile installare Operator con <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-Helm">Helm</a> o <a href="https://milvus.io/docs/install_cluster-milvusoperator.md#Install-with-kubectl">kubectl</a>. Noi useremo kubectl perché è più semplice.</p>
<p>Scaricare il manifesto di distribuzione di Operator:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/deploy/manifests/deployment.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sostituire l'indirizzo dell'immagine (opzionale):</p>
<p><strong>Opzionale:</strong> Se non si può accedere a DockerHub o se si preferisce un proprio<strong>registro, utilizzare un registro di immagini diverso</strong>:</p>
<p><em>Nota: l'indirizzo del repository delle immagini fornito qui è a scopo di test. Sostituitelo con l'indirizzo del vostro repository reale, se necessario.</em></p>
<pre><code translate="no">sed -i <span class="hljs-string">&#x27;s#milvusdb/milvus-operator:v1.2.1#registry.milvus-mirror.cn/&amp;#g&#x27;</span> deployment.<span class="hljs-property">yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>Installare Milvus Operator:</p>
<pre><code translate="no">kubectl apply -f deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Dopo l'installazione, si dovrebbe vedere un output simile a:</p>
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
<p>Verificare la distribuzione di Milvus Operator e le risorse del pod:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment,pod -n milvus-<span class="hljs-keyword">operator</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">NAME                              READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/milvus-operator   1/1     1            1           10m
NAME                                   READY   STATUS        RESTARTS   AGE
pod/milvus-operator-54d4fb854b-7hprh   1/1     Running       0          97s
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Deploying-the-Milvus-Cluster" class="common-anchor-header">(3) Distribuzione del cluster Milvus</h3><p>Una volta che il pod Milvus Operator è in esecuzione, è possibile distribuire il cluster Milvus con i seguenti passaggi.</p>
<p>Scaricare il manifesto di distribuzione del cluster Milvus:</p>
<pre><code translate="no">wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/zilliztech/milvus-operator/main/config/samples/milvus_cluster_default.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>La configurazione predefinita è minima:</p>
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
<p><strong>Per una distribuzione reale, si consiglia di personalizzarla:</strong></p>
<ul>
<li><p>Nome del cluster personalizzato: <code translate="no">milvus-release-v25</code></p></li>
<li><p>Immagine personalizzata: (per usare un'immagine online diversa o un'immagine offline locale) <code translate="no">registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4</code></p></li>
<li><p>Nome personalizzato della classe di archiviazione: In ambienti con più classi di storage, potrebbe essere necessario specificare la StorageClass per componenti persistenti come MinIO ed etcd. In questo esempio, viene utilizzato <code translate="no">nfs-sc</code>.</p></li>
<li><p>Risorse personalizzate: Impostare i limiti di CPU e memoria per i componenti Milvus. Per impostazione predefinita, non vengono impostati limiti, il che potrebbe sovraccaricare i nodi Kubernetes.</p></li>
<li><p>Eliminazione automatica delle risorse correlate: Per impostazione predefinita, quando il cluster Milvus viene eliminato, le risorse associate vengono mantenute.</p></li>
</ul>
<p>Per la configurazione di ulteriori parametri, fate riferimento a:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/milvus-operator/blob/main/docs/CRD/milvus.md">Definizione delle risorse personalizzate di Milvus</a></p></li>
<li><p><a href="https://artifacthub.io/packages/helm/apache/pulsar/3.3.0?modal=values">Valori di Pulsar</a></p></li>
</ul>
<p>Il manifest modificato è:</p>
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
<p>Distribuire il cluster Milvus:</p>
<pre><code translate="no">kubectl apply -f milvus_cluster_default.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-Milvus-Cluster-Status" class="common-anchor-header">Verifica dello stato del cluster Milvus</h4><p>Milvus Operator imposta innanzitutto le dipendenze del middleware per Milvus, come etcd, Zookeeper, Pulsar e MinIO, prima di distribuire i componenti di Milvus (ad esempio, proxy, coordinatore e nodi).</p>
<p>Vedere le distribuzioni:</p>
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
<p>Nota speciale:</p>
<p>Si può notare che Milvus Operator crea una distribuzione <code translate="no">standalone</code> e una <code translate="no">querynode-1</code> con 0 repliche.</p>
<p>Questo è intenzionale. Abbiamo sottoposto un problema al repository di Milvus Operator e la risposta ufficiale è la seguente:</p>
<ul>
<li><p>a. Le distribuzioni funzionano come previsto. La versione standalone viene mantenuta per consentire transizioni senza soluzione di continuità da un cluster a una distribuzione standalone senza interruzione del servizio.</p></li>
<li><p>b. Avere a disposizione sia <code translate="no">querynode-0</code> che <code translate="no">querynode-1</code> è utile durante gli aggiornamenti periodici. Alla fine, solo uno di essi sarà attivo.</p></li>
</ul>
<h4 id="Verifying-That-All-Pods-Are-Running-Correctly" class="common-anchor-header">Verifica del corretto funzionamento di tutti i pod</h4><p>Una volta che il cluster Milvus è pronto, verificare che tutti i pod funzionino come previsto:</p>
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
<h4 id="Verifying-the-StorageClass" class="common-anchor-header">Verifica della StorageClass</h4><p>Assicurarsi che la StorageClass personalizzata (<code translate="no">nfs-sc</code>) e le capacità di storage specificate siano state applicate correttamente:</p>
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
<h4 id="Verifying-Milvus-Resource-Limits" class="common-anchor-header">Verifica dei limiti delle risorse di Milvus</h4><p>Ad esempio, per verificare che i limiti delle risorse per il componente <code translate="no">mixcoord</code> siano stati applicati correttamente, eseguire:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[*].resources.limits}&#x27;</span> | jq
{
  <span class="hljs-string">&quot;cpu&quot;</span>: <span class="hljs-string">&quot;2&quot;</span>,
  <span class="hljs-string">&quot;memory&quot;</span>: <span class="hljs-string">&quot;8Gi&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Verifying-the-Custom-Image" class="common-anchor-header">Verifica dell'immagine personalizzata</h4><p>Verificare che sia in uso l'immagine personalizzata corretta:</p>
<pre><code translate="no">kubectl get deployment milvus-release-v25-milvus-mixcoord -o jsonpath=<span class="hljs-string">&#x27;{.spec.template.spec.containers[0].image}&#x27;</span>
registry.milvus-mirror.cn/milvusdb/milvus:v2.5.4
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Accessing-Your-Cluster-from-Outside" class="common-anchor-header">(4) Accesso al cluster dall'esterno</h3><p>Una domanda comune è: come si può accedere ai servizi Milvus dall'esterno del cluster Kubernetes?</p>
<p>Per impostazione predefinita, il servizio Milvus distribuito dall'Operatore è di tipo <code translate="no">ClusterIP</code>, cioè è accessibile solo all'interno del cluster. Per esporlo all'esterno, è necessario definire un metodo di accesso esterno. Questa guida opta per l'approccio più semplice: utilizzare una NodePort.</p>
<p>Creare e modificare il manifest del servizio per l'accesso esterno:</p>
<pre><code translate="no">vi milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<p>Includere il seguente contenuto:</p>
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
<li>Applicare il manifest del servizio esterno:</li>
</ol>
<pre><code translate="no">kubectl apply -f milvus-external-svc.yaml
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Controllare lo stato del servizio esterno:</li>
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
<li>Accesso alla WebUI di Milvus</li>
</ol>
<p>Milvus offre una GUI integrata, la Milvus WebUI, che migliora l'osservabilità con un'interfaccia intuitiva. La si può usare per monitorare le metriche dei componenti Milvus e delle loro dipendenze, per esaminare informazioni dettagliate su database e collezioni e per controllare i dettagli completi della configurazione. Per ulteriori dettagli, consultare la <a href="https://milvus.io/docs/milvus-webui.md">documentazione ufficiale di Milvus WebUI</a>.</p>
<p>Dopo la distribuzione, aprire il seguente URL nel browser (sostituire <code translate="no">&lt;any_k8s_node_IP&gt;</code> con l'indirizzo IP di qualsiasi nodo Kubernetes):</p>
<p><code translate="no">http://&lt;any_k8s_node_IP&gt;:31531/webui/</code></p>
<p>In questo modo si avvia l'interfaccia WebUI.</p>
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
    </button></h2><p><strong>Milvus Operator</strong> è più di uno strumento di distribuzione: è un investimento strategico nell'eccellenza operativa dell'infrastruttura di database vettoriali. Automatizzando le attività di routine e incorporando le best practice nell'ambiente Kubernetes, libera i team di concentrarsi su ciò che conta di più: costruire e migliorare le applicazioni AI.</p>
<p>L'adozione di una gestione basata sugli operatori richiede un certo sforzo iniziale, comprese le modifiche ai flussi di lavoro e ai processi dei team. Ma per le organizzazioni che operano su scala, o che hanno in programma di farlo, i vantaggi a lungo termine sono significativi: maggiore affidabilità, riduzione dei costi operativi e cicli di distribuzione più rapidi e coerenti.</p>
<p>Man mano che l'IA diventa fondamentale per le moderne operazioni aziendali, la necessità di un'infrastruttura di database vettoriale robusta e scalabile non fa che crescere. Milvus Operator supporta questa evoluzione offrendo un approccio maturo e orientato all'automazione che si adatta al carico di lavoro e alle esigenze specifiche.</p>
<p>Se il vostro team si trova ad affrontare una complessità operativa, a prevedere una crescita o semplicemente a voler ridurre la gestione manuale dell'infrastruttura, l'adozione tempestiva di Milvus Operator può contribuire a evitare futuri debiti tecnici e a migliorare la resilienza complessiva del sistema.</p>
<p>Il futuro dell'infrastruttura è intelligente, automatizzato e facile da sviluppare. <strong>Milvus Operator porta questo futuro nel vostro livello di database, oggi.</strong></p>
<hr>
