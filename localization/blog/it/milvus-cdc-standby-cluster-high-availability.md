---
id: milvus-cdc-standby-cluster-high-availability.md
title: >-
  Alta disponibilità del database Vector: come creare un cluster standby Milvus
  con CDC
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
  Imparate a costruire un database vettoriale ad alta disponibilità con Milvus
  CDC. Guida passo-passo alla replica primaria-standby, al failover e al DR di
  produzione.
origin: 'https://milvus.io/blog/milvus-cdc-standby-cluster-high-availability.md'
---
<p>Ogni database di produzione ha bisogno di un piano per quando le cose vanno male. I database relazionali dispongono da decenni di WAL shipping, replica binlog e failover automatico. Ma i <a href="https://zilliz.com/learn/what-is-a-vector-database">database vettoriali</a>, nonostante siano diventati l'infrastruttura principale per le applicazioni di intelligenza artificiale, stanno ancora recuperando terreno su questo fronte. La maggior parte offre al massimo una ridondanza a livello di nodo. Se un intero cluster va in tilt, è necessario ripristinare i backup e ricostruire <a href="https://zilliz.com/learn/vector-index">gli indici vettoriali</a> da zero, un processo che può richiedere ore e migliaia di euro di calcolo, perché rigenerare gli <a href="https://zilliz.com/glossary/vector-embeddings">embeddings</a> attraverso la pipeline di ML non è economico.</p>
<p><a href="https://milvus.io/">Milvus</a> adotta un approccio diverso. Offre un'alta disponibilità stratificata: repliche a livello di nodo per un failover rapido all'interno di un cluster, repliche basate su CDC per la protezione a livello di cluster e tra le regioni, e backup per il ripristino della rete di sicurezza. Questo modello a livelli è una pratica standard nei database tradizionali, ma Milvus è il primo grande database vettoriale ad applicarlo ai carichi di lavoro vettoriali.</p>
<p>Questa guida tratta due aspetti: le strategie di alta disponibilità disponibili per i database vettoriali (in modo da poter valutare cosa significhi effettivamente "pronto per la produzione") e un'esercitazione pratica per impostare la replica primaria-standby di Milvus CDC da zero.</p>
<blockquote>
<p>Questa è la <strong>parte 1</strong> di una serie:</p>
<ul>
<li><strong>Parte 1</strong> (questo articolo): Impostazione della replica primary-standby su nuovi cluster</li>
<li><strong>Parte 2</strong>: Aggiunta di CDC a un cluster esistente che ha già dei dati, utilizzando <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a></li>
<li><strong>Parte 3</strong>: Gestire il failover - promuovere lo standby quando il primario si guasta</li>
</ul>
</blockquote>
<h2 id="Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="common-anchor-header">Perché l'alta disponibilità è più importante per i database vettoriali?<button data-href="#Why-Does-High-Availability-Matter-More-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando un database SQL tradizionale si guasta, si perde l'accesso ai record strutturati, ma i dati stessi possono essere reimportati da fonti a monte. Quando un database vettoriale va in tilt, il recupero è fondamentalmente più difficile.</p>
<p>I database vettoriali memorizzano <a href="https://zilliz.com/glossary/vector-embeddings">gli embeddings</a>, rappresentazioni numeriche dense generate dai modelli di ML. Ricostruirli significa rieseguire l'intero set di dati attraverso la pipeline di embedding: caricare i documenti grezzi, suddividerli, richiamare un <a href="https://zilliz.com/ai-models">modello di embedding</a> e reindicizzare tutto. Per un set di dati con centinaia di milioni di vettori, questa operazione può richiedere giorni e costare migliaia di dollari in calcoli GPU.</p>
<p>Nel frattempo, i sistemi che dipendono dalla <a href="https://zilliz.com/learn/what-is-vector-search">ricerca vettoriale</a> sono spesso in difficoltà:</p>
<ul>
<li>Le<strong>pipeline<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a></strong> che alimentano i chatbot e le ricerche rivolte ai clienti: se il database dei vettori non funziona, il recupero si interrompe e l'intelligenza artificiale restituisce risposte generiche o allucinate.</li>
<li>I<strong>motori di raccomandazione</strong> che forniscono suggerimenti di prodotti o contenuti in tempo reale: i tempi di inattività significano mancati guadagni.</li>
<li>Sistemi di<strong>rilevamento delle frodi e di monitoraggio delle anomalie</strong> che si basano sulla <a href="https://zilliz.com/glossary/similarity-search">ricerca per similarità</a> per segnalare attività sospette: una lacuna nella copertura crea una finestra di vulnerabilità.</li>
<li><strong>Sistemi di agenti autonomi</strong> che utilizzano archivi vettoriali per il recupero della memoria e degli strumenti: gli agenti falliscono o vanno in loop senza la loro base di conoscenze.</li>
</ul>
<p>Se state valutando i database di vettori per uno di questi casi d'uso, l'alta disponibilità non è una caratteristica da controllare in un secondo momento. Dovrebbe essere una delle prime cose da controllare.</p>
<h2 id="What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="common-anchor-header">Come si presenta l'alta disponibilità di livello produttivo per un database vettoriale?<button data-href="#What-Does-Production-Grade-HA-Look-Like-for-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Non tutta l'alta disponibilità è uguale. Un database vettoriale che gestisce solo i guasti dei nodi all'interno di un singolo cluster non è "altamente disponibile" come richiede un sistema di produzione. La vera HA deve coprire tre livelli:</p>
<table>
<thead>
<tr><th>Livello</th><th>Da cosa protegge</th><th>Come funziona</th><th>Tempo di recupero</th><th>Perdita di dati</th></tr>
</thead>
<tbody>
<tr><td><strong>A livello di nodo</strong> (multi-replica)</td><td>Arresto anomalo di un singolo nodo, guasto hardware, eliminazione di OOM, guasto AZ</td><td>Copia gli stessi <a href="https://milvus.io/docs/glossary.md">segmenti di dati</a> su più nodi; gli altri nodi assorbono il carico</td><td>istantaneo</td><td>Zero</td></tr>
<tr><td><strong>A livello di cluster</strong> (replica CDC)</td><td>L'intero cluster va in tilt - rollout di K8s errato, cancellazione dello spazio dei nomi, corruzione dello storage</td><td>Trasmette ogni scrittura a un cluster di standby tramite il <a href="https://milvus.io/docs/four_layers.md">registro Write-Ahead</a>; il cluster di standby è sempre indietro di pochi secondi.</td><td>Minuti</td><td>Secondi</td></tr>
<tr><td><strong>Rete di sicurezza</strong> (backup periodico)</td><td>Corruzione catastrofica dei dati, ransomware, errore umano che si propaga attraverso la replica</td><td>Esegue istantanee periodiche e le archivia in una posizione separata.</td><td>Ore</td><td>Ore (dall'ultimo backup)</td></tr>
</tbody>
</table>
<p>Questi livelli sono complementari, non alternativi. Un'implementazione di produzione dovrebbe sovrapporli:</p>
<ol>
<li><strong><a href="https://milvus.io/docs/replica.md">Multi-replica</a> prima</strong> - gestisce i guasti più comuni (crash dei nodi, guasti AZ) con zero tempi di inattività e zero perdite di dati.</li>
<li><strong><a href="https://milvus.io/docs/milvus-cdc-overview.md">CDC</a> dopo</strong> - protegge dai guasti che la multireplica non è in grado di gestire: interruzioni dell'intero cluster, errori umani catastrofici. Il cluster di standby si trova in un dominio di guasti diverso.</li>
<li><strong>I<a href="https://milvus.io/docs/milvus_backup_overview.md">backup periodici</a></strong> sono<strong>sempre</strong> la vostra rete di sicurezza di ultima istanza. Nemmeno il CDC può salvarvi se i dati corrotti si replicano sullo standby prima che voi li prendiate.</li>
</ol>
<p>Quando valutate i database vettoriali, chiedetevi: quale di questi tre livelli supporta effettivamente il prodotto? La maggior parte dei database vettoriali oggi offre solo il primo. Milvus li supporta tutti e tre, e il CDC è una funzione integrata, non un componente aggiuntivo di terze parti.</p>
<h2 id="What-Is-Milvus-CDC-and-How-Does-It-Work" class="common-anchor-header">Cos'è e come funziona il CDC di Milvus?<button data-href="#What-Is-Milvus-CDC-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus CDC (Change Data Capture)</strong> è una funzione di replica integrata che legge il <a href="https://milvus.io/docs/four_layers.md">Write-Ahead Log (WAL)</a> del cluster primario e trasmette ogni voce a un cluster standby separato. Lo standby replica le voci e si ritrova con gli stessi dati, in genere con qualche secondo di ritardo.</p>
<p>Lo schema è ben consolidato nel mondo dei database. MySQL ha la replica binlog. PostgreSQL ha la spedizione WAL. MongoDB ha una replica basata su oplog. Si tratta di tecniche collaudate che hanno permesso ai database relazionali e documentali di funzionare in produzione per decenni. Milvus applica lo stesso approccio ai carichi di lavoro vettoriali: è il primo grande <a href="https://zilliz.com/learn/what-is-a-vector-database">database vettoriale</a> a offrire la replica basata su WAL come funzionalità integrata.</p>
<p>Tre proprietà rendono il CDC adatto al disaster recovery:</p>
<ul>
<li><strong>Sincronizzazione a bassa latenza.</strong> CDC esegue lo streaming delle operazioni nel momento in cui avvengono, non in batch programmati. In condizioni normali, lo standby rimane indietro di pochi secondi rispetto al primario.</li>
<li><strong>Replay ordinato.</strong> Le operazioni arrivano allo standby nello stesso ordine in cui sono state scritte. I dati rimangono coerenti senza riconciliazione.</li>
<li><strong>Recupero del checkpoint.</strong> Se il processo CDC si blocca o la rete cade, riprende dal punto in cui era stato interrotto. Nessun dato viene saltato o duplicato.</li>
</ul>
<h3 id="How-Does-the-CDC-Architecture-Work" class="common-anchor-header">Come funziona l'architettura CDC?</h3><p>Un'implementazione CDC è composta da tre componenti:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cdc_standby_cluster_high_availability_1_7c6e5baf76.png" alt="CDC architecture showing Source Cluster with Streaming Nodes and CDC Nodes consuming the WAL, replicating data to the Target Cluster's Proxy layer, which forwards DDL/DCL/DML operations to Streaming Nodes and appends to WAL" class="doc-image" id="cdc-architecture-showing-source-cluster-with-streaming-nodes-and-cdc-nodes-consuming-the-wal,-replicating-data-to-the-target-cluster's-proxy-layer,-which-forwards-ddl/dcl/dml-operations-to-streaming-nodes-and-appends-to-wal" />
   </span> <span class="img-wrapper"> <span>Architettura CDC che mostra il cluster di origine con i nodi di streaming e i nodi CDC che consumano il WAL, replicando i dati al livello Proxy del cluster di destinazione, che inoltra le operazioni DDL/DCL/DML ai nodi di streaming e le aggiunge al WAL</span> </span>.</p>
<table>
<thead>
<tr><th>Componente</th><th>Ruolo</th></tr>
</thead>
<tbody>
<tr><td><strong>Cluster primario</strong></td><td>L'<a href="https://milvus.io/docs/architecture_overview.md">istanza Milvus</a> di produzione. Tutte le letture e le scritture passano da qui. Ogni scrittura viene registrata nel WAL.</td></tr>
<tr><td><strong>Nodo CDC</strong></td><td>Un processo in background accanto al primario. Legge le voci del WAL e le inoltra allo standby. Viene eseguito indipendentemente dal percorso di lettura/scrittura, senza alcun impatto sulle prestazioni delle query o degli inserti.</td></tr>
<tr><td><strong>Cluster standby</strong></td><td>Un'istanza Milvus separata che riproduce le voci WAL inoltrate. Mantiene gli stessi dati del primario, con un ritardo di pochi secondi. Può servire query di lettura ma non accetta scritture.</td></tr>
</tbody>
</table>
<p>Il flusso: le scritture arrivano al primario → il nodo CDC le copia allo standby → lo standby le riproduce. Nient'altro parla con il percorso di scrittura dello standby. Se il primario si guasta, lo standby ha già quasi tutti i dati e può essere promosso.</p>
<h2 id="Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="common-anchor-header">Esercitazione: Impostazione di un cluster standby Milvus CDC<button data-href="#Tutorial-Setting-Up-a-Milvus-CDC-Standby-Cluster" class="anchor-icon" translate="no">
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
    </button></h2><p>Il resto dell'articolo è un'esercitazione pratica. Alla fine, avrete due cluster Milvus in funzione con una replica in tempo reale tra di loro.</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><p>Prima di iniziare:</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a> v2.6.6 o successivo.</strong> CDC richiede questa versione. Si consiglia l'ultima patch 2.6.x.</li>
<li><strong><a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Operator</a> v1.3.4 o successivo.</strong> Questa guida utilizza Operator per la gestione dei cluster su Kubernetes.</li>
<li><strong>Un cluster Kubernetes in esecuzione</strong> con <code translate="no">kubectl</code> e <code translate="no">helm</code> configurati.</li>
<li><strong>Python con <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a></strong> per la fase di configurazione della replica.</li>
</ul>
<p>Due limitazioni nella versione attuale:</p>
<table>
<thead>
<tr><th>Limitazione</th><th>Dettagli</th></tr>
</thead>
<tbody>
<tr><td>Singola replica CDC</td><td>Una sola replica CDC per cluster. CDC distribuito è previsto per una versione futura.</td></tr>
<tr><td>Nessun BulkInsert</td><td><a href="https://milvus.io/docs/import-data.md">BulkInsert</a> non è supportato quando CDC è abilitato. Anche questo è previsto per una release futura.</td></tr>
</tbody>
</table>
<h3 id="Step-1-Upgrade-the-Milvus-Operator" class="common-anchor-header">Passo 1: Aggiornare l'Operatore Milvus</h3><p>Aggiornare Milvus Operator alla versione v1.3.4 o successiva:</p>
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
<p>Verificare che il pod dell'operatore sia in funzione:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus-<span class="hljs-keyword">operator</span>
<span class="hljs-meta"># NAME                             READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># milvus-operator-9fc99f88-h2hwz   1/1     Running   0          54s</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Deploy-the-Primary-Cluster" class="common-anchor-header">Passo 2: Distribuzione del cluster primario</h3><p>Creare un file YAML per il cluster primario (sorgente). La sezione <code translate="no">cdc</code> sotto <code translate="no">components</code> indica all'Operatore di distribuire un nodo CDC accanto al cluster:</p>
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
<p>L'impostazione <code translate="no">msgStreamType: woodpecker</code> utilizza il <a href="https://milvus.io/docs/four_layers.md">WAL Woodpecker</a> integrato in Milvus invece di una coda di messaggi esterna come Kafka o Pulsar. Woodpecker è un log write-ahead cloud-native introdotto in Milvus 2.6 che elimina la necessità di un'infrastruttura di messaggistica esterna.</p>
<p>Applicare la configurazione:</p>
<pre><code translate="no">kubectl create namespace milvus
<span class="hljs-comment"># namespace/milvus created</span>
kubectl apply -f milvus_source_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/source-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Attendere che tutti i pod raggiungano lo stato Running. Confermare che il pod CDC è attivo:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># Look for source-cluster-milvus-cdc-xxx in Running state</span>
<span class="hljs-meta"># NAME                                                READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># source-cluster-milvus-cdc-66d64747bd-sckxj          1/1     Running   0          2m42s</span>
<span class="hljs-meta"># source-cluster-milvus-datanode-85f9f56fd-qgbzq       1/1     Running   0          2m42s</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Deploy-the-Standby-Cluster" class="common-anchor-header">Fase 3: Distribuzione del cluster standby</h3><p>Il cluster standby (di destinazione) utilizza la stessa versione di Milvus, ma non include un componente CDC: riceve solo i dati replicati:</p>
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
<p>Applicare:</p>
<pre><code translate="no">kubectl apply -f milvus_target_cluster.yaml
<span class="hljs-comment"># milvus.milvus.io/target-cluster created</span>
<button class="copy-code-btn"></button></code></pre>
<p>Verificare che tutti i pod siano in funzione:</p>
<pre><code translate="no">kubectl <span class="hljs-keyword">get</span> pods -n milvus
<span class="hljs-meta"># NAME                                                   READY   STATUS    RESTARTS   AGE</span>
<span class="hljs-meta"># ...</span>
<span class="hljs-meta"># target-cluster-milvus-datanode-7ffc8cdb6b-xhzcd        1/1     Running   0          104m</span>
<span class="hljs-meta"># target-cluster-milvus-mixcoord-8649b87c98-btk7m        1/1     Running   0          104m</span>
<span class="hljs-meta"># ...</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Configure-the-Replication-Relationship" class="common-anchor-header">Passo 4: Configurare la relazione di replica</h3><p>Con entrambi i cluster in esecuzione, configurare la topologia di replica usando Python con <a href="https://milvus.io/docs/install-pymilvus.md">pymilvus</a>.</p>
<p>Definire i dettagli di connessione del cluster e i nomi dei canali fisici (pchannel):</p>
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
<p>Creare la configurazione di replica:</p>
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
<p>Applicare a entrambi i cluster:</p>
<pre><code translate="no">from pymilvus <span class="hljs-keyword">import</span> MilvusClient

source_client = MilvusClient(uri=source_cluster_addr, token=source_cluster_token)
source_client.update_replicate_configuration(**config)
source_client.<span class="hljs-built_in">close</span>()

target_client = MilvusClient(uri=target_cluster_addr, token=target_cluster_token)
target_client.update_replicate_configuration(**config)
target_client.<span class="hljs-built_in">close</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Una volta che l'operazione è riuscita, le modifiche incrementali sul primario iniziano a essere replicate automaticamente sullo standby.</p>
<h3 id="Step-5-Verify-That-Replication-Works" class="common-anchor-header">Fase 5: Verifica del funzionamento della replica</h3><ol>
<li>Collegarsi al primario e <a href="https://milvus.io/docs/manage-collections.md">creare una raccolta</a>, <a href="https://milvus.io/docs/insert-update-delete.md">inserire alcuni vettori</a> e <a href="https://milvus.io/docs/load-and-release.md">caricarla</a>.</li>
<li>Eseguire una ricerca sul primario per confermare la presenza dei dati.</li>
<li>Collegarsi allo standby ed eseguire la stessa ricerca.</li>
<li>Se lo standby restituisce gli stessi risultati, la replica funziona.</li>
</ol>
<p>Il <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a> copre la creazione, l'inserimento e la ricerca delle collezioni, se avete bisogno di un riferimento.</p>
<h2 id="Running-CDC-in-Production" class="common-anchor-header">Esecuzione di CDC in produzione<button data-href="#Running-CDC-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>L'impostazione di CDC è la parte più semplice. Per mantenerlo affidabile nel tempo è necessario prestare attenzione ad alcune aree operative.</p>
<h3 id="Monitor-Replication-Lag" class="common-anchor-header">Monitorare il ritardo della replica</h3><p>Lo standby è sempre un po' in ritardo rispetto al primario: è una caratteristica intrinseca della replica asincrona. In condizioni di carico normale, il ritardo è di pochi secondi. Ma i picchi di scrittura, la congestione della rete o la pressione sulle risorse dello standby possono far crescere il ritardo.</p>
<p>Tracciate il ritardo come una metrica e fate degli avvisi su di esso. Un ritardo che cresce senza riprendersi di solito significa che il nodo CDC non riesce a tenere il passo con il throughput di scrittura. Controllate prima la larghezza di banda della rete tra i cluster, quindi valutate se lo standby ha bisogno di più risorse.</p>
<h3 id="Use-the-Standby-for-Read-Scaling" class="common-anchor-header">Usare lo standby per scalare la lettura</h3><p>Lo standby non è solo un backup freddo che rimane inattivo fino al momento del disastro. Accetta <a href="https://milvus.io/docs/single-vector-search.md">richieste di ricerca e di interrogazione</a> mentre la replica è attiva - solo le scritture sono bloccate. Questo apre la strada a utilizzi pratici:</p>
<ul>
<li>Indirizzare carichi di lavoro analitici o <a href="https://zilliz.com/glossary/similarity-search">di ricerca simili ai</a> batch verso lo standby.</li>
<li>Suddividere il traffico di lettura durante le ore di punta per ridurre la pressione sul primario.</li>
<li>Eseguire query costose (top-K di grandi dimensioni, ricerche filtrate su grandi collezioni) senza influire sulla latenza di scrittura della produzione.</li>
</ul>
<p>In questo modo l'infrastruttura di DR diventa una risorsa di prestazioni. Lo standby guadagna anche quando non c'è nulla di rotto.</p>
<h3 id="Size-the-Standby-Correctly" class="common-anchor-header">Dimensionare correttamente lo standby</h3><p>Lo standby riproduce ogni scrittura dal primario, quindi ha bisogno di risorse di calcolo e di memoria simili. Se gli si indirizzano anche le letture, bisogna tenere conto di questo carico aggiuntivo. I requisiti di storage sono identici: contiene gli stessi dati.</p>
<h3 id="Test-Failover-Before-You-Need-It" class="common-anchor-header">Testate il Failover prima che sia necessario</h3><p>Non aspettate un'interruzione reale per scoprire che il vostro processo di failover non funziona. Eseguite test periodici:</p>
<ol>
<li>Interrompere le scritture sul primario</li>
<li>Attendere che lo standby recuperi il ritardo (lag → 0).</li>
<li>Promuovere lo standby</li>
<li>Verificare che le query restituiscano i risultati attesi</li>
<li>Invertire il processo</li>
</ol>
<p>Misurare il tempo necessario per ogni fase e documentarlo. L'obiettivo è rendere il failover una procedura di routine con tempi noti, non un'improvvisazione stressante alle 3 del mattino. La terza parte di questa serie tratta in dettaglio il processo di failover.</p>
<h2 id="Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="common-anchor-header">Non volete gestire il CDC da soli? Zilliz Cloud se ne occupa<button data-href="#Dont-Want-to-Manage-CDC-Yourself-Zilliz-Cloud-Handles-It" class="anchor-icon" translate="no">
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
    </button></h2><p>L'impostazione e il funzionamento della replica CDC di Milvus sono potenti, ma comportano un sovraccarico operativo: si gestiscono due cluster, si monitora lo stato di salute della replica, si gestiscono i runbook di failover e si mantiene l'infrastruttura in tutte le regioni. Per i team che desiderano un HA di livello produttivo senza l'onere operativo, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) offre questa possibilità.</p>
<p><strong>Global Cluster</strong> è la caratteristica principale di Zilliz Cloud. Consente di gestire una distribuzione Milvus che abbraccia più regioni (Nord America, Europa, Asia-Pacifico e altro) come un unico cluster logico. Utilizza la stessa tecnologia di replica CDC/WAL descritta in questo articolo, ma completamente gestita:</p>
<table>
<thead>
<tr><th>Capacità</th><th>CDC autogestito (questo articolo)</th><th>Cluster globale Zilliz Cloud</th></tr>
</thead>
<tbody>
<tr><td><strong>Replica</strong></td><td>Configurazione e monitoraggio</td><td>Pipeline CDC automatizzata e asincrona</td></tr>
<tr><td><strong>Failover</strong></td><td>Runbook manuale</td><td>Automatizzato: nessuna modifica del codice, nessun aggiornamento delle stringhe di connessione</td></tr>
<tr><td><strong>Autoguarigione</strong></td><td>Si effettua un nuovo provisioning del cluster guasto</td><td>Automatico: rileva lo stato di stallo, esegue il reset e ricostruisce il cluster come un nuovo secondario.</td></tr>
<tr><td><strong>Cross-region</strong></td><td>Si distribuiscono e si gestiscono entrambi i cluster</td><td>Multiregione integrata con accesso in lettura locale</td></tr>
<tr><td><strong>RPO</strong></td><td>Secondi (dipende dal monitoraggio)</td><td>Secondi (non pianificati) / Zero (switchover pianificato)</td></tr>
<tr><td><strong>RTO</strong></td><td>Minuti (dipende dal runbook)</td><td>Minuti (automatizzato)</td></tr>
</tbody>
</table>
<p>Oltre al Global Cluster, il piano Business Critical include ulteriori funzionalità di DR:</p>
<ul>
<li><strong>Point-in-Time Recovery (PITR)</strong> - rollback di una raccolta in qualsiasi momento all'interno della finestra di conservazione, utile per il ripristino da cancellazioni accidentali o da corruzione dei dati che si replicano sullo standby.</li>
<li><strong>Backup interregionale</strong>: replica automatica e continua del backup verso una regione di destinazione. Il ripristino su nuovi cluster richiede pochi minuti.</li>
<li><strong>SLA di uptime del 99,99%</strong> - supportato da un'implementazione multi-AZ con più repliche.</li>
</ul>
<p>Se la ricerca vettoriale è in produzione e il DR è un requisito, vale la pena valutare Zilliz Cloud insieme all'approccio autogestito di Milvus. <a href="https://zilliz.com/contact-sales">Contattate il team di Zilliz</a> per maggiori dettagli.</p>
<h2 id="Whats-Next" class="common-anchor-header">Cosa c'è dopo<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo articolo ha trattato il panorama dell'HA per i database vettoriali e ha illustrato la costruzione di una coppia primario-standby da zero. Prossimamente:</p>
<ul>
<li><strong>Parte 2</strong>: Aggiunta di CDC a un cluster Milvus esistente che ha già dei dati, usando <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> per alimentare lo standby prima di abilitare la replica.</li>
<li><strong>Parte 3</strong>: Gestione del failover: promozione dello standby, reindirizzamento del traffico e ripristino del primario originale.</li>
</ul>
<p>Rimanete sintonizzati.</p>
<hr>
<p>Se state utilizzando <a href="https://milvus.io/">Milvus</a> in produzione e state pensando al disaster recovery, saremo lieti di aiutarvi:</p>
<ul>
<li>Unitevi alla <a href="https://slack.milvus.io/">comunità Slack di Milvus</a> per fare domande, condividere la vostra architettura HA e imparare da altri team che gestiscono Milvus su scala.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di 20 minuti di Milvus Office Hours</a> per illustrare la vostra configurazione di DR, sia che si tratti della configurazione del CDC, della pianificazione del failover o dell'implementazione multiregionale.</li>
<li>Se preferite saltare la configurazione dell'infrastruttura e passare direttamente all'HA pronto per la produzione, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) offre l'alta disponibilità interregionale grazie alla funzione Global Cluster, senza bisogno di configurare manualmente il CDC.</li>
</ul>
<hr>
<p>Alcune domande che sorgono quando i team iniziano a configurare l'alta disponibilità dei database vettoriali:</p>
<p><strong>D: Il CDC rallenta il cluster primario?</strong></p>
<p>No. Il nodo CDC legge i log WAL in modo asincrono, indipendentemente dal percorso di lettura/scrittura. Non compete con le query o gli inserti per le risorse del primario. Non si noterà alcuna differenza di prestazioni con CDC abilitato.</p>
<p><strong>D: CDC può replicare dati esistenti prima di essere abilitato?</strong></p>
<p>No, il CDC acquisisce solo le modifiche dal momento in cui è abilitato. Per portare i dati esistenti nello standby, utilizzare <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> per creare il seed dello standby, quindi abilitare CDC per la replica continua. La parte 2 di questa serie tratta questo flusso di lavoro.</p>
<p><strong>D: Ho ancora bisogno di CDC se ho già attivato la multi-replica?</strong></p>
<p>Proteggono da modalità di guasto diverse. <a href="https://milvus.io/docs/replica.md">Multi-replica</a> mantiene copie degli stessi <a href="https://milvus.io/docs/glossary.md">segmenti</a> tra i nodi di un cluster: ottimo per i guasti dei nodi, inutile quando l'intero cluster è andato (cattiva distribuzione, interruzione di AZ, eliminazione dello spazio dei nomi). CDC mantiene un cluster separato in un dominio di guasto diverso con dati quasi in tempo reale. Per qualsiasi cosa al di là di un ambiente di sviluppo, sono necessari entrambi.</p>
<p><strong>D: Come si colloca Milvus CDC rispetto alla replica di altri database vettoriali?</strong></p>
<p>La maggior parte dei database vettoriali oggi offre una ridondanza a livello di nodo (equivalente alla multi-replica), ma manca la replica a livello di cluster. Milvus è attualmente l'unico grande database vettoriale con una replica CDC integrata basata su WAL, lo stesso modello collaudato che i database relazionali come PostgreSQL e MySQL utilizzano da decenni. Se il failover tra cluster o tra regioni è un requisito, questo è un importante elemento di differenziazione da valutare.</p>
