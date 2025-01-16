---
id: getting-started-with-milvus-cluster-and-k8s.md
title: Iniziare con il cluster Milvus e K8s
author: Stephen Batifol
date: 2024-04-03T00:00:00.000Z
desc: >-
  In questo tutorial imparerete le basi della configurazione di Milvus con Helm,
  la creazione di una raccolta e l'esecuzione dell'ingestione dei dati e delle
  ricerche di similarità.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Kubernetes
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-milvus-and-k8s.md'
---
<h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è un database vettoriale distribuito che ha lo scopo di memorizzare, indicizzare e gestire vettori di incorporazione massiccia. La sua capacità di indicizzare e cercare in modo efficiente tra trilioni di vettori rende Milvus una scelta obbligata per i carichi di lavoro di AI e machine learning.</p>
<p>Kubernetes (K8s), invece, eccelle nella gestione e nella scalabilità delle applicazioni containerizzate. Offre funzioni come l'autoscaling, l'autoguarigione e il bilanciamento del carico, che sono fondamentali per mantenere alta la disponibilità e le prestazioni negli ambienti di produzione.</p>
<h2 id="Why-Use-Them-Together" class="common-anchor-header">Perché usarli insieme?<button data-href="#Why-Use-Them-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>K8s può scalare automaticamente i cluster Milvus in base al carico di lavoro. Quando i dati crescono o il numero di query aumenta, K8s è in grado di attivare più istanze Milvus per gestire il carico, garantendo la reattività delle applicazioni.</p>
<p>Una delle caratteristiche principali di K8s è la scalabilità orizzontale, che rende l'espansione del cluster Milvus un gioco da ragazzi. Man mano che il vostro set di dati cresce, K8s si adatta facilmente a questa crescita, rendendolo una soluzione semplice ed efficiente.</p>
<p>Inoltre, anche la capacità di gestire le query si espande orizzontalmente con K8s. Con l'aumento del carico di query, K8s può distribuire più istanze Milvus per gestire l'aumento delle query di ricerca per similarità, garantendo risposte a bassa latenza anche in presenza di carichi elevati.</p>
<h2 id="Prerequisites--Setting-Up-K8s" class="common-anchor-header">Prerequisiti e impostazione di K8s<button data-href="#Prerequisites--Setting-Up-K8s" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><ul>
<li><p><strong>Docker</strong> - Assicurarsi che Docker sia installato sul sistema.</p></li>
<li><p><strong>Kubernetes</strong> - Preparare un cluster Kubernetes. È possibile utilizzare <code translate="no">minikube</code> per lo sviluppo locale o il servizio Kubernetes di un provider cloud per gli ambienti di produzione.</p></li>
<li><p><strong>Helm</strong> - Installate Helm, un gestore di pacchetti per Kubernetes, per aiutarvi a gestire le applicazioni Kubernetes; potete consultare la nostra documentazione per vedere come farlo <a href="https://milvus.io/docs/install_cluster-helm.md">https://milvus.io/docs/install_cluster-helm.md</a>.</p></li>
<li><p><strong>Kubectl</strong> - Installate <code translate="no">kubectl</code>, uno strumento a riga di comando per interagire con i cluster Kubernetes, per distribuire applicazioni, ispezionare e gestire le risorse del cluster e visualizzare i log.</p></li>
</ul>
<h3 id="Setting-Up-K8s" class="common-anchor-header">Impostazione di K8s</h3><p>Dopo aver installato tutto il necessario per eseguire un cluster K8s e se si è utilizzato <code translate="no">minikube</code>, avviare il cluster con:</p>
<pre><code translate="no">minikube start
<button class="copy-code-btn"></button></code></pre>
<p>Controllare lo stato del cluster K8s con:</p>
<pre><code translate="no">kubectl cluster-info
<button class="copy-code-btn"></button></code></pre>
<h3 id="Deploying-Milvus-on-K8s" class="common-anchor-header">Distribuzione di Milvus su K8s</h3><p>Per questa distribuzione, sceglieremo Milvus in modalità cluster per sfruttare tutte le sue capacità distribuite. Utilizzeremo Helm per semplificare il processo di installazione.</p>
<p><strong>1. Comando di installazione di Helm</strong></p>
<pre><code translate="no">helm install my-milvus milvus/milvus --<span class="hljs-built_in">set</span> pulsar.enabled=<span class="hljs-literal">false</span> --<span class="hljs-built_in">set</span> kafka.enabled=<span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Questo comando installa Milvus sul cluster K8s con Kafka abilitato e Pulsar disabilitato. Kafka funge da sistema di messaggistica all'interno di Milvus, gestendo lo streaming dei dati tra i diversi componenti. La disabilitazione di Pulsar e l'abilitazione di Kafka adattano la distribuzione alle nostre preferenze e ai nostri requisiti specifici di messaggistica.</p>
<p><strong>2. Inoltro delle porte</strong></p>
<p>Per accedere a Milvus dalla propria macchina locale, creare un port forward: <code translate="no">kubectl port-forward svc/my-milvus 27017:19530</code>.</p>
<p>Questo comando mappa la porta <code translate="no">19530</code> dal servizio Milvus <code translate="no">svc/my-milvus</code> alla stessa porta sul computer locale, consentendo di connettersi a Milvus con gli strumenti locali. Se si lascia la porta locale non specificata (come in <code translate="no">:19530</code>), K8s assegnerà una porta disponibile, rendendola dinamica. Se si sceglie questo metodo, assicurarsi di annotare la porta locale assegnata.</p>
<p><strong>3. Verifica della distribuzione:</strong></p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods 

NAME                                    READY   STATUS    RESTARTS   AGE
my-milvus-datacoord<span class="hljs-number">-595b</span>996bd4-zprpd    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-datanode-d9d555785<span class="hljs-number">-47</span>nkt      <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-etcd<span class="hljs-number">-0</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">84</span>m
my-milvus-etcd<span class="hljs-number">-1</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-etcd<span class="hljs-number">-2</span>                        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-indexcoord<span class="hljs-number">-65b</span>c68968c<span class="hljs-number">-6</span>jg6q   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-indexnode<span class="hljs-number">-54586f</span>55d-z9vx4     <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-kafka<span class="hljs-number">-2</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-minio<span class="hljs-number">-0</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-1</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-2</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-minio<span class="hljs-number">-3</span>                       <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">96</span>m
my-milvus-proxy<span class="hljs-number">-76b</span>b7d497f-sqwvd        <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-querycoord<span class="hljs-number">-6f</span>4c7b7598-b6twj   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-querynode<span class="hljs-number">-677b</span>df485b-ktc6m    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-rootcoord<span class="hljs-number">-7498f</span>ddfd8-v5zw8    <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-0</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-1</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
my-milvus-zookeeper<span class="hljs-number">-2</span>                   <span class="hljs-number">1</span>/<span class="hljs-number">1</span>     Running   <span class="hljs-number">0</span>          <span class="hljs-number">85</span>m
<button class="copy-code-btn"></button></code></pre>
<p>Dovreste vedere un elenco di pod simile all'output precedente, tutti in stato di esecuzione. Questo indica che il cluster Milvus è operativo. In particolare, cercate il valore 1/1 nella colonna <code translate="no">READY</code>, che indica che ogni pod è completamente pronto e funzionante. Se qualche pod non è in esecuzione, potrebbe essere necessario indagare ulteriormente per garantire il successo della distribuzione.</p>
<p>Con il cluster Milvus distribuito e tutti i componenti confermati in esecuzione, si è ora pronti a procedere all'ingestione e all'indicizzazione dei dati. Questo comporta la connessione all'istanza Milvus, la creazione di raccolte e l'inserimento di vettori per la ricerca e il recupero.</p>
<h2 id="Data-Ingestion-and-Indexing" class="common-anchor-header">Ingestione e indicizzazione dei dati<button data-href="#Data-Ingestion-and-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Per iniziare a ingerire e indicizzare i dati nel nostro cluster Milvus, utilizzeremo l'SDK pymilvus. Esistono due opzioni di installazione:</p>
<ul>
<li><p>SDK di base: <code translate="no">pip install pymilvus</code></p></li>
<li><p>Per le incorporazioni di testo e i modelli avanzati: <code translate="no">pip install pymilvus[model]</code></p></li>
</ul>
<p>Per inserire i dati nel nostro cluster, utilizzeremo <code translate="no">pymilvus</code>, è possibile installare l'SDK solo con <code translate="no">pip install pymilvus</code> oppure, se si desidera estrarre rich text embeddings, è possibile utilizzare anche <code translate="no">PyMilvus Models</code> installando <code translate="no">pip install pymilvus[model]</code>.</p>
<h3 id="Connecting-and-Creating-a-Collection" class="common-anchor-header">Connessione e creazione di una raccolta:</h3><p>Per prima cosa, collegarsi all'istanza di Milvus utilizzando la porta inoltrata in precedenza. Assicurarsi che l'URI corrisponda alla porta locale assegnata da K8s:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
        uri=<span class="hljs-string">&quot;http://127.0.0.1:52070&quot;</span>,
    )

client.<span class="hljs-title function_">create_collection</span>(collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>, dimension=<span class="hljs-number">5</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Il parametro <code translate="no">dimension=5</code> definisce la dimensione del vettore per questa raccolta, essenziale per le funzionalità di ricerca vettoriale.</p>
<h3 id="Insert-Data" class="common-anchor-header">Inserire i dati</h3><p>Ecco come inserire un primo insieme di dati, dove ogni vettore rappresenta un elemento e il campo colore aggiunge un attributo descrittivo:</p>
<pre><code translate="no">data=[
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">0</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.3580376395471989</span>, -<span class="hljs-number">0.6023495712049978</span>, <span class="hljs-number">0.18414012509913835</span>, -<span class="hljs-number">0.26286205330961354</span>, <span class="hljs-number">0.9029438446296592</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;pink_8682&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.19886812562848388</span>, <span class="hljs-number">0.06023560599112088</span>, <span class="hljs-number">0.6976963061752597</span>, <span class="hljs-number">0.2614474506242501</span>, <span class="hljs-number">0.838729485096104</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_7025&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.43742130801983836</span>, -<span class="hljs-number">0.5597502546264526</span>, <span class="hljs-number">0.6457887650909682</span>, <span class="hljs-number">0.7894058910881185</span>, <span class="hljs-number">0.20785793220625592</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;orange_6781&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.3172005263489739</span>, <span class="hljs-number">0.9719044792798428</span>, -<span class="hljs-number">0.36981146090600725</span>, -<span class="hljs-number">0.4860894583077995</span>, <span class="hljs-number">0.95791889146345</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;pink_9298&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.4452349528804562</span>, -<span class="hljs-number">0.8757026943054742</span>, <span class="hljs-number">0.8220779437047674</span>, <span class="hljs-number">0.46406290649483184</span>, <span class="hljs-number">0.30337481143159106</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_4794&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">5</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.985825131989184</span>, -<span class="hljs-number">0.8144651566660419</span>, <span class="hljs-number">0.6299267002202009</span>, <span class="hljs-number">0.1206906911183383</span>, -<span class="hljs-number">0.1446277761879955</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;yellow_4222&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">6</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.8371977790571115</span>, -<span class="hljs-number">0.015764369584852833</span>, -<span class="hljs-number">0.31062937026679327</span>, -<span class="hljs-number">0.562666951622192</span>, -<span class="hljs-number">0.8984947637863987</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;red_9392&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">7</span>, <span class="hljs-string">&quot;vector&quot;</span>: [-<span class="hljs-number">0.33445148015177995</span>, -<span class="hljs-number">0.2567135004164067</span>, <span class="hljs-number">0.8987539745369246</span>, <span class="hljs-number">0.9402995886420709</span>, <span class="hljs-number">0.5378064918413052</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;grey_8510&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">8</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.39524717779832685</span>, <span class="hljs-number">0.4000257286739164</span>, -<span class="hljs-number">0.5890507376891594</span>, -<span class="hljs-number">0.8650502298996872</span>, -<span class="hljs-number">0.6140360785406336</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;white_9381&quot;</span>},
    {<span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">9</span>, <span class="hljs-string">&quot;vector&quot;</span>: [<span class="hljs-number">0.5718280481994695</span>, <span class="hljs-number">0.24070317428066512</span>, -<span class="hljs-number">0.3737913482606834</span>, -<span class="hljs-number">0.06726932177492717</span>, -<span class="hljs-number">0.6980531615588608</span>], <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">&quot;purple_4976&quot;</span>}
]

res = client.insert(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,
    data=data
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<p>Il codice fornito presuppone che sia stata creata una collezione nella modalità di impostazione rapida. Come mostrato nel codice precedente,</p>
<p>I dati da inserire sono organizzati in un elenco di dizionari, dove ogni dizionario rappresenta un record di dati, definito entità.</p>
<p>Ogni dizionario contiene un campo non definito da schemi, chiamato colore.</p>
<p>Ogni dizionario contiene le chiavi corrispondenti sia ai campi predefiniti che a quelli dinamici.</p>
<h3 id="Insert-Even-More-Data" class="common-anchor-header">Inserire ancora più dati</h3><pre><code translate="no">colors = [<span class="hljs-string">&quot;green&quot;</span>, <span class="hljs-string">&quot;blue&quot;</span>, <span class="hljs-string">&quot;yellow&quot;</span>, <span class="hljs-string">&quot;red&quot;</span>, <span class="hljs-string">&quot;black&quot;</span>, <span class="hljs-string">&quot;white&quot;</span>, <span class="hljs-string">&quot;purple&quot;</span>, <span class="hljs-string">&quot;pink&quot;</span>, <span class="hljs-string">&quot;orange&quot;</span>, <span class="hljs-string">&quot;brown&quot;</span>, <span class="hljs-string">&quot;grey&quot;</span>]
data = [ {
    <span class="hljs-string">&quot;id&quot;</span>: i, 
    <span class="hljs-string">&quot;vector&quot;</span>: [ random.uniform(-<span class="hljs-number">1</span>, <span class="hljs-number">1</span>) <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">5</span>) ], 
    <span class="hljs-string">&quot;color&quot;</span>: <span class="hljs-string">f&quot;<span class="hljs-subst">{random.choice(colors)}</span>_<span class="hljs-subst">{<span class="hljs-built_in">str</span>(random.randint(<span class="hljs-number">1000</span>, <span class="hljs-number">9999</span>))}</span>&quot;</span> 
} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1000</span>) ]

res = client.insert(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,
    data=data[<span class="hljs-number">10</span>:]
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Similarity-Search" class="common-anchor-header">Ricerca per somiglianza<button data-href="#Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver popolato la collezione, è possibile eseguire una ricerca di somiglianza per trovare vettori vicini a un vettore di query. Il valore della variabile query_vectors è un elenco contenente un sottoelenco di float. Il sottoelenco rappresenta un incorporamento vettoriale di 5 dimensioni.</p>
<pre><code translate="no">query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

res = client.search(
    collection_name=<span class="hljs-string">&quot;quick_setup&quot;</span>,     <span class="hljs-comment"># target collection</span>
    data=query_vectors,                <span class="hljs-comment"># query vectors</span>
    <span class="hljs-built_in">limit</span>=3,                           <span class="hljs-comment"># number of returned entities</span>
)

<span class="hljs-built_in">print</span>(res)
<button class="copy-code-btn"></button></code></pre>
<p>Questa query cerca i 3 vettori più simili al nostro vettore di interrogazione, dimostrando le potenti capacità di ricerca di Milvus.</p>
<h2 id="Uninstall-Milvus-from-K8s" class="common-anchor-header">Disinstallare Milvus da K8s<button data-href="#Uninstall-Milvus-from-K8s" class="anchor-icon" translate="no">
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
    </button></h2><p>Una volta terminato questo tutorial, potete disinstallare Milvus dal vostro cluster K8s con:<code translate="no">helm uninstall my-milvus</code>.</p>
<p>Questo comando rimuoverà tutti i componenti di Milvus distribuiti nella release <code translate="no">my-milvus</code>, liberando le risorse del cluster.</p>
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
    </button></h2><ul>
<li><p>La distribuzione di Milvus su un cluster Kubernetes dimostra la scalabilità e la flessibilità dei database vettoriali nella gestione dei carichi di lavoro di AI e apprendimento automatico. Con questo tutorial si sono apprese le basi della configurazione di Milvus con Helm, della creazione di una collezione e dell'esecuzione di ingestioni di dati e ricerche di similarità.</p></li>
<li><p>L'installazione di Milvus su un cluster Kubernetes con Helm dovrebbe essere semplice. Per approfondire la scalabilità dei cluster Milvus per grandi insiemi di dati o carichi di lavoro più intensivi, la nostra documentazione offre una guida dettagliata <a href="https://milvus.io/docs/scaleout.md">https://milvus.io/docs/scaleout.md</a>.</p></li>
</ul>
<p>Sentitevi liberi di controllare il codice su <a href="https://github.com/stephen37/K8s-tutorial-milvus">Github</a>, di provare <a href="https://github.com/milvus-io/milvus">Milvus</a>, di sperimentare diverse configurazioni e casi d'uso e di condividere le vostre esperienze con la comunità unendovi al nostro <a href="https://discord.gg/FG6hMJStWu">Discord</a>.</p>
